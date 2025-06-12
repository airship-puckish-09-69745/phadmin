<template>
  <el-dialog :title="updateData && updateData.ID ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="年终大奖初始奖金" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
        <el-input v-model="formData.InitBonus" type="number" />
      </el-form-item>
      <el-form-item label="活动值转化比例" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
        <el-input v-model="formData.ActivityTransformRate" type="number" />
      </el-form-item>
      <el-form-item label="奖金增加转化比例" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
        <el-input v-model="formData.IncreaseTransformRate" type="number" />
      </el-form-item>
      <el-form-item label="年终奖保底奖金" :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
        <el-input v-model="formData.GuaranteedBonus" type="number" />
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
        InitBonus: 0, // 年终大奖初始奖金
        GuaranteedBonus: 0, // 年终奖保底奖金
        ActivityTransformRate: 0, // 活动值转化比例
        IncreaseTransformRate: 0 // 奖金增加转化比例
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
    onSearch() {
      this.$emit('reload')
    },
    handleSave() {
      this.formData.InitBonus = parseInt(this.formData.InitBonus)
      this.$emit('save', this.formData)
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        ID: '',
        InitBonus: 0
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
