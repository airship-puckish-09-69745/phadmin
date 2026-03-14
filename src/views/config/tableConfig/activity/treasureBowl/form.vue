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
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="奖励类型：">
                <el-select v-model="item.rewardType" placeholder="请选择">
                  <el-option v-for="opt in rewardTypes" :key="opt.value" :label="opt.label" :value="opt.value"/>
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
                <el-date-picker
                  v-model="item.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="timestamp"
                  style="width:  200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间：" required>
                <el-date-picker
                  v-model="item.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：">
                <el-date-picker
                  v-model="item.showEndTime"
                  type="datetime"
                  placeholder="选择展示结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
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
              <GameSelector
                v-model="item.gameIdCfg"
                label="参与活动游戏："
                :category-ids="[2]"
              />
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- ========== 奖池配置 ========== -->
      <el-tab-pane label="奖池配置" name="prizePool">
        <PrizePoolConfig v-model="item"/>
      </el-tab-pane>
      <!-- ========== 排行榜配置 ========== -->
      <el-tab-pane label="排行榜配置" name="ranking">
        <RankingConfig v-model="item"/>
      </el-tab-pane>
      <!-- ========== 奖励播报配置 ========== -->
      <el-tab-pane label="奖励播报配置" name="broadcast">
        <BroadcastConfig v-model="item"/>
      </el-tab-pane>

      <!-- ========== 白名单配置 ========== -->
      <el-tab-pane label="白名单配置" name="whitelist">
        <el-form label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="站点白名单：">
                <SiteSelect
                  v-model="item.whitelistCfg.siteIdList"
                  multiple
                  placeholder="请选择"
                  style="width: 100%; max-width: 400px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- ========== 头像框奖励配置 ========== -->
      <el-tab-pane label="头像框奖励配置" name="propConfig">
        <el-form label-width="180px" size="small">
          <div>
            <el-table
              :data="item.propPools ? [item.propPools] : []"
              border
              size="small"
              style="width: 100%"
            >
              <el-table-column label="道具类型" min-width="140">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.propType"
                    placeholder="请选择"
                    size="mini"
                    style="width: 100%"
                    @change="handlePropTypeChange(scope.row)"
                  >
                    <el-option
                      v-for="item in propTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="道具名称" min-width="140">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" style="width: 100%" @change="handlePropNameChange(scope.row)">
                    <el-option
                      v-for="item in getPropOptionsByType(scope.row.propType)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="可用时间" min-width="120">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.propTime"
                    placeholder="请选择"
                    size="mini"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in propDayTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="道具数量" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'
import PrizePoolConfig from './components/PrizePoolConfig.vue'
import RankingConfig from './components/RankingConfig.vue'
import BroadcastConfig from './components/BroadcastConfig.vue'
import GameSelector from '@/components/Game/GameSelector.vue'

// 默认排行榜配置
const DEFAULT_RANK_CFG = [
  {rankStart: 1, rankEnd: 1, reward: 7777},
  {rankStart: 2, rankEnd: 2, reward: 2777},
  {rankStart: 3, rankEnd: 3, reward: 1777},
  {rankStart: 4, rankEnd: 5, reward: 777},
  {rankStart: 6, rankEnd: 10, reward: 277},
  {rankStart: 11, rankEnd: 20, reward: 177},
  {rankStart: 21, rankEnd: 50, reward: 77},
  {rankStart: 51, rankEnd: 100, reward: 17}
]

const DEFAULT_PROP_POOLS = {propType: 2, propId: 0, propName: '', propTime: 7, propNum: 1}

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
    status: 6,
    dayPrizeThreshold: 0,
    totalPrizeThreshold: 0,
    prizePoolCfg: [],
    rankCfg: JSON.parse(JSON.stringify(DEFAULT_RANK_CFG)),
    broadcastCfg: {threshold: 500, maxCount: 50},
    gameIdCfg: [],
    whitelistCfg: {
      siteIdList: []
    },
    // 道具配置字段
    propPools: DEFAULT_PROP_POOLS
  }
}

export default {
  components: {SiteSelect, PrizePoolConfig, RankingConfig, BroadcastConfig, GameSelector},
  props: {
    visible: {type: Boolean, default: false},
    isEdit: {type: Boolean, default: false},
    editData: {type: Object, default: () => ({})}
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'activity',
      env: store.getters.env || 'test',
      item: createNewItem(),

      // 道具选择项
      propTypeOptions: [
        {'value': 2, 'label': '头像框', disabled: false},
        // { 'value': 7, 'label': 'Tongits门票', disabled: false },
        // { 'value': 8, 'label': '德州门票', disabled: false },
        // { 'value': 4, 'label': '德州头像框', disabled: false },
        // { 'value': 5, 'label': 'SlotFreeSpin', disabled: false }
      ],
      propDayTypeOptions: [
        {'value': 1, 'label': '1天', disabled: false},
        {'value': 3, 'label': '3天', disabled: false},
        {'value': 7, 'label': '7天', disabled: false},
        {'value': 30, 'label': '30天', disabled: false},
        {'value': 365, 'label': '365天', disabled: false},
        {'value': 0, 'label': '永久', disabled: false}
      ],
      // 奖励类型选项
      rewardTypes: [
        {value: 2, label: '投注金'}
      ],

      // 道具列表
      propList: [],

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
      }
      // 获取道具列表
      this.getPropList()
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    handleDialogClose() {
      this.item = createNewItem()
    },

    // 加载道具列表
    getPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.propList = []
            this.propList = objs.list
          }
        } else {
          this.propList = []
        }
      })
    },

    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.editData))
      // 兼容后端返回 whitelistCfg 为字符串的情况
      if (typeof data.whitelistCfg === 'string') {
        try {
          data.whitelistCfg = JSON.parse(data.whitelistCfg)
        } catch (e) {
          data.whitelistCfg = {siteIdList: []}
        }
      }
      // 排行榜配置
      if (typeof data.rankCfg === 'string') {
        try {
          data.rankCfg = JSON.parse(data.rankCfg)
        } catch (e) {
          data.rankCfg = JSON.parse(JSON.stringify(DEFAULT_RANK_CFG))
        }
      }
      // 奖池
      if (typeof data.prizePoolCfg === 'string') {
        try {
          data.prizePoolCfg = JSON.parse(data.prizePoolCfg)
        } catch (e) {
          data.prizePoolCfg = []
        }
      }
      // 白名单配置
      if (typeof data.whitelistCfg.siteIdList === 'string') {
        try {
          data.whitelistCfg.siteIdList = JSON.parse(data.whitelistCfg.siteIdList)
        } catch (e) {
          data.whitelistCfg.siteIdList = []
        }
      }
      // 播报配置
      if (typeof data.broadcastCfg === 'string') {
        try {
          data.broadcastCfg = JSON.parse(data.broadcastCfg)
        } catch (e) {
          data.broadcastCfg = {threshold: 500, maxCount: 50}
        }
      }
      // 游戏列表
      if (typeof data.gameIdCfg === 'string') {
        try {
          data.gameIdCfg = JSON.parse(data.gameIdCfg).map(v => Number(v))
        } catch (e) {
          // 兼容旧格式：逗号分隔的字符串 "23,22,15"
          data.gameIdCfg = data.gameIdCfg.split(',').filter(v => v).map(v => Number(v))
        }
      }

      // 时间：秒 -> 毫秒
      if (data.startTime) data.startTime *= 1000
      if (data.endTime) data.endTime *= 1000
      if (data.showEndTime) data.showEndTime *= 1000

      // 金额：分 -> 元（/1000）
      if (data.dayPrizeThreshold != null) data.dayPrizeThreshold /= 1000
      if (data.totalPrizeThreshold != null) data.totalPrizeThreshold /= 1000

      // 奖池配置转换
      data.prizePoolCfg.forEach((pool, poolIdx) => {
        if (!pool) return
        if (!Array.isArray(pool.prizeCfg)) pool.prizeCfg = []

        if (pool.tierId === undefined) pool.tierId = poolIdx + 1
        if (pool.raffleLevel) pool.raffleLevel /= 1000
        if (pool.coefficientMin) pool.coefficientMin
        if (pool.coefficientMax) pool.coefficientMax
        pool.prizeCfg.forEach((prize, id) => {
          if (!prize) return
          if (prize.id === undefined) prize.id = id + 1
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
      // 排行榜配置转换
      data.rankCfg.forEach(rank => {
        if (rank && rank.reward) rank.reward /= 1000
      })
      // 奖励播报配置
      if (data.broadcastCfg.threshold) data.broadcastCfg.threshold /= 1000
      // 道具配置兼容
      if (!data.propPools) {
        data.propPools = { ...DEFAULT_PROP_POOLS }
      } else {
        // 兼容 propPools 为 JSON 字符串的情况
        if (typeof data.propPools === 'string') {
          try {
            data.propPools = JSON.parse(data.propPools)
          } catch (e) {
            data.propPools = { ...DEFAULT_PROP_POOLS }
          }
        }
        // 兼容 propPools 为数组的情况，取第一项
        if (Array.isArray(data.propPools)) {
          data.propPools = data.propPools[0] || { ...DEFAULT_PROP_POOLS }
        }
        data.propPools.propId = Number(data.propPools.propId)
      }

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

          raffleLevel: Math.floor((pool.raffleLevel || 0) * 1000),
          coefficientMin: pool.coefficientMin,
          coefficientMax: pool.coefficientMax,
          prizeCfg: (pool.prizeCfg || []).map(prize => ({
            ...prize,
            rewardAmount: Math.floor((prize.rewardAmount || 0) * 1000),
            rewardMin: Math.floor((prize.rewardMin || 0) * 1000),
            rewardMax: Math.floor((prize.rewardMax || 0) * 1000)
          }))
        }
        return encoded
      })

      // 排行榜配置转换
      const rankCfgArray = (cpy.rankCfg || []).map(rank => ({
        rankStart: rank.rankStart,
        rankEnd: rank.rankEnd,
        reward: Math.floor((rank.reward || 0) * 1000)
      }))
      // 播报配置（如果存在）- 显式提取属性以避免Vue响应式对象序列化问题
      const broadcastCfg = {
        threshold: this.item.broadcastCfg.threshold * 1000,
        maxCount: this.item.broadcastCfg.maxCount
      }

      // 白名单配置（如果存在）
      const whitelistCfg = cpy.whitelistCfg || {siteIdList: []}
      // 全部转为整型
      const gameIdCfg = cpy.gameIdCfg.map(v => Number(v))
      // 道具
      const propPools = cpy.propPools

      // 转换为 JSON 字符串（因为request拦截器会使用FormData，需要序列化复杂对象）
      cpy.prizePoolCfg = JSON.stringify(prizePoolCfgArray)
      cpy.rankCfg = JSON.stringify(rankCfgArray)
      cpy.broadcastCfg = JSON.stringify(broadcastCfg)
      cpy.whitelistCfg = JSON.stringify(whitelistCfg)
      cpy.gameIdCfg = JSON.stringify(gameIdCfg)
      cpy.propPools = JSON.stringify(propPools)
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
      if (this.item.broadcastCfg.maxCount > 20) {
        Message.error('限制播报条数最大 20 ')
        return false
      }

      return true
    },

    // 保存
    handleSave() {
      if (!this.validate()) return
      const postData = this.encodeData()
      if (this.isEdit) {
        this.handleEditData(postData)
      } else {
        // 添加默认 6: '下架'
        postData.status = 6
        this.handleAddData(postData)
      }
    },
    handleEditData(postData) {
      const url = '/treasurebowlactivity/update'
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
    handleAddData(postData) {
      const url = '/treasurebowlactivity/create'
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

    // 处理道具类型变化
    handlePropTypeChange(row) {
      // 清空之前选择的道具ID和名称
      row.propId = 0
      row.propName = ''
    },

    /**
     * 获取所有游戏列表并构建树结构
     */
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: {status: 2}
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

            const game = {Gid: obj.Gid, Name: obj.Name, Description: obj.Description}
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          // 构建游戏树结构，只保留 poker
          const categories = {2: 'Poker'}
          const builtTree = []

          for (const key in data) {
            const games = data[key]
            const cty = {id: 'p-' + key, label: categories[key], children: []}
            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({id: game.Gid, label: game.Name})
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
    // 根据道具类型获取道具选项
    getPropOptionsByType(propType) {
      const propOptions = []
      const currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        const prop = this.propList[i]
        if (prop.item_type === propType && prop.status === 1) {
          // 对于非头像框类型，检查是否过期
          if (prop.item_type !== 2) {
            const expTime = prop.expire_time * 1000
            if (currTime < expTime) {
              propOptions.push({
                value: prop.id,
                label: prop.item_name,
                disabled: false
              })
            }
          } else {
            propOptions.push({
              value: prop.id,
              label: prop.item_name,
              disabled: false
            })
          }
        }
      }
      return propOptions
    },
    // 处理道具名称变化
    handlePropNameChange(row) {
      const options = this.getPropOptionsByType(row.propType)
      const selected = options.find(opt => opt.value === row.propId)
      if (selected) {
        row.propName = selected.label
      }
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
