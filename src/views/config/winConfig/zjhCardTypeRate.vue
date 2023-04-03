<template>
  <div class="app-container">
    <publish
      primary-key="Volume"
      :key-id="getFullKey()"
      :env-empty="false"
      compare-type="Object"
      :attr-names="AttrNames"
    />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-tabs type="border-card">
          <el-tab-pane label="不配牌概率">
            <el-col :span="12">
              <el-form ref="configs" :model="configs" label-width="100px">
                <el-row v-for="(o,key) in configs" v-if="key<10" :key="key">
                  <el-form-item
                    :label="getCardType(key)"
                    :prop="key"
                    :rules="dataRule(true,{type:'f',range:'0.01-100'})"
                  >
                    <el-col :span="20">
                      <el-input v-model="configs[key]" size="mini" :required="true" />
                    </el-col>
                    %
                  </el-form-item>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="11" :offset="1">
              <div style="font-size: 14px">
                1. 按概率随机一个牌型的手牌出来，做为最大牌型；<br>
                2. 再按概率生成小于此牌型的其他手牌；<br>
                3. 玩家赢则将最大手牌给玩家；<br>
                4. 玩家输则将手牌随机给一个机器人；<br><br>
                补充说明：不配牌时，最大牌型出现的概率与此配置的概率基本一致<br>
                可在同步到测试环境后，点击模拟查看
                <el-col :offset="16">
                  <el-button size="mini" @click="testPreset(0)">模拟</el-button>
                </el-col>
              </div>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="配牌概率">
            <el-col :span="12">
              <el-form ref="configs" :model="configs" label-width="100px">
                <el-row v-for="(o,key) in configs" v-if="getKeyType(key) == 1" :key="key">
                  <el-form-item
                    :label="getCardType(key%10 + '')"
                    :prop="key"
                    :rules="dataRule(true,{type:'f',range:'0-100'})"
                  >
                    <el-col :span="20">
                      <el-input v-model="configs[key]" size="mini" :required="true" />
                    </el-col>
                    %
                  </el-form-item>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="11" :offset="1">
              <div style="font-size: 14px">
                1. 按概率随机3副手牌出来<br>
                2. 玩家赢则将最大手牌给玩家；<br>
                3. 玩家输则将排名2、3的手牌给玩家；<br><br>
                补充说明：配牌时，最大牌型出现的概率与配置不一致。可在同步到测试环境后，点击模拟查看<br>
              </div>
              <el-col :offset="16">
                <el-button size="mini" @click="testPreset(1)">模拟</el-button>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="练习场概率">
            <el-col :span="12">
              <el-form ref="configs" :model="configs" label-width="100px">
                <el-row v-for="(o,key) in configs" v-if="getKeyType(key) == 2" :key="key">
                  <el-form-item
                    :label="getCardType(key%10 + '')"
                    :prop="key"
                    :rules="dataRule(true,{type:'f',range:'0-100'})"
                  >
                    <el-col :span="20">
                      <el-input v-model="configs[key]" size="mini" :required="true" />
                    </el-col>
                    %
                  </el-form-item>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="11" :offset="1">
              <div style="font-size: 14px">
                1. 按概率随机一个牌型的手牌出来，做为最大牌型；<br>
                2. 再按概率生成小于此牌型的其他手牌；<br>
                3. 玩家赢则将最大手牌给玩家；<br>
                4. 玩家输则将手牌随机给一个机器人；<br><br>
                补充说明：不配牌时，最大牌型出现的概率与此配置的概率基本一致<br><br>
                可在同步到测试环境后，点击模拟查看<br>
              </div>
              <el-col :offset="16">
                <el-button size="mini" @click="testPreset(2)">模拟</el-button>
              </el-col>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="16" :span="8">
        <el-button type="primary" @click="setData">保存</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="4" style="padding:5px" />
    </el-row>
    <el-row>
      <el-col :span="6" :offset="3">
        <el-row>
          循环10000次，每次发5副手牌，产生的牌型概率分布：
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="2"
          size="mini"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="高牌：">37141</el-descriptions-item>
          <el-descriptions-item label="比例：">74.28%</el-descriptions-item>
          <el-descriptions-item label="对子：">8566</el-descriptions-item>
          <el-descriptions-item label="比例：">17.13%</el-descriptions-item>
          <el-descriptions-item label="同花：">2489</el-descriptions-item>
          <el-descriptions-item label="比例：">4.98%</el-descriptions-item>
          <el-descriptions-item label="顺子：">1576</el-descriptions-item>
          <el-descriptions-item label="比例：">3.15%</el-descriptions-item>
          <el-descriptions-item label="同花顺：">117</el-descriptions-item>
          <el-descriptions-item label="比例：">0.23%</el-descriptions-item>
          <el-descriptions-item label="三条：">111</el-descriptions-item>
          <el-descriptions-item label="比例：">0.22%</el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-row>
          纯随机5副牌，第一的牌型概率作参考：
        </el-row>
        <el-row>
          <el-descriptions
            class="margin-top"
            :column="2"
            size="mini"
            :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
            border
          >
            <el-descriptions-item label="高牌：">2289</el-descriptions-item>
            <el-descriptions-item label="比例：">22.89%</el-descriptions-item>
            <el-descriptions-item label="对子：">4034</el-descriptions-item>
            <el-descriptions-item label="比例：">40.34%</el-descriptions-item>
            <el-descriptions-item label="同花：">1926</el-descriptions-item>
            <el-descriptions-item label="比例：">19.26%</el-descriptions-item>
            <el-descriptions-item label="顺子：">1534</el-descriptions-item>
            <el-descriptions-item label="比例：">15.34%</el-descriptions-item>
            <el-descriptions-item label="同花顺：">102</el-descriptions-item>
            <el-descriptions-item label="比例：">1.02%</el-descriptions-item>
            <el-descriptions-item label="三条：">115</el-descriptions-item>
            <el-descriptions-item label="比例：">1.15%</el-descriptions-item>
          </el-descriptions>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="3">
        <el-row>
          AK循环10000次，5副手牌，(第一名）：
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="2"
          size="mini"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="高牌：">3</el-descriptions-item>
          <el-descriptions-item label="比例：">0%</el-descriptions-item>
          <el-descriptions-item label="对子：">260</el-descriptions-item>
          <el-descriptions-item label="比例：">2.6%</el-descriptions-item>
          <el-descriptions-item label="同花：">373</el-descriptions-item>
          <el-descriptions-item label="比例：">3.7%</el-descriptions-item>
          <el-descriptions-item label="顺子：">873</el-descriptions-item>
          <el-descriptions-item label="比例：">8.7%</el-descriptions-item>
          <el-descriptions-item label="同花顺：">366</el-descriptions-item>
          <el-descriptions-item label="比例：">3.7%</el-descriptions-item>
          <el-descriptions-item label="三条：">8125</el-descriptions-item>
          <el-descriptions-item label="比例：">81.3%</el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="6">
        <el-row>
          第二名：
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="2"
          size="mini"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="高牌：">49</el-descriptions-item>
          <el-descriptions-item label="比例：">0%</el-descriptions-item>
          <el-descriptions-item label="对子：">1738</el-descriptions-item>
          <el-descriptions-item label="比例：">17.4%</el-descriptions-item>
          <el-descriptions-item label="同花：">1388</el-descriptions-item>
          <el-descriptions-item label="比例：">13.9%</el-descriptions-item>
          <el-descriptions-item label="顺子：">2073</el-descriptions-item>
          <el-descriptions-item label="比例：">20.7%</el-descriptions-item>
          <el-descriptions-item label="同花顺：">752</el-descriptions-item>
          <el-descriptions-item label="比例：">7.5%</el-descriptions-item>
          <el-descriptions-item label="三条：">4000</el-descriptions-item>
          <el-descriptions-item label="比例：">40%</el-descriptions-item>
        </el-descriptions>
      </el-col>

      <el-col :span="6" >
        <el-row>
          第三名：
        </el-row>
        <el-descriptions
          class="margin-top"
          :column="2"
          size="mini"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="高牌：">562</el-descriptions-item>
          <el-descriptions-item label="比例：">5.6%</el-descriptions-item>
          <el-descriptions-item label="对子：">4667</el-descriptions-item>
          <el-descriptions-item label="比例：">46.7%</el-descriptions-item>
          <el-descriptions-item label="同花：">1723</el-descriptions-item>
          <el-descriptions-item label="比例：">17.2%</el-descriptions-item>
          <el-descriptions-item label="顺子：">1712</el-descriptions-item>
          <el-descriptions-item label="比例：">17.1%</el-descriptions-item>
          <el-descriptions-item label="同花顺：">382</el-descriptions-item>
          <el-descriptions-item label="比例：">3%</el-descriptions-item>
          <el-descriptions-item label="三条：">954</el-descriptions-item>
          <el-descriptions-item label="比例：">9.5%</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
    <el-dialog
      title="配置后最大牌型概率"
      :visible.sync="preset.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <el-row>
        <el-col :span="11">
          玩家33%胜率时牌型分布：
          <el-descriptions
            class="margin-top"
            :column="2"
            size="mini"
            :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
            border
          >
            <template v-for="(o,k) in preset.person">
              <el-descriptions-item :label="getCardType(k)">{{ o }}</el-descriptions-item>
              <el-descriptions-item label="比例：">{{
                (o * 100 / preset.personTotal).toFixed(2) + '%'
              }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-col>
        <el-col :span="11" :offset="1">
          最大牌型分布：
          <el-descriptions
            class="margin-top"
            :column="2"
            size="mini"
            :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
            border
          >
            <template v-for="(o,k) in preset.first">
              <el-descriptions-item :label="getCardType(k)">{{ o }}</el-descriptions-item>
              <el-descriptions-item label="比例：">{{
                (o * 100 / preset.firstTotal).toFixed(2) + '%'
              }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-col>

      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule, ValidateVueItem } from '@/utils/common'

function newPreset() {
  return {
    iType: 0,
    first: {},
    person: {},
    firstTotal: 0,
    personTotal: 0,
    visible: false
  }
}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      configs: {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0,
        '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0,
        '21': 0, '22': 0, '23': 0, '24': 0, '25': 0, '26': 0
      },

      form: {},
      txt: '',
      subKey: 'zjh_cardtype',
      preset: newPreset(),
      AttrNames: {
        'Data.1': '高牌',
        'Data.2': '对子',
        'Data.3': '同花',
        'Data.4': '顺子',
        'Data.5': '同花顺',
        'Data.6': '三条',
        'Data.11': '高牌(配牌)',
        'Data.12': '对子(配牌)',
        'Data.13': '同花(配牌)',
        'Data.14': '顺子(配牌)',
        'Data.15': '同花顺(配牌)',
        'Data.16': '三条(配牌)',
        'Data.21': '高牌(练习)',
        'Data.22': '对子(练习)',
        'Data.23': '同花(练习)',
        'Data.24': '顺子(练习)',
        'Data.25': '同花顺(练习)',
        'Data.26': '三条(练习)',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }

      }
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getKeyType(key) {
      return parseInt(key / 10)
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getCardType(sType) {
      switch (sType) {
        case '6':
          return '三条：'
        case '5':
          return '同花顺：'
        case '4':
          return '顺子：'
        case '3':
          return '同花：'
        case '2':
          return '对子：'
        case '1':
          return '高牌：'
        default:
          return 'error'
      }
    },
    transForShow(configs) {
      for (const o in configs) {
        configs[o] = configs[o] / 100
      }
      return configs
    },
    transForStore(configs) {
      const cfg = {}
      for (const o in configs) {
        cfg[o] = configs[o] * 100
      }
      return cfg
    },
    testPreset(iType) {
      const $this = this
      const loading = this.$loading({
        lock: true,
        text: '模拟10000次进行中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/card/rate',
          Type: iType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.preset = newPreset()
          $this.preset.first = response.Data.First
          $this.preset.person = response.Data.Person

          for (const o in $this.preset.first) {
            $this.preset.firstTotal += $this.preset.first[o]
          }
          for (const o in $this.preset.person) {
            $this.preset.personTotal += $this.preset.person[o]
          }
          $this.preset.visible = true
        }
        loading.close()
      })
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.configs = JSON.parse(response.Data.Data)
            this.transForShow(this.configs)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['configs'])) return false
      let total = 0
      let peiTotal = 0
      let practiceTotal = 0
      for (const o in this.configs) {
        switch (Math.floor(o / 10)) {
          case 0:
            total += parseFloat(this.configs[o])
            break
          case 1:
            peiTotal += parseFloat(this.configs[o])
            break
          case 2:
            practiceTotal += parseFloat(this.configs[o])
            break
        }
      }
      if (Math.floor(total) !== 100) {
        Message.error('不配牌概率总和需要为100,当前：' + total)
        return
      }
      if (Math.floor(peiTotal) !== 100) {
        Message.error('配牌概率总和需要为100,当前：' + peiTotal)
        return
      }
      if (Math.floor(practiceTotal) !== 100) {
        Message.error('练习场概率总和需要为100,当前：' + practiceTotal)
        return
      }
      this.form.Data = JSON.stringify(this.transForStore(this.configs))
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
    }
  }
}
</script>
