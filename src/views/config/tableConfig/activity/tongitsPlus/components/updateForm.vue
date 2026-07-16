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
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日活动开始时间：" required>
                <el-date-picker v-model="item.dailyStartTime" type="datetime" placeholder="选择开始时间" format="HH:mm"
                                size="mini" style="width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日活动结束时间：" required>
                <el-date-picker v-model="item.dailyEndTime" type="datetime" placeholder="选择结束时间" format="HH:mm"
                                size="mini" style="width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日发奖上限：" required>
                <el-input v-model.number="item.dayPrizeThreshold" placeholder="请输入" style="max-width: 300px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时会在Lark同步报警
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="最大发奖总上限：" required>
                <el-input v-model.number="item.totalPrizeThreshold" placeholder="请输入" style="max-width: 300px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  达到上限时会在Lark同步报警
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="时间偏移：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 300px"/>
              </el-form-item>
            </el-col>

            <el-col :span="24" :sm="12">
              <el-form-item label="站点白名单：" required>
                <SiteSelect v-model="item.whitelist.siteIdList" multiple placeholder="请选择"
                            style="width: 100%; max-width: 300px"/>
              </el-form-item>
            </el-col>

            <!-- 参与活动场次：多选枚举 -->
            <el-col :xs="24">
              <el-form-item label="参与活动场次：" required>
                <el-select
                  v-model="item.winGameCount"
                  multiple
                  placeholder="请选择参与场次"
                  style="width: 100%; max-width: 500px"
                >
                  <el-option
                    v-for="opt in item.activitySessionEnum"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 宝箱配置表格 -->
            <el-col :span="24">
              <el-form-item label="宝箱配置：">
                <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 16px;">
                  <el-button
                    :disabled="item.treasureCfg.length >= 20"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addTreasureRow"
                  >添加档位({{ item.treasureCfg.length }}/20)
                  </el-button>
                </div>
                <el-table
                  :data="item.treasureCfg"
                  border
                  size="mini"
                  style="width: 100%; max-width: 900px"
                >
                  <el-table-column label="宝箱序号" align="center">
                    <template slot-scope="scope">
                      <el-input-number
                        v-model="scope.row.id"
                        :min="1"
                        :precision="0"
                        size="mini"
                        style="width: 100%; text-align: center"
                        disabled
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="领取金额" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model.number="scope.row.claimAmount"
                        :required="true"
                        prop="claimAmount"
                        :min="1"
                        :precision="0"
                        size="mini"
                        style="text-align: center"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="要求局数" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model.number="scope.row.gameCount"
                        :required="true"
                        prop="gameCount"
                        :min="1"
                        :precision="0"
                        size="mini"
                        style="text-align: center"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="反水率" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.ratio"
                        prop="ratio"
                        :min="1"
                        :precision="0"
                        size="mini"
                        style="text-align: center"
                      />
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
                        @click="deleteTreasureRow(scope.$index)"
                      />
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

const ACTIVITY_ID = 30

function newItem() {
  return {
    id: 0,
    activityId: ACTIVITY_ID,
    activityName: '',
    isOpen: true,
    startTime: Date.now(),
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    dailyStartTime: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
    dailyEndTime: new Date(new Date().setDate(new Date().getDate() + 30)).setHours(23, 59, 59, 999),
    whitelist: {siteIdList: []},
    dayPrizeThreshold: 0,
    totalPrizeThreshold: 0,
    debugTimeOffset: 0,
    activitySessionEnum: [
      {value: '2500', label: '2.5/5'},
      {value: '5000', label: '5/10'},
      {value: '10000', label: '10/20'},
      {value: '25000', label: '25/50'},
      {value: '50000', label: '50/100'},
      {value: '100000', label: '100/200'}
    ],
    winGameCount: [], // 参与活动场次（盲注级别）
    treasureCfg: [{id: 1, claimAmount: '', gameCount: '', ratio: ''}] // 宝箱配置表格
  }
}

export default {
  name: 'UpdateForm',
  components: {SiteSelect},
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

      // 参与活动场次 - JSON字符串 -> 数组
      if (typeof ext.winGameCount === 'string') {
        try {
          const parsed = JSON.parse(ext.winGameCount)
          ext.winGameCount = Array.isArray(parsed) ? parsed : []
        } catch (e) {
          ext.winGameCount = []
        }
      }
      if (!Array.isArray(ext.winGameCount)) ext.winGameCount = []
      if (typeof ext.treasureCfg === 'string') {
        ext.treasureCfg = JSON.parse(ext.treasureCfg)
      }
      if (Array.isArray(ext.treasureCfg)) {
        ext.treasureCfg = ext.treasureCfg.map((row, i) => ({
          ...row,
          id: i + 1,
          claimAmount: Math.floor((row.claimAmount || 0) / 1000),
          ratio: ((row.ratio || 0) / 100).toFixed(2)
        }))
      }
      console.log(ext.treasureCfg)
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
        dailyStartTime: (act.dailyStartTime || 0) * 1000,
        dailyEndTime: (act.dailyEndTime || 0) * 1000,
        debugTimeOffset: act.debugTimeOffset || 0,
        whitelist,
        dayPrizeThreshold: (ext.dayPrizeThreshold || 0) / 1000,
        totalPrizeThreshold: (ext.totalPrizeThreshold || 0) / 1000,
        winGameCount: ext.winGameCount || [],
        treasureCfg: Array.isArray(ext.treasureCfg) && ext.treasureCfg.length > 0 ? ext.treasureCfg : [{
          id: 1,
          claimAmount: '',
          gameCount: '',
          ratio: ''
        }]
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
      if (!this.item.dailyStartTime) {
        Message.error('请选择每日开始时间')
        return false
      }
      if (!this.item.dailyEndTime) {
        Message.error('请选择每日结束时间')
        return false
      }
      if (!this.item.whitelist || !this.item.whitelist.siteIdList || this.item.whitelist.siteIdList.length <= 0) {
        Message.error('请选择站点白名单')
        return false
      }
      if (!this.item.winGameCount || !Array.isArray(this.item.winGameCount) || this.item.winGameCount.length <= 0) {
        Message.error('请选择参与活动场次')
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
        dailyStartTime: Math.floor(d.dailyStartTime / 1000),
        dailyEndTime: Math.floor(d.dailyEndTime / 1000),
        debugTimeOffset: d.debugTimeOffset,
        whitelist: {
          siteIdList: (d.whitelist && Array.isArray(d.whitelist.siteIdList)) ? d.whitelist.siteIdList : []
        }
      }

      // 宝箱配置领取金额 claimAmount 元转分
      if (Array.isArray(d.treasureCfg)) {
        d.treasureCfg.forEach(row => {
          row.claimAmount = Math.floor((row.claimAmount || 0) * 1000)
          row.ratio = (row.ratio || 0) / 100
        })
      }

      const extendObj = {
        // 参与活动场次 -> JSON字符串
        winGameCount: JSON.stringify(d.winGameCount || []),
        treasureCfg: JSON.stringify(d.treasureCfg || []),
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
    },
    // ---- 宝箱配置表格操作 ----
    reindexTreasure() {
      this.item.treasureCfg.forEach((row, i) => {
        row.id = i + 1
      })
    },
    addTreasureRow() {
      this.item.treasureCfg.push({id: this.item.treasureCfg.length + 1, claimAmount: '', gameCount: '', ratio: ''})
      this.reindexTreasure()
    },
    deleteTreasureRow(index) {
      if (this.item.treasureCfg.length <= 1) {
        Message.warning('至少需要保留一行数据')
        return
      }
      this.item.treasureCfg.splice(index, 1)
      this.reindexTreasure()
    }
  }
}
</script>
