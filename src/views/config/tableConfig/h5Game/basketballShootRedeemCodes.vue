<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleImport()">导入兑奖码</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
        <el-table-column prop="Code" label="兑奖码" sortable="custom" />
        <el-table-column prop="CreateTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="RedeemTime" label="兑奖时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.RedeemTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="IP" label="兑奖IP" />
        <el-table-column
          prop="Status"
          label="状态"
          width="110"
        >
          <template v-slot:header>
            <el-select v-model="status" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in filterMap.Status" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ scope.row.RedeemTime > 0 ? '已兑奖' : '未兑奖' }}
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'

const filterMap = {
  'Status': { 1: '已兑奖', 2: '未兑奖' }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libShow: $libShow,
      env: 'test',
      currentPage: 0,
      pageSize: 10,
      totalCount: 0,
      status: 0,
      filterMap: filterMap,

      edit: {
        visible: false,
        isEdit: false
      },

      AttrNames: {
        Code: '兑奖码',
        IP: '客户端IP',
        CreateTime: '创建时间',
        RedeemTime: '兑奖时间'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      if (ts === 0) {
        return ''
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleImport() {
    },
    getList() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/basketballshoot/redeem/codes',
          Status: this.status,
          PageNo: this.currentPage,
          PageSize: this.pageSize
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data.Data || []
          this.currentPage = response.Data.CurrentPageNo
          this.totalCount = response.Data.TotalCount
        }
      })
    }
  }
}
</script>
