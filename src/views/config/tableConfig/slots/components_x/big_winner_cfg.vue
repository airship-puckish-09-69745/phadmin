<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="180px">
          
          <el-form-item label="小奖档位最低值">
            <money-input v-model="cfg.WinnerRecordCfg.LowStandMinAward" />
          </el-form-item>
          <el-form-item label="大奖档位最低值">
            <money-input v-model="cfg.WinnerRecordCfg.HighStandMinAward" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col>
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>

import Compare from '@/components/Compare'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsBigWinnerCfg',
  components: { MoneyInput, Compare },
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
        'WinnerRecordCfg': {
          'LowStandMinAward': 0,
          'HighStandMinAward': 0
        }
      },
      lock: false
    }
  },
  // mounted(){
  //   this.initData()
  // },
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
      if (this.slotsData) {
        this.cfg = this.slotsData
        console.log("do init 111111",this.cfg);
        if(!this.cfg.hasOwnProperty("WinnerRecordCfg")){
          this.cfg.WinnerRecordCfg = {
            'LowStandMinAward': 0,
            'HighStandMinAward': 0
          };
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    setData() {
      this.slotsData = this.cfg
      // this.$message.success('保存到当前页面成功')
    }
  }
}
</script>
