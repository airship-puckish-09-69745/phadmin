<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
   
      <el-tabs type="border-card">

        <el-tab-pane label="机器人等级">
         

          <el-row style="padding-top: 5px">
              <fieldset>
                <legend>机器人类型手牌点数权重</legend>
                <el-table
                  :data="item.AiLevelCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="机器人类型"
                    prop="AiLevel"
                    width="200"
                    :formatter="(row) => getRobotName(row.AiLevel)"
                  />
                  <el-table-column
                    label="闲家输时帮赢概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.PlayerLosePro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="闲家输时帮赢概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BankerLosePro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="闲家赢时帮输概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.PlayerWinPro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="庄家赢时帮输概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BankerWinPro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-row>

          
        </el-tab-pane>

        <el-tab-pane label="机器人入桌">
          <el-row style="padding-top: 5px">
    
              <fieldset>
                <legend>场次单桌最大机器人数</legend>
                <el-alert
                  title="警告：每个场次单独配置，配置范围0～7，最大机器人数=0时，以下功能全部关闭"
                  type="error"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 20px;"
                />
                <el-table
                  :data="item.RobotCntCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="机器人数量"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number  v-model.number="scope.row.RobotCnt" size="mini"  type="number" :min="0" :max="7"  :precision="0"></el-input-number >
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
              <fieldset>
                <legend>场次人数=0时开桌配置</legend>
                <el-table
                  :data="item.ZeroJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="入场间隔时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="入场间隔时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="等人时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.WaitMinTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="等人时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.WaitMaxTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
              <fieldset>
                <legend>场次有桌不满最小开局人数时入桌</legend>
                <el-table
                  :data="item.WaitPlayJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="协助开局时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="协助开局时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>

              <fieldset>
                <legend>场次有正在玩的桌子入桌</legend>
                <el-table
                  :data="item.PlayingJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="机器人入桌间隔最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="机器人入桌间隔最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="场次最大机器人比"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.MaxRobotRate" size="mini"  type="number" :min="0" ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="机器人可加入桌子总人数上限"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.MaxPlayerCnt" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-row>
        </el-tab-pane>

          <el-tab-pane label="机器人下注">
            <el-row style="padding-top: 5px">
              <fieldset>
                <legend>下注次数配置 </legend>
                <el-table
                  :data="item.BetTimesCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="下注次数"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.BetTimes }}</span>
                     
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="权重"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BetWeight" size="mini"  type="number" :min="0"  :precision="0"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="随机到此次数后的bet随机限制"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <div style="display: flex; align-items: center;">
                      <span style="margin-right: 10px;">是否可随机到max</span>
                      <el-switch v-model.number="scope.row.BetCanMax" :active-value="true" :inactive-value="false" />
                    </div>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
             </el-row>
              <el-row style="padding-top: 5px">
              <fieldset>
                <legend>习惯Bet配置 </legend>
                <el-table :data="item.BetHabitsCfg" border style="width: 100%">
                  <el-table-column label="bet方案" width="120">
                    <template slot-scope="scope">
                      <span v-if="!scope.row.BetIsMax">{{ scope.row.BetBase }} bet</span>
                      <span v-else>直接max</span> <!-- 或者直接留空 "" -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="权重"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BetWeight" size="mini"  type="number" :min="0"  :precision="0"/>
                    </template>
                  </el-table-column>
                </el-table>
                </fieldset>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="机器人要牌">
            <el-row style="padding-top: 5px">
              <fieldset>
                <legend>要牌概率（%）配置</legend>
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
                    label="要牌概率（%）(%)"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.Probability" size="mini"  type="number" :min="0"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-row>
        </el-tab-pane>

        <el-tab-pane label="机器人名字">
          <el-row>
            <el-col :span="20" :offset="1">
              <h5>机器人昵称配置 <el-button type="text" @click="addNickCfg">添加一项</el-button></h5>
              <el-table :data="item.nickCfg" border>
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
        </el-tab-pane>
        <el-tab-pane label="展示资产配置">
          <el-row>
            <el-col :span="20" :offset="1">
              <el-button type="text" @click="addShowMoneyCfg">添加一项</el-button>
              <el-table :data="item.showMoneyCfg" border>
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

        <el-tab-pane label="随机离桌配置" name="randomLeaveConfig">
          <el-form ref="item" :model="item" width="70%">
          <!-- 离桌对局数配置 - 单行展示 -->
          <el-form-item label="机器人随机离桌局数范围：" :required="true">
            <el-row :gutter="16">
              <el-col :span="8">
                <template>
                  <el-input-number
                    v-model="item.leaveCfg.beginPlayCnt" 
                    :min="1"
                    :precision="0"
                    placeholder="开始局数"
                    style="width: 100%"> 
      
                  </el-input-number>
                </template>
              </el-col>
              <el-col :span="2" class="text-center">
                <span class="divider">至</span>
              </el-col>
              <el-col :span="8">
                <template>
                  <el-input-number 
                    v-model="item.leaveCfg.endPlayCnt"
                    :min="1"
                    :precision="0"
                    placeholder="结束局数"
                    style="width: 100%">
                  </el-input-number>
                </template>
              </el-col>
            </el-row>
          </el-form-item>
            
          <el-form-item label="离桌判定失败在触发判断局数范围：" :required="true">
            <el-row :gutter="16">
              <el-col :span="8">
                <template>
                  <el-input-number
                    v-model="item.leaveCfg.beginLosePlayCnt" 
                    :min="1"
                    :precision="0"
                    placeholder="开始局数"
                    style="width: 100%"> 
                  </el-input-number>
                </template>
              </el-col>
              <el-col :span="2" class="text-center">
                <span class="divider">至</span>
              </el-col>
              <el-col :span="8">
                <template>
                  <el-input-number 
                    v-model="item.leaveCfg.endLosePlayCnt"
                    :min="1"
                    :precision="0"
                    placeholder="结束局数"
                    style="width: 100%">
                  </el-input-number>
                </template>
              </el-col>
            </el-row>
          </el-form-item> 
 
          </el-form>
        </el-tab-pane>
    </el-tabs>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>
    <compare ref="compare" />
  </div>
</template>

<style scoped>
</style>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'


function newBetTimesCfg(x, y, z) {
  return {
    BetTimes: x,
    BetWeight: y,
    BetCanMax: z
  }
}

function BetHabitsCfg(x, y, z) {
  return {
    BetBase: x,
    BetWeight: y,
    BetIsMax: z
  }
}
function newTakeCardCfg(x, y) {
  return {
    Points: x,
    Probability: y
  }
}

function newAiLevelCfg(x, y,z,k,v) {
  return {
    AiLevel:x,
    PlayerLosePro: y,
    BankerLosePro: z,
    PlayerWinPro: k,
    BankerWinPro: v,
    
  }
}

function newZeroJoinCfg(x, y,z,k,v) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
    WaitMinTime: k,
    WaitMaxTime: v,
    
  }
}


function newWaitPlayJoinCfg(x, y,z) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
  }
}

function newPlayingJoinCfg(x, y,z,k, v) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
    MaxRobotRate: k,
    MaxPlayerCnt: v,
  }
}

function newRobotCntCfg(x, y) {
  return {
    TableMoney:x,
    RobotCnt:y,
    
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

function newLeaveCfg() {
  return {
    beginPlayCnt: 5,
    endPlayCnt: 5,
    beginLosePlayCnt: 1,
    endLosePlayCnt: 5
  }
}


export default {
  components: {
    Publish,
    Compare,
  },
  data() {
    return {
   
      item:{
        "betTimesCfg": [newBetTimesCfg(1, 50, true), newBetTimesCfg(2, 20, false), newBetTimesCfg(3, 20, false),newBetTimesCfg(4, 10, false)],
        "betHabitsCfg": [BetHabitsCfg(0, 20, true), BetHabitsCfg(1, 10, false), BetHabitsCfg(5, 30, false)],
        'takeCardCfg': [newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 95), newTakeCardCfg(5, 50), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)],
        'aiLevelCfg':[newAiLevelCfg(5,20, 50, 0, 0),newAiLevelCfg(4,10, 10, 0, 0),newAiLevelCfg(3,0, 0, 0, 0),newAiLevelCfg(2,0, 0, 10, 10),newAiLevelCfg(1,0, 0, 20, 50)],
        'zeroJoinCfg':[newZeroJoinCfg(20000, 10, 20, 5, 20),newZeroJoinCfg(50000, 20, 40, 5, 20),newZeroJoinCfg(100000, 40, 60, 5, 20),newZeroJoinCfg(200000, 60, 120, 20, 30)],
        'robotCntCfg':[newRobotCntCfg(20000, 1),newRobotCntCfg(50000, 2),newRobotCntCfg(100000, 4),newRobotCntCfg(200000, 6)],
        'waitPlayJoinCfg':[newWaitPlayJoinCfg(20000,8,12),newWaitPlayJoinCfg(50000,8,12),newWaitPlayJoinCfg(100000,10,15),newWaitPlayJoinCfg(200000,15,20)],
        'playingJoinCfg':[newPlayingJoinCfg(20000,5,10,1,4),newPlayingJoinCfg(50000,10,20,1,4),newPlayingJoinCfg(100000,20,30,1,4),newPlayingJoinCfg(200000,30,40,1,4)],
        'nickCfg':[newNick("BingoPlus", 20),newNick("ArenaPlus", 10),newNick("GZone", 70)],
        'showMoneyCfg':[],
        'leaveCfg':{'beginPlayCnt': 5, 'endPlayCnt':19, 'beginLosePlayCnt': 3, 'endLosePlayCnt': 5 }
      },
      gameId: 23,
      edit: {},
      tableMoneys: [],
      form: {},
      robotlvl: [
        {
          value: 1,
          label: 'A机器人(强放)'
        },
        {
          value: 2,
          label: 'B机器人(弱放)'
        },
        {
          value: 3,
          label: 'C机器人(陪玩)'
        },
        {
          value: 4,
          label: 'D机器人(弱杀)'
        },
        {
          value: 5,
          label: 'E机器人(强杀)'
        }
      ],
    
      subKey: 'lucky9_robot_cfg',
      AllTableMoneyList: [],
    }
  },
  created() {
    this.getData()
    this.getList();
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    setData() {
      if (this.item.leaveCfg.endPlayCnt < this.item.leaveCfg.beginPlayCnt) {
        Message.error('机器人随机离桌对局数，区间配置错误')
        return 
      }
      if (this.item.leaveCfg.endLosePlayCnt < this.item.leaveCfg.beginLosePlayCnt) {
        Message.error('离桌判定失败在触发判断局数，区间配置错误')
        return 
      }


      this.form.Data = JSON.stringify(this.item)
      const $this = this

       console.log("this.form.Data",  this.form.Data)
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
            Message.success('保存成功')
          }
        })
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            
            //console.log('data: ', data)

            this.item = this.DeepCopy(data)
            this.item.nickCfg = this.item.nickCfg || []
            this.item.showMoneyCfg = this.item.showMoneyCfg || []


            console.log(" this.item.leaveCfg", this.item.leaveCfg)
             // 设置修改之前数据
             $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },

    getList() {
      request({
        url: '/lucky9table/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // 对比下AI配置，看底注是否都有
          for (const k in response.Data) {
            this.tableMoneys.push(response.Data[k].TableMoney)
          }
          this.tableMoneys = Array.from(new Set(this.tableMoneys))
          this.tableMoneys.sort((x, y) => x - y)
          console.log('tableMoneys: ', this.tableMoneys)
      
          for (let i = 0; i < this.tableMoneys.length; i++) {
            this.AllTableMoneyList.push(this.tableMoneys[i])
            let isFind = false 
            for (let j = 0; j < this.item.ZeroJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.ZeroJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.ZeroJoinCfg.push(newZeroJoinCfg(this.tableMoneys[i], 0, 0, 0, 0))
            }
            isFind = false 
            for (let j = 0; j < this.item.RobotCntCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.RobotCntCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.RobotCntCfg.push(newRobotCntCfg(this.tableMoneys[i], 0))
            }

            isFind = false 
            for (let j = 0; j < this.item.WaitPlayJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.WaitPlayJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.WaitPlayJoinCfg.push(newWaitPlayJoinCfg(this.tableMoneys[i], 0, 0))
            }

            isFind = false 
            for (let j = 0; j < this.item.PlayingJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.PlayingJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.PlayingJoinCfg.push(newPlayingJoinCfg(this.tableMoneys[i], 0, 0,0,0))
            }

          }
          this.item.ZeroJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.RobotCntCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.WaitPlayJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.PlayingJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.AllTableMoneyList.sort((a, b) => {
            return a - b
          })
          
        }
      })
    },



    dataRule(required, config) {
      return DataRule(required, config)
    },

    getRobotName(aiLevel) {
      let name = ""
      for (let i = 0; i < this.robotlvl.length; i++) {
        if (aiLevel === this.robotlvl[i].value) {
          name =  this.robotlvl[i].label
          break
        }
      }
      return name
    },

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
    addNickCfg() {
      this.item.nickCfg.push(newNick('', 0))
    },
    addShowMoneyCfg() {
      this.item.showMoneyCfg.push(newShowMoneyCfg())
    },
    delShowMoneyCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.showMoneyCfg, idx)
      })
    },
    // handleDecimalInput(row, key) {
    //   // 1. 过滤非法字符（只保留数字和小数点）
    //   let value = row[key] ? row[key].toString() : '0'
    //   value = value.replace(/[^\d.]/g, '').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').replace(/(\..*)\./g, '$1')
    //   // 2. 禁止以小数点开头（如 ".5" → "0.5"）
    //   if (value.startsWith('.')) {
    //     value = '0' + value
    //   }

    //   // 3. 确保最多一个小数点
    //   const parts = value.split('.')
    //   if (parts.length > 2) {
    //     value = parts[0] + '.' + parts.slice(1).join('')
    //   }

    //   // 4. 限制小数点后最多两位（百分比通常只需两位小数）
    //   if (parts.length === 2 && parts[1].length > 2) {
    //     value = parts[0] + '.' + parts[1].slice(0, 2)
    //   }
    //   const numValue = parseFloat(value) || 0
    //   if (numValue < 0) {
    //     value = '0'
    //   } else if (isNaN(numValue)) {
    //     value = '0' // 异常值重置为 0
    //   }
    //   // 5. 更新绑定的值（保留字符串类型，避免自动转换问题）
    //   row[key] = value === '' ? null : value
    // },
    
 
  },
  
}
</script>

