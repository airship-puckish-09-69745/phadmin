<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="configKey" :check="configCheck" :env-empty="true" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable
          width="150"
        />
        <el-table-column
          prop="Level"
          label="智慧"
          sortable
          width="100"
        />
        <el-table-column
          prop="Name"
          label="名称"
          sortable
          width="150"
        />
        <el-table-column
          prop="Rate"
          label="分配比例"
          column-key="Rate"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" size="mini" @blur="updateRate(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="100"
        />
        <el-table-column
          prop="ModifyTime"
          label="修改时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.ModifyTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑/查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="getEditTitle()"
      width="90%"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="100px" size="small">
        <el-form-item label="AI名称：">
          <el-col :span="10">
            <el-input v-model="edit.item.Name" size="mini" />
          </el-col>
          <el-col :span="4" :offset="6">

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
              :file-list="edit.fileList"
            >
              <el-button size="small" type="primary">导入数据</el-button>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-tabs type="border-card">
          <el-tab-pane key="tab1" label="翻牌前">
            <table class="table table-border table-bordered table-bg table-striped">
              <thead>
                <tr class="text-c">
                  <th width="70" rowspan="2">序号</th>
                  <th width="100" colspan="2">手牌分值</th>
                  <th width="50" rowspan="2">最终赢</th>
                  <th width="120" colspan="4">看牌/加注</th>
                  <th width="120" colspan="5">跟注/加注</th>
                </tr>
                <tr>
                  <th>下限</th>
                  <th>上限</th>
                  <th>看牌(%)</th>
                  <th>加注(%)</th>
                  <th>加注基准 <el-tooltip class="item" effect="dark" content="加注额 = 大盲注 * 基准" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip>
                  </th>
                  <th>ALL(%)</th>
                  <th>跟注(%)</th>
                  <th>跟注上限
                    <el-tooltip class="item" effect="dark" content="大盲的N倍" placement="right">
                      <i class="el-icon-question" style="font-size: 16px" />
                    </el-tooltip>
                  </th>
                  <th>加注(%)</th>
                  <th>加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th>ALL(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="obj,index in edit.preFlops" class="text-c">
                  <td>
                    <el-col span="8">{{ index }}</el-col>
                  </td>
                  <td>
                    <el-input v-model.number="obj.Min" size="mini" @blur="checkInt(obj.Min,0,169)" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Max" size="mini" @blur="checkInt(obj.Max,0,169)" />
                  </td>

                  <td>
                    <el-switch
                      v-model="obj.Win"
                      active-color="#13ce66"
                      size="mini"
                    />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Chk" size="mini" @blur="checkInt(obj.Chk,0,100)" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R1" size="mini" @blur="checkInt(obj.R1,0,100)" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV1" size="mini" @blur="checkFloat(obj.RV1,0,4)" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Call" size="mini" @blur="checkInt(obj.Call,0,100)" />
                  </td>
                  <td>
                    <el-input v-model="obj.CV" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R2" size="mini" @blur="checkInt(obj.R2,0,100)" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV2" size="mini" @blur="checkFloat(obj.RV2,0,4)" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A2" size="mini" />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane key="tab2" label="翻牌">
            <table class="table table-border table-bordered table-bg table-striped">
              <thead>
                <tr class="text-c">
                  <th width="50" rowspan="2">序号</th>
                  <th colspan="2">牌型</th>
                  <th width="50" rowspan="2">输赢</th>
                  <th colspan="4">看牌/加注</th>
                  <th colspan="5">跟注/加注</th>
                </tr>
                <tr>
                  <th width="100">牌型</th>
                  <th width="100">第一<el-tooltip class="item" effect="dark" content="当前手牌是否最大" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">看牌(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                  <th width="100">跟注(%)</th>
                  <th width="100">跟注上限(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="obj,index in edit.flops" class="text-c">
                  <td>
                    {{ index }}
                  </td>
                  <td style="padding: 0px">
                    <el-select v-model.number="obj.Type" size="mini">
                      <el-option label="同花顺" :value="9" />
                      <el-option label="金刚" :value="8" />
                      <el-option label="葫芦" :value="7" />
                      <el-option label="同花" :value="6" />
                      <el-option label="顺子" :value="5" />
                      <el-option label="三张" :value="4" />
                      <el-option label="两对" :value="3" />
                      <el-option label="对子" :value="2" />
                      <el-option label="高牌" :value="1" />
                      <el-option label="皇家同花顺" :value="10" />
                      <el-option label="抽花抽顺" :value="11" />
                    </el-select>
                  </td>
                  <td style="padding: 1px">
                    <el-select v-model.number="obj.Rank" size="mini">
                      <el-option label="是" :value="1" />
                      <el-option label="否" :value="0" />
                      <el-option label="无" :value="2" />
                    </el-select>
                  </td>
                  <td>
                    <el-switch
                      v-model="obj.Win"
                      active-color="#13ce66"
                      size="mini"
                    />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Chk" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Call" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.CV" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A2" size="mini" />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane key="tab3" label="转牌">
            <table class="table table-border table-bordered table-bg table-striped">
              <thead>
                <tr class="text-c">
                  <th width="50" rowspan="2">序号</th>
                  <th colspan="2">牌型</th>
                  <th width="100" rowspan="2">输赢</th>
                  <th colspan="4">看牌/加注</th>
                  <th colspan="5">跟注/加注</th>
                </tr>
                <tr>
                  <th width="100">牌型</th>
                  <th width="100">第一<el-tooltip class="item" effect="dark" content="当前手牌是否最大" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">看牌(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                  <th width="100">跟注(%)</th>
                  <th width="100">跟注上限(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="obj,index in edit.turns" class="text-c">
                  <td>
                    {{ index }}
                  </td>

                  <td style="padding: 0px">
                    <el-select v-model.number="obj.Type" size="mini">
                      <el-option label="同花顺" :value="9" />
                      <el-option label="金刚" :value="8" />
                      <el-option label="葫芦" :value="7" />
                      <el-option label="同花" :value="6" />
                      <el-option label="顺子" :value="5" />
                      <el-option label="三张" :value="4" />
                      <el-option label="两对" :value="3" />
                      <el-option label="对子" :value="2" />
                      <el-option label="高牌" :value="1" />
                      <el-option label="皇家同花顺" :value="10" />
                      <el-option label="抽花抽顺" :value="11" />
                    </el-select>
                  </td>
                  <td style="padding: 1px">
                    <el-select v-model.number="obj.Rank" size="mini">
                      <el-option label="是" :value="1" />
                      <el-option label="否" :value="0" />
                      <el-option label="无" :value="2" />
                    </el-select>
                  </td>
                  <td>
                    <el-switch
                      v-model="obj.Win"
                      active-color="#13ce66"
                      size="mini"
                    />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Chk" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Call" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.CV" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A2" size="mini" />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane key="tab4" label="河牌">
            <table class="table table-border table-bordered table-bg table-striped">
              <thead>
                <tr class="text-c">
                  <th width="50" rowspan="2">序号</th>
                  <th colspan="2">牌型</th>
                  <th width="100" rowspan="2">输赢</th>
                  <th colspan="4">看牌/加注</th>
                  <th colspan="5">跟注/加注</th>
                </tr>
                <tr>
                  <th width="100">牌型</th>
                  <th width="100">第一<el-tooltip class="item" effect="dark" content="当前手牌是否最大" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">看牌(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                  <th width="100">跟注(%)</th>
                  <th width="100">跟注上限(%)</th>
                  <th width="100">加注(%)</th>
                  <th width="100">加注基准<el-tooltip class="item" effect="dark" content="加注额 = 底注 * 基准 [若结果不足一个大盲，按一个大盲加注]" placement="right">
                    <i class="el-icon-question" style="font-size: 16px" />
                  </el-tooltip></th>
                  <th width="100">ALL(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="obj,index in edit.rivers" class="text-c">
                  <td>
                    {{ index }}
                  </td>

                  <td style="padding: 0px">
                    <el-select v-model.number="obj.Type" size="mini">
                      <el-option label="同花顺" :value="9" />
                      <el-option label="金刚" :value="8" />
                      <el-option label="葫芦" :value="7" />
                      <el-option label="同花" :value="6" />
                      <el-option label="顺子" :value="5" />
                      <el-option label="三张" :value="4" />
                      <el-option label="两对" :value="3" />
                      <el-option label="对子" :value="2" />
                      <el-option label="高牌" :value="1" />
                      <el-option label="皇家同花顺" :value="10" />
                      <el-option label="抽花抽顺" :value="11" />
                    </el-select>
                  </td>
                  <td style="padding: 1px">
                    <el-select v-model.number="obj.Rank" size="mini">
                      <el-option label="是" :value="1" />
                      <el-option label="否" :value="0" />
                      <el-option label="无" :value="2" />
                    </el-select>
                  </td>
                  <td>
                    <el-switch
                      v-model="obj.Win"
                      active-color="#13ce66"
                      size="mini"
                    />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Chk" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A1" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.Call" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.CV" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.R2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model="obj.RV2" size="mini" />
                  </td>
                  <td>
                    <el-input v-model.number="obj.A2" size="mini" />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
        <el-row>
          <el-col :offset="16">
          <el-button type="primary" size="mini" @click="save()">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}
.table-bg thead th {
  background-color: #f5fafe;
}
.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}
.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}
.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.table th {
  font-weight: bold;
}
</style>

<script>
import { $libDate, $libShow, $libType, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const filterMap = {}

function newPreFlop() {
  return { Win: true, Min: 1, Max: 1, Chk: 0, R1: 0, RV1: 1, A1: 0, Call: 0, CV: 0, R2: 0, RV2: 0, A2: 0, TCards: null }
}

function newStep() {
  return { Win: true, Type: 1, Rank: 2, Chk: 0, R1: 0, RV1: 1, A1: 0, Call: 0, CV: 0, R2: 0, RV2: 0, A2: 0, TCards: null }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      libShow: $libShow,
      env: 'test',
      game: 15,
      configKey: 'texasAIConfig',

      edit: {
        visible: false,
        fileName: '',
        fileList: [],
        editItem: '',
        isEdit: false,
        item: {
          Name: '',
          ID: 0,
          Game: this.$route.meta.gid
        },
        preFlops: [newPreFlop(), newPreFlop(), newPreFlop()],
        flops: [newStep(), newStep(), newStep()],
        turns: [newStep(), newStep(), newStep()],
        rivers: [newStep(), newStep(), newStep()]
      }

    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    getTestBtnText(ob){ //测试用例按钮文字
      if(ob){
        return "修改"
      }else{
        return "新建"
      }
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
    handleEdit(ob) {
      this.initFormData(true, ob.ID)
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = newObject()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/aitype/all',
        method: 'get',
        data: {
          game: this.game
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
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
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    configCheck() {
      let rate = 0
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        rate += ob.Rate
      }
      if (rate > 100) {
        this.$alert('所有AI配置的分配占比不能超过100%，当前为：' + rate)
        return false
      }
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      const $this = this
      this.edit.fileList = []
      this.edit.isEdit = bEdit
      if (ID) {
        request({
          url: '/aitype/one',
          method: 'get',
          data: {
            ID: ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const ob = response.Data
            Object.assign($this.edit.item, ob)
            this.edit.preFlops = JSON.parse(ob.PreFlopStr)
            this.edit.flops = JSON.parse(ob.FlopStr)
            this.edit.turns = JSON.parse(ob.TurnStr)
            this.edit.rivers = JSON.parse(ob.RiverStr)
          }
        })
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/aitype/create',
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
    updateRate(ob) {
      request({
        url: 'aitype/update/rate',
        method: 'post',
        data: {
          ID: ob.ID,
          Rate: ob.Rate
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData({ ID: ob.ID, Rate: ob.Rate })
          this.refreshShow()
          Message.success('修改成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'aitype/update',
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
      this.edit.item.PreFlop = JSON.stringify(this.edit.preFlops)
      this.edit.item.Flop = JSON.stringify(this.edit.flops)
      this.edit.item.Turn = JSON.stringify(this.edit.turns)
      this.edit.item.River = JSON.stringify(this.edit.rivers)
      return this.edit.item
    },
    save() {
      const $this = this
      if (this.edit.isEdit) {
        $this.editSave($this.getPostData())
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },
    AddRule() {
      this.edit.see.Rules.push({ Small: newObject(), Big: newObject() })
    },
    delRule(idx) {
      const $this = this
      this.$confirm('确定要删除此条配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $this.edit.see.Rules.splice(idx, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    sortData(a, b) {
      if (a.Win !== b.Win) {
        return a.Win ? 1 : 0
      } else {
        return b.Type - a.Type
      }
    },
    // excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.info('您需要先上传excel文件')
        return
      }

      request({
        url: '/aitype/import/excel',
        method: 'post',
        data: {
          Game: this.edit.item.Game,
          FileName: this.edit.fileName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const ob = response.Data
          this.edit.preFlops = JSON.parse(ob.PreFlopStr)
          this.edit.flops = JSON.parse(ob.FlopStr)
          this.edit.turns = JSON.parse(ob.TurnStr)
          this.edit.rivers = JSON.parse(ob.RiverStr)
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
    },

    checkInt(value, min, max) {
      if (!$libType.IsInt(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的整数')
        return false
      }
    },

    checkFloat(value, min, max) {
      if (!$libType.IsFloat(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的数字')
        return false
      }
    },

    checkStep() {
      const types = [600, 500, 400, 300, 201, 213, 212, 211, 210, 209, 208, 207, 206, 205, 204, 203, 202, 101, 113, 112, 100]
      const winMap = {}
      var loseMap = {}
      for (const i in types) {
        winMap[types[i]] = false
        loseMap[types[i]] = false
      }

      const objs = this.edit.see.Rules
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]

        // 检查各概率数字是否为整数
        const intNames = ['Call', 'Raise', 'Compare']
        for (let j = 0; j < intNames.length; j++) {
          var val = obj.Small[intNames[j]]
          if (!$libType.IsInt(val) || val < 0 || val > 100) {
            Message.error('概率数值必须为0-100之间的整数！')
            return false
          }
          val = obj.Big[intNames[j]]
          if (!$libType.IsInt(val) || val < 0 || val > 100) {
            Message.error('概率数值必须为0-100之间的整数！')
            return false
          }
        }

        // 概率小于100
        if (obj.Small.Call + obj.Small.Raise + obj.Small.Compare > 100) {
          Message.error('类型：' + objs.Type + '概率总和大于100！')
          return false
        }

        // 判断各牌型及输赢是否覆盖完整
        if (obj.Win) {
          if (winMap[obj.Type]) {
            Message.error('类型(赢）:' + obj.Type + '存在重复配置')
            return false
          }
          winMap[obj.Type] = true
        } else {
          if (loseMap[obj.Type]) {
            Message.error('类型（输）:' + obj.Type + '存在重复配置')
            return false
          }
          loseMap[obj.Type] = true
        }
      }
      for (var o in winMap) {
        if (!winMap[o]) {
          Message.error('类型（赢）:' + o + '没有对应配置')
          return false
        }
        if (!loseMap[o]) {
          Message.error('类型（输）:' + o + '没有对应配置')
          return false
        }
      }

      return true
    }
  }
}
</script>
