<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="ThirdpartyGamesConfig" :env-empty="false" :check="configCheck" :attr-names="AttrNames" />
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
        />
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
          width="50"
        />
        <el-table-column
          prop="GameID"
          label="给第三方的游戏id"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="Gid"
          label="本方实际游戏id"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="Name"
          label="游戏名"
          width="200"
        />
        <el-table-column
          prop="CategoryID"
          label="游戏类别"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            {{ getCategory(scope.row.CategoryID) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Description"
          label="描述"
          width="200"
        />
        <el-table-column
          prop="Scene"
          label="进入该游戏的key"
          width="200"
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
          prop="ShowDatacenter"
          label="显示到数据中心"
          width="70"
        >
          <template slot-scope="scope">
            {{ showNames[scope.row.ShowDatacenter] }}
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
            <el-button
              v-if="scope.row.ShowDatacenter==0"
              size="mini"
              type="danger"
              @click="handShowDatacenter(scope.row)"
            >显示
            </el-button>
            <el-button
              v-if="scope.row.ShowDatacenter==1"
              size="mini"
              type="success"
              @click="handHideShowDatacenter(scope.row)"
            >隐藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[100, 150, 200, 250]"
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
        <el-form-item label="给第三方的游戏id：" :required="true" prop="GameID">
          <el-col :span="15">
            <el-input v-model="edit.item.GameID" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="本方游戏实际id：" :required="true" prop="Gid">
          <el-col :span="15">
            <el-input v-model="edit.item.Gid" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="游戏名：" :required="true" prop="Name">
          <el-col :span="15">
            <el-input v-model="edit.item.Name" />
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" prop="Description">
          <el-col :span="15">
            <el-input v-model="edit.item.Description" />
          </el-col>
        </el-form-item>
        <el-form-item label="游戏类别：" :required="true" prop="CategoryID">
          <el-col :span="15">
            <el-select v-model="edit.item.CategoryID" placeholder="请选择" required="true">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="进入游戏的key：" :required="true" prop="Scene">
          <el-col :span="15">
            <el-input v-model="edit.item.Scene" />
          </el-col>
        </el-form-item>
        <el-form-item label="显示到数据中心：" :required="true" prop="Scene">
          <el-col :span="15">
            <el-switch
              v-model="edit.item.ShowDatacenter"
              active-text="显示"
              :active-value="1"
              inactive-text="不显示"
              inactive-value="0"
              type="number"
            />
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
  return { GameID: 0, Name: '', Description: '', CategoryID: 0, Gid: 0, Scene: '', ShowDatacenter: 0 }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      statNames: { 0: '正常', 2: '上架', 6: '下架', 1: '关闭', 7: '预上架', 8: '预下架' },
      showNames: { 0: '不显示', 1: '显示' },
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
      isDisabled: false,
      categories: [
        { id: 1, name: '老虎机' },
        { id: 2, name: '纸牌' },
        { id: 3, name: '街机' }
      ],
      rules: {
        GameID: [{ required: true, trigger: 'blur' }],
        Name: [{ required: true, trigger: 'blur' }],
        CategoryID: [{ required: true, trigger: 'blur' }],
        Gid: [{ required: true, trigger: ['blur', 'change', 'submit'] }],
        Scene: [{ required: true, trigger: ['blur', 'change', 'submit'] }]
      },
      AttrNames: {
        GameID: '给第三方的游戏id',
        Name: '游戏名',
        CategoryID: '类别id',
        Gid: '本方实际游戏id',
        Scene: '进入游戏的key',
        ShowDatacenter: '展示到数据中心'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.isDisabled = false
    this.getList()
  },
  methods: {
    getCategory(n) {
      for (var v of this.categories) {
        if (n === v.id) {
          return v.name
        }
      }
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['GameID', 'Gid', 'Name', 'Scene'])
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
    getList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 100, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      // this.$refs['edit.item'].validate(valid => {})
      // if (this.getPostData().GameID <= 0) {
      //   this.$alert('请输入游戏id')
      //   return false
      // }
      // if (this.getPostData().Name === '') {
      //   this.$alert('游戏名不能为空')
      //   return false
      // }
      // if (this.getPostData().CategoryID <= 0) {
      //   this.$alert('请选择游戏类别')
      //   return false
      // }
      // if (this.getPostData().Scene === '') {
      //   this.$alert('请输入进入游戏场景的key')
      //   return false
      // }
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
    handShowDatacenter(ob) {
      this.changeShowDatacenter(ob.ID, 1, '您确定要将记录展示到数据中心吗？')
    },
    handHideShowDatacenter(ob) {
      this.changeShowDatacenter(ob.ID, 0, '您确定要将记录在数据中心隐藏吗？')
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
          url: '/thirdpartygames/update/status',
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
    changeShowDatacenter(id, show, msg) {
      const $this = this
      this.edit.item.ShowDatacenter = show
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/thirdpartygames/update/show/datacenter',
          method: 'post',
          data: {
            ID: id,
            ShowDatacenter: this.edit.item.ShowDatacenter
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录展示成功！')
            $this.clientDB.UpdateData({ ID: id, ShowDatacenter: show })
            this.refreshShow()
            this.$refs.compare.SetNewVal(this.edit.item)
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
        url: '/thirdpartygames/create',
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
        url: 'thirdpartygames/update',
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
      return this.libMoney.TransForStore(this.edit.item)
    },
    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getPostData().GameID <= 0) {
        this.$alert('请输入游戏id')
        return false
      }
      if (this.getPostData().Name === '') {
        this.$alert('游戏名不能为空')
        return false
      }
      if (this.getPostData().CategoryID <= 0) {
        this.$alert('请选择游戏类别')
        return false
      }
      if (this.getPostData().Scene === '') {
        this.$alert('请输入进入游戏场景的key')
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
    }
  }
}
</script>
