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
              <el-option label="所有" :value="0"/>
              <el-option v-for="(o,k) in gidOptions" :key="k" :label="getGameName(o)" :value="o"/>
            </el-select>
            <el-button type="primary" size="mini" @click="getSlotsScriptStatistics">查询</el-button>
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
              <el-table-column
                prop="gid"
                label="游戏"
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
                  {{ (parseInt(scope.row.cnt) / sumData * 100).toFixed(2) + "%" }}
                </template>
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
                {{ (parseInt(scope.row.cnt) / coordinateSum * 100).toFixed(2) + "%" }}
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
                {{ (parseInt(scope.row.cnt) / stepSum * 100).toFixed(2) + "%" }}
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

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {$libShow, ClientTableData} from '@/utils/common'
import store from "@/store";

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
      queryGid: 0,
      gidOptions: {},
      sumData:0,
      stepSum:0,
      coordinateSum:0,
    }
  },
  created() {
    this.getData()
    this.getGameList()
    this.getSlotsScriptStatistics()
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
      this.queryGid = 0
    },
    addOne() {
      this.item = {
        Gid: 0,
      },
        this.showBtn = 0
      this.selectGameVisible = true
    },
    getTitle(gid, idx) {
      let max = parseInt(this.cfgMap[gid][idx].MaxOdds)+100
      let min = parseInt(this.cfgMap[gid][idx].MinOdds)+100
      if (idx === 0) {
        return '(' + '0 ,' +max + ']'
      }
      if (idx === this.cfgMap[gid].length - 1) {
        return '(' + min + '≥ ∞' + ']'
      }
      return '(' + min + ',' +max + ']'
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
              this.cfgMap[o.Gid] = o.OddsList
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
      this.coordinateClientDB.Search(this.queryGid, ['gid'])
      this.scriptClientDB.Search(this.queryGid, ['gid'])
      this.refreshScript()
      this.refreshCoordinate()
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
        this.sumData = 0
        this.stepSum = 0
        this.coordinateSum = 0
        if (response.RetCode === 0) {
          for (const key in response.Data["coordinate"]) {
            // SlotsType__剧本_x_y
            var strings1 = key.split('_')
            let prefix=''
            if (parseInt(strings1[1]) === -2) {
              prefix='指定正数'
            } else if  (parseInt(strings1[1]) === -1) {
              prefix='指定负数'
            } else {
              prefix='常规'+(parseInt(strings1[1])+1)
            }
            this.coordinateSum+=parseInt(response.Data["coordinate"][key])
            coordinateTableData.push({
              gid: strings1[0],
              type:  prefix + '(' + strings1[2] + ',' + strings1[3] + ')',
              sort: parseInt(strings1[1]),
              cnt: response.Data["coordinate"][key]
            })
            $this.gidOptions[strings1[0]] = strings1[0]
          }

          for (const key in response.Data["script"]) {
            var strings = key.split('_');
            this.sumData += parseInt(response.Data["script"][key])
            scriptTableData.push({gid: strings[0], idx: strings[1], cnt: response.Data["script"][key]})
          }

          for (const key in response.Data["step"]) {
            // SlotsType_目标倍率_当前倍率_剧本_x_y
            var strings1 = key.split('_')
            let prefix=''
            if (parseInt(strings1[1]) === -2) {
              prefix='指定正数'
            } else if  (parseInt(strings1[1]) === -1) {
              prefix='指定负数'
            } else {
              prefix='常规'+(parseInt(strings1[1])+1)
            }
              let step = parseInt(strings1[3])+5
            this.stepSum+=parseInt(response.Data["step"][key])
            stepTableData.push({
              gid: strings1[0],
              type:  prefix + '(' + strings1[2] + ',' + step + ')',
              sort: parseInt(strings1[1]),
              cnt: response.Data["step"][key]
            })
            $this.gidOptions[strings1[0]] = strings1[0]
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
        this.refreshCoordinate()
        this.refreshScript()
        this.refreshStep()

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
    updateDuplicate(newData, oldData) {

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
              label: response.Data[i].Scene
            })
          }
        }
      })
    }
  }
}
</script>
