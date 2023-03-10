<template>
  <div id="app" class="page-container">
    <el-row>
      <el-form label-width="100px" size="small">
        <el-col :span="8">
          <el-form-item label="字符串：" :required="true">
            <el-input
              v-model="strData"
              type="textarea"
              :rows="30"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <json-viewer
            :value="JsonData"
            :expand-depth="5"
            copyable
            sort
          />
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'

export default {
  components: {
    JsonViewer
  },
  data() {
    return {
      strData: '',
      copyInfo: { copyText: '复制', copiedText: '已复制', timeout: 2000 }

    }
  },
  computed: {
    JsonData() {
      let ret = {}
      try {
        ret = JSON.parse(this.strData)
      } catch (e) {
        console.log(this.strData)
      }
      return ret
    }
  },
  created() {
    this.test()
  },
  methods: {
  }
}
</script>

