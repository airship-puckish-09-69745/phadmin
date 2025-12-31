<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
      <!--
      <el-col :span="2" v-if="IsDev()">
        <el-button type="primary" @click="dialogFormVisible= true" size="mini" > 测试配置</el-button>
      </el-col>
      -->
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

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="保底奖池抽水(支持小数点后3位)">
                      <el-input v-model="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-col>
              
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="系数:">
                      <el-input v-model="item.NormalCfg.Coefficient" size="mini" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="特殊游戏概率:">
                      <el-input v-model="item.NormalCfg.SpecialGameRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="Free Attack权重：">
                      <el-input v-model.number="item.NormalCfg.FreeAttackWeight" size="mini" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Free Spin权重：">
                      <el-input v-model.number="item.NormalCfg.FreeSpinWeight" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
            <el-col :span="16" :offset="3">
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
            </el-col>
            <el-col :span="16" :offset="3">
              <!--基础配置-->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddOddsCfg(0)">添加</el-button>
                </el-col>
                <legend>normal配置</legend>
                <el-table
                  ref="filterNormalTable"
                  :data="item.NormalCfg.OddsCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                <!--
                  <el-table-column label="ID" prop="Id">
                    <template slot-scope="scope">
                      {{ scope.row.Id }}
                    </template>
                  </el-table-column>
                -->
                  <el-table-column label="倍数" prop="Odds" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="阶段" prop="Step" width="120px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Step" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="权重" prop="Weight">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Id==1">
                        <el-input v-model.number="scope.row.Weight" size="mini" />
                      </span>
                      <span v-else style="color:red">
                        {{getOddsWeight(scope.row.Odds, item.NormalCfg.Coefficient)}}
                      </span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope" v-if="scope.row.Id>1">                      
                      <el-button type="danger" size="mini" @click="delOddsCfg(0,scope.$index)">删除</el-button>
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

          <!--Free Attack-->
          <el-tab-pane label="Free Attack配置">
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="系数:">
                    <el-input v-model="item.FreeAttackCfg.Coefficient" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="特殊游戏概率:">
                    <el-input v-model="item.FreeAttackCfg.SpecialGameRate" size="mini" ><template  slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="Free Attack权重：">
                    <el-input v-model.number="item.FreeAttackCfg.FreeAttackWeight" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Free Spin权重：">
                    <el-input v-model.number="item.FreeAttackCfg.FreeSpinWeight" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="初始次数：">
                    <el-input v-model.number="item.FreeAttackCfg.StartNum" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="卖价倍数：">
                    <el-input v-model.number="item.FreeAttackCfg.CostMoney" size="mini" ><template  slot="append">X</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <!--FreeAttack配置-->
            <el-col :span="16" :offset="3">
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddOddsCfg(1)">添加</el-button>
                </el-col>
                <legend>freeAttack配置</legend>
                <el-table
                  ref="filterFreeAttackTable"
                  :data="item.FreeAttackCfg.OddsCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                <!--
                  <el-table-column label="ID" prop="Id">
                    <template slot-scope="scope">
                      {{ scope.row.Id }}
                    </template>
                  </el-table-column>
                -->
                  <el-table-column label="倍数" prop="Odds" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="阶段" prop="Step" width="120px">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Step" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="权重" prop="Weight">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Id==1">
                        <el-input v-model.number="scope.row.Weight" size="mini" />
                      </span>
                      <span v-else style="color:red">
                        {{getOddsWeight(scope.row.Odds, item.FreeAttackCfg.Coefficient)}}
                      </span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope" v-if="scope.row.Id>1">                      
                      <el-button type="danger" size="mini" @click="delOddsCfg(1,scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>
            </el-col>
            
          </el-tab-pane>

          <!--Free Spin-->
          <el-tab-pane label="Free Attack配置">
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="总格子数:">
                    <el-input v-model="item.FreeSpinCfg.CellNum" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="初始次数:">
                    <el-input v-model="item.FreeSpinCfg.SpinCount" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="符号倍数系数:">
                    <el-input v-model="item.FreeSpinCfg.Coefficient" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="初始个数系数:">
                    <el-input v-model="item.FreeSpinCfg.NumCoefficient" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="粘住概率:">
                    <el-input v-model="item.FreeSpinCfg.MagnetRate" size="mini" ><template  slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="初始奖励个数范围:">
                    <el-input v-model="item.FreeSpinCfg.StartCellArea[0]" size="mini" style="width: 80px" />
                    <span style="margin: 0 10px">~</span>
                    <el-input v-model="item.FreeSpinCfg.StartCellArea[1]" size="mini" style="width: 80px" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="卖价倍数:">
                    <el-input v-model="item.FreeSpinCfg.CostMoney" size="mini" ><template  slot="append">X</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Jackpot奖励倍数:">
                    <el-input v-model="item.FreeSpinCfg.JackpotOdds" size="mini" ><template  slot="append">x</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

          <el-col :span="16" :offset="3">
            <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddNumCfg()">添加</el-button>
                </el-col>
                <legend>个数配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.FreeSpinCfg.InitCellNumCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                <!--
                  <el-table-column label="ID" prop="Id">
                    <template slot-scope="scope">
                      {{ scope.row.Id }}
                    </template>
                  </el-table-column>
                -->

                  <el-table-column label="个数" prop="Num" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="权重" prop="Weight">
                    <template slot-scope="scope">
                      <span style="color:red">
                        {{getNumWeight(scope.row.Num, item.FreeSpinCfg.NumCoefficient)}}
                      </span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">                      
                      <el-button type="danger" size="mini" @click="delNumCfg(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>
            </el-col>

            <el-col :span="16" :offset="3">
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddOddsCfg(2)">添加</el-button>
                </el-col>
                <legend>freeSpin配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.FreeSpinCfg.OddsCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <!--
                  <el-table-column label="ID" prop="Id">
                    <template slot-scope="scope">
                      {{ scope.row.Id }}
                    </template>
                  </el-table-column>
                  -->

                  <el-table-column label="倍数" prop="Odds" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="权重" prop="Weight">
                    <template slot-scope="scope">
                      <span style="color:red">
                        {{getFreeSpinOddsWeight(scope.row.Odds, item.FreeSpinCfg.Coefficient)}}
                      </span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">                      
                      <el-button type="danger" size="mini" @click="delOddsCfg(2,scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
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
                <el-input v-model.number="item.Card" size="mini" /><template slot="append">配置放大100倍</template>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        BetMoneyLevel:[], //下注
        FeeRate:3,
        ReChoiceCfg:{
          LowLotteryPoolReChoice: 1000,
          LowLotteryPoolReChoiceRate: 10000,
          HighLotteryPoolReChoice: 0,
          HighLotteryPoolReChoiceRate: 0,
        },
        NormalCfg:{
          Coefficient:1.656,//%
          SpecialGameRate:1.5,
          SpecialTotalWeight:0, //FreeAttackWeight + FreeSpinWeight
          FreeAttackWeight:5,
          FreeSpinWeight:8,
          OddsCfg:[], //倍率配置
          OddsTotalWeight:0,
        },
        FreeAttackCfg:{
          Coefficient:1.158,//%
          SpecialGameRate:6.5,
          SpecialTotalWeight:0, //FreeAttackWeight + FreeSpinWeight
          FreeAttackWeight:5,
          FreeSpinWeight:5,
          StartNum:10,
          OddsCfg:[], //倍率配置
          CostMoney:50, //购买花费
          OddsTotalWeight:0,
        },
        FreeSpinCfg:{
          CellNum:15,
          StartCellArea:[5, 14],
          SpinCount:3,   //花费40购买3次FreeSpin
          Coefficient:1,//%
          NumCoefficient:6,
          MagnetRate:5.2, //%
          CostMoney:40, //购买花费
          JackpotOdds:1000, //满屏奖励jp倍数
          InitCellNumCfg:[],
          NumTotalWeight:0,
          OddsCfg:[], //倍率配置
          OddsTotalWeight:0,
        }
      },
      form: {},
      subKey: 'pirate_tap_cfg',
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
      for (const i in that.item.NormalCfg.OddsCfg) {
        that.item.NormalCfg.OddsCfg[i].Odds /= 100
      }
      for (const i in that.item.FreeAttackCfg.OddsCfg) {
        that.item.FreeAttackCfg.OddsCfg[i].Odds /= 100
      }
      for (const i in that.item.FreeSpinCfg.OddsCfg) {
        that.item.FreeSpinCfg.OddsCfg[i].Odds /= 100
        that.item.FreeSpinCfg.OddsCfg[i].Weight /= 100
      }
      for (const i in that.item.FreeSpinCfg.InitCellNumCfg) {
        that.item.FreeSpinCfg.InitCellNumCfg[i].Weight /= 100
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
            //console.log('response.Data.Data=======>', response.Data.Data)
            const item = JSON.parse(response.Data.Data)
            if (!item.Card){
              item["Card"] = "0"
              item["openTest"] = "1"
            }
            /*
            if (!item.NormalCfg) {
              item["NormalCfg"] = {}
              this.InitOdds(item.NormalCfg, 0)
            }
            if (!item.FreeAttackCfg) {
              item["FreeAttackCfg"] = {}
              this.InitOdds(item.FreeAttackCfg, 1)
            }
            if (!item.FreeSpinCfg) {
              item["FreeSpinCfg"] = {}
              this.InitOdds(item.FreeSpinCfg, 2)
            }
            if (!item.ReChoiceCfg){
              item["ReChoiceCfg"] = {}
            }
            */
            Object.assign(this.item, item)

            this.transMoneyForShow()
            item.FeeRate /= 1000
            item.NormalCfg.Coefficient /= 1000
            item.NormalCfg.SpecialGameRate /= 10000
            item.FreeAttackCfg.Coefficient /= 1000
            item.FreeAttackCfg.SpecialGameRate /= 10000
            item.FreeAttackCfg.CostMoney /= 1000
            item.FreeSpinCfg.Coefficient /= 1000
            item.FreeSpinCfg.CostMoney /= 1000
            item.FreeSpinCfg.MagnetRate /= 10000
            item.FreeSpinCfg.JackpotOdds /= 100
            item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
            item.ReChoiceCfg.HighLotteryPoolReChoice /= 1000
            
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
      //NormalCfg
      ret.NormalCfg.OddsTotalWeight = 0
      for (const i in this.item.NormalCfg.OddsCfg) {
        let weight = this.item.NormalCfg.OddsCfg[i].Weight
        if (i > 0){
          weight = this.getOddsWeight(this.item.NormalCfg.OddsCfg[i].Odds, this.item.NormalCfg.Coefficient)
          ret.NormalCfg.OddsCfg[i].Weight = weight
        }
        ret.NormalCfg.OddsCfg[i].Odds = Math.round(this.item.NormalCfg.OddsCfg[i].Odds*100)
        ret.NormalCfg.OddsCfg[i].WeightArea = ret.NormalCfg.OddsTotalWeight + weight //权重区间
        ret.NormalCfg.OddsTotalWeight += weight
      }
      //FreeAttackCfg
      ret.FreeAttackCfg.OddsTotalWeight = 0
      for (const i in this.item.FreeAttackCfg.OddsCfg) {
        let weight = this.item.FreeAttackCfg.OddsCfg[i].Weight
        if (i > 0) {
          weight = this.getOddsWeight(this.item.FreeAttackCfg.OddsCfg[i].Odds, this.item.FreeAttackCfg.Coefficient)
          ret.FreeAttackCfg.OddsCfg[i].Weight = weight
        }
        ret.FreeAttackCfg.OddsCfg[i].Odds  = Math.round(this.item.FreeAttackCfg.OddsCfg[i].Odds*100)
        ret.FreeAttackCfg.OddsCfg[i].WeightArea = ret.FreeAttackCfg.OddsTotalWeight + weight //权重区间
        ret.FreeAttackCfg.OddsTotalWeight += weight
      }
      //FreeSpinCfg
      ret.FreeSpinCfg.OddsTotalWeight = 0
      ret.FreeSpinCfg.NumTotalWeight = 0
      for (const i in this.item.FreeSpinCfg.OddsCfg) {
        let weight = Math.round(this.getFreeSpinOddsWeight(this.item.FreeSpinCfg.OddsCfg[i].Odds, this.item.FreeSpinCfg.Coefficient)*100)
        ret.FreeSpinCfg.OddsCfg[i].Weight = weight// * 100
        ret.FreeSpinCfg.OddsCfg[i].Odds = Math.round(this.item.FreeSpinCfg.OddsCfg[i].Odds*100)
        ret.FreeSpinCfg.OddsCfg[i].WeightArea = ret.FreeSpinCfg.OddsTotalWeight + weight //权重区间
        ret.FreeSpinCfg.OddsTotalWeight += ret.FreeSpinCfg.OddsCfg[i].Weight
      }
      for (const i in this.item.FreeSpinCfg.InitCellNumCfg) {
        ret.FreeSpinCfg.InitCellNumCfg[i].Weight = this.getNumWeight(ret.FreeSpinCfg.InitCellNumCfg[i].Num, this.item.FreeSpinCfg.NumCoefficient) * 100
        ret.FreeSpinCfg.NumTotalWeight += ret.FreeSpinCfg.InitCellNumCfg[i].Weight
      }
      //基础配置
      ret.FeeRate *= 1000
      ret.NormalCfg.Coefficient *= 1000
      ret.NormalCfg.SpecialGameRate *= 10000
      ret.FreeAttackCfg.Coefficient *= 1000
      ret.FreeAttackCfg.SpecialGameRate *= 10000
      ret.FreeAttackCfg.CostMoney *= 1000
      ret.FreeSpinCfg.Coefficient *= 1000
      ret.FreeSpinCfg.CostMoney *= 1000
      ret.FreeSpinCfg.MagnetRate *= 10000
      ret.FreeSpinCfg.JackpotOdds *= 100
      ret.NormalCfg.SpecialTotalWeight = ret.NormalCfg.FreeAttackWeight + ret.NormalCfg.FreeSpinWeight
      ret.FreeAttackCfg.SpecialTotalWeight = ret.FreeAttackCfg.FreeAttackWeight + ret.FreeAttackCfg.FreeSpinWeight
      ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
      //测试
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Card']
      }
      console.log("上传====>",ret)
      return ret
    },

    InitOdds(cfg, type) {
      if (!cfg.OddsCfg || cfg.OddsCfg.lenght == 0) {
        for (;;){
          let odds = this.doAddOddsCfg(type)
          if (type < 2 && odds >= 50 || type>=2 && odds < 20){
            break
          }
        }
      }
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

    //odds
    doAddOddsCfg(type) {
      let obj = this.item.NormalCfg //普通配置
      if (type == 1){
        obj = this.item.FreeAttackCfg //FreeAttack配置
      } else if (type == 2){
        obj = this.item.FreeSpinCfg
      }
      if (!obj.OddsCfg) {
        obj['OddsCfg'] = []
      }
      let maxId = 0
      let mul = 0
      for (const o of obj.OddsCfg) {
        if (o.Id > maxId) {
          maxId = o.Id
          mul = Math.round(o.Odds*10+ (o.Odds >= 20 ? 10 : 2))/10
        }
      }
      obj.OddsCfg.push({ Id: maxId + 1, Odds: type == 2?maxId + 1:mul, Step: 0, Weight: 500000})
      return mul
    },
    delOddsCfg(type, index) {
      let obj = this.item.NormalCfg  //普通配置
      if (type == 1){
        obj = this.item.FreeAttackCfg //FreeAttack配置
      } else if (type == 2){
        obj = this.item.FreeSpinCfg
      }
      obj.OddsCfg.splice(index, 1)
    },
    getOddsWeight(mul, coefficient) {
      let r = Math.floor(Math.pow(1/mul, coefficient)*10000+0.99999)
      return r
    },
    getFreeSpinOddsWeight(mul, coefficient) {
      let r = Math.floor(Math.pow(1/mul, coefficient)*1000000+0.5)/100
      return r
    },

    //num
    doAddNumCfg() {
      let obj = this.item.FreeSpinCfg
      let maxId = 0
      for (const o of obj.InitCellNumCfg) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      obj.InitCellNumCfg.push({ Id: maxId + 1, Num: maxId + 5, Weight: 500000})
    },
    delNumCfg(index) {
      this.item.FreeSpinCfg.InitCellNumCfg.splice(index, 1)
    },
    getNumWeight(mul, coefficient) {
      let r = Math.round(Math.pow(1/mul, coefficient)*1000000)/100 //2位小数
      return r
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
    },
    IsDev() {
      console.log("process.env = ", process.env)
      return process.env.VUE_APP_PROJECT_NAME === '菲1-开发环境'
    }
  }
}
</script>
