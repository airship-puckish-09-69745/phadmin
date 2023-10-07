<template>
  <div id="app" class="page-container">
    <el-row>
      <el-col :span="2" :offset="20">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="refreshData">刷新
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-select v-model="zipModule" size="mini" filterable>
          <el-option label="全部" :value="0" />
          <el-option v-for="(o,idx) in modules" :key="idx" :value="o.Key">
            <span style="float: left">{{ o.Key }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ o.Value }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button
          size="mini"
          type="primary"
          plain
          @click="handlePublish"
        >打包
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          size="mini"
          type="primary"
          plain
          @click="handleDownload"
        >下载
        </el-button>
      </el-col>
    </el-row>
    <template>
      <el-row>
        <el-col :span="16">
          <el-button size="mini" @click="clearFilter">清除所有过滤器</el-button>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchContent"
            size="mini"
            placeholder="输入关键字搜索"
          />
        </el-col>
        <el-col :span="4">
          <el-button size="mini" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
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
          prop="Module"
          label="模块"
          width="150"
        >
          <template v-slot:header>
            <el-select v-model="filterItem.Module" size="mini" filterable @change="handleFilter">
              <el-option label="模块" :value="0" />
              <el-option v-for="(o,idx) in getModules" :key="idx" :value="o.Key">
                <span style="float: left">{{ o.Key }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ o.Value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="Key"
          label="Key"
          width="150"
        />
        <el-table-column
          prop="Name"
          label="名称"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.Name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Type"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="filterItem.Type" size="mini" filterable @change="handleFilter">
              <el-option label="分类" :value="0" />
              <el-option v-for="(o,key) in filterMap.Type" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            <span v-text="filterMap.Type[scope.row.Type]" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Lang"
          label="内容"
          min-width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.Type==1">
              <pre style="width:500px;word-wrap: break-word">英：{{ scope.row.Lang['en'] }}</pre>
              <pre
                style="width:500px;word-wrap: break-word"
              >菲律宾：{{ scope.row.Lang['tl'] }}</pre>
            </div>
            <div v-else>
              英：<img
                height="60px"
                :src="libShow.GetFullPath(scope.row.Lang['en'])"
              ><br>
              菲律宾：<img
                height="60px"
                :src="libShow.GetFullPath(scope.row.Lang['tl'])"
              ><br>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="IsFinish"
          label="是否完整"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="filterItem.IsFinished" size="mini" filterable @change="handleFilter">
              <el-option label="是否完整" :value="0" />
              <el-option v-for="(o,key) in filterMap.IsFinished" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            <span v-text="filterMap.IsFinished[scope.row.IsFinish]" />
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          column-key="op"
          width="300"
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
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
            <el-button
              v-if="checkShowSync(scope.row)"
              size="mini"
              type="success"
              icon="el-icon-s-open"
              @click="handleSync(scope.row)"
            >同步
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div v-if="filterItem.ShowPage" class="block">
          <el-pagination
            :current-page="filterItem.PageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="filterItem.PageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterItem.TotalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </template>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="23">
          <el-form ref="edit" :model="edit" label-width="150px" size="small">
            <el-form-item label="模块：" prop="item.Module" :required="true">
              <span v-if="edit.isEdit">{{ edit.item.Module }}</span>
              <el-select v-else v-model="edit.item.Module" size="mini" filterable>
                <el-option v-for="(o,idx) in modules" :key="idx" :value="o.Key">
                  <span style="float: left">{{ o.Key }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ o.Value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="KEY：" prop="item.Key" :required="true" :rules="dataRule(true,{type:'s',range:'1-50'})">
              <el-col :span="18">
                <span v-if="edit.isEdit">{{ edit.item.Key }}</span>
                <el-input v-else v-model="edit.item.Key" placeholder="图片key带后缀名" />
              </el-col>
            </el-form-item>
            <el-form-item label="名称：" prop="item.Name" :required="true" :rules="dataRule(true,{type:'s',range:'1-20'})">
              <el-col :span="18">
                <el-input v-model="edit.item.Name" />
              </el-col>
            </el-form-item>
            <el-form-item label="类型：" prop="item.Type" :required="true">
              <span v-if="edit.isEdit">{{ itemTypeName }}</span>
              <el-radio-group v-if="!edit.isEdit" v-model="edit.item.Type">
                <el-radio :label="1">文本</el-radio>
                <el-radio :label="2">图片</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="edit.item.Type==1">
              <el-form-item label="文本内容：" :required="true">
                英文:
                <el-input
                  v-model="edit.textContent.en"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5}"
                />
                菲律宾:
                <el-input
                  v-model="edit.textContent.tl"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5}"
                />
              </el-form-item>
            </template>
            <el-form-item v-if="edit.item.Type==2" label="图片内容：" :required="true">
              <template>
                <el-col :span="6">英文:</el-col>
                <el-col :span="18">
                  <el-upload
                    class="avatar-uploader"
                    drag
                    :action="actionURL"
                    :show-file-list="false"
                    :with-credentials="true"
                    :data="getUploadParam('en')"
                    :on-success="Succ"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="edit.pic['en']" :src="libShow.GetFullPath(edit.pic['en'])">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-col>
              </template>
              <template>
                <el-col :span="6">菲律宾:</el-col>
                <el-col :span="18">
                  <el-upload
                    class="avatar-uploader"
                    drag
                    :action="actionURL"
                    :show-file-list="false"
                    :with-credentials="true"
                    :data="getUploadParam('tl')"
                    :on-success="Succ"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="edit.pic['tl']" :src="libShow.GetFullPath(edit.pic['tl'])">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-col>
              </template>
            </el-form-item>

            <el-form-item>
              <el-col :span="12" :offset="10">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="同步"
      :visible.sync="sync.show"
      width="30%"
    >
      <span class="dialog-body">
        <el-row :gutter="10">
          <el-col :span="22" :offset="1">
            <el-checkbox-group v-model="sync.project">
              <el-checkbox v-for="opt in sync.options" :key="opt.value" :label="opt.value" border :disabled="hasSyncProject(opt.value)">{{ opt.label }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sync.show = false">取 消</el-button>
        <el-button type="primary" @click="doSync">同 步</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import { $data, $libDate, $libLang, $libShow, DataRule, NewLangObj } from '@/utils/common'
import request from '@/utils/request'

function NewItem() {
  return { ID: 0, Key: '', Name: '', Type: 1, Content: '', Module: '' }
}

export default {
  data() {
    return {
      libShow: $libShow,
      modules: [],
      tableData: [],
      project: 'android',
      langs: { 'en': '英语', 'tl': '菲律宾' },
      checkLang: 'EN',
      fileList: [],
      fileName: '',
      filterItem: {
        Module: 0,
        Type: 0,
        TotalCount: 0,
        PageNo: 1,
        PageNum: 10,
        IsFinished: 0,
        OrderByID: 'DESC',
        ShowPage: false
      },
      filterMap: {
        'IsFinished': { 1: '是', 2: '否' },
        'Type': { 1: '文字', 2: '图片' },
        'Modules': []
      },
      zipModule: '0',
      searchContent: '',

      edit: {
        visible: false,
        item: NewItem(),
        textContent: NewLangObj(),
        pic: NewLangObj(),
        isEdit: false,
        langTypes: $data.LangTypes
      },

      sync: {
        show: false,
        data: {},
        project: [''], // 需要同步的项目
        options: [
          // 历史包袱
          { label: 'android', value: 'galaxy' },
          { label: 'ios', value: 'ios' }
        ]
      }
    }
  },
  computed: {
    canDelete() {
      return this.$store.state.user.name === 'howard'
    },
    getModules() {
      return this.modules
    },
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload/image2'
    },
    isLongTxt() {
      return this.edit.textContent.en && this.edit.textContent.en.length > 20
    },
    itemTypeName() {
      if (this.edit.item.Type === 1) {
        return '文本'
      } else {
        return '图片'
      }
    }
  },
  created() {
    this.project = this.$route.meta.platform

    // 清除当前项目
    for (const i in this.sync.options) {
      if (this.sync.options[i].value === this.project) {
        this.sync.options.splice(parseInt(i), 1)
        break
      }
    }

    this.getLangModules()
    console.log(1)
  },
  methods: {

    getLangModules() {
      request({
        url: '/configmap/all',
        method: 'get',
        data: {
          Type: 'langModules'
        }
      }).then(response => {
        const objs = response.Data || []
        objs.sort(function(a, b) {
          return a.Key.localeCompare(b.Key)
        })
        this.modules = objs
        this.filterMap = {
          'IsFinished': { 1: '是', 2: '否' },
          'Type': { 1: '文字', 2: '图片' },
          'Modules': this.modules
        }
        this.$refs.filterTable.doLayout()
        this.getInfo()
      })
    },
    handleSearch() {
      request({
        url: '/langRes/search',
        method: 'get',
        data: {
          Content: this.searchContent,
          Project: this.project
        }
      }).then(response => {
        const objs = response.Data && response.Data.Data || []
        for (let i = 0; i < objs.length; i++) {
          const lang = $libLang.GetLangOBJ(objs[i].Content)
          objs[i]['Lang'] = lang
        }
        this.tableData = objs
        this.filterItem.ShowPage = false
      })
    },
    // 筛选相关逻辑
    clearFilter() {
      this.filterItem.Module = 0
      this.filterItem.Type = 0
      this.getInfo()
    },
    handleFilter() {
      this.getInfo()
    },
    handleSizeChange(val) {
      this.filterItem.PageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.filterItem.PageNo = val
      this.getInfo()
    },
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    sortChange(ob) {
      if (ob.order == null) {
        this.filterItem.OrderByID = ''
      } else if (ob.order === 'descending') {
        this.filterItem.OrderByID = 'DESC'
      } else {
        this.filterItem.OrderByID = 'ASC'
      }
      this.getInfo()
    },
    // 操作类函数

    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },
    handleCreate() {
      this.edit.item = NewItem()
      this.edit.visible = true
      this.edit.isEdit = false
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    checkShowSync(ob) {
      if (!ob.SyncProjectArr) {
        return true
      }
      return !(ob.SyncProjectArr.length === this.sync.options.length)
    },
    hasSyncProject(project) {
      return this.sync.data.SyncProjectArr && this.sync.data.SyncProjectArr.indexOf(project) >= 0
    },
    handleSync(ob) { // 同步
      this.sync.show = true
      this.sync.data = ob
      this.sync.project = []
      for (const i in this.sync.options) {
        if (this.sync.data.SyncProjectArr.indexOf(this.sync.options[i].value) === -1) {
          this.sync.project.push(this.sync.options[i].value)
        }
      }
    },
    async doSync() {
      if (this.sync.project && this.sync.project.length === 0) {
        this.$message.error('没有需要同步的项目')
      }
      for (const i in this.sync.project) {
        this.sync.data.Project = this.sync.project[i]
        // this.sync.data.SyncProjectArr.push(this.sync.project[i])
        this.sync.data.SyncProject = this.getUpdateSyncProject(this.sync.project[i])
        this.sync.data.UpdateSyncProject = this.getSyncProject()
        this.sync.data.sync = 1
        console.log('sync', this.sync.data.Project, 'data', this.sync.data)
        await this.createApi(this.sync.data)
      }

      if (this.sync.project.length === this.sync.options.length) {
        this.sync.show = false
      }
    },
    getSyncProject() {
      const arr = []
      for (const i in this.sync.options) {
        arr.push(this.sync.options[i].value)
      }
      return JSON.stringify(arr)
    },
    getUpdateSyncProject(syncProject) {
      const arr = [this.project]
      for (const i in this.sync.options) {
        if (this.sync.options[i].value !== syncProject) {
          arr.push(this.sync.options[i].value)
        }
      }
      return JSON.stringify(arr)
    },
    doDelete(ob) {
      request({
        url: '/langRes/delete',
        method: 'post',
        data: {
          ID: ob.ID
        }
      }).then(response => {
        Message.success('删除成功！')
        this.getInfo()
      })
    },
    handleDelete(ob) {
      this.$confirm('确定要删除此记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(ob)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    handleDownload() {
      this.$router.push('langZips_' + this.project)
    },
    handlePublish() {
      if (this.zipModule === 0) {
        this.zipModule = ''
      }
      request({
        url: '/langRes/publish',
        method: 'post',
        data: {
          Module: this.zipModule,
          Project: this.project
        }
      }).then(response => {
        Message.success('打包成功！')
      })
    },
    handleSuccess(rsp, file, fileList) {
      this.fileName = rsp.Data
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      Message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    refreshData() {
      this.filterItem.OrderByID = 'DESC'
      this.filterItem.PageNo = 1
      this.getInfo()
    },
    getInfo() {
      request({
        url: '/langRes/all',
        method: 'get',
        data: {
          PageNo: this.filterItem.PageNo,
          PageNum: this.filterItem.PageNum,
          Type: this.filterItem.Type,
          Module: this.filterItem.Module,
          IsFinished: this.filterItem.IsFinished,
          OrderByID: this.filterItem.OrderByID,
          Project: this.project
        }
      }).then(response => {
        const objs = response.Data && response.Data.Data || []

        for (let i = 0; i < objs.length; i++) {
          const lang = $libLang.GetLangOBJ(objs[i].Content)
          objs[i]['Lang'] = lang
          if (objs[i].SyncProject && objs[i].SyncProject != '' && objs[i].SyncProject.length > 0) {
            objs[i].SyncProjectArr = JSON.parse(objs[i].SyncProject)
          } else {
            objs[i].SyncProjectArr = []
          }
        }
        this.filterItem.TotalCount = response.Data.TotalCount
        this.filterItem.ShowPage = true
        this.tableData = objs
      })
    },
    //* *****************************修改/添加相关逻辑
    save() {
      const postData = this.getPostData()
      postData.Project = this.project
      if (this.edit.isEdit) {
        this.updateApi(postData)
      } else {
        this.createApi(postData)
      }
    },
    async createApi(data) {
      const response = await request({
        url: '/langRes/create',
        method: 'post',
        data: data
      })

      // .then(response => {
      //   console.log('project', data.Project, 'create response', response)
      //   if (response.RetCode === 0) {
      //     this.$message.success('添加成功')
      //   } else {
      //     // this.$message.error(response.Data)
      //   }
      //   this.getInfo()
      // })

      console.log('project', data.Project, 'create response', response)
      if (response.RetCode === 0) {
        this.$message.success('添加成功')
      } else {
        // this.$message.error(response.Data)
      }
      this.getInfo()
    },
    updateApi(data) {
      request({
        url: '/langRes/update',
        method: 'post',
        data: data
      }).then(response => {
        console.log('update response', response)
        if (response.RetCode === 0) {
          this.getInfo()
          this.$message.success('修改成功')
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getUploadParam(langType) {
      return { Param: langType }
    },
    Succ(res, file) {
      this.edit.pic[res.Data.Param] = res.Data.Path
    },
    beforeAvatarUpload(file) {
      // 图片格式需要与key后缀一致
      var ss = this.edit.item.Key.split('.')
      if (ss.length !== 2) {
        this.$message.error('图片的key需要带后缀')
        return false
      }
      var isOK = false
      if (ss[1] === 'jpg') {
        isOK = file.type === 'image/jpeg'
        if (!isOK) {
          this.$message.error('上传图片只能是 JPG 格式!')
          return false
        }
      } else if (ss[1] === 'png') {
        isOK = file.type === 'image/png'
        if (!isOK) {
          this.$message.error('上传图片只能是 PNG 格式!')
          return false
        }
      } else {
        this.$message.error('图片的key后缀只能为jpg或png')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isOK && isLt2M
    },
    initFormData(bEdit, ID) {
      const objs = this.tableData
      if (!objs || !ID) {
        return
      }
      this.edit.isEdit = bEdit
      for (let i = 0; i < objs.length; i++) {
        if (objs[i].ID === ID) {
          Object.assign(this.edit.item, objs[i])
          if (this.edit.item.Type === 1) {
            this.edit.textContent = JSON.parse(this.edit.item.Content)
          } else {
            Object.assign(this.edit.pic, JSON.parse(this.edit.item.Content))
          }
          break
        }
      }
    },
    getPostData() {
      if (this.edit.item.Type === 1) {
        this.edit.item.Content = JSON.stringify(this.edit.textContent)
      } else {
        this.edit.item.Content = JSON.stringify(this.edit.pic)
      }

      return this.edit.item
    }
  }
}
</script>
