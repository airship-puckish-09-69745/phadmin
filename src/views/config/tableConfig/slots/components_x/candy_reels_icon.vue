<template>
  <div class="app-container">

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>方案A数值</strong></span></div>
          <el-table :data="tableData.PlanA" style="width: 100%">
            <el-table-column prop="Name" label="图标"></el-table-column>
            <el-table-column prop="Values[0]" label="轴1">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[0]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[1]" label="轴2">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[1]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[2]" label="轴3">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[2]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[3]" label="轴4">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[3]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[4]" label="轴5">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[4]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[5]" label="轴6">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[5]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[6]" label="轴7">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[6]" placeholder=""></el-input></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>方案B数值</strong></span></div>
          <el-table :data="tableData.PlanB" style="width: 100%">
            <el-table-column prop="Name" label="图标"></el-table-column>
            <el-table-column prop="Values[0]" label="轴1">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[0]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[1]" label="轴2">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[1]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[2]" label="轴3">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[2]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[3]" label="轴4">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[3]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[4]" label="轴5">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[4]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[5]" label="轴6">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[5]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[6]" label="轴7">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[6]" placeholder=""></el-input></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>方案C数值</strong></span></div>
          <el-table :data="tableData.PlanC" style="width: 100%">
            <el-table-column prop="Name" label="图标"></el-table-column>
            <el-table-column prop="Values[0]" label="轴1">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[0]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[1]" label="轴2">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[1]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[2]" label="轴3">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[2]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[3]" label="轴4">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[3]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[4]" label="轴5">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[4]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[5]" label="轴6">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[5]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[6]" label="轴7">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[6]" placeholder=""></el-input></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>方案D数值</strong></span></div>
          <el-table :data="tableData.PlanD" style="width: 100%">
            <el-table-column prop="Name" label="图标"></el-table-column>
            <el-table-column prop="Values[0]" label="轴1">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[0]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[1]" label="轴2">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[1]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[2]" label="轴3">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[2]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[3]" label="轴4">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[3]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[4]" label="轴5">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[4]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[5]" label="轴6">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[5]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[6]" label="轴7">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[6]" placeholder=""></el-input></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix"><span><strong>方案E数值</strong></span></div>
          <el-table :data="tableData.PlanE" style="width: 100%">
            <el-table-column prop="Name" label="图标"></el-table-column>
            <el-table-column prop="Values[0]" label="轴1">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[0]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[1]" label="轴2">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[1]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[2]" label="轴3">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[2]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[3]" label="轴4">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[3]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[4]" label="轴5">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[4]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[5]" label="轴6">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[5]" placeholder=""></el-input></template>
            </el-table-column>
            <el-table-column prop="Values[6]" label="轴7">
              <template slot-scope="scope"><el-input v-model.number="scope.row.Values[6]" placeholder=""></el-input></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="1" :span="22">
        <el-card class="box-card" style="padding: 20px">
          <div slot="header" class="clearfix">
            <span><strong>方案概率控制</strong> <mark>概率单位是ABCDE概率总和分之一</mark></span>
            <el-button type="text" @click="addControl" style="float:right;">添加</el-button>
          </div>
          <el-table :data="slotsData.ReelsRateConfig.Control" style="width: 100%">
            <el-table-column prop="MinPlayTimes" label="最低玩牌次数" width="150">
              <template slot-scope="scope"><el-input v-model.number="scope.row.MinPlayTimes" placeholder=""><template slot="prepend">&gt;=</template></el-input></template>
            </el-table-column>
            <el-table-column prop="OriginMatrix" label="方案配置">
              <template slot-scope="scope">
              <table>
                <tr>
                  <td>方案类型</td>
                  <td>方案A概率</td>
                  <td>方案B概率</td>
                  <td>方案C概率</td>
                  <td>方案D概率</td>
                  <td>方案E概率</td>
                </tr>
                <tr>
                  <td>初始阵列</td>
                  <td><el-input v-model.number="scope.row.OriginMatrix.PlanARates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.OriginMatrix.PlanBRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.OriginMatrix.PlanCRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.OriginMatrix.PlanDRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.OriginMatrix.PlanERates" placeholder=""></el-input></td>
                </tr>
                <tr>
                  <td>1次掉落</td>
                  <td><el-input v-model.number="scope.row.Drop1Matrix.PlanARates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop1Matrix.PlanBRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop1Matrix.PlanCRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop1Matrix.PlanDRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop1Matrix.PlanERates" placeholder=""></el-input></td>
                </tr>
                <tr>
                  <td>2次掉落</td>
                  <td><el-input v-model.number="scope.row.Drop2Matrix.PlanARates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop2Matrix.PlanBRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop2Matrix.PlanCRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop2Matrix.PlanDRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.Drop2Matrix.PlanERates" placeholder=""></el-input></td>
                </tr>
                <tr>
                  <td>3+次掉落(默认)</td>
                  <td><el-input v-model.number="scope.row.DefaultMatrix.PlanARates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.DefaultMatrix.PlanBRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.DefaultMatrix.PlanCRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.DefaultMatrix.PlanDRates" placeholder=""></el-input></td>
                  <td><el-input v-model.number="scope.row.DefaultMatrix.PlanERates" placeholder=""></el-input></td>
                </tr>
              </table>
              </template>
            </el-table-column>
            <el-table-column prop="MinPlayTimes" label="操作" width="100">
              <template slot-scope="scope"><el-button type="danger" size="mini" @click="delControl(scope.$index)">删除</el-button></template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin: 30px 0">
      <el-col :offset="1">
        <el-button type="primary" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'

export default {
  name: 'SlotsReelsIcon',
  components: { Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    'slotsData.SymbolList': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    },
    'slotsData.ReelsRateConfig': {
      handler: function(val) {
        this.initData()
      }
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  data() {
    return {
      tableData: {
        PlanA: [],
        PlanB: [],
        PlanC: [],
        PlanD: [],
        PlanE: []
      },
      cols: [1, 2, 3, 4, 5, 6, 7],
      symbolMap: {},
      lock: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },

    submitFrm() {
      this.setData()
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }
        $this.$emit('saveData')
        $this.lock = false
      })
    },

    getKey(col) {
      return 'reels' + col
    },

    getLabel(col) {
      return '轴' + col
    },

    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.slotsData.SymbolList) {
        if (this.slotsData.SymbolList[i]['Type'] === 3) {
          continue
        }
        const value = this.slotsData.SymbolList[i]['Value']
        this.symbolMap[value] = this.slotsData.SymbolList[i]['Name']
      }
    },

    getItem() {
      const item = {
        adaptTo: {
          name: '所有人',
          maxPlayTimes: -1
        },
        items: []
      }
      for (const i in this.symbolMap) {
        const row = {
          name: this.symbolMap[i],
          value: parseInt(i)
        }
        for (const x in this.cols) {
          const key = 'reels' + this.cols[x]
          row[key] = 0
        }
        item.items.push(row)
      }
      // 保证顺序
      item.items.sort(function(a, b) {
        return a.value - b.value
      })
      return item
    },

    initData() {
      this.cols = []
      for (let c = 1; c <= this.slotsData.Cols; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      const mapA = {}
      const mapB = {}
      const mapC = {}
      const mapD = {}
      const mapE = {}
      for (let i = 1; i <= 5; i++) {
        mapA['S' + i] = {
          Symbol: i,
          Name: this.symbolMap[i],
          Values: [0, 0, 0, 0, 0, 0, 0]
        }
        mapB['S' + i] = {
          Symbol: i,
          Name: this.symbolMap[i],
          Values: [0, 0, 0, 0, 0, 0, 0]
        }
        mapC['S' + i] = {
          Symbol: i,
          Name: this.symbolMap[i],
          Values: [0, 0, 0, 0, 0, 0, 0]
        }
        mapD['S' + i] = {
          Symbol: i,
          Name: this.symbolMap[i],
          Values: [0, 0, 0, 0, 0, 0, 0]
        }
        mapE['S' + i] = {
          Symbol: i,
          Name: this.symbolMap[i],
          Values: [0, 0, 0, 0, 0, 0, 0]
        }
      }

      if (this.slotsData.ReelsRateConfig.PlanA) {
        for (let i = 0; i < this.slotsData.ReelsRateConfig.PlanA.length; i++) {
          const item = this.slotsData.ReelsRateConfig.PlanA[i]
          for (const j in item.Symbol) {
            const itemSym = item.Symbol[j]
            mapA['S' + itemSym.Symbol].Values[item.Reels] = itemSym.Number
          }
        }
      }
      if (this.slotsData.ReelsRateConfig.PlanB) {
        for (let i = 0; i < this.slotsData.ReelsRateConfig.PlanB.length; i++) {
          const item = this.slotsData.ReelsRateConfig.PlanB[i]
          for (const j in item.Symbol) {
            const itemSym = item.Symbol[j]
            mapB['S' + itemSym.Symbol].Values[item.Reels] = itemSym.Number
          }
        }
      }
      if (this.slotsData.ReelsRateConfig.PlanC) {
        for (let i = 0; i < this.slotsData.ReelsRateConfig.PlanC.length; i++) {
          const item = this.slotsData.ReelsRateConfig.PlanC[i]
          for (const j in item.Symbol) {
            const itemSym = item.Symbol[j]
            mapC['S' + itemSym.Symbol].Values[item.Reels] = itemSym.Number
          }
        }
      }
      if (this.slotsData.ReelsRateConfig.PlanD) {
        for (let i = 0; i < this.slotsData.ReelsRateConfig.PlanD.length; i++) {
          const item = this.slotsData.ReelsRateConfig.PlanD[i]
          for (const j in item.Symbol) {
            const itemSym = item.Symbol[j]
            mapD['S' + itemSym.Symbol].Values[item.Reels] = itemSym.Number
          }
        }
      }
      if (this.slotsData.ReelsRateConfig.PlanE) {
        for (let i = 0; i < this.slotsData.ReelsRateConfig.PlanE.length; i++) {
          const item = this.slotsData.ReelsRateConfig.PlanE[i]
          for (const j in item.Symbol) {
            const itemSym = item.Symbol[j]
            mapE['S' + itemSym.Symbol].Values[item.Reels] = itemSym.Number
          }
        }
      }

      for (const k in mapA) {
        this.tableData.PlanA.push(mapA[k])
      }
      for (const k in mapB) {
        this.tableData.PlanB.push(mapB[k])
      }
      for (const k in mapC) {
        this.tableData.PlanC.push(mapC[k])
      }
      for (const k in mapD) {
        this.tableData.PlanD.push(mapC[k])
      }
      for (const k in mapE) {
        this.tableData.PlanE.push(mapC[k])
      }
    },

    setData() {
      const mapA = {}
      const mapB = {}
      const mapC = {}
      const mapD = {}
      const mapE = {}
      const planA = []
      const planB = []
      const planC = []
      const planD = []
      const planE = []
      for (let i = 0; i < 7; i++) {
        mapA['R' + i] = {
          Reels: i,
          Symbol: [
            { Symbol: 1, Number: 0 },
            { Symbol: 2, Number: 0 },
            { Symbol: 3, Number: 0 },
            { Symbol: 4, Number: 0 },
            { Symbol: 5, Number: 0 }
          ]
        }
        mapB['R' + i] = {
          Reels: i,
          Symbol: [
            { Symbol: 1, Number: 0 },
            { Symbol: 2, Number: 0 },
            { Symbol: 3, Number: 0 },
            { Symbol: 4, Number: 0 },
            { Symbol: 5, Number: 0 }
          ]
        }
        mapC['R' + i] = {
          Reels: i,
          Symbol: [
            { Symbol: 1, Number: 0 },
            { Symbol: 2, Number: 0 },
            { Symbol: 3, Number: 0 },
            { Symbol: 4, Number: 0 },
            { Symbol: 5, Number: 0 }
          ]
        }
        mapD['R' + i] = {
          Reels: i,
          Symbol: [
            { Symbol: 1, Number: 0 },
            { Symbol: 2, Number: 0 },
            { Symbol: 3, Number: 0 },
            { Symbol: 4, Number: 0 },
            { Symbol: 5, Number: 0 }
          ]
        }
        mapE['R' + i] = {
          Reels: i,
          Symbol: [
            { Symbol: 1, Number: 0 },
            { Symbol: 2, Number: 0 },
            { Symbol: 3, Number: 0 },
            { Symbol: 4, Number: 0 },
            { Symbol: 5, Number: 0 }
          ]
        }
      }
      for (let i = 0; i < this.tableData.PlanA.length; i++) {
        const item = this.tableData.PlanA[i]
        for (let j = 0; j < item.Values.length; j++) {
          mapA['R' + j].Symbol[item.Symbol - 1].Number = item.Values[j]
        }
      }
      for (let i = 0; i < this.tableData.PlanB.length; i++) {
        const item = this.tableData.PlanB[i]
        for (let j = 0; j < item.Values.length; j++) {
          mapB['R' + j].Symbol[item.Symbol - 1].Number = item.Values[j]
        }
      }
      for (let i = 0; i < this.tableData.PlanC.length; i++) {
        const item = this.tableData.PlanC[i]
        for (let j = 0; j < item.Values.length; j++) {
          mapC['R' + j].Symbol[item.Symbol - 1].Number = item.Values[j]
        }
      }
      for (let i = 0; i < this.tableData.PlanD.length; i++) {
        const item = this.tableData.PlanD[i]
        for (let j = 0; j < item.Values.length; j++) {
          mapD['R' + j].Symbol[item.Symbol - 1].Number = item.Values[j]
        }
      }
      for (let i = 0; i < this.tableData.PlanE.length; i++) {
        const item = this.tableData.PlanE[i]
        for (let j = 0; j < item.Values.length; j++) {
          mapE['R' + j].Symbol[item.Symbol - 1].Number = item.Values[j]
        }
      }
      for (const k in mapA) {
        planA.push(mapA[k])
      }
      for (const k in mapB) {
        planB.push(mapB[k])
      }
      for (const k in mapC) {
        planC.push(mapC[k])
      }
      for (const k in mapD) {
        planD.push(mapD[k])
      }
      for (const k in mapE) {
        planE.push(mapE[k])
      }
      this.slotsData.ReelsRateConfig.PlanA = planA
      this.slotsData.ReelsRateConfig.PlanB = planB
      this.slotsData.ReelsRateConfig.PlanC = planC
      this.slotsData.ReelsRateConfig.PlanD = planD
      this.slotsData.ReelsRateConfig.PlanE = planE

      console.debug('set data new config: ', this.slotsData.ReelsRateConfig)
    },

    addControl() {
      this.slotsData.ReelsRateConfig.Control.push({
        MinPlayTimes: 0,
        PlanARates: 0,
        PlanBRates: 0,
        PlanCRates: 0,
        PlanDRates: 0,
        PlanERates: 0
      })
      return false
    },

    delControl(idx) {
      this.$delete(this.slotsData.ReelsRateConfig.Control, idx)
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
