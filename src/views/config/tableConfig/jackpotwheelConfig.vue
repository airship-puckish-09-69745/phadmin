<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
      <!--
      <el-col :span="2">
        <el-button type="primary" @click="dialogFormVisible= true" size="mini" > 测试配置</el-button>
      </el-col>
      -->
    </el-row>

    <el-row>
      <el-col :span="24">
        <span v-if="item.openTest=='2'">
         <el-alert
           title="测试模式已开启,记得关闭"
           type="error">
          </el-alert>
      </span>
      </el-col>
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
                    <el-form-item label="保底奖池抽水">
                      <el-input v-model.number="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  
                  <el-col :span="8">
                    <el-form-item label="赢钱榜展示数量">
                      <el-input v-model.number="item.WinMoneyShowNum" size="mini" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="jackpot*bet(比例)">
                      <el-input v-model.number="item.JackpotFeeRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <fieldset style="margin-top:10px">
                
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddBetMoneyLevel()">添加</el-button>
                </el-col>
                
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
                  <el-table-column type="index" />

                  <el-table-column prop="TableMoney" label="下注列表(支持2位小数)" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.TableMoney" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="JackPotArea[0]" label="表1" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.JackPotArea[0]" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="JackPotArea[1]" label="表2" v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.JackPotArea[1]" size="mini" />
                    </template>
                  </el-table-column>
                  
                  <el-table-column prop="JackPotArea[2]" label="表3" v-if="!IsPHAuditEnv()">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.JackPotArea[2]" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
              </fieldset>
              
              <fieldset style="margin-top:10px">
                <!--
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddBetAreaOptions()">添加</el-button>
                </el-col>
                -->
                <legend>中奖倍率配置
                </legend>
                <el-table
                  ref="filterTable"
                  :data="item.BetAreaOptions"
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
                  <el-table-column label="区域" width="90px">
                    <template slot-scope="scope">
                      {{nameMap[scope.row.Id]}}
                    </template>
                  </el-table-column>

                  <el-table-column label="中奖">
                    <template slot-scope="scope">
                      <el-input v-model="item.BetAreaOptions[scope.$index].Odds" size="mini" />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="类型(0:odds 1:Grand奖池 2:Major奖池 3:Minor奖池)">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.BetAreaOptions[scope.$index].Type" size="mini" />
                    </template>
                  </el-table-column>
                <!--
                <el-table-column label="类型">
                    <el-select placeholder="请选择" size="mini" style="width: 140px">
                      <el-option
                        v-for="typeItem in rewardType"
                        :key="typeItem.value"
                        :label="typeItem.label"
                        :value="typeItem.value"
                      >
                      </el-option>
                    </el-select>
              </el-table-column>
-->
                  <el-table-column label="概率">
                    <el-table-column :label="'表1'">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.BetAreaOptions[scope.$index].Rate[0]" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="'表2'" v-if="!IsPHAuditEnv()">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.BetAreaOptions[scope.$index].Rate[1]" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="'表3'" v-if="!IsPHAuditEnv()">
                      <template slot-scope="scope">
                        <el-input v-model.number="item.BetAreaOptions[scope.$index].Rate[2]" size="mini" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <!--
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delBetAreaOptions(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  -->
                </el-table>
              </fieldset>
            
              <fieldset  v-if="!IsPHAuditEnv()">
                <legend>小奖池触发重摇</legend>
                <el-row>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="奖池低于某值此时系统输：">
                      <el-input v-model="item.ReChoiceCfg.LowLotteryPoolReChoice" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="重摇概率：">
                      <el-input v-model.number="item.ReChoiceCfg.LowLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
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
                      <el-input v-model="item.ReChoiceCfg.HighLotteryPoolReChoice" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="重摇概率：">
                      <el-input v-model.number="item.ReChoiceCfg.HighLotteryPoolReChoiceRate" size="mini"><template slot="append">‱</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-descriptions class="margin-top" border>
                  <el-descriptions-item>
                    <span style="color:red;">奖池大于某值此时系统赢：1.当奖池的钱>X.玩家输钱时有X%的概率重新摇 </span>
                  </el-descriptions-item>
                </el-descriptions>
              </fieldset>
            </el-col>
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
        <el-form-item label="选择ID">
          <span v-for="(k,idx) in item.Cards">
            <el-select v-model="item.Cards[idx]" placeholder="请选择" size="mini" style="width: 140px">
              <el-option
                v-for="(k,v) in nameMap"
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
import {$libShow, DataRule} from '@/utils/common'
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
      item: {
        //小奖池重摇配置
        ReChoiceCfg:{HighLotteryPoolReChoice: 0, LowLotteryPoolReChoice: 0},
        BetMoneyLevel:[], //下注
        BetAreaOptions:[], //区域赔率
      },
      form: {},
      subKey: 'jackpotwheel_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      JackpotCfg: {},
      PoolIncrArr: [],
      env:process.env.VUE_APP_PROJECT,
      dialogFormVisible: false,
      nameMap:{
        0:1,
        1:2,
        2:3,
        3:4,
        4:5,
        5:6,
        6:7,
        7:8,
        8:9,
        9:'Minor',
        10:'Major',
        11:'Grand',
      },
      rewardType:[
      { 'label': '0dds', 'value': 0 },
      { 'label': 'Grand奖池', 'value': 1 },
      { 'label': 'Major奖池', 'value': 2 },
      { 'label': 'Minor奖池', 'value': 3 },
      { 'label': 'free', 'value': 5 },
      ],
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT)
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
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
      let that = this
      for (const o of  that.item.BetAreaOptions) {
        //if (o.Type == 0) { //=1:免费次数
          o.Odds /= 1000
        //}
      }

      for (const j in that.item.Rate) {
          that.item.Rate[j] /= 1000
      }
      
      //console.log("11111111===> ", that.item.BetMoneyLevel.length)
      for (const j in that.item.BetMoneyLevel) {
        const jackpotAreaList = new Array(that.item.BetMoneyLevel[j].JackPotArea.length)
        for (const o of that.item.BetMoneyLevel[j].JackPotArea) {
          jackpotAreaList[o.TableIndex] = [o.MinJackPot/1000, o.MaxJackPot/1000]
        }
        //console.log("2===> ", jackpotAreaList)
        that.item.BetMoneyLevel[j].JackPotArea = jackpotAreaList//.join(',')
        //console.log("3===> ", that.item.BetMoneyLevel[j].JackPotArea)

        const betMoneyList = []
        for (const o of that.item.BetMoneyLevel[j].TableMoney) {
          betMoneyList.push(o / 1000)
        }
        that.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')
      }
      that.item.ReChoiceCfg.LowLotteryPoolReChoice /= 1000
      that.item.ReChoiceCfg.HighLotteryPoolReChoice/= 1000
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
            if (!item.BetAreaOptions) {
              item['BetAreaOptions'] = []
              item.BetAreaOptions.push({ Id: 0, Odds: 1, Rate: [0, 0, 0, 0] })
            }

            if (!item.Cards){
              item["Cards"] = [0]
              item["openTest"] = "1"
            }

            Object.assign(this.item, item)
            //console.log('item', this.item)

            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            if (item.PrizeWheelLevelItem) {
              item['item.PrizeWheelLevelItem'] = []
            }
            this.item = item
            console.log(item)
          }
        }
      })

    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))
      console.log("上传====>",ret)

      //下注配置
      for (const i in this.item.BetMoneyLevel) {
        let jackpotArea = []
        //if (this.item.BetMoneyLevel[i].JackPotArea instanceof Array) {
          for (let index = 0; index < this.item.BetMoneyLevel[i].JackPotArea.length; index++) {
            let o = []
            if (this.item.BetMoneyLevel[i].JackPotArea[index] instanceof Array) {
              o = this.item.BetMoneyLevel[i].JackPotArea[index]
            } else {
              o = this.item.BetMoneyLevel[i].JackPotArea[index].split(',')
            }
            jackpotArea.push({TableIndex:index, MinJackPot:o[0]*1000, MaxJackPot:o[1]*1000})
          }
       // }
        ret.BetMoneyLevel[i].JackPotArea = (jackpotArea)
        //console.log("ret.BetMoneyLevel[", i, "].JackPotArea:", ret.BetMoneyLevel[i].JackPotArea)
        let betItem = []
        if (this.item.BetMoneyLevel[i].TableMoney instanceof Array) {
          betItem = this.item.BetMoneyLevel[i].TableMoney
        } else {
          for (const oElement of this.item.BetMoneyLevel[i].TableMoney.split(',')) {
            betItem.push(oElement * 1000)
          }
        }
        ret.BetMoneyLevel[i].TableMoney = (betItem)
      }

      //测试
      if (!ret.openTest || ret.openTest=="1"){
        delete ret['Cards']
      }
      //赔率配置
      for (const o of ret.BetAreaOptions) {
        //if (o.Type == 0) {  //=1:免费次数
          o.Odds *= 1000
        //}        
      }

      //做下排序（按客户端显示顺序需求）
      let BetAreaOptionsArr = []
      let sortArr = [0,6,11,5,4,7,10,1,2,8,9,3]
      for (const i in sortArr){
        for (const o of ret.BetAreaOptions) {
          if (o.Id == sortArr[i]){
            BetAreaOptionsArr.push(o)
            break
          }
        }
      }
      ret.BetAreaOptions = BetAreaOptionsArr
      //排序结束

      for (const i in this.item.Rate) {
          ret.Rate[i] *= 1000
      }
      if (ret.ReChoiceCfg.LowLotteryPoolReChoice){
        ret.ReChoiceCfg.LowLotteryPoolReChoice *= 1000
      }
      if (ret.ReChoiceCfg.HighLotteryPoolReChoice) {
        ret.ReChoiceCfg.HighLotteryPoolReChoice *= 1000
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
      this.item.BetAreaOptions.push({ Id: maxId + 1, Odds: 1, Rate: [0, 0, 0, 0]})
    },
    delBetAreaOptions(index) {
      this.item.BetAreaOptions.splice(index, 1)
    },
    setData() {
      var postData = this.getPostData();
      this.form.Data = JSON.stringify(postData)
      console.log("==> ", this.form.Data)
      console.log(this.form)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        if (postData.openTest=="2") {
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

    doAddBetMoneyLevel() {
      console.log("==========> doAddBetMoneyLevel()")
      if (!this.item.BetMoneyLevel) {
        this.item['BetMoneyLevel'] = []
      }

      this.item.BetMoneyLevel.push({ TableMoney: '60,100,200,400,600,2000', JackPotArea:[[10, 2000],[10, 2000],[10, 2000]]})
    },
    
    IsPHAuditEnv(){
      return this.env == 'ph_audit'
    },
    delRowBetMoneyLevel(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    }
  }
}
</script>
