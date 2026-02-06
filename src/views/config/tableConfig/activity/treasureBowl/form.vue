<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="活动开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="展示结束时间：">
                    <el-date-picker v-model="item.ShowEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开始时间：">
                    <el-date-picker v-model="item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：">
                    <el-date-picker v-model="item.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下注/赢钱获得道具比例：">
                    <el-input v-model.number="item.SockGainRatio" size="mini">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发放奖励类型：">
                    <el-select v-model="item.RewardType" placeholder="请选择" size="mini" style="width:90px">
                      <el-option
                        v-for="item in rewardTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-if="item.RewardType === 2" v-model="item.RewardUseSceneId" placeholder="请选择投注金" size="mini" style="width:150px">
                      <el-option
                        v-for="scene in betScenes"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                    <el-select v-if="item.RewardType === 3" v-model="item.RewardUseSceneId" placeholder="请选择返水金" size="mini" style="width:150px">
                      <el-option
                        v-for="scene in rebateScenes"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="当日发奖额阈值：" :required="true">
                    <el-input v-model.number="item.DayPrizeThreshold" size="mini">
                      <template slot="append">（₱）</template>
                    </el-input>
                    <span v-if="todayRaffleAmount > item.DayPrizeThreshold" style="color: red">今日发奖已超阈值（{{todayRaffleAmount}}），已开启限制</span>
                    <span v-else style="color: red">今日发奖总额（{{todayRaffleAmount}}）</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="24">
                <el-form-item label="规则图片横板：" :required="true">
                  <el-col :span="2" v-for="(v,k) in item.RuleImgHor">
                    <span style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Hor')">移除</span>
                      <ImagePicker v-model="item.RuleImgHor[k]" />
                    </span>
                  </el-col>
                  <span style="position: relative;">
                    <el-button @click="addRuleImage('Hor')">添加</el-button>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="规则图片竖版：" :required="true">
                  <el-col :span="2" v-for="(v,k) in item.RuleImgVer">
                    <span style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Vor')">移除</span>
                      <ImagePicker v-model="item.RuleImgVer[k]" />
                    </span>
                  </el-col>
                  <span style="position: relative;">
                    <el-button @click="addRuleImage('Vor')">添加</el-button>
                  </span>
                </el-form-item>
              </el-col>
            </el-form>
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
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.WhitelistCfg.AppIdList">
                  <el-select v-model="item.WhitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px" @change="onAppIdOptionsChange">
                    <el-option
                      v-for="item in appIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="SiteId白名单：" prop="item.WhitelistCfg.SiteIdList">
                  <SiteSelect v-model="item.WhitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px" @change="onSiteIdOptionsChange" />
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

      <el-row>
        <br>
        <el-button type="primary" @click="setData">保存</el-button>
      </el-row>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import { $libShow, DataRule } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { getCustomize, updateCustomize } from '@/api/custome_configV2'
import SiteSelect from '@/components/SiteSelect/index.vue'
// 引入奖池配置和排行榜配置组件
import PrizePoolConfig from './components/PrizePoolConfig.vue'
import RankingConfig from './components/RankingConfig.vue'

export default {
  components: { Compare, ImagePicker, Publish, SiteSelect, PrizePoolConfig, RankingConfig },
  watch: {
    filterText(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    },
    // 监听 GameIdCfg 变化，更新选中状态
    'item.GameIdCfg': {
      handler() {
        if (this.$refs.tree) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.item.GameIdCfg || [])
            this.updateGamesSorted()
          })
        }
      },
      immediate: false
    }
  },
  data() {
    return {
      subKey: 'christmas_fortune_tree_cfg',
      libShow: $libShow,
      form: {
        Data: {}
      },
      item: {
        IsOpen: true,
        StartTime: 1734278400000,
        EndTime: 1735487999000,
        ShowEndTime: 1735574399000,
        SockGainRatio: 10,
        RuleImgHor: [],
        RuleImgVer: [],
        RewardType: 1,
        RewardUseSceneId: 0,
        DayPrizeThreshold: 0, // 当日发奖额阈值
        PrizePoolCfg: [],
        RankCfg: [
          { RankStart: 1, RankEnd: 1, Reward: 28888 },
          { RankStart: 2, RankEnd: 2, Reward: 18888 },
          { RankStart: 3, RankEnd: 3, Reward: 8888 },
          { RankStart: 4, RankEnd: 5, Reward: 2888 },
          { RankStart: 6, RankEnd: 10, Reward: 1888 },
          { RankStart: 11, RankEnd: 20, Reward: 888 },
          { RankStart: 21, RankEnd: 40, Reward: 288 },
          { RankStart: 41, RankEnd: 70, Reward: 188 },
          { RankStart: 71, RankEnd: 100, Reward: 88 }
        ],
        GameIdCfg: [],
        WhitelistCfg: {
          AppIdList: [],
          SiteIdList: []
        }
      },

      // 游戏树相关数据
      allTreeData: [], // 存储所有游戏树数据
      treeData: [], // 当前显示的游戏树数据（根据游戏类型过滤）
      gamesSorted: [], // 已选游戏的排序列表
      gamesSortDialogVisible: false, // 游戏排序弹窗是否显示
      filterText: '', // 游戏搜索过滤文本

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },

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
        },
      ],
      // 奖励类型选项
      rewardTypes: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],

      // 投注金使用场景选项
      betScenes: [
        { 'value': 1, 'label': '任意游戏投注' },
        { 'value': 2, 'label': '仅限Poker类游戏投注' },
        { 'value': 3, 'label': '仅限Slots类游戏投注' },
        { 'value': 4, 'label': '仅限Tongits游戏投注' }
      ],
      // 返水金使用场景选项
      rebateScenes: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
      ],

      // 需要过滤的游戏ID列表
      filterGameIds: [2031, 10002],

      // 当日发奖总额
      todayRaffleAmount: 0
    }
  },
  created() {
    this.getData()
    this.getTodayRaffleAmount()
    console.log(1)
  },
  methods: {
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

      // 确保 GameIdCfg 存在
      if (!this.item.GameIdCfg) {
        this.item.GameIdCfg = []
      }

      const index = this.item.GameIdCfg.indexOf(data.id)
      if (checked) {
        // 选中：添加到列表
        if (index < 0) {
          this.item.GameIdCfg.push(data.id)
        }
      } else {
        // 取消选中：从列表移除
        if (index >= 0) {
          this.item.GameIdCfg.splice(index, 1)
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
      const gameIdCfg = this.item.GameIdCfg || []
      
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
      this.item.GameIdCfg = gameIdCfg
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
            if (this.$refs.tree && this.item.GameIdCfg) {
              this.$refs.tree.setCheckedKeys(this.item.GameIdCfg)
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
      const filteredIds = (this.item.GameIdCfg || []).filter(id => allowedIds.has(id))
      if (filteredIds.length !== (this.item.GameIdCfg || []).length) {
        this.item.GameIdCfg = filteredIds
      }

      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.item.GameIdCfg || [])
        }
        this.updateGamesSorted()
      })
    },

    /**
     * 添加规则图片
     */
    addRuleImage(type) {
      if (type === 'Hor') {
        this.item.RuleImgHor.push('')
      } else {
        this.item.RuleImgVer.push('')
      }
    },

    /**
     * 移除规则图片
     */
    removeRuleImage(index, type) {
      if (type === 'Hor') {
        this.item.RuleImgHor.splice(index, 1)
      } else {
        this.item.RuleImgVer.splice(index, 1)
      }
    },

    /**
     * AppId选项变化处理
     */
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.item.WhitelistCfg.AppIdList)
    },

    /**
     * SiteId选项变化处理
     */
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.item.WhitelistCfg.SiteIdList)
    },

    /**
     * 获取配置数据
     */
    getData() {
      const $this = this
      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          console.log('christmasConfig', response.Data)

          const rankCfg = JSON.parse(JSON.stringify($this.item.RankCfg))
          const whitelistCfg = JSON.parse(JSON.stringify($this.item.WhitelistCfg))
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)

            $this.item.StartTime *= 1000
            $this.item.EndTime *= 1000
            $this.item.ShowEndTime *= 1000

            $this.item.PrizePoolCfg.map(item => {
              item.RaffleLevel /= 1000
              item.RewardMax /= 1000
              item.CoefficientMin /= 10
              item.CoefficientMax /= 10

              item.PrizeCfg.map(prizeCfg => {
                prizeCfg.Reward /= 1000
              })
            })

            $this.item.RankCfg.map(item => {
              item.Reward /= 1000
            })

            if ($this.item.RankCfg.length === 0) {
              $this.item.RankCfg = rankCfg
            }

            if ($this.item.WhitelistCfg == null) {
              $this.item.WhitelistCfg = whitelistCfg
            }

            if ($this.item.DayPrizeThreshold != null) {
              $this.item.DayPrizeThreshold /= 1000
            }

            this.$refs.compare.SetOldVal(old)

            this.getGameAll()
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)

      cpy.StartTime /= 1000
      cpy.EndTime /= 1000
      cpy.ShowEndTime /= 1000

      cpy.PrizePoolCfg = []

      for (const o in this.item.PrizePoolCfg) {
        const obj = {}
        obj.SockBaseNum = this.item.PrizePoolCfg[o].SockBaseNum
        obj.RaffleLevel = this.item.PrizePoolCfg[o].RaffleLevel * 1000
        obj.RewardMax = this.item.PrizePoolCfg[o].RewardMax * 1000
        obj.CoefficientMin = this.item.PrizePoolCfg[o].CoefficientMin * 10
        obj.CoefficientMax = this.item.PrizePoolCfg[o].CoefficientMax * 10

        obj.PrizeCfg = []
        for (const i in this.item.PrizePoolCfg[o].PrizeCfg) {
          const pCfg = {}
          pCfg.Reward = this.item.PrizePoolCfg[o].PrizeCfg[i].Reward * 1000
          pCfg.Weight = this.item.PrizePoolCfg[o].PrizeCfg[i].Weight
          pCfg.PrizeNum = this.item.PrizePoolCfg[o].PrizeCfg[i].PrizeNum
          pCfg.PrizeUnlimited = this.item.PrizePoolCfg[o].PrizeCfg[i].PrizeUnlimited
          obj.PrizeCfg.push(pCfg)
        }

        cpy.PrizePoolCfg.push(obj)
      }

      cpy.RankCfg = []
      for (const i in this.item.RankCfg) {
        const rCfg = {}
        rCfg.RankStart = this.item.RankCfg[i].RankStart
        rCfg.RankEnd = this.item.RankCfg[i].RankEnd
        rCfg.Reward = this.item.RankCfg[i].Reward * 1000
        cpy.RankCfg.push(rCfg)
      }

      cpy.GameIdCfg = this.item.GameIdCfg

      cpy.WhitelistCfg = this.item.WhitelistCfg

      if (this.item.DayPrizeThreshold!= null) {
        cpy.DayPrizeThreshold = this.item.DayPrizeThreshold * 1000
      }

      return JSON.stringify(cpy)
    },
    setData() {
      if (this.item.RewardType === undefined) {
        Message.error('请选择奖励类型')
        return
      }
      if (this.item.RewardUseSceneId === undefined) {
        this.item.RewardUseSceneId = 0
      }
      if (this.item.RewardType !== 1 && this.item.RewardUseSceneId === 0) {
        const typeObj = this.rewardTypes.find(item => item.value === this.item.RewardType)
        const typeName = typeObj ? typeObj.label : ''
        Message.error(`请选择【${typeName}】对应的使用场景`)
        return
      }

      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        updateCustomize($this.form).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },

    /**
     * 获取今日发奖总额
     */
    getTodayRaffleAmount() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/activity/christmas/today/raffle/amount'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getTodayRaffleAmount', response.Data)
          if (response.Data) {
            $this.todayRaffleAmount = response.Data / 1000
            console.log('todayRaffleAmount', $this.todayRaffleAmount)
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
