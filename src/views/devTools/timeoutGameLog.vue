<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="15">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              v-model="item.time"
              value-format="timestamp"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15" />

      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="showData" label-width="150px">
          <el-table
            :data="showData"
            style="width: 95%"
            border
          >

            <el-table-column
              prop="SvrId"
              label="SvrId"
            />
            <el-table-column
              prop="tid"
              label="桌子id"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.Tid">
                  {{ (scope.row.Tid ) }}
                </span>
                <span v-if="scope.row.tid">
                  {{ (scope.row.tid ) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="GameId"
              label="游戏"
            >
              <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.GameId == item.key ? item.label : "") }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="endTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.endTime">
                  {{ timestampToTime(scope.row.endTime) }}
                </span>
                <span v-if="scope.row.FinishTime">
                  {{ timestampToTime(scope.row.FinishTime) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="GameId"
              label="更多"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ (scope.row) }}
              </template>
            </el-table-column>

            <!--            <el-table-column label="操作">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
          <br>
          <br>
          <br>

        </el-form>
      </el-col>
    </el-row>
    <el-pagination
      background
      :page-size="item.limit"

      layout="prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      form: {},
      errGameLog: [],
      postData: {},
      subKey: 'GameReturnConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      appInfo: [],
      channel: 'Dev',
      appId: 1000002,

      isReturnOptions: [
        { key: 0, label: '否' },
        { key: 1, label: '是' }
      ],

      showData: [],
      item: {
        time: 0.0,
        offset: 1,
        limit: 100
      },
      gameOptions: [],
      total: 0
    }
  },
  created() {
    this.item.time = Date.parse(new Date()) - 3600 * 24
    this.getList()
    this.getData()
  },
  methods: {

    refresh() {
      if (this.channel == 0 && this.appId == 0) {
        this.showData = this.allCfg
        return
      }
      var data = this.allCfg
      if (this.channel != 0) {
        var data2 = data.filter(ele => ele.channel == this.channel)
      }
      if (this.appId != 0) {
        var data3 = data2.filter(ele => ele.app_id == this.appId)
      }
      this.showData = data3
    },

    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/errgamelog/errgamelog',
          time: parseInt(this.item.time / 1000),
          offset: (this.item.offset - 1) * this.item.limit,
          limit: this.item.limit
        }
      }).then(response => {
        $this.showData = []
        if (response.RetCode === 0) {
          const list = response.Data.data || []
          for (let i = 0; i < list.length; i++) {
            var parse = JSON.parse(list[i])
            $this.showData.push(parse)
          }
        }
        this.total = response.Data.total
      })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    getList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
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
