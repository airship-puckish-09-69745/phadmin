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
      <!-- 金币（投注金） -->
      <fieldset v-if="showType('betMoney')" style="margin-bottom:16px;">
        <legend><b>金币（投注金）</b></legend>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBetMoney" style="margin-bottom:8px;">添加</el-button>
        <el-table :data="form.betMoney" border size="small" style="width:100%;">
          <el-table-column label="投注金方式" width="220" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.method">
                <el-radio label="percent">百分百</el-radio>
                <el-radio label="fixed">固定数值</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="投注金数值" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.amount" size="mini" placeholder="数值" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="发放上限" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.limit" size="mini" placeholder="上限" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="form.betMoney.splice(scope.$index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </fieldset>

      <!-- 道具 -->
      <fieldset v-if="showType('Prop')" style="margin-bottom:16px;">
        <legend><b>道具</b></legend>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addProp" style="margin-bottom:8px;">添加</el-button>
        <el-table :data="form.Prop" border size="small" style="width:100%;">
          <el-table-column label="道具类型" width="170" align="center">
            <template slot-scope="scope">
              <el-select v-model.number="scope.row.propType" size="mini" placeholder="请选择" style="width:100%;" @change="onPropTypeChange(scope.row)">
                <el-option v-for="opt in filteredPropTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="道具名称" width="190" align="center">
            <template slot-scope="scope">
              <el-select v-model.number="scope.row.propId" size="mini" placeholder="请选择" style="width:100%;" @change="onPropNameChange(scope.row)">
                <el-option v-for="opt in getPropNameOptions(scope.row.propType)" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="可用时间" width="120" align="center">
            <template slot-scope="scope">
              <el-select v-model.number="scope.row.expireDays" size="mini" placeholder="请选择" style="width:100%;">
                <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="道具数量" width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.propNum" size="mini" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="道具上限" width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.propLimit" size="mini" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="form.Prop.splice(scope.$index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </fieldset>

      <!-- 富裕卡 -->
      <fieldset v-if="showType('RichCard')" style="margin-bottom:16px;">
        <legend><b>富裕卡</b></legend>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRichCard" style="margin-bottom:8px;">添加</el-button>
        <el-table :data="form.RichCard" border size="small" style="width:100%;">
          <el-table-column label="适用游戏" width="210" align="center">
            <template slot-scope="scope">
              <el-select v-model.number="scope.row.slotsType" filterable size="mini" placeholder="请选择游戏" style="width:100%;">
                <el-option v-for="opt in richCardGameOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="富裕卡（星级/Bet）" width="200" align="center">
            <template slot-scope="scope">
              <el-cascader
                v-model="scope.row._richCardSelect"
                :options="richCardOptions"
                :props="{ expandTrigger: 'hover' }"
                size="mini"
                placeholder="请选择"
                style="width:100%;"
                @change="onRichCardSelectChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="奖励数量" width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.rewardNum" size="mini" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="有效天数" width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.validDays" size="mini" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="发放上限" width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.limit" size="mini" oninput="if(value<0||value===''){value=0}" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="form.RichCard.splice(scope.$index,1)" />
            </template>
          </el-table-column>
        </el-table>
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
    // 摘要文字列表，用于已配置时显示
    summaryTexts() {
      const v = this.value || emptyReward()
      const texts = []

      // betMoney
      ;(v.betMoney || []).forEach(item => {
        if (item.method === 'percent') {
          texts.push(`投注金 ${item.amount}%，上限 ${item.limit}`)
        } else {
          texts.push(`固定投注金 ₱${item.amount}，上限 ${item.limit}`)
        }
      })

      // Prop
      ;(v.Prop || []).forEach(item => {
        const typeLabel = PROP_LABEL_MAP[item.propType] || `道具${item.propType}`
        const name = item.propName || `ID:${item.propId}`
        const days = item.expireDays === 0 ? '永久' : `${item.expireDays}天`
        texts.push(`${typeLabel} - ${name} × ${item.propNum}，${days}，上限 ${item.propLimit}`)
      })

      // RichCard
      ;(v.RichCard || []).forEach(item => {
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
      // 深拷贝 value 进入表单，为 RichCard 添加 _richCardSelect 辅助字段
      const raw = JSON.parse(JSON.stringify(this.value || emptyReward()))
      raw.betMoney = raw.betMoney || []
      raw.Prop = raw.Prop || []
      raw.RichCard = (raw.RichCard || []).map(item => ({
        ...item,
        _richCardSelect: (item.richCardLevel && item.bet) ? [item.richCardLevel, item.bet] : []
      }))
      this.form = raw
      this.dialogVisible = true
    },

    handleConfirm() {
      if (this.showType('Prop')) {
        for (const item of this.form.Prop) {
          if (!item.propType) { Message.error('请选择道具类型'); return }
          if (!item.propId) { Message.error('请选择道具名称'); return }
        }
      }
      if (this.showType('RichCard')) {
        for (const item of this.form.RichCard) {
          if (!item.slotsType) { Message.error('请选择适用游戏'); return }
          if (!item.richCardLevel || !item.bet) { Message.error('请选择富裕卡星级和Bet'); return }
        }
      }

      // 输出干净 JSON，去掉 _richCardSelect 辅助字段
      const output = {
        betMoney: this.form.betMoney.map(item => ({ method: item.method, amount: item.amount, limit: item.limit })),
        Prop: this.form.Prop.map(item => ({
          propType: item.propType,
          propId: item.propId,
          propName: item.propName,
          expireDays: item.expireDays,
          propNum: item.propNum,
          propLimit: item.propLimit
        })),
        RichCard: this.form.RichCard.map(item => ({
          slotsType: item.slotsType,
          richCardLevel: item.richCardLevel,
          bet: item.bet,
          rewardNum: item.rewardNum,
          validDays: item.validDays,
          limit: item.limit
        }))
      }
      this.$emit('input', output)
      this.dialogVisible = false
    },

    addBetMoney() {
      this.form.betMoney.push(newBetMoneyItem())
    },
    addProp() {
      this.form.Prop.push(newPropItem())
    },
    addRichCard() {
      this.form.RichCard.push(newRichCardItem())
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
