<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-form :model="form" label-width="80px" :inline="true" size="small">
          <el-form-item label="站点">
            <site-selector v-model="form.Site" :show-all="true" />
          </el-form-item>
          <el-form-item label="日期选择">
            <el-date-picker
              v-model="form.QueryTime"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{ height: '10px' }"
        :cell-style="libShow.DefaultTableCell"
        :default-sort="{ prop: 'TodayPayAmount', order: 'descending' }"
        @sort-change="onSortChange"
        style="padding:10px;width: 100%"
      >
        <el-table-column prop="No" label="排名" width="100" />
        <el-table-column prop="Account" label="平台ID" width="150" />
        <el-table-column prop="Uid" label="用户ID" width="150">
          <template slot-scope="scope">
            {{ scope.row.Uid === 0 ? '-' : scope.row.Uid }}
          </template>
        </el-table-column>
        <el-table-column prop="TodayPayAmount" label="当日充值" sortable="custom" />
        <el-table-column prop="TotalPayAmount" label="累计充值" sortable />
        <el-table-column prop="TodayWithdrawAmount" label="当日提出" sortable="custom" />
        <el-table-column prop="TotalWithdrawAmount" label="累计提出" sortable />
        <el-table-column prop="PayWithdrawRatio" label="充提比">
          <template slot-scope="scope">
            {{ scope.row.TodayWithdrawAmount > 0 ? (scope.row.TodayPayAmount / scope.row.TodayWithdrawAmount).toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="TodayPayCount" label="当日充值次数" sortable="custom" />
        <el-table-column prop="TotalPayCount" label="累计充值次数" sortable />
        <el-table-column prop="MaxPayAmount" label="最高单笔充值" sortable />
        <el-table-column prop="Site" label="站点" width="100" />
      </el-table>
      <el-row type="flex" justify="end">
        <el-col :span="12">
          <div class="block">
            <el-pagination
              :current-page="tableDB.GetPage().GetCurrentPage()"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="tableDB.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDB.GetPage().GetTotalCount()"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>

import SiteSelector from "@/components/SiteSelect/index.vue";
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import request from '@/utils/request'

const filterMap = {}

export default {
  name: 'PayWithdrawTop',
  components: {SiteSelector},
  data() {
    return {
      form: {
        Site: '',
        QueryTime: new Date().getTime(),
        OrderBy: 'PayAmount',
        Order: 'DESC'
      },
      libShow: $libShow,
      libMoney: new MoneyShow(['TodayPayAmount', 'TotalPayAmount', 'TodayWithdrawAmount', 'TotalWithdrawAmount']),
      tableDB: new ClientTableData([], 10, filterMap),
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    refreshShow() {
      this.tableData = this.tableDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.tableDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.tableDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    onSortChange(column) {
      console.log('onSortChange column:', column)
      switch (column.prop) {
        case 'TodayPayAmount':
          this.form.OrderBy = 'PayAmount'
          break
        case 'TodayPayCount':
          this.form.OrderBy = 'PayCount'
          break
        case 'TodayWithdrawAmount':
          this.form.OrderBy = 'WithdrawAmount'
          break
        case 'TodayWithdrawCount':
          this.form.OrderBy = 'WithdrawCount'
          break
        default:
          return
      }
      this.form.Order = column.order === 'ascending' ? 'ASC' : 'DESC'
      this.getList()
    },
    getList() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/pay/withdraw/top',
          Site: this.form.Site,
          QueryTime: parseInt(this.form.QueryTime / 1000),
          OrderBy: this.form.OrderBy,
          Order: this.form.Order
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data ? response.Data : []
          for (let i = 0; i < objs.length; i++) {
            objs[i].No = i + 1
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.tableDB = new ClientTableData(objs, 10, filterMap, $this.form.OrderBy, -1)
          $this.handleCurrentChange(1)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
