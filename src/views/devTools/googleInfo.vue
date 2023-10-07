<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="11">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="4" :offset="1">
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
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        :row-class-name="tableRowClassName"
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
          prop="Account"
          label="账号"
          width="250"
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
          prop="AppID"
          label="AppID"
          width="100"
        />
        <el-table-column
          prop="VPN"
          label="VPN说明"
          width="200"
        />
        <el-table-column
          prop="ServerIP"
          label="服务器IP"
          width="200"
        />
        <el-table-column
          prop="UpIP"
          label="上传IP"
          width="150"
        />
        <el-table-column
          prop="Country"
          label="国家"
          width="100"
        />
        <el-table-column
          prop="PassTime"
          label="通过时间"
          sortable="custom"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.PassTime) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="CreateUser"
          label="创建人"
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
      width="70%"
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
          <el-col :span="11">
            <el-form-item
              label="账号："
              :required="true"
              prop="item.Account"
              :rules="dataRule(true,{type:'s',range:'10'})"
            >
              <el-input v-if="!edit.isEdit" v-model="edit.item.Account" placeholder="请输入" />
              <span v-else>{{ edit.item.Account }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国家：">
              <el-input v-model="edit.item.Country" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button size="mini" @click="importVisible=true">导入</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="App名称："
              prop="item.AppName"
            >
              <el-input v-model="edit.item.AppName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="AppID："
              :required="true"
              prop="item.AppID"
            >
              <el-input v-model="edit.item.AppID" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="EMail："
              prop="item.Mail"
            >
              <el-input v-model="edit.item.Mail" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="手机："
              prop="item.Mobile"
            >
              <el-input v-model="edit.item.Mobile" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="手机拥有者："
              prop="item.MobileOwner"
            >
              <el-input v-model="edit.item.MobileOwner" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            label="地址："
            prop="item.Address"
          >
            <el-input v-model="edit.item.Address" placeholder="请输入" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="信用卡：" prop="item.CreditCard">
              <el-input v-model="edit.item.CreditCard" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="信用卡类型：" :required="true">
              <el-select v-model="edit.item.CreditCardType" placeholder="请选择">
                <el-option :value="0" label="未知" />
                <el-option :value="1" label="VISA" />
                <el-option :value="2" label="MASTER" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="信用卡持有者："
              prop="item.CreditCardUser"
            >
              <el-input v-model="edit.item.CreditCardUser" placeholder="持有人" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="信用卡说明："
              prop="item.CreditNote"
            >
              <el-input v-model="edit.item.CreditNote" placeholder="Note" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="上传IP：">
              <el-input v-model="edit.item.UpIP" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务器IP：">
              <el-input v-model="edit.item.ServerIP" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="VPN说明：">
              <el-input v-model="edit.item.VPN" placeholder="请输入" />
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
          <el-col :span="11">
            <el-form-item label="状态：" :required="true">
              <el-select v-model.number="edit.item.Status" placeholder="请选择">
                <el-option :value="1" label="新增" />
                <el-option :value="2" label="提审" />
                <el-option :value="3" label="审核通过" />
                <el-option :value="4" label="使用中" />
                <el-option :value="5" label="下架" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="补充描述：">
            <el-input v-model="edit.item.Description" type="textarea" autosize placeholder="Note" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备用码：">
            <el-input v-model="edit.item.BackCode" type="textarea" autosize placeholder="Note" />
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
    <compare ref="compare" :attr-names="attrNames" />
  </div>
</template>
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
import { $libDate, $libShow, ClientTableData, DataRule, ValidateVueItem } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'

function newItem() {
  return {
    ID: '',
    Account: '',
    Country: '',
    AppName: '',
    AppID: '',
    AppDes: '',
    VPN: '',
    UpIP: '',
    ServerIP: '',
    BackCode: '',
    Mail: '',
    Mobile: '',
    Description: '',
    Address: '',
    MobileOwner: '',
    CreditCard: '',
    CreditNote: '',
    CreditCardUser: '',
    CreditCardType: 0,
    DevAccount: '',
    DevMobile: '',
    DevMail: '',
    Status: 1,
    UpTime: new Date().getTime(),
    PassTime: new Date().getTime()
  }
}

const filterMap = {
  'Status': { 1: '新增', 2: '提审', 3: '审核通过', 4: '使用中', 5: '下架' }
}

export default {
  components: { Compare },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',

      edit: {
        visible: false,
        item: newItem(),
        upTime: new Date().getTime(),
        passTime: new Date().getTime(),
        relations: [],
        newRelation: {
          Type: 0,
          Data: ''
        },
        isEdit: false
      },

      importVisible: false,
      importTxt: '',

      attrNames: {
        Account: '开发者账号',
        Country: '国家',
        AppName: '应用名称',
        AppDes: '应用描述',
        Mail: '邮箱',
        Mobile: '电话',
        MobileOwner: '电话拥有者',
        Address: '地址',
        Description: '描述',
        CreditCard: '信用卡',
        CreditCardUser: '信用卡持有者',
        CreditCardType: '信用卡类型',
        CreditNote: '信用卡说明',
        Status: '状态',
        DevAccount: '关联开发',
        DevMobile: '关联开发电话',
        DevMail: '关联开发邮箱',
        PassTime: '过审时间',
        UpTime: '上传时间'

      }
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
    importContent() {
      const lines = this.importTxt.split('\n')
      const tMap = {}
      for (let i = 0; i < lines.length; i++) {
        const ss = lines[i].split('=')
        if (ss.length == 2) {
          tMap[ss[0]] = ss[1]
        }
      }

      this.edit.item.Account = tMap['account']
      this.edit.item.Country = tMap['country']
      this.edit.item.AppID = tMap['appid']
      this.edit.item.Mobile = tMap['mobile']
      this.edit.item.AppName = tMap['app_name']
      this.edit.item.MobileOwner = tMap['mobile_owner']
      this.edit.item.CreditCard = tMap['credit_no']
      this.edit.item.CreditCardUser = tMap['credit_owner']
      this.edit.item.ServerIP = tMap['vm_ip']
      this.edit.item.UpIP = tMap['up_ip']
      this.edit.item.VPN = tMap['vpn_note']
      this.edit.item.Description = tMap['description']

      this.importVisible = false
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.Status) {
        case 5:
          return 'fail-row'
        case 3:
        case 4:
          return 'success-row'
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
      this.clientDB.Search(this.search, ['Account', 'Mail', 'AppName', 'AppID', 'ServerIP', 'UpIP'])
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
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/google/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          this.clientDB = new ClientTableData(objs, 10, filterMap)
          this.handleCurrentChange(1)
        }
      })
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rummytable/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.upTime = this.edit.item.UpTime * 1000
          this.edit.passTime = this.edit.item.PassTime * 1000
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          } else {
            this.relations = []
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/google/create',
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
        url: 'google/update',
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
      return this.edit.item
    },
    checkData() {
      if (!ValidateVueItem(this.$refs['edit'])) return false
      return true
    },
    save() {
      if (!this.checkData()) return

      this.edit.item.UpTime = Math.floor(this.edit.upTime / 1000)
      this.edit.item.PassTime = Math.floor(this.edit.passTime / 1000)

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    }
  }
}
</script>
