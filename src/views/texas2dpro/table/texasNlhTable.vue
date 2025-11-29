<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="TexasNlhTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="70" />
        <el-table-column prop="IsPractice" label="练习场" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="Level" label="Level" sortable="custom" width="100" />
        <el-table-column prop="SmallBlind" label="小盲" sortable="custom" width="100">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.SmallBlind) }}
          </template>
        </el-table-column>
        <el-table-column prop="CarryLower" label="携带" width="200">
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column prop="ObjectCount" label="桌子数" width="100" />

        <el-table-column prop="LastModify" label="最近修改" width="160">
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCopy(scope.row)">复制</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" type="success" @click="handlePreOn(scope.row)">预上</el-button>
            <el-button v-if="scope.row.Status==7" size="mini" type="success" @click="handleOn(scope.row)">上架</el-button>
            <el-button v-if="scope.row.Status==2" size="mini" type="warning" @click="handlePreOff(scope.row)">预下</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==8" size="mini" type="danger" @click="handleOffline(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="小盲：" :required="true" prop="item.SmallBlind">
              <el-select v-model="edit.item.SmallBlind" placeholder="请选择">
                <el-option label="0.25" :value="0.25" />
                <el-option label="0.5" :value="0.5" />
                <el-option label="1" :value="1" />
                <el-option label="2.5" :value="2.5" />
                <el-option label="5" :value="5" />
                <el-option label="10" :value="10" />
                <el-option label="25" :value="25" />
                <el-option label="50" :value="50" />
                <el-option label="100" :value="100" />
                <el-option label="250" :value="250" />
                <el-option label="500" :value="500" />
                <el-option label="1000" :value="1000" />
                <el-option label="2000" :value="2000" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大玩牌人数：" :required="true" prop="item.TableMaxPlayerNum" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableMaxPlayerNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="台费(千分比)：" :required="true" prop="item.TableFee" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽5%，则填写50" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <el-form-item label="前注：" :required="true" prop="item.PrefixChip" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.PrefixChip" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最小携带：" :required="true" prop="item.CarryLower" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大携带：" :required="true" prop="item.CarryUpper" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最低买入：" :required="true" prop="item.MinBuyIn" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.MinBuyIn" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大买入：" :required="true" prop="item.MaxBuyIn" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.MaxBuyIn" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="默认买入：" :required="true" prop="item.BaseBuyIn" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.BaseBuyIn" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="买入间隔" :required="true" prop="item.IntervalBuyIn" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.IntervalBuyIn" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="桌子数量：" :required="true" prop="item.ObjectCount" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ObjectCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最大旁观局数：" :required="true" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.WatchTimesMax" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自动开始人数：" :required="true" prop="item.AutoStartPlayerNumer" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.AutoStartPlayerNumer" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="GPS限制：" :required="true">
              <el-radio-group v-model.number="edit.item.GPSLimit">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IP限制：" :required="true">
              <el-radio-group v-model.number="edit.item.IPLimit">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开启保险：" :required="true">
              <el-radio-group v-model.number="edit.item.IsEnableInsure">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="多次发牌：" :required="true">
              <el-radio-group v-model.number="edit.item.IsEnableMultiPerflop">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开启NoRathole：" :required="true">
              <el-radio-group v-model.number="edit.item.NoRathole">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开启延时看牌：" :required="true">
              <el-radio-group v-model.number="edit.item.IsDelayShow">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开启Straddle：" :required="true">
              <el-radio-group v-model.number="edit.item.IsEnableStraddle">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="等级：" :required="true" prop="item.Level" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-select v-model="edit.item.Level" placeholder="请选择">
                <el-option label="微级" :value="1" />
                <el-option label="初级" :value="2" />
                <el-option label="中级" :value="3" />
                <el-option label="高级" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最小玩牌金额：" :required="true" prop="item.MinPlayMoney" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.MinPlayMoney" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="进入该场次后隐藏场次：" :required="true" prop="item.HideLevel">
              <el-select v-model="edit.item.HideLevel" placeholder="请选择">
                <el-option label="无" :value="0" />
                <el-option label="0.1" :value="100" />
                <el-option label="0.3" :value="300" />
                <el-option label="0.5" :value="500" />
                <el-option label="1" :value="1000" />
                <el-option label="3" :value="3000" />
                <el-option label="10" :value="10000" />
                <el-option label="20" :value="20000" />
                <el-option label="50" :value="50000" />
                <el-option label="200" :value="200000" />
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="9">
            <el-form-item label="VPIP入池率(百分比)：" :required="true" prop="item.TablePourRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TablePourRatio" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽50%，则填写50" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="猎兔价格配置" :required="true" prop="item.RabbitPrice" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RabbitPrice" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="互动道具每日免费次数" :required="true" prop="item.InteractDayFreeTimes" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.InteractDayFreeTimes" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="互动道具每次价格消耗" :required="true" prop="item.InteractItemPrice">
              <el-input v-model="edit.item.InteractItemPrice" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="延时道具消耗(逗号隔开)" :required="true" prop="item.DelayItemPrice">
              <el-input v-model="edit.DelayItemPrice" placeholder="请输入" />
            </el-form-item>
          </el-col>
           <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="0.1则输入1，1则输入10" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>
        <fieldset>
          <legend>时间配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="操作时间：" :required="true" prop="TimeConfig.OpTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.OpTimeout" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="买入超时时间：" :required="true" prop="TimeConfig.WantBuyTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.WantBuyTimeout" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="保险操作超时时间：" :required="true" prop="TimeConfig.InsureTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.InsureTimeout" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="选择多牌超时时间：" :required="true" prop="TimeConfig.SelectMultiTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.SelectMultiTimeout" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="同意多牌超时时间：" :required="true" prop="TimeConfig.AllowMultiTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.AllowMultiTimeout" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>

        <fieldset>
          <legend>outs配置</legend>
          <el-row style="margin-top:10px">
            <el-button type="primary" size="mini" @click="addOutsRatioRow">添加</el-button>
          </el-row>
          <el-row v-for="(value, index) in edit.OutsRatio" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="12">

                  <el-form-item label="outs牌数量">
                    <el-input v-model.number="edit.OutsRatio[index].OutsNum" size="mini" :required="true" type="number" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="赔率(千分比)">
                    <el-input v-model.number="edit.OutsRatio[index].Ratio" size="mini" :required="true" type="number" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <el-button type="danger" size="mini" @click="removeOutsRatioRow(index)">删除</el-button>
            </el-col>
          </el-row>

        </fieldset>

        <fieldset>
          <legend>台费配置</legend>
          <el-row style="margin-top:10px">
            <el-button type="primary" size="mini" @click="addFeeLimitRow">添加</el-button>
          </el-row>
          <el-row v-for="(value, index) in edit.FeeLimit" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="最小人数">
                    <el-input v-model.number="edit.FeeLimit[index].MinPlayerNum" size="mini" :required="true" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="最大人数">
                    <el-input v-model.number="edit.FeeLimit[index].MaxPlayerNum" size="mini" :required="true" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="抽水上限">
                    <el-input v-model.number="edit.FeeLimit[index].FeeLimit" size="mini" :required="true" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <el-button type="danger" size="mini" @click="removeFeeLimitRow(index)">删除</el-button>
            </el-col>
          </el-row>

        </fieldset>

        <el-form-item>
          <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function NewTimeConfig() {
  return {
    OpTimeout: 0,
    WantBuyTimeout: 0,
    InsureTimeout: 0,
    SelectMultiTimeout: 0,
    AllowMultiTimeout: 0
  }
}
function NewOutsRatio() {
  return [
    {
      OutsNum: 1,
      Ratio: 30
    },
    {
      OutsNum: 2,
      Ratio: 16
    }
  ]
}
function NewFeeLimit() {
  return [
    {
      MinPlayerNum: 0,
      MaxPlayerNum: 0,
      FeeLimit: 30
    }
  ]
}

function newItem() {
  return {
    CarryLower: 0,
    CarryUpper: 0,
    SmallBlind: 1,
    BigBlind: 0,
    ObjectCount: 0,
    TableMaxPlayerNum: 0,
    TableFee: 0,
    TimeConfig: {},
    MinBuyIn: 0,
    MaxBuyIn: 0,
    BaseBuyIn: 0,
    IntervalBuyIn: 0,
    GPSLimit: 0,
    IPLimit: 0,
    WatchTimesMax: 0,
    Level: 1,
    PrefixChip: 0,
    NoRathole: 0,
    IsDelayShow: 0,
    IsEnableStraddle: 0,
    AutoStartPlayerNumer: 0,
    OutsRatio: [],
    FeeLimit: [],
    IsEnableInsure: 0,
    IsEnableMultiPerflop: 0,
    DelayOpTimeCostMoney: 0,
    DelayOpTimeUsedTimes: 0,
    ShowPublicCardCostMoney: 0,
    HideLevel: 0,
    MinPlayMoney: 0,
    TablePourRatio: 0,
    RabbitPrice: 0,
    InteractDayFreeTimes: 0,
    InteractItemPrice: 0,
    DelayItemPrice: '',
    ForceLookCardPrice: ''
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'SmallBlind', 'MinBuyIn', 'MaxBuyIn', 'BaseBuyIn', 'DelayOpTimeCostMoney', 'ShowPublicCardCostMoney']),
      libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        TimeConfig: NewTimeConfig(),
        OutsRatio: NewOutsRatio(),
        FeeLimit: NewFeeLimit(),
        DelayItemPrice: '',
        ForceLookCardPrice: ''
      },

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        SmallBlind: '小盲',
        MaxPlayerCount: '最大玩牌人数',
        ObjectCount: '桌子数',
        Level: '等级',
        IsPractice: '是否练习场',
        TableFee: '台费',
        MinBuyIn: '最低买入',
        MaxBuyIn: '最大买入',
        BaseBuyIn: '默认买入',
        IntervalBuyIn: '买入间隔',
        LuckyLevelLimitMax: '',
        GPSLimit: '是否GPS限制',
        IPLimit: '是否IP限制',
        WatchTimesMax: '最大旁观局数',
        PrefixChip: '前注',
        NoRathole: '是否开启NoRathole',
        IsDelayShow: '是否开启延迟看牌',
        IsEnableStraddle: '是否开启Straddle',
        AutoStartPlayerNumer: '自动开始人数',
        IsEnableInsure: '是否开启保险',
        IsEnableMultiPerflop: '是否多次发牌',
        DelayOpTimeCostMoney: '延迟消耗金额',
        HideLevel: '进入该场次后隐藏场次',
        DelayOpTimeUsedTimes: '最多使用次数',
        ShowPublicCardCostMoney: '显示公共牌消耗金额',
        MinPlayMoney: '最小玩牌金额',
        TablePourRatio: 'VPIP入池率',
        RabbitPrice: '猎兔价格配置',
        InteractDayFreeTimes: '互动道具每日免费次数',
        InteractItemPrice: '互动道具每次价格消耗',
        DelayItemPrice: '延时道具消耗',
        ForceLookCardPrice: '强制看牌价格'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/texasnlhtable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const o in objs) {
            objs[o].PrefixChip /= 100 // 100倍
            objs[o].RabbitPrice /= 1000
            objs[o].InteractItemPrice /= 1000
            console.log(objs[o])
          }

          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      let goodsCheck = false
      for (const i in this.clientDB.TotalData) {
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
          // count++
        }
        // 除了练习场，其它场次必须配置推荐商品
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 0 && this.clientDB.TotalData[i].GoodsId <= 0) {
          goodsCheck = true
        }
      }
      if (goodsCheck) {
        this.$alert('除了练习场，其它场次必须配置金币不足推荐商品')
        return false
      }
      /*
      if (count !== 1) {
        this.$alert('发布的配置项中，必须有且仅有一个练习场配置')
        return false
      }
      */
      return true
    },
    handlePreOn(ob) {
      this.changeStatus(ob.ID, 7, '您确定要将记录状态修改为"预备上架"吗？该记录将在发布后同步到外网。')
    },
    handleOn(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handlePreOff(ob) {
      this.changeStatus(ob.ID, 8, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/texasnlhtable/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            $this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          // console.log('initFormData 1 _data:', _data)
          // console.log('initFormData 1 this.edit.item:', this.edit.item)
          Object.assign(this.edit.item, _data)
          // console.log('initFormData 2 _data:', _data)
          // console.log('initFormData 2 this.edit.item:', this.edit.item)
          try {
            this.edit.TimeConfig = this.libMoneyRobot.TransForShow(JSON.parse(_data.TimeConfig))
            this.edit.OutsRatio = JSON.parse(_data.OutsRatio)
            this.edit.FeeLimit = JSON.parse(_data.FeeLimitStr)

            // this.edit.DelayItemPrice = _data.DelayItemPrice
            // this.edit.ForceLookCardPrice = _data.ForceLookCardPrice

            this.edit.DelayItemPrice = ''
            this.edit.ForceLookCardPrice = ''

            var tmpP = _data.DelayItemPrice.split(',')
            var isFirst = true
            this.edit.DelayItemPrice = ''
            for (var i = 0; i < tmpP.length; i++) {
              const tmp3 = parseFloat(tmpP[i])
              // console.log('tmpP3:', tmp3)
              var tmpP2 = 0.0
              if (tmp3 % 10 === 0) {
                tmpP2 = Number(tmp3 / 10).toFixed(0)
              } else {
                tmpP2 = Number(tmp3 / 10).toFixed(1)
              }
              // console.log('tmpP2:', tmpP2)

              if (isFirst) {
                this.edit.DelayItemPrice += tmpP2
                isFirst = false
              } else {
                this.edit.DelayItemPrice += ','
                this.edit.DelayItemPrice += tmpP2
              }
            }

            tmpP = _data.ForceLookCardPrice.split(',')
            isFirst = true
            this.edit.ForceLookCardPrice = ''
            for (i = 0; i < tmpP.length; i++) {
              // tmpP2 = Number(parseFloat(tmpP[i]) / 10).toFixed(1)
              const tmp3 = parseFloat(tmpP[i])
              // console.log('tmpP3:', tmp3)
              tmpP2 = 0.0
              if (tmp3 % 10 === 0) {
                tmpP2 = Number(tmp3 / 10).toFixed(0)
              } else {
                tmpP2 = Number(tmp3 / 10).toFixed(1)
              }
              if (isFirst) {
                this.edit.ForceLookCardPrice += tmpP2
                isFirst = false
              } else {
                this.edit.ForceLookCardPrice += ','
                this.edit.ForceLookCardPrice += tmpP2
              }
            }
          } catch (e) {
            console.log('initFormData error 2 e:', e)
            this.edit.TimeConfig = NewTimeConfig()
            this.edit.OutsRatio = NewOutsRatio()
            this.edit.FeeLimit = NewFeeLimit()
            this.edit.DelayItemPrice = ''
            this.edit.ForceLookCardPrice = ''
          }
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      console.log('createSave', postData)
      request({
        url: '/texasnlhtable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      console.log('editSave', postData)
      request({
        url: 'texasnlhtable/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      postData.PrefixChip *= 100 // 放大100倍
      postData.RabbitPrice *= 1000
      postData.InteractItemPrice *= 1000
      return postData
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
        Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinBuyIn > this.edit.item.MaxBuyIn) {
        Message.error('【最低买入】必须小于等于【最大买入】，请检查数值正确性！')
        return false
      }
       if (this.edit.item.BaseBuyIn > this.edit.item.MaxBuyIn || this.edit.item.BaseBuyIn < this.edit.item.MinBuyIn) {
        Message.error('【默认买入】必须小于等于【最大买入】 大于等于【最小买入】，请检查数值正确性！')
        return false
      }
      // TODO 完善
      return true
    },
    save() {
      if (!this.checkFeeLimitValue('2')) return
      if (!this.checkData()) return
      this.edit.item.TimeConfig = JSON.stringify(this.edit.TimeConfig)
      this.edit.item.OutsRatio = JSON.stringify(this.edit.OutsRatio)
      this.edit.item.FeeLimit = JSON.stringify(this.edit.FeeLimit)

      var tmpP = this.edit.DelayItemPrice.split(',')
      this.edit.item.DelayItemPrice = ''
      var isFirst = true
      for (var i = 0; i < tmpP.length; i++) {
        var tmpP2 = Number(parseFloat(tmpP[i]) * 10).toFixed(0)
        // this.edit.item.DelayItemPrice.push(tmpP2)
        if (isFirst) {
          isFirst = false
          this.edit.item.DelayItemPrice += tmpP2
        } else {
          this.edit.item.DelayItemPrice += ','
          this.edit.item.DelayItemPrice += tmpP2
        }
      }

      tmpP = this.edit.ForceLookCardPrice.split(',')
      this.edit.item.ForceLookCardPrice = ''
      isFirst = true
      for (i = 0; i < tmpP.length; i++) {
        tmpP2 = Number(parseFloat(tmpP[i]) * 10).toFixed(0)
        // this.edit.item.ForceLookCardPrice.push(tmpP2)
        if (isFirst) {
          isFirst = false
          this.edit.item.ForceLookCardPrice += tmpP2
        } else {
          this.edit.item.ForceLookCardPrice += ','
          this.edit.item.ForceLookCardPrice += tmpP2
        }
      }

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },
    addOutsRatioRow() {
      this.edit.OutsRatio.push({})
    },
    removeOutsRatioRow(index) {
      this.edit.OutsRatio.splice(index, 1)
    },
    addFeeLimitRow() {
      var item = {
        MinPlayerNum: 0,
        MaxPlayerNum: 0,
        FeeLimit: 0
      }
      this.edit.FeeLimit.push(item)
    },
    removeFeeLimitRow(index) {
      this.edit.FeeLimit.splice(index, 1)
    },
    handlerChangeMin(e) {
      if (parseInt(e) < 2 || parseInt(e) > this.edit.item.TableMaxPlayerNum) {
        Message.error('数据错误')
        return
      }
      if (this.edit.FeeLimit.length <= 1) {
        if (parseInt(e) !== 2) {
          Message.error('数据错误')
          return
        }
      } else {
        if (parseInt(e) !== this.edit.FeeLimit[this.edit.FeeLimit.length - 2].MaxPlayerNum + 1) {
          Message.error('数据错误')
          return
        }
      }
    },
    checkFeeLimitValue() {
      var min = 0
      var max = 0
      for (var i = 0; i < this.edit.FeeLimit.length; i++) {
        if (this.edit.FeeLimit[i].MinPlayerNum < 2 || this.edit.FeeLimit[i].MinPlayerNum > this.edit.item.TableMaxPlayerNum) {
          Message.error('数据错误, 抽水人数超出范围')
          return false
        }
        if (this.edit.FeeLimit[i].MaxPlayerNum < 2 || this.edit.FeeLimit[i].MaxPlayerNum > this.edit.item.TableMaxPlayerNum) {
          Message.error('数据错误, 抽水人数超出范围')
          return false
        }
        if (this.edit.FeeLimit[i].MaxPlayerNum < this.edit.FeeLimit[i].MinPlayerNum) {
          Message.error('数据错误, 抽水人数超出范围')
          return false
        }
        if (this.edit.FeeLimit[i].FeeLimit <= 0) {
          Message.error('数据错误, 抽水上限为 0')
          return false
        }
        if (i === 0) {
          min = this.edit.FeeLimit[i].MinPlayerNum
          max = this.edit.FeeLimit[i].MaxPlayerNum
        } else {
          if (this.edit.FeeLimit[i].MinPlayerNum <= min || this.edit.FeeLimit[i].MinPlayerNum !== max + 1) {
            Message.error('数据错误 人数错误')
            return false
          }
          min = this.edit.FeeLimit[i].MinPlayerNum
          max = this.edit.FeeLimit[i].MaxPlayerNum
        }
      }
      return true
    }
  }
}
</script>
