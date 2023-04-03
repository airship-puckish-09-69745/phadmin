<template>
    <div class="app-container">
        <el-row>
            <el-form :model="item" label-width="90px" :inline="true" size="small">
                <el-form-item label="UID：" :required="true" label-width="150px">
                    <UidInput @setUid="function(iUid){item.Uid=iUid}" />
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="item.actType" size="mini">
                        <el-option label="全部" :value="-1" />
                        <el-option v-for="(o,k) in typeNames" :label="o" :value="k" />
                    </el-select>
                </el-form-item>
                <el-form-item label="日期：">
                    <el-date-picker
                        v-model="item.date"
                        value-format="timestamp"
                        type="date"
                        placeholder="选择日期"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
        <el-col :offset="5" :span="12">
          <el-descriptions
            class="margin-top"
            :column="4"
            size="medium"
            :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
            border
          >
            <el-descriptions-item label="总局数："> {{ totalData.round }}</el-descriptions-item>
            <el-descriptions-item label="总下注金额："> {{ formatNumber(totalData.betMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="总返奖金额："> {{ formatNumber(totalData.winMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="总赢：">{{ formatNumber(totalData.winMoney/1000 - totalData.betMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="普通返奖："> {{ formatNumber(totalData.normalMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="wild返奖："> {{ formatNumber(totalData.wildMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="scatter返奖："> {{ formatNumber(totalData.scatterMoney/1000) }}</el-descriptions-item>
            <el-descriptions-item label="jackpot返奖："> {{ formatNumber(totalData.jackpotMoney/1000) }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
        <el-row>
            <el-table
            ref="filterTable"
            :data="tableData"
            stripe
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%;margin-top:10px;"
            @row-click="clickData"
            >
            <el-table-column
                prop="Id"
                label="ID"
                width="100"
            />
            <el-table-column
                prop="Uptime"
                label="完成时间"
                sortable
                width="200"
            >
                <template slot-scope="scope">
                <DateTimeShow :show-type="2" :timestamp="scope.row.Uptime" />
                </template>
            </el-table-column>
            <el-table-column
                prop="Uid"
                label="Uid"
                width="150"
            />
            <el-table-column
                prop="ActType"
                label="操作类型"
            >
            <template slot-scope="scope">
            {{ typeNames[scope.row.ActType] }}
            </template>
            </el-table-column>
            <el-table-column
                prop="Bet"
                label="下注额"
            >
                <template slot-scope="scope">
                {{ formatNumber(scope.row.Bet/1000) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="ReturnBet"
                label="输赢"
            >
                <template slot-scope="scope">
                {{ formatNumber(scope.row.ReturnBet/1000) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="PayLine"
                label="命中支付线"
            />
            </el-table>
            <el-dialog
              title="牌局详情"
              :visible.sync="showDetail"
              width="50%"
            >
            <p>命中支付线：{{detailPayLine}}</p>
            <div id="slotsLogDetail" v-html="detailContent">
              
            </div>
            </el-dialog>
        </el-row>
        <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
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

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'
import DateTimeShow from "@/components/DatetimeShow";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {DateTimeShow, Compare, Publish, UidInput, LineChart },
  data() {
    return {
        gid:0,
        env: "dev",
        item: {
            Uid: 0,
            date:  $libDate.GetDayBegin(new Date().getTime()),
            actType: -1,
        },
        totalData: {
          round: 0,
          betMoney: 0,
          winMoney: 0,
          normalMoney: 0,
          wildMoney: 0,
          scatterMoney: 0,
          jackpotMoney: 0
        },
        tableData: [],
        libShow: $libShow,
        totalCount: 0,
        currentPage: 0,
        pageNum: 20,
        typeNames: { 0: '主游戏', 1: 'wild', 2: 'scatter', 3: 'jackpot' },
        showDetail: false,
        detailContent: "",
        detailPayLine: 0,
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getInfo() {
        const $this = this
        request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/slotslog/list',
          Uid: this.item.Uid,
          SlotsType: this.gid,
          Time: $libDate.SelectTimeToIndia(this.item.date) / 1000,
          Page: this.currentPage,
          Limit: this.pageNum,
          ActType: this.item.actType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.List || []
          $this.ret = response.Data
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.totalCount = response.Data.Count
          $this.tableData = objs
          $this.totalData.round = response.Data.Round
          $this.totalData.winMoney = response.Data.WinMoney
          $this.totalData.betMoney = response.Data.BetMoney
          $this.totalData.normalMoney = response.Data.NormalMoney
          $this.totalData.wildMoney = response.Data.WildMoney
          $this.totalData.scatterMoney = response.Data.ScatterMoney
          $this.totalData.jackpotMoney = response.Data.JackpotMoney
        }
      })
    },
    clickData(row, column, event) {
      this.showDetail = true
      this.detailContent = row.GameLog
      this.detailPayLine = row.PayLine
    }
  }
}

</script>

<style>
    #slotsLogDetail table {
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    #slotsLogDetail table td{
        border: 1px solid #eee;
        height: 31px;
        line-height: 31px;
        padding: 2px;
    }
</style>