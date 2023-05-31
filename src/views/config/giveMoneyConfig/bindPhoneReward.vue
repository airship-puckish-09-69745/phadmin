<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="200px">
          <el-row>
            <el-form-item label="活动状态：">
              <el-switch v-model="item.disabled" active-text="下架" inactive-text="正常" active-color="#cc0000" inactive-color="#009900" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="奖励的金额：">
              <el-input v-model.number="item.rewardMoney" placeholder="奖励的金额" autocomplete="false" />
            </el-form-item>
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
      item: {
        disabled: false,
        rewardMoney: 0
      },
      form: {
      },
      txt: '',
      subKey: 'bind_phone_reward_cfg',

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
            $this.item.rewardMoney /= 1000
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getPostData() {
      const postData = {}
      Object.assign(postData, this.item)
      postData.rewardMoney *= 1000
      return postData
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
