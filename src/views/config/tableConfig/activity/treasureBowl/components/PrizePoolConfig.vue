<template>
  <div class="prize-pool-config">
    <!-- 奖池配置表格 -->
    <el-button
      size="mini"
      type="primary"
      icon="el-icon-plus"
      :disabled="formData.prizePoolCfg.length >= 20"
      @click="handleCreate"
    >
      添加配置 ({{ formData.prizePoolCfg.length }}/20)
    </el-button>
    <el-form ref="prizePoolForm" :model="formData" label-width="150px" style="margin-top: 10px">
      <el-table
        :data="formData.prizePoolCfg"
        border
        style="width: 100%"
        :cell-style="cellStyle"
        @row-click="clickData"
      >
        <el-table-column
          prop="raffleLevel"
          label="档次条件"
          align="center"
        />
        <el-table-column
          prop="sockBaseNum"
          label="基础道具数量"
          align="center"
        />
        <el-table-column
          prop="coefficientMin"
          label="道具系数范围"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.coefficientMin }} - {{ scope.row.coefficientMax }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-tooltip v-if="formData.prizePoolCfg.length <= 1" content="至少保留一条配置" placement="top">
              <el-button
                size="mini"
                type="info"
                icon="el-icon-delete"
                circle
                disabled
              />
            </el-tooltip>
            <el-button
              v-else
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 编辑奖池配置弹窗 -->
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="handleDialogClose"
    >
      <el-form ref="editForm" :model="editDialog.item" label-width="250px" size="small">
        <el-form-item label="档次条件：" :required="true" prop="raffleLevel">
          <el-col :span="15">
            <el-input v-model.number="editDialog.item.raffleLevel"><template slot="append">（₱）</template></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="基础道具数量：" :required="true" prop="sockBaseNum">
          <el-col :span="15">
            <el-input v-model.number="editDialog.item.sockBaseNum" />
          </el-col>
        </el-form-item>
        <el-form-item label="道具系数最小：" :required="true" prop="coefficientMin">
          <el-col :span="15">
            <el-input v-model="editDialog.item.coefficientMin" />
          </el-col>
        </el-form-item>
        <el-form-item label="道具系数最大：" :required="true" prop="coefficientMax">
          <el-col :span="15">
            <el-input v-model="editDialog.item.coefficientMax" />
          </el-col>
        </el-form-item>
      </el-form>

      <!-- 奖品配置 -->
      <el-row>
        <el-col :span="24">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            :disabled="editDialog.item.prizeCfg.length >= 20"
            @click="handlePrizeCreate"
          >
            添加奖品 ({{ editDialog.item.prizeCfg.length }}/20)
          </el-button>

          <div class="prize-table-wrapper" style="margin-top: 10px" >
            <el-table :data="editDialog.item.prizeCfg" border :cell-style="cellStyle" width="80%">
              <el-table-column prop="reward" label="奖项(₱)" width="120" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="权重" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.weight" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
                </template>
              </el-table-column>
              <el-table-column prop="prizeNum" label="份数" width="100" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.prizeUnlimited === true">不限</span>
                  <el-input v-else v-model.number="scope.row.prizeNum" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
                </template>
              </el-table-column>
              <el-table-column prop="prizeUnlimited" label="不限" width="70" align="center">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.prizeUnlimited" :active-value="true" :inactive-value="false" />
                </template>
              </el-table-column>
              <el-table-column label="操作" column-key="op" width="60" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.$index > 0 || editDialog.item.prizeCfg.length > 1"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="handlePrizeDelete(scope.row, scope.$index)"
                  />
                  <el-tooltip v-else content="至少保留一个奖品" placement="top">
                    <el-button
                      size="mini"
                      type="info"
                      icon="el-icon-delete"
                      circle
                      disabled
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="10" :offset="10">
          <el-button type="primary" size="medium" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'

/**
 * 创建新的奖池配置对象
 * @returns {Object} 奖池配置对象
 */
function createNewPrizePoolConfig() {
  return {
    raffleLevel: 200, // 档次条件（金额）
    rewardMax: 0, // 最大奖励金额
    sockBaseNum: 10, // 基础道具数量
    coefficientMin: 0.8, // 道具系数最小值
    coefficientMax: 1.2, // 道具系数最大值
    prizeCfg: [ // 奖品配置列表 - 默认保留1行
      { reward: 0, weight: 0, prizeNum: 0, prizeUnlimited: true }
    ]
  }
}

// 最大奖品配置数量
const MAX_PRIZE_COUNT = 20
// 最大奖池配置数量
const MAX_POOL_COUNT = 20

export default {
  name: 'PrizePoolConfig',
  props: {
    // 使用 v-model 绑定的数据
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cellStyle: $libShow.DefaultTableCell, // 表格单元格样式
      // 编辑弹窗相关
      editDialog: {
        raffleLevel: 0, // 当前编辑的档次条件（用于检测是否修改）
        visible: false, // 弹窗显示状态
        item: createNewPrizePoolConfig(), // 当前编辑的配置项
        isEdit: false // 是否为编辑模式
      }
    }
  },
  computed: {
    // 通过 computed 实现 v-model
    formData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    /**
     * 获取编辑弹窗标题
     */
    getEditTitle() {
      return this.editDialog.isEdit ? '修改配置' : '新增配置'
    },

    /**
     * 弹窗关闭处理
     */
    handleDialogClose() {
      // 重置表单，避免下次打开时出现问题
      if (this.$refs.editForm) {
        this.$refs.editForm.clearValidate()
      }
    },

    /**
     * 点击表格行
     * @param {Object} row - 行数据
     * @param {Object} column - 列配置
     */
    clickData(row, column) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.raffleLevel)
        this.editDialog.visible = true
      }
    },

    /**
     * 初始化表单数据
     */
    initFormData(isEdit, raffleLevel) {
      this.editDialog.isEdit = isEdit
      if (raffleLevel) {
        const data = this.getDataByRaffleLevel(raffleLevel)
        if (data) {
          this.editDialog.raffleLevel = raffleLevel
          Object.assign(this.editDialog.item, data)
        }
      }
    },

    /**
     * 创建新奖池配置
     */
    handleCreate() {
      if (this.formData.prizePoolCfg.length >= MAX_POOL_COUNT) {
        this.$message.warning(`最多只能添加${MAX_POOL_COUNT}条配置`)
        return
      }
      this.editDialog.item = createNewPrizePoolConfig()
      this.editDialog.isEdit = false
      this.editDialog.visible = true
    },

    /**
     * 编辑奖池配置
     */
    handleEdit(row) {
      this.initFormData(true, row.raffleLevel)
      this.editDialog.visible = true
    },

    /**
     * 删除奖池配置
     */
    handleDelete(row) {
      if (this.formData.prizePoolCfg.length <= 1) {
        this.$message.warning('至少保留一条配置')
        return
      }

      this.$confirm('是否确认删除此奖池配置?', '提示', { type: 'warning' }).then(() => {
        const index = this.formData.prizePoolCfg.findIndex(item => item.raffleLevel === row.raffleLevel)
        this.formData.prizePoolCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消删除')
      })
    },

    /**
     * 添加奖品配置
     */
    handlePrizeCreate() {
      if (this.editDialog.item.prizeCfg.length >= MAX_PRIZE_COUNT) {
        this.$message.warning(`最多只能添加${MAX_PRIZE_COUNT}个奖品`)
        return
      }
      this.editDialog.item.prizeCfg.push({ reward: 0, weight: 0, prizeNum: 0, prizeUnlimited: true })
    },

    /**
     * 删除奖品配置
     */
    handlePrizeDelete(row, index) {
      // 第一行不可删除，或者至少保留一行
      if (index === 0 && this.editDialog.item.prizeCfg.length === 1) {
        this.$message.warning('至少保留一个奖品配置')
        return
      }

      this.$confirm('是否确认删除此奖励配置?', '提示', { type: 'warning' }).then(() => {
        this.editDialog.item.prizeCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消删除')
      })
    },

    /**
     * 根据档次条件获取配置数据
     */
    getDataByRaffleLevel(raffleLevel) {
      for (let i = 0; i < this.formData.prizePoolCfg.length; i++) {
        const data = this.formData.prizePoolCfg[i]
        if (data.raffleLevel === raffleLevel) {
          return data
        }
      }
      return null
    },

    /**
     * 保存奖池配置
     */
    save() {
      // 如果编辑时修改了档次条件，更新旧的记录
      if (this.editDialog.isEdit && this.editDialog.raffleLevel !== this.editDialog.item.raffleLevel) {
        console.log('raffleLevel changed, old:' + this.editDialog.raffleLevel + ' new:' + this.editDialog.item.raffleLevel)
        for (const item of this.formData.prizePoolCfg) {
          if (item.raffleLevel === this.editDialog.raffleLevel) {
            item.raffleLevel = this.editDialog.item.raffleLevel
            break
          }
        }
      }

      // 检查是否有重复的奖励金额
      for (let i = 0; i < this.editDialog.item.prizeCfg.length; i++) {
        const prize = this.editDialog.item.prizeCfg[i]
        if (parseInt(prize.reward * 100) === 0) {
          this.$alert(`[奖励金额：0] 不允许添加`, '提示', { type: 'warning' })
          return
        }
        for (let j = i + 1; j < this.editDialog.item.prizeCfg.length; j++) {
          const otherPrize = this.editDialog.item.prizeCfg[j]
          if (parseInt(otherPrize.reward * 100) === parseInt(prize.reward * 100)) {
            this.$alert(`[奖励金额：${prize.reward}] 已存在，不能重复添加`, '提示', { type: 'warning' })
            return
          }
        }
      }

      // 计算最大奖励金额
      let maxReward = 0
      this.editDialog.item.prizeCfg.forEach(v => {
        if (v.reward > maxReward) {
          maxReward = v.reward
        }
      })
      this.editDialog.item.rewardMax = maxReward

      const newData = JSON.parse(JSON.stringify(this.editDialog.item))
      const index = this.formData.prizePoolCfg.findIndex(item => item.raffleLevel === this.editDialog.item.raffleLevel)

      if (this.editDialog.isEdit) {
        // 编辑模式：替换现有数据
        this.formData.prizePoolCfg.splice(index, 1, newData)
      } else {
        // 新增模式：检查是否重复，然后添加并排序
        if (index >= 0) {
          this.$alert(`[档次条件：${this.editDialog.item.raffleLevel}] 已存在，不能重复添加`, '提示', { type: 'warning' })
          return
        }
        this.formData.prizePoolCfg.push(newData)
        // 按档次金额排序
        this.formData.prizePoolCfg.sort((a, b) => a.raffleLevel - b.raffleLevel)
      }

      this.editDialog.visible = false
    }
  }
}
</script>

<style scoped>
.prize-pool-config {
  width: 100%;
}

/* 奖品配置表格容器 - 防止溢出 */
.prize-table-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
}

.prize-table-wrapper >>> .el-table {
  max-width: 100%;
}

.prize-table-wrapper >>> .el-input__inner {
  padding: 0 8px;
}
</style>
