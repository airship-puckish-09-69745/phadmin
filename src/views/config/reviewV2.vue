<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish ref="publish" :key-id="edit.item.ConfigKey" :app-id="edit.item.AppId" :diff-view="true" />
    </el-row>
    <el-row>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <el-badge v-if="counts[0]!==0" :value="counts[0]" class="item">
            我的申请
          </el-badge>
          <span v-else>我的申请</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-badge v-if="counts[1]!==0" :value="counts[1]" class="item">
            待我处理
          </el-badge>
          <span v-else>待我处理</span>
        </el-menu-item>
        <el-menu-item index="3">我已处理</el-menu-item>
      </el-menu>
    </el-row>
    <el-form inline label-width="90px" :inline="true" size="small">
      <el-form-item>
        <el-button type="success" size="mini" @click="batchReview">批量审核</el-button>
      </el-form-item>
    </el-form>
    <div style="padding-top: 10px">
      <el-checkbox v-model="isAllSelected" @change="handleSelectAll">{{ isAllSelected ? '取消全选' : '全选' }}</el-checkbox>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="(row, index) => (row.Status === 1) " />
        <el-table-column
          prop="ID"
          label="ID"
          width="70"
        />
        <el-table-column
          prop="AppId"
          label="AppID"
          width="100"
        />
        <el-table-column
          prop="Title"
          label="主题"
          min-width="200"
        />
        <el-table-column
          prop="CreateUserName"
          label="申请人"
          width="120"
        />
        <el-table-column
          prop="CreateTime"
          label="申请时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ReviewUserName"
          label="当前处理人"
          width="100"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            {{ getStatusShow(scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.Status!=2 && scope.row.Status!=3 && scope.row.Status!=4"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
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
    </div>

    <el-dialog
      title="审核配置"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.item" :model="edit.item" label-width="120px" size="small">
        <el-form-item label="AppId：" :required="true">
          {{ edit.item.AppId }}
        </el-form-item>
        <el-form-item label="标题：" :required="true">
          {{ edit.item.Title }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人：">
              {{ edit.item.CreateUserName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间：">
              {{ formatTime(edit.item.CreateTime) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="可审批人：">
          <el-tag v-for="(o, index) in edit.ops" :key="index">{{ o }}</el-tag>
        </el-form-item>
        <el-form-item label="审批详情：">
          <el-input
            v-model="edit.item.Summary"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            disabled
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="viewDetail">点击查看发布内容详情</el-button>
        </el-form-item>
        <template v-if="canEdit()">
          <el-form-item label="审批意见：" prop="Comment" :required="true">
            <el-input
              v-model="edit.item.Comment"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
            />

          </el-form-item>

          <el-form-item label="">
            <el-col :offset="9" :span="12">
              <el-button type="success" @click="passReview(1)">通过</el-button>
              <el-button type="warning" @click="passReview(2)">拒绝</el-button>
            </el-col>
          </el-form-item>
        </template>
        <template v-else>
          <el-timeline>
            <el-timeline-item
              v-for="(o, index) in edit.actions"
              :timestamp="o.CreateTime"
            >
              {{ o.UserName }} {{ o.Action }} 于
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-form>
    </el-dialog>

    <el-dialog
      title="批量审核信息"
      :visible.sync="batchDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <div v-html="batchDialogContent" />
      <el-button
        v-if="batchConfigKeys.length > maxDisplayConfigKeys"
        type="primary"
        size="mini"
        style="margin-top: 10px"
        @click="toggleShowAllKeys"
      >
        {{ batchShowAllKeys ? '收起' : '显示所有' }}
      </el-button>
      <el-form style="margin-top: 20px">
        <el-form-item label="审批意见" :required="true">
          <el-input
            v-model="batchComment"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleBatchCancel">拒 绝</el-button>
        <el-button type="primary" @click="handleBatchConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}

.table-bg thead th {
  background-color: #f5fafe;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}

.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}

.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.el-table .el-table__row.disabled .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.table th {
  font-weight: bold;
}
</style>
<script>
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

export default {
  components: { Publish },
  data() {
    return {
      tableData: [],
      currentPage: 0,
      pageNum: 10,
      totalCount: 0,
      page: null,
      activeIndex: '1',
      dataType: 1,
      libShow: $libShow,
      env: 'test',
      applyCompensationEnv: 'test',
      uname: '',
      counts: [],

      edit: {
        visible: false,
        item: {
          Title: '',
          CreateUserName: '',
          CreateTime: 0,
          Summary: '',
          Comment: '',
          ConfigKey: '',
          AppId: 0,
          Status: 0,
          EnvEmpty: 0,
          CurrentUserName: ''
        },
        active: 0,
        ops: [],
        actions: [],
        bLastStep: false,
        opType: 0
      },
      isAllSelected: false, // 全选状态
      selectedRows: [], // 选中的行数据
      showAllConfigKeys: false,
      maxDisplayConfigKeys: 2,

      batchDialogVisible: false,
      batchDialogContent: '',
      batchConfigKeys: [],
      batchShowAllKeys: false,
      batchComment: '',
      batchIds: [],
      batchHasApplyCompensation: false,
      batchTotalAmount: 0
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.applyCompensationEnv = store.getters.env
    this.uname = store.getters.name || this.uname
    this.getList(1)
    console.log(1)
  },
  methods: {
    handleSelectAll(checked) {
      if (checked) {
        this.tableData.forEach(row => {
          if (row.Status === 1) {
            this.$refs.filterTable.toggleRowSelection(row, true)
          }
        })
      } else {
        this.$refs.filterTable.clearSelection()
      }
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
      console.log('选中的行数据:', this.selectedRows)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getStatusShow(status) {
      const names = { 1: '审核中', 2: '已通过', 3: '已拒绝', 4: '已取消' }
      return names[status]
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.getList(this.dataType)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList(this.dataType)
    },
    // 操作类函数
    getList(iType) {
      const $this = this
      request({
        url: '/reviewV2/list',
        method: 'get',
        data: {
          type: iType,
          PageNo: this.currentPage,
          PageNum: this.pageNum
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.tableData = response.Data.Data || []
          $this.currentPage = response.Data.CurrentPageNo
          $this.totalCount = response.Data.TotalCount
          $this.counts = response.Data.ExtData
        }
      })
    },
    handleView(row) {
      this.initFormData(row.ID)
      this.edit.visible = true
    },
    handleSelect(key) {
      this.dataType = key
      this.activeIndex = key
      this.getList(this.dataType)
    },
    handleDelete(row) {
      const $this = this
      this.$confirm('确定要删除吗？删除后需要手动将发布项回滚到测试状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/reviewV2/delete',
          method: 'post',
          data: {
            ID: row.ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            for (let i = 0; i < $this.tableData.length; i++) {
              if ($this.tableData[i].ID === row.ID) {
                $this.tableData.splice(i, 1)
              }
            }

            Message.success('修改记录状态成功！')
          }
        }).catch(() => {
          console.log('取消')
        })
      })
    },

    //* *************添加/修改相关*****************
    canEdit() {
      const users = this.edit.item.Reviewers
      return !(this.edit.item.Status !== 1 || !users.includes(this.uname))
    },
    viewDetail() {
      if (this.edit.item.Status === 2) {
        this.edit.opType = 10000
      } else {
        this.edit.opType = 5
      }
      this.$refs.publish.reviewDiffShow()
      // top.layer_show('确认发布内容','/configCompare/Config_diff.html?'+ $libUrl.GenUrlParams({keyID:keyID,opType:opType, ReviewID:id, Env:env}), 600, 700)
    },
    getPostData(iType) {
      console.log(this.env)
      return {
        ID: this.edit.item.ID,
        Pass: iType,
        Comment: this.edit.item.Comment,
        Env: this.env,
        ApplyCompensationEnv: this.applyCompensationEnv
      }
    },
    passReview(iType) {
      console.log(this.env)
      let succMsg = ''
      if (iType === 1) {
        succMsg = '审核已通过！'
        if (this.bLastStep) {
          this.$confirm('您是最后一位审核者，通过后将立即生效！<p>您确定要操作吗？</p>', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.env)
            this.doPassRequest(iType, succMsg)
          })
        }
      } else if (iType === 2) {
        succMsg = '申请已打回！'
      }
      this.doPassRequest(iType, succMsg)
    },
    checkBeLastStep(links) {
      for (let j = 0; j < links.length; j++) {
        if (!links[j].isPass) {
          if (j === links.length - 1) {
            return true
          }
          break
        }
      }
      return false
    },
    batchReview() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请至少选择一条记录进行批量审核！')
        return
      }

      let totalAmount = 0
      const Ids = []
      const configKeys = []
      const configKeySet = new Set()

      this.selectedRows.forEach(row => {
        const summary = row.Summary
        const match = summary.match(/申请金额:(\d+\.\d+)/)
        if (match) {
          totalAmount += parseFloat(match[1])
        }
        if (typeof row.ID === 'number') {
          Ids.push(row.ID)
        }
        if (row.ConfigKey && !configKeySet.has(row.ConfigKey)) {
          configKeySet.add(row.ConfigKey)
          configKeys.push(row.ConfigKey)
        }
      })

      this.batchIds = Ids
      this.batchTotalAmount = totalAmount
      this.batchConfigKeys = configKeys
      this.batchHasApplyCompensation = configKeys.includes('ApplyCompensation')
      this.batchShowAllKeys = false
      this.batchComment = ''

      this.updateBatchDialogContent()
      this.batchDialogVisible = true
    },
    updateBatchDialogContent() {
      let content = ''

      if (this.batchHasApplyCompensation) {
        content = `选中记录的申请金额总和为: ${this.batchTotalAmount.toFixed(2)}`
      }

      if (this.batchConfigKeys.length > 0) {
        if (content) {
          content += '<br/><br/>'
        }

        content += `共选择了 ${this.batchIds.length} 条记录进行批量审核`
        content += `<br/>涉及 ${this.batchConfigKeys.length} 个不同的配置类型`

        if (this.batchShowAllKeys) {
          content += `：<br/>${this.batchConfigKeys.map((key, index) => `${index + 1}. ${key}`).join('<br/>')}`
        } else {
          const displayKeys = this.batchConfigKeys.slice(0, this.maxDisplayConfigKeys)
          const moreCount = this.batchConfigKeys.length > this.maxDisplayConfigKeys ? this.batchConfigKeys.length - this.maxDisplayConfigKeys : 0
          if (this.batchConfigKeys.length <= this.maxDisplayConfigKeys) {
            content += `<br/>配置类型：${displayKeys.join(', ')}`
          } else {
            content += `<br/>前${this.maxDisplayConfigKeys}个配置类型：${displayKeys.join(', ')}...等${moreCount}个`
          }
        }
      }

      this.batchDialogContent = content
    },
    toggleShowAllKeys() {
      this.batchShowAllKeys = !this.batchShowAllKeys
      this.updateBatchDialogContent()
    },
    handleBatchConfirm() {
      if (!this.batchComment || this.batchComment.trim() === '') {
        this.$message.warning('审批意见不能为空')
        return
      }

      const comment = this.batchComment.trim()
      this.batchIds.forEach((id) => {
        this.edit.item.ID = id
        this.edit.item.Comment = comment
        this.doPassRequest(1, '审核已通过！')
      })

      this.batchDialogVisible = false
    },
    handleBatchCancel() {
      if (!this.batchComment || this.batchComment.trim() === '') {
        this.$message.warning('审批意见不能为空')
        return
      }

      const comment = this.batchComment.trim()
      this.batchIds.forEach((id) => {
        this.edit.item.ID = id
        this.edit.item.Comment = comment
        this.doPassRequest(2, '申请已打回！')
      })

      this.batchDialogVisible = false
    },
    doPassRequest(iType, succMsg) {
      const postData = this.getPostData(iType)
      if (!postData) return
      request({
        url: '/reviewV2/pass',
        method: 'post',
        data: postData,
        envEmpty: this.edit.item.EnvEmpty === 1
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('操作成功！')
          this.edit.visible = false
          this.getList(this.activeIndex)
        }
      })
    },
    initFormData(id) {
      const objs = this.tableData
      for (let i = 0; i < objs.length; i++) {
        if (objs[i].ID === id) {
          Object.assign(this.edit.item, objs[i])
          let links = objs[i].Reviewers
          if (links == null) {
            links = []
          }
          this.edit.ops = []
          for (let j = 0; j < links.length; j++) {
            this.edit.ops.push(links[j])
            if (links[j].isPass) {
              this.edit.active = j
            }
          }
          this.edit.bLastStep = this.checkBeLastStep(links)
          break
        }
      }
      this.initComment(id)
    },
    initComment(reviewID) {
      request({
        url: '/reviewV2/process',
        method: 'get',
        data: {
          Env: this.env,
          ReviewID: reviewID,
          ApplyCompensationEnv: this.applyCompensationEnv
        },
        envEmpty: this.edit.item.EnvEmpty === 1
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data
          if (objs != null) {
            this.edit.actions = []
            for (let i = objs.length - 1; i >= 0; i--) {
              const ob = {
                UserName: objs[i].UserName,
                Action: objs[i]['Result'] === 2 ? '拒绝' : '通过',
                CreateTime: this.formatTime(objs[i]['CreateTime'])
              }
              this.edit.actions.push(ob)
            }
          }
        }
      })
    }
  }
}
</script>
