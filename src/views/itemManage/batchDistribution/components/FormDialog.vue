<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="900px"
    :before-close="onClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="id类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">厅方id</el-radio>
          <el-radio :label="2">平台账号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="粘贴id">
        <el-input v-model="form.count" type="textarea" placeholder="此处粘贴id，各id用英文,隔开" rows="5" />
      </el-form-item>
      <el-form-item label="道具类型">
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
          <el-input v-model="form.remark" type="number" placeholder="请输入道具数量" style="width: calc(100% - 80px);"/>
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
        remark: ''
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
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
