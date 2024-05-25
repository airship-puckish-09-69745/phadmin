<template>
  <div class="app-container">

    <publish
        primary-key="Volume"
        :key-id="getFullKey(this.subKey)"
        :env-empty="false"
        compare-type="Object"
        :attr-names="AttrNames"
    />
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="24">
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="addOpen()">添加</el-button>
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-table
          ref="filterTable"
          :data="tableData"
          stripe
          border
          style="padding:10px;width: 100%"
      >
        <el-table-column
            prop="BoxType"
            label="宝箱类型"
        >
          <template slot-scope="scope">
            {{ boxTypeOption[scope.row.BoxType] }}
          </template>
        </el-table-column>
        <el-table-column
            prop="IssueInterval"
            label="发放间隔"
            width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.IssueInterval }}
          </template>
        </el-table-column>
        <el-table-column
            prop="BoxActiveTime"
            label="宝箱有效时间(分)"
        >
          <template slot-scope="scope">
            {{ scope.row.BoxActiveTime }}
          </template>
        </el-table-column>
        <el-table-column
            prop="StartTime"
            label="开始时间"
        >
          <template slot-scope="scope">
            {{ parseTime(scope.row.StartTime, '') }}
          </template>
        </el-table-column>
        <el-table-column
            prop="EndTime"
            label="结束时间"
        >
          <template slot-scope="scope">
            {{ parseTime(scope.row.EndTime, '') }}
          </template>
        </el-table-column>
        <el-table-column
            prop="MinMoney"
            label="最小金额"
        >
          <template slot-scope="scope">
            {{ scope.row.MinMoney  }}
          </template>
        </el-table-column>
        <el-table-column
            prop="MaxMoney"
            label="最大金额"
        >
          <template slot-scope="scope">
            {{ scope.row.MaxMoney  }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="success" icon="el-icon-delete" size="mini"
                       @click="editDetail(scope.row,scope.$index)">编辑
            </el-button>
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini"
                       @click="delOne(scope.$index)">移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-row>
    <el-dialog
        title="骰宝牌局详情"
        :visible.sync="visible"
        width="50%"
    >
      <fieldset style="width: 80%;   margin: auto;">
        <legend>基础配置</legend>
        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="宝箱类型" required>
               <el-select v-model="showData.BoxType" size="mini" placeholder="请选择">
                 <el-option
                     v-for="(k,v) in boxTypeOption"
                     :key="v"
                     :label="k"
                     :value="parseInt(v)"
                 ></el-option>
               </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="开始时间" required>
                <el-date-picker v-model="showData.StartTime" value-format="timestamp" placeholder="选择开始时间"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item v-model="showData.EndTime" label="结束时间" required>
                <el-date-picker v-model="showData.EndTime" value-format="timestamp" placeholder="选择结束时间"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="有效时间" required>
                <el-input v-model.number="showData.BoxActiveTime"
                          oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="发放间隔" required>
                <el-input v-model.number="showData.IssueInterval"
                          oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>


        <el-row>

          <el-row>
            <el-col :span="12">
              <el-form inline>
                <el-form-item label="最小金额" required>
                  <el-input v-model.number="showData.MinMoney"
                            oninput=" if(value < 0 || value == '' || value == null)value = 0;">
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form inline>
                <el-form-item label="最大金额" required>
                  <el-input v-model.number="showData.MaxMoney"
                            oninput=" if(value < 0 || value == '' || value == null)value = 0">
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-row>
        <el-col :span="12">
          <el-form inline>
            <el-form-item label="更新时间" required>
              {{ parseTime(showData.UpdateTime, '') }}
            </el-form-item>
          </el-form>
        </el-col>
      </fieldset>
      <fieldset style="width: 80%;   margin: auto;">
        <legend>宝箱配置</legend>
        <el-col :span="22">
          <el-button type="primary" size="mini" @click="addOne">添加</el-button>
        </el-col>
        <el-col :span="24">
          <el-form ref="showData" v-model="showData.Boxes" label-width="150px">
            <el-table
                :data="showData.Boxes"
                style="width: 95%"
                border
                :header-cell-style="{textAlign: 'center'}"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                  prop="IssueAmount"
                  label="发放金额"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.IssueAmount" type="number"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                </template>
              </el-table-column>

              <el-table-column
                  prop="IssuePlayers"
                  label="发放玩家"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.IssuePlayers" type="number"
                            oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}"/>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <!--            <el-table-column label="操作">-->
              <!--              <template slot-scope="scope">-->
              <!--                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>-->
              <!--              </template>-->
              <!--            </el-table-column>-->
            </el-table>
            <el-form-item>
            </el-form-item>
          </el-form>
        </el-col>
      </fieldset>
        <el-button style="margin-left: 10%" type="primary" @click="saveOne()">保存</el-button>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare"/>
    <el-button type="primary" @click="setData">保存</el-button>

  </div>
</template>

<script>
import {parseTime} from '../../../../utils'
import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {$libShow} from '@/utils/common'

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      form: {},
      postData: {},
      subKey: 'poker_topic_random_box_setting',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      visible: false,
      tableData: [],
      showData: {},
      allCfg: [],
      appInfo: [],
      optionType: 0,
      boxTypeOption:{
        1:"A",
        2:"B",
        3:"C",
        4:"D",
      },
      item: {
        Boxes: [{
          IssueAmount: 0,
          IssuePlayers: 0
        }],
        IssueInterval: 0,
        BoxActiveTime: 0,
        StartTime: new Date().getTime(),
        EndTime: new Date().getTime(),
        UpdateTime: new Date().getTime(),
        MinMoney: 0,
        MaxMoney: 0,
      },
      selectGid: 0,
      libShow: $libShow,
      gameOptions: {},
      editIdx: -1,
    }
  },

  created() {
    this.getGameList()
    this.getData()
  },
  methods: {
    parseTime,
    delOne(idx){
      this.tableData.splice(idx,1)
    },
    refresh() {
      this.showData = this.allCfg
      return
    },
    editDetail(row, idx) {
      this.editIdx = idx
      this.showData = row
      this.visible = true
    },
    newItem() {
      return JSON.parse(JSON.stringify(this.item))
    },
    addOpen() {
      this.editIdx = -1
      this.showData = this.newItem()
      this.visible = true
    },
    saveOne() {
      var obj = JSON.parse(JSON.stringify(this.showData))
      obj.UpdateTime = parseInt(new Date().getTime() / 1000)
      if (this.editIdx === -1) {
        this.tableData.push(obj)
      } else {
        this.tableData.splice(this.editIdx, 1, obj)
      }
      this.visible = false
    },
    addOne() {
      this.showData.Boxes.push({IssueAmount: 0, IssuePlayers: 0})
    },
    deleteRow(idx, row) {
      this.showData.Boxes.splice(idx, 1)
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.postData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            console.log("==========", cfg)
            this.tableData = cfg || []
            for (const o of cfg) {
              o.StartTime *= 1000
              o.EndTime *= 1000
              o.MinMoney /= 1000
              o.MaxMoney /= 1000
              for (const oElement of o.Boxes) {
                oElement.IssueAmount /= 1000
              }
            }
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkData(cfg)) {
        return false
      }

      const $this = this
      $this.postData.Data = JSON.stringify(cfg)
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal($this.postData.Data)
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const list = JSON.parse(JSON.stringify(this.tableData))
      for (const cfg of list) {
        cfg.StartTime = parseInt(cfg.StartTime / 1000)
        cfg.EndTime = parseInt(cfg.EndTime / 1000)

        cfg.MinMoney = parseInt(cfg.MinMoney *  1000)
        cfg.MaxMoney = parseInt(cfg.MaxMoney * 1000)

        for (const oElement of cfg.Boxes) {
          oElement.IssueAmount *= 1000
        }
      }
      return list
    },
    checkData(cfg) {
      return true
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    }
  }
}
</script>
<style>
.el-form-item__label-wrap {
  margin-left: 0px !important;
}

.el-table__body tr.current-row > td {
  background-color: rgb(217, 224, 238) !important;
  cursor: pointer;
}
</style>
