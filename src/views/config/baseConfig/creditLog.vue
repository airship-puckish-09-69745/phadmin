<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="Uid：">
          <el-input v-model="form.Uid" placeholder="请输入内容"  size="mini"></el-input>
        </el-form-item>
        <el-form-item label="游戏:">
          <el-select v-model="form.Gid" size="mini">
            <el-option v-for="v of GameOptions" :label="v.name" :value="v.gid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="场次:">
          <el-select v-model="form.Blind" size="mini">
            <el-option v-for="v of BlindOptions" :label="v.name" :value="v.val"/>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="form.Date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        ref="filterTable"
        :data="item.glconf"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column prop="Time" label="时间">
          <template slot-scope="scope">
            {{ scope.row.Time==0?"": new Date(scope.row.Time*1000).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="Gid" label="游戏">
          <template slot-scope="scope">
            {{ getGameName(scope.row.Gid) }}
          </template>
        </el-table-column>
        <el-table-column prop="Blind" label="场次">
          <template slot-scope="scope">
            {{ getLevelName(scope.row.Blind) }}
          </template>
        </el-table-column>
        <el-table-column prop="ValidBetScore" label="有效流水分">
        </el-table-column>
        <el-table-column prop="PlayRoundScore" label="玩牌局数分">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: [],
      isHidden: true, // 默认隐藏
      form: {
        Uid: 0,
        Date: $libDate.GetDayBegin(new Date().getTime()),
        Gid: 28,
        Blind: 1000,
        Limit: 100,
        Skil: 100,
      },
      libShow: $libShow,
      showSetResultPage: false,
      GameOptions: [
        { name: 'Pusoy', gid: 21},
        { name: 'Pusoy Swap', gid: 113},
        { name: 'Tongits', gid: 22},
        { name: 'Tongits Laizi', gid: 28},
        { name: 'Tongits Quick', gid: 29}
      ],
      BlindOptions: [
        { name: '1分', val: 1000},
        { name: '5分', val: 5000},
        { name: '10分', val: 10000},
        { name: '20分', val: 20000},
        { name: '50分', val: 50000},
        { name: '100分', val: 100000},
        { name: '200分', val: 200000},
        { name: '500分', val: 500000},
      ],
      envProjectname: process.env.VUE_APP_PROJECT
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_name)
    if (process.env.VUE_APP_PROJECT_name == '菲1-开发环境' || process.env.VUE_APP_PROJECT_name == '菲1-线上环境' || process.env.VUE_APP_PROJECT_name == 'Zoo-线上环境') {
      this.isHidden = false
    }
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/credit/log',
          Uid: this.form.Uid,
          Date: this.form.Date,
          Gid: this.form.Gid,
          Blind: this.form.Blind,
          Limit: this.form.Limit,
          Skip: this.form.Skip,
          Sort: ""
        }
      }).then(response => {
        // console.log(response)
        if (response.RetCode === 0) {
          $this.item = response.Data
          console.log(response.Data)
        }
      })
    },
    getGameName(gid) {
      for (const v of this.GameOptions) {
        if (v.gid === gid) {
          return v.name
        }
      }
      return "unknow"
    },
    getLevelName(blind) {
      for (const v of this.BlindOptions) {
        if (v.val === gid) {
          return v.name
        }
      }
      return "unknow"
    }
  }
}
</script>
