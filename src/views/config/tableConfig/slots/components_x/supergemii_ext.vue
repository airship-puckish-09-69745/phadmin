<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="普通模式中奖倍数">
            <el-input v-model="cfg.MultiStr" placeholder="请输入内容,如1,2,3,5,7"> <template slot="append">六个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式中奖倍数权重">
            <el-input v-model="cfg.MultiStrWeight" placeholder="请输入内容,如10,10,10,10,10"> <template slot="append">六个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式中奖倍数">
            <el-input v-model="cfg.FreeMultiStr" placeholder="请输入内容,如2,4,6,8,10"> <template slot="append">六个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式中奖倍数权重">
            <el-input v-model="cfg.FreeMultiStrWeight" placeholder="请输入内容,如10,10,10,10,10"> <template slot="append">六个值用 , 连接</template> </el-input>
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

          <el-form-item label="转盘阶段1收集数量" prop="WildCollectNumStage1" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.WildCollectNumStage1" :required="true" />
          </el-form-item>

          <el-form-item label="转盘阶段1倍数">
            <el-input v-model="cfg.WildMultiStrStage1" placeholder="请输入内容,如1,3,5,8,10,15,20,30,50,80,100,200"> <template slot="append">12个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="转盘阶段2收集数量" prop="WildCollectNumStage2" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.WildCollectNumStage2" :required="true" />
          </el-form-item>

          <el-form-item label="转盘阶段2倍数">
            <el-input v-model="cfg.WildMultiStrStage2" placeholder="请输入内容,如2,6,10,16,20,30,40,60,80,100,200,500"> <template slot="append">12个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="转盘阶段3收集数量" prop="WildCollectNumStage3" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.WildCollectNumStage3" :required="true" />
          </el-form-item>

          <el-form-item label="转盘阶段3倍数">
            <el-input v-model="cfg.WildMultiStrStage3" placeholder="请输入内容,如4,10,20,30,40,60,80,90,100,200,500,1000"> <template slot="append">12个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="抽取正数剧本%" prop="SuckOddsRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.SuckOddsRate" :required="true" />
          </el-form-item>

          <el-form-item label="抽取达标后图标概率">
            <el-input v-model="cfg.SuckOddsAchieveRate" placeholder="请输入内容,如1000,50,2500,50,5000,50"> <template slot="append">6个值用 , 连接。如1000,50,2500,50,5000,50</template> </el-input>
          </el-form-item>

          <el-form-item label="转盘奖励比例%">
            <el-input v-model="cfg.WildRewardRate" placeholder="请输入内容,如120,20,110,30,100,50"> <template slot="append">两个值为一组, 连接。如120,20,110,30,100,50</template> </el-input>
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
  name: 'SlotsSuperGemIIExt',
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
