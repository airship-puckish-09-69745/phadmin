<template>
  <div class="app-container">
    <el-row> <el-alert type="error" description="必须指定用户ID后进行信息查询，切换选项后请重新查询" /> </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="22">
        <el-form inline>
          <el-form-item label="UID">
            <el-input v-model="UID" size="mini" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="周期">
            <el-select v-model="queryData.ActivityId" size="mini">
              <el-option
                v-for="item in activityIds"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="queryData.ActivityType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in activityTypeOptions"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="事件类型">
            <el-select v-model="queryData.EventType" size="mini">
              <el-option
                v-for="item in EventTypeOption"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开始日期：">
            <el-date-picker
              v-model="queryData.StartTime"
              value-format="timestamp"
              type="date"
              placeholder="选择日期"
              size="mini"
              format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="结束日期：">
            <el-date-picker
              v-model="queryData.EndTime"
              value-format="timestamp"
              type="date"
              placeholder="选择日期"
              size="mini"
              format="yyyy-MM-dd"
            />

          </el-form-item>
          <el-form-item>
            <el-button type="success" size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="2" />

      <el-col :span="24">
        <el-form ref="allCfg" label-width="150px">
          <el-table
            :data="dataList"
            style="width: 95%"
            border
          >
            <el-table-column prop="ID" label="ID" />
            <el-table-column prop="UID" label="UID" />
            <el-table-column prop="ActivityType" label="类型">
              <template scope="scope">
                {{ activityTypeOptionsMap[scope.row.ActivityType] }}
              </template>
            </el-table-column>

            <el-table-column prop="ActivityId" label="周期">
              <template scope="scope">
                {{ activityMap[scope.row.ActivityId] }}
              </template>
            </el-table-column>
            <el-table-column prop="EventType" label="事件类型">
              <template scope="scope">
                {{ EventTypeOptionMap[scope.row.EventType] }}
              </template>
            </el-table-column>
            <el-table-column prop="Data" label="变化值">
              <template scope="scope">
                {{ getChangeVal(scope.row.Data) | toRupee }}
              </template>
            </el-table-column>
            <el-table-column prop="Data" label="当前剩余">
              <template scope="scope">
                {{ getLastVal(scope.row.Data) | toRupee }}
              </template>
            </el-table-column>
            <el-table-column
              prop="UpdateTime"
              label="更新时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.UpdateTime * 1000).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>

          </el-table>

        </el-form>
        <el-row>
          <div class="block">
            <el-pagination
              :current-page="clientDB.GetPage().GetCurrentPage()"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="clientDB.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDB.GetPage().GetTotalCount()"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-row>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { getInfo } from '@/api/user'
import { $libDate, ClientTableData } from '@/utils/common'

const filterMap = {}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, MoneyInput, getInfo },
  data() {
    return {
      clientDB: new ClientTableData([], 1, filterMap),
      dataList: [],
      activityIds: [],
      activityMap: {},
      showVisible: false,
      activityTypeOptions: [
        { 'key': 'Tongits', 'value': 1 }
      ],
      activityTypeOptionsMap: {
        1: 'Tongits'
      },
      EventTypeOption: [
        { 'key': '虚拟币', 'value': 1 },
        { 'key': '积分', 'value': 2 }
      ],
      EventTypeOptionMap: {
        1: '虚拟币',
        2: '积分'
      },
      item: {
        ID: 0,
        ActivityType: 0,
        EndTime: 0,
        StartTime: 0,
        Title: '',
        NeedVirtualCoin: 0,
        TaskVirtualCoin: 0,
        Status: 0
      },
      offset: 1,
      limit: 20,
      UID: '',
      eventType: 1,
      queryData: {
        UID: 0,
        ActivityType: 1,
        ActivityId: '',
        StartTime: '',
        EndTime: Date.parse(new Date().toString()),
        EventType: 1
      },
      showBtn: false,
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString())
    }
  },

  created() {
    this.getAllActivityId()
    console.log(this.setStartTime())
    this.queryData.StartTime = this.setStartTime()
    this.queryData.EndTime = this.setEndTime()
  },
  methods: {
    setStartTime() {
      var d = new Date()
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      console.log(d.getTime())
      return d
    },
    setEndTime() {
      var d = new Date()
      d.setHours(23)
      d.setMinutes(59)
      d.setSeconds(59)
      return d
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.dataList = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    getChangeVal(data) {
      const tmp = JSON.parse(data)
      if (this.eventType === 1) {
        return tmp.VirtualCoinChange
      }
      return tmp.PointChange
    },
    getLastVal(data) {
      const tmp = JSON.parse(data)
      if (this.eventType === 1) {
        return tmp.VirtualCoinLast
      }
      return tmp.PointLast
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getAllActivityId() {
      request({
        url: '/millionpointracerule/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            var cfg = { 'key': response.Data[i].Title, 'value': response.Data[i].ID }
            this.activityIds.push(cfg)
            this.activityMap[response.Data[i].ID] = response.Data[i].Title
          }
          this.queryData.ActivityId = this.activityIds[0].value
        } else {
          Message.error('查询失败')
        }
      })
    },
    getData() {
      console.log(this.queryData.ActivityId)
      if (this.UID == '') {
        Message.error('请输入用户ID')
        return
      }
      if (this.queryData.ActivityId == '') {
        this.queryData.ActivityId = 0
      }
      if (this.queryData.ActivityType == '') {
        this.queryData.ActivityType = 0
      }
      this.queryData.UID = this.UID
      var offset = 0
      if (this.offset != 1) {
        offset = this.offset
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/activity/log',
        method: 'get',
        data: {
          UID: this.queryData.UID,
          ActivityId: this.queryData.ActivityId,
          EventType: this.queryData.EventType,
          ActivityType: this.queryData.ActivityType,
          StartTime: Math.floor(this.queryData.StartTime / 1000),
          EndTime: Math.floor(this.queryData.EndTime / 1000) + 86400 - 1,
          Offset: offset,
          Limit: this.limit,
          Path: '/millonpointrace/activity/log'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var parse = JSON.parse(response.Data)
          this.eventType = this.queryData.EventType
          // console.log(parse)
          if (parse.RetCode != 0) {
            Message.error('查询失败')
            return
          }
          if (parse.Data == null || parse.Data.Count == 0) {
            Message.error('无查询数据')
            return
          }
          this.clientDB = new ClientTableData(parse.Data.Data, 10, filterMap, '', -1)
          this.handleCurrentChange(1)
        } else {
          Message.error('查询失败')
        }
      })
    }
  }
}

</script>
