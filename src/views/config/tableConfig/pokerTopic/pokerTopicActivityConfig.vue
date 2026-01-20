<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="PokerTopicActivityConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
        <span style="margin-left: 15px; color: red">注意：客户端包已被剔除，如需开启需要先联系客户端处理</span>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable"
        :data="tableData"
        stripe border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange">
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
        <el-table-column prop="EndTime" label="展示结束时间" sortable="custom" width="180">
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
            <el-button v-if="scope.row.Status!==2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.Status!==2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status===2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
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
    </div>
    <el-dialog :title="getEditTitle()"
       :visible.sync="edit.visible"
       :close-on-click-modal="false"
       :close-on-press-escape="false"
       @opened="handleEditDialogOpened"
       width="60%"
    >
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
        <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="活动信息配置">
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
                  <el-date-picker v-model="edit.item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="结束时间：">
                  <el-date-picker v-model="edit.item.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" @change="onEndTimeChange" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="展示结束时间：">
                  <el-date-picker v-model="edit.item.EntryCloseTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" size="mini" />
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
                <el-form-item label="跑马灯最小金额：" prop="item.MarqueeMiniReward" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-input v-model.number="edit.item.MarqueeMiniReward">
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="display: none">
              <el-col :span="11">
                <el-form-item label="参与活动的游戏：" :required="true" prop="item.Games">
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
            <el-row>
              <el-col :span="11">
                <el-form-item label="勾选支持的游戏：" :required="true">
                  <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                  </el-input>
                  <el-tree
                    :data="treeData"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check-change="handleGameCheckChange"
                  >
                  </el-tree>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="底注场次积分系数配置" name="ScoreCoefficient">
            <el-row>
              <el-col>
                <el-table
                  :data="edit.item.GameAnteScoreCoefficients"
                >
                  <el-table-column
                    prop="GameId"
                    label="游戏ID"
                    width="80"
                  />
                  <el-table-column
                    prop="GameId"
                    label="游戏名称"
                    width="180"
                  >
                    <template slot-scope="scope">
                      {{ getGameName(scope.row.GameId) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="底注场次积分系数"
                  >
                    <template slot-scope="scope">
                      <el-table :data="scope.row.AnteScoreCoefficients">
                        <el-table-column
                          prop="Ante"
                          label="底注场次"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.Ante / 1000}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="Score"
                          label="积分系数"
                        >
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.ScoreCoefficient" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="成就奖励配置">
            <el-row>
              <el-col>
                <el-button type="primary" @click="addAchievementRewards()" size="mini">添加配置</el-button>
                <el-table
                    :data="edit.item.AchievementRewards"
                    border
                    style="width: 100%"
                    :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="ID"
                    label="成就ID"
                    width="70"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.ID" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ID"
                    label="成就名称"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Name" oninput=" if(value === '' || value == null){value = '';} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ID"
                    label="成就描述"
                    width="260"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Description" oninput=" if(value === '' || value == null){value = '';} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ScoreRequired"
                    label="积分要求"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.ScoreRequired" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propType"
                    label="道具类型"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.PropType" placeholder="请选择道具类型" @change="updatePropOptions(scope.row.PropType, scope.$index)">
                        <el-option
                          v-for="item in propTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propId"
                    label="道具名称"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.PropId" placeholder="请选择道具">
                        <el-option
                          v-for="item in propOptions[scope.$index]"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propExpireDays"
                    label="可用时间"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.PropExpireDays" v-if="scope.row.PropType === 2" placeholder="请选择可用时间">
                        <el-option
                          v-for="item in propDayTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propNum"
                    label="数量"
                    width="70"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.PropNum" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" column-key="op" width="75">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-delete" @click="removeAchievementRewards(scope.$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="白名单配置">
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.AppWhitelist">
                  <el-select v-model="edit.item.AppWhitelist" placeholder="请选择" style="width: 400px">
                    <el-option
                      v-for="item in appIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="SiteId白名单：" prop="item.SiteWhitelist">
                  <SiteSelect v-model="edit.item.SiteWhitelist" multiple placeholder="请选择" style="width: 400px" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-row style="margin-top: 10px;">
        <el-col :span="12">
          <el-button type="primary" size="medium" @click="save">保存配置</el-button>
        </el-col>
      </el-row>
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
import SiteSelect from '@/components/SiteSelect/index.vue'

const filterMap = {}

function newItem() {
  return {
    TopicName: '',
    StartTime: Date.parse(new Date().toString()),
    EndTime: Date.parse(new Date().toString()),
    ResetCycle: 7,
    MarqueeMiniReward: 0,
    Games: '',
    CycleNumber: '',
    EntryCloseTime: Date.parse(new Date().toString()),
    AppWhitelist: [],
    SiteWhitelist: [],
    AchievementRewards: [],
    GameAnteScoreCoefficients: []
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
  components: { Compare, Publish, GameLevel, MoneyInput, SiteSelect },
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

      gameOptions: [
        {
          value: 37,
          label: 'BlackJack'
        },
        {
          value: 23,
          label: 'Lucky9'
        },
        {
          value: 21,
          label: 'Pusoy'
        },
        {
          value: 126,
          label: 'Pusoy Wild'
        },
        {
          value: 15,
          label: 'Texas Poker'
        },
        {
          value: 22,
          label: 'Tongits'
        },
        {
          value: 28,
          label: 'Tongits Joker'
        },
        {
          value: 29,
          label: 'Tongits Quick'
        }
      ],

      edit: {
        visible: false,
        cyclesVisible: false,
        activityId: 0,
        item: newItem(),
        isEdit: false,
        selectedGamesText: '',
        gameAnteMap: {},
      },
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()) + 86400 * 7 * 1000,
      games: [],
      defaultGames: [15, 21, 22, 28],
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
        SiteWhitelist: 'SiteId站点',
        MarqueeMiniReward: '跑马灯最小金额',
        AchievementRewards: '成就奖励',
        GameAnteScoreCoefficients: '底注场次积分系数'
      },
      CyclesAttrNames: {
        ID: 'ID',
        ActivityId: '活动ID',
        ActivityCycle: '周期编号',
        Number: '第几期',
        Period: '时长（天）',
        StartTime: '开始时间',
        EndTime: '结束时间'
      },
      appIdOptions: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: 'GP-BP测试1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        }
      ],
      filterText: '',

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      },

      filterGameIds: [ 2031, 10002 ],

      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],

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

      // 道具数据列表
      propList: [],
      // 道具有效时长列表
      propTimeList: [],
      // 道具选项列表
      propOptions: {},

      // 道具类型选项列表
      propTypeOptions: [
        //{ 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        //{ 'value': 3, 'label': '德州门票', disabled: false },
        //{ 'value': 4, 'label': '德州头像框', disabled: false }
      ],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ]
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  mounted() {
    this.getGameAll()
    this.getPropList()
  },
  methods: {
    getGameName(id) {
      return this.gameOptions.find(item => item.value === id)?.label
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

    onGameOptionsChange() {
      console.log('selected games', this.games)
      this.edit.item.Games = this.games.join(',')
      this.$refs.tree.setCheckedKeys(this.games)
    },

    onEndTimeChange(val) {
      if (val < this.edit.item.StartTime) {
        this.$alert('结束时间不能小于开始时间：' + new Date(this.edit.item.StartTime).Format('yyyy-MM-dd HH:mm:ss'), '活动周期')
        return
      }
      if (val > this.edit.item.EntryCloseTime) {
        this.edit.item.EntryCloseTime = val
      }
      this.edit.item.ResetCycle = parseInt((this.edit.item.EndTime - this.edit.item.StartTime + 1000) / 1000 / 86400)
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
    handleEditDialogOpened() {
      console.log('handleEditDialogOpened edit:' + this.edit.isEdit)
      if (this.edit.isEdit) {
        const gameIds = this.edit.item.Games.split(',')
        this.$refs.tree.setCheckedKeys(gameIds)
      } else {
        this.$refs.tree.setCheckedKeys([])
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
          const item = JSON.parse(JSON.stringify(_data))
          item.StartTime *= 1000
          item.EndTime *= 1000
          item.EntryCloseTime *= 1000
          item.MarqueeMiniReward /= 1000

          this.games = []
          const games = item.Games.split(',')
          for (const i in games) {
            this.games.push(parseInt(games[i]))
          }

          item.AppWhitelist = item.AppWhitelist?.split(',').map(item => parseInt(item))[0] ?? 0
          item.SiteWhitelist = item.SiteWhitelist.split(',')
          item.AchievementRewards = item.AchievementRewards ? JSON.parse(item.AchievementRewards) : []
          item.GameAnteScoreCoefficients = item.GameAnteScoreCoefficients ? JSON.parse(item.GameAnteScoreCoefficients) : []

          for (let i = 0; i < item.AchievementRewards.length; i++) {
            const achievementReward = item.AchievementRewards[i]
            this.updatePropOptions(achievementReward.PropType, i)
          }

          for (const i in item.GameAnteScoreCoefficients) {
            const obj = item.GameAnteScoreCoefficients[i]
            for (const j in obj.AnteScoreCoefficients) {
              const anteObj = obj.AnteScoreCoefficients[j]
              anteObj.ScoreCoefficient = anteObj.ScoreCoefficient / 10
            }
          }

          this.edit.item = item
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
      postData.StartTime /= 1000
      postData.EndTime /= 1000
      postData.EntryCloseTime /= 1000
      postData.CycleNumber = new Date(postData.StartTime*1000).Format('yyyyMMdd')
      postData.MarqueeMiniReward *= 1000
      postData.Games = this.games.join(',')
      postData.AppWhitelist = this.edit.item.AppWhitelist
      postData.SiteWhitelist = this.edit.item.SiteWhitelist.join(',')
      postData.AchievementRewards = JSON.stringify(this.edit.item.AchievementRewards)

      for (const i in postData.GameAnteScoreCoefficients) {
        const obj = postData.GameAnteScoreCoefficients[i]
        for (const j in obj.AnteScoreCoefficients) {
          const anteObj = obj.AnteScoreCoefficients[j]
          anteObj.ScoreCoefficient = parseInt(parseFloat(anteObj.ScoreCoefficient) * 10)
        }
      }

      postData.GameAnteScoreCoefficients = JSON.stringify(this.edit.item.GameAnteScoreCoefficients)

      console.log('dataToPost ', postData)
      return postData
    },
    checkData() {
      if (this.startTime > this.endTime) {
        Message.warning('开始时间不能大于结束时间，请检查数值正确性！')
        return false
      }

      const achievementRewardIDs = []
      for (const i in this.edit.item.AchievementRewards) {
        const obj = this.edit.item.AchievementRewards[i]
        if (achievementRewardIDs.indexOf(obj.ID) >= 0) {
          Message.warning('不能重复添加相同成就ID的配置！')
          return false
        }
        achievementRewardIDs.push(obj.ID)

        if (obj.ScoreRequired <= 0) {
          Message.warning('积分要求不能小于等于0，请检查数值正确性！成就ID：' + obj.ID + '，成就名称：' + obj.Name + '')
          return false
        }
        if (obj.PropNum <= 0) {
          Message.warning('道具数量不能小于等于0，请检查数值正确性！成就ID：' + obj.ID + '，成就名称：' + obj.Name + '')
          return false
        }
      }

      for (const i in this.edit.item.GameAnteScoreCoefficients) {
        const obj = this.edit.item.GameAnteScoreCoefficients[i]
        for (const j in obj.AnteScoreCoefficients) {
          const anteObj = obj.AnteScoreCoefficients[j]
          if (anteObj.ScoreCoefficient <= 0) {
            Message.warning('积分系数不能小于等于0，请检查数值正确性！游戏：' + this.getGameName(obj.GameId) + '， 底注场次：' + anteObj.Ante/1000 + '')
            return false
          }
        }
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      if (!ValidateVueItem(this.$refs['edit'])) return false

      const postData = this.getPostData()
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(postData)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave(postData)
          }
        })
      } else {
        this.createSave(postData)
      }
      this.edit.visible = false
    },
    //************************ 游戏列表相关 ************************
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
          anteTables.push(objs[i].TableMoney)
        }
        anteTables = Array.from(new Set(anteTables)) // 去重
        anteTables.sort((x, y) => x - y)
      }

      console.log('getTongitsAnteList anteTables: ', anteTables)
      return anteTables
    },
    async getLucky9AnteList() {
      const response = await request({
        url: '/lucky9table/all',
        method: 'get',
        data: {}
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          anteTables.push(objs[i].TableMoney) // 去重
        }
        anteTables = Array.from(new Set(anteTables))
        anteTables.sort((x, y) => x - y)
      }

      console.log('getLucky9AnteList anteTables: ', anteTables)
      return anteTables
    },
    async getBlackjackAnteList() {
      const response = await request({
        url: '/blackjacktable/all',
        method: 'get',
        data: {}
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          anteTables.push(objs[i].TableMoney)
        }
        anteTables = Array.from(new Set(anteTables))
        anteTables.sort((x, y) => x - y)
      }

      console.log('getBlackjackAnteList anteTables: ', anteTables)
      return anteTables
    },
    async getPusoyAnteList() {
      const response = await request({
        url: '/pusoytable/all',
        method: 'get',
        data: {}
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          anteTables.push(objs[i].TableMoney)
        }
        anteTables = Array.from(new Set(anteTables))
        anteTables.sort((x, y) => x - y)
      }

      console.log('getPusoyAnteList anteTables: ', anteTables)
      return anteTables
    },
    async getPusoyWildAnteList() {
      const response = await request({
        url: '/pusoywildtable/all',
        method: 'get',
        data: {}
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          anteTables.push(objs[i].TableMoney)
        }
        anteTables = Array.from(new Set(anteTables))
        anteTables.sort((x, y) => x - y)
      }

      console.log('getPusoyAnteList anteTables: ', anteTables)
      return anteTables
    },
    async getTexasAnteList() {
      const response = await request({
        url: '/texastable/all',
        method: 'get',
        data: {}
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          anteTables.push(objs[i].SmallBlind)
        }
        anteTables = Array.from(new Set(anteTables))
        anteTables.sort((x, y) => x - y)
      }

      console.log('getTexasAnteList anteTables: ', anteTables)
      return anteTables
    },
    async getGameAnteTables(gameId) {
      switch (gameId) {
        case 22:
          return await this.getTongitsAnteList(1)
        case 28:
          return await this.getTongitsAnteList(2)
        case 29:
          return await this.getTongitsAnteList(3)
        case 23:
          return await this.getLucky9AnteList()
        case 37:
          return await this.getBlackjackAnteList()
        case 21:
          return await this.getPusoyAnteList()
        case 126:
          return await this.getPusoyWildAnteList()
        case 15:
          return await this.getTexasAnteList()
      }
      console.log('getGameAnteTables gameId: ', gameId, ' not supported',)
      return []
    },
    async addGameAnteScoreCoefficients(gameId) {
      const index = this.edit.item.GameAnteScoreCoefficients.findIndex(item => item.GameId === gameId)
      if (index >= 0) {
        return
      }

      const anteTables = await this.getGameAnteTables(gameId)

      const item = {
        GameId: gameId,
        AnteScoreCoefficients: []
      }

      console.log('addGameAnteScoreCoefficients gameId: ', gameId, ' anteTables: ', anteTables)

      for (let i = 0; i < anteTables.length; i++) {
        const anteTable = anteTables[i]
        item.AnteScoreCoefficients.push({
          Ante: anteTable,
          ScoreCoefficient: 1
        })
      }

      this.edit.item.GameAnteScoreCoefficients.push(item)
      // 按游戏名首字母排序
      this.edit.item.GameAnteScoreCoefficients.sort((x, y) => {
        const xName = this.getGameName(x.GameId)
        const yName = this.getGameName(y.GameId)
        return xName.charCodeAt(0) - yName.charCodeAt(0)
      })
    },
    removeGameAnteScoreCoefficients(gameId) {
      const index = this.edit.item.GameAnteScoreCoefficients.findIndex(item => item.GameId === gameId)
      if (index >= 0) {
        this.edit.item.GameAnteScoreCoefficients.splice(index, 1)
      }
    },
    async initGameAnteScoreCoefficients() {
      for (const i in this.games) {
        await this.addGameAnteScoreCoefficients(this.games[i])
      }
    },
    handleTabClick(tab) {
      console.log('handleTabClick tab: ', tab.name)
      if (tab.name === 'ScoreCoefficient') {
        this.initGameAnteScoreCoefficients()
      }
    },
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
            const index = this.gameOptions.findIndex(item => item.value === obj.Gid)
            if (index < 0) {
              continue
            }
            if (obj.Status !== 2 || // obj.Status 2=上架
              obj.CategoryID !== 2 || // obj.CategoryID 2=Poker类游戏
              obj.ShowDatacenter !== 1 ||
              this.filterGameIds.indexOf(obj.Gid) >= 0) {
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
            cty.children.sort(function(a, b) {
              return a.label.localeCompare(b.label)
            })
            this.treeData.push(cty)
          }

          console.log(data)
        }
      })
    },
    updateGamesSorted() {
      this.GamesSorted = []
      this.edit.selectedGamesText = ''
      if (this.games === undefined || this.games.length === 0) {
        return
      }

      const gameTextList = []

      for (let i = 0; i < this.games.length; i++) {
        const gameId = this.games[i]
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
        gameTextList.push(name + '[' + gameId + ']')
      }

      this.edit.selectedGamesText = gameTextList.join(' ')
    },
    async handleGameCheckChange(data, checked, indeterminate) {
      console.log('handleGameCheckChange', data, checked, indeterminate)
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        console.log('handleGameCheckChange', 'Slot/Poker/Casino')
        return
      }

      const idIndex = this.games.indexOf(data.id)
      if (checked) {
        if (idIndex < 0) {
          this.games.push(data.id)
        }
      } else {
        if (idIndex >= 0) {
          this.games.splice(idIndex, 1)
        }
        this.removeGameAnteScoreCoefficients(data.id)
      }

      // 更新选中游戏的排序
      this.updateGamesSorted()

      console.log('this.games:', this.games)
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
      this.games = []
      this.GamesSorted.forEach(item => {
        this.games.push(item.GameId)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    //************************ 游戏列表相关 ************************
    //************************ 成就奖励相关 ************************
    getPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            //this.propTotal = objs.total
            this.propList = []
            this.propList = objs.list
          }
        } else {
          //this.propTotal = objs.total
          this.propList = []
        }
      })
    },
    updatePropOptions(propType, index) {
      this.propOptions[index] = []
      let currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        if (this.propList[i].item_type === 4) {
          console.log(this.propList[i])
        }
        if (this.propList[i].item_type === propType && this.propList[i].status === 1) {
          if (this.propList[i].item_type !== 2 && this.propList[i].item_type !== 4) {
            let expTime = this.propList[i].expire_time * 1000
            if (currTime < expTime) {
              let dataList = { 'value': this.propList[i].id, 'label': this.propList[i].item_name, disabled: false }
              this.propOptions[index].push(dataList)
            }

          } else {
            let dList = { 'value': this.propList[i].id, 'label': this.propList[i].item_name, disabled: false }
            this.propOptions[index].push(dList)
          }
        }
      }
    },
    addAchievementRewards() {
      const item = {
        ID: 0,
        Name: '',
        Description: '',
        ScoreRequired: 0,
        PropId: 0,
        PropType: 2,
        PropNum: 0,
        PropNumMax: 0,
        PropExpireDays: 1
      }
      this.edit.item.AchievementRewards.push(item)
      const index = this.edit.item.AchievementRewards.length - 1
      this.updatePropOptions(item.PropType, index)
    },
    removeAchievementRewards(index) {
      this.edit.item.AchievementRewards.splice(index, 1)
    },
    //************************ 成就奖励相关 ************************
  }
}
</script>
