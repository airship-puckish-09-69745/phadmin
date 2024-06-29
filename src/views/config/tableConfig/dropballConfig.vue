<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row>
      <el-button type="primary" @click="dialogFormVisible= true" size="mini" > 测试配置</el-button>
      <span v-if="item.openTest=='2'">
         <el-alert
           title="测试模式已开启,记得关闭"
           type="error">
  </el-alert>
      </span>
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
                    <el-form-item label="抽水额度">
                      <el-input v-model.number="item.FeeRate" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <fieldset style="margin-top:10px">
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
                      <el-button
                        size="mini"
                        type="primary"
                        @click="doAddBetMoneyLevel"
                      >添加
                      </el-button>
                      <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(scope.$index)">删除</el-button>
                    </template>

                  </el-table-column>
                </el-table>
              </fieldset>

              <fieldset style="margin-top:10px">
                <legend>中奖倍率配置
                </legend>
                <el-table
                  ref="filterTable"
                  :data="item.BetOptionsRate"
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
                  <el-table-column label="Card" width="70px">
                    <template slot-scope="scope">
                      <el-image
                        style="width: 37px;height: 50px"
                        :src="getCardUrl(imgMap[scope.row.Id])"
                      />
                    </template>
                  </el-table-column>

                  <el-table-column label="中奖倍率">
                    <el-table-column :label="'一球'">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Val[0]" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="'两球'">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Val[1]" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="'三球'">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Val[2]" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="单个区域最大下注额度">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].MaxMoneyBet" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="机器人次区域下注概率">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].RobotBetOdds" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="doAddBetOptionsRate">添加</el-button>
                      <el-button type="danger" size="mini" @click="delBetOptionsRate(scope.$index)">删除</el-button>
                    </template>

                  </el-table-column>
                </el-table>
              </fieldset>

              <fieldset style="margin-top:10px">
                <legend>LuckyPachinko配置
                </legend>
                <el-table
                  ref="filterTable"
                  :data="item.LuckyPachinkoCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="ID">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Id" size="mini" disabled />
                    </template>
                  </el-table-column>
                  <el-table-column label="是否jackpot">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.IsJackpot"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="倍数">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Multiple" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="中奖概率">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Rate" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="无Jackpot中奖概率">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.OtherRate" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="doAddLuckyPachinkoCfg">添加</el-button>
                      <el-button type="danger" size="mini" @click="delLuckyPachinkoCfg(scope.$index)">删除</el-button>
                    </template>

                  </el-table-column>
                </el-table>
              </fieldset>

              <!--              <fieldset style="margin-top:10px">-->
              <!--                <legend>投注区域配置-->
              <!--                </legend>-->
              <!--                <el-table-->
              <!--                  ref="filterTable"-->
              <!--                  :data="item.BetAreaOptions"-->
              <!--                  border-->
              <!--                  :header-cell-style="libShow.DefaultTableHeadClass"-->
              <!--                  :row-style="{height:'10px'}"-->
              <!--                  :cell-style="libShow.DefaultTableCell"-->
              <!--                  style="width: 100%"-->
              <!--                >-->
              <!--                  <el-table-column label="ID">-->
              <!--                    <template slot-scope="scope">-->
              <!--                      <el-image-->
              <!--                        style="width: 37px;height: 50px"-->
              <!--                        :src="getCardUrl(cardConversionColor(scope.row.Id,'2-2','4-4','3-3','1-1'))"-->
              <!--                      />-->
              <!--                      <el-input v-model.number="scope.row.Id" size="mini" style="width: 80px"/>-->
              <!--                    </template>-->
              <!--                  </el-table-column>-->
              <!--                </el-table>-->
              <!--              </fieldset>-->
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
                  <el-form-item label="最器人下注次数下限:">
                    <el-input v-model.number="item.MinRobotBetTimes" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最器人下注次数上限">
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
                  <el-form-item label="jackpot服务费*bet">
                    <el-input v-model.number="JackpotCfg.JackpotFee" size="mini" />
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
                  <el-form-item label="每小时局数">
                    <el-input v-model.number="JackpotCfg.PerHourRound" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <fieldset style="margin-top:10px">
              <legend>jackpot每日限制</legend>
              <jackpot-day-limit :jackpot-rand-awards="RandAwards" />
            </fieldset>

            <fieldset style="margin-top:10px">
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
        <el-form-item label="选择牌组">
          <span v-for="(k,idx) in item.Dices">
            <el-select v-model="item.Dices[idx]" placeholder="请选择" size="mini" style="width: 140px">
            <el-option
              v-for="(k,v) in imgMap"
              :label="v"
              :value="parseInt(v)"
            >
            </el-option>
          </el-select>
          </span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
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
import { $libShow, DataRule } from '@/utils/common'
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
      item: {},
      form: {},
      subKey: 'gameDropball',
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
      dialogFormVisible: false,
      imgMap:{
        0:57,
        1:74,
        2:59,
        3:76,
        4:61,
        5:65,
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
    doAddBetOptionsRate() {
      if (!this.item.BetOptionsRate) {
        this.item.BetOptionsRate = []
      }
      this.item.BetOptionsRate.push({ Id: this.item.BetOptionsRate.length + 1, Val: [0, 0, 0] })
      this.item.BetOptionsRate.push({ Id: this.item.BetOptionsRate.length + 1, Val: [0, 0, 0] })
      this.doAddBetAreaOptions()
    },
    delBetOptionsRate(index) {
      this.item.BetOptionsRate.splice(index, 1)
      this.delBetAreaOptions(index)
    },
    transMoneyForShow() {
      let that = this
      that.item.MinRobotMoney /=  1000
      that.item.MaxRobotMoney /= 1000

      for (const o of that.item.LuckyPachinkoCfg) {
        o.Multiple /= 1000
      }
      for (const o of  that.item.BetAreaOptions) {
        o.MaxMoneyBet /= 1000
      }
      for (const j in that.item.BetOptionsRate) {
        for (const o in that.item.BetOptionsRate[j].Val) {
          that.item.BetOptionsRate[j].Val[o] /= 1000
        }
      }

      for (const j in that.item.BetMoneyLevel) {
        that.item.BetMoneyLevel[j].MaxMoneyBet /= 1000
        that.item.BetMoneyLevel[j].MinMoneyBet /= 1000
        const betMoneyList = []
        for (const o of that.item.BetMoneyLevel[j].TableMoney) {
          betMoneyList.push(o / 1000)
        }
        that.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')

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

            this.RandAwards = item.JackpotCfg.JackpotRegulation.RandAwards
            if (!item.BetAreaOptions) {
              item['BetAreaOptions'] = []
              item.BetAreaOptions.push({ Id: 0, MaxMoneyBet: 0, RobotBetOdds: 0 })
            }
            this.JackpotCfg = item.JackpotCfg
            this.PoolIncrArr = item.JackpotCfg.JackpotRegulation.PoolIncrArr
            item.MinRobotMoney /=  1000
             item.MaxRobotMoney /= 1000

             if (!item.Dices){
               item["Dices"] = [0,0,0]
               item["openTest"] = "1"
             }

            Object.assign(this.item, item)
            console.log('item', this.PoolIncrArr)

            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            if (item.DropballLevelItem) {
              item['item.DropballLevelItem'] = []
            }
            this.item = item
            console.log(item)
          }
        }
      })
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))
      let betItem = {}
      for (const o of ret.LuckyPachinkoCfg) {
        o.Multiple *= 1000
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
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Dices']
      }

      for (const o of  ret.BetAreaOptions) {
        o.MaxMoneyBet *= 1000
      }
      for (const i in ret.BetOptionsRate) {
        ret.BetOptionsRate[i].Id = parseInt(ret.BetOptionsRate[i].Id)
        for (const j in ret.BetOptionsRate[i].Val) {
          ret.BetOptionsRate[i].Val[j] *= 1000
        }
        ret.BetAreaOptions[i].Id = ret.BetOptionsRate[i].Id
      }
      ret.JackpotCfg = this.JackpotCfg
      ret.MinRobotMoney *= 1000
      ret.MaxRobotMoney *= 1000

      if (ret.openTest=="2") {
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
      this.item.BetAreaOptions.push({ Id: maxId + 1, MaxMoneyBet: 0, RobotBetOdds: 0 })
    },
    delBetAreaOptions(index) {
      this.item.BetAreaOptions.splice(index, 1)
    },
    getCardUrl(card) {
      try {
        return require('@/assets/poker/' + card + '.png')
      } catch (e) {
        console.log(e)
      }
    },
    setData() {
      this.form.Data = JSON.stringify(this.getPostData())
      console.log(this.form)
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

    doAddLuckyPachinkoCfg() {
      if (!this.item.LuckyPachinkoCfg) {
        this.item['LuckyPachinkoCfg'] = []
      }
      var maxId = 0
      for (const argument of this.item.LuckyPachinkoCfg) {
        if (argument.Id > maxId) {
          maxId = argument.Id
        }
      }
      this.item.LuckyPachinkoCfg.push({ Id: maxId + 1, IsJackpot: false, Multiple: 0, Rate: 0, OtherRate: 0 })
    },
    delLuckyPachinkoCfg(index) {
      this.item.LuckyPachinkoCfg.splice(index, 1)
    },
    doAddBetMoneyLevel() {
      if (!this.item.BetMoneyLevel) {
        this.item['BetMoneyLevel'] = []
      }

      this.item.BetMoneyLevel.push({ TableMoney: '60,100,200,400,600,2000', MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
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
