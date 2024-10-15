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
          <el-form ref="BetCfg" v-model="BetCfg" label-width="150px">
            <el-table
              :data="BetCfg"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="CardType"
                label="牌型"
                width="200"
              >
                <template slot-scope="scope">
                  {{ CardTypeNames[scope.row.CardType] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Odds1"
                label="倍率1"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Odds1" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Odds2"
                label="倍率2"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Odds2" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Odds3"
                label="倍率3"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Odds3" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Odds4"
                label="倍率4"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Odds4" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "><template slot="append">‰</template></el-input>
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
  return { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100 }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'niuniuRobotSetting',
      form: {
        Data: {}
      },
      libShow: $libShow,

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
        BetCfg: [
          { CardType: 100, OddsBet: 1, Probability: 0 },
          { CardType: 100, OddsBet: 2, Probability: 0 },
          { CardType: 100, OddsBet: 3, Probability: 0 },
          { CardType: 100, OddsBet: 4, Probability: 0 }
        ]
      },

      tableMoneyItem: {
        TableMoneyList: [],
      },
      TableMoneyList: [
        { value: 1, label: '1' },
        { value: 5, label: '5' },
      ],

      BetCfg: [
        { CardType: 100, Odds1: 800, Odds2: 150, Odds3: 40, Odds4: 10 },
        { CardType: 101, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 102, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 103, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 104, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 105, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 106, Odds1: 150, Odds2: 250, Odds3: 250, Odds4: 350 },
        { CardType: 107, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        { CardType: 108, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        { CardType: 109, Odds1: 120, Odds2: 250, Odds3: 250, Odds4: 380 },
        { CardType: 110, Odds1: 100, Odds2: 250, Odds3: 250, Odds4: 400 },
        { CardType: 111, Odds1: 10, Odds2: 10, Odds3: 180, Odds4: 800 },
        { CardType: 113, Odds1: 5, Odds2: 5, Odds3: 90, Odds4: 900 },
        { CardType: 114, Odds1: 450, Odds2: 5, Odds3: 5, Odds4: 45 }
      ],
      ProtectCfg: [
        { TableMoney: 1, CarryLower: 200, CarryUpper: 500, LossMoneyMax: 100, WinMoneyMax: 100 },
        { TableMoney: 5, CarryLower: 1000, CarryUpper: 2500, LossMoneyMax: 500, WinMoneyMax: 500 },
      ],
      CardTypeNames: {
        100: '无牛',
        101: '牛一',
        102: '牛二',
        103: '牛三',
        104: '牛四',
        105: '牛五',
        106: '牛六',
        107: '牛七',
        108: '牛八',
        109: '牛九',
        110: '牛牛',
        111: '四花',
        113: '四条',
        114: '四小'
      },
      isDisabled: false,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
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
    handleCreate() {
      this.edit.item = newItem()
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
            $this.item.EnterDelayMin /= 1000
            $this.item.EnterDelayMax /= 1000
            $this.item.ExitDelayMin /= 1000
            $this.item.ExitDelayMax /= 1000
            $this.BetCfg = []
            let betCfg = []

            for (let i = 0; i < $this.item.BetCfg.length; i++) {
              const one = $this.item.BetCfg[i]
              if (betCfg[one.CardType] === undefined) {
                betCfg[one.CardType] = {
                  CardType: one.CardType,
                  Odds1: 0,
                  Odds2: 0,
                  Odds3: 0,
                  Odds4: 0
                }
              }

              betCfg[one.CardType]['Odds' + one.OddsBet] = one.Probability
            }

            for (const o in betCfg) {
              $this.BetCfg.push(betCfg[o])
            }

            console.log('BetCfg:', $this.BetCfg)
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.tableMoneyItem = JSON.parse(response.Data.Data)
            for (const i in $this.tableMoneyItem.TableMoneyList) {
              $this.tableMoneyItem.TableMoneyList[i] /= 1000
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
      cpy.BetCfg = []
      cpy.ProtectCfg = []

      for (const o in this.BetCfg) {
        for (let i = 1; i <= 4; i++) {
          const obj = {}
          obj.Probability = this.BetCfg[o]['Odds' + i]
          obj.CardType = this.BetCfg[o].CardType
          obj.OddsBet = i
          cpy.BetCfg.push(obj)
        }
      }

      for (const o in this.ProtectCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ProtectCfg[o].TableMoney) * 1000
        obj.CarryLower = parseInt(this.ProtectCfg[o].CarryLower) * 1000
        obj.CarryUpper = parseInt(this.ProtectCfg[o].CarryUpper) * 1000
        obj.LossMoneyMax = parseInt(this.ProtectCfg[o].LossMoneyMax) * 1000
        obj.WinMoneyMax = parseInt(this.ProtectCfg[o].WinMoneyMax) * 1000
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
