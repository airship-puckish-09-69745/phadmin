<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="AiHelpConfig" :env-empty="true" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2" offset="18">
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
          prop="Keys"
          label="关键字"
          width="200"
        />
        <el-table-column
          prop="Answer1"
          label="答案"
          min-width="200"
        />
        <el-table-column
          prop="ActionType"
          label="动作类型"
          width="150"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['ActionType']" size="mini" @change="handleFilter">
              <el-option label="动作类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['ActionType']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('ActionType', scope.row.ActionType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyUser"
          label="修改人"
          width="100"
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
                <el-option label="验证码" :value="1" />
                <el-option label="充值" :value="2" />
                <el-option label="提现" :value="3" />
                <el-option label="其他" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="关键字："
            >
              <template v-for="(o,idx) in keys">
                <el-col :span="20">
                  <el-input v-model="keys[idx]" size="mini" />
                </el-col>
                <el-col :span="4">
                  <el-button v-if="idx==0" size="mini" icon="el-icon-plus" @click="addRow" />
                  <el-button v-if="idx!=0" size="mini" icon="el-icon-delete" @click="delRow(idx)" />
                </el-col>
              </template>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="答案（英文）：" :required="true">
              <el-input v-model="edit.item.Answer1" placeholder="请输入" type="textarea" autosize />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="答案（印地）：" :required="true">
              <el-input v-model="edit.item.Answer2" placeholder="请输入" type="textarea" autosize />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="下一步动作："
            >
              <el-select v-model.number="edit.item.ActionType" placeholder="请选择">
                <el-option label="直接回复" :value="1" />
                <el-option label="对应查询" :value="2" />
                <el-option label="查询后返回" :value="2" />
              </el-select>
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
import Publish from '@/components/Publish'

const filterMap = {
  'Type': { 1: '验证码', 2: '充值', 3: '提现', 4: '其他' },
  'ActionType': { 1: '直接回复', 2: '对应查询', 3: '查询后返回' }
}

function newItem() {
  return {
    ID: '',
    Type: 1,
    ActionType: 1,
    Answer1: '',
    Answer2: '',
    Keys: '',
    SubType: 0
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
      items: [],
      keys: [''],

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      AttrNames: {
        Sort: '排序',
        ItemID: '物品ID',
        Count: '数量',
        Name: '商品名称',
        Type: `商品类型`,
        Price: '价格',
        BonusRate: 'Bonus比例',
        PlatformItemID: '平台ID',
        IsRecommend: '商城推荐位',
        ShowScene: '展示场景',
        SceneRecommend: '场景推荐位'
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
    addRow() {
      this.keys.push('')
    },
    delRow(idx) {
      this.$delete(this.keys, idx)
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
        console.log('edit item', this.edit.item)
        console.log(this.edit.item.ShowScene2)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },

    getList() {
      request({
        url: '/aihelp/all',
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
        console.log('_data', _data)

        if (_data) {
          Object.assign(this.edit.item, _data)
          let items = []
          try {
            items = JSON.parse(this.edit.item.Keys)
          } catch (e) {
            console.log(this.edit.item.Keys)
          }
          this.keys = []
          for (let i = 0; i < items.length; i++) {
            this.keys.push(items[i].join(','))
          }
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          } else {
            this.edit.item = newItem()
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/aihelp/create',
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
        url: 'aihelp/update',
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
      const items = []
      for (let i = 0; i < this.keys.length; i++) {
        items.push(this.keys[i].split(','))
      }
      this.edit.item.Keys = JSON.stringify(items)
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
