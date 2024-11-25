<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">
      <div style="color: yellowgreen;font-weight: bolder;">
        <p />
      </div>
      <br>
      <el-col>
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="20">
        <el-descriptions
          class="margin-top"
          :column="1"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px', 'color':'red'}"
          border
        >
          <el-descriptions-item label="说明：">当前实现，应用开启IP检测后，国内的IP将被拒绝登录（白名单内的IP能登录）。后期规划：支持分地区检测，支持IP黑名单。</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-form ref="allCfg" v-model="allCfg" label-width="180px">
        <el-form-item label="选择开启IP检测的应用">
          <el-checkbox-group v-model="allCfg.apps">
            <el-row :gutter="10"> <!-- 使用 gutter 控制间距 -->
              <el-col v-for="app in appInfo" :span="6">
                <el-checkbox v-model="allCfg.apps" :label="app.key" :value="app.key" border>{{ app.label }}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-form-item
            v-for="(ip, index) in allCfg.ip_whitelist"
            :label="'ip白名单' + index"
            :prop="'ip.' + index + '.value'"
          >
            <el-col :span="18">
              <el-input v-model="allCfg.ip_whitelist[index]" />
            </el-col>
            <el-col :span="6">
              <el-button @click.prevent="removeIp(index)">删除</el-button>
            </el-col>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-button type="success" @click="addIp">添加IP</el-button>
          <el-button type="primary" @click="setData">保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      form: {},
      subKey: 'deny_login_to_cn_ip',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      appInfo: [],
      allCfg: {
        apps: [],
        ip_whitelist: []
      }
    }
  },
  computed: {
  },
  created() {
    this.getAppInfo()
    this.getData()
  },
  methods: {
    addIp() {
      this.allCfg.ip_whitelist.push('')
    },
    removeIp(idx) {
      this.allCfg.ip_whitelist.splice(idx, 1)
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.listData = []
          if (response.Data && response.Data.Data !== '') {
            $this.allCfg = JSON.parse(response.Data.Data)
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      this.formatCfg()
      if (!this.checkData()) {
        return false
      }
      this.form.Data = JSON.stringify(this.allCfg)
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
    },
    formatCfg() {
      const ips = []
      for (const i in this.allCfg.ip_whitelist) {
        // 判断是否为空字符串
        if (this.allCfg.ip_whitelist[i].trim() !== '') {
          ips.push(this.allCfg.ip_whitelist[i])
        }
      }
      this.allCfg.ip_whitelist = ips
    },
    checkData() {
      return true
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    }
  }
}
</script>
