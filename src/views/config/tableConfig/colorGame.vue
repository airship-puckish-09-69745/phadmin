<template>
    <div class="app-container">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
      <el-row :gutter="10" style="margin-top: 30px">
        <el-form ref="item" :model="item" label-width="200px">
          <el-col :span="12" :offset="3">
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
              <el-col :span="11" :offset="1">
                <el-form-item label="入场限制：" prop="MinMoneyCarry" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinMoneyCarry" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="最大旁观次数：" prop="MaxWatchTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxWatchTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="赢钱转化可提百分比：" prop="WinMoneyTransferRate" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.WinMoneyTransferRate" size="mini" :required="true" />
                  </el-col>
                  %
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="结果记录数：" prop="LogListCount" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.LogListCount" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="操作时长：" prop="ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.ActionSeconds" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="抽水百分比：" prop="TaxRate" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.TaxRate" size="mini" :required="true"/>
                  </el-col>
                  %
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="11" :offset="1">
                    <el-form-item label="下注金额列表：" :required="true">
                    <el-col :span="20">
                        <el-input v-model="betMoneyList" size="mini" :required="true" />
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
                <el-form-item label="抽水额度：" prop="FeeRate" :rules="dataRule(true,{type:'n',range:'0-100'})">
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
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="赢钱榜展示数量：" prop="WinMoneyShowNum">
                  <el-col :span="20">
                    <el-input v-model.number="item.WinMoneyShowNum" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="jackpot奖池抽取百分比：" prop="JackpotRate">
                    <el-col :span="20">
                      <el-input v-model.number="item.JackpotRate" size="mini" :required="true" />
                    </el-col>%
                  </el-form-item>
                </el-col>
            </el-row>
            <fieldset>
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
            <fieldset style="margin-top:10px">
                <legend>下注区域配置</legend>
                <el-row>
                <el-table
                  ref="filterTable"
                  :data="item.BetOptions"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                  />
                  <el-table-column
                    prop="Low"
                    label="名称"
                  >
                    <template slot-scope="scope">
                        <el-input disabled v-model="scope.row.Name" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Odds"
                    label="命中骰子赔率"
                  >
                    
                    <el-table-column
                        label="1颗"
                    >
                        <template slot-scope="scope">
                            <el-input style="width:80px;" v-model.number="scope.row.Odds[0].Odd" size="mini"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="2颗"
                    >
                        <template slot-scope="scope">
                            <el-input style="width:80px;" v-model.number="scope.row.Odds[1].Odd" size="mini"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="3颗"
                    >
                        <template slot-scope="scope">
                            <el-input style="width:80px;" v-model.number="scope.row.Odds[2].Odd" size="mini"/>
                        </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop="MaxMoneyBet"
                    label="下注上限"
                  >
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.MaxMoneyBet" size="mini"/>
                    </template>
                  </el-table-column>
                </el-table>
            </el-row>
            </fieldset>

            <fieldset style="margin-top:10px">
                <legend>jackpot配置</legend>
                <el-row :gutter="10" style="margin-top: 30px">
                    <el-col :span="11" :offset="1">
                        <el-form-item label="本局下注额度(≥)：">
                          <el-col :span="20">
                              <el-input v-model.number="item.Jackpot.BetMoreThan" size="mini" :required="true" />
                          </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="命中触发结果：">
                        <el-col :span="20">
                            <span v-for="(hitObj,index) in item.Jackpot.HitColor" :key="index">
                                {{ getBaoziName(hitObj) }}
                            </span>
                        </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table
                        ref="filterTable"
                        :data="JackpotRandAwards"
                        border
                        :header-cell-style="libShow.DefaultTableHeadClass"
                        :row-style="{height:'10px'}"
                        :cell-style="libShow.DefaultTableCell"
                        style="width: 100%"
                    >
                        <el-table-column type="index" />
                        <el-table-column label="奖励发放类型" prop="AwardType">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.AwardType">
                                    <el-option v-for="typeItem in AwardTypes"
                                        :key="typeItem.Type"
                                        :label="typeItem.Name"
                                        :value="typeItem.Type">>
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="发放数量" prop="Value">
                            <template slot-scope="scope">
                                <el-input style="width: 240px;" v-model.number="scope.row.Value" size="mini" :required="true"/>
                                <front v-if="scope.row.AwardType==1">&nbsp;%</front>
                            </template>
                        </el-table-column>
                        <el-table-column label="触发概率(百分比)" prop="Rate">
                            <template slot-scope="scope">
                                <el-input style="width: 240px;" v-model.number="scope.row.Rate" size="mini" :required="true"/>
                                <front>&nbsp;%</front>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </fieldset>

          </el-col>
  
          <el-col style="margin-top:16px;" :offset="8" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!--对比组件-->
      <compare ref="compare" :attr-names="AttrNames"/>
  
    </div>
  </template>
  
  <script>
  import {Message} from 'element-ui'
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'
  import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
  import BetAmount from '@/components/BetAmount'
  
  export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { Compare, Publish, BetAmount },
    data() {
      return {
        item: {
          MaxPlayers: 400,
          SeatsNumber: 4,
          BetMoneyList: [1, 2],
          BetOptions: [{Name: 'ab', Odds: [{"Number":1, "Odd":2},{"Number":2, "Odd":3},{"Number":3, "Odd":4}], MaxMoneyBet: 2000}],
          MinMoneyCarry: 1000,
          LogListCount: 100,
          TaxRate: 0,
          ActionSeconds: 15,
          MaxWatchTimes: 0,
          WinMoneyTransferRate: 20,
          WinMoneyShowNum: 0,
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
          MinPlayersEnableSchema: 10, // 最低调控玩家数
          FeeRate: 0,
          VUPRoomMaxUsers: 1, // 小黑屋最大真人数
          VUPRecountRate: 0, // 小黑屋系统输改赢概率（万分之一）
          RecountRate: 0,
          BetAmount: [], // 下注金额列表配置
          JackpotRate: 0,
          Jackpot: {
            BetMoreThan: 0,
            HitColor: [
                [1,1,1],
                [2,2,2],
                [3,3,3],
                [4,4,4],
                [5,5,5],
                [6,6,6]
            ],
            RandAwards: [
                {"AwardType": 1, "Value": 10, "Rate": 10}
            ],
            JackpotRate: 0,
          }
        },
        JackpotRandAwards: [],
        ColorItems: [
            {"Id": 1, "Name": "黄", "Key": "yellow"},
            {"Id": 2, "Name": "白", "Key": "white"},
            {"Id": 3, "Name": "紫", "Key": "purple"},
            {"Id": 4, "Name": "蓝", "Key": "blue"},
            {"Id": 5, "Name": "绿", "Key": "green"},
            {"Id": 6, "Name": "红", "Key": "red"}
        ],
        AwardTypes: [
            {"Type": 1, "Name":"奖池百分比"},
            {"Type": 2, "Name":"固定值"},
        ],
        testRand: {
          visible: false,
          times: 0,
          result: []
        },
        betMoneyList: '1,10',
        form: {},
        subKey: 'gameColor',
        libShow: $libShow,
        AttrNames: {
          'Data.MaxPlayers': '最大人数',
          'Data.SeatsNumber': '座位数',
          'Data.MinMoneyCarry': '入场限制',
          'Data.MaxWatchTimes': '最大旁观次数',
          'Data.LogListCount': '结果记录数',
          'Data.ActionSeconds': '操作时长',
          'Data.TaxRate': '抽水百分比',
          'Data.WinMoneyTransferRate': '赢钱转化可提百分比',
          'Data.BetOptions': '下注区域配置',
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
          'Data.MinPlayersEnableSchema': '调控最小真人数',
          'Data.FeeRate': '抽水额度',
          'Data.RecountRate': '系统输重新计算1次概率',
          'Data.VUPRoomMaxUsers': '小黑屋最大真人数',
          'Data.VUPRecountRate': '小黑屋系统输改赢万分比',
          'Data.BetAmount': '下注金额配置',
          'Data.Jackpot': 'Jackpot配置',
          'Data.WinMoneyShowNum': '赢钱榜展示数量',
          'Data.JackpotRate': '赢钱榜展示数量',
          types: {
            Data: 'jsonString' // 整个数据项的类型
          }
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      dataRule(required, config) {
        return DataRule(required, config)
      },
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },
      transMoneyForShow() {
        this.item.MinMoneyCarry /= 1000
        this.item.MinRobotMoney /= 1000
        this.item.MaxRobotMoney /= 1000
        this.item.Jackpot.BetMoreThan /= 1000
        for (const i in this.item.BetMoneyList) {
          this.item.BetMoneyList[i] /= 1000
        }
        for (const j in this.item.BetOptions) {
          this.item.BetOptions[j].MaxMoneyBet /= 1000
        }
        for (const k in this.item.Jackpot.RandAwards) {
            if (this.item.Jackpot.RandAwards[k].AwardType == 2) {
                this.item.Jackpot.RandAwards[k].Value /= 1000
            }
        }
      },
      getBaoziName(colorId) {
        let showArr = [];
        for(let i=0;i<3;i++) {
            var name = this.getColorName(colorId);
            showArr.push(name)
        }
        return "【"+showArr.join("-")+"】"
      },
      getColorName(id) {
        let name = "";
        for(let i=0;i<this.ColorItems.length;i++) {
            if (this.ColorItems[i].Id == id) {
                name = this.ColorItems[i].Name
                break;
            }
        }
        return name;
      },
      getPostData() {
        const ret = {}
        Object.assign(ret, this.item)
        ret.MinMoneyCarry *= 1000
        ret.MinRobotMoney *= 1000
        ret.MaxRobotMoney *= 1000
        ret.Jackpot.BetMoreThan *= 1000
        for (const o in ret.BetMoneyList) {
          ret.BetMoneyList[o] *= 1000
        }
        ret.BetOptions = []
        for (const o in this.item.BetOptions) {
          const obj = {}
          Object.assign(obj, this.item.BetOptions[o])
          obj.MaxMoneyBet *= 1000
          ret.BetOptions.push(obj)
        }
        ret.Jackpot.RandAwards=[];
        for (const o in this.JackpotRandAwards) {
            const raObj = {}
            Object.assign(raObj, this.JackpotRandAwards[o])
            if (raObj.AwardType == 2) {
                raObj.Value *= 1000
            }
            ret.Jackpot.RandAwards.push(raObj)
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
            this.form = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const item = JSON.parse(response.Data.Data)
              Object.assign(this.item, item)
              this.transMoneyForShow()
              this.betMoneyList = this.item.BetMoneyList ? this.item.BetMoneyList.join(',') : this.betMoneyList
              // 设置修改之前数据
              this.JackpotRandAwards = this.item.Jackpot.RandAwards
              this.$refs.compare.SetOldVal(response.Data)
            }
          }
        })
      },
      setData() {
        // console.log(this.item)
        // console.log(this.item.Jackpot.RandAwards.length)
        // for (let i=0;i<this.item.Jackpot.RandAwards.length;i++) {
        //     console.log(this.item.Jackpot.RandAwards[i])
        // }
        if (this.item.Jackpot.RandAwards.length == 0) {
            this.item.Jackpot.RandAwards = this.item.JackpotRandAwards;
        }
        // console.log(this.item)
        if (!ValidateVueItem(this.$refs['item'])) return false
        const items = this.betMoneyList.split(',')
        this.item.BetMoneyList = []
        for (const o in items) {
          this.item.BetMoneyList.push(parseInt(items[o]))
        }
        for (const o in this.item.BetOptions) {
            for (const oi in o.Odds) {
                this.item.BetOptions[o].Odds[oi].Odd = parseFloat(o[oi].Odd)
            }
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
        console.log(this.form.Data)
        const $this = this
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.form)
        this.$refs.compare.Compare(function (isEdit) {
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
      },
      showTestRand() {
        this.testRand.visible = true
      },
      goRand() {
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/game/test/random',
            Gid: 18,
            Times: this.testRand.times,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            // console.log('sign reward', response)
            this.form = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              if (response.RetCode === 0) {
                 this.testRand.result = response.Data.RandRet
              } else {
                this.$message.error(response.Data)
              }
            }
          }
        })
      },
    }
  }
  </script>
  