<template>
  <div class="app-container">
    <el-form-item v-if="actType == 3" label="DEMO">
      <el-input v-model="txt" placeholder="placeholder" @change="change" />
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    data: String,
    activityType: Number
  },
  data() {
    return {
      txt: '',
      actType: 0
    }
  },
  watch: {
    activityType: function() {
      this.actType = this.activityType
    }
  },
  created() {
    this.actType = this.activityType
  },
  methods: {
    change() {
      this.data = this.txt
      this.$emit('input', this.data)
    }
  }
}
</script>
