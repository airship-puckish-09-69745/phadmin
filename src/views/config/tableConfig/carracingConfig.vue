<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
      <!--
      <el-col :span="2">
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
            <el-col :span="16" :offset="3">
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="用户离开房间时间(s):">
                      <el-input v-model.number="item.NoticeTime" size="mini" />
                    </el-form-item>
                  </el-col>
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
                    <el-form-item label="下注操作时长(s):">
                      <el-input v-model.number="item.ActionSeconds" size="mini" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="赢钱榜展示数量">
                      <el-input v-model.number="item.WinMoneyShowNum" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

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
                  <el-table-column
                    type="index"
                  />
                  <el-table-column
                    prop="TableMoney"
                    label="下注列表(支持2位小数)"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.TableMoney" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="MinMoneyBet"
                    label="最小下注限制"
                  >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MinMoneyBet" size="mini" />
                  </template>
                  </el-table-column>
                  <el-table-column
                    prop="MaxMoneyBet"
                    label="最大下注限制"
                  >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MaxMoneyBet" size="mini" />
                  </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>

              <fieldset style="margin-top:10px">
                <!--
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddBetAreaOptions()">添加</el-button>
                </el-col>
                -->
                <legend>中奖倍率配置
                </legend>
                <el-table
                  ref="filterTable"
                  :data="item.BetAreaOptions"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="ID" width="50px">
                    <template slot-scope="scope">
                      {{scope.row.Id}}
                    </template>
                  </el-table-column>
                  <el-table-column label="Car" width="90px">
                    <template slot-scope="scope">
                      {{nameMap[scope.row.Id]}}
                    </template>
                    <!--
                    <template slot-scope="scope">
                      <el-image
                        style="width: 37px;height: 50px"
                        :src="getCardUrl(imgMap[scope.row.Id])"
                      />
                    </template>
                  -->
                  </el-table-column>

                  <el-table-column label="中奖倍率">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].Odds" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="图标个数">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].Count" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="概率">
                    <el-table-column :label="'一轮'">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.BetAreaOptions[scope.$index].Rate[0]" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="'二轮'" v-if="!IsPHAuditEnv()">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.BetAreaOptions[scope.$index].Rate[1]" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table-column>
<!--
                  <el-table-column label="jackpot概率">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].JackPotRate" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="单个区域单个玩家最大下注额度">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].MaxUserMoneyBet" size="mini" />
                    </template>
                  </el-table-column>
-->
                  <el-table-column label="单个区域最大下注额度">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].MaxMoneyBet" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="机器人次区域下注权重">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].RobotBetOdds" size="mini" />
                    </template>
                  </el-table-column>
                  <!--
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delBetAreaOptions(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  -->
                </el-table>
              </fieldset>

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
          <el-tab-pane label="机器人配置">
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人最小玩牌局数:">
                    <el-input v-model.number="item.MinRobotPlayTimes" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人最大玩牌局数">
                    <el-input v-model.number="item.MaxRobotPlayTimes" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人金币下限:">
                    <el-input v-model.number="item.MinRobotMoney" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人金币上限">
                    <el-input v-model.number="item.MaxRobotMoney" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人最大赢牌次数下限:">
                    <el-input v-model.number="item.MinRobotWinTimes" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人最大赢牌次数上限">
                    <el-input v-model.number="item.MaxRobotWinTimes" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人最大输牌次数下限:">
                    <el-input v-model.number="item.MinRobotLoseTimes" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人最大输牌次数上限">
                    <el-input v-model.number="item.MaxRobotLoseTimes" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人下注次数下限:">
                    <el-input v-model.number="item.MinRobotBetTimes" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人下注次数上限">
                    <el-input v-model.number="item.MaxRobotBetTimes" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人数量安全值:">
                    <el-input v-model.number="item.RobotUserNumSafeVal" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="真人人数量安全值比率">
                    <el-input v-model.number="item.RealUserNumSafeVal" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="机器人下注上一把真人下注额的最小倍数:">
                    <el-input v-model.number="item.MinRobotBetLastMemberMultiple" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机器人下注上一把真人下注额的最大倍数">
                    <el-input v-model.number="item.MaxRobotBetLastMemberMultiple" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="启用调控的最小(真实)玩家数量:">
                    <el-input v-model.number="item.MinPlayersEnableSchema" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="上一把没有真人下注时，机器人下注在线人数平均值">
                    <el-input v-model.number="item.RobotAverageBetMoney" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <robot-online-items :items="item.RobotMemberArr" />


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
                  <el-form-item label="解锁jackpot下注">
                    <el-input v-model.number="JackpotCfg.JackpotBetMin" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="每小时局数" v-if="!IsPHAuditEnv()">
                    <el-input v-model.number="JackpotCfg.PerHourRound" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开奖最高开出显示奖池(%)："  v-if="!IsPHAuditEnv()">
                    <el-input v-model.number="JackpotCfg.ShowPoolLimitRate" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="jackpot中奖概率"  v-if="!IsPHAuditEnv()">
                    <el-input v-model.number="JackpotCfg.JackPotRate" size="mini" ><template slot="append">‰</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <!--            <fieldset style="margin-top:10px">-->
            <!--              <legend>jackpot每日限制</legend>-->
            <!--              <jackpot-day-limit :jackpot-rand-awards="RandAwards" />-->
            <!--            </fieldset>-->

            <!--
            <el-col :span="20">
              <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddRandAwards()">添加</el-button>
            </el-col>
            -->
            <fieldset style="margin-top:10px">
              <legend>jackpot配置</legend>
              <el-row>
                <el-table
                  ref="filterTable"
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
                  <el-table-column label="开出的奖池值" prop="PoolVal"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                    </template>
                  </el-table-column>
                  <el-table-column label="发放数量" prop="Value">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AwardRate" style="width: 200px;" size="mini" :required="true">
                        <template v-if="scope.row.AwardType==1" slot="append">%</template>
                        <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="中奖概率" prop="DayLimit"   v-if="IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.JackpotRate" ><template slot="append">‰</template></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="开奖数量概率" prop="RateArr"   v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
                      {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <!--              <el-descriptions class="margin-top" border>-->
              <!--                <el-descriptions-item>-->
              <!--                  <span style="color:red;">以下为显示jackpot奖池增长配置。</span>-->
              <!--                </el-descriptions-item>-->
              <!--              </el-descriptions>-->
            </fieldset>
            <!--
            <el-col :span="20">
              <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddPool()">添加</el-button>
            </el-col>
            -->
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
        <el-form-item label="是否开启">
          <el-radio v-model="item.openTest" label="1" :value="false">否</el-radio>
          <el-radio v-model="item.openTest" label="2" :value="true">是</el-radio>
        </el-form-item>
        <el-form-item label="选择图标组">
          <span v-for="(k,idx) in item.Cars">
            <el-select v-model="item.Cars[idx]" placeholder="请选择" size="mini" style="width: 140px">
            <el-option
              v-for="(k,v) in imgMap"
              :label="v"
              :value="parseInt(v)"
            >
            </el-option>
          </el-select>
          </span>
        </el-form-item>
        <el-form-item label="jackpot">
          <el-select v-model="item.JackpotLogo" placeholder="请选择" size="mini" style="width: 140px">
            <el-option
              v-for="(k,v) in imgMap"
              :label="v"
              :value="parseInt(v)"
            >
            </el-option>
          </el-select>
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
        ReChoiceCfg:{HighLotteryPoolReChoice: 0, LowLotteryPoolReChoice: 0},
        BetMoneyLevel:[],
        BetAreaOptions:[],
      },
      form: {},
      subKey: 'carracing_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      ConversionColorMap: {},
      JackpotCfg: {},
      PoolIncrArr: [],
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      env:process.env.VUE_APP_PROJECT,
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
      dialogFormVisible: false,
      imgMap:{
        0:57, //兰博基尼
        1:74, //法拉利
        2:59, //宝马
        3:76, //奔驰
        4:61, //丰田
        5:65, //三菱
        6:65, //马自达
        7:65, //本田
        8:65, //Gratis "重转"
      },
      nameMap:{
        0:"兰博基尼",
        1:"法拉利",
        2:"宝马",
        3:"奔驰",
        4:"丰田",
        5:"三菱",
        6:"马自达",
        7:"本田",
        8:"Gratis",
      }
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT)
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == '菲1-线上环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
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
      if (that.item.LuckyPachinkoCfg){
        for (const o of that.item.LuckyPachinkoCfg) {
          o.Multiple /= 1000
        }
      }
      for (const o of  that.item.BetAreaOptions) {
        //o.MaxUserMoneyBet /= 1000
        o.MaxMoneyBet /= 1000
        o.Odds /= 1000
      }
      for (const j in that.item.Rate) {
          that.item.Rate[j] /= 1000
      }
      //that.item.JackPotRate /= 1000 //JackPot概率
      that.item.JackpotCfg.JackpotBetMin /=1000
      for (const j in that.item.BetMoneyLevel) {
        that.item.BetMoneyLevel[j].MaxMoneyBet /= 1000
        that.item.BetMoneyLevel[j].MinMoneyBet /= 1000
        const betMoneyList = []
        for (const o of that.item.BetMoneyLevel[j].TableMoney) {
          betMoneyList.push(o / 1000)
        }
        that.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')

      }
      that.item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
      that.item.ReChoiceCfg.HighLotteryPoolReChoice/= 1000
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
            console.log("==========",item)

            if (item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.RandAwards) {
                this.RandAwards = item.JackpotCfg.JackpotRegulation.RandAwards
                for (const o of this.RandAwards) {
                  o.PoolVal /= 1000
                }
              }
            }
            if (!item.BetAreaOptions) {
              item['BetAreaOptions'] = []
              item.BetAreaOptions.push({ Id: 0, MaxMoneyBet: 0, RobotBetOdds: 0 })
            }
            this.JackpotCfg = item.JackpotCfg
            if (item.JackpotCfg.JackpotRegulation) {
              if (item.JackpotCfg.JackpotRegulation.PoolIncrArr) {
                this.PoolIncrArr = item.JackpotCfg.JackpotRegulation.PoolIncrArr
              }
            }
            item.MinRobotMoney /=  1000
            item.MaxRobotMoney /= 1000

            if (!item.Cars){
              item["Cars"] = [0,0]
              item["openTest"] = "1"
              item.JackpotLogo = 0
            }

            item.RobotAverageBetMoney /= 1000
            Object.assign(this.item, item)
            console.log('item', this.item)

            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            if (item.CarracingLevelItem) {
              item['item.CarracingLevelItem'] = []
            }
            this.item = item
            console.log(item)
          }
        }
      })
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))
      console.log("上传====>",ret)

      //下注配置
      let betItem = {}
      if (ret.LuckyPachinkoCfg) {
        for (const o of ret.LuckyPachinkoCfg) {
          o.Multiple *= 1000
        }
      }
      for (const i in this.item.BetMoneyLevel) {
        ret.BetMoneyLevel[i].MaxMoneyBet *= 1000
        ret.BetMoneyLevel[i].MinMoneyBet *= 1000
        betItem = []
        if (this.item.BetMoneyLevel[i].TableMoney instanceof Array) {
          betItem = this.item.BetMoneyLevel[i].TableMoney
        } else {
          for (const oElement of this.item.BetMoneyLevel[i].TableMoney.split(',')) {
            betItem.push(oElement * 1000)
          }
        }
        ret.BetMoneyLevel[i].TableMoney = (betItem)
      }

      //测试
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Cars']
        delete ret['JackpotLogo']
      }

      //赔率配置
      for (const o of ret.BetAreaOptions) {
        //o.MaxUserMoneyBet *= 1000
        o.MaxMoneyBet *= 1000
        o.Odds *= 1000
      }
      for (const i in this.item.Rate) {
          ret.Rate[i] *= 1000
      }
      //jackpot奖池
      ret.JackpotCfg = JSON.parse(JSON.stringify(this.JackpotCfg))
      ret.MinRobotMoney *= 1000
      ret.MaxRobotMoney *= 1000
      ret.JackpotCfg.JackpotBetMin *=1000

      ret.RobotAverageBetMoney *=1000

      if (ret.ReChoiceCfg.LowLotteryPoolReChoice){
        ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      }
      if (ret.ReChoiceCfg.HighLotteryPoolReChoice) {
        ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
      }
      if (ret.JackpotCfg.JackpotRegulation){
        for (const o of ret.JackpotCfg.JackpotRegulation.RandAwards) {
          o.PoolVal = parseInt(o.PoolVal * 1000)
        }
      }
      return ret
    },

    wallpaperInput(val, index) {
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    addOddsList(idx) {
      this.BetOddsList[idx].OddsList.push({})
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    delOddsList(idx, index) {
      if (this.BetOddsList[idx].OddsList.length == 1) {
        this.BetOddsList[idx].OddsList.push({})
      }
      this.BetOddsList[idx].OddsList.splice(index, 1)
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    doAddBetAreaOptions() {
      if (!this.item.BetAreaOptions) {
        this.item['BetAreaOptions'] = []
      }
      let maxId = 0
      for (const o of this.item.BetAreaOptions) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.BetAreaOptions.push({ Id: maxId + 1, Odds: 1, Count: 0, Rate: [0, 0], /*JackPotRate: 10, MaxUserMoneyBet: 0,*/ MaxMoneyBet: 100000, RobotBetOdds: 100 })
    },
    delBetAreaOptions(index) {
      this.item.BetAreaOptions.splice(index, 1)
    },
    doAddRandAwards(){
      this.RandAwards.push({ID:1, JackpotType:1, AwardTypes:1, PoolVal: 0, AwardRate: 0, DayLimit:0, RateArr:[{Num:1, Rate:10}]})
    },
    doAddPool(){
      let maxId = 0
      for (const o of this.PoolIncrArr) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.PoolIncrArr.push({Id:maxId+1,MaxPool:200000000,MinPool:0,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:111000},{EndHour:6,Index:2,StartHour:2,PerHourIncr:20000000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:60000000},{EndHour:17,Index:4,StartHour:9,PerHourIncr:60000000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:60000000}]})
    },
    getCardUrl(car) {
      try {
        return require('@/assets/poker/' + car + '.png')
      } catch (e) {
        console.log(e)
      }
    },
    setData() {
      var postData = this.getPostData();
      this.form.Data = JSON.stringify(postData)
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

    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },

    doAddBetMoneyLevel() {
      console.log("==========> doAddBetMoneyLevel()")
      if (!this.item.BetMoneyLevel) {
        this.item['BetMoneyLevel'] = []
      }

      this.item.BetMoneyLevel.push({ TableMoney: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 10 })
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
    IsPHAuditEnv(){
      return this.env == 'ph_audit'
    },
    savePoolNum() {
      for (var i = 0; i < this.RandAwards.length; i++) {
        if (this.RandAwards.jackpotType == this.RandAwards[i].JackpotType) {
          this.RandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
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
    /*
    cardConversionColor(num, meihua, heitao, hongtao, fangkuai) {
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      if (num == 0 || num === 'NaN') {
        return
      }
      if (Object.keys(this.ConversionColorMap).length === 0) {
        var m = meihua.split('-')
        var hei = heitao.split('-')
        var hong = hongtao.split('-')
        var f = fangkuai.split('-')
        this.ConversionColorMap[m[0]] = m[1]
        this.ConversionColorMap[hei[0]] = hei[1]
        this.ConversionColorMap[hong[0]] = hong[1]
        this.ConversionColorMap[f[0]] = f[1]
      }

      var s = num.toString(16)
      // 补0
      if (s.length === 1) {
        s = '0' + s[0]
      }
      const result = '0x' + this.ConversionColorMap[s[0]] + s[1]
      return parseInt(result)
    },
*/
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    delRowBetMoneyLevel(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    }
  }
}
</script>
