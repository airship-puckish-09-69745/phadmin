<template>
  <fieldset>
    <legend>数据中心上报</legend>
    <el-form-item label="是否上报数据中心：" :required="true">
      <el-switch
        v-model="editForm.data.dcReport"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
        active-text="是"
        inactive-text="否"
        @change="handleDcReportChange"
      />
    </el-form-item>
  </fieldset>
</template>

<script>
export default {
  name: 'DataCenterReportConfig',
  props: {
    editForm: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 处理数据中心上报改变
    handleDcReportChange(value) {
      this.$emit('dc-report-change', value)
    }
  }
}
</script>

<style scoped>
fieldset {
  margin: 20px auto;
  max-height: max-content;
  min-width: inherit;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-switch {
  margin-top: 5px;
}
</style>
