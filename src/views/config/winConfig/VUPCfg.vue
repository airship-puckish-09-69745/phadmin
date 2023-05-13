<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="12" :offset="4">
      <h3 align="center" style="margin:30px auto;">小黑屋数值配置</h3>
      <el-form ref="cfg" :model="cfg">
        <el-form-item style="margin-top: 20px;">
          <el-button type="success" @click="addItem">添加</el-button>
        </el-form-item>

        <el-table :data="cfg.items" border>
          <el-table-column prop="amount" label="支付额度">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.amount" placeholder="支付额度" />
            </template>
          </el-table-column>
          <el-table-column prop="enable_winnings" label="生效winnings数值">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.enable_winnings" placeholder="生效winnings数值" />
            </template>
          </el-table-column>
          <el-table-column prop="disable_winnings" label="失效winnings数值">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.disable_winnings" placeholder="失效winnings数值" />
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="delItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-form-item prop="cfg.vvup_money_line" label="触发专享小黑屋单次充值额(&gt;=)" style="margin-top: 20px;width: 30%;">
          <el-input v-model.number="cfg.vvup_money_line" placeholder="专享小黑屋资产线" />
        </el-form-item>

        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="saveData">保存</el-button>
        </el-form-item>

      </el-form>
    </el-col>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfg: {
        vvup_money_line: 0,
        items: []
      },
      form: {},
      libShow: $libShow,
      subKey: 'VUPConfig',
      AttrNames: {
        'Data': '索引',
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
    'addItem': function() {
      this.cfg.items.push({ 'amount': 0, 'enable_winnings': 0, 'disable_winnings': 0 })
    },
    'delItem': function(idx) {
      this.$delete(this.cfg.items, idx)
    },
    'checkData': function(cfg) {
      for (let i = 0; i < cfg.items.length; i++) {
        if (!cfg.items[i].amount) {
          Message.error('支付额度不能为0!')
          return false
        }
        if (!cfg.items[i].enable_winnings) {
          Message.error('额度' + cfg.items[i].amount + '的生效winnings不能为0!')
          return false
        }
        if (!cfg.items[i].disable_winnings) {
          Message.error('额度' + cfg.items[i].amount + '的失效winnings不能为0!')
          return false
        }
      }
      return true
    },
    'getData': function() {
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
          $this.form = response.Data || { Data: '{}' }
          const v = JSON.parse($this.form.Data)
          v.vvup_money_line /= 1000
          for (let i = 0; i < v.items.length; i++) {
            v.items[i].amount /= 1000
            v.items[i].enable_winnings /= 1000
            v.items[i].disable_winnings /= 1000
          }
          $this.cfg = v
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    'saveData': function() {
      if (!this.checkData(this.cfg)) {
        return
      }
      const postData = JSON.parse(JSON.stringify(this.cfg))
      postData.vvup_money_line *= 1000
      for (let i = 0; i < postData.items.length; i++) {
        postData.items[i].amount *= 1000
        postData.items[i].enable_winnings *= 1000
        postData.items[i].disable_winnings *= 1000
      }
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
