<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="7日留存活动配置">
          <!-- 整体使用一个 el-row 来包含左右两列 -->
          <el-row :gutter="20"> <!-- 增加 gutter 保持左右间距 -->
            <!-- 左侧表单项，占据 12 份宽度 -->

            <el-col :span="12">
              <el-form ref="item" :model="item" label-width="180px"> <!-- 调整 label-width 以适应两列布局 -->
                <el-form-item>
                  <el-alert
                    title="注：整个活动真正的结束时间是活动结束时间+任务配置天数+发奖持续天数"
                    type="warning"
                    :closable="false"
                    show-icon
                  >
                  </el-alert>
                </el-form-item>
                <el-form-item label="活动开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.IsOpen" :active-value="true" :inactive-value="false" />
                </el-form-item>
                <el-form-item label="活动开始时间：">
                  <el-date-picker v-model="item.Activity.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" size="mini" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="活动结束时间：">
                  <el-date-picker v-model="item.Activity.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" size="mini" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="奖池初始值：" :required="true">
                  <el-input v-model="item.ActivityExtend.InitBonusPool" placeholder="请输入参数" />
                </el-form-item>
                <el-form-item label="奖池最大值：" :required="true">
                  <el-input v-model="item.ActivityExtend.BonusPoolMax" placeholder="请输入参数" />
                </el-form-item>
                <el-form-item label="奖池金额类型：" :required="true" class="form-item left-align">
                  <el-select v-model="item.ActivityExtend.BonusRewardType" class="type-select">
                    <el-option
                      v-for="cond in bonusTypeOptions"
                      :key="cond.value"
                      :label="cond.label"
                      :value="cond.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="增加奖池比例(‰)：" :required="true">
                  <el-input
                    v-model.number="item.ActivityExtend.FreeRate"
                    placeholder="请输入参数"
                    suffix-icon="‰"
                  />
                </el-form-item>
                <el-form-item label="玩家占奖池最大比例(‰)：" :required="true">
                  <el-input
                    v-model.number="item.ActivityExtend.UserMaxRate"
                    placeholder="请输入参数"
                    suffix-icon="‰"
                  />
                </el-form-item>
                <el-form-item label="星星解锁数量：" :required="true">
                  <el-input v-model.number="item.ActivityExtend.StarUnlockCount" placeholder="请输入参数" />
                </el-form-item>
                <el-form-item label="发奖持续天数：" :required="true">
                  <el-input v-model.number="item.ActivityExtend.GrantKeepDay" placeholder="请输入参数" />
                </el-form-item>

                <!-- 规则图片横板/竖版也放在左侧，或者根据需要调整 -->
                <el-form-item label="规则图片横板：" :required="true">
                  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <span v-for="(v,k) in item.Activity.RuleImgHor" :key="'hor-'+k" style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -15px; right: 1px; cursor: pointer; z-index: 99; color: red;" @click="removeRuleImage(k, 'Hor')">移除</span>
                      <ImagePicker v-model="item.Activity.RuleImgHor[k]" />
                    </span>
                    <el-button @click="addRuleImage('Hor')">添加</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="规则图片竖版：" :required="true">
                  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <span v-for="(v,k) in item.Activity.RuleImgVer" :key="'ver-'+k" style="display: inline-block; position: relative;">
                      <span style="position: absolute; top: -15px; right: 1px; cursor: pointer; z-index: 99; color: red;" @click="removeRuleImage(k, 'Vor')">移除</span>
                      <ImagePicker v-model="item.Activity.RuleImgVer[k]" />
                    </span>
                    <el-button @click="addRuleImage('Vor')">添加</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="12">
              <fieldset style="margin-top: 0">
                <legend>游戏入口配置</legend>
                <el-button type="primary" size="mini" @click="addGameIcon()">添加配置</el-button>
                <el-button type="success" size="mini" @click="showGamesSortDialog()">排序</el-button>
                <el-row :gutter="5" style="margin-top: 10px;">
                  <el-col>
                    <el-table
                      :data="item.GameIcon"
                      border
                      style="width: 100%"
                      :cell-style="libShow.DefaultTableCell"
                    >
                      <el-table-column prop="Id" label="游戏" width="250"> <!-- 调整列宽 -->
                        <template slot-scope="scope">
                          <el-cascader
                            v-model="scope.row.Id"
                            :options="treeData"
                            :props="{ value: 'id', label: 'label', children: 'children', emitPath: false }"
                            clearable
                            size="mini"
                            placeholder="请选择游戏"
                            style="width: 100%;"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="Img" label="图片" width="250"> <!-- 调整列宽 -->
                        <template slot-scope="scope">
                          <div style="text-align: center;">
                            <ImagePicker v-model="scope.row.Img" size="mini" />
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" column-key="op" width="80"> <!-- 调整列宽 -->
                        <template slot-scope="scope">
                          <el-button size="mini" icon="el-icon-delete" @click="removeGameIcon(scope.$index)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="任务配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
            添加配置
          </el-button>

          <el-form ref="TaskConfig" v-model="item.TaskConfig" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.TaskConfig"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="TaskID"
                label="配置ID"
                sortable
                width="200"
              />
              <el-table-column
                prop="Title"
                label="描述"
                width="200"
              />
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

        <el-tab-pane label="宝箱配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreateBonusIcon()">
            添加配置
          </el-button>

          <el-form ref="BonusIcon" v-model="item.BonusIcon" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="item.BonusIcon"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column prop="Img" label="宝箱图片" width="200">
                <template slot-scope="scope">
                  <ImagePicker v-model="scope.row.Img" />
                </template>
              </el-table-column>
              <el-table-column prop="StarCount" label="星星数量" width="200">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.StarCount" size="mini" />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                column-key="op"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleDeleteBonusIcon(scope.$index)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col>
                <el-form-item label="白名单开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.IsWhite" :active-value="true" :inactive-value="false" />
                </el-form-item>
              </el-col>
              <el-col v-if="version === 'V1'" :span="11">
                <el-form-item label="AppId白名单：" prop="item.Whitelist.AppIdList">
                  <el-select v-model="item.Activity.Whitelist.AppIdList" multiple placeholder="请选择" style="width: 400px" @change="onAppIdOptionsChange">
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
                <el-form-item label="SiteId白名单：" prop="item.Whitelist.SiteIdList">
                  <SiteSelect v-model="item.Activity.Whitelist.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="A/B测试开关：" prop="item.Activity.Whitelist.AbTest">
                  <el-switch v-model="item.Activity.Whitelist.AbTest.switch" :active-value="true" :inactive-value="false" active-text="开启" inactive-text="关闭" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="B分组比例：" prop="item.Activity.Whitelist.AbTest.bPercent">
                  <el-input v-model.number="item.Activity.Whitelist.AbTest.bPercent" oninput=" if(value < 0 || value === '' || value == null){value = 0;} ">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="参与活动用户类型：">
                  <el-select
                    v-model="edit.userTagConfig.TagType"
                    placeholder="请选择标签类型"
                    @change="onTagTypeChange"
                  >
                    <el-option
                      v-for="item in userTagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col v-if="showUserTagCondition">
                <el-form-item label="标签子类：">
                  <el-select
                    v-model="edit.userTagConfig.TagId"
                    placeholder="请选择标签子类"
                    multiple
                    style="width: 400px"
                  >
                    <el-option
                      v-for="item in edit.userTagIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row style="top: 10px">
          <el-button type="primary" @click="saveGamesSort">保存</el-button>
        </el-row>
      </el-dialog>

      <el-dialog
        :title="getEditTitle()"
        :visible.sync="edit.visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
          <!-- 配置ID和描述字段 -->
          <el-form-item label="配置ID：" :required="true" prop="Id">
            <el-col :span="11">
              <el-input v-model.number="edit.item.TaskID" :disabled="edit.isEdit" placeholder="请填写配置id" />
            </el-col>
          </el-form-item>

          <el-form-item label="描述：" :required="true" prop="Title">
            <el-col :span="11">
              <el-input v-model="edit.item.Title" placeholder="请填写描述" />
            </el-col>
          </el-form-item>

          <!-- 动态任务项 -->
          <template v-for="(item, index) in edit.item.TaskItem">
            <el-form-item :key="index" :label="'任务' + (index + 1)" class="task-item">
              <el-col :span="16" class="task-content">
                <!-- 任务类型 -->
                <el-form-item label="任务类型：" class="form-item left-align">
                  <el-select v-model="item.TaskType" class="type-select">
                    <el-option
                      v-for="type in taskTypeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>

                <!-- 条件类型 -->
                <el-form-item label="条件类型：" class="form-item left-align">
                  <el-select v-model="item.ConditionType" class="type-select">
                    <el-option
                      v-for="cond in conditionTypeOptions"
                      :key="cond.value"
                      :label="cond.label"
                      :value="cond.value"
                    />
                  </el-select>
                </el-form-item>

                <!-- 条件目标 -->
                <el-form-item label="条件目标：" class="form-item left-align">
                  <el-input v-model="item.ConditionTarget" class="target-input" />
                </el-form-item>

                <el-form-item label="任务描述：" class="form-item left-align">
                  <el-input v-model="item.Title" class="target-input" />
                </el-form-item>

                <!-- 奖励信息 -->
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addReward(item)">
                  添加奖励
                </el-button>

                <el-table :data="item.Reward" class="reward-table">
                  <!-- 奖励类型选择 -->
                  <el-table-column prop="RewardType" label="奖励类型">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.RewardType" size="mini">
                        <el-option
                          v-for="type in rewardTypeOptions"
                          :key="type.value"
                          :label="type.label"
                          :value="type.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>

                  <!-- 奖励ID输入 -->
                  <el-table-column prop="Prop" label="道具">
                    <template slot-scope="scope">
                      <el-input
                        :value="formatPropValue(scope.row.Prop, scope.row.RichCard, scope.row.RewardType)"
                        size="mini"
                        :disabled="scope.row.RewardType !== 3 && scope.row.RewardType !== 5"
                        :class="{ 'clickable': scope.row.RewardType === 3 || scope.row.RewardType === 5 }"
                        @click.native.stop="showPropDialog(index, scope.$index)"
                      />
                    </template>
                  </el-table-column>

                  <!-- 数量输入 -->
                  <el-table-column prop="Num" label="数量">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Num" size="mini" />
                    </template>
                  </el-table-column>

                  <!-- 图片输入 -->
                  <el-table-column prop="Img" label="图片" width="120">
                    <template slot-scope="scope">
                      <ImagePicker v-model="scope.row.Img" />
                    </template>
                  </el-table-column>

                  <!-- 删除按钮 -->
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="removeReward(item, scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>

              <!-- 删除按钮 -->
              <el-col :span="2" class="delete-btn-col">
                <el-button size="mini" type="danger" @click="removeTask(index)">
                  删除任务
                </el-button>
              </el-col>
            </el-form-item>
          </template>

          <!-- 添加任务按钮 -->
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addTask">
            添加任务
          </el-button>
        </el-form>

        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="10">
            <el-button type="primary" size="medium" @click="saveTask()">保存</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-dialog
        title="道具配置"
        :visible.sync="edit.propDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :width="'30%'"
        :max-width="'250px'"
        :modal="false"
      >
        <el-form ref="edit.prop" :model="edit.currentProp" label-width="150px" size="small">
          <!-- 类型选择 -->
          <el-form-item label="类型：" prop="ItemType">
            <el-select v-model.number="edit.currentProp.ItemType" size="mini" placeholder="请选择" style="width: 100%" @change="showItemList(edit.currentProp.ItemType)">
              <el-option
                v-for="option in ITEM_TYPE_OPTIONS"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>
          </el-form-item>

          <!-- 名称选择 -->
          <el-form-item label="名称：" prop="PropID">
            <template>
              <el-select v-model.number="edit.currentProp.PropID" size="mini" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="option in tableItemData"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="disableByPropId(option.value)"
                />
              </el-select>
            </template>
          </el-form-item>

          <!-- 时间选择（特定类型显示） -->
          <el-form-item v-show="(edit.currentProp.ItemType === 2 || edit.currentProp.ItemType === 4 || edit.currentProp.ItemType === 5)" label="时间：" prop="Time" style="width: 100%">
            <template>
              <el-select v-model="edit.currentProp.Time" size="mini" placeholder="请选择">
                <el-option
                  v-for="option in ITEM_DAY_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled || (edit.currentProp.ItemType === 5 && (option.value === 0 || option.value === 365))"
                />
              </el-select>
            </template>
          </el-form-item>

          <!-- 保存按钮 -->
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="saveProp()">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <el-dialog
        title="富裕卡配置"
        :visible.sync="edit.richCardDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :width="'30%'"
        :max-width="'250px'"
        :modal="false"
      >
        <el-form ref="robotForm" :model="edit.currentRichCard" label-width="200px">
          <el-form-item v-model="edit.currentRichCard.GameId" label="游戏：" :required="true" label-width="120px">
            <el-select v-model="edit.currentRichCard.GameId" filterable placeholder="游戏筛选" size="mini">
              <el-option
                v-for="(k,v) in richCardGameMap"
                :label="k"
                :value="parseInt(v)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="富裕卡：" label-width="120px" :required="true">
            <el-cascader
              v-model="edit.currentRichCard.richCardSelect"
              :options="cfgData.richCardList"
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item label="时间：" label-width="120px" :required="true">
            <template>
              <el-select v-model="edit.currentRichCard.Time" size="mini" placeholder="请选择">
                <el-option
                  v-for="option in ITEM_DAY_TYPE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="true"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-row style="margin-top: 10px">
            <el-col :span="10" :offset="10">
              <el-button type="primary" size="medium" @click="saveRichCard()">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <el-row>
        <br>
        <el-button type="primary" @click="saveData">保存</el-button>
      </el-row>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import { $libShow, DataRule } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'
import { ITEM_DAY_TYPE_OPTIONS, ITEM_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import { getCustomize, updateCustomize } from '@/api/custome_configV2'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, ImagePicker, Publish, SiteSelect },
  data() {
    return {
      subKey: 'seven_day_cfg',
      libShow: $libShow,
      dialogKey: 0,
      form: {
        Data: {}
      },
      item: {
        IsOpen: false,
        IsWhite: false,
        Activity: {
          Whitelist: {
            AppIdList: [],
            SiteIdList: [],
            AbTest: {
              switch: false,
              bPercent: 0
            }
          },
          GameIdList: [],
          RuleImgHor: [],
          RuleImgVer: []
        },
        ActivityExtend: {},
        TaskConfig: [],
        BonusIcon: [],
        GameIcon: [],
        UserTagConfig: []
      },
      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
      filterGameIds: [],
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
        }
      ],
      edit: {
        visible: false,
        isEdit: false,
        item: {
          TaskID: 0,
          Title: '',
          TaskItem: [{
            ConditionType: null,
            ConditionTarget: null,
            Reward: [{
              RewardType: null,
              Prop: null,
              RichCard: null,
              Num: 0,
              Img: ''
            }]
          }]
        },
        gamesSortDialogVisible: false,
        propDialogVisible: false,
        currentProp: {
          ItemType: null,
          PropID: null,
          Time: null,
          TaskIndex: null,
          RewardIndex: null
        },
        richCardDialogVisible: false,
        currentRichCard: {
          GameId: null,
          richCardSelect: [],
          Time: null,
          TaskIndex: null,
          RewardIndex: null
        },
        userTagIdOptions: [],
        userTagConfig: {
          TagId: [],
          TagValue: 0,
          TagType: 0
        }
      },
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      filterText: '',
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      bonusTypeOptions: [
        { value: 1, label: '金币(投注金)' }
        // { value: 4, label: '金币(返水金)' }
      ],
      taskTypeOptions: [
        { value: 1, label: '单次' },
        { value: 2, label: '循环' }
      ],
      conditionTypeOptions: [
        { value: 1, label: '登录' },
        { value: 2, label: '下注值' }
        // { value: 3, label: '下注次数' }
      ],
      rewardTypeOptions: [
        { value: 1, label: '金币(投注金)' },
        // { value: 4, label: '金币(返水金)' },
        { value: 2, label: '星星' },
        { value: 3, label: '道具' },
        { value: 5, label: '富裕卡' }
      ],
      propsConfig: [],
      tableItemData: [],
      ITEM_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      gameData: [],
      richCardGameMap: null,
      cfgData: {},
      // 用户标签类型
      userTagOptions: [
        { value: 0, label: '所有', children: [
          { value: 0, label: '所有' }
        ]
        },
        { value: 5, label: 'Slots用户类型', children: [
          { value: 50001, label: 'Slots新增用户' },
          { value: 50002, label: 'Slots登录天数' },
          { value: 50008, label: 'Slots回归用户' }
        ]
        }
      ]
    }
  },
  computed: {
    showUserTagCondition() {
      return this.edit.userTagConfig.TagType === 5
    }
  },
  created() {
    this.getMissionData()
    this.getData()
    this.env = store.getters.env || this.env
    this.getItemList()
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
    handleCreate() {
      this.edit.isEdit = false
      this.edit.visible = true
      this.edit.item.TaskID = this.item.TaskConfig.length + 1
      this.edit.item.Title = 'Day' + (this.item.TaskConfig.length + 1)
      this.edit.item.TaskItem = []
    },
    showGamesSortDialog() {
      if (!this.item.GameIcon || this.item.GameIcon.length === 0) {
        this.$message.warning('没有可排序的游戏配置')
        return
      }

      // 映射 GameIcon 生成 GamesSorted
      this.GamesSorted = this.item.GameIcon.map((g, index) => {
        // 通过 treeData 查找游戏名
        const gameName = this.findGameNameById(g.Id)
        return {
          GameId: g.Id,
          Name: gameName,
          OrderNo: index + 1 // 初始用顺序号
        }
      })
      this.edit.gamesSortDialogVisible = true
    },
    findGameNameById(id) {
      let name = ''
      function dfs(list) {
        for (let i = 0; i < list.length; i++) {
          const node = list[i]
          if (node.id === id) {
            name = node.label
            return
          }
          if (node.children && node.children.length > 0) {
            dfs(node.children)
          }
        }
      }
      dfs(this.treeData)
      return name || `ID: ${id}`
    },
    saveGamesSort() {
      this.edit.gamesSortDialogVisible = false
      // 根据排序后的 GamesSorted 重新排列 GameIcon
      const sortedIds = this.GamesSorted.map(g => g.GameId)
      this.item.GameIcon.sort((a, b) => {
        return sortedIds.indexOf(a.Id) - sortedIds.indexOf(b.Id)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    handleEdit(ob) {
      this.edit.isEdit = true
      this.edit.item = JSON.parse(JSON.stringify(ob))
      for (let i = 0; i < this.edit.item.TaskItem.length; i++) {
        if (this.edit.item.TaskItem[i].ConditionType === 2) {
          this.edit.item.TaskItem[i].ConditionTarget /= 1000
        }
        for (let j = 0; j < this.edit.item.TaskItem[i].Reward.length; j++) {
          if (this.edit.item.TaskItem[i].Reward[j].RewardType === 1 || this.edit.item.TaskItem[i].Reward[j].RewardType === 4) {
            this.edit.item.TaskItem[i].Reward[j].Num /= 1000
          }
        }
      }
      if (this.richCardGameMap === null) {
        this.$set(this, 'richCardGameMap', {})
        for (let i = 0; i < this.gameData.length; i++) {
          if (this.cfgData.openGames[this.gameData[i].Gid]) {
            this.richCardGameMap[this.gameData[i].Gid] = this.gameData[i].Name
          }
        }
      }
      this.edit.visible = true
    },
    handleDelete(ob) {
      const $this = this
      this.$confirm('是否确认删除此配置?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.item.TaskConfig.findIndex(item => item.TaskID === ob.TaskID)
        this.item.TaskConfig.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    delRow(row) {
      const newList = []
      for (const key in this.item.WhitelistCfg.UidList) {
        if (this.item.WhitelistCfg.UidList[key].uid === row.uid) {
          continue
        }
        newList.push(this.item.WhitelistCfg.UidList[key])
      }
      this.item.WhitelistCfg.UidList = newList
    },
    getData() {
      const $this = this
      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const old = JSON.parse(response.Data.Data)
            $this.item = JSON.parse(response.Data.Data)
            $this.item.Activity.StartTime *= 1000
            $this.item.Activity.EndTime *= 1000
            $this.item.ActivityExtend.InitBonusPool /= 1000
            $this.item.ActivityExtend.BonusPoolMax /= 1000
            if ($this.item.Activity.Whitelist.AbTest === undefined) {
              $this.$set($this.item.Activity.Whitelist, 'AbTest', {
                switch: false,
                bPercent: 0
              })
            }
            if ($this.item.UserTagConfig && $this.item.UserTagConfig.length > 0) {
              const tagList = $this.item.UserTagConfig
              const tagIds = tagList.map(t => t.TagId)
              const first = tagList[0]

              $this.edit.userTagConfig = {
                TagId: tagIds,
                TagType: first.TagType ?? 0,
                TagValue: first.TagValue ?? first.TagType ?? 0
              }
              $this.onTagTypeChange($this.edit.userTagConfig.TagType)
            }
            $this.$refs.compare.SetOldVal(old)
          }
          this.getGameAll()
        }
      })
    },
    getMissionData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slotsmission'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const o = JSON.parse(response.Data.Data)
          const openGames = {}
          for (const k in o.BuyFreeList) {
            openGames[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].Open
          }

          const richCardList = []
          for (const k in o.RichCardList) {
            const item = {
              value: o.RichCardList[k].RichCardLevel,
              label: '星级' + o.RichCardList[k].RichCardLevel,
              children: []
            }
            for (const i in o.RichCardList[k].Bets) {
              item.children.push({
                value: o.RichCardList[k].Bets[i],
                label: '金额 ' + o.RichCardList[k].Bets[i] / 1000
              })
            }
            richCardList.push(item)
          }
          this.cfgData = {
            openGames: openGames,
            richCardList: richCardList
          }
        }
      })
    },
    saveData() {
      // 设置修改后数据
      var tableData = JSON.parse(JSON.stringify(this.item))
      tableData.Activity.StartTime /= 1000
      tableData.Activity.EndTime /= 1000
      tableData.ActivityExtend.InitBonusPool *= 1000
      tableData.ActivityExtend.BonusPoolMax *= 1000
      tableData.Activity.GameIdList = []
      for (const key in tableData.GameIcon) {
        tableData.Activity.GameIdList.push(tableData.GameIcon[key].Id)
      }
      tableData.Activity.Whitelist.AppIdList = [this.appId]
      if (this.edit.userTagConfig && this.edit.userTagConfig.TagId.length > 0) {
        tableData.UserTagConfig = this.edit.userTagConfig.TagId.map(id => ({
          TagId: id,
          TagType: this.edit.userTagConfig.TagType,
          TagValue: this.edit.userTagConfig.TagValue
        }))
      } else {
        tableData.UserTagConfig = []
      }

      this.$refs.compare.SetNewVal(tableData)
      this.$refs.compare.Compare((isEdit) => {
        if (!isEdit) {
          this.$message.error('没有任何修改，不需要提交')
          return
        }

        this.$emit('saveData')
        this.lock = false
        this.form.Data = JSON.stringify(tableData)
        updateCustomize(this.form).then(response => {
          if (response.RetCode === 0) {
            const showMsg = '保存成功'
            this.$message.success(showMsg)
            // this.getData()
          } else {
            const errMsg = '保存成功失败！'
            this.$message.error(errMsg + response.Data)
          }
        })
      })
      // setTimeout(() => {
      //   this.IsUpdate = false
      // }, 1000)
    },
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.item.Activity.Whitelist.AppIdList)
    },
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.item.Activity.Whitelist.SiteIdList)
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
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

          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            this.gameData.push({
              Gid: response.Data[i].Gid,
              Name: response.Data[i].Name
            })
          }
        }
      })
    },
    // 添加任务
    addTask() {
      this.edit.item.TaskItem.push({
        Title: '',
        TaskType: null,
        ConditionType: null,
        ConditionTarget: 0,
        Reward: []
      })
      if (this.richCardGameMap === null) {
        this.$set(this, 'richCardGameMap', {})
        for (let i = 0; i < this.gameData.length; i++) {
          if (this.cfgData.openGames[this.gameData[i].Gid]) {
            this.richCardGameMap[this.gameData[i].Gid] = this.gameData[i].Name
          }
        }
      }
    },
    // 删除任务
    removeTask(index) {
      this.edit.item.TaskItem.splice(index, 1)
    },
    // 添加奖励
    addReward(task) {
      task.Reward.push({
        RewardType: null,
        Prop: null,
        RichCard: null,
        Num: 0,
        Img: ''
      })
    },
    // 删除奖励
    removeReward(task, index) {
      task.Reward.splice(index, 1)
    },
    saveTask() {
      if (!this.checkTask()) {
        return
      }

      let index = 0
      if (this.edit.isEdit) {
        index = this.item.TaskConfig.findIndex(item => item.TaskID === this.edit.item.TaskID)
        this.$set(this.item.TaskConfig, index, JSON.parse(JSON.stringify(this.edit.item)))
      } else {
        const foundItem = this.item.TaskConfig.find(item => item.TaskID === this.edit.item.TaskID)
        if (foundItem) {
          Message.error(`已经存在相同的ID值`)
          return
        }
        this.item.TaskConfig.push(JSON.parse(JSON.stringify(this.edit.item)))
        index = this.item.TaskConfig.length - 1
      }
      for (let i = 0; i < this.item.TaskConfig[index].TaskItem.length; i++) {
        this.item.TaskConfig[index].TaskItem[i].ConditionTarget = Number(this.item.TaskConfig[index].TaskItem[i].ConditionTarget)
        if (this.item.TaskConfig[index].TaskItem[i].ConditionType === 2) {
          this.item.TaskConfig[index].TaskItem[i].ConditionTarget *= 1000
        }
        for (let j = 0; j < this.item.TaskConfig[index].TaskItem[i].Reward.length; j++) {
          if (this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 1 || this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 4 ||
            this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 2) {
            this.item.TaskConfig[index].TaskItem[i].Reward[j].Prop = null
            this.item.TaskConfig[index].TaskItem[i].Reward[j].RichCard = null
          }
          if (this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 1 || this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 4) {
            this.item.TaskConfig[index].TaskItem[i].Reward[j].Num *= 1000
          } else {
            this.item.TaskConfig[index].TaskItem[i].Reward[j].Num = parseInt(this.item.TaskConfig[index].TaskItem[i].Reward[j].Num, 10)
          }
        }
      }
      this.edit.visible = false
    },
    checkTask() {
      if (!this.edit.isEdit) {
        const foundItem = this.item.extend.TaskConfig.find(item => item.TaskID === this.edit.item.TaskID)
        if (foundItem) {
          Message.error(`已经存在相同的ID值`)
          return false
        }
      }

      for (let i = 0; i < this.edit.item.TaskItem.length; i++) {
        if (this.edit.item.TaskItem[i].ConditionType === 2) {
          if (Number(this.edit.item.TaskItem[i].ConditionTarget) === 0) {
            Message.error(`任务` + (i + 1) + '条件目标为0')
            return false
          }
          if (Number.isNaN(Number(this.edit.item.TaskItem[i].ConditionTarget))) {
            Message.error(`任务` + (i + 1) + '条件目标不是数字')
            return false
          }
        }
        for (let j = 0; j < this.edit.item.TaskItem[i].Reward.length; j++) {
          if (this.edit.item.TaskItem[i].Reward[j].RewardType === 3 && this.edit.item.TaskItem[i].Reward[j].Prop === null) {
            Message.error(`任务` + (i + 1) + '存在奖励类型是道具，而没有配置具体道具信息')
            return false
          }
          if (this.edit.item.TaskItem[i].Reward[j].RewardType === 5 && this.edit.item.TaskItem[i].Reward[j].RichCard === null) {
            Message.error(`任务` + (i + 1) + '存在奖励类型是富裕卡，而没有配置具体道具信息')
            return false
          }
          if (this.edit.item.TaskItem[i].Reward[j].Num === '0') {
            Message.error(`任务` + (i + 1) + '第' + (j + 1) + '个奖励配置数量为0')
            return false
          }
        }
      }
      return true
    },
    showPropDialog(taskIndex, rewardIndex) {
      if (this.edit.item.TaskItem[taskIndex].Reward[rewardIndex].RewardType === 3) {
        const prop = this.edit.item.TaskItem[taskIndex].Reward[rewardIndex].Prop
        if (prop !== null) {
          this.edit.currentProp.PropID = prop.PropID
          this.edit.currentProp.Time = prop.Time
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === prop.PropID) {
              this.edit.currentProp.ItemType = this.tableData[i].item_type
            }
          }
        } else {
          this.edit.currentProp.PropID = null
          this.edit.currentProp.ItemType = null
          this.edit.currentProp.Time = null
        }
        this.edit.currentProp.TaskIndex = taskIndex
        this.edit.currentProp.RewardIndex = rewardIndex
        this.edit.propDialogVisible = true
      } else {
        const richCard = this.edit.item.TaskItem[taskIndex].Reward[rewardIndex].RichCard
        if (richCard !== null) {
          this.edit.currentRichCard.GameId = richCard.SlotsType
          this.edit.currentRichCard.Time = richCard.Time
          this.$set(this.edit.currentRichCard, 'richCardSelect', [])
          this.edit.currentRichCard.richCardSelect.push(richCard.Level)
          this.edit.currentRichCard.richCardSelect.push(richCard.Bet)
        } else {
          this.edit.currentRichCard.GameId = null
          this.edit.currentRichCard.Time = 2
          this.edit.currentRichCard.richCardSelect = null
        }
        this.edit.currentRichCard.TaskIndex = taskIndex
        this.edit.currentRichCard.RewardIndex = rewardIndex
        this.edit.richCardDialogVisible = true
      }
    },
    getItemList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 200
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            this.tableData = objs.list
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      })
    },
    showItemList(id) {
      this.tableItemData = []
      const currTime = new Date().getTime()
      for (let i = 0; i < this.tableData.length; i++) {
        let str = this.tableData[i].item_name
        if (this.tableData[i].item_extra.length > 0) {
          const exitData = JSON.parse(this.tableData[i].item_extra)
          if (exitData != null) {
            if (exitData.showName != null) {
              str = str + '(' + exitData.showName + ')'
            }
          }
        }
        if (this.tableData[i].item_type === id && this.tableData[i].status === 1) {
          if (this.isTicketProp(this.tableData[i].item_type)) {
            const expTime = this.tableData[i].expire_time * 1000
            if (currTime < expTime) {
              this.tableItemData.push({ 'value': this.tableData[i].id, 'label': str, disabled: false })
            }
          } else {
            this.tableItemData.push({ 'value': this.tableData[i].id, 'label': str, disabled: false })
          }
        }
      }
    },
    isTicketProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET
    },
    disableByPropId(propId) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === propId && this.tableData[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET) {
          if (this.tableData[i].item_extra !== null && JSON.parse(this.tableData[i].item_extra).specialAttr === 1) { // 如果是邀请函
            return true
          }
        }
      }
      return false
    },
    saveProp() {
      this.edit.item.TaskItem[this.edit.currentProp.TaskIndex].Reward[this.edit.currentProp.RewardIndex].Prop = {
        PropID: this.edit.currentProp.PropID,
        Time: this.edit.currentProp.Time
      }
      this.edit.item.TaskItem[this.edit.currentProp.TaskIndex].Reward[this.edit.currentProp.RewardIndex].RichCard = null
      this.edit.propDialogVisible = false
    },
    saveRichCard() {
      this.edit.item.TaskItem[this.edit.currentRichCard.TaskIndex].Reward[this.edit.currentRichCard.RewardIndex].RichCard = {
        SlotsType: this.edit.currentRichCard.GameId,
        Time: this.edit.currentRichCard.Time
      }
      this.edit.item.TaskItem[this.edit.currentRichCard.TaskIndex].Reward[this.edit.currentRichCard.RewardIndex].RichCard.Level = this.edit.currentRichCard.richCardSelect[0]
      this.edit.item.TaskItem[this.edit.currentRichCard.TaskIndex].Reward[this.edit.currentRichCard.RewardIndex].RichCard.Bet = this.edit.currentRichCard.richCardSelect[1]
      this.edit.item.TaskItem[this.edit.currentRichCard.TaskIndex].Reward[this.edit.currentRichCard.RewardIndex].Prop = null
      this.edit.richCardDialogVisible = false
    },
    formatPropValue(prop, richCard, rewardType) {
      if (rewardType === 3 && prop !== null) {
        const item = this.tableData.find(item => item.id === prop.PropID)
        if (item !== null) {
          let str = item.item_name
          const exitData = JSON.parse(item.item_extra)
          if (exitData != null) {
            if (exitData.showName != null) {
              str = str + '(' + exitData.showName + ')'
            }
          }
          return str
        }
        return ''
      } else if (rewardType === 5 && richCard !== null) {
        let str = this.richCardGameMap[richCard.SlotsType]
        str = str + '(' + richCard.Bet / 1000 + ')'
        return str
      }
    },
    handleCreateBonusIcon() {
      this.item.BonusIcon.push({
        Img: '',
        StarCount: 0
      })
    },
    handleDeleteBonusIcon(index) {
      this.$confirm('是否确认删除此配置?', '提示', { type: 'warning' }).then(() => {
        this.item.BonusIcon.splice(index, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    addRuleImage(type) {
      if (type === 'Hor') {
        if (this.item.Activity.RuleImgHor) {
          this.item.Activity.RuleImgHor.push('')
        } else {
          this.$set(this.item.Activity, 'RuleImgHor', [''])
        }
      } else if (type === 'Vor') {
        if (this.item.Activity.RuleImgVer) {
          this.item.Activity.RuleImgVer.push('')
        } else {
          this.$set(this.item.Activity, 'RuleImgVer', [''])
        }
      }
    },
    removeRuleImage(index, type) {
      if (type === 'Hor') {
        this.item.Activity.RuleImgHor.splice(index, 1)
      } else if (type === 'Vor') {
        this.item.Activity.RuleImgVer.splice(index, 1)
      }
    },
    addGameIcon() {
      const item = {
        Id: 0,
        Img: ''
      }
      if (!this.item.GameIcon) {
        this.$set(this.item, 'GameIcon', [])
      }
      this.item.GameIcon.push(item)
    },
    removeGameIcon(index) {
      this.item.GameIcon.splice(index, 1)
    },
    onTagTypeChange(tagType) {
      const tagOptions = this.userTagOptions.find(item => item.value === tagType)
      this.edit.userTagIdOptions = tagOptions && tagOptions.children || []
    }
  }
}
</script>

<style>

</style>
