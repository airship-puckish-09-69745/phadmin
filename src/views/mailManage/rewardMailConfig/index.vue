<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="奖励邮件限制">
          <span style="font-size: 13px; color: #ff0000;">该限制是针对邮件发送投注金的限制</span>
          <el-form :model="item" ref="form" label-width="200px" size="medium" style="margin-top: 10px">
            <el-form-item label="单人单日领取奖励金额上限" prop="userRewardPerDay" required>
              <el-input v-model="item.userRewardPerDay" type="number" style="width: 200px">
                <template slot="append">（₱）</template>
              </el-input>
            </el-form-item>
            <el-form-item label="总的单日发放奖励金额上限" prop="totalRewardPerDay" required>
              <el-input v-model="item.totalRewardPerDay" type="number" style="width: 200px">
                <template slot="append">（₱）</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="onSubmit()">保 存</el-button>
      </div>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { DataRule } from '@/utils/common'
import { getCustomize, updateCustomize } from "@/api/custome_configV2";

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'reward_mail_config',
      form: {
        Data: {}
      },
      item: {
        userRewardPerDay: 0, // 单人单日领取奖励金额上限
        totalRewardPerDay: 0 // 总的单日发放奖励金额上限
      },
      AttrNames: {
        userRewardPerDay: '单人单日领取奖励上限',
        totalRewardPerDay: '总的单日发放奖励上限'
      }
    }
  },
  computed: {

  },
  mounted() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$message.error('请填写完整信息')
          return
        }
        this.saveData()
      })
    },
    getData() {
      const $this = this
      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const old = JSON.parse(response.Data.Data)
            $this.item = JSON.parse(response.Data.Data)
            $this.item.userRewardPerDay /= 1000
            $this.item.totalRewardPerDay /= 1000
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    saveData() {
      const item = JSON.parse(JSON.stringify(this.item))
      item.userRewardPerDay *= 1000
      item.totalRewardPerDay *= 1000

      this.$refs.compare.SetNewVal(item)
      this.$refs.compare.Compare((isEdit) => {
        if (!isEdit) {
          this.$message.error('没有任何修改，不需要提交')
          return
        }

        this.$emit('saveData')
        this.lock = false
        this.form.Data = JSON.stringify(item)
        updateCustomize(this.form).then(response => {
          if (response.RetCode === 0) {
            const showMsg = '保存成功'
            this.$message.success(showMsg)
          } else {
            const errMsg = '保存成功失败！'
            this.$message.error(errMsg + response.Data)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
