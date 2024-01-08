<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" :attr-names="AttrNames" compare-type="CustomizeConfig" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="4">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加活动公告
        </el-button>
      </el-col>
      <el-col :span="2" :offset="16">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新数据</el-button>
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
          prop="sort_num"
          label="排序"
          sortable="custom"
          width="80"
        />
        <el-table-column
          prop="name"
          label="公告名称"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="content_type"
          label="公告类型"
          width="100"
        >
          <template slot-scope="scope">
            {{ getTypeName(scope.row.content_type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="icon_banner"
          label="banner图预览"
          width="120"
        >
          <template slot-scope="scope">
            <img :src="getFullPath(scope.row.icon_banner)" height="80px">
          </template>
        </el-table-column>
        <el-table-column
          prop="ShowTime"
          label="banner展示时间"
          width="170"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.show_time_begin) }}-{{ formatTime(scope.row.show_time_end) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="icon_page"
          label="活动页面预览"
          width="150"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.content_type === 1" :src="getFullPath(scope.row.icon_page)" height="80px">
            <span v-if="scope.row.content_type === 2">
              {{ scope.row.content }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="活动展示时间"
          width="170"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.valid_time_begin) }}-{{ formatTime(scope.row.valid_time_end) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="TimeCreated"
          label="创建时间"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.time_created) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="time_updated"
          label="最近修改"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.time_updated) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="modify_user"
          label="最后修改人"
          width="120"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="120"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('status', scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          min-width="190"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-document-remove"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
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
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editForm" :model="edit.item" :rules="rules" label-width="150px" size="small">
        <el-tabs type="card">
          <el-tab-pane label="基础信息">
            <el-form-item label="活动公告名称：" :required="true" prop="name">
              <el-col :span="16"><el-input v-model="edit.item.name" /></el-col>
            </el-form-item>
            <el-form-item
              label="活动公告类型："
              :required="true"
              prop="content_type"
            >
              <el-radio-group
                v-model="edit.item.content_type"
                @change="handleContentTypeChange"
              >
                <el-radio :label="1">图片</el-radio>
                <el-radio :label="2">文本</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传Banner图：" :required="true">
              <el-upload
                class="avatar-uploader"
                :action="actionURL"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="SuccUpload1"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="edit.item.icon_banner" :src="getFullPath(edit.item.icon_banner)" class="avatar" height="100px">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item v-if="edit.item.content_type === 1" label="上传活动页面图：" :required="true">
              <el-upload
                class="avatar-uploader"
                :action="actionURL"
                :show-file-list="false"
                :with-credentials="true"
                :on-success="SuccUploadBack"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="edit.item.icon_page" :src="getFullPath(edit.item.icon_page)" class="avatar" height="100px">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item
              v-if="edit.item.content_type === 2"
              label="富文本内容："
              :required="true"
              prop="content"
            >
              <el-input v-model="edit.item.content" type="textarea" placeholder="" />
            </el-form-item>
            <el-form-item label="Banner展示时间：" :required="true">
              <el-col :span="8">
                <el-date-picker
                  v-model="edit.item.show_time_begin"
                  format="yyyy/MM/dd HH:mm:00"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="开始时间"
                />
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="1">
                <el-date-picker
                  v-model="edit.item.show_time_end"
                  format="yyyy/MM/dd HH:mm:00"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="结束时间"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="活动公告展示时间：" :required="true">
              <el-col :span="8">
                <el-date-picker
                  v-model="edit.item.valid_time_begin"
                  format="yyyy/MM/dd HH:mm:00"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="开始时间"
                />
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="1">
                <el-date-picker
                  v-model="edit.item.valid_time_end"
                  format="yyyy/MM/dd HH:mm:00"
                  value-format="timestamp"
                  type="datetime"
                  placeholder="结束时间"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="活动公告状态：" :required="true">
              <el-select v-model.number="edit.item.status" placeholder="请选择">
                <el-option label="禁用" :value="0" />
                <el-option label="启用" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动排序：" :required="true" prop="sort_num">
              <el-col :span="11">
                <el-input-number v-model="edit.item.sort_num" placeholder="活动排序" />
              </el-col>
            </el-form-item>
            <el-form-item label="登录强弹：" :required="true">
              <el-select v-model.number="edit.item.alert_rule" placeholder="请选择">
                <el-option label="每天只弹一次" :value="1" />
                <el-option label="每次登录都弹" :value="2" />
                <el-option label="不强弹" :value="3" />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <!--<el-tab-pane label="游戏名称多语言" name="second">
            <el-form-item label="图片内容：" :required="true">
              <template v-for="(o) in langTypes">
                <el-col :span="6">{{ getLangName(o) }}:</el-col>
                <el-col :span="18">
                  <el-upload
                    class="avatar-uploader"
                    drag
                    :action="actionURL2"
                    :with-credentials="true"
                    :show-file-list="false"
                    :data="getUploadParam(o)"
                    :on-success="Succ"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="edit.langPic[o]" :src="getFullPath(edit.langPic[o])">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-col>
              </template>
            </el-form-item>
          </el-tab-pane>-->
        </el-tabs>

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
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
import { $libDate, $libLang, $libShow, ClientTableData, DataRule, NewLangObj } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import { Message } from 'element-ui'

const filterMap = {
  'status': { 0: '禁用', 1: '启用' }
}

function newItem() {
  return {
    ID: '',
    name: '',
    content: '',
    content_type: 1,
    icon_banner: '',
    icon_page: '',
    show_time_begin: new Date().getTime(),
    show_time_end: new Date().getTime(),
    valid_time_begin: new Date().getTime(),
    valid_time_end: new Date().getTime(),
    status: 1,
    sort_num: 1,
    alert_rule: 1,
    modify_user: '',
    time_created: '',
    time_updated: ''
  }
}

export default {
  components: { Publish, Compare },
  data() {
    return {
      customCfg: {},
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      dragItems: [],
      langTypes: ['en', 'hi'],
      subKey: 'texas_pro_activity_nt',
      rules: {
        name: this.dataRule(true, { type: 's', range: '2-50' }),
        sort_num: this.dataRule(true, { type: '', range: '1' })
      },

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        langPic: NewLangObj(),
        itemNames: NewLangObj()
      },

      typeOption: [
        { label: '图片', value: 1 },
        { label: '文本', value: 2 }
      ],

      AttrNames: {
        name: '活动公告名称',
        content: '活动内容',
        content_type: '活动内容类型',
        icon_banner: 'Banner图片',
        icon_page: '内容图片',
        show_time_begin: 'Banner展示开始时间',
        show_time_end: 'Banner展示结束时间',
        valid_time_begin: '公告展示开始时间',
        valid_time_end: '公告展示结束时间',
        status: '公告状态',
        sort_num: '排序号码',
        alert_rule: '弹窗规则'
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
    console.log(1)
  },
  methods: {
    getTypeName(type) {
      let name = type
      for (const i in this.typeOption) {
        if (this.typeOption[i].value === parseInt(type)) {
          name = this.typeOption[i].label
        }
      }
      return name
    },
    getFullPath(url) {
      if (url === undefined) {
        return ''
      }
      return $libShow.GetFullPath(url.replace('/static/', '/'))
    },
    initDragItems() {
      this.dragItems = []
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        if (ob.status === 1) {
          this.dragItems.push({ ID: ob.ID, Sort: ob.Sort, Name: ob.Name })
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
      return $libDate.FormateSecondStr(ts, 1).replaceAll('-', '/')
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
    handleContentTypeChange(val) {
      console.log('radio:', val)
      if (val === 1) {
        this.rules.content = []
      } else {
        this.rules.content = this.dataRule(true, { type: 's', range: '2-100' })
      }
      this.$refs.editForm.clearValidate()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },

    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    getList() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.customCfg = response.Data || {}
          const objs = response.Data && response.Data.Data !== '' && JSON.parse(response.Data.Data) || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.initDragItems()
        }
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, `您确定要删除[ID:${ob.ID}]的公告吗？`)
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clientDB.DelData(id)
        this.customCfg.Data = JSON.stringify(this.clientDB.TotalData)
        request({
          url: '/customizeconfig/update',
          method: 'post',
          data: this.customCfg
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除公告成功！')
            this.refreshShow()
          }
        })
      }).catch(() => {
        console.log('取消')
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
      this.edit.item.icon_banner = res.Data
    },
    SuccUploadBack(res, file) {
      this.edit.item.icon_page = res.Data
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
      console.log(this.edit.item.show_time_begin)
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          this.edit.item.show_time_begin *= 1000
          this.edit.item.show_time_end *= 1000
          this.edit.item.valid_time_begin *= 1000
          this.edit.item.valid_time_end *= 1000
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(this.edit.item)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    checkEditForm() {
      if (this.edit.item.name === '') {
        this.$alert('活动公告名称不能为空')
        return false
      }
      if (this.edit.item.icon_banner === '') {
        this.$alert('请上传公告Banner图片')
        return false
      }
      if (this.edit.item.content_type === 1 && this.edit.item.icon_page === '') {
        this.$alert('请上传活动页面图片')
        return false
      }
      if (this.edit.item.content_type === 2 && this.edit.item.content === '') {
        this.$alert('活动公告内容不能为空')
        return false
      }
      if (this.edit.item.sort_num === '') {
        this.edit.item.sort_num = 1
      }
      return true
    },
    getMaxID() {
      let max = 0
      for (let i = 0; i < this.clientDB.TotalData.length; i++) {
        const data = this.clientDB.TotalData[i]
        if (data.ID > max) {
          max = data.ID
        }
      }
      return max + 1
    },
    editSave(postData) {
      console.log(postData)
      request({
        url: '/customizeconfig/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    save() {
      this.$refs.editForm.valueOf()
      if (!this.checkEditForm()) return

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.edit.item.time_updated = new Date().getTime() / 1000 | 0
            $this.edit.item.show_time_begin = $this.edit.item.show_time_begin / 1000 | 0
            $this.edit.item.show_time_end = $this.edit.item.show_time_end / 1000 | 0
            $this.edit.item.valid_time_begin = $this.edit.item.valid_time_begin / 1000 | 0
            $this.edit.item.valid_time_end = $this.edit.item.valid_time_end / 1000 | 0
            $this.edit.item.modify_user = $this.$store.getters.name
            $this.clientDB.UpdateData($this.edit.item)
            $this.customCfg.Data = JSON.stringify($this.clientDB.TotalData)
            $this.editSave($this.customCfg)
          }
        })
      } else {
        this.edit.item.ID = this.getMaxID()
        this.edit.item.time_created = new Date().getTime() / 1000 | 0
        this.edit.item.time_updated = this.edit.item.time_created
        this.edit.item.show_time_begin = this.edit.item.show_time_begin / 1000 | 0
        this.edit.item.show_time_end = this.edit.item.show_time_end / 1000 | 0
        this.edit.item.valid_time_begin = this.edit.item.valid_time_begin / 1000 | 0
        this.edit.item.valid_time_end = this.edit.item.valid_time_end / 1000 | 0
        this.edit.item.modify_user = this.$store.getters.name
        this.clientDB.AddData(this.edit.item)
        this.customCfg.Data = JSON.stringify(this.clientDB.TotalData)
        this.editSave(this.customCfg)
      }
      this.edit.visible = false
    }
  }
}
</script>
