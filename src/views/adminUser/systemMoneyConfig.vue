<template>
  <div class="app-container">

    <el-row>
<!--      <el-col :span="24">-->
<!--        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />-->
<!--      </el-col>-->
      <el-col :span="24">
        <el-button type="primary" @click="add" size="mini">添加</el-button>
      </el-col>
      <el-table
        ref="filterTable"
        :data="tableData"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        size="mini"
      >
        <el-table-column label="账号" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key"  size="mini"/>
          </template>
        </el-table-column>
        <el-table-column label="游戏gid">
          <template slot-scope="scope">
             <el-input v-model="scope.row.value"  size="mini"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="del(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-button type="primary" @click="setData">保存</el-button>
      </el-col>
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
import { $libShow, DataRule } from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import RobotOnlineItems from '@/views/config/components/robotOnlineItems.vue'
import JackpotDayLimit from '@/views/config/components/jackpotDayLimit.vue'
import JackpotIncrease from '@/views/config/components/jackpotIncrease.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { JackpotIncrease, JackpotDayLimit, RobotOnlineItems, Compare, Publish, BetAmount },
  data() {
    return {
      form:{},
      subKey: 'systemMoneyConfig',
      libShow: $libShow,
      showSetResultPage: false,
      tableData :[],
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_NAME)
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == '菲1-线上环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
      this.isHidden = false
    }
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: "systemMoneyConfig"
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          const item = JSON.parse(response.Data.Data)
          this.tableData =[]
          for (const key in item) {
            let obj = {
              key: key,
              value: item[key].toString()
            }
            this.tableData.push(obj)
          }
          this.$refs.compare.SetOldVal(response.Data)

        }
      })
    },
    add(){
      this.tableData.push({
        key: '',
        value: ''
      })
    },
    del(idx){
      this.tableData.splice(idx, 1)
    },
    getPostData() {
      let obj ={}
      for (const i in this.tableData) {

          if (this.tableData[i].value instanceof Array){
            obj[this.tableData[i].key] = this.tableData[i].value
        }else {
            console.log("==1=",this.tableData[i].key,this.tableData[i].value instanceof String)
            obj[this.tableData[i].key] = this.tableData[i].value.split(",").map(Number)
          }
      }
      return obj
    },

    wallpaperInput(val, index) {
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    addOddsList(idx) {
      this.BetOddsList[idx].OddsList.push({})
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    delOddsList(idx, index) {
      if (this.BetOddsList[idx].OddsList.length == 1) {
        this.BetOddsList[idx].OddsList.push({})
      }
      this.BetOddsList[idx].OddsList.splice(index, 1)
      // 刷新页面
      this.BetOddsList = this.BetOddsList.slice(0, this.BetOddsList.length)
    },
    doAddBetAreaOptions() {
      if (!this.item.BetAreaOptions) {
        this.item['BetAreaOptions'] = []
      }
      let maxId = 0
      for (const o of this.item.BetAreaOptions) {
        if (o.Id > maxId) {
          maxId = o.Id
        }
      }
      this.item.BetAreaOptions.push({ Id: maxId + 1, MaxMoneyBet: 0, RobotBetOdds: 0 })
    },
    delBetAreaOptions(index) {
      this.item.BetAreaOptions.splice(index, 1)
    },
    getCardUrl(card) {
      try {
        return require('@/assets/poker/' + card + '.png')
      } catch (e) {
        console.log(e)
      }
    },
    setData() {
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



  }
}
</script>
