<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="Bonus等级与奖励倍数映射">
            <el-input v-model="cfg.BonusAndRewardMap" placeholder="请输入内容,如3:2, 5:4, 8:6, 10:8, 12:10">
              <template slot="append">倍率扩大了100倍. BonusNum1:Reward1,BonusNum2:Reward2...</template>
            </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750">
              <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template>
            </el-input>
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

          <el-form-item label="bonus个数">
            <el-table :data="cfg.BonusNumCfg" border style="width: 100%">
              <el-table-column prop="OddsMin" label="开始倍数" width="80">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMin"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="OddsMax" label="结束倍数" width="80">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="NumMin" label="bonus最小个数" width="80">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.NumMin"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="NumMax" label="bonus最大个数" width="80">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.NumMax"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="HitMin" label="bonus最小图案出现次数" width="80">
                <el-tooltip class="item" effect="dark" content="免费中bonus图案出现最小次数"
                            placement="top-end"></el-tooltip>
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.HitMin"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="HitMax" label="bonus最大图案出现次数" width="80">
                <el-tooltip class="item" effect="dark" content="免费中bonus图案出现最大次数"
                            placement="top-end"></el-tooltip>
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.HitMax"></el-input>
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

        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsMayanTotemExt',
  // eslint-disable-next-line vue/no-unused-components
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
        BonusNumCfg: []
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
      this.$refs.compare.Compare(function (isEdit) {
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
    handleAdd() {
      const newRow = {
        OddsMin: 0,
        OddsMax: 0,
        NumMin: 0,
        NumMax: 0,
        HitMin: 0,
        HitMax: 0
      }
      this.cfg.BonusNumCfg.push(newRow)
    },
    handleDelete(index) {
      this.cfg.BonusNumCfg.splice(index, 1)
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        if (!this.cfg.BonusNumCfg) {
          this.cfg.BonusNumCfg = []
        }
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
