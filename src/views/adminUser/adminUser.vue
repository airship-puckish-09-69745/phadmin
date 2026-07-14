<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="4">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加管理员
        </el-button>
      </el-col>
      <el-col :span="7" >
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          @input="searchChange"
        />
      </el-col>
      <el-col :span="10">
        <el-button type="success" size="mini" style="float: right" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        max-height="700"
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
          width="70"
        />
        <el-table-column
          prop="Name"
          label="登录名"
          width="200"
        />
        <el-table-column
          prop="Nick"
          label="昵称"
          width="200"
        />
        <el-table-column
          prop="Mobile"
          label="手机"
          width="150"
        />
        <el-table-column
          prop="Role"
          label="角色"
          min-width="200"
        />
        <el-table-column prop="google_enable" label="google验证" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.google_enable"
              active-color="#13ce66"
              inactive-color="#c0c4cc"
              :active-value="1"
              :inactive-value="0"
              @change="handleGoogleEnableChanged(scope.row)"
              @click.native.stop
            />
            {{ getGoogleEnableDesc(scope.row.google_enable) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              title="角色"
              icon="el-icon-user"
              @click="userRoleEdit(scope.row.ID, scope.row.Name)"
            />
            <el-button
              size="mini"
              type="primary"
              title="权限"
              icon="el-icon-s-grid"
              @click="viewPermissions(scope.row.ID)"
            />
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="userEdit(scope.row.ID)"
            />
            <el-button
              size="mini"
              icon="el-icon-delete"
              @click="userForbid(scope.row.ID)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[40, 80, 120, 160]"
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
      width="30%"
    >
      <el-form ref="edit.item" label-width="150px" size="small">
        <el-form-item label="账号：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Name" />
          </el-col>
        </el-form-item>
        <el-form-item label="昵称：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Nick" />
          </el-col>
        </el-form-item>
        <el-form-item :label="getPWDTitle()" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Password" />
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码：" :required="true">
          <el-col :span="12">
            <el-input v-model="edit.item.Mobile" />
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
    <el-dialog
      :title="'用户角色管理（' + role.name + '）'"
      :visible.sync="role.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px"
    >
      <el-row>
        <el-transfer v-model="role.userRoles" :data="role.roles" :titles="['角色', '用户角色']" />
      </el-row>
      <el-row>
        <el-col :span="8" :offset="16" style="padding-top: 5px">
          <el-button size="mini" type="primary" @click="saveUserRole">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="用户权限查看"
      :visible.sync="permission.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="550px"
    >
      <div>
        <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
          <tr v-for="(o,idx) in permission.userPers" :key="idx">
            <td>
              {{ o.Name }}
            </td>
            <td>
              <el-checkbox v-model="o.View" :disabled="!o.View">查看</el-checkbox>
              <el-checkbox v-model="o.Update" :disabled="!o.Update">修改</el-checkbox>
              <el-checkbox v-model="o.Create" :disabled="!o.Create">添加</el-checkbox>
              <el-checkbox v-model="o.Delete" :disabled="!o.Delete">删除</el-checkbox>
            </td>
          </tr>
        </table>
      </div>
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
import hexMd5 from '@/utils/md5'

function newItem() {
  return { Name: '', Password: '', Mobile: '', Nick: '' }
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
        isEdit: false
      },

      role: {
        visible: false,
        userRoles: [],
        roles: [],
        name: '',
        id: 0
      },

      permission: {
        visible: false,
        userPers: [{ Name: '测试', View: true, Create: true, Update: false, Delete: true }]
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

    searchChange() {
      this.clientDB.Search(this.search, ['Name', 'Nick'])
      this.refreshShow()
    },
    getGoogleEnableDesc(val) {
      if (val === 0) {
        return '关闭'
      } else {
        return '打开'
      }
    },
    handleGoogleEnableChanged(row) {
      const action = row.google_enable === 0 ? '关闭验证' : '开启验证'

      this.$confirm(`确定要用户 ${row.Name}${action}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用确认方法
        request({
          url: '/adminuser/user/google/enabled/update',
          method: 'post',
          data: {
            ID: row.ID,
            googleEnable: row.google_enable
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success(action + '成功！')
            // 可以在这里更新数据或刷新列表
          } else {
            Message.error(action + '失败：' + response.msg)
            // 如果请求失败，回滚状态
            row.google_enable = row.google_enable === 0 ? 1 : 0
          }
        }).catch(error => {
          Message.error('请求失败：' + error)
          // 如果请求失败，回滚状态
          row.google_enable = row.google_enable === 0 ? 1 : 0
        })
      }).catch(() => {
        // 用户取消操作时回滚状态
        row.google_enable = row.google_enable === 0 ? 1 : 0
      })
    },

    userRoleEdit(id, name) {
      this.getUserRoles(id)
      this.role.name = name
      this.role.id = id
      this.role.visible = true
    },
    userEdit(id) {
      this.initFormData(true, id)
      this.edit.visible = true
    },
    viewPermissions(id) {
      this.getUserPermissions(id)
      this.permission.visible = true
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
    clickData(row, column, event) {
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
        url: '/adminuser/users',
        method: 'get',
        data: {
          bRoleInfo: 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const users = response.Data.Users
          const roles = response.Data.Roles
          for (let i = 0; i < users.length; i++) {
            users[i]['Role'] = roles[i]
          }

          $this.clientDB = new ClientTableData(users, 40, {}, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    },
    userForbid(id) {
      this.$confirm('确定要禁用此用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/adminuser/user/forbid',
          method: 'post',
          data: {
            ID: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('操作成功！')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改用户' : '新增用户'
    },
    getPWDTitle() {
      return this.edit.isEdit ? '重置密码' : '初始密码'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.item.Password = ''
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      this.edit.item.Password = hexMd5(this.edit.item.Password)
      request({
        url: '/adminuser/user/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      if (this.edit.item.Password !== '') {
        this.edit.item.Password = hexMd5(this.edit.item.Password)
      }
      request({
        url: '/adminuser/user/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
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
    },
    //* ******************* 用户角色管理 ***********************
    saveUserRole() {
      request({
        url: '/adminuser/user/roles/update',
        method: 'post',
        data: {
          userID: this.role.id,
          roleIDs: JSON.stringify(this.role.userRoles)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.role.visible = false
        }
      })
    },
    getUserRoles(id) {
      request({
        url: '/adminuser/user/roles',
        method: 'get',
        data: {
          userID: id
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const userRoles = response.Data.UserRoles
          const roles = response.Data.Roles

          const findRole = function(id) {
            if (userRoles) {
              for (let i = 0; i < userRoles.length; i++) {
                if (userRoles[i].id == id) {
                  return true
                }
              }
            }
            return false
          }
          this.role.userRoles = []
          this.role.roles = []
          for (let j = 0; j < roles.length; j++) {
            this.role.roles.push({
              key: roles[j].id,
              label: roles[j].name,
              disabled: false
            })
            if (findRole(roles[j].id)) {
              this.role.userRoles.push(roles[j].id)
            }
          }
        }
      })
    },

    //* ******************* 权限查看 ***********************
    getUserPermissions(id) {
      const $this = this
      request({
        url: '/adminuser/user/permissions',
        method: 'get',
        data: {
          UserID: id
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const permissions = response.Data.PerConfigs
          const perMap = response.Data.Perms

          this.permission.userPers = []
          for (let i = 0; i < permissions.length; i++) {
            // 各权限项是否可选中
            const flag = perMap[permissions[i].key]
            $this.permission.userPers.push({
              Name: permissions[i].name,
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
