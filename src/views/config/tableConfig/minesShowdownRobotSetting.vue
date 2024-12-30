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
                <el-col :span="12">
                  <el-form-item label="有3真人时最少多玩局数">
                    <el-input v-model.number="item.IncrPlayTimesMin" size="mini"><template slot="append">局</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有3真人时最多多玩局数">
                    <el-input v-model.number="item.IncrPlayTimesMax" size="mini"><template slot="append">局</template></el-input>
                  </el-form-item>
                </el-col>
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
                  <el-form-item label="最小延迟进桌">
                    <el-input v-model.number="item.EnterDelayMin" size="mini"><template slot="append">秒</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大延迟进桌">
                    <el-input v-model.number="item.EnterDelayMax" size="mini"><template slot="append">秒</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最小延迟退桌">
                    <el-input v-model.number="item.ExitDelayMin" size="mini"><template slot="append">秒</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大延迟退桌">
                    <el-input v-model.number="item.ExitDelayMax" size="mini"><template slot="append">秒</template></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="下注倍数配置">
          <el-form v-model="item.MinesCfg" label-width="150px">
            <el-table
              :data="item.MinesCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
              :key="minesCfgKey"
            >
              <el-table-column
                prop="CardType"
                label="配置"
                width="200"
              >
                <template slot="header">
                  <el-button type="primary" size="mini" @click="appendMinesCfg()" >添加新配置</el-button>
                </template>
                <template slot-scope="scope">
                  {{ scope.$index +1}}
                </template>
              </el-table-column>
              <el-table-column
                prop="CardType"
                label="编辑"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleMinesCfsEdit(scope.row, scope.$index)">编辑配置{{scope.$index+1}}</el-button>
                  <el-button type="danger" size="mini" @click="delMinesCfs(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="携带和保底配置">
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
              <el-table-column
                prop="TableMoney"
                label="场次"
                width="200"
              />
              <el-table-column
                prop="CarryLower"
                label="最低携带"
                width="200"
              />
              <el-table-column
                prop="CarryUpper"
                label="最高携带"
                width="200"
              />
              <el-table-column
                prop="LossMoneyMax"
                label="最多输金额"
                width="200"
              />
              <el-table-column
                prop="WinMoneyMax"
                label="最多赢金额"
                width="200"
              />
              <el-table-column
                prop="AppendMinesOdds"
                label="每次增加翻雷概率"
                width="250"
              />
              <el-table-column
                label="操作"
                column-key="op"
                width="250"
              >
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
          <el-col :span="15">
            <el-select v-model="edit.item.TableMoney" size="mini">
              <el-option
                v-for="item in TableMoneyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-form-item label="最多输金额：" :required="true" prop="LossMoneyMax">
          <el-col :span="15">
            <el-input v-model="edit.item.LossMoneyMax" />
          </el-col>
        </el-form-item>
        <el-form-item label="最多赢金额：" :required="true" prop="WinMoneyMax">
          <el-col :span="15">
            <el-input v-model="edit.item.WinMoneyMax" />
          </el-col>
        </el-form-item>
        <el-form-item label="每次增加翻雷概率：" :required="true" prop="WinMoneyMax">
          <el-col :span="15">
            <el-input v-model="edit.item.AppendMinesOdds" />
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

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="editMinesCfg.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        :data="editMinesCfg.items.MinesOdds"
        border
        style="width: 100%"
        :cell-style="libShow.DefaultTableCell"
        :key="minesCfgRowKey"
      >
        <el-table-column
          label="index"
        >
          <template slot="header">
            <el-button type="primary" size="mini" @click="appendMinesRow()">添加新配置</el-button>
          </template>
          <template slot-scope="scope">
            {{ scope.$index +1}}
          </template>
        </el-table-column>
        <el-table-column
          label="地雷最小概率"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MinOdds"/>
          </template>
        </el-table-column>
        <el-table-column
          label="地雷最大概率"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.MaxOdds"/>
          </template>
        </el-table-column>
        <el-table-column
          label="跳过概率"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.SkipOdds"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delMinesRowCfs(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="10" :offset="6">
          <el-button type="primary" size="medium" @click="saveMinesRow">保存</el-button>
        </el-col>
      </el-row>
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
  return { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100,AppendMinesOdds:1 }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'minesShownRobotSetting',
      form: {
        Data: {}
      },
      libShow: $libShow,
      minesCfgKey:0,
      minesCfgRowKey:0,
      item: {
        EnableRobot: 0,
        MaxRobotUserNum: 1,
        PlayTimesMin: 0,
        PlayTimesMax: 0,
        IncrPlayTimesMin: 0,
        IncrPlayTimesMax: 0,
        EnterDelayMin: 2,
        EnterDelayMax: 8,
        ExitDelayMin: 6,
        ExitDelayMax: 10,
        IncrMoneyRateMin: 0,
        IncrMoneyRateMax: 0,
        MinesCfg:[[{minOdds:0,maxOdds:0,skipOdds:0}]]
      },

      tableMoneyItem: {
        TableMoneyList: [],
      },
      TableMoneyList: [
        { value: 1, label: '1' },
        { value: 5, label: '5' },
      ],


      ProtectCfg: [
        { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100 ,AppendMinesOdds:1},
        { TableMoney: 5, CarryLower: 1000, CarryUpper: 2500, LossMoneyMax: 500, WinMoneyMax: 500 ,AppendMinesOdds:1},
      ],
      isDisabled: false,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      editMinesCfg: {
        visible: false,
        items: [],
        isEdit: false,
        idx:0
      },
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
          Object.assign(this.edit.item, _data)
        }
      }
    },
    handleMinesCfsEdit(ob,idx) {
      console.log(ob)
      this.editMinesCfg.visible = true
      this.editMinesCfg.items = ob
      this.editMinesCfg.idx = idx
    },
    delMinesCfs(ob,idx) {
      this.item.MinesCfg.splice(idx,1)
    },
    delMinesRowCfs(ob,idx) {
      this.item.MinesCfg[this.editMinesCfg.idx].MinesOdds.splice(idx,1)
    },
    handleEdit(ob) {
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
      if (this.edit.isEdit) {
        this.ProtectCfg.splice(index, 1, this.edit.item)
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
    saveMinesRow(){
      this.editMinesCfg.visible = false
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    appendMinesCfg() {
      if (!this.item.MinesCfg){
        this.item['MinesCfg'] = []
      }
      this.item.MinesCfg.push({
        MinesOdds:[],
      })
      this.minesCfgKey +=1
    },
    appendMinesRow() {
      if (!this.item.MinesCfg[this.editMinesCfg.idx].MinesOdds){
        this.item.MinesCfg[this.editMinesCfg.idx]['MinesOdds'] = []
      }
      this.item.MinesCfg[this.editMinesCfg.idx].MinesOdds.push({
        MinOdds:0,
        MaxOdds:0,
        SkipOdds:0
      })
      this.minesCfgRowKey +=1
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
            $this.item.EnterDelayMin /= 1000
            $this.item.EnterDelayMax /= 1000
            $this.item.ExitDelayMin /= 1000
            $this.item.ExitDelayMax /= 1000

            if ($this.item.ProtectCfg) {
              $this.ProtectCfg = []
            }
            for (const o in $this.item.ProtectCfg) {
              const one = Object.assign({}, $this.item.ProtectCfg[o])
              one.TableMoney /= 1000
              one.CarryLower /= 1000
              one.CarryUpper /= 1000
              one.LossMoneyMax /= 1000
              one.WinMoneyMax /= 1000
              one.AppendMinesOdds /= 1000
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
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'niuniu_ai_list_cfg'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          if (response.Data && response.Data.Data !== '') {
            $this.TableMoneyList = []
            $this.tableMoneyItem = JSON.parse(response.Data.Data)
            for (const i in $this.tableMoneyItem.TableMoneyList) {
              $this.tableMoneyItem.TableMoneyList[i] /= 1000
              $this.TableMoneyList.push({
                value: $this.tableMoneyItem.TableMoneyList[i],
                label: $this.tableMoneyItem.TableMoneyList[i]
              })
            }
          }
          console.log('tableMoneyItem', $this.tableMoneyItem)
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      cpy.EnterDelayMin *= 1000
      cpy.EnterDelayMax *= 1000
      cpy.ExitDelayMin *= 1000
      cpy.ExitDelayMax *= 1000
      cpy.ProtectCfg = []

      for (const o in this.ProtectCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ProtectCfg[o].TableMoney) * 1000
        obj.CarryLower = parseInt(this.ProtectCfg[o].CarryLower) * 1000
        obj.CarryUpper = parseInt(this.ProtectCfg[o].CarryUpper) * 1000
        obj.LossMoneyMax = parseInt(this.ProtectCfg[o].LossMoneyMax) * 1000
        obj.WinMoneyMax = parseInt(this.ProtectCfg[o].WinMoneyMax) * 1000
        obj.AppendMinesOdds = parseInt(this.ProtectCfg[o].AppendMinesOdds) * 1000
        cpy.ProtectCfg.push(obj)
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
