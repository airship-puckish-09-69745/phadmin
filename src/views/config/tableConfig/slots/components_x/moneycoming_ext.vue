<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="260px">

          <el-form-item label="下注额5中奖Jackpot的概率">
            <el-input v-model="cfg.JackpotOdds5" placeholder="请输入内容,如5,10,15,50"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额5中奖Jackpot的概率对应权重">
            <el-input v-model="cfg.JackpotWeight5" placeholder="请输入内容,如10,10,10,10"> <template slot="append">如0.00040%填40，多个用,号隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="下注额10中奖Jackpot的概率">
            <el-input v-model="cfg.JackpotOdds10" placeholder="请输入内容,如5,10,15,50"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额10中奖Jackpot的概率对应权重">
            <el-input v-model="cfg.JackpotWeight10" placeholder="请输入内容,如10,10,10,10"> <template slot="append">如0.00040%填40，多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额50中奖Jackpot的概率">
            <el-input v-model="cfg.JackpotOdds50" placeholder="请输入内容,如5,10,15,50"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额50中奖Jackpot的概率对应权重">
            <el-input v-model="cfg.JackpotWeight50" placeholder="请输入内容,如10,10,10,10"> <template slot="append">如0.00040%填40，多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额100中奖Jackpot的概率">
            <el-input v-model="cfg.JackpotOdds100" placeholder="请输入内容,如5,10,15,50"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额100中奖Jackpot的概率对应权重">
            <el-input v-model="cfg.JackpotWeight100" placeholder="请输入内容,如10,10,10,10"> <template slot="append">如0.00040%填40，多个用,号隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="下注额5对应jp抽水权重">
            <el-input v-model="cfg.JackpotFeeWeight5" placeholder="请输入内容,如10,10,10,10"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额10对应jp抽水权重">
            <el-input v-model="cfg.JackpotFeeWeight10" placeholder="请输入内容,如10,10,10,10"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额50对应jp抽水权重">
            <el-input v-model="cfg.JackpotFeeWeight50" placeholder="请输入内容,如10,10,10,10"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>
          <el-form-item label="下注额100对应jp抽水权重">
            <el-input v-model="cfg.JackpotFeeWeight100" placeholder="请输入内容,如10,10,10,10"> <template slot="append">多个用,号隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水比例">
            <el-input v-model.number="cfg.JackpotFee" placeholder="请输入数字内容"> <template slot="append">%</template> </el-input>
          </el-form-item>

          <!--<el-form-item label="进入Bouns模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>-->


        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem } from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsMoneycomingExt',
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
      },
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
        $this.lock = false
      })
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
