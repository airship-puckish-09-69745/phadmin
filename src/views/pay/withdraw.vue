<template>
  <div class="app-container">
    <el-row>
      <el-form ref="form" :model="form" :inline="true" label-width="80px">
        <el-form-item label="提现ID">
          <el-input v-model="form.id" size="mini" placeholder="提现ID" />
        </el-form-item>

        <el-form-item label="uid">
          <el-input v-model="form.uid" size="mini" placeholder="用户uid" />
        </el-form-item>

        <el-form-item label="订单号">
          <el-input v-model="form.orderNo" placeholder="平台订单号" size="mini" />
        </el-form-item>

        <el-form-item label="申请时间">
          <el-date-picker
            v-model="form.applyTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
          />
        </el-form-item>

        <el-form-item label="完成时间">
          <el-date-picker
            v-model="form.finishTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" size="mini">
            <el-option
              v-for="item in form.statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="应用ID">
          <el-select v-model.number="form.appId" filterable="true" placeholder="请选择" size="mini">
            <el-option label="所有" :value="0" />
            <el-option label="自运营（android）" :value="100000001" />
            <el-option label="联运发行（galaxy）" :value="100000002" />
            <el-option label="联运线下（逆光）" :value="100000003" />
            <el-option
              v-for="item in form.appIdOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="提现方式">
          <el-select v-model="form.bankCode" placeholder="请选择" size="mini">
            <el-option
              v-for="item in form.bankCodeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="审核方式">
          <el-select v-model="form.passType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in form.passTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="用户标签">-->
        <!--          <el-select v-model="form.tags" multiple filterable placeholder="请选择" size="mini">-->
        <!--            <el-option-->
        <!--              v-for="item in form.tagOption"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <pay-channel v-model="form.payChannel" :filter="true" :channel-map="form.channelMap" />

        <el-form-item label="收款账号">
          <el-input v-model="form.accountNo" placeholder="收款账号" size="mini" />
        </el-form-item>
        <el-form-item label="提现来源">
          <el-select v-model.number="form.source" filterable placeholder="请选择" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option label="大厅" :value="0" />
            <el-option label="邀请" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人员">
          <el-select v-model="form.operator" placeholder="请选择" size="mini">
            <el-option label="所有" value="" />
            <el-option
              v-for="item in form.operatorOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额">
          <el-select v-model.number="form.amount" filterable placeholder="请选择" size="mini">
            <el-option label="全部" value="0" />
            <el-option label="100" value="100" />
            <el-option label="300" value="291" />
            <el-option label="500" value="485" />
            <el-option label="1000" value="970" />
            <el-option label="3000" value="2910" />
            <el-option label="5000" value="4850" />
            <el-option label="10000" value="9700" />
            <el-option label="20000" value="19400" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select v-model="form.orderByName" filterable placeholder="请选择" size="mini">
            <el-option label="申请时间" value="id" />
            <el-option label="申请金额" value="amount" />
            <el-option label="总充值" value="total_pay" />
            <el-option label="总提款" value="total_withdraw" />
          </el-select>
          降
          <el-switch
            v-model="form.orderByDirection"
            active-value="DESC"
            inactive-value="ASC"
          />
        </el-form-item>

        <el-form-item label="手动审核次数>=" label-width="120px">
          <el-input v-model="form.auditCnt" size="mini" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
          <el-button type="success" size="mini" @click="exportExcel">导出</el-button>
        </el-form-item>

        <span style="display:inline-block;margin: 6px 0 0 6px;color: red">自动审核占比：{{ autoAuditCnt }} / {{ total }} = {{ showAutoAuditRatio() }}</span>

      </el-form>
    </el-row>

    <el-alert
      v-if="showAlert"
      title="同收款账号充提比"
      :type="alertColor"
      :description="sameAccountNoDesc"
      show-icon
    />

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.TableCell(0)"
      @cell-click="editRemark"
      @selection-change="selectDataChange"
    >
      <el-table-column
        type="selection"
      />
      <el-table-column
        prop="Id"
        label="ID"
      />
      <el-table-column
        prop="AppId"
        label="应用ID"
      />
      <el-table-column
        prop="Source"
        label="来源"
      >
        <template slot-scope="scope">
          {{ showSource(scope.row.Source) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="Uid"
        width="120px"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showUserInfo(scope.row)">{{ scope.row.Uid }}</el-button>
          <i class="el-icon-copy-document" @click="copyText(scope.row.Uid)" />
          <i class="el-icon-search" @click="goUserInfo(scope.row.Uid)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="TotalRecharge"
        label="充值总额"
        width="120"
      >
        <template slot="header">
          <span>充值总额</span>
          <el-tooltip class="item" effect="dark" content="用户提现时的总充值金额" placement="top">
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          {{ scope.row.TotalRecharge / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="TotalRecharge"
        label="提现成功总额"
        width="120"
      >
        <template slot="header">
          <span>提现成功总额</span>
          <el-tooltip class="item" effect="dark" content="用户提现时的提现成功总额" placement="top">
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          {{ scope.row.TotalWithdraw / 1000 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_sys_id"
        label="代付渠道"
        width="100px"
      >
        <template slot-scope="scope">
          {{ formatPaySysId(scope.row.PaySysId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="申请金额"
        width="120px"
      >
        <template slot-scope="scope">
          {{ toRupee(scope.row.Amount + scope.row.Fee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        label="状态"
        width="130px"
      >
        <template slot-scope="scope">
          <span :style="'color:'+ showStatus(scope.row.Status, 2)">{{ showStatus(scope.row.Status, 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="申请时间"
        width="120px"
      >
        <template slot-scope="{row}">
          <DateTimeShow :show-type="7" :timestamp="row.CreateTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="PaySysChannel"
        label="方式"
      >
        <template slot-scope="scope">
          {{ showBankCode(scope.row.PaySysChannel) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Attr"
        label="标签"
        width="300px"
      >
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.Attr" :key="tag.ID" class="user-tag" size="mini" :type="showTagType(tag.Color)">
            {{ tag.Tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="Fee"
        label="手续费"
      >
        <template slot-scope="scope">
          {{ toRupee(scope.row.Fee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="到账"
      >
        <template slot-scope="scope">
          {{ toRupee(scope.row.Amount) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="PassType"
        label="审核方式"
      >
        <template slot-scope="scope">
          {{ showPassType(scope.row.PassType) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Operator"
        label="操作人"
      />

      <el-table-column
        prop="AuditCnt"
        label="手动审核次数"
      />

      <el-table-column
        v-if="hasEditPerm"
        prop="Status"
        label="操作"
        fixed="right"
        width="400px"
      >
        <template slot-scope="scope">
          <el-button v-if="[0,6,10].indexOf(scope.row.Status) >= 0" type="success" size="mini" class="tableButton" @click="pass(scope.row.Id)">通过</el-button>
          <el-button v-if="scope.row.Status === 7" type="success" size="mini" class="tableButton" @click="getRetryInfo(scope.row)">切换重试</el-button>
          <el-button v-if="[0,10].indexOf(scope.row.Status) >= 0" type="danger" size="mini" class="tableButton" @click="pending(scope.row)">挂起</el-button>
          <el-button v-if="[0,6,9,10].indexOf(scope.row.Status) >= 0" class="tableButton" type="primary" size="mini" @click="refuseAndRefund(scope.row.Id)">拒绝&退款</el-button>
          <el-button v-if="[0,6,9,10].indexOf(scope.row.Status) >= 0" class="tableButton" type="primary" size="mini" @click="refuseNoRefund(scope.row.Id)">拒绝&不退</el-button>
          <el-button v-if="[7].indexOf(scope.row.Status) >= 0" type="danger" size="mini" class="tableButton" @click="withdrawFailed(scope.row.Id)">用户可退</el-button>
          <el-button v-if="[6,9].indexOf(scope.row.Status) !== -1 && scope.row.PaySysId!=8" type="danger" size="mini" class="tableButton" @click="canRetry(scope.row)">失败可重试</el-button>
          <el-button v-if="[0,6,7].indexOf(scope.row.Status) !== -1" type="warning" size="mini" class="tableButton" @click="setObserve(scope.row.Id)">观察</el-button>
          <el-button v-if="env == 'test' && [0,1].indexOf(scope.row.Status) >= 0" type="danger" size="mini" class="tableButton" @click="monitorFailed(scope.row)">模拟提现失败</el-button>
          <el-button size="mini" icon="el-icon-tickets" title="操作日志" class="tableButton" @click="logs(scope.row)" />
          <el-button size="mini" icon="el-icon-message" title="发送电子邮件" class="tableButton" @click="sendMail(scope.row)" />
          <el-button v-if="['byronqiu','pear123'].indexOf(operator)>=0 && [2,3,4,5].indexOf(scope.row.Status)===-1" type="success" size="mini" class="tableButton" @click="queryProxyOrder(scope.row)">查询</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="PaySysOrder"
        label="平台订单号"
        width="400px"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="showRetryLog(row)">{{ row.PaySysOrder }}</el-button>
          <i class="el-icon-copy-document" @click="copyText(row.PaySysOrder)" />
        </template>
      </el-table-column>

      <el-table-column
        prop="Remark"
        label="备注"
        min-width="150px"
        column-key="remark"
      >
        <template slot="header">
          <span>备注</span>
          <el-tooltip class="item" effect="dark" content="点击单元格可以编辑内容" placement="top">
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="CardHolderName"
        label="姓名"
        width="150px"
      />
      <el-table-column
        prop="PhoneNo"
        label="手机"
        width="120px"
      />
      <el-table-column
        prop="BankName"
        label="ifsc"
        width="120px"
      />
      <el-table-column
        prop="Mail"
        label="email"
        width="250px"
      />
      <el-table-column
        prop="AccountNo"
        label="bank"
        width="150px"
      >
        <template slot-scope="scope">
          {{ showBankNo(scope.row) }}
          <i v-if="scope.row.PaySysChannel === 100" class="el-icon-copy-document" @click="copyText(showBankNo(scope.row))" />
        </template>
      </el-table-column>
      <el-table-column
        prop="AccountNo"
        label="upi"
        width="250px"
      >
        <template slot-scope="scope">
          {{ showAccountNo(scope.row) }}
          <i v-if="scope.row.PaySysChannel === 103" class="el-icon-copy-document" @click="copyText(showAccountNo(scope.row))" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="isBR()"
        prop="AccountType"
        label="账号类型"
        width="150px"
      />
      <el-table-column
        v-if="isBR()"
        prop="CPF"
        label="CPF"
        width="250px"
      />
    </el-table>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="pageInfo.GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageInfo.GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <div style="margin-top: 20px">
      <el-button type="success" @click="showAuditForm">自动审核</el-button>
      <el-button type="primary" @click="queryAuditList">自动审核操作日志</el-button>
      <el-button type="primary" @click="showToggleChanFrm">切换渠道</el-button>
    </div>

    <!--编辑备注start-->
    <el-dialog
      title="编辑备注"
      :visible.sync="remarkVisible"
      width="30%"
      :before-close="remarkVisibleClose"
    >
      <span>
        <el-form ref="form" :model="remarkForm">
          <el-form-item>
            <el-input v-model="remarkForm.remark" type="textarea" :rows="5" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRemark">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑备注end-->
    <el-dialog
      :title="'用户信息' + userInfo.Uid"
      :visible.sync="userinfoVisible"
      width="1000px"
      :before-close="userinfoVisibleClose"
    >
      <el-col :span="2" :offset="1">
        <el-button type="success" size="mini" @click="showDrawer">概要时间线</el-button>
      </el-col>
      <el-table
        :data="checks"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          prop="Title"
          label="检查项"
          width="150"
        />
        <el-table-column
          prop="Content"
          label="公式"
          width="200"
        />
        <el-table-column
          prop="Note"
          label="说明"
          width="250"
        />
        <el-table-column
          prop="Value"
          label="值"
          width="100"
        />

        <el-table-column
          label="结果"
          width="100"
        >
          <template slot-scope="scope">
            <el-button size="mini" :type="showTagType(scope.row.Type)">{{ getTypeName(scope.row.Type) }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-descriptions class="margin-top" :column="4" border>
        <el-descriptions-item label="本次提款额"><span style="color: red;font-weight: bold">{{ toRupee(userInfo.Amount) }}</span></el-descriptions-item>
        <el-descriptions-item label="历史提款次数">{{ userInfo.withdrawCount }}</el-descriptions-item>
        <el-descriptions-item label="历史充值次数">{{ userInfo.payCount }}</el-descriptions-item>
        <el-descriptions-item label="资产">{{ toRupee(userInfo.money) }}</el-descriptions-item>

        <el-descriptions-item label="总充值"><span style="color: green">{{ toRupee(userInfo.pay) }}</span></el-descriptions-item>
        <el-descriptions-item label="历史提款"><span style="color:red">{{ toRupee(userInfo.withdrawAmount) }}</span></el-descriptions-item>
        <el-descriptions-item label="提款中">{{ toRupee(userInfo.withdrawing) }}<el-button size="mini" @click="refreshWithdrawing">刷新</el-button></el-descriptions-item>
        <el-descriptions-item label="差额"><span style="color: red">{{ toRupee(userInfo.pay -userInfo.withdrawAmount - userInfo.money - userInfo.withdrawing) }}</span></el-descriptions-item>

        <el-descriptions-item label="基础值">{{ userInfo.baseValue / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="Winning">{{ userInfo.winning / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="Deposit">{{ userInfo.deposit / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="贡献值">{{ userInfo.produceValue / 1000 }}</el-descriptions-item>

        <el-descriptions-item label="邀请数">{{ userInfo.inviteCount }}</el-descriptions-item>
        <el-descriptions-item label="邀请领奖">{{ toRupee(userInfo.invitePrize) }}</el-descriptions-item>
        <el-descriptions-item label="邀请总奖" span="2">{{ toRupee(userInfo.inviteTotalPrize) }}</el-descriptions-item>

        <el-descriptions-item label="首充额度">{{ toRupee(userInfo.firstPayAmount) }}</el-descriptions-item>
        <el-descriptions-item label="最近充值额度">{{ toRupee(userInfo.lastPayAmount) }}</el-descriptions-item>
        <el-descriptions-item label="最近充值" span="2">{{ userInfo.payLastTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      title="发货"
      :visible.sync="retryVisible"
      width="30%"
      :before-close="retryClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="交易状态">{{ proxyOrder.TradeState }}</el-descriptions-item>
        <el-descriptions-item label="描述信息">{{ proxyOrder.BankMsg }}</el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="retryVisible = false">取 消</el-button>
        <el-button type="danger" @click="doDelivery(0)">失 败</el-button>
        <el-button type="success" @click="doDelivery(1)">成 功</el-button>
      </span>
    </el-dialog>

    <!--切换通道重试发货-->
    <el-dialog
      title="切换通道重试发货"
      :visible.sync="retryInfo.show"
      width="30%"
      :before-close="retryClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="原渠道">{{ formatPaySysId(retryInfo.order.PaySysId) }}</el-descriptions-item>
        <el-descriptions-item label="重试渠道">{{ formatPaySysId(retryInfo.paySysId) }}<small v-if="retryInfo.paySysId === retryInfo.order.paySysId" style="color:red; margin-left: 5px">与当前渠道一致</small></el-descriptions-item>
        <el-descriptions-item label="重试方式">{{ showBankCode(retryInfo.payType) }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ retryInfo.order.CardHolderName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ retryInfo.order.PhoneNo }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ retryInfo.order.Mail }}</el-descriptions-item>
        <el-descriptions-item v-if="retryInfo.payType === 103" label="upi">{{ retryInfo.order.AccountNo }}</el-descriptions-item>
        <el-descriptions-item v-else label="银行账号">{{ retryInfo.order.AccountNo }}</el-descriptions-item>
        <el-descriptions-item v-if="retryInfo.payType === 100" label="IFSC">{{ retryInfo.order.BankName }}</el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="retryInfo.show = false">取 消</el-button>
        <el-button :disabled="retryInfo.can" type="primary" @click="toggleChannelRetry">重 试</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="金流概要时间线"
      :visible.sync="drawer.visible"
      direction="ltr"
      size="600px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(ob, index) in drawer.lines"
          :key="index"
          :timestamp="ob.timestamp"
        >
          <span v-if="index!=0" :style="'color:' + ob.color">{{ ob.content }}</span>
          <div v-else>
            <el-row>
              总览
            </el-row>
            <el-row>
              <div style="height:20px;margin-top: 10px">
                付费额度：{{ ob.Pay }} ，付费次数：{{ ob.PayCount }}
              </div>
            </el-row>
            <el-row>
              <div style="height:20px;margin-top: 10px">
                提现额度：{{ -ob.Withdraw }} ，付费次数：{{ ob.WithdrawCount }}
              </div>
            </el-row>
            <el-table
              :data="ob.Games"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="padding:10px;width: 100%"
            >
              <el-table-column
                prop="Game"
                label="游戏"
                width="150"
              />
              <el-table-column
                label="总局数"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.WinCount+scope.row.LoseCount }}
                </template>
              </el-table-column>
              <el-table-column
                label="输赢"
                width="150"
              >
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Win+scope.row.Lose) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-drawer
      title="操作日志"
      :visible.sync="drawerOpLog"
      direction="rtl"
      :before-close="oplogClose"
    >
      <br>
      <el-timeline>
        <el-timeline-item
          v-for="(row, index) in oplogs"
          :key="index"
          :timestamp="row.OperateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')"
        >
          <span style="color:#1890ff">{{ row.Operator }}</span> {{ row.Desc }}
        </el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-drawer
      title="重试日志"
      :visible.sync="retryLog.show"
      direction="rtl"
      :before-close="retryLogClose"
    >
      <br>
      <el-table
        :data="retryLog.table"
        style="width: 100%"
      >
        <el-table-column
          prop="PaySysID"
          label="重试渠道"
        >
          <template slot-scope="{row}">
            {{ formatPaySysId(row.PaySysID) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PaySysOrder"
          label="支付平台订单号"
        />
        <el-table-column
          prop="Remark"
          label="备注"
        />
        <el-table-column
          prop="Operator"
          label="操作人"
        />
        <el-table-column
          prop="OperateTime"
          label="操作时间"
        >
          <template slot-scope="{row}">
            <span>{{ row.OperateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <!--发送邮件-->
    <el-dialog
      title="发送邮件"
      :visible.sync="mail.dialog"
      width="50%"
      :before-close="mailClose"
      center
    >
      <span>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <lang-input v-model="mail.title" />
          </el-form-item>
          <br>
          <el-form-item label="内容">
            <lang-text v-model="mail.context" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mail.dialog = false">取 消</el-button>
        <el-button type="success" @click="openTemplate">选择模板</el-button>
        <el-button type="success" @click="appendCustomerText">客服链接</el-button>
        <el-button type="primary" @click="sendMailSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--邮件模板选择-->
    <el-drawer
      title="模板选择"
      :visible.sync="drawer2.visible"
      direction="ltr"
      size="600px"
    >
      <el-table
        :data="drawer2.items"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickTemplate"
      >
        <el-table-column
          prop="Type"
          label="分类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB2.FilterValueMap['Type']" size="mini" @change="handleFilter2">
              <el-option label="分类" :value="0" />
              <el-option v-for="(o,key) in clientDB2.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB2.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Subtype"
          label="子类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB2.FilterValueMap['Subtype']" size="mini" @change="handleFilter2">
              <el-option label="子类" :value="0" />
              <el-option v-for="(o,key) in clientDB2.FilterMap['Subtype']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB2.GetShowValue('Subtype', scope.row.Subtype) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Title"
          label="说明"
          width="300"
        />
      </el-table>
    </el-drawer>

    <!--批量自动审批-->
    <el-dialog
      title="自动审批表单"
      :visible.sync="auditForm.show"
      width="60%"
      :before-close="auditFormClose"
      center
    >
      <span>
        <el-form ref="form" :model="auditForm" label-width="80px">
          <el-table
            :data="auditForm.selectData"
            style="width: 100%"
          >
            <el-table-column
              prop="Id"
              label="ID"
            />
            <el-table-column
              prop="PaySysId"
              label="代付渠道"
            >
              <template slot-scope="scope">
                {{ formatPaySysId(scope.row.PaySysId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态"
            >
              <template slot-scope="scope">
                {{ showStatus(scope.row.Status, 1) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PaySysChannel"
              label="方式"
            >
              <template slot-scope="scope">
                {{ showBankCode(scope.row.PaySysChannel) }}
              </template>
            </el-table-column>
          </el-table>

          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" type="textarea" :rows="3" placeholder="批量处理的理由" />
          </el-form-item>

          <el-form-item label="代付渠道">
            <el-select v-model.number="auditForm.paySysId" placeholder="请选择">
              <el-option label="无" :value="0">无</el-option>
              <el-option
                v-for="item in auditForm.showPayOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditForm.show = false">取 消</el-button>
        <el-button type="primary" @click="submitBatchAutoAudit">确 定</el-button>
      </span>
    </el-dialog>

    <!--批量切换渠道-->
    <el-dialog
      title="切换支付渠道"
      :visible.sync="toggleChanFrm.show"
      width="60%"
      center
    >
      <span>
        <el-form ref="form" :model="auditForm" label-width="80px">
          <el-table
            :data="auditForm.selectData"
            style="width: 100%"
          >
            <el-table-column
              prop="Id"
              label="ID"
            />
            <el-table-column
              prop="PaySysId"
              label="代付渠道"
            >
              <template slot-scope="scope">
                {{ formatPaySysId(scope.row.PaySysId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态"
            >
              <template slot-scope="scope">
                {{ showStatus(scope.row.Status, 1) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PaySysChannel"
              label="方式"
            >
              <template slot-scope="scope">
                {{ showBankCode(scope.row.PaySysChannel) }}
              </template>
            </el-table-column>
          </el-table>

          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" type="textarea" :rows="3" placeholder="批量处理的理由" />
          </el-form-item>

          <el-form-item label="代付渠道">
            <el-select v-model.number="auditForm.paySysId" placeholder="请选择">
              <el-option label="无" :value="0">无</el-option>
              <el-option
                v-for="item in auditForm.showPayOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleChanFrm.show = false">取 消</el-button>
        <el-button type="primary" @click="submitToggleChan">确 定</el-button>
      </span>
    </el-dialog>

    <!-------------批量自动审批日志----------->
    <el-dialog
      title="自动审批列表"
      :visible.sync="audit.show"
      width="60%"
      :before-close="auditListClose"
    >
      <div class="batch-delivery-preview">
        <el-table
          :data="audit.data"
          style="width: 100%"
        >
          <el-table-column
            prop="Operator"
            label="操作人"
            width="180"
          />
          <el-table-column
            prop="OpType"
            label="操作类型"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.OpType === 2 ? "切换渠道" : "自动审核" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="SubmitTime"
            label="操作时间"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.SubmitTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Remark"
            label="备注"
            width="180"
          />
          <el-table-column
            prop="Order"
            label="订单"
          >
            <template slot-scope="scope">
              <el-table
                :data="scope.row.table"
                style="width: 100%"
              >
                <el-table-column
                  prop="id"
                  label="ID"
                />
                <el-table-column
                  prop="remark"
                  label="结果"
                >
                  <template slot-scope="scope">
                    <el-link v-if="scope.row.remark=='成功'" type="success">成功</el-link>
                    <el-link v-else type="danger">{{ scope.row.remark }}</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <el-col :span="12">
            <div class="block">
              <el-pagination
                :current-page="audit.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="audit.limit"
                layout="slot, total, sizes, prev, next"
                prev-text="上一页"
                next-text="下一页"
                :total="audit.total"
                @size-change="auditSizeChange"
                @current-change="auditCurrentChange"
              >
                <span class="pageSizeInput" style="padding-right: 10px">
                  当前页：{{ audit.page }}/{{ Math.floor((audit.total+audit.limit)/audit.limit) }}
                </span>
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-------------批量自动审批日志----------->

  </div>
</template>
<script>
import { $libDate, $libShow, $libType, ClientTableData, MoneyShow, Pagination } from '@/utils/common'
import request from '@/utils/request'
import store from '@/store'
import PayChannel from '@/components/PayChannel'
import { parseTime } from '@/utils/index'
import LangInput from '@/components/LangInput'
import LangText from '@/components/LangText'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

const filterMap2 = {
  'Type': { 1: '支付', 2: '提现', 3: '登录', 4: '注册', 5: '其他' },
  'Subtype': { 1: '其他' }
}

export default {
  components: { DateTimeShow, PayChannel, LangInput, LangText },
  data() {
    return {
      form: {
        id: 0,
        uid: 0,
        orderNo: '',
        amount: 0,
        source: -1,
        orderByName: 'id',
        orderByDirection: 'DESC',
        applyTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
        finishTime: [],
        status: -1,
        statusOption: [
          { 'label': '所有', 'value': -1 },
          { 'label': '未关闭', 'value': 100 },
          { 'label': '待审核&申请中', 'value': 0 },
          { 'label': '审核通过&提现中', 'value': 1 },
          { 'label': '提现成功&已到账', 'value': 2 },
          { 'label': '拒绝且退款', 'value': 3 },
          { 'label': '拒绝不退款', 'value': 4 },
          { 'label': '用户取消并退款', 'value': 5 },
          { 'label': '挂起', 'value': 6 },
          { 'label': '失败可重试', 'value': 7 },
          { 'label': '锁定中', 'value': 8 },
          { 'label': '提现失败', 'value': 9 },
          { 'label': '观察', 'value': 10 }
        ],
        bankCode: 0,
        bankCodeOption: [
          { 'label': '所有', 'value': 0 },
          { 'label': 'Bank', 'value': 100 },
          // { 'label': 'NEFT', 'value': 101 },
          // { 'label': 'RTGS', 'value': 102 },
          { 'label': 'UPI', 'value': 103 }
        ],
        tags: [],
        tagOption: [
          { 'label': '所有', 'value': '' },
          { 'label': '同IP', 'value': '同IP' },
          { 'label': '同设备', 'value': '同设备' },
          { 'label': '同收款账号', 'value': '同收款账号' },
          { 'label': '先充后玩', 'value': '先充后玩' },
          { 'label': '先充5000后玩', 'value': '先充5000后玩' },
          { 'label': '先充10000后玩', 'value': '先充10000后玩' },
          { 'label': '先充20000后玩', 'value': '先充20000后玩' }
        ],
        passType: 0,
        passTypeOption: [
          { 'label': '所有', 'value': 0 },
          { 'label': '自动', 'value': 1 },
          { 'label': '人工', 'value': 2 },
          { 'label': '切换渠道重试', 'value': 3 }
        ],
        appId: 0,
        appIdOption: [],
        accountNo: '',
        payChannel: 0,
        operator: '',
        auditCnt: 0,
        operatorOption: [
          'yoyo',
          'dog001',
          'pear123',
          'apple123',
          'pear168',
          'tiger1234',
          'lion',
          'wolf',
          'shark',
          'dolphin'
        ],
        channelMap: {} // 接收channel map映射
      },
      operator: this.$store.getters.name,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      libShow: $libShow,
      total: 0, // 总记录数
      autoAuditCnt: 0, // 自动审核记录数
      pageInfo: new Pagination(0, 10),
      /* page: 1,
      limit: 10,*/
      tableData: [],
      remarkVisible: false,
      remarkForm: {
        id: 0,
        remark: '',
        originRemark: '', // 修改之前的备注
        hasPending: false // 是否挂起订单
      },
      userinfoVisible: false,

      typeNames: { 2: '通过', 3: '留意', 4: '危险' },
      checks: [],
      drawer: {
        visible: false,
        lines: []
      },
      libMoney: new MoneyShow(['MoneyChanged', 'MoneyNow', 'MoneyAll']),
      hasEditPerm: false,
      userInfo: {
        Uid: 0,
        Amount: 0,
        withdrawing: 0,
        isFirstPay: false, // 是否首充
        firstPayAmount: 0, // 首充额度
        firstPayGames: {
          'ab': 20,
          '7up': 23
        }, // 首充前玩牌游戏和局数
        money: 0, // 当前总资产
        pay: 0, // 总充值
        payLastTime: 0, // 最近一次充值时间
        lastPayAmount: 0, // 最近一次充值额度
        withdrawCount: 0, // 历史提款次数
        withdrawAmount: 0, // 历史提款总额
        baseValue: 0 // 当前基础值
      },
      retryVisible: false,
      proxyOrder: {
        Uid: 0, // 用户id
        WithdrawId: 0, // 提现ID
        TradeState: '', // 交易状态
        BankMsg: '' // 交易状态描述信息
      },
      fullscreenLoading: false,
      canRetryWithdraw: true, // 是否可以重试提现
      tempLoading: {},
      oplogs: [],
      drawerOpLog: false,

      // 切换通道重试
      retryInfo: { // 重试信息
        show: false, // 是否显示dialog
        can: false, // 是否可以重试
        order: {}, // 当前重试订单
        paySysId: 0, // 重试支付渠道
        payType: 0 // 提现方式
      },

      retryLog: {
        show: false, // 是否显示
        table: [] // 数据列表
      },

      exportData: [],

      // 发送邮件
      mail: {
        dialog: false,
        uid: 0,
        title: '',
        context: ''
      },

      env: store.getters.env,

      // 邮箱模板选择
      drawer2: {
        visible: false,
        items: []
      },
      clientDB2: new ClientTableData([], 100, filterMap2),

      // 自动审批列表
      audit: {
        show: false,
        data: [],
        page: 1,
        limit: 10,
        total: 0
      },
      auditForm: {
        orderIds: [], // 自动审核订单号
        remark: '', // 备注
        paySysId: 0, // 代付渠道
        selectData: [], // 选择数据

        show: false,
        payOption: [],

        androidOption: [], // 安卓支付渠道选项
        galaxyOption: [], // galaxy支付渠道选项
        noneOption: [{
          label: '没有可用渠道',
          value: 0,
          desc: ''
        }], // 异常支付渠道选项
        showPayOption: [] // 展示支付选项
      },
      payChannels: [],

      // 切换渠道
      toggleChanFrm: {
        show: false
      },

      // 同收款账号充提比
      sameAccountNoDesc: '总充值 / 总提现 = 充提比; 10000 / 100 = 20.1% ',
      alertColor: 'error',
      showAlert: false
    }
  },
  created() {
    console.log(store.getters.env)
    const pers = store.getters.pers
    this.hasEditPerm = (pers['WITHDRAW'] & 2) > 0
    this.getAppIdList()
    this.getPayChannelCfg()
  },
  methods: {
    hasBR() {
      return this.isBR()
    },
    // 自动审批列表
    auditListClose(done) {
      this.audit.show = false
      done()
    },
    auditSizeChange(limit) {
      this.audit.limit = limit
      this.queryAuditList()
    },
    auditCurrentChange(page) {
      this.audit.page = page
      this.queryAuditList()
    },
    auditFormClose(done) {
      this.auditForm.show = false
      done()
    },
    showAuditForm() {
      this.refreshShowPayOption()
      this.auditForm.show = true
    },
    showToggleChanFrm() {
      this.refreshShowPayOption()
      this.toggleChanFrm.show = true
    },
    selectDataChange(data) {
      console.log('全选数据', data)
      this.auditForm.selectData = data
    },
    queryAuditList() { // 获取自动审核列表
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/batch/auto/audit/list',
          Env: store.getters.env,
          page: this.audit.page,
          limit: this.audit.limit
        }
      }).then(response => {
        console.log('audit list response', response)
        if (response.RetCode === 0) {
          if ($this.audit.page === 1) {
            $this.audit.total = response.Data.total
          }
          for (const i in response.Data.rows) {
            const orderTable = []
            const all = JSON.parse(response.Data.rows[i]['Order'])
            const pass = response.Data.rows[i]['OrderPass'] ? JSON.parse(response.Data.rows[i]['OrderPass']) : []
            const fail = response.Data.rows[i]['OrderFailed'] ? JSON.parse(response.Data.rows[i]['OrderFailed']) : {}
            for (const k in all) {
              let remark = ''
              if (pass && pass.indexOf(all[k]) >= 0) {
                remark = '成功'
              } else if (fail && fail[all[k]]) {
                remark = fail[all[k]]
              } else {
                remark = '处理中'
              }
              orderTable.push({
                id: all[k],
                remark: remark
              })
              response.Data.rows[i]['table'] = orderTable
            }
          }

          console.log('response rows ', response.Data.rows)

          $this.audit.data = response.Data.rows
          $this.audit.show = true
        } else {
          $this.$message.error('操作失败')
        }
      })
    },
    submitBatchAutoAudit() { // 提交自动审核订单
      const $this = this
      const ids = this.getAuditOrder()
      if (!ids || ids.length <= 0) {
        console.log('ids', ids)
        return
      }
      const orderIds = JSON.stringify(ids)
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/submit/withdraw/batch/auto/audit',
          operator: this.$store.getters.name,
          remark: this.auditForm.remark,
          paySysId: this.auditForm.paySysId,
          orderIds: orderIds
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.auditForm.show = false
          $this.$message.success('提交成功，程序正在处理')
        } else {
          $this.$message.error('操作失败')
        }
        $this.auditForm.paySysId = 0
        $this.loadingClose()
      })
    },
    submitToggleChan() { // 批量切换渠道
      const $this = this
      const ids = this.getAuditOrder()

      if (!ids || ids.length <= 0) {
        console.log('ids', ids)
        return
      }
      const orderIds = JSON.stringify(ids)
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/toggle/chan',
          operator: this.$store.getters.name,
          remark: this.auditForm.remark,
          paySysId: this.auditForm.paySysId,
          orderIds: orderIds
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.toggleChanFrm.show = false
          $this.$message.success('切换成功')
          $this.getData()
        } else {
          $this.$message.error('操作失败')
        }
        $this.auditForm.paySysId = 0
        $this.loadingClose()
      })
    },
    getAuditOrder() {
      const pay = this.getPayChannel(this.auditForm.paySysId)
      if (!pay || pay.Id <= 0) {
        this.$message.error('请选择代付渠道')
        return []
      }
      if (pay['withdrawMethod'].length === 0) {
        this.$message.error('代付方式异常')
        return []
      }
      const payMethod = []
      for (const i in pay['withdrawMethod']) {
        payMethod.push(pay['withdrawMethod'][i]['value'])
      }

      console.log('pay method', payMethod)

      let hit = true
      const ids = []
      for (const i in this.auditForm.selectData) {
        if (this.auditForm.selectData[i].Status !== 0) {
          hit = false
          this.$message.error('有非申请状态订单，id=' + this.auditForm.selectData[i].Id)
          break
        } else if (payMethod.indexOf(this.auditForm.selectData[i]['PaySysChannel']) === -1) {
          hit = false
          this.$message.error('该订单不支持代付方式，id=' + this.auditForm.selectData[i]['Id'])
          break
        } else {
          ids.push(this.auditForm.selectData[i].Id)
        }
      }

      if (!hit) {
        return []
      } else {
        return ids
      }
    },
    getPayChannelCfg() { // 获取支付渠道配置
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/pay/channel/cfg',
          Env: store.getters.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.payChannels = response.Data
          $this.getAllPayToggleCfg()
        } else {
          $this.$message.error('操作失败')
        }
      })
    },
    getAllPayToggleCfg() { // 获取所有支付渠道切换配置
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/all/pay/toggle/config',
          Env: store.getters.env
        }
      }).then(response => {
        console.log('可用支付渠道', response)
        if (response.RetCode === 0) {
          const androidAvailabel = []
          const galaxyAvailabel = []
          for (const i in response.Data.android.Withdraw.Rules) {
            const rule = response.Data.android.Withdraw.Rules[i]
            if (rule.OK === 1) {
              androidAvailabel.push(rule.Channel)
            }
          }

          for (const i in response.Data.galaxy.Withdraw.Rules) {
            const rule = response.Data.galaxy.Withdraw.Rules[i]
            if (rule.OK === 1) {
              galaxyAvailabel.push(rule.Channel)
            }
          }

          $this.auditForm.androidOption = []
          $this.auditForm.galaxyOption = []
          for (const i in $this.payChannels) {
            let name = ''
            if ($this.payChannels[i]['withdrawMethod'] && $this.payChannels[i]['withdrawMethod'].length > 0) {
              for (const k in $this.payChannels[i]['withdrawMethod']) {
                if (k > 0) {
                  name += ' / '
                }
                name += $this.payChannels[i]['withdrawMethod'][k]['name']
              }
            }

            const row = {
              label: $this.payChannels[i]['payChannelName'],
              value: $this.payChannels[i]['payChannel'],
              desc: name
              // tag: response.Data[i]['withdrawMethod'].length
            }

            console.log('渠道id', $this.payChannels[i]['payChannel'])

            if ($this.payChannels[i]['platform'] === 'android') {
              if (androidAvailabel.indexOf($this.payChannels[i]['payChannel']) >= 0) {
                $this.auditForm.androidOption.push(row)
              }
            } else {
              if (galaxyAvailabel.indexOf($this.payChannels[i]['payChannel']) >= 0) {
                $this.auditForm.galaxyOption.push(row)
              }
            }
          }

          console.log('安卓', $this.auditForm.androidOption)
          console.log('盖乐世', $this.auditForm.galaxyOption)
        } else {
          $this.$message.error('操作失败')
        }
      })
    },
    refreshShowPayOption() {
      let app = 0
      if (this.auditForm.selectData && this.auditForm.selectData.length > 0) {
        app = this.auditForm.selectData[0]['AppId']
      }
      if (app === 0) {
        this.auditForm.showPayOption = this.auditForm.noneOption
      } else if (app <= 100000) {
        this.auditForm.showPayOption = this.auditForm.androidOption
      } else {
        this.auditForm.showPayOption = this.auditForm.galaxyOption
      }
    },
    getPayChannel(paySysId) {
      let option = {}
      for (const i in this.payChannels) {
        if (this.payChannels[i].payChannel === paySysId) {
          option = this.payChannels[i]
          break
        }
      }

      return option
    },
    showSource(source) {
      switch (source) {
        case 0:
          return '大厅'
        case 1:
          return '邀请'
        default:
          return source
      }
    },
    monitorFailed(order) { // 模拟提现失败
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/monitor/failed',
          Env: store.getters.env,
          Id: order.Id
        }
      }).then(response => {
        console.log('appid list response', response)
        if (response.RetCode === 0) {
          order.Status = 1
          $this.refreshTableRow(order)
          $this.$message.success('操作成功')
        } else {
          $this.$message.error('操作失败')
        }
      })
    },
    // 获取提现appId列表
    getAppIdList() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/withdraw/appid/list',
          Env: store.getters.env
        }
      }).then(response => {
        console.log('appid list response', response)
        if (response.RetCode === 0) {
          $this.form.appIdOption = []
          for (const i in response.Data) {
            $this.form.appIdOption.push({
              label: response.Data[i],
              value: response.Data[i]
            })
          }
        }
      })
    },
    // 跳转到用户信息查询页面
    goUserInfo(uid) {
      // this.setIntoStorage(uid)
      this.$router.push({
        path: '/player/userManage',
        query: {
          uid: uid
        }
      })
    },
    // 选择模板
    appendCustomerText() {
      let txt = { 'en': '', 'hi': '' }
      if (this.mail.context && this.mail.context.length > 0) {
        txt = JSON.parse(this.mail.context)
      }
      txt.en += '[Contact Customer Service](http://www.openaihelp.com)'
      txt.hi += '[ग्राहक सेवा से सम्पर्क करें](http://www.openaihelp.com)'
      this.mail.context = JSON.stringify(txt)
    },
    clearFilter2() {
      this.clientDB2.ClearFilterMap()
      this.refreshShow2()
    },
    handleFilter2() {
      this.clientDB.FilterData()
      this.refreshShow2()
    },
    refreshShow2() {
      this.drawer2.items = this.clientDB2.GetCurrentPageData()
    },
    clickTemplate(row, column, event) {
      this.mail.title = JSON.stringify({
        'en': row.Title1,
        'hi': row.Title2
      })
      this.mail.context = JSON.stringify({
        'en': row.Content1,
        'hi': row.Content2
      })
      this.drawer2.visible = false
    },
    openTemplate() {
      const $this = this
      if (this.clientDB2.TotalData.length === 0) {
        request({
          url: '/mail/all/templates',
          method: 'get',
          data: {}
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            this.drawer2.items = objs
            this.clientDB2 = new ClientTableData(objs, 100, filterMap2, 'ID', -1)
            $this.drawer2.visible = true
          }
        })
      } else {
        this.drawer2.visible = true
      }
    },

    // 发送邮件
    sendMail(row) {
      this.mail.uid = row.Uid
      this.mail.dialog = true
    },
    sendMailSubmit() {
      console.log('mail', this.mail)
      const $this = this
      if (!this.mail.title) {
        this.$message.error('邮箱标题不能为空')
        return
      }
      if (!this.mail.context) {
        this.$message.error('邮箱内容不能为空')
        return
      }

      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/send/mail',
          Env: store.getters.env,
          Type: 2,
          Titles: this.mail.title,
          Contents: this.mail.context,
          ExpireTime: 0,
          Uids: this.mail.uid,
          MailType: 2,
          ExtInfo: ''
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('邮件发送成功！')
          $this.mail.dialog = false
          $this.mail.title = ''
          $this.mail.context = ''
        }
      })
    },
    mailClose(done) {
      this.mail.dialog = false
      done()
    },
    copyText(txt) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', txt)
      input.select()
      document.execCommand('copy') // 执行浏览器复制命令
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功')
      }
      document.body.removeChild(input)
    },
    showAutoAuditRatio() {
      if (this.total <= 0) {
        return 0
      }

      return (this.autoAuditCnt / this.total * 100).toFixed(2) + '%'
    },
    showRetryLog(order) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/retry/log',
          id: order.Id
        }
      }).then(response => {
        console.log('retry log', response)
        if (response.RetCode === 0) {
          $this.retryLog.show = true
          $this.retryLog.table = response.Data
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    retryLogClose(done) {
      this.retryLog.show = false
      done()
    },
    refreshTableRow(row) {
      for (const i in this.tableData) {
        if (this.tableData[i].Id === row.Id) {
          this.tableData[i] = row
        }
      }
    },
    canRetry(order) {
      const $this = this
      this.$confirm('你跟支付平台确认该笔订单是失败的吗？', '提示')
        .then(() => {
          $this.canRetryApi(order)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    setObserve(id) {
      const $this = this
      this.$confirm('确定设置成观察状态吗，设置之后用户可退款？', '提示')
        .then(() => {
          $this.updateStatus(id, 10)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    canRetryApi(order) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/update/can/retry',
          id: order.Id,
          operator: this.$store.getters.name
        }
      }).then(response => {
        console.log('can retry', response)
        if (response.RetCode === 0) {
          order.Status = 7
          $this.refreshTableRow(order)
          $this.$message.success('更新成功')
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    getRetryInfo(order) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/retry/info',
          id: order.Id
        }
      }).then(response => {
        console.log('retry info', response)
        if (response.RetCode === 0) {
          $this.retryInfo.show = true
          $this.retryInfo.order = order
          $this.retryInfo.paySysId = response.Data.paySysId
          $this.retryInfo.payType = response.Data.payType

          // 如果没有推荐渠道，取渠道列表里的
          if (response.Data.paySysId <= 0) {
            if (response.Data.list && response.Data.list.length > 0) {
              $this.retryInfo.paySysId = response.Data.list[0]
            } else {
              $this.$message.error('没有可用渠道')
            }
          }
        } else {
          $this.$message.error('获取失败')
        }
      })
    },
    toggleChannelRetry() { // 切换通道重试
      const $this = this
      if (this.retryInfo.paySysId <= 0) {
        $this.$message.error('没有可用渠道')
        return
      }

      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/toggle/channel/withdraw/retry',
          id: this.retryInfo.order.Id,
          paySysId: this.retryInfo.paySysId,
          operator: this.$store.getters.name
        }
      }).then(response => {
        console.log('retry response ', response)
        if (response.RetCode === 0) {
          if (response.Data.code == 2022) {
            $this.retryInfo.order.Status = 9
            $this.refreshTableRow($this.retryInfo.order)
            $this.$message.success('重试失败，用户可退')
          } else {
            $this.retryInfo.order.PaySysId = response.Data.paySysId
            $this.retryInfo.order.PaySysOrder = response.Data.paySysOrder
            $this.retryInfo.order.Status = 1
            $this.refreshTableRow($this.retryInfo.order)
            $this.$message.success('重试成功，银行处理中...')
          }
        } else {
          $this.$message.error('重试失败')
        }
      })
    },
    formatPaySysId(paySysId) {
      // eslint-disable-next-line no-prototype-builtins
      return this.form.channelMap.hasOwnProperty(paySysId) ? this.form.channelMap[paySysId] : '-'
    },
    oplogClose(done) {
      this.drawerOpLog = false
      done()
    },
    retryClose(done) {
      this.retryVisible = false
      done()
    },
    toRupee(amount) {
      return parseInt(amount) / 1000
    },
    getTypeName(sType) {
      return this.typeNames[sType]
    },
    editRemark(row, col, cell, event) {
      // eslint-disable-next-line no-prototype-builtins
      if (col.hasOwnProperty('columnKey') && col.columnKey === 'remark') {
        this.remarkForm.id = row.Id
        this.remarkForm.remark = row.Remark
        this.remarkForm.hasPending = false
        this.remarkVisible = true
      }
    },

    updateRemark() {
      if (this.remarkForm.id === 0) {
        console.log('remark form', this.remarkForm)
        this.$message.error('id异常')
        return
      }
      if (this.remarkForm.remark && this.remarkForm.remark === this.remarkForm.originRemark) {
        // 备注不需要更新，只更新状态
        if (this.remarkForm.hasPending) {
          this.updateStatus(this.remarkForm.id, 6)
          this.remarkForm.hasPending = false
        }
        this.remarkVisible = false
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/update/remark',
          id: this.remarkForm.id,
          remark: this.remarkForm.remark,
          operator: this.$store.getters.name
        }
      }).then(response => {
        console.log('update remark', response)
        if (response.RetCode === 0) {
          $this.$message.success('更新成功')
          $this.remarkVisible = false
          for (const i in $this.tableData) {
            if ($this.tableData[i].Id === $this.remarkForm.id) {
              $this.tableData[i].Remark = $this.remarkForm.remark
            }
          }

          if ($this.remarkForm.hasPending) {
            $this.updateStatus($this.remarkForm.id, 6)
            $this.remarkForm.hasPending = false
          }
        } else {
          $this.$message.error('更新失败')
        }
      })
    },
    remarkVisibleClose(done) {
      this.remarkVisible = true
      done()
    },
    userinfoVisibleClose(done) {
      this.userinfoVisible = true
      done()
    },
    userinfoSubmit() {
      // 关闭弹窗
      this.userinfoVisible = false
      // 判断是否需要进行下一步操作
    },
    loading() {
      this.tempLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    loadingClose() {
      const $this = this
      setTimeout(function() {
        $this.tempLoading.close()
      }, 1000)
    },
    logs(row) { // 查询代付订单
      const $this = this
      const id = row.Id
      const applyTime = row.CreateTime
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/oplog',
          id: id,
          applyTime: applyTime
        }
      }).then(response => {
        console.log('withdraw oplog ', response)
        if (response.RetCode !== 0) {
          $this.$message.error(response.Data)
        } else {
          $this.oplogs = response.Data
          $this.drawerOpLog = true
        }
      })
    },
    pass(id) {
      const $this = this
      this.$confirm('确定通过审核吗？', '提示')
        .then(() => {
          $this.updateStatus(id, 1)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    pending(row) {
      const $this = this
      this.$confirm('确定要挂起吗？', '提示')
        .then(() => {
          // 先弹备注，然后再更新状态
          $this.remarkForm.id = row.Id
          $this.remarkForm.remark = row.Remark
          $this.remarkForm.originRemark = row.Remark
          $this.remarkForm.hasPending = true
          $this.remarkVisible = true
          // $this.updateStatus(id, 6)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    queryProxyOrder(order) { // 查询代付订单
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/winpay/proxy/order',
          id: order.Id,
          uid: order.Uid
        }
      }).then(response => {
        console.log('proxy order ', response)
        $this.retryVisible = true
        if (response.RetCode !== 0) {
          $this.$message.error(response.Data)
          $this.proxyOrder = {
            Uid: order.Uid,
            WithdrawId: order.Id
          }
        } else {
          let tradeState = ''
          $this.canRetryWithdraw = true
          switch (response.Data.status) {
            case 1:
              tradeState = '已提现成功'
              break
            case 2:
              tradeState = '失败'
              $this.canRetryWithdraw = false
              break
            case 3:
              tradeState = '处理中'
              break
            default:
              tradeState = '未知状态'
          }

          $this.proxyOrder = {
            Uid: order.Uid,
            WithdrawId: order.Id,
            TradeState: tradeState, // 交易状态
            BankMsg: response.Data.msg // 交易状态描述信息
          }
        }
      })
    },
    doDelivery(status) { // 发货
      const $this = this
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/manual/delivery',
          id: this.proxyOrder.WithdrawId,
          operator: this.$store.getters.name,
          status: status
        }
      }).then(response => {
        console.log('proxy order ', response)
        this.loadingClose()
        if (response.RetCode !== 0) {
          $this.$message.error(response.Data)
        } else {
          $this.$message.success('操作成功')
          $this.retryVisible = false
          $this.getData()
        }
      })
    },
    retryDelivery() { // 重试发货
      const $this = this
      $this.canRetryWithdraw = true
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/retry/withdraw/delivery',
          id: this.proxyOrder.WithdrawId,
          uid: this.proxyOrder.Uid,
          operator: this.$store.getters.name
        }
      }).then(response => {
        console.log('proxy order ', response)
        this.loadingClose()
        if (response.RetCode !== 0) {
          $this.$message.error(response.Data)
        } else {
          $this.$message.success('发货成功')
          $this.retryVisible = false
        }
      })
    },
    refuseAndRefund(id) {
      const $this = this
      this.$confirm('确定拒绝且退款吗？', '提示')
        .then(() => {
          $this.updateStatus(id, 3)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    refuseNoRefund(id) {
      const $this = this
      this.$confirm('确定拒绝且不退款吗？', '提示')
        .then(() => {
          $this.updateStatus(id, 4)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    withdrawFailed(id) {
      const $this = this
      this.$confirm('设置成失败订单，用户可以手动点击取消提现并退款，确定提交吗？', '提示')
        .then(() => {
          $this.updateStatus(id, 9)
        })
        .catch(() => {
          console.log('取消操作')
        })
    },
    updateStatus(id, status) {
      const $this = this
      // this.fullscreenLoading = true
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdraw/update/status',
          id: id,
          status: status,
          operator: this.$store.getters.name
        }
      }).then(response => {
        // this.fullscreenLoading = false
        $this.loadingClose()
        console.log('update status', response)
        if (response.RetCode === 0) {
          $this.$message.success('操作成功')
          for (const i in $this.tableData) {
            if ($this.tableData[i].Id === id) {
              $this.tableData[i].Status = status
            }
          }
        } else {
          for (const i in $this.tableData) {
            if ($this.tableData[i].Id === id) {
              $this.tableData[i].Status = 8
            }
          }
          $this.$message.error(response.Data)
        }
      })
    },
    showPassType(type) {
      switch (type) {
        case 1:
          return '自动'
        case 2:
          return '人工'
        case 3:
          return '切换渠道重试'
        default:
          return '-'
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
    showStatus(status, iType) {
      let name = ''
      let color = ''
      switch (status) {
        case 0:
          name = '待审核'
          color = 'red'
          break
        case 1:
          name = '通过&三方处理'
          color = 'green'
          break
        case 2:
          name = '成功&已到账'
          color = 'green'
          break
        case 3:
          name = '拒绝且退款'
          color = 'gray'
          break
        case 4:
          name = '拒绝不退款'
          color = 'gray'
          break
        case 5:
          name = '用户取消'
          color = 'gray'
          break
        case 6:
          name = '挂起'
          color = 'gray'
          break
        case 7:
          name = '失败，可重试'
          color = 'gray'
          break
        case 8:
          name = '锁定中'
          color = 'red'
          break
        case 9:
          name = '失败,用户可退'
          color = 'red'
          break
        case 10:
          name = '观察'
          color = 'red'
          break
      }
      return iType == 1 ? status + '.' + name : color
    },
    showBankCode(bankCode) {
      switch (bankCode) {
        case 100:
          return 'Bank'
        case 101:
          return 'NEFT'
        case 102:
          return 'RTGS'
        case 103:
          return 'UPI'
        default:
          return '-'
      }
    },
    showAccountNo(row) {
      if (row.PaySysChannel === 103) {
        return row.AccountNo
      }
      return ''
    },
    showBankNo(row) {
      if (row.PaySysChannel !== 103) {
        return row.AccountNo
      }
      return ''
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.SetPageNum(val)
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageInfo.SetPageNo(val)
      this.getData()
    },
    refreshWithdrawing() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/withdrawing/refresh',
          Uid: this.userInfo.Uid
        }
      }).then(response => {
        console.log('刷新提现中信息成功', response.Data)
        $this.userInfo.withdrawing = response.Data
      })
    },
    showUserInfo(obj) {
      const uid = obj.Uid
      const amount = obj.Amount
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/userinfo',
          uid: uid
        }
      }).then(response => {
        console.log('withdraw userinfo', response)
        if (response.Data) {
          $this.userInfo = response.Data
          $this.userinfoVisible = true
          $this.userInfo.Amount = amount
          $this.userInfo.Uid = uid

          // 计算提示项
          const user = $this.userInfo
          let val = this.toRupee(user.pay - user.withdrawAmount - user.withdrawing - user.money)
          let iType = 2
          let sNote = ''
          const rate = (user.withdrawAmount + user.withdrawing + user.money) / user.pay
          // 计算资产信息
          if (val >= 0) {
            iType = 2
            sNote = '大于等于0，安全'
          } else if (rate < 2) {
            iType = 3
            sNote = '资产+提款 为 充值的 1-2倍之间:' + this.formatNumber(rate)
          } else {
            iType = 4
            sNote = '资产+提款 为 充值的 2倍以上:' + this.formatNumber(rate)
          }
          $this.checks = [{ Title: '充值剩余值', Content: '充值-提款-资产', Value: val, Note: sNote, Type: iType }]

          // 计算基础值与资产的关系
          val = this.toRupee(user.baseValue - user.money)
          if (val >= 0) {
            iType = 2
            sNote = '大于等于0，安全'
          } else {
            iType = 3
            sNote = '小于0'
          }
          $this.checks.push({ Title: '资产与基础值', Content: '基础值 - 资产', Value: val, Note: sNote, Type: iType })

          // 查看邀请奖励领取情况
          val = this.toRupee(user.inviteTotalPrize - user.invitePrize)
          if (val >= 100) {
            iType = 3
            sNote = '大于100，留意'
          } else {
            iType = 2
            sNote = '安全'
          }
          $this.checks.push({ Title: '邀请奖励领取情况', Content: '邀请奖励', Value: val, Note: sNote, Type: iType })
        }
      })
    },
    showDrawer() {
      const $this = this
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      const bTime = parseInt($libDate.SelectTimeToIndiaByZone(start.getTime()) / 1000)
      const eTime = parseInt($libDate.SelectTimeToIndiaByZone(end.getTime()) / 1000)

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/moneylog',
          Uid: this.userInfo.Uid,
          BTime: bTime,
          ETime: eTime,
          Type: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          objs = $this.libMoney.TransForShow(objs)
          $this._showDrawer(objs)
        }
      })
    },
    getSlotsName(actMsg) {
      let slotsName = actMsg
      if (actMsg.indexOf('凤凰') >= 0) {
        slotsName = '凤凰'
      } else if (actMsg.indexOf('睡美人') >= 0) {
        slotsName = '睡美人'
      } else if (actMsg.indexOf('阿拉丁') >= 0) {
        slotsName = '阿拉丁'
      } else if (actMsg.indexOf('印度Ganesha') >= 0) {
        slotsName = '印度Ganesha'
      } else if (actMsg.indexOf('小丑') >= 0) {
        slotsName = '小丑'
      } else if (slotsName.indexOf('-') >= 0) {
        const arr = slotsName.split('-')
        slotsName = arr[0]
      }
      return slotsName
    },
    _showDrawer(objs) {
      this.drawer.visible = true
      objs = objs.sort(function(a, b) {
        return a.ID - b.ID
      })
      const timeArr = []
      let gameName = ''
      let preTime = 0
      for (let i = 0; i < objs.length; i++) {
        let obj = objs[i]
        if (obj.MoneyType !== 1 && obj.MoneyType !== 2) {
          continue
        }
        switch (obj.ActType) {
          case 1: // 注册
            timeArr.push({ Time: obj.UpdateTime, ActType: obj.ActType })
            break
          case 18:// 重置基础值
            timeArr.push({
              Time: obj.UpdateTime,
              ActType: obj.ActType,
              MoneyChanged: obj.MoneyChanged,
              MoneyNow: obj.MoneyNow,
              Money: obj.MoneyAll
            })
            break
          case 20:// 领取Bonus
            timeArr.push({
              Time: obj.UpdateTime,
              ActType: obj.ActType,
              MoneyChanged: obj.MoneyChanged,
              MoneyNow: obj.MoneyNow,
              Money: obj.MoneyAll
            })
            break
          case 2:// 充值
            if (obj.MoneyType == 1) {
              timeArr.push({
                Time: obj.UpdateTime,
                ActType: obj.ActType,
                MoneyChanged: obj.MoneyChanged,
                MoneyNow: obj.MoneyNow,
                Money: obj.MoneyAll
              })
            }
            break
          case 15:// 提现
            if (obj.MoneyType == 2) {
              timeArr.push({
                Time: obj.UpdateTime,
                ActType: obj.ActType,
                MoneyChanged: obj.MoneyChanged,
                MoneyNow: obj.MoneyNow,
                Money: obj.MoneyAll
              })
            }
            break
          case 1001:
          case 1000:
          case 33:
            gameName = objs[i].ActMsg === 'sweeper' ? 'Sweeper' : objs[i].ActMsg
            const item = {
              Time: obj.UpdateTime,
              Game: gameName,
              ActType: 1000,
              Lose: 0,
              LoseCount: 0,
              Win: 0,
              WinCount: 0
            }

            while (obj.ActMsg.toLowerCase() == gameName.toLowerCase() && (obj.ActType == 1000 || obj.ActType == 1001 || obj.ActType == 33)) {
              if (obj.MoneyType == 1 || obj.MoneyType == 2) {
                if (obj.UpdateTime != preTime) {
                  preTime = obj.UpdateTime
                  if (obj.MoneyChanged < 0) {
                    item.LoseCount++
                  } else {
                    item.WinCount++
                  }
                }
                if (obj.MoneyChanged < 0) {
                  item.Lose += obj.MoneyChanged
                } else {
                  item.Win += obj.MoneyChanged
                }
                item.Money = obj.MoneyAll
              }
              i++
              if (i === objs.length) {
                break
              }
              obj = objs[i]
              while (obj.ActType == 38 || obj.ActType == 14) { // 跳过bonus记录和发送表情
                i++
                if (i === objs.length) {
                  break
                }
                obj = objs[i]
              }
            }
            timeArr.push(item)
            i--
            break
          case 29:
          case 30:
          case 31:
          case 32:
            gameName = this.getSlotsName(obj.ActMsg)
            const slotsItem = {
              Time: obj.UpdateTime,
              Game: gameName,
              ActType: 29,
              Times: 0,
              Bet: 0,
              Win: 0
            }

            while (this.getSlotsName(obj.ActMsg) == gameName && (obj.ActType == 29 || obj.ActType == 30 || obj.ActType == 31 || obj.ActType == 32)) {
              if (obj.MoneyType == 1 || obj.MoneyType == 2) {
                if (obj.ActType == 29) { // 下注动作
                  slotsItem.Times++
                  slotsItem.Bet -= obj.MoneyChanged
                } else {
                  slotsItem.Win += obj.MoneyChanged
                }
                slotsItem.Money = obj.MoneyAll
              }
              i++
              if (i === objs.length) {
                break
              }
              obj = objs[i]
              while (obj.ActType == 38 || obj.ActType == 14) { // 跳过bonus记录和发送表情
                i++
                if (i === objs.length) {
                  break
                }
                obj = objs[i]
              }
            }
            timeArr.push(slotsItem)
            i--
            break
        }
      }
      this.drawer.lines = [{ cnt: '', color: '', t: '总计' }]
      let pay = 0
      let withdraw = 0
      let payCount = 0
      let withdrawCount = 0
      const gameMap = {}
      let game = ''
      for (const o in timeArr) {
        let cnt, color
        const t = this.formatTime(timeArr[o].Time)
        switch (timeArr[o].ActType) {
          case 1:
            cnt = '用户注册'
            color = 'black'
            break
          case 2:
            cnt = '充值。额度：' + timeArr[o].MoneyChanged + '，当前资产：' + timeArr[o].Money
            color = 'green'
            pay += timeArr[o].MoneyChanged
            payCount++
            break
          case 17:
            cnt = '邀请提现。额度：' + timeArr[o].MoneyChanged + '，当前资产：' + timeArr[o].Money
            color = 'green'
            break
          case 15:
            if (timeArr[o].MoneyChanged < 0) {
              cnt = '提现。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
              color = 'red'
              withdraw += timeArr[o].MoneyChanged * 100 / 97
              withdrawCount++
            } else {
              cnt = '提现撤回。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
              color = 'green'
              withdraw += timeArr[o].MoneyChanged
              withdrawCount--
            }
            break
          case 20:
            cnt = 'Bonus。额度：' + timeArr[o].MoneyChanged + '，资产：' + timeArr[o].Money
            color = 'blue'
            break
          case 18:
            cnt = '重置基础值。重置前：' + timeArr[o].MoneyNow + '，重置后：' + timeArr[o].MoneyNow + '，资产：' + timeArr[o].Money
            break
          case 1000:
            cnt = timeArr[o].Game + ':' + (timeArr[o].WinCount + timeArr[o].LoseCount) + '局，输赢：' + this.formatNumber(timeArr[o].Lose + timeArr[o].Win) +
              '，赢：' + timeArr[o].WinCount + '，输：' + timeArr[o].LoseCount + '，资产：' + timeArr[o].Money
            game = timeArr[o].Game
            if (!gameMap[game]) {
              gameMap[game] = { WinCount: 0, LoseCount: 0, Win: 0, Lose: 0 }
            }
            gameMap[game].Game = game
            gameMap[game].WinCount += timeArr[o].WinCount
            gameMap[game].LoseCount += timeArr[o].LoseCount
            gameMap[game].Lose += timeArr[o].Lose
            gameMap[game].Win += timeArr[o].Win
            break
          case 29:
            cnt = timeArr[o].Game + ':' + timeArr[o].Times + '局，下注：' + this.formatNumber(timeArr[o].Bet) +
              '，获得：' + this.formatNumber(timeArr[o].Win - timeArr[o].Bet) + '，资产：' + timeArr[o].Money
            game = timeArr[o].Game
            if (!gameMap[game]) {
              gameMap[game] = { WinCount: 0, LoseCount: 0, Win: 0, Lose: 0 }
            }
            gameMap[game].Game = game
            gameMap[game].LoseCount += timeArr[o].Times
            gameMap[game].Lose -= timeArr[o].Bet
            gameMap[game].Win += timeArr[o].Win
            break
        }
        this.drawer.lines.push({ content: cnt, timestamp: t, color: color })
      }
      const games = []
      for (const o in gameMap) {
        games.push(gameMap[o])
      }
      this.drawer.lines[0] = { Pay: pay, PayCount: payCount, Withdraw: withdraw, WithdrawCount: withdrawCount, Games: games, t: '总计' }
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getTag() {
      if (this.form.tags && this.form.tags.length > 0) {
        let all = false
        for (const i in this.form.tags) {
          if (this.form.tags[i] === '') {
            all = true
          }
        }

        return all ? '' : this.form.tags.join(',')
      }

      return ''
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
    getData() {
      const $this = this
      let applySts, applyEts
      if (this.form.applyTime) {
        applySts = this.transTime(this.form.applyTime[0])
        applyEts = this.transTime(this.form.applyTime[1])
      }
      let finishSts, finishEts
      if (this.form.finishTime) {
        finishSts = this.transTime(this.form.finishTime[0])
        finishEts = this.transTime(this.form.finishTime[1])
      }
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/list',
          Uid: this.form.uid.toString().trim(),
          OrderNo: this.form.orderNo.trim(),
          Id: this.form.id,
          ApplyTimeSts: applySts,
          ApplyTimeEts: applyEts,
          FinishTimeSts: finishSts,
          FinishTimeEts: finishEts,
          Status: this.form.status,
          BankCode: this.form.bankCode,
          PaySysId: this.form.payChannel,
          AccountNo: this.form.accountNo.trim(),
          Page: this.pageInfo.GetCurrentPage(),
          Limit: this.pageInfo.GetPageNum(),
          Tag: this.getTag(),
          PassType: this.form.passType,
          AppId: this.form.appId,
          Source: this.form.source,
          Amount: this.form.amount ? this.form.amount : 0,
          Operator: this.form.operator,
          AuditCnt: this.form.auditCnt,
          OrderByName: this.form.orderByName,
          OrderByDirect: this.form.orderByDirection
        }
      }).then(response => {
        console.log('withdraw list', response)
        $this.tableData = []
        $this.total = 0
        if (response.Data && response.Data.Items) {
          $this.tableData = response.Data.Items
          $this.total = response.Data.Total
          $this.autoAuditCnt = response.Data.AutoAuditCnt
          $this.pageInfo.SetTotalCount(response.Data.Total)
          if ($this.form.accountNo && $this.form.accountNo.length > 0) {
            $this.showAlert = true
            const recharge = $this.toRupee(response.Data.TotalRecharge)
            const withdraw = $this.toRupee(response.Data.TotalWithdraw)
            const ratio = (recharge / withdraw * 100).toFixed(2)
            $this.alertColor = recharge > withdraw ? 'success' : 'error'
            $this.sameAccountNoDesc = '总充值 / 总提现 = 充提比; ' + recharge + ' / ' + withdraw + ' = ' + ratio + '%'
          } else {
            $this.showAlert = false
          }
        }
        $this.loadingClose()
      })
    },
    tagFormat(tag) {
      if (!tag) {
        return ''
      }

      let str = ''
      for (const i in tag) {
        str += tag[i]['Tag'] + ','
      }
      return str
    },
    async getExportData(page) {
      // const $this = this
      let applySts, applyEts
      if (this.form.applyTime) {
        applySts = this.transTime(this.form.applyTime[0])
        applyEts = this.transTime(this.form.applyTime[1])
      }
      let finishSts, finishEts
      if (this.form.finishTime) {
        finishSts = this.transTime(this.form.finishTime[0])
        finishEts = this.transTime(this.form.finishTime[1])
      }
      const response = await request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/withdraw/list',
          Uid: this.form.uid,
          OrderNo: this.form.orderNo,
          ApplyTimeSts: applySts,
          ApplyTimeEts: applyEts,
          FinishTimeSts: finishSts,
          FinishTimeEts: finishEts,
          Status: this.form.status,
          BankCode: this.form.bankCode,
          PaySysId: this.form.payChannel,
          AccountNo: this.form.accountNo,
          Amount: this.form.amount ? this.form.amount : 0,
          Page: page,
          Limit: 100,
          Tag: this.getTag(),
          Source: this.form.source,
          PassType: this.form.passType,
          AppId: this.form.appId,
          Operator: this.form.operator,
          OrderByName: this.form.orderByName,
          OrderByDirect: this.form.orderByDirection
        }
      })

      console.log('export withdraw list', response)
      if (response.Data && response.Data.Items) {
        for (const i in response.Data.Items) {
          const tmp = []
          tmp.push(response.Data.Items[i].Id)
          tmp.push(response.Data.Items[i].AppId)
          tmp.push(response.Data.Items[i].Uid)
          tmp.push(this.toRupee(response.Data.Items[i].TotalRecharge))
          tmp.push(this.toRupee(response.Data.Items[i].TotalWithdraw))
          tmp.push(this.formatPaySysId(response.Data.Items[i].PaySysId))
          tmp.push(this.toRupee(response.Data.Items[i].Amount + response.Data.Items[i].Fee))
          tmp.push(this.showStatus(response.Data.Items[i].Status, 1))
          tmp.push(this.formatTime(response.Data.Items[i].CreateTime))
          tmp.push(this.formatTime(response.Data.Items[i].WithdrawalTime))
          tmp.push(this.showBankCode(response.Data.Items[i].PaySysChannel))
          tmp.push(this.tagFormat(response.Data.Items[i].Attr))
          tmp.push(this.toRupee(response.Data.Items[i].Fee))
          tmp.push(this.toRupee(response.Data.Items[i].Amount))
          tmp.push(this.showPassType(response.Data.Items[i].PassType))
          tmp.push(response.Data.Items[i].PaySysOrder)
          tmp.push(response.Data.Items[i].PhoneNo)
          tmp.push(response.Data.Items[i].Remark)
          tmp.push(response.Data.Items[i].CardHolderName)
          tmp.push(response.Data.Items[i].BankName)
          tmp.push(response.Data.Items[i].Mail)
          if (response.Data.Items[i].PaySysChannel == 100) {
            tmp.push(response.Data.Items[i].AccountNo)
          } else {
            tmp.push('')
          }
          if (response.Data.Items[i].PaySysChannel == 103) {
            tmp.push(response.Data.Items[i].AccountNo)
          } else {
            tmp.push('')
          }

          this.exportData.push(tmp)
        }
      }
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(async excel => {
        if (this.total === 0) {
          this.$message.error('没有导出数据，或者先查询')
          return
        }

        if (this.total > 10000) {
          this.$message.error('导出数据量太大(' + this.total + ')，可能会影响线上业务，请缩小搜索范围')
          return
        }

        this.exportData = []

        const max = Math.ceil(this.total / 100)
        for (let i = 1; i <= max; i++) {
          await this.getExportData(i)
        }

        const data = this.exportData
        const header = [
          'ID', '应用ID', 'Uid', '充值总额', '提现成功总额', '代付渠道', '申请金额',
          '状态', '申请时间', '完成时间', '方式', '标签', '手续费', '到账', '审核方式',
          '平台订单号', '备注', '姓名', '手机', 'ifsc', 'email', 'bank', 'upi'
        ]
        excel.export_json_to_excel({
          header: header, // 表头 必填
          data, // 具体数据 必填
          filename: '提现审核', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table--medium .el-table__cell {
  padding: 5px 0;
}

.el-form-item{
  margin-bottom: 0px;
}

.tableButton {
  padding: 4px 5px;
  font-size: 12px;
  border-radius: 4px;
}

.cell .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.el-icon-copy-document, .el-icon-search {
  margin-left: 5px;
}

</style>
