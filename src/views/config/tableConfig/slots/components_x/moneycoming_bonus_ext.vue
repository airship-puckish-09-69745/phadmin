<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="frm3" :model="cfg" label-width="260px">


          <el-row>
          <fieldset style="margin-top:20px;margin-bottom: 20px;">
            <legend>bonus普通模式概率
            </legend>

            <el-row>
              <el-table
                ref="filterTable"
                :data="cfg.BonusInfo"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >

                <el-table-column label="下注额" prop="bet" width="150" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.Bet }}
                  </template>
                </el-table-column>

                <el-table-column label="倍率范围" prop="bounsRate" align="center">
                  <template slot-scope="scope">
                      <template v-for="item, index in scope.row.Rate">
                        中奖 <el-input v-model.number="item.Winodds" style="width: 70px;padding: 2px 0px;" size="mini" :required="true" disabled></el-input> 倍, 且
                        <el-input v-model.number="item.Minodds" style="width: 150px;" size="mini" :required="true"></el-input>
                        <= 剧本倍率 <
                      <el-input v-model.number="item.Maxodds" style="width: 150px;" size="mini" :required="true"></el-input>
                       中奖概率：<el-input v-model.number="item.Winrate" style="width: 150px;" size="mini" :required="true"><template slot="append">‰</template></el-input>
                      <br>
                    </template>


                  </template>
                </el-table-column>

              </el-table>
            </el-row>
          </fieldset>
            </el-row>

          <el-form-item label="购买Bouns模式下注额5倍数">
            <el-input v-model="cfg.Free5MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="购买Bouns模式下注额5权重">
            <el-input v-model="cfg.Free5MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买Bouns模式下注额10倍数">
            <el-input v-model="cfg.Free10MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="购买Bouns模式下注额10权重">
            <el-input v-model="cfg.Free10MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买Bouns模式下注额50倍数">
            <el-input v-model="cfg.Free50MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="购买Bouns模式下注额50权重">
            <el-input v-model="cfg.Free50MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买Bouns模式下注额100倍数">
            <el-input v-model="cfg.Free100MultiStr" placeholder="请输入内容,如5,10,15,50"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>
          <el-form-item label="购买Bouns模式下注额100权重">
            <el-input v-model="cfg.Free100MultiStrWeight" placeholder="请输入内容,如10,10,10,10"> <template slot="append">八个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="Bouns模式下注额5购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds5" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="Bouns模式下注额10购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds10" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="Bouns模式下注额50购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds50" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>
          <el-form-item label="Bouns模式下注额100购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds100" placeholder="请输入数字内容"> <template slot="append">实际倍数放大100倍,如需2.1倍则填210</template> </el-input>
          </el-form-item>

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
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import { $libShow, $libType } from '@/utils/common'
import { DataRule, ValidateVueItem } from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsMoneycomingBonusExt',
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
      libShow: $libShow,
      JackpotRandAwards: [],
      cfg: {},

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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      if (!ValidateVueItem(this.$refs['frm3'])) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
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
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
