<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="item" :model="item" label-width="200px">
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="最大人数：" prop="MaxPlayers" :rules="dataRule(true,{type:'n',range:'1-1000'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxPlayers" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="座位数：" prop="SeatsNumber" :rules="dataRule(true,{type:'n',range:'1-10'})">
                <el-col :span="20">
                  <el-input v-model.number="item.SeatsNumber" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" :offset="1">
              <el-form-item label="下注金额列表：" :required="true">
                <el-col :span="20">
                  <el-input v-model="betMoneyList" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="下注区域数量：" prop="OptionCount" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.OptionCount" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最近牌局结果数量：" prop="OptionLogCount" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.OptionLogCount" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="入场资产限制：" prop="MinMoneyCarry" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MinMoneyCarry" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最大下注资产比例：" prop="MaxBetPercents" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxBetPercents" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="抽水率(1% = 0.01)：" prop="TaxRate" :rules="dataRule(true,{type:'f',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.TaxRate" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="操作时长：" prop="ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.ActionSeconds" size="mini" :required="true" />
                </el-col>秒
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="抽水转Jackpot比例：" prop="JackpotTransferRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.JackpotTransferRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Jackpot奖池开奖比例：" prop="JackpotRewardRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.JackpotRewardRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="最大旁观次数：" prop="MaxWatchTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxWatchTimes" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="调控最少真人数：" prop="MinPlayersEnableSchema" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MinPlayersEnableSchema" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="赢钱转化可提百分比：" prop="WinMoneyTransferRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.WinMoneyTransferRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="(真实)抽水额度：" prop="FeeRate" :rules="dataRule(true,{type:'n',range:'0-100'})">
                <el-col :span="20">
                  <el-input v-model.number="item.FeeRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="系统输重新计算1次概率：" prop="RecountRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.RecountRate" size="mini" :required="true" />
                </el-col>‱
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="小黑屋最大真人数(修改需要重启)：" prop="VUPRoomMaxUsers" :rules="dataRule(true,{type:'n',range:'1-10'})">
                <el-col :span="20">
                  <el-input v-model.number="item.VUPRoomMaxUsers" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="小黑屋系统输改赢概率：" prop="VUPRecountRate" :rules="dataRule(true,{type:'n',range:'0-10000'})">
                <el-col :span="20">
                  <el-input v-model.number="item.VUPRecountRate" size="mini" :required="true" />
                </el-col>‱
              </el-form-item>
            </el-col>
          </el-row>

          <fieldset style="margin:20px auto;">
            <legend>机器人配置</legend>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最小人数：" prop="MinRobotNumber" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大人数：" prop="MaxRobotNumber" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人携带金币下限：" prop="MinRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人携带金币上限：" prop="MaxRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大玩牌局数下限：" prop="MinRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大玩牌局数上限：" prop="MaxRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大赢牌次数下限：" prop="MinRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大赢牌次数上限：" prop="MaxRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大输牌次数下限：" prop="MinRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大输牌次数上限：" prop="MaxRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最小下注次数：" prop="MinRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotBetTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大下注次数：" prop="MaxRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotBetTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>

          <el-row>
            <el-col :span="4" style="text-align:right">
              牌型赔率配置:
            </el-col>
            <el-col :span="19">
              <el-table ref="filterTable" :data="item.OddsConfig" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%">
                <el-table-column type="index" width="50" />
                <el-table-column prop="Low" label="牌型" width="200">
                  <template slot-scope="scope">
                    {{ getCardTypeName(scope.row.CardType) }}
                  </template>
                </el-table-column>
                <el-table-column prop="Low" label="赔率" width="200">
                  <template slot-scope="scope">
                    <el-col :span="4">1:</el-col>
                    <el-col :span="20">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </el-col>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="1">
              <el-tooltip class="item" effect="dark" content="加减项请在自定义配置中处理" placement="right-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;">
            <el-col :span="4" style="text-align:right">
              三条瓜分Jackpot奖池比例:
            </el-col>
            <el-col :span="19">
              <el-table ref="filterTable" :data="item.JackpotRewardConfigs" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%">
                <el-table-column prop="Low" label="三条牌型" width="200">
                  <template slot-scope="scope">
                    {{ getTripleCardTxt(scope.row.Card) }}
                  </template>
                </el-table-column>
                <el-table-column prop="Low" label="瓜分奖池百分比" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Percents" placeholder="百分比">
                      <template slot="append">%</template>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
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
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        MaxPlayers: 400,
        SeatsNumber: 4,
        BetMoneyList: [1, 2],
        OddsConfig: [{ CardType: 1, Odds: 1 }, { CardType: 2, Odds: 2 }, { CardType: 3, Odds: 3 }, { CardType: 4, Odds: 4 }, { CardType: 5, Odds: 5 }, { CardType: 6, Odds: 6 }],
        JackpotRewardConfigs: [
          {Card: 1, Percents: 20},
          {Card: 13, Percents: 10},
          {Card: 12, Percents: 10},
          {Card: 11, Percents: 10},
          {Card: 10, Percents: 5},
          {Card: 9, Percents: 5},
          {Card: 8, Percents: 5},
          {Card: 7, Percents: 0},
          {Card: 6, Percents: 0},
          {Card: 5, Percents: 0},
          {Card: 4, Percents: 0},
          {Card: 3, Percents: 0},
          {Card: 2, Percents: 0}
        ],
        OptionCount: 4,
        MinMoneyCarry: 1000,
        MaxBetPercents: 50,
        OptionLogCount: 6,
        TaxRate: 0,
        ActionSeconds: 15,
        JackpotTransferRate: 20,
        JackpotRewardRate: 50,
        MaxWatchTimes: 0,
        WinMoneyTransferRate: 20,
        FeeRate: 0,
        RecountRate: 0,
        VUPRoomMaxUsers: 1, // 小黑屋最大真人数
        VUPRecountRate: 0, // 小黑屋系统输改赢概率（万分之一）

        MinRobotNumber: 0, // 机器人最小人数
        MaxRobotNumber: 0, // 机器人最大人数
        MinRobotPlayTimes: 0, // 机器人最小玩牌局数
        MaxRobotPlayTimes: 0, // 机器人最大玩牌局数
        MinRobotMoney: 0, // 机器人金币下限
        MaxRobotMoney: 0, // 机器人金币上限
        MinRobotWinTimes: 0, // 机器人最大赢牌次数下限
        MaxRobotWinTimes: 0, // 机器人最大赢牌次数上限
        MinRobotLoseTimes: 0, // 机器人最大输牌次数下限
        MaxRobotLoseTimes: 0, // 机器人最大输牌次数上限
        MinRobotBetTimes: 0, // 机器人最小下注次数
        MaxRobotBetTimes: 0, // 机器人最大下注次数
        MinPlayersEnableSchema: 10 // 最低调控玩家数
      },
      betMoneyList: '1,10',
      cardTypes: ['未知0', '高牌', '对子', '同花', '顺子', '同花顺', '三条'],
      form: {},
      subKey: 'gameZJH100',
      libShow: $libShow,
      AttrNames: {
        'Data.MaxPlayers': '最大人数',
        'Data.SeatsNumber': '座位数',
        'Data.BetMoneyList': '下注金额列表',
        'Data.OptionCount': '下注区域数量',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxBetPercents': '最大下注资产百分比',
        'Data.OptionLogCount': '最近牌局结果数量',
        'Data.TaxRate': '抽水百分比',
        'Data.ActionSeconds': '操作时长',
        'Data.JackpotTransferRate': '抽水转Jackpot百分比',
        'Data.JackpotRewardRate': 'Jackpot开奖百分比',
        'Data.MaxWatchTimes': '最大旁观次数',
        'Data.WinMoneyTransferRate': '赢钱转化可提百分比',
        'Data.MinRobotNumber': '机器人最小人数',
        'Data.MaxRobotNumber': '机器人最大人数',
        'Data.MinRobotPlayTimes': '机器人最小玩牌局数',
        'Data.MaxRobotPlayTimes': '机器人最大玩牌局数',
        'Data.MinRobotMoney': '机器人金币下限',
        'Data.MaxRobotMoney': '机器人金币上限',
        'Data.MinRobotWinTimes': '机器人最大赢牌次数下限',
        'Data.MaxRobotWinTimes': '机器人最大赢牌次数上限',
        'Data.MinRobotLoseTimes': '机器人最大输牌次数下限',
        'Data.MaxRobotLoseTimes': '机器人最大输牌次数上限',
        'Data.MinRobotBetTimes': '机器人最小下注次数',
        'Data.MaxRobotBetTimes': '机器人最大下注次数',
        'Data.OddsConfig': '牌型赔率配置',
        'Data.JackpotRewardConfigs': '三条瓜分Jackpot奖池比例配置',
        'Data.MinPlayersEnableSchema': '调控最小真人数',
        'Data.FeeRate': '抽水额度',
        'Data.RecountRate': '系统输重新计算1次概率',
        'Data.VUPRoomMaxUsers': '小黑屋最大真人数',
        'Data.VUPRecountRate': '小黑屋系统输改赢万分比',
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getCardTypeName(t) {
      return this.cardTypes[t] || '未知' + t
    },
    getTripleCardTxt(card) {
      switch (card) {
        case 1:
          return 'A, A, A';
        case 2:
          return '2, 2, 2';
        case 3:
          return '3, 3, 3';
        case 4:
          return '4, 4, 4';
        case 5:
          return '5, 5, 5';
        case 6:
          return '6, 6, 6';
        case 7:
          return '7, 7, 7';
        case 8:
          return '8, 8, 8';
        case 9:
          return '9, 9, 9';
        case 10:
          return '10, 10, 10';
        case 11:
          return 'J, J, J';
        case 12:
          return 'Q, Q, Q';
        case 13:
          return 'K, K, K';
        default:
          return '错误值:' + card;
      }
    },
    transMoneyForShow() {
      this.item.MinMoneyCarry /= 1000
      this.item.MinRobotMoney /= 1000
      this.item.MaxRobotMoney /= 1000
      for (const o in this.item.BetMoneyList) {
        this.item.BetMoneyList[o] /= 1000
      }
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      ret.MinMoneyCarry *= 1000
      ret.MinRobotMoney *= 1000
      ret.MaxRobotMoney *= 1000
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000
      }
      return ret
    },
    getData() {
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
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            this.betMoneyList = this.item.BetMoneyList ? this.item.BetMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      const items = this.betMoneyList.split(',')
      this.item.BetMoneyList = []
      for (const o in items) {
        this.item.BetMoneyList.push(parseInt(items[o]))
      }
      for (const o in this.item.OddsConfig) {
        this.item.OddsConfig[o].Odds = parseFloat(this.item.OddsConfig[o].Odds);
      }

      if (this.item.MaxRobotNumber < this.item.MinRobotNumber) {
        Message.error('“机器人最大人数”不能小于“机器人最小人数”')
        return
      } else if (this.item.MaxRobotMoney < this.item.MinRobotMoney) {
        Message.error('“机器人携带金币上限”不能小于“机器人携带金币下限”')
        return
      } else if (this.item.MaxRobotPlayTimes < this.item.MinRobotPlayTimes) {
        Message.error('“机器人最大玩牌局数上限”不能小于“机器人最大玩牌局数下限”')
        return
      } else if (this.item.MaxRobotWinTimes < this.item.MinRobotWinTimes) {
        Message.error('“机器人最大赢牌次数上限”不能小于“机器人最大赢牌次数下限”')
        return
      } else if (this.item.MaxRobotLoseTimes < this.item.MinRobotLoseTimes) {
        Message.error('“机器人最大输牌次数上限”不能小于“机器人最大输牌次数下限”')
        return
      } else if (this.item.MaxRobotBetTimes < this.item.MinRobotBetTimes) {
        Message.error('“机器人最大下注次数”不能小于“机器人最小下注次数”')
        return
      } else if (this.item.MinRobotBetTimes < 1 || this.item.MaxRobotBetTimes > 15) {
        Message.error('“机器人最小下注次数”不能小于1，“机器人最大下注次数”不能大于15')
        return
      }

      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
