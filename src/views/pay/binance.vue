<template>
    <div class="app-container">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
        <el-row :gutter="10" style="margin-top: 30px">
            <el-col :span="12" :offset="3">
                <el-form ref="form" :model="form" label-width="160px">
                    <el-form-item label="卢比兑美元汇率：">
                        <el-col :span="8">
                            <el-input v-model.number="item.rate" placeholder="卢比对美元汇率" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否开启支付：">
                        <el-col :span="8">
                            <el-switch
                                v-model="item.pay_enable"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                >
                            </el-switch>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="支付按钮显示：">
                        <el-col :span="8">
                            <el-input v-model.number="item.pay_btn" placeholder="" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="支付描述：">
                        <el-col :span="8">
                            <el-input v-model.number="item.pay_desc" placeholder="" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="加赠比例(%)：">
                        <el-col :span="8">
                            <el-input v-model.number="item.pay_extra" placeholder="" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否开启代付：">
                        <el-col :span="8">
                            <el-switch
                                v-model="item.withdraw_enable"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                >
                            </el-switch>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="代付按钮显示：">
                        <el-col :span="8">
                            <el-input v-model.number="item.withdraw_btn" placeholder="" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="代付描述：">
                        <el-col :span="8">
                            <el-input v-model.number="item.withdraw_desc" placeholder="" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关闭发货：">
                        <el-col :span="8">
                            <el-switch
                                v-model="item.close_delivery"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                                >
                            </el-switch>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="黑名单是否开启支付：">
                      <el-col :span="8">
                        <el-switch
                          v-model="item.pay_enable_ban"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          active-text="开启"
                          inactive-text="关闭"
                        >
                        </el-switch>
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
  components: { Compare, Publish },
  data() {
      return {
          item: {
              rate: 0,                //卢比对美元汇率
              pay_enable: false,     //支付是否开启
              pay_btn: "",            //支付按钮显示
              pay_desc: "",           //支付描述
              pay_extra: 0,           //加赠百分比
              withdraw_enable: false,//代付是否开启
              withdraw_btn: "",       //代付按钮显示
              withdraw_desc: "",      //代付描述
              close_delivery: false,  //关闭发货
              pay_enable_ban: false, //黑名单支付开关
          }, // 奖励
          form: {
          },
          txt: '',
          subKey: 'binance_pay_conf'
      }
  },
  created() {
    this.getData()
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

          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.item = JSON.parse(response.Data.Data)
            console.log(this.item)
            // if (this.item.pay_enable) {
            //     this.item.pay_enable = "true"
            // } else {
            //     this.item.pay_enable = "false"
            // }
            // if (this.item.withdraw_enable) {
            //     this.item.withdraw_enable = "true"
            // } else {
            //     this.item.withdraw_enable = "false"
            // }
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      let postData = this.item
    //   if (this.item.pay_enable === "true") {
    //     postData.pay_enable = true
    //   } else {
    //     postData.pay_enable = false
    //   }
    //   if (this.item.withdraw_enable === "true") {
    //     postData.withdraw_enable = true
    //   } else {
    //     postData.withdraw_enable = false
    //   }
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
            console.log('binance pay config save:', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
