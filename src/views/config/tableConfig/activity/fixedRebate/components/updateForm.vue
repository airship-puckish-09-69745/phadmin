<template>
  <el-dialog
    :title="isEdit ? '编辑固定反水活动' : '新增固定反水活动'"
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
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="活动展示时间：" required>
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示时间" value-format="timestamp" style="width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="返水比例：" required>
                <el-input v-model="item.ratio" placeholder="返水比例" style="max-width: 200px">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="当日玩家个人奖励上限：" required>
                <el-input v-model.number="item.userDayPrizeThreshold" placeholder="当日玩家个人奖励上限" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="解锁活动有效下注：" required>
                <el-input v-model.number="item.effectiveBet" placeholder="解锁活动有效下注" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="最低领取的返水奖励：" required>
                <el-input v-model.number="item.minReward" placeholder="最低领取的返水奖励" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日发奖上限：" required>
                <el-input v-model.number="item.dayPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时会在Lark同步报警
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="最大发奖总上限：" required>
                <el-input v-model.number="item.totalPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时会在Lark同步报警
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="item.whitelist.siteIdList" multiple placeholder="请选择" style="width: 100%; max-width: 300px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 参与活动游戏选择 -->
          <el-row>
            <el-col :span="24">
              <GameSelector v-model="item.gameIdCfg" label="参与活动游戏：" :category-ids="[1]"/>
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
import { Message } from 'element-ui'
import request from '@/utils/request'
import SiteSelect from '@/components/SiteSelect/index.vue'
import GameSelector from '@/components/Game/GameSelector.vue'

const ACTIVITY_ID = 28

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    showEndTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    gameIdCfg: [],
    whitelist: { siteIdList: [] },
    ratio: 0,
    userDayPrizeThreshold: 10,
    effectiveBet: 1,
    minReward: 1,
    dayPrizeThreshold: 0,
    totalPrizeThreshold: 0
  }
}

export default {
  name: 'UpdateForm',
  components: { SiteSelect, GameSelector },
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
      activeTab: 'activity'
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
  methods: {
    handleDialogClose() {
      this.$emit('close')
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
        gameIdCfg: Array.isArray(act.gameIdList) ? act.gameIdList : [],
        whitelist,
        ratio: (ext.ratio || 0) / 100,
        userDayPrizeThreshold: (ext.userDayPrizeThreshold || 0) / 1000,
        effectiveBet: (ext.effectiveBet || 0) / 1000,
        minReward: (ext.minReward || 0) / 1000,
        dayPrizeThreshold: (ext.dayPrizeThreshold || 0) / 1000,
        totalPrizeThreshold: (ext.totalPrizeThreshold || 0) / 1000
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
      if (!this.item.ratio || this.item.ratio <= 0) {
        Message.error('请输入返水比例（大于0）')
        return false
      }
      if (!this.item.userDayPrizeThreshold || this.item.userDayPrizeThreshold <= 0) {
        Message.error('请输入当日玩家个人奖励上限（大于0）')
        return false
      }
      if (!this.item.effectiveBet || this.item.effectiveBet <= 0) {
        Message.error('请输入解锁活动有效下注（大于0）')
        return false
      }
      if (!this.item.gameIdCfg || this.item.gameIdCfg.length <= 0) {
        Message.error('请选择参与活动的游戏')
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
        gameIdList: d.gameIdCfg.map(v => Number(v)),
        whitelist: {
          siteIdList: (d.whitelist && Array.isArray(d.whitelist.siteIdList)) ? d.whitelist.siteIdList : []
        }
      }

      const extendObj = {
        ratio: Math.floor(d.ratio * 100),
        userDayPrizeThreshold: Math.floor(d.userDayPrizeThreshold * 1000),
        effectiveBet: Math.floor(d.effectiveBet * 1000),
        minReward: Math.floor((d.minReward || 0) * 1000),
        dayPrizeThreshold: Math.floor((d.dayPrizeThreshold || 0) * 1000),
        totalPrizeThreshold: Math.floor((d.totalPrizeThreshold || 0) * 1000)
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
    }
  }
}
</script>
