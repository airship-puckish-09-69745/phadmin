<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
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
        @sort-change="sortChange"
      >
        <el-table-column prop="ID" label="id" sortable="custom" width="80" />
        <el-table-column prop="Name" label="活动名称" />
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
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.IsOpen===false" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">开启 </el-button>
            <el-button v-if="scope.row.IsOpen===false" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.IsOpen===true" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">关闭 </el-button>
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
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1100px"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-row>
            <el-form :model="edit.item" label-width="220px" size="mini">
              <el-col :span="18">
                <el-form-item label="活动名称：" prop="name" :required="true">
                  <el-input v-model="edit.item.Name" placeholder="请输入活动名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间：" prop="startTime" :required="true">
                  <el-date-picker v-model="edit.item.StartTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间：" prop="endTime" :required="true">
                  <el-date-picker v-model="edit.item.EndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="12">
                <el-form-item label="勾选支持的游戏：" :required="true">
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                  />
                  <el-tree
                    ref="tree"
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check-change="handleCheckChange"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-form :model="edit.item" label-width="220px" size="mini">
              <el-form-item label="支持跳转的站点：" prop="edit.item.SiteIdCanSkip">
                <SiteSelect v-model="edit.item.SiteIdCanSkip" multiple placeholder="请选择" style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-form :model="edit.item" label-width="220px" size="mini">
              <el-form-item label="打点上报code：" prop="name">
                <el-input v-model.number="edit.item.ReportCode" placeholder="系统自动生成" style="width: 400px"   disabled />
              </el-form-item>
            </el-form>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="海报配置">
          <el-form label-width="220px">
            <el-form-item label="海报图片横板：" :required="true">
              <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end;">
                <span v-for="(v,k) in edit.item.PosterImgHor" :key="'poster-hor-'+k" style="display: inline-block; position: relative;">
                  <span style="position: absolute; top: -15px; right: 1px; cursor: pointer; z-index: 99; color: red;" @click="removePosterImage(k, 'Hor')">移除</span>
                  <ImagePicker v-model="edit.item.PosterImgHor[k]" size="mini" />
                </span>
                <el-button @click="addPosterImage('Hor')">添加</el-button>
              </div>
            </el-form-item>

            <el-form-item label="海报图片竖版：" :required="true">
              <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end;">
                <span v-for="(v,k) in edit.item.PosterImgVer" :key="'poster-ver-'+k" style="display: inline-block; position: relative;">
                  <span style="position: absolute; top: -15px; right: 1px; cursor: pointer; z-index: 99; color: red;" @click="removePosterImage(k, 'Vor')">移除</span>
                  <ImagePicker v-model="edit.item.PosterImgVer[k]" size="mini" />
                </span>
                <el-button @click="addPosterImage('Vor')">添加</el-button>
              </div>
            </el-form-item>

            <!-- 关闭按钮，直接放在 el-form-item 中，与上方图片对齐 -->
            <el-form-item label="关闭按钮：" :required="true">
              <div style="display: flex; align-items: center;">
                <ImagePicker v-model="edit.item.CloseImg" size="mini" />
              </div>
            </el-form-item>
          </el-form>

          <fieldset style="margin-top: 20px">
            <legend>
              游戏入口配置
            </legend>
            <el-button type="primary" size="mini" @click="addGameIcon()">添加配置</el-button>
            <el-button type="success" size="mini" @click="openGameSortDialog()">排序</el-button>
            <el-row :gutter="5">
              <el-col>
                <el-table
                  :data="edit.item.GameIcon"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column prop="Id" label="游戏" width="250">
                    <template slot-scope="scope">
                      <el-cascader
                        v-model="scope.row.Id"
                        :options="treeData"
                        :props="{ value: 'id', label: 'label', children: 'children', emitPath: false }"
                        clearable
                        size="mini"
                        placeholder="请选择游戏"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="Img" label="图片" width="250">
                    <template slot-scope="scope">
                      <ImagePicker v-model="scope.row.Img" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" column-key="op" width="120">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-delete" @click="removeGameIcon(scope.$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </fieldset>
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form label-width="220px">
            <el-row>
              <el-col>
                <el-form-item label="白名单开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="edit.item.Whitelist.IsWhite" :active-value="true" :inactive-value="false" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.Whitelist.AppIdList">
                  <el-select v-model="edit.item.Whitelist.AppIdList" multiple placeholder="请选择" style="width: 400px">
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
                  <SiteSelect v-model="edit.item.Whitelist.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
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
      <el-row style="margin-top: 10px">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </el-row>
    </el-dialog>

    <el-dialog
      title="游戏排序"
      :visible.sync="edit.gamesIconSortDialogVisible"
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

    <el-row>
      <br>
      <el-button type="primary" @click="saveData">保存</el-button>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>

import {$libDate, $libShow, ClientTableData, DataRule} from '@/utils/common'
import Publish from '@/components/Publish/index.vue'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import Compare from '@/components/Compare/index.vue'
import GameLevel from '@/components/GameLevel/index.vue'
import MoneyInput from '@/components/MoneyInput/index.vue'
import store from '@/store'
import SiteSelect from '@/components/SiteSelect/index.vue'
import request from '@/utils/request'
import {Message} from "element-ui";

const filterMap = {}
function newItem() {
  return {
    ID: 0,
    Name: '',
    IsOpen: false,
    StartTime: 0,
    EndTime: 0,
    PosterImgHor: [],
    PosterImgVer: [],
    CloseImg: '',
    GameIcon: [],
    GameId: [],
    Whitelist: {
      IsWhite: false,
      AppIdList: [],
      SiteIdList: []
    },
    SiteIdCanSkip: [],
    ReportCode: null,
    UserTagConfig: []
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { ImagePicker, Compare, Publish, GameLevel, MoneyInput, SiteSelect },
  data() {
    return {
      libShow: $libShow,
      subKey: 'poster_cfg',
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),
      edit: {
        visible: false,
        isEdit: false,
        item: newItem(),
        gamesIconSortDialogVisible: false,
        userTagIdOptions: [],
        userTagConfig: {
          TagId: [],
          TagValue: 0,
          TagType: 0
        }
      },
      filterText: '',
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
        disabled: 'disabled'
      },
      filterGameIds: [],
      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],
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
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getData()
    this.getGameAll()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
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
            this.clientDB = new ClientTableData(old.Config, 10, filterMap, 'EndTime', -1, "ID")
            this.handleCurrentChange(1)
            this.$refs.compare.SetOldVal(JSON.parse(JSON.stringify(old)))
          }
        }
      })
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
    saveData() {
      const tmp = JSON.parse(JSON.stringify({
        Config: this.tableData
      }))
      this.$refs.compare.SetNewVal(tmp)
      this.$refs.compare.Compare((isEdit) => {
        if (!isEdit) {
          this.$message.error('没有任何修改，不需要提交')
          return
        }

        this.$emit('saveData')
        this.form.Data = JSON.stringify(tmp)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: this.form
        }).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
          } else {
            this.$message.error('保存失败！' + response.Data)
          }
        })
        // this.lock = false
      })

      // setTimeout(() => {
      //   this.IsUpdate = false
      // }, 1000)
    },
    handleAdd() {
      this.edit.item = newItem()
      this.edit.item.ReportCode = this.getNewReportCode()
      this.edit.userTagConfig = {
        TagId: [],
        TagType: 0,
        TagValue: 0
      }
      console.log('GameId', this.edit.item.GameId)
      this.edit.isEdit = false
      this.edit.visible = true
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.edit.item.GameId || [])
        }
      })
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
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
          this.edit.userTagConfig = {
            TagId: [],
            TagType: 0,
            TagValue: 0
          }
          if (item.UserTagConfig && item.UserTagConfig.length > 0) {
            const tagList = item.UserTagConfig
            const tagIds = tagList.map(t => t.TagId)
            const first = tagList[0]

            this.edit.userTagConfig = {
              TagId: tagIds,
              TagType: first.TagType ?? 0,
              TagValue: first.TagValue ?? first.TagType ?? 0
            }
            this.onTagTypeChange(this.edit.userTagConfig.TagType)
          }
          this.edit.item = item
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCheckedKeys(this.edit.item.GameId || [])
            }
          })
        }
      }
    },
    handlePrepare(ob) {
      ob.IsOpen = true
    },
    handleOffline(ob) {
      ob.IsOpen = false
    },
    handleDelete(ob) {
      this.clientDB.DelData(ob.ID)
      this.handleCurrentChange(1)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange(data, checked, indeterminate) {
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      if (!this.edit.item.GameId) {
        this.edit.item.GameId = []
      }
      const index = this.edit.item.GameId.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          this.edit.item.GameId.push(data.id)
        }
      } else {
        if (index >= 0) {
          this.edit.item.GameId.splice(index, 1)
        }
      }
    },
    addPosterImage(type) {
      if (type === 'Hor') {
        if (this.edit.item.PosterImgHor) {
          this.edit.item.PosterImgHor.push('')
        } else {
          this.$set(this.edit.item, 'PosterImgHor', [''])
        }
      } else if (type === 'Vor') {
        if (this.edit.item.PosterImgVer) {
          this.edit.item.PosterImgVer.push('')
        } else {
          this.$set(this.edit.item, 'PosterImgVer', [''])
        }
      }
    },
    removePosterImage(index, type) {
      if (type === 'Hor') {
        this.edit.item.PosterImgHor.splice(index, 1)
      } else if (type === 'Vor') {
        this.edit.item.PosterImgVer.splice(index, 1)
      }
    },
    addGameIcon() {
      const item = {
        Id: 0,
        Img: ''
      }
      if (!this.edit.item.GameIcon) {
        this.$set(this.edit.item, 'GameIcon', [])
      }
      this.edit.item.GameIcon.push(item)
    },
    removeGameIcon(index) {
      this.edit.item.GameIcon.splice(index, 1)
    },
    getNewCfgId() {
      let all = []
      all = this.tableData

      let maxId = 0
      for (let i = 0; i < all.length; i++) {
        const it = all[i]
        if (it && typeof it.ID === 'number' && it.ID > maxId) maxId = it.ID
      }
      return maxId + 1
    },
    getNewReportCode() {
      let maxReportCode = 0

      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]

        if (
          item &&
          typeof item.ReportCode === 'number' &&
          item.ReportCode > maxReportCode
        ) {
          maxReportCode = item.ReportCode
        }
      }

      return maxReportCode + 1
    },
    handleSave() {
      const raw = JSON.parse(JSON.stringify(this.edit.item || {}))
      raw.StartTime = Math.floor(raw.StartTime / 1000)
      raw.EndTime = Math.floor(raw.EndTime / 1000)

      if (typeof raw.IsOpen === 'undefined') raw.IsOpen = false
      if (!raw.PosterImgHor) raw.PosterImgHor = []
      if (!raw.PosterImgVer) raw.PosterImgVer = []
      if (!raw.GameIcon) raw.GameIcon = []
      if (!raw.GameId) raw.GameId = []
      if (this.edit.userTagConfig && this.edit.userTagConfig.TagId.length > 0) {
        raw.UserTagConfig = this.edit.userTagConfig.TagId.map(id => ({
          TagId: id,
          TagType: this.edit.userTagConfig.TagType,
          TagValue: this.edit.userTagConfig.TagValue
        }))
      } else {
        raw.UserTagConfig = []
      }

      try {
        if (this.edit.isEdit && raw.ID && raw.ID !== 0) {
          this.clientDB.UpdateData(raw)
        } else {
          if (!raw.ID || raw.ID === 0) raw.ID = this.getNewCfgId()
          if (!raw.ReportCode || raw.ReportCode === 0) raw.ReportCode = this.getNewReportCode()
          this.clientDB.AddData(raw)
        }
        this.refreshShow()

        this.edit.visible = false
        this.$message.success(this.edit.isEdit ? '修改成功' : '新增成功')
        this.edit.isEdit = false
        this.edit.item = newItem()
      } catch (e) {
        console.error('handleSave error:', e)
        this.$message.error('保存失败，请查看控制台日志')
      }
    },
    // 打开排序对话框
    openGameSortDialog() {
      if (!this.edit.item.GameIcon || this.edit.item.GameIcon.length === 0) {
        this.$message.warning('没有可排序的游戏配置')
        return
      }

      // 映射 GameIcon 生成 GamesSorted
      this.GamesSorted = this.edit.item.GameIcon.map((g, index) => {
        // 通过 treeData 查找游戏名
        const gameName = this.findGameNameById(g.Id)
        return {
          GameId: g.Id,
          Name: gameName,
          OrderNo: index + 1 // 初始用顺序号
        }
      })

      this.edit.gamesIconSortDialogVisible = true
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
    onOrderNoChange() {
      // 重新根据 OrderNo 排序
      this.GamesSorted.sort((a, b) => a.OrderNo - b.OrderNo)
    },
    saveGamesSort() {
      // 根据排序后的 GamesSorted 重新排列 GameIcon
      const sortedIds = this.GamesSorted.map(g => g.GameId)
      this.edit.item.GameIcon.sort((a, b) => {
        return sortedIds.indexOf(a.Id) - sortedIds.indexOf(b.Id)
      })

      this.$message.success('排序已保存')
      this.edit.gamesIconSortDialogVisible = false
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
