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
      <el-col :span="15" />
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
              prop="AvgReward"
              label="平均奖励"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.AvgReward" type="number" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
              </template>
            </el-table-column>
            <el-table-column
              prop="BoxLevel"
              label="宝箱等级"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.BoxLevel" type="number" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
              </template>
            </el-table-column>
            <el-table-column
              prop="MinReword"
              label="最小奖励"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.MinReword" readonly oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
              </template>
            </el-table-column>
            <el-table-column
              prop="MaxReword"
              label="最大奖励"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.MaxReword" readonly oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
              </template>
            </el-table-column>
            <el-table-column
              prop="ScoreRequired"
              label="需求积分"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.ScoreRequired" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editRow(scope.$index, scope.row)">编辑</el-button>
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
    <!--对比组件-->
    <compare ref="compare" />

    <el-dialog
      title="编辑"
      :modal="false"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button type="primary" @click="addRow()">新增</el-button>
      <el-button type="success" @click="saveRow()">保存</el-button>
      <el-table
        :data="pairs"
        style="width: 95%"
        border
        :header-cell-style="{textAlign: 'center'}"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
      >
        <el-table-column
          prop="Reward"
          label="奖励"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Reward" type="number" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
          </template>
        </el-table-column>
        <el-table-column
          prop="Weight"
          label="权重"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Weight" oninput=" if(value < 0 || value === '' || value == null){value = 0;}else {value=parseInt(value)}" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deletePairsRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
      clientDB: new ClientTableData([], 1, filterMap),
      form: {},
      postData: {},
      subKey: 'poker_topic_score_rewards',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      visible: false,
      allCfg: [],
      appInfo: [],
      pairs: [],
      libShow: $libShow,
      channelOptions: [
        // {key: "0", label: '请选择'},
        { key: 'Dev', label: 'Dev' },
        { key: 'BP', label: 'BP' },
        { key: 'AP', label: 'AP' },
        { key: 'GP', label: 'GP' },
        { key: 'PG', label: 'PG' }
      ],
      isReturnOptions: [
        { key: 0, label: '否' },
        { key: 1, label: '是' }
      ],

      editRowIndex: 0,
      showData: [],
      item: {
        MinReword: 0,
        MaxReword: 0,
        BoxLevel: 0,
        ScoreRequired: 0,
        AvgReward: 0,
        Pairs: []
      },
      selectGid: 0,
      taskOptions: {
        1: '参与游戏 Tongits',
        2: '获胜',
        3: '发起「Fight」并获胜',
        4: '获胜时持有「A」或「K」',
        5: '结算时手牌持有「Special Meld」（同花顺、四条）',
        6: '通过「Tongits」获胜',
        11: '参与游戏 Pusoy',
        12: '获胜',
        13: 'PUSOY其他玩家并获胜',
        14: '获胜时持有「Straight Flush」或「Four of a Kind」',
        15: '透过「NATURALS」获胜（Three Straight、Three Flush、6 Pairs、Dragon）',
        16: '以「全垒打」获胜',
        21: '参与游戏 Lucky9',
        22: '获胜',
        23: '获胜时以3张手牌9点获胜',
        24: '以「Lucky9 」获胜',
        31: '参与游戏 Texas',
        32: '获胜',
        33: '透过「High Card」获胜',
        34: '开出「Flush」或「Straight」',
        35: '开出「Four of a Kind」或「Full House」',
        36: '开出「Straight Flush」'
      },
      gameOptions: {}
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {
    editRow(idx, row) {
      this.pairs = row.Pairs
      this.visible = true
      this.editRowIndex = idx
    },
    saveRow() {
      if (this.pairs.length === 0) {
        Message.error('请至少添加一个奖励-权重配置')
        return
      }

      let totalWeight = 0
      let totalReward = 0
      for (const i in this.pairs) {
        if (this.pairs[i].Reward <= 0) {
          Message.error('奖励金额必须大于0')
          return
        }
        totalWeight += this.pairs[i].Weight
        totalReward += this.pairs[i].Reward
      }

      if (totalWeight === 0) {
        Message.error('权重之和必须大于0')
        return
      }

      this.visible = false
      if (this.pairs) {
        this.pairs.sort((a, b) => { return a.Reward - b.Reward })
        this.showData[this.editRowIndex].MinReword = this.pairs[0].Reward
        this.showData[this.editRowIndex].MaxReword = this.pairs[this.pairs.length - 1].Reward
        this.showData[this.editRowIndex].AvgReward = (totalReward / this.pairs.length).toFixed(2)
      }
    },
    addRow() {
      this.pairs.push({ 'Reward': 0, 'Weight': 0 })
    },

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
      this.showData.push(this.newItem())
    },
    deletePairsRow(idx, row) {
      this.pairs.splice(idx, 1)
    },
    deleteRow(idx, row) {
      console.log(idx, row)
      this.showData.splice(idx, 1)
    },
    transMoneyForShow(obj) {
      for (const i in obj) {
        for (const o of obj[i].Pairs) {
          o.Reward = (o.Reward / 1000)
        }
        obj[i].AvgReward = (obj[i].AvgReward / 1000)
        obj[i].MinReword = (obj[i].MinReword / 1000)
        obj[i].MaxReword = (obj[i].MaxReword / 1000)
        // obj[i].ScoreRequired = (obj[i].ScoreRequired / 1000)
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
            $this.allCfg = cfg
            $this.transMoneyForShow(cfg)
            console.log('=====', cfg)
            $this.clientDB = new ClientTableData(cfg, 10, filterMap, 'Gid', -1)
            this.$refs.compare.SetOldVal(response.Data.Data)
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
        const item = JSON.parse(JSON.stringify(this.clientDB.TotalData[i]))
        cfg.push(item)
      }
      for (const i in cfg) {
        cfg[i].AvgReward = parseInt((cfg[i].AvgReward * 1000).toFixed(0))
        cfg[i].MinReword = parseInt((cfg[i].MinReword * 1000).toFixed(0))
        cfg[i].MaxReword = parseInt((cfg[i].MaxReword * 1000).toFixed(0))
        // cfg[i].ScoreRequired = parseInt((cfg[i].ScoreRequired * 1000).toFixed(0))
        for (const o of cfg[i].Pairs) {
          o.Reward = parseInt((o.Reward * 1000).toFixed(0))
        }
      }
      return JSON.parse(JSON.stringify(cfg))
    },
    checkData(cfg) {
      for (const i in cfg) {
        if (cfg[i].ScoreRequired <= 0) {
          Message.error('需求积分必须大于0')
          return false
        }
        if (cfg[i].Pairs.length === 0) {
          Message.error('请至少添加一个奖励配置项')
          return false
        }
      }
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
