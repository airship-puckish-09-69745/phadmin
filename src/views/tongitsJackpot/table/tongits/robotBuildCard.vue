<template>
  <fieldset>
    <legend>机器人好牌配置</legend>
    <el-row>
      <el-col :span="20">
        <el-form-item
          label="是否构建好牌："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-switch v-model="tongitsConfig.robotConfig.RobotCardBuildConfig.IsDoBuildCard" />
        </el-form-item>
      </el-col>
    </el-row>
    <!--el-row>
      <el-col :span="11">
        <el-form-item
          label="构建4条概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFourRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建4条数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFourMaxNum" placeholder="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建5顺以上概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlushGte5Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建5顺以上数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlushGte5MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建4顺概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlush4Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建4顺数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlush4MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建3顺概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlush3Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建3顺数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildFlush3MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建3条概率："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxWinTimesEnd"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildThreeRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建3条数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.RobotCardBuildConfig.BuildThree3MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row-->
  </fieldset>
</template>
<script>
import { DataRule } from '@/utils/common'
export default {
  name: 'TongitsRobotBuildCard',
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
		      console.log('common plugin tongitsConfig:', this.tongitsConfig)
		    })
  },
  methods: {
    dataRule(required, config) {
		      return DataRule(required, config)
		    }
  }
}
</script>
