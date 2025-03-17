<script>
import request from "@/utils/request";
import {$libDate} from "@/utils/common";

export default {
  data() {
    return {
      cheatLogs: [],
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      Gid:21,
      options: [{
        value: 21,
        label: 'PUSOY'
      }, {
        value: 126,
        label: 'PUSOYWILD'
      }],
      blacks: [],
      blackuids :[]
    }
  },
  created() {
  },
  methods: {
    getDataInfo(){
      this.getData()
      this.getBlackData()
    },
    async getBlackData(){
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black',
          Page: 1,
          Limit: 100,
          Gid: this.Gid,
          Uid: 0,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          $this.blacks = data.Items || []
          for (let i = 0; i < $this.blacks.length; i++) {
            const black = $this.blacks[i]
            $this.blackuids.push(black.Uid1)
            $this.blackuids.push(black.Uid2)
            $this.blackuids.push(black.Uid3)
          }
        }
      })
    },
    getData(){
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/cheat/log',
          Page: this.currentPage,
          Limit: this.pageNum,
          Gid: this.Gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          $this.cheatLogs = data.Items || []
          $this.totalCount = data.Total || 0
          for (let i = 0; i < $this.cheatLogs.length; i++) {
            const cheatLog = $this.cheatLogs[i]
            const userInfo = []
            userInfo.push({"Uid": cheatLog.Uid1, "BeforeMoney": cheatLog.BeforeMoney1, "ChangeMoney": cheatLog.ChangeMoney1, "AfterMoney": cheatLog.AfterMoney1})
            userInfo.push({"Uid": cheatLog.Uid2, "BeforeMoney": cheatLog.BeforeMoney2, "ChangeMoney": cheatLog.ChangeMoney2, "AfterMoney": cheatLog.AfterMoney2})
            userInfo.push({"Uid": cheatLog.Uid3, "BeforeMoney": cheatLog.BeforeMoney3, "ChangeMoney": cheatLog.ChangeMoney3, "AfterMoney": cheatLog.AfterMoney3})
            cheatLog.userInfo = userInfo
          }
        }
      })
    },
    showBlackButton(row){
      const cheatUids = []
      cheatUids.push(row.Uid1)
      cheatUids.push(row.Uid2)
      cheatUids.push(row.Uid3)
      for (let i = 0; i < cheatUids.length; i++) {
        const uid = cheatUids[i]
        if (!this.blackuids.includes(uid)) {
          return true
        }
      }
      return false
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatGameId(gameId) {
      if (gameId == 21) {
        return 'Pusoy'
      }else {
        return 'PusoyWild'
      }
    },
    getSummaries(row) {
      return row.ChangeMoney1 + row.ChangeMoney2 + row.ChangeMoney3
    },
    formatUid(uid) {
      if (this.blackuids.includes(uid)) {
        return uid + ' (已拉黑)'
      } else {
        return uid
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    handleClick(row){
      this.addToBlack(row)
      this.getDataInfo()
    },
    async addToBlack(row){
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black/add',
          Uid1: row.Uid1,
          Uid2: row.Uid2,
          Uid3: row.Uid3,
          Gid: row.Gid,
          Tid: row.Tid,
          FinishTime:row.FinishTime,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.$message.success('添加成功')
        }else {
          $this.$message.error('添加失败')
        }
      })
    }
  }
}
</script>

<template>

  <div class="app-container">
    <el-row :span="6">
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="6">
          <el-form-item label="游戏：" :required="true">
            <el-select v-model.number="Gid" placeholder="请选择">
              <el-option
                v-for="itemGid in options"
                :key="itemGid.value"
                :label="itemGid.label"
                :value="itemGid.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getDataInfo">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="cheatLogs"
        border
        style="width: 100%">
        <el-table-column
          label="玩家信息"
          width="630">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.userInfo"
              border
              style="width: 100%">
              <el-table-column
                prop="Uid"
                label="玩家ID"
                width="150">
                <template slot-scope="scope">
                  {{ formatUid(scope.row.Uid) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="BeforeMoney"
                label="玩家起始资金"
                width="150">
              </el-table-column>
              <el-table-column
                prop="ChangeMoney"
                label="玩家变化资金"
                width="150">
              </el-table-column>
              <el-table-column
                prop="AfterMoney"
                label="玩家最终资金"
                width="150">
              </el-table-column>
            </el-table>
          </template>

        </el-table-column>
        <el-table-column
          prop="CrackTimes"
          label="crack次数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ZeroTimes"
          label="0分值次数"
          width="120">
        </el-table-column>

        <el-table-column
          prop="PlayTimes"
          label="总局数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="PlayTimes"
          label="总盈亏"
          width="120">
          <template slot-scope="scope">
            {{ getSummaries(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Gid"
          label="游戏"
          width="120">
          <template slot-scope="scope">
            {{ formatGameId(scope.row.Gid) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="TableMoney"
          sortable
          label="场次"
          width="120">
        </el-table-column>
        <el-table-column
          prop="FinishTime"
          sortable
          label="最新时间"
          width="120">
          <template slot-scope="scope">
            {{ formatTime(scope.row.FinishTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              v-if="showBlackButton(scope.row)"
              @click="handleClick(scope.row)"
              type="primary"
              size="mini"
            >添加黑名单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
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

<style>

</style>
