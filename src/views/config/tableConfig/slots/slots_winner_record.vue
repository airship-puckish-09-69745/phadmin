<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="奖励最低值">
            <el-input v-model="item.minAward" />
          </el-form-item>
          <el-form-item label="奖励最高值">
            <el-input v-model="item.maxAward" placeholder="(-1无上限)"/>
          </el-form-item>
        <el-form-item label="游戏">
          <el-select v-model="item.slots">
            <el-option
              v-for="row in slots"
              :key="row.value"
              :label="row.label"
              :value="row.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row :gutter="6">
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="Id"
            label="ID">
          </el-table-column>
          <el-table-column
            label="是否机器人">
            <template slot-scope="scope">
                {{ scope.row.IsRobot==1?"是":"否" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Uid"
            label="Uid">
          </el-table-column>
          <el-table-column
            prop="Nick"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="Bet"
            label="下注级别">
          </el-table-column>
          <el-table-column
            prop="Award"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="Uptime"
            label="时间">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="item.currPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="item.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="item.totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MoneyInput from '@/components/MoneyInput'
import request from '@/utils/request'
import { $libDate } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { MoneyInput },
  data() {
    return {
      tableData:[],
      item:{
        slots:0,
        minAward:'',
        maxAward:'',
        totalCount:0,
        currPage:1,
        limit:20,
      },
      slots: [
        {
          value: 51,
          label: '凤凰'
        },
        {
          value: 52,
          label: '睡美人'
        },
        {
          value: 53,
          label: '小丑'
        },
        {
          value: 54,
          label: '黄金列车'
        }
      ],
    }
  },
  methods: {
    handleSizeChange(val) {
      this.item.limit = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.item.currPage = val
      this.getInfo()
    },
    transDate(u){
        return $libDate.FormateSecondStr(u,2)
    },
    transMoneyForShow(){
      for (const o in this.tableData) {
        this.tableData[o].Bet /= 1000
        this.tableData[o].Award /= 1000
        this.tableData[o].Uptime = this.transDate(this.tableData[o].Uptime);
      }
    },
    getInfo() {
      const $this = this
      if (this.isReset) {
        this.item.maxid = 0
        this.isReset = false
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/slotsStat/winner/record',
          slots: this.item.slots,
          min: this.item.minAward*1000,
          max: this.item.maxAward==-1?-1:this.item.maxAward*1000,
          page: this.item.currPage,
          limit: this.item.limit
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.Lists.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.tableData = objs.Lists
          $this.item.totalCount = objs.TotalCount
          $this.transMoneyForShow()
          console.log("tableData:",$this.tableData);
        }
      })
    }
  }
}
</script>
