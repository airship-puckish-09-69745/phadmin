<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row>

      <el-tabs type="border-card">
        <el-tab-pane label="进桌规则">
          <el-col :span="8">
            <el-table
              :data="item.PresetCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="开桌数量"
                prop="Number"
                width="100"
              />
              <el-table-column
                label="概率(%)"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Probability" size="mini" />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="16">
            <el-form ref="item" label-width="150px" :inline="true">
              <el-form-item label="最少局数">
                <el-input v-model.number="item.PlayTimesMin" size="mini" />
              </el-form-item>
              <el-form-item label="最多局数">
                <el-input v-model.number="item.PlayTimesMin" size="mini" />
              </el-form-item>
              <el-form-item label="最少加钱">
                <el-input v-model.number="item.IncrPlayMoneyMultiMin" size="mini" />
              </el-form-item>
              <el-form-item label="最少补充局数">
                <el-input v-model.number="item.IncrPlayTimesMin" size="mini" />
              </el-form-item>
              <el-form-item label="最多补充局数">
                <el-input v-model.number="item.IncrPlayTimesMax" size="mini" />
              </el-form-item>
              <el-form-item label="最少携带">
                <el-input v-model.number="item.CarryingMultiMin" size="mini" />
              </el-form-item>
              <el-form-item label="最多携带">
                <el-input v-model.number="item.CarryingMultiMax" size="mini" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="补充规则"><el-table
          :data="item.AppendCfg"
          border
          style="width: 100%"
        >
          <el-table-column
            label="当前人数"
            prop="UserNumber"
            width="100"
          />
          <el-table-column
            label="概率(%)"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.Probability" size="mini" />
            </template>
          </el-table-column>
          <el-table-column
            label="最少补充"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.AppendRobotMin" size="mini" />
            </template>
          </el-table-column>
          <el-table-column
            label="最多补充"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.AppendRobotMax" size="mini" />
            </template>
          </el-table-column>
          <el-table-column
            label="进场最少时间"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.EnterDelayMin" size="mini" />
            </template>
          </el-table-column>
          <el-table-column
            label="进场最多时间"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.EnterDelayMax" size="mini" />
            </template>
          </el-table-column>
        </el-table></el-tab-pane>
        <el-tab-pane label="下注配置">
          <el-col :span="6">
            <fieldset>
              <legend>随机下注次数</legend>
              <el-table
                :data="item.BetTimesCfg"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="随机最小"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.BetTimesMin" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="随机最大"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.BetTimesMax" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="概率(%)"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </el-col>
          <el-col :span="6">
            <fieldset>
              <legend>随机下注额度</legend>
              <el-table
                :data="item.BetOptionCfg"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="操作类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    {{ getBetOptionCfgName(scope.row.BetOption) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="概率(千分)"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </el-col>
          <el-col :span="6">
            <fieldset>
              <legend>随机下注额度</legend>
              <el-table
                :data="item.TakeCardCfg"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="点数"
                  prop="Points"
                  width="100"
                />
                <el-table-column
                  label="概率(%)"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </el-col>
          <el-row>
            <el-form :inline="true">
              <el-form-item label="庄家保护线">
                <el-input v-model.number="item.DealerWarnLine" size="mini" />
              </el-form-item>
              <el-form-item label="庄家保护最小点数">
                <el-input v-model.number="item.DealerWarnPointsMin" size="mini" />
              </el-form-item>
              <el-form-item label="庄家保护最大点数">
                <el-input v-model.number="item.DealerWarnPointsMax" size="mini" />
              </el-form-item>
              <el-form-item label="庄家保护概率（%）">
                <el-input v-model.number="item.DealerWarnProbability" size="mini" />
              </el-form-item>
            </el-form>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Pot保护"><el-table
          :data="item.HitPotProtectCfg"
          border
          style="width: 100%"
        >
          <el-table-column
            label="投入占比区间"
            width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.PotRobotRatioMin/10 }}% - {{ scope.row.PotRobotRatioMax/10 }}%
            </template>
          </el-table-column>
          <el-table-column
            label="概率(%)"
            width="100"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.Probability" size="mini" />
            </template>
          </el-table-column>
        </el-table></el-tab-pane>
        <el-tab-pane label="奖池保护">
          <el-col :span="8">
            <fieldset>
              <legend>奖池完全线配置</legend>
            <el-table
              :data="item.SafePoolMoneyCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="底注"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.TableMoney" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="奖池安全线"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.SafePool" size="mini" />
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          </el-col>
          <el-col :span="8">
            <fieldset>
              <legend>机器人不输</legend>
            <el-table
              :data="item.SafePoolProtectCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="实际/配置（下限）"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RatioMin" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="实际/配置（上限）"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RatioMin" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="不输概率（%）"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RatioMin" size="mini" />
                </template>
              </el-table-column>
            </el-table>
            </fieldset>
          </el-col>
        </el-tab-pane>
      </el-tabs>

      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </el-col>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'
import SmallGameLevel from '@/components/SmallGameLevel'

function newSafePoolProtectCfg(x, y,z) {
  return {
      RatioMin:x,
      RatioMax  :y,
      RobotWinProbability :z
  }
}

function SafePoolMoneyCfg(x, y) {
  return {
    TableMoney :x,
    SafePool   :y,
  }
}

function newHitPotProtectCfg(x, y, z) {
  return {
    PotRobotRatioMin: x,
    PotRobotRatioMax: y,
    PotRobotWinProbability: z
  }
}
function newTakeCardCfg(x, y) {
  return {
    Points: x,
    Probability: y
  }
}
function newPresetCfg(n) {
  return {
    Number: n,
    Probability: 0
  }
}
function newBetOptionCfg(x, y) {
  return {
    BetOption: x,
    Probability: y
  }
}
function newAppendCfg(n) {
  return {
    UserNumber: n,
    Probability: 0,
    AppendRobotMin: 0,
    AppendRobotMax: 0,
    EnterDelayMin: 0,
    EnterDelayMax: 0
  }
}
function newBetTimesCfg(x, y, z) {
  return {
    BetTimesMin: x,
    BetTimesMax: y,
    Probability: z
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput, SmallGameLevel },
  data() {
    return {
      subKey: 'lucky9RobotSetting',

      item: {
        'PresetCfg': [newPresetCfg(1), newPresetCfg(2), newPresetCfg(3), newPresetCfg(4), newPresetCfg(5), newPresetCfg(6), newPresetCfg(7)],
        'AppendCfg': [newAppendCfg(1), newAppendCfg(2), newAppendCfg(3), newAppendCfg(4), newAppendCfg(5), newAppendCfg(6), newAppendCfg(7)],
        'PlayTimesMin': 0,
        'PlayTimesMax': 0,
        'IncrPlayMoneyMultiMin': 0,
        'IncrPlayTimesMin': 0,
        'IncrPlayTimesMax': 0,
        'CarryingMultiMin': 0,
        'CarryingMultiMax': 0,
        'BetTimesCfg': [newBetTimesCfg(1, 3, 40), newBetTimesCfg(4, 5, 30), newBetTimesCfg(6, 6, 30)],
        'BetOptionCfg': [newBetOptionCfg(1, 25), newBetOptionCfg(2, 700), newBetOptionCfg(3, 250), newBetOptionCfg(4, 25)],
        'TakeCardCfg': [newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 100), newTakeCardCfg(5, 80), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)],
        'DealerWarnLine': 0,
        'DealerWarnPointsMin': 0,
        'DealerWarnPointsMax': 0,
        'DealerWarnProbability': 0,
        'HitPotProtectCfg': [newHitPotProtectCfg(0, 125, 5), newHitPotProtectCfg(126, 250, 7), newHitPotProtectCfg(251, 375, 9),
          newHitPotProtectCfg(376, 500, 11), newHitPotProtectCfg(501, 625, 13), newHitPotProtectCfg(626, 750, 15), newHitPotProtectCfg(751, 875, 17), newHitPotProtectCfg(876, 100, 19)],
        'SafePoolMoneyCfg': [SafePoolMoneyCfg(1,1000),SafePoolMoneyCfg(5,1000),SafePoolMoneyCfg(20,20000),SafePoolMoneyCfg(50,50000),SafePoolMoneyCfg(100,5000)],
        'SafePoolProtectCfg': [newSafePoolProtectCfg(0,50,10),newSafePoolProtectCfg(51,100,20)]
      }
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getBetOptionCfgName(option) {
      const names = ['', 'Repeat', '1 Bet', '5 Bet', 'Max']
      return names[option]
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            $this.item = this.DeepCopy(data)

            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    encodeData() {
      return JSON.stringify(this.item)
    },
    setData() {
      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
