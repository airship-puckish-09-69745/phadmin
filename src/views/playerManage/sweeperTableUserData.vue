<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="120px" :inline="true" size="small">
        <el-form-item label="桌子id：">
          <el-input v-model="searchForm.tid" placeholder="请输入桌子id" />
        </el-form-item>
        <el-form-item label="srvId：">
          <el-input v-model="searchForm.srvId" placeholder="请输入服务id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="userData" style="width: 100%" :default-sort="{prop: 'playTimes', order: 'ascending'}">
        <el-table-column prop="uid" label="玩家id" />
        <el-table-column prop="seat" label="座位" />
        <el-table-column prop="isOffline" label="在线状态">
          <template slot-scope="scope">
            {{ checkOffline(scope.row.isOffline ) }}
          </template>
        </el-table-column>
        <el-table-column prop="playTimes" sortable label="玩牌次数" />
        <el-table-column prop="moneyOwned" label="当前持有筹码">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.moneyOwned ) }}
          </template>
        </el-table-column>
        <el-table-column prop="app" label="应用id" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button round @click="getOnlineData(scope.row.uid)">在线信息</el-button>
            <el-popconfirm title="确定将玩家从桌子踢出？" @confirm="removeTable(scope.row.uid)">
              <el-button slot="reference" type="danger" round>踢出桌子</el-button>
            </el-popconfirm>
          </template>

        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="用户在线状态" :visible.sync="onlineDialogShow" width="50%">
      <el-descriptions title="">
        <el-descriptions-item label="用户id">{{ onlineData.uid }}</el-descriptions-item>
        <el-descriptions-item label="游戏id">{{ onlineData.upstream_type }}</el-descriptions-item>
        <el-descriptions-item label="srvId">{{ onlineData.upstream_id }}</el-descriptions-item>
        <el-descriptions-item label="桌子id">{{ onlineData.upstream_table }}</el-descriptions-item>
        <el-descriptions-item label="座位号">{{ onlineData.upstream_seat }}</el-descriptions-item>

        <el-descriptions-item label="登录时间">{{ formatTime(onlineData.login_at) }}</el-descriptions-item>
        <el-descriptions-item label="进入房间时间">{{ formatTime(onlineData.enter_at) }}</el-descriptions-item>
        <el-descriptions-item label="上次活跃时间">{{ formatTime(onlineData.last_active_at) }}</el-descriptions-item>
        <el-descriptions-item label="离线时间">{{ formatTime(onlineData.offlineAt) }}</el-descriptions-item>
        <el-descriptions-item label="离线次数">{{ onlineData.offline_count }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">{{ onlineData.online_status }}</el-descriptions-item>
        <el-descriptions-item label="玩牌状态">{{ onlineData.play_status }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate } from '@/utils/common'
import request from '@/utils/request'
export default {
  name: 'RocketRet',
  data() {
    return {
      searchForm: {
        tid: '',
        srvId: ''
      },
      userData: [],
      onlineDialogShow: false,
      onlineData: {}
    }
  },
  created() {

  },
  methods: {
    search() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/sweeperud',
          tid: $this.searchForm.tid,
          srvId: $this.searchForm.srvId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.details != null) {
            $this.userData = response.Data.details
          } else {
            $this.userData = []
          }
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    checkOffline(status) {
      return status ? '离线' : '在线'
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.getOnlineData(row.uid)
      }
    },
    getOnlineData(uid) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/online',
          uid: uid
        }
      }).then(response => {
        $this.onlineData = {}
        if (response.RetCode === 0) {
          if (response.Data != null) {
            $this.onlineData = response.Data
          }
          this.onlineDialogShow = true
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    removeTable(uid) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/remove/from/table',
          uid: uid,
          tid: $this.searchForm.tid,
          srvId: $this.searchForm.srvId,
          gid: 20
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.code == 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
          }
        } else {
          this.$message.error(response.Data)
        }
      })
    }
  }
}
</script>
