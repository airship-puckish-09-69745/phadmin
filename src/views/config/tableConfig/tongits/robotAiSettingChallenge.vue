<template>
	<fieldset>
      <legend>机器人面对挑战</legend>
      <el-row>
        <el-col>
          <el-form-item label="挑战赢-自己点数">
            <tongits-table-range :rangeList="AiConfig.Challenge.Win.Point" labelName="点数"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战赢-与玩家牌数对比">
            <tongits-table-range :rangeList="AiConfig.Challenge.Win.HandCards" labelName="牌数"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战赢-自己手牌(不算套牌)">
            <tongits-table-range :rangeList="AiConfig.Challenge.Win.RemainHandCards" labelName="手牌"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战赢-回合数">
            <tongits-table-range :rangeList="AiConfig.Challenge.Win.Round" labelName="回合"></tongits-table-range>
          </el-form-item>
        </el-col>
      </el-row>
      <legend>特殊规则</legend>
      <el-row>
        <el-col>
          <el-form-item
              label="手里只剩1张A，对手牌数>1，多少概率会发起挑战"
            >
              <el-input v-model.number="AiConfig.Challenge.Special.HandAOther1Fight" placeholder="" />
            </el-form-item>
          <el-form-item
              label="自己点数大于51点时不挑战概率"
            >
              <el-input v-model.number="AiConfig.Challenge.Special.PointGe51NotFight" placeholder="" />
            </el-form-item>
          <el-form-item
              label="第二轮时其他玩家没有放牌就发起挑战概率"
            >
              <el-input v-model.number="AiConfig.Challenge.Special.Round2NotDrop" placeholder="" />
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="挑战输-自己点数">
            <tongits-table-range :rangeList="AiConfig.Challenge.Lose.Point" labelName="点数"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战输-与玩家牌数对比">
            <tongits-table-range :rangeList="AiConfig.Challenge.Lose.HandCards" labelName="牌数"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战输-自己手牌(不算套牌)">
            <tongits-table-range :rangeList="AiConfig.Challenge.Lose.RemainHandCards" labelName="手牌"></tongits-table-range>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="挑战输-回合数">
            <tongits-table-range :rangeList="AiConfig.Challenge.Lose.Round" labelName="回合"></tongits-table-range>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
</template>
<script>
	import tongitsTableRange from '@/components/TongitsTableRange'
	export default {
		name: 'RobotAiSettingChallenge',
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
		      console.log("common plugin tongitsConfig:",this.AiConfig)
		    })
		},
		methods:{
		}
	}
</script>
