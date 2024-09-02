<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>
          <el-form-item label="进入免费模式最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>
          <el-form-item label="进入Bonus模式概率" prop="BonusRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BonusRate" :required="true" >
            <template slot="append">达到【免费模式最小赔率】，但进入Bonus模式的概率</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Bonus图标的倍率配置" prop="BonusOdds">
            <el-input v-model="cfg.BonusOdds" placeholder="例如：2,5,8,10,12,15,20,40" >
            <template slot="append">Bonus图标的倍率【向上浮动10倍】</template>
            </el-input>
          </el-form-item>
          <el-form-item label="普通模式Bonus倍率权重" prop="BonusOddsWeight">
            <el-input v-model="cfg.BonusOddsWeight" placeholder="用,符隔开，值个数上面配置一样" >
            <template slot="append">在普通模式中Bonus图案的倍率权重</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Bonus模式Bonus倍率权重" prop="BonusOddsWeight2">
            <el-input v-model="cfg.BonusOddsWeight2" placeholder="用,符隔开，值个数上面配置一样" >
              <template slot="append">在Bonus模式中Bonus图案的倍率权重</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Bonus图标概率" prop="BonusIconRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BonusIconRate" :required="true" >
              <template slot="append">Bonus模式中转出Bonus图标的概率</template>
            </el-input>
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
  name: 'SlotsAladdinLampExt',
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
