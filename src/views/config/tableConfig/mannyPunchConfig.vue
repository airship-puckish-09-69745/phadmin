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
                  
                  <el-col :span="8">
                    <el-form-item label="超时放弃时间:">
                      <el-input v-model.number="item.AutoDropTimer" size="mini" ><template  slot="append">秒</template></el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-col>

              <!--RTPS-->
              <fieldset style="margin-top:10px" v-if="!IsPHAuditEnv()">
                
                <el-col :span="20">
                  <el-button style="margin-bottom:10px; background-color: #c5ddf0" type="normal" icon="el-icon-plus" size="mini" @click="doAddRTPSLevel()">添加</el-button>
                </el-col>
                
                <legend>RTP配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.BaseCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="难度级别" width="160px">
                    <template slot-scope="scope">
                      {{getLvName(scope.$index)}}
                    </template>
                  </el-table-column>

                  <el-table-column label="RTP" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="item.BaseCfg[scope.$index].Rtp" size="mini" ><template  slot="append">%</template></el-input>
                    </template>
                  </el-table-column>
                  <!--
                  <el-table-column label="进入JP奖池百分百" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="item.BaseCfg[scope.$index].IncJPPercent" size="mini" ><template  slot="append">%</template></el-input>
                    </template>
                  </el-table-column>
                -->
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowRTPSLevel(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>
              
              <!--bet-->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px; background-color: #c5ddf0" type="normal" icon="el-icon-plus" size="mini" @click="doAddBetMoneyLevel()">添加</el-button>
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
              
              <!--难度场次步数配置-->
              <fieldset v-for="(title, index) in lv"
                :key="index"
                v-if="item.BaseCfg[index]"
                style="margin-top:10px"
              >
                <el-col :span="20">
                  <el-button style="margin-bottom:10px; background-color: #c5ddf0" type="normal" icon="el-icon-plus" size="mini" @click="doAddOddsCfg(index)">添加</el-button>
                </el-col>
                
                <legend>难度场次步数配置 <b span style="font-weight: bold; color: red;">{{title}}</b></legend>

                <el-table ref="filterTable" :data="item.OddsCfg[index]" border
                  :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%"
                >
                  <el-table-column label="步数" width="90px">
                    <template slot-scope="scope">
                      {{scope.row.Id}}
                    </template>
                  </el-table-column>

                  <el-table-column label="赔率" width="280px">
                    <template slot-scope="scope">
                      <el-input v-model="item.OddsCfg[index][scope.$index].Odds" size="mini" ><template  slot="append">X</template></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="出现JP权重" width="150px">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.OddsCfg[index][scope.$index].JPWeight" size="mini" ></el-input>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delOddsCfg(index, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>

              <!--小奖池触发重摇
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
              -->
            </el-col>
          </el-tab-pane>

          <el-tab-pane label="Jackpot">
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="jackpot服务费*bet(抽水比例)">
                    <el-input v-model.number="JackpotCfg.JackpotFee" size="mini" ><template slot="append">‰</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="解锁Jackpot最小下注(放大1000倍)：">
                    <el-input v-model.number="JackpotCfg.JackpotBetMin" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="单局开奖最高开出显示奖池(%)："  v-if="!IsPHAuditEnv()">
                    <el-input v-model.number="JackpotCfg.ShowPoolLimitRate" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="奖池保底">
                    <el-input v-model.number="JackpotCfg.BaseValue" size="mini" ></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          
            <fieldset style="margin-top:10px" v-if="!IsPHAuditEnv()">
              <legend>jackpot调控配置</legend>
              <el-row>
                <el-table
                  ref="filterJackpotConfig"
                  :data="RandAwards"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />
                  <el-table-column label="奖励类型" prop="JackpotType">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.JackpotType">
                        <el-option
                          v-for="typeItem in JackpotTypes"
                          :key="typeItem.value"
                          :label="typeItem.label"
                          :value="typeItem.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="奖励发放类型" prop="AwardType"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.AwardType">
                        <el-option
                          v-for="typeItem in AwardTypes"
                          :key="typeItem.Type"
                          :label="typeItem.Name"
                          :value="typeItem.Type"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="发放数量" prop="Value">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AwardRate" style="width: 140px;" size="mini" :required="true">
                        <template v-if="scope.row.AwardType==1" slot="append">%</template>
                        <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 140px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="中奖概率" prop="DayLimit"><!--   v-if="IsPHAuditEnv()"-->
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.JackpotRate" ><template slot="append">‰</template></el-input>
                    </template>
                  </el-table-column>
                  <!--
                  <el-table-column label="开出的奖池值" prop="PoolVal"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                    </template>
                  </el-table-column>
                  <el-table-column label="开奖数量概率" prop="RateArr"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
                      {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                    </template>
                  </el-table-column>
                  -->
                  <el-table-column label="分段限制" prop="DayLimitArr">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showDayLimitDialog(scope.row)" />
                      <el-tag v-for="tag, key in scope.row.DayLimitArr" v-if="scope.row.AwardType == 1" :key="key" disable-transitions>{{ showOpenDayLimit(tag) }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="玩家开奖池条件(%)" width="260">
                    <template slot-scope="scope">
                      <div v-if="scope.row.AwardType==1">
                        虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
                        &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
                      </div>
                      <span v-if="scope.row.JackpotType==4">
                        3Bet中奖会判断玩家的个人JP贡献值，中奖额≤贡献值才开，玩家开奖后根据中奖额扣除贡献值
                      </span>
                    </template>
                  </el-table-column>
        
                  <el-table-column label="机器人开奖池值" prop="PoolVal" width="180">
                    <template v-if="scope.row.AwardType==1" slot-scope="scope">
                      >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                    </template>
                  </el-table-column>
            
                  <el-table-column label="机器人开奖数量概率" prop="RateArr" width="160">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
                      {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                    </template>
                  </el-table-column>
                  
                </el-table>
              </el-row>
            </fieldset>
            <fieldset style="margin-top:10px"   v-if="!IsPHAuditEnv()">
              <legend>jackpot奖池增长</legend>
              <jackpot-increase :pool-incr-arr="PoolIncrArr" />
            </fieldset>
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
        <el-form-item label="步数终点:">
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
  
    <!-- 【dialog】jackpot开出奖励 -->
    <el-dialog
      :title="poolNumChange.title"
      :modal="false"
      :visible.sync="poolNumChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addPoolNum()">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="savePoolNum">保存</el-button>
      <el-table
        ref="filterTable"
        :data="poolNumChange.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="配置ID" prop="Id">
          <template slot-scope="scope">
            {{ scope.row.Id }}
          </template>
        </el-table-column>
        <el-table-column label="开出数量" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开出概率(%)" prop="Rate">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removePoolNum(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 【dialog】每日限制开出个数 -->
    <el-dialog
      :title="dayLimitChange.title"
      :modal="false"
      :visible.sync="dayLimitChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addDayLimit">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="saveDayLimit">保存</el-button>
      <el-table
        ref="filterTable"
        :data="dayLimitChange.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column type="index" />
        <el-table-column label="开始小时" prop="StartHours">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.StartHours" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="结束小时(不包含结束时间点)" prop="EndHours">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.EndHours" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开奖数量" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removeDayLimitNum(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        FeeRate:3,
        AutoDropTimer:200,
        BaseCfg:[],
        BetMoneyLevel:[], //下注
        OddsCfg:[],
        // ReChoiceCfg:{
        //   LowLotteryPoolReChoice:0, 
        //   LowLotteryPoolReChoiceRate:0, 
        //   HighLotteryPoolReChoice:0, 
        //   HighLotteryPoolReChoiceRate: 0
        // },
      },
      form: {},
      subKey: 'manny_punch_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      env:process.env.VUE_APP_PROJECT,
      dialogFormVisible: false,
      lv:['Easy','Medium','Hard','Expert', 'Master','Nightmare'],
      JackpotCfg: {BaseValue:0, JackpotBetMin:1000},
      PoolIncrArr: [],
      JackpotTypes: [
        { 'label': 'GRAND', 'value': 1 },
        { 'label': 'MAJOR', 'value': 2 },
        { 'label': 'MINOR', 'value': 3 },
        { 'label': 'MINI', 'value': 4 }
      ],
      AwardTypes: [
        { 'Type': 1, 'Name': '奖池百分比' },
        { 'Type': 2, 'Name': '下注额倍数' }
      ],
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
      

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

      for (const i in that.item.OddsCfg) {
        let odds = []
        let id = 1
        for (const j in that.item.OddsCfg[i].OddsItem) {
          odds.push({
            Id:id, 
            Odds:that.item.OddsCfg[i].OddsItem[j].Odds / 100, 
            JPWeight:that.item.OddsCfg[i].OddsItem[j].JPWeight
          })
          id ++
        }
        that.item.OddsCfg[i] = odds
      }

      for (const i in that.item.BaseCfg) {
        that.item.BaseCfg[i].Rtp = that.item.BaseCfg[i].Rtp / 100
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
            if (!item.OddsCfg) {
              item['OddsCfg'] = []
            }
            if (!item.BaseCfg) {
              item['BaseCfg'] = []
            }
            if (item.JackpotCfg && item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.RandAwards) {
                this.RandAwards = item.JackpotCfg.JackpotRegulation.RandAwards
                for (const o of this.RandAwards) {
                  o.PoolVal /= 1000
                }
              }
            }else{
              item['JackpotCfg'] = {BaseValue: 0, JackpotBetMin: 1000, JackpotRegulation: {RandAwards:[]}}
            }
            this.JackpotCfg = item.JackpotCfg
            if (item.JackpotCfg && item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.PoolIncrArr) {
                this.PoolIncrArr = item.JackpotCfg.JackpotRegulation.PoolIncrArr
              }
            }

            if (!item.Card){
              item["Card"] = "0" //第几步死亡
              item["openTest"] = "1"
            }

            Object.assign(this.item, item)

            this.transMoneyForShow()

            // item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
            // item.ReChoiceCfg.HighLotteryPoolReChoice /= 1000

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
      //console.log("上传====>",ret)

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
      ret.OddsCfg = []
      ret.JPTotalWeight = [] //总权重
      for (const i in this.item.OddsCfg) {
        if (!this.item.BaseCfg[i]) {
            continue
          }
        let oddsCfg = []
        let id = 1 //步数id
        let totalWeight = 0
        for (const j in this.item.OddsCfg[i]) {
          let tempOdds = Math.round(this.item.OddsCfg[i][j].Odds * 100) //赔率放大100倍
          let liveRate = Math.round(this.item.BaseCfg[i].Rtp * 1000000 / tempOdds) //计算存活率
          totalWeight += this.item.OddsCfg[i][j].JPWeight
          oddsCfg.push({
            Id: id, 
            Odds: tempOdds, 
            LiveRate: liveRate, 
            JPWeight: this.item.OddsCfg[i][j].JPWeight
          })
          id ++
          console.log("this.item.OddsCfg[i][j] = ", this.item.OddsCfg[i][j])
        }
        ret.OddsCfg.push({OddsItem:oddsCfg})
        ret.JPTotalWeight.push(totalWeight)
      }

      for (const i in this.item.BaseCfg) {
        ret.BaseCfg[i].Rtp = Math.round(this.item.BaseCfg[i].Rtp * 100)
      }

      // ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      // ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
      ret.AutoDropTimer *= 1

      if (ret.JackpotCfg.JackpotRegulation){
        for (const o of ret.JackpotCfg.JackpotRegulation.RandAwards) {
          o.PoolVal = parseInt(o.PoolVal * 1000)
        }
      }

      //测试
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Card']
      }
      console.log("上传====>",ret)
      return ret
    },

    //RTPS
    doAddRTPSLevel() {
      if (!this.item.BaseCfg) {
        this.item['BaseCfg'] = []
      }
      this.item.BaseCfg.push({Rtp: 96})
    },
    delRowRTPSLevel(index) {
      console.log(index)
      this.item.BaseCfg.splice(index, 1)
    },
    getLvName(idx) {
      return this.lv[idx]
    },

    //下注
    doAddBetMoneyLevel() {
      if (!this.item.BetMoneyLevel) {
        this.item['BetMoneyLevel'] = []
      }
      this.item.BetMoneyLevel.push({ TableMoney: '1,2,3,4,5,6,8,10,15,20,25,30,50,3000,10000'})
    },
    delRowBetMoneyLevel(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    },

    //步数赔率配置
    doAddOddsCfg(idx) {
      if (!this.item.OddsCfg) {
        this.item['OddsCfg'] = []
      }
      if (!this.item.OddsCfg[idx]) {
        this.item.OddsCfg.push([])
      }
      let maxId = 0
      for (const o of this.item.OddsCfg[idx]) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.OddsCfg[idx].push({ Id: maxId + 1, Odds: 1, JPWeight: 0})
    },
    delOddsCfg(idx, index) {
        this.item.OddsCfg[idx].splice(index, 1)
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

    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showOpenPoolRate(jpType, data) {
      console.log('jpType:', jpType, ' data:', data)
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            showStr += data[i].Num + '个(' + data[i].Rate + '%);'
          }
        }
        return showStr
      }
    },
    showPoolNumDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      let jpTypeName = ''
      for (var i = 0; i < this.JackpotTypes.length; i++) {
        if (this.JackpotTypes[i].value == data.JackpotType) {
          jpTypeName = this.JackpotTypes[i].label
          break
        }
      }
      this.poolNumChange.title = jpTypeName + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    ////////////////////////////////////////////
    showDayLimitDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      this.dayLimitChange.title = this.JackpotTypes[data.JackpotType].label + '(分段限制)'
      this.dayLimitChange.data = data.DayLimitArr || [{}]
      this.dayLimitChange.visible = true
      this.dayLimitChange.jackpotType = data.JackpotType
    },
    addDayLimit() {
      if (!this.dayLimitChange.data) {
        this.dayLimitChange['data'] = []
      }
      this.dayLimitChange.data.push({ 'StartHours': 0, 'EndHours': 0, 'Num': 0 })
    },
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    removeDayLimitNum(index) {
      this.dayLimitChange.data.splice(index, 1)
    },
    savePoolNum() {
      for (var i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.poolNumChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          this.JackpotRandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
    },
    saveDayLimit() {
      for (let i = 0; i < this.dayLimitChange.data.length; i++) {
        if (this.dayLimitChange.data[i].StartHours < 0 || this.dayLimitChange.data[i].EndHours > 24) {
          Message.error('请输入正确的时间')
          return
        }
        if (this.dayLimitChange.data[i].StartHours > this.dayLimitChange.data[i].EndHours) {
          Message.error('请输入正确的时间')
          return
        }
      }
      for (var i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.dayLimitChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          if (!this.JackpotRandAwards[i]['DayLimitArr']) {
            this.JackpotRandAwards[i]['DayLimitArr'] = []
          }
          this.JackpotRandAwards[i]['DayLimitArr'] = this.dayLimitChange.data
          break
        }
      }
      this.dayLimitChange.visible = false
    },    
    showOpenDayLimit(data) {
      return '[' + data['StartHours'] + ',' + data['EndHours'] + ')点：' + data['Num'] + '个'
    },
  }
}
</script>
