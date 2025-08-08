<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form-item
          label="是否构建好牌："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-switch v-model="AiConfig.BuildCard.IsDoBuildCard" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建4条概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildFourRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建4条数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildFourMaxNum" placeholder="1" />
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
          <el-input v-model.number="AiConfig.BuildCard.BuildFlushGte5Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建5顺以上数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildFlushGte5MaxNum" placeholder="0" />
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
          <el-input v-model.number="AiConfig.BuildCard.BuildFlush4Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建4顺数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildFlush4MaxNum" placeholder="0" />
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
          <el-input v-model.number="AiConfig.BuildCard.BuildFlush3Ratio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建3顺数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildFlush3MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建3条概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildThreeRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建3条数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildThree3MaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item
          label="构建不被贴3条概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildThreeNoTailRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="构建不被贴3条数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildThreeNoTailMaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="GameType == 'joker'">
      <el-col :span="11">
        <el-form-item
          label="构建癞子概率："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildJokerRatio" placeholder="单位百分比" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item
          label="最大构建癞子数量："
          label-width="200px"
          :rules="dataRule(true,{type:'n',range:'0'})"
        >
          <el-input v-model.number="AiConfig.BuildCard.BuildJokerMaxNum" placeholder="0" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import tongitsTableRange from '@/components/TongitsTableRange'
import { DataRule } from '@/utils/common'
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
    },
    GameType: {
      type: String,
      default: function() {
        return "pot"
      }
    }
  },
  data() {
    return {
      BuildThreeNoTailRatio: 0,
      BuildThreeNoTailMaxNum: 0,
    }
  },
  created() {
		    this.$nextTick(() => {
		      console.log('common plugin tongitsConfig:', this.AiConfig)
		    })
  },

  watch: {
    AiConfig: {
      immediate: true,
      deep: true,
      handler(newVal) {

        if (!newVal.BuildCard.BuildThreeNoTailRatio) {
          newVal.BuildCard.BuildThreeNoTailRatio = this.BuildThreeNoTailRatio 
          newVal.BuildCard.BuildThreeNoTailMaxNum = this.BuildThreeNoTailMaxNum 
         
        }
      }
    }
  },

  methods: {
    dataRule(required, config) {
		      return DataRule(required, config)
		    }
  }
}
</script>
