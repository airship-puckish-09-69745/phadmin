<template>
  <fieldset>
    <legend>机器人通用配置</legend>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="携带金额最小值："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotCarryMoneyStart" placeholder="携带金额最小值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="携带金额最大值："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotCarryMoneyEnd" placeholder="携带金额最大值" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="最大玩牌次数下限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxPlayTimesStart"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxPlayTimesStart" placeholder="最大玩牌次数下限值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大玩牌次数上限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxPlayTimesEnd"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxPlayTimesEnd" placeholder="最大玩牌次数上限值" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="最大赢牌次数下限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxWinTimesStart"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxWinTimesStart" placeholder="最大赢牌次数下限值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大赢牌次数上限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxWinTimesEnd"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxWinTimesEnd" placeholder="最大赢牌次数上限值" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="最大输牌次数下限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxLoseTimesStart"
          :rules="dataRule(true,{type:'n',range:'1'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxLoseTimesStart" placeholder="最大输牌次数下限值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大输牌次数上限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxLoseTimesEnd"
          :rules="dataRule(true,{type:'n',range:'1'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxLoseTimesEnd" placeholder="最大输牌次数上限值" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="最大赢得金额下限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxWinMoneyStart"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxWinMoneyStart" placeholder="最大赢得金额下限值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大赢得金额上限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxWinMoneyEnd"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxWinMoneyEnd" placeholder="最大赢得金额上限值" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="最大输掉金额下限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxLoseMoneyStart"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxLoseMoneyStart" placeholder="最大输掉金额下限值" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大输掉金额上限值："
          label-width="200px"
          prop="robotConfig.Common.RobotMaxLoseMoneyEnd"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="tongitsConfig.robotConfig.Common.RobotMaxLoseMoneyEnd" placeholder="最大输掉金额上限值" />
        </el-form-item>
      </el-col>
    </el-row>
  </fieldset>
</template>
<script>
import { DataRule } from '@/utils/common'
export default {
  name: 'TongitsRobotCommon',
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
