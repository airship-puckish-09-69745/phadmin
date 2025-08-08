<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="TongitsLaiZiTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <p style="margin:30px;color:#dd0000;">注意：修改底注、桌子数量需要重启游戏服务才能生效！</p>
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <!--
        <el-table-column
          prop="IsPractice"
          label="练习场"
          width="70"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        -->
        <el-table-column
          prop="JokerNum"
          label="癞子数"
          width="70"
        />
        <el-table-column
          prop="Level"
          label="Level"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="TableMoney"
          label="底注"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.TableMoney) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CarryLower"
          label="携带"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column
          prop="HideCarry"
          label="隐藏目标值"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.HideCarry) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ObjectCount"
          label="桌子数"
          width="100"
        />
        <el-table-column
          prop="Anticheating"
          label="是否防作弊"
          width="100"
        >
          <template slot-scope="scope">
            {{ showAnticheating(scope.row.Anticheating) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="RoomLevel"
          label="房间类型"
          width="150"
        >

          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['RoomLevelNew']" size="mini" @change="handleFilter">
              <el-option label="房间类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['RoomLevelNew']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ showRoomLevel(scope.row.RoomLevel) }}
          </template>
        </el-table-column>

        <el-table-column prop="AllocScheme" label="配桌方案" width="150" >
          <template slot-scope="scope"> {{ getAllocSchemeName(scope.row.AllocScheme ) }} </template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="150"
        >

          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
             {{ showStatus(scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyUser"
          label="最后修改人"
          width="100"
        />
        <el-table-column
          label="操作"
          column-key="op"
          width="350"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              type="success"
              icon="el-icon-upload2"
              @click="handlePrepare(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="handleOffline(scope.row)"
            >下架
            </el-button>
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
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="底注：" :required="true" prop="item.TableMoney">
              <el-select v-model="edit.item.TableMoney" placeholder="请选择">
                <el-option
                  v-for="item in tableMoneyCfg"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房间类型：" :required="true" prop="item.RoomLevel">
              <el-select v-model.number="edit.item.RoomLevel" placeholder="请选择">
                <el-option label="普通房" :value="0" />
                <el-option label="好友房" :value="100" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <!--
            <el-form-item label="练习场：" :required="true">
              <el-radio-group v-model.number="edit.item.IsPractice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            -->
            <el-form-item label="癞子数：" :required="true">
              <el-radio-group v-model.number="edit.item.JokerNum">
                <!--                <el-radio :label="0">0</el-radio>-->
                <el-radio :label="4">4</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最小携带："
              :required="true"
              prop="item.CarryLower"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大携带(练习场初始资金)："
              :required="true"
              prop="item.CarryUpper"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="隐藏目标值："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model="edit.item.HideCarry" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="如果有值，且玩家携带达到此值，则隐藏盖场次" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="是否防作弊："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-switch
                v-model="edit.item.Anticheating"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="抽水费率："
              :required="true"
              prop="item.FlowRate"
              :rules="dataRule(true,{type:'f',range:'0'})"
            >
              <el-input v-model="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽3%，则填写0.03" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <el-form-item label="等级：" :required="true" prop="item.Level">
              <el-select v-model.number="edit.item.Level" placeholder="请选择">
                <el-option label="Blank" :value="0" />
                <el-option label="新手" :value="1" />
                <el-option label="初级" :value="2" />
                <el-option label="中级" :value="3" />
                <el-option label="高级" :value="4" />
                <el-option label="精英" :value="5" />
                <el-option label="大师" :value="6" />
                <el-option label="Champion" :value="7" />
                <el-option label="Legend" :value="8" />
                <el-option label="Supreme" :value="9" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="操作时长(秒)："
              :required="true"
              prop="item.ActionSeconds"
              :rules="dataRule(true,{type:'n',range:'5'})"
            >
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="操作时长" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="桌子数量："
              :required="true"
              prop="item.ObjectCount"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.ObjectCount" placeholder="桌子数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最大围观局数："
              prop="item.WatchTimesMax"
              :rules="dataRule(true,{type:'n',range:'2'})"
            >
              <el-input v-model.number="edit.item.WatchTimesMax" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最小玩牌金额："
              :required="true"
              prop="item.MinPlayMoney"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model="edit.item.MinPlayMoney" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="匹配机器人最高等待时间："
              prop="item.WaitAddRobotMaxTimes"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.WaitAddRobotMaxTimes" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="匹配玩家入桌等待时间："
              prop="item.WaitUserEnterTimes"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.WaitUserEnterTimes" />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="11">
            <el-form-item
              label="自动满桌匹配人数要求："
              prop="item.AutoEnterRoomCount"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.AutoEnterRoomCount" />
            </el-form-item>
          </el-col>


          <el-col :span="11">
            <el-form-item
              label="低信可信："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-switch
                v-model="edit.item.IsAllowTowLowTrustSit"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>
          <el-col :span="11">
            <el-form-item
              label="是否开启信任分配桌："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-switch
                v-model="edit.item.IsTrustScoreEnterRoom"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="低危可信："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-switch
                v-model="edit.item.IsLowRiskBelieve"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="20">
            <el-form-item label="配桌方案：" :required="true">
              <el-radio-group v-model.number="edit.item.AllocScheme">
                <el-radio :label="0">常规</el-radio>
                <el-radio :label="1">班车</el-radio>
                <el-radio :label="2">信誉分</el-radio>
                <el-radio :label="3">动态匹配</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="默认胜率："
              :required="true"
              prop="item.DefaultWinRate"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.DefaultWinRate" placeholder="默认胜率" style="width:200px;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="在玩人数倍数："
              :required="true"
              prop="item.PlayingMul"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingMul" placeholder="在玩人数倍数" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="在玩人数最小随机数："
              :required="true"
              prop="item.PlayingRandMin"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingRandMin" placeholder="在玩人数最小随机数" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="在玩人数最大随机数："
              :required="true"
              prop="item.PlayingRandMax"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingRandMax" placeholder="在玩人数最大随机数" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="幸运级别最大值(0不限制)："
              :required="true"
              prop="item.LuckyLevelLimitMax"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.LuckyLevelLimitMax" placeholder="0即不限制" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="幸运级别限制生效最低资产(0不限制)："
              :required="true"
              prop="item.LuckyLevelLimitMoney"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.LuckyLevelLimitMoney" placeholder="0即不限制" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!-- <tongits-robot-common v-model="edit" /> -->
        <!-- <tongits-robot-control v-model="edit" /> -->
        <!-- <tongits-robot-build-card v-model="edit"></tongits-robot-build-card> -->

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import tongitsRobotCommon from './tongits/robotCommon'
import tongitsRobotControl from './tongits/robotControl'
import tongitsRobotBuildCard from './tongits/robotBuildCard'

const filterMap = {
  RoomLevelNew: { 11: '普通房', 100: '好友房' },
  Status: { 1: '未上', 2: '上架中', 3: '废弃', 6: '下架' }
}
function NewRobotConfig() {
  return {
    Common: {
      RobotCarryMoneyStart: 0,
      RobotCarryMoneyEnd: 0,
      RobotMaxPlayTimesStart: 0,
      RobotMaxPlayTimesEnd: 0,
      RobotMaxWinTimesStart: 0,
      RobotMaxWinTimesEnd: 0,
      RobotMaxLoseTimesStart: 0,
      RobotMaxLoseTimesEnd: 0,
      RobotMaxWinMoneyStart: 0,
      RobotMaxWinMoneyEnd: 0,
      RobotMaxLoseMoneyStart: 0,
      RobotMaxLoseMoneyEnd: 0,
      Create1RobotPercents: 0,
      Create2RobotPercents: 0,
      Create3RobotPercents: 0,
      AppendRobotPercents: 0
    },
    Control: {
      RobotOpenFlag: 0,
      Create1RobotPercents: 0,
      Create2RobotPercents: 0,
      Create3RobotPercents: 0,
      MaxRobotUserNum: 0,
      RobotLoginIntervalMin: 0,
      RobotLoginIntervalMax: 0
    },
    RobotCardBuildConfig: {
      IsDoBuildCard: false,
      BuildFourRatio: 0,
      BuildFlushGte5Ratio: 0,
      BuildFlush4Ratio: 0,
      BuildFlush3Ratio: 0,
      BuildThreeRatio: 0,
      BuildFourMaxNum: 0,
      BuildFlushGte5MaxNum: 0,
      BuildFlush4MaxNum: 0,
      BuildFlush3MaxNum: 0,
      BuildThree3MaxNum: 0
    }
  }
}

function newItem() {
  return {
    playMode: 1, // 标准玩法
    CarryLower: '',
    CarryUpper: '',
    HideCarry: '',
    TableMoney: '',
    JokerNum: 4,
    MaxPlayerCount: 3,
    ObjectCount: '',
    FlowRate: '',
    ActionSeconds: '',
    WatchTimesMax: '',
    IsPractice: 0,
    Level: 1,
    RobotSetting: '',
    RobotConfig: '',
    PlayingMul: 0,
    PlayingRandMin: 0,
    PlayingRandMax: 0,
    DefaultWinRate: 50,
    LuckyLevelLimitMax: 0,
    LuckyLevelLimitMoney: 0,
    MinPlayMoney: 0,
    Anticheating: 0,
    RoomLevel: 0,
    WaitAddRobotMaxTimes:0,
    WaitUserEnterTimes:0,
    AllocScheme:0,
    AutoEnterRoomCount:0,
    IsAllowTowLowTrustSit:0,
    IsTrustScoreEnterRoom:0,
    IsLowRiskBelieve:0

  }
}

export default {
  components: { Compare, Publish, tongitsRobotCommon, tongitsRobotControl, tongitsRobotBuildCard },
  data() {
    return {
      playMode: 2, // 癞子
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'HideCarry', 'TableMoney', 'LuckyLevelLimitMoney', 'MinPlayMoney']),
      libMoneyRobot: new MoneyShow(['RobotCarryMoneyStart', 'RobotCarryMoneyEnd', 'RobotMaxWinMoneyStart', 'RobotMaxWinMoneyEnd', 'RobotMaxLoseMoneyStart', 'RobotMaxLoseMoneyEnd', '']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        robotConfig: NewRobotConfig()
      },
      tableMoneyCfg: [
        { 'label': '0.2', 'value': 0.2 },
        { 'label': '1', 'value': 1 },
        { 'label': '5', 'value': 5 },
        { 'label': '10', 'value': 10 },
        { 'label': '20', 'value': 20 },
        { 'label': '50', 'value': 50 },
        { 'label': '100', 'value': 100 },
        { 'label': '200', 'value': 200 },
        { 'label': '500', 'value': 500 },
        { 'label': '1000', 'value': 1000 },
        { 'label': '2000', 'value': 2000 },
        { 'label': '3000', 'value': 3000 }
      ],

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        HideCarry: '隐藏目标值',
        TableMoney: '底注',
        JokerNum: '癞子数',
        MaxPlayerCount: '最大玩牌人数',
        ObjectCount: '桌子数',
        FlowRate: '抽水率',
        ActionSeconds: '操作时间',
        WatchTimesMax: '最大围观局数',
        IsPractice: '是否练习场',
        DefaultWinRate: '默认胜率',
        LuckyLevelLimitMax: '限制幸运级别最大值',
        LuckyLevelLimitMoney: '限制幸福级别的最低资产',
        Level: '等级',
        Common: '机器人通用配置',
        Control: '机器人控制配置',
        MinPlayMoney: '最小玩牌金额',
        RobotCardBuildConfig: '机器人好牌配置',
        Anticheating: '是否防作弊',
        RoomLevel: '房间类型',
        AllocScheme:'配桌方案',
        WaitAddRobotMaxTimes:'匹配机器人最高等待时间',
        WaitUserEnterTimes:'匹配玩家入桌等待时间',
        AutoEnterRoomCount:'自动满桌匹配人数要求',
        IsAllowTowLowTrustSit:'低信可信',
        IsTrustScoreEnterRoom:'是否信任分配桌',
        IsLowRiskBelieve:'低危可信',
        // 'RobotConfig.Common.RobotCarryMoneyStart': '机器人最小携带',
        // 'RobotConfig.Common.RobotCarryMoneyEnd': '机器人最大携带',
        // 'RobotConfig.Common.RobotMaxPlayTimesStart': '机器人玩牌次数下限',
        // 'RobotConfig.Common.RobotMaxPlayTimesEnd': '机器人玩牌次数上限',
        // 'RobotConfig.Common.RobotMaxWinTimesStart': '机器人最大赢次数下限',
        // 'RobotConfig.Common.RobotMaxWinTimesEnd': '机器人最大赢次数上限',
        // 'RobotConfig.Common.RobotMaxLoseTimesStart': '机器人最大输次数上限',
        // 'RobotConfig.Common.RobotMaxLoseTimesEnd': '机器人最大输次数下限',
        // 'RobotConfig.Common.RobotMaxWinMoneyStart': '机器人最大赢金额上限',
        // 'RobotConfig.Common.RobotMaxWinMoneyEnd': '机器人最大赢金额下限',
        // 'RobotConfig.Common.RobotMaxLoseMoneyStart': '机器人最大输金额上限',
        // 'RobotConfig.Common.RobotMaxLoseMoneyEnd': '机器人最大输金额下限',
        types: {
          Common: 'jsonString'
          // Control: 'jsonString',
          // RobotCardBuildConfig: 'jsonString',
        }
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    showAnticheating(n) {
      if (n == 1) {
        return '是'
      } else {
        return '否'
      }
    },
    showRoomLevel(n) {
      if (n === 100) {
        return '好友房'
      }
      return '普通房'
    },
    showStatus(n) {
      if (n === 1) {
        return '未上'
      } else if (n === 2) {
        return '已上架'
      } else if (n === 3) {
        return '废弃'
      }else{
        return '下架'
      }
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
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/tongitstable/all',
        method: 'get',
        data: {
          PlayMode: this.playMode
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].RoomLevel == 0) {
              objs[i]['RoomLevelNew'] = 11
            } else {
              objs[i]['RoomLevelNew'] = objs[i].RoomLevel
            }
          }
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'TableMoney', 1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      let count = 0
      for (const i in this.clientDB.TotalData) {
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
          count++
        }
      }
      // if (count !== 1) {
      //   this.$alert('发布的配置项中，必须有且仅有一个练习场配置')
      //   return false
      // }
      return true
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
    getCompareVal(obj) {
      const one = JSON.parse(JSON.stringify(obj))
      const row = JSON.parse(obj.RobotConfig)
      one.Common = JSON.stringify(row.Common)
      one.Control = JSON.stringify(row.Control)
      one.RobotCardBuildConfig = JSON.stringify(row.RobotCardBuildConfig)
      one.RobotConfig = ''
      return one
    },
    changeStatus(id, status, msg) {
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/tongitstable/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            $this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
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
          Object.assign(this.edit.item, _data)
          try {
            const one = JSON.parse(_data.RobotConfig)
            one.Common = this.libMoneyRobot.TransForShow(one.Common)
            this.edit.robotConfig = one
          } catch (e) {
            this.edit.robotConfig = NewRobotConfig()
          }
          console.log('robotConfig:', this.edit)
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(this.getCompareVal(_data))
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      postData.PlayMode = this.playMode
      request({
        url: '/tongitstable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.item.ID = response.Data.ID
          this.clientDB.AddData(this.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'tongitstable/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      return postData
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper ||
        this.edit.robotConfig.Common.RobotCarryMoneyStart > this.edit.robotConfig.Common.RobotCarryMoneyEnd ||
        this.edit.robotConfig.Common.RobotMaxLoseMoneyStart > this.edit.robotConfig.Common.RobotMaxLoseMoneyEnd ||
        this.edit.robotConfig.Common.RobotMaxLoseTimesStart > this.edit.robotConfig.Common.RobotMaxLoseTimesEnd ||
        this.edit.robotConfig.Common.RobotMaxPlayTimesStart > this.edit.robotConfig.Common.RobotMaxPlayTimesEnd ||
        this.edit.robotConfig.Common.RobotMaxWinMoneyStart > this.edit.robotConfig.Common.RobotMaxWinMoneyEnd ||
        this.edit.robotConfig.Common.RobotMaxWinTimesStart > this.edit.robotConfig.Common.RobotMaxWinTimesEnd) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
        Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
        return false
      }
      return true
    },
    save() {
      this.edit.robotConfig.Control.RobotOpenFlag = parseInt(this.edit.robotConfig.Control.RobotOpenFlag)
      if (!this.checkData()) return
      console.log('this.edit.item--->', this.edit.item)
      console.log('this.edit.robotConfig--->', this.edit.robotConfig)
      if (!this.edit.item.hasOwnProperty('RobotConfig')) {
        this.edit.item.RobotConfig = ''
      }
      this.edit.robotConfig.Common = this.libMoneyRobot.TransForStore(this.edit.robotConfig.Common)
      this.edit.item.RobotConfig = JSON.stringify(this.edit.robotConfig)
      console.log('this.edit.item--->', this.edit.item)
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.getCompareVal(this.edit.item))
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            console.log('do get post data')
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },
    getAllocSchemeName(plan){
      if(plan==1) {
        return "班车"
      }else if(plan==2){
        return "信誉分"
      }else if(plan==3){
        return "动态匹配"
      }else{
        return "常规"
      }
    }
  }
}
</script>
