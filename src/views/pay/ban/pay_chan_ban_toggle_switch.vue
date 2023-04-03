<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="8" :offset="1">
        <br/>
        <br/>
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="安卓开关">
            <el-switch
              style="display: block"
              v-model="item.android"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="Galaxy开关">
            <el-switch
              style="display: block"
              v-model="item.galaxy"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
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
      price: 1, // 道具价格
      form: {
      },
      item: {
        android: true,
        galaxy: true
      },
      txt: '',
      subKey: 'pay_channel_ban_toggle_switch'
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
          // console.log('response', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.item = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
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
            console.log('emoj Price save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
