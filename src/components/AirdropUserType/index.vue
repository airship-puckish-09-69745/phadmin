<template>
  <div class="airdrop-user-type">
    <!-- 用户类型选择 -->
    <el-form-item label="参与活动用户类型：" required>
      <el-select v-model="currentUserType" placeholder="请选择" style="width: 280px" @change="onUserTypeChange">
        <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </el-form-item>

    <!-- 导入用户 -->
    <template v-if="isImportUsers">
      <el-form-item label="导入用户：">
        <div>
          <span>已导入用户：{{ importedUidCacheCount }}</span>
          <span style="margin-left: 8px; color: #0088ff">重复导入不会覆盖原有的用户ID</span>
        </div>
        <div style="margin-top: 4px; color: #e6a23c; font-size: 12px">
          注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！
        </div>
        <el-upload
          v-if="activityCfgId > 0"
          ref="upload"
          drag
          :action="actionURL"
          accept=".csv,text/csv"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload"
          :with-credentials="true"
          :auto-upload="false"
          :limit="1"
          style="margin-top: 8px"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将文件拖到此处 或 <em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传 text/csv 格式文件，且不超过10MB</div>
        </el-upload>
        <div v-if="activityCfgId > 0" style="margin-top: 8px">
          <el-button type="success" size="small" @click="submitUpload">上传用户ID数据</el-button>
          <el-button type="danger" size="small" style="margin-left: 8px" @click="delImportedUid">重置已导入的用户ID</el-button>
        </div>
        <div v-else style="color: #909399; font-size: 12px; margin-top: 4px">请先保存活动后再导入用户</div>
      </el-form-item>
    </template>

    <!-- 筛选用户 -->
    <template v-if="isFilterUsers">
      <el-form-item label="用户注册时间：">
        <el-date-picker
          v-model="registerDateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
          @change="onRegisterDateChange"
        />
      </el-form-item>
      <el-form-item label="累计投注次数：">
        <el-input
          v-model.number="localValue.userFilterCondition.betTimesRange.min"
          placeholder="最小投注次数"
          style="width: 150px"
          oninput="if(value<0||value===''){value=0}"
        />
        <span style="margin: 0 8px">至</span>
        <el-input
          v-model.number="localValue.userFilterCondition.betTimesRange.max"
          placeholder="最大投注次数"
          style="width: 150px"
          oninput="if(value<0||value===''){value=0}"
        />
      </el-form-item>
    </template>

    <!-- 用户标签 -->
    <template v-if="isTagUsers">
      <el-form-item label="标签类型：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagType" placeholder="请选择标签类型" @change="onTagTypeChange">
          <el-option v-for="item in userTagOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签子类：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagId" placeholder="请选择标签子类" @change="onTagIdChange">
          <el-option v-for="item in tagIdOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showUserLevelCondition" label="用户等级：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagValue" placeholder="请选择用户等级">
          <el-option v-for="item in userLevelOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showGameIntensityCondition" label="游戏强度：">
        <el-select v-model="localValue.userFilterCondition.userTagConfig.tagValue" placeholder="请选择游戏强度">
          <el-option v-for="item in userTagGameIntensityOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

function defaultUserFilterCondition() {
  return {
    registerTimeRange: { min: 0, max: 0 },
    betTimesRange: { min: 0, max: 0 },
    userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
  }
}

export default {
  name: 'AirdropUserType',
  props: {
    value: {
      type: Object,
      default: () => ({
        userTypes: [2],
        userFilterCondition: defaultUserFilterCondition(),
        importedFilename: ''
      })
    },
    activityCfgId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentUserType: 2,
      importedUidCacheCount: 0,
      registerDateRange: [],
      tagIdOptions: [],
      userTypeOptions: [
        { value: 1, label: '新增用户' },
        { value: 2, label: '所有用户' },
        { value: 3, label: '导入用户' },
        { value: 4, label: '筛选用户' },
        { value: 5, label: '用户标签' }
      ],
      userTagOptions: [
        { value: 2, label: '游戏强度', children: [{ value: 20000, label: '游戏强度' }] },
        {
          value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' },
            { value: 50005, label: '下注额度' },
            { value: 50006, label: '日均下注额度' },
            { value: 50003, label: '携带金额' }
          ]
        }
      ],
      userTagGameIntensityOptions: [
        { value: 0, label: '未选择' },
        { value: 1, label: '无感' },
        { value: 2, label: '尝试' },
        { value: 3, label: '常玩' },
        { value: 4, label: '核心' }
      ],
      userLevelOptions: [
        { value: 1, label: '轻度用户' },
        { value: 2, label: '中度用户' },
        { value: 3, label: '重度用户' }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date(); const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date(); const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    localValue() {
      return this.value
    },
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    isImportUsers() {
      return this.currentUserType === 3
    },
    isFilterUsers() {
      return this.currentUserType === 4
    },
    isTagUsers() {
      return this.currentUserType === 5
    },
    showUserLevelCondition() {
      const levelTagIds = [50005, 50006, 50003]
      return this.isTagUsers && levelTagIds.includes(this.localValue.userFilterCondition.userTagConfig.tagId)
    },
    showGameIntensityCondition() {
      return this.isTagUsers &&
        this.localValue.userFilterCondition.userTagConfig.tagType === 2 &&
        this.localValue.userFilterCondition.userTagConfig.tagId === 20000
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) return
        this.currentUserType = (val.userTypes && val.userTypes.length > 0) ? val.userTypes[0] : 2
        // 初始化注册时间范围
        const cond = val.userFilterCondition || {}
        const rtr = cond.registerTimeRange || {}
        if (rtr.min && rtr.max) {
          this.registerDateRange = [rtr.min * 1000, rtr.max * 1000]
        }
        // 初始化标签选项
        if (cond.userTagConfig && cond.userTagConfig.tagType) {
          this.onTagTypeChange(cond.userTagConfig.tagType)
        }
      }
    },
    activityCfgId: {
      immediate: true,
      handler(val) {
        if (val > 0) {
          this.getImportedUidCacheCount()
        }
      }
    }
  },
  methods: {
    emitChange() {
      this.$emit('input', {
        ...this.localValue,
        userTypes: [this.currentUserType]
      })
    },
    onUserTypeChange(val) {
      this.currentUserType = val
      if (val !== 5) {
        this.localValue.userFilterCondition.userTagConfig = { tagType: 0, tagId: 0, tagValue: 0 }
      }
      this.emitChange()
    },
    onRegisterDateChange(range) {
      const min = range ? Math.floor(range[0] / 1000) : 0
      const endOfDay = range ? new Date(range[1]).setHours(23, 59, 59, 0) : 0
      const max = range ? Math.floor(endOfDay / 1000) : 0
      this.localValue.userFilterCondition.registerTimeRange = { min, max }
      this.emitChange()
    },
    onTagTypeChange(tagType) {
      const found = this.userTagOptions.find(item => item.value === tagType)
      this.tagIdOptions = (found && found.children) || []
      if (this.localValue.userFilterCondition.userTagConfig.tagType !== tagType && this.tagIdOptions.length > 0) {
        this.localValue.userFilterCondition.userTagConfig.tagId = this.tagIdOptions[0].value
      }
      this.localValue.userFilterCondition.userTagConfig.tagType = tagType
      this.emitChange()
    },
    onTagIdChange() {
      this.localValue.userFilterCondition.userTagConfig.tagValue = 0
      this.emitChange()
    },
    getImportedUidCacheCount() {
      if (!this.activityCfgId) return
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: { ActCfgId: this.activityCfgId, Path: '/activity/airdrop/uid/import/count' }
      }).then(res => {
        if (res.RetCode === 0) {
          this.importedUidCacheCount = res.Data || 0
        }
      })
    },
    handleBeforeUpload(file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        Message.error('只能上传 CSV 格式文件')
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        Message.error('文件不能超过 10MB')
        return false
      }
      return true
    },
    submitUpload() {
      if (this.$refs.upload) {
        this.$refs.upload.submit()
      }
    },
    handleUploadSuccess(res, file) {
      if (res && res.RetCode === 0) {
        Message.success('用户ID数据上传成功！')
        const updated = { ...this.localValue, importedFilename: file.name }
        this.$emit('input', updated)
        this.getImportedUidCacheCount()
      } else {
        Message.error((res && res.Message) || '上传失败')
      }
    },
    delImportedUid() {
      this.$confirm('确定要重置已导入的用户id吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/uids/imported/delete',
          method: 'post',
          data: { ActCfgId: this.activityCfgId }
        }).then(res => {
          if (res.RetCode === 0) {
            Message.success('已重置导入的用户id！')
            this.importedUidCacheCount = 0
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.airdrop-user-type {
  width: 100%;
}
</style>
