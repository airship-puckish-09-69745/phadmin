<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="20" :offset="3">
        <el-form ref="frm1" :model="slotsData" label-width="150px">
          <el-form-item label="老虎机类型">
            <el-select v-model.number="slotsData.SlotsType" disabled>
              <el-option label="凤凰老虎机" :value="51" />
            </el-select>
          </el-form-item>

          <el-form-item label="行">
            <el-input v-model.number="slotsData.Rows" disabled />
          </el-form-item>

          <el-form-item label="列">
            <el-input v-model.number="slotsData.Clos" disabled />
          </el-form-item>

          <el-form-item label="最低版本">
            <el-input v-model.number="slotsData.MinVersion" />
          </el-form-item>

          <el-form-item label="下注列表">
            <el-input v-model="slotsData.Bets" />
          </el-form-item>

          <ratio-input v-model="slotsData.MoneyConfig.WinMoneyTransferRate" label="赢钱转化比例(%)" />

          <el-form-item label="输最大倍率的概率%">
            <el-input v-model.number="slotsData.LoseMaxOddsRate" />
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="submitFrm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import RatioInput from '@/components/RatioInput'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsBaseCfg',
  components: { Compare, RatioInput },
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
      lock: false,
      'ActConfig': {
        'WinOddsGt0Lose': 30, // 赢的情况下剧本倍数大于0，随机输的概率
        'WinOddsGt0LoseRange': 30, // 赢的情况下剧本倍数大于0，随机输的概率
        'LoseOddsLt0Lose': 0,
        'LoseOddsLt0LoseRange': 0,
        'LoseMaxOddsRate': 0,
        'WaterPool': [

        ],
        'ServiceFee': 10
      }
    }
  },
  updated() {
  },
  created() {
    this.$nextTick(() => {
      this.$refs.compare.SetOldVal(this.getDiffData())
      console.log('origin data', this.getDiffData())
      console.log('bet list', this.slotsData.BetList)
      if (this.slotsData.hasOwnProperty('ActConfig')) {
        this.ActConfig = this.slotsData.ActConfig
      }
      // let obj = [];
      // for (let i=0;i<this.slotsData.BetList.length;i++){
      //   let oneBet = this.slotsData.BetList[i]*1000;
      //   let one = this.getWaterItem(oneBet);
      //   obj.push(one);
      // }
      // this.ActConfig.WaterPool = obj
      // console.log("obj ===>",obj)
    })
  },
  methods: {
    getDiffData() {
      const one = {
        'SlotsType': this.slotsData.SlotsType,
        'Rows': this.slotsData.Rows,
        'Clos': this.slotsData.Clos,
        'MinVersion': this.slotsData.MinVersion,
        'Bets': this.slotsData.Bets,
        'LoseMaxOddsRate': this.slotsData.LoseMaxOddsRate,
        'MoneyConfig': {
          'WinMoneyTransferRate': this.slotsData.MoneyConfig.WinMoneyTransferRate
        },
        'ActConfig': this.slotsData.ActConfig
      }
      return JSON.parse(JSON.stringify(one))
    },
    getWaterItem(bet) {
      return {
        'Bet': bet,
        'Pool': [
          // {
          //   "Pool":1,
          //   "Factor":1,
          // }
        ],
        'InterveneFactor': 0
      }
    },
    createWaterRate(val) {
      return {
        'MinPool': 0,
        'MaxPool': 0,
        'Factor': 0
      }
    },
    delPoolRow(index, row, parentIndex) {
      console.log('index:' + index + 'parent:' + parentIndex)
      for (let i = 0; i < this.ActConfig.WaterPool.length; i++) {
        if (i == parentIndex) {
          const one = this.ActConfig.WaterPool[parentIndex].Pool
          const newObj = []
          for (let j = 0; j < one.length; j++) {
            if (j != index) {
              newObj.push(one[j])
            }
          }
          this.ActConfig.WaterPool[parentIndex].Pool = newObj
        }
      }
    },
    addWaterPoolRow(index, row) {
      console.log('index:' + index + 'row:', row)
      for (let i = 0; i < this.ActConfig.WaterPool.length; i++) {
        if (i == index) {
          this.ActConfig.WaterPool[index].Pool.push(this.createWaterRate())
        }
      }
    },
    submitFrm() {
      const $this = this
      this.slotsData.ActConfig = this.ActConfig
      console.log('new data:', this.getDiffData())
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
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
.el-form-item__label-wrap{
  margin-left: 0px !important;
}
</style>
