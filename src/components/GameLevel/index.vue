<template>
  <el-form-item label="等级：" :required="true">
    <el-select v-model="gameLevel" size="mini" @change="change">
      <el-option label="菜鸟" :value="1" />
      <el-option label="业余" :value="2" />
      <el-option label="中间" :value="3" />
      <el-option label="优越" :value="4" />
      <el-option label="大师" :value="5" />
      <el-option label="专家" :value="6" />
    </el-select>

  </el-form-item>
</template>

<script>
export default {
  name: 'GameLevel',
  model: {
    prop: 'gameLevel',
    event: 'cc'
  },
  props: {
    gameLevel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options: []
    }
  },
  methods: {
    change() {
      console.log('select game level ', this.gameLevel)
      this.$emit('cc', this.gameLevel)
    }
  }
}
</script>
