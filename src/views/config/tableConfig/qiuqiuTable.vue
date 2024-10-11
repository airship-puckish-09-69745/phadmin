<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="QiuQiuTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-col :span="22" style="color:#BB0000;">
        <p><strong>注意事项：</strong></p>
        <p>1，底注不可直接修改，需要新添加新的场次配置，再去掉旧的场次配置；</p>
        <p>2，新加的场次需要保持在预上状态，重启游戏服务后才能上架；要去掉的场次需要先改为预下状态，延迟半天之后再下架；</p>
        <p>3，配置项【最大人数、桌子数量、是否练习场】修改后，需要重启游戏服务才能生效。</p>
        <p>4，小盲小于1都不对菲1开放，大于等于250的都不对Xworld开放。</p>
      </el-col>
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
        <el-table-column prop="IsPractice" label="练习场" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="Level" label="Level" sortable="custom" width="100" />
        <el-table-column prop="Ante" label="场次底注" sortable="custom" width="100" />
        <el-table-column prop="CarryLower" label="最小携带" sortable="custom" width="100" />
        <el-table-column prop="CarryUpper" label="最大携带" sortable="custom" width="100" />
        <el-table-column prop="ObjectCount" label="房间数量" sortable="custom" width="100" />
        <el-table-column prop="MaxPlayerCount" label="最大人数" sortable="custom" width="100" />


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
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Level：" :required="true" prop="item.Level">
              <el-select v-model="edit.item.Level" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="初级" :value="1" />
                <el-option label="中级" :value="2" />
                <el-option label="高级" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="11">-->
<!--            <el-form-item label="是否练习场：" :required="true">-->
<!--              <el-input v-model.number="edit.item.IsPractice" placeholder="请输入" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否需要前住：" :required="true"   :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.NeedAnte" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="场次底注：" :required="true" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.Ante" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最小携带：" :required="true" prop="item.ObjectCount" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大携带" :required="true" prop="item.ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="抽水比例：" :required="true" prop="item.FlowRate" :rules="dataRule(true,{type:'f',range:'0'})">
              <el-input v-model.number="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽3‰，则填写3" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最大玩牌人数：" :required="true" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.MaxPlayerCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房间数量：" :required="true" prop="item.AutoBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ObjectCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
<!--          <el-col :span="11">-->
<!--            <el-form-item label="最大玩牌人数：" :required="true" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'0'})">-->
<!--              <el-input v-model.number="edit.item.MaxPlayerCount" placeholder="请输入" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="11">
            <el-form-item label="操作时长：" :required="true" prop="item.AutoBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最大围观数：" :required="true" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.WatchTimesMax" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自动买入倍率（×前注）：" :required="true" prop="item.AutoBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.AutoBuyRatio" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="11">
            <el-form-item label="默认买入倍率（×前注）：" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'2'})">
              <el-input v-model.number="edit.item.RecommendBuyRatio" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="隐藏场次" :required="true" prop="item.RecommendBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.HideLevel" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
<!--            <el-form-item-->
<!--              label="最小玩牌金额："-->
<!--              :required="true"-->
<!--              prop="item.MinPlayMoney"-->
<!--              :rules="dataRule(true,{type:'n',range:'0'})"-->
<!--            >-->
<!--              <el-input v-model="edit.item.MinPlayMoney" placeholder="请输入" />-->
<!--            </el-form-item>-->
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
import SelectGoods from '@/components/SelectGoods'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function NewRandomRobotSetting() {
  return {
    RobotNumMax: 0,
    RobotTriggerMin: 0,
    RobotTriggerMax: 0,
    RobotPlayMin: 0,
    RobotPlayMax: 0,
    RobotMoneyMin: 0,
    RobotMoneyMax: 0,
    RobotStartTime: 0,
    RobotEndTime: 0
  }
}

function NewResidentRobotSetting() {
  return {
    RobotMoneyRatioMin: 0,
    RobotMoneyRatioMax: 0,
    RobotTablePlayers: ''
  }
}

function newItem() {
  return {
    Level:0,
    IsPractice:0,
    NeedAnte: 0,
    Ante: 0,
    CarryLower: 0,
    CarryUpper: 0,
    MaxPlayerCount: 0,
    ObjectCount: 0,
    FlowRate: 0,
    ActionSeconds: 0,
    WatchTimesMax: 0,
    AutoBuyRatio: 0,
    RecommendBuyRatio:0,
    HideLevel: 0,
    status: 0,
  }
}

export default {
  components: { Compare, Publish, SelectGoods, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper']),
      libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        RandomRobotSetting: NewRandomRobotSetting(),
        ResidentRobotSetting: NewResidentRobotSetting()
      },

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        SmallBlind: '小盲',
        ServiceFee: '服务费',
        MaxPlayerCount: '最大玩牌人数',
        NeedAnte: '强制前注',
        IsVip: 'VIP场',
        ObjectCount: '桌子数',
        FlowRate: '抽水率',
        FlowLower: '最低抽水大盲倍数',
        ActionSeconds: '操作时间',
        IsPro: '职业场',
        PurchaseSecondMax: '购买等待时长',
        WatchTimesMax: '最大围观局数',
        Level: '等级',
        IsPractice: '是否练习场',
        DefaultWinRate: '默认胜率',
        PlayingMul: '在玩人数倍数',
        PlayingRandMin: '在玩人数最小随机数',
        PlayingRandMax: '在玩人数最大随机数',
        LuckyLevelLimitMax: '限制幸运级别最大值',
        LuckyLevelLimitMoney: '限制幸福级别的最低资产',
        GoodsId: '金币不足推荐商品',
        FirstGoodsId: '金币不足推荐首充商品',
        BankruptGoodsId: '破产推荐商品',
        TotalRecharge: '总充值',
        MaxPayAmount: '单次最大充值额度',
        RecommendGid: '满足充值条件金币不足推荐商品',
        RecommendBankruptGid: '满足充值条件破产推荐商品',
        SinglePay: '单次充值大于',
        TotalPay: '总充值大于',
        HideLevel: '进入该场次后隐藏场次',
        AutoBuyRatio: '自动买入比例',
        RecommendBuyRatio: '推荐买入倍数(大盲)',
        MinPlayMoney: '最小玩牌金额',
        types: {
          RandomRobotSetting: 'jsonString',
          ResidentRobotSetting: 'jsonString'
        }
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
        url: '/qiuqiutable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const o of objs) {
            o.Ante /=1000
          }
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      let count = 0
      let goodsCheck = false
      for (const i in this.clientDB.TotalData) {
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
          count++
        }
        // 除了练习场，其它场次必须配置推荐商品
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 0 && this.clientDB.TotalData[i].GoodsId <= 0) {
          goodsCheck = true
        }
      }
      if (goodsCheck) {
        this.$alert('除了练习场，其它场次必须配置金币不足推荐商品')
        return false
      }
      /*
      if (count !== 1) {
        this.$alert('发布的配置项中，必须有且仅有一个练习场配置')
        return false
      }
      */
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
          url: '/qiuqiutable/update/status',
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
          try {
            this.edit.RandomRobotSetting = this.libMoneyRobot.TransForShow(JSON.parse(_data.RandomRobotSetting))
            this.edit.ResidentRobotSetting = JSON.parse(_data.ResidentRobotSetting)
          } catch (e) {
            this.edit.RandomRobotSetting = NewRandomRobotSetting()
            this.edit.ResidentRobotSetting = NewResidentRobotSetting()
          }
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
        url: '/qiuqiutable/create',
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
        url: 'qiuqiutable/update',
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
      postData.Ante =parseInt(postData.Ante*1000)
      return postData
    },
    checkData() {

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
