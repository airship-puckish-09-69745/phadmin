<template>
  <div class="app-container">

    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="统计结果" v-loading="loading">
        <el-row>
          <el-col>
            <el-date-picker
              size="mini"
              v-model="queryTime"
              type="date"
              placeholder="选择日期"
              @change="updateGid"
            >
            </el-date-picker>
            <el-select v-model="queryGid" size="mini" @change="queryKeyInput">
              <!--              <el-option label="所有" :value="0"/>-->
              <el-option v-for="(o,k) in gidOptions" :key="k" :label="getGameName(o)" :value="parseInt(o)"/>
            </el-select>
            <el-button type="primary" size="mini" @click="getSlotsScriptStatistics">查询</el-button>
            <el-button type="success" size="mini" @click="exportExcel">导出步数</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-table
              ref="filterTable"
              :data="scriptTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 500px"
            >
              <el-table-column label="命中统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.gid == item.key ? item.label : "") }}
                </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="idx"
                  label="区间"
                  width="130px"
                >
                  <template slot-scope="scope">
                    {{ getTitle(parseInt(scope.row.gid), parseInt(scope.row.idx)) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cnt"
                  label="次数"
                >
                </el-table-column>
                <el-table-column
                  prop="cnt"
                  label="占比"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.cnt) / sumData[scope.row.gid] * 100).toFixed(2) + "%" }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <div class="block">
                  <el-pagination
                    :current-page="scriptClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="scriptClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="scriptClientDB.GetPage().GetTotalCount()"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-table
              ref="filterTable"
              :data="coordinateTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 700px"

            >
              <el-table-column label="完成50步统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.gid == item.key ? item.label : "") }}
                </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="类型"
                  width="120px"
                >
                </el-table-column>
                <el-table-column
                  prop="cnt"
                  label="次数"
                >
                </el-table-column>
                <el-table-column
                  prop="cnt"
                  label="占比"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.cnt) / coordinateSum[scope.row.gid] * 100).toFixed(2) + "%" }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="5">
                <div class="block">
                  <el-pagination
                    :current-page="coordinateClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="coordinateClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next"
                    :total="coordinateClientDB.GetPage().GetTotalCount()"
                    @size-change="coordinateHandleSizeChange"
                    @current-change="coordinateHandleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-table
              ref="filterTable"
              :data="stepTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 700px"

            >
              <el-table-column label="步数统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.gid == item.key ? item.label : "") }}
                </span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="title"
                  label="类型"
                  width="120px"
                >
                </el-table-column>

                <el-table-column
                  prop="cnt"
                  label="详情"
                >
                  <template slot-scope="scope">
                    <el-button @click="showStepDetail(scope.row)"> 查看</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="5">
                <div class="block">
                  <el-pagination
                    :current-page="stepClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="stepClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next"
                    :total="stepClientDB.GetPage().GetTotalCount()"
                    @size-change="stepHandleSizeChange"
                    @current-change="stepHandleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-if="detailVisible"
      title="剧本详情"
      :visible.sync="detailVisible"
      width="60%">
      <el-row>
        <el-col :span="24">
          <el-tabs type="border-card">
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
              <th>
                <template>
                  总次数：{{ timesSum }}
                </template>
              </th>
              <th v-for="(v,k) in showData.column">
                <template>
                  <span>{{ v }}</span>
                </template>
              </th>
              </thead>
              <thead>
              <th>
                <template>
                  概率：
                </template>
              </th>
              <th v-for="(v,k) in showData.column">
                <template>
                  <span style="font-size: 11px">{{ ((parseInt(v) / timesSum) * 100).toFixed(2) + '%' }}</span>
                </template>
              </th>
              </thead>

              <thead>
              <th>
                <template>
                  步数 / 剧本
                </template>
              </th>
              <th v-for="(v,k) in showData.column">
                <template>
                  <!--
                  <span @click="showChart(idx, k1)">{{ k1 }}</span>
                  -->
                  <span>{{ k }}</span>
                </template>
              </th>
              </thead>
              <tr v-for=" (v,k) in showData.rows" style="text-align: center">
                <td>{{ k }}</td>
                <td v-for="col in v" style="text-align: center">
                  {{ col }}
                </td>
              </tr>
            </table>
          </el-tabs>
        </el-col>
        <!--
        <el-col :span="12">
          <el-row>
            <line-chart :chart-data="chartData" height="600px" />
          </el-row>
        </el-col>
        -->
      </el-row>
    </el-dialog>

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
      subKey: 'SlotsScriptStatisticsConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      tableData: [],
      scriptClientDB: new ClientTableData([], 1, filterMap),
      coordinateClientDB: new ClientTableData([], 1, filterMap),
      stepClientDB: new ClientTableData([], 1, filterMap),
      showBtn: 0,
      libShow: $libShow,
      item: {
        Gid: 0,
        OddsList: [{MinOdds: 0, MaxOdds: 0}]
      },
      selectGameVisible: false,
      gameOptions: [],

      scriptTableData: [],
      coordinateTableData: [],
      stepTableData: [],

      queryTime: new Date().getTime(),
      loading: false,
      cfgMap: {},
      queryGid: 80,
      gidOptions: {},
      sumData: {},
      stepSum: {},
      coordinateSum: {},
      detailVisible: false,
      showData: {},
      mapCnt: {},
      timesSum: 0,
    }
  },
  created() {
    this.getData()
    this.getGameList()
    this.getSlotsScriptStatistics()
    this.queryKeyInput()
  },
  methods: {
    refreshStep() {
      this.stepTableData = this.stepClientDB.GetCurrentPageData()
    },
    refreshScript() {
      this.scriptTableData = this.scriptClientDB.GetCurrentPageData()
    },
    refreshCoordinate() {
      this.coordinateTableData = this.coordinateClientDB.GetCurrentPageData()
    },
    handleClick(tab, event) {
      if (parseInt(tab.index) == 0) {
        this.getSlotsScriptStatistics()
      }
      if (parseInt(tab.index) == 1) {
        this.getData()
      }
    },
    newItem() {
      return this.item
    },
    updateGid() {
      this.queryGid = 80
    },
    addOne() {
      this.item = {
        Gid: 0,
      },
        this.showBtn = 0
      this.selectGameVisible = true
    },
    getTitle(gid, idx) {
      let bet = this.cfgMap[gid].Bet || 0
      if (80) {
        bet = this.cfgMap[gid].Bet || 100
      }
      let max = parseInt(this.cfgMap[gid].OddsList[idx].MaxOdds) + parseInt(bet)
      let min = parseInt(this.cfgMap[gid].OddsList[idx].MinOdds) + parseInt(bet)
      if (idx === 0) {
        return '(' + '0 ,' + max + ']'
      }
      if (idx === this.cfgMap[gid].length - 1) {
        return '(' + min + '≥ ∞' + ']'
      }
      return '(' + min + ',' + max + ']'
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || []
          $this.postData = response.Data || []
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            for (let o of cfg) {
              this.cfgMap[o.Gid] = {OddsList: o.OddsList, Bet: o.Bet}
            }
          }
        }
      })
    },
    getGameName(gid) {
      for (let o of this.gameOptions) {
        if (o.key == parseInt(gid)) {
          return o.label
        }
      }
    },
    handleSizeChange(val) {
      this.scriptClientDB.GetPage().SetPageNum(val)
      this.refreshScript()
    },
    handleCurrentChange(val) {
      this.scriptClientDB.GetPage().SetPageNo(val)
      this.refreshScript()
    },
    coordinateHandleSizeChange(val) {
      this.coordinateClientDB.GetPage().SetPageNum(val)
      this.refreshCoordinate()
    },
    queryKeyInput() {
      console.log(this.queryGid)
      this.coordinateClientDB.Search(this.queryGid, ['gid'])
      this.scriptClientDB.Search(this.queryGid, ['gid'])
      this.stepClientDB.Search(this.queryGid, ['gid'])
      this.refreshScript()
      this.refreshCoordinate()
      this.refreshStep()
    },
    coordinateHandleCurrentChange(val) {
      this.coordinateClientDB.GetPage().SetPageNo(val)
      this.refreshCoordinate()
    },
    stepHandleSizeChange(val) {
      this.coordinateClientDB.GetPage().SetPageNum(val)
      this.refreshCoordinate()
    },
    stepHandleCurrentChange(val) {
      this.stepClientDB.GetPage().SetPageNo(val)
      this.refreshStep()
    },
    getSlotsScriptStatistics() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/script/statistics',
          Env: store.getters.env,
          queryTime: parseInt(this.queryTime / 1000),
        }
      }).then(response => {
        // coordinate 返回数据格式，SlotsType_剧本_x_y
        // script 返回数据格式， slotsType, 配置index
        console.log('list response', response)
        let coordinateTableData = []
        let scriptTableData = []
        let stepTableData = []

        this.stepSum = {}
        this.sumData = {}
        this.coordinateSum = {}

        if (response.RetCode === 0) {
          for (const key in response.Data["coordinate"]) {
            // SlotsType__剧本_x_y
            var strings1 = key.split('_')
            let prefix = ''
            if (parseInt(strings1[1]) === -2) {
              prefix = '指定正数'
            } else if (parseInt(strings1[1]) === -1) {
              prefix = '指定负数'
            } else {
              prefix = '常规' + (parseInt(strings1[1]) + 1)
            }
            this.coordinateSum[strings1[0]] = parseInt(response.Data["coordinate"][key]) + (this.coordinateSum[strings1[0]] || 0)
            coordinateTableData.push({
              gid: strings1[0],
              type: prefix + '(' + strings1[2] + ',' + strings1[3] + ')',
              sort: parseInt(strings1[1]),
              cnt: response.Data["coordinate"][key]
            })
            $this.gidOptions[strings1[0]] = strings1[0]
          }
          let scriptMap = {}
          for (const key in response.Data["script"]) {
            var strings = key.split('_');
            this.sumData[strings[0]] = parseInt(response.Data["script"][key]) + (this.sumData[parseInt(strings[0])] || 0)

            scriptTableData.push({gid: strings[0], idx: strings[1], cnt: response.Data["script"][key]})
            $this.gidOptions[strings[0]] = strings[0]
          }
          // 步数统计
          for (const key in response.Data["step"]) {
            // SlotsType_目标倍率_当前倍率_剧本_x_y
            var strings1 = key.split('_')
            let prefix = ''
            if (parseInt(strings1[1]) === -2) {
              prefix = '指定正数'
            } else if (parseInt(strings1[1]) === -1) {
              prefix = '指定负数'
            } else {
              prefix = '常规' + (parseInt(strings1[1]) + 1)
            }
            if (!scriptMap[strings1[0] + '_' + prefix]) {
              scriptMap[strings1[0] + '_' + prefix] = {gid: strings1[0], rows: {}, column: {}, sheet: strings1[1]}
            }
            let step = parseInt(strings1[3])
            $this.mapCnt[strings1[0] + "_" + strings1[1] + "_" + strings1[2] + '_' + step] = response.Data["step"][key]
            scriptMap[strings1[0] + '_' + prefix].rows[step] = []
            scriptMap[strings1[0] + '_' + prefix].column[strings1[2]] = response.Data["times"][strings1[0] + "_" + strings1[1] + "_" + strings1[2]]
          }

          for (const key in scriptMap) {
            stepTableData.push({
              gid: scriptMap[key].gid,
              title: key.split("_")[1],
              rows: scriptMap[key].rows,
              column: scriptMap[key].column,
              cnt: scriptMap[key].cnt,
              sheet: scriptMap[key].sheet,
            })
          }

        }
        coordinateTableData.sort(function (a, b) {
          return b.cnt - a.cnt
        })

        stepTableData.sort(function (a, b) {
          return b.cnt - a.cnt
        })

        scriptTableData.sort(function (a, b) {
          return a.idx - b.idx
        })

        this.scriptClientDB = new ClientTableData(scriptTableData, 20, filterMap, 'sort', -1)
        this.coordinateClientDB = new ClientTableData(coordinateTableData, 20, filterMap, 'idx', -1)
        this.stepClientDB = new ClientTableData(stepTableData, 20, filterMap, 'idx', -1)
        this.queryKeyInput()

        $this.loading = false
      })
    },
    checkDuplicate(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === this.idx && this.tableData[i].Gid === data.Gid) {
          continue
        }
        if (this.tableData[i].Gid === data.Gid) {
          return false
        }
      }
      return true
    },
    showStepDetail(data) {
      var row = JSON.parse(JSON.stringify(data));
      this.timesSum = 0
      for (const rowKey in row.rows) {
        for (const columnKey in row.column) {
          let key = row.gid + "_" + row.sheet + "_" + columnKey + '_' + rowKey
          row.rows[rowKey].push(this.mapCnt[key] || 0)
        }
      }

      for (const columnKey in row.column) {
        this.timesSum += parseInt(row.column[columnKey])
      }
      this.detailVisible = true
      this.showData = row
    },
    exportExcel() {
      if (this.stepTableData.length<=0){
        Message.error("没有要导出的数据")
        return
      }

      let scriptMap = {1:1, 2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17,18:18,19:19,20:20}
      let stepMap = { 2:5, 3:10, 4:15, 5:20, 6:25, 7:30, 8:35, 9:40, 10:45, 11:50}
      this.$confirm("是否确认导出当前游戏统计数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((response) => {
        let result = [["剧本","剧本/步数",  "5","10", "15", "20", "25", "30", "35", "40", "45", "50"] ]// 表格表头
        for (const key in this.stepTableData) {
          // 索引占位
          for (const scriptKey in scriptMap) {
            let dat = []
            dat.push(this.stepTableData[key].title)
            dat.push(scriptKey)
            for (const stepKey in stepMap) {
              if (stepKey==0|| stepKey==1){
                continue
              }

              let keyStr = this.stepTableData[key].gid + "_" + this.stepTableData[key].sheet + "_" +  scriptKey  + '_' + stepMap[stepKey]
              console.log(keyStr)
              dat[stepKey] = this.mapCnt[keyStr] || 0
            }
            result.push(dat)
          }
        }


        let workSheet = XLSX.utils.aoa_to_sheet(result);
        let bookNew = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(bookNew, workSheet, 'step') // 工作簿名称
        let name = this.getGameName(parseInt(this.stepTableData[0].gid)) +'_'+  this.timestampToTime(this.queryTime)+'_step.xlsx'
        XLSX.writeFile(bookNew, name) // 保存的文件名
      })
    },
    timestampToTime(timestamp) {
      timestamp = timestamp ? timestamp : null;
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
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
