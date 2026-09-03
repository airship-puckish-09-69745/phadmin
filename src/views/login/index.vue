<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
            @focus="checkGoogleAuth"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item v-if="isProduction" prop="googleCode">
        <span class="svg-container">
          <i class="el-icon-key" />
        </span>
        <el-input
          ref="googleCode"
          v-model="loginForm.googleCode"
          class="login-input"
          placeholder="Google Code"
          name="googleCode"
          type="text"
          tabindex="1"
        />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>

    <el-dialog
      title="Google 验证"
      :visible.sync="showGoogleDialog"
      width="700px"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
style="background-color: #283443;"
    >
      <el-form>
        <div style="font-size: 18px; margin-bottom: 8px;">{{ '首次登录二维码'}}</div>
        <div style="display: flex; gap: 20px; align-items: flex-start;">
          <div style="flex: 0 0 260px; text-align: center;">
            <el-image :src="codeUrl" alt="google-qr" style="max-width:240px;border-radius:6px;background:#fff;padding:6px;" />
          </div>
          <div style="flex: 1; margin-top: 5px;">
            <div>{{ '登录名' + ':' }}</div>
            <el-input v-model="googleForm.username" placeholder="请输入用户名" style="background-color: #1a2332; color: #fff;" />
            <div>Key: </div>
            <el-input v-model="googleForm.googleSecret" placeholder="请输入key" style="background-color: #1a2332; color: #fff;" />
          </div>
        </div>
        <div style="font-size: 18px; margin-bottom: 8px; margin-top:10px;">{{ '验证码' }}</div>
        <div style="display: flex; flex-direction:column;">
          <el-input v-model="googleForm.googleCode" placeholder="请输入验证码" style="background-color: #1a2332; color: #fff; width: 300px;" />
          <el-button type="primary" style="width: 100px; margin-top: 20px;" @click="handleGoogleSubmit">提交</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import request from '@/utils/request';
import {Message} from 'element-ui';

export default {
  name: 'Login',
  components: { SocialSign },
  computed: {
    isProduction() {
      return process.env.NODE_ENV === 'production'
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      callback()
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        googleCode: ''
      },
      googleForm: {
        username: '',
        googleSecret: '',
        googleCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      showGoogleDialog: false,
      codeUrl: '',
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    checkGoogleAuth() {
      if (!this.loginForm.username) {
        return
      }

      request({
        url: '/login/user/google/enabled',
        method: 'get',
        params: {
          username: this.loginForm.username
        }
      }).then(response => {
        if (response.RetCode === 0 && response.Data && response.Data.Secret && response.Data.CodeUrl) {
          // 设置 Google 验证表单数据
          this.googleForm.username = this.loginForm.username
          this.googleForm.googleSecret = response.Data.Secret || ''
          this.codeUrl = response.Data.CodeUrl || ''

          // 显示 Google 验证对话框
          this.showGoogleDialog = true
        } else {
          // 已绑定或不需要绑定，继续登录流程
          console.log('用户已绑定 Google 验证或无需绑定')
        }
      }).catch(error => {
        console.error('Check Google Auth failed:', error)
      })
    },
    handleGoogleSubmit() {
      if (!this.googleForm.username || !this.googleForm.googleCode || !this.googleForm.googleSecret) {
        Message({
          message: '请填写完整的验证信息',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }

      request({
        url: '/adminuser/user/google/secret/update',
        method: 'post',
        data: {
          name: this.googleForm.username,
          code: this.googleForm.googleCode,
          secret: this.googleForm.googleSecret
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message({
            message: 'Google 验证设置成功',
            type: 'success'
          })
          // 关闭对话框
          this.showGoogleDialog = false
        } else {
          Message({
            message: response.msg || 'Google 验证设置失败',
            type: 'error'
          })
          // 失败时不关闭对话框，让用户可以重新操作
        }
      }).catch(error => {
        console.error('Update Google Secret failed:', error)
        Message({
          message: '网络错误，请重试',
          type: 'error'
        })
        // 失败时不关闭对话框，让用户可以重新操作
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // 设置为新版本后台默认的应用环境、版本、应用ID
              this.setDefaultApp()
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    setDefaultApp() {
      this.$store.dispatch('app/setEnv', 'test')
      this.$store.dispatch('app/setVersion', 'V2')
      this.$store.dispatch('app/setAppId', 1000002)
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
