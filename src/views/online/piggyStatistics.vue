<template>
  <div class="app-container">

    <el-tabs type="border-card">
      <el-tab-pane label="统计结果" v-loading="loading">
        <el-row>
          <el-col>
            <el-form inline>
              <el-form-item label="日期">
                <el-date-picker
                    size="mini"
                    v-model="queryTime"
                    type="date"
                    placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="queryType" size="mini">
                  <el-option label="转盘" :value="1"/>
                  <el-option label="金币转轴" :value="2"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="getData">查询</el-button>
                <el-button type="success" size="mini" @click="exportExcel">导出当前数据</el-button>

              </el-form-item>
            </el-form>

          </el-col>
        </el-row>
        <el-table
            ref="filterTable"
            :data="tableData"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%">

          <el-table-column
              prop="Uid"
              label="Uid"
          />
          <el-table-column
              prop="CalcBet"
              label="计算下注金额"
          >
            <template slot-scope="scope">{{ scope.row.CalcBet / 1000 }}</template>
          </el-table-column>
          <el-table-column
              prop="MoneyBet"
              label="消耗金币"
          >
            <template slot-scope="scope">{{ scope.row.MoneyBet / 1000 }}</template>
          </el-table-column>
          <el-table-column
              prop="MoneyWon"
              label="赢的金币"
          >
            <template slot-scope="scope">{{ scope.row.MoneyWon / 1000 }}</template>
          </el-table-column>
          <el-table-column
              prop="MoneyOdds"
              label="金币倍数"
          >
            <template slot-scope="scope">{{ scope.row.MoneyOdds / 1000 }}</template>
          </el-table-column>
          <el-table-column
              prop="SpinOdds"
              label="转轴倍数"
          >
            <template slot-scope="scope">{{ scope.row.SpinOdds / 1000 }}</template>
          </el-table-column>
          <el-table-column
              prop="PlateOdds"
              label="幸运转盘倍数"
          >
            <template slot-scope="scope">{{ scope.row.PlateOdds / 1000 }}</template>
          </el-table-column>
        </el-table>

        <el-pagination
          :current-page="clientDB.GetPage().GetCurrentPage()"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="clientDB.GetPage().GetPageNum()"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clientDB.GetPage().GetTotalCount()"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {$libShow, ClientTableData} from '@/utils/common'
import store from "@/store";
import XLSX from "xlsx";
import {Message} from "element-ui";

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},

  data() {
    return {
      form: {},
      postData: {},
      gameScene: {},
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      showBtn: 0,
      libShow: $libShow,
      item: {
        Gid: 0,
        OddsList: [{MinOdds: 0, MaxOdds: 0}]
      },
      selectGameVisible: false,
      gameOptions: [],

      pageNum: 10,
      currentPage: 1,
      total: 0,

      queryTime: new Date().getTime(),
      loading: false,
      cfgMap: {},
      queryType: 1,
      gidOptions: {},
      sumData: {},
      stepSum: {},
      coordinateSum: {},
      detailVisible: false,
      showData: {},
      mapCnt: {},
      timesSum: 0,

      Actions: {},
      ActionOdds: 1,
    }
  },
  created() {
    this.getData()
  },
  methods: {

    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refresh()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refresh()
    },
    refresh() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },


    getData() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/misc/piggy/statistics',
          Env: store.getters.env,
          queryTime: parseInt(this.queryTime / 1000),
          type: $this.queryType,
          limit: ($this.pageNum*$this.currentPage)-1,
          offset: ($this.currentPage - 1) * $this.pageNum,
        }
      }).then(response => {
        console.log("===", response)
        if (response.RetCode === 0) {
          let dataArr =[]
          for (let i = 0; i < response.Data.data.length; i++) {
            let arr = response.Data.data[i].split('_')
            let obj = {
              Uid: arr[0],
              CalcBet: arr[1],
              MoneyBet: arr[2],
              MoneyWon: arr[3],
              MoneyOdds: arr[4],
              SpinOdds: arr[5],
              PlateOdds: arr[6]
            }
            dataArr.push(obj)
          }
          this.clientDB = new ClientTableData(dataArr, 10, filterMap, 'ID', -1)
          $this.refresh()
        }
        $this.loading = false
      })
    },

    exportExcel() {
      console.log(this.queryType)
      console.log(this.clientDB.TotalData)
      if ( this.clientDB.TotalData.length <= 0) {
        Message.error("没有要导出的数据")
        return
      }

      this.$confirm("是否确认导出当前游戏统计数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((response) => {
        let result = [["Uid", "下注金额", "消耗金币", "赢金", "金币倍数","转轴倍数","幸运转盘倍数"]]// 表格表头
        for (const o of this.clientDB.TotalData) {
            let dat =[]
          dat.push(o.Uid)
            dat.push(o.CalcBet / 1000)
            dat.push(o.MoneyBet/ 1000 )
            dat.push(o.MoneyWon/ 1000)
            dat.push(o.MoneyOdds/ 1000)
            dat.push(o.SpinOdds/ 1000)
            dat.push(o.PlateOdds/ 1000)
            result.push(dat)
          }



        let workSheet = XLSX.utils.aoa_to_sheet(result);
        let bookNew = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(bookNew, workSheet, 'step') // 工作簿名称
        var string = this.queryType=="1"?"转盘":"金币转轴";
        let name =  "金猪大奖统计-"+string+".xlsx"
        XLSX.writeFile(bookNew, name) // 保存的文件名
      })
    },
    timestampToTime(timestamp) {
      timestamp = timestamp ? timestamp : null;
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      // let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      // let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D;
    },

    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100) {
              continue
            }

            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
            this.gameScene[response.Data[i].Gid] = response.Data[i].Scene
          }
        }
      })
    }
  }
}
</script>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}

.table-bg thead th {
  background-color: #f5fafe;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}

.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}

.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.table th {
  font-weight: bold;
}
</style>
