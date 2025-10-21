<template>
  <el-select v-model="selectedValue" v-bind="$attrs" @change="handleChange" >
    <el-option v-if="showAll" value="" label="全部"></el-option>
    <el-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :label="option.label"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'AppIdSelector',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: 'GP-BP测试1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        }
      ],
      selectedValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal
    }
  },
  methods: {
    handleChange() {
      this.$emit('input', this.selectedValue)
    }
  }
}
</script>
