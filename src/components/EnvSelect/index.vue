<template>
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
</template>

<script>
export default {
  data() {
    return {
      envOptions: [
        { label: '旧版测试', value: 'test' },
        { label: '旧版线上', value: 'pro' },
        { label: '新版测试-1000002', value: 'test-1000002' },
        { label: '新版测试-1000005', value: 'test-1000005' },
        { label: '新版线上-1000005', value: 'pro-1000005' },
      ]
    }
  },
  computed: {
    env() {
      if (this.$store.getters.version === 'V2') {
        return this.$store.getters.env + '-' + this.$store.getters.appId
      }
      return this.$store.getters.env
    }
  },
  methods: {
    showEnv() {
      for (const item of this.envOptions) {
        if (item.value === this.env) {
          return item.label
        }
      }
      return '-'
    },
    handleSetEnv(env) {
      if (env.indexOf('-') >= 0) {
        this.$store.dispatch('app/setEnv', env.split('-')[0])
        this.$store.dispatch('app/setAppId', env.split('-')[1])
        this.$store.dispatch('app/setVersion', 'V2')
      } else {
        this.$store.dispatch('app/setEnv', env)
        this.$store.dispatch('app/setAppId', '')
        this.$store.dispatch('app/setVersion', 'V1')
      }

      this.refreshView()
      this.$message({
        message: '切换成功，正在重新刷新页面...',
        type: 'success'
      })
      // 强制刷一下页面，让切环境生效
      setInterval(function() {
        window.location.reload()
      }, 500)
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
