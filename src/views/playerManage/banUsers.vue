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
          <el-input v-model="frm.accountNo" placeholder="提现银行账号" />
        </el-form-item>
        <el-form-item label="upi：">
          <el-input v-model="frm.upi" placeholder="upi" />
        </el-form-item>
        <el-form-item label="ip：">
          <el-input v-model="frm.ip" placeholder="ip" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUsers">查询</el-button>
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
        label="封号uid"
        width="100"
        fixed="left"
      >
        <template slot-scope="scope">
          {{ scope.row.Uid }}
          <i class="el-icon-search" @click="goUserInfo(scope.row.Uid)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Appid"
        label="应用ID"
      />
      <el-table-column
        prop="TotalPay"
        label="总充值"
      >
        <template slot-scope="scope">
          {{ scope.row.TotalPay | toRupee }}
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
        prop="Money"
        label="当前余额"
      >
        <template slot-scope="scope">
          {{ scope.row.Money | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="RegTime"
        label="注册时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.RegTime | parseTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LastLoginTime"
        label="最近登录时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.LastLoginTime | parseTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Account"
        label="登录账号"
        width="300"
      />
      <el-table-column
        prop="Email"
        label="邮箱"
      />
      <el-table-column
        prop="HolderName"
        label="持卡人"
      />
      <el-table-column
        prop="Ifsc"
        label="IFSC"
      />
      <el-table-column
        prop="AccountNo"
        label="银行卡"
      />
      <el-table-column
        prop="Upi"
        label="upi"
      />
      <el-table-column
        prop="Ip"
        label="ip"
      />
      <el-table-column
        prop="Device"
        label="设备号"
        width="300"
      />
      <el-table-column
        prop="SameAppPay"
        label="同包充提"
      >
        <template slot-scope="scope">
          {{ scope.row.SameAppPay | toRupee }} / {{ scope.row.SameAppWithdraw | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="DiffAppPay"
        label="不同包充提"
      >
        <template slot-scope="scope">
          {{ scope.row.DiffAppPay | toRupee }} / {{ scope.row.DiffAppWithdraw | toRupee }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Tags"
        label="标签"
        width="300px"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.TagsArr"
            :key="tag.name"
            effect="dark"
            :type="showTagType(tag.color)"
          >
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="Remark"
        label="封号理由"
      />
      <el-table-column
        prop="UpdatedAt"
        label="封号时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.UpdatedAt | parseTime }}
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        width="360px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" class="tableButton" @click="disableUser(scope.row, 0)">解封</el-button>
          <el-button size="mini" type="primary" class="tableButton" @click="showRemark(scope.row)">封号理由</el-button>
          <el-button size="mini" type="primary" class="tableButton" @click="showFeedback(scope.row)">投诉订单</el-button>
          <el-button size="mini" type="primary" class="tableButton" @click="showRelationUser(scope.row)">关联账号</el-button>
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
      title="封号理由"
      :visible.sync="remark.show"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="remark" size="small">
        <el-form-item>
          <el-input v-model="remark.txt" type="textarea" :rows="5" placeholder="请输入封号原因" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="updateRemark" style="float: right">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer
      title="投诉订单"
      :visible.sync="feedback.show"
      direction="rtl"
      size="50%"
    >
      <span class="feedback-box">
        <el-col :span="22" :offset="1">
          <el-button type="primary" size="mini" @click="addFeedback">添加</el-button>
          <el-button type="success" size="mini" @click="saveFeedback">保存</el-button>
        </el-col>

        <el-table
          :data="feedback.data"
          style="width: 100%"
        >
          <el-table-column
            prop="chan"
            label="支付通道"
            width="120"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.chan" placeholder="placeholder" />
            </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="投诉订单"
            width="120"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.order" placeholder="placeholder" />
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            width="120"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="placeholder" />
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="支付时间"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.pay_time"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="libShow.pickerOptions">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="投诉时间"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.msg_time"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="libShow.pickerOptions">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delFeedback(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-drawer>

    <el-drawer
      title="关联用户"
      :visible.sync="relationUser.show"
      direction="rtl"
      size="50%"
    >
      <el-table
        :data="relationUser.data"
        style="width: 100%"
      >
        <el-table-column
          prop="RelationUid"
          label="关联uid"
        >
        </el-table-column>
        <el-table-column
          prop="Appid"
          label="应用"
        />
        <el-table-column
          prop="RegTime"
          label="注册时间"
        >
          <template slot-scope="scope">
            {{ scope.row.RegTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="RegTime"
          label="最近登录时间"
        >
          <template slot-scope="scope">
            {{ scope.row.RegTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="BaseValue"
          label="扣除基础值"
        >
          <template slot-scope="scope">
            {{ scope.row.BaseValue | toRupee }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Score"
          label="扣除信用分"
        >
        </el-table-column>
      </el-table>
    </el-drawer>

  </div>
</template>

<script>
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'

export default {
  name: 'BanUsers',
  // eslint-disable-next-line vue/no-unused-components
  components: { UidInput, LineChart },
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
        accountNo: '',
        upi: '',
        ip: '',
        email: ''
      },
      remark: {
        show: false,
        txt: '',
        uid: 0
      },
      feedback: {
        show: false,
        uid: 0,
        data: []
      },
      relationUser: {
        show: false,
        uid: 0,
        data: []
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
    showTagType(color) {
      switch (parseInt(color)) {
        case 1:
          return 'primary'
        case 2:
          return 'success'
        case 3:
          return 'warning'
        case 4:
          return 'danger'
        default:
          return 'info'
      }
    },
    showStatus(status) {
      switch (status) {
        case 0:
          return '正常'
        case 1:
          return '冻结'
        default:
          return status
      }
    },
    showRemark(row) {
      this.remark = {
        show: true,
        uid: row.Uid,
        txt: row.Remark
      }
    },
    updateRemark() {
      this.banUpdate({
        'uid': this.remark.uid,
        'txt': this.remark.txt,
        'type': 2
      })
      this.remark.show = false
    },
    saveFeedback() {
      this.banUpdate({
        'uid': this.feedback.uid,
        'txt': JSON.stringify(this.feedback.data),
        'type': 1
      })
      this.feedback.show = false
    },
    showFeedback(row) {
      this.feedback = {
        show: true,
        uid: row.Uid,
        data: row.FeedbackArr || []
      }
    },
    addFeedback() {
      this.feedback.data.push({
        chan: '',
        name: '',
        amount: '',
        pay_time: '',
        msg_time: ''
      })
    },
    delFeedback(idx) {
      this.feedback.data.splice(idx, 1)
    },
    showRelationUser(row) {
      this.relationUser.uid = row.Uid
      this.relationUser.show = true
      this.getRelationUsers()
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
          Path: '/log/ban/user/logs',
          uid: this.frm.uid,
          ip: this.frm.ip,
          email: this.frm.email,
          account_no: this.frm.accountNo,
          upi: this.frm.upi,
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
          this.tableData = data.rows
          for (const i in this.tableData) {
            if (this.tableData[i]['Tags'] !== '') {
              this.tableData[i]['TagsArr'] = JSON.parse(this.tableData[i]['Tags'])
            }
            if (this.tableData[i]['Feedback'] !== '') {
              this.tableData[i]['FeedbackArr'] = JSON.parse(this.tableData[i]['Feedback'])
            }
          }
        }
        loading.close()
      })
    },
    banUpdate(arg) {
      const data = Object.assign({
        Env: this.env,
        Path: '/log/ban/user/update'
      }, arg)
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: data
      }).then(response => {
        console.log('update', response)
        if (response.RetCode === 0) {
          this.$message.success('操作成功')
          this.getUsers()
        } else {
          this.$message.error('更新失败')
        }
      })
    },
    getRelationUsers() {
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
          Path: '/log/ban/relation/users',
          uid: this.relationUser.uid
        }
      }).then(response => {
        console.log('relation user logs ', response)
        if (response.RetCode === 0) {
          this.relationUser.data = response.Data || []
        }
        loading.close()
      })
    },
    disableUser(row, status) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/info',
          Uid: row.Uid,
          Type: 6,
          Money: 0,
          Status: status
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('修改成功！')
          this.getUsers()
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
