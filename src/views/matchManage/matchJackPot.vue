<template>
  <div id="app" class="page-container" style="padding: 10px">

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
          prop="Name"
          label="剧本名称"
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
      <el-row>
        <publish primary-key="ID" :key-id="configKey2" :check="configCheck" :env-empty="true" />
      </el-row>

      <el-form ref="edit" :model="edit" label-width="100px" :inline="true" size="small">

        <el-row>
          <el-col :offset="9">
            <el-button type="primary" size="mini" @click="save()">保存</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="模板名称：">
            <el-input v-model="edit.item.Name" size="mini" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item>
            <upload-excel-component :on-success="importSuccess" :before-upload="checkImport" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-alert type="error" description="表格要求:表格第一行,要求只占用一行 2:符号-前后不能带空格 3:第一行表示人数浮动,由大到小递减,纵列第一列表示排名,由低到高递增" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card">
              <el-tab-pane v-for="(o,idx) in edit.showActs" :key="'tabAct' + idx" :label="edit.sheetNames[idx]">
                <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                  <thead>
                  <th v-for="(_,k1) in o[idx]">
                    <span>{{ k1 }}</span>
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
          <!--
          <el-col :span="12">
            <el-row>
              <line-chart :chart-data="chartData" height="600px" />
            </el-row>
          </el-col>
          -->
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
import LineChart from '@/views/playerManage/components/LineChart'
import UploadExcelComponent from '@/components/UploadExcel/slotsAct.vue'

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
  components: { TestMonthCard, Compare, Publish, LineChart, UploadExcelComponent },
  data() {
    return {
      tableData: [],
      libShow: $libShow,
      env: 'test',
      game: 15,
      configKey: 'SlotsActConfigConfigV2',

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
          Acts: [],
          SheetNames: []
        },
        Configs: {
        },
        isNewImport: false,
        showActs: [],
        sheetNames: []
      }

    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    configKey2() {
      return this.configKey + '_' + this.edit.item.ID
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    showChart(k1, k2) {
      this.initChartData(this.edit.item.Actions[k1].rows[k2].cols)
    },
    initChartData(objs) {
      const chartData = newChartData()
      var total = 0
      for (let i = 0; i < objs.length; i++) {
        const ob = objs[i]
        chartData.xData.push(i)
        chartData.yData[0].Data.push(ob)
        total += ob
        chartData.yData[1].Data.push(total)
      }
      this.chartData = chartData
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
        Name: '',
        Acts: [],
        SheetNames: []
      }
      this.edit.showActs = []
      this.edit.isNewImport = false
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/slotsActConfigV2/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.length > 0) {
            this.clientDB = new ClientTableData(objs, 50, filterMap, 'ID', -1)
            this.handleCurrentChange(1)
          }
        }
      })
    },
    configCheck() {
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
          url: '/slotsActConfigV2/one',
          method: 'get',
          data: {
            ID: ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.edit.item = response.Data
            if (this.edit.item.SheetNames != '') {
              this.edit.sheetNames = JSON.parse(this.edit.item.SheetNames)
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
        url: '/slotsActConfigV2/create',
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
        url: 'slotsActConfigV2/update',
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
      // return {
      //   ID: this.edit.item.ID,
      //   Name: this.edit.item.Name,
      //   Acts: this.edit.isNewImport ? JSON.stringify(this.edit.showActs) : '',
      //   SheetNames: JSON.stringify(this.edit.sheetNames)
      // }
    },
    save() {
      // const $this = this
      // if (this.edit.isEdit) {
      //   $this.editSave($this.getPostData())
      // } else {
      //   this.createSave(this.getPostData())
      // }
      // this.edit.isNewImport = false
      // this.edit.visible = false
    },
    checkImport(file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      if (isLt4M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 4m in size.',
        type: 'warning'
      })
      return false
    },
    importSuccess(results) {
      console.log('import result', results)

      this.edit.sheetNames = results['SheetNames']
      const Sheets = results['Sheets']

      const $this = this
      var rets = []

      const keys = this.parseKeys()
      console.log("sheetKey", keys)

      for (const i in this.edit.sheetNames) {
        const name = this.edit.sheetNames[i]
        const sheet = Sheets[name]

        const result = []
        for (let j = 0; j < 300; j ++) {
          const rows = []
          for (let k = 0; k < keys.length; k ++) {
            const sheetKey = keys[k]+j
            if (sheetKey in sheet) {
              //console.log("sheetKey j  ",sheetKey,j)
              rows.push(sheet[sheetKey]['v'])
            } else {
              break
            }
          }
          if (rows.length > 0) {
            result.push(rows)
          }
        }
        //console.log('111 result', result)
        rets = (this.transformData(result))
      }
      $this.edit.showActs = []
      var topNum = 0
      for (var i = 0; i < rets.length; i++ ){
        topNum = rets[i].maxRange
        console.log("topNum ", topNum)
        if ($this.edit.showActs[topNum] == undefined) {
          $this.edit.showActs[topNum] = []
        }
        this.edit.showActs[topNum].push(rets[i])

      }
      console.log("最后数据  ",this.edit.showActs)
      $this.edit.isNewImport = true
    },
    parseKeys() {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let res = []
      for (let i = 0; i < arr.length; i ++) {
        res.push(arr[i])
      }
      for (let i = 0; i < arr.length; i ++) {
        for (let j = 0; j < arr.length; j ++) {
          res.push(arr[i]+arr[j])
        }
      }
      console.log(res)
      return res;
    },

    //行代表人数浮动,列代表排名
    transformData(data) {
      //先就解析第一行 人数浮动 找到最低人数起始值
      const numKey = []
      var str = ''
      for (let i= 0; i < data[0].length; i++) {
        const key = data[0][i]
        if (typeof (key) === 'string'){
          if (key.indexOf('-') > 0) {
            str = key.split('-')
            numKey.push(parseInt(str[0]))
          } else if (key.indexOf('+') > 0) {
            str = key.split('+')
            numKey.push(parseInt(str[0]))

          }
        } else if (typeof (key) === 'number' && !isNaN(key)) {
          numKey.push(key)
        }
      }
      //console.log("hang key" , numKey)
      //解析第一列,排名浮动 找到排名区间起始值
      const rankKey = []
      const rankData = []
      str = ''
      let isFinish = false
      for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          /*第一列表示排名浮动区间*/
          const key = data[i][j]
          if (j === 0) {
            if (typeof (key) === 'number' && !isNaN(key)){
              rankKey.push({
                'minR': key,
                'maxR': key,
              })
            } else if (typeof (key) === 'string'){
              if (key.indexOf('-') > 0) {
                str = key.split('-')
                rankKey.push({
                  'minR': parseInt(str[0]),
                  'maxR': parseInt(str[1])
                })
              }
            }
            isFinish = true
            break
          }
          if (isFinish) {
            break
          }
        }
      }
      var totalNumKey = 0
      for (var i = 1; i < data.length; i++) {
        for (let j = 1; j < data[i].length; j++) {
          totalNumKey = numKey[j-1]
          rankData.push({
            'minR': rankKey[i-1].minR,
            'maxR': rankKey[i-1].maxR,
            'val': data[i][j],
            'maxRange': totalNumKey
          })
        }
      }
      const rankStr = JSON.stringify(rankData)
      var size = new Blob([rankStr]).size/1024
      console.log(" 占用内存大小 ", size)
      return rankData;
    }
  }
}
</script>
