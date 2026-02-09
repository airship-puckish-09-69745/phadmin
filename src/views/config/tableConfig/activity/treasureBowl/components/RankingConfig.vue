<template>
  <div class="ranking-config">
    <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRow">添加排名奖励</el-button>
    <el-table
      :data="formData.rankCfg"
      border
      style="width: 100%; margin-top: 10px"
      :cell-style="cellStyle"
    >
      <el-table-column label="排名" align="center" min-width="200">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.rankStart" :min="1" size="mini" controls-position="right" style="width: 150px" />
          <span style="margin: 0 20px">~</span>
          <el-input-number v-model="scope.row.rankEnd" :min="scope.row.rankStart" size="mini" controls-position="right" style="width: 150px" />
        </template>
      </el-table-column>
      <el-table-column prop="reward" label="奖励金额(₱)" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.reward" size="mini" placeholder="奖励金额" style="width: 150px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="formData.rankCfg.length > 1"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteRow(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'

export default {
  name: 'RankingConfig',
  props: {
    value: { type: Object, required: true }
  },
  data() {
    return {
      cellStyle: $libShow.DefaultTableCell
    }
  },
  computed: {
    formData: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    }
  },
  methods: {
    addRow() {
      const last = this.formData.rankCfg[this.formData.rankCfg.length - 1]
      const nextStart = last ? last.rankEnd + 1 : 1
      this.formData.rankCfg.push({
        rankStart: nextStart,
        rankEnd: nextStart,
        reward: 0
      })
    },
    deleteRow(index) {
      this.formData.rankCfg.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.ranking-config {
  width: 100%;
}
</style>
