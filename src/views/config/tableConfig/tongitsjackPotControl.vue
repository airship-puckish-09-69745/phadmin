<script>

import Publish from '@/components/Publish'
import Compare from '@/components/Compare'
import robotAiSettingOutCard from '@/views/config/tableConfig/tongits/robotAiSettingOutCard.vue'
import robotAiSettingDrop from '@/views/config/tableConfig/tongits/robotAiSettingDrop.vue'
import robotAiSettingFight from '@/views/config/tableConfig/tongits/robotAiSettingFight.vue'
import robotAiSettingBuildCard from '@/views/config/tableConfig/tongits/robotAiSettingBuildCard.vue'
import robotAiSettingChallenge from '@/views/config/tableConfig/tongits/robotAiSettingChallenge.vue'
import request from '@/utils/request'
import {$libShow, } from '@/utils/common'

function NewPlayerGoodCard() {
  const ret = []
  for (let i = 0; i < 5; i++) {
    const BuildCard = {
      BuildCard: {
        IsDoBuildCard: false,
        BuildFourRatio: 80,
        BuildFlushGte5Ratio: 80,
        BuildFlush4Ratio: 80, // 构建4顺子
        BuildFlush3Ratio: 80, // 构建3顺子
        BuildThreeRatio: 80, // 构建3条概率
        BuildFourMaxNum: 4,
        BuildFlushGte5MaxNum: 1,
        BuildFlush4MaxNum: 1,
        BuildFlush3MaxNum: 1,
        BuildThree3MaxNum: 1, // 构建3顺子数量
        BuildJokerRatio: 80, // 构建Joker概率
        BuildJokerMaxNum: 1, // 构建最大Joker数量
        AiConfigId: i + 1
      }
    }
    ret.push(BuildCard)
  }
  return ret
}
function NewRobotAIItem(level) {
  const configLevel = level + 1
  let configName = '超强机器⼈'
  if (configLevel === 1) {
    configName = '超强机器⼈'
  } else if (configLevel === 2) {
    configName = '稍强机器⼈'
  } else if (configLevel === 3) {
    configName = '正常机器⼈'
  } else if (configLevel === 4) {
    configName = '稍弱机器⼈'
  } else if (configLevel === 5) {
    configName = '超弱机器⼈'
  }

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
function NewRobotAI() {
  const ret = []
  for (let i = 0; i < 5; i++) {
    const AiConfig = NewRobotAIItem(i)
    ret.push(AiConfig)
  }
  return ret
}
function NewPlayerInventory() {
  return [
    {
      TableMoney: 1,
      Count: 1
    },
    {
      TableMoney: 2,
      Count: 2
    },
    {
      TableMoney: 3,
      Count: 3
    },
    {
      TableMoney: 4,
      Count: 4
    },
    {
      TableMoney: 5,
      Count: 5
    },
    {
      TableMoney: 6,
      Count: 6
    },
    {
      TableMoney: 7,
      Count: 7
    },
    {
      TableMoney: 8,
      Count: 8
    },
    {
      TableMoney: 9,
      Count: 9
    }
  ]
}


export default {
  components: {
    robotAiSettingChallenge, robotAiSettingBuildCard, robotAiSettingFight,
    robotAiSettingDrop, robotAiSettingOutCard,
    Publish,
    Compare
  },
  data() {
    return {
      item: {
        RobotAI: NewRobotAI(),
        PlayerControl: {
          CriticalPoint: [0, 0, 0, 0],
          PlayerGoodCard: NewPlayerGoodCard(),
          PlayerControlRound: 0,
          IsSameFirst: false,
          RobotWeight: [
            {
              AiConfigLevel: 1,
              AiConfigName: '超强机器⼈',
              AiWeight: [0, 0, 0, 0, 0]
            },
            {
              AiConfigLevel: 2,
              AiConfigName: '稍强机器⼈',
              AiWeight: [0, 0, 0, 0, 0]
            },
            {
              AiConfigLevel: 3,
              AiConfigName: '正常机器⼈',
              AiWeight: [0, 0, 0, 0, 0]
            },
            {
              AiConfigLevel: 4,
              AiConfigName: '稍弱机器⼈',
              AiWeight: [0, 0, 0, 0, 0]
            },
            {
              AiConfigLevel: 5,
              AiConfigName: '超弱机器⼈',
              AiWeight: [0, 0, 0, 0, 0]
            }
          ]
        },
        GameControl: {
          StrongestKillRatio: 0,
          ControlRange: [
            {
              AiConfigLevel: 1,
              Ratio: 0
            },
            {
              AiConfigLevel: 2,
              Ratio: 0
            },
            {
              AiConfigLevel: 3,
              Ratio: 0
            },
            {
              AiConfigLevel: 4,
              Ratio: 0
            },
            {
              AiConfigLevel: 5,
              Ratio: 0
            }
          ],
          WeakestKillRatio: 0,
          MoveRange: [
            {
              AiConfigLevel: 1,
              Count: 0
            },
            {
              AiConfigLevel: 2,
              Count: 0
            },
            {
              AiConfigLevel: 3,
              Count: 0
            },
            {
              AiConfigLevel: 4,
              Count: 0
            },
            {
              AiConfigLevel: 5,
              Count: 0
            }
          ],
          OriginPoint: 0,
          GameAcceptance: [
            { Level: 1, Rate: 10 },
            { Level: 2, Rate: 10 },
          ]
        },

      },
     
      labelPosition: 'top',
      subKey: 'tongits_jackpot_control',

      editAI: {},
      editAIVisible: false,
      editPlayerGoodCardVisible: false,
      
      editPlayerGoodCard: [],
      Uid: 0,
      Inventory: [],
      editPlayerInventoryVisible: false,
      editPlayerInventory: {},
     
     
      GameRangeLevel: 0,
      GameMoney: 0,
      libShow: $libShow,
    }
  },
  created() {
    this.Inventory = NewPlayerInventory()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    setData() {
     // this.item.PlayerControl = this.PlayerControl
     // this.item.GameControl = this.GameControl
      this.form.Data = JSON.stringify(this.item)
      console.log('this.form.Data:', this.form.Data)
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
            console.log('update response', response)
            Message.success('保存成功')
          }
        })
      })
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
          console.log('response==>', response)
          this.form = response.Data || {}
          // eslint-disable-next-line no-empty
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.$refs.compare.SetOldVal(response.Data)
          } else {

          }
        }
      })
    },
    handleAIUpdate(row) {
      this.editAIVisible = true
      console.log('row==>', row)
      this.editAI = row
    },
    handleUpdatePlayerGoodCard() {
      this.editPlayerGoodCardVisible = true
     // this.editPlayerGoodCard = this.PlayerControl.PlayerGoodCard
    },
    handleGetPlayerInventory() {
    },
    handleRefreshPlayerInventory() {
    },
    handleUpdatePlayerInventory(row) {
      this.editPlayerInventoryVisible = true
      this.editPlayerInventory = row
    },
    handleUpdateGameMoney() {
     
    },
    handleRefreshGameMoney() {
      request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: $this.env,
            gid: ob.uid,
            Path: '/egame/game/pending/value'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            Message.success('刷新成功！')
            this.GameMoney = objs.pendingValue 
            this.GameMoney /= 1000
         
          }
        })
    },
    addRow() {
      this.item.GameControl.GameAcceptance.push({ Level: 0, Rate: 0 })
    },
    delRow(index) {
      this.item.GameControl.GameAcceptance.splice(index, 1)
    },
  }
}
</script>

<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>

    <el-tabs type="border-card">
      <el-tab-pane label="机器⼈类型配置">
        <el-row style="padding-top: 5px">
          <el-col :span="24">
            <div style="padding-top: 10px">
              <el-table
                :data="item.RobotAI"
                stripe
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="AiConfigId"
                  label="级别"
                  width="70">
                </el-table-column>

                <el-table-column
                  prop="AiConfigName"
                  label="级别"
                  width="250"
                />
                <el-table-column
                  label="操作"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="handleAIUpdate(scope.row)"
                    >修改
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="个⼈控制配置">
        <h2 style="text-align:center;">个⼈控制通⽤配置</h2>
        <h4 style="text-align:left;">个⼈控制临界点配置</h4>
        <el-descriptions :column="4" :colon="false" direction="vertical" border>
          <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.PlayerControl.CriticalPoint[0]" />
          </el-descriptions-item>
          <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.PlayerControl.CriticalPoint[1]" />
          </el-descriptions-item>
          <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.PlayerControl.CriticalPoint[2]" />
          </el-descriptions-item>
          <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.PlayerControl.CriticalPoint[3]" />
          </el-descriptions-item>
        </el-descriptions>
        <h4 style="text-align:left;">个⼈控制周期局数</h4>
        <el-descriptions :column="5" :colon="false" direction="vertical" border>
          <el-descriptions-item label="个⼈控制周期局数" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.PlayerControl.PlayerControlRound" />
          </el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <h2 style="text-align:center;">个⼈控制区间配置</h2>
        <el-row>
          <el-form :label-position="labelPosition" label-width="100px">
            <el-form-item label="区间玩家发牌配置" required>
              <el-col :span="2">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-document-copy"
                  @click="handleUpdatePlayerGoodCard()"
                >修改
                </el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="同周期机器⼈类型是否与⾸局⼀致" required>
              <el-col :span="2">
                <el-switch v-model="item.PlayerControl.IsSameFirst" :active-value="true" :inactive-value="false" />
              </el-col>
            </el-form-item>
            <el-form-item label="区间匹配机器⼈权重" required>
              <el-table
                :data="item.PlayerControl.RobotWeight"
                stripe
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="AiConfigName"
                  label="级别"
                  width="250"
                />
                <el-table-column
                  label="强杀区间"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.AiWeight[0]" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="弱杀区间"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.AiWeight[1]" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="正常区间"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.AiWeight[2]" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="弱放区间"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.AiWeight[3]" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="强放区间"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.AiWeight[4]" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="玩家库存查询与修改">
        <el-row style="padding-top: 5px">
          <el-form label-width="150px">
            <el-form-item label="玩家ID" required>
              <el-col :span="4">
                <el-input v-model="Uid" />
              </el-col>
              <el-col :span="2">
                <el-button @click="handleGetPlayerInventory">查询</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="刷新" required>
              <el-col :span="2">
                <el-button @click="handleRefreshPlayerInventory">刷新</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="玩家场次库存" required>
              <el-table
                :data="Inventory"
                stripe
                border
                style="width: 100%"
                show-summary
              >
                <el-table-column
                  prop="TableMoney"
                  label="场次"
                  width="250"
                />
                <el-table-column
                  prop="Count"
                  label="库存"
                  width="250"
                />
                <el-table-column
                  label="操作"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="handleUpdatePlayerInventory(scope.row)"
                    >修改
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="群体控制配置">
        <h3 style="text-align:center;">个⼈控制临界点配置</h3>
        <el-descriptions label="个⼈控制临界点配置" :column="7" :colon="false" direction="vertical" border>
          <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.StrongestKillRatio"><template #append>‱</template></el-input>
          </el-descriptions-item>
          <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.ControlRange[0].Ratio"><template #append>‱</template></el-input>
          </el-descriptions-item>
          <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.ControlRange[1].Ratio"><template #append>‱</template></el-input>
          </el-descriptions-item>
          <el-descriptions-item label="原点" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-tag size="medium" closable>250‱</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.ControlRange[2].Ratio"><template #append>‱</template></el-input>
          </el-descriptions-item>
          <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.ControlRange[3].Ratio"><template #append>‱</template></el-input>
          </el-descriptions-item>
          <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.WeakestKillRatio"><template #append>‱</template></el-input>
          </el-descriptions-item>
        </el-descriptions>
        <h3 style="text-align:center;">群控区间对个⼈区间的移动格数</h3>
        <el-descriptions label="群控区间对个⼈区间的移动格数" :column="6" :colon="false" direction="vertical" border>
          <el-descriptions-item label="区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <span>移动区间数</span>
          </el-descriptions-item>
          <el-descriptions-item label="强杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.MoveRange[0].Count" />
          </el-descriptions-item>
          <el-descriptions-item label="弱杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.MoveRange[1].Count" />
          </el-descriptions-item>
          <el-descriptions-item label="正常区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.MoveRange[2].Count" />
          </el-descriptions-item>
          <el-descriptions-item label="弱放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.MoveRange[3].Count" />
          </el-descriptions-item>
          <el-descriptions-item label="强放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="item.GameControl.MoveRange[4].Count" />
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="游戏库存查询与修改">
        <el-row>
          <el-descriptions :column="3" :colon="false">
            <el-descriptions-item label="当前游戏待调整⾦额:">
              <el-input v-model="GameMoney" />
            </el-descriptions-item>
            <el-descriptions-item>
              <el-button type="primary" @click="handleRefreshGameMoney">刷新</el-button>
            </el-descriptions-item>
            <el-descriptions-item>
              <el-button type="primary" @click="handleUpdateGameMoney">修改</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-row>
          <el-descriptions :column="3" :colon="false">
            <el-descriptions-item label="当前游戏库存所在群控区间:">
              {{ GameRangeLevel }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="场次采信比例配置">
        <el-row style="padding-top: 5px">
          <el-form label-width="150px">
            <el-form-item>
              <el-table
                 :data="item.GameControl.GameAcceptance"
                 stripe
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="level"
                  label="场次"
                  width="250"
                > 
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Level" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rate"
                  label="库存"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Rate" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button type="danger" @click="delRow(scope.$index)">删除</el-button>
                  </template>
    
                </el-table-column>
              </el-table>
              <el-row>
                <el-button type="primary" @click="addRow()">添加</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </el-row>
    
      </el-tab-pane>
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
    <el-dialog
      title="区间玩家发牌配置"
      :visible.sync="editPlayerGoodCardVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editPlayerGoodCard" :model="editPlayerGoodCard" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="强杀">
              <robot-ai-setting-build-card v-model="editPlayerGoodCard[0]" />
            </el-tab-pane>

            <el-tab-pane label="弱杀">
              <robot-ai-setting-build-card v-model="editPlayerGoodCard[1]" />
            </el-tab-pane>

            <el-tab-pane label="正常">
              <robot-ai-setting-build-card v-model="editPlayerGoodCard[2]" />
            </el-tab-pane>

            <el-tab-pane label="弱放">
              <robot-ai-setting-build-card v-model="editPlayerGoodCard[3]" />
            </el-tab-pane>

            <el-tab-pane label="强放">
              <robot-ai-setting-build-card v-model="editPlayerGoodCard[4]" />
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
    <el-dialog
      title="修改场次库存"
      :visible.sync="editPlayerInventoryVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editPlayerInventory" :model="editPlayerInventory" width="70%">
        <el-row>
          <el-form label-width="150px">
            <el-form-item label="场次Level：">
              <template>
                <span>{{ editPlayerInventory.TableMoney }}</span>
              </template>
            </el-form-item>
            <el-form-item label="当前场次库存：">
              <template>
                <span>{{ editPlayerInventory.Count }}</span>
              </template>
            </el-form-item>
            <el-form-item label="修改⾄：" required>
              <template>
                <el-input v-model="editPlayerInventory.Count" />
              </template>
            </el-form-item>
          </el-form>
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
    <compare ref="compare" />
  </div>
</template>

<style scoped>

</style>
