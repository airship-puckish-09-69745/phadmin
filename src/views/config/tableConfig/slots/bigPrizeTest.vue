<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="queryGid" size="mini" filterable default-first-option>
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
      <table>
        <tr>
          <td>模拟计算大奖命中率：<span>{{userPrizeCfg.hitRate}}</span></td>
          <td>模拟计算命中率说明：<span>{{showReason(userPrizeCfg.reason)}}</span></td>
          <td>用户匹配的大奖分组ID：<span>{{userPrizeCfg.cfgId}}</span></td>
        </tr>
      </table>
    </el-row>
    <el-row>
      <el-table :data="statData" stripe border style="width: 100%; margin: 10px auto;">
        <el-table-column prop="date"  label="日期" width="200" />
        <el-table-column prop="days" label="天数" width="200" />
        <el-table-column prop="bet" label="单注金额" width="200"><template slot-scope="scope">{{number2money(scope.row.bet)}}</template></el-table-column>
        <el-table-column prop="user_bet" label="用户下注" width="200"><template slot-scope="scope">{{number2money(scope.row.user_bet)}}</template></el-table-column>
        <el-table-column prop="user_win" label="用户赢取" width="200"><template slot-scope="scope">{{number2money(scope.row.user_win)}}</template></el-table-column>
        <el-table-column prop="user_play" label="玩牌局数" width="200" />
      </el-table>
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
      queryUid: 0,
      queryGid: 0,
      gameOptions: [], //游戏列表
      showUserPrizeCfg: false
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
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 199) {
              continue
            }

            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
            this.gameScene[response.Data[i].Gid] = response.Data[i].Scene
            this.gidOptions[response.Data[i].Gid] = response.Data[i].Gid
          }
          this.gidOptions[100180] = 'Fishing Master(额外加注)'
          this.gameOptions.push({
            key: 100180,
            label: 'Fishing Master(额外加注)'
          })
          this.gidOptions[100186] = 'Mahjong Jackpot(额外加注)'
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
          Path: '/slotsStat/user/stata/data',
          Env: store.getters.env,
          uid: this.queryUid,
          gid: this.queryGid
        }
      }).then(response => {
        $this.newBigPrize()
        if (response.RetCode === 0) {
          let obj = {}, arr = []
          for (const k in response.Data) {
            const v = response.Data[k]
            for (const kk in response.Data[k].Data) {
              const vv = response.Data[k].Data[kk]
              const objKey = vv.Date + "_" + vv.Bet
              if (typeof obj[objKey] == 'undefined') {
                obj[objKey] = {
                  date: vv.Date,
                  bet: vv.Bet,
                  days: vv.Days,
                  user_bet: 0,
                  user_win: 0,
                  user_play: 0
                }
              }
              switch (v.Field) {
                case 1:
                  obj[objKey].user_bet += vv.Value
                  break
                case 2:
                  obj[objKey].user_win += vv.Value
                  break
                case 4:
                  obj[objKey].user_play += vv.Value
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
          Path: '/slotsStat/big/prize/config',
          Env: store.getters.env,
          uid: this.queryUid,
          gid: this.queryGid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.userPrizeCfg = response.Data
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
    }
  }
}
</script>
