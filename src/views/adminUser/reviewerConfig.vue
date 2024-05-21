<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-form :inline="true">
        <el-form-item >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加审批项
        </el-button>
        </el-form-item>
          <el-form-item label="名称查询">
            <el-input v-model="queryKey" @input="queryKeyInput"></el-input>
          </el-form-item>
        </el-form>
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="ConfigKey"
          label="审批项"
          sortable
          min-width="200"
        />
        <el-table-column
          prop="Name"
          label="名称"
          width="150"
        />
        <el-table-column
          prop="Type"
          label="类型"
          width="250"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Type']" size="mini" @change="handleFilter">
              <el-option label="类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="LastOperatorType"
          label="最后审批类型"
          width="250"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['LastOperatorType']" size="mini" @change="handleFilter">
              <el-option label="最后审批类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['LastOperatorType']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('LastOperatorType', scope.row.LastOperatorType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Reviewers"
          label="最后审批人"
          width="100"
        />
        <el-table-column
          prop="ModifyUser"
          label="最近修改"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>最近修改时间: {{ formatTime(scope.row.LastModify) }}</p>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.ModifyUser }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.ConfigStatus!=2"
              size="mini"
              type="success"
              @click="handleView(scope.row.ID)"
            >操作
            </el-button>
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
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" onkeydown="if(event.keyCode==13){return false;}" :model="edit" label-width="150px" size="small">
        <el-form-item label="配置项：" :required="true">
          <el-col :span="20">
            <el-input v-model="edit.item.ConfigKey" />
          </el-col>
        </el-form-item>
        <el-form-item label="名称：" :required="true">
          <el-col :span="20">
            <el-input v-model="edit.item.Name" />
          </el-col>
        </el-form-item>
        <el-form-item label="上级审核类型：" :required="true">
          <el-select v-model.number="edit.item.Type" placeholder="请选择">
            <el-option label="无上级审核" :value="1" />
            <el-option label="上级审核" :value="2" />
            <el-option label="上两级审核" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="最终审核人：" :required="true">
          <el-radio-group v-model="edit.item.LastOperatorType">
            <el-radio :label="1">无限制</el-radio>
            <el-radio :label="2">申请人自己</el-radio>
            <el-radio :label="3">自定义审核人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义审核人：">
          <el-tag
            v-for="tag in edit.reviewers"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            v-model="edit.reviewerInput"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
            @select="handleInputConfirm"
          />
        </el-form-item>

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
<style>
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
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import qs from "qs";

const filterMap = {
  Type: { 1: '无上级审核', 2: '上级审核', 3: '上两级审核' },
  LastOperatorType: { 1: '无限制', 2: '申请人自己', 3: '自定义审核人' }
}

function newItem() {
  return { ID: 0, Name: '', ConfigKey: '', Type: 1, LastOperatorType: 1, Reviewers: '' }
}

export default {
  components: { Compare },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        reviewers: [],
        reviewerInput: '',
        users: []
      },
      queryKey: '',
      AttrNames: {
        Name: '名称',
        ConfigKey: '配置项',
        Type: '审核类型',
        LastOperatorType: '最终审核类型',
        Reviewers: '最终审核人'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    this.initUsers()
    console.log(1)
  },
  methods: {
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
    queryKeyInput(){
       this.clientDB.Search(this.queryKey,['Name','ConfigKey'])
      this.refreshShow()
    },
    // 操作类函数
    getList() {
      const $this = this
      request({
        url: '/reviewerconfig/all',
        method: 'get',
        data: {
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          $this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          $this.handleCurrentChange(1)
        }
      })
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleView(id) {
      this.initFormData(true, id)
      this.edit.visible = true
    },

    //* *************添加/修改相关*****************
    handleClose(tag) {
      this.edit.reviewers.splice(this.edit.reviewers.indexOf(tag), 1)
    },
    duplicateUser(name) {
      for (let i = 0; i < this.edit.reviewers.length; i++) {
        if (name === this.edit.reviewers[i]) {
          return true
        }
      }
      return false
    },
    validUser(name) {
      for (let i = 0; i < this.edit.users.length; i++) {
        if (name === this.edit.users[i].value) {
          if (this.duplicateUser(name)) {
            Message.warning('审核人已经在审核链条上')
            return false
          }
          return true
        }
      }
      return false
    },
    handleInputConfirm() {
      const inputValue = this.edit.reviewerInput
      if (this.validUser(inputValue)) {
        this.edit.reviewers.push(inputValue)
      }
      this.edit.reviewerInput = ''
    },
    querySearch(queryString, cb) {
      const users = this.edit.users
      const results = queryString ? users.filter(this.createFilter(queryString)) : users
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (user) => {
        return (user.Name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initUsers() {
      const $this = this
      request({
        url: '/adminuser/users',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const users = response.Data.Users
          for (let i = 0; i < users.length; i++) {
            $this.edit.users.push({ value: users[i].Name, user: users[i] })
          }
        }
      })
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit

      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          if (this.edit.item.Reviewers !== '') {
            this.edit.reviewers = this.edit.item.Reviewers.split(',')
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
        url: '/reviewerconfig/create',
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
        url: 'reviewerconfig/update',
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
      return true
    },
    save() {
      if (this.edit.item.LastOperatorType === 3 && this.edit.reviewers.length === 0) {
        Message.warning('请输入自定义最后审核人')
        return null
      }
      this.edit.item.Reviewers = this.edit.reviewers.join(',')

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
