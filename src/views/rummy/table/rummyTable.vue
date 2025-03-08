<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="RummyTableConfig" :env-empty="true" :check="configCheck" :attr-names="attrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
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
          prop="IsPractice"
          label="练习场"
          width="70"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="DiFen"
          label="底分"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="LegalPlayerNumber"
          label="人数"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="CarryLower"
          label="携带"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ObjectCount"
          label="桌子数"
          width="100"
        />
        <el-table-column
          prop="ActionSeconds"
          label="操作时间"
          width="120"
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
          width="100"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="70"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
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
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <el-button
              v-if="scope.row.Status==6"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >预上
            </el-button>
            <el-button
              v-if="scope.row.Status==7"
              size="mini"
              type="success"
              @click="handleOn(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="warning"
              @click="handlePreOff(scope.row)"
            >预下
            </el-button>
            <el-button
              v-if="scope.row.Status==6"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==8"
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
            <el-form-item label="底分：" :required="true" prop="item.DiFen">
              <el-select v-model="edit.item.DiFen" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="0.05" :value="0.05" />
                <el-option label="0.2" :value="0.2" />
                <el-option label="1" :value="1" />
                <el-option label="3" :value="3" />
                <el-option label="5" :value="5" />
                <el-option label="10" :value="10" />
                <el-option label="20" :value="20" />
                <el-option label="50" :value="50" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="座位数：" :required="true">
              <el-radio-group v-model.number="edit.item.LegalPlayerNumber">
                <el-radio :label="2">2人</el-radio>
                <el-radio :label="6">6人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="等级ID："
              :required="true"
              prop="item.LevelID"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.LevelID" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="等级名称："
              :required="true"
              prop="item.LevelName"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.LevelName" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最小携带："
              :required="true"
              prop="item.CarryLower"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大携带："
              :required="true"
              prop="item.CarryUpper"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="抽水费率：" :required="true" prop="item.FlowRate" :rules="dataRule(true,{type:'f',range:'0'})">
              <el-input v-model="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="11">
            <el-form-item label="练习场：" :required="true">
              <el-radio-group v-model.number="edit.item.IsPractice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          -->
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="操作时长(秒)："
              :required="true"
              prop="item.ActionSeconds"
              :rules="dataRule(true,{type:'n',range:'5'})"
            >
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="操作时长" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="桌子数量："
              :required="true"
              prop="item.ObjectCount"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.ObjectCount" placeholder="桌子数量" />
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
    <compare ref="compare" :attr-names="attrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import SelectGoods from '@/components/SelectGoods'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function newItem() {
  return {
    ID: '',
    LevelID: 0,
    LevelName: '0',
    CarryLower: '',
    CarryUpper: '',
    DiFen: '',
    FlowRate: '',
    ObjectCount: '',
    ActionSeconds: '',
    LegalPlayerNumber: 2,
    IsPractice: 0,
    Level: 0
  }
}

export default {
  components: { Compare, Publish, SelectGoods, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
      },
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'DiFen']),
      
      attrNames: {
        LevelID: '级别ID',
        LevelName: '级别名称',
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        DiFen: '底分',
        FlowRate: '抽水率',
        ObjectCount: '桌子数',
        ActionSeconds: '操作时间',
        LegalPlayerNumber: '玩家数',
        IsPractice: '是否练习场',
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    configCheck() {
      let count = 0
      for (const i in this.clientDB.TotalData) {
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
          count++
        }
      }
      //if (count !== 1) {
      //  this.$alert('发布的配置项中，必须有且仅有一个练习场配置')
      //  return false
      //}
      return true
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
        url: '/rummytable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    handlePreOn(ob) {
      this.changeStatus(ob.ID, 7, '您确定要将记录状态修改为"预备上架"吗？该记录将在发布后同步到外网。')
    },
    handleOn(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handlePreOff(ob) {
      this.changeStatus(ob.ID, 8, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
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
        url: '/rummytable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.item.ID = response.Data.ID
          this.clientDB.AddData(this.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'rummytable/update',
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
      return this.libMoney.TransForStore(this.edit.item)
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
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
