<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="16" :offset="3">
        <el-form :model="cfg" label-width="250px">
          <ratio-input v-model="cfg.VupConfig.Line5ReMatrixRate" label="中5线重摇概率(%)" tips="即小黑屋用户中5线图标时有多少概率重新摇一次" />
          <ratio-input v-show="!HideBonusMode" v-model="cfg.VupConfig.BonusReduce" label="Bonus中奖后多少概率不中(%)" tips="即小黑屋用户中bonus之后，有多少概率使其不中" />
          <ratio-input v-show="!HideScatterMode" v-model="cfg.VupConfig.ScatterReduce" label="Scatter中奖概率降低(%)" tips="降低小黑屋用户中scatter概率" />

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
  name: 'SlotsVupCfg',
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
    },
    HideBonusMode: {
      type: Object,
      default: function() {
        return false
      }
    },
    HideScatterMode: {
      type: Object,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      cfg: {
        'VupConfig': {
          'Line5ReMatrixRate': 0,
          'BonusReduce': 0,
          'ScatterReduce': 0
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
      if (this.slotsData.ExtConfig) {
        const tmp = JSON.parse(this.slotsData.ExtConfig)
        console.log('diff data:', tmp)
        if (tmp.hasOwnProperty('VupConfig')) {
          return tmp.VupConfig
        } else {
          console.log('return empty')
          return {
            'Line5ReMatrixRate': 0,
            'BonusReduce': 0,
            'ScatterReduce': 0
          }
        }
      } else {
        return {}
      }
    },
    submitFrm() {
      this.setData()
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
      if (this.slotsData.ExtConfig) {
        this.cfg = JSON.parse(this.slotsData.ExtConfig)
        console.log('do init 111111', this.cfg)
        if (!this.cfg.hasOwnProperty('VupConfig')) {
          this.cfg.VupConfig = {
            'Line5ReMatrixRate': 0,
            'BonusReduce': 0,
            'ScatterReduce': 0
          }
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      this.slotsData.ExtConfig = JSON.stringify(this.cfg)
    // this.$message.success('保存到当前页面成功')
    }
  }
}
</script>
