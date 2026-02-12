<template>
  <div class="app-container">
    <el-row style="padding: 20px 0 12px;">
      <el-form :model="filter" label-width="100px" :inline="true" size="mini">
        <el-form-item label="时间：">
          <el-date-picker
            v-model="filter.timeRange"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="datePickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="tableFilter.status" style="width: 200px;" placeholder="请选择状态">
            <el-option label="全部" :value="0" />
            <el-option v-for="(k,v) in statusOptions" :key="parseInt(v)" :label="k" :value="parseInt(v)" />
          </el-select>
        </el-form-item>
        <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
        <el-button size="mini" type="success"  @click="onShowFormDialog()">新建邮件</el-button>
      </el-form>
    </el-row>

    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >
        <el-table-column label="ID" sortable width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" sortable width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountType" label="发送类型" width="160">
          <template slot-scope="scope">
            {{ getAccountTypeText(scope.row.accountType) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip width="150" />
        <el-table-column prop="send_users" label="奖励内容" >
          <template slot-scope="scope">
            {{ getRewardContentText(scope.row.rewardItems) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.modifyTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modify_user" label="最近操作人" width="120" />
        <el-table-column prop="approval_user" label="审批人" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status === 1"
              type="success"
              size="mini"
              style="width: 60px; text-align: center;"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 2"
              type="danger"
              size="mini"
              style="width: 60px; text-align: center;"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
            <el-tag
              v-else
              type="info"
              size="mini"
              style="width: 60px; text-align: center;"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="380px" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 3" type="primary" size="mini" icon="el-icon-edit" @click="onShowFormDialog(scope.row)">编辑</el-button>
            <el-button v-if="isShowDetails(scope.row.status)" type="primary" size="mini" @click="onShowDetailsDialog(scope.row)">查看详情</el-button>
            <el-button v-if="scope.row.status === 3" type="warning" size="mini" @click="onSubmitReview(scope.row)">发起审批</el-button>
            <el-button v-if ="scope.row.status === 6" type="warning" size="mini" @click="onSubmitDistribution(scope.row)">发起发送</el-button>
            <el-button v-if ="scope.row.status === 6" type="info" size="mini" @click="onSubmitReview(scope.row)">取消发送</el-button>
            <el-button  v-if="scope.row.status === 3" size="mini" type="danger" @click="handleDeleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="tablePagination.total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            当前页：{{ tablePagination.currentPage }}/{{ Math.ceil(tablePagination.total / tablePagination.pageSize) }}
          </span>
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import FormDialog from '@/views/itemManage/batchDistribution/components/FormDialog.vue'
import DetailsDialog from '@/views/itemManage/batchDistribution/components/DetailsDialog.vue'
import { $libDate, $libShow } from '@/utils/common'
import { formatTime } from "@/utils"
import request from '@/utils/request'
import { PROP_TYPE_OPTIONS, ITEM_STATUSES } from '@/utils/options'

export default {
  name: 'PropsConfig',
  components: { FormDialog, DetailsDialog, formatTime },
  data() {
    return {
      libShow: $libShow,
      datePickerOptions: $libShow.DefaultDatePickerOptions(),
      statusOptions: {
        1: '发起成功',
        2: '发起失败',
        3: '未审批',
        4: '审批中',
        6: '同意',
        7: '拒绝',
        10: '手动取消'
      },
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      tableData: [],
      tableFilter: {
        timeRange: [],
        status: 0
      },
      tablePagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      propList: [], // 道具列表
      env: this.$store.getters.env,
    }
  },
  mounted() {
    // 获取道具列表
    this.getPropList()
    // 获取奖励邮件申请列表
    this.getList()
  },
  methods: {
    // 获取奖励邮件申请列表
    getList() {
      request({
        url: '/rewardmailapply/list',
        method: 'post',
        data: {
          env: this.env,
          pageNum: this.tablePagination.currentPage,
          pageSize: this.tablePagination.pageSize,
          startTime: this.tableFilter.timeRange[0] ? Math.round(this.tableFilter.timeRange[0] / 1000) : 0,
          endTime: this.tableFilter.timeRange[1] ? Math.round(this.tableFilter.timeRange[1] / 1000) : 0,
          status: this.tableFilter.status,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data || []
          this.tablePagination.total = response.Total || 0
        }
      })
    },
    // 搜索奖励邮件申请
    onSearch() {
      this.tablePagination.currentPage = 1
      this.getList()
    },
    // 分页大小改变时触发
    handlePageSizeChange(pageSize) {
      this.tablePagination.pageSize = pageSize
      this.getList()
    },
    // 当前页改变时触发
    handleCurrentPageChange(currentPage) {
      this.tablePagination.currentPage = currentPage
      this.getList()
    },
    // 格式化时间
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    onShowDetailsDialog(row) {

    },
    onSubmitReview(row) {

    },
    onSubmitDistribution(row) {

    },
    // 删除奖励邮件申请
    handleDeleteRow(row) {
      this.$confirm(`您确定要删除奖励邮件吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rewardmailapply/delete',
          method: 'post',
          data: {
            Env: this.env,
            Id: row.id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    onShowFormDialog() {

    },
    /**
     * status，只有 发起成功，发起失败，审批中，拒绝，同意，手动取消 才显示详情
     */
    isShowDetails(status) {
      return [
        ITEM_STATUSES.SUCCESS,
        ITEM_STATUSES.FAIL,
        ITEM_STATUSES.APPROVING,
        ITEM_STATUSES.AGREED,
        ITEM_STATUSES.REJECTED,
        ITEM_STATUSES.MANUAL_CANCEL_STATUS
      ].includes(status)
    },
    // 获取状态文本
    getStatusText(status) {
      return this.statusOptions[status] || '未知'
    },
    // 获取账号类型文本
    getAccountTypeText(accountType) {
      switch (accountType) {
        case 1:
          return 'Uid'
        case 2:
          return '用户账号'
        default:
          return '未知'
      }
    },
    // 获取奖励内容文本
    getRewardContentText(rewardItems) {
      let content = ''
      rewardItems.forEach(item => {
        if ([1,2,3].includes(item.item_type)) { // 金币
          content += `${item.item_num}（₱）|`
          return
        }
        const propType = item.prop_type
        const propName = this.getPropText(propType)
        content += `${propName} x ${item.item_num}|`
      })
      content = content.slice(0, -1)
      return content
    },
    // 获取道具文本
    getPropText(propType) {
      const prop = this.propList.find(item => item.prop_type === propType)
      return prop ? prop.prop_name : '未知'
    },
    /**
     * 获取道具列表
     * 由于没有提供道具下拉框接口，这里使用列表的接口，size为100
     */
    getPropList() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/props/config/list',
          PropType: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            const timestamp = Date.parse(new Date()) / 1000;
            this.total = objs.total
            this.propList = []
            for (let i = 0; i < objs.total; i++) {
              if (objs.list[i].status === 1 && this.isTicketProp(objs.list[i].item_type) && objs.list[i].expire_time > timestamp) {
                this.propList.push(objs.list[i])
              }
              if (objs.list[i].status === 1 && (this.isAvatarFrameProp(objs.list[i].item_type) || objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN)) {
                this.propList.push(objs.list[i])
              }
              // 新版道具
              if(objs.list[i].status === 1 && this.isNewTicketProp(objs.list[i].item_type)){
                this.propList.push(objs.list[i])
              }
            }
          }
        } else {
          this.total = 0
          this.propList = []
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
