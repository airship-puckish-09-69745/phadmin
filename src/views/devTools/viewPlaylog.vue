<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" size="small">
        <el-form-item label="日志内容：" :required="true" label-width="150px">
          <el-input v-model="item.text" type="textarea" rows="10"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查看</el-button>
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
      @row-click="clickData"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="finishTime"
        label="完成时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.finishTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="Uid"
        width="100"
      />
      <el-table-column
        prop="antes"
        label="前注"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.antes / 1000) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="MoneyChanged"
        label="输赢"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyChanged / 1000) }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="牌局过程"
      :visible.sync="actionVisible"
      width="50%"
    >
      <el-table
        ref="filterTable"
        :data="actions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="70"
        />
        <el-table-column
          prop="uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="seat"
          label="座位"
          width="100"
        />
        <el-table-column
          label="手牌"
          width="100"
        >
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.cards)"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="actionType"
          label="动作"
          width="100"
        >
          <template slot-scope="scope">
            {{ actionNames[scope.row.actionType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionMoney"
          label="金币"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionMoney / 1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionBySystem"
          label="系统"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionBySystem ? "是" : "否" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import {$libDate, $libShow} from '@/utils/common'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, UidInput},
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      gid: 0,
      logType: 0,
      text: '',
      libShow: $libShow,
      actionVisible: false,
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      actions: [],
      actionNames: {
        1: '弃牌',
        2: '看牌',
        8: '前注',
        9: '跟注',
        10: '加注',
        14: '发起比牌',
        15: '同意比牌',
        16: '拒绝比牌',
        17: '因为要充值临时停止牌局'
      },
      typeNames: {1: '输不符合', 2: '白名单用户', 3: '游戏中付费', 4: '额度高', 5: '倍数高'},
      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        win: 0,
        lose: 0,
        winCount: 0,
        loseCount: 0
      },

      dataArr: []

    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getInfo()
    console.log(1)
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.uid > 1000000) {
        return 'success-row'
      } else {
        return ''
      }
    },
    showCard(cards) {
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.actionVisible = true
        const cards = {}
        for(let i=0;i<row.players.length;i++){
          cards[row.players[i].uid] = row.players[i].cards
        }
        for (let i = 0; i < row.actions.length; i++) {
          row.actions[i].cards = cards[row.actions[i].uid]
        }
        this.actions = row.actions
      }
    },
    isBingo(valA, valB) {
      if (valA < valB) {
        return '是'
      } else {
        return '否'
      }
    },
    peiValStr(randVal, winRate, peiVal) {
      if (randVal < winRate && peiVal === 1) {
        return '赢配牌'
      }
      if (randVal >= winRate && peiVal === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FIsPeiResult(val) {
      if (val === 1) {
        return '赢配牌'
      }
      if (val === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FTheResult(val) {
      if (val === 1) {
        return '中立'
      }
      if (val === 2) {
        return '赢-符和'
      }
      if (val === 3) {
        return '赢-不符和'
      }
      if (val === 4) {
        return '输-符和'
      }
      if (val === 5) {
        return '输-不符和'
      }
      return '无'
    },
    CalResult(randValue, winRate, moneyChange) {
      if (randValue < winRate) {
        // 命中赢
        if (moneyChange <= 0) {
          return 3
        } else {
          return 2
        }
      }
      if (randValue >= winRate) {
        // 命中输
        if (moneyChange >= 0) {
          return 5
        } else {
          return 4
        }
      }
      return 1
    },

    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
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
      if(this.item.text != "") {
        const objs = JSON.parse(this.item.text)
        for (let i = 0; i < objs.length; i++) {
          const item = objs[i]
          for (let j = 0; j < item.players.length; j++) {
            const p = item.players[j]
            if (p.uid > 1000000) {
              objs[i].Uid = p.uid
              objs[i].MoneyChanged = p.moneyChange
              break
            }

          }
        }
        this.tableData = objs
      }
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
