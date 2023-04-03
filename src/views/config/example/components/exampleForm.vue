<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="placeholder" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder="placeholder" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveData">提交数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  // 指令
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        address: ''
      }
    }
  },
  created() {
    if (this.isEdit) {
      // 如果是编辑，拉取数据
      this.getData()
    }
  },
  methods: {
    getData() {
      this.form = {
        name: 'name',
        address: 'value'
      }
      console.log('pull data')
    },
    saveData() {
      console.log('submit data', this.form)
    }
  }
}
</script>
