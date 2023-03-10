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
        { label: '测试', value: 'test' },
        { label: '线上', value: 'pro' }
      ]
    }
  },
  computed: {
    env() {
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
      this.$store.dispatch('app/setEnv', env)
      this.refreshView()
      this.$message({
        message: '切换成功，正在重新刷新页面...',
        type: 'success'
      })
      //强制刷一下页面，让切环境生效
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
