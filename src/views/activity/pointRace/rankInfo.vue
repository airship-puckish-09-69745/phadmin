<template>
  <div class="app-container">

    <el-row> <el-alert type="error" description="选择周期输入名次范围后查询。导出请先输入对应的名次开始和结束值，避免过多使用这个功能。" /> </el-row>

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
          <el-button :disabled="isButtonDisabled" type="success" @click="getData">查询</el-button>
          <el-button :disabled="isButtonDisabled" type="default" @click="exportExcel">导出</el-button>
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
      itemTwoList: [],
      exportData: [],
      exportPageSize: 100,
      isButtonDisabled: false
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
    },
    async getExportData() {
      const response = await request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/pointrace/rank/exportlist',
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          LastRank: this.offset,
          PageSize: this.exportPageSize,
        }
      })

      const data = response.Data || []
      if (response.Data) {
        for (const i in data) {
          const tmp = []
          tmp.push(data[i].Rank)
          tmp.push(data[i].UID)
          tmp.push(data[i].Account)
          tmp.push(toRupee(data[i].Point))

          this.exportData.push(tmp)
        }
        this.offset += this.exportPageSize
      }
      return response.Data?.length || 0
    },
    exportExcel() {
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      if (this.courseInfo.PageSize > 10000) {
        Message.error('最大不允许超出10000')
        return
      }

      import('@/vendor/Export2Excel').then(async excel => {
        this.exportData = []
        this.offset = this.courseInfo.LastRank - 1

        const max = Math.ceil((this.courseInfo.PageSize-this.courseInfo.LastRank) / this.exportPageSize)

        this.isButtonDisabled = true
        for (let i = 1; i <= max; i++) {
          const cnt = await this.getExportData()
          console.log('getExportData cnt', i, cnt)
          if (cnt == 0) {
            break
          }
        }
        this.isButtonDisabled = false
        const data = this.exportData
        const header = [
          '排名', 'Uid', '账号', '积分'
        ]
        excel.export_json_to_excel({
          header: header, // 表头 必填
          data, // 具体数据 必填
          filename: '积分赛排行榜', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}

</script>
