<script>

import { DataRule } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import {getCustomize, updateCustomize} from "@/api/custome_configV2";

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'barangay_cfg',
      form: {
        Data: {}
      },
      item: {
        IsOpen: false,
        WhitelistCfg: { //白名单配置
          AppIdList:[],
          SiteIdList:[]
        },
      },
      IsOpenBarangay: true,
      Uid: 0,
      ProvinceCode: '',
      CityCode: '',
      BarangayCode: '',
      ProvinceList: [],
      CityList: [],
      BarangayList: [],
      AllInfoList: [],
      loading: true,
      whitelistCfg: { //白名单配置
         AppIdList:[],
         SiteIdList:[]
      },
      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      channelIdCfgs: [
        { 'value': 'BP', 'label': 'BP' },
        { 'value': 'AP', 'label': 'AP' },
        { 'value': 'GP', 'label': 'GP' },
        // { 'value': 'TP', 'label': 'TP' },
        { 'value': 'PG', 'label': 'PG' },
        { 'value': 'Dev', 'label': 'Dev' }
      ],
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
    async getUserInfo() {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/activity/barangay/user/info',
            Uid: this.Uid
          }
        })
        if (response.RetCode === 0) {
          const userBarangay = response.Data || {}
          this.ProvinceCode = userBarangay.ProvinceCode
          this.CityCode = userBarangay.CityCode
          this.BarangayCode = userBarangay.BarangayCode
          console.log('response ' + userBarangay.ProvinceCode)
        }
      } catch (error) {
        console.log(error)
      } finally {
        console.log('finally ' + this.ProvinceCode)
        console.log('finally ' + this.CityCode)
        this.getList()
        this.changeProvince()
        this.changeCity()
      }
    },
    getInfo() {
      if (this.item.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/activity/barangay/user/info',
          Uid: $this.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const userBarangay = response.Data || {}
          $this.ProvinceCode = userBarangay.ProvinceCode
          $this.CityCode = userBarangay.CityCode
          $this.BarangayCode = userBarangay.BarangayCode
        }
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getList() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/activity/barangay/list',
          ProvinceCode: '-1',
          CityCode: '-1'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const barangayList = response.Data || []
          for (let i = 0; i < barangayList.length; i++) {
            const barangay = barangayList[i]
            $this.ProvinceList.push({
              value: barangay.ProvinceCode,
              label: barangay.ProvinceName
            })
          }
        }
      })
    },
    changeProvince() {
      const $this = this
      if ($this.ProvinceCode === '') {
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/activity/barangay/list',
          ProvinceCode: $this.ProvinceCode,
          CityCode: '-1'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const barangayList = response.Data || []
          for (let i = 0; i < barangayList.length; i++) {
            const barangay = barangayList[i]
            $this.CityList.push({
              value: barangay.CityCode,
              label: barangay.CityName
            })
          }
        }
      })
    },

    changeCity() {
      const $this = this
      if ($this.ProvinceCode === '' && $this.CityCode === '') {
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/activity/barangay/list',
          ProvinceCode: $this.ProvinceCode,
          CityCode: $this.CityCode
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const barangayList = response.Data || []
          for (let i = 0; i < barangayList.length; i++) {
            const barangay = barangayList[i]
            $this.BarangayList.push({
              value: barangay.BarangayCode,
              label: barangay.BarangayName
            })
          }
        }
      })
    },
    changeBarangayInfo() {
      const postData = {}
      postData.Env = this.env
      postData.Path = '/activity/barangay/user/change'
      postData.Uid = this.Uid
      postData.Del = false
      postData.ProvinceCode = this.ProvinceCode
      postData.CityCode = this.CityCode
      postData.BarangayCode = this.BarangayCode
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('修改成功！')
        }
      })
    },
    deleteBarangayInfo() {
      const postData = {}
      postData.Env = this.env
      postData.Path = '/activity/barangay/user/change'
      postData.Uid = this.Uid
      postData.Del = true
      postData.ProvinceCode = this.ProvinceCode
      postData.CityCode = this.CityCode
      postData.BarangayCode = this.BarangayCode
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('初始化成功！')
        }
      })
    },
    getData() {
      const $this = this
      getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            console.log("response.Data.Data:", response.Data.Data)
            console.log(JSON.parse(response.Data.Data))
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
            this.IsOpenBarangay = this.item.IsOpen
            console.log("this.IsOpenBarangay:", this.IsOpenBarangay)
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    setData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      cpy.WhitelistCfg = this.whitelistCfg
      cpy.IsOpen = this.IsOpenBarangay
      this.form.Data = JSON.stringify(cpy)
      console.log('setData', this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        updateCustomize($this.form).then(response => {
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

<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-row :span="6">
                <el-form :model="item" label-width="150px" size="small">
                  <el-col :span="6">
                    <el-form-item label="UID：" :required="true">
                      <el-input v-model.number="Uid" placeholder="请输入uid" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" size="mini" @click="getUserInfo">查询</el-button>
                  </el-col>
                </el-form>
              </el-row>

              <el-row :span="6">
                <el-form :model="item" :inline="true" label-width="50px" size="medium ">

                  <el-form-item label="省">
                    <el-select v-model="ProvinceCode" filterable placeholder="请选择省" @change="changeProvince">
                      <el-option
                        v-for="itemProvince in ProvinceCode === '' ? [{value:0,label:'未设置'}] : ProvinceList"
                        :key="itemProvince.value"
                        :label="itemProvince.label"
                        :value="itemProvince.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="市">
                    <el-select v-model="CityCode" filterable placeholder="请选择市" @change="changeCity">
                      <el-option
                        v-for="itemCity in CityCode === '' ? [{value:0,label:'未设置'}] : CityList"
                        :key="itemCity.value"
                        :label="itemCity.label"
                        :value="itemCity.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="群">
                    <el-select v-model="BarangayCode" filterable placeholder="请选择群">
                      <el-option
                        v-for="itemBarangay in BarangayCode === '' ? [{value:0,label:'未设置'}] : BarangayList"
                        :key="itemBarangay.value"
                        :label="itemBarangay.label"
                        :value="itemBarangay.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="changeBarangayInfo">修改</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="deleteBarangayInfo">初始化</el-button>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>

            <el-form>
              <el-col :span="11">
                <el-form-item label="是否开启：" :required="true">
                  <el-switch
                    v-model="IsOpenBarangay"
                  />
                </el-form-item>
              </el-col>
            </el-form>

          </el-row>
        </el-tab-pane>

        <el-tab-pane v-if="whitelistCfg != null" label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" :required="true">
                  <el-select v-model="whitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px">
                    <el-option
                      v-for="item in appidInfoCfgs"
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
                      v-for="item in channelIdCfgs"
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

<style scoped>

</style>
