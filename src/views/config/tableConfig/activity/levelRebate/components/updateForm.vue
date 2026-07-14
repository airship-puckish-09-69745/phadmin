<template>
  <el-dialog
    :title="isEdit ? '编辑阶段性反水活动' : '新增阶段性反水活动'"
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
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="活动展示时间：" required>
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示时间" value-format="timestamp" style="width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="当日玩家个人奖励上限：" required>
                <el-input v-model.number="item.maxRewardAmount" placeholder="当日玩家个人奖励上限" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :sm="12">
              <el-form-item label="站点白名单：">
                <SiteSelect v-model="item.whitelist.siteIdList" multiple placeholder="请选择" style="width: 100%; max-width: 200px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日发奖上限：" required>
                <el-input v-model.number="item.userDayPrizeThreshold" placeholder="请输入" style="max-width: 200px">
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
          </el-row>
          <!-- 参与活动游戏选择 -->
          <el-row>
            <el-col :span="24">
              <GameSelector
                v-model="item.gameIdCfg"
                label="参与活动游戏："
                :category-ids="[1]"
              />
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- 阶段性反水比例配置 -->
      <el-tab-pane label="反水阶梯配置" name="rewardTiers">
        <div style="margin-bottom: 12px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            :disabled="item.rewardTiers.length >= 20"
            @click="addTier"
          >
            添加阶梯（最多20行）
          </el-button>
          <span style="margin-left: 12px; color: #909399; font-size: 13px">
            当前 {{ item.rewardTiers.length }} 行，最少1行，最多20行
          </span>
        </div>
        <el-table
          :data="item.rewardTiers"
          border
          stripe
          size="small"
          style="width: 100%"
        >
          <el-table-column label="#" type="index" width="50" align="center" />
          <el-table-column label="累计下注（₱）" min-width="160">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.bet"
                type="number"
                :min="0"
                size="mini"
                placeholder="下注（0表示不限）"
              />
            </template>
          </el-table-column>
          <el-table-column label="反水比例（%）" min-width="130">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.ratio"
                type="number"
                :min="0"
                size="mini"
                placeholder="反水比例"
              >
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                :disabled="item.rewardTiers.length <= 1"
                @click="removeTier(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
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

const ACTIVITY_ID = 29

function newTier() {
  return { bet: 0, ratio: 0 }
}

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
    maxRewardAmount: 10,
    minReward: 1,
    userDayPrizeThreshold: 0,
    totalPrizeThreshold: 0,
    rewardTiers: [newTier()]
  }
}

export default {
  name: 'PhasedUpdateForm',
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
      const act = typeof raw.activity === 'string' ? JSON.parse(raw.activity) : (raw.activity || {})
      const ext = typeof raw.extend === 'string' ? JSON.parse(raw.extend) : (raw.extend || {})
      // 反水阶梯：/1000 还原金额和比例
      let rewardTiers = Array.isArray(ext.rewardTiers) ? ext.rewardTiers : [newTier()]
      rewardTiers = rewardTiers.map(t => ({
        bet: (t.bet || 0) / 1000,
        ratio: (t.ratio || 0) / 100,
      }))
      if (rewardTiers.length === 0) rewardTiers = [newTier()]

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
        startTime: (act.startTime || 0) * 1000,
        endTime: (act.endTime || 0) * 1000,
        showEndTime: (act.showEndTime || 0) * 1000,
        gameIdCfg: Array.isArray(act.gameIdList) ? act.gameIdList : [],
        whitelist,
        maxRewardAmount: (ext.maxRewardAmount || 0) / 1000,
        minReward: (ext.minReward || 0) / 1000,
        userDayPrizeThreshold: (ext.userDayPrizeThreshold || 0) / 1000,
        totalPrizeThreshold: (ext.totalPrizeThreshold || 0) / 1000,
        rewardTiers
      }
    },

    // 添加反水阶梯行
    addTier() {
      if (this.item.rewardTiers.length >= 20) {
        Message.warning('最多只能添加20行')
        return
      }
      this.item.rewardTiers.push(newTier())
    },

    // 删除反水阶梯行
    removeTier(index) {
      if (this.item.rewardTiers.length <= 1) {
        Message.warning('至少保留1行')
        return
      }
      this.item.rewardTiers.splice(index, 1)
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
      if (!this.item.maxRewardAmount || this.item.maxRewardAmount <= 0) {
        Message.error('请输入当日玩家个人奖励上限（大于0）')
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
      if (!this.item.rewardTiers || this.item.rewardTiers.length === 0) {
        Message.error('请至少配置一条反水阶梯')
        return false
      }
      for (let i = 0; i < this.item.rewardTiers.length; i++) {
        const t = this.item.rewardTiers[i]
        if (t.bet < 0) {
          Message.error(`第${i + 1}行：下注金额不能为负数`)
          return false
        }
        if (!t.ratio || t.ratio <= 0) {
          Message.error(`第${i + 1}行：反水比例必须大于0`)
          return false
        }
      }
      return true
    },

    // 处理提交数据（前端扁平格式 -> 后端嵌套格式）
    getPostData() {
      const d = this.item

      // 说明：反水阶梯 rewardTiers 存放在 extend 中，其他业务字段放在 activity 中
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
        // 奖励相关配置（以千分位保存）
        maxRewardAmount: Math.floor(d.maxRewardAmount * 1000),
        minReward: Math.floor((d.minReward || 0) * 1000),
        userDayPrizeThreshold: Math.floor((d.userDayPrizeThreshold || 0) * 1000),
        totalPrizeThreshold: Math.floor((d.totalPrizeThreshold || 0) * 1000),
        rewardTiers: d.rewardTiers.map(t => ({
          bet: Math.floor((t.bet || 0) * 1000),
          ratio: Math.floor((t.ratio || 0) * 100),
        }))
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

<style scoped>
/* 居中表单标签和输入文字 */
.el-form-item__label {
  text-align: center;
}

/* 让所有 el-input 的文字和 placeholder 居中 */
.el-input__inner {
  text-align: center;
}

/* 日期选择器和选择器默认使用 .el-input__inner，因此上面的规则生效。
   针对表格内的紧凑输入也强制居中 */
.el-table .el-input__inner {
  text-align: center;
}

/* 小屏幕下标签仍居中显示 */
@media (max-width: 600px) {
  .el-form-item__label {
    text-align: center;
  }
}
</style>
