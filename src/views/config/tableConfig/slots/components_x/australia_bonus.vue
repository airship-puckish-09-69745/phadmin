<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
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
          <el-form-item label="Bonus基础倍数">
            <el-input v-model.number="cfg.BonusConfig.BonusBaseOdds" />
          </el-form-item>
          <el-form-item label="猜中基础倍数">
            <el-input v-model.number="cfg.BonusConfig.BonusHitBaseOdds" />
          </el-form-item>
          <ratio-input v-model="cfg.BonusConfig.Hit0Percent" label="猜中0个概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.Hit1Percent" label="猜中1个概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.Hit2Percent" label="猜中2个概率(%)" ></ratio-input>
          <ratio-input v-model="cfg.BonusConfig.Hit3Percent" label="猜中3个概率(%)" ></ratio-input>
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
  name: 'SlotsAustraliaBonus',
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
        'ScatterConfig':{},
        'BonusConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'BonusBaseOdds': 10,
          'BonusHitBaseOdds': 10,
          'Hit0Percent': 50,
          'Hit1Percent': 20,
          'Hit2Percent': 20,
          'Hit3Percent': 10
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
      if (!this.setData()) {
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
      })
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        if(!this.cfg.hasOwnProperty("BonusConfig")){
          this.cfg.BonusConfig = {
            'Enable': true,
            'PerReelsMinNumber': 1,
            'MinReels': 1,
            'BonusBaseOdds': 10,
            'BonusHitBaseOdds': 10,
            'Hit0Percent': 5000,
            'Hit1Percent': 2000,
            'Hit2Percent': 2000,
            'Hit3Percent': 1000
          }
        }
        this.lock = true
      }
    },
    setData() {
      let ratio = this.cfg.BonusConfig.Hit0Percent
       ratio += this.cfg.BonusConfig.Hit1Percent
       ratio += this.cfg.BonusConfig.Hit2Percent
       ratio += this.cfg.BonusConfig.Hit3Percent
      

      if (ratio !== 10000) {
        this.$message.error('概率合计必须等于100%')
        return false
      }
      console.log("cfg:  ",this.cfg)
      this.slotsData = this.cfg
      // this.$message.success('保存到当前页面成功')

      return true
    }
  }
}
</script>
