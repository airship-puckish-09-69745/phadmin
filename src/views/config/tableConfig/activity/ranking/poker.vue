<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="PokerRankingConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['cfgId', 'name']" />
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
      <el-row>
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
          @sort-change="sortChange">
          <el-table-column prop="id" label="id" sortable="custom" width="80" />
          <el-table-column prop="activity.name" label="活动名称" />
          <el-table-column prop="activity.startTime" label="开始时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.activity.startTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" sortable="custom">
            <template slot-scope="scope">
              {{ formatTime(scope.row.activity.endTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="展示结束时间" sortable="custom">
            <template slot-scope="scope">
              {{ formatTime(scope.row.activity.showEndTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyUser" label="最后修改人" />
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              {{ statusNames[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" column-key="op">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
              <el-button v-if="scope.row.status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
              <el-button v-if="scope.row.status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
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
              @current-change="handleCurrentChange" />
          </div>
        </el-col>
      </el-row>

      <el-dialog
        :title="getEditTitle()"
        :visible.sync="edit.visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @opened="handleEditDialogOpened"
        width="1100px"
      >
        <el-tabs type="border-card">
          <el-tab-pane label="基础配置">
            <el-row>
              <el-form :model="edit.item" label-width="220px" size="mini">
                <el-col :span="24">
                  <el-form-item label="是否开启：" prop="activity.isOpen" :required="true">
                    <el-switch v-model="edit.item.activity.isOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="活动名称：" prop="activity.name" :required="true">
                    <el-input v-model="edit.item.activity.name" placeholder="请输入活动名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开始时间：" prop="activity.startTime" :required="true" >
                    <el-date-picker v-model="edit.item.activity.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：" prop="activity.endTime" :required="true">
                    <el-date-picker v-model="edit.item.activity.endTime" type="datetime"  placeholder="选择结束时间" value-format="timestamp" @change="onChangeEndTime" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="展示结束时间：" prop="activity.showEndTime" :required="true">
                    <el-date-picker v-model="edit.item.activity.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="进入排行榜的有效下注：" prop="extend.minScore" :required="true" style="display: none">
                    <el-input v-model.number="edit.item.extend.minScore" placeholder="请输入有效下注" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计入排行榜的有效单次下注：" prop="extend.minBet" :required="true" style="display: none">
                    <el-input v-model="edit.item.extend.minBet" placeholder="请输入计入排行榜的有效单次下注" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="达到进入排行榜要求的奖励：" prop="extend.progressReward" :required="true" style="display: none">
                    <el-input v-model="edit.item.extend.progressReward" placeholder="请输入玩家奖励上限" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="玩家奖励上限：" prop="extend.maxReward" :required="true" style="display: none">
                    <el-input v-model.number="edit.item.extend.maxReward" placeholder="请输入玩家奖励上限" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动展示金额：" prop="extend.rewardShow" :required="true" style="display: none">
                    <el-input v-model.number="edit.item.extend.rewardShow" placeholder="请输入活动展示金额" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="奖励类型：" prop="extend.rewardType" :required="true">
                    <el-select v-model="edit.item.extend.rewardType" placeholder="请选择奖励类型" disabled>
                      <el-option v-for="item in rewardTypes" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="调试时间偏移量（仅测试用）：" :required="true">
                    <el-input v-model.number="edit.item.activity.debugTimeOffset">
                      <template slot="append">秒</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-row :gutter="5">
              <el-form label-width="220px">
                <el-col :span="24">
                  <el-form-item label="规则图片横板：" :required="true">
                    <el-col :span="4" v-for="(v,k) in edit.item.activity.ruleImgHor">
                      <span style="display: inline-block; position: relative;">
                        <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Hor')">移除</span>
                        <ImagePicker v-model="edit.item.activity.ruleImgHor[k]" />
                      </span>
                    </el-col>
                    <span style="position: relative;">
                      <el-button @click="addRuleImage('Hor')">添加</el-button>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="规则图片竖版：" :required="true">
                    <el-col :span="4" v-for="(v,k) in edit.item.activity.ruleImgVer">
                      <span style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Vor')">移除</span>
                        <ImagePicker v-model="edit.item.activity.ruleImgVer[k]" />
                      </span>
                    </el-col>
                    <span style="position: relative;">
                      <el-button @click="addRuleImage('Vor')">添加</el-button>
                    </span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-row :gutter="5">
              <el-form label-width="220px">
                <el-col :span="12">
                  <el-form-item label="勾选支持的游戏：" :required="true">
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterText">
                    </el-input>
                    <el-tree
                      :data="treeData"
                      show-checkbox
                      node-key="id"
                      ref="tree"
                      highlight-current
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      @check-change="handleGameCheckChange"
                    >
                    </el-tree>
                  </el-form-item>
                  <el-form-item label="给选中游戏排序：" :required="true">
                    <el-button size="mini" type="primary" @click="showGamesSortDialog()">
                      排序
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-dialog
              title="给选中游戏排序"
              :visible.sync="edit.gamesSortDialogVisible"
              append-to-body
            >
              <el-table
                :data="GamesSorted"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column
                  prop="GameId"
                  label="游戏Id"
                  width="200"
                />
                <el-table-column
                  prop="Name"
                  label="游戏名称"
                  width="200"
                />
                <el-table-column
                  prop="OrderNo"
                  label="排序编号"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.OrderNo"
                      size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                      @change="onOrderNoChange"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="top: 10px">
                <el-button type="primary" @click="saveGamesSort">保存</el-button>
              </el-row>
            </el-dialog>
          </el-tab-pane>

          <el-tab-pane label="排行榜配置">
            <el-row :gutter="5">
              <el-col>
                <fieldset style="margin-top: 10px; display: none">
                  <legend>奖励方式</legend>
                  <el-col :span="5">
                    <el-select
                      v-model="edit.item.extend.rewardWay"
                      placeholder="请选择奖励方式"
                      size="mini"
                    >
                      <el-option
                        label="固定奖励"
                        :value="1"
                      />
                      <el-option
                        label="按有效下注百分比"
                        :value="2"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-if="edit.item.extend.rewardWay === 2"
                      v-model.number="edit.item.extend.rewardPercent"
                      placeholder="请输入有效下注百分比"
                      size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                    >
                      <template slot="append">
                        %
                      </template>
                    </el-input>
                  </el-col>
                </fieldset>
                <fieldset style="margin-top: 10px">
                  <legend>榜单显示人数</legend>
                  <el-col :span="4">
                    <el-input v-model.number="edit.item.extend.maxRankShow" placeholder="请输入榜单显示人数" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                  </el-col>
                </fieldset>
                <fieldset style="margin-top: 10px">
                  <legend>奖励配置</legend>
                  <el-button size="mini" type="primary" @click="handleAddRankReward()">添加</el-button>
                  <el-table
                    :data="edit.item.extend.rewardList"
                    border
                    style="width: 100%; margin-top: 10px"
                    :cell-style="libShow.DefaultTableCell"
                  >
                    <el-table-column
                      prop="rankStart"
                      label="排名开始"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.rankStart" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="rankEnd"
                      label="排名结束"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.rankEnd" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="reward"
                      label="奖励金额"
                      width="200"
                      v-if="edit.item.extend.rewardWay === 1"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" column-key="op">
                      <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" @click="handleDelRankReward(scope.$index)" />
                      </template>
                    </el-table-column>
                  </el-table>
                </fieldset>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="积分配置">
            <el-row :gutter="5">
              <el-col>
                <fieldset style="margin-top: 10px">
                  <legend>热门时段</legend>
                  <el-button size="mini" type="primary" @click="handleAddHotTime()">添加</el-button>
                  <el-form :inline="true" v-for="(item, index) in edit.item.extend.hotTimes">
                    <el-form-item :label="`热门时段${index + 1}:`">
                      <el-time-picker
                        v-model="item.startTime"
                        placeholder="请开始时段"
                        size="mini"
                      />
                      -
                      <el-time-picker
                        v-model="item.endTime"
                        placeholder="请结束时段"
                        size="mini"
                      />
                    </el-form-item>
                    <el-form-item label="积分倍数:">
                      <el-input v-model="item.scoreRatio" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </el-form-item>
                    <el-form-item>
                      <el-button size="mini" type="primary" @click="handleDelHotTime(index)">删除</el-button>
                    </el-form-item>
                  </el-form>
                </fieldset>
                <fieldset style="margin-top: 10px">
                  <legend>Tongits积分配置</legend>
                  <el-table
                    :data="edit.item.extend.pokerExtend.tongitsScoreItems"
                    border
                    style="width: 100%; margin-top: 10px"
                    :cell-style="libShow.DefaultTableCell"
                  >
                    <el-table-column
                      prop="antes"
                      label="场次"
                      width="100"
                    />
                    <el-table-column
                      v-for="(scoreWay, index) in edit.scoreWays"
                      :key="index"
                      :prop="scoreWay"
                      :label="scoreItems[scoreWay]"
                      width="130"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row[scoreWay]" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                  </el-table>
                </fieldset>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="白名单配置">
            <el-form ref="item" :model="edit.item" label-width="220px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="是否开启：" prop="activity.whitelist.isOpen" :required="true">
                    <el-switch v-model="edit.item.activity.whitelist.isOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="SiteId白名单：" prop="activity.whitelist.siteIdList" :required="true">
                    <SiteSelect
                      v-model="edit.item.activity.whitelist.siteIdList"
                      multiple
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="UID白名单：" prop="activity.whitelist.uidList">
                    <el-input v-model="edit.item.activity.whitelist.uidList" placeholder="请输入UID白名单，多个UID用逗号隔开" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-row style="margin-top: 10px">
            <el-button type="primary" @click="handleSave()">保存配置</el-button>
          </el-row>
        </el-tabs>
      </el-dialog>

      <!--对比组件-->
      <compare ref="compare" :attr-names="AttrNames" />
    </el-row>
  </div>
</template>

<script>

import Publish from "@/components/Publish/index.vue";
import SiteSelect from "@/components/SiteSelect/index.vue";
import Compare from "@/components/Compare/index.vue";
import GameTreeSelector from "@/components/GamesTreeSelector/index.vue";
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue"
import store from "@/store";
import {$libDate, $libShow, ClientTableData, DataRule} from "@/utils/common";
import request from "@/utils/request";
import {Message} from "element-ui";

const filterMap = {}

const activityId = 20

function newItem() {
  return {
    id: 0,
    activityId: activityId,
    activity: {
      name: '',
      activityId: activityId,
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()),
      showEndTime: Date.parse(new Date().toString()) + 1000 * 60 * 60 * 24,
      status: 0,
      gameIdList: [22, 28, 29],
      whitelist: {
        appIdList: [],
        siteIdList: [],
        uidList: '',
      },
      ruleImgHor: [],
      ruleImgVer: [],
      isOpen: false,
      debugTimeOffset: 0,
    },
    extend: {
      minBet: 0,
      minScore: 0,
      maxReward: 0,
      rewardList: [],
      rewardPercent: 0,
      rewardWay: 1, // 1. 固定金额 2. 有效投注百分比
      rewardType: 2, // 奖励类型 1. 金币 2. 投注金 3. 返水金
      rewardSceneId: 28,
      progressReward: 0,
      rewardShow: 0,
      maxRankShow: 0,
      hotTimes: [
        /*{
          startTime: new Date(new Date().toDateString()), // 当天0点
          endTime: new Date(new Date().toDateString() + ' 23:59:59'), // 当天23:59:59
          scoreRatio: 1.5,
        },*/
      ],
      pokerExtend: {
        tongitsScoreItems: [
          {
            antes: 1,
          },
          {
            antes: 5,
          },
          {
            antes: 10,
          },
          {
            antes: 20,
          },
          {
            antes: 50,
          },
          {
            antes: 200,
          },
          {
            antes: 500,
          },
          {
            antes: 1000,
          }
        ],
      }
    }
  }
}

function newRewardItem() {
  return {
    rankStart: 0,
    rankEnd: 0,
    reward: 0,
  }
}

export default {
  components: {
    Compare,
    GameTreeSelector,
    SiteSelect,
    Publish,
    ImagePicker
  },
  data() {
    return {
      AttrNames: {
        'activity.name': '活动名称',
        'activity.activityId': '活动ID',
        'activity.startTime': '开始时间',
        'activity.endTime': '结束时间',
        'activity.showEndTime': '展示结束时间',
        'activity.status': '状态',
        'activity.gameIdList': '游戏ID配置',
        'activity.whitelist.isOpen': '是否开启白名单',
        'activity.whitelist.appIdList': '应用ID白名单',
        'activity.whitelist.siteIdList': '站点白名单',
        'activity.whitelist.uidList': 'UID白名单',
        'activity.ruleImgHor': '横向规则图',
        'activity.ruleImgVer': '纵向规则图',
        'activity.isOpen': '是否开启',
        'activity.debugTimeOffset': '调试时间偏移',
        'extend.minBet': '计入榜单最小有效投注',
        'extend.minScore': '进入榜单最小有效投注',
        'extend.maxReward': '玩家奖励上限',
        'extend.rewardList': '榜单奖励列表',
        'extend.rewardPercent': '奖励百分比',
        'extend.rewardWay': '奖励方式',
        'extend.rewardType': '奖励类型',
        'extend.rewardSceneId': '奖励场景ID',
        'extend.progressReward': '进度奖励',
        'extend.rewardShow': '活动展示金额',
        'extend.maxRankShow': '最大展示排名',
        'extend.hotTimes': '热门时间配置',
        'extend.pokerExtend.tongitsScoreItems': 'Tongits积分奖励配置',
        modifyUser: '最后修改人',
        updateTime: '更新时间',
      },

      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      libDate: $libDate,
      libShow: $libShow,
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),

      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',

      edit: {
        CfgId: 0,
        isEdit: false,
        visible: false,
        item: newItem(),
        title: "新增",
        gamesSortDialogVisible: false,
        tongitsScoreItems: [],
        scoreWays: ['1', '2', '100', '101']
      },

      scoreItems: {
        '1': '游戏获胜',
        '2': '赢得Pot',
        '100': '接受Challenge',
        '101': 'Tongits Win'
      },

      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      },

      // 奖励类型
      rewardTypes: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],

      filterText: '',
      filterGameIds: [ 2031, 10002 ],
      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
    this.getGameAll()
    this.getGameAnteTables()
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      const deleteList = []
      deleteList.push(ob)
      this.deleteData = deleteList
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    handleAddRankReward() {
      this.edit.item.extend.rewardList.push(newRewardItem())
    },
    handleDelRankReward(index) {
      this.edit.item.extend.rewardList.splice(index, 1)
    },
    getList() {
      request({
        url: '/rankingconfig/all',
        method: 'get',
        data: {
          'activity_id': activityId,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const rows = []
          for (const obj of objs) {
            rows.push({
              ...obj,
              activity: JSON.parse(obj.activity),
              extend: JSON.parse(obj.extend),
            })
          }
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'EndTime', -1, 'id')
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/rankingconfig/update/status',
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
    getPostItem() {
      const item = JSON.parse(JSON.stringify(this.edit.item))
      item.activity.startTime /= 1000
      item.activity.endTime /= 1000
      item.activity.showEndTime /= 1000
      item.extend.minBet *= 1000
      item.extend.minScore *= 1000
      item.extend.maxReward *= 1000
      item.extend.progressReward *= 1000

      for (const hotTime of item.extend.hotTimes) {
        hotTime.startTime = new Date(hotTime.startTime).getTime() / 1000
        hotTime.endTime = new Date(hotTime.endTime).getTime() / 1000
        hotTime.scoreRatio *= 100
      }

      for (const reward of item.extend.rewardList) {
        reward.reward *= 1000
      }

      if (item.activity.whitelist.appIdList.length === 0 && this.version === 'V2') {
        item.activity.whitelist.appIdList.push(this.appId)
      }

      if (item.activity.whitelist.uidList) {
        item.activity.whitelist.uidList = item.activity.whitelist.uidList.split(',').map(uid => {
          return parseInt(uid.trim())
        })
      } else {
        item.activity.whitelist.uidList = []
      }

      const tongitsScoreItems = []
      for (const row of item.extend.pokerExtend.tongitsScoreItems) {
        const antes = row.antes
        for (const key of Object.keys(row)) {
          if (key === 'antes') continue
          tongitsScoreItems.push({
            antes: antes * 1000,
            score: row[key] * 1000,
            scoreWay: parseInt(key)
          })
        }
      }
      item.extend.pokerExtend.tongitsScoreItems = tongitsScoreItems

      return item
    },
    handleSave() {
      const item = this.getPostItem()
      const data = {...item}
      data.activity = JSON.stringify(item.activity)
      data.extend = JSON.stringify(item.extend)

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
          } else {
            $this.updateData(data)
          }
        })
      } else {
        this.createData(data)
      }
    },
    createData(data) {
      request({
        url: '/rankingconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    updateData(data) {
      request({
        url: '/rankingconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    //************************ 修改/添加弹框相关 ************************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.id)
        this.edit.visible = true
      }
    },
    handleEditDialogOpened() {
      console.log('handleEditDialogOpened edit:' + this.edit.isEdit)
      if (this.edit.isEdit) {
        this.$refs.tree.setCheckedKeys(this.edit.item.activity.gameIdList)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    initFormData(bEdit, ID) {
      console.log('initFormData bEdit:', bEdit, ' ID:', ID)
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          const item = JSON.parse(JSON.stringify(_data))
          item.activity.startTime *= 1000
          item.activity.endTime *= 1000
          item.activity.showEndTime *= 1000
          item.extend.minBet /= 1000
          item.extend.minScore /= 1000
          item.extend.maxReward /= 1000
          item.extend.progressReward /= 1000

          for (const hotTime of item.extend.hotTimes) {
            hotTime.startTime = new Date().setTime(hotTime.startTime * 1000)
            hotTime.endTime = new Date().setTime(hotTime.endTime * 1000)
            hotTime.scoreRatio /= 100
          }

          for (const reward of item.extend.rewardList) {
            reward.reward /= 1000
          }

          if (item.activity.whitelist.uidList.length > 0) {
            item.activity.whitelist.uidList = item.activity.whitelist.uidList.join(',')
          } else {
            item.activity.whitelist.uidList = ''
          }

          const tongitsScoreItems = []
          for (const row of item.extend.pokerExtend.tongitsScoreItems) {
            let row2 = tongitsScoreItems.find(item => item.antes === row.antes / 1000)
            if (row2) {
              row2[row.scoreWay.toString()] = row.score / 1000
            } else {
              row2 = {
                antes: row.antes / 1000
              }
              row2[row.scoreWay.toString()] = row.score / 1000
              tongitsScoreItems.push(row2)
            }
          }
          item.extend.pokerExtend.tongitsScoreItems = tongitsScoreItems

          this.edit.item = item

          console.log('initFormData item:', item)

          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }

          // 更新选中游戏的排序
          this.updateGamesSorted()

          console.log('this.edit.item.activity.gameIdList:', this.edit.item.activity.gameIdList)
        }
      } else {
        this.edit.item = {}
      }
    },
    handleAdd() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
      console.log(this.edit.item)
    },
    onChangeEndTime() {
      if (this.edit.item.activity.endTime <= this.edit.item.activity.startTime) {
        Message.error('结束时间不能早于活动开始时间')
        return
      }
      this.edit.item.activity.showEndTime = this.edit.item.activity.endTime + 1000 * 60 * 60 * 24
    },
    //************************ 修改/添加弹框相关 ************************
    //************************ 规则图片相关 ************************
    addRuleImage(type) {
      console.log('addRuleImage type:', type)
      if (type === 'Hor') {
        this.edit.item.activity.ruleImgHor.push('')
      } else {
        this.edit.item.activity.ruleImgVer.push('')
      }
    },
    removeRuleImage(index, type) {
      console.log('removeRuleImage index:', index, 'type:', type)
      if (type === 'Hor') {
        this.edit.item.activity.ruleImgHor.splice(index, 1)
      } else {
        this.edit.item.activity.ruleImgVer.splice(index, 1)
      }
    },
    //************************ 规则图片相关 ************************
    //************************ 游戏列表相关 ************************
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: {status : 2}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1 || this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }

            const game = {Gid: obj.Gid, Name: obj.Name, Description: obj.Description}
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          for (const key in data) {
            const games = data[key]
            const cty = {id: 'p-' + key, label: categories[key], children: []}

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({id: game.Gid, label: game.Name})
            }
            this.treeData.push(cty)
          }

          console.log(data)
        }
      })
    },
    updateGamesSorted() {
      this.GamesSorted = []
      if (this.edit.item.activity.gameIdList === undefined || this.edit.item.activity.gameIdList.length === 0) {
        return
      }
      for (let i = 0; i < this.edit.item.activity.gameIdList.length; i++) {
        const gameId = this.edit.item.activity.gameIdList[i]
        let name = ''
        for (let j = 0; j < this.treeData.length; j++) {
          const cty = this.treeData[j]
          for (let k = 0; k < cty.children.length; k++) {
            const game = cty.children[k]
            if (game.id === gameId) {
              name = game.label
              break
            }
          }
        }
        this.GamesSorted.push({GameId: gameId, Name: name, OrderNo: i+1})
      }
    },
    handleGameCheckChange(data, checked, indeterminate) {
      console.log('handleGameCheckChange', data, checked, indeterminate)
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      const index = this.edit.item.activity.gameIdList.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          this.edit.item.activity.gameIdList.push(data.id)
        }
      } else {
        if (index >= 0) {
          this.edit.item.activity.gameIdList.splice(index, 1)
        }
      }

      // 更新选中游戏的排序
      this.updateGamesSorted()

      console.log(this.edit.item.activity.gameIdList)
    },
    showGamesSortDialog() {
      this.edit.gamesSortDialogVisible = true
    },
    saveGamesSort() {
      this.edit.gamesSortDialogVisible = false
      // 根据排序编号重新排序
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
      // 保存排序
      this.edit.item.activity.gameIdList = []
      this.GamesSorted.forEach(item => {
        this.edit.item.activity.gameIdList.push(item.GameId)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    //************************ 游戏列表相关 ************************
    //************************ 游戏场次底注列表相关 ************************
    async getGameAnteTables() {
      const gameIds = this.edit.item.gameIdList || []
      for (const gameId of gameIds) {
        let list = []
        switch (gameId) {
          case 22:
            list =  await this.getTongitsAnteList(1)
            break
          case 28:
            list =  await this.getTongitsAnteList(2)
            break
          case 29:
            list =  await this.getTongitsAnteList(3)
            break
          default:
            console.log('getGameAnteTables gameId: ', gameId, ' not supported',)
        }
        this.edit.gameAntesMap[gameId] = list
      }
    },
    async getTongitsAnteList(playMode) {
      const response = await request({
        url: '/tongitstable/all',
        method: 'get',
        data: {
          PlayMode: playMode
        }
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          if (objs[i].TableMoney === 0 || objs[i].Status !== 2) {
            continue
          }
          anteTables.push(objs[i].TableMoney / 1000)
        }
        anteTables = Array.from(new Set(anteTables)) // 去重
        anteTables.sort((x, y) => x - y)
      }

      console.log('getTongitsAnteList anteTables: ', anteTables)
      return anteTables
    },
    //************************ 热门时段相关 ************************
    handleAddHotTime() {
      this.edit.item.extend.hotTimes.push({
        startTime: '',
        endTime: '',
        scoreRatio: 1
      })
    },
    handleDelHotTime(index) {
      this.edit.item.extend.hotTimes.splice(index, 1)
    },
  }
}
</script>

<style scoped>

</style>
