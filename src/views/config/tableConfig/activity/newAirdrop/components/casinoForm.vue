<template>
  <el-dialog
    title="Casino 空投活动"
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
                <el-tag type="warning" size="medium">Casino</el-tag>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 任务文本（仅文本备注，任务类型/条件已移至奖励配置）-->
          <el-row :gutter="20">
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
                label="Casino游戏："
                :category-ids="[3]"
              />
            </el-col>
          </el-row>

          <!-- 白名单配置 -->
          <!--1. AppId白名单 2. SiteId白名单 3. ABTest开关 4. UID白名单-->
          <WhitelistConfig v-model="item.whitelist" :features="[2, 3]"/>

          <!-- 参与活动用户类型：casino 标签用户支持 casino新增用户/casino下注/casino额度 -->
          <AirdropUserType
            v-model="item.userConfig"
            :activity-cfg-id="item.id"
            custom-user-type-label="casino 标签用户"
            :custom-user-tag-options="casinoUserTagOptions"
            :level-tag-ids="[]"
          />
        </el-form>
      </el-tab-pane>

      <!-- ======================== 奖励配置（Casino - 单个道具） ======================== -->
      <el-tab-pane label="奖励配置" name="reward">
        <el-form ref="rewardForm" :model="item" label-width="160px" size="small">
          <!--
            任务要求和奖励相关，故将任务类型、任务条件直接放在道具类型前面，
            使任务配置与奖励配置在同一行可见，便于配置关联。
          -->
          <el-table :data="[item.propPools]" border size="small" style="width: 100%;">
            <!-- 任务类型（放在道具类型前面）-->
            <el-table-column label="任务类型" min-width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.taskType" placeholder="请选择" size="mini">
                  <el-option v-for="opt in casinoTaskTypes" :key="opt.value" :label="opt.label" :value="opt.value"/>
                </el-select>
              </template>
            </el-table-column>
            <!-- 任务条件（放在道具类型前面）-->
            <el-table-column label="任务条件(₱)" min-width="130">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.taskCondition" placeholder="请输入" size="mini"
                          oninput="if(value<0||value===''){value=0}"/>
              </template>
            </el-table-column>
            <el-table-column label="道具类型" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propType" placeholder="请选择" size="mini" @change="handlePropTypeChange(scope.row)">
                  <el-option v-for="opt in propTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="道具名称" min-width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.propId" placeholder="请选择" size="mini" @change="handlePropNameChange(scope.row)">
                  <el-option v-for="opt in getPropOptionsByType(scope.row.propType)" :key="opt.value" :label="opt.label" :value="opt.value"/>
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
            <el-table-column label="道具数量" min-width="110">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini"
                          oninput="if(value<0||value===''){value=0}"/>
              </template>
            </el-table-column>
            <el-table-column label="道具上限" min-width="110">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propLimit" placeholder="上限" size="mini"
                          oninput="if(value<0||value===''){value=0}"/>
              </template>
            </el-table-column>
          </el-table>

        </el-form>
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

const GAME_TYPE = 3 // Casino

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

function defaultPropPools() {
  // taskType/taskCondition 随道具配置一并存储
  return { taskType: 2, taskCondition: 0, propType: 5, propId: 0, propName: '', propTime: 1, propNum: 0, propLimit: 0 }
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
    taskText: '',
    // 奖励配置（propPools 内含任务类型/条件）
    propPools: defaultPropPools(),
    // 用户配置
    userConfig: defaultUserConfig()
  }
}

export default {
  name: 'CasinoForm',
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
      // 任务类型选项（暂时只有"有效下注总额"）
      casinoTaskTypes: [
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
      ],
      // Casino 专属标签用户选项（tagType/tagId 请与后端约定的值对齐）
      casinoUserTagOptions: [
        {
          value: 6, label: 'casino用户类型', children: [
            { value: 60001, label: 'casino 新增用户' },
            { value: 60002, label: 'casino 下注' },
            { value: 60003, label: 'casino 额度' }
          ]
        }
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

      // 兼容旧数据：propPools 里若无 taskType/taskCondition 则从 ext 顶层读取
      const rawPropPools = this.safeJson(ext.propPools, defaultPropPools())
      const propPools = {
        taskType: rawPropPools.taskType || ext.taskType || 2,
        taskCondition: (rawPropPools.taskCondition !== undefined ? rawPropPools.taskCondition : (ext.taskCondition || 0)) / 1000,
        propType: rawPropPools.propType || 5,
        propId: rawPropPools.propId || 0,
        propName: rawPropPools.propName || '',
        propTime: rawPropPools.propTime || 1,
        propNum: rawPropPools.propNum || 0,
        propLimit: rawPropPools.propLimit || 0
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
        taskText: ext.taskText || '',
        propPools,
        userConfig
      }
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
      return true
    },
    getPostData() {
      const d = this.item
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
      // Casino extend：仅包含 casino 专用字段，不含 poker/slot 的 betReward/progressPrizes 等
      const extendObj = {
        taskText: d.taskText || '',
        // propPools 中包含任务类型/条件和道具信息
        propPools: {
          taskType: d.propPools.taskType,
          taskCondition: (d.propPools.taskCondition || 0) * 1000,
          propType: d.propPools.propType,
          propId: d.propPools.propId,
          propName: d.propPools.propName,
          propTime: d.propPools.propTime,
          propNum: d.propPools.propNum,
          propLimit: d.propPools.propLimit
        },
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
    // ---- 道具相关 ----
    getPropList() {
      request({ url: '/propsconfig/props/config/list', method: 'get', data: { PageNum: 1, PageSize: 1000 } }).then(res => {
        if (res.RetCode === 0) {
          this.propList = (res.Data && res.Data.list) || []
        }
      })
    },
    getPropOptionsByType(propType) {
      const currTime = Date.now()
      return this.propList
        .filter(p => p.item_type === propType && p.status === 1)
        .filter(p => {
          if (![2, 4, 5].includes(p.item_type)) {
            return currTime < p.expire_time * 1000
          }
          return true
        })
        .map(p => ({ value: p.id, label: p.item_name, disabled: false }))
    },
    handlePropTypeChange(row) {
      row.propId = 0
      row.propName = ''
    },
    handlePropNameChange(row) {
      const opts = this.getPropOptionsByType(row.propType)
      const sel = opts.find(o => o.value === row.propId)
      if (sel) row.propName = sel.label
    }
  }
}
</script>
