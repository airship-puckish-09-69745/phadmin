<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="等级"
        >
          <template slot-scope="scope">
            {{ showLevel(scope.row.Level) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Exp"
          label="经验"
        />
        <el-table-column
          prop="Exp"
          label="邀请佣金"
        >
          <template slot-scope="scope">
            {{ scope.row.Privilege.HasInviteCommission ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Exp"
          label="被邀请者充值佣金"
        >
          <template slot-scope="scope">
            {{ scope.row.Privilege.HasRechargeCommission ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Privilege.AffiliateCommissionLevel"
          label="推广者佣金"
        >
          <template slot-scope="scope">
            {{ scope.row.Privilege.AffiliateCommissionLevel > 0 ? scope.row.Privilege.AffiliateCommissionLevel + "级佣金" : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Privilege.RechargeCommission"
          label="被邀请者充值返佣比例"
        >
          <template slot-scope="scope">
            {{ scope.row.RechargeCommission.ReferralRechargeRate }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="Privilege.Affiliate1RechargeRate"
          label="1级推广者充值返佣比例"
        >
          <template slot-scope="scope">
            {{ scope.row.RechargeCommission.Affiliate1RechargeRate }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="Privilege.Affiliate2RechargeRate"
          label="2级推广者充值返佣比例"
        >
          <template slot-scope="scope">
            {{ scope.row.RechargeCommission.Affiliate2RechargeRate }}%
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="dialogClose"
    >
      <el-form ref="item" :model="item" label-width="200px">
        <el-form-item label="等级">
          <el-select v-model="item.Level" disabled placeholder="placeholder">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="showLevel(item.value)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="经验" prop="Exp" :rules="dataRule(true, {type:'n'})">
          <el-input v-model.number="item.Exp" placeholder="经验值" />
        </el-form-item>

        <fieldset style="margin-top: 20px">
          <legend>等级权益</legend>

          <el-form-item label="邀请佣金" required>
            <el-switch
              v-model="item.Privilege.HasInviteCommission"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>

          <el-form-item label="被邀请者充值佣金" required>
            <el-switch
              v-model="item.Privilege.HasRechargeCommission"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>

          <el-form-item label="推广者佣金" required>
            <el-select v-model.number="item.Privilege.AffiliateCommissionLevel">
              <el-option
                v-for="v in commissionLevelOptions"
                :key="v.value"
                :label="v.label"
                :value="v.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="筹码折扣率%" prop="Privilege.ChipDiscount" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.Privilege.ChipDiscount" placeholder="筹码折扣" />
          </el-form-item>
        </fieldset>

        <fieldset style="margin-top: 20px">
          <legend>邀请充值返佣比例</legend>

          <el-form-item label="被邀请者充值返佣比例%" prop="RechargeCommission.ReferralRechargeRate" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.RechargeCommission.ReferralRechargeRate" />
          </el-form-item>

          <el-form-item label="1级推广者充值返佣比例%" prop="RechargeCommission.Affiliate1RechargeRate" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.RechargeCommission.Affiliate1RechargeRate" />
          </el-form-item>

          <el-form-item label="2级推广者充值返佣比例%" prop="RechargeCommission.Affiliate2RechargeRate" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.RechargeCommission.Affiliate2RechargeRate" />
          </el-form-item>

          <el-form-item label="3级推广者充值返佣比例%" prop="RechargeCommission.Affiliate3RechargeRate" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.RechargeCommission.Affiliate3RechargeRate" />
          </el-form-item>

          <el-form-item label="4级推广者充值返佣比例%" prop="RechargeCommission.Affiliate4RechargeRate" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.RechargeCommission.Affiliate4RechargeRate" />
          </el-form-item>
        </fieldset>

        <fieldset style="margin-top: 20px">
          <legend>罐子</legend>
          <el-form-item label="每次邀请人数" prop="Gullak.InviteNumber" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.Gullak.InviteNumber" />
          </el-form-item>

          <el-form-item label="可获得罐子数" prop="Gullak.GetJarNumber" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.Gullak.GetJarNumber" />
          </el-form-item>
          <money-input v-model="item.Gullak.HourProfit" label="罐子每小时自动收益" />
          <money-input v-model="item.Gullak.WithdrawAmount" label="罐子提现门槛" />

          <el-form-item label="每天可获得罐子上限" prop="Gullak.JarLimit" :rules="dataRule(true, {type:'n'})">
            <el-input v-model.number="item.Gullak.JarLimit" />
          </el-form-item>
        </fieldset>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">提 交</el-button>
      </span>
    </el-dialog>

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
      tableData: [
        {
          Level: 1, Name: '青铜', Exp: 0,
          Privilege: { HasInviteCommission: true, HasRechargeCommission: false, AffiliateCommissionLevel: 0, ChipDiscount: 0 },
          RechargeCommission: { ReferralRechargeRate: 0, Affiliate1RechargeRate: 0, Affiliate2RechargeRate: 0, Affiliate3RechargeRate: 0, Affiliate4RechargeRate: 0 },
          Gullak: { InviteNumber: 1, GetJarNumber: 1, HourProfit: 1000, WithdrawAmount: 10000, JarLimit: 10 }
        }
      ],
      dialogVisible: false,
      item: {
        Level: 1, Name: '青铜', Exp: 0,
        Privilege: { HasInviteCommission: true, HasRechargeCommission: false, AffiliateCommissionLevel: 0, ChipDiscount: 0 },
        RechargeCommission: { ReferralRechargeRate: 0, Affiliate1RechargeRate: 0, Affiliate2RechargeRate: 0, Affiliate3RechargeRate: 0, Affiliate4RechargeRate: 0 },
        Gullak: { InviteNumber: 1, GetJarNumber: 1, HourProfit: 1000, WithdrawAmount: 10000, JarLimit: 10 }
      },
      form: {
      },
      levelOptions: [
        { label: '青铜', value: 1 },
        { label: '白银', value: 2 },
        { label: '黄金', value: 3 },
        { label: '铂金', value: 4 },
        { label: '钻石', value: 5 }
      ],
      commissionLevelOptions: [
        { label: '无佣金', value: 0 },
        { label: '1级佣金', value: 1 },
        { label: '2级佣金', value: 2 },
        { label: '3级佣金', value: 3 },
        { label: '4级佣金', value: 4 }
      ],
      txt: '',
      subKey: 'invite_level'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    showEdit(row) {
      this.item = row
      this.dialogVisible = true
      // 设置修改之前数据
      this.$refs.compare.SetOldVal(this.DeepCopy(row))
    },
    editSubmit() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      for (const i in this.tableData) {
        if (this.tableData[i].Level === this.item.Level) {
          this.tableData[i] = this.item
          break
        }
      }
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.item)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        // 更新数据
        $this.setData()
        $this.dialogVisible = false
      })
    },
    showLevel(lvl) {
      let name = ''
      lvl = parseInt(lvl)
      for (const i in this.levelOptions) {
        if (this.levelOptions[i].value === lvl) {
          name = this.levelOptions[i].value + '.' + this.levelOptions[i].label
          break
        }
      }

      return name
    },
    dialogClose(done) {
      this.dialogVisible = true
      done()
    },
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
            $this.tableData = this.DeepCopy(data)
          }
        }
      })
    },
    setData() {
      this.form.Data = JSON.stringify(this.tableData)
      const $this = this
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
    }
  }
}
</script>
