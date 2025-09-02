<template>
  <div class="container">
    <!-- 筛选区 -->
    <el-form inline>
      <el-form-item label="导入时间">
        <el-date-picker
          v-model="searchViewInfo.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="searchViewInfo.searchUserId" clearable placeholder="请输入UID"/>
      </el-form-item>
      <el-form-item label="游戏">
        <el-select v-model="searchViewInfo.games" placeholder="请选择">
          <el-option
            v-for="(item,index) in allGames"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点">
        <el-select v-model="searchViewInfo.site" placeholder="请选择">
          <el-option
            v-for="(item,index) in allSite"
            :key="index"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchLogData()">查询</el-button>
      </el-form-item>
    </el-form>

    <!--    表格-->
    <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="updateAt" label="日期时间" align="center" min-width="200">
        <template slot-scope="scope">
          {{ formatTime(scope.row.TS) }}
        </template>
      </el-table-column>
      <el-table-column prop="Uid" label="UID" align="center" min-width="120"/>
      <el-table-column prop="amount" label="游戏名称" align="center" min-width="120">
        <template slot-scope="scope">
          {{ gameIdMap[Number(scope.row.Gid)] }}
        </template>
      </el-table-column>
      <el-table-column prop="Site" label="站点" align="center" min-width="100"/>
      <el-table-column prop="TotalBet" label="bet" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.TotalBet / 1000 }}
        </template>
      </el-table-column>
      <!--     todo 要请求另一个接口-->
      <!--      <el-table-column prop="uid" label="奖池总金额" align="center" min-width="100"/>-->
      <el-table-column prop="PoolChange" label="返奖金额" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.PoolChange / 1000 }}
        </template>
      </el-table-column>
      <el-table-column prop="PoolOdds" label="返奖倍数" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.PoolChange / scope.row.TotalBet }}
        </template>
      </el-table-column>
      <el-table-column prop="PoolAfter" label="返奖后奖池剩余金额" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.PoolChange / 1000 }}
        </template>
      </el-table-column>
      <el-table-column prop="StreamAfter" label="小奖池剩余金额" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.StreamAfter / 1000 }}
        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <div class="block">
      <el-pagination
        :current-page="pageInfo.GetCurrentPage()"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageInfo.GetPageNum()"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.GetTotalCount()"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>

import request from '@/utils/request'
import {Pagination} from '@/utils/common';
import store from "@/store";

export default {
  name: 'SlotsSmallPrize',
  data() {
    return {
      // 游戏id相关
      allGames: [],
      gameIdMap: [],
      gameNameMap: [],
      // 站点相关
      allSite: ['全部', 'BP', 'AP', 'GP', 'PG', 'Dev'],
      // 表格数据
      tableData: [],
      searchViewInfo: { // 界面搜索栏的相关数据
        dateRange: [],
        searchUserId: 0,
        games: '所有',
        site: '全部',
      },
      pageInfo: new Pagination(0, 100),
      reqDataInfo: { // 界面搜索栏的相关数据转化后形成的后端数据
        startTime: 0,
        endTime: 0,
        uid: 0,
        gids: -1,
        site: '',
        limit: 0,
        orderDesc: 0,
        Path: '/slotsStat/user/pool/log',
        Env: store.getters.env
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.setDefaultDateRange()
  },
  methods: {
    setDefaultDateRange() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const fmt = d => d.toISOString().slice(0, 10)
      this.searchViewInfo.dateRange = [fmt(start), fmt(end)]
    },
    async fetchData() {
      await this.getAllGames()
      await this.searchLogData()
    },
    getAllGames() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          this.allGames.push('所有')
          this.gameIdMap[-1] = '所有'
          this.gameNameMap['所有'] = -1
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            // const gameInfo = { Name: response.Data[i].Name, Gid: response.Data[i].Gid}
            this.allGames.push(response.Data[i].Name + '(' + response.Data[i].Gid + ')')
            this.gameIdMap[Number(response.Data[i].Gid)] = response.Data[i].Name
            this.gameNameMap[response.Data[i].Name + '(' + response.Data[i].Gid + ')'] = response.Data[i].Gid
          }
        }
      })
    },
    searchLogData() {
      this.convertView2RequestData()// 转成可请求的数据
      this.getUserPoolLog()
    },
    getUserPoolLog() {
      // 加载基础数值配置
      return request({
        url: '/dataProxy/info',
        method: 'get',
        data: this.reqDataInfo
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data.data ? response.Data.data : []
          console.log(' response.Data.data======>', response.Data.data)
          console.log(' this.tableData ======>', this.tableData)
          this.pageInfo.SetTotalCount(response.Data.total)
        }
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.pageInfo.SetPageNum(val)
      this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
    },
    handleCurrentChange(val) {
      this.pageInfo.SetPageNo(val)
      this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
    },
    convertView2RequestData() {
      this.reqDataInfo.startTime = this.UnixStart(this.searchViewInfo.dateRange[0])
      this.reqDataInfo.endTime = this.UnixEnd(this.searchViewInfo.dateRange[1])
      this.reqDataInfo.uid = this.searchViewInfo.searchUserId
      this.reqDataInfo.gids = this.gameNameMap[this.searchViewInfo.games]
      // this.reqDataInfo.site = this.searchViewInfo.site === '全部' ? '' : this.searchViewInfo.site // todo this.searchViewInfo.site 为'全部'的时候,是空???
      this.reqDataInfo.site = 'Dev'
      this.reqDataInfo.limit = 20 // todo需要后面修改
      this.reqDataInfo.orderDesc = false // todo需要后面修改
    },
    UnixStart(dateStr) {
      // 直接生成 Date 对象
      const date = new Date(dateStr)
      date.setHours(0, 0, 0, 0) // 设置到当天的第一秒
      // 毫秒时间戳
      const timestampMs = date.getTime()
      return Math.floor(timestampMs / 1000)
    },
    UnixEnd(dateStr) {
      // 直接生成 Date 对象
      const date = new Date(dateStr)
      date.setHours(23, 59, 59, 59) // 设置到当天的第最后一秒
      // 毫秒时间戳
      const timestampMs = date.getTime()
      return Math.floor(timestampMs / 1000)
    },
    formatTime(Unix) {
      // row.updateAt 是秒级时间戳，需要乘 1000 转成毫秒
      const date = new Date(Unix * 1000)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = date.getHours()
      const M = date.getMinutes()
      const S = date.getSeconds()
      return `${y}-${m}-${d} ` + (h > 9 ? h : '0' + h) + ':' + (M > 9 ? M : '0' + M) + ':' + (S > 9 ? S : '0' + S)
    },
  }
}
</script>

<style scoped>
.container {
  margin-top: 2%;
  margin-right: 1%;
  margin-left: 1%;
}
</style>
