<template>
  <div class="app-container">
    <el-row>
      <el-form :model="frm" label-width="90px" :inline="true" size="small">
        <el-form-item label="用户ID：">
          <el-input v-model="frm.uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item label="操作人：">
          <el-input v-model="frm.name" placeholder="操作人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUsers">查询</el-button>
          <el-button type="success" size="mini" @click="addBtn">添加</el-button>
          <el-button type="success" size="mini" @click="batchBtn">批量添加</el-button>
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
      style="width: 100%;"
    >
      <el-table-column
        prop="Uid"
        label="Uid"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.Uid }}
          <i v-if="scope.row.Uid > 0" class="el-icon-search" @click="goUserInfo(scope.row.Uid)" />
        </template>
      </el-table-column>

      <el-table-column
        prop="RegTime"
        label="注册时间"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.RegTime | parseTime }}
        </template>
      </el-table-column>

      <el-table-column
        prop="LoginTime"
        label="最近登录时间"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.LoginTime | parseTime }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Money"
        label="余额"
      >
        <template slot-scope="scope">
          {{ scope.row.Money | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="TotalWithdraw"
        label="总提现"
      >
        <template slot-scope="scope">
          {{ scope.row.TotalWithdraw | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Withdrawing"
        label="提现中"
      >
        <template slot-scope="scope">
          {{ scope.row.Withdrawing | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="TotalRecharge"
        label="总充值"
      >
        <template slot-scope="scope">
          {{ scope.row.TotalRecharge | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Money"
        label="差值"
      >
        <template slot-scope="scope">
          {{ (scope.row.TotalRecharge - scope.row.Money - scope.row.Withdrawing - scope.row.TotalWithdraw) | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="OpName"
        label="操作人"
      />

      <el-table-column
        prop="Remark"
        label="理由"
        min-width="150"
      />

      <el-table-column
        prop="OpTime"
        label="操作时间"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.OpTime | parseTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateBtn(scope.row)">更新</el-button>
          <el-button type="danger" size="mini" @click="delApi(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end">
      <div style="text-align: center; width: 100%; height: 50px; padding-top: 10px;">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>

    <el-dialog
      title="添加"
      :visible.sync="addTo.show"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="addTo" size="small">
        <el-form-item label="uid">
          <el-input v-model="addTo.uid" :disabled="addTo.edit" placeholder="" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addTo.remark" type="textarea" :rows="3" placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" style="float: right" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="批量添加"
      :visible.sync="batchAdd.show"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="batchAdd" size="small">
        <el-form-item label="uid">
          <el-input v-model="batchAdd.uid" type="textarea" :rows="3" placeholder="" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="batchAdd.remark" type="textarea" :rows="3" placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" style="float: right" @click="batchSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'BanUsers',
  // eslint-disable-next-line vue/no-unused-components
  components: { UidInput, LineChart, UploadExcelComponent },
  data() {
    return {
      tableData: [],
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      libShow: $libShow,
      env: 'test',
      page: 1,
      limit: 10,
      total: 0,
      frm: {
        uid: 0,
        name: ''
      },
      addTo: {
        show: false,
        edit: false,
        uid: 0,
        remark: ''
      },
      batchAdd: {
        show: false,
        uid: '',
        remark: ''
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getUsers()
  },
  methods: {
    // 跳转到用户信息查询页面
    goUserInfo(uid) {
      // this.setIntoStorage(uid)
      this.$router.push({
        path: '/player/userManage',
        query: {
          uid: uid
        }
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.limit = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    getUsers() {
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'GET',
        data: {
          Env: this.env,
          Path: '/user/withdraw/ban/users',
          uid: this.frm.uid,
          opname: this.frm.name,
          page: this.page,
          limit: this.limit
        }
      }).then(response => {
        console.log('user logs ', response)
        if (response.RetCode === 0) {
          const data = response.Data || []
          if (this.page === 1) {
            this.total = data.total
          }
          this.tableData = data.data
        }
        loading.close()
      })
    },
    addBtn() {
      this.addTo.show = true
      this.addTo.edit = false
    },
    updateBtn(row) {
      this.addTo.show = true
      this.addTo.edit = true
      this.addTo.uid = row.Uid
      this.addTo.remark = row.Remark
    },
    save() {
      if (this.addTo.edit) {
        this.updateApi({
          uid: this.addTo.uid,
          remark: this.addTo.remark,
          opname: this.$store.getters.name
        })
      } else {
        this.addApi({
          uid: this.addTo.uid,
          remark: this.addTo.remark,
          opname: this.$store.getters.name
        })
      }
      this.addTo.show = false
    },

    // 批量添加
    batchBtn() {
      this.batchAdd.show = true
    },
    batchSave() {
      this.batchAddApi({
        uid: this.batchAdd.uid,
        remark: this.batchAdd.remark,
        opname: this.$store.getters.name
      })
      this.batchAdd.show = false
    },

    addApi(arg) {
      const data = Object.assign({
        Env: this.env,
        Path: '/user/add/withdraw/ban/users'
      }, arg)
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      }).then(response => {
        console.log('add', response)
        if (response.RetCode === 0) {
          this.$message.success('操作成功')
          this.getUsers()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    updateApi(arg) {
      const data = Object.assign({
        Env: this.env,
        Path: '/user/update/withdraw/ban/users'
      }, arg)
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      }).then(response => {
        console.log('add', response)
        if (response.RetCode === 0) {
          this.$message.success('更新成功')
          this.getUsers()
        } else {
          this.$message.error('更新失败')
        }
      })
    },
    delApi(row) {
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: {
          Env: this.env,
          Path: '/user/del/withdraw/ban/users',
          uid: row.Uid
        }
      }).then(response => {
        console.log('add', response)
        if (response.RetCode === 0) {
          this.$message.success('删除成功')
          this.getUsers()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    batchAddApi(arg) {
      const data = Object.assign({
        Env: this.env,
        Path: '/user/batch/add/withdraw/ban/users'
      }, arg)
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      }).then(response => {
        console.log('add', response)
        if (response.RetCode === 0) {
          this.$message.success('添加成功')
          this.getUsers()
        } else {
          this.$message.error('添加失败')
        }
      })
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
