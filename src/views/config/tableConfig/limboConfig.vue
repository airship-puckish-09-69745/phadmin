<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="dialogFormVisible= true" size="mini" > 测试配置</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <span v-if="item.openTest=='2'">
         <el-alert
           title="测试模式已开启,记得关闭"
           type="error">
          </el-alert>
      </span>
      </el-col>
    </el-row>

    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-tabs type="border-card">

          <el-tab-pane label="基础配置">
            <el-col :span="16" :offset="3">

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="保底奖池抽水">
                      <el-input v-model.number="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
              
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="目标RTP:">
                      <el-input v-model="item.RTP" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最大下注金额:">
                      <el-input v-model.number="item.MaxBet" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="火箭发射倍率范围：>">
                      <el-input v-model.number="item.RewardMulMin" size="mini" ><template  slot="append">X</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="<=">
                      <el-input v-model.number="item.RewardMulMax" size="mini" ><template  slot="append">X</template></el-input>
                    </el-form-item>
                  </el-col>
                  
                </el-form>
              </el-col>
              
              <!--bet-->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddBetMoneyLevel()">添加</el-button>
                </el-col>                
                <legend>下注配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.BetMoneyLevel"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />

                  <el-table-column prop="TableMoney" label="下注列表" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.TableMoney" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>

              <!--Bonus配置-->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddBonusCfg()">添加</el-button>
                </el-col>
                <legend>Bonus配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.BonusCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="ID" width="90px">
                    <template slot-scope="scope">
                      {{scope.row.Id}}
                    </template>
                  </el-table-column>

                  <el-table-column label="火箭赔率点" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BonusCfg[scope.$index].Reward" size="mini" ><template  slot="append">X</template></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="Bunus倍数">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BonusCfg[scope.$index].Mul" size="mini" />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delBonus(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>
              
              <!--火箭飞行延迟配置-->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddFlyDelay()">添加</el-button>
                </el-col>
                
                <legend>火箭飞行延迟配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.FlyDelay"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="ID" width="90px">
                    <template slot-scope="scope">
                      {{scope.row.Id}}
                    </template>
                  </el-table-column>
                  <el-table-column label="区间" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.FlyDelay[scope.$index].Area" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="延迟">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.FlyDelay[scope.$index].Delay" size="mini" ><template  slot="append">second</template></el-input>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delFlyDelay(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>

              <!--机器人配置-->
              <fieldset style="margin-top:10px" v-if="!IsPHAuditEnv()">
                <legend>机器人配置</legend>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="机器人携带Bet下限:">
                        <el-input v-model.number="item.RobotCarryMin" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="机器人携带Bet上限:">
                        <el-input v-model.number="item.RobotCarryMax" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>                    
                  </el-form>
                </el-col>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="机器人最小人数:">
                        <el-input v-model.number="item.RobotCountMin" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="机器人最大人数:">
                        <el-input v-model.number="item.RobotCountMax" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>                    
                  </el-form>
                </el-col>
                <!--
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="在线人数:">
                        <el-input v-model.number="item.OnlinePlayers" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-col>
              -->
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddRobotCfg()">添加</el-button>
                </el-col>
                
                <el-table
                  ref="filterTable"
                  :data="item.RobotCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="中奖类型" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="item.RobotCfg[scope.$index].RewardType" size="mini" ><template  slot="append">X</template></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="中奖概率">
                    <!--
                    <el-table-column :label="'在线人数<='"> 
                    -->
                      <template slot-scope="scope">
                        <el-input v-model.number="item.RobotCfg[scope.$index].Rate[0]" size="mini" ><template  slot="append">%</template></el-input>
                      </template>
                      <!--
                    </el-table-column>
                  -->
                    <!--
                    <el-table-column :label="'>在线人数'">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.RobotCfg[scope.$index].Rate[1]" size="mini" ><template  slot="append">%</template></el-input>
                      </template>
                    </el-table-column>
                  -->
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRobotCfg(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>

              <!--机器人下注倍率-->
              <fieldset style="margin-top:10px" v-if="!IsPHAuditEnv()">
                <legend>机器人下注倍率</legend>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="随机范围:" style="display: flex; align-items: center">
                        <el-input v-model="item.RobotBetCfg.BetMultipleMin" size="mini" style="width: 100px"></el-input>
                        <span style="margin: 0 10px">~</span> <!-- 替换第二个 label -->
                        <el-input v-model="item.RobotBetCfg.BetMultipleMax" size="mini" style="width: 100px"></el-input>
                        <span>X</span> <!-- 统一处理单位 -->
                      </el-form-item>
                    </el-col>                    
                  </el-form>
                </el-col>

                <el-table
                  ref="filterTable"
                  :data="item.RobotBetCfg.Rule"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="保留整数位数规则" width="150px">
                    <template slot-scope="scope">
                      {{ getRobotBetInteger(scope.$index) }}
                    </template>
                  </el-table-column>

                  <el-table-column label="权重">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.RobotBetCfg.Rule[scope.$index].Integer" size="mini" ></el-input>
                      </template>
                  </el-table-column>
                  
                  <el-table-column label="保留小数位数规则" width="150px">
                    <template slot-scope="scope">
                      {{ getRobotBetDecimal(scope.$index) }}
                    </template>
                  </el-table-column>

                  <el-table-column label="权重">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.RobotBetCfg.Rule[scope.$index].Decimal" size="mini" ></el-input>
                      </template>
                  </el-table-column>

                </el-table>
              </fieldset>

              <!--重摇-->
              <fieldset  v-if="!IsPHAuditEnv()">
                <legend>小奖池触发重摇</legend>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="奖池低于某值此时系统输：">
                      <el-input v-model="item.ReChoiceCfg.LowLotteryPoolReChoice" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="重摇概率：">
                      <el-input v-model.number="item.ReChoiceCfg.LowLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">奖池低于某值此时系统输：当奖池低于X时，玩家赢钱有X%的概率重新摇</span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="奖池大于某值此时系统赢：">
                      <el-input v-model="item.ReChoiceCfg.HighLotteryPoolReChoice" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="重摇概率：">
                      <el-input v-model.number="item.ReChoiceCfg.HighLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">奖池大于某值此时系统赢：1.当奖池的钱>X.玩家输钱时有X%的概率重新摇 </span>
                  </el-descriptions-item>
                </el-descriptions>
              </fieldset>

            </el-col>
          </el-tab-pane>
        </el-tabs>
        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  
    <el-dialog title="测试配置" :visible.sync="dialogFormVisible"   width="550px">
      <el-form  >
        <el-form-item label="是否开启:">
          <el-radio v-model="item.openTest" label="1" :value="false">否</el-radio>
          <el-radio v-model="item.openTest" label="2" :value="true">是</el-radio>
        </el-form-item>
        <el-form-item label="火箭终点:">
          <el-form :inline="true">
            <el-col :span="8">
                <el-input v-model.number="item.Card" size="mini" />
            </el-col>
          </el-form>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  
    <!--对比组件-->
    <compare ref="compare" />
  </div>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import {$libShow, DataRule} from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import RobotOnlineItems from '@/views/config/components/robotOnlineItems.vue'
import JackpotDayLimit from '@/views/config/components/jackpotDayLimit.vue'
import JackpotIncrease from '@/views/config/components/jackpotIncrease.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { JackpotIncrease, JackpotDayLimit, RobotOnlineItems, Compare, Publish, BetAmount },
  data() {
    return {
      RandAwards: [],
      item: {
        BetMoneyLevel:[], //下注
        BonusCfg:[], //bonus配置
        FlyDelay:[], //飞行延迟配置
        RobotCfg:[], //机器人配置
        RobotBetCfg:{},
        ReChoiceCfg:{},
      },
      form: {},
      subKey: 'limbo_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      env:process.env.VUE_APP_PROJECT,
      dialogFormVisible: false,
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT)
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
      this.isHidden = false
    }
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
      let that = this
      for (const j in that.item.BetMoneyLevel) {
        const betMoneyList = []
        for (const o of that.item.BetMoneyLevel[j].TableMoney) {
          betMoneyList.push(o / 1000)
        }
        that.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')
      }
      for (const i in that.item.RobotCfg) {
        that.item.RobotCfg[i].RewardType /= 100
      }
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
            if (!item.FlyDelay) {
              item['FlyDelay'] = []
              item.FlyDelay.push({ Id: 0, Area: 1, Delay: 1 })
            }
            if (!item.BonusCfg) {
              item['BonusCfg'] = []
              item.BonusCfg.push({ Id: 0, Reward: 1, Mul: 1 })
            }
            if (!item.RobotCfg){
              item['RobotCfg'] = []
              item.RobotCfg.push({ Id: 0, RewardType: 1, Rate: [1, 1]})
            }

            if (!item.Card){
              item["Card"] = "0"
              item["openTest"] = "1"
            }
            if (!item.RobotBetCfg){
              item.RobotBetCfg = {
                BetMultipleMin:200,
                BetMultipleMax:20000,
                Rule:[{Integer: 60, Decimal: 60},{Integer: 30, Decimal: 30},{Integer: 10, Decimal: 10}]
              }
            }

            Object.assign(this.item, item)

            this.transMoneyForShow()

            item.MaxBet /= 1000
            item.CarryLower /= 1000
            item.RTP /= 100 //四位小数
            item.RobotCarryMin /= 1000
            item.RobotCarryMax /= 1000
            item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
            item.ReChoiceCfg.HighLotteryPoolReChoice /= 1000
            item.RobotBetCfg.BetMultipleMin /=  100
            item.RobotBetCfg.BetMultipleMax /=  100

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            this.item = item
            console.log('item=======>', item)
          }
        }
      })

    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))

      //下注配置
      for (const i in this.item.BetMoneyLevel) {
        let betItem = []
        if (this.item.BetMoneyLevel[i].TableMoney instanceof Array) {
          betItem = this.item.BetMoneyLevel[i].TableMoney
        } else {
          for (const oElement of this.item.BetMoneyLevel[i].TableMoney.split(',')) {
            betItem.push(oElement * 1000)
          }
        }
        ret.BetMoneyLevel[i].TableMoney = (betItem)
      }
      for (const i in this.item.BonusCfg) {
        
      }
      for (const i in this.item.RobotCfg) {
        ret.RobotCfg[i].RewardType *= 100
      }

      ret.MaxBet *= 1000
      ret.CarryLower *= 1000
      ret.RTP *= 100
      ret.RobotCarryMin *= 1000
      ret.RobotCarryMax *= 1000
      ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
      ret.RobotBetCfg.BetMultipleMin *= 100
      ret.RobotBetCfg.BetMultipleMax *= 100

      //测试
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Card']
      }

      console.log("上传====>",ret)

      return ret
    },

    //下注
    doAddBetMoneyLevel() {
      if (!this.item.BetMoneyLevel) {
        this.item['BetMoneyLevel'] = []
      }
      this.item.BetMoneyLevel.push({ TableMoney: '60,100,200,400,600,2000'})
    },
    delRowBetMoneyLevel(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    },

    //delay
    doAddFlyDelay() {
      if (!this.item.FlyDelay) {
        this.item['FlyDelay'] = []
      }
      let maxId = 0
      for (const o of this.item.FlyDelay) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.FlyDelay.push({ Id: maxId + 1, Area: 1, Delay: 1})
    },
    delFlyDelay(index) {
      this.item.FlyDelay.splice(index, 1)
    },

    //bunos
    doAddBonusCfg() {
      if (!this.item.BonusCfg) {
        this.item['BonusCfg'] = []
      }
      let maxId = 0
      for (const o of this.item.BonusCfg) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.BonusCfg.push({ Id: maxId + 1, Reward: 1, Mul: 1})
      console.log("this.item.BonusCfg:", this.item.BonusCfg)
    },
    delBonus(index) {
      this.item.BonusCfg.splice(index, 1)
    },

    //robot
    doAddRobotCfg() {
      if (!this.item.RobotCfg) {
        this.item['RobotCfg'] = []
      }
      let maxId = 0
      for (const o of this.item.RobotCfg) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.RobotCfg.push({ Id: maxId + 1, RewardType: 100, Rate: [1, 1]})
    },
    delRobotCfg(index) {
      this.item.RobotCfg.splice(index, 1)
    },

    //保留规则
    getRobotBetInteger(idx) {
      const dMap = {
        0: '百位',
        1: '十位',
        2: '个位'
      }
      return dMap[idx]
    },    
    getRobotBetDecimal(idx) {
      const dMap = {
        0: '0位',
        1: '1位',
        2: '2位'
      }
      return dMap[idx]
    },

    //落库
    setData() {
      var postData = this.getPostData();
      this.form.Data = JSON.stringify(postData)
      console.log("==> ", this.form.Data)
      console.log(this.form)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        if (postData.openTest=="2") {
          this.$alert('测试模式已开启，请测试后关闭', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: ``
              });
            }
          });
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

    //是否是审核服
    IsPHAuditEnv(){
      return this.env == 'ph_audit'
    }
  }
}
</script>
