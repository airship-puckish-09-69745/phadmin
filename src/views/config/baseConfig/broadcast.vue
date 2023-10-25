<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">

        <el-form ref="item" :model="items" label-width="150px">
          <fieldset style="margin:1px 5px auto;">
            <legend>广播最低金额：</legend>
            <money-input v-model="items.withdraw.minAmount" label="提现" />
            <el-row v-for="item of items.play.games">
              <money-input v-model="item.minWinMoney" :label="item.name" />
            </el-row>
          </fieldset>

          <fieldset style="margin:5px 5px auto;">
            <legend>假消息内容概率：</legend>
            <el-form-item label="提现" prop="WithdrawTimes">
              <el-input v-model.number="items.withdraw.rate" placeholder="" />
            </el-form-item>
            <el-row v-for="item of items.play.games">
              <el-form-item :label="item.name" prop="rate">
                <el-input v-model.number="item.rate" placeholder="" />
              </el-form-item>
            </el-row>
          </fieldset>

          <fieldset style="margin:1px 5px auto;">
            <legend>假消息提现额度概率：</legend>
            <el-table
              :data="items.withdraw.amounts"
              style="width: 100%"
              border
            >
              <el-table-column
                prop="minAmount"
                label="最小提现金额"
                width="150"
              >
                <template slot-scope="scope">
                  <money-input v-model="scope.row.minAmount" label-width="0" label="" :is-require="false" aria-readonly="true" is-disable="true" />
                </template>
              </el-table-column>
              <el-table-column
                prop="maxAmount"
                label="最大提现金额"
                width="150"
              >
                <template slot-scope="scope">
                  <money-input v-model="scope.row.maxAmount" label-width="0" label="" :is-require="false" aria-readonly="true" is-disable="true" />
                </template>
              </el-table-column>
              <el-table-column
                prop="rate"
                label="概率"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.rate" label-width="0" label="" :is-require="false" />
                </template>
              </el-table-column>
            </el-table>
          </fieldset>

          <fieldset style="margin:1px 5px auto;">
            <legend>假消息游戏赢钱范围概率：</legend>
            <template v-for="item of items.play.games">
              <fieldset style="margin:1px 5px auto;">
                <legend>{{ item.name }}：</legend>
                <el-table
                  :data="item.simulateCfg"
                  style="width: 100%"
                  border
                >
                  <el-table-column
                    prop="minWinMoney"
                    label="最小值"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <money-input v-model="scope.row.minWinMoney" label-width="0" label="" :is-require="false" aria-readonly="true" is-disable="true" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="maxAmount"
                    label="最大值"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <money-input v-model="scope.row.maxWinMoney" label-width="0" label="" :is-require="false" aria-readonly="true" is-disable="true" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    label="概率"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.rate" label-width="0" label="" :is-require="false" />
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </template>
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

var defaultStr = `{"play":{"rate":50,"games":[{"gid":22,"name":"Tongits","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]},{"gid":23,"name":"Lucky9","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]},{"gid":10,"name":"Crash","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]},{"gid":25,"name":"Color Game","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]},{"gid":51,"name":"Phoenix","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]},{"gid":52,"name":"Sleeping Beauty","minWinMoney":1000000,"rate":10,"simulateCfg":[{"rate":30,"minWinMoney":500000,"maxWinMoney":999000},{"rate":30,"minWinMoney":1000000,"maxWinMoney":1999000},{"rate":30,"minWinMoney":2000000,"maxWinMoney":4999000},{"rate":10,"minWinMoney":5000000,"maxWinMoney":10000000}]}]},"withdraw":{"rate":50,"amounts":[{"minAmount":100000,"maxAmount":100000,"rate":30},{"minAmount":101000,"maxAmount":499000,"rate":5},{"minAmount":500000,"maxAmount":500000,"rate":30},{"minAmount":501000,"maxAmount":999000,"rate":5},{"minAmount":1000000,"maxAmount":1000000,"rate":30},{"minAmount":5000000,"maxAmount":9999000,"rate":10}],"minAmount":1000000}}`
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      items: JSON.parse(defaultStr),
      form: {
      },
      txt: '',
      subKey: 'auto_broadcast'
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
