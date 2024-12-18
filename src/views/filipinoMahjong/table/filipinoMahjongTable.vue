<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="FilipinoMahjongTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
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
        <el-table-column prop="Level" label="级别" sortable="custom" width="100" />
        <el-table-column prop="TableMoney" label="底分" width="200" />
        <!--
        <el-table-column prop="TableFee" label="台费(千分比)" sortable="custom" width="200" />
        -->
        <el-table-column prop="CarryLower" label="最小携带" sortable="custom" width="200" />
        <el-table-column prop="CarryUpper" label="最大携带" sortable="custom" width="200" />
        <el-table-column prop="LastModify" label="最近修改" width="160">
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
            <el-form-item label="底分：" :required="true" prop="item.TableMoney" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableMoney" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="台费为1倍底分" placement="right-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="人数：" :required="true" prop="item.TableMaxPlayerNum" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableMaxPlayerNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--
          <el-col :span="9">
            <el-form-item label="台费(千分比)：" :required="true" prop="item.TableFee" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.TableFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽5%，则填写50" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          -->
          <el-col :span="11">
            <el-form-item label="桌子数量：" :required="true" prop="item.ObjectCount" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ObjectCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最小携带：" :required="true" prop="item.CarryLower" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最大携带：" :required="true" prop="item.CarryUpper" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <!--
          <el-col :span="11">
            <el-form-item label="互动道具每日免费次数" :required="true" prop="item.InteractDayFreeTimes" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.InteractDayFreeTimes" placeholder="请输入" />
            </el-form-item>
          </el-col>
          -->
          <el-col :span="11">
            <el-form-item label="互动道具每次价格消耗" :required="true" prop="item.InteractItemPrice" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.InteractItemPrice" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="实际扣除n/1000" placement="right-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="等级：" :required="true" prop="item.Level" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-select v-model="edit.item.Level" placeholder="请选择">
                <el-option label="新手场" :value="1" />
                <el-option label="中级场" :value="2" />
                <el-option label="高级场" :value="3" />
                <el-option label="大师场" :value="4" />
                <el-option label="职业场" :value="5" />
              </el-select>
            </el-form-item>
          </el-col>       
        </el-row>

        <fieldset>
          <legend>时间配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="操作(吃/碰/杠/胡)时间：" :required="true" prop="TimeConfig.OpTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.OpTimeout" placeholder="" >
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="出牌时间：" :required="true" prop="TimeConfig.PlayTimeout" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.TimeConfig.PlayTimeout" placeholder="" >
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        
        <fieldset>
          <legend>钱包转出配置 (N = 配置 * 底分)</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="SuitableRollOutMoney:" :required="true" prop="WalletConfig.SuitableRollOutMoney" :rules="dataRule(true,{type:'n',range:'0'})" >
                <el-input v-model.number="edit.WalletConfig.SuitableRollOutMoney" placeholder="" >
                  <template slot="append"> * 底分</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="MaxRollOutMoney:" :required="true" prop="WalletConfig.MaxRollOutMoney" :rules="dataRule(true,{type:'n',range:'0'})" >
                <el-input v-model.number="edit.WalletConfig.MaxRollOutMoney" placeholder="" >
                  <template slot="append"> * 底分</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>

        <fieldset>
          <legend>玩法配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="超时系统强制处理:" :required="true" prop="PlayingConfig.SysImposed" :rules="dataRule(true,{type:'n',range:'0'})" >
                <el-input v-model.number="edit.PlayingConfig.SysImposed" placeholder="" />
              </el-form-item>
            </el-col>
            <!--
            <el-col :span="11">
              <el-form-item label="测试牌:" prop="PlayingConfig.TestWall" >
                <el-input v-model="edit.PlayingConfig.TestWall" placeholder="" />
              </el-form-item>
            </el-col>
            -->
          </el-row>
        </fieldset>

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
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}
function NewTimeConfig() {
  return {
    OpTimeout: 15,
    PlayTimeout: 15
  }
}
function NewWalletConfig(){
  return {
    SuitableRollOutMoney: 5,
    MaxRollOutMoney: 10
  }
}
function NewPlayConfig() {
  return {
    SysImposed:0,
    TestWall:''
  }
}
function newItem() {
  return {
    CarryLower: 100,
    CarryUpper: 1000,
    TableMoney: 100,
    ObjectCount: 100,
    TableMaxPlayerNum: 4,
    TableFee: 10,
    Level: 1,
    InteractDayFreeTimes: 0,
    InteractItemPrice: 0,
    TimeConfig: {},
    WalletConfig:{},
    PlayingConfig:{},
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
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper']),
      libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        TimeConfig: NewTimeConfig(),
        WalletConfig: NewWalletConfig(),
        PlayingConfig: NewPlayConfig(),
        isEdit: false
      },

      AttrNames: { 
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        TableMaxPlayerNum: '人数',
        ObjectCount: '桌子数',
        Level: '等级',
        TableFee: '台费',
        InteractDayFreeTimes: '互动道具每日免费次数',
        InteractItemPrice: '互动道具每次价格消耗',
        TableMoney: '底分'
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
        url: '/filipinomahjongtable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const o in objs) {
            objs[o].TableMoney /= 1000
            console.log(objs[o])
          }
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      /*
      let goodsCheck = false
      if (goodsCheck) {
        this.$alert('除了练习场，其它场次必须配置金币不足推荐商品')
        return false
      }
      */
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
          url: '/filipinomahjongtable/update/status',
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
          console.log("_data:", _data)
          try {
            this.edit.TimeConfig = this.libMoneyRobot.TransForShow(JSON.parse(_data.TimeConfig))
            if (_data.WalletConfig) {
              console.log(ID, "=>", _data.WalletConfig)
              this.edit.WalletConfig = this.libMoneyRobot.TransForShow(JSON.parse(_data.WalletConfig))
            }else{
              this.edit.WalletConfig = NewWalletConfig()
            }
          } catch (e) {
            console.log('initFormData error 2 e:', e)
            this.edit.TimeConfig = NewTimeConfig()
            this.edit.WalletConfig = NewWalletConfig()
            this.edit.PlayingConfig = NewPlayConfig()
          }
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
    createSave(postData) {  //创建
      console.log('createSave', postData)
      request({
        url: '/filipinomahjongtable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.edit.item.TableMoney *= 1000    //存db的时候放大1000倍
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {  //修改提交更新
      console.log('editSave', postData)
      request({
        url: 'filipinomahjongtable/update',
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
      postData.TableMoney *= 1000 //放大100倍
      return postData
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
        Message.warning('最小携带不能大于最大携带，请检查数值正确性！')
        return false
      }
      if (this.edit.item.CarryLower < this.edit.item.TableMoney) {
        Message.warning('最小携带不能小于投注额，请检查数值正确性！')
        return false
      }
      let maxRatio = 1
      if (this.edit.WalletConfig) {
        if (this.edit.WalletConfig.SuitableRollOutMoney*this.edit.item.TableMoney < this.edit.item.CarryLower){
          Message.warning('最小携带>=(SuitableRollOutMoney*TableMoney)，请检查数值正确性！')
          return false
        }
        if (this.edit.WalletConfig.SuitableRollOutMoney < maxRatio){
          Message.warning('SuitableRollOutMoney<最小赔付倍率，请检查数值正确性！')
          return false
        }
        if (this.edit.WalletConfig.MaxRollOutMoney < this.edit.WalletConfig.SuitableRollOutMoney){
          Message.warning('MaxRollOutMoney < SuitableRollOutMoney，请检查数值正确性！')
          return false
        }
      }
      // TODO 完善
      return true
    },
    save() {
      if (!this.checkData()) return
      this.edit.item.TimeConfig = JSON.stringify(this.edit.TimeConfig)
      this.edit.item.WalletConfig = JSON.stringify(this.edit.WalletConfig)
      this.edit.item.PlayingConfig = JSON.stringify(this.edit.PlayingConfig)
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
      if (parseInt(e) < 2 || parseInt(e) > this.edit.item.TableMaxPlayerNum) {
        Message.error('数据错误')
        return
      }
    }
  }
}
</script>
