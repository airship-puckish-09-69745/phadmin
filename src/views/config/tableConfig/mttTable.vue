<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="MttTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="70" />
        <el-table-column prop="RaceName" label="名称" width="70" />
        <el-table-column prop="RaceBeginTime" label="开始时间" width="150">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceBeginTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceShowTime" label="显示时间" width="150">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceShowTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="SignupFee" label="报名费用" width="90" />
        <el-table-column prop="ServiceFee" label="服务费" width="70" />
        <el-table-column prop="LastModify" label="最近修改" width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCopy(scope.row)">复制</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" type="success" @click="handlePreOn(scope.row)">预上</el-button>
            <el-button v-if="scope.row.Status==7" size="mini" type="success" @click="handleOn(scope.row)">上架</el-button>
            <el-button v-if="scope.row.Status==2" size="mini" type="warning" @click="handlePreOff(scope.row)">预下</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==8" size="mini" type="danger" @click="handleOffline(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="比赛名称:" :required="true" prop="item.RaceName">
              <el-input v-model="edit.item.RaceName" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开始时间:" :required="true" prop="item.RaceBeginTime">
              <el-date-picker v-model="edit.item.RaceBeginTime" value-format="timestamp" type="datetime" placeholder="开始时间" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="显示时间:" :required="true" prop="item.RaceShowTime">
              <el-date-picker v-model="edit.item.RaceShowTime" value-format="timestamp" type="datetime" placeholder="显示时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="报名费用:" :required="true" prop="item.SignupFee" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.SignupFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务费:" :required="true" prop="item.ServiceFee" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ServiceFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="截止报名级别:" :required="true" prop="item.EndSignupClass" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.EndSignupClass" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最低开赛人数:" :required="true" prop="item.MinPeopleNum" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.MinPeopleNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="初始筹码:" :required="true" prop="item.InitChip" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.InitChip" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="操作时间(秒):" :required="true" prop="item.OperateSeconds" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.OperateSeconds" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="每桌人数上限:" :required="true" prop="item.PerTableMaxNum" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PerTableMaxNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否支持rebuy:" :required="true">
              <el-radio-group v-model.number="edit.item.IsSupportRebuy">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="可rebuy级别限制:" :required="true" prop="item.RebuyClassLimit" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyClassLimit" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="rebuy后筹码数量:" :required="true" prop="item.RebuyChipNum" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyChipNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="rebuy次数上限:" :required="true" prop="item.RebuyMaxTimes" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyMaxTimes" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row style="margin-top: 10px;">
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
// import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function newItem() {
  return {
    RaceName: '',
    RaceBeginTime: 0,
    RaceShowTime: 0,
    SignupFee: 0,
    ServiceFee: 0,
    EndSignupClass: 0,
    MinPeopleNum: 0,
    InitChip: 0,
    OperateSeconds: 0,
    PerTableMaxNum: 0,
    IsSupportRebuy: 1,
    RebuyClassLimit: 0,
    RebuyChipNum: 0,
    RebuyMaxTimes: 0,
    LastModify: 0,
    ModifyUser: '',
    Status: 0
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      // libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'SmallBlind', 'MinBuyIn', 'MaxBuyIn', 'DelayOpTimeCostMoney', 'ShowPublicCardCostMoney']),
      // libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      AttrNames: {
        RaceName: '比赛名称',
        RaceBeginTime: '开始时间',
        RaceShowTime: '显示时间',
        SignupFee: '报名费用',
        ServiceFee: '服务费',
        EndSignupClass: '截止报名级别',
        MinPeopleNum: '最低开赛人数',
        InitChip: '初始筹码',
        OperateSeconds: '操作时间(秒)',
        PerTableMaxNum: '每桌人数上限',
        IsSupportRebuy: '是否支持rebuy,0否1是',
        RebuyClassLimit: '可rebuy级别限制',
        RebuyChipNum: 'rebuy后筹码数量',
        RebuyMaxTimes: 'rebuy次数上限'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
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
    formatTime2(ts) {
      return $libDate.FormateSecondStr(ts / 1000, 2)
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
      console.log('refreshShow tableData: ', this.tableData)
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
        url: '/mtttable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const o in objs) {
            objs[o].RaceBeginTime *= 1000
            objs[o].RaceShowTime *= 1000
          }
          // this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
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
          url: '/mtttable/update/status',
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
      console.log('createSave', postData)
      request({
        url: '/mtttable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.edit.item.LastModify = response.Data.LastModify
          this.edit.item.ModifyUser = response.Data.ModifyUser
          this.edit.item.Status = response.Data.Status
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      console.log('editSave postData: ', postData)
      request({
        url: 'mtttable/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('editSave this.edit.item: ', this.edit.item)
          // this.edit.item.RaceBeginTime *= 1000
          // this.edit.item.RaceShowTime *= 1000
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      // const postData = this.libMoney.TransForStore(this.edit.item)
      // postData.PrefixChip *= 100 // 放大100倍
      const postData = JSON.parse(JSON.stringify(this.edit.item))
      postData.RaceBeginTime /= 1000
      postData.RaceShowTime /= 1000
      return postData
    },
    checkData() {
      // if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
      //   Message.warning('下限不能大于上限，请检查数值正确性！')
      //   return false
      // }
      // if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
      //   Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
      //   return false
      // }
      // if (this.edit.item.MinBuyIn > this.edit.item.MaxBuyIn) {
      //   Message.error('【最低买入】必须小于等于【最大买入】，请检查数值正确性！')
      //   return false
      // }
      // TODO 完善
      return true
    },
    save() {
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
    handlerChangeMin(e) {
      // if (parseInt(e) < 2 || parseInt(e) > this.edit.item.TableMaxPlayerNum) {
      //   Message.error('数据错误')
      //   return
      // }
      // if (this.edit.FeeLimit.length <= 1) {
      //   if (parseInt(e) !== 2) {
      //     Message.error('数据错误')
      //     return
      //   }
      // } else {
      //   if (parseInt(e) !== this.edit.FeeLimit[this.edit.FeeLimit.length - 2].MaxPlayerNum + 1) {
      //     Message.error('数据错误')
      //     return
      //   }
      // }
    }
  }
}
</script>
