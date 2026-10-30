<template>
  <div class="reward-config-wrap">
    <!-- 未配置时展示添加按钮 -->
    <template v-if="isEmpty">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openDialog">添加奖励</el-button>
    </template>

    <!-- 已配置时展示摘要和编辑入口 -->
    <template v-else>
      <div class="reward-summary">
        <el-tag
          v-for="(text, i) in summaryTexts"
          :key="i"
          size="small"
          effect="plain"
          class="reward-summary__tag"
        >{{ text }}</el-tag>
        <el-button size="mini" type="text" icon="el-icon-edit" @click="openDialog">编辑</el-button>
      </div>
    </template>

    <el-dialog
      title="奖励配置"
      :visible.sync="dialogVisible"
      width="860px"
      append-to-body
      :close-on-click-modal="false"
    >
      <fieldset v-if="showRewardType" class="reward-fieldset">
        <legend><b>奖励类型</b></legend>
        <el-radio-group v-model="selectedRewardType" @change="ensureSelectedConfig">
          <el-radio v-for="item in availableRewardTypes" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </fieldset>

      <fieldset v-if="selectedRewardType === REWARD_TYPE.BET_MONEY && form.betMoney" class="reward-fieldset">
        <legend><b>投注金</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="投注金方式">
            <el-radio-group v-model="form.betMoney.method">
              <el-radio label="1">百分比</el-radio>
              <el-radio label="2">固定数值</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投注金数值">
            <el-input v-model.number="form.betMoney.amount" placeholder="数值" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="发放上限">
            <el-input v-model.number="form.betMoney.limit" placeholder="上限" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
        </el-form>
      </fieldset>

      <fieldset v-if="selectedRewardType === REWARD_TYPE.PROP && form.Prop" class="reward-fieldset">
        <legend><b>道具</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="道具类型">
            <el-select v-model.number="form.Prop.propType" placeholder="请选择" style="width:100%;" @change="onPropTypeChange(form.Prop)">
              <el-option v-for="opt in filteredPropTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="道具名称">
            <el-select v-model.number="form.Prop.propId" placeholder="请选择" style="width:100%;" @change="onPropNameChange(form.Prop)">
              <el-option v-for="opt in getPropNameOptions(form.Prop.propType)" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="可用时间">
            <el-select v-model.number="form.Prop.expireDays" placeholder="请选择" style="width:100%;">
              <el-option v-for="opt in propDayTypeOptionsForEdit" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="道具数量">
            <el-input v-model.number="form.Prop.propNum" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="道具上限">
            <el-input v-model.number="form.Prop.propLimit" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
        </el-form>
      </fieldset>

      <fieldset v-if="selectedRewardType === REWARD_TYPE.RICH_CARD && form.RichCard" class="reward-fieldset">
        <legend><b>富裕卡</b></legend>
        <el-form label-width="100px" size="mini">
          <el-form-item label="适用游戏">
            <el-select v-model.number="form.RichCard.slotsType" filterable placeholder="请选择游戏" style="width:100%;">
              <el-option v-for="opt in richCardGameOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="星级/Bet">
            <el-cascader
              v-model="form.RichCard._richCardSelect"
              :options="richCardOptions"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择"
              style="width:100%;"
              @change="onRichCardSelectChange(form.RichCard)"
            />
          </el-form-item>
          <el-form-item label="奖励数量">
            <el-input v-model.number="form.RichCard.rewardNum" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="有效天数">
            <el-input v-model.number="form.RichCard.validDays" oninput="if(value<0||value===''){value=0}" />
          </el-form-item>
          <el-form-item label="发放上限">
            <el-input v-model.number="form.RichCard.limit" oninput="if(value<0||value===''){value=0}" />
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
import { ITEM_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import { GetMatchTicketRightsId } from '@/utils/propV2'

// 奖励类型：2=投注金 4=道具 6=富裕卡
const REWARD_TYPE = { BET_MONEY: 2, PROP: 4, RICH_CARD: 6 }
const REWARD_TYPE_LABELS = { 2: '投注金', 4: '道具', 6: '富裕卡' }

const PROP_DAY_VALUES = [1, 3, 7, 30]
const PROP_DAY_OPTIONS = PROP_DAY_VALUES.map(day => ({ value: day, label: `${day}天` }))

const PROP_LABEL_MAP = ITEM_TYPE_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function emptyReward() {
  return { rewardType: 0, betMoney: {}, Prop: {}, RichCard: {}}
}

function newBetMoneyItem() {
  return { method: '2', amount: 0, limit: 0 }
}

function newPropItem() {
  return { propType: 0, propId: 0, propName: '', expireDays: 1, propNum: 1, propLimit: 0, sceneId: 0 }
}

function isNewTicketProp(propType) {
  return [
    PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,
    PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW
  ].includes(Number(propType))
}

function newRichCardItem() {
  return { slotsType: 0, richCardLevel: 0, bet: 0, rewardNum: 1, validDays: 2, limit: 0, _richCardSelect: [] }
}

function getLegacySingle(data) {
  if (Array.isArray(data)) return data[0] || {}
  return isObject(data) ? data : {}
}

function hasConfig(data) {
  return isObject(data) && Object.keys(data).length > 0
}

function normalizeRewardData(rawValue) {
  const raw = rawValue || {}
  const result = emptyReward()

  result.betMoney = clone(getLegacySingle(raw.betMoney))
  result.Prop = clone(getLegacySingle(raw.Prop))
  result.RichCard = clone(getLegacySingle(raw.RichCard))
  if (hasConfig(result.Prop)) {
    const sceneId = Number(result.Prop.sceneId)
    result.Prop.sceneId = Number.isFinite(sceneId) ? sceneId : 0
    if (isNewTicketProp(result.Prop.propType) && result.Prop.sceneId <= 0) {
      result.Prop.sceneId = GetMatchTicketRightsId(result.Prop.propId) || 0
    }
    const rawExpireDays = result.Prop.expireDays
    if (rawExpireDays === undefined || rawExpireDays === null || rawExpireDays === '') {
      result.Prop.expireDays = 1
    } else {
      const expireDays = Number(rawExpireDays)
      result.Prop.expireDays = Number.isFinite(expireDays) ? expireDays : 1
    }
  }

  const rewardType = Number(raw.rewardType)
  if (REWARD_TYPE_LABELS[rewardType]) {
    result.rewardType = rewardType
  } else if (hasConfig(result.betMoney)) {
    result.rewardType = REWARD_TYPE.BET_MONEY
  } else if (hasConfig(result.Prop)) {
    result.rewardType = REWARD_TYPE.PROP
  } else if (hasConfig(result.RichCard)) {
    result.rewardType = REWARD_TYPE.RICH_CARD
  }

  return result
}

export default {
  name: 'RewardConfig',
  props: {
    // v-model：{ rewardType, betMoney, Prop, RichCard }
    value: {
      type: Object,
      default: () => emptyReward()
    },
    // 可选奖励类型：2=投注金 4=道具 6=富裕卡
    enabledTypes: {
      type: Array,
      default: () => [2]
    },
    // 是否展示奖励类型选择；隐藏时使用第一个可选类型（或已有配置的类型）
    showRewardType: {
      type: Boolean,
      default: true
    },
    // 限制可选道具类型；空数组代表全部
    propTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      REWARD_TYPE,
      selectedRewardType: 0,
      form: emptyReward(),

      propList: [],
      propOptionsCache: {},

      richCardOptions: [],
      richCardGameOptions: []
    }
  },
  computed: {
    isEmpty() {
      const v = normalizeRewardData(this.value)
      return !hasConfig(v.betMoney) && !hasConfig(v.Prop) && !hasConfig(v.RichCard)
    },
    filteredPropTypeOptions() {
      const enabledOptions = ITEM_TYPE_OPTIONS.filter(item => !item.disabled)
      if (!this.propTypes || this.propTypes.length === 0) {
        return enabledOptions
      }
      return enabledOptions.filter(item => this.propTypes.includes(item.value))
    },
    availableRewardTypes() {
      return this.enabledTypes
        .map(Number)
        .filter(type => REWARD_TYPE_LABELS[type])
        .map(type => ({ value: type, label: REWARD_TYPE_LABELS[type] }))
    },
    propDayTypeOptionsForEdit() {
      if (!this.form.Prop || this.form.Prop.expireDays === undefined || this.form.Prop.expireDays === null) {
        return PROP_DAY_OPTIONS
      }
      const currentValue = Number(this.form.Prop.expireDays)
      if (currentValue === 0) {
        return [...PROP_DAY_OPTIONS, { value: 0, label: '永久' }]
      }
      if (Number.isNaN(currentValue)) {
        return PROP_DAY_OPTIONS
      }
      if (PROP_DAY_VALUES.includes(currentValue)) {
        return PROP_DAY_OPTIONS
      }
      return [
        ...PROP_DAY_OPTIONS,
        { value: currentValue, label: `${currentValue}天` }
      ]
    },
    summaryTexts() {
      const v = normalizeRewardData(this.value)
      const texts = []

      if (hasConfig(v.betMoney)) {
        if (v.betMoney.method === '1') {
          texts.push(`投注金 ${v.betMoney.amount}%，上限 ${v.betMoney.limit / 1000}`)
        } else {
          texts.push(`固定投注金 ₱${v.betMoney.amount / 1000}，上限 ${v.betMoney.limit / 1000}`)
        }
      }

      if (hasConfig(v.Prop)) {
        const typeLabel = PROP_LABEL_MAP[v.Prop.propType] || `道具${v.Prop.propType}`
        const name = v.Prop.propName || `ID:${v.Prop.propId}`
        const days = v.Prop.expireDays === 0 ? '永久' : `${v.Prop.expireDays}天`
        texts.push(`${typeLabel} - ${name} × ${v.Prop.propNum}，${days}，上限 ${v.Prop.propLimit}`)
      }

      if (hasConfig(v.RichCard)) {
        const game = this.richCardGameOptions.find(option => option.value === v.RichCard.slotsType)
        const gameName = game ? game.label : (v.RichCard.slotsType ? `游戏[${v.RichCard.slotsType}]` : '未选游戏')
        const bet = v.RichCard.bet ? `Bet ${Number(v.RichCard.bet) / 1000}` : 'Bet ?'
        const days = v.RichCard.validDays === 0 ? '永久' : `${v.RichCard.validDays}天`
        texts.push(`${gameName}，${v.RichCard.richCardLevel}星富裕卡 × ${v.RichCard.rewardNum}，${bet}，${days}，上限 ${v.RichCard.limit}`)
      }

      return texts
    }
  },
  mounted() {
    if (this.showType(REWARD_TYPE.PROP)) {
      this.fetchPropList()
    }
    if (this.showType(REWARD_TYPE.RICH_CARD)) {
      this.fetchGameAll()
      this.fetchRichCardConfig()
    }
  },
  methods: {
    showType(type) {
      return this.enabledTypes.map(Number).includes(type)
    },

    openDialog() {
      if (this.availableRewardTypes.length === 0) {
        Message.error('未配置可用奖励类型')
        return
      }
      // 将父组件传入的数据标准化
      const normalized = normalizeRewardData(this.value)
      // 投注金回显：固定数值和上限都除以 1000
      if (hasConfig(normalized.betMoney)) {
        if (normalized.betMoney.method === '2') {
          normalized.betMoney.amount = normalized.betMoney.amount / 1000
        }
        normalized.betMoney.limit = normalized.betMoney.limit / 1000
      }

      // 富裕卡回显：将星级和Bet组合成 _richCardSelect 数组，便于级联选择器回显
      if (hasConfig(normalized.RichCard)) {
        normalized.RichCard._richCardSelect = (normalized.RichCard.richCardLevel && normalized.RichCard.bet)
          ? [normalized.RichCard.richCardLevel, normalized.RichCard.bet]
          : []
      }
      // 将已有配置赋值给表单
      this.form = normalized
      // 恢复当前选中的奖励类型
      this.selectedRewardType = this.getInitialRewardType(normalized)
      this.ensureSelectedConfig(this.selectedRewardType)
      // 打开弹窗
      this.dialogVisible = true
    },

    handleConfirm() {
      if (this.selectedRewardType === REWARD_TYPE.PROP) {
        const item = this.form.Prop
        if (!item || !item.propType) { Message.error('请选择道具类型'); return }
        if (!item.propId) { Message.error('请选择道具名称'); return }
        const sceneId = Number(item.sceneId)
        if (isNewTicketProp(item.propType) && (!Number.isFinite(sceneId) || sceneId <= 0)) {
          Message.error('门票场景无效，请重新选择道具名称')
          return
        }
      }

      if (this.selectedRewardType === REWARD_TYPE.RICH_CARD) {
        const item = this.form.RichCard
        if (!item || !item.slotsType) { Message.error('请选择适用游戏'); return }
        if (!item.richCardLevel || !item.bet) { Message.error('请选择富裕卡星级和Bet'); return }
      }

      if (this.selectedRewardType === REWARD_TYPE.BET_MONEY) {
        const item = this.form.betMoney
        if (!item || !item.method) { Message.error('请选择投注金方式'); return }
        if (item.amount === '' || item.limit === '' || item.amount === null || item.limit === null ||
          !Number.isFinite(Number(item.amount)) || !Number.isFinite(Number(item.limit)) ||
          Number(item.amount) < 0 || Number(item.limit) < 0) {
          Message.error('投注金数值和上限必须为有效的非负数')
          return
        }
      }

      const output = emptyReward()
      output.rewardType = this.selectedRewardType || 0
      // 约定：未选中的奖励类型保持为空对象 {}

      if (this.selectedRewardType === REWARD_TYPE.BET_MONEY) {
        const multiple = this.form.betMoney.method === '2' ? 1000 : 1
        output.betMoney = {
          method: this.form.betMoney.method,
          amount: (this.form.betMoney.amount || 0) * multiple,
          limit: (this.form.betMoney.limit || 0) * 1000
        }
      } else if (this.selectedRewardType === REWARD_TYPE.PROP) {
        output.Prop = {
          propType: this.form.Prop.propType,
          propId: this.form.Prop.propId,
          propName: this.form.Prop.propName,
          expireDays: this.form.Prop.expireDays,
          propNum: this.form.Prop.propNum,
          propLimit: this.form.Prop.propLimit,
          sceneId: isNewTicketProp(this.form.Prop.propType) ? Number(this.form.Prop.sceneId) : 0
        }
      } else if (this.selectedRewardType === REWARD_TYPE.RICH_CARD) {
        output.RichCard = {
          slotsType: this.form.RichCard.slotsType,
          richCardLevel: this.form.RichCard.richCardLevel,
          bet: this.form.RichCard.bet,
          rewardNum: this.form.RichCard.rewardNum,
          validDays: this.form.RichCard.validDays,
          limit: this.form.RichCard.limit
        }
      }

      this.$emit('input', output)
      this.dialogVisible = false
    },

    // 获取初始奖励类型
    getInitialRewardType(raw) {
      const enabledSet = new Set(this.availableRewardTypes.map(item => item.value))
      const rewardType = Number(raw.rewardType)
      if (enabledSet.has(rewardType)) return rewardType

      if (hasConfig(raw.betMoney) && enabledSet.has(REWARD_TYPE.BET_MONEY)) return REWARD_TYPE.BET_MONEY
      if (hasConfig(raw.Prop) && enabledSet.has(REWARD_TYPE.PROP)) return REWARD_TYPE.PROP
      if (hasConfig(raw.RichCard) && enabledSet.has(REWARD_TYPE.RICH_CARD)) return REWARD_TYPE.RICH_CARD

      return this.availableRewardTypes[0] ? this.availableRewardTypes[0].value : 0
    },

    ensureSelectedConfig(type) {
      if (type === REWARD_TYPE.BET_MONEY && !hasConfig(this.form.betMoney)) {
        this.form.betMoney = newBetMoneyItem()
      }
      if (type === REWARD_TYPE.PROP && !hasConfig(this.form.Prop)) {
        this.form.Prop = newPropItem()
      }
      if (type === REWARD_TYPE.RICH_CARD && !hasConfig(this.form.RichCard)) {
        this.form.RichCard = newRichCardItem()
      }
      this.form.rewardType = type || 0
    },

    onPropTypeChange(row) {
      row.propId = 0
      row.propName = ''
      row.sceneId = 0
      this.loadPropOptionsForType(row.propType)
    },

    onPropNameChange(row) {
      const options = this.getPropNameOptions(row.propType)
      const found = options.find(option => option.value === row.propId)
      row.propName = found ? found.label : ''
      row.sceneId = found && isNewTicketProp(row.propType) ? found.sceneId : 0
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
      const options = this.propList
        .filter(item => item.item_type === propType && item.status === 1)
        .filter(item => {
          if ([2, 4, 5].includes(item.item_type)) return true
          return item.expire_time * 1000 > currTime
        })
        .map(item => {
          if (!isNewTicketProp(propType)) {
            return { value: item.id, label: item.item_name }
          }
          const sceneId = GetMatchTicketRightsId(item.id)
          return sceneId
            ? { value: item.id, label: item.show_name || item.item_name, sceneId }
            : null
        })
        .filter(Boolean)

      this.$set(this.propOptionsCache, propType, options)
    },

    fetchPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: { PageNum: 1, PageSize: 1000 }
      }).then(res => {
        if (res.RetCode === 0 && res.Data && Array.isArray(res.Data.list)) {
          this.propList = res.Data.list
          this.propOptionsCache = {}
          if (this.form.Prop && this.form.Prop.propType) {
            this.loadPropOptionsForType(this.form.Prop.propType)
          }
        }
      }).catch(() => {})
    },

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

.reward-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.reward-summary__tag {
  max-width: 320px;
  white-space: normal;
  height: auto;
  line-height: 1.4;
  padding: 3px 6px;
}

.reward-fieldset {
  margin-bottom: 16px;
  padding: 12px 14px 6px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fafbfc;
}
</style>
