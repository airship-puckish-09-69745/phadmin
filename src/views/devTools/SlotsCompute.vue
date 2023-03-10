<template>
  <div id="app" class="page-container">
    <el-row>
      <el-form label-width="100px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="概率输入：">
              <el-input v-model="ratesInput" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="赔率输入：">
              <el-input v-model="peiLvInput" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" @click="ratesChanged">提交</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="总RTP：">
            <span style="color:red;font-size: 30px">{{ this.rtpVal + this.wrtpVal }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="概率配置：">
              <el-table
                ref="filterTable"
                :data="rates"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="Reel1"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel2"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel3"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R5" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="WP概率配置：">
              <el-table
                ref="filterTable"
                :data="wrates"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="Reel1"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel2"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel3"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="Reel5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R5" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="赔率配置：">
              <el-table
                ref="filterTable"
                :data="peiLvs"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="3"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="2"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="样本数：">
              <el-table
                ref="filterTable"
                :data="ybTotal"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="3"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="2"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="不含W样本数：">
              <el-table
                ref="filterTable"
                :data="ybTotal1"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="3"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="2"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="含W样本数：">
              <el-table
                ref="filterTable"
                :data="ybTotal2"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="5"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="4"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="3"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="2"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="不含WRTP：">
              <el-table
                ref="filterTable"
                :data="rtp"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Name"
                  label="名称"
                  width="100"
                />
                <el-table-column
                  label="5"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R1" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="4"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R2" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="3"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R3" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="2"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.R4" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RTP汇总：">
              {{ this.rtpVal }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="16">
          <el-form-item label="含WRTP：">
            <el-table
              ref="filterTable"
              :data="wrtp"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                prop="Name"
                label="名称"
                width="100"
              />
              <el-table-column
                label="5"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.R1" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="4"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.R2" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="3"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.R3" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="2"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.R4" size="mini" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>>
        </el-col>
        <el-col :span="8">
          <el-form-item label="WRTP汇总：">
            {{ this.wrtpVal }}
          </el-form-item>
        </el-col>

      </el-form>
    </el-row>
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'

function getItem(name, n1, n2, n3, n4, n5) {
  return {
    Rates: [n1, n2, n3, n4, n5],
    Name: name,
    PeiLvs: [],
    WRates: []
  }
}

export default {
  components: {},
  data() {
    return {
      libShow: $libShow,
      ratesInput: 'wild\t0.5\t1\t1\t1\t1\n' +
        'scatter\t1\t1\t1.5\t1\t1\n' +
        'P1\t3\t3\t8\t1\t3\n' +
        'P2\t2\t2\t9\t1\t3\n' +
        'P3\t2\t3\t6\t3\t2\n' +
        'P4\t2\t3\t8\t6\t6\n' +
        'P5\t3\t4\t5\t6\t7\n' +
        'P6\t3\t4\t5\t6\t7\n' +
        'P7\t3\t4\t5\t6\t7\n' +
        'P8\t7\t6\t5\t4\t3\n' +
        'P9\t7\t6\t5\t4\t3\n' +
        'P10\t7\t6\t5\t4\t3\n',
      peiLvInput: 'P1\t1000\t500\t50\t2\n' +
        'P2\t500\t250\t25\t\n' +
        'P3\t200\t100\t25\t\n' +
        'P4\t150\t75\t15\t\n' +
        'P5\t125\t25\t5\t\n' +
        'P6\t100\t25\t5\t\n' +
        'P7\t75\t25\t5\t\n' +
        'P8\t75\t20\t5\t\n' +
        'P9\t75\t20\t5\t\n' +
        'P10\t50\t10\t5\t1\n' +
        'wild\t10000\t1000\t100\t10\n' +
        'scatter\t250\t50\t25\t\n',
      rates: [], // 概率
      wrates: [], // 含W的元素概率
      wild: [], // W的概率
      total: [], // 概率列的和

      colRate: [], // 概率列汇总
      ybTotal: [], // 样本数
      ybTotal1: [], // 不含W样本
      ybTotal2: [], // 含W样本
      rtp: [],
      wrtp: [],
      circle: 0,
      rtpVal: 0,
      wrtpVal: 0,
      peiWild: {}, // wild的赔率
      peiLvs: [],
      dataMap: {}
    }
  },
  computed: {},
  created() {
    console.log(1)
  },
  methods: {
    getTableData(name, data) {
      const ret = { Name: name }
      for (let i = 0; i < data.length; i++) {
        ret['R' + (i + 1)] = data[i]
      }
      return ret
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    initData() {
      this.rates = [] // 概率
      this.wrates = [] // 含W的元素概率
      this.wild = [] // W的概率
      this.total = [] // 概率列的和

      this.colRate = [] // 概率列汇总
      this.ybTotal = [] // 样本数
      this.ybTotal1 = [] // 不含W样本
      this.ybTotal2 = [] // 含W样本
      this.rtp = []
      this.wrtp = []
      this.circle = 0
      this.rtpVal = 0
      this.wrtpVal = 0
      this.peiWild = {} // wild的赔率
      this.peiLvs = []
      this.dataMap = {}
    },
    ratesChanged() {
      if (this.ratesInput != '' && this.peiLvInput != '') {
        this.initData()
        const lines = this.ratesInput.split('\n')
        for (let n = 0; n < lines.length; n++) {
          if (lines[n] != '') {
            const ss = lines[n].split('\t')
            this.dataMap[ss[0]] = getItem(ss[0], parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]), parseFloat(ss[5]))
            this.rates.push(this.getTableData(ss[0], this.dataMap[ss[0]].Rates))
          }
        }
        let ret = {}
        let wild = {} // 记录wild数据
        for (let n = 0; n < this.rates.length; n++) {
          if (n == 0) {
            ret = this.copyData(this.rates[n])
            ret.Name = 'Total'
          } else {
            ret.R1 += this.rates[n].R1
            ret.R2 += this.rates[n].R2
            ret.R3 += this.rates[n].R3
            ret.R4 += this.rates[n].R4
            ret.R5 += this.rates[n].R5
            this.total = [ret.R1, ret.R2, ret.R3, ret.R4, ret.R5]
          }
          if (this.rates[n].Name == 'wild') {
            wild = this.copyData(this.rates[n])
            this.wild = [wild.R1, wild.R2, wild.R3, wild.R4, wild.R5]
          }
        }

        this.rates.push(ret)
        this.circle = ret.R1 * ret.R2 * ret.R3 * ret.R4 * ret.R5
        this.colRate = ret
        this.rates.push({ Name: 'Circle', R1: this.circle })

        for (let n = 0; n < this.rates.length; n++) {
          const wrate = this.copyData(this.rates[n])
          if (wrate.Name[0] == 'P') {
            wrate.Name = 'W' + wrate.Name
            wrate.R1 += wild.R1
            wrate.R2 += wild.R2
            wrate.R3 += wild.R3
            wrate.R4 += wild.R4
            wrate.R5 += wild.R5
            this.wrates.push(wrate)
            this.dataMap[this.rates[n].Name].WRates = [wrate.R1, wrate.R2, wrate.R3, wrate.R4, wrate.R5]
          }
        }

        // 输入赔率数据
        const pls = this.peiLvInput.split('\n')
        for (let n1 = 0; n1 < pls.length; n1++) {
          if (pls[n1] != '') {
            const s2 = pls[n1].split('\t')
            const cnt = []
            for (let i = 1; i < s2.length; i++) {
              cnt.push(s2[i] ? parseInt(s2[i]) : 0)
            }
            this.dataMap[s2[0]].PeiLvs = cnt
            this.peiLvs.push(this.getTableData(s2[0], this.dataMap[s2[0]].PeiLvs))

            if (s2[0] === 'wild') {
              this.peiWild = cnt
            }
          }
        }

        // 计算样本数量
        for (let n = 0; n < this.rates.length; n++) {
          const ybTotal = this.copyData(this.rates[n])
          const ybTotal1 = this.copyData(this.rates[n])
          const ybTotal2 = this.copyData(this.rates[n])
          if (ybTotal.Name[0] === 'P') {
            const name = ybTotal.Name
            const item = this.dataMap[name]

            // 计算5个时样本
            let result = item.WRates[0]
            if (this.peiWild[3] >= item.PeiLvs[0]) {
              result = (item.WRates[0] * item.WRates[1] - this.wild[0] * this.wild[1]) * item.WRates[2] * item.WRates[3] * item.WRates[4]
            } else if (this.peiWild[2] >= item.PeiLvs[0]) {
              result = (item.WRates[0] * item.WRates[1] * item.WRates[2] - this.wild[0] * this.wild[1] * this.wild[2]) * item.WRates[3] * item.WRates[4]
            } else {
              result = (item.WRates[0] * item.WRates[1] * item.WRates[2] * item.WRates[3] - this.wild[0] * this.wild[1] * this.wild[2] * this.wild[3]) * item.WRates[4]
            }
            ybTotal.R1 = result
            ybTotal1.R1 = item.Rates[0] * item.Rates[1] * item.Rates[2] * item.Rates[3] * item.Rates[4]
            ybTotal2.R1 = ybTotal.R1 - ybTotal1.R1

            // 计算4个时样本
            if (this.peiWild[3] >= item.PeiLvs[1]) {
              result = (item.WRates[0] * item.WRates[1] - this.wild[0] * this.wild[1]) * item.WRates[2] * item.WRates[3] * (this.total[4] - item.WRates[4])
            } else if (this.peiWild[2] >= item.PeiLvs[1]) {
              result = (item.WRates[0] * item.WRates[1] * item.WRates[2] - this.wild[0] * this.wild[1] * this.wild[2]) * item.WRates[3] * (this.total[4] - item.WRates[4])
            } else {
              result = (item.WRates[0] * item.WRates[1] * item.WRates[2] * item.WRates[3] - this.wild[0] * this.wild[1] * this.wild[2] * this.wild[3]) * (this.total[4] - item.WRates[4])
            }
            ybTotal.R2 = result
            ybTotal1.R2 = item.Rates[0] * item.Rates[1] * item.Rates[2] * item.Rates[3] * (this.total[4] - item.WRates[4])
            ybTotal2.R2 = ybTotal.R2 - ybTotal1.R2

            // 计算3个时样本
            if (this.peiWild[3] >= item.PeiLvs[2]) {
              result = (item.WRates[0] * item.WRates[1] - this.wild[0] * this.wild[1]) * item.WRates[2] * (this.total[3] - item.WRates[3]) * this.total[4]
            } else {
              result = (item.WRates[0] * item.WRates[1] * item.WRates[2] - this.wild[0] * this.wild[1] * this.wild[2]) * (this.total[3] - item.WRates[3]) * this.total[4]
            }
            ybTotal.R3 = result
            ybTotal1.R3 = item.Rates[0] * item.Rates[1] * item.Rates[2] * (this.total[3] - item.WRates[3]) * this.total[4]
            ybTotal2.R3 = ybTotal.R3 - ybTotal1.R3

            // 计算2个时赔率
            if (item.PeiLvs[3] > 0) {
              result = (item.WRates[0] * item.WRates[1] - this.wild[0] * this.wild[1]) * (this.total[2] - item.WRates[2]) * this.total[3] * this.total[4]
              ybTotal1.R4 = (item.Rates[0] * item.Rates[1]) * (this.total[2] - item.WRates[2]) * this.total[3] * this.total[4]
              ybTotal2.R4 = result - ybTotal1.R4
            } else {
              result = 0
              ybTotal1.R4 = 0
              ybTotal2.R4 = 0
            }
            ybTotal.R4 = result

            this.ybTotal.push(ybTotal)
            this.ybTotal1.push(ybTotal1)
            this.ybTotal2.push(ybTotal2)
          }
        }
        // 计算wild时样本
        const ybWild = { Name: 'wild' }
        ybWild.R1 = this.wild[0] * this.wild[1] * this.wild[2] * this.wild[3] * this.wild[4]
        ybWild.R2 = this.wild[0] * this.wild[1] * this.wild[2] * this.wild[3] * (this.total[4] - this.wild[4])

        // 计算3个时样本
        let big4 = this.wild[3]
        let big5 = 0 // 4连更大，5连更大
        for (const k in this.dataMap) {
          const itm = this.dataMap[k]
          if (k[0] == 'P') {
            if (itm.PeiLvs[1] > this.peiWild[2]) {
              big4 += itm.Rates[3]
            } else if (itm.PeiLvs[0] > this.peiWild[2]) {
              big5 += itm.WRates[4] * itm.Rates[3]
            }
          }
        }
        ybWild.R3 = this.wild[0] * this.wild[1] * this.wild[2] * ((this.total[3] - big4) * this.total[4] - big5)

        // 计算2个时样本
        let big3 = this.wild[2]
        big4 = 0, big5 = 0 // 4连更大，5连更大
        for (const k in this.dataMap) {
          const itm2 = this.dataMap[k]
          if (k[0] == 'P') {
            if (itm2.PeiLvs[2] > this.peiWild[3]) {
              big3 += itm2.Rates[2]
            } else if (itm2.PeiLvs[1] > this.peiWild[3]) {
              big4 += itm2.WRates[3] * itm2.Rates[2]
            } else if (itm2.PeiLvs[0] > this.peiWild[3]) {
              big5 += itm2.Rates[2] * itm2.WRates[3] * itm2.WRates[4]
            }
          }
        }
        ybWild.R4 = this.wild[0] * this.wild[1] * ((this.total[2] - big3) * this.total[3] * this.total[4] - big4 * this.total[4] - big5)
        this.ybTotal.push(ybWild)
        this.ybTotal2.push(ybWild)

        // 计算RTP
        this.rtp = this.copyData(this.ybTotal1)
        const rtpTotal = { Name: 'Total', R1: 0, R2: 0, R3: 0, R4: 0 }
        for (const n in this.rtp) {
          const name = this.rtp[n].Name
          const itm3 = this.dataMap[name]
          this.rtp[n].R1 = this.rtp[n].R1 * itm3.PeiLvs[0] / this.circle
          this.rtp[n].R2 = this.rtp[n].R2 * itm3.PeiLvs[1] / this.circle
          this.rtp[n].R3 = this.rtp[n].R3 * itm3.PeiLvs[2] / this.circle
          this.rtp[n].R4 = this.rtp[n].R4 * itm3.PeiLvs[3] / this.circle
          rtpTotal.R1 += this.rtp[n].R1
          rtpTotal.R2 += this.rtp[n].R2
          rtpTotal.R3 += this.rtp[n].R3
          rtpTotal.R4 += this.rtp[n].R4
        }
        this.rtpVal = rtpTotal.R1 + rtpTotal.R2 + rtpTotal.R3 + rtpTotal.R4
        this.rtp.push(rtpTotal)

        this.wrtp = this.copyData(this.ybTotal2)
        const wrtpTotal = { Name: 'Total', R1: 0, R2: 0, R3: 0, R4: 0 }
        for (const n in this.wrtp) {
          const name = this.wrtp[n].Name
          const itm3 = this.dataMap[name]
          this.wrtp[n].R1 = this.wrtp[n].R1 * itm3.PeiLvs[0] / this.circle * 2
          this.wrtp[n].R2 = this.wrtp[n].R2 * itm3.PeiLvs[1] / this.circle * 2
          this.wrtp[n].R3 = this.wrtp[n].R3 * itm3.PeiLvs[2] / this.circle * 2
          this.wrtp[n].R4 = this.wrtp[n].R4 * itm3.PeiLvs[3] / this.circle * 2
          wrtpTotal.R1 += this.wrtp[n].R1
          wrtpTotal.R2 += this.wrtp[n].R2
          wrtpTotal.R3 += this.wrtp[n].R3
          wrtpTotal.R4 += this.wrtp[n].R4
        }
        this.wrtpVal = wrtpTotal.R1 + wrtpTotal.R2 + wrtpTotal.R3 + wrtpTotal.R4
        this.wrtp.push(wrtpTotal)
      }
    }
  }
}
</script>

