<template>
  <div class="ranking-config">
    <!-- 排行榜配置表格 -->
    <el-form ref="rankingForm" :model="formData" label-width="150px" style="margin-top: 10px">
      <el-table
        :data="formData.RankCfg"
        border
        style="width: 100%"
        :cell-style="cellStyle"
      >
        <el-table-column
          prop="RankStart"
          label="排名开始"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.RankStart" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
          </template>
        </el-table-column>
        <el-table-column
          prop="RankEnd"
          label="排名结束"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.RankEnd" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
          </template>
        </el-table-column>
        <el-table-column
          prop="Reward"
          label="奖励金额"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'

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
</style>
