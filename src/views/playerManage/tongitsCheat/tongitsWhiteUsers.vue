<script>
import request from '@/utils/request'
import { $libDate, ClientTableData } from '@/utils/common'
import { getInfo } from '@/api/user'

export default {
  data() {
    return {
      checkTime: { start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()) },
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      clientDB: new ClientTableData([], 1, {}),
      Uid : 0,
      Gid: 0,
      gidOption: [
        { label: '全部', value: 0 },
        { label: 'TONGITS POT', value: 22 },
        { label: 'TONGITS JOKER', value: 28 },
        { label: 'TONGITS QUICK', value: 29 }
      ],
      sortType: 1,
      sortTypeOption: [
        { label: '信誉分', value: 1 },
        { label: '历史最高信誉分', value: 2 },
        { label: '历史最高疑似度', value: 3 }
      ],
      regiestType: 1,
      regiestTypeOption: [
        { label: '排除近1周注册', value: 1 },
        { label: '排除近1个月注册', value: 2 }
      ],
      userType: 1,
      userTypeOption: [
        { label: '非认证高信', value: 1 },
        { label: '认证高信', value: 2 }
      ],
      tableMoneyType: [10000, 20000, 50000, 100000, 200000, 500000, 1000000],
      tableMoneyOption: [
        { label: '10P场次', value: 10000 },
        { label: '20P场次', value: 20000 },
        { label: '50P场次', value: 50000 },
        { label: '100P场次', value: 100000 },
        { label: '200P场次', value: 200000 },
        { label: '500P场次', value: 500000 },
        { label: '1000P场次', value: 1000000 }
      ],
      logs: [
      ],
      operlogs: [],
      blindList: JSON.stringify([10000, 20000, 50000, 100000, 200000, 500000, 1000000]),
      regTime: $libDate.GetDayBegin(new Date().getTime()) / 1000 - 24 * 60 * 60 * 7,
      trustType: 0,
      maxCount: 0,
      page: 1
    }
  },
  created() {
    this.getOperator()
    // this.getData()
  },
  methods: {
    getOperator() {
      const $this = this
      getInfo(this.$store.getters.token).then(function(response) {
        if (response.RetCode === 0) {
          $this.BlackOperator = response.Data.nick
        }
      }).catch((e) => {
        console.log('getOperator failed', e)
      })
    },
    getSortType() {
      let sortType = 'TrustScore'
      if (this.sortType === 2) {
        sortType = 'MaxTrustScore'
      } else if (this.sortType === 3) {
        sortType = 'MaxCheatScore'
      }
      return sortType
    },
    getNewData() {
      const $this = this
      if ($this.Uid === undefined || $this.Uid === null || $this.Uid === '') {
        $this.Uid = 0
      }
      $this.page++
      $this.logs = this.clientDB.TotalData
      this.blindList = JSON.stringify(this.tableMoneyType)
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat//white/list',
          regTime: this.regTime,
          queryTime: this.checkTime.start / 1000,
          gid: this.Gid,
          page: this.page,
          limit: 100,
          uid: this.Uid,
          blindList: this.blindList,
          trustType: this.trustType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.maxCount = response.Data.MaxCount
          const items = response.Data.Items || []
          for (let i = 0; i < items.length; i++) {
            this.logs.push({
              Uid: items[i].uid,
              RegTime: items[i].regTime,
              GGR: items[i].ggr,
              CheatType: items[i].cheatType,
              CheatScore: items[i].cheatScore,
              MaxCheatScore: items[i].maxCheatScore,
              CheatOperator: items[i].cheatOperator,
              TrustType: items[i].trustType,
              TrustScore: items[i].trustScore,
              MaxTrustScore: items[i].maxTrustScore
            })
          }
          const sortType = this.getSortType()
          this.clientDB = new ClientTableData(this.logs, this.pageNum, {}, sortType, -1, 'Uid')
        }
      })
    },
    getData() {
      const $this = this
      $this.page = 1
      $this.logs = []
      if ($this.Uid === undefined || $this.Uid === null || $this.Uid === '') {
        $this.Uid = 0
      }
      this.blindList = JSON.stringify(this.tableMoneyType)
      $this.clientDB = new ClientTableData([], 1, {})
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat//white/list',
          regTime: this.regTime,
          queryTime: this.checkTime.start / 1000,
          gid: this.Gid,
          page: this.page,
          limit: 100,
          uid: this.Uid,
          blindList: this.blindList,
          trustType: this.trustType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.maxCount = response.Data.MaxCount
          const items = response.Data.Items || []
          for (let i = 0; i < items.length; i++) {
            this.logs.push({
              Uid: items[i].uid,
              RegTime: items[i].regTime,
              GGR: items[i].ggr,
              CheatType: items[i].cheatType,
              CheatScore: items[i].cheatScore,
              MaxCheatScore: items[i].maxCheatScore,
              CheatOperator: items[i].cheatOperator,
              CheatOperTime: items[i].cheatOperTime,
              TrustType: items[i].trustType,
              TrustScore: items[i].trustScore,
              MaxTrustScore: items[i].maxTrustScore
            })
          }
          const sortType = this.getSortType()
          this.clientDB = new ClientTableData(this.logs, this.pageNum, {}, sortType, -1, 'Uid')
          $this.handleCurrentChange(1)
        }
      })
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      // 查看是否还有数据
      if (this.clientDB.TotalData.length <= this.maxCount && val !== 1) {
        if (this.clientDB.TotalData.length - this.pageNum * val <= this.pageNum * 2) {
          this.getNewData()
        }
      }
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    refreshShow() {
      this.operlogs = this.clientDB.GetCurrentPageData()
      this.logs = this.clientDB.GetCurrentPageData()
    },
    formatTimeDate(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    changeWhite(row) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/user/type',
          UserType: 3,
          Uid: row.Uid,
          Gid: this.Gid,
          Reason: '',
          Operator: this.BlackOperator
        }
      }).then(response => {
        if (response.RetCode === 0) {
          row.CheatType = 3
          row.CheatOperator = this.BlackOperator
          row.CheatOperTime = Date.now() / 1000
          this.clientDB.UpdateData2('Uid', row)
        }
      })
      this.refreshShow()
    },
    changeSomeWhite() {
      const logs = this.clientDB.GetCurrentPageData()
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        if (log.UserType === 3) {
          continue
        }
        this.changeWhite(log)
      }
    },
    channelWhite(row) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/channel/white',
          UserType: 3, // 认证高信的身份
          uid: row.Uid,
          gid: this.Gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          if (data.UserType !== undefined && data.TrustLevel !== undefined) {
            row.CheatType = data.UserType
            row.TrustType = data.TrustLevel
            row.CheatOperator = ''
            this.clientDB.UpdateData2('Uid', row)
          }
        } else {
          console.log(response.Data)
        }
      })
      this.refreshShow()
    },
    save(row) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/user/type',
          UserType: 2,
          Uid: this.editBlack.Uid,
          Gid: 22,
          Reason: this.editBlack.Reason,
          Operator: this.editBlack.Operator
        }
      }).then(response => {
      })
      this.refreshShow()
    },
    showWhiteButton(row) {
      return row.CheatType !== 3
    },
    showNoWhiteButton(row) {
      return row.CheatType === 3
    },
    formatUserTrustLevel(row) {
      const userType = row.CheatType
      if (userType === 3) {
        return '认证高信'
      }
      const trustLevel = row.TrustType
      switch (trustLevel) {
        case 1:
          return '低危用户'
        case 2:
          return '疑似用户'
        case 3:
          return '黑子用户'
        case 4:
          return '低信用户'
        case 5:
          return '高信用户'
        default:
          return '--'
      }
    },
    changeSortType() {
      const sortType = this.getSortType()
      const logs = this.clientDB.TotalData
      this.clientDB = new ClientTableData(logs, this.pageNum, {}, sortType, -1, 'Uid')
      this.handleCurrentChange(1)
    },
    changeRegiestType() {
      if (this.regiestType === 1) {
        this.regTime = this.checkTime.start / 1000 - 24 * 60 * 60 * 7
      } else {
        this.regTime = this.checkTime.start / 1000 - 24 * 60 * 60 * 30
      }
    },
    changeTableMoneyType() {
      // this.tableMoneyType
      // this.blindList = JSON.stringify(blindList)
    },
    changeUserType() {
      let trustType = 0
      if (this.userType === 2) {
        trustType = 1
      }
      this.trustType = trustType
    },
    showMaxTrustScore(row) {
      return '<span style="color: darkgreen">' + row.MaxTrustScore + '</span>'
    },
    showMaxCheatScore(row) {
      return '<span style="color: darkred">' + row.MaxCheatScore + '</span>'
    },
    showOperInfo(row) {
      if (row.CheatOperator !== undefined && row.CheatOperator !== '' && row.CheatType === 3) {
        return $libDate.FormateSecondStr(row.CheatOperTime, 2) + ' 由 ' + row.CheatOperator + ' 认证'
      } else {
        return ''
      }
    }
  }
}
</script>

<template>
  <el-col class="app-container">
    <el_row>
      <el-form :model="checkTime" label-width="90px" :inline="true" size="small">
        <el-form-item label="选择日期：">
          <el-date-picker
            v-model="checkTime.start"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="UID：">
          <el-input v-model.number="Uid" />
        </el-form-item>
        <el-form-item label="排序方式：">
          <el-select v-model.number="sortType" placeholder="请选择" @change="changeSortType">
            <el-option
              v-for="itemSort in sortTypeOption"
              :key="itemSort.value"
              :label="itemSort.label"
              :value="itemSort.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-select v-model.number="regiestType" placeholder="请选择" @change="changeRegiestType">
            <el-option
              v-for="itemRegiestType in regiestTypeOption"
              :key="itemRegiestType.value"
              :label="itemRegiestType.label"
              :value="itemRegiestType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份：">
          <el-select v-model.number="userType" placeholder="请选择" @change="changeUserType">
            <el-option
              v-for="itemUserType in userTypeOption"
              :key="itemUserType.value"
              :label="itemUserType.label"
              :value="itemUserType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏：">
          <el-select v-model.number="Gid" placeholder="请选择">
            <el-option
              v-for="itemGid in gidOption"
              :key="itemGid.value"
              :label="itemGid.label"
              :value="itemGid.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="场次：">
          <el-select v-model="tableMoneyType" multiple placeholder="请选择">
            <el-option
              v-for="itemTableMoney in tableMoneyOption"
              :key="itemTableMoney.value"
              :label="itemTableMoney.label"
              :value="itemTableMoney.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="changeSomeWhite">批量认证本页</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="logs"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="Uid"
          label="玩家ID"
          width="100"
          align="center"
        />
        <el-table-column
          label="注册时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ formatTimeDate(scope.row.RegTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="信任等级"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatUserTrustLevel(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="TrustScore"
          label="当前信誉分"
          width="200"
          align="center"
        />
        <el-table-column
          label="历史最高信誉分"
          width="200"
          align="center"
        >
          <template slot-scope="scopeInfo">
            <p v-html="showMaxTrustScore(scopeInfo.row)" />
          </template>
        </el-table-column>
        <el-table-column
          label="历史最高疑似度"
          width="200"
          align="center"
        >
          <template slot-scope="scopeInfo">
            <p v-html="showMaxCheatScore(scopeInfo.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="GGR"
          label="近7日GGR"
          width="200"
          align="center"
        />
        <el-table-column
          label="操作历史"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ showOperInfo(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" :disabled="showWhiteButton(scope.row)" @click="channelWhite(scope.row)">
              取消认证
            </el-button>
            <el-button type="primary" size="small" :disabled="showNoWhiteButton(scope.row)" @click="changeWhite(scope.row)">
              认证高信
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="clientDB.GetPage().GetCurrentPage()"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="clientDB.GetPage().GetPageNum()"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clientDB.GetPage().GetTotalCount()"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el_row>
  </el-col>

</template>

<style scoped>

</style>
