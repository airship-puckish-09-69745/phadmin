<template>
  <div class="app-container">
    <el-row>
      <div class="serach-filter">
        <div class="serach-filter-item">
          机器人资产范围：<el-input v-model="searchFilter.amountMin" placeholder="资产下限" size="small" type="number" />
          ~ <el-input v-model="searchFilter.amountMax" placeholder="资产上限" size="small" type="number" />
        </div>
        <div class="serach-filter-item">
          <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button type="warning" size="small" :disabled="selectedRows.length === 0" @click="handleLaunchRobot">投放选中的机器人</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button type="success" icon="el-icon-plus" size="small" @click="handleAddRobot">添加机器人</el-button>
        </div>
      </div>
    </el-row>

    <el-row>
      <el-table
        :data="robotList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" />
        <el-table-column type="selection" width="100" />
      </el-table>
    </el-row>

    <AddRobotDialog :visible="dialogFormVisible" @reload="getRobotList" />
  </div>
</template>

<script>
import AddRobotDialog from './components/AddRobotDialog.vue'
export default {
  components: {
    AddRobotDialog
  },
  data() {
    return {
      searchFilter: {
        amountMin: '',
        amountMax: ''
      },
      robotList: [],
      dialogFormVisible: false,
      columns: [
        {
          label: '机器人ID',
          prop: 'ID'
        },
        {
          label: '账号标识',
          prop: 'account'
        },
        {
          label: '当前资产',
          prop: 'money'
        }
      ],
      selectedRows: [] // 选中的机器人
    }
  },
  mounted() {
    this.getRobotList()
  },
  methods: {
    getRobotList() {
      this.robotList = [
        {
          ID: '1',
          account: '1001',
          money: 1000
        },
        {
          ID: '2',
          account: '1002',
          money: 2000
        }
      ]
    },
    handleSelectionChange(val) {
      this.selectedRows = val
      console.log(this.selectedRows)
    },
    /**
     * 投放机器人
     * 二次弹窗提示投放的机器人数量
     */
    handleLaunchRobot() {
      if (this.selectedRows.length === 0) {
        this.$message({
          message: '请选择机器人',
          type: 'warning'
        })
        return
      }
      this.$confirm(`确定投放选中的${this.selectedRows.length}个机器人吗？`, '投放机器人', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '投放成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消投放'
        })
      })
    },
    handleAddRobot() {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.serach-filter {
  &-item {
    display: inline-block;
    width: auto;
    margin-right: 12px;

    .el-input {
      width: 200px;
    }
  }
  .float-right {
    float: right;
  }
}
</style>
