<template>
  <div class="prize-pool-config">
    <!-- 奖池配置表格 -->
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">
      添加配置
    </el-button>
    <el-form ref="prizePoolForm" :model="formData" label-width="150px" style="margin-top: 10px">
      <el-table
        :data="formData.PrizePoolCfg"
        border
        style="width: 100%"
        :cell-style="cellStyle"
        @row-click="clickData"
      >
        <el-table-column
          prop="RaffleLevel"
          label="档次条件"
          width="200"
        />
        <el-table-column
          prop="SockBaseNum"
          label="基础道具数量"
          width="200"
        />
        <el-table-column
          prop="CoefficientMin"
          label="道具系数范围"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.CoefficientMin }} - {{ scope.row.CoefficientMax }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
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

    <!-- 编辑奖池配置弹窗 -->
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editForm" :model="editDialog.item" label-width="250px" size="small">
        <el-form-item label="档次条件：" :required="true" prop="RaffleLevel">
          <el-col :span="15">
            <el-input v-model.number="editDialog.item.RaffleLevel"><template slot="append">（₱）</template></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="基础道具数量：" :required="true" prop="SockBaseNum">
          <el-col :span="15">
            <el-input v-model.number="editDialog.item.SockBaseNum" />
          </el-col>
        </el-form-item>
        <el-form-item label="道具系数最小：" :required="true" prop="CoefficientMin">
          <el-col :span="15">
            <el-input v-model="editDialog.item.CoefficientMin" />
          </el-col>
        </el-form-item>
        <el-form-item label="道具系数最大：" :required="true" prop="CoefficientMax">
          <el-col :span="15">
            <el-input v-model="editDialog.item.CoefficientMax" />
          </el-col>
        </el-form-item>
      </el-form>
      
      <!-- 奖品配置 -->
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handlePrizeCreate">
            添加奖品
          </el-button>

          <el-form ref="prizeCfgForm" :model="editDialog.item" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="editDialog.item.PrizeCfg"
              border
              style="width: 100%"
              :cell-style="cellStyle"
            >
              <el-table-column
                prop="Reward"
                label="真金（₱）"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">（₱）</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Weight"
                label="中奖权重"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Weight" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                </template>
              </el-table-column>
              <el-table-column
                prop="PrizeNum"
                label="份数"
                width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.PrizeUnlimited === true ? '不限' : '' }}
                  <el-input v-model.number="scope.row.PrizeNum" v-if="scope.row.PrizeUnlimited === false" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                </template>
              </el-table-column>
              <el-table-column
                prop="PrizeUnlimited"
                label="是否不限"
                width="100"
              >
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.PrizeUnlimited" :active-value="true" :inactive-value="false" />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                column-key="op"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handlePrizeDelete(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
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
 */
function newPrizePoolCfg() {
  return {
    RaffleLevel: 200,
    RewardMax: 0,
    SockBaseNum: 10,
    CoefficientMin: 0.8,
    CoefficientMax: 1.2,
    PrizeCfg: [
      { Reward: 0, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
    ]
  }
}

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
      cellStyle: $libShow.DefaultTableCell,
      editDialog: {
        raffleLevel: 0, // 当前编辑的档次条件（用于检测是否修改）
        visible: false,
        item: newPrizePoolCfg(),
        isEdit: false
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
     * 点击表格行
     */
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.RaffleLevel)
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
      this.editDialog.item = newPrizePoolCfg()
      this.editDialog.isEdit = false
      this.editDialog.visible = true
    },

    /**
     * 编辑奖池配置
     */
    handleEdit(row) {
      this.initFormData(true, row.RaffleLevel)
      this.editDialog.visible = true
    },

    /**
     * 删除奖池配置
     */
    handleDelete(row) {
      this.$confirm('是否确认删除此奖池配置?', '提示', { type: 'warning' }).then(() => {
        const index = this.formData.PrizePoolCfg.findIndex(item => item.RaffleLevel === row.RaffleLevel)
        this.formData.PrizePoolCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消删除')
      })
    },

    /**
     * 添加奖品配置
     */
    handlePrizeCreate() {
      this.editDialog.item.PrizeCfg.push({ Reward: 0, Weight: 0, PrizeNum: 0, PrizeUnlimited: true })
    },

    /**
     * 删除奖品配置
     */
    handlePrizeDelete(row) {
      this.$confirm('是否确认删除此奖励配置?', '提示', { type: 'warning' }).then(() => {
        const index = this.editDialog.item.PrizeCfg.findIndex(item => item.Reward === row.Reward)
        this.editDialog.item.PrizeCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消删除')
      })
    },

    /**
     * 根据档次条件获取配置数据
     */
    getDataByRaffleLevel(raffleLevel) {
      for (let i = 0; i < this.formData.PrizePoolCfg.length; i++) {
        const data = this.formData.PrizePoolCfg[i]
        if (data.RaffleLevel === raffleLevel) {
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
      if (this.editDialog.isEdit && this.editDialog.raffleLevel !== this.editDialog.item.RaffleLevel) {
        console.log('raffleLevel changed, old:' + this.editDialog.raffleLevel + ' new:' + this.editDialog.item.RaffleLevel)
        for (const item of this.formData.PrizePoolCfg) {
          if (item.RaffleLevel === this.editDialog.raffleLevel) {
            item.RaffleLevel = this.editDialog.item.RaffleLevel
            break
          }
        }
      }

      // 检查是否有重复的奖励金额
      for (let i = 0; i < this.editDialog.item.PrizeCfg.length; i++) {
        const prize = this.editDialog.item.PrizeCfg[i]
        if (parseInt(prize.Reward * 100) === 0) {
          this.$alert(`[奖励金额：0] 不允许添加`, '提示', { type: 'warning' })
          return
        }
        for (let j = i + 1; j < this.editDialog.item.PrizeCfg.length; j++) {
          const otherPrize = this.editDialog.item.PrizeCfg[j]
          if (parseInt(otherPrize.Reward * 100) === parseInt(prize.Reward * 100)) {
            this.$alert(`[奖励金额：${prize.Reward}] 已存在，不能重复添加`, '提示', { type: 'warning' })
            return
          }
        }
      }

      // 计算最大奖励金额
      let maxReward = 0
      this.editDialog.item.PrizeCfg.forEach(v => {
        if (v.Reward > maxReward) {
          maxReward = v.Reward
        }
      })
      this.editDialog.item.RewardMax = maxReward

      const newData = JSON.parse(JSON.stringify(this.editDialog.item))
      const index = this.formData.PrizePoolCfg.findIndex(item => item.RaffleLevel === this.editDialog.item.RaffleLevel)
      
      if (this.editDialog.isEdit) {
        // 编辑模式：替换现有数据
        this.formData.PrizePoolCfg.splice(index, 1, newData)
      } else {
        // 新增模式：检查是否重复，然后添加并排序
        if (index >= 0) {
          this.$alert(`[档次条件：${this.editDialog.item.RaffleLevel}] 已存在，不能重复添加`, '提示', { type: 'warning' })
          return
        }
        this.formData.PrizePoolCfg.push(newData)
        // 按档次金额排序
        this.formData.PrizePoolCfg.sort((a, b) => a.RaffleLevel - b.RaffleLevel)
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
</style>
