<template>
  <div class="app-container">
    <el-row :gutter="20">
      <div class="serach-filter">
        <div class="serach-filter-item">
          <label class="filter-label">机器人资产范围：</label>
          <el-input 
            v-model="searchFilter.moneyLowerLimit" 
            placeholder="资产下限" 
            size="small" 
            type="number" 
            min="0"
            class="money-input"
          />
          <span class="money-separator">~</span>
          <el-input 
            v-model="searchFilter.moneyUpperLimit" 
            placeholder="资产上限" 
            size="small" 
            type="number" 
            min="0"
            class="money-input"
          />
        </div>
        <div class="serach-filter-item">
          <label class="filter-label">机器人站点：</label>
          <el-select 
            v-model="searchFilter.appID" 
            placeholder="请选择机器人渠道" 
            size="small"
            class="site-select"
            @change="getRobotList"
          >
            <el-option 
              v-for="item in SiteAppIDOptions" 
              :key="item.Value" 
              :label="item.Label" 
              :value="item.Value" 
            />
          </el-select>
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

    <AddRobotDialog :visible="importDialogVisible" :appID="searchFilter.appID" @reload-list="onSearch" @close="handleImportRobotDialogClose" />
    <LaunchRobotsDialog
      :visible="launchRobotsDialogVisible"
      :selected-robots="selectedRobots"
      :game-options="gameOptions"
      :appID="searchFilter.appID"
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
import { get } from 'sortablejs'

export default {
  components: {
    AddRobotDialog,
    LaunchRobotsDialog
  },
  data() {
    return {
      libShow: $libShow,
      searchFilter: {
        appID: 1000005,
        moneyLowerLimit: '',
        moneyUpperLimit: ''
      },
      subKey: 'robot_site_appid_cfg',
      SiteAppIDOptions: [],
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
    this.getSiteAppid()
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
    // 获取渠道与对应的APPID
    getSiteAppid() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data && response.Data.Data !== '') {
            $this.SiteAppIDOptions = JSON.parse(response.Data.Data)
          }
        }
      })
    },
    getRobotList() {
      const { moneyLowerLimit, moneyUpperLimit, appID } = this.searchFilter
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
      if (appID) {
        req.appID = appID
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

<style lang="scss" scoped>
.serach-filter {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
  margin-bottom: 10px;
}

.serach-filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.money-input {
  width: 120px;
}

.money-separator {
  color: #909399;
  font-weight: 500;
  margin: 0 4px;
}

.site-select {
  width: 180px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .serach-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .serach-filter-item {
    width: 100%;
  }
  
  .money-input {
    width: 100px;
  }
  
  .site-select {
    width: 100%;
  }
}
</style>