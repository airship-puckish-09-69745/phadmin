<script>
import request from '@/utils/request'
import { $libDate, ClientTableData } from '@/utils/common'
import TongitsGameLog from '@/views/playerManage/components/TongitsGameLog.vue'
import { getInfo } from '@/api/user'
import { sendLark } from '@/api/lark'
export default {
  components: { TongitsGameLog },
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
      Gid: 22,
      gidOption: [
        { label: 'TONGITS POT', value: 22 },
        { label: 'TONGITS JOKER', value: 28 },
        { label: 'TONGITS QUICK', value: 29 }
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
        { label: '按异常局占比', value: 2 },
        { label: '按拉黑时间', value: 3 },
        { label: '按历史信任分', value: 4 }
      ],
      cheatType: -1,
      cheatTypeOption: [
        { label: '全部', value: -1 },
        { label: '普通', value: 0 },
        { label: '疑似', value: 1 },
        { label: '黑子', value: 2 },
        { label: '认证高信', value: 3 }
      ],
      // CheatType: 0,
      // CheatTypeOption: [
      //   { label: '全部', value: 0 },
      //   { label: '拆牌喂牌', value: 1 },
      //   { label: '单局多次喂牌', value: 2 },
      //   { label: '近5局首出喂牌局数>=3', value: 3 },
      //   { label: '皇冠FIGHT', value: 4 },
      //   { label: '皇冠FOLD', value: 5 },
      //   { label: '打一局不拿pot就离开', value: 6 },
      //   { label: '大POT高胜率', value: 7 },
      //   { label: '大POT多人离开', value: 8 },
      //   { label: '玩超多局数且盈利', value: 9 },
      //   { label: '名字相似度过高', value: 10 }
      // ],
      maybeMin: 100,

      BlackVisible: false,
      editBlack: {
        Uid: 0,
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
    this.getDataCfg()
    // this.getCheatUserType()
    this.getData()
    this.getNicks()
    console.log(1)
  },
  methods: {
    getNicks() {
      const tmp = localStorage.getItem('uid-nicks')
      if (tmp) {
        if (tmp != null) {
          this.uidNickMap = JSON.parse(tmp)
        }
      }
    },
    getNick(uid) {
      const nick = this.uidNickMap[uid]
      if (nick) {
        return nick
      }
    },
    setNick(uid, nick) {
      this.uidNickMap[uid] = nick
    },
    saveNicks() {
      localStorage.setItem('uid-nicks', JSON.stringify(this.uidNickMap))
    },
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
    getDataCfg() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'tongits_cheat_cfg'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('robotSetting', response.Data)
          // $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const CheatCfg = JSON.parse(response.Data.Data)
            $this.maybeMin = CheatCfg.MaybeMin
          }
        }
      })
    },
    getCheatData() {
      // this.getCheatUserType()
      this.getData()
    },
    getCheatTotalInfo(fileds, fieldsCount, fieldsScore) {
      const infos = []
      if (fieldsCount === null || fieldsCount.length === 0) {
        fieldsCount = []
        for (let i = 0; i < fileds.length; i++) {
          fieldsCount.push(0)
        }
      }
      for (let i = 1; i < fileds.length; i++) {
        if (fileds[i] === 0) {
          continue
        }
        let info = ''
        switch (i) {
          case 0:
            info = '前伙伴返还分:' + '  加分=' + fieldsScore[i]
            break
          case 1:
            info = '拆牌喂牌:' + '  加分=' + fieldsScore[i]
            break
          case 2:
            info = '单局多次喂牌：' + '  加分=' + fieldsScore[i]
            break
          case 3:
            info = '近5局首出喂牌局数>=3:' + '  加分=' + fieldsScore[i]
            break
          case 4:
            info = '皇冠FIGHT:' + '  加分=' + fieldsScore[i]
            break
          case 5:
            info = '皇冠FOLD:' + '  加分=' + fieldsScore[i]
            break
          case 6:
            info = '打一局不拿pot就离开:' + '  加分=' + fieldsScore[i]
            break
          case 7:
            info = '大POT高胜率:' + '  加分=' + fieldsScore[i]
            break
          case 8:
            info = '大POT多人离开:' + '  加分=' + fieldsScore[i]
            break
          case 9:
            info = '玩超多局数且盈利:' + '  加分=' + fieldsScore[i]
            break
          case 10:
            info = '名字相似度过高:' + '  加分=' + fieldsScore[i]
            break
          default:
            info = ''
            break
        }
        infos.push(info)
      }
      return infos
    },
    getCheatInfo(fileds, fieldsCount, fieldsScore) {
      if (fileds === undefined) {
        return []
      }
      const infos = []
      if (fieldsCount === undefined || fieldsCount.length === 0) {
        fieldsCount = []
        for (let i = 0; i < fileds.length; i++) {
          fieldsCount.push(0)
        }
      }
      for (let i = 0; i < fileds.length; i++) {
        if (fileds[i] === 0) {
          continue
        }
        let info = ''
        switch (i) {
          case 0:
            info = '返还前伙伴分值' + fieldsScore[i]
            break
          case 1:
            info = '拆牌喂牌:' + '  次数=' + fieldsCount[i] + '  加分=' + fieldsScore[i]
            break
          case 2:
            info = '单局' + fieldsCount[i] + '次喂牌：' + '  加分' + fieldsScore[i]
            break
          case 3:
            info = '近5局首出喂牌局数>=3:' + '  加分' + fieldsScore[i]
            break
          case 4:
            info = '皇冠FIGHT:' + '  加分' + fieldsScore[i]
            break
          case 5:
            info = '皇冠FOLD:' + '  加分' + fieldsScore[i]
            break
          case 6:
            info = '打一局不拿pot就离开:' + '  加分' + fieldsScore[i]
            break
          case 7:
            info = '累积' + fieldsCount[i] + 'POT胜率超过50%:' + '  加分' + fieldsScore[i]
            break
          case 8:
            info = '大POT多人离开:' + '  加分' + fieldsScore[i]
            break
          case 9:
            info = '玩的局数>' + fieldsCount[i] + '且盈利:' + '  加分' + fieldsScore[i]
            break
          case 10:
            info = '名字相似度过高:' + '  加分' + fieldsScore[i]
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
      if (this.Uid === '' || this.Uid === undefined) {
        this.Uid = 0
      }
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
          SortType: this.sortType,
          UserType: this.cheatType,
          Start: this.checkTime.start / 1000,
          End: this.checkTime.end / 1000,
          IsNew: true
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
              CheatRadio: row.cheatRadio, // row.lastEndTime,
              BlackOperator: row.blackOperator,
              BlackReason: row.blackReason,
              BlackTime: row.blackTime,
              UpdateTime: row.updateTime,
              LastEndTime: row.lastEndTime || 0,
              CheatInfos: [],
              TidCheatLogs: [],
              Nick: new Set(),
              TrustLevel: 0,
              TrustScore: 0,
              TrustMaxScore: 0
            }
            if (row.trustScore !== undefined) {
              cheatLog.TrustScore = row.trustScore
              cheatLog.TrustLevel = row.trustLevel
              cheatLog.TrustMaxScore = row.trustMaxScore
            }
            // eslint-disable-next-line no-prototype-builtins
            if (row.hasOwnProperty('maxCheatScore')) {
              cheatLog.MaxCheatScore = row.maxCheatScore
            } else {
              cheatLog.MaxCheatScore = 0
            }
            cheatLogs.push(cheatLog)
          }
          let sortName = 'UpdateTime'
          if (this.sortType === 1) {
            sortName = 'CheatScore'
          } else if (this.sortType === 2) {
            sortName = 'CheatRadio'
          } else if (this.sortType === 3) {
            sortName = 'BlackTime'
          } else if (this.sortType === 4) {
            sortName = 'TrustMaxScore'
          }
          $this.clientDB = new ClientTableData(cheatLogs, $this.pageNum, {}, sortName, -1, 'Uid')
          $this.handleCurrentChange(1)
        }
      })
    },
    getUidLogs(row) {
      // console.log(ttt)
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/log/new/log',
          Page: 1,
          Limit: 9999,
          Gid: this.Gid,
          Uid: row.Uid,
          SortType: this.sortType,
          UserType: this.cheatType,
          Start: this.checkTime.start / 1000,
          End: this.checkTime.end / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          const cheatLogRows = data.Items || []
          if (cheatLogRows.length > 0) {
            const tidCheatLogs = []
            const rowLog = cheatLogRows[0]
            const nick = new Set()
            if (rowLog.hasOwnProperty('datas')) {
              for (let j = 0; j < rowLog.datas.length; j++) {
                const tidRow = rowLog.datas[j]
                const tidCheatLog = {
                  Tid: tidRow.tid,
                  Gid: tidRow.gid,
                  TableMoney: tidRow.tableMoney,
                  CheatScore: tidRow.cheatScore,
                  FirstCheatTime: tidRow.firstCheatTime,
                  CheatInfos: this.getCheatTotalInfo(tidRow.historyCheatField, tidRow.historyCheatFieldCount, tidRow.historyCheatFieldScore),
                  PlayCheatLogs: []
                }
                if (tidRow.hasOwnProperty('datas')) {
                  for (let k = 0; k < tidRow.datas.length; k++) {
                    const cheatRow = tidRow.datas[k]
                    const playCheatLog = {
                      Uid: cheatRow.uid,
                      EndTime: cheatRow.endTime,
                      CheatScore: cheatRow.cheatScore,
                      LogId: cheatRow.logId,
                      OtherUid: cheatRow.otherUid,
                      CheatOtherUids: cheatRow.cheatOtherUids,
                      Gid: cheatRow.gid,
                      TableMoney: cheatRow.tableMoney,
                      CheatInfos: this.getCheatInfo(cheatRow.cheatFields, cheatRow.cheatFieldsCount, cheatRow.cheatScores),
                      TableCheatScore: cheatRow.tableCheatScore ? cheatRow.tableCheatScore : 0
                    }
                    if (cheatRow.hasOwnProperty('nick')) {
                      nick.add(cheatRow.nick)
                      this.setNick(row.Uid, cheatRow.nick)
                      this.saveNicks()
                    }
                    tidCheatLog.PlayCheatLogs.push(playCheatLog)
                    if (tidCheatLog.FirstCheatTime >= cheatRow.endTime) {
                      tidCheatLog.FirstCheatTime = cheatRow.endTime
                    }
                  }
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
    getCheatUserType() {
      // console.log(ttt)
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/user/type',
          Gid: this.Gid
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
      row.disAndGive = row.cheatFields[1]
      row.giveMoreTimes = row.cheatFields[2]
      row.firstGiveMoreTimes = row.cheatFields[3]
      row.preWinFight = row.cheatFields[4]
      row.preWinFold = row.cheatFields[5]
      row.leaveFre = row.cheatFields[6]
      row.bigPotWin = row.cheatFields[7]
      row.bigPotLeave = row.cheatFields[8]
      row.playMoreTimes = row.cheatFields[9]
      row.sameName = row.cheatFields[10]
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
            Desc: '近5局首出喂牌局数>=3',
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
            Desc: '打一局不拿pot就离开',
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

      if (row.sameName >= 1) {
        if (infosMap.has(10)) {
          infosMap.get(10).count += row.sameName
        } else {
          infosMap.set(10, {
            Desc: '名字相似度过高',
            count: row.sameName,
            cheatType: 10
          })
        }
        if (row.hasOwnProperty('cheatScores')) {
          if (infosMap.get(10).hasOwnProperty('cheatScore')) {
            infosMap.get(10).cheatScore += row.cheatScores[10]
          } else {
            infosMap.get(10).cheatScore = row.cheatScores[10]
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
        const tableMoney = (row.tableMoney / 1000).toFixed(1)
        infosMap.set(row.tid, {
          Tid: row.tid,
          CheatInfos: [row],
          TotalCheatScore: row.cheatScore,
          FirstCheatTime: row.endTime,
          Infos: this.addInfos([], row),
          Gid: row.gid,
          TableMoney: tableMoney // 桌子金额1000,
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
      let tips = '是否确认将玩家ID为' + row.Uid + '的玩家洗白?'
      if (userType === 3) {
        tips = '是否确认将玩家ID为' + row.Uid + '的玩家设置为认证高信?'
      }
      this.$confirm(tips, '提示', { type: 'warning' }).then(() => {
        const ob = this.clientDB.GetDataByID(row.Uid)
        ob.UserType = userType
        ob.CheatScore = 0
        if (userType===3){
          ob.BlackOperator = this.BlackOperator
          ob.BlackTime = Math.floor(Date.now() / 1000)
        }
        this.clientDB.UpdateData2('Uid', ob)
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/misc/tongits/cheat/update/user/type',
            UserType: userType,
            Uid: row.Uid,
            Gid: row.Gid,
            Reason: '',
            Operator: this.BlackOperator
          }
        }).then(response => {
        })
        this.refreshShow()
      }).catch(() => {
        console.log('取消')
      })
    },
    changeBlack(row) {
      this.BlackVisible = true
      this.editBlack.Uid = row.Uid
      this.editBlack.Reason = '疑似度超过50分'
      this.editBlack.Operator = this.BlackOperator
    },
    save(row) {
      this.BlackVisible = false
      console.log(this.editBlack)
      const ob = this.clientDB.GetDataByID(this.editBlack.Uid)
      ob.BlackTime = Math.floor(Date.now() / 1000)
      ob.UserType = 2
      ob.BlackOperator = this.BlackOperator
      ob.BlackReason = this.editBlack.Reason
      this.clientDB.UpdateData2('Uid', ob)
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/user/type',
          UserType: 2,
          Uid: this.editBlack.Uid,
          Gid: 22,
          Reason: this.editBlack.Reason,
          Operator: this.editBlack.Operator
        }
      }).then(response => {
      })
      this.refreshShow()
    },
    formatUserNick(row) {
      if (row.Nick.size === 0) {
        const _nick = this.getNick(row.Uid)
        if (_nick) {
          return _nick
        } else {
          return '--'
        }
      } else {
        const array = Array.from(row.Nick)
        return (array[0] === '' ? '--' : array[0])
      }
    },
    formatUserType(row) {
      const userType = row.UserType
      if (userType === 0) {
        return '普通'
      } else if (userType === 1) {
        return '疑似'
      } else if (userType === 2) {
        return '黑名单'
      } else if (userType === 3) {
        return '认证高信'
      }
    },
    formatUserTrustLevel(row) {
      const trustLevel = row.TrustLevel
      switch (trustLevel) {
        case 1:
          return '低危用户'
        case 2:
          return '疑似用户'
        case 3:
          return '黑子用户'
        case 4:
          return '低信用户'
        case 5:
          return '高信用户'
        default:
          return '--'
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
    formatCheatRadio(CheatRadio) {
      return CheatRadio + '%'
    },
    formatUserBlackTime(row) {
      const userType = row.UserType
      if (userType === 2) {
        return this.formatTimeDate(row.BlackTime)
      } else if (userType === 3) {
        return this.formatTimeDate(row.BlackTime)
      } else {
        return '--'
      }
    },
    formatUserBlackInfo(row) {
      const userType = row.UserType
      if (userType === 2) {
        return '拉黑原因：' + row.BlackReason + '，拉黑人：' + row.BlackOperator
      } else if (userType === 3) {
        return '认证高信，操作人：' + row.BlackOperator
      } else {
        return '--'
      }
    },
    formatOtherUids(row) {
      if (!row.hasOwnProperty('OtherUid') || !row.hasOwnProperty('CheatOtherUids')) {
        return '----'
      }
      if (!row.OtherUid || !row.CheatOtherUids) {
        return '----'
      }

      const myUid = row.Uid
      let partnerTableCheatScore = ''
      let noPartnerTableCheatScore = ''
      if (row.TableCheatScore !== undefined && Array.isArray(row.TableCheatScore)) {
        for (let i = 0; i < row.TableCheatScore.length; i++) {
          const tableScoreObj = row.TableCheatScore[i]
          if (row.CheatOtherUids.includes(tableScoreObj.uid)) {
            partnerTableCheatScore = '(' + tableScoreObj.oldCheatScore + ',' + tableScoreObj.newCheatScore + ')'
          } else if (tableScoreObj.uid !== myUid) {
            noPartnerTableCheatScore = '(' + tableScoreObj.oldCheatScore + ',' + tableScoreObj.newCheatScore + ')'
          }
        }
      } else if (row.TableCheatScore !== undefined && typeof row.TableCheatScore === 'number') {
        partnerTableCheatScore = '(' + row.TableCheatScore + ')'
      }

      const strArray = []
      for (let i = 0; i < row.OtherUid.length; i++) {
        const uid = row.OtherUid[i]
        if (row.CheatOtherUids.includes(uid)) {
          const redStr = '<span style="color: red">' + row.OtherUid[i] + partnerTableCheatScore + '</span>'
          strArray.push(redStr)
        } else if (uid === myUid) {
          const blueStr = '<span style="color: blue">' + row.OtherUid[i] + '</span>'
          strArray.push(blueStr)
        } else {
          strArray.push(row.OtherUid[i] + noPartnerTableCheatScore)
        }
      }
      // if (this.GameLogUidsMap.has(row.logId)) {
      //   const uids = this.GameLogUidsMap.get(row.logId)
      //   for (let i = 0; i < row.otherUid.length; i++) {
      //     if (uids.includes(row.otherUid[i])) {
      //       const redStr = '<span style="color: red">' + row.otherUid[i] + '</span>'
      //       strArray.push(redStr)
      //     } else {
      //       strArray.push(row.otherUid[i])
      //     }
      //   }
      // } else {
      //   return row.otherUid.join()
      // }
      return strArray.join()
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
    showTableMoney(tableMoney) {
      return (tableMoney / 1000).toFixed(1)
    },
    showTidCheatLogs(row) {
      this.TidCheatLogVisible = true
      this.TidCheatLogs = row.TidCheatLogs
    },
    showCheatLogs(row) {
      this.CheatLogVisible = true
      this.CheatLogs = row.CheatInfos
    },
    showButton(row, userType) {
      if (userType === 2) {
        return row.UserType === userType
      }
      return true
    },

    getValueColor(value) {
      if (value >= this.maybeMin) return '#ff0000'
      return '#000000'
    },
    toggleExpand(index) {
      const row = this.tableData[index]
      this.$set(row, '_expanded', !row._expanded)
      this.$refs.table.toggleRowExpansion(row, row._expanded)
    },
    formatGameId(gameId) {
      if (gameId == 22) {
        return 'Tongits POT'
      } else if (gameId == 28) {
        return 'Tongits JOKER'
      } else if (gameId == 29) {
        return 'Tongits QUICK'
      } else {
        return '未知游戏'
      }
    }
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
        <!--        <el-form-item label="结束日期：">-->
        <!--          <el-date-picker-->
        <!--            v-model="checkTime.end"-->
        <!--            value-format="timestamp"-->
        <!--            type="datetime"-->
        <!--            placeholder="选择日期"-->
        <!--            size="mini"-->
        <!--          />-->
        <!--        </el-form-item>-->
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
        <!--        <el-form-item label="作弊类型：">-->
        <!--          <el-select v-model.number="CheatType" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="itemCheatType in CheatTypeOption"-->
        <!--              :key="itemCheatType.value"-->
        <!--              :label="itemCheatType.label"-->
        <!--              :value="itemCheatType.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
          label="名字"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatUserNick(scope.row) }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          label="身份"-->
        <!--          width="80"-->
        <!--          align="center"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ formatUserType(scope.row) }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
          prop="CheatRadio"
          label="异常占比"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatCheatRadio(scope.row.CheatRadio) }}</div>

          </template>
        </el-table-column>
        <el-table-column
          prop="BlackTime"
          label="操作时间"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatUserBlackTime(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作信息"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatUserBlackInfo(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="LastEndTime"
          label="最近牌局时间"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.LastEndTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          label="最近作弊时间"
          width="100"
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
              <el-table-column width="300" property="Infos" label="作弊信息">
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

                    <el-table-column width="500" label="在该桌其他真⼈玩家id">
                      <template slot-scope="scopeInfo">
                        <p v-html="formatOtherUids(scopeInfo.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column width="100" property="CheatScore" label="疑似度增加" />
                    <el-table-column width="300" property="Infos" label="该局操作异常">
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
                  </el-table>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="changeWhite(scope.row,0)">
              洗白
            </el-button>
            <el-button type="primary" size="small" :disabled="showButton(scope.row,2)" @click="changeBlack(scope.row,2)">
              拉黑
            </el-button>
            <el-button type="primary" size="small" @click="changeWhite(scope.row,3)">
              认证高信
            </el-button>
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
    <tongits-game-log
      :game-log="GameLog"
      :game-log-visible="GameLogVisible"
      :gid="Gid"
      :is-robot-map="isRobotMap"
      @closeDialog="closeDialog"
    />
    <el-dialog title="拉黑" :visible.sync="BlackVisible" width="50%">
      <el-row>
        <el-form :model="editBlack" label-width="150px" size="small">

          <el-form-item
            label="玩家id："
            disabled="true"
          >
            {{ editBlack.Uid }}
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
