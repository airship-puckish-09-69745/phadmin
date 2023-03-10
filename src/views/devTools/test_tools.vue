<template>
  <div class="app-container">
    <el-row>
     <el-col :span="22" :offset="1">
       <el-button type="primary" @click="showPayDialog">重置总充值金额</el-button>
       <el-button type="primary" @click="showWithdrawDialog">重置总提现金额</el-button>
       <el-button type="primary" @click="showInviteAmountDialog">添加邀请金额</el-button>
     </el-col>
    </el-row>

    <!-------------重置总充值金额start----------->
    <el-dialog
      title="重置总充值金额"
      :visible.sync="resetPay.show"
      width="30%"
      :before-close="resetPayClose">
      <span>
        <el-form ref="resetPayFrm" :model="resetPay" label-width="80px">
          <el-form-item label="uid">
            <el-input v-model.number="resetPay.uid" placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item label="重置金额">
            <el-input v-model.number="resetPay.amount" placeholder="placeholder"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPay.show = false">取 消</el-button>
        <el-button type="primary" @click="resetPaySubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-------------重置总提现金额start----------->
    <el-dialog
      title="重置总提现金额"
      :visible.sync="resetWithdraw.show"
      width="30%"
      :before-close="resetWithdrawClose">
      <span>
        <el-form ref="resetWithdrawFrm" :model="resetWithdraw" label-width="80px">
          <el-form-item label="uid">
            <el-input v-model.number="resetWithdraw.uid" placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item label="重置金额">
            <el-input v-model.number="resetWithdraw.amount" placeholder="placeholder"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetWithdraw.show = false">取 消</el-button>
        <el-button type="primary" @click="resetWithdrawSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-------------添加邀请金额start----------->
    <el-dialog
      title="添加邀请金额"
      :visible.sync="inviteAmount.show"
      width="30%"
      :before-close="resetInviteAmountClose">
      <span>
        <el-form ref="resetWithdrawFrm" :model="inviteAmount" label-width="80px">
          <el-form-item label="uid">
            <el-input v-model.number="inviteAmount.uid" placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item label="重置金额">
            <el-input v-model.number="inviteAmount.amount" placeholder="placeholder"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inviteAmount.show = false">取 消</el-button>
        <el-button type="primary" @click="resetInviteAmountSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      resetPay: {
        show: false,
        uid: 0,
        amount: 0
      },
      resetWithdraw: {
        show: false,
        uid: 0,
        amount: 0
      },
      inviteAmount: {
        show: false,
        uid: 0,
        amount: 0
      }
    }
  },
  methods: {
    testToolsApi(args) {
      const cfg = {
        Env: this.env,
        Path: '/other/test/tools'
      }
      const param = Object.assign(cfg, args)
      console.log('param ', param)

      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: param
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('重置成功')
        } else {
          $this.$message.error(response.Msg)
        }
      })
    },

    // 重置总充值金额
    showPayDialog() {
      this.resetPay.show = true
    },
    resetPayClose(done) {
      this.resetPay.show = false
      done()
    },
    resetPaySubmit() {
      if (this.resetPay.uid === 0 || this.resetPay.amount === 0) {
        this.$message.error('参数不能为空')
        return
      }

      this.testToolsApi({
        type: 1,
        uid: this.resetPay.uid,
        amount: this.resetPay.amount * 1000
      })
    },

    // 重置总提现金额
    showWithdrawDialog() {
      this.resetWithdraw.show = true
    },
    resetWithdrawClose(done) {
      this.resetWithdraw.show = false
      done()
    },
    resetWithdrawSubmit() {
      if (this.resetWithdraw.uid === 0 || this.resetWithdraw.amount === 0) {
        this.$message.error('参数不能为空')
        return
      }

      this.testToolsApi({
        type: 2,
        uid: this.resetWithdraw.uid,
        amount: this.resetWithdraw.amount * 1000
      })
    },

    // 重置总提现金额
    showInviteAmountDialog() {
      this.inviteAmount.show = true
    },
    resetInviteAmountClose(done) {
      this.inviteAmount.show = false
      done()
    },
    resetInviteAmountSubmit() {
      if (this.inviteAmount.uid === 0 || this.inviteAmount.amount === 0) {
        this.$message.error('参数不能为空')
        return
      }

      this.testToolsApi({
        type: 3,
        uid: this.inviteAmount.uid,
        amount: this.inviteAmount.amount * 1000
      })
    }
  }
}
</script>
