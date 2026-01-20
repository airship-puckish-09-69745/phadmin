<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row v-if="isAppExt === false">
      <publishV2 primary-key="ID" key-id="PusoyDosTableConfig" :app-id="1" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row v-if="isAppExt === true">
      <publishV2 primary-key="ID" key-id="PusoyDosTableConfig" :app-id="2" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
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
     <!-- 使用重构的表格组件 -->
    <pusoy-dos-table-page
      ref="configTable"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :ColumnCfg.sync="columnCfg"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
      @status-changed="onStatusChanged"
      @copy="handleCopy"
      @pre-on="handlePreOn"
      @on="handleOn"
      @pre-off="handlePreOff"
      @offline="handleOffline"
      @delete="handleDelete"
      @create="handleCreate"
    />
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
       <el-row v-if="isAppExt === true">
         <el-form-item
              label="应用："
              :required="true"
              prop="item.AppId"
            >
               <el-select v-model="edit.item.AppId" :disabled="edit.isEdit"   filterable placeholder="请选择应用id">
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="`${item.label}-${item.value}`"
                :value="item.value"
               
              />
            </el-select>
            </el-form-item>
        </el-row>

        <el-row>
          <table-money-select
             :TableMoney.sync="edit.item.TableMoney"
             :IsEdit.sync="edit.isEdit"
             :TableMoneyCfg.sync="tableMoneyCfg"
             :HideCarry.sync="edit.item.HideCarry"
             />
        </el-row>

  

        <el-row>
          <table-carry-input
            :CarryLower.sync="edit.item.CarryLower"
            :CarryUpper.sync="edit.item.CarryUpper"
          />
        </el-row>
        <table-server-required 
          :ObjectCount.sync="edit.item.ObjectCount"
          :ActionSeconds.sync="edit.item.ActionSeconds"
          :FlowRate.sync="edit.item.FlowRate"
          :GameLevel.sync="edit.item.Level"
          :LevelCfg.sync="levelCfg"
          :TableHideChannel.sync="edit.item.TableHideChannel"
        />

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
import { $libDate, $libShow, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import PublishV2 from '@/components/Publish/indexV2.vue'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'
import emojPrice from '@/views/config/baseConfig/emojPrice.vue'
import TableMoneySelect from '../tableCommon/tableMoneySelect.vue'
import TableCarryInput from '../tableCommon/tableCarryInput.vue'
import TableServerRequired from '../tableCommon/tableServerRequired.vue'
import PusoyDosTablePage from './pusoyDosTablePage.vue'
import { APPID_OPTIONS } from '@/utils/options'
const filterMap = {}

function newItem() {
  return {
    AppId: 0,
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
    TableHideChannel:'',
  }
}

export default {
  name: 'PusoyDosTable',
  props: {
    tableType: {
      type: String,
      default: 'common',
      validator: value => ['common', 'different'].includes(value)
    }
  },
  components: { Compare, PublishV2, GameLevel, MoneyInput,TableMoneySelect,TableCarryInput,TableServerRequired,PusoyDosTablePage },
  data() {
    return {
      APPID_OPTIONS,
      tableMoneyCfg: [
        { 'label': '0.1', 'value': 0.1 },
        { 'label': '0.3', 'value': 0.3 },
        { 'label': '0.5', 'value': 0.5 },
        { 'label': '1', 'value': 1 },
        { 'label': '3', 'value': 3 },
        { 'label': '5', 'value': 5 },
        { 'label': '10', 'value': 10 },
        { 'label': '20', 'value': 20 },
        { 'label': '50', 'value': 50 },
        { 'label': '100', 'value': 100 },
        { 'label': '200', 'value': 200 },
        { 'label': '400', 'value': 400 },
        { 'label': '500', 'value': 500 }
      ],
      levelCfg:[
         { 'label': '新手', 'value':1 },
         { 'label': '初级', 'value':'2'},
         { 'label': '中级', 'value':'3'},
         { 'label': '高级', 'value':'4'},
         { 'label': '精英', 'value':'5'},
         { 'label': '大师', 'value':'6'},
      ],
      columnCfg:{
        "ID": "ID",
        "Level": "等级",
        "TableMoney": "底注",
        "Carry": "携带",
        "ObjectCount": "桌子数量",
        "HideCarry": "隐藏目标值",
        "MaxPlayerCount": "座位数",
        "PotScore": "pot配置",
        "Status": "状态",
        "AllocScheme":"配桌方案",
        "operation": "操作",
      },
      columnAppCfg:{
        "ID": "ID",
        "AppId": "应用",
        "Level": "等级",
        "TableMoney": "底注",
        "Carry": "携带",
        "ObjectCount": "桌子数量",
        "HideCarry": "隐藏目标值",
        "MaxPlayerCount": "座位数",
        "PotScore": "pot配置",
        "Status": "状态",
        "AllocScheme":"配桌方案",
        "operation": "操作",
      },

      currentPage: 1,
      pageSize: 10,
      total: 0,
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      
      // clientDB 已迁移到子组件
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'HideCarry', 'TableMoney', 'TotalRecharge', 'MaxPayAmount', 'MinPlayMoney']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      isAppExt: false,

      AttrNames: {
        AppId:'应用',
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
    console.log('当前组件类型:', this.tableType) // 这里就能知道是 'common' 还是 'different'
    this.initialize();
  },


  methods: {
    initialize() {
        this.env = store.getters.env || this.env
      console.log("initialize ",this.tableType)
      if (this.tableType === 'common') {
         this.isAppExt = false
      } else if (this.tableType === 'different') {
          this.isAppExt = true
          this.columnCfg = this.columnAppCfg
      }
      this.getList()

    },

    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleFilter() {
      if (this.$refs.configTable && this.$refs.configTable.filterData) {
        this.$refs.configTable.filterData()
      }
      this.refreshData()
    },
    // 分页处理
    refreshShow() {
      if (this.$refs.configTable && this.$refs.configTable.getCurrentPageData) {
        // parent no longer stores tableData; just sync total
        this.total = this.$refs.configTable.getTotal()
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      if (this.$refs.configTable && this.$refs.configTable.setPageSize) {
        this.$refs.configTable.setPageSize(val)
      }
      this.refreshData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.$refs.configTable && this.$refs.configTable.setPageNo) {
        this.$refs.configTable.setPageNo(val)
      }
      this.refreshData()
    },

    sortChange(ob) {
      if (this.$refs.configTable && this.$refs.configTable.sortByProp) {
        this.$refs.configTable.sortByProp(ob.prop, ob.order)
      }
      this.refreshData()
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
      let url = '/pusoydostable/all'
      if (this.isAppExt) {
        url = '/pusoydostableappext/all'
      }
      console.log("==========url", url)
      request({
        url: url,
        method: 'get',
        data: {
          PlayMode: 1
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          // 将处理后的数据传给子组件，由子组件管理 clientDB
          const processed = this.libMoney.TransForShow(objs)
          this.$nextTick(() => {
            if (this.$refs.configTable && this.$refs.configTable.setClientData) {
              this.$refs.configTable.setClientData(processed, this.pageSize, filterMap, 'ID', -1)
              // 重置分页到第一页
              this.handlePageChange(1)
              // 更新 total
              this.total = this.$refs.configTable.getTotal()
            }
          })
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

    // 子组件 changeStatus 成功后触发的事件，用于更新本地 clientDB
    onStatusChanged(payload) {
      if (payload && payload.ID != null) {
        if (this.$refs.configTable && this.$refs.configTable.updateDataByPayload) {
          this.$refs.configTable.updateDataByPayload({ ID: payload.ID, Status: payload.Status })
        }
        this.refreshData()
      }
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.$refs.configTable?.getDataByID(ID)
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
      let url = '/pusoydostable/create'
      if (this.isAppExt) {
        url = '/pusoydostableappext/create'
      }
      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          // 通知子组件添加数据
          if (this.$refs.configTable && this.$refs.configTable.addData) {
            this.$refs.configTable.addData(this.edit.item)
          }
          // 更新父级 total
          this.total = this.$refs.configTable.getTotal()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      let url = '/pusoydostable/update'
      if (this.isAppExt) {
        url = '/pusoydostableappext/update'
      }
      //console.log("TableHideChannel",this.edit.item.TableHideChannel)

      request({
        url: url,
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
         // console.log("this.$refs.configTable.updateData",this.$refs.configTable.updateData)
          if (this.$refs.configTable && this.$refs.configTable.updateData) {
            this.$refs.configTable.updateData(this.edit.item)
          }
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      return postData
    },
   async  checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
        Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
        return false
      }
      if (this.isAppExt && this.edit.item.AppId == 0) {
         Message.error('请选择正确的应用！')
        return false
      }

      try {
        // 异步等待配置检查结果
         const configResult = await this.getOtherConfig(this.edit.item.TableMoney*1000)
        //console.log("configResult",configResult)
        if (this.isAppExt) {
          if (configResult === undefined) {
              Message.error('基座没有对应的底注且已经上架的配置！')
              return false 
          }
          if (configResult.ObjectCount != this.edit.item.ObjectCount) {
             Message.error('应用配置桌子数量需要和基座配桌一样！')
              return false 
          }
        } else {
          if (this.edit.item.Status != 2 && configResult != undefined && configResult.Status == 2 && this.edit.item.Level == configResult.Level) {
             Message.error('有对应的应用差异配置，需要下架应用差异配置，才能继续操作！')
              return false 
          }
        }
        return true
      } catch (error) {
       // console.error('配置检查失败:', error)
        Message.error('配置检查失败，请稍后重试')
        return false
      }
    },
    async save() {
      let isValild = await this.checkData()
      if (!isValild) return
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
    },
    refreshData() {
      // 请求子组件刷新并同步 total
      if (this.$refs.configTable) {
        this.total = this.$refs.configTable.getTotal()
      }
    },
    // 表格行点击
    handleRowClick(id) {
      this.initFormData(true, id)
      this.edit.visible = true
    },
    // 排序
    handleSortChange({ prop, order }) {
      if (this.$refs.configTable && this.$refs.configTable.sortByProp) {
        this.$refs.configTable.sortByProp(prop, order)
      }
      this.refreshData()
    },
    // 分页处理
    handlePageSizeChange(size) {
      this.pageSize = size
      if (this.$refs.configTable && this.$refs.configTable.setPageSize) {
        this.$refs.configTable.setPageSize(size)
      }
      this.refreshData()
    },

    handlePageChange(page) {
      this.currentPage = page
      if (this.$refs.configTable && this.$refs.configTable.setPageNo) {
        this.$refs.configTable.setPageNo(page)
      }
      this.refreshData()
    },
    changeStatus(id, status, msg,callback) {
      let url = '/pusoydostable/update/status'
      if (this.isAppExt) {
        url = '/pusoydostableappext/update/status'
      }

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: url,
          method: 'post',
          data: { ID: id, status: status }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            if (this.$refs.configTable && this.$refs.configTable.updateData) {
              this.$refs.configTable.updateData({ ID: id, Status: status })
            }

            callback && callback(id, status);
          }
        })
      }).catch(() => {
        // 取消
      })
    },

    getOtherConfig(TableMoney) {
      return new Promise((resolve, reject) => {
        let url = '/pusoydostableappext/all'
        if (this.isAppExt) {
            url = '/pusoydostable/all'
        }
        request({
          url: url,
          method: 'get',
          data: {
            PlayMode: 1
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            // console.log("TableMoney",TableMoney)
            //  console.log("objs", objs)
            for (let i = 0; i < objs.length; i++) {
              if (objs[i].TableMoney == TableMoney && objs[i].Status == 2) {
               
                resolve(objs[i])  // 将数据通过 Promise resolve
                return
              }
            }
            resolve(undefined)  // 未找到对应数据
          } else {
            reject(new Error('请求失败'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
}
</script>
