<template>
  <el-select v-model="smallGameLevel" size="mini" disabled @change="change">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left">{{ item.label }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SmallGameLevel',
  model: {
    prop: 'smallGameLevel',
    event: 'cc'
  },
  props: {
    smallGameLevel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options: [
        { label: '初级', value: 100000, desc: '>100' },
        { label: '中级', value: 1000000, desc: '>1000' },
        { label: '高级', value: 10000000, desc: '>10000' }
      ]
    }
  },
  methods: {
    change() {
      console.log('select game level ', this.smallGameLevel)
      this.$emit('cc', this.smallGameLevel)
    }
  }
}
</script>
