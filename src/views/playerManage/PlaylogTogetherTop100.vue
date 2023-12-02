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
      <el-select v-model="tableMoney" size="mini">
        <el-option label="200" :value="200"/>
        <el-option label="100" :value="100"/>
        <el-option label="50" :value="50"/>
        <el-option label="20" :value="20"/>
        <el-option label="10" :value="10"/>
        <el-option label="5" :value="5"/>
      </el-select>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList">查询</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button v-for="id in gameSort" size="mini" @click="gid=id;getList()">{{ getGameName(id) }}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-table
        ref="filterTable"
        :data="topData"
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
        <el-table-column
          label="同桌数"
          prop="Count"
          width="100"
        />
        <el-table-column
          prop="Uid1"
          label="Uid1"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Uids[0] }}
          </template>
        </el-table-column>
        <el-table-column
          label="总局数1"
          prop="PlayCount1"
          width="100"
        />
        <el-table-column
          label="占比1"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color:red" v-if="scope.row.Count * 100 /scope.row.PlayCount1 > 80">
            {{ (scope.row.Count * 100 /scope.row.PlayCount1).toFixed(2) }}%
            </span>
            <span v-else>
              {{ (scope.row.Count * 100 /scope.row.PlayCount1).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Uid2"
          label="Uid2"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Uids[1] }}
          </template>
        </el-table-column>
        <el-table-column
          label="总局数2"
          prop="PlayCount2"
          width="100"
        />
        <el-table-column
          label="占比2"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color:red" v-if="scope.row.Count * 100 /scope.row.PlayCount2 > 80">
            {{ (scope.row.Count * 100 /scope.row.PlayCount2).toFixed(2) }}%
            </span>
            <span v-else>
              {{ (scope.row.Count * 100 /scope.row.PlayCount2).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>


      </el-table>
    </el-row>
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
      topData: [],
      tableMoney: 200,
      libShow: $libShow,
      gid: 22,
      ctime: new Date().getTime() - 86400000,
      gameSort: [22, 31],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime() - 86400000
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
        url: '/other/playlog/same/table/top100',
        method: 'get',
        data: {
          Gid: this.gid,
          CTime: Math.floor((this.ctime + 10800000) / 1000),
          TableMoney: this.tableMoney * 1000
        }
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          const item = response.Data || []
          this.topData = item

          console.log(this.topData)
        } else {
          Message.error(response.Data)
        }
      })
    }
  }
}
</script>
