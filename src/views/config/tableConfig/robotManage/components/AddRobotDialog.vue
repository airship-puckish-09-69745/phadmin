<template>
  <el-dialog title="添加机器人" :visible.sync="dialogVisible" width="580px">
    <el-row>
      <el-button style="width: 100%;" type="primary" size="small" @click="downloadTemplate">下载机器人资料模板</el-button>
      <!-- 限制excel文件 -->
      <input v-show="false" ref="uploadFileInput" type="file" accept=".xlsx" @change="handleFileChange">
    </el-row>
    <el-row style="margin-top: 24px;">
      <el-button style="width: 100%;" type="success" size="small" @click="openUploadDirectory">上传机器人资料</el-button>
      <!-- <div v-if="uploadedFile && uploadedFile.name" style="margin-top: 8px; color: #666; text-align: right;">{{ uploadedFile.name }}</div> -->
    </el-row>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appID: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      uploadedFile: null
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
      // 使用fetch API获取文件
      fetch('/robot-template.xlsx')
        .then(res => res.blob())
        .then(blob => {
          // 创建临时URL
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = 'robot-template.xlsx'
          document.body.appendChild(a)
          a.click()
          // 清理资源
          URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(() => {
          this.$message.error('模板下载失败')
        })
    },
    openUploadDirectory() {
      this.$refs.uploadFileInput.click()
    },
    handleClose() {
      this.dialogVisible = false
      this.uploadedFile = null
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      console.log(file)
      if (!file) {
        this.uploadedFile = null
        return
      }

      this.uploadedFile = e.target.files[0]
      // console.log(this.uploadedFile)
      // 将文件读取为base64格式, 去掉前缀
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        let base64 = reader.result
        base64 = base64.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '')
        // console.log(base64)
        // const data = new FormData()
        // data.append('file', base64)
        // data.append('Env', this.env)
        // data.append('Path', '/usercommonrobot/import/excel')

        request({
          url: '/dataProxy/info',
          method: 'POST',
          data: {
            Env: this.env,
            Path: '/usercommonrobot/import/excel',
            file: base64,
            appId: this.appID
          }
        }).then(response => {
          // 情况input的value
          this.uploadedFile = null
          this.$refs.uploadFileInput.value = ''
          if (response.RetCode === 0) {
            // console.log(response.Data)
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.handleClose()
            this.$emit('reload-list')
          }
        })
      }
    }
  }
}
</script>

