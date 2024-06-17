<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true">
          <UidInput ref="uidInput" @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="标黑类型：">
          <el-select v-model="item.blackType" placeholder="请选择" size="mini">
            <el-option v-for="(v, index) in blackTypes" :key="index" :label="v.label" :value="v.value" />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="是否标黑：">-->
<!--          <el-select v-model="item.black" placeholder="请选择" size="mini">-->
<!--            <el-option v-for="(v, index) in blackOptions" :key="index" :label="v.label" :value="v.value" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="item.start"
            value-format="timestamp"
            type="datetime"
            placeholder="选择时间"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="item.end"
            value-format="timestamp"
            type="datetime"
            placeholder="选择时间"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="click2getInfo">查询</el-button>
        </el-form-item>
      </el-form>
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
      >
        <el-table-column
          prop="id"
          label="ID"
          width="120"
        />
        <el-table-column
          prop="uid"
          label="Uid"
          width="90"
        />
        <el-table-column
          prop="type"
          label="类型"
          width="200"
        >
          <template slot-scope="scope">
            {{ showBlackType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.updateTime" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        >
          <template slot-scope="scope">
            <DateTimeShow :show-type="2" :timestamp="scope.row.createTime" />
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
.tooltip-button {
  margin-right: 10px;
}
</style>

<script>
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  components: { DateTimeShow, UidInput },
  data() {
    return {
      // appId: 1000000,
      appInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        blackType: 0,
        black: -1,
        start: $libDate.GetDayBegin(new Date().getTime()), // Date.parse(new Date(this.dDate(0, 30))),
        end: $libDate.GetDayEnd(new Date().getTime()) // Date.parse(new Date()),
      },
      blackOptions: [
        { value: -1, label: '全部' },
        { value: 1, label: '黑' },
        { value: 0, label: '白' }
      ],
      blackTypes: [
        { value: 0, label: '全部' },
        { value: 1, label: '组合作弊达到标黑次数' },
        { value: 2, label: '与3个黑子产生关联，每个至少作弊2次' },
        { value: 3, label: '与2个黑子产生关联，每个至少3次' },
        { value: 4, label: '与1个黑子产生关联，每个至少4次' },
        { value: 5, label: '关联计分拉黑' }
      ],
      tableData: [],
      libShow: $libShow,
      totalCount: 0,
      currentPage: 1,
      pageNum: 20
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.item.gameId = 0
  },
  methods: {
    // 设置默认日期
    dDate(daysAgo, minutesAgo) {
      var now = new Date()
      var date = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000 - minutesAgo * 60 * 1000)
      if (now.getDate() !== date.getDate()) {
        var nowYear = now.getFullYear()
        var nowMonth = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)
        var nowDay = now.getDate() > 9 ? now.getDate() : '0' + now.getDate()
        return nowYear + '-' + nowMonth + '-' + nowDay + ' 00:00:00'
      }
      var year = date.getFullYear()
      var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      var hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      var result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':00'
      return result
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
    formatNumber(n) {
      return n.toLocaleString()
    },
    click2getInfo() {
      this.currentPage = 1
      this.getInfo()
    },
    showBlackType(type) {
      if (type < 1) {
        return '未知'
      }
      for (let i = 0; i < this.blackTypes.length; i++) {
        if (this.blackTypes[i].value === type) {
          return this.blackTypes[i].label
        }
      }
      return '未知'
    },
    getInfo() {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/tongits/black/user/list',
          Uid: this.item.Uid || 0,
          BlackType: this.item.blackType || 0,
          Black: this.item.black || -1,
          StartTime: this.item.start / 1000,
          EndTime: this.item.end / 1000,
          Page: this.currentPage,
          Limit: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          $this.ret = response.Data.Items
          $this.tableData = objs
          this.totalCount = response.Data.Total
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
        }
      })
    }
  }
}

</script>
