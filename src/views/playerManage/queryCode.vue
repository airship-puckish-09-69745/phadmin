<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="18" :offset="6">
        <el-form ref="form" :model="form" :inline="true" label-width="80px">
          <el-form-item label="手机号码">
            <el-input v-model="phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="18" :offset="6">
        <el-form ref="form" :model="form" :inline="true" label-width="80px">
          <el-form-item label="验证码">
            <el-input v-model="code" :readonly="true" placeholder="请输入手机号" />
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="10" :offset="6">
        <el-alert
          title="温馨提示：内网IP 和 0086 开头的手机号码不会真正发送手机验证码"
          type="success"
        />
      </el-col>

    </el-row>

  </div>
</template>

<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  data() {
    return {
      form: {},
      phone: '',
      code: ''
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    query() {
      if (!this.phone) {
        this.$message.error('手机号不能为空')
        return
      }

      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/ver/code',
          phone: this.phone
        }
      }).then(function(response) {
        // 手机验证码
        console.log(response)
        if (response.RetCode == 0) {
          $this.code = response.Data
        } else {
          $this.$message.error('获取验证码失败')
        }
      })
    }
  }
}
</script>
