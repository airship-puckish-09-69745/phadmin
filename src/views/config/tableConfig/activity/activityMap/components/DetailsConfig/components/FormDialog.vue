<template>
  <el-dialog title="添加/编辑配置" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="活动名称" required>
        <el-select v-model="formData.ActivityId" placeholder="请选择活动" style="width: 360px;" @change="onChangeActivityId">
          <el-option v-for="option in activityOptions" :key="option.id" :label="`${option.name}-${option.id}`" :value="option.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动金额" :rules="{ required: true, message: '请输入活动金额', trigger: 'blur' }">
        <el-input v-model="formData.Amount" type="number" />
      </el-form-item>
      <el-form-item label="活动图标" :rules="{ required: true, message: '请选择活动图标', trigger: 'blur' }">
        <ImagePicker v-model="formData.Icon" />
      </el-form-item>
      <el-form-item label="头像框" :rules="{ required: true, message: '请选择头像框', trigger: 'blur' }">
        <ImagePicker v-model="formData.Avatar" />
      </el-form-item>
      <el-form-item label="玩法简要" prop="Description" :rules="{ required: true, message: '请输入玩法简要', trigger: 'blur' }">
        <el-input v-model="formData.Description" type="textarea" />
      </el-form-item>
      <el-form-item label="活动时间" prop="ActivityTime" :rules="{ required: true, message: '请选择活动时间', trigger: 'blur' }">
        <el-date-picker v-model="formData.ActivityTime" value-format="timestamp" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="成就个数" prop="AchievementNumber" :rules="{ required: true, message: '请输入成就个数', trigger: 'blur' }">
        <el-input v-model.number="formData.AchievementNumber" />
      </el-form-item>
      <el-form-item label="成就名称" prop="AchievementName" :rules="{ required: true, message: '请输入成就名称', trigger: 'blur' }">
        <el-input v-model="formData.AchievementName" />
      </el-form-item>
      <el-form-item label="成就完成条件" prop="AchievementCondition" :rules="{ required: true, message: '请输入成就完成条件', trigger: 'blur' }">
        <el-input v-model="formData.AchievementCondition" type="textarea" />
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
      // 和index列表组件保持一致的表单数据结构
      formData: {
        ID: '',
        ActivityId: '',
        ActivityName: '',
        Amount: 0,
        Icon: '',
        Avatar: '',
        Description: '',
        ActivityTime: [],
        AchievementNumber: 0,
        AchievementName: '',
        AchievementCondition: ''
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
        this.formData.ActivityTime = [
          newData.ActivityTime[0] * 1000,
          newData.ActivityTime[1] * 1000
        ]
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
      console.log('onChangeActivityId', val, this.formData.ActivityName)
    },
    handleSave() {
      if (!this.formData.ActivityName) {
        this.$message.error('请选择活动名称')
        return
      }
      const { ...submitData } = this.formData
      // 日期/1000
      submitData.ActivityTime = [
        Math.floor(submitData.ActivityTime[0] / 1000),
        Math.floor(submitData.ActivityTime[1] / 1000)
      ]
      this.$emit('save', submitData)
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        ID: '',
        ActivityId: '',
        ActivityName: '',
        Amount: 0,
        Icon: '',
        Avatar: '',
        Description: '',
        ActivityTime: '',
        AchievementNumber: 0,
        AchievementName: '',
        AchievementCondition: ''
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
