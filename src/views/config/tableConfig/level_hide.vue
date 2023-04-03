<template>
  <el-col class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="16" :offset="2">
        <el-form ref="item" label-width="150px">

          <template>
            <el-alert
              title="应用列表第一个应用填0，所有的应用使用新逻辑"
              type="success"
              description="eg：0,1,100001,100013 或者 0">
            </el-alert>
          </template>
          <br/>
          <br/>

          <el-form-item label="TP、AK、Rummy场次隐藏逻辑应用列表" label-width="300px">
            <el-input v-model="item.AppsStr" type="textarea" :rows="5" placeholder="多个应用英文逗号(,)分开,开放所有应用填0"/>
          </el-form-item>

          <el-form-item label="小游戏根据金额匹配下注金额的应用列表" label-width="300px">
            <el-input v-model="item.SmallGameAppsStr" type="textarea" :rows="5" placeholder="多个应用英文逗号(,)分开,开放所有应用填0"/>
          </el-form-item>


          <el-col :span="24">
            <el-button type="primary" size="mini" @click="addBet">添加配置项</el-button>
          </el-col>
          <el-table
            :data="item.SmallGameBetMoneyList"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="SinglePay"
              label="单次充值金额大于等于"
              width="180"
            >
              <template slot-scope="scope">
                <money-input v-model="scope.row.SinglePay" label="" label-width="0"></money-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="TotalPay"
              label="总充值金额大于等于"
              width="180"
            >
              <template slot-scope="scope">
                <money-input v-model="scope.row.TotalPay" label="" label-width="0"></money-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="BetMoney"
              label="下注金额列表"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model="scope.row.MoneyStr" placeholder="英文逗号隔开"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="BetMoney"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delBet(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
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

    <!--对比组件-->
    <compare ref="compare" />

  </el-col></template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule, ValidateVueItem } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'
import GameLevel from '@/components/GameLevel'

function newItem() {
  return {
    "Apps": [
      1,
      2,
      3,
      4,
      5
    ],
    "AppsStr": "1,2,3,4,5",
    "SmallGameApps": [
      1,
      2,
      3,
      4,
      5
    ],
    "SmallGameAppsStr": "1,2,3,4,5",
    "SmallGameBetMoneyList": [
      {
        "SinglePay": 100000,
        "TotalPay": 200000,
        "BetMoney": [
          100000,
          200000,
          300000
        ],
        "MoneyStr": "100000,200000,300000"
      }
    ]
  }
}

function newBet() {
  return {
    "SinglePay": 0,
    "TotalPay": 0,
    "BetMoney": [],
    "MoneyStr": ""
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput, GameLevel },
  data() {
    return {
      item: newItem(),
      form: {
      },
      txt: '',
      subKey: 'level_hide_cfg'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addBet() {
      this.item.SmallGameBetMoneyList.push(newBet())
    },
    delBet(index) {
      const $this = this
      this.$confirm('确定要删除吗？', '提醒')
        .then(function() {
          $this.item.SmallGameBetMoneyList.splice(index, 1)
        })
    },
    encodeData() {
      this.item.Apps = this.transArr(this.item.AppsStr, 1)
      this.item.SmallGameApps = this.transArr(this.item.SmallGameAppsStr, 1)

      for (const i in this.item.SmallGameBetMoneyList) {
        this.item.SmallGameBetMoneyList[i].BetMoney = this.transArr(this.item.SmallGameBetMoneyList[i].MoneyStr, 1000)
      }

      return JSON.stringify(this.item)
    },
    transArr(str, mul) {
      if (str) {
        const arr = str.split(',')
        const num = []
        for (const i in arr) {
          num.push(parseInt(arr[i]) * mul)
        }
        return num
      }

      return []
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            this.item = this.DeepCopy(data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
