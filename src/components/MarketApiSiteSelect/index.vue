<template>
  <el-select v-model="selectedValue" v-bind="$attrs" @change="handleChange">
    <el-option
      v-for="option in displayOptions"
      :key="option.value"
      :value="option.value"
      :label="option.label"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MarketApiSiteSelector',
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
        { value: 'ALL', label: 'ALL' },
        { value: 'BP', label: 'BP' },
        { value: 'GP', label: 'GP' },
        // { value: 'Dev', label: 'Dev' }
      ],
      selectedValue: this.value
    }
  },
  computed: {
    displayOptions() {
      return this.options.map(option => ({
        value: option.value,
        label: option.label
      }))
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
      // 触发 change 事件
      this.$emit('change', this.selectedValue)
    }
  }
}
</script>
