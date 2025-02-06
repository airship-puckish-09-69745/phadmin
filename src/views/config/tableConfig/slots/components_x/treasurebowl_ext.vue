<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="Jackpot模式GRAND的赔率(剧本)" prop="JackpotStrOdds">
            <el-input v-model.number="cfg.JackpotGrandOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="Jackpot模式Mega的赔率(剧本)" prop="JackpotStrOdds">
            <el-input v-model.number="cfg.JackpotMegaOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="Jackpot模式Major的赔率(剧本)" prop="JackpotStrOdds">
            <el-input v-model.number="cfg.JackpotMajorOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="Jackpot模式Minor的赔率(剧本)" prop="JackpotStrOdds">
            <el-input v-model.number="cfg.JackpotMinorOdds" :required="true">
              <template slot="append">该配置仅用于前端,后端不会生效</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Jackpot模式Mini的赔率(剧本)" prop="JackpotStrOdds">
            <el-input v-model.number="cfg.JackpotMiniOdds" :required="true">
              <template slot="append">该配置仅用于前端,后端不会生效</template>
            </el-input>
          </el-form-item>

          <el-form-item label="进入Jackpot的概率与倍率映射" prop="JackpotStrOdds">
            <el-tooltip class="item" effect="dark" content="例如: 1:[1:3),表示当剧本倍数在1到3时,有1%的概率,进入jackpot,且jackpot倍率是1。多个区间用;分号分割" placement="top-end">
              <el-input v-model="cfg.JackpotStrRateMap" :required="true">
                <template slot="append">概率:[剧本目标最小倍数,剧本目标最大倍数)</template>
              </el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="JP下注金额抽水">
            <el-input v-model.number="cfg.JPFeeRate" placeholder="请输入内容" :rules="dataRule(true,{type:'n'})">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="JP抽水权重">
            <el-input v-model="cfg.JPFeeStrWeight" placeholder="请输入内容,如10,10,10;分别对应MAJOR,MEGA,GRAND抽水权重">
              <template slot="append">三个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="奖池中奖概率">
            <el-input v-model="cfg.JackpotTypeRate" placeholder="请输入内容,如10,10,10;分别对应MAJOR,MEGA,GRAND中奖概率">
              <template slot="append">实际值要乘以千万分之一,分别对应Major,MEGA,GRAND</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750">
              <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50">
              <template slot="append">三个值一组用 , 连接。</template>
            </el-input>
          </el-form-item>

          <el-form-item label="进入免费模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true"/>
          </el-form-item>

          <!--产品需求改动,增加jackpot的概率-->
          <el-form-item label="第三轴每个格子出现jackpot概率" prop="jackpot3Rate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.jackpot3Rate" :required="true">
              <template slot="append">%</template>
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
    <compare ref="compare"/>
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import {DataRule, ValidateVueItem} from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsTreasurebowlExt',
  // eslint-disable-next-line vue/no-unused-components
  components: {RatioInput, Compare},
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {}
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
      this.$refs.compare.Compare(function (isEdit) {
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
