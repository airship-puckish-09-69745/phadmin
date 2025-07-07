<template>
  <el-dialog :title="updateData && updateData.ID ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="标题" required>
        <el-input v-model="formData.Amount" style="width: 360px;" />
      </el-form-item>
      <el-form-item label="内容" required>
        <el-input v-model="formData.Content" type="textarea" style="width: 360px;" />
      </el-form-item>
      <el-form-item label="类型" required>
        <el-select v-model="formData.BroadcastType" placeholder="请选择类型" style="width: 360px;">
          <el-option v-for="option in broadcastTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="播报来源" required>
        <el-select v-model="formData.BroadcastType" placeholder="请选择播报来源" style="width: 360px;">
          <el-option v-for="option in broadcastTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" required>
        <el-select v-model="formData.BroadcastType" placeholder="请选择类型" style="width: 360px;">
          <el-option v-for="option in broadcastTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" required>
        <el-date-picker
          v-model="formData.BroadcastTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 360px;"
        />
      </el-form-item>
      <el-form-item label="频率" required>
        <el-input v-model="formData.BroadcastFrequency" style="width: 360px;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
// import request from '@/utils/request'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 广播类型选项
     */
    broadcastTypeOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 字段参考resetForm
      formData: {}
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) this.$emit('close')
      }
    }
  },
  watch: {
    updateData(newData) {
      if (newData) {
        this.formData = { ...newData }
      } else {
        this.resetForm()
      }
    },
    visible(val) {
      if (!val) {
        this.resetForm()
      }
    }
  },
  methods: {
    /**
     * 校验表单数据
     */
    checkoutForm() {
      if (!this.formData.Title) {
        this.$message.warning('标题不能为空!')
        return false
      }
      if (!this.formData.Content) {
        this.$message.warning('内容不能为空!')
        return false
      }
      if (!this.formData.BroadcastType) {
        this.$message.warning('类型不能为空!')
        return false
      }

      return true
    },
    handleSave() {
      if (!this.checkoutForm()) {
        return
      }
      console.log(this.formData)
      this.handleClose()
    },
    resetForm() {
      this.formData = {
        // 应用id
        AppId: '',
        // 渠道
        Channel: '',
        // 播报类型
        BroadcastType: 1,
        // 内容
        Content: '',
        // 标题
        Title: '',
        // 播报来源
        Origin: [],
        // 展示位置
        ShowPosition: 1,
        // 状态
        Status: false,
        // 播报有效期
        BroadcastTimeRange: [],
        // 频率：单位秒
        BroadcastFrequency: 60
      }
    },
    handleClose(reload = false) {
      this.resetForm()
      this.$emit('close')
      if (reload) {
        this.$emit('reload')
      }
    }
  }
}
</script>
