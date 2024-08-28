<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.BeginTime"
            value-format="timestamp"
            type="date"
            placeholder="开始时间"
          />
        </el-form-item>
         <el-form-item label="">
          <el-date-picker
            v-model="searchForm.EndTime"
            value-format="timestamp"
            type="date"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="比赛ID">
            <el-input v-model.number="searchForm.MatchId" size="mini" placeholder="比赛ID" />
        </el-form-item>
        <el-form-item label="比赛名称">
            <el-input v-model.number="searchForm.MatchName" size="mini" placeholder="比赛名称" />
        </el-form-item>
        <el-form-item label="比赛状态">
            <el-input v-model.number="searchForm.Status" size="mini" placeholder="比赛状态" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="currentData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        prop="BeginTime"
        label="开赛日期"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.MatchBeginTime , 1) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="BeginTime"
        label="开赛时间"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.MatchBeginTime, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="EndTime"
        label="结束时间"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.MatchEndTime, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MatchId"
        label="比赛ID"
      >
        <template slot-scope="scope">
          {{ scope.row.MatchId }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MatchName"
        label="比赛名称"
      >
        <template slot-scope="scope">
          {{ scope.row.MatchName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        label="开赛状态"
      >
        <template slot-scope="scope">
          {{ showStatus(scope.row.Status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="SignUpPlayerCount"
        label="报名人数"
      >
     <template slot-scope="scope">
          {{ scope.row.SignUpPlayerCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="QuitPlayerCount"
        label="退赛人数"
      >
      <template slot-scope="scope">
          {{ scope.row.QuitPlayerCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="JoinPlayerCount"
        label="实际参赛人数"
      >
        <template slot-scope="scope">
          {{ scope.row.JoinPlayerCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="SignupFee"
        label="报名费"
      >
        <template slot-scope="scope">
          {{ scope.row.SignUpFee / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="TotalSignUpFee"
        label="总报名费"
      >
        <template slot-scope="scope">
          {{ scope.row.TotalSignUpFee / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ServiceFee"
        label="服务费"
      >
        <template slot-scope="scope">
          {{ scope.row.ServiceFee / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="TotalServiceFee"
        label="总服务费"
      >
        <template slot-scope="scope">
          {{ scope.row.TotalServiceFee / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ReBuyPlayerCount"
        label="ReBuy人数"
      >
        <template slot-scope="scope">
          {{ scope.row.ReBuyPlayerCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ReBuyTotalCount"
        label="ReBuy总次数"
      >
        <template slot-scope="scope">
          {{ scope.row.ReBuyTotalCount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="RewardFee"
        label="奖励数"
      >
        <template slot-scope="scope">
          {{ scope.row.RewardFee / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MatchIncome"
        label="比赛收益"
      >
        <template slot-scope="scope">
          {{ scope.row.MatchIncome / 1000 }}
        </template>
      </el-table-column>

      <el-table-column label="操作" column-key="op" width="160">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" type="primary" size="mini" @click="handUserRank(1, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row type="flex" justify="end">
      <el-col :span="6">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="getTitle()" :visible.sync="detailShow" width="60%" @close="handDetailClose">
        <el-table
          ref="filterTable"
          :data="detailData.tableData"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="padding:10px;width: 100%"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="MatchId"
            label="比赛ID"
          >
            <template slot-scope="scope">
              {{ scope.row.MatchId }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Rank"
            label="比赛名次"
          >
            <template slot-scope="scope">
              {{ showRank(scope.row.Rank) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="UId"
            label="玩家ID"
          >
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Nick"
            label="玩家昵称"
          >
            <template slot-scope="scope">
              {{ showNickName(scope.row.Profile) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="RebuyCount"
            label="ReBuy次数"
            width="100%"
          >
            <template slot-scope="scope">
              {{ scope.row.ReBuyCount }}
            </template>
          </el-table-column>
          <el-table-column
            prop="RewardNum"
            label="奖励"
            width="200%"
          >
            <template slot-scope="scope">
             {{ scope.row.RewardNum / 1000 }}
            </template>
          </el-table-column>
        </el-table>
        <br>
       <el-row type="flex" justify="center">
        <el-col :span="2">
            <div class="block">
              <el-pagination
                :current-page="detailData.currentPage"
                :page-sizes="[20]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="detailData.totalCount"
                @size-change="handleDetailSizeChange"
                @current-change="handleDetailCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'RocketRet',
  data() {
    return {
      searchForm: {
        BeginTime: $libDate.GetDayBegin(new Date().getTime()),
        EndTime: $libDate.GetDayBegin(new Date().getTime()),
        MatchId: 0,
        MatchName: '所有',
        Status: 0
      },
      tableData: [],
      currentData: [],
      editShow: false,
      editValue: 0,
      totalCount: 0,
      TotalIncome: 0,
      currentPage: 1,
      pageNum: 20,
      libShow: $libShow,
      detailShow: false,
      detailMatchId: 0,
      detailData: {
        tableData: [],
        currentData: [],
        totalCount: 0,
        currentPage: 1
      }
    }
  },
  created() {
    this.search(1)
  },
  methods: {
    search(page) {
      const _this = this
      _this.tableData = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/texasnlhdata/matchinfo',
          beginTime: _this.searchForm.BeginTime / 1000,
          endTime: _this.searchForm.EndTime / 1000 + 86400,
          matchId: _this.searchForm.MatchId,
          status: _this.searchForm.Status,
          matchName: _this.searchForm.MatchName,
          page: page
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          console.log(objs)
          if (objs.total > 0) {
            _this.totalCount = objs.total
            _this.tableData = objs.list
            _this.TotalIncome = objs.income / 1000
            _this.currentPage = page
            _this.refreshShow()
          } else {
            _this.totalCount = 0
            _this.tableData = []
          }
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
    },
    searchDetail(page, MatchId) {
      const _this = this
      _this.tableData = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/texasnlhdata/userrank',
          matchId: MatchId,
          page: page
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          console.log(objs)
          if (objs.total > 0) {
            _this.detailData.totalCount = objs.total
            _this.detailData.tableData = objs.list
            _this.detailData.currentPage = page
            _this.refreshDetailShow()
          } else {
            _this.detailData.totalCount = 0
            _this.detailData.tableData = []
          }
        } else {
          Message.error(response.Data)
        }
      })
    },
    // 分页处理
    refreshShow() {
      this.currentData = []
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.currentData.length === this.pageNum) {
          break
        }
        this.currentData.push(this.tableData[i])
      }
    },
    refreshDetailShow() {
      this.detailData.currentData = []
      for (var i = 0; i < this.detailData.tableData.length; i++) {
        if (this.detailData.currentData.length === this.pageNum) {
          break
        }
        this.detailData.currentData.push(this.detailData.tableData[i])
      }
    },
    handUserRank(page, ob) {
      this.detailShow = true
      this.detailMatchId = ob.MatchId
      this.searchDetail(1, this.detailMatchId)
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.search(this.currentPage)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search(this.currentPage)
    },
    handDetailClose() {
      this.detailShow = false
      this.detailMatchId = 0
    },
    handleDetailSizeChange(val) {
      this.pageNum = val
      this.searchDetail(this.detailData.currentPage, this.detailMatchId)
    },
    handleDetailCurrentChange(val) {
      this.detailData.currentPage = val
      this.searchDetail(this.detailData.currentPage, this.detailMatchId)
    },
    confirmDelete() {
      this.editShow = false
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.editLevel * 1000 === this.tableData[i].SmallBlind) {
          this.updateRecord(this.tableData[i].SmallBlind, this.editValue)
        }
      }
      this.editLevel = 0
    },
    sortBy(attr, rev) {
      return function(a, b) {
        var l = a[attr]
        var r = b[attr]
        if (l < r) {
          return rev * -1
        }
        if (l > r) {
          return rev * 1
        }
        return 0
      }
    },
    sortChange(ob) {
      this.currentData.sort(this.sortBy(ob.prop, ob.order === 'ascending' ? 1 : -1))
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 15) {
          sums[index] = '合计'
          return
        }
        switch (column.property) { // column.property可以匹配它的每一列的命名， 然后赋值
          case 'MatchIncome':
            sums[index] = this.TotalIncome
            break
          default:
            break
        }
      })
      return sums
    },
    formateDate(t, iType) {
      const dt = new Date(t * 1000)
      switch (iType) {
        case 1:
          return dt.Format('yyyy-MM-dd')
        case 2:
          return dt.Format('yyyy-MM-dd HH:mm:ss')
        case 3:
          return dt.Format('MM-dd')
        case 4:
          return dt.Format('HH:mm:ss')
        case 5:
          return dt.Format('HH:mm')
        case 6:
          return dt.Format('MM-dd HH:mm')
        case 7:
          return dt.Format('MM-dd HH:mm:ss')
      }
    },
    getTitle() {
      return '比赛排名'
    },
    showNickName(profile) {
      var obj = JSON.parse(profile)
      return obj['player_name']
    },
    showStatus(status) {
      return status > 2 ? '开赛成功' : '开赛失败'
    },
    showRank(Rank) {
      return Rank > 0 ? Rank : '--'
    }
  }
}
</script>
