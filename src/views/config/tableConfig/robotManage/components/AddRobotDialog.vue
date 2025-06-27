<template>
  <el-dialog title="添加机器人" :visible.sync="dialogVisible" width="580px">
    <el-row>
      <el-button style="width: 100%;" type="primary" size="small" @click="downloadTemplate">下载机器人资料模板</el-button>
      <!-- 限制excel文件 -->
      <input v-show="false" ref="uploadFileInput" type="file" accept=".xlsx" @change="handleFileChange">
    </el-row>
    <el-row style="margin-top: 24px;">
      <el-button style="width: 100%;" type="success" size="small" @click="openUploadDirectory">上传机器人资料</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadedFile: {
        name: '',
        raw: null
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    downloadTemplate() {
      window.location.href = '/robot-template.xlsx'
    },
    openUploadDirectory() {
      this.$refs.uploadFileInput.click()
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file) {
        return
      }

      this.uploadedFile = e.target.files[0]
      console.log(this.uploadedFile)
    }
  }
}
</script>

