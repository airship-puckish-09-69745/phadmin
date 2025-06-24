<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">
          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="免费模式额外增加免费的概率" prop="ScatterPlusRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterPlusRate" :required="true">
              <template slot="append">％</template>
            </el-input>
          </el-form-item>

          <el-form-item label="出现金框符号的概率" prop="GoldenSymbolRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.GoldenSymbolRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得随机倍率的概率" prop="GoldenSymbolOddsRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.GoldenSymbolOddsRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得的倍率范围">
            <el-input v-model="cfg.GoldenSymbolOddsRange" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

          <el-form-item label="金框符号获得的倍率权重">
            <el-input v-model="cfg.GoldenSymbolOddsWeights" placeholder="请输入内容,如1,2,100"> <template slot="append">多个值用 , 连接。如1,2,100</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
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
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsPumpkinCashMarsExt',
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
      }
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
    submitFrm() {
      if (!ValidateVueItem(this.$refs['frm2'])) return false
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
