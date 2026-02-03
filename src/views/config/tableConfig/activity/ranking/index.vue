<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="RankingConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['cfgId', 'name']" />
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
        width="1200px"
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
                  <el-form-item label="玩家奖励上限：" prop="extend.maxReward" :required="true">
                    <el-input v-model.number="edit.item.extend.maxReward" placeholder="请输入玩家奖励上限" >
                      <template slot="append">
                        （₱）
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="活动展示金额：" prop="extend.rewardShow" :required="true">
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
                <el-col :span="24">
                  <el-form-item label="参与活动用户类型：" :required="true">
                    <el-select v-model="edit.item.extend.userFilterType" placeholder="请选择" style="width:280px" @change="onUserTypeChange">
                      <el-option
                        v-for="item in userFilterTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="showUserTagCondition">
                  <el-form-item label="标签类型：">
                    <el-select v-model="edit.userTagType" placeholder="请选择标签类型" @change="onTagTypeChange">
                      <el-option
                        v-for="item in userTagTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="showUserTagCondition">
                  <el-form-item label="标签子类：">
                    <el-select v-model="edit.userTagIds" multiple placeholder="请选择标签子类">
                      <el-option
                        v-for="item in edit.userTagIdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
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
                <fieldset style="margin-top: 10px">
                  <legend>入榜资格和奖励</legend>
                  <el-form :model="edit.item" label-width="130px" size="mini">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="累计有效下注：" prop="extend.minScore" :required="true">
                          <el-input v-model.number="edit.item.extend.minScore" placeholder="请输入有效下注" >
                            <template slot="append">
                              （₱）
                            </template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="有效单次下注：" prop="extend.minBet" :required="true">
                          <el-input v-model="edit.item.extend.minBet" placeholder="请输入计入排行榜的有效单次下注" >
                            <template slot="append">
                              （₱）
                            </template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="奖励类型：" prop="extend.progressRewardItems[0].rewardType" :required="true">
                          <el-select
                            v-model="edit.item.extend.progressRewardItems[0].rewardType"
                            placeholder="请选择奖励类型"
                            size="mini"
                            @change="onProgressRewardTypeChange"
                          >
                            <el-option
                              v-for="item in rewardTypes"
                              :label="item.label"
                              :value="item.value"
                              :key="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="edit.item.extend.progressRewardItems[0].rewardType === 4">
                      <el-col>
                        <el-form-item label="道具类型：" prop="extend.progressRewardItems[0].rewardSubType" :required="true">
                          <el-select
                            v-model="edit.item.extend.progressRewardItems[0].rewardSubType"
                            placeholder="请选择道具类型"
                            size="mini"
                            @change="updatePropOptions(edit.item.extend.progressRewardItems[0].rewardSubType, 0)"
                          >
                            <el-option
                              v-for="item in propTypeOptions"
                              :label="item.label"
                              :value="item.value"
                              :key="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="道具名称：" prop="extend.progressRewardItems[0].rewardId" :required="true">
                          <el-select v-model.number="edit.item.extend.progressRewardItems[0].rewardId" placeholder="请选择道具">
                            <el-option
                              v-for="item in getPropOptions(0)"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="showPropTimeOptions(edit.item.extend.progressRewardItems[0].rewardSubType)">
                        <el-form-item
                          label="可用时间："
                          prop="extend.progressRewardItems[0].rewardExpireDays" :required="true"
                        >
                          <el-select
                            v-model.number="edit.item.extend.progressRewardItems[0].rewardExpireDays"
                            placeholder="请选择可用时间"
                          >
                            <el-option
                              v-for="item in propDayTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="奖励数值：" prop="extend.progressReward" :required="true">
                          <el-input v-model="edit.item.extend.progressRewardItems[0].rewardNum" placeholder="请输入奖励数值" >
                            <template slot="append">
                              （{{ getRewardUnit(edit.item.extend.progressRewardItems[0].rewardType) }}）
                            </template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </fieldset>
                <fieldset style="margin-top: 10px">
                  <legend>排名奖励方式</legend>
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
                </fieldset>
                <fieldset style="margin-top: 10px">
                  <legend>排名奖励配置</legend>
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
                      prop="rewardItem"
                      label="奖励类型"
                    >
                      <template slot-scope="scope">
                        <el-select v-model.number="scope.row.rewardItem.rewardType" placeholder="请选择奖励类型" @change="onRowRewardTypeChange(scope.row.rewardItem)">
                          <el-option
                            v-for="item in rewardTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="reward"
                      width="105"
                    >
                      <template slot="header" slot-scope="scope">
                        {{ edit.item.extend.rewardWay === 1 ? '奖励金额' : '奖励百分比%' }}
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.rewardItem.rewardNum" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="rewardItem"
                      label="道具类型"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-if="showRowPropSelect(scope.row.rewardItem)"
                          v-model.number="scope.row.rewardItem.rewardSubType"
                          placeholder="请选择道具类型"
                          @change="updatePropOptions(scope.row.rewardItem.rewardSubType, scope.$index + 1)"
                        >
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
                      prop="rewardItem"
                      label="道具名称"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-if="showRowPropSelect(scope.row.rewardItem)"
                          v-model.number="scope.row.rewardItem.rewardId"
                          placeholder="请选择道具"
                        >
                          <el-option
                            v-for="item in propOptions[scope.$index + 1]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="rewardItem"
                      label="可用时间"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-if="showPropTimeOptions(scope.row.rewardItem.rewardSubType)"
                          v-model.number="scope.row.rewardItem.rewardExpireDays"
                          placeholder="请选择可用时间"
                        >
                          <el-option
                            v-for="item in propDayTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
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

const activityId = 19

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
      gameIdList: [],
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
      rewardType: 2, // 奖励类型 1. 金币 2. 投注金 3. 返水金 4 .道具
      rewardSceneId: 27,
      progressReward: 0,
      rewardShow: 0,
      progressRewardItems: [{
        rewardId: 0,
        rewardNum: 0,
        rewardType: 2, // 奖励类型 1. 金币 2. 投注金 3. 返水金 4 .道具
        rewardSubType: 0,
        rewardExpireDays: 1
      }],
      userFilterType: 0,
      userFilterCondition: {
        userTagTypes: [],
        userTagItems: []
      }
    }
  }
}

function newRewardItem() {
  return {
    rewardId: 0,
    rewardNum: 0,
    rewardType: 2, // 奖励类型 1. 金币 2. 投注金 3. 返水金 4 .道具
    rewardSubType: 0,
    rewardExpireDays: 1
  }
}

function newRankRewardItem() {
  return {
    rankStart: 0,
    rankEnd: 0,
    reward: 0,
    rewardItem: newRewardItem()
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
        userTagType: 0,
        userTagIds: [],
        userTagTypeOptions: []
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
        // { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        // { 'value': 3, 'label': '返水金' },
        { 'value': 4, 'label': '道具' }
      ],

      filterText: '',
      filterGameIds: [ 2031, 10002 ],
      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],

      propList: [],
      propOptions: [],
      // 道具类型选项列表
      propTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false },
        { 'value': 5, 'label': 'SlotFreeSpin', disabled: false }
      ],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ],
      // 用户过滤类型选项列表
      userFilterTypes: [
        { 'value': 0, 'label': '所有用户' },
        { 'value': 1, 'label': '用户标签' },
      ],
      // 用户标签类型
      userTagTypeOptions: [
        //{ value: 2, label: '游戏强度', children: [{ value: 20000, label: '游戏强度' }] },
        { value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' }
          ]
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
    this.getPropList()
  },
  watch: {
    'edit.item.extend.userFilterType': {
      handler(newVal, oldVal) {
        if (newVal === 1) { // 用户标签
          this.edit.userTagType = this.userTagTypeOptions[0].value
          this.onTagTypeChange(this.edit.userTagType)
        }
      },
      immediate: true
    }
  },
  computed: {
    showUserTagCondition() {
      return this.edit.item.extend.userFilterType === 1 // 用户标签
    },
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
      this.edit.item.extend.rewardList.push(newRankRewardItem())
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
    handleSave() {
      const item = this.getPostItem()
      if (item === undefined) {
        return
      }
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
    getPostItem() {
      const item = JSON.parse(JSON.stringify(this.edit.item))
      item.activity.startTime /= 1000
      item.activity.endTime /= 1000
      item.activity.showEndTime /= 1000
      item.extend.minBet *= 1000
      item.extend.minScore *= 1000
      item.extend.maxReward *= 1000

      if (item.extend.rewardList.length === 0) {
        Message.error('请添加排名奖励配置')
        return
      }

      if (item.extend.progressRewardItems && item.extend.progressRewardItems.length > 0) {
        const rewardItem = item.extend.progressRewardItems[0]
        if (rewardItem.rewardType === 2) {
          rewardItem.rewardNum *= 1000
        }
        rewardItem.rewardNum = parseInt(rewardItem.rewardNum)
        item.extend.progressReward = rewardItem.rewardNum
      }

      let maxRankShow = 0
      for (const reward of item.extend.rewardList) {
        if (item.extend.rewardWay === 1) {
          reward.reward *= 1000
          reward.rewardItem.rewardNum *= 1000
        }
        maxRankShow = Math.max(maxRankShow, reward.rankEnd)
      }
      item.extend.maxRankShow = maxRankShow

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

      if (item.extend.userFilterType !== 0) {
        let userTagItems = []
        for (let tagId of this.edit.userTagIds) {
          userTagItems.push({
            tagId: tagId,
            tagType: this.edit.userTagType,
            tagValues: []
          })
        }
        item.extend.userFilterCondition = {
          userTagTypes: [this.edit.userTagType],
          userTagItems: userTagItems,
        }
      } else {
        item.extend.userFilterCondition = {}
      }

      return item
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

          for (const rewardCfg of item.extend.rewardList) {
            if (rewardCfg.rewardItem === undefined) {
              rewardCfg.rewardItem = {}
              this.$set(rewardCfg, 'rewardItem', newRewardItem())
              rewardCfg.rewardItem.rewardNum = rewardCfg.reward
              rewardCfg.rewardItem.rewardType = 2
            }
            if (item.extend.rewardWay === 1) {
              rewardCfg.rewardItem.rewardNum /= 1000
            }
            rewardCfg.reward = rewardCfg.rewardItem.rewardNum
          }

          if (item.activity.whitelist.uidList.length > 0) {
            item.activity.whitelist.uidList = item.activity.whitelist.uidList.join(',')
          } else {
            item.activity.whitelist.uidList = ''
          }

          if (item.extend.userFilterType === undefined) {
            item.extend.userFilterType = 0
          }

          if (item.extend.progressRewardItems === undefined) {
            item.extend.progressRewardItems = []
            item.extend.progressRewardItems.push(newRewardItem())
            item.extend.progressRewardItems[0].rewardNum = item.extend.progressReward
          } else if (item.extend.progressRewardItems && item.extend.progressRewardItems.length > 0) {
            const rewardItem = item.extend.progressRewardItems[0]
            if (rewardItem.rewardType === 2) { // 金币时需要除以1000
              rewardItem.rewardNum /= 1000
            }
            item.extend.progressReward = rewardItem.rewardNum

            this.updatePropOptions(rewardItem.rewardSubType, 0)
          }

          if (item.extend.userFilterCondition === undefined) {
            item.extend.userFilterCondition = {}
          }

          this.edit.userTagType = 0
          this.edit.userTagIds = []
          if (item.extend.userFilterCondition.userTagItems !== undefined && item.extend.userFilterCondition.userTagItems.length > 0) {
          this.edit.userTagType  = item.extend.userFilterCondition.userTagItems[0].tagType
            for (let tagItem of item.extend.userFilterCondition.userTagItems) {
              this.edit.userTagIds.push(tagItem.tagId)
            }
          }

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
    onUserTypeChange() {
      this.edit.userTagType = 5
      this.edit.userTagIds = []
    },
    onTagTypeChange(tagType) {
      const tagOptions = this.userTagTypeOptions.find(item => item.value === tagType)
      this.edit.userTagIdOptions = tagOptions && tagOptions.children || []
    },
    onProgressRewardTypeChange() {
      const rewardItem = this.edit.item.extend.progressRewardItems[0]
      if (rewardItem.rewardType === 2) {
        rewardItem.rewardId = 0
        rewardItem.rewardSubType = 0
        rewardItem.rewardExpireDays = 1
      }
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
            if (this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }
            if (obj.CategoryID !== 1) { // 过滤掉非Slots游戏
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
    getRewardUnit(rewardType) {
      if ([1,2].indexOf(rewardType) >= 0) {
        return '₱'
      } else if (rewardType === 4) {
        return '个'
      } else {
        return '未知'
      }
    },
    getRewardTypeLabel(rewardType) {
      const item = this.rewardTypes.find(x => x.value === rewardType)
      return item ? item.label : '未知'
    },
    onRowRewardTypeChange(rewardItem) {
      if (rewardItem.rewardType !== 4) {
        rewardItem.rewardId = 0
        rewardItem.rewardSubType = 0
        rewardItem.rewardExpireDays = 0
      } else {
        rewardItem.rewardExpireDays = 1
      }
    },
    //************************ 游戏列表相关 ************************
    // ************************ 道具配置 ************************
    getPropList() {
      const $this = this
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: $this.env,
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
    getPropOptions(index) {
      if (this.propOptions.length === 0) {
        return []
      }
      return this.propOptions[index]
    },
    updatePropOptions(propType, index) {
      console.log('updatePropOptions-propType:', propType, ' index:', index)
      this.propOptions[index] = []
      let currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        const prop = this.propList[i]
        if (prop.item_type === propType && prop.status === 1) {
          if (prop.item_type !== 2 && prop.item_type !== 4 && prop.item_type !== 5) {
            const expTime = prop.expire_time * 1000
            if (currTime < expTime) {
              let option = { 'value': prop.id, 'label': prop.item_name, disabled: false }
              this.propOptions[index].push(option)
            } else {
              console.log('道具 type:' + prop.item_type + ' name:' + prop.item_name + '已过期')
            }
          } else {
            let option = { 'value': prop.id, 'label': prop.item_name, disabled: false }
            this.propOptions[index].push(option)
          }
        }
      }
    },
    showPropTimeOptions(propType) {
      return [2, 5].includes(propType)
    },
    showRowPropSelect(rewardItem) {
      return rewardItem.rewardType === 4
    },
    getPropTimeOptions(itemId) {
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
    // ************************ 道具配置 ************************
  }
}
</script>

<style scoped>

</style>
