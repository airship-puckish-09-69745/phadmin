<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="是否开启Bonus">
            <el-switch
              style="display: block"
              v-model="cfg.BonusConfig.Enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.BonusConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="最低出现多少轴才中Bonus">
            <el-input v-model.number="cfg.BonusConfig.MinReels" />
          </el-form-item>
          <ratio-input v-model="cfg.BonusConfig.DoubleOddsRatio" label="翻倍概率(%)" tips="红绿灯是否出现"></ratio-input>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-form ref="colFrm" :model="cfg" label-width="80px">
        <el-col :span="12" :offset="3">
          <el-table
            :data="cfg.BonusConfig.Symbol"
            border
            :summary-method="getSummary"
            show-summary
            :row-style="{height: '80px'}"
            :cell-style="{padding: '0px'}"
            style="width: 100%">
            <el-table-column
              prop="Symbol"
              label="符号">
              <template scope="scope">
                <span v-if="scope.row.Symbol==5">老火车</span>
                <span v-else-if="scope.row.Symbol==6">绿皮车</span>
                <span v-else-if="scope.row.Symbol==7">夜火车</span>
                <span v-else>金火车</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Ratio"
              label="概率%"
              width="180">
              <template scope="scope">
                <ratio-input v-model="scope.row.Ratio" :is-sample="true"></ratio-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="Odds"
              label="赔率"
              width="180">
              <template scope="scope">
                <el-input v-model.number="scope.row.Odds"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsGoldBonus',
  components: { RatioInput, Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {
        'ScatterConfig':{},
        'BonusConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'Symbol':[
            {
              'Symbol':5,
              'Ratio':10,
              'Odds':1,
            },
            {
              'Symbol':6,
              'Ratio':10,
              'Odds':1,
            },
            {
              'Symbol':7,
              'Ratio':0,
              'Odds':1,
            },
            {
              'Symbol':8,
              'Ratio':10,
              'Odds':1,
            }
          ],
          'DoubleOddsRatio':1
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if (!this.setData()) {
        return
      }

      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    getSummary(param) {
      // console.log('summary', param)
      let ratio = 0
      for (const i in param.data) {
        ratio += param.data[i]['Ratio']
      }
      return ['总计', (ratio / 100).toFixed(2),'-']
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        let raw = this.slotsData
        if(raw.hasOwnProperty("BonusConfig")){
          this.cfg = raw
        }else{
          if(raw.hasOwnProperty("ScatterConfig")){
            this.cfg.ScatterConfig = raw.ScatterConfig;
          }
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      let ratio = 0
      for (const i in this.cfg.BonusConfig.Symbol) {
        ratio += this.cfg.BonusConfig.Symbol[i]['Ratio']
      }

      if (ratio !== 10000) {
        this.$message.error('概率合计必须等于100%')
        return false
      }
      console.log("cfg:  ",this.cfg)
      this.slotsData = this.cfg
      // this.$message.success('保存到当前页面成功')

      return true
    }
  }
}
</script>
