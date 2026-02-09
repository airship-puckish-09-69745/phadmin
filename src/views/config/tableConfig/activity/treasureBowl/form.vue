<template>
  <el-dialog
    title="聚宝盆活动配置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width=" 1200px"
    top="5vh"
    @opened="handleDialogOpened"
    @close="handleDialogClose"
  >

    <el-row>
      <br>
      <el-tabs type="border-card" >
        <el-tab-pane label="活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="24">
                  <!-- 活动名称，占据整行 -->
                  <el-form-item label="活动名称：" :required="true">
                    <el-input v-model="item.activityName" placeholder="请输入活动名称" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="展示结束时间：">
                    <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开始时间：">
                    <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：">
                    <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下注/赢钱获得道具比例：">
                    <el-input v-model.number="item.sockGainRatio" size="mini">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发放奖励类型：">
                    <el-select v-model="item.rewardType" placeholder="请选择" size="mini" style="width:90px">
                      <el-option
                        v-for="option in rewardTypes"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="每日发奖上限监控：" :required="true">
                    <el-input v-model.number="item.dayPrizeThreshold" size="mini" /><span v-if="todayRaffleAmount > item.dayPrizeThreshold" style="color: red">今日发奖已超阈值（{{ todayRaffleAmount }}），已开启限制</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大发奖总上限监控：" :required="true">
                    <el-input v-model.number="item.dayPrizeThreshold" size="mini" /><span v-if="todayRaffleAmount > item.dayPrizeThreshold" style="color: red">今日发奖已超阈值（{{ todayRaffleAmount }}），已开启限制</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="12">
                <el-form-item label="勾选支持的游戏：" :required="true">
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                  />
                  <el-tree
                    ref="tree"
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check-change="handleCheckChange"
                  />
                </el-form-item>
                <el-form-item label="给选中游戏排序：" :required="true">
                  <el-button size="mini" type="primary" @click="showGamesSortDialog">
                    排序
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="奖池配置">
          <!-- 使用奖池配置组件 -->
          <PrizePoolConfig v-model="item" />
        </el-tab-pane>

        <el-tab-pane label="排行榜配置">
          <!-- 使用排行榜配置组件 -->
          <RankingConfig v-model="item" />
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form v-if="item.whitelistCfg" ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="SiteId白名单：" prop="item.whitelistCfg.siteIdList">
                  <SiteSelect v-model="item.whitelistCfg.siteIdList" multiple placeholder="请选择" style="width: 400px" @change="onSiteIdOptionsChange" />
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
        :close-on-press-escape="false"
        append-to-body
      >
        <el-table
          :data="gamesSorted"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="gameId"
            label="游戏Id"
            width="200"
          />
          <el-table-column
            prop="name"
            label="游戏名称"
            width="200"
          />
          <el-table-column
            prop="orderNo"
            label="排序编号"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.orderNo"
                size="mini"
                oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                @change="onOrderNoChange"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row style="top: 10px">
          <el-button type="primary" @click="saveGamesSort">保存</el-button>
        </el-row>
      </el-dialog>

      <el-row style="margin-top: 20px; text-align: center;">
        <el-button type="primary" @click="setData">保存配置</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-row>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </el-dialog>
</template>

<script>
import { $libShow, DataRule } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { getCustomize, updateCustomize } from '@/api/custome_configV2'
import SiteSelect from '@/components/SiteSelect/index.vue'
// 引入奖池配置和排行榜配置组件
import PrizePoolConfig from './components/PrizePoolConfig.vue'
import RankingConfig from './components/RankingConfig.vue'

export default {
  components: { Compare, SiteSelect, PrizePoolConfig, RankingConfig },
  props: {
    // 控制弹窗显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 是否为编辑模式
    isEdit: {
      type: Boolean,
      default: false
    },
    // 编辑时传入的数据
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹窗显示状态
      subKey: 'christmas_fortune_tree_cfg', // 配置的子键名
      libShow: $libShow, // 通用样式库
      form: { // 表单数据包装对象
        Data: {}
      },
      // 活动配置数据对象（统一使用小驼峰命名）
      item: {
        activityName: '', // 活动名称
        isOpen: true, // 是否开启
        startTime: 1734278400000, // 活动开始时间（毫秒）
        endTime: 1735487999000, // 活动结束时间（毫秒）
        showEndTime: 1735574399000, // 展示结束时间（毫秒）
        sockGainRatio: 10, // 下注/赢钱获得道具比例
        ruleImgHor: [], // 横向规则图片列表
        ruleImgVer: [], // 纵向规则图片列表
        rewardType: 2, // 发放奖励类型（1:金币 2:投注金 3:返水金）
        rewardUseSceneId: 0, // 奖励使用场景ID
        dayPrizeThreshold: 0, // 每日发奖额度阈值
        prizePoolCfg: [], // 奖池配置列表
        rankCfg: [ // 排行榜配置列表
          { rankStart: 1, rankEnd: 1, reward: 28888 },
          { rankStart: 2, rankEnd: 2, reward: 18888 },
          { rankStart: 3, rankEnd: 3, reward: 8888 },
          { rankStart: 4, rankEnd: 5, reward: 2888 },
          { rankStart: 6, rankEnd: 10, reward: 1888 },
          { rankStart: 11, rankEnd: 20, reward: 888 },
          { rankStart: 21, rankEnd: 40, reward: 288 },
          { rankStart: 41, rankEnd: 70, reward: 188 },
          { rankStart: 71, rankEnd: 100, reward: 88 }
        ],
        gameIdCfg: [], // 游戏ID配置列表
        whitelistCfg: { // 白名单配置
          appIdList: [], // AppId白名单列表
          siteIdList: [] // SiteId白名单列表
        }
      },

      // 游戏树相关数据
      allTreeData: [], // 存储所有游戏树数据
      treeData: [], // 当前显示的游戏树数据（根据游戏类型过滤）
      gamesSorted: [], // 已选游戏的排序列表
      gamesSortDialogVisible: false, // 游戏排序弹窗显示状态
      filterText: '', // 游戏搜索过滤文本

      // 游戏树配置
      defaultProps: {
        label: 'label', // 节点标签对应字段
        children: 'children', // 子节点对应字段
        disabled: 'disabled' // 禁用状态对应字段
      },

      // AppId 选项列表
      appIdOptions: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: '提审1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        }
      ],
      // 奖励类型选项
      rewardTypes: [
        // { value: 1, label: '金币' },
        { value: 2, label: '投注金' }
        // { value: 3, label: '返水金' }
      ],

      // 投注金使用场景选项
      betScenes: [
        { value: 1, label: '任意游戏投注' },
        { value: 2, label: '仅限Poker类游戏投注' },
        { value: 3, label: '仅限Slots类游戏投注' },
        { value: 4, label: '仅限Tongits游戏投注' }
      ],

      // 返水金使用场景选项
      rebateScenes: [
        { value: 5, label: '没有任何限制的返水金' },
        { value: 6, label: '有限制倍数的返水金（10倍）' }
      ],

      // 需要过滤的游戏ID列表
      filterGameIds: [2031, 10002],

      // 当日发奖总额
      todayRaffleAmount: 0
    }
  },
  watch: {
    // 监听父组件传入的 visible 属性
    visible(val) {
      this.dialogVisible = val
      if (val) {
        // 弹窗打开时的处理
        if (this.isEdit && Object.keys(this.editData).length > 0) {
          // 编辑模式：加载编辑数据
          this.loadEditData()
        } else if (!this.isEdit) {
          // 新增模式：重置为默认数据
          this.resetData()
        }
      }
    },
    // 监听本地 dialogVisible 变化，同步通知父组件
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    filterText(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    },
    // 监听 gameIdCfg 变化，更新选中状态
    'item.gameIdCfg': {
      handler() {
        if (this.$refs.tree) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.item.gameIdCfg || [])
            this.updateGamesSorted()
          })
        }
      },
      immediate: false
    }
  },
  created() {
    // 不在 created 中自动加载数据，等待弹窗打开时再加载
  },
  methods: {
    /**
     * 弹窗打开后的处理
     */
    handleDialogOpened() {
      console.log('聚宝盆配置弹窗已打开')
      this.$emit('opened')
      // 获取配置数据
      this.getData()
    },

    /**
     * 弹窗关闭时的处理
     */
    handleDialogClose() {
      console.log('聚宝盆配置弹窗已关闭')
      this.$emit('close')
    },

    /**
     * 加载编辑数据
     */
    loadEditData() {
      if (this.editData && Object.keys(this.editData).length > 0) {
        // 深拷贝编辑数据到 item
        this.item = JSON.parse(JSON.stringify(this.editData))

        // TODO: 根据实际需求转换数据格式
        console.log('加载编辑数据:', this.item)
      }
    },

    /**
     * 重置表单数据为默认值
     */
    resetData() {
      this.item = {
        activityName: '', // 活动名称
        isOpen: true,
        startTime: Date.now(),
        endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
        showEndTime: Date.now() + 31 * 24 * 60 * 60 * 1000,
        sockGainRatio: 10,
        ruleImgHor: [],
        ruleImgVer: [],
        rewardType: 1,
        rewardUseSceneId: 0,
        dayPrizeThreshold: 0,
        prizePoolCfg: [],
        rankCfg: [
          { rankStart: 1, rankEnd: 1, reward: 28888 },
          { rankStart: 2, rankEnd: 2, reward: 18888 },
          { rankStart: 3, rankEnd: 3, reward: 8888 },
          { rankStart: 4, rankEnd: 5, reward: 2888 },
          { rankStart: 6, rankEnd: 10, reward: 1888 },
          { rankStart: 11, rankEnd: 20, reward: 888 },
          { rankStart: 21, rankEnd: 40, reward: 288 },
          { rankStart: 41, rankEnd: 70, reward: 188 },
          { rankStart: 71, rankEnd: 100, reward: 88 }
        ],
        gameIdCfg: [],
        whitelistCfg: {
          appIdList: [],
          siteIdList: []
        }
      }
      console.log('重置表单数据')
    },

    /**
     * 获取完整的配置Key
     */
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    /**
     * 数据验证规则
     */
    dataRule(required, config) {
      return DataRule(required, config)
    },

    /**
     * 游戏树节点过滤方法
     */
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    /**
     * 游戏树选中状态变化处理
     */
    handleCheckChange(data, checked) {
      // 不允许选中游戏类别节点（Slot、Poker、Casino）
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      // 确保 gameIdCfg 存在
      if (!this.item.gameIdCfg) {
        this.item.gameIdCfg = []
      }

      const index = this.item.gameIdCfg.indexOf(data.id)
      if (checked) {
        // 选中：添加到列表
        if (index < 0) {
          this.item.gameIdCfg.push(data.id)
        }
      } else {
        // 取消选中：从列表移除
        if (index >= 0) {
          this.item.gameIdCfg.splice(index, 1)
        }
      }

      // 更新游戏排序列表
      this.updateGamesSorted()
    },

    /**
     * 更新已选游戏的排序列表
     */
    updateGamesSorted() {
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

    /**
     * 显示游戏排序弹窗
     */
    showGamesSortDialog() {
      this.updateGamesSorted()
      this.gamesSortDialogVisible = true
    },

    /**
     * 保存游戏排序
     */
    saveGamesSort() {
      this.gamesSortDialogVisible = false
      // 根据排序编号重新排序
      this.gamesSorted.sort((a, b) => a.orderNo - b.orderNo)

      // 保存排序后的游戏ID列表
      const gameIdCfg = []
      this.gamesSorted.forEach(item => {
        gameIdCfg.push(item.gameId)
      })
      this.item.gameIdCfg = gameIdCfg
    },

    /**
     * 排序号变化时自动排序
     */
    onOrderNoChange() {
      this.gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
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

          // 按游戏类别分组
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            // 过滤不需要展示的游戏
            if (obj.ShowDatacenter !== 1 || this.filterGameIds.indexOf(obj.Gid) >= 0) {
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
          const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }
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
          // 默认只显示 Poker 游戏（CategoryID = 2）
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
     * @param {number} gameType - 游戏类型 (1: Slot, 2: Poker, 3: Casino)
     */
    applyGameTypeFilter(gameType) {
      const selectedKey = 'p-' + gameType
      this.treeData = this.allTreeData.filter(cty => cty.id === selectedKey)

      // 获取当前类型下所有允许的游戏ID
      const allowedIds = new Set()
      this.treeData.forEach(cty => {
        (cty.children || []).forEach(game => allowedIds.add(game.id))
      })

      // 过滤掉不在当前类型的游戏ID
      const filteredIds = (this.item.gameIdCfg || []).filter(id => allowedIds.has(id))
      if (filteredIds.length !== (this.item.gameIdCfg || []).length) {
        this.item.gameIdCfg = filteredIds
      }

      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.gameIdCfg || [])
        }
        this.updateGamesSorted()
      })
    },
    /**
     * AppId选项变化处理
     */
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.item.whitelistCfg.appIdList)
    },

    /**
     * SiteId选项变化处理
     */
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.item.whitelistCfg.siteIdList)
    },

    /**
     * 获取配置数据
     */
    getData() {
      const rankCfg = JSON.parse(JSON.stringify(this.item.rankCfg || []))
      const whitelistCfg = JSON.parse(JSON.stringify(this.item.whitelistCfg || { appIdList: [], siteIdList: [] }))

      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          console.log('christmasConfig', response.Data)

          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const parsedData = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)

            // 先合并默认值，确保所有必需字段存在
            this.item = {
              activityName: '',
              isOpen: true,
              startTime: Date.now(),
              endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
              showEndTime: Date.now() + 31 * 24 * 60 * 60 * 1000,
              sockGainRatio: 10,
              ruleImgHor: [],
              ruleImgVer: [],
              rewardType: 2,
              rewardUseSceneId: 0,
              dayPrizeThreshold: 0,
              prizePoolCfg: [],
              rankCfg: [],
              gameIdCfg: [],
              whitelistCfg: {
                appIdList: [],
                siteIdList: []
              },
              ...parsedData
            }

            // 再次确保嵌套对象的完整性
            if (!this.item.whitelistCfg) {
              this.item.whitelistCfg = { appIdList: [], siteIdList: [] }
            } else {
              if (!Array.isArray(this.item.whitelistCfg.appIdList)) {
                this.item.whitelistCfg.appIdList = []
              }
              if (!Array.isArray(this.item.whitelistCfg.siteIdList)) {
                this.item.whitelistCfg.siteIdList = []
              }
            }

            if (!Array.isArray(this.item.prizePoolCfg)) {
              this.item.prizePoolCfg = []
            }
            if (!Array.isArray(this.item.rankCfg)) {
              this.item.rankCfg = []
            }
            if (!Array.isArray(this.item.gameIdCfg)) {
              this.item.gameIdCfg = []
            }

            // 时间转换（从秒到毫秒）
            if (this.item.startTime) this.item.startTime *= 1000
            if (this.item.endTime) this.item.endTime *= 1000
            if (this.item.showEndTime) this.item.showEndTime *= 1000

            // 奖池配置处理 - 安全遍历
            this.item.prizePoolCfg.forEach(poolItem => {
              if (!poolItem) return
              if (!Array.isArray(poolItem.prizeCfg)) poolItem.prizeCfg = []

              if (poolItem.raffleLevel) poolItem.raffleLevel /= 1000
              if (poolItem.coefficientMin) poolItem.coefficientMin /= 10
              if (poolItem.coefficientMax) poolItem.coefficientMax /= 10

              poolItem.prizeCfg.forEach(prizeCfg => {
                if (prizeCfg && prizeCfg.reward) prizeCfg.reward /= 1000
              })
            })

            // 排行榜配置处理
            this.item.rankCfg.forEach(rankItem => {
              if (rankItem && rankItem.reward) rankItem.reward /= 1000
            })

            if (this.item.rankCfg.length === 0) {
              this.item.rankCfg = rankCfg
            }

            if (this.item.whitelistCfg == null) {
              this.item.whitelistCfg = whitelistCfg
            }

            if (this.item.dayPrizeThreshold != null) {
              this.item.dayPrizeThreshold /= 1000
            }

            this.$refs.compare.SetOldVal(old)

            this.getGameAll()
          }
        }
      })
    },
    /**
     * 编码数据为后端格式
     */
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)

      // 时间转换为秒
      cpy.startTime /= 1000
      cpy.endTime /= 1000
      cpy.showEndTime /= 1000

      // 处理奖池配置
      cpy.prizePoolCfg = []
      for (const poolCfg of this.item.prizePoolCfg) {
        const obj = {
          sockBaseNum: poolCfg.sockBaseNum,
          raffleLevel: poolCfg.raffleLevel * 1000,
          rewardMax: poolCfg.rewardMax * 1000,
          coefficientMin: poolCfg.coefficientMin * 10,
          coefficientMax: poolCfg.coefficientMax * 10,
          prizeCfg: []
        }

        for (const prizeCfg of poolCfg.prizeCfg) {
          obj.prizeCfg.push({
            reward: prizeCfg.reward * 1000,
            weight: prizeCfg.weight,
            prizeNum: prizeCfg.prizeNum,
            prizeUnlimited: prizeCfg.prizeUnlimited
          })
        }

        cpy.prizePoolCfg.push(obj)
      }

      // 处理排行榜配置
      cpy.rankCfg = []
      for (const rankCfg of this.item.rankCfg) {
        cpy.rankCfg.push({
          rankStart: rankCfg.rankStart,
          rankEnd: rankCfg.rankEnd,
          reward: rankCfg.reward * 1000
        })
      }

      cpy.gameIdCfg = this.item.gameIdCfg
      cpy.whitelistCfg = this.item.whitelistCfg

      if (this.item.dayPrizeThreshold != null) {
        cpy.dayPrizeThreshold = this.item.dayPrizeThreshold * 1000
      }

      return JSON.stringify(cpy)
    },
    /**
     * 保存配置数据
     */
    setData() {
      // 验证奖励类型
      if (this.item.rewardType === undefined) {
        Message.error('请选择奖励类型')
        return
      }

      // 设置默认使用场景ID
      if (this.item.rewardUseSceneId === undefined) {
        this.item.rewardUseSceneId = 0
      }

      // 验证使用场景
      if (this.item.rewardType !== 1 && this.item.rewardUseSceneId === 0) {
        const typeObj = this.rewardTypes.find(item => item.value === this.item.rewardType)
        const typeName = typeObj ? typeObj.label : ''
        Message.error(`请选择【${typeName}】对应的使用场景`)
        return
      }

      // 编码数据
      this.form.Data = this.encodeData()

      // 对比数据并提交
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(isEdit => {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        updateCustomize(this.form).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },
  }
}
</script>

<style>
/* 固定弹窗内容宽度和最小高度 */
.el-dialog__body {
  min-height: 500px;   /* 你可以根据实际需要调整高度 */
  width: 1200px;       /* 你可以根据实际需要调整宽度 */
  box-sizing: border-box;
  overflow: auto;
}
/* 固定 tab 内容区最小高度 */
.el-dialog__body .el-tabs__content {
  min-height: 500px; /* 根据实际需求调整 */
  box-sizing: border-box;
}


</style>
