<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="250px">
          <el-form-item label="普通模式 scatter个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.ScatterNumWt" :required="true" placeholder="请输入内容,如0,1,2"> <template slot="append">如0,1,2 代表出现0个的权重为0 </template> </el-input>
          </el-form-item>

          <span style="color: red; font-size: 11px;">注: 位置0:无 位置1:大图标模式 位置2:大wild模式 位置3:分散wild模式 位置4:翻倍wild模式</span>
          <el-form-item label="游戏模式的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.GameModeWt" :required="true" placeholder="请输入内容,如0,1,2,3,4"> <template slot="append">如0,1,2,3,4 代表为无模式的权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="大图标模式 出现大图标个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.GameMode1BigNumWt" :required="true" placeholder="请输入内容,如0,1,2,3"> <template slot="append">如0,1,2,3 代表出现0个大图标的权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="分散wild模式 分散个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.GameMode3WildNumWt" :required="true" placeholder="请输入内容,如0,1,2,3"> <template slot="append">如0,1,2,3 代表分散0个小wild权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="翻倍wild模式 分散个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.GameMode4WildNumWt" :required="true" placeholder="请输入内容,如0,1,2,3"> <template slot="append">如0,1,2,3 代表分散0个小wild权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="翻倍wild模式 wild倍数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.GameMode4WildOddsWt" :required="true" placeholder="请输入内容,如0,1,2,3"> <template slot="append">如0,1,2,3 代表小wild是0倍权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,1130"> <template slot="append">四个值用 , 连接。如0,150,151,1130表示0,150和151,1130</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,1130,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
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
  name: 'SlotsWrathOfZeus2Ext',
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
      const scatterNumWt = this.cfg.ScatterNumWt;
      const numbers = scatterNumWt.split(',').map(num => parseInt(num.trim(), 10));
      if (numbers.length !== 3) {
        this.$message.error('普通模式 scatter个数的权重, 只支持0 1 2个的权重配置 3个scatter由剧本和进免费的最小倍数控制');
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
