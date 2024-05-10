<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row style="margin-top: 30px">
      <el-col :span="1">
        <el-button size="mini" type="primary" @click="editData()">修改</el-button>
      </el-col>
      <el-col :span="18">
        <el-button size="mini" type="primary" @click="saveData()">保存</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
    </el-row>
    <el-table ref="tb" :data="rowData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'2px'}" :cell-style="DefaultTableCell" style="width: 100%">
      <el-table-column v-for="item in columnName" :key="item.prop" :prop="item.prop" width="120%" align="center">
        <template slot="header">
          {{ item.label }}
        </template>
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model="scope.row[item.label]" />
          <p v-else>{{ scope.row[item.label] }}</p>
        </template>

      </el-table-column>
    </el-table>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { $libShow } from '@/utils/common'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  components: { Compare, Publish },
  data() {
    return {
      libShow: $libShow,
      form: {},
      subKey: 'texasMttAwardConfig',
      isEdit: false,
      columnLabel: '',
      columnPropIndex: 3,
      columnName: [],
      rowName: [],
      rowData: [],
      checkedDetail: [],
      tableData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    DefaultTableCell() {
      return 'padding:0px;font-family: "Microsoft Yahei";margin:0px; font-size: 12px;'
    },
    praseData() {
      this.showCololumnName()
      this.showRowName()
      this.praseRowData()
    },
    showCololumnName() {
      this.columnName = [
        {
          label: '名次/人数',
          prop: 'rank'
        }
      ]
      var dataList = this.tableData
      for (var i = 0; i < dataList.length; i++) {
        var item = {
          label: String(dataList[i]['min_player']) + '-' + String(dataList[i]['max_player']) + '人'
        }
        this.columnName.push(item)
      }
      console.log(this.columnName)
    },
    showRowName() {
      this.rowName = []
      var dataList = this.tableData
      for (var i = 0; i < dataList.length; i++) {
        for (var j = 0; j < dataList[i]['rank_reward'].length; j++) {
          var sub_key = String(dataList[i]['rank_reward'][j]['min_rank']) + 'th -' + String(dataList[i]['rank_reward'][j]['max_rank']) + 'th'
          if (dataList[i]['rank_reward'][j]['min_rank'] === dataList[i]['rank_reward'][j]['max_rank']) {
            sub_key = String(dataList[i]['rank_reward'][j]['min_rank']) + 'th'
          }
          if (!this.rowName.includes(sub_key)) {
            this.rowName.push(sub_key)
          }
        }
      }
      console.log(this.rowName)
    },
    praseRowData() {
      this.rowData = []
      for (var i = 0; i < this.rowName.length; i++) {
        var row = {}
        for (var j = 0; j < this.columnName.length; j++) {
          if (this.columnName[j]['prop'] === 'rank') {
            row[this.columnName[j]['label']] = this.rowName[i]
          } else {
            row[this.columnName[j]['label']] = this.getRatio(this.columnName[j]['label'], this.rowName[i])
          }
        }
        this.rowData.push(row)
      }
      console.log(this.rowData)
    },
    formTableData() {
      this.tableData = []
      for (var i = 0; i < this.columnName.length; i++) {
        if (this.columnName[i]['prop'] === 'rank') {
          continue
        }
        var players = this.columnName[i]['label'].replaceAll('人', '').split('-')
        var min_player = Number(players[0])
        var max_player = Number(players[1])

        var rank_reward = []
        for (var j = 0; j < this.columnName.length; j++) {
          var ranks = this.rowData[j]['名次/人数'].replaceAll('th', '').split('-')
          var min_rank = Number(ranks[0])
          var max_rank = Number(ranks[0])
          if (ranks.length > 1) {
            max_rank = Number(ranks[1])
          }

          var ratio = this.rowData[j][this.columnName[i]['label']]
          if (ratio !== '') {
            rank_reward.push({
              min_rank: min_rank,
              max_rank: max_rank,
              reward_ratio: Math.round(Number(ratio.replaceAll('%', '')) * 100)
            })
          }
        }
        if (rank_reward.length > 0) {
          this.tableData.push({
            min_player: min_player,
            max_player: max_player,
            rank_reward: rank_reward
          })
        }
      }
    },
    getRatio(columnName, rowName) {
      var dataList = this.tableData
      for (var i = 0; i < dataList.length; i++) {
        var key = String(dataList[i]['min_player']) + '-' + String(dataList[i]['max_player']) + '人'
        if (columnName === key) {
          for (var j = 0; j < dataList[i]['rank_reward'].length; j++) {
            var sub_key = String(dataList[i]['rank_reward'][j]['min_rank']) + 'th -' + String(dataList[i]['rank_reward'][j]['max_rank']) + 'th'
            if (dataList[i]['rank_reward'][j]['min_rank'] === dataList[i]['rank_reward'][j]['max_rank']) {
              sub_key = String(dataList[i]['rank_reward'][j]['min_rank']) + 'th'
            }
            if (sub_key === rowName) {
              var reward_ratio = String(dataList[i]['rank_reward'][j]['reward_ratio'])
              return String((reward_ratio / 100).toFixed(2)) + '%'
            }
          }
        }
      }
      return ''
    },
    addRows() {
    },
    editData() {
      this.isEdit = true
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          console.log(response.Data)
          const v = JSON.parse($this.form.Data)
          this.tableData = v
          this.praseData()
        }
      })
    },
    saveData() {
      this.isEdit = false
      this.formTableData()

      const postData = JSON.parse(JSON.stringify(this.tableData))
      this.form.Data = JSON.stringify(postData)
      console.log(this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
