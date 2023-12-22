<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="预进桌数量配置&玩牌基础配置">
          <el-row>
            <el-col :span="12" :offset="1">
              <h5>预进桌机器人数量配置</h5>
              <el-table :data="item.PresetCfg" border>
                <el-table-column label="机器人数" prop="Number" />
                <el-table-column label="概率(%)">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1">
              <h5>牌局结束补机器人配置</h5>
              <el-table :data="item.AppendCfg" border>
                <el-table-column label="当前总人数" prop="UserNumber" width="160" />
                <el-table-column label="补机器人概率(%)" width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最少补充机器人数量" width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AppendRobotMin" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="最多补充机器人数量" width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AppendRobotMax" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="最小进入延迟" width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.EnterDelayMin" size="mini"><template slot="append">秒</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最大进入延迟(秒)" width="160">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.EnterDelayMax" size="mini"><template slot="append">秒</template></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1">
              <h5>机器人携带金币配置 <el-button type="text" @click="addCarryingCfg">添加一项</el-button></h5>
              <el-table :data="item.CarryingCfg" border>
                <el-table-column label="最小携带底注位数" prop="AntesMultipleMin" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AntesMultipleMin" size="mini"><template slot="append">倍</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最大携带底注位数" prop="AntesMultipleMax" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.AntesMultipleMax" size="mini"><template slot="append">倍</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="概率(%)" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"><template slot="append">%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delCarryingCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" :offset="1">
              <h5>机器人玩牌配置</h5>
              <el-form ref="item" label-width="160px">
                <el-form-item label="机器人开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.EnableRobot" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="最少玩牌局数">
                  <el-input v-model.number="item.PlayTimesMin" size="mini" />
                </el-form-item>
                <el-form-item label="最多玩牌局数">
                  <el-input v-model.number="item.PlayTimesMax" size="mini" />
                </el-form-item>
                <el-form-item label="延长玩牌最少局数">
                  <el-input v-model.number="item.IncrPlayTimesMin" size="mini" />
                </el-form-item>
                <el-form-item label="延长玩牌最多局数">
                  <el-input v-model.number="item.IncrPlayTimesMax" size="mini" />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" :offset="1">
              <el-button type="primary" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'

function newPresetCfg(n) {
  return {
    Number: n,
    Probability: 0
  }
}
function newAppendCfg(n) {
  return {
    UserNumber: n,
    Probability: 0,
    AppendRobotMin: 0,
    AppendRobotMax: 0,
    EnterDelayMin: 0,
    EnterDelayMax: 0
  }
}
function newCarryingCfg(x, y, z) {
  return {
    AntesMultipleMin: x,
    AntesMultipleMax: y,
    Probability: z
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      subKey: 'pusoyRobotSetting',

      item: {
        'PlayTimesMin': 0,
        'PlayTimesMax': 0,
        'IncrPlayTimesMin': 0,
        'IncrPlayTimesMax': 0,
        'EnableRobot': 0,
        'PresetCfg': [newPresetCfg(1), newPresetCfg(2), newPresetCfg(3)],
        'AppendCfg': [newAppendCfg(1), newAppendCfg(2), newAppendCfg(3)],
        'CarryingCfg': [newCarryingCfg(0, 0, 0), newCarryingCfg(0, 0, 0)]
      },
      tableList: [],
      tableMoneyArr: [],
      isTableMoneysChanged: false,
      dialogVisible: false,
      tableMoneyList: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    addCarryingCfg() {
      this.item.CarryingCfg.push(newCarryingCfg(0, 0, 0))
    },
    delCarryingCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.CarryingCfg, idx)
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            const old = JSON.parse(JSON.stringify(data))
            $this.item = this.DeepCopy(data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
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
