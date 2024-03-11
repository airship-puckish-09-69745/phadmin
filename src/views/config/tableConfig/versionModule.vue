<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" key-id="TexasVersionConfig" :env-empty="true" />
    </el-row>
    <br>
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item label="平台：">
          <el-select v-model="selectPlatform" placeholder="请选择">
            <el-option v-for="item in platformTypes" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块：">
          <el-select v-model="selectModule" placeholder="请选择">
            <el-option v-for="item in moduleTypes" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getVersionList">查询</el-button>
        </el-form-item>
        <br>
        <el-form-item>
          <div>
            <el-button type="success" @click="openCreated()">添加版本</el-button>
            <el-dialog :title="Tips" :visible.sync="dialogVisible" width="35%">
              <el-form ref="form" :model="obj" label-width="180px">
                <el-form-item label="平台">
                  <el-select v-model="obj.Platform">
                    <el-option
                      v-for="item in platformTypes"
                      :key="item.key"
                      :label="item.key"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="模块">
                  <el-select v-model="obj.Module" placeholder="请选择">
                    <el-option
                      v-for="item in moduleTypes"
                      :key="item.key"
                      :label="item.key"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="应用版本">
                  <el-input v-model="obj.AppVersion" />
                </el-form-item>
                <el-form-item label="资源版本">
                  <el-input v-model="obj.Version" />
                </el-form-item>
                <el-form-item label="更新标题">
                  <el-input v-model="obj.Title" />
                </el-form-item>
                <el-form-item label="	更新内容描述">
                  <el-input v-model="obj.Content" />
                </el-form-item>
                <el-form-item label="更新类型">
                  <el-select v-model="obj.UpdateType">
                    <el-option
                      v-for="item in updateTypes"
                      :key="item.key"
                      :label="item.key"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="禁用IP">
                  <el-input v-model="obj.IpForbidList" />
                </el-form-item>
                <el-form-item label="调试版本">
                  <el-input v-model="obj.DebugVersion" />
                </el-form-item>
                <el-form-item label="调试版本玩家列表">
                  <el-input v-model="obj.DebugUidList" />
                </el-form-item>
                <el-form-item label="灰度版本">
                  <el-input v-model="obj.GrayVersion" />
                </el-form-item>
                <el-form-item label="灰度版本玩家列表">
                  <el-input v-model="obj.GrayUidList" />
                </el-form-item>
                <el-form-item label="灰度版本内容">
                  <el-input v-model="obj.GrayVersionTitle" />
                </el-form-item>
                <el-form-item label="灰度版本标题">
                  <el-input v-model="obj.GrayVersionContent" />
                </el-form-item>
                <div>
                  <br>
                  说明：调试用户和尾号使英文状态下,分割<br>
                  检测更新逻辑：<br>
                  1）查找客户端传递的App版本是否配置，有则走配置App版本逻辑<br>
                  2）无特定版本查找App为0通用更新<br>
                </div>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column
          prop="AppVersion"
          label="APP版本"
          width="100%"
        />
        <el-table-column
          prop="UpdateType"
          label="更新方式"
          width="100%"
        />
        <el-table-column
          prop="Version"
          label="资源版本"
          width="100%"
        />
        <el-table-column
          prop="DebugVersion"
          label="调试版本"
          width="100%"
        />
        <el-table-column
          prop="FileSize"
          label="调试用户"
          width="100%"
        />
        <el-table-column
          prop="GrayVersion"
          label="灰度版本"
          width="100%"
        />
        <el-table-column
          prop="FileMd5"
          label="灰度尾号"
          width="100%"
        />
        <el-table-column
          prop="Title"
          label="更新标题"
          width="250"
        />
        <el-table-column
          prop="Content"
          label="更新内容"
          width="250"
        />
        <el-table-column
          prop="FileMd5"
          label="灰度更新内容"
          width="250"
        />
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="openUpdate(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="deleteVersion(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
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
    </el-row>
  </div>

</template>
<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
// import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput },
  data() {
    return {
      // appId: 0,
      packageInfo: [],
      env: 'dev',
      item: {
        Uid: 0,
        start: $libDate.GetDayBegin(new Date().getTime()),
        end: $libDate.GetDayEnd(new Date().getTime()),
        app: '',
        type: 0
      },
      totalData: {
        round: 0,
        betMoney: 0,
        winMoney: 0,
        normalMoney: 0,
        wildMoney: 0,
        scatterMoney: 0,
        jackpotMoney: 0
      },
      tableData: [],
      libShow: $libShow,
      totalCount: 100,
      currentPage: 1,
      pageNum: 20,
      platformTypes: [{ key: '安卓', value: 1 }, { key: 'IOS', value: 2 }],
      moduleTypes: [
        { key: '[0]大厅', value: 0 },
        { key: '[1]无限德州', value: 1 }
      ],
      updateTypes: [{ key: '强制更新', value: 0 }, { key: '可选更新', value: 1 }],
      showDetail: false,
      detailContent: '',
      detailPayLine: 0,
      selectPlatform: 1,
      selectModule: 0,
      openBox: true,
      dialogVisible: false,
      obj: {
        ID: 0,
        Platform: 0,
        Module: 0,
        AppVersion: 0,
        Version: 0,
        Title: '',
        Content: '',
        UpdateType: 0,
        DebugVersion: 0,
        GrayVersion: 0,
        DebugUidList: '',
        IpForbidList: '',
        GrayUidList: '',
        GrayVersionTitle: '',
        GrayVersionContent: '',
        Conditions: ''
      },
      Tips: '',
      pubItem: {
        keyID: 'TexasVersionConfig',
        active: 0
      },
      showPubPanel: false,
      needReview: true,
      isMy: false,
      currentUser: '',
      preTime: '',
      jumpUrl: '',
      props: ['pubItem', // 所有父页面转入的参数，需要在这儿声明
        'pre_test',
        'pre_pub'
      ]
    }
  },
  computed: {
    showBtn: function() {
      if (this.pubItem.active === 5) {
        return false
      }
      return this.isMy
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
    this.getVersionList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageNum = val
      this.getVersionList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getVersionList()
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getVersionList() {
      request({
        url: '/texasversion/list',
        method: 'get',
        data: {
          pageNum: this.pageNum,
          platform: this.selectPlatform,
          module: this.selectModule,
          version: 0,
          page: this.currentPage - 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data
        }
      })
    },
    deleteVersion(row) {
      this.Tips = '新增'
      console.log(row.ID)
      request({
        url: '/texasversion/delete',
        method: 'post',
        data: {
          ID: row.ID
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          Message.success('删除成功')
        }
      })
    },
    openUpdate(row) {
      console.log(row)
      this.Tips = '编辑'
      this.obj.AppVersion = row.AppVersion
      this.obj.Version = row.Version
      this.obj.Title = row.Title
      this.obj.Content = row.Content
      this.obj.UpdateType = row.UpdateType
      this.obj.DebugVersion = row.DebugVersion
      this.obj.GrayVersion = row.GrayVersion
      this.obj.Conditions = row.Conditions
      this.obj.Platform = row.Platform
      this.obj.Module = row.Module
      this.obj.DebugUidList = row.DebugUidList
      this.obj.IpForbidList = row.IpForbidList
      this.obj.GrayUidList = row.GrayUidList
      this.obj.GrayVersionTitle = row.GrayVersionTitle
      this.obj.GrayVersionContent = row.GrayVersionContent
      this.obj.ID = row.ID
      this.dialogVisible = true
    },
    updateVersion() {
      console.log(this.obj)
      this.dialogVisible = false
      request({
        url: '/texasversion/update',
        method: 'post',
        data: {
          ID: this.obj.ID,
          Platform: this.obj.Platform,
          Module: this.obj.Module,
          AppVersion: this.obj.AppVersion,
          Version: this.obj.Version,
          Title: this.obj.Title,
          Content: this.obj.Content,
          UpdateType: this.obj.UpdateType,
          DebugVersion: this.obj.DebugVersion,
          GrayVersion: this.obj.GrayVersion,
          DebugUidList: this.obj.DebugUidList,
          IpForbidList: this.obj.IpForbidList,
          GrayUidList: this.obj.GrayUidList,
          GrayVersionTitle: this.obj.GrayVersionTitle,
          GrayVersionContent: this.obj.GrayVersionContent
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          Message.success('更新成功')
        }
      })
    },
    createdVersion() {
      this.Tips = '新增'
      this.dialogVisible = false
      request({
        url: '/texasversion/create',
        method: 'post',
        data: {
          Platform: this.obj.Platform,
          Module: this.obj.Module,
          AppVersion: this.obj.AppVersion,
          Version: this.obj.Version,
          Title: this.obj.Title,
          Content: this.obj.Content,
          UpdateType: this.obj.UpdateType,
          DebugVersion: this.obj.DebugVersion,
          GrayVersion: this.obj.GrayVersion,
          DebugUidList: this.obj.DebugUidList,
          IpForbidList: this.obj.IpForbidList,
          GrayUidList: this.obj.GrayUidList,
          GrayVersionTitle: this.obj.GrayVersionTitle,
          GrayVersionContent: this.obj.GrayVersionContent
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          Message.success('创建成功')
        }
      })
    },
    submit() {
      if (this.Tips === '新增') {
        this.createdVersion()
      }
      if (this.Tips === '编辑') {
        this.updateVersion()
      }
      this.getVersionList()
    },
    release() {
      request({
        url: '/texasversion/review',
        method: 'get',
        data: {
          keyID: 'TexasVersionConfig'
        }
      }).then(response => {
        console.log('===', response)
        if (response.RetCode === 0) {
          Message.success('创建成功')
        }
      })
    },
    openCreated() {
      this.dialogVisible = true
      this.Tips = '新增'
      this.obj = {
        Platform: 1,
        Module: 0,
        AppVersion: 0,
        Version: 0,
        Title: '',
        Content: '',
        UpdateType: 0,
        DebugVersion: 0,
        GrayVersion: 0,
        DebugUidList: '',
        IpForbidList: '',
        GrayUidList: '',
        GrayVersionTitle: '',
        GrayVersionContent: '',
        Conditions: ''
      }
    }
  }
}

</script>
