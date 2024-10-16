<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-position="left">
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <el-col :span="7" :offset="3">
              <el-form-item label="保底奖池抽水：">
                <el-input v-model.number="item.PoolFeeRate"><template slot="append">%</template></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1">
              <el-form-item label="玩家台费抽水：">
                <el-input v-model.number="item.TableFeeFate" :required="true">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="3">
              <el-form-item label="Jackpot贡献率:">
                <el-input v-model="item.Jackpot.ContributeRate" :required="true"><template slot="append">%</template></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1">
              <el-form-item label="解锁Jackpot最小下注:">
                <el-input v-model="item.Jackpot.BetMin" :required="true" />
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="3">
              <el-form-item label="下注时长:">
                <el-input v-model.number="item.BetTime" :required="true">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1">
              <el-form-item label="用户长时间未下注提示:">
                <el-input v-model.number="item.NoticeTime" :required="true" @input="wallpaperInput2">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
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
                    <span style="color:red;"> 说明: ... </span>
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
                      label="Id"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.Id }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="Low"
                      label="下注区域名称"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="BetAreaNames[scope.row.Id]" disabled size="mini" />
                      </template>
                    </el-table-column>

                    <el-table-column
                      v-if="envProjectName !== 'ph_audit'"
                      prop="RobotBetRate"
                      label="机器人下注权重"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.RobotBetRate" size="mini" />
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="MaxMoneyBet"
                      label="区域下注上限"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.MaxMoneyBet" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </fieldset>

              <fieldset style="margin-top:10px">
                <legend>牌型赔率配置</legend>
                <el-row>
                  <el-table
                    ref="filterTable"
                    :data="item.CardTypeOdds"
                    border
                    :header-cell-style="libShow.DefaultTableHeadClass"
                    :row-style="{height:'10px'}"
                    :cell-style="libShow.DefaultTableCell"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="牌型Id"
                      width="80px"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.CardType }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="Low"
                      label="牌型名称"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="CardTypeNames[scope.row.CardType]" disabled size="mini" />
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="牌型赔率"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.Odds" type="number" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="配牌配置">
            <el-col :span="16" :offset="3">
              <fieldset style="margin-top:10px">
                <legend>配牌设置（使用16进制数值）</legend>
                <el-row>
                  <el-col :span="11" :offset="0">
                    <el-form-item label="庄家配牌">
                      <el-input v-model="TestCards.BankerCards.CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="0">
                    <el-form-item label="West配牌">
                      <el-input v-model="TestCards.PlayerCards[0].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="North配牌">
                      <el-input v-model="TestCards.PlayerCards[1].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="0">
                    <el-form-item label="South配牌">
                      <el-input v-model="TestCards.PlayerCards[2].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="East配牌">
                      <el-input v-model="TestCards.PlayerCards[3].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Jackpot配置">
            <el-col :span="22" :offset="1">
              <fieldset style="margin-top:10px">
                <legend>Jackpot 奖励配置</legend>
                <el-alert
                  type="success"
                  description="玩家获得的JP奖励=JP总额*JP档次对应奖励占比/100"
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
                      {{ JackpotTypeCfg[scope.row.Type] }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="奖励占比"
                    width="380"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AwardRate">
                        <template v-if="scope.row.Type === 4" slot="append">倍下注</template><template v-else slot="append">%</template>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="envProjectName==='ph_audit'"
                    label="概率(Jackpot调控开启后此配置无效)"
                    width="380"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Rate"><template slot="append">%</template></el-input>
                    </template>
                  </el-table-column>
                </el-table>

              </fieldset>

              <fieldset v-if="envProjectName !== 'ph_audit'" style="margin-top:20px;">
                <legend>jackpot调控配置
                  <el-switch
                    v-model="item.JackpotRegulation.ToggleSwitch"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开"
                    inactive-text="关"
                  />
                </legend>
                <el-descriptions>
                  <el-descriptions-item>
                    <span style="color:red;">开启后，Jackpot的中奖概率以下表数值为准。(审核版无效)</span>
                  </el-descriptions-item>
                </el-descriptions>

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
                        {{ JackpotTypeCfg[scope.row.JackpotType] }}
                      </template>
                    </el-table-column>

                    <!--
                    <el-table-column label="奖励占比(与Jackpot配置中占比一致)">
                      <template v-if="scope.row.AwardType==1" slot-scope="scope">
                        {{ item.JackpotCfg[scope.row.JackpotType-1].AwardRate }}%
                      </template>
                    </el-table-column>
                    -->

                    <el-table-column label="中奖概率" prop="JackpotRate">
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.JackpotRate" style="width: 150px;" size="mini" :required="true">
                          <template slot="append">‰</template>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="每日限制开出个数" prop="DayLimit">
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="分段限制" prop="DayLimitArr">
                      <template slot-scope="scope">
                        <el-button v-if="scope.row.AwardType === 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showDayLimitDialog(scope.row)" />
                        <el-tag v-for="tag, key in scope.row.DayLimitArr" v-if="scope.row.AwardType === 1" :key="key" disable-transitions>{{ showOpenDayLimit(tag) }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="玩家开奖池条件(%)" width="300">
                      <template slot-scope="scope">
                        <div v-if="scope.row.AwardType===1">
                          虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
                          &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
                        </div>
                        <span v-if="scope.row.JackpotType===4">
                          3Bet中奖会判断玩家的个人JP贡献值，中奖额≤贡献值才开，玩家开奖后根据中奖额扣除贡献值
                        </span>
                      </template>

                    </el-table-column>

                    <el-table-column label="机器人开奖池值" prop="PoolVal">
                      <template v-if="scope.row.AwardType===1" slot-scope="scope">
                        >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                      </template>
                    </el-table-column>

                    <!--
                    <el-table-column label="机器人发奖上限(%)" prop="VrPoolRateMax">
                      <template v-if="scope.row.AwardType==1" slot-scope="scope">
                        <el-input v-model.number="scope.row.VrPoolRateMax" style="width: 120px;" size="mini" :required="true" />
                      </template>
                    </el-table-column>
                    -->

                    <el-table-column label="机器人开奖数量概率" prop="RateArr">
                      <template slot-scope="scope">
                        <el-button v-if="scope.row.AwardType === 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
                        {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>

                <el-descriptions>
                  <el-descriptions-item>
                    <span style="color:red;">以下为显示jackpot奖池增长配置。</span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-table
                  ref="filterTable"
                  :data="item.JackpotRegulation.PoolIncrArr"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="Id" prop="Id" />
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
                      <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="机器人配置">
            <el-col :span="16" :offset="3">
              <fieldset v-if="!isHidden" style="margin-top:10px">
                <legend>机器人配置</legend>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">以下配置,在两个时段机器人数目标替换时,缺补:[50,∞)[2,5]; [30,50)[1,3]; [10,30)[1,2]; (0,10)[0.5,1]  多退:[50,∞)[2,3]; [20,50)[1,2]; (0,20)[0.5,1]</span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-table
                  ref="filterTable"
                  :data="item.RobotCfg.RobotMemberArr"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />
                  <el-table-column label="时间段" prop="TimeTitle">
                    <template slot-scope="scope">
                      [{{ scope.row.StartHour }},{{ scope.row.EndHour }}]
                    </template>
                  </el-table-column>
                  <el-table-column label="机器人+真人人数下限" prop="MinRobotNum">
                    <template slot-scope="scope">
                      {{ scope.row.MinRobotNum }}
                    </template>
                  </el-table-column>
                  <el-table-column label="机器人+真人人数上限限" prop="MaxRobotNum">
                    <template slot-scope="scope">
                      {{ scope.row.MaxRobotNum }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="normal" icon="el-icon-edit" size="mini" @click="showRobotNumForm(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人人数安全值（%）：" prop="RobotCfg.RobotUserNumSafeVal" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.RobotUserNumSafeVal" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
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
                    <el-form-item label="机器人赢牌次数下限：" prop="RobotCfg.MinRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotWinTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人赢牌次数上限：" prop="RobotCfg.MaxRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotWinTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人输牌次数下限：" prop="RobotCfg.MinRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MinRobotLoseTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人输牌次数上限：" prop="RobotCfg.MaxRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-col :span="20">
                        <el-input v-model.number="item.RobotCfg.MaxRobotLoseTimes" size="mini" :required="true" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">以下这两个值不做保证，1.如果总下注额度满足以后，机器人会停止下注; 2.如果总下注额度没有完成，次数以达到上限机器人会继续下注</span>
                  </el-descriptions-item>
                </el-descriptions>
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
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">上一局真人下注额度≠0，所有机器人这一局总下注限制: [min,max]*上一局真人总下注额度</span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人下注最小倍数(min)：" prop="RobotCfg.MinRobotBetLastMemberMultiple" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MinRobotBetLastMemberMultiple" style="width:100px" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="机器人下注最大倍数(max)：" prop="RobotCfg.MaxRobotBetLastMemberMultiple" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MaxRobotBetLastMemberMultiple" style="width:100px" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">上一局真人下注额度=0，所有机器人这一局总下注限制: [0,房间真人数乘于*avg]</span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="机器人平均下注额度(avg)：" prop="RobotCfg.RobotAverageBetMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.RobotAverageBetMoney" style="width:100px" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
        </el-tabs>

        <el-col style="margin-top:16px;" :offset="10" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

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
          <el-input v-model.number="robotDialogForm.data.StartHour" disable style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="结束时段：">
          <el-input v-model.number="robotDialogForm.data.EndHour" disable style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="机器人最小人数：">
          <el-input v-model.number="robotDialogForm.data.MinRobotNum" style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="机器人最大人数：">
          <el-input v-model.number="robotDialogForm.data.MaxRobotNum" style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveRobotDialog()">保存</el-button>
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
                [{{ scope.row.StartHour }},{{ scope.row.EndHour+1 }})点
              </template>
            </el-table-column>
            <el-table-column label="每小时增长">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PerHourIncr" style="width: 100px;" size="mini" :required="true" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveIncrJackpotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
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
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      AttrNames: {
      },
      BetAreaNames: {
        0: 'West',
        1: 'North',
        2: 'South',
        3: 'East'
      },
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      CardTypeNames: {
        0: '无牛',
        1: '牛一',
        2: '牛二',
        3: '牛三',
        4: '牛四',
        5: '牛五',
        6: '牛六',
        7: '牛七',
        8: '牛八',
        9: '牛九',
        10: '牛牛',
        11: '四花',
        12: '五花',
        13: '四条',
        14: '五小'
      },
      item: {
        JackpotRegulation: {
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: [],
          ToggleSwitch: true
        },
        BetLevel: { CanBet: '30,50,100,200,400,600', MaxMoneyBet: 1000, MinMoneyBet: 1 },
        BetAreas: [
          { Name: 'West', MaxMoneyBet: 1000000, Id: 0, RobotBetRate: 10 },
          { Name: 'North', MaxMoneyBet: 1000000, Id: 1, RobotBetRate: 10 },
          { Name: 'South', MaxMoneyBet: 1000000, Id: 2, RobotBetRate: 10 },
          { Name: 'East', MaxMoneyBet: 1000000, Id: 3, RobotBetRate: 10 }
        ],
        CardTypeOdds: [
          { CardType: 0, Odds: 1000 },
          { CardType: 1, Odds: 1000 },
          { CardType: 2, Odds: 1000 },
          { CardType: 3, Odds: 1000 },
          { CardType: 4, Odds: 1000 },
          { CardType: 5, Odds: 1000 },
          { CardType: 6, Odds: 1000 },
          { CardType: 7, Odds: 2000 },
          { CardType: 8, Odds: 2000 },
          { CardType: 9, Odds: 2000 },
          { CardType: 10, Odds: 3000 },
          { CardType: 11, Odds: 3000 },
          { CardType: 12, Odds: 3000 },
          { CardType: 13, Odds: 3000 },
          { CardType: 14, Odds: 3000 }
        ],
        Jackpot: {
          BetMin: 30000,
          ContributeRate: 1,
          AwardItems: [
            { Type: 1, AwardRate: 50 },
            { Type: 2, AwardRate: 15 },
            { Type: 3, AwardRate: 5 }
          ]
        },
        PoolFeeRate: 5,
        TableFeeFate: 5,
        BetTime: 13,
        NoticeTime: 300,
        TestCards: {
          BankerCards: { Cards: [], AreaId: -1 },
          PlayerCards: [
            { Cards: [], AreaId: 0 },
            { Cards: [], AreaId: 1 },
            { Cards: [], AreaId: 2 },
            { Cards: [], AreaId: 3 }
          ]
        },

        RobotCfg: {
          MinRobotNumber: 0, // 机器人最小人数
          MaxRobotNumber: 0, // 机器人最大人数
          RobotMemberArr: [],
          RobotAverageBetMoney: 0, // 机器人平均下注额
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
          MinRobotBetLastMemberMultiple: 0, // 机器人下注最小倍数
          MaxRobotBetLastMemberMultiple: 0, // 机器人下注最大倍数
          MinPlayersEnableSchema: 10, // 最低调控玩家数
          RobotUserNumSafeVal: 0,
          RealUserNumSafeVal: 0
        }
      },
      TestCards: {
        BankerCards: { CardText: '', AreaId: -1 },
        PlayerCards: [
          { CardText: '', AreaId: 0 },
          { CardText: '', AreaId: 1 },
          { CardText: '', AreaId: 2 },
          { CardText: '', AreaId: 3 }
        ]
      },
      isHidden: true, // 默认隐藏
      testRand: {
        visible: false,
        times: 0,
        result: []
      },
      JackpotRandAwards: [],
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      robotDialogForm: {
        visible: false,
        data: {}
      },
      incrJackpotForm: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
      form: {},
      subKey: 'miniNiuNiu_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      },
      envProjectName: process.env.VUE_APP_PROJECT
    }
  },
  watch: {
    // 监听json数据变化，重新渲染文件夹内容
    BetOddsList(newVal) {
      this.file_is_show = false
      if (true) {
        this.$nextTick(() => { // $nextTick 是在 DOM 更新循环结束之后执行延迟回调
          this.file_is_show = true
        })
      }
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_NAME)
    if (process.env.VUE_APP_PROJECT_NAME === '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME === '菲1-线上环境') {
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
      this.item.RobotCfg.MinRobotMoney /= 1000
      this.item.RobotCfg.MaxRobotMoney /= 1000
      this.item.RobotCfg.RobotAverageBetMoney /= 1000

      for (const j in this.item.BetAreas) {
        this.item.BetAreas[j].MaxMoneyBet /= 1000
      }

      for (const o of this.item.CardTypeOdds) {
        o.Odds /= 1000
      }

      for (const j in this.item.BetLevels) {
        this.item.BetLevels[j].MaxMoneyBet /= 1000
        this.item.BetLevels[j].MinMoneyBet /= 1000
        const betMoneyList = []
        const items = this.item.BetLevels[j].CanBet
        for (const i in this.item.BetLevels[j].CanBet) {
          betMoneyList.push(parseInt(items[i]) / 1000)
        }
        this.item.BetLevels[j].CanBet = betMoneyList.join(',')
      }

      if (this.item.Jackpot !== undefined && this.item.Jackpot.BetMin !== undefined) {
        this.item.Jackpot.BetMin /= 1000
      }

      for (const k in this.item.JackpotRegulation.RandAwards) {
        this.item.JackpotRegulation.RandAwards[k].PoolVal /= 1000
      }
    },
    convertTextToHexadecimalArray(text) {
      const ret = []
      if (text !== undefined && text.length > 0) {
        const numbers = text.split(',')
        for (const k in numbers) {
          const val = parseInt(numbers[k], 16)
          if (val <= 0) {
            continue
          }
          ret.push(val)
        }
      }
      return ret
    },
    convertHexadecimalArrayToText(arr) {
      let ret = ''
      if (arr !== undefined && arr.length > 0) {
        ret = arr.map(item => Number(item).toString(16)).join(',')
      }
      return ret
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))

      // Object.assign(ret, this.item)
      ret.RobotCfg.MinRobotMoney *= 1000
      ret.RobotCfg.MaxRobotMoney *= 1000
      ret.RobotCfg.RobotAverageBetMoney *= 1000

      // 下注等级列表
      ret.BetLevels = []
      for (const o in this.item.BetLevels) {
        const betMoneyList = []
        console.log('CanBet', this.item.BetLevels[o].CanBet)
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
      for (const o in this.item.BetAreas) {
        const obj = JSON.parse(JSON.stringify(this.item.BetAreas[o]))
        // Object.assign(obj, this.item.BetOptions[o])
        obj.MaxMoneyBet *= 1000
        ret.BetAreas.push(obj)
      }
      for (const o of ret.CardTypeOdds) {
        o.Odds *= 1000
      }

      // 测试牌
      ret.TestCards.BankerCards = {}
      ret.TestCards.BankerCards.AreaId = -1
      ret.TestCards.BankerCards.Cards = this.convertTextToHexadecimalArray(this.TestCards.BankerCards.CardText)

      ret.TestCards.PlayerCards = []
      for (const k in this.TestCards.PlayerCards) {
        const obj = this.TestCards.PlayerCards[k]
        ret.TestCards.PlayerCards.push({ AreaId: obj.AreaId, Cards: this.convertTextToHexadecimalArray(obj.CardText) })
      }

      // jackpot配置
      if (ret.Jackpot !== undefined && ret.Jackpot.BetMin !== undefined) {
        ret.Jackpot.BetMin *= 1000
      }

      // jackpot奖池调控
      const jackpotInfo = {}
      Object.assign(jackpotInfo, this.item.JackpotRegulation)
      jackpotInfo.RandAwards = []
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        this.JackpotRandAwards[o].AwardRate = this.item.Jackpot.AwardItems[o].AwardRate // 同步奖励占比
        Object.assign(raObj, this.JackpotRandAwards[o])
        raObj.PoolVal *= 1000
        jackpotInfo.RandAwards.push(raObj)
      }
      ret.JackpotRegulation = jackpotInfo
      console.log('JackpotRegulation', ret.JackpotRegulation)

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
            const betAreas = this.item.BetAreas
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            if (this.item.BetAreas.length === 0) {
              this.item.BetAreas = betAreas
            }

            if (this.item.TestCards && this.item.TestCards.BankerCards) {
              this.TestCards.BankerCards.AreaId = this.item.TestCards.BankerCards.AreaId || 0
              this.TestCards.BankerCards.CardText = this.convertHexadecimalArrayToText(this.item.TestCards.BankerCards.Cards)
            }

            if (this.item.TestCards && this.item.TestCards.PlayerCards.length > 0) {
              for (const k in this.item.TestCards.PlayerCards) {
                const obj = this.item.TestCards.PlayerCards[k]
                this.TestCards.PlayerCards[k].AreaId = obj.AreaId
                this.TestCards.PlayerCards[k].CardText = this.convertHexadecimalArrayToText(obj.Cards)
              }
            }

            this.JackpotRandAwards = this.item.JackpotRegulation.RandAwards
            console.log('JackpotRandAwards', this.JackpotRandAwards)
          }
        }
      })
    },
    wallpaperInput2(val, index) {
      this.$forceUpdate()
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false

      if (this.envProjectName !== 'ph_audit') {
        if (this.item.RobotCfg.MaxRobotNumber < this.item.RobotCfg.MinRobotNumber) {
          Message.error('“机器人最大人数”不能小于“机器人最小人数”')
          return
        } else if (this.item.RobotCfg.MaxRobotMoney < this.item.RobotCfg.MinRobotMoney) {
          Message.error('“机器人携带金币上限”不能小于“机器人携带金币下限”')
          return
        } else if (this.item.RobotCfg.MaxRobotPlayTimes < this.item.RobotCfg.MinRobotPlayTimes) {
          Message.error('“机器人最大玩牌局数上限”不能小于“机器人最大玩牌局数下限”')
          return
        } else if (this.item.RobotCfg.MaxRobotWinTimes < this.item.RobotCfg.MinRobotWinTimes) {
          Message.error('“机器人最大赢牌次数上限”不能小于“机器人最大赢牌次数下限”')
          return
        } else if (this.item.RobotCfg.MaxRobotLoseTimes < this.item.RobotCfg.MinRobotLoseTimes) {
          Message.error('“机器人最大输牌次数上限”不能小于“机器人最大输牌次数下限”')
          return
        } else if (this.item.RobotCfg.MaxRobotBetTimes < this.item.RobotCfg.MinRobotBetTimes) {
          Message.error('“机器人最大下注次数”不能小于“机器人最小下注次数”')
          return
        } else if (this.item.RobotCfg.MinRobotBetTimes < 1 || this.item.RobotCfg.MaxRobotBetTimes > 15) {
          Message.error('“机器人最小下注次数”不能小于1，“机器人最大下注次数”不能大于15')
          return
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
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    doAdd() {
      this.item.BetLevels.push({ CanBet: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 60 })
    },
    delRow(index) {
      this.item.BetLevels.splice(index, 1)
    },
    showOpenPoolRate(jpType, data) {
      if (jpType === 4) {
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
    saveIncrJackpotDialog() {
      for (let i = 0; i < this.item.JackpotRegulation.PoolIncrArr.length; i++) {
        if (this.item.JackpotRegulation.PoolIncrArr[i].Id === this.incrJackpotForm.id) {
          this.item.JackpotRegulation.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (let j = 0; j < this.item.JackpotRegulation.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.JackpotRegulation.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
          }
          break
        }
      }
      this.incrJackpotForm.visible = false
    },
    addPoolNum() {
      let maxId = 0
      for (let i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id > maxId) {
          maxId = this.poolNumChange.data[i].Id
        }
      }
      maxId++
      this.poolNumChange.data.push({ 'Id': maxId, 'Num': 0, 'Rate': 0 })
    },
    removePoolNum(id) {
      for (let i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id === id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    savePoolNum() {
      for (let i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.poolNumChange.jackpotType === this.JackpotRandAwards[i].JackpotType) {
          this.JackpotRandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
    },
    showDayLimitDialog(data) {
      if (data.JackpotType === 4) {
        return
      }
      this.dayLimitChange.title = this.JackpotTypeCfg[data.JackpotType] + '(分段限制)'
      this.dayLimitChange.data = data.DayLimitArr || [{}]
      this.dayLimitChange.visible = true
      this.dayLimitChange.jackpotType = data.JackpotType
    },
    showOpenDayLimit(data) {
      return '[' + data['StartHours'] + ',' + data['EndHours'] + ')点：' + data['Num'] + '个'
    },
    addDayLimit() {
      if (!this.dayLimitChange.data) {
        this.dayLimitChange['data'] = []
      }
      this.dayLimitChange.data.push({ 'StartHours': 0, 'EndHours': 0, 'Num': 0 })
    },
    removeDayLimitNum(index) {
      this.dayLimitChange.data.splice(index, 1)
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
      for (let i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.dayLimitChange.jackpotType === this.JackpotRandAwards[i].JackpotType) {
          if (!this.JackpotRandAwards[i]['DayLimitArr']) {
            this.JackpotRandAwards[i]['DayLimitArr'] = []
          }
          this.JackpotRandAwards[i]['DayLimitArr'] = this.dayLimitChange.data
          break
        }
      }
      this.dayLimitChange.visible = false
    },
    checkShowDayLimit(awardType) {
      return awardType === 2
    },
    showPoolNumDialog(data) {
      if (data.JackpotType === 4) {
        return
      }
      this.poolNumChange.title = this.JackpotTypeCfg[data.JackpotType] + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    // 展示jackpot奖池增长标题
    getJackpotPoolTitle(row) {
      if (row.MaxPool === -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    // 展示jackpot每小时增长值
    getJackpotIncrShow(row, startHour, endHour) {
      let showNum = 0
      for (let i = 0; i < row.TimeArr.length; i++) {
        if (row.TimeArr[i].StartHour === startHour && row.TimeArr[i].EndHour === endHour) {
          showNum = row.TimeArr[i].PerHourIncr / 1000
          break
        }
      }
      return showNum.toLocaleString()
    },
    showIncrJackpotForm(data) {
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (let i = 0; i < data.TimeArr.length; i++) {
        console.log(data.TimeArr[i])
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }
      // for (const l in this.incrJackpotForm.data) {
      //   this.incrJackpotForm.data[l].PerHourIncr /= 1000
      // }
      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    }
  }
}
</script>
