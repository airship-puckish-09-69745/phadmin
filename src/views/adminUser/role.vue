<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加角色
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
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="Name"
          label="角色名"
          width="200"
        />
        <el-table-column
          label="用户列表"
          min-width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.UserNames?scope.row.UserNames.join("; "):'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Description"
          label="描述"
          width="200"
        />
        <el-table-column
          label="操作"
          column-key="op"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="roleEdit(scope.row.ID)"
            >配置权限
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
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
    >
      <el-form ref="edit.item" label-width="150px" size="small">
        <el-form-item label="角色名：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Name" />
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Description" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="edit.isEdit" label="权限：" :required="true">
          <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
            <tr v-for="(o,idx) in edit.permissions" :key="idx">
              <td>
                {{ o.Name }}
              </td>
              <td>
                {{ o.Key }}
              </td>
              <td>
                <el-checkbox v-model="o.View" :disabled="!o.CanView">查看</el-checkbox>
                <el-checkbox v-model="o.Update" :disabled="!o.CanUpdate">修改</el-checkbox>
                <el-checkbox v-model="o.Create" :disabled="!o.CanCreate">添加</el-checkbox>
                <el-checkbox v-model="o.Delete" :disabled="!o.CanDelete">删除</el-checkbox>
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item>
          <el-col :span="12" :offset="10">
            <el-button type="primary" size="mini" @click="save">保存</el-button>
          </el-col>
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
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'

function newItem() {
  return { Name: '', Description: '' }
}

export default {

  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1),
      search: '',
      libShow: $libShow,

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        permissions: []
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
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

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    handleCreate() {
      this.edit.isEdit = false
      this.edit.item = newItem()
      this.edit.visible = true
    },
    roleEdit(id) {
      this.initFormData(true, id)
      this.getUserPermissions(id)
      this.edit.visible = true
    },
    getList() {
      const $this = this
      request({
        url: '/adminuser/roles',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data == null ? [] : response.Data
          $this.clientDB = new ClientTableData(objs, 10, {}, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    },

    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '配置角色权限' : '新增角色'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/adminuser/role/create',
        method: 'post',
        data: {
          name: this.edit.item.Name,
          description: this.edit.item.Description
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.getList()
        }
      })
    },
    editSave(postData) {
      const pers = {}
      for (let i = 0; i < this.edit.permissions.length; i++) {
        const ob = this.edit.permissions[i]
        let flag = 0
        flag = ob.View ? (flag | 0x01) : flag
        flag = ob.Update ? (flag | 0x02) : flag
        flag = ob.Create ? (flag | 0x04) : flag
        flag = ob.Delete ? (flag | 0x08) : flag
        pers[ob.Key] = flag
      }
      request({
        url: '/adminuser/role/update',
        method: 'post',
        data: {
          roleID: this.edit.item.ID,
          name: this.edit.item.Name,
          description: this.edit.item.Description,
          ps: JSON.stringify(pers)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    checkData() {
      return true
    },
    save() {
      if (!this.checkData()) return
      if (this.edit.isEdit) {
        this.editSave()
      } else {
        this.createSave()
      }
      this.edit.visible = false
    },
    getUserPermissions(roleID) {
      const $this = this
      request({
        url: '/adminuser/role',
        method: 'get',
        data: {
          roleID: roleID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const rolePerm = response.Data.Role.permissions
          const permissions = response.Data.Permissions
          $this.edit.permissions = []
          for (let i = 0; i < permissions.length; i++) {
            const ob = permissions[i]
            const flag = rolePerm[ob.key]
            $this.edit.permissions.push({
              Name: ob.name,
              Key: ob.key,
              CanView: (ob.Flag & 0x01) > 0,
              CanUpdate: (ob.Flag & 0x02) > 0,
              CanCreate: (ob.Flag & 0x04) > 0,
              CanDelete: (ob.Flag & 0x08) > 0,
              View: (flag & 0x01) > 0,
              Create: (flag & 0x04) > 0,
              Update: (flag & 0x02) > 0,
              Delete: (flag & 0x08) > 0
            })
          }
        }
      })
    }
  }
}
</script>

