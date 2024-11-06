<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </el-row>
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="保底奖池抽水：">
              <el-input v-model.number="item.FeeRate"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="Jackpot贡献率：">
              <el-input v-model.number="item.JackpotContributeRate"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="解锁Jackpot最小下注：">
              <el-input v-model.number="item.JackpotBetMin" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="换牌操作超时时间：">
              <el-input v-model.number="item.SwapSeconds"><template slot="append">秒</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="长时间未下注提醒：">
              <el-input v-model.number="item.NoticeTime"><template slot="append">秒</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="下注额度(示例:1,2,3,4,5,6,7,8,9,10,15,20,30,40,50,80,100,200)">
              <el-input v-model="BetLevelText" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="配牌16进制，5张牌(♠K,♥10): 4d,3a：">
              <el-input v-model="TestCardsText" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="isHiddenWild ? 24 : 12">
            <fieldset style="margin-top:10px">
              <legend>Jacks or Better 玩法牌型赔率</legend>

              <el-table
                :data="JbOddsList"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="牌型ID"
                  width="70"
                >
                  <template slot-scope="scope">
                    {{ scope.row.CardType }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="牌型"
                  width="280"
                >
                  <template slot-scope="scope">
                    {{ JbCardTypes[scope.row.CardType] }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="赔率"
                  width="380"
                >
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.Odds !== undefined" v-model.number="scope.row.Odds" /><el-input v-else disabled />
                  </template>
                </el-table-column>
              </el-table>

            </fieldset>
          </el-col>
          <el-col v-if="!isHiddenWild" :span="12">
            <fieldset style="margin-top:10px">
              <legend>Deuces Wild 玩法牌型赔率</legend>

              <el-table
                :data="DwOddsList"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="牌型ID"
                  width="70"
                >
                  <template slot-scope="scope">
                    {{ scope.row.CardType }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="牌型"
                  width="280"
                >
                  <template slot-scope="scope">
                    {{ DwCardTypes[scope.row.CardType] }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="赔率"
                  width="380"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Odds" />
                  </template>
                </el-table-column>
              </el-table>

            </fieldset>
          </el-col>
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
        </el-row>
      </el-form>
    </el-row>

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
          <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
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

    <el-row>
      <el-col style="margin-top:16px;" :offset="8" :span="8">
        <el-button type="primary" size="mini" @click="setData()">保存</el-button>
      </el-col>
    </el-row>

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

<style scoped>

</style>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow } from '@/utils/common'
import emojPrice from "@/views/config/baseConfig/emojPrice.vue";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        JackpotRegulation: {
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: []
        },
        JackpotContributeRate: 10,
        JackpotBetMin: 10000,
        SwapSeconds: 30,
        NoticeTime: 30,
        TestCards: [],
        CardTypeOdds: {
          JbOddsList: [],
          DwOddsList: []
        },
        BetLevel: [{ CanBet: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000], MaxMoneyBet: 2000, MinMoneyBet: 10 }]
      },
      load: false,
      isHiddenWild: true,
      form: {
      },
      JbOddsList: [],
      DwOddsList: [],
      TestCardsText: '',
      BetLevelText: '',
      envProjectName: process.env.VUE_APP_PROJECT,
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      JbCardTypes: {
        0: '皇家同花顺（Royal Flush）',
        1: '同花顺（Straight Flush）',
        2: '四条（Four of a Kind）',
        3: '葫芦（Full House）',
        4: '同花（Flush）',
        5: '顺子（Straight）',
        6: '三条（Three of a Kind）',
        7: '两对（Two Pair）',
        8: '杰克更好（Jacks or Better）'
      },
      DwCardTypes: {
        0: '天然皇家同花顺（Natural Royal Flush）',
        1: '4张2（4 Deuces）',
        2: '癞子皇家同花顺（Wild Royal Flush）',
        3: '5条（Five of a Kind）',
        4: '同花顺（Straight Flush）',
        5: '四条（Four of a Kind）',
        6: '葫芦（Full House）',
        7: '同花（Flush）',
        8: '顺子（Straight）',
        9: '三条（Three of a Kind）'
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
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
      subKey: 'videoPoker_cfg'
    }
  },

  created() {
    console.log(process.env.VUE_APP_PROJECT_NAME)
    if (process.env.VUE_APP_PROJECT_NAME === '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME === '菲1-线上环境' || process.env.VUE_APP_PROJECT_NAME === 'Zoo-线上环境') {
      this.isHiddenWild = false
    }
    this.getData()
    console.log(1)
  },
  methods: {
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
          console.log('video poker cfg', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.item = JSON.parse(response.Data.Data)

            // 将TestCards转换成以英文逗号相隔的16进制字符串
            this.TestCardsText = this.item.TestCards ? this.item.TestCards.map(card => Number(card).toString(16)).join(',') : this.TestCardsText

            this.transMoneyForShow()

            this.JbOddsList = this.item.CardTypeOdds.JbOddsList
            this.JbOddsList.push({})
            this.DwOddsList = this.item.CardTypeOdds.DwOddsList

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
    updateBetLevelText() {
      // 将BetLevel转换成以英文逗号相隔的字符串
      this.BetLevelText = ''
      if (this.item.BetLevel.CanBet && this.item.BetLevel.CanBet.length > 0) {
        for (const i in this.item.BetLevel.CanBet) {
          this.BetLevelText += this.item.BetLevel.CanBet[i] / 1000 + ','
        }
        this.BetLevelText = this.BetLevelText.substring(0, this.BetLevelText.length - 1)
      }
    },
    transMoneyForShow() {
      this.updateBetLevelText()
      this.item.JackpotBetMin /= 1000

      for (const i in this.item.CardTypeOdds.JbOddsList) {
        this.item.CardTypeOdds.JbOddsList[i].Odds /= 1000
      }

      for (const i in this.item.CardTypeOdds.DwOddsList) {
        this.item.CardTypeOdds.DwOddsList[i].Odds /= 1000
      }
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      ret.JackpotBetMin *= 1000
      ret.CardTypeOdds.JbOddsList = []
      for (const i in this.JbOddsList) {
        if (this.JbOddsList[i].Odds === undefined) {
          continue
        }
        const jbObj = {}
        Object.assign(jbObj, this.JbOddsList[i])
        jbObj.Odds *= 1000
        ret.CardTypeOdds.JbOddsList.push(jbObj)
      }

      ret.CardTypeOdds.DwOddsList = []
      for (const i in this.DwOddsList) {
        if (this.DwOddsList[i].Odds === undefined) {
          continue
        }
        const dwObj = {}
        Object.assign(dwObj, this.DwOddsList[i])
        dwObj.Odds *= 1000
        ret.CardTypeOdds.DwOddsList.push(dwObj)
      }

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
      if (this.BetLevelText.length > 0) {
        const betArr = this.BetLevelText.split(',')
        for (const k in betArr) {
          const val = parseInt((betArr[k] * 1000).toString())
          if (val <= 0) {
            continue
          }
          this.item.BetLevel.CanBet[k] = val
        }
        // 将BetLevel.CanBet按升序排列
        this.item.BetLevel.CanBet.sort(function(a, b) {
          return a - b
        })
        this.item.BetLevel.MinMoneyBet = this.item.BetLevel.CanBet[0]
        this.item.BetLevel.MaxMoneyBet = this.item.BetLevel.CanBet[this.item.BetLevel.CanBet.length - 1]
        this.updateBetLevelText()
      }

      this.item.TestCards = []
      if (this.TestCardsText.length > 0) {
        const testCards = this.TestCardsText.split(',')
        for (const k in testCards) {
          const val = parseInt(testCards[k], 16)
          if (val <= 0) {
            continue
          }
          this.item.TestCards[k] = val
        }
      }

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
