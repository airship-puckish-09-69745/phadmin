<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">

        <el-col :span="8" :offset="1">
          <el-form-item label="保底奖池抽水：">
            <el-input v-model.number="item.FeeRate"><template slot="append">%</template></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="配牌16进制 (♠K,♥10): 4d,3a">
            <el-input v-model="testCards" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="用户长时间未下注提示(s):">
            <el-input v-model.number="item.NoticeTime" :required="true" @input="wallpaperInput2" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="用户长时间未下注踢出(s):">
            <el-input v-model.number="item.KicKTime" :required="true" />
          </el-form-item>
        </el-col>

        <el-col v-if="envProjectName != 'ph_audit'" :span="8" :offset="1">
          <el-form-item label="奖池不够输重新洗牌最大次数:">
            <el-input v-model.number="item.MaxCtrlTimes" :required="true" />
          </el-form-item>
        </el-col>

        <el-col v-if="envProjectName != 'ph_audit'" :span="8" :offset="1">
          <el-form-item label="extra出现概率（%）:">
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
                    <el-input v-model="scope.row.CanBet" size="mini" />
                  </template>
                </el-table-column>
<!--                <el-table-column-->
<!--                  prop="Low"-->
<!--                  label="最大下注限制"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-input v-model="scope.row.MaxMoneyBet" size="mini" />-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  prop="Low"-->
<!--                  label="最小下注限制"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-input v-model.number="scope.row.MinMoneyBet" size="mini" />-->
<!--                  </template>-->
<!--                </el-table-column>-->
                <el-table-column label="操作"   >
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

            <!--            <el-descriptions class="margin-top" border>-->
            <!--              <el-descriptions-item>-->
            <!--                <span style="color:red;"> 说明: 1.赔率不支持小数填写real*100或者real*10 [*10就是只支持1位小数 *100只支持两位小数]，例如*100时期望是2.06 填写206 </span>-->
            <!--              </el-descriptions-item>-->
            <!--            </el-descriptions>-->
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
                  v-if="envProjectName != 'ph_audit'"
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

                <el-table-column
                  label="赔率(支持2位小数)"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Odds" type="number" :step="0.01" size="mini" oninput="if(value < 0 || value == '' || value == null){value = 0;}" />
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="envProjectName != 'ph_audit'"
                  label="出现extra概率(%)"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ERate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="envProjectName != 'ph_audit'"
                  label="extra倍数(支持1位小数)"
                  width="320"
                >

                  <template slot-scope="scope">
                    <div v-if="BetOddsList[scope.$index]">
                      <div v-for="(data, index ) in BetOddsList[scope.$index].EOddsCfg" style="line-height: 1.5; ">
                        <el-row style="line-height: 1.5; ">
                          <a size="mini" type="primary" @click="addOddsList(scope.$index)">+</a>
                          <span style="margin-left: 20px">倍数:</span>
                          <el-input
                            v-model.number="data.EOdds"
                            type="number"
                            size="mini"
                            style="width: 80px"
                            placeholder="倍数"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}"
                            @input="wallpaperInput(scope.$index,index)"
                          />
                          <span style="margin-left: 10px">权重:</span>
                          <el-input
                            v-model.number="data.Weight"
                            size="mini"
                            style="width: 80px"
                            placeholder="权重"
                            @input="wallpaperInput(scope.$index,index)"
                          />
                          <a style="margin-left: 20px" type="danger" size="mini" @click="delOddsList(scope.$index,index)">-</a>
                        </el-row>
                      </div>

                    </div>
                  </template>

                </el-table-column>

              </el-table>
            </el-row>
          </fieldset>

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
      item: {
        BetMoneyLevel: [{ CanBet: 100, MaxMoneyBet: 2000, MinMoneyBet: 10 }],
        BetAreaOptions: [
          { Name: '龙', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 0, RobotBetRate: 1 },
          { Name: '虎', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 1, RobotBetRate: 1 },
          { Name: '龙♠♣', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 2, RobotBetRate: 1 },
          { Name: '龙♥♦', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 3, RobotBetRate: 1 },
          { Name: 'TIE', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 4, RobotBetRate: 1 },
          { Name: '虎♠♣', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 5, RobotBetRate: 1 },
          { Name: '虎♥♦', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 6, RobotBetRate: 1 },
          { Name: '2,26', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 7, RobotBetRate: 1 },
          { Name: '3-6', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 8, RobotBetRate: 1 },
          { Name: '7-11', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 9, RobotBetRate: 1 },
          { Name: '12-16', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 10, RobotBetRate: 1 },
          { Name: '17-21', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 11, RobotBetRate: 1 },
          { Name: '22-25', ERate: 10, EOdds: 5, MaxMoneyBet: 2000, Id: 12, RobotBetRate: 1 }

        ],
        FeeRate: 5,
        KicKTime: 10,
        MaxCtrlTimes: 20,
        ExTraPayRate: 10,

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
      isHidden: true, // 默认隐藏
      testCards: '',
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
      subKey: 'miniDvt_cfg',
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
      this.item.RobotCfg.MinRobotMoney /= 1000
      this.item.RobotCfg.MaxRobotMoney /= 1000
      this.item.RobotCfg.RobotAverageBetMoney /= 1000
      for (const j in this.item.BetAreaOptions) {
        this.item.BetAreaOptions[j].MaxMoneyBet /= 1000
      }

      for (const i in this.item.BetAreaOptions) {
        this.item.BetAreaOptions[i].Odds /= 1000
        for (const o of this.item.BetAreaOptions[i].EOddsCfg) {
          o.EOdds = o.EOdds / 1000
        }
      }

      for (const j in this.item.BetMoneyLevel) {
        this.item.BetMoneyLevel[j].MaxMoneyBet /= 1000
        this.item.BetMoneyLevel[j].MinMoneyBet /= 1000
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[j].CanBet
        for (const i in this.item.BetMoneyLevel[j].CanBet) {
          betMoneyList.push(parseInt(items[i]) / 1000)
        }
        this.item.BetMoneyLevel[j].CanBet = betMoneyList.join(',')
      }
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))

      // Object.assign(ret, this.item)
      ret.RobotCfg.MinRobotMoney *= 1000
      ret.RobotCfg.MaxRobotMoney *= 1000
      ret.RobotCfg.RobotAverageBetMoney *= 1000

      ret.BetMoneyLevel = []
      for (const o in this.item.BetMoneyLevel) {
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[o].CanBet.split(',')
        for (const i in items) {
          betMoneyList.push(parseInt(items[i]) * 1000)
        }

        const obj = {}
        Object.assign(obj, this.item.BetMoneyLevel[o])
        obj.MaxMoneyBet *= 1000
        obj.MinMoneyBet *= 1000
        obj.CanBet = betMoneyList
        ret.BetMoneyLevel.push(obj)
      }
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000
      }
      ret.BetAreaOptions = []
      for (const o in this.item.BetAreaOptions) {
        const obj = JSON.parse(JSON.stringify(this.item.BetAreaOptions[o]))
        // Object.assign(obj, this.item.BetAreaOptions[o])
        obj.MaxMoneyBet *= 1000
        obj.Odds *= 1000
        for (const j in obj.EOddsCfg) {
          obj.EOddsCfg[j].EOdds *= 1000
        }
        ret.BetAreaOptions.push(obj)
      }

      const items = this.testCards.split(',')
      ret.TestCards = []
      for (const o in items) {
        ret.TestCards.push(parseInt(items[o], 16))
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
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            this.testCards = this.item.TestCards ? this.item.TestCards.map(card => Number(card).toString(16)).join(',') : this.testCards

            for (let i = 0; i < this.item.BetAreaOptions.length; i++) {
              if (!this.item.BetAreaOptions[i].EOddsCfg || typeof (this.item.BetAreaOptions[i].EOddsCfg) === 'undefined' || this.item.BetAreaOptions[i].EOddsCfg.length == 0) {
                this.item.BetAreaOptions[i]['EOddsCfg'] = []
                this.item.BetAreaOptions[i]['EOddsCfg'].push({})
              } else {
                this.item.BetAreaOptions[i]['EOddsCfg'] = this.item.BetAreaOptions[i].EOddsCfg
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
    wallpaperInput2(val, index) {
      this.$forceUpdate()
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      for (const o in this.item.BetAreaOptions) {
        for (const oi in o.ERate) {
          this.item.BetAreaOptions[o].ERate[oi].Odd = parseInt(o[oi].Odd)
        }
      }

      for (const o in this.item.BetMoneyLevel) {
        const items = this.item.BetMoneyLevel[o].CanBet.split(',')
        if (items.length !== 6) {
          Message.error('下注列表只能6个投注项')
          return
        }
      }

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
    addOddsList(idx) {
      this.BetOddsList[idx].EOddsCfg.push({})
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    delOddsList(idx, index) {
      if (this.BetOddsList[idx].EOddsCfg.length == 1) {
        this.BetOddsList[idx].EOddsCfg.push({})
      }
      this.BetOddsList[idx].EOddsCfg.splice(index, 1)
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    addBetMoneyListRow() {
      this.item.BetMoneyList.push({ CanBet: 0, MaxMoneyBet: 0, MinMoneyBet: 0 })
    },
    removeBetMoneyListRow(index) {
      this.item.BetMoneyList.splice(index, 1)
    },
    doAdd() {
      this.item.BetMoneyLevel.push({ CanBet: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    delRow(index) {
      this.item.BetMoneyLevel.splice(index, 1)
    }
  }
}
</script>
