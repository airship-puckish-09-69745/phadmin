<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-col :span="2" :offset="20">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          @input="searchChange"
        />
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
          prop="AppId"
          label="App"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ getAppName(scope.row.AppId) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Name"
          label="名称"
          min-width="100"
        />
        <el-table-column
          prop="RedisSubkey"
          label="SubKey"
          min-width="100"
        />
        <el-table-column
          prop="Type"
          label="类型"
          width="100"
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
          prop="Description"
          label="描述"
          min-width="200"
        />
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
          width="120"
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
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="4" offset="4">
          <el-button type="primary" size="medium" @click="save">保存配置</el-button>
        </el-col>
        <el-col v-if="edit.isEdit" :span="4" offset="7">
          <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
        </el-col>
      </el-row>
      <el-form ref="form" :model="edit" label-width="150px" size="small" style="padding-top: 10px">
        <el-form-item label="APP：" prop="item.AppId">
          <el-col :span="20">
            <el-select v-model="edit.item.AppId" placeholder="请选择" :disabled="edit.isEdit">
              <el-option v-for="(o,idx) in appInfos" :key="idx" :label="o.Account" :value="o.ID" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="内容类型：" :required="true" prop="item.Type">
          <el-radio-group v-model="edit.item.Type" :disabled="edit.isEdit" @change="typeChange">
            <el-radio :label="1">普通字符串</el-radio>
            <el-radio :label="2">JSON字符串</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称：" :required="true" prop="item.Name" :rules="dataRule(true,{type:'s',range:'2-20'})">
          <el-col :span="20">
            <el-input v-model="edit.item.Name" placeholder="方便管理用" />
          </el-col>
        </el-form-item>
        <el-form-item
          label="描述："
          prop="item.Description"
          :required="true"
          :rules="dataRule(true,{type:'s',range:'2-300'})"
        >
          <el-col :span="20">
            <el-input
              v-model="edit.item.Description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8}"
              placeholder="物品描述 2-300个字符"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="Redis子键："
          :required="!edit.isEdit"
          prop="item.RedisSubkey"
          :rules="dataRule(!edit.isEdit,{type:'s',range:'2-50'})"
        >
          <el-col :span="20">
            <el-input v-if="!edit.isEdit" v-model="edit.item.RedisSubkey" />
            <span v-else>{{ edit.item.RedisSubkey }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="配置内容：" :required="true" prop="val" :rules="dataRule(true,{type:'s',range:'1'})">
          <el-col :span="20">
            <el-input
              v-if="edit.item.Type === 1"
              v-model="edit.item.Data"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
            />
            <json-editor-vue
                v-if="edit.item.Type === 2"
                v-model="edit.item.Data"
                :mode="edit.mode"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { ClientTableData, DataRule, $libDate, $libShow } from '@/utils/common'
import {getAllCustomizes, updateCustomize, createCustomize, publishCustomize} from '@/api/custome_configV2'
import store from '@/store'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue';
import Vue from 'vue'
import Publish from "@/components/Publish/index.vue";
import request from "@/utils/request";

Vue.use(VCA)

const filterMap = {
  Type: { 1: '普通字符串', 2: 'JSON字符串' }
}

function newItem() {
  return { ID: 0, Type: 2, Name: '', Description: '', Data: {}, RedisSubkey: '' }
}

export default {
  components: {Publish, JsonEditorVue, Compare },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      appInfos: [],

      edit: {
        visible: false,
        item: newItem(),
        val: '',
        vals: [],
        keyID: 136,
        opType: 1,
        isEdit: false,
        mode: 'text'
      },

      itemEnv: process.env.NODE_ENV, // 项目环境
      itemName: process.env.VUE_APP_PROJECT, // 项目名称
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    this.getAppInfos()
  },
  methods: {
    getDataRuleConfig() {
      if (this.edit.item.Subtype === 1) {
        return { type: 'n', range: '1' }
      } else {
        return { type: 's', range: '1' }
      }
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.edit.item.RedisSubkey
    },
    getAppName(appId) {
      const info = this.appInfos.find(o => o.ID === appId)
      return info ? info.Account : ''
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['Name', 'ID', 'RedisSubkey'])
      this.refreshShow()
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
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      this.initFormData(true, row.ID)
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getList() {
      getAllCustomizes(this.env).then(response => {
        const objs = response.Data || {}

        this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
        this.handleCurrentChange(1)
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

          if (this.edit.item.Data && this.edit.item.Type === 2) {
            try {
              this.edit.item.Data = JSON.parse(this.edit.item.Data)
            } catch (e) {
              console.log(this.edit.item.Data)
              Message.warning('内容解析为JSON格式失败')
            }
          }

          if (bEdit) {
            this.edit.item.Env = this.env
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    typeChange() {
      if (this.edit.item.Type === 1) {
        this.edit.item.Data = typeof this.edit.item.Data === 'string' ? this.edit.item.Data : JSON.stringify(this.edit.item.Data)
      } else if (this.edit.item.Type === 2) {
        this.edit.item.Data = typeof this.edit.item.Data === 'string' ? JSON.parse(this.edit.item.Data) : this.edit.item.Data
      }
    },
    test() {
      this.opType = 2
      this.publish()
    },
    pro() {
      this.opType = 6
      this.publish()
    },
    createSave(postData) {
      if (this.edit.item.Type === 2) {
        postData.Data = JSON.stringify(postData.Data)
      }
      createCustomize(postData).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    editSave(postData) {
      if (this.edit.item.Type === 2) {
        postData.Data = JSON.stringify(postData.Data)
      }
      updateCustomize(postData).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    save() {
      this.edit.item.Env = this.env
      const $this = this
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
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
    },
    publish() {
      publishCustomize(this.env, this.edit.item.ID, this.opType).then(response => {
        if (response.RetCode === 0) {
          Message.success('发布成功！')
        }
      })
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appInfos.push({
              ID: response.Data[i].ID,
              Account: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
  }
}
</script>
