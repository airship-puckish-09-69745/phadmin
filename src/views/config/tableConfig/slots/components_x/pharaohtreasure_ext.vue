<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750"> <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

          <el-form-item label="普通游戏多倍符号值">
            <el-input v-model="cfg.MultiOddsValInNormal"> <template slot="append">从小到大排列,用逗号分割</template> </el-input>
          </el-form-item>

          <el-form-item label="普通游戏多倍符号值权重">
            <el-input v-model="cfg.MultiOddsWeightInNormal"> <template slot="append">从大到小排列,用逗号分割,对应普通多倍符号值</template> </el-input>
          </el-form-item>

          <el-form-item label="scatter游戏多倍符号值">
            <el-input v-model="cfg.MultiOddsValInScatter"> <template slot="append">从小到大排列,用逗号分割</template> </el-input>
          </el-form-item>

          <el-form-item label="scatter游戏多倍符号值权重">
            <el-input v-model="cfg.MultiOddsWeightInScatter"> <template slot="append">从大到小排列,用逗号分割,对应scatter多倍符号值</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式下增加免费次数概率">
            <el-input v-model.number="cfg.AddFreeTimesRate" placeholder="免费模式出现三个scatter,就可以增加次数5次"> <template slot="append">%</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="购买免费倍数" name="script">
            <el-button type="primary" @click="addConfigRow(buyFreeOddsWeight)">添加</el-button>
            <el-table :data="buyFreeOddsWeight">
              <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="WeightStr" label="倍数范围权重">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.InWeight" :required="true" placeholder="请输入内容,如4">
<!--                    <template slot="append">倍数放大100倍</template>-->
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeConfigRow(buyFreeOddsWeight, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

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
import { DataRule } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsPharaohTreasureExt',
  // eslint-disable-next-line vue/no-unused-components
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
    }
  },
  data() {
    return {
      cfg: {
      },
      buyFreeOddsWeight: [{ MinOdds: 0, MaxOdds: 0, InWeight: 0 }],
      activeTab: 'script'
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
      const $this = this
      this.setConfigRow()
      if (this.getStrLength(this.cfg.MultiOddsValInNormal) !== this.getStrLength(this.cfg.MultiOddsWeightInNormal)) {
        $this.$message.error('普通游戏多倍符号值与普通游戏多倍符号值权重长度不一致')
        return
      }
      if (this.getStrLength(this.cfg.MultiOddsValInScatter) !== this.getStrLength(this.cfg.MultiOddsWeightInScatter)) {
        $this.$message.error('scatter游戏多倍符号值与scatter游戏多倍符号值权重长度不一致')
        return
      }
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
    getStrLength(str) {
      const numberArr = str.split(',')
      return numberArr.length
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
        this.initConfigRow()
      }
    },
    initConfigRow() {
      let buyFreeOddsRange2 = []
      if (this.cfg.BuyFreeOddsRange2) {
        buyFreeOddsRange2 = this.cfg.BuyFreeOddsRange2.split(',')
      }
      let buyFreeOddsWeight = []
      if (this.cfg.BuyFreeOddsWeight) {
        buyFreeOddsWeight = this.cfg.BuyFreeOddsWeight.split(',')
      }
      this.buyFreeOddsWeight = []
      for (let i = 0; i < buyFreeOddsRange2.length / 2; i++) {
        this.buyFreeOddsWeight.push({
          MinOdds: buyFreeOddsRange2[i * 2],
          MaxOdds: buyFreeOddsRange2[i * 2 + 1],
          InWeight: buyFreeOddsWeight[i] ? buyFreeOddsWeight[i] : 0
        })
      }
    },
    setConfigRow() {
      const buyFreeOddsRange2 = []
      const buyFreeOddsWeight = []
      for (let i = 0; i < this.buyFreeOddsWeight.length; i++) {
        buyFreeOddsRange2.push(this.buyFreeOddsWeight[i].MinOdds ? this.buyFreeOddsWeight[i].MinOdds : 0)
        buyFreeOddsRange2.push(this.buyFreeOddsWeight[i].MaxOdds ? this.buyFreeOddsWeight[i].MaxOdds : 0)
        buyFreeOddsWeight.push(this.buyFreeOddsWeight[i].InWeight ? this.buyFreeOddsWeight[i].InWeight : 0)
      }
      this.cfg.BuyFreeOddsRange2 = buyFreeOddsRange2.join(',')
      this.cfg.BuyFreeOddsWeight = buyFreeOddsWeight.join(',')
    },
    addConfigRow(buyFreeOddsWeight) {
      buyFreeOddsWeight.push({
        MinOdds: 0,
        MaxOdds: 0,
        InWeight: 0
      })
    },
    removeConfigRow(buyFreeOddsWeight, index) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        buyFreeOddsWeight.splice(index, 1)
        console.log('removeConfigRow index', index)
      })
    }
  }
}
</script>
