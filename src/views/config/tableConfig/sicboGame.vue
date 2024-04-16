<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">

        <el-col :span="8" :offset="1">
          <el-form-item label="保底奖池抽水：">
            <el-input v-model.number="item.FeeRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="开奖结果（测试用如:1,2,5）">
            <el-input v-model="dices" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="用户未下注提示离开时长(s):">
            <el-input v-model.number="item.NoticeTime" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="extrapay出现概率（%）:">
            <el-input v-model.number="item.ExTraPayRate" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="16" :offset="3">
          <fieldset style="margin-top:10px">
            <legend>下注配置</legend>
            <el-row>
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
                  prop="Low"
                  label="下注列表"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.TableMoney" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Low"
                  label="最大下注限制"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MaxMoneyBet" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Low"
                  label="最小下注限制"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MinMoneyBet" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="doAdd"
                    >添加
                    </el-button>
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
                <span style="color:red;"> 审核服extra pay 配置不生效</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.BetAreaOptions"
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
                  label="下注区域名称"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Name" disabled size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="出现extrapay概率(%)"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Odds" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  :label="'extrapay倍数(单项概率总和必须等于100)'"
                  width="320"
                >

                  <template slot-scope="scope">
                    <div v-if="BetOddsList[scope.$index]">
                      <div v-for="(data, index ) in BetOddsList[scope.$index].OddsList" style="line-height: 1.5; ">
                        <el-row style="line-height: 1.5; ">
                          <a size="mini" type="primary" @click="addOddsList(scope.$index)">+</a>
                          <span style="margin-left: 20px">倍数:</span>
                          <el-input
                            v-model.number="data.Double"
                            size="mini"
                            style="width: 80px"
                            placeholder="倍数"
                            @input="wallpaperInput(scope.$index,index) "
                          />
                          <span style="margin-left: 10px">概率:</span>
                          <el-input
                            v-model.number="data.Odds"
                            size="mini"
                            style="width: 80px"
                            placeholder="概率%"
                            @input="wallpaperInput(scope.$index,index)"
                          />
                          <a style="margin-left: 20px" type="danger" size="mini" @click="delOddsList(scope.$index,index)">-</a>
                        </el-row>
                      </div>

                    </div>
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

                <el-table-column
                  prop="RobotBetOdds"
                  label="机器人下注概率(‰)"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.RobotBetOdds" size="mini" />
                  </template>
                </el-table-column>

              </el-table>
            </el-row>
          </fieldset>

          <fieldset style="margin-top:10px">
            <legend>下注赔率配置</legend>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.BetOptionsRate"
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
                  label="下注区域名称"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Name" disabled size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="中奖赔率"
                >
                  <template slot-scope="scope">
                    <el-input type="number" :step="0.01" v-model.number="scope.row.Val" size="mini"  oninput="if(value < 0 || value == '' || value == null){value = 0;}"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </fieldset>

          <fieldset v-if="!isHidden" style="margin-top:10px">
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
                  <el-button type="normal" icon="el-icon-edit" size="mini" @click="showRobotNumForm(scope.row)">编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人人数安全值（%）："
                  prop="RobotUserNumSafeVal"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.RobotUserNumSafeVal" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="真人人数安全值（%）："
                  prop="RealUserNumSafeVal"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.RealUserNumSafeVal" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人携带金币下限："
                  prop="MinRobotMoney"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人携带金币上限："
                  prop="MaxRobotMoney"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人最大玩牌局数下限："
                  prop="MinRobotPlayTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人最大玩牌局数上限："
                  prop="MaxRobotPlayTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人最大赢牌次数下限："
                  prop="MinRobotWinTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人最大赢牌次数上限："
                  prop="MaxRobotWinTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人最大输牌次数下限："
                  prop="MinRobotLoseTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人最大输牌次数上限："
                  prop="MaxRobotLoseTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item
                  label="机器人最小下注次数："
                  prop="MinRobotBetTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotBetTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人最大下注次数："
                  prop="MaxRobotBetTimes"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
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
                <el-form-item
                  label="机器人下注最小倍数："
                  prop="MinRobotBetLastMemberMultiple"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-input
                    v-model.number="item.MinRobotBetLastMemberMultiple"
                    style="width:100px"
                    size="mini"
                    :required="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="机器人下注最大倍数："
                  prop="MaxRobotBetLastMemberMultiple"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-input
                    v-model.number="item.MaxRobotBetLastMemberMultiple"
                    style="width:100px"
                    size="mini"
                    :required="true"
                  />
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
                <el-form-item
                  label="机器人平均下注额："
                  prop="RobotAverageBetMoney"
                  :rules="dataRule(true,{type:'n',range:'0'})"
                >
                  <el-input
                    v-model.number="item.RobotAverageBetMoney"
                    style="width:100px"
                    size="mini"
                    :required="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-col>

        <el-col style="margin-top:16px;" :offset="8" :span="8">
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
          <el-input
            v-model.number="robotDialogForm.data.StartHour"
            disable
            style="width: 100px;"
            size="mini"
            :required="true"
          />
        </el-form-item>
        <el-form-item label="结束时段：">
          <el-input
            v-model.number="robotDialogForm.data.EndHour"
            disable
            style="width: 100px;"
            size="mini"
            :required="true"
          />
        </el-form-item>
        <el-form-item label="机器人最小人数：">
          <el-input
            v-model.number="robotDialogForm.data.MinRobotNum"
            style="width: 100px;"
            size="mini"
            :required="true"
          />
        </el-form-item>
        <el-form-item label="机器人最大人数：">
          <el-input
            v-model.number="robotDialogForm.data.MaxRobotNum"
            style="width: 100px;"
            size="mini"
            :required="true"
          />
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
      item: {
        BetMoneyLevel: [{ TableMoney: 100, MaxMoneyBet: 2000, MinMoneyBet: 10 }],
        BetAreaOptions: [
          { Name: 'SMALL_小点', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 0, RobotBetOdds: 1 },
          { Name: 'BIG_大点', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 1, RobotBetOdds: 1 },
          { Name: '骰子单点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 2, RobotBetOdds: 1 },
          { Name: '骰子单点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 3, RobotBetOdds: 1 },
          { Name: '骰子单点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 4, RobotBetOdds: 1 },
          { Name: '骰子单点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 5, RobotBetOdds: 1 },
          { Name: '骰子单点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 6, RobotBetOdds: 1 },
          { Name: '骰子单点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 7, RobotBetOdds: 1 },
          { Name: '骰子双点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 8, RobotBetOdds: 1 },
          { Name: '骰子双点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 9, RobotBetOdds: 1 },
          { Name: '骰子双点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 10, RobotBetOdds: 1 },
          { Name: '骰子双点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 11, RobotBetOdds: 1 },
          { Name: '骰子双点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 12, RobotBetOdds: 1 },
          { Name: '骰子双点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 13, RobotBetOdds: 1 },
          { Name: '点数和_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 14, RobotBetOdds: 1 },
          { Name: '点数和_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 15, RobotBetOdds: 1 },
          { Name: '点数和_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 16, RobotBetOdds: 1 },
          { Name: '点数和_7', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 17, RobotBetOdds: 1 },
          { Name: '点数和_8', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 18, RobotBetOdds: 1 },
          { Name: '点数和_9', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 19, RobotBetOdds: 1 },
          { Name: '点数和_10', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 20, RobotBetOdds: 1 },
          { Name: '点数和_11', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 21, RobotBetOdds: 1 },
          { Name: '点数和_12', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 22, RobotBetOdds: 1 },
          { Name: '点数和_13', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 23, RobotBetOdds: 1 },
          { Name: '点数和_14', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 24, RobotBetOdds: 1 },
          { Name: '点数和_15', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 25, RobotBetOdds: 1 },
          { Name: '点数和_16', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 26, RobotBetOdds: 1 },
          { Name: '点数和_17', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 27, RobotBetOdds: 1 },
          { Name: '骰子三点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 28, RobotBetOdds: 1 },
          { Name: '骰子三点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 29, RobotBetOdds: 1 },
          { Name: '骰子三点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 30, RobotBetOdds: 1 },
          { Name: '骰子三点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 31, RobotBetOdds: 1 },
          { Name: '骰子三点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 32, RobotBetOdds: 1 },
          { Name: '骰子三点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 33, RobotBetOdds: 1 },
          { Name: 'Any Triple', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 34, RobotBetOdds: 1 }

        ],
        BetOptionsRate: [
          { Name: 'SMALL', Val: 1, Id: 0 },
          { Name: 'BIG', Val: 1, Id: 1 },
          { Name: 'ANY Triple', Val: 30, Id: 2 },
          { Name: 'Each Doubule', Val: 10, Id: 3 },
          { Name: 'Each Triple', Val: 200, Id: 4 },
          { Name: '点数和_4', Val: 60, Id: 5 },
          { Name: '点数和_5', Val: 30, Id: 6 },
          { Name: '点数和_6', Val: 18, Id: 7 },
          { Name: '点数和_7', Val: 12, Id: 8 },
          { Name: '点数和_8', Val: 8, Id: 9 },
          { Name: '点数和_9', Val: 6.5, Id: 10 },
          { Name: '点数和_10', Val: 6, Id: 11 },
          { Name: '点数和_11', Val: 6, Id: 12 },
          { Name: '点数和_12', Val: 6.5, Id: 13 },
          { Name: '点数和_13', Val: 8, Id: 14 },
          { Name: '点数和_14', Val: 12, Id: 15 },
          { Name: '点数和_15', Val: 18, Id: 16 },
          { Name: '点数和_16', Val: 30, Id: 17 },
          { Name: '点数和_17', Val: 60, Id: 18 },
          { Name: 'One Dice', Val: 1, Id: 19 },
          { Name: 'Two Dice', Val: 2, Id: 20 },
          { Name: 'Three Dice', Val: 3, Id: 21 }
        ],
        FeeRate: 5,
        NoticeTime: 10,
        ExTraPayRate: 10,
        OutTime: 30,

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
      },
      isHidden: true, // 默认隐藏
      dices: [],
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
      BetOddsList: [],
      subKey: 'gameSicbo',
      libShow: $libShow,
      showSetResultPage: false,
      file_is_show: true,
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      }
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
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == '菲1-线上环境') {
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
      this.item.MinRobotMoney /= 1000
      this.item.MaxRobotMoney /= 1000
      this.item.RobotAverageBetMoney /= 1000
      for (const j in this.item.BetAreaOptions) {
        this.item.BetAreaOptions[j].MaxMoneyBet /= 1000
      }

      /*     for (const j in this.item.BetOptionsRate) {
        this.item.BetOptionsRate[j].Val /= 1000
      }*/

      for (const j in this.item.BetMoneyLevel) {
        this.item.BetMoneyLevel[j].MaxMoneyBet /= 1000
        this.item.BetMoneyLevel[j].MinMoneyBet /= 1000
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[j].TableMoney
        for (const i in this.item.BetMoneyLevel[j].TableMoney) {
          betMoneyList.push(parseInt(items[i]) / 1000)
        }
        this.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')
      }
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      ret.MinRobotMoney *= 1000
      ret.MaxRobotMoney *= 1000
      ret.RobotAverageBetMoney *= 1000

      ret.BetMoneyLevel = []
      for (const o in this.item.BetMoneyLevel) {
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[o].TableMoney.split(',')
        for (const i in items) {
          betMoneyList.push(parseInt(items[i]) * 1000)
        }

        const obj = {}
        Object.assign(obj, this.item.BetMoneyLevel[o])
        obj.MaxMoneyBet *= 1000
        obj.MinMoneyBet *= 1000
        obj.TableMoney = betMoneyList
        ret.BetMoneyLevel.push(obj)
      }
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000
      }
      ret.BetAreaOptions = []
      for (const o in this.item.BetAreaOptions) {
        const obj = {}
        Object.assign(obj, this.item.BetAreaOptions[o])
        obj.MaxMoneyBet *= 1000
        obj.OddsList = obj.OddsList.filter(function(item) {
          return JSON.stringify(item) != '{}'
        })

        ret.BetAreaOptions.push(obj)
      }

      const items = this.dices.split(',')
      ret.Dices = []
      for (const o in items) {
        ret.Dices.push(parseInt(items[o]))
      }

      /*      ret.BetOptionsRate = []
      for (const o in this.item.BetOptionsRate) {
        const obj = {}
        Object.assign(obj, this.item.BetOptionsRate[o])
        obj.Val *= 1000
        ret.BetOptionsRate.push(obj)
      }*/

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
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            this.dices = this.item.Dices ? this.item.Dices.join(',') : this.dices

            for (let i = 0; i < this.item.BetAreaOptions.length; i++) {
              if (!this.item.BetAreaOptions[i].OddsList || typeof (this.item.BetAreaOptions[i].OddsList) === 'undefined' || this.item.BetAreaOptions[i].OddsList.length == 0) {
                this.item.BetAreaOptions[i]['OddsList'] = []
                this.item.BetAreaOptions[i]['OddsList'].push({})
              } else {
                this.item.BetAreaOptions[i]['OddsList'] = this.item.BetAreaOptions[i].OddsList
              }
            }
            this.BetOddsList = this.item.BetAreaOptions
          }
        }
      })
    },
    wallpaperInput(val, index) {
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false


      for (const o in this.item.BetAreaOptions) {
          let count = 0
          for (const i in this.item.BetAreaOptions[o].OddsList) {
            count += this.item.BetAreaOptions[o].OddsList[i].Odds
          }
            if (count !== 100) {
                Message.error('extrapay倍数总概率必须等于100')
                return
            }
        for (const oi in o.Odds) {
          this.item.BetAreaOptions[o].Odds[oi].Odd = parseFloat(o[oi].Odd)
        }
      }

      for (const o in this.item.BetMoneyLevel) {
        const items = this.item.BetMoneyLevel[o].TableMoney.split(',')
        if (items.length !== 6) {
          Message.error('下注列表只能6个投注项')
          return
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
    addBetMoneyListRow() {
      this.item.BetMoneyList.push({ TableMoney: 0, MaxMoneyBet: 0, MinMoneyBet: 0 })
    },
    removeBetMoneyListRow(index) {
      this.item.BetMoneyList.splice(index, 1)
    },
    doAdd() {
      this.item.BetMoneyLevel.push({ TableMoney: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    delRow(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    }
  }
}
</script>
