<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="MarketApiSceneConfig" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="getPublishAttrNames()" :head-attrs="['ID','AppId','SceneId','Site','Scene']" />
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
          <el-descriptions-item label="场景配置说明：">【当前平台】+【场景ID】+【站点】 组成配置唯一键。</el-descriptions-item>
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
        <el-table-column prop="sceneId" label="场景ID（内部用）" width="200">
          <template #header>
            <div class="header-filter-wrap">
              <span class="header-label">场景ID（内部用）</span>
              <el-select
                v-model="clientDB.FilterValueMap['sceneId']"
                multiple
                size="mini"
                placeholder="全部"
                clearable
                filterable
                @change="handleFilter"
                @click.native.stop
              >
                <el-option
                  v-for="item in sceneIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>

          <template slot-scope="scope">
            {{ getSceneName(scope.row.sceneId) }}
          </template>
        </el-table-column>
        <el-table-column prop="scene" label="场景值" />
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
                【当前平台】+【场景ID】+【站点】 组成配置唯一键。
              </el-alert>
            </el-col>
          </el-row>
          <el-row>
            <el-form label-width="220px" size="mini">
              <el-col :span="24">
                <el-form-item label="场景ID（内部用）：" :required="true">
                  <el-select v-model="edit.item.sceneId" placeholder="请选择" filterable :disabled="edit.isEdit" @change="handleSceneIdChange">
                    <el-option
                      v-for="item in sceneIdOptions"
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
                <el-form-item label="场景有效时间（内部展示用）：" prop="EndTime">
                  <el-date-picker v-model="edit.item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" :required="true" />
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
import { GetSceneOptions } from '@//utils/options'

const filterMap = {}

function newItem() {
  return {
    id: 0,
    appId: 0,
    sceneId: 0,
    site: '',
    scene: '',
    endTime: 0,
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
        title: '新增'
      },
      env: 'test',
      AttrNames: {
        id: '配置ID',
        appId: '应用',
        sceneId: '场景ID（内部用）',
        site: '站点',
        endTime: '场景值有效期',
        remark: '备注',
        status: '状态'
      },
      sceneIdOptions: [],
      filterSceneSelected: {}
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.sceneIdOptions = GetSceneOptions(this.appId)
    this.getList()
  },
  methods: {
    getSceneName(sceneId) {
      for (let i = 0; i < this.sceneIdOptions.length; i++) {
        if (this.sceneIdOptions[i].value === sceneId) {
          return this.sceneIdOptions[i].label
        }
      }
      return '未知场景'
    },
    handleSceneIdChange() {
      console.log('handleSceneIdChange', this.edit.item.sceneId)
      for (let i = 0; i < this.sceneIdOptions.length; i++) {
        if (this.sceneIdOptions[i].value === this.edit.item.sceneId && this.sceneIdOptions[i].ticketId) {
          this.edit.item.propId = this.sceneIdOptions[i].ticketId
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
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      const selectedSceneIds = this.clientDB.FilterValueMap['sceneId']
      console.log('selectedSceneIds', selectedSceneIds)
      // 如果 selectedSceneIds 为空，则返回所有数据
      if (!selectedSceneIds || selectedSceneIds.length === 0) {
        this.clientDB.ShowData = this.clientDB.TotalData
      } else {
        this.clientDB.ShowData = this.clientDB.TotalData.filter(data => {
          // 筛选 数据中 字段 sceneId 为 selectedSceneIds 包含的数据
          if (selectedSceneIds.includes(data.sceneId)) return true
          return false
        })
      }

      this.clientDB.Page.SetTotalCount(this.clientDB.ShowData.length)
      this.refreshShow()
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['sceneId', 'scene', 'sceneName'])
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
            item.sceneName = $this.getSceneName(item.sceneId)
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
      if (this.edit.item.sceneId === 0) {
        Message.error('请选择对应场景')
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
      console.log('get post: ', this.edit.item)
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
    initFormData(bEdit, row) {
      this.edit.isEdit = bEdit
      this.edit.item = row
      console.log('initFormData: ', this.edit.item)
      if (bEdit) {
        // 设置修改之前数据
        this.$refs.compare.SetOldVal(row)
      }
    },
    handleAdd() {
      this.edit.item = newItem()
      this.edit.isEdit = false
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
