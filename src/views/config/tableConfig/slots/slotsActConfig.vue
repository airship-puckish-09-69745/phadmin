<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="configKey" :check="configCheck" :env-empty="true" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable
          width="150"
        />
        <el-table-column
          prop="Gid"
          width="100"
        />
        <el-table-column
          prop="Name"
          label="名称"
          width="150"
        />
        <el-table-column
          prop="ModifyUser"
          label="最近修改"
          width="100"
        />
        <el-table-column
          prop="LastModify"
          label="修改时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑/查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="getEditTitle()"
      width="80%"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="100px" :inline="true" size="small">
        <el-form-item label="游戏Gid：">
          <el-input v-model="edit.item.Gid" size="mini" />
        </el-form-item>
        <el-form-item label="游戏名称：">
          <el-input v-model="edit.item.Name" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-col :span="4" :offset="6">

            <el-upload
              class="upload-demo"
              :action="actionURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :with-credentials="true"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="edit.fileList"
            >
              <el-button size="small" type="primary">导入数据</el-button>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-tabs type="border-card">
              <el-tab-pane v-for="(o,idx) in edit.showActs" :key="'tabAct' + idx" :label="'' + (idx)*10">
                <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                  <thead>
                  <th v-for="(_,k1) in o[0]">
                    <template v-if="k1==0">
                      步数 / 剧本
                    </template>
                    <template v-else>
                      <span @click="showChart(idx, k1)">{{ k1 }}</span>
                    </template>
                  </th>
                  </thead>
                  <tr v-for="row in o">
                    <td v-for="col in row">
                      {{ col }}
                    </td>
                  </tr>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="12">
            <el-row>
              <line-chart :chart-data="chartData" height="600px" />
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :offset="16">
            <el-button type="primary" size="mini" @click="save()">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
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

.table th {
  font-weight: bold;
}
</style>

<script>
import { $libDate, $libShow, $libType, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import TestMonthCard from '@/views/devTools/testMonthCard'
import LineChart from "@/views/playerManage/components/LineChart";

const filterMap = {}

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '单', Data: [] },
      { Name: '总', Data: [] }
    ]
  }
}

export default {
  components: { TestMonthCard, Compare, Publish,LineChart },
  data() {
    return {
      tableData: [],
      libShow: $libShow,
      env: 'test',
      game: 15,
      configKey: 'SlotsActConfigConfig',

      chartData: newChartData(),

      edit: {
        visible: false,
        fileName: '',
        fileList: [],
        editItem: '',
        isEdit: false,
        item: {
          Name: '',
          ID: 0,
          Gid: 0,
          Acts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        Configs: {
          BetListStr: '100, 200, 400, 1000, 2000, 10000, 20000, 40000, 100000',
          BetList: [100, 200, 400, 1000, 2000, 10000, 20000, 40000, 100000],
          LineCount: 25,
          RoomData: {
          }
        },
        isNewImport: false,
        showActs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }

    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    for (let i = 0; i < this.edit.Configs.BetList.length; i++) {
      this.$set(this.edit.Configs.RoomData, this.edit.Configs.BetList[i], [
        [1000, 5],
        [5000, 10],
        [10000, 20],
        [20000, 30],
        [30000, 40],
        [-1000, -5],
        [-51000, -10],
        [-10000, -20],
        [-20000, -30],
        [-30000, -40]
      ])
    }
    console.log(1)
  },
  methods: {
    showChart(k1, k2) {
      this.initChartData(this.edit.item.Actions[k1].rows[k2].cols)
    },
    initChartData(objs) {
      console.log(1)
      const chartData = newChartData()
      var total = 0
      for (let i=0;i<objs.length;i++) {
        const ob = objs[i]
        chartData.xData.push(i)
        chartData.yData[0].Data.push(ob)
        total += ob
        chartData.yData[1].Data.push(total)
      }
      this.chartData = chartData
    },
    betListChanged() {
      const items = this.edit.Configs.BetListStr.split(',')
      this.edit.Configs.BetList = []
      for (let i = 0; i < items.length; i++) {
        this.edit.Configs.BetList.push(parseInt(items[i]))
      }
    },
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
    handleEdit(ob) {
      this.initFormData(true, ob.ID)
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = {
        Gid: '',
        Name: '',
        Acts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
      this.edit.showActs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      this.edit.isNewImport = false
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/slotsActConfig/all',
        method: 'get',
        data: {
          Gid: this.Gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.length > 0) {
            this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
            this.handleCurrentChange(1)
          }
        }
      })
    },
    configCheck() {
      let rate = 0
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        rate += ob.Rate
      }
      if (rate > 100) {
        this.$alert('所有AI配置的分配占比不能超过100%，当前为：' + rate)
        return false
      }
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      const $this = this
      this.edit.fileList = []
      this.edit.isEdit = bEdit
      if (ID) {
        request({
          url: '/slotsActConfig/one',
          method: 'get',
          data: {
            ID: ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.edit.item = response.Data
            if(this.edit.item.Configs != "") {
              this.edit.Configs = JSON.parse(this.edit.item.Configs)
            }
            const items = response.Data.Actions
            const rets = []
            for (let i = 0; i < items.length; i++) {
              const rows = items[i].rows
              const newRow = []
              for (let j = 0; j < rows[0].cols.length; j++) {
                const newCols = [j + 1]
                for (let r = 0; r < rows.length; r++) {
                  newCols.push(rows[r].cols[j])
                }
                newRow.push(newCols)
              }
              rets.push(newRow)
            }
            $this.edit.showActs = rets
          }
        })
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/slotsActConfig/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'slotsActConfig/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      return {
        ID: this.edit.item.ID,
        Gid: this.edit.item.Gid,
        Name: this.edit.item.Name,
        Cfg: JSON.stringify(this.edit.Configs),
        Acts: this.edit.isNewImport ? JSON.stringify(this.edit.item.Acts) : ''
      }
    },
    save() {
      const $this = this
      if (this.edit.isEdit) {
        $this.editSave($this.getPostData())
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.isNewImport = false
      this.edit.visible = false
    },
    // excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.info('您需要先上传excel文件')
        return
      }
      const $this = this
      request({
        url: '/slotsActConfig/import/excel',
        method: 'post',
        data: {
          Gid: this.edit.item.Gid,
          FileName: this.edit.fileName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data
          $this.edit.item.Acts = items
          const rets = []
          for (let i = 0; i < items.length; i++) {
            const rows = items[i]
            const newRow = []
            for (let j = 0; j < rows[0].length; j++) {
              const newCols = [j + 1]
              for (let r = 0; r < rows.length; r++) {
                newCols.push(rows[r][j])
              }
              newRow.push(newCols)
            }
            rets.push(newRow)
          }
          $this.edit.showActs = rets
          $this.edit.isNewImport = true
          Message.success('导入数据成功！')
        }
      })
    },
    handleSuccess(rsp, file, fileList) {
      this.edit.fileName = rsp.Data
      this.importData()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    checkInt(value, min, max) {
      if (!$libType.IsInt(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的整数')
        return false
      }
    },

    checkFloat(value, min, max) {
      if (!$libType.IsFloat(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的数字')
        return false
      }
    }

  }
}
</script>
