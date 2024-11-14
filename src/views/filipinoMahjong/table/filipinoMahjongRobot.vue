<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-row>
                  <el-form-item label="机器人开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.EnableRobot" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-col :span="12">
                    <el-form-item label="最多机器人数">
                      <el-input v-model.number="item.MaxRobotUserNum" size="mini"><template slot="append">人</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--
                <el-col :span="12">
                  <el-form-item label="最小玩牌局数">
                    <el-input v-model.number="item.PlayTimesMin" size="mini"><template slot="append">局</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大玩牌局数">
                    <el-input v-model.number="item.PlayTimesMax" size="mini"><template slot="append">局</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="概率">
                    <el-input v-model.number="item.PlayTimesRate" size="mini"><template slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
              -->
              <fieldset style="margin-top:10px">
                <el-col :span="20">
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddPlayTimesCfg()">添加</el-button>
                </el-col>
                <legend>机器人玩牌局数配置
                </legend>
                <el-table
                  ref="filterTable"
                  :data="item.PlayTimesCfg"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column label="最小玩牌局数">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.PlayTimesCfg[scope.$index].PlayTimesMin" size="mini" />
                    </template>                    
                  </el-table-column>

                  <el-table-column label="最大玩牌局数">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.PlayTimesCfg[scope.$index].PlayTimesMax" size="mini" />
                    </template>                    
                  </el-table-column>

                  <el-table-column label="概率">
                    <template slot-scope="scope">
                      <el-input v-model.number="item.PlayTimesCfg[scope.$index].PlayTimesRate" size="mini" />
                    </template>                    
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowPlayTimesCfg(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>
                
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="携带配置">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
            添加配置
          </el-button>
          <el-form ref="ProtectCfg" v-model="ProtectCfg" label-width="150px" style="margin-top: 10px">
            <el-table
              :data="ProtectCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
              @row-click="clickData"
            >
              <el-table-column prop="TableMoney" label="场次" width="200" />
              <el-table-column prop="CarryLower" label="最低携带" width="200" />
              <el-table-column prop="CarryUpper" label="最高携带" width="200"/>
              <el-table-column label="操作" column-key="op" width="250" >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleEdit(scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="handleDelete(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

      <el-tab-pane label="进场配置">
        <fieldset style="margin-top:10px">
          <el-table
            ref="filterTable"
            :data="PresetCfg"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column prop="Number" label="机器人数" />

            <el-table-column prop="Probability" label="概率" >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Probability" size="mini" />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-tab-pane>

      <el-tab-pane label="追加配置">
        <fieldset style="margin-top:10px">
          <el-col :span="20">
            <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddAppendCfg()">添加</el-button>
          </el-col>
          <el-table
            ref="filterTable"
            :data="AppendCfg"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column type="index"/>

            <el-table-column prop="AppendRobotMinDelay" label="最小等待时间" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.AppendRobotMinDelay" size="mini" />
              </template>
            </el-table-column>

            <el-table-column prop="AppendRobotMaxDelay" label="最大等待时间" >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.AppendRobotMaxDelay" size="mini" />
              </template>
            </el-table-column>

            <el-table-column prop="Probability" label="概率" >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Probability" size="mini" />
              </template>
            </el-table-column>

            <el-table-column prop="AppendRobotCount" label="增加人数" >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.AppendRobotCount" size="mini" />
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delRowAppendCfg(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-tab-pane>

      </el-tabs>
    </el-row>

    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label="场次：" :required="true" prop="TableMoney">
          <el-col :span="15" >
            <template v-if="!this.edit.isEdit">
              <el-select v-model="edit.item.TableMoney" size="mini">
                <el-option
                  v-for="item in TableMoneyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template v-if="this.edit.isEdit">
              <el-col :span="15">
                <el-input v-model="edit.item.TableMoney" :disabled="true" />
              </el-col>
            </template>
          </el-col>
        </el-form-item>
        <el-form-item label="最小携带：" :required="true" prop="CarryLower">
          <el-col :span="15">
            <el-input v-model="edit.item.CarryLower" />
          </el-col>
        </el-form-item>

        <el-form-item label="最大携带：" :required="true" prop="CarryUpper">
          <el-col :span="15">
            <el-input v-model="edit.item.CarryUpper" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import {$libShow, DataRule} from '@/utils/common'

function newItem() {
  return { TableMoney: 1, CarryLower: 200, CarryUpper: 500 }
}

function newEnterItem() {
  return { Number: 1, Probability: 50 }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'flpMjRobotSetting',
      form: {
        Data: {}
      },
      libShow: $libShow,

      //基础配置
      item: {
        EnableRobot: 0,
        MaxRobotUserNum: 3,
        PlayTimesCfg:[{
          PlayTimesMin: 1,
          PlayTimesMax: 5,
          PlayTimesRate: 50,
        }]
      },

      TableMoneyList: [
        { value: 1, label: '1', carryLower: 1, carryUpper: 1 },
      ],

      isDisabled: false,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      //携带配置
      ProtectCfg: [
        //{ TableMoney: 1, CarryLower: 200, CarryUpper: 500},
      ],

      //进场配置
      PresetCfg:[
        { Number: 1, Probability: 30 },
        { Number: 2, Probability: 50 },
        { Number: 3, Probability: 20 },
      ],

      //追加配置
      AppendCfg:[
        { AppendRobotMinDelay: 1, AppendRobotMaxDelay: 3, Probability: 10, AppendRobotCount: 1},
        { AppendRobotMinDelay: 3, AppendRobotMaxDelay: 5, Probability: 20, AppendRobotCount: 1},
        { AppendRobotMinDelay: 5, AppendRobotMaxDelay: 7, Probability: 50, AppendRobotCount: 1},
        { AppendRobotMinDelay: 7, AppendRobotMaxDelay: 10, Probability: 100, AppendRobotCount: 3},
      ]
    }
  },
  created() {
    this.getData()
    this.getTableMoneyList()
    this.isDisabled = false
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    // 操作类函数
    clickData(row, column, event) {
      if (row.status === 2) {
        return null
      }
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.TableMoney)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, tableMoney) {
      this.edit.isEdit = bEdit
      if (tableMoney) {
        const _data = this.getDataByTableMoney(tableMoney)
        if (_data) {
          console.log("data:", _data)
          this.edit.item = _data
        }
      }
    },
    handleEdit(ob) {
      console.log("===> ob.TableMoney:", ob.TableMoney)
      this.initFormData(true, ob.TableMoney)
      this.edit.visible = true
    },
    handleDelete(ob) {
      let $this = this
      this.$confirm('是否确认删除此项配置?', '提示', {type:'warning'}).then(() => {
        const delIndex = $this.ProtectCfg.findIndex(item => item.TableMoney === ob.TableMoney)
        this.ProtectCfg.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    doAddAppendCfg() {
      let minDelay = 1
      for (var i = 0; i < this.AppendCfg.length; i++) {
        if (this.AppendCfg[i].AppendRobotMaxDelay > minDelay) {
          minDelay = this.AppendCfg[i].AppendRobotMaxDelay
        }
      }
      this.AppendCfg.push({ AppendRobotMinDelay: minDelay, AppendRobotMaxDelay: minDelay+2, Probability: 10, AppendRobotCount: 1})
    },
    delRowAppendCfg(index) {
      let $this = this
      this.$confirm('是否确认删除此项配置?', '提示', {type:'warning'}).then(() => {
        this.AppendCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    doAddPlayTimesCfg() {
      let minPlayTimes = 1
      for (var i = 0; i < this.item.PlayTimesCfg.length; i ++){
        if (this.item.PlayTimesCfg[i].PlayTimesMax > minPlayTimes) {
          minPlayTimes = this.item.PlayTimesCfg[i].PlayTimesMax
        }
      }
      this.item.PlayTimesCfg.push({ PlayTimesMin: minPlayTimes, PlayTimesMax: minPlayTimes + 1, PlayTimesRate: 50})
    },
    delRowPlayTimesCfg(index) {
      let $this = this
      this.$confirm('是否确认删除此项配置?', '提示', {type:'warning'}).then(() => {
        this.item.PlayTimesCfg.splice(index, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    getDataByTableMoney(tableMoney) {
      for (let i = 0; i < this.ProtectCfg.length; i++) {
        const data = this.ProtectCfg[i]
        if (data.TableMoney === tableMoney) {
          return data
        }
      }
      return null
    },
    save() {
      // if (!this.checkData()) return
      const index = this.ProtectCfg.findIndex(item => item.TableMoney === this.edit.item.TableMoney)
      console.log("this.ProtectCfg len:", this.ProtectCfg, " this.edit.isEdit:", this.edit.isEdit)
      if (this.edit.isEdit) {
        //this.ProtectCfg.splice(index, 1, this.edit.item)
      } else {
        if (index >= 0) {
          this.$alert('场次已存在，不能重复添加', '提示', {type:'warning'})
          return
        }
        // 新增
        this.ProtectCfg.push(this.edit.item)
        // 按场次金额排序
        this.ProtectCfg.sort((a, b) => {
          return a.TableMoney - b.TableMoney
        })
      }
      this.edit.visible = false
    },
    handleCreate() {
      this.edit.item = newItem()
      if (this.ProtectCfg != undefined) {
        let iLen = this.ProtectCfg.length
        if (iLen < this.TableMoneyList.length) {
          this.edit.item.TableMoney = this.TableMoneyList[iLen].value
          this.edit.item.CarryLower = this.TableMoneyList[iLen].carryLower
          this.edit.item.CarryUpper = this.TableMoneyList[iLen].carryUpper
        }
      }
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
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
          console.log('robotSetting', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)
            if ($this.item.ProtectCfg) {
              $this.ProtectCfg = []
            }

            for (const o in $this.item.ProtectCfg) {
              const one = Object.assign({}, $this.item.ProtectCfg[o])
              one.TableMoney /= 1000
              one.CarryLower /= 1000
              one.CarryUpper /= 1000
              $this.ProtectCfg.push(one)
            }

            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    getTableMoneyList() {
      const $this = this
      request({
        url: '/filipinomahjongtable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          $this.TableMoneyList = []
          const objs = response.Data || []
          for (const o in objs) {
            objs[o].TableMoney /= 1000
            $this.TableMoneyList.push({
                value: objs[o].TableMoney,
                label: objs[o].TableMoney,
                carryLower: objs[o].CarryLower/1000, 
                carryUpper: objs[o].CarryUpper/1000
              })
          }
          console.log("this.TableMoneyList:", $this.TableMoneyList)
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)

      //携带配置
      cpy.ProtectCfg = []
      for (const o in this.ProtectCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ProtectCfg[o].TableMoney) * 1000
        obj.CarryLower = parseInt(this.ProtectCfg[o].CarryLower) * 1000
        obj.CarryUpper = parseInt(this.ProtectCfg[o].CarryUpper) * 1000
        cpy.ProtectCfg.push(obj)
      }

      //进场配置
      cpy.PresetCfg = []
      for (const o in this.PresetCfg) {
        const obj = {}
        obj.Number = parseInt(this.PresetCfg[o].Number)
        obj.Probability = parseInt(this.PresetCfg[o].Probability)
        cpy.PresetCfg.push(obj)
      }

      //追加配置
      cpy.AppendCfg = []
      for (const o in this.AppendCfg) {
        const obj = {}
        obj.AppendRobotMinDelay = parseInt(this.AppendCfg[o].AppendRobotMinDelay)
        obj.AppendRobotMaxDelay = parseInt(this.AppendCfg[o].AppendRobotMaxDelay)
        obj.Probability = parseInt(this.AppendCfg[o].Probability)
        obj.AppendRobotCount = parseInt(this.AppendCfg[o].AppendRobotCount)
        cpy.AppendCfg.push(obj)
      }

      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
