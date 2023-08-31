<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col v-for="(item,idx) in slotsData.JackpotConfig" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ idx + 1 }}</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" @click="del(idx)">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px">
            <el-col :span="22">
              <el-form :ref="getId(idx)" label-width="150px">
                <el-form-item label="Jackpot Key">
                  <el-select v-model="item.JackpotKey" size="small">
                    <el-option label="jackpot_1" value="jackpot_1" />
                    <el-option label="jackpot_2" value="jackpot_2" />
                    <el-option label="jackpot_3" value="jackpot_3" />
                    <el-option label="jackpot_4" value="jackpot_4" />
                    <el-option label="jackpot_5" value="jackpot_5" />
                    <el-option label="jackpot_6" value="jackpot_6" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Jackpot名称">
                  <el-select v-model="item.JackpotName" size="small">
                    <el-option label="Mini" value="Mini" />
                    <el-option label="Minor" value="Minor" />
                    <el-option label="Major" value="Major" />
                  </el-select>
                </el-form-item>
                <el-form-item label="奖池初始赔率">
                  <el-input v-model.number="item.EffectiveOdds" label="奖池初始赔率"><template slot="append">倍</template></el-input>
                </el-form-item>
                <el-form-item label="自动开奖最小赔率">
                  <el-input v-model.number="item.MinOdds" label="自动开奖最小赔率"><template slot="append">倍</template></el-input>
                </el-form-item>
                <el-form-item label="自动开奖最大赔率">
                  <el-input v-model.number="item.MaxOdds" label="自动开奖最大赔率"><template slot="append">倍</template></el-input>
                </el-form-item>
                <el-form-item label="中奖概率">
                  <el-input v-model.number="item.HitRate" label="中奖概率"><template slot="append">‱</template></el-input>
                </el-form-item>
                <el-form-item label="下注金额入池率">
                  <el-input v-model.number="item.TransferRate" label="下注金额入池率"><template slot="append">‱</template></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-row>
      <el-col style="text-align:center;">
        <el-button @click="addRow">添加</el-button>
        <el-button type="primary" @click="submitFrm">保存</el-button>
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
  name: 'SlotsJackpot',
  components: { RatioInput, Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  /*
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  */
  data() {
    return {
      cfg: {
        'JackpotConfig': []
      }
    }
  },
  created() {
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      // 数据检测
      for (const i in this.slotsData.JackpotConfig) {
        if (this.slotsData.JackpotConfig[i].MinOdds < 0 || this.slotsData.JackpotConfig[i].MinOdds > 1000) {
          this.$message.error(this.slotsData.JackpotConfig[i].JackpotKey + '的最小赔率应该在0~1000之间!')
          return
        } else if (this.slotsData.JackpotConfig[i].HitRate < 0 || this.slotsData.JackpotConfig[i].HitRate > 10000) {
          this.$message.error(this.slotsData.JackpotConfig[i].JackpotKey + '的中奖概率应该在0~10000之间!')
          return
        } else if (this.slotsData.JackpotConfig[i].TransferRate < 0 || this.slotsData.JackpotConfig[i].TransferRate > 10000) {
          this.$message.error(this.slotsData.JackpotConfig[i].JackpotKey + '的入池率应该在0~10000之间!')
          return
        } else if (this.slotsData.JackpotConfig[i].MaxOdds < this.slotsData.JackpotConfig[i].MinOdds) {
          this.$message.error(this.slotsData.JackpotConfig[i].JackpotKey + '的最大赔率不能小于最小赔率!')
          return
        } else if (this.slotsData.JackpotConfig[i].EffectiveOdds >= this.slotsData.JackpotConfig[i].MinOdds) {
          this.$message.error(this.slotsData.JackpotConfig[i].JackpotKey + '的初始赔率必须小于最小赔率!')
          return
        }
      }

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
    getId(idx) {
      return 'frm' + idx
    },
    del(idx) {
      this.$delete(this.slotsData.JackpotConfig, idx)
    },
    initRow() {
      return {
        'JackpotKey': 'Jackpot1',
        'JackpotName': 'Mini',
        'MinOdds': 0,
        'MaxOdds': 0,
        'MinSeconds': 0,
        'MaxSeconds': 0,
        'HitRate': 0,
        'TransferRate': 0,
        'EffectiveOdds': 0
      }
    },
    addRow() {
      this.slotsData.JackpotConfig.push(this.initRow())
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
