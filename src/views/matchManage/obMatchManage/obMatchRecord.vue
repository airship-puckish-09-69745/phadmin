<template>
  <div id="app" class="page-container" style="padding: 10px">

    <div style="padding-top: 20px">

      <div style="margin-bottom:20px;color:red;">
        <el-button @click="toggleSelection()">生成选中表格数据</el-button>
        <el-button @click="toggleSelectionCancel()">取消选择</el-button>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border

        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="MatchTitle"
          label="赛事名称"
          width="200"
        />
        <el-table-column
          prop="MatchId"
          label="赛事ID"
          width="200"
        />
        <el-table-column
          prop="UpdateTime"
          label="入库时间"
          width="200"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.InPutTime) }}
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
              @click="handleMatchRecordDetail(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <el-dialog
      width="50%"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        :data="detalTableData"
        border
        style="width: 100%">
        <el-table-column
          prop="Uid"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="Nick"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="InPutTime"
          sortable
          label="玩牌时长">
        </el-table-column>
        <el-table-column
          prop="Scores"
          label="积分">
        </el-table-column>
      </el-table>
        <el-button style="margin-top:10px; " size="medium" type="primary" icon="el-icon-s-order" @click="downloadfile()">下载文件</el-button>
      </el-dialog>
  </div>
</template>
<script>
import { $libDate, $libShow, $libType, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import TestMonthCard from '@/views/devTools/testMonthCard'
import LineChart from '@/views/playerManage/components/LineChart'
import XLSX from 'xlsx';
import FileSaver from 'file-saver';


export default {
  components: {Compare },
  data() {
    return {
      tableData: [],
      detalTableData:[], //比赛记录详细数据
      downloadTableData:[], //下载表格数据格式
      multipleSelection: [],
      libShow: $libShow,

      edit: {
        visible: false,
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
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 操作类函数
    handleMatchRecordDetail(ob) {
      let matchIdList = []
      matchIdList.push(ob.MatchId)
      this.initFormData(matchIdList)
      this.edit.visible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/obgamelog'
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
    initFormData(matchIdList) {
      console.log(JSON.stringify(matchIdList))
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/match/obgameuserlog',
            MatchIdList: JSON.stringify(matchIdList)
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || {}
            this.detalTableData = objs.list
            //console.log("展示数据",this.detalTableData)
          }
        })
    },
    downloadfile(){
      this.downloadTableData = []
      for (let i = 0; i < this.detalTableData.length; i++) {
        this.downloadTableData.push({
          'Uid': this.detalTableData[i].Uid,
          'Nick':  this.detalTableData[i].Nick,
          'UseTime':  this.detalTableData[i].InPutTime,
          'Scores':  this.detalTableData[i].Scores,
        })
      }
      const worksheet = XLSX.utils.json_to_sheet(this.downloadTableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.ms-excel' });
      FileSaver.saveAs(blob, 'ob线下赛排名'); // 下载文件 文件名
    },
    toggleSelectionCancel(){
      this.$refs.multipleTable.clearSelection();
    },
    toggleSelection(){
      //console.log("输出勾选数据 :",this.multipleSelection)
      let matchIdList = []
      for(let i=0;i<this.multipleSelection.length;i++){
        matchIdList.push(this.multipleSelection[i].MatchId)
      }
      if(this.multipleSelection.length === 0 || this.multipleSelection.length > 10){
        Message.error("勾选的数据超过10条了")
        return
      }
      this.initFormData(matchIdList)
      this.edit.visible = true
    },
  }
}
</script>
