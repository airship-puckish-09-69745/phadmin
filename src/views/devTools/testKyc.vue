<template>
  <div class="app-container">
    <el-form :model="searchForm" label-width="110px" :inline="true" size="small">
      <el-row>
        <el-form-item label="用户ID：">
          <el-input v-model="searchForm.Uid" placeholder="请输入uid" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="类型">
          <el-select v-model="searchForm.Kyc" placeholder="">
            <el-option label="未KYC" :value="0" />
            <el-option label="已KYC" :value="1" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button type="danger" size="mini" @click="transfer">修改</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  name: 'TestKyc',
  data() {
    return {
      searchForm: {
        Uid: 0,
        Kyc: 1,
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    transfer() {
      let searchUid = 0
      if (this.searchForm.Uid > 0) {
        searchUid = this.searchForm.Uid
      }
      if (searchUid <= 0) {
        this.$message.error('请输入用户ID')
        return
      }
      let confirmMsg = '确定修改用户 [' + searchUid + '] 为未KYC的状态吗？'
      if (this.searchForm.Kyc == 1) {
        confirmMsg = '确定修改用户 [' + searchUid + '] 为已KYC的状态吗？'
      }
      this.$confirm(confirmMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '数据拉取中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Uid: searchUid,
            Kyc: this.searchForm.Kyc,
            Path: '/other/test/kyc'
          }
        }).then(response => {
          loading.close()
          console.log(response)
          if (response.RetCode === 0) {
            let msg = '修改成功。'
            this.$message.success(msg)
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消【修改】操作'
        })
      })
    }
  }
}
</script>
