<template>
  <el-dialog
    :title="isEdit ? '编辑活动配置' : '新增活动配置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基础配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.activity.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activity.name" placeholder="请输入活动名称" style="max-width: 300px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间：" required>
                <el-date-picker v-model="item.activity.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width:  200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间：" required>
                <el-date-picker v-model="item.activity.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="返水奖励比例：" required>
                <el-input v-model="item.extend.rewardRatio" placeholder="返水奖励比例" style="max-width: 200px">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="玩家个人奖励上限：" required>
                <el-input v-model.number="item.extend.maxRewardAmount" placeholder="玩家个人奖励上限金额" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="玩家最小总投注金额：" required>
                <el-input v-model.number="item.extend.minTotalBetAmount" placeholder="玩家最总小投注金额" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 参与活动游戏选择 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="参与活动游戏：" required>
                <el-input v-model="filterText" placeholder="输入关键字搜索游戏" style="max-width: 300px; margin-bottom: 8px" />
                <el-tree
                  ref="tree"
                  :data="treeData"
                  show-checkbox
                  node-key="id"
                  highlight-current
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  :default-expanded-keys="[]"
                  @check-change="handleCheckChange"
                />
                <div style="margin-top: 10px">
                  <el-button size="small" type="primary" icon="el-icon-sort" @click="showGamesSortDialog">
                    给选中游戏排序
                  </el-button>
                  <span style="margin-left: 10px; color: #999; font-size: 12px">
                    已选中 {{ (item.activity.gameIdList || []).length }} 个游戏
                  </span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="白名单配置" name="whitelist">
        <el-form label-width="180px" size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="item.activity.whitelist.siteIdList" multiple placeholder="请选择" style="width: 100%; max-width: 300px" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Uid白名单：">
                <el-input v-model="item.activity.whitelist.uidList" placeholder="输入Uid白名单，多个Uid用逗号分隔" style="width: 100%; max-width: 600px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

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

    <!-- 底部按钮 -->
    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleSave">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'

const ACTIVITY_ID = 23

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activity: {
      name: '',
      activityId: ACTIVITY_ID,
      isOpen: true,
      startTime: Date.now(),
      endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
      gameIdList: [],
      whitelist: {
        siteIdList: [],
        uidList: ''
      }
    },
    extend: {
      rewardRatio: 0,
      maxRewardAmount: 10,
      minTotalBetAmount: 0,
    }
  }
}

export default {
  name: "UpdateForm",
  components: { SiteSelect },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      item: newItem(),
      dialogVisible: false,
      activeTab: 'activity',
      gamesSorted: [],
      gamesSortDialogVisible: false,
      // 游戏树数据
      defaultProps: { label: 'label', children: 'children', disabled: 'disabled' },
      treeData: [],
      allTreeData: [],
      filterText: '',
      filterGameIds: [2031, 10002],
      activityId: ACTIVITY_ID,
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) {
        return
      }

      if (this.isEdit && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        this.item = newItem()
      }
      // 获取所有游戏列表并构建树结构
      this.getGameAll().then(() => {
        // 勾选当前活动配置的游戏
        this.selectGamesForTree()
      })
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
  },
  methods: {
    handleDialogClose() {
      this.$emit('close')
    },
    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.data))

      // 时间：秒 -> 毫秒
      data.activity.startTime *=  1000
      data.activity.endTime *=  1000

      // 奖励比例缩小1000倍
      data.extend.rewardRatio = data.extend.rewardRatio / 1000
      // 金额缩小1000倍
      data.extend.maxRewardAmount = data.extend.maxRewardAmount / 1000
      // 玩家最小总投注金额缩小1000倍
      data.extend.minTotalBetAmount = data.extend.minTotalBetAmount / 1000

      // 游戏列表
      if (!Array.isArray(data.activity.gameIdList)) data.activity.gameIdList = []

      // 白名单
      if (!data.activity.whitelist) {
        data.activity.whitelist = {
          siteIdList: [],
          uidList: '',
        }
      } else {
        data.activity.whitelist.uidList = data.activity.whitelist.uidList.join(',')
      }
      if (!Array.isArray(data.activity.whitelist.siteIdList)) data.activity.whitelist.siteIdList = []

      this.item = data
    },
    // 校验数据
    validateData() {
      if (!this.item.activity.name) {
        Message.error('请输入活动名称')
        return false
      }
      if (!this.item.activity.startTime) {
        Message.error('请选择开始时间')
        return false
      }
      if (!this.item.activity.endTime) {
        Message.error('请选择结束时间')
        return false
      }
      if (!this.item.extend.rewardRatio || this.item.extend.rewardRatio <= 0) {
        Message.error('请输入奖励比例（大于0）')
        return false
      }
      if (!this.item.extend.maxRewardAmount || this.item.extend.maxRewardAmount <= 0) {
        Message.error('请输入玩家个人奖励上限金额（大于0）')
        return false
      }
      if (!this.item.extend.minTotalBetAmount || this.item.extend.minTotalBetAmount <= 0) {
        Message.error('请输入玩家最小总投注金额（大于0）')
        return false
      }
      if (!this.item.activity.gameIdList || this.item.activity.gameIdList.length <= 0) {
        Message.error('请选择参与活动的游戏')
        return false
      }
      if (!this.item.activity.whitelist.siteIdList.length) {
        Message.error('请选择站点白名单')
        return false
      }
      return true
    },
    // 处理提交数据（前端展示格式 -> 后端数据）
    getPostData() {
      const data = JSON.parse(JSON.stringify(this.item))

      // 时间：毫秒 -> 秒
      data.activity.startTime = Math.floor(data.activity.startTime / 1000)
      data.activity.endTime = Math.floor(data.activity.endTime / 1000)

      // 奖励比例放大1000倍
      data.extend.rewardRatio = Math.floor(data.extend.rewardRatio * 1000)
      // 金额放大1000倍
      data.extend.maxRewardAmount = Math.floor(data.extend.maxRewardAmount * 1000)
      // 玩家最小总投注金额放大1000倍
      data.extend.minTotalBetAmount = Math.floor(data.extend.minTotalBetAmount * 1000)

      // 白名单
      if (!data.activity.whitelist.uidList) {
        data.activity.whitelist.uidList = []
      } else {
        data.activity.whitelist.uidList = data.activity.whitelist.uidList.split(',').map(uid => parseInt(uid))
      }

      // 返回数据
      const ret = {...data}
      ret.activity = JSON.stringify(data.activity)
      ret.extend = JSON.stringify(data.extend)

      return ret
    },
    handleSave() {
      if (!this.validateData()) return

      const postData = this.getPostData()

      if (postData.id > 0) {
        this.handleUpdate(postData)
      } else {
        this.handleCreate(postData)
      }
    },
    handleCreate(postData) {
      const url = '/activityconfig/create'
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },
    handleUpdate(postData) {
      const url = '/activityconfig/update'
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },
    // 游戏树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 游戏选中变化
    handleCheckChange(data, checked) {
      // 跳过类别节点
      if (typeof data.id === 'string' && data.id.startsWith('p-')) return

      if (!this.item.activity.gameIdList) this.item.activity.gameIdList = []
      const index = this.item.activity.gameIdList.indexOf(data.id)
      if (checked && index < 0) {
        this.item.activity.gameIdList.push(data.id)
      } else if (!checked && index >= 0) {
        this.item.activity.gameIdList.splice(index, 1)
      }
    },
    // 勾选当前活动配置的游戏
    selectGamesForTree() {
      this.$nextTick(() => {
        if (this.$refs.tree && this.item.activity.gameIdList) {
          this.$refs.tree.setCheckedKeys(this.item.activity.gameIdList)
          this.updateGamesSorted()
        }
      })
    },
    /**
     * 获取所有游戏列表并构建树结构
     */
    async getGameAll() {
      return request({
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
            if (this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          // 构建游戏树结构
          const categories = { 1: 'Slots', 2: 'Poker', 3: 'Casino' }
          const builtTree = []

          for (const key in data) {
            const games = data[key]
            const cty = { id: 'p-' + key, label: categories[key], children: [] }
            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({ id: game.Gid, label: game.Name })
            }
            builtTree.push(cty)
          }

          this.allTreeData = builtTree
          // 默认只显示 Slots 和 Casino 游戏（CategoryID = [1, 3]），且不展开
          this.applyGameTypeFilter([1, 3])
        }
      })
    },

    /**
     * 根据游戏类型过滤显示的游戏树
     * @param {number[]} gameTypes - 游戏类型数组 (1: Slots 2: Poker 3: Casino)
     */
    applyGameTypeFilter(gameTypes) {
      const selectedKeys = gameTypes.map(gameType => 'p-' + gameType)
      console.log('selectedKeys', selectedKeys)
      this.treeData = this.allTreeData.filter(cty => selectedKeys.includes(cty.id))
      // 不展开任何节点
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.gameIdList || [])
        }
        this.updateGamesSorted()
      })
    },

    // 打开游戏排序弹窗
    showGamesSortDialog() {
      if (!this.item.gameIdList || this.item.gameIdList.length === 0) {
        return Message.warning('请先选择参与活动的游戏')
      }
      // 根据当前选中的游戏ID，构建排序列表
      this.gamesSorted = this.item.gameIdList.map((gameId, index) => {
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
      const game = this.allTreeData.flatMap(cty => cty.children).find(g => g.id === gameId)
      return game ? game.label : ''
    },

    // 更新已选游戏的排序列表
    updateGamesSorted() {
      if (!this.item.gameIdList || this.item.gameIdList.length === 0) {
        this.gamesSorted = []
        return
      }

      const gamesSorted = []
      const gameIdList = this.item.gameIdList || []

      // 遍历所有游戏树，找到选中的游戏
      this.treeData.forEach(category => {
        if (category.children) {
          category.children.forEach(game => {
            if (gameIdList.includes(game.id)) {
              const existIndex = gamesSorted.findIndex(g => g.gameId === game.id)
              if (existIndex < 0) {
                gamesSorted.push({
                  gameId: game.id,
                  name: game.label,
                  orderNo: gameIdList.indexOf(game.id) + 1
                })
              }
            }
          })
        }
      })

      // 按 orderNo 排序
      gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
      this.gamesSorted = gamesSorted
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

      // 更新活动配置中的游戏顺序
      this.item.gameIdList = sortedGames.map(game => game.gameId)

      this.gamesSortDialogVisible = false
      Message.success('游戏排序已更新')
    }
  }
}
</script>

<style scoped>

</style>
