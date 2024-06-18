<template>
  <div class="app-container">

    <el-row> <el-alert type="error" description="选择周期输入名次范围后查询" /> </el-row>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-form label-width="90px" :inline="true" size="small">
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
        <el-form-item label="名次开始">
          <el-input v-model="courseInfo.LastRank" placeholder="开始" />
        </el-form-item>
        <el-form-item label="名次结束">
          <el-input v-model="courseInfo.PageSize" placeholder="结束" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>

    </el-row>
    <el-row>

      <el-col :span="24">
        <el-form ref="filterTable">
          <el-table
            :data="dataList"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%;margin-top:10px;"
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
        <el-row type="flex" justify="end">
          <el-col :span="12">
            <div class="block">
              <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </el-col>
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
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      dataList: [],
      total: 0,
      offset: 1,
      limit: 20,
      courseInfo: {
        ItemId: '',
        ActId: '',
        LastRank: 1,
        PageSize: 100
      },
      itemOneList: [],
      itemTwoList: []
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
      for (var i = 0; i < this.itemOneList.length; i++) {
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

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },

    getData() {
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      if (this.courseInfo.LastRank <= 0 || this.courseInfo.PageSize <= 0) {
        Message.error('排名必须大于等于1')
        return
      }
      if (parseInt(this.courseInfo.PageSize) - parseInt(this.courseInfo.LastRank) >= 100) {
        Message.error('排名一次最多查看100名')
        return
      }
      // 加载基础数值配置
      request({
        url: '/pointracerule/rank/list',
        method: 'get',
        data: {
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          LastRank: parseInt(this.courseInfo.LastRank) - 1,
          PageSize: parseInt(this.courseInfo.PageSize) - parseInt(this.courseInfo.LastRank) + 1,
          Path: '/pointrace/rank/list'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var obj = JSON.parse(response.Data)
          if (obj.RetCode === 0) {
            console.log(obj.Data)
            if (obj.Data === null) {
              Message.error('数据为空')
              return
            }
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
