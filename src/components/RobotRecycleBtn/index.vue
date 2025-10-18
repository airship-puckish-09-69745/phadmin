<!-- 机器人回收按钮：用于将【场次配置】中多个AI-List列表的机器人回收到机器人管理页面 -->
<template>
  <el-button v-if="showBtn" type="warning" size="mini" @click="handleRecycleRobot">
    回收
  </el-button>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    // uid: {
    //   type: Number,
    //   required: true
    // },
    gid: {
      type: Number,
      required: true
    },
    // currentMoney: {
    //   type: Number,
    //   required: true
    // }

    // 由于每个列表传过来的数据字段都是一样的，改成直接传递row，包括按钮的显示判断也在这里面做
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    uid() {
      return this.row.uid
    },
    currentMoney() {
      return this.row.money * 1000
    },
    // 只有冻结情况下并且输赢比大于等于0才显示回收按钮
    showBtn() {
      return this.row.status === 0 && (this.row.money - this.row.initMoney) * 100 / this.row.initMoney >= 0
    }
  },
  methods: {
    handleRecycleRobot() {
      this.$confirm(`确认回收机器人[${this.uid}]吗？`, '回收提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'POST',
          data: {
            Env: this.env,
            Path: '/usercommonrobot/recycling',
            uid: this.uid,
            gid: this.gid,
            currentMoney: parseFloat(this.currentMoney.toFixed(4))
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.row.status = 2
            // console.log(response.Data)
            this.$message({
              message: '回收成功',
              type: 'success'
            })
            this.$emit('success')
          }
        })
      })
    }
  }
}
</script>
