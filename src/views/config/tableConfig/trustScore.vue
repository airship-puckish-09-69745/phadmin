<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-col :span="16" :offset="3">
          <fieldset style="margin-top:10px">
            <legend>授信线配置</legend>
            <el-input placeholder="请输入内容" v-model.number="item.tongits" style="margin-top:10px">
              <template slot="prepend">Tongits类游戏授信线</template>
            </el-input>
            <el-input placeholder="请输入内容" v-model.number="item.pusoy" style="margin-top:20px">
              <template slot="prepend">Pusoy 类游戏授信线</template>
            </el-input>
          </fieldset>
        </el-col>

        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
import { $libDate,$libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        tongits: 0,
        pusoy: 0,
      },
      isHidden: true, // 默认隐藏
      form: {},
      subKey: 'trust_score_cfg',
      libShow: $libShow,
      envProjectname: process.env.VUE_APP_PROJECT
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_name)
    if (process.env.VUE_APP_PROJECT_name == '菲1-开发环境' || process.env.VUE_APP_PROJECT_name == '菲1-线上环境' || process.env.VUE_APP_PROJECT_name == 'Zoo-线上环境') {
      this.isHidden = false
    }
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
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.form.Data = JSON.stringify(this.item)
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
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
