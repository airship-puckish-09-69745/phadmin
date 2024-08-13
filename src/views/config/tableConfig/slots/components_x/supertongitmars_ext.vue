<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="200px">
          <el-form-item label="免费模式下注额5倍数">
            <el-input v-model="cfg.Free5MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额5权重">
            <el-input v-model="cfg.Free5MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式下注额10倍数">
            <el-input v-model="cfg.Free10MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额10权重">
            <el-input v-model="cfg.Free10MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式下注额50倍数">
            <el-input v-model="cfg.Free50MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额50权重">
            <el-input v-model="cfg.Free50MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式下注额100倍数">
            <el-input v-model="cfg.Free100MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额100权重">
            <el-input v-model="cfg.Free100MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="免费模式下注额5购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds5" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额10购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds10" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额50购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds50" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="免费模式下注额100购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds100" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
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
  name: 'SlotsSupertongitMarsExt',
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
