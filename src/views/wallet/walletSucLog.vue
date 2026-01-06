<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline   :inline="true" size="small">
          <el-select v-model="item.app" filterable placeholder="请选择" size="mini">
            <el-option
              v-for="row in appInfo"
              :key="row.key"
              :label="row.label"
              :value="row.key"
            />
          </el-select>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="queryTime"
              type="date"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="Uid">
            <el-input v-model="item.uid" placeholder="Uid" size="mini" />
          </el-form-item>
          <el-form-item label="交易id">
            <el-input v-model="item.txId" placeholder="交易id" size="mini" style="width: 225px"/>
          </el-form-item>
          <el-form-item label="操作类型">
          <el-select v-model.number="item.actType" placeholder="请选择" size="mini">
            <el-option v-for="(o,key) in actTypeMap" :key="key" :label="o" :value="parseInt(key)" />
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
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
          <el-table-column label="成功时间" width="150px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.OpTime) }}
            </template>
          </el-table-column>
          <el-table-column label="结束时间" width="150px" align="center">
            <template slot-scope="scope">
             <span v-if="scope.row.EndTime>0"> {{ formatTime(scope.row.EndTime) }}</span>
             <span v-else> - </span>
            </template>
          </el-table-column>
          <el-table-column label="游戏">
            <template slot-scope="scope">
              {{ gameMap[scope.row.GameId] }}
            </template>
          </el-table-column>
          <el-table-column label="应用id">
            <template slot-scope="scope">
              {{ scope.row.App }}
            </template>
          </el-table-column>
          <el-table-column label="Uid">
            <template slot-scope="scope">
              {{ scope.row.Uid }}
            </template>
          </el-table-column>

<!--          <el-table-column label="回合id" width="220px">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.RoundId }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="操作类型">
            <template slot-scope="scope">
              {{ actTypeMap[scope.row.ActType ]}}
            </template>
          </el-table-column>
          <el-table-column label="日志类型" width="120px">
            <template slot-scope="scope">
              {{ logTypeMap[scope.row.LogType ]}}
            </template>
          </el-table-column>

          <el-table-column label="操作金额" width="160px">
            <template slot-scope="scope">
              <span v-if="scope.row.BetAmount!= 0 && scope.row.LogType !== 4 "> {{ formatNumber(scope.row.BetAmount /1000) }}</span>
              <span v-else-if="scope.row.RollMoney!== 0 && scope.row.LogType !== 4"> {{ formatNumber(scope.row.RollMoney /1000) }}</span>
              <span v-else-if="scope.row.TotalPayoffAmount> 0 && scope.row.LogType === 11"> {{ formatNumber(scope.row.TotalPayoffAmount /1000) }}</span>
              <span v-else-if="scope.row.TotalPayoffAmount> 0 && scope.row.LogType === 12"> {{ formatNumber(scope.row.TotalPayoffAmount /1000) }}</span>
              <span v-else>{{0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作前余额">
            <template slot-scope="scope">
              {{ formatNumber(scope.row.BeforeBalance /1000) }}
            </template>
          </el-table-column>
          <el-table-column label="返奖/消耗">
            <template slot-scope="scope">
              {{ formatNumber(scope.row.TotalPayoffAmount / 1000) }}
            </template>
          </el-table-column>
          <el-table-column label="操作后余额">
            <template slot-scope="scope">
              {{formatNumber( scope.row.Balance  /1000)}}
            </template>
          </el-table-column>
          <el-table-column label="重试次数">
            <template slot-scope="scope">
              {{ scope.row.RetryCnt }}
            </template>
          </el-table-column>
          <el-table-column label="扩展数据">
            <template slot-scope="scope">
              {{ scope.row.ExtData }}
            </template>
          </el-table-column>
          <el-table-column label="查看id" >
            <template slot-scope="scope">
              <el-button  @click="showTxId(scope.row)"> 查看id</el-button>
            </template>
          </el-table-column>
<!--          <el-table-column label="操作">-->
<!--            <template slot-scope="scope" style="width: 100px;">-->
<!--              <el-button type="text" size="mini" @click="retry(scope.row.TxId)">手动重试</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
    <el-dialog   :visible.sync="visibleID" >
       <el-descriptions border column="1">
         <el-descriptions-item label="交易id">{{ showRow.TxId}}</el-descriptions-item>
         <el-descriptions-item label="回合id">{{ showRow.RoundId}}</el-descriptions-item>
       </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {$libDate, $libShow} from "@/utils/common";
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      queryTime: $libDate.GetDayBegin(new Date()),
      libShow: $libShow,
      appInfo: [],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        limit: 20,
        offset: 1,
        uid: '',
        gid: 0,
        app: 0,
        txId: '',
        status: 0,
        actType:0,
      },
      showRow:{},
      visibleID:false,
      tableData: [],
      gameMap: {},
      failTypeMap: {
        1: '派彩失败', 2: '游戏结算失败', 3: '转入失败', 4: '下注失败',
      },
      statusMap: {
        1: '等待重试', 2: '正在重试', 3: '重试成功',
      },
      actTypeMap:{
        0: '查询所有',
        1000 :'玩牌赢',
        1001 :'玩牌输',
        2000 :'下注',
        2001 :'登录',
        2002 :'刷新',
        2003 :'回合结束',
        2004 :'回退',
        2005 :'增值',
        2006 :'预扣',
        2007 :'游戏结算',
        2008 :'平台结算',
        2009 :'转入平台',
        2010 :'比赛报名',
        2011 :'比赛结束',
        2014 :'下注并派彩',
        2013 :'JACKPOT',
      },
      logTypeMap:{
        1: '登录日志',
        2 :'刷新日志',
        3 :'下注日志',
        4 :'slots/小游戏结算',
        5 :'转出',
        6 :'回退',
        7 :'增值业务',
        8 :'游戏结算',
        9 :'平台结算',
        10 :'转入',
        11 :'比赛报名',
        12 :'比赛结束',
        15 :'下注并派彩',
        14 :'中JACKPOT',
      },
      totalCount: 2,
    }
  },
  created() {
    this.getGameList()
    this.getData()
    this.getAppInfo()
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    showTxId(row){
      this.showRow = row
      this.visibleID =true
    },
    getData() {
      const $this = this
      let startTime = $this.queryTime / 1000
      let endTime = startTime + 86399
      console.log(endTime)
      let uid = 0
      if ($this.item.uid === '') {
        uid = 0
      }else {
        let exp = /^[0-9]*$/;
        console.log("=====",$this.item.uid,exp.test($this.item.uid))
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
          Path: '/wallet/suc/log',
          StartTime: startTime,
          EndTime: endTime,
          Offset: ($this.item.offset - 1) * $this.item.limit,
          Limit: $this.item.limit,
          Uid: uid,
          Gid: $this.item.gid,
          App: $this.item.app,
          TxId: $this.item.txId,
          ActType: $this.item.actType,
        }
      }).then(response => {
        console.log("=====", response)
        $this.tableData = []
        console.log(response)
        if (response.RetCode === 0) {
          if (response.Data == 'no Data') {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.item.limit){
            $this.totalCount = ($this.item.offset - 1) * $this.item.limit +$this.item.limit +1
          }
          console.log($this.totalCount)
        }
        console.log(response)
      })
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
		  //todo 临时添加比赛 -- chb
		  this.gameMap[2031] = 'Tongits-Mtt'
        }
      })
    },
    retry(txid){
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/retry/faillog',
          TxId: txid,
        }
      }).then(response => {
        console.log("=====", response)
        if (response.RetCode === 0) {
          Message.success("重试成功！")
        }else {
          Message.error("重试失败！",response.Data)
        }
      })
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },

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
