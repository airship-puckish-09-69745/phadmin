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
        <el-date-picker
          v-model="form.DateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
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
        show-summary
        :summary-method="getSummaries"
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        :default-sort = "{prop: 'gid', order: 'descending'}"
      >
        <el-table-column prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="gid" label="游戏" sortable="custom">
          <template slot-scope="scope">
            {{ getGameName(scope.row.gid) }}
          </template>
        </el-table-column>
        <el-table-column prop="blind" label="场次" sortable="custom">
          <template slot-scope="scope">
            {{ getLevelName(scope.row.blind) }}
          </template>
        </el-table-column>
        <el-table-column prop="validBetScore" label="有效流水分">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.validBetScore/1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="playRoundScore" label="玩牌局数分">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.playRoundScore/1000) }}
          </template>
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
import { $libDate, $libShow, $libType } from '@/utils/common'
import store from '@/store'
import UidInput from '@/components/UidInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput},
  data() {
    return {
      env: 'test',
      item: [],
      form: {
        Uid: 0,
        DateRange: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 3),new Date(new Date().getTime() - 3600 * 1000 * 24 * 1)],
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
        { name: 'Pusoy Wild', gid: 126},
        { name: 'Pusoy Dos', gid: 34},
        { name: 'Tongits', gid: 22},
        { name: 'Tongits Joker', gid: 28},
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
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
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
      console.log(this.formatDateToYYYYMMDD(this.form.DateRange[0]), typeof this.form.DateRange[0])
      if (this.form.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      const args = {
        Env: $this.env,
        Path: '/misc/credit/log',
        Uid: $this.form.Uid,
        Gid: $this.form.Gid,
        Blind: $this.form.Blind,
        Limit: $this.form.Limit,
        Skip: ($this.form.currentPage-1) * $this.form.Limit,
        Sort: "",
        From: $this.formatDateToYYYYMMDD(this.form.DateRange[0]),
        To:$this.formatDateToYYYYMMDD(this.form.DateRange[1])
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
            for (let i = 0; i < $this.item.length; i++) {
              if ($this.item[i].gid === 0) {
                $this.item.splice(i,1)
                break
              }
            }
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
    formatNumber(n) {
      if ($libType.IsNumber(n)) {
        return n.toLocaleString()
      } else {
        return n
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总分';
          return;
        }
        if (index === 1 || index === 2) {
          sums[index] = 'N/A';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index]/=1000;
        }
      });

      return sums;
    }
  }
}
</script>
