<template>
  <div class="app-container" style="padding: 10px">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :offset="3" :span="16">
        <el-button size="mini" type="primary" @click="setData">保存</el-button>
        <el-form ref="form" :model="item" label-position="left" style="margin-top: 30px">
          <el-row>
            <el-col>
              <el-form-item label="下注额度(值用 , 连接如 200,100,50,20,10,5,1,11)" :required="true">
                <el-col>
                  <el-input v-model="betMoneyList" size="mini" :required="true" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          prop="uid"
          label="用户id"
          sortable="custom"
          width="90"
        />
        <el-table-column
          prop="nick"
          label="昵称"
          width="90"
        />
        <el-table-column
          prop="account"
          label="账号标识"
          width="90"
        />
        <el-table-column
          prop="app"
          label="应用ID"
          width="90"
        />
        <el-table-column
          prop="channel"
          label="渠道"
          width="90"
        />
        <el-table-column
          prop="money"
          label="当前资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.money/1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="initMoney"
          label="初始资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.initMoney/1000 }}
          </template>
        </el-table-column>
        <el-table-column
          label="输赢"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2)/1000 }}
            </span>
            <span v-else style="color:green">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2)/1000 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="输赢比"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
              {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
            </span>
            <span v-else style="color:green">
              {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="robotId"
          label="机器人id"
          width="90"
        />
        <el-table-column
          prop="currentGame"
          label="当前所在的游戏"
          width="120"
        />
        <el-table-column
          prop="currentTableMoney"
          label="当前所在的场次"
          width="120"
        />
        <el-table-column
          prop="currentTid"
          label="当前所在的桌子"
          width="120"
        />
        <el-table-column
          prop="status"
          label="状态"
          sortable="custom"
          width="90"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              type="primary"
              size="mini"
              @click="handleCopy(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.status==0"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >解冻
            </el-button>
            <el-button
              v-if="scope.row.status==1"
              size="mini"
              type="warning"
              @click="handlePreOff(scope.row)"
            >冻结
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
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label="用户id：" :required="true" prop="uid">
          <el-col :span="15">
            <el-input v-model="edit.item.uid" :disabled="true" />
          </el-col>
        </el-form-item>
        <el-form-item label="昵称：" :required="true" prop="nick">
          <el-col :span="15">
            <el-input v-model="edit.item.nick" />
          </el-col>
        </el-form-item>
        <el-form-item label="头像：" prop="icon">
          <el-col :span="15">
            <el-input v-model="edit.item.icon" />
          </el-col>
        </el-form-item>
        <el-form-item label="账号标识：" :required="true" prop="account">
          <el-col :span="15">
            <el-input v-model="edit.item.account" />
          </el-col>
        </el-form-item>
        <el-form-item label="应用ID：" prop="app">
          <el-col :span="15">
            <el-input v-model="edit.item.app" />
          </el-col>
        </el-form-item>
        <el-form-item label="渠道：" prop="channel">
          <el-col :span="15">
            <el-input v-model="edit.item.channel" />
          </el-col>
        </el-form-item>
        <el-form-item label="当前资产：" :required="true" prop="money">
          <el-col :span="15">
            <el-input v-model="edit.item.money" />
          </el-col>
        </el-form-item>
        <el-form-item label="初始资产：" :required="true" prop="initMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.initMoney" />
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
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
const filterMap = {}
function newItem() {
  return { 'nick': '', 'money': 0, 'initMoney': 0, 'channel': '', 'account': '', 'icon': '', 'app': '' }
}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        TableMoneyList: []
      }, // 奖励
      betMoneyList: '200,100',
      statNames: { 0: '冻结', 1: '正常', 2: '游戏中' },
      libShow: $libShow,
      showData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      tableData: [],
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      isDisabled: false,
      form: {
      },
      txt: '',
      subKey: 'tongits_ai_list_cfg'
    }
  },
  created() {
    this.getData()
    this.getList()
    this.isDisabled = false
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)
            $this.showData = []
            for (const i in this.item.TableMoneyList) {
              this.item.TableMoneyList[i] /= 1000
            }
            this.betMoneyList = this.item.TableMoneyList ? this.item.TableMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    getPostData() {
      const ret = {}
      const items = this.betMoneyList.split(',')
      this.item.TableMoneyList = []
      for (const o in items) {
        this.item.TableMoneyList.push(parseInt(items[o]) * 1000)
      }
      Object.assign(ret, this.item)
      return ret
    },
    setData() {
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    handlePreOn(ob) {
      console.log(ob.uid)
      this.changeStatus(ob, 1, '您确定要将机器人修改为正常使用状态吗？该记录将同步到外网。')
    },
    handlePreOff(ob) {
      console.log(ob.uid)
      this.changeStatus(ob, 0, '您确定要将机器人修改为冻结状态吗？该记录将同步到外网。')
    },
    changeStatus(ob, status, msg) {
      console.log(status)
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: $this.env,
            uid: ob.uid,
            status: status,
            Path: '/tongitsrobotlist/update/status'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            ob.status = status
            $this.clientDB.UpdateData2('uid', ob)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getList() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/tongitsrobotlist/list',
          Page: 1,
          PageNum: 200
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.totalData = objs
          this.clientDB = new ClientTableData(objs, 20, filterMap, 'status', -1)
          this.handleCurrentChange(1)
        }
        // loading.close()
      })
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
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.uid)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.getDataByUid(ID)
        if (_data) {
          _data.money /= 1000
          _data.initMoney /= 1000
          Object.assign(this.edit.item, _data)
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(true, ob.uid)
      this.edit.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getRobotData() {
      this.edit.item.money *= 1000
      this.edit.item.initMoney *= 1000
      return this.edit.item
    },
    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getRobotData().uid <= 0) {
        this.$alert('用户id不能为空')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      if (this.edit.isEdit) {
        this.editSave(this.getRobotData())
      } else {
        this.createSave(this.getRobotData())
      }
      this.edit.visible = false
    },
    getDataByUid(uid) {
      for (let i = 0; i < this.totalData.length; i++) {
        const data = this.totalData[i]
        if (data.uid === uid) {
          return data
        }
      }
      return null
    },
    editSave(postData) {
      postData.Env = this.env
      postData.Path = '/tongitsrobotlist/update/item'
      request({
        url: '/dataProxy/info',
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
    }
  }
}
</script>
