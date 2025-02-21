<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="Uid：">
          <UidInput ref="uidInput" @setUid="function(iUid){form.Uid=iUid}" />
          <!-- <el-input v-model="form.Uid" placeholder="请输入内容"  size="mini"></el-input> -->
        </el-form-item>
        <el-form-item label="游戏:">
          <el-select v-model="form.Gid" size="mini">
            <el-option v-for="v of GameOptions" :label="v.name" :value="v.gid"/>
            <el-option label="所有" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="场次:">
          <el-select v-model="form.Blind" size="mini">
            <el-option v-for="v of BlindOptions" :label="v.name" :value="v.val"/>
            <el-option label="所有" :value="0" />
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
          <el-button type="primary" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        ref="filterTable"
        :data="item"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column prop="time" label="时间">
          <template slot-scope="scope">
            {{ scope.row.time==0?"": new Date(scope.row.time*1000).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="gid" label="游戏">
          <template slot-scope="scope">
            {{ getGameName(scope.row.gid) }}
          </template>
        </el-table-column>
        <el-table-column prop="blind" label="场次">
          <template slot-scope="scope">
            {{ getLevelName(scope.row.blind) }}
          </template>
        </el-table-column>
        <el-table-column prop="validBetScore" label="有效流水分">
        </el-table-column>
        <el-table-column prop="playRoundScore" label="玩牌局数分">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="form.currentPage"
            :page-sizes="[20, 30, 40]"
            :page-size="form.Limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.TotalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import UidInput from '@/components/UidInput'
import { string } from 'clipboard'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      env: 'test',
      item: [],
      form: {
        Uid: 0,
        Date: $libDate.GetDayBegin(new Date().getTime()),
        Gid: 0,
        Blind: 0,
        Limit: 20,
        Skip: 0,
        currentPage: 1,
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
  mounted() {
    this.env = store.getters.env || this.env
    if (this.$route.query && this.$route.query.uid > 0) {
      this.form.Uid = parseInt(this.$route.query.uid)
      this.$refs.uidInput.saveUid(this.form.Uid)
      console.log('set mounted', this.form.Uid)
    }
  },
  activated() {
    if (this.$route.query && this.$route.query.uid > 0) {
      this.form.Uid = parseInt(this.$route.query.uid)
      this.$refs.uidInput.saveUid(this.form.Uid)
      console.log('set activated', this.form.Uid)
    }
    this.getInfo()
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_name)
    if (process.env.VUE_APP_PROJECT_name == '菲1-开发环境' || process.env.VUE_APP_PROJECT_name == '菲1-线上环境' || process.env.VUE_APP_PROJECT_name == 'Zoo-线上环境') {
      this.isHidden = false
    }
    // this.getInfo()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getInfo() {
      if (this.form.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      const args = {
        Env: this.env,
        Path: '/misc/credit/log',
        Uid: this.form.Uid,
        Date: this.formatDateToYYYYMMDD(new Date(this.form.Date)),
        Gid: this.form.Gid,
        Blind: this.form.Blind,
        Limit: this.form.Limit,
        Skip: (this.form.currentPage-1) * this.form.Limit,
        Sort: ""
      }
      console.log("/dataProxy/info", args)
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: args,
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          if (typeof response.Data === "string") {
            $this.item = []
          } else {
            $this.item = response.Data
          }
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
        if (v.val === blind) {
          return v.name
        }
      }
      return "unknow"
    },
    // 定义一个函数，用于将 Date 对象转换为指定格式的字符串
    formatDateToYYYYMMDD(date) {
        // 获取年份
        const year = date.getFullYear();
        // 获取月份，并确保月份是两位数（不足两位前面补 0）
        const month = String(date.getMonth() + 1).padStart(2, '0');
        // 获取日期，并确保日期是两位数（不足两位前面补 0）
        const day = String(date.getDate()).padStart(2, '0');

        // 拼接成 20250221 格式的字符串
        return Number(`${year}${month}${day}`);
    },
    handleSizeChange(val) {
      this.form.Limit = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.form.currentPage = val
      this.getInfo()
    },
  }
}
</script>
