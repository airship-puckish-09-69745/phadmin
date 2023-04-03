<template>
  <div id="app" class="page-container" style="padding: 10px">
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
          prop="Sort"
          label="排序"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="Type"
          label="分类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Type']" size="mini" @change="handleFilter">
              <el-option label="分类" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Subtype"
          label="子类"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Subtype']" size="mini" @change="handleFilter">
              <el-option label="子类" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Subtype']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Subtype', scope.row.Subtype) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Title"
          label="说明"
          width="500"
        />
        <el-table-column
          prop="Title1"
          label="英文标题"
          width="500"
        />
        <el-table-column
          label="删除"
          width="500"
          column-key="op"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="delData(scope.row)">删除</el-button>
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
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="分类："
              :required="true"
              prop="item.Type"
            >
              <el-select v-model.number="edit.item.Type" placeholder="请选择">
                <el-option label="支付" :value="1" />
                <el-option label="提现" :value="2" />
                <el-option label="登录" :value="3" />
                <el-option label="注册" :value="4" />
                <el-option label="其他" :value="5" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="子类："
              :required="true"
              prop="item.Subtype"
            >
              <el-select v-model="edit.item.Subtype" placeholder="请选择">
                <el-option label="其他" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="说明：" :required="true" prop="item.Title" :rules="dataRule(true,{type:'s',range:'2'})">
              <el-input v-model="edit.item.Title" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="内容：" :required="true" prop="item.Content" :rules="dataRule(true,{type:'s',range:'2'})">
              <el-input v-model="edit.item.Content" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item
              label="英文标题："
              :required="true"
              prop="item.Title1"
              :rules="dataRule(true,{type:'s',range:'2'})"
            >
              <el-input v-model="edit.item.Title1" placeholder="请输入" minlength="1" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="英文内容："
              :required="true"
              prop="item.Content1"
              :rules="dataRule(true,{type:'s',range:'2'})"
            >
              <el-input v-model="edit.item.Content1" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="印地标题："
              :required="true"
              prop="item.Title2"
              :rules="dataRule(true,{type:'s',range:'2'})"
            >
              <el-input v-model="edit.item.Title2" placeholder="请输入" minlength="1" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="印地内容："
              :required="true"
              prop="item.Content2"
              :rules="dataRule(true,{type:'s',range:'2'})"
            >
              <el-input v-model="edit.item.Content2" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="排序："
            >
              <el-input v-model.number="edit.item.Sort" placeholder="从大到小排序" />
            </el-form-item>
          </el-col>
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

const filterMap = {
  'Type': { 1: '支付', 2: '提现', 3: '登录', 4: '注册', 5: '其他' },
  'Subtype': { 1: '其他' }
}

function newItem() {
  return {
    ID: '',
    Type: '',
    Subtype: 1,
    Title: '',
    Title1: '',
    Title2: '',
    Content: '',
    Content1: '',
    Content2: '',
    Sort: ''
  }
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
        isEdit: false
      },

      AttrNames: {
        Type: '分类',
        Subtype: '子类',
        Title: '说明',
        Title1: '标题（英）',
        Title2: '标题（印地）',
        Content: '内容',
        Content1: '内容（英）',
        Content2: '内容（印地）',
        Sort: '排序'
      }
    }
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

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    delData(ob) {
      this.$confirm('确定要删除此记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/mail/delete/template',
          method: 'post',
          data: {
            ID: ob.ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.clientDB.DelData(ob.ID)
            this.handleCurrentChange(1)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getList() {
      request({
        url: '/mail/all/templates',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
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
        url: '/mail/create/template',
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
        url: 'mail/update/template',
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

