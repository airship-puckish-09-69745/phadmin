<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">

          <el-row :gutter="10" style="margin-top: 30px">
            <h5>机器人场次开关 </h5>
            <el-form v-model="betMoneyList" label-width="150px" style="margin-top: 10px">
              <el-table
                :data="betMoneyList"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column
                  label="游戏底注"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ scope.row.TableMoney/1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="1" :inactive-value="0" @change="saveChanges(scope.$index, scope.row.IsOpen)" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="RobotCount"
                  label="机器人数"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-select v-model="scope.row.RobotCount" placeholder="请选择">
                      <el-option
                        v-for="robotCount in RobotCountList"
                        :key="robotCount"
                        :label="robotCount"
                        :value="robotCount"/>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>

          </el-row>

          <el-row>
            <el-col :span="20" :offset="1">
              <h5>机器人昵称配置 <el-button type="text" @click="addNickCfg">添加一项</el-button></h5>
              <el-table :data="item.NickCfg" border>
                <el-table-column label="昵称" prop="Nick" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Nick" size="mini" /></template>
                </el-table-column>
                <el-table-column label="概率(%)" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template
                      slot="append"
                    >%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delNickCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20" :offset="1">
              <h5>机器人暂停进桌配置 <el-button type="text" @click="addStopAddCfg">添加一项</el-button></h5>
              <el-table :data="item.StopAddCfg" border>
                <el-table-column label="起始时间(秒)" prop="TimeStart" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.TimeStart" size="mini" /></template>
                </el-table-column>
                <el-table-column label="结束时间(秒)" prop="TimeEnd" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.TimeEnd" size="mini" /></template>
                </el-table-column>
                <el-table-column label="概率(%)" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template
                      slot="append"
                    >%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delStopAddCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-row>
                  <el-form-item label="机器人开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.EnableRobot" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-form-item label="机器人换牌概率：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-input v-model.number="item.ChangeRand" size="mini"><template slot="append">%</template></el-input>
                  </el-form-item>
                  <el-col :span="12">
                    <el-form-item label="最多机器人数">
                      <el-input v-model.number="item.MaxRobotUserNum" size="mini"><template slot="append">人</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="最小玩牌局数">
                      <el-input v-model.number="item.PlayTimesMin" size="mini"><template slot="append">局</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="最大玩牌局数">
                      <el-input v-model.number="item.PlayTimesMax" size="mini"><template slot="append">局</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--                <el-row>-->
                <!--                  <el-col :span="12">-->
                <!--                    <el-form-item label="最小延迟退桌">-->
                <!--                      <el-input v-model.number="item.ExitDelayMin" size="mini"><template slot="append">秒</template></el-input>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                  <el-col :span="12">-->
                <!--                    <el-form-item label="最大延迟退桌">-->
                <!--                      <el-input v-model.number="item.ExitDelayMax" size="mini"><template slot="append">秒</template></el-input>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="预机器人最小等桌">

                      <el-input v-model.number="item.ExitStartDelayMin" size="mini"><template slot="append">分</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="预机器人最大等桌">
                      <el-input v-model.number="item.ExitStartDelayMax" size="mini"><template slot="append">分</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="机器人最小操作时间（秒）">

                      <el-input v-model.number="item.RobotOpMin" size="mini"><template slot="append">秒</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="机器人最大操作时间（秒）">
                      <el-input v-model.number="item.RobotOpMax" size="mini"><template slot="append">秒</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-col :span="12">
                  <el-form-item label="4人桌停止预进桌">
                    <el-input v-model.number="item.FourPlayerStopAllocAdd" size="mini"><template slot="append">桌</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="进桌配置">
          <el-row style="padding-top: 5px">
            <el-col :span="24">
              <div style="padding-top: 10px">
                <el-table :data="item.RobotAddTimeCfg" stripe border style="width: 100%">
                  <el-table-column label="真人情况" width="180">
                    <template slot-scope="scope">
                      {{ fmtRobotString(scope.row.PlayerNum,scope.row.RobotNum,true) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="机器人情况" width="180">
                    <template slot-scope="scope">
                      {{ fmtRobotString(scope.row.PlayerNum,scope.row.RobotNum,false) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="配置">
                    <template slot-scope="scope">
                      <el-table :data="scope.row.TimeCfg" border>
                        <el-table-column label="起始时间(秒)(包含)">
                          <template scope="subScope">
                            <el-input v-model.number="subScope.row.TimeStart" />
                          </template>
                        </el-table-column>
                        <el-table-column label="结束时间(秒)(包含)">
                          <template scope="subScope">
                            <el-input v-model.number="subScope.row.TimeEnd" />
                          </template>
                        </el-table-column>
                        <el-table-column label="概率">
                          <template scope="subScope">
                            <el-input v-model.number="subScope.row.Probability" />
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          :render-header="(h, obj) => addRobotCfgButton(h, obj, scope.row.PlayerNum, scope.row.RobotNum)"
                        >
                          <template scope="subScope">
                            <el-button
                              size="mini"
                              type="danger"
                              @click="delRobotTimeCfgRow(scope.$index, subScope.$index, subScope.row)"
                            >删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="展示资产配置">
          <el-row>
            <el-col :span="20" :offset="1">
              <el-button type="text" @click="addShowMoneyCfg">添加一项</el-button>
              <el-table :data="ShowMoneyCfg" border>
                <el-table-column label="场次" prop="TableMoney" width="200" >
                  <template slot-scope="scope">
                    <!--                    <el-input v-model.number="scope.row.TableMoney/1000" size="mini" />-->
                    <el-select v-model="scope.row.TableMoney" placeholder="请选择">
                      <el-option
                        v-for="itemTableMoney in AllTableMoneyList"
                        :key="itemTableMoney"
                        :label="itemTableMoney/1000"
                        :value="itemTableMoney/1000"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="最小值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMin" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最大值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMax" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delShowMoneyCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="机器人等级和好牌配置">
          <el-row style="padding-top: 5px">
            <h3 style="text-align:center;">真人好牌权重</h3>
            <el-col :span="24">
              <template>
                真人好牌权重：
                <el-input v-model.number="realPlayerGoodWeight" size="normal" />
              </template>
            </el-col>
            <h3 style="text-align:center;">机器人输赢配置[)</h3>
            <el-col :span="24">
              <div style="padding-top: 10px">
                <el-table
                  :data="control"
                  stripe
                  border
                  style="width: 100%"
                >

                  <el-table-column
                    prop="ControlId"
                    label="行号"
                    width="70"
                  />

                  <el-table-column
                    label="输赢最小(%)"
                    width="120"
                  >
                    <template scope="subScope">
                      <el-input v-model.number="subScope.row.PerStartPool" />
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="输赢最大(%)"
                    width="120"
                  >
                    <template scope="subScope">
                      <el-input v-model.number="subScope.row.PerEndPool" />
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="好牌权重"
                    width="120"
                  >
                    <template scope="subScope">
                      <el-input v-model.number="subScope.row.GoodWeight" />
                    </template>
                  </el-table-column>

                  <el-table-column label="机器人级别" width="180">
                    <template scope="subScope">
                      <el-select v-model="subScope.row.AiConfigLevel" placeholder="请选择">
                        <el-option
                          v-for="itemLvl in robotlvl"
                          :key="itemLvl.value"
                          :label="itemLvl.label"
                          :value="itemLvl.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" :render-header="(h,obj)=>addControlButton()">
                    <template scope="subScope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="delControlRow(subScope.$index,subScope.row)"
                      >删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label="场次：" :required="true" prop="TableMoney">
          <el-col :span="15">
            <el-select v-model="edit.item.TableMoney" size="mini">
              <el-option
                v-for="item in TableMoneyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="最小携带：" :required="true" prop="CarryLower">
          <el-col :span="15">
            <el-input v-model="edit.item.CarryLower" />
          </el-col>
        </el-form-item>

        <el-form-item label="最大携带：" :required="true" prop="CarryUpper">
          <el-col :span="15">
            <el-input v-model="edit.item.CarryUpper" />
          </el-col>
        </el-form-item>
        <el-form-item label="最多输金额：" :required="true" prop="LossMoneyMax">
          <el-col :span="15">
            <el-input v-model="edit.item.LossMoneyMax" />
          </el-col>
        </el-form-item>
        <el-form-item label="最多赢金额：" :required="true" prop="WinMoneyMax">
          <el-col :span="15">
            <el-input v-model="edit.item.WinMoneyMax" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import { $libShow, DataRule } from '@/utils/common'
import { $libDate } from '@/utils/common'

function newItem() {
  return { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100 }
}
function newRobotCardsPlans() {
  return {
    PlanID: 0,
    PlanName: '',
    Odds: 0,
    SpecialCards: false,
    SpecialCardsCfg: [
    ],
    NormalCardsCfg: {
      Group1Cfg: [],
      Group2Cfg: [],
      Group3Cfg: []
    }
  }
}
function newNick(nick, probability) {
  return {
    Nick: nick,
    Probability: probability
  }
}
function newShowMoneyCfg() {
  return {
    TableMoney: 1,
    ShowMoneyMin: 30,
    ShowMoneyMax: 100
  }
}
function newRobotAdd() {
  return [
    {
      PlayerNum: 1,
      RobotNum: 1,
      TimeCfg: []
    },
    {
      PlayerNum: 2,
      RobotNum: 1,
      TimeCfg: []
    },
    {
      PlayerNum: 1,
      RobotNum: 0,
      TimeCfg: []
    },
    {
      PlayerNum: 2,
      RobotNum: 0,
      TimeCfg: []
    }
  ]
}
function newStopAdd(timeStart, timeEnd, probability) {
  return {
    TimeStart: timeStart,
    TimeEnd: timeEnd,
    Probability: probability
  }
}
function newPresetCfg(n) {
  return {
    Number: n,
    Probability: 0
  }
}

function NewHistory() {
  return {
    xData: [],
    yData: [
      { Name: '今日', Data: [] },
      { Name: '昨日', Data: [] },
      { Name: '前日', Data: [] }
    ],
    yShow: false
  }
}
export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'pusoyWildRobotNewSetting',
      form: {
        Data: {}
      },
      libShow: $libShow,
      control: [

      ],
      realPlayerGoodWeight:0,
      robotlvl: [
        {
          value: 1,
          label: '强放机器人'
        },
        {
          value: 2,
          label: '弱放机器人'
        },
        {
          value: 3,
          label: '普通机器人'
        },
        {
          value: 4,
          label: '弱杀机器人'
        },
        {
          value: 5,
          label: '强杀机器人'
        },
        {
          value: 6,
          label: '破产保护机器人'
        }
      ],
      pusoyDingCardTypes: [
        {
          value: 0,
          label: '随机'
        },
        {
          value: 1,
          label: '高牌'
        },
        {
          value: 2,
          label: '对子'
        },
        {
          value: 4,
          label: '三条'
        }
      ],
      pusoyCardTypes: [
        {
          value: 101,
          label: '三同花'
        },
        {
          value: 102,
          label: '三顺子'
        },
        {
          value: 103,
          label: '六对半'
        },
        {
          value: 106,
          label: '清一色'
        },
        {
          value: 112,
          label: '一条龙'
        },
        {
          value: 113,
          label: '清龙'
        }
      ],
      pusoyGroupCardTypes: [
        {
          value: 0,
          label: '随机'
        },
        {
          value: 1,
          label: '高牌'
        },
        {
          value: 2,
          label: '对子'
        },
        {
          value: 3,
          label: '两对'
        },
        {
          value: 4,
          label: '三条'
        },
        {
          value: 5,
          label: '顺子'
        },
        {
          value: 6,
          label: '同花'
        },
        {
          value: 7,
          label: '葫芦'
        },
        {
          value: 8,
          label: '四条'
        },
        {
          value: 9,
          label: '同花顺'
        }
      ],
      item: {
        EnableRobot: 0,
        MaxRobotUserNum: 1,
        PlayTimesMin: 0,
        PlayTimesMax: 0,
        IncrPlayTimesMin: 0,
        IncrPlayTimesMax: 0,
        EnterDelayMin: 2,
        EnterDelayMax: 8,
        ExitDelayMin: 6,
        ExitDelayMax: 10,
        ExitStartDelayMin: 0,
        ExitStartDelayMax: 0,
        IncrMoneyRateMin: 0,
        IncrMoneyRateMax: 0,
        StartRobotNum: 0, // 启动机器人数量
        NickCfg: [], // 启动机器人数量
        StopAddCfg: [], // 启动机器人数量
        FourPlayerStopAllocAdd: 0, // 启动机器人数量
        BetCfg: [
          // { CardType: 100, OddsBet: 1, Probability: 0 },
          // { CardType: 100, OddsBet: 2, Probability: 0 },
          // { CardType: 100, OddsBet: 3, Probability: 0 },
          // { CardType: 100, OddsBet: 4, Probability: 0 }
        ],
        RobotCardsPlans: [],
        RobotLevelCfg: [],
        RobotAddTimeCfg: [],
        RobotOpMin: 0,
        RobotOpMax: 0,
        BetMoneyList: [],
        ChangeRand: 0,
        ShowMoneyCfg: [] // 机器人展示资产配置
      },
      RobotCardsPlanIds: {},
      tableMoneyItem: {
        TableMoneyList: []
      },
      TableMoneyList: [
        { value: 1, label: '1' },
        { value: 5, label: '5' }
      ],
      historyForm: {
        visible: false,
        tableMoneyCfgs: [],
        tableMoney: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        chartData: NewHistory()
      },
      robotForm: {
        tableMoney: 0,
        currentVal: 0,
        changeVal: 0
      },
      BetCfg: [
        // { CardType: 100, Odds1: 800, Odds2: 150, Odds3: 40, Odds4: 10 },
        // { CardType: 101, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 102, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 103, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 104, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 105, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 106, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        // { CardType: 107, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        // { CardType: 108, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        // { CardType: 109, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        // { CardType: 110, Odds1: 100, Odds2: 250, Odds3: 250, Odds4: 400 },
        // { CardType: 111, Odds1: 10, Odds2: 10, Odds3: 180, Odds4: 800 },
        // { CardType: 113, Odds1: 5, Odds2: 5, Odds3: 90, Odds4: 900 },
        // { CardType: 114, Odds1: 450, Odds2: 5, Odds3: 5, Odds4: 45 }
      ],
      ProtectCfg: [
        // { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100 },
        // { TableMoney: 5, CarryLower: 1000, CarryUpper: 2500, LossMoneyMax: 500, WinMoneyMax: 500 },
      ],
      ShowMoneyCfg: [
      ],
      CardTypeNames: {
        100: '无牛',
        101: '牛一',
        102: '牛二',
        103: '牛三',
        104: '牛四',
        105: '牛五',
        106: '牛六',
        107: '牛七',
        108: '牛八',
        109: '牛九',
        110: '牛牛',
        111: '四花',
        113: '四条',
        114: '四小'
      },
      isDisabled: false,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      specialCards: [
        {
          value: false,
          label: '普通牌型'
        },
        {
          value: true,
          label: '特殊牌型'
        }
      ],
      betMoneyList: [
        {
          TableMoney: 1000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 5000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 10000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 20000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 50000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 100000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 200000,
          IsOpen: 0,
          RobotCount: 2
        }, {
          TableMoney: 500000,
          IsOpen: 0,
          RobotCount: 2
        }],
      AllTableMoneyList: [],
      RobotCountList: [1,2]
    }
  },
  created() {
    this.getData()
    // this.getTableMoneyList()
    this.isDisabled = false
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    addControlButton() {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddControl()}>添加范围</el-button>
        </div>
      )
    },
    doAddControl() {
      console.log('control')
      const Id = this.control.length + 1
      this.control.push(
        {
          GoodWeight: 0,
          PerStartPool: 0,
          PerEndPool: 0,
          AiConfigLevel: 1,
          ControlId: Id
        }
      )
    },
    delControlRow(mine, row) {
      console.log('mine:' + mine, row)
      this.control.splice(mine, 1)
    },
    // 操作类函数
    clickData(row, column, event) {
      if (row.status === 2) {
        return null
      }
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.TableMoney)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, tableMoney) {
      this.edit.isEdit = bEdit
      if (tableMoney) {
        const _data = this.getDataByTableMoney(tableMoney)
        if (_data) {
          Object.assign(this.edit.item, _data)
        }
      }
    },
    handleEdit(ob) {
      this.initFormData(true, ob.TableMoney)
      this.edit.visible = true
    },
    handleDelete(ob) {
      const $this = this
      this.$confirm('是否确认删除此项配置?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.ProtectCfg.findIndex(item => item.TableMoney === ob.TableMoney)
        this.ProtectCfg.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    getDataByTableMoney(tableMoney) {
      for (let i = 0; i < this.ProtectCfg.length; i++) {
        const data = this.ProtectCfg[i]
        if (data.TableMoney === tableMoney) {
          return data
        }
      }
      return null
    },
    save() {
      // if (!this.checkData()) return
      const index = this.ProtectCfg.findIndex(item => item.TableMoney === this.edit.item.TableMoney)
      if (this.edit.isEdit) {
        this.ProtectCfg.splice(index, 1, this.edit.item)
      } else {
        if (index >= 0) {
          this.$alert('场次已存在，不能重复添加', '提示', { type: 'warning' })
          return
        }
        // 新增
        this.ProtectCfg.push(this.edit.item)
        // 按场次金额排序
        this.ProtectCfg.sort((a, b) => {
          return a.TableMoney - b.TableMoney
        })
      }
      this.edit.visible = false
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getBetMoneyList(BetMoneyList) {
      if (BetMoneyList.length > 0) {
        this.betMoneyList=[]
        for (const o in BetMoneyList) {
          let isOpen = 0
          if (BetMoneyList[o].IsOpen) {
            isOpen = 1
          }
          this.betMoneyList.push({
            TableMoney: BetMoneyList[o].TableMoney,
            IsOpen: isOpen,
            RobotCount: BetMoneyList[o].RobotCount
          })
        }
      }
      console.log(this.betMoneyList)
    },
    changeBetMoneyList(BetMoneyListNew, BetMoneyList) {
      if (BetMoneyListNew.length == 0) {
        const tmpBetMoneyListNew = []
        for (const i in this.betMoneyList) {
          const tmp = this.betMoneyList[i]
          if (BetMoneyList.includes(tmp.TableMoney)) {
            tmpBetMoneyListNew.push({
              TableMoney: tmp.TableMoney,
              RobotCount: tmp.RobotCount,
              IsOpen: true
            })
          }else {
            tmpBetMoneyListNew.push({
              TableMoney: tmp.TableMoney,
              RobotCount: tmp.RobotCount,
              IsOpen: false
            })
          }
        }
        return tmpBetMoneyListNew
      } else {
        return BetMoneyListNew
      }

    },
    saveChanges(index,IsOpen){
      this.betMoneyList[index].IsOpen = IsOpen
    },
    setBetMoneyList() {
      const BetMoneyList = []
      for (const i in this.betMoneyList) {
        if (this.betMoneyList[i].IsOpen === 1) {
          BetMoneyList.slice(this.betMoneyList[i].TableMoney)
        }
      }
      return BetMoneyList
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
          console.log('robotSetting', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            $this.item.RobotCardsPlans = $this.item.RobotCardsPlans || []
            $this.item.RobotLevelCfg = $this.item.RobotLevelCfg || []
            this.item.NickCfg = this.item.NickCfg || []
            this.item.StopAddCfg = this.item.StopAddCfg || []
            this.item.BetMoneyList = this.item.BetMoneyList || []
            this.item.ShowMoneyCfg = this.item.ShowMoneyCfg || []
            this.item.BetMoneyListNew = this.item.BetMoneyListNew || []
            this.item.BetMoneyList = this.item.BetMoneyList || []
            this.item.BetMoneyListNew = this.changeBetMoneyList(this.item.BetMoneyListNew,this.item.BetMoneyList)
            this.getBetMoneyList(this.item.BetMoneyListNew)
            this.item.RobotAddTimeCfg = this.item.RobotAddTimeCfg || newRobotAdd()
            const old = JSON.parse(response.Data.Data)
            $this.item.EnterDelayMin /= 1000
            $this.item.EnterDelayMax /= 1000
            $this.item.ExitDelayMin /= 1000
            $this.item.ExitDelayMax /= 1000
            // $this.item.ExitStartDelayMin = this.item.ExitStartDelayMin || 0
            $this.item.ExitStartDelayMin /= 60
            // $this.item.ExitStartDelayMax = this.item.ExitStartDelayMax || 0
            $this.item.ExitStartDelayMax /= 60
            // $this.item.FourPlayerStopAllocAdd = this.item.FourPlayerStopAllocAdd || 0

            $this.BetCfg = []
            // 方案Id数组赋值
            for (var i = 0; i < this.item.RobotCardsPlans.length; i++) {
              this.RobotCardsPlanIds[this.item.RobotCardsPlans[i].PlanID] = i
            }

            const betCfg = []

            for (const o in betCfg) {
              $this.BetCfg.push(betCfg[o])
            }

            console.log('BetCfg:', $this.BetCfg)

            if ($this.item.ProtectCfg) {
              $this.ProtectCfg = []
            }
            for (const o in $this.item.ProtectCfg) {
              const one = Object.assign({}, $this.item.ProtectCfg[o])
              one.TableMoney /= 1000
              one.CarryLower /= 1000
              one.CarryUpper /= 1000
              one.LossMoneyMax /= 1000
              one.WinMoneyMax /= 1000
              $this.ProtectCfg.push(one)
            }
            for (const o in $this.item.ShowMoneyCfg) {
              const one = Object.assign({}, $this.item.ShowMoneyCfg[o])
              one.TableMoney /= 1000
              one.ShowMoneyMin /= 1000
              one.ShowMoneyMax /= 1000
              $this.ShowMoneyCfg.push(one)
            }
            $this.control = $this.item.Control || []
            $this.realPlayerGoodWeight = $this.item.RealPlayerGoodWeight || 0
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
            // 获取底注
            this.getTableMoneyList()
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      cpy.EnterDelayMin *= 1000
      cpy.EnterDelayMax *= 1000
      cpy.ExitDelayMin *= 1000
      cpy.ExitDelayMax *= 1000
      cpy.ExitStartDelayMin *= 60
      cpy.ExitStartDelayMax *= 60
      cpy.BetCfg = []
      cpy.ProtectCfg = []
      cpy.ShowMoneyCfg = []
      cpy.Control = this.control
      cpy.BetMoneyList = []
      cpy.BetMoneyListNew = []
      cpy.RealPlayerGoodWeight = this.realPlayerGoodWeight
      for (const i in this.betMoneyList) {
        if (this.betMoneyList[i].IsOpen === 1) {
          cpy.BetMoneyList.push(this.betMoneyList[i].TableMoney)
        }
        cpy.BetMoneyListNew.push({
          TableMoney: this.betMoneyList[i].TableMoney,
          RobotCount: this.betMoneyList[i].RobotCount,
          IsOpen: this.betMoneyList[i].IsOpen === 1
        })
      }
      for (const o in this.BetCfg) {
        for (let i = 1; i <= 4; i++) {
          const obj = {}
          obj.Probability = this.BetCfg[o]['Odds' + i]
          obj.CardType = this.BetCfg[o].CardType
          obj.OddsBet = i
          cpy.BetCfg.push(obj)
        }
      }

      for (const o in this.ProtectCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ProtectCfg[o].TableMoney) * 1000
        obj.CarryLower = parseInt(this.ProtectCfg[o].CarryLower) * 1000
        obj.CarryUpper = parseInt(this.ProtectCfg[o].CarryUpper) * 1000
        obj.LossMoneyMax = parseInt(this.ProtectCfg[o].LossMoneyMax) * 1000
        obj.WinMoneyMax = parseInt(this.ProtectCfg[o].WinMoneyMax) * 1000
        cpy.ProtectCfg.push(obj)
      }
      for (const o in this.ShowMoneyCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ShowMoneyCfg[o].TableMoney) * 1000
        obj.ShowMoneyMin = parseInt(this.ShowMoneyCfg[o].ShowMoneyMin) * 1000
        obj.ShowMoneyMax = parseInt(this.ShowMoneyCfg[o].ShowMoneyMax) * 1000
        cpy.ShowMoneyCfg.push(obj)
      }
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
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
          }
        })
      })
    },
    addRobotCardsPlans() {
      this.item.RobotCardsPlans.push(newRobotCardsPlans())
    },
    delRobotCardsPlans(idx) {
      // 查看方案是否存在，存在不能删
      if (this.item.RobotCardsPlans[idx] && this.hasRobotLevelCfgPlanId(this.item.RobotCardsPlans[idx].PlanID)) {
        Message.warning('场次调控中配置了该方案，请删除之后再操作')
        return
      }
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.RobotCardsPlans, idx)
      })
    },
    hasRobotLevelCfgPlanId(planId) {
      if (planId <= 0) {
        return false
      }
      for (let j = 0; j < this.item.RobotLevelCfg.length; j++) {
        if (this.item.RobotLevelCfg[j].Ranges && this.item.RobotLevelCfg[j].Ranges.length > 0) {
          for (const level of this.item.RobotLevelCfg[j].Ranges) {
            if (level.PlanID > 0 && level.PlanID == planId) {
              return true
            }
          }
        }
      }
      return false
    },
    pusoyShowPlanName(item) {
      return `${item.PlanID} - ${item.PlanName}`
    },
    handlePlanIDChange(row) {
      if (row.PlanID <= 0 || this.RobotCardsPlanIds.hasOwnProperty(row.PlanID)) {
        Message.warning('方案ID必须大于0且不能重复，请检查重新填写')
        return
      }
    },
    hasPlanIDAndIdx(row, idx) {
      if (this.RobotCardsPlanIds.hasOwnProperty(row.PlanID)) {
        if (this.RobotCardsPlanIds[row.PlanID] === idx) {
          return true
        }
      }
      return false
    },
    delRowSpecialCardsCfg(parent, mine) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.item.RobotCardsPlans[parent].SpecialCardsCfg.splice(mine, 1)
      })
    },
    addCardsDetailCfg(idx) {
      if (this.item.RobotCardsPlans[idx].SpecialCards) {
        return (
          <div>
            <span>操作</span>
            <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddSpecialCardsCfg(idx)}>添加</el-button>
          </div>
        )
      } else {
        return (
          <div>
            <span>操作</span>
            <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddNormalCardsGroup1(idx)}>添加</el-button>
          </div>
        )
      }
    },
    doAddSpecialCardsCfg(index) {
      this.item.RobotCardsPlans[index].SpecialCardsCfg.push({
        Odds: 0,
        CardType: 0
      })
    },
    doAddNormalCardsGroup1(idx) {
      this.item.RobotCardsPlans[idx].NormalCardsCfg.Group1Cfg.push({
        Odds: 0,
        GroupType: 0
      })
    },
    delRowNormalCardsGroup2Cfg(parent, mine) {
      this.item.RobotCardsPlans[parent].NormalCardsCfg.Group2Cfg.splice(mine, 1)
    },
    addNormalCardsGroup2Cfg(idx) {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddNormalCardsGroup2(idx)}>添加</el-button>
        </div>
      )
    },
    doAddNormalCardsGroup2(idx) {
      this.item.RobotCardsPlans[idx].NormalCardsCfg.Group2Cfg.push({
        Odds: 0,
        GroupType: 0
      })
    },
    delRowNormalCardsGroup3Cfg(parent, mine) {
      this.item.RobotCardsPlans[parent].NormalCardsCfg.Group3Cfg.splice(mine, 1)
    },
    addNormalCardsGroup3Cfg(idx) {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddNormalCardsGroup3(idx)}>添加</el-button>
        </div>
      )
    },
    doAddNormalCardsGroup3(idx) {
      this.item.RobotCardsPlans[idx].NormalCardsCfg.Group3Cfg.push({
        Odds: 0,
        GroupType: 0
      })
    },
    handleCardTypeChange(row, index) {
      if (row.SpecialCards) {
        row.SpecialCards = true
        row.SpecialCardsCfg = []
        row.NormalCardsCfg = {
          Group1Cfg: [],
          Group2Cfg: [],
          Group3Cfg: []
        }
      } else {
        row.SpecialCards = false
        row.SpecialCardsCfg = []
        row.NormalCardsCfg = {
          Group1Cfg: [],
          Group2Cfg: [],
          Group3Cfg: []
        }
      }
    },
    showRobotPoolForm(tableMoney, poolMoney) {
      this.robotForm.currentVal = poolMoney
      this.robotForm.tableMoney = tableMoney
      this.editRobotSync = true
    },
    showHistoryChart(tableMoney) {
      this.historyForm.tableMoney = tableMoney
      if (this.item.RobotLevelCfg.length > 0) {
        this.historyForm.tableMoneyCfgs = []
        for (var i = 0; i < this.item.RobotLevelCfg.length; i++) {
          this.historyForm.tableMoneyCfgs.push({
            'value': this.item.RobotLevelCfg[i].TableMoney,
            'label': this.fmtMoney(this.item.RobotLevelCfg[i].TableMoney)
          })
        }
      }
      this.searchHistory()
      this.historyForm.visible = true
    },
    addTableHeaderButton(h, data, tableMoney) {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAdd(tableMoney)}>添加范围</el-button>
        </div>
      )
    },
    addRobotCfgButton(h, data, playerNum, robotNum) {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddRobotTimeCfg(playerNum, robotNum)}>添加范围</el-button>
        </div>
      )
    },
    delRow(parent, mine, row) {
      console.log('parent:' + parent + 'mine:' + mine, row)
      this.item.RobotLevelCfg[parent].Ranges.splice(mine, 1)
    },
    delRobotTimeCfgRow(parent, mine, row) {
      console.log('parent:' + parent + 'mine:' + mine, row)
      this.item.RobotAddTimeCfg[parent].TimeCfg.splice(mine, 1)
    },
    doAddRobotTimeCfg(playerNum, robotNum) {
      for (let i = 0; i < this.item.RobotAddTimeCfg.length; i++) {
        if (this.item.RobotAddTimeCfg[i].PlayerNum === playerNum && this.item.RobotAddTimeCfg[i].RobotNum === robotNum) {
          this.item.RobotAddTimeCfg[i].TimeCfg.push(newStopAdd(0, 0, 0))
        }
      }
    },
    doAdd(tableMoney) {
      for (let i = 0; i < this.item.RobotLevelCfg.length; i++) {
        if (this.item.RobotLevelCfg[i].TableMoney === tableMoney) {
          this.item.RobotLevelCfg[i].Ranges.push(
            {
              MinTimes: 0,
              MaxTimes: 0,
              PlanID: 0
            }
          )
        }
      }
    },
    // 格式化人数
    fmtMoney(value) {
      let absValue = Math.abs(value)
      const units = ['', 'K', 'M', 'B']
      let unitIndex = 0

      while (absValue >= 1000 && unitIndex < units.length - 1) {
        absValue /= 1000
        unitIndex++
      }
      return (value < 0 ? '-' : '') + absValue.toFixed(2).replace(/\.?0*$/, '') + units[unitIndex]
    },
    // 格式化人数
    fmtRobotString(realNum, robotNum, isReal) {
      if (robotNum === 0) {
        if (isReal) {
          return '只有玩家'
        } else {
          if (realNum === 1) {
            return '机器人1进入'
          } else {
            return '机器人2进入'
          }
        }
      } else {
        if (isReal) {
          return realNum + '个真人'
        } else {
          return '存在机器人'
        }
      }
    },
    delRowNormalCardsGroup1Cfg(parent, mine) {
      this.item.RobotCardsPlans[parent].NormalCardsCfg.Group1Cfg.splice(mine, 1)
    },
    getTableMoneyList() {
      request({
        url: '/pusoywildtable/all',
        method: 'get',
        data: {}
      }).then(response => {
        let tableMoneyList = ''

        if (response.RetCode === 0) {
          const objs = response.Data || []
          // console.log("table list:", objs)
          for (let i = 0; i < objs.length; i++) {
            const tableMoney = objs[i].TableMoney
            let isFind = false
            for (let j = 0; j < this.item.RobotLevelCfg.length; j++) {
              if (this.item.RobotLevelCfg[j].TableMoney == tableMoney) {
                isFind = true
                break
              }
            }
            if (!isFind) {
              this.item.RobotLevelCfg.push(this.getOneRobotLevel(tableMoney))
            }
            if (i === 0) {
              tableMoneyList += '' + tableMoney
            } else {
              tableMoneyList += ',' + tableMoney
            }
            if (objs[i].IsPractice === 0 && objs[i].Status === 2&& objs[i].RoomLevel===0) {
              this.AllTableMoneyList.push(tableMoney)
            }
          }
        }
        this.AllTableMoneyList.sort((a, b) => {
          return a - b
        })
        if (tableMoneyList != '') {
          this.getRobotProfit(tableMoneyList)
        }
      })
    },
    getOneRobotLevel(tableMoney) {
      return {
        TableMoney: tableMoney,
        Pool: 0,
        Ranges: []
      }
    },

    getRobotProfit(tableMoneyList) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/robotpool/list',
          table_money: tableMoneyList,
          game_id: 21
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < $this.item.RobotLevelCfg.length; i++) {
            if (objs.hasOwnProperty($this.item.RobotLevelCfg[i].TableMoney)) {
              $this.item.RobotLevelCfg[i].Pool = objs[$this.item.RobotLevelCfg[i].TableMoney]
            }
          }
        }
      })
    },
    addNickCfg() {
      this.item.NickCfg.push(newNick('', 0))
    },
    addShowMoneyCfg() {
      this.ShowMoneyCfg.push(newShowMoneyCfg())
    },
    delNickCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.NickCfg, idx)
      })
    },
    delShowMoneyCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.ShowMoneyCfg, idx)
      })
    },
    addStopAddCfg() {
      this.item.StopAddCfg.push(newStopAdd(0, 0, 0))
    },
    delStopAddCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.StopAddCfg, idx)
      })
    }
  }
}
</script>

<style scoped>

</style>
