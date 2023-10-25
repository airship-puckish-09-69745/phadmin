<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="预进桌数量配置&玩牌基础配置">
          <el-row>
            <el-col :span="8">
              <h5>预进桌机器人数量配置</h5>
              <el-table
                :data="item.PresetCfg"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="机器人数"
                  prop="Number"
                  width="100"
                />
                <el-table-column
                  label="概率(%)"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="14" :offset="1">
              <h5>机器人携带金币配置 <el-button type="text" @click="addCarryingCfg">添加一项</el-button></h5>
              <el-table :data="item.CarryingCfg" border style="width: 100%">
                <el-table-column label="最小携带底注位数" prop="AntesMultipleMin" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AntesMultipleMin" size="mini"><template slot="append">倍</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最大携带底注位数" prop="AntesMultipleMax" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AntesMultipleMax" size="mini"><template slot="append">倍</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="概率(%)" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delCarryingCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <h5>其它配置</h5>
              <el-form ref="item" label-width="220px">
                <el-form-item label="机器人开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.EnableRobot" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="最少玩牌局数">
                  <el-input v-model.number="item.PlayTimesMin" size="mini" />
                </el-form-item>
                <el-form-item label="最多玩牌局数">
                  <el-input v-model.number="item.PlayTimesMax" size="mini" />
                </el-form-item>
                <el-form-item label="延长玩牌最少局数">
                  <el-input v-model.number="item.IncrPlayTimesMin" size="mini" />
                </el-form-item>
                <el-form-item label="延长玩牌最多局数">
                  <el-input v-model.number="item.IncrPlayTimesMax" size="mini" />
                </el-form-item>
                <el-form-item label="延长玩牌最少HitPot点数">
                  <el-input v-model.number="item.IncrPlayMoneyMultiMin" size="mini"><template slot="append">点</template></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="牌局结束补机器人配置">
          <el-table
            :data="item.AppendCfg"
            border
            style="width: 100%"
          >
            <el-table-column
              label="当前桌总人数"
              prop="UserNumber"
              width="200"
            />
            <el-table-column
              label="补机器人概率(%)"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="最少补充机器人数量"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.AppendRobotMin" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              label="最多补充机器人数量"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.AppendRobotMax" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              label="最小进入延迟"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.EnterDelayMin" size="mini"><template slot="append">秒</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="最大进入延迟(秒)"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.EnterDelayMax" size="mini"><template slot="append">秒</template></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="机器人下注与要牌配置">
          <fieldset>
            <legend>下注次数配置 <el-button type="text" @click="addBetTimesCfg">添加新项</el-button></legend>
            <el-table
              :data="item.BetTimesCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="最小次数"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.BetTimesMin" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="最大次数"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.BetTimesMax" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="delBetTimesCfg(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <hr>
          <fieldset>
            <legend>下注金额配置</legend>
            <el-table
              :data="item.BetOptionCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="下注金额选项"
                width="150"
              >
                <template slot-scope="scope">
                  {{ getBetOptionCfgName(scope.row.BetOption) }}
                </template>
              </el-table-column>
              <el-table-column
                label="概率(千分)"
                width="300"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <hr>
          <fieldset>
            <legend>要牌概率配置</legend>
            <el-table
              :data="item.TakeCardCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="手牌点数"
                prop="Points"
                width="200"
              />
              <el-table-column
                label="要牌概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-tab-pane>
        <el-tab-pane label="机器人庄家保护配置">
          <el-form label-width="500px" style="width:800px;">
            <el-form-item label="庄家保护线(未看牌玩家下注金额/所有玩家下注金额*100)">
              <el-input v-model.number="item.DealerWarnLine" size="mini" />
            </el-form-item>
            <el-form-item label="庄家保护最小点数">
              <el-input v-model.number="item.DealerWarnPointsMin" size="mini" />
            </el-form-item>
            <el-form-item label="庄家保护最大点数">
              <el-input v-model.number="item.DealerWarnPointsMax" size="mini" />
            </el-form-item>
            <el-form-item label="庄家赢牌概率（%）">
              <el-input v-model.number="item.DealerWarnProbability" size="mini"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Pot机器人保护">
          <el-row style="margin-bottom:20px;"><el-button type="primary" @click="addHitPotProtectCfg">添加一项</el-button></el-row>
          <el-table
            :data="item.HitPotProtectCfg"
            border
            style="width: 100%"
          >
            <el-table-column
              label="Pot机器人HitPot占比"
              width="250"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PotRobotRatioMin" size="mini"><template slot="prepend">&gt;=</template><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="Pot机器人HitPot占比"
              width="250"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PotRobotRatioMax" size="mini"><template slot="prepend">&lt;</template><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="赢的概率"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PotRobotWinProbability" size="mini"><template slot="append">%</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delHitPotProtectCfg(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <hr>

          <el-form :inline="true" label-width="350px">
            <el-form-item label="Pot机器人作庄家时最大输的比例(输赢/携带*100)">
              <el-input v-model.number="item.PotRobotDealerLoseRatioMax" size="mini"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="机器人缓冲池配置">
          <fieldset>
            <legend>机器人缓冲池初始大小
              <!--              <el-button type="text" @click="addSafePoolMoneyCfg">添加一项</el-button>-->
            </legend>
            <el-col :span="12">
              <el-table
                :data="item.SafePoolMoneyCfg"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="底注"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.TableMoney" size="mini" :disabled="true" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="缓冲池初始值"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.SafePool" size="mini" />
                  </template>
                </el-table-column>
                <!--                <el-table-column
                  label="操作"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="delSafePoolMoneyCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>-->
              </el-table>
            </el-col>
            <!-- 奖池 -->
            <el-col :span="12">
              <el-table
                :data="robotProfit"
                border
                style="width: 90%"
              >
                <el-table-column
                  label="底注"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ scope.row.TableMoney/1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="缓冲池值"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Pool/1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="showRobotProfitDialog(scope.row.TableMoney,scope.row.Pool)">修改</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </fieldset>
          <hr>
          <fieldset>
            <legend>缓冲池安全配置 <el-button type="text" @click="addSafePoolProtectCfg">添加一项</el-button></legend>
            <el-table
              :data="item.SafePoolProtectCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="缓冲池余量比例(%)"
                width="300"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RatioMin" size="mini"><template slot="prepend">&gt;=</template><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="缓冲池余量比例(%)"
                width="300"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RatioMax" size="mini"><template slot="prepend">&lt;</template><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="机器人赢牌概率（%）"
                width="300"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RobotWinProbability" size="mini"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delSafePoolProtectCfg(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-tab-pane>
      </el-tabs>

      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
    <div>
      <el-dialog
        title="修改缓冲池"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form width="70%" label-position="top">
          <el-form-item label="奖池值">
            <el-input v-model.number="robotProfitItem.Pool" placeholder="请输入" />
          </el-form-item>

          <el-form-item>
            <el-row>
              <el-col :span="12" :offset="10">
                <el-button type="primary" size="medium" @click="changeRobotProfit">保存</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </el-col>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'
import SmallGameLevel from '@/components/SmallGameLevel'

function newSafePoolProtectCfg(x, y, z) {
  return {
    RatioMin: x,
    RatioMax: y,
    RobotWinProbability: z
  }
}

function newCarryingCfg(x, y, z) {
  return {
    AntesMultipleMin: x,
    AntesMultipleMax: y,
    Probability: z
  }
}

function SafePoolMoneyCfg(x, y) {
  return {
    TableMoney: x,
    SafePool: y
  }
}

function newHitPotProtectCfg(x, y, z) {
  return {
    PotRobotRatioMin: x,
    PotRobotRatioMax: y,
    PotRobotWinProbability: z
  }
}
function newTakeCardCfg(x, y) {
  return {
    Points: x,
    Probability: y
  }
}
function newPresetCfg(n) {
  return {
    Number: n,
    Probability: 0
  }
}
function newBetOptionCfg(x, y) {
  return {
    BetOption: x,
    Probability: y
  }
}
function newAppendCfg(n) {
  return {
    UserNumber: n,
    Probability: 0,
    AppendRobotMin: 0,
    AppendRobotMax: 0,
    EnterDelayMin: 0,
    EnterDelayMax: 0
  }
}
function newBetTimesCfg(x, y, z) {
  return {
    BetTimesMin: x,
    BetTimesMax: y,
    Probability: z
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput, SmallGameLevel },
  data() {
    return {
      subKey: 'lucky9RobotSetting',

      item: {
        'PresetCfg': [newPresetCfg(1), newPresetCfg(2), newPresetCfg(3), newPresetCfg(4), newPresetCfg(5), newPresetCfg(6), newPresetCfg(7)],
        'AppendCfg': [newAppendCfg(1), newAppendCfg(2), newAppendCfg(3), newAppendCfg(4), newAppendCfg(5), newAppendCfg(6), newAppendCfg(7)],
        'PlayTimesMin': 0,
        'PlayTimesMax': 0,
        'IncrPlayMoneyMultiMin': 0,
        'IncrPlayTimesMin': 0,
        'IncrPlayTimesMax': 0,
        'CarryingMultiMin': 0,
        'CarryingMultiMax': 0,
        'EnableRobot': 0,
        'BetTimesCfg': [newBetTimesCfg(1, 3, 40), newBetTimesCfg(4, 5, 30), newBetTimesCfg(6, 6, 30)],
        'BetOptionCfg': [newBetOptionCfg(1, 25), newBetOptionCfg(2, 700), newBetOptionCfg(3, 250), newBetOptionCfg(4, 25)],
        'TakeCardCfg': [newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 100), newTakeCardCfg(5, 80), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)],
        'DealerWarnLine': 0,
        'DealerWarnPointsMin': 0,
        'DealerWarnPointsMax': 0,
        'DealerWarnProbability': 0,
        'HitPotProtectCfg': [newHitPotProtectCfg(0, 125, 5), newHitPotProtectCfg(126, 250, 7), newHitPotProtectCfg(251, 375, 9),
          newHitPotProtectCfg(376, 500, 11), newHitPotProtectCfg(501, 625, 13), newHitPotProtectCfg(626, 750, 15), newHitPotProtectCfg(751, 875, 17), newHitPotProtectCfg(876, 100, 19)],
        'SafePoolMoneyCfg': [SafePoolMoneyCfg(1, 1000), SafePoolMoneyCfg(5, 1000), SafePoolMoneyCfg(20, 20000), SafePoolMoneyCfg(50, 50000), SafePoolMoneyCfg(100, 5000)],
        'SafePoolProtectCfg': [newSafePoolProtectCfg(0, 50, 10), newSafePoolProtectCfg(51, 100, 20)],
        'CarryingCfg': [newCarryingCfg(0, 0, 0), newCarryingCfg(0, 0, 0)]
      },
      tableList: [],
      tableMoneyArr: [],
      isTableMoneysChanged: false,
      robotProfit: [],
      dialogVisible: false,
      robotProfitItem: {
        TableMoney: 0,
        Pool: 0
      },
      tableMoneyList: ''
    }
  },
  created() {
    this.getTableList()
    // this.getData()
    console.log(1)
  },
  methods: {
    addBetTimesCfg() {
      this.item.BetTimesCfg.push(newBetTimesCfg(0, 0, 0))
    },
    delBetTimesCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.BetTimesCfg, idx)
      })
    },
    addCarryingCfg() {
      this.item.CarryingCfg.push(newCarryingCfg(0, 0, 0))
    },
    delCarryingCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.CarryingCfg, idx)
      })
    },
    addHitPotProtectCfg() {
      this.item.HitPotProtectCfg.push(newHitPotProtectCfg(0, 0, 0))
    },
    delHitPotProtectCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.HitPotProtectCfg, idx)
      })
    },
    addSafePoolMoneyCfg() {
      this.item.SafePoolMoneyCfg.push(SafePoolMoneyCfg(0, 0))
    },
    delSafePoolMoneyCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.SafePoolMoneyCfg, idx)
      })
    },
    addSafePoolProtectCfg() {
      this.item.SafePoolProtectCfg.push(newSafePoolProtectCfg(0, 0, 0))
    },
    delSafePoolProtectCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.SafePoolProtectCfg, idx)
      })
    },
    getBetOptionCfgName(option) {
      const names = ['', 'x1', 'x5', 'Max', 'Repeat']
      return names[option]
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getTableList() {
      request({
        url: '/lucky9table/all',
        method: 'get',
        data: { tableMoneyDesc: '1' }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('objs: ', objs)
          for (let i = 0; i < response.Data.length; i++) {
            if (this.tableMoneyArr.includes(response.Data[i].TableMoney)) {
              continue
            }
            this.tableMoneyArr.push(response.Data[i].TableMoney)
            this.tableList.push({
              TableMoney: response.Data[i].TableMoney
            })
          }
          this.getData()
        }
      })
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            const old = JSON.parse(JSON.stringify(data))
            console.log('old: ', old)
            const safePoolMoneysCfg = []
            const oldTableMoneys = []
            for (let j = 0; j < data.SafePoolMoneyCfg.length; j++) {
              oldTableMoneys.push(data.SafePoolMoneyCfg[j].TableMoney)
              if (!this.tableMoneyArr.includes(data.SafePoolMoneyCfg[j].TableMoney)) {
                this.isTableMoneysChanged = true
              }
            }
            for (let i = 0; i < this.tableList.length; i++) {
              if (!oldTableMoneys.includes(this.tableList[i].TableMoney)) {
                this.isTableMoneysChanged = true
              }
              if (i === 0) {
                $this.tableMoneyList += this.tableList[i].TableMoney
              } else {
                $this.tableMoneyList += ',' + this.tableList[i].TableMoney
              }
              const safePoolMoneyCfg = { TableMoney: this.tableList[i].TableMoney / 1000, SafePool: 0 }
              for (let j = 0; j < data.SafePoolMoneyCfg.length; j++) {
                if (data.SafePoolMoneyCfg[j].TableMoney === this.tableList[i].TableMoney) {
                  safePoolMoneyCfg.SafePool = data.SafePoolMoneyCfg[j].SafePool / 1000
                  break
                }
              }
              safePoolMoneysCfg.push(safePoolMoneyCfg)
            }
            data.SafePoolMoneyCfg = safePoolMoneysCfg
            console.log('data: ', data)
            console.log('isTableMoneysChanged: ', this.isTableMoneysChanged)
            $this.item = this.DeepCopy(data)

            if (this.isTableMoneysChanged) {
              this.$alert('场次配置的底注有变更，请同步修改【机器人缓冲池配置】，保存并发布')
            }

            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
            $this.getRobotProfit()
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      cpy.SafePoolMoneyCfg = []
      for (const o in this.item.SafePoolMoneyCfg) {
        const obj = {}
        Object.assign(obj, this.item.SafePoolMoneyCfg[o])
        obj.TableMoney *= 1000
        obj.SafePool *= 1000
        cpy.SafePoolMoneyCfg.push(obj)
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
    getRobotProfit() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/lucky9robotpool/list',
          table_money: $this.tableMoneyList
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('/lucky9robotpool/list===>', objs)
          for (const key in objs) {
            $this.robotProfit.push({
              TableMoney: key,
              Pool: objs[key]
            })
          }
        }
      })
    },
    showRobotProfitDialog(tableMoney, pool) {
      this.robotProfitItem.TableMoney = tableMoney
      this.robotProfitItem.Pool = pool / 1000
      this.dialogVisible = true
    },
    changeRobotProfit() {
      const $this = this
      this.$confirm('确认修改此值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/lucky9robotpool/update/pool',
            table_money: this.robotProfitItem.TableMoney,
            pool: this.robotProfitItem.Pool * 1000
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const newPool = response.Data || 0
            console.log('/lucky9robotpool/updatepool===>', newPool)
            for (let i = 0; i < $this.robotProfit.length; i++) {
              if ($this.robotProfit[i].TableMoney === $this.robotProfitItem.TableMoney) {
                $this.robotProfit[i].Pool = newPool
              }
            }
            $this.dialogVisible = false
          }
        })
      })
    }
  }
}
</script>
