<script>
import request from '@/utils/request'
import { $libDate, ClientTableData } from '@/utils/common'
import PusoyWildLog from '@/views/playerManage/components/PusoyWildLog.vue'
import PusoyGameLog from '@/views/playerManage/components/PusoyGameLog.vue'
import { getInfo } from '@/api/user'
import { sendLark } from '@/api/lark'
import {map} from "core-js/internals/array-iteration";
export default {
  components: { PusoyGameLog,PusoyWildLog },
  data() {
    return {
      blackReason: 1,
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
      GameWildLogVisible: false,
      GameWildLog: {},
      Gid: 21,
      gidOption: [
        { label: 'PUSOY', value: 21 },
        { label: 'PUSOY WILD', value: 126 }
      ],
      isRobotMap: {},
      TidCheatLogVisible: false,
      TidCheatLogs: [],
      CheatLogVisible: false,
      CheatLogs: [],
      cheatUserType: new Map(),
      sortType: 1,
      sortTypeOption: [
        { label: '按时间', value: 0 },
        { label: '按疑似度', value: 1 },
        { label: '按拉黑时间', value: 3 }
      ],
      cheatType: -1,
      cheatTypeOption: [
        { label: '全部', value: -1 },
        { label: '普通', value: 0 },
        { label: '疑似', value: 1 },
        { label: '黑子', value: 2 }
      ],
      BlackVisible: false,
      editBlack: {
        Uids: [],
        Reason: '疑似度超过50分',
        Operator: ''
      },
      BlackOperator: '',
      GameLogUidsMap: new Map(),
      uidNickMap: {}
    }
  },
  created() {
    this.getOperator()
    this.getData()
  },
  methods: {

    getOperator() {
      const $this = this
      getInfo(this.$store.getters.token).then(function(response) {
        if (response.RetCode === 0) {
          $this.BlackOperator = response.Data.nick
        }
      }).catch((e) => {
        console.log('getOperator failed', e)
      })
    },
    getCheatData() {
      this.getData()
    },
    getCheatInfo(cheatType) {
      const infos = []
      let info = ''
      switch (cheatType) {
        case 1:
          info = '全垒打2人做小'
          break
        case 2:
          info = '全垒打1人做小'
          break
        case 3:
          info = '4人局躲加分牌'
          break
        case 4:
          info = '3人局做小牌'
          break
        case 5:
          info = '3人局全crack'
          break
        case 6:
          info = '3人局全0分'
          break
        case 7:
          info = '3人局2人crack'
          break
        default:
          info = ''
          break
      }
      infos.push(info)
      return infos
    },
    getTidCheatInfo(cheatTypeMap) {
      const infos = []
      for (const [key, value] of cheatTypeMap) {
        let info = ''
        switch (key) {
          case 1:
            info = '全垒打2人做小 ' + value + '局'
            break
          case 2:
            info = '全垒打1人做小 ' + value + '局'
            break
          case 3:
            info = '4人局躲加分牌 ' + value + '局'
            break
          case 4:
            info = '3人局做小牌 ' + value + '局'
            break
          case 5:
            info = '3人局全crack ' + value + '局'
            break
          case 6:
            info = '3人局全0分 ' + value + '局'
            break
          case 7:
            info = '3人局2人crack ' + value + '局'
            break
          default:
            info = ''
            break
        }
        infos.push(info)
      }
      return infos
    },
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
          Path: '/misc/pusoy/cheat/log/v1',
          Gid: this.Gid,
          Uid: this.Uid,
          Start: this.checkTime.start / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogRows = data.Items || []

          const cheatLogs = []
          // /////////////
          for (let i = 0; i < cheatLogRows.length; i++) {
            const row = cheatLogRows[i]
            if (this.cheatType !== -1 && row.userType !== this.cheatType) {
              continue
            }
            const cheatLog = {
              Uid: row.uid,
              CheatScore: row.cheatScore,
              UserType: row.userType,
              BlackOperator: row.blackOperator,
              BlackReason: row.blackReason,
              BlackTime: row.blackTime,
              UpdateTime: row.updateTime,
              LastEndTime: row.lastEndTime || 0,
              CheatRadio: row.cheatRadio || 0,
              CheatInfos: [],
              TidCheatLogs: [],
              TrustScore: row.trustScore,
              TrustLevel: row.trustLevel,
              TrustMaxScore: row.trustMaxScore
            }
            // eslint-disable-next-line no-prototype-builtins
            if (row.maxCheatScore) {
              cheatLog.MaxCheatScore = row.maxCheatScore
            } else {
              cheatLog.MaxCheatScore = 0
            }
            cheatLogs.push(cheatLog)
          }
          let sortName = 'UpdateTime'
          if (this.sortType === 1) {
            sortName = 'CheatScore'
          } else if (this.sortType === 3) {
            sortName = 'BlackTime'
          }
          $this.clientDB = new ClientTableData(cheatLogs, $this.pageNum, {}, sortName, -1, 'Uid')
          $this.handleCurrentChange(1)
        }
      })
    },
    getUidLogs(row) {
      // console.log(ttt)
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/log/v1/log',
          Gid: this.Gid,
          Uid: row.Uid,
          Start: this.checkTime.start / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogRows = data.Items || []
          if (cheatLogRows.length > 0) {
            const tidCheatLogs = []
            const rowLog = cheatLogRows[0]
            const nick = new Set()
            if (rowLog.datas) {
              for (let j = 0; j < rowLog.datas.length; j++) {
                const tidRow = rowLog.datas[j]
                const tidCheatLog = {
                  Tid: tidRow.tid,
                  Gid: tidRow.gid,
                  TableMoney: tidRow.tableMoney,
                  CheatScore: tidRow.cheatScore,
                  FirstCheatTime: tidRow.firstCheatTime,
                  PlayCheatLogs: [],
                  CheatInfos:[],
                }
                if (tidRow.datas) {
                  const cheatTypeMap = new Map()
                  for (let k = 0; k < tidRow.datas.length; k++) {
                    const cheatRow = tidRow.datas[k]
                    const playCheatLog = {
                      EndTime: cheatRow.EndTime,
                      CheatScore: cheatRow.CheatScore,
                      LogId: cheatRow.LogId,
                      OtherUid: cheatRow.CheatUids,
                      CheatOtherUids: cheatRow.CheatUids,
                      Gid: cheatRow.Gid,
                      TableMoney: cheatRow.TableMoney,
                      CheatInfos: this.getCheatInfo(cheatRow.CheatType),
                      Uid:cheatRow.Uid
                    }
                    if (cheatTypeMap.has(cheatRow.CheatType)){
                      cheatTypeMap.set(cheatRow.CheatType, cheatTypeMap.get(cheatRow.CheatType) + 1)
                    } else {
                      cheatTypeMap.set(cheatRow.CheatType, 1)
                    }
                    tidCheatLog.PlayCheatLogs.push(playCheatLog)
                  }
                  tidCheatLog.CheatInfos = this.getTidCheatInfo(cheatTypeMap)
                }

                tidCheatLogs.push(tidCheatLog)
              }
            }

            const ob = this.clientDB.GetDataByID(row.Uid)
            ob.TidCheatLogs = tidCheatLogs
            ob.Nick = nick
            this.clientDB.UpdateData2('Uid', ob)
          }
        }
      })
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
      if (ts === 0) {
        return '--'
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    changeWhite(row, userType) {
      const tips = '是否确认将玩家ID为' + row.Uid + '的玩家洗白?'
      this.$confirm(tips, '提示', { type: 'warning' }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/misc/pusoy/cheat/update/user/type',
            UserType: 0,
            Uid1: row.Uid,
            Uid2: 0,
            Uid3: 0,
            Gid: this.Gid,
            Reason: '',
            Operator: ''
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const ob = this.clientDB.GetDataByID(row.Uid)
            ob.BlackTime = 0
            ob.UserType = 0
            ob.BlackOperator = ''
            ob.BlackReason = ''
            this.clientDB.UpdateData2('Uid', ob)
          }
        })
        this.refreshShow()
      }).catch(() => {
        console.log('取消')
      })
    },
    changeBlack(row) {
      this.BlackVisible = true
      this.editBlack.Uids = row.CheatOtherUids
      this.editBlack.Reason = '疑似度超过自主拉黑的分值'
      this.editBlack.Operator = this.BlackOperator
    },
    save(row) {
      this.BlackVisible = false
      console.log(this.editBlack)
      const uid1 = this.editBlack.Uids[0] || 0
      const uid2 = this.editBlack.Uids[1] || 0
      const uid3 = this.editBlack.Uids[2] || 0
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/update/user/type',
          UserType: 2,
          Uid1: uid1,
          Uid2: uid2,
          Uid3: uid3,
          Gid: this.Gid,
          Reason: this.editBlack.Reason,
          Operator: this.editBlack.Operator
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const changeUids = data.Items || []
          for (let i = 0; i < changeUids.length; i++) {
            const ob = this.clientDB.GetDataByID(changeUids[i])
            ob.BlackTime = Math.floor(Date.now() / 1000)
            ob.UserType = 2
            ob.BlackOperator = this.BlackOperator
            ob.BlackReason = this.editBlack.Reason
            this.clientDB.UpdateData2('Uid', ob)
          }
        }
      })
      this.refreshShow()
    },
    formatUserType(row) {
      const userType = row.UserType
      if (userType === 0) {
        return '信誉'
      } else if (userType === 1) {
        return '疑似'
      } else if (userType === 2) {
        return '黑名单'
      }
    },
    formatCheatInfo(row) {
      if (row === undefined) {
        return '--'
      }
      if (row.length === 0) {
        return '--'
      } else {
        return row[0]
      }
    },
    formatUserBlackTime(row) {
      const userType = row.UserType
      if (userType === 2) {
        return this.formatTimeDate(row.BlackTime)
      } else {
        return '--'
      }
    },
    formatUserBlackInfo(row) {
      const userType = row.UserType
      if (userType === 2) {
        return '拉黑原因：' + row.BlackReason + '，拉黑人：' + row.BlackOperator
      } else {
        return '--'
      }
    },
    formatOtherUids(row) {
      if (!row.OtherUid || !row.CheatOtherUids) {
        return '----'
      }
      const strArray = []
      for (let i = 0; i < row.OtherUid.length; i++) {
        const uid = row.OtherUid[i]
        if (row.CheatOtherUids.includes(uid)) {
          const redStr = '<span style="color: red">' + row.OtherUid[i] + '</span>'
          strArray.push(redStr)
        } else {
          strArray.push(row.OtherUid[i])
        }
      }
      return strArray.join()
    },
    showGamelog(obj) {
      if (this.Gid === 21) {
        this.GameLog = {
          gid: this.Gid,
          detail: obj
        }
        this.GameLogVisible = true
      } else {
        this.GameWildLog = {
          gid: this.Gid,
          detail: obj
        }
        this.GameWildLogVisible = true
      }
    },
    closeDialog() {
      this.GameLogVisible = false
      this.GameWildLogVisible = false
    },
    getDetail(id, dt) {
      const $this = this
      if (id <= 0) {
        return
      }
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
          $this.showGamelog(obj)
        }
      })
    },
    showTableMoney(tableMoney) {
      return (tableMoney / 1000).toFixed(1)
    },
    showButton(row) {
      return row.userType === 2
    },
    getValueColor(value) {
      if (value >= this.maybeMin) return '#ff0000'
      return '#000000'
    },
    getBlackUserIds(uids) {
      return uids.join()
    },
    formatGameId(gameId) {
      if (gameId === 21) {
        return 'PUSOY'
      } else if (gameId === 126) {
        return 'PUSOY WILD'
      } else {
        return '未知游戏'
      }
    },
    formatUserTrustLevel(row) {
      if (row.AppId === 2000005 || row.AppId === 3000005 || row.AppId === 1000014) {
        row.RegisterChannel = 'CP'
      } else {
        row.RegisterChannel = 'BP'

      }
      if (row.UserType === 3) {
        return '认证高信' + '(' + row.RegisterChannel + ')'
      }
      const trustLevel = row.TrustLevel
      switch (trustLevel) {
        case 1:
          return '低危用户' + '(' + row.RegisterChannel + ')'
        case 2:
          return '疑似用户' + '(' + row.RegisterChannel + ')'
        case 3:
          return '黑子用户' + '(' + row.RegisterChannel + ')'
        case 4:
          return '低信用户' + '(' + row.RegisterChannel + ')'
        case 5:
          return '高信用户' + '(' + row.RegisterChannel + ')'
        default:
          return '--'
      }
    },
    changeSortType() {
      let sortName = 'UpdateTime'
      if (this.sortType === 1) {
        sortName = 'CheatScore'
      } else if (this.sortType === 2) {
        sortName = 'CheatRadio'
      } else if (this.sortType === 3) {
        sortName = 'RealBlackTime'
      } else if (this.sortType === 4) {
        sortName = 'TrustMaxScore'
      } else if (this.sortType === 5) {
        sortName = 'MaxCheatScore'
      }
      if (this.clientDB.TotalData.length !== 0) {
        this.clientDB = new ClientTableData(this.clientDB.TotalData, this.pageNum, {}, sortName, -1, 'Uid')
        this.refreshShow()
      }
    },
  }
}
</script>

<template>
  <el-col class="app-container">
    <h5 class="title" style="color: red;">uid是0查询的是选择日期的最近3000个玩家</h5>
    <h5 class="title" style="color: red;">每个玩家获取的最近的100条作弊记录</h5>
    <h5 class="title" style="color: red;">查看详情的话先查询，再展开</h5>
    <el_row>
      <el-form :model="checkTime" label-width="90px" :inline="true" size="small">
        <el-form-item label="选择日期：">
          <el-date-picker
            v-model="checkTime.start"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="UID：">
          <el-input v-model.number="Uid" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="getCheatData">查询</el-button>
          <!--          <el-button size="mini" type="primary" icon="el-icon-plus" @click="getCheatData">刷新</el-button>-->
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
        <el-form-item label="游戏：">
          <el-select v-model.number="Gid" placeholder="请选择">
            <el-option
              v-for="itemGid in gidOption"
              :key="itemGid.value"
              :label="itemGid.label"
              :value="itemGid.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="cheatLogs"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="Uid"
          label="玩家ID"
          width="100"
          align="center"
        />
        <el-table-column
          label="信任等级"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatUserTrustLevel(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="TrustScore"
          label="信任分"
          width="80"
          align="center"
        />
        <el-table-column
          prop="TrustMaxScore"
          label="历史最高信任分"
          width="80"
          align="center"
        />
        <el-table-column
          label="身份"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatUserType(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="CheatScore"
          label="疑似度"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span :style="{color: getValueColor(scope.row.CheatScore)}">{{ scope.row.CheatScore }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MaxCheatScore"
          label="历史最高疑似度"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span :style="{color: getValueColor(scope.row.MaxCheatScore)}">{{ scope.row.MaxCheatScore }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="BlackTime"
          label="拉⿊时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatUserBlackTime(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="CheatRadio"
          label="异常局占比"
          width="80"
          align="center"
        />
        <el-table-column
          label="拉⿊信息"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatUserBlackInfo(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="LastEndTime"
          label="最近牌局时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.LastEndTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          label="最近作弊时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.UpdateTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="详情"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="getUidLogs(scope.row)"
            >
              查询
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="作弊详情"
          width="100"
          align="center"
          type="expand"
          inline
        >
          <template slot-scope="scopeTid">
            <el-table :data="scopeTid.row.TidCheatLogs" border>
              <el-table-column width="200" property="Tid" label="桌⼦id" />
              <el-table-column width="200" property="Gid" label="游戏">
                <template slot-scope="scope">
                  {{ formatGameId(scope.row.Gid) }}
                </template>
              </el-table-column>
              <el-table-column width="200" property="TableMoney" label="场次">
                <template slot-scope="scope">
                  <div>{{ showTableMoney(scope.row.TableMoney) }}</div>
                </template>
              </el-table-column>
              <el-table-column width="200" property="FirstCheatTime" label="该桌⾸次作弊实锤时间">
                <template slot-scope="scope">
                  <div>{{ formatTimeDate(scope.row.FirstCheatTime) }}</div>
                </template>
              </el-table-column>
              <el-table-column width="100" property="CheatScore" label="疑似度增加" />
              <el-table-column width="300" property="CheatInfos" label="作弊信息">
                <template slot-scope="scope">
                  <el-tooltip placement="right">
                    <div slot="content" style="max-width: 300px">
                      <div v-for="(member, index) in scope.row.CheatInfos" :key="index">
                        {{ member }}
                      </div>
                    </div>
                    <span>{{ formatCheatInfo(scope.row.CheatInfos) }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column width="300" label="作弊局详情" type="expand" inline>
                <template slot-scope="scopeCheat">
                  <el-table :data="scopeCheat.row.PlayCheatLogs" border>
                    <el-table-column width="200" property="endTime" label="结束时间">
                      <template slot-scope="scopeInfo">
                        <div>{{ formatTimeDate(scopeInfo.row.EndTime) }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column width="200" label="在该桌其他真⼈玩家id">
                      <template slot-scope="scopeInfo">
                        <p v-html="formatOtherUids(scopeInfo.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column width="100" property="CheatScore" label="疑似度增加" />
                    <el-table-column width="300" property="CheatInfos" label="该局操作异常">
                      <template slot-scope="scopeInfo">
                        <el-tooltip placement="right">
                          <div slot="content" style="max-width: 300px">
                            <div v-for="(member, index) in scopeInfo.row.CheatInfos" :key="index">
                              {{ member }}
                            </div>
                          </div>
                          <!--              <span>{{ scope.row.Infos[0].Desc }}-&#45;&#45;({{ scope.row.Infos[0].count }})</span>-->
                          <span>{{ formatCheatInfo(scopeInfo.row.CheatInfos) }}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column width="300" label="作弊局详情">
                      <template slot-scope="scopeInfo">
                        <el-button
                          type="text"
                          size="small"
                          @click="getDetail(scopeInfo.row.LogId,scopeInfo.row.EndTime)"
                        >查看
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <!--            <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeWhite(scope.row,0)">-->
                        <!--              洗白-->
                        <!--            </el-button>-->
                        <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeBlack(scope.row,2)">
                          拉黑
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200"
            align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeWhite(scope.row,0)">
              洗白
            </el-button>
<!--            <el-button type="primary" size="small" :disabled="showButton(scope.row)" @click="changeBlack(scope.row,2)">-->
<!--              拉黑-->
<!--            </el-button>-->
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
    <pusoyWild-log :game-log="GameWildLog" :game-log-visible="GameWildLogVisible" @closeDialog="closeDialog" />
    <pusoyGame-log :game-log="GameLog" :game-log-visible="GameLogVisible" @closeDialog="closeDialog" />
    <el-dialog title="拉黑" :visible.sync="BlackVisible" width="50%">
      <el-row>
        <el-form :model="editBlack" label-width="150px" size="small">

          <el-form-item
            label="玩家id："
            disabled="true"
          >
            {{ getBlackUserIds(editBlack.Uids) }}
          </el-form-item>
          <el-form-item
            label="操作者："
            disabled="true"
          >
            {{ editBlack.Operator }}
          </el-form-item>
          <el-form-item
            label="拉黑原因："
            disabled="true"
          >
            <el-input v-model="editBlack.Reason" />
          </el-form-item>
          <el-form-item
            label=""
          >
            <el-button @click="editBlack.Reason+='疑似度超过50分'">疑似度超过50分</el-button>
            <el-button @click="editBlack.Reason+='，疯狂首出喂牌'">疯狂首出喂牌</el-button>
            <el-button @click="editBlack.Reason+='，拆牌狂喂'">拆牌狂喂</el-button>
            <el-button @click="editBlack.Reason+='，带同伙喂牌'">带同伙喂牌</el-button>
            <el-button @click="editBlack.Reason+='，同名或类似名称团伙'">同名或类似名称团伙</el-button>
            <el-button @click="editBlack.Reason+='，1分FOLD'">1分FOLD</el-button>
            <el-button @click="editBlack.Reason+='，累计N个pot胜率过50'"> 累计N个pot胜率过50%</el-button>

          </el-form-item>
          <el-form-item>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" autofocus="true" @click="save">保存</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </el-col>

</template>

<style scoped>

</style>
