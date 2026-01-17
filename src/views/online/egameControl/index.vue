<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-row>
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="日期区间">
          <el-date-picker
            v-model="searchForm.timeRange"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            align="right"
          />
        </el-form-item>
        <el-form-item label="应用：">
          <el-select v-model="searchForm.appId" size="mini">
            <el-option v-for="row of apps" :label="row.label" :value="row.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="searchForm.gid" placeholder="请选择游戏" style="width: 150px" clearable filterable>
            <el-option v-for="game in gameOptions" :key="game.value" :label="game.label" :value="game.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="场次">
          <el-select v-model="searchForm.tableMoney" placeholder="请选择场次" style="width: 150px" clearable>
            <el-option v-for="(item, idx) in tableMoneyOptions" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!-- 数据表格 -->
    <el-row>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 场次如果是-1则显示为全部 -->
            <span v-if="column.prop === 'table_money'">
              {{ scope.row[column.prop] === -1 ? '全部' : scope.row[column.prop] /1000}}
            </span>
            <!-- 系统总净胜分需要除以1000 -->
            <span v-else-if="column.prop === 'system_money'">
              {{ scope.row[column.prop] / 1000 }}
            </span>
            <!-- 其他字段直接显示 -->
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagination.limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            {{ paginationText }}
          </span>
        </el-pagination>
      </div>
    </el-row> -->

    <el-row>
      <line-chart :chart-data="chartData" :y-show-percentage-sign="true" height="600px" />
    </el-row>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
import LineChart from '../../playerManage/components/LineChart'

export default {
  name: 'EgameControl',
  components: {
    LineChart
  },
  data() {
    return {
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      gameOptions: [],
      tableMoneyOptions: [],
      searchForm: {
        gid: 128, // 默认游戏：Tongits JP
        timeRange: this.getDefaultDate(), // 默认时间：七天前的00:00:00到今天的23:59:59
        tableMoney: 0, // 默认场次：全部=0
        appId: 1000005
      },

      /**
       * RecDay      int32 `json:"rec_day"`       //日期 20250523
        Gid         int32 `json:"gid"`           //游戏
        TableMoney  int32 `json:"table_money"`   //场次
        TotalNum    int32 `json:"total_num"`     //总局数
        ForcedKill  int32 `json:"forced_kill"`   //强杀
        WeakKill    int32 `json:"weak_kill"`     //弱杀
        PlayAlong   int32 `json:"play_along"`    //陪玩
        WeakRelease int32 `json:"weak_release"`  //弱放
        Forced      int32 `json:"forced"`        //强放
        NoOffsetNum int32 `json:"no_offset_num"` //无偏移总局数
        TotalWin    int32 `json:"total_win"`     //总胜局数
        SystemMoney int32 `json:"system_money"`  //系统总净胜分
       */
      tableData: [],

      /**
       * 折线图数据
       * type GameRatioRow struct {
        Gid       int32 `json:"gid"`
        AppId     int32 `json:"appId"`
        GameRatio int32 `json:"gameRatio"`
        TimeStamp int64 `json:"timeStamp"` 1747994131
      }
       */
      ratioData: [],
      chartData: {},
      apps: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '内部用[1000002]' },
        { 'value': 1000003, 'label': 'BP-测试[1000003]' },
        { 'value': 1000005, 'label': 'BP-正式[1000005]' }
      ],

      // pagination: {
      //   limit: 20,
      //   total: 0,
      //   page: 1
      // },
      // 表头
      columns: [
        { prop: 'rec_day', label: '日期', width: 100 },
        { prop: 'gid', label: '游戏' },
        { prop: 'table_money', label: '场次' },
        { prop: 'total_num', label: '总局数' },
        // { prop: 'forced_kill', label: '强杀' },
        // { prop: 'weak_kill', label: '弱杀' },
        // { prop: 'play_along', label: '陪玩' },
        // { prop: 'weak_release', label: '弱放' },
        // { prop: 'forced', label: '强放' },
        // { prop: 'no_offset_num', label: '无偏移总局数', width: 160 },
        { prop: 'forced_kill_rate', label: '强杀区间玩家胜率', width: 160 },
        { prop: 'weak_kill_rate', label: '弱杀区间玩家胜率', width: 160 },
        { prop: 'play_along_rate', label: '陪玩区间玩家胜率', width: 160 },
        { prop: 'weak_release_rate', label: '弱放区间玩家胜率', width: 160 },
        { prop: 'forced_rate', label: '强放区间玩家胜率', width: 160 },
        { prop: 'no_offset_rate', label: '玩家平均胜率', width: 160 },
        { prop: 'total_win', label: '总胜局数' },
        { prop: 'system_money', label: '系统总净胜分', width: 160 }
      ]
    }
  },
  // computed: {
  //   paginationText() {
  //     return `当前页：${this.pagination.page}/${Math.ceil(this.pagination.total / this.pagination.limit)}`
  //   }
  // },
  mounted() {
    this.getGameOptions()
    this.getTableOptions()
    this.handleSearch()
  },
  methods: {
    // 日期选择器默认时间为七天前的00:00:00到今天的23:59:59
    getDefaultDate() {
      const now = new Date()
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0)
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      return [startTime, endTime]
    },
    // 时间格式化
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    /**
     * 格式化请求参数
     * uid，opType，propType，propName，startTime，endTime，pageNum，pageSize
     */
    getRequestParams() {
      const params = {
        Path: '/log/egamelog',
        appId: this.searchForm.appId,
        gid: this.searchForm.gid,
        tableMoney: this.searchForm.tableMoney,
        startTime: this.searchForm.timeRange[0] ? Math.round(this.searchForm.timeRange[0] / 1000) : 0,
        endTime: this.searchForm.timeRange[1] ? Math.round(this.searchForm.timeRange[1] / 1000) : 0
      }
      return params
    },
    /**
     * 检查搜索条件
     * UID必填
     */
    checkSearchForm() {
      if (!this.searchForm.gid) {
        this.$message.warning('游戏不能为空')
        return false
      }

      return true
    },
    getGameOptions() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // 过滤出游戏id 128, 134
          const includeGids = [128, 134]
          this.gameOptions = response.Data.filter(item => includeGids.includes(item.Gid)).map(item => ({
            value: item.Gid,
            label: item.Scene
          }))
        }
      })
    },
    getGameName(gid) {
      const game = this.gameOptions.find(item => item.value === gid)
      return game ? game.label : ''
    },
    /**
     * 获取表格和折线图数据
     */
    getList() {
      if (!this.checkSearchForm()) {
        return
      }

      const params = this.getRequestParams()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: params
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = []
          // this.pagination.total = 0
          const {
            // 表格数据
            List,
            // 折线图数据
            Ratio
          } = response.Data
          // console.log('表格数据', List)
          // console.log('折线图数据', Ratio)
          if (List && List.length > 0) {
            let tableData = List.map(item => ({
              ...item,
              gid: this.getGameName(item.gid),
              // 胜率计算公式：胜利局数 / 总局数 * 100 + '%'，例如
              // 强杀区间玩家胜率 = 强杀 / 无偏移总局数 + '%'， 保留两位小数
              // 强杀区间玩家胜率
              forced_kill_rate: item.forced_kill_num === 0 ? '0.00%' : (item.forced_kill / item.forced_kill_num * 100).toFixed(2) + '%',
              // 弱杀区间玩家胜率
              weak_kill_rate: item.weak_kill_num === 0 ? '0.00%' : (item.weak_kill / item.weak_kill_num * 100).toFixed(2) + '%',
              // 陪玩区间玩家胜率
              play_along_rate: item.play_along_num === 0 ? '0.00%' : (item.play_along / item.play_along_num * 100).toFixed(2) + '%',
              // 弱放区间玩家胜率
              weak_release_rate: item.weak_release_num === 0 ? '0.00%' : (item.weak_release / item.weak_release_num * 100).toFixed(2) + '%',
              // 强放区间玩家胜率
              forced_rate: item.forced_num === 0 ? '0.00%' : (item.forced / item.forced_num * 100).toFixed(2) + '%',
              // 总胜局数 / 总局数 * 100 + '%'
              no_offset_rate: (item.total_win / item.total_num * 100).toFixed(2) + '%'
            }))
            // 根据日期排序，大的排前面
            tableData = tableData.sort((a, b) => {
              return b.rec_day - a.rec_day
            })
            this.tableData = tableData
            // this.pagination.total = response.Total
          } else {
            this.$message.warning('没有数据')
          }

          if (Ratio && Ratio.length > 0) {
            this.ratioData = Ratio
            this.drawLineChart()
          } else {
            this.$message.warning('没有折线图数据')
          }
        }
      })
    },

    /**
     * 使用Ratio数据绘制折线图
     * 格式{
        xData: [],
        yData: [
          { Name: '游戏库存', Data: [] },
        ],
        yShow: true
      }
      * 横轴时间（粒度：小时）、纵轴系统库存（百分比，粒度：0.1%）
     */
    drawLineChart() {
      function addZero(num) {
        return num < 10 ? '0' + num : num
      }

      const yData = [
        { Name: '游戏库存', Data: [] }
      ]
      const xData = []
      this.ratioData.forEach(item => {
        // 计算库存百分比
        yData[0].Data.push((item.gameRatio / 100).toFixed(2))
        // 横轴时间：MM-DD HH:mm
        const date = new Date(item.timeStamp * 1000)
        xData.push(`${addZero(date.getMonth() + 1)}-${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`)
      })

      // console.log('折线图数据', yData)

      this.chartData = {
        xData,
        yData,
        yShow: true
      }
    },

    getTableOptions() {
      request({
        url: '/tongitsjackpottable/all',
        method: 'get',
        data: {
          PlayMode: 4
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('tableMoneyOptions', objs)
          if (objs.length > 0) {
            const options = objs.map(item => ({
              value: item.TableMoney / 1000,
              label: item.TableMoney / 1000
            }))
            // 将顺序反转
            this.tableMoneyOptions = options.reverse()
            // tableMoneyOptions插入第一个值为{value: 0, label: '全部'}
            this.tableMoneyOptions.unshift({ value: 0, label: '全部' })
          }
        }
      })
    },

    // 查询数据
    handleSearch() {
      // this.pagination.page = 1
      this.getList()
    },
    // 重置搜索条件
    handleReset() {
      this.searchForm = {
        gid: '',
        timeRange: [],
        tableMoney: ''
      }
      this.currentPage = 1
      this.handleSearch()
    }
    // 分页大小变化
    // handleSizeChange(val) {
    //   this.pagination.limit = val
    //   this.pagination.page = 1
    //   this.handleSearch()
    // },
    // 当前页变化
    // handleCurrentChange(val) {
    //   this.pagination.page = val
    //   this.getList()
    // }
  }
}
</script>

<style scoped>
/* 可根据项目现有样式调整 */
.demo-form-inline {
  margin-bottom: 20px;
}
</style>"
