<template>
  <el-dialog
    :title="getEditTitle()"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="65%"
    top="5vh"
    @opened="handleDialogOpened"
    @close="handleDialogClose"
  >
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="红包雨活动配置">
          <ActivityBaseConfig
            ref="activityBaseConfig"
            v-model="item"
            :is-edit="isEdit"
          />
        </el-tab-pane>

        <el-tab-pane label="任务配置">
          <TaskConfig v-model="item" />
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <WhitelistConfig v-model="item" />
        </el-tab-pane>
      </el-tabs>

      <el-row style="margin-top: 20px">
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="handleSaveData">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import { mulFields1000, divFields1000 } from '@/utils/index'
import ActivityBaseConfig from './ActivityBaseConfig.vue'
import TaskConfig from './TaskConfig.vue'
import WhitelistConfig from './WhitelistConfig.vue'

export default {
  name: 'RedBagForm',
  // 注册子组件
  components: {
    ActivityBaseConfig, // 红包雨活动基础配置组件（活动信息、时间、金额限制、游戏选择）
    TaskConfig, // 任务配置组件（任务列表管理、新增/编辑/删除任务、红包价值配置）
    WhitelistConfig // 白名单配置组件（AppId/SiteId白名单、A/B测试）
  },
  props: {
    /**
     * 控制弹窗显示/隐藏
     * 父组件通过 :visible.sync 传递，true 显示弹窗，false 隐藏弹窗
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 是否为编辑模式
     * true 表示编辑已有配置，false 表示新增配置
     */
    isEdit: {
      type: Boolean,
      default: false
    },
    /**
     * 编辑时传入的配置数据对象
     * 新增时为空对象，编辑时为要编辑的配置
     */
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      subKey: 'red_task_cfg',
      item: this.getDefaultItem(),
      appId: parseInt(store.getters.appId) || -1,
      fields: [
        'showGold', 'limitMaxNum', 'rewardNum'
      ]
    }
  },
  // 侦听属性变化，自动处理弹窗显示/隐藏和数据加载/重置
  watch: {
    /**
     * 侦听父组件传入的 visible 属性（弹窗显示/隐藏）
     * - 打开弹窗时：
     *   - 如果是编辑模式且有 editData，加载编辑数据
     *   - 如果是新增模式，重置表单为默认数据
     * - 关闭弹窗时：不做处理
     */
    visible(val) {
      this.dialogVisible = val
      if (val && this.isEdit && Object.keys(this.editData).length > 0) {
        this.loadEditData()
      } else if (val && !this.isEdit) {
        this.resetData()
      }
    },
    /**
     * 侦听本地 dialogVisible 变量（控制弹窗显示/隐藏）
     * - 变化时同步通知父组件（实现 .sync 语法糖）
     */
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    // 获取一个全新的默认表单数据对象（用于新增或重置表单）
    getDefaultItem() {
      return {
        activityName: '',
        isOpen: true,
        isSend: true,
        startTime: 0,
        endTime: 0,
        everyDayStartTime: 0,
        everyDayEndTime: 0,
        showTimes: 0,
        sockGainRatio: 10,
        showGold: 0,
        ruleImgHor: [],
        ruleImgVer: [],
        rewardUseSceneId: 0,
        limitMaxNum: 0,
        appId: -1,
        prizePoolCfg: [],
        gameIdCfg: [],
        appIdList: [],
        siteIdList: [],
        whiteList: [],
        abTest: {
          switch: false,
          bPercent: 0
        },
        curId: '',
        isWhite: true,
        taskCfgData: [],
        rewardType: 1, // 默认选中 投注金
        gameType: 1 // 默认选中 Slot
      }
    },
    // 生成唯一的本地存储 key，通常用于缓存或区分不同配置类型
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    // 获取弹窗标题，根据 isEdit 判断是“新增”还是“修改”
    getEditTitle() {
      return this.isEdit ? '修改配置' : '新增配置'
    },
    // 获取白名单 UID 列表，保证返回数组
    getWhiteList() {
      return this.item.whiteList || []
    },
    // 处理任务配置数据，将 rewardNum 字段 *1000 后返回新数组（用于保存时格式转换）
    getTaskCfgData(cfgData) {
      return cfgData.map(data => {
        const newData = mulFields1000(data, this.fields)
        const result = { ...data, rewardNum: newData.rewardNum }
        // 处理 rewardPools 中的 value1 和 value2（金额字段 * 1000），weight（权重字段 * 100）
        if (result.rewardPools && Array.isArray(result.rewardPools)) {
          result.rewardPools = result.rewardPools.map(pool => ({
            poolName: pool.poolName,
            value1: Math.round(Number(pool.value1) * 1000),
            value2: Math.round(Number(pool.value2) * 1000),
            weight: Math.round(Number(pool.weight) * 100),
            limitNum: pool.limitNum
          }))
        }
        return result
      })
    },
    // 处理红包配置，将金额字段 * 1000，权重字段 * 100
    formatRedBagCfgForSave(cfgList) {
      return cfgList.map(item => {
        const newItem = { ...item }
        // 处理rewardPools数组
        if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
          newItem.rewardPools = newItem.rewardPools.map(pool => ({
            poolName: pool.poolName,
            value1: Math.round(Number(pool.value1) * 1000),
            value2: Math.round(Number(pool.value2) * 1000),
            weight: Math.round(Number(pool.weight) * 100),
            limitNum: pool.limitNum
          }))
        }
        return newItem
      })
    },
    // 处理红包配置，将金额字段 / 1000，权重字段 / 100
    formatRedBagCfgForEdit(cfgList) {
      return cfgList.map(item => {
        const newItem = { ...item }
        // 处理rewardPools数组
        if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
          newItem.rewardPools = newItem.rewardPools.map(pool => ({
            poolName: pool.poolName,
            value1: Number(pool.value1) / 1000,
            value2: Number(pool.value2) / 1000,
            weight: Number(pool.weight) / 100,
            limitNum: pool.limitNum
          }))
        }
        return newItem
      })
    },
    /**
     * 批量赋值字段
     * 将 newData 中 fields 指定的字段赋值到 data 上（只赋值存在于 newData 的字段）
     * 用于数据格式转换后同步字段，避免遗漏和冗余代码
     * @param {Object} data - 目标对象（被赋值）
     * @param {Object} newData - 源对象（提供新值）
     * @param {Array} fields - 需要赋值的字段名数组
     */
    assignFields(data, newData, fields) {
      fields.forEach(f => {
        if (Object.prototype.hasOwnProperty.call(newData, f)) {
          data[f] = newData[f]
        }
      })
    },
    configCheck() {
      if (this.item.startTime === 0) {
        this.errmsg('请填写输入开始时间')
        return false
      }
      if (this.item.endTime === 0) {
        this.errmsg('请填写输入结束时间')
        return false
      }
      return true
    },
    errmsg(msg) {
      this.$message.error(msg)
    },
    // 弹窗相关方法
    handleDialogOpened() {
      this.$emit('opened')
      // 如果是编辑模式，设置已选中的游戏
      if (this.isEdit && this.$refs.activityBaseConfig) {
        this.$nextTick(() => {
          this.$refs.activityBaseConfig.setCheckedGames()
        })
      }
    },
    // 关闭弹窗时触发，通知父组件
    handleDialogClose() {
      this.$emit('close')
    },
    // 取消按钮处理，关闭弹窗
    handleCancel() {
      this.dialogVisible = false
    },
    // 新增配置
    handleAddData(tableData) {
      request({
        url: '/redbagactivity/create',
        method: 'post',
        data: tableData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('新增成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    // 编辑配置
    handleEditData(tableData) {
      tableData.id = this.item.id
      request({
        url: '/redbagactivity/update',
        method: 'post',
        data: tableData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('更新成功！')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },

    /**
     * 总保存数据方法
     * 1. 校验表单数据
     * 2. 格式化时间、金额、权重等字段
     * 3. 组装 tableData 对象，准备提交后端
     * 4. 根据 isEdit 区分调用新增或编辑接口
     */
    handleSaveData() {
      // 1. 校验表单数据，未通过则中断
      if (!this.configCheck()) return
      // 2. 时间字段转换为秒
      const startTime = Math.floor(this.item.startTime / 1000)
      const endTime = Math.floor(this.item.endTime / 1000)
      const everyStartTime = this.item.everyDayStartTime ? Math.floor(this.item.everyDayStartTime / 1000) : 0
      const everyEndTime = this.item.everyDayEndTime ? Math.floor(this.item.everyDayEndTime / 1000) : 0
      // 3. 处理各类配置数据，金额/权重/数组等格式化为后端需要的字符串
      // 从taskCfgData中分离任务配置和红包价值配置
      // 任务配置：包含taskType字段的记录
      // 红包配置：包含redId字段且不包含taskType的记录
      const taskConfigs = this.item.taskCfgData.filter(item => item.taskType)
      const redBagConfigs = this.item.taskCfgData.filter(item => item.redId && !item.taskType)
      let taskCfgData = this.getTaskCfgData(taskConfigs)
      taskCfgData = JSON.stringify(taskCfgData)
      const redBagCfg = JSON.stringify(this.formatRedBagCfgForSave(redBagConfigs))
      const gameIdCfg = JSON.stringify(this.item.gameIdCfg)
      const abTest = JSON.stringify(this.item.abTest)
      const whiteList = JSON.stringify(this.getWhiteList())
      const siteIdList = JSON.stringify(this.item.siteIdList)
      // 4. appIdList 为空时补充当前 appId
      if (!this.item.appIdList) {
        this.item.appIdList = []
      }
      if (this.item.appIdList.length === 0) {
        this.item.appIdList.push(this.appId)
      }
      // 5. 金额/权重等字段批量 *1000 处理
      const newItem = mulFields1000(this.item, this.fields)
      // 6. 组装最终提交数据对象
      const fromData = {
        activityName: this.item.activityName, // 活动名称
        appId: parseInt(store.getters.appId), // 应用ID
        isOpen: this.item.isOpen, // 活动开关
        isSend: this.item.isSend, // 是否发放
        startTime: startTime, // 活动开始时间（秒）
        endTime: endTime, // 活动结束时间（秒）
        everyDayStartTime: everyStartTime, // 每日开始时间（秒）
        everyDayEndTime: everyEndTime, // 每日结束时间（秒）
        showTimes: this.item.showTimes, // 展示次数
        showGold: newItem.showGold, // 展示金额（*1000）
        limitMaxNum: newItem.limitMaxNum, // 最大限领（*1000）
        rewardType: this.item.rewardType, // 奖励类型
        gameType: this.item.gameType, // 玩法大类型
        taskCfgData: taskCfgData, // 任务配置（JSON字符串）
        redBagCfg: redBagCfg, // 红包价值配置（JSON字符串）
        gameIdCfg: gameIdCfg, // 游戏ID配置（JSON字符串）
        whiteList: whiteList, // 白名单（JSON字符串）
        isWhite: this.item.isWhite, // 是否白名单
        appIdList: JSON.stringify(this.item.appIdList), // 应用ID列表（JSON字符串）
        siteIdList: siteIdList, // 站点ID列表（JSON字符串）
        abTest: abTest, // AB测试配置（JSON字符串）
        status: this.item.status // 活动状态
      }
      // 7. 根据 isEdit 区分调用新增或编辑接口
      if (this.isEdit) {
        this.handleEditData(fromData)
      } else {
        // 添加默认 6: '下架'
        fromData.status = 6
        this.handleAddData(fromData)
      }
    },

    // 加载编辑数据
    loadEditData() {
      // 1) 校验 editData 是否存在（非空对象）
      if (this.editData && Object.keys(this.editData).length > 0) {
        // 深拷贝传入的数据，避免修改原对象引用
        const data = JSON.parse(JSON.stringify(this.editData))

        /*
         * safeJsonParse:
         * - 有些字段后端返回的是 JSON 字符串，这个辅助函数负责安全解析
         * - 如果不是字符串或解析失败，则返回提供的默认值（避免异常）
         */
        const safeJsonParse = (str, defaultValue = []) => {
          if (typeof str === 'string' && str.trim()) {
            try {
              return JSON.parse(str)
            } catch (e) {
              // 如果解析失败，打印日志并返回默认值
              console.error('JSON解析失败:', e)
              return defaultValue
            }
          }
          // 如果已经是对象则直接返回，否则返回默认值
          return typeof str === 'object' ? str : defaultValue
        }

        // 安全地解析后端可能以字符串形式返回的字段
        data.taskCfgData = safeJsonParse(data.taskCfgData, [])
        data.redBagCfg = safeJsonParse(data.redBagCfg, [])
        data.gameIdCfg = safeJsonParse(data.gameIdCfg, [])
        data.whiteList = safeJsonParse(data.whiteList, [])
        data.appIdList = safeJsonParse(data.appIdList, [])
        data.siteIdList = safeJsonParse(data.siteIdList, [])
        data.abTest = safeJsonParse(data.abTest, { switch: false, bPercent: 0 })

        //  对需要按千倍/百分位处理的字段做统一转换（使用工具函数）
        // divFields1000 会将指定字段除以 1000（反向处理），返回一个新对象
        const newData = divFields1000(data, this.fields)
        // 使用 assignFields 只把需要的字段从 newData 覆盖回 data
        this.assignFields(data, newData, this.fields)
        //  处理 taskCfgData 中 rewardNum 字段（前端期望的单位）
        if (Array.isArray(data.taskCfgData)) {
          data.taskCfgData = data.taskCfgData.map(item => {
            const newItem = { ...item }
            // 处理 rewardNum
            if (newItem.rewardNum !== undefined && newItem.rewardNum !== null) {
              newItem.rewardNum = Number(newItem.rewardNum) / 1000
            }
            // 处理 rewardPools 中的金额字段（/ 1000）和权重字段（/ 100）
            if (newItem.rewardPools && Array.isArray(newItem.rewardPools)) {
              newItem.rewardPools = newItem.rewardPools.map(pool => ({
                poolName: pool.poolName,
                value1: Number(pool.value1) / 1000,
                value2: Number(pool.value2) / 1000,
                // weight: Number(pool.weight) / 100,
                limitNum: pool.limitNum
              }))
            }
            return newItem
          })
        }

        // 合并红包配置到taskCfgData中
        if (Array.isArray(data.redBagCfg)) {
          const formattedRedBagCfg = this.formatRedBagCfgForEdit(data.redBagCfg)
          data.taskCfgData = [...(data.taskCfgData || []), ...formattedRedBagCfg]
        }

        if (data.startTime) data.startTime = data.startTime * 1000
        if (data.endTime) data.endTime = data.endTime * 1000
        if (data.everyDayStartTime) data.everyDayStartTime = data.everyDayStartTime * 1000
        if (data.everyDayEndTime) data.everyDayEndTime = data.everyDayEndTime * 1000

        // 确保 rewardType 和 gameType 有默认值
        if (data.rewardType === undefined || data.rewardType === null) {
          data.rewardType = 1
        }
        if (data.gameType === undefined || data.gameType === null) {
          data.gameType = 1
        }

        this.item = data
      }
    },
    // 重置from，防止数据残留
    resetData() {
      this.item = this.getDefaultItem()
    }
  }
}
</script>
