<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="Bonus图标的倍率配置">
            <el-input v-model="cfg.BonusOdds" placeholder="请输入内容,如5,8,10,12,15,20,40">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="普通模式Bonus倍率权重">
            <el-input v-model="cfg.BonusOddsWeight" placeholder="值个数与倍率配置一样">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Bonus模式Bonus倍率权重">
            <el-input v-model="cfg.BonusOddsWeight2" placeholder="值个数与倍率配置一样">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Bonus模式Bonus出现概率" prop="BonusSymbolRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BonusSymbolRate" :required="true">
              <template slot="append">％</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Bonus解锁行所需数量">
            <el-input v-model="cfg.BonusColCount" placeholder="请输入内容,如4,8,12,16">
              <template slot="append">四个值用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="进入Bonus/免费模式权重">
            <el-input v-model="cfg.BonusWeight" placeholder="请输入内容,如5,8,10">
              <template slot="append">普通,Bonus,免费</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Jackpot倍数范围">
            <el-input v-model="cfg.JackpotOddsV2" placeholder="请输入内容,如250,1000,1000,2000">
              <template slot="append">用 , 连接。如250,1000,1000,2000表示250,1000和1000,2000</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Jackpot抽水比例" prop="JackpotFeeRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.JackpotFeeRate" :required="true">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Jackpot抽水权重">
            <el-input v-model="cfg.JackpotFeeWeightStr" placeholder="请输入内容,如2,4">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="免费模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="进入特殊模式最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750">
              <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买免费模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50">
              <template slot="append">三个值一组用 , 连接。</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-table
          ref="filterTable"
          :data="cfg.BonusSpinCfg"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          :key="itemKey"
        >
          <el-table-column
            type="index"
            width="80px"
          >
            <template #header>
              <el-button type="primary" @click="addBonusSpinCfgRow(0)" size="mini">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="OddsMin"
            label="倍数区间开始值"
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
            label="倍数区间结束值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMax" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </template>
          </el-table-column>
          <el-table-column
            label="需要中奖的次数"
            width="200"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.HitTimes" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </template>
          </el-table-column>
          <el-table-column
            label="最少不中奖的次数(不包括末尾三次)"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.MissTimesMin" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </template>
          </el-table-column>
          <el-table-column
            label="最多不中奖的次数(不包括末尾三次)"
          >
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.MissTimesMax" size="mini" oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="OddsMax"
            label="图标配置"
            width="200"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="editOddsCfg(scope.row,scope.$index)" size="mini">配置</el-button>
            </template>
          </el-table-column>
          <el-table-column label="删除">
            <template slot-scope="scope">
              <el-button type="primary" @click="delBonusSpinCfgRow(scope.$index)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-if="detailVisible"
      title="配置详情"
      :visible.sync="detailVisible"
      width="60%">
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
          type="index"
          width="80px"
        >
          <template #header>
            <el-button type="primary" @click="addIconsCfgRow(0)" size="mini">添加</el-button>
          </template>
        </el-table-column>
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

            <el-button type="primary" @click="delIconsCfgRow(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
    <!--对比组件-->
    <compare ref="compare"/>
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import {$libShow, DataRule, ValidateVueItem} from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsFireLinkExt',
  components: {RatioInput, Compare},
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {},
      libShow: $libShow,
      itemKey: 0,
      itemKey2: 0,
      detailVisible: false,
      showVisibleData: [],
      showVisibleIdx: 0,
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    editOddsCfg(row, idx) {
      this.detailVisible = true
      this.showVisibleData = row.Icons
      this.showVisibleIdx = idx
    },
    addIconsCfgRow() {
      if (!this.cfg.Icons) {
        this.cfg['Icons'] = []
      }
      this.cfg.BonusSpinCfg[this.showVisibleIdx].Icons.push({
        "BonusRates": 0,
        "Weight": 0,
      })
      this.itemKey2+=1
    },
    delIconsCfgRow(val) {
      this.cfg.BonusSpinCfg[this.showVisibleIdx].Icons.splice(val, 1)
    },
    addBonusSpinCfgRow() {
      if (!this.cfg.BonusSpinCfg) {
        this.cfg['BonusSpinCfg'] = []
      }
      this.cfg.BonusSpinCfg.push({
        "OddsMin": 0,
        "OddsMax": 0,
        "HitTimes": 0,
        "MissTimesMin": 0,
        "MissTimesMax": 0,
        "Icons": []
      })
      this.itemKey+=1
    },
    delBonusSpinCfgRow(val) {
      this.cfg.BonusSpinCfg.splice(val, 1)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    getNewBonusSpinCfg() {
      return {
        "OddsMin": 0,
        "OddsMax": 0,
        "HitTimes": 0,
        "MissTimesMin": 0,
        "MissTimesMax": 0,
        "Icons": [
          {
            "BonusRates": 0,
            "Weight": 0
          }
        ]
      }
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>
