<template>
  <div class="app-container">
    <el-row>
      <publish
        v-if="hasEditPerm"
        primary-key="ID"
        :key-id="getFullKey()"
        :env-empty="false"
        compare-type="Object"
        :attr-names="AttrNames"
      />
    </el-row>
    <el-row>
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="测试UID：">
              <el-input v-model="testUid" size="mini" />
            </el-form-item>
          </el-col>
          <el-button size="mini" @click="testUidMethod()">测试</el-button>
          {{ testRet }}
          <el-button type="success" size="mini" style="float: right" @click="refresh">刷新</el-button>
        </el-row>
        <fieldset v-for="info,k1 in item" v-if="k1!='UpdateTime'">
          <legend>{{ k1 == "Pay" ? '支付配置' : '提现配置' }}</legend>
          <el-row>
            <el-form-item label="默认通道：">
              <el-select v-model.number="info.Default" placeholder="请选择">
                <el-option
                  v-for="chl in info.Rules"
                  :label="getChannelName(chl.Channel)"
                  :value="chl.Channel"
                />
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="指定Uid：">
              <el-switch
                v-model="info.OpenUid"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item v-if="info.OpenUid" label="Uid通道：">
              <el-select v-model.number="info.UidChannel" placeholder="请选择">
                <el-option
                  v-for="chl in info.Rules"
                  :label="getChannelName(chl.Channel)"
                  :value="chl.Channel"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item v-if="info.OpenUid" label="指定UID：">
              <el-input v-model="info.Content" type="textarea" :rows="3" :autosize="true" placeholder="多个按 , 隔开" />
            </el-form-item>
          </el-row>
          <el-form-item label="详情：">
            <span v-if="!hasDiff&&k1=='Pay'" style="color:green">与线上配置无差异</span>
            <span v-if="hasDiff&&k1=='Pay'" style="color:red">与线上配置存在差异</span>

            <span v-if="!withdrawDiff&&k1=='Withdraw'" style="color:green">与线上配置无差异</span>
            <span v-if="withdrawDiff&&k1=='Withdraw'" style="color:red">与线上配置存在差异</span>

            <el-table
              ref="filterTable"
              :data="info.Rules"
              border
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                prop="Sort"
                label="排序"
                width="120"
              >
                <template slot-scope="scope">
                  {{ scope.row.Sort }}
                  <el-button
                    v-if="scope.row.Sort!==1"
                    size="mini"
                    style="padding-left: 15px"
                    type="text"
                    class="el-icon-top"
                    @click="sortUp(scope.row,k1)"
                  />
                  <el-button
                    v-if="scope.row.Sort!=info.Rules.length"
                    size="mini"
                    style="padding-left: 15px"
                    type="text"
                    class="el-icon-bottom"
                    @click="sortDown(scope.row,k1)"
                  />

                </template>
              </el-table-column>
              <el-table-column
                prop="Channel"
                label="通道"
                width="150"
              >
                <template slot-scope="scope">
                  <span :style="{color:scope.row.OK===1?'green':'red'}">{{ getChannelName(scope.row.Channel) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="支持额度"
                width="100"
              >
                <template slot-scope="scope">
                  {{ getAvailAmount(scope.row.Channel, k1) }}
                </template>
              </el-table-column>
              <el-table-column
                label="费率"
                width="70"
              >
                <template slot-scope="scope">
                  {{ getChannelRate(scope.row.Channel, k1) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Open"
                label="打开"
                width="70"
              >
                <template slot-scope="scope">
                  {{ scope.row.Open ? '是' : '否' }}<span style="color:red">{{
                    scope.row.OpenDiff
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="OK"
                label="可用"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="16">
                    <span v-if="scope.row.Open">可用</span>
                    <el-select v-else v-model="scope.row.OK" size="mini" @change="sortData(k1)">
                      <el-option label="可用" :value="1" />
                      <el-option label="关闭" :value="0" />
                      <!--                      <el-option label="指定金额" :value="2" />-->
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <span style="color:red">{{ scope.row.OKDiff }}</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="Percent"
                label="比例"
                width="200"
              >
                <template v-if="scope.row.OK!=2" slot-scope="scope">
                  <el-col :span="12">
                    <el-input v-model.number="scope.row.Percent" size="mini" @change="RuleChanged(scope.row, k1)" />
                  </el-col>
                  <el-col :span="12">
                    <span style="color:red">{{ scope.row.PercentDiff }}</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="RuleDesc"
                label="尾号"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Open">{{ scope.row.RuleDesc }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="k1=='Withdraw'"
                prop="Amounts"
                label="优先金额"
                width="200"
              >
                <template slot="header">
                  支持代付金额
                  <el-tooltip class="item" effect="dark" content="不选择支持所有代付金额。选择代付金额后，该渠道只支持选择的代付金额" placement="right">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
                <template v-if="scope.row.OK==1" slot-scope="scope">
                  <el-select v-model="scope.row.Amounts" size="mini" multiple @change="amountsChanged(scope.row)">
                    <el-option v-for="o in withdrawAmounts" :label="o/1000" :value="o" />
                  </el-select>
                </template>
              </el-table-column>

            </el-table>
          </el-form-item>
        </fieldset>
        <el-form-item>
          <el-button v-if="hasEditPerm" type="primary" @click="confirmVisible=true">保存</el-button>
          <el-button @click="showLog(1)">日志</el-button>
        </el-form-item>

      </el-form>
    </el-row>
    <el-dialog
      title="修改记录"
      :visible.sync="logVisible"
      width="60%"
    >
      <el-tabs v-model="activeName" type="border-card" @tab-click="showLog">
        <el-tab-pane label="代收" name="1" />
        <el-tab-pane label="代付" name="2" />
      </el-tabs>
      <el-table
        :data="logs"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          prop="Key"
          label="日期"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="User"
          label="修改人"
          width="100"
        />
        <el-table-column
          prop="Reason"
          label="原因"
          width="300"
        />
        <el-table-column
          prop="Data"
          label="内容"
          width="600"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.Data" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="修改原因"
      :visible.sync="confirmVisible"
      width="40%"
      center
    >
      <el-input v-model="reason" type="textarea" placeholder="请填写修改原因" rows="10" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import store from '@/store'
import { $libDate, $libShow, DataRule } from '@/utils/common'
import { toRupee } from '@/utils'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      confirmVisible: false,
      reason: '',
      activeName: '1',
      onlineCfg: {},
      onlineWithdrawCfg: {},
      hasDiff: false,
      withdrawDiff: false,
      withdrawAmounts: [100000, 300000, 500000, 1000000, 3000000, 5000000, 10000000, 20000000],
      item: {
        Pay: {
          'RuleType': 1, // 1全量 2部分用户
          'OpenUid': false,
          UidChannel: 3,
          'Content': '', // 全量空， 部分用户：数字  指定用户uid：%
          'Default': 3, // 支付渠道
          'Rules': [
            {
              'Channel': 3,
              'Open': false,
              'Percent': 30
            },
            {
              'Channel': 4,
              'Open': false,
              'Percent': 30
            }]
        },
        Withdraw: {
          'RuleType': 1, // 1全量 2部分用户
          'OpenUid': false,
          UidChannel: 3,
          'Content': '', // 全量空， 部分用户：数字  指定用户uid：%
          'Default': 3, // 支付渠道
          'Rules': [
            {
              'Channel': 3,
              'Open': false,
              'Percent': 30
            },
            {
              'Channel': 4,
              'Open': false,
              'Percent': 30
            }]
        }
      },
      form: {},
      testUid: 0,
      testRet: '',
      txt: '',
      hasEditPerm: false,
      logs: [],
      logVisible: false,
      libShow: $libShow,
      oldData: {},

      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },

      subKey: 'pay_toggle_',
      platform: 'android',
      channels: []
    }
  },
  created() {
    console.log(1)
    const pers = store.getters.pers
    this.platform = this.$route.meta.platform
    this.hasEditPerm = (pers['SWITCH_PAY_METHOD'] & 2) > 0
    this.getChannels()
    this.initAttrNames()
  },
  methods: {
    refresh() {
      // this.$router.go(0)
      this.getChannels()
      this.$message.success('刷新成功')
    },
    amountsChanged(ob) {
      console.log(ob.Amounts)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getOpenDiff(item, sType) {
      this.hasDiff = false
      this.withdrawDiff = false
      for (let i = 0; i < item.Pay.Rules.length; i++) {
        const ob = item.Pay.Rules[i]
        if (sType === 'Pay') {
          if (this.onlineCfg[ob.Channel] && this.onlineCfg[ob.Channel].Open !== ob.Open) {
            ob.OpenDiff = '>>' + (this.onlineCfg[ob.Channel].Open ? '是' : '否')
            console.log(this.getChannelName(ob.Channel) + ':' + ob.OpenDiff)
            this.hasDiff = true
          }

          if (this.onlineCfg[ob.Channel] && this.onlineCfg[ob.Channel].OK !== ob.OK) {
            ob.OKDiff = '>>' + (this.onlineCfg[ob.Channel].OK ? '开' : '关')
            console.log(this.getChannelName(ob.Channel) + ':' + ob.OKDiff)
            this.hasDiff = true
          }

          if (this.onlineCfg[ob.Channel] && this.onlineCfg[ob.Channel].Percent !== ob.Percent) {
            ob.PercentDiff = '>>' + this.onlineCfg[ob.Channel].Percent
            console.log(this.getChannelName(ob.Channel) + ':' + ob.PercentDiff)
            this.hasDiff = true
          }
        }
      }

      console.log('item withdraw rules', item.Withdraw.Rules)
      for (let i = 0; i < item.Withdraw.Rules.length; i++) {
        const ob2 = item.Withdraw.Rules[i]
        if (sType === 'Withdraw') {
          if (this.onlineWithdrawCfg[ob2.Channel] && this.onlineWithdrawCfg[ob2.Channel].Open !== ob2.Open) {
            ob2.OpenDiff = '>>' + (this.onlineWithdrawCfg[ob2.Channel].Open ? '是' : '否')
            console.log(this.getChannelName(ob2.Channel) + ':' + ob2.OpenDiff)
            this.withdrawDiff = true
          }

          if (this.onlineWithdrawCfg[ob2.Channel] && this.onlineWithdrawCfg[ob2.Channel].OK !== ob2.OK) {
            ob2.OKDiff = '>>' + (this.onlineWithdrawCfg[ob2.Channel].OK ? '开' : '关')
            console.log(this.getChannelName(ob2.Channel) + ':' + ob2.OKDiff)
            this.withdrawDiff = true
          }

          if (this.onlineWithdrawCfg[ob2.Channel] && this.onlineWithdrawCfg[ob2.Channel].Percent !== ob2.Percent) {
            ob2.PercentDiff = '>>' + this.onlineWithdrawCfg[ob2.Channel].Percent
            console.log(this.getChannelName(ob2.Channel) + ':' + ob2.PercentDiff)
            this.withdrawDiff = true
          }
        }
      }
    },
    sortUp(ob, sType) {
      // console.log("ob", ob, sType)
      const rules = this.item[sType].Rules
      if (ob.Sort !== 1) {
        for (let i = 0; i < rules.length; i++) {
          if (ob.Sort === rules[i].Sort) {
            rules[i].Sort--
            rules[i - 1].Sort++
            break
          }
        }
      }
      this.sortData(sType)
    },
    sortDown(ob, sType) {
      const rules = this.item[sType].Rules
      if (ob.Sort !== rules.length) {
        for (let i = 0; i < rules.length; i++) {
          if (ob.Sort === rules[i].Sort) {
            rules[i].Sort++
            rules[i + 1].Sort--
            break
          }
        }
      }
      this.sortData(sType)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Open) {
        return 'success-row'
      } else {
        return ''
      }
    },
    initAttrNames() {
      this.AttrNames['Data.Pay.Default'] = '默认支付通道'
      this.AttrNames['Data.Pay.RuleType'] = '支付规则'
      this.AttrNames['Data.Pay.OpenUid'] = '支付指定Uid'
      this.AttrNames['Data.Withdraw.Default'] = '默认提现通道'
      this.AttrNames['Data.Withdraw.RuleType'] = '提现规则'
      this.AttrNames['Data.Withdraw.OpenUid'] = '提现指定Uid'
      this.AttrNames['Data.Pay.UidChannel'] = '支付指定Uid渠道'
    },
    getChannelName(ID) {
      for (const i in this.channels) {
        if (this.channels[i].ID == ID) {
          return this.channels[i].Name
        }
      }
      return '错误'
    },
    getAvailAmount(ID, Type) {
      if (Type !== 'Pay') {
        return
      }

      // console.log("id", ID, "type", Type)
      // console.log("channels", this.channels)
      for (const i in this.channels) {
        const chan = this.channels[i]
        if (chan.ID == ID) {
          if (chan.MinAmount > 0 && chan.MaxAmount > 0) {
            return '[' + toRupee(chan.MinAmount) + ',' + toRupee(chan.MaxAmount) + ']'
          } else if (chan.MaxAmount > 0 && chan.MinAmount == 0) {
            return '[0,' + toRupee(chan.MaxAmount) + ']'
          } else if (chan.MinAmount > 0 && chan.MaxAmount == 0) {
            return '[' + toRupee(chan.MinAmount) + ',∞]'
          } else {
            return '∞'
          }
        }
      }
      return ''
    },
    getChannelRate(ID, Type) {
      for (const i in this.channels) {
        if (this.channels[i].ID == ID) {
          if (Type == 'Pay') {
            return this.channels[i].PayFee
          } else {
            return this.channels[i].WithdrawFee
          }
        }
      }
      return ''
    },
    testUidMethod() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Uid: this.testUid,
          Path: '/user/pay/method',
          Plat: this.platform == 'galaxy' ? 100002 : 2
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.testRet = '测试结果：    支付通道：  ' + this.getChannelName(response.Data.Pay) + '，   提现通道：  ' + this.getChannelName(response.Data.Withdraw)
        }
      })
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.getSubKey()
    },
    getSubKey() {
      return this.subKey + this.platform
    },
    RuleChanged(ob, k1) {
      if (ob.Percent < 0 || ob.Percent > 100) {
        Message.error('请输入0-100之间的数字')
      }
      if (ob.Percent === 0) {
        ob.Open = false
        this.sortData(k1)
      } else {
        ob.Open = true
        ob.OK = 1
        this.sortData(k1)
      }
    },
    sortData(k1) {
      this.item[k1].Rules.sort(function(a, b) {
        if (a.Open != b.Open) {
          if (a.Open) {
            return -1
          } else {
            return 1
          }
        }

        if (a.OK === b.OK) {
          return a.Sort - b.Sort
        } else {
          if (a.OK === 1) {
            return -1
          } else {
            return 1
          }
        }
      })

      const rules = this.item[k1].Rules
      for (let i = 0; i < rules.length; i++) {
        rules[i].Sort = i + 1
      }

      let begin = 0
      for (let i = 0; i < rules.length; i++) {
        if (this.item[k1].Rules[i].Open) {
          this.item[k1].Rules[i].RuleDesc = begin + ' 至 ' + (begin + this.item[k1].Rules[i].Percent - 1)
          begin += this.item[k1].Rules[i].Percent
        }
      }
    },
    getOnlineConfig() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/pay/config',
          Platform: this.platform
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const item = response.Data || {}
          for (const o in item.Pay.Rules) {
            const ob = item.Pay.Rules[o]
            $this.onlineCfg[ob.Channel] = ob
          }

          for (const o in item.Withdraw.Rules) {
            const ob2 = item.Withdraw.Rules[o]
            $this.onlineWithdrawCfg[ob2.Channel] = ob2
          }
          $this.getData()
        }
      })
    },
    getChannels() {
      const $this = this
      request({
        url: '/payconfig/all',
        method: 'get',
        data: {
          Type: 2,
          Platform: this.platform
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data || []
          $this.channels = []
          for (const i in items) {
            $this.channels.push({
              Plat: items[i].platform,
              ID: items[i].payChannel,
              Name: items[i].payChannelName,
              PayFee: items[i].payFee,
              WithdrawFee: items[i].withdrawFee,
              MinAmount: items[i].minAmount,
              MaxAmount: items[i].maxAmount
            })
          }
          $this.getOnlineConfig()
        }
      })
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.getSubKey()
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('get data ', response)
          this.form = response.Data || {}
          let item = {}
          if (response.Data && response.Data.Data !== '') {
            try {
              item = JSON.parse(response.Data.Data)
            } catch (e) {
              console.log(response.Data.Data)
              return
            }

            // 检查是否有新的支付方式
            // console.log('请求提现渠道', item)
            const plat = item
            const flags = {}
            for (const n in plat.Pay.Rules) {
              plat.Pay.Rules[n].PercentDiff = ''
              plat.Pay.Rules[n].OKDiff = ''
              plat.Pay.Rules[n].OpenDiff = ''
              flags[plat.Pay.Rules[n].Channel] = true
            }
            const txFlags = {}
            for (const n in plat.Withdraw.Rules) {
              plat.Withdraw.Rules[n].PercentDiff = ''
              plat.Withdraw.Rules[n].OKDiff = ''
              plat.Withdraw.Rules[n].OpenDiff = ''
              txFlags[plat.Withdraw.Rules[n].Channel] = true
            }
            // 找到不存在的新支付，加入到可选列表中
            for (const n in $this.channels) {
              const channel = $this.channels[n]
              if (channel.Plat === this.platform && !flags[channel.ID]) {
                plat.Pay.Rules.push({ Channel: channel.ID, Open: false, Percent: 0 })
              }
              if (channel.Plat === this.platform && !txFlags[channel.ID]) {
                plat.Withdraw.Rules.push({ Channel: channel.ID, Open: false, Percent: 0 })
              }
            }

            // 检查是否有多出的不合法的支付通道配置
            const allChannels = {}
            for (const n in $this.channels) {
              const channel = $this.channels[n]
              allChannels[channel.ID] = true
            }

            console.log('提现渠道', plat.Withdraw)
            for (let i = 0; i < plat.Pay.Rules.length; i++) {
              if (!allChannels[plat.Pay.Rules[i].Channel]) {
                plat.Pay.Rules.splice(i, 1)
                // plat.Withdraw.Rules.splice(i, 1)
                i--
              }
            }

            for (let i = 0; i < plat.Withdraw.Rules.length; i++) {
              if (!allChannels[plat.Withdraw.Rules[i].Channel]) {
                console.log('不存在的提现渠道剔除', plat.Withdraw.Rules[i].Channel)
                // plat.Pay.Rules.splice(i, 1)
                plat.Withdraw.Rules.splice(i, 1)
                i--
              }
            }

            $this.getOpenDiff(item, 'Pay')
            $this.getOpenDiff(item, 'Withdraw')
            $this.item = item

            console.log('item ', item)

            this.sortData('Pay')
            this.sortData('Withdraw')
            // 设置修改之前数据
            const old = this.sortArrayForComapre(response.Data)
            this.oldData = old.Data
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    sortArrayForComapre(data) {
      const item = JSON.parse(data.Data)
      item.Pay.Rules.sort(function(a, b) {
        return a.Channel - b.Channel
      })
      for (const o in item.Pay.Rules) {
        item.Pay.Rules[o]['渠道'] = this.getChannelName(item.Pay.Rules[o].Channel)
      }
      item.Withdraw.Rules.sort(function(a, b) {
        return a.Channel - b.Channel
      })
      for (const o in item.Withdraw.Rules) {
        item.Withdraw.Rules[o]['渠道'] = this.getChannelName(item.Withdraw.Rules[o].Channel)
      }
      data.Data = JSON.stringify(item)
      return data
    },
    checkValid() {
      const plat = this.item
      for (const k in plat) {
        if (k == 'UpdateTime') {
          continue
        }
        const method = plat[k]
        let totalPercent = 0
        let hasString = false
        for (const n in method.Rules) {
          if (method.Rules[n].Percent === '') {
            console.log('percent ', method.Rules[n].Percent)
            hasString = true
            break
          }
          if (method.Rules[n].Open) {
            totalPercent += method.Rules[n].Percent
          }
        }
        if (hasString) {
          Message.error('比例必须填写数字')
          return false
        }
        if (totalPercent != 100) {
          Message.error(k + ',比例之和必须等于100')
          return false
        }
      }
      return true
    },
    showLog() {
      request({
        url: '/payconfig/logs',
        method: 'get',
        data: {
          Platform: this.platform,
          Type: this.activeName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.logs = response.Data || []
          this.logVisible = true
        }
      })
    },
    saveLog() {
      const $this = this
      request({
        url: '/payconfig/log/add',
        method: 'post',
        data: {
          NewData: JSON.stringify(this.item),
          OldData: this.oldData,
          Platform: this.platform,
          Reason: this.reason
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存日志成功')
          $this.confirmVisible = false
        }
      })
    },
    setData() {
      if (!this.checkValid()) return
      if (this.reason == '') {
        Message.error('请填写修改原因')
        return
      }
      this.item.UpdateTime = Math.floor(new Date().getTime() / 1000)
      const item = JSON.parse(JSON.stringify(this.item))
      for (let i = 0; i < item.Pay.Rules.length; i++) {
        item.Pay.Rules[i].PercentDiff = ''
        item.Pay.Rules[i].OpenDiff = ''
        item.Pay.Rules[i].OKDiff = ''
      }
      for (let i = 0; i < item.Withdraw.Rules.length; i++) {
        item.Withdraw.Rules[i].PercentDiff = ''
        item.Withdraw.Rules[i].OpenDiff = ''
        item.Withdraw.Rules[i].OKDiff = ''
      }
      this.form.Data = JSON.stringify(item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.sortArrayForComapre(this.form))
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
            $this.saveLog()
          }
        })
      })
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
