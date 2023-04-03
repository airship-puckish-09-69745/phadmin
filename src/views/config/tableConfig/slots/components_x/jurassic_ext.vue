<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <h3 style="text-align:center;">Free spins 配置</h3>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.FreeSpinConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="3轴命中免费次数">
            <el-input v-model.number="cfg.FreeSpinConfig.ThreeFreeGameTimes" />
          </el-form-item>
          <el-form-item label="4轴命中免费次数">
            <el-input v-model.number="cfg.FreeSpinConfig.FourFreeGameTimes" />
          </el-form-item>
          <el-form-item label="5轴命中免费次数">
            <el-input v-model.number="cfg.FreeSpinConfig.FiveFreeGameTimes" />
          </el-form-item>

          <h3 style="text-align:center;">Wild 概率配置</h3>
          <ratio-input v-model="cfg.WildConfig.WildCol1HitRatio" label="Wild轴1(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol2HitRatio" label="Wild轴2(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol3HitRatio" label="Wild轴3(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol4HitRatio" label="Wild轴4(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol5HitRatio" label="Wild轴5(%)" ></ratio-input>

          <h3 style="text-align:center;">Jackpot 概率配置</h3>
          <ratio-input v-model="cfg.JackpotConfig.Dinosaur1HitRatio" label="恐龙1(%)" ></ratio-input>
          <ratio-input v-model="cfg.JackpotConfig.Dinosaur2HitRatio" label="恐龙2(%)" ></ratio-input>
          <ratio-input v-model="cfg.JackpotConfig.Dinosaur3HitRatio" label="恐龙3(%)" ></ratio-input>
          <ratio-input v-model="cfg.JackpotConfig.Dinosaur4HitRatio" label="恐龙4(%)" ></ratio-input>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsJurassicExt',
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
        'FreeSpinConfig': {
          'PerReelsMinNumber': 1,
          'ThreeFreeGameTimes': 6,
          'FourFreeGameTimes': 7,
          'FiveFreeGameTimes': 1
        },
        'WildConfig':{
          'WildCol1HitRatio':0,
          'WildCol2HitRatio':0,
          'WildCol3HitRatio':0,
          'WildCol4HitRatio':0,
          'WildCol5HitRatio':0
        },
        'JackpotConfig':{
          'Dinosaur1HitRatio':1000,
          'Dinosaur2HitRatio':1000,
          'Dinosaur3HitRatio':1000,
          'Dinosaur4HitRatio':1000
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
      if(this.setData() != true ){
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
    initData() {
      if (this.slotsData) {
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.cfg = this.slotsData
        this.lock = true
      }
    },
    setData() {
      let dinosaurRatio = this.cfg.JackpotConfig.Dinosaur1HitRatio+this.cfg.JackpotConfig.Dinosaur2HitRatio
      dinosaurRatio += this.cfg.JackpotConfig.Dinosaur3HitRatio+this.cfg.JackpotConfig.Dinosaur4HitRatio
      if(dinosaurRatio != 10000){
        this.$message.error('恐龙概率不等于100%')
        return false
      }
      return true
      // this.$message.success('当前页面保存成功')
    }
  }
}
</script>
