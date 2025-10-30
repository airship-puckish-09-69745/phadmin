<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-divider > 外层转盘配置(含有Free Game) </el-divider>

          <el-form-item label="转盘外圈倍数配置">
            <el-input v-model="cfg.OuterWheelFreeGameOdds" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接(-1 表示FreeGame)</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式转盘外圈倍数权重">
            <el-input v-model="cfg.OuterWheelFreeGameWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式转盘外圈倍数权重">
            <el-input v-model="cfg.FreeOuterWheelFreeGameWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-divider > 外层转盘配置(不含Free Game) </el-divider>

          <el-form-item label="转盘外圈倍数配置">
            <el-input v-model="cfg.OuterWheelOdds" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式转盘外圈倍数权重">
            <el-input v-model="cfg.OuterWheelWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式转盘外圈倍数权重">
            <el-input v-model="cfg.FreeOuterWheelWeight" placeholder="请输入内容,如2,1"> <template slot="append">用 , 连接</template> </el-input>
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
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsFortuneWheelExt',
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
    },
    baseBet: Number
  },
  data() {
    return {
      cfg: {
      },
      activeTab: 'script',
      buyFreeOddsConf: {
        dialogVisible: false,
        currentBet: '0',
        dialogTitle: '添加配置',
        currentConf: []
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
