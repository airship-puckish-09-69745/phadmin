<template>
  <div class="prize-pool-config">
    <el-button
      size="mini"
      type="primary"
      icon="el-icon-plus"
      :disabled="formData.prizePoolCfg.length >= MAX_POOL_COUNT"
      @click="handleCreate"
    >
      添加挡位 ({{ formData.prizePoolCfg.length }}/{{ MAX_POOL_COUNT }})
    </el-button>

    <el-table
      :data="formData.prizePoolCfg"
      border
      style="width: 100%; margin-top: 10px"
      :cell-style="cellStyle"
    >
<!--      <el-table-column prop="tierId" label="ID" width="60" align="center" />-->
      <el-table-column prop="raffleLevel" label="挡位条件(₱)" align="center" />
      <el-table-column prop="sockBaseNum" label="道具数量" align="center" />
      <el-table-column label="获得道具系数" align="center">
        <template slot-scope="scope">
          {{ scope.row.coefficientMin }} - {{ scope.row.coefficientMax }}
        </template>
      </el-table-column>
      <el-table-column label="奖项数" width="80" align="center">
        <template slot-scope="scope">
          {{ (scope.row.prizeCfg || []).length }}
        </template>
      </el-table-column>
      <el-table-column label="操作" column-key="op" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index)">编辑</el-button>
          <el-button
            v-if="formData.prizePoolCfg.length > 1"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.$index)"
          />
          <el-tooltip v-else content="至少保留一个挡位" placement="top">
            <el-button size="mini" type="info" icon="el-icon-delete" circle disabled />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑挡位弹窗 -->
    <el-dialog
      :title="editDialog.isEdit ? '编辑挡位配置' : '新增挡位配置'"
      :visible.sync="editDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      width="900px"
    >
      <el-form ref="editForm" :model="editDialog.item" label-width="180px" size="small">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="挡位条件：" required>
              <el-input v-model.number="editDialog.item.raffleLevel" placeholder="请输入">
                <template slot="append">₱</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="道具数量：" required>
              <el-input v-model.number="editDialog.item.sockBaseNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="获得道具系数(最小)：" required>
              <el-input v-model="editDialog.item.coefficientMin" placeholder="如 0.8" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="获得道具系数(最大)：" required>
              <el-input v-model="editDialog.item.coefficientMax" placeholder="如 1.2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 奖项列表 -->
      <div style="margin-top: 10px">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          :disabled="editDialog.item.prizeCfg.length >= MAX_PRIZE_COUNT"
          @click="handlePrizeCreate"
        >
          添加奖项 ({{ editDialog.item.prizeCfg.length }}/{{ MAX_PRIZE_COUNT }})
        </el-button>

        <div class="prize-table-wrapper" style="margin-top: 8px">
          <el-table :data="editDialog.item.prizeCfg" border :cell-style="cellStyle">
            <el-table-column prop="prizeId" label="ID" width="60" align="center" />
            <el-table-column label="奖励" width="120" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.rewardAmount" size="mini" placeholder="奖励金额" />
              </template>
            </el-table-column>
            <el-table-column label="获得奖励金额区间(₱)" align="center">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center; gap: 5px">
                  <el-input v-model.number="scope.row.rewardMin" size="mini" placeholder="最小值" style="flex: 1" />
                  <span>-</span>
                  <el-input v-model.number="scope.row.rewardMax" size="mini" placeholder="最大值" style="flex: 1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="中奖权重" width="100" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.weight" size="mini" placeholder="权重" />
              </template>
            </el-table-column>
            <el-table-column prop="prizeNum" label="份数" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.prizeUnlimited">不限</span>
                <el-input v-else v-model.number="scope.row.prizeNum" size="mini" placeholder="份数" />
              </template>
            </el-table-column>
            <el-table-column prop="prizeUnlimited" label="不限份数" width="80" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.prizeUnlimited" :active-value="true" :inactive-value="false" />
              </template>
            </el-table-column>
            <el-table-column prop="isBubble" label="奖励气泡" width="80" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isBubble" @change="onBubbleChange" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="editDialog.item.prizeCfg.length > 1"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handlePrizeDelete(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 6px; color: #E6A23C; font-size: 12px">
          每个挡位必须勾选{{ REQUIRED_BUBBLE_COUNT }}个奖励气泡（当前已勾选: {{ bubbleCount }}）
        </div>
      </div>

      <div style="margin-top: 16px; text-align: center">
        <el-button type="primary" @click="save">保存挡位</el-button>
        <el-button @click="editDialog.visible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'

const MAX_PRIZE_COUNT = 20
const MAX_POOL_COUNT = 20
const REQUIRED_BUBBLE_COUNT = 4

function createNewPool() {
  return {
    tierId: 0, // Will be assigned when saving
    raffleLevel: 200,
    rewardMax: 0,
    sockBaseNum: 10,
    coefficientMin: 0.8,
    coefficientMax: 1.2,
    prizeCfg: [
      { prizeId: 1, rewardAmount: 0, rewardMin: 0, rewardMax: 0, weight: 0, prizeNum: 0, prizeUnlimited: true, isBubble: false }
    ]
  }
}

export default {
  name: 'PrizePoolConfig',
  props: {
    value: { type: Object, required: true }
  },
  data() {
    return {
      MAX_POOL_COUNT,
      MAX_PRIZE_COUNT,
      REQUIRED_BUBBLE_COUNT,
      cellStyle: $libShow.DefaultTableCell,
      editDialog: {
        visible: false,
        isEdit: false,
        editIndex: -1,
        item: createNewPool()
      }
    }
  },
  computed: {
    formData: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    },
    bubbleCount() {
      return (this.editDialog.item.prizeCfg || []).filter(p => p.isBubble).length
    }
  },
  methods: {
    onBubbleChange() {
      // Bubble count is auto-computed; validation done on save
    },
    handleCreate() {
      if (this.formData.prizePoolCfg.length >= MAX_POOL_COUNT) {
        Message.warning(`最多只能添加${MAX_POOL_COUNT}个挡位`)
        return
      }
      this.editDialog.item = createNewPool()
      this.editDialog.isEdit = false
      this.editDialog.editIndex = -1
      this.editDialog.visible = true
    },
    handleEdit(index) {
      const data = JSON.parse(JSON.stringify(this.formData.prizePoolCfg[index]))
      // Ensure isBubble field exists on all prizes for Vue reactivity
      data.prizeCfg = data.prizeCfg.map((p, idx) => ({
        ...p,
        prizeId: p.prizeId !== undefined ? p.prizeId : idx + 1,
        isBubble: p.isBubble !== undefined ? p.isBubble : false,
        // Convert old format to new format if needed
        rewardAmount: p.rewardAmount !== undefined ? p.rewardAmount : (p.reward || 0),
        rewardMin: p.rewardMin !== undefined ? p.rewardMin : (p.reward || 0),
        rewardMax: p.rewardMax !== undefined ? p.rewardMax : (p.reward || 0)
      }))
      this.editDialog.item = data
      this.editDialog.isEdit = true
      this.editDialog.editIndex = index
      this.editDialog.visible = true
    },
    handleDelete(index) {
      if (this.formData.prizePoolCfg.length <= 1) {
        Message.warning('至少保留一个挡位')
        return
      }
      this.$confirm('确认删除此挡位配置?', '提示', { type: 'warning' }).then(() => {
        this.formData.prizePoolCfg.splice(index, 1)
      }).catch(() => {})
    },
    handlePrizeCreate() {
      if (this.editDialog.item.prizeCfg.length >= MAX_PRIZE_COUNT) {
        Message.warning(`每个挡位最多${MAX_PRIZE_COUNT}个奖项`)
        return
      }
      const maxPrizeId = Math.max(0, ...this.editDialog.item.prizeCfg.map(p => p.prizeId || 0))
      this.editDialog.item.prizeCfg.push({
        prizeId: maxPrizeId + 1,
        rewardAmount: 0,
        rewardMin: 0,
        rewardMax: 0,
        weight: 0,
        prizeNum: 0,
        prizeUnlimited: true,
        isBubble: false
      })
    },
    handlePrizeDelete(index) {
      if (this.editDialog.item.prizeCfg.length <= 1) {
        Message.warning('至少保留一个奖项')
        return
      }
      this.editDialog.item.prizeCfg.splice(index, 1)
    },
    save() {
      const item = this.editDialog.item

      // Validate raffleLevel
      if (!item.raffleLevel || item.raffleLevel <= 0) {
        Message.error('挡位条件必须大于0')
        return
      }

      // Validate prizes
      if (!item.prizeCfg || item.prizeCfg.length === 0) {
        Message.error('至少配置一个奖项')
        return
      }

      // Check bubble count
      const bubbles = item.prizeCfg.filter(p => p.isBubble).length
      if (bubbles !== REQUIRED_BUBBLE_COUNT) {
        Message.error(`每个挡位必须勾选${REQUIRED_BUBBLE_COUNT}个奖励气泡，当前已勾选${bubbles}个`)
        return
      }

      // Validate prize fields
      for (let i = 0; i < item.prizeCfg.length; i++) {
        const prize = item.prizeCfg[i]
        if (prize.rewardAmount == null || prize.rewardAmount <= 0) {
          Message.error(`奖项${prize.prizeId}的奖励金额不能为0或空`)
          return
        }
        if (prize.rewardMin == null || prize.rewardMin <= 0) {
          Message.error(`奖项${prize.prizeId}的最小金额不能为0或空`)
          return
        }
        if (prize.rewardMax == null || prize.rewardMax <= 0) {
          Message.error(`奖项${prize.prizeId}的最大金额不能为0或空`)
          return
        }
        if (prize.rewardMin > prize.rewardMax) {
          Message.error(`奖项${prize.prizeId}的最小金额不能大于最大金额`)
          return
        }
      }

      // Check duplicate rewardAmount
      const rewardAmounts = item.prizeCfg.map(p => Math.round(p.rewardAmount * 100))
      for (let i = 0; i < rewardAmounts.length; i++) {
        for (let j = i + 1; j < rewardAmounts.length; j++) {
          if (rewardAmounts[i] === rewardAmounts[j]) {
            Message.error(`奖励金额 ${item.prizeCfg[i].rewardAmount} 重复`)
            return
          }
        }
      }

      // Compute rewardMax from prizes
      item.rewardMax = Math.max(...item.prizeCfg.map(p => p.rewardMax))

      const newData = JSON.parse(JSON.stringify(item))

      if (this.editDialog.isEdit) {
        // Check duplicate raffleLevel (exclude self)
        const dupIdx = this.formData.prizePoolCfg.findIndex((p, i) => i !== this.editDialog.editIndex && p.raffleLevel === newData.raffleLevel)
        if (dupIdx >= 0) {
          Message.error(`挡位条件 ${newData.raffleLevel} 已存在`)
          return
        }
        // Keep existing tierId
        newData.tierId = this.formData.prizePoolCfg[this.editDialog.editIndex].tierId
        this.formData.prizePoolCfg.splice(this.editDialog.editIndex, 1, newData)
      } else {
        // Check duplicate raffleLevel
        if (this.formData.prizePoolCfg.some(p => p.raffleLevel === newData.raffleLevel)) {
          Message.error(`挡位条件 ${newData.raffleLevel} 已存在`)
          return
        }
        // Assign new tierId
        const maxTierId = Math.max(0, ...this.formData.prizePoolCfg.map(p => p.tierId || 0))
        newData.tierId = maxTierId + 1
        this.formData.prizePoolCfg.push(newData)
      }

      // Re-sort by raffleLevel
      this.formData.prizePoolCfg.sort((a, b) => a.raffleLevel - b.raffleLevel)

      this.editDialog.visible = false
    }
  }
}
</script>

<style scoped>
.prize-pool-config {
  width: 100%;
}
.prize-table-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}
</style>
