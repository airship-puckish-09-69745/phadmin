<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="Bonus倍数">
            <el-input v-model="cfg.BonusOdds" placeholder="请输入内容,如2,1"> <template slot="append">放大100倍，-1为Wheel</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式Bonus倍数权重">
            <el-input v-model="cfg.BonusOddsWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式Bonus倍数权重">
            <el-input v-model="cfg.FreeBonusOddsWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="转盘倍数">
            <el-input v-model="cfg.WheelOdds" placeholder="请输入内容,如2,1"> <template slot="append">放大100倍，后面几个为Jackpot</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式转盘倍数权重">
            <el-input v-model="cfg.WheelOddsWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式转盘倍数权重">
            <el-input v-model="cfg.FreeWheelOddsWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
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
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import { DataRule } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'slotsLuckyspiritsMarsExt',
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
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
