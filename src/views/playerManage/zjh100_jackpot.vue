<template>
  <div class="app-container">
    <el-row>
      <el-col :span="22" :offset="1">
        <el-form ref="form" :model="frm" label-width="80px" :inline="true">
          <el-form-item label="中奖时间">
            <el-date-picker
              v-model="timeArr"
              size="mini"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData('search')" size="mini">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>

     <el-col :span="22" :offset="1">
       <el-link type="success" style="margin-right: 20px">真人奖池：{{ jackpot.human }}</el-link><el-link type="primary">机器人奖池：{{ jackpot.robot }}</el-link>
       <el-button type="success" size="small" @click="refresh" style="float: right">刷新</el-button>
       <el-table
         :data="tableData"
         style="width: 100%">
         <el-table-column
           prop="id"
           width="50"
           label="id">
         </el-table-column>
         <el-table-column
           prop="time"
           widt="150"
           label="中奖时间">
           <template slot-scope="scope">
             {{ scope.row.time | parseTime }}
           </template>
         </el-table-column>
         <el-table-column
           prop="cards"
           label="中奖牌">
           <template slot-scope="scope">
            <div v-html="showCard(scope.row.cards)"></div>
           </template>
         </el-table-column>
         <el-table-column
           prop="cardType"
           label="中奖牌型">
           <template slot-scope="scope">
            {{ showPokerType(scope.row.cardType) }}
           </template>
         </el-table-column>
         <el-table-column
           prop="reward"
           label="本轮奖金">
         </el-table-column>
         <el-table-column
           prop="winnerNumber"
           label="中奖人数">
         </el-table-column>
         <el-table-column
           prop="topUser.uid"
           label="头奖用户">
           <template slot-scope="scope">
             <el-link type="danger" :underline="false" v-if="scope.row.topUser.uid > 999999">{{ scope.row.topUser.uid }}(人)</el-link>
             <el-link type="primary" :underline="false" v-else>{{ scope.row.topUser.uid }}(机)</el-link>
           </template>
         </el-table-column>
         <el-table-column
           prop="uids"
           label="中奖用户列表">
         </el-table-column>
         <el-table-column
           prop="jackpotNow"
           label="本轮瓜分后奖池">
         </el-table-column>
       </el-table>

       <div class="block" style="margin-top: 20px; float: right">
         <el-button-group>
           <el-button type="primary" size="medium" icon="el-icon-arrow-left" :disabled="pageDisable.up" @click="getData('up')">上一页</el-button>
           <el-button type="primary" size="medium" :disabled="pageDisable.down" @click="getData('down')">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
         </el-button-group>
       </div>
     </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import {$libDate, $libShow} from '@/utils/common'

export default {
  data() {
    return {
      frm: {

      },
      limit: 50,
      minId: 0,
      jackpot: {
        human: 0,
        robot: 0
      },
      tableData: [],
      pokerTypeMap: {
        1: '高牌',
        2: '对子',
        3: '同花',
        4: '顺子',
        5: '同花顺',
        6: '三条'
      },
      timeArr: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      pageDisable: {
        up: true,
        down: false
      },
      canRequest: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    refresh() {
      this.pageDisable.up = true
      this.pageDisable.down = false
      this.canRequest = true
      this.minId = 0
      this.getData()
    },
    showCard(str) {
      if (!str) {
        return
      }
      const cards = JSON.parse(str)
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    showPokerType(iType) {
      return this.pokerTypeMap[iType] ? this.pokerTypeMap[iType] : iType
    },
    getData(op) {
      if (op === 'search') {
        this.minId = 0
      }

      if (!this.canRequest) {
        console.log('没有数据')
        return
      }
      const $this = this

      if (op === 'up') {
        this.minId += this.limit
      }

      let sts = 0, ets = 0
      if (this.timeArr && this.timeArr.length > 0) {
        sts = parseInt(this.timeArr[0] / 1000) + 9000
        ets = parseInt(this.timeArr[1] / 1000) + 9000
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/query/jackpot/list',
          limit: this.limit,
          id: this.minId,
          sts: sts,
          ets: ets
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.jackpot.human = response.Data.human
          $this.jackpot.robot = response.Data.robot
          $this.tableData = response.Data.data
          $this.updateMinId(op)
        } else {
          if (this.minId === 0) {
            $this.canRequest = false
          }
        }
      })
    },
    updateMinId(op) {
      if (op === 'up') {
        if (this.tableData && this.tableData.length > 0) {
          this.pageDisable.down = false
        } else {
          this.pageDisable.up = true
        }
      } else {
        if (this.tableData && this.tableData.length > 0) {
          this.minId = this.tableData[this.tableData.length - 1]['id']
          if (op === 'down') {
            this.pageDisable.up = false
          }
          if (this.tableData.length < this.limit) {
            this.pageDisable.down = true
          }
        } else {
          this.pageDisable.down = true
        }
      }
    }
  }
}
</script>
