<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">

          <ratio-input v-model="cfg.ReMatrixRand.FirstColRatio" label="第一列(%)" />
          <ratio-input v-model="cfg.ReMatrixRand.Left2RightRatio" label="从左到右(%)" />
          <ratio-input v-model="cfg.ReMatrixRand.Right2LeftRatio" label="从右到左(%)" />

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
  name: 'SlotsChicagoReMatrixExt',
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
        'ReMatrixRand': {
          'FirstColRatio': 0,
          'Left2RightRatio': 0,
          'Right2LeftRatio': 0
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
      if (this.cfg.ReMatrixRand.FirstColRatio + this.cfg.ReMatrixRand.Left2RightRatio + this.cfg.ReMatrixRand.Right2LeftRatio != 10000) {
        this.$message.error('概率相加不等于100')
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
      console.log('slots data:', this.slotsData)
      if (this.slotsData) {
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.cfg = this.slotsData
        this.lock = true
      }
    }
  }
}
</script>
