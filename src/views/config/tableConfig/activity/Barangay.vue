<script>

import { DataRule } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'

export default {
  data() {
    return {
      subKey: 'barangay_cfg',
      form: {
        Data: {}
      },
      item: {
        IsOpen: false
      },
      Uid: 0,
      ProvinceCode: '',
      CityCode: '',
      BarangayCode: '',
      ProvinceList: [],
      CityList: [],
      BarangayList: [],
      AllInfoList: [],
      loading: true
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
    }
  }
}
</script>

<template>
  <el-col class="app-container">
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
</template>

<style scoped>

</style>
