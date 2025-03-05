<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="250px">
          <el-form-item label="普通模式中奖倍数">
            <el-input v-model="cfg.MultiStr" placeholder="请输入内容,如1,2,3,5"> <template slot="append">用,连接 从掉落第1个矩阵开始</template> </el-input>
          </el-form-item>

          <el-form-item label="进入免费模式 scatter出现个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.ScatterNum" :required="true" placeholder="请输入内容,如1,2,3,4,5"> <template slot="append">如1,2,3,4,5 代表出现1个的概率为1/(1+2+3+4+5) </template> </el-input>
          </el-form-item>

          <span style="color: red; font-size: 12px; margin-left: 127px;">例如1;1,2,3;4,5,6;7 空的权重是1, 1*的乘数图标的权重是1, 2*是2, 3*是3, 后面可以继续加. 4*的红包的权重是4, .. 金红包出现的权重是7 </span>
          <el-form-item label="免费模式符号权重">
            <el-input v-model="cfg.SymbolicWeight" placeholder="1,2,3;4,5,6;7"> <template slot="append">用,和;连接 空;乘数;红包;金红包</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,920"> <template slot="append">四个值用 , 连接。如0,150,151,920表示0,150和151,920</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,920,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
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
  name: 'SlotsFortuneBlessingExt',
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
