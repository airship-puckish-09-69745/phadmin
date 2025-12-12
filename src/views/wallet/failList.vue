<template>
    <div class="app-container" style="padding: 10px">
      <div style="padding-top: 10px">
        <el-table
          :data="tableData"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
          @row-click="clickData"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="uid"
            label="用户id"
            sortable="custom"
            width="90"
          />
          <el-table-column
            prop="Uid"
            label="昵称"
            width="120"
          />
          <el-table-column
            prop="App"
            label="应用ID"
            width="120"
          />
          <el-table-column
            prop="GameId"
            label="游戏"
            width="90"
          />
          <el-table-column
            prop="TxId"
            label="交易号"
            width="80"
          />
          <el-table-column
            prop="RoundId"
            label="回合号"
            width="90"
          />
          <el-table-column
            prop="ActType"
            label="操作类型"
            width="90"
          />
          <el-table-column
            prop="FailType"
            label="失败类型"
            width="90"
          />
          <el-table-column
            prop="OpTime"
            label="失败时间"
            sortable
            width="150"
            >
            <template slot-scope="scope">
                <DateTimeShow :show-type="2" :timestamp="scope.row.OpTime" />
            </template>
          </el-table-column>
          <el-table-column
            prop="Status"
            label="状态"
            width="90"
          />
          <el-table-column
            prop="NextTryTime"
            label="下次重试时间"
            sortable
            width="150"
            >
            <template slot-scope="scope">
                <DateTimeShow :show-type="2" :timestamp="scope.row.NextTryTime" />
            </template>
          </el-table-column>
          <el-table-column
            prop="ReTryNum"
            label="重试次数"
            width="90"
          />
        </el-table>
        <el-col :offset="16" :span="8">
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
      </div>
    </div>
  </template>

  <script>
  import { Message } from 'element-ui'
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'
  import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
  export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { Compare, Publish },
    data() {
      return {
        tableData: [],
        clientDB: new ClientTableData([], 10, {}),
        libShow: $libShow,
        actTypeMap: {
          3000: '比赛营销接口-系统发放',
          3001: '比赛营销接口派彩',
          3002: '德州比赛营销接口派彩',
          3003: '摇钱树活动营销接口派彩',
          3004: '复活节活动营销接口派彩',
          3005: '直播抽奖接口派彩',
          3006: '新手任务活动营销接口派彩',
          3007: '空投活动营销接口派彩',
          3008: '红包雨活动营销接口派彩',
          3009: '活动地图营销接口派彩',
          3010: 'Poker专题活动营销接口派彩',
          3011: 'TongitsHunter活动营销接口派彩',
          3012: 'KingOfPot活动营销接口派彩',
          3013: '有效下注排行榜活动营销接口派彩',
          3014: '7日留存活动',
          3015: 'Pusoy比赛营销接口派彩',
          3016: '万圣节活动营销接口派彩'
        }
      }
    },

    computed: {

    },
    created() {

    },
    methods: {
        // 分页处理
        async refreshShow() {
            this.uidMap = {}
            this.tableData = this.clientDB.GetCurrentPageData()
            for (const o in this.tableData) {
                this.uidMap[this.tableData[o].Uid] = 0
            }

            this.uids = []
            for (var key in this.uidMap) {
                this.uids.push(key)
            }
        if (this.envProjectName != 'ph_audit') {
            request({
                url: '/dataProxy/is/robot',
                method: 'get',
                data: {
                    Env: this.env,
                    Uids: JSON.stringify(this.uids)
                }
                }).then(response => {
                if (response.RetCode === 0) {
                    for (const key in response.Data) {
                    this.isRobotMap[key] = response.Data[key]
                    }
                    for (const o of this.tableData) {
                    if (this.isRobotMap[o.Uid]) {
                        o.IsRobot = -1
                    }
                    }
                }
                })
            }
        },

        sleep(ms) { // sleep延迟方法2
            var unixtime_ms = new Date().getTime()
            while (new Date().getTime() < unixtime_ms + ms) {}
        },
        handleSizeChange(val) {
            this.clientDB.GetPage().SetPageNum(val)
            this.refreshShow()
        },
        handleCurrentChange(val) {
            this.clientDB.GetPage().SetPageNo(val)
            this.refreshShow()
        },
        // 显示相关
        formatTime(ts) {
            return $libDate.FormateSecondStr(ts, 2)
        },
    }
  }
  </script>
