<template>
  <div class="demo-input-suffix" style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; align-items: center;">
      <span style="width: 80px;">轻度用户：</span>
      <el-input
        placeholder="起始金额"
        v-model="light.start"
        size="mini"
        style="width: 120px; margin-right: 5px;"
      >
      </el-input>
      <span style="margin: 0 5px;">≤ {{ txtName }} <</span>
      <el-input
        placeholder="结束金额"
        v-model="light.end"
        size="mini"
        style="width: 120px;"
      >
      </el-input>
    </div>
    <div style="display: flex; align-items: center;">
      <span style="width: 80px;">中度用户：</span>
      <el-input
        placeholder="起始金额"
        v-model="medium.start"
        size="mini"
        style="width: 120px; margin-right: 5px;"
      >
      </el-input>
      <span style="margin: 0 5px;">≤ {{ txtName }} <</span>
      <el-input
        placeholder="结束金额"
        v-model="medium.end"
        size="mini"
        style="width: 120px;"
      >
      </el-input>
    </div>
    <div style="display: flex; align-items: center;">
      <span style="width: 80px;">重度用户：</span>
      <el-input
        placeholder="起始金额"
        v-model="heavy.start"
        size="mini"
        style="width: 120px; margin-right: 5px;"
      >
      </el-input>
      <span style="margin: 0 5px;">≤ {{ txtName }} <</span>
      <el-input
        placeholder="结束金额"
        v-model="heavy.end"
        size="mini"
        style="width: 120px;"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RangeConfig',
  props: {
    txtName: {
      type: String,
      required: true,
      default: () => ('下注次数')
    },
    light: {
      type: Object,
      required: true,
      default: () => ({ start: 0, end: 0 })
    },
    medium: {
      type: Object,
      required: true,
      default: () => ({ start: 0, end: 0 })
    },
    heavy: {
      type: Object,
      required: true,
      default: () => ({ start: 0, end: 0 })
    }
  },
  watch: {
    light: {
      deep: true,
      handler(newVal) {
        this.$emit('update:light', { ...newVal })
      }
    },
    medium: {
      deep: true,
      handler(newVal) {
        this.$emit('update:medium', { ...newVal })
      }
    },
    heavy: {
      deep: true,
      handler(newVal) {
        this.$emit('update:heavy', { ...newVal })
      }
    }
  }
}
</script>

<style scoped>
/* 可以在这里添加组件的样式 */
</style>