<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="0">
          <el-row>
            <el-table
              :data="items"
              style="width: 100%"
            >
              <el-table-column
                prop="TotalPay"
                label="玩家累计充值金额"
              >
                <template slot-scope="scope">
                  <money-input v-model="scope.row.TotalPay" label-width="0" label="" :is-disable="true" />
                </template>
              </el-table-column>
              <el-table-column
                prop="Ratio"
                label="提充比>"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input v-model.number="scope.row.Ratio" placeholder="提充比" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="WithdrawTimes"
                label="提款笔数<"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input v-model.number="scope.row.WithdrawTimes" placeholder="提款笔数" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="TodayWithdrawAmount"
                label="当天申请提款金额总和>"
              >
                <template slot-scope="scope">
                  <money-input v-model="scope.row.TodayWithdrawAmount" label-width="0" label="" />
                </template>
              </el-table-column>
            </el-table>
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
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare, MoneyInput },
  data() {
    return {
      items: [
        {
          'TotalPay': 0,
          'Ratio': 0,
          'WithdrawTimes': 0,
          'TodayWithdrawAmount': 0
        }
      ],
      form: {
      },
      totalSwitch: true,

      subKey: 'withdraw_observe_cfg',

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
    initData() {
      this.items = []
      for (let i = 100; i <= 1000; i += 100) {
        this.items.push({
          'TotalPay': i * 1000,
          'Ratio': 0,
          'WithdrawTimes': 0,
          'TodayWithdrawAmount': 0
        })
      }
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
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '[]') {
            $this.items = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data.Data)
          } else {
            $this.initData()
            const data = JSON.stringify($this.items)
            $this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    itemsSort() {
      this.items.sort(function(a, b) {
        return a.TotalPay - b.TotalPay
      })
    },
    encodeData() {
      this.itemsSort()
      return JSON.stringify(this.items)
    },
    setData() {
      this.form.Data = this.encodeData()
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
            console.log('response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
