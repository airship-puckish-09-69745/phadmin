<template>
  <el-dialog
    :title="isEdit ? '编辑活动配置' : '新增活动配置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基础配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.activity.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activity.name" placeholder="请输入活动名称" style="max-width: 300px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间：" required>
                <el-date-picker v-model="item.activity.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width:  200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间：" required>
                <el-date-picker v-model="item.activity.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24">
              <el-form-item label="每日开启时间：" required>
                <el-time-select
                  v-model="dayStartTime"
                  placeholder="起始时间"
                  :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59'
                  }"
                  @change="handleDayStartTimeChange"
                />
                至
                <el-time-select
                  v-model="dayEndTime"
                  placeholder="结束时间"
                  :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59',
                    minTime: dayStartTime
                  }"
                  @change="handleDayEndTimeChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24">
              <el-form-item label="每日发奖金额阈值：" required>
                <el-input v-model.number="item.extend.dayPrizeThreshold" placeholder="每日发奖金额阈值" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 参与活动场次：多选枚举 -->
            <el-col :xs="24" :sm="24">
              <el-form-item label="参与活动场次：">
                <el-select
                  v-model="item.extend.smallBlindList"
                  multiple
                  placeholder="请选择参与场次"
                  style="max-width: 400px"
                  @change="handleSmallBlindChange"
                >
                  <el-option
                    v-for="opt in ACTIVITY_SMALL_BLIND_ENUMS"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <!-- 任务配置 -->
      <el-tab-pane label="任务配置" name="taskConfigs">
        <div v-for="(sbCfg, index) in item.extend.smallBlindConfigs" :key="index" style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 16px;">
            <el-button
              :disabled="sbCfg.taskConfigs.length >= 20"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addTaskRow(sbCfg)"
            >
              添加任务({{ sbCfg.taskConfigs.length }}/20)
            </el-button>
            <span style="color: red">盲注级别：{{ sbCfg.smallBlind / 1000 }}</span>
          </div>
          <el-table :data="sbCfg.taskConfigs" style="width: 100%">
            <el-table-column prop="taskId" label="任务序号" />
            <el-table-column prop="taskTarget" label="要求（牌局数）">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.taskTarget" placeholder="请输入要求（牌局数）" />
              </template>
            </el-table-column>
            <el-table-column prop="mapNum" label="宝藏图数量">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.mapNum" placeholder="请输入宝藏图数量" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index > 0"
                  circle
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteTaskRow(sbCfg, scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- 开奖地图配置 -->
      <el-tab-pane label="开奖地图配置" name="drawMapConfigs">
        <div style="margin-bottom: 5px; display: flex; align-items: center; gap: 16px;">
          <el-button
            :disabled="item.extend.drawMapConfigs.length >= 20"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="addDrawMapRow"
          >添加开奖地图({{ item.extend.drawMapConfigs.length }}/20)
          </el-button>
          每日开启时间：{{ dayStartTime }} 至 {{ dayEndTime }}<span style="color: red">（注意：最后一轮的开奖时间必须与每日开启时间的结束时间相吻合）</span>
        </div>
        <el-table :data="item.extend.drawMapConfigs" style="width: 100%">
          <el-table-column prop="drawMapId" label="地图序号" width="100px" />
          <el-table-column prop="drawTime" label="开奖时间" width="260px">
            <template slot-scope="scope">
              <el-time-select
                v-model="scope.row.drawTimeStr"
                placeholder="开奖时间"
                :picker-options="timePickerOptions"
              />
            </template>
          </el-table-column>
          <el-table-column prop="drawNum" label="开奖数量">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.drawNum" placeholder="请输入开奖数量" />
            </template>
          </el-table-column>
          <el-table-column prop="drawAmount" label="奖励金额">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.drawAmount" placeholder="请输入奖励金额" style="max-width: 200px" />
            </template>
          </el-table-column>
          <el-table-column prop="islandIconNo" label="海岛图标编号">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.islandIconNo" placeholder="请输入海岛图标编号" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="50">
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index > 0"
                circle
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteDrawMapRow(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="白名单配置" name="whitelist">
        <el-form label-width="180px" size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="selectedSiteId" placeholder="请选择" style="width: 100%; max-width: 300px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleSave">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import { $libShow } from '@/utils/common'

const ACTIVITY_ID = 31
const GAME_ID = 32

// 参与活动场次枚举（扑克盲注级别）
const ACTIVITY_SMALL_BLIND_ENUMS = [
  { value: 2500, label: '2.5/5' },
  { value: 5000, label: '5/10' },
  { value: 10000, label: '10/20' },
  { value: 25000, label: '25/50' },
  { value: 50000, label: '50/100' },
  { value: 100000, label: '100/200' }
]

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activity: {
      name: '',
      activityId: ACTIVITY_ID,
      isOpen: true,
      startTime: Date.now(),
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      showEndTime: Date.now() + 8 * 24 * 60 * 60 * 1000,
      gameIdList: [GAME_ID],
      whitelist: {
        siteIdList: []
      }
    },
    extend: {
      dayPrizeThreshold: 0,
      smallBlindConfigs: [],
      drawMapConfigs: []
    }
  }
}

function newTask(taskId) {
  return {
    taskId: taskId,
    taskTarget: 1,
    mapNum: 0
  }
}

function newSmallBlind(smallBlind) {
  return {
    smallBlind: smallBlind,
    taskConfigs: [
      newTask(1)
    ]
  }
}

function newDrawMap(drawMapId) {
  return {
    drawTime: 0,
    drawMapId: drawMapId,
    drawNum: 0,
    drawAmount: 0,
    islandIconNo: 0
  }
}

export default {
  name: 'UpdateForm',
  components: { SiteSelect },
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
    },
    propList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      libShow: $libShow,
      item: newItem(),
      ACTIVITY_SMALL_BLIND_ENUMS: ACTIVITY_SMALL_BLIND_ENUMS,
      dialogVisible: false,
      activeTab: 'activity',
      smallBlindList: [],
      smallBlindConfigs: [],
      drawMapConfigs: [],
      dayStartTime: '',
      dayEndTime: '',
      timePickerOptions: {
        start: '00:00',
        step: '00:01',
        end: '23:59'
      },
      selectedSiteId: ''
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) {
        return
      }

      // 编辑模式下，加载数据
      if (this.isEdit && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        // 新增模式下，初始化数据
        this.item = newItem()
        this.dayStartTime = ''
        this.dayEndTime = ''
        // 初始化任务配置列表
        this.item.extend.smallBlindConfigs = []
        // 初始化抽奖地图配置列表
        this.item.extend.drawMapConfigs = [
          newDrawMap(1)
        ]
        this.selectedSiteId = ''
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 关闭弹窗
    handleDialogClose() {
      this.$emit('close')
    },
    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.data))

      // 时间：秒 -> 毫秒
      data.activity.startTime *= 1000
      data.activity.endTime *= 1000
      data.activity.showEndTime *= 1000

      // 每日开启时间，将时间格式化为HH:mm
      this.dayStartTime = new Date(data.extend.dayStartTime).Format('HH:mm')
      this.dayEndTime = new Date(data.extend.dayEndTime).Format('HH:mm')
      this.handleDayStartTimeChange()
      this.handleDayEndTimeChange()

      // 每日任务奖励阈值缩小1000倍
      data.extend.dayPrizeThreshold = Math.floor(data.extend.dayPrizeThreshold / 1000)
      // 抽奖地图配置，时间：秒 -> 毫秒
      data.extend.drawMapConfigs.forEach(item => {
        item.drawTime = Math.floor(item.drawTime * 1000)
        item.drawTimeStr = new Date(item.drawTime).Format('HH:mm')
        item.drawAmount = Math.floor(item.drawAmount / 1000)
      })

      // 白名单
      if (!data.activity.whitelist) {
        data.activity.whitelist = {
          siteIdList: []
        }
      }
      if (!Array.isArray(data.activity.whitelist.siteIdList)) data.activity.whitelist.siteIdList = []
      this.selectedSiteId = data.activity.whitelist.siteIdList[0] || ''

      // 赋值给item
      this.item = data
    },
    // 校验数据
    validateData() {
      if (!this.item.activity.name) {
        Message.error('请输入活动名称')
        return false
      }
      if (!this.item.activity.startTime) {
        Message.error('请选择开始时间')
        return false
      }
      if (!this.item.activity.endTime) {
        Message.error('请选择结束时间')
        return false
      }
      if (!this.dayStartTime || !this.dayEndTime) {
        Message.error('请选择每日开奖时间区间')
        return false
      }
      if (!this.selectedSiteId) {
        Message.error('请选择站点白名单')
        return false
      }
      if (!this.item.extend.dayPrizeThreshold || this.item.extend.dayPrizeThreshold <= 0) {
        Message.error('请输入每日任务奖励阈值（大于0）')
        return false
      }
      if (!this.item.extend.smallBlindList || !this.item.extend.smallBlindList.length) {
        Message.error('请配置盲注列表')
        return false
      }
      if (!this.item.extend.smallBlindConfigs || !this.item.extend.smallBlindConfigs.length) {
        Message.error('请配置任务列表')
        return false
      }
      for (let i = 0; i < this.item.extend.smallBlindConfigs.length; i++) {
        const blindConfig = this.item.extend.smallBlindConfigs[i]
        const blind = blindConfig.smallBlind / 1000
        const taskConfigs = blindConfig.taskConfigs || []
        if (taskConfigs.length === 0) {
          Message.error('请配置盲注[' + blind + ']的任务的任务')
          return false
        }
        if (taskConfigs.some(task => task.taskTarget <= 0)) {
          Message.error('请配置盲注[' + blind + ']的要求牌局数（必须大于0）')
          return false
        }
        if (taskConfigs.some(task => task.mapNum <= 0)) {
          Message.error('请配置盲注[' + blind + ']的宝藏图数量（必须大于0）')
          return false
        }
      }
      if (!this.item.extend.drawMapConfigs.length) {
        Message.error('请配置开奖地图配置')
        return false
      }
      for (let i = 0; i < this.item.extend.drawMapConfigs.length; i++) {
        const drawMapConfig = this.item.extend.drawMapConfigs[i]
        const drawTimeStr = drawMapConfig.drawTimeStr
        if (!drawMapConfig.drawTimeStr) {
          Message.error('请配置开奖地图序号[' + (i + 1) + ']的开奖时间')
          return false
        }
        if (drawMapConfig.drawNum <= 0) {
          Message.error('请配置开奖地图序号[' + (i + 1) + ']-[' + drawTimeStr + ']的开奖数量（必须大于0）')
          return false
        }
        if (drawMapConfig.drawAmount <= 0) {
          Message.error('请配置开奖地图序号[' + (i + 1) + ']-[' + drawTimeStr + ']的奖励金额（必须大于0）')
          return false
        }
      }
      // 校验开奖时间是否重复
      const drawTimes = this.item.extend.drawMapConfigs.map(item => item.drawTimeStr)
      if (drawTimes.some((item, index) => drawTimes.indexOf(item) !== index)) {
        Message.error('开奖时间不能重复')
        return false
      }
      // 校验开奖时间是否与每日开启时间的结束时间相吻合
      const lastDrawTime = this.item.extend.drawMapConfigs[this.item.extend.drawMapConfigs.length - 1].drawTimeStr
      if (lastDrawTime !== this.dayEndTime) {
        Message.error('最后一轮的开奖时间必须与每日开启时间的结束时间相吻合')
        return false
      }
      return true
    },
    // 时间字符串转换为时间戳
    timeStringToTimestamp(timeString) {
      const time = new Date(this.item.activity.startTime).Format('yyyy-MM-dd')
      return Date.parse(time + 'T' + timeString + ':00')
    },
    // 处理提交数据（前端展示格式 -> 后端数据）
    getPostData() {
      const data = JSON.parse(JSON.stringify(this.item))

      // 时间：毫秒 -> 秒
      data.activity.startTime = Math.floor(data.activity.startTime / 1000)
      data.activity.endTime = Math.floor(data.activity.endTime / 1000)
      data.activity.showEndTime = Math.floor(data.activity.showEndTime / 1000)
      data.activity.gameIdList = [GAME_ID]

      // 每日开奖时间，将时间格式化为时间戳
      data.extend.dayStartTime = this.timeStringToTimestamp(this.dayStartTime)
      data.extend.dayEndTime = this.timeStringToTimestamp(this.dayEndTime)

      // 每日任务奖励阈值放大1000倍
      data.extend.dayPrizeThreshold = Math.floor(data.extend.dayPrizeThreshold * 1000)
      // 抽奖地图配置，时间：毫秒 -> 秒
      data.extend.drawMapConfigs.forEach(item => {
        item.drawTime = Math.floor(this.timeStringToTimestamp(item.drawTimeStr) / 1000)
        item.drawAmount = Math.floor(item.drawAmount * 1000)
      })

      // 白名单
      if (!data.activity.whitelist) {
        data.activity.whitelist = {
          siteIdList: []
        }
      }
      data.activity.whitelist.siteIdList = [this.selectedSiteId]

      // 赋值给item
      this.item = data
      const ret = { ...data }
      ret.activity = JSON.stringify(data.activity)
      ret.extend = JSON.stringify(data.extend)

      return ret
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
      const url = '/activityconfig/create'
      request({
        url: url,
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
      const url = '/activityconfig/update'
      request({
        url: url,
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
    // 添加开奖地图行
    addDrawMapRow() {
      const row = newDrawMap(this.item.extend.drawMapConfigs.length + 1)
      this.item.extend.drawMapConfigs.push(row)
    },
    // 删除开奖地图行
    deleteDrawMapRow(index) {
      this.item.extend.drawMapConfigs.splice(index, 1)
      this.item.extend.drawMapConfigs.forEach((item, index) => {
        item.drawMapId = index + 1
      })
    },
    // 添加任务行
    addTaskRow(smallBlindConfig) {
      const row = newTask(smallBlindConfig.taskConfigs.length + 1)
      smallBlindConfig.taskConfigs.push(row)
    },
    // 删除任务行
    deleteTaskRow(smallBlindConfig, index) {
      smallBlindConfig.taskConfigs.splice(index, 1)
      smallBlindConfig.taskConfigs.forEach((item, index) => {
        item.taskId = index + 1
      })
    },
    // 注盲注列表改变时，更新盲注任务列表
    handleSmallBlindChange(smallBlindList) {
      console.log('small盲注列表改变时，更新盲注任务列表', smallBlindList)
      // 找出新增的盲注
      const newBlinds = smallBlindList.filter(blind => !this.item.extend.smallBlindConfigs.find(cfg => cfg.smallBlind === blind))
      if (newBlinds.length) {
        // 为新增盲注添加任务
        newBlinds.forEach(blind => {
          this.item.extend.smallBlindConfigs.push(newSmallBlind(blind))
        })
      }
      // 保留选中的盲注任务
      this.item.extend.smallBlindConfigs = this.item.extend.smallBlindConfigs.filter(cfg => smallBlindList.includes(cfg.smallBlind))
      // 按盲注排序任务
      this.item.extend.smallBlindConfigs.sort((a, b) => a.smallBlind - b.smallBlind)
    },
    // 处理每日开奖时间改变
    handleDayStartTimeChange() {
      this.timePickerOptions.start = this.dayStartTime
    },
    // 处理每日开奖时间改变
    handleDayEndTimeChange() {
      this.timePickerOptions.end = this.dayEndTime
    }
  }
}

</script>

<style scoped>

</style>
