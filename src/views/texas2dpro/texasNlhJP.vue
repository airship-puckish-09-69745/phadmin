<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="级别">
           <el-select v-model="searchForm.Level" placeholder="请选择">
            <el-option v-for="(item, key) in levelList" :key="key" :value="showLevel(item)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
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
        prop="SmallBlind"
        label="级别"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ showLevel(scope.row.SmallBlind/1000) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="JackPot"
        label="JP实时奖池剩余"
      >
        <template slot-scope="scope">
          {{ scope.row.Jackpot/1000 }}
        </template>
      </el-table-column>
       <el-table-column label="当前级别中奖明细" column-key="op" width="180">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" type="primary" size="mini"  @click="handJackPotRecord(scope.row)" >查询</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" column-key="op" width="160">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini"  @click="handChangeJackPot(scope.row)">更改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row type="flex" justify="end">
      <el-col :span="6">
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
    <el-dialog :title="getTitle()" :visible.sync="editShow" center width="30%">
      <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="editValue" placeholder="输入JackPot奖池" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="getTitle()" :visible.sync="recordShow" width="75%">
      <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
        <el-row>
          <el-form :model="searchRecordForm" label-width="60px" :inline="true" size="small">
            <el-form-item label="">
              <el-date-picker
                v-model="searchRecordForm.BeginDate"
                value-format="timestamp"
                type="date"
                placeholder="开始时间"
              />
            </el-form-item>
            <el-form-item label="">
              <span> - </span>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                v-model="searchRecordForm.EndDate"
                value-format="timestamp"
                type="date"
                placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="">
              <el-form-item label="玩家id">
                <el-input v-model.number="searchRecordForm.Uid" size="mini" placeholder="玩家id" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="searchCurrRecord(1)">查询</el-button>
              </el-form-item>
            </el-form-item>

            <el-form-item label="">
              <el-form-item label="牌局id">
                <el-input v-model.number="searchRecordForm.LogID" size="mini" placeholder="牌局id" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="searchCurrRecord(2)">查询</el-button>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table
          ref="filterTable"
          :data="currentRecordData"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="padding:10px;width: 100%"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="SmallBlind"
            label="级别"
            width='60%'
          >
            <template slot-scope="scope">
              {{ showLevel(scope.row.SmallBlind/1000) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Time"
            label="时间"
            width='160%'
          >
            <template slot-scope="scope">
              {{ formateDate(scope.row.Time, 2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="NickName"
            label="玩家昵称"
          >
            <template slot-scope="scope">
              {{ showNickName(scope.row.Profile) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Uid"
            label="玩家ID"
          >
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>
          <el-table-column
            prop="HdCards"
            label="手牌"
            width='100%'
          >
            <template slot-scope="scope">
              <el-image v-for="(item, index) in showCards(scope.row.CardInfo, 1)" :key="index" :src="item" :preview-src-list="[item]" style="width: 32px; height: 48px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="PublichCards"
            label="公共牌"
            width='200%'
          >
            <template slot-scope="scope">
              <el-image v-for="(item, index) in showCards(scope.row.CardInfo, 2)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="BestCards"
            label="获奖牌型"
            width='200%'
          >
            <template slot-scope="scope">
              <el-image v-for="(item, index) in showCards(scope.row.CardInfo, 3)" :key="index" :src="item" :preview-src-list="[item]" style="width: 32px; height: 48px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="Money"
            label="获奖金额"
          >
            <template slot-scope="scope">
              {{ scope.row.Money }}
            </template>
          </el-table-column>
           <el-table-column
            prop="BeforeMoney"
            label="触发前JP余额"
          >
            <template slot-scope="scope">
              {{ scope.row.BeforeMoney }}
            </template>
          </el-table-column>
          <el-table-column
            prop="AfterMoney"
            label="触发后JP余额"
          >
            <template slot-scope="scope">
              {{ scope.row.AfterMoney }}
            </template>
          </el-table-column>
           <el-table-column
            prop="LogId"
            label="牌局ID"
            width='180%'
          >
            <template slot-scope="scope">
              <router-link :to= "{name: 'texasNlhInsure', params: {Uid: 100 }}" @click.native="recordShow = false" style="color: blue">
                {{ scope.row.LogId }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-row type="flex" justify="end">
          <el-col :span="6">
            <div class="block">
              <el-pagination
                :current-page="currentRecordPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalRecordCount"
                @size-change="handleSizeRecordChange"
                @current-change="handleCurrentRecordChange"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
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
        Level: ''
      },
      levelList: [],
      tableData: [],
      currentData: [],
      editShow: false,
      editValue: 0,
      currLevel: 0,
      recordShow: false,
      totalCount: 0,
      currentPage: 1,
      pageNum: 10,
      libShow: $libShow,
      searchRecordForm: {
        BeginDate: $libDate.GetDayBegin(new Date().getTime()),
        EndDate: $libDate.GetDayBegin(new Date().getTime()),
        Uid: '',
        LogID: ''
      },
      tableRecordData: [],
      currentRecordData: [],
      totalRecordCount: 0,
      currentRecordPage: 1
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/tesasnlhdata/jackpot',
          Level: Number(_this.searchForm.Level)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          if (objs.total > 0) {
            _this.totalCount = objs.list.length
            _this.tableData = objs.list
            _this.currentPage = 1
            _this.getLevelList()
            _this.refreshShow()
          } else {
            _this.totalCount = 0
            _this.tableData = []
          }
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
    },
    searchRecord() {
      this.tableRecordData = []
      this.currentRecordData = []
      this.totalRecordCount = 0
      this.currentRecordPage = 1
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/tesasnlhdata/jackpotrecord',
          Level: Number(this.currLevel * 1000)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            return
          }
          if (objs.total > 0) {
            console.log(objs.list)
            _this.totalRecordCount = objs.total
            _this.tableRecordData = objs.list
            _this.currentRecordPage = 1
            _this.refreshRecordShow()
          } else {
            _this.totalRecordCount = 0
            _this.tableRecordData = []
          }
        } else {
          Message.error(response.Data)
        }
      })
    },
    searchCurrRecord(type) {
      console.log(type, this.tableRecordData)
      if (this.searchRecordForm.Uid !== '' || this.searchRecordForm.LogID !== '') {
        this.currentRecordData = []
      } else {
        this.searchRecord()
      }
      for (var i = 0; i < this.tableRecordData.length; i++) {
        if (type === 1 && this.searchRecordForm.Uid === this.tableRecordData[i].Uid) {
          this.currentRecordData.push(this.tableRecordData[i])
        }
        if (type === 2 && this.searchRecordForm.LogID === this.tableRecordData[i].LogId) {
          this.currentRecordData.push(this.tableRecordData[i])
        }
      }
      this.totalRecordCount = this.currentRecordData.length
      this.currentRecordPage = 1
    },
    getTitle() {
      return this.editShow ? this.showLevel(this.currLevel) + ' 级别JP实时奖池' : 'JackPot当前级别中奖明细查询'
    },
    getLevelList() {
      this.levelList = []
      for (var i = 0; i < this.tableData.length; i++) {
        this.levelList.push(Number(this.tableData[i].SmallBlind))
      }
      this.levelList.sort(function(a, b) { return a - b })
    },
    showLevel(level) {
      return level + '/' + level * 2
    },
    showNickName(profile) {
      return JSON.parse(profile)['player_name']
    },
    showCards(cardInfo, type) {
      var cardList = []
      var jsonObj = JSON.parse(cardInfo)
      var cards = []
      if (type === 1) {
        if ('hd_cards' in jsonObj) {
          cards = jsonObj['hd_cards']
        }
      } else if (type === 2) {
        if ('public_cards' in jsonObj) {
          cards = jsonObj['public_cards']
        }
      } else {
        if ('cards' in jsonObj) {
          cards = jsonObj['cards']
        }
      }
      for (var i = 0; i < cards.length; i++) {
        cardList.push(this.getCardUrl(cards[i]))
      }
      return cardList
    },
    getCardUrl(card) {
      return require('@/assets/poker_texas2d/' + card + '_card.png')
    },
    // 分页处理
    refreshShow() {
      this.currentData = []
      for (var i = (this.currentPage - 1) * this.pageNum; i < this.tableData.length; i++) {
        if (this.currentData.length === this.pageNum) {
          break
        }
        this.currentData.push(this.tableData[i])
      }
    },
    refreshRecordShow(ob) {
      this.currentRecordData = []
      for (var i = (this.currentRecordPage - 1) * this.pageNum; i < this.tableRecordData.length; i++) {
        if (this.currentRecordData.length === this.pageNum) {
          break
        }
        this.currentRecordData.push(this.tableRecordData[i])
      }
    },
    handJackPotRecord(ob) {
      this.currLevel = ob.SmallBlind / 1000
      this.recordShow = true
      this.searchRecord()
    },
    handChangeJackPot(ob) {
      this.currLevel = ob.SmallBlind / 1000
      this.editShow = true
      for (var i = 0; i < this.tableData.length; i++) {
        if (ob.SmallBlind === this.tableData[i].SmallBlind) {
          this.editValue = this.tableData[i].Jackpot / 1000
        }
      }
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageNum = val
      this.refreshShow()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.refreshShow()
    },
    handleSizeRecordChange(val) {
      this.pageNum = val
      this.refreshRecordShow()
    },
    handleCurrentRecordChange(val) {
      console.log(val)
      this.currentRecordPage = val
      this.refreshRecordShow()
    },
    confirmDelete() {
      this.editShow = false
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
