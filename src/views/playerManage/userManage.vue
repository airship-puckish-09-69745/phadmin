<template>
  <div class="app-container">
    <el-row v-show="queryFlag === 1" class="uid-query">
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="6" :offset="2">
          <el-form-item label="UID：" :required="true">
            <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="success" size="mini" @click="showAccountQuery">用App和Account查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="default" size="mini" @click="getFriendList">好友列表</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row v-show="queryFlag === 2" class="account-query">
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="6" :offset="2">
          <el-form-item v-model="accountForm.AppId" label="App：" :required="true" label-width="80px">
            <el-select v-model="accountForm.AppId" placeholder="请选择" size="mini">
              <el-option
                v-for="row in appInfo"
                :key="'app'+row.key"
                :label="row.label"
                :value="row.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="Account：" :required="true">
            <el-input v-model="accountForm.Account" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getInfoByAccount">查询</el-button>
          <el-button type="success" size="mini" @click="showUidQuery">用uid查询</el-button>
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
          <el-descriptions-item label="uid：">{{ item.Uid }}</el-descriptions-item>
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
              <!--              <el-row v-if="money!=0"><span>{{ formatNumber(money) }}</span></el-row>-->
              <el-input v-model="money" size="mini" />
            </el-col>
            <el-col :span="6" :offset="1">
              <el-button type="primary" size="mini" @click="saveMoney">提交</el-button>
            </el-col>
          </el-descriptions-item>

          <el-descriptions-item label="系列：">{{ item.AppID > 100000?'Galaxy':'Android' }}</el-descriptions-item>
          <el-descriptions-item label="AppID：">{{ item.AppID }}</el-descriptions-item>
          <el-descriptions-item label="来源Appid：">{{ item.RegisterChannel }}</el-descriptions-item>
          <el-descriptions-item label="单一钱包：" :span="1">
            {{ formatNumber(item.WalletMoney / 1000) }}
            <template v-if="item.WalletType==1">
              <el-button size="mini" @click="refreshWalletMoney">刷新资产</el-button>
            </template>
            <el-button v-if="hasPayWithdrawLogPerm" size="mini" @click="showPayWithdrawLog">充提明细</el-button>
          </el-descriptions-item>
          <el-descriptions-item v-if="hasPayWithdrawLogPerm" label="总充值：">{{ formatNumber(PayWithdrawSummary.PayAmount / 1000) }}</el-descriptions-item>
          <el-descriptions-item v-if="hasPayWithdrawLogPerm" label="总提现：">{{ formatNumber(PayWithdrawSummary.WithdrawAmount / 1000) }}</el-descriptions-item>
          <el-descriptions-item v-if="hasPayWithdrawLogPerm" label="首充时间："><DateTimeShow v-if="PayWithdrawSummary.FirstPayTime>0" :show-type="2" :timestamp="PayWithdrawSummary.FirstPayTime/1000" /></el-descriptions-item>
          <el-descriptions-item label="钱包类型：" :span="3">{{ item.WalletType==1?'单一钱包':'转账钱包' }}</el-descriptions-item>
          <el-descriptions-item label="平台注册时间：" :span="4"><DateTimeShow v-if="item.PlatRegisterTime>0" :show-type="2" :timestamp="item.PlatRegisterTime/1000" /></el-descriptions-item>
          <el-descriptions-item label="UID注册时间："><DateTimeShow :show-type="2" :timestamp="item.RegisterTime" /></el-descriptions-item>
          <el-descriptions-item label="最近登录时间："><DateTimeShow :show-type="2" :timestamp="item.LastLoginTime" /></el-descriptions-item>
          <!--
          <el-descriptions-item label="小黑屋标志">
            <el-tag v-if="item.SchemaXMan > 0" type="danger">是({{ item.SchemaXMan }})</el-tag>
            <el-tag v-else>否</el-tag>
            <el-button v-if="item.SchemaXMan > 0" type="default" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(0)">取消标志</el-button>
            <el-button v-if="item.SchemaXMan != 1" type="primary" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(1)">设置标志(1)</el-button>
            <el-button v-if="item.SchemaXMan != 2" type="primary" size="mini" style="margin-left: 10px;" @click="setSchemaXMan(2)">设置专享标志(2)</el-button>
          </el-descriptions-item>
          -->
          <el-descriptions-item label="最近登录IP：">{{ item.Ip }}</el-descriptions-item>
          <el-descriptions-item label="最近登录设备码：">{{ item.DeviceCode }}</el-descriptions-item>
          <!--
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
          -->
          <el-descriptions-item label="是否绑定手机号："><el-tag :type="item.IsBindPhone ? 'success' : 'danger'">{{ formatBool(item.IsBindPhone) }}</el-tag>{{ item.Phone }}</el-descriptions-item>
          <el-descriptions-item label="账号类型：">{{ formatAccountType(item.AccountType) }}</el-descriptions-item>

          <el-descriptions-item label="登录账号：">{{ item.Account }}</el-descriptions-item>
          <el-descriptions-item label="绑定邮箱：">
            <template v-if="!mailEditable">
              {{ item.Email }}<el-button size="mini" @click="mailEditable=true">修改</el-button>
            </template>
            <template v-else>
              <el-input v-model="item.Email" size="mini" /> <el-button size="mini" type="primary" @click="updateMail">修改</el-button>
            </template>

          </el-descriptions-item>

          <el-descriptions-item label="头像："><el-popover
            v-if="item.Icon.length > 5"
            placement="right"
            width="400"
            trigger="click"
          >
            <img :src="getImgUrl" style="width:100px;height:100px;">
            <img slot="reference" :src="getImgUrl" style="width:100px;height:100px;">
          </el-popover>
          </el-descriptions-item>
          <el-descriptions-item label="昵称：">{{ item.Nick }}
            <!--
            <el-button v-if="hasCustomerPerm" size="mini" @click="customerRedhot">客服红点</el-button>
            -->
          </el-descriptions-item>
          <el-descriptions-item label="语言："> {{ item.Language=='en'?'英文':'印地' }}</el-descriptions-item>

          <el-descriptions-item v-if="hasEditPerm" label="账号状态：">
            <el-tag v-if="item.Status == 1" type="danger">禁用</el-tag>
            <el-tag v-else type="success">正常</el-tag>
            <el-button v-if="item.Status == 1" type="success" size="mini" style="margin-left: 10px;" @click="disableUser(0)">解禁</el-button>
            <el-button v-else type="danger" size="mini" style="margin-left: 10px;" @click="disableUser(1)">禁用</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="是否设置登录密码：">
            <el-tag :type="item.IsSetLoginPwd ? 'success' : 'danger'">{{ formatBool(item.IsSetLoginPwd) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="KYC状态：">
            <el-tag :type="item.KycStatus>0 ? 'success' : 'danger'">{{ formatBool(item.KycStatus>0) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总信誉分值：" :span="2">
            <el-tag>{{ formatNumber(credit.creditScore / 1000) }}</el-tag>
            <el-tag v-if="credit.blackList.length > 0" type="danger">高危</el-tag>
            <el-button type="success" size="mini" style="margin-left: 10px;" @click="TagCreditDetail=true">详情</el-button>
          </el-descriptions-item>

          <el-descriptions-item label="添加道具:" :span="4">
            <el-col :span="1"> {{ '类型:' }} </el-col>
            <el-col :span="2">
              <el-select v-model.number="item.ItemType" size="mini" placeholder="请选择" @change="ShowItemList(item.ItemType)">
                <el-option
                  v-for="option in ITEM_TYPE_OPTIONS"
                  :key="'itemtype'+option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </el-col>
            <el-col :span="1" :offset="1"> {{ '名称:' }} </el-col>
            <el-col :span="3">
              <template>
                <el-select v-model.number="item.ItemCfgId" filterable size="mini" placeholder="请选择" @change="handleItemChange">
                  <el-option
                    v-for="option in tableItemData"
                    :key="'itemcfgid'+Number(option.value)"
                    :label="option.label"
                    :value="Number(option.value)"
                    :disabled="disableByPropId(option.value)"
                  />
                </el-select>
              </template>
            </el-col>
            <el-col v-show="isShowFreeSpinGame" :span="1" :offset="1"> {{ '游戏:' }} </el-col>
            <el-col v-show="isShowFreeSpinGame" :span="3">
              <template>
                <el-select :key="item.ItemFreeSpinGids" v-model="ItemFreeSpinGids" multiple clearable filterable default-first-option size="mini" placeholder="请选择">
                  <el-option
                    v-for="option in FreeSpinGames"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
            </el-col>
            <el-col :span="1" :offset="1"> {{ '数量:' }} </el-col>
            <el-col :span="2">
              <el-input v-model.number="item.ItemNum" size="mini" type="number" min="0" @input="item.ItemNum = item.ItemNum < 0 ? 0 : item.ItemNum" />
            </el-col>
            <!--            <el-col v-show="(item.ItemType===PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN) && isNegativeItemNum" :span="1" :offset="1"> {{ 'UUID:' }} </el-col>-->
            <!--            <el-col v-show="(item.ItemType===PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN) && isNegativeItemNum" :span="2">
              <template>
                <el-select :key="item.ItemCfgId" v-model="propFrom.ItemUuId" size="mini" placeholder="请选择">
                  <el-option
                    v-for="option in tablePropUuIdData"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
            </el-col>-->
            <el-col v-show="(item.ItemType === 2 || item.ItemType === 4 || item.ItemType === 5 ||[7,8,9].includes(item.ItemType))&&!isNegativeItemNum" :span="1" :offset="1"> {{ '时间:' }} </el-col>
            <el-col v-show="(item.ItemType === 2 ||item.ItemType === 4 || item.ItemType === 5 ||[7,8,9].includes(item.ItemType)) && !isNegativeItemNum" :span="2">
              <template>
                <el-select v-model="item.ItemUseTime" size="mini" placeholder="请选择">
                  <el-option v-for="option in ITEM_DAY_TYPE_OPTIONS" :key="'itemusertime'+option.value"
                             :label="option.label" :value="option.value" :disabled="option.disabled || ([5,7,8,9].includes(item.ItemType)&& (option.value === 0 || option.value === 365)) || (option.value === -1 && itemEnv!=='development')">
                  </el-option>
                </el-select>
              </template>
            </el-col>
            <el-col :span="1" :offset="1">
              <el-button type="primary" size="mini" @click="saveItemInfo">提交</el-button>
            </el-col>
          </el-descriptions-item>

          <el-descriptions-item label="tongits信任分：" :span="1">
            <el-col :span="8">
              <el-tag>{{ formatNumber(item.TrustScore) }}</el-tag>
              <el-tag v-if="item.TrustType == 1" type="success">低危用户</el-tag>
              <el-tag v-if="item.TrustType == 4" type="success">低信用户</el-tag>
              <el-tag v-if="item.TrustType == 5" type="success">高信用户</el-tag>
              <el-tag v-if="item.TrustType == 2" type="success">疑似用户</el-tag>
              <el-tag v-if="item.TrustType == 3" type="success">黑子用户</el-tag>
            </el-col>
            <el-col v-if="env==='test'" :span="6">
              <el-input v-model.number="cheatScore" size="mini" placeholder="正加负减" />
            </el-col>
            <el-col v-if="env==='test'" :span="4">
              <el-button type="primary" size="mini" @click="incTrustScore()">增加信任分</el-button>
            </el-col>
          </el-descriptions-item>
        </el-descriptions>

      </el-col>
    </el-row>

    <el-dialog
      title="信誉分详情"
      :visible.sync="TagCreditDetail"
      :before-close="TagVisibleClose"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="UID" :span="2">
          <el-tag type="success">{{ credit.uid }}</el-tag>
          <el-button type="success" size="mini" style="margin-left: 10px;" @click="getCredit()">刷新</el-button>
          <el-button type="danger" size="mini" style="margin-right: 100px;" @click="clearCreditData()">清空信誉分数据</el-button>
          <!-- <el-button v-if="env=='test'" type="danger" size="mini" style="margin-right: 100px;" @click="getCredit(true)">刷用户日数据</el-button> -->
        </el-descriptions-item>
        <el-descriptions-item label="信誉分" :span="2">{{ formatNumber(credit.creditScore / 1000) }}
          <el-tag v-if="credit.creditLevel == 0" type="primary">普通用户</el-tag>
          <el-tag v-if="credit.creditLevel == 1" type="success">信誉用户</el-tag>
          <el-tag v-if="credit.creditLevel == 2" type="danger">黑名单用户</el-tag>
          <el-tag v-if="credit.blackList.length > 0" type="danger">高危用户</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="额外信誉分">
          {{ formatNumber(credit.extScore / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item label="增加(减少)信誉分">
          <el-col :span="4">
            <el-input v-model.number="creditChange" size="mini" style="margin-right: 10px;" />
          </el-col>
          <el-col :span="2">
            <el-button type="primary" style="margin-right: 100px;" size="mini" @click="saveCreditScore">提交</el-button>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item label="有效流水分">{{ formatNumber(credit.validBetScore / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="今日有效流水分">{{ formatNumber(credit.dayVbs / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="玩牌局数分">{{ formatNumber(credit.playRoundScore / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="今日玩牌局数分">{{ formatNumber(credit.dayPrs / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="GGR贡献分">{{ formatNumber(credit.ggrScore / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="今日GGR贡献分">{{ formatNumber(credit.dayGgrs / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="黑名单列表" :span="2">
          <template>
            <el-row v-for="gid,i in credit.blackList">
              <el-col :span="8" border> {{ getGameName(gid) }} </el-col>
              <el-col :span="8" border> {{ gid }} </el-col>
              <el-col :span="8">
                <el-button type="danger" size="mini" style="margin-left: 10px;" @click="optBlackList(gid, 1)">移除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="添加黑名单" :span="2">
          <template>
            <el-row>
              <el-col :span="16">
                <el-select v-model="selectGid" size="mini">
                  <el-option v-for="opt in GameOption" :key="'selectGid'+opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-button type="success" size="mini" style="margin-left: 10px;" @click="optBlackList(selectGid,0)">添加</el-button>
              </el-col>
            </el-row>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="查看游戏各场次">
          <el-button type="success" size="mini" style="margin-left: 10px;" @click="goCreditDetail">查看</el-button>
        </el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="TagCreditDetail = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--添加标签end-->

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
                :key="'userTagColor'+opt.value"
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

    <!--好友列表start-->
    <el-dialog
      title="好友列表"
      :visible.sync="friendListDialog"
      width="30%"
    >
      <span>
        <el-table
          ref="filterTable"
          :data="friendList"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
        >
          <el-table-column
            prop="Id"
            label="ID"
            sortable
            width="100"
          />
          <el-table-column
            prop="Uid"
            label="UID"
            width="100"
          />
          <el-table-column
            prop="Nick"
            label="昵称"
            width="150"
          />
          <el-table-column
            prop="AddTime"
            label="时间"
            width="180"
          >
            <template slot-scope="scope">
              {{ formatTime(scope.row.AddTime ) }}
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-dialog>
    <!--好友列表end-->

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, $libType, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import { toRupee, numberFormat } from '@/utils'
import DateTimeShow from '@/components/DatetimeShow'
import { ITEM_TYPE_OPTIONS, ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import payWithdrawLog from '@/views/playerManage/payWithdrawLog.vue'

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
      libShow: $libShow,
      queryFlag: 1, // 1 uid查询，2 account 查询
      appInfo: [],
      selectGid: 28,
      creditChange: 0,
      credit: {
        creditScore: 0,
        extScore: 0,
        validBetScore: 0,
        playRoundScore: 0,
        ggrScore: 0,
        dayVbs: 0,
        dayPrs: 0,
        dayGgrs: 0,
        blackList: [],
        uid: 0
      },
      item: {
        Uid: 0,
        LimitedMoney: '',
        FreeMoney: '',
        BonusTotal: 0,
        BonusValid: 0,
        Gullak: 0,
        GullakLevel: 0,
        Nick: '',
        KycStatus: 0,
        PlatRegisterTime: 0,
        RegisterTime: 0,
        RegisterChannel: '',
        LastLoginTime: 0,
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
      cheatScore: 0,
      total: 0,
      tableData: [], // 头像框和门票物品配置表数据
      tableItemData: [],
      tablePropUuIdData: [],
      ItemCfgId: 0,
      ItemType: 0,
      ItemUseTime: 1,
      ItemNum: 0,
      propFrom: {
        ItemUuId: ''
      },
      libShowMoney: new MoneyShow(['BonusTotal', 'BonusValid', 'Gullak', 'LimitedMoney', 'FreeMoney', 'BaseValue', 'ProduceValue', 'MCBetValue', 'MCSystemGot', 'PayValue']),
      moneyType: 1,
      money: 0,
      env: 'test',
      accountForm: {
        Account: '',
        AppId: 0
      },

      edit: {
        visible: false
      },

      hasEditPerm: false,
      hasCustomerPerm: false,
      hasPayWithdrawLogPerm: false,

      UserTags: [],
      tagRecs: [],
      TagVisible: false,
      TagCreditDetail: false,

      mailEditable: false,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      itemEnv: process.env.NODE_ENV, // 项目环境

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
      GameOption: [
        { 'label': 'Pusoy', 'value': 21 },
        { 'label': 'Pusoy Swap', 'value': 113 },
        { 'label': 'Pusoy Wild', 'value': 126 },
        { 'label': 'Pusoy Dos', 'value': 34 },
        { 'label': 'Tongits', 'value': 22 },
        { 'label': 'Tongits Laizi', 'value': 28 },
        { 'label': 'Tongits Quick', 'value': 29 }
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
      // 好友列表
      friendListDialog: false,
      friendList: [],

      tabName: 'inviteUsers', //
      inviteSelectTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      InviteUsers: [], // 邀请用户
      RelationUsers: [], // 关联账号
      SameRelationUsers: [], // 相同关联账号
      SameRelationSummary: NewRelationSummary(),
      RelationSummary: NewRelationSummary(),
      UserIpDevice: [], // 用户IP设备
      SameIp: [], // 同IP
      SameDevice: [], // 同设备
      ITEM_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      PROP_TYPE_OPTIONS,
      PayWithdrawSummary: {
        PayAmount: 0,
        WithdrawAmount: 0,
        FirstPayTime: 0
      },
      gameMap: {},
      FreeSpinGames: [], // FreeSpin 道具支持的游戏
      ItemFreeSpinGids: [],
      isShowFreeSpinGame: false
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
    },
    isNegativeItemNum() {
      return this.item.ItemNum < 0 // 检测是否为负数
    }
  },
  created() {
    const pers = store.getters.pers
    this.hasEditPerm = (pers['USER_MANAGEMENT'] & 2) > 0
    this.hasCustomerPerm = (pers['CUTOMER'] & 2) > 0
    this.hasPayWithdrawLogPerm = (pers['PAY_WITHDRAW_LOG'] & 1) > 0
    this.getAppInfo()
  },
  mounted() {
    this.env = store.getters.env || this.env
    if (this.$route.query && this.$route.query.uid > 0) {
      this.item.Uid = parseInt(this.$route.query.uid)
      this.$refs.uidInput.saveUid(this.item.Uid)
      console.log('set mounted', this.item.Uid)
    }
    this.getInfo()
    this.getItemList()
    this.getGameList()
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
    showGameName(gid) {
      return this.gameMap.hasOwnProperty(gid) ? this.gameMap[gid] : '未知游戏' + gid
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
      return // by chen bin 无标签
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
    saveItemInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      if (typeof this.item.ItemType === 'undefined' || this.item.ItemType === 0) {
        Message.error('请输入道具类型')
        return
      }
      if (typeof this.item.ItemCfgId === 'undefined' || this.item.ItemCfgId === 0) {
        Message.error('请输入道具id')
        return
      }
      if (typeof this.item.ItemNum === 'undefined' || this.item.ItemNum === 0) {
        Message.error('请输入道具数量')
        return
      }
      if (this.item.ItemNum > 0 && [2, 4, 5, 7, 8, 9].includes(this.item.ItemType)) {
        if (typeof this.item.ItemUseTime === 'undefined') {
          Message.error('请选择时间')
          return
        }
      }
      if (this.item.ItemType === 5 && this.item.ItemNum < 0 && (this.propFrom.ItemUuId === '' || this.propFrom.ItemUuId === undefined)) {
        Message.error('扣除free spin道具 需要勾选UUID')
        return
      }

      let msg = '确定添加物品吗?'
      if (this.item.ItemNum < 0) {
        msg = '确定扣除物品吗?'
      }
      let tmpTime = 0
      if ([2, 4, 5, 7, 8, 9].includes(this.item.ItemType)) {
        tmpTime = this.item.ItemUseTime
      }
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
            Type: 12,
            Money: 0,
            ItemId: this.item.ItemCfgId,
            ItemNum: this.item.ItemNum,
            ItemType: this.item.ItemType,
            UseTime: tmpTime,
            ItemUuid: this.propFrom.ItemUuId,
            ItemGids: this.ItemFreeSpinGids,
            Author: store.getters.name,
            ActMsg: '管理后台By ' + store.getters.name
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改成功！')
            this.item.ItemType = 0
            this.item.ItemCfgId = 0
            this.item.ItemNum = 0
            this.item.ItemUseTime = 1
            this.propFrom.ItemUuId = ''
            this.ItemFreeSpinGids = []
            this.isShowFreeSpinGame = false
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
          $this.$EventBus.$emit('uid-change', $this.item.Uid)
          $this.getCredit()
          $this.getPayWithdrawSummary()
        }
      })
    },
    getCredit(refresh) {
      // if (this.env!='test') {
      //   return
      // }
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/user/credit/info',
          Uid: $this.item.Uid,
          Refresh: refresh
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.credit.creditScore = response.Data.creditScore
          $this.credit.extScore = response.Data.extScore
          $this.credit.validBetScore = response.Data.validBetScore
          $this.credit.playRoundScore = response.Data.playRoundScore
          $this.credit.ggrScore = response.Data.ggrScore
          $this.credit.dayVbs = response.Data.dayVbs
          $this.credit.dayPrs = response.Data.dayPrs
          $this.credit.dayGgrs = response.Data.dayGgrs
          $this.credit.creditLevel = response.Data.creditLevel
          $this.credit.blackList = []
          if (response.Data.blackList !== '') {
            $this.credit.blackList = JSON.parse(response.Data.blackList)
          }
          $this.credit.uid = response.Data.uid
          console.log('/user/credit/info:', response.Data)
        }
      })
    },
    getInfoByAccount() {
      console.log('account:', this.accountForm.Account)
      console.log('app: ', this.accountForm.AppId)
      if (this.accountForm.Account === '') {
        Message.error('请输入正确的Account')
        return
      }
      if (this.accountForm.AppId <= 0) {
        console.log(this.item.AppId)
        Message.error('请选择App')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/account/info',
          Account: this.accountForm.Account,
          AppId: this.accountForm.AppId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.resetQueryDevice()
          $this.item = $this.libShowMoney.TransForShow(response.Data || $this.item)
          $this.item.UserAccount = response.Data.Account || ''
          $this.item.AppId = response.Data.AppID || 0
          $this.item.Uid = response.Data.Uid || 0
          $this.$refs.uidInput.saveUid($this.item.Uid)
          $this.getTags()
          $this.getCredit()
          $this.getPayWithdrawSummary()
        }
      })
    },
    getPayWithdrawSummary() {
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
          Path: '/user/pay/withdraw/summary',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.PayWithdrawSummary.PayAmount = response.Data.PayAmount
          $this.PayWithdrawSummary.WithdrawAmount = response.Data.WithdrawAmount
          $this.PayWithdrawSummary.FirstPayTime = response.Data.FirstPayTime
          console.log('PayWithdrawSummary.PayAmount:', $this.PayWithdrawSummary.PayAmount)
          console.log('PayWithdrawSummary.WithdrawAmount:', $this.PayWithdrawSummary.WithdrawAmount)
          console.log('PayWithdrawSummary.FirstPayTime:', $this.PayWithdrawSummary.FirstPayTime)
        }
      })
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    showAccountQuery() {
      this.queryFlag = 2
    },
    showUidQuery() {
      this.queryFlag = 1
    },
    getFriendList() {
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
          Path: '/friend/list',
          Uid: this.item.Uid
        }
      }).then(response => {
        // console.log(response)
        if (response.RetCode === 0) {
          $this.friendList = response.Data
          $this.friendListDialog = true
        }
      })
    },
    optBlackList(gid, opt) {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }

      let optok = false
      const gids = this.credit.blackList
      if (opt == 1) {
        for (let i = 0; i < gids.length; i++) {
          if (gids[i] == gid) {
            gids.splice(i, 1)
            optok = true
            break
          }
        }
      } else if (!gids.includes(gid)) {
        gids.push(gid)
        optok = true
      }
      console.log(gid, opt, gids)

      if (!optok) {
        Message.error('无效操作！')
        return
      }

      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/credit/black',
          Uid: this.item.Uid,
          Gids: JSON.stringify(gids)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('/user/credit/black:', response.Data)
        } else {
          Message.error('更新失败')
        }
      })
    },
    getGameName(gid) {
      for (const v of this.GameOption) {
        if (v.value === gid) {
          return v.label
        }
      }
      return 'unknow'
    },
    refreshWalletMoney() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/wallet/refresh',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.item.WalletMoney = response.Data.Money
        }
      })
    },
    showPayWithdrawLog() {
      const uid = this.item.Uid
      this.$router.push({
        path: '/player/payWithdrawLog',
        query: {
          Uid: uid
        }
      })
    },
    clearCreditData() {
      this.$confirm('确定清除信誉分数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const $this = this
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: $this.env,
            Path: '/user/credit/clear',
            Uid: $this.credit.uid
          }
        }).then(response => {
          if (response.RetCode === 0) {
            $this.credit.creditScore = 0
            $this.credit.validBetScore = 0
            $this.credit.playRoundScore = 0
            $this.credit.extScore = 0
            $this.credit.ggrScore = 0
            $this.credit.creditScore = 0
            $this.credit.dayVbs = 0
            $this.credit.dayPrs = 0
            $this.credit.dayGgrs = 0
            $this.credit.blackList = []
            console.log('/user/credit/clear:', response.Data)
          }
        })
      })
    },
    saveCreditScore() {
      this.$confirm(`确定要给此用户增加${this.creditChange}信誉分吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.credit.uid, this.creditChange)
        const $this = this
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: $this.env,
            Path: '/user/credit/save',
            Uid: $this.credit.uid,
            ExtScore: $this.creditChange * 1000
          }
        }).then(response => {
          if (response.RetCode === 0) {
            $this.getCredit()
          } else {
            console.log(response)
          }
        })
      })
    },
    // 跳转到用户信息查询页面
    goCreditDetail() {
      this.TagCreditDetail = false
      this.$router.push({
        path: '/config/creditDetail',
        query: {
          uid: this.item.Uid
        }
      })
    },
    getItemList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 200
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            this.tableData = objs.list
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      })
    },
    getGameList() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            $this.gameMap[objs[i].Gid] = objs[i].Name
          }
        }
      })
    },
    // 获取展示名称
    ShowItemList(id) {
      this.tableItemData = []
      this.tablePropUuIdData = []
      this.$set(this.item, 'ItemCfgId', null) // 使用 $set 确保响应式更新
      this.propFrom.ItemUuId = ''
      const currTime = new Date().getTime()
      for (let i = 0; i < this.tableData.length; i++) {
        let str = this.tableData[i].item_name
        if (this.tableData[i].item_extra.length > 0) {
          const exitData = JSON.parse(this.tableData[i].item_extra)
          if (exitData != null) {
            if (exitData.showName != null) {
              str = str + '(' + exitData.showName + ')'
            }
          }
        }
        if (this.tableData[i].item_type === id && this.tableData[i].status === 1) {
          if (this.isTicketProp(this.tableData[i].item_type)) {
            const expTime = this.tableData[i].expire_time * 1000
            if (currTime < expTime) {
              this.tableItemData.push({ 'value': Number(this.tableData[i].id), 'label': str, disabled: false })
            }
          } else {
            this.tableItemData.push({ 'value': Number(this.tableData[i].id), 'label': str, disabled: false })
          }
        }
      }
      this.checkShowFreeSpinGame()
    },

    disableByPropId(propId) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === propId && this.tableData[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET) {
          if (this.tableData[i].item_extra !== null && JSON.parse(this.tableData[i].item_extra).specialAttr === 1) { // 如果是邀请函
            return true
          }
        }
      }
      return false
    },

    handleItemChange(val) {
      this.propFrom.ItemUuId = ''
      this.tablePropUuIdData = [] // 清空UUID选项列表
      this.ShowItemUUIDDetail(val) // 如果需要立即加载新的UUID列表
      this.checkShowFreeSpinGame()
    },
    // 展示道具的子属性UUID
    ShowItemUUIDDetail(itemId) {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/user/prop/refresh',
          Uid: this.item.Uid,
          PropId: itemId
        }
      }).then(response => {
        if (response.RetCode === 0 && response.Data != null && response.Data.length > 0) {
          $this.tablePropUuIdData = response.Data.map(uuid => ({
            value: uuid, // 确保是字符串或数字
            label: uuid // 确保是字符串
          }))
        }
      })
    },
    // 是否是门票类型道具
    isTicketProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET
    },
    // 是否是头像框道具
    isAvatarFrameProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR
    },
    incTrustScore() {
      if (this.env != 'test') {
        return
      }
      if (this.cheatScore === 0) {
        this.$message.error('请输入一个不为0的数据')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: $this.env,
          Path: '/user/cheat/update',
          Uid: $this.item.Uid,
          Gid: 22,
          Score: $this.cheatScore
        }
      }).then(response => {
        console.log('update tag ', response)
        if (response.RetCode === 0) {
          $this.getInfo()
          $this.getTags()
        } else {
          $this.$message.error('更新失败')
        }
      })
    },
    checkShowFreeSpinGame() {
      this.isShowFreeSpinGame = false
      if (!this.item.ItemCfgId) { return false }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === this.item.ItemCfgId && this.tableData[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN) {
          if (!this.tableData[i].item_extra) { return false }
          // json 解析 item_extra
          const extra = JSON.parse(this.tableData[i].item_extra)
          if (!extra) { return false }
          if (!extra.gid) { return false }
          // 排序
          extra.gid.sort()
          this.FreeSpinGames = []
          this.ItemFreeSpinGids = []
          for (let j = 0; j < extra.gid.length; j++) {
            // 默认全选
            this.ItemFreeSpinGids.push(extra.gid[j])
            this.FreeSpinGames.push({
              value: extra.gid[j],
              label: this.showGameName(extra.gid[j])
            })
          }
          this.isShowFreeSpinGame = true
          return true
        }
      }
      return false
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
