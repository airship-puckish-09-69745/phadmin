<template>
  <el-dialog
    :title="isEdit ? '编辑聚宝盆活动' : '新增聚宝盆活动'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ========== 活动配置 ========== -->
      <el-tab-pane label="活动配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="奖励类型：">
                <el-select v-model="item.rewardType" placeholder="请选择">
                  <el-option v-for="opt in rewardTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <div style="color: #999; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  投注金：只能在GameZone厅内所有游戏使用的投注金
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日发奖上限监控：" required>
                <el-input v-model.number="item.dayPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时只发铜钱不发投注金，且当日榜单奖励不可领取
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="最大发奖总上限监控：" required>
                <el-input v-model.number="item.totalPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时会在Lark同步报警
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width:  200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：">
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="有效下注获得道具比例：">
                <el-input v-model.number="item.sockGainRatio" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">%</template>
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
                    已选中 {{ (item.gameIdCfg || []).length }} 个游戏
                  </span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- ========== 奖池配置 ========== -->
      <el-tab-pane label="奖池配置" name="prizePool">
        <PrizePoolConfig v-model="item" />
      </el-tab-pane>
      <!-- ========== 排行榜配置 ========== -->
      <el-tab-pane label="排行榜配置" name="ranking">
        <RankingConfig v-model="item" />
      </el-tab-pane>
      <!-- ========== 奖励播报配置 ========== -->
      <el-tab-pane label="奖励播报配置" name="broadcast">
        <BroadcastConfig v-model="item" />
      </el-tab-pane>

      <!-- ========== 白名单配置 ========== -->
      <el-tab-pane label="白名单配置" name="whitelist">
        <el-form label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="item.whitelistCfg.siteIdList" multiple placeholder="请选择" style="width: 100%; max-width: 400px" />
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
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'
import PrizePoolConfig from './components/PrizePoolConfig.vue'
import RankingConfig from './components/RankingConfig.vue'
import BroadcastConfig from './components/BroadcastConfig.vue'

// 默认排行榜配置
const DEFAULT_RANK_CFG = [
  { rankStart: 1, rankEnd: 1, reward: 7777 },
  { rankStart: 2, rankEnd: 2, reward: 2777 },
  { rankStart: 3, rankEnd: 3, reward: 1777 },
  { rankStart: 4, rankEnd: 5, reward: 777 },
  { rankStart: 6, rankEnd: 10, reward: 277 },
  { rankStart: 11, rankEnd: 20, reward: 177 },
  { rankStart: 21, rankEnd: 50, reward: 77 },
  { rankStart: 51, rankEnd: 100, reward: 17 }
]

// 创建空白活动数据
function createNewItem() {
  return {
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    showEndTime: Date.now() + 31 * 24 * 60 * 60 * 1000,
    sockGainRatio: 10,
    rewardType: 2,
    dayPrizeThreshold: 0,
    totalPrizeThreshold: 0,
    prizePoolCfg: [],
    rankCfg: JSON.parse(JSON.stringify(DEFAULT_RANK_CFG)),
    broadcastCfg: { threshold: 500, maxCount: 50 },
    gameIdCfg: [],
    whitelistCfg: {
      appIdList: [],
      siteIdList: []
    }
  }
}

export default {
  components: { SiteSelect, PrizePoolConfig, RankingConfig, BroadcastConfig },
  props: {
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    editData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'activity',
      env: store.getters.env || 'test',
      item: createNewItem(),

      // 游戏树
      treeData: [],
      allTreeData: [],
      filterText: '',
      defaultProps: { label: 'label', children: 'children', disabled: 'disabled' },
      filterGameIds: [2031, 10002],

      // 奖励类型选项
      rewardTypes: [
        { value: 2, label: '投注金' }
      ],

      // 游戏排序弹窗
      gamesSortDialogVisible: false,
      gamesSorted: []
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.activeTab = 'activity'
        if (this.isEdit && Object.keys(this.editData).length > 0) {
          this.loadEditData()
        } else {
          this.item = createNewItem()
        }
        this.getGameAll()
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    filterText(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val)
      }
    }
  },
  methods: {
    handleDialogClose() {
      this.item = createNewItem()
    },

    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.editData))

      // 时间：秒 -> 毫秒
      if (data.startTime) data.startTime *= 1000
      if (data.endTime) data.endTime *= 1000
      if (data.showEndTime) data.showEndTime *= 1000

      // 金额：分 -> 元（/1000）
      if (data.dayPrizeThreshold != null) data.dayPrizeThreshold /= 1000
      if (data.totalPrizeThreshold != null) data.totalPrizeThreshold /= 1000

      // 奖池配置转换
      if (Array.isArray(data.prizePoolCfg)) {
        data.prizePoolCfg.forEach((pool, poolIdx) => {
          if (!pool) return
          if (!Array.isArray(pool.prizeCfg)) pool.prizeCfg = []
          // Assign tierId if not present
          if (pool.tierId === undefined) pool.tierId = poolIdx + 1
          if (pool.raffleLevel) pool.raffleLevel /= 1000
          if (pool.coefficientMin) pool.coefficientMin /= 10
          if (pool.coefficientMax) pool.coefficientMax /= 10
          pool.prizeCfg.forEach((prize, prizeIdx) => {
            if (!prize) return
            // Assign prizeId if not present
            if (prize.prizeId === undefined) prize.prizeId = prizeIdx + 1
            // Convert old format to new format
            if (prize.reward !== undefined) {
              prize.rewardAmount = prize.reward / 1000
              prize.rewardMin = prize.reward / 1000
              prize.rewardMax = prize.reward / 1000
            } else {
              if (prize.rewardAmount) prize.rewardAmount /= 1000
              if (prize.rewardMin) prize.rewardMin /= 1000
              if (prize.rewardMax) prize.rewardMax /= 1000
            }
          })
        })
      } else {
        data.prizePoolCfg = []
      }

      // 排行榜配置转换
      if (Array.isArray(data.rankCfg)) {
        data.rankCfg.forEach(rank => {
          if (rank && rank.reward) rank.reward /= 1000
        })
      } else {
        data.rankCfg = JSON.parse(JSON.stringify(DEFAULT_RANK_CFG))
      }

      // 播报配置
      if (!data.broadcastCfg) {
        data.broadcastCfg = { threshold: 500, maxCount: 50 }
      }

      // 白名单
      if (!data.whitelistCfg) {
        data.whitelistCfg = { appIdList: [], siteIdList: [] }
      }
      if (!Array.isArray(data.whitelistCfg.appIdList)) data.whitelistCfg.appIdList = []
      if (!Array.isArray(data.whitelistCfg.siteIdList)) data.whitelistCfg.siteIdList = []

      // 游戏列表
      if (!Array.isArray(data.gameIdCfg)) data.gameIdCfg = []

      this.item = data
    },

    // 编码前端数据 -> 后端格式
    encodeData() {
      const cpy = JSON.parse(JSON.stringify(this.item))

      // 时间：毫秒 -> 秒
      cpy.startTime = Math.floor(cpy.startTime / 1000)
      cpy.endTime = Math.floor(cpy.endTime / 1000)
      cpy.showEndTime = Math.floor(cpy.showEndTime / 1000)

      // 金额：元 -> 分（*1000）
      cpy.dayPrizeThreshold = Math.floor((cpy.dayPrizeThreshold || 0) * 1000)
      cpy.totalPrizeThreshold = Math.floor((cpy.totalPrizeThreshold || 0) * 1000)

      // 奖池配置转换
      const prizePoolCfgArray = (cpy.prizePoolCfg || []).map(pool => {
        const encoded = {
          tierId: pool.tierId || 0,
          sockBaseNum: pool.sockBaseNum,
          raffleLevel: Math.floor((pool.raffleLevel || 0) * 1000),
          rewardMax: 0,
          coefficientMin: Math.round((pool.coefficientMin || 0) * 10),
          coefficientMax: Math.round((pool.coefficientMax || 0) * 10),
          prizeCfg: (pool.prizeCfg || []).map(prize => ({
            prizeId: prize.prizeId || 0,
            rewardAmount: Math.floor((prize.rewardAmount || 0) * 1000),
            rewardMin: Math.floor((prize.rewardMin || 0) * 1000),
            rewardMax: Math.floor((prize.rewardMax || 0) * 1000),
            weight: prize.weight,
            prizeNum: prize.prizeNum,
            prizeUnlimited: prize.prizeUnlimited
          }))
        }
        // 计算最大奖励 (use rewardMax from prizes)
        encoded.rewardMax = Math.max(0, ...encoded.prizeCfg.map(p => p.rewardMax))
        return encoded
      })

      // 排行榜配置转换
      const rankCfgArray = (cpy.rankCfg || []).map(rank => ({
        rankStart: rank.rankStart,
        rankEnd: rank.rankEnd,
        reward: Math.floor((rank.reward || 0) * 1000)
      }))

      // 播报配置（如果存在）
      const broadcastCfg = cpy.broadcastCfg || { threshold: 500, maxCount: 50 }

      // 白名单配置（如果存在）
      const whitelistCfg = cpy.whitelistCfg || { appIdList: [], siteIdList: [] }

      // 转换为 JSON 字符串（因为request拦截器会使用FormData，需要序列化复杂对象）
      cpy.prizePoolCfg = JSON.stringify(prizePoolCfgArray)
      cpy.rankCfg = JSON.stringify(rankCfgArray)
      cpy.broadcastCfg = JSON.stringify(broadcastCfg)
      cpy.whitelistCfg = JSON.stringify(whitelistCfg)
      return cpy
    },

    // 表单验证
    validate() {
      if (!this.item.activityName || this.item.activityName.trim() === '') {
        Message.error('请输入活动名称')
        return false
      }
      if (!this.item.startTime) {
        Message.error('请选择开始时间')
        return false
      }
      if (!this.item.endTime) {
        Message.error('请选择结束时间')
        return false
      }
      if (this.item.startTime >= this.item.endTime) {
        Message.error('结束时间必须大于开始时间')
        return false
      }
      if (this.item.rewardType === undefined || this.item.rewardType === null) {
        Message.error('请选择奖励类型')
        return false
      }
      return true
    },

    // 保存
    handleSave() {
      if (!this.validate()) return

      const postData = this.encodeData()

      const url = '/activitytreasurebowl/create'
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
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

      if (!this.item.gameIdCfg) this.item.gameIdCfg = []
      const index = this.item.gameIdCfg.indexOf(data.id)
      if (checked && index < 0) {
        this.item.gameIdCfg.push(data.id)
      } else if (!checked && index >= 0) {
        this.item.gameIdCfg.splice(index, 1)
      }
    },

    /**
     * 获取所有游戏列表并构建树结构
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

          // 按游戏类别分组，只保留 poker
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1 || this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }
            // 只保留 CategoryID=2 (Poker)
            if (obj.CategoryID !== 2) continue

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          // 构建游戏树结构，只保留 poker
          const categories = { 2: 'Poker' }
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
          // 默认只显示 Poker 游戏（CategoryID = 2），且不展开
          this.applyGameTypeFilter(2)

          // 设置已选中的游戏
          this.$nextTick(() => {
            if (this.$refs.tree && this.item.gameIdCfg) {
              this.$refs.tree.setCheckedKeys(this.item.gameIdCfg)
              this.updateGamesSorted()
            }
          })
        }
      })
    },

    /**
     * 根据游戏类型过滤显示的游戏树
     * @param {number} gameType - 游戏类型 (2: Poker)
     */
    applyGameTypeFilter(gameType) {
      const selectedKey = 'p-' + gameType
      this.treeData = this.allTreeData.filter(cty => cty.id === selectedKey)
      // 不展开任何节点
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.gameIdCfg || [])
        }
        this.updateGamesSorted()
      })
    },

    // 打开游戏排序弹窗
    showGamesSortDialog() {
      if (!this.item.gameIdCfg || this.item.gameIdCfg.length === 0) {
        return Message.warning('请先选择参与活动的游戏')
      }
      // 根据当前选中的游戏ID，构建排序列表
      this.gamesSorted = this.item.gameIdCfg.map((gameId, index) => {
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
      if (!this.item.gameIdCfg || this.item.gameIdCfg.length === 0) {
        this.gamesSorted = []
        return
      }

      const gamesSorted = []
      const gameIdCfg = this.item.gameIdCfg || []

      // 遍历所有游戏树，找到选中的游戏
      this.treeData.forEach(category => {
        if (category.children) {
          category.children.forEach(game => {
            if (gameIdCfg.includes(game.id)) {
              const existIndex = gamesSorted.findIndex(g => g.gameId === game.id)
              if (existIndex < 0) {
                gamesSorted.push({
                  gameId: game.id,
                  name: game.label,
                  orderNo: gameIdCfg.indexOf(game.id) + 1
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
      this.item.gameIdCfg = sortedGames.map(game => game.gameId)

      this.gamesSortDialogVisible = false
      Message.success('游戏排序已更新')
    }
  }
}
</script>

<style scoped>
.el-tabs__content {
  min-height: 400px;
  box-sizing: border-box;
}
</style>
