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
              <el-form-item label="活动名称：" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关：">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="反水比例：">
                <el-input v-model.number="item.betrayRatio" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每日发奖上限监控：" required>
                <el-input v-model.number="item.dayPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                  当前发放金额({{item.dayPrizeThreshold}})
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="最大发奖总上限监控：" required>
                <el-input v-model.number="item.totalPrizeThreshold" placeholder="请输入" style="max-width: 200px">
                  <template slot="append">₱</template>
                </el-input>
                <div style="color: #E6A23C; font-size: 12px; line-height: 1.4; margin-top: 4px">
                 当前发放金额({{item.totalPrizeThreshold}})
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间：" required>
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
              <el-form-item label="结束时间：" required>
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
              <el-form-item label="最低奖励阀值：">
                <el-input v-model.number="item.minReward" placeholder="请输入" style="max-width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="时间偏移：">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px"/>
              </el-form-item>
            </el-col>

            <!-- 参与活动场次：多选枚举 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="参与活动场次：">
                <el-select
                  v-model="item.winGameCount"
                  multiple
                  placeholder="请选择参与场次"
                  style="max-width: 400px"
                >
                  <el-option
                    v-for="opt in activitySessionEnum"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 站点白名单 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="站点白名单：">
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
              <el-form-item label="宝箱配置：">
                <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 16px;">
                  <el-button
                    :disabled="isLoop || item.treasureCfg.length >= 20"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addTreasureRow"
                    :style="isLoop ? 'background: #f5f7fa; color: #c0c4cc; border-color: #ebeef5;' : ''"
                  >添加档位({{ item.treasureCfg.length }}/20)</el-button>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <el-switch v-model="isLoop" active-text="循环模式" inactive-text="普通模式" @change="onLoopSwitch" />
                    <span v-if="isLoop" style="color: #909399; font-size: 12px; margin-left: 8px;">循环模式下仅允许一条档位</span>
                  </div>
                </div>
                  <el-table
                    :data="isLoop ? item.treasureCfg.slice(0, 1) : item.treasureCfg"
                    border
                    size="mini"
                    style="max-width: 500px"
                  >
                  <el-table-column label="宝箱序号" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model.number="scope.row.id"
                        :required="true"
                        prop="id"
                        :min="1"
                        :precision="0"
                        size="mini"
                        style="text-align: center"
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
                  <el-table-column label="操作" align="center" width="50">
                    <template slot-scope="scope">
                      <el-button
                        v-if="!isLoop && scope.$index > 0"
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
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'

// 参与活动场次枚举（扑克盲注级别）
const ACTIVITY_SESSION_ENUM = [
  {value: '1', label: '2.5/5'},
  {value: '2', label: '5/10'},
  {value: '3', label: '10/20'},
  {value: '4', label: '25/50'}
]

// 创建空白活动数据
function createNewItem() {
  return {
    activityName: '', // 活动名称
    isOpen: true, // 活动开关
    startTime: Date.now(), // 开始时间（毫秒）
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 结束时间（毫秒），默认30天后
    betrayRatio: 1, // 反水比例（百分比）
    status: 6, // 活动状态，6为默认状态
    dayPrizeThreshold: 0, // 每日发奖上限（元）
    totalPrizeThreshold: 0, // 总发奖上限（元）
    debugTimeOffset: 0, // 时间偏移（调试用）
    minReward: 0, // 最低奖励阀值（元）
    winGameCount: [], // 参与活动场次（盲注级别）
    treasureCfg: [{id: 1, claimAmount: 0}], // 宝箱配置表格
    whitelistCfg: {
      siteIdList: [] // 站点白名单
    }
  }
}

export default {
  components: {SiteSelect},
  props: {
    visible: {type: Boolean, default: false},
    isEdit: {type: Boolean, default: false},
    editData: {type: Object, default: () => ({})}
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: 'activity',
      env: store.getters.env || 'test',
      item: createNewItem(),
      activitySessionEnum: ACTIVITY_SESSION_ENUM,
      isLoop: false // 是否循环
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
  methods: {
    handleDialogClose() {
      this.item = createNewItem()
    },

    // 加载编辑数据（后端数据 -> 前端展示格式）
    loadEditData() {
      const data = JSON.parse(JSON.stringify(this.editData))
      console.log(111)
      console.log(data.treasureCfg)
      // 白名单配置
      if (typeof data.whitelistCfg === 'string') {
        try {
          data.whitelistCfg = JSON.parse(data.whitelistCfg)
        } catch (e) {
          data.whitelistCfg = {siteIdList: []}
        }
      }
      if (!data.whitelistCfg) data.whitelistCfg = {siteIdList: []}
      if (typeof data.whitelistCfg.siteIdList === 'string') {
        try {
          data.whitelistCfg.siteIdList = JSON.parse(data.whitelistCfg.siteIdList)
        } catch (e) {
          data.whitelistCfg.siteIdList = []
        }
      }

      // 参与活动场次 - JSON字符串 -> 数组
      if (typeof data.winGameCount === 'string') {
        try {
          const parsed = JSON.parse(data.winGameCount)
          data.winGameCount = Array.isArray(parsed) ? parsed : []
        } catch (e) {
          data.winGameCount = []
        }
      }
      if (!Array.isArray(data.winGameCount)) data.winGameCount = []

      // 宝箱配置 - JSON字符串 -> 数组
      if (typeof data.treasureCfg === 'string') {
        // 如果是字符串，先转成数组
        data.treasureCfg = JSON.parse(data.treasureCfg)
      }
      // 如果是数组，就处理金额（厘 → 元）
      if (Array.isArray(data.treasureCfg)) {
        data.treasureCfg = data.treasureCfg.map(value => ({
          ...value,
          claimAmount: Math.floor((value.claimAmount || 0) / 1000)
        }))
      }

      // 时间：秒 -> 毫秒
      if (data.startTime) data.startTime *= 1000
      if (data.endTime) data.endTime *= 1000

      // 金额：分 -> 元（/1000）
      if (data.dayPrizeThreshold != null) data.dayPrizeThreshold /= 1000
      if (data.totalPrizeThreshold != null) data.totalPrizeThreshold /= 1000
      if (data.minReward != null) data.minReward /= 1000

      this.item = data
    },

    // 编码前端数据 -> 后端格式
    encodeData() {
      const cpy = JSON.parse(JSON.stringify(this.item))

      // 时间：毫秒 -> 秒
      cpy.startTime = Math.floor(cpy.startTime / 1000)
      cpy.endTime = Math.floor(cpy.endTime / 1000)

      // 金额：元 -> 分（*1000）
      cpy.dayPrizeThreshold = Math.floor((cpy.dayPrizeThreshold || 0) * 1000)
      cpy.totalPrizeThreshold = Math.floor((cpy.totalPrizeThreshold || 0) * 1000)
      cpy.minReward = Math.floor((cpy.minReward || 0) * 1000)

      // 宝箱配置领取金额 claimAmount 元转分
      if (Array.isArray(cpy.treasureCfg)) {
        cpy.treasureCfg.forEach(row => {
          row.claimAmount = Math.floor((row.claimAmount || 0) * 1000)
        })
      }

      // 参与活动场次 -> JSON字符串
      cpy.winGameCount = JSON.stringify(cpy.winGameCount || [])
      cpy.treasureCfg = JSON.stringify(cpy.treasureCfg || [])

      // 白名单配置 -> JSON字符串
      cpy.whitelistCfg = JSON.stringify(cpy.whitelistCfg || {siteIdList: []})

      // 是否循环
      cpy.isLoop = this.isLoop

      return cpy
    },

    // 表单验证
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
      if (!this.item.treasureCfg || this.item.treasureCfg.length === 0) {
        Message.error('宝箱配置至少需要一行数据')
        return false
      }
      return true
    },

    // 保存
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
      request({url: '/pokerpulsactivity/update', method: 'post', data: postData}).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    handleAddData(postData) {
      request({url: '/pokerpulsactivity/create', method: 'post', data: postData}).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },

    // ---- 宝箱配置表格操作 ----
    addTreasureRow() {
      if (this.isLoop) return
      this.item.treasureCfg.push({id: '', claimAmount: ''})
    },
    deleteTreasureRow(index) {
      if (this.isLoop) return
      if (this.item.treasureCfg.length <= 1) {
        Message.warning('至少需要保留一行数据')
        return
      }
      this.item.treasureCfg.splice(index, 1)
    },
    onLoopSwitch(val) {
      this.isLoop = val
      if (this.isLoop) {
        // 只保留第一条
        if (Array.isArray(this.item.treasureCfg) && this.item.treasureCfg.length > 1) {
          this.item.treasureCfg = [this.item.treasureCfg[0]]
        }
      }
    }
  }
}
</script>
