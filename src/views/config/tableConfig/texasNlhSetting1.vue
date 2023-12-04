<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-col :span="16" :offset="2">

          <fieldset style="margin-top:10px">
            <legend>Jackpot配置</legend>

            <el-row>
              <el-col :span="12">
                <el-form-item label="盲注比例%：" :required="true" prop="JackpotConf.BlindRatio" :rules="dataRule(true,{type:'n',range:'0'})">
                  <el-input v-model.number="JackpotConf.BlindRatio" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>

            <!--
            <el-row>
              <el-button type="primary" size="mini" @click="addJackpotCardTypeConfRow">添加</el-button>
            </el-row>
            <el-row v-for="(value, index) in JackpotConf.CardTypeConf" :key="index">
              <el-col :span="22">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="牌型" :required="true">
                      <el-input v-model="JackpotConf.CardTypeConf[index].CardType" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="牌型比例%" :required="true">
                      <el-input v-model="JackpotConf.CardTypeConf[index].Ratio" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="removeJackpotCardTypeConfRow(index)">删除</el-button>
              </el-col>
            </el-row>
            -->
          </fieldset>

        </el-col>

        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
      },
      JackpotConf: {
        CardTypeConf: []
      },
      subKey: 'gameTexasNlh',
      form: {},
      libShow: $libShow,
      AttrNames: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            console.log('item', item)
            Object.assign(this.item, item)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      console.log('setData', this.item)
      if (!ValidateVueItem(this.$refs['item'])) return false

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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    addJackpotCardTypeConfRow() {
      this.item.JackpotConf.CardTypeConf.push({
        CardType: 1,
        Ratio: 10
      })
    },
    removeJackpotCardTypeConfRow(index) {
      this.item.JackpotConf.CardTypeConf.splice(index, 1)
    }
  }
}
</script>
