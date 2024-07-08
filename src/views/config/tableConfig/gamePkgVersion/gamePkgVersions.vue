<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="GamePkgVersionsConfig" :env-empty="false" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <template>
        <el-alert type="error">
          修改了：framework、app/main、proto、resources、app/yy.ts 内容，需要修改链接版本<br>
          其他 bundle 包含有：lobby、common、solitaire_pokers、游戏公共bundle、游戏bundle<br>
          <br>
          如有版本修改后未生效，请刷新界面检查是否为最新链接版本<br>
          <br>
          遇到其他问题请找：宏威
        </el-alert>
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
      </el-form>
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
      </el-form>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        v-loading="loadingShow"
        :data="tableData.filter(data => !search || (data.BundleKey.toLowerCase().includes(search.toLowerCase()) || data.PkgName.toLowerCase().includes(search.toLowerCase()) || data.GamePkgVersion.toLowerCase().includes(search.toLowerCase())))"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange"
      >
<!--        <el-table-column-->
<!--          type="selection"-->
<!--          width="55"-->
<!--        />-->
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="PkgName"
          label="包名"
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
              placeholder="输入关键字搜索(包名，key，版本号)"
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
            :page-sizes="[40, 60, 80, 100]"
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
        <el-form-item label="包名：" :required="true" prop="PkgName">
          <el-col :span="15">
            <el-input v-model="edit.item.PkgName" />
          </el-col>
        </el-form-item>
        <el-form-item label="包Key：" :required="true" prop="BundleKey">
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
          label="包名"
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

const filterMap = {}

export default {
  components: { Compare, Publish },
  data() {
    return {
      loadingShow: false,
      tableData: [],
      historyMap: {},
      historyVersions: [],
      lobbyVersions: [],
      lobbyVersionData: [],
      orgLobbyVersions: [],
      LobbyVersionID: 0,
      LobbyVersion: '',
      LobbyVersionStatus: 0,
      statNames: { 0: '正常', 2: '上架', 6: '下架', 1: '关闭', 7: '预上架', 8: '预下架' },
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
        item: this.newItem(),
        isEdit: false,
        lobbyVisible: false,
        lobbyItem: this.newLobbyItem(),
        isLobbyEdit: false,
        copyLobbyVisible: false,
        copyLobbyItem: this.newCopyLobbyItem()
      },
      multipleSelection: [],
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
        PkgName: '包名',
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
    // 300ms后执行
    setTimeout(() => {
      this.getList()
    }, 300)
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
      if (column.label === 'ID' || column.label === '包名' || column.label === '操作') {
        return
      }
      this.initFormData(true, row.ID)
      this.edit.visible = true
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
          this.LobbyVersion = this.orgLobbyVersions[i].Version
          this.LobbyVersionStatus = this.orgLobbyVersions[i].Status
          break
        }
      }
      this.getList()
    },
    getList() {
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
          this.clientDB = new ClientTableData(objs, 40, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.historyMap = response.Data.HistoryMap || {}
        }
      }).catch(function() {
        $this.loadingShow = false
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
          }
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
        request({
          url: '/gamepkgversions/update/status',
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
        request({
          url: '/gamepkgversions/update',
          method: 'post',
          data: _data
        }).then(response => {
          if (response.RetCode === 0) {
            this.versionHistoryVisible = false
            this.getList()
            Message.success('保存成功！')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange>>>>>', val)
      this.multipleSelection = val
    },
    //* * ********************** 修改/添加弹框相关 *****************
    copyLobbyVersion2WhiteVersion() {
      this.edit.item.WhiteVersion = this.LobbyVersion
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
      request({
        url: '/gamepkgversions/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          this.getList()
          Message.success('保存成功！')
        }
      })
    },
    createLobbySave(postData) {
      const $this = this
      request({
        url: '/gamepkgversions/create/lobby',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.lobbyItem.ID = response.Data.ID
          Message.success('保存成功！')
          $this.getLobbyVersions()
        }
      })
    },
    copyLobbySave(postData) {
      const $this = this
      request({
        url: '/gamepkgversions/copy/to/newlobby',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          $this.getLobbyVersions()
        }
      })
    },
    editSave(postData) {
      request({
        url: '/gamepkgversions/update',
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
    editLobbySave(postData) {
      request({
        url: '/gamepkgversions/update/lobby',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
        }
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
    getLobbyVersions() {
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
          }
          this.orgLobbyVersions = response.Data || []
          this.handleDisplayLobbyVersions()
        }
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
          label: this.orgLobbyVersions[i].LobbyVersion
        })
      }
      if (needChangeLobbyVersion) {
        this.LobbyVersionID = this.lobbyVersions[this.lobbyVersions.length - 1].key
        this.LobbyVersion = this.lobbyVersions[this.lobbyVersions.length - 1].label
        this.LobbyVersionStatus = 1
      }
    }
  }
}
</script>
<style>
.el-input_no_border .el-input__inner {
  border: none;
}
</style>
