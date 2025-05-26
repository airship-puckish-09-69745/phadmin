<script>

import Publish from '@/components/Publish/index.vue'
import robotAiSettingOutCard from '@/views/config/tableConfig/tongits/robotAiSettingOutCard.vue'
import robotAiSettingDrop from '@/views/config/tableConfig/tongits/robotAiSettingDrop.vue'
import robotAiSettingFight from '@/views/config/tableConfig/tongits/robotAiSettingFight.vue'
import robotAiSettingBuildCard from '@/views/config/tableConfig/tongits/robotAiSettingBuildCard.vue'
import robotAiSettingChallenge from '@/views/config/tableConfig/tongits/robotAiSettingChallenge.vue'
import {Message} from "element-ui";
import request from "@/utils/request";
import Compare from "@/components/Compare/index.vue";
function NewRobotAIItem() {
  const configLevel = 1
  const configName = '防作弊机器⼈'

  return {
    AiConfigId: configLevel,
    AiConfigLevel: configLevel,
    AiConfigName: configName,
    BuildCard: {
      BuildFlush3MaxNum: 3,
      BuildFlush3Ratio: 30,
      BuildFlush4MaxNum: 2,
      BuildFlush4Ratio: 20,
      BuildFlushGte5MaxNum: 2,
      BuildFlushGte5Ratio: 100,
      BuildFourMaxNum: 2,
      BuildFourRatio: 8,
      BuildJokerMaxNum: 2,
      BuildJokerRatio: 100,
      BuildThree3MaxNum: 3,
      BuildThreeRatio: 30,
      IsDoBuildCard: false
    },
    Challenge: {
      Lose: {
        HandCards: [
          {
            End: 100,
            Percent: 10,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 30,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 1,
            Start: 1
          }
        ],
        Round: [
          {
            End: 3,
            Percent: 10,
            Start: 1
          }
        ]
      },
      NobodyDropOwnerGreatOther: 20,
      NobodyDropOwnerLessOther: 80,
      Special: {
        HandAOther1Fight: 95,
        PointGe51NotFight: 100,
        Round2NotDrop: 95
      },
      Win: {
        HandCards: [
          {
            End: 100,
            Percent: 30,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 60,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 30,
            Start: 1
          }
        ],
        Round: [
          {
            End: 2,
            Percent: 30,
            Start: 2
          }
        ]
      }
    },
    Drop: {
      DropGroupHasLinkMaybe: 80,
      NobodyDropOwnerGreatOther: 50,
      NobodyDropOwnerLessOther: 50
    },
    Fight: {
      Lose: {
        HandCards: [
          {
            End: 100,
            Percent: 15,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 10,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 10,
            Start: 1
          }
        ],
        Round: [
          {
            End: 3,
            Percent: 0,
            Start: 2
          }
        ]
      },
      Special: {
        HandAOther1Fight: 95,
        OtherNotDropButCanWin: 70,
        PointGe51NotFight: 100,
        RealPlayerNotDrop: [],
        Round2NotDrop: 95
      },
      Win: {
        HandCards: [
          {
            End: 100,
            Percent: 20,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 60,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 30,
            Start: 1
          }
        ],
        Round: [
          {
            End: 2,
            Percent: 10,
            Start: 2
          }
        ]
      }
    },
    OutCard: {
      OutCardCanOtherContribute: -1
    }
  }
}
export default {
  components: {
    Compare,
    robotAiSettingChallenge, robotAiSettingBuildCard, robotAiSettingFight,
    robotAiSettingDrop, robotAiSettingOutCard, Publish },
  data() {
    return {
      GameType: 'normal', // 游戏类型
      subKey: 'tongits_cheat_cfg', // 子key
      editAIVisible: false,
      editAI: {},
      IsAutoMaybe: false,
      MaybeMin: 0,
      MaybeReduce: 0,
      CheatCfg: {
        IsAutoMaybe: false, // 是否自动调整
        MaybeMin: 0, // 最小可能性
        MaybeReduce: 0, // 减少可能性
        GiveMoreTimes: [
          {
            Count: 2,
            MaybeAdd: 3
          },
          {
            Count: 3,
            MaybeAdd: 4
          },
          {
            Count: 4,
            MaybeAdd: 5
          }
        ],
        FirstGiveMoreTimes: [{
          Per: 50,
          MaybeAdd: 3
        }],
        DisAndGive: {
          Count: 1,
          MaybeAdd: 3
        },
        PlayMoreTimes: {
          Count: 100,
          MaybeAdd: 3
        },
        LeaveFre: [
          {
            Per: 10,
            MaybeAdd: 3
          },
          {
            Per: 20,
            MaybeAdd: 4
          },
          {
            Per: 30,
            MaybeAdd: 5
          }
        ],
        PreWinFight: [
          {
            RangeMin: 10,
            RangeMax: 20,
            MaybeAdd: 3
          },
          {
            RangeMin: 20,
            RangeMax: 30,
            MaybeAdd: 3
          },
          {
            RangeMin: 30,
            RangeMax: 100,
            MaybeAdd: 3
          }
        ],
        PreWinFold: [
          {
            RangeMin: 10,
            RangeMax: 20,
            MaybeAdd: 3
          },
          {
            RangeMin: 20,
            RangeMax: 30,
            MaybeAdd: 3
          },
          {
            RangeMin: 30,
            RangeMax: 100,
            MaybeAdd: 3
          }
        ],
        BigPotWin: [
          {
            Count: 4,
            MaybeAdd: 3
          },
          {
            Count: 5,
            MaybeAdd: 4
          },
          {
            Count: 6,
            MaybeAdd: 5
          },
          {
            Count: 7,
            MaybeAdd: 4
          },
          {
            Count: 8,
            MaybeAdd: 5
          },
          {
            Count: 9,
            MaybeAdd: 4
          },
          {
            Count: 10,
            MaybeAdd: 5
          },
          {
            Count: 11,
            MaybeAdd: 4
          },
          {
            Count: 12,
            MaybeAdd: 5
          }
        ],
        BigPotLeave: [
          {
            Count: 1,
            MaybeAdd: 3
          },
          {
            Count: 2,
            MaybeAdd: 4
          },
          {
            Count: 3,
            MaybeAdd: 5
          },
          {
            Count: 4,
            MaybeAdd: 4
          },
          {
            Count: 5,
            MaybeAdd: 5
          },
          {
            Count: 6,
            MaybeAdd: 4
          }
        ]
      },
      form: {
        Data: {}
      },
      oldCheatMin: 0
    }
  },

  created() {
    this.editAI = NewRobotAIItem()
    this.getData()
  },
  methods: {
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
          console.log('robotSetting', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.CheatCfg = JSON.parse(response.Data.Data)
            $this.oldCheatMin = $this.CheatCfg.MaybeMin
            const old = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      this.CheatCfg.MaybeMin = parseInt(this.CheatCfg.MaybeMin)
      this.CheatCfg.MaybeReduce = parseInt(this.CheatCfg.MaybeReduce)
      const GiveMoreTimes = []
      for (let i = 0; i < this.CheatCfg.GiveMoreTimes.length; i++) {
        const item = this.CheatCfg.GiveMoreTimes[i]
        GiveMoreTimes.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.GiveMoreTimes = GiveMoreTimes
      const FirstGiveMoreTimes = []
      for (let i = 0; i < this.CheatCfg.FirstGiveMoreTimes.length; i++) {
        const item = this.CheatCfg.FirstGiveMoreTimes[i]
        FirstGiveMoreTimes.push({
          Per: parseInt(item.Per),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.FirstGiveMoreTimes = FirstGiveMoreTimes
      const DisAndGive = {
        Count: parseInt(this.CheatCfg.DisAndGive.Count),
        MaybeAdd: parseInt(this.CheatCfg.DisAndGive.MaybeAdd)
      }
      this.CheatCfg.DisAndGive = DisAndGive
      const PlayMoreTimes = {
        Count: parseInt(this.CheatCfg.PlayMoreTimes.Count),
        MaybeAdd: parseInt(this.CheatCfg.PlayMoreTimes.MaybeAdd)
      }
      this.CheatCfg.PlayMoreTimes = PlayMoreTimes
      const LeaveFre = []
      for (let i = 0; i < this.CheatCfg.LeaveFre.length; i++) {
        const item = this.CheatCfg.LeaveFre[i]
        LeaveFre.push({
          Per: parseInt(item.Per),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.LeaveFre = LeaveFre
      const PreWinFight = []
      for (let i = 0; i < this.CheatCfg.PreWinFight.length; i++) {
        const item = this.CheatCfg.PreWinFight[i]
        PreWinFight.push({
          RangeMin: parseInt(item.RangeMin),
          RangeMax: parseInt(item.RangeMax),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.PreWinFight = PreWinFight
      const PreWinFold = []
      for (let i = 0; i < this.CheatCfg.PreWinFold.length; i++) {
        const item = this.CheatCfg.PreWinFold[i]
        PreWinFold.push({
          RangeMin: parseInt(item.RangeMin),
          RangeMax: parseInt(item.RangeMax),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.PreWinFold = PreWinFold
      const BigPotWin = []
      for (let i = 0; i < this.CheatCfg.BigPotWin.length; i++) {
        const item = this.CheatCfg.BigPotWin[i]
        BigPotWin.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.BigPotWin = BigPotWin
      const BigPotLeave = []
      for (let i = 0; i < this.CheatCfg.BigPotLeave.length; i++) {
        const item = this.CheatCfg.BigPotLeave[i]
        BigPotLeave.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.BigPotLeave = BigPotLeave
      Object.assign(cpy, this.CheatCfg)
      return JSON.stringify(cpy)
    },
    setData() {
      console.log('setData', this.CheatCfg)
      const $this = this
      this.form.Data = this.encodeData()
      if (this.oldCheatMin !== this.CheatCfg.MaybeMin) {
        //更新玩家疑似身份
        this.updateCheatMin(this.CheatCfg.MaybeMin)
      }
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
    },
    handleAIUpdate() {
      this.editAIVisible = true
    },
    getWinTimesTitle(item, index) {
      if (index === this.CheatCfg.BigPotWin.length - 1) {
        return item.Count + '次及以上'
      } else {
        return item.Count + '次'
      }
    },
    getBigPotLeaveTitle(item, index) {
      if (index === this.CheatCfg.BigPotLeave.length - 1) {
        return item.Count + '人及以上'
      } else {
        return item.Count + '人'
      }
    },
    updateCheatMin(maybeMin) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/cheat/cfg',
          MaybeMin: maybeMin
        }
      }).then(response => {
      })
    }
  }
}
</script>

<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="通用配置">
        <el-descriptions :column="2" :colon="false" border>
          <el-descriptions-item label="疑似度⻔槛" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
            <el-input v-model.number="CheatCfg.MaybeMin" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="⾃动疑似开关" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-switch
              v-model="CheatCfg.IsAutoMaybe"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-descriptions-item>
          <el-descriptions-item label="疑似度降低值" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model.number="CheatCfg.MaybeReduce" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="防作弊机器⼈" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleAIUpdate()"
            >修改
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="疑似度配置">
        <h3 class="title">操作异常配置</h3>
        <div class="table-container">
          <h5 class="title">单局多次喂牌</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>单局多次喂牌</th>
                <th v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  {{ item.Count }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">频繁换桌：近五局换桌概率</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>频繁换桌概率</th>
                <th v-for="(item, index) in CheatCfg.LeaveFre" :key="'h'+index">
                  {{ item.Per }}%
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="centered-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">皇冠⾼分Fight：皇冠⽐Challenge玩家⾼多少分Fight</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>Fight异常分数差区间</th>
                <th v-for="(item, index) in CheatCfg.PreWinFight" :key="'h'+index">
                  <template>
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <el-input
                        v-model="item.RangeMin"
                        style="width: 80px; margin-right: 5px;"
                        type="number"
                      />
                      <span>-</span>
                      <el-input
                        v-model="item.RangeMax"
                        style="width: 80px; margin-left: 5px;"
                        type="number"
                      />
                    </div>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.PreWinFight" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="centered-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">皇冠低分Fold：皇冠⽐fight赢家低多少分Fold</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>Fight异常分数差区间</th>
                <th v-for="(item, index) in CheatCfg.PreWinFold" :key="'h'+index">
                  <template>
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <el-input
                        v-model="item.RangeMin"
                        style="width: 80px; margin-right: 5px;"
                        type="number"
                      />
                      <span>-</span>
                      <el-input
                        v-model="item.RangeMax"
                        style="width: 80px; margin-left: 5px;"
                        type="number"
                      />
                    </div>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.PreWinFold" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="centered-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">拆成牌喂牌</h5>
          <el-form v-model="CheatCfg" label-width="150px" style="margin-top: 10px">
            <el-form-item label="拆成牌喂牌">
              <el-input v-model.number="CheatCfg.DisAndGive.MaybeAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
          </el-form>
          <h5 class="title">首出牌被吃牌</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>首出牌被吃牌</th>
                <th v-for="(item, index) in CheatCfg.FirstGiveMoreTimes" :key="'h'+index">
                  {{ item.Per }}%
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.FirstGiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="center-input" type="number" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 class="title">数据异常配置</h3>
        <div class="table-container">
          <table class="support-table">
            <thead>
              <tr>
                <th>连胜局数</th>
                <th v-for="(item, index) in CheatCfg.BigPotWin" :key="'h'+index">
                  {{ getWinTimesTitle(item,index) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.BigPotWin" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <table class="support-table">
            <thead>
              <tr>
                <th>⼤Pot多⼈离场</th>
                <th v-for="(item, index) in CheatCfg.BigPotLeave" :key="'h'+index">
                  {{ getBigPotLeaveTitle(item,index) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.BigPotLeave" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">对局过多</h5>
          <el-form v-model="CheatCfg" label-width="150px" style="margin-top: 10px">
            <el-form-item label="对局100局加">
              <el-input v-model.number="CheatCfg.PlayMoreTimes.MaybeAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!--      <el-tab-pane label="数据异常增加疑似度配置" />-->
    </el-tabs>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>
    <el-dialog
      title="机器人配置"
      :visible.sync="editAIVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="editAI" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="editAI" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<style>
.table-container {
  margin: 20px;
}

.support-table {
  border-collapse: collapse; /* 合并边框 */
  width: 100%;
  max-width: 500px;
  margin: 0 0;
  font-family: Arial, sans-serif;
}

.support-table th,
.support-table td {
  border: 1px solid #ddd; /* 边框样式 */
  padding: 8px;
  text-align: center; /* 文字居中 */
}

.support-table th {
  background-color: #f2f2f2; /* 表头背景色 */
  font-weight: bold;
}

.support-table tr:hover {
  background-color: #f1f1f1; /* 鼠标悬停效果 */
}
.centered-input >>> .el-input__inner {
  text-align: center;
  font-size: 16px;
  padding: 10px 15px;
}
</style>
