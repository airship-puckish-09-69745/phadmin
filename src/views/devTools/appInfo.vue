<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish
        primary-key="ID"
        key-id="AppInfoConfig"
        :env-empty="true"
        :attr-names="AttrNames"
        :head-attrs="['ID','RelatedAppID','PackageName']"
      />
    </el-row>

    <el-row style="padding-top: 5px">
      <el-col :span="4">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="6" :offset="10">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          @input="searchChange"
        />
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="PackageName"
          label="包名"
          width="200"
        />
        <el-table-column
          prop="Platform"
          label="系列"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model.number="clientDB.FilterValueMap['Platform']" size="mini" @change="handleFilter">
              <el-option label="系列" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Platform']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Platform', scope.row.Platform) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="AppID"
          label="AppID"
          width="100"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Status', scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Note"
          label="说明"
          width="250"
        />
        <el-table-column
          prop="OnlineCheckStatus"
          label="原始/虚拟审核状态"
          width="150"
        >
          <template slot-scope="scope">
            <div v-html="getOnlineCheckStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="OnlineSourceStatus"
          label="线上来源检测"
          width="150"
        >
          <template slot-scope="scope">
            <div v-html="getOnlineSourceStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyUser"
          label="最后修改人"
          width="100"
        />
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
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
      width="800px"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row v-if="importVisible">
          <el-col :span="16">
            <el-form-item label="导入内容：">
            <el-input v-model="importTxt" placeholder="请输入" rows="8" type="textarea" />
            </el-form-item>
          </el-col>
          <el-button size="mini" type="primary" @click="importContent">确定</el-button>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="包名：" :required="true" prop="item.PackageName" :rules="dataRule(true,{type:'s',range:'1'})">
              <el-input v-model="edit.item.PackageName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="4">
          <el-button size="mini" @click="importVisible=true">导入</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="虚拟包名：">
              <el-input v-model="edit.item.VPkgName" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="APPID：" :required="true" prop="item.AppID" :rules="dataRule(true,{type:'s',range:'1'})">
              <el-input v-model="edit.item.AppID" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开发账号：" :required="true" prop="item.DevAccount" :rules="dataRule(true,{type:'s',range:'1'})">
              <el-input v-model="edit.item.DevAccount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="应用名：" :required="true" prop="item.AppName" :rules="dataRule(true,{type:'s',range:'1'})">
            <el-input v-model="edit.item.AppName" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="状态："
            :required="true"
            prop="item.Status"
          >
            <el-radio-group v-model="edit.item.Status">
              <el-radio :label="1">审核中</el-radio>
              <el-radio :label="2">通过未推广</el-radio>
              <el-radio :label="3">未通过下架</el-radio>
              <el-radio :label="4">推广中</el-radio>
              <el-radio :label="5">推广后下架</el-radio>

            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="edit.item.Status==1 || edit.item.Status == 2">
          <el-form-item
            label="审核阶段："
            :required="true"
            prop="item.Step"
          >
            <el-radio-group v-model="edit.item.Step">
              <el-radio :label="1">Google审核</el-radio>
              <el-radio :label="2">FB开户</el-radio>
              <el-radio :label="3">FB广告审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="检查来源："
            :required="true"
            prop="item.PromoteSourceStatus"
          >
            <el-radio-group v-model="edit.item.PromoteSourceStatus">
              <el-radio :label="1">要检查</el-radio>
              <el-radio :label="2">不检查</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="虚拟包检查来源："
            :required="true"
            prop="item.PromoteSourceStatus"
          >
            <el-radio-group v-model="edit.item.VSourceCheck">
              <el-radio :label="1">要检查</el-radio>
              <el-radio :label="2">不检查</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="FB：" :required="true" prop="item.FbID" :rules="dataRule(true,{type:'s',range:'1'})">
              <el-input v-model="edit.item.FbID" placeholder="请输入" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-form-item label="说明：" :required="true" prop="item.Note" :rules="dataRule(true,{type:'s',range:'1'})">
            <el-input v-model="edit.item.Note" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="EMail：" prop="item.EMail">
              <el-input v-model="edit.item.EMail" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码：" prop="item.EMailPassword">
              <el-input v-model="edit.item.EMailPassword" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="上传时间："
            >
              <el-date-picker
                v-model="edit.upTime"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="过审时间："
            >
              <el-date-picker
                v-model="edit.passTime"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="描述：" :required="true" prop="item.Description" :rules="dataRule(true,{type:'s',range:'1'})">
            <el-input v-model="edit.item.Description" type="textarea" autosize placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
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
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const filterMap = {
  'Status': { 1: '审核中', 2: '通过未推广', 3: '未通过下架', 4: '推广中', 5: '推广后下架' },
  // 'PromoteSourceStatus': { 1: '要检查', 2: '不检查' },
  'Platform': { 1: 'Android', 2: 'Galaxy' }
}

function newItem() {
  return {

    ID: '',
    PackageName: '',
    VPkgName: '',
    AppName: '',
    AppVer: '',
    UpTime: new Date().getTime(),
    PassTime: new Date().getTime(),
    Status: 1,
    PromoteSourceStatus: 1,
    DevAccount: '',
    Description: '0',
    EMailPassword: '',
    VSourceCheck: 1,
    Step: 1,
    FbID: '0',
    EMail: '',
    AppID: '0',
    Note: '0',
    Icon: '0',
    Pics: ''
  }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      onlineMap: {},

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        upTime: new Date().getTime(),
        pics: ['', '', '', ''],
        passTime: new Date().getTime()
      },

      importVisible: false,
      importTxt: '',

      AttrNames: {
        AppID: 'AppID',
        PackageName: '包名',
        AppName: '应用名',
        AppVer: '版本号',
        UpTime: '上传时间',
        PassTime: '通过时间',
        Status: '状态',
        PromoteSourceStatus: '检查来源',
        VSourceCheck: '虚拟包检查来源',
        Step: '审核阶段',
        FbID: 'FB',
        Note: '说明',
        EMail: 'Email',
        EMailPassword: 'Email密码',
        Icon: '图标',
        DevAccount: '开发账号'
      }
    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload/app/image'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    importContent() {
      const lines = this.importTxt.split("\n")
      const tMap = {}
      for(let i=0;i<lines.length;i++){
        const ss = lines[i].split("=")
        if(ss.length == 2){
          tMap[ss[0]] = ss[1]
        }
      }

      this.edit.item.PackageName = tMap['package']
      this.edit.item.VPkgName = tMap['vm_package']
      this.edit.item.AppID = tMap['appid']
      this.edit.item.FbID = tMap['fb_id']
      this.edit.item.AppName = tMap['app_name']
      this.importVisible = false
    },
    getOnlineCheckStatus(ob) {
      const pkg = this.onlineMap[ob.PackageName]
      let ret = ''
      if (pkg) {
        if (pkg.IsChecking) {
          ret += "<span style='color:red'>审核中</span>"
        } else {
          ret += "<span style='color:green'>推广中</span>"
        }
      } else {
        ret += "<span style='color:red'>无配置</span>"
      }
      ret += ' / '
      const vpkg = this.onlineMap[ob.VPkgName]
      if (vpkg) {
        if (vpkg.IsChecking) {
          ret += "<span style='color:red'>审核中</span>"
        } else {
          ret += "<span style='color:green'>推广中</span>"
        }
      } else {
        ret += "<span style='color:red'>无配置</span>"
      }
      return ret
    },
    getOnlineSourceStatus(ob) {
      const pkg = this.onlineMap[ob.PackageName]
      let ret = ''
      if (pkg) {
        if (pkg.IsPromoteSourceChecking) {
          ret += "<span style='color:red'>要检测</span>"
        } else {
          ret += "<span style='color:green'>不检测</span>"
        }
      } else {
        ret += "<span style='color:red'>无配置</span>"
      }
      ret += ' / '
      const vpkg = this.onlineMap[ob.VPkgName]
      if (vpkg) {
        if (vpkg.IsPromoteSourceChecking) {
          ret += "<span style='color:red'>要检测</span>"
        } else {
          ret += "<span style='color:green'>不检测</span>"
        }
      } else {
        ret += "<span style='color:red'>无配置</span>"
      }
      return ret
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.Status) {
        case 1:
          return 'warning-row'
        case 2:
        case 4:
          return 'success-row'
        default:
          return 'fail-row'
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
    searchChange() {
      this.clientDB.Search(this.search, ['AppName', 'PackageName', 'AppID', 'VPkgName'])
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
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getList() {
      const $this = this
      request({
        url: '/appinfo/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          // { 1: '审核中', 2: '通过未推广', 3: '未通过下架', 4: '推广中', 5: '推广后下架' }
          const sortInfo = ['', 1, 3, 5, 2, 4] // 定义排序规则
          objs.sort(function(a, b) {
            return sortInfo[a.Status] - sortInfo[b.Status]
          })
          for (let i = 0; i < objs.length; i++) {
            objs[i]['Platform'] = parseInt(objs[i].AppID) > 100000 ? 2 : 1
          }
          this.clientDB = new ClientTableData(objs, 10, filterMap)
          this.handleCurrentChange(1)
          $this.getOnlineInfo()
        }
      })
    },
    getOnlineInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/app/safe/status'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          for (const n in response.Data) {
            const ob = response.Data[n]
            $this.onlineMap[ob.PackageName] = ob
          }
        }
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    SuccUpload(res, file) {
      if (res.Data.Param === 'icon') {
        this.edit.item.Icon = res.Data.Path
      } else {
        this.edit.pics.splice(parseInt(res.Data.Param), 1, res.Data.Path)
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.upTime = this.edit.item.UpTime * 1000
          this.edit.passTime = this.edit.item.PassTime * 1000
          try {
            this.edit.pics = JSON.parse(this.edit.item.Pics)
          } catch (e) {
            this.edit.pics = ['', '', '', '']
          }
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/appinfo/create',
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
        url: '/appinfo/update',
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
    save() {
      this.edit.item.UpTime = Math.floor(this.edit.upTime / 1000)
      this.edit.item.PassTime = Math.floor(this.edit.passTime / 1000)
      this.edit.item.Pics = JSON.stringify(this.edit.pics)

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.edit.item)
          }
        })
      } else {
        this.createSave(this.edit.item)
      }
      this.edit.visible = false
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
