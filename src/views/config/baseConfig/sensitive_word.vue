<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="11" :offset="1">
        <el-alert
          title="每行表示一段词，如果字符之间含空格和符号，检测时去掉空格和符号"
          type="success"
        />
        <el-form ref="form" :model="form" label-width="80px"  style="margin-top: 10px">
          <el-form-item label="内容">
            <el-input type="textarea" :autosize="{ minRows: 20, maxRows: 40}" placeholder="请输入内容" v-model="tableData.content" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: {},
      form: {},
      subKey: 'sensitive_word'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            $this.tableData = data
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      this.tableData.content = this.processText(this.tableData.content)

      this.form.Data = JSON.stringify(this.tableData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    processText(text) {
      const lines = text.split("\n");

      const processedLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const processedLine = this.cleanSentence(line); 
        processedLines.push(processedLine);
      }

      return processedLines.join("\n");
    },
    cleanSentence(sentence) {
      // 使用正则表达式匹配所有符号和空格，并替换为空字符串
      return sentence.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
    }
  }
}
</script>
