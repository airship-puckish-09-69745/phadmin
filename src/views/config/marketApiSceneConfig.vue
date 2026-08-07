<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="MarketApiSceneConfig" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="getPublishAttrNames()" :head-attrs="['ID','AppId','Pid','Site','Scene']" />
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-descriptions
          class="margin-top"
          :column="1"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px', 'color':'red'}"
          border
        >
          <el-descriptions-item label="场景配置说明：">【当前平台】+【发放ID】+【站点】 组成配置唯一键。</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
      <!--      <el-col :span="4">-->
      <!--        <el-input-->
      <!--          v-model="search"-->
      <!--          size="mini"-->
      <!--          placeholder="输入关键字搜索"-->
      <!--          @input="searchChange"-->
      <!--          @blur="search = search.trim()"-->
      <!--        />-->
      <!--      </el-col>-->
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
      >
        <el-table-column prop="id" label="ID" sortable="custom" width="80" />
        <el-table-column prop="appId" label="平台ID" />
        <el-table-column prop="site" label="站点" />
        <el-table-column prop="pid" label="发放ID（内部用）" width="200">
          <template #header>
            <div class="header-filter-wrap">
              <span class="header-label">发放ID（内部用）</span>
              <el-select
                v-model="clientDB.FilterValueMap['pid']"
                size="mini"
                placeholder="全部"
                clearable
                filterable
                @change="handleScenePidFilter"
                @click.native.stop
              >
                <el-option
                  v-for="item in scenePidOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>

          <template slot-scope="scope">
            {{ getScenePidName(scope.row.pid) }}
          </template>
        </el-table-column>
        <el-table-column prop="scene" label="场景值" />
        <el-table-column prop="pType" label="发放类型（展示用）" width="200">
          <template slot-scope="scope">
            {{ getPTypeName(scope.row.pType) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="场景有效期" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="propId" label="关联道具ID" />
        <el-table-column prop="modifyUser" label="最后修改人" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <!--            <el-button v-if="scope.row.status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />-->
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
        <el-tab-pane label="场景配置">
          <el-row>
            <el-col :span="24">
              <el-alert title="场景配置说明：" type="info" :closable="false">
                【当前平台】+【发放ID】+【站点】 组成配置唯一键。
              </el-alert>
            </el-col>
          </el-row>
          <el-row>
            <el-form label-width="220px">
              <el-col :span="24">
                <el-form-item label="发放ID（内部用）：" :required="true" size="medium">
                  <el-select v-model="edit.item.pid" placeholder="请选择" style="width: 100%" filterable :disabled="edit.isEdit" @change="handleSceneIdChange">
                    <el-option
                      v-for="item in scenePidOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发放类型（展示用）：" :required="true">
                  <el-select v-model="edit.item.pType" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in SCENE_P_TYPE_OPTIONS"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="站点：" :required="true">
                  <MarketApiSiteSelect v-model="edit.item.site" :is-edit="edit.isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="场景值：" prop="scene">
                  <el-input v-model="edit.item.scene" maxlength="32" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="场景有效时间（展示用）：" prop="EndTime">
                  <el-date-picker v-model="edit.pickerEndTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" :required="true" @change="handleEndTimeChange" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="edit.item.remark" maxlength="64" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="关联道具ID：" prop="propId">
                  <el-input v-model="edit.item.propId" number disabled="disabled" maxlength="64" />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
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

import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import MarketApiSiteSelect from '@/components/MarketApiSiteSelect/index.vue'
import { GetScenePidOptions, SCENE_P_TYPE_OPTIONS } from '@//utils/options'

const filterMap = { pid: [] }

function newItem() {
  return {
    id: 0,
    appId: 0,
    pid: 0,
    pType: 0,
    site: '',
    scene: '',
    endTime: $libDate.GetDayBegin(new Date().getTime() + 86400 * 1000) / 1000,
    remark: '',
    propId: 0
  }
}

export default {
  components: { Compare, Publish, MarketApiSiteSelect },
  data() {
    return {
      tableData: [],
      deleteData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      search: '',
      edit: {
        isEdit: false,
        visible: false,
        item: newItem(),
        title: '新增',
        pickerEndTime: null
      },
      env: 'test',
      AttrNames: {
        id: '配置ID',
        appId: '应用',
        pid: '发放ID（内部用）',
        pType: '发放类型：1 投注金、2 返水金、3 门票',
        site: '站点',
        scene: '场景值',
        endTime: '场景值有效期',
        remark: '备注',
        status: '状态'
      },
      scenePidOptions: [],
      SCENE_P_TYPE_OPTIONS,
      filterSceneSelected: {}
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.scenePidOptions = GetScenePidOptions(this.appId)
    this.getList()
  },
  methods: {
    getScenePidName(pid) {
      for (let i = 0; i < this.scenePidOptions.length; i++) {
        if (this.scenePidOptions[i].value === pid) {
          return this.scenePidOptions[i].label
        }
      }
      return '未知发放场景'
    },
    getPTypeName(pType) {
      for (let i = 0; i < this.SCENE_P_TYPE_OPTIONS.length; i++) {
        if (this.SCENE_P_TYPE_OPTIONS[i].value === pType) {
          return this.SCENE_P_TYPE_OPTIONS[i].label
        }
      }
      return '未知发放类型'
    },
    handleSceneIdChange() {
      console.log('handleSceneIdChange', this.edit.item.pid)
      for (let i = 0; i < this.scenePidOptions.length; i++) {
        if (this.scenePidOptions[i].value === this.edit.item.pid && this.scenePidOptions[i].ticketId) {
          this.edit.item.propId = this.scenePidOptions[i].ticketId
        }
      }
    },
    makeContent(key, addData, delData, editData) {
      return ''
    },
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
    handleScenePidFilter() {
      const selectedScenePids = this.clientDB.FilterValueMap['pid'] || []
      if (selectedScenePids.length === 0) {
        this.clearFilter()
      } else {
        this.handleFilter()
      }
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['pid'])
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
    getList() {
      const $this = this
      request({
        url: '/marketapisceneconfig/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          objs.forEach(function(item) {
            item.sceneName = $this.getScenePidName(item.pid)
          })
          console.log('objs ', objs)
          this.clientDB = new ClientTableData(objs, 10, filterMap)
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
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
    changeStatus(id, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/marketapisceneconfig/update/status',
          method: 'post',
          data: {
            id: id,
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
      if (this.edit.item.pid === 0) {
        Message.error('请选择对应发放场景')
        return
      }
      if (this.edit.item.scene.trim() === '') {
        Message.error('请输入场景值')
        return
      }
      if (this.edit.item.site === '') {
        Message.error(`请选择对应站点`)
        return
      }
      console.log('get post data: ', this.edit.item)
      return this.edit.item
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
    },
    createData(data) {
      request({
        url: '/marketapisceneconfig/create',
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
        url: '/marketapisceneconfig/update',
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
    //* *********************** 修改/添加弹框相关 ************************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row)
        this.edit.visible = true
      }
    },
    // 日期选择器变化时：毫秒 → 秒
    handleEndTimeChange(val) {
      // val 为毫秒时间戳（或 null）
      this.edit.item.endTime = val ? Math.floor(val / 1000) : 0
    },
    // 打开编辑对话框时，将秒转毫秒给 pickerEndTime
    initFormData(bEdit, row) {
      this.edit.isEdit = bEdit
      this.edit.item = row
      // 将秒级时间戳转为毫秒，供日期选择器显示
      this.edit.pickerEndTime = row.endTime ? row.endTime * 1000 : null
      if (bEdit) {
        this.$refs.compare.SetOldVal(row)
      }
    },
    handleAdd() {
      this.initFormData(false, newItem())
      this.edit.visible = true
    }
    //* *********************** 修改/添加弹框相关 ************************
  }
}
</script>
<style scoped>
.header-filter-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.header-label {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
}
.header-filter-wrap .el-select {
  width: 100%;
}
/* 调整表头中 select 的尺寸 */
.header-filter-wrap .el-select .el-input--mini .el-input__inner {
  height: 24px;
  line-height: 24px;
}
</style>
