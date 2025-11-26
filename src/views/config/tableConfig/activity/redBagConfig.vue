<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="红包雨活动配置">
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
                  <el-form-item label="每日活动开始时间：">
                    <el-date-picker v-model="item.EveryDayStartTime" type="datetime" placeholder="选择结束时间" format="HH:mm" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item label="每日活动结束时间：">
                    <el-date-picker v-model="item.EveryDayEndTime" type="datetime" placeholder="选择结束时间" format="HH:mm" size="mini" />
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item label="单日弹窗次数：">
                    <el-input v-model.number="item.ShowTimes" style="width: 200px;" placeholder="请输入限制数量"/>
                    <el-tooltip class="item" effect="light" placement="right-start">
                      <template #content>
                        <div>配置1则所有用户单日只弹出1次该弹窗，配置0则该弹窗不主动弹出，配置-1则该弹窗次数为无限</div>
                      </template>
                      <i class="el-icon-info" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item label="活动展示金额：">
                    <el-input v-model.number="item.ShowGold" style="width: 200px;" placeholder="请输入显示金额数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="每日黄金红包总发放限制：" :required="true">
                    <el-input v-model="item.SingleLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="每日铂金红包总发放限制：" :required="true">
                    <el-input v-model="item.EveryDayLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="每日砖石红包总发放限制：" :required="true">
                    <el-input v-model="item.SumLimitNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="超出黄金红包发放限制后发放红包金额：" :required="true">
                    <el-input v-model="item.LimitReceiveNum1" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="超出铂金红包发放限制后发放红包金额：" :required="true">
                    <el-input v-model="item.LimitReceiveNum2" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="超出砖石红包发放限制后发放红包金额：" :required="true">
                    <el-input v-model="item.LimitReceiveNum3" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="限制红包发送金币额度：" :required="true">
                    <el-input v-model="item.LimitMaxNum" style="width: 200px;" placeholder="请输入限制数量" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="消息推送开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.IsSend" :active-value="true" :inactive-value="false" />
                    <el-tooltip class="item" effect="light" placement="right-start">
                      <template #content>
                        <div>控制推送红包任务进度</div>
                      </template>
                      <i class="el-icon-info" />
                    </el-tooltip>
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
                prop="TaskType"
                label="任务类型"
                width="200"
              >
              <template slot-scope="scope">
                {{ getMatchTypeName(scope.row.TaskType) }}
              </template>
              </el-table-column>
              <el-table-column
                prop="MatchNum"
                label="任务条件"
                width="200"
              />
              <el-table-column
                prop="RewardId"
                label="奖励类型"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getCondName(scope.row.RewardId, scope.row.TaskType) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="RewardNum"
                label="奖励数量"
                width="200"
              >
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
            <el-form-item label="任务类型：" :required="true" prop="TaskType">
              <el-col :span="15">
                <el-select   v-model.number="edit.item.TaskType" placeholder="请选择" style="width: 250px">
                  <el-option
                    v-for="item in betScenes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="任务条件：" :required="true" prop="MatchNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.MatchNum" placeholder="任务条件"/>
              </el-col>
            </el-form-item>
            <el-form-item v-if="edit.item.TaskType == 1" label="奖励ID：" :required="true" prop="RewardId">
              <el-col :span="15">
                <el-input v-model.number="edit.item.RewardId" />
              </el-col>
            </el-form-item>
            <el-form-item v-if="edit.item.TaskType == 2" label="奖励类型：" :required="true" prop="TaskType">
              <el-col :span="15">
                <el-select   v-model.number="edit.item.RewardType" placeholder="请选择" style="width: 250px" @change="updatePropOptions(edit.item.RewardType)">
                  <el-option
                    v-for="item in propTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item v-if="edit.item.TaskType == 2" label="奖励ID：" :required="true" prop="TaskType">
              <el-col :span="15">
                <el-select   v-model.number="edit.item.RewardId" placeholder="请选择" style="width: 250px" @change="SetPropName(edit.item.RewardId)">
                  <el-option
                    v-for="item in propOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item  label="奖励数量：" :required="true" prop="RewardNum">
              <el-col :span="15">
                <el-input v-model.number="edit.item.RewardNum" />
              </el-col>
            </el-form-item>
            <el-form-item v-if="edit.item.TaskType == 2" label="有效时间：" :required="true" prop="TaskType">
              <el-col :span="15">
                <el-select   v-model.number="edit.item.RewardTime" placeholder="请选择" style="width: 250px">
                  <el-option
                    v-for="item in propDayTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <el-tab-pane label="红包价值">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleRedCreate(1)">
            添加配置
          </el-button>

          <el-form ref="taskCfgData" v-model="item.redBagCfg" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.redBagCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="Id"
                label="红包名称"
                sortable
                width="200"
              >
                <template slot-scope="scope">
                  {{ getShowRedData(scope.row.redId) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Value1"
                label="价值1"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagCfgData(scope.row.Value1) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Value2"
                label="价值2"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagCfgData(scope.row.Value2) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Weight"
                label="权重"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagWeightCfg(scope.row.Weight) }}%
                </template>
              </el-table-column>
              <el-table-column
                prop="SunNum"
                label="总数量"
                width="200"
              >
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
                    @click="handleRedEdite(scope.row, 1)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleRedDelete(scope.row, 1)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="红包价值(大额)">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleRedCreate(2)">
            添加配置
          </el-button>

          <el-form ref="taskCfgData" v-model="item.redMaxBagCfg" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.redMaxBagCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="Id"
                label="红包名称"
                sortable
                width="200"
              >
                <template slot-scope="scope">
                  {{ getShowRedData(scope.row.redId) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Value1"
                label="价值1"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagCfgData(scope.row.Value1) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Value2"
                label="价值2"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagCfgData(scope.row.Value2) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Weight"
                label="权重"
                width="200"
              >
                <template slot-scope="scope">
                  {{ getRedBagWeightCfg(scope.row.Weight) }}%
                </template>
              </el-table-column>
              <el-table-column
                prop="SunNum"
                label="总数量"
                width="200"
              >
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
                    @click="handleRedEdite(scope.row, 2)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleRedDelete(scope.row, 2)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

        <el-dialog
          :title="getRedEditTitle()"
          :visible.sync="redEdit.visible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-form ref="edit.item" :model="redEdit.item" label-width="250px" size="small">
            <el-form-item label="配置id：" :required="true" prop="Id">
              <el-col :span="15">
                <el-input v-model.number="redEdit.item.Id" :disabled="redEdit.isEdit"  placeholder="请填写配置id描述"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="红包名称：" :required="true" prop="Id">
              <el-col :span="15">
                <el-select   v-model.number="redEdit.item.redId" placeholder="请选择" style="width: 250px">
                  <el-option
                    v-for="item in rewardTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="价值1：" :required="true" prop="Value1">
              <el-col :span="15">
                <el-input v-model.number="redEdit.item.Value1" />
              </el-col>
            </el-form-item>
            <el-form-item label="价值2：" :required="true" prop="Value2">
              <el-col :span="15">
                <el-input v-model.number="redEdit.item.Value2" />
              </el-col>
            </el-form-item>
            <el-form-item label="权重：" :required="true" prop="Weight">
              <el-col :span="15">
                <el-input v-model.number="redEdit.item.Weight" />
              </el-col>
            </el-form-item>
            <el-form-item label="总数量：" :required="true" prop="SunNum">
              <el-col :span="15">
                <el-input v-model.number="redEdit.item.SunNum" />
              </el-col>
            </el-form-item>
          </el-form>
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="saveRedData">保存</el-button>
            </el-col>
          </el-row>
        </el-dialog>

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col>
                <el-form-item label="白名单开关:" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.IsWhite" :active-value="true" :inactive-value="false" />
                </el-form-item>
              </el-col>
              <el-col v-if="version === 'V1'" :span="11">
                <el-form-item label="AppId白名单:" prop="item.WhitelistCfg.AppIdList">
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
              <el-col>
                <el-form-item label="SiteId白名单：" prop="item.WhitelistCfg.SiteIdList">
                  <SiteSelect v-model="item.WhitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="A/B测试开关：" prop="item.WhitelistCfg.AbTest">
                  <el-switch v-model="item.WhitelistCfg.AbTest.switch" :active-value="true" :inactive-value="false" active-text="开启" inactive-text="关闭" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="B分组比例：" prop="item.WhitelistCfg.AbTest.bPercent">
                  <el-input v-model.number="item.WhitelistCfg.AbTest.bPercent" placeholder="请输入B分组比例">
                    <template slot="append">
                      %
                    </template>
                  </el-input>
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
        <el-button type="primary" @click="updateData">保存1</el-button>
        <el-button type="primary" @click="openCopyDialog">复制</el-button>
      </el-row>
    </el-row>

    <customize-config-copy-dialog :config-key="subKey" :from-app-id="appId" :visible="copyDialogVisible" ref="copyDialog" @close="onCloseCopyDialog" />

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from "@/components/Publish/index.vue";
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";
import {Message} from "element-ui";
import request from "@/utils/request";
import Compare from "@/components/Compare/index.vue";
import store from '@/store'
import {getCustomize, updateCustomize} from "@/api/custome_configV2";
import SiteSelect from '@/components/SiteSelect/index.vue'
import CustomizeConfigCopyDialog from "@/views/config/tableConfig/activity/components/copyDialog/customizeConfig.vue";

function newPrizePoolCfg() {
  return {
    Id: 0,
    MatchNum: 0,
    RewardId: 0,
    RewardNum: 0,
    RewardType: 0,
    RewardName: '',
    RewardTime: 0,
    TaskType: 0,
    GameType: []
  }
}

function newRedPoolCfg() {
  return {
    Id: 0,
    redId: 0,
    Value1: 0,
    Value2: 0,
    Weight: 0,
    SunNum: 0
  }
}

export default {
  components: {CustomizeConfigCopyDialog, Compare, ImagePicker, Publish, SiteSelect},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    gameIdCfg(val) {

    }
  },
  data() {
    return {
      subKey: 'red_task_cfg',
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      form: {
        Data: {}
      },
      total: 0,
      tableData: [],
      IsUpdate: false,
      item: {
        IsOpen: true,
        IsSend: true,
        StartTime: 0,
        EndTime: 0,
        EveryDayStartTime: 0,
        EveryDayEndTime: 0,
        ShowTimes: 0,
        SockGainRatio: 10,
        ShowGold: 0,
        RuleImgHor: [],
        RuleImgVer: [],
        RewardUseSceneId: 0,
        SingleLimitNum: 0,
        EveryDayLimitNum: 0,
        SumLimitNum: 0,
        LimitReceiveNum1: 0,
        LimitReceiveNum2: 0,
        LimitReceiveNum3: 0,
        LimitMaxNum: 0,
        AppId: -1,
        PrizePoolCfg: [],
        GameIdCfg: [],
        WhitelistCfg: {
          AppIdList: [],
          SiteIdList: [],
          UidList: [],
          AbTest: {
            switch: false,
            bPercent: 0,
          }
        },
        CurId: '',
        IsWhite: true,
        taskCfgData: [
          { Id: 1, MatchNum: 800, RewardId: 1, RewardNum: 1, RewardType: 0, RewardName: '', RewardTime: 0, TaskType: 1, GameType: [] },
          { Id: 2, MatchNum: 4200, RewardId: 1, RewardNum: 1, RewardType: 0, RewardName: '', RewardTime: 0, TaskType: 1, GameType: [] },
          { Id: 3, MatchNum: 5000, RewardId: 1, RewardNum: 1, RewardType: 0, RewardName: '', RewardTime: 0, TaskType: 1, GameType: [] },
          { Id: 4, MatchNum: 3, RewardId: 0, RewardNum: 1, RewardType: 0, RewardName: '', RewardTime: 0, TaskType: 2, GameType: [] }
        ],
        redBagCfg: [
          { Id: 1, redId: 1, Value1: 150, Value2: 1850, Weight: 2300, SunNum: 0 },
          { Id: 2, redId: 1, Value1: 1850, Value2: 4150, Weight: 4700, SunNum: 0 },
          { Id: 3, redId: 1, Value1: 4150, Value2: 6250, Weight: 3000, SunNum: 0 },
          { Id: 4, redId: 2, Value1: 7450, Value2: 12550, Weight: 2619, SunNum: 0 },
          { Id: 5, redId: 2, Value1: 12550, Value2: 21450, Weight: 5000, SunNum: 0 },
          { Id: 6, redId: 2, Value1: 24450, Value2: 26150, Weight: 2381, SunNum: 0 },
          { Id: 7, redId: 3, Value1: 9450, Value2: 18550, Weight: 2500, SunNum: 0 },
          { Id: 8, redId: 3, Value1: 18550, Value2: 21450, Weight: 5000, SunNum: 0 },
          { Id: 9, redId: 3, Value1: 21450, Value2: 30550, Weight: 2500, SunNum: 0 }
        ],
        redMaxBagCfg: [
          { Id: 1, redId: 1, Value1: 150, Value2: 1850, Weight: 2300, SunNum: 0 },
          { Id: 2, redId: 1, Value1: 1850, Value2: 4150, Weight: 4700, SunNum: 0 },
          { Id: 3, redId: 1, Value1: 4150, Value2: 6250, Weight: 3000, SunNum: 0 },
          { Id: 4, redId: 1, Value1: 288000, Value2: 288000, Weight: 1000, SunNum: 20 },
          { Id: 5, redId: 2, Value1: 7450, Value2: 12550, Weight: 2619, SunNum: 0 },
          { Id: 6, redId: 2, Value1: 12550, Value2: 21450, Weight: 5000, SunNum: 0 },
          { Id: 7, redId: 2, Value1: 24450, Value2: 26150, Weight: 2381, SunNum: 0 },
          { Id: 8, redId: 2, Value1: 1888000, Value2: 1888000, Weight: 2000, SunNum: 10 },
          { Id: 9, redId: 3, Value1: 9450, Value2: 18550, Weight: 2500, SunNum: 0 },
          { Id: 10, redId: 3, Value1: 18550, Value2: 21450, Weight: 5000, SunNum: 0 },
          { Id: 11, redId: 3, Value1: 21450, Value2: 30550, Weight: 2500, SunNum: 0 },
          { Id: 12, redId: 3, Value1: 3888000, Value2: 3888000, Weight: 2000, SunNum: 5 }
        ]
      },
      showData: [],
      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
      copyDialogVisible: false,

      edit: {
        raffleLevel: 0,
        visible: false,
        item: newPrizePoolCfg(),
        isEdit: false,
        gamesSortDialogVisible: false,
        cfgType: 0
      },
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      redEdit: {
        visible: false,
        isEdit: false,
        item: newRedPoolCfg(),
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
        { 'value': 1, 'label': '黄金红包' },
        { 'value': 2, 'label': '铂金红包' },
        { 'value': 3, 'label': '钻石红包' }
      ],

      // 投注金
      betScenes: [
        { 'value': 1, 'label': '累计下注' },
        { 'value': 2, 'label': '连胜' }
      ],
      // 奖励类型
      rebateScenes: [
        { 'value': 1, 'label': '红包' },
        { 'value': 2, 'label': '头像框' }
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
      todayRaffleAmount: 0,
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
    this.getData()
    this.env = store.getters.env || this.env
    this.getList()
    this.getPropList()
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
    getRedEditTitle() {
      return this.redEdit.isEdit ? '修改配置' : '新增配置'
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
    handleRedCreate(nType) {
      this.redEdit.item = newRedPoolCfg()
      this.redEdit.isEdit = false
      this.redEdit.visible = true
      this.redEdit.cfgType = nType
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
      if (ob.TaskType === 2) {
        this.updatePropOptions(ob.RewardType)
      }
    },
    handleDelete(ob, nType) {
      let $this = this
      this.$confirm('是否确认删除此奖池配置?', '提示', {type:'warning'}).then(() => {
        if (nType === 1) {
          const delIndex = $this.item.taskCfgData.findIndex(item => item.Id === ob.Id)
          this.item.taskCfgData.splice(delIndex, 1)
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    handleRedEdite(ob, nType) {
      this.redEdit.cfgType = nType
      this.redEdit.visible = true
      this.redEdit.isEdit = true
      this.initRedFormData(ob.Id)
    },
    initRedFormData(id) {
      if (id > 0) {
        if (this.redEdit.cfgType === 1) {
          for (let i = 0; i < this.item.redBagCfg.length; i++) {
            const data = this.item.redBagCfg[i]
            if (data.Id === id) {
              Object.assign(this.redEdit.item, data)
              break
            }
          }
        } else if (this.redEdit.cfgType === 2) {
          for (let i = 0; i < this.item.redMaxBagCfg.length; i++) {
            const data = this.item.redMaxBagCfg[i]
            if (data.Id === id) {
              Object.assign(this.redEdit.item, data)
              break
            }
          }
        }
      }
    },
    handleRedDelete(ob, nType) {
      let $this = this
      this.$confirm('是否确认删除此奖池配置?', '提示', {type:'warning'}).then(() => {
        if (nType === 1) {
          const delIndex = $this.item.redBagCfg.findIndex(item => item.Id === ob.Id)
          this.item.redBagCfg.splice(delIndex, 1)
        } else if (nType === 2) {
          const delIndex = $this.item.redMaxBagCfg.findIndex(item => item.Id === ob.Id)
          this.item.redMaxBagCfg.splice(delIndex, 1)
        }
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
      if (this.edit.cfgType === 1) {
        for (let i = 0; i < this.item.taskCfgData.length; i++) {
          const data = this.item.taskCfgData[i]
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
      for (let i = 0; i < insertList.length; i++) {
        this.item.WhitelistCfg.UidList.push({
          "uid" : insertList[i]
        })
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
      }
    },
    saveRedData() {
      if (this.redEdit.cfgType === 1) {
        this.saveRedCfg()
      } else if (this.redEdit.cfgType === 2) {
        this.saveMaxRedCfg()
      }
    },
    saveRedCfg() {
      if (this.redEdit.isEdit) {
        for (var i = 0; i < this.item.redBagCfg.length; i++) {
          if (this.item.redBagCfg[i].Id === this.redEdit.item.Id) {
            this.item.redBagCfg[i].Value1 = this.redEdit.item.Value1
            this.item.redBagCfg[i].Value2 = this.redEdit.item.Value2
            this.item.redBagCfg[i].Weight = this.redEdit.item.Weight
            this.item.redBagCfg[i].SunNum = this.redEdit.item.SunNum
          }
        }
      } else {
        var isExit = false
        for (var i = 0; i < this.item.redBagCfg.length; i++) {
          if (this.item.redBagCfg[i].Id === this.redEdit.item.Id) {
            this.item.redBagCfg[i].Value1 = this.redEdit.item.Value1
            this.item.redBagCfg[i].Value2 = this.redEdit.item.Value2
            this.item.redBagCfg[i].Weight = this.redEdit.item.Weight
            this.item.redBagCfg[i].SunNum = this.redEdit.item.SunNum
            isExit = true
            break
          }
        }
        if (!isExit) {
          this.item.redBagCfg.push(this.redEdit.item)
        }
      }
      this.redEdit.visible = false
      this.redEdit.cfgType = 0
    },
    saveMaxRedCfg() {
      if (this.redEdit.isEdit) {
        for (var i = 0; i < this.item.redMaxBagCfg.length; i++) {
          if (this.item.redMaxBagCfg[i].Id === this.redEdit.item.Id) {
            this.item.redMaxBagCfg[i].Value1 = this.redEdit.item.Value1
            this.item.redMaxBagCfg[i].Value2 = this.redEdit.item.Value2
            this.item.redMaxBagCfg[i].Weight = this.redEdit.item.Weight
            this.item.redMaxBagCfg[i].SunNum = this.redEdit.item.SunNum
          }
        }
      } else {
        var isExit = false
        for (var i = 0; i < this.item.redMaxBagCfg.length; i++) {
          if (this.item.redMaxBagCfg[i].Id === this.redEdit.item.Id) {
            this.item.redMaxBagCfg[i].Value1 = this.redEdit.item.Value1
            this.item.redMaxBagCfg[i].Value2 = this.redEdit.item.Value2
            this.item.redMaxBagCfg[i].Weight = this.redEdit.item.Weight
            this.item.redMaxBagCfg[i].SunNum = this.redEdit.item.SunNum
            isExit = true
            break
          }
        }
        if (!isExit) {
          this.item.redMaxBagCfg.push(this.redEdit.item)
        }
      }
      this.redEdit.visible = false
      this.redEdit.cfgType = 0
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
            this.item.taskCfgData[i].RewardId = this.edit.item.RewardId
            this.item.taskCfgData[i].RewardType = this.edit.item.RewardType
            this.item.taskCfgData[i].RewardName = this.edit.item.RewardName
            this.item.taskCfgData[i].GameType = this.edit.item.GameType
            this.item.taskCfgData[i].TaskType = this.edit.item.TaskType
            this.item.taskCfgData[i].RewardTime = this.edit.item.RewardTime
          }
        }
      } else {
        var isExit = false
        for (var i = 0; i < this.item.taskCfgData.length; i++) {
          if (this.item.taskCfgData[i].Id === this.edit.item.Id) {
            this.item.taskCfgData[i].MatchNum = this.edit.item.MatchNum
            this.item.taskCfgData[i].RewardNum = this.edit.item.RewardNum
            this.item.taskCfgData[i].RewardId = this.edit.item.RewardId
            this.item.taskCfgData[i].RewardType = this.edit.item.RewardType
            this.item.taskCfgData[i].RewardName = this.edit.item.RewardName
            this.item.taskCfgData[i].GameType = this.edit.item.GameType
            this.item.taskCfgData[i].TaskType = this.edit.item.TaskType
            this.item.taskCfgData[i].RewardTime = this.edit.item.RewardTime
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
            $this.item.ShowGold = old.ShowGold
            $this.item.ShowTimes = old.ShowTimes
            if (old.IsSend !== null) {
              $this.item.IsSend = old.IsSend
            }
            $this.item.EveryDayStartTime = this.getStartMidnightTimestamp(old.EveryDayStartTime * 1000)
            $this.item.EveryDayEndTime = this.getEndMidnightTimestamp(old.EveryDayStartTime * 1000,old.EveryDayEndTime * 1000)
            $this.item.LimitReceiveNum1 = old.LimitReceiveNum1 / 1000
            $this.item.LimitReceiveNum2 = old.LimitReceiveNum2 / 1000
            $this.item.LimitReceiveNum3 = old.LimitReceiveNum3 / 1000
            $this.item.LimitMaxNum = old.LimitMaxNum / 1000
            if (old.StartTime === 0) {
              $this.item.StartTime = new Date().setSeconds(0)
            }
            if (old.EndTime === 0) {
              $this.item.EndTime = $this.item.StartTime + 86400000
            }
            $this.item.SingleLimitNum = old.SingleLimitNum / 1000
            $this.item.EveryDayLimitNum = old.EveryDayLimitNum / 1000
            $this.item.SumLimitNum = old.SumLimitNum / 1000
            if (old.taskCfgData.length > 0) {
              $this.item.taskCfgData = this.getPokerCfgData(old.taskCfgData)
            }
            if (old.redBagCfg.length > 0) {
              $this.item.redBagCfg = old.redBagCfg
            }
            if (old.redMaxBagCfg.length > 0) {
              $this.item.redMaxBagCfg = old.redMaxBagCfg
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
            // 检查属性AbTest是否存在
            if (old.AbTest !== undefined) {
              $this.item.WhitelistCfg['AbTest'] = old.AbTest
            } else {
              $this.item.WhitelistCfg['AbTest'] = {
                switch: false,
                bPercent: 0,
              }
            }
            $this.$refs.compare.SetOldVal(old)
          }
          this.getGameAll()
        }
      })
    },
    updateData() {
      // 设置修改后数据
      this.configCheck()
      var startTime = Math.floor(this.item.StartTime / 1000)
      var endTime = Math.floor(this.item.EndTime / 1000)
      var everyStartTime = Math.floor(this.item.EveryDayStartTime / 1000)
      var everyEndTime = Math.floor(this.item.EveryDayEndTime / 1000)
      var taskCfgData = this.getTaskCfgData(this.item.taskCfgData)
      var whiteList = this.getWhiteList()

      if (this.item.WhitelistCfg.AppIdList.length === 0 && this.version === 'V2') {
        this.item.WhitelistCfg.AppIdList.push(this.appId)
      }
      var tableData = {
        IsOpen: this.item.IsOpen,
        IsSend: this.item.IsSend,
        StartTime: startTime,
        EndTime: endTime,
        EveryDayStartTime: everyStartTime,
        EveryDayEndTime: everyEndTime,
        ShowGold: this.item.ShowGold,
        ShowTimes: this.item.ShowTimes,
        SingleLimitNum: Math.ceil(this.item.SingleLimitNum * 1000),
        EveryDayLimitNum: Math.ceil(this.item.EveryDayLimitNum * 1000),
        SumLimitNum: Math.ceil(this.item.SumLimitNum * 1000),
        LimitReceiveNum1: Math.ceil(this.item.LimitReceiveNum1 * 1000),
        LimitReceiveNum2: Math.ceil(this.item.LimitReceiveNum2 * 1000),
        LimitReceiveNum3: Math.ceil(this.item.LimitReceiveNum3 * 1000),
        LimitMaxNum: Math.ceil(this.item.LimitMaxNum * 1000),
        taskCfgData: taskCfgData,
        redBagCfg: this.item.redBagCfg,
        redMaxBagCfg: this.item.redMaxBagCfg,
        GameIdCfg: this.item.GameIdCfg,
        WhiteList: whiteList,
        IsWhite: this.item.IsWhite,
        AppIdList: this.item.WhitelistCfg.AppIdList,
        SiteIdList: this.item.WhitelistCfg.SiteIdList,
        AbTest: this.item.WhitelistCfg.AbTest
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
    getMatchTypeName(taskType) {
      var itemTypeName = ''
      for (let i = 0; i < this.betScenes.length; i++) {
        if (this.betScenes[i].value === taskType) {
          itemTypeName = this.betScenes[i].label
          break
        }
      }
      return itemTypeName
    },
    getCondName(type, rewardType) {
      var itemTypeName = ''
      if (rewardType === 1) {
        for (let i = 0; i < this.rebateScenes.length; i++) {
          if (this.rebateScenes[i].value === type) {
            itemTypeName = this.rebateScenes[i].label
            break
          }
        }
      } else if (rewardType === 2) {
        for (let i = 0; i < this.propTypeOptions.length; i++) {
          if (this.propTypeOptions[i].value === rewardType) {
            itemTypeName = this.propTypeOptions[i].label
            break
          }
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
    },
    getShowRedData(cfgId) {
      var cfg = ''
      for (let i = 0; i < this.rewardTypes.length; i++) {
        if (this.rewardTypes[i].value === cfgId) {
          cfg = this.rewardTypes[i].label
          break
        }
      }
      return cfg
    },
    getRedBagCfgData(num) {
      return num / 1000
    },
    getRedBagWeightCfg(num) {
      return num / 100
    },
    getStartMidnightTimestamp(nTime) {
      if (nTime === 0) {
        return 0
      }
      const now = new Date(nTime)
      var nHour = now.getHours()
      var nMin = now.getMinutes()
      const currTime = new Date()
      currTime.setHours(nHour, nMin,0,0)
      return currTime.getTime()
    },
    getEndMidnightTimestamp(nStartTime, nEndTime) {
      if (nEndTime === 0) {
        return 0
      }
      const start = new Date(nStartTime)
      var sHour = start.getHours()
      var sMin = start.getMinutes()

      const end = new Date(nEndTime)
      var eHour = end.getHours()
      var eMin = end.getMinutes()

      const currTime = new Date()
      currTime.setHours(eHour, eMin,0,0)
      var retTime = currTime.getTime()
      if (sHour > eHour) {
        retTime = retTime + 86400000
      } else if (sHour === eHour) {
        if (eMin <= sMin) {
          retTime = retTime + 86400000
        }
      }
      return retTime
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
          this.edit.item.RewardName = this.propOptions[i].label
          break
        }
      }
    },
    //************************ 道具配置 ************************
    openCopyDialog() {
      this.copyDialogVisible = true
    },
    onCloseCopyDialog() {
      this.copyDialogVisible = false
    }
  }
}
</script>

<style>

</style>
