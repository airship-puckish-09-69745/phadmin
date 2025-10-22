<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
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
                @row-click="clickData"
                @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
        <el-table-column prop="StartTime" label="开始时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.StartTime / 1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.EndTime / 1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="展示结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.ShowEndTime / 1000) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" />
        <el-table-column prop="Status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.Status!=1" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.Status!=1" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==1" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
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
        <el-tab-pane label="活动配置">
          <el-row>
              <el-form label-width="220px" size="mini">
                <el-col :span="12">
                  <el-form-item label="是否开启：" prop="IsOpen" :required="true">
                    <el-switch v-model="edit.item.IsOpen" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="展示结束时间：" prop="ShowEndTime" :required="true">
                    <el-date-picker v-model="edit.item.ShowEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开始时间：" prop="StartTime" :required="true">
                    <el-date-picker v-model="edit.item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：" prop="EndTime" :required="true">
                    <el-date-picker v-model="edit.item.EndTime" type="datetime"  placeholder="选择结束时间" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单人单日发放阈值：" :required="true">
                    <el-input v-model.number="edit.item.LimitTaskMinValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单日总发放阈值：" :required="true">
                    <el-input v-model.number="edit.item.LimitTaskMaxValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动总发放阈值：" :required="true">
                    <el-input v-model.number="edit.item.LimitTaskSumValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下注任务展示最小值：" :required="true">
                    <el-input v-model.number="edit.item.ShowTaskMinValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下注任务展示最大值：" :required="true">
                    <el-input v-model.number="edit.item.ShowTaskMaxValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="糖果大奖展示最小值：" :required="true">
                    <el-input v-model.number="edit.item.ShowEggMinValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="糖果大奖展示最大值：" :required="true">
                    <el-input v-model.number="edit.item.ShowEggMaxValue" />
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

        <el-tab-pane label="任务配置">
          <el-form ref="item" label-width="220px">
            <el-row :gutter="5">
              <el-col>
               <el-form ref="rankCfg" v-model="edit.item.TaskCfg" label-width="150px" style="margin-top: 10px">
                <el-table
                  :data="edit.item.TaskCfg"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="TaskID"
                    label="任务id"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.TaskID" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="RewardMin"
                    label="任务条件"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.RewardMin" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Reward"
                    label="平均奖励"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.AverageNum" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="editRow(scope.$index, scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
               </el-form>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="无限有效下注任务配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="有效下注条件：" prop="edit.item.LimitRewardCfg.ConditionValue">
                  <el-input v-model.number="edit.item.LimitRewardCfg.ConditionValue" placeholder="请填写有效下注"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="奖励列表：" prop="edit.item.LimitRewardCfg.RewardList">
                  <template >
                    <el-button type="primary" size="mini" @click="editLimitRow()">编辑</el-button>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="排行榜配置">
          <el-row :gutter="5">
            <el-col>
              <el-form ref="rankCfg" v-model="edit.item.RankCfg" label-width="150px" style="margin-top: 10px">
                <el-table
                  :data="edit.item.RankCfg"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="RankStart"
                    label="排名开始"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.RankStart" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="RankEnd"
                    label="排名结束"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.RankEnd" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Reward"
                    label="奖励金额"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="大奖励配置">
          <el-form ref="item" label-width="220px">
            <el-row :gutter="5">
              <el-col>
                <el-form ref="RewardLimitCfg" v-model="edit.item.RewardLimitCfg" label-width="150px" style="margin-top: 10px">
                  <el-button type="primary" @click="addLimitRow()">新增</el-button>
                  <el-button type="success" @click="saveLimitRow()">保存</el-button>
                  <el-table
                    :data="edit.item.RewardLimitCfg"
                    border
                    style="width: 100%"
                    :cell-style="libShow.DefaultTableCell"
                  >
                    <el-table-column
                      prop="LimitMin"
                      label="最小下注"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.LimitMin" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="LimitMax"
                      label="最大下注(小于或等于)"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.LimitMax" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="AverageNum"
                      label="平均奖励"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AverageNum" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0.00;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editRewardRow(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteRewardRow(scope.$index, scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="分享奖励配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-form-item label="道具类型：" :required="true" prop="edit.item.ShareRewardCfg.ItemType">
                <el-col :span="15">
                  <el-select   v-model.number="edit.item.ShareRewardCfg.ItemType" placeholder="请选择" style="width: 250px" @change="updatePropOptions(edit.item.ShareRewardCfg.ItemType)">
                    <el-option
                      v-for="item in propTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="道具名称：" :required="true" prop="edit.item.ShareRewardCfg.ItemId">
                <el-col :span="15">
                  <el-select   v-model.number="edit.item.ShareRewardCfg.ItemId" placeholder="请选择" style="width: 250px" @change="SetPropName(edit.item.ShareRewardCfg.ItemId)">
                    <el-option
                      v-for="item in propOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="道具数量：" :required="true" prop="edit.item.ShareRewardCfg.ItemNum">
                <el-col :span="15">
                  <el-input v-model.number="edit.item.ShareRewardCfg.ItemNum" />
                </el-col>
              </el-form-item>
              <el-form-item label="有效时间：" :required="true" prop="edit.item.ShareRewardCfg.UseTime">
                <el-col :span="15">
                  <el-select   v-model.number="edit.item.ShareRewardCfg.UseTime" placeholder="请选择" style="width: 250px">
                    <el-option
                      v-for="item in propDayTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="白名单开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="edit.item.WhitelistCfg.IsWhite" :active-value="true" :inactive-value="false" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.WhitelistCfg.AppIdList">
                  <el-select v-model="edit.item.WhitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px" @change="onAppIdOptionsChange">
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
                <el-form-item label="SiteId白名单：" prop="item.WhitelistCfg.SiteIdList">
                  <SiteSelect v-model="edit.item.WhitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px" @change="onSiteIdOptionsChange" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

      </el-tabs>
      <el-row style="margin-top: 10px">
        <el-button type="primary" @click="handleSave()">保存配置</el-button>
      </el-row>
    </el-dialog>

    <el-dialog
      title="编辑"
      :modal="false"
      :visible.sync="edit.isShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button type="primary" @click="addRow()">新增</el-button>
      <el-button type="success" @click="saveRow()">保存</el-button>
      <el-table
        :data="edit.RewardList"
        style="width: 95%"
        border
        :header-cell-style="{textAlign: 'center'}"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
      >
        <el-table-column
          prop="Reward"
          label="奖励"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Reward" type="number" oninput=" if(value < 0 || value === '' || value == null){value = 0;} " />
          </template>
        </el-table-column>
        <el-table-column
          prop="Weight"
          label="权重"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Weight" oninput=" if(value < 0 || value === '' || value == null){value = 0;}else {value=parseInt(value)}" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deletePairsRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>

import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow, ValidateVueItem } from '@/utils/common'
import Publish from "@/components/Publish/index.vue"
import Compare from "@/components/Compare/index.vue"
import GameLevel from "@/components/GameLevel/index.vue"
import MoneyInput from "@/components/MoneyInput/index.vue"
import store from "@/store"
import request from "@/utils/request"
import {Message} from "element-ui"
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue"
import SiteSelect from "@/components/SiteSelect/index.vue"
import { getInfo } from '@/api/user'

const filterMap = {}

function newItem() {
  return {
    ID: 0,
    IsOpen: 1,
    Status: 1,
    StartTime: Date.parse(new Date().toString()),
    EndTime: Date.parse(new Date().toString()),
    ShowEndTime: Date.parse(new Date().toString()),
    GameIdCfg: [],
    RuleImgHor: [],
    RuleImgVer: [],
    WhitelistCfg: {
      IsWhite: false,
      AppIdList: [],
      SiteIdList: []
    },
    LimitTaskMinValue: 1000,
    LimitTaskMaxValue: 1000,
    LimitTaskSumValue: 1000,
    ShowTaskMinValue: 10,
    ShowTaskMaxValue: 1000,
    ShowEggMinValue: 10,
    ShowEggMaxValue: 1000,
    RewardCfg: {
      RewardType: 1,
      UseSceneId: 0,
      BigPrizeReward: 88888,
      ShowMinGold: 1,
      ShowMaxGold: 10
    },
    LimitRewardCfg: {
      ConditionValue: 3000,
      ShowMinNum: 10,
      ShowMaxNum: 1000,
      RewardMinValue: 10,
      RewardMaxValue: 100,
      RewardList: []
    },
    ShareRewardCfg: {
      ItemId: 0,
      ItemNum: 0,
      ItemType: 0,
      ItemName: '',
      UseTime: 0
    },
    RankCfg: [
      { RankStart: 1, RankEnd: 1, Reward: 28888 },
      { RankStart: 2, RankEnd: 2, Reward: 18888 },
      { RankStart: 3, RankEnd: 3, Reward: 8888 },
      { RankStart: 4, RankEnd: 5, Reward: 2888 },
      { RankStart: 6, RankEnd: 10, Reward: 1888 },
      { RankStart: 11, RankEnd: 20, Reward: 888 },
      { RankStart: 21, RankEnd: 40, Reward: 288 },
      { RankStart: 41, RankEnd: 70, Reward: 188 },
      { RankStart: 71, RankEnd: 100, Reward: 88 }
    ],
    TaskCfg: [
      { TaskID: 1, RewardMin: 1, AverageNum: 0.00, RewardList: [] },
      { TaskID: 2, RewardMin: 2, AverageNum: 0.00, RewardList: [] },
      { TaskID: 3, RewardMin: 3, AverageNum: 0.00, RewardList: [] },
      { TaskID: 4, RewardMin: 5, AverageNum: 0.00, RewardList: [] },
      { TaskID: 5, RewardMin: 10, AverageNum: 0.00, RewardList: [] },
      { TaskID: 6, RewardMin: 20, AverageNum: 0.00, RewardList: [] },
      { TaskID: 7, RewardMin: 40, AverageNum: 0.00, RewardList: [] },
      { TaskID: 8, RewardMin: 70, AverageNum: 0.00, RewardList: [] },
      { TaskID: 9, RewardMin: 100, AverageNum: 0.00, RewardList: [] }
    ],
    RewardLimitCfg: [
      { LimitMin: 1, LimitMax: 10, AverageNum: 0.00, RewardList: [] }
    ],
    EggShellsPerRaffle: 100,
    EggShellsRaffleFirst: 500
  }
}

export default {
  components: {ImagePicker, Compare, Publish, GameLevel, MoneyInput, SiteSelect },
  data() {
    return {
      // 主键
      subKey: 'halloween_task_cfg',
      form: {
        Data: {}
      },
      tableData: [],
      deleteData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      statusNames: { 1: '上架', 2: '下架' },
      BlackOperator: '',
      edit: {
        ID: 0,
        isEdit: false,
        visible: false,
        isShow: false,
        item: newItem(),
        title: '新增',
        ModifyUser: '',
        RewardList: [],
        LimitRewardList: [],
        editRowIndex: 0,
        nType: 0,
        gamesSortDialogVisible: false,
        normalEggWeightConfigs: [],
        specialEggWeightConfigs: [],
        eggs: [
          { Color: 1, Name: 'RED', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 2, Name: 'BLUE', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 3, Name: 'GREEN', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 4, Name: 'YELLOW', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
        ]
      },
      env: 'test',
      AttrNames: {
        CfgId: '配置ID',
        IsOpen: '是否开启',
        StartTime: '开始时间',
        EndTime: '结束时间',
        ShowEndTime: '展示结束时间',
        GameIdCfg: '游戏ID配置',
        RuleImgHor: '横向规则图',
        RuleImgVer: '纵向规则图',
        WhitelistCfg: '白名单',
        EggShellGainRatio: '彩蛋获得倍率',
        EggShellReturnRatio: '彩蛋返还倍率',
        DayPrizeThreshold: '每日奖励阈值',
        RewardCfg: '奖励配置',
        RankCfg: '排行榜配置',
        EggCfg: '彩蛋配置',
        EggShellsPerRaffle: '每抽蛋壳数量',
        EggShellsRaffleFirst: '首抽蛋壳数量',
        DebugTimeOffset: '调试时间偏移'
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
        },
        {
          value: 1000006,
          label: 'BingoPlus测试1000006'
        }
      ],
      // 奖励类型
      rewardTypes: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],

      // 投注金
      betScenes: [
        { 'value': 7, 'label': '【复活节彩蛋活动】任意游戏投注' }
      ],
      // 返水金
      rebateScenes: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
      ],

      filterGameIds: [2031, 10002],

      filterText: '',

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },

      todayRaffleAmount: 0,

      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
      // 道具数据列表
      propList: [],
      // 道具有效时长列表
      propTimeList: [],
      // 道具选项列表
      propOptions: {},
      // 道具类型选项列表
      propTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false }
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
    this.getTodayRaffleAmount()
  },
  mounted() {
    this.getData()
    this.getGameAll()
    this.getPropList()
    this.getOperator()
  },
  computed: {
    eggReward: {
      get() {

      }
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getPublishAttrNames() {
      // 将首字母改为小写
      const attrNames = {}
      for (const key in this.AttrNames) {
        if (this.AttrNames.hasOwnProperty(key)) {
          const newKey = key.charAt(0).toLowerCase() + key.slice(1)
          attrNames[newKey] = this.AttrNames[key]
        }
      }
      return attrNames
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
    getEggName(eggId) {
      for (let i = 0; i < this.edit.item.EggCfg.Eggs.length; i++) {
        const egg = this.edit.item.EggCfg.Eggs[i]
        if (egg.EggId === eggId) {
          return egg.Name
        }
      }
      return ''
    },
    getEggReward(eggId) {
      for (let i = 0; i < this.edit.item.EggCfg.Eggs.length; i++) {
        const egg = this.edit.item.EggCfg.Eggs[i]
        if (egg.EggId === eggId) {
          return egg.Reward
        }
      }
      return ''
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const oldList = JSON.parse(response.Data.Data)
            if (oldList.HalloweenCfgList != null) {
              this.tableData = []
              for (let i = 0; i < oldList.HalloweenCfgList.length; i++) {
                const item = oldList.HalloweenCfgList[i]
                item.StartTime = item.StartTime * 1000
                item.EndTime = item.EndTime * 1000
                item.ShowEndTime = item.ShowEndTime * 1000
                // 排行配置表
                for (let i = 0; i < item.RankCfg.length; i++) {
                  const rankCfg = item.RankCfg[i]
                  rankCfg.Reward = rankCfg.Reward / 1000
                }
                // 任务配置表
                for (let i = 0; i < item.TaskCfg.length; i++) {
                  const rankCfg = item.TaskCfg[i]
                  rankCfg.AverageNum = rankCfg.AverageNum / 1000
                  for (let j = 0; j < rankCfg.RewardList.length; j++) {
                    const rewardInfo = rankCfg.RewardList[j]
                    rewardInfo.Reward = rewardInfo.Reward / 1000
                  }
                }
                // 奖励配置
                for (let i = 0; i < item.RewardLimitCfg.length; i++) {
                  const rewardCfg = item.RewardLimitCfg[i]
                  rewardCfg.AverageNum = rewardCfg.AverageNum / 1000
                  for (let j = 0; j < rewardCfg.RewardList.length; j++) {
                    const rewardInfo = rewardCfg.RewardList[j]
                    rewardInfo.Reward = rewardInfo.Reward / 1000
                  }
                }
                for (let i = 0; i < item.LimitRewardCfg.RewardList.length; i++) {
                  const limitCfg = item.LimitRewardCfg.RewardList[i]
                  limitCfg.Reward = limitCfg.Reward / 1000
                }
                this.tableData.push(item)
              }
            }
            // 更新选中游戏的排序
            this.updateGamesSorted()
            this.$refs.compare.SetOldVal(oldList)
          }
        }
      })
    },
    handlePrepare(ob) {
      if (ob != null) {
        let isSave = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID === ob.ID) {
            this.tableData[i].Status = 1
            isSave = true
            break
          }
        }
        if (isSave) {
          let updateData = {
            HalloweenCfgList: []
          }
          for (let i = 0; i < this.tableData.length; i++) {
            const item = this.tableData[i]
            for (let i = 0; i < item.RankCfg.length; i++) {
              const rank = item.RankCfg[i]
              rank.Reward = rank.Reward * 1000
            }
            // 任务配置表
            for (let i = 0; i < item.TaskCfg.length; i++) {
              const rankCfg = item.TaskCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            for (let i = 0; i < item.RewardLimitCfg.length; i++) {
              const rankCfg = item.RewardLimitCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            const dataInfo = {}
            dataInfo.ID = item.ID
            dataInfo.IsOpen = item.IsOpen
            dataInfo.StartTime = item.StartTime / 1000
            dataInfo.EndTime = item.EndTime / 1000
            dataInfo.ShowEndTime = item.ShowEndTime / 1000
            dataInfo.GameIdCfg = item.GameIdCfg
            dataInfo.TaskCfg = item.TaskCfg
            dataInfo.WhitelistCfg = item.WhitelistCfg
            dataInfo.RankCfg = item.RankCfg
            dataInfo.LimitRewardCfg = item.LimitRewardCfg
            dataInfo.ModifyUser = this.BlackOperator
            dataInfo.Status = item.Status
            dataInfo.RewardLimitCfg = item.RewardLimitCfg
            dataInfo.ShareRewardCfg = item.ShareRewardCfg
            dataInfo.LimitTaskMinValue = item.LimitTaskMinValue
            dataInfo.LimitTaskMaxValue = item.LimitTaskMaxValue
            dataInfo.LimitTaskSumValue = item.LimitTaskSumValue
            dataInfo.ShowTaskMinValue = item.ShowTaskMinValue
            dataInfo.ShowTaskMaxValue = item.ShowTaskMaxValue
            dataInfo.ShowEggMinValue = item.ShowEggMinValue
            dataInfo.ShowEggMaxValue = item.ShowEggMaxValue
            updateData.HalloweenCfgList.push(dataInfo)
          }
          this.form.Data = JSON.stringify(updateData)
          request({
            url: 'customizeconfig/update',
            method: 'post',
            data: this.form
          }).then(response => {
            if (response.RetCode === 0) {
              const showMsg = '刪除成功'
              Message.success(showMsg)
              this.getData()
              return
            } else {
              const errMsg = '刪除失败！'
              Message.error(errMsg + response.Data)
              return
            }
          })
        }
      }
    },
    handleOffline(ob) {
      if (ob != null) {
        let isSave = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID === ob.ID) {
            this.tableData[i].Status = 2
            isSave = true
            break
          }
        }
        if (isSave) {
          let updateData = {
            HalloweenCfgList: []
          }
          for (let i = 0; i < this.tableData.length; i++) {
            const item = this.tableData[i]
            for (let i = 0; i < item.RankCfg.length; i++) {
              const rank = item.RankCfg[i]
              rank.Reward = rank.Reward * 1000
            }
            // 任务配置表
            for (let i = 0; i < item.TaskCfg.length; i++) {
              const rankCfg = item.TaskCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            for (let i = 0; i < item.RewardLimitCfg.length; i++) {
              const rankCfg = item.RewardLimitCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            for (let i = 0; i < item.LimitRewardCfg.RewardList.length; i++) {
              const limitCfg = item.LimitRewardCfg.RewardList[i]
              limitCfg.Reward = limitCfg.Reward * 1000
            }
            const dataInfo = {}
            dataInfo.ID = item.ID
            dataInfo.IsOpen = item.IsOpen
            dataInfo.StartTime = item.StartTime / 1000
            dataInfo.EndTime = item.EndTime / 1000
            dataInfo.ShowEndTime = item.ShowEndTime / 1000
            dataInfo.GameIdCfg = item.GameIdCfg
            dataInfo.TaskCfg = item.TaskCfg
            dataInfo.WhitelistCfg = item.WhitelistCfg
            dataInfo.RankCfg = item.RankCfg
            dataInfo.LimitRewardCfg = item.LimitRewardCfg
            dataInfo.ModifyUser = this.BlackOperator
            dataInfo.Status = item.Status
            dataInfo.RewardLimitCfg = item.RewardLimitCfg
            dataInfo.ShareRewardCfg = item.ShareRewardCfg
            dataInfo.LimitTaskMinValue = item.LimitTaskMinValue
            dataInfo.LimitTaskMaxValue = item.LimitTaskMaxValue
            dataInfo.LimitTaskSumValue = item.LimitTaskSumValue
            dataInfo.ShowTaskMinValue = item.ShowTaskMinValue
            dataInfo.ShowTaskMaxValue = item.ShowTaskMaxValue
            dataInfo.ShowEggMinValue = item.ShowEggMinValue
            dataInfo.ShowEggMaxValue = item.ShowEggMaxValue
            updateData.HalloweenCfgList.push(dataInfo)
          }
          this.form.Data = JSON.stringify(updateData)
          request({
            url: 'customizeconfig/update',
            method: 'post',
            data: this.form
          }).then(response => {
            if (response.RetCode === 0) {
              const showMsg = '下架成功'
              Message.success(showMsg)
              this.getData()
              return
            } else {
              const errMsg = '下架失败！'
              Message.error(errMsg + response.Data)
              return
            }
          })
        }
      }
    },
    handleDelete(ob) {
      if (ob != null) {
        let isSave = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID === ob.ID) {
            this.tableData.splice(i, 1)
            isSave = true
            break
          }
        }
        if (isSave) {
          let updateData = {
            HalloweenCfgList: []
          }
          for (let i = 0; i < this.tableData.length; i++) {
            const item = this.tableData[i]
            for (let i = 0; i < item.RankCfg.length; i++) {
              const rank = item.RankCfg[i]
              rank.Reward = rank.Reward * 1000
            }
            // 任务配置表
            for (let i = 0; i < item.TaskCfg.length; i++) {
              const rankCfg = item.TaskCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            for (let i = 0; i < item.RewardLimitCfg.length; i++) {
              const rankCfg = item.RewardLimitCfg[i]
              rankCfg.AverageNum = rankCfg.AverageNum * 1000
              for (let j = 0; j < rankCfg.RewardList.length; j++) {
                const rewardInfo = rankCfg.RewardList[j]
                rewardInfo.Reward = rewardInfo.Reward * 1000
              }
            }
            for (let i = 0; i < item.LimitRewardCfg.RewardList.length; i++) {
              const limitCfg = item.LimitRewardCfg.RewardList[i]
              limitCfg.Reward = limitCfg.Reward * 1000
            }
            const dataInfo = {}
            dataInfo.ID = item.ID
            dataInfo.IsOpen = item.IsOpen
            dataInfo.StartTime = item.StartTime / 1000
            dataInfo.EndTime = item.EndTime / 1000
            dataInfo.ShowEndTime = item.ShowEndTime / 1000
            dataInfo.GameIdCfg = item.GameIdCfg
            dataInfo.TaskCfg = item.TaskCfg
            dataInfo.WhitelistCfg = item.WhitelistCfg
            dataInfo.RankCfg = item.RankCfg
            dataInfo.LimitRewardCfg = item.LimitRewardCfg
            dataInfo.ModifyUser = this.BlackOperator
            dataInfo.Status = item.Status
            dataInfo.RewardLimitCfg = item.RewardLimitCfg
            dataInfo.ShareRewardCfg = item.ShareRewardCfg
            dataInfo.LimitTaskMinValue = item.LimitTaskMinValue
            dataInfo.LimitTaskMaxValue = item.LimitTaskMaxValue
            dataInfo.LimitTaskSumValue = item.LimitTaskSumValue
            dataInfo.ShowTaskMinValue = item.ShowTaskMinValue
            dataInfo.ShowTaskMaxValue = item.ShowTaskMaxValue
            dataInfo.ShowEggMinValue = item.ShowEggMinValue
            dataInfo.ShowEggMaxValue = item.ShowEggMaxValue
            updateData.HalloweenCfgList.push(dataInfo)
          }
          this.form.Data = JSON.stringify(updateData)
          request({
            url: 'customizeconfig/update',
            method: 'post',
            data: this.form
          }).then(response => {
            if (response.RetCode === 0) {
              const showMsg = '刪除成功'
              Message.success(showMsg)
              this.getData()
              return
            } else {
              const errMsg = '刪除失败！'
              Message.error(errMsg + response.Data)
              return
            }
          })
        }
      }
    },
    changeStatus(id, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID === id) {
            this.tableData[i].Status = status
          }
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    getPostData() {
      if (this.edit.item.ID === 0) {
        let uuid = this.getUuiKey(8)
        console.log(uuid)
        this.edit.item.ID = parseInt(uuid, 10)
      }
      const data = {}
      data.ID = this.edit.item.ID
      data.IsOpen = this.edit.item.IsOpen
      data.StartTime = this.edit.item.StartTime
      data.EndTime = this.edit.item.EndTime
      data.ShowEndTime = this.edit.item.ShowEndTime
      data.GameIdCfg = this.edit.item.GameIdCfg
      data.TaskCfg = this.edit.item.TaskCfg
      data.WhitelistCfg = this.edit.item.WhitelistCfg
      data.RankCfg = this.edit.item.RankCfg
      data.ModifyUser = this.form.ModifyUser
      data.Status = this.edit.item.Status
      data.LimitRewardCfg = this.edit.item.LimitRewardCfg
      data.RewardLimitCfg = this.edit.item.RewardLimitCfg
      data.ShareRewardCfg = this.edit.item.ShareRewardCfg
      data.LimitTaskMinValue = this.edit.item.LimitTaskMinValue
      data.LimitTaskMaxValue = this.edit.item.LimitTaskMaxValue
      data.LimitTaskSumValue = this.edit.item.LimitTaskSumValue
      data.ShowTaskMinValue = this.edit.item.ShowTaskMinValue
      data.ShowTaskMaxValue = this.edit.item.ShowTaskMaxValue
      data.ShowEggMinValue = this.edit.item.ShowEggMinValue
      data.ShowEggMaxValue = this.edit.item.ShowEggMaxValue
      return data
    },
    handleSave() {
      const data = this.getPostData()
      console.log(data)
      let updateData = {
        HalloweenCfgList: []
      }
      if (!this.edit.isEdit) {
        this.tableData.push(data)
      }
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        for (let i = 0; i < item.RankCfg.length; i++) {
          const rank = item.RankCfg[i]
          rank.Reward = rank.Reward * 1000
        }
        // 任务配置表
        for (let i = 0; i < item.TaskCfg.length; i++) {
          const rankCfg = item.TaskCfg[i]
          rankCfg.AverageNum = rankCfg.AverageNum * 1000
          for (let j = 0; j < rankCfg.RewardList.length; j++) {
            const rewardInfo = rankCfg.RewardList[j]
            rewardInfo.Reward = rewardInfo.Reward * 1000
          }
        }
        for (let i = 0; i < item.RewardLimitCfg.length; i++) {
          const rankCfg = item.RewardLimitCfg[i]
          rankCfg.AverageNum = rankCfg.AverageNum * 1000
          for (let j = 0; j < rankCfg.RewardList.length; j++) {
            const rewardInfo = rankCfg.RewardList[j]
            rewardInfo.Reward = rewardInfo.Reward * 1000
          }
        }
        for (let i = 0; i < item.LimitRewardCfg.RewardList.length; i++) {
          const limitCfg = item.LimitRewardCfg.RewardList[i]
          limitCfg.Reward = limitCfg.Reward * 1000
        }
        console.log("+++++++++++++++++1++++++++++++++++")
        console.log(this.BlackOperator)
        console.log("+++++++++++++++++2++++++++++++++++")
        const dataInfo = {}
        dataInfo.ID = item.ID
        dataInfo.IsOpen = item.IsOpen
        dataInfo.StartTime = item.StartTime / 1000
        dataInfo.EndTime = item.EndTime / 1000
        dataInfo.ShowEndTime = item.ShowEndTime / 1000
        dataInfo.GameIdCfg = item.GameIdCfg
        dataInfo.TaskCfg = item.TaskCfg
        dataInfo.WhitelistCfg = item.WhitelistCfg
        dataInfo.RankCfg = item.RankCfg
        dataInfo.LimitRewardCfg = item.LimitRewardCfg
        dataInfo.ModifyUser = this.BlackOperator
        dataInfo.Status = item.Status
        dataInfo.RewardLimitCfg = item.RewardLimitCfg
        dataInfo.ShareRewardCfg = item.ShareRewardCfg
        dataInfo.LimitTaskMinValue = item.LimitTaskMinValue
        dataInfo.LimitTaskMaxValue = item.LimitTaskMaxValue
        dataInfo.LimitTaskSumValue = item.LimitTaskSumValue
        dataInfo.ShowTaskMinValue = item.ShowTaskMinValue
        dataInfo.ShowTaskMaxValue = item.ShowTaskMaxValue
        dataInfo.ShowEggMinValue = item.ShowEggMinValue
        dataInfo.ShowEggMaxValue = item.ShowEggMaxValue
        updateData.HalloweenCfgList.push(dataInfo)
      }
      this.form.Data = JSON.stringify(updateData)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.form
      }).then(response => {
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
      this.edit.visible = false
    },
    createData(data) {
      request({
        url: '/easterconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    updateData(data) {
      request({
        url: '/easterconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
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
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },
    handleEditDialogOpened() {
      console.log('handleEditDialogOpened edit:' + this.edit.isEdit)
      if (this.edit.isEdit) {
        this.getTodayRaffleAmount()
        this.$refs.tree.setCheckedKeys(this.edit.item.GameIdCfg)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].ID === ID) {
            const item = this.tableData[i]
            this.edit.item = item
            this.edit.item.ID = item.ID
            this.edit.item.IsOpen = item.IsOpen
            this.edit.item.StartTime = item.StartTime
            this.edit.item.EndTime = item.EndTime
            this.edit.item.ShowEndTime = item.ShowEndTime
            this.edit.item.GameIdCfg = item.GameIdCfg
            this.edit.item.TaskCfg = item.TaskCfg
            this.edit.item.WhitelistCfg = item.WhitelistCfg
            this.edit.item.RankCfg = item.RankCfg
            this.form.ModifyUser = item.ModifyUser
            this.edit.item.Status = item.Status
            this.edit.item.RewardLimitCfg = item.RewardLimitCfg
            this.edit.item.LimitRewardCfg = item.LimitRewardCfg
            this.edit.item.ShareRewardCfg = item.ShareRewardCfg
            this.edit.item.LimitTaskMinValue = item.LimitTaskMinValue
            this.edit.item.LimitTaskMaxValue = item.LimitTaskMaxValue
            this.edit.item.LimitTaskSumValue = item.LimitTaskSumValue
            this.edit.item.ShowTaskMinValue = item.ShowTaskMinValue
            this.edit.item.ShowTaskMaxValue = item.ShowTaskMaxValue
            this.edit.item.ShowEggMinValue = item.ShowEggMinValue
            this.edit.item.ShowEggMaxValue = item.ShowEggMaxValue
            // 更新选中游戏的排序
            this.updateGamesSorted()
            console.log(this.edit.item.GameIdCfg)
          }
        }
      }
    },
    handleAdd() {
      this.edit.item = newItem()

      this.edit.normalEggWeightConfigs = []
      for (let i = 0; i < this.edit.item.EggCfg.WeightCfg.length; i++) {
        const eggWeightCfg = this.edit.item.EggCfg.WeightCfg[i]
        if (eggWeightCfg.ConditionType === 1) {
          this.edit.normalEggWeightConfigs.push(eggWeightCfg)
        }
      }

      this.edit.specialEggWeightConfigs = []
      for (let i = 0; i < this.edit.item.EggCfg.WeightCfg.length; i++) {
        const eggWeightCfg = this.edit.item.EggCfg.WeightCfg[i]
        if (eggWeightCfg.ConditionType === 2) {
          this.edit.specialEggWeightConfigs.push(eggWeightCfg)
        }
      }

      this.edit.isEdit = false
      this.edit.visible = true
      console.log(this.edit.item)
    },
    //************************ 修改/添加弹框相关 ************************

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
      if (this.edit.item.GameIdCfg === undefined || this.edit.item.GameIdCfg.length === 0) {
        return
      }
      for (let i = 0; i < this.edit.item.GameIdCfg.length; i++) {
        const gameId = this.edit.item.GameIdCfg[i]
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

      const index = this.edit.item.GameIdCfg.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          this.edit.item.GameIdCfg.push(data.id)
        }
      } else {
        if (index >= 0) {
          this.edit.item.GameIdCfg.splice(index, 1)
        }
      }

      // 更新选中游戏的排序
      this.updateGamesSorted()

      console.log(this.edit.item.GameIdCfg)
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
      this.edit.item.GameIdCfg = []
      this.GamesSorted.forEach(item => {
        this.edit.item.GameIdCfg.push(item.GameId)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    //************************ 游戏列表相关 ************************
    //************************ 白名单相关 ************************
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.edit.item.WhitelistCfg.AppIdList)
    },
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.edit.item.WhitelistCfg.SiteIdList)
    },
    //************************ 白名单相关 ************************
    getTodayRaffleAmount() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/activity/easter/today/raffle/amount'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getTodayRaffleAmount', response.Data)
          if (response.Data) {
            $this.todayRaffleAmount = response.Data / 1000
            console.log('todayRaffleAmount', $this.todayRaffleAmount)
          }
        }
      })
    },
    //************************ 道具配置 ************************
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
            this.propList = []
            this.propList = objs.list
          }
        } else {
          this.propList = []
        }
      })
    },
    updatePropOptions(propType) {
      this.propOptions = []
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
              this.propOptions.push(dataList)
            }
          } else {
            let dList = { 'value': this.propList[i].id, 'label': this.propList[i].item_name, disabled: false }
            this.propOptions.push(dList)
          }
        }
      }
    },
    showPropTimeOptions(itemId) {
      this.propTimeList = []
      for (let i = 0; i < this.propList.length; i++) {
        if (this.propList[i].id === itemId) {
          const time_type = JSON.parse(this.propList[i].time_type)
          for (let j = 0; j < time_type.length; j++) {
            let msg = time_type[j] + '天'
            if (time_type[j] === 0) {
              msg = '永久'
            }
            let dataList = { 'value': time_type[j], 'label': msg, disabled: false }
            this.propTimeList.push(dataList)
          }
          break
        }
      }
    },
    SetPropName(itemId) {
      for (let i = 0; i < this.propOptions.length; i++) {
        if (this.propOptions[i].value === itemId) {
          this.edit.item.ShareRewardCfg.ItemName = this.propOptions[i].label
          break
        }
      }
    },
    //************************ 道具配置 ************************
    addLimitRow() {
      this.edit.item.RewardLimitCfg.push({ 'LimitMin': 0, 'LimitMax': 0, 'AverageNum': 0, 'RewardList': [] })
    },
    saveLimitRow() {
      if (this.edit.item.RewardLimitCfg.length === 0) {
        Message.error('请至少添加一个奖励-权重配置')
        return
      }
      let dataList = []
      for (let i = 0; i < this.edit.item.RewardLimitCfg.length; i++) {
        const limitCfg = this.edit.item.RewardLimitCfg[i]
        if (limitCfg.LimitMin > 0 || limitCfg.LimitMax > 0) {
          dataList.push(limitCfg)
        }
      }
      this.edit.item.RewardLimitCfg = dataList
      Message.success("保存成功")
    },
    addRow() {
      this.edit.RewardList.push({ 'Reward': 0, 'Weight': 0 })
    },
    saveRow() {
      if (this.edit.nType === 1) {
        if (this.edit.RewardList.length === 0) {
          Message.error('请至少添加一个奖励-权重配置')
          return
        }

        let totalWeight = 0
        let totalReward = 0
        for (let i = 0; i < this.edit.RewardList.length; i++) {
          if (this.edit.RewardList[i].Reward <= 0) {
            Message.error('奖励金额必须大于0')
            return
          }
          totalWeight += this.edit.RewardList[i].Weight
          totalReward += this.edit.RewardList[i].Reward
        }
        if (totalWeight === 0) {
          Message.error('权重之和必须大于0')
          return
        }
        this.edit.isShow = false
        let avgData = 0
        if (this.edit.RewardList) {
          this.edit.RewardList.sort((a, b) => { return a.Reward - b.Reward })
          avgData = (totalReward / this.edit.RewardList.length).toFixed(2)
        }
        // 任务配置表
        for (let i = 0; i < this.edit.item.TaskCfg.length; i++) {
          if (this.edit.editRowIndex === i) {
            this.edit.item.TaskCfg[i].AverageNum = avgData
            this.edit.item.TaskCfg[i].RewardList = this.edit.RewardList
            break
          }
        }
      } else if (this.edit.nType === 2) {
        if (this.edit.RewardList.length === 0) {
          Message.error('请至少添加一个奖励-权重配置')
          return
        }
        let totalWeight = 0
        let totalReward = 0
        for (let i = 0; i < this.edit.RewardList.length; i++) {
          if (this.edit.RewardList[i].Reward <= 0) {
            Message.error('奖励金额必须大于0')
            return
          }
          totalWeight += this.edit.RewardList[i].Weight
          totalReward += this.edit.RewardList[i].Reward
        }
        if (totalWeight === 0) {
          Message.error('权重之和必须大于0')
          return
        }
        this.edit.isShow = false
        if (this.edit.RewardList) {
          this.edit.RewardList.sort((a, b) => { return a.Reward - b.Reward })
        }
        this.edit.item.LimitRewardCfg.RewardList = this.edit.RewardList
      } else if (this.edit.nType === 3) {
        if (this.edit.RewardList.length === 0) {
          Message.error('请至少添加一个奖励-权重配置')
          return
        }
        let totalWeight = 0
        let totalReward = 0
        for (let i = 0; i < this.edit.RewardList.length; i++) {
          if (this.edit.RewardList[i].Reward <= 0) {
            Message.error('奖励金额必须大于0')
            return
          }
          totalWeight += this.edit.RewardList[i].Weight
          totalReward += this.edit.RewardList[i].Reward
        }
        if (totalWeight === 0) {
          Message.error('权重之和必须大于0')
          return
        }
        this.edit.isShow = false
        let avgData = 0
        if (this.edit.RewardList) {
          this.edit.RewardList.sort((a, b) => { return a.Reward - b.Reward })
          avgData = (totalReward / this.edit.RewardList.length).toFixed(2)
        }
        // 任务配置表
        for (let i = 0; i < this.edit.item.RewardLimitCfg.length; i++) {
          if (this.edit.editRowIndex === i) {
            this.edit.item.RewardLimitCfg[i].AverageNum = avgData
            this.edit.item.RewardLimitCfg[i].RewardList = this.edit.RewardList
            break
          }
        }
      }
      this.edit.RewardList = []
    },
    deleteRow(idx, row) {
      console.log(idx, row)
      this.edit.item.TaskCfg.splice(idx, 1)
    },
    deletePairsRow(idx, row) {
      console.log(idx, row)
      if (this.edit.nType === 1) {
        this.edit.RewardList.splice(idx, 1)
      } else if (this.edit.nType === 2) {
        this.edit.item.LimitRewardCfg.RewardList.splice(idx, 1)
      } else if (this.edit.nType === 3) {
        this.edit.RewardList.splice(idx, 1)
      }
    },
    deleteRewardRow(idx, row) {
      console.log(idx, row)
      this.edit.item.RewardLimitCfg.splice(idx, 1)
    },
    editRow(idx, row) {
      this.edit.RewardList = row.RewardList
      this.edit.isShow = true
      this.edit.editRowIndex = idx
      this.edit.nType = 1
    },
    editLimitRow() {
      this.edit.RewardList = this.edit.item.LimitRewardCfg.RewardList
      this.edit.isShow = true
      this.edit.nType = 2
    },
    editRewardRow(idx, row) {
      this.edit.RewardList = row.RewardList
      this.edit.isShow = true
      this.edit.editRowIndex = idx
      this.edit.nType = 3
    },
    getUuiKey(length = 5) {
      // 获取当前时间戳
      let uniqueKey = Math.floor(Math.random() * 10000000)
      return uniqueKey
    },
    getOperator() {
      const $this = this
      getInfo(this.$store.getters.token).then(function(response) {
        if (response.RetCode === 0) {
          $this.BlackOperator = response.Data.name
        }
      }).catch((e) => {
        console.log('getOperator failed', e)
      })
    },
    getTaskReward(reward) {

    }
  }
}
</script>

<style>

</style>
