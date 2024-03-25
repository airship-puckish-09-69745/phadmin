<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.BeginDate"
            value-format="timestamp"
            type="date"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="">
          <el-form-item label="玩家id">
            <el-input v-model.number="searchForm.Uid" size="mini" placeholder="玩家id" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="searchByUid">查询</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="currentData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="LogDate"
        label="玩家ID"
        width="100%"
      >
        <template>
          {{ selectUid }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LogTime"
        label="玩牌时间"
      >
        <template slot-scope="scope">
          {{ formateDate(scope.row.StartTime , 2) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="LogID"
        label="玩家昵称"
      >
      <template slot-scope="scope">
          {{ getNickByUid(scope.row, selectUid) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="InsureChange"
        label="玩家手牌"
        width="100%"
      >
        <template slot-scope="scope">
          <el-image v-for="(item, index) in getHdCardByUid(scope.row, selectUid)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="公共牌"
      >
        <template slot-scope="scope">
           <el-image v-for="(item, index) in showCards(scope.row.AllPublishCards)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="Insure"
        label="有效底池"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ getPool(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Outs"
        label="获胜玩家&昵称"
      >
      <template slot-scope="scope">
          {{ getMaxWinPlayer(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="InsureChange"
        label="获胜玩家手牌"
        width="100%"
      >
        <template slot-scope="scope">
          <el-image v-for="(item, index) in getMaxWinPlayerHdCard(scope.row)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="LogID"
        label="牌局ID"
      >
        <template slot-scope="scope">
          <router-link :to= "{name: 'texasNlhGameDetail', query: { SrvLogId: scope.row.LogId, dateTime: scope.row.StartTime }}" @click.native="recordShow = false" style="color: blue">
                {{ scope.row.LogId }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row type="flex" justify="end">
      <el-col :span="10">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'RocketRet',
  data() {
    return {
      searchForm: {
        BeginDate: $libDate.GetDayBegin(new Date().getTime()),
        Uid: 1010434,
        LogID: ''
      },
      selectUid: 0,
      gid: 32,
      totalInsure: 0,
      tableData: [],
      currentData: [],
      totalCount: 0,
      currentPage: 1,
      pageNum: 10,
      libShow: $libShow
    }
  },
  created() {

  },
  methods: {
    searchByUid() {
      const _this = this
      _this.tableData = []
      _this.currentData = []
      if (_this.searchForm.Uid < 0 || _this.searchForm.Uid === '') {
        Message.error('玩家ID不能为空')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/log/playlog',
          Uid: _this.searchForm.Uid,
          IsVup: 0,
          Time: Date.parse(new Date(_this.searchForm.BeginDate).toString()) / 1000,
          Gid: _this.gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length > 0) {
            this.searchDetail(objs)
          }
          _this.totalCount = objs.length
          _this.selectUid = _this.searchForm.Uid
        } else {
          Message.error(response.Data)
        }
      })
    },
    searchDetail(items) {
      var selectIds = ''
      for (var i = 0; i < items.length; i++) {
        selectIds = selectIds + items[i].LogID
        if (i !== items.length - 1) {
          selectIds += ','
        }
      }
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/texasnlhdata/gamedetail',
          ID: selectIds,
          DateTime: Date.parse(new Date(_this.searchForm.BeginDate).toString()) / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (var i = 0; i < objs.list.length; i++) {
            _this.tableData.push(objs.list[i])
          }
          for (var j = 0; j < this.tableData.length; j++) {
            console.log(_this.tableData[j].StartTime)
          }
          _this.tableData.sort(this.sortBy("StartTime", -1))
          for (var k = 0; k < this.tableData.length; k++) {
            console.log(_this.tableData[k].StartTime)
          }
          _this.refreshShow()
        } else {
          Message.error(response.Data)
        }
      })
    },
    getPool(row) {
      for (var i = row.StepInfo.length - 1; i >= 0; i--) {
        if (row.StepInfo[i].StepType !== 1) {
          continue
        }
        return row.StepInfo[i].Pot
      }
    },
    getMaxWinPlayer(row) {
      var maxWinPlayer
      for (var i = 0; i < row.Players.length; i++) {
        if (maxWinPlayer === undefined) {
          maxWinPlayer = row.Players[i]
        }
        if (row.Players[i].TurnMoney > maxWinPlayer.TurnMoney) {
          maxWinPlayer = row.Players[i]
        }
      }
      if (maxWinPlayer === undefined) {
        return ''
      }
      return maxWinPlayer.Uid + ' & ' + maxWinPlayer.Nick
    },
    getNickByUid(row, uid) {
      for (var i = 0; i < row.Players.length; i++) {
        if (row.Players[i].Uid !== uid) {
          continue
        }
        return row.Players[i].Nick
      }
      return ''
    },
    getMaxWinPlayerHdCard(row) {
      var maxWinPlayer
      for (var i = 0; i < row.Players.length; i++) {
        if (maxWinPlayer === undefined) {
          maxWinPlayer = row.Players[i]
        }
        if (row.Players[i].TurnMoney > maxWinPlayer.TurnMoney) {
          maxWinPlayer = row.Players[i]
        }
      }
      if (maxWinPlayer === undefined) {
        return ''
      }
      return this.getHdCardByUid(row, maxWinPlayer.Uid)
    },
    getHdCardByUid(row, uid) {
      for (var i = 0; i < row.Players.length; i++) {
        if (row.Players[i].Uid !== uid) {
          continue
        }
        return this.showCards(row.Players[i].HandCards)
      }
    },
    showCards(cardInfo) {
      var cardList = []
      for (var i = 0; i < cardInfo.length; i++) {
        cardList.push(this.getCardUrl(cardInfo[i]))
      }
      return cardList
    },
    getCardUrl(card) {
      return require('@/assets/poker_texas2d/' + card + '_card.png')
    },
    // 分页处理
    refreshShow() {
      this.currentData = []
      console.log(this.tableData.length)
      for (var i = (this.currentPage - 1) * this.pageNum; i < this.tableData.length; i++) {
        if (this.currentData.length === this.pageNum) {
          break
        }
        this.currentData.push(this.tableData[i])
      }
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageNum = val
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.refreshShow()
    },
    sortBy(attr, rev) {
      return function(a, b) {
        var l = a[attr]
        var r = b[attr]
        if (l < r) {
          return rev * -1
        }
        if (l > r) {
          return rev * 1
        }
        return 0
      }
    },
    sortChange(ob) {
      this.currentData.sort(this.sortBy(ob.prop, ob.order === 'ascending' ? 1 : -1))
    },
    formateDate(t, iType) {
      const dt = new Date(t * 1000)
      switch (iType) {
        case 1:
          return dt.Format('yyyy-MM-dd')
        case 2:
          return dt.Format('yyyy-MM-dd HH:mm:ss')
        case 3:
          return dt.Format('MM-dd')
        case 4:
          return dt.Format('HH:mm:ss')
        case 5:
          return dt.Format('HH:mm')
        case 6:
          return dt.Format('MM-dd HH:mm')
        case 7:
          return dt.Format('MM-dd HH:mm:ss')
      }
    }
  }
}
</script>
