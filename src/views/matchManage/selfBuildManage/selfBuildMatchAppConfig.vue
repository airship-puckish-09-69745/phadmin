
<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane v-if="whitelistCfg != null" label="渠道配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" :required="true">
                  <el-select v-model="whitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px">
                    <el-option
                      v-for="item in APPID_OPTIONS"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="SiteId白名单：" :required="true">
                  <el-select v-model="whitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px">
                    <el-option
                      v-for="item in CHANNEL_OPTIONS"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import { DataRule } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import { APPID_OPTIONS ,CHANNEL_OPTIONS } from '@/utils/options'

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'selfBuildMatchAppCfg',
      form: {
        Data: {}
      },
      item: {
        WhitelistCfg: { //白名单配置
          AppIdList:[],
          SiteIdList:[]
        },
      },
      whitelistCfg: { //白名单配置
        AppIdList:[],
        SiteIdList:[]
      },
      APPID_OPTIONS,
      CHANNEL_OPTIONS
    }

  },
  created() {
    this.env = store.getters.env || this.env
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
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
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)
            if (this.item.WhitelistCfg == null){
              this.whitelistCfg = {
                AppIdList:[],
                SiteIdList:[]
              }
            }else{
              this.whitelistCfg = this.item.WhitelistCfg
            }
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    setData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      cpy.WhitelistCfg = this.whitelistCfg
      this.form.Data = JSON.stringify(cpy)
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
    },

  }
}
</script>
