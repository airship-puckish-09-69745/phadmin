<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="8" :offset="4">
        <el-form ref="form" :model="form" label-width="300px">
          <el-row>
            <el-form-item label="最小版本号：">
              <el-input v-model.number="cfg.MinVersion" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <money-input v-model.number="cfg.EnergyNum" label="转盘小游戏能量条数额" />
          </el-row>
          <el-row>
            <el-form-item label="转盘小游戏能量转化率：">
              <el-input v-model.number="cfg.EnergyTransferRate" placeholder="" />‱（万分比）
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="可投注球数量：">
              <el-input v-model="cfg.BallNumsStr" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="单球可投注额度：">
              <el-input v-model="cfg.BetsStr" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="自动投注次数。-1为不限：">
              <el-input v-model="cfg.AutomaticTimesStr" placeholder="" />
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="16" :offset="3">
        <h3>小转盘选项配置(概率为万分比，比如3表示：万分之三)</h3>
        <el-row>
          <el-table :data="cfg.HappyRouletteCfg" border style="width: 100%">
            <el-table-column prop="Id" label="通道ID" width="100">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Id" placeholder="" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="Type" label="奖项类型">
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.Type" size="small" placeholder="placeholder">
                  <el-option label="免费球" :value="1" />
                  <el-option label="金币" :value="2" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="HitRates" label="命中概率">
              <template slot-scope="scope">
                <el-input v-model="scope.row.HitRates" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="Num" label="奖项数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Num" placeholder="" />
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="item in cfg.LevelCfg">
        <el-row style="margin-top: 30px">
          <el-col :span="16" :offset="3">
            <fieldset>
              <legend>{{ levelShow[item.Level] }} 场次配置(赔率支持3位小数)</legend>
              <el-form ref="form" :model="form" label-width="300px">
                <el-row>
                  <el-form-item label="场次等级：" prop="item.Level">
                    <el-select v-model="item.Level" placeholder="请选择" disabled>
                      <el-option label="low" :value="1" />
                      <el-option label="medium" :value="2" />
                      <el-option label="high" :value="3" />
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="LuckyJP key：" prop="item.LuckyJPKey">
                    <el-input v-model="item.LuckyJPKey" placeholder="请输入" disabled />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="LuckyJP 入池转换率（万分比，例：值为 3，代表万分之三）：" prop="item.LuckyJPTransferRate">
                    <el-input v-model="item.LuckyJPTransferRate" placeholder="请输入"/>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="LuckyJP 赔付倍数（1代表百分之百，支持2为小数）：" prop="item.LuckyJPOdds">
                    <el-input v-model="item.LuckyJPOdds" placeholder="请输入"/>
                  </el-form-item>
                </el-row>
                <el-row>
                  <money-input v-model.number="item.LuckyJPInitMoney" label="LuckyJP 初始化金额" />
                </el-row>
                <el-row>
                  <el-form-item label="SuperJP key：" prop="item.SuperJPKey">
                    <el-input v-model="item.SuperJPKey" placeholder="请输入" disabled />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="SuperJP 入池转换率（万分比，例：值为 3，代表万分之三）：" prop="item.SuperJPTransferRate">
                    <el-input v-model="item.SuperJPTransferRate" placeholder="请输入"/>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="SuperJP 赔付倍数（1代表百分之百，支持2为小数）：" prop="item.SuperJPOdds">
                    <el-input v-model="item.SuperJPOdds" placeholder="请输入"/>
                  </el-form-item>
                </el-row>
                <el-row>
                  <money-input v-model.number="item.SuperJPInitMoney" label="SuperJP 初始化金额" />
                </el-row>
                <fieldset>
                  <legend>普通选项配置</legend>
                  <el-row>
                    <el-table :data="item.Channels" border style="width: 100%">
                      <el-table-column prop="Id" label="通道ID" width="100">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Id" placeholder="" disabled />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.Odds" label="赔付赔率(-1 为命中 spin)">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Odds" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.HitRates" label="命中概率（万分比，如 3 表示万分之三，即0.0003）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.HitRates" placeholder="" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </fieldset>
                <fieldset>
                  <legend>翻倍选项配置</legend>
                  <el-row>
                    <el-table :data="item.Doubules" border style="width: 100%">
                      <el-table-column prop="Id" label="通道ID" width="100">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Id" placeholder="" disabled />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.HitRates" label="命中概率（万分比，如 3 表示万分之三，即0.0003）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.HitRates" placeholder="" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </fieldset>
                <fieldset>
                  <legend>Spin 转盘选项配置</legend>
                  <el-row>
                    <el-table :data="item.Spins" border style="width: 100%">
                      <el-table-column prop="Id" label="通道ID" width="100">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Id" placeholder="" disabled />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.Odds" label="赔付赔率(-1 为命中 LuckyJP; -2 为命中 SuperJP)">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Odds" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.HitRates" label="命中概率（万分比，如 3 表示万分之三，即0.0003）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.HitRates" placeholder="" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </fieldset>
              </el-form>
            </fieldset>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-button type="primary" style="margin-top:30px;" @click="setData">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare, MoneyInput },
  data() {
    return {
      cfg: {
        MinVersion: 0,
        EnergyNum: 0,
        EnergyTransferRate: 0,
        BallNums: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        Bets: [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
        AutomaticTimes: [10, 20, 50, 80, 100, -1],
        HappyRouletteCfg: [
          {
            Id: 1,
            Type: 2,
            HitRates: 1000,
            Num: 5
          },
          {
            Id: 2,
            Type: 1,
            HitRates: 1000,
            Num: 5000
          },
          {
            Id: 3,
            Type: 2,
            HitRates: 1000,
            Num: 10
          },
          {
            Id: 4,
            Type: 1,
            HitRates: 1000,
            Num: 4000
          },
          {
            Id: 5,
            Type: 2,
            HitRates: 1000,
            Num: 6
          },
          {
            Id: 6,
            Type: 1,
            HitRates: 1000,
            Num: 3000
          },
          {
            Id: 7,
            Type: 2,
            HitRates: 1000,
            Num: 8
          },
          {
            Id: 8,
            Type: 1,
            HitRates: 1000,
            Num: 2000
          },
          {
            Id: 9,
            Type: 2,
            HitRates: 1000,
            Num: 1
          },
          {
            Id: 10,
            Type: 1,
            HitRates: 1000,
            Num: 50000
          }
        ],
        LevelCfg: [
          {
            Level: 1,
            LuckyJPInitMoney: 0,
            LuckyJPOdds: 0,
            LuckyJPTransferRate: 0,
            LuckyJPKey: '',
            SuperJPInitMoney: 0,
            SuperJPOdds: 0,
            SuperJPTransferRate: 0,
            SuperJPKey: '',
            Channels: [
              {
                Id: -8,
                HitRates: 100,
                Odds: 200
              },
              {
                Id: -7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 100,
                Odds: 10
              },
              {
                Id: -5,
                HitRates: 100,
                Odds: 5
              },
              {
                Id: -4,
                HitRates: 100,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 100,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 100,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 100,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 100,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 100,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 100,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 100,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 100,
                Odds: 5
              },
              {
                Id: 6,
                HitRates: 100,
                Odds: 10
              },
              {
                Id: 7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 100,
                Odds: 200
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                Odds: -2
              }
            ]
          },
          {
            Level: 2,
            LuckyJPInitMoney: 100000,
            LuckyJPOdds: 50,
            LuckyJPTransferRate: 3,
            LuckyJPKey: 'jackpot_1',
            SuperJPInitMoney: 100000,
            SuperJPOdds: 200,
            SuperJPTransferRate: 3,
            SuperJPKey: 'jackpot_2',
            Channels: [
              {
                Id: -8,
                HitRates: 80,
                Odds: 200
              },
              {
                Id: -7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: -5,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: -4,
                HitRates: 500,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 1000,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 1000,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 1000,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 1000,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 1000,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 1000,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 500,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 6,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 80,
                Odds: 200
              }
            ],
            Doubules: [
              {
                Id: 1,
                HitRates: 100
              },
              {
                Id: 2,
                HitRates: 200
              },
              {
                Id: 3,
                HitRates: 300
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                Odds: -2
              }
            ]
          },
          {
            Level: 3,
            LuckyJPInitMoney: 100000,
            LuckyJPOdds: 50,
            LuckyJPTransferRate: 3,
            LuckyJPKey: 'jackpot_3',
            SuperJPInitMoney: 100000,
            SuperJPOdds: 200,
            SuperJPTransferRate: 3,
            SuperJPKey: 'jackpot_4',
            Channels: [
              {
                Id: -8,
                HitRates: 100,
                Odds: 200
              },
              {
                Id: -7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 100,
                Odds: -1
              },
              {
                Id: -5,
                HitRates: 100,
                Odds: -1
              },
              {
                Id: -4,
                HitRates: 100,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 100,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 100,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 100,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 100,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 100,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 100,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 100,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 100,
                Odds: -1
              },
              {
                Id: 6,
                HitRates: 100,
                Odds: -1
              },
              {
                Id: 7,
                HitRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 100,
                Odds: 200
              }
            ],
            Doubules: [
              {
                Id: 1,
                HitRates: 100
              },
              {
                Id: 2,
                HitRates: 200
              },
              {
                Id: 3,
                HitRates: 200
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                Odds: -2
              }
            ]
          }
        ]
      },
      form: {
      },
      txt: '',
      subKey: 'windrop_slots_cfg',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      levelShow: { 1: 'low', 2: 'medium', 3: 'high' }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addChannel(idx) {
      this.cfg.Channels.splice(idx + 1, 0, {
        ID: 0,
        Red: {
          Color: 1,
          Odds: 0,
          HitRates: 0
        },
        Green: {
          Color: 2,
          Odds: 0,
          HitRates: 0
        },
        Blue: {
          Color: 3,
          Odds: 0,
          HitRates: 0
        }
      })
    },
    delChannel(idx) {
      this.$delete(this.cfg.Channels, idx)
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            var cfgJson = JSON.parse(response.Data.Data)
            for (var i in cfgJson.Bets) {
              cfgJson.Bets[i] /= 1000
            }
            cfgJson.BetsStr = cfgJson.Bets.join(',')
            cfgJson.BallNumsStr = cfgJson.BallNums.join(',')
            cfgJson.AutomaticTimesStr = cfgJson.AutomaticTimes.join(',')
            for (var k in cfgJson.HappyRouletteCfg) {
              if (cfgJson.HappyRouletteCfg[k].Type === 1) {
                cfgJson.HappyRouletteCfg[k].Num /= 1000
              }
            }
            $this.cfg = cfgJson
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getPostData() {
      const postData = {}
      Object.assign(postData, this.cfg)
      return postData
    },
    setData() {
      const postData = this.getPostData()
      // 配置检查
      if (!this.configCheck(postData)) {
        return false
      }
      if (postData.BetsStr) {
        const bets = postData.BetsStr.split(',')
        postData.Bets = []
        for (const i in bets) {
          postData.Bets.push(parseFloat(bets[i]) * 1000)
        }
      }
      if (postData.BallNumsStr) {
        const ballNums = postData.BallNumsStr.split(',')
        postData.BallNums = []
        for (const i in ballNums) {
          postData.BallNums.push(parseFloat(ballNums[i]))
        }
      }
      if (postData.AutomaticTimesStr) {
        const automaticTimes = postData.AutomaticTimesStr.split(',')
        postData.AutomaticTimes = []
        for (const i in automaticTimes) {
          postData.AutomaticTimes.push(parseFloat(automaticTimes[i]))
        }
      }
      if (postData.HappyRouletteCfg) {
        for (const i in postData.HappyRouletteCfg) {
          if (postData.HappyRouletteCfg[i].Type === 1) {
            postData.HappyRouletteCfg[i].Num = parseFloat(postData.HappyRouletteCfg[i].Num) * 1000
          }
        }
      }
      this.form.Data = JSON.stringify(postData)
      debugger
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
    configCheck(data) {
      // 检查翻倍命中率
      for (var k in data.LevelCfg) {
        if (data.LevelCfg[k].Doubules) {
          for (var i in data.LevelCfg[k].Doubules) {
            var doubleCfg = data.LevelCfg[k].Doubules[i]
            if (doubleCfg.HitRates > 10000) {
              this.$alert('翻倍配置的命中概率不能大于等于10000')
              return false
            }
          }
        }
      }
      // 检查 Spin 命中率
      for (var kL in data.LevelCfg) {
        var hitRateTotal = 0
        for (var iL in data.LevelCfg[kL].Spins) {
          var spinCfg = data.LevelCfg[kL].Spins[iL]
          hitRateTotal += spinCfg.HitRates
        }
        if (hitRateTotal !== 10000) {
          this.$alert(this.levelShow[data.LevelCfg[kL].Level] + ' 场次的 spin 转盘配置的命中概率总和不等于10000')
          return false
        }
      }
      // 检查 普通通道 命中率
      for (var kC in data.LevelCfg) {
        var hitRateTotalC = 0
        for (var iC in data.LevelCfg[kC].Channels) {
          var channleCfg = data.LevelCfg[kC].Channels[iC]
          hitRateTotalC += channleCfg.HitRates
        }
        if (hitRateTotalC !== 10000) {
          this.$alert(this.levelShow[data.LevelCfg[kC].Level] + ' 场次的普通通道配置的命中概率总和不等于10000')
          return false
        }
      }
      return true
    }
  }
}
</script>
