<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="260px">

          <el-form-item label="额外倍数">
            <el-input v-model="cfg.MultiStr" :required="true" placeholder="请输入内容,如1,2,3,5" @change="onMultiStrChange"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="额外倍数权重">
            <el-input v-model="cfg.MultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费-购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="Minor Major Grand Joker 对应的JP奖项中奖倍数范围">
            <el-input v-model="cfg.JPMultiStr" :required="true" placeholder="请输入内容,如1-10,30-50,100-150,200">
              <template slot="append">四个值用 , 连接。</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Minor Major Grand Joker 对应的JP奖项中奖倍数权重">
            <el-input v-model="cfg.JPMultiWeightStr" :required="true" placeholder="请输入内容,如10,50,150,200">
              <template slot="append">四个值用 , 连接。</template>
            </el-input>
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
  name: 'SlotsMahjongFortuneMarsExt',
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
      },
      JPNames: ['minor','major', 'grand', 'joker'],
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
      this.jpMultiWeightsToStrList()
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
    },
  }
}
</script>
