<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row v-if="form.type===1">
      <publish
        primary-key="ID"
        key-id="GroupMailConfig"
        :env-empty="false"
        :attr-names="AttrNames"
        :head-attrs="['ID','Title']"
      />
    </el-row>
    <el-row>
      <el-alert type="warning">
        <span style="color:red">1、*带链接的格式 ：[百度](https://www.baidu.com) </span>
      </el-alert>
    </el-row>

    <el-row>
      <el-form ref="form" :model="form" :inline="true" label-width="80px">
        <el-form-item label="邮件类型:">
          <el-radio-group v-model="form.type">
            <el-radio :label="2">按Uids</el-radio>
            <el-radio :label="1">全员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.type===2" label="Uid:">
          <el-input v-model="form.uid" placeholder="用户uid" />
        </el-form-item>

        <el-form-item label="时间:">
          <el-date-picker
            v-model="form.cTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
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
      <el-col :span="4" :offset="12">
        <el-button type="primary" size="mini" @click="drawer.visible=true">查询状态</el-button>
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
          prop="Titles"
          label="标题"
          min-width="200"
        >
          <template slot-scope="scope">
            {{ getTitleEN(scope.row.Titles) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="Uids"
          label="Uids"
          width="200"
        />
        <el-table-column
          prop="MailType"
          label="发送类型"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Type']" size="mini" @change="handleFilter">
              <el-option label="发送类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Type', scope.row.Type) }}
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
          label="最近操作"
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
            {{ getStatusShow(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SendTime"
          label="发送时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.SendTime > 0 ? formatTime(scope.row.SendTime) : "" }}
          </template>
        </el-table-column>
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
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <template v-if="scope.row.Type==1">
              <el-button
                v-if="scope.row.Status!=2"
                size="mini"
                type="success"
                icon="el-icon-upload2"
                @click="handlePrepare(scope.row)"
              >上线
              </el-button>
              <el-button
                v-if="scope.row.Status!=2"
                size="mini"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              />
              <el-button
                v-if="scope.row.Status==2"
                size="mini"
                type="danger"
                icon="el-icon-download"
                @click="handleOffline(scope.row)"
              >下线
              </el-button>
            </template>
            <template v-if="scope.row.Type==2">
              <el-button
                v-if="scope.row.Status==1"
                size="mini"
                type="warning"
                icon="el-icon-download"
                @click="handleSend(scope.row)"
              >发送
              </el-button>
              <el-button
                v-if="scope.row.Status==1"
                size="mini"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              />
            </template>
          </template>
        </el-table-column>
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
      :modal="false"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-form-item label="发送类型：" :required="true" prop="item.Type">
            <el-select v-model.number="edit.item.Type" placeholder="请选择">
              <el-option label="全员" :value="1" />
              <el-option label="按UIDS" :value="2" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item v-if="edit.item.Type==2" label="目标用户：" :required="true" prop="item.Uids" :rules="dataRule(true)">
          <el-col :span="20">
            <el-input
              v-model="edit.item.Uids"
              type="textarea"
              :autosize="{ minRows: 3}"
              placeholder="多个UID用，号隔开"
            />
          </el-col>
        </el-form-item>
        <el-row>
          <el-form-item label="标题：" :required="true">
            <el-row>
              <el-col :span="2">英文:</el-col>
              <el-col :span="16">
                <el-input v-model="edit.titles['en']" minlength="1" maxlength="50" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">印地:</el-col>
              <el-col :span="16">
                <el-input v-model="edit.titles['hi']" minlength="1" maxlength="50" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="内容：" :required="true">
            <el-row>
              <el-col :span="2">英文:</el-col>
              <el-col :span="16">
                <el-input
                  v-model="edit.contents['en']"
                  type="textarea"
                  :autosize="{ minRows: 3}"
                />
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="openTemplate">模板</el-button>
                <el-button size="mini" @click="appendCustomerText">客服链接</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">印地:</el-col>
              <el-col :span="16">
                <el-input
                  v-model="edit.contents['hi']"
                  type="textarea"
                  :autosize="{ minRows: 3}"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-form-item label="过期时间：">
          <el-date-picker
            v-model="edit.expireTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-row>
          <el-form-item label="附件：">
            <el-table
              :data="edit.item.ExtInfo2"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="Type"
                label="类型"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Type" placeholder="请选择">
                    <el-option label="金币" :value="1" />
                    <el-option label="Bonus" :value="2" />
                    <el-option label="月卡" :value="3" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="Count"
                label="数量"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Count" placeholder="输入数量" />
                </template>
              </el-table-column>
              <el-table-column
                prop="Img"
                label="选择图片"
              >
                <template slot-scope="scope">
                  <small v-if="scope.row.GoodsName">{{ scope.row.GoodsName }}</small>
                  <picker-img :source-type="scope.row.Type" :ext="scope.$index.toString()" @picker="pickerImage" />
                </template>
              </el-table-column>
              <el-table-column
                prop="Img"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" @click="delAttachment(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="success" size="medium" @click="addAttachment">添加附件</el-button>
              <el-button v-if="edit.item.Status!=100" type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-drawer
      title="邮件状态查看"
      :visible.sync="drawer.visible"
      direction="ltr"
      size="600px"
    >
      <el-row :gutter="20">
        <el-col :span="6" :offset="6">
          <el-input v-model="drawer.uid" size="mini" />
        </el-col>
        <el-col :span="12">
          <el-button size="mini" @click="searchUid">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="filterTable"
        :data="drawer.items"
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
          width="70"
        />
        <el-table-column
          prop="Title"
          label="标题"
          width="250"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="70"
        >
          <template slot-scope="scope">
            {{ scope.row.Status === 0 ? '未读' : '已读' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <el-drawer
      title="模板选择"
      :visible.sync="drawer2.visible"
      direction="ltr"
      size="600px"
    >
      <el-table
        :data="drawer2.items"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickTemplate"
      >
        <el-table-column
          prop="Type"
          label="分类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB2.FilterValueMap['Type']" size="mini" @change="handleFilter2">
              <el-option label="分类" :value="0" />
              <el-option v-for="(o,key) in clientDB2.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB2.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Subtype"
          label="子类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB2.FilterValueMap['Subtype']" size="mini" @change="handleFilter2">
              <el-option label="子类" :value="0" />
              <el-option v-for="(o,key) in clientDB2.FilterMap['Subtype']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB2.GetShowValue('Subtype', scope.row.Subtype) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Title"
          label="说明"
          width="300"
        />
      </el-table>
    </el-drawer>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { $libDate, $libLang, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import PickerImg from '@/components/PickerImg'

const filterMap = {
  'Status': { 1: '草稿', 2: '上架', 3: '废弃', 6: '下架' },
  'Type': { 1: '全员', 2: '按Uids' }
}

const filterMap2 = {
  'Type': { 1: '支付', 2: '提现', 3: '登录', 4: '注册', 5: '其他' },
  'Subtype': { 1: '其他' }
}

function newItem() {
  return {
    ID: '',
    Type: '',
    Platform: 0,
    Titles: '',
    Contents: '',
    ExpireTime: '',
    ExtInfo: '',
    ExtInfo2: [
      { Type: 1, Img: '', Count: '', GoodsId: 0, GoodsName: '' }
    ], // 解压之后数据
    Uids: '',
    MailType: 1,
    UserType: 1
  }
}

export default {
  components: { Compare, Publish, PickerImg },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      clientDB2: new ClientTableData([], 100, filterMap2),
      search: '',
      libShow: $libShow,
      env: 'test',

      form: {
        type: 2,
        uid: 0,
        cTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())]
      },
      pickerOptions: $libShow.DefaultDatePickerOptions(),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        titles: {},
        contents: { en: '', hi: '' },
        expireTime: ''
      },

      drawer: {
        visible: false,
        items: []
      },
      drawer2: {
        visible: false,
        items: []
      },

      AttrNames: {
        ID: '',
        Type: '发送类型',
        Titles: '标题',
        Contents: '内容',
        ExpireTime: '过期时间',
        Uids: '目标UIDS',
        ExtInfo: '0',
        Version: '0'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },

  methods: {
    appendCustomerText() {
      this.edit.contents['en'] += '[Contact Customer Service](http://www.openaihelp.com)'
      this.edit.contents['hi'] += '[ग्राहक सेवा से सम्पर्क करें](http://www.openaihelp.com)'
    },
    getTitleEN(str) {
      return $libLang.GetLangEN(str)
    },
    getStatusShow(ob) {
      if (ob.Type === 2) {
        if (ob.Status === 1) {
          return '未发送'
        } else if (ob.Status === 100) {
          return '已发送'
        } else {
          return '废弃'
        }
      } else {
        const names = { 1: '草稿', 2: '上线', 3: '废弃', 6: '下线' }
        return names[ob.Status]
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
    sendMailSucc(ob) {
      ob.status = 100
      request({
        url: '/mail/update/status',
        method: 'post',
        data: ob
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData({ ID: ob.ID, Status: 100 })
        }
      })
    },
    // 添加附件
    addAttachment() {
      this.edit.item.ExtInfo2.push({ Type: 1, Img: '', Count: '', GoodsId: 0, GoodsName: '' })
    },
    // 删除附件
    delAttachment(idx) {
      this.edit.item.ExtInfo2.splice(idx, 1)
    },
    pickerImage(data) {
      console.log('picker data', data)
      const idx = parseInt(data.Ext)
      this.edit.item.ExtInfo2[idx]['Img'] = data.Img
      this.edit.item.ExtInfo2[idx]['GoodsName'] = data.Remark
      this.edit.item.ExtInfo2[idx]['GoodsId'] = data.GoodsId ? parseInt(data.GoodsId) : 0

      console.log('extInfo2', this.edit.item.ExtInfo2)
    },
    encodeAttachment() {
      const data = []
      for (const i in this.edit.item.ExtInfo2) {
        let count = parseInt(this.edit.item.ExtInfo2[i].Count)
        // 金币和bonus放大1000倍
        if (this.edit.item.ExtInfo2[i].Type === 1 || this.edit.item.ExtInfo2[i].Type === 2) {
          count = count * 1000
        }
        data.push({
          Type: this.edit.item.ExtInfo2[i].Type,
          Count: count,
          Img: this.edit.item.ExtInfo2[i].Img,
          GoodsId: parseInt(this.edit.item.ExtInfo2[i].GoodsId),
          GoodsName: this.edit.item.ExtInfo2[i].GoodsName
        })
      }
      return JSON.stringify(data)
    },
    decodeAttachment() {
      if (!this.edit.item.ExtInfo) {
        return []
      }
      const arr = JSON.parse(this.edit.item.ExtInfo)
      const data = []
      for (const i in arr) {
        let count = parseInt(arr[i].Count)
        // 金币和bonus缩小1000倍
        if (arr[i].Type === 1 || arr[i].Type === 2) {
          count = count / 1000
        }
        data.push({
          Type: arr[i].Type,
          Count: count,
          Img: arr[i].Img,
          GoodsId: parseInt(arr[i].GoodsId),
          GoodsName: arr[i].GoodsName
        })
      }
      return data
    },
    checkAttachment() {
      // 检测数据是否正确
      let flag = true
      for (const i in this.edit.item.ExtInfo2) {
        if (parseInt(this.edit.item.ExtInfo2[i].Count) <= 0) {
          flag = false
          break
        }

        if (!this.edit.item.ExtInfo2[i].Img) {
          flag = false
          break
        }
        if (this.edit.item.ExtInfo2[i].Type === 3 && parseInt(this.edit.item.ExtInfo2[i].GoodsId) <= 0) {
          flag = false
          break
        }
      }

      return flag
    },
    handleSend(ob) {
      ob.Path = '/user/send/mail'
      ob.Env = this.env
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: ob
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('邮件发送成功！')
          this.sendMailSucc(ob)
        }
      })
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
      this.edit.item.ExtInfo2 = this.decodeAttachment()
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
      this.edit.item.ExtInfo2 = this.decodeAttachment()
      this.edit.item.Status = 1
    },
    searchUid() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/mail/info',
          Uid: this.drawer.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          $this.drawer.items = objs.reverse()
        }
      })
    },
    getList() {
      let bTime, eTime
      if (this.form.cTime) {
        bTime = Math.floor(this.form.cTime[0] / 1000)
        eTime = Math.floor(this.form.cTime[1] / 1000)
      }
      request({
        url: '/mail/all',
        method: 'get',
        data: {
          Uid: this.form.uid || 0,
          Type: this.form.type,
          BeginTime: bTime,
          EndTime: eTime
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/mail/update/status',
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
    clearFilter2() {
      this.clientDB2.ClearFilterMap()
      this.refreshShow2()
    },
    handleFilter2() {
      this.clientDB.FilterData()
      this.refreshShow2()
    },
    refreshShow2() {
      this.drawer2.items = this.clientDB2.GetCurrentPageData()
    },
    clickTemplate(row, column, event) {
      this.edit.contents['en'] = row.Content1
      this.edit.contents['hi'] = row.Content2
      this.edit.titles['en'] = row.Title1
      this.edit.titles['hi'] = row.Title2
      this.drawer2.visible = false
    },
    openTemplate() {
      const $this = this
      if (this.clientDB2.TotalData.length === 0) {
        request({
          url: '/mail/all/templates',
          method: 'get',
          data: {}
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            this.drawer2.items = objs
            this.clientDB2 = new ClientTableData(objs, 100, filterMap2, 'ID', -1)
            $this.drawer2.visible = true
          }
        })
      } else {
        this.drawer2.visible = true
      }
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.titles = JSON.parse(this.edit.item.Titles)
          this.edit.contents = JSON.parse(this.edit.item.Contents)
          this.edit.expireTime = this.edit.item.ExpireTime * 1000

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
        url: '/mail/create',
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
        url: 'mail/update',
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
      console.log('extInfo2:', this.edit.item.ExtInfo2)
      if (!this.checkAttachment()) {
        console.log('检测不通过')
        return
      }

      this.edit.item.ExtInfo = this.encodeAttachment()
      this.edit.item.Titles = JSON.stringify(this.edit.titles)
      this.edit.item.Contents = JSON.stringify(this.edit.contents)
      this.edit.item.ExpireTime = this.edit.expireTime / 1000
      console.log('postdata: ', this.edit.item)
      // return
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
