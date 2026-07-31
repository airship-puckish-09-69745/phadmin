<template>
  <div class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="id" key-id="NewAirdropConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['id', 'activityName']"/>
    </el-row>

    <!-- 操作栏 -->
    <el-row style="padding-top: 10px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd(1)">添加 Slot 活动</el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" style="margin-left: 8px" @click="handleAdd(2)">添加 Poker 活动</el-button>
        <el-button size="mini" type="warning" icon="el-icon-plus" style="margin-left: 8px" @click="handleAdd(3)">添加 Casino 活动</el-button>
      </el-col>
      <el-col :span="2" :offset="2">
        <el-button type="info" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-row style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height: '10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column prop="id" label="ID" sortable="custom" width="80" align="center"/>
        <el-table-column prop="activityName" label="活动名称" min-width="140" align="center" show-overflow-tooltip/>
        <el-table-column prop="gameType" label="玩法类型" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="gameTypeTagType[scope.row.gameType]" size="mini">
              {{ gameTypeNames[scope.row.gameType] || scope.row.gameType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isOpen" label="活动开关" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isOpen ? 'success' : 'info'" size="mini">{{ scope.row.isOpen ? '开' : '关' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" sortable="custom" min-width="160" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.startTime) }}</template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom" min-width="160" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.endTime) }}</template>
        </el-table-column>
        <el-table-column prop="showEndTime" label="展示结束时间" sortable="custom" min-width="160" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.showEndTime) }}</template>
        </el-table-column>
        <el-table-column prop="dailyStartTime" label="每日开始时间" min-width="160" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.dailyStartTime) }}</template>
        </el-table-column>
        <el-table-column prop="dailyEndTime" label="每日结束时间" min-width="160" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.dailyEndTime) }}</template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" width="110" align="center" show-overflow-tooltip/>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="statusTagType[scope.row.status]" size="mini">
              {{ statusNames[scope.row.status] || scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" fixed="right" min-width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status !== 2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架</el-button>
            <el-button v-if="scope.row.status !== 2" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-if="scope.row.status === 2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :offset="16" :span="8">
        <div class="block" style="padding-top: 10px">
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
    </el-row>

    <!-- Slot 表单 -->
    <slot-form
      :visible.sync="slotForm.visible"
      :is-edit="slotForm.isEdit"
      :data.sync="slotForm.data"
      @changeData="getList"
    />

    <!-- Poker 表单 -->
    <poker-form
      :visible.sync="pokerForm.visible"
      :is-edit="pokerForm.isEdit"
      :data.sync="pokerForm.data"
      @changeData="getList"
    />

    <!-- Casino 表单 -->
    <casino-form
      :visible.sync="casinoForm.visible"
      :is-edit="casinoForm.isEdit"
      :data.sync="casinoForm.data"
      @changeData="getList"
    />
  </div>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'
import SlotForm from './components/slotForm.vue'
import PokerForm from './components/pokerForm.vue'
import CasinoForm from './components/casinoForm.vue'

const filterMap = {}
export const ACTIVITY_ID = 34

export default {
  name: 'NewAirdropIndex',
  components: { Publish, SlotForm, PokerForm, CasinoForm },
  data() {
    return {
      libShow: $libShow,
      clientDB: new ClientTableData([], 10, filterMap),
      tableData: [],
      slotForm: { visible: false, isEdit: false, data: null },
      pokerForm: { visible: false, isEdit: false, data: null },
      casinoForm: { visible: false, isEdit: false, data: null },
      AttrNames: {
        id: '配置ID',
        Activity: '活动数据',
        Extend: '扩展数据',
        isOpen: '活动开关',
        startTime: '开始时间',
        endTime: '结束时间',
        modifyUser: '最后修改人',
        status: '配置状态'
      },
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      statusTagType: { 2: 'success', 6: 'danger', 7: 'warning', 8: 'warning' },
      gameTypeNames: { 1: 'Slot', 2: 'Poker', 3: 'Casino' },
      gameTypeTagType: { 1: '', 2: 'success', 3: 'warning' }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatTime(ts) {
      if (!ts) return '-'
      return $libDate.FormateSecondStr(ts, 2)
    },
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
    handleAdd(gameType) {
      const emptyData = { gameType }
      if (gameType === 1) {
        this.slotForm = { visible: true, isEdit: false, data: emptyData }
      } else if (gameType === 2) {
        this.pokerForm = { visible: true, isEdit: false, data: emptyData }
      } else {
        this.casinoForm = { visible: true, isEdit: false, data: emptyData }
      }
    },
    handleEdit(row) {
      const data = JSON.parse(JSON.stringify(row))
      const gameType = row.gameType || 1
      if (gameType === 1) {
        this.slotForm = { visible: true, isEdit: true, data }
      } else if (gameType === 2) {
        this.pokerForm = { visible: true, isEdit: true, data }
      } else {
        this.casinoForm = { visible: true, isEdit: true, data }
      }
    },
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/activityconfig/update/status',
          method: 'post',
          data: { id, status, activityId: ACTIVITY_ID }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('操作成功！')
            this.getList()
          }
        })
      }).catch(() => {})
    },
    getList() {
      request({
        url: '/activityconfig/all',
        method: 'get',
        data: { activityId: ACTIVITY_ID }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const rows = []
          for (const obj of objs) {
            const act = typeof obj.activity === 'string' ? JSON.parse(obj.activity || '{}') : (obj.activity || {})
            const ext = typeof obj.extend === 'string' ? JSON.parse(obj.extend || '{}') : (obj.extend || {})
            rows.push({
              ...obj,
              activityName: act.name || '',
              isOpen: act.isOpen,
              gameType: act.gameType || 1,
              startTime: act.startTime || 0,
              endTime: act.endTime || 0,
              showEndTime: act.showEndTime || 0,
              dailyStartTime: act.dailyStartTime || 0,
              dailyEndTime: act.dailyEndTime || 0,
              activity: act,
              extend: ext
            })
          }
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'id', -1, 'id')
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>
