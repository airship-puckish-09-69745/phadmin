<template>
  <el-dialog title="添加机器人" :visible.sync="visible">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="初始资产" prop="money">
        <el-input v-model="form.money" type="number" autocomplete="off" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        account: '',
        password: '',
        confirmPassword: '',
        money: 0
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入初始资产', trigger: 'blur' },
          { type: 'number', message: '请输入数字值', trigger: 'blur' },
          { min: 0, message: '请输入大于0的数字', trigger: 'blur' },
          { max: 1000000, message: '请输入小于1000000的数字', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  methods: {
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.visible = false
          this.$emit('reload')
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
          this.$refs.formRef.resetFields()
        }
      })
    }
  }
}
</script>

