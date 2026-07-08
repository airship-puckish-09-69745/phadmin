<template>
  <div class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="AirdropConfig" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="AttrNames" :head-attrs="['cfgId', 'activity.name']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加配置项</el-button>
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
        <el-table-column prop="id" label="id" sortable="custom" width="80" />
        <el-table-column prop="name" label="活动名称" />
        <el-table-column prop="gameType" label="玩法大类型" width="120">
          <template slot-scope="scope">
            {{ gameTypeNames[scope.row.gameType] || '未设置' }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="showEndTime" label="展示结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.showEndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" fixed="right">
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

    <!-- 空投配置弹窗 -->
    <airdrop-form
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
import AirdropForm from './form.vue'

const filterMap = {}

export default {
  components: { Compare, Publish, AirdropForm },
  data() {
    return {
      AttrNames: {
        activity: '活动信息',
        'activity.name': '活动名称',
        'activity.whitelist.siteIdList': '站点白名单',
        'activity.whitelist.appIdList': 'AppId白名单',
        'activity.whitelist.abTest': 'A/B测试配置',
        'activity.status': '配置状态',
        'activity.startTime': '开始时间',
        'activity.endTime': '结束时间',
        'activity.showEndTime': '展示结束时间',
        'activity.ruleImgHor': '横向规则图',
        'activity.ruleImgVer': '纵向规则图',
        'activity.gameIdList': '游戏ID配置',
        'activity.userFilterCondition': '筛选用户条件',
        'activity.userFilterCondition.registerTimeRange': '注册时间',
        'activity.userFilterCondition.betTimesRange': '累计投注次数',
        'activity.userFilterCondition.userTagConfig': '用户标签配置',
        'activity.userFilterCondition.userTagConfig.tagId': '用户标签ID',
        'activity.userFilterCondition.userTagConfig.tagValue': '用户标签值',
        id: '活动配置ID',
        name: '活动名称',
        cfgId: '活动配置ID',
        startTime: '开始时间',
        endTime: '结束时间',
        showEndTime: '展示结束时间',
        modifyUser: '最后修改人',
        status: '配置状态',
        gameIdCfg: '游戏ID配置',
        ruleImgHor: '横向规则图',
        ruleImgVer: '纵向规则图',
        whitelistCfg: '白名单',
        debugTimeOffset: '调试时间偏移',
        taskConfig: '任务配置',
        rewardConfig: '奖励配置',
        progressPrizes: '进度奖励配置',
        userTypes: '用户类型',
        userFilterCondition: '筛选用户条件',
        gameType: '玩法大类型'
      },
      env: 'test',
      version: store.getters.version || 'V1',
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      gameTypeNames: { 1: 'Slot', 2: 'Poker', 3: 'Casino' },
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
      let str = ''
      if (addData.length > 0) {
        for (const i in addData) {
          for (const j in addData[i]) {
            if (addData[i][j].key === 'activity') {
              str += `\r\n上架-活动名称:【${addData[i][j].newVal.name}】`
            }
          }
        }
      }
      if (delData.length > 0) {
        for (const i in delData) {
          for (const j in delData[i]) {
            if (delData[i][j].key === 'activity') {
              if (str === '') {
                str += `下架-活动名称:【${delData[i][j].oldVal.name}】`
              } else {
                str += `\r\n下架-活动名称:【${delData[i][j].oldVal.name}】`
              }
            }
          }
        }
      }
      if (editData.length > 0) {
        for (const i in editData) {
          console.log(editData[i].Head)
          if (str === '') {
            str += `活动名称:【${editData[i].Head['activity.name']}】`
          } else {
            str += `\r\n活动名称:【${editData[i].Head['activity.name']}】`
          }
        }
      }
      return str
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
        url: '/airdropconfig/all',
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
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    // 修改状态（上架/下架）
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/update/status',
          method: 'post',
          data: { id: id, status: status }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.getList()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
