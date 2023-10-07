<!-- 小游戏流水日志 -->
<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item label="分类" label-width="150px">
          <el-select v-model="item.event" @change="resetData">
            <el-option
              v-for="row in events"
              :key="row.value"
              :label="row.label"
              :value="row.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏" :required="true" label-width="150px">
          <el-select v-model="item.gameid" @change="resetData">
            <el-option
              v-for="row in games"
              :key="row.value"
              :label="row.label"
              :value="row.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日期：">
          <el-date-picker
            v-model="item.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            @change="resetData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :offset="6" :span="12">
        <el-descriptions
          class="margin-top"
          :column="2"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总局数：">{{ item.TotalWinTimes + item.TotalLoseTimes }}</el-descriptions-item>
          <el-descriptions-item label="抽水总额：">{{ formatNumber(item.TotalFee) }}</el-descriptions-item>
          <el-descriptions-item label="输局数(包含等于0)："> {{ item.TotalLoseTimes }} - {{ item.TotalLoseTimesRatio }}%</el-descriptions-item>
          <el-descriptions-item label="输总和："> {{ formatNumber(item.TotalLose) }}</el-descriptions-item>
          <el-descriptions-item label="赢局数：">{{ item.TotalWinTimes }} - {{ item.TotalWinTimesRatio }}%</el-descriptions-item>
          <el-descriptions-item label="赢总和："> {{ formatNumber(item.TotalWin) }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @row-click="clickData"
    >
      <el-table-column
        prop="ID"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="UpdateTime"
        label="完成时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.UpdateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Event"
        label="事件"
        width="150"
      >
        <template slot-scope="scope">
          {{ formatEvent(scope.row.Event) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Changed"
        label="变化"
        width="150"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.Changed >0?'red':'green'}">
            {{ formatNumber(scope.row.Changed) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="AfterValue"
        label="奖池"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.AfterValue) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Fee"
        label="抽水"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.Fee) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="item.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="item.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="item.totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="牌局详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <el-table
        ref="filterTable"
        :data="detailData"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="100"
        />
        <el-table-column
          prop="Hit"
          label="命中"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Hit?"是":"否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Result"
          label="下注结果"
          width="800"
        >
          <template slot-scope="scope">
            <el-table
              ref="filterTable"
              :data="scope.row.Ret"
              border
              :show-header="scope.row.ID==1?true:false"
              :row-class-name="tableRowClassName"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="Uid"
                width="150"
              />
              <el-table-column
                prop="Money"
                label="资产"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Money/1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Bet"
                label="下注"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Bet/1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Won"
                label="输赢"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Won>0" style="color:red">{{ scope.row.Won/1000 }}</span>
                  <span v-else>{{ scope.row.Won/1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      events: [
        {
          value: 0,
          label: '所有'
        },
        {
          value: 1,
          label: '游戏'
        },
        {
          value: 2,
          label: '后台操作'
        },
        {
          value: 3,
          label: '赢排序'
        },
        {
          value: 4,
          label: '输排序'
        }
      ],
      games: [
        {
          value: 2,
          label: 'Andar Bahar'
        },
        {
          value: 3,
          label: '龙虎斗'
        },
        {
          value: 4,
          label: 'Jhandi Munda'
        },
        {
          value: 5,
          label: '车标'
        },
        {
          value: 6,
          label: '7上7下'
        },
        {
          value: 7,
          label: '红黑梅方'
        },
        {
          value: 16,
          label: 'baccarat'
        },
        {
          value: 17,
          label: 'wingo'
        },
        {
          value: 18,
          label: '球队标转盘'
        },
        {
          value: 19,
          label: '动物转盘'
        },
        {
          value: 51,
          label: '凤凰'
        }
      ],
      tableData: [],
      detailVisible: false,
      detailData: [],
      libShow: $libShow,
      isReset: false,
      item: {
        gameid: 2,
        event: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        maxid: 0,
        limit: 10,
        totalCount: 0,
        currPage: 1,
        TotalFee: 0,
        TotalWin: 0,
        TotalLose: 0,
        TotalWinTimes: 0,
        TotalLoseTimes: 0,
        TotalLoseTimesRatio: 0,
        TotalWinTimesRatio: 0
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    clickData(row, column, event) {
      if (row.LogID == 0) {
        return
      }
      if (column.columnKey !== 'op') {
        this.getDetail(row.LogID, row.UpdateTime, row.Gid)
      }
    },
    resetData(event, val) {
      this.isReset = true
      console.log('is reset condition ', event, val)
    },
    handleSizeChange(val) {
      this.item.limit = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.item.currPage = val
      this.getInfo()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      n = n / 1000
      return n.toLocaleString()
    },
    formatEvent(e) {
      if (e == 1) {
        return '游戏'
      } else {
        return '后台'
      }
    },
    getDetail(id, dt, gid) {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/detail',
          ID: id,
          DateTime: dt
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          console.log(obj)
          $this.showSmallGame(obj, gid)
        }
      })
    },
    showSmallGame(obj, gid) {
      let names = []
      this.detailData = []
      /*	UPSTREAM_TYPE_RUMMY           = 1 //印度Rummy游戏
UPSTREAM_TYPE_ANDAR_BAHAR     = 2 //AB
UPSTREAM_TYPE_DRAGON_VS_TIGER = 3 //龙虎斗
UPSTREAM_TYPE_JHANDI_MUNDA    = 4 //JM
UPSTREAM_TYPE_CAR_ROULETTE    = 5 //车标转轮
UPSTREAM_TYPE_7UP_7DOWN       = 6 //7上7下
UPSTREAM_TYPE_RVB       	  = 7 //红黑梅方
UPSTREAM_TYPE_AK              = 8 //AK
UPSTREAM_TYPE_TEEN_PATTI      = 9 //炸金花(Teen Patti)
UPSTREAM_TYPE_CRASH           = 10 //Crash*/
      switch (gid) {
        case 2:
          names = ['Andar', 'Bahar', '1-5', '6-10', '11-15', '16-25', '26-30', '31-35', '36-40', '40+']
          break
        case 3:
          names = ['Dragon', 'Tiger', 'Tie']
          break
        case 5:
          names = ['Mahindra', 'Suzuki', 'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Ferrari', 'Lamborghini']
          break
        case 6:
          names = ['2-6', '7', '8-12']
          break
        case 7:
          names = ['黑桃', '红心', '梅花', '方块', 'Joker', '黑色牌', '红色牌']
          break
        case 4:
          names = ['Spade', 'Heart', 'Club', 'Diamond', 'Face', 'Flag']
          break
      }
      const tMap = {}
      for (let i = 0; i < obj.options.length; i++) {
        const ob = obj.options[i]
        tMap[ob.id] = { ID: ob.id, Name: names[ob.id - 1], Hit: ob.hit, Ret: [] }
      }
      for (let i = 0; i < obj.players.length; i++) {
        const player = obj.players[i]
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          tMap[result.id].Ret.push({ Uid: player.uid, Bet: result.moneyBet, Won: result.moneyWon, Money: player.moneyResult })
        }
      }
      for (let i = 1; i <= names.length; i++) {
        this.detailData.push(tMap[i])
      }
      this.detailVisible = true
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Won > 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    getInfo() {
      const $this = this
      if (this.isReset) {
        this.item.maxid = 0
        this.isReset = false
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/lottery',
          gameid: this.item.gameid,
          event: this.item.event,
          time: $libDate.SelectTimeToIndia(this.item.date) / 1000,
          maxid: 0,
          page: this.item.currPage,
          limit: this.item.limit
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.tableData = objs.Items
          if (objs.Stat != null) {
            $this.item.totalCount = objs.Stat.TotalCount
            $this.item.TotalFee = objs.Stat.TotalFee
            $this.item.TotalWin = objs.Stat.TotalWin
            $this.item.TotalLose = objs.Stat.TotalLose
            $this.item.TotalWinTimes = objs.Stat.TotalWinTimes
            $this.item.TotalLoseTimes = objs.Stat.TotalLoseTimes
            const total = $this.item.TotalWinTimes + $this.item.TotalLoseTimes
            if (total === 0) {
              $this.item.TotalLoseTimesRatio = 0
              $this.item.TotalWinTimesRatio = 0
            } else {
              $this.item.TotalLoseTimesRatio = (($this.item.TotalLoseTimes / total) * 100).toFixed(2)
              $this.item.TotalWinTimesRatio = (($this.item.TotalWinTimes / total) * 100).toFixed(2)
            }
            for (const key in $this.tableData) {
              if ($this.tableData[key].ID > $this.item.maxid) {
                $this.item.maxid = $this.tableData[key].ID
              }
            }
          }
        }
      })
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
