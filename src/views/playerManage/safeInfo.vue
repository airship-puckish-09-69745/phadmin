<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="3" :offset="4">
          <el-select v-model.number="item.iType" size="mini" placeholder="请选择" @change="item.Value=''">
            <el-option label="按设备" :value="1" />
            <el-option label="按Uid" :value="2" />
            <el-option label="按IP" :value="3" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-form-item label="UID：" :required="true" v-if="item.iType==2">
            <UidInput @setUid="function(iUid){item.Uid=iUid}" />
          </el-form-item>
          <el-form-item label="" :required="true" v-else>
            <el-input size="mini" v-model="item.Value"/>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="2">
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        type="index"
        width="70"
      />
      <el-table-column
        prop="deviceCode"
        label="设备码"
        sortable="custom"
        width="300"
      />
      <el-table-column
        prop="ip"
        label="IP"
        sortable="custom"
        width="150"
      />
      <el-table-column
        prop="uid"
        label="Uid"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="inviteCode"
        label="InviteCode"
        width="150"
      />

      <el-table-column
        prop="updateTime"
        label="更新时间"
        sortable
        width="150"
      >
        <template slot-scope="scope" v-if="scope.row.updateTime!==0">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
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
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

const filterMap = {
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,

      item: {
        iType:2,
        Uid: 0,
        Value:''
      },


    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    // 筛选相关逻辑
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
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/safe/info',
          Type: this.item.iType,
          Uid: this.item.Uid,
          Device: this.item.Value,
          IP: this.item.Value,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if(objs.length === 0){
            Message.success("查询结果为空")
            return
          }
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    }
  }
}
</script>

