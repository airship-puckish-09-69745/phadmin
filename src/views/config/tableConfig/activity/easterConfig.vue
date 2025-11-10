<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="EasterConfig" :env-empty="true" :check="configCheck" :make-content="makeContent" :attr-names="getPublishAttrNames()" :head-attrs="['cfgId']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
      <el-table ref="filterTable"
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
            {{ formatTime(scope.row.StartTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.EndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="EndTime" label="展示结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.ShowEndTime) }}
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
            <el-button v-if="scope.row.Status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.Status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
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
    <el-dialog :title="getEditTitle()"
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
                  <el-form-item label="下注/赢钱获得星辰比例：" :required="true">
                    <el-input v-model.number="edit.item.EggShellGainRatio" >
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="抽到已收集礼物返星辰比例：" prop="EggShellReturnRatio" :required="true" >
                    <el-input v-model="edit.item.EggShellReturnRatio">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="每抽星辰数量：" :required="true">
                    <el-input v-model="edit.item.EggShellsPerRaffle" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="首抽星辰数量：" :required="true">
                    <el-input v-model="edit.item.EggShellsRaffleFirst" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发放奖励类型：" :required="true">
                    <el-select v-model="edit.item.RewardCfg.RewardType" placeholder="请选择" style="width:90px">
                      <el-option
                        v-for="item in rewardTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-if="edit.item.RewardCfg.RewardType === 2" v-model="edit.item.RewardCfg.UseSceneId" placeholder="请选择投注金" style="width:150px">
                      <el-option
                        v-for="scene in betScenes"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                    <el-select v-if="edit.item.RewardCfg.RewardType === 3" v-model="edit.item.RewardCfg.UseSceneId" placeholder="请选择返水金" style="width:150px">
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
                  <el-form-item label="集齐礼物图鉴奖金：" :required="true">
                    <el-input v-model.number="edit.item.RewardCfg.BigPrizeReward">
                      <template slot="append">（₱）</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="当日发奖额阈值：" :required="true">
                    <el-input v-model.number="edit.item.DayPrizeThreshold">
                      <template slot="append">（₱）</template>
                    </el-input>
                    <span v-if="todayRaffleAmount > edit.item.DayPrizeThreshold" style="color: red">今日发奖已超阈值（{{todayRaffleAmount}}），已开启限制</span>
                    <span v-else style="color: red">今日发奖总额（{{todayRaffleAmount}}）</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="调试时间偏移量（仅测试用）：" :required="true">
                    <el-input v-model.number="edit.item.DebugTimeOffset">
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
                  <el-col :span="2" v-for="(v,k) in edit.item.RuleImgHor">
                  <span style="display: inline-block; position: relative;">
                    <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Hor')">移除</span>
                    <ImagePicker v-model="edit.item.RuleImgHor[k]" />
                  </span>
                  </el-col>
                  <span style="position: relative;">
                    <el-button @click="addRuleImage('Hor')">添加</el-button>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="规则图片竖版：" :required="true">
                  <el-col :span="2" v-for="(v,k) in edit.item.RuleImgVer">
                  <span style="display: inline-block; position: relative;">
                  <span style="position: absolute; top: -20px; right: 1px; cursor: pointer; z-index: 99" @click="removeRuleImage(k, 'Vor')">移除</span>
                    <ImagePicker v-model="edit.item.RuleImgVer[k]" />
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

        <el-tab-pane label="礼物配置">
          <el-row :gutter="5">
            <el-col>
              <el-table
                :data="edit.eggs"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column
                  prop="Name"
                  label="礼物名称"
                  width="200"
                />
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  v-for="(item, index) in edit.eggColumns"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Rewards[index]" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="常规奖池配置">
          <el-button type="primary" @click="addNormalEggWeightConfig()" size="mini">添加配置</el-button>
          <el-row :gutter="5">
            <el-col :span="12" v-for="(item, index) in edit.normalEggWeightConfigs">
              <fieldset style="margin-top: 10px">
                <legend>
                  抽数区间
                  <el-input
                    v-model.number="item.MinRaffleNo"
                    size="mini"
                    style="width: 100px"
                    oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/> 至
                  <el-input
                    v-model.number="item.MaxRaffleNo"
                    size="mini"
                    style="width: 100px"
                    oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                </legend>
                <el-button type="danger" size="mini" @click="removeNormalEggWeightConfig(index)">移除</el-button>
                <el-table :data="item.Weights">
                  <el-table-column
                    prop="EggId"
                    label="礼物ID"
                  />
                  <el-table-column
                    prop="Name"
                    label="礼物名称"
                  >
                    <template slot-scope="scope">
                      {{ getEggName(scope.row.EggId) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Reward"
                    label="奖励金额"
                  >
                    <template slot-scope="scope">
                      {{ getEggReward(scope.row.EggId) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Weight"
                    label="权重"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model.number="scope.row.Weight"
                        size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="保底奖池配置">
          <el-button type="primary" @click="addSpecialEggWeightConfig()" size="mini">添加配置</el-button>
          <el-row :gutter="5">
            <el-col :span="12" v-for="(item, index) in edit.specialEggWeightConfigs">
              <fieldset style="margin-top: 10px">
                <legend>
                  抽数范围
                  <el-input
                    v-model="item.RaffleNoList"
                    size="mini"
                    style="width: 400px">
                    <template slot="append">多个数字之间用 , 间隔</template>
                  </el-input>
                </legend>
                <el-button type="danger" size="mini" @click="removeSpecialEggWeightConfig(index)">移除</el-button>
                <el-table :data="item.Weights">
                  <el-table-column
                    prop="EggId"
                    label="礼物ID"
                  />
                  <el-table-column
                    prop="Name"
                    label="礼物名称"
                  >
                    <template slot-scope="scope">
                      {{ getEggName(scope.row.EggId) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Reward"
                    label="奖励金额"
                  >
                    <template slot-scope="scope">
                      {{ getEggReward(scope.row.EggId) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="Weight"
                    label="权重"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model.number="scope.row.Weight"
                        size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-col>
          </el-row>
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

        <el-tab-pane label="成就头像框配置">
          <el-table
            :data="edit.item.RewardCfg.Achievements"
            border
            style="width: 100%"
            :cell-style="libShow.DefaultTableCell"
          >
            <el-table-column
              prop="Level"
              label="成就等级"
              width="100"
            />
            <el-table-column
              prop="Level"
              label="成就描述"
            >
              <template slot-scope="scope">
                {{ achievementDescriptions[scope.row.Level] || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PropId"
              label="头像名称"
            >
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.PropId" placeholder="请选择道具">
                  <el-option
                    v-for="item in propOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="PropExpireDays"
              label="可用时间"
            >
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.PropExpireDays" placeholder="请选择可用时间">
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
              prop="PropNum"
              label="发放数量"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PropNum" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form ref="whitelistCfg" label-width="220px">
            <el-row v-if="version === 'V1'">
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

const filterMap = {}

function newEggs() {
  return [
    { EggId: 100, Name: 'SOCK-X', Reward: 88, Level: 0, Color: 1 },
    { EggId: 101, Name: 'SOCK-Ⅰ', Reward: 0.28, Level: 1, Color: 1 },
    { EggId: 102, Name: 'SOCK-Ⅱ', Reward: 1.8, Level: 2, Color: 1 },
    { EggId: 103, Name: 'SOCK-Ⅲ', Reward: 8.8, Level: 3, Color: 1 },
    { EggId: 104, Name: 'SOCK-Ⅳ', Reward: 18, Level: 4, Color: 1 },
    { EggId: 105, Name: 'SOCK-Ⅴ', Reward: 28, Level: 5, Color: 1 },
    { EggId: 200, Name: 'BOX-X', Reward: 88, Level: 0, Color: 2 },
    { EggId: 201, Name: 'BOX-Ⅰ', Reward: 0.28, Level: 1, Color: 2 },
    { EggId: 202, Name: 'BOX-Ⅱ', Reward: 1.8, Level: 2, Color: 2 },
    { EggId: 203, Name: 'BOX-Ⅲ', Reward: 8.8, Level: 3, Color: 2 },
    { EggId: 204, Name: 'BOX-Ⅳ', Reward: 18, Level: 4, Color: 2 },
    { EggId: 205, Name: 'BOX-Ⅴ', Reward: 28, Level: 5, Color: 2 },
    { EggId: 300, Name: 'BELL-X', Reward: 88, Level: 0, Color: 3 },
    { EggId: 301, Name: 'BELL-Ⅰ', Reward: 0.28, Level: 1, Color: 3 },
    { EggId: 302, Name: 'BELL-Ⅱ', Reward: 1.8, Level: 2, Color: 3 },
    { EggId: 303, Name: 'BELL-Ⅲ', Reward: 8.8, Level: 3, Color: 3 },
    { EggId: 304, Name: 'BELL-Ⅳ', Reward: 18, Level: 4, Color: 3 },
    { EggId: 305, Name: 'BELL-Ⅴ', Reward: 28, Level: 5, Color: 3 },
    { EggId: 400, Name: 'COOKIE-X', Reward: 88, Level: 0, Color: 4 },
    { EggId: 401, Name: 'COOKIE-Ⅰ', Reward: 0.28, Level: 1, Color: 4 },
    { EggId: 402, Name: 'COOKIE-Ⅱ', Reward: 1.8, Level: 2, Color: 4 },
    { EggId: 403, Name: 'COOKIE-Ⅲ', Reward: 8.8, Level: 3, Color: 4 },
    { EggId: 404, Name: 'COOKIE-Ⅳ', Reward: 18, Level: 4, Color: 4 },
    { EggId: 405, Name: 'COOKIE-Ⅴ', Reward: 28, Level: 5, Color: 4 },
  ]
}

function newAchievements() {
  return [
    { Level: 1, PropId: 0, PropType: 2, PropNum: 1, PropExpireDays: 1},
    { Level: 2, PropId: 0, PropType: 2, PropNum: 1, PropExpireDays: 7},
    { Level: 3, PropId: 0, PropType: 2, PropNum: 1, PropExpireDays: 30}
  ]
}

function newItem() {
  const eggs = newEggs()
  return {
    ID: 0,
    IsOpen: 1,
    StartTime: Date.parse(new Date().toString()),
    EndTime: Date.parse(new Date().toString()),
    ShowEndTime: Date.parse(new Date().toString()),
    GameIdCfg: [],
    RuleImgHor: [],
    RuleImgVer: [],
    WhitelistCfg: {
      AppIdList: [],
      SiteIdList: [],
    },
    EggShellGainRatio: 100,
    EggShellReturnRatio: 10,
    DayPrizeThreshold: 0,
    RewardCfg:{
      RewardType: 1,
      UseSceneId: 0,
      BigPrizeReward: 88888,
      Achievements: newAchievements()
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
      { RankStart: 71, RankEnd: 100, Reward: 88 },
    ],
    EggCfg: {
      Eggs: eggs,
      WeightCfg: [newEggWeightCfg(1, eggs), newEggWeightCfg(1, eggs), newEggWeightCfg(2, eggs)],
    },
    EggShellsPerRaffle: 100,
    EggShellsRaffleFirst: 500,
    DebugTimeOffset: 0
  }
}

// 新的蛋权重配置
// conditionType 1=抽奖序号范围 2=特定的一个或多个抽奖序号
function newEggWeightCfg(conditionType, eggs) {
  let eggWeightCfg = {}
  if (conditionType === 1) {
    eggWeightCfg = {
      ConditionType: 1,
      MinRaffleNo: 0,
      MaxRaffleNo: 0,
      RaffleNoList: '',
      Weights: [],
    }
  } else {
    eggWeightCfg = {
      ConditionType: 2,
      MinRaffleNo: 0,
      MaxRaffleNo: 0,
      RaffleNoList: '',
      Weights: [],
    }
  }

  for (let i = 0; i < eggs.length; i++) {
    if (eggs[i].Level === 0) {
      continue
    }
    eggWeightCfg.Weights.push({
      EggId: eggs[i].EggId,
      Weight: 0,
    })
  }
  return eggWeightCfg
}

export default {
  components: {ImagePicker, Compare, Publish, GameLevel, MoneyInput, SiteSelect },
  data() {
    return {
      tableData: [],
      deleteData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      appId: store.getters.appId || -1,
      version: store.getters.version || 'V1',
      edit: {
        CfgId: 0,
        isEdit: false,
        visible: false,
        item: newItem(),
        title: "新增",
        gamesSortDialogVisible: false,
        normalEggWeightConfigs: [],
        specialEggWeightConfigs: [],
        eggs: [
          { Color: 1, Name: 'SOCK', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 2, Name: 'BOX', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 3, Name: 'BELL', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
          { Color: 4, Name: 'COOKIE', Rewards: { 0: 88, 1: 0.28, 2: 1.8, 3: 8.8, 4: 18, 5: 28} },
        ],
        eggColumns: [
          { prop: 'Reward0', label: 'X' },
          { prop: 'Reward1', label: 'Ⅰ' },
          { prop: 'Reward2', label: 'Ⅱ' },
          { prop: 'Reward3', label: 'Ⅲ' },
          { prop: 'Reward4', label: 'Ⅳ' },
          { prop: 'Reward5', label: 'Ⅴ' },
        ],
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
        EggShellGainRatio: '礼物获得倍率',
        EggShellReturnRatio: '礼物返还倍率',
        DayPrizeThreshold: '每日奖励阈值',
        RewardCfg: '奖励配置',
        RankCfg: '排行榜配置',
        EggCfg: '礼物配置',
        EggShellsPerRaffle: '每抽星辰数量',
        EggShellsRaffleFirst: '首抽星辰数量',
        DebugTimeOffset: '调试时间偏移',
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
        { 'value': 7, 'label': '【圣诞节礼物活动】任意游戏投注' },
        /*{ 'value': 1, 'label': '任意游戏投注' },
        { 'value': 2, 'label': '仅限Poker类游戏投注' },
        { 'value': 3, 'label': '仅限Slots类游戏投注' },
        { 'value': 4, 'label': '仅限Tongits游戏投注' },*/
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

      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
      propType: 2, // 头像框的道具属性值
      propList: [],
      // 道具选项列表
      propOptions: [],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ],
      achievementDescriptions: {
        1: "活动期间抽取过礼物",
        2: "活动期间解锁奖励礼物",
        3: "活动期间集齐所有礼物"
      }
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
  computed: {
    eggReward: {
      get() {

      }
    }
  },
  methods: {
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
    addNormalEggWeightConfig() {
      const eggWeightCfg = newEggWeightCfg(1, this.edit.item.EggCfg.Eggs)
      this.edit.normalEggWeightConfigs.push(eggWeightCfg)
    },
    removeNormalEggWeightConfig(index) {
      this.edit.normalEggWeightConfigs.splice(index, 1)
    },
    addSpecialEggWeightConfig() {
      const eggWeightCfg = newEggWeightCfg(2, this.edit.item.EggCfg.Eggs)
      this.edit.specialEggWeightConfigs.push(eggWeightCfg)
    },
    removeSpecialEggWeightConfig(index) {
      this.edit.specialEggWeightConfigs.splice(index, 1)
    },
    getList() {
      request({
        url: '/easterconfig/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'EndTime', -1)
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      const deleteList = []
      deleteList.push(ob)
      this.deleteData = deleteList
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
          url: '/easterconfig/update/status',
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
    getPostData() {
      if (this.edit.item.RewardCfg.RewardType === undefined) {
        Message.error('请选择奖励类型')
        return
      }
      if (this.edit.item.RewardCfg.UseSceneId === undefined) {
        this.edit.item.RewardCfg.UseSceneId = 0
      }
      if (this.edit.item.RewardCfg.RewardType !== 1 && this.edit.item.RewardCfg.UseSceneId === 0) {
        const typeObj = this.rewardTypes.find(item => item.value === this.edit.item.RewardCfg.RewardType)
        const typeName = typeObj ? typeObj.label : ''
        Message.error(`请选择【${typeName}】对应的使用场景`)
        return
      }

      for (let i = 0; i < this.edit.item.EggCfg.Eggs.length; i++) {
        const eggOrg = this.edit.item.EggCfg.Eggs[i]
        for (let ii = 0; ii < this.edit.eggs.length; ii++) {
          const egg = this.edit.eggs[ii]
          if (egg.Color === eggOrg.Color) {
            eggOrg.Reward = egg.Rewards[eggOrg.Level] * 1000
          }
        }
      }

      this.edit.item.EggCfg.WeightCfg = []
      for (let i = 0; i < this.edit.normalEggWeightConfigs.length; i++) {
        const eggWeightCfg = this.edit.normalEggWeightConfigs[i]
        const obj = {
          ConditionType: 1,
          MinRaffleNo: eggWeightCfg.MinRaffleNo,
          MaxRaffleNo: eggWeightCfg.MaxRaffleNo,
          RaffleNoList: [],
          Weights: eggWeightCfg.Weights,
        }
        this.edit.item.EggCfg.WeightCfg.push(obj)
      }
      for (let i = 0; i < this.edit.specialEggWeightConfigs.length; i++) {
        const eggWeightCfg = this.edit.specialEggWeightConfigs[i]
        const obj = {
          ConditionType: 2,
          MinRaffleNo: 0,
          MaxRaffleNo: 0,
          RaffleNoList: eggWeightCfg.RaffleNoList.split(',').map(item => parseInt(item)),
          Weights: eggWeightCfg.Weights,
        }
        this.edit.item.EggCfg.WeightCfg.push(obj)
      }

      console.log('getPostData: ' + JSON.stringify(this.edit.item.EggCfg))

      for (let i = 0; i < this.edit.item.RankCfg.length; i++) {
        const rank = this.edit.item.RankCfg[i]
        rank.Reward = rank.Reward * 1000
      }

      this.edit.item.RewardCfg.BigPrizeReward *= 1000

      if (this.edit.item.WhitelistCfg.AppIdList.length === 0 && this.version === 'V2') {
        this.edit.item.WhitelistCfg.AppIdList = [this.appId]
      }

      const data = {}
      data.ID = this.edit.item.ID
      data.IsOpen = this.edit.item.IsOpen
      data.StartTime = this.edit.item.StartTime / 1000
      data.EndTime = this.edit.item.EndTime / 1000
      data.ShowEndTime = this.edit.item.ShowEndTime / 1000
      data.GameIdCfg = JSON.stringify(this.edit.item.GameIdCfg)
      data.RuleImgHor = JSON.stringify(this.edit.item.RuleImgHor)
      data.RuleImgVer = JSON.stringify(this.edit.item.RuleImgVer)
      data.WhitelistCfg = JSON.stringify(this.edit.item.WhitelistCfg)
      data.EggShellGainRatio = this.edit.item.EggShellGainRatio
      data.EggShellReturnRatio = this.edit.item.EggShellReturnRatio
      data.DayPrizeThreshold = this.edit.item.DayPrizeThreshold * 1000
      data.RewardCfg = JSON.stringify(this.edit.item.RewardCfg)
      data.RankCfg = JSON.stringify(this.edit.item.RankCfg)
      data.EggCfg = JSON.stringify(this.edit.item.EggCfg)
      data.EggShellsPerRaffle = this.edit.item.EggShellsPerRaffle
      data.EggShellsRaffleFirst = this.edit.item.EggShellsRaffleFirst
      data.DebugTimeOffset = this.edit.item.DebugTimeOffset
      return data
    },
    handleSave() {
      const data = this.getPostData()
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(data)
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
        this.getTodayRaffleAmount(this.edit.item.ID)
        this.$refs.tree.setCheckedKeys(this.edit.item.GameIdCfg)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          const item = JSON.parse(JSON.stringify(_data))
          item.StartTime = item.StartTime * 1000
          item.EndTime = item.EndTime * 1000
          item.ShowEndTime = item.ShowEndTime * 1000
          item.GameIdCfg = JSON.parse(item.GameIdCfg)
          item.WhitelistCfg = JSON.parse(item.WhitelistCfg)
          item.RewardCfg = JSON.parse(item.RewardCfg)
          item.RewardCfg.BigPrizeReward = item.RewardCfg.BigPrizeReward / 1000
          item.RankCfg = JSON.parse(item.RankCfg)
          item.EggCfg = JSON.parse(item.EggCfg)
          item.RuleImgHor = JSON.parse(item.RuleImgHor)
          item.RuleImgVer = JSON.parse(item.RuleImgVer)
          item.DayPrizeThreshold = item.DayPrizeThreshold / 1000
          item.DebugTimeOffset = item.DebugTimeOffset || 0

          if (item.RewardCfg.Achievements === undefined) {
            item.RewardCfg.Achievements = newAchievements()
          }

          for (let i = 0; i < item.RankCfg.length; i++) {
            const rankCfg = item.RankCfg[i]
            rankCfg.Reward = rankCfg.Reward / 1000
          }

          for (let i = 0; i < item.EggCfg.Eggs.length; i++) {
            const egg = item.EggCfg.Eggs[i]
            egg.Reward = egg.Reward / 1000

            for (let ii = 0; ii < this.edit.eggs.length; ii++) {
              const eggShow = this.edit.eggs[ii]
              if (eggShow.Color === egg.Color) {
                eggShow.Rewards[egg.Level] = egg.Reward
              }
            }
          }

          this.edit.normalEggWeightConfigs = []
          this.edit.specialEggWeightConfigs = []
          for (let i = 0; i < item.EggCfg.WeightCfg.length; i++) {
            const eggWeightCfg = item.EggCfg.WeightCfg[i]
            if (eggWeightCfg.ConditionType === 1) {
              this.edit.normalEggWeightConfigs.push(eggWeightCfg)
            } else {
              eggWeightCfg.RaffleNoList = eggWeightCfg.RaffleNoList === '' ? '' : eggWeightCfg.RaffleNoList.join(',')
              this.edit.specialEggWeightConfigs.push(eggWeightCfg)
            }
          }

          this.edit.item = item
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }

          // 更新选中游戏的排序
          this.updateGamesSorted()

          console.log(this.edit.item.GameIdCfg)
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
    //************************ 规则图片相关 ************************
    addRuleImage(type) {
      console.log('addRuleImage type:', type)
      if (type === 'Hor') {
        this.edit.item.RuleImgHor.push('')
      } else {
        this.edit.item.RuleImgVer.push('')
      }
    },
    removeRuleImage(index, type) {
      console.log('removeRuleImage index:', index, 'type:', type)
      if (type === 'Hor') {
        this.edit.item.RuleImgHor.splice(index, 1)
      } else {
        this.edit.item.RuleImgVer.splice(index, 1)
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
    makeContent(key, addData, delData, editData) {
      // console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      let change = new Set()
      let add = new Set()
      let del = new Set()
      //新增取newVal
      if (addData) {
        console.log("addData",addData)
        for (var i=0; i<addData.length; i++) {
          for (let ele of addData[i]) {
            add.add(ele.newVal)
          }
        }
      }
      if (delData) {
        console.log("delData",delData)
        for (var i=0; i<delData.length; i++) {
          for (let ele of delData[i]) {
            del.add(ele.oldVal)
          }
        }
      }
      if (editData) {
        console.log("editData",editData)
        for (const edit of editData) {
          change.add(edit.Head.cfgId)
        }
      }
      if (change.size + del.size + add.size == 0) {
        console.log('no change return')
        return "没有修改!"
      }

      let str = ''
      let has = false
      for (let i=0; i<this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row.ID)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---');has=true
          const preVal = JSON.parse(row.WhitelistCfg)
          str += `\r\n修改:【${row.ID}】, appid:【${preVal.AppIdList}】 ${preVal.SiteIdList}`
        }
        if (add.has(row.ID)) {
          // console.log(JSON.stringify(row))
          const preVal = JSON.parse(row.WhitelistCfg)
          has && (str += "\r\n---\r\n");has=true
          str += `\r\n新增:【${row.ID}】, appid:【${preVal.AppIdList}】 ${preVal.SiteIdList}`}
      }
      for (let i=0; i<this.deleteData.length; i++) {
        const row = this.deleteData[i]
        if (del.has(row.ID)) {
          // console.log(JSON.stringify(row))
          const preVal = JSON.parse(row.WhitelistCfg)
          has && (str += "\r\n---\r\n");has=true
          str += `\r\n删除:【${row.ID}】, appid:【${preVal.AppIdList}】 ${preVal.SiteIdList}`
        }
      }
      console.log('str', str)
      return str
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
          Path: '/activity/easter/today/raffle/amount',
          CfgId: this.edit.item.ID
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

        this.getPropOptions(this.propType)
      })
    },
    getPropOptions(propType) {
      this.propOptions = [
        { 'value': 0, 'label': '请选择', disabled: false }
      ]
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
  }
}
</script>

<style>

</style>
