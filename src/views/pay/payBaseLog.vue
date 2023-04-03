<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" size="small" :inline="true">
        <el-form-item label="Uid:">
          <el-input v-model="item.Uid" placeholder="用户uid" size="mini" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="opType" placeholder="placeholder">
            <el-option label="所有" :value="0" />
            <el-option
              v-for="item in opTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
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
        prop="ID"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="Uid"
        label="Uid"
        width="100"
      />
      <el-table-column
        prop="OpType"
        label="操作类型"
        width="100"
      >
        <template slot-scope="scope">
          {{ showOpType(scope.row.OpType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="充值"
        width="100"
      />
      <el-table-column
        prop="Money"
        label="资产"
        width="100"
      />
      <el-table-column
        prop="BaseValueHistory"
        label="基础(前)"
        width="100"
      />
      <el-table-column
        prop="BaseValue"
        label="基础(后)"
        width="100"
      />
      <el-table-column
        prop="Ret"
        label="公式结果"
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.Ret<0" style="color:red">{{ scope.row.Ret }}</span>
          <span v-else>{{ scope.row.Ret }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="PayHistory"
        label="历史充值"
        width="100"
      />
      <el-table-column
        prop="PayTimes"
        label="充值次数"
        width="100"
      />
      <el-table-column
        prop="ProduceValue"
        label="贡献值"
        width="100"
      />
      <el-table-column
        prop="Withdraw"
        label="总提款"
        width="100"
      />
      <el-table-column
        prop="WithdrawTimes"
        label="提款次数"
        width="100"
      />
      <el-table-column
        prop="SchemaBefore"
        label="调控结果"
        width="120"
      >
        <template slot-scope="scope">
          <span :style="'color:' + showSchemaResult(scope.row.SchemaBefore, 2)">{{ showSchemaResult(scope.row.SchemaBefore, 1) }}</span> /
          <span :style="'color:' + showSchemaResult(scope.row.SchemaAfter, 2)">{{ showSchemaResult(scope.row.SchemaAfter, 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="WinningsBefore"
        label="winnings控制线"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.WinningsBefore | toRupee }} / {{ scope.row.WinningsAfter | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Round"
        label="调控轮数"
        width="100"
      />
      <el-table-column
        prop="Note"
        label="说明"
        width="200"
      />
      <el-table-column
        prop="CreateTime"
        label="时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.CreateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
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
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from '../playerManage/components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  name: 'PayBaseLog',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      search: '',
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      libShow: $libShow,
      opType: 0,
      opTypeOptions: [
        { label: '充值', value: 1 },
        { label: 'winnings触线', value: 2 },
        { label: '提现', value: 3 },
        { label: '后台操作', value: 4 }
      ],

      item: {
        Uid: 0
      },
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      env: 'test',

      libMoney: new MoneyShow(['Amount', 'BaseValue', 'BaseValueHistory', 'Money', 'PayHistory', 'ProduceValue', 'Withdraw', 'Ret'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    showOpType(opType) {
      switch (opType) {
        case 1:
          return '充值'
        case 2:
          return 'winnings触线'
        case 3:
          return '提现'
        case 4:
          return '后台操作'
        default:
          return opType
      }
    },
    showSchemaResult(result, tag) {
      let name, color
      switch (result) {
        case 0:
          name = '不调控'
          color = ''
          break
        case 1:
          name = '赢'
          color = 'red'
          break
        case 2:
          name = '输'
          color = 'green'
          break
        case 3:
          name = '平'
          color = 'grey'
          break
        default:
          name = result
          color = ''
      }
      return tag === 1 ? name : color
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
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
      if (this.item.Uid !== 0) {
        this.$EventBus.$emit('uid-change', this.item.Uid)
      }
      const $this = this

      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/pay/base/log',
          Uid: this.item.Uid == '' ? 0 : this.item.Uid,
          BeginTime: bTime,
          EndTime: eTime,
          PageNo: this.currentPage,
          PageNum: this.pageNum,
          OpType: this.opType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data.Items || []

          const tMap = response.Data.RetMap
          for (const o in objs) {
            objs[o].Ret = tMap[objs[o].ID]
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.totalCount = response.Data.Count
          $this.tableData = objs
        }
      })
    }
  }
}
</script>
