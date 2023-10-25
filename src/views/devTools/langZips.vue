<template>
  <div id="app" class="page-container">

    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="width: 100%"
    >
      <el-table-column
        prop="Name"
        label="文件名"
        width="200"
      />
      <el-table-column
        prop="Name"
        label="下载地址"
        min-width="150"
      >
        <template slot-scope="scope">
          <span v-html="getUrl(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Size"
        label="文件大小"
        min-width="70"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.Size) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ModTime"
        label="生成时间"
        width="160"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.ModTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'

export default {
  data() {
    return {
      libShow: $libShow,
      tableData: [],
      project: ''
    }
  },
  computed: {
    canDelete() {
      return this.$store.state.user.name === 'howard'
    }
  },
  created() {
    this.project = this.$route.meta.platform
    this.getList()
    console.log(1)
  },
  methods: {
    getUrl(ob) {
      const url = $libShow.GetFullPath('/langRes/' + this.project + '/zip/' + ob.Name)
      return '<a href= "' + url + '">' + url + '</a>'
    },
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getList() {
      request({
        url: '/langRes/zips',
        method: 'get',
        data: {
          Project: this.project
        }
      }).then(response => {
        const objs = response.Data || {}
        this.tableData = objs
      })
    }
  }
}
</script>
