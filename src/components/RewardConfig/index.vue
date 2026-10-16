<template>
  <div class="reward-config-wrap">
    <!-- 未配置时显示添加按钮 -->
    <template v-if="isEmpty">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openDialog">添加奖励</el-button>
    </template>
    <!-- 已配置时显示摘要 + 编辑按钮 -->
    <template v-else>
      <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
        <el-tag
          v-for="(text, i) in summaryTexts"
          :key="i"
          size="small"
          effect="plain"
          style="max-width:320px;white-space:normal;height:auto;line-height:1.4;padding:3px 6px;"
        >{{ text }}</el-tag>
        <el-button size="mini" type="text" icon="el-icon-edit" @click="openDialog">编辑</el-button>
      </div>
    </template>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="奖励配置"
      :visible.sync="dialogVisible"
      width="860px"
      append-to-body
      :close-on-click-modal="false"
    >
      <fieldset style="margin-bottom:16px;">
        <legend><b>奖励类型</b></legend>
        <el-radio-group v-model="selectedRewardType" @change="ensureSingleRow">
          <el-radio v-for="item in availableRewardTypes" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </fieldset>

      <!-- 投注金 -->
      <fieldset v-if="selectedRewardType === 'betMoney' && form.betMoney[0]" style="margin-bottom:16px;">
        <legend><b>投注金</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="投注金方式">
            <el-radio-group v-model="form.betMoney[0].method">
              <el-radio label="percent">百分比</el-radio>
              <el-radio label="fixed">固定数值</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投注金数值">
            <el-input v-model.number="form.betMoney[0].amount" placeholder="数值" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="发放上限">
            <el-input v-model.number="form.betMoney[0].limit" placeholder="上限" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
        </el-form>
      </fieldset>

      <!-- 道具 -->
      <fieldset v-if="selectedRewardType === 'Prop' && form.Prop[0]" style="margin-bottom:16px;">
        <legend><b>道具</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="道具类型">
            <el-select v-model.number="form.Prop[0].propType" placeholder="请选择" style="width:100%;" @change="onPropTypeChange(form.Prop[0])">
              <el-option v-for="opt in filteredPropTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="道具名称">
            <el-select v-model.number="form.Prop[0].propId" placeholder="请选择" style="width:100%;" @change="onPropNameChange(form.Prop[0])">
              <el-option v-for="opt in getPropNameOptions(form.Prop[0].propType)" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="可用时间">
            <el-select v-model.number="form.Prop[0].expireDays" placeholder="请选择" style="width:100%;">
              <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="道具数量">
            <el-input v-model.number="form.Prop[0].propNum" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="道具上限">
            <el-input v-model.number="form.Prop[0].propLimit" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
        </el-form>
      </fieldset>

      <!-- 富裕卡 -->
      <fieldset v-if="selectedRewardType === 'RichCard' && form.RichCard[0]" style="margin-bottom:16px;">
        <legend><b>富裕卡</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="适用游戏">
            <el-select v-model.number="form.RichCard[0].slotsType" filterable placeholder="请选择游戏" style="width:100%;">
              <el-option v-for="opt in richCardGameOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="星级/Bet">
            <el-cascader
              v-model="form.RichCard[0]._richCardSelect"
              :options="richCardOptions"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择"
              style="width:100%;"
              @change="onRichCardSelectChange(form.RichCard[0])"
            />
          </el-form-item>
          <el-form-item label="奖励数量">
            <el-input v-model.number="form.RichCard[0].rewardNum" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="有效天数">
            <el-input v-model.number="form.RichCard[0].validDays" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="发放上限">
            <el-input v-model.number="form.RichCard[0].limit" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
        </el-form>
      </fieldset>

      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'

// 全部道具类型选项（label映射）
const ALL_PROP_TYPE_OPTIONS = [
  { value: 1, label: 'Tongits门票' },
  { value: 2, label: '头像框' },
  { value: 3, label: '德州参赛券' },
  { value: 4, label: '德州头像框' },
  { value: 5, label: 'SlotFreeSpin' },
  { value: 7, label: '新版Tongits门票' },
  { value: 8, label: '新版德州参赛券' },
  { value: 9, label: '新版Pusoy门票' },
  { value: 10, label: '互动道具' },
  { value: 11, label: 'Pot券' }
]

const PROP_LABEL_MAP = ALL_PROP_TYPE_OPTIONS.reduce((acc, o) => { acc[o.value] = o.label; return acc }, {})

function emptyReward() {
  return { betMoney: [], Prop: [], RichCard: [] }
}

function newBetMoneyItem() {
  return { method: 'fixed', amount: 0, limit: 0 }
}

function newPropItem() {
  return { propType: 0, propId: 0, propName: '', expireDays: 1, propNum: 1, propLimit: 0 }
}

function newRichCardItem() {
  return { slotsType: 0, richCardLevel: 0, bet: 0, rewardNum: 1, validDays: 2, limit: 0, _richCardSelect: [] }
}

export default {
  name: 'RewardConfig',
  props: {
    // v-model 绑定，格式 {"betMoney":[],"Prop":[],"RichCard":[]}
    value: {
      type: Object,
      default: () => emptyReward()
    },
    // 允许的奖励类型，可选值: 'betMoney' | 'Prop' | 'RichCard'；默认只显示投注金
    enabledTypes: {
      type: Array,
      default: () => ['betMoney']
    },
    // 允许的道具类型编号数组，空数组表示显示所有类型
    propTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectedRewardType: '',
      // 弹窗内的编辑表单，从 value 初始化
      form: emptyReward(),

      // 道具列表（从接口获取）
      propList: [],
      // 按道具类型缓存的选项 { [propType]: [{value, label}] }
      propOptionsCache: {},

      // 富裕卡 cascader 选项
      richCardOptions: [],
      // 适用游戏选项
      richCardGameOptions: [],

      propDayTypeOptions: [
        { value: 1, label: '1天' },
        { value: 3, label: '3天' },
        { value: 7, label: '7天' },
        { value: 30, label: '30天' },
        { value: 365, label: '365天' },
        { value: 0, label: '永久' }
      ]
    }
  },
  computed: {
    isEmpty() {
      const v = this.value || emptyReward()
      return (!v.betMoney || v.betMoney.length === 0) &&
             (!v.Prop || v.Prop.length === 0) &&
             (!v.RichCard || v.RichCard.length === 0)
    },
    // 根据 propTypes prop 过滤道具类型选项
    filteredPropTypeOptions() {
      if (!this.propTypes || this.propTypes.length === 0) {
        return ALL_PROP_TYPE_OPTIONS
      }
      return ALL_PROP_TYPE_OPTIONS.filter(o => this.propTypes.includes(o.value))
    },
    availableRewardTypes() {
      const labels = {
        betMoney: '投注金',
        Prop: '道具',
        RichCard: '富裕卡'
      }
      return this.enabledTypes
        .filter(type => labels[type])
        .map(type => ({ value: type, label: labels[type] }))
    },
    // 摘要文字列表，用于已配置时显示
    summaryTexts() {
      const v = this.value || emptyReward()
      const texts = []

      // betMoney
      ;(v.betMoney || []).slice(0, 1).forEach(item => {
        if (item.method === 'percent') {
          texts.push(`投注金 ${item.amount}%，上限 ${item.limit}`)
        } else {
          texts.push(`固定投注金 ₱${item.amount}，上限 ${item.limit}`)
        }
      })

      // Prop
      ;(v.Prop || []).slice(0, 1).forEach(item => {
        const typeLabel = PROP_LABEL_MAP[item.propType] || `道具${item.propType}`
        const name = item.propName || `ID:${item.propId}`
        const days = item.expireDays === 0 ? '永久' : `${item.expireDays}天`
        texts.push(`${typeLabel} - ${name} × ${item.propNum}，${days}，上限 ${item.propLimit}`)
      })

      // RichCard
      ;(v.RichCard || []).slice(0, 1).forEach(item => {
        const game = this.richCardGameOptions.find(o => o.value === item.slotsType)
        const gameName = game ? game.label : (item.slotsType ? `游戏[${item.slotsType}]` : '未选游戏')
        const bet = item.bet ? `Bet ${Number(item.bet) / 1000}` : 'Bet ?'
        const days = item.validDays === 0 ? '永久' : `${item.validDays}天`
        texts.push(`${gameName}，${item.richCardLevel}星富裕卡 × ${item.rewardNum}，${bet}，${days}，上限 ${item.limit}`)
      })

      return texts
    }
  },
  mounted() {
    if (this.showType('Prop')) {
      this.fetchPropList()
    }
    if (this.showType('RichCard')) {
      this.fetchGameAll()
      this.fetchRichCardConfig()
    }
  },
  methods: {
    showType(type) {
      return this.enabledTypes.includes(type)
    },

    openDialog() {
      if (this.availableRewardTypes.length === 0) {
        Message.error('未配置可用奖励类型')
        return
      }
      // 深拷贝 value 进入表单，为 RichCard 添加 _richCardSelect 辅助字段
      const raw = JSON.parse(JSON.stringify(this.value || emptyReward()))
      raw.betMoney = (raw.betMoney || []).slice(0, 1)
      raw.Prop = (raw.Prop || []).slice(0, 1)
      raw.RichCard = (raw.RichCard || []).slice(0, 1).map(item => ({
        ...item,
        _richCardSelect: (item.richCardLevel && item.bet) ? [item.richCardLevel, item.bet] : []
      }))
      this.form = raw
      this.selectedRewardType = this.getInitialRewardType(raw)
      this.ensureSingleRow(this.selectedRewardType)
      this.dialogVisible = true
    },

    handleConfirm() {
      if (this.selectedRewardType === 'Prop') {
        const item = this.form.Prop[0]
        if (!item) { Message.error('请先配置道具奖励'); return }
        if (!item.propType) { Message.error('请选择道具类型'); return }
        if (!item.propId) { Message.error('请选择道具名称'); return }
      }
      if (this.selectedRewardType === 'RichCard') {
        const item = this.form.RichCard[0]
        if (!item) { Message.error('请先配置富裕卡奖励'); return }
        if (!item.slotsType) { Message.error('请选择适用游戏'); return }
        if (!item.richCardLevel || !item.bet) { Message.error('请选择富裕卡星级和Bet'); return }
      }
      if (this.selectedRewardType === 'betMoney') {
        const item = this.form.betMoney[0]
        if (!item) { Message.error('请先配置投注金奖励'); return }
        if (!item.method) { Message.error('请选择投注金方式'); return }
        if (item.amount === '' || item.limit === '' || item.amount === null || item.limit === null ||
          !Number.isFinite(Number(item.amount)) || !Number.isFinite(Number(item.limit)) ||
          Number(item.amount) < 0 || Number(item.limit) < 0) {
          Message.error('投注金数值和上限必须为有效的非负数')
          return
        }
      }

      // 输出干净 JSON，去掉 _richCardSelect 辅助字段
      const output = emptyReward()
      if (this.selectedRewardType === 'betMoney') {
        const item = this.form.betMoney[0]
        output.betMoney = [{ method: item.method, amount: item.amount, limit: item.limit }]
      } else if (this.selectedRewardType === 'Prop') {
        const item = this.form.Prop[0]
        output.Prop = [{
          propType: item.propType,
          propId: item.propId,
          propName: item.propName,
          expireDays: item.expireDays,
          propNum: item.propNum,
          propLimit: item.propLimit
        }]
      } else if (this.selectedRewardType === 'RichCard') {
        const item = this.form.RichCard[0]
        output.RichCard = [{
          slotsType: item.slotsType,
          richCardLevel: item.richCardLevel,
          bet: item.bet,
          rewardNum: item.rewardNum,
          validDays: item.validDays,
          limit: item.limit
        }]
      }
      this.$emit('input', output)
      this.dialogVisible = false
    },

    getInitialRewardType(raw) {
      const enabledTypeSet = new Set(this.availableRewardTypes.map(item => item.value))
      if (raw.betMoney.length > 0 && enabledTypeSet.has('betMoney')) return 'betMoney'
      if (raw.Prop.length > 0 && enabledTypeSet.has('Prop')) return 'Prop'
      if (raw.RichCard.length > 0 && enabledTypeSet.has('RichCard')) return 'RichCard'
      return this.availableRewardTypes[0] ? this.availableRewardTypes[0].value : ''
    },
    ensureSingleRow(type) {
      if (type === 'betMoney' && this.form.betMoney.length === 0) {
        this.form.betMoney = [newBetMoneyItem()]
      }
      if (type === 'Prop' && this.form.Prop.length === 0) {
        this.form.Prop = [newPropItem()]
      }
      if (type === 'RichCard' && this.form.RichCard.length === 0) {
        this.form.RichCard = [newRichCardItem()]
      }
    },
    onPropTypeChange(row) {
      row.propId = 0
      row.propName = ''
      // 预加载该类型的道具选项
      this.loadPropOptionsForType(row.propType)
    },

    onPropNameChange(row) {
      const options = this.getPropNameOptions(row.propType)
      const found = options.find(o => o.value === row.propId)
      row.propName = found ? found.label : ''
    },

    onRichCardSelectChange(row) {
      if (row._richCardSelect && row._richCardSelect.length === 2) {
        row.richCardLevel = row._richCardSelect[0]
        row.bet = row._richCardSelect[1]
      }
    },

    getPropNameOptions(propType) {
      if (!propType) return []
      if (!this.propOptionsCache[propType]) {
        this.loadPropOptionsForType(propType)
        return []
      }
      return this.propOptionsCache[propType]
    },

    loadPropOptionsForType(propType) {
      if (!propType) return
      const currTime = Date.now()
      const opts = this.propList
        .filter(p => p.item_type === propType && p.status === 1)
        .filter(p => {
          // 头像框/德州头像框/SlotFreeSpin 无需检查过期时间
          if ([2, 4, 5].includes(p.item_type)) return true
          return p.expire_time * 1000 > currTime
        })
        .map(p => ({ value: p.id, label: p.item_name }))
      this.$set(this.propOptionsCache, propType, opts)
    },

    // 接口：获取道具列表
    fetchPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: { PageNum: 1, PageSize: 1000 }
      }).then(res => {
        if (res.RetCode === 0 && res.Data && Array.isArray(res.Data.list)) {
          this.propList = res.Data.list
        }
      }).catch(() => {})
    },

    // 接口：获取全部游戏列表（用于富裕卡适用游戏）
    fetchGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(res => {
        if (res.RetCode !== 0) return
        this.richCardGameOptions = (res.Data || [])
          .filter(item => Number(item.CategoryID) === 1)
          .map(item => ({ value: Number(item.Gid), label: `${item.Name} [${item.Gid}]` }))
          .sort((a, b) => a.value - b.value)
      }).catch(() => {})
    },

    // 接口：获取富裕卡配置（星级 + Bet）
    fetchRichCardConfig() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: { SubKey: 'slotsmission' }
      }).then(res => {
        if (res.RetCode !== 0 || !res.Data) return
        let config = {}
        try { config = JSON.parse(res.Data.Data || '{}') } catch (e) { return }
        this.richCardOptions = (config.RichCardList || []).map(item => ({
          value: Number(item.RichCardLevel),
          label: `${item.RichCardLevel}星`,
          children: (item.Bets || []).map(bet => ({
            value: Number(bet),
            label: `Bet ${Number(bet) / 1000}`
          }))
        }))
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.reward-config-wrap {
  display: inline-block;
  width: 100%;
}
</style>
