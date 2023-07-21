<template>
	<fieldset>
      <legend>机器人控制配置</legend>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="机器人开关："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-switch 
            v-model="tongitsConfig.robotConfig.Control.RobotOpenFlag"
            :active-value='1'
            :inactive-value='0'
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="玩家首次进入1个机器人概率："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.Create1RobotPercents" placeholder="概率百分比" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="玩家首次进入2个机器人概率："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.Create2RobotPercents" placeholder="概率百分比" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="玩家首次进入3个机器人概率："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.Create3RobotPercents" placeholder="正常情况下为0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="最多机器人数量："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.MaxRobotUserNum" placeholder="房间最大多少机器人" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="随机进入最小时间："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.RobotLoginIntervalMin" placeholder="单位秒" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="随机进入最大时间："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'1'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.RobotLoginIntervalMax" placeholder="单位秒" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="机器人底池(X1000)："
            label-width="200px"
            :rules="dataRule(true,{type:'n',range:'0'})"
          >
            <el-input v-model.number="tongitsConfig.robotConfig.Control.RobotPoolMoney" placeholder="底池" />
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
</template>
<script>
	import {  DataRule } from '@/utils/common'
	export default {
		name: 'TongitsRobotControl',
		model: {
		    prop: 'tongitsConfig',
		    event: 'cc'
		},
		props: {
		    tongitsConfig: {
		      type: Object,
		      default: function() {
		        return {}
		      }
		    }
		},
		created() {
		    this.$nextTick(() => {
		      console.log("common plugin tongitsConfig:",this.tongitsConfig)
		    })
		},
		methods:{
			dataRule(required, config) {
		      return DataRule(required, config)
		    }
		}
	}
</script>
