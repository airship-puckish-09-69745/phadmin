<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="timeRange"
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
          <el-form-item label="UniqueNo">
            <el-input v-model="item.uniqueNo" placeholder="UniqueNo" size="mini" style="width: 225px"/>
          </el-form-item>
          <el-form-item label="状态">
          <el-select v-model.number="item.status" placeholder="请选择" size="mini">
            <el-option label="所有" :value="0" />
            <el-option label="等待重试" :value="1" />
            <el-option label="正在重试" :value="2" />
            <el-option label="重试成功" :value="3" />
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
<!--            <el-button type="success" size="mini" @click="retryTimeFailLog">更新派彩时间</el-button> //todo-->
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15"/>
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
          <el-table-column label="首次失败时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.FirstTryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="uid">
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>
          <el-table-column label="gid">
            <template slot-scope="scope">
              {{ scope.row.GameId }}
            </template>
          </el-table-column>
          <el-table-column label="appid">
            <template slot-scope="scope">
              {{ scope.row.App }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ statusMap[scope.row.Status] }}
            </template>
          </el-table-column>

          <el-table-column label="下次重试时间" width="160px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.NextTryTime) }}
            </template>
          </el-table-column>
          <el-table-column label="总计重试次数">
            <template slot-scope="scope">
              {{ scope.row.ReTryNum }}
            </template>
          </el-table-column>
          <el-table-column label="UniqueNo" width="500" >
            <template slot-scope="scope">
              {{ scope.row.UniqueNo }}
            </template>
          </el-table-column>
          <el-table-column label="操作"> //todo
            <template slot-scope="scope" style="width: 100px;">
              <el-button type="text" size="mini" @click="retry(scope.row.UniqueNo)">重试</el-button>
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
              :current-page="item.currPage"
              :page-sizes="[20]"
              :page-size="item.limit"
              layout=" prev, next"
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
import {$libDate, $libShow, ClientTableData} from "@/utils/common";
import {Message} from "element-ui";
import { base64 } from 'jszip/lib/support';
const filterMap = {

}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        limit: 20,
        offset: 1,
        uid: '',
        gid: 0,
        app: 0,
        uniqueNo: '',
        status: 0,
      },
      showRow:{},
      visibleID:false,
      tableData: [],
      gameMap: {},
      statusMap: {
        1: '等待重试', 2: '正在重试', 3: '重试成功',
      },
      totalCount: 0,
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getData() {
      const $this = this
      let minTime = 0
      let maxTime = 0
      if (this.timeRange) {
        minTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        maxTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      let uid = 0
      if ($this.item.uid === '') {
        uid = 0
      }else {
        let exp = /^[0-9]*$/;
        if (!exp.test($this.item.uid)) {
          Message.error('请输入正确的uid')
          return
        }
        uid = $this.item.uid
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/pointgame/fail/log',
          FirstTryTimeMin: minTime,
          FirstTryTimeMax: maxTime,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          Uid: uid,
          Gid: $this.item.gid,
          App: $this.item.app,
          UniqueNo: $this.item.uniqueNo,
          Status: $this.item.status,
        }
      }).then(response => {
        $this.tableData = []
        console.log("===========",response.Data)
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.item.limit){
            $this.totalCount = ($this.item.offset - 1) * $this.item.limit +$this.item.limit +1
          }
        }
        console.log("========",response)
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameMap[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    },
    retry(uniqueNo){
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/pointgame/fail/retry',
          UniqueNo: uniqueNo,
        }
      }).then(response => {
        console.log("=====", response)
        if (response.RetCode === 0) {
          Message.success("重试成功！")
        }
      })
    },
    //todo:
    // retryTimeFailLog(){
    //   request({
    //     url: '/dataProxy/info',
    //     method: 'post',
    //     data: {
    //       Path: '/wallet/retry/time/faillog',
    //       retryTime: parseInt(new Date().getTime() / 1000),
    //     }
    //   }).then(response => {
    //     console.log("=====", response)
    //     if (response.RetCode === 0) {
    //       Message.success(response.Data)
    //       this.getData()
    //     }
    //   })
    // },
    // 分页处理
    handleSizeChange(val) {
      this.item.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.item.offset= val
      this.getData()
    },

  }
}
</script>
