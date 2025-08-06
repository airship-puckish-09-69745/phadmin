<template>
  <div class="app-container">
    <el-row :gutter="20">
      <div class="serach-filter">
        <div class="serach-filter-item">
          机器人资产范围：<el-input v-model="searchFilter.moneyLowerLimit" placeholder="资产下限" size="small" type="number" min="0" />
          ~ <el-input v-model="searchFilter.moneyUpperLimit" placeholder="资产上限" size="small" type="number" min="0" />
        </div>
        <div class="serach-filter-item">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">搜索</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button type="success" size="small" :disabled="selectedRobots.length === 0" @click="handleLaunchRobot">投放选中的机器人</el-button>
        </div>
        <div class="serach-filter-item float-right">
          <el-button  icon="el-icon-plus" size="small" @click="handleShowImportRobotDialog">添加机器人</el-button>
        </div>
      </div>
    </el-row>
    <el-row>
      <br/>
    </el-row>
    <el-row >
      <el-button   size="small" @click="searchRobot(0,10000000)">全部</el-button>
      <el-button   size="small" @click="searchRobot(0,2000)">小于2千</el-button>
      <el-button   size="small" @click="searchRobot(2001,5000)">2千-5千</el-button>
      <el-button   size="small" @click="searchRobot(5001,10000)">5千-1万</el-button>
      <el-button   size="small" @click="searchRobot(10001,20000)">1万-2万</el-button>
      <el-button   size="small" @click="searchRobot(20001,50000)">2万-5万</el-button>
      <el-button   size="small" @click="searchRobot(50001,10000000)">大于5万</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="robotList"
        stripe
        border
        style="width: 70%"
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :formatter="item.formatter" />
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
    <LaunchRobotsDialog
      :visible="launchRobotsDialogVisible"
      :selected-robots="selectedRobots"
      :game-options="gameOptions"
      @close="handleLaunchRobotsDialogClose"
      @reload-list="onSearch"
    />
  </div>
</template>

<script>
import AddRobotDialog from './components/AddRobotDialog.vue'
import request from '@/utils/request'
import LaunchRobotsDialog from './components/LaunchRobotsDialog.vue'
import { $libShow } from '@/utils/common'

export default {
  components: {
    AddRobotDialog,
    LaunchRobotsDialog
  },
  data() {
    return {
      libShow: $libShow,
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
          prop: 'money',
          formatter: (row, column, cellValue) => {
            return this.transformMoney(cellValue).toLocaleString()
          }
        }
      ],
      selectedRobots: [], // 列表选中的机器人
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      /**
       * 数组对象结构
       * @param gameName 游戏名称
       * @param gid 游戏id
       * @param {Number[]} sessions 场次
       */
      gameOptions: [],
      launchRobotsDialogVisible: false // 投放机器人弹窗
    }
  },
  mounted() {
    this.getGameOptions()
    this.onSearch()
  },
  methods: {
    transformMoney(money) {
      return parseInt(money / 1000)
    },
    searchRobot(a,b){
      this.searchFilter.moneyLowerLimit = a
      this.searchFilter.moneyUpperLimit = b
      this.onSearch()
    },
    onSearch() {
      this.pagination.currentPage = 1
      this.getRobotList()
    },
    getGameOptions() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/usercommonrobot/session/option'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log(response.Data)
          this.gameOptions = response.Data.game
        } else {
          this.gameOptions = []
        }
      })
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
      this.selectedRobots = val
      console.log(this.selectedRobots)
    },
    /**
     * 投放机器人
     * 二次弹窗提示投放的机器人数量
     */
    handleLaunchRobot() {
      if (this.selectedRobots.length === 0) {
        this.$message({
          message: '请选择机器人',
          type: 'warning'
        })
        return
      }
      this.launchRobotsDialogVisible = true
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
    },
    handleLaunchRobotsDialogClose() {
      this.launchRobotsDialogVisible = false
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
