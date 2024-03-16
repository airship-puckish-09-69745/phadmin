<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleImport()">导入兑奖码</el-button>
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
      >
        <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
        <el-table-column prop="Code" label="兑奖码" sortable="custom" />
        <el-table-column prop="CreateTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="RedeemTime" label="兑奖时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.RedeemTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="IP" label="玩家IP" />
        <el-table-column prop="IP" label="玩家ID">
          <template slot-scope="scope">
            {{ ipToInt(scope.row.IP) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          width="110"
        >
          <template v-slot:header>
            <el-select v-model="status" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in filterMap.Status" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ scope.row.RedeemTime > 0 ? '已兑奖' : '未兑奖' }}
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </div>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-form-item label="上传文件：" :required="true">
          <el-row>
            <el-col :span="16">
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :action="actionURL"
                :on-preview="handlePreview"
                :on-change="handleChange"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :auto-upload="false"
                :limit="1"
              >
                <el-icon class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处 或 <em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                  只能上传 csv/xls/xlsx 格式文件，且不超过2MB
                </div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row style="padding-top: 10px">
            <el-col :span="16">
              <el-button class="ml-3" type="success" @click="submitUpload">
                上传兑奖码数据
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'

const filterMap = {
  'Status': { 1: '已兑奖', 2: '未兑奖' }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libShow: $libShow,
      env: 'test',
      currentPage: 0,
      pageSize: 10,
      totalCount: 0,
      status: 0,
      filterMap: filterMap,

      edit: {
        visible: false,
        isEdit: false
      },

      AttrNames: {
        Code: '兑奖码',
        IP: '客户端IP',
        CreateTime: '创建时间',
        RedeemTime: '兑奖时间'
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
  },
  methods: {
    getEditTitle() {
      return '导入兑奖码'
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      if (ts === 0) {
        return ''
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    ipToInt(ip) {
      if (ip === '') {
        return ''
      }

      const octets = ip.split('.')
      if (octets.length !== 4) {
        return 'Invalid IP address'
      }

      let intIp = 0
      for (let i = 0; i < octets.length; i++) {
        const num = parseInt(octets[i], 10)
        if (isNaN(num) || num < 0 || num > 255) {
          return 'Invalid IP address segment'
        }
        intIp |= num << ((3 - i) * 8)
      }

      return intIp >>> 0
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleImport() {
      this.edit.visible = true
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      console.log(this.$refs.upload)
    },
    getList() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/basketballshoot/redeem/codes',
          Status: this.status,
          PageNo: this.currentPage,
          PageSize: this.pageSize
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data.Data || []
          this.currentPage = response.Data.CurrentPageNo
          this.totalCount = response.Data.TotalCount
        }
      })
    },
    beforeUpload(file) {
      const isCsv = file.type === 'text/csv'
      const isXls = file.type === 'xls'
      const isXlsx = file.type === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 2
      const isValidType = isCsv || isXls || isXlsx

      console.log('file.type:', file.type, ' isValidType:', isValidType)

      if (!isValidType) {
        this.$message.error('上传的文件只能是 csv/xls/xlsx 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过 2MB!')
        return false
      }
      return true
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      console.log(file)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleUploadSuccess(response, file, fileList) {
      const $this = this
      if (response.RetCode === 0) {
        const uploadedFilename = response.Data
        console.log('upload success:', uploadedFilename)

        request({
          url: '/other/basketballshoot/redeem/codes/import',
          method: 'post',
          data: {
            Env: this.env,
            Filename: uploadedFilename
          }
        }).then(response => {
          if (response.RetCode === 0) {
            $this.$message.success('兑奖码上传成功，数量为：' + response.Data.imported)
          }
          $this.$refs.upload.clearFiles()
          $this.edit.visible = false
          $this.getList()
        })
      }
    }
  }
}
</script>
