<template>
  <el-dialog
    title="Slot 空投活动"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ======================== 活动配置 ======================== -->
      <el-tab-pane label="活动配置" name="activity">
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

            <!-- 时间配置 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开始时间：" required>
                <el-date-picker v-model="item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" style="width: 280px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动结束时间：" required>
                <el-date-picker v-model="item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" style="width: 280px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="展示结束时间：" required>
                <el-date-picker v-model="item.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" style="width: 280px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="调试时间偏移(秒)：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 玩法类型（只读） -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="玩法大类型：">
                <el-tag type="" size="medium">Slot</el-tag>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 任务配置（合并到活动配置）-->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务类型：" required>
                <el-select v-model="item.taskType" placeholder="请选择" style="width: 240px">
                  <el-option v-for="opt in slotTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="任务条件(₱)：" required>
                <el-input v-model.number="item.taskCondition" placeholder="请输入" style="max-width: 240px"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务文本：">
                <el-input v-model="item.taskText" placeholder="请输入" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 勾选游戏 -->
          <el-row>
            <el-col :span="24">
              <GameSelector
                v-model="item.gameIdList"
                label="Slot游戏："
                :category-ids="[1]"
              />
            </el-col>
          </el-row>

          <!-- 白名单配置 -->
          <!--1. AppId白名单 2. SiteId白名单 3. ABTest开关 4. UID白名单-->
          <WhitelistConfig v-model="item.whitelist" :features="[2, 3]"/>

          <!-- 参与活动用户类型 -->
          <AirdropUserType v-model="item.userConfig" :activity-cfg-id="item.id"/>
        </el-form>
      </el-tab-pane>

      <!-- ======================== 奖励配置（Slot - 列表，最多20条） ======================== -->
      <el-tab-pane label="奖励配置" name="reward">
        <div style="margin-bottom: 12px">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            :disabled="item.progressPrizes.length >= 20"
            @click="addPrize"
          >
            添加奖励（{{ item.progressPrizes.length }}/20）
          </el-button>
          <span v-if="item.progressPrizes.length >= 20" style="color: #f56c6c; margin-left: 8px; font-size: 12px">最多配置20条</span>
        </div>
        <el-table :data="item.progressPrizes" border size="small" style="width: 100%">
          <el-table-column label="ID" width="60" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="进度要求(₱)" min-width="120">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.taskValueRequired" placeholder="进度值" size="mini" oninput="if(value<0||value===''){value=0}"/>
            </template>
          </el-table-column>
          <el-table-column label="道具类型" min-width="140">
            <template slot-scope="scope">
              <el-select v-model="scope.row.propType" placeholder="请选择" size="mini" @change="onPropTypeChange(scope.row, scope.$index)">
                <el-option v-for="opt in propTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="道具名称" min-width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" @change="onPropNameChange(scope.row, scope.$index)">
                <el-option v-for="opt in propOptionsMap[scope.$index] || []" :key="opt.value" :label="opt.label" :value="opt.value"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="可用时间" min-width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.propTime" placeholder="请选择" size="mini">
                <el-option v-for="opt in propDayTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="道具数量" min-width="100">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini" oninput="if(value<0||value===''){value=0}"/>
            </template>
          </el-table-column>
          <el-table-column label="道具上限" min-width="100">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.propLimit" placeholder="上限" size="mini" oninput="if(value<0||value===''){value=0}"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-delete" circle :disabled="item.progressPrizes.length <= 1" @click="removePrize(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import GameSelector from '@/components/Game/GameSelector.vue'
import WhitelistConfig from '@/components/WhitelistConfig/index.vue'
import AirdropUserType from '@/components/AirdropUserType/index.vue'
import { ACTIVITY_ID } from '../index.vue'

const GAME_TYPE = 1 // Slot
const MAX_PRIZES = 20
const MIN_PRIZES = 1

function defaultWhitelist() {
  return { appIdList: [], siteIdList: [], abTest: { switch: false, bPercent: 0 }, uidList: [], isOpen: false }
}

function defaultUserConfig() {
  return {
    userTypes: [2],
    userFilterCondition: {
      registerTimeRange: { min: 0, max: 0 },
      betTimesRange: { min: 0, max: 0 },
      userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
    },
    importedFilename: ''
  }
}

function newPrize() {
  return { taskValueRequired: 0, propType: 5, propId: 0, propName: '', propTime: 1, propNum: 0, propLimit: 0 }
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
    debugTimeOffset: 0,
    gameIdList: [],
    whitelist: defaultWhitelist(),
    taskType: 2,
    taskText: '',
    taskCondition: 0,
    progressPrizes: [newPrize()],
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'SlotForm',
  components: { GameSelector, WhitelistConfig, AirdropUserType },
  props: {
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      item: newItem(),
      dialogVisible: false,
      activeTab: 'activity',
      saving: false,
      propList: [],
      propOptionsMap: {},
      slotTaskTypes: [
        { value: 2, label: '有效下注总额' }
      ],
      propTypeOptions: [
        { value: 5, label: 'SlotFreeSpin', disabled: false }
      ],
      propDayTypeOptions: [
        { value: 1, label: '1天' },
        { value: 3, label: '3天' },
        { value: 7, label: '7天' },
        { value: 30, label: '30天' }
      ]
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) return
      if (this.isEdit && this.data && Object.keys(this.data).length > 0) {
        this.loadEditData()
      } else {
        this.item = newItem()
        //默认加载道具
        this.buildPropOptionsForIndex(5,0)
        this.activeTab = 'activity'
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
    safeJson(val, def) {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch (e) { return def }
      }
      return (val !== null && val !== undefined) ? val : def
    },
    loadEditData() {
      const raw = JSON.parse(JSON.stringify(this.data))
      const act = this.safeJson(raw.activity, {})
      const ext = this.safeJson(raw.extend, {})
      const whitelist = this.safeJson(act.whitelist, defaultWhitelist())
      if (!whitelist.abTest) whitelist.abTest = { switch: false, bPercent: 0 }
      if (!whitelist.uidList) whitelist.uidList = []
      if (!whitelist.appIdList) whitelist.appIdList = []
      if (!whitelist.siteIdList) whitelist.siteIdList = []

      const userConfig = {
        userTypes: this.safeJson(ext.userTypes, [2]),
        userFilterCondition: this.safeJson(ext.userFilterCondition, {
          registerTimeRange: { min: 0, max: 0 },
          betTimesRange: { min: 0, max: 0 },
          userTagConfig: { tagType: 0, tagId: 0, tagValue: 0 }
        }),
        importedFilename: ext.importedFilename || ''
      }

      const prizes = this.safeJson(ext.progressPrizes, [newPrize()])
      // 任务类型为有效下注时，任务值除以1000
      if (ext.taskType === 2) {
        prizes.forEach(p => { p.taskValueRequired = (p.taskValueRequired || 0) / 1000 })
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
        debugTimeOffset: act.debugTimeOffset || 0,
        gameIdList: Array.isArray(act.gameIdList) ? act.gameIdList : [],
        whitelist,
        taskType: ext.taskType || 2,
        taskText: ext.taskText || '',
        taskCondition: ext.taskType === 2 ? (ext.taskCondition || 0) / 1000 : (ext.taskCondition || 0),
        progressPrizes: prizes.length > 0 ? prizes : [newPrize()],
        userConfig
      }

      // 初始化道具选项
      this.$nextTick(() => {
        this.item.progressPrizes.forEach((p, idx) => {
          this.buildPropOptionsForIndex(p.propType, idx)
        })
      })
    },
    validateData() {
      if (!this.item.activityName) { Message.error('请输入活动名称'); return false }
      if (!this.item.startTime) { Message.error('请选择开始时间'); return false }
      if (!this.item.endTime) { Message.error('请选择结束时间'); return false }
      if (!this.item.showEndTime) { Message.error('请选择展示结束时间'); return false }
      if (!this.item.whitelist.siteIdList || this.item.whitelist.siteIdList.length === 0) {
        Message.error('请选择SiteId白名单'); return false
      }
      if (!this.item.gameIdList || this.item.gameIdList.length === 0) {
        Message.error('请选择参与活动的游戏'); return false
      }
      if (this.item.progressPrizes.length < MIN_PRIZES) {
        Message.error('至少配置1条奖励'); return false
      }
      for (let i = 0; i < this.item.progressPrizes.length; i++) {
        const p = this.item.progressPrizes[i]
        if (!p.propType || !p.propId) {
          Message.error(`第${i + 1}条奖励请选择道具类型和道具名称`); return false
        }
      }
      return true
    },
    getPostData() {
      const d = this.item
      const prizes = d.progressPrizes.map(p => {
        const copy = Object.assign({}, p)
        if (d.taskType === 2) {
          copy.taskValueRequired = (copy.taskValueRequired || 0) * 1000
        }
        return copy
      })
      const activityObj = {
        name: d.activityName,
        activityId: ACTIVITY_ID,
        isOpen: d.isOpen,
        startTime: Math.floor(d.startTime / 1000),
        endTime: Math.floor(d.endTime / 1000),
        showEndTime: Math.floor(d.showEndTime / 1000),
        debugTimeOffset: d.debugTimeOffset || 0,
        gameType: GAME_TYPE,
        gameIdList: d.gameIdList,
        whitelist: d.whitelist
      }
      const extendObj = {
        taskType: d.taskType,
        taskText: d.taskText || '',
        taskCondition: d.taskType === 2 ? (d.taskCondition || 0) * 1000 : (d.taskCondition || 0),
        progressPrizes: prizes,
        userTypes: d.userConfig.userTypes,
        userFilterCondition: d.userConfig.userFilterCondition,
        importedFilename: d.userConfig.importedFilename || ''
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
      this.saving = true
      const url = postData.id > 0 ? '/activityconfig/update' : '/activityconfig/create'
      request({ url, method: 'post', data: postData }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('changeData')
        }
      }).finally(() => { this.saving = false })
    },
    addPrize() {
      if (this.item.progressPrizes.length >= MAX_PRIZES) {
        Message.warning('最多配置20条奖励')
        return
      }
      this.item.progressPrizes.push(newPrize())
    },
    removePrize(index) {
      if (this.item.progressPrizes.length <= MIN_PRIZES) {
        Message.warning('至少保留1条奖励')
        return
      }
      this.item.progressPrizes.splice(index, 1)
      // 重建道具选项索引
      const newMap = {}
      Object.keys(this.propOptionsMap).forEach(k => {
        const ki = parseInt(k)
        if (ki < index) newMap[ki] = this.propOptionsMap[k]
        else if (ki > index) newMap[ki - 1] = this.propOptionsMap[k]
      })
      this.propOptionsMap = newMap
    },
    // ---- 道具相关 ----
    getPropList() {
      request({ url: '/propsconfig/props/config/list', method: 'get', data: { PageNum: 1, PageSize: 1000 } }).then(res => {
        if (res.RetCode === 0) {
          this.propList = (res.Data && res.Data.list) || []
        }
      })
    },
    buildPropOptionsForIndex(propType, idx) {
      const currTime = Date.now()
      const opts = this.propList
        .filter(p => p.item_type === propType && p.status === 1)
        .filter(p => {
          if (![2, 4, 5].includes(p.item_type)) return currTime < p.expire_time * 1000
          return true
        })
        .map(p => ({ value: p.id, label: p.item_name, disabled: false }))
      this.$set(this.propOptionsMap, idx, opts)
    },
    onPropTypeChange(row, idx) {
      row.propId = 0
      row.propName = ''
      this.buildPropOptionsForIndex(row.propType, idx)
    },
    onPropNameChange(row, idx) {
      const opts = this.propOptionsMap[idx] || []
      const sel = opts.find(o => o.value === row.propId)
      if (sel) row.propName = sel.label
    }
  }
}
</script>
