<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="ThirdpartiesConfig" :env-empty="false" :make-content="makeContent" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="16">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          @input="searchChange"
          @blur="search = search.trim()"
        />
      </el-col>
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
          <el-descriptions-item label="备注：">{{ remark }}</el-descriptions-item>
        </el-descriptions>
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
        max-height="700"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="80"
        />
        <el-table-column
          prop="Account"
          label="账号"
          width="120"
        />
        <el-table-column
          prop="Intro"
          label="描述"
          sortable="custom"
          width="200"
        />
        <el-table-column
          prop="Secret"
          label="密钥"
          sortable="custom"
          width="260"
        />
        <el-table-column
          prop="Ver"
          label="客户端子版本"
          width="100"
        />
        <!--        <el-table-column-->
        <!--          prop="GamefunVer"-->
        <!--          label="gamefun版本"-->
        <!--          width="100"-->
        <!--        />-->
        <el-table-column
          prop="GameUri"
          label="菲1客户端地址"
          width="200"
        />
        <el-table-column
          prop="TexasUri"
          label="德州客户端地址"
          width="200"
        />
        <el-table-column
          prop="LiveUri"
          label="直播客户端地址"
          width="200"
        />
        <el-table-column
          prop="Screen"
          label="横竖屏"
          width="90"
        >
          <template slot-scope="scope">
            {{ screenNames[scope.row.Screen] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="TestVer"
          label="客户端预发布子版本"
          width="100"
        />
        <el-table-column
          prop="TestUri"
          label="客户端预发布地址"
          width="100"
        />
        <el-table-column
          prop="TestUids"
          label="客户端测试用户uids"
          width="100"
        />

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
              v-if="scope.row.Status==6"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >预上
            </el-button>
            <el-button
              v-if="scope.row.Status==7"
              size="mini"
              type="success"
              @click="handleOn(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="warning"
              @click="handlePreOff(scope.row)"
            >预下
            </el-button>
            <el-button
              v-if="scope.row.Status==6"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==8"
              size="mini"
              type="danger"
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
            :page-sizes="[40, 80, 120, 160]"
            :page-size="pageNum"
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
        <el-form-item label="账号：" :required="true" prop="Account">
          <el-col :span="15">
            <el-input v-model="edit.item.Account" :disabled="isDisabled" @blur="edit.item.Account = edit.item.Account.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" :required="true" prop="Intro">
          <el-col :span="15">
            <el-input v-model="edit.item.Intro" @blur="edit.item.Intro = edit.item.Intro.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="菲1IP白名单(多个之间用英文逗号分隔)：" prop="Ip">
          <el-col :span="15">
            <el-input v-model="edit.item.Ip" @blur="edit.item.Ip = edit.item.Ip.trim()" />
          </el-col>
        </el-form-item>
        <!--        <el-form-item label="菲1gamefun版本：" :required="true" prop="Ver">-->
        <!--          <el-col :span="15">-->
        <!--            <el-input v-model="edit.item.GamefunVer" />-->
        <!--          </el-col>-->
        <!--          <el-col style="width: auto">-->
        <!--            <el-tooltip class="item" effect="dark" content="返回gamefun链接时，增加 gv 参数" placement="left-start">-->
        <!--              <i class="el-icon-info" />-->
        <!--            </el-tooltip>-->
        <!--          </el-col>-->
        <!--        </el-form-item>-->
        <el-form-item label="菲1客户端子版本：" :required="true" prop="Ver">
          <el-col :span="15">
            <el-input v-model="edit.item.Ver" @blur="edit.item.Ver = edit.item.Ver.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="菲1客户端uri：" :required="true" prop="GameUri">
          <el-col :span="15">
            <el-input v-model="edit.item.GameUri" @blur="edit.item.GameUri = edit.item.GameUri.trim()" />
          </el-col>
          <!--          <el-col style="width: auto">-->
          <!--            <el-tooltip class="item" effect="dark" content="版本号占位符： ${ver}" placement="left-start">-->
          <!--              <i class="el-icon-info" />-->
          <!--            </el-tooltip>-->
          <!--          </el-col>-->
        </el-form-item>
        <el-form-item label="菲1客户端预发布子版本：" :required="true" prop="TestVer">
          <el-col :span="15">
            <el-input v-model="edit.item.TestVer" @blur="edit.item.TestVer = edit.item.TestVer.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="菲1客户端预发布uri：" prop="TestUri">
          <el-col :span="15">
            <el-input v-model="edit.item.TestUri" @blur="edit.item.TestUri = edit.item.TestUri.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="菲1测试用户白名单（uid，多个用英文逗号分隔）：" prop="TestUids">
          <el-col :span="15">
            <el-input v-model="edit.item.TestUids" @blur="edit.item.TestUids = edit.item.TestUids.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="德州客户端uri：" prop="TexasUri">
          <el-col :span="15">
            <el-input v-model="edit.item.TexasUri" @blur="edit.item.TexasUri = edit.item.TexasUri.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="直播客户端uri：" prop="LiveUri">
          <el-col :span="15">
            <el-input v-model="edit.item.LiveUri" @blur="edit.item.LiveUri = edit.item.LiveUri.trim()" />
          </el-col>
        </el-form-item>
        <el-form-item label="横竖屏：" :required="true" prop="Screen">
          <el-col :span="15">
            <el-select v-model="edit.item.Screen" placeholder="请选择" required="true">
              <el-option v-for="item in screens" :key="item.value" :label="item.label" :value="item.value" />
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
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const filterMap = {}

function newItem() {
  return { Account: '', Intro: '', Ip: '', Ver: '', GamefunVer: '0', GameUri: '', Screen: 'vertical', TestUri: '', TestUids: '', TexasUri: '', LiveUri: '', TestVer: '' }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      pageNum: 40,
      tableData: [],
      statNames: { 0: '正常', 2: '上架', 6: '下架', 1: '关闭', 7: '预上架', 8: '预下架' },
      screenNames: { 'horizontal': '横屏', 'vertical': '竖屏' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'TableMoney', 'BetMoneyMax', 'TotalRecharge', 'MaxPayAmount']),
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      remark: '',
      isDisabled: false,
      screens: [
        { value: 'horizontal', label: '横屏' },
        { value: 'vertical', label: '竖屏' }
      ],
      rules: {
        account: [{ required: true, trigger: 'blur' }],
        intro: [{ required: true, trigger: 'blur' }],
        // ver: [{ required: true, trigger: 'blur' }],
        game_uri: [{ required: true, trigger: 'blur' }],
        screen: [{ required: true, trigger: ['blur', 'change', 'submit'] }]
      },

      AttrNames: {
        Account: '账号',
        Intro: '描述',
        Secret: '密钥',
        Ip: 'IP白名单',
        Ver: '客户端子版本',
        GamefunVer: '菲1gamefun版本',
        GameUri: '菲1客户端uri',
        Screen: '横竖屏',
        TestUri: '菲1客户端预发布uri',
        TestVer: '菲1客户端预发布子版本',
        TestUids: '菲1测试用户uid白名单',
        TexasUri: '德州客户端uri',
        LiveUri: '直播客户端uri'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.isDisabled = false
    this.getRemark()
    this.getList()
    this.clientDB.GetPage().SetPageNum(this.pageNum)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['ID', 'Account', 'Intro', 'Ver'])
      this.refreshShow()
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
      this.pageNum = val
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
      if (column.label === 'ID' || column.label === '账号' || column.label === '密钥' || column.columnKey === 'op') {
        return
      }
      this.initFormData(true, row.ID)
      this.edit.visible = true
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
    getList() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 20, filterMap, 'ID', 1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      if (this.getPostData().account === '') {
        this.$alert('账户不能为空')
        return false
      }
      if (this.getPostData().intro === '') {
        this.$alert('描述不能为空')
        return false
      }
      if (this.getPostData().game_uri === '') {
        this.$alert('客户端uri 不能为空')
        return false
      }
      if (this.getPostData().screen === '') {
        this.$alert('必须选择横竖屏')
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
          url: '/thirdparties/update/status',
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
        url: '/thirdparties/create',
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
        url: 'thirdparties/update',
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
    makeContent(key, addData, delData, editData) {
      let str = ''
      if (addData.length > 0) {
        for (const i in addData) {
          str += `\r\nappid:【${addData[i].Head.ID}】`
          for (const j in addData[i].Rows) {
            const rawValue = addData[i].Rows[j].newVal
            // 使用正则移除所有HTML标签i
            const decodedValue = this.decodeHtmlEntities(rawValue)
            const cleanValue = decodedValue.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\')
            const attrName = this.AttrNames[addData[i].Rows[j].key]
            if (attrName) {
              str += `\r\n${attrName}:【${cleanValue}】`
            }
          }
        }
      }
      if (delData.length > 0) {
        for (const i in delData) {
          if (str === '') {
            str += `appid:【${delData[i].Head.ID}】`
          } else {
            str += `\r\nappid:【${delData[i].Head.ID}】`
          }
          for (const j in delData[i].Rows) {
            const rawValue = delData[i].Rows[j].newVal
            // 使用正则移除所有HTML标签i
            const decodedValue = this.decodeHtmlEntities(rawValue)
            const cleanValue = decodedValue.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\')
            const attrName = this.AttrNames[delData[i].Rows[j].key]
            if (attrName) {
              str += `\r\n${attrName}:【${cleanValue}】`
            }
          }
        }
      }
      if (editData.length > 0) {
        for (const i in editData) {
          if (str === '') {
            str += `appid:【${editData[i].Head.ID}】`
          } else {
            str += `\r\nappid:【${editData[i].Head.ID}】`
          }
          for (const j in editData[i].Rows) {
            const rawValue = editData[i].Rows[j].newVal
            const decodedValue = this.decodeHtmlEntities(rawValue)
            const cleanValue = decodedValue.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\')
            const attrName = this.AttrNames[editData[i].Rows[j].key]
            if (attrName) {
              str += `\r\n${attrName}:【${cleanValue}】`
            }
          }
        }
      }
      if (str === '') {
        str = '没有修改!'
      }
      return str
    },
    decodeHtmlEntities(str) {
      const txt = document.createElement('textarea')
      txt.innerHTML = str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec)
      }).replace(/&#x([\da-fA-F]+);/g, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16))
      })
      return txt.value
    },
    getPostData() {
      this.trimData()
      const postData = this.libMoney.TransForStore(this.edit.item)
      console.log('postData', postData)
      return postData
    },
    trimData() {
      const itemArr = ['Account', 'Intro', 'Ip', 'Ver', 'GamefunVer', 'GameUri', 'Screen', 'TestUri', 'TestUids', 'TexasUri', 'LiveUri', 'TestVer']
      for (const i in itemArr) {
        this.edit.item[itemArr[i]] = this.edit.item[itemArr[i]].trim()
      }
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
      // URL格式验证
      if (this.edit.item.GameUri && !this.isValidUrl(this.edit.item.GameUri)) {
        this.$alert('菲1客户端uri格式不正确')
        return false
      }
      if (this.edit.item.TestUri && !this.isValidUrl(this.edit.item.TestUri)) {
        this.$alert('菲1客户端预发布uri格式不正确')
        return false
      }
      if (this.edit.item.TexasUri && !this.isValidUrl(this.edit.item.TexasUri)) {
        this.$alert('德州客户端uri格式不正确')
        return false
      }
      if (this.edit.item.LiveUri && !this.isValidUrl(this.edit.item.LiveUri)) {
        this.$alert('直播客户端uri格式不正确')
        return false
      }
      return true
    },
    isValidUrl(str) {
      try {
        const url = new URL(str)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch (_) {
        return false
      }
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
    getRemark() {
      if (process.env.NODE_ENV === 'production') {
        if (process.env.VUE_APP_PROJECT === 'ph') {
          this.remark = '1. 内部正式包，路径配置: 1000002->客户端 uri。 2. 内部预发布，路径配置: 1000002->客户端测试 uri'
        } else {
          this.remark = '1. 正式审核包，路径配置: 1000002->客户端 uri。 2. 正式 UAT 环境，路径配置: 1000002->客户端测试 uri'
        }
      } else {
        if (process.env.VUE_APP_PROJECT === 'ph') {
          this.remark = '开发包，路径配置: 1000002->客户端 uri。'
        } else {
          this.remark = '开发审核包，路径配置: 1000002->客户端 uri'
        }
      }
    }
  }
}
</script>
