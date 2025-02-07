<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="额外中奖倍数">
            <el-input v-model="cfg.MultiStr" :required="true" placeholder="请输入内容,如1,2,3,5" @change="onMultiStrChange"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="普通模式额外中奖倍数权重">
            <el-input v-model="cfg.MultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费额外中奖倍数权重">
            <el-input v-model="cfg.BuyFreeMultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="重转模式购买倍数" prop="BuyRespinOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyRespinOdds" :required="true" />
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="普通模式进入JP的概率" prop="NormalInJPRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.NormalInJPRate" :required="true" > <template slot="append">‱</template> </el-input>
          </el-form-item>

          <el-form-item label="购买重转进入JP的概率" prop="BuyRespinInJPRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyRespinInJPRate" :required="true" > <template slot="append">%</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水比例" prop="JPFeeRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JPFeeRate" :required="true" > <template slot="append">‰</template> </el-input>
          </el-form-item>

          <el-form-item label="JP抽水分配权重" prop="JPFeeSlWeightStr" placeholder="请输入内容,如150,151,820,1000,表示：mini,minor,major,grand">
            <el-input v-model="cfg.JPFeeSlWeightStr" :required="true" > <template slot="append">四个值用 , 连接。代表：mini,minor,major,grand</template> </el-input>
          </el-form-item>

          <el-form-item label="Minor Major Grand Joker 对应的JP奖项中奖倍数范围">
            <el-input v-model="cfg.JPMultiStr" :required="true" placeholder="请输入内容,如1-10,30-50,100-150,200">
              <template slot="append">四个值用 , 连接。</template>
            </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs type="border-card" value="normal">
          <el-tab-pane label="普通模式JP奖项权重" name="normal">
            <el-table :data="NormalJPMultiWeights">
              <el-table-column prop="MultiOdds" label="额外倍数" width="100"></el-table-column>
              <el-table-column prop="WeightStr" label="奖项权重（minor,major,grand,joker）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.WeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">四个值用 , 连接</template> </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="购买免费JP奖项权重" name="buyFree">
            <el-table :data="BuyFreeJPMultiWeights">
              <el-table-column prop="MultiOdds" label="额外倍数" width="100"></el-table-column>
              <el-table-column prop="Weight" label="奖项权重（minor,major,grand,joker）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.WeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">四个值用 , 连接</template> </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="购买重转JP奖项权重" name="buyRespin">
            <el-table :data="BuyRespinJPMultiWeights">
              <el-table-column prop="MultiOdds" label="额外倍数" width="100"></el-table-column>
              <el-table-column prop="Weight" label="奖项权重（minor,major,grand,joker）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.WeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">四个值用 , 连接</template> </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="剧本目标触发JP配置" name="script">
            <el-button type="primary" @click="addScriptJPConfigRow">添加</el-button>
            <el-table :data="cfg.ScriptJPConfig">
              <el-table-column prop="MinOdds" label="目标倍数开始[" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MinOdds" :required="true" placeholder="请输入内容,如10"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MinOdds" label="]目标倍数结束" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.MaxOdds" :required="true" placeholder="请输入内容,如10"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="WeightStr" label="触发概率%">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.InJPRate" :required="true" placeholder="请输入内容,如10"> <template slot="append">%</template> </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeScriptJPConfigRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
  name: 'SlotsMahjongFortuneExt',
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
      NormalJPMultiWeights: [],
      BuyFreeJPMultiWeights: [],
      BuyRespinJPMultiWeights: [],
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
      const multiOddsCnt = this.cfg.MultiStr.split(',').length
      if (multiOddsCnt !== this.cfg.MultiWeightStr.split(',').length || multiOddsCnt!== this.cfg.BuyFreeMultiWeightStr.split(',').length) {
        this.$message.error('额外中奖倍数数量与相关权重的数量不一致')
        return false
      }

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
        this.setJPMultiWeights()
      }
    },
    setJPMultiWeights() {
      this.NormalJPMultiWeights = []
      const multiOddsList = this.cfg.MultiStr.split(',')
      for (let i = 0; i < multiOddsList.length; i++) {
        this.NormalJPMultiWeights.push({
          MultiOdds: multiOddsList[i],
          WeightStr: this.cfg.NormalJPMultiWeightStr ? this.cfg.NormalJPMultiWeightStr[i] : ''
        })
      }

      this.BuyFreeJPMultiWeights = []
      for (let i = 0; i < multiOddsList.length; i++) {
        this.BuyFreeJPMultiWeights.push({
          MultiOdds: multiOddsList[i],
          WeightStr: this.cfg.BuyFreeJPMultiWeightStr ? this.cfg.BuyFreeJPMultiWeightStr[i] : ''
        })
      }

      this.BuyRespinJPMultiWeights = []
      for (let i = 0; i < multiOddsList.length; i++) {
        this.BuyRespinJPMultiWeights.push({
          MultiOdds: multiOddsList[i],
          WeightStr: this.cfg.BuyRespinJPMultiWeightStr ? this.cfg.BuyRespinJPMultiWeightStr[i] : ''
        })
      }
    },
    jpMultiWeightsToStrList() {
      this.cfg.NormalJPMultiWeightStr = []
      for (let i = 0; i < this.NormalJPMultiWeights.length; i++) {
        this.cfg.NormalJPMultiWeightStr.push(this.NormalJPMultiWeights[i].WeightStr)
      }

      this.cfg.BuyFreeJPMultiWeightStr = []
      for (let i = 0; i < this.BuyFreeJPMultiWeights.length; i++) {
        this.cfg.BuyFreeJPMultiWeightStr.push(this.BuyFreeJPMultiWeights[i].WeightStr)
      }

      this.cfg.BuyRespinJPMultiWeightStr = []
      for (let i = 0; i < this.BuyRespinJPMultiWeights.length; i++) {
        this.cfg.BuyRespinJPMultiWeightStr.push(this.BuyRespinJPMultiWeights[i].WeightStr)
      }
    },
    addScriptJPConfigRow() {
      if (this.cfg.ScriptJPConfig == null) this.cfg.ScriptJPConfig = []
      this.cfg.ScriptJPConfig.push({
        MinOdds: 0,
        MaxOdds: 0,
        InJPRate: 0
      })
      console.log('addScriptJPConfigRow', this.cfg.ScriptJPConfig)
    },
    removeScriptJPConfigRow(index) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cfg.ScriptJPConfig.splice(index, 1)
        console.log('removeScriptJPConfigRow', this.cfg.ScriptJPConfig)
      })
    },
    onMultiStrChange() {
      if (this.cfg.MultiStr.split(',').length !== this.cfg.NormalJPMultiWeightStr.length) {
        this.$message.warning('额外中奖倍数数量已经改变，请重新设置以下数据：额外中奖倍数权重、JP奖项权重')
      }
      this.setJPMultiWeights()
    }
  }
}
</script>
