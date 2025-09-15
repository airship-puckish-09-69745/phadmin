<template>
  <fieldset>
    <legend>報名條件</legend>
    <el-form-item label="報名條件：" :required="true">
      <el-select 
        v-model="editForm.data.signUpType" 
        placeholder="請選擇" 
        size="mini" 
        @change="handleSignUpTypeChange"
      >
        <el-option
          v-for="item in signUpTypeCfgs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item 
      v-if="editForm.data.signUpType == 0 || editForm.data.signUpType == 3" 
      label="報名費：" 
      :required="true"
    >
      <el-input 
        v-model.number="editForm.data.signUpNum" 
        style="width: 200px;" 
        size="mini" 
        placeholder="請填寫金幣數量" 
      />
    </el-form-item>

    <el-form-item 
      v-if="editForm.data.signUpType == 2 || editForm.data.signUpType == 3" 
      label="門票：" 
      :required="true"
    >
      <el-select 
        v-model="editForm.signExtra.propId" 
        placeholder="請選擇" 
        size="mini"
        @change="handlePropChange"
      >
        <el-option
          v-for="item in matchTicketsCfgs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item 
      v-if="editForm.data.signUpType == 2 || editForm.data.signUpType == 3" 
      label="門票數量：" 
      :required="true"
    >
      <el-input 
        v-model.number="editForm.signExtra.propNum" 
        style="width: 180px;" 
        size="mini" 
        placeholder="請填寫門票數量" 
      />
    </el-form-item>

    <el-form-item 
      v-if="editForm.data.signUpType == 1" 
      label="今日投注下限(0不限制)：" 
      :required="true"
    >
      <el-input 
        v-model.number="editForm.signExtra.betCnt" 
        style="width: 200px;" 
        size="mini" 
        placeholder="請填寫限制數值" 
      />
    </el-form-item>

    <el-form-item 
      v-if="editForm.data.signUpType == 1" 
      label="是否启用每日限制：" 
      :required="true"
    >
      <el-switch
        v-model="editForm.data.openDaysLimit"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>
    
    <el-form-item label="比賽最大人數：" :required="true">
      <el-input 
        v-model.number="editForm.signExtra.matchMaxLimit" 
        style="width: 180px;" 
        size="mini" 
        placeholder="請填寫最大數量" 
      />
    </el-form-item>

    <el-form-item 
      v-if="editForm.data.signUpType === 3" 
      label="電子錢包報表是否上報:" 
      :required="true"
    >
      <el-radio-group v-model.number="editForm.signExtra.walletReport">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </fieldset>
</template>

<script>
export default {
  name: 'SignUpConditionConfig',
  props: {
    editForm: {
      type: Object,
      required: true
    },
    signUpTypeCfgs: {
      type: Array,
      default: () => []
    },
    matchTicketsCfgs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 處理報名類型改變
    handleSignUpTypeChange(value) {
      this.$emit('sign-up-type-change', value)
    },

    // 處理道具改變
    handlePropChange(value) {
      this.$emit('prop-change', value)
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
</style>
