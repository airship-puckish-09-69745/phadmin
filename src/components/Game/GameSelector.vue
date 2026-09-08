<template>
  <div class="game-selector">
    <el-form-item :label="label" required>
      <el-input
        v-model="filterText"
        placeholder="输入关键字搜索游戏"
        style="max-width: 300px; margin-bottom: 8px"
      />
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        highlight-current
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-expanded-keys="expandedKeys"
        :auto-expand-parent="false"
        @check="handleCheck"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
      />
      <div style="margin-top: 10px">
        <el-button size="small" type="primary" icon="el-icon-sort" @click="showGamesSortDialog">
          给选中游戏排序
        </el-button>
        <span style="margin-left: 10px; color: #999; font-size: 12px">
          已选中 {{ (internalValue || []).length }} 个游戏
        </span>
      </div>
    </el-form-item>

    <!-- 游戏排序弹窗 -->
    <el-dialog
      title="给选中游戏排序"
      :visible.sync="gamesSortDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
    >
      <div style="margin-bottom: 10px; color: #909399; font-size: 13px">
        提示：排序编号越小，游戏在活动中的展示顺序越靠前
      </div>
      <el-table :data="gamesSorted" border stripe max-height="400">
        <el-table-column prop="gameId" label="游戏ID" width="100" align="center" />
        <el-table-column prop="name" label="游戏名称" min-width="150" />
        <el-table-column prop="orderNo" label="排序编号" width="150" align="center">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.orderNo"
              type="number"
              :min="1"
              :max="gamesSorted.length"
              size="small"
              style="width: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="gamesSortDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGamesSort">保存排序</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'

export default {
  name: 'GameSelector',
  props: {
    // v-model绑定值：游戏ID数组，如 [1, 2, 3]
    value: {
      type: Array,
      default: () => []
    },
    // 显示的标签文本
    label: {
      type: String,
      default: '参与活动游戏：'
    },
    // 游戏类别ID数组，如 [1, 2, 3] 对应 Slot, Poker, Casino
    categoryIds: {
      type: Array,
      default: () => [2] // 默认只显示 Poker
    },
    // 指定需要展示的游戏ID
    gameIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      allTreeData: [],
      defaultProps: { label: 'label', children: 'children', disabled: 'disabled' },
      filterGameIds: [2031, 10002], // 过滤掉的游戏ID
      expandedKeys: [], // 手动管理展开的节点key

      // 游戏排序弹窗
      gamesSortDialogVisible: false,
      gamesSorted: []
    }
  },
  computed: {
    // v-model的计算属性
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedKeys(val || [])
            this.$nextTick(() => {
              this.restoreExpandedState()
            })
          }
        })
      }
    },
    categoryIds: {
      immediate: true,
      handler() {
        this.getGameAll()
      }
    },
    filterText(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val)
        if (!val) {
          // 搜索清空时，恢复用户手动展开的状态
          this.$nextTick(() => {
            this.restoreExpandedState()
          })
        }
      }
    }
  },
  methods: {
    // 游戏树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 处理树的选中事件（修复bug：使用check事件代替check-change）
    handleCheck(data, checkedInfo) {
      // checkedInfo.checkedKeys 包含所有选中节点的key
      // 过滤掉分类节点（id以'p-'开头的）
      const gameIds = checkedInfo.checkedKeys.filter(id => {
        return !(typeof id === 'string' && id.startsWith('p-'))
      })

      this.internalValue = gameIds
    },

    // 记录节点展开
    handleNodeExpand(data) {
      if (!this.expandedKeys.includes(data.id)) {
        this.expandedKeys.push(data.id)
      }
    },

    // 记录节点收起
    handleNodeCollapse(data) {
      const index = this.expandedKeys.indexOf(data.id)
      if (index > -1) {
        this.expandedKeys.splice(index, 1)
      }
    },

    // 恢复展开状态（在setCheckedKeys等操作后调用）
    restoreExpandedState() {
      if (!this.$refs.tree) return
      const tree = this.$refs.tree
      const store = tree.store
      // 遍历所有节点，只展开在expandedKeys中记录的节点
      const traverse = (nodes) => {
        nodes.forEach(node => {
          if (this.expandedKeys.includes(node.data.id)) {
            node.expanded = true
          } else {
            node.expanded = false
          }
          if (node.childNodes && node.childNodes.length) {
            traverse(node.childNodes)
          }
        })
      }
      if (store && store.root && store.root.childNodes) {
        traverse(store.root.childNodes)
      }
    },

    /**
     * 获取所有游戏列表并构建树结构
     *
     * 过滤规则：
     * 1. ShowDatacenter 必须为 1
     * 2. Gid 不能在 filterGameIds 中
     * 3. CategoryID 必须在 categoryIds 中
     * 4. 如果指定了 gameIds，则只展示 gameIds 中的游戏
     */
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}

          // 按游戏类别分组
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]

            // 过滤掉不展示的数据中心游戏
            if (obj.ShowDatacenter !== 1) {
              continue
            }

            // 过滤指定的游戏ID
            if (this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }

            // 只保留指定的 CategoryID
            if (!this.categoryIds.includes(obj.CategoryID)) {
              continue
            }

            // 如果指定了 gameIds，则只展示指定的游戏
            if (this.gameIds.length > 0 && !this.gameIds.includes(obj.Gid)) {
              continue
            }

            const game = {
              Gid: obj.Gid,
              Name: obj.Name,
              Description: obj.Description
            }

            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          // 游戏类别
          const categories = {
            1: 'Slot',
            2: 'Poker',
            3: 'Casino'
          }

          // 构建游戏树结构
          const builtTree = []

          for (const key in data) {
            const games = data[key]

            const cty = {
              id: 'p-' + key,
              label: categories[key],
              children: []
            }

            for (let i = 0; i < games.length; i++) {
              const game = games[i]

              cty.children.push({
                id: game.Gid,
                label: game.Name
              })
            }

            builtTree.push(cty)
          }

          // 保存完整树数据
          this.allTreeData = builtTree

          // 保存当前展示的树数据
          this.treeData = builtTree

          // 设置已选中的游戏
          this.$nextTick(() => {
            if (this.$refs.tree && this.internalValue) {
              this.$refs.tree.setCheckedKeys(this.internalValue)

              this.$nextTick(() => {
                this.restoreExpandedState()
              })
            }
          })
        }
      })
    },

    // 打开游戏排序弹窗
    showGamesSortDialog() {
      if (!this.internalValue || this.internalValue.length === 0) {
        return Message.warning('请先选择参与活动的游戏')
      }
      // 根据当前选中的游戏ID，构建排序列表
      this.gamesSorted = this.internalValue.map((gameId, index) => {
        return {
          gameId: gameId,
          name: this.getGameNameById(gameId),
          orderNo: index + 1
        }
      })

      this.gamesSortDialogVisible = true
    },

    // 根据游戏ID获取游戏名称
    getGameNameById(gameId) {
      const game = this.allTreeData
        .filter(cty => cty.children && Array.isArray(cty.children))
        .flatMap(cty => cty.children)
        .find(g => g.id === gameId)
      return game ? game.label : `Unknown Game (${gameId})`
    },

    // 保存游戏排序
    saveGamesSort() {
      // 验证排序编号
      const orderNos = this.gamesSorted.map(g => g.orderNo)
      const hasInvalid = orderNos.some(no => {
        return !Number.isInteger(no) || no < 1 || no > this.gamesSorted.length
      })
      if (hasInvalid) {
        return Message.error(`排序编号必须是1到${this.gamesSorted.length}之间的整数`)
      }

      // 按用户设置的 orderNo 排序，然后提取 gameId
      const sortedGames = this.gamesSorted.slice().sort((a, b) => a.orderNo - b.orderNo)

      // 重新赋值 orderNo 为 1, 2, 3, ...
      sortedGames.forEach((game, index) => {
        game.orderNo = index + 1
      })

      // 更新选中的游戏顺序
      this.internalValue = sortedGames.map(game => game.gameId)

      this.gamesSortDialogVisible = false
      Message.success('游戏排序已更新')
    }
  }
}
</script>

<style scoped>
.game-selector {
  width: 100%;
}
</style>
