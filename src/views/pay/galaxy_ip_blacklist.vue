<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="8" :offset="1">
        <br>
        <el-alert
          title="配置的ip将无法下单支付"
          type="error"
        />
        <br>
        <el-form ref="form" :model="form" label-width="150px">
          <template v-for="(ip,i) in ips">
            <el-form-item>
              <el-input v-model="ips[i]" placeholder="请输入内容">
                <template slot="append">
                  <el-button @click="delRow(i)">删除</el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="primary" @click="addRow">添加</el-button>
            <el-button type="success" @click="setData">保存</el-button>
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
      ips: [],
      txt: '',
      subKey: 'galaxy_ip_blacklist'
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
    addRow() {
      this.ips.push('')
    },
    delRow(idx) {
      this.ips.splice(idx, 1)
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
            this.ips = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      this.form.Data = JSON.stringify(this.ips)
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
