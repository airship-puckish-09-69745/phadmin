<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-col :span="16" :offset="2">
          <fieldset style="margin-top:10px">
            <legend>下注配置</legend>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.BetMoneyLevel"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                />
                <el-table-column
                  prop="Low"
                  label="下注列表"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.TableMoney" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Low"
                  label="最小下注限制"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MaxMoneyBet" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="MaxMoneyBet"
                  label="最大下注限制"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MinMoneyBet" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="doAdd"
                    >添加</el-button>
                    <el-button type="danger" size="mini" @click="delRow(scope.$index)">删除</el-button>
                  </template>

                </el-table-column>
              </el-table>
            </el-row>
          </fieldset>

          <fieldset style="margin-top:10px">
            <legend>下注区域配置</legend>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.BetAreaOptions"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                />
                <el-table-column
                  prop="Low"
                  label="下注区域名称"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Name" disabled size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="出现extrapay概率(%)"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Odds" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="extrapay倍数"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Double" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="MaxMoneyBet"
                  label="区域下注上限"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.MaxMoneyBet" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </fieldset>
        </el-col>
        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        BetMoneyLevel: [{ TableMoney: 100, MaxMoneyBet: 2000, MinMoneyBet: 10 }],
        BetAreaOptions: [
          { Name: 'SMALL_小点', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 0 },
          { Name: 'BIG_大点', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 1 },
          { Name: '骰子单点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 2 },
          { Name: '骰子单点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 3 },
          { Name: '骰子单点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 4 },
          { Name: '骰子单点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 5 },
          { Name: '骰子单点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 6 },
          { Name: '骰子单点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 7 },
          { Name: '骰子双点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 8 },
          { Name: '骰子双点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 9 },
          { Name: '骰子双点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 10 },
          { Name: '骰子双点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 11 },
          { Name: '骰子双点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 12 },
          { Name: '骰子双点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 13 },
          { Name: '点数和_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 14 },
          { Name: '点数和_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 15 },
          { Name: '点数和_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 16 },
          { Name: '点数和_7', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 17 },
          { Name: '点数和_8', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 18 },
          { Name: '点数和_9', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 19 },
          { Name: '点数和_10', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 20 },
          { Name: '点数和_11', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 21 },
          { Name: '点数和_12', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 22 },
          { Name: '点数和_13', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 23 },
          { Name: '点数和_14', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 24 },
          { Name: '点数和_15', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 25 },
          { Name: '点数和_16', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 26 },
          { Name: '点数和_17', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 27 },
          { Name: '骰子三点数_1', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 28 },
          { Name: '骰子三点数_2', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 29 },
          { Name: '骰子三点数_3', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 30 },
          { Name: '骰子三点数_4', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 31 },
          { Name: '骰子三点数_5', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 32 },
          { Name: '骰子三点数_6', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 33 },
          { Name: 'Any Triple', Odds: 10, Double: 5, MaxMoneyBet: 2000, Id: 34 }

        ]
      },
      testRand: {
        visible: false,
        times: 0,
        result: []
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },
      robotDialogForm: {
        visible: false,
        data: {}
      },
      incrJackpotForm: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      form: {},
      subKey: 'gameSicbo',
      libShow: $libShow,
      showSetResultPage: false,
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    transMoneyForShow() {
      for (const j in this.item.BetAreaOptions) {
        this.item.BetAreaOptions[j].MaxMoneyBet /= 1000
      }
      for (const j in this.item.BetMoneyLevel) {
        this.item.BetMoneyLevel[j].MaxMoneyBet /= 1000
        this.item.BetMoneyLevel[j].MinMoneyBet /= 1000
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[j].TableMoney.split(',')
        for (const i in items) {
          betMoneyList.push(parseInt(items[i]) / 1000)
        }
        this.item.BetMoneyLevel[j].TableMoney = betMoneyList.join(',')
      }

      console.log('this.item:', this.item)
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      ret.BetMoneyLevel = []
      for (const o in this.item.BetMoneyLevel) {
        const betMoneyList = []
        const items = this.item.BetMoneyLevel[o].TableMoney.split(',')
        for (const i in items) {
          betMoneyList.push(parseInt(items[i]) * 1000)
        }
        const obj = {}
        Object.assign(obj, this.item.BetMoneyLevel[o])
        obj.MaxMoneyBet *= 1000
        obj.MinMoneyBet *= 1000
        obj.TableMoney = betMoneyList.join(',')
        ret.BetMoneyLevel.push(obj)
      }
      console.log(this.item.BetMoneyLevel)
      for (const o in ret.BetMoneyList) {
        ret.BetMoneyList[o] *= 1000
      }
      ret.BetAreaOptions = []
      for (const o in this.item.BetAreaOptions) {
        const obj = {}
        Object.assign(obj, this.item.BetAreaOptions[o])
        obj.MaxMoneyBet *= 1000
        ret.BetAreaOptions.push(obj)
      }
      return ret
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      for (const o in this.item.BetAreaOptions) {
        for (const oi in o.Odds) {
          this.item.BetAreaOptions[o].Odds[oi].Odd = parseFloat(o[oi].Odd)
        }
      }
      this.form.Data = JSON.stringify(this.getPostData())

      console.log(this.form)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    addBetMoneyListRow() {
      this.item.BetMoneyList.push({ TableMoney: 0, MaxMoneyBet: 0, MinMoneyBet: 0 })
    },
    removeBetMoneyListRow(index) {
      this.item.BetMoneyList.splice(index, 1)
    },
    doAdd() {
      this.item.BetMoneyLevel.push({ TableMoney: 100, MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
    delRow(index) {
      console.log(index)
      this.item.BetMoneyLevel.splice(index, 1)
    }
  }
}
</script>
