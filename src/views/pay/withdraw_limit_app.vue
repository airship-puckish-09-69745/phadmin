<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <template>
          <el-alert
            title="配置说明"
            type="success"
            description="最小充值总额度大于0，最大充值总额度等于0，就是最大配置项">
          </el-alert>
        </template>
        <br/>
        <el-form ref="form" :model="items" label-width="0">
          <el-form-item label="应用id" label-width="80px">
            <el-input v-model="items.AppStr" type="textarea" :rows="5" placeholder="填0的话，所有的应用都会用这个配置"></el-input>
          </el-form-item>

          <el-button type="primary" size="mini" @click="addOption">添加配置项</el-button>
          <el-row>
            <el-table
              :data="items.Items"
              style="width: 100%">
              <el-table-column
                prop="Min"
                label="最小充值总额度">
                <template slot-scope="scope">
                  <money-input v-model="scope.row.Min" label-width="0" label=""></money-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Max"
                label="最大充值总额度">
                <template slot-scope="scope">
                  <money-input v-model="scope.row.Max" label-width="0" label=""></money-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="Mul"
                label="可提现额度为充值总额的倍数%(放大100倍)">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input v-model.number="scope.row.Mul" placeholder="倍数，放大100倍"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="Max"
                label="删除">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="delOption(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare, MoneyInput },
  data() {
    return {
      items: {
        Apps: [],
        AppStr: '',
        Items: [
          {
            'Min': 100000,
            'Max': 300000,
            'Mul': 200 // 放大100倍
          }
        ]
      },
      form: {
      },
      totalSwitch: true,
      subKey: 'withdraw_limit_app_cfg',
      AttrNames: {
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
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    delOption(index) {
      this.items.Items.splice(index, 1)
    },
    addOption() {
      this.items.Items.push({
        'Min': 0,
        'Max': 0,
        'Mul': 200 // 放大100倍
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
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const tmp = JSON.parse(response.Data.Data)
            tmp.AppStr = tmp.Apps.join(',')
            $this.items = tmp
            console.log('items', $this.items)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    itemsSort() {
      this.items.Items.sort(function(a, b) {
        return a.Min - b.Min
      })
    },
    encodeData() {
      this.itemsSort()

      // app转换成数字
      if (!this.items.AppStr) {
        this.items.Apps = []
      } else {
        const arr = this.items.AppStr.split(',')
        this.items.Apps = []
        for (const i in arr) {
          this.items.Apps.push(parseInt(arr[i]))
        }
      }

      return JSON.stringify(this.items)
    },
    setData() {
      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
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
            console.log('response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
