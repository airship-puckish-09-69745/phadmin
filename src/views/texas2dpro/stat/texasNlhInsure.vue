<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.BeginDate"
            value-format="timestamp"
            type="date"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="">
          <span> - </span>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.EndDate"
            value-format="timestamp"
            type="date"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="">
          <el-form-item label="玩家id">
            <el-input v-model.number="searchForm.Uid" size="mini" placeholder="玩家id" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="search">查询</el-button>
          </el-form-item>
        </el-form-item>

        <el-form-item label="">
          <el-form-item label="牌局id">
            <el-input v-model.number="searchForm.LogID" size="mini" placeholder="牌局id" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="search">查询</el-button>
          </el-form-item>
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
    >
      <el-table-column
        prop="LogDate"
        label="日期"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.InsureTime, 1) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LogTime"
        label="时间"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.InsureTime, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="InsureChange"
        label="保险账变"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ (scope.row.Insure - scope.row.InsureFail ) / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="投保玩家ID"
      >
        <template slot-scope="scope">
          {{ scope.row.Uid }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Insure"
        label="投保金额"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.Insure / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Outs"
        label="OUTS数量"
      >
        <template slot-scope="scope">
          {{ scope.row.Outs }}
        </template>
      </el-table-column>
      <el-table-column
        prop="InsureRatio"
        label="赔率"
      >
        <template slot-scope="scope">
          {{ scope.row.InsureRatio / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LogID"
        label="牌局ID"
      >
        <template slot-scope="scope">
          <router-link :to= "{name: 'texasNlhGameDetail', query: { SrvLogId: scope.row.logid, dateTime: scope.row.InsureTime }}" @click.native="recordShow = false" style="color: blue">
            {{ scope.row.logid }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row type="flex" justify="center">

      <el_col :span="6">
        <div> 汇总： {{ totalInsure.toFixed(2) }} </div>
      </el_col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="6">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
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
        BeginDate: $libDate.GetDayBegin(new Date().getTime()),
        EndDate: $libDate.GetDayBegin(new Date().getTime()),
        Uid: '',
        LogID: ''
      },
      totalInsure: 0,
      tableData: [],
      currentData: [],
      totalCount: 0,
      currentPage: 1,
      pageNum: 10,
      libShow: $libShow
    }
  },
  created() {

  },
  methods: {
    search() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/texasnlhdata/insure',
          Uid: Number(_this.searchForm.Uid),
          logId: Number(_this.searchForm.LogID),
          beginTime: Date.parse(new Date(_this.searchForm.BeginDate).toString()) / 1000,
          endTime: Date.parse(new Date(_this.searchForm.EndDate).toString()) / 1000 + 86400
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          if (objs.total > 0) {
            _this.totalCount = objs.list.length
            _this.tableData = objs.list
            _this.currentPage = 1
            _this.refreshShow()
            _this.calTotalInsure()
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
    calTotalInsure() {
      this.totalInsure = 0
      for (var i = 0; i < this.tableData.length; i++) {
        this.totalInsure += (this.tableData[i].Insure - this.tableData[i].InsureFail) / 1000
      }
    },
    // 分页处理
    refreshShow() {
      this.currentData = []
      for (var i = (this.currentPage - 1) * this.pageNum; i < this.tableData.length; i++) {
        if (this.currentData.length === this.pageNum) {
          break
        }
        this.currentData.push(this.tableData[i])
      }
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageNum = val
      this.refreshShow()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.refreshShow()
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
    }
  }
}
</script>
