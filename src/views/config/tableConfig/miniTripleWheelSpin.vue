<template>
  <div class="app-container">

    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
      
      <el-col :span="2" v-if="IsDev()">
        <el-button type="primary" @click="dialogFormVisible= true" size="mini" > 测试配置</el-button>
      </el-col>
      
    </el-row>

    <h3></h3>

    <el-row>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
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
                      <el-input v-model="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="超时放弃时间:">
                      <el-input v-model.number="item.AutoDropTimer" size="mini" ><template  slot="append">秒</template></el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-col>

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

              <!--倍数配置-->
              <fieldset>
                <el-col :span="20">
                  <el-button style="margin-bottom:10px; background-color: #c5ddf0" type="normal" icon="el-icon-plus" size="mini" @click="doOddsCfg()">添加</el-button>
                </el-col>
                <legend>Odds配置</legend>
                <el-table
                  ref="filterTable"
                  :data="item.OddsCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />

                  <el-table-column prop="Inner" label="内圈" >
                    <template slot-scope="scope" v-if="scope.$index < 4">
                      <el-input v-model="scope.row.Inner" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="Middle" label="中" >
                    <template slot-scope="scope" v-if="scope.$index < 6">
                      <el-input v-model="scope.row.Middle" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="Outer" label="外圈" >
                    <template slot-scope="scope" v-if="scope.$index < 8">
                      <el-input v-model="scope.row.Outer" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delOddsCfg(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>

              <!--倍数配置-->
              <fieldset>
                <el-col :span="20">
                  <el-button style="margin-bottom:10px; background-color: #c5ddf0" type="normal" icon="el-icon-plus" size="mini" @click="doBonusCfg()">添加</el-button>
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
                  <el-table-column type="index" />

                  <el-table-column prop="odds" label="倍数" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="权重" >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Weight" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delBonusCfg(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>

              <!--小奖池触发重摇-->
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

          <el-tab-pane label="概率配置">
            <el-col :span="16" :offset="3">
              <template>
                <div class="csv-parser">
                  <!-- 文件选择（支持单文件或多文件） -->
                  <input 
                    type="file" 
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept=".csv"
                    multiple
                  />

                  <!-- 文件预览（可选） -->
                  <div v-if="selectedFiles.length" class="file-preview">
                    <h3>已选择文件：</h3>
                    <ul>
                      <li v-for="(file, index) in selectedFiles" :key="index">
                        {{ file.name }} ({{ formatFileSize(file.size) }})
                      </li>
                    </ul>
                  </div>

                  <!-- CSV 数据展示 -->
                  <div v-if="csvData.length" class="csv-table">
                    <h3>CSV 数据：</h3>
                    <table>
                      <tbody>
                        <tr>
                          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                        </tr>
                        <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
                          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </el-col>
          </el-tab-pane>

          <el-tab-pane label="Jackpot">
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="jackpot服务费*bet">
                    <el-input v-model.number="JackpotCfg.JackpotFee" size="mini" ><template slot="append">‰</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="解锁jackpot_grand下注">
                    <el-input v-model.number="JackpotCfg.JackpotGrandBetMin" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="解锁jackpot_major下注">
                    <el-input v-model.number="JackpotCfg.JackpotMajorBetMin" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="解锁jackpot_minor下注">
                    <el-input v-model.number="JackpotCfg.JackpotMinorBetMin" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="展示奖池保底:">
                    <el-input v-model.number="JackpotCfg.BaseValue" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开JP概率:">
                    <el-input v-model="JackpotCfg.JackpotRate" size="mini" ><template  slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            
            <fieldset style="margin-top:10px" ><!--v-if="!IsPHAuditEnv()"-->
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
                  <el-table-column label="奖励发放类型" prop="AwardType" v-if="!IsPHAuditEnv()">
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
                  <el-table-column label="每日限制开出个数" prop="DayLimit" ><!--v-if="!IsPHAuditEnv()"(0为不限)-->
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 140px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                    </template>
                  </el-table-column>
                  <!--
                  <el-table-column label="中奖权重(总权重1000)" prop="DayLimit">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.JackpotRate" ><template slot="append">权重</template></el-input>
                    </template>
                  </el-table-column>
                -->
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
                  <el-table-column label="玩家开奖池条件(%)" width="250" v-if="!IsPHAuditEnv()">
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

                  <el-table-column label="机器人开奖池值" prop="PoolVal" width="170" v-if="!IsPHAuditEnv()">
                    <template v-if="scope.row.AwardType==1" slot-scope="scope">
                      >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                    </template>
                  </el-table-column>

                  <el-table-column label="机器人开奖数量概率" prop="RateArr" width="160" v-if="!IsPHAuditEnv()">
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
      RateCfg:[],   //概率配置
      RandAwards: [],
      item: {
        FeeRate:3.15,
        AutoDropTimer:200,
        BetMoneyLevel:[], //下注
        //小奖池重摇
        ReChoiceCfg:{
          LowLotteryPoolReChoice: 1000,
          LowLotteryPoolReChoiceRate: 10000,
          HighLotteryPoolReChoice: 0,
          HighLotteryPoolReChoiceRate: 0,
        },
        OddsCfg:[],
        BonusCfg:[],
        JackpotCfg: {},
        PoolIncrArr: [],
        JackpotTypes: [
          { 'label': '一等奖', 'value': 1 },
          { 'label': '二等奖', 'value': 2 },
          { 'label': '三等奖', 'value': 3 },
          { 'label': '阳光普照奖', 'value': 4 }
        ],
        AwardTypes: [
          { 'Type': 1, 'Name': '奖池百分比' },
          { 'Type': 2, 'Name': '下注额倍数' }
        ],
      },
      form: {},
      subKey: "miniTripleWheelSpin_cfg",
      libShow: $libShow,
      showSetResultPage: false,
      env:process.env.VUE_APP_PROJECT,
      dialogFormVisible: false,
      JackpotCfg: {BaseValue:0, JackpotGrandBetMin:1000, JackpotMajorBetMin:1000, JackpotMinorBetMin:1000, JackpotRate:100},
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
      //读取配置表
      selectedFiles: [], // 存储选中的文件
      headers: ['Inner', 'Middle', 'Outer', 'BackRate', 'InnerRate', 'MiddleRate', 'OuterRate', 'KeepRate'],       // CSV 表头
      csvData: [],       // CSV 数据
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

      //
      that.csvData = []
      for (const o of that.item.RateCfg) {
        /*
        BackRate: 50000, InnerRate: 244600, MiddleRate: 341100, OuterRate: 449400, KeepRate: 1000100
         */
        let r1 = (o.BackRate / 10000).toString() + '%' //退
        let r2 = ((o.InnerRate-o.BackRate) / 10000).toString() + '%' //内
        let r3 = ((o.MiddleRate-o.InnerRate) / 10000).toString() + '%' //中
        let r4 = ((o.OuterRate-o.MiddleRate) / 10000).toString() + '%' //外
        let r5 = ((o.KeepRate-o.OuterRate) / 10000).toString() + '%' //保持
        that.csvData.push([o.Inner/1, o.Middle/1, o.Outer/1, r1, r2, r3, r4, r5])
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
            
            if (item.JackpotCfg && item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.RandAwards) {
                this.RandAwards = item.JackpotCfg.JackpotRegulation.RandAwards
                for (const o of this.RandAwards) {
                  o.PoolVal /= 1000
                }
              }
            }else{
              item['JackpotCfg'] = {BaseValue: 0, JackpotGrandBetMin: 1000, JackpotMajorBetMin: 1000, JackpotMinorBetMin: 1000, JackpotRate:1, JackpotRegulation: {RandAwards:[]}}
            }
            this.JackpotCfg = item.JackpotCfg
            if (item.JackpotCfg && item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.PoolIncrArr) {
                this.PoolIncrArr = item.JackpotCfg.JackpotRegulation.PoolIncrArr
              }
            }

            if (item.OddsCfg) {
              for (const o of item.OddsCfg){
                o.Inner /= 1000
                o.Middle /= 1000
                o.Outer /= 1000
              }
            }
            if (item.BonusCfg) {
              for (const o of item.BonusCfg){
                o.Odds /= 1000
                o.Weight /= 1
              }
            }

            if (!item.Card){
              item["Card"] = "0"
              item["openTest"] = "1"
            }

            Object.assign(this.item, item)

            this.transMoneyForShow()
            item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
            item.ReChoiceCfg.HighLotteryPoolReChoice /= 1000
            item.JackpotCfg.BaseValue /= 1000 //保底
            if (item.JackpotCfg.JackpotRate){
              item.JackpotCfg.JackpotRate /= 10000
            }
            if (this.IsPHAuditEnv()) {
              item.FeeRate /= 1
            }else{
              item.FeeRate /= 1000
            }

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            this.item = item
            console.log('item=======>', item)
          }
        }
      })

    },
    deleteChars(str) {
      return (str + '').replace(/%/g, '')
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
      
      ret.RateCfg = []
      for (const i in this.csvData) {
        if (this.csvData[i][3] != null){
          let r1 = this.deleteChars(this.csvData[i][3]) * 10000//退1
          let r2 = this.deleteChars(this.csvData[i][4]) * 10000//内
          let r3 = this.deleteChars(this.csvData[i][5]) * 10000//中
          let r4 = this.deleteChars(this.csvData[i][6]) * 10000//外
          let r5 = this.deleteChars(this.csvData[i][7]) * 10000//保持
          ret.RateCfg.push({'Idx': i*1, 
            'Inner': this.csvData[i][0]*1, 
            'Middle': this.csvData[i][1]*1, 
            'Outer': this.csvData[i][2]*1, 
            'BackRate': Math.floor(r1),   //退1
            'InnerRate': Math.floor(r1+r2),  //内
            'MiddleRate': Math.floor(r1+r2+r3), //中
            'OuterRate': Math.floor(r1+r2+r3+r4),  //外
            'KeepRate': Math.floor(r1+r2+r3+r4+r5),   //保持
            'TotalWeight': Math.floor(r1+r2+r3+r4+r5) //总权重
          })
        }        
      }

      ret.InnerOddsCfg = []
      ret.MiddleOddsCfg = []
      ret.OuterOddsCfg = []
      for (const o of ret.OddsCfg) {
        o.Inner = parseInt(o.Inner * 1000)
        o.Middle = parseInt(o.Middle * 1000)
        o.Outer = parseInt(o.Outer * 1000)
        if (o.Inner > 0) {
          ret.InnerOddsCfg.push(o.Inner)
        }
        if (o.Middle > 0) {
          ret.MiddleOddsCfg.push(o.Middle)
        }
        if (o.Outer > 0) {
          ret.OuterOddsCfg.push(o.Outer)
        }
      }
      ret.BonusTotalWeight = 0
      for (const o of ret.BonusCfg) {
        o.Odds = parseInt(o.Odds * 1000)
        o.Weight = parseInt(o.Weight * 1)
        ret.BonusTotalWeight += o.Weight
      }

      ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
      ret.JackpotCfg.BaseValue *= 1000 //保底
      ret.JackpotCfg.JackpotRate *= 10000
      ret.AutoDropTimer *= 1

      if (ret.JackpotCfg.JackpotRegulation){
        for (const o of ret.JackpotCfg.JackpotRegulation.RandAwards) {
          o.PoolVal = parseInt(o.PoolVal * 1000)
        }
      }
      if (this.IsPHAuditEnv()) {
        ret.FeeRate *= 1
      }else{
        ret.FeeRate *= 1000
      }

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
      this.item.BetMoneyLevel.push({ TableMoney: '1,2,3,4,5,6,8,10,15,20,25,30,50,3000,10000'})
    },
    delRowBetMoneyLevel(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    },

    //odds
    doOddsCfg() {
      if (!this.item.OddsCfg) {
        this.item['OddsCfg'] = []
      }
      this.item.OddsCfg.push({'Inner': 0, 'Middle': 0, 'Outer': 0})
    },
    delOddsCfg(index) {
      console.log(index)
      this.item.OddsCfg.splice(index, 1)
    },

    //bonus
    doBonusCfg() {
      if (!this.item.BonusCfg) {
        this.item['BonusCfg'] = []
      }
      this.item.BonusCfg.push({'Odds': 0, 'Weight': 0})
    },
    delBonusCfg(index) {
      console.log(index)
      this.item.BonusCfg.splice(index, 1)
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
      return process.env.VUE_APP_PROJECT_NAME === '菲1-开发环境'
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
    addPoolNum() {
      let maxId = 0
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id > maxId) {
          maxId = this.poolNumChange.data[i].Id
        }
      }
      maxId++
      this.poolNumChange.data.push({ 'Id': maxId, 'Num': 0, 'Rate': 0 })
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

    //读取配置表
    // 处理文件上传
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files.length) return;

      // 存储选中的文件
      this.selectedFiles = Array.from(files);

      // 只解析第一个文件（或遍历所有文件）
      const file = files[0];
      this.parseCSVFile(file);
    },

    // 解析 CSV 文件
    parseCSVFile(file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (e) => {
        const content = e.target.result;
        this.parseCSV(content);
      };
      //reader.readAsText(file); // 读取为文本
    },

    // 解析 CSV 内容（增强版）
    parseCSV(csvContent) {
      const lines = csvContent.split(/\r?\n/); // 处理不同换行符
      if (lines.length === 0) return;

      // 提取表头（第一行）
      this.headers = this.parseCSVLine(lines[0]);

      // 提取数据（剩余行）
      this.csvData = lines.slice(1).map(line => this.parseCSVLine(line)).filter(row => row.length > 0);
      console.log("this.csvData:", this.csvData)
    },

    // 解析单行 CSV（处理带引号、逗号的情况）
    parseCSVLine(line) {
      const result = [];
      let inQuotes = false;
      let currentField = "";

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          // 切换引号状态
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          // 遇到逗号且不在引号内，结束当前字段
          result.push(currentField.trim());
          currentField = "";
        } else {
          // 普通字符，添加到当前字段
          currentField += char;
        }
      }

      // 添加最后一个字段
      result.push(currentField.trim());
      return result;
    },

    // 格式化文件大小（可选）
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
      else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    },
  
    // 读取指定行列（二维数组版）
    getCellFromArray(rowIndex, colIndex) {
      // 边界检查
      if (rowIndex < 0 || rowIndex >= this.csvData.length) {
        return "行索引越界";
      }
      console.log("this.csvData.length = ", this.csvData.length, " ; this.csvData[rowIndex].length = ", this.csvData[rowIndex].length)
      if (colIndex < 0 || colIndex >= this.csvData[rowIndex].length) {
        return "列索引越界";
      }
      return this.csvData[rowIndex][colIndex];
    },

    // 读取指定行列（对象数组版）
    getCellFromObject(rowIndex, columnName) {
      console.log("this.csvData.length = ", this.csvData.length)
      // 行索引检查
      if (rowIndex < 0 || rowIndex >= this.csvData.length) {
        return "行索引越界";
      }
      
      // 列名检查
      if (!this.csvData[rowIndex].hasOwnProperty(columnName)) {
        return `列名 "${columnName}" 不存在`;
      }
      return this.csvData[rowIndex][columnName];
    },

    // 通用读取方法（自动识别数据结构）
    getCell(row, col) {
      if (this.csvData.length === 0) return "无数据";
      
      // 判断第一行是数组还是对象
      const isArrayStructure = Array.isArray(this.csvData[0]);
      
      if (isArrayStructure) {
        return this.getCellFromArray(row, col);
      } else {
        // 转换为行列标识
        const columnName = col;
        return this.getCellFromObject(row, columnName);
      }
    }
  }
}
</script>

<style scoped>
  .csv-parser {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .file-preview {
    margin: 20px 0;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  
  .csv-table {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>