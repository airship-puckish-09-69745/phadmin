<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-button type="warning" round @click="showUserArea">用户在玩雷区</el-button>
    <div>
      <el-form ref="item" :model="item" label-width="200px">
        <el-row :gutter="10" style="margin-top: 30px">
          <el-col :span="7">
            <el-form-item label="最大人数：" prop="maxPlayers">
              <el-col :span="7">
                <el-input v-model.number="item.maxPlayers" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="小黑屋最大真人数(需重启)：" prop="vupRoomMaxUsers">
              <el-col :span="7">
                <el-input v-model.number="item.vupRoomMaxUsers" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="入场限制：" prop="minMoneyCarry">
              <el-col :span="7">
                <el-input v-model="item.minMoneyCarry" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="扫雷格子数：" prop="cellNum">
              <el-col :span="7">
                <el-input v-model.number="item.cellNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最小炸弹数：" prop="minBombNum">
              <el-col :span="7">
                <el-input v-model.number="item.minBombNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大炸弹数：" prop="maxBombNum">
              <el-col :span="7">
                <el-input v-model.number="item.maxBombNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="最小下注：" prop="minMoneyBet">
              <el-col :span="7">
                <el-input v-model="item.minMoneyBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大下注：" prop="maxMoneyBet">
              <el-col :span="7">
                <el-input v-model.number="item.maxMoneyBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="赢钱转化百分比：" prop="winMoneyTransferRate">
              <el-col :span="7">
                <el-input v-model.number="item.winMoneyTransferRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="超时放弃时间(秒)：" prop="giveUpTime">
              <el-col :span="7">
                <el-input v-model.number="item.giveUpTime" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="允许最大倍数(放大百倍)：" prop="allowMaxBet">
              <el-col :span="7">
                <el-input v-model.number="item.allowMaxBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="小黑屋用户爆炸概率(%)：" prop="vupBombRate">
              <el-col :span="7">
                <el-input v-model.number="item.vupBombRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="抽水额度(%)：" prop="feeRate">
              <el-col :span="7">
                <el-input v-model.number="item.feeRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="jackpot奖池抽取百分比(%)：" prop="jackpotRate">
              <el-col :span="7">
                <el-input v-model.number="item.jackpotRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="解锁jackpot最小下注额度：" prop="jackpotShowLimit">
              <el-col :span="7">
                <el-input v-model.number="item.jackpotShowLimit" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <table class="formTable" style="width:700px;margin-left: 50px;">
            <thead>
              <tr>
                <td>按钮</td>
                <td>类型</td>
                <td>数值</td>
                <td>展示文字</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>一</td>
                <td>
                  <el-select v-model="btnType1" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum1" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow1" :required="true" />
                </td>
              </tr>
              <tr>
                <td>二</td>
                <td>
                  <el-select v-model="btnType2" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum2" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow2" :required="true" />
                </td>
              </tr>
              <tr>
                <td>三</td>
                <td>
                  <el-select v-model="btnType3" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum3" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow3" :required="true" />
                </td>
              </tr>
              <tr>
                <td>四</td>
                <td>
                  <el-select v-model="btnType4" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum4" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow4" :required="true" />
                </td>
              </tr>
              <tr>
                <td>五</td>
                <td>
                  <el-select v-model="btnType5" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum5" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow5" :required="true" />
                </td>
              </tr>
              <tr>
                <td>六</td>
                <td>
                  <el-select v-model="btnType6" placeholder="请选择">
                    <el-option
                      v-for="item in btnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="btnNum6" :required="true" />
                </td>
                <td>
                  <el-input v-model="btnShow6" :required="true" />
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>

        <el-row>
          <table class="formTable" style="width:700px;margin-left: 50px;">
            <thead>
              <tr>
                <td>奖池配置</td>
                <td>jackpot级别</td>
                <td>奖励占比（%）</td>
                <td>中奖概率（%）</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>一</td>
                <td>
                  <el-select v-model="jpType1" placeholder="请选择" disabled>
                    <el-option
                      v-for="item in item.jpLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="jpNum1" :required="true" />
                </td>
                <td>
                  <el-input v-model="jpProb1" :required="true" />
                </td>
              </tr>
              <tr>
                <td>二</td>
                <td>
                  <el-select v-model="jpType2" placeholder="请选择" disabled>
                    <el-option
                      v-for="item in item.jpLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="jpNum2" :required="true" />
                </td>
                <td>
                  <el-input v-model="jpProb2" :required="true" />
                </td>
              </tr>
              <tr>
                <td>三</td>
                <td>
                  <el-select v-model="jpType3" placeholder="请选择" disabled>
                    <el-option
                      v-for="item in item.jpLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="jpNum3" :required="true" />
                </td>
                <td>
                  <el-input v-model="jpProb3" :required="true" />
                </td>
              </tr>
              <tr>
                <td>四</td>
                <td>
                  <el-select v-model="jpType4" placeholder="请选择" disabled>
                    <el-option
                      v-for="item in item.jpLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </td>
                <td>
                  <el-input v-model.number="jpNum4" :required="true" />
                </td>
                <td>
                  <el-input v-model="jpProb4" :required="true" />
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>

        <table class="formTable">
          <thead>
            <tr>
              <td rowspan="2" width="50">炸弹个数</td>
              <td colspan="23">扫中金币倍数（放大百倍）</td>
            </tr>
            <tr>
              <td v-for="cloumnNum in 23" :key="cloumnNum">{{ cloumnNum }}个</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in item.betOptions" :key="index">
              <td>{{ index }}</td>
              <td v-for="i in 23" :key="i">
                <el-input v-if="item[i]" v-model.number="item[i]" size="mini" />
              </td>
            </tr>
          </tbody>
        </table>

        <table class="formTable">
          <thead>
            <tr>
              <td rowspan="2" width="50">炸弹个数</td>
              <td colspan="23">抽中金币出现jackpot概率百分比(%)</td>
            </tr>
            <tr>
              <td v-for="cloumnNum in 23" :key="cloumnNum">{{ cloumnNum }}个</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in item.jackpotOptions" :key="index">
              <td>{{ index }}</td>
              <td v-for="i in 23" :key="i">
                <el-input v-if="item[i]>=0" v-model.number="item[i]" />
              </td>
            </tr>
          </tbody>
        </table>

        <el-form-item>
          <el-button type="primary" @click="setData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="查看玩家在玩雷区"
      :modal="false"
      :visible.sync="showArea.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="showArea" label-width="120px" size="small">
          <el-form-item label="玩家id：">
            <el-input v-model.number="showArea.uid" size="11" placeholder="请输入在用户id" />
          </el-form-item>
          <el-form-item label="生成雷区：">
            <div v-if="showArea.showUlReslt">
              <ul id="sweeperShow">
                <li v-for="(o,key) in showArea.result" :key="key" :label="o" :value="key">
                  {{ o.result }}
                  <div class="showStep">
                    {{ o.step }}
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goSearch">执行</el-button>
          </el-form-item>
        </el-form>
      </el-row>
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
        cellNum: 25,
        minBombNum: 2,
        maxBombNum: 24,
        minMoneyCarry: 1000,
        maxPlayers: 500,
        vupRoomMaxUsers: 1,
        winMoneyTransferRate: 20,
        minMoneyBet: 0,
        maxMoneyBet: 0,
        betOptions: [],
        giveUpTime: 300,
        btnOptions: [],
        allowMaxBet: 100000,
        vupBombRate: 0,
        feeRate: 0,
        jackpotRate: 0,
        jackpotShowLimit: 50,
        jackpotOptions: {
          '2': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20, '19': 20, '20': 20, '21': 20, '22': 20, '23': 20 },
          '3': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20, '19': 20, '20': 20, '21': 20, '22': 20 },
          '4': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20, '19': 20, '20': 20, '21': 20 },
          '5': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20, '19': 20, '20': 20 },
          '6': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20, '19': 20 },
          '7': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20, '18': 20 },
          '8': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20, '17': 20 },
          '9': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20, '16': 20 },
          '10': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20, '15': 20 },
          '11': { '1': 0, '2': 0, '3': 0, '4': 0, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20, '14': 20 },
          '12': { '1': 0, '2': 0, '3': 0, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20, '13': 20 },
          '13': { '1': 0, '2': 0, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20, '12': 20 },
          '14': { '1': 0, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20, '11': 20 },
          '15': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20, '10': 20 },
          '16': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20, '9': 20 },
          '17': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20, '8': 20 },
          '18': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20, '7': 20 },
          '19': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20, '6': 20 },
          '20': { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20 },
          '21': { '1': 20, '2': 20, '3': 20, '4': 20 },
          '22': { '1': 20, '2': 20, '3': 20 },
          '23': { '1': 20, '2': 20 },
          '24': { '1': 20 }
        },
        jpLevelOptions: [
          {
            value: 1,
            label: 'MINI JP'
          },
          {
            value: 2,
            label: 'MINOR JP'
          },
          {
            value: 3,
            label: 'MAJOR JP'
          },
          {
            value: 4,
            label: 'GRAND JP'
          }
        ]
      },
      subKey: 'gameSweeper',
      libShow: $libShow,
      AttrNames: {
        'Data.WinMoneyTransferRate': '赢钱转化百分比',
        'Data.MinMoneyBet': '最小下注',
        'Data.MaxMoneyBet': '最大下注',
        'Data.CellNum': '扫雷格子数',
        'Data.MinBombNum': '最小炸弹数',
        'Data.MaxBombNum': '最大炸弹数',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxPlayers': '最大人数',
        'Data.VupRoomMaxUsers': '小黑屋最大真人数'
      },
      btnOptions: [
        {
          value: 1,
          label: '+'
        },
        {
          value: 2,
          label: '-'
        },
        {
          value: 3,
          label: '*'
        },
        {
          value: 4,
          label: '/'
        }
      ],

      jpType1: 1,
      jpNum1: 5,
      jpProb1: 70,

      jpType2: 2,
      jpNum2: 10,
      jpProb2: 15,

      jpType3: 3,
      jpNum3: 15,
      jpProb3: 10,

      jpType4: 4,
      jpNum4: 20,
      jpProb4: 5,

      btnType1: 1,
      btnNum1: 0,
      btnShow1: '',

      btnType2: 1,
      btnNum2: 0,
      btnShow2: '',

      btnType3: 1,
      btnNum3: 0,
      btnShow3: '',

      btnType4: 1,
      btnNum4: 0,
      btnShow4: '',

      btnType5: 1,
      btnNum5: 0,
      btnShow5: '',

      btnType6: 1,
      btnNum6: 0,
      btnShow6: '',

      showArea: {
        visible: false,
        uid: 0,
        result: [],
        showUlReslt: false
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
            console.log(this.item)
            this.item.btnOptions.forEach(item => {
              if (item.btnIndex == 1) {
                this.btnType1 = item.btnType
                this.btnNum1 = item.btnVal / 1000
                this.btnShow1 = item.btnShow
              } else if (item.btnIndex == 2) {
                this.btnType2 = item.btnType
                this.btnNum2 = item.btnVal / 1000
                this.btnShow2 = item.btnShow
              } else if (item.btnIndex == 3) {
                this.btnType3 = item.btnType
                this.btnNum3 = item.btnVal / 1000
                this.btnShow3 = item.btnShow
              } else if (item.btnIndex == 4) {
                this.btnType4 = item.btnType
                this.btnNum4 = item.btnVal / 1000
                this.btnShow4 = item.btnShow
              } else if (item.btnIndex == 5) {
                this.btnType5 = item.btnType
                this.btnNum5 = item.btnVal / 1000
                this.btnShow5 = item.btnShow
              } else if (item.btnIndex == 6) {
                this.btnType6 = item.btnType
                this.btnNum6 = item.btnVal / 1000
                this.btnShow6 = item.btnShow
              }
            })

            this.item.jpLevelOptions.forEach(item => {
              if (item.jpLevel == 1) {
                this.jpNum1 = item.jpNum
                this.jpProb1 = item.jpProb
              } else if (item.jpLevel == 2) {
                this.jpNum2 = item.jpNum
                this.jpProb2 = item.jpProb
              } else if (item.jpLevel == 3) {
                this.jpNum3 = item.jpNum
                this.jpProb3 = item.jpProb
              } else if (item.jpLevel == 4) {
                this.jpNum4 = item.jpNum
                this.jpProb4 = item.jpProb
              }
            })
            this.transMoneyForShow()
            // this.betMoneyList = this.item.BetMoneyList ? this.item.BetMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    transMoneyForShow() {
      this.item.minMoneyBet /= 1000
      this.item.maxMoneyBet /= 1000
      this.item.minMoneyCarry /= 1000
    },
    getPostData() {
      const ret = {}
      // 处理一下按钮
      this.item.btnOptions = []
      this.item.btnOptions[0] = { btnIndex: 1, btnType: this.btnType1, btnVal: this.btnNum1 * 1000, btnShow: this.btnShow1 }
      this.item.btnOptions[1] = { btnIndex: 2, btnType: this.btnType2, btnVal: this.btnNum2 * 1000, btnShow: this.btnShow2 }
      this.item.btnOptions[2] = { btnIndex: 3, btnType: this.btnType3, btnVal: this.btnNum3 * 1000, btnShow: this.btnShow3 }
      this.item.btnOptions[3] = { btnIndex: 4, btnType: this.btnType4, btnVal: this.btnNum4 * 1000, btnShow: this.btnShow4 }
      this.item.btnOptions[4] = { btnIndex: 5, btnType: this.btnType5, btnVal: this.btnNum5 * 1000, btnShow: this.btnShow5 }
      this.item.btnOptions[5] = { btnIndex: 6, btnType: this.btnType6, btnVal: this.btnNum6 * 1000, btnShow: this.btnShow6 }

      this.item.jpLevelOptions[0] = { jpLevel: 1, label: 'MINI JP', jpNum: this.jpNum1, jpProb: this.jpProb1 }
      this.item.jpLevelOptions[1] = { jpLevel: 2, label: 'MINOR JP', jpNum: this.jpNum2, jpProb: this.jpProb2 }
      this.item.jpLevelOptions[2] = { jpLevel: 3, label: 'MAJOR JP', jpNum: this.jpNum3, jpProb: this.jpProb3 }
      this.item.jpLevelOptions[3] = { jpLevel: 4, label: 'GRAND JP', jpNum: this.jpNum4, jpProb: this.jpProb4 }

      Object.assign(ret, this.item)
      ret.minMoneyBet *= 1000
      ret.maxMoneyBet *= 1000
      ret.minMoneyCarry *= 1000
      return ret
    },
    setData() {
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
    showUserArea() {
      this.showArea.visible = true
    },
    goSearch() {
      this.showArea.showUlReslt = false
      this.showArea.result = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/show/area',
          Gid: 20,
          Uid: this.showArea.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              const showDetail = []
              for (let i = 0; i < response.Data.details.length; i++) {
                const detailRow = response.Data.details[i]
                const areaIndex = detailRow.index - 1
                let showName = '炸弹'
                if (detailRow.result == 1) {
                  showName = '金币'
                }
                showDetail[areaIndex] = { result: showName, step: detailRow.step }
              }
              this.showArea.result = showDetail
              console.log(this.showArea.result)
              this.showArea.showUlReslt = true
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
    .formTable{
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    .formTable td{
        border: 1px solid #eee;
        height: 31px;
        line-height: 31px;
        padding: 2px;
    }
    ul#sweeperShow {
  width: 801px;
  height: 801px;
  padding:0px;
  clear:both;
  margin:0;
  list-style:none;
  border-top:#999 1px solid;
  border-left:#999 1px solid;
}

ul#sweeperShow li {
  width: 160px;
  height: 160px;
  font-size: 35px;
  float: left;
  margin: 0px;
  border: none;
  list-style: none;
  line-height: 150px;
  border-right:#999 1px solid;
  border-bottom:#999 1px solid;
}

ul#sweeperShow li .showStep {
  width: 30px;
  height: 30px;
  font-size: 21px;
  line-height: 30px;
  border-top: 1px #999 solid;
  border-right: 1px #999 solid;
  text-align: center;
  float: left;
  margin-top:130px;
  margin-right:18px;
}
</style>
