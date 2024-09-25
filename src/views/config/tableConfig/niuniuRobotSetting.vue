<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-row>
            <el-col :span="8">
              <el-form ref="item" label-width="220px">
                <el-form-item label="机器人开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-switch v-model="item.EnableRobot" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="最多机器人数">
                  <el-input v-model.number="item.MaxRobotUserNum" size="mini"><template slot="append">人</template></el-input>
                </el-form-item>
                <el-form-item label="最小玩牌局数">
                  <el-input v-model.number="item.PlayTimesMin" size="mini"><template slot="append">局</template></el-input>
                </el-form-item>
                <el-form-item label="最大玩牌局数">
                  <el-input v-model.number="item.PlayTimesMax" size="mini"><template slot="append">局</template></el-input>
                </el-form-item>
                <el-form-item label="最小延迟进桌">
                  <el-input v-model.number="item.EnterDelayMin" size="mini"><template slot="append">秒</template></el-input>
                </el-form-item>
                <el-form-item label="最大延迟进桌">
                  <el-input v-model.number="item.EnterDelayMax" size="mini"><template slot="append">秒</template></el-input>
                </el-form-item>
                <el-form-item label="最小延迟退桌">
                  <el-input v-model.number="item.ExitDelayMin" size="mini"><template slot="append">秒</template></el-input>
                </el-form-item>
                <el-form-item label="最大延迟退桌">
                  <el-input v-model.number="item.ExitDelayMax" size="mini"><template slot="append">秒</template></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="下注倍数配置">
          <el-table
            :data="BetCfg"
            border
            style="width: 100%"
          >
            <el-table-column
              label="牌型"
              prop="CardType"
              width="200"
            >
              <template slot-scope="scope">
                {{ CardTypeNames[scope.row.CardType] }}
              </template>
            </el-table-column>
            <el-table-column
              label="倍率1"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Odds1" size="mini"><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="倍率2"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Odds2" size="mini"><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="倍率3"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Odds3" size="mini"><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="倍率4"
              width="200"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Odds4" size="mini"><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import { DataRule } from '@/utils/common'

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'niuniuRobotSetting',
      form: {
        Data: {}
      },

      item: {
        EnableRobot: 0,
        MaxRobotUserNum: 1,
        PlayTimesMin: 0,
        PlayTimesMax: 0,
        EnterDelayMin: 2,
        EnterDelayMax: 8,
        ExitDelayMin: 6,
        ExitDelayMax: 10,
        BetCfg: [
          { CardType: 100, OddsBet: 1, Probability: 0 },
          { CardType: 100, OddsBet: 2, Probability: 0 },
          { CardType: 100, OddsBet: 3, Probability: 0 },
          { CardType: 100, OddsBet: 4, Probability: 0 }
        ]
      },
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
      }
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
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

            for (let i = 0; i < $this.item.BetCfg.length; i++) {
              const one = $this.item.BetCfg[i]
              if ($this.BetCfg[one.CardType] === undefined) {
                $this.BetCfg[one.CardType] = {
                  CardType: one.CardType,
                  Odds1: 0,
                  Odds2: 0,
                  Odds3: 0,
                  Odds4: 0
                }
              }

              $this.BetCfg[one.CardType]['Odds' + one.OddsBet] = one.Probability
            }
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
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

      for (const o in this.BetCfg) {
        for (let i = 1; i <= 4; i++) {
          const obj = {}
          obj.Probability = this.BetCfg[o]['Odds' + i]
          obj.CardType = this.BetCfg[o].CardType
          obj.OddsBet = i
          cpy.BetCfg.push(obj)
        }
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
