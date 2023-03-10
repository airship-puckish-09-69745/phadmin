<template>
  <el-form-item label="等级：" :required="true">
    <el-select v-model="gameLevel" size="mini" @change="change">
      <el-option label="初级" :value="1" />
      <el-option label="中级" :value="2" />
      <el-option label="高级" :value="3" />
      <el-option label="超级" :value="4" />
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
