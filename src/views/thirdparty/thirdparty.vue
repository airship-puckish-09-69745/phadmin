<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加第三方商
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="account"
          label="账号"
          width="300"
        />
        <el-table-column
          prop="intro"
          label="描述"
          width="400"
        />
        <el-table-column
          prop="secret"
          label="密钥"
          width="300"
        />
        <el-table-column
          prop="ver"
          label="接入版本"
          width="200"
        />
        <el-table-column
          label="操作"
          column-key="op"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="thirdpartyEdit(scope.row)"
            />
            <el-button
              size="mini"
              :icon="scope.row.status == 1 ? 'el-icon-check' : 'el-icon-close'"
              @click="thirdpartyForbid(scope.row.id, scope.row.account, scope.row.status == 1 ? 1 : 0)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
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
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form ref="edit.item" label-width="150px" size="small">
        <el-form-item label="账号：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.account"/>
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.intro" />
          </el-col>
        </el-form-item>
        <el-form-item label="IP白名单：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.ip" />
          </el-col>
        </el-form-item>
        <el-form-item label="接入版本：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.ver" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}
.table-bg thead th {
  background-color: #f5fafe;
}
.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}
.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}
.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.table th {
  font-weight: bold;
}
</style>
<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'

function newItem() {
  return { account: '', intro: '', ip: '', ver: '' }
}

export default {

  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1),
      search: '',
      libShow: $libShow,
      totalCount: 0,
      currentPage: 0,
      pageNum: 20,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
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
      return $libDate.FormateSecondStr(ts, 2)
    },

    thirdpartyEdit(row) {
      this.initFormData(true, row)
      this.edit.visible = true
    },

    // 分页处理
    refreshShow() {
      this.getList()
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.refreshShow()
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      console.log(row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },
    handleCreate() {
      this.edit.isEdit = false
      this.edit.item = newItem()
      this.edit.visible = true
    },
    getList() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/thirdparties/list',
          status: -1,
          page: this.currentPage,
          limit: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.rows || []
          console.log(objs)
          $this.ret = response.Data
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.totalCount = response.Data.total
          $this.tableData = objs
        }
      })
    },
    thirdpartyForbid(id, account, status) {
      var msg = '确定要 禁用 此第三方商吗？'
      if (status === 1) {
        msg = '确定要 启用 此第三方商吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/thirdparties/thirdparty/forbid',
            id: id,
            account: account,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success(response.Data)
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改第三方商' : '新增第三方商'
    },
    initFormData(bEdit, row) {
      this.edit.isEdit = bEdit
      Object.assign(this.edit.item, row)
    },
    createSave(postData) {
      postData.Env = this.env
      postData.Path = '/thirdparties/thirdparty/add'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          // this.refreshShow()
          this.getList()
          Message.success('添加成功！')
        }
      })
    },
    editSave(postData) {
      postData.Env = this.env
      postData.Path = '/thirdparties/thirdparty/update'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          // this.refreshShow()
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      return this.edit.item
    },
    checkData() {
      return true
    },
    save() {
      if (!this.checkData()) return
      if (this.edit.isEdit) {
        this.editSave(this.getPostData())
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    }
  }
}
</script>
