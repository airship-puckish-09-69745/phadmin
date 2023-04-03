<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-col :offset="4">
        <div style="padding: 10px">
          <span style="font-weight: bold">基准值：</span>玩家每次充值获得基准值，基准值数量等于充值额度<br>
          <span style="font-weight: bold">基准值衰减：</span>1. 每次有效下注后，基准值 - 有效下注 * 5%；2. 每次提款后，基准值 - 提款金额；基准值最低为0<br>
          <span style="font-weight: bold">幸运值</span> = 基准值 / 用户资产<br>
        </div>
      </el-col>
    </el-row>
    <el-table
      ref="filterTable"
      :data="item"
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
        prop="Low"
        label="幸运值大于时"
        width="150"
      >
        <template slot-scope="scope">
          <el-col :span="20">
            <el-input v-model.number="scope.row.Low" size="mini" />
          </el-col> %
        </template>
      </el-table-column>
      <el-table-column
        prop="Low"
        label="胜率"
        width="150"
      >
        <template slot-scope="scope">
          <el-col :span="20">
            <el-input v-model.number="scope.row.Rate" size="mini" @blur="checkRate(scope.row.Rate)" />
          </el-col>
          %
        </template>
      </el-table-column>
      <el-table-column
        v-if="subKey!='luckyValue_ak'"
        prop="IsPei"
        label="配牌"
        width="250"
      >
        <template slot-scope="scope">
          <el-radio-group v-model.number="scope.row.IsPei">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">赢时</el-radio>
            <el-radio :label="2">输时</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="ExtRate"
        label="无-配牌率"
        width="150"
      >
        <template slot-scope="scope">
          <el-input v-if="scope.row.IsPei===0" v-model.number="scope.row.ExtRate" size="mini"><template slot="append">%</template></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyRate"
        label="赢比例"
        width="150"
      >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.MoneyRate" size="mini"><template slot="append">%</template></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="setData">保存</el-button>

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
      item: [{ 'Low': 0, 'Rate': 20, 'IsPei': 0, ExtRate: 0, MoneyRate: 0 }],
      form: {},
      libShow: $libShow,
      subKey: 'luckyValue_teenPatti',

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
    this.subKey = this.$route.name
    this.getData()
  },
  methods: {
    checkRate(rate) {
      if (!$libType.IsInt(rate) || rate < 0 || rate > 100) {
        Message.error('概率应该是0-100之间的数字')
      }
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || { Data: '{}' }

          this.item = JSON.parse(this.form.Data)

          // 设置修改之前数据
          this.$refs.compare.SetOldVal(this.form)
        }
      })
    },
    setData() {
      for (let i = 0; i < this.item.length; i++) {
        const n = this.item[i].Rate
        if (!$libType.IsInt(n) || n < 0 || n > 100) {
          Message.error('概率需要是0-100之间的数字。Index:' + (i + 1))
          return
        }
      }
      this.form.Data = JSON.stringify(this.item)
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
            console.log('总控配置', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
