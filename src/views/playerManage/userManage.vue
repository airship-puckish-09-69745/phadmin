<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="6" :offset="2">
          <el-form-item label="UID：" :required="true">
            <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :offset="1" :span="22">
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="金币总数：">{{ formatNumber(item.LimitedMoney + item.FreeMoney) }}</el-descriptions-item>
          <el-descriptions-item label="Winning："> {{ formatNumber(item.FreeMoney) }}</el-descriptions-item>
          <el-descriptions-item label="Deposited：" :span="hasEditPerm?1:2">{{ formatNumber(item.LimitedMoney) }}</el-descriptions-item>
          <el-descriptions-item v-if="hasEditPerm" label="加钱：">
            <el-col :span="4">
              <el-select v-model.number="moneyType" size="mini" placeholder="请选择">
                <el-option label="Deposit" :value="1" />
                <el-option label="Winning" :value="2" />
                <el-option label="基础值" :value="3" />
                <el-option label="Bonus" :value="8" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-row v-if="money!=0"><span>{{ formatNumber(money) }}</span></el-row>
              <el-input v-model.number="money" size="mini" />
            </el-col>
            <el-col :span="6" :offset="1">
              <el-button type="primary" size="mini" @click="saveMoney">提交</el-button>
            </el-col>
          </el-descriptions-item>

          <el-descriptions-item label="系列：">{{ item.AppID > 100000?'Galaxy':'Android' }}</el-descriptions-item>
          <el-descriptions-item label="AppID：">{{ item.AppID }}</el-descriptions-item>
          <el-descriptions-item label="来源Appid：">{{ showSourceAppid(item.SourceAppid) }}</el-descriptions-item>
          <el-descriptions-item label="注册时间："><DateTimeShow :show-type="2" :timestamp="item.RegisterTime" /></el-descriptions-item>
          <el-descriptions-item label="最近登录时间："><DateTimeShow :show-type="2" :timestamp="item.LastLoginTime" /></el-descriptions-item>

<!--          <el-descriptions-item label="Bonus：">{{ item.BonusTotal }}</el-descriptions-item>
          <el-descriptions-item label="Bonus可提："> {{ item.BonusValid }}</el-descriptions-item>
          <el-descriptions-item label="存钱罐累积：">{{ item.Gullak }}</el-descriptions-item>
          <el-descriptions-item label="存钱罐Lv：">{{ item.GullakLevel }}</el-descriptions-item>-->

<!--          <el-descriptions-item label="充值额：">
            {{ formatNumber(item.PayValue) }}
            <el-button v-if="item.PayValue==0" type="primary" size="mini" @click="setUserPay">加0.001</el-button>
            <el-button v-if="item.PayValue==0.001" type="primary" size="mini" @click="setUserPay2">加100</el-button>
            <el-button type="danger" size="mini" @click="clearFirstPayFlag">清除首充状态</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="单笔最大充值额度：">
            {{ item.MaxPayAmount | toRupee | numberFormat }}
          </el-descriptions-item>
          <el-descriptions-item label="充值次数：">
            {{ item.PayCount }}
          </el-descriptions-item>
          <el-descriptions-item label="信用分：">
            <span v-if="item.CreditScore<0" style="color:red">{{ item.CreditScore }}</span>
            <span v-else>{{ item.CreditScore }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="提现额：">
            {{ item.Withdraw/1000 }} / {{ item.CanWithdrawAmount / 1000 }}
          </el-descriptions-item>
          <el-descriptions-item label="提现次数：">
            {{ item.WithdrawCount }}
          </el-descriptions-item>
          <el-descriptions-item label="提现中：">
            {{ item.Withdrawing/1000 }}
          </el-descriptions-item>-->

          <!--          <el-descriptions-item label="邀请人数：">-->
          <!--            {{ item.InviteCount }}-->
          <!--          </el-descriptions-item>-->
          <!--          <el-descriptions-item label="邀请总奖励：">-->
          <!--            {{ item.InviteTotalPrize/1000 }}-->
          <!--          </el-descriptions-item>-->
          <!--          <el-descriptions-item label="已领取邀请奖励：">-->
          <!--            {{ (item.InviteTotalPrize - item.InvitePrize)/1000 }}-->
          <!--          </el-descriptions-item>-->
          <el-descriptions-item label="小黑屋标志">
            <el-tag v-if="item.SchemaXMan > 0" type="danger">是({{ item.SchemaXMan }})</el-tag>
            <el-tag v-else>否</el-tag>
            <el-button v-if="item.SchemaXMan > 0" type="default" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(0)">取消标志</el-button>
            <el-button v-if="item.SchemaXMan != 1" type="primary" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(1)">设置标志(1)</el-button>
            <el-button v-if="item.SchemaXMan != 2" type="primary" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(2)">设置专享标志(2)</el-button>
          </el-descriptions-item>

          <el-descriptions-item label="最近登录IP：">{{ item.Ip }}</el-descriptions-item>
          <el-descriptions-item label="最近登录设备码：">{{ item.DeviceCode }}</el-descriptions-item>

          <el-descriptions-item label="基础值："> {{ formatNumber(item.BaseValue) }}</el-descriptions-item>
          <el-descriptions-item label="贡献值：">{{ formatNumber(item.ProduceValue) }}</el-descriptions-item>

          <el-descriptions-item label="幸运值：" span="2">
            <el-col :span="12">
              {{ luckValue }}
            </el-col>
            <el-col :span="12">
              <el-button size="mini" type="success" @click="edit.visible=true">详情</el-button>
            </el-col>
          </el-descriptions-item>

          <el-descriptions-item label="是否绑定手机号："><el-tag :type="item.IsBindPhone ? 'success' : 'danger'">{{ formatBool(item.IsBindPhone) }}</el-tag>{{ item.Phone }}</el-descriptions-item>
          <el-descriptions-item label="账号类型：">{{ formatAccountType(item.AccountType) }}</el-descriptions-item>

          <el-descriptions-item label="登录账号：">{{ item.Account }}</el-descriptions-item>
          <!--          <el-descriptions-item label="邀请码：">{{ item.InviteCode }}</el-descriptions-item>-->
          <el-descriptions-item label="绑定邮箱：">
            <template v-if="!mailEditable">
              {{ item.Email }}<el-button size="mini" @click="mailEditable=true">修改</el-button>
            </template>
            <template v-else>
              <el-input v-model="item.Email" size="mini" /> <el-button size="mini" type="primary" @click="updateMail">修改</el-button>
            </template>

          </el-descriptions-item>
<!--          <el-descriptions-item label="持卡人：">{{ item.CardHolderName }}</el-descriptions-item>
          <el-descriptions-item label="提现方式：">{{ formatBankCode(item.ProxyBankCode) }}</el-descriptions-item>
          <el-descriptions-item label="账号IFSC：">{{ item.BankName }}</el-descriptions-item>
          <el-descriptions-item label="提现账号：">{{ item.AccountNo }}</el-descriptions-item>-->

          <el-descriptions-item label="头像："><el-popover
            v-if="item.Icon.length > 5"
            placement="right"
            width="400"
            trigger="click"
          >
            <img :src="getImgUrl">
            <img slot="reference" :src="getImgUrl" height="300">
          </el-popover>
          </el-descriptions-item>
          <el-descriptions-item label="昵称：">{{ item.Nick }}
            <el-button v-if="hasCustomerPerm" size="mini" @click="customerRedhot">客服红点</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="语言："> {{ item.Language=='en'?'英文':'印地' }}</el-descriptions-item>

          <el-descriptions-item v-if="hasEditPerm" label="账号状态：">
            <el-tag v-if="item.Status == 1" type="danger">禁用</el-tag>
            <el-tag v-else type="success">正常</el-tag>
            <el-button v-if="item.Status == 1" type="default" size="mini" style="margin-left: 10px;" @click="disableUser(0)">恢复</el-button>
            <el-button v-else type="danger" size="mini" style="margin-left: 10px;" @click="disableUser(1)">禁用</el-button>
          </el-descriptions-item>

          <el-descriptions-item label="用户标签：" :span="3">
            <el-tag
              v-for="tag in UserTags"
              :key="tag.Tag"
              effect="dark"
              closable
              :type="showTagType(tag.Color)"
              :disable-transitions="false"
              @click="clickEditTag(tag.ID)"
              @close="delTag(tag.ID)"
            >
              {{ tag.Tag }}
            </el-tag>
            <el-button class="button-new-tag" size="small" @click="clickAddTag">+ 新标签</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="调控结果：">
            <el-tag :type="paySchemaResultColor">{{ item.PaySchema.ResultName }}</el-tag>
            <el-button size="mini" type="primary" style="margin-left: 10px" @click="setSchemaResult">修改</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="Winnings控制线：">
            {{ item.PaySchema.WinningsLine | toRupee }}
          </el-descriptions-item>
          <el-descriptions-item label="调控轮数：">
            {{ item.PaySchemaRound }}
          </el-descriptions-item>
<!--          <el-descriptions-item label="本轮总充值：">
            {{ item.PaySchema.RechargeAmount | toRupee }}
          </el-descriptions-item>
          <el-descriptions-item label="本轮总提现：">
            {{ item.PaySchema.WithdrawAmount | toRupee }}
          </el-descriptions-item>-->
          <el-descriptions-item label="赢标签：">
            {{ item.PaySchema.WinTagCnt }}
          </el-descriptions-item>
          <el-descriptions-item label="输标签：">
            {{ item.PaySchema.LoseTagCnt }}
          </el-descriptions-item>
          <el-descriptions-item label="是否设置登录密码：">
            <el-tag :type="item.IsSetLoginPwd ? 'success' : 'danger'">{{ formatBool(item.IsSetLoginPwd) }}</el-tag>
          </el-descriptions-item>
<!--          <el-descriptions-item label="是否设置支付密码：">
            <el-tag :type="item.IsSetPayPwd ? 'success' : 'danger'">{{ formatBool(item.IsSetPayPwd) }}</el-tag>
          </el-descriptions-item>-->
        </el-descriptions>

        <!--新邀请分享-->
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="邀请等级：">{{ showInviteLevel(item.InviteLevel) }}</el-descriptions-item>
          <el-descriptions-item label="邀请人数：">{{ item.InviteCount }}</el-descriptions-item>
          <el-descriptions-item label="邀请码：">{{ item.InviteCode }}</el-descriptions-item>
          <el-descriptions-item label="邀请当前余额：">{{ item.InviteBalance | toRupee }}</el-descriptions-item>
          <el-descriptions-item label="邀请当前可提余额：">{{ item.InviteWithdraw | toRupee }}</el-descriptions-item>
          <el-descriptions-item label="邀请提现中：">{{ item.InviteWithdrawProcess | toRupee }}</el-descriptions-item>
          <el-descriptions-item label="已提现金额：">{{ item.InviteWithdrawSuccess | toRupee }}</el-descriptions-item>
          <el-descriptions-item label="累计获得收益：">
            <el-descriptions
              class="margin-top"
              :column="1"
              size="mini"
              :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
              border
            >
              <el-descriptions-item v-for="(val, source) in item.InviteCommissionMap" v-if="checkSource(source)" :label="showSource(source)">{{ val | toRupee }}</el-descriptions-item>
              <el-descriptions-item label="总收益">{{ item.InviteTotalCommission | toRupee }}</el-descriptions-item>
            </el-descriptions>

          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>

    <!--    修改调控结果-->
    <el-dialog
      title="重置付费用户调控"
      :visible.sync="paySchemaDialog"
      width="30%"
      :before-close="paySchemaClose"
    >
      <span>
        <el-form ref="paySchemaEditFrm" :model="paySchemaEdit" label-width="150px">
          <el-form-item label="调控结果">
            <el-select v-model="paySchemaEdit.result" placeholder="placeholder">
              <el-option label="不调控" :value="0" />
              <el-option label="赢" :value="1" />
              <el-option label="输" :value="2" />
              <el-option label="平" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="Winnings控制线">
            <el-input v-model="paySchemaEdit.winnings" placeholder="placeholder" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paySchemaDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatePaySchema">确 定</el-button>
      </span>
    </el-dialog>

    <el-row style="margin-top: 20px">
      <el-col :offset="1" :span="22">
        <el-tabs v-model="tabName" type="border-card" @tab-click="tabClick">
<!--          <el-tab-pane label="邀请用户" name="inviteUsers">
            <el-form ref="form" :model="item" :inline="true">
              <el-form-item label="绑定时间">
                <el-date-picker
                  v-model="inviteSelectTime"
                  size="mini"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="mini" @click="getInviteUsers">搜索</el-button>
              </el-form-item>
            </el-form>

            <el-descriptions title="" border :column="3">
              <el-descriptions-item label="邀请总人数">{{ InviteUsers.InviteCount }}</el-descriptions-item>
              <el-descriptions-item label="被邀请人总充值">{{ InviteUsers.TotalRecharge | toRupee }}</el-descriptions-item>
              <el-descriptions-item label="被邀请人总提款">{{ (InviteUsers.InviteWithdraw + InviteUsers.HallWithdraw) | toRupee }}</el-descriptions-item>
              <el-descriptions-item label="被邀请用户余额">{{ InviteUsers.CarryMoney | toRupee }}</el-descriptions-item>
              <el-descriptions-item label="被邀请用户充提余额差">{{ InviteUsers.MoneyDiff | toRupee }}</el-descriptions-item>
              <el-descriptions-item label="被邀请用户充提余额比">{{ InviteUsers.MoneyRate }}</el-descriptions-item>
            </el-descriptions>
            <el-table
              :data="InviteUsers.User"
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="uid"
                width="100"
              />
              <el-table-column
                prop="Level"
                label="邀请等级"
              />
              <el-table-column
                prop="InviteCount"
                label="邀请人数"
              />
              <el-table-column
                prop="InviteCommission"
                label="邀请佣金"
              >
                <template slot-scope="scope">
                  {{ scope.row.InviteCommission | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="AffiliateCommission"
                label="推广员佣金"
              >
                <template slot-scope="scope">
                  {{ scope.row.AffiliateCommission | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TotalRecharge"
                label="总充值"
              >
                <template slot-scope="scope">
                  {{ scope.row.TotalRecharge | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="HallWithdraw"
                label="大厅提现"
              >
                <template slot-scope="scope">
                  {{ scope.row.HallWithdraw | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="InviteWithdraw"
                label="邀请提现"
              >
                <template slot-scope="scope">
                  {{ scope.row.InviteWithdraw | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="CarryMoney"
                label="账户余额"
              >
                <template slot-scope="scope">
                  {{ scope.row.CarryMoney | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="MoneyDiff"
                label="充提余额差"
              >
                <template slot-scope="scope">
                  {{ scope.row.MoneyDiff | toRupee }}
                </template>
              </el-table-column>
              <el-table-column
                prop="MoneyRate"
                label="充提余额比"
              >
                <template slot-scope="scope">
                  {{ scope.row.MoneyRate }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Games"
                label="玩牌局数"
                width="150px"
              >
                <template slot-scope="scope">
                  <el-descriptions title="" border size="mini" :column="1">
                    <el-descriptions-item v-for="(cnt, gid) in scope.row.Games" :label="showGameName(gid)">{{ cnt }}</el-descriptions-item>
                  </el-descriptions>
                </template>
              </el-table-column>
              <el-table-column
                prop="RegisterTime"
                label="注册时间"
                width="150px"
              >
                <template slot-scope="scope">
                  {{ scope.row.RegisterTime | parseTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="BindTime"
                label="绑定时间"
                width="150px"
              >
                <template slot-scope="scope">
                  {{ scope.row.BindTime | parseTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="LoginTime"
                label="最近登录"
                width="150px"
              >
                <template slot-scope="scope">
                  {{ scope.row.LoginTime | parseTime }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>-->
<!--          <el-tab-pane label="同账号关联账号" name="sameRelationUser">
            <el-descriptions title="" border :column="3">
              <el-descriptions-item label="数量">{{ SameRelationSummary.Count }}</el-descriptions-item>
              <el-descriptions-item label="总充值">{{ formatNumber(SameRelationSummary.Recharge) }}</el-descriptions-item>
              <el-descriptions-item label="总提现">{{ formatNumber(SameRelationSummary.Withdraw) }}</el-descriptions-item>
              <el-descriptions-item label="充提差">{{ formatNumber(SameRelationSummary.Diff) }}</el-descriptions-item>
              <el-descriptions-item label="提充比">{{ formatNumber(SameRelationSummary.Ratio) }} %</el-descriptions-item>
            </el-descriptions>
            <el-table
              :data="SameRelationUsers"
              style="width: 100%"
            >
              <el-table-column
                prop="RelationUid"
                label="关联uid"
                width="100px"
              />
              <el-table-column
                prop="AppId"
                label="AppId"
                width="100px"
              />
              <el-table-column
                prop="AccountNo"
                label="收款账号"
                width="150px"
              />
              <el-table-column
                prop="RegisterTime"
                label="注册时间"
              >
                <template slot-scope="scope">
                  {{ scope.row.RegisterTime | parseTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TotalRecharge"
                label="总充值"
              >
                <template slot-scope="scope">
                  {{ scope.row.TotalRecharge | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TotalWithdraw"
                label="总提现"
              >
                <template slot-scope="scope">
                  {{ scope.row.TotalWithdraw | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                label="充提差"
              >
                <template slot-scope="scope">
                  {{ (scope.row.TotalRecharge - scope.row.TotalWithdraw) | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                label="提充比"
              >
                <template slot-scope="scope">
                  {{ showRechargeWithdrawRatio(scope.row) }}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>-->
<!--          <el-tab-pane label="关联账号" name="relationUser">
            <el-descriptions title="" border :column="3">
              <el-descriptions-item label="数量">{{ RelationSummary.Count }}</el-descriptions-item>
              <el-descriptions-item label="总充值">{{ formatNumber(RelationSummary.Recharge) }}</el-descriptions-item>
              <el-descriptions-item label="总提现">{{ formatNumber(RelationSummary.Withdraw) }}</el-descriptions-item>
              <el-descriptions-item label="充提差">{{ formatNumber(RelationSummary.Diff) }}</el-descriptions-item>
              <el-descriptions-item label="提充比">{{ formatNumber(RelationSummary.Ratio) }} %</el-descriptions-item>
            </el-descriptions>
            <el-table
              :data="RelationUsers"
              style="width: 100%"
            >
              <el-table-column
                prop="RelationUid"
                label="关联uid"
                width="100px"
              />
              <el-table-column
                prop="AppId"
                label="AppId"
                width="100px"
              />
              <el-table-column
                prop="AccountNo"
                label="收款账号"
                width="150px"
              />
              <el-table-column
                prop="RegisterTime"
                label="注册时间"
              >
                <template slot-scope="scope">
                  {{ scope.row.RegisterTime | parseTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TotalRecharge"
                label="总充值"
              >
                <template slot-scope="scope">
                  {{ scope.row.TotalRecharge | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                prop="TotalWithdraw"
                label="总提现"
              >
                <template slot-scope="scope">
                  {{ scope.row.TotalWithdraw | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                label="充提差"
              >
                <template slot-scope="scope">
                  {{ (scope.row.TotalRecharge - scope.row.TotalWithdraw) | toRupee | numberFormat }}
                </template>
              </el-table-column>
              <el-table-column
                label="提充比"
              >
                <template slot-scope="scope">
                  {{ showRechargeWithdrawRatio(scope.row) }}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>-->
          <el-tab-pane label="用户IP设备" name="userIpDevice">
            <el-table
              :data="UserIpDevice"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uid"
                label="uid"
                width="100"
              />
              <el-table-column
                prop="ip"
                label="ip"
                width="180"
              />
              <el-table-column
                prop="deviceCode"
                label="设备码"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="同IP" name="sameIp">
            <el-table
              :data="SameIp"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uid"
                label="uid"
                width="100"
              />
              <el-table-column
                prop="ip"
                label="ip"
                width="180"
              />
              <el-table-column
                prop="deviceCode"
                label="设备码"
              />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="同设备" name="sameDevice">
            <el-table
              :data="SameDevice"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uid"
                label="uid"
                width="100"
              />
              <el-table-column
                prop="ip"
                label="ip"
                width="180"
              />
              <el-table-column
                prop="deviceCode"
                label="设备码"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row>
      <el-dialog title="玩家场控" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false" width="1000px">

        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="金币总数：">{{ formatNumber(item.LimitedMoney + item.FreeMoney) }}</el-descriptions-item>
          <el-descriptions-item label="基础值：">
            <el-col :span="20">
              {{ formatNumber(item.BaseValue) }}
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" content="充值额度 - 贡献值" placement="right-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
          </el-descriptions-item>
          <el-descriptions-item label="贡献值：" span="2">
            <el-col :span="20">
              {{ formatNumber(item.ProduceValue) }}
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" content="有效下注 * 5%" placement="right-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
          </el-descriptions-item>
          <template v-if="item.PayValue!==0">
            <el-descriptions-item label="总控健康度：">
              <el-col :span="20">
                <span style="color:red">{{ mainRate + '%' }}</span>
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="系统收益 / 总有效下注（5% 为理想值）" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="理想收益A：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[100]?item.MainControls[100].BetValue * 0.05/1000:0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="总有效下注 * 5%" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="实际收益B：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[100]?item.MainControls[100].SystemGot/1000:0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="指定时间段内，玩家输 + 抽水 - 玩家赢" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="有效流水：">{{ formatNumber(item.MainControls[100]?item.MainControls[100].BetValue/1000:0) }}</el-descriptions-item>
          </template>
          <el-descriptions-item label="幸运值：">
            <span style="color:red">{{ luckValue }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="公式：" span="3">
            基础值/金币总数
          </el-descriptions-item>
          <el-descriptions-item label="单局赢上限："><span style="color:red">{{ getPlayLimit }}</span></el-descriptions-item>
          <el-descriptions-item label="上限比例：">{{ item.PlayWinLimit==999?'INF' : item.PlayWinLimit + '%' }}</el-descriptions-item>
          <el-descriptions-item label="基准值/贡献值：">
            {{ playWinLimitStd }}
          </el-descriptions-item>
        </el-descriptions>

        <el-row>
          <div style="font-size: 16px;font-weight: bold;margin-top:10px;">
            TeenPatti:
          </div>
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <template v-if="item.PayValue!==0">
            <el-descriptions-item label="健康度：">
              <el-col :span="20">
                <span style="color:red">{{ (item.MainControls[9]?item.MainControls[9].SystemGot * 100/item.MainControls[9].BetValue : 0).toFixed(2) + '%' }}</span>
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="系统收益 / 总有效下注（5% 为理想值）" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="理想收益A：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[9]?item.MainControls[9].BetValue * 0.05/1000 : 0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="总有效下注 * 5%" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="实际收益B：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[9]? item.MainControls[9].SystemGot/1000 : 0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="指定时间段内，玩家输 + 抽水 - 玩家赢" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="有效流水：">{{ formatNumber(item.MainControls[9]?item.MainControls[9].BetValue/1000:0) }}</el-descriptions-item>

            <el-descriptions-item label="" />
            <el-descriptions-item label="B-A/A：">{{ (item.MainControls[9]? (item.MainControls[9].SystemGot-item.MainControls[9].BetValue*0.05) * 100 /(item.MainControls[9].BetValue*0.05) : 0).toFixed(2) + '%' }}</el-descriptions-item>
            <el-descriptions-item label="升降级别：" span="2"><span style="color:red">{{ item.MainControls[9]?(item.MainControls[9].AddFlag?'升':'降') + item.MainControls[9].AddLevel + '级' : '' }}</span></el-descriptions-item>
          </template>

          <el-descriptions-item label="胜率："><span style="color:red">{{ item.LuckToRateValues[9]? item.LuckToRateValues[9].WinRate +'%' : '' }}</span></el-descriptions-item>
          <el-descriptions-item label="原始级别：">
            {{ item.LuckToRateValues[9]? item.LuckToRateValues[9].LevelOrigin + 1 : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="调整后：">
            {{ item.LuckToRateValues[9]? item.LuckToRateValues[9].Level + 1 : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否配牌：">
            {{ isPei(item.LuckToRateValues[9]? item.LuckToRateValues[9].IsPei:0) }}
          </el-descriptions-item>
        </el-descriptions>
        <el-row>
          <div style="font-size: 16px;font-weight: bold;margin-top:10px;">
            拉米:
          </div>
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <template v-if="item.PayValue!==0">
            <el-descriptions-item label="健康度：">
              <el-col :span="20">
                <span style="color:red">{{ (item.MainControls[1]?item.MainControls[1].SystemGot * 100/item.MainControls[1].BetValue : 0).toFixed(2) + '%' }}</span>
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="系统收益 / 总有效下注（5% 为理想值）" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="理想收益A：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[1]?item.MainControls[1].BetValue * 0.05 /1000: 0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="总有效下注 * 5%" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="实际收益B：">
              <el-col :span="20">
                {{ formatNumber(item.MainControls[1]? item.MainControls[1].SystemGot/1000 : 0) }}
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="dark" content="指定时间段内，玩家输 + 抽水 - 玩家赢" placement="right-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </el-col>
            </el-descriptions-item>
            <el-descriptions-item label="有效流水：">{{ formatNumber(item.MainControls[1]?item.MainControls[1].BetValue/1000:0) }}</el-descriptions-item>

            <el-descriptions-item label="" />
            <el-descriptions-item label="B-A/A：">{{ (item.MainControls[1]? (item.MainControls[1].SystemGot-item.MainControls[1].BetValue*0.05) * 100 /(item.MainControls[1].BetValue*0.05) : 0).toFixed(2) + '%' }}</el-descriptions-item>
            <el-descriptions-item label="升降级别：" span="2"><span style="color:red">{{ item.MainControls[1]?(item.MainControls[1].AddFlag?'升':'降') + item.MainControls[1].AddLevel + '级' : '' }}</span></el-descriptions-item>
          </template>
          <el-descriptions-item label="胜率："><span style="color:red">{{ item.LuckToRateValues[1]? item.LuckToRateValues[1].WinRate +'%' : '' }}</span></el-descriptions-item>
          <el-descriptions-item label="原始级别：">
            {{ item.LuckToRateValues[1]? item.LuckToRateValues[1].LevelOrigin + 1 : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="调整后：">
            {{ item.LuckToRateValues[1]? item.LuckToRateValues[1].Level + 1 : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否配牌：">
            {{ isPei(item.LuckToRateValues[1]? item.LuckToRateValues[1].IsPei:0) }}
          </el-descriptions-item>

          <el-descriptions-item label="最近开局时间：">
            {{ item.RummyLatestStartTime? formatTime(item.RummyLatestStartTime) : '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否命中赢："><span style="color:red">
            {{ isWin(item.RummyLatestStartTime? item.RummyIsWinnerStatus:-1) }}</span>
          </el-descriptions-item>

        </el-descriptions>
        <el-col :offset="20">
          <el-button size="mini" type="primary" @click="getInfo">刷新</el-button>
        </el-col>
      </el-dialog>
    </el-row>

    <!--添加标签start-->
    <el-dialog
      title="标签操作"
      :visible.sync="TagVisible"
      width="30%"
      :before-close="TagVisibleClose"
    >
      <span>
        <el-form ref="form" :model="UserTag" label-width="150px">
          <el-form-item label="标签名称：">
            <el-autocomplete
              v-model="UserTag.Tag"
              class="inline-input"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="颜色：">
            <el-select v-model="UserTag.Color" placeholder="placeholder">
              <el-option
                v-for="opt in ColorOption"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否需要审核：">
            <el-switch
              v-model="UserTag.IsAuditBool"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TagVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTagSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加标签end-->
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, $libType, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import { toRupee, numberFormat } from '@/utils'
import DateTimeShow from '@/components/DatetimeShow'

function NewRelationSummary() {
  return {
    Count: 0, // 数量
    Recharge: 0, // 总充值
    Withdraw: 0, // 总提现
    Diff: 0, // 充提差
    Ratio: 0 // 提充比
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      item: {
        Uid: 0,
        LimitedMoney: '',
        FreeMoney: '',
        BonusTotal: 0,
        BonusValid: 0,
        Gullak: 0,
        GullakLevel: 0,
        Nick: '',
        RegisterTime: '',
        LastLoginTime: '',
        Country: '',
        Language: '',
        Icon: '',
        Status: '',
        MainControls: {},
        RummyLatestStartTime: 0,
        RummyIsWinnerStatus: 0,
        LuckToRateValues: {},
        SchemaXMan: 0,
        Ip: '',
        DeviceCode: '',
        MaxPayAmount: 0,
        InviteCount: 0,
        InviteCode: '',
        InviteLevel: 0, // 邀请等级
        InviteBalance: 0, // 分享模块-当前余额
        InviteWithdraw: 0, // 分享模块-可提余额
        InviteWithdrawProcess: 0, // 分享模块-提现中
        AppId: 0,
        SourceAppid: 0, // 来源appid
        PaySchema: {

        },
        Phone: '',
        IsSetLoginPwd: false,
        IsSetPayPwd: false
      },
      libShowMoney: new MoneyShow(['BonusTotal', 'BonusValid', 'Gullak', 'LimitedMoney', 'FreeMoney', 'BaseValue', 'ProduceValue', 'MCBetValue', 'MCSystemGot', 'PayValue']),
      moneyType: 1,
      money: 0,
      env: 'test',

      edit: {
        visible: false
      },

      hasEditPerm: false,
      hasCustomerPerm: false,

      UserTags: [],
      tagRecs: [],
      TagVisible: false,

      mailEditable: false,
      pickerOptions: $libShow.DefaultDatePickerOptions(),

      UserTag: {
        ID: 0,
        Tag: '',
        TagType: 1,
        IsAudit: 0,
        IsAuditBool: false,
        Color: 0
      },
      //  ColorDefault = 0; //默认 info
      // ColorPrimary = 1; //主要 primary
      // ColorSuccess = 2; //成功 success
      // ColorWarning = 3; //警告 warning
      // ColorDanger = 4; //危险 danger
      ColorOption: [
        { 'label': '默认', 'value': 0 },
        { 'label': '主要', 'value': 1 },
        { 'label': '成功', 'value': 2 },
        { 'label': '警告', 'value': 3 },
        { 'label': '危险', 'value': 4 }
      ],

      // 修改调控结果
      paySchemaDialog: false,
      paySchemaEdit: {
        result: 0,
        winnings: 0
      },

      paySchemaResultColor: '', // 调控结果颜色

      sourceOption: [
        { label: '邀请奖励', value: 1 },
        { label: '被邀请人充值', value: 2 },
        { label: '罐子', value: 3 },
        { label: '排行榜', value: 4 },
        { label: '任务', value: 5 },
        { label: '1级推广者充值', value: 10 },
        { label: '2级推广者充值', value: 11 },
        { label: '3级推广者充值', value: 12 },
        { label: '4级推广者充值', value: 13 },
        { label: '罐子进行中', value: 14 }
      ],

      tabName: 'inviteUsers', //
      inviteSelectTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      InviteUsers: [], // 邀请用户
      RelationUsers: [], // 关联账号
      SameRelationUsers: [], // 相同关联账号
      SameRelationSummary: NewRelationSummary(),
      RelationSummary: NewRelationSummary(),
      UserIpDevice: [], // 用户IP设备
      SameIp: [], // 同IP
      SameDevice: [] // 同设备
    }
  },
  computed: {
    getImgUrl() {
      if (this.env === 'test') {
        return $libShow.GetFullPath(this.item.Icon)
      } else {
        // 兼容一下第三方图片
        let needCdnDomain = true
        if (this.item.Icon.indexOf('http://') == 0 || this.item.Icon.indexOf('https://') == 0) {
          needCdnDomain = false
        }
        if (needCdnDomain) {
          return 'http://aws.texas-cdn.joydance.hk' + this.item.Icon
        } else {
          return this.item.Icon
        }
      }
    },
    mainRate() {
      if (this.item.MainControls && this.item.MainControls[100]) {
        return (this.item.MainControls[100].SystemGot * 100 / this.item.MainControls[100].BetValue).toFixed(2)
      } else {
        return 0
      }
    },
    luckValue() {
      if (this.item.LimitedMoney + this.item.FreeMoney === 0) {
        return 'INF'
      } else {
        return (this.item.BaseValue * 100 / (this.item.LimitedMoney + this.item.FreeMoney)).toFixed(2) + '%'
      }
    },
    playWinLimitStd() {
      if (this.item.ProduceValue === 0) {
        return 'INF'
      } else {
        return (this.item.BaseValue * 100 / (this.item.ProduceValue)).toFixed(2) + '%'
      }
    },
    getPlayLimit() {
      if (this.item.PlayWinLimit === 999) {
        return 'INF'
      } else {
        return this.formatNumber(this.item.BaseValue * this.item.PlayWinLimit / 100)
      }
    }
  },
  created() {
    console.log(1)
    const pers = store.getters.pers
    this.hasEditPerm = (pers['USER_MANAGEMENT'] & 2) > 0
    this.hasCustomerPerm = (pers['CUTOMER'] & 2) > 0
  },
  mounted() {
    this.env = store.getters.env || this.env
    if (this.$route.query && this.$route.query.uid > 0) {
      this.item.Uid = parseInt(this.$route.query.uid)
      this.$refs.uidInput.saveUid(this.item.Uid)
      console.log('set mounted', this.item.Uid)
    }
    this.getInfo()
  },
  activated() {
    if (this.$route.query && this.$route.query.uid > 0) {
      this.item.Uid = parseInt(this.$route.query.uid)
      this.$refs.uidInput.saveUid(this.item.Uid)
      console.log('set activated', this.item.Uid)
    }
    this.getInfo()
  },
  methods: {
    showSourceAppid(appid) {
      if (appid < 0) { // 出现错误或者空
        return '-'
      } else if (appid === 0) {
        return '-'
      } else {
        return appid
      }
    },
    checkSource(source) {
      return [1, 2, 3, 4, 5, 10, 11, 12, 13].indexOf(parseInt(source)) !== -1
    },
    showSource(source) {
      let name = ''
      for (const i in this.sourceOption) {
        if (this.sourceOption[i].value == source) {
          name = this.sourceOption[i].label
          break
        }
      }
      return name
    },

    showInviteLevel(lvl) {
      const levels = {
        1: '青铜',
        2: '白银',
        3: '黄金',
        4: '铂金',
        5: '钻石'
      }

      return levels.hasOwnProperty(lvl) ? levels[lvl] : lvl
    },
    showGameName(gid) {
      const games = {
        1: 'Rummy',
        2: 'AB',
        3: '龙虎斗',
        4: 'JM',
        5: '车标转轮',
        6: '7上7下',
        7: '红黑梅方',
        8: 'AK',
        9: 'Teen Patti',
        10: 'Crash',
        11: 'TeenPatti百人场'
      }
      return games.hasOwnProperty(gid) ? games[gid] : gid
    },
    paySchemaClose(done) {
      this.paySchemaDialog = false
      done()
    },
    setSchemaResult() {
      this.paySchemaEdit.result = this.item.PaySchema.Result
      this.paySchemaEdit.winnings = parseInt(this.item.PaySchema.WinningsLine / 1000)
      this.paySchemaDialog = true
    },
    updatePaySchema() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: {
          Env: this.env,
          Path: '/user/update/pay/schema',
          uid: this.item.Uid,
          result: this.paySchemaEdit.result,
          winnings: (this.paySchemaEdit.winnings * 1000)
        }
      }).then(response => {
        console.log('pay schema response', response)
        if (response.RetCode === 0) {
          $this.showSchemaResult($this.paySchemaEdit.result)
          $this.item.PaySchema.WinningsLine = $this.paySchemaEdit.winnings * 1000
          $this.$message.success('修改成功')
          $this.paySchemaDialog = false
        } else {
          $this.$message.error('修改失败' + response.Data)
        }
      })
    },
    showSchemaResult(result) {
      switch (result) {
        case 0:
          this.item.PaySchema.ResultName = '不调控'
          this.paySchemaResultColor = 'info'
          break
        case 1:
          this.item.PaySchema.ResultName = '赢'
          this.paySchemaResultColor = 'danger'
          break
        case 2:
          this.item.PaySchema.ResultName = '输'
          this.paySchemaResultColor = 'success'
          break
        case 3:
          this.item.PaySchema.ResultName = '平'
          this.paySchemaResultColor = 'info'
          break
        default:
          this.item.PaySchema.ResultName = result
          this.paySchemaResultColor = ''
      }
    },
    showRechargeWithdrawRatio(row) {
      if (row.TotalRecharge <= 0) {
        return 0
      } else {
        return numberFormat((row.TotalWithdraw / row.TotalRecharge * 100).toFixed(2))
      }
    },
    // 邀请用户查询
    getInviteUsers() {
      let sts = 0; let ets = 0
      if (this.inviteSelectTime && this.inviteSelectTime.length > 0) {
        sts = this.transTime(this.inviteSelectTime[0])
        ets = this.transTime(this.inviteSelectTime[1])
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/users',
          ref_uid: this.item.Uid,
          sts: sts,
          ets: ets
        }
      }).then(response => {
        console.log('invite/users response', response)
        if (response.RetCode === 0 && response.Data) {
          this.InviteUsers = response.Data
        } else {
          this.InviteUsers = []
        }
      })
    },
    transTime(t) {
      if (!t) {
        return 0
      }
      let time = t
      if (typeof t !== 'number') {
        time = t.getTime()
      }
      return parseInt($libDate.SelectTimeToIndiaByZone(time) / 1000)
    },
    // 用户设备信息查询
    getRelationUsers() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/relation/users',
          uid: this.item.Uid
        }
      }).then(response => {
        console.log('relation/users response', response)
        if (response.RetCode === 0 && response.Data) {
          this.RelationUsers = response.Data
          this.sameRelation()
          this.relationSummary()
        } else {
          this.RelationUsers = []
          this.SameRelationUsers = []
        }
      })
    },
    sameRelation() {
      // console.log('item ', this.item.AppID)
      this.SameRelationUsers = []
      for (const i in this.RelationUsers) {
        if (this.RelationUsers[i].AppId == this.item.AppID && this.RelationUsers[i].RelationUid != this.item.Uid) {
          this.SameRelationUsers.push(this.RelationUsers[i])
        }
      }

      let count = 0; let recharge = 0; let withdraw = 0
      for (const i in this.SameRelationUsers) {
        count++
        recharge += toRupee(this.SameRelationUsers[i]['TotalRecharge'])
        withdraw += toRupee(this.SameRelationUsers[i]['TotalWithdraw'])
      }

      let ratio = 0
      if (recharge > 0) {
        ratio = (withdraw / recharge * 100).toFixed(2)
      }

      this.SameRelationSummary.Count = count
      this.SameRelationSummary.Recharge = recharge
      this.SameRelationSummary.Withdraw = withdraw
      this.SameRelationSummary.Diff = recharge - withdraw
      this.SameRelationSummary.Ratio = ratio
    },
    relationSummary() {
      let count = 0; let recharge = 0; let withdraw = 0
      for (const i in this.RelationUsers) {
        count++
        recharge += toRupee(this.RelationUsers[i]['TotalRecharge'])
        withdraw += toRupee(this.RelationUsers[i]['TotalWithdraw'])
      }

      let ratio = 0
      if (recharge > 0) {
        ratio = (withdraw / recharge * 100).toFixed(2)
      }

      this.RelationSummary.Count = count
      this.RelationSummary.Recharge = recharge
      this.RelationSummary.Withdraw = withdraw
      this.RelationSummary.Diff = recharge - withdraw
      this.RelationSummary.Ratio = ratio
    },
    queryDevice(data, dataType) {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/ip/device',
          data: data,
          type: dataType
        }
      }).then(response => {
        console.log('ip/device response', response)
        if (response.RetCode === 0) {
          switch (dataType) {
            case 1:
              this.UserIpDevice = response.Data ? response.Data : []
              break
            case 2:
              this.SameIp = this.trimZeroUid(response.Data)
              break
            case 3:
              this.SameDevice = this.trimZeroUid(response.Data)
              break
          }
        }
      })
    },
    trimZeroUid(data) {
      if (!data) {
        return []
      }
      const ret = []
      for (const i in data) {
        if (parseInt(data[i]['uid']) > 0) {
          ret.push(data[i])
        }
      }
      return ret
    },
    getIpDevice() {
      this.queryDevice(this.item.Uid, 1)
    },
    getSameIp() {
      if (!this.item.Ip) {
        console.log('ip empty')
        return
      }
      this.queryDevice(this.item.Ip, 2)
    },
    getSameDevice() {
      if (!this.item.DeviceCode) {
        console.log('device code empty')
        return
      }
      this.queryDevice(this.item.DeviceCode, 3)
    },
    resetQueryDevice() {
      // this.getInviteUsers()
      this.RelationUsers = []
      this.SameIp = []
      this.SameDevice = []
      this.UserIpDevice = []
      this.tabName = 'userIpDevice'
      this.RelationSummary = NewRelationSummary()
      this.SameRelationSummary = NewRelationSummary()
    },
    tabClick(tab, event) {
      switch (tab.name) {
        case 'sameRelationUser':
        case 'relationUser':
          if (this.RelationUsers.length <= 0) {
            this.getRelationUsers()
          }
          break
        case 'userIpDevice':
          if (this.UserIpDevice.length <= 0) {
            this.getIpDevice()
          }
          break
        case 'sameIp':
          if (this.SameIp.length <= 0) {
            this.getSameIp()
          }
          break
        case 'sameDevice':
          if (this.SameDevice.length <= 0) {
            this.getSameDevice()
          }
          break
        case 'inviteUsers':
          if (this.InviteUsers.length <= 0) {
            this.getInviteUsers()
          }
          break
      }
      this.tabName = tab.name
    },

    updateMail() {
      this.$confirm('确定将修改玩家的邮箱信息为：' + this.item.Email + '吗？', '提醒')
        .then(() => {
          request({
            url: '/dataProxy/info',
            method: 'post',
            data: {
              Env: this.env,
              Path: '/user/info',
              Uid: this.item.Uid,
              Mail: this.item.Email,
              Type: 10
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('修改成功！')
              this.mailEditable = false
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    customerRedhot() {
      this.$confirm('确定要向玩家设置客服红点吗？', '提醒')
        .then(() => {
          request({
            url: '/dataProxy/info',
            method: 'post',
            data: {
              Env: this.env,
              Path: '/user/customer/redhot',
              Uid: this.item.Uid,
              Type: 7
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('设置成功！')
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    clearFirstPayFlag() {
      this.$confirm('确定要清除首充用户？', '提醒')
        .then(() => {
          request({
            url: '/dataProxy/info',
            method: 'post',
            data: {
              Env: this.env,
              Path: '/user/info',
              Uid: this.item.Uid,
              Type: 11
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('清除成功！')
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    formatBool(ret) {
      return ret ? '是' : '否'
    },
    formatBankCode(code) {
      switch (code) {
        case 100:
          return '银行卡'
        case 103:
          return 'UPI'
        default:
          return ''
      }
    },
    formatAccountType(type) {
      switch (type) {
        case 1:
          return '游客'
        case 2:
          return 'FB'
        case 3:
          return '邮箱'
        case 4:
          return '手机号'
        case 5:
          return 'Google'
        case 6:
          return '第三方平台'
        default:
          return '未知'
      }
    },
    showTagType(color) {
      switch (parseInt(color)) {
        case 1:
          return 'primary'
        case 2:
          return 'success'
        case 3:
          return 'warning'
        case 4:
          return 'danger'
        default:
          return 'info'
      }
    },
    TagVisibleClose(done) {
      this.TagVisible = false
      done()
    },

    clickAddTag() {
      this.UserTag = {
        ID: 0,
        Tag: '',
        TagType: 1,
        IsAudit: 0,
        IsAuditBool: false,
        Color: 0
      }
      this.TagVisible = true
      this.initTagRecs()
    },
    clickEditTag(id) {
      this.TagVisible = true
      const tag = this.queryTag(id)
      if (!tag) {
        this.$message.error('标签不存在')
        return
      }
      this.UserTag = {
        ID: tag.ID,
        Tag: tag.Tag,
        TagType: tag.TagType,
        IsAudit: tag.IsAudit,
        IsAuditBool: parseInt(tag.IsAudit) === 1,
        Color: tag.Color
      }
    },
    queryTag(id) {
      let tag
      for (const i in this.UserTags) {
        if (parseInt(this.UserTags[i].ID) === parseInt(id)) {
          tag = this.UserTags[i]
          break
        }
      }
      return tag
    },
    addTagSubmit() {
      this.UserTag.Uid = this.item.Uid
      this.UserTag.IsAudit = this.UserTag.IsAuditBool ? 1 : 0
      if (this.UserTag.ID === 0) {
        this.addTag()
      } else {
        this.updateTag()
      }
      this.TagVisible = false
    },
    addTag() {
      // 添加用户标签
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/add/tag',
          tag: this.UserTag.Tag,
          uid: this.UserTag.Uid,
          color: this.UserTag.Color,
          isAudit: this.UserTag.IsAudit
        }
      }).then(response => {
        console.log('add tag ', response)
        if (response.RetCode === 0) {
          $this.getTags()

          let iFound
          for (const o in this.tagRecs) {
            if (this.tagRecs[o].value == this.UserTag.Tag) {
              iFound = true
              break
            }
          }
          if (!iFound) {
            this.addTagToRecord(this.UserTag.Tag)
          }
        } else {
          $this.$message.error('更新失败')
        }
      })
    },
    addTagToRecord(tag) {
      const $this = this
      request({
        url: '/other/record/tag',
        method: 'post',
        data: {
          Tag: tag
        }
      }).then(response => {
        console.log('update tag ', response)
        if (response.RetCode === 0) {
          $this.tagRecs.push({ value: tag })
        } else {
          $this.$message.error('更新tag到数据库失败')
        }
      })
    },
    updateTag() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/update/tag',
          id: this.UserTag.ID,
          tag: this.UserTag.Tag,
          uid: this.UserTag.Uid,
          color: this.UserTag.Color,
          isAudit: this.UserTag.IsAudit
        }
      }).then(response => {
        console.log('update tag ', response)
        if (response.RetCode === 0) {
          $this.getTags()
        } else {
          $this.$message.error('更新失败')
        }
      })
    },
    delTag(id) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/del/tag',
          id: id,
          uid: this.item.Uid
        }
      }).then(response => {
        console.log('del tag ', response)
        if (response.RetCode === 0) {
          $this.getTags()
        } else {
          $this.$message.error('删除失败')
        }
      })
    },
    getTags() {
      if (this.item.Uid === 0) {
        console.log('uid 不能为空')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/tags',
          uid: this.item.Uid
        }
      }).then(response => {
        console.log('tags ', response)
        $this.UserTags = []
        if (response.Data) {
          $this.UserTags = response.Data
        }
      })
    },
    initTagRecs() {
      if (this.tagRecs.length > 0) {
        return
      }
      const $this = this
      request({
        url: '/other/tags',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const o in objs) {
            $this.tagRecs.push({ value: objs[o] })
          }
        }
      })
    },
    querySearch(queryString, cb) {
      const tags = this.tagRecs
      const results = queryString ? tags.filter(this.createFilter(queryString)) : tags
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (tag) => {
        return (tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    isPei(val) {
      switch (val) {
        case 0:
          return '否'
        case 1:
          return '赢时配'
        case 2:
          return '输时配'
        default:
          return ''
      }
    },

    isWin(val) {
      switch (val) {
        case 0:
          return '否'
        case 1:
          return '是'
        default:
          return '无'
      }
    },
    formatNumber(n) {
      if ($libType.IsNumber(n)) {
        return n.toLocaleString()
      } else {
        return n
      }
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    setUserPay() {
      const msg = '确定要将此用户设置为充值用户吗？\n设置后，其输赢将参与到总控值的计算！！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/user/info',
            Uid: this.item.Uid,
            Type: 4,
            Money: 0
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改成功！')
            this.item.PayValue = 0.001
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    setUserPay2() {
      const msg = '确定要将此用户充值额添加100吗？\n只有内部测试账号才可以进行此操作！！'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/user/info',
            Uid: this.item.Uid,
            Type: 9,
            Money: 0
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改成功！')
            this.item.PayValue += 100
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    setSchemaXMan(v) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/info',
          Uid: this.item.Uid,
          Type: 5,
          Money: 0,
          SchemaXMan: v
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('修改成功！')
          this.item.SchemaXMan = v
        }
      })
    },
    disableUser(v) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/info',
          Uid: this.item.Uid,
          Type: 6,
          Money: 0,
          Status: v
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('修改成功！')
          this.item.Status = v
        }
      })
    },
    getMoneyName(iType) {
      switch (iType) {
        case 1:
          return 'Deposit'
        case 2:
          return 'Winning'
        case 3:
          return '基础值'
        case 4:
          return 'Bonus'
        default:
          return '错误类型'
      }
    },
    saveMoney() {
      if (this.money == 0) {
        Message.warning('无效请求')
        return
      }
      const msg = '确定要给此用户添加 ' + this.formatNumber(this.money) + ' 的' + this.getMoneyName(this.moneyType) + '吗?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/user/info',
            Uid: this.item.Uid,
            Type: this.moneyType,
            Money: this.libShowMoney.TransForStore(this.money),
            ActMsg: '管理后台By ' + store.getters.name
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改成功！')
            if (this.moneyType != 8) {
              const ob = response.Data.record
              this.item.LimitedMoney = ob.limited_money / 1000
              this.item.FreeMoney = ob.free_money / 1000
              this.item.BaseValue = ob.baseValue / 1000
            } else {
              this.item.BonusTotal += this.money
            }
            this.money = 0
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/info',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.getTags()
          $this.resetQueryDevice()
          $this.item = $this.libShowMoney.TransForShow(response.Data || $this.item)
          $this.showSchemaResult($this.item.PaySchema.Result)
          $this.$EventBus.$emit('uid-change', $this.item.Uid)
        }
      })
    }
  }
}
</script>
<style type="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
