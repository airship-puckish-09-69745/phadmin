<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="PayChannelConfig" :env-empty="true" :attr-names="AttrNames" :head-attrs="['ID','Name']" />
    </el-row>

    <el-row style="padding-top: 5px">
      <el-col :span="4">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2" :offset="16">
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
          width="70"
        />
        <el-table-column
          prop="payChannel"
          label="渠道ID"
          width="180"
        />
        <el-table-column
          prop="payChannelName"
          label="渠道名称"
          width="180"
        />

        <el-table-column
          prop="payMethod"
          label="支付方式"
        >
          <template slot-scope="scope">
            <el-tag v-for="v in scope.row.payMethod" style="margin-left: 5px">{{ v.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="payFee"
          label="支付费率"
        />

        <el-table-column
          prop="withdrawMethod"
          label="提现方式"
        >
          <template slot-scope="scope">
            <el-tag v-for="v in scope.row.withdrawMethod" style="margin-left: 5px">{{ v.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bindSwitch"
          label="修改人"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.bindSwitch ? "绑定" : "不绑定" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="withdrawFee"
          label="提现费率"
        />
        <el-table-column
          prop="minAmount"
          label="最小支付额"
        />
        <el-table-column
          prop="maxAmount"
          label="最大支付额"
        />
        <el-table-column
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.lastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="modifyUser"
          label="修改人"
          width="100"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
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
          width="250"
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
              v-if="scope.row.status != 3"
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除
            </el-button>
            <el-button
              v-if="scope.row.status == 3"
              type="success"
              size="mini"
              icon="el-icon-upload"
              @click="handleOnline(scope.row)"
            >上线
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
      <el-form label-width="150px">
        <el-form-item label="渠道ID：">
          <el-col :span="11">
            <el-input v-model="edit.item.payChannel" type="text" size="mini" placeholder="支付渠道ID,不清楚问后端开发" />
          </el-col>
        </el-form-item>
        <el-form-item label="渠道名称：">
          <el-input v-model="edit.item.payChannelName" size="mini" type="text" placeholder="支付渠道名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogAdd(1)">添加支付方式</el-button>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-table
            :data="edit.item['payMethod']"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="标题"
              width="100"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" placeholder="标题" />
              </template>
            </el-table-column>
            <el-table-column
              prop="desc"
              label="描述"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.desc" size="mini" placeholder="描述" />
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="值"
              width="120px"
            >
              <template slot="header">
                <span>值</span>
                <el-tooltip class="item" effect="dark" content="下单接口传的值，不清楚问后端开发" placement="top">
                  <i class="el-icon-info" />
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.value" size="mini" @change="payMethodChanged(scope.row)">
                  <el-option v-for="o in payMethods" :value="o.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="内部编码"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.code" size="mini" placeholder="描述" />
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="操作"
              width="70"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="dialogDel(1, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="支付费率：">
          <el-col :span="16">
            <el-input v-model="edit.item.payFee" size="mini" placeholder="用文字描述" />
          </el-col>
        </el-form-item>
        <el-form-item label="支付最小额度：">
          <el-col :span="16">
            <el-input v-model="edit.item.minAmount" size="mini" placeholder="支持的最小额度" />
          </el-col>
        </el-form-item>
        <el-form-item label="支付最大额度：">
          <el-col :span="16">
            <el-input v-model="edit.item.maxAmount" size="mini" placeholder="支持的最大额度" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogAdd(2)">添加提现方式</el-button>
        </el-form-item>
        <el-form-item label="提现方式：">
          <el-table
            :data="edit.item['withdrawMethod']"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="名称"
              width="180"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.name" size="mini" @change="withdrawMethodChanged(scope.row)">
                  <el-option v-for="o in withdrawMethods" :value="o.name" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="值"
            />

            <el-table-column
              prop="value"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="dialogDel(2, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="提现费率：">
          <el-col :span="16">
            <el-input v-model="edit.item.withdrawFee" size="mini" placeholder="用文字描述" />
          </el-col>
        </el-form-item>

        <el-form-item label="支付是否绑定信息：">
          <el-col :span="16">
            <el-switch
              v-model="edit.item.bindSwitchBool"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="绑定"
              inactive-text="不绑定"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="提现异常提醒：">
          <lang-text v-model="edit.item.withdrawTips" />
        </el-form-item>
        <el-form-item label="内部通道：">
          <el-col :span="16">
            <el-input v-model="edit.item.payInternalCode" size="mini" placeholder="0" />
            支付渠道支持则填写,如无则填0
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="hasEditPerm" type="primary" @click="save">保存</el-button>
      </span>
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
import LangText from '@/components/LangText'

const filterMap = {
  'status': { 1: '可切换', 2: 'SDK支付', 3: '废弃' }
}

function newItem() {
  return {
    payChannel: 3, // 支付渠道id WinPay
    payChannelName: 'WinPay',
    platform: '',
    payFee: '',
    withdrawFee: '',
    status: 1,
    maxAmount: 20000, // 最大额度
    minAmount: 0, // 最小额度
    payMethod: [
      {
        name: 'Paytm', 		// 标题
        desc: 'UPI/Wallet', // 描述
        value: 'Paytm', 	// 下单传值，技术
        code: 0 	// 通道编码
      }
    ],
    withdrawMethod: [
      {
        name: 'BANK', 	// 名称
        value: 100 // 值
      },
      {
        name: 'UPI', 	// 名称
        value: 103 // 值
      },
      {
        name: 'VC',
        value: 200
      }
    ],
    withdrawTips: '{"hi":"","en":""}',
    bindSwitch: 0, // 是否绑定手机号
    bindSwitchBool: false,
    payInternalCode: 0 // 支付内部通道
  }
}

export default {
  components: { Compare, Publish, LangText },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      platform: '',
      env: 'test',

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      hasEditPerm: false,
      payMethods: [{
        name: 'Paytm',
        desc: 'UPI/Wallet',
        value: 'Paytm'
      },
      {
        desc: 'UPI/Paytm',
        name: 'UPI',
        value: 'UPI'
      },
      {
        desc: 'Virtual currency',
        name: 'Binance',
        value: 'VC'
      }],
      withdrawMethods: [
        {
          name: 'BANK', 	// 名称
          value: 100 // 值
        },
        {
          name: 'UPI', 	// 名称
          value: 103 // 值
        },
        {
          name: 'VC',
          value: 200
        }],

      AttrNames: {
        payChannel: '支付渠道ID',
        payChannelName: '支付渠道',
        payMethod: '支付方式',
        withdrawMethod: '提现方式',
        withdrawTips: '提现异常提醒'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.platform = this.$route.meta.platform
    const pers = store.getters.pers
    this.hasEditPerm = (pers['SWITCH_PAY_METHOD'] & 2) > 0
    this.getList()
    console.log(1)
  },
  methods: {
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
        url: '/payconfig/all',
        method: 'get',
        data: {
          Type: 1,
          Platform: this.platform
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          objs.sort(function(a, b) {
            return a.status - b.status
          })
          for (const i in objs) {
            objs[i]['bindSwitchBool'] = parseInt(objs[i]['bindSwitch']) === 1
            objs[i]['maxAmount'] /= 1000
            objs[i]['minAmount'] /= 1000
          }
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'id', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    payMethodChanged(ob) {
      for (const i in this.payMethods) {
        if (this.payMethods[i].value === ob.value) {
          for (const n in this.edit.item['payMethod']) {
            if (this.edit.item['payMethod'][n].value == ob.value) {
              Object.assign(this.edit.item['payMethod'][n], this.payMethods[i])
            }
          }
        }
      }
    },
    withdrawMethodChanged(ob) {
      for (const i in this.withdrawMethods) {
        if (this.withdrawMethods[i].name === ob.name) {
          for (const n in this.edit.item['withdrawMethod']) {
            if (this.edit.item['withdrawMethod'][n].name == ob.name) {
              Object.assign(this.edit.item['withdrawMethod'][n], this.withdrawMethods[i])
            }
          }
        }
      }
    },
    del(idx) {
      this.tableData.splice(idx, 1)
      this.setData()
    },
    dialogDel(type, index) {
      switch (type) {
        case 1:
          this.edit.item['payMethod'].splice(index, 1)
          break
        case 2:
          this.edit.item['withdrawMethod'].splice(index, 1)
          break
      }
    },
    dialogAdd(type) {
      switch (type) {
        case 1:
          this.edit.item['payMethod'].push({
            name: '',
            desc: '',
            value: ''
          })
          break
        case 2:
          this.edit.item['withdrawMethod'].push({
            name: '',
            value: 0
          })
          break
      }
    },
    getEditTitle() {
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
        url: '/payconfig/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'payconfig/update',
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
    handleDel(row) {
      const $this = this
      this.$confirm('确定要删除此渠道： ' + row.payChannelName + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: 'payconfig/update/status',
          method: 'post',
          data: { ID: row.ID, status: 3 }
        }).then(response => {
          if (response.RetCode === 0) {
            $this.clientDB.UpdateData({ ID: row.ID, status: 3 })
            $this.refreshShow()
            Message.success('删除成功！')
          }
        })
      })
    },
    handleOnline(row) {
      const $this = this
      this.$confirm('确定要重新上线此渠道： ' + row.payChannelName + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: 'payconfig/update/status',
          method: 'post',
          data: { ID: row.ID, status: 1 }
        }).then(response => {
          if (response.RetCode === 0) {
            $this.clientDB.UpdateData({ ID: row.ID, status: 1 })
            $this.refreshShow()
            Message.success('上线成功！')
          }
        })
      })
    },
    save() {
      const ret = JSON.parse(JSON.stringify(this.edit.item))
      ret.bindSwitch = this.edit.item.bindSwitchBool ? 1 : 0
      ret.platform = this.platform
      ret.payMethodJson = JSON.stringify(this.edit.item.payMethod)
      ret.withdrawMethodJson = JSON.stringify(this.edit.item.withdrawMethod)
      ret.maxAmount *= 1000
      ret.minAmount *= 1000
      if (!ret.payInternalCode) {
        ret.payInternalCode = 0
      }
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(ret)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
          } else {
            $this.editSave(ret)
          }
        })
      } else {
        this.createSave(ret)
      }
      this.edit.visible = false
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
