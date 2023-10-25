<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="8" :offset="4">
      <h3 align="center" style="margin:30px auto;">各子游戏基准值消耗数额与有效下注比例(贡献值与有效下注比例)</h3>
      <el-form ref="cfg" :model="cfg" label-width="300px">
        <el-form-item label="系统输赢和参考总抽水比例正常范围最小值" :required="true" prop="SchemaNormalRateMin">
          <el-input v-model.number="cfg.SchemaNormalRateMin" placeholder="placeholder" style="width:150px;"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="系统输赢和参考总抽水比例正常范围最大值" :required="true" prop="SchemaNormalRateMax">
          <el-input v-model.number="cfg.SchemaNormalRateMax" placeholder="placeholder" style="width:150px;"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="系统输赢和总下注的比例安全值(大于该值)" :required="true" prop="SchemaTaxedSafeRate">
          <el-input v-model.number="cfg.SchemaTaxedSafeRate" placeholder="placeholder" style="width:150px;"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="小游戏特殊用户触发标记值" :required="true" prop="XManTriggerValue">
          <el-input v-model.number="cfg.XManTriggerValue" placeholder="placeholder" style="width:150px;" />
        </el-form-item>
        <el-form-item label="小游戏特殊用户调控概率" :required="true" prop="XManPresetCardsRate">
          <el-input v-model.number="cfg.XManPresetCardsRate" placeholder="placeholder" style="width:150px;"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setData">保存</el-button>
        </el-form-item>
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
      cfg: {
        'SchemaNormalRateMin': 0,
        'SchemaNormalRateMax': 0,
        'SchemaTaxedSafeRate': 0,
        'XManTriggerValue': 0,
        'XManPresetCardsRate': 0
      },
      form: {},
      libShow: $libShow,
      subKey: 'gamble_schema_cfg',
      AttrNames: {
        'Data.SchemaNormalRateMin': '系统输赢和参考总抽水比例正常范围最小值',
        'Data.SchemaNormalRateMax': '系统输赢和参考总抽水比例正常范围最大值',
        'Data.SchemaTaxedSafeRate': '系统输赢和总下注的比例安全值',
        'Data.XManTriggerValue': '小游戏特殊用户触发标记值',
        'Data.XManPresetCardsRate': '小游戏特殊用户调控概率',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    checkData(cfg) {
      if (cfg.SchemaNormalRateMin <= 0 || cfg.SchemaNormalRateMin > 500) {
        Message.error('“系统输赢和参考总抽水比例正常范围最小值”应该是1-500之间的数字!')
        return false
      }
      if (cfg.SchemaNormalRateMax < cfg.SchemaNormalRateMin || cfg.SchemaNormalRateMax > 2000) {
        Message.error('“系统输赢和参考总抽水比例正常范围最大值”应该是1-2000之间的数字且不小于最小值!')
        return false
      }
      if (cfg.SchemaTaxedSafeRate < 1 || cfg.SchemaTaxedSafeRate > 100) {
        Message.error('“系统输赢和总下注的比例安全值”应该是1-100之间的数字!')
        return false
      }
      if (cfg.XManTriggerValue < 10 || cfg.XManTriggerValue > 1000000) {
        Message.error('“小游戏特殊用户触发标记值”应该是10-1000000之间的数字!')
        return false
      }
      if (cfg.XManPresetCardsRate < 1 || cfg.XManPresetCardsRate > 100) {
        Message.error('“小游戏特殊用户调控概率”应该是1-100之间的数字!')
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
          $this.cfg = JSON.parse($this.form.Data)
          $this.cfg.XManTriggerValue /= 1000
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    setData() {
      if (!this.checkData(this.cfg)) {
        return
      }
      const postData = {}
      Object.assign(postData, this.cfg)
      postData.XManTriggerValue *= 1000
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
