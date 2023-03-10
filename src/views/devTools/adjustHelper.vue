<template>
  <div id="app" class="page-container">
    <el-form label-width="150px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="应用识别码:">
            <el-input v-model="token" size="mini" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="AppID:">
            <el-input v-model="appID" size="mini" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="6">
        <el-form-item label="初始值：">
          <el-input v-model="originData" type="textarea" rows="20" />
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="transform">生成</el-button>
      </el-col>
      <el-col :span="10">
        <el-form-item label="结果：">
          <el-input v-model="destData" type="textarea" rows="20" />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'

export default {
  data() {
    return {
      libShow: $libShow,
      originData: '',
      destData: '',
      token: '',
      appID: ''
    }
  },
  computed: {
  },
  created() {
    console.log(1)
  },
  methods: {
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    transform() {
      const obs = this.originData.split('\n')
      const tMap = {}
      for (let i = 0; i < obs.length; i++) {
        tMap[obs[i]] = obs[i + 1]
        i++
      }
      console.log(tMap)
      this.destData = `adjust_config[` + this.appID + `] = {
  token = "` + this.token + `",
  event_type = {
    LAUNCHED   = "` + tMap['应用启动'] + `", -- 应用启动
    REGISTER   = "` + tMap['注册成功'] + `", -- 注册成功
    LOGIN      = "` + tMap['登录成功'] + `", -- 登录成功
    GAMESTART   = "` + tMap['开始游戏'] + `", -- 开始游戏
    PAY_SHOW    = "` + tMap['充值页面'] + `", -- 充值页面
    PAY_SUCCESS = "` + tMap['充值成功'] + `", -- 充值成功
    PAY_NEWER   = "` + tMap['新注充值'] + `", -- 新注充值
    PAY_NEWER_CNT = "` + tMap['新注充值次数'] + `", -- 新注充值次数
    WITHDRAW_SHOW = "` + tMap['兑现显示界面'] + `", -- 兑现显示界面
    WITHDRAW_SUCCESS = "` + tMap['兑现成功'] + `", -- 兑现成功
    LOADING_SHOW = "` + tMap['首次安装启动页显示'] + `", -- 首次安装启动页显示
    HOT_UPDATE_START = "` + tMap['首次安装热更开始'] + `", -- 首次安装热更开始
    HOT_UPDATE_ERROR = "` + tMap['首次安装热更失败'] + `", -- 首次安装热更失败
    HOT_UPDATE_END = "` + tMap['首次安装热更结束'] + `", -- 首次安装热更结束
    LOGIN_SHOW = "` + tMap['首次安装登录页显示'] + `", -- 首次安装登录页显示
    ENTER_GAME_A = "` + tMap['首次安装进入A游戏'] + `", -- 首次安装进入A游戏
  }
}`
    }
  }
}
</script>
