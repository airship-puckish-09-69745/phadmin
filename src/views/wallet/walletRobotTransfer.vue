<template>
  <div class="app-container" style="padding: 10px">

    <el-row :gutter="10" style="margin-top: 30px">
    </el-row>
    <el-row style="padding-top: 5px">
      <el-form inline>
        <el-form-item label="选择日期：">
          <el-date-picker
            v-model="queryTime"
            type="date"
            placeholder="选择日期"
            @change="refresh"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="uid：">
          <el-input v-model.number="queryUid"   size="mini" />
        </el-form-item>
        <el-form-item >
          <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh">查询</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
            添加机器人
          </el-button>
        </el-form-item>
      </el-form>


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
          prop="RollinUid"
          label="加金币用户id"
          sortable="custom"
        />
        <el-table-column
          prop="RolloutUid"
          label="减少金币用户id"
        />
        <el-table-column
          prop="App"
          label="应用ID"
        />

        <el-table-column
          prop="RollinMoney"
          label="转账资产"
        >
          <template slot-scope="scope">
            {{ scope.row.RollinMoney }}
          </template>
        </el-table-column>

        <el-table-column
          prop="RollinUidMoney"
          label="加金币前用户资产"
        >
          <template slot-scope="scope">
            {{ scope.row.RollinUidMoney }}
          </template>
        </el-table-column>



        <el-table-column
          prop="RolloutUidMoney"
          label="减金币前用户资产"
        >
          <template slot-scope="scope">
            {{ scope.row.RolloutUidMoney }}
          </template>
        </el-table-column>


        <el-table-column
          prop="AfterRollinUidMoney"
          label="加金币后用户资产"
        >
          <template slot-scope="scope">
            {{ scope.row.AfterRollinUidMoney }}
          </template>
        </el-table-column>


        <el-table-column
          prop="AfterRolloutUidMoney"
          label="减金币后用户资产"
        >
          <template slot-scope="scope">
            {{ scope.row.AfterRolloutUidMoney }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          sortable="custom"
          width="90"
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
              v-if="scope.row.Status==0"
              type="primary"
              size="mini"
              @click="handleCopy(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.Status==0"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >执行
            </el-button>
            <el-button
              v-if="scope.row.Status==1"
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
        <el-form-item label="加金币用户id：" :required="true" prop="RollinUid">
          <el-col :span="15">
            <el-input v-model="edit.item.RollinUid" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="减少金币用户id：" :required="true" prop="RolloutUid">
          <el-col :span="15">
            <el-input v-model="edit.item.RolloutUid" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="转账资产：" :required="true" prop="RollinMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.RollinMoney" />
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
const filterMap = {
  currentTableMoney: 'all',
  allowTableMoney: 'all'
}
function newItem() {
  return { 'RolloutUid': 0, 'RollinMoney': 0, 'RollinUid': 0, 'TransferId': ''}
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
      Ratio: 900,
      statNames: {  0: '冻结', 1: '待执行', 2: '执行中',3: '成功',4:'异常'},
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
      subKey: 'tongits_ai_list_cfg',
      queryTime: new Date(),
      queryUid: 0
    }
  },

  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  created() {
    this.getList()
    this.isDisabled = false
    console.log(1)
  },
  methods: {
    filterUid(){
      console.log("=======")
      this.clientDB.FilterValueMap={"Uid":this.queryUid }
      this.tableData = this.clientDB.GetCurrentPageData();
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    refresh() {
      this.getList()
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
      this.changeStatus(ob, 1, '您确定要将机器人修改为正常使用状态吗？该记录将同步到外网。')
    },
    handlePreOff(ob) {
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
            transferId: ob.TransferId,
            status: status,
            Path: '/transferMoney/update/status'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            ob.status = status
            $this.clientDB.UpdateData2('TransferId', ob)
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
          Path: '/transferMoney/list',
          Page: 1,
          PageNum: 400,
          uid : _this.queryUid,
          startTime:parseInt(_this.queryTime.getTime() / 1000)

        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.totalData = objs
          for (let i = 0; i < objs.length; i++) {
            objs[i].RollinMoney /= 1000
            objs[i].RollinUidMoney /= 1000
            objs[i].RolloutUidMoney /= 1000
            objs[i].AfterRollinUidMoney /= 1000
            objs[i].AfterRolloutUidMoney /= 1000
          }
          objs.sort(function(a, b) {
            return a.currentTid - b.currentTid
          })
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
    refreshStat() {
      this.statItem = { money: 0, initMoney: 0 }
      for (let i = 0; i < this.clientDB.ShowData.length; i++) {
        if (this.clientDB.ShowData[i].status !== 0) {

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
      console.log("-------",ob.prop, ob.order)
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (row.status === 2) {
        return null
      }

      if (column.columnKey !== 'op') {
        this.initFormData(true, row.TransferId)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit

      if (ID) {
        const _data = this.getDataByTransferId(ID)
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
      this.initFormData(true, ob.TransferId)
      this.edit.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getRobotData() {
      this.edit.item.RollinMoney *= 1000
      return this.edit.item
    },
    getEditData() {
      const o = {
        TransferId: this.edit.item.TransferId,
        RollinMoney: -1,
      }
      this.edit.item.RollinMoney *= 1000
      const oldData = this.getDataByTransferId(this.edit.item.TransferId)
      if (oldData.RollinMoney !== this.edit.item.RollinMoney) {
        o.RollinMoney = this.edit.item.RollinMoney
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
    getDataByTransferId(transferId) {
      for (let i = 0; i < this.totalData.length; i++) {
        const data = this.totalData[i]
        if (data.TransferId === transferId) {
          return data
        }
      }
      return null
    },
    editSave(postData) {
      postData.Env = this.env
      postData.Path = '/transferMoney/update/item'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.RollinMoney /= 1000
          this.clientDB.UpdateData2('TransferId', this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    createSave(postData) {
      postData.Env = this.env
      postData.Path = '/transferMoney/add/user'
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
    // excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.info('您需要先上传excel文件')
        return
      }
      const $this = this
      request({
        url: '/slotsActConfig/import/excel',
        method: 'post',
        data: {
          Gid: this.edit.item.Gid,
          FileName: this.edit.fileName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data
          $this.edit.item.Acts = items
          const rets = []
          for (let i = 0; i < items.length; i++) {
            const rows = items[i]
            const newRow = []
            for (let j = 0; j < rows[0].length; j++) {
              const newCols = [j + 1]
              for (let r = 0; r < rows.length; r++) {
                newCols.push(rows[r][j])
              }
              newRow.push(newCols)
            }
            rets.push(newRow)
          }
          $this.edit.showActs = rets
          $this.edit.isNewImport = true
          Message.success('导入数据成功！')
        }
      })
    },
    handleSuccess(rsp, file, fileList) {
      this.edit.fileName = rsp.Data
      this.importData()
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
