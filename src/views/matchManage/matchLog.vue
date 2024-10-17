<template>
  <div class="app-container">
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
        <el-form-item label="游戏：" :required="true">
          <el-select v-model="form.gameId" placeholder="请选择" size="mini">
            <el-option v-for="item in gameCfgs" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="比赛Id">
          <el-input v-model.number="form.matchId" placeholder=""/>
        </el-form-item>
        <el-date-picker
          v-model="form.queryTime"
          value-format="timestamp"
          type="date"
          placeholder="选择日期"
          size="mini"
          format="yyyy-MM-dd"
        />
        <el-form-item>
<!--          <el-button size="mini" @click="resetSearch">重置查询条件</el-button>-->
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe :header-cell-style="libShow.DefaultTableHeadClass"
                :cell-style="libShow.TableCell(10)" border style="width: 100%">
        <el-table-column prop="AwardUser.MatchTitle" label="标题"/>
        <el-table-column prop="gid" label="游戏名称" sortable>
          <template slot-scope="scope">
            {{ getGameName(scope.row.Gid) }}
          </template>
        </el-table-column>

        <el-table-column prop="TableID" label="比赛ID" sortable/>
        <el-table-column prop="AwardUser.CfgId" label="比赛配置ID"/>
        <el-table-column prop="AwardUser.RuleId" label="RuleId"/>
        <el-table-column prop="StartTime" label="开始时间" sortable>
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.FinishTime"/>
          </template>
        </el-table-column>
        <el-table-column prop="FinishTime" label="结束时间" sortable>
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.FinishTime"/>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="详情" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleShowAwardUser(scope.row)">获奖名单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog
      title="获奖用户查询"
      :visible.sync="visible"
      width="50%"
    >
      <el-descriptions :column="3">
        <el-descriptions-item label="比赛">{{ matchShow.CfgId + ' ' + matchShow.MatchTitle }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">
          <DateTimeShow :show-type="2" :timestamp="matchShow.StartTime"/>
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          <DateTimeShow :show-type="2" :timestamp="matchShow.FinishTime"/>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        ref="filterTable"
        :data="UserList"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Rank"
          label="Rank"
        >
          <template slot-scope="scope">
            {{ scope.row.Rank }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Rank"
          label="Account"
        >
          <template slot-scope="scope">
            {{ usersMap[scope.row.Uid].Account }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Rank"
          label="NickName"
        >
          <template slot-scope="scope">
            {{ usersMap[scope.row.Uid].Nick }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Rank"
          label="Uid"
        >
          <template slot-scope="scope">
            {{ scope.row.Uid }}
          </template>
        </el-table-column>
        <el-table-column
          prop="prize"
          label="Prize"
        >
          <template slot-scope="scope">
            {{ (scope.row.Reward / 1000) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import {$libShow} from '@/utils/common'

export default {
  name: 'MatchMonitor',
  components: {DateTimeShow},
  data() {
    return {
      libShow: $libShow,
      form: {
        gameId: 2031,
        queryTime: new Date(),
        matchId: 0,
      },
      gameCfgs: [
        {"value": 2031, "label": "tongits"},
      ],
      statusCfgs: [
        {"value": 1, "label": "已展示"},
        {"value": 2, "label": "入场中"},
        {"value": 3, "label": "已开始"},
        {"value": 4, "label": "已结束"},
        {"value": 5, "label": "已隐藏"},
        {"value": 6, "label": "已下架"},
      ],
      repeatCfgs: [
        {"value": 0, "label": "单场"},
      ],
      csCfgs: [],
      tableData: [],
      showDevTool: false,
      visible: false,
      UserList: [],
      matchShow: {
        CfgId: 0,
        MatchTitle: '',
        StartTime: 0,
        FinishTime: 0,
      },
      usersMap:{},
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
  },
  methods: {
    resetSearch() {
      this.form.gameId = 2031
      this.form.status = -1
      this.form.repeatType = 0
    },
    getList() {
      let matchId = this.form.matchId
      if (matchId === '') {
        matchId = 0
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/match/log',
          gid: this.form.gameId,
          queryTime: parseInt(this.form.queryTime / 1000),
          matchId:matchId,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data.list || []
          this.usersMap =  response.Data.users
          this.tableData = objs
          console.log(objs)
        } else {
          console.log("获取列表 失败")
        }
      })
    },
    getGameName(gameId) {
      var gameName = ""
      for (var i = 0; i < this.gameCfgs.length; i++) {
        if (this.gameCfgs[i].value == gameId) {
          gameName = this.gameCfgs[i].label
          break
        }
      }
      return gameName
    },
    handleShowAwardUser(row) {
      this.visible = true
      let o = JSON.parse(row.AwardUser.Ext)
      o.sort(function (a, b) {
        return a.Rank - b.Rank
      })
      this.UserList = o
      this.matchShow.CfgId = row.AwardUser.CfgId
      this.matchShow.MatchTitle = row.AwardUser.MatchTitle
      this.matchShow.StartTime = row.StartTime
      this.matchShow.FinishTime = row.FinishTime
      console.log(o)
    },
    getStatusName(status) {
      var statusName = ""
      for (var i = 0; i < this.statusCfgs.length; i++) {
        if (this.statusCfgs[i].value == status) {
          statusName = this.statusCfgs[i].label
          break
        }
      }
      return statusName
    },
  }
}
</script>
