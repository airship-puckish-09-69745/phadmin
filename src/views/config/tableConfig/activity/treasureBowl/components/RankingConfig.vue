<template>
  <div class="ranking-config">
    <!-- 排行榜配置表格 -->
    <el-form ref="rankingForm" :model="formData" label-width="150px" style="margin-top: 10px">
      <el-table
        class="ranking-table"
        :data="formData.rankCfg"
        border
        style="width: 100%"
        :cell-style="cellStyle"
      >
        <el-table-column prop="rankStart" label="排名开始" align="center" >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.rankStart" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
          </template>
        </el-table-column>
        <el-table-column prop="rankEnd" label="排名结束" align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.rankEnd" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
          </template>
        </el-table-column>
        <el-table-column prop="reward" label="奖励金额" align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import {$libShow} from '@/utils/common'

export default {
  name: 'RankingConfig',
  props: {
    // 使用 v-model 绑定的数据
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cellStyle: $libShow.DefaultTableCell
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
  }
}
</script>

<style scoped>
.ranking-config {
  width: 100%;
}
.ranking-table {
  width: 100%;
}
.ranking-table .el-table__header th {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
  text-align: center;
}
.ranking-table .el-table__body td {
  padding: 6px 8px;
}
.ranking-table .el-input {
  width: 100%;
}
.ranking-table .el-input__inner {
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.ranking-table .el-table__row {
  height: 44px;
}
</style>
