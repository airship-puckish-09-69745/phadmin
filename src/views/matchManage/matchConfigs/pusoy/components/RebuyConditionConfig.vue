<template>
  <fieldset>
    <legend>Rebuy報名條件</legend>
    <el-row>
      <el-col :span="11">
        <el-form-item label="是否支持rebuy:" :required="true">
          <el-radio-group v-model.number="editForm.signExtra.reubyExtra.supportRebuy">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1" 
          label="Rebuy报名条件:" 
          :required="false"
        >
          <el-select 
            v-model="editForm.signExtra.reubyExtra.rebuySignType" 
            placeholder="请选择" 
            size="mini"
            @change="handleRebuySignTypeChange"
          >
            <el-option
              v-for="item in rebuySignUpTypeCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 0 || editForm.signExtra.reubyExtra.rebuySignType === 3)" 
          label="Rebuy报名费：" 
          :required="true"
        >
          <el-input 
            v-model.number="editForm.signExtra.reubyExtra.reubyFree" 
            style="width: 200px;" 
            size="mini" 
            placeholder="请填写金币数量" 
          />
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 2 || editForm.signExtra.reubyExtra.rebuySignType === 3)" 
          label="Rebuy门票：" 
          :required="true"
        >
          <el-select 
            v-model="editForm.signExtra.reubyExtra.rebuyPropId" 
            placeholder="请选择" 
            size="mini"
            @change="handleRebuyPropChange"
          >
            <el-option
              v-for="item in matchTicketsCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 2 || editForm.signExtra.reubyExtra.rebuySignType === 3)" 
          label="Rebuy门票数量：" 
          :required="true"
        >
          <el-input 
            v-model.number="editForm.signExtra.reubyExtra.rebuyPropNum" 
            style="width: 180px;" 
            size="mini" 
            placeholder="请填写门票数量" 
          />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1" 
          label="Rebuy补充积分:" 
          :required="false"
        >
          <el-input 
            v-model.number="editForm.signExtra.reubyExtra.reubyScores" 
            style="width: 200px;" 
            size="mini" 
            placeholder="请填写次数" 
          />
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1" 
          label="Rebuy操作时长(秒):" 
          :required="false"
        >
          <el-input 
            v-model.number="editForm.signExtra.reubyExtra.reubySecs" 
            style="width: 200px;" 
            size="mini" 
            placeholder="请填写时间" 
          />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1" 
          label="Rebuy次數:" 
          :required="false"
        >
          <el-input 
            v-model.number="editForm.signExtra.reubyExtra.reubyCount" 
            style="width: 200px;" 
            size="mini" 
            placeholder="请填写次数" 
          />
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item 
          v-if="editForm.signExtra.reubyExtra.supportRebuy===1" 
          label="Rebuy截止阶段:" 
          :required="false"
        >
          <el-select 
            v-model="editForm.signExtra.reubyExtra.reubyRound" 
            placeholder="请选择" 
            size="mini"
          >
            <el-option
              v-for="item in reubyGrowCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-form-item 
      v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && editForm.signExtra.reubyExtra.rebuySignType===3" 
      label="电子钱包报表是否上报:" 
      :required="true"
    >
      <el-radio-group v-model.number="editForm.signExtra.reubyExtra.walletReport">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </fieldset>
</template>

<script>
export default {
  name: 'RebuyConditionConfig',
  props: {
    editForm: {
      type: Object,
      required: true
    },
    rebuySignUpTypeCfgs: {
      type: Array,
      default: () => []
    },
    matchTicketsCfgs: {
      type: Array,
      default: () => []
    },
    reubyGrowCfgs: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    // 監聽是否支持 rebuy 的變化
    'editForm.signExtra.reubyExtra.supportRebuy': {
      handler(newVal, oldVal) {
        // 當從"是"(1)切換到"否"(0)時，重置所有 rebuy 相關數據
        if (oldVal === 1 && newVal === 0) {
          this.resetRebuyData()
        }
      },
      immediate: false
    }
  },
  methods: {
    // 重置 Rebuy 相关数据
    resetRebuyData() {
      // 重置所有 rebuy 相关字段为默认值
      this.editForm.signExtra.reubyExtra = {
        supportRebuy: 0,
        rebuySignType: 0,
        reubyFree: 0,
        reubyScore: 0,
        reubyCount: 0,
        reubyTime: 0,
        reubyGrow: 0,
        rebuyPropId: 0,
        rebuyPropType: 0,
        rebuyPropCost: 0,
        rebuyPropNum: 0,
        rebuyPropName: '',
        walletReport: 0
      }
    },

    // 處理 Rebuy 報名類型改變
    handleRebuySignTypeChange(value) {
      this.$emit('rebuy-sign-type-change', value)
    },

    // 處理 Rebuy 道具改變
    handleRebuyPropChange(value) {
      this.$emit('rebuy-prop-change', value)
    }
  }
}
</script>

<style scoped>
fieldset {
  margin: 20px auto;
  max-height: max-content;
  min-width: inherit;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-radio-group {
  margin-top: 5px;
}

.el-row {
  margin-bottom: 10px;
}
</style>
