<template>
  <fieldset>
    <legend>机器人挑战</legend>
    <el-row>
      <el-col>
        <el-form-item label="挑战赢-自己点数">
          <tongits-table-range :range-list="AiConfig.Fight.Win.Point" label-name="点数" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战赢-与玩家牌数对比">
          <tongits-table-range :range-list="AiConfig.Fight.Win.HandCards" label-name="牌数" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战赢-自己手牌(不算套牌)">
          <tongits-table-range :range-list="AiConfig.Fight.Win.RemainHandCards" label-name="手牌" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战赢-回合数">
          <tongits-table-range :range-list="AiConfig.Fight.Win.Round" label-name="回合" />
        </el-form-item>
      </el-col>
    </el-row>
    <legend>特殊规则</legend>
    <el-row>
      <el-col>
        <el-form-item
          label="手里只剩1张A，对手牌数>1，多少概率会发起挑战"
        >
          <el-input v-model.number="AiConfig.Fight.Special.HandAOther1Fight" placeholder="" />
        </el-form-item>
        <el-form-item
          label="自己点数大于51点时不挑战概率"
        >
          <el-input v-model.number="AiConfig.Fight.Special.PointGe51NotFight" placeholder="" />
        </el-form-item>
        <el-form-item
          label="其他玩家没有放牌就发起挑战概率（赢前提）"
        >
          <el-input v-model.number="AiConfig.Fight.Special.OtherNotDropButCanWin" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="真人没放牌时发起挑战概率(赢前提)">
          <tongits-table-range :range-list="AiConfig.Fight.Special.RealPlayerNotDrop" label-name="点数" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="挑战输-自己点数">
          <tongits-table-range :range-list="AiConfig.Fight.Lose.Point" label-name="点数" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战输-与玩家牌数对比">
          <tongits-table-range :range-list="AiConfig.Fight.Lose.HandCards" label-name="牌数" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战输-自己手牌(不算套牌)">
          <tongits-table-range :range-list="AiConfig.Fight.Lose.RemainHandCards" label-name="手牌" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="挑战输-回合数">
          <tongits-table-range :range-list="AiConfig.Fight.Lose.Round" label-name="回合" />
        </el-form-item>
      </el-col>
    </el-row>
  </fieldset>
</template>
<script>
import tongitsTableRange from '@/components/TongitsTableRange'
export default {
  name: 'RobotAiSettingFight',
  components: { tongitsTableRange },
  model: {
		    prop: 'AiConfig',
		    event: 'cc'
  },
  props: {
		    AiConfig: {
		      type: Object,
		      default: function() {
		        return {}
		      }
		    }
  },
  created() {
		    this.$nextTick(() => {
		      console.log('common plugin tongitsConfig:', this.AiConfig)
		    })
  },
  methods: {
  }
}
</script>
