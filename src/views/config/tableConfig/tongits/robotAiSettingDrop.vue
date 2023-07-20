<template>
	<fieldset>
      <legend>机器人放牌配置</legend>
      <el-row>

        <el-col>
          <el-form-item
              label="放牌区有组合同时手上牌相连可能贴牌时有放的概率"
            >
              <el-input v-model.number="AiConfig.Drop.DropGroupHasLinkMaybe" placeholder="" />
          </el-form-item>
          <el-form-item
              label="没有人放牌同时自己点数少于其他人，放牌概率"
            >
              <el-input v-model.number="AiConfig.Challenge.NobodyDropOwnerLessOther" placeholder="" />
          </el-form-item>
          <el-form-item
              label="没有人放牌同时自己点数大于其他人，放牌概率"
            >
              <el-input v-model.number="AiConfig.Challenge.NobodyDropOwnerGreatOther" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
</template>
<script>
	import tongitsTableRange from '@/components/TongitsTableRange'
	export default {
		name: 'RobotAiSettingDrop',
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
