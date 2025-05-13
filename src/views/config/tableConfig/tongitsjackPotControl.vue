<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">EGame游戏控制配置</h3>
      <el-row style="margin: 10px 0;">
        AppId <el-select v-model="editAppId" filterable placeholder="请选择" size="small" style="margin-right: 12px; width: 300px" @change="handleUpdateAppid">
          <el-option v-for="item in appidInfoCfgs" :key="item.appId" :label="`${item.appName}-${item.appId}`" :value="item.appId" />
        </el-select>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch" />
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleShowCopyDialog">复制配置列表</el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleShowCreateDialog" /> -->
      </el-row>
    </el-row>


      <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="个⼈控制配置">
            <h2 style="text-align:center;">个⼈控制通⽤配置</h2>
            <h4 style="text-align:left;">个⼈控制临界点配置</h4>
            <p style="color: red; font-weight: bold;">⚠️ 正数：玩家输给系统， 负数：系统输给玩家！</p>
            <el-descriptions :column="4" :colon="false" direction="vertical" border>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.PlayerControl.CriticalPoint[0]" />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.PlayerControl.CriticalPoint[1]" />
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.PlayerControl.CriticalPoint[2]" />
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.PlayerControl.CriticalPoint[3]" />
              </el-descriptions-item>
            </el-descriptions>
            <h4 style="text-align:left;">个⼈控制周期局数</h4>
            <el-descriptions :column="5" :colon="false" direction="vertical" border>
              <el-descriptions-item label="个⼈控制周期局数" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.PlayerControl.PlayerControlRound" />
              </el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <h2 style="text-align:center;">个⼈控制区间配置</h2>
            <el-row>
              <el-form :label-position="labelPosition" label-width="100px">
                <el-form-item label="同周期机器⼈类型是否与⾸局⼀致" required>
                  <el-col :span="2">
                    <el-switch v-model.number="editGameControl.PlayerControl.IsSameFirst" :active-value="true" :inactive-value="false" />
                  </el-col>
                </el-form-item>
                <el-form-item label="区间匹配机器⼈权重" required>
                  <el-table
                    :data="editGameControl.PlayerControl.RobotWeight"
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
                <el-form-item label="玩家场次库存"  :error="'⚠️ 正数：玩家输给系统， 负数：系统输给玩家！'" required>
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
            <h3 style="text-align:center;">群体控制临界点配置</h3>
            <el-descriptions label="群体控制临界点配置" :column="7" :colon="false" direction="vertical" border>
              <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[0].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[0], 'Ratio', 0, 100)"
                  placeholder="0-100"
                >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[1].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[1], 'Ratio')"
                  placeholder="0-100"
                  >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[2].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[2], 'Ratio')"
                  placeholder="0-100"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="原点" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-tag size="medium" closable>{{editGameControl.GameControl.ControlRange[3].Ratio}}%</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[4].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[4], 'Ratio')"
                  placeholder="0-100"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[5].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[5], 'Ratio')"
                  placeholder="0-100"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[6].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[6], 'Ratio')"
                  placeholder="0-100"
                >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
            </el-descriptions>
            <h3 style="text-align:center;">群控区间对个⼈区间的移动格数</h3>
            <el-alert
              title="⚠️  负数往左偏移， 正数往右偏移"
              type="error"
              :closable="false"
              style="margin-bottom: 16px;"
            />
            <el-descriptions label="群控区间对个⼈区间的移动格数" :column="6" :colon="false" direction="vertical" border>

              <el-descriptions-item label="区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <span>移动区间数</span>
              </el-descriptions-item>
              <el-descriptions-item label="强杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[1].MoveRange" />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[2].MoveRange" />
              </el-descriptions-item>
              <el-descriptions-item label="正常区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[4].MoveRange" />
              </el-descriptions-item>
              <el-descriptions-item label="弱放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[5].MoveRange" />
              </el-descriptions-item>
              <el-descriptions-item label="强放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[6].MoveRange" />
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="游戏库存查询与修改"  name="gameMoneyQuery">
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="当前游戏待调整⾦额:">
                  {{ GameMoney }}
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
                    :data="editGameControl.GameControl.GameAcceptance"
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
                        <el-input
                          v-model="scope.row.Ratio"
                          placeholder="0-100"
                          @input="handleDecimalInput(scope.row, 'Ratio')" >
                          <template #append>%</template>
                        </el-input>
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
              <el-tooltip content="点击保存<立即生效>" placement="top">
                <el-button type="primary" size="medium" @click="savePlayerLevelMoney">保存</el-button>
              </el-tooltip>
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
import {DataRule } from '@/utils/common'


export default {
  components: {
    Publish,
    Compare
  },
  data() {
    return {
      gameId: 128,
      playMode: 4, // 经典玩法
   
      appidInfoCfgs: [],

      tableData: [],
      egameData: {},

      editVisible: false,
      editAppId: 0,

      form: {},
      gameAreaName: [
        '强杀全生效',
        '强杀',
        '弱杀',
        '正常',
        '正常',
        '弱放',
        '强放',
        '强放全生效'
      ],
      labelPosition: 'top',
      subKey: 'tongits_jackpot_control',

      Uid: 0,
      VisibleUid: false,
      PlayerTableMoneyInfo: [
        {
          TableMoney: 0,
          Money: 0
        },
        {
          TableMoney: 0,
          Money: 0
        }
      ],
      editPlayerInventoryVisible: false,
      editPlayerInventory: {},
      GameRangeName: 0,
      GameMoney: 0,
      editGameControl: {
        appid: 1000002, 
        name: 'dayusenlin' , 
        PlayerControl: 
        {
          CriticalPoint: [-20000, -10000, 10000, 20000],
          PlayerControlRound: 0,
          IsSameFirst: false,
          RobotWeight: [
            {
              AiConfigLevel: 5,
              AiConfigName: '超强机器⼈',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 4,
              AiConfigName: '稍强机器⼈',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 3,
              AiConfigName: '正常机器⼈',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 2,
              AiConfigName: '稍弱机器⼈',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 1,
              AiConfigName: '超弱机器⼈',
              AiWeight: [1, 1, 1, 1, 1]
            }
          ]
        },
        GameControl: {
          ControlRange: [
            {
              MoveRange: -2, // 强杀全生效
              Ratio: 110
            },
            {
              MoveRange: -2, // 强杀移动区间
              Ratio: 120
            },
            {
              MoveRange: -1, // 弱杀移动区间
              Ratio: 130
            },
            {
              MoveRange: 0, // 正常移动区间
              Ratio:250
            },
            {
              MoveRange: 0, // 正常移动区间
              Ratio: 260
            },
            {
              MoveRange: 1, // 弱放移动区间
              Ratio: 300
            },
            {
              MoveRange: 2, // 强放移动区间
              Ratio: 350
            }
          ],
          OriginPoint: 250,
          GameAcceptance: [
            {
              TableMoney: 1000,
              Ratio: 0
            }
          ]
        },
      },
    }
  },
  created() {
    this.getData()
    this.getGameConfig()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    convertToFloat(value) {
      const num = Math.round(parseFloat(value) * 100) || 0
      return Math.floor(num)
    },
    checkControlRangeSave() {
      console.log(" this.editGameControl",  this.editGameControl)

      this.editGameControl.GameControl.ControlRange[3].MoveRange = this.editGameControl.GameControl.ControlRange[4].MoveRange
      const ControlRange = []
      for (let i = 0; i < this.editGameControl.GameControl.ControlRange.length; i++) {
        const tmp = this.editGameControl.GameControl.ControlRange[i]
        ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: this.convertToFloat(tmp.Ratio) })
      }
      console.log("ControlRange", ControlRange)
      for (let i = 1; i < ControlRange.length; i++) {
        if (ControlRange[i - 1].Ratio >= ControlRange[i].Ratio) {
           console.log("ControlRange",ControlRange[i - 1].Ratio,  ControlRange[i].Ratio, )
          return false
        }
      }
      return true
    },
    checkPlayerCanSave() {
      if (this.editGameControl.PlayerControl.CriticalPoint.length < 1) {
        return false
      }
      for (let i = 1; i < this.editGameControl.PlayerControl.CriticalPoint.length; i++) {
        if (this.editGameControl.PlayerControl.CriticalPoint[i - 1] >= this.editGameControl.PlayerControl.CriticalPoint[i]) {
          return false
        }
      }
      return true
    },
    checkRobotWeigth() {
      for (let i = 0; i < this.editGameControl.PlayerControl.RobotWeight[0].AiWeight.length; i++) {
        let sum = 0
        for (let j = 0; j < this.editGameControl.PlayerControl.RobotWeight.length; j++) {
          const tmp = this.editGameControl.PlayerControl.RobotWeight[j]
          sum = sum + tmp.AiWeight[i]
        }
        if (sum === 0) {
          Message.error('区间匹配机器⼈权重之和为0')
          return false
        }
      }
      return true
    },
    setData() {
      if (!this.checkControlRangeSave()) {
        Message.error('群体控制个人临界点配置左边比右边大，请检测数据')
        return
      }

      if (!this.checkRobotWeigth()) {
        return
      }
      if (!this.checkPlayerCanSave()) {
        Message.error('个人控制临界点配置左边比右边大，请检测数据')
        return
      }

      for (let j = 0; j < this.egameData.AppControlConfig.length; j++) {
        const tmpData = this.egameData.AppControlConfig[j]
        if (this.editAppId == tmpData.AppId) {
          let saveData = structuredClone(this.editGameControl)

          saveData.PlayerControl.CriticalPoint = []
          for (let i = 0; i < this.editGameControl.PlayerControl.CriticalPoint.length; i++) {
            saveData.PlayerControl.CriticalPoint.push(this.editGameControl.PlayerControl.CriticalPoint[i] * 1000)
          }

          saveData.GameControl.ControlRange = []
          saveData.GameControl.OriginPoint = this.convertToFloat(this.editGameControl.GameControl.OriginPoint)
          for (let i = 0; i < this.editGameControl.GameControl.ControlRange.length; i++) {
            const tmp = this.editGameControl.GameControl.ControlRange[i]
            saveData.GameControl.ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: this.convertToFloat(tmp.Ratio) })
          }
     
        
          saveData.GameControl.GameAcceptance = []
          for (let i = 0; i < this.editGameControl.GameControl.GameAcceptance.length; i++) {
            const tmp = this.editGameControl.GameControl.GameAcceptance[i]
            saveData.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: this.convertToFloat(tmp.Ratio) })
          }

          this.egameData.AppControlConfig[i] = structuredClone(saveData)
        }

        
      }

      console.log("save", this.egameData)
      this.form.Data = JSON.stringify(this.egameData)
      const $this = this

      console.log("this.form.Data",  this.form.Data)
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
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          console.log("this.form ", this.form)
          // eslint-disable-next-line no-empty
          if (response.Data && response.Data.Data !== '') {
            this.egameData = JSON.parse(response.Data.Data)
          
      
            for (let i = 0; i < this.egameData.AppControlConfig.length; i++) {
              this.appidInfoCfgs.push({appId: this.egameData.AppControlConfig[i].AppId, appName: this.egameData.AppControlConfig[i].AppName})
            }
            if (this.appidInfoCfgs.length > 0) {
              this.copyDataToEidt(0)
              // this.editAppId = this.appidInfoCfgs[0].appId

              // this.editGameControl = structuredClone(this.egameData.AppControlConfig[0])
              // const tmpData = this.egameData.AppControlConfig[0]

              // this.editGameControl.GameControl.ControlRange = []
              // for (let i = 0; i < tmpData.GameControl.ControlRange.length; i++) {
              //   const tmp = tmpData.GameControl.ControlRange[i]
              //   this.editGameControl.GameControl.ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: (tmp.Ratio / 100).toString() })
              // }

              // this.editGameControl.GameControl.GameAcceptance = []
              // for (let i = 0; i < tmpData.GameControl.GameAcceptance.length; i++) {
              //   const tmp = tmpData.GameControl.GameAcceptance[i]
              //   this.editGameControl.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: (tmp.Ratio / 100).toString() })
              // }
              // this.editGameControl.GameControl.OriginPoint = (tmpData.GameControl.OriginPoint / 100).toString()
              
              // this.editGameControl.PlayerControl.CriticalPoint = []
              // for (let i = 0; i < tmpData.PlayerControl.CriticalPoint.length; i++) {
              //   this.editGameControl.PlayerControl.CriticalPoint.push(tmpData.PlayerControl.CriticalPoint[i] / 1000)
              // }


            } else {
              this.editAppId = 0
            }
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)

            console.log("begin", this.egameData)

          } else {
            Message.error('保存失败')
          }
        }
      })
    },

    copyDataToEidt(index) {
          this.editAppId = this.appidInfoCfgs[index].appId

        this.editGameControl = structuredClone(this.egameData.AppControlConfig[index])
        const tmpData = this.egameData.AppControlConfig[index]

        this.editGameControl.GameControl.ControlRange = []
        for (let i = 0; i < tmpData.GameControl.ControlRange.length; i++) {
          const tmp = tmpData.GameControl.ControlRange[i]
          this.editGameControl.GameControl.ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: (tmp.Ratio / 100).toString() })
        }

        this.editGameControl.GameControl.GameAcceptance = []
        for (let i = 0; i < tmpData.GameControl.GameAcceptance.length; i++) {
          const tmp = tmpData.GameControl.GameAcceptance[i]
          this.editGameControl.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: (tmp.Ratio / 100).toString() })
        }
        this.editGameControl.GameControl.OriginPoint = (tmpData.GameControl.OriginPoint / 100).toString()

        this.editGameControl.PlayerControl.CriticalPoint = []
        for (let i = 0; i < tmpData.PlayerControl.CriticalPoint.length; i++) {
          this.editGameControl.PlayerControl.CriticalPoint.push(tmpData.PlayerControl.CriticalPoint[i] / 1000)
        }
    },

    handleFilter() {
      this.getData()
    },

    handleTabClick(tab) {
      if (tab.name === 'gameMoneyQuery') {
        this.handleRefreshGameMoney()
      } else if (tab.name === 'gameInfoQuery') {
        this.showGameMoney()
      } else if (tab.name === 'playerInfoQuery') {
        this.handleRefreshPlayerLevels()
      }
    },
    showGameMoney() {
      const gameAcceptance = []
      for (let j = 0; j < this.tableData.length; j++) {
        const tableMoney = this.tableData[j].TableMoney
        let f = false
        for (let i = 0; i < this.editGameControl.GameControl.GameAcceptance.length; i++) {
          const levelTableMoney = this.editGameControl.GameControl.GameAcceptance[i].TableMoney
          if (tableMoney === levelTableMoney) {
            f = true
            gameAcceptance.push(this.editGameControl.GameControl.GameAcceptance[i])
            break
          }
        }
        if (!f) {
          gameAcceptance.push({ TableMoney: tableMoney, Ratio: 0 })
        }
      }
      gameAcceptance.sort((a, b) => a.TableMoney - b.TableMoney)
      this.editGameControl.GameControl.GameAcceptance = []
      for (let i = 0; i < gameAcceptance.length; i++) {
        const tmp = gameAcceptance[i]
        this.editGameControl.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: (tmp.Ratio / 100).toString() })
      }
      this.editGameControl.GameControl.GameAcceptance = gameAcceptance
    },

    handleRefreshPlayerLevels() {
      this.PlayerTableMoneyInfo = []
      for (let i = 0; i < this.tableData.length; i++) {
        this.PlayerTableMoneyInfo.push({ TableMoney: this.tableData[i].TableMoney, Money: 0 })
      }
      this.PlayerTableMoneyInfo.sort((a, b) => a.TableMoney - b.TableMoney)
    },
    handleGetPlayerAllLevelMoney() {
      if (this.Uid === 0) {
        Message.warning('用户不存在')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: this.Uid,
          appid: this.editAppId,
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
            for (let i = 0; i < this.PlayerTableMoneyInfo.length; i++) {
              if (objs.list[j].tableMoney === this.PlayerTableMoneyInfo[i].TableMoney) {
                this.PlayerTableMoneyInfo[i].Money = objs.list[j].money / 1000
                break
              }
            }
          }
        } else {
          Message.warning('请输入正确的uid')
          this.VisibleUid = false
        }
      })
    },

    handleUpdatePlayerLevelMoney(row) {
      if (this.Uid === 0 || !this.VisibleUid) {
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
      // console.log("savePlayerLevelMoney:", this.editPlayerInventory )
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: this.Uid,
          appid: this.editAppId,
          tableMoney: this.editPlayerInventory.TableMoney,
          value: this.editPlayerInventory.Money * 1000,
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
          appid: this.editAppId,
          value: this.GameMoney * 1000,
          Path: '/egamecontorl/set/game/pending/money'
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
          appid: this.editAppId,
          Path: '/egamecontorl/game/pending/money'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log(objs)
          Message.success('刷新成功！')
          this.GameMoney = objs.pendingMoney
          this.GameMoney /= 1000
          if (objs.gameAreaId < 0) {
            this.GameRangeName = this.gameAreaName[0]
          } else if (objs.gameAreaId >= this.gameAreaName.length) {
            this.GameRangeName = this.gameAreaName[7]
          } else {
            this.GameRangeName = this.gameAreaName[objs.gameAreaId]
          }
        }
      })
    },
    getPlayerRobotInfo() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: 1000,
          appid: this.editAppId,
          tableMoney: 10000,
          Path: '/egamecontorl/player/robot/level'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('objs', objs)
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
          const data = objs
          this.tableData = []
          for (let j = 0; j < data.length; j++) {
            let hasLevel = false
            const tableMoney = data[j].TableMoney
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].TableMoney === tableMoney) {
                hasLevel = true
              }
            }
            if (hasLevel) {
              continue
            }
            this.tableData.push(data[j])
          }
        }
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handleDecimalInput(row, key) {
      // 1. 过滤非法字符（只保留数字和小数点）
      let value = row[key] ? row[key].toString() : '0'
      value = value.replace(/[^\d.]/g, '').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').replace(/(\..*)\./g, '$1')
      // 2. 禁止以小数点开头（如 ".5" → "0.5"）
      if (value.startsWith('.')) {
        value = '0' + value
      }

      // 3. 确保最多一个小数点
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      // 4. 限制小数点后最多两位（百分比通常只需两位小数）
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2)
      }
      const numValue = parseFloat(value) || 0
      if (numValue < 0) {
        value = '0'
      } else if (numValue > 100) {
        value = '100'
      } else if (isNaN(numValue)) {
        value = '0' // 异常值重置为 0
      }
      // 5. 更新绑定的值（保留字符串类型，避免自动转换问题）
      row[key] = value === '' ? null : value
    },

    // 处理百分比输入（0-100%）
    handlePercentInput(obj, key, min = 0, max = 100) {
      let value = obj[key]?.toString() || '0'
      value = value.replace(/[^\d.]/g, '').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').replace(/(\..*)\./g, '$1')
      const parts = value.split('.')
      if (parts.length > 1) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`
      }

      // 实时范围限制
      const numValue = parseFloat(value) || 0
      if (numValue > max) value = max.toString()
      if (numValue < min) value = min.toString()
      obj[key] = value
    },

      onSearch() {
        console.log('【searchFilter】: ', this.editAppId)
        for (let i = 0; i < this.egameData.AppControlConfig.length; i++) {
          const tmp = this.egameData.AppControlConfig[i]
          if (tmp.AppId == this.editAppId) {
            this.copyDataToEidt(i)
          }
        }
      },

      handleUpdateAppid(appid) {
        this.onSearch()
    },
  },
  
}
</script>

