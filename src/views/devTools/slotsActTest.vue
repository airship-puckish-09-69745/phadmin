<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column prop="ID" label="ID" sortable="custom" width="70" />
        <el-table-column prop="BPool" label="底池(前）" width="100" >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.BPool/1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="Pool" label="底池(后）" width="100" >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Pool/1000) }}
          </template>
        </el-table-column>
        <el-table-column label="用户数" width="100">
          <template slot-scope="scope">
            {{ scope.row.Users.length }}
          </template>
        </el-table-column>
        <el-table-column prop="LastModify" label="最近修改" width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="showLog(scope.row)">查看</el-button>
            <el-button size="mini" type="success" @click="handleCopy(scope.row)">拷贝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog title="添加" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="150px" :inline="true" size="small">
        <el-form-item label="底池(前)：" :required="true">
          <el-input v-model.number="edit.item.BPool" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="Gid：" :required="true">
          <el-input v-model.number="edit.item.Gid" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="线数：" :required="true">
          <el-input v-model.number="edit.item.LineCount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单线下注：" :required="true">
          <el-input v-model.number="edit.item.BaseValue" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="干预值：" :required="true">
          <el-input v-model.number="edit.item.AdjustValue" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="edit.item.Note" placeholder="请输入" />
        </el-form-item>
        <el-row>
          <el-button size="mini" @click="addRow()">添加</el-button>
          <el-table
            ref="filterTable"
            :data="edit.item.Users"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column prop="Uid" label="Uid" width="100">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Uid" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="Winning" width="150">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Winning" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="Deposit" width="150">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Deposit" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="历史输赢" width="150">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.TotalWin" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="局数" width="100">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Count" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="delRow(scope.row.Uid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="12" :offset="10">
          <el-button type="primary" size="medium" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="查看" width="80%" :visible.sync="log.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs type="border-card">
        <el-tab-pane label="摘要数据">
          <el-form ref="edit" :model="log.cfg" label-width="150px" :inline="true" size="small">
            <el-form-item label="底池(前)：" :required="true">
              {{ formatNumber(log.cfg.BPool/1000) }}
            </el-form-item>
            <el-form-item label="底池(后)：" :required="true">
              {{ formatNumber(log.cfg.Pool/1000) }}
            </el-form-item>
            <el-form-item label="Gid：" :required="true">
              {{ log.cfg.Gid }}
            </el-form-item>
            <el-form-item label="线数：" :required="true">
              {{ log.cfg.LineCount }}
            </el-form-item>
            <el-form-item label="单线下注：" :required="true">
              {{ formatNumber(log.cfg.BaseValue/1000) }}
            </el-form-item>
            <el-form-item label="干预值：" :required="true">
              {{ formatNumber(log.cfg.AdjustValue/1000) }}
            </el-form-item>
            <el-form-item label="备注：">
              {{ log.cfg.Note }}
            </el-form-item>
            <el-table
              ref="filterTable"
              :data="log.cfg.Users"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column prop="Uid" label="Uid" width="100" />
              <el-table-column label="Winning" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Winning/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Deposit" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Deposit/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="局数" width="100" prop="Count" />
              <el-table-column label="输赢" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber((log.users[scope.row.Uid].Winning + log.users[scope.row.Uid].Deposit - scope.row.Winning - scope.row.Deposit)/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="抽水" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber(log.users[scope.row.Uid].Fee/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="终Winning" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber(log.users[scope.row.Uid].Winning/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="终Deposit" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber(log.users[scope.row.Uid].Deposit/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="最高" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber(log.users[scope.row.Uid].MoneyMax/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="最低" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?formatNumber(log.users[scope.row.Uid].MoneyMin/1000):0 }}
                </template>
              </el-table-column>
              <el-table-column label="剧本切换" width="100" >
                <template slot-scope="scope">
                  {{ log.users[scope.row.Uid]?log.users[scope.row.Uid].ActCount - 1:0 }}
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="表格数据">
          <el-table
            ref="filterTable"
            :data="log.tableData"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column prop="ID" label="ID" width="70" />
            <el-table-column prop="Uid" label="Uid" width="100">
              <template v-slot:header>
                <el-select v-model="log.clientDB_logs.FilterValueMap['Uid']" size="mini" @change="handleFilter2">
                  <el-option label="Uid" :value="0" />
                  <el-option v-for="(o,key) in log.clientDB_logs.FilterMap['Uid']" :key="key" :label="o" :value="key" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作前">
              <el-table-column label="资产" width="100">
                <template slot-scope="scope">
                  {{ formatNumber((scope.row.BDeposit + scope.row.BWinning)/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Winning" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.BWinning/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Deposit" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.BDeposit/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Pool" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.BPool/1000) }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="Target" prop="BTarget" width="100" />
            <el-table-column label="输or赢" prop="RandResult" width="70" />
            <el-table-column label="输赢" prop="Win" width="70">
              <template slot-scope="scope">
                {{ formatNumber(scope.row.Win/1000) }}
              </template>
            </el-table-column>
            <el-table-column label="抽水" prop="Win" width="70">
              <template slot-scope="scope">
                {{ formatNumber(scope.row.Ext2/1000) }}
              </template>
            </el-table-column>
            <el-table-column label="胜率" prop="WinRate" width="70" />
            <el-table-column label="剧本" prop="RowIndex" width="70" />
            <el-table-column label="步数" prop="ColIndex" width="70" />
            <el-table-column label="操作后">
              <el-table-column label="资产" width="100">
                <template slot-scope="scope">
                  {{ formatNumber((scope.row.Deposit + scope.row.Winning)/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Winning" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Winning/1000) }}
                </template>
              </el-table-column>
              <el-table-column label="Deposit" width="100">
                <template slot-scope="scope">
                  {{ formatNumber(scope.row.Deposit/1000) }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="备注" prop="Str1" width="150" />
          </el-table>
          <el-col :offset="16" :span="8">
            <div class="block">
              <el-pagination
                :current-page="log.clientDB_logs.GetPage().GetCurrentPage()"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="log.clientDB_logs.GetPage().GetPageNum()"
                layout="total, sizes, prev, pager, next, jumper"
                :total="log.clientDB_logs.GetPage().GetTotalCount()"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
              />
            </div>
          </el-col>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, $libType } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import SelectGoods from '@/components/SelectGoods'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function newUser() {
  return {
    Uid: 0,
    Winning: 0,
    Deposit: 0,
    TotalWin: 0,
    Count: 0
  }
}

function newItem() {
  return {
    BPool: 0,
    Pool: 0,
    Note: '',
    Gid: 0,
    LineCount: 0,
    BaseValue: 0,
    AdjustValue: 0,
    Users: [
      newUser()
    ]
  }
}

export default {
  components: { Compare, Publish, SelectGoods, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libShow: $libShow,
      env: 'test',

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      log: {
        visible: false,
        cfg: {},
        users: {},
        clientDB_logs: new ClientTableData([], 1, filterMap),
        tableData: []
      }

    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
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

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.edit.item = ob
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/slotsActTest/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            objs[i].Users = JSON.parse(objs[i].Data)
          }
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },

    //* * ********************** 修改/添加弹框相关 *****************
    dataRule(required, config) {
      return DataRule(required, config)
    },
    addRow() {
      this.edit.item.Users.push(newUser())
    },
    delRow(Uid) {
      var idx = 0
      for (let i = 0; i < this.edit.item.Users.length; i++) {
        if (this.edit.item.Users[i].Uid == Uid) {
          idx = i
          break
        }
      }
      this.$delete(this.edit.item.Users, idx)
    },

    createSave(postData) {
      request({
        url: '/slotsActTest/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      return {
        Pool: this.edit.item.Pool,
        BPool: this.edit.item.BPool,
        Note: this.edit.item.Note,
        Gid: this.edit.item.Gid,
        LineCount: this.edit.item.LineCount,
        BaseValue: this.edit.item.BaseValue,
        AdjustValue: this.edit.item.AdjustValue,
        Data: JSON.stringify(this.edit.item.Users)
      }
    },
    save() {
      this.createSave(this.getPostData())
      this.edit.visible = false
    },

    /** ********************查看日志情况********************/
    showLog(ob) {
      this.log.visible = true
      this.log.cfg = ob
      this.getLogs(ob.ID)
    },
    analysis(objs) {
      const users = {}
      let pool = 0
      for (let i = 0; i < objs.length; i++) {
        const item = objs[i]
        if ($libType.IsUndefined(users[item.Uid])) {
          users[item.Uid] = { Uid: item.Uid, Winning: item.Winning, Deposit: item.Deposit, MoneyMin: item.Winning + item.Deposit,
            MoneyMax: item.Winning + item.Deposit,
            Fee: item.Fee,
            ActCount:0
          }
        } else {
          const user = users[item.Uid]
          user.Winning = item.Winning
          user.Deposit = item.Deposit
          if (item.Winning + item.Deposit < user.MoneyMin) {
            user.MoneyMin = item.Winning + item.Deposit
          }
          if (item.Winning + item.Deposit > user.MoneyMax) {
            user.MoneyMax = item.Winning + item.Deposit
          }
          user.Fee = item.Ext2
          if(item.Str1.indexOf("剧本切换") != -1){
            user.ActCount ++
          }
        }
        pool = item.Ext1
      }
      this.log.users = users
      this.log.cfg.Pool = pool
    },
    getLogs(runID) {
      request({
        url: '/slotsActTest/logs',
        method: 'get',
        data: {
          RunID: runID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.analysis(objs)
          this.log.clientDB_logs = new ClientTableData(objs, 10, { Uid: 'all' }, 'ID', 1)
          this.handleCurrentChange2(1)
        }
      })
    },

    clearFilter2() {
      this.log.clientDB_logs.ClearFilterMap()
      this.refreshShow2()
    },
    handleFilter2() {
      this.log.clientDB_logs.FilterData()
      this.refreshShow2()
    },
    // 分页处理
    refreshShow2() {
      this.log.tableData = this.log.clientDB_logs.GetCurrentPageData()
    },
    handleSizeChange2(val) {
      this.log.clientDB_logs.GetPage().SetPageNum(val)
      this.refreshShow2()
    },
    handleCurrentChange2(val) {
      this.log.clientDB_logs.GetPage().SetPageNo(val)
      this.refreshShow2()
    }
  }
}
</script>
