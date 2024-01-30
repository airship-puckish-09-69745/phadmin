<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ActId" key-id="MillionPointRaceConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
        <el-table-column prop="Title" label="Title" width="200" />
        <el-table-column prop="TableMoney" label="底注" sortable="custom" width="100">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.TableMoney) }}
          </template>
        </el-table-column>

        <el-table-column prop="StartTime" label="开始时间" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.StartTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="结束时间" sortable="custom" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.EndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="UpdateTime" label="最近修改" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.UpdateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="250">
          <template slot-scope="scope">
            <!--
            <el-button type="primary" size="mini" icon="el-icon-document-copy" @click="handleCopy(scope.row)" >复制 </el-button>
            -->
            <el-button v-if="scope.row.Status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.Status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="类型：" :required="true" prop="item.ActivityType">
              <el-select v-model="edit.item.ActivityType" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="Tongits积分赛" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="标题：" :required="true" prop="item.Title">
              <el-input v-model="edit.item.Title" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开始时间：">
              <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束时间：">
              <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="需要的虚拟币：" prop="item.NeedVirtualCoin" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.NeedVirtualCoin" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分享发放虚拟币：" :required="true" prop="item.TaskVirtualCoin" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.TaskVirtualCoin" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="底注：" :required="true" prop="item.TableMoney" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableMoney" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="AppId(不限制填0)：" :required="true" prop="item.AppId" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.AppId" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row style="margin-top: 10px;">
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
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow, ValidateVueItem } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function newItem() {
  return {
    ActivityType: 1,
    Title: '',
    StartTime: Date.parse(new Date().toString()),
    EndTime: Date.parse(new Date().toString()),
    NeedVirtualCoin: 200,
    TaskVirtualCoin: 2000,
    TableMoney: 10,
    AppId: 0,
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['TableMoney', 'TaskVirtualCoin', 'NeedVirtualCoin']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()),

      AttrNames: {
        ActivityType: '类型',
        Title: '标题',
        StartTime: '开始时间',
        EndTime: '结束时间',
        NeedVirtualCoin: '需求的虚拟币',
        TaskVirtualCoin: '分享发放虚拟币：',
        TableMoney: '前注',
        AppId: 'AppId' 
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
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
    getList() {
      request({
        url: '/millionpointracerule/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'EndTime', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      /*
        let goodsCheck = false
        for (const i in this.clientDB.TotalData) {
          if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
            // count++
          }
          // 除了练习场，其它场次必须配置推荐商品
          if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 0 && this.clientDB.TotalData[i].GoodsId <= 0) {
            goodsCheck = true
          }
        }
        */
      return true
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
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/millionpointracerule/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            // $this.clientDB.UpdateData({ ID: id, Status: status })
            this.getList()
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
          this.startTime = this.edit.item.StartTime * 1000
          this.endTime = this.edit.item.EndTime * 1000
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
      console.log('createSave', postData)
      request({
        url: '/millionpointracerule/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          /*
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          */
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      console.log('editSave', postData)
      request({
        url: 'millionpointracerule/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          /*
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          */
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      postData.StartTime = this.startTime / 1000
      postData.EndTime = this.endTime / 1000
      return postData
    },
    checkData() {
      if (this.startTime > this.endTime) {
        Message.warning('开始时间不能大于结束时间，请检查数值正确性！')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      if (!ValidateVueItem(this.$refs['edit'])) return false

      this.edit.item.StartTime = this.startTime / 1000
      this.edit.item.EndTime = this.endTime / 1000
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
