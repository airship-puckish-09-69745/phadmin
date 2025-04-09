<template>
  <fieldset>
    <legend>机器人出牌配置</legend>
    <el-row>

      <el-col>
        <el-form-item
          label="打出去下家能吃牌，此时干扰值是多少"
        >
          <el-input v-model.number="AiConfig.OutCard.OutCardCanOtherContribute" placeholder="" />
        </el-form-item>
      </el-col>
    </el-row>
  </fieldset>
</template>
<script>
import tongitsTableRange from '@/components/TongitsTableRange'
export default {
  name: 'RobotAiSettingOutCard',
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
