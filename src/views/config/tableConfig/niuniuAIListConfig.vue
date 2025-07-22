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
    <el-row style="padding-top: 5px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
        添加机器人
      </el-button>
      <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!--   <el-col :span="2" :offset="1">
      <el-upload
        class="upload-demo"
        :action="actionURL"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :with-credentials="true"
        :before-remove="beforeRemove"
        :limit="1"
        :on-exceed="handleExceed"
      >
        <el-button size="small" type="primary">导入数据</el-button>
      </el-upload>
      </el-col> -->
    </el-row>
    <div style="padding-top: 10px">
      <el-col :span="16">
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总成本：">{{ formatNumber(statItem.initMoney) }}</el-descriptions-item>
          <el-descriptions-item label="当前金额："> {{ formatNumber(statItem.money) }}</el-descriptions-item>
          <el-descriptions-item label="输赢：">{{ formatNumber((statItem.money - statItem.initMoney)) }}</el-descriptions-item>
          <el-descriptions-item label="比例：">
            <span v-if="statItem.initMoney==0">0</span>
            <el-span v-else>  {{ formatNumber((statItem.money - statItem.initMoney)*100/statItem.initMoney) }}%</el-span>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

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
          width="120"
        />
        <el-table-column
          prop="account"
          label="账号标识"
          width="120"
        />
        <el-table-column
          prop="app"
          label="应用ID"
          width="90"
        />
        <el-table-column
          prop="channel"
          label="渠道"
          width="80"
        />
        <el-table-column
          prop="money"
          label="当前资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.money }}
          </template>
        </el-table-column>
        <el-table-column
          prop="initMoney"
          label="初始资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.initMoney }}
          </template>
        </el-table-column>
        <el-table-column
          label="输赢"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2) }}
            </span>
            <span v-else style="color:green">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2) }}
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
          prop="level"
          label="等级"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level==5" style="color:green">
              需要赢
            </span>
            <span v-else style="color:red">
              陪玩
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="allowTableMoney"
          label="允许出现场次"
          width="120"
        >

          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['allowTableMoney']" size="mini" @change="handleFilter">
              <el-option label="允许出现场次" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['allowTableMoney']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('allowTableMoney', scope.row.allowTableMoney) }}
          </template>
        </el-table-column>

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
        </el-table-column>   <el-table-column
          prop="status"
          label="状态"
          sortable="custom"
          width="90"
        >
          <template slot-scope="scope">
            {{ walletNames[scope.row.WalletType] }}
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

            <RobotRecycleBtn :row="scope.row" :gid="49" />
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
            <el-input v-model="edit.item.uid" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="账号标识：" :required="true" prop="account">
          <el-col :span="15">
            <el-input v-model="edit.item.account" :disabled="isDisabled" />
          </el-col>
        </el-form-item>

        <el-form-item label="应用ID：" prop="app">
          <el-col :span="15">
            <el-input v-model="edit.item.app" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="渠道：" prop="channel">
          <el-col :span="15">
            <el-input v-model="edit.item.channel" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="当前资产：" :required="true" prop="money">
          <el-col :span="15">
            <el-input v-model="edit.item.money" :disabled="isDisabled" />
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

        <el-form-item label="初始资产：" :required="true" prop="initMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.initMoney" />
          </el-col>
        </el-form-item>

        <el-form-item label="允许出现的场次：" :required="true" prop="allowTableMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.allowTableMoney" />
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
import RobotRecycleBtn from '@/components/RobotRecycleBtn'

const filterMap = {
  currentTableMoney: 'all',
  allowTableMoney: 'all'
}
function newItem() {
  return { 'nick': '', 'money': 0, 'initMoney': 0, 'channel': '', 'account': '', 'icon': '', 'app': '', 'allowTableMoney': 0 }
}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, RobotRecycleBtn },
  data() {
    return {
      item: {
        TableMoneyList: []
      }, // 奖励
      betMoneyList: '200,100',
      Ratio: 900,
      statNames: { 0: '冻结', 1: '正常', 2: '游戏中' },
      walletNames: { 0: '转账钱包', 1: '单一钱包' },
      libShow: $libShow,
      showData: [],
      clientDB: new ClientTableData([], 1, {}),
      tableData: [],
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      isDisabled: false,
      form: {
      },
      statItem: { money: 0, initMoney: 0 },
      txt: '',
      subKey: 'niuniu_ai_list_cfg'
    }
  },

  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
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
    refresh() {
      this.getList()
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
            Path: '/niuniurobotlist/update/status'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            ob.status = status
            $this.clientDB.UpdateData2('uid', ob)
          } else {
            Message.error('修改记录状态失败！')
            $this.refresh()
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
          Path: '/niuniurobotlist/list',
          Page: 1,
          PageNum: 400
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.totalData = objs

          for (let i = 0; i < objs.length; i++) {
            objs[i].money /= 1000
            objs[i].initMoney /= 1000
            objs[i].currentTableMoney /= 1000
            objs[i].allowTableMoney /= 1000
          }
          objs.sort(function(a, b) {
            return a.currentTid - b.currentTid
          })
          this.clientDB = new ClientTableData(objs, 20, filterMap, 'status', -1)
          this.handleCurrentChange(1)
          _this.statItem = { money: 0, initMoney: 0 }
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].status != 0) {
              _this.statItem.money += objs[i].money
              _this.statItem.initMoney += objs[i].initMoney
            }
          }
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
    refreshStat() {
      this.statItem = { money: 0, initMoney: 0 }
      for (let i = 0; i < this.clientDB.ShowData.length; i++) {
        if (this.clientDB.ShowData[i].status !== 0) {
          this.statItem.money += this.clientDB.ShowData[i].money
          this.statItem.initMoney += this.clientDB.ShowData[i].initMoney
        }
      }
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter(k, v) {
      console.log('k=>', k, 'v==>', v)
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
      this.refreshStat()
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
      if (row.status === 2) {
        return null
      }
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
          Object.assign(this.edit.item, _data)
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
      this.edit.item.allowTableMoney *= 1000
      return this.edit.item
    },
    getEditData() {
      const o = {
        uid: this.edit.item.uid,
        initMoney: -1,
        allowTableMoney: -1,
        money: -1
      }
      this.edit.item.money *= 1000
      this.edit.item.initMoney *= 1000
      this.edit.item.allowTableMoney *= 1000
      const oldData = this.getDataByUid(this.edit.item.uid)
      if (oldData.nick != this.edit.item.nick) {
        o.nick = this.edit.item.nick
      }
      if (oldData.icon != this.edit.item.icon) {
        o.icon = this.edit.item.icon
      }
      if (oldData.initMoney != this.edit.item.initMoney) {
        o.initMoney = this.edit.item.initMoney
      }
      if (oldData.allowTableMoney != this.edit.item.allowTableMoney) {
        o.allowTableMoney = this.edit.item.allowTableMoney
      }
      return o
    },
    /*    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getRobotData().uid <= 0) {
        this.$alert('用户id不能为空')
        return false
      }
      return true
    },*/
    save() {
      // if (!this.checkData()) return
      if (this.edit.isEdit) {
        this.editSave(this.getEditData())
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
      postData.Path = '/niuniurobotlist/update/item'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.money /= 1000
          this.edit.item.initMoney /= 1000
          this.edit.item.allowTableMoney /= 1000
          this.clientDB.UpdateData2('uid', this.edit.item)

          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    createSave(postData) {
      postData.Env = this.env
      postData.Path = '/niuniurobotlist/add/user'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          this.getList()
          Message.success('添加成功！')
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
