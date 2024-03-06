<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-form label-width="80px" :inline="true" size="small">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="ctime"
          value-format="timestamp"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        当前游戏：<span style="color: red;">{{ getGameName(gid) }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button v-for="id in gameSort" size="mini" @click="gid=id;getList()">{{ getGameName(id) }}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-col :span="8">
      <el-table
        ref="filterTable"
        :data="winRank"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="赢 Top100">
          <el-table-column
            prop="Uid"
            label="Uid"
            width="100"
          />
          <el-table-column
            label="赢钱"
            prop="Win"
            width="100"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.Win/1000) }}
            </template>
          </el-table-column>
          <el-table-column
            label="牌局数"
            prop="Count"
            width="100"
          />
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="8">
      <el-table
        ref="filterTable"
        :data="countRank"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="数量 Top100">
          <el-table-column
            prop="Uid"
            label="Uid"
            width="100"
          />
          <el-table-column
            label="牌局数"
            prop="Count"
            width="100"
          />
          <el-table-column
            label="赢钱"
            prop="Win"
            width="100"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.Win/1000) }}
            </template>
          </el-table-column>
        </el-table-column>

      </el-table>
    </el-col>
    <el-col :span="8">
      <el-table
        ref="filterTable"
        :data="loseRank"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column label="输 Top100">
          <el-table-column
            prop="Uid"
            label="Uid"
            width="100"
          />
          <el-table-column
            label="赢钱"
            prop="Win"
            width="100"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.Win/1000) }}
            </template>
          </el-table-column>
          <el-table-column
            label="牌局数"
            prop="Count"
            width="100"
          />
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import { Loading, Message } from 'element-ui'

export default {
  data() {
    return {
      winRank: [],
      loseRank: [],
      countRank: [],
      libShow: $libShow,
      gid: 22,
      ctime: new Date().getTime() - 86400000,
      gameSort: [22, 10, 25, 23, 15, 20,34, 100, 101, 102, 103],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    getGameName(gid) {
      return $libShow.GameNames[gid]
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getList() {
      const loading = Loading.service({ fullscreen: true })
      request({
        url: '/other/playlog/top100',
        method: 'get',
        data: {
          Gid: this.gid,
          CTime: Math.floor((this.ctime + 10800000) / 1000)
        }
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          const item = response.Data || []
          this.winRank = item.WinRank
          this.loseRank = item.LoseRank
          this.countRank = item.CountRank

          console.log(this.showItem)
        } else {
          Message.error(response.Data)
        }
      })
    }
  }
}
</script>
