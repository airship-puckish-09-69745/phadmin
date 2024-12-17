<template>
 <div>
   <el-row>
     <el-col>
       <el-date-picker
         v-model="queryTime"
         size="mini"
         type="date"
         placeholder="选择日期"
       />
       <el-select v-model="queryGid" size="mini" filterable default-first-option @change="queryKeyInput">
         <el-option v-for="(o,k) in gidOptions" :key="k" :label="getGameName(o)" :value="parseInt(o)" />
       </el-select>
       <el-button type="primary" size="mini" @click="getSlotsMissionStatistics">查询</el-button>
     </el-col>
   </el-row>
   <el-row style="overflow-x: auto; flex-wrap: nowrap; padding-bottom: 30px; margin-top: 20px">
     <el-col :span="11">
       <el-table
         ref="filterTable"
         :data="missionTableData"
         stripe
         border
         :header-cell-style="libShow.DefaultTableHeadClass"
         :row-style="{height:'10px',width: '100%'}"
         :cell-style="libShow.DefaultTableCell"
       >
         <el-table-column label="任务统计">
           <el-table-column
             prop="gid"
             label="玩家类型"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.typeid }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="玩家数量"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.count }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="任务等级"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.missionid }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="完成任务数"
             width="120px"
           >
             <template slot-scope="scope">
               {{ scope.row.finish }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="完成人数占比"
             width="120px"
           >
             <template slot-scope="scope">
               {{ ((scope.row.finish / scope.row.count)*100).toFixed(2) + '%' }}
             </template>
           </el-table-column>
         </el-table-column>
       </el-table>
     </el-col>

     <el-col :span="11" :offset="1">
       <el-table
         ref="filterTable"
         :data="richCardTableData"
         stripe
         border
         :header-cell-style="libShow.DefaultTableHeadClass"
         :row-style="{height:'10px'}"
         :cell-style="libShow.DefaultTableCell"
       >
         <el-table-column label="富裕卡统计">
           <el-table-column
             prop="gid"
             label="星级"
             width="75px"
           >
             <template slot-scope="scope">
               {{ scope.row.typeid }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="下注值"
             width="75px"
           >
             <template slot-scope="scope">
               {{ scope.row.cardbet / 1000 }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="下注金额"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.bet / 1000 }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="奖励金额"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.money / 1000 }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="bet rtp"
             width="120px"
           >
             <template slot-scope="scope">
               {{ (scope.row.betrtp * 100).toFixed(5) + "%" }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="星级rtp"
             width="120px"
           >
             <template slot-scope="scope">
               {{ (scope.row.richrtp * 100).toFixed(5) + "%" }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="使用次数"
             width="90px"
           >
             <template slot-scope="scope">
               {{ scope.row.use }}
             </template>
           </el-table-column>
           <el-table-column
             prop="gid"
             label="发放次数"
             width="120px"
           >
             <template slot-scope="scope">
               {{ scope.row.count }}
             </template>
           </el-table-column>
         </el-table-column>
       </el-table>

     </el-col>
   </el-row>
 </div>
</template>
<script>

import { $libShow, ClientTableData } from '@/utils/common'
import request from '@/utils/request'
import store from '@/store'
import {connect} from "echarts/lib/echarts";

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsMissonStatistics',
  data() {
    return {
      libShow: $libShow,
      missionClientDB: new ClientTableData([], 1, filterMap),
      richCardClientDB: new ClientTableData([], 1, filterMap),
      missionTableData: [],
      richCardTableData: [],
      queryGid: 80,
      queryTime: new Date().getTime(),
      gameOptions: [],
      gidOptions: {},
      loading: false
    }
  },
  created() {
    this.getGameList()
    this.getSlotsMissionStatistics()
  },
  methods: {
    async queryKeyInput() {
      this.missionTableData = this.missionClientDB.GetCurrentPageData()
      this.richCardTableData = this.richCardClientDB.GetCurrentPageData()
    },
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
            this.gidOptions[response.Data[i].Gid] = response.Data[i].Gid
          }
        }
      })
    },
    getGameName(gid) {
      for (const o of this.gameOptions) {
        if (o.key === parseInt(gid)) {
          return o.label
        }
      }
    },
    getSlotsMissionStatistics() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/mission/statistics',
          Env: store.getters.env,
          queryTime: parseInt(this.queryTime / 1000),
          gameID: this.queryGid
        }
      }).then(response => {
        const missionTableData = []
        const richCardTableData = []
        const richCardRtpData = []

        if (response.RetCode === 0) {
          const missionMap = {}
          const richCardMap = {}
          for (const key in response.Data['statistics']) {
            const strings1 = key.split('_')
            if (strings1[0] === 'newbieflag') {
              let userType = ''
              if (strings1[1] === '1') {
                userType = '新用户'
              } else {
                userType = '老用户'
              }
              if (missionMap[userType] == null) {
                missionMap[userType] = {
                  userCount: 0,
                  finishMission: { '1': 0, '2': 0, '3': 0 }
                }
              }

              if (strings1[2] === 'uid') {
                missionMap[userType].userCount += 1
              } else if (strings1[2] === 'stage') {
                missionMap[userType].finishMission[strings1[3]] = parseInt(response.Data['statistics'][key])
              }
            } else if (strings1[0] === 'cardlevel') {
              if (strings1.length < 4) {
                continue
              }
              if (richCardMap[strings1[1] + '_' + strings1[2]] == null) {
                richCardMap[strings1[1] + '_' + strings1[2]] = {
                  bet: 0,
                  count: 0,
                  money: 0,
                  use: 0
                }
              }
              if (richCardRtpData[strings1[1]] == null) {
                richCardRtpData[strings1[1]] = {
                  bet: 0,
                  money: 0
                }
              }
              richCardMap[strings1[1] + '_' + strings1[2]][strings1[3]] = parseInt(response.Data['statistics'][key])
              if (strings1[3] === 'bet' || strings1[3] === 'money') {
                richCardRtpData[strings1[1]][strings1[3]] += parseInt(response.Data['statistics'][key])
              }
            }
          }
          for (const typeid in missionMap) {
            for (const missionid in missionMap[typeid].finishMission) {
              missionTableData.push({
                gid: this.queryGid,
                typeid: typeid,
                count: missionMap[typeid].userCount,
                missionid: missionid,
                finish: missionMap[typeid].finishMission[missionid],
              })
            }
          }

          for (const key in richCardMap) {
            const strings2 = key.split('_')
            richCardTableData.push({
              gid: this.queryGid,
              typeid: strings2[0],
              cardbet: strings2[1],
              bet: richCardMap[key].bet,
              money: richCardMap[key].money,
              betrtp: richCardMap[key].bet === 0 ? 0 : richCardMap[key].money / richCardMap[key].bet,
              richrtp: richCardRtpData[strings2[0]].bet === 0 ? 0 : richCardRtpData[strings2[0]].money / richCardRtpData[strings2[0]].bet,
              use: richCardMap[key].use,
              count: richCardMap[key].count
            })
          }
        }
        missionTableData.sort(function(a, b) {
          if (b.typeid === a.typeid) {
            return a.missionid - b.missionid
          }
          if (b.typeid === '新用户') {
            return 1
          } else {
            return -1
          }
        })

        richCardTableData.sort(function(a, b) {
          if (b.typeid === a.typeid) {
            return b.cardbet - a.cardbet
          }
          return b.typeid - a.typeid
        })

        this.missionClientDB = new ClientTableData(missionTableData, 20, filterMap, 'sort', -1)
        this.richCardClientDB = new ClientTableData(richCardTableData, 20, filterMap, 'idx', -1)
        this.queryKeyInput()

        $this.loading = false
      })
    }
  }
}
</script>
<style>

.block-info {
  display: inline-table;
  padding-left: 10px;
}

.dominoHr {
  display: flex;
  flex-direction: column;
}
</style>
