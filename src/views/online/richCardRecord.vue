<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              v-model="timeRange"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              value-format="timestamp"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="Uid">
            <el-input v-model.number="item.uid" placeholder="Uid" size="mini" />
          </el-form-item>
          <el-form-item label="游戏">
            <el-select v-model="item.gid" size="mini">
              <el-option label="所有" :value="0" />
              <el-option
                v-for="row in gameOptions"
                :key="row.key"
                :label="row.label"
                :value="row.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="平台">
            <SiteSelect v-model="item.site" placeholder="请选择" size="mini" />
          </el-form-item>
          <el-form-item label="App">
            <el-select v-model="item.appId" size="mini">
              <el-option label="所有" :value="0" />
              <el-option
                v-for="row in appInfo"
                :key="row.key"
                :label="row.label"
                :value="row.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发放方式">
            <el-select v-model="item.source" size="mini">
              <el-option label="所有" :value="0" />
              <el-option
                v-for="row in sourceOptions"
                :key="row.value"
                :label="row.label"
                :value="row.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15" />
      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.TableCell(0)"
        >
          <el-table-column label="UID" width="160px">
            <template slot-scope="scope">
              {{ scope.row.uid }}
            </template>
          </el-table-column>
          <el-table-column label="游戏">
            <template slot-scope="scope">
              {{ scope.row.gameType }}
            </template>
          </el-table-column>
          <el-table-column label="平台" width="160px">
            <template slot-scope="scope">
              {{ scope.row.site }}
            </template>
          </el-table-column>
          <el-table-column label="发放时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.sendTime) }}
            </template>
          </el-table-column>
          <el-table-column label="发放方式">
            <template slot-scope="scope">
              {{ sourceMap[scope.row.source] || '未知' }}
            </template>
          </el-table-column>
          <el-table-column label="bet值">
            <template slot-scope="scope">
              {{ scope.row.betRequired / 1000 }}
            </template>
          </el-table-column>
          <el-table-column label="星级" width="220px">
            <template slot-scope="scope">
              {{ scope.row.richCardLevel }}
            </template>
          </el-table-column>
          <el-table-column label="使用时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.useStage) }}
            </template>
          </el-table-column>
          <el-table-column label="获得金额">
            <template slot-scope="scope">
              {{ scope.row.winMoney/ 1000 }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            background
            :current-page="item.pageNum"
            :page-sizes="[20]"
            :page-size="item.pageSize"
            layout="total, prev, pager, next, ->, jumper"
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
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { $libDate, $libShow } from '@/utils/common'
import { Message } from 'element-ui'
import SiteSelect from '@/components/SiteSelect/index.vue'
import store from '@/store'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { SiteSelect, Compare, Publish, MoneyInput },
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      item: {
        uid: '',
        gid: 0,
        appId: 0,
        site: '',
        source: 0,
        pageNum: 1,
        pageSize: 20
      },
      gameOptions: [],
      sourceOptions: [
        { value: 1, label: '后台发放' },
        { value: 17, label: '富裕卡任务' },
        { value: 18, label: '7日活动' }
      ],
      appInfo: [],
      tableData: [],
      totalCount: 0
    }
  },
  created() {
    this.getGameList()
    this.getAppInfo()
  },
  computed: {
    sourceMap() {
      return this.sourceOptions.reduce((map, item) => {
        map[item.value] = item.label
        return map
      }, {})
    }
  },
  methods: {
    formatTime(ts) {
      const num = parseInt(ts)
      if (isNaN(num)) {
        return ts
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    getData() {
      const $this = this
      let queryStart = 0
      let queryEnd = 0
      if (this.timeRange) {
        queryStart = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        queryEnd = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/rich/card/record',
          Env: store.getters.env,
          uid: $this.item.uid,
          appId: $this.item.appId,
          site: $this.item.site,
          source: $this.item.source,
          queryStart: queryStart,
          queryEnd: queryEnd,
          gid: $this.item.gid,
          pageNum: $this.item.pageNum,
          pageSize: $this.item.pageSize
        }
      }).then(response => {
        $this.tableData = []
        if (response.RetCode === 0) {
          if (response.Data === 'no Data') {
            Message.error('no Data')
            return
          }
          // console.log(response.Data)
          $this.tableData = response.Data.list || []
          $this.totalCount = response.Data.totalCount || 0

          // const now = Math.floor(Date.now() / 1000) // 当前时间戳（秒）
          // const twoDays = 2 * 24 * 60 * 60 // 两天（秒）
          //
          // $this.tableData.forEach(item => {
          //   if (
          //     item.useStage === '未使用' &&
          //     item.sendTime &&
          //     item.sendTime + twoDays < now
          //   ) {
          //     item.useStage = '已过期'
          //   }
          // })
        }
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        const gameOptionsArr = []
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].CategoryID !== 1) {
              continue
            }

            gameOptionsArr.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
          // 对gameOptionsArr按游戏名称排序
          gameOptionsArr.sort((a, b) => {
            return a.label.localeCompare(b.label)
          })
          this.gameOptions = gameOptionsArr
        }
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.item.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      if (this.tableData.length < this.item.pageSize && val > this.item.pageNum) {
        return
      }
      this.item.pageNum = val
      this.getData()
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    }
  }
}
</script>
