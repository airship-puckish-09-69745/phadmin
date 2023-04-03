<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">

        <el-form-item label="UID：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>

        <el-form-item label="来源">
          <el-select v-model.number="form.source">
            <el-option label="所有" :value="0" />
            <el-option
              v-for="item in form.sourceOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model.number="form.status">
            <el-option label="所有" :value="-1" />
            <el-option
              v-for="item in form.statusOption"
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

    <el-row>
      <el-col :span="24">
        <el-descriptions
          class="margin-top"
          :column="6"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item v-for="(val, source) in summary" v-if="checkSource(source)" :label="showSource(source)">{{ val | toRupee }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
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
    >
      <el-table-column
        prop="ID"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="ContributionUid"
        label="贡献人"
        width="120"
      />
      <el-table-column
        prop="DirectUid"
        label="直接贡献人"
        width="120"
      />
      <el-table-column
        prop="Source"
        label="来源"
        width="150"
      >
        <template slot-scope="scope">
          {{ showSource(scope.row.Source) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="PayAmount"
        label="充值金额"
        width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.PayAmount | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="佣金"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.Amount | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        label="状态"
        width="150"
      >
        <template slot-scope="scope">
          {{ showStatus(scope.row.Status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="IsIssue"
        label="是否发放当前余额"
      >
        <template slot-scope="scope">
          {{ showIssue(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="CreatedAt"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ scope.row.CreatedAt | parseTime }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
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
      </el-col>
    </el-row>
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

export default {
  name: 'InviteCommissionLog',
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,

      form: {
        source: 0,
        status: -1,
        statusOption: [
          { label: '进行中', value: 0 },
          { label: '待发放', value: 1 },
          { label: '已完成', value: 2 },
          { label: '已过期', value: 3 }
        ],
        sourceOption: [
          { label: '邀请奖励', value: 1 },
          { label: '被邀请人充值', value: 2 },
          { label: '罐子', value: 3 },
          { label: '排行榜', value: 4 },
          { label: '任务', value: 5 },
          { label: '1级推广者充值', value: 10 },
          { label: '2级推广者充值', value: 11 },
          { label: '3级推广者充值', value: 12 },
          { label: '4级推广者充值', value: 13 },
          { label: '罐子进行中', value: 14 }
        ]
      },

      tableData: [],
      search: '',
      libShow: $libShow,
      summary: {

      },

      item: {
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
    console.log(1)
  },
  methods: {
    showTaskName(row) {
      if (row.Source !== 3) {
        return ''
      }
      return ''
    },
    showIssue(row) {
      if ([1,2,10,11,12,13].indexOf(parseInt(row.Source)) !== -1) {
        return row.IsIssue === 1 ? '已发放' : '进行中'
      } else {
        return '已发放'
      }
    },
    checkSource(source) {
      return [1, 2, 3, 4, 5, 10, 11, 12, 13].indexOf(parseInt(source)) !== -1
    },
    showStatus(status) {
      let name = ''
      for (const i in this.form.statusOption) {
        if (this.form.statusOption[i].value == status) {
          name = this.form.statusOption[i].label
          break
        }
      }
      return name
    },
    showSource(source) {
      let name = ''
      for (const i in this.form.sourceOption) {
        if (this.form.sourceOption[i].value == source) {
          name = this.form.sourceOption[i].label
          break
        }
      }
      return name
    },
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
    formatNumber(n) {
      return n.toLocaleString()
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
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
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/query/invite/commission',
          uid: this.item.Uid,
          status: this.form.status,
          source: this.form.source,
          page: this.page,
          limit: this.limit,
          create_sts: bTime,
          create_ets: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || []
          if (this.page === 1) {
            this.total = data.total
            this.summary = data.summary
          }
          this.tableData = data.data

          loading.close()
        }
      })
    }

  }
}
</script>

