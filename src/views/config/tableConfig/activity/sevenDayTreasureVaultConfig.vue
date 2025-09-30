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
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.WhitelistCfg.AppIdList">
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
                <el-form-item label="SiteId白名单：" prop="item.WhitelistCfg.SiteIdList">
                  <SiteSelect v-model="item.Activity.Whitelist.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
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
                        :value="formatPropValue(scope.row.Prop)"
                        size="mini"
                        :disabled="scope.row.RewardType !== 3"
                        :class="{ 'clickable': scope.row.RewardType === 3 }"
                        @click.native.stop="scope.row.RewardType === 3 && showPropDialog(index, scope.$index)"
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
            SiteIdList: []
          },
          GameIdList: [],
          RuleImgHor: [],
          RuleImgVer: []
        },
        ActivityExtend: {},
        TaskConfig: [],
        BonusIcon: [],
        GameIcon: []
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
        }
      },
      filterText: '',
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      taskTypeOptions: [
        { value: 1, label: '单次' },
        { value: 2, label: '循环' }
      ],
      conditionTypeOptions: [
        { value: 1, label: '登录' },
        { value: 2, label: '下注值' },
        { value: 3, label: '下注次数' }
      ],
      rewardTypeOptions: [
        { value: 1, label: '金币' },
        { value: 2, label: '星星' },
        { value: 3, label: '道具' }
      ],
      propsConfig: [],
      tableItemData: [],
      ITEM_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS
    }
  },
  created() {
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
          if (this.edit.item.TaskItem[i].Reward[j].RewardType === 1) {
            this.edit.item.TaskItem[i].Reward[j].Num /= 1000
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
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const old = JSON.parse(response.Data.Data)
            $this.item = JSON.parse(response.Data.Data)
            $this.item.Activity.StartTime *= 1000
            $this.item.Activity.EndTime *= 1000
            $this.item.ActivityExtend.InitBonusPool /= 1000
            $this.item.ActivityExtend.BonusPoolMax /= 1000
            this.$refs.compare.SetOldVal(old)
          }
          this.getGameAll()
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
      this.$refs.compare.SetNewVal(tableData)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          this.$message.error('没有任何修改，不需要提交')
          return
        }

        this.$emit('saveData')
        this.lock = false
      })
      this.form.Data = JSON.stringify(tableData)
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
      setTimeout(() => {
        this.IsUpdate = false
      }, 1000)
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
        Num: 0,
        Img: ''
      })
    },
    // 删除奖励
    removeReward(task, index) {
      task.Reward.splice(index, 1)
    },
    saveTask() {
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
        if (this.item.TaskConfig[index].TaskItem[i].ConditionType === 2) {
          this.item.TaskConfig[index].TaskItem[i].ConditionTarget *= 1000
        }
        for (let j = 0; j < this.item.TaskConfig[index].TaskItem[i].Reward.length; j++) {
          if (this.item.TaskConfig[index].TaskItem[i].Reward[j].RewardType === 1) {
            this.item.TaskConfig[index].TaskItem[i].Reward[j].Num *= 1000
          } else {
            this.item.TaskConfig[index].TaskItem[i].Reward[j].Num = parseInt(this.item.TaskConfig[index].TaskItem[i].Reward[j].Num, 10)
          }
        }
      }
      this.edit.visible = false
    },
    showPropDialog(taskIndex, rewardIndex) {
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
      this.edit.propDialogVisible = false
    },
    formatPropValue(prop) {
      if (prop !== null) {
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
    }
  }
}
</script>

<style>

</style>
