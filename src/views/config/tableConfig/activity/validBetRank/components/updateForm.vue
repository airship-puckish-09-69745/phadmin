<template>
  <el-dialog
    :title="isEdit ? '编辑活动配置' : '新增活动配置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ========== 活动配置 ========== -->
      <el-tab-pane label="基础配置" name="activity">
      </el-tab-pane>
      <el-tab-pane label="白名单配置" name="whitelist">
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>

export default {
  name: "UpdateForm",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        id: null,
        status: 1,
      },
      isEdit: false,
      dialogVisible: false,
      activeTab: 'activity',
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleDialogClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
