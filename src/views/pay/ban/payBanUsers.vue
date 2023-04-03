<template>
  <div class="app-container">
    <el-row>
      <el-form :model="frm" label-width="90px" :inline="true" size="small">
        <el-form-item label="用户ID：">
          <el-input v-model="frm.uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="frm.email" placeholder="电子邮箱" />
        </el-form-item>
        <el-form-item label="银行账号：">
          <el-input v-model="frm.bank" placeholder="提现银行账号" />
        </el-form-item>
        <el-form-item label="upi：">
          <el-input v-model="frm.upi" placeholder="upi" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="frm.phone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="ip：">
          <el-input v-model="frm.ip" placeholder="ip" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUsers">查询</el-button>
          <el-button type="success" size="mini" @click="addBtn">添加</el-button>
          <el-button type="success" size="mini" @click="clickExcelImport">导入</el-button>
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
        prop="ID"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="Uid"
        label="Uid"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.Uid }}
          <i class="el-icon-search" v-if="scope.row.Uid > 0" @click="goUserInfo(scope.row.Uid)" />
        </template>
      </el-table-column>

      <el-table-column
        prop="Phone"
        label="注册手机号"
      />

      <el-table-column
        prop="BankNo"
        label="提现bank号"
      />

      <el-table-column
        prop="Upi"
        label="Upi"
      />

      <el-table-column
        prop="Email"
        label="邮箱"
      />

      <el-table-column
        prop="Ip"
        label="IP"
      />

      <el-table-column
        prop="PayChannel"
        label="黑名单提供方"
      />

      <el-table-column
        prop="ExportTime"
        label="导入时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.ExportTime | parseTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delApi(scope.row.ID, scope.row.Uid)">移除</el-button>
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
      <el-form  :model="addTo" size="small">
        <el-form-item label="支付渠道">
          <el-input v-model="addTo.pay" placeholder="" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addTo.phone" placeholder="" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addTo.email" placeholder="" />
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="addTo.bank" placeholder="" />
        </el-form-item>
        <el-form-item label="upi">
          <el-input v-model="addTo.upi" placeholder="" />
        </el-form-item>
        <el-form-item label="ip">
          <el-input v-model="addTo.ip" placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="save" style="float: right">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="excel导入"
      :visible.sync="excelImport.show"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="excelImport" size="small">
        <el-form-item label="支付渠道">
          <el-input v-model="excelImport.pay" placeholder="" />
        </el-form-item>
        <el-form-item>
          <upload-excel-component :on-success="importSuccess" :before-upload="checkImport" />
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'BanUsers',
  // eslint-disable-next-line vue/no-unused-components
  components: { UidInput, UploadExcelComponent },
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
        phone: '',
        upi: '',
        bank: '',
        email: '',
        ip: ''
      },
      addTo: {
        show: false,
        pay: '',
        phone: '',
        email: '',
        bank: '',
        upi: '',
        ip: ''
      },
      excelImport: {
        show: false,
        pay: ''
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
          Path: '/user/query/pay/ban/users',
          uid: this.frm.uid,
          phone: this.frm.phone,
          email: this.frm.email,
          bank: this.frm.bank,
          upi: this.frm.upi,
          page: this.page,
          limit: this.limit,
          ip: this.frm.ip
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
    },
    clickExcelImport() {
      this.excelImport.show = true
    },
    checkImport(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async importSuccess({ results, header }) {
      console.log('import result', results)
      if (this.excelImport.pay === '') {
        this.$message.error('请填入支付渠道')
        return
      }
      if (!results) {
        this.$message.error('导入数据失败')
        return
      }
      if (results[0].length < 4) {
        this.$message.error('格式错误')
        return
      }
      let cnt = 0
      let rows = []
      for (const i in results) {
        const phone = results[i]['phone'] ? results[i]['phone'].toString() : ''
        const bank = results[i]['bank'] ? results[i]['bank'].toString() : ''
        const upi = results[i]['upi'] ? results[i]['upi'].toString() : ''
        const email = results[i]['email'] ? results[i]['email'].toString() : ''
        const ip = results[i]['ip'] ? results[i]['ip'].toString() : ''
        rows.push({
          'Phone': phone,
          'Email': email,
          'BankNo': bank,
          'Upi': upi,
          'Ip': ip,
          'PayChannel': this.excelImport.pay
        })
        cnt++
        if (cnt % 500 === 0) {
          console.log('提交数据', cnt, rows)
          await this.batchAdd({
            data: JSON.stringify(rows)
          })
          rows = []
        }
      }
      if (rows && rows.length > 0) {
        console.log('提交数据111', cnt, rows)
        await this.batchAdd({
          data: JSON.stringify(rows)
        })
      }
      this.$message.success('成功导入 ' + cnt + '条')
      this.getUsers()
      this.excelImport.show = false
    },
    save() {
      this.addApi({
        phone: this.addTo.phone,
        email: this.addTo.email,
        bank: this.addTo.bank,
        upi: this.addTo.upi,
        pay: this.addTo.pay,
        ip: this.addTo.ip
      }, true)
      this.addTo.show = false
    },
    delApi(id, uid) {
      const $this = this
      this.$confirm('确定把用户移出黑名单？移出之后用户可以走正常支付渠道', '提示', {
        type: 'warning'
      }).then(function() {
        const data = Object.assign({
          Env: $this.env,
          Path: '/user/del/pay/ban/users'
        }, {
          id: id,
          uid: uid
        })
        request({
          url: '/dataProxy/info',
          method: 'POST',
          data: data
        }).then(response => {
          console.log('add', response)
          if (response.RetCode === 0) {
            $this.$message.success('操作成功')
            $this.getUsers()
          } else {
            $this.$message.error('更新失败')
          }
        })
      })
    },
    addApi(arg, tip) {
      const data = Object.assign({
        Env: this.env,
        Path: '/user/import/pay/ban/users'
      }, arg)
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      }).then(response => {
        console.log('add', response)
        if (response.RetCode === 0) {
          if (tip) {
            this.$message.success('操作成功')
            this.getUsers()
          }
        } else {
          this.$message.error('更新失败')
        }
      })
    },
    async batchAdd(arg) {
      const data = Object.assign({
        Env: this.env,
        Path: '/user/import/pay/ban/users/batch'
      }, arg)

      const response = request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      })

      console.log('batch response', response)
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
