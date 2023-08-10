<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="18" :offset="4">
      <el-row>
        <el-divider content-position="left">新手帮助配置</el-divider>
        <el-descriptions
          class="margin-top"
          :column="4"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              局数<
              <el-tooltip class="item" effect="dark" content="新手条件：玩牌X局数以内 / 流水小于多少 / 充值小于多少" placement="top-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
            <el-input v-model.number="cfgData.Newbie.TimesLimit" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="流水<">
            <el-input v-model.number="cfgData.Newbie.MoneyLimit" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="充值<">
            <el-input v-model.number="cfgData.Newbie.PayLimit" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="采用剧本">
            <el-select v-model.number="cfgData.Newbie.ActSheetIdx" size="mini" placeholder="请选择">
              <el-option label="0" :value="0" />
              <el-option label="10" :value="1" />
              <el-option label="20" :value="2" />
              <el-option label="30" :value="3" />
              <el-option label="40" :value="4" />
              <el-option label="50" :value="5" />
              <el-option label="60" :value="6" />
              <el-option label="70" :value="7" />
              <el-option label="80" :value="8" />
              <el-option label="90" :value="9" />
              <el-option label="100" :value="10" />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              帮助局数
              <el-tooltip class="item" effect="dark" content="在所有slots前N局中，每局有一定概率触发帮助" placement="top-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
            <el-input v-model.number="cfgData.Newbie.Times" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="帮助概率">
            <el-input v-model.number="cfgData.Newbie.Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="最小金额">
            <el-input v-model.number="cfgData.Newbie.Min" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="最大金额">
            <el-input v-model.number="cfgData.Newbie.Max" size="mini" />
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
      <el-divider content-position="left">免费玩家配置</el-divider>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="金币<">
          <el-input v-model.number="cfgData.Free.Money" size="mini" />
        </el-descriptions-item>
        <el-descriptions-item label="帮助概率">
          <el-input v-model.number="cfgData.Free.Rate" size="mini">
            <template slot="append">%</template>
          </el-input>
        </el-descriptions-item>
        <el-descriptions-item label="每日机会数">
          <el-input v-model.number="cfgData.Free.Times" size="mini" />
        </el-descriptions-item>
        <el-descriptions-item label="帮助CD">
          <el-input v-model.number="cfgData.Free.CD" size="mini" />
        </el-descriptions-item>
        <el-descriptions-item label="最小金额">
          <el-input v-model.number="cfgData.Free.Min" size="mini" />
        </el-descriptions-item>
        <el-descriptions-item label="最大金额">
          <el-input v-model.number="cfgData.Free.Max" size="mini" />
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">免费玩家控制</el-divider>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="身上金币>X进入控制">
          <el-input v-model.number="cfgData.FreeControl.TriggerMoney" size="mini" />
        </el-descriptions-item>
        <el-descriptions-item label="身上金币<X脱离控制">
          <el-input v-model.number="cfgData.FreeControl.OutMoney" size="mini"/>
        </el-descriptions-item>
        <el-descriptions-item label="采用剧本">
          <el-select v-model.number="cfgData.FreeControl.ActSheetIdx" size="mini" placeholder="请选择">
            <el-option label="0" :value="0" />
            <el-option label="10" :value="1" />
            <el-option label="20" :value="2" />
            <el-option label="30" :value="3" />
            <el-option label="40" :value="4" />
            <el-option label="50" :value="5" />
            <el-option label="60" :value="6" />
            <el-option label="70" :value="7" />
            <el-option label="80" :value="8" />
            <el-option label="90" :value="9" />
            <el-option label="100" :value="10" />
          </el-select>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">付费玩家配置</el-divider>
      <el-table
        ref="filterTable"
        :data="cfgData.Pay.Help"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Amount"
          label="累计充值"
          width="100"
        />
        <el-table-column
          prop="PayRatio"
          label="充值系数%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.PayRatio" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="dangerHelp"
          label="危险帮助%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.DangerHelp" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="HelpCount"
          label="帮助次数"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.HelpCount" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="HelpCD"
          label="帮助CD"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.HelpCD" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="HelpRate"
          label="帮助概率%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.HelpRate" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="PoolRate"
          label="底池比例%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.PoolRate" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="HelpLimit"
          label="帮助限额"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.HelpLimit" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="DangerControl"
          label="危险控制%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.DangerControl" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="SkipWinOddsRate"
          label="跳过正数倍率概率%"
          width="100"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.SkipWinOddsRate" size="mini"/>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :offset="16" :span="8">
        <el-button type="primary" @click="setData">保存</el-button>
    </el-col>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfgData: {
        Newbie: {
          TimesLimit: 10,
          MoneyLimit: 200,
          PayLimit: 100,
          ActSheetIdx: 1,
          Times: 50,
          Rate: 30,
          Min: 50,
          Max: 100
        },
        Free: {
          Money: 200,
          Rate: 30,
          Times: 0,
          Min: 50,
          Max: 100,
          CD: 0,
        },
        FreeControl: {
          TriggerMoney: 200,
          OutMoney: 300,
          ActSheetIdx: 1
        },
        Pay: {
          PayRatio: 1,
          DangerHelp: 50,
          DangerControl: 80,
          Help: [
            { Amount: 100, PayRatio: 94, DangerHelp: 10, HelpCount: 1, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 500, PayRatio: 94, DangerHelp: 0.5, HelpCount: 2, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 1000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 3, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 5000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 4, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 10000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 5, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 20000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 6, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 50000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 7, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 100000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 8, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 },
            { Amount: 500000, PayRatio: 94, DangerHelp: 0.5, HelpCount: 9, HelpCD: 10, PoolRate: 10, HelpLimit: 30, DangerControl: 200, HelpRate: 50, SkipWinOddsRate: 30 }
          ]
        }
      },
      form: {},
      libShow: $libShow,
      subKey: 'slotsActCommon',

      AttrNames: {
        'Data': '索引',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    console.log(1)
    this.getData()
  },
  methods: {
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
          $this.form = response.Data || { Data: '{}' }
          const o = JSON.parse(this.form.Data)
          this.cfgData = o

          // 设置修改之前数据
         this.$refs.compare.SetOldVal(this.form)
        }
      })
    },
    setData() {
      const postData = $libType.DeepCopy(this.cfgData)


      console.log('postData', postData)

      this.form.Data = JSON.stringify(postData)
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
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
