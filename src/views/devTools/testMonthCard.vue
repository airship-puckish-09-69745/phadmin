<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="110px" :inline="true" size="small">
        <el-form-item label="用户ID：">
          <el-input v-model="Uid" placeholder="请输入查询id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="haveFlag">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(o,key) in cards" :key="key" :label="getLabelName(o)">
          <el-form model:="CardFrom_{key}" label-width="110px" size="small">
            <el-form-item label="首笔金额：">
              {{ o.front_money/1000 }}
            </el-form-item>
            <el-form-item label="每日金额：">
              {{ o.fixed_money/1000 }}
            </el-form-item>
            <el-form-item label="开始日期：">
              <el-date-picker
                v-model="o.start_time"
                type="date"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="已领天数：">
              <el-checkbox-group v-model="o.data">
                <div v-if="o.period == 7">
                  <el-checkbox v-for="periodDay in periodWeek" :label="periodDay" />
                </div>
                <div v-else>
                  <el-checkbox v-for="periodDay in periodMonth" :label="periodDay" />
                </div>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="danger" size="mini" @click="setInfo(key)">修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  name: 'TestMonthCard',
  components: {},
  data() {
    return {
      Uid: 0,
      searchForm: {},
      cards: [],
      haveFlag: false,

      CardNum: 0,
      periodWeek: [1, 2, 3, 4, 5, 6, 7],
      periodMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    getInfo() {
      const $this = this
      this.haveFlag = false
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Uid: this.Uid,
          Path: '/other/test/month/card'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.CardNum = response.Data.length
          if (this.CardNum > 0) {
            // for (const i in response.Data) {
            //     response.data[i].StartTime *= 1000
            // }
            this.cards = response.Data
            for (let i = 0; i < this.CardNum; i++) {
              this.cards[i].start_time *= 1000
              this.cards[i].data = JSON.parse(this.cards[i].data)
            }
            console.log(this.cards)
            this.haveFlag = true
          }
        }
      })
    },
    getLabelName(obj) {
      return '【' + obj.id + '】' + obj.period + '天VIP卡'
    },
    getFromName(index) {
      return 'CardFrom' + index
    },
    getTimeName(index) {
      return this.getFromName(index) + '.StartTime'
    },
    setInfo(index) {
      const $this = this
      if (!this.haveFlag) {
        this.$message.error('请先查询用户vip月卡信息是否存在！')
        return
      }
      let dayStr = ''
      if (this.cards[index].data.length > 0) {
        dayStr = this.cards[index].data.join(',')
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          CardId: this.cards[index].id,
          Stime: this.cards[index].start_time / 1000,
          GiftDay: dayStr,
          Path: '/other/test/month/card'
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          this.$message({
            message: response.Data,
            type: 'success'
          })
        } else {
          this.$message.error(response.Data)
          return
        }
      })
    }
  }
}
</script>
