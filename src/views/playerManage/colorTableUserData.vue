<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="120px" :inline="true" size="small">
        <el-form-item label="appId：">
          <el-input v-model="searchForm.appId" placeholder="请输入应用id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          
        </el-form-item>
        <el-form-item style="font-size:11px;color:#666666;">
          线上appId主要用1000005,查询多个appId,用英文逗号分隔即可。
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="userData" style="width: 100%">
        <el-table-column prop="tableId" label="桌子id" />
        <el-table-column prop="userNum" label="玩家人数" />
        <el-table-column prop="robotNum" label="机器人数" />
        <el-table-column prop="targetNum" label="时间段随机调控预期人数" />
      </el-table>
    </el-row>
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
        appId: ''
      },
      userData: [],
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
          Path: '/game/color/game/user/num',
          AppId: $this.searchForm.appId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.tableData != null) {
            $this.userData = response.Data.tableData
          } else {
            $this.userData = []
          }
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
  }
}
</script>
