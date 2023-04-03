<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="form" :model="form" label-width="300px">
<!--          <el-form-item label="最低真人Antee：">-->
<!--            <el-input v-model="line" placeholder="placeholder" />-->
<!--          </el-form-item>-->
          <el-form-item label="真长机器人场次配置">
            <el-table
              :data="antesData"
              border
              style="width: 100%">
              <el-table-column
                prop="label"
                label="底注">
              </el-table-column>
              <el-table-column
                prop="name"
                label="真人/机器人">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.type">
                    <el-radio :label="1">机器人</el-radio>
                    <el-radio :label="2">真人</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="配桌最少重试次数：(2.2秒1次)">
            <el-input v-model.number="enterMinRetryTimes" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="配桌最多重试次数：(2.2秒1次)">
            <el-input v-model.number="enterMaxRetryTimes" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="真人场AppIDs：">
            <el-input v-model="apps" placeholder="appID按,隔开" />(按,号分隔)
          </el-form-item>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      price: 1, // 道具价格
      form: {
        Line: 500,
        LineMap: {},
        EnterMinRetryTimes: 3,
        EnterMaxRetryTimes: 5,
        WhiteList: [39, 1]
      },
      antesData: [
        {label: '0.1', value: 100, type: 1},
        {label: '0.3', value: 300, type: 1},
        {label: '0.5', value: 500, type: 1},
        {label: '1', value: 1000, type: 2},
        {label: '3', value: 3000, type: 2},
        {label: '5', value: 5000, type: 2},
        {label: '10', value: 10000, type: 2},
        {label: '20', value: 20000, type: 2},
        {label: '50', value: 50000, type: 2},
        {label: '100', value: 100000, type: 2},
        {label: '200', value: 200000, type: 2},
        {label: '400', value: 400000, type: 2},
      ],
      line: 500,
      apps: '39,1',
      enterMinRetryTimes: 3,
      enterMaxRetryTimes: 5,
      txt: '',
      subKey: 'tp_real_switch'
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
    fullAntesData(lineMap) {
      if(!lineMap) {
        return false
      }

      for(let i in lineMap) {
        for(let k in this.antesData) {
          if (parseInt(i) === this.antesData[k].value) {
            this.antesData[k].type = lineMap[i]
          }
        }
      }
    },
    getLineData() {
      const map = {}
      for(let i in this.antesData) {
        const antes = this.antesData[i].value
        map[antes] = this.antesData[i].type
      }

      return map
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
          const item = JSON.parse(response.Data.Data)
          this.line = item.Line / 1000
          this.enterMinRetryTimes = item.EnterMinRetryTimes
          this.enterMaxRetryTimes = item.EnterMaxRetryTimes
          this.apps = item.WhiteList.join(',')
          this.fullAntesData(item.LineMap)

          // 设置修改之前数据
          this.$refs.compare.SetOldVal(response.Data.Data)
        }
      })
    },
    setData() {
      const postData = {}
      postData.Line = this.line * 1000
      postData.EnterMinRetryTimes = this.enterMinRetryTimes
      postData.EnterMaxRetryTimes = this.enterMaxRetryTimes
      postData.WhiteList = []
      postData.LineMap = this.getLineData()
      const apps = this.apps.split(",")
      for (let i = 0; i < apps.length; i++) {
        const n = parseInt(apps[i])
        if (!n) {
          Message.error('AppID必须为数字，错误内容：' + apps[i])
          return
        }else{
          postData.WhiteList.push(n)
        }
      }
      this.form.Data = JSON.stringify(postData)

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
            console.log('TeenPatti Real Switch save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
