<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <div>
      <el-form ref="item" :model="item" label-width="200px">

        <fieldset style="margin-top:20px;">
          <legend>jackpot调控配置</legend>
          <p style="color: red; font-weight: bold;">⚠️ 发布配置后不会主动推送生效，可通过修改某一个场次某一项配置如：“最大围观人数”，产生差异后推送更新一起reload生效！</p>

          <el-row :gutter="10" style="margin-top:40px;">
            <el-col :span="32">
              <el-form-item label="jp服务费*bet：">
                <el-input v-model.number="item.Jackpot.AddPoolPctPreJp" size="mini" :required="true" style="width:160px" />(‰)
              </el-form-item>
            </el-col>
            <el-col :span="32">
              <el-form-item label="解锁jackpot下注：">
                <el-input v-model.number="item.Jackpot.BetMoreThan" size="mini" :required="true" style="width:100px" />
              </el-form-item>
            </el-col>

            <el-col :span="32">
              <el-form-item label="触发jackpot概率：">
                <el-input v-model.number="item.Jackpot.WinJackpotRatio" size="mini" :required="true" style="width:100px" />(‰)
              </el-form-item>
            </el-col>

            <el-col :span="32">
              <el-form-item label="展示奖池保底：">
                <el-input v-model.number="item.Jackpot.ShowPoolMin" size="mini" :required="true" style="width:100px" />
              </el-form-item>
            </el-col>
            
          </el-row>

          <el-row>
            <el-table
              ref="filterTable"
              :data="JackpotRandAwards"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column type="index" />
              <el-table-column label="奖励类型" prop="JackpotType">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.JackpotType" disabled>
                    <el-option
                      v-for="typeItem in JackpotTypes"
                      :key="typeItem.value"
                      :label="typeItem.label"
                      :value="typeItem.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="奖励发放类型" prop="AwardType">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.AwardType" disabled>
                    <el-option
                      v-for="typeItem in AwardTypes"
                      :key="typeItem.Type"
                      :label="typeItem.Name"
                      :value="typeItem.Type"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="发放数量" prop="Value">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Value" style="width: 150px;" size="mini" :required="true">
                    <template v-if="scope.row.AwardType==1" slot="append">%</template>
                    <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="中奖概率" prop="JackpotRate">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.JackpotRate" style="width: 150px;" size="mini" :required="true">
                    <template slot="append">‰</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
                </template>
              </el-table-column>
              <el-table-column label="分段限制" prop="DayLimit">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showDayLimitDialog(scope.row)" />
                  {{ showOpenDayLimit(scope.row.JackpotType, scope.row.DayLimitArr) }}
                </template>
              </el-table-column>
              <el-table-column label="玩家开奖池条件(%)" width="300">
                <template slot-scope="scope">
                  <div v-if="scope.row.AwardType==1">
                    虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
                    &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
                  </div>
                  <span v-if="scope.row.JackpotType==4">
                    5Bet中奖会判断玩家的个人JP贡献值，中奖额≤贡献值才开，玩家开奖后根据中奖额扣除贡献值
                  </span>
                </template>

              </el-table-column>

              <el-table-column label="机器人开奖池值" prop="PoolVal">
                <template v-if="scope.row.AwardType==1" slot-scope="scope">
                  >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
                </template>
              </el-table-column>

              <el-table-column label="机器人开奖数量概率（5min 一次）" prop="RateArr">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
                  {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
                </template>
              </el-table-column>
            </el-table>
          </el-row>

          <el-descriptions class="margin-top" border>
            <el-descriptions-item>
              <span style="color:red;">以下为显示jackpot奖池增长配置。</span>
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            ref="filterTable"
            :data="item.Jackpot.PoolIncrArr"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column label="Id" prop="Id" />
            <el-table-column label="奖池范围">
              <template slot-scope="scope">
                {{ getJackpotPoolTitle(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="[0,2)点" prop="MinRobotNum">
              <template slot-scope="scope">
                {{ getJackpotIncrShow(scope.row, 0, 1) }}
              </template>
            </el-table-column>
            <el-table-column label="[2,7)点" prop="MinRobotNum">
              <template slot-scope="scope">
                {{ getJackpotIncrShow(scope.row, 2, 6) }}
              </template>
            </el-table-column>
            <el-table-column label="[7,9)点" prop="MinRobotNum">
              <template slot-scope="scope">
                {{ getJackpotIncrShow(scope.row, 7, 8) }}
              </template>
            </el-table-column>
            <el-table-column label="[9,18)点" prop="MinRobotNum">
              <template slot-scope="scope">
                {{ getJackpotIncrShow(scope.row, 9, 17) }}
              </template>
            </el-table-column>
            <el-table-column label="[18,24)点" prop="MinRobotNum">
              <template slot-scope="scope">
                {{ getJackpotIncrShow(scope.row, 18, 23) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

        </fieldset>

        <el-form-item>
          <el-row :gutter="10" style="margin-top:20px;">
            <el-button type="primary" @click="setData">保存</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <!-- 【dialog】jackpot开出奖励 -->
    <el-dialog
      :title="poolNumChange.title"
      :modal="false"
      :visible.sync="poolNumChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addPoolNum()">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="savePoolNum">保存</el-button>
      <el-table
        ref="filterTable"
        :data="poolNumChange.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="配置ID" prop="Id">
          <template slot-scope="scope">
            {{ scope.row.Id }}
          </template>
        </el-table-column>
        <el-table-column label="开出数量" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开出概率(%)" prop="Rate">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removePoolNum(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 【dialog】每日限制开出个数 -->
    <el-dialog
      :title="dayLimitChange.title"
      :modal="false"
      :visible.sync="dayLimitChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addDayLimit">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="saveDayLimit">保存</el-button>
      <el-table
        ref="filterTable"
        :data="dayLimitChange.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="配置ID" prop="Id">
          <template slot-scope="scope">
            {{ scope.row.Id }}
          </template>
        </el-table-column>
        <el-table-column label="开始小时" prop="StartHours">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.StartHours" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="结束小时（不包含结束时间点）" prop="EndHours">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.EndHours" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开奖数量" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removeDayLimitNum(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 【dialog】Jackpot奖池增长 -->
    <el-dialog
      :title="incrJackpotForm.title"
      :modal="false"
      :visible.sync="incrJackpotForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm.data">
        <el-form-item>
          <el-table
            ref="filterTable"
            :data="incrJackpotForm.data"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column type="index" />
            <el-table-column label="时间段">
              <template slot-scope="scope">
                [{{ scope.row.StartHour }},{{ scope.row.EndHour+1 }})点
              </template>
            </el-table-column>
            <el-table-column label="每小时增长">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PerHourIncr" style="width: 100px;" size="mini" :required="true" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveIncrJackpotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
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
import { $libShow, $libType } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        Jackpot: {
          AddPoolPctPreJp: 0,
          BetMoreThan: 0,
          WinJackpotRatio: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: [],
          ShowPoolMin:200000
        },
      },
      //
      JackpotRandAwards: [],
      //subKey: 'gameSweeper',
      subKey: 'tongitsjackpot_jp_cfg',
      libShow: $libShow,
      JackpotTypes: [
        { 'label': '一等奖', 'value': 1 },
        { 'label': '二等奖', 'value': 2 },
        { 'label': '三等奖', 'value': 3 },
        { 'label': '5Bet中奖', 'value': 4 }
      ],
      AwardTypes: [
        { 'Type': 1, 'Name': '奖池百分比' },
        { 'Type': 2, 'Name': '下注额倍数' }
      ],
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      killDialogForm: {
        visible: false,
        data: {},
        itemId: 0
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },

      incrJackpotForm: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },

    }
  },
  created() {
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            for (const i in this.item.TableMoneyList) {
              this.item.TableMoneyList[i] /= 1000
            }
            // 设置修改之前数据
            this.JackpotRandAwards = this.item.Jackpot.RandAwards

            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    transMoneyForShow() {
      this.item.Jackpot.BetMoreThan /= 1000
      this.item.Jackpot.ShowPoolMin /= 1000
      for (const k in this.item.Jackpot.RandAwards) {
        this.item.Jackpot.RandAwards[k].PoolVal /= 1000
      }
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      const jackpotInfo = {}
      Object.assign(jackpotInfo, this.item.Jackpot)
      jackpotInfo.RandAwards = []
      jackpotInfo.BetMoreThan *= 1000
      jackpotInfo.ShowPoolMin *= 1000
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        Object.assign(raObj, this.JackpotRandAwards[o])
        raObj.PoolVal *= 1000
        jackpotInfo.RandAwards.push(raObj)
      }
      ret.Jackpot = jackpotInfo
      return ret
    },
    setData() {
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
            Message.success('保存成功')
          }
        })
      })
    },
    showOpenPoolRate(jpType, data) {
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            showStr += data[i].Num + '个(' + data[i].Rate + '%);'
          }
        }
        return showStr
      }
    },
    showOpenDayLimit(jpType, data) {
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data) {
          for (var i = 0; i < data.length; i++) {
            showStr += data[i].StartHours + '到' + data[i].EndHours + '点' + data[i].Num + '个   '
          }
        }
        return showStr
      }
    },
    saveIncrJackpotDialog() {
      for (var i = 0; i < this.item.Jackpot.PoolIncrArr.length; i++) {
        if (this.item.Jackpot.PoolIncrArr[i].Id == this.incrJackpotForm.id) {
          this.item.Jackpot.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (var j = 0; j < this.item.Jackpot.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.Jackpot.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
          }
          break
        }
      }
      this.incrJackpotForm.visible = false
    },
    addPoolNum() {
      let maxId = 0
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id > maxId) {
          maxId = this.poolNumChange.data[i].Id
        }
      }
      maxId++
      this.poolNumChange.data.push({ 'Id': maxId, 'Num': 0, 'Rate': 0 })
    },
    addDayLimit() {
      let maxId = 0
      if (!this.dayLimitChange.data) {
        this.dayLimitChange['data'] = []
        this.dayLimitChange.data.push({ 'Id': maxId, 'StartHours': 0, 'EndHours': 0 })
        return
      } else {
        for (var i = 0; i < this.dayLimitChange.data.length; i++) {
          if (this.dayLimitChange.data[i].Id > maxId) {
            maxId = this.dayLimitChange.data[i].Id
          }
        }
      }
      maxId++
      this.dayLimitChange.data.push({ 'Id': maxId, 'StartHours': 0, 'EndHours': 0 })
    },
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    removeDayLimitNum(id) {
      for (var i = 0; i < this.dayLimitChange.data.length; i++) {
        if (this.dayLimitChange.data[i].Id == id) {
          this.dayLimitChange.data.splice(i, 1)
          break
        }
      }
    },
    savePoolNum() {
      for (var i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.poolNumChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          this.JackpotRandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
    },
    saveDayLimit() {
      for (let i = 0; i < this.dayLimitChange.data.length; i++) {
        if (this.dayLimitChange.data[i].StartHours < 0 || this.dayLimitChange.data[i].EndHours > 24) {
          Message.error('请输入正确的时间')
          return
        }
        if (this.dayLimitChange.data[i].StartHours > this.dayLimitChange.data[i].EndHours) {
          Message.error('请输入正确的时间')
          return
        }
      }
      for (var i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.dayLimitChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          if (this.JackpotRandAwards[i]['DayLimitArr']) {
            this.JackpotRandAwards[i]['DayLimitArr'] = []
          }
          this.JackpotRandAwards[i]['DayLimitArr'] = this.dayLimitChange.data
          break
        }
      }
      this.dayLimitChange.visible = false
    },
    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showPoolNumDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      let jpTypeName = ''
      for (var i = 0; i < this.JackpotTypes.length; i++) {
        if (this.JackpotTypes[i].value == data.JackpotType) {
          jpTypeName = this.JackpotTypes[i].label
          break
        }
      }
      this.poolNumChange.title = jpTypeName + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    showKillDialog(data) {
      this.killDialogForm.data = data.kills
      this.killDialogForm.itemId = data.itemId
      this.killDialogForm.visible = true
    },
    showDayLimitDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      let jpTypeName = ''
      if (this.JackpotTypes) {
        for (var i = 0; i < this.JackpotTypes.length; i++) {
          if (this.JackpotTypes[i].value == data.JackpotType) {
            jpTypeName = this.JackpotTypes[i].label
            break
          }
        }
      }
      this.dayLimitChange.title = jpTypeName + '(开奖数量概率)'
      this.dayLimitChange.data = data.DayLimitArr || []
      this.dayLimitChange.visible = true
      this.dayLimitChange.jackpotType = data.JackpotType
    },

    // 展示jackpot奖池增长标题
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
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
    showIncrJackpotForm(data) {
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (let i = 0; i < data.TimeArr.length; i++) {
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }
      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    },

  }
}
</script>
