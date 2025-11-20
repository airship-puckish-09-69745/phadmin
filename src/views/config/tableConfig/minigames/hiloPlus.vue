<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
      <el-button type="warning" round @click="showUserArea">用户在玩图案</el-button>
    </el-row>
    <!--公共配置-->
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="最低下注(放大1000倍)：">
              <el-input v-model.number="item.MinBet" />
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="单局最大时间：">
              <el-input v-model.number="item.ActionSeconds"><template slot="append">秒</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="下注额度(示例:4000,300,10,3000,200,5,2000,100,3,1000,50,2,50,20,1)">
              <el-input v-model="item.BetMoney" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="Jackpot贡献率：">
              <el-input v-model.number="item.JackpotFee"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
          <!-- <p>
          <el-col :span="7" :offset="1">
            <el-form-item label="中Jackpot后的Jackpot贡献率：">
              <el-input v-model.number="item.HitJackpotFee"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
          </p> -->
          <el-col :span="7" :offset="1">
            <el-form-item label="解锁Jackpot最小下注(放大1000倍)：">
              <el-input v-model.number="item.JackpotBetMin" />
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="跳过次数：">
              <el-input v-model.number="item.SkipNum" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>

          <el-col :span="7">
            <el-form-item label="中奖抽水率：">
              <el-input v-model.number="item.HitFeeRate"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="保底奖池抽水：">
              <el-input v-model.number="item.FeeRate"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="配牌(仅点击右上角用户在玩图案后对该用户生效 格式:A23456789XJQK)： 流程: 填写配牌数据>保存>测试>确定>进桌>用户在玩图案>填写uid>执行">
              <el-input v-model="item.TestCards" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <p> 提审 牌值的概率\倍率控制
        <el-row>
          <fieldset style="margin-top:10px">
            <legend>概率\倍率配置 -----
              <el-switch
                v-model="item.HasWinRate"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开"
                inactive-text="关"
              />
            </legend>

            <el-row>
              <el-button type="primary" size="mini" @click="addWinRateRow">添加</el-button>
            </el-row>

            <el-row>
              <template>
                <el-table :data="item.WinRateItems" border>

                  <el-table-column prop="Type" label="牌值">
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.Card" size="small" placeholder="placeholder">
                        <el-option label="A" :value="1" />
                        <el-option label="2" :value="2" />
                        <el-option label="3" :value="3" />
                        <el-option label="4" :value="4" />
                        <el-option label="5" :value="5" />
                        <el-option label="6" :value="6" />
                        <el-option label="7" :value="7" />
                        <el-option label="8" :value="8" />
                        <el-option label="9" :value="9" />
                        <el-option label="10" :value="10" />
                        <el-option label="J" :value="11" />
                        <el-option label="Q" :value="12" />
                        <el-option label="K" :value="13" />
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column label="top概率(‱)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.TopRate" />
                    </template>
                  </el-table-column>

                  <el-table-column label="down概率(‱)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.DownRate" />
                    </template>
                  </el-table-column>

                  <el-table-column label="top倍率(*100)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.TopOdds" />
                    </template>
                  </el-table-column>

                  <el-table-column label="down倍率(*100)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.DownOdds" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button size="mini" type="danger" @click="removeWinRateRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-row>
          </fieldset>
        </el-row>
        </p> -->

        <el-row>
          <fieldset style="margin-top:10px">
            <legend>Jackpot 位置配置</legend>

            <el-row v-if="envProjectName == 'ph_audit'" style="margin-top:10px">

              <el-col :span="7">
                <el-form-item label="每一张牌触发Jackpot的概率">
                  <el-input v-model.number="item.HitJackpotRate"><template slot="append">‱</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="envProjectName != 'ph_audit'" style="margin-top:10px">
              <el-col :span="7">
                <el-form-item label="总控：(比如这个值配置成11 那么玩家每局有万分之11的概率有jp出现 具体出现在哪张由分布配置决定)">
                  <el-input v-model.number="item.JpRate"><template slot="append">‱</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item v-if="envProjectName != 'ph_audit'" label=" ---- 根据分布概率随机取出其中一张牌">
              <el-button type="primary" size="mini" @click="addJackpotDistributionRow">添加</el-button>
            </el-form-item>
            <el-row v-if="envProjectName != 'ph_audit'">
              <template>
                <el-table :data="item.JackpotDistributionItems" border>
                  <el-table-column label="范围开始(第N张牌)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.Start" />
                    </template>
                  </el-table-column>
                  <el-table-column label="范围结束(第N张牌)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.End" />
                    </template>
                  </el-table-column>
                  <el-table-column label="概率%(放大100倍, 如 20 表示20%)">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.Rate" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button size="mini" type="danger" @click="removeJackpotDistributionRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-row>
          </fieldset>
        </el-row>

        <el-row>
          <fieldset style="margin-top:10px">
            <legend>Jackpot 奖励配置</legend>
            <el-alert
              type="success"
              description="根据概率比例必然出现一个，玩家获得的JP奖励=JP总额*JP档次对应奖励占比/100"
            />

            <el-table
              :data="item.JackpotCfg"
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
                v-if="envProjectName=='ph_audit'"
                label="概率(Jackpot调控开启后此配置无效)"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Rate"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
            </el-table>

          </fieldset>
        </el-row>
      </el-form>
    </el-row>

    <fieldset v-if="envProjectName != 'ph_audit'" style="margin-top:20px;">
      <legend>jackpot调控配置
        <!--
          <el-switch
          v-model="item.JackpotRegulation.ToggleSwitch"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开"
          inactive-text="关"
        />
        -->
      </legend>
      <!--

      <el-descriptions>
        <el-descriptions-item>
          <span style="color:red;">开启后，Jackpot的中奖概率以下表数值为准。(审核版无效)</span>
        </el-descriptions-item>
      </el-descriptions>
-->

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
          <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="分段限制" prop="DayLimitArr">
            <template slot-scope="scope">
              <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showDayLimitDialog(scope.row)" />
              <el-tag v-for="tag, key in scope.row.DayLimitArr" v-if="scope.row.AwardType == 1" :key="key" disable-transitions>{{ showOpenDayLimit(tag) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="玩家开奖池条件(%)" width="300">
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

          <el-table-column label="机器人开奖池值" prop="PoolVal">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
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
              <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
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

    <el-row>
      <el-col style="margin-top:16px;" :offset="8" :span="8">
        <el-button type="primary" size="mini" @click="setData()">保存</el-button>
      </el-col>
    </el-row>

    <el-dialog
      title="查看玩家在玩图案"
      :modal="false"
      :visible.sync="showArea.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="showArea" label-width="120px" size="small">
          <el-form-item label="玩家id：">
            <el-input v-model.number="showArea.uid" size="11" placeholder="请输入在用户id" />
          </el-form-item>
          <el-form-item label="生成图案：">
            <div id="hiloShow" v-html="hiloData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goSearch">执行</el-button>
          </el-form-item>
        </el-form>
      </el-row>
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
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        JackpotDistributionItems: [],
        JackpotRegulation: {
          BetMoreThan: 0,
          AddPoolPctAfterJp: 0,
          AddPoolPctPreJp: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: []
        },
        jackpotShowOption: { '2': 14, '3': 12, '4': 8, '5': 6, '6': 5, '7': 5, '8': 4, '9': 4, '10': 3, '11': 3, '12': 2, '13': 2, '14': 2, '15': 2, '16': 2, '17': 2, '18': 2, '19': 1, '20': 1, '21': 1, '22': 1, '23': 1, '24': 1 }
  	  },
      load: false,
      form: {
      },
      showArea: {
        visible: false,
        uid: 0,
        showUlReslt: false
      },
      envProjectName: process.env.VUE_APP_PROJECT,
      hiloData: '',
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      levelCfg: {
      	1: 'Easy',
      	2: 'Medium',
      	3: 'Hard',
      	4: 'Expert',
      	5: 'Master',
      	6: 'Nightmare'
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
      txt: '',
      libShow: $libShow,
      JackpotRandAwards: [],
      incrJackpotForm: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      subKey: 'hiloPlus_cfg'
    }
  },

  created() {
    this.getData()
    console.log(1)
  },
  methods: {
  	getLabelName(k) {
  		return this.levelCfg[k]
  	},
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
          console.log('hilo cfg', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
          	const cfg = JSON.parse(response.Data.Data)
            this.item = cfg

            for (const k in this.item.JackpotRegulation.RandAwards) {
              this.item.JackpotRegulation.RandAwards[k].PoolVal /= 1000
            }
            this.JackpotRandAwards = this.item.JackpotRegulation.RandAwards
            // 设置修改之前数据
            console.log('JackpotRandAwards', this.JackpotRandAwards)
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    showOpenDayLimit(data) {
      return '[' + data['StartHours'] + ',' + data['EndHours'] + ')点：' + data['Num'] + '个'
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      const jackpotInfo = {}
      Object.assign(jackpotInfo, this.item.JackpotRegulation)
      jackpotInfo.RandAwards = []
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        this.JackpotRandAwards[o].AwardRate = this.item.JackpotCfg[o].AwardRate // 同步奖励占比
        Object.assign(raObj, this.JackpotRandAwards[o])
        raObj.PoolVal *= 1000
        jackpotInfo.RandAwards.push(raObj)
      }
      ret.JackpotRegulation = jackpotInfo
      console.log(ret.JackpotRegulation)

      return ret
    },
    setData() {
    	// 检验
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      console.log(this.form.Data)
      this.$refs.compare.SetNewVal(this.form.Data)
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
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    },
    showUserArea() {
      this.showArea.visible = true
    },
    showOpenPoolRate(jpType, data) {
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
    saveIncrJackpotDialog() {
      for (var i = 0; i < this.item.JackpotRegulation.PoolIncrArr.length; i++) {
        if (this.item.JackpotRegulation.PoolIncrArr[i].Id == this.incrJackpotForm.id) {
          this.item.JackpotRegulation.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (var j = 0; j < this.item.JackpotRegulation.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.JackpotRegulation.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
          }
          break
        }
      }
      this.incrJackpotForm.visible = false
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
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
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
    showDayLimitDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      this.dayLimitChange.title = this.JackpotTypeCfg[data.JackpotType] + '(分段限制)'
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
    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showPoolNumDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      this.poolNumChange.title = this.JackpotTypeCfg[data.JackpotType] + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    // 展示jackpot奖池增长标题
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    // 展示jackpot每小时增长值
    getJackpotIncrShow(row, startHour, endHour) {
      let showNum = 0
      for (let i = 0; i < row.TimeArr.length; i++) {
        if (row.TimeArr[i].StartHour == startHour && row.TimeArr[i].EndHour == endHour) {
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
    },
    // 添加JP分布
    addJackpotDistributionRow() {
      // console.log(this.item.JackpotDistributionItems)
      const newRow = {
        Range: '',
        Rate: 0
      }
      this.item.JackpotDistributionItems.push(newRow)
    },
    // 删除JP分布
    removeJackpotDistributionRow(index) {
      this.item.JackpotDistributionItems.splice(index, 1)
    },
    // 添加card的概率\倍率配置
    addWinRateRow() {
      const newRow = {
        Card: 0,
        TopRate: 0,
        TopOdds: 0,
        DownRate: 0,
        DownOdds: 0
      }
      this.item.WinRateItems.push(newRow)
    },
    // 删除card的概率\倍率配置
    removeWinRateRow(index) {
      this.item.WinRateItems.splice(index, 1)
    },

    goSearch() {
      this.showArea.showUlReslt = false
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/show/hilo',
          Gid: 140,
          Uid: this.showArea.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.hiloData = response.Data.details
              this.showArea.showUlReslt = true
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}

#hiloShow table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

#hiloShow table td{
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}

</style>
