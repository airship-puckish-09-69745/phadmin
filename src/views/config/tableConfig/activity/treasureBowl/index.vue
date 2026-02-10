<template>
  <div class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="id" key-id="TreasureBowlActivity" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="AttrNames" :head-attrs="['id', 'activityName']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">新增聚宝盆配置</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
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
        <el-table-column prop="id" label="ID" sortable="custom" width="80" />
        <el-table-column prop="activityName" label="活动名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="isOpen" label="活动开关" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isOpen ? 'success' : 'info'" size="mini">{{ scope.row.isOpen ? '开' : '关' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" sortable="custom" min-width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom" min-width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="showEndTime" label="展示结束时间" min-width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.showEndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="sockGainRatio" label="道具比例" width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.sockGainRatio }}%
          </template>
        </el-table-column>
        <el-table-column prop="rewardType" label="奖励类型" width="90" align="center">
          <template slot-scope="scope">
            {{ rewardTypeNames[scope.row.rewardType] || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="dayPrizeThreshold" label="每日发奖上限" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.dayPrizeThreshold != null ? scope.row.dayPrizeThreshold / 1000 : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrizeThreshold" label="总上限" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.totalPrizeThreshold != null ? scope.row.totalPrizeThreshold / 1000 : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" width="110" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="statusTagType[scope.row.status]" size="mini">{{ statusNames[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status !== 2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架</el-button>
            <el-button v-if="scope.row.status !== 2" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-if="scope.row.status === 2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架</el-button>
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
    </el-row>

    <!-- 聚宝盆配置弹窗 -->
    <treasure-bowl-form
      :visible.sync="formDialog.visible"
      :is-edit="formDialog.isEdit"
      :edit-data="formDialog.item"
      @refresh="getList"
    />

    <!-- 对比组件 -->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import TreasureBowlForm from './form.vue'

const filterMap = {}

export default {
  components: { Compare, Publish, TreasureBowlForm },
  data() {
    return {
      AttrNames: {
        id: '活动配置ID',
        activityName: '活动名称',
        isOpen: '活动开关',
        startTime: '开始时间',
        endTime: '结束时间',
        showEndTime: '展示结束时间',
        sockGainRatio: '有效下注获得道具比例',
        rewardType: '奖励类型',
        dayPrizeThreshold: '每日发奖上限监控',
        totalPrizeThreshold: '最大发奖总上限监控',
        gameIdCfg: '参与活动游戏',
        prizePoolCfg: '奖池配置',
        rankCfg: '排行榜配置',
        broadcastCfg: '奖励播报配置',
        whitelistCfg: '白名单配置',
        modifyUser: '最后修改人',
        status: '配置状态'
      },
      env: 'test',
      version: store.getters.version || 'V1',
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      statusTagType: { 2: 'success', 6: 'danger', 7: 'warning', 8: 'warning' },
      rewardTypeNames: { 2: '投注金' },
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),
      libShow: $libShow,

      // 弹窗相关
      formDialog: {
        visible: false,
        isEdit: false,
        item: {}
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
  },
  methods: {
    makeContent(key, addData, delData, editData) {
      const parts = []
      if (addData.length > 0) {
        for (const i in addData) {
          for (const j in addData[i]) {
            if (addData[i][j].key === 'activityName') {
              parts.push(`上架-活动名称:【${addData[i][j].newVal}】`)
            }
          }
        }
      }
      if (delData.length > 0) {
        for (const i in delData) {
          for (const j in delData[i]) {
            if (delData[i][j].key === 'activityName') {
              parts.push(`下架-活动名称:【${delData[i][j].oldVal}】`)
            }
          }
        }
      }
      if (editData.length > 0) {
        for (const i in editData) {
          parts.push(`活动名称:【${editData[i].Head.activityName || editData[i].Head.id}】`)
        }
      }
      return parts.join('\r\n')
    },
    configCheck() {
      return true
    },
    formatTime(ts) {
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
    // 获取列表
    getList() {
      request({
        url: '/activitytreasurebowl/list',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'endTime', -1, 'id')
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增
    handleAdd() {
      this.formDialog.item = {}
      this.formDialog.isEdit = false
      this.formDialog.visible = true
    },
    // 编辑
    handleEdit(row) {
      this.formDialog.item = JSON.parse(JSON.stringify(row))
      this.formDialog.isEdit = true
      this.formDialog.visible = true
    },
    // 上架
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    // 下架
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    // 删除
    handleDelete(ob) {
      this.$confirm('您确定要删除此配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/activitytreasurebowl/delete',
          method: 'post',
          data: { id: ob.id }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除成功！')
            this.getList()
          }
        })
      }).catch(() => {})
    },
    // 修改状态（上架/下架）
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/activitytreasurebowl/update/status',
          method: 'post',
          data: { id: id, status: status }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('操作成功！')
            this.getList()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
