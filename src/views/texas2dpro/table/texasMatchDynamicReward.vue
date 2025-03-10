<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="Id" key-id="TexasMatchDynamicRewardConfig" :env-empty="true" compare-type="Object" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="10">
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
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
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
          <el-form-item v-if="edit.isNewImport==true">
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
                <div class="scroll-area">
                  <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                    <thead>
                      <th v-for="item in showCololumnName(o)" style="width: 600px">
                        <span>{{ item }}</span>
                      </th>
                    </thead>
                    <tr v-for="row,_ in showRowData(o)">
                      <td>{{ row[0] }}</td>
                      <td v-for="(col,_) in row.slice(1)">
                        {{ col }}
                      </td>
                    </tr>
                  </table>
                </div>
              </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>

        </el-form>
      </el-dialog>
  </div>
</template>
<style>
.scroll-area {
  overflow: auto;
  max-width: 100%;
  max-height: calc(100vh - 300px);
}
.table {
  width: 2500px;
}
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


export default {
  components: {Compare, Publish, UploadExcelComponent },
  data() {
    return {
      tableData: [],
      libShow: $libShow,

      edit: {
        visible: false,
        fileName: '',
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
    showCololumnName(tableData) {
      var columnName = ['名次/人数',]
      for (var i = 0; i < tableData.length; i++) {
        columnName.push(String(tableData[i]['min_player']) + '-' + String(tableData[i]['max_player']))
      }
      return columnName
    },
    showRowData(tableData) {
      var rowName = []
      for (var i = 0; i < tableData.length; i++) {
        for (var j = 0; j < tableData[i]['rank_reward'].length; j++) {
          var sub_key = String(tableData[i]['rank_reward'][j]['min_rank']) + '-' + String(tableData[i]['rank_reward'][j]['max_rank'])
          if (tableData[i]['rank_reward'][j]['min_rank'] === tableData[i]['rank_reward'][j]['max_rank']) {
            sub_key = String(tableData[i]['rank_reward'][j]['min_rank'])
          }
          if (!rowName.includes(sub_key)) {
            rowName.push(sub_key)
          }
        }
      }
      var rawData = []
      for (var i = 0; i < rowName.length; i++) {
        var raw = [rowName[i], ]
        for (var j = 0; j < tableData.length; j++) {
          for (var k = 0; k < tableData[j]['rank_reward'].length; k++) {
            var sub_key = String(tableData[j]['rank_reward'][k]['min_rank'])
            if ( String(tableData[j]['rank_reward'][k]['min_rank']) !== String(tableData[j]['rank_reward'][k]['max_rank'])) {
              sub_key += '-' + String(tableData[j]['rank_reward'][k]['max_rank'])
            }
            if (sub_key === rowName[i]) {
              var reward_ratio = String(tableData[j]['rank_reward'][k]['reward_ratio'])
              raw.push(String((reward_ratio / 100).toFixed(2)) + '%')
            }
          }
        }
        rawData.push(raw)
      }
      return rawData
    },
    showData(arr) {
      return arr.val / 1000
    },

    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 分页处理
    // refreshShow() {
    //   this.tableData = this.clientDB.GetCurrentPageData()
    // },
    //
    // sortChange(ob) {
    //   this.clientDB.SortByProp(ob.prop, ob.order)
    //   this.refreshShow()
    // },
    // 操作类函数
    handleEdit(ob) {
      this.initFormData(true, ob.ID)
      this.edit.visible = true
    },
    handleCreate() {
      //判断总数是否超过最大限制
      if (this.tableData.length > 15) {
        this.errmsg('总模板数量已经超过最大限制！')
        return
      }
      this.edit.item = {
        Name: '',
        Acts: [],
        SheetNames: []
      }
      this.edit.showActs = []
      this.edit.isNewImport = true
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/texasmttreward/dynamic/reward/list',
        method: 'get',
        data: {
          Env: this.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.tableData = []
            this.tableData = objs.list
          }
        }
      })
    },
    configCheck() {
      if (this.edit.item.Name === '') {
        this.errmsg("请填写模板名称")
        return false
      }
      if (this.edit.showActs.length === 0) {
        this.errmsg("还没有上传表格数据")
        return false
      }
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '查看配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        request({
          url: '/texasmttreward/dynamic/reward/one',
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
            this.edit.showActs = []
            this.edit.showActs.push(rankData)
          }
        })
      }
    },
    createSave() {
      const postTabl = this.edit.showActs[0]
      request({
        url: '/texasmttreward/dynamic/reward/create',
        method: 'post',
        data: {
          ID: this.edit.item.ID,
          Name: this.edit.item.Name,
          Data: JSON.stringify(postTabl),
          SheetNames: this.edit.sheetNames[0]
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
        }
      })
    },
    save() {
      if (!this.configCheck()) {
        return
      }
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
      this.edit.sheetNames = results['SheetNames']
      const Sheets = results['Sheets']
      const rets = []

      const keys = this.parseKeys()

      for (const i in this.edit.sheetNames) {
        const name = this.edit.sheetNames[i]
        const sheet = Sheets[name]
        const result = []
        for (let j = 0; j < 300; j ++) {
          const rows = []
          for (let k = 0; k < keys.length; k++) {
            const sheetKey = keys[k] + j
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
      this.edit.showActs = rets
      this.edit.isNewImport = false
    },
    parseKeys() {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let res = []
      for (let i = 0; i < arr.length; i ++) {
        res.push(arr[i])
      }
      for (let i = 0; i < arr.length; i ++) {
        for (let j = 0; j < arr.length; j ++) {
          res.push(arr[i] + arr[j])
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
                'min_rank':key,
                'max_rank':key,
              })
            } else if (typeof (key) === 'string'){
              if (key.indexOf('-') > 0) {
                str = key.split('-')
                rankKey.push({
                  'min_rank':parseInt(str[0]),
                  'max_rank':parseInt(str[1])
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

      for (var i = 0; i < numKey.length; i++) {
        var min_player = numKey[i]
        var max_player = 99999
        if (i > 0 ){
          max_player = numKey[i-1] -1
        }

        var rank_reward = []
        for (var j=0; j < rankKey.length; j++) {
          if (isNaN(data[j+1][i+1])) {
            continue
          }
          rank_reward.push({
            min_rank: rankKey[j].min_rank,
            max_rank: rankKey[j].max_rank,
            reward_ratio: parseInt(data[j+1][i+1]* 100)
          })
        }

        rankData.push({
            min_player: min_player,
            max_player: max_player,
            rank_reward: rank_reward
          })
      }
      const rankStr = JSON.stringify(rankData)
      var size = new Blob([rankStr]).size/1024
      console.log(" 占用内存大小 ", size)
      return rankData;
    },
    hasSameElementInArray(checkTblEx) {
      var hashTbl = []
      for(var i in checkTblEx) {
        if (hashTbl[checkTblEx[i]]) {
          return true
        }
        hashTbl[checkTblEx[i]] = true
      }
      return false
    },
    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
  }
}
</script>
