<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-button type="danger" round @click="showSetResult">指定结果</el-button>
    <el-button type="warning" round @click="cleanResult">清除指定结果</el-button>
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-col :span="16" :offset="2">
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="最大人数：" prop="MaxPlayers" :rules="dataRule(true,{type:'n',range:'1-1000'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxPlayers" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="座位数：" prop="SeatsNumber" :rules="dataRule(true,{type:'n',range:'1-10'})">
                <el-col :span="20">
                  <el-input v-model.number="item.SeatsNumber" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="入场限制：" prop="MinMoneyCarry" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MinMoneyCarry" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最大旁观次数：" prop="MaxWatchTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxWatchTimes" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="赢钱转化可提百分比：" prop="WinMoneyTransferRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.WinMoneyTransferRate" size="mini" :required="true" />
                </el-col>
                %
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="结果记录数：" prop="LogListCount" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.LogListCount" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="操作时长：" prop="ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.ActionSeconds" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="服务费：" prop="TaxRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.TaxRate" size="mini" :required="true"><template slot="append">%</template></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :offset="1">
              <el-form-item label="下注金额列表：" :required="true">
                <el-input v-model="betMoneyList" size="mini" :required="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--
            <el-row>
              <el-col :span="11">
                <el-form-item label="调控最少真人数：" prop="MinPlayersEnableSchema" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinPlayersEnableSchema" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            -->
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="奖池抽水比例（该部分包括系统抽水+Jackpot抽取）：" prop="FeeRate" :rules="dataRule(true,{type:'n',range:'0-100'})">
                <el-col :span="20">
                  <el-input v-model.number="item.FeeRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="系统输重新计算1次概率：" prop="RecountRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.RecountRate" size="mini" :required="true" />
                </el-col>‱
              </el-form-item>
            </el-col>
          </el-row>
          <!--
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="小黑屋最大真人数(修改需要重启)：" prop="VUPRoomMaxUsers" :rules="dataRule(true,{type:'n',range:'1-10'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.VUPRoomMaxUsers" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="小黑屋系统输改赢概率：" prop="VUPRecountRate" :rules="dataRule(true,{type:'n',range:'0-10000'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.VUPRecountRate" size="mini" :required="true" />
                  </el-col>‱
                </el-form-item>
              </el-col>
            </el-row>
            -->
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="赢钱榜展示数量：" prop="WinMoneyShowNum">
                <el-col :span="20">
                  <el-input v-model.number="item.WinMoneyShowNum" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="jackpot奖池抽取百分比：" prop="JackpotRate">
                <el-col :span="20">
                  <el-input v-model.number="item.JackpotRate" size="mini" :required="true" />
                </el-col>‰
              </el-form-item>
            </el-col>
          </el-row>
          <fieldset>
            <legend>奖池触发重摇</legend>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="奖池低于某值此时系统输：">
                  <el-input v-model.number="item.LowLotteryPoolReChoice" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="重摇概率：">
                  <el-input v-model.number="item.LowLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
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
                  <el-input v-model.number="item.HighLotteryPoolReChoice" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="重摇概率：">
                  <el-input v-model.number="item.HighLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">奖池大于某值此时系统赢：1.当奖池的钱>X.玩家输钱时有X%的概率重新摇 </span>
              </el-descriptions-item>
            </el-descriptions>
          </fieldset>
          <fieldset style="margin-top:10px">
            <legend>机器人配置</legend>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下配置，在两个时段交叉时，有半小时时间差来完成变化人数。</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-table
              ref="filterTable"
              :data="item.RobotMemberArr"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column type="index" />
              <el-table-column label="时间段" prop="TimeTitle">
                <template slot-scope="scope">
                 [{{scope.row.StartHour}},{{scope.row.EndHour}}]
                </template>
              </el-table-column>
              <el-table-column label="机器人人数下限" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{scope.row.MinRobotNum}}
                </template>
              </el-table-column>
              <el-table-column label="机器人人数上限限" prop="MaxRobotNum">
                <template slot-scope="scope">
                  {{scope.row.MaxRobotNum}}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="normal" icon="el-icon-edit"  size="mini"  @click="showRobotNumForm(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最小人数：" prop="MinRobotNumber" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大人数：" prop="MaxRobotNumber" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人携带金币下限：" prop="MinRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人携带金币上限：" prop="MaxRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大玩牌局数下限：" prop="MinRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大玩牌局数上限：" prop="MaxRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大赢牌次数下限：" prop="MinRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大赢牌次数上限：" prop="MaxRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大输牌次数下限：" prop="MinRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大输牌次数上限：" prop="MaxRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最小下注次数：" prop="MinRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotBetTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大下注次数：" prop="MaxRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotBetTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下为机器人单局下注限制，以上把真人玩家下注额为基准</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人下注最小倍数：" prop="MinRobotBetLastMemberMultiple" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-input style="width:100px" v-model.number="item.MinRobotBetLastMemberMultiple" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人下注最大倍数：" prop="MaxRobotBetLastMemberMultiple" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-input style="width:100px" v-model.number="item.MaxRobotBetLastMemberMultiple" size="mini" :required="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下为上把没真人下注，机器人下注上限为房间在线人数乘于下面配置值</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人平均下注额：" prop="RobotAverageBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-input style="width:100px" v-model.number="item.RobotAverageBetMoney" size="mini" :required="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset style="margin-top:10px">
            <legend>下注区域配置</legend>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.BetOptions"
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
                  prop="Low"
                  label="名称"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Name" disabled size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Odds"
                  label="命中骰子赔率"
                >

                  <el-table-column
                    label="1颗"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Odds[0].Odd" style="width:80px;" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="2颗"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Odds[1].Odd" style="width:80px;" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="3颗"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Odds[2].Odd" style="width:80px;" size="mini" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="MaxMoneyBet"
                  label="下注上限"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MaxMoneyBet" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </fieldset>

          <fieldset style="margin-top:10px">
            <legend>jackpot配置</legend>
            <el-row :gutter="10"  style="margin-top: 30px">
              <el-col :span="24">
                <el-form-item label="命中触发结果：">
                  <span v-for="(hitObj,index) in item.Jackpot.HitColor" :key="index" style="display:inline-block;">
                    {{ getBaoziName(hitObj) }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="本局下注额度(≥)：">
                  <el-input v-model.number="item.Jackpot.BetMoreThan" size="mini" :required="true" style="width:100px"/>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="开奖最高开出显示奖池(%)：">
                  <el-input v-model.number="item.Jackpot.ShowPoolLimitRate" size="mini" :required="true" style="width:100px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-table
                ref="filterTable"
                :data="JackpotRandAwards"
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
                      <el-option v-for="typeItem in JackpotTypes"
                          :key="typeItem.value"
                          :label="typeItem.label"
                          :value="typeItem.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="奖励发放类型" prop="AwardType">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.AwardType">
                      <el-option
                        v-for="typeItem in AwardTypes"
                        :key="typeItem.Type"
                        :label="typeItem.Name"
                        :value="typeItem.Type"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="开出的奖池值" prop="PoolVal">
                  <template slot-scope="scope">
                    >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="发放数量" prop="Value">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Value" style="width: 200px;" size="mini" :required="true">
                      <template v-if="scope.row.AwardType==1" slot="append">%</template>
                      <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.DayLimit" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="开奖数量概率" prop="RateArr">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini"  @click="showPoolNumDialog(scope.row)"></el-button>
                    {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下为显示jackpot奖池增长配置。</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row :gutter="10" style="marigin-top:10px">
              <el-col :span="11">
                <el-form-item label="每小时局数：">
                  <el-input v-model.number="item.Jackpot.PerHourRound" size="mini" :required="true" style="width:100px"/>
                </el-form-item>
              </el-col>
              <el-col :span="11">
              </el-col>
            </el-row>
            <el-table
              ref="filterTable"
              :data="item.Jackpot.PoolIncrArr"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column label="Id" prop="Id"></el-table-column>
              <el-table-column label="奖池范围">
                <template slot-scope="scope">
                  {{ getJackpotPoolTitle(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="[0,2)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 0, 1) }}
                </template>
              </el-table-column>
              <el-table-column label="[2,7)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 2, 6) }}
                </template>
              </el-table-column>
              <el-table-column label="[7,9)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 7, 8) }}
                </template>
              </el-table-column>
              <el-table-column label="[9,18)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 9, 17) }}
                </template>
              </el-table-column>
              <el-table-column label="[18,24)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 18, 23) }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="normal" icon="el-icon-edit"  size="mini"  @click="showIncrJackpotForm(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>

        </el-col>

        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 【dialog】指定结果 -->
    <el-dialog
      title="指定结果"
      :modal="false"
      :visible.sync="showSetResultPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="resultForm" label-width="120px" size="small">
        <el-form-item label="结果：">
          <el-select v-model="resultForm.one" style="width:120px;">
            <el-option
              v-for="typeItem in ColorItems"
              :key="typeItem.Type"
              :label="typeItem.Name"
              :value="typeItem.Id"
            />
          </el-select>
          <el-select v-model="resultForm.two" style="width:120px;">
            <el-option
              v-for="typeItem in ColorItems"
              :key="typeItem.Type"
              :label="typeItem.Name"
              :value="typeItem.Id"
            />
          </el-select>
          <el-select v-model="resultForm.three" style="width:120px;">
            <el-option
              v-for="typeItem in ColorItems"
              :key="typeItem.Type"
              :label="typeItem.Name"
              :value="typeItem.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="setResult">设定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 【dialog】jackpot开出奖励 -->
    <el-dialog
      :title="poolNumChange.title"
      :modal="false"
      :visible.sync="poolNumChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini"  @click="addPoolNum()">添加</el-button>
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
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="开出概率(%)" prop="Rate">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" style="width: 100px;" size="mini" :required="true"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini"  @click="removePoolNum(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 【dialog】编辑机器人人数 -->
    <el-dialog
      title="编辑机器人人数"
      :modal="false"
      :visible.sync="robotDialogForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="robotDialogForm.data" label-width="200px">
        <el-form-item label="序号：">
          {{ robotDialogForm.data.Index }}
        </el-form-item>
        <el-form-item label="开始时段：">
          <el-input v-model.number="robotDialogForm.data.StartHour" disable style="width: 100px;" size="mini" :required="true"></el-input>
        </el-form-item>
        <el-form-item label="结束时段：">
          <el-input v-model.number="robotDialogForm.data.EndHour" disable style="width: 100px;" size="mini" :required="true"></el-input>
        </el-form-item>
        <el-form-item label="机器人最小人数：">
          <el-input v-model.number="robotDialogForm.data.MinRobotNum" style="width: 100px;" size="mini" :required="true"></el-input>
        </el-form-item>
        <el-form-item label="机器人最大人数：">
          <el-input v-model.number="robotDialogForm.data.MaxRobotNum" style="width: 100px;" size="mini" :required="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini"  @click="saveRobotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 【dialog】Jackpot奖池增长 -->
    <el-dialog
      :title="incrJackpotForm.title"
      :modal="false"
      :visible.sync="incrJackpotForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm.data">
        <el-form-item>
          <el-table
            ref="filterTable"
            :data="incrJackpotForm.data"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column type="index" />
            <el-table-column label="时间段">
              <template slot-scope="scope">
                [{{scope.row.StartHour}},{{scope.row.EndHour+1}})点
              </template>
            </el-table-column>
            <el-table-column label="每小时增长">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PerHourIncr" style="width: 100px;" size="mini" :required="true"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini"  @click="saveIncrJackpotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
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
        MaxPlayers: 400,
        SeatsNumber: 4,
        BetMoneyList: [1, 2],
        BetOptions: [{ Name: 'ab', Odds: [{ 'Number': 1, 'Odd': 2 }, { 'Number': 2, 'Odd': 3 }, { 'Number': 3, 'Odd': 4 }], MaxMoneyBet: 2000 }],
        MinMoneyCarry: 1000,
        LogListCount: 100,
        TaxRate: 0,
        ActionSeconds: 15,
        MaxWatchTimes: 0,
        WinMoneyTransferRate: 20,
        WinMoneyShowNum: 0,
        MinRobotNumber: 0, // 机器人最小人数
        MaxRobotNumber: 0, // 机器人最大人数
        RobotMemberArr: [],
        MinRobotBetLastMemberMultiple: 0, //机器人下注最小倍数
        MaxRobotBetLastMemberMultiple: 0, //机器人下注最大倍数
        RobotAverageBetMoney: 0, //机器人平均下注额
        MinRobotPlayTimes: 0, // 机器人最小玩牌局数
        MaxRobotPlayTimes: 0, // 机器人最大玩牌局数
        MinRobotMoney: 0, // 机器人金币下限
        MaxRobotMoney: 0, // 机器人金币上限
        MinRobotWinTimes: 0, // 机器人最大赢牌次数下限
        MaxRobotWinTimes: 0, // 机器人最大赢牌次数上限
        MinRobotLoseTimes: 0, // 机器人最大输牌次数下限
        MaxRobotLoseTimes: 0, // 机器人最大输牌次数上限
        MinRobotBetTimes: 0, // 机器人最小下注次数
        MaxRobotBetTimes: 0, // 机器人最大下注次数
        MinPlayersEnableSchema: 10, // 最低调控玩家数
        FeeRate: 0,
        VUPRoomMaxUsers: 1, // 小黑屋最大真人数
        VUPRecountRate: 0, // 小黑屋系统输改赢概率（万分之一）
        RecountRate: 0,
        BetAmount: [], // 下注金额列表配置
        JackpotRate: 0,
        Jackpot: {
          BetMoreThan: 0,
          ShowPoolLimitRate: 0,
          HitColor: [
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3],
            [4, 4, 4],
            [5, 5, 5],
            [6, 6, 6]
          ],
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit':0, 'RateArr': [] }
          ],
          JackpotRate: 0,
        },
        RobotMemberArr: [],
        LowLotteryPoolReChoice: 0,
        LowLotteryPoolReChoiceRate: 0,
        HighLotteryPoolReChoice: 0,
        HighLotteryPoolReChoiceRate: 0
      },
      JackpotRandAwards: [],
      ColorItems: [
        { 'Id': 0, 'Name': '未知', 'Key': 'unknow' },
        { 'Id': 1, 'Name': '黄', 'Key': 'yellow' },
        { 'Id': 2, 'Name': '白', 'Key': 'white' },
        { 'Id': 3, 'Name': '紫', 'Key': 'purple' },
        { 'Id': 4, 'Name': '蓝', 'Key': 'blue' },
        { 'Id': 5, 'Name': '绿', 'Key': 'green' },
        { 'Id': 6, 'Name': '红', 'Key': 'red' }
      ],
      JackpotTypes: [
          {"label": "一等奖", "value":1},
          {"label": "二等奖", "value":2},
          {"label": "三等奖", "value":3},
          {"label": "阳光普照奖", "value":4},
        ], 
      AwardTypes: [
        { 'Type': 1, 'Name': '奖池百分比' },
        { 'Type': 2, 'Name': '下注额倍数' }
      ],
      testRand: {
        visible: false,
        times: 0,
        result: []
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0,
      },
      robotDialogForm: {
        visible: false,
        data: {}
      },
      incrJackpotForm: {
        id: 0,
        title: "",
        visible: false,
        data: {}
      },
      betMoneyList: '1,10',
      form: {},
      subKey: 'gameColor',
      libShow: $libShow,
      AttrNames: {
        'Data.MaxPlayers': '最大人数',
        'Data.SeatsNumber': '座位数',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxWatchTimes': '最大旁观次数',
        'Data.LogListCount': '结果记录数',
        'Data.ActionSeconds': '操作时长',
        'Data.TaxRate': '抽水百分比',
        'Data.WinMoneyTransferRate': '赢钱转化可提百分比',
        'Data.BetOptions': '下注区域配置',
        'Data.MinRobotNumber': '机器人最小人数',
        'Data.MaxRobotNumber': '机器人最大人数',
        'Data.MinRobotPlayTimes': '机器人最小玩牌局数',
        'Data.MaxRobotPlayTimes': '机器人最大玩牌局数',
        'Data.MinRobotMoney': '机器人金币下限',
        'Data.MaxRobotMoney': '机器人金币上限',
        'Data.MinRobotWinTimes': '机器人最大赢牌次数下限',
        'Data.MaxRobotWinTimes': '机器人最大赢牌次数上限',
        'Data.MinRobotLoseTimes': '机器人最大输牌次数下限',
        'Data.MaxRobotLoseTimes': '机器人最大输牌次数上限',
        'Data.MinRobotBetTimes': '机器人最小下注次数',
        'Data.MaxRobotBetTimes': '机器人最大下注次数',
        'Data.MinPlayersEnableSchema': '调控最小真人数',
        'Data.FeeRate': '抽水额度',
        'Data.RecountRate': '系统输重新计算1次概率',
        'Data.VUPRoomMaxUsers': '小黑屋最大真人数',
        'Data.VUPRecountRate': '小黑屋系统输改赢万分比',
        'Data.BetAmount': '下注金额配置',
        'Data.Jackpot': 'Jackpot配置',
        'Data.WinMoneyShowNum': '赢钱榜展示数量',
        'Data.JackpotRate': 'jackpot抽水',
        'Data.LowLotteryPoolReChoice': '奖池低于某值此时系统输',
        'Data.HighLotteryPoolReChoice': '奖池大于某值此时系统赢',
        'Data.LowLotteryPoolReChoiceRate': '奖池低于某值此时系统输，重新摇概率',
        'Data.HighLotteryPoolReChoiceRate': '奖池大于某值此时系统赢，重新摇概率',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      showSetResultPage: false,
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      }
    }
  },
  created() {
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
      this.item.MinMoneyCarry /= 1000
      this.item.MinRobotMoney /= 1000
      this.item.MaxRobotMoney /= 1000
      this.item.RobotAverageBetMoney /= 1000
      if (!this.item.hasOwnProperty('LowLotteryPoolReChoice')) {
        this.item.LowLotteryPoolReChoice = 0
      }
      if (!this.item.hasOwnProperty('HighLotteryPoolReChoice')) {
        this.item.HighLotteryPoolReChoice = 0
      }
      this.item.LowLotteryPoolReChoice /= 1000
      this.item.HighLotteryPoolReChoice /= 1000
      this.item.Jackpot.BetMoreThan /= 1000
      for (const i in this.item.BetMoneyList) {
        this.item.BetMoneyList[i] /= 1000
      }
      for (const j in this.item.BetOptions) {
        this.item.BetOptions[j].MaxMoneyBet /= 1000
      }
      for (const k in this.item.Jackpot.RandAwards) {
        this.item.Jackpot.RandAwards[k].PoolVal /= 1000
      }
      console.log('this.item:', this.item)
    },
    getBaoziName(colorId) {
      const showArr = []
      for (let i = 0; i < 3; i++) {
        var name = this.getColorName(colorId)
        showArr.push(name)
      }
      return '【' + showArr.join('-') + '】'
    },
    getColorName(id) {
      let name = ''
      for (let i = 0; i < this.ColorItems.length; i++) {
        if (this.ColorItems[i].Id == id) {
          name = this.ColorItems[i].Name
          break
        }
      }
      return name
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      ret.MinMoneyCarry *= 1000
      ret.MinRobotMoney *= 1000
      ret.MaxRobotMoney *= 1000
      ret.LowLotteryPoolReChoice *= 1000
      ret.HighLotteryPoolReChoice *= 1000
      ret.RobotAverageBetMoney *= 1000
      const jackpotInfo = {}
      Object.assign(jackpotInfo, this.item.Jackpot)
      jackpotInfo.BetMoreThan *= 1000
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000
      }
      ret.BetOptions = []
      for (const o in this.item.BetOptions) {
        const obj = {}
        Object.assign(obj, this.item.BetOptions[o])
        obj.MaxMoneyBet *= 1000
        ret.BetOptions.push(obj)
      }
      jackpotInfo.RandAwards = []
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        Object.assign(raObj, this.JackpotRandAwards[o])
        // if (raObj.AwardType == 2) {
        raObj.PoolVal *= 1000
        // }
        jackpotInfo.RandAwards.push(raObj)
      }
      ret.Jackpot = jackpotInfo
      return ret
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
            this.transMoneyForShow()
            this.betMoneyList = this.item.BetMoneyList ? this.item.BetMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.JackpotRandAwards = this.item.Jackpot.RandAwards
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      // console.log(this.item)
      // console.log(this.item.Jackpot.RandAwards.length)
      // for (let i=0;i<this.item.Jackpot.RandAwards.length;i++) {
      //     console.log(this.item.Jackpot.RandAwards[i])
      // }
      if (this.item.Jackpot.RandAwards.length == 0) {
        this.item.Jackpot.RandAwards = this.item.JackpotRandAwards
      }
      // console.log(this.item)
      if (!ValidateVueItem(this.$refs['item'])) return false
      const items = this.betMoneyList.split(',')
      this.item.BetMoneyList = []
      for (const o in items) {
        this.item.BetMoneyList.push(parseInt(items[o]))
      }
      for (const o in this.item.BetOptions) {
        for (const oi in o.Odds) {
          this.item.BetOptions[o].Odds[oi].Odd = parseFloat(o[oi].Odd)
        }
      }

      if (this.item.MaxRobotNumber < this.item.MinRobotNumber) {
        Message.error('“机器人最大人数”不能小于“机器人最小人数”')
        return
      } else if (this.item.MaxRobotMoney < this.item.MinRobotMoney) {
        Message.error('“机器人携带金币上限”不能小于“机器人携带金币下限”')
        return
      } else if (this.item.MaxRobotPlayTimes < this.item.MinRobotPlayTimes) {
        Message.error('“机器人最大玩牌局数上限”不能小于“机器人最大玩牌局数下限”')
        return
      } else if (this.item.MaxRobotWinTimes < this.item.MinRobotWinTimes) {
        Message.error('“机器人最大赢牌次数上限”不能小于“机器人最大赢牌次数下限”')
        return
      } else if (this.item.MaxRobotLoseTimes < this.item.MinRobotLoseTimes) {
        Message.error('“机器人最大输牌次数上限”不能小于“机器人最大输牌次数下限”')
        return
      } else if (this.item.MaxRobotBetTimes < this.item.MinRobotBetTimes) {
        Message.error('“机器人最大下注次数”不能小于“机器人最小下注次数”')
        return
      } else if (this.item.MinRobotBetTimes < 1 || this.item.MaxRobotBetTimes > 15) {
        Message.error('“机器人最小下注次数”不能小于1，“机器人最大下注次数”不能大于15')
        return
      }

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
    showTestRand() {
      this.testRand.visible = true
    },
    goRand() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/test/random',
          Gid: 18,
          Times: this.testRand.times
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.testRand.result = response.Data.RandRet
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    },
    showSetResult() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/color/game/result'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.resultForm.one = response.Data[0]
              this.resultForm.two = response.Data[1]
              this.resultForm.three = response.Data[2]
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
      this.showSetResultPage = true
    },
    setResult() {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/game/color/game/result',
          One: this.resultForm.one,
          Two: this.resultForm.two,
          Three: this.resultForm.three
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.$message.success(response.Data)
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    },
    cleanResult() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/clean/color/game/result'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.$message.success(response.Data)
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    },
    showOpenPoolRate(jpType, data) {
      if (jpType == 4) {
        return "不限制"
      } else {
        let showStr = "";
        if (data.length > 0) {
          for (var i=0;i<data.length;i++) {
            showStr += data[i].Num+"个("+data[i].Rate+"%);"
          }
        }
        return showStr
      }
    },
    showPoolNumDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      let jpTypeName = ""
      for (var i=0;i<this.JackpotTypes.length;i++) {
        if (this.JackpotTypes[i].value==data.JackpotType) {
          jpTypeName = this.JackpotTypes[i].label
          break
        }
      }
      this.poolNumChange.title = jpTypeName+"(开奖数量概率)"
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    addPoolNum() {
      let maxId = 0
      for (var i=0;i<this.poolNumChange.data.length;i++) {
        if (this.poolNumChange.data[i].Id > maxId) {
          maxId = this.poolNumChange.data[i].Id
        }
      }
      maxId++
      this.poolNumChange.data.push({"Id":maxId, "Num":0, "Rate":0})
    },
    removePoolNum(id) {
      for (var i=0;i<this.poolNumChange.data.length;i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    savePoolNum() {
      for (var i=0;i<this.JackpotRandAwards.length;i++) {
        if (this.poolNumChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          this.JackpotRandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
    },
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    saveRobotDialog() {
      for (var i=0;i<this.item.RobotMemberArr.length;i++) {
        if (this.item.RobotMemberArr[i].Index == this.robotDialogForm.data.Index) {
          this.item.RobotMemberArr[i] = this.robotDialogForm.data
          break
        }
      }
      this.robotDialogForm.visible = false
    },
    //展示jackpot奖池增长标题
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool/10000000)+"万以上每小时增长"
      } else {
        return Math.floor(row.MinPool/10000000)+"~"+Math.floor(row.MaxPool/10000000)+"万每小时增长"
      }
    },
    //展示jackpot每小时增长值
    getJackpotIncrShow(row, startHour, endHour) {
      let showNum = 0
      for (let i=0; i<row.TimeArr.length;i++) {
        if (row.TimeArr[i].StartHour == startHour && row.TimeArr[i].EndHour == endHour) {
          showNum = row.TimeArr[i].PerHourIncr/1000
          break
        }
      }
      return showNum.toLocaleString()
    },
    showIncrJackpotForm(data) {
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = data.TimeArr
      for (var i=0;i<this.incrJackpotForm.data.length;i++) {
        this.incrJackpotForm.data[i].PerHourIncr /= 1000
      }
      this.incrJackpotForm.title = "编辑"+this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    },
    saveIncrJackpotDialog() {
      for (var i=0;i<this.item.Jackpot.PoolIncrArr.length;i++) {
        if (this.item.Jackpot.PoolIncrArr[i].Id == this.incrJackpotForm.id) {
          this.item.Jackpot.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (var j=0; j<this.item.Jackpot.PoolIncrArr[i].TimeArr.length;j++) {
            this.item.Jackpot.PoolIncrArr[i].TimeArr[j].PerHourIncr *=1000
          }
          break
        }
      }
      this.incrJackpotForm.visible = false
    }
  }
}
</script>
