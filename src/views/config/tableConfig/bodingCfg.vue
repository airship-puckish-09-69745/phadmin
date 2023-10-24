<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="cfg" :model="cfg" label-width="150px">

          <el-form-item label="开局倒计时">
            <el-input v-model.number="cfg.DelayAfterGameStart" placeholder="开局倒计时（秒）" />
          </el-form-item>

          <el-divider content-position="left">牌型赔率配置</el-divider>

          <el-form-item label="lucky">
            <el-input v-model.number="cfg.CardTypeOddsPok89" placeholder="2张牌加起来=8或9，默认1倍" />
          </el-form-item>

          <el-form-item label="lucky（特殊）">
            <el-input v-model.number="cfg.CardTypeOddsPok89Special" placeholder="2张牌加起来=8或9，而且是同花或对子，默认2倍" />
          </el-form-item>

          <el-form-item label="三条">
            <el-input v-model.number="cfg.CardTypeOddsTong" placeholder="3张点数相同的牌，默认5倍" />
          </el-form-item>

          <el-form-item label="三黄">
            <el-input v-model.number="cfg.CardTypeOddsSamLueang" placeholder="3张J、Q、K之类的牌，默认3倍" />
          </el-form-item>

          <el-form-item label="同花顺">
            <el-input v-model.number="cfg.CardTypeOddsStraightFlush" placeholder="3张连续且花色相同的牌，默认5倍" />
          </el-form-item>

          <el-form-item label="顺子">
            <el-input v-model.number="cfg.CardTypeOddsStraight" placeholder="3张连续的牌，默认3倍" />
          </el-form-item>

          <el-form-item label="普通牌">
            <el-input v-model.number="cfg.CardTypeOddsNormal" placeholder="没有上面的牌型，为普通牌型，默认1倍" />
          </el-form-item>

          <el-form-item label="普通牌（特殊1）">
            <el-input v-model.number="cfg.CardTypeOddsNormalSpecial2" placeholder="普通牌型，两张牌，同花色或者对子，默认2倍" />
          </el-form-item>

          <el-form-item label="普通牌（特殊2）">
            <el-input v-model.number="cfg.CardTypeOddsNormalSpecial3" placeholder="普通牌型，三张牌，同花色，默认3倍" />
          </el-form-item>

          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="saveData">保存</el-button>
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
      cfg: {
        Items: []
      },
      form: {},
      subKey: 'boding_cfg'
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
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          const v = JSON.parse($this.form.Data)
          $this.cfg = v
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    saveData() {
      const postData = JSON.parse(JSON.stringify(this.cfg))
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
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
