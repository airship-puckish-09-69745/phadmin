<template>
  <el-col class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="16" :offset="2">

        <el-form ref="item" label-width="150px">

          <el-table
            :data="originData"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="Level"
              label="等级"
              width="150"
            >
              <template slot-scope="scope">
                <small-game-level v-model="scope.row.Level" />
              </template>
            </el-table-column>
            <el-table-column
              prop="Level"
              label="生效应用"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.AppStr" placeholder="placeholder" />
              </template>
            </el-table-column>

          </el-table>

          <br>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </el-col></template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule, ValidateVueItem } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'
import SmallGameLevel from '@/components/SmallGameLevel'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput, SmallGameLevel },
  data() {
    return {
      originData: [],
      form: {
      },
      subKey: 'small_game_bet'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    encodeData() {
      const data = []
      for (const j in this.originData) {
        this.originData[j].Apps = this.transArr(this.originData[j].AppStr)
        data.push(this.originData[j])
      }

      return JSON.stringify(data)
    },
    transArr(str) {
      if (str) {
        const arr = str.split(',')
        const num = []
        for (const i in arr) {
          num.push(parseInt(arr[i]))
        }
        return num
      }

      return []
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            this.originData = this.DeepCopy(data)

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
