<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="12" :offset="4">

        <el-form ref="item" :model="item" label-width="300px">

          <el-form-item label="自动审核开关">
            <el-switch
              style="display: block"
              v-model="item.Switch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="被邀请用户总充提比%">
            <el-input v-model.number="item.Rate" placeholder="placeholder"></el-input>
            <div style="color: #8c939d">
              公式：被邀请用户 总提现 / 总充值 = 比例
            </div>
            <div class="input-tips">
              线上数据：{{ rate.withdraw | toRupee }} / {{ rate.recharge | toRupee }} = {{ rate.rate }}
            </div>
          </el-form-item>

          <el-form-item label="首次提款被邀请用户充提比,放大100倍">
            <el-input v-model.number="item.FirstRate" placeholder="placeholder"></el-input>
          </el-form-item>

          <el-form-item label="非首次提款被邀请用户充提比,放大100倍">
            <el-input v-model.number="item.NormalRate" placeholder="placeholder"></el-input>
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
import { DataRule, ValidateVueItem } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      item: {
        'Switch': false,
        'Rate': 10000,
        'FirstRate': 50,
        'NormalRate': 100
      },
      rate: {
        recharge: 0,
        withdraw: 0,
        rate: 0
      },
      form: {
      },
      txt: '',
      subKey: 'invite_withdraw_audit'
    }
  },
  created() {
    this.getData()
    this.getRate()
    console.log('created ending')
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getRate() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/withdraw/rate'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log("rate rsp", response)
          if (response.Data) {
            $this.rate = this.DeepCopy(response.Data)
          }
        }
      })
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
            $this.item = this.DeepCopy(data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.form.Data = JSON.stringify(this.item)
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>

<style style="scss" scoped>
.input-tips{
  color: red;
}
</style>
