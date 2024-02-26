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
              <el-form-item label="金骰子出现概率：" prop="GoldenDiceOccurRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.GoldenDiceOccurRate" size="mini" :required="true" />
                </el-col>
                %
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="结果1记录数：" prop="LogList1Count" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.LogList1Count" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="结果2记录数：" prop="LogList2Count" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.LogList2Count" size="mini" :required="true" />
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
                  <el-input v-model.number="item.TaxRate" size="mini" :required="true" />
                </el-col>
                %
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
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人人均最小下注数：" prop="MinRobotBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotBetMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人人均最大下注数：" prop="MaxRobotBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotBetMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="padding:0 60px; margin-bottom: 20px;">
                <el-button style="float:left;margin-bottom:10px" icon="el-icon-plus" plain @click="showRobotMoneyForm(0)">添加机器人携带</el-button>
                <el-table
                  :data="item.RobotMoney"
                  border
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style=" "
                >
                  <el-table-column
                    prop="Id"
                    label="配置ID"
                  />
                  <el-table-column
                    prop="Rate"
                    label="概率(%)"
                  />
                  <el-table-column
                    prop="MinMoneyCarry"
                    label="最小携带"
                  >
                    <template slot-scope="scope">
                      {{ formatMoney(scope.row.MinMoneyCarry) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="MaxMoneyCarry"
                    label="最大携带"
                  >
                    <template slot-scope="scope">
                      {{ formatMoney(scope.row.MaxMoneyCarry) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-button type="success" plain @click="showRobotMoneyForm(scope.row.Id)">编辑</el-button>
                      <el-button type="danger" plain @click="removeRobotMoney(scope.row.Id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </fieldset>

        </el-col>
        <el-col>
          <el-row>
            <el-col :span="2" :offset="2" style="text-align:right">
              下注区域配置：
            </el-col>
            <el-col :span="8">
              <el-table
                ref="filterTable"
                :data="item.BetOptions"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  width="50"
                />
                <el-table-column
                  prop="Low"
                  label="名称"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-col :span="20">
                      <el-input v-model="scope.row.Name" size="mini" :disabled="true" />
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Low"
                  label="赔率"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-col :span="4">1:</el-col>
                    <el-col :span="20">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="MaxMoneyBet"
                  label="下注上限"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-col :span="20">
                      <el-input v-model.number="scope.row.MaxMoneyBet" size="mini" />
                    </el-col>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="2" style="text-align:right">
              金骰子赔率配置：
            </el-col>
            <el-col :span="6">
              <el-table
                ref="filterTable"
                :data="item.GoldenDiceConfig"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  width="50"
                />
                <el-table-column
                  prop="HitCount"
                  label="出现概率(万分之一)"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-col :span="20">
                      <el-input v-model.number="scope.row.Rate" size="mini" />
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Odds"
                  label="放大倍数"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-col :span="20">
                      <el-input v-model.number="scope.row.ExtraOdds" size="mini" />
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
        </el-col>

        <el-col :offset="16" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-dialog
      :title="robotDialogTitle"
      :visible.sync="showRobotDialog"
      width="40%"
    >
      <el-form ref="form" :model="editRobotMoneyForm" label-width="180px">
        <el-form-item label="ID：">
          <el-input v-model.number="editRobotMoneyForm.Id" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="概率(%)：">
          <el-input v-model.number="editRobotMoneyForm.Rate" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="最小携带：">
          <el-input v-model.number="editRobotMoneyForm.MinMoneyCarry" style="width: 200px;" placeholder="" />
        </el-form-item>
        <el-form-item label="最大携带：">
          <el-input v-model.number="editRobotMoneyForm.MaxMoneyCarry" style="width: 200px;" placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button style="float:left;margin-top:10px" type="primary" round @click="saveRobotMoneyForm()">保存</el-button>
        </el-form-item>
      </el-form>
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
        BetOptions: [{ Name: 'ab', Odds: 0, MaxMoneyBet: 2000 }],
        GoldenDiceConfig: [{ Rate: 200, ExtraOdds: 2000 }],
        MinMoneyCarry: 1000,
        LogList1Count: 100,
        LogList2Count: 100,
        TaxRate: 0,
        ActionSeconds: 15,
        MaxWatchTimes: 0,
        WinMoneyTransferRate: 20,
        GoldenDiceOccurRate: 0,
        FeeRate: 0,
        RecountRate: 0,
        VUPRoomMaxUsers: 1, // 小黑屋最大真人数
        VUPRecountRate: 0, // 小黑屋系统输改赢概率（万分之一）

        MinRobotNumber: 0, // 机器人最小人数
        MaxRobotNumber: 0, // 机器人最大人数
        MinRobotPlayTimes: 0, // 机器人最小玩牌局数
        MaxRobotPlayTimes: 0, // 机器人最大玩牌局数
        MinRobotWinTimes: 0, // 机器人最大赢牌次数下限
        MaxRobotWinTimes: 0, // 机器人最大赢牌次数上限
        MinRobotLoseTimes: 0, // 机器人最大输牌次数下限
        MaxRobotLoseTimes: 0, // 机器人最大输牌次数上限
        MinRobotBetTimes: 0, // 机器人最小下注次数
        MaxRobotBetTimes: 0, // 机器人最大下注次数
        MaxRobotBetMoney: 0, // 机器人最大人均下注值
        MinRobotBetMoney: 0, // 机器人最小人均下注值
        MinPlayersEnableSchema: 10, // 最低调控玩家数
        BetAmount: [], // 下注金额列表配置
        RobotMoney: []
      },
      robotDialogTitle: '',
      showRobotDialog: false,
      editRobotMoneyForm: {
        Id: 0,
        Rate: 0,
        MinMoneyCarry: 0,
        MaxMoneyCarry: 0
      },
      isAddRobotMoney: false,
      betMoneyList: '1,10',
      form: {},
      subKey: 'gameUD',
      libShow: $libShow,
      AttrNames: {
        'Data.MaxPlayers': '最大人数',
        'Data.SeatsNumber': '座位数',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxWatchTimes': '最大旁观次数',
        'Data.LogList1Count': '结果1记录数',
        'Data.LogList2Count': '结果2记录数',
        'Data.ActionSeconds': '操作时长',
        'Data.TaxRate': '抽水百分比',
        'Data.WinMoneyTransferRate': '赢钱转化可提百分比',
        'Data.BetOptions': '下注区域配置',
        'Data.GoldenDiceOccurRate': 'Lucky出现概率',
        'Data.MinRobotNumber': '机器人最小人数',
        'Data.MaxRobotNumber': '机器人最大人数',
        'Data.MinRobotPlayTimes': '机器人最小玩牌局数',
        'Data.MaxRobotPlayTimes': '机器人最大玩牌局数',
        'Data.MinRobotWinTimes': '机器人最大赢牌次数下限',
        'Data.MaxRobotWinTimes': '机器人最大赢牌次数上限',
        'Data.MinRobotLoseTimes': '机器人最大输牌次数下限',
        'Data.MaxRobotLoseTimes': '机器人最大输牌次数上限',
        'Data.MinRobotBetTimes': '机器人最小下注次数',
        'Data.MaxRobotBetTimes': '机器人最大下注次数',
        'Data.GoldenDiceConfig': '金色子赔率配置',
        'Data.MinPlayersEnableSchema': '调控最小真人数',
        'Data.FeeRate': '抽水额度',
        'Data.RecountRate': '系统输重新计算1次概率',
        'Data.VUPRoomMaxUsers': '小黑屋最大真人数',
        'Data.VUPRecountRate': '小黑屋系统输改赢万分比',
        'Data.BetAmount': '下注金额配置',
        'Data.MinRobotBetMoney': '机器人最小人均下注值',
        'Data.MaxRobotBetMoney': '机器人最大人均下注值',
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
    transMoneyForShow() {
      this.item.MinMoneyCarry /= 1000
      this.item.MaxRobotBetMoney /= 1000
      this.item.MinRobotBetMoney /= 1000
      for (const o in this.item.BetMoneyList) {
        this.item.BetMoneyList[o] /= 1000
      }
      for (const o in this.item.BetOptions) {
        this.item.BetOptions[o].MaxMoneyBet /= 1000
      }
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      ret.MinMoneyCarry *= 1000
      ret.MinRobotBetMoney *= 1000
      ret.MaxRobotBetMoney *= 1000
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
      for (const o in this.item.BetOptions) {
        this.item.BetOptions[o].Odds = parseFloat(this.item.BetOptions[o].Odds)
      }

      if (this.item.MaxRobotNumber < this.item.MinRobotNumber) {
        Message.error('“机器人最大人数”不能小于“机器人最小人数”')
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
      } else if (this.item.MaxRobotBetMoney < this.item.MinRobotBetMoney) {
        Message.error('“机器人最大人均下注额”不能小于“机器人最小人均下注额”')
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
    },
    showRobotMoneyForm(id) {
      if (id == 0) {
        this.robotDialogTitle = '添加机器人携带'
        this.editRobotMoneyForm = {
          Id: 0,
          Rate: 0,
          MinMoneyCarry: 0,
          MaxMoneyCarry: 0
        }
        this.isAddRobotMoney = true
      } else {
        for (var i = 0; i < this.item.RobotMoney.length; i++) {
          if (this.item.RobotMoney[i].Id == id) {
            Object.assign(this.editRobotMoneyForm, this.item.RobotMoney[i])
            break
          }
        }

        this.editRobotMoneyForm.MinMoneyCarry /= 1000
        this.editRobotMoneyForm.MaxMoneyCarry /= 1000
        this.robotDialogTitle = '编辑机器人携带'
        this.isAddRobotMoney = false
      }
      this.showRobotDialog = true
    },
    saveRobotMoneyForm() {
      const _this = this
      const editForm = {}
      Object.assign(editForm, _this.editRobotMoneyForm)
      editForm.MinMoneyCarry *= 1000
      editForm.MaxMoneyCarry *= 1000
      if (_this.isAddRobotMoney) {
        _this.item.RobotMoney.push(editForm)
      } else {
        for (var i = 0; i < _this.item.RobotMoney.length; i++) {
          if (_this.item.RobotMoney[i].Id == editForm.Id) {
            _this.item.RobotMoney[i] = editForm
            break
          }
        }
      }
      _this.showRobotDialog = false
    },
    removeRobotMoney(id) {
      const _this = this
      for (var i = 0; i < _this.item.RobotMoney.length; i++) {
        if (_this.item.RobotMoney[i].Id == id) {
          _this.item.RobotMoney.splice(i, 1)
          break
        }
      }
    },
    formatMoney(money) {
      return money / 1000
    }
  }
}
</script>
