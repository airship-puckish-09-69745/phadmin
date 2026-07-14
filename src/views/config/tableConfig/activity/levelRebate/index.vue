<template>
  <div class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="id" key-id="LevelRebateConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['id', 'activityName']" />
    </el-row>
    <el-row style="padding-top: 10px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
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
        <el-table-column prop="activityName" label="活动名称" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="isOpen" label="活动开关" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isOpen ? 'success' : 'info'" size="mini">{{ scope.row.isOpen ? '开' : '关' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" sortable="custom" min-width="150" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom" min-width="150" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="userDayPrizeThreshold" label="个人奖励上限" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.userDayPrizeThreshold != null ? scope.row.userDayPrizeThreshold / 1000 : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="dayPrizeThreshold" label="每日发奖上限" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.dayPrizeThreshold != null ? scope.row.dayPrizeThreshold / 1000 : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" width="200" show-overflow-tooltip align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="statusTagType[scope.row.status]" size="mini">
              {{ statusNames[scope.row.status] || scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" fixed="right" min-width="220">
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

    <update-form
      :visible.sync="updateForm.visible"
      :is-edit="updateForm.isEdit"
      :data.sync="updateForm.data"
      @changeData="getList"
    />
  </div>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import { $libDate, ClientTableData, $libShow } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'
import UpdateForm from './components/updateForm.vue'

const filterMap = {}
const ACTIVITY_ID = 29

export default {
  components: { Publish, UpdateForm },
  data() {
    return {
      libShow: $libShow,
      clientDB: new ClientTableData([], 10, filterMap),
      updateForm: {
        visible: false,
        isEdit: false,
        data: null
      },
      tableData: [],
      AttrNames: {
        id: '配置ID',
        activityName: '活动名称',
        isOpen: '活动开关',
        startTime: '开始时间',
        endTime: '结束时间',
        userDayPrizeThreshold: '个人奖励上限',
        effectiveBet: '解锁有效下注',
        minReward: '最低返水奖励',
        dayPrizeThreshold: '每日发奖上限',
        totalPrizeThreshold: '最大发奖总上限',
        rewardTiers: '反水阶梯配置',
        modifyUser: '最后修改人',
        status: '配置状态'
      },
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      statusTagType: { 2: 'success', 6: 'danger', 7: 'warning', 8: 'warning' }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.updateForm.visible = true
      this.updateForm.isEdit = false
      this.updateForm.data = {}
    },
    handleEdit(row) {
      this.updateForm.visible = true
      this.updateForm.isEdit = true
      this.updateForm.data = JSON.parse(JSON.stringify(row))
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
            const act = JSON.parse(obj.activity || '{}')
            const ext = JSON.parse(obj.extend || '{}')
            // 说明：阶段性反水的业务字段都在 activity 中（userDayPrizeThreshold、effectiveBet、minReward 等）
            // 反水阶梯配置单独放在 extend.rewardTiers 中
            rows.push({
              ...obj,
              activityName: act.name || '',
              isOpen: act.isOpen,
              startTime: act.startTime || 0,
              endTime: act.endTime || 0,
              showTime: act.showTime || 0,
              gameIdCfg: act.gameIdList || [],
              // 站点白名单前端简化为单层数组 siteIdList，便于表单直接绑定
              siteIdList: (act.whitelist && Array.isArray(act.whitelist.siteIdList)) ? act.whitelist.siteIdList : (act.siteIdList || []),
              // 以下字段全部来自 activity
              userDayPrizeThreshold: ext.userDayPrizeThreshold || 0,
              effectiveBet: ext.effectiveBet || 0,
              minReward: ext.minReward || 0,
              userDayPrizeThreshold: ext.userDayPrizeThreshold || 0,
              tiersCount: Array.isArray(ext.rewardTiers) ? ext.rewardTiers.length : 0,
              activity: act,
              extend: ext
            })
          }
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'id', -1, 'id')
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
