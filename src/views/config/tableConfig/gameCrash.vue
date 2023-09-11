<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-button type="warning" round @click="showTestRand">测试随机概率</el-button>
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="item" :model="item" label-width="200px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="最大人数：" prop="MaxPlayers" :rules="dataRule(true,{type:'n',range:'1-1000'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxPlayers" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="入场限制：" prop="MinMoneyCarry" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MinMoneyCarry" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最近牌局记录数量：" prop="LogListCount" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.LogListCount" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="抽水百分比：" prop="TaxRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.TaxRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="操作时长：" prop="ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
                <el-col :span="20">
                  <el-input v-model.number="item.ActionSeconds" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最大旁观次数：" prop="MaxWatchTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MaxWatchTimes" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="赢钱转化可提百分比：" prop="WinMoneyTransferRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.WinMoneyTransferRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="调控最少真人数：" prop="MinPlayersEnableSchema" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.MinPlayersEnableSchema" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最大下注金额：" prop="BetMoneyMax" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.BetMoneyMax" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="底池安全剩余比例：" prop="PoolSafeRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-col :span="20">
                  <el-input v-model.number="item.PoolSafeRate" size="mini" :required="true" />
                </el-col>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="下注金额列表：" :required="true">
                <el-col :span="20">
                  <el-input v-model="betMoneyList" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="单局大R下注金额：" :required="true">
                <el-col :span="20">
                  <el-input v-model.number="item.BigBetMoney" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="抽水额度(%)：" :required="true">
                <el-col :span="20">
                  <el-input v-model.number="item.FeeRate" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="启用调控：" :required="true">
                <el-col :span="20">
                  <el-radio-group v-model.number="item.EnableControl">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          

          <fieldset style="margin:20px auto;">
            <legend>机器人配置</legend>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最小人数：" prop="MinRobotNumber" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大人数：" prop="MaxRobotNumber" :rules="dataRule(true,{type:'n',range:'1'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotNumber" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人携带金币下限：" prop="MinRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人携带金币上限：" prop="MaxRobotMoney" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotMoney" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大玩牌局数下限：" prop="MinRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大玩牌局数上限：" prop="MaxRobotPlayTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotPlayTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大赢牌次数下限：" prop="MinRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大赢牌次数上限：" prop="MaxRobotWinTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotWinTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="机器人最大输牌次数下限：" prop="MinRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MinRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机器人最大输牌次数上限：" prop="MaxRobotLoseTimes" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-col :span="20">
                    <el-input v-model.number="item.MaxRobotLoseTimes" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>

          <fieldset style="margin:20px auto;">
            <legend>捆绑赔率的概率配置</legend>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="最小赔率：" prop="MinBet">
                  <el-col :span="20">
                    <el-input v-model="item.MinBet" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="最大赔率：" prop="MaxBet">
                  <el-col :span="20">
                    <el-input v-model="item.MaxBet" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="赔率增长颗粒度：" prop="IncrBet">
                  <el-col :span="20">
                    <el-input v-model="item.IncrBet" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="随机总阈值：" prop="TotalRandNum">
                  <el-col :span="20">
                    <el-input v-model="item.TotalRandNum" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" :offset="1">
                <el-form-item label="赔率系数：" prop="BetRate">
                  <el-col :span="20">
                    <el-input v-model="item.BetRate" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="前三赔率系数：" prop="PreBetRate">
                  <el-col :span="20">
                    <el-input v-model="item.PreBetRate" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="手动领取偏移(ms)：" prop="HandleTakeShiftingTime">
                  <el-col :span="20">
                    <el-input v-model.number="item.HandleTakeShiftingTime" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="随机不爆炸概率(%)：" prop="HandleTakeShiftingRate">
                  <el-col :span="20">
                    <el-input v-model.number="item.HandleTakeShiftingRate" size="mini" :required="true" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>

          <el-row>
            <el-col :span="4" style="text-align:right">赔率配置：</el-col>
            <el-col :span="12">
              <el-table ref="filterTable" :data="item.OddsRates" stripe border fit :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell">
                <el-table-column type="index" label="时间(秒)" width="100">
                  <template slot-scope="scope">{{scope.$index+1}}</template>
                </el-table-column>
                <el-table-column prop="Odds" label="赔率(最多2位小数)">
                  <template slot-scope="scope">
                    <el-col :span="4">&lt;=</el-col>
                    <el-col :span="20">
                      <el-input v-model="scope.row.Odds" size="mini" />
                    </el-col>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-top:20px;">
                <el-button type="primary" @click="setData">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
      title="测试随机概率"
      :modal="false"
      :visible.sync="testRand.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="testRand" label-width="120px" size="small">
          <el-form-item label="随机次数：">
            <el-input v-model.number="testRand.times" size="11" placeholder="请输入随机次数" />
          </el-form-item>
          <el-form-item label="随机结果：">
            <el-table
              :data="testRand.result"
              style="width: 100%"
            >
              <el-table-column
                prop="OptionId"
                label="赔率"
                width="180"
              >
              <template slot-scope="scope">
                {{ scope.row.OptionId/100 }}
              </template>
              
              </el-table-column>
              <el-table-column
                prop="Times"
                label="出现次数"
                width="180"
              />
              <el-table-column
                prop="Rate"
                label="概率占比(%)"
              />
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goRand">执行</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>

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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        MaxPlayers: 400,
        BetMoneyList: [10, 50, 100, 500, 1000],
        BetMoneyMax: 2000,
        MinMoneyCarry: 1000,
        LogListCount: 100,
        BigBetMoney: 0,
        FeeRate: 0,
        TaxRate: 0,
        ActionSeconds: 15,
        MaxWatchTimes: 0,
        WinMoneyTransferRate: 20,
        MinPlayersEnableSchema: 1, //最低调控玩家数
        PoolSafeRate: 30,
        MaxRunSeconds: 15,
        MinRobotNumber:0, //机器人最小人数
        MaxRobotNumber:0, //机器人最大人数
        MinRobotPlayTimes:0, //机器人最小玩牌局数
        MaxRobotPlayTimes:0, //机器人最大玩牌局数
        MinRobotMoney:0, //机器人金币下限
        MaxRobotMoney:0, //机器人金币上限
        MinRobotWinTimes:0, //机器人最大赢牌次数下限
        MaxRobotWinTimes:0, //机器人最大赢牌次数上限
        MinRobotLoseTimes:0, //机器人最大输牌次数下限
        MaxRobotLoseTimes:0, //机器人最大输牌次数上限
        OddsRates: [{Odds: 0, Rate: 0}],
        MinBet: 1.01,
        MaxBet: 100,
        IncrBet: 0.01,
        TotalRandNum: 1000000,
        BetRate: 1,
        PreBetRate: 0.97,
        HandleTakeShiftingTime: 0,
        HandleTakeShiftingRate: 0,
        EnableControl: false,
      },
      testRand: {
        visible: false,
        times: 0,
        result: []
      },
      betMoneyList: '10,50,100,500,1000',
      form: {},
      subKey: 'gameCrash',
      libShow: $libShow,
      AttrNames: {
        'Data.MaxPlayers': '最大人数',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxWatchTimes': '最大旁观次数',
        'Data.LogListCount': '牌局记录的局数',
        'Data.ActionSeconds': '操作时长',
        'Data.TaxRate': '抽水百分比',
        'Data.WinMoneyTransferRate': '赢钱转化可提百分比',
        'Data.MinPlayersEnableSchema': '调控最小真人数',
        'Data.BetMoneyMax': '最大下注金额',
        'Data.PoolSafeRate': '底池安全比例',
        'Data.OddsRates': '赔率概率配置',
        'Data.MaxRunSeconds': '最大飞行时长',
        'Data.MinRobotNumber':'机器人最小人数',
        'Data.MaxRobotNumber':'机器人最大人数',
        'Data.MinRobotPlayTimes':'机器人最小玩牌局数',
        'Data.MaxRobotPlayTimes':'机器人最大玩牌局数',
        'Data.MinRobotMoney':'机器人金币下限',
        'Data.MaxRobotMoney':'机器人金币上限',
        'Data.MinRobotWinTimes':'机器人最大赢牌次数下限',
        'Data.MaxRobotWinTimes':'机器人最大赢牌次数上限',
        'Data.MinRobotLoseTimes':'机器人最大输牌次数下限',
        'Data.MaxRobotLoseTimes':'机器人最大输牌次数上限',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    this.getData();
    console.log(1);
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config);
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey;
    },
    transMoneyForShow() {
      this.item.MinMoneyCarry /= 1000;
      this.item.BetMoneyMax /= 1000;
      this.item.MinRobotMoney /= 1000;
      this.item.MaxRobotMoney /= 1000;
      this.item.BigBetMoney /= 1000;
      for (const o in this.item.BetMoneyList) {
        this.item.BetMoneyList[o] /= 1000;
      }
      for (const o in this.item.OddsRates) {
        this.item.OddsRates[o].Odds /= 100;
      }
      this.item.MinBet /= 100;
      this.item.MaxBet /= 100;
      this.item.IncrBet /= 100;
      this.item.PreBetRate /= 100;
      this.item.BetRate /= 100;
    },
    getPostData() {
      const ret = {};
      for (let k in this.item) {
        if(k == 'OddsRates') {
          ret[k] = [];
          for (let i=0; i<this.item.OddsRates.length; i++) {
            ret[k].push({Odds: this.item.OddsRates[i].Odds, Rate: this.item.OddsRates[i].Rate});
          }
        } else {
          ret[k] = this.item[k];
        }
      }
      ret.MinMoneyCarry *= 1000;
      ret.BetMoneyMax *= 1000;
      ret.MinRobotMoney *= 1000;
      ret.MaxRobotMoney *= 1000;
      ret.BigBetMoney *= 1000;
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000;
      }
      for (const o in ret.OddsRates) {
        ret.OddsRates[o].Odds = Math.round(ret.OddsRates[o].Odds * 100);
      }
      ret.MinBet *= 100;
      ret.MaxBet *= 100;
      ret.IncrBet *= 100;
      ret.PreBetRate *= 100;
      ret.BetRate *= 100;
      return ret;
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            this.betMoneyList = this.item.BetMoneyList ? this.item.BetMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      const items = this.betMoneyList.split(',')
      this.item.BetMoneyList = []
      for (const o in items) {
        this.item.BetMoneyList.push(parseInt(items[o]))
      }

      if (this.item.MaxRobotNumber < this.item.MinRobotNumber) {
        Message.error('“机器人最大人数”不能小于“机器人最小人数”');
        return;
      } else if (this.item.MaxRobotMoney < this.item.MinRobotMoney) {
        Message.error('“机器人携带金币上限”不能小于“机器人携带金币下限”');
        return;
      } else if (this.item.MaxRobotPlayTimes < this.item.MinRobotPlayTimes) {
        Message.error('“机器人最大玩牌局数上限”不能小于“机器人最大玩牌局数下限”');
        return;
      } else if (this.item.MaxRobotWinTimes < this.item.MinRobotWinTimes) {
        Message.error('“机器人最大赢牌次数上限”不能小于“机器人最大赢牌次数下限”');
        return;
      } else if (this.item.MaxRobotLoseTimes < this.item.MinRobotLoseTimes) {
        Message.error('“机器人最大输牌次数上限”不能小于“机器人最大输牌次数下限”');
        return;
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
    showTestRand() {
      this.testRand.visible = true
    },
    goRand() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/test/random',
          Gid: 10,
          Times: this.testRand.times
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.testRand.result = response.Data.RandRet
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
