<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">

        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.BeginDate"
            value-format="timestamp"
            type="date"
            placeholder="开始时间"
          />
        </el-form-item>

        <el-form-item label="">
          <span> - </span>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.EndDate"
            value-format="timestamp"
            type="date"
            placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item label="玩法">
          <el-select v-model="searchForm.PlayMethod" placeholder="请选择">
            <el-option v-for="(item, key) in playMethodList" :key="key" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="场次">
          <el-select v-model="searchForm.RoundTimes" placeholder="请选择">
            <el-option v-for="(item, key) in roundTimesList" :key="key" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="付费项">
          <el-select v-model="searchForm.Payment" placeholder="请选择">
            <el-option v-for="(item, key) in paymentList" :key="key" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" size="mini" @click="inquire">查询</el-button>
        </el-form-item>

      </el-form>
    </el-row>

    <el-table
      v-if="isShowAll"
      ref="filterTable"
      :data="allCurrentData"
      show-summary
      :summary-method="getSummaries"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Timestamp" label="日期">
        <template slot-scope="scope"> {{ formateDate(scope.row.Timestamp, 1) }}
        </template>
      </el-table-column>

      <el-table-column prop="RabbitPeopleNum" label="猎兔使用人数">
        <template slot-scope="scope">
          {{ scope.row.RabbitPeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="RabbitCost" label="猎兔总消耗">
        <template slot-scope="scope">
          {{ scope.row.RabbitCost }}
        </template>
      </el-table-column>

      <el-table-column prop="DelayPeopleNum" label="延时道具使用人数">
        <template slot-scope="scope">
          {{ scope.row.DelayPeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="DelayCost" label="延时道具总消耗">
        <template slot-scope="scope">
          {{ scope.row.DelayCost }}
        </template>
      </el-table-column>

      <el-table-column prop="ForcePeopleNum" label="强制道具使用人数">
        <template slot-scope="scope">
          {{ scope.row.ForcePeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="ForceCost" label="强制道具总消耗">
        <template slot-scope="scope">
          {{ scope.row.ForceCost }}
        </template>
      </el-table-column>

      <el-table-column prop="InteractPeopleNum" label="互动道具使用人数">
        <template slot-scope="scope">
          {{ scope.row.InteractPeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="InteractCost" label="互动道具总消耗">
        <template slot-scope="scope">
          {{ scope.row.InteractCost }}
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="isShowRabbit"
      ref="filterTable"
      :data="rabbitCurrentData"
      show-summary
      :summary-method="getSummariesRabbit"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Timestamp" label="日期">
        <template slot-scope="scope"> {{ formateDate(scope.row.Timestamp, 1) }}
        </template>
      </el-table-column>

      <el-table-column prop="PeopleNum" label="猎兔使用人数">
        <template slot-scope="scope">
          {{ scope.row.PeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="Times" label="猎兔总次数">
        <template slot-scope="scope">
          {{ scope.row.Times }}
        </template>
      </el-table-column>

      <el-table-column prop="AverageTimes" label="人均猎兔次数">
        <template slot-scope="scope">
          {{ scope.row.AverageTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="TotalCost" label="猎兔总消耗">
        <template slot-scope="scope">
          {{ scope.row.TotalCost }}
        </template>
      </el-table-column>

      <el-table-column prop="PreflopRoundTimes" label="翻牌前猎兔次数">
        <template slot-scope="scope">
          {{ scope.row.PreflopRoundTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="FlopRoundTimes" label="翻牌圈猎兔次数">
        <template slot-scope="scope">
          {{ scope.row.FlopRoundTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="TurnRoundTimes" label="转牌圈猎兔次数">
        <template slot-scope="scope">
          {{ scope.row.TurnRoundTimes }}
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="isShowDelay"
      ref="filterTable"
      :data="delayCurrentData"
      show-summary
      :summary-method="getSummariesOther"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Timestamp" label="日期">
        <template slot-scope="scope"> {{ formateDate(scope.row.Timestamp, 1) }}
        </template>
      </el-table-column>

      <el-table-column prop="PeopleNum" label="延时使用人数">
        <template slot-scope="scope">
          {{ scope.row.PeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="Times" label="延时总次数">
        <template slot-scope="scope">
          {{ scope.row.Times }}
        </template>
      </el-table-column>

      <el-table-column prop="AverageTimes" label="人均延时次数">
        <template slot-scope="scope">
          {{ scope.row.AverageTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="TotalCost" label="延时总消耗">
        <template slot-scope="scope">
          {{ scope.row.TotalCost }}
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="isShowForce"
      ref="filterTable"
      :data="forceCurrentData"
      show-summary
      :summary-method="getSummariesOther"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Timestamp" label="日期">
        <template slot-scope="scope"> {{ formateDate(scope.row.Timestamp, 1) }}
        </template>
      </el-table-column>

      <el-table-column prop="PeopleNum" label="强制看牌人数">
        <template slot-scope="scope">
          {{ scope.row.PeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="Times" label="强制看牌总次数">
        <template slot-scope="scope">
          {{ scope.row.Times }}
        </template>
      </el-table-column>

      <el-table-column prop="AverageTimes" label="人均看牌次数">
        <template slot-scope="scope">
          {{ scope.row.AverageTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="TotalCost" label="强制看牌总消耗">
        <template slot-scope="scope">
          {{ scope.row.TotalCost }}
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="isShowInteract"
      ref="filterTable"
      :data="interactCurrentData"
      show-summary
      :summary-method="getSummariesOther"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Timestamp" label="日期">
        <template slot-scope="scope"> {{ formateDate(scope.row.Timestamp, 1) }}
        </template>
      </el-table-column>

      <el-table-column prop="PeopleNum" label="付费互动道具使用人数">
        <template slot-scope="scope">
          {{ scope.row.PeopleNum }}
        </template>
      </el-table-column>

      <el-table-column prop="Times" label="付费互动道具使用次数">
        <template slot-scope="scope">
          {{ scope.row.Times }}
        </template>
      </el-table-column>

      <el-table-column prop="AverageTimes" label="人均付费互动道具使用次数">
        <template slot-scope="scope">
          {{ scope.row.AverageTimes }}
        </template>
      </el-table-column>

      <el-table-column prop="TotalCost" label="付费互动道具总消耗">
        <template slot-scope="scope">
          {{ scope.row.TotalCost }}
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-row type="flex" justify="end">
      <el-col :span="6">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
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
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
// import { Message } from 'element-ui'

export default {
  name: 'RocketRet',
  data() {
    return {
      searchForm: {
        BeginDate: $libDate.GetDayBegin(new Date().getTime()),
        EndDate: $libDate.GetDayBegin(new Date().getTime()),
        Uid: '',
        LogID: ''
        // PlayMethod: 0
      },
      playMethodList: [],
      roundTimesList: [],
      paymentList: [],
      isShowAll: true,
      isShowRabbit: false,
      isShowDelay: false,
      isShowForce: false,
      isShowInteract: false,
      totalInsure: 0,
      tableData: [],
      // currentData: [],
      totalCount: 0,
      currentPage: 1,
      pageNum: 10,
      allCurrentData: [],
      rabbitCurrentData: [],
      delayCurrentData: [],
      forceCurrentData: [],
      interactCurrentData: [],
      libShow: $libShow
    }
  },
  created() {
    this.playMethodList = []
    this.playMethodList.push('全部玩法')
    this.playMethodList.push('猎兔')
    this.playMethodList.push('延时道具')
    this.playMethodList.push('强制看牌道具')
    this.playMethodList.push('付费互动道具')

    this.roundTimesList.push('全部场次')
    this.roundTimesList.push('1/2')
    this.roundTimesList.push('2/4')
    this.roundTimesList.push('5/10')

    this.paymentList.push('全部付费项')
    this.paymentList.push('延时道具消耗')
    this.paymentList.push('付费道具消耗')

    this.searchForm.PlayMethod = '全部玩法'
    this.searchForm.RoundTimes = '全部场次'
    this.searchForm.Payment = '全部付费项'
  },
  methods: {

    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        let total = 0
        if (index === 1) {
          for (const key in data) {
            total += data[key].RabbitPeopleNum
          }
          sums[index] = total
        } else if (index === 2) {
          for (const key in data) {
            total += data[key].RabbitCost
          }
          sums[index] = total
        } else if (index === 3) {
          for (const key in data) {
            total += data[key].DelayPeopleNum
          }
          sums[index] = total
        } else if (index === 4) {
          for (const key in data) {
            total += data[key].DelayCost
          }
          sums[index] = total
        } else if (index === 5) {
          for (const key in data) {
            total += data[key].ForcePeopleNum
          }
          sums[index] = total
        } else if (index === 6) {
          for (const key in data) {
            total += data[key].ForceCost
          }
          sums[index] = total
        } else if (index === 7) {
          for (const key in data) {
            total += data[key].InteractPeopleNum
          }
          sums[index] = total
        } else if (index === 8) {
          for (const key in data) {
            total += data[key].InteractCost
          }
          sums[index] = total
        }
      })
      return sums
    },

    getSummariesRabbit(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        let total = 0
        if (index === 1) {
          for (const key in data) {
            total += data[key].PeopleNum
          }
          sums[index] = total
        } else if (index === 2) {
          for (const key in data) {
            total += data[key].Times
          }
          sums[index] = total
        } else if (index === 3) {
          for (const key in data) {
            total += data[key].AverageTimes
          }
          sums[index] = total
        } else if (index === 4) {
          for (const key in data) {
            total += data[key].TotalCost
          }
          sums[index] = total
        } else if (index === 5) {
          for (const key in data) {
            total += data[key].PreflopRoundTimes
          }
          sums[index] = total
        } else if (index === 6) {
          for (const key in data) {
            total += data[key].FlopRoundTimes
          }
          sums[index] = total
        } else if (index === 7) {
          for (const key in data) {
            total += data[key].TurnRoundTimes
          }
          sums[index] = total
        }
      })
      return sums
    },

    getSummariesOther(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        let total = 0
        if (index === 1) {
          for (const key in data) {
            console.log('data[key]: ', data[key])
            total += data[key].PeopleNum
          }
          sums[index] = total
        } else if (index === 2) {
          for (const key in data) {
            total += data[key].Times
          }
          sums[index] = total
        } else if (index === 3) {
          for (const key in data) {
            total += data[key].AverageTimes
          }
          sums[index] = total
        } else if (index === 4) {
          for (const key in data) {
            total += data[key].TotalCost
          }
          sums[index] = total
        }
      })
      return sums
    },

    // 查询
    inquire() {
      console.log('searchForm: ', this.searchForm)

      let actType = 1

      if (this.searchForm.PlayMethod === '全部玩法') {
        console.log('inquire 1')
        actType = 1
      } else if (this.searchForm.PlayMethod === '猎兔') {
        console.log('inquire 2')
        actType = 49
      } else if (this.searchForm.PlayMethod === '延时道具') {
        console.log('inquire 3')
        actType = 50
      } else if (this.searchForm.PlayMethod === '强制看牌道具') {
        console.log('inquire 4')
        actType = 53
      } else if (this.searchForm.PlayMethod === '付费互动道具') {
        console.log('inquire 5')
        actType = 55
      }

      this.clearData()
      this.setShowHide()

      const _this = this

      let bTime = 0
      let eTime = 0

      bTime = Date.parse(new Date(_this.searchForm.BeginDate).toString()) / 1000
      eTime = Date.parse(new Date(_this.searchForm.EndDate).toString()) / 1000 + 86400

      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/texasnlhmoneylog',
          Type: actType,
          BTime: bTime,
          ETime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // _this.currentData = response.Data
          if (this.searchForm.PlayMethod === '全部玩法') {
            _this.allCurrentData = response.Data
          } else if (this.searchForm.PlayMethod === '猎兔') {
            _this.rabbitCurrentData = response.Data
          } else if (this.searchForm.PlayMethod === '延时道具') {
            _this.delayCurrentData = response.Data
          } else if (this.searchForm.PlayMethod === '强制看牌道具') {
            _this.forceCurrentData = response.Data
          } else if (this.searchForm.PlayMethod === '付费互动道具') {
            _this.interactCurrentData = response.Data
          }
          loading.close()
        } else {
          loading.close()
          console.log('request error response:', response)
        }
      })
    },

    clearData() {
      this.allCurrentData = []
      this.rabbitCurrentData = []
      this.delayCurrentData = []
      this.forceCurrentData = []
      this.interactCurrentData = []
    },

    setShowHide() {
      this.isShowAll = false
      this.isShowRabbit = false
      this.isShowDelay = false
      this.isShowForce = false
      this.isShowInteract = false
      if (this.searchForm.PlayMethod === '全部玩法') {
        this.isShowAll = true
      } else if (this.searchForm.PlayMethod === '猎兔') {
        this.isShowRabbit = true
      } else if (this.searchForm.PlayMethod === '延时道具') {
        this.isShowDelay = true
      } else if (this.searchForm.PlayMethod === '强制看牌道具') {
        this.isShowForce = true
      } else if (this.searchForm.PlayMethod === '付费互动道具') {
        this.isShowInteract = true
      }
    },

    // 分页处理
    refreshShow() {
      // this.currentData = []
      // for (var i = (this.currentPage - 1) * this.pageNum; i < this.tableData.length; i++) {
      //   if (this.currentData.length === this.pageNum) {
      //     break
      //   }
      //   this.currentData.push(this.tableData[i])
      // }
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageNum = val
      this.refreshShow()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.refreshShow()
    },
    sortBy(attr, rev) {
      return function(a, b) {
        var l = a[attr]
        var r = b[attr]
        if (l < r) {
          return rev * -1
        }
        if (l > r) {
          return rev * 1
        }
        return 0
      }
    },
    sortChange(ob) {
      this.currentData.sort(this.sortBy(ob.prop, ob.order === 'ascending' ? 1 : -1))
    },
    formateDate(t, iType) {
      const dt = new Date(t * 1000)
      switch (iType) {
        case 1:
          return dt.Format('yyyy-MM-dd')
        case 2:
          return dt.Format('yyyy-MM-dd HH:mm:ss')
        case 3:
          return dt.Format('MM-dd')
        case 4:
          return dt.Format('HH:mm:ss')
        case 5:
          return dt.Format('HH:mm')
        case 6:
          return dt.Format('MM-dd HH:mm')
        case 7:
          return dt.Format('MM-dd HH:mm:ss')
      }
    }
  }
}
</script>
