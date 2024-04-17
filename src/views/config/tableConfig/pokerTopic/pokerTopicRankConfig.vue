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



      <el-col :span="24">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="addOverallRankRewardsCfg">添加总排名奖励</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="mini" @click="addSubRankRewardsCfg">添加次级奖励</el-button>
      </el-col>
      <el-col :span="12">
        <el-form ref="OverallRankRewardsCfg" v-model="showData" label-width="150px">
          <el-table
              :data="OverallRankRewardsCfg"
              style="width: 95%"
              border
              :header-cell-style="{textAlign: 'center'}"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
          >
            <el-table-column
            label="总排名奖励"
            border
            :cell-style="{ textAlign: 'center' }"
            >

              <el-table-column
                  prop="RankBegin"
                  label="开始位置"
              >
                <template slot-scope="scope">
                  <div>
                    <el-input type="number" :step="0.01" v-model.number="scope.row.RankBegin" size="mini"
                              oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                  prop="RankEnd"
                  label="结束位置"
              >
                <template slot-scope="scope">
                  <div>
                    <el-input type="number" v-model.number="scope.row.RankEnd" size="mini"
                              oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                  prop="Reward"
                  label="奖励"
              >
                <template slot-scope="scope">
                  <el-input type="number" v-model.number="scope.row.Reward" size="mini"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteOverallRow(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>

          </el-table>
        </el-form>
        <!--        <el-col :offset="5" :span="8">-->
        <!--          <div class="block">-->
        <!--            <el-pagination-->
        <!--                :current-page="clientDB.GetPage().GetCurrentPage()"-->
        <!--                :page-sizes="[10, 20, 30, 40]"-->
        <!--                :page-size="clientDB.GetPage().GetPageNum()"-->
        <!--                layout="total, sizes, prev, pager, next, jumper"-->
        <!--                :total="clientDB.GetPage().GetTotalCount()"-->
        <!--                @size-change="handleSizeChange"-->
        <!--                @current-change="handleCurrentChange"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </el-col>-->
      </el-col>

      <el-col :span="12">

        <el-form ref="SubRankRewardsCfg" v-model="showData" label-width="150px">
          <el-table
              :data="SubRankRewardsCfg"
              style="width: 95%"
              border
              :header-cell-style="{textAlign: 'center'}"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
          >
            <el-table-column
                label="次级奖励"
                style="text-align: center;margin-left: 500px"
            >
            <el-table-column
                prop="RankBegin"
                label="开始位置"
            >
              <template slot-scope="scope">
                <div>
                  <el-input type="number"   v-model.number="scope.row.RankBegin" size="mini"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="RankEnd"
                label="结束位置"
            >
              <template slot-scope="scope">
                <div>
                  <el-input type="number" v-model.number="scope.row.RankEnd" size="mini"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                </div>
              </template>
            </el-table-column>

            <el-table-column
                prop="Reward"
                label="奖励"
            >
              <template slot-scope="scope">
                <el-input type="number" v-model.number="scope.row.Reward" size="mini"
                          oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteSubRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
            </el-table-column>
          </el-table>
        </el-form>
        <!--        <el-col :offset="5" :span="8">-->
        <!--          <div class="block">-->
        <!--            <el-pagination-->
        <!--                :current-page="clientDB.GetPage().GetCurrentPage()"-->
        <!--                :page-sizes="[10, 20, 30, 40]"-->
        <!--                :page-size="clientDB.GetPage().GetPageNum()"-->
        <!--                layout="total, sizes, prev, pager, next, jumper"-->
        <!--                :total="clientDB.GetPage().GetTotalCount()"-->
        <!--                @size-change="handleSizeChange"-->
        <!--                @current-change="handleCurrentChange"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </el-col>-->
      </el-col>
    </el-row>


    <el-button type="primary" @click="setData">保存</el-button>
    <!--对比组件-->
    <compare ref="compare"/>

  </div>
</template>

<script>
const filterMap = {}

import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {$libShow, ClientTableData} from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      clientDB: new ClientTableData([], 1, filterMap),
      form: {},
      postData: {},
      subKey: 'poker_topic_rank_rewards',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      OverallRankRewardsCfg: [],
      SubRankRewardsCfg: [],
      appInfo: [],
      libShow: $libShow,
      channelOptions: [
        // {key: "0", label: '请选择'},
        {key: 'Dev', label: 'Dev'},
        {key: 'BP', label: 'BP'},
        {key: 'AP', label: 'AP'},
        {key: 'GP', label: 'GP'},
        {key: 'PG', label: 'PG'}
      ],
      isReturnOptions: [
        {key: 0, label: '否'},
        {key: 1, label: '是'}
      ],

      showData: [],
      item: {
        RankBegin: 0,
        RankEnd: 0,
        Reward: 0,

      },
      selectGid: 0,
      taskOptions: {
        1: "参与游戏 Tongits",
        2: "获胜",
        3: "发起「Fight」并获胜",
        4: "获胜时持有「A」或「K」",
        5: "结算时手牌持有「Special Meld」（同花顺、四条）",
        6: "通过「Tongits」获胜",
        11: "参与游戏 Pusoy",
        12: "获胜",
        13: "PUSOY其他玩家并获胜",
        14: "获胜时持有「Straight Flush」或「Four of a Kind」",
        15: "透过「NATURALS」获胜（Three Straight、Three Flush、6 Pairs、Dragon）",
        16: "以「全垒打」获胜",
        21: "参与游戏 Lucky9",
        22: "获胜",
        23: "获胜时以3张手牌9点获胜",
        24: "以「Lucky9 」获胜",
        31: "参与游戏 Texas",
        32: "获胜",
        33: "透过「High Card」获胜",
        34: "开出「Flush」或「Straight」",
        35: "开出「Four of a Kind」或「Full House」",
        36: "开出「Straight Flush」"
      },
      gameOptions: {},
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {

    refresh() {

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
    deleteOverallRow(idx, row) {
      this.OverallRankRewardsCfg.splice(idx, 1)
    },
    deleteSubRow(idx, row) {
      this.SubRankRewardsCfg.splice(idx, 1)
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
    addOverallRankRewardsCfg() {
      this.OverallRankRewardsCfg.push(this.newItem())
    },
    addSubRankRewardsCfg() {
      this.SubRankRewardsCfg.push(this.newItem())
    },
    queryData() {
      const gid = this.selectGid
      this.clientDB.FilterValueMap['Gid'] = this.selectGid
      console.log(this.clientDB.TotalData)

      if (this.clientDB.FilterValueMap['Gid'] !== 0) {
        this.clientDB.ShowData = this.clientDB.TotalData.filter(
            function (data) {
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
            console.log("====", cfg)
            this.OverallRankRewardsCfg = cfg.OverallRankRewards
            this.SubRankRewardsCfg = cfg.SubRankRewards
            // $this.clientDB = new ClientTableData(cfg, 10, filterMap, "", -1)
            // $this.clientDBOver = new ClientTableData(OverallRankRewardsCfg, 10, filterMap, "", -1)
            // $this.clientDBSub = new ClientTableData(SubRankRewardsCfg, 10, filterMap, "", -1)
            this.$refs.compare.SetOldVal(response.Data.Data)
            console.log("====", response.Data.Data)
            $this.handleCurrentChange(1)
            this.refresh()
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

      const $this = this
      $this.postData.Data = JSON.stringify(cfg)
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal($this.postData.Data)
      this.$refs.compare.Compare(function (isEdit) {
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
      let obj = {
        OverallRankRewards: this.OverallRankRewardsCfg,
        SubRankRewards: this.SubRankRewardsCfg
      }
      return obj
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
