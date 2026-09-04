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
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="发放状态：">
          <el-select v-model="filter.status" style="width: 200px;" placeholder="请选择道具分类">
            <el-option label="全部" :value="0" />
            <el-option v-for="(k,v) in statusOptions" :key="parseInt(v)" :label="k" :value="parseInt(v)" />
          </el-select>
        </el-form-item>
        <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
        <el-button size="mini" type="success"  @click="onShowFormDialog()">创建申请</el-button>
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
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column label="道具ID" sortable width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.prop_details.prop_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_time" label="发布时间" width="160">
          <template v-if="scope.row.status == 1"  slot-scope="scope">
            {{ formatTime(scope.row.publish_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip width="150" />
        <el-table-column prop="propName" label="道具名称" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.prop_details.prop_name" placement="top">
              <span>{{ scope.row.prop_details.prop_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="send_num" label="发放用户数" />
        <el-table-column prop="send_users" label="总发道具数量" >
          <template slot-scope="scope">
            {{scope.row.send_num*scope.row.prop_details.prop_num}}
          </template>
          </el-table-column>/
        <el-table-column prop="applicant_user" label="操作人" width="120" />
        <el-table-column prop="approval_user" label="审批人" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status == 1"
              type="success"
              size="mini"
              style="width: 60px; text-align: center;"
            >{{ getStatusText(scope.row.status) }}</el-tag>
            <el-tag
              v-else-if="scope.row.status == 2"
              type="danger"
              size="mini"
              style="width: 60px; text-align: center;"
            >{{ getStatusText(scope.row.status) }}</el-tag>
            <el-tag
              v-else
              type="info"
              size="mini"
              style="width: 60px; text-align: center;"
            >
              {{
                getStatusText(scope.row.status)
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="380px" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 3" type="primary" size="mini" icon="el-icon-edit" @click="onShowFormDialog(scope.row)">编辑</el-button>
            <el-button v-if="showDetails(scope.row.status)" type="primary" size="mini" @click="onShowDetailsDialog(scope.row)">查看详情</el-button>
            <el-button v-if="scope.row.status == 3" type="warning" size="mini" @click="onSubmitReview(scope.row)">发起审批</el-button>
            <el-button v-if ="scope.row.status == 6" type="warning" size="mini" @click="onSubmitDistribution(scope.row)">发起发放</el-button>
            <el-button v-if ="scope.row.status == 6" type="info" size="mini" @click="onSubmitReview(scope.row)">取消发放</el-button>
            <el-button  v-if="scope.row.status == 3" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            当前页：{{ page }}/{{ Math.ceil(total / limit) }}
          </span>
        </el-pagination>
      </div>
    </el-row>

    <FormDialog :visible="editForm.visible" :update-form="editForm.data" @close="onCloseFormDialog" @reload="getList" />
    <DetailsDialog :visible="detailsForm.visible" :origin-data="detailsForm.data" @close="onCloseDetailsDialog" />
  </div>

</template>
<script>
import store from '@/store'
import { Message } from 'element-ui'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
import DetailsDialog from './components/DetailsDialog.vue'
import { ITEM_STATUS_OPTIONS } from '@/utils/options'

export default {
  name: 'PropsConfig',
  components: { FormDialog, DetailsDialog },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
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
      imagePickerVisible: false,

      raw: {},
      tableData: [],
      deleteData: [],
      limit: 10,
      total: 0,
      page: 1,
      filter: {
        timeRange: [],
        status: 0
      },
      detailsForm: {
        visible: false,
        data: null
      },
      editForm: {
        visible: false,
        data: {
          publish_time: '', // 发起时间
          remark: '', // 备注
          prop_details: '', // 道具信息
          send_num: '', //  总发放人数
          send_props: '', //发放总量
          applicant_user: '', // 申请人
          status: '', // 1:发起成功,2:发起失败,3:未审批,4:审批中,5:废弃,6:同意,7:拒绝,8:小额自动同意,9:自动取消,10:手动取消
          send_details: '', // 发放详情
          approval_user: '', // 审批人
          approval_time: '', // 审批时间
          approval_description: '', // 审批意见
          account_type: '' // 账号类型1:account 2:uid
        },
        itemEndDate: $libDate.GetDayBegin(new Date().setSeconds(0))
      },

      AttrNames: {
        index: '序号',
        publish_time: '发布时间',
        remark: '备注',
        send_num: '总发放人数',
        send_props: '发放数量',
        propName: '道具名称',
        applicant_user: '操作人',
        status: '状态'
      }
    }
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.appId = store.getters.appId || this.appId
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 重置搜索条件进行搜索
     */
    onSearch() {
      this.page = 1
      this.getList()
    },
    onShowFormDialog(data = null) {
      this.editForm.data = data
      this.editForm.visible = true
    },
    onCloseFormDialog() {
      this.editForm.visible = false
      this.editForm.data = null
    },
    onShowDetailsDialog(data) {
      this.detailsForm.visible = true
      this.detailsForm.data = data
    },
    onCloseDetailsDialog() {
      this.detailsForm.visible = false
      this.detailsForm.data = null
    },
    /**
     * status，只有 发起成功，发起失败，拒绝 才显示详情
     */
    showDetails(status) {
      if (status === 1 || status === 2 || status === 7 || status === 4 || status === 6) {
        return true
      }

      return false
    },
    /**
     * 二次确认发起审批/取消
     * 0:申请发放  10:取消发放
     */
    onSubmitReview(data) {
      this.$confirm(`您确定要${data.status === 3 ? '发起' : '取消'}审批吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/propsbatchapply/update/status',
          method: 'post',
          data: {
            ID: data.id,
            Status: data.status === 3 ? 0 : 10
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
    getList() {
      request({
        url: '/propsbatchapply/list',
        method: 'get',
        data: {
          Offset: 0,
          Limit: 20,
          PageSize: this.limit,
          PageNum: this.page,
          StartTime: this.filter.timeRange[0] ? Math.round(this.filter.timeRange[0] / 1000) : 0,
          EndTime: this.filter.timeRange[1] ? Math.round(this.filter.timeRange[1] / 1000) : 0,
          Status: this.filter.status,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = []
          this.total = 0
          const objs = response.Data || []
          console.log("数据返回 ",objs)
          if (objs.total > 0) {
            this.total = response.Data.total
            console.log("resp.data",objs.list)
            // 将prop_details和send_details解析为json对象
            const dataList = objs.list.map(item => {
              item.prop_details = JSON.parse(item.prop_details)
              item.send_details = JSON.parse(item.send_details)
              return item
            })
            this.tableData = dataList
            //console.log('发放列表', this.tableData)
          }


        }
      })
    },
    /**
     * 将发放状态转为文字
     * @param status 发放状态
     */
    getStatusText(status) {
      const statusObj = ITEM_STATUS_OPTIONS.find(item => item.value === status)
      return statusObj ? statusObj.label : status
    },
    /**
     * 审核通过之后，发起发放
     * @param data
     */
    onSubmitDistribution(data) {
      this.$confirm(`您确定要发起发放吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/propsbatchapply/grant',
          method: 'post',
          data: {
            ID: data.id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('发起发放: ', response)
            Message.success('操作成功!')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    formatNum(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleDelete(data) {
      this.$confirm(`您确定要将${data.prop_details.prop_name}删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/propsbatchapply/delete',
          method: 'post',
          data: {
            ID: data.id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除成功!')
            this.getList()
          } else {
            Message.error('删除失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    timeToSec(time) {
      var s = ''
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]

      s = Number(hour * 3600) + Number(min * 60) + Number(sec)

      return s
    }
  }
}
</script>
