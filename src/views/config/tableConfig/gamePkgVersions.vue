<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="GamePkgVersionsConfig" :env-empty="false" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="5">
        <el-form label-width="80px">
          <el-form-item label="大厅版本">
            <el-select v-model="LobbyVersionID" style="min-width: 200px" size="small" @change="getList()">
              <el-option
                v-for="item in lobbyVersions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCopyList()"
        >复制配置列表
        </el-button>
      </el-col>
      <el-col :span="3">
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
          width="90"
        />
        <el-table-column
          prop="BundleKey"
          label="包名"
          sortable="custom"
          width="180"
        />
        <el-table-column
          prop="GamePkgVersion"
          label="版本号"
          sortable="custom"
          width="180"
        />
        <el-table-column
          prop="IsWhite"
          label="是否白名单"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.IsWhite === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="LastModify"
          label="最近修改"
          sortable="custom"
          width="180"
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
          width="250"
        >
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
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 40, 80]"
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
            <el-input v-model="edit.item.LobbyVersionID" />
          </el-col>
        </el-form-item>
        <el-form-item label="包Key：" :required="true" prop="BundleKey">
          <el-col :span="15">
            <el-input v-model="edit.item.BundleKey" />
          </el-col>
        </el-form-item>
        <el-form-item label="版本号：" :required="true" prop="GamePkgVersion">
          <el-col :span="15">
            <el-input v-model="edit.item.GamePkgVersion" />
          </el-col>
        </el-form-item>
        <el-form-item label="是否需要白名单：" :required="true" prop="IsWhite">
          <el-col :span="15">
            <el-select v-model="edit.item.IsWhite" placeholder="请选择" required="true">
              <el-option
                v-for="item in isOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const filterMap = {}

export default {
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      lobbyVersions: [],
      LobbyVersionID: 0,
      statNames: { 0: '正常', 2: '上架', 6: '下架', 1: '关闭', 7: '预上架', 8: '预下架' },
      isOptions: [
        { value: 0, label: '否' },
        { value: 1, label: '是' }
      ],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      edit: {
        visible: false,
        item: this.newItem(),
        isEdit: false
      },
      isDisabled: false,
      rules: {
        LobbyVersionID: [{ required: true, trigger: 'blur' }],
        GamePkgVersion: [{ required: true, trigger: 'blur' }],
        BundleKey: [{ required: true, trigger: 'blur' }]
      },

      AttrNames: {
        LobbyVersionID: '大厅版本',
        BundleKey: '游戏包名',
        GamePkgVersion: '游戏包版本',
        IsWhite: '是否白名单验证'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.isDisabled = false
    this.getLobbyVersions()
    // 2s后执行
    setTimeout(() => {
      this.getList()
    }, 300)
  },
  methods: {
    newItem() {
      return { LobbyVersionID: this.LobbyVersionID, GamePkgVersion: '', BundleKey: '', IsWhite: 0 }
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
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    handleCopyList() {
      console.log('handleCopyList')
      return false
    },
    getList() {
      request({
        url: '/gamepkgversions/list/withlobby',
        method: 'get',
        data: {
          LobbyVersionID: this.LobbyVersionID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      if (this.getPostData().GamePkgVersion === '') {
        this.$alert('游戏包名不能为空')
        return false
      }
      if (this.getPostData().BundleKey === '') {
        this.$alert('游戏包版本号不能为空')
        return false
      }
      if (this.getPostData().LobbyVersionID === 0) {
        this.$alert('大厅版本版本不能为空，请刷新重试')
        return false
      }
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
        console.log('取消')
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
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
    getPostData() {
      return this.edit.item
    },
    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getPostData().Account === '') {
        this.$alert('账户不能为空')
        return false
      }
      if (this.getPostData().Intro === '') {
        this.$alert('描述不能为空')
        return false
      }
      if (this.getPostData().GameUri === '') {
        this.$alert('客户端uri 不能为空')
        return false
      }
      if (this.getPostData().Screen === '') {
        this.$alert('必须横竖屏选择')
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
    getLobbyVersions() {
      request({
        url: '/gamepkgversions/lobbyversions',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data.length > 0) {
            this.LobbyVersionID = response.Data[response.Data.length - 1].ID
          }
          this.lobbyVersions = []
          for (let i = 0; i < response.Data.length; i++) {
            this.lobbyVersions.push({
              key: response.Data[i].ID,
              label: response.Data[i].LobbyVersion
            })
          }
          console.log('this.LobbyVersionID>>>', this.LobbyVersionID)
          console.log('this.lobbyVersions>>>', this.lobbyVersions)
        }
      })
    }
  }
}
</script>
