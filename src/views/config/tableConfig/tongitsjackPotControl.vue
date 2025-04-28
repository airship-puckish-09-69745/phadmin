<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
      <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="个⼈控制配置">
            <h2 style="text-align:center;">个⼈控制通⽤配置</h2>
            <h4 style="text-align:left;">个⼈控制临界点配置</h4>
            <el-descriptions :column="4" :colon="false" direction="vertical" border>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.PlayerControl.CriticalPoint[0]" />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.PlayerControl.CriticalPoint[1]" />
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.PlayerControl.CriticalPoint[2]" />
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.PlayerControl.CriticalPoint[3]" />
              </el-descriptions-item>
            </el-descriptions>
            <h4 style="text-align:left;">个⼈控制周期局数</h4>
            <el-descriptions :column="5" :colon="false" direction="vertical" border>
              <el-descriptions-item label="个⼈控制周期局数" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.PlayerControl.PlayerControlRound" />
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
                    <el-switch v-model.number="item.PlayerControl.IsSameFirst" :active-value="true" :inactive-value="false" />
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
                        <el-input v-model.number="scope.row.AiWeight[0]" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="弱杀区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[1]" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="正常区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[2]" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="弱放区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[3]" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="强放区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[4]" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="玩家库存查询与修改" name="playerInfoQuery">
            <el-row style="padding-top: 5px">
              <el-form label-width="150px">
                <el-form-item label="玩家ID" required>
                  <el-col :span="4">
                    <el-input v-model.number="Uid" />
                  </el-col>
                  <el-col :span="2">
                    <el-button @click="handleGetPlayerAllLevelMoney">查询</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="刷新" required>
                  <el-col :span="2">
                    <el-button @click="handleGetPlayerAllLevelMoney">刷新</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="玩家场次库存" required>
                  <el-table
                    :data="PlayerTableMoneyInfo"
                    stripe
                    border
                    style="width: 100%"
                    show-summary
                  >
                    <el-table-column
                      prop="TableMoney"
                      label="游戏底注"
                      width="250"
                      :formatter="(row) => (row.TableMoney / 1000)"
                    ></el-table-column>
                    <el-table-column
                      prop="Money"
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
                          @click="handleUpdatePlayerLevelMoney(scope.row)"
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
                <el-input 
                  v-model="editGameControl.StrongestKillRatio"
                  @input="handlePercentInput(editGameControl, 'StrongestKillRatio', 0, 100)"
                  placeholder="0-100"
                >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input 
                  v-model="editGameControl.ControlRange[0].Ratio"
                  @input="handlePercentInput(editGameControl.ControlRange[0], 'Ratio')"
                  placeholder="0-100"
                  >
                  <template #append>%</template></el-input>
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input 
                  v-model="editGameControl.ControlRange[1].Ratio"
                  @input="handlePercentInput(editGameControl.ControlRange[1], 'Ratio')"
                
                  placeholder="0-100"
                  ><template #append>%</template></el-input>
              </el-descriptions-item>
              <el-descriptions-item label="原点" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-tag size="medium" closable>2.5%</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input 
                  v-model="editGameControl.ControlRange[3].Ratio"
                  @input="handlePercentInput(editGameControl.ControlRange[3], 'Ratio')"
                 
                  placeholder="0-100"
                  ><template #append>%</template></el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input 
                  v-model="editGameControl.ControlRange[4].Ratio"
                  @input="handlePercentInput(editGameControl.ControlRange[4], 'Ratio')"
                
                  placeholder="0-100"
                  ><template #append>%</template></el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input 
                  v-model="editGameControl.WeakestKillRatio"
                  @input="handlePercentInput(editGameControl, 'WeakestKillRatio')"
                 
                  placeholder="0-100"
                ><template #append>%</template></el-input>
              </el-descriptions-item>
          
            </el-descriptions>
            <h3 style="text-align:center;">群控区间对个⼈区间的移动格数</h3>
            <el-descriptions label="群控区间对个⼈区间的移动格数" :column="6" :colon="false" direction="vertical" border>
              <el-descriptions-item label="区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <span>移动区间数</span>
              </el-descriptions-item>
              <el-descriptions-item label="强杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.GameControl.MoveRange[0].Count" />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.GameControl.MoveRange[1].Count" />
              </el-descriptions-item>
              <el-descriptions-item label="正常区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.GameControl.MoveRange[2].Count" />
              </el-descriptions-item>
              <el-descriptions-item label="弱放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.GameControl.MoveRange[3].Count" />
              </el-descriptions-item>
              <el-descriptions-item label="强放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="item.GameControl.MoveRange[4].Count" />
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="游戏库存查询与修改"  name="gameMoneyQuery">
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="当前游戏待调整⾦额:">
                  <el-input v-model="GameMoney" />
                </el-descriptions-item>
                <el-descriptions-item>
                  <el-button type="primary" @click="handleRefreshGameMoney">刷新</el-button>
                </el-descriptions-item>
                <!-- <el-descriptions-item>
                  <el-button type="primary" @click="handleUpdateGameMoney">修改</el-button>
                </el-descriptions-item> -->
              </el-descriptions>
            </el-row>
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="当前游戏库存所在群控区间:">
                  {{ GameRangeName }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="场次采信比例配置" name="gameInfoQuery">
            <el-row style="padding-top: 5px">
              <el-form label-width="150px">
                <el-form-item>
                  <el-table
                    :data="editGameControl.GameAcceptance"
                    stripe
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="TableMoney"
                      label="游戏底注"
                      width="250"
                       :formatter="(row) => (row.TableMoney / 1000)"
                    /> 
                    <el-table-column
                      prop="rate"
                      label="场次采信比例"
                      width="250"
                      required="true" 
                    
                    >
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.Rate" 
                          placeholder="0-100"
                            @input="handleDecimalInput(scope.row, 'Rate')" >
                            <template #append>%</template></el-input>
                        </template>
                    </el-table-column>
                  </el-table>
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
              <robot-ai-setting-build-card v-model.number="editPlayerGoodCard[0]" />
            </el-tab-pane>

            <el-tab-pane label="弱杀">
              <robot-ai-setting-build-card v-model.number="editPlayerGoodCard[1]" />
            </el-tab-pane>

            <el-tab-pane label="正常">
              <robot-ai-setting-build-card v-model.number="editPlayerGoodCard[2]" />
            </el-tab-pane>

            <el-tab-pane label="弱放">
              <robot-ai-setting-build-card v-model.number="editPlayerGoodCard[3]" />
            </el-tab-pane>

            <el-tab-pane label="强放">
              <robot-ai-setting-build-card v-model.number="editPlayerGoodCard[4]" />
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
            <el-form-item label="Uid：">
              <template>
                <span>{{ Uid }}</span>
              </template>
            </el-form-item>
            <el-form-item label="游戏底注：">
              <template>
                <span>{{ editPlayerInventory.TableMoney/1000 }}</span>
              </template>
            </el-form-item>
            <el-form-item label="当前场次库存：">
              <template>
                <span>{{ editPlayerInventory.Money }}</span>
              </template>
            </el-form-item>
            <el-form-item label="修改⾄：" required>
              <template>
                <el-input v-model.number="editPlayerInventory.Money" />
              </template>
            </el-form-item>
          </el-form>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="savePlayerLevelMoney">保存</el-button>
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


<script>
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import Compare from '@/components/Compare'
import request from '@/utils/request'
import { ValidateVueItem ,DataRule} from '@/utils/common'


export default {
  components: {
    Publish,
    Compare
  },
  data() {
    return {
      gameId: 128,
      playMode: 4, // 经典玩法
      tableData: [],
      item: {
        PlayerControl: {
          CriticalPoint: [0, 0, 0, 0],
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
              Ratio: 25
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
          GameAcceptance: []
        },

      },

      form: {},

      labelPosition: 'top',
      subKey: 'tongits_jackpot_control',

      editAI: {},
      editAIVisible: false,
      editPlayerGoodCardVisible: false,
      
      editPlayerGoodCard: [],
      Uid: 0,
      VisibleUid: false,
      PlayerTableMoneyInfo: [],
      editPlayerInventoryVisible: false,
      editPlayerInventory: {},
      GameRangeLevel: 0,
      GameRangeName: 0,
      GameMoney: 0,
      editGameControl:{
        StrongestKillRatio:'0',
        ControlRange: [{
          AiConfigLevel: 1,
          Ratio: "10"
        }, {
          AiConfigLevel: 2,
          Ratio: "11.2"
        }, {
          AiConfigLevel: 3,
          Ratio: 0
        }, {
          AiConfigLevel: 4,
          Ratio: "1.6"
        }, {
          AiConfigLevel: 5,
          Ratio: "22.0"
        }],
        WeakestKillRatio:'0',
        GameAcceptance: []
      }
    }
  },
  created() {
    // this.PlayerTableMoneyInfo = NewPlayerLevelMoney()
     this.getData()
     this.getGameConfig()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    convertToFloat(value) {
      let num = parseFloat(value) || 0;
      return Number(num.toFixed(2)); // 保留计算精度
    },
    setData() {
      console.log("refs",this.$refs)
      // if (!ValidateVueItem(this.$refs['item'])) return false

      // if (this.editAIVisible) {
      //   this.item.RobotAI = this.editAI
      // }

      this.item.GameControl.StrongestKillRatio = this.convertToFloat(this.editGameControl.StrongestKillRatio)
      this.item.GameControl.ControlRange = []
      this.item.GameControl.WeakestKillRatio =this.convertToFloat(this.editGameControl.WeakestKillRatio)
      for (let i = 0; i <  this.editGameControl.ControlRange.length; i++) {
        let tmp = this.editGameControl.ControlRange[i]
        this.item.GameControl.ControlRange.push({AiConfigLevel: tmp.AiConfigLevel,Ratio:this.convertToFloat(tmp.Ratio)} )
      }

      
      this.item.GameControl.GameAcceptance = []
      for (let i = 0; i <  this.editGameControl.GameAcceptance.length; i++) {
        let tmp =  this.editGameControl.GameAcceptance[i]
        this.item.GameControl.GameAcceptance.push({TableMoney: tmp.TableMoney, Rate:  this.convertToFloat(tmp.Ratio), Level: tmp.Level})
      }


      console.log('this.item:', this.item)
      this.form.Data = JSON.stringify(this.item)
      console.log('this.form.Data:', this.form.Data)
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
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          // eslint-disable-next-line no-empty
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)

            this.editGameControl.StrongestKillRatio = this.item.GameControl.StrongestKillRatio.toString()
            this.editGameControl.ControlRange = []
            this.editGameControl.WeakestKillRatio = this.item.GameControl.WeakestKillRatio.toString()
            for (let i = 0; i <  this.item.GameControl.ControlRange.length; i++) {
              let tmp = this.item.GameControl.ControlRange[i]
              this.editGameControl.ControlRange.push({AiConfigLevel: tmp.AiConfigLevel,Ratio:tmp.Ratio.toString()} )
            }

            this.editGameControl.GameAcceptance = []
            for (let i = 0; i < this.item.GameControl.GameAcceptance.length; i++) {
              let tmp = this.item.GameControl.GameAcceptance[i]
              this.editGameControl.GameAcceptance.push({TableMoney: tmp.TableMoney, Rate:  tmp.Rate.toString(), Level: tmp.Level})
            }
            
            //console.log("this.editGameControl", this.editGameControl)
          } else {
            Message.error('保存失败')
          }
        }
      })
    },

    handleTabClick(tab) {
      if (tab.name == "gameMoneyQuery") {
        this.handleRefreshGameMoney() 
      } else if (tab.name == "gameInfoQuery") {
        this.showGameMoney()
      } else if (tab.name == "playerInfoQuery") {
        this.handleRefreshPlayerLevels()
      }

    },

    showGameMoney() {
      let gameAcceptance = []
      for (let j = 0; j < this.tableData.length; j++) {
        let tableMoney = this.tableData[j].TableMoney
        let f = false 
        let tmp = {}
        for (let i = 0; i < this.item.GameControl.GameAcceptance.length; i++) {
          let levelTableMoney = this.item.GameControl.GameAcceptance[i].TableMoney
          if (tableMoney == levelTableMoney) {
            f = true;
            gameAcceptance.push(this.item.GameControl.GameAcceptance[i])
            break
          }
        }
        if (!f) {
          gameAcceptance.push({  TableMoney: tableMoney, Rate: 0 , Level: this.tableData[j].Level})
        } 
      } 
      this.editGameControl.GameAcceptance = []
      for (let i = 0; i < gameAcceptance.length; i++) {
        let tmp = gameAcceptance[i]
        this.editGameControl.GameAcceptance.push({TableMoney: tmp.TableMoney, Rate:  tmp.Rate.toString(), Level: tmp.Level})
      }

     // console.log("gameAcceptance", this.editGameControl)
      this.item.GameControl.GameAcceptance = gameAcceptance 
    },

    handleAIUpdate(row) {
      this.editAIVisible = true
      // console.log('row==>', row)
      this.editAI = row
    },
    handleUpdatePlayerGoodCard() {
      this.editPlayerGoodCardVisible = true
     // this.editPlayerGoodCard = this.PlayerControl.PlayerGoodCard
    },

    handleRefreshPlayerLevels() {
      this.PlayerTableMoneyInfo = []
      for (let i = 0; i < this.tableData.length; i++) {
        this.PlayerTableMoneyInfo.push({TableMoney: this.tableData[i].TableMoney, Money: 0})
      } 
     // console.log("this.PlayerTableMoneyInfo", this.PlayerTableMoneyInfo)

    },
    handleGetPlayerAllLevelMoney() {
      if (this.Uid == 0) {
        Message.warning('请输入正确的uid')
        return
      }
      request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            gid: this.gameId,
            uid: this.Uid,
            Path: '/egamecontorl/player/table/money/info'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            this.VisibleUid = true
            Message.success('刷新成功！')
            if (objs.list === undefined) {
               objs.list = []
            }
            for (let j = 0; j < objs.list.length; j++) {
              for (let i = 0; i < this.PlayerTableMoneyInfo.length; i++) 
                if (objs.list[j].tableMoney == this.PlayerTableMoneyInfo[i].TableMoney) {
                  this.PlayerTableMoneyInfo[i].Money = objs.list[j].money/1000
                  break
                }
            }
            
          } else {
            Message.warning('请输入正确的uid')
            this.VisibleUid = false
          }
        })
    },

    handleUpdatePlayerLevelMoney(row) {
      if (this.Uid == 0 || !this.VisibleUid) {
        Message.warning('请输入正确的uid')
        return
      }

      this.editPlayerInventoryVisible = true
      this.editPlayerInventory = row

     
    },

    savePlayerLevelMoney() {
      if (!this.editPlayerInventoryVisible) {
        return 
      }
      console.log("savePlayerLevelMoney:", this.editPlayerInventory )
      request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            gid: this.gameId,
            uid: this.Uid,
            tableMoney: this.editPlayerInventory.TableMoney,
            value: this.editPlayerInventory.Money*1000,
            Path: '/egamecontorl/set/player/table/money/info'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
     
    },
    handleUpdateGameMoney() {
      request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            gid: this.gameId,
            value: this.GameMoney*1000,
            Path: '/egamecontorl/set/game/money'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
     
    },
    handleRefreshGameMoney() {
      request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            gid: this.gameId,
            Path: '/egamecontorl/game/money'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []

           
            Message.success('刷新成功！')
            this.GameMoney = objs.gameMoney 
            this.GameMoney /= 1000

            this.GameRangeLevel = objs.gameRangeLevel

            console.log("handleRefreshGameMoney:",  this.GameRangeLevel)
            console.log("this.item.RobotWeight:", this.item.PlayerControl.RobotWeight)
            for (let i = 0; i < this.item.PlayerControl.RobotWeight.length; i++) {
              if (this.item.PlayerControl.RobotWeight[i].AiConfigLevel == this.GameRangeLevel) {
                 this.GameRangeName = this.item.PlayerControl.RobotWeight[i].AiConfigName
                 break
              }
            } 
          }
        })
    },
    getGameConfig() {
      request({
        url: '/tongitsjackpottable/all',
        method: 'get',
        data: {
          PlayMode: this.playMode
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log("objsff:", objs)
          let data = objs
          this.tableData= []
          for (let j = 0; j < data.length; j++) {
            if (data[j].RoomLevel > 0) {
              continue
            }
            let hasLevel = false;
            let tableMoney = data[j].TableMoney
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].TableMoney == tableMoney) {
                hasLevel = true;
              }
            }
            if (hasLevel) {
              continue;
            }
            this.tableData.push(data[j])
          }
        }
      })
    },
    dataRule(required, config) {
      console.log(config)
      return DataRule(required, config)
    },
    handleDecimalInput(row, key) {
      // 1. 过滤非法字符（只保留数字和小数点）
      let value = row[key] ? row[key].toString() : '0';
      value = value.replace(/[^\d.]/g, '')
                  .replace(/^0+(\d)/, '$1')  // 禁止 01 → 变为 1
                  .replace(/^\./, '0.')      // 补全 .5 → 0.5
                  .replace(/(\..*)\./g, '$1'); // 禁止多个小数点

      // 2. 禁止以小数点开头（如 ".5" → "0.5"）
      if (value.startsWith('.')) {
        value = '0' + value;
      }

      // 3. 确保最多一个小数点
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // 4. 限制小数点后最多两位（百分比通常只需两位小数）
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2);
      }

      const numValue = parseFloat(value) || 0;
      if (numValue < 0) {
        value = '0';
      } else if (numValue > 100) {
        value = '100';
      } else if (isNaN(numValue)) {
        value = '0'; // 异常值重置为 0
      }

      // 5. 更新绑定的值（保留字符串类型，避免自动转换问题）
      row[key] = value === '' ? null : value;
    },

    // 处理百分比输入（0-100%）
    handlePercentInput(obj, key, min = 0, max = 100) {
      let value = obj[key]?.toString() || '0';
      
      value = value.replace(/[^\d.]/g, '')
                  .replace(/^0+(\d)/, '$1')  // 禁止 01 → 变为 1
                  .replace(/^\./, '0.')      // 补全 .5 → 0.5
                  .replace(/(\..*)\./g, '$1'); // 禁止多个小数点
      
      const parts = value.split('.');
      if (parts.length > 1) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`; // 限制2位小数
      }

      // 实时范围限制
      const numValue = parseFloat(value) || 0;
      if (numValue > max) value = max.toString();
      if (numValue < min) value = min.toString();

      obj[key] = value;
    },

    // 标准化百分比值（失焦时处理）
    normalizePercent(obj, key) {
      let value = obj[key]?.toString() || '0';
      
      // 补全小数位（如 5 → 5.00）
      if (!value.includes('.')) {
        value = value + '.00';
      } else if (value.endsWith('.')) {
        value = value + '00';
      } else if (value.split('.')[1]?.length === 1) {
        value = value + '0';
      }

      obj[key] = value;
    }
  }
 
}
</script>

