<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="260px">

          <el-form-item label="额外倍数">
            <el-input v-model="cfg.MultiStr" :required="true" placeholder="请输入内容,如1,2,3,5" @change="onMultiStrChange"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="剧本大奖-额外倍数权重">
            <el-input v-model="cfg.MultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="剧本大奖-额外倍数权重（加倍投注）">
            <el-input v-model="cfg.ExBetMultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费-额外倍数权重">
            <el-input v-model="cfg.BuyFreeMultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买免费-额外倍数权重（加倍投注）">
            <el-input v-model="cfg.BuyFreeExBetMultiWeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">多个值用 , 连接</template> </el-input>
          </el-form-item>

          <el-form-item label="购买重转-购买倍数" prop="BuyRespinOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyRespinOdds" :required="true" />
          </el-form-item>

          <el-form-item label="购买免费-购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true" />
          </el-form-item>

          <el-form-item label="未中奖出现2列JP的概率" prop="Appear2ColJPRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.Appear2ColJPRate" :required="true" > <template slot="append">%</template> </el-input>
          </el-form-item>

          <el-form-item label="剧本大奖JP-出现的概率" prop="NormalInJPRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.NormalInJPRate" :required="true" > <template slot="append">百万分之</template> </el-input>
          </el-form-item>

          <el-form-item label="购买重转-进入JP的概率" prop="BuyRespinInJPRate" :rules="dataRule(true,{type:'n'})">
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
        <el-tabs v-model="TabsBetTypeActiveName" type="border-card" value="正常投注" tab-position="top">
          <el-tab-pane
            v-for="item in JPMultiWeights"
            :key="item.BetOdds"
            :label="item.Name"
            :name="item.Name"
          >
            <el-tabs type="border-card" value="normal">
              <el-tab-pane label="剧本大奖JP奖项权重" name="normal">
                <el-table :data="item.BigBonusWeights">
                  <el-table-column prop="MultiOdds" label="额外倍数" width="100"></el-table-column>
                  <el-table-column prop="WeightStr" label="奖项权重（minor,major,grand,joker）">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.WeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">四个值用 , 连接</template> </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="购买免费JP奖项权重" name="buyFree">
                <el-table :data="item.BuyFreeWeights">
                  <el-table-column prop="MultiOdds" label="额外倍数" width="100"></el-table-column>
                  <el-table-column prop="Weight" label="奖项权重（minor,major,grand,joker）">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.WeightStr" :required="true" placeholder="请输入内容,如1,2,3,5"> <template slot="append">四个值用 , 连接</template> </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="购买重转JP奖项权重" name="buyRespin">
                <el-table :data="item.BuyRespinWeights">
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
                <el-table :data="item.ScriptJPRates">
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
                  <el-table-column prop="WeightStr" label="触发概率‱">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.InJPRate" :required="true" placeholder="请输入内容,如10"> <template slot="append">‱</template> </el-input>
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
          </el-tab-pane>
        </el-tabs>
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
import { DataRule, ValidateVueItem } from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsMahjongJackpotExt',
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
      TabsBetTypeActiveName: '正常投注',
      JPMultiWeights: [
        {
          ExBetOdds: 1000,
          Name: '正常投注',
          ScriptJPRates: [{MinOdds: 10, MaxOdds: 30, InJPRate: 10}, {MinOdds: 31, MaxOdds: 40, InJPRate: 20}],
          BigBonusWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
          BuyFreeWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
          BuyRespinWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
        },
        {
          ExBetOdds: 1500,
          Name: '加倍投注',
          ScriptJPRates: [{MinOdds: 10, MaxOdds: 30, InJPRate: 10}, {MinOdds: 31, MaxOdds: 40, InJPRate: 20}],
          BigBonusWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
          BuyFreeWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
          BuyRespinWeights: [{MultiOdds: 1, WeightStr: '1,2,3,5'}],
        }
      ],

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
      const multiOddsCnt = this.cfg.MultiStr.split(',').length
      if (multiOddsCnt !== this.cfg.MultiWeightStr.split(',').length || multiOddsCnt !== this.cfg.BuyFreeMultiWeightStr.split(',').length) {
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
        this.setJPMultiWeights()
      }
    },
    setJPMultiWeights() {
      const multiOddsList = this.cfg.MultiStr.split(',')

      for (let i = 0; i < this.JPMultiWeights.length; i++) {
        const obj = this.JPMultiWeights[i]
        obj.BigBonusWeights = []
        obj.BuyFreeWeights = []
        obj.BuyRespinWeights = []
        obj.ScriptJPRates = this.cfg.JPMultiWeights[i] ? this.cfg.JPMultiWeights[i].ScriptJPRates : obj.ScriptJPRates
        const cfg = this.cfg.JPMultiWeights[i] ? this.cfg.JPMultiWeights[i] : obj

        for (let j = 0; j < multiOddsList.length; j++) {
          obj.BigBonusWeights.push({
            MultiOdds: multiOddsList[j],
            WeightStr: cfg.BigBonusWeightStrList ? cfg.BigBonusWeightStrList[j] : ''
          })
          obj.BuyFreeWeights.push({
            MultiOdds: multiOddsList[j],
            WeightStr: cfg.BuyFreeWeightStrList ? cfg.BuyFreeWeightStrList[j] : ''
          })
          obj.BuyRespinWeights.push({
            MultiOdds: multiOddsList[j],
            WeightStr: cfg.BuyRespinWeightStrList ? cfg.BuyRespinWeightStrList[j] : ''
          })
        }
      }
    },
    jpMultiWeightsToStrList() {
      this.cfg.JPMultiWeights = []
      for (let i = 0; i < this.JPMultiWeights.length; i++) {
        const editObj = this.JPMultiWeights[i]
        const obj = {
          ExBetOdds: this.JPMultiWeights[i].ExBetOdds,
          ScriptJPRates: this.JPMultiWeights[i].ScriptJPRates,
          BigBonusWeightStrList: [],
          BuyFreeWeightStrList: [],
          BuyRespinWeightStrList: [],
        }
        for (let ii = 0; ii < editObj.BigBonusWeights.length; ii++) {
          obj.BigBonusWeightStrList.push(editObj.BigBonusWeights[ii].WeightStr)
        }
        for (let ii = 0; ii < editObj.BuyFreeWeights.length; ii++) {
          obj.BuyFreeWeightStrList.push(editObj.BuyFreeWeights[ii].WeightStr)
        }
        for (let ii = 0; ii < editObj.BuyRespinWeights.length; ii++) {
          obj.BuyRespinWeightStrList.push(editObj.BuyRespinWeights[ii].WeightStr)
        }
        this.cfg.JPMultiWeights.push(obj)
      }
    },
    addScriptJPConfigRow() {
      for (let i = 0; i < this.JPMultiWeights.length; i++) {
        if (this.JPMultiWeights[i].Name !== this.TabsBetTypeActiveName) {
          continue
        }
        if (!this.JPMultiWeights[i].ScriptJPRates) {
          this.JPMultiWeights[i].ScriptJPRates = []
        }
        this.JPMultiWeights[i].ScriptJPRates.push({
          MinOdds: 0,
          MaxOdds: 0,
          InJPRate: 0
        })
      }
      console.log('addScriptJPConfigRow', this.cfg.ScriptJPConfig)
    },
    removeScriptJPConfigRow(index) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          for (let i = 0; i < this.JPMultiWeights.length; i++) {
            if (this.JPMultiWeights[i].Name !== this.TabsBetTypeActiveName) {
              continue
            }
            this.JPMultiWeights[i].ScriptJPRates.splice(index, 1)
          }
        console.log('removeScriptJPConfigRow index', index)
      })
    },
    onMultiStrChange() {
      this.setJPMultiWeights()
    }
  }
}
</script>
