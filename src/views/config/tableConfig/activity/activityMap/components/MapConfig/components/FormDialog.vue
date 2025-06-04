<template>
  <el-dialog title="添加/编辑配置" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="活动名称" required>
        <!-- <el-input v-model="formData.Name" /> -->
        <el-select v-model="formData.ActivityId" placeholder="请选择活动" style="width: 360px;" @change="onChangeActivityId">
          <el-option v-for="option in activityOptions" :key="option.id" :label="`${option.name}-${option.id}`" :value="option.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动金额" required>
        <el-input v-model="formData.Amount" type="number" />
      </el-form-item>
      <el-form-item label="活动时间" prop="ActivityTime" :rules="{ required: true, message: '请选择活动时间', trigger: 'blur' }">
        <el-date-picker v-model="formData.ActivityTime" value-format="timestamp" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="分页" required>
        <el-select v-model="formData.Page" placeholder="请选择分页" multiple style="width: 360px;">
          <el-option v-for="option in pageOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动图标" required>
        <ImagePicker v-model="formData.Icon" />
      </el-form-item>
      <el-form-item label="插入位置" required>
        x:<el-input v-model.number="formData.Position.x" placeholder="X坐标" style="width: 150px; margin-right: 10px;" />
        y:<el-input v-model.number="formData.Position.y" placeholder="Y坐标" style="width: 150px;" />
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
    },
    activityOptions: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        ID: '',
        ActivityName: '',
        ActivityId: '',
        Amount: 0,
        Page: [],
        Icon: '',
        ActivityTime: [],
        Position: {
          x: 0,
          y: 0
        }
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
        // 如果有ActivityId，则更新ActivityName
        this.onChangeActivityId(newData.ActivityId)
        // 日期转为毫秒数
        this.formData.ActivityTime = newData.ActivityTime.map(time => time * 1000)
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
    onChangeActivityId(val) {
      const selectedActivity = this.activityOptions.find(option => option.id === val)
      this.formData.ActivityName = selectedActivity ? selectedActivity.name : ''
    },
    /**
     * 校验表单数据
     */
    checkoutForm() {
      // console.log('checkoutForm', this.formData)
      if (!this.formData.ActivityName) {
        this.$message.error('活动名称不能为空')
        return false
      }
      if (this.formData.Amount <= 0) {
        this.$message.error('活动金额必须大于0')
        return false
      }
      if (this.formData.Page.length === 0) {
        this.$message.error('请选择分页')
        return false
      }
      if (!this.formData.Icon) {
        this.$message.error('活动图标不能为空')
        return false
      }
      if (this.formData.Position.x === '' || this.formData.Position.y === '') {
        this.$message.error('插入位置的X和Y坐标不能为空')
        return false
      }
      return true
    },
    handleSave() {
      if (!this.checkoutForm()) {
        return
      }
      const { ...formData } = this.formData
      // 日期/1000
      formData.ActivityTime = formData.ActivityTime.map(time => time / 1000)

      this.$emit('update', formData)
      this.handleClose()
    },
    resetForm() {
      this.formData = {
        ID: '',
        ActivityName: '',
        ActivityId: '',
        Amount: 0,
        Page: [],
        Icon: '',
        ActivityTime: [],
        Position: {
          x: 0,
          y: 0
        }
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
