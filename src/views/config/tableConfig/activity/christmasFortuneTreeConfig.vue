<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="活动开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="展示结束时间：">
                    <el-date-picker v-model="item.ShowEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动开始时间：">
                    <el-date-picker v-model="item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动结束时间：">
                    <el-date-picker v-model="item.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下注/赢钱获得道具比例：">
                    <el-input v-model.number="item.SockGainRatio" size="mini">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发放奖励类型：">
                    <el-select v-model="item.RewardType" placeholder="请选择" size="mini" style="width:90px">
                      <el-option
                        v-for="item in rewardTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-if="item.RewardType === 2" v-model="item.RewardUseSceneId" placeholder="请选择投注金" size="mini" style="width:150px">
                      <el-option
                        v-for="scene in betScenes"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                    <el-select v-if="item.RewardType === 3" v-model="item.RewardUseSceneId" placeholder="请选择返水金" size="mini" style="width:150px">
                      <el-option
                        v-for="scene in rebateScenes"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="当日发奖额阈值：" :required="true">
                    <el-input v-model.number="item.DayPrizeThreshold" size="mini">
                      <template slot="append">（₱）</template>
                    </el-input>
                    <span v-if="todayRaffleAmount > item.DayPrizeThreshold" style="color: red">今日发奖已超阈值（{{todayRaffleAmount}}），已开启限制</span>
                    <span v-else style="color: red">今日发奖总额（{{todayRaffleAmount}}）</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="24">
                <el-form-item label="规则图片横板：" :required="true">
                  <el-col :span="2" v-for="(v,k) in item.RuleImgHor">
                    <span style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Hor')">移除</span>
                      <ImagePicker v-model="item.RuleImgHor[k]" />
                    </span>
                  </el-col>
                  <span style="position: relative;">
                    <el-button @click="addRuleImage('Hor')">添加</el-button>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="规则图片竖版：" :required="true">
                  <el-col :span="2" v-for="(v,k) in item.RuleImgVer">
                    <span style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Vor')">移除</span>
                      <ImagePicker v-model="item.RuleImgVer[k]" />
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

        <el-tab-pane label="奖池配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
            添加配置
          </el-button>
          <el-form ref="ProtectCfg" v-model="item.PrizePoolCfg" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.PrizePoolCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
              @row-click="clickData"
            >
              <el-table-column
                prop="RaffleLevel"
                label="档次条件"
                width="200"
              />
              <el-table-column
                prop="SockBaseNum"
                label="基础道具数量"
                width="200"
              />
              <el-table-column
                prop="CoefficientMin"
                label="道具系数范围"
                width="200"
              >
                <template slot-scope="scope">
                  {{ scope.row.CoefficientMin }} - {{ scope.row.CoefficientMax }}
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
                    @click="handleEdit(scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleDelete(scope.row)"
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
            <el-form-item label="档次条件：" :required="true" prop="RaffleLevel">
              <el-col :span="15">
                <el-input v-model.number="edit.item.RaffleLevel"><template slot="append">（₱）</template></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="基础道具数量：" :required="true" prop="SockBaseNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.SockBaseNum" />
              </el-col>
            </el-form-item>
            <el-form-item label="道具系数最小：" :required="true" prop="CoefficientMin">
              <el-col :span="15">
                <el-input v-model="edit.item.CoefficientMin" />
              </el-col>
            </el-form-item>
            <el-form-item label="道具系数最大：" :required="true" prop="CoefficientMax">
              <el-col :span="15">
                <el-input v-model="edit.item.CoefficientMax" />
              </el-col>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="20" :offset="2">
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="handlePrizeCreate()">
                添加配置
              </el-button>

              <el-form ref="ProtectCfg" v-model="edit.item.PrizeCfg" label-width="150px" style="margin-top: 10px">
                <el-table
                  :data="edit.item.PrizeCfg"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="Reward"
                    label="真金（₱）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Reward" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">（₱）</template></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Weight"
                    label="中奖权重"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.Weight" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="PrizeNum"
                    label="份数"
                    width="100"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.PrizeUnlimited === true ? '不限' : '' }}
                      <el-input v-model.number="scope.row.PrizeNum" v-if="scope.row.PrizeUnlimited === false" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="PrizeUnlimited"
                    label="是否不限"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-switch v-model="scope.row.PrizeUnlimited" :active-value="true" :inactive-value="false" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    column-key="op"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="warning"
                        @click="handlePrizeDelete(scope.row)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-dialog>

        <el-tab-pane label="排行榜配置">
          <el-row :gutter="5">
            <el-col>
              <el-form ref="rankCfg" v-model="item.RankCfg" label-width="150px" style="margin-top: 10px">
                <el-table
                  :data="item.RankCfg"
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

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="AppId白名单：" prop="item.WhitelistCfg.AppIdList">
                <el-select v-model="item.WhitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px" @change="onAppIdOptionsChange">
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
                <SiteSelect v-model="item.WhitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px" @change="onSiteIdOptionsChange" />
              </el-form-item>
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
        <el-button type="primary" @click="setData">保存</el-button>
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
import SiteSelect from "@/components/SiteSelect/index.vue";

function newPrizePoolCfg() {
  return {
    RaffleLevel: 200,
    RewardMax: 0,
    SockBaseNum: 10,
    CoefficientMin: 0.8,
    CoefficientMax: 1.2,
    PrizeCfg: [
      { Reward: 0, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
      { Reward: 0, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
    ]
  }
}

export default {
  components: { Compare, ImagePicker, Publish, SiteSelect },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    gameIdCfg(val) {

    }
  },
  data() {
    return {
      subKey: 'christmas_fortune_tree_cfg',
      libShow: $libShow,
      form: {
        Data: {}
      },
      item: {
        IsOpen: true,
        StartTime: 1734278400000,
        EndTime: 1735487999000,
        ShowEndTime: 1735574399000,
        SockGainRatio: 10,
        RuleImgHor: [],
        RuleImgVer: [],
        RewardType: 1,
        RewardUseSceneId: 0,
        PrizePoolCfg: [
          {
            RaffleLevel: 200,
            RewardMax: 38,
            SockBaseNum: 10,
            CoefficientMin: 0.8,
            CoefficientMax: 1.2,
            PrizeCfg: [
              { Reward: 38, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 18.8, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 10.8, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.38, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.18, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.1, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
            ]
          },
          {
            RaffleLevel: 500,
            RewardMax: 88,
            SockBaseNum: 25,
            CoefficientMin: 0.8,
            CoefficientMax: 1.2,
            PrizeCfg: [
              { Reward: 88, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 38, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 18.8, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.88, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.38, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.28, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
            ]
          },
          {
            RaffleLevel: 1000,
            RewardMax: 188,
            SockBaseNum: 50,
            CoefficientMin: 0.8,
            CoefficientMax: 1.2,
            PrizeCfg: [
              { Reward: 188, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 28, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 18.8, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 1.88, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 1.28, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 0.88, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
            ]
          },
          {
            RaffleLevel: 2000,
            RewardMax: 388,
            SockBaseNum: 100,
            CoefficientMin: 0.8,
            CoefficientMax: 1.2,
            PrizeCfg: [
              { Reward: 388, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 88, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 28, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 3.88, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 1.88, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 1.28, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
            ]
          },
          {
            RaffleLevel: 5000,
            RewardMax: 888,
            SockBaseNum: 250,
            CoefficientMin: 0.8,
            CoefficientMax: 1.2,
            PrizeCfg: [
              { Reward: 888, Weight: 30, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 188, Weight: 90, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 88, Weight: 180, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 8.88, Weight: 59700, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 3.88, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true },
              { Reward: 2.88, Weight: 120000, PrizeNum: 0, PrizeUnlimited: true }
            ]
          }
        ],
        RankCfg: [
          { RankStart: 1, RankEnd: 1, Reward: 28888 },
          { RankStart: 2, RankEnd: 2, Reward: 18888 },
          { RankStart: 3, RankEnd: 3, Reward: 8888 },
          { RankStart: 4, RankEnd: 5, Reward: 2888 },
          { RankStart: 6, RankEnd: 10, Reward: 1888 },
          { RankStart: 11, RankEnd: 20, Reward: 888 },
          { RankStart: 21, RankEnd: 40, Reward: 288 },
          { RankStart: 41, RankEnd: 70, Reward: 188 },
          { RankStart: 71, RankEnd: 100, Reward: 88 },
        ],
        GameIdCfg: [],
        WhitelistCfg: {
          AppIdList: [],
          SiteIdList: []
        }
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
        { label: 50000, value: 50000 },
      ],

      edit: {
        raffleLevel: 0,
        visible: false,
        item: newPrizePoolCfg(),
        isEdit: false,
        gamesSortDialogVisible: false,
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
          label: '提审1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        },
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

      filterGameIds: [ 2031, 10002 ],

      filterText: '',

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      },

      todayRaffleAmount: 0,
    }
  },
  created() {
    this.getData()
    this.getTodayRaffleAmount()
    console.log(1)
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
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCreate() {
      this.edit.item = newPrizePoolCfg()
      this.edit.isEdit = false
      this.edit.visible = true
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
    handleEdit(ob) {
      this.initFormData(true, ob.RaffleLevel)
      this.edit.visible = true
    },
    handleDelete(ob) {
      let $this = this
      this.$confirm('是否确认删除此奖池配置?', '提示', {type:'warning'}).then(() => {
        const delIndex = $this.item.PrizePoolCfg.findIndex(item => item.RaffleLevel === ob.RaffleLevel)
        this.item.PrizePoolCfg.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handlePrizeCreate() {
      this.edit.item.PrizeCfg.push({ Reward: 0, Weight: 0, PrizeNum: 0, PrizeUnlimited: true })
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
      for (let i = 0; i < this.item.PrizePoolCfg.length; i++) {
        const data = this.item.PrizePoolCfg[i]
        if (data.RaffleLevel === raffleLevel) {
          return data
        }
      }
      return null
    },
    save() {
      if (this.edit.isEdit && this.edit.raffleLevel !== this.edit.item.RaffleLevel) {
        console.log('raffleLevel changed, old:' + this.edit.raffleLevel + ' new:' + this.edit.item.RaffleLevel)
        for (const o in this.item.PrizePoolCfg) {
          if (this.item.PrizePoolCfg[o].RaffleLevel === this.edit.raffleLevel) {
            this.item.PrizePoolCfg[o].RaffleLevel = this.edit.item.RaffleLevel
            break
          }
        }
      }

      // 检查是否有重复的奖励
      for (let i = 0; i < this.edit.item.PrizeCfg.length; i++) {
        const prize = this.edit.item.PrizeCfg[i]
        if (parseInt(prize.Reward*100) === 0) {
          this.$alert(`[奖励金额：0] 不允许添加`, '提示', {type:'warning'})
          return
        }
        for (let j = i + 1; j < this.edit.item.PrizeCfg.length; j++) {
          const _prize = this.edit.item.PrizeCfg[j]
          console.log('_prize.Reward', _prize.Reward, ' prize.Reward', prize.Reward, _prize.Reward === prize.Reward)
          if (parseInt(_prize.Reward*100) === parseInt(prize.Reward*100)) {
            this.$alert(`[奖励金额：${prize.Reward}] 已存在，不能重复添加`, '提示', {type:'warning'})
            return
          }
        }
      }

      // 查找最大的奖励金额
      let maxReward = 0
      this.edit.item.PrizeCfg.forEach(v => {
        const reward = v.Reward
        if (reward > maxReward) {
          maxReward = reward
        }
      })
      this.edit.item.RewardMax = maxReward
      console.log('maxReward:', maxReward)

      const newData = JSON.parse(JSON.stringify(this.edit.item))
      const index = this.item.PrizePoolCfg.findIndex(item => item.RaffleLevel === this.edit.item.RaffleLevel)
      if (this.edit.isEdit) {
        this.item.PrizePoolCfg.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[档次条件：${this.edit.item.RaffleLevel}] 已存在，不能重复添加`, '提示', {type:'warning'})
          return
        }
        // 新增到
        this.item.PrizePoolCfg.push(newData)
        // 按档次金额排序
        this.item.PrizePoolCfg.sort((a, b) => {
          return a.RaffleLevel - b.RaffleLevel
        })
      }

      this.edit.visible = false
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('christmasConfig', response.Data)

          const rankCfg = JSON.parse(JSON.stringify($this.item.RankCfg))
          const whitelistCfg = JSON.parse(JSON.stringify($this.item.WhitelistCfg))
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)

            $this.item.StartTime *= 1000
            $this.item.EndTime *= 1000
            $this.item.ShowEndTime *= 1000

            $this.item.PrizePoolCfg.map(item => {
              item.RaffleLevel /= 1000
              item.RewardMax /= 1000
              item.CoefficientMin /= 10
              item.CoefficientMax /= 10

              item.PrizeCfg.map(prizeCfg => {
                prizeCfg.Reward /= 1000
              })
            })

            $this.item.RankCfg.map(item => {
              item.Reward /= 1000
            })

            if ($this.item.RankCfg.length === 0) {
              $this.item.RankCfg = rankCfg
            }

            if ($this.item.WhitelistCfg == null) {
              $this.item.WhitelistCfg = whitelistCfg
            }

            if ($this.item.DayPrizeThreshold != null) {
              $this.item.DayPrizeThreshold /= 1000
            }

            this.$refs.compare.SetOldVal(old)

            this.getGameAll()
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)

      cpy.StartTime /= 1000
      cpy.EndTime /= 1000
      cpy.ShowEndTime /= 1000

      cpy.PrizePoolCfg = []

      for (const o in this.item.PrizePoolCfg) {
        const obj = {}
        obj.SockBaseNum = this.item.PrizePoolCfg[o].SockBaseNum
        obj.RaffleLevel = this.item.PrizePoolCfg[o].RaffleLevel * 1000
        obj.RewardMax = this.item.PrizePoolCfg[o].RewardMax * 1000
        obj.CoefficientMin = this.item.PrizePoolCfg[o].CoefficientMin * 10
        obj.CoefficientMax = this.item.PrizePoolCfg[o].CoefficientMax * 10

        obj.PrizeCfg = []
        for (const i in this.item.PrizePoolCfg[o].PrizeCfg) {
          const pCfg = {}
          pCfg.Reward = this.item.PrizePoolCfg[o].PrizeCfg[i].Reward * 1000
          pCfg.Weight = this.item.PrizePoolCfg[o].PrizeCfg[i].Weight
          pCfg.PrizeNum = this.item.PrizePoolCfg[o].PrizeCfg[i].PrizeNum
          pCfg.PrizeUnlimited = this.item.PrizePoolCfg[o].PrizeCfg[i].PrizeUnlimited
          obj.PrizeCfg.push(pCfg)
        }

        cpy.PrizePoolCfg.push(obj)
      }

      cpy.RankCfg = []
      for (const i in this.item.RankCfg) {
        const rCfg = {}
        rCfg.RankStart = this.item.RankCfg[i].RankStart
        rCfg.RankEnd = this.item.RankCfg[i].RankEnd
        rCfg.Reward = this.item.RankCfg[i].Reward * 1000
        cpy.RankCfg.push(rCfg)
      }

      cpy.GameIdCfg = this.item.GameIdCfg

      cpy.WhitelistCfg = this.item.WhitelistCfg

      if (this.item.DayPrizeThreshold!= null) {
        cpy.DayPrizeThreshold = this.item.DayPrizeThreshold * 1000
      }

      return JSON.stringify(cpy)
    },
    setData() {
      if (this.item.RewardType === undefined) {
        Message.error('请选择奖励类型')
        return
      }
      if (this.item.RewardUseSceneId === undefined) {
        this.item.RewardUseSceneId = 0
      }
      if (this.item.RewardType !== 1 && this.item.RewardUseSceneId === 0) {
        const typeObj = this.rewardTypes.find(item => item.value === this.item.RewardType)
        const typeName = typeObj ? typeObj.label : ''
        Message.error(`请选择【${typeName}】对应的使用场景`)
        return
      }

      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
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

          // 更新选中游戏的排序
          this.updateGamesSorted()

          console.log(this.item.GameIdCfg)
          this.$refs.tree.setCheckedKeys(this.item.GameIdCfg)
          console.log(data)
        }
      })
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
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.item.WhitelistCfg.AppIdList)
    },
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.item.WhitelistCfg.SiteIdList)
    },
    getTodayRaffleAmount() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/activity/christmas/today/raffle/amount'
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
    }
  }
}
</script>

<style>

</style>
