<template>
  <el-select v-model="selectedValue" v-bind="$attrs" @change="handleChange" >
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
  name: 'SiteSelector',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    },
    useNumberValue: {
      type: Boolean,
      default: false
    },
    showCP: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        { value: 'BP', label: 'BP', numericValue: 1 },
        { value: 'AP', label: 'AP', numericValue: 2 },
        { value: 'GP', label: 'GP', numericValue: 3 },
        { value: 'PG', label: 'PG', numericValue: 4 },
        { value: 'Dev', label: 'Dev', numericValue: 5 },
        // { value: 'SP', label: 'SP', numericValue: 12 },
        { value: 'CP', label: 'CP', numericValue: 16 }
      ],
      selectedValue: this.value
    }
  },
  computed: {
    displayOptions() {
      return this.options.map(option => ({
        value: this.useNumberValue ? option.numericValue : option.value,
        label: option.label
      })).filter(option => this.showCP || option.value !== 'CP')
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
