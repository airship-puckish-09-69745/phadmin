<template>
  <div class="app-container">
    <el-row>
      <div class="serach-filter">
        <div class="serach-filter-item">
          机器人资产范围：<el-input v-model="searchFilter.moneyLowerLimit" placeholder="资产下限" size="small" type="number" min="0" />
          ~ <el-input v-model="searchFilter.moneyUpperLimit" placeholder="资产上限" size="small" type="number" min="0" />
        </div>
        <div class="serach-filter-item">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">搜索</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button type="warning" size="small" :disabled="selectedRows.length === 0" @click="handleLaunchRobot">投放选中的机器人</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button type="success" icon="el-icon-plus" size="small" @click="handleShowImportRobotDialog">添加机器人</el-button>
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
    <el-row>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :current-page.sync="pagination.currentPage"
        :page-size.sync="pagination.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <AddRobotDialog :visible="importDialogVisible" @reload-list="onSearch" @close="handleImportRobotDialogClose" />
  </div>
</template>

<script>
import AddRobotDialog from './components/AddRobotDialog.vue'
import request from '@/utils/request'

export default {
  components: {
    AddRobotDialog
  },
  data() {
    return {
      searchFilter: {
        moneyLowerLimit: '',
        moneyUpperLimit: ''
      },
      robotList: [],
      importDialogVisible: false,
      columns: [
        {
          label: '机器人ID',
          prop: 'uid'
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
      selectedRows: [], // 选中的机器人
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1
      this.getRobotList()
    },
    getRobotList() {
      const { moneyLowerLimit, moneyUpperLimit } = this.searchFilter
      const { currentPage, pageSize } = this.pagination
      const req = {
        Env: this.env,
        Path: '/usercommonrobot/list',
        page: currentPage,
        pageNum: pageSize
      }
      if (moneyLowerLimit) {
        req.moneyLowerLimit = moneyLowerLimit
      }
      if (moneyUpperLimit) {
        req.moneyUpperLimit = moneyUpperLimit
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: req
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log(response.Data)
          this.robotList = response.Data.user
          this.pagination.total = response.Data.total
        } else {
          this.robotList = []
          this.pagination.total = 0
        }
      })
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
    handleShowImportRobotDialog() {
      this.importDialogVisible = true
    },
    handleImportRobotDialogClose() {
      this.importDialogVisible = false
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getRobotList()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getRobotList()
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
