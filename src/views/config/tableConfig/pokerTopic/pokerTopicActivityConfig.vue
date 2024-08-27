<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="PokerTopicActivityConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
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
        <el-table-column prop="TopicName" label="主题名称" width="200" />
        <el-table-column prop="CycleNumber" label="周期编号" width="100" />
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
        <el-table-column prop="EndTime" label="入口关闭时间" sortable="custom" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.EntryCloseTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="ResetCycle" label="周期天数" width="80" />
        <el-table-column prop="UpdateTime" label="最近修改" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.UpdateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="130" />
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
            <!--<el-button type="primary" size="mini" icon="el-icon-document-copy" @click="showCyclesDialog(scope.row)">周期 </el-button>-->
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
            <el-form-item label="活动名称：" :required="true" prop="item.TopicName">
              <el-input v-model="edit.item.TopicName" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开始时间：">
              <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="结束时间：">
              <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" @change="onEndTimeChange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="入口关闭时间：">
              <el-date-picker v-model="entryCloseTime" type="datetime" placeholder="选择关闭时间" value-format="timestamp" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="周期天数：" prop="item.ResetCycle" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ResetCycle" readonly>
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="AppId白名单：" prop="item.AppWhitelist">
              <el-input v-model="edit.item.AppWhitelist" placeholder="每个AppId以英文逗号相隔" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="SiteId站点：" prop="item.SiteWhitelist">
              <el-input v-model="edit.item.SiteWhitelist" placeholder="每个SiteId以英文逗号相隔" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="活动游戏ID：" :required="true" prop="item.Games">
              <el-select v-model="games" multiple placeholder="请选择" style="width: 400px" @change="onGameOptionsChange">
                <el-option
                  v-for="item in gameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="7">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="getCycleDialogTitle()" width="65%" :visible.sync="edit.cyclesVisible" :close-on-click-modal="false">
      <publish primary-key="CycId" key-id="PokerTopicCycleConfig" :env-empty="true" :check="configCheck" :attr-names="CyclesAttrNames" />
      <el-button size="mini" type="primary" style="margin-bottom: 5px" @click="handleAddCycle">新增周期</el-button>
      <el-table ref="filterTable" :data="cycleList" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%">
        <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
        <el-table-column prop="ActivityCycle" label="周期编号" width="110" />
        <el-table-column prop="StartTime" label="开始时间" width="210">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="结束时间" sortable="custom" width="210">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="Period" label="时长(天)" width="80">
          <template slot-scope="scope">
            {{ ((scope.row.EndTime - scope.row.StartTime)/1000/86400).toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column prop="Number" label="第几期" width="80" />
        <el-table-column prop="ModifyUser" label="最后修改人" width="120" />
        <!--<el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>-->
        <el-table-column label="操作" column-key="op" width="230">
          <template slot-scope="scope">
            <el-button v-if="scope.row.Status!==2 && scope.row.Status!==0" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepareCycle(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.Status!==2" size="mini" icon="el-icon-delete" @click="handleDeleteCycle(scope.row)" />
            <el-button v-if="scope.row.Status===2" size="mini" type="danger" icon="el-icon-download" @click="handleOfflineCycle(scope.row)">下架 </el-button>
            <el-button v-if="scope.row.Status!==2" size="mini" type="primary" @click="handleSaveCycle(scope.row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
    <compare ref="compareCycles" :attr-names="CyclesAttrNames" />
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
    TopicName: '',
    StartTime: Date.parse(new Date().toString()),
    EndTime: Date.parse(new Date().toString()),
    ResetCycle: 7,
    Games: '',
    CycleNumber: '',
    EntryCloseTime: Date.parse(new Date().toString()),
    AppWhitelist: '',
    SiteWhitelist: ''
  }
}

function newCycle(activity, actCycle, number, startTime) {
  return {
    ID: 0,
    ActivityId: activity.ID,
    ActivityCycle: actCycle,
    Number: number,
    Period: activity.Period,
    StartTime: startTime,
    EndTime: startTime + 86400 * activity.ResetCycle * 1000,
    Status: 0
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      cycleList: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      cycleClientDB: new ClientTableData([], 1),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow([]),

      gameOptions: [{
        value: 15,
        label: 'TEXAS POKER'
      }, {
        value: 21,
        label: 'PUSOY'
      }, {
        value: 23,
        label: 'TONGITS'
      }, {
        value: 28,
        label: 'TONGITS JOKER'
      }, {
        value: 22,
        label: 'LUCKY9'
      }],

      edit: {
        visible: false,
        cyclesVisible: false,
        activityId: 0,
        item: newItem(),
        isEdit: false
      },
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()) + 86400 * 7 * 1000,
      games: [],
      defaultGames: [15, 21, 23, 28],
      entryCloseTime: Date.parse(new Date().toString()) + 86400 * 7 * 1000,

      AttrNames: {
        TopicName: '专题名称',
        StartTime: '开始时间',
        EndTime: '结束时间',
        ResetCycle: '重置周期',
        Games: '游戏ID',
        CycleNumber: '周期编号',
        EntryCloseTime: '入口关闭时间',
        AppWhitelist: 'AppId白名单',
        SiteWhitelist: 'SiteId站点'
      },
      CyclesAttrNames: {
        ID: 'ID',
        ActivityId: '活动ID',
        ActivityCycle: '周期编号',
        Number: '第几期',
        Period: '时长（天）',
        StartTime: '开始时间',
        EndTime: '结束时间'
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

    onGameOptionsChange() {
      console.log('selected games', this.games)
      this.edit.item.Games = this.games.join(',')
    },

    onEndTimeChange(val) {
      if (val < this.startTime) {
        this.endTime = this.edit.item.EndTime * 1000
        this.$alert('结束时间不能小于开始时间：' + new Date(this.startTime).Format('yyyy-MM-dd HH:mm:ss'), '活动周期')
        return
      }
      if (val > this.entryCloseTime) {
        this.entryCloseTime = val
      }
      this.edit.item.ResetCycle = parseInt((this.endTime - this.startTime + 1000) / 1000 / 86400)
      console.log('onEndTimeChange', val)
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
      this.games = this.defaultGames
      this.edit.item.Games = this.games.join(',')
      console.log(this.edit.item)
    },
    getList() {
      request({
        url: '/pokertopicactivity/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'EndTime', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    getCycles(actId) {
      // 加载基础数值配置
      request({
        url: '/pokertopiccycle/all',
        method: 'get',
        data: {
          actId: actId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getCycles(', actId, ')', response.Data)
          this.$refs.compareCycles.SetOldVal(response.Data)

          this.cycleList = []
          const list = response.Data || []
          for (const i in list) {
            const item = {}
            Object.assign(item, list[i])
            item.StartTime = item.StartTime * 1000
            item.EndTime = item.EndTime * 1000
            this.cycleList.push(item)
          }
          this.cycleClientDB = new ClientTableData(this.cycleList, 10, 'EndTime', -1)
        }
      })
    },
    configCheck() {
      return true
    },
    showCyclesDialog(ob) {
      console.log('showCyclesDialog', ob)
      this.edit.cyclesVisible = true
      this.edit.activityId = ob.ID
      this.getCycles(ob.ID)
    },
    saveCycleData() {
      console.log('saveCycleData', this.edit.activityId)
      const $this = this
      const list = []
      for (const i in this.cycleList) {
        const item = {}
        Object.assign(item, this.cycleList[i])
        item.StartTime = item.StartTime / 1000
        item.EndTime = item.EndTime / 1000
        item.Period = parseInt(((item.EndTime - item.StartTime) / 86400).toString())
        if (item.Period === 0) {
          this.$alert('周期时长不能小于1天', '周期时长', { confirmButtonText: '确定' })
          return
        }
        list.push(item)
      }
      console.log('saveCycleData-newList', list)
      this.$refs.compareCycles.SetNewVal(list)
      this.$refs.compareCycles.Compare(function(isEdit) {
        console.log('saveCycleData-isEdit', isEdit)
        if (isEdit) {
          $this.saveCycles(list)
        } else {
          Message.error('没有任何修改，不需要提交')
        }
        // $this.getCycles($this.edit.activityId)
      })
    },
    saveCycles(list) {
      for (const i in list) {
        this.editSaveCycle(list[i])
      }
    },
    createSaveCycle(postData) {
      console.log('createSaveCycle', postData)
      request({
        url: '/pokertopiccycle/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getCycles(postData.ActivityId)
          Message.success('保存成功！')
        }
      })
    },
    editSaveCycle(postData) {
      console.log('editSaveCycle', postData)
      request({
        url: 'pokertopiccycle/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getCycles(postData.ActivityId)
          Message.success('保存成功！')
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
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/pokertopicactivity/update/status',
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
    handlePrepareCycle(ob) {
      this.changeStatusCycle(ob.ID, ob.ActivityId, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOfflineCycle(ob) {
      this.changeStatusCycle(ob.ID, ob.ActivityId, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDeleteCycle(ob) {
      if (ob.ID === 0) {
        this.cycleClientDB.DelData(ob.ID)
        this.cycleList = this.cycleClientDB.GetCurrentPageData(1)
        return
      }
      this.deleteCycle(ob.ID)
      // this.changeStatusCycle(ob.ID, ob.ActivityId, 3, '您确定要将记录状态修改为废弃吗？')
    },
    handleAddCycle() {
      if (this.cycleClientDB.GetDataByID(0)) {
        Message.warning('请先保存新增的数据')
        return
      }
      let cycle = {}
      const activity = this.clientDB.GetDataByID(this.edit.activityId)
      console.log('handleAddCycle', activity)
      if (this.cycleList.length > 0) {
        const lastCycle = this.cycleList[0]
        const number = lastCycle.Number + 1
        const startTime = (lastCycle.EndTime + 1000)
        const actCycle = lastCycle.ActivityCycle + 1
        cycle = newCycle(activity, actCycle, number, startTime)
      } else {
        const number = 1
        const startTime = activity.StartTime * 1000
        const actCycle = parseInt((new Date(activity.StartTime * 1000).Format('yyyyMMdd') + '01'))
        cycle = newCycle(activity, actCycle, number, startTime)
      }

      if (cycle.StartTime / 1000 >= activity.EndTime) {
        Message.warning('新的周期的起始时间已大于活动的结束时间，无法新增周期')
        return
      }

      this.cycleClientDB.AddData(cycle)
      this.cycleList = this.cycleClientDB.GetCurrentPageData(1)
    },
    handleSaveCycle(ob) {
      const item = {}
      Object.assign(item, ob)
      item.StartTime = item.StartTime / 1000
      item.EndTime = item.EndTime / 1000
      item.Period = parseInt(((item.EndTime - item.StartTime) / 86400).toString())
      if (item.Period === 0) {
        this.$alert('周期时长不能小于1天', '周期时长', { confirmButtonText: '确定' })
        return
      }
      if (ob.ID > 0) {
        this.editSaveCycle(item)
      } else {
        this.createSaveCycle(item)
      }
    },
    deleteCycle(id) {
      this.$confirm('是否删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/pokertopiccycle/delete',
          method: 'post',
          data: {
            ID: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除记录成功！')
            this.getCycles(this.edit.activityId)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    changeStatusCycle(id, activityId, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/pokertopiccycle/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.getCycles(activityId)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getCycleDialogTitle() {
      if (this.edit.activityId) {
        const activity = this.clientDB.GetDataByID(this.edit.activityId)
        return `周期配置：「活动ID：${activity.ID}，主题名称：${activity.TopicName}」`
      }
      return '周期配置'
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
          this.entryCloseTime = this.edit.item.EntryCloseTime * 1000
          this.games = []
          const games = this.edit.item.Games.split(',')
          for (const i in games) {
            this.games.push(parseInt(games[i]))
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
      console.log('createSave', postData)
      request({
        url: '/pokertopicactivity/create',
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
        url: 'pokertopicactivity/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      postData.StartTime = this.startTime / 1000
      postData.EndTime = this.endTime / 1000
      postData.EntryCloseTime = this.entryCloseTime / 1000
      postData.CycleNumber = new Date(this.startTime).Format('yyyyMMdd')
      postData.Games = this.games
      console.log('dataToPost ', postData)
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
      this.edit.item.EntryCloseTime = this.entryCloseTime / 1000
      this.edit.item.Games = this.games.join(',')
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
