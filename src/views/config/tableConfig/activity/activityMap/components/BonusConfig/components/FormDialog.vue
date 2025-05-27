<template>
  <el-dialog title="添加/编辑配置" :visible.sync="dialogVisible" width="50%" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="配置ID" prop="ID" :rules="{ required: true, message: '请输入配置ID', trigger: 'blur' }">
        <el-input v-model="formData.ID" />
      </el-form-item>
      <el-form-item label="年终大奖侧栏" :rules="{ required: true, message: '请输入年终大奖侧栏', trigger: 'blur' }">
        <el-input v-model.number="formData.Amount" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        ID: '',
        Sidebar: ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    updateData(newData) {
      if (newData) {
        this.formData = { ...newData }
      } else {
        this.resetForm()
      }
    },
    visible(val) {
      if (!val) {
        this.resetForm()
      }
    }
  },
  methods: {
    handleSave() {
      this.$emit('save', this.formData)
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        ID: '',
        Name: '',
        Amount: 0,
        Page: '',
        Icon: '',
        Position: 0
      }
      this.$emit('update:visible', false)
    },
    handleClose(reload = false) {
      this.resetForm()
      this.$emit('update:visible', false)
    }
  }
}
</script>
