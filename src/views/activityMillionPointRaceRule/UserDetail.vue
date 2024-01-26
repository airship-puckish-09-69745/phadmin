<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="22">
        <el-form inline>
          <el-form-item label="周期：">
            <el-select v-model="queryData.ActivityId" size="mini">
              <el-option
                v-for="item in activityIds"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="UID：">
            <el-input v-model="queryData.UID" size="mini" placeholder="UID" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone" />
            添加或扣减虚拟币
          </template>
          <el-col>
            <el-form inline>
              <el-form-item>
                <el-input v-model="addVirtualCoin" size="mini" style="width: 200px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="updateUser">更新虚拟币</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone" />
            当前虚拟币
          </template>
          {{ virtualCoin | toRupee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline" />
            当前积分
          </template>
          {{ point | toRupee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets" />
            当前排名(0表示未上榜)
          </template>
          {{ rank }}
        </el-descriptions-item>

      </el-descriptions>
    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { getInfo } from '@/api/user'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, MoneyInput, getInfo },
  data() {
    return {
      rank: 0,
      uid: '',
      point: 0,
      virtualCoin: 0,
      addVirtualCoin: 0,
      activityIds: [],
      queryData: {
        ActivityId: 0,
        UID: ''
      }

    }
  },

  async created() {
    await this.getAllActivityId()
  },
  methods: {
    async getAllActivityId() {
      request({
        url: '/millionpointracerule/all',
        method: 'get',
        data: { }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log(response.Data)
          for (let i = 0; i < response.Data.length; i++) {
            var cfg = { 'key': response.Data[i].Title, 'value': response.Data[i].ID }
            this.activityIds.push(cfg)
          }
          this.queryData.ActivityId = this.activityIds[0].value
        } else {
          Message.error('查询失败')
        }
      })
    },
    updateUser() {
      if (this.queryData.UID == '') {
        Message.error('请输入UID')
        return
      }
      const $this = this
      if (this.queryData.ID == '') {
        this.queryData.ID = 0
      }
      request({
        url: 'millionpointracerule/update/user',
        method: 'post',
        data: {
          UID: this.queryData.UID,
          ActivityId: this.queryData.ActivityId,
          VirtualCoin: parseInt(this.addVirtualCoin) * 1000,
          Point: 0,
          Path: '/millonpointrace/update/user'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log(response.data)
          if (response.RetCode !== 0) {
            Message.error('更新失败')
            return
          }
          Message.success('更新成功')
          this.getData()
        } else {
          Message.error('查询失败')
        }
      })
    },

    getData() {
      if (this.queryData.UID == '') {
        Message.error('请输入UID')
        return
      }
      const $this = this
      if (this.queryData.ID == '') {
        this.queryData.ID = 0
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/user/detail',
        method: 'get',
        data: {
          UID: this.queryData.UID,
          ActivityId: this.queryData.ActivityId,
          EventType: this.queryData.EventType,
          Offset: this.offset,
          Limit: this.limit,
          Path: '/millonpointrace/user/detail'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var obj = JSON.parse(response.Data)
          console.log(obj)
          if (obj.RetCode != 0) {
            Message.error('查询失败')
            return
          }
          this.virtualCoin = obj.Data.userData.VirtualCoin
          this.point = obj.Data.userData.Point
          this.rank = obj.Data.rank.Rank
          console.log(this.virtualCoin)
          console.log(this.point)
          console.log(this.rank)
        } else {
          Message.error('查询失败')
        }
      })
    }
  }
}

</script>
<style scoped>
>>> .el-descriptions__body {
  width: 50%;
}
</style>
