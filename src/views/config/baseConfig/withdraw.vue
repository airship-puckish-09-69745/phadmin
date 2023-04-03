<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="form" :model="form" label-width="150px">

          <el-divider content-position="left">提现配置</el-divider>
          <el-form-item label="是否首充后才能提现">
            <el-switch
              v-model="form.NeedPay"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>

          <el-form-item label="单日可提现次数">
            <el-input v-model="form.DailyCount" type="number" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="medium" @click="addOption">添加提现选项</el-button>
          </el-form-item>
          <el-form-item label="提现选项">
            <el-table
              :data="form.AmountOption"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="Money"
                label="金额"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Money" />
                </template>
              </el-table-column>
              <el-table-column
                prop="Ratio"
                label="手续费比例%"
              >
                <template slot="header" slot-scope="scope">
                  <span>手续费比例%</span>
                  <el-tooltip class="item" effect="dark" content="百分比，保留2位小数" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Ratio" />
                </template>
              </el-table-column>

              <el-table-column
                prop="Ratio"
                label="首次提款充提比"
              >
                <template slot="header" slot-scope="scope">
                  <span>首次提款充提比</span>
                  <el-tooltip class="item" effect="dark" content="自动审核用到参数，百分比，保留2位小数" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.FirstRatio" />
                </template>
              </el-table-column>

              <el-table-column
                prop="Ratio"
                label="非首次提款充提比"
              >
                <template slot="header" slot-scope="scope">
                  <span>非首次提款充提比</span>
                  <el-tooltip class="item" effect="dark" content="自动审核用到参数，百分比，保留2位小数" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.OtherRatio" />
                </template>
              </el-table-column>

              <el-table-column
                prop="Ratio"
                label="忠实用户充提比"
              >
                <template slot="header" slot-scope="scope">
                  <span>忠实用户充提比</span>
                  <el-tooltip class="item" effect="dark" content="自动审核用到参数，百分比，保留2位小数" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.LoyalRatio" />
                </template>
              </el-table-column>

              <el-table-column
                prop="IsShow"
                label="是否显示"
                width="150px"
              >
                <template slot="header" slot-scope="scope">
                  <span>是否关闭</span>
                  <el-tooltip class="item" effect="dark" content="关闭或者信用分小于0都会隐藏" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.IsShow"
                    style="display: block"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="显示"
                    inactive-text="关闭"
                  />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
              >88
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="delOption(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-divider content-position="left">提现自动审核配置</el-divider>
          <el-tabs v-model="tabName" type="border-card" @click="handleClick">
            <el-tab-pane label="自运营（android）" name="android">
              <el-form-item label="自动审核开关">
                <el-switch
                  v-model="form.AutoAuditSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
                <el-form-item_tips_online v-if="onlineCfg.autoAuditSwitch != form.AutoAuditSwitch">与线上自动审核开关存在差异：{{ onlineCfg.autoAuditSwitch ? "开" : "关" }}</el-form-item_tips_online>
                <el-form-item_tips_success v-else>与线上自动审核开关一致：{{ onlineCfg.autoAuditSwitch ? "开" : "关" }}</el-form-item_tips_success>
              </el-form-item>

              <el-form-item label="系统单日充提比例">
                <el-input v-model="form.DailyChargingDiffRatio" placeholder="游戏总的提款金额/总充值金额" />
                <el-form-item_tips>游戏总的提款金额/总充值金额，可保留2位小数</el-form-item_tips>
                <el-form-item_tips_online>线上数据：{{ onlineCfg.withdrawAmount / 1000 }} / {{ onlineCfg.rechargeAmount / 1000 }} = {{ (onlineCfg.withdrawAmount / onlineCfg.rechargeAmount * 100).toFixed(2) }}</el-form-item_tips_online>
              </el-form-item>

              <el-form-item label="单通道连续提款失败">
                <el-input v-model="form.FailCount" placeholder="连续提款失败次数" />
                <el-form-item_tips>单通道连续提款失败达到条件会自动切换通道，并且告警</el-form-item_tips>
              </el-form-item>

              <el-form-item label="指定时间段(印度时间)">
                <el-time-picker
                  v-model="timePicker"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </el-form-item>

              <el-form-item label="指定提款金额阀值">
                <el-input v-model="form.AllocAuditMaxAmount" placeholder="指定提款金额阀值" />
              </el-form-item>

              <el-form-item label="自动重试开关">
                <el-switch
                  v-model="form.AutoRetrySwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
              </el-form-item>

            </el-tab-pane>

            <el-tab-pane label="联运发行（galaxy）" name="galaxy">
              <el-form-item label="自动审核开关">
                <el-switch
                  v-model="form.GalaxyAutoAudit.AutoAuditSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
                <el-form-item_tips_online v-if="onlineCfg.autoAuditSwitchGalaxy != form.GalaxyAutoAudit.AutoAuditSwitch">与线上自动审核开关存在差异：{{ onlineCfg.autoAuditSwitchGalaxy ? "开" : "关" }}</el-form-item_tips_online>
                <el-form-item_tips_success v-else>与线上自动审核开关一致：{{ onlineCfg.autoAuditSwitchGalaxy ? "开" : "关" }}</el-form-item_tips_success>
              </el-form-item>

              <el-form-item label="系统单日充提比例">
                <el-input v-model="form.GalaxyAutoAudit.DailyChargingDiffRatio" placeholder="游戏总的提款金额/总充值金额" />
                <el-form-item_tips>游戏总的提款金额/总充值金额，可保留2位小数</el-form-item_tips>
                <el-form-item_tips_online>线上数据：{{ onlineCfg.withdrawAmountGalaxy / 1000 }} / {{ onlineCfg.rechargeAmountGalaxy / 1000 }} = {{ (onlineCfg.withdrawAmountGalaxy / onlineCfg.rechargeAmountGalaxy * 100).toFixed(2) }}</el-form-item_tips_online>
              </el-form-item>

              <el-form-item label="单通道连续提款失败">
                <el-input v-model="form.GalaxyAutoAudit.FailCount" placeholder="连续提款失败次数" />
                <el-form-item_tips>单通道连续提款失败达到条件会自动切换通道，并且告警</el-form-item_tips>
              </el-form-item>

              <el-form-item label="指定时间段(印度时间)">
                <el-time-picker
                  v-model="timePicker2"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </el-form-item>

              <el-form-item label="指定提款金额阀值">
                <el-input v-model="form.GalaxyAutoAudit.AllocAuditMaxAmount" placeholder="指定提款金额阀值" />
              </el-form-item>

              <el-form-item label="自动重试开关">
                <el-switch
                  v-model="form.GalaxyAutoAudit.AutoRetrySwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="联运线下（逆光）" name="99wallets">
              <el-form-item label="自动审核开关">
                <el-switch
                  v-model="form.WalletsAutoAudit.AutoAuditSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
                <el-form-item_tips_online v-if="onlineCfg.autoAuditSwitch99 != form.WalletsAutoAudit.AutoAuditSwitch">与线上自动审核开关存在差异：{{ onlineCfg.autoAuditSwitch99 ? "开" : "关" }}</el-form-item_tips_online>
                <el-form-item_tips_success v-else>与线上自动审核开关一致：{{ onlineCfg.autoAuditSwitch99 ? "开" : "关" }}</el-form-item_tips_success>
              </el-form-item>

              <el-form-item label="系统单日充提比例">
                <el-input v-model="form.WalletsAutoAudit.DailyChargingDiffRatio" placeholder="游戏总的提款金额/总充值金额" />
                <el-form-item_tips>游戏总的提款金额/总充值金额，可保留2位小数</el-form-item_tips>
                <el-form-item_tips_online>线上数据：{{ onlineCfg.withdrawAmount99 / 1000 }} / {{ onlineCfg.rechargeAmount99 / 1000 }} = {{ (onlineCfg.withdrawAmount99 / onlineCfg.rechargeAmount99 * 100).toFixed(2) }}</el-form-item_tips_online>
              </el-form-item>

              <el-form-item label="单通道连续提款失败">
                <el-input v-model="form.WalletsAutoAudit.FailCount" placeholder="连续提款失败次数" />
                <el-form-item_tips>单通道连续提款失败达到条件会自动切换通道，并且告警</el-form-item_tips>
              </el-form-item>

              <el-form-item label="指定时间段(印度时间)">
                <el-time-picker
                  v-model="timePicker3"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </el-form-item>

              <el-form-item label="指定提款金额阀值">
                <el-input v-model="form.WalletsAutoAudit.AllocAuditMaxAmount" placeholder="指定提款金额阀值" />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="TX发行（55）" name="tx">
              <el-form-item label="自动审核开关">
                <el-switch
                  v-model="form.TXAutoAudit.AutoAuditSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开"
                  inactive-text="关"
                />
                <el-form-item_tips_online v-if="onlineCfg.autoAuditSwitchTX != form.TXAutoAudit.AutoAuditSwitch">与线上自动审核开关存在差异：{{ onlineCfg.autoAuditSwitchTX ? "开" : "关" }}</el-form-item_tips_online>
                <el-form-item_tips_success v-else>与线上自动审核开关一致：{{ onlineCfg.autoAuditSwitchTX ? "开" : "关" }}</el-form-item_tips_success>
              </el-form-item>

              <el-form-item label="系统单日充提比例">
                <el-input v-model="form.TXAutoAudit.DailyChargingDiffRatio" placeholder="游戏总的提款金额/总充值金额" />
                <el-form-item_tips>游戏总的提款金额/总充值金额，可保留2位小数</el-form-item_tips>
                <el-form-item_tips_online>线上数据：{{ onlineCfg.withdrawAmountTX / 1000 }} / {{ onlineCfg.rechargeAmountTX / 1000 }} = {{ (onlineCfg.withdrawAmountTX / onlineCfg.rechargeAmountTX * 100).toFixed(2) }}</el-form-item_tips_online>
              </el-form-item>

              <el-form-item label="单通道连续提款失败">
                <el-input v-model="form.TXAutoAudit.FailCount" placeholder="连续提款失败次数" />
                <el-form-item_tips>单通道连续提款失败达到条件会自动切换通道，并且告警</el-form-item_tips>
              </el-form-item>

              <el-form-item label="指定时间段(印度时间)">
                <el-time-picker
                  v-model="timePicker4"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </el-form-item>

              <el-form-item label="指定提款金额阀值">
                <el-input v-model="form.TXAutoAudit.AllocAuditMaxAmount" placeholder="指定提款金额阀值" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>

          <el-divider content-position="left">提现用户标签</el-divider>
          <el-form-item label="单日充值总额">
            <el-input v-model="form.DailyRechargeAmount" />
          </el-form-item>

          <el-form-item label="连续充值笔数">
            <el-input v-model="form.ContinuePayNumber" />
          </el-form-item>

          <el-divider content-position="left">忠实用户标签</el-divider>
          <el-form-item label="充值总金额">
            <el-input v-model="form.LoyalRechargeAmount" />
          </el-form-item>

          <el-form-item label="充值次数">
            <el-input v-model="form.LoyalRechargeCount" />
          </el-form-item>

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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      form: {
        DailyCount: 3, // 单日可提现总次数
        AmountOption: [ // 提现选项配置
          { Money: 100, Ratio: 100, FirstRatio: 0, LoyalRatio: 0, OtherRatio: 0, IsShow: false }
        ],
        NeedPay: true, // 是否首充后才能提现
        DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
        FailCount: 0, // 连续提款失败告警
        // ApplyTimeAfter: 1645515514 * 1000, // 提现申请时间，这个时间之后的提现申请才可以自动过审
        // AuditMaxAmount: 100, // 提现额度,小于等于配置的提现额度才可以自动审核
        // MaxDiff: 100, // 最大提冲差值

        AutoAuditSwitch: true, // 自动审核开关
        DailyRechargeAmount: 5000, // 单日充值总额，用户标签
        ContinuePayNumber: 2, // 连续充值笔数，用户标签
        LoyalRechargeAmount: 20000, // 充值金额，忠实用户标签
        LoyalRechargeCount: 15, // 充值次数，忠实用户标签

        // 指定时间段提款自动审核
        AllocAuditStartTime: 0, // 指定开始时间
        AllocAuditEndTime: 0, // 指定结束时间
        AllocAuditMaxAmount: 0, // 指定提款金额阀值

        AutoRetrySwitch: false,

        // galaxy自动审核
        GalaxyAutoAudit: {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警

          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0, // 指定提款金额阀值

          AutoRetrySwitch: false // 自动重试
        },
        // 联运线下自运营（逆光）
        WalletsAutoAudit: {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警

          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0 // 指定提款金额阀值
        },
        // TX发行
        TXAutoAudit: {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警

          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0 // 指定提款金额阀值
        }
      },
      submitData: {},
      txt: '',
      subKey: 'withdrawCfg',
      onlineCfg: {
        autoAuditSwitch: false,
        withdrawAmount: 0,
        rechargeAmount: 0,

        // galaxy
        autoAuditSwitchGalaxy: true,
        withdrawAmountGalaxy: 0,
        rechargeAmountGalaxy: 0,

        // 逆光
        autoAuditSwitch99: true,
        withdrawAmount99: 0,
        rechargeAmount99: 0,

        // TX
        autoAuditSwitchTX: true,
        withdrawAmountTX: 0,
        rechargeAmountTX: 0
      },

      tabName: 'android',
      timePicker: [new Date(2016, 9, 10, 0, 0).getTime(), new Date(2016, 9, 10, 4, 0).getTime()],
      timePicker2: [new Date(2016, 9, 10, 0, 0).getTime(), new Date(2016, 9, 10, 4, 0).getTime()],
      timePicker3: [new Date(2016, 9, 10, 0, 0).getTime(), new Date(2016, 9, 10, 4, 0).getTime()],
      timePicker4: [new Date(2016, 9, 10, 0, 0).getTime(), new Date(2016, 9, 10, 4, 0).getTime()]
    }
  },
  created() {
    this.getData()
    console.log('vue created')
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case 'android':
          break
        case 'galaxy':
          break
        case '99wallets':
          break
      }
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addOption() {
      this.form.AmountOption.push({
        Money: 0,
        Ratio: 0
      })
    },
    delOption(index) {
      this.form.AmountOption.splice(index, 1)
    },
    getOnlineCfg() {
      console.log('online request ....')
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/withdraw/config'
        }
      }).then(response => {
        console.log('get online withdraw config err', response)
        if (response.RetCode === 0) {
          $this.onlineCfg = response.Data || {}
        }
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
          console.log('get data ', response)
          this.submitData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            // 设置修改之前数据
            const tmpData = JSON.parse(response.Data.Data)
            this.form = this.decodeData(tmpData)
            this.$refs.compare.SetOldVal(tmpData)
          }
          $this.getOnlineCfg()
        }
      })
    },
    decodeData(data) {
      console.log('decode data ', data)
      if (data && !data.GalaxyAutoAudit) {
        data.GalaxyAutoAudit = {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警

          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0, // 指定提款金额阀值
          AutoRetrySwitch: false
        }
      }
      if (data && !data.WalletsAutoAudit) {
        data.WalletsAutoAudit = {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警
          AutoRetrySwitch: false,
          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0 // 指定提款金额阀值
        }
      }

      if (data && !data.TXAutoAudit) {
        data.TXAutoAudit = {
          AutoAuditSwitch: true, // 自动审核开关
          DailyChargingDiffRatio: 0, // 单日最小提充差比例 今日总提现金额/总充值金额 放大100倍
          FailCount: 0, // 连续提款失败告警
          AllocAuditStartTime: 0, // 指定开始时间
          AllocAuditEndTime: 0, // 指定结束时间
          AllocAuditMaxAmount: 0 // 指定提款金额阀值
        }
      }

      const ret = {
        DailyCount: data.DailyCount,
        AmountOption: [],
        NeedPay: data.NeedPay,
        // ApplyTimeAfter: data.ApplyTimeAfter * 1000,
        // AuditMaxAmount: data.AuditMaxAmount / 1000,
        // MaxDiff: data.MaxDiff / 1000,
        FailCount: data.FailCount,
        DailyChargingDiffRatio: data.DailyChargingDiffRatio / 100,
        AutoAuditSwitch: data.AutoAuditSwitch,
        DailyRechargeAmount: data.DailyRechargeAmount / 1000,
        ContinuePayNumber: data.ContinuePayNumber,
        LoyalRechargeAmount: data.LoyalRechargeAmount / 1000,
        LoyalRechargeCount: data.LoyalRechargeCount,

        AllocAuditMaxAmount: data.AllocAuditMaxAmount ? data.AllocAuditMaxAmount / 1000 : 0,

        AutoRetrySwitch: data.AutoRetrySwitch,

        GalaxyAutoAudit: {
          AutoRetrySwitch: data.GalaxyAutoAudit.AutoRetrySwitch,
          FailCount: data.GalaxyAutoAudit.FailCount,
          DailyChargingDiffRatio: data.GalaxyAutoAudit.DailyChargingDiffRatio / 100,
          AutoAuditSwitch: data.GalaxyAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.GalaxyAutoAudit.AllocAuditMaxAmount ? data.GalaxyAutoAudit.AllocAuditMaxAmount / 1000 : 0
        },

        WalletsAutoAudit: {
          FailCount: data.WalletsAutoAudit.FailCount,
          DailyChargingDiffRatio: data.WalletsAutoAudit.DailyChargingDiffRatio / 100,
          AutoAuditSwitch: data.WalletsAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.WalletsAutoAudit.AllocAuditMaxAmount ? data.WalletsAutoAudit.AllocAuditMaxAmount / 1000 : 0
        },

        TXAutoAudit: {
          FailCount: data.TXAutoAudit.FailCount,
          DailyChargingDiffRatio: data.TXAutoAudit.DailyChargingDiffRatio / 100,
          AutoAuditSwitch: data.TXAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.TXAutoAudit.AllocAuditMaxAmount ? data.TXAutoAudit.AllocAuditMaxAmount / 1000 : 0
        }
      }

      // 填充时间选择器
      if (data.AllocAuditStartTime) {
        this.timePicker = [
          (data.AllocAuditStartTime - 9000) * 1000,
          (data.AllocAuditEndTime - 9000) * 1000
        ]
      } else {
        this.timePicker = [
          new Date(2016, 9, 10, 0, 0).getTime(),
          new Date(2016, 9, 10, 4, 30).getTime()
        ]
      }

      // 填充时间选择器
      if (data.GalaxyAutoAudit.AllocAuditStartTime) {
        this.timePicker2 = [
          (data.GalaxyAutoAudit.AllocAuditStartTime - 9000) * 1000,
          (data.GalaxyAutoAudit.AllocAuditEndTime - 9000) * 1000
        ]
      } else {
        this.timePicker2 = [
          new Date(2016, 9, 10, 0, 0).getTime(),
          new Date(2016, 9, 10, 4, 30).getTime()
        ]
      }

      // 填充时间选择器
      if (data.WalletsAutoAudit.AllocAuditStartTime) {
        this.timePicker3 = [
          (data.WalletsAutoAudit.AllocAuditStartTime - 9000) * 1000,
          (data.WalletsAutoAudit.AllocAuditEndTime - 9000) * 1000
        ]
      } else {
        this.timePicker3 = [
          new Date(2016, 9, 10, 0, 0).getTime(),
          new Date(2016, 9, 10, 4, 30).getTime()
        ]
      }

      // 填充时间选择器
      if (data.TXAutoAudit.AllocAuditStartTime) {
        this.timePicker4 = [
          (data.TXAutoAudit.AllocAuditStartTime - 9000) * 1000,
          (data.TXAutoAudit.AllocAuditEndTime - 9000) * 1000
        ]
      } else {
        this.timePicker3 = [
          new Date(2016, 9, 10, 0, 0).getTime(),
          new Date(2016, 9, 10, 4, 30).getTime()
        ]
      }

      for (const i in data.AmountOption) {
        ret.AmountOption.push({
          Money: data.AmountOption[i].Money / 1000,
          Ratio: data.AmountOption[i].Ratio / 100,
          FirstRatio: data.AmountOption[i].FirstRatio / 100,
          OtherRatio: data.AmountOption[i].OtherRatio / 100,
          LoyalRatio: data.AmountOption[i].LoyalRatio / 100,
          IsShow: data.AmountOption[i].IsShow
        })
      }

      ret.AmountOption.sort(function(a, b) {
        return a.Money - b.Money
      })

      console.log('ret', ret)

      return ret
    },
    encodeData(data) {
      const ret = {
        DailyCount: parseInt(data.DailyCount),
        AmountOption: [],
        NeedPay: data.NeedPay,
        // ApplyTimeAfter: parseInt(data.ApplyTimeAfter / 1000),
        // AuditMaxAmount: parseInt(data.AuditMaxAmount) * 1000,
        // MaxDiff: parseInt(data.MaxDiff) * 1000,
        FailCount: parseInt(data.FailCount),
        DailyChargingDiffRatio: parseFloat(data.DailyChargingDiffRatio) * 100,
        AutoAuditSwitch: data.AutoAuditSwitch,
        DailyRechargeAmount: parseInt(data.DailyRechargeAmount) * 1000,
        ContinuePayNumber: parseInt(data.ContinuePayNumber),
        LoyalRechargeAmount: parseInt(data.LoyalRechargeAmount) * 1000,
        LoyalRechargeCount: parseInt(data.LoyalRechargeCount),
        AllocAuditMaxAmount: data.AllocAuditMaxAmount * 1000,
        AllocAuditStartTime: parseInt(this.timePicker[0] / 1000) + 9000,
        AllocAuditEndTime: parseInt(this.timePicker[1] / 1000) + 9000,
        AutoRetrySwitch: data.AutoRetrySwitch,

        GalaxyAutoAudit: {
          AutoRetrySwitch: data.GalaxyAutoAudit.AutoRetrySwitch,
          FailCount: parseInt(data.GalaxyAutoAudit.FailCount),
          DailyChargingDiffRatio: parseFloat(data.GalaxyAutoAudit.DailyChargingDiffRatio) * 100,
          AutoAuditSwitch: data.GalaxyAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.GalaxyAutoAudit.AllocAuditMaxAmount * 1000,
          AllocAuditStartTime: parseInt(this.timePicker2[0] / 1000) + 9000,
          AllocAuditEndTime: parseInt(this.timePicker2[1] / 1000) + 9000
        },

        WalletsAutoAudit: {
          FailCount: parseInt(data.WalletsAutoAudit.FailCount),
          DailyChargingDiffRatio: parseFloat(data.WalletsAutoAudit.DailyChargingDiffRatio) * 100,
          AutoAuditSwitch: data.WalletsAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.WalletsAutoAudit.AllocAuditMaxAmount * 1000,
          AllocAuditStartTime: parseInt(this.timePicker3[0] / 1000) + 9000,
          AllocAuditEndTime: parseInt(this.timePicker3[1] / 1000) + 9000
        },

        TXAutoAudit: {
          FailCount: parseInt(data.TXAutoAudit.FailCount),
          DailyChargingDiffRatio: parseFloat(data.TXAutoAudit.DailyChargingDiffRatio) * 100,
          AutoAuditSwitch: data.TXAutoAudit.AutoAuditSwitch,
          AllocAuditMaxAmount: data.TXAutoAudit.AllocAuditMaxAmount * 1000,
          AllocAuditStartTime: parseInt(this.timePicker4[0] / 1000) + 9000,
          AllocAuditEndTime: parseInt(this.timePicker4[1] / 1000) + 9000
        }
      }

      for (const i in this.form.AmountOption) {
        ret.AmountOption.push({
          Money: parseInt(data.AmountOption[i].Money) * 1000,
          Ratio: parseInt(parseFloat(data.AmountOption[i].Ratio) * 100),
          FirstRatio: parseInt(parseFloat(data.AmountOption[i].FirstRatio) * 100),
          OtherRatio: parseInt(parseFloat(data.AmountOption[i].OtherRatio) * 100),
          LoyalRatio: parseInt(parseFloat(data.AmountOption[i].LoyalRatio) * 100),
          IsShow: data.AmountOption[i].IsShow
        })
      }

      return ret
    },
    sortOption() {
      this.form.AmountOption.sort(function(a, b) {
        return a.Money - b.Money
      })
    },
    setData() {
      const $this = this
      const data = this.encodeData(this.form)
      console.log('set data', data)

      // 设置修改后数据
      this.$refs.compare.SetNewVal(data)
      this.$refs.compare.Compare(function(isEdit) {
        // if (!isEdit) {
        //   Message.error('没有任何修改，不需要提交')
        //   return
        // }
        const submitData = $this.submitData
        submitData.Data = JSON.stringify(data)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: submitData
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('withdraw save', response)
            Message.success('保存成功')
            $this.sortOption()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
el-form-item_tips {
  display: block;
  font-size: 12px;
  color: #666;
}
el-form-item_tips_online {
  display: block;
  color: red;
}
el-form-item_tips_success {
  display: block;
  color: green;
}
</style>
