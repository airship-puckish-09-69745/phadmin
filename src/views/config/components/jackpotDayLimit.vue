<template>
  <div class="app-container">
    <el-button type="primary" size="mini" @click="addItem"> 添加</el-button>
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
      <el-table-column label="奖励类型" prop="JackpotType" v-if="envProjectName != 'ph_audit'">
        <template slot-scope="scope">
          <!--          <el-input v-model.number="scope.row.JackpotType" style="width: 150px;" size="mini" :required="true" />-->
          <el-select v-model.number="scope.row.JackpotType" t placeholder="请选择" @change="selectChanged">
            <el-option
              v-for="(v,k) in JackpotTypeCfg"
              :key="parseInt(k)"
              :label="v"
              :value="parseInt(k)"
            />
          </el-select>
        </template>
      </el-table-column>

      <!--      <el-table-column label="奖励占比(与Jackpot配置中占比一致)">-->
      <!--        <template v-if="scope.row.AwardType==1" slot-scope="scope">-->
      <!--          {{ item.JackpotCfg[scope.row.JackpotType-1].AwardRate }}%-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="奖励占比" prop="JackpotRate" >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.AwardRate"  size="mini" :required="true">
            <template v-if="scope.row.JackpotType==4" slot="append">倍下注</template>
            <template v-else slot="append">%</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="中奖概率" prop="JackpotRate"  v-if="envProjectName != 'ph_audit'">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.JackpotRate"  size="mini" :required="true">
            <template slot="append">‰</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit" v-if="envProjectName != 'ph_audit'">
        <template slot="header">
          <p style="text-align: center">  每日限制开出个数</p>
          <span style="color: red;font-size: 11px">  注:(0为不限) 不支持>1000(右同) 会卡死游戏</span>
        </template>
        <template slot-scope="scope">
          <el-input v-if="scope.row.JackpotType!==4" v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
          <el-input v-else v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true" disabled><template slot="append">个</template></el-input>
        </template>
      </el-table-column>
      <el-table-column label="分段限制" prop="DayLimitArr" v-if="envProjectName != 'ph_audit'">
        <template slot="header">
          <p style="text-align: center">  分段限制</p>
          <span style="color: red;font-size: 11px">  注: 24小时没有被覆盖的时间一定开不出jp</span>
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showDayLimitDialog(scope.row)" />
          <el-tag v-for="(tag, key) in scope.row.DayLimitArr" v-if="scope.row.AwardType == 1" :key="key" disable-transitions>{{ showOpenDayLimit(tag) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="玩家开奖池条件(%)" width="300" v-if="envProjectName != 'ph_audit'">
        <template slot-scope="scope">
          <div v-if="scope.row.AwardType==1&&scope.row.JackpotType!=4">
            虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
            &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
          </div>
          <span v-if="scope.row.JackpotType==4">
            3Bet中奖会判断玩家的个人JP贡献值，中奖额≤贡献值才开，玩家开奖后根据中奖额扣除贡献值
          </span>
        </template>

      </el-table-column>

      <el-table-column label="机器人开奖池值" prop="PoolVal" v-if="envProjectName != 'ph_audit'">
        <template v-if="scope.row.JackpotType!=4" slot-scope="scope">
          >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
        </template>
      </el-table-column>

      <!--
      <el-table-column label="机器人发奖上限(%)" prop="VrPoolRateMax">
        <template v-if="scope.row.AwardType==1" slot-scope="scope">
          <el-input v-model.number="scope.row.VrPoolRateMax" style="width: 120px;" size="mini" :required="true" />
        </template>
      </el-table-column>
      -->

      <el-table-column label="机器人开奖数量概率" prop="RateArr" v-if="envProjectName != 'ph_audit'">
        <template slot="header">
          <p style="text-align: center">  机器人开奖数量概率</p>
          <span style="font-size: 11px">  注: 个数配置不生效 >0就ok 具体开奖个数由具体游戏决定</span>
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
          <el-tag v-if="scope.row.JackpotType == 4" disable-transitions>{{ showOpenPoolRate(scope.row.JackpotType,"") }}</el-tag>
          <el-tag v-for="(tag, key) in scope.row.RateArr" v-if="scope.row.AwardType == 1" :key="key" disable-transitions>{{ showOpenPoolRate(scope.row.JackpotType,tag) }}</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--              size="mini"-->
      <!--              type="primary"-->
      <!--              @click="addJackpotRandAwards"-->
      <!--          >添加</el-button>-->
      <!--          <el-button type="danger" size="mini" @click="delJackpotRandAwards(scope.$index)">删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

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
        <el-table-column type="index" />
        <el-table-column label="开始小时" prop="StartHours">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.StartHours" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="结束小时(不包含结束时间点)" prop="EndHours">
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
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removeDayLimitNum(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

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
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'JackpotDayLimit',
  components: {},
  props: {
    JackpotRandAwards: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      envProjectName: process.env.VUE_APP_PROJECT,
      // envProjectName: process.env.VUE_APP_PROJECT,
      libShow: $libShow,
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      }
    }
  },

  watch: {
    'JackpotRandAwards': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
    },
    addItem() {
      this.JackpotRandAwards.push({ AwardRate: 0, AwardType: 1, DayLimit: 0, DatLimitArr: [], JackpotRate: 0, JackpotType: 0, RateArr: [] })
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
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
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
    doAdd() {
      this.piggyCfg.push({ Weight: 0, Val: 0 })
    },
    // addJackpotRandAwards(){
    //   this.JackpotRandAwards.push({AwardRate:0,AwardType:0,DayLimit:0,DayLimitArr:[],JackpotRate:0,JackpotType})
    // },
    delJackpotRandAwards(index) {
      if (this.JackpotRandAwards.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.JackpotRandAwards.splice(index, 1)
    },
    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showOpenDayLimit(data) {
      return '[' + data['StartHours'] + ',' + data['EndHours'] + ')点：' + data['Num'] + '个'
    },
    showDayLimitDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      this.dayLimitChange.title = this.JackpotTypeCfg[data.JackpotType] + '(分段限制)'
      this.dayLimitChange.data = data.DayLimitArr || [{}]
      this.dayLimitChange.visible = true
      this.dayLimitChange.jackpotType = data.JackpotType
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
          if (!this.JackpotRandAwards[i]['DayLimitArr']) {
            this.JackpotRandAwards[i]['DayLimitArr'] = []
          }
          this.JackpotRandAwards[i]['DayLimitArr'] = this.dayLimitChange.data
          break
        }
      }
      this.dayLimitChange.visible = false
    },
    removeDayLimitNum(index) {
      this.dayLimitChange.data.splice(index, 1)
    },
    addDayLimit() {
      if (!this.dayLimitChange.data) {
        this.dayLimitChange['data'] = []
      }
      this.dayLimitChange.data.push({ 'StartHours': 0, 'EndHours': 0, 'Num': 0 })
    },
    showPoolNumDialog(data) {
      if (data.JackpotType == 4) {
        return
      }
      this.poolNumChange.title = this.JackpotTypeCfg[data.JackpotType] + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
    },
    showOpenPoolRate(jpType, data) {
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data) {
          showStr += data.Num + '个(' + data.Rate + '%);'
        }
        return showStr
      }
    },
    selectChanged(row) {
      for (const o of this.JackpotRandAwards) {
        if (o.JackpotType == 4) {
          o.AwardType = 2
        } else {
          o.AwardType = 1
        }
      }
      this.JackpotRandAwards.splice(this.JackpotRandAwards.length, this.JackpotRandAwards.length)
    },
    delRow(index) {
      if (this.piggyCfg.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.piggyCfg.splice(index, 1)
    }
  }
}
</script>
