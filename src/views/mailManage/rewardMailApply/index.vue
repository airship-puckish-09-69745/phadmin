<template>
  <div class="app-container">
    <el-row style="padding: 20px 0 12px;">
      <el-form :model="tableFilter" label-width="100px" :inline="true" size="mini">
        <el-form-item label="发送时间：">
          <el-date-picker
            v-model="tableFilter.timeRange"
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
        <el-table-column label="ID" sortable width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮件标题" sortable width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountType" label="发送类型" width="100">
          <template slot-scope="scope">
            {{ getAccountTypeText(scope.row.accountType) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="邮件内容" show-overflow-tooltip min-width="230" />
        <el-table-column prop="send_users" label="奖励内容" min-width="200">
          <template slot-scope="scope">
            {{ getRewardContentText(scope.row.rewardItems) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="160">
          <template slot-scope="scope">
            {{ formatTime(scope.row.modifyTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最近操作人" width="130" />
        <el-table-column prop="sendTime" label="发送时间" width="160">
          <template slot-scope="scope">
            {{ formatTime(scope.row.sendTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="102">
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
            <el-tag
              v-if="isShowExpiredTag(scope.row)"
              type="danger"
              size="mini"
              style="width: 60px; text-align: center;"
            >
              已过期
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column width="320px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onCopyRow(scope.row)">复制</el-button>
            <el-button v-if="scope.row.status === ITEM_STATUSES.UNAPPROVED" type="primary" size="mini" @click="onShowFormDialog(scope.row)">编辑</el-button>
            <el-button v-if="isShowDetailsButton(scope.row.status)" type="primary" size="mini" @click="onShowDetailsDialog(scope.row)">详情</el-button>
            <el-button v-if="isShowSubmitReviewButton(scope.row)" type="warning" size="mini" @click="onSubmitReview(scope.row)">发起审批</el-button>
            <el-button v-if ="isShowDistributionButton(scope.row)" type="warning" size="mini" @click="onSubmitDistribution(scope.row)">发送</el-button>
            <el-button v-if ="scope.row.status === ITEM_STATUSES.AGREED" type="info" size="mini" @click="onCancelDistribution(scope.row)">取消</el-button>
            <el-button  v-if="scope.row.status === ITEM_STATUSES.UNAPPROVED" size="mini" type="danger" @click="onDeleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="tablePagination.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tablePagination.pageSize"
          layout="slot, total, sizes, prev, pager, next, jumper"
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

    <FormDialog :visible="editForm.visible" :update-form="editForm.data" :prop-list="propList" @close="onCloseFormDialog" @reload="getList" />
    <DetailDialog :visible="detailsForm.visible" :detail-form="detailsForm.data" :prop-list="propList" @close="onCloseDetailsDialog" />
  </div>
</template>

<script>
import FormDialog from '@/views/mailManage/rewardMailApply/components/formDialog.vue'
import DetailDialog from "@/views/mailManage/rewardMailApply/components/detailDialog.vue";
import { $libDate, $libShow } from '@/utils/common'
import { formatTime } from "@/utils"
import request from '@/utils/request'
import { PROP_TYPE_OPTIONS, ITEM_STATUSES, ITEM_TYPE_OPTIONS, ITEM_STATUS_OPTIONS } from '@/utils/options'
import { IsNewTicketProp, IsTicketProp, IsAvatarFrameProp } from '@/utils/prop'
import { Message } from "element-ui";

export default {
  name: 'PropsConfig',
  components: {DetailDialog, FormDialog, formatTime },
  data() {
    return {
      libShow: $libShow,
      datePickerOptions: $libShow.DefaultDatePickerOptions(),
      ITEM_STATUSES,
      statusOptions: {
        1: '发送成功',
        2: '发送失败',
        3: '未审批',
        4: '审批中',
        6: '已审批',
        7: '已拒批',
        10: '手动取消',
        11: '发送中'
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
      detailsForm: {
        visible: false,
        data: null
      },
      editForm: {
        visible: false,
        data: {
          appId: parseInt(this.$store.getters.appId), // appid
          mailAccounts: '', // 账号列表，json字符串
          accountType: 2, // 账号类型1:account 2:uid
          title: '', // 标题
          content: '', // 内容
          expireTime: '', // 过期时间
          deadline: '', // 截止时间
          rewardItems: '', // 奖励物品，json字符串
          status: '', // 1:发起成功,2:发起失败,3:未审批,4:审批中,5:废弃,6:同意,7:拒绝,8:小额自动同意,9:自动取消,10:手动取消,11:发送中
        },
        itemEndDate: $libDate.GetDayBegin(new Date().setSeconds(0))
      },
    }
  },
  mounted() {
    // 获取道具列表
    this.getPropList()
    // 获取奖励邮件申请列表
    this.getList()
  },
  methods: {
    ITEM_STATUS_OPTIONS() {
      return ITEM_STATUS_OPTIONS
    },
    // 获取奖励邮件申请列表
    getList() {
      console.log('this.tableFilter', this.tableFilter)
      const timeRange = this.tableFilter.timeRange || []
      request({
        url: '/rewardmailapply/list',
        method: 'post',
        data: {
          pageNum: this.tablePagination.currentPage,
          pageSize: this.tablePagination.pageSize,
          startTime: timeRange[0] ? Math.round(timeRange[0] / 1000) : 0,
          endTime: timeRange[1] ? Math.round(timeRange[1] / 1000) : 0,
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
      if (ts === 0) {
        return ''
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 显示奖励邮件申请详情
    onShowDetailsDialog(row) {
      this.detailsForm.visible = true
      this.detailsForm.data = row
    },
    onCloseDetailsDialog() {
      this.detailsForm.visible = false
      this.detailsForm.data = null
    },
    // 提交审批
    onSubmitReview(row) {
      if (row.status !== ITEM_STATUSES.UNAPPROVED) {
        Message.error('非【未审批】状态不能发起审批!')
        return
      }

      this.$confirm(`您确定要发起审批吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rewardmailapply/apply',
          method: 'post',
          data: {
            id: row.id,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('发起审批: ', response)
            Message.success('操作成功!')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    // 取消发送奖励邮件
    onCancelDistribution(row) {
      if (row.status !== ITEM_STATUSES.AGREED) {
        Message.error('非【已审批】状态不能取消发送奖励邮件!')
        return
      }

      this.$confirm(`您确定要取消发送奖励邮件吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rewardmailapply/cancel',
          method: 'post',
          data: {
            id: row.id,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('取消发送: ', response)
            Message.success('操作成功!')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    // 发送奖励邮件
    onSubmitDistribution(row) {
      if (row.status !== ITEM_STATUSES.AGREED) {
        Message.error('非【已审批】状态不能发送奖励邮件!')
        return
      }

      this.$confirm(`您确定要发送奖励邮件吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rewardmailapply/grant',
          method: 'post',
          data: {
            id: row.id,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('发送奖励邮件: ', response)
            Message.success('操作成功!')
            this.getList()
          }
        })
      })
    },
    // 删除奖励邮件申请
    onDeleteRow(row) {
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
            id: row.id
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
    onCopyRow(row) {
      row.id = 0
      this.editForm.data = row
      this.editForm.visible = true
    },
    onShowFormDialog(data = null) {
      this.editForm.data = data
      this.editForm.visible = true
    },
    onCloseFormDialog() {
      this.editForm.visible = false
      this.editForm.data = null
    },
    isExpired(row) {
      if (row.expireTime && row.expireTime < Date.now() / 1000) {
        return true
      }
      return !!(row.deadline && row.deadline < Date.now() / 1000)
    },
    /**
     * 是否显示过期标签
     * @param row
     * @returns {boolean}
     */
    isShowExpiredTag(row) {
      return [ITEM_STATUSES.UNAPPROVED, ITEM_STATUSES.AGREED].includes(row.status) && this.isExpired(row)
    },
    /**
     * 是否显示发起审批按钮
     * @param row
     * @returns {boolean}
     */
    isShowSubmitReviewButton(row) {
      if (this.isExpired(row)) {
        return false
      }
      return row.status === ITEM_STATUSES.UNAPPROVED
    },
    /**
     * status，只有 发起成功，发起失败，审批中，拒绝，同意，手动取消 才显示详情
     */
    isShowDetailsButton(status) {
      return [
        ITEM_STATUSES.SUCCESS,
        ITEM_STATUSES.FAIL,
        ITEM_STATUSES.APPROVING,
        ITEM_STATUSES.AGREED,
        ITEM_STATUSES.REJECTED,
        ITEM_STATUSES.MANUAL_CANCEL_STATUS
      ].includes(status)
    },
    /**
     * 是否显示发送奖励邮件按钮
     * @param row
     * @returns {boolean}
     */
    isShowDistributionButton(row) {
      if (this.isExpired(row)) {
        return false
      }
      return [
        ITEM_STATUSES.AGREED,
      ].includes(row.status)
    },
    // 获取状态文本
    getStatusText(status) {
      if (this.isExpired(status)) {}
      return this.statusOptions[status] || '未知'
    },
    // 获取账号类型文本
    getAccountTypeText(accountType) {
      switch (accountType) {
        case 1:
          return '用户账号'
        case 2:
          return 'Uid'
        default:
          return '未知'
      }
    },
    // 获取奖励内容文本
    getRewardContentText(rewardItems) {
      const items = JSON.parse(rewardItems)
      let content = ''
      items.forEach(item => {
        if ([1, 2, 3].includes(item.itemType)) { // 金币
          content += `${item.itemNum / 1000}（₱）|`
          return
        }
        const propId = item.itemId
        const propType = item.itemSubType
        const propTypeName = this.getPropTypeText(propType)
        const propName = this.getPropNameText(propId)
        content += `${propTypeName}：${propName} x ${item.itemNum}|`
      })
      content = content.slice(0, -1)
      return content
    },
    // 获取道具类型文本
    getPropTypeText(propType) {
      const prop = ITEM_TYPE_OPTIONS.find(item => item.value === propType)
      return prop ? prop.label : '未知道具类型:' + propType
    },
    getPropNameText(propId) {
      const prop = this.propList.find(item => item.id === propId)
      return prop ? prop.item_name : '未知ID:' + propId
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
              const obj = objs.list[i]
              if (obj.status === 1 && obj.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_INTERACTION  && obj.expire_time > timestamp) {
                this.propList.push(obj)
              }
              if (obj.status === 1 && (IsAvatarFrameProp(obj.item_type) || obj.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN)) {
                this.propList.push(obj)
              }
              // 新版道具
              if(obj.status === 1 && IsNewTicketProp(obj.item_type)){
                this.propList.push(obj)
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
