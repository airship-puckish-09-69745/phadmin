<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="200px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="Bonus倍数">
            <el-input v-model="cfg.BonusOdds" placeholder="请输入内容,保持与Bonus倍数权重对应"> <template slot="append">放大100倍</template> </el-input>
          </el-form-item>
          <el-form-item label="Bonus倍数权重">
            <el-input v-model="cfg.BonusOddsWeight" placeholder="请输入内容,保持与Bonus倍数对应"> <template slot="append">各倍数权重</template> </el-input>
          </el-form-item>

          <el-form-item label="Bonus羽毛个数权重">
            <el-input v-model.number="cfg.BonusFeatherWeight" placeholder="请输入内容" ><template slot="append">分别对应1,2,3只羽毛</template> </el-input>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsPhoenixmarsExt',
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
