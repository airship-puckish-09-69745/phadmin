<template>
  <div class="app-container">


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-form inline>
          <el-form-item label="活动ID：">
            <el-select v-model="queryData.ActivityId" size="mini">
              <el-option v-for="(o,k) in activityIds" :label="o" :value="k"/>
            </el-select>
          </el-form-item>
          <el-form-item label="UID：">
            <el-input v-model="queryData.UID" size="mini" placeholder="活动ID"/>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getData">查询</el-button>

          </el-form-item>
          <el-form-item >
          <el-col span="8" offset="20">
            <el-button type="primary" @click="getData">更新虚拟币</el-button>
          </el-col>
          </el-form-item>
        </el-form>

      </el-col>

      <el-descriptions class="margin-top"  :column="1" :size="max" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            当前虚拟币
          </template>
          {{virtualCoin}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"  >
            <i class="el-icon-location-outline"></i>
            当前积分
          </template>
          {{ point }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            当前排名
          </template>
          {{rank}}
        </el-descriptions-item>

      </el-descriptions>
    </el-row>

  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {getInfo} from "@/api/user";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, MoneyInput, getInfo},
  data() {
    return {
      rank:"阿斯顿",
      uid:"",
      point:"",
      virtualCoin:"",
      activityIds:[],
      queryData: {
        ActivityId: 0,
        UID: "",
      },

    }
  },

  created() {
    this.getAllActivityId()
  },
  methods: {
    getAllActivityId(){
      request({
        url: '/millionpointracerule/all/activity',
        method: 'get',
        data: {        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.activityIds=response.Data

          this.queryData.ActivityId=0
        } else {
          Message.error('查询失败')
        }
      })
    },
    getData() {
      if (this.queryData.UID==""){
        Message.error('请输入UID')
      }
      const $this = this
      if (this.queryData.ID == "") {
        this.queryData.ID = 0
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/user/detail',
        method: 'get',
        data: {
          UID: 0,
          ActivityId: 0,
          EventType: 0,
          Offset: this.offset,
          Limit: this.limit,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.dataList = response.Data.Data || []
          $this.total = response.Data.Count
          console.log(this.dataList)
          console.log(this.total)
          console.log(this.dataList)

        } else {
          Message.error('查询失败')
        }
      })
    },
  }
}

</script>
<style scoped>
>>> .el-descriptions__body {
  width: 20%;
}
</style>
