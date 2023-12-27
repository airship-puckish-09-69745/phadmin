<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="平台：">
          <el-select v-model="selectPlatform" placeholder="请选择">
            <el-option v-for="item in platformTypes" :label="item.key" :key="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块：">
          <el-select v-model="selectModule" placeholder="请选择">
            <el-option v-for="item in moduleTypes" :label="item.key" :key="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getPackageInfo">查询</el-button>
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
            prop="Id"
            label="ID"
            width="200"
        />
        <el-table-column
            prop="Version"
            label="新版本"
            width="200"
        />
        <el-table-column
            prop="CurrentVersion"
            label="当前版本"
            width="200"
        />
        <el-table-column
            prop="Url"
            label="更新地址"
            width="400"
        />
        <el-table-column
            prop="FileSize"
            label="大小"
            width="200"
        />
        <el-table-column
            prop="FileMd5"
            label="文件MD5"
            width="400"
        />
      </el-table>
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
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
// import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      // appId: 0,
      packageInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()),
        app: '',
        type: 0
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
      currentPage: 1,
      pageNum: 20,
      platformTypes: [{key: '安卓', value: 1}, {key: 'IOS', value: 2}],
      // platformTypes: {1: '安卓', 2: 'IOS'},
      moduleTypes: [
        {key: '[0]大厅', value: 0},
        {key: '[1]无限德州', value: 1},
        {key: '[2]短牌德州', value: 2},
        {key: '[3]奥马哈', value: 3},
        {key: '[4]三公', value: 4},
        {key: ' [5]AOF', value: 5}
      ],
      showDetail: false,
      detailContent: '',
      detailPayLine: 0,
      selectPlatform: 1,
      selectModule: 0,
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    this.getPackageInfo()
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
    getPackageInfo() {
      request({
        url: '/package/list',
        method: 'get',
        data: {
          pageNum: this.pageNum,
          platform: this.selectPlatform,
          module: this.selectModule,
          version: 0,
          page: (this.currentPage - 1)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log("==",response.Data)
          const objs = response.Data || []
          this.ret = response.Data.rows
          this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          this.totalCount = response.Data.total
          this.tableData = objs
        }
      })
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/thirdparties/transfer/list',
          Uid: this.item.Uid,
          App: this.item.app,
          StartTime: $libDate.SelectTimeToIndia(this.item.start) / 1000,
          EndTime: $libDate.SelectTimeToIndia(this.item.end) / 1000,
          Page: this.currentPage,
          Limit: this.pageNum,
          Type: this.item.type,
          platform: this.platform
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.rows || []
          $this.ret = response.Data.rows
          $this.tableData = objs
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          this.totalCount = response.Data.total
          $this.tableData = objs
        }
      })
    }
  }
}

</script>
