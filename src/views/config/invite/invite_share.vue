<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">

        <el-form ref="item" :model="items" label-width="150px">

          <fieldset style="margin:30px auto;">
            <legend>用whatapps分享一次</legend>
            <money-input v-model="items[0].Prize" label="奖励" />
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>邀请1个好友注册游戏</legend>
            <money-input v-model="items[1].Prize" label="奖励" />
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>邀请1个好友注册且玩牌</legend>
            <el-form-item label="玩牌局数" prop="[2].Total" :rules="dataRule(true, {type:'n'})">
              <el-input v-model.number="items[2].Total" />
            </el-form-item>
            <money-input v-model="items[2].Prize" label="奖励" />
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>邀请1个好友注册且完成首充</legend>
            <money-input v-model="items[3].Prize" label="奖励" />
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>邀请1个好友注册且好友也邀请了</legend>
            <money-input v-model="items[4].Prize" label="奖励" />
          </fieldset>

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
      items: [
        {
          'Id': 1,
          'Total': 0,
          'Prize': 5000
        }
      ],
      form: {
      },
      txt: '',
      subKey: 'invite_share_mission'
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
            $this.items = this.DeepCopy(data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.form.Data = JSON.stringify(this.items)
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
