<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-position="left">
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <el-col :span="7" :offset="1">
              <el-form-item label="下注时长:">
                <el-input v-model.number="item.BetTime" :required="true">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>

            <!--            <el-col :span="7" :offset="3">-->
            <!--              <el-form-item label="用户长时间未下注提示:">-->
            <!--                <el-input v-model.number="item.NoticeTime" :required="true" @input="wallpaperInput2">-->
            <!--                  <template slot="append">秒</template>-->
            <!--                </el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="7" :offset="1">
              <el-form-item label="RTP:">
                <el-input v-model.number="item.RPT" :required="true">
                  <template slot="append">‱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="7" :offset="3">-->
            <!--              <el-form-item label="最小携带金额:">-->
            <!--                <el-input v-model.number="item.MinMoneyCarry" :required="true" />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
          </el-tab-pane>
          <el-tab-pane label="玩法配置">
            <el-col :span="16" :offset="3">
              <fieldset style="margin-top:10px">
                <legend>下注配置</legend>
                <el-row>
                  <el-table
                    ref="filterTable"
                    :data="item.BetLevels"
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
                      label="下注列表"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.CanBet" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="primary"
                          @click="doAdd"
                        >添加</el-button>
                        <el-button type="danger" size="mini" @click="delRow(scope.$index)">删除</el-button>
                      </template>

                    </el-table-column>
                  </el-table>
                </el-row>
              </fieldset>

              <fieldset style="margin-top:10px">
                <legend>下注区域配置</legend>

                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;"> 说明:双色区域只有中或者不中，所以放在一颗里面 </span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row>
                  <el-table
                    ref="filterTable"
                    :data="item.BetAreas"
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
                          <el-input v-model="scope.row.Odds[0].Odd" style="width:120px;" size="mini">
                            <template slot="append">X</template>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="2颗"
                      >
                        <template slot-scope="scope">
                          <el-input v-if="scope.row.Odds[1]!==undefined" v-model="scope.row.Odds[1].Odd" style="width:120px;" size="mini">
                            <template slot="append">X</template>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="3颗"
                      >
                        <template slot-scope="scope">
                          <el-input v-if="scope.row.Odds[2]!==undefined" v-model="scope.row.Odds[2].Odd" style="width:120px;" size="mini">
                            <template slot="append">X</template>
                          </el-input>
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
                    <el-table-column
                      prop="MaxMoneyBet"
                      label="机器人下注概率"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.RobotBetRate" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;"> 说明:超级骰子的配置 </span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row>
                  <el-col :span="7" :offset="0">
                    <el-form-item label="超级骰子命中的概率">
                      <el-input v-model.number="item.SuperDice.Probability" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-table
                    ref="filterTable"
                    :data="item.SuperDice.Odds"
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
                      prop="Odd"
                      label="赔率"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Odd" style="width: 150px;" size="mini" :required="true">
                          <template slot="append">X</template>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="Weight"
                      label="权重"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Weight" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Jackpot配置">
            <el-col :span="22" :offset="1">
              <fieldset style="margin-top:10px">
                <legend>Jackpot 奖励配置</legend>
                <el-col :span="7" :offset="0">
                  <el-form-item label="解锁Jackpot最小下注:">
                    <el-input v-model="item.Jackpot.BetMin" :required="true" />
                  </el-form-item>
                </el-col>
                <el-alert
                  type="success"
                  description="命中触发结果：【黄-黄-黄】【白-白-白】【紫-紫-紫】【蓝-蓝-蓝】【绿-绿-绿】【红-红-红】 "
                />

                <el-table
                  :data="item.Jackpot.AwardItems"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="级别"
                    width="180"
                  >
                    <template slot-scope="scope">
                      {{ JackpotTypeCfg[scope.row.JackpotType] }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="奖励倍数"
                    width="380"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AwardRate">
                        <template slot="append">倍下注</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="奖励权重"
                    width="380"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AwardWeight" />
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="机器人配置">
            <el-col :span="16" :offset="3">
              <fieldset style="margin-top:10px">
                <legend>机器人配置</legend>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人携带金币下限：" prop="RobotCfg.MinRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人携带金币上限：" prop="RobotCfg.MaxRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人最小玩牌局数：" prop="RobotCfg.MinRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotPlayTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人最大玩牌局数：" prop="RobotCfg.MaxRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotPlayTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人最小下注次数：" prop="RobotCfg.MinRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotBetTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人最大下注次数：" prop="RobotCfg.MaxRobotBetTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotBetTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人下限：" prop="RobotCfg.MinTotalUserCount" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinTotalUserCount" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人上限：" prop="RobotCfg.MaxTotalUserCount" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxTotalUserCount" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人最小下注区域数：" prop="RobotCfg.MinRobotBetAreas" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotBetAreas" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人最大下注区域数：" prop="RobotCfg.MaxRobotBetAreas" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotBetAreas" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人最小下注次数偏移范围：" prop="RobotCfg.MinRobotBetTimesOffset" :rules="dataRule(true,{type:'n',range:'-10'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotBetTimesOffset" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人最大下注次数偏移范围：" prop="RobotCfg.MaxRobotBetTimesOffset" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotBetTimesOffset" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人最小下注区域数偏移范围：" prop="RobotCfg.MinRobotBetAreasOffset" :rules="dataRule(true,{type:'n',range:'-10'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotBetAreasOffset" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人最大下注区域数偏移范围：" prop="RobotCfg.MaxRobotBetAreasOffset" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotBetAreasOffset" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人初始化下注金额最小值：" prop="RobotCfg.MinRobotInitBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotInitBetMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人初始化下注金额最大值：" prop="RobotCfg.MaxRobotInitBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotInitBetMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="重置周期最小局数：" prop="RobotCfg.MinResetCycle" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinResetCycle" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="重置周期最大局数：" prop="RobotCfg.MaxResetCycle" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxResetCycle" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>


<!--                MinRankRobotMoney: 50000, // 榜单机器人金币下限-->
<!--                MaxRankRobotMoney: 35000000, // 榜单机器人金币上限-->
<!--                RankRobotRadio: 50, // 榜单机器人比例-->
<!--                MinRankRobotInitBetMoney: 0, // 机器人初始下注最小筹码-->
<!--                MaxRankRobotInitBetMoney: 0, // 机器人初始下注最大筹码-->
<!--                MinRankRobotStart: 1000, // 榜单机器人开始下注时间点-->
<!--                MaxRankRobotStart: 5000, // 榜单机器人开始下注时间点上限-->
<!--                MinRankRobotTime: 300, // 榜单机器人开始下注时间间隔点-->
<!--                MaxRankRobotTime: 700, // 榜单机器人开始下注时间间隔点上限-->
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="榜单机器人金币下限：" prop="RobotCfg.MinRankRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRankRobotMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="榜单机器人金币上限：" prop="RobotCfg.MaxRankRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRankRobotMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="榜单机器人初始下注最小筹码：" prop="RobotCfg.MinRankRobotInitBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRankRobotInitBetMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="榜单机器人初始下注最大筹码：" prop="RobotCfg.MaxRankRobotInitBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRankRobotInitBetMoney" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="榜单机器人开始下注时间点下限（毫秒）：" prop="RobotCfg.MinRankRobotStart" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRankRobotStart" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="榜单机器人开始下注时间点上限（毫秒）：" prop="RobotCfg.MaxRankRobotStart" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRankRobotStart" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="榜单机器人开始下注时间间隔点下限（毫秒）：" prop="RobotCfg.MinRankRobotTime" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRankRobotTime" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="榜单机器人开始下注时间间隔点上限（毫秒）：" prop="RobotCfg.MaxRankRobotTime" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRankRobotTime" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人下注间隔（毫秒）：" prop="RobotCfg.RobotActionTime" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.RobotActionTime" size="mini" :required="true" @input="logChange"/>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="榜单机器人比例：" prop="RobotCfg.RankRobotRadio" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.RankRobotRadio" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
              <fieldset style="margin-top:10px">
                <legend>机器人聊天配置</legend>
                <el-alert
                  type="success"
                  description="机器人在发送间隔时间范围内按一定概率触发，总人数不超过最多发送人数"
                />
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="发送间隔时间范围(秒)：">
                      <el-col :span="10">
                        <el-input v-model.number="item.ChatRobotSendIntervalMin" size="mini" />
                      </el-col>
                      <el-col :span="2">
                        到
                      </el-col>
                      <el-col :span="10">
                        <el-input v-model.number="item.ChatRobotSendIntervalMax" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发送概率(%)：" prop="ChatRobotSendRate" :rules="dataRule(false,{type:'n',range:'0'})">
                      <el-col>
                        <el-input v-model.number="item.ChatRobotSendRate" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最多发送人数：" prop="ChatRobotSendMaxNum" :rules="dataRule(false,{type:'n',range:'0'})">
                      <el-col>
                        <el-input v-model.number="item.ChatRobotSendMaxNum" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-alert
                  type="success"
                  description="机器人在回复间隔时间范围内按一定概率触发，总人数不超过最多回复人数"
                />
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="回复间隔时间范围(秒)：">
                      <el-col :span="10">
                        <el-input v-model.number="item.ChatRobotReplyIntervalMin" size="mini" />
                      </el-col>
                      <el-col :span="2">
                        到
                      </el-col>
                      <el-col :span="10">
                        <el-input v-model.number="item.ChatRobotReplyIntervalMax" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="回复概率(%)：" prop="ChatRobotReplyRate" :rules="dataRule(false,{type:'n',range:'0'})">
                      <el-col>
                        <el-input v-model.number="item.ChatRobotReplyRate" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最多回复人数：" prop="ChatRobotReplyMaxNum" :rules="dataRule(false,{type:'n',range:'0'})">
                      <el-col>
                        <el-input v-model.number="item.ChatRobotReplyMaxNum" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

              </fieldset>
              <fieldset style="margin-top:10px">
                <legend>总的机器人下注</legend>
                <el-alert
                  type="success"
                  description="在一局游戏内机器人下注相关配置"
                />
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="下注机器人数的上限：">
                      <el-col :span="10">
                        <el-input v-model.number="item.RobotCfg.BetRobotMaxCount" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="机器人最大下注区域数：">
                      <el-col :span="8">
                        <el-input v-model.number="item.RobotCfg.BetRobotMaxBetAreaCount" size="mini" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="配牌">
            <el-alert
              type="success"
              description="如果修改了超级骰子的倍率，先发布配置，刷新页面后再配牌"
            />
            <el-form :model="resultForm" label-width="140px" size="small">
              <el-form-item label="结果：">
                <el-select v-model="resultForm.one" style="width:120px;">
                  <el-option
                    v-for="typeItem in ColorOption"
                    :key="typeItem.Type"
                    :label="typeItem.Name"
                    :value="typeItem.Id"
                  />
                </el-select>
                <el-select v-model="resultForm.two" style="width:120px;">
                  <el-option
                    v-for="typeItem in ColorOption"
                    :key="typeItem.Type"
                    :label="typeItem.Name"
                    :value="typeItem.Id"
                  />
                </el-select>
                <el-select v-model="resultForm.three" style="width:120px;">
                  <el-option
                    v-for="typeItem in ColorOption"
                    :key="typeItem.Type"
                    :label="typeItem.Name"
                    :value="typeItem.Id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="超级骰子的位置：">
                <el-select v-model="resultForm.superDiceIndex" style="width:120px;">
                  <el-option
                    v-for="typeItem in DiceIndexOption"
                    :key="typeItem.Id"
                    :label="typeItem.Name"
                    :value="typeItem.Id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="超级骰子的赔率：">
                <!--                <el-input v-model.number="resultForm.superDiceOdd" style="width: 150px;" size="mini">-->
                <!--                  <template slot="append">X</template>-->
                <!--                </el-input>-->
                <el-select v-model="resultForm.superDiceOdd" style="width:120px;">
                  <el-option
                    v-for="typeItem in SuperDiceOddOption "
                    :key="typeItem.value"
                    :label="typeItem.value"
                    :value="typeItem.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" round @click="setResult">设定</el-button>
                <el-button type="warning" round @click="cleanResult">清除指定结果</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <el-col style="margin-top:16px;" :offset="10" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

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
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '阳光普照奖'
      },
      resultForm: {
        one: 1,
        two: 2,
        three: 3,
        superDiceIndex: 0,
        superDiceOdd: 0
      },
      ColorOption: [
        { 'Id': 1, 'Name': '黄', 'Key': 'yellow' },
        { 'Id': 2, 'Name': '白', 'Key': 'white' },
        { 'Id': 3, 'Name': '紫', 'Key': 'purple' },
        { 'Id': 4, 'Name': '蓝', 'Key': 'blue' },
        { 'Id': 5, 'Name': '绿', 'Key': 'green' },
        { 'Id': 6, 'Name': '红', 'Key': 'red' }
      ],
      DiceIndexOption: [
        { 'Id': -1, 'Name': '不使用' },
        { 'Id': 0, 'Name': '第一个骰子' },
        { 'Id': 1, 'Name': '第二个骰子' },
        { 'Id': 2, 'Name': '第三个骰子' }
      ],
      SuperDiceOddOption: [
      ],
      item: {
        RPT: 950, // 产品给出的RPT
        BetTime: 13,
        NoticeTime: 300,
        MinMoneyCarry: 10000,
        BetAreas: [
          { Id: 1, Name: 'Yellow', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 2, Name: 'White', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 3, Name: 'Purple', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 4, Name: 'Blue', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 5, Name: 'Green', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 6, Name: 'Red', Odds: [{ Number: 2, Odd: 2000 }, { Number: 2, Odd: 3000 }, { Number: 3, Odd: 4000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 7, Name: 'YellowWhite', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 8, Name: 'WhitePurple', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 9, Name: 'PurpleGreen', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 10, Name: 'GreenRed', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 11, Name: 'RedBlue', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 12, Name: 'BlueYellow', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 },
          { Id: 13, Name: 'RedWhite', Odds: [{ Number: 2, Odd: 2000 }], MaxMoneyBet: 2000, RobotBetRate: 10 }
        ],
        SuperDice: {
          Probability: 50,
          Odds: [
            { Weight: 1, Odd: 1000 },
            { Weight: 1, Odd: 2000 },
            { Weight: 1, Odd: 3000 },
            { Weight: 1, Odd: 4000 }
          ]
        },
        Jackpot: {
          BetMin: 30000,
          AwardItems: [
            { JackpotType: 1, AwardRate: 50, AwardWeight: 100 },
            { JackpotType: 2, AwardRate: 15, AwardWeight: 100 },
            { JackpotType: 3, AwardRate: 5, AwardWeight: 100 },
            { JackpotType: 4, AwardRate: 3, AwardWeight: 100 }
          ]
        },
        RobotCfg: {
          IsOpen: false,
          MinRobotMoney: 50000, // 机器人金币下限
          MaxRobotMoney: 35000000, // 机器人金币上限
          MinRobotPlayTimes: 30, // 机器人最小玩牌局数
          MaxRobotPlayTimes: 80, // 机器人最大玩牌局数
          MinRobotBetTimes: 5, // 机器人最小下注次数
          MaxRobotBetTimes: 8, // 机器人最大下注次数
          MinRobotBetMoney: 50000, // 机器人下注最小筹码
          MaxRobotBetMoney: 100000, // 机器人下注最大筹码
          MinRealUserCount: 0, // 在线人数下限
          MaxRealUserCount: 50, // 在线人数上限
          MinTotalUserCount: 50, // 总人数下限
          MaxTotalUserCount: 200, // 总人数上限
          BetRobotMaxCount: 0,
          BetRobotMaxBetAreaCount: 0,
          MinRobotBetAreas: 0, // 机器人最小下注区域数
          MaxRobotBetAreas: 0, // 机器人最大下注区域数
          MinRobotBetTimesOffset: 0, // 机器人最小下注次数偏移
          MaxRobotBetTimesOffset: 0, // 机器人最大下注次数偏移
          MinRobotBetAreasOffset: 0, // 机器人最小下注区域数偏移
          MaxRobotBetAreasOffset: 0, // 机器人最大下注区域数偏移
          MinRobotInitBetMoney: 0, // 机器人初始下注最小筹码
          MaxRobotInitBetMoney: 0, // 机器人初始下注最大筹码
          MinResetCycle: 0, // 机器人重置周期
          MaxResetCycle: 0, // 机器人重置周期
          RobotActionTime: 200, // 机器人下注时间间隔

          MinRankRobotMoney: 50000, // 榜单机器人金币下限
          MaxRankRobotMoney: 35000000, // 榜单机器人金币上限
          RankRobotRadio: 50, // 榜单机器人比例
          MinRankRobotInitBetMoney: 0, // 机器人初始下注最小筹码
          MaxRankRobotInitBetMoney: 0, // 机器人初始下注最大筹码
          MinRankRobotStart: 1000, // 榜单机器人开始下注时间点
          MaxRankRobotStart: 5000, // 榜单机器人开始下注时间点上限
          MinRankRobotTime: 300, // 榜单机器人开始下注时间间隔点
          MaxRankRobotTime: 700, // 榜单机器人开始下注时间间隔点上限
        },
        BetLevels: [
          {
            CanBet: [
              10000,
              20000,
              30000,
              50000,
              100000,
              200000
            ],
            MaxMoneyBet: 200000,
            MinMoneyBet: 10000
          },
          {
            CanBet: [
              20000,
              30000,
              50000,
              100000,
              200000,
              400000
            ],
            MaxMoneyBet: 400000,
            MinMoneyBet: 20000
          },
          {
            CanBet: [
              30000,
              50000,
              100000,
              200000,
              400000,
              600000
            ],
            MaxMoneyBet: 600000,
            MinMoneyBet: 30000
          },
          {
            CanBet: [
              50000,
              100000,
              200000,
              400000,
              600000,
              1000000
            ],
            MaxMoneyBet: 1000000,
            MinMoneyBet: 50000
          },
          {
            CanBet: [
              100000,
              200000,
              400000,
              600000,
              1000000,
              2000000
            ],
            MaxMoneyBet: 2000000,
            MinMoneyBet: 100000
          },
          {
            CanBet: [
              200000,
              400000,
              600000,
              1000000,
              2000000,
              4000000
            ],
            MaxMoneyBet: 4000000,
            MinMoneyBet: 200000
          }
        ],

        ChatRobotIsOpen: false,
        ChatRobotSendIntervalMin: 0,
        ChatRobotSendIntervalMax: 0,
        ChatRobotSendRate: 0,
        ChatRobotSendMaxNum: 0,
        ChatRobotReplyIntervalMin: 0,
        ChatRobotReplyIntervalMax: 0,
        ChatRobotReplyRate: 0,
        ChatRobotReplyMaxNum: 0

      },
      TestCards: {
        Dices: [1, 1, 1],
        SuperDiceIndex: 1,
        SuperDiceOdd: 1000
      },
      form: {},
      subKey: 'miniSuperColor_cfg',
      libShow: $libShow,
      envProjectName: process.env.VUE_APP_PROJECT,
      AttrNames: {
        'Data.RPT': 'RPT',
        'Data.MinMoneyCarry': '入场限制',
        'Data.BetTime': '操作时长',
        'Data.NoticeTime': '通知时间',
        'Data.BetAreas': '下注区域配置',
        'Data.SuperDice': '超级骰子配置',
        'Data.Jackpot': 'jackpot配置',
        'Data.RobotCfg': '机器人配置',
        'Data.ChatRobotSendIntervalMin': '聊天机器人发送间隔时间范围最小值',
        'Data.ChatRobotSendIntervalMax': '聊天机器人发送间隔时间范围最大值',
        'Data.ChatRobotSendRate': '聊天机器人发送概率',
        'Data.ChatRobotSendMaxNum': '聊天机器人最多发送人数',
        'Data.ChatRobotReplyIntervalMin': '聊天机器人回复间隔时间范围最小值',
        'Data.ChatRobotReplyIntervalMax': '聊天机器人回复间隔时间范围最大值',
        'Data.ChatRobotReplyRate': '聊天机器人回复概率',
        'Data.ChatRobotReplyMaxNum': '聊天机器人最多回复人数',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  watch: {
    // 监听json数据变化，重新渲染文件夹内容
    BetOddsList(newVal) {
      this.file_is_show = false
      this.$nextTick(() => { // $nextTick 是在 DOM 更新循环结束之后执行延迟回调
        this.file_is_show = true
      })
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
    addSuperOddOption() {
      for (const i in this.item.SuperDice.Odds) {
        this.SuperDiceOddOption.push({
          label: this.item.SuperDice.Odds[i].Odd,
          value: this.item.SuperDice.Odds[i].Odd
        })
      }
      this.resultForm.superDiceOdd = this.item.SuperDice.Odds[0].Odd
    },
    transMoneyForShow() {
      this.item.MinMoneyCarry /= 1000
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotMoney !== undefined) {
        this.item.RobotCfg.MinRobotMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotMoney !== undefined) {
        this.item.RobotCfg.MaxRobotMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotBetMoney !== undefined) {
        this.item.RobotCfg.MinRobotBetMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotBetMoney !== undefined) {
        this.item.RobotCfg.MaxRobotBetMoney /= 1000
      }

      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotBetAreas === undefined) {
        this.item.RobotCfg.MinRobotBetAreas = 1
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotBetAreas === undefined) {
        this.item.RobotCfg.MaxRobotBetAreas = 5
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotBetTimesOffset === undefined) {
        this.item.RobotCfg.MinRobotBetTimesOffset = -2
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotBetTimesOffset === undefined) {
        this.item.RobotCfg.MaxRobotBetTimesOffset = 2
      }

      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotBetAreasOffset === undefined) {
        this.item.RobotCfg.MinRobotBetAreasOffset = 1
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotBetAreasOffset === undefined) {
        this.item.RobotCfg.MaxRobotBetAreasOffset = 5
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotInitBetMoney === undefined) {
        this.item.RobotCfg.MinRobotInitBetMoney = 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotInitBetMoney === undefined) {
        this.item.RobotCfg.MaxRobotInitBetMoney = 10000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRobotInitBetMoney !== undefined) {
        this.item.RobotCfg.MinRobotInitBetMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRobotInitBetMoney !== undefined) {
        this.item.RobotCfg.MaxRobotInitBetMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinResetCycle === undefined) {
        this.item.RobotCfg.MinResetCycle = 5
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxResetCycle === undefined) {
        this.item.RobotCfg.MaxResetCycle = 20
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.RobotActionTime === undefined) {
        this.item.RobotCfg.RobotActionTime = 500
      }

      /////////////////////////

      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotMoney === undefined) {
        this.item.RobotCfg.MinRankRobotMoney = 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotMoney === undefined) {
        this.item.RobotCfg.MaxRankRobotMoney = 10000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotMoney !== undefined) {
        this.item.RobotCfg.MinRankRobotMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotMoney !== undefined) {
        this.item.RobotCfg.MaxRankRobotMoney /= 1000
      }

      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.RankRobotRadio === undefined) {
        this.item.RobotCfg.RankRobotRadio = 30
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotInitBetMoney === undefined) {
        this.item.RobotCfg.MinRankRobotInitBetMoney = 10000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotInitBetMoney !== undefined) {
        this.item.RobotCfg.MinRankRobotInitBetMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotInitBetMoney === undefined) {
        this.item.RobotCfg.MaxRankRobotInitBetMoney = 100000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotInitBetMoney !== undefined) {
        this.item.RobotCfg.MaxRankRobotInitBetMoney /= 1000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotStart === undefined) {
        this.item.RobotCfg.MinRankRobotStart = 3000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotStart === undefined) {
        this.item.RobotCfg.MaxRankRobotStart = 5000
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MinRankRobotTime === undefined) {
        this.item.RobotCfg.MinRankRobotTime = 300
      }
      if (this.item.RobotCfg !== undefined && this.item.RobotCfg.MaxRankRobotTime === undefined) {
        this.item.RobotCfg.MaxRankRobotTime = 700
      }

      ///////////////////////

      for (const i in this.item.BetAreas) {
        const betArea = this.item.BetAreas[i]
        betArea.MaxMoneyBet /= 1000
        const odds = betArea.Odds
        for (const j in odds) {
          const oddItem = odds[j]
          oddItem.Odd /= 1000
        }
      }

      for (const i in this.item.BetLevels) {
        this.item.BetLevels[i].MaxMoneyBet /= 1000
        this.item.BetLevels[i].MinMoneyBet /= 1000
        const betMoneyList = []
        const items = this.item.BetLevels[i].CanBet
        for (const j in items) {
          betMoneyList.push(parseInt(items[j]) / 1000)
        }
        this.item.BetLevels[i].CanBet = betMoneyList.join(',')
      }

      if (this.item.Jackpot !== undefined && this.item.Jackpot.BetMin !== undefined) {
        this.item.Jackpot.BetMin /= 1000
      }
      for (const i in this.item.SuperDice.Odds) {
        this.item.SuperDice.Odds[i].Odd /= 1000
      }
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))

      ret.MinMoneyCarry *= 1000
      // Object.assign(ret, this.item)
      if (ret.RobotCfg !== undefined) {
        ret.RobotCfg.MinRobotMoney *= 1000
        ret.RobotCfg.MaxRobotMoney *= 1000
        ret.RobotCfg.MinRobotBetMoney *= 1000
        ret.RobotCfg.MaxRobotBetMoney *= 1000
        ret.RobotCfg.MinRobotInitBetMoney *= 1000
        ret.RobotCfg.MaxRobotInitBetMoney *= 1000

        ret.RobotCfg.MinRankRobotMoney *= 1000
        ret.RobotCfg.MaxRankRobotMoney *= 1000
        ret.RobotCfg.MinRankRobotInitBetMoney *= 1000
        ret.RobotCfg.MaxRankRobotInitBetMoney *= 1000
      }
      if (this.envProjectName !== 'ph_audit') {
        ret.RobotCfg.IsOpen = true
        ret.ChatRobotIsOpen = true
      } else {
        ret.RobotCfg.IsOpen = false
        ret.ChatRobotIsOpen = false
      }
      // 下注等级列表
      ret.BetLevels = []
      for (const o in this.item.BetLevels) {
        const betMoneyList = []
        const items = this.item.BetLevels[o].CanBet.split(',')
        for (const i in items) {
          betMoneyList.push(parseInt(items[i]) * 1000)
        }

        // 将betMoneyList按从小到大排序
        betMoneyList.sort(function(a, b) {
          return a - b
        })

        const obj = {}
        Object.assign(obj, this.item.BetLevels[o])
        obj.MaxMoneyBet = betMoneyList.length > 0 ? betMoneyList[betMoneyList.length - 1] : 0
        obj.MinMoneyBet = betMoneyList.length > 0 ? betMoneyList[0] : 0
        obj.CanBet = betMoneyList
        ret.BetLevels.push(obj)
      }

      // 下注区域列表
      ret.BetAreas = []
      for (const i in this.item.BetAreas) {
        const obj = JSON.parse(JSON.stringify(this.item.BetAreas[i]))
        obj.MaxMoneyBet *= 1000
        for (const j in obj.Odds) {
          obj.Odds[j].Odd *= 1000
        }
        ret.BetAreas.push(obj)
      }
      // jackpot配置
      if (ret.Jackpot !== undefined && ret.Jackpot.BetMin !== undefined) {
        ret.Jackpot.BetMin *= 1000
      }

      for (const i in ret.SuperDice.Odds) {
        ret.SuperDice.Odds[i].Odd *= 1000
        ret.SuperDice.Odds[i].Weight = parseInt(ret.SuperDice.Odds[i].Weight)
      }
      return ret
    },
    getData() {
      // console.log(ttt)
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
            if (item !== {}) {
              Object.assign(this.item, item)
            }
            this.transMoneyForShow()
            this.addSuperOddOption()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        } else {
          this.transMoneyForShow()
          this.addSuperOddOption()
        }
      })
    },
    wallpaperInput2(val, index) {
      this.$forceUpdate()
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false

      if (this.envProjectName !== 'ph_audit') {
        if (this.item.RobotCfg.MinRealUserCount >= this.item.RobotCfg.MaxRealUserCount) {
          Message.error('“在线真人最大人数”不能小于“在线真人最小人数”')
          return
        } else if (this.item.RobotCfg.MinTotalUserCount >= this.item.RobotCfg.MaxTotalUserCount) {
          Message.error('“在线总人最大人数”不能小于“在线总人最小人数”')
          return
        } else if (this.item.RobotCfg.MinRobotMoney >= this.item.RobotCfg.MaxRobotMoney) {
          Message.error('“机器人携带金币上限”不能小于“机器人携带金币下限”')
          return
        } else if (this.item.RobotCfg.MinRobotPlayTimes >= this.item.RobotCfg.MaxRobotPlayTimes) {
          Message.error('“机器人最大玩牌次数上限”不能小于“机器人最大玩牌次数下限”')
          return
        } else if (this.item.RobotCfg.MaxRobotBetTimes <= this.item.RobotCfg.MinRobotBetTimes) {
          Message.error('“机器人最大下注次数”不能小于“机器人最小下注次数”')
          return
        } else if (this.item.RobotCfg.MinRobotBetMoney >= this.item.RobotCfg.MaxRobotBetMoney) {
          Message.error('“机器人下注最大筹码”不能小于“机器人下注最小筹码”')
          return
        } else if (this.item.RobotCfg.MinRobotBetAreas >= this.item.RobotCfg.MaxRobotBetAreas) {
          Message.error('“机器人下注最大区域”不能小于“机器人下注最小区域”')
          return
        } else if (this.item.RobotCfg.MinRobotBetTimesOffset >= this.item.RobotCfg.MaxRobotBetTimesOffset) {
          Message.error('“机器人下注最大下注次数偏移”不能小于“机器人下注最小下注次数偏移”')
          return
        } else if (this.item.RobotCfg.MinRobotBetAreasOffset >= this.item.RobotCfg.MaxRobotBetAreasOffset) {
          Message.error('“机器人下注最大区域偏移”不能小于“机器人下注最小区域偏移”')
          return
        } else if (this.item.RobotCfg.MinRobotInitBetMoney >= this.item.RobotCfg.MaxRobotInitBetMoney) {
          Message.error('“机器人下注最大初始筹码”不能小于“机器人下注最小初始筹码”')
          return
        } else if (this.item.RobotCfg.MinResetCycle >= this.item.RobotCfg.MaxResetCycle) {
          Message.error('“机器人重置周期最大”不能小于“机器人重置周期最小”')
          return
        } else if (this.item.RobotCfg.MinRankRobotMoney >= this.item.RobotCfg.MaxRankRobotMoney) {
          Message.error('“榜单机器人携带金币上限”不能小于“榜单机器人携带金币下限”')
          return
        } else if (this.item.RobotCfg.MinRankRobotInitBetMoney >= this.item.RobotCfg.MaxRankRobotInitBetMoney) {
          Message.error('“榜单机器人下注最大初始筹码”不能小于“榜单机器人下注最小初始筹码”')
          return
        } else if (this.item.RobotCfg.MinRankRobotStart >= this.item.RobotCfg.MaxRankRobotStart) {
          Message.error('“榜单机器人开始下注时间”不能小于“榜单机器人结束下注时间”')
          return
        } else if (this.item.RobotCfg.MinRankRobotTime >= this.item.RobotCfg.MaxRankRobotTime) {
          Message.error('“榜单机器人下注最大时间”不能小于“榜单机器人下注最小时间”')
          return
        } else {
          let minBetmoney = 0
          for (let i = 0; i < this.item.BetLevels.length; i++) {
            const betLevel = this.item.BetLevels[i]
            if (betLevel.CanBet.MinMoneyBet < this.item.RobotCfg.MinRobotBetMoney || minBetmoney === 0) {
              minBetmoney = betLevel.CanBet.MinMoneyBet
            }
          }
          if (minBetmoney > this.item.RobotCfg.MinRobotBetMoney) {
            Message.error('“机器人下注最小筹码低于下注列表的最小值”')
            return
          }
          for (const i in this.item.SuperDice.Odds) {
            if (this.item.SuperDice.Odds[i].Odd <= 0) {
              Message.error('请输入正确的超级骰子赔率')
              return
            }
          }
          for (const i in this.item.BetAreas) {
            const odds = this.item.BetAreas[i].Odds
            for (const oddsKey in odds) {
              if (odds[oddsKey].Odd <= 1) {
                Message.error('请输入正确的下注区域赔率,赔率不能小于1,颜色是' + this.item.BetAreas[i].Name)
                return
              }
            }
          }
        }
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
            Message.success('保存成功')
          }
        })
      })
    },
    doAdd() {
      this.item.BetLevels.push({ CanBet: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 60 })
    },
    delRow(index) {
      this.item.BetLevels.splice(index, 1)
    },
    setResult() {
      if (this.envProjectName === 'production') {
        Message.error('正式环境不能设置')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/game/super/color/result',
          One: this.resultForm.one,
          Two: this.resultForm.two,
          Three: this.resultForm.three,
          Index: this.resultForm.superDiceIndex,
          Odd: this.resultForm.superDiceOdd
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
          Path: '/game/clean/super/color/result'
        }
      }).then(response => {
        if (response.RetCode === 0) {
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
    logChange(){
      console.log('logChange',this.item.RobotCfg.RobotActionTime)
    }
  }
}
</script>
