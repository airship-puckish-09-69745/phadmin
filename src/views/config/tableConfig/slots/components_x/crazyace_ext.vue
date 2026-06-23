<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="解锁黄金图标下注值">
            <el-input v-model="tempGoldSymbolStr" placeholder="请输入内容,如1,2,3,5">
              <template slot="append">四个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="解锁JP图标下注值">
            <el-input v-model="tempJackpotSymbolStr" placeholder="请输入内容,如2,4,6,10">
              <template slot="append">四个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="JP期望中奖金额">
            <el-input v-model="tempJackpotHopeStr" placeholder="请输入内容,如2,4,6,10">
              <template slot="append">四个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="JP中奖限制">
            <el-input v-model="tempJackpotLimitStr" placeholder="请输入内容,如2,4,6,10">
              <template slot="append">四个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="发放JP中奖比例">
            <el-input v-model="cfg.JackpotMultiStr" placeholder="请输入内容,如2,4,6,10"> <template slot="append">四个值用 , 连接单位%</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水比例" prop="JackpotFeeRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JackpotFeeRate" placeholder="请输入内容,如2"><template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水权重">
            <el-input v-model="cfg.JackpotFeeWeightStr" placeholder="请输入内容,如2,4,6,10"> <template slot="append">四个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="JP奖池滚动比例" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JackpotShowPoolRate" placeholder="请输入内容,如2"><template slot="append">%</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

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
  name: 'SlotsCrazyAceExt',
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
      // 临时变量
      tempGoldSymbolStr: '',
      tempJackpotSymbolStr: '',
      tempJackpotHopeStr: '',
      tempJackpotLimitStr: '',
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
      // 放大1000倍并保存到cfg
      this.cfg.GoldSymbolStr = this.scaleUp(this.tempGoldSymbolStr)
      this.cfg.JackpotSymbolStr = this.scaleUp(this.tempJackpotSymbolStr)
      this.cfg.JackpotHopeStr = this.scaleUp(this.tempJackpotHopeStr)
      this.cfg.JackpotLimitStr = this.scaleUp(this.tempJackpotLimitStr)

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
        // 初始化临时变量为缩小后的值
        this.tempGoldSymbolStr = this.scaleDown(this.cfg.GoldSymbolStr)
        this.tempJackpotSymbolStr = this.scaleDown(this.cfg.JackpotSymbolStr)
        this.tempJackpotHopeStr = this.scaleDown(this.cfg.JackpotHopeStr)
        this.tempJackpotLimitStr = this.scaleDown(this.cfg.JackpotLimitStr)
      }
    },
    // 缩小1000倍的方法
    scaleDown(value) {
      if (value) {
        return value.split(',').map(val => (parseFloat(val) / 1000).toString()).join(',')
      }
      return ''
    },
    // 放大1000倍的方法
    scaleUp(value) {
      if (value) {
        return value.split(',').map(val => (parseFloat(val) * 1000).toString()).join(',')
      }
      return ''
    }
  }
}
</script>
