<template>
  <div class="user-type-selector">
    <!-- 参与活动用户类型选择 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="参与活动用户类型：" required>
          <el-select v-model="userTypeValue" placeholder="请选择" style="width:280px" @change="handleUserTypeChange">
            <el-option
              v-for="item in userTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 导入用户 -->
    <el-row v-if="showImportElement" :gutter="20">
      <el-col :span="24">
        <el-form-item label="导入用户：">
          <div>
            <span>已导入用户：{{ importedUidListCount }}</span>
            <span>（已生效用户：{{ importedUidCacheCount }}）</span>
            <span style="color: #0088ff">重复导入，不会覆盖原有的用户ID</span><br>
            <span style="color: red">注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！</span>
          </div>
          <el-upload
            ref="upload"
            drag
            :action="actionURL"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :with-credentials="true"
            :auto-upload="false"
            :limit="1"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处 或 <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              只能上传 text/csv 格式文件，且不超过10MB
            </div>
          </el-upload>
          <el-button class="ml-3" type="success" @click="submitUpload">
            上传用户ID数据
          </el-button>
          <el-button class="ml-3" type="danger" @click="handleDelImportedUid">
            重置已导入的用户ID
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 筛选用户条件 -->
    <el-row v-if="showUserFilterCondition" :gutter="20">
      <el-col :span="24">
        <el-form-item label="筛选用户条件：">
          <el-form label-width="120px" size="mini">
            <el-form-item label="用户注册时间：">
              <el-date-picker
                v-model="registerDateRangeValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                @change="handleRegisterDateChange"
              />
            </el-form-item>
            <el-form-item label="累计投注次数：">
              <el-col :span="6">
                <el-input
                  v-model.number="userFilterConditionValue.betTimesRange.min"
                  placeholder="输入最小投注次数"
                  oninput="if(value < 0 || value === '' || value === null){value = 0;}"
                />
              </el-col>
              <el-col :span="1">
                <div style="text-align: center">至</div>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model.number="userFilterConditionValue.betTimesRange.max"
                  placeholder="输入最大投注次数"
                  oninput="if(value < 0 || value === '' || value === null){value = 0;}"
                />
              </el-col>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 用户标签配置 -->
    <el-row v-if="showUserTagCondition" :gutter="20">
      <el-col :span="12">
        <el-form-item label="标签类型：">
          <el-select v-model="userFilterConditionValue.userTagConfig.tagType" placeholder="请选择标签类型" @change="handleTagTypeChange">
            <el-option
              v-for="item in userTagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="showUserTagCondition" :gutter="20">
      <el-col :span="12">
        <el-form-item label="标签子类：">
          <el-select v-model="userFilterConditionValue.userTagConfig.tagId" placeholder="请选择标签子类">
            <el-option
              v-for="item in userTagIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="showUserLevelCondition" :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户等级：">
          <el-select v-model="userFilterConditionValue.userTagConfig.tagValue" placeholder="请选择用户等级">
            <el-option
              v-for="item in userLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="showUserTagGameIntensityCondition" :gutter="20">
      <el-col :span="12">
        <el-form-item label="游戏强度：">
          <el-select v-model="userFilterConditionValue.userTagConfig.tagValue" placeholder="请选择游戏强度标签">
            <el-option
              v-for="item in userTagGameIntensityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'

export default {
  name: 'UserTypeSelector',
  props: {
    // v-model绑定的userTypes数组
    value: {
      type: Array,
      default: () => [2]
    },
    // 活动ID
    activityId: {
      type: Number,
      default: 0
    },
    // 活动展示结束时间
    showEndTime: {
      type: Number,
      default: 0
    },
    // 用户筛选条件
    userFilterCondition: {
      type: Object,
      default: () => ({
        registerTimeRange: { min: 0, max: 0 },
        betTimesRange: { min: 0, max: 0 },
        userTagConfig: { tagId: 0, tagValue: 1, tagType: 0 }
      })
    },
    // 注册时间范围
    registerDateRange: {
      type: Array,
      default: () => []
    },
    // 导入文件名
    importedFilename: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      env: store.getters.env || 'test',
      userTypeValue: 2,
      registerDateRangeValue: [],
      userFilterConditionValue: {
        registerTimeRange: { min: 0, max: 0 },
        betTimesRange: { min: 0, max: 0 },
        userTagConfig: { tagId: 0, tagValue: 1, tagType: 0 }
      },
      importedUidListCount: 0,
      importedUidCacheCount: 0,
      userTagIdOptions: [],

      // 用户类型选项
      userTypes: [
        { value: 1, label: '新增用户' },
        { value: 2, label: '所有用户' },
        { value: 3, label: '导入用户' },
        { value: 4, label: '筛选用户' },
        { value: 5, label: '用户标签' }
      ],

      // 用户标签类型
      userTagOptions: [
        { value: 2, label: '游戏强度', children: [{ value: 20000, label: '游戏强度' }] },
        { value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' },
            { value: 50005, label: '下注额度' },
            { value: 50006, label: '日均下注额度' },
            { value: 50003, label: '携带金额' }
          ]}
      ],

      // 游戏强度标签值
      userTagGameIntensityOptions: [
        { value: 0, label: '未选择' },
        { value: 1, label: '无感' },
        { value: 2, label: '尝试' },
        { value: 3, label: '常玩' },
        { value: 4, label: '核心' }
      ],

      // 用户等级
      userLevelOptions: [
        { value: 1, label: '轻度用户' },
        { value: 2, label: '中度用户' },
        { value: 3, label: '重度用户' }
      ]
    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    showImportElement() {
      return this.activityId > 0 && this.value.includes(3) // 3 导入用户
    },
    showUserFilterCondition() {
      return this.value.includes(4) // 4 筛选用户
    },
    showUserTagCondition() {
      return this.value.includes(5) // 5 用户标签
    },
    showUserTagGameIntensityCondition() {
      return this.value.includes(5) &&
        this.userFilterConditionValue.userTagConfig.tagType === 2 && // 2=游戏强度
        this.userFilterConditionValue.userTagConfig.tagId === 20000 // 20000=游戏强度
    },
    showUserLevelCondition() {
      const levelTagIds = [50005, 50006, 50003]
      return this.value.includes(5) &&
        levelTagIds.includes(this.userFilterConditionValue.userTagConfig.tagId)
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length > 0) {
          this.userTypeValue = val[0]
        }
      },
      immediate: true
    },
    userFilterCondition: {
      handler(val) {
        if (val) {
          this.userFilterConditionValue = JSON.parse(JSON.stringify(val))
        }
      },
      deep: true,
      immediate: true
    },
    registerDateRange: {
      handler(val) {
        this.registerDateRangeValue = val ? [...val] : []
      },
      immediate: true
    },
    userFilterConditionValue: {
      handler(val) {
        this.$emit('update:userFilterCondition', val)
      },
      deep: true
    }
  },
  mounted() {
    if (this.activityId > 0) {
      this.getImportedUidCacheCount()
    }
  },
  methods: {
    handleUserTypeChange(val) {
      this.$emit('input', [val])
      if (val !== 5) { // 用户标签
        this.userFilterConditionValue.userTagConfig.tagType = 0
        this.userFilterConditionValue.userTagConfig.tagId = 0
        this.userFilterConditionValue.userTagConfig.tagValue = 0
      }
    },
    handleRegisterDateChange(val) {
      this.$emit('update:registerDateRange', val)
    },
    handleTagTypeChange(tagType) {
      const tagOptions = this.userTagOptions.find(item => item.value === tagType)
      this.userTagIdOptions = tagOptions && tagOptions.children || []
      if (this.userFilterConditionValue.userTagConfig.tagType !== tagType && this.userTagIdOptions.length > 0) {
        this.userFilterConditionValue.userTagConfig.tagId = this.userTagIdOptions[0].value
      }
      if (tagType !== 2) { // 游戏强度标签
        this.userFilterConditionValue.userTagConfig.tagValue = 0
      }
    },
    getImportedUidCacheCount() {
      if (this.activityId === 0) {
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: this.activityId,
          Path: '/activity/airdrop/uid/import/count'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.importedUidCacheCount = response.Data
        }
      })
    },
    handleDelImportedUid() {
      this.$confirm('确定要重置已导入的用户id吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/uids/imported/delete',
          method: 'post',
          data: {
            Env: this.env,
            ActCfgId: this.activityId
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('已重置导入的用户id！')
            this.importedUidCacheCount = 0
            this.importedUidListCount = 0
            this.$emit('uid-imported-deleted')
          }
        })
      }).catch(() => {})
    },
    submitUpload() {
      if (this.showEndTime < new Date().getTime()) {
        this.$message.error('活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！')
        return
      }
      this.$refs.upload.submit()
    },
    handleBeforeUpload(file) {
      const isCsv = file.type === 'text/csv'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isCsv) {
        this.$message.error('上传的文件只能是 text/csv 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过10MB!')
        return false
      }
      return true
    },
    handleUploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      if (response.RetCode === 0) {
        const uploadedFilename = response.Data
        this.$emit('update:importedFilename', uploadedFilename)
        this.importData(uploadedFilename)
      }
    },
    importData(uploadedFilename) {
      request({
        url: '/airdropconfig/uids/import',
        method: 'post',
        timeout: 90000,
        data: {
          Env: this.env,
          ActCfgId: this.activityId,
          Filename: uploadedFilename
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('上传成功，新导入的数量为：' + response.Data.imported)
          if (this.activityId === 0) {
            this.importedUidCacheCount = response.Data.imported
          } else {
            this.getImportedUidCacheCount()
            this.$emit('uid-imported-success')
          }
        }
      })
    },
    // 初始化用户标签选项（用于编辑时调用）
    initUserTagOptions(tagType) {
      if (tagType) {
        this.handleTagTypeChange(tagType)
      }
    }
  }
}
</script>

<style scoped>
.user-type-selector {
  width: 100%;
}
.ml-3 {
  margin-left: 10px;
}
</style>
