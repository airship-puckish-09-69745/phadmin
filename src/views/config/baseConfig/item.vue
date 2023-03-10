<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="ItemConfig" :env-empty="true" :attr-names="AttrNames" :head-attrs="['ID','Name']" />
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
        <TableSort :items="dragItems" :on-success="sortSucc" post-url="/item/update/sort" />
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
          label="Sort"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="ItemKey"
          label="ItemKey"
          width="100"
        />
        <el-table-column
          prop="Name"
          label="名称"
          width="150"
        />
        <el-table-column
          prop="ItemType"
          label="类型"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['ItemType']" size="mini" @change="handleFilter">
              <el-option label="类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['ItemType']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('ItemType', scope.row.ItemType) }}
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
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter" >
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Status', scope.row.Status) }}
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
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              type="success"
              icon="el-icon-upload2"
              @click="handlePrepare(scope.row)"
            >上架
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
            >下架
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
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称：" :required="true" prop="item.Name" :rules="dataRule(true,{type:'s',range:'2'})">
              <el-input v-model="edit.item.Name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="ItemKey："
              :required="true"
              prop="item.ItemKey"
              :rules="dataRule(true,{type:'s',range:'2'})"
            >
              <el-input v-model="edit.item.ItemKey" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="类型："
              :required="true"
              prop="item.ItemType"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-select v-if="!edit.isEdit" v-model.number="edit.item.ItemType" placeholder="请选择">
                <el-option label="月卡" :value="10" />
                <el-option label="签到金币" :value="12" />
              </el-select>
              <span v-else>
                {{ clientDB.GetShowValue('ItemType', edit.item.ItemType) }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最低版本支支持："
              :required="true"
              prop="item.VersionLower"
            >
              <el-input v-model="edit.item.VersionLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="edit.item.ItemType===10">
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="立刻获得："
                :required="true"
                prop="monthCard.Origin"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.monthCard.Origin" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="每天领取："
                :required="true"
                prop="monthCard.EveryDay"
                :rules="dataRule(true,{type:'n',range:'1'})"
              >
                <el-input v-model.number="edit.monthCard.EveryDay" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="领取天数："
                :required="true"
                prop="monthCard.Days"
                :rules="dataRule(true,{type:'n',range:'1'})"
              >
                <el-input v-model.number="edit.monthCard.Days" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="描述："
              prop="item.Description"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.Description" placeholder="请输入" />
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
import TableSort from '@/components/TableSort'

const filterMap = {
  'Status': { 1: '草稿', 2: '上架', 3: '废弃', 6: '下架' },
  'ItemType': { 1: '金币', 10: '月卡', 12: '签到金币' }
}

function newItem() {
  return {
    ID: '',
    ItemKey: '',
    ItemType: '',
    UseInfo: '',
    Name: '',
    Description: '',
    Icon: '',
    Sort: '',
    Status: '',
    VersionLower: ''
  }
}

export default {
  components: { Compare, Publish, TableSort },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      dragItems: [],

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        monthCard: {
          Origin: 0,
          EveryDay: 1,
          Days: 1
        }
      },

      AttrNames: {
        ItemType: '物品类型',
        UseInfo: '使用信息',
        Name: '名称',
        Description: '描述',
        Icon: '图标',
        Sort: '排序',
        VersionLower: '最小支持版本'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    sortSucc(items) {
      for (const o in items) {
        this.clientDB.UpdateData(items[o])
      }
    },
    initDragItems() {
      this.dragItems = []
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        if (ob.Status === 2) {
          this.dragItems.push({ ID: ob.ID, Sort: ob.Sort, Name: ob.Name })
        }
      }
      this.dragItems.sort(function(a, b) {
        return a.Sort - b.Sort
      })
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
        url: '/item/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.initDragItems()
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
          url: '/item/update/status',
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
          if (this.edit.item.ItemType === 10) {
            const tmp = JSON.parse(this.edit.item.UseInfo)
            tmp.Origin /= 1000
            tmp.EveryDay /= 1000
            this.edit.monthCard = tmp
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
        url: '/item/create',
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
        url: 'item/update',
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
      if (this.edit.item.ItemType === 10) {
        const tmpItem = {
          Origin: parseInt(this.edit.monthCard.Origin * 1000),
          EveryDay: parseInt(this.edit.monthCard.EveryDay * 1000),
          Days: this.edit.monthCard.Days
        }
        this.edit.item.UseInfo = JSON.stringify(tmpItem)
      }
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
