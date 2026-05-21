<template>
  <el-dialog
    :title="isEdit ? '编辑活动' : '新增活动'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ========== 活动配置 ========== -->
      <el-tab-pane label="活动配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="活动名称" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="item.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间" required>
                <el-date-picker
                  v-model="item.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="时间偏移">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px" />
              </el-form-item>
            </el-col>
            <!-- 站点白名单 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="站点白名单">
                <SiteSelect
                  v-model="item.whitelistCfg.siteIdList"
                  multiple
                  placeholder="请选择"
                  style="width: 100%; max-width: 400px"
                />
              </el-form-item>
            </el-col>

            <!-- 宝箱配置表格 -->
            <el-col :span="24">
              <el-form-item label="道具配置">
                <el-table
                  :data="[editItem.propPools]"
                  border
                  size="small"
                  style="width: 100%"
                >
                  <el-table-column label="道具类型" min-width="140">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propType"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                        @change="handlePropTypeChange(scope.row)"
                      >
                        <el-option
                          v-for="opt in propTypeOptions"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="道具名称" min-width="140">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propId"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                        @change="handlePropNameChange(scope.row)"
                      >
                        <el-option
                          v-for="opt in getPropOptionsByType(scope.row.propType)"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="可用时间" min-width="120">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propTime"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="opt in propDayTypeOptions"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="道具数量" min-width="100">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'

function createNewItem() {
  return {
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    debugTimeOffset: 0,
    whitelistCfg: {
      siteIdList: []
    },
    propPools: {
      propType: 2,
      propId: 0,
      propName: '',
      propTime: 1,
      propNum: 0
    },
    status: 6
  }
}

export default {
  components: { SiteSelect },
  props: {
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    editData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'activity',
      item: createNewItem(),
      propList: [],
      propTypeOptions: [
        { value: 2, label: '头像框', disabled: false },
      ],
      propDayTypeOptions: [
        { value: 1, label: '1天', disabled: false },
        { value: 3, label: '3天', disabled: false },
        { value: 7, label: '7天', disabled: false },
        { value: 30, label: '30天', disabled: false }
      ]
    }
  },
  computed: {
    editItem() {
      return this.item
    },
    env() {
      return store.getters.env || 'prod'
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.activeTab = 'activity'
        if (this.isEdit && Object.keys(this.editData).length > 0) {
          this.loadEditData()
        } else {
          this.item = createNewItem()
        }
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  created() {
    this.getPropList()
  },
  methods: {
    safeJsonParse(val, defaultValue) {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val)
        } catch (e) {
          return defaultValue
        }
      }
      if (val === undefined || val === null) {
        return defaultValue
      }
      return val
    },
    handleDialogClose() {
      this.item = createNewItem()
    },
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.editData))
      data.whitelistCfg = this.safeJsonParse(data.whitelistCfg, { siteIdList: [] })
      if (!data.whitelistCfg || typeof data.whitelistCfg !== 'object') {
        data.whitelistCfg = { siteIdList: [] }
      }
      data.whitelistCfg.siteIdList = this.safeJsonParse(data.whitelistCfg.siteIdList, [])
      const parsedPropPools = this.safeJsonParse(data.propPools, {})
      data.propPools = parsedPropPools && typeof parsedPropPools === 'object'
        ? parsedPropPools
        : createNewItem().propPools

      if (data.startTime) data.startTime *= 1000
      if (data.endTime) data.endTime *= 1000
      if (!data.propPools.propType) data.propPools.propType = 2
      if (!data.propPools.propTime) data.propPools.propTime = 1
      if (!data.propPools.propNum) data.propPools.propNum = 0
      data.propPools.propName = data.propPools.propName || ''
      data.debugTimeOffset = data.debugTimeOffset || 0

      this.item = {
        ...createNewItem(),
        ...data
      }
    },
    validate() {
      if (!this.item.activityName || this.item.activityName.trim() === '') {
        Message.error('请输入活动名称')
        return false
      }
      if (!this.item.startTime) {
        Message.error('请选择开始时间')
        return false
      }
      if (!this.item.endTime) {
        Message.error('请选择结束时间')
        return false
      }
      if (this.item.startTime >= this.item.endTime) {
        Message.error('结束时间必须大于开始时间')
        return false
      }
      if (!this.item.propPools || !this.item.propPools.propId) {
        Message.error('请选择道具名称')
        return false
      }
      if (!Number(this.item.propPools.propNum) || Number(this.item.propPools.propNum) <= 0) {
        Message.error('道具数量需大于0')
        return false
      }
      return true
    },
    encodeData() {
      const cpy = JSON.parse(JSON.stringify(this.item))
      cpy.startTime = Math.floor(cpy.startTime / 1000)
      cpy.endTime = Math.floor(cpy.endTime / 1000)
      cpy.whitelistCfg = JSON.stringify(cpy.whitelistCfg || { siteIdList: [] })
      cpy.propPools = JSON.stringify(cpy.propPools || {})
      cpy.debugTimeOffset = Number(cpy.debugTimeOffset || 0)
      return cpy
    },
    handleSave() {
      if (!this.validate()) return
      const postData = this.encodeData()
      if (this.isEdit) {
        this.handleEditData(postData)
      } else {
        postData.status = 6
        this.handleAddData(postData)
      }
    },
    handleEditData(postData) {
      request({ url: '/anniversaryactivity/update', method: 'post', data: postData }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        } else {
          Message.error(response.ErrMsg || '保存失败，请稍后重试')
        }
      }).catch(() => {
        Message.error('保存失败，请稍后重试')
      })
    },
    handleAddData(postData) {
      request({ url: '/anniversaryactivity/create', method: 'post', data: postData }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        } else {
          Message.error(response.ErrMsg || '保存失败，请稍后重试')
        }
      }).catch(() => {
        Message.error('保存失败，请稍后重试')
      })
    },
    getPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.propList = objs.list || []
          } else {
            this.propList = []
          }
        } else {
          this.propList = []
        }
      }).catch(() => {
        this.propList = []
        Message.error('道具列表加载失败，请稍后重试')
      })
    },
    handlePropTypeChange(row) {
      row.propId = 0
      row.propName = ''
    },
    handlePropNameChange(row) {
      const options = this.getPropOptionsByType(row.propType)
      const selected = options.find(opt => opt.value === row.propId)
      if (selected) {
        row.propName = selected.label
      }
    },
    getPropOptionsByType(propType) {
      const propOptions = []
      const currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        const prop = this.propList[i]
        if (prop.item_type === propType && prop.status === 1) {
          if (prop.item_type !== 2 && prop.item_type !== 4 && prop.item_type !== 5) {
            const expTime = prop.expire_time * 1000
            if (currTime < expTime) {
              propOptions.push({
                value: prop.id,
                label: prop.item_name,
                disabled: false
              })
            }
          } else {
            propOptions.push({
              value: prop.id,
              label: prop.item_name,
              disabled: false
            })
          }
        }
      }
      return propOptions
    }
  }
}
</script>
