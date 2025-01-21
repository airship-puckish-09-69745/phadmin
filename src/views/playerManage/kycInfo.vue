<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="应用：">
          <el-select v-model="form.appId" size="mini" @change="onchange">
            <el-option v-for="row of apps" :label="row.label" :value="row.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用：">
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--公共配置-->
    <el-row>
      <el-card class="box-card">
        <el-form>
          <el-form-item label="历史账户数量总数：">
            <div>{{ form.all }}</div>
          </el-form-item>
          <el-form-item label="已KYC账户数量总数：">{{form.kyc}}
          </el-form-item>
          <el-form-item label="未KYC账户数量总数：">{{form.all-form.kyc}}
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>
  
  <script>
  import request from '@/utils/request'
  import { $libShow } from '@/utils/common'
  
  export default {
    data() {
      return {
        name: "kycInfo",
        apps: [
            { 'value': 0, 'label': '全部' },
            { 'value': 1000002, 'label': '内部用[1000002]' },
            { 'value': 1000003, 'label': 'BP-测试[1000003]' },
            { 'value': 1000005, 'label': 'BP-正式[1000005]' }
        ],
        syncConfig: false,
        chartData: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ],
        labelConfig: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        form: {
          data: {},
          appId: 0,
          all: 0,
          kyc: 0,
        },
        libShow: $libShow,
      }
    },
  
    created() {
      this.getData()
      console.log(1)
    },
    methods: {
      getData() {
        request({
            url: '/dataProxy/info',
            method: 'get',
            data: {
                Env: this.env,
                Path: '/misc/kyc/stat',
                App: this.form.appId,
            }
        }).then(response => {
          if (response.RetCode === 0) {
            // console.log('cfg', response)
            this.form.data = response.Data
            if (this.form.appId > 0) {
              this.form.all = response.Data["all_"+this.form.appId]
              this.form.kyc = response.Data["kyc_"+this.form.appId]
            } else {
              this.form.all = response.Data["all_1000002"]+response.Data["all_1000003"]+response.Data["all_1000005"]
              this.form.kyc = response.Data["kyc_1000002"]+response.Data["kyc_1000003"]+response.Data["kyc_1000005"]
            }
          }
        })
      },
      onchange(appId){
        const data = this.form.data
        // console.log("change appId",appId)
        if (appId > 0) {
          this.form.all = data["all_"+appId]
          this.form.kyc = data["kyc_"+appId]
        } else {
          this.form.all = data["all_1000002"]+data["all_1000003"]+data["all_1000005"]
          this.form.kyc = data["kyc_1000002"]+data["kyc_1000003"]+data["kyc_1000005"]
        }
      }
    }
  }
  </script>
  