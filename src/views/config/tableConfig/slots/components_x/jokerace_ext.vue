<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 25px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="210px">

          <el-form-item label="普通模式 scatter个数的权重" :rules="dataRule(true)">
            <el-input v-model="cfg.ScatterNumWt" :required="true" placeholder="请输入内容,如 0,1,2"> <template slot="append">如0,1,2 代表出现0个的权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="符号在1-5轴变成Joker的概率" :rules="dataRule(true)">
            <el-input v-model="cfg.JokerColRate" :required="true" placeholder="请输入内容，如 0,11,12,13,14"> <template slot="append">如0,11,12,13,14 代表1轴0‱ .. 5轴14‱</template> </el-input>
          </el-form-item>

          <el-form-item label="Joker带出wild个数权重" :rules="dataRule(true)">
            <el-input v-model="cfg.WildJokerSetNum" :required="true" placeholder="请输入内容,如 0,1,2"> <template slot="append">如0,1,2 代表出现0个的权重为0 </template> </el-input>
          </el-form-item>

          <el-form-item label="Joker的倍数权重">
            <div>
              <el-button
                  size="mini"
                  type="primary"
                  @click="doAdd"
                  v-if="cfg.JokerOddsCfg && cfg.JokerOddsCfg.length<=0"
              >添加</el-button>

              <el-table
                  v-if="cfg.JokerOddsCfg"
                  :data="cfg.JokerOddsCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{ height: '10px' }"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
              >
                <!-- 值 -->
                <el-table-column prop="Val" label="最小倍数">
                  <template slot-scope="scope">
                    <el-input
                        v-model.number="scope.row.OddsMin"
                        type="number"
                        size="mini"
                        oninput="if(value < 0 || value=='' || value==null || value=='NAN'){value=0;}"
                    />
                  </template>
                </el-table-column>

                <!-- 值 -->
                <el-table-column prop="Val" label="最大倍数">
                  <template slot-scope="scope">
                    <el-input
                        v-model.number="scope.row.OddsMax"
                        type="number"
                        size="mini"
                        oninput="if(value < 0 || value=='' || value==null || value=='NAN'){value=0;}"
                    />
                  </template>
                </el-table-column>

                <!-- 权重 -->
                <el-table-column prop="Weight" label="权重">
                  <template slot-scope="scope">
                    <el-input
                        v-model.number="scope.row.Weight"
                        size="mini"
                        type="number"
                        oninput="if(value < 0 || value=='' || value==null || value=='NAN'){value=0;}"
                    />
                  </template>
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="doAdd">添加</el-button>
                    <el-button size="mini" type="danger" @click="delRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,940,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="script">
            <el-button type="primary" @click="showDialog">添加配置</el-button>
            <span style="margin-left:10px;color:#909399">(Bet为单线下注大小，Bet=0为默认配置，配置的倍数不能出现0倍的情况)</span>

            <el-table :data="cfg.BuyFreeOddsConf">
              <el-table-column prop="bet" label="Bet值" width="600">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row)">{{ scope.row.Bet.map(b => b/1000).join(', ') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      :title="buyFreeOddsConf.dialogTitle"
      :visible.sync="buyFreeOddsConf.dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form label-width="50px">
        <el-form-item label="Bet值">
          <el-input v-model="buyFreeOddsConf.currentBet" :disabled="buyFreeOddsConf.currentBet === '0' && buyFreeOddsConf.editIndex >= 0" placeholder="请输入Bet值">
            <template slot="append">用 , 连接</template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addConfigRow">添加</el-button>
      <el-button type="primary" @click="buyFreeOddsRtp">检测RTP</el-button>
      <el-table :data="buyFreeOddsConf.currentConf">
        <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10" />
          </template>
        </el-table-column>
        <el-table-column prop="WeightStr" label="倍数范围权重">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.InWeight" :required="true" placeholder="请输入内容,如4" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" @click="removeConfigRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="buyFreeOddsConf.dialogVisible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import { DataRule, ValidateVueItem, $libShow  } from '@/utils/common'
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsJokerAceExt',
  components: { RatioInput, Compare },
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
    },
    baseBet: Number
  },
  data() {
    return {
      cfg: { JokerOddsCfg: [] }, //对应ext
      activeTab: 'script',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: []
      },
      libShow: $libShow
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      const scatterNumWt = this.cfg.ScatterNumWt;
      const numbers = scatterNumWt.split(',').map(num => parseInt(num.trim(), 10));
      if (numbers.length !== 3) {
        this.$message.error('普通模式 scatter个数的权重, 只支持0 1 2个的权重配置 3个scatter由剧本和进免费的最小倍数控制');
        return;
      }
      const jokerColRate = this.cfg.JokerColRate;
      const jokerNumbers = jokerColRate.split(',').map(num => parseInt(num.trim(), 10));
      if (jokerNumbers.length !== 5) {
        this.$message.error(`符号在1-5轴变成Joker的概率 err:长度!=5 当前值:, ${this.cfg.JokerColRate}`);
        return;
      }
      if (jokerNumbers[0] !== 0) {
        this.$message.error(`符号在1-5轴变成Joker的概率 err:第一轴只能概率为0 当前值:${this.cfg.JokerColRate}`);
        return;
      }
      if (!ValidateVueItem(this.$refs['frm2'])) return false
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
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        if (!this.cfg.JokerOddsCfg) this.cfg.JokerOddsCfg = []
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    showDialog() {
      this.buyFreeOddsConf.dialogTitle = '添加配置'
      this.buyFreeOddsConf.currentBet = '0'
      this.buyFreeOddsConf.currentConf = [{ MinOdds: 0, MaxOdds: 0, InWeight: 0 }]
      this.buyFreeOddsConf.editIndex = -1
      this.buyFreeOddsConf.dialogVisible = true
    },
    editConfig(row) {
      this.buyFreeOddsConf.dialogTitle = '编辑配置'
      this.buyFreeOddsConf.currentBet = row.Bet.map(b => b / 1000).join(',')
      this.buyFreeOddsConf.currentConf = JSON.parse(JSON.stringify(row.Items))
      this.buyFreeOddsConf.editIndex = this.cfg.BuyFreeOddsConf.findIndex(item => item.Bet === row.Bet)
      this.buyFreeOddsConf.dialogVisible = true
    },
    addConfigRow() {
      this.buyFreeOddsConf.currentConf.push({ MinOdds: 0, MaxOdds: 0, InWeight: 0 })
    },
    removeConfigRow(index) {
      this.buyFreeOddsConf.currentConf.splice(index, 1)
    },
    removeConfig(index) {
      this.cfg.BuyFreeOddsConf.splice(index, 1)
    },
    doAdd() {
      this.cfg.JokerOddsCfg.push({ OddsMin: 0, OddsMax: 0, Weight:0})
    },
    delRow(index) {
      if (this.cfg.JokerOddsCfg.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.cfg.JokerOddsCfg.splice(index, 1)
    },
    saveConfig() {
      const currentBets = this.buyFreeOddsConf.currentBet
        .split(',')
        .map(b => parseFloat(b.trim()) * 1000)
        .filter(b => !isNaN(b))

      if (this.checkBuyFreeOdds(currentBets) === false) {
        return
      }
      if (this.buyFreeOddsConf.editIndex >= 0) {
        this.$set(this.cfg.BuyFreeOddsConf, this.buyFreeOddsConf.editIndex, {
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      } else {
        this.cfg.BuyFreeOddsConf.push({
          Bet: currentBets,
          Items: this.buyFreeOddsConf.currentConf
        })
      }
      this.buyFreeOddsConf.dialogVisible = false
    },
    checkBuyFreeOdds(currentBets) {
      let weightTotal = 0
      const existingBets = new Set()
      if (!this.cfg.BuyFreeOddsConf) {
        this.cfg.BuyFreeOddsConf = []
      }
      // 排除正在编辑的项（如果是编辑模式）
      this.cfg.BuyFreeOddsConf.forEach((item, index) => {
        if (this.buyFreeOddsConf.editIndex !== index) {
          item.Bet.forEach(bet => existingBets.add(bet))
        }
      })

      // 检查重复
      for (const bet of currentBets) {
        if (existingBets.has(bet)) {
          Message.error(`已经存在相同的${bet / 1000}Bet值`)
          return false
        }
      }

      // 检查Odds
      for (const item of this.buyFreeOddsConf.currentConf) {
        if (item.MinOdds > item.MaxOdds) {
          Message.error(`目标倍数开始(${item.MinOdds})不能大于目标倍数结束(${item.MaxOdds})`)
          return false
        }
        weightTotal += item.InWeight
      }

      // 检查rtp
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg.BuyFreeOdds / this.baseBet * 100
      }
      if (rtp >= 100) {
        Message.error(`当前RTP(${rtp})大于等于100%`)
        return false
      }
      return true
    },
    buyFreeOddsRtp() {
      let weightTotal = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        weightTotal += item.InWeight
      }
      // rtp
      let rtp = 0
      for (const item of this.buyFreeOddsConf.currentConf) {
        rtp += (item.MinOdds + item.MaxOdds) / 2 * item.InWeight / weightTotal / this.cfg.BuyFreeOdds / this.baseBet * 100
      }
      Message.info(`当前RTP(${rtp})`)
    }
  }
}
</script>
