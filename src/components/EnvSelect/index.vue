<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetEnv">
      <span class="el-dropdown-link">
        {{ showEnv() }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item of envOptions" :key="item.value" :disabled="env===item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown trigger="click" @command="handleSetAppId">
      <span v-if="isNewVersion" class="el-dropdown-link">
        {{ showAppId() }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item of appOptions" :key="item.value" :disabled="appId===item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      envOptions: [
        { label: '旧版测试', value: 'test' },
        { label: '旧版线上', value: 'pro' },
        { label: '新版测试', value: 'new-test' },
        { label: '新版线上', value: 'new-pro' },
      ],
      oldEnv: '',
      oldAppId: '',
      appOptions: [
        // { label: '1000002-内部平台', value: '1000002' },
        // { label: '1000003-testaccount', value: '1000003' },
        // { label: '1000005-BingoPlusTongits', value: '1000005' }
      ]
    }
  },
  computed: {
    env() {
      if (this.isNewVersion) {
        return 'new-' + this.$store.getters.env
      }
      return this.$store.getters.env
    },
    appId() {
      return parseInt(this.$store.getters.appId)
    },
    isNewVersion() {
      return this.$store.getters.version === 'V2'
    }
  },
  mounted() {
    this.oldEnv = this.env
    this.oldAppId = this.appId
    this.getAppIdOptions()
  },
  methods: {
    getAppIdOptions() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    showEnv() {
      for (const item of this.envOptions) {
        if (item.value === this.env) {
          return item.label
        }
      }
      return '-'
    },
    showAppId() {
      for (const item of this.appOptions) {
        if (item.value === this.appId) {
          return item.label
        }
      }
      return '-'
    },
    handleSetEnv(env) {
      if (env.indexOf('-') >= 0) {
        this.$store.dispatch('app/setEnv', env.split('-')[1])
        if (this.$store.getters.appId === '') {
          this.$store.dispatch('app/setAppId', this.appOptions[0].value)
        }
        this.$store.dispatch('app/setVersion', 'V2')
      } else {
        this.$store.dispatch('app/setEnv', env)
        this.$store.dispatch('app/setAppId', '')
        this.$store.dispatch('app/setVersion', 'V1')
      }

      console.log('handleSetEnv env', env)

      const isDiffVersion = env !== this.oldEnv
      this.refreshView(isDiffVersion)
      this.$message({
        message: '切换成功，正在重新刷新页面...',
        type: 'success'
      })
      // 强制刷一下页面，让切环境生效
      setInterval(function() {
        window.location.reload()
      }, 500)
    },
    handleSetAppId(appId) {
      this.$store.dispatch('app/setAppId', appId)
      const isDiffAppId = appId !== this.oldAppId
      this.refreshView(isDiffAppId)
      this.$message({
        message: '切换成功，正在重新刷新页面...',
        type: 'success'
      })
      // 强制刷一下页面，让切环境生效
      setInterval(function() {
        window.location.reload()
      }, 500)
    },
    refreshView(isDiffVersion) {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      let { fullPath } = this.$route
      if (isDiffVersion){
        fullPath = '/'
      }

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
