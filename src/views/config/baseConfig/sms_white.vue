<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">
        <el-alert
          title="用户在白名单下是否发送短信"
          type="success"
        />
        <br>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="安卓系列">
            <el-switch
              v-model="tableData.android"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="发送短信"
              inactive-text="不发短信"
            />
          </el-form-item>

          <el-form-item label="Galaxy系列">
            <el-switch
              v-model="tableData.galaxy"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="发送短信"
              inactive-text="不发短信"
            />
          </el-form-item>

          <el-form-item label="逆光系列">
            <el-switch
              v-model="tableData.wallets"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="发送短信"
              inactive-text="不发短信"
            />
          </el-form-item>

          <el-form-item label="TX系列">
            <el-switch
              v-model="tableData.tx"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="发送短信"
              inactive-text="不发短信"
            />
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
        'android': false,
        'galaxy': false,
        'tx': false,
        'wallets': false
      },
      form: {
      },
      txt: '',
      subKey: 'sms_white_cfg'
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
            console.log('emoj Price save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
