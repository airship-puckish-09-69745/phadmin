<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="120px" :inline="true" size="small">
        <el-form-item label="应用：">
          <el-select v-model.number="searchForm.appId">
            <el-option label="所有" :value="0" />
            <el-option label="自运营（android）" :value="100000001" />
            <el-option label="联运发行（galaxy）" :value="100000002" />
            <el-option label="联运线下（逆光）" :value="100000003" />
            <el-option
              v-for="item in searchForm.appIdOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="uid：">
          <el-input v-model="searchForm.uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item label="小黑屋标志：">
          <el-select v-model.number="searchForm.vupLevel">
            <el-option
              v-for="item in vupLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小游戏">
          <el-select v-model.number="searchForm.gameId">
            <el-option
              v-for="item in gameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row style="padding:10px;font-size: 17px; font-weight: normal;">
      当前在玩小黑屋人数：{{ total }}
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :row-style="{height:'10px'}"
      style="width: 100%;"
      :default-sort="{prop: 'recycle_money', order: 'ascending'}"
      @sort-change="sortChange"
      @row-click="clickData"
    >
      <el-table-column
        prop="uid"
        label="uid"
      />
      <el-table-column
        prop="app_id"
        label="appid"
      />
      <el-table-column
        prop="level"
        label="小黑屋标志"
      />
      <el-table-column
        prop="reg_date"
        label="注册时间"
      />
      <el-table-column
        prop="login_time"
        label="最近登陆时间"
      />
      <el-table-column
        prop="enter_money"
        label="进入时金额"
        sortable
      >
        <template slot-scope="{row}">
          {{ toRupee(row.enter_money) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="money"
        label="当前金额"
        sortable
      >
        <template slot-scope="{row}">
          {{ toRupee(row.money) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="today_pay"
        label="今日充值金额"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.today_pay) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="today_withdraw"
        label="今日提款"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.today_withdraw) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="recycle_money"
        label="今日回收金额"
        sortable
      >
        <template slot-scope="{row}">
          {{ toRupee(row.recycle_money) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <div style="text-align: center; width: 100%; height: 50px; padding-top: 10px;">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <el-dialog
      title="实时牌局监控控制页面"
      :modal="false"
      :visible.sync="queryShow.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-descriptions title="">
          <el-descriptions-item label="用户id">{{ queryShow.uid }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ queryShow.playStatus }}</el-descriptions-item>
          <el-descriptions-item label="调控措施">
            <el-button type="danger" size="small" :plain="true" @click="control(1)">下局必赢</el-button>
            <el-button type="success" size="small" :plain="true" @click="control(2)">下局必输</el-button>
            <el-button icon="el-icon-refresh" circle :plain="true" @click="refresh()" />
          </el-descriptions-item>

          <el-descriptions-item label="进小黑屋金额">{{ toRupee(queryShow.enterMoney) }}</el-descriptions-item>
          <el-descriptions-item label="当前余额">{{ toRupee(queryShow.money) }}</el-descriptions-item>
          <el-descriptions-item label="今日充值金额">{{ toRupee(queryShow.todayPay) }}</el-descriptions-item>

          <el-descriptions-item label="今日提款金额">{{ toRupee(queryShow.todayWithDraw) }}</el-descriptions-item>
          <el-descriptions-item label="回收金额">{{ toRupee(queryShow.recycleMoney) }}</el-descriptions-item>
          <el-descriptions-item label="总充值金额">{{ toRupee(queryShow.totalPay) }}</el-descriptions-item>

          <el-descriptions-item label="总提款金额">{{ toRupee(queryShow.totalWithDraw) }}</el-descriptions-item>
          <el-descriptions-item label="今日牌局数据">{{ queryShow.todayPlayShow }}</el-descriptions-item>
        </el-descriptions>
      </el-row>
      <el-table
        style="width: 100%"
        :data="queryShow.playLogs"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="play_date"
          label="时间"
        />
        <el-table-column
          prop="game_name"
          label="玩法场次"
        />
        <el-table-column
          prop="money_change"
          label="输赢"
        >
          <template slot-scope="{row}">
            {{ toRupee(row.money_change) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_end"
          label="余额"
        >
          <template slot-scope="{row}">
            {{ toRupee(row.money_end) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="control"
          label="本剧是否控制"
        />
        <el-table-column
          prop="control_result"
          label="最终结果"
        />
        <el-table-column
          prop="control_operator"
          label="操作人"
        />
        <el-table-column
          label="牌局详细日志"
        >
          <template slot-scope="{row}">
            <el-popover
              placement="right"
              width="400"
              trigger="click"
            >
              <el-table :data="row.bet_details">
                <el-table-column v-if="row.game_id != 13" property="option_name" label="区域" />
                <el-table-column v-else label="区域">
                  <template scope="scope">
                    玩家牌：<p v-html="showCard(scope.row.cards)" />
                    庄家牌：<p v-html="showCard(scope.row.dealer_cards)" />
                  </template>
                </el-table-column>
                <el-table-column property="hit" label="是否命中">
                  <template scope="scope">
                    {{ scope.row.hit?"命中":"未中" }}
                  </template>
                </el-table-column>
                <el-table-column property="bet" label="下注">
                  <template scope="scope">
                    {{ toRupee(scope.row.bet) }}
                  </template>
                </el-table-column>
                <el-table-column property="won" label="输赢">
                  <template scope="scope">
                    {{ toRupee(scope.row.won) }}
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference">牌局详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <div style="text-align: center; width: 100%; height: 50px; padding-top: 10px;">
          <el-pagination
            :current-page="queryShow.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryShow.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryShow.total"
            @size-change="handleSizeChangeShow"
            @current-change="handleCurrentChangeShow"
          />
        </div>
      </el-row>
    </el-dialog>

  </div>
</template>

<style>
  .el-table .win-row {
    background: #ffeded;
  }

  .el-table .lose-row {
    background: #e7faf0;
  }
</style>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, $libType, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'

export default {
  name: 'VupMonitor',
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      orderField: 'recycle_money',
      orderType: 'asc',
      page: 1,
      limit: 10,
      total: 0,
      searchForm: {
        uid: 0,
        appIdOption: [],
        appId: 0,
        vupLevel: 0,
        gameId: 3
      },
      queryShow: {
        visible: false,
        uid: 0,
        playStatus: '',
        enterMoney: 0,
        money: 0,
        todayPay: 0,
        todayWithDraw: 0,
        recycleMoney: 0,
        totalPay: 0,
        totalWithDraw: 0,
        todayPlay: '',
        playLogs: [],
        page: 1,
        limit: 10,
        todayPlayShow: '',
        total: 0,
        gameId: 0,
        srvId: 0,
        tableId: 0
      },
      vupLevels: [
        {
          'value': 0,
          'label': '所有'
        },
        {
          'value': 1,
          'label': '1'
        },
        {
          'value': 2,
          'label': '2'
        }
      ],
      gameList: [
        {
          'value': 2,
          'label': 'AB'
        },
        {
          'value': 3,
          'label': '龙虎斗'
        },
        {
          'value': 4,
          'label': '六色子'
        },
        {
          'value': 5,
          'label': '车标转轮'
        },
        {
          'value': 6,
          'label': '七上七下'
        },
        {
          'value': 7,
          'label': '红黑梅方'
        },
        {
          'value': 13,
          'label': 'TeenPatti100'
        },
        {
          'value': 16,
          'label': 'baccarat'
        },
        {
          'value': 17,
          'label': 'wingo lottery'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getAppIdList()
    this.search()
  },
  methods: {
    // 分页处理
    handleSizeChange(val) {
      this.limit = val
      this.search()
    },
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    // 转行卢比
    toRupee(amount) {
      return parseInt(amount) / 1000
    },
    sortChange(ob) {
      this.orderField = ob.prop
      if (ob.order == 'descending') {
        this.orderType = 'desc'
      } else {
        this.orderType = 'asc'
      }
      this.page = 1
      this.limit = 10
      this.search()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.queryShow.uid = row.uid
        // this.initFormData(true, row.ID)
        this.queryShow.visible = true
        this.query()
      }
    },
    // 获取appId列表
    getAppIdList() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/withdraw/appid/list',
          Env: store.getters.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.searchForm.appIdOption = []
          for (const i in response.Data) {
            $this.searchForm.appIdOption.push({
              label: response.Data[i],
              value: response.Data[i]
            })
          }
        }
      })
    },
    search() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/vupmonitor/list',
          Uid: this.searchForm.uid,
          GameId: this.searchForm.gameId,
          AppId: this.searchForm.appId,
          VupLevel: this.searchForm.vupLevel,
          Page: this.page,
          Limit: this.limit,
          OrderField: this.orderField,
          OrderType: this.orderType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || []
          if (this.page === 1) {
            this.total = data.total
          }
          this.tableData = data.list
        }
      })
    },
    // 分页处理
    handleSizeChangeShow(val) {
      this.queryShow.limit = val
      this.query()
    },
    handleCurrentChangeShow(val) {
      this.queryShow.page = val
      this.query()
    },
    query() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/vupmonitor/query',
          Uid: this.queryShow.uid,
          Page: this.queryShow.page,
          Limit: this.queryShow.limit
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          const data = response.Data || []
          if (this.queryShow.page === 1) {
            this.queryShow.total = data.today_play_total
          }
          this.queryShow.money = data.money
          this.queryShow.enterMoney = data.enter_money
          this.queryShow.todayPay = data.today_pay
          this.queryShow.todayWithDraw = data.today_withdraw
          this.queryShow.totalPay = data.total_pay
          this.queryShow.totalWithDraw = data.total_withdraw
          this.queryShow.playLogs = data.play_detail
          this.queryShow.playStatus = data.status
          this.queryShow.total = data.today_play_total
          this.queryShow.gameId = data.game_id
          this.queryShow.srvId = data.srv_id
          this.queryShow.tableId = data.table_id
          if (data.game_play.length > 0) {
            let todayPlayTotal = ''
            data.game_play.forEach(function(item) {
              todayPlayTotal += item.game_name + ':' + item.round + '局; '
            })
            this.queryShow.todayPlayShow = todayPlayTotal
          }
        }
      })
    },
    control(result) {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/vupmonitor/control',
          Uid: this.queryShow.uid,
          GameId: this.queryShow.gameId,
          SrvId: this.queryShow.srvId,
          Operator: this.$store.getters.name,
          Result: result
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    refresh() {
      this.queryShow.page = 1
      this.query()
      this.$message({
        message: '数据刷新成功！',
        type: 'success'
      })
    },
    showCard(cards) {
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    tableRowClassName(row, rowIndex) {
      if (row.row.money_change > 0) {
        return 'win-row'
      } else {
        return 'lose-row'
      }
    }
  }
}
</script>
