<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish v-if="platform==='android'" primary-key="ID" key-id="SubGameConfig" :env-empty="false" :attr-names="AttrNames" :head-attrs="['ID','Name']" />
    </el-row>
    <el-row v-if="false">
      <el-col :offset="12">
        <el-button size="mini" :round="true" type="success" @click="openGameComm">配置公共包对应关系</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-dialog
        title="子游戏对应关系配置"
        :visible.sync="gameComm.visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-row>
          <publish primary-key="Volume" :env-empty="false" :key-id="getGameCommKey()" compare-type="Object" />
        </el-row>
        <el-form ref="edit" :model="edit" label-width="150px" :inline="true" size="small">
          <el-row>
            <el-form-item label="新增游戏">
              <el-col :span="16">
              <el-input v-model="gameComm.newGameName" size="mini" /></el-col>
              <el-col :span="8"><el-button size="mini" @click="addNewGame">添加</el-button></el-col>
            </el-form-item>
          </el-row>
          <el-row v-for="v,k in gameComm.item">
            <el-form-item :label="k+'：'">
              <el-select v-model="gameComm.item[k][0]" size="mini">
                <el-option value="poker" />
                <el-option value="slots" />
                <el-option value="casual" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="gameComm.item[k][1]" size="mini" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :offset="16">
              <el-button size="mini" type="primary" @click="saveGameComm">保存</el-button>
            </el-col>
          </el-row>

        </el-form>
      </el-dialog>
    </el-row>

    <el-row style="padding-top: 5px">
      <el-col :span="5">
        <el-form label-width="50px">
          <el-form-item label="AppId">
            <el-select v-model="appId" style="width: 230px" size="small" @change="getList()">
              <el-option
                v-for="item in appInfo"
                :key="item.key"
                :label="appInfoLabel(item.key, item.label)"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCopyList()"
        >复制配置列表
        </el-button>
      </el-col>
      <el-col :span="4" :offset="9">
        <TableSort :items="dragItems" :on-success="sortSucc" post-url="/subgame/update/sort" />
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
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
        <el-table-column
          prop="Sort"
          label="排序"
          sortable="custom"
          width="75"
        />
        <el-table-column
          prop="AppId"
          label="AppId"
          width="100"
        />
        <el-table-column
          prop="Name"
          label="名称"
          width="100"
        >
          <template slot-scope="scope">
            {{ getName(scope.row.Name) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="GameKey"
          label="游戏Key值"
          width="150"
        />
        <el-table-column
          prop="Type"
          label="分类"
          width="150"
        >
          <template slot-scope="scope">
            {{ getTypeName(scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Icon"
          label="图标"
          min-width="150"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.Icon" :src="getFullPath(scope.row.Icon)" height="80px">
            <span v-else>无</span>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="IsWhite"-->
<!--          label="白名单"-->
<!--          width="70"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <span v-text="scope.row.IsWhite==1?'是':'否'" />-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="免费可玩"-->
<!--          width="90"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <span v-text="scope.row.IsPlaying==1?'是':'否'" />-->
<!--          </template>-->
<!--        </el-table-column>-->
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
          prop="Status"
          label="状态"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Status', scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          label="检查"
          column-key="op"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              @click="handleCheck(scope.row)"
            >检查
            </el-button>
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
            :page-sizes="[150, 300, 450, 600]"
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
            <el-tabs type="card">
              <el-tab-pane label="基础信息">
                <el-form-item label="AppId" :required="true">
                  <el-select v-model="edit.item.AppId" style="width: 230px" :disabled="!edit.isCopy" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in appInfo"
                      :key="item.key"
                      :label="appInfoLabel(item.key, item.label)"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="站点：">
                  <el-checkbox-group v-model="edit.item.Channel">
                    <el-checkbox label="BP">BP</el-checkbox>
                    <el-checkbox label="AP">AP</el-checkbox>
                    <el-checkbox label="GP">GP</el-checkbox>
                    <!-- <el-checkbox label="PG">PG</el-checkbox> 2025-12-22去除PG -->
                    <el-checkbox label="Dev">DEV</el-checkbox>
                  </el-checkbox-group>
                  <span style="color: red">全部不勾 等于 任意站点都可见。下架入口则不可见</span>
                </el-form-item>
                <el-form-item label="名称：" :required="true">
                  <el-row>
                    <el-col :span="2">英文: </el-col><el-col :span="16"><el-input v-model="edit.itemNames['en']" /></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="2">印地: </el-col><el-col :span="16"><el-input v-model="edit.itemNames['hi']" /></el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="分类：" :required="true" prop="item.Type">
                  <el-col :span="11">
                    <el-select v-model.number="edit.item.Type" placeholder="分类">
                      <el-option
                        v-for="item in typeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="游戏Key：" :required="true" prop="item.GameKey" :rules="dataRule(true,{type:'s',range:'2'})">
                  <el-col :span="11">
                    <el-input v-model="edit.item.GameKey" placeholder="开发提供" :disabled="edit.isEdit"/>
                  </el-col>
                </el-form-item>
                <el-form-item label="图片：" :required="true" style="position: relative">
                  <ImagePicker v-model="formDialog.form.game.image_path" category="subConfig" />
                  <el-button type="danger" size="mini" style="position: absolute; left: 138px; top: 60px" @click="formDialog.form.game.image_path = ''">清除图片</el-button>
                </el-form-item>
                <!--            <el-form-item label="背景图片：" :required="true">-->
                <!--              <el-upload-->
                <!--                class="avatar-uploader"-->
                <!--                :action="actionURL"-->
                <!--                :show-file-list="false"-->
                <!--                :with-credentials="true"-->
                <!--                :on-success="SuccUploadBack"-->
                <!--                :before-upload="beforeAvatarUpload"-->
                <!--              >-->
                <!--                <img v-if="edit.item.IconBack" :src="getFullPath(edit.item.IconBack)" class="avatar" height="100px">-->
                <!--                <i v-else class="el-icon-plus avatar-uploader-icon" />-->
                <!--              </el-upload>-->
                <!--            </el-form-item>-->
                <el-form-item v-if="false" label="图片(客户端内置)：" :required="true" prop="item.GameKey" :rules="dataRule(true,{type:'s',range:'2'})">
                  <el-input v-model="edit.item.IconInner" placeholder="开发提供" />
                </el-form-item>
                <el-form-item v-if="false" label="是否支持单一钱包：" :required="true">
                  <el-col :span="11">
                    <el-input v-model="edit.item.CodePath" placeholder="开发提供" />
                  </el-col>
                </el-form-item>
                <el-form-item v-if="false" label="公共包路径：" :required="true">
                  <el-col :span="11">
                    <el-input v-model="edit.item.CommCodePath" placeholder="开发提供" />
                  </el-col>
                </el-form-item>
                <!--            <el-form-item label="只白名单可见：" :required="true">-->
                <!--              <el-radio-group v-model.number="edit.item.IsWhite">-->
                <!--                <el-radio :label="1">是</el-radio>-->
                <!--                <el-radio :label="0">否</el-radio>-->
                <!--              </el-radio-group>-->
                <!--            </el-form-item>-->
                <!--            <el-form-item label="非真实用户是否显示：" :required="true">-->
                <!--              <el-radio-group v-model.number="edit.item.IsPlaying">-->
                <!--                <el-radio :label="1">是</el-radio>-->
                <!--                <el-radio :label="0">否</el-radio>-->
                <!--              </el-radio-group>-->
                <!--            </el-form-item>-->
                <el-form-item v-if="false" label="最低版本限制：" :required="true">
                  <el-col :span="11">
                    <el-input v-model="edit.item.VersionLower" placeholder="开发提供" />
                  </el-col>
                </el-form-item>
                <!--            <el-form-item label="new 标识：" :required="true">-->
                <!--              <el-radio-group v-model.number="edit.item.IsNew">-->
                <!--                <el-radio :label="1">是</el-radio>-->
                <!--                <el-radio :label="0">否</el-radio>-->
                <!--              </el-radio-group>-->
                <!--            </el-form-item>-->
                <!--            <el-form-item label="hot 标识：" :required="true">-->
                <!--              <el-radio-group v-model.number="edit.item.IsHot">-->
                <!--                <el-radio :label="1">是</el-radio>-->
                <!--                <el-radio :label="0">否</el-radio>-->
                <!--              </el-radio-group>-->
                <!--            </el-form-item>-->
              </el-tab-pane>
            </el-tabs>

<!--          <el-tab-pane label="游戏名称多语言" name="second">-->
<!--            <el-form-item label="图片内容：" :required="true">-->
<!--              <template v-for="(o) in langTypes">-->
<!--                <el-col :span="6">{{ getLangName(o) }}:</el-col>-->
<!--                <el-col :span="18">-->
<!--                  <el-upload-->
<!--                    class="avatar-uploader"-->
<!--                    drag-->
<!--                    :action="actionURL2"-->
<!--                    :with-credentials="true"-->
<!--                    :show-file-list="false"-->
<!--                    :data="getUploadParam(o)"-->
<!--                    :on-success="Succ"-->
<!--                    :before-upload="beforeAvatarUpload"-->
<!--                  >-->
<!--                    <img v-if="edit.langPic[o]" :src="getFullPath(edit.langPic[o])">-->
<!--                    <i v-else class="el-icon-plus avatar-uploader-icon" />-->
<!--                  </el-upload>-->
<!--                </el-col>-->
<!--              </template>-->
<!--            </el-form-item>-->
<!--          </el-tab-pane>-->


        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="copyListDialog.title"
      :visible.sync="copyListDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small" inline>
        <el-tabs type="card">
          <el-form-item label="从原始AppId" :required="true">
            <el-select v-model="copyListDialog.srcAppId" style="width: 220px" placeholder="请选择" size="mini">
              <el-option
                v-for="item in appInfo"
                :key="item.key"
                :label="appInfoLabel(item.key, item.label)"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="复制到AppId" :required="true">
            <el-select v-model="copyListDialog.targetAppId" style="width: 220px" placeholder="请选择" size="mini">
              <el-option
                v-for="item in getAppsFiltered(copyListDialog.srcAppId)"
                :key="item.key"
                :label="appInfoLabel(item.key, item.label)"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col>
              <span style="padding: 15px 20px 15px 0; border: 1px #0a76a4;">注意：复制操作完成后，需要点击发布按钮，将复制的新数据更新到线上；若状态为非上架状态，需先进行上架后点击发布</span>
            </el-col>
          </el-row>
          <el-row style="padding-top: 20px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="copyList">保存</el-button>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libLang, $libShow, ClientTableData, DataRule, NewLangObj } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import TableSort from '@/components/TableSort'
import ImagePicker from "@/components/ImagePicker/ImagePicker";

const filterMap = {
  'Status': { 1: '草稿', 2: '上架', 3: '废弃', 6: '下架' }
}

function newItem() {
  return {
    ID: '',
    GameKey: '',
    Name: '',
    Description: '',
    IconInner: '',
    Icon: '',
    IconBack: '',
    CodePath: '',
    CommCodePath: '',
    IsWhite: 1,
    VersionLower: '',
    NameIcon: '',
    Platform: '',
    WhiteAppIDs: '',
    Type: 0,
    IsPlaying: 0,
    IsHot: 0,
    IsNew: 0,
    AppId: 0,
    Channel: ''
  }
}

export default {
  components: { Compare, Publish, TableSort, ImagePicker },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      dragItems: [],
      langTypes: ['en', 'hi'],
      platform: 'android',
      appId: 1000002,
      appInfo: [],

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        isCopy: false,
        langPic: NewLangObj(),
        itemNames: NewLangObj()
      },

      formDialog: {
        visible: false,
        title: '添加游戏',
        form: {
          app_id: '',
          game: {
            game_id: '',
            image_path: ''
          },
          update_index: 0, // 仅编辑时需要，确定修改的是哪一条数据
          isedit: false
        }
      },

      copyListDialog: {
        title: '复制配置列表',
        visible: false,
        srcAppId: 1000002,
        targetAppId: 1000002
      },

      gameComm: {
        visible: false,
        subKey: 'gameToComm2',
        form: {},
        item: {},
        newGameName: ''
      },

      typeOption: [
        { label: 'Cassino', value: 1 },
        { label: 'Slots', value: 2 },
        { label: 'Poker', value: 3 },
        { label: 'Mini game', value: 4 }
      ],

      AttrNames: {
        Name: '游戏名称',
        Description: '描述',
        IconInner: '客户端图标ID',
        Icon: '图片地址',
        IconBack: '背景图片',
        CodePath: '代码地址',
        CommCodePath: '公共包代码',
        IsWhite: '是否白名称',
        VersionLower: '最低版本号',
        NameIcon: '名称图标',
        WhiteAppIDs: '指定appID可见',
        Platform: '平台',
        Type: '分类',
        IsPlaying: '免费玩家是否可玩',
        IsNew: '是否新游戏',
        IsHot: '是否热门',
        AppId: '应用'
      }
    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload/image'
    },
    actionURL2() {
      return process.env.VUE_APP_BASE_API + '/other/upload/image2'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.platform = this.$route.meta.platform
    this.getList()
    this.getAppInfo()
    console.log(1)
  },
  methods: {
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    appInfoLabel(key, label) {
      return label + '-' + key
    },
    getAppsFiltered(appId) {
      const apps = []
      for (const i in this.appInfo) {
        if (this.appInfo[i].key !== appId) {
          apps.push(this.appInfo[i])
        }
      }
      return apps
    },
    getTypeName(type) {
      let name = type
      for (const i in this.typeOption) {
        if (this.typeOption[i].value === parseInt(type)) {
          name = this.typeOption[i].label
        }
      }
      return name
    },
    openGameComm() {
      this.getGameCommData()
      this.gameComm.visible = true
    },
    getGameCommKey() {
      return 'CustomizeCfg_' + this.gameComm.subKey
    },
    addNewGame() {
      this.$set(this.gameComm.item, this.gameComm.newGameName, ['poker', '新游戏'])
      Message.success('添加成功！')
      this.gameComm.newGameName = ''
    },
    saveGameComm() {
      this.gameComm.form.Data = JSON.stringify(this.gameComm.item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.gameComm.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.gameComm.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('subGameComm save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    getGameCommData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.gameComm.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          $this.gameComm.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.gameComm.item = JSON.parse(response.Data.Data)
            console.log($this.gameComm.item)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getFullPath(url) {
      return $libShow.GetFullPath(url.replace('/static/', '/'))
    },
    sortSucc(items) {
      for (const o in items) {
        this.clientDB.UpdateData({ ID: items[o].ID, Sort: items[o].Sort })
      }
    },
    initDragItems() {
      this.dragItems = []
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        if (ob.Status === 2) {
          this.dragItems.push({ ID: ob.ID, Sort: ob.Sort, Name: $libLang.GetLangEN(ob.Name) })
        }
      }
      this.dragItems.sort(function(a, b) {
        return a.Sort - b.Sort
      })
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getName(name) {
      return $libLang.GetLangEN(name)
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
        console.log('clickData ', row)
        this.initFormData(true, row.ID)
        this.edit.isCopy = false
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.item.Channel = []
      this.edit.item.AppId = this.appId
      this.edit.isEdit = false
      this.edit.isCopy = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.isCopy = true
      this.edit.visible = true
    },
    handleCopyList() {
      this.copyListDialog.visible = true
      this.copyListDialog.srcAppId = this.appId
      for (const i in this.appInfo) {
        if (this.appInfo[i].key !== this.copyListDialog.srcAppId) {
          this.copyListDialog.targetAppId = this.appInfo[i].key
          break
        }
      }
    },
    getList() {
      request({
        url: '/subgame/all',
        method: 'get',
        data: {
          Platform: this.platform,
          AppId: this.appId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 150, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.initDragItems()
        }
      })
    },
    handlePrepare(ob) {
      // request({
      //   url: '/dataProxy/info',
      //   method: 'get',
      //   data: {
      //     Path: "/thirdpartiesgames/check/comm",
      //     GameKey: ob.GameKey,
      //   }
      // }).then(response => {
      //   if (response.RetCode === 0) {
      //     this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
      //   }
      // })
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/subgame/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handleCheck(ob) {
      const loading = this.$loading({
        lock: true,
        text: '检测中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/lobbyversions',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.length > 0) {
            // this.LobbyVersionID = response.Data[response.Data.length - 1].ID
            // this.LobbyVersion = response.Data[response.Data.length - 1].LobbyVersion
            // this.LobbyVersionStatus = response.Data[response.Data.length - 1].Status
            for (let i=response.Data.length - 1; i >= 0; i--) {
              if (response.Data[i].Status === 1) {
                this.handleCheck2(ob, response.Data[i].LobbyVersion, loading)
                break
              }
            }
            return
          }
        }
        loading && loading.close()
      }).catch(function() {
        loading && loading.close()
      })
    },
    handleCheck2(ob, lobbyVersion,loading) {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: "/thirdpartiesgames/check/app",
          GameKey: ob.GameKey,
          AppId: ob.AppId,
          LobbyVersion: lobbyVersion,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          loading && loading.close()
          var channel = response.Data.Channel
          var exist = response.Data.Exist
          console.log(response.Data)
          var text = ""
          for (const ch in channel) {
            if (channel[ch] === 0) {
              text += '<p>' +ch.toString() + ':  <span style="color: red;">缺失</span></p>'
            } else if (channel[ch] === 1) {
              text += '<p>' +ch.toString() + ':  false</p>'
            }  else if (channel[ch] === 2) {
              text += '<p>' +ch.toString() + ':  true</p>'
            }
          }
          text += exist?"最新版本已经存在该游戏":'最新版本<span style="color: red;">不存在</span>该游戏'
          Message.success({
            dangerouslyUseHTMLString: true,
            message: text,
            type: "warning"
          })
        }
      }).catch(function() {
        loading && loading.close()
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getLangName(code) {
      if (code === 'en') {
        return '英文'
      } else {
        return '印地'
      }
    },
    getUploadParam(langType) {
      return { Param: langType }
    },
    Succ(res, file) {
      this.edit.langPic[res.Data.Param] = res.Data.Path
    },
    SuccUpload1(res, file) {
      this.edit.item.Icon = res.Data
    },
    SuccUploadBack(res, file) {
      this.edit.item.IconBack = res.Data
    },
    beforeAvatarUpload(file) {
      const isOK = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isOK) {
        this.$message.error('上传图片只能是 JPG or PNG  格式!')
      }
      const isLt2M = file.size / 1024 < 200
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 200K!')
      }
      return isOK && isLt2M
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.itemNames = JSON.parse(this.edit.item.Name)
          this.edit.langPic = JSON.parse(this.edit.item.NameIcon)
          if (this.edit.item.Channel.length > 0 && typeof this.edit.item.Channel === 'string') {
            this.edit.item.Channel = this.edit.item.Channel.split(',')
          } else {
            this.edit.item.Channel = []
          }
          console.log('initFormData', this.edit.item.Channel)
          this.formDialog.form.game.image_path = this.edit.item.Icon
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      postData.Platform = this.platform
      postData.Icon = this.formDialog.form.game.image_path
      request({
        url: '/subgame/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      postData.Icon = this.formDialog.form.game.image_path
      console.log('editSave', postData)
      request({
        url: 'subgame/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    save() {
      this.edit.item.Name = JSON.stringify(this.edit.itemNames)
      this.edit.item.NameIcon = JSON.stringify(this.edit.langPic)
      this.edit.item.Icon = this.formDialog.form.game.image_path
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.edit.item)
          }
        })
      } else {
        this.createSave(this.edit.item)
      }
      this.edit.visible = false
    },
    copyList() {
      request({
        url: 'subgame/copy/list',
        method: 'post',
        data: { SrcAppId: this.copyListDialog.srcAppId, TargetAppId: this.copyListDialog.targetAppId, Platform: this.platform }
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          if (response.Data !== '') {
            Message.success(response.Data)
          } else {
            Message.success('配置列表复制成功！')
          }
        }
      })
      this.copyListDialog.visible = false
    }
  }
}
</script>
