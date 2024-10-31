<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">

        <el-form-item label="UID：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>

      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="update_time"
        label="时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="2" :timestamp="scope.row.update_time" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Before"
        label="前值"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.point_now - scope.row.point_changed) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="point_changed"
        label="变化值"
        width="200"
      >
        <template slot-scope="scope">
          <span
            :style="scope.row.point_changed>0?'color:red':'color:green'"
          >{{
            formatNumber(scope.row.point_changed)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="point_now"
        label="账户总额"
        width="200"
      />
      <el-table-column
        prop="act_type"
        width="200"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['act_type']" multiple size="mini" @change="handleFilter2">
            <el-option label="操作类型" :value="0" />
            <el-option v-for="o in actTypeSort" :key="o" :label="clientDB.FilterMap['act_type'][o]" :value="o" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('act_type', scope.row.act_type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="act_msg"
        label="操作说明"
        min-width="300"
      >
        <template slot-scope="scope">
          {{ getActName(scope.row.act_type,scope.row.act_msg) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ext_data"
        label="备注"
        width="200"
      />
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

const filterMap = {
  act_type: {
    1000: '玩牌赢',
    1001: '玩牌输',
    2: '充值',
    15: '提现',
    16: '提现手续费',
    18: '未付费重置',
    19: '使用存钱罐',
    20: '领取bonus',
    1: '注册',
    7: '签到奖励',
    11: '管理后台',
    12: '月卡每日奖励',
    13: '月卡头款',
    14: '动态表情',
    17: '邀请账号提现',
    29: '老虎机下注',
    30: '老虎机返奖',
    31: '老虎机Wild返奖',
    32: '老虎机Scatter返奖',
    33: '扫雷下注',
    34: '扫雷奖励',
    37: '购买添加Bonus',
    38: '输钱添加Bonus',
    39: '游戏中Jackpot',
    40: 'Lucky9往HitPot投注',
    41: 'Lucky9获得HitPot奖励',
    60: '积分赛奖励',
    61: '积分赛买入',
    62: '积分从平台转入',
    63: '积分转出到平台',
    64: '积分转出到平台回滚',
    70: 'MTT报名费',
    71: 'MTT报名费返还',
    72: 'MTT比赛奖励',
    2000: '下注',
    2001: '单一钱包登录',
    2002: '刷新金额',
    2003: '派奖',
    2004: '回退订单',
    2005: '增值业务',
    2006: '从平台转出',
    2007: '内部结算',
    2008: '平台结算汇总+刷新金额',
    2009: '转入平台',
    2010: '比赛报名',
    2011: '比赛结束'
  }
}

export default {
  name: 'Pointlog',
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      isHistory: false,
      search: '',
      clientDB: new ClientTableData([], 10, filterMap),
      libShow: $libShow,
      actTypeSort: [1000, 1001, 2, 15, 16, 18, 19, 20, 1, 7, 11, 12, 13, 14, 17, 29, 30, 31, 32, 60, 61, 62, 63, 64,
        2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],

      item: {
        Uid: 0
      },
      gameTableData: [],
      gamePanelVisible: false,
      pointData: [],
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      env: 'test',
      gameMap: {},
      drawer: {
        visible: false,
        lines: []
      },
      libMoney: new MoneyShow(['point_changed', 'point_now', 'point_all']),
      walletType: [ // 钱包金流类型
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011
      ]
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    // this.getGameList()
    console.log(1)
  },
  methods: {
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter2() {
      const actTypes = {}
      for (let i = 0; i < this.clientDB.FilterValueMap['act_type'].length; i++) {
        actTypes[this.clientDB.FilterValueMap['act_type'][i]] = true
      }
      this.clientDB.ShowData = this.clientDB.TotalData.filter(
        function(data) {
          if (actTypes[data.act_type]) {
            return true
          } else {
            return false
          }
        }
      )
      this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      this.refreshShow()
    },
    getActName(type, msg) {
      return msg
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
      const $this = this
      this.pointData = []
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      if (eTime - bTime > 86400) {
        Message.error('不支持跨天查询')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/pointlog',
          Uid: this.item.Uid,
          Type: 0,
          BTime: bTime,
          ETime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data === 'no Data') {
            Message.success('no Data')
            loading.close()
            return
          }
          let objs = response.Data || []
          objs = $this.libMoney.TransForShow(objs)
          $this.pointData = objs
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'update_time', -1)

          $this.handleCurrentChange(1)

          this.gameTableData = []
        }

        loading.close()
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameMap[response.Data[i].Gid] = response.Data[i].Name
          }
          // todo 比赛游戏临时添加
          this.gameMap[2031] = 'TongitsMtt'
        }
      })
    }
  }
}
</script>
