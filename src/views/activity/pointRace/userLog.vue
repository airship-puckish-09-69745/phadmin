<template>
  <div class="app-container">
    <el-row> <el-alert type="error" description="必须指定用户ID后进行信息查询，切换选项后请重新查询" /> </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-form label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){courseInfo.Uid=iUid}" />
        </el-form-item>

          <el-form-item label="周期">

            <el-select v-model="courseInfo.ActId" placeholder="周期" @change="itemLevelOneChanged">
              <el-option
                v-for="item in itemOneList"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>

            <el-select v-model="courseInfo.ItemId" placeholder="请选择赛段" style="width: 280px;">
              <el-option  
                v-for="item in itemTwoList"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>

          </el-form-item>

          <el-form-item label="事件类型">
            <el-select v-model="courseInfo.EventType" >
              <el-option
                v-for="item in EventTypeOption"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="日期：">
            <el-date-picker
              v-model="courseInfo.Date"
              value-format="timestamp"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

    </el-row>
    <el-row>

        <el-form ref="filterTable">
          <el-table
            :data="dataList"
            stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;margin-top:10px;"
          >
            <el-table-column prop="Id" label="ID" width="100" />
            <el-table-column prop="Uid" label="UID" width="100" />

            <el-table-column prop="EventType" label="事件类型" width="100">
              <template scope="scope">
                {{ EventTypeOptionMap[scope.row.EventType] }}
              </template>
            </el-table-column>

            <el-table-column prop="Data" label="变化值">
              <template scope="scope">
                {{ getChangeVal(scope.row) | toRupee }}
              </template>
            </el-table-column>

            <el-table-column prop="Data" label="当前剩余">
              <template scope="scope">
                {{ getLastVal(scope.row) | toRupee }}
              </template>
            </el-table-column>

            <el-table-column prop="Comment" label="备注" />

            <el-table-column
              prop="UpdateTime"
              label="更新时间"
              width="200"
            >
              <template scope="scope">
                {{ new Date(scope.row.UpdateTime * 1000).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>

          </el-table>

        </el-form>
        <el-row type="flex" justify="end">
      <el-col :span="12">
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
          </el-col>
        </el-row>

    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import UidInput from '@/components/UidInput'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { getInfo } from '@/api/user'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, MoneyInput, UidInput, getInfo },
  data() {
    return {
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      dataList: [],
      activityMap: {},
      eventType: 1,
      EventTypeOption: [
        { 'key': '虚拟币', 'value': 1 },
        { 'key': '积分', 'value': 2 },
      ],
      EventTypeOptionMap: {
        1: '虚拟币',
        2: '积分',
      },
      offset: 1,
      limit: 300,
      courseInfo: {
        Uid: '',
        ItemId: '',
        ActId: '',
        Uid: '',
        Date: $libDate.GetDayBegin(new Date().getTime()),
        EventType: 1
      },
      itemOneList: [],
      itemTwoList: [],
    }
  },

  created() {
    this.getSelectOpt()
  },
  methods: {
    getSelectOpt() {
      request({
        url: '/pointracerule/select/opt',
        method: 'get',
        data: { }
      }).then(response => {
        if (response.RetCode === 0) {
          this.itemOneList = response.Data
          console.log('itemOneList', this.itemOneList)
        } else {
          Message.error('查询失败')
        }
      })
    },
    itemLevelOneChanged(value) {
      for (var i = 0; i < this.itemOneList.length; i ++) {
        var oneitem = this.itemOneList[i]
        if (value === oneitem.Id) {
          this.itemTwoList = oneitem.Child
          this.courseInfo.ItemId = ''
        }
      }
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
      if (this.eventType === 1) {
        return data.VirtualCoinChange
      }
      return data.PointChange
    },
    getLastVal(data) {
      if (this.eventType === 1) {
        return data.VirtualCoinLast
      }
      return data.PointLast
    },
    getComment(data) {
      const tmp = JSON.parse(data)
      if (tmp.hasOwnProperty('Comment')) {
        return tmp.Comment
      }
      return ''
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getData() {
      if (this.courseInfo.Uid == '') {
        Message.error('请输入用户ID')
        return
      }
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
        return
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      var offset = 0
      if (this.offset != 1) {
        offset = this.offset
      }
      // 加载基础数值配置
      request({
        url: '/pointracerule/activity/log',
        method: 'get',
        data: {
          Uid: this.courseInfo.Uid,
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          EventType: this.courseInfo.EventType,
          Date: Math.floor(this.courseInfo.Date / 1000),
          Offset: offset,
          Limit: this.limit,
          Path: '/pointrace/activity/log'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var parse = JSON.parse(response.Data)
          this.eventType = this.courseInfo.EventType
          console.log(parse)
          if (parse.RetCode != 0) {
            Message.error('查询失败')
            return
          }
          if (parse.Data == null || parse.Data.Count == 0) {
            Message.error('数据为空')
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
