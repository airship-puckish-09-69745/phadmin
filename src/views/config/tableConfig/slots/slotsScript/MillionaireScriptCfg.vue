<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" :make-content="makeContent" compare-type="Object" :attr-names="AttrNames"/>


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

          <!-- 大奖配置 开始 -->
          <fieldset style="margin:20px auto;">
            <legend>大奖配置</legend>
            <el-row>
              <el-col :span="8" :offset="4" style="text-align: center;">
                <el-form-item label="下注总金额抽水(千分之一)：">
                  <el-input v-model.number="item.BigPrizeCfg.TaxPerThousand" autosize>
                    <template slot="append">‰(千分之一)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="中奖概率(百万分之一)：">
                  <el-input v-model.number="item.BigPrizeCfg.HitPerMillion">
                    <template slot="append">单位:百万分之一</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="4">
                <el-form-item label="中奖最大间隔(多少次中一次奖)">
                  <el-input v-model.number="item.BigPrizeCfg.HitSteps">
                    <template slot="append">次</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" @click="addBigPrizePlansCfgRow(0)" size="mini">添加</el-button>
            <el-table
              ref="filterTable"
              :data="item.BigPrizeCfg.Plans"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
              :key="itemKey"
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
                    <el-input v-model.number="scope.row.OddsMin" size="mini"
                              oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="OddsMax"
                label="最大倍数"
                width="200"
              >
                <template slot-scope="{}" slot="header">
                  <show-tip head-title="最大倍数" head-tip="0为无限大"></show-tip>
                </template>
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model.number="scope.row.OddsMax" size="mini"
                              oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="OddsMax"
                label="中将倍数配置"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="editOddsCfg(scope.row,scope.$index)" size="mini">配置</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" @click="addBigPrizePlansCfgRow(scope.$index+1)" size="mini">添加</el-button>
                  <el-button type="primary" @click="delBigPrizePlansCfgRow(scope.$index)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <!-- 大奖配置 结束 -->

          <!-- 用户群大奖配置 开始 -->
          <fieldset style="margin:20px auto;">
            <legend>用户群大奖配置</legend>
            <el-row>
              <el-button @click="addGroup">添加新的用户群大奖配置</el-button>
            </el-row>
            <el-table :data="item.BigPrizeGroups" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%; margin: 10px auto;">
              <el-table-column prop="GroupId"  label="分组ID" width="200"><template slot-scope="scope"><el-input v-model.number="scope.row.GroupId" size="mini" /></template></el-table-column>
              <el-table-column prop="GroupName" label="分组名" width="400"><template slot-scope="scope"><el-input v-model="scope.row.GroupName" size="mini" /></template></el-table-column>
              <el-table-column prop="GroupDesc" label="描述" width="400"><template slot-scope="scope"><el-input type="textarea" :rows="3" v-model="scope.row.GroupDesc" size="mini" /></template></el-table-column>
              <el-table-column prop="HitPerMillion" label="中奖率(百万分之一)" width="300"><template slot-scope="scope"><el-input v-model.number="scope.row.HitPerMillion" size="mini" /></template></el-table-column>
              <el-table-column prop="Rules" label="筛选条件" width="400">
                <template slot-scope="scope"><span v-html="groupRules2Text(scope.$index)"></span></template>
              </el-table-column>
              <el-table-column label="操作列表" width="200">
                <template slot-scope="scope">
                  <el-button type="info" @click="editGroupRules(scope.$index)" size="mini">配置</el-button>
                  <el-button type="danger" @click="delGroup(scope.$index)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <!-- 用户群大奖配置 结束 -->

          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </fieldset>
    </el-row>

    <el-dialog
      v-if="detailVisible"
      title="配置详情"
      :visible.sync="detailVisible"
      width="60%">
      <el-row>
        <el-col :offset="0" :span="12">
          <el-button type="primary" @click="addBigPrizePlansOddsCfgRow(0)" size="mini">添加</el-button>
          <el-button type="success" size="mini" @click="closeVisible()">确定</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="showVisibleData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%">
        <el-table-column
          prop="OddsMin"
          label="最小倍数"
          width="200"
        >
          <template slot-scope="scope">
            <el-col :span="20">
              <el-input v-model.number="scope.row.OddsMin" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="OddsMax"
          label="最大倍数"
          width="200"
        >
          <template slot-scope="{}" slot="header">
            <show-tip head-title="最大倍数" head-tip="0为无限大"></show-tip>
          </template>
          <template slot-scope="scope">
            <el-col :span="20">
              <el-input v-model.number="scope.row.OddsMax" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
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
              <el-input v-model.number="scope.row.Weight" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="delBigPrizePlansOddsCfgRow(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 用户群组条件弹窗 开始 -->
    <el-dialog v-if="editGroupFlag" title="用户群筛选条件列表" :visible.sync="editGroupFlag" width="60%">
      <el-row>
        <el-col :offset="0" :span="12">
          <el-button type="info" @click="addGroupRules" size="mini">添加新条件</el-button>
        </el-col>
      </el-row>
      <el-table :data="editGroupRulesData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" style="width: 100%; margin: 10px auto;">
        <el-table-column prop="Days" label="天数" width="100">
          <template slot-scope="scope">
            <el-select v-model.number="scope.row.Days" size="mini" default-first-option>
              <el-option v-for="o in groupDays" :key="o.key" :label="o.label" :value="o.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Field" label="字段" width="200">
          <template slot-scope="scope">
            <el-select v-model.number="scope.row.Field" size="mini" default-first-option>
              <el-option v-for="o in groupFields" :key="o.key" :label="o.label" :value="o.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="BetMin" label="最小单注金额(例:0.003)" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.BetMinStr" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="BetMax" label="最大单注金额(例:0.003)" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.BetMaxStr" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="Operator" label="运算符" width="100">
          <template slot-scope="scope">
            <el-select v-model.number="scope.row.Operator" size="mini" default-first-option>
              <el-option v-for="o in groupOperators" :key="o.key" :label="o.label" :value="o.value"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="Value" label="数值(RTP单位:千分之一)" width="200">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Value" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="Field" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="danger" @click="delGroupRules(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :offset="0" :span="12">
          <el-button type="primary" @click="saveGroupRules" size="mini">保存配置</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 用户群组条件弹窗 结束 -->

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames"/>
    <!-- 对比组件结束 -->
  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import {$libShow, DataRule, ValidateVueItem} from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import ShowTip from "@/components/Tip/showTip.vue";
import XLSX from "xlsx";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {ShowTip, Compare, Publish, BetAmount},
  data() {
    return {
      item: {
        BigPrizeCfg: {
          TaxPerThousand: 0,
          HitPerMillion: 0,
          HitSteps: 0,
          OddsCfg: [],
          Plans: []
        },
        BigPrizeGroups: []
      },
      gidOptions: {},
      gameOptions: [],
      queryGid: 82,
      orgDataList: [],
      form: {},
      subKey: 'millionaire_script_cfg',
      libShow: $libShow,
      AttrNames: {
        'Data.BigPrizeCfg.TaxPerThousand': ' 下注总金额抽水比例',
        'Data.BigPrizeCfg.HitPerMillion': ' 中奖概率',
        'Data.BigPrizeCfg.OddsCfg': ' 大奖中奖倍数配置',
        'Data.BigPrizeGroups': ' 用户群大奖配置',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      detailVisible: false,
      BetOddsPlanDetailVisible: false,
      showVisibleData: [],
      showVisibleIdx: 0,
      itemKey: 0,
      itemKey2: 0,
      itemKeyBet: 0,
      slotCfg: {},
      editGroupFlag: false,
      editGroupIndex: -1,
      editGroupRulesData: [],
      groupFields: [
        {'label': 'RTP', 'value': 1},
        {'label': '下注次数', 'value': 2},
        {'label': '玩牌天数', 'value': 3}
      ],
      groupDays: [
        {'label': '今日', 'value': 1},
        {'label': '最近7天', 'value': 7}
      ],
      groupOperators: [
        {'label': '<=', 'value': 1},
        {'label': '>=', 'value': 2}
      ],
      subKeyMap: {
        '76': 'candypartyway',
        '89': 'crazy777mars',
        '161': 'gigaacemars',
        '94': 'chargebison',
        '78': 'supergem',
        '80': 'candycandy',
        '85': 'superacemars',
        '95': 'chargebisonmars',
        '158': 'sharkkingdom',
        '168': 'pharaohtreasure',
        '169': 'pharaohtreasuremars',
        '90': 'moneycoming',
        '97': 'romanarenamars',
        '153': 'aladdinlampmars',
        '77': 'candypartyallline',
        '174': 'treasurebowl',
        '175': 'treasurebowlmars',
        '81': 'supergemmars',
        '79': 'candycandymars',
        '99': 'supertongitmars',
        '157': 'crazyacemars',
        '154': 'grandace',
        '86': 'supergemii',
        '84': 'superace',
        '88': 'crazy777',
        '159': 'sharkkingdommars',
        '98': 'supertongit',
        '93': 'fortuneacegomars',
        '96': 'romanarena',
        '155': 'grandacemars',
        '163': 'majoracemars',
        '150': 'supergemiii',
        '82': 'millionaire',
        '152': 'aladdinlamp',
        '160': 'gigaace',
        '156': 'crazyace',
        '162': 'majorace',
        '87': 'supergemiimars',
        '151': 'supergemiiimars',
        '83': 'millionairemars',
        '92': 'fortuneacego',
        '91': 'moneycomingmars',
        '164': 'mahjongfortune',
        '170': 'epicace',
        '171': 'epicacemars',
        '166': 'firelink',
        '167': 'firelinkmars',
        '172': 'wrathofzeus',
        '173': 'wrathofzeusmars',
        '176': 'puppyhome',
        '177': 'puppyhomemars',
        '178': 'mayantotem',
        '180': 'fishingmaster',
        '184': 'dancelion',
        '100180': 'fishingmaster_x',
        '181': 'fishingmastermars',
        '182': 'godoffortune',
        '183': 'godoffortunemars',
        '190': 'arcaneegypt',
        '186': 'mahjongjackpot',
        '100186': 'mahjongjackpot_x',
        '188': 'streetfighting',
        '194': 'goldtrain',
        '192': 'bountyraid',
        '196': 'goldminer',
        '198': 'fortuneblessing',
        '200': 'atlantistreasure',
        '202': 'fortunateebisu',
        '204': 'spacetreasure',
        '208': 'candyburst',
        '206': 'luckywineglass',
        '210': 'luckyspirits',
        '216': 'phoenix(v4)',
        '220': 'goldendragon',
        '221': 'goldendragonmars',
        '212': 'pirateship',
        '214': 'pumpkincash',
        '224': 'supermahjong',
        '232': 'mafiamayhem'
      }
    }
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      await this.getConfigData();
      await this.getGameList();
      await this.getData();
    },

    closeVisible() {
      this.detailVisible = false
      this.BetOddsPlanDetailVisible = false
    },

    editOddsCfg(row, idx) {
      this.detailVisible = true
      this.showVisibleData = row.OddsCfg
      this.showVisibleIdx = idx
    },

    addBigPrizePlansCfgRow(row) {
      if (!this.item.BigPrizeCfg.Plans) {
        this.item.BigPrizeCfg['Plans'] = []
      }
      this.item.BigPrizeCfg.Plans.push({
        "OddsMin": 0,
        "OddsMax": 0,
        "OddsCfg": [],
      })
      this.itemKey = Math.random()
    },

    delBigPrizePlansOddsCfgRow(row) {
      this.item.BigPrizeCfg.Plans[this.showVisibleIdx].OddsCfg.splice(row, 1)
    },

    addBigPrizePlansOddsCfgRow() {
      if (!this.item.BigPrizeCfg.Plans) {
        this.item.BigPrizeCfg['Plans'] = []
      }
      this.item.BigPrizeCfg.Plans[this.showVisibleIdx].OddsCfg.push({
        "OddsMin": 0,
        "OddsMax": 0,
        "Weight": 0,
      })
    },

    delBigPrizePlansCfgRow(row) {
      this.item.BigPrizeCfg.Plans.splice(row, 1)
    },

    dataRule(required, config) {
      return DataRule(required, config)
    },

    getFullKey() {
      console.log('subKey', this.subKeyMap[this.queryGid])
      return 'CustomizeCfg_' + this.subKeyMap[this.queryGid] + '_script_cfg'
    },

    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      for (const o of ret.BetOddsPlans) {
        o.TargetBets = []
        const arr = o.TargetBetStr.split(',')
        for (const s of arr) {
          o.TargetBets.push(Number(s) * 1000)
        }
      }
      return ret
    },

    getConfigData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'SlotsScriptStatisticsConfig'
        }
      }).then(response => {
        if (response.Data.Data !== '') {
          let arr = JSON.parse(response.Data.Data)
          for (const o of arr) {
            this.slotCfg[o.Gid] = o
          }
        }
      })
    },

    getData() {
      if (!this.subKeyMap[this.queryGid]) {
        Message.error('该游戏尚未配置key')
        this.item = {BigPrizeGroups: []}
        return
      }
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKeyMap[this.queryGid] + "_script_cfg"
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            if (typeof item['BigPrizeGroups'] == 'undefined') {
              item['BigPrizeGroups'] = []
            }
            Object.assign(this.item, item)
            for (const itemElement of item.BetOddsPlans) {
              let str = ''
              for (const o of itemElement.TargetBets) {
                str += o / 1000 + ','
              }
              itemElement['TargetBetStr'] = str.substring(0, str.length - 1)
            }
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },

    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      if (!this.checkBigPrizeGroup()) {
        return false
      }
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function (isEdit) {
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

    makeContent(key, addData, delData, editData) {
      // console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      return '【'+this.getGameName(this.queryGid)+'】'
    },

    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        let optionArr = []
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
           if (response.Data[i].CategoryID != 1) {
              continue
            }
            optionArr.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
          optionArr.push({ key: 100180, label: 'Fishing Master(额外加注)' })
          optionArr.push({ key: 100186, label: 'Mahjong Jackpot(额外加注)' })
        }

        // 排序
        optionArr.sort((a, b) => {
            return a.label.localeCompare(b.label)
          })
          this.gameOptions = optionArr
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

    //用户群组条件转为描述文字
    groupRules2Text(idx) {
      let txt = ''
      for (const k in this.item.BigPrizeGroups[idx].Rules) {
        const rule = this.item.BigPrizeGroups[idx].Rules[k]
        for (const kk in this.groupDays) {
          if (rule.Days == this.groupDays[kk].value) {
            txt += this.groupDays[kk].label + ' '
          }
        }
        for (const kk in this.groupFields) {
          if (rule.Field == this.groupFields[kk].value) {
            txt += this.groupFields[kk].label + ' '
          }
        }
        if (rule.BetMin > 0 && rule.BetMax > 0) {
          txt += '[' + this.number2money(rule.BetMin) + ' ~ ' + this.number2money(rule.BetMax) + '] '
        }
        for (const kk in this.groupOperators) {
          if (rule.Operator == this.groupOperators[kk].value) {
            txt += this.groupOperators[kk].label + ' '
          }
        }
        txt += rule.Value + '<br />'
      }
      return txt
    },

    //添加用户群组配置
    addGroup() {
      this.item.BigPrizeGroups.push({
        GroupId: this.item.BigPrizeGroups.length+1,
        GroupName: '未命名',
        GroupDesc: '请添加说明',
        HitPerMillion: 25,
        Rules: []
      })
    },

    //删除用户群组配置
    delGroup(idx) {
      this.$delete(this.item.BigPrizeGroups, idx)
    },

    //编辑用户群组条件
    editGroupRules(idx) {
      this.editGroupFlag = true
      this.editGroupIndex = idx
      this.editGroupRulesData = this.item.BigPrizeGroups[idx].Rules
      for (const k in this.editGroupRulesData) {
        if (this.editGroupRulesData[k].BetMin == 0) {
          this.editGroupRulesData[k].BetMinStr = '不限'
        } else {
          this.editGroupRulesData[k].BetMinStr = this.number2money(this.editGroupRulesData[k].BetMin)
        }
        if (this.editGroupRulesData[k].BetMax == 0) {
          this.editGroupRulesData[k].BetMaxStr = '不限'
        } else {
          this.editGroupRulesData[k].BetMaxStr = this.number2money(this.editGroupRulesData[k].BetMax)
        }
      }
    },

    //保存用户群组条件
    saveGroupRules() {
      if (this.editGroupIndex < 0) {
        return
      }
      //转换单注金额为数值
      let cnt = 1
      for (const k in this.editGroupRulesData) {
        //单注金额最小值
        if (this.editGroupRulesData[k].BetMinStr === '' || this.editGroupRulesData[k].BetMinStr === '不限') {
          this.editGroupRulesData[k].BetMin = 0
        } else if (/[^\d\.]/.test(this.editGroupRulesData[k].BetMinStr)) {
          Message.error('条件 ' + cnt + ' 单注金额最小值无效!')
          return
        } else {
          this.editGroupRulesData[k].BetMin = Math.floor(parseFloat(this.editGroupRulesData[k].BetMinStr) * 1000)
        }
        //单注金额最大值
        if (this.editGroupRulesData[k].BetMaxStr === '' || this.editGroupRulesData[k].BetMaxStr === '不限') {
          this.editGroupRulesData[k].BetMax = 0
        } else if (/[^\d\.]/.test(this.editGroupRulesData[k].BetMaxStr)) {
          Message.error('条件 ' + cnt + ' 单注金额最大值无效!')
          return
        } else {
          this.editGroupRulesData[k].BetMax = Math.floor(parseFloat(this.editGroupRulesData[k].BetMaxStr) * 1000)
        }
        //条件值
        if (/\D/.test(this.editGroupRulesData[k].Value)) {
          Message.error('条件 ' + cnt + ' 条件值无效!')
          return
        }
        cnt++
      }
      //验证数据有效性
      if (!this.checkBigPrizeGroupRules(this.item.BigPrizeGroups[this.editGroupIndex].GroupId, this.editGroupRulesData)) {
        return
      }
      //更新数据
      this.item.BigPrizeGroups[this.editGroupIndex].Rules = this.editGroupRulesData
      this.editGroupFlag = false
      this.editGroupIndex = -1
    },

    //添加用户群组条件
    addGroupRules() {
      this.editGroupRulesData.push({
        'Field': 1,
        'Days': 1,
        'BetMin': 0,
        'BetMinStr': '不限',
        'BetMax': 0,
        'BetMaxStr': '不限',
        'Operator': 1,
        'Value': 0
      })
    },

    //删除用户群组条件
    delGroupRules(idx) {
      this.$delete(this.editGroupRulesData, idx)
    },

    //验证用户群配置
    checkBigPrizeGroup() {
      //先按分组ID排序
      this.item.BigPrizeGroups.sort(function (a, b ) {
        return a.GroupId < b.GroupId
      })
      //检查每一个分组的数据
      let groupIdLast = 0
      for (const k in this.item.BigPrizeGroups) {
        const group = this.item.BigPrizeGroups[k]
        //检查分组ID是否有重复
        if (group.GroupId == groupIdLast) {
          Message.error('用户群配置的分组ID ' + groupIdLast + ' 有重复，请检查配置！')
          return false
        } else {
          groupIdLast = group.GroupId
        }
        //检查分组名是否为空
        if (group.GroupName == '') {
          Message.error('用户群分组 #' + group.GroupId + ' 名称为空！')
          return false
        }
        //检查命中率
        if (group.HitPerMillion < 0 || group.HitPerMillion > 1000000) {
          Message.error('用户群分组 #' + group.GroupId + ' 的命中率无效，有效值范围：0~1000000！')
          return false
        }
        //检查条件
        if (group.Rules.length == 0) {
          Message.error('用户群分组 #' + group.GroupId + ' 没有设置任何筛选条件！')
          return false
        }
        //检查每一个条件
        if (!this.checkBigPrizeGroupRules(group.GroupId, group.Rules)) {
          return false
        }
      }
      return true
    },

    //验证用户群配置的过滤规则
    checkBigPrizeGroupRules(groupId, rules) {
      let m = {}
      let cnt = 1
      for (const kk in rules) {
        //检查条件是否有重复
        const uniqKey = rules[kk].Field + '_' + rules[kk].Days + '_' + rules[kk].BetMin + '_' + rules[kk].BetMax
        if (typeof m[uniqKey] != 'undefined') {
          Message.error('用户群分组 #' + groupId + ' 的条件 ' + cnt + ' 与之前的条件出现重复!')
          return false
        } else {
          m[uniqKey] = 1
        }
        //检查单注范围是否有效
        if (rules[kk].BetMin < 0) {
          Message.error('用户群分组 #' + groupId + ' 的条件 ' + cnt + ' 单注金额最小值无效!')
          return false
        }
        if (rules[kk].BetMax > 0 && rules[kk].BetMax < rules[kk].BetMin) {
          Message.error('用户群分组 #' + groupId + ' 的条件 ' + cnt + ' 单注金额最大值无效!')
          return false
        }
        //检查数值是否有效
        if (rules[kk].Value < 0) {
          Message.error('用户群分组 #' + groupId + ' 的条件 ' + cnt + ' 条件值无效!')
          return false
        }
        cnt++
      }
      return true
    },

    //数字转为金额
    number2money(n) {
      const v = n / 1000
      if (n % 1000 == 0) {
        return v.toFixed(0)
      } else if (n % 100 == 0) {
        return v.toFixed(1)
      } else if (n % 10 == 0) {
        return v.toFixed(2)
      } else {
        return v.toFixed(3)
      }
    }
  }
}
</script>


