<template>
  <el-dropdown trigger="click" @command="handleSetZone">
    <span class="el-dropdown-link">
      {{ showZone() }}<i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of zoneOptions" :key="item.value" :disabled="zone===item.value" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      zoneOptions: [
        { label: '东八区', value: 'cn' },
        { label: '东五区', value: 'in' }
      ]
    }
  },
  created() {
    this.initZoneOption()
  },
  computed: {
    zone() {
      return this.$store.getters.zone
    }
  },
  methods: {
    initZoneOption() {
      const options = [
        { label: '东八区', value: 'cn' }
      ]
      if (process.env.VUE_APP_PROJECT === 'br') {
        options.push({ label: '西三区', value: 'br' })
      } else {
        options.push({ label: '东五区', value: 'in' })
      }
      this.zoneOptions = options
    },
    showZone() {
      for (const item of this.zoneOptions) {
        if (item.value === this.zone) {
          return item.label
        }
      }
      return '-'
    },
    handleSetZone(zone) {
      this.$store.dispatch('app/setZone', zone)
      this.refreshView()
      this.$message({
        message: '切换成功',
        type: 'success'
      })
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
