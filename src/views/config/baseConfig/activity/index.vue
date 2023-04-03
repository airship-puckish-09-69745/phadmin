<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" key-id="ActivityConfig" :env-empty="true" />
    </el-row>

    <el-row style="padding-top: 5px">
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
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
        @row-click="handleEdit"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="ActivityType"
          label="活动类型"
          width="180"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['ActivityType']" size="mini" @change="handleFilter">
              <el-option label="活动类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['ActivityType']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ getActivityTypeName(scope.row.ActivityType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Name"
          label="名称"
          min-width="150"
        />
        <el-table-column
          prop="ValidTimeBegin"
          label="有效时间"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ formatDate(scope.row.ValidTimeBegin) }}至
            {{ formatDate(scope.row.ValidTimeEnd) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyTime"
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.ModifyTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Creator"
          label="最后修改人"
          width="100"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Status', scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <el-button
              v-if="scope.row.Status!=1"
              size="mini"
              type="success"
              icon="el-icon-upload2"
              @click="handleOnline(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status!=1"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==1"
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="handleOffline(scope.row)"
            >下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
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
    </div>

  </div>
</template>
<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import { getAll, del, copy, updateStatus } from '@/api/activity'
import store from '@/store'
import Publish from '@/components/Publish'

const filterMap = {
  'Status': { 0: '编辑', 1: '上架', 2: '下架' },
  'ActivityType': { 1: '日常活动', 2: '公告' }
}

export default {
  name: 'ActivityList',
  components: { Publish },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libShow: $libShow,
      env: 'test'
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
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatDate(ts) {
      return $libDate.FormateSecondStr(ts, 1)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
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

    // trans 活动类型名称
    getActivityTypeName(t) {
      t = parseInt(t)
      for (const i in filterMap['ActivityType']) {
        if (parseInt(i) === t) {
          return filterMap['ActivityType'][i]
        }
      }
    },

    getList() {
      getAll().then(response => {
        console.log('activity get list ', response)
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },

    // 编辑
    handleEdit(row, column, event) {
      if (column.columnKey !== 'op') {
        this.$router.push('/config/baseConfig/activity/edit/' + row.ID)
      }
    },

    // 创建
    handleCreate() {
      this.$router.push('/config/baseConfig/activity/create')
    },

    // 复制
    handleCopy(row) {
      copy({ id: row.ID }).then(response => {
        console.log('copy resp ', response)
      })
    },

    // 上架
    handleOnline(row) {
      updateStatus({ ID: row.ID, status: 1 }).then(response => {
        console.log('update status resp ', response)
      })
    },

    // 下架
    handleOffline(row) {
      updateStatus({ ID: row.ID, status: 2 }).then(response => {
        console.log('update status resp ', response)
      })
    },

    // 删除
    handleDelete(row) {
      del({ id: row.ID }).then(response => {
        console.log('copy resp ', response)
      })
    }
  }
}
</script>
