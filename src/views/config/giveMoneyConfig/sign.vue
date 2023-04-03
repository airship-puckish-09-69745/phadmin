<template>
  <div class="app-container">
    <publish primary-key="ID" key-id="CustomizeCfg_signRewards" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="6" :offset="3">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item v-for="(o,idx) in rewards" :key="idx" :label="'第' + (idx+1) +'天：'">
            <el-input v-model="rewards[idx]" placeholder="placeholder" />
          </el-form-item>
          <el-form-item>
            <span style="color:red">请确保第7天的奖励与签到商品数量保持一致</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { getSignRewards, setSignRewards } from '@/api/custome_config'
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      rewards: [0, 0, 0, 0, 0, 0, 0], // 奖励
      form: {},
      txt: '',

      AttrNames: {
        'Data': '奖励',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getSignRewards().then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.rewards = JSON.parse(response.Data.Data)
            for (let i = 0; i < this.rewards.length; i++) {
              this.rewards[i] /= 1000
            }

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      const rewards = []
      for (const i in this.rewards) {
        rewards[i] = this.rewards[i] * 1000
      }
      this.form.Data = JSON.stringify(rewards)
      const submitData = this.form

      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        setSignRewards(submitData).then(response => {
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
