<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
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
                  <template slot="append">局</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="3">
              <el-form-item label="Jackpot贡献率:">
                <el-input v-model="item.Jackpot.ContributeRate" :required="true" />
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

              <fieldset style="margin-top:10px">
                <legend>每局目标下注额度</legend>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;"> 说明: 单局游戏的目标下注额度范围为最小至最大下注额度；若玩家下注额度未达目标额度，则将机器人的下注额度补充至目标额度 </span>
                  </el-descriptions-item>
                </el-descriptions>
                <el-table
                  :data="item.BetTargets"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="开始时间"
                    width="180"
                  >
                    <template slot-scope="scope">
                      [{{ scope.row.StartHour }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="结束时间"
                    width="180"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.EndHour }})
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="最小下注"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.BetMin" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="最大下注"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.BetMax" size="mini" />
                    </template>
                  </el-table-column>
                </el-table>
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
                    <el-form-item label="Luzon配牌">
                      <el-input v-model="TestCards.PlayerCards[0].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="Mindanao配牌">
                      <el-input v-model="TestCards.PlayerCards[1].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="0">
                    <el-form-item label="Samar配牌">
                      <el-input v-model="TestCards.PlayerCards[2].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="Negros配牌">
                      <el-input v-model="TestCards.PlayerCards[3].CardText" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Jackpot配置">
            <el-col :span="16" :offset="3">
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
      BetAreaNames: {
        1: 'Luzon',
        2: 'Mindanao',
        3: 'Samar',
        4: 'Negros'
      },
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖'
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
        BetLevel: { CanBet: '30,50,100,200,400,600', MaxMoneyBet: 1000, MinMoneyBet: 1 },
        BetAreas: [
          { Name: 'Luzon', MaxMoneyBet: 1000000, Id: 1, RobotBetRate: 10 },
          { Name: 'Mindanao', MaxMoneyBet: 1000000, Id: 2, RobotBetRate: 10 },
          { Name: 'Samar', MaxMoneyBet: 1000000, Id: 3, RobotBetRate: 10 },
          { Name: 'Negros', MaxMoneyBet: 1000000, Id: 4, RobotBetRate: 10 }
        ],
        BetTargets: [
          { StartHour: 0, EndHour: 4, BetMin: 10000, BetMax: 20000 },
          { StartHour: 4, EndHour: 8, BetMin: 10000, BetMax: 20000 },
          { StartHour: 8, EndHour: 12, BetMin: 10000, BetMax: 20000 },
          { StartHour: 12, EndHour: 16, BetMin: 10000, BetMax: 20000 },
          { StartHour: 16, EndHour: 20, BetMin: 10000, BetMax: 20000 },
          { StartHour: 20, EndHour: 24, BetMin: 10000, BetMax: 20000 }
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
          BankerCards: { Cards: [], AreaId: 0 },
          PlayerCards: [
            { Cards: [], AreaId: 1 },
            { Cards: [], AreaId: 2 },
            { Cards: [], AreaId: 3 },
            { Cards: [], AreaId: 4 }
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
        BankerCards: { CardText: '', AreaId: 0 },
        PlayerCards: [
          { CardText: '', AreaId: 1 },
          { CardText: '', AreaId: 2 },
          { CardText: '', AreaId: 3 },
          { CardText: '', AreaId: 4 }
        ]
      },
      isHidden: true, // 默认隐藏
      testRand: {
        visible: false,
        times: 0,
        result: []
      },
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

      for (const i in this.item.BetTargets) {
        this.item.BetTargets[i].BetMin /= 1000
        this.item.BetTargets[i].BetMax /= 1000
      }

      if (this.item.Jackpot !== undefined && this.item.Jackpot.BetMin !== undefined) {
        this.item.Jackpot.BetMin /= 1000
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

      ret.TestCards.BankerCards = {}
      ret.TestCards.BankerCards.AreaId = 0
      ret.TestCards.BankerCards.Cards = this.convertTextToHexadecimalArray(this.TestCards.BankerCards.CardText)

      ret.TestCards.PlayerCards = []
      for (const k in this.TestCards.PlayerCards) {
        const obj = this.TestCards.PlayerCards[k]
        ret.TestCards.PlayerCards.push({ AreaId: obj.AreaId, Cards: this.convertTextToHexadecimalArray(obj.CardText) })
      }

      for (const i in this.item.BetTargets) {
        ret.BetTargets[i].BetMin *= 1000
        ret.BetTargets[i].BetMax *= 1000
      }

      if (ret.Jackpot !== undefined && ret.Jackpot.BetMin !== undefined) {
        ret.Jackpot.BetMin *= 1000
      }

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
    }
  }
}
</script>
