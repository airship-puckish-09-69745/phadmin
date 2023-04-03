<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="mini">
        <el-form-item label="分类：">
          <el-select v-model.number="item.iType" size="mini" placeholder="请选择" @change="tableVisible=false">
            <el-option label="按设备" :value="1" />
            <el-option label="按Uid" :value="2" />
            <el-option label="按IP" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.iType===3" label="原因：">
          <el-select v-model.number="item.Reason" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option label="管理加入" :value="1" />
            <el-option label="审核期间" :value="2" />
            <el-option label="非印度SIM" :value="3" />
            <el-option label="中国IP" :value="4" />
            <el-option label="美国IP" :value="5" />
            <el-option label="非印度IP" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.iType===3" label-width="100px" label="审核阶段：">
          <el-select v-model.number="item.Step" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option label="Google审核" :value="1" />
            <el-option label="FB开户" :value="2" />
            <el-option label="FB广告审核" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.iType===3" label="黑级别：">
          <el-select v-model.number="item.Level" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option label="Google审核" :value="10" />
            <el-option label="FB开户" :value="9" />
            <el-option label="非印度" :value="8" />
            <el-option label="管理员加入" :value="7" />
            <el-option label="FB广告审核" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.iType===3" label="状态：">
          <el-select v-model.number="item.Status" size="mini">
            <el-option label="有效" :value="0" />
            <el-option label="无效" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="addDialog.visible=true">添加黑名单</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      v-if="tableVisible"
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
        v-if="this.item.iType==1"
        prop="deviceCode"
        label="设备码"
        sortable="custom"
        width="300"
      />
      <el-table-column
        v-if="this.item.iType==3"
        prop="ip"
        label="IP"
        sortable="custom"
        width="200"
      />
      <el-table-column
        prop="reason"
        label="原因"
        width="150"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['reason']" size="mini" @change="handleFilter">
            <el-option label="原因" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['reason']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('reason', scope.row.reason) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="审核阶段"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['step']" size="mini" @change="handleFilter">
            <el-option label="审核阶段" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['step']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('step', scope.row.step) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="级别"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['level']" size="mini" @change="handleFilter">
            <el-option label="级别" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['level']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('level', scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['status']" size="mini" @change="handleFilter">
            <el-option label="状态" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['status']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ clientDB.GetShowValue('status', scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        sortable="custom"
        width="150"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作员"
        sortable="custom"
        width="300"
      />
      <el-table-column
        v-if="item.iType==3"
        prop="note"
        label="备注"
        width="400"
      >
        <template slot-scope="scope">
          <span @click="showEdit(scope.row)">{{ scope.row.note === '' ? '无' : scope.row.note }}</span>
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

    <el-dialog
      title="添加IP黑名单"
      :visible.sync="addDialog.visible"
      width="30%"
    >
      <el-form label-width="80px">
        <el-form-item label="IP：">
          <el-input v-model="edit.item.ip" size="mini" />
        </el-form-item>
      </el-form>
      <el-col :offset="16">
        <el-button size="mini" type="primary" @click="addBlackIP()">提交</el-button>
      </el-col>
    </el-dialog>

    <el-dialog
      title="修改"
      :visible.sync="edit.noteDialogVisible"
      width="30%"
    >
      <el-form label-width="80px">
        <el-form-item label="IP：">
          {{ edit.item.ip }}
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="edit.item.note" size="mini" />
        </el-form-item>
      </el-form>
      <el-col :offset="16">
        <el-button size="mini" type="primary" @click="updateNote()">提交</el-button>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

const filterMap = ['', {
  reason: { 31: '手动加入', 32: '审核设备', 33: '非印度SIM', 34: '中国IP', 35: '美国IP', 36: 'IP非印度' }
},
{
  reason: { 1: '手动加入', 2: '审核设备', 3: '非印度SIM', 4: '中国IP', 5: '美国IP', 6: 'IP非印度' }
},
{
  reason: { 1: '手动加入', 2: '审核设备', 3: '非印度SIM', 4: '中国IP', 5: '美国IP', 6: 'IP非印度' },
  step: { 1: 'Google审核', 2: 'FB开户', 3: 'FB广告审核' },
  level: { 10: 'Google.10', 9: 'FB开户.9', 8: '非印度.8', 7: '管理后台.7', 5: 'FB开户.5' },
  status: { 0: '有效', 1: '无效' }
}
]

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      tableVisible: false,
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,

      item: {
        iType: 3,
        Reason: -1,
        Step: -1,
        Level: -1,
        Status: 0
      },

      search: '',
      addDialog: {
        item: {},
        visible: false
      },

      edit: {
        item: {},
        noteDialogVisible: false
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    searchChange() {
      this.clientDB.Search(this.search, ['ip'])
      this.refreshShow()
    },
    showEdit(ob) {
      this.edit.item = ob
      this.edit.noteDialogVisible = true
    },
    updateNote(ob) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/other/update/black/note',
          IP: this.edit.item.ip,
          Note: this.edit.item.note
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('更新成功！')
          $this.edit.noteDialogVisible = false
        }
      })
    },
    addBlackIP(ob) {
      const $this = this
      const uname = store.getters.name
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/safe/add/black/ip',
          IP: this.edit.item.ip,
          Operator: uname
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('添加成功！')
          $this.addDialog.visible = false
        }
      })
    },
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
      const $this = this
      const postData = {
        Env: this.env,
        Path: '/safe/black/list',
        Type: this.item.iType
      }
      if (this.item.iType === 3) {
        postData.Reason = this.item.Reason
        postData.Step = this.item.Step
        postData.Level = this.item.Level
        postData.Status = this.item.Status
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0) {
            Message.success('查询结果为空')
            return
          }
          $this.tableVisible = true
          $this.clientDB = new ClientTableData(objs, 10, filterMap[this.item.iType])
          $this.handleCurrentChange(1)
        }
      })
    }
  }
}
</script>

