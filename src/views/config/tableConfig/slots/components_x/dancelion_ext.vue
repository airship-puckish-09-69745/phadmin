<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-tooltip class="item" effect="dark" content="范围最小值是'红色财字每个倍率'最大值的九倍"
                        placement="top-end">
              <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750">
                <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template>
              </el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50">
              <template slot="append">三个值一组用 , 连接。</template>
            </el-input>
          </el-form-item>

          <el-form-item label="红色财字每个倍率的权重">
            <el-input v-model="cfg.redCaiOddsRate" placeholder="用,号分割"/>
          </el-form-item>

          <el-form-item label="红色财字每个倍率">
            <el-input v-model="cfg.redCaiOdds" placeholder="用,号分割">
              <template slot="append">按照从小到大的顺序排列</template>
            </el-input>
          </el-form-item>
          <el-form-item label="不中奖下红色财字个数权重">
            <el-input v-model="cfg.redCaiRateOnNotWinning" placeholder="用,号分割">
              <template slot="append">三个值用,连接.分别对应0,1,2个财字</template>
            </el-input>
          </el-form-item>

          <el-form-item label="中奖下红色财字个数权重">
            <el-input v-model="cfg.redCaiRateOnWinning" placeholder="用,号分割">
              <template slot="append">七个值用,连接.分别对应3，4，5，6，7，8，9个财字</template>
            </el-input>
          </el-form-item>

          <!---->
          <el-form-item label="特殊图标个数">
            <el-table :data="cfg.ColorNumCfg" border style="width: 100%">
              <el-table-column prop="GoldMin" label="金财字最小个数" width="90">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.GoldMin"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="GoldMax" label="金财字最大个数" width="90">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.GoldMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="GreenMin" label="绿财字最小个数" width="90">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.GreenMin"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="GreenMax" label="绿财字最大个数" width="90">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.GreenMax"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="handleDelete(scope.$index)" type="danger" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button @click="handleAdd" type="primary" style="margin-top: 10px;">新增一行</el-button>
          </el-form-item>
          <!---->
        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare"/>
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import {DataRule, ValidateVueItem} from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsSuperGemExt',
  components: {RatioInput, Compare},
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {
        ColorNumCfg: []
      },
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    handleAdd() {
      const newRow = {
        GoldMin: 0,
        GoldMax: 0,
        GreenMin: 0,
        GreenMax: 0
      }
      this.cfg.ColorNumCfg.push(newRow)
    },
    handleDelete(index) {
      this.cfg.ColorNumCfg.splice(index, 1)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      let checkValue1 = true
      let checkValue2 = true
      let checkValue3 = true
      this.$refs['frm2'].validate((valid) => {
        // eslint-disable-next-line no-empty
        for (const index in this.cfg.ColorNumCfg) {
          // eslint-disable-next-line no-empty
          const bnc = this.cfg.ColorNumCfg[index]
          if (bnc.GoldMin >= bnc.GoldMax) {
            checkValue1 = false
            break
          }
          // eslint-disable-next-line no-empty
          if (bnc.GreenMin >= bnc.GreenMax) {
            checkValue2 = false
            break
          }
          if (bnc.GoldMax + bnc.GreenMax > 9) {
            checkValue3 = false
            break
          }
        }
      })
      if (!checkValue1) {
        this.$message.error('未保存')
        setTimeout(() => {
          this.$message.error('\'金财字最小个数\'应该小于\'金财字最大个数\'')
        }, 100) // 间隔0.1秒显示
        return
      }
      if (!checkValue2) {
        this.$message.error('未保存')
        setTimeout(() => {
          this.$message.error('\'绿财字最小个数\'应该小于\'绿财字最大个数\'')
        }, 100) // 间隔0.1秒显示
        return
      }
      if (!checkValue3) {
        this.$message.error('未保存')
        setTimeout(() => {
          this.$message.error('\'金财字最大个数\'加上\'绿财字最大个数\'应该小于9')
        }, 100) // 间隔0.1秒显示
        return
      }
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
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
        if (!this.cfg.ColorNumCfg) {
          this.cfg.ColorNumCfg = []
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
