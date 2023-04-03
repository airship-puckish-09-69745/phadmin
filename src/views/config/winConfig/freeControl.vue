<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="12" :offset="4">
      <el-form ref="cfgData" :model="cfgData" label-width="200px">
        <fieldset style="margin:30px auto;" v-if="cfgData.AppsTxt">
          <legend>适用应用ID列表</legend>
          <el-form-item label="多个ID用英文逗号(,)间隔">
            <el-col :span="20">
              <el-input v-model="cfgData.AppsTxt" type="textarea" rows="5" />
            </el-col>
          </el-form-item>
        </fieldset>

        <fieldset v-for="(cfgRow, cfgIdx) in cfgData.Items" style="margin:30px auto;">
          <legend>注册时间：[{{ cfgRow.RegisteredDays*24 }} ~ {{ cfgRow.RegisteredDays*24+24 }}] 小时 ({{ cfgRow.RegisteredDays }}天)</legend>

          <el-form-item label="贡献值下限(&gt;=)" :required="true">
            <el-col :span="12">
              <el-input v-model.number="cfgRow.ProductValue" placeholder="" style="width:150px;" />
            </el-col>
          </el-form-item>

          <el-form-item label="基准值重置目标值" :required="true">
            <el-col :span="12">
              <el-input v-model.number="cfgRow.ResetBaseValue" placeholder="" style="width:150px;" />
            </el-col>
          </el-form-item>

          <el-form-item label="调控结果失效资产值(小于)" :required="true">
            <el-col :span="12">
              <el-input v-model.number="cfgRow.ReCalcMoney" placeholder="" style="width:150px;" />
            </el-col>
          </el-form-item>

          <el-form-item label="幸运级别调整" :required="true">
            <el-table :data="cfgRow.LuckyLevelChanges">
              <el-table-column prop="Low" label="资产下限">
                <template scope="scope">
                  <el-input v-model.number="scope.row.Low" placeholder="" style="width:150px;" />
                </template>
              </el-table-column>
              <el-table-column prop="Change" label="级别变化">
                <template scope="scope">
                  <el-input v-model.number="scope.row.Change" placeholder="" style="width:150px;" />
                </template>
              </el-table-column>
              <el-table-column prop="Low" label="操作" :days="cfgRow.RegisteredDays">
                <template scope="scope">
                  <el-button type="danger" size="mini" @click="delRow(scope.$index, cfgIdx)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" size="mini" @click="addRow(cfgIdx)">添加1行</el-button>
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
      cfgData: {
        'Apps': [],
        'AppsTxt': '',
        'Items': [
          { 'RegisteredDays': 0, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 1, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 2, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 3, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 4, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 5, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] },
          { 'RegisteredDays': 6, 'ProductValue': 0, 'ResetBaseValue': 0, 'ReCalcMoney': 0, 'LuckyLevelChanges': [{ 'Low': 0, 'Change': 60 }] }
        ]
      },
      form: {},
      libShow: $libShow,
      subKey: '',

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
    this.subKey = this.$route.meta.subKey
    this.getData()
  },
  methods: {
    addRow(cfgIdx) {
      if (typeof this.cfgData.Items[cfgIdx]) {
        this.cfgData.Items[cfgIdx].LuckyLevelChanges.push({ 'Low': 0, 'Change': 0 })
      }
    },
    delRow(idx, cfgIdx) {
      if (this.cfgData.Items[cfgIdx]) {
        this.$delete(this.cfgData.Items[cfgIdx].LuckyLevelChanges, idx)
      }
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
          const o = JSON.parse(this.form.Data)

          if (o.Apps && o.Apps.length > 0) {
            o.AppsTxt = o.Apps.join(',')
          }

          $this.cfgData = o
          for (const i in $this.cfgData.Items) {
            $this.cfgData.Items[i].ProductValue /= 1000
            $this.cfgData.Items[i].ResetBaseValue /= 1000
            $this.cfgData.Items[i].ReCalcMoney /= 1000
            for (const j in $this.cfgData.Items[i].LuckyLevelChanges) {
              $this.cfgData.Items[i].LuckyLevelChanges[j].Low /= 1000
            }
          }
          // 设置修改之前数据
          this.$refs.compare.SetOldVal(this.form)
        }
      })
    },
    setData() {
      const postData = $libType.DeepCopy(this.cfgData)
      let arr = []
      if (postData.AppsTxt && postData.AppsTxt != '') {
        arr = postData.AppsTxt.split(',')

        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(arr[i])
        }
        postData.Apps = arr
        postData.AppsTxt = null
      }

      for (const i in postData.Items) {
        postData.Items[i].ProductValue *= 1000
        postData.Items[i].ResetBaseValue *= 1000
        postData.Items[i].ReCalcMoney *= 1000
        for (const j in postData.Items[i].LuckyLevelChanges) {
          postData.Items[i].LuckyLevelChanges[j].Low *= 1000
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
          }
        })
      })
    }
  }
}
</script>
