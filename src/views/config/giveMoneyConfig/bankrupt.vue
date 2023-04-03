<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="每日领取次数：">
            <el-col :span="8">
              <el-input v-model.number="item.Count" placeholder="placeholder" />
            </el-col>
          </el-form-item>
          <el-form-item label="破产补助金额：">
            <el-col :span="8">
              <el-input v-model.number="item.Amount" placeholder="placeholder" />
            </el-col>
          </el-form-item>
          <el-form-item label="破产线：">
            <el-col :span="8">
              <el-input v-model.number="item.BankruptLine" placeholder="placeholder" />
            </el-col>
          </el-form-item>
          <el-col :offset="2" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
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
      item: {
        Count: 1, // 每日领取次数
        Amount: 100, // 补助金额
        BankruptLine: 0 // 破产线
      }, // 奖励
      form: {
      },
      txt: '',
      subKey: 'bankrupt_cfg'
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
            this.item = JSON.parse(response.Data.Data)
            this.item.Amount /= 1000
            this.item.BankruptLine /= 1000
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      const postData = {}
      postData.Amount = this.item.Amount * 1000
      postData.BankruptLine = this.item.BankruptLine * 1000
      postData.Count = this.item.Count
      this.form.Data = JSON.stringify(postData)
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
