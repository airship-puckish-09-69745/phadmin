<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="20" :offset="3">
        <el-form ref="scriptFrm" label-width="120px">
          <ratio-input v-model="slotsData.ActConfig.ServiceFee" label="抽水(%)" tips="服务费" />

          <ratio-input v-model="slotsData.ActConfig.WinOddsGt0Lose" label="剧本倍率>0输(%)" tips="当赢剧本倍数>0时多少概率会输" />
          <ratio-input v-model="slotsData.ActConfig.WinOddsGt0LoseRange" label="赢时输范围(%)" tips="最大输倍率到0倍率之间占多少输区间，例40%,即-25到0取值为：-10~0取值" />

          <ratio-input v-model="slotsData.ActConfig.LoseOddsLt0Lose" label="剧本倍率<0赢(%)" tips="当输剧本倍数<0时多少概率会赢" />
          <ratio-input v-model="slotsData.ActConfig.LoseOddsLt0LoseRange" label="输时赢范围(%)" tips="最大输倍率到0倍率之间占多少输区间，例40%,即0到25取值为：0~10取值" />

          <el-table :data="slotsData.ActConfig.WaterPool" border>
            <el-table-column label="房间(底分)" min-width="40px">
              <template scope="scope">
                {{ scope.row.Bet/1000 }}
              </template>
            </el-table-column>

            <el-table-column label="水池配置" min-width="200px">
              <template scope="scopeSub">
                <el-table :data="scopeSub.row.Pool" border>
                  <el-table-column label="水池最小">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.MinPool" />
                    </template>
                  </el-table-column>
                  <el-table-column label="水池最大">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.MaxPool" />
                    </template>
                  </el-table-column>
                  <el-table-column label="水池系数%">
                    <template scope="scope">
                      <el-input v-model.number="scope.row.Factor" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="delPoolRow(scope.$index, scope.row,scopeSub.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>

            <el-table-column label="干预值" min-width="50px">
              <template scope="scope">
                <el-input v-model.number="scope.row.InterveneFactor" />
              </template>
            </el-table-column>

            <el-table-column label="最大携带个人输赢" min-width="50px">
              <template scope="scope">
                <money-input v-model="scope.row.CarryMaxTotalWin" label="" label-width="none" />
              </template>
            </el-table-column>

            <el-table-column label="操作" min-width="50px">
              <template scope="scope">
                <el-button
                  size="mini"
                  @click="addWaterPoolRow(scope.$index, scope.row)"
                >添加</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item style="margin-top: 20px">
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
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsScript',
  components: { Compare, RatioInput, MoneyInput },
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
    bets: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  watch: {
    'bets': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon symbol list watch', val)
        this.initWaterPool()
      }
    }
  },
  created() {
    this.initWaterPool()
  },
  methods: {
    // 初始化水池,如果房间列表有变化，水池房间也要变化
    initWaterPool() {
      const waterBetMap = {}
      for (const i in this.slotsData.ActConfig.WaterPool) {
        waterBetMap[this.slotsData.ActConfig.WaterPool[i].Bet] = this.slotsData.ActConfig.WaterPool[i]
      }

      const waterPools = []
      for (const i in this.bets) {
        let item = this.getWaterItem(this.bets[i])
        try {
          if (waterBetMap[this.bets[i]]) {
            item = waterBetMap[this.bets[i]]
          }
        } catch (e) {
          console.log('bet init error', e)
        }

        waterPools.push(item)
      }

      console.log('填充结果', waterPools)
      this.slotsData.ActConfig.WaterPool = waterPools
    },
    getDiffData() {
      return this.DeepCopy(this.slotsData)
    },
    getWaterItem(bet) {
      return {
        'Bet': bet,
        'Pool': [],
        'InterveneFactor': 0,
        'CarryMaxTotalWin': 0
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
      for (let i = 0; i < this.slotsData.ActConfig.WaterPool.length; i++) {
        if (i == parentIndex) {
          const one = this.slotsData.ActConfig.WaterPool[parentIndex].Pool
          const newObj = []
          for (let j = 0; j < one.length; j++) {
            if (j != index) {
              newObj.push(one[j])
            }
          }
          this.slotsData.ActConfig.WaterPool[parentIndex].Pool = newObj
        }
      }
    },
    addWaterPoolRow(index, row) {
      console.log('index:' + index + 'row:', row)
      for (let i = 0; i < this.slotsData.ActConfig.WaterPool.length; i++) {
        if (i == index) {
          this.slotsData.ActConfig.WaterPool[index].Pool.push(this.createWaterRate())
        }
      }
    },
    submitFrm() {
      const $this = this
      console.log('new data:', this.getDiffData())
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
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
