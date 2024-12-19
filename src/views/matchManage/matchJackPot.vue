<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="Id" key-id="MatchPrizeConfig" :env-empty="true"  compare-type="Object" />
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
          label="模板ID"
          sortable
          width="100"
        />
        <el-table-column
          prop="Name"
          label="模板名称"
          width="150"
        />
        <el-table-column
          prop="modifier"
          label="最近修改"
          width="100"
        />
        <el-table-column
          prop="update_time"
          label="修改时间"
          width="250"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >查看</el-button>
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

      <el-form ref="edit" :model="edit" label-width="180px" :inline="true" size="small">

        <el-row v-if="edit.isEdit==false">
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
                    <th>排名/人数</th>
                    <th v-for="(_,k1) in o[0]">
                      <span>{{ showCololumnName(k1) }}</span>
                    </th>
                    </thead>
                      <tr v-for="(row,k) in o[0]">
                        <td>{{showRowName(k,row)}}</td>
                        <td v-for="(col,_) in row">
                          {{ showData(col) }}
                        </td>
                      </tr>
                  </table>
                </el-tab-pane>
              </el-tabs>
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
import LineChart from '@/views/playerManage/components/LineChart'
import UploadExcelComponent from '@/components/UploadExcel/slotsAct.vue'

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
        sheetNames: [],
        rowName: [],
        columnName: [],
        rowData: [],
      }
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    showCololumnName(k) {
      if(this.edit.columnName[k]) {
        var len = this.edit.columnName.length
        if(this.edit.columnName[len-k-1]) {
          if (k === 0) {
            return this.edit.columnName[len - k - 1] + '+人'
          } else if (k === len-1){
            return this.edit.columnName[0] + '人'
          } else {
            var a = this.edit.columnName[len - k - 1]
            var b = this.edit.columnName[len-k]-1
            return a.toString() + '-' + b.toString() + '人'
          }
        }
      }
    },
    showRowName(k,arr){
      if (arr[0].minR === arr[0].maxR ) {
        return arr[0].minR.toString()
      } else {
        return arr[0].minR + '-' + arr[0].maxR
      }
    },
    showData(arr) {
      return arr.val/1000
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
      //判断总数是否超过最大限制
      if (this.tableData.length > 15) {
        this.errMsg('总模板数量已经超过最大限制！')
        return
      }
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
        url: '/matchprizeconfig/match/prize/list',
        method: 'get',
        data: {
          Env: this.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.tableData = objs.list
          }
        }
      })
    },
    configCheck() {
      return true
    },
    errMsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '查看配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      const $this = this
      this.edit.fileList = []
      this.edit.isEdit = bEdit
      if (ID) {
        request({
          url: '/matchprizeconfig/match/prize/one',
          method: 'get',
          data: {
            ID: ID,
            Env: this.env
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.edit.item = response.Data
            if (this.edit.item.SheetNames != '') {
              this.edit.sheetNames.push(this.edit.item.SheetNames)
            }
            var rankData = JSON.parse(this.edit.item.Data)
            const Tbl = []
            const retTbl = []
            for(var i = 0; i < rankData.length; i++) {
              if (Tbl[rankData[i].maxR] === undefined) {
                Tbl[rankData[i].maxR] = []
              }
              Tbl[rankData[i].maxR].push(rankData[i])
            }

            const columnTbl = []
            for (var i = 0; i < rankData.length; i++) {
              if (columnTbl[rankData[i].minRange] === undefined) {
                columnTbl[rankData[i].minRange] = []
              }
              columnTbl[rankData[i].minRange].push(rankData[i])
            }

            let index;
            for (index in Tbl) {
              this.edit.rowName.push(index)
              retTbl.push(Tbl[index])
            }
            for (index in columnTbl) {
              this.edit.columnName.push(index)
            }
            //console.log("组装数据 ",retTbl)
            const firstrets = []
            const secondrets = []
            firstrets.push(retTbl)
            secondrets.push(firstrets)
            this.edit.showActs = secondrets

            //console.log("数据2222  ",this.edit.showActs)
          }
        })
      }
    },
    createSave() {
      const postTabl = []
      for (var i = 0; i < this.edit.showActs[0].length;i++){
        for(var j = 0; j < this.edit.showActs[0][i].length; j++) {
          for(var k = 0; k < this.edit.showActs[0][i][j].length; k++){
            postTabl.push(this.edit.showActs[0][i][j][k])
          }
        }
      }
      request({
        url: '/matchprizeconfig/match/prize/create',
        method: 'post',
        data: {
          ID: this.edit.item.ID,
          Name: this.edit.item.Name,
          Data: JSON.stringify(postTabl),
          SheetNames: this.edit.sheetNames[0]
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    save() {
      this.createSave()
      this.edit.isNewImport = false
      this.edit.visible = false
      this.getList()
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
      //console.log('import result', results)

      this.edit.sheetNames = results['SheetNames']
      const Sheets = results['Sheets']

      const $this = this
      const rets = []

      const keys = this.parseKeys()

      for (const i in this.edit.sheetNames) {
        const name = this.edit.sheetNames[i]
        const sheet = Sheets[name]
        console.log(name, sheet)

        const result = []
        for (let j = 0; j < 300; j ++) {
          const rows = []
          for (let k = 0; k < keys.length; k ++) {
            const sheetKey = keys[k]+j
            if (sheetKey in sheet) {
              rows.push(sheet[sheetKey]['v'])
            } else {
              break
            }
          }

          if (rows.length > 0) {
            result.push(rows)
          }
        }
        rets.push(this.transformData(result))
      }
      $this.edit.showActs = rets
      //console.log("数据1111  ",this.edit.showActs)
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
                'minR':key,
                'maxR':key,
              })
            } else if (typeof (key) === 'string'){
              if (key.indexOf('-') > 0) {
                str = key.split('-')
                rankKey.push({
                  'minR':parseInt(str[0]),
                  'maxR':parseInt(str[1])
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
      console.log("numKey ",numKey)
      var totalNumKey = 0
      var maxRange = 0
      for (var i = 1; i < data.length; i++) {
        for (let j = 1; j < data[i].length; j++) {
          totalNumKey = numKey[j-1]
          if(j === 1){
            maxRange = 100000
          } else if (j > 1) {
            maxRange = numKey[j-1-1]
          }
          rankData.push({
            'minR':rankKey[i-1].minR,
            'maxR':rankKey[i-1].maxR,
            'val':data[i][j]*1000,
            'minRange':totalNumKey,
            'maxRange':maxRange-1,
          })
        }
      }
      //console.log("rankData ",rankData)
      const Tbl = []
      const retTbl = []
      for(var i = 0; i < rankData.length; i++) {
        if (Tbl[rankData[i].maxR] === undefined) {
          Tbl[rankData[i].maxR] = []
        }
        Tbl[rankData[i].maxR].push(rankData[i])
      }

      const columnTbl = []
      for(var i = 0; i < rankData.length; i++) {
        if (columnTbl[rankData[i].minRange] === undefined) {
          columnTbl[rankData[i].minRange] = []
        }
        columnTbl[rankData[i].minRange].push(rankData[i])
      }

      let index;
      for(index in Tbl) {
        this.edit.rowName.push(index)
        retTbl.push(Tbl[index])
      }

      for(index in columnTbl) {
        this.edit.columnName.push(index)
      }
      //console.log("组装数据 ",retTbl)
      //console.log("行标题 ",this.edit.columnName)
      //console.log("列标题 ",this.edit.rowName)
      const rankStr = JSON.stringify(retTbl)
      var size = new Blob([rankStr]).size/1024
      console.log(" 占用内存大小 ", size)
      const res = []
      res.push(retTbl)
      return res;
    }
  }
}
</script>
