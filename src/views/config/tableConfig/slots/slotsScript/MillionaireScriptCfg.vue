<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />


    <el-row :gutter="10" style="margin-top: 30px">
      <el-row>
        <span> 选择游戏 :</span>
        <el-select v-model="queryGid" size="mini" filterable default-first-option @change="queryKeyInput">
          <!--              <el-option label="所有" :value="0"/>-->
          <el-option v-for="(o,k) in gameOptions" :key="o.key" :label="o.label" :value="parseInt(o.key)"/>
        </el-select>
      </el-row>
      <fieldset>

        <el-form ref="item" :model="item" label-width="200px">
          <el-col :span="6">
            <el-form-item label="单个剧本步数：">
              <el-input v-model.number="item.ScriptSteps"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总剧本数量：">
              <el-input v-model.number="item.ScriptNumber"></el-input>
            </el-form-item>
          </el-col>
          <fieldset style="margin:20px auto;">
            <legend>倍数相关配置</legend>
            <el-table
              ref="filterTable"
              :data="item.OddsCfg"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="OddsMin"
                label="最小倍数"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.OddsMin" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="OddsMax"
                label="最大倍数"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.OddsMax" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="ScriptSteps"
                label="剧本中出现次数"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.ScriptSteps" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="ScriptOddsSum"
                label="剧本中倍数总和"
                width="150"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.ScriptOddsSum" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="NormalMatrixCacheSize"
                label="正常图案缓存数量"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.NormalMatrixCacheSize" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="ScatterMatrixCacheSize"
                label="Scatter图案缓存数量"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.ScatterMatrixCacheSize" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="SwitchScatterPercent"
                label="作为Scatter主图案的概率"
                width="300"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.SwitchScatterPercent" size="mini"><template slot="append">%</template></el-input>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="TriggerScatterPercent"
                label="触发进入Scatter概率"
                width="300"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.TriggerScatterPercent" size="mini"><template slot="append">%</template></el-input>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" @click="addOddsCfgRow(scope.$index+1)" size="mini">添加</el-button>
                  <el-button type="primary" @click="delOddsCfgRow(scope.$index)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <fieldset style="margin:20px auto;">
            <legend>Scatter中奖次数配置</legend>
            <el-table
              ref="filterTable"
              :data="item.ScatterHitCfg"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="HitTimes"
                label="总中奖次数"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model="scope.row.HitTimes" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="PerTenThousand"
                label="概率(万分之一)"
                width="500"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model="scope.row.PerTenThousand" size="mini"><template slot="append">单位:万分之一</template></el-input>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <fieldset style="margin:20px auto;">
            <legend>大奖配置</legend>
            <el-form-item label="下注总金额抽水(千分之一)：">
              <el-input v-model.number="item.BigPrizeCfg.TaxPerThousand" autosize><template slot="append">‰(千分之一)</template></el-input>
            </el-form-item>
            <el-form-item label="中奖概率(百万分之一)：">
              <el-input v-model.number="item.BigPrizeCfg.HitPerMillion"><template slot="append">单位:百万分之一</template></el-input>
            </el-form-item>
            <el-table
              ref="filterTable"
              :data="item.BigPrizeCfg.OddsCfg"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="OddsMin"
                label="最小倍数"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.OddsMin" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="OddsMax"
                label="最大倍数"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.OddsMax" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="Weight"
                label="权重"
                width="200"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.Weight" size="mini" />
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" @click="addBigPrizeCfgRow(scope.$index+1)" size="mini">添加</el-button>
                  <el-button type="primary" @click="delBigPrizeCfgRow(scope.$index)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="info" @click="validData">检查配置</el-button>&nbsp;
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>

      </fieldset>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, DataRule, MoneyShow, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        ScriptSteps:0,
        ScriptNumber:0,
        BigPrizeCfg:{
          TaxPerThousand:0,
          HitPerMillion:0,
          OddsCfg:[]
        },
        OddsCfg: []
      },
      gidOptions: {},
      gameOptions:[],
      queryGid : 82,
      orgDataList:[],
      form: {},
      subKey: 'millionaire_script_cfg',
      libShow: $libShow,
      AttrNames: {
        'Data.ScriptSteps': '单个剧本步数',
        'Data.ScriptNumber': '总剧本数量',
        'Data.OddsCfg': '赔率配置',
        'Data.ScatterHitCfg': ' Scatter中奖次数配置',
        'Data.BigPrizeCfg.TaxPerThousand': ' 下注总金额抽水比例',
        'Data.BigPrizeCfg.HitPerMillion': ' 中奖概率',
        'Data.BigPrizeCfg.OddsCfg': ' 大奖中奖倍数配置',

        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      subKeyMap:{
        '76':'candypartyway',
        '89':'crazy777mars',
        '161':'gigaacemars',
        '94':'chargebison',
        '78':'supergem',
        '80':'candycandy',
        '85':'superacemars',
        '95':'chargebisonmars',
        '158':'sharkkingdom',
        '90':'moneycoming',
        '97':'romanarenamars',
        '153':'aladdinlampmars',
        '77':'candypartyallline',
        '81':'supergemmars',
        '79':'candycandymars',
        '99':'supertongitmars',
        '157':'crazyacemars',
        '154':'grandace',
        '86':'supergemii',
        '84':'superace',
        '88':'crazy777',
        '159':'sharkkingdommars',
        '98':'supertongit',
        '93':'fortuneacegomars',
        '96':'romanarena',
        '155':'grandacemars',
        '163':'majoracemars',
        '150':'supergemiii',
        '82':'millionaire',
        '152':'aladdinlamp',
        '160':'gigaace',
        '156':'crazyace',
        '162':'majorace',
        '87':'supergemiimars',
        '151':'supergemiiimars',
        '83':'millionairemars',
        '92':'fortuneacego',
        '91':'moneycomingmars',
      }
    }
  },
  created() {
    this.getData()
    this.getGameList()
  },
  methods: {
    addOddsCfgRow(row){
      this.item.OddsCfg.splice(row,0, {
        "OddsMin": 0,
        "OddsMax": 0,
        "ScriptSteps": 0,
        "ScriptOddsSum": 0,
        "NormalMatrixCacheSize": 0,
        "ScatterMatrixCacheSize": 0,
        "SwitchScatterPercent": 0,
        "TriggerScatterPercent": 0
      })
    },
    delOddsCfgRow(row){
      this.item.OddsCfg.splice(row,1)
    },
    addBigPrizeCfgRow(row){
      this.item.BigPrizeCfg.OddsCfg.splice(row,0, {
        "OddsMin": 0,
        "OddsMax": 0,
        "Weight": 0
      })
    },
    delBigPrizeCfgRow(row){
      this.item.BigPrizeCfg.OddsCfg.splice(row,1)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      console.log('subKey', this.subKeyMap[this.queryGid])
      return 'CustomizeCfg_' + this.subKeyMap[this.queryGid]
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      return ret
    },
    getData() {
      if (!this.subKeyMap[this.queryGid]){
        Message.error('该游戏尚未配置key')
        this.item={}
        return
      }
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKeyMap[this.queryGid]+"_script_cfg"
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            console.log(this.item)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 199) {
              continue
            }

            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
        }
      })
    },
    getGameName(gid) {
      for (const o of this.gameOptions) {
        if (o.key === parseInt(gid)) {
          return o.label
        }
      }
    },
    async queryKeyInput() {
      this.getData()
    },
    validData() {
      const data = this.getPostData()
      //计算总步数
      let steps = 0, odds = 0, scatterSwitchPercents = 0
      for (const k in data.OddsCfg) {
        steps += data.OddsCfg[k].ScriptSteps
        odds += data.OddsCfg[k].ScriptOddsSum
        scatterSwitchPercents += data.OddsCfg[k].SwitchScatterPercent
        if (data.OddsCfg[k].NormalMatrixCacheSize < 1) {
          Message.error("赔率倍数" + data.OddsCfg[k].OddsMin + '~' + data.OddsCfg[k].OddsMax + "的正常图案缓存数量无效!")
          return
        }
        if (data.OddsCfg[k].SwitchScatterPercent > 0 && data.OddsCfg[k].ScatterMatrixCacheSize < 1) {
          Message.error("赔率倍数" + data.OddsCfg[k].OddsMin + '~' + data.OddsCfg[k].OddsMax + "的Scatter图案缓存数量无效!")
          return
        }
      }
      //Scatter主图案总概率
      if (scatterSwitchPercents !== 100) {
        Message.error("Scatter主图案的总概率之和不是100%！当前值:" + scatterSwitchPercents + '%')
        return
      }
      //计算返回率
      const rtp = odds / 10 / data.ScriptSteps * 100
      if (steps !== data.ScriptSteps) {
        Message.error("剧本总步数有误！当前总步数:" + steps)
      } else if (rtp > 100 || rtp < 50) {
        Message.error("返奖率异常！当前返奖率:" + rtp + '%')
      } else {
        Message.success("当前返奖率:" + rtp + '%')
      }
    }
  }
}
</script>
