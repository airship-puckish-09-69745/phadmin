<script>
import request from '@/utils/request'
import { $libDate, ClientTableData } from '@/utils/common'
import TongitsGameLog from '@/views/playerManage/components/TongitsGameLog.vue'

export default {
  components: { TongitsGameLog },
  data() {
    return {
      cheatLogs: [],
      userCheatLogs: [],
      Uid: 0,
      checkTime: { start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()) },
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      clientDB: new ClientTableData([], 1, {}),
      GameLog: {},
      GameLogVisible: false,
      Gid: 22,

      isRobotMap: {},
      TidCheatLogVisible: false,
      TidCheatLogs: [],
      CheatLogVisible: false,
      CheatLogs: [],
      cheatUserType: new Map(),
      sortType: 1,
      sortTypeOption: [
        { label: '按时间', value: 0 },
        { label: '按疑似度', value: 1 }
      ],
      cheatType: -1,
      cheatTypeOption: [
        { label: '全部', value: -1 },
        { label: '普通', value: 0 },
        { label: '疑似', value: 1 },
        { label: '黑子', value: 2 }
      ]
    }
  },
  created() {
    this.getCheatUserType()
    this.getData()
  },
  methods: {
    getData() {
      // console.log(ttt)
      const $this = this
      $this.cheatLogs = []
      $this.clientDB = new ClientTableData([], 1, {})
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/log/new',
          Page: 1,
          Limit: 9999,
          Gid: this.Gid,
          Uid: this.Uid,
          Start: this.checkTime.start / 1000,
          End: this.checkTime.end / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogRows = data.Items || []
          let cheatLogs
          const cheatLogMap = new Map()
          $this.totalCount = data.Total || 0
          cheatLogRows.sort(function(a, b) {
            return b.EndTime - a.EndTime
          })
          for (let i = 0; i < cheatLogRows.length; i++) {
            const row = cheatLogRows[i]
            const cheatScoreRow = this.cheatUserType.get(row.uid)
            if (!cheatScoreRow) {
              continue
            }
            if (this.cheatType === 0 && cheatScoreRow.userType !== 0) {
              continue
            } else if (this.cheatType === 1 && cheatScoreRow.userType !== 1) {
              continue
            } else if (this.cheatType === 2 && cheatScoreRow.userType !== 2) {
              continue
            }
            row.Infos = this.addInfos([], row)
            if (!cheatLogMap.has(row.uid)) {
              // eslint-disable-next-line no-empty
              const cheatLog = {
                Uid: row.uid,
                Gid: row.gid,
                CheatScore: 0,
                LastEndTime: row.lastEndTime,
                LastCheatTime: row.endTime,
                Infos: [],
                TidCheatLogs: [],
                userType: 0,
                blackTime: 0
              }
              cheatLog.Infos = this.addInfos([], row)
              cheatLog.TidCheatLogs = this.addTidInfos([], row)
              const hasKey = this.cheatUserType.has(row.uid)
              if (hasKey) {
                cheatLog.userType = this.cheatUserType.get(row.uid).userType
                cheatLog.blackTime = this.cheatUserType.get(row.uid).blackTime
                cheatLog.CheatScore = this.cheatUserType.get(row.uid).cheatScore
              }
              cheatLogMap.set(cheatLog.Uid, cheatLog)
            } else {
              const cheatLog = cheatLogMap.get(row.uid)
              // cheatLog.CheatScore += row.cheatScore
              cheatLog.LastCheatTime = Math.max(cheatLog.LastCheatTime, row.endTime)
              cheatLog.Infos = this.addInfos(cheatLog.Infos, row)
              cheatLog.TidCheatLogs = this.addTidInfos(cheatLog.TidCheatLogs, row)
            }
          }
          // eslint-disable-next-line prefer-const
          cheatLogs = Array.from(cheatLogMap.values())
          console.log(cheatLogs)
          this.totalCount = cheatLogs.length
          let sortName = 'EndTime'
          if (this.sortType === 0) {
            sortName = 'CheatScore'
          }
          $this.clientDB = new ClientTableData(cheatLogs, $this.pageNum, {}, sortName, -1, 'Uid')
          $this.handleCurrentChange(1)
        }
      })
    },
    getCheatUserType() {
      // console.log(ttt)
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/user/type'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const rows = data.Items || []
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            $this.cheatUserType.set(row.uid, row)
            console.log(row)
          }
        }
      })
      console.log($this.cheatUserType)
    },

    addInfos(infos, row) {
      const infosMap = new Map()
      for (let i = 0; i < infos.length; i++) {
        const info = infos[i]
        infosMap.set(info.cheatType, info)
      }
      if (row.disAndGive >= 1) {
        if (infosMap.has(1)) {
          infosMap.get(1).count += row.disAndGive
        } else {
          infosMap.set(1, {
            Desc: '拆牌喂牌',
            count: row.disAndGive,
            cheatType: 1
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(1).hasOwnProperty('cheatScore')) {
            infosMap.get(1).cheatScore += row.cheatScores[1]
          } else {
            infosMap.get(1).cheatScore = row.cheatScores[1]
          }
        }
      }
      if (row.giveMoreTimes >= 1) {
        if (infosMap.has(2)) {
          infosMap.get(2).count += row.giveMoreTimes
        } else {
          infosMap.set(2, {
            Desc: '多次喂牌',
            count: row.giveMoreTimes,
            cheatType: 2
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(2).hasOwnProperty('cheatScore')) {
            infosMap.get(2).cheatScore += row.cheatScores[2]
          } else {
            infosMap.get(2).cheatScore = row.cheatScores[2]
          }
        }
      }
      if (row.firstGiveMoreTimes >= 1) {
        if (infosMap.has(3)) {
          infosMap.get(3).count += row.firstGiveMoreTimes
        } else {
          infosMap.set(3, {
            Desc: '首出喂牌',
            count: row.firstGiveMoreTimes,
            cheatType: 3
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(3).hasOwnProperty('cheatScore')) {
            infosMap.get(3).cheatScore += row.cheatScores[3]
          } else {
            infosMap.get(3).cheatScore = row.cheatScores[3]
          }
        }
      }
      if (row.preWinFight >= 1) {
        if (infosMap.has(4)) {
          infosMap.get(4).count += row.preWinFight
        } else {
          infosMap.set(4, {
            Desc: '皇冠FIGHT',
            count: row.preWinFight,
            cheatType: 4
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(4).hasOwnProperty('cheatScore')) {
            infosMap.get(4).cheatScore += row.cheatScores[4]
          } else {
            infosMap.get(4).cheatScore = row.cheatScores[4]
          }
        }
      }
      if (row.preWinFold >= 1) {
        if (infosMap.has(5)) {
          infosMap.get(5).count += row.preWinFold
        } else {
          infosMap.set(5, {
            Desc: '皇冠FOLD',
            count: row.preWinFold,
            cheatType: 5
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(5).hasOwnProperty('cheatScore')) {
            infosMap.get(5).cheatScore += row.cheatScores[5]
          } else {
            infosMap.get(5).cheatScore = row.cheatScores[5]
          }
        }
      }
      if (row.leaveFre >= 1) {
        if (infosMap.has(6)) {
          infosMap.get(6).count += row.leaveFre
        } else {
          infosMap.set(6, {
            Desc: '频繁离开',
            count: row.leaveFre,
            cheatType: 6
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(6).hasOwnProperty('cheatScore')) {
            infosMap.get(6).cheatScore += row.cheatScores[6]
          } else {
            infosMap.get(6).cheatScore = row.cheatScores[6]
          }
        }
      }
      if (row.bigPotWin >= 1) {
        if (infosMap.has(7)) {
          infosMap.get(7).count += row.bigPotWin
        } else {
          infosMap.set(7, {
            Desc: '大POT高赢率',
            count: row.bigPotWin,
            cheatType: 7
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(7).hasOwnProperty('cheatScore')) {
            infosMap.get(7).cheatScore += row.cheatScores[7]
          } else {
            infosMap.get(7).cheatScore = row.cheatScores[7]
          }
        }
      }
      if (row.bigPotLeave >= 1) {
        if (infosMap.has(8)) {
          infosMap.get(8).count += row.bigPotLeave
        } else {
          infosMap.set(8, {
            Desc: '大POT多人离开',
            count: row.bigPotLeave,
            cheatType: 8
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(8).hasOwnProperty('cheatScore')) {
            infosMap.get(8).cheatScore += row.cheatScores[8]
          } else {
            infosMap.get(8).cheatScore = row.cheatScores[8]
          }
        }
      }
      if (row.hasOwnProperty('playMoreTimes')) {
        if (row.playMoreTimes >= 1) {
          if (infosMap.has(9)) {
            infosMap.get(9).count += row.playMoreTimes
          } else {
            infosMap.set(9, {
              Desc: '玩的局数过多',
              count: row.playMoreTimes,
              cheatType: 9
            })
          }
          if (row.hasOwnProperty('cheatScores')) {
            if (infosMap.get(9).hasOwnProperty('cheatScore')) {
              infosMap.get(9).cheatScore += row.cheatScores[9]
            } else {
              infosMap.get(9).cheatScore = row.cheatScores[9]
            }
          }
        }
      }
      return Array.from(infosMap.values())
    },
    addTidInfos(infos, row) {
      const infosMap = new Map()
      for (let i = 0; i < infos.length; i++) {
        const info = infos[i]
        infosMap.set(info.Tid, info)
      }
      if (infosMap.has(row.tid)) {
        // CheatInfos
        infosMap.get(row.tid).CheatInfos.push(row)
        infosMap.get(row.tid).TotalCheatScore += row.cheatScore
        const firstTime = infosMap.get(row.tid).FirstCheatTime
        infosMap.get(row.tid).FirstCheatTime = Math.min(firstTime, row.endTime)
        infosMap.get(row.tid).Infos = this.addInfos(infosMap.get(row.tid).Infos, row)
        // eslint-disable-next-line no-empty
      } else {
        infosMap.set(row.tid, {
          Tid: row.tid,
          CheatInfos: [row],
          TotalCheatScore: row.cheatScore,
          FirstCheatTime: row.endTime,
          Infos: this.addInfos([], row)
        })
      }
      return Array.from(infosMap.values())
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    refreshShow() {
      this.cheatLogs = this.clientDB.GetCurrentPageData()
    },
    formatTimeDate(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    changeWhite(row, userType) {
      const cheatUserType = this.cheatUserType.get(row.Uid)
      cheatUserType.UserType = userType
      this.cheatUserType.set(row.Uid, cheatUserType)
      const ob = this.clientDB.GetDataByID(row.Uid)
      if (ob.userType !== 2 && userType === 2) {
        ob.blackTime = Math.floor(new Date().getTime() / 1000)
      }
      if (ob.userType !== 2) {
        ob.blackTime = 0
        ob.userType = userType
      }
      this.clientDB.UpdateData2('Uid', ob)
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/user/type',
          UserType: userType,
          Uid: row.Uid
        }
      }).then(response => {
      })
      this.refreshShow()
    },
    formatUserType(row) {
      const userType = row.userType
      if (userType === 0) {
        return '信誉'
      } else if (userType === 1) {
        return '疑似'
      } else if (userType === 2) {
        return '黑名单'
      }
    },
    formatCheatInfo(row) {
      if (row.hasOwnProperty('cheatScore')) {
        return row.Desc + '---(' + row.count + '次)---(加' + row.cheatScore + '分)'
      } else {
        return row.Desc + '---(' + row.count + '次)'
      }
    },
    formatUserBlackTime(row) {
      const userType = row.userType
      if (userType === 2) {
        return this.formatTimeDate(row.blackTime)
      } else {
        return '--'
      }
      // const hasKey = this.cheatUserType.has(row.Uid)
      // if (hasKey) {
      //   const userType = this.cheatUserType.get(row.Uid)
      //   if (userType === 2) {
      //     return this.formatTimeDate(userType.blackTime)
      //   } else {
      //     return '--'
      //   }
      // } else {
      //   return '--'
      // }
    },
    formatOtherUids(row) {
      if (!row.hasOwnProperty('otherUid')) {
        return '----'
      }
      return row.otherUid.join()
    },
    getDetail(id, dt) {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/detail',
          ID: id,
          DateTime: dt
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          $this.showTongitsGameLog(obj)
        }
      })
    },
    showTongitsGameLog(obj) {
      this.GameLog = obj.Row
      this.GameLogVisible = true
      this.Gid = obj.Gid
    },
    closeDialog() {
      this.GameLogVisible = false
    },
    showTidCheatLogs(row) {
      this.TidCheatLogVisible = true
      this.TidCheatLogs = row.TidCheatLogs
    },
    showCheatLogs(row) {
      this.CheatLogVisible = true
      this.CheatLogs = row.CheatInfos
    },
    showButton(row) {
      return row.userType === 2
    }
  }
}
</script>

<template>
  <el-col class="app-container">
    <el_row>
      <el-form :model="checkTime" label-width="90px" :inline="true" size="small">
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="checkTime.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="checkTime.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="UID：">
          <el-input v-model.number="Uid" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="getData">查询</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="getData">刷新</el-button>
        </el-form-item>
        <el-form-item label="排序方式：">
          <el-select v-model.number="sortType" placeholder="请选择">
            <el-option
              v-for="itemSort in sortTypeOption"
              :key="itemSort.value"
              :label="itemSort.label"
              :value="itemSort.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份：">
          <el-select v-model.number="cheatType" placeholder="请选择">
            <el-option
              v-for="itemCheatType in cheatTypeOption"
              :key="itemCheatType.value"
              :label="itemCheatType.label"
              :value="itemCheatType.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="cheatLogs"
        border
        style="width: 1800px;"
      >
        <el-table-column
          prop="Uid"
          label="玩家ID"
          width="100"
          align="center"
        />
        <el-table-column
          label="身份"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatUserType(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="CheatScore"
          label="疑似度"
          width="100"
          align="center"
        />
        <el-table-column
          prop="BlackTime"
          label="拉⿊时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatUserBlackTime(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="LastEndTime"
          label="最近牌局时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.LastEndTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="LastCheatTime"
          label="最近作弊时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.LastCheatTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="历史作弊实锤"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content" style="max-width: 300px">
                <div v-for="(member, index) in scope.row.Infos" :key="index">
                  <!--                  {{ member.Desc }}-&#45;&#45;({{ member.count }})-&#45;&#45;({{ member.cheatScore }})-->
                  {{ formatCheatInfo(member) }}
                </div>
              </div>
              <!--              <span>{{ scope.row.Infos[0].Desc }}-&#45;&#45;({{ scope.row.Infos[0].count }})</span>-->
              <span>{{ formatCheatInfo(scope.row.Infos[0]) }}</span>
            </el-tooltip>
          </template>
          <!--          <template slot-scope="scope">-->
          <!--            <div>-->
          <!--              <el-tooltip placement="right">-->
          <!--                <template #content>-->
          <!--                  <div v-for="(item, index) in scope.row.Infos" :key="index">{{ item }}</div>-->
          <!--                </template>-->
          <!--                <span>{{ scope.row.Infos[0] }}</span>-->
          <!--              </el-tooltip>-->
          <!--            </div>-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          label="作弊详情"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showTidCheatLogs(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="400"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeWhite(scope.row,0)">洗白</el-button>
            <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeWhite(scope.row,2)">拉黑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="clientDB.GetPage().GetCurrentPage()"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="clientDB.GetPage().GetPageNum()"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clientDB.GetPage().GetTotalCount()"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el_row>
    <tongits-game-log :game-log="GameLog" :game-log-visible="GameLogVisible" :gid="Gid" :is-robot-map="isRobotMap" @closeDialog="closeDialog" />
    <el-dialog title="桌子作弊详情" :visible.sync="TidCheatLogVisible" width="100%">
      <el-table :data="TidCheatLogs" border>
        <el-table-column width="200" property="Tid" label="桌⼦id" />
        <el-table-column width="200" property="FirstCheatTime" label="该桌⾸次作弊实锤时间">
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.FirstCheatTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" property="TotalCheatScore" label="疑似度增加" />
        <el-table-column width="300" property="Infos" label="作弊信息">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content" style="max-width: 300px">
                <div v-for="(member, index) in scope.row.Infos" :key="index">
                  <!--                  {{ member.Desc }}-&#45;&#45;({{ member.count }})-->
                  {{ formatCheatInfo(member) }}
                </div>
              </div>
              <!--              <span>{{ scope.row.Infos[0].Desc }}-&#45;&#45;({{ scope.row.Infos[0].count }})</span>-->
              <span>{{ formatCheatInfo(scope.row.Infos[0]) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="300" label="作弊局详情">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showCheatLogs(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="具体作弊详情" :visible.sync="CheatLogVisible" width="100%">
      <el-table :data="CheatLogs" border>
        <el-table-column width="200" property="endTime" label="结束时间">
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.endTime) }}</div>
          </template>
        </el-table-column>

        <el-table-column width="200" property="otherUid" label="在该桌其他真⼈玩家id">
          formatOtherUids
          <template slot-scope="scope">
            <span>{{ formatOtherUids(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" property="cheatScore" label="疑似度增加" />
        <el-table-column width="300" property="Infos" label="该局操作异常">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content" style="max-width: 300px">
                <div v-for="(member, index) in scope.row.Infos" :key="index">
                  <!--                  {{ member.Desc }}-&#45;&#45;({{ member.count }})-->
                  {{ formatCheatInfo(member) }}
                </div>
              </div>
              <!--              <span>{{ scope.row.Infos[0].Desc }}-&#45;&#45;({{ scope.row.Infos[0].count }})</span>-->
              <span>{{ formatCheatInfo(scope.row.Infos[0]) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="300" label="作弊局详情">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDetail(scope.row.logId,scope.row.endTime)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-col>

</template>

<style scoped>

</style>
