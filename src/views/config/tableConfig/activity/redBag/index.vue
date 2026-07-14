<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="id" key-id="RedBagActivity" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="AttrNames" :head-attrs="['id', 'activityName']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="openRedBagDialog(false)">新增红包雨配置</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="id" label="id" sortable="custom" width="80" />
        <el-table-column prop="activityName" label="活动名称" align="center" />
        <el-table-column prop="startTime" label="开始时间"  align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom"  align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人"  align="center" />
        <el-table-column prop="status" label="状态" width="100"  align="center">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op"  width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="openRedBagDialog(true,scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.status!=2" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
            <el-button v-if="scope.row.status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </el-row>
    <!-- 红包雨活动配置弹窗 -->
    <!-- 双向绑定：控制弹窗显示/隐藏 -->
    <!-- 模式标识：true=编辑模式, false=新增模式 -->
    <!-- 数据传递：传入要编辑的配置数据 -->
    <!-- 刷新事件：保存成功后刷新列表 -->
    <!-- 打开事件：弹窗打开后的初始化 -->
    <!-- 关闭事件：弹窗关闭时的清理 -->
    <red-bag-form
      :visible.sync="redBagEdit.visible"
      :is-edit="redBagEdit.isEdit"
      :edit-data="redBagEdit.item"
      @refresh="getList"
      @opened="handleRedBagDialogOpened"
      @close="handleRedBagDialogClose"
    />

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>

import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import RedBagForm from './form.vue'


const filterMap = {}

export default {
  components: { Compare, Publish, RedBagForm },
  data() {
    return {
      AttrNames: {
        // 基础信息
        id: '活动配置ID',
        activityName: '活动名称',
        startTime: '开始时间',
        endTime: '结束时间',
        showEndTime: '展示结束时间',
        modifyUser: '最后修改人',
        status: '配置状态',
        isOpen: '是否开启',
        isWhite: '是否白名单',
        isSend: '是否发送',

        // 游戏和奖励类型
        gameType: '游戏类型',
        rewardType: '奖励类型',
        gameIdCfg: '游戏ID配置',

        // 时间配置
        everyDayStartTime: '每日开始时间',
        everyDayEndTime: '每日结束时间',

        // 限制和展示配置
        limitMaxNum: '最大限制数量',
        showGold: '展示金币数',
        showTimes: '展示次数',

        // 任务配置
        taskCfgData: '任务配置数据',
        'taskCfgData[].id': '任务ID',
        'taskCfgData[].taskType': '任务类型',
        'taskCfgData[].matchNum': '匹配次数',
        'taskCfgData[].gameType': '游戏类型',
        'taskCfgData[].rewardId': '奖励ID',
        'taskCfgData[].rewardNum': '奖励数量',
        'taskCfgData[].rewardType': '奖励类型',
        'taskCfgData[].rewardName': '奖励名称',
        'taskCfgData[].rewardTime': '奖励时间',
        'taskCfgData[].redId': '红包ID',

        // 奖池配置
        'taskCfgData[].rewardPools': '奖励池配置',
        'taskCfgData[].rewardPools[].poolName': '奖池名称',
        'taskCfgData[].rewardPools[].value1': '最小值',
        'taskCfgData[].rewardPools[].value2': '最大值',
        'taskCfgData[].rewardPools[].weight': '权重',
        'taskCfgData[].rewardPools[].limitNum': '限制数量',

        // 道具池配置
        'taskCfgData[].propPools': '道具池配置',
        'taskCfgData[].propPools.propType': '道具类型',
        'taskCfgData[].propPools.propId': '道具ID',
        'taskCfgData[].propPools.propName': '道具名称',
        'taskCfgData[].propPools.propTime': '道具时长',
        'taskCfgData[].propPools.propNum': '道具数量',

        // 白名单配置
        whiteList: '白名单',
        whitelistCfg: '白名单配置',
        siteIdList: '站点ID列表',
        appIdList: 'AppId列表',

        // A/B测试配置
        abTest: 'A/B测试配置',
        'abTest.switch': 'A/B测试开关',
        'abTest.bPercent': 'B组百分比',

        // 其他配置
        debugTimeOffset: '调试时间偏移',
        taskConfig: '任务配置',
        rewardConfig: '奖励配置',
        progressPrizes: '进度奖励配置',
        userTypes: '用户类型',
        userFilterCondition: '筛选用户条件',
        ruleImgHor: '横向规则图',
        ruleImgVer: '纵向规则图',

        // 活动信息(旧字段保留兼容)
        activity: '活动信息',
        'activity.activityName': '活动名称',
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
        'activity.userFilterCondition.userTagConfig.tagValue': '用户标签值'
      },
      env: 'test',
      appId: store.getters.appId || -1,
      version: store.getters.version || 'V1',
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      // 选定游戏后对应可选任务类型
      gameTaskTypes: [],
      filterText: '',
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      // 道具数据列表
      propList: [],
      // 道具有效时长列表
      propTimeList: [],
      // 道具选项列表
      propOptions: {},

      // 红包雨配置弹窗相关
      redBagEdit: {
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
            if (addData[i][j].key === 'activityName') {
              str += `\r\n上架-活动名称:【${addData[i][j].newVal}】`
            }
          }
        }
      }
      if (delData.length > 0) {
        for (const i in delData) {
          for (const j in delData[i]) {
            if (delData[i][j].key === 'activityName') {
              if (str === '') {
                str += `下架-活动名称:【${delData[i][j].oldVal}】`
              } else {
                str += `\r\n下架-活动名称:【${delData[i][j].oldVal}】`
              }
            }
          }
        }
      }
      if (editData.length > 0) {
        for (const i in editData) {
          console.log(editData[i].Head)
          if (str === '') {
            str += `活动名称:【${editData[i].Head.activityName || editData[i].Head.id}】`
          } else {
            str += `\r\n活动名称:【${editData[i].Head.activityName || editData[i].Head.id}】`
          }
        }
      }
      return str
    },
    configCheck() {
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    // 配置列表
    getList() {
      request({
        url: '/redbagactivity/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'EndTime', -1, 'id')
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
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
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/redbagactivity/update/status',
          method: 'post',
          data: {
            id: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    // ************************ 红包雨配置弹窗相关 ************************
    openRedBagDialog(isEdit = false, rowData = {}) {
      this.redBagEdit.visible = true
      this.redBagEdit.isEdit = isEdit

      this.redBagEdit.item = isEdit ? JSON.parse(JSON.stringify(rowData)) : {}
    },
    handleRedBagDialogOpened() {
      console.log('红包雨配置弹窗已打开')
    },
    handleRedBagDialogClose() {
      console.log('红包雨配置弹窗已关闭')
      this.redBagEdit.item = {}
    }
  }
}
</script>
