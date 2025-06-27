<!-- 机器人回收按钮：用于将【场次配置】中多个AI-List列表的机器人回收到机器人管理页面 -->
<template>
  <el-button type="warning" @click="handleRecycleRobot">
    回收
  </el-button>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    uid: {
      type: Number,
      required: true
    },
    gid: {
      type: Number,
      required: true
    },
    currentMoney: {
      type: Number,
      required: true
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
            currentMoney: this.currentMoney
          }
        }).then(response => {
          // 情况input的value
          this.uploadedFile = null
          if (response.RetCode === 0) {
            // console.log(response.Data)
            this.$message({
              message: '回收成功',
              type: 'success'
            })
            this.handleClose()
            this.$emit('success')
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      })
    }
  }
}
</script>
