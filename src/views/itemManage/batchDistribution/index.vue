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
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="onShowFormDialog()">批量发放</el-button>
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
          <template slot-scope="scope">
            {{ formatTime(scope.row.publish_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="propName" label="道具名称" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.prop_details.prop_name" placement="top">
              <span>{{ scope.row.prop_details.prop_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="send_num" label="总发放量" />
        <el-table-column prop="applicant_user" label="操作人" width="120" />
        <el-table-column prop="approval_user" label="审批人" width="120" />
        <el-table-column prop="status" label="状态">
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

        <el-table-column fixed="right" width="270px" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 3" type="primary" size="mini" icon="el-icon-edit" @click="onShowFormDialog(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="onShowDetailsDialog(scope.row)">查看详情</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column fixed="right" width="160px" label="详情">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onShowDetailsDialog(scope.row)">查看详情</el-button>
          </template>
        </el-table-column> -->
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
    <DetailsDialog :visible="detailsForm.visible" @close="onCloseDetailsDialog" />
  </div>

</template>
<script>
import store from '@/store'
import { Message } from 'element-ui'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
import DetailsDialog from './components/DetailsDialog.vue'
// import { ITEM_TYPE_OPTIONS } from '@/utils/options'

export default {
  name: 'PropsConfig',
  components: { FormDialog, DetailsDialog },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '待发放'
        },
        {
          value: 2,
          label: '已发放'
        }
      ],
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
        id: null
      },
      editForm: {
        visible: false,
        data: {
          publish_time: '', // 发起时间
          remark: '', // 备注
          prop_details: '', // 道具信息
          send_num: '', // 发放总量
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
        send_num: '发放数量',
        propName: '道具名称',
        applicant_user: '操作人',
        status: '状态'
      }
    }
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
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
      this.detailsForm.id = data.id
    },
    onCloseDetailsDialog() {
      this.detailsForm.visible = false
      this.detailsForm.id = null
    },
    getList() {
      request({
        url: '/propsbatchapply/list',
        method: 'get',
        data: {
          // Env: this.env,
          // PageNum: this.page,
          // PageSize: this.limit,
          Offset: 0,
          Limit: 20,
          StartTime: this.filter.timeRange[0] ? Math.round(this.filter.timeRange[0] / 1000) : 0,
          EndTime: this.filter.timeRange[1] ? Math.round(this.filter.timeRange[1] / 1000) : 0,
          Status: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = []
          // 将prop_details和send_details解析为json对象
          const list = response.Data.map(item => {
            item.prop_details = JSON.parse(item.prop_details)
            item.send_details = JSON.parse(item.send_details)
            return item
          })
          this.tableData = list
          console.log('发放列表', this.tableData)
        }
      })
    },
    /**
     * 将发放状态转为文字
     * @param status 发放状态
     */
    getStatusText(status) {
      const statusMap = {
        1: '发起成功',
        2: '发起失败',
        3: '未审批',
        4: '审批中',
        5: '废弃',
        6: '同意',
        7: '拒绝',
        8: '小额自动同意',
        9: '自动取消',
        10: '手动取消'
      }
      return statusMap[status] || status
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
    handleDelete(id) {
      this.$confirm('您确定要将该道具删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        const deleteList = []
        for (const key in this.editForm.tableData) {
          if (this.editForm.tableData[key].id === id) {
            continue
          }
          newList.push(this.editForm.tableData[key])
        }
        for (const key in this.tableData) {
          if (this.tableData[key].id === id) {
            deleteList.push(this.tableData[key])
          }
        }
        this.editForm.tableData = newList
        this.deleteData = deleteList
        request({
          url: '/propsconfig/props/config/delete',
          method: 'post',
          data: {
            Env: this.env,
            ID: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除道具成功')
            this.getList()
          } else {
            Message.error('删除道具失败！')
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
