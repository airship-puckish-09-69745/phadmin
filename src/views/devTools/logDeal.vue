<template>
  <div class="app-container">
    <el-row>
      <el-col :span="2" :offset="22">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="handleClick('all')">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button-group size="medium">
        <el-button :autofocus="true" type="primary" @click="handleClick('all')">全部未解决</el-button>
        <el-button type="primary" @click="handleClick('notAccept')">未认领</el-button>
        <el-button type="primary" @click="handleClick('wait')">待我处理</el-button>
        <el-button type="primary" @click="handleClick('done')">我已处理</el-button>
        <el-button type="primary" @click="handleClick('allAccept')">全部已认领</el-button>
        <el-button type="primary" @click="handleClick('allDone')">全部已处理</el-button>
      </el-button-group>
    </el-row>
    <el-row type="flex" style="height: 40px" align="bottom">
      <el-col :span="8">
        <el-button-group>
          <el-button size="mini" type="success" @click="handleBatchAccept()">批量认领</el-button>
          <el-button size="mini" type="success" @click="handleBatchDone()">批量完成</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="8" :offset="8">
        <el-col :span="4">服务名：</el-col>
        <el-col :span="12">
          <el-input v-model="searchService" size="mini" />
        </el-col>
        <el-col :span="8">
          <el-button size="mini" @click="search">查询</el-button>
        </el-col>
      </el-col>
    </el-row>
    <template>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="ID"
          label="ID"
          width="70"
        />
        <el-table-column
          prop="FirstTime"
          label="首次时间"
          width="100"
        >
          <template slot-scope="scope">{{ formatTime(scope.row.FirstTime) }}</template>
        </el-table-column>
        <el-table-column
          prop="LastTime"
          label="最近时间"
          width="100"
        >
          <template slot-scope="scope">{{ formatTime(scope.row.LastTime) }}</template>
        </el-table-column>
        <el-table-column
          prop="Count"
          label="次数"
          width="70"
        />
        <el-table-column
          prop="Msg"
          label="信息"
          min-width="200"
        />
        <el-table-column
          prop="Service"
          label="服务"
          min-width="100"
        />
        <el-table-column
          prop="File"
          label="文件"
          min-width="100"
        />
        <el-table-column
          prop="Line"
          label="行数"
          width="50"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="50"
        >
          <template slot-scope="scope">{{ getStatus(scope.row.Status) }}</template>
        </el-table-column>
        <el-table-column
          prop="Dealer"
          label="处理人"
          width="100"
        />
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              type="success"
              @click="AcceptLog(scope.row)"
            >认领
            </el-button>
            <el-button
              v-if="scope.row.Status!=6"
              size="mini"
              type="primary"
              @click="DealLog(scope.row)"
            >查看/处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex">
        <el-col :span="8">
          <el-button-group>
            <el-button size="mini" type="success" @click="handleBatchAccept()">批量认领</el-button>
            <el-button size="mini" type="success" @click="handleBatchDone()">批量完成</el-button>
          </el-button-group>
        </el-col>
        <el-col :offset="8">
          <div v-if="pageVisible" class="block">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
    </template>
    <el-dialog
      title="处理错误日志"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form id="LogDeal-edit-form" ref="edit" :model="edit" label-width="150px" size="small">
        <el-form-item label="首次时间：" :required="true">
          <span style="font-weight: bold">{{ formatTime(edit.item.FirstTime) }}</span>
        </el-form-item>
        <el-form-item label="最近发生：" :required="true">
          <span style="font-weight: bold">{{ formatTime(edit.item.LastTime) }}</span>
        </el-form-item>
        <el-form-item label="错误内容：" :required="true">
          <span style="font-weight: bold">{{ edit.item.Msg }}</span>
        </el-form-item>
        <el-form-item label="文件：" :required="true">
          <span style="font-weight: bold">{{ edit.item.File }}(line:{{ edit.item.Line }})</span>
        </el-form-item>
        <el-form-item v-if="edit.item.AcceptTime!=0" label="认领时间：" :required="true">
          {{ formatTime(edit.item.AcceptTime) }}
        </el-form-item>
        <el-form-item label="原因：" :required="true">
          <el-input
            v-model="edit.item.Reason"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="问题发生的原因"
          />
        </el-form-item>
        <el-form-item label="处理说明：" :required="true">
          <el-input
            v-model="edit.item.Description"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="处理过程说明"
          />
        </el-form-item>

        <el-form-item v-if="edit.item.FinishTime!=0" label="完成时间：" :required="true">
          {{ formatTime(edit.item.FinishTime) }}
        </el-form-item>

        <el-form-item v-if="showDoneBtn()">
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="saveEdit">处理完成</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="批量处理错误日志"
      :visible.sync="batchEdit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="batchEdit" :model="batchEdit" label-width="150px" size="small">
        <el-form-item label="原因：" :required="true">
          <el-input
            v-model="batchEdit.item.Reason"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="问题发生的原因"
          />
        </el-form-item>
        <el-form-item label="处理说明：" :required="true">
          <el-input
            v-model="batchEdit.item.Description"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="处理过程说明"
          />
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10"><el-button type="primary" size="medium" @click="saveBatch">批量处理</el-button></el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<style>
body, th, td {
  font-size: 12px;
}
</style>
<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      currentPage: 0,
      pageNum: 10,
      totalCount: 0,
      page: null,
      Type: 0,
      Status: -2,
      status: { 0: '未处理', 1: '已认领', 2: '已完成' },
      multipleSelection: [],
      batchIDs: [],
      searchService: '',
      pageVisible: true,
      env: 'pro',
      name: '',

      edit: {
        visible: false,
        item: {
          ID: 0,
          FirstTime: 0,
          LastTime: 0,
          AcceptTime: 0,
          FinishTime: 0,
          Dealer: '',
          Reason: '',
          Description: '',
          Msg: '',
          Line: 0,
          File: '',
          Status: 0
        }
      },
      batchEdit: {
        visible: false,
        item: { IDs: '', Dealer: '', Reason: '', Description: '', Status: 0 }
      }
    }
  },
  computed: {},
  created() {
    console.log(1)
    this.name = store.getters.name
    this.handleClick('all')
  },
  methods: {
    search() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/logDeal/search/service',
          Service: this.searchService
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          $this.tableData = objs
          $this.pageVisible = false
        }
      })
    },
    // 批量处理相关逻辑
    clearSelection() {
      this.$refs.filterTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBatchAccept() {
      const $this = this
      const ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const ob = this.multipleSelection[i]
        if (ob.Status !== 0) {
          Message.warning('ID为' + ob.ID + '的记录，非可认领状态！')
          return
        }
        ids.push(ob.ID)
      }
      if (ids.length > 0) {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/logDeal/update/batch',
            IDs: JSON.stringify(ids),
            Dealer: this.name,
            Type: 1
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const items = response.Data || []
            for (let i = 0; i < items.length; i++) {
              $this.updateData(items[i])
            }
            Message.success('认领错误成功，请及时处理！')
          }
        })
      }
    },
    handleBatchDone() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const ob = this.multipleSelection[i]
        if (ob.Status !== 1 || ob.Dealer !== this.name) {
          Message.warning('ID为' + ob.ID + '的记录，非已认领状态或是处理人不符！')
          return
        }
        this.batchIDs.push(ob.ID)
      }
      if (this.batchIDs.length === 0) {
        Message.warning('未选择处理项！')
      } else {
        this.batchEdit.item.IDs = JSON.stringify(this.batchIDs)
        this.batchEdit.visible = true
      }
    },
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getStatus(status) {
      return this.status[status]
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    handleClick(name) {
      switch (name) {
        case 'wait':
          this.Type = 1
          this.Status = 1
          break
        case 'done':
          this.Type = 1
          this.Status = 2
          break
        case 'allAccept':
          this.Type = 0
          this.Status = 1
          break
        case 'allDone':
          this.Type = 0
          this.Status = 2
          break
        case 'notAccept':
          this.Type = 0
          this.Status = 0
          break
        default: // 全部未完成
          this.Type = 0
          this.Status = -2
          break
      }

      this.getInfo()
    },
    updateData(ob) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].ID === ob.ID) {
          Object.assign(this.tableData[i], ob)
        }
      }
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/logDeal/all',
          Dealer: this.name,
          Type: this.Type,
          Status: this.Status,
          PageNo: this.currentPage,
          PageNum: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.tableData = response.Data.Data
          $this.currentPage = response.Data.CurrentPageNo
          $this.totalCount = response.Data.TotalCount
          $this.pageVisible = true
        }
      })
    },
    DealLog(ob) {
      this.initFormData(ob)
      this.edit.visible = true
    },
    AcceptLog(ob) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/logDeal/update',
          ID: ob.ID,
          Dealer: this.name,
          Type: 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.updateData(response.Data)
          Message.success('认领错误成功，请及时处理！')
        }
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    showDoneBtn() {
      if (this.edit.item.Status !== 1) {
        return false
      }
      if (this.edit.item.Dealer !== this.name) {
        return false
      }
      return true
    },
    initFormData(ob) {
      Object.assign(this.edit.item, ob)
    },
    saveEdit() {
      const $this = this
      this.edit.item.Type = 2
      this.edit.item.Env = this.env
      this.edit.item.Path = '/logDeal/update'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: this.edit.item
      }).then(response => {
        if (response.RetCode === 0) {
          $this.updateData(response.Data)
          Message.success('处理完成！')
          $this.edit.visible = false
        }
      })
    },
    saveBatch() {
      const $this = this
      this.batchEdit.item.Type = 2
      this.batchEdit.item.Env = this.env
      this.batchEdit.item.Path = '/logDeal/update/batch'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: this.batchEdit.item
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data
          for (let i = 0; i < items.length; i++) {
            this.updateData(items[i])
          }
          $this.clearSelection()
          Message.success('处理完成！')
          $this.batchEdit.visible = false
        }
      })
    }
  }
}
</script>
