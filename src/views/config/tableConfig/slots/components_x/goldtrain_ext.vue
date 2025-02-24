<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="250px">
          <el-form-item label="JP中奖概率" prop="JPRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JPRate" :required="true" > <template slot="append">‱</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水比例" prop="JPFeeRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JPFeeRate" :required="true" > <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水分配权重" prop="JPFeeSlWeightStr" placeholder="请输入内容,如150,151,820,表示：mini,minor,grand">
            <el-input v-model="cfg.JPFeeSlWeightStr" :required="true" > <template slot="append">三个值用 , 连接。如150,151,820。代表：mini,minor,grand</template> </el-input>
          </el-form-item>

          <el-form-item label="JP中奖分配权重" prop="JPSlWeightStr" placeholder="请输入内容,如150,151,820,表示：mini,minor,grand">
            <el-input v-model="cfg.JPSlWeightStr" :required="true" > <template slot="append">三个值用 , 连接。如150,151,820。代表：mini,minor,grand</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式再进免费模式的概率" prop="ScatterPlusRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterPlusRate" :required="true" > <template slot="append">％</template> </el-input>
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true" />
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,820"> <template slot="append">四个值用 , 连接。如0,150,151,820表示0,150和151,820</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800"> <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,820,50"> <template slot="append">三个值一组用 , 连接。</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="15" :offset="3">
        <el-tabs type="border-card" value="normal">
          <el-tab-pane label="特殊符号配置" name="normal">
            <el-button type="primary" @click="cfg.SpecialSymbols.push({Name:'',Value:0,WeightNormal:0,WeightFree:0,EventRate:0,EventOdds:0})">添加</el-button>
            <el-table :data="cfg.SpecialSymbols">
              <el-table-column prop="Name" label="符号名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Name" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="Value" label="符号值">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Value" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="WeightNormal" label="普通模式权重">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.WeightNormal" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="WeightFree" label="免费模式权重">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.WeightFree" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="EventRate" label="事件触发的概率‰">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.EventRate" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column prop="EventOdds" label="事件触发的倍数">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.EventOdds" :required="true" placeholder="请输入内容"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="onSpecialSymbolRemove(scope.$index)">删除</el-button>
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
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsRoadKingExt',
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
      }
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
        if (this.cfg.SpecialSymbols === undefined) {
          this.cfg.SpecialSymbols = []
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    onSpecialSymbolRemove(index) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cfg.SpecialSymbols.splice(index, 1)
      })
    }
  }
}
</script>
