<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="20" :offset="3">
        <el-form ref="scriptFrm" label-width="120px">
          <ratio-input v-model="ActConfig.ServiceFee" label="抽水(%)" tips="服务费" />

          <ratio-input v-model="ActConfig.WinOddsGt0Lose" label="剧本倍率>0输(%)" tips="当赢剧本倍数>0时多少概率会输" />
          <ratio-input v-model="ActConfig.WinOddsGt0LoseRange" label="赢时输范围(%)" tips="最大输倍率到0倍率之间占多少输区间，例40%,即-25到0取值为：-10~0取值" />

          <ratio-input v-model="ActConfig.LoseOddsLt0Lose" label="剧本倍率<0赢(%)" tips="当输剧本倍数<0时多少概率会赢" />
          <ratio-input v-model="ActConfig.LoseOddsLt0LoseRange" label="输时赢范围(%)" tips="最大输倍率到0倍率之间占多少输区间，例40%,即0到25取值为：0~10取值" />

          <el-form-item label-width="0">
            <el-link type="primary" @click="genWaterPoolVisible=true">自动生成水池配置</el-link>
          </el-form-item>
          <el-table :data="ActConfig.WaterPool" border>
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

    <el-dialog
      title="生成水池"
      :visible.sync="genWaterPoolVisible"
      width="60%"
    >
      <el-form ref="form" :model="GenWaterPool" label-width="200px">
        <el-alert
          title="如果不想要本次生成结果，不要点击保存直接刷新"
          type="error"
        />
        <br>
        <el-form-item label="干预值最低倍数">
          <el-input v-model.number="ActConfig.GenWaterPool.MinMul" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="最大个人携带输赢倍数">
          <el-input v-model.number="ActConfig.GenWaterPool.ReturnMul" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="房间预估人数">
          <el-input v-model.number="ActConfig.GenWaterPool.RoomNumber" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池最大2倍数">
          <el-input v-model.number="ActConfig.GenWaterPool.WaterPool1Mul" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池最大3倍数">
          <el-input v-model.number="ActConfig.GenWaterPool.WaterPool2Mul" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池最大4倍数">
          <el-input v-model.number="ActConfig.GenWaterPool.WaterPool3Mul" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池系数1">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor1" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池系数2">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor2" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池系数3">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor3" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池系数4">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor4" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="水池系数5">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor5" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="负数水池系数1">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor6" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="负数水池系数2">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor7" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="负数水池系数3">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor8" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="负数水池系数4">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor9" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="负数水池系数5">
          <el-input v-model.number="ActConfig.GenWaterPool.Factor10" placeholder="placeholder" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="genWaterPoolRun">生成水池</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
    return {
      lock: false,
      ActConfig: {
        'WinOddsGt0Lose': 30, // 赢的情况下剧本倍数大于0，随机输的概率
        'WinOddsGt0LoseRange': 30, // 赢的情况下剧本倍数大于0，随机输的概率
        'LoseOddsLt0Lose': 0,
        'LoseOddsLt0LoseRange': 0,
        'WaterPool': [],
        'ServiceFee': 10
      },
      genWaterPoolVisible: false,
      GenWaterPool: {
        MinMul: 1933, // 最低倍数
        ReturnMul: 10, // 输赢倍数
        RoomNumber: 10, // 房间人数
        WaterPool1Mul: 2, // 房间水池倍数
        WaterPool2Mul: 3, // 房间水池倍数
        WaterPool3Mul: 4, // 房间水池倍数
        Factor1: 0, // 正数水池系数
        Factor2: 5,
        Factor3: 10,
        Factor4: 20,
        Factor5: 40,
        Factor6: 0, // 负数水池系数
        Factor7: 5,
        Factor8: 10,
        Factor9: 20,
        Factor10: 40
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    initData() {
      if (this.slotsData) {
        this.ActConfig = this.slotsData

        // 如果自动生成水池的配置不存在，直接生成
        if (!Reflect.has(this.ActConfig, 'GenWaterPool')) {
          this.ActConfig.GenWaterPool = this.GenWaterPool
        }

        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    getDiffData() {
      const one = {
        'WinOddsGt0Lose': this.slotsData.WinOddsGt0Lose, // 赢的情况下剧本倍数大于0，随机输的概率
        'WinOddsGt0LoseRange': this.slotsData.WinOddsGt0LoseRange, // 赢的情况下剧本倍数大于0，随机输的概率
        'LoseOddsLt0Lose': this.slotsData.LoseOddsLt0Lose,
        'LoseOddsLt0LoseRange': this.slotsData.LoseOddsLt0LoseRange,
        'WaterPool': this.slotsData.WaterPool,
        'ServiceFee': this.slotsData.ServiceFee
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
      this.slotsData = this.ActConfig
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
    },
    // 自动生成水池配置
    genWaterPoolRun() {
      const $load = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const waterPool = []
      for (const i in this.bets) {
        waterPool.push(this.genWaterPool(this.bets[i]))
      }
      this.ActConfig.WaterPool = waterPool
      setTimeout(function() {
        $load.close()
      }, 1000)
      this.$message.success('生成成功！')
      this.genWaterPoolVisible = false
    },
    genWaterPool(bet) {
      const item = this.getWaterItem(bet)
      item.InterveneFactor = parseInt(bet * this.ActConfig.GenWaterPool.MinMul / 1000)
      item.CarryMaxTotalWin = item.InterveneFactor * this.ActConfig.GenWaterPool.ReturnMul * -1000

      // 正数水池5个
      let lastMaxPool = 0
      for (let i = 1; i <= 5; i++) {
        const pool = this.createWaterRate(0)
        if (i === 1) {
          // 正数水池第一个最小值固定0
          pool.MinPool = 0
        } else {
          // 正数水池最小值等于上一个水池最大值+1
          pool.MinPool = lastMaxPool + 1
        }
        if (i === 1) {
          pool.MaxPool = item.InterveneFactor * this.ActConfig.GenWaterPool.RoomNumber
        } else if (i === 5) {
          pool.MaxPool = 999999999999
        } else {
          const mul = this.ActConfig.GenWaterPool['WaterPool' + (i - 1) + 'Mul']
          pool.MaxPool = lastMaxPool * mul
        }

        lastMaxPool = pool.MaxPool
        pool.Factor = this.ActConfig.GenWaterPool['Factor' + i]
        item.Pool.push(pool)
      }

      // 负数水池5个
      for (let i = 1; i <= 5; i++) {
        const pool = this.createWaterRate(0)
        const plus = item.Pool[i - 1] // 正数水池配置
        pool.MinPool = plus.MaxPool * -1
        if (i === 1) {
          pool.MaxPool = -1
        } else {
          pool.MaxPool = plus.MinPool * -1
        }
        pool.Factor = this.ActConfig.GenWaterPool['Factor' + (5 + i)]
        item.Pool.push(pool)
      }

      console.log('底注' + bet + ':', item)
      return item
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
