<template>
  <div class="app-container">
    <el-row>
      <h3>老虎机大奖模拟计算</h3>
      <el-form label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <el-input v-model.number="queryUid" autosize @change="cleanResult"></el-input>
        </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="queryGid" size="mini" filterable default-first-option @change="cleanResult">
            <el-option v-for="row in gameOptions" :key="row.key" :label="row.label" :value="row.key"  />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getSlotsStat">查询玩牌统计</el-button>
          <el-button type="warning" size="mini" @click="calcBigPrizeCfg">计算用户大奖配置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="showUserPrizeCfg">
      <table width="100%">
        <tr>
          <td>模拟计算大奖命中率：<span>{{userPrizeCfg.hitRate}} / 百万</span></td>
          <td>模拟计算命中率说明：<span>{{showReason(userPrizeCfg.reason)}}</span></td>
          <td>用户匹配的大奖分组ID：<span>{{userPrizeCfg.cfgId}}</span></td>
        </tr>
      </table>
    </el-row>
    <el-row>
      <el-table :data="statData" stripe border style="width: 100%; margin: 10px auto;">
        <el-table-column prop="date"  label="日期" width="200" />
        <el-table-column prop="days" label="天数" width="200" />
        <el-table-column prop="bet" label="下注金额" width="200"><template slot-scope="scope">{{betMoneyStr(scope.row.bet)}}</template></el-table-column>
        <el-table-column prop="user_bet" label="用户下注" width="200"><template slot-scope="scope">{{number2money(scope.row.user_bet)}}</template></el-table-column>
        <el-table-column prop="user_win" label="用户赢取" width="200"><template slot-scope="scope">{{number2money(scope.row.user_win)}}</template></el-table-column>
        <el-table-column prop="user_play" label="玩牌局数" width="200" />
      </el-table>
    </el-row>

    <hr />

    <el-row>
      <h3>老虎机用户进入免费模拟计算</h3>
      <el-form label-width="90px" :inline="true" size="small">
        <el-form-item label="游戏">
          <el-select v-model="freeModeQuery.gid" size="mini" filterable default-first-option>
            <el-option v-for="row in gameOptions" :key="row.key" :label="row.label" :value="row.key"  />
          </el-select>
        </el-form-item>
        <el-form-item label="倍数：" :required="true" label-width="150px">
          <el-input v-model.number="freeModeQuery.odds" autosize></el-input>
        </el-form-item>
        <el-form-item label="今日下注次数：" :required="true" label-width="150px">
          <el-input v-model.number="freeModeQuery.playTimes" autosize></el-input>
        </el-form-item>
        <el-form-item label="今日进入免费次数：" :required="true" label-width="150px">
          <el-input v-model.number="freeModeQuery.freeTimes" autosize></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getEnterFreeModeRates">计算进入免费模式概率</el-button>
        </el-form-item>
      </el-form>
      <br />
      <p>概率：{{showFreeModeRates(freeModeResult.found, freeModeResult.rates)}}</p>
      <p>匹配规则：{{freeModeResult.rule}}</p>
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import request2 from '@/utils/request2'
import MoneyInput from '@/components/MoneyInput'
import { $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import UidInput from "@/components/UidInput/index.vue";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {UidInput, Compare, Publish, MoneyInput},

  data() {
    return {
      statData: [],
      userPrizeCfg: {
        hitRate: 0,
        reason: 0,
        cfgId: 0
      },
      baseBet: 0,
      queryUid: 0,
      queryGid: 0,
      gameOptions: [], //游戏列表
      showUserPrizeCfg: false,
      freeModeQuery: {
        gid: 0,
        odds: 0,
        playTimes: 0,
        freeTimes: 0
      },
      freeModeResult: {
        found: false,
        rates: 0,
        rule: ''
      }
    }
  },

  created() {
    this.getGameList()
  },

  methods: {
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }

            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
          this.gameOptions.push({
            key: 100180,
            label: 'Fishing Master(额外加注)'
          })
          this.gameOptions.push({
            key: 100186,
            label: 'Mahjong Jackpot(额外加注)'
          })
        }
      })
    },

    getSlotsStat() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/user/stat/data',
          Env: store.getters.env,
          Uid: this.queryUid,
          SlotsType: this.queryGid,
          appID: store.getters.appId || 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let obj = {}, arr = []
          $this.baseBet = response.Data.base_bet
          for (const k in response.Data.stat) {
            const v = response.Data.stat[k]
            for (const kk in v.data) {
              const vv = v.data[kk]
              const objKey = vv.date + "_" + vv.bet
              if (typeof obj[objKey] == 'undefined') {
                obj[objKey] = {
                  date: vv.date,
                  bet: vv.bet,
                  days: vv.days,
                  user_bet: 0,
                  user_win: 0,
                  user_play: 0
                }
              }
              switch (v.field) {
                case 1:
                  obj[objKey].user_bet += vv.value
                  break
                case 2:
                  obj[objKey].user_win += vv.value
                  break
                case 4:
                  obj[objKey].user_play += vv.value
                  break
              }
            }
          }
          for (const k in obj) {
            arr.push(obj[k])
          }
          arr.sort(function (a, b) {
            if (a.date == b.date) {
              return a.bet < b.bet
            } else {
              return a.date < b.date
            }
          })
          this.statData = arr
        }
        $this.loading = false
      }).catch(function() {
        $this.loading = false
      })
    },

    calcBigPrizeCfg() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/user/big/prize/config',
          Env: store.getters.env,
          Uid: this.queryUid,
          SlotsType: this.queryGid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.userPrizeCfg = response.Data
          this.showUserPrizeCfg = true
        }
        $this.loading = false
      }).catch(function() {
        $this.loading = false
      })
    },

    //数字转为金额
    number2money(n) {
      const v = n / 1000
      if (n % 1000 == 0) {
        return v.toFixed(0)
      } else if (n % 100 == 0) {
        return v.toFixed(1)
      } else if (n % 10 == 0) {
        return v.toFixed(2)
      } else {
        return v.toFixed(3)
      }
    },

    betMoneyStr(bet) {
      return this.number2money(bet) + ' * ' + this.baseBet
    },

    showReason(reason) {
      switch (reason) {
        case 0:
          return '未知'
        case 1:
          return '正常大奖概率'
        case 2:
          return '用户群配置概率'
        case 3:
          return '固定间隔步数'
      }
    },

    cleanResult() {
      this.statData = []
      this.showUserPrizeCfg = false
    },

    getEnterFreeModeRates() {
      const $this = this
      $this.loading = true
      this.cleanFreeModeResult()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/enter/free/mode/rates',
          Env: store.getters.env,
          SlotsType: this.freeModeQuery.gid,
          Odds: this.freeModeQuery.odds,
          PlayTimes: this.freeModeQuery.playTimes,
          FreeTimes: this.freeModeQuery.freeTimes,
          AppID: store.getters.appId || 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.freeModeResult.found = response.Data.found || false
          this.freeModeResult.rates = response.Data.rates || 0
          this.freeModeResult.rule = response.Data.rule
        }
        $this.loading = false
      }).catch(function() {
        $this.loading = false
      })
    },

    cleanFreeModeResult() {
      this.freeModeResult.found = false
      this.freeModeResult.rates = 0
      this.freeModeResult.rule = ''
    },

    showFreeModeRates(found, rates) {
      if (!found) {
        return '默认概率'
      } else {
        return rates + '%'
      }
    }
  }
}
</script>
