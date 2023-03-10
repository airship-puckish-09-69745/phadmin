<template>
  <div id="app" class="page-container">
    <el-row>
      <el-col :offset="20" :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="6">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加
        </el-button>
      </el-col>
    </el-row>
    <template>
      <el-row>
        <el-col :span="4" :offset="12">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            @input="searchChange"
          />
        </el-col>
      </el-row>
      <el-col :span="16" :offset="4">
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
          <el-table-column
            prop="Key"
            label="键"
            width="400"
          />
          <el-table-column
            prop="Value"
            label="值"
            width="300"
          />
          <el-table-column
            label="操作"
            column-key="op"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="canDelete"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :offset="12" :span="8">
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
      </el-col>
    </template>
    <el-dialog title="添加模块" :visible.sync="dialogVisible">
      <el-form label-width="100px">
        <el-form-item label="Key值：">
          <el-input v-model="item.Key" />
        </el-form-item>
        <el-form-item label="Value值：">
          <el-input v-model="item.Value" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddModules">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import request from '@/utils/request'

const filterMap = {}

export default {
  data() {
    return {
      libShow: $libShow,
      tableData: [],
      clientDB: new ClientTableData([], 40, filterMap, 'Key', 1),
      dialogVisible: false,
      search: '',
      item: { Key: '', Value: '' }
    }
  },
  computed: {
    canDelete() {
      return this.$store.state.user.name === 'howard'
    }
  },
  created() {
    this.getList()
    console.log(1)
  },
  methods: {
    searchChange() {
      this.clientDB.Search(this.search, ['Key', 'Value'])
      this.refreshShow()
    },
    handleDelete(ob) {
      const $this = this
      this.$confirm('确认要删除模块？' + ob.Key + '：' + ob.Value)
        .then(_ => {
          const postData = {
            ID: ob.ID
          }
          request({
            url: '/configmap/delete',
            method: 'post',
            data: postData
          }).then(response => {
            $this.clientDB.DelData(ob.ID)
            $this.refreshShow()
            Message.success('删除成功！')
          })
        })
        .catch(_ => {
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
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 操作类函数
    handleCreate() {
      this.dialogVisible = true
    },
    getList() {
      request({
        url: '/configmap/all',
        method: 'get',
        data: {
          Type: 'langModules'
        }
      }).then(response => {
        const objs = response.Data || {}
        this.clientDB = new ClientTableData(objs, 40, filterMap, 'ID', -1)
        this.handleCurrentChange(1)
      })
    },
    AddModules() {
      const postData = {
        Type: 'langModules',
        Key: this.item.Key,
        Value: this.item.Value,
        Status: 0
      }
      request({
        url: '/configmap/create',
        method: 'post',
        data: postData
      }).then(response => {
        this.clientDB.AddData(response.Data)
        this.refreshShow()
        Message.success('保存成功！')
        this.dialogVisible = false
        this.item = { Key: '', Value: '' }
      })
    }
  }
}
</script>
