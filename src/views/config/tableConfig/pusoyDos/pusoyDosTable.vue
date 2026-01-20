<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="PusoyDosTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-col :span="22" style="color:#BB0000;">
        <p><strong>注意事项：</strong></p>
        <p>1，底注不可直接修改，需要新添加新的场次配置，再去掉旧的场次配置；</p>
        <p>2，新加的场次需要保持在预上状态，重启游戏服务后才能上架；要去掉的场次需要先改为预下状态，延迟半天之后再下架；</p>
        <p>3，配置项【最大人数、桌子数量】修改后，需要重启游戏服务才能生效。</p>
        <p>4，是否启用班车要和排队入桌配置菜单保持一致。</p>
      </el-col>
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
          prop="Level"
          label="Level"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="TableMoney"
          label="前注"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.TableMoney) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CarryLower"
          label="携带"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column
          prop="HideCarry"
          label="隐藏目标值"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.HideCarry || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ObjectCount"
          label="桌子数"
          width="100"
        />
        <el-table-column
          prop="MaxPlayerCount"
          label="座位数"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.MaxPlayerCount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="RemainAlarm"
          label="剩余警报"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.RemainAlarm }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PotScore"
          label="Pot配置"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.PotScore }}
          </template>
        </el-table-column>

        <el-table-column prop="AllocScheme" label="配桌方案" width="150" >
          <template slot-scope="scope"> {{ getAllocSchemeName(scope.row.AllocScheme ) }} </template>
          
        </el-table-column>

        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="150"
        >
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
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="底注：" :required="true" prop="item.TableMoney">
              <el-select v-model="edit.item.TableMoney" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="0.1" :value="0.1" />
                <el-option label="0.3" :value="0.3" />
                <el-option label="0.5" :value="0.5" />
                <el-option label="1" :value="1" />
                <el-option label="3" :value="3" />
                <el-option label="5" :value="5" />
                <el-option label="10" :value="10" />
                <el-option label="20" :value="20" />
                <el-option label="50" :value="50" />
                <el-option label="100" :value="100" />
                <el-option label="200" :value="200" />
                <el-option label="400" :value="400" />
                <el-option label="500" :value="500" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="隐藏目标值："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model="edit.item.HideCarry" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="如果有值，且玩家携带达到此值，则隐藏盖场次" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最小携带："
              :required="true"
              prop="item.CarryLower"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大携带(练习场初始资金)："
              :required="true"
              prop="item.CarryUpper"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <!--                <el-form-item-->
            <!--                  label="座位数："-->
            <!--                  :required="true"-->
            <!--                  prop="item.MaxPlayerCount"-->
            <!--                  :rules="dataRule(true,{type:'n',range:'0'})"-->
            <!--                >-->
            <!--                  <el-input v-model.number="edit.item.MaxPlayerCount" placeholder="座位数" />-->
            <!--                </el-form-item>-->
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="桌子数量："
              :required="true"
              prop="item.ObjectCount"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.ObjectCount" placeholder="桌子数量" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="修改需要重启服务器" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="操作时长(秒)："
              :required="true"
              prop="item.ActionSeconds"
              :rules="dataRule(true,{type:'n',range:'5'})"
            >
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="操作时长" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9">
            <el-form-item
              label="抽水费率："
              :required="true"
              prop="item.FlowRate"
              :rules="dataRule(true,{type:'f',range:'0'})"
            >
              <el-input v-model="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽3%，则填写0.03" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <game-level v-model="edit.item.Level" />
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最小玩牌金额："
              :required="true"
              prop="item.MinPlayMoney"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.MinPlayMoney" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="剩余警报："
              prop="item.WatchTimesMax"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.RemainAlarm" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="pot配置："
              prop="item.PotScore"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.PotScore" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="配桌方案：" :required="true">
              <el-radio-group v-model.number="edit.item.AllocScheme">
                <el-radio :label="0">常规</el-radio>
                <el-radio :label="1">班车</el-radio>
                <el-radio :label="2">信誉分</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

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
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'
import emojPrice from '@/views/config/baseConfig/emojPrice.vue'

const filterMap = {}

function newItem() {
  return {
    CarryLower: '',
    CarryUpper: '',
    HideCarry: '',
    TableMoney: '',
    JokerNum: 0,
    MaxPlayerCount: 4,
    ObjectCount: '',
    FlowRate: '',
    ActionSeconds: '',
    WatchTimesMax: 0,
    IsPractice: 0,
    Level: 1,

    PlayingMul: 0,
    PlayingRandMin: 0,
    PlayingRandMax: 0,
    DefaultWinRate: 50,
    LuckyLevelLimitMax: 0,
    LuckyLevelLimitMoney: 0,
    MinPlayMoney: 0,
    Anticheating: 0,
    RoomLevel: 0,
    RemainAlarm: 0,
    PotScore: 0,
    CreditScoreMode:0,
    PlayMode: 1,
    AllocScheme:0,
  }
}

export default {
  components: { Compare, Publish, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'HideCarry', 'TableMoney', 'TotalRecharge', 'MaxPayAmount', 'MinPlayMoney']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        HideCarry: '隐藏目标值',
        TableMoney: '桌子大小',
        JokerNum: '癞子数',
        MaxPlayerCount: '座位数',
        ObjectCount: '桌子数',
        FlowRate: '抽水率',
        ActionSeconds: '操作时间',
        WatchTimesMax: '最大围观局数',
        IsPractice: '是否练习场',
        DefaultWinRate: '默认胜率',
        LuckyLevelLimitMax: '限制幸运级别最大值',
        LuckyLevelLimitMoney: '限制幸福级别的最低资产',
        Level: '等级',
        Common: '机器人通用配置',
        Control: '机器人控制配置',
        MinPlayMoney: '最小玩牌金额',
        Anticheating: '是否防作弊',
        RoomLevel: '房间类型',
        AllocScheme:'配桌方案',
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
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
        url: '/pusoydostable/all',
        method: 'get',
        data: {
          PlayMode: 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('objs：', objs)
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
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
          url: '/pusoydostable/update/status',
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
      request({
        url: '/pusoydostable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'pusoydostable/update',
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
      const postData = this.libMoney.TransForStore(this.edit.item)
      return postData
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
        Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
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
    },
    getAllocSchemeName(plan){
      if(plan==1) {
        return "班车"
      }else if(plan==2){
        return "信誉分"
      }else{
        return "常规"
      }
    }
  },
}
</script>
