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
          <el-select v-model="searchForm.TransferType" placeholder="">
            <el-option label="转入" :value="2" />
            <el-option label="转出" :value="1" />
          </el-select>
          <el-tooltip class="item" effect="dark" content="类型为转出时，不使用输入的数量" placement="left-start">
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
      </el-row>
      <el-row>
        <money-input v-model="searchForm.Money" label="数量" />
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button type="danger" size="mini" @click="transfer">转账</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
import MoneyInput from '@/components/MoneyInput'
export default {
  name: 'TestWebThirdpartyTransfer',
  components: { MoneyInput },
  data() {
    return {
      searchForm: {
        Uid: 0,
        TransferType: 1,
        Money: 0
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    transfer() {
      let searchUid = 0
      if (this.searchForm.Uid > 0) {
        searchUid = this.searchForm.Uid
      }
      if (searchUid <= 0) {
        this.$message.error('请输入用户ID')
        return
      }
      if (this.searchForm.TransferType === 1 && this.searchForm.Money <= 0) {
        this.$message.error('请输入正确金额')
        return
      }
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
          TransferType: this.searchForm.TransferType,
          Money: this.searchForm.Money,
          Path: '/other/test/transfer'
        }
      }).then(response => {
        loading.close()
        console.log(response)
        if (response.RetCode === 0) {
          this.$message.success('SUCCESS')
        }
      }).catch(function() {
        loading.close()
      })
    }
  }
}
</script>
