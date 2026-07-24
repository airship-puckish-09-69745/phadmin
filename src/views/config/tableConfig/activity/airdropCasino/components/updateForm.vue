<template>
  <el-dialog
    :title="isEdit ? '编辑活动' : '新增活动'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基础配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 500px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间"
                                value-format="timestamp" style="width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间"
                                value-format="timestamp" style="width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="活动展示时间：" required>
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示时间"
                                value-format="timestamp" style="width: 200px"/>
              </el-form-item>
            </el-col>

            <el-col :span="24" :sm="12">
              <el-form-item label="站点白名单：" required>
                <SiteSelect v-model="item.whitelist.siteIdList" multiple placeholder="请选择"
                            style="width: 100%; max-width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="时间偏移：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 300px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 参与活动游戏选择 -->
          <el-row>
            <el-col :span="24">
              <GameSelector
                v-model="item.gameIdList"
                label="参与活动游戏："
                :category-ids="[3]"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务文本：">
                <el-input v-model="item.taskText" placeholder="请输入" style="max-width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务条件：">
                <el-input v-model.number="item.taskCondition" placeholder="请输入" style="max-width: 300px"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 宝箱配置表格 -->
          <el-row>

            <el-col :span="24">
              <el-form-item label="道具配置">
                <el-table
                  :data="[item.propPools]"
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
                      <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="道具上限" min-width="100">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.propLimit" placeholder="上限" size="mini"/>
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
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from 'element-ui'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import GameSelector from "@/components/Game/GameSelector.vue";

const ACTIVITY_ID = 33

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    showEndTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    whitelist: {siteIdList: []},
    debugTimeOffset: 0,
    taskText: '',
    taskCondition: 0,
    gameIdList: [],
    propPools: {
      propType: 5,
      propId: 0,
      propName: '',
      propTime: 1,
      propNum: 0,
      propLimit: 0
    }
  }
}

export default {
  name: 'UpdateForm',
  components: {GameSelector, SiteSelect},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      item: newItem(),
      dialogVisible: false,
      activeTab: 'activity',
      propList: [],
      propTypeOptions: [
        {'value': 5, 'label': 'SlotFreeSpin', disabled: false}
      ],
      propDayTypeOptions: [
        {'value': 1, 'label': '1天', disabled: false},
        {'value': 3, 'label': '3天', disabled: false},
        {'value': 7, 'label': '7天', disabled: false},
        {'value': 30, 'label': '30天', disabled: false},
      ]
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) return

      if (this.isEdit && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        this.item = newItem()
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    this.getPropList()
  },
  methods: {
    handleDialogClose() {
      this.$emit('close')
    },
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

    // 加载编辑数据（后端嵌套格式 -> 前端扁平格式）
    loadEditData() {
      const raw = JSON.parse(JSON.stringify(this.data))

      // activity / extend 可能仍是字符串（由 index.vue 解析后传入的是对象）
      const act = typeof raw.activity === 'string' ? JSON.parse(raw.activity) : (raw.activity || {})
      const ext = typeof raw.extend === 'string' ? JSON.parse(raw.extend) : (raw.extend || {})
      const whitelist = {
        siteIdList: (act.whitelist && Array.isArray(act.whitelist.siteIdList)) ? act.whitelist.siteIdList : (Array.isArray(act.siteIdList) ? act.siteIdList : [])
      }

      const parsedPropPools = this.safeJsonParse(ext.propPools, {})

      this.item = {
        id: raw.id || 0,
        activityId: ACTIVITY_ID,
        status: raw.status,
        modifyUser: raw.modifyUser,
        activityName: act.name || '',
        isOpen: act.isOpen !== undefined ? act.isOpen : true,
        // 时间：秒 -> 毫秒
        startTime: (act.startTime || 0) * 1000,
        endTime: (act.endTime || 0) * 1000,
        showEndTime: (act.showEndTime || 0) * 1000,
        debugTimeOffset: act.debugTimeOffset || 0,
        gameIdList: Array.isArray(act.gameIdList) ? act.gameIdList : [],
        whitelist,
        taskText: ext.taskText,
        taskCondition:(ext.taskCondition || 0) * 1000,
        propPools: parsedPropPools
      }
    },

    // 校验数据
    validateData() {
      if (!this.item.activityName) {
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
      if (!this.item.showEndTime) {
        Message.error('请选择展示时间')
        return false
      }
      if (!this.item.whitelist || !this.item.whitelist.siteIdList || this.item.whitelist.siteIdList.length <= 0) {
        Message.error('请选择站点白名单')
        return false
      }
      return true
    },

    // 处理提交数据（前端扁平格式 -> 后端嵌套格式）
    getPostData() {
      const d = this.item

      const activityObj = {
        name: d.activityName,
        activityId: ACTIVITY_ID,
        isOpen: d.isOpen,
        startTime: Math.floor(d.startTime / 1000),
        endTime: Math.floor(d.endTime / 1000),
        showEndTime: Math.floor(d.showEndTime / 1000),
        debugTimeOffset: d.debugTimeOffset,
        gameType: 3,// 默认类型
        whitelist: {
          siteIdList: (d.whitelist && Array.isArray(d.whitelist.siteIdList)) ? d.whitelist.siteIdList : []
        },
        gameIdList: d.gameIdList

      }

      const extendObj = {
        taskText: d.taskText,
        taskCondition: d.taskCondition ? Math.floor(d.taskCondition / 1000) : 0,
        propPools: d.propPools || []
      }

      return {
        id: d.id,
        activityId: ACTIVITY_ID,
        activity: JSON.stringify(activityObj),
        extend: JSON.stringify(extendObj)
      }
    },

    handleSave() {
      if (!this.validateData()) return
      const postData = this.getPostData()
      if (postData.id > 0) {
        this.handleUpdate(postData)
      } else {
        this.handleCreate(postData)
      }
    },

    handleCreate(postData) {
      request({
        url: '/activityconfig/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },

    handleUpdate(postData) {
      request({
        url: '/activityconfig/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      })
    },
    // ************************ 道具配置 ************************
    getPropList() {
      const $this = this
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: $this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.propList = []
            this.propList = objs.list
          }
        } else {
          this.propList = []
        }
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
