<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="200px">
          <el-row>
            <el-form-item label="功能开关：" label-width="200px">
              <el-switch
                v-model="totalSwitch"
                active-text="开"
                inactive-text="关"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="检查时间段：">
              <el-col :span="12">
                <el-input v-model.number="item.CheckTime" :required="true" ><template slot="append">分钟</template></el-input>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="FAKE订单数量：">
                <el-input v-model.number="item.FakeCount" :required="true" />
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare },
  data() {
    return {
      isValid: true,
      item: { 'TotalSwitch': 1, 'FakeCount': 3, 'FailCount': 5, 'PayUserCount': 3, 'NewUserCount': 5, 'PayUserSingleCount': 3, 'NewUserSingleCount': 5, 'Interval': 5, 'CheckTime': 10 },
      form: {
      },
      totalSwitch: true,

      subKey: 'pay_alarm_cfg',

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
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)
            $this.totalSwitch = $this.item.TotalSwitch === 1
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getPostData() {
      this.item.TotalSwitch = (this.totalSwitch ? 1 : 0)
      return this.item
    },
    setData() {
      const postData = this.getPostData()
      this.form.Data = JSON.stringify(postData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
