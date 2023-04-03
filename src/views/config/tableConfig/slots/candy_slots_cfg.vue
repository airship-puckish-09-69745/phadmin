<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <slots-base-cfg v-if="slotCfgBool" v-model="slotCfg" @saveData="saveCfg"></slots-base-cfg>
          </el-tab-pane>
          <el-tab-pane label="符号表配置">
            <slots-symbol-value v-if="slotCfgBool" v-model="slotCfg" @saveData="saveCfg"></slots-symbol-value>
          </el-tab-pane>
          <el-tab-pane label="赔付线配置">
            <slots-pay-table v-if="slotCfgBool" v-model="slotCfg" @saveData="saveCfg"></slots-pay-table>
          </el-tab-pane>
          <el-tab-pane label="轴图标配置">
            <slots-reels-icon v-if="slotCfgBool" v-model="slotCfg" @saveData="saveCfg"></slots-reels-icon>
          </el-tab-pane>
          <el-tab-pane label="大奖配置">
            <slots-big-winner-cfg v-if="slotCfgBool" v-model="slotCfg" @saveData="saveCfg"></slots-big-winner-cfg>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import slotsBaseCfg from './components_x/candy_base_cfg'
import slotsSymbolValue from './components_x/symbol_value'
import slotsPayTable from './components_x/candy_pay_table_rate'
import slotsReelsIcon from './components_x/candy_reels_icon'
import slotsBigWinnerCfg from './components_x/big_winner_cfg'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, slotsBaseCfg, slotsSymbolValue, slotsPayTable, slotsReelsIcon, slotsBigWinnerCfg },
  data() {
    return {
      slotCfg: {},
      slotCfgBool: false,
      slotForm: {},
      txt: '',
      subKey: 'candy_slots_cfg',
      inc: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      //加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.slotForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            let cfg = JSON.parse(response.Data.Data)
            for (let k in cfg.BetList) {
              cfg.BetList[k] /= 1000
            }
            cfg.Bets = cfg.BetList.join(',')
            this.slotCfg = cfg
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.slotCfgBool = true
          }
        }
      })
    },

    saveCfg() {
      if (this.slotCfg.Bets) {
        const bets = this.slotCfg.Bets.split(',')
        this.slotCfg.BetList = []
        for (const i in bets) {
          this.slotCfg.BetList.push(parseFloat(bets[i])*1000)
        }
      }
      this.slotForm.Data = JSON.stringify(this.slotCfg)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.slotForm
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
