<template>
  <div class="app-container">
    <el-row>
      <el-col :span="2" :offset="22">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getInfo()">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-form label-width="100px" size="small" :inline="true">
        <el-form-item>
        <el-date-picker
          v-model="timeRange"
          size="mini"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
        </el-form-item>
        <el-form-item>
        <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <template>
      <el-row>
        <el-col :span="20">
          <el-button size="mini" @click="clearFilter">清除所有过滤器</el-button>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            @input="searchChange"
          />
        </el-col>
      </el-row>

      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="RequestPath"
          label="路径"
          sortable
          width="300"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['RequestPath']" size="mini" @change="handleFilter">
              <el-option label="全部" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['RequestPath']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ scope.row.RequestPath }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="180"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="OpType"
          width="150"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['OpType']" size="mini" @change="handleFilter">
              <el-option label="操作类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['OpType']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('OpType', scope.row.OpType) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="Content"
          label="日志内容"
          min-width="600"
        >
          <template slot-scope="scope">
            <div :class="scope.row.IsJSON==1?'content':''">
              {{ scope.row.NewContent!=""?scope.row.NewContent:scope.row.Content }}
            </div>

          </template>
        </el-table-column>
        <el-table-column
          prop="Operator"
          label="操作人"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Operator']" size="mini" @change="handleFilter">
              <el-option label="全部" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Operator']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ scope.row.Operator }}
          </template>
        </el-table-column>
        <el-table-column
          label="对比"
          width="100"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.IsJSON===1" type="primary" size="mini" @click="compare(scope.row)">对比</el-button>
          </template>
          >
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
    </template>
    <el-dialog
      title="对比"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <el-row>
        <el-col :span="11">
          修改前：
          <div v-html="edit.cntHtml" />
        </el-col>
        <el-col :span="11" :offset="1">
          修改后：
          <div v-html="edit.newHtml" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { $libDate, $LibJsonDiff, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'

const filterMap = { 'OpType': { 1: '登录', 2: '创建', 3: '修改', 4: '删除' },
  'Operator': 'all',
  'RequestPath': 'all'
}

export default {
  data() {
    const now = new Date()
    return {
      timeRange: [$libDate.GetDayBegin(now), $libDate.GetDayEnd(now)],
      types: [],
      type: '',
      operator: '',
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      libShow: $libShow,
      tableData: [],
      search: '',
      clientDB: new ClientTableData([], 10, {}),
      edit: {
        visible: false,
        cntHtml: '',
        newHtml: ''
      }
    }
  },
  computed: {},
  created() {
    console.log(1)
    this.name = store.getters.name
    this.getTypes()
  },
  methods: {
    compare(ob) {
      this.edit.visible = true
      let oldObj, newObj
      try {
        newObj = JSON.parse(ob.NewContent)
      } catch (e) {
        newObj = {}
      }

      try {
        oldObj = JSON.parse(ob.Content)
      } catch (e) {
        oldObj = {}
      }

      const ret = $LibJsonDiff.DiffHistory(oldObj, newObj)
      this.edit.cntHtml = ret[0]
      this.edit.newHtml = ret[1]
    },
    searchChange() {
      this.clientDB.Search(this.search, ['RequestPath', 'Content'])
      this.refreshShow()
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
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },

    getTypes() {
      const $this = this
      request({
        url: '/adminuser/logs/types',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          $this.types = response.Data == null ? [] : response.Data
        }
      })
    },
    getInfo() {
      let bTime = 0
      let eTime = 0
      const $this = this
      if (this.timeRange) {
        bTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = parseInt($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/adminuser/logs/all',
        method: 'get',
        data: {
          BeginTime: bTime,
          EndTime: eTime,
          Type: this.type === '0' ? '' : this.type,
          Operator: this.operator === '0' ? '' : this.operator
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data == null ? [] : response.Data
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    }
  }
}
</script>
<style>
.content{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 500px;
}
</style>
