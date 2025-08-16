<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="新手任务活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="活动开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item label="活动开始时间：">
                    <el-date-picker v-model="item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：">
                    <el-date-picker v-model="item.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item label="隐藏开始时间：">
                    <el-date-picker v-model="item.LimitStartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="隐藏结束时间：">
                    <el-date-picker v-model="item.LimitEndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="单人总发放限制：" :required="true">
                    <el-input v-model.number="item.SingleLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="每日总发放限制：" :required="true">
                    <el-input v-model.number="item.EveryDayLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="活动总发放限制：" :required="true">
                    <el-input v-model.number="item.SumLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
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
                    @check-change="handleCheckChange"
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
        </el-tab-pane>

        <el-tab-pane label="任务配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate(1)">
            添加配置
          </el-button>

          <el-form ref="taskCfgData" v-model="item.taskCfgData" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.taskCfgData"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="Id"
                label="配置ID"
                sortable
                width="200"
              />
              <el-table-column
                prop="GameType"
                label="比赛"
                width="200"
              >
              <template slot-scope="scope">
                {{ getMatchTypeName(scope.row.GameType, 1) }}
              </template>
              </el-table-column>

              <el-table-column
                prop="MatchNum"
                label="局数"
                width="200"
              />
              <el-table-column
                prop="RewardNum"
                label="奖励（投注金）"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="RatioNum"
                label="进度"
                width="200"
              >
                <template slot-scope="scope">
                  {{getShowNumber(scope.row.RatioNum)}}%
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
                    @click="handleEdit(scope.row, 1)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleDelete(scope.row, 1)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Poker任务配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate(2)">
            添加配置
          </el-button>
          <el-form ref="item" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="AppId：" prop="item.WhitelistCfg.AppIdList">
                  <el-select v-model="item.AppId" placeholder="请选择" style="width: 400px" @change="getFilter">
                    <el-option label="全部" :value="-1" />
                    <el-option
                      v-for="item in appidInfoCfgs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form ref="taskCfgData" v-model="item.pokerCfgData" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.pokerCfgData"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="Id"
                label="配置ID"
                sortable
                width="200"
              />
              <el-table-column
                prop="GameType"
                label="比赛"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getMatchTypeName(scope.row.GameType, 2) }}
                </template>
              </el-table-column>

              <el-table-column
                prop="MatchNum"
                label="局数"
                width="200"
              />
              <el-table-column
                prop="RewardNum"
                label="奖励（投注金）"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="RatioNum"
                label="进度"
                width="200"
              >
                <template slot-scope="scope">
                  {{getShowNumber(scope.row.RatioNum)}}%
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
                    @click="handleEdit(scope.row, 2)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleDelete(scope.row, 2)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

        <el-dialog
          :title="getEditTitle()"
          :visible.sync="edit.visible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
            <el-form-item label="配置ID：" :required="true" prop="Id">
              <el-col :span="15">
                <el-input v-model.number="edit.item.Id" :disabled="edit.isEdit"  placeholder="请填写配置id描述"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="局数：" :required="true" prop="MatchNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.MatchNum" placeholder="请填写局数"/>
              </el-col>
            </el-form-item>
            <el-form-item label="奖励（投注金）：" :required="true" prop="RewardNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.RewardNum" />
              </el-col>
            </el-form-item>
            <el-form-item label="进度：" :required="true" prop="RatioNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.RatioNum" />
              </el-col>
            </el-form-item>
            <el-form-item label="任务类型：" :required="true" prop="TaskType">
              <el-col :span="15">
                <el-input v-model.number="edit.item.TaskType" placeholder="请填写任务类型"/>
              </el-col>
            </el-form-item>
            <el-form-item v-if="edit.cfgType == 1" label="比赛：">
              <el-checkbox-group v-model="edit.item.GameType" :disabled="edit.item.TaskType === 2" style="width: 700px">
                <el-checkbox v-for="item in gameCfgs" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="edit.cfgType == 2" label="比赛：">
              <el-select   v-model="edit.item.GameType" :disabled="edit.item.TaskType === 2" multiple placeholder="请选择" style="width: 250px">
                <el-option
                  v-for="item in matchUniqueIdCfgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-dialog>

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col>
                <el-form-item label="白名单开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.IsWhite" :active-value="true" :inactive-value="false" />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="SiteId白名单：" prop="item.WhitelistCfg.AppIdList">
                  <el-select v-model="item.WhitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px" @change="onSiteIdOptionsChange">
                    <el-option
                      v-for="item in siteIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="uid白名单：" prop="item.WhitelistCfg.UidList">
                  <el-input v-model="item.CurId" placeholder="Uid"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addWhite">添加</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 30px">
              <h3 style="text-align:center;">开放白名单</h3>
              <el-col :span="24">
                <div style="padding-top: 10px">
                  <el-table
                    :data="item.WhitelistCfg.UidList"
                    stripe
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      label="UID"
                      prop="uid"
                    />
                    <el-table-column
                      label="操作"
                    >
                      <template scope="scope">
                        <el-button
                          size="mini"
                          type="danger"
                          @click="delRow(scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        title="给选中游戏排序"
        :visible.sync="edit.gamesSortDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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

      <el-row>
        <br>
        <el-button type="primary" @click="updateData">保存</el-button>
      </el-row>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from "@/components/Publish/index.vue";
import {$libShow, ClientTableData, DataRule} from "@/utils/common";
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";
import {Message} from "element-ui";
import request from "@/utils/request";
import Compare from "@/components/Compare/index.vue";
import store from '@/store'
import {getCustomize, updateCustomize} from "@/api/custome_configV2";

function newPrizePoolCfg() {
  return {
    Id: 0,
    MatchNum: 0,
    RewardNum: 0,
    RatioNum: 0,
    TaskType: 0,
    GameType: []
  }
}

export default {
  components: {Compare, ImagePicker, Publish},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    gameIdCfg(val) {

    }
  },
  data() {
    return {
      subKey: 'newbie_task_cfg',
      libShow: $libShow,
      form: {
        Data: {}
      },
      total: 0,
      tableData: [],
      IsUpdate: false,
      item: {
        IsOpen: true,
        StartTime: 0,
        EndTime: 0,
        LimitStartTime: 0,
        LimitEndTime: 0,
        SockGainRatio: 10,
        RuleImgHor: [],
        RuleImgVer: [],
        RewardUseSceneId: 0,
        SingleLimitNum: 0,
        EveryDayLimitNum: 0,
        SumLimitNum: 0,
        AppId: -1,
        PrizePoolCfg: [],
        GameIdCfg: [21, 22, 2031, 10002],
        WhitelistCfg: {
          AppIdList: [],
          SiteIdList: [],
          UidList: []
        },
        CurId: '',
        IsWhite: true,
        taskCfgData: [
          {Id: 1, GameType: [21, 22], MatchNum: 1, RewardNum: 1, RatioNum: 10000, TaskType: 1},
          {Id: 2, GameType: [21, 22], MatchNum: 10, RewardNum: 5, RatioNum: 50000, TaskType: 1},
          {Id: 3, GameType: [21, 22], MatchNum: 10, RewardNum: 0, RatioNum: 80000, TaskType: 1},
          {Id: 4, GameType: [21, 22], MatchNum: 20, RewardNum: 0, RatioNum: 90000, TaskType: 1},
          {Id: 5, GameType: [21, 22], MatchNum: 30, RewardNum: 0, RatioNum: 95000, TaskType: 1},
          {Id: 6, GameType: [21, 22], MatchNum: 40, RewardNum: 0, RatioNum: 98000, TaskType: 1},
          {Id: 7, GameType: [21, 22], MatchNum: 50, RewardNum: 0, RatioNum: 99900, TaskType: 1},
          {Id: 8, GameType: [21, 22], MatchNum: 1, RewardNum: 100, RatioNum: 100000, TaskType: 2},
        ],
        pokerCfgData: [
          {Id: 1, GameType: [10007], MatchNum: 1, RewardNum: 1, RatioNum: 10000, TaskType: 1},
          {Id: 2, GameType: [10007], MatchNum: 10, RewardNum: 5, RatioNum: 50000, TaskType: 1},
          {Id: 3, GameType: [10007], MatchNum: 10, RewardNum: 0, RatioNum: 80000, TaskType: 1},
          {Id: 4, GameType: [10007], MatchNum: 20, RewardNum: 0, RatioNum: 90000, TaskType: 1},
          {Id: 5, GameType: [10007], MatchNum: 30, RewardNum: 0, RatioNum: 95000, TaskType: 1},
          {Id: 6, GameType: [10007], MatchNum: 40, RewardNum: 0, RatioNum: 98000, TaskType: 1},
          {Id: 7, GameType: [10007], MatchNum: 50, RewardNum: 0, RatioNum: 99900, TaskType: 1},
          {Id: 8, GameType: [10007], MatchNum: 1, RewardNum: 100, RatioNum: 100000, TaskType: 2},
        ]
      },

      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],

      RaffleLevelList: [
        { label: 200, value: 200 },
        { label: 500, value: 500 },
        { label: 1000, value: 1000 },
        { label: 2000, value: 2000 },
        { label: 5000, value: 5000 },
        { label: 10000, value: 10000 },
        { label: 20000, value: 20000 },
        { label: 50000, value: 50000 }
      ],

      edit: {
        raffleLevel: 0,
        visible: false,
        item: newPrizePoolCfg(),
        isEdit: false,
        gamesSortDialogVisible: false,
        cfgType: 0
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

      siteIdOptions: [
        { value: 'BP', label: 'BP' },
        { value: 'AP', label: 'AP' },
        { value: 'GP', label: 'GP' },
        { value: 'TP', label: 'TP' },
        { value: 'PG', label: 'PG' },
        { value: 'Dev', label: 'Dev' }
      ],

      // 奖励类型
      rewardTypes: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],

      // 投注金
      betScenes: [
        { 'value': 1, 'label': '任意游戏投注' },
        { 'value': 2, 'label': '仅限Poker类游戏投注' },
        { 'value': 3, 'label': '仅限Slots类游戏投注' },
        { 'value': 4, 'label': '仅限Tongits游戏投注' }
      ],
      // 返水金
      rebateScenes: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
      ],
      gameCfgs: [
        { 'value': 21, 'label': 'Pusoy' },
        { 'value': 22, 'label': 'Tongtis' }
        // {"value": 15, "label":"德州"}
      ],
      pokerCfgs: [
        { 'value': 2031, 'label': 'poker' }
      ],
      filterGameIds: [],

      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1000008, 'label': 'gli' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      matchUniqueIdCfgs: [
        { 'value': 10001, 'label': '188Free' },
        { 'value': 10002, 'label': '12888Free' },
        { 'value': 10003, 'label': 'P10' },
        { 'value': 10004, 'label': 'P20' },
        { 'value': 10005, 'label': 'P40' },
        { 'value': 10006, 'label': 'P100' },
        { 'value': 10007, 'label': 'P300' },
        { 'value': 10008, 'label': 'GTCC 2005' },
        { 'value': 10009, 'label': 'Yamaha Moto' }
      ],
      PokerInfoCfg: [],
      filterText: '',

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      todayRaffleAmount: 0
    }
  },
  created() {
    this.getData()
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCreate(nType) {
      this.edit.item = newPrizePoolCfg()
      this.edit.isEdit = false
      this.edit.visible = true
      this.edit.cfgType = nType
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
      this.item.GameIdCfg = []
      this.GamesSorted.forEach(item => {
        this.item.GameIdCfg.push(item.GameId)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    // 操作类函数
    clickData(row, column, event) {
      if (row.status === 2) {
        return null
      }
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.RaffleLevel)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, raffleLevel) {
      this.edit.isEdit = bEdit
      if (raffleLevel) {
        const _data = this.getDataByTableMoney(raffleLevel)
        if (_data) {
          this.edit.raffleLevel = raffleLevel
          Object.assign(this.edit.item, _data)
        }
      }
    },
    handleEdit(ob, nType) {
      this.edit.cfgType = nType
      this.initFormData(true, ob.Id)
      this.edit.visible = true
    },
    handleDelete(ob, nType) {
      let $this = this
      this.$confirm('是否确认删除此奖池配置?', '提示', {type:'warning'}).then(() => {
        if (nType === 1) {
          const delIndex = $this.item.taskCfgData.findIndex(item => item.Id === ob.Id)
          this.item.taskCfgData.splice(delIndex, 1)
        } else if (nType === 2) {
          const delIndex = $this.item.pokerCfgData.findIndex(item => item.Id === ob.Id)
          this.item.pokerCfgData.splice(delIndex, 1)
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    handlePrizeCreate() {
      this.edit.item.PrizeCfg.push({ Reward: 0, Weight: 0, PrizeNum: 0, PrizeUnlimited: true })
    },
    onCompare(pre,pro) {
      const preVal=JSON.parse(pre.Data)
      const proVal=JSON.parse(pro.Data)
      let str = ''
      if ((preVal.IsOpen !== proVal.IsOpen) || (preVal.StartTime !== proVal.StartTime) ||
        (preVal.EndTime !== proVal.EndTime) || (preVal.LimitStartTime !== proVal.LimitStartTime) ||
      (preVal.LimitEndTime !== proVal.LimitEndTime) || (preVal.SingleLimitNum !== proVal.SingleLimitNum) ||
      (preVal.EveryDayLimitNum !== proVal.EveryDayLimitNum) || (preVal.SumLimitNum !== proVal.SumLimitNum) ||
      (JSON.stringify(preVal.GameIdCfg) !== JSON.stringify(proVal.GameIdCfg))) {
        str += '新手任务活动配置/'
      }
      if (JSON.stringify(preVal.taskCfgData) !== JSON.stringify(proVal.taskCfgData)){
        str += '任务配置/'
      }
      if (JSON.stringify(preVal.pokerCfgData) !== JSON.stringify(proVal.pokerCfgData)) {
        str += 'Poker任务配置/'
      }
      if (JSON.stringify(preVal.WhiteList) !== JSON.stringify(proVal.WhiteList) || preVal.IsWhite !== proVal.IsWhite) {
        str += '白名单配置/'
      }
      return `修改了:【${str}】的配置`
    },
    handlePrizeDelete(ob) {
      let $this = this
      this.$confirm('是否确认删除此奖励配置?', '提示', {type:'warning'}).then(() => {
        const delIndex = $this.edit.item.PrizeCfg.findIndex(item => item.Reward === ob.Reward)
        this.edit.item.PrizeCfg.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    getDataByTableMoney(raffleLevel) {
      if (this.edit.cfgType === 1) {
        for (let i = 0; i < this.item.taskCfgData.length; i++) {
          const data = this.item.taskCfgData[i]
          if (data.Id === raffleLevel) {
            return data
          }
        }
      } else if (this.edit.cfgType === 2) {
        for (let i = 0; i < this.item.pokerCfgData.length; i++) {
          const data = this.item.pokerCfgData[i]
          if (data.Id === raffleLevel) {
            return data
          }
        }
      }
      return null
    },
    addWhite() {
      if (this.item.CurId === '' || this.item.CurId === null) {
        return
      }
      let numbers = this.item.CurId.split(',').filter(num => !isNaN(num))
      let insertList = []
      for (let i = 0; i < numbers.length; i++) {
        if (isNaN(numbers[i])) {
          continue
        }
        let num = parseInt(numbers[i], 10)
        if (isNaN(num)) {
          continue
        }
        var bExit = false
        for (let j = 0; j < this.item.WhitelistCfg.UidList.length; j++) {
          if (this.item.WhitelistCfg.UidList[j].uid === num) {
            bExit = true
            break
          }
        }

        if (!bExit) {
          insertList.push(num)
        }
      }
      let isShow = false
      for (let i = 0; i < insertList.length; i++) {
        this.item.WhitelistCfg.UidList.push({
          "uid" : insertList[i]
        })
        isShow = true
      }
      if (isShow) {
        const showMsg = '白名单添加成功'
        Message.success(showMsg)
      }
      console.log(this.item.WhitelistCfg.UidList)
    },
    delRow(row) {
      let newList = []
      for (const key in this.item.WhitelistCfg.UidList) {
        if (this.item.WhitelistCfg.UidList[key].uid === row.uid) {
          continue
        }
        newList.push(this.item.WhitelistCfg.UidList[key])
      }
      this.item.WhitelistCfg.UidList = newList
    },
    save() {
      if (this.edit.cfgType === 1) {
        this.saveTask()
      } else if (this.edit.cfgType === 2) {
        this.savePoker()
      }
    },
    getWhiteList() {
      let whiteList = []
      for (const key in this.item.WhitelistCfg.UidList) {
        whiteList.push(this.item.WhitelistCfg.UidList[key].uid)
      }
      return whiteList
    },
    saveTask() {
      if (this.edit.isEdit) {
        for (var i = 0; i < this.item.taskCfgData.length; i++) {
          if (this.item.taskCfgData[i].Id === this.edit.item.Id) {
            this.item.taskCfgData[i].MatchNum = this.edit.item.MatchNum
            this.item.taskCfgData[i].RewardNum = this.edit.item.RewardNum
            this.item.taskCfgData[i].RatioNum = this.edit.item.RatioNum
            this.item.taskCfgData[i].GameType = this.edit.item.GameType
            this.item.taskCfgData[i].TaskType = this.edit.item.TaskType
          }
        }
      } else {
        var isExit = false
        for (var i = 0; i < this.item.taskCfgData.length; i++) {
          if (this.item.taskCfgData[i].Id === this.edit.item.Id) {
            this.item.taskCfgData[i].MatchNum = this.edit.item.MatchNum
            this.item.taskCfgData[i].RewardNum = this.edit.item.RewardNum
            this.item.taskCfgData[i].RatioNum = this.edit.item.RatioNum
            this.item.taskCfgData[i].GameType = this.edit.item.GameType
            this.item.taskCfgData[i].TaskType = this.edit.item.TaskType
            isExit = true
            break
          }
        }
        if (!isExit) {
          this.item.taskCfgData.push(this.edit.item)
        }
      }
      this.edit.visible = false
      this.edit.cfgType = 0
    },
    savePoker() {
      if (this.edit.isEdit) {
        for (var i = 0; i < this.item.pokerCfgData.length; i++) {
          if (this.item.pokerCfgData[i].Id === this.edit.item.Id) {
            this.item.pokerCfgData[i].MatchNum = this.edit.item.MatchNum
            this.item.pokerCfgData[i].RewardNum = this.edit.item.RewardNum
            this.item.pokerCfgData[i].RatioNum = this.edit.item.RatioNum
            this.item.pokerCfgData[i].GameType = this.edit.item.GameType
            this.item.pokerCfgData[i].TaskType = this.edit.item.TaskType
          }
        }
      } else {
        var isExit = false
        for (var i = 0; i < this.item.pokerCfgData.length; i++) {
          if (this.item.pokerCfgData[i].Id === this.edit.item.Id) {
            this.item.pokerCfgData[i].MatchNum = this.edit.item.MatchNum
            this.item.pokerCfgData[i].RewardNum = this.edit.item.RewardNum
            this.item.pokerCfgData[i].RatioNum = this.edit.item.RatioNum
            this.item.pokerCfgData[i].GameType = this.edit.item.GameType
            this.item.pokerCfgData[i].TaskType = this.edit.item.TaskType
            isExit = true
            break
          }
        }
        if (!isExit) {
          this.item.pokerCfgData.push(this.edit.item)
        }
      }
      this.edit.visible = false
      this.edit.cfgType = 0
    },
    getData() {
      const $this = this
      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          const whitelistCfg = JSON.parse(JSON.stringify($this.item.WhitelistCfg))
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const old = JSON.parse(response.Data.Data)
            $this.item.IsOpen = old.IsOpen
            $this.item.IsWhite = old.IsWhite
            $this.item.StartTime = old.StartTime * 1000
            $this.item.EndTime = old.EndTime * 1000
            $this.item.LimitStartTime = old.LimitStartTime * 1000
            $this.item.LimitEndTime = old.LimitEndTime * 1000
            if (old.StartTime === 0) {
              $this.item.StartTime = new Date().setSeconds(0)
            }
            if (old.EndTime === 0) {
              $this.item.EndTime = $this.item.StartTime + 86400000
            }
            $this.item.SingleLimitNum = old.SingleLimitNum
            $this.item.EveryDayLimitNum = old.EveryDayLimitNum
            $this.item.SumLimitNum = old.SumLimitNum
            if (old.taskCfgData.length > 0) {
              $this.item.taskCfgData = this.getPokerCfgData(old.taskCfgData)
            }
            if (old.pokerCfgData.length > 0) {
              $this.item.pokerCfgData = this.getPokerCfgData(old.pokerCfgData)
            }
            for (let i = 0; i < old.GameIdCfg.length; i++) {
              if (!$this.item.GameIdCfg.includes(old.GameIdCfg[i])) {
                $this.item.GameIdCfg.push(old.GameIdCfg[i])
              }
            }
            if (old.WhiteList !== null) {
              $this.item.WhitelistCfg.UidList = []
              for (let i = 0; i < old.WhiteList.length; i++) {
                $this.item.WhitelistCfg.UidList.push({ "uid": old.WhiteList[i] })
              }
            }
            if (old.AppIdList !== null) {
              $this.item.WhitelistCfg.AppIdList = old.AppIdList
            }
            if (old.SiteIdList !== null) {
              $this.item.WhitelistCfg.SiteIdList = old.SiteIdList
            }
            this.$refs.compare.SetOldVal(old)
          }
          this.getGameAll()
        }
      })
    },
    updateData() {
      // 设置修改后数据
      if (this.IsUpdate) {
        return
      }
      this.IsUpdate = true
      this.configCheck()
      var startTime = Math.floor(this.item.StartTime / 1000)
      var endTime = Math.floor(this.item.EndTime / 1000)
      var limitSTime = Math.floor(this.item.LimitStartTime / 1000)
      var limitETime = Math.floor(this.item.LimitEndTime / 1000)
      var taskCfgData = this.getTaskCfgData(this.item.taskCfgData)
      var pokerCfgData = this.getTaskCfgData(this.item.pokerCfgData)
      var whiteList = this.getWhiteList()
      var isExit = false
      for (let i = 0; i < this.item.GameIdCfg.length; i++) {
        if (this.item.GameIdCfg[i] === 2031) {
          isExit = true
          break
        }
      }
      if (!isExit) {
        this.item.GameIdCfg.push(2031)
      }
      var tableData = {
        IsOpen: this.item.IsOpen,
        StartTime: startTime,
        EndTime: endTime,
        LimitStartTime: limitSTime,
        LimitEndTime: limitETime,
        SingleLimitNum: this.item.SingleLimitNum,
        EveryDayLimitNum: this.item.EveryDayLimitNum,
        SumLimitNum: this.item.SumLimitNum,
        taskCfgData: taskCfgData,
        pokerCfgData: pokerCfgData,
        GameIdCfg: this.item.GameIdCfg,
        WhiteList: whiteList,
        IsWhite: this.item.IsWhite,
        AppIdList: this.item.WhitelistCfg.AppIdList,
        SiteIdList: this.item.WhitelistCfg.SiteIdList
      }
      this.form.Data = JSON.stringify(tableData)
      updateCustomize(this.form).then(response => {
        if (response.RetCode === 0) {
          const showMsg = '保存成功'
          Message.success(showMsg)
          this.getData()
          return
        } else {
          const errMsg = '保存成功失败！'
          Message.error(errMsg + response.Data)
          return
        }
      })
      setTimeout(() => {
        this.IsUpdate = false
      }, 1000)
    },
    updateGamesSorted() {
      this.GamesSorted = []
      for (let i = 0; i < this.item.GameIdCfg.length; i++) {
        const gameId = this.item.GameIdCfg[i]
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
    handleCheckChange(data, checked, indeterminate) {
      console.log('handleCheckChange', data, checked, indeterminate)
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      const index = this.item.GameIdCfg.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          this.item.GameIdCfg.push(data.id)
        }
      } else {
        if (index >= 0) {
          this.item.GameIdCfg.splice(index, 1)
        }
      }

      // 更新选中游戏的排序
      this.updateGamesSorted()

      console.log(this.item.GameIdCfg)
    },
    addRuleImage(type) {
      console.log('addRuleImage type:', type)
      if (type === 'Hor') {
        this.item.RuleImgHor.push('')
      } else {
        this.item.RuleImgVer.push('')
      }
    },
    removeRuleImage(index, type) {
      console.log('removeRuleImage index:', index, 'type:', type)
      if (type === 'Hor') {
        this.item.RuleImgHor.splice(index, 1)
      } else {
        this.item.RuleImgVer.splice(index, 1)
      }
    },
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.item.WhitelistCfg.SiteIdList)
    },
    getMatchTypeName(typName, nType) {
      var itemTypeName = ''
      var cfgInfo = []
      if (nType === 1) {
        cfgInfo = this.gameCfgs
      } else if (nType === 2) {
        cfgInfo = this.PokerInfoCfg
      }
      for (var i = 0; i < typName.length; i++) {
        for (var j = 0; j < cfgInfo.length; j++) {
          if (cfgInfo[j].value === typName[i]) {
            itemTypeName += cfgInfo[j].label
            if (j < cfgInfo.length - 1) {
              itemTypeName = itemTypeName + ','
            }
          }
        }
        if (i < typName.length - 1) {
          itemTypeName = itemTypeName + ','
        }
      }
      return itemTypeName
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

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

          for (const key in data) {
            const games = data[key]
            const cty = { id: 'p-' + key, label: categories[key], children: [] }

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({ id: game.Gid, label: game.Name })
            }
            this.treeData.push(cty)
          }

          // 更新选中游戏的排序
          this.updateGamesSorted()
          this.$refs.tree.setCheckedKeys(this.item.GameIdCfg)
        }
      })
    },
    getShowNumber(ratioNum) {
      var currNum = ratioNum / 1000
      return currNum
    },
    configCheck() {
      if (this.item.StartTime === 0) {
        this.errmsg('请填写输入开始时间')
        return false
      }
      if (this.item.EndTime === 0) {
        this.errmsg('请填写输入结束时间')
        return false
      }
    },
    getList() {
      request({
        url: 'matchconfig/match/config/list',
        method: 'get',
        data: {
          Env: this.env,
          GameId: -1,
          Status: -1,
          CsId: -1,
          RepeatType: -1,
          AppId: this.item.AppId,
          PageNum: 1,
          PageSize: 100
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            const tableDataCpy = objs.list
            if (tableDataCpy.length > 0) {
              for (let i = 0; i < tableDataCpy.length; i++) {
                tableDataCpy[i].app_info_cfg = JSON.parse(tableDataCpy[i].app_info_cfg)
                tableDataCpy[i].sign_extra = JSON.parse(tableDataCpy[i].sign_extra)
                this.tableData.push(tableDataCpy[i])
              }
            }
            this.getFilter()
          } else {
            this.total = 0
            this.tableData = []
          }
        }
      })
    },
    getFilter() {
      if (this.tableData.length > 0) {
        this.PokerInfoCfg = []
        for (let i = 0; i < this.tableData.length; i++) {
          let isExit = false
          if (this.item.AppId > 0) {
            for (let k = 0; k < this.tableData[i].app_info_cfg.length; k++) {
              if (this.item.AppId === this.tableData[i].app_info_cfg[k].appId) {
                isExit = true
                break
              }
            }
          } else if (this.item.AppId === -1) {
            isExit = true
          }

          if (isExit) {
            if (this.tableData[i].sign_extra.matchUniqueId > 0) {
              var dataList = { 'value': this.tableData[i].sign_extra.matchUniqueId, 'label': this.tableData[i].name, disabled: false }
              this.PokerInfoCfg.push(dataList)
            }
          }
        }
      }
    },
    getTaskCfgData(cfgData) {
      var cfg = []
      for (let i = 0; i < cfgData.length; i++) {
        var data = cfgData[i]
        data.RewardNum = data.RewardNum * 1000
        cfg.push(data)
      }
      return cfg
    },
    getPokerCfgData(cfgData) {
      var cfg = []
      for (let i = 0; i < cfgData.length; i++) {
        var data = cfgData[i]
        data.RewardNum = data.RewardNum / 1000
        cfg.push(data)
      }
      return cfg
    }
  }
}
</script>

<style>

</style>
