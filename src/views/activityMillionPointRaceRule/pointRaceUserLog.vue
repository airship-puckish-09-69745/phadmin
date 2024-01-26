<template>
  <div class="app-container">

    <el-row> <el-alert type="error" description="选择周期输入名次范围后查询" /> </el-row>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="22">
        <el-form inline>
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
          <el-form-item label="名次范围">
            <el-input v-model="queryData.LastRank" size="mini" placeholder="开始" />
          </el-form-item>
          <el-form-item label="-">
            <el-input v-model="queryData.PageSize" size="mini" placeholder="结束" />
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
            <el-table-column prop="Rank" label="排名" />
            <el-table-column prop="UID" label="UID" />
            <el-table-column prop="Nick" label="昵称" />
            <el-table-column prop="Point" label="积分">
              <template slot-scope="scope">
                {{ scope.row.Point | toRupee }}
              </template>
            </el-table-column>

          </el-table>
        </el-form>
        <el-row>
          <div class="block">
            <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { getInfo } from '@/api/user'
import { toRupee } from '@/utils'
const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, MoneyInput, getInfo },

  data() {
    return {
      clientDB: new ClientTableData([], 1, filterMap),
      dataList: [],
      total: 0,
      showVisible: false,
      types: { 1: '转出', 2: '转入' },
      activityTypeOptions: [
        { 'key': 1, 'value': 'Tongits' }],
      statusOption: { 1: '上架', 2: '下架' },
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
      activityIds: [],
      offset: 1,
      limit: 20,
      queryData: {
        ActivityId: '',
        LastRank: 1,
        PageSize: 100
      },
      showBtn: false
    }
  },
  created() {
    this.getAllActivityId()
    // this.getData()
  },
  methods: {
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

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getAllActivityId() {
      request({
        url: '/millionpointracerule/all',
        method: 'get',
        data: { }
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            var cfg = { 'key': response.Data[i].Title, 'value': response.Data[i].ID }
            this.activityIds.push(cfg)
          }
          this.queryData.ActivityId = this.activityIds[0].value
        } else {
          Message.error('查询失败')
        }
      })
    },
    getData() {
      if (this.queryData.ActivityId == '') {
        this.queryData.ActivityId = this.activityIds[0].value
      }
      if (this.queryData.LastRank <= 0 || this.queryData.PageSize <= 0) {
        Message.error('排名必须大于等于1')
        return
      }
      if (parseInt(this.queryData.PageSize) - parseInt(this.queryData.LastRank) >= 100) {
        Message.error('排名一次最多查看100名')
        return
      }
      if (this.queryData.ID == '') {
        this.queryData.ID = 0
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/user/rank',
        method: 'get',
        data: {
          ActivityId: this.queryData.ActivityId,
          LastRank: parseInt(this.queryData.LastRank) - 1,
          PageSize: parseInt(this.queryData.PageSize) - parseInt(this.queryData.LastRank) + 1,
          Path: '/millonpointrace/user/rank'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var obj = JSON.parse(response.Data)
          if (obj.RetCode === 0) {
            // console.log(obj.Data)
            this.clientDB = new ClientTableData(obj.Data, 10, filterMap, '', -1)
            this.handleCurrentChange(1)
          } else {
            Message.error('查询失败')
          }
        } else {
          Message.error('无数据')
        }
      })
    }
  }
}

</script>
