<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="GamePkgVersionsConfig" :env-empty="false" :check="configCheck" :on-step-change="onStepChange" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <template>
        <div style="font-size: 14px;">
          修改了：framework、app/main、proto、resources、app/yy.ts 内容，需要修改链接版本<br>
          其他 bundle 包含有：lobby、common、solitaire_pokers、游戏公共bundle、游戏bundle<br>
          <br>
          如有版本修改后未生效，请刷新界面检查是否为最新链接版本<br>
          <br>
          遇到其他问题请找：宏威
        </div>
      </template>
    </el-row>
    <el-row style="padding-top: 5px">
      <el-form :inline="true">
        <el-form-item label="链接版本">
          <el-select v-model="LobbyVersionID" filterable size="small" @change="lobbyChange()">
            <el-option
              v-for="item in lobbyVersions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            :type="LobbyVersionStatus === 0 ? 'success' : 'warning'"
            :icon="LobbyVersionStatus === 0 ? 'el-icon-upload2' : 'el-icon-download'"
            @click="updateLobbyVersionStatus()"
          >{{ LobbyVersionStatus === 0 ? '启用链接版本' : '停用链接版本' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleCopyList()"
          >复制配置列表到新链接版本
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            plain
            :type="!showDisabledLobbyVersion ? 'success' : 'info'"
            :icon="!showDisabledLobbyVersion ? 'el-icon-view' : 'el-icon-circle-close'"
            @click="updateLobbyVersionDisplay()"
          >{{ !showDisabledLobbyVersion ? '展示停用链接版本' : '隐藏停用链接版本' }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="LobbyVersionStatus>0" label="版本状态:">
          <el-select :value="LobbyVersionTag" filterable size="small" :disabled="(LobbyVersionTag===1)" :width="100" @change="lobbyTagChange">
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <template>
        <el-alert style="font-size: 24px; white-space: pre-wrap;" type="error" :closable="false" :title="getLobbyVersionAlert()" />
      </template>
    </el-row>
    <el-row>
      <el-form :inline="true">
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate()"
          >添加包版本配置项
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="选中需要【修改/发布】的白名单版本" placement="top">
            <el-button type="success" size="mini" icon="el-icon-edit-outline" @click="showMultiEditWitheVersion()">批量【修改/添加】白名单</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="选中需要发布的白名单版本" placement="top">
            <el-button type="success" size="mini" icon="el-icon-upload2" @click="showMultiPublishWitheVersion()">批量发布</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="(LobbyVersionTag===1)">
          <el-tooltip content="点击后可修改包的版本号" placement="top">el-icon-lock
            <el-button v-if="canEdit" size="mini" type="success" icon="el-icon-unlock" @click="setEdit(!canEdit)">已解锁</el-button>
            <el-button v-if="!canEdit" size="mini" type="danger" icon="el-icon-lock" @click="setEdit(!canEdit)">锁定中</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="env==='test'">
          <el-tooltip content="打开或关闭发送Lark消息" placement="top">el-icon-lock
            <el-button v-if="configData.lark" size="mini" type="success" icon="el-icon-message" @click="setMessgeStatus">已启用通知</el-button>
            <el-button v-if="!configData.lark" size="mini" type="danger" icon="el-icon-message" @click="setMessgeStatus">已禁用通知</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-message" @click="syncConfig=true">同步配置到CDN</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog
      title="同步配置到CDN"
      :visible.sync="syncConfig"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <SyncConfig v-model="syncConfig" :data="clientDB.ShowData" :lobby="LobbyVersion" />
    </el-dialog>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        v-loading="loadingShow"
        :data="tableData.filter(data => !search || (data.BundleKey.toLowerCase().includes(search.toLowerCase()) || data.PkgName.toLowerCase().includes(search.toLowerCase()) || data.GamePkgVersion.toLowerCase().includes(search.toLowerCase())))"
        stripe
        border
        row-key="ID"
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @selection-change="handlePkgSelectionChange"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          v-if="canEdit"
          label="selectBox"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="PkgName"
          label="中文名"
          sortable="custom"
          width="150"
        />
        <el-table-column
          label="游戏名(内部)"
          sortable="custom"
          width="150"
        >
          <template slot-scope="scope">
            {{ configData[scope.row.BundleKey] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="BundleKey"
          label="Bundle Name"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="GamePkgVersion"
          label="版本号"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="WhiteVersion"
          label="白名单版本号"
          width="120"
        />
        <el-table-column
          prop="LastModify"
          label="最近修改"
          sortable="custom"
          width="160"
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
          width="70"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="300"
        >
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索(中文名，key，版本号)"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
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
            <!--            <el-button-->
            <!--              v-if="scope.row.Status!=2"-->
            <!--              size="mini"-->
            <!--              icon="el-icon-delete"-->
            <!--              @click="handleDelete(scope.row)"-->
            <!--            />-->
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="handleOffline(scope.row)"
            >下架
            </el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-view"
              @click="viewHistory(scope.row)"
            >查看历史</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[100, 200, 300, 400]"
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
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label-width="0" :required="true" :hide-required-asterisk="true" prop="LobbyVersionID">
          <el-col :span="0">
            <el-input v-model="edit.item.LobbyVersionID" :disabled="true" />
          </el-col>
        </el-form-item>
        <el-form-item label-width="0" :required="true" :hide-required-asterisk="true" prop="LobbyVersion">
          <el-col :span="0">
            <el-input v-model="edit.item.LobbyVersion" :disabled="true" />
          </el-col>
        </el-form-item>
        <el-form-item label="中文名：" :required="true" prop="PkgName">
          <el-col :span="15">
            <el-input v-model="edit.item.PkgName" />
          </el-col>
        </el-form-item>
        <el-form-item label="游戏名(内部)：">
          <el-col :span="15">
            <el-input v-model="edit.gameName" />
          </el-col>
        </el-form-item>
        <el-form-item label="Bundle Name：" :required="true" prop="BundleKey">
          <el-col :span="15">
            <el-input v-model="edit.item.BundleKey" :readonly="isDisabled" :class="isDisabled ? 'el-input_no_border' : ''" />
          </el-col>
        </el-form-item>
        <el-form-item label="版本号：" :required="true" prop="GamePkgVersion">
          <el-col :span="15">
            <el-input v-model="edit.item.GamePkgVersion" placeholder="格式： 1.0.0.0" :readonly="isDisabled" :class="isDisabled ? 'el-input_no_border' : ''" />
          </el-col>
        </el-form-item>
        <el-form-item label="白名单版本号：">
          <el-col :span="11">
            <el-form-item prop="WhiteVersion">
              <el-input v-model="edit.item.WhiteVersion" placeholder="格式： 1.0.0.0" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <el-button type="success" size="mini" @click="publishWhiteVersion()">发布</el-button>
              <el-tooltip content="将链接版本复制到白名单版本，保存生效" placement="top">
                <el-button type="success" size="mini" @click="copyLobbyVersion2WhiteVersion()">复制链接版本</el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="15" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.lobbyVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.lobbyItem" :model="edit.lobbyItem" label-width="250px" size="small">
        <el-form-item label="链接版本：" :required="true" prop="LobbyVersion">
          <el-col :span="15">
            <el-input v-model="edit.lobbyItem.LobbyVersion" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="15" :offset="10">
              <el-button type="primary" size="medium" @click="saveLobbyVersion">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="复制此链接版本配置 到 新链接版本"
      :visible.sync="edit.copyLobbyVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.copyLobbyItem" :model="edit.copyLobbyItem" label-width="250px" size="small">
        <el-form-item label="新链接版本号：" :required="true" prop="LobbyVersion">
          <el-col :span="15">
            <el-input v-model="edit.copyLobbyItem.LobbyVersion" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col>
              <span style="font-weight: bolder">注意：只复制上架状态且最新编辑的配置；复制操作完成后，需要点击发布按钮，将复制的新数据更新到线上。</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-button type="primary" size="medium" @click="copyLobbyVersionCfg">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="批量配置白名单版本号"
      :visible.sync="edit.batchEditWhiteVersion"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col>
          <p style="font-weight: bolder">要修改的包：</p>
          <el-tag
            v-for="tag in edit.dynamicTags"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row />
      <el-form label-width="250px" size="small">
        <el-form-item label="白名单版本号：" :required="true">
          <el-col :span="11">
            <el-input v-model="edit.batchWhiteVersion" />
            <el-tooltip content="将链接版本复制到白名单版本，保存生效" placement="right">
              <el-button type="success" size="mini" @click="copyLobbyVersion2BatchWhiteVersion()">复制链接版本</el-button>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="15">
              <el-button type="primary" size="medium" @click="batchEditWhiteVersionSave">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--  批量发布start  -->
    <el-dialog
      title="批量发布白名单版本"
      :visible.sync="edit.batchPublishWhiteVersion"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col>
          <p style="font-weight: bolder">要发布的包：</p>
          <el-tag
            v-for="tag in edit.dynamicTags"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row />
      <el-form label-width="250px" size="small">
        <el-form-item>
          <el-row>
            <el-col :span="15">
              <el-button type="primary" size="medium" @click="batchPublishWhiteVersionSave">发布</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="选中了还没有设置白名单版本的包"
      :visible.sync="edit.batchPublishNoWhiteVersion"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col>
          <el-tag
            v-for="tag in edit.dynamicNoWhiteversionTags"
            :key="tag"
            type="danger"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </el-col>
      </el-row>
    </el-dialog>
    <!--  批量发布 end  -->

    <el-dialog
      title="版本历史"
      width="80%"
      :visible.sync="versionHistoryVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        ref="filterTable"
        :data="historyVersions"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="PkgName"
          label="中文名"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="BundleKey"
          label="包KEY"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="GamePkgVersion"
          label="版本号"
          sortable="true"
          width="120"
        />
        <el-table-column
          prop="WhiteVersion"
          label="白名单版本号"
          width="120"
        />
        <el-table-column
          prop="LastModify"
          label="最近修改"
          sortable="custom"
          width="160"
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
          width="70"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="useThisVersion(scope.row)"
            >使用该版本
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { Message } from 'element-ui'
import Publish from '@/components/Publish/index.vue'
import SyncConfig from './SyncConfig/SyncConfig.vue'

const filterMap = {}

export default {
  components: { Compare, Publish, SyncConfig },
  data() {
    return {
      syncConfig: false,
      canEdit: true,
      config: {},
      configData: {},
      loadingShow: false,
      tableData: [],
      historyMap: {},
      historyVersions: [],
      lobbyVersions: [],
      lobbyVersionData: [],
      orgLobbyVersions: [],
      LobbyVersionID: 0,
      subMaxLobbyVersion: 0,
      LobbyVersion: '',
      LobbyVersionStatus: 0,
      LobbyVersionTag: 0,
      statNames: { 0: '正常', 2: '上架', 6: '下架', 1: '关闭', 7: '预上架', 8: '预下架' },
      tagOptions: [
        { value: 0, label: '预发布' },
        { value: 1, label: '线上版本' }
      ],
      stepNames: { 1: '原始状态', 2: '发布测试', 3: '预发布', 4: '提交审核', 5: '待发布', 6: '已发布' },
      isOptions: [
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      showDisabledLobbyVersion: false,
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      edit: {
        visible: false,
        gameName: '',
        item: this.newItem(),
        isEdit: false,
        lobbyVisible: false,
        lobbyItem: this.newLobbyItem(),
        isLobbyEdit: false,
        copyLobbyVisible: false,
        batchEditWhiteVersion: false,
        batchPublishWhiteVersion: false,
        batchPublishNoWhiteVersion: false,
        dynamicTags: [],
        dynamicNoWhiteversionTags: [],
        copyLobbyItem: this.newCopyLobbyItem(),
        batchWhiteVersion: ''
      },
      selectedRows: [],
      isDisabled: false,
      versionHistoryVisible: false,
      rules: {
        LobbyVersionID: [{ required: true, trigger: 'blur' }],
        GamePkgVersion: [{ required: true, trigger: 'blur' }],
        BundleKey: [{ required: true, trigger: 'blur' }]
      },

      AttrNames: {
        LobbyVersionID: '链接版本ID',
        LobbyVersion: '链接版本',
        PkgName: '中文名',
        BundleKey: '游戏包名',
        GamePkgVersion: '游戏包版本',
        WhiteVersion: '游戏包白名单版本'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.isDisabled = false
    this.getLobbyVersions()
    this.getMessgeStatus()
  },
  methods: {
    newItem() {
      return { LobbyVersionID: this.LobbyVersionID, LobbyVersion: this.LobbyVersion, GamePkgVersion: '', BundleKey: '', PkgName: '', WhiteVersion: '', Status: 7 }
    },
    newLobbyItem() {
      return { LobbyVersion: '' }
    },
    newCopyLobbyItem() {
      return { LobbyVersionID: this.LobbyVersionID, LobbyVersion: '' }
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
      if (column.label === 'selectBox' || column.label === 'ID' || column.label === '包名' || column.label === '操作') {
        return
      }
      if (!this.canEdit) {
        this.$alert('锁定状态中不可修改，请先解锁')
        return
      }
      this.initFormData(true, row.ID)
      if (this.configData[this.edit.item.BundleKey] === undefined) {
        this.configData[this.edit.item.BundleKey] = ''
      }
      this.edit.gameName = this.configData[this.edit.item.BundleKey]
      this.edit.visible = true
    },
    // 展示批量添加白名单
    showMultiEditWitheVersion() {
      // console.log('multiWitheVersion: ', this.selectedRows)
      if (this.selectedRows.length === 0) {
        this.$alert('请选择要修改的配置')
        return false
      }
      this.edit.dynamicTags = []
      const hadWhiteVersions = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].WhiteVersion !== '') {
          hadWhiteVersions.push(this.selectedRows[i].PkgName)
        }
        this.edit.dynamicTags.push(this.selectedRows[i].PkgName)
      }
      // if (hadWhiteVersions.length > 0) {
      //   // 提示有白名单的包，并返回false
      //   const msg = '有已设置白名单的包：' + hadWhiteVersions.join(',') + '；请去掉已有白名单的包后再进行操作'
      //   Message.error(msg)
      //   return false
      // }
      this.edit.batchWhiteVersion = ''
      this.edit.batchEditWhiteVersion = true
    },
    showMultiPublishWitheVersion() {
      console.log('showMultiPublishWitheVersion')
      if (this.selectedRows.length === 0) {
        this.$alert('请选择要发布的白名单配置')
        return false
      }
      this.edit.dynamicTags = []
      this.edit.dynamicNoWhiteversionTags = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].WhiteVersion === '') {
          this.edit.dynamicNoWhiteversionTags.push(this.selectedRows[i].PkgName)
        }
        this.edit.dynamicTags.push(this.selectedRows[i].PkgName)
      }
      if (this.edit.dynamicNoWhiteversionTags.length > 0) {
        console.log('this.edit.dynamicNoWhiteversionTags: ', this.edit.dynamicNoWhiteversionTags)
        // 提示有未设置白名单的包，并返回false
        this.edit.batchPublishNoWhiteVersion = true
        return
      }
      this.edit.batchPublishWhiteVersion = true
    },
    handlePkgSelectionChange(rows) {
      // console.log('handlePkgSelectionChange>>>>>', rows)
      this.selectedRows = rows
    },
    handleCreate() {
      this.edit.item = this.newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },

    handleCreateLobby() {
      this.edit.lobbyItem = this.newLobbyItem()
      this.edit.isLobbyEdit = false
      this.edit.lobbyVisible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    handleCopyList() {
      this.edit.copyLobbyItem = this.newCopyLobbyItem()
      this.edit.copyLobbyVisible = true
    },
    lobbyChange() {
      for (let i = 0; i < this.orgLobbyVersions.length; i++) {
        if (this.orgLobbyVersions[i].ID === this.LobbyVersionID) {
          this.LobbyVersion = this.orgLobbyVersions[i].LobbyVersion
          this.LobbyVersionStatus = this.orgLobbyVersions[i].Status
          this.LobbyVersionTag = this.orgLobbyVersions[i].Tag
          this.setEdit(this.LobbyVersionTag === 0)
          break
        }
      }
      this.getList()
      this.$refs.filterTable.clearSelection()
    },
    lobbyTagChange(targetTag) {
      const $this = this
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/update/lobby/tag',
        method: 'post',
        data: {
          ID: $this.LobbyVersionID,
          Tag: targetTag
        }
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          Message.success('修改链接版本状态成功！')
          $this.LobbyVersionTag = targetTag
          $this.setEdit($this.LobbyVersionTag === 0)
          for (let i = 0; i < $this.orgLobbyVersions.length; i++) {
            if ($this.orgLobbyVersions[i].ID === $this.LobbyVersionID) {
              $this.orgLobbyVersions[i].Tag = targetTag
              break
            }
          }
        }
      }).catch(function() {
        loading.close()
      })
    },
    getList(loading = undefined) {
      this.loadingShow = true
      const $this = this
      request({
        url: '/gamepkgversions/list/withlobby',
        method: 'get',
        data: {
          LobbyVersionID: this.LobbyVersionID
        }
      }).then(response => {
        $this.loadingShow = false
        if (response.RetCode === 0) {
          const objs = response.Data.Data || []
          // 筛选obj里面的最新的版本
          let maxVersion = '1.0.0.0'
          let maxVersionArr = maxVersion.split('.')
          objs.filter(function(obj) {
            // 按.切分版本号
            const versionArr = obj.GamePkgVersion.split('.')
            for (let i = 0; i < 4; i++) {
              if (versionArr[i] > maxVersionArr[i]) {
                maxVersionArr = versionArr
                maxVersion = obj.GamePkgVersion
                break
              }
            }
          })
          this.subMaxLobbyVersion = maxVersion
          this.clientDB = new ClientTableData(objs, 100, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.historyMap = response.Data.HistoryMap || {}
        }
        loading && loading.close()
      }).catch(function() {
        $this.loadingShow = false
        loading && loading.close()
      })
    },
    updateLobbyVersionStatus() {
      var msg = '禁用版本后，该版本下的配置将在线上消失！确定要禁用此版本吗？'
      if (this.LobbyVersionStatus === 0) {
        msg = '启用版本后，该版本下的配置将在线上生效！确定要启用此版本吗？'
      }
      const targetStatus = this.LobbyVersionStatus === 0 ? 1 : 0
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '数据处理中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        request({
          url: '/gamepkgversions/update/lobby/status',
          method: 'post',
          data: {
            ID: $this.LobbyVersionID,
            Status: targetStatus
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改链接版本状态成功！')
            $this.LobbyVersionStatus = targetStatus
            for (let i = 0; i < $this.orgLobbyVersions.length; i++) {
              if ($this.orgLobbyVersions[i].ID === $this.LobbyVersionID) {
                $this.orgLobbyVersions[i].Status = targetStatus
                break
              }
            }
            if (!$this.showDisabledLobbyVersion && targetStatus === 0) {
              $this.handleDisplayLobbyVersions()
            }
            this.getList(loading)
          } else {
            loading.close()
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        // console.log('取消')
      })
    },
    updateLobbyVersionDisplay() {
      this.showDisabledLobbyVersion = !this.showDisabledLobbyVersion
      this.handleDisplayLobbyVersions()
    },
    configCheck() {
      return true
    },
    handlePreOn(ob) {
      this.changeStatus(ob.ID, 7, '您确定要将记录状态修改为"预备上架"吗？该记录将在发布后同步到外网。')
    },
    handleOn(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handlePreOff(ob) {
      this.changeStatus(ob.ID, 8, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
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
    changeStatus(id, status, msg) {
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '数据处理中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        request({
          url: '/gamepkgversions/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          loading.close()
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            $this.clientDB.UpdateData({ ID: id, Status: status })
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        // console.log('取消')
      })
    },
    viewHistory(ob) {
      const key = ob.LobbyVersion + '##' + ob.BundleKey
      this.historyVersions = []
      if (this.historyMap[key] && this.historyMap[key].length > 0) {
        for (let i = 0; i < this.historyMap[key].length; i++) {
          const item = this.historyMap[key][i]
          this.historyVersions.push(item)
        }
      }
      this.versionHistoryVisible = true
    },
    useThisVersion(ob) {
      this.$confirm('该操作将使用版本' + ob.GamePkgVersion + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _data = {
          ID: ob.ID,
          BundleKey: ob.BundleKey,
          LobbyVersion: ob.LobbyVersion,
          LobbyVersionID: ob.LobbyVersionID,
          GamePkgVersion: ob.GamePkgVersion,
          PkgName: ob.PkgName,
          Status: ob.Status,
          WhiteVersion: ob.WhiteVersion
        }
        const loading = this.$loading({
          lock: true,
          text: '数据处理中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        request({
          url: '/gamepkgversions/update',
          method: 'post',
          data: _data
        }).then(response => {
          loading.close()
          if (response.RetCode === 0) {
            this.versionHistoryVisible = false
            this.getList()
            Message.success('保存成功！')
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    copyLobbyVersion2WhiteVersion() {
      this.edit.item.WhiteVersion = this.LobbyVersion
    },
    copyLobbyVersion2BatchWhiteVersion() {
      this.edit.batchWhiteVersion = this.LobbyVersion
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
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
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/create',
        method: 'post',
        data: postData
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          this.getList()
          Message.success('保存成功！')
        }
      }).catch(function() {
        loading.close()
      })
    },
    createLobbySave(postData) {
      const $this = this
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/create/lobby',
        method: 'post',
        data: postData
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          this.edit.lobbyItem.ID = response.Data.ID
          Message.success('保存成功！')
          $this.getLobbyVersions()
        }
      }).catch(function() {
        loading.close()
      })
    },
    copyLobbySave(postData) {
      const $this = this
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/copy/to/newlobby',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          $this.getLobbyVersions(loading)
        } else {
          loading.close()
        }
      }).catch(function() {
        loading.close()
      })
    },
    editSave(postData) {
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/update',
        method: 'post',
        data: postData
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      }).catch(function() {
        loading.close()
      })
    },
    editLobbySave(postData) {
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/update/lobby',
        method: 'post',
        data: postData
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          Message.success('保存成功！')
        }
      }).catch(function() {
        loading.close()
      })
    },
    batchEditWhiteVersionSave() {
      const $this = this
      if (this.selectedRows < 1) {
        Message.error('没有选中项')
        return false
      }
      const version = this.edit.batchWhiteVersion.trim()
      if (version === '') {
        Message.error('请正确输入白名单版本号')
        return false
      }
      const selectedIds = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        const item = this.selectedRows[i]
        selectedIds.push(item.ID)
      }
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/update/batch/pkgwhiteversion',
        method: 'post',
        data: {
          Ids: selectedIds,
          WhiteVersion: version,
          LobbyVersionId: $this.LobbyVersionID
        }
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          if (response.Data && response.Data.length > 0) {
            for (let i = 0; i < response.Data.length; i++) {
              const item = response.Data[i]
              $this.clientDB.UpdateData2('ID', item)
            }
          }
          $this.edit.batchEditWhiteVersion = false
          $this.edit.batchWhiteVersion = ''
        }
      }).catch(function() {
        loading.close()
      })
    },
    batchPublishWhiteVersionSave() {
      const $this = this
      if (this.selectedRows < 1) {
        Message.error('没有选中项')
        return false
      }
      const selectedIds = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        const item = this.selectedRows[i]
        selectedIds.push(item.ID)
      }
      const loading = this.$loading({
        lock: true,
        text: '数据处理中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/gamepkgversions/publish/batch/pkgwhiteversion',
        method: 'post',
        data: {
          Ids: selectedIds,
          LobbyVersionId: $this.LobbyVersionID
        }
      }).then(response => {
        loading.close()
        if (response.RetCode === 0) {
          Message.success('发布成功！')
          this.getList()
          $this.$refs.filterTable.clearSelection()
          $this.edit.batchPublishWhiteVersion = false
        }
      }).catch(function() {
        loading.close()
      })
    },
    getPostData() {
      return this.edit.item
    },
    getLobbyPostData() {
      return this.edit.lobbyItem
    },
    getCopyLobbyPostData() {
      return this.edit.copyLobbyItem
    },
    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getPostData().LobbyVersionID < 1) {
        this.$alert('链接版本ID错误，请刷新重试')
        return false
      }
      if (this.getPostData().LobbyVersion === '') {
        this.$alert('链接版本错误，请刷新重试')
        return false
      }
      if (this.getPostData().GamePkgVersion === '') {
        this.$alert('游戏包版本不能为空')
        return false
      }
      if (this.getPostData().BundleKey === '') {
        this.$alert('游戏包KEY不能为空')
        return false
      }
      return true
    },
    checkLobbyData() {
      this.$refs['edit.lobbyItem'].validate(valid => {})
      if (this.getLobbyPostData().LobbyVersion === '') {
        this.$alert('链接版本不能为空')
        return false
      }
      return true
    },
    checkCopyLobbyData() {
      this.$refs['edit.copyLobbyItem'].validate(valid => {})
      if (this.getCopyLobbyPostData().LobbyVersionID === 0) {
        this.$alert('链接版本ID不能为空，请刷新重试')
        return false
      }
      if (this.getCopyLobbyPostData().LobbyVersion === '') {
        this.$alert('链接版本不能为空')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      this.setGameName()
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },
    publishWhiteVersion() {
      if (!this.checkData()) {
        return
      }
      var _data = {}
      for (const key in this.edit.item) {
        _data[key] = this.edit.item[key]
      }
      _data.ID = 0
      _data.GamePkgVersion = _data.WhiteVersion.trim()
      _data.WhiteVersion = ''
      if (_data.GamePkgVersion === '') {
        Message.error('游戏包版本不能为空')
        console.log('postData: ', this.getPostData())
        return false
      }
      this.createSave(_data)
      this.edit.visible = false
    },
    saveLobbyVersion() {
      if (!this.checkLobbyData()) return

      if (this.edit.isLobbyEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.lobbyItem)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editLobbySave($this.getLobbyPostData())
          }
        })
      } else {
        this.createLobbySave(this.getLobbyPostData())
      }
      this.edit.lobbyVisible = false
      this.getLobbyVersions()
    },
    copyLobbyVersionCfg() {
      if (!this.checkCopyLobbyData()) return

      this.copyLobbySave(this.getCopyLobbyPostData())
      this.edit.copyLobbyVisible = false
    },
    getLobbyVersions(loading = undefined) {
      console.log('getLobbyVersions', loading === undefined)
      request({
        url: '/gamepkgversions/lobbyversions',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.length > 0) {
            this.LobbyVersionID = response.Data[response.Data.length - 1].ID
            this.LobbyVersion = response.Data[response.Data.length - 1].LobbyVersion
            this.LobbyVersionStatus = response.Data[response.Data.length - 1].Status
            this.LobbyVersionTag = response.Data[response.Data.length - 1].Tag
            this.setEdit(this.LobbyVersionTag === 0)
          }
          this.orgLobbyVersions = response.Data || []
          this.handleDisplayLobbyVersions()
          this.getList(loading)
        } else {
          loading && loading.close()
        }
      }).catch(function() {
        loading && loading.close()
      })
    },
    handleDisplayLobbyVersions() {
      this.lobbyVersions = []
      let needChangeLobbyVersion = false
      for (let i = 0; i < this.orgLobbyVersions.length; i++) {
        if (!this.showDisabledLobbyVersion && this.LobbyVersionID === this.orgLobbyVersions[i].ID && this.LobbyVersionStatus === 0) {
          needChangeLobbyVersion = true
        }
        if (!this.showDisabledLobbyVersion && this.orgLobbyVersions[i].Status === 0) {
          continue
        }
        this.lobbyVersions.push({
          key: this.orgLobbyVersions[i].ID,
          label: this.orgLobbyVersions[i].LobbyVersion,
          tag: this.orgLobbyVersions[i].Tag
        })
      }
      if (needChangeLobbyVersion) {
        this.LobbyVersionID = this.lobbyVersions[this.lobbyVersions.length - 1].key
        this.LobbyVersion = this.lobbyVersions[this.lobbyVersions.length - 1].label
        this.LobbyVersionTag = this.lobbyVersions[this.lobbyVersions.length - 1].tag
        this.setEdit(this.LobbyVersionTag === 0)
        this.LobbyVersionStatus = 1
      }
    },
    getLobbyVersionAlert() {
      // 获取当前列表下的最大版本号
      return '     需要将    ' +
        this.LobbyVersion + '    url 对应的【菲1客户端子版本】更新为下面子版本的最新版本号： ' +
        this.subMaxLobbyVersion
    },
    onStepChange(step, key, addData, delData, editData) {
      if (this.env === 'test' && !this.configData.lark) {
        return
      }
      // 1原始状态 2发布到测试环境 3发布到预发布 4提交审核 5审核完成待发布 6发布到正式环境
      console.log('publish success', step, key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      // 同步到正式
      if (this.env === 'pro' && step != 3 && step != 5) {
        console.log('生产环境只在审核和同步正式发送通知')
        return
      }
      this.makeMessage(step, addData, delData, editData)
    },
    getLobbyStr(lobbyVer, step) {
      let lobby = ''
      if (this.env === 'test') {
        lobby = `【已发布】F1客户端开发版本【${lobbyVer}】`
        if (this.LobbyVersionTag === 1) {
          this.setEdit(false)
        }
      } else if (step === 3) {
        lobby = `【待审核】F1客户端线上版本【${lobbyVer}】`
      } else if (step === 5) {
        lobby = `【已发布】F1客户端线上版本【${lobbyVer}】`
        if (this.LobbyVersionTag === 1) {
          this.setEdit(false)
        }
      }
      return lobby
    },
    getLobbyTagOn(lobbyVer) {
      for (let i = 0; i < this.orgLobbyVersions.length; i++) {
        if (lobbyVer === this.orgLobbyVersions[i].LobbyVersion) {
          console.log('hit lobby', lobbyVer, JSON.stringify(this.orgLobbyVersions[i]))
          return this.orgLobbyVersions[i].Tag === 1
        }
      }
      return false
    },
    async makeMessage(step, addData, delData, editData) {
      const adds = new Map()
      const dels = new Map()
      const change = {}
      // 新增取newVal
      if (addData) {
        // console.log("addData",addData)
        for (var i = 0; i < addData.length; i++) {
          const item = {}
          for (const ele of addData[i]) {
            item[ele.key] = ele.newVal
          }
          adds.set(item.BundleKey, item)
          // console.log("item",item,"adds",adds)
        }
      }
      if (delData) {
        // console.log("delData",delData)
        for (var i = 0; i < delData.length; i++) {
          const item = {}
          for (const ele of delData[i]) {
            item[ele.key.toString()] = ele.oldVal
          }
          dels.set(item.BundleKey, item)
          // console.log("item",item,"del",dels)
        }
      }
      // console.log("adds",adds)
      for (const [key, value] of adds) {
        const value2 = dels.get(key)
        console.log('key', key, value, value2)
        if (value2 === undefined || value === undefined) {
          continue
        }
        if (value.WhiteVersion === value2.WhiteVersion && value.GamePkgVersion === value2.GamePkgVersion) {
          continue
        }
        if (!this.getLobbyTagOn(value.LobbyVersion)) {
          continue
        }
        let str = `【ID】${value.ID}【${value.BundleKey}】: ${value.GamePkgVersion}【全量】`
        if (value.WhiteVersion !== '') {
          str += `${value.WhiteVersion}【白名单】`
        }
        const lobby = this.getLobbyStr(value.LobbyVersion, step)
        change[lobby] ? change[lobby].push(str) : change[lobby] = [str]
      }
      if (editData) {
        for (const edit of editData) {
          const id = edit.Head.ID
          console.log(id)
          for (const ele of edit.Rows) {
            if (ele.key === 'GamePkgVersion' || ele.key === 'WhiteVersion') {
              let _data = {}// this.clientDB.GetDataByID(id)
              if (_data.ID === undefined) {
                _data = await this.getItemData(edit.Head.ID)
                if (_data.ID === undefined) {
                  console.log('continue', edit.Head.ID)
                  continue
                }
              }
              if (!this.getLobbyTagOn(_data.LobbyVersion)) {
                continue
              }
              const lobby = this.getLobbyStr(_data.LobbyVersion, step)
              let str = `【ID】${_data.ID}【${_data.BundleKey}】: ${_data.GamePkgVersion}【全量】`
              if (_data.WhiteVersion !== '') {
                str += `${_data.WhiteVersion}【白名单】`
              }
              change[lobby] ? change[lobby].push(str) : change[lobby] = [str]
              break
            }
          }
        }
      }
      if (Object.keys(change).length === 0) {
        console.log('no change return')
        return
      }

      var msg = ''
      for (const key in change) {
        let str = key
        for (const ver of change[key]) {
          str += '\r\n' + ver
        }
        msg += str + '\r\n'
      }

      // 正式发布才@相关人员
      if (step === 5 && this.env === 'pro') {
        msg += '***需检查 uat 03 是否同步版本内容***\r\n'
        msg += '<at user_id="ou_dacc382512738a049ab4f32d6db9f82e">xiong</at><at user_id="ou_2b283f529fc901b97b443b946f692efd">SamYe</at><at user_id="ou_932b1ed1e7064b512199b77ce83236c1">高勋</at>\r\n'
      }
      console.log('change content', msg)
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/misc/warn',
          Env: this.env,
          Text: msg
          // Warn: "shit",
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          console.log('wanring success')
        }
      })
    },
    async getItemData(Id) {
      const response = await request({
        url: 'gamepkgversions/one',
        method: 'get',
        data: {
          Env: this.env,
          ID: Id
        }
      })
      if (response.RetCode === 0) {
        console.log('getItemData success', response.Data)
        return response.Data
      }
      return {}
    },
    setEdit(canEdit) {
      this.canEdit = canEdit
      this.$refs.filterTable.clearSelection()
    },
    getMessgeStatus() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'admin_config'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('cfg', response)
          this.config = response.Data || {}
          if (response.Data.Data && response.Data.Data !== '') {
            this.configData = JSON.parse(response.Data.Data)
          }
        }
      })
    },
    setMessgeStatus() {
      this.configData.lark = !this.configData.lark
      this.config.Data = JSON.stringify(this.configData)
      console.log(this.config.Data)
      this.updateConfig()
    },
    setGameName() {
      this.configData[this.edit.item.BundleKey] = this.edit.gameName
      this.config.Data = JSON.stringify(this.configData)
      console.log(this.config.Data)
      this.updateConfig()
    },
    updateConfig() {
      request({
        url: '/customizeconfig/update',
        method: 'post',
        data: this.config
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success(`更新游戏名成功!：[${this.edit.gameName}]`)
          this.$forceUpdate()
        } else {
          Message.success(`更新游戏名失败!`)
        }
      })
    }
  }
}
</script>
<style>
.el-input_no_border .el-input__inner {
  border: none;
}
</style>
