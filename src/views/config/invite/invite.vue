<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">

        <el-form ref="item" :model="item" label-width="150px">

          <money-input v-model="item.InitBalance" label="初始金额" />
          <money-input v-model="item.InviteCommission" label="邀请佣金" />
          <money-input v-model="item.CommissionLimit" label="单个用户佣金贡献上限" />

          <el-form-item label="同IP绑定上限" prop="SameIpLimit" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="item.SameIpLimit" placeholder="" />
          </el-form-item>

          <el-form-item label="每日提现次数" prop="WithdrawTimes" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="item.WithdrawTimes" placeholder="" />
          </el-form-item>

          <el-button type="primary" size="mini" @click="addWithdrawOption">添加提现选项</el-button>
          <el-table
            :data="item.WithdrawOptions"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="Amount"
              label="提现金额"
              width="150"
            >
              <template slot-scope="scope">
                <money-input v-model="scope.row.Amount" label-width="0" label="" :is-require="false" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Ratio"
              label="手续费比例‰"
              width="150"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0" :prop="`WithdrawOptions[${scope.$index}].Ratio`" :rules="dataRule(true,{type:'n'})">
                  <el-input v-model.number="scope.row.Ratio" placeholder="千分之几" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="IsShow"
              label="是否显示"
              width="150px"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-switch
                    v-model="scope.row.IsShow"
                    style="display: block"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="显示"
                    inactive-text="关闭"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="IsShow"
              label="操作"
              width="150px"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delWithdrawOption(scope.$index)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <fieldset style="margin:30px auto;">
            <legend>安装审核</legend>

            <money-input v-model="item.InstallAudit.PrizeThreshold" label="奖励阀值" />

            <el-form-item label="天数" prop="InstallAudit.Day" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.InstallAudit.Day" placeholder="" />
            </el-form-item>

            <el-form-item label="每日玩牌局数" prop="InstallAudit.Games" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.InstallAudit.Games" placeholder="" />
            </el-form-item>

            <el-form-item label="每日老虎机牌局数" prop="InstallAudit.SlotsGames" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.InstallAudit.SlotsGames" placeholder="" />
            </el-form-item>
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>充值审核</legend>

            <el-form-item label="延迟到账(小时)" prop="ReferralAudit.EffectHour" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.ReferralAudit.EffectHour" placeholder="" />
            </el-form-item>

            <el-form-item label="有效下注流水倍数" prop="ReferralAudit.BetMultiple" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.ReferralAudit.BetMultiple" placeholder="" />
            </el-form-item>

<!--            <el-form-item label="玩牌局数" prop="ReferralAudit.Games" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.ReferralAudit.Games" placeholder="" />
            </el-form-item>

            <el-form-item label="老虎机牌局数" prop="ReferralAudit.SlotsGames" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.ReferralAudit.SlotsGames" placeholder="" />
            </el-form-item>-->
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>推广者审核</legend>

            <el-form-item label="延迟到账(小时)" prop="AffiliateAudit.EffectHour" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.AffiliateAudit.EffectHour" placeholder="" />
            </el-form-item>

            <el-form-item label="有效下注流水倍数" prop="AffiliateAudit.BetMultiple" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.AffiliateAudit.BetMultiple" placeholder="" />
            </el-form-item>

<!--            <el-form-item label="玩牌局数" prop="AffiliateAudit.Games" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.AffiliateAudit.Games" placeholder="" />
            </el-form-item>

            <el-form-item label="老虎机牌局数" prop="AffiliateAudit.SlotsGames" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.AffiliateAudit.SlotsGames" placeholder="" />
            </el-form-item>-->
          </fieldset>

          <fieldset style="margin:30px auto;">
            <legend>罐子审核</legend>

            <el-form-item label="天数" prop="GullakAudit.Day" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.GullakAudit.Day" placeholder="" />
            </el-form-item>

            <el-form-item label="玩牌局数" prop="GullakAudit.Games" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.GullakAudit.Games" placeholder="" />
            </el-form-item>

            <el-form-item label="每日老虎机牌局数" prop="GullakAudit.SlotsGames" :rules="dataRule(true,{type:'n'})">
              <el-input v-model.number="item.GullakAudit.SlotsGames" placeholder="" />
            </el-form-item>
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
      item: {
        InitBalance: 20000,
        InviteCommission: 20000,
        SameIpLimit: 3,
        CommissionLimit: 1500000,
        WithdrawTimes: 100,
        WithdrawOptions: [
          { Amount: 200000, Ratio: 300, IsShow: true },
          { Amount: 300000, Ratio: 300, IsShow: true },
          { Amount: 500000, Ratio: 300, IsShow: true },
          { Amount: 1000000, Ratio: 300, IsShow: true },
          { Amount: 2000000, Ratio: 300, IsShow: true },
          { Amount: 5000000, Ratio: 300, IsShow: true }
        ],
        InstallAudit: {
          PrizeThreshold: 880000,
          Games: 10,
          SlotsGames: 10,
          Day: 3
        },
        ReferralAudit: { EffectHour: 12, BetMultiple: 1 },
        AffiliateAudit: { EffectHour: 12, BetMultiple: 1 },
        // AffiliateAudit: { EffectHour: 12, Games: 10, SlotsGames: 10 },
        GullakAudit: { Games: 10, Day: 3, SlotsGames: 10 }
      },
      form: {
      },
      txt: '',
      subKey: 'invite_new_config'
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
    addWithdrawOption() {
      this.item.WithdrawOptions.push({ Amount: 0, Ratio: 0, IsShow: true })
    },
    delWithdrawOption(index) {
      const $this = this
      this.$confirm('确定要删除吗？', '提醒')
        .then(function() {
          $this.item.WithdrawOptions.splice(index, 1)
        })
    },
    withdrawAmountSort() {
      this.item.WithdrawOptions.sort(function(a, b) {
        return a.Amount - b.Amount
      })
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
            $this.item = this.DeepCopy(data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.withdrawAmountSort()
      this.form.Data = JSON.stringify(this.item)
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
