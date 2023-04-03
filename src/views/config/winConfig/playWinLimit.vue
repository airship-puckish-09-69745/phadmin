<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />

    <el-row>
      <el-col :offset="4">
        <div style="padding: 10px">
          单局赢钱上限=基准值*n%<br>
          n% = 基准值 / 生涯贡献	<br>
          1	生涯贡献	生涯有效下注*5% <br>
          2	基准值 <br>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="configs" :model="configs" label-width="100px">
          <el-row>
            <el-col :span="6">基准值/生涯贡献</el-col>
            <el-col :span="6">赢钱上限</el-col>
          </el-row>
          <el-row v-for="(o,key) in configs" :key="key">
            <el-col :span="12">
              <el-form-item :label="key + '%：'" :prop="key" :rules="dataRule(true,{type:'n',range:'1-500'})">
                <el-col :span="20">
                  <el-input v-model.number="configs[key]" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      configs: { '1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10 },
      form: {},
      txt: '',
      subKey: 'playWinLimit',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }

      }
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
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
            this.configs = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['configs'])) return false

      this.form.Data = JSON.stringify(this.configs)
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
