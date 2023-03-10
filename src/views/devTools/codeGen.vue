<template>
  <div id="app" class="page-container">
    <el-row>
      <el-col :span="4" :offset="10">
        数据库建表sql文件：
      </el-col>
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          :action="actionURL"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">导入</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-tabs type="border-card" tab-position="left">
      <el-tab-pane v-for="(o,idx) in list" :key="idx" :label="idx+1 + '、' + o.Type">
        <div style="padding: 5px">{{ o.Msg }}</div>
        <el-button size="mini" @click="copyText('txt'+idx)">复制</el-button>
        <el-input
          :id="'txt'+idx"
          v-model="o.Content"
          type="textarea"
          autosize
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { GenCodeAdmin, GenCodeRPCSQL } from '@/api/devTools'

export default {
  data() {
    return {
      fileName: '',
      fileList: [],
      list: [],
      iType: 1
    }
  },
  created() {
    this.iType = this.$route.name === 'codeGenRPCSQL' ? 2 : 1
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  methods: {
    copyText(id) {
      const Url = document.getElementById(id)
      Url.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '已经复制到剪贴板！',
        type: 'success'
      })
    },
    //  excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.error('您需要先上传sql文件')
        return
      }
      switch (this.iType) {
        case 1:
          GenCodeAdmin(this.fileName).then(response => {
            // console.log('sign reward', response)
            this.list = response.Data || {}
          })
          break
        case 2:
          GenCodeRPCSQL(this.fileName).then(response => {
            // console.log('sign reward', response)
            this.list = response.Data || {}
          })
      }
    },
    handleSuccess(rsp, file, fileList) {
      this.fileName = rsp.Data
      this.importData()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
    }
  }
}
</script>
