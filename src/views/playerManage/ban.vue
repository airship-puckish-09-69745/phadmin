<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="封号时间：">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="Uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="actType" placeholder="请选择">
            <el-option
              v-for="item in actOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="danger" size="mini" @click="handleCreate()">批量封号</el-button>
        </el-form-item>
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
      style="width: 100%;"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="uid"
        label="用户id"
      />
      <el-table-column
        prop="act_type"
        label="操作类型"
      >
        <template slot-scope="scope">
          {{ formatAct(scope.row.act_type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="操作原因"
      />
      <el-table-column
        prop="operator"
        label="操作者"
      />
      <el-table-column
        prop="act_time"
        label="操作时间"
      >
        <template slot-scope="scope">
          {{ scope.row.act_time | parseTime }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <div style="text-align: center; width: 100%; height: 50px; padding-top: 10px;">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <el-dialog
      title="批量封号"
      :modal="false"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-form-item label="用户ID：" :required="true">
            <el-input v-model="edit.uids" type="textarea" :rows="10" minlength="8" maxlength="50" placeholder="多个id用英文逗号风格" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="封号原因：" :required="true">
            <el-input v-model="edit.remark" minlength="1" maxlength="5" placeholder="请输入封号原因" />
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

function newItem() {
  return {
    uids: '',
    remark: ''
  }
}
export default {
  name: 'InviteCommissionLog',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      Uid: '',
      actType: -1,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        titles: {},
        contents: { en: '', hi: '' },
        expireTime: '',
        uids: '',
        remark: ''
      },
      tableData: [],
      search: '',
      libShow: $libShow,
      summary: {

      },
      actOptions: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '解封'
      }, {
        value: 1,
        label: '封号'
      }],
      searchForm: {
        Uid: 0
      },
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      env: 'test'
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getInfo()
  },
  methods: {
    // 分页处理
    handleSizeChange(val) {
      this.limit = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getInfo()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatAct(actType) {
      if (actType == '0') {
        return '解封'
      } else {
        return '封号'
      }
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    save() {
      request({
        url: '/ban/add',
        method: 'post',
        data: {
          Env: this.env,
          Uids: this.edit.uids,
          Remark: this.edit.remark,
          ActType: 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success(response.Data)
          this.edit.uids = ''
          this.edit.remark = ''
          this.edit.visible = false
        }
      })
    },
    getInfo() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let searchUid = 0
      if (this.Uid > 0) {
        searchUid = this.Uid
      }
      request({
        url: '/ban/all',
        method: 'get',
        data: {
          Env: this.env,
          Uid: searchUid,
          Page: this.page,
          Limit: this.limit,
          BeginTime: bTime,
          EndTime: eTime,
          Type: this.actType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || []
          if (this.page === 1) {
            this.total = data.Total
            this.summary = data.summary
          }
          this.tableData = data.List
          loading.close()
        }
      })
    }

  }
}
</script>
