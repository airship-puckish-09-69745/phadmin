<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="2" :offset="20">
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
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="AppID"
          label="AppID"
          width="100"
        />
        <el-table-column
          prop="Pkg"
          label="包名"
          width="300"
        />
        <el-table-column
          prop="Mail"
          label="邮件"
          width="300"
        />
        <el-table-column
          prop="LastCheck"
          label="最近检测"
          width="200"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastCheck) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.Status==1"
              type="success"
              effect="dark"
              size="mini"
            >
              正常
            </el-tag>
            <template v-else>
              <el-tag
                type="danger"
                effect="dark"
                size="mini"
              >
                封禁
              </el-tag>
              <el-button size="mini" @click="closeMail(scope.row)">关闭</el-button>
            </template>

          </template>
        </el-table-column>
        <el-table-column
          prop="MailTime"
          label="封禁时间"
          width="200"
        >
          <template v-if="scope.row.Status==2" slot-scope="scope">
            {{ formatTime(scope.row.MailTime) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'

export default {
  components: { Compare },
  data() {
    return {
      tableData: [],
      libShow: $libShow,
      env: 'test'
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    closeMail(ob) {
      request({
        url: '/appinfo/close/mail',
        method: 'post',
        data: {
          ID: ob.ID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('关闭邮件监测成功！')
        }
      })
    },
    getList() {
      request({
        url: '/appinfo/check/list',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          objs.sort(function(a, b) {
            return b.Status - a.Status
          })
          this.tableData = objs
        }
      })
    }
  }
}
</script>

