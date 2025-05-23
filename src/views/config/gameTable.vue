<template>
  <div class="app-container">
    <el-row>
      <el-form label-width="90px" :inline="true" size="small">
        <el-form-item label="GameId：" :required="true" label-width="80px">
          <!--          <el-select></el-select>-->
        </el-form-item>
        <el-form-item>
          <el-select v-model.number="gameId" placeholder="请选择">
            <el-option
              v-for="item in gameIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="MaxPlayerNum"
        label="场次"
      >
        <template slot-scope="scope">
          {{ scope.row.MaxPlayerNum }}人桌 -  {{ scope.row.TableMoney /1000 }}场次
        </template>
      </el-table-column>

      <el-table-column
        prop="Free"
        label="可用桌子"
      />

      <el-table-column
        prop="Total"
        label="桌子总数"
      />

    </el-table>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block" />
      </el-col>
    </el-row>
  </div>

</template>

<script>

import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  components: { Message, request },
  data() {
    return {
      gameIds: [{
        value: 22,
        label: 'Tongits-pot'
      },
      //   {
      //   value: 29,
      //   label: 'Tongits-Quick'
      // },
      //   {
      //   value: 28,
      //   label: 'Tongits-赖子'
      // },
      {
        value: 31,
        label: 'Tongits 经典'
      }, {
        value: 23,
        label: 'Lucky9'
      }, {
        value: 15,
        label: ' 德州扑克'
      }, {
        value: 21,
        label: 'Pusoy'
      }, {
        value: 34,
        label: 'PusoyDos'
      }, {
        value: 126,
        label: 'PusoyWild'
      }
      ],
      tableData: [],
      gameId: 22
    }
  },
  created() {
    this.gameId = this.gameIds[0].value
    this.getInfo()
  },
  mounted() {
  },
  methods: {
    getInfo() {
      const $this = this
      request({
        url: '/gametable/all',
        method: 'get',
        data: {
          gameId: this.gameId

        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          $this.tableData = objs
          console.log(objs)
          if (response.Data.length === 0) {
            Message.success('查询结果为空')
            return
          }
          this.totalCount = response.Data.total
          $this.tableData = objs
        }
      })
    },
    format(data) {
      return data / 1000
    }
  }
}

</script>
