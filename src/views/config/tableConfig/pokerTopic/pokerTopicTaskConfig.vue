<template>
  <div class="app-container">

    <publish
      primary-key="Volume"
      :key-id="getFullKey(this.subKey)"
      :env-empty="false"
      compare-type="Object"
      :attr-names="AttrNames"
    />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="15">
        <el-form inline>
          <el-form-item label="游戏：">
            <el-select v-model="selectGid" placeholder="请选择">
              <el-option
                v-for="(value, k) in gameOptions"
                :key="parseInt(k)"
                :label="value"
                :value="parseInt(k)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="queryData()">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加</el-button>
      </el-col>

      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="showData" label-width="150px">
          <el-table
            :data="showData"
            style="width: 95%"
            border
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
          >

            <el-table-column
              prop="Gid"
              label="游戏"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.Gid!==0 && scope.row.Gid!=='' && scope.row.Gid!==null ">
                  {{ gameOptions[scope.row.Gid] }}
                </div>
                <div v-if="scope.row.Gid==0 || scope.row.Gid==''">
                  <el-select v-model="scope.row.Gid" placeholder="请选择">
                    <el-option
                      v-for="(value, k) in gameOptions"
                      :key="parseInt(k)"
                      :label="value"
                      :value="parseInt(k)"
                    />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="Type"
              label="任务类型"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.Type" placeholder="请选择">
                  <el-option
                    v-for="(value, k) in taskOptions"
                    :key="parseInt(k)"
                    :label="value"
                    :value="parseInt(k)"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="Score"
              label="积分"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Score" oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Description"
              label="描述"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Description" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

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

    <el-dialog title="添加" :visible.sync="showAdd" width="30%">
      <el-form label-width="80px">
        <el-form-item label="选择游戏">
          <el-select v-model="item.Gid" placeholder="请选择" size="mini">
            <el-option
              v-for="(value, k) in gameOptions"
              :key="parseInt(k)"
              :label="value"
              :value="parseInt(k)"
            />
          </el-select>
        </el-form-item>

          <el-form-item label="任务类型">
            <el-select v-model="item.Type" placeholder="请选择" size="mini">
              <el-option
                v-for="(value, k) in taskOptions"
                :key="parseInt(k)"
                :label="value"
                :value="parseInt(k)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="积分">
            <el-input v-model.number="item.Score" oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}" size="mini" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="item.Description" size="mini" style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="saveOne">添加</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
const filterMap = {}

import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import { copyObj } from 'codemirror/src/util/misc'
import { $libShow, ClientTableData } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      clientDB: new ClientTableData([], 10, filterMap),
      form: {},
      postData: {},
      subKey: 'poker_topic_score_tasks',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      appInfo: [],
      libShow: $libShow,
      channelOptions: [
        // {key: "0", label: '请选择'},
        { key: 'Dev', label: 'Dev' },
        { key: 'BP', label: 'BP' },
        { key: 'AP', label: 'AP' },
        { key: 'GP', label: 'GP' },
        // { key: 'PG', label: 'PG' }, 2025-12-22去除PG
      ],
      isReturnOptions: [
        { key: 0, label: '否' },
        { key: 1, label: '是' }
      ],
      showData: [],
      showAdd: false,
      item: {
        Gid: 0,
        Type: 0,
        Score: 0,
        GameName: '',
        Description: ''
      },
      selectGid: 0,
      taskOptions: {
        1: '[Tongits]参与游戏',
        2: '[Tongits]获胜',
        3: '[Tongits]发起「Fight」并获胜',
        4: '[Tongits]获胜时持有「A」或「K」',
        5: '[Tongits]结算时手牌持有「Special Meld」（同花顺、四条）',
        6: '[Tongits]通过「Tongits」获胜',
        11: '[Pusoy]参与游戏',
        12: '[Pusoy]获胜',
        13: '[Pusoy]PUSOY其他玩家并获胜',
        14: '[Pusoy]获胜时持有「Straight Flush」或「Four of a Kind」',
        15: '[Pusoy]透过「NATURALS」获胜（Three Straight、Three Flush、6 Pairs、Dragon）',
        16: '[Pusoy]以「全垒打」获胜',
        21: '[Lucky9]参与游戏',
        22: '[Lucky9]获胜',
        23: '[Lucky9]获胜时以3张手牌9点获胜',
        24: '[Lucky9]以「Lucky9 」获胜',
        31: '[Texas]参与游戏',
        32: '[Texas]获胜',
        33: '[Texas]透过「High Card」获胜',
        34: '[Texas]开出「Flush」或「Straight」',
        35: '[Texas]开出「Four of a Kind」或「Full House」',
        36: '[Texas]开出「Straight Flush」',
        41: '[BlackJack]参与游戏',
        42: '[BlackJack]获胜',
        43: '[BlackJack]通过「Double Down」双倍下注获胜',
        44: '[BlackJack]使用「Split」切割后两幅牌均获胜',
        45: '[BlackJack]获胜时以「BlackJack」获胜',
      },
      gameOptions: {
        37: 'BlackJack',
        23: 'Lucky9',
        21: 'Pusoy',
        126: 'Pusoy Wild',
        15: 'Texas Poker',
        22: 'Tongits',
        28: 'Tongits Joker',
        29: 'Tongits Quick'
      }
    }
  },
  created() {
    // this.getGameList()
    this.getData()
  },
  methods: {

    refresh() {
      this.showData = this.allCfg
      return

      // var data = this.allCfg
      // if (this.channel != 0) {
      //   var data2 = data.filter(ele => ele.channel == this.channel)
      // }
      // if (this.appId != 0) {
      //   var data3 = data2.filter(ele => ele.app_id == this.appId)
      // }
      // this.showData = data3
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
      this.showData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    newItem() {
      return JSON.parse(JSON.stringify(this.item))
    },
    addOne() {
      this.showAdd = true
      // this.showData.push(this.newItem())
    },
    saveOne() {
      console.log(this.clientDB.TotalData,this.clientDB.GetPage().GetPageNum())
      const item = JSON.parse(JSON.stringify(this.item))
      item.GameName = this.gameOptions[item.Gid]
      this.clientDB.TotalData.push()
      this.clientDB = new ClientTableData(this.clientDB.TotalData, this.clientDB.GetPage().GetPageNum(), filterMap, 'Gid', -1)
      this.refreshShow()
      this.showAdd=false
    },
    deleteRow(idx, row) {
      this.showData.splice(idx, 1)
      for (let i = 0; i < this.clientDB.TotalData.length; i++) {
        var o = this.clientDB.TotalData[i]

        if (o.Description == row.Description && o.Type == row.Type && o.Score== row.Score && o.Gid == row.Gid) {
           this.clientDB.TotalData.splice(i, 1)
        }
      }
    },
    queryData() {
      const gid = this.selectGid
      this.clientDB.FilterValueMap['Gid'] = this.selectGid
      console.log(this.clientDB.TotalData)

      if (this.clientDB.FilterValueMap['Gid'] !== 0) {
        this.clientDB.ShowData = this.clientDB.TotalData.filter(
          function(data) {
            if (data.Gid == gid) {
              return true
            } else {
              return false
            }
          }
        )
        this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      } else {
        this.clientDB.FilterData()
      }
      this.refreshShow()
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
          $this.form = response.Data || {}
          $this.postData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)

            for (const i in cfg) {
              if (!cfg[i].hasOwnProperty('GameName')) {
                cfg[i].GameName = this.gameOptions[cfg[i].Gid]
              }
            }

            $this.allCfg = cfg
            $this.clientDB = new ClientTableData(cfg, 10, filterMap, 'Gid', -1)
            this.$refs.compare.SetOldVal(response.Data.Data)
            $this.handleCurrentChange(1)

            this.refreshShow()
          }
        }
      })
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkData(cfg)) {
        return false
      }

      // this.form.Data = JSON.stringify(cfg)
      this.postData.Data = JSON.stringify(cfg)
      const $this = this
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal(this.postData.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const cfg = []
      for (const i in this.clientDB.TotalData) {
        const item = {}
        copyObj(this.clientDB.TotalData[i], item)
        cfg.push(item)
      }
      return cfg
    },
    checkData(cfg) {
      return true
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    }
  }
}
</script>
