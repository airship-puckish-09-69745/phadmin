<template>
  <div id="app" class="page-container" style="padding: 10px">

    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-row style="padding-top: 5px">
            <h3 style="text-align:center;">机器人AI配置</h3>
            <el-col :span="24">
              <div style="padding-top: 10px">
                <el-table
                  :data="tableData"
                  stripe
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="AiConfigId"
                    label="级别"
                    width="70"
                  />
                  <el-table-column
                    prop="AiConfigName"
                    label="级别"
                    width="250"
                  />
                  <el-table-column
                    label="操作"
                    column-key="op"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-document-copy"
                        @click="handleUpdate(scope.row)"
                      >修改
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
          <el-row style="padding-top: 5px">
            <h3 style="text-align:center;">机器人输赢配置</h3>
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

                  <el-table-column label="机器人级别" width="120">
                    <template scope="subScope">
                      <el-select v-model="subScope.row.AiConfigLevel" placeholder="请选择">
                        <el-option
                          v-for="item in robotlvl"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
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

          <el-row style="padding-top: 5px">

            <h3 style="text-align:center;">机器人分配</h3>
            <el-col :span="24">
              <div style="padding-top: 10px">
                <el-table
                  :data="actionList"
                  stripe
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="底注"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.TableMoney/1000 }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="当前输赢"
                  >
                    <template slot-scope="scope">
                      <a href="javascript:void(0)" style="cursor: pointer; color:rgb(59, 59, 232);" @click="showRobotPoolForm(scope.row.TableMoney)">{{ getRobotProfitByTableMoney(scope.row.TableMoney,true) }}</a>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="分配"
                    width="650"
                  >
                    <template slot-scope="scope">
                      <el-table :data="scope.row.List" border>
                        <el-table-column label="输赢最小">
                          <template scope="subScope">
                            <el-input v-model.number="subScope.row.StartPool" />
                          </template>
                        </el-table-column>
                        <el-table-column label="输赢最大">
                          <template scope="subScope">
                            <el-input v-model.number="subScope.row.EndPool" />
                          </template>
                        </el-table-column>
                        <el-table-column label="机器人级别">
                          <template scope="subScope">
                            <el-select v-model="subScope.row.AiConfigLevel" placeholder="请选择">
                              <el-option
                                v-for="item in robotlvl"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" :render-header="(h,obj)=>addTableHeaderButton(h,obj,scope.row.TableMoney)">
                          <template scope="subScope">
                            <el-button
                              size="mini"
                              type="danger"
                              @click="delRow(scope.$index,subScope.$index,subScope.row)"
                            >删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
<!--            <el-col :offset="16" :span="8">-->
<!--              <el-button type="primary" @click="setData">保存分配信息</el-button>-->
<!--            </el-col>-->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="信息配置">
          <el-row>
            <el-col :span="20" :offset="1">
              <h5>机器人默认离桌配置</h5>
              <el-descriptions :column="2" :colon="false" border>
                <el-descriptions-item label="最小离桌玩牌次数" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
                  <el-input v-model.number="RobotExitCfg.PlayTimeMin" type="number" size="medium" style="width: 120px" />
                </el-descriptions-item>
                <el-descriptions-item label="最大离桌玩牌次数" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
                  <el-input v-model.number="RobotExitCfg.PlayTimeMax" type="number" size="medium" style="width: 120px" />
                </el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="20" :offset="1">
              <h5>机器人场次离桌配置</h5>
              <el-button type="text" @click="addRobotTableMoneyExitCfg">添加一项</el-button>
              <el-table :data="RobotTableMoneyExitCfg" border>
                <el-table-column label="场次" prop="TableMoney" width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.TableMoney" placeholder="请选择">
                      <el-option
                        v-for="itemTableMoney in AllTableMoneyList"
                        :key="itemTableMoney"
                        :label="itemTableMoney/1000"
                        :value="itemTableMoney/1000"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="最小离桌玩牌次数" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.PlayTimeMin" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="最大离桌玩牌次数" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.PlayTimeMax" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRobotTableMoneyExitCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col :span="20" :offset="1">
              <h5>机器人昵称配置 <el-button type="text" @click="addNameCfg">添加一项</el-button></h5>
              <el-table :data="NameCfg" border>
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
                <el-table-column label="渠道" width="400">
                  <!--                  <template slot-scope="scope">-->
                  <!--                    <el-input v-model.number="scope.row.Channels" size="mini"><template-->
                  <!--                      slot="append"-->
                  <!--                    >%</template></el-input>-->
                  <!--                  </template>-->
                  <template slot-scope="scope">
                    <el-checkbox-group v-model="scope.row.Channels">
                      <el-checkbox label="BP" />
                      <el-checkbox label="GP" />
                      <el-checkbox label="CP" />
                      <el-checkbox label="AP" />
                      <el-checkbox label="DEV" />
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column label="使用casino机器人昵称" width="200">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.IsUseCasio"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="(val) => handleUseCasino(val, scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delNameCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1">
              <el-button type="text" @click="addShowMoneyCfg">添加一项</el-button>
              <el-table :data="ShowMoneyCfg" border>
                <el-table-column label="场次" prop="TableMoney" width="200">
                  <template slot-scope="scope">
                    <!--                    <el-input v-model.number="scope.row.TableMoney/1000" size="mini" />-->
                    <el-select v-model="scope.row.TableMoney" placeholder="请选择">
                      <el-option
                        v-for="itemTableMoney in AllTableMoneyList"
                        :key="itemTableMoney"
                        :label="itemTableMoney/1000"
                        :value="itemTableMoney/1000"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="最小值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMin" size="mini" />
                    <p v-if="errorMin" style="color: red">{{ errorMin }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="最大值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMax" size="mini" />
                    <p v-if="errorMax" style="color: red">{{ errorMax }}</p>
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
      </el-tabs>
    </el-row>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>
    <el-dialog
      title="机器人配置"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="edit" game-type="joker" />
            </el-tab-pane>
            <el-tab-pane label="决策配置">
              <robot-ai-setting-decision v-model="edit" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改机器人输赢奖池"
      :visible.sync="editRobotSync"
    >
      <el-form ref="edit" :model="robotForm" width="70%" label-position="top">
        <el-form-item label="当前池子：">
          {{ robotForm.currentVal }}
        </el-form-item>
        <el-form-item label="变化值：">
          <el-input v-model.number="robotForm.changeVal" />
        </el-form-item>
        <el-form-item label="操作后的值：">
          {{ showRobotEndVal() }}
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setRobotPool">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { $libDate, $libShow, DataRule, MoneyShow } from '@/utils/common'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import MoneyInput from '@/components/MoneyInput'
import robotAiSettingFight from './tongits/robotAiSettingFight'
import robotAiSettingChallenge from './tongits/robotAiSettingChallenge'
import robotAiSettingDrop from './tongits/robotAiSettingDrop'
import robotAiSettingOutCard from './tongits/robotAiSettingOutCard'
import robotAiSettingBuildCard from './tongits/robotAiSettingBuildCard'
import robotAiSettingDecision from './tongits/robotAiSettingDecision'
function newNameCfgItem(nick, probability) {
  return {
    Nick: nick,
    Probability: probability,
    Channels: [],
    IsUseCasio: false
  }
}
function newShowMoneyCfg() {
  return {
    TableMoney: 1,
    ShowMoneyMin: 30,
    ShowMoneyMax: 100
  }
}
function newRobotExitCfg() {
  return {
    PlayTimeMin: 10,
    PlayTimeMax: 20
  }
}
function newRobotTableMoneyExitCfg() {
  return {
    TableMoney: 1,
    PlayTimeMin: 10,
    PlayTimeMax: 20
  }
}
export default {
  components: { Compare, Publish, robotAiSettingFight, robotAiSettingChallenge, robotAiSettingDrop, robotAiSettingOutCard, robotAiSettingBuildCard, MoneyInput,robotAiSettingDecision },
  data() {
    return {
      subKey: 'tongits_laizi_ai',
      gameId: 31,
      load: false,
      form: {
      },
      tableData: [],
      editVisible: false,
      edit: {},
      item: {},
      actionList: [

      ],
      control: [

      ],
      errorMax: '',
      errorMin: '',
      poolMoneyList: {},
      robotlvl: [
        {
          value: 1,
          label: '机器人A'
        },
        {
          value: 2,
          label: '机器人B'
        },
        {
          value: 3,
          label: '机器人C'
        },
        {
          value: 4,
          label: '机器人D'
        },
        {
          value: 5,
          label: '机器人E'
        }
      ],
      robotForm: {
        tableMoney: 0,
        currentVal: 0,
        changeVal: 0
      },
      editRobotSync: false,

      NameCfg: [], // 启动机器人名字配置
      ShowMoneyCfg: [], // 机器人展示资产配置
      AllTableMoneyList: [],
      RobotExitCfg: { //机器人默认离桌配置
        PlayTimeMin: 10,
        PlayTimeMax: 20
      },
      RobotTableMoneyExitCfg: []
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getOneAction(tableMoney) {
      return {
        TableMoney: tableMoney,
        Pool: 0,
        List: [
          {
            StartPool: 0,
            EndPool: 0,
            AiConfigLevel: 1
          }
        ]
      }
    },
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
          console.log('response==>', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            console.log('cfg==>', cfg)
            this.item = cfg
            this.tableData = this.item.Config
            this.actionList = this.item.Action
            // this.NameCfg = this.item.NameCfg || []
            this.NameCfg = []
            const NameCfg = this.item.NameCfg || []
            for (const o in NameCfg) {
              const one = Object.assign({}, NameCfg[o])
              if (!one.Channels) {
                one.Channels = []
                one.IsUseCasio = false
              }
              this.NameCfg.push(one)
            }
            this.RobotExitCfg = this.item.RobotExitCfg || newRobotExitCfg()
            const RobotTableMoneyExitCfg = this.item.RobotTableMoneyExitCfg || []
            const ShowMoneyCfg = this.item.ShowMoneyCfg || []
            if (this.item.Control) {
              this.control = this.item.Control
            }
            for (const o in ShowMoneyCfg) {
              const one = Object.assign({}, ShowMoneyCfg[o])
              one.TableMoney /= 1000
              one.ShowMoneyMin /= 1000
              one.ShowMoneyMax /= 1000
              this.ShowMoneyCfg.push(one)
            }
            this.RobotTableMoneyExitCfg = []
            for (const o in RobotTableMoneyExitCfg) {
              const one = Object.assign({}, RobotTableMoneyExitCfg[o])
              one.TableMoney /= 1000
              this.RobotTableMoneyExitCfg.push(one)
            }
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.moneyProc(false)
            this.load = true
            // 获取底注
            this.getTableMoneyList()
          }
        }
      })
    },
    getTableMoneyList() {
      request({
        url: '/tongitstable/all',
        method: 'get',
        data: {
          PlayMode: 2
        }
      }).then(response => {
        let tableList = ''
        let index = 0
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('table list:', objs)
          for (let i = 0; i < objs.length; i++) {
            const tableMoney = objs[i].TableMoney
            let isFind = false
            for (let j = 0; j < this.item.Action.length; j++) {
              if (this.item.Action[j].TableMoney == tableMoney) {
                isFind = true
                break
              }
            }
            if (!isFind) {
              this.item.Action.push(this.getOneAction(tableMoney))
            }
            if (index === 0) {
              tableList += '' + tableMoney
            } else {
              tableList += ',' + tableMoney
            }
            if (objs[i].IsPractice === 0 && objs[i].RoomLevel === 0) {
              this.AllTableMoneyList.push(tableMoney)
            }
            index++
          }
        }
        this.AllTableMoneyList.sort((a, b) => {
          return a - b
        })
        if (tableList !== '') {
          this.getRobotProfit(tableList)
        }
      })
    },
    getRobotProfit(tableList) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/tongitsrobotpool/list',
          table_money: tableList,
          game_id: this.gameId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('/tongitsrobotpool/list===>', objs)
          $this.poolMoneyList = objs
          // for (let i=0;i<$this.actionList.length;i++){
          //   console.log("aaa==>",$this.actionList[i])
          //   if(objs.hasOwnProperty($this.actionList[i].TableMoney)){
          //     $this.actionList[i].Pool = objs[$this.actionList[i].TableMoney]
          //   }
          // }
        }
      })
    },
    getRobotProfitByTableMoney(tableMoney, isDlv) {
      if (this.poolMoneyList.hasOwnProperty(tableMoney)) {
        return isDlv ? this.poolMoneyList[tableMoney] / 1000 : this.poolMoneyList[tableMoney]
      }
      return 0
    },
    handleUpdate(row) {
      this.editVisible = true
      console.log('row==>', row)
      this.edit = row
      if (!row.Fight.Special.hasOwnProperty('RealPlayerNotDrop')) {
        row.Fight.Special['RealPlayerNotDrop'] = []
      }
    },
    moneyProc(isMul) {
      for (let i = 0; i < this.actionList.length; i++) {
        for (let j = 0; j < this.actionList[i].List.length; j++) {
          if (isMul) {
            this.actionList[i].List[j].StartPool *= 1000
            this.actionList[i].List[j].EndPool *= 1000
          } else {
            this.actionList[i].List[j].StartPool /= 1000
            this.actionList[i].List[j].EndPool /= 1000
          }
        }
      }
    },
    checkShowMoneyCfg() {
      for (const o in this.ShowMoneyCfg) {
        if (this.ShowMoneyCfg[o].ShowMoneyMin >= this.ShowMoneyCfg[o].ShowMoneyMax) {
          Message.error('底注' + this.ShowMoneyCfg[o].TableMoney + '错误,最小金额不能大于最大金额')
          return false
        }
        if (this.ShowMoneyCfg[o].ShowMoneyMin <= 0 || this.ShowMoneyCfg[o].ShowMoneyMax <= 0) {
          Message.error('底注' + this.ShowMoneyCfg[o].TableMoney + '错误,金额不能小于0')
          return false
        }
      }
      return true
    },
    checkNameCfg() {
      let hasUseCasino = false
      for (const o in this.NameCfg) {
        if (this.NameCfg[o].IsUseCasio) {
          hasUseCasino = true
        }
      }
      if (!hasUseCasino) {
        Message.error('必须存在一个默认使用casino机器人昵称的配置')
        return false
      }
      return true
    },
    checkRobotExitCfg() {
      if (this.RobotExitCfg.PlayTimeMin >= this.RobotExitCfg.PlayTimeMax) {
        Message.error('离桌玩牌次数槛错误,最小次数不能大于最大次数')
        return false
      }
      return true
    },
    setData() {
      if (!this.checkShowMoneyCfg()) {
        return
      }
      if (!this.checkRobotExitCfg()) {
        return
      }
      if (!this.checkNameCfg()) {
        return
      }
      this.moneyProc(true)
      this.item.Control = this.control
      this.item.NameCfg = this.NameCfg
      this.item.RobotExitCfg = this.RobotExitCfg
      this.item.ShowMoneyCfg = []
      for (const o in this.ShowMoneyCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ShowMoneyCfg[o].TableMoney) * 1000
        obj.ShowMoneyMin = parseInt(this.ShowMoneyCfg[o].ShowMoneyMin) * 1000
        obj.ShowMoneyMax = parseInt(this.ShowMoneyCfg[o].ShowMoneyMax) * 1000
        this.item.ShowMoneyCfg.push(obj)
      }

      this.item.RobotTableMoneyExitCfg = []
      for (const o in this.RobotTableMoneyExitCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.RobotTableMoneyExitCfg[o].TableMoney) * 1000
        obj.PlayTimeMin = parseInt(this.RobotTableMoneyExitCfg[o].PlayTimeMin)
        obj.PlayTimeMax = parseInt(this.RobotTableMoneyExitCfg[o].PlayTimeMax)
        this.item.RobotTableMoneyExitCfg.push(obj)
      }
      this.form.Data = JSON.stringify(this.item)
      console.log('this.form.Data:', this.form.Data)
      this.moneyProc(false)
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
            console.log('update response', response)
            Message.success('保存成功')
          }
        })
      })
    },
    delRow(parent, mine, row) {
      console.log('parent:' + parent + 'mine:' + mine, row)
      this.actionList[parent].List.splice(mine, 1)
    },
    delControlRow(mine, row) {
      console.log('mine:' + mine, row)
      this.control.splice(mine, 1)
    },
    addTableHeaderButton(h, data, tableMoney) {
      console.log('h:', h)
      console.log('data:', data)
      console.log('tableMoney:', tableMoney)
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAdd(tableMoney)}>添加范围</el-button>
        </div>
      )
    },
    addControlButton() {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddControl()}>添加范围</el-button>
        </div>
      )
    },

    doAdd(tableMoney) {
      console.log('tableMoney===>', tableMoney)
      for (let i = 0; i < this.actionList.length; i++) {
        if (this.actionList[i].TableMoney === tableMoney) {
          this.actionList[i].List.push(
            {
              StartPool: 0,
              EndPool: 0,
              AiConfigLevel: 1
            }
          )
        }
      }
    },
    doAddControl() {
      console.log('control')
      const Id = this.control.length + 1
      this.control.push(
        {
          PerStartPool: 0,
          PerEndPool: 0,
          AiConfigLevel: 1,
          ControlId: Id
        }
      )
    },
    showRobotPoolForm(tableMoney) {
      this.robotForm.currentVal = this.getRobotProfitByTableMoney(tableMoney, false)
      this.robotForm.tableMoney = tableMoney
      this.editRobotSync = true
    },
    showRobotEndVal() {
      return this.robotForm.currentVal + this.robotForm.changeVal
    },
    setRobotPool() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/tongitsrobotpool/update',
          TableMoney: $this.robotForm.tableMoney,
          Gid: this.gameId,
          ChangeVal: $this.robotForm.changeVal
        }
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < $this.actionList.length; i++) {
            if ($this.actionList[i].TableMoney == $this.robotForm.tableMoney) {
              $this.actionList[i].Pool = $this.robotForm.currentVal + $this.robotForm.changeVal
            }
          }
          Message.success('修改成功')
          this.editRobotSync = false
          window.location.reload()
        } else {
          Message.error(response.Data)
        }
      })
    },
    addNameCfg() {
      this.NameCfg.push(newNameCfgItem('', 0))
    },
    addShowMoneyCfg() {
      this.ShowMoneyCfg.push(newShowMoneyCfg())
    },
    addRobotTableMoneyExitCfg() {
      this.RobotTableMoneyExitCfg.push(newRobotTableMoneyExitCfg())
    },
    delNameCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.NameCfg, idx)
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
    delRobotTableMoneyExitCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.RobotTableMoneyExitCfg, idx)
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handleUseCasino(change, row) {
      // console.log(ttt)
      if (change) {
        row.Channels = ['BP', 'GP', 'CP', 'AP', 'DEV']
      }
    }
  }
}
</script>
