<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px" class="row-line">
      <h3 style="text-align:center;">Scatter配置</h3>
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <el-form-item label="是否开启scatter">
            <el-switch
              style="display: block"
              v-model="cfg.ScatterConfig.Enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.ScatterConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="最低出现多少轴才中scatter">
            <el-input v-model.number="cfg.ScatterConfig.MinReels" />
          </el-form-item>

          <el-form-item label="3轴次数">
            <el-input v-model.number="cfg.ScatterConfig.Scatter3FreeGameTimes" />
          </el-form-item>
          <el-form-item label="4轴次数">
            <el-input v-model.number="cfg.ScatterConfig.Scatter4FreeGameTimes" />
          </el-form-item>
          <el-form-item label="5轴次数">
            <el-input v-model.number="cfg.ScatterConfig.Scatter5FreeGameTimes" />
          </el-form-item>
          <ratio-input v-model="cfg.ScatterConfig.JoinScatterRatio" label="进入小游戏的概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.ScatterConfig.Scatter3Ratio" label="3轴scatter的概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.ScatterConfig.Scatter4Ratio" label="4轴scatter的概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.ScatterConfig.Scatter5Ratio" label="5轴scatter的概率(%)" ></ratio-input>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 30px" class="row-line">
      <h3 style="text-align:center;">Bonus配置</h3>
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

          <ratio-input v-model="cfg.BonusConfig.HolyStoneRatio" label="命中圣石概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.HolyCupRatio" label="命中圣杯概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.CupboardRatio" label="命中法柜概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.CrystalSkeletonRatio" label="命中水晶骷髅概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.BoxRatio" label="命中宝箱概率(%)" ></ratio-input>

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

<style>
  .row-line{
    border-radius: 4px;
    border-style:dashed;
  }
</style>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsGoldScatterPattern',
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
        'ScatterConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'FreeGameTimes': 1,
          'JoinScatterRatio': 0,
          'Scatter3Ratio': 0,
          'Scatter4Ratio': 0,
          'Scatter5Ratio': 0
        },
        'BonusConfig':{}
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
      if(!this.setData()){
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
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        let raw = this.slotsData
        if(raw.hasOwnProperty("ScatterConfig")){
          this.cfg = raw
        }else{
          if(raw.hasOwnProperty("BonusConfig")){
            this.cfg.BonusConfig = raw.BonusConfig;
          }
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData(){
      if(this.cfg.ScatterConfig.Scatter5Ratio+this.cfg.ScatterConfig.Scatter3Ratio+this.cfg.ScatterConfig.Scatter4Ratio!=10000){
        this.$message.error('Scatter概率不等于100%')
        return false
      }
      if(this.cfg.BonusConfig.HolyStoneRatio+this.cfg.BonusConfig.HolyCupRatio+this.cfg.BonusConfig.CupboardRatio+this.cfg.BonusConfig.CrystalSkeletonRatio+this.cfg.BonusConfig.BoxRatio!=10000){
        this.$message.error('Bonus命中概率之和不等于100%')
        return false
      }
      if(this.cfg.BonusConfig.HolyStoneRatio <=0){
        this.$message.error('bonus各配置不允许出现概率为0的情况')
        return false
      }
      if (this.cfg.BonusConfig.HolyCupRatio <= 0){
        this.$message.error('bonus各配置不允许出现概率为0的情况')
        return false
      }
      if (this.cfg.BonusConfig.CupboardRatio <= 0){
        this.$message.error('bonus各配置不允许出现概率为0的情况')
        return false
      }
      if (this.cfg.BonusConfig.CrystalSkeletonRatio <= 0){
        this.$message.error('bonus各配置不允许出现概率为0的情况')
        return false
      }
      if (this.cfg.BonusConfig.BoxRatio <= 0){
        this.$message.error('bonus各配置不允许出现概率为0的情况')
        return false
      }
      return true
    }
  }
}
</script>
