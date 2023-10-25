<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="18" :offset="4">
      <el-form ref="item" :model="item" label-width="300px" :inline="true">
        <fieldset v-if="item.AppsTxt" style="margin:30px auto;">
          <legend>适用应用ID列表</legend>
          <el-form-item label="多个ID用英文逗号(,)间隔">
            <el-input v-model="item.AppsTxt" type="textarea" rows="5" />
          </el-form-item>
        </fieldset>
        <fieldset style="margin:20px auto;">
          <legend>免费用户控制</legend>
          <el-form-item label="免费用户控Winning上限：" :required="true">
            <el-input v-model.number="item.Free" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="免费用户单挑控制线：" :required="true">
            <el-input v-model.number="item.FreeControlLine" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
          <el-form-item v-for="(o,k) in freePay" :label="'免费充' + k + '控上限：'" :required="true">
            <el-input v-model.number="freePay[k]" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
        </fieldset>
        <fieldset style="margin:20px auto;">
          <legend>付费玩家赢限制</legend>
          <el-form-item label="充100至200用户控Winning上限：" :required="true">
            <el-input v-model.number="item.Hundred" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="赢跟到底条件1(幸运级别)：" :required="true">
            <el-input v-model.number="item.WinLuckyLevel" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="赢跟到底条件2(资产比例)：" :required="true">
            <el-input v-model.number="item.WinMoneyLimit" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="输回归AI底池比例：" :required="true">
            <el-input v-model.number="item.LoseAILine" style="width: 150px" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="到线后机器人比牌比例：" :required="true">
            <el-input v-model.number="item.LineCompare" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="可赢底池额度比例：" :required="true">
            <el-input v-model.number="item.OKRate" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="赢受限前跟比例：" :required="true">
            <el-input v-model.number="item.OKCall" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="赢受限前加比例：" :required="true">
            <el-input v-model.number="item.OKRaise" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="赢受限前比比例：" :required="true">
            <el-input v-model.number="item.OKCompare" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
        </fieldset>
        <fieldset style="margin:20px auto;">
          <legend>机器人付费表演配置</legend>
          <el-form-item label="符合条件后机器人付费比例：" :required="true">
            <el-input v-model.number="item.RPayRate" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="机器人付费赢离开比例：" :required="true">
            <el-input v-model.number="item.RPayWinExit" style="width: 150px" placeholder="placeholder"><template slot="append">%</template></el-input>
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
      item: {
        'Apps': [],
        AppsTxt: '',
        'Free': 100,
        'Hundred': 100,
        'FreeControlLine': 80,
        WinLuckyLevel: 15,
        WinMoneyLimit: 16,
        RPayRate: 20, // 机器人符合条件后发起付费的概率
        RPayWinExit: 10, // 机器人付费赢后离开的概率
        LoseAILine: 17,
        LineCompare: 20,
        OKRate: 0,
        OKCall: 18,
        OKRaise: 20,
        OKCompare: 21,
        'FreePay': { 100: 0, 200: 150, 300: 400, 400: 500, 500: 350, 1000: 850 }
      },
      freePay: {
        '100': 0, '200': 150, '300': 400, '400': 500, '500': 350, '1000': 850
      },
      form: {},
      libShow: $libShow,
      subKey: '',

      AttrNames: {
        'Data': '索引',
        'Data.Free': '免费用户控Winning上限',
        'Data.Hundred': '充100提100用户控Winning上限',
        'Data.FreeControlLine': '免费用户单挑控制线',
        'Data.WinLuckyLevel': '赢跟到底条件1(幸运级别)',
        'Data.WinMoneyLimit': '赢跟到底条件2(资产比例)',
        'Data.LoseAILine': '输回归AI底池比例',
        'Data.LineCompare': '到线后机器人比牌比例',
        'Data.OKCall': '赢受限前跟比例',
        'Data.OKRaise': '赢受限前加比例',
        'Data.OKCompare': '赢受限前比牌比例',
        'Data.OKRate': '可赢底池额度比例',
        'Data.RPayRate': '机器人符合条件后发起付费',
        'Data.RPayWinExit': '机器人付费赢后离开概率',
        types: {
          Data: 'jsonString' // 整个数据项的类型

        }
      }
    }
  },
  created() {
    console.log(1)
    this.subKey = this.$route.meta.subKey
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

          $this.item = JSON.parse($this.form.Data)
          if ($this.item.Apps && $this.item.Apps.length > 0) {
            $this.item.AppsTxt = $this.item.Apps.join(',')
          }
          $this.item.Free /= 1000
          $this.item.Hundred /= 1000
          $this.item.FreeControlLine /= 1000
          for (const k in $this.item.FreePay) {
            $this.freePay[k + ''] = $this.item.FreePay[k] / 1000
          }

          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    setData() {
      const postData = $libType.DeepCopy(this.item)
      let arr = []
      if (postData.AppsTxt && postData.AppsTxt !== '') {
        arr = postData.AppsTxt.split(',')

        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(arr[i])
        }
        postData.Apps = arr
        postData.AppsTxt = null
      }

      postData.Free = this.item.Free * 1000
      postData.Hundred = this.item.Hundred * 1000
      postData.FreeControlLine = this.item.FreeControlLine * 1000
      postData.FreePay = {}
      for (const k in this.freePay) {
        postData.FreePay[parseInt(k)] = this.freePay[k] * 1000
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
          }
        })
      })
    }
  }
}
</script>
