<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <slots-base-cfg v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="符号表配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <slots-symbol-value v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="支付线配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <slots-pay-line v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="赔付线配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <slots-pay-table v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="轴图标配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-reels-icon v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <!--
          <el-tab-pane label="Jackpot配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，重启生效】</h3>
            <slots-jackpot v-if="load" v-model="item" @saveData="saveData"></slots-jackpot>
          </el-tab-pane>
          -->
          <el-tab-pane label="2套轴图标" name="reels">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-reels-double v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="Wild玩法配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-wild-pattern v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="Scatter玩法配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-scatter-pattern v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="大奖配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-winner-cfg v-if="load" v-model="item" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="小黑屋配置">
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-vup v-if="load" v-model="item" :hide-bonus-mode="true" @saveData="saveData" />
          </el-tab-pane>
          <el-tab-pane label="剧本">
            <publish primary-key="ID" key-id="CustomizeCfg_phoenix_slots_script" :env-empty="false" compare-type="Object" />
            <h3 style="text-align:center;color: red;">【注意：修改之后请在本Tab页保存并发布，发布即生效】</h3>
            <slots-script v-if="load" v-model="script" :bets="rawBets" @saveData="saveScript" />
          </el-tab-pane>
          <!--
              <el-tab-pane label="Jackpot奖池" name="pools">
                <slots-jackpot-pools :slotId="51"></slots-jackpot-pools>
              </el-tab-pane>
          -->
          <!--
              <el-tab-pane label="Jackpot奖池配置">
                <slots-jackpot-phoenix v-model="item" @saveData="saveData"></slots-jackpot-phoenix>
              </el-tab-pane>
          -->
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
import slotsBaseCfg from './components/base_cfg'
import slotsSymbolValue from './components/symbol_value'
import slotsPayLine from './components/pay_line'
import slotsPayTable from './components/pay_table_rate'
import slotsReelsIcon from './components/reels_icon'
import slotsJackpot from './components/jackpot'
import slotsWildPattern from './components/wild_pattern'
import slotsScatterPattern from './components/scatter_pattern'
import slotsJackpotPools from './components/jackpot_pools'
import slotsWinnerCfg from './components/winner_cfg'
import slotsVup from './components/slots_vup'
import slotsReelsDouble from './components/reels_double'
import slotsScript from './components/slots_script'
// import slotsJackpotPhoenix from './components/jackpot_phoenix'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, slotsBaseCfg, slotsSymbolValue, slotsPayLine, slotsPayTable, slotsReelsIcon, slotsJackpot, slotsWildPattern, slotsScatterPattern, slotsJackpotPools, slotsWinnerCfg, slotsVup, slotsReelsDouble, slotsScript },
  data() {
    return {
      item: {},
      script: {},
      scriptFrm: {},
      load: false,
      rawBets: [],
      form: {
      },
      txt: '',
      subKey: 'phoenix_slots_cfg'
    }
  },

  created() {
    this.getScript()
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    async getData() {
      const response = await request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      })

      if (response.RetCode === 0) {
        console.log('pay table rate cfg', response)
        this.form = response.Data || {}
        if (response.Data && response.Data.Data !== '') {
          const cfg = JSON.parse(response.Data.Data)
          this.rawBets = []
          for (const k in cfg.BetList) {
            this.rawBets.push(cfg.BetList[k])
            cfg.BetList[k] /= 1000
          }
          cfg.Bets = cfg.BetList.join(',')
          this.item = cfg

          // 设置修改之前数据
          this.$refs.compare.SetOldVal(response.Data.Data)
          this.load = true
        }
      }
    },
    async getScript() {
      const response = await request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'phoenix_slots_script'
        }
      })

      if (response.RetCode === 0) {
        console.log('phoenix script cfg', response)
        this.scriptFrm = response.Data || {}
        if (response.Data && response.Data.Data !== '') {
          this.script = JSON.parse(response.Data.Data)
        }
      }
    },
    saveScript() {
      this.scriptFrm.Data = JSON.stringify(this.script)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.scriptFrm
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('save script response', response)
          this.$message.success('保存成功')
        }
      })
    },
    setData() {
      if (this.item.Bets) {
        const bets = this.item.Bets.split(',')
        this.item.BetList = []
        for (const i in bets) {
          this.item.BetList.push(parseInt(bets[i]) / 1000)
        }
      }

      this.form.Data = JSON.stringify(this.item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    },
    saveData() {
      if (this.item.Bets) {
        const bets = this.item.Bets.split(',')
        this.item.BetList = []
        for (const i in bets) {
          this.item.BetList.push(parseFloat(bets[i]) * 1000)
        }
      }

      this.form.Data = JSON.stringify(this.item)

      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.form
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('saveData response', response)
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
