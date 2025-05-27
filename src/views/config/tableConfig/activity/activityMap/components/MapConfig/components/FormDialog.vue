<template>
  <el-dialog title="添加/编辑配置" :visible.sync="dialogVisible" width="50%" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="配置ID" prop="ID" :rules="{ required: true, message: '请输入配置ID', trigger: 'blur' }">
        <el-input v-model="formData.ID" />
      </el-form-item>
      <el-form-item label="活动名称" prop="Name" :rules="{ required: true, message: '请输入活动名称', trigger: 'blur' }">
        <el-input v-model="formData.Name" />
      </el-form-item>
      <el-form-item label="活动金额" :rules="{ required: true, message: '请输入活动金额', trigger: 'blur' }">
        <el-input v-model.number="formData.Amount" />
      </el-form-item>
      <el-form-item label="分页" :rules="{ required: true, message: '请选择分页', trigger: 'blur' }">
        <el-select v-model="formData.Page" placeholder="请选择分页" multiple style="width: 360px;">
          <el-option v-for="option in pageOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动图标" :rules="{ required: true, message: '请选择活动图标', trigger: 'blur' }">
        <ImagePicker v-model="formData.Icon" />
      </el-form-item>
      <el-form-item label="插入位置" :rules="{ required: true, message: '请输入插入位置', trigger: 'blur' }">
        <el-input v-model.number="formData.Position" />
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
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
export default {
  components: {
    ImagePicker
  },
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
        Name: '',
        Amount: 0,
        Page: [],
        Icon: '',
        Position: 0
      },
      pageOptions: [
        { label: 'all', value: 'all' },
        { label: 'poker', value: 'poker' },
        { label: 'arcade', value: 'arcade' },
        { label: 'slot', value: 'slot' }
      ]
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
