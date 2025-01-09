<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="300px">
          <el-form-item label="免费模式 wild在12345拓展成一整列的概率" :rules="dataRule(true)">
            <el-input v-model="cfg.WildBigFree" :required="true" placeholder="请输入内容,如10,11,12,13,14"> <template slot="append">如10,11,12,13,14 代表1轴10‱ .. 5轴14‱</template> </el-input>
          </el-form-item>

          <el-form-item label="加倍模式 wild出现个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.WildNumOdds" :required="true" placeholder="请输入内容,如1,2,3,4,5"> <template slot="append">如1,2,3,4,5 代表出现1个的概率为1/(1+2+3+4+5) </template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率(加倍打开)" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOddsMulti" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2(加倍打开)">
            <el-input v-model="cfg.BuyFreeOddsRangeV2Multi" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2(加倍打开)">
            <el-input v-model.number="cfg.BuyFreeRateV2Multi" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
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
  name: 'SlotsFishingMasterExt',
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
      const wildBigFreeValue = this.cfg.WildBigFree;
      const numbers = wildBigFreeValue.split(',').map(num => parseInt(num.trim(), 10));
      if (numbers.length !== 5) {
        this.$message.error('免费模式 wild在12345拓展成一整列的概率  err:请输入5个数字并用,隔开');
        return;
      }
      const big = 1500
      const invalidNumbers = numbers.filter(num => isNaN(num) || num > big);
      if (invalidNumbers.length > 0) {
        this.$message.error(`免费模式 wild在12345拓展成一整列的概率  err:每个数字必须小于等于${big}‱`);
        return;
      }

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
