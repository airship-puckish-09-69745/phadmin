<template>
  <div>
    <h3 style="margin-bottom: 10px">任务配置</h3>
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">
      添加配置
    </el-button>

    <el-form ref="taskCfgData" v-model="formData.taskCfgData" label-width="150px" style="margin-top: 10px">
      <el-table
        :data="formData.taskCfgData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="配置ID"
          sortable
          min-width="80"
        />
        <el-table-column
          prop="taskType"
          label="任务类型"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            {{ getMatchTypeName(scope.row.taskType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="matchNum"
          label="任务条件"
          min-width="110"
        />
        <el-table-column
          prop="rewardNum"
          label="奖励数量"
          min-width="110"
        />
        <el-table-column
          label="操作"
          column-key="op"
          min-width="160"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 编辑弹窗 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="70%"
    >
      <el-form ref="editForm" :model="editItem" label-width="250px" size="small">
        <el-form-item label="配置ID：" :required="true" prop="id">
          <el-col :span="15">
            <el-input v-model.number="editItem.id" :disabled="isEdit" placeholder="请填写配置id描述" />
          </el-col>
        </el-form-item>

        <!-- 任务配置字段 -->
        <el-divider content-position="left">任务配置</el-divider>
        <el-form-item label="任务类型：" :required="true" prop="taskType">
          <el-col :span="15">
            <el-select v-model.number="editItem.taskType" placeholder="请选择" style="width: 250px">
              <el-option
                v-for="item in betScenes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="任务条件：" :required="true" prop="matchNum">
          <el-col :span="15">
            <el-input v-model.number="editItem.matchNum" placeholder="任务条件" />
          </el-col>
        </el-form-item>

        <el-form-item label="奖励数量：" :required="true" prop="rewardNum">
          <el-col :span="15">
            <el-input v-model.number="editItem.rewardNum" />
          </el-col>
        </el-form-item>
        <div v-if="editItem.taskType === 1">
          <!-- 红包配置字段 -->
          <el-divider content-position="left">红包配置</el-divider>
          <el-form-item label="红包名称：" :required="true" prop="redId">
            <el-col :span="15">
              <el-select v-model.number="editItem.redId" placeholder="请选择" style="width: 250px">
                <el-option label="黄金红包" :value="1" />
                <el-option label="铂金红包" :value="2" />
                <el-option label="钻石红包" :value="3" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="奖励配置：" :required="true">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              :disabled="editItem.rewardPools.length >= 20"
              style="margin-bottom: 10px;"
              @click="addRewardPool"
            >添加奖池 ({{ editItem.rewardPools.length }}/20)
            </el-button>
            <el-table
              :data="editItem.rewardPools"
              border
              size="small"
              style="width: 100%"
            >
              <el-table-column label="红包ID" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.id" placeholder="红包id" size="mini" disabled />
                </template>
              </el-table-column>
              <el-table-column label="奖池" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.poolName" placeholder="奖池名称" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="价值区间1" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.value1" placeholder="最小值" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="价值区间2" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.value2" placeholder="最大值" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="权重" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.weight" placeholder="权重" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="数量限制" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.limitNum" placeholder="数量" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.$index > 0"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="removeRewardPool(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="editItem.taskType !== 1">
          <!-- 道具配置字段 -->
          <el-divider content-position="left">道具配置</el-divider>
          <el-form-item label="道具配置：" :required="true">
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
                      v-for="item in propTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
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
                      v-for="item in getPropOptionsByType(scope.row.propType)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
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
                      v-for="item in propDayTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
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
        </div>

      </el-form>
      <el-row style="margin-top: 10px">
        <el-col :span="10" :offset="10">
          <el-button type="primary" size="medium" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import store from '@/store'

function newTaskCfg() {
  return {
    id: 0,
    // 任务配置字段
    matchNum: 0,
    rewardNum: 0,
    rewardName: '',
    taskType: 1,
    gameType: [],
    // 红包配置字段
    redId: 1,
    rewardPools: [
      {
        id: 1,
        poolName: '奖池1', // 奖池名称
        value1: 0, // 价值区间1
        value2: 0, // 价值区间2
        weight: 0, // 权重
        limitNum: 0 // 数量限制
      }
    ],
    // 道具配置字段
    propPools: {
      propType: 1, // 道具类型
      propId: 0, // 道具ID
      propName: '', // 道具名称
      propTime: 0, // 可用时间
      propNum: 0 // 道具数量
    }
  }
}

export default {
  name: 'TaskConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editDialogVisible: false,
      isEdit: false,
      editItem: newTaskCfg(),
      propList: [], // 道具列表
      betScenes: [
        { 'value': 1, 'label': '累计下注' },
        { 'value': 2, 'label': '连胜' },
        { 'value': 3, 'label': '特殊玩法' }
      ],
      propTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false },
        { 'value': 5, 'label': 'SlotFreeSpin', disabled: false }
      ],
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ]
    }
  },
  computed: {
    formData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    editDialogTitle() {
      return this.isEdit ? '修改配置' : '新增配置'
    },
    env() {
      return store.getters.env || 'prod'
    }
  },

  created() {
    // 获取道具列表
    this.getPropList()
  },
  methods: {
    handleCreate() {
      this.editItem = newTaskCfg()
      this.isEdit = false
      this.editDialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.editDialogVisible = true
      const task = this.formData.taskCfgData.find(item => item.id === row.id)
      if (task) {
        const editData = JSON.parse(JSON.stringify(task))

        // 确保 rewardPools 存在
        if (!editData.rewardPools || !Array.isArray(editData.rewardPools) || editData.rewardPools.length === 0) {
          editData.rewardPools = [{
            id: 1,
            poolName: '奖池1',
            value1: 0,
            value2: 0,
            weight: 0,
            limitNum: 0
          }]
        }

        // 确保 propPools 存在
        if (!editData.propPools || typeof editData.propPools !== 'object') {
          editData.propPools = {
            propType: 1,
            propId: 0,
            propName: '',
            propTime: 0,
            propNum: 0
          }
        }

        this.editItem = editData

        // 在赋值后打印
        console.log('编辑数据:', this.editItem)
        console.log('奖池配置:', this.editItem.rewardPools)
      }
    },
    handleDelete(row) {
      this.$confirm('是否确认删除此配置?', '提示', { type: 'warning' }).then(() => {
        const delIndex = this.formData.taskCfgData.findIndex(item => item.id === row.id)
        if (delIndex >= 0) {
          this.formData.taskCfgData.splice(delIndex, 1)
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    save() {
      const existIndex = this.formData.taskCfgData.findIndex(item => item.id === this.editItem.id)
      if (existIndex >= 0) {
        this.$set(this.formData.taskCfgData, existIndex, JSON.parse(JSON.stringify(this.editItem)))
      } else {
        this.formData.taskCfgData.push(JSON.parse(JSON.stringify(this.editItem)))
      }
      this.editDialogVisible = false
      this.editItem = newTaskCfg()
    },
    getMatchTypeName(taskType) {
      const item = this.betScenes.find(item => item.value === taskType)
      return item ? item.label : '未知'
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
            this.propList = []
            this.propList = objs.list
          }
        } else {
          this.propList = []
        }
      })
    },
    // 添加奖池
    addRewardPool() {
      if (this.editItem.rewardPools.length >= 20) {
        this.$message.warning('最多只能添加20个奖池配置')
        return
      }
      const nextIndex = this.editItem.rewardPools.length + 1
      this.editItem.rewardPools.push({
        id: nextIndex,
        poolName: `奖池${nextIndex}`,
        value1: 0,
        value2: 0,
        weight: 0,
        limitNum: 0
      })
    },
    // 删除奖池
    removeRewardPool(index) {
      if (this.editItem.rewardPools.length > 1) {
        this.editItem.rewardPools.splice(index, 1)
      } else {
        this.$message.warning('至少需要保留一个奖池配置')
      }
    },
    // 处理道具类型变化
    handlePropTypeChange(row) {
      // 清空之前选择的道具ID和名称
      row.propId = 0
      row.propName = ''
    },
    // 处理道具名称变化
    handlePropNameChange(row) {
      const options = this.getPropOptionsByType(row.propType)
      const selected = options.find(opt => opt.value === row.propId)
      if (selected) {
        row.propName = selected.label
      }
    },
    // 根据道具类型获取道具选项
    getPropOptionsByType(propType) {
      console.log(propType)
      const propOptions = []
      const currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        const prop = this.propList[i]
        if (prop.item_type === propType && prop.status === 1) {
          // 对于非头像框类型，检查是否过期
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

