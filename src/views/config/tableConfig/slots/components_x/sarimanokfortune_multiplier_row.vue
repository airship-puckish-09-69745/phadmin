<template>
  <el-form :model="row" label-width="230px" style="margin-top: 10px">
    <el-form-item v-if="tip" label="">
      <span style="color:#909399">{{ tip }}</span>
    </el-form-item>
    <el-form-item label="图标权重（固定顺序：倍数,NUDGE）">
      <el-input v-model="row.IconWeight" placeholder="100,100" />
    </el-form-item>
    <el-form-item label="倍数权重">
      <el-input v-model="row.MultiplierWeight" placeholder="100,100,100" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SarimanokFortuneMultiplierRow',
  props: {
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    tip: {
      type: String,
      default: ''
    }
  }
}
</script>
