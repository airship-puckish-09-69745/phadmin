<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" size="small" :inline="true">
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
        sortable
        width="100"
      />
      <el-table-column
        prop="PayAmount"
        label="充值"
        sortable
        width="100"
      />
      <el-table-column
        prop="WithdrawAmount"
        label="提现"
        sortable
        width="100"
      />
      <el-table-column
        prop="BeforeMoney"
        label="资产(始)"
        sortable
        width="100"
      />
      <el-table-column
        prop="AfterMoney"
        label="资产"
        sortable
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.AfterMoney > scope.row.BeforeMoney" style="color:orange">{{ scope.row.AfterMoney }}</span>
          <span v-else>{{ scope.row.AfterMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="BeforeBase"
        label="基础(始)"
        sortable
        width="100"
      />
      <el-table-column
        prop="AfterBase"
        label="基础"
        sortable
        width="100"
      />
      <el-table-column
        prop="Diff"
        label="基资差"
        sortable
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.Diff<0" style="color:red">{{ scope.row.Diff }}</span>
          <span v-else>{{ scope.row.Diff }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.UpdateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="游戏"
        width="200"
      >
        <template slot-scope="scope">
          {{ getGameNames(scope.row.Games) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
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
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,
      gameNames: { 1: 'Rummy', 2: 'AB', 3: '龙虎', 4: 'JM', 5: 'Car', 6: '7UpD', 7: '红黑', 8: 'AK47', 9: 'TPatti' },
      item: {
        Uid: 0
      },
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      env: 'test',

      libMoney: new MoneyShow(['PayAmount', 'WithdrawAmount', 'BeforeMoney', 'AfterMoney', 'BeforeBase', 'AfterBase', 'Diff'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    getGameNames(data) {
      let ret = ''
      if (data != '') {
        const items = JSON.parse(data)
        if (items) {
          for (let i = 0; i < items.length; i++) {
            ret += this.gameNames[items[i]] + '|'
          }
        }
      }
      return ret
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
          Path: '/log/xman/daily/logs',
          BeginTime: bTime,
          EndTime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            const ob = objs[i]
            objs[i].Diff = ob.AfterBase - ob.AfterMoney
          }

          objs = $this.libMoney.TransForShow(objs)

          $this.clientDB = new ClientTableData(objs, 10, {}, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    }
  }
}
</script>
