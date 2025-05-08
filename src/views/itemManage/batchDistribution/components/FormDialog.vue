<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="900px"
    :before-close="onClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="id类型" required>
        <el-radio-group v-model="form.type">
          <el-radio :label="1">厅方id</el-radio>
          <el-radio :label="2">平台账号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="粘贴id" required>
        <el-input v-model="form.id" type="textarea" placeholder="此处粘贴id，各id用英文,隔开" rows="5" />
      </el-form-item>
      <el-form-item label="道具类型" required>
        <el-select v-model="form.type" placeholder="请选择道具类型">
          <el-option
            v-for="item in itemTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="form-item-item">
          道具：
          <el-select v-model="form.type" placeholder="请选择道具类型">
            <el-option
              v-for="item in itemTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="form-item-item">
          数量：
          <el-input v-model="form.remark" type="number" placeholder="请输入道具数量" style="width: calc(100% - 80px);" />
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model.number="form.count" type="textarea" placeholder="此发放用于什么活动" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose()">取 消</el-button>
      <el-button type="primary" @click="onSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '批量发放'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        type: '',
        count: '',
        remark: '',
        id: ''
      },
      itemTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false }
      ]
    }
  },
  methods: {
    /**
     * 提交先进行前端表单校验
     * 然后调用后端接口进行校验
     */
    onSubmit() {
      if (this.checkoutForm()) {
        this.checkoutId()
          .then(() => {
            // 提交后端接口
            this.$message.success('提交成功')
            this.onClose()
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onCancel() {
      this.onClose()
    },
    onClose() {
      this.onReset()
      this.$emit('close')
    },
    /**
     * 校验表单各项输入
     */
    checkoutForm() {
      if (!this.form.type) {
        this.$message.error('请选择道具类型')
        return false
      } else if (!this.form.id) {
        this.$message.error('请输入id')
        return false
      } else if (!this.form.count) {
        this.$message.error('请输入道具数量')
        return false
      } else if (this.form.count <= 0) {
        this.$message.error('道具数量必须大于0')
        return false
      } else if (!this.form.remark) {
        this.$message.error('请输入备注')
        return false
      }
      return true
    },
    /**
     * 检查输入的id是否符合要求
     * 前端校验是否含有中文逗号，如果有则提示错误
     * 前端检验完成之后，提交后端会再次校验
     */
    async checkoutId() {
      return new Promise((resolve, reject) => {
        if (this.form.id.includes('，')) {
          this.$message.error('请使用英文逗号分隔id')
          reject(new Error('请使用英文逗号分隔id'))
        } else {
          // 通过后端接口进一步校验
          resolve()
        }
      })
    }
  }
}
</script>

<style scoped>
.form-item-item {
  display: inline-block;
  width: 250px;
  margin-left: 12px;
}
</style>
