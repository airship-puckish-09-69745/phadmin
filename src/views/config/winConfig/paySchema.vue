<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="12" :offset="4">
      <el-form ref="cfgData" :model="cfgData" label-width="200px">

        <fieldset style="margin:30px auto;">
          <legend>邀请提现到游戏账号</legend>
          <el-form-item label="基础值增加提取额度%" prop="InviteWithdrawAddBaseValueRate" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.InviteWithdrawAddBaseValueRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="winnings控制线增加提取额度%" prop="InviteWithdrawAddWinningRate" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.InviteWithdrawAddWinningRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>加基础值比例</legend>
          <el-form-item label="赢" prop="WinBaseValueRate" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.WinBaseValueRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输" prop="LoseBaseValueRate" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.LoseBaseValueRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平" prop="AvgBaseValueRate" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.AvgBaseValueRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>触线后winnings扣除倍数</legend>
          <el-form-item label="赢" prop="WinningsWinMul" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.WinningsWinMul" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输" prop="WinningsLoseMul" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.WinningsLoseMul" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平" prop="WinningsAvgMul" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.WinningsAvgMul" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="基础值二次衰减%" prop="BaseValueReduce" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.BaseValueReduce" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>输+3标签调控结果概率</legend>
          <el-form-item label="赢" prop="Lose3Win" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose3Win" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输" prop="Lose3Lose" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose3Lose" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平" prop="Lose3Avg" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose3Avg" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>输+2标签调控结果概率</legend>
          <el-form-item label="赢" prop="Lose2Win" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose2Win" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输" prop="Lose2Lose" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose2Lose" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平" prop="Lose2Avg" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Lose2Avg" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>赢+1标签调控结果概率</legend>
          <el-form-item label="赢" prop="Win1Win" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Win1Win" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输" prop="Win1Lose" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Win1Lose" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平" prop="Win1Avg" :rules="dataRule(true,{type:'n',range:'-100-100'})">
            <el-col :span="12">
              <el-input v-model.number="cfgData.Win1Avg" :required="true" placeholder="" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset style="margin:30px auto;">
          <legend>首充配置</legend>

          <el-table
            :data="cfgData.Items[0].WinningsOptions"
            style="width: 100%"
          >
            <el-table-column
              prop="Amount"
              label="充值额度"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Amount" readonly="true" placeholder="placeholder" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Win"
              label="winnings"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Win" placeholder="placeholder" />
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <fieldset v-for="(row,index) in cfgData.Items" v-if="index > 0" style="margin:30px auto;">
          <legend>总充值大于{{ row.TotalRecharge }}</legend>

          <el-form-item label="总充值大于" :required="true">
            <el-col :span="12">
              <el-input v-model.number="row.TotalRecharge" />
            </el-col>
          </el-form-item>

          <el-form-item label="赢">
            <el-col :span="12">
              <el-input v-model.number="row.WinRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="输">
            <el-col :span="12">
              <el-input v-model.number="row.LoseRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-form-item label="平">
            <el-col :span="12">
              <el-input v-model.number="row.AvgRate" :required="true" placeholder="" />
            </el-col>
          </el-form-item>

          <el-table
            :data="row.WinningsOptions"
            style="width: 100%"
          >
            <el-table-column
              prop="Amount"
              label="充值额度"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Amount" readonly="true" placeholder="placeholder" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Win"
              label="赢"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Win" placeholder="placeholder" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Lose"
              label="输"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Lose" placeholder="placeholder" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Avg"
              label="平"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Avg" placeholder="placeholder" />
              </template>
            </el-table-column>
          </el-table>

          <el-form-item>
            <el-button type="danger" size="mini" @click="delRow(index)">删除</el-button>
          </el-form-item>
        </fieldset>

        <el-col :offset="10" :span="14" style="margin-bottom: 50px">
          <el-button type="primary" @click="addRow">添加配置</el-button>
          <el-button type="success" @click="setData">保存</el-button>
        </el-col>
      </el-form>
    </el-col>

    <br><br>

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
import { toRupee } from '@/utils'
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfgData: {
        'WinBaseValueRate': 30,
        'LoseBaseValueRate': 20,
        'AvgBaseValueRate': 20,
        'WinningsWinMul': 4,
        'WinningsLoseMul': 2,
        'WinningsAvgMul': 2,

        'BaseValueReduce': 0, // 触线后基础值二次衰减

        'InviteWithdrawAddBaseValueRate': 0, // 基础值增加提取额度的百分比
        'InviteWithdrawAddWinningRate': 0, // winnings控制线增加提取额度的百分比

        // 标签随机概率
        'Lose3Win': 0, // 输+3赢的概率
        'Lose3Lose': 0, // 输+3输的概率
        'Lose3Avg': 0, // 输+3平的概率

        'Lose2Win': 0, // 输+2赢的概率
        'Lose2Lose': 0, // 输+2输的概率
        'Lose2Avg': 0, // 输+2平的概率

        'Win1Win': 0, // 赢+1赢的概率
        'Win1Lose': 0, // 赢+1输的概率
        'Win1Avg': 0, // 赢+1平的概率

        'Items': [
          {
            'TotalRecharge': 0,
            'WinRate': 0,
            'LoseRate': 0,
            'AvgRate': 0,
            'WinningsOptions': [
              {
                'Amount': 100,
                'Win': 120,
                'Lose': 70,
                'Avg': 120
              }
            ]
          }
        ]
      },
      form: {},
      libShow: $libShow,
      subKey: 'pay_schema_cfg',

      amountOptions: [
        100,
        300,
        500,
        1000,
        3000,
        5000,
        10000,
        20000
      ],

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
    dataRule(required, config) {
      return DataRule(required, config)
    },
    addRow() {
      const options = []
      for (const i in this.amountOptions) {
        options.push({
          'Amount': this.amountOptions[i],
          'Win': 0,
          'Lose': 0,
          'Avg': 0
        })
      }
      this.cfgData.Items.push({
        'TotalRecharge': 0,
        'WinRate': 0,
        'LoseRate': 0,
        'AvgRate': 0,
        'WinningsOptions': options
      })
    },
    delRow(idx) {
      const $this = this
      this.$confirm('确定要删除吗？', '警告')
        .then(function() {
          $this.cfgData.Items.splice(idx, 1)
        })
        .catch(function() {
          console.log('取消')
        })
    },
    sortItems() {
      this.cfgData.Items.sort(function(a, b) {
        return a.TotalRecharge - b.TotalRecharge
      })
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
          $this.form = response.Data || { Data: '{}' }
          $this.cfgData = JSON.parse(this.form.Data)
          for (const i in $this.cfgData.Items) {
            $this.cfgData.Items[i].TotalRecharge = toRupee($this.cfgData.Items[i].TotalRecharge)
            for (const j in $this.cfgData.Items[i].WinningsOptions) {
              $this.cfgData.Items[i].WinningsOptions[j].Amount = toRupee($this.cfgData.Items[i].WinningsOptions[j].Amount)
              $this.cfgData.Items[i].WinningsOptions[j].Win = toRupee($this.cfgData.Items[i].WinningsOptions[j].Win)
              $this.cfgData.Items[i].WinningsOptions[j].Lose = toRupee($this.cfgData.Items[i].WinningsOptions[j].Lose)
              $this.cfgData.Items[i].WinningsOptions[j].Avg = toRupee($this.cfgData.Items[i].WinningsOptions[j].Avg)
            }
          }
          $this.sortItems()
          // 设置修改之前数据
          this.$refs.compare.SetOldVal(this.form)
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['cfgData'])) return false

      const postData = $libType.DeepCopy(this.cfgData)
      for (const i in postData.Items) {
        postData.Items[i].TotalRecharge = parseInt(postData.Items[i].TotalRecharge * 1000)
        for (const j in postData.Items[i].WinningsOptions) {
          postData.Items[i].WinningsOptions[j].Amount = parseInt(postData.Items[i].WinningsOptions[j].Amount * 1000)
          postData.Items[i].WinningsOptions[j].Win = parseInt(postData.Items[i].WinningsOptions[j].Win * 1000)
          postData.Items[i].WinningsOptions[j].Lose = parseInt(postData.Items[i].WinningsOptions[j].Lose * 1000)
          postData.Items[i].WinningsOptions[j].Avg = parseInt(postData.Items[i].WinningsOptions[j].Avg * 1000)
        }
      }

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
            $this.sortItems()
          } else {
            Message.error('保存失败' + response.Data)
          }
        })
      })
    }
  }
}
</script>
