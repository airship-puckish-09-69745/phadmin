<template>
  <div class="app-container">
    <el-row type="flex" align="middle" style="margin-bottom: 10px;">
      <span style="width: 120px; color: #A8A8A8; font-size: 13px; font-weight: bold;position:relative;top:-5px;">都要点一下 base：</span>
      <publish style="width: 90%;" primary-key="ID" :key-id="getFullKeyBase()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row type="flex" align="middle" style="margin-bottom: 10px;">
      <span style="width: 120px; color: #A8A8A8; font-size: 13px; font-weight: bold;position:relative;top:-5px;">都要点一下 ext：</span>
      <publish style="width: 90%;" primary-key="ID" :key-id="getFullKeyExt()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-col :span="16" :offset="3">
            <el-row>
              <el-row>
                <el-form>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="保底奖池抽水">
                      <el-input v-model.number="itemBase.FeeRate" size="mini">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="自动敲击次数(∞用-1表示)">
                      <el-input v-model="itemBase.AutoTimes" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <fieldset style="margin-top:10px">
                <el-table
                  ref="filterTable"
                  :data="itemBase.BetLevel"
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
                    label="下注列表(支持2位小数)"
                  >
                    <template slot="header">
                      <p style="text-align: center">  下注列表 (注:只支持1位小数)</p>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.CanBet" size="mini" @change="canbetChange"/>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">

                    <!--                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="doAdd"
                      >添加</el-button>
                      <el-button type="danger" size="mini" @click="delRow(scope.$index)">删除</el-button>
                    </template>-->

                  </el-table-column>
                </el-table>
              </fieldset>

            </el-row>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="算分相关">
          <el-row :span="16" :offset="3" style="width: 80%; margin: 0 auto">
            <fieldset style="margin-top:10px">
              <legend>算分相关</legend>
              <el-row style="margin-bottom: 32px;"></el-row>
              <el-row>
                <el-col :span="24" :offset="3">
                  <el-form inline>
                    <el-form-item label="目标rtp" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.RtpTarget" size="mini" :required="true"> <template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="piggy boom rtp" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.RtpPiggyBoom" size="mini" :required="true"> <template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="piggy boom威力" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.OddsPiggyBoom" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>


                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="随机气球倍数(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.OddsRandMin" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="随机气球倍数(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.OddsRandMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="piggy boom气球个数(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.NumPiggyBoomMin" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="piggy boom气球个数(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Calc.NumPiggyBoomMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

              </el-row>
              <piggy-weight-cfg :piggy-cfg=" itemExt.Calc.OddsTarget" weight-name="权重" val-name="气球倍数 -1(随机) -2(Piggy)" val-type="1" title="气球类型(倍数仅支持1为小数)" />
            </fieldset>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="客户端表现">
          <el-row :span="16" :offset="3" style="width: 80%; margin: 0 auto">
            <fieldset style="margin-top:10px">
              <legend>客户端表现</legend>
              <el-row style="margin-bottom: 32px;"></el-row>
              <el-row>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="X轴上升速度范围min" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.SpeedXMin" size="mini" :required="true"> </el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="X轴上升速度范围max" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.SpeedXMax" size="mini" :required="true"> </el-input>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="Y轴上升速度范围min" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.SpeedYMin" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="Y轴上升速度范围max" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.SpeedYMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="气球纵轴生成位置范围min" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreatePosYMin" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="气球纵轴生成位置范围max" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreatePosYMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="24" :offset="3">
                  <el-form inline>
                    <el-form-item label="生成时间" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.SpeedXMax" size="mini" :required="true"> <template slot="append">ms</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="生成个数min" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreateNumberMin" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="生成个数max" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreateNumberMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="出现高度Y" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreateInitY" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="出现速度" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemExt.Ctrl.CreateInitYSpeed" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

              </el-row>
            </fieldset>
          </el-row>
        </el-tab-pane>


        <el-tab-pane v-if="envProjectName != 'ph_audit'" label="排行榜">
          <el-row :span="16" :offset="3" style="width: 80%; margin: 0 auto">
            <fieldset style="margin-top:10px">
              <legend>排行榜配置</legend>
              <el-row style="margin-bottom: 32px;"></el-row>
              <el-row>
                <el-col :span="24" :offset="3">
                  <el-form inline>
                    <el-form-item label="机器人参与排行榜间隔" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemBase.RobotRankCfg.Interval" size="mini" :required="true"> <template slot="append">s</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="每次参与机器人min" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemBase.RobotRankCfg.PartInNumMin" size="mini" :required="true"> </el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="每次参与机器人max" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="itemBase.RobotRankCfg.PartInNumMax" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <piggy-weight-cfg :piggy-cfg=" itemBase.RobotRankCfg.Bets" weight-name="权重" val-name="下注额度" val-type="1" title="下注额度(和真人下注保持一致)" />
              <piggy-weight-cfg :piggy-cfg=" itemBase.RobotRankCfg.OddsRet" weight-name="权重" val-type="2" title="返奖倍数max最大只支持99999" />
            </fieldset>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row>
      <el-button type="primary" @click="onClickSave">保存</el-button>
    </el-row>
    <!--对比组件-->
    <compare ref="compareBase" :attr-names="AttrNames" />
    <compare ref="compareExt" :attr-names="AttrNames" />
  </div>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import PiggyWeightCfg from '@/views/config/tableConfig/piggyWeightCfg.vue'
import JackpotDayLimit from '@/views/config/components/jackpotDayLimit.vue'
import JackpotAward from '@/views/playerManage/jackpotAward.vue'
import { red } from 'mockjs/src/mock/random/color_dict'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { JackpotAward, JackpotDayLimit, PiggyWeightCfg, Compare, Publish, BetAmount },
  data() {
    return {
      subKeyBase: 'balloontap_knock_base',
      subKeyExt: 'balloontap_knock_ext',
      libShow: $libShow,
      envProjectName: process.env.VUE_APP_PROJECT,
      itemBase: {
        FeeRate: 3,
        AutoTimes: [25, 50, 100, 200, 500, 1000, 5000, -1],
        BetLevel: [{ CanBet: [60, 100, 200, 400, 600, 2000], MaxMoneyBet: 2000, MinMoneyBet: 10 }], // //下注配置
        RobotCfg: {
          RobotMemberArr: [{ Index: 0, StartHour: 0, EndHour: 0, MinRobotNum: 0, MaxRobotNum: 0 }],
          MinRobotPlayTimes: 0, // 机器人最小玩牌局数
          MaxRobotPlayTimes: 0, // 机器人最大玩牌局数
          MinRobotChangeTimes: 0, // 机器人敲多少次以后换个频率敲下限
          MaxRobotChangeTimes: 0, // 机器人敲多少次以后换个频率敲上限
          MinRobotWiChangeTimes: 0, // 机器人敲多少次以后换个金币中奖权重敲下限
          MaxRobotWiChangeTimes: 0, // 机器人敲多少次以后换个金币中奖权重敲上限
          MinRobotTapInterval: 0, // 机器人最小敲击间隔
          MaxRobotTapInterval: 0, // 机器人最大敲击间隔
          AutoTapRate: 0 // 机器人自动敲击的概率 ‰
        },
        RobotRankCfg:{

        },
      },
      itemExt: {
        Calc:{
          OddsRandMin: 2,
          OddsRandMax: 36,
          RtpTarget: 97,
          RtpPiggyBoom: 27,
          OddsPiggyBoom: 200,
          NumPiggyBoomMin: 20,
          NumPiggyBoomMax: 30,
          OddsTarget:[{
            Weight:1,
            Val:11,
          },{
            Weight:1,
            Val:15,
          }],
        },
        Ctrl:{

        }
      },
      CanBet:[],
      robotDialogForm: {
        visible: false,
        data: {}
      },
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      AttrNames: {
        'Data.MaxPlayers': '最大人数'
      }
    }
  },
  computed: {
    red() {
      return red
    }
  },
  created() {
    this.getDataBase()
    this.getDataExt()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKeyBase() {
      return 'CustomizeCfg_' + this.subKeyBase
    },
    getFullKeyExt() {
      return 'CustomizeCfg_' + this.subKeyExt
    },
    showData(idx){
      console.log(idx)
      if (idx>=2){
        if (this.envProjectName!=='ph'){
          return false
        }else {
          return true
        }
      }
      return true
    },
    transMoneyForShowBase() { //base 数据->展示
      for (const o of this.itemBase.BetLevel) {
        if (o.CanBet instanceof Array) {
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] /= 1000
          }
        }
      }
      for (const o of this.itemBase.RobotRankCfg.Bets) {
        o.Val /= 1000
      }
      for (const o of this.itemBase.RobotRankCfg.OddsRet) {
        o.ValMin /= 10
        o.ValMax /= 10
      }
    },
    transMoneyForShowExt() { //base 数据->展示
      for (const o of this.itemExt.Calc.OddsTarget) {
        if (o.Val > 0) {
          o.Val /= 10
        }
      }
      this.itemExt.Calc.OddsRandMin /= 10
      this.itemExt.Calc.OddsRandMax /= 10
      this.itemExt.Calc.OddsPiggyBoom /= 10
    },
    doAdd() {
      this.itemBase.BetLevel.push({ CanBet: [60, 100, 200, 400, 600, 2000], MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
      canbetChange(){
          this.CanBet=this.itemBase.BetLevel[0].CanBet.split(',')
      },
    delRow(index) {
      if (this.itemBase.BetLevel.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.itemBase.BetLevel.splice(index, 1)
    },
    BuffCfgClick(tab, event) {
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
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },

    getPostDataBase() { //base 展示->数据
      const obj = JSON.parse(JSON.stringify(this.itemBase))
      for (const o of obj.BetLevel) {
        if (o.CanBet instanceof Array) {
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] *= 1000
          }
        } else {
          o.CanBet = o.CanBet.split(',').map(Number)
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] *= 1000
          }
        }
      }

      if (obj.AutoTimes instanceof Array) {
      } else {
        obj.AutoTimes = obj.AutoTimes.split(',').map(Number)
      }

      for (const o of obj.RobotRankCfg.OddsRet) {
        o.ValMin *= 10
        o.ValMax *= 10
        o.Val = o.ValMin*1000000+o.ValMax
      }

      for (const o of obj.RobotRankCfg.Bets) {
        o.Val *= 1000
      }
      return obj
    },
    getPostDataExt() { //base 展示->数据
      const obj = JSON.parse(JSON.stringify(this.itemExt))
      for (const o of obj.Calc.OddsTarget) {
        if (o.Val > 0){
          o.Val = parseInt(o.Val * 10)
        }
      }
      obj.Calc.OddsRandMin = parseInt(obj.Calc.OddsRandMin * 10)
      obj.Calc.OddsRandMax = parseInt(obj.Calc.OddsRandMax * 10)
      obj.Calc.OddsPiggyBoom = parseInt(obj.Calc.OddsPiggyBoom * 10)

      return obj
    },

    checkDataBase(obj) {
      for (const o of obj.RobotRankCfg.OddsRet) {
        if (o.ValMin - o.ValMax > 0) {
          Message.error('机器人.返奖倍数 min>max')
          return false
        }
        if (o.ValMax > 99999) {
          Message.error('机器人.返奖倍数 max最大只支持99999')
          return false
        }
      }
      return true
    },

    checkDataExt(obj) {
      return true
    },

    getDataBase() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKeyBase
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.formBase = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const itemBase = JSON.parse(response.Data.Data)
            Object.assign(this.itemBase, itemBase)
            this.CanBet=this.itemBase.BetLevel[0].CanBet
            this.transMoneyForShowBase()
            this.$refs.compareBase.SetOldVal(response.Data)
          }
        }
      })
    },
    getDataExt() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKeyExt
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.formExt = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const itemExt = JSON.parse(response.Data.Data)
            Object.assign(this.itemExt, itemExt)
            this.transMoneyForShowExt()
            this.$refs.compareExt.SetOldVal(response.Data)
          }
        }
      })
    },
    setDataBase() {
      var postDataBase = this.getPostDataBase()
      if (!this.checkDataBase(postDataBase)) {
        return
      }
      this.formBase.Data = JSON.stringify(postDataBase)
      const $thisBase = this
      // 设置修改后数据
      this.$refs.compareBase.SetNewVal(this.formBase)
      this.$refs.compareBase.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error({message: 'base 没有任何修改，不需要提交', offset: 30})
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $thisBase.formBase
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    setDataExt() {
      // console.log('1111111111111 1')
      var postDataExt = this.getPostDataExt()
      if (!this.checkDataExt(postDataExt)) {
        return
      }
      this.formExt.Data = JSON.stringify(postDataExt)
      const $thisExt = this
      this.$refs.compareExt.SetNewVal(this.formExt)
      this.$refs.compareExt.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error({message: 'ext 没有任何修改，不需要提交', offset: 80})
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $thisExt.formExt
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    onClickSave() {
      this.setDataBase()
      this.setDataExt()
    },
  }
}
</script>

<style>

</style>
