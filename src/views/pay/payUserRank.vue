<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="100px" :inline="true" size="small">

        <el-form-item label="排序：" :required="true">
          <el-select v-model.number="item.Type" placeholder="请选择">
            <el-option label="付费总额" :value="1" />
            <el-option label="付费次数" :value="2" />
            <el-option label="基础值" :value="3" />
            <el-option label="贡献值" :value="4" />
            <el-option label="总资产" :value="5" />
            <el-option label="Winning" :value="6" />
            <el-option label="Deposit" :value="7" />
            <el-option label="基资差" :value="8" />
          </el-select>
        </el-form-item>
        <el-form-item label="AppID：" :required="true">
          <el-input v-model="item.AppID" size="mini" />
        </el-form-item>

        <el-form-item label="条数：" :required="true">
          <el-select v-model.number="item.Limit" placeholder="请选择">
            <el-option label="100" value="100" />
            <el-option label="200" value="200" />
            <el-option label="500" value="500" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间段：">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        type="index"
      />
      <el-table-column
        prop="Uid"
        label="Uid"
        width="100"
      />
      <el-table-column
        prop="AppID"
        label="AppID"
        width="100"
      />
      <el-table-column
        prop="PayAmount"
        label="付费总额"
        sortable
        width="120"
      />
      <el-table-column
        prop="Withdraw"
        label="提款总额"
        sortable
        width="120"
      />
      <el-table-column
        prop="BaseValue"
        label="基础值"
        sortable
        width="120"
      />
      <el-table-column
        prop="Money"
        label="总资产"
        sortable
        width="120"
      />
      <el-table-column
        prop="BaseSubMoney"
        label="基资差"
        sortable
        width="120"
      />
      <el-table-column
        prop="PayTimes"
        label="付费次数"
        sortable
        width="120"
      />

      <el-table-column
        prop="WithdrawTimes"
        label="提款次数"
        sortable
        width="120"
      />

      <el-table-column
        prop="UpdateTime"
        label="修改时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.UpdateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Note"
        label="说明"
        width="300"
      >
        <template slot-scope="scope">
          <span @click="showEdit(scope.row)">{{ scope.row.Note === '' ? '无' : scope.row.Note }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="ProduceValue"
        label="贡献值"
        sortable
        width="120"
      />
      <el-table-column
        prop="Winning"
        label="Winning"
        sortable
        width="120"
      />
      <el-table-column
        prop="Deposit"
        label="Deposit"
        sortable
        width="120"
      />
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 40, 100, 500]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="修改"
      :visible.sync="edit.noteDialogVisible"
      width="30%"
    >
      <el-form label-width="80px">
        <el-form-item label="Uid：">
          {{ edit.item.Uid }}
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="edit.item.Note" size="mini" />
        </el-form-item>
      </el-form>
      <el-col :offset="16">
        <el-button size="mini" type="primary" @click="updateNote()">提交</el-button>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

const filterMap = {}
const type2Name = ['', 'PayAmount', 'PayTimes', 'BaseValue', 'ProduceValue', 'Money', 'Winning', 'Deposit', 'BaseSubMoney', 'Withdraw']

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,

      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),

      item: {
        Type: 1,
        AppID: 0,
        Limit: 100
      },

      edit: {
        item: {},
        noteDialogVisible: false
      },

      libMoney: new MoneyShow(['PayAmount', 'Money', 'BaseValue', 'ProduceValue', 'Winning', 'Deposit', 'BaseSubMoney', 'Withdraw'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    showEdit(ob) {
      this.edit.item = ob
      this.edit.noteDialogVisible = true
    },
    updateNote() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/pay/user/note',
          ID: this.edit.item.ID,
          Note: this.edit.item.Note
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.clientDB.UpdateData({ ID: ob.ID, Note: ob.Note })
          Message.success('更新成功！')
          $this.item.popVisible = false
        }
      })
    },
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/pay/user/info',
          BeginTime: bTime,
          EndTime: eTime,
          Type: this.item.Type,
          AppID: this.item.AppID,
          Limit: this.item.Limit
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.clientDB = new ClientTableData(objs, 10, filterMap, type2Name[$this.item.Type])
          $this.handleCurrentChange(1)
        }
      })
    }
  }
}
</script>
