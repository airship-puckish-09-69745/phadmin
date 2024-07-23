<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="200px">

          <el-form-item label="普通模式中奖图标">
            <el-input v-model="cfg.MultiStr" placeholder="请输入内容,如1,2,3,5,7" size="50"> <template slot="append">七个值。用,符隔开</template> </el-input>
            <br>
            <p>1=10倍奖金，2=5倍奖金，3=2倍奖金，4=35倍bet,5=3.5倍bet，6=免费1-5次spin，7=空图标</p>
          </el-form-item>

          <el-form-item label="普通模式中奖图标权重">
            <el-input v-model="cfg.MultiStrWeight" placeholder="请输入内容,如10,10,10,10,10"> <template slot="append">七个值。用,符隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="额外图标命中免费次数">
            <el-input v-model="cfg.FreeTimesStr" placeholder="请输入内容,如1,2,3,4,5" size="50"> <template slot="append">五个值。用,符隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="额外命中免费次数权重">
            <el-input v-model="cfg.FreeTimesStrWeight" placeholder="请输入内容,如10,10,10,10,10"> <template slot="append">五个值。用,符隔开</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
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
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsSuperGemMarsExt',
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
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
