<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">
        <el-alert
          title="在线人数 = 在玩人数(计算后) + 随机数(最大值-最小值)"
          type="success"
        />
        <br>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="最小值">
            <el-input v-model="tableData.min" placeholder="" />
          </el-form-item>

          <el-form-item label="最大值">
            <el-input v-model="tableData.max" placeholder="" />
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
      tableData: {
        min: 2000,
        max: 5000
      },
      form: {
      },
      txt: '',
      subKey: 'OnlineCountCfg'
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
          // console.log('sign reward', response)
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
      const formData = {
        min: parseInt(this.tableData.min),
        max: parseInt(this.tableData.max)
      }
      this.form.Data = JSON.stringify(formData)
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
            console.log('emoj Price save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
