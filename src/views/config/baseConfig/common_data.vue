<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-col :span="2" :offset="20">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
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
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="Type"
          label="类型"
          width="150"
        >
          <template v-slot:header>
            <el-select v-model="type" size="mini" @change="handleFilter">
              <el-option v-for="(o,key) in clientDB.FilterMap['Type']" :key="parseInt(key)" :label="o" :value="parseInt(key)" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Key"
          label="key"
        />
        <el-table-column
          prop="Value"
          label="值"
        />
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

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="form" :model="edit" label-width="80px">
          <el-form-item label="类型">
            <el-select v-model="edit.Type" placeholder="placeholder">
              <el-option
                v-for="(item, idx) in clientDB.FilterMap['Type']"
                :key="parseInt(idx)"
                :label="item"
                :value="parseInt(idx)"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Key">
            <el-input v-model="edit.Key" placeholder="key" />
          </el-form-item>

          <el-form-item label="值">
            <el-input v-model="edit.Value" type="textarea" :rows="3" placeholder="值" />
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { ClientTableData, $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'

const filterMap = {
  Type: { 1: 'IP', 2: 'Device', 3: 'Uid', 4: '用户标签', 5: '支付配置修改日志' }
}

function newItem() {
  return { ID: 0, Type: 1, Key: '', Value: '' }
}

export default {
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      type: 1,
      dialogVisible: false,
      edit: newItem()
    }
  },
  computed: {

  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    handleClose(done) {
      this.dialogVisible = true
      done()
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['ID', 'Key', 'Value'])
      this.refreshShow()
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      // this.clientDB.FilterData()
      // this.refreshShow()
      this.getList()
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
    // 操作类函数
    clickData(row, column, event) {
      this.edit = row
      this.dialogVisible = true
    },
    handleCreate() {
      this.edit = newItem()
      this.dialogVisible = true
    },
    getList() {
      const $this = this
      request({
        url: '/other/comm/data/all',
        method: 'get',
        data: {
          Env: this.env,
          Type: this.type
        }
      }).then(response => {
        const objs = response.Data || {}
        $this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
        $this.handleCurrentChange(1)
      })
    },
    update() {
      const $this = this
      request({
        url: '/other/update/comm/data',
        method: 'post',
        data: {
          Key: this.edit.Key,
          Type: this.edit.Type,
          Val: this.edit.Value
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.getList()
          $this.$message.success('更新成功')
          this.dialogVisible = false
        } else {
          $this.$message.error('更新失败')
        }
      })
    }
  }
}
</script>
