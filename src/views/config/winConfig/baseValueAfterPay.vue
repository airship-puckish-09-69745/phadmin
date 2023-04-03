<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="12" :offset="4">
      <el-form ref="item" :model="item" label-width="200px">
        <fieldset>
          <legend>加赠相关</legend>
          <el-form-item label="首充加赠比例：" :required="true">
            <el-input style="width: 150px" v-model.number="item.First" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="复充加赠比例：" :required="true">
              <el-input style="width: 150px" v-model.number="item.NotFirst" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="加赠上限：" :required="true">
              <el-input style="width: 150px" v-model.number="item.UpLine" placeholder="placeholder" />
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>历史基础值演算</legend>
          <el-form-item label="充值费率：" :required="true">
              <el-input style="width: 150px" v-model.number="item.PayRate" placeholder="placeholder"><template slot="append">‰</template></el-input>
          </el-form-item>
          <el-form-item label="提款比例(‰）：" :required="true">
              <el-input style="width: 150px" v-model.number="item.WRate" placeholder="placeholder"><template slot="append">‰</template></el-input>
          </el-form-item>
          <el-form-item label="提款费率(‰)：" :required="true">
              <el-input style="width: 150px" v-model.number="item.WFeeRate" placeholder="placeholder" ><template slot="append">‰</template></el-input>
          </el-form-item>
          <el-form-item label="提款固定费率：" :required="true">
              <el-input style="width: 150px" v-model.number="item.WFee" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="砍杀下限(‰)：" :required="true">
              <el-input style="width: 150px" v-model.number="item.BaseRate" placeholder="placeholder" ><template slot="append">‰</template></el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>领取Bonus加基础值</legend>
          <el-form-item label="比例(‰)：" :required="true">
            <el-input style="width: 150px" v-model.number="item.BonusBaseRate" placeholder="placeholder"><template slot="append">‰</template></el-input>
          </el-form-item>
        </fieldset>
        <el-col :offset="16" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
      item: { 'First': 40, 'NotFirst': 35, 'UpLine': 1000, 'PayRate': 935, 'WRate': 970, 'WFeeRate': 30, 'WFee': 5000, 'BaseRate': 400 },
      form: {},
      libShow: $libShow,
      subKey: 'baseV_after_pay',

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
    checkRate(rate) {
      if (!$libType.IsInt(rate) || rate < 0 || rate > 100) {
        Message.error('概率应该是0-100之间的数字')
        return false
      }
      return true
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

          $this.item = JSON.parse($this.form.Data)
          $this.item.UpLine /= 1000
          $this.item.WFee /= 1000

          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    setData() {
      if (!this.checkRate(this.item.First) || !this.checkRate(this.item.NotFirst)) {
        return
      }
      const postData = {}
      Object.assign(postData, this.item)
      postData.UpLine = this.item.UpLine * 1000
      postData.WFee = this.item.WFee * 1000

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
