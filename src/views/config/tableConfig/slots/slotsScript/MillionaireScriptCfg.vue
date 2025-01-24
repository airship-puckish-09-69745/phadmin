<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames"/>


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
            <el-row>
              <el-col :span="1">
                <el-tooltip content="检查剧本:最小倍数*出现次数<= 倍数总和 >=最大倍数*出现次数" class="item"
                            effect="dark" placement="top">
                  <el-button type="primary" @click="validateDteOddsSum" size="mini" style="background: #ff9100">
                    检查倍数总和区间
                  </el-button>
                </el-tooltip>
              </el-col>
              <el-col :offset="1" :span="3">
                <el-tooltip content="xlsx/xls文件,只导入前四列，格式保持一致,需要首行标题" effect="dark" placement="top">
                  <input type="file" @change="handleFileUpload1" accept=".xlsx, .xls" size="mini"></input>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-table
              ref="filterTable"
              :data="item.OddsCfg"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
              :key="itemKeyBet"
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
                    <el-input v-model.number="scope.row.OddsMin" size="mini"/>
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
                    <el-input v-model.number="scope.row.OddsMax" size="mini"/>
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
                    <el-input v-model.number="scope.row.ScriptSteps" size="mini"/>
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
                    <el-input v-model.number="scope.row.ScriptOddsSum" size="mini"/>
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
                    <el-input v-model.number="scope.row.NormalMatrixCacheSize" size="mini"/>
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
                    <el-input v-model.number="scope.row.ScatterMatrixCacheSize" size="mini"/>
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
                    <el-input v-model.number="scope.row.SwitchScatterPercent" size="mini">
                      <template slot="append">%</template>
                    </el-input>
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
                    <el-input v-model.number="scope.row.TriggerScatterPercent" size="mini">
                      <template slot="append">%</template>
                    </el-input>
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
                    <el-input v-model.number="scope.row.HitTimes" size="mini"/>
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
                    <el-input v-model.number="scope.row.PerTenThousand" size="mini">
                      <template slot="append">单位:万分之一</template>
                    </el-input>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
          <!--          <fieldset style="margin:20px auto;">-->
          <!--            <legend>大奖配置</legend>-->
          <!--            <el-form-item label="下注总金额抽水(千分之一)：">-->
          <!--              <el-input v-model.number="item.BigPrizeCfg.TaxPerThousand" autosize>-->
          <!--                <template slot="append">‰(千分之一)</template>-->
          <!--              </el-input>-->
          <!--            </el-form-item>-->
          <!--            <el-form-item label="中奖概率(百万分之一)：">-->
          <!--              <el-input v-model.number="item.BigPrizeCfg.HitPerMillion">-->
          <!--                <template slot="append">单位:百万分之一</template>-->
          <!--              </el-input>-->
          <!--            </el-form-item>-->
          <!--            <el-table-->
          <!--              ref="filterTable"-->
          <!--              :data="item.BigPrizeCfg.OddsCfg"-->
          <!--              stripe-->
          <!--              border-->
          <!--              :header-cell-style="libShow.DefaultTableHeadClass"-->
          <!--              :row-style="{height:'10px'}"-->
          <!--              :cell-style="libShow.DefaultTableCell"-->
          <!--              style="width: 100%"-->
          <!--            >-->
          <!--              <el-table-column-->
          <!--                type="index"-->
          <!--                width="50"-->
          <!--              />-->
          <!--              <el-table-column-->
          <!--                prop="OddsMin"-->
          <!--                label="最小倍数"-->
          <!--                width="200"-->
          <!--              >-->
          <!--                <template slot-scope="scope">-->
          <!--                  <el-col :span="20">-->
          <!--                    <el-input v-model.number="scope.row.OddsMin" size="mini"/>-->
          <!--                  </el-col>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column-->
          <!--                prop="OddsMax"-->
          <!--                label="最大倍数"-->
          <!--                width="200"-->
          <!--              >-->
          <!--                <template slot-scope="scope">-->
          <!--                  <el-col :span="20">-->
          <!--                    <el-input v-model.number="scope.row.OddsMax" size="mini"/>-->
          <!--                  </el-col>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column-->
          <!--                prop="Weight"-->
          <!--                label="权重"-->
          <!--                width="200"-->
          <!--              >-->
          <!--                <template slot-scope="scope">-->
          <!--                  <el-col :span="20">-->
          <!--                    <el-input v-model.number="scope.row.Weight" size="mini"/>-->
          <!--                  </el-col>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column>-->
          <!--                <template slot-scope="scope">-->
          <!--                  <el-button type="primary" @click="addBigPrizeCfgRow(scope.$index+1)" size="mini">添加</el-button>-->
          <!--                  <el-button type="primary" @click="delBigPrizeCfgRow(scope.$index)" size="mini">删除</el-button>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--            </el-table>-->
          <!--          </fieldset>-->
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
          <fieldset style="margin:20px auto;">
            <legend>赔率配置方案</legend>
            <el-button type="primary" @click="addBetOddsPlansRow(0)" size="mini">添加</el-button>
            <el-table
              ref="filterTable"
              :data="item.BetOddsPlans"
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
                prop="TargetBets"
                label="备注"
              >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model="scope.row.Desc" size="mini"/>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="TargetBets"
                label="目标下注金额列表"
              >
                <template slot-scope="{}" slot="header">
                  <show-tip head-title="目标下注金额列表" head-tip="英文逗号分割:1,2,3"></show-tip>
                </template>
                <template slot-scope="scope">
                  <el-col :span="20">
                    <el-input v-model="scope.row.TargetBetStr" size="mini"/>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="TargetBets"
                label="目标下注金额列表"
              >

                <template slot-scope="scope">
                  <el-col :span="20">
                    {{ showTargetBetStr(scope.row.TargetBetStr) }}
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                prop="TargetBets"
                label="详细倍数配置"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="editBetOddsPlans(scope.row,scope.$index)" size="mini">编辑
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" @click="addBetOddsPlansRow(scope.$index+1)" size="mini">添加</el-button>
                  <el-button type="primary" @click="delBetOddsPlansRow(scope.$index)" size="mini">删除</el-button>
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
    <compare ref="compare" :attr-names="AttrNames"/>
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
    <el-dialog
      v-if="BetOddsPlanDetailVisible"
      title="配置详情"
      :visible.sync="BetOddsPlanDetailVisible"
      width="60%">
      <el-row>
        <el-col :offset="0" :span="6">
          <el-button type="primary" @click="addBetOddsPlansCfgRow(0)" size="mini">添加</el-button>
          <el-button type="success" size="mini" @click="closeVisible()">确定</el-button>
        </el-col>
        <el-col :offset="2" :span="8">
          <el-tooltip content="当前倍数总和/剧本步数*基础投注" effect="dark" placement="top">
            <el-button type="primary" @click="checkBetPlans()" size="mini" style="background-color:#ff8000">检查
            </el-button>
          </el-tooltip>
          <el-tooltip content="最小倍数*出现个数<=剧本总和" effect="dark" placement="top">
            <el-button type="primary" @click="checkBetPlansSum()" size="mini" style="background-color:#b600ff">检查
            </el-button>
          </el-tooltip>

        </el-col>
        <el-col :offset="3" :span="3">
          <el-tooltip content="xlsx/xls文件,格式保持一致,需要首行标题" effect="dark" placement="top">
            <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" size="mini"></input>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-table
        :data="showVisibleData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        :key="itemKey2"
      >
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
          <template slot-scope="scope">
            <el-col :span="20">
              <el-input v-model.number="scope.row.OddsMax" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="ScriptSteps"
          label="在剧本中出现的个数"
          width="200"
        >
          <template slot-scope="scope">
            <el-col :span="20">
              <el-input v-model.number="scope.row.ScriptSteps" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="ScriptSteps"
          label="在剧本中的倍数总和"
          width="200"
        >
          <template slot-scope="scope">
            <el-col :span="20">
              <el-input v-model.number="scope.row.ScriptOddsSum" size="mini"
                        oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-button type="primary" @click="delBetOddsPlansCfgRow(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
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
        ScriptSteps: 0,
        ScriptNumber: 0,
        BigPrizeCfg: {
          TaxPerThousand: 0,
          HitPerMillion: 0,
          HitSteps: 0,
          OddsCfg: [],
          Plans: []
        },
        OddsCfg: [],
        BetOddsPlans: [],
      },
      gidOptions: {},
      gameOptions: [],
      queryGid: 82,
      orgDataList: [],
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
      detailVisible: false,
      BetOddsPlanDetailVisible: false,
      showVisibleData: [],
      showVisibleIdx: 0,
      itemKey: 0,
      itemKey2: 0,
      itemKeyBet: 0,
      slotCfg: {},
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
        '164':'mahjongfortune',
        '170': 'epicace',
        '171': 'epicacemars',
        '166': 'firelink',
        '167': 'firelinkmars',
        '172': 'wrathofzeus',
        '173': 'wrathofzeusmars',
        '176': 'puppyhome',
        '177': 'puppyhomemars',
        '178': 'mayantotem',
        '182': 'godoffortune',
        '183': 'godoffortunemars'
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
    addOddsCfgRow(row) {
      this.item.OddsCfg.splice(row, 0, {
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
    delOddsCfgRow(row) {
      this.item.OddsCfg.splice(row, 1)
    },
    addBigPrizeCfgRow(row) {
      this.item.BigPrizeCfg.OddsCfg.splice(row, 0, {
        "OddsMin": 0,
        "OddsMax": 0,
        "Weight": 0
      })
    },
    delBigPrizeCfgRow(row) {
      this.item.BigPrizeCfg.OddsCfg.splice(row, 1)
    },
    validateDteOddsSum() {
      let str = ''
      for (const i in this.item.OddsCfg) {
        let obj = this.item.OddsCfg[i]
        if (obj.OddsMin * obj.ScriptSteps <= obj.ScriptOddsSum && obj.ScriptOddsSum <= obj.OddsMax * obj.ScriptSteps) {
        } else {
          let a = Number(i) + 1
          str += `第${a}行数据校验不通过\n`
        }
      }
      if (str.length > 0) {
        this.$message.error(str)
      } else {
        this.$message.success('检查通过')
      }
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
    addBetOddsPlansRow(row) {
      if (!this.item.BetOddsPlans) {
        this.item['BetOddsPlans'] = []
      }
      this.item.BetOddsPlans.push({
        "TargetBets": [],
        "OddsCfg": [],
        "TargetBetStr": "",
      })
      this.itemKey = Math.random()
    },
    delBetOddsPlansRow(row) {
      this.item.BetOddsPlans.splice(row, 1)
    },
    editBetOddsPlans(row, idx) {
      this.BetOddsPlanDetailVisible = true
      this.showVisibleData = row.OddsCfg
      this.showVisibleIdx = idx
    },
    showTargetBetStr(str) {
      if (str.length === '') {
        return ''
      }
      if (!this.slotCfg[this.queryGid]) {
        return '当你看到这行字时,说明剧本监控没有配置,需要从配置中获取基础下注倍数'
      }
      let arr = str.split(',')
      let cfg = this.slotCfg[this.queryGid]
      let ret = ''
      for (const s of arr) {
        ret += Number(s) * Number(cfg.Bet) + ','
      }
      return ret.substring(0, ret.length - 1)
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
    addBetOddsPlansCfgRow() {
      if (!this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg) {
        this.item.BetOddsPlans[this.showVisibleIdx]['OddsCfg'] = []
      }
      this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg.push({
        "OddsMin": 0,
        "OddsMax": 0,
        "ScriptSteps": 0,
        "ScriptOddsSum": 0,
      })
      this.itemKey2 += 1
    },
    delBetOddsPlansCfgRow(row) {
      this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg.splice(row, 1)
      this.itemKey2 += 1
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
        this.item = {}
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
    checkBetPlans() {
      let cnt = 0
      for (const o of this.showVisibleData) {
        cnt += o.ScriptOddsSum
      }
      Message.success('当前百分比：' + (cnt / (this.item.ScriptSteps * Number(this.slotCfg[this.queryGid].Bet)) * 100).toFixed(3) + '%')
    },
    checkBetPlansSum() {
      let str = ''
      for (const o of this.showVisibleData) {
        if ((o.OddsMin * o.ScriptSteps) > o.ScriptOddsSum) {
          str += '最小倍数:' + o.OddsMin + ' 出现步数:' + o.ScriptSteps + ' 倍数总和:' + o.ScriptOddsSum
        }
      }
      if (str.length <= 0) {
        Message.success("数据ok的！" + str)
      } else {
        Message.error('数据异常:' + str)
      }
    },
    handleFileUpload1(event) {
      const file = event.target.files[0];
      if (file) {
        this.ImportExcel1(file);
      }
    },
    ImportExcel1(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        this.item.OddsCfg = []
        // let org = JSON.parse(JSON.stringify( this.item.OddsCfg));
        json.forEach((row, index) => {
          if (index > 0) {
            let idx = index-1
            console.log(index,idx,row)
            this.item.OddsCfg[idx]= {
              "OddsMin": row[0]?row[0]:0,
              "OddsMax":  row[1]?row[1]:0,
              "ScriptSteps":  row[2]?row[2]:0,
              "ScriptOddsSum":  row[3]?row[3]:0,
              "NormalMatrixCacheSize":  row[4]?row[4]:0,
              "ScatterMatrixCacheSize":row[5]?row[5]:0,
              "SwitchScatterPercent": row[6]?row[6]:0,
              "TriggerScatterPercent": row[7]?row[7]:0,
            }
          }
          this.showVisibleData = this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg
          this.itemKeyBet += 1
        });
      };

      reader.readAsArrayBuffer(file);
    },


    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.ImportExcel(file);
      }
    },
    ImportExcel(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg = []
        json.forEach((row, index) => {
          if (index > 0) {
            this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg.push({
              "OddsMin": row[0],
              "OddsMax": row[1],
              "ScriptSteps": row[2],
              "ScriptOddsSum": row[3],
            })
            console.log(`Row ${index + 1}:`, row);
          }
          this.showVisibleData = this.item.BetOddsPlans[this.showVisibleIdx].OddsCfg
          this.itemKey2 += 1
        });
      };

      reader.readAsArrayBuffer(file);
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
      const rtp10 = odds / (10 * data.ScriptSteps) * 100
      const rtp100 = odds / (100 * data.ScriptSteps) * 100
      if (steps !== data.ScriptSteps) {
        Message.error("剧本总步数有误！当前总步数:" + steps)
      } else {
        Message.success("10倍投返奖率:" + rtp10 + '%, 100倍投返奖率:' + rtp100 + '%')
      }
    }
  }
}
</script>
