<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="150px" :inline="true" size="small">

        <el-form-item label="UID：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="setUid">查询</el-button>
        </el-form-item>
        <el-form-item label="邀请码查询">
          <el-input v-model="inviteCode" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUidByInviteCode">获得Uid</el-button>
        </el-form-item>

      </el-form>
    </el-row>
    <el-row>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="Uid：">{{ this.item.Uid }}</el-descriptions-item>
        <el-descriptions-item label="充值：">{{ formatNumber(this.item.PayVal / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="充值次数：">{{ formatNumber(this.item.PayCount) }}</el-descriptions-item>
        <el-descriptions-item label="提款：">{{ formatNumber(this.item.WithDraw / 1000) }}</el-descriptions-item>
        <el-descriptions-item label="提款次数：">{{ formatNumber(this.item.WithDrawCount) }}</el-descriptions-item>
        <el-descriptions-item label="邀请数量：">{{ formatNumber(this.item.SonCount) }}</el-descriptions-item>
        <el-descriptions-item label="总奖励：">
          {{ this.item.TotalPrize / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item label="已领取奖励：" span="2">
          {{ (this.item.TotalPrize - this.item.Prize)/1000 }}
        </el-descriptions-item>

        <template v-if="item.SonCount > 0">
          <el-descriptions-item label="被邀请人充值次数：">{{ formatNumber(this.item.SonPayCount) }}</el-descriptions-item>
          <el-descriptions-item label="被邀请人充值额度：">{{ formatNumber(this.item.SonPay / 1000) }}</el-descriptions-item>
          <el-descriptions-item label="被邀请人提现次数：">{{ formatNumber(this.item.SonWithdrawCount) }}</el-descriptions-item>
          <el-descriptions-item label="被邀请人提现额度：">{{ formatNumber(this.item.SonWithdraw / 1000) }}</el-descriptions-item>

        </template>

        <el-descriptions-item v-if="this.item.Parent" label="父节点：" span="4">
          <template v-for="o in this.item.Parent">
            >>> {{ o }}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <el-tree
      ref="tree"
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      class="tree"
      :data="treeData"
      :render-content="renderContent"
    />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      libShow: $libShow,

      item: {
        Uid: 0,
        PayVal: 0,
        PayCount: 0,
        WithDraw: 0,
        WithDrawCount: 0,
        SonPay: 0,
        SonCount: 0,
        SonPayCount: 0,
        SonWithdraw: 0,
        SonWithdrawCount: 0,
        TotalPrize: 0,
        Prize: 0
      },
      inviteCode: '',
      treeData: [],
      defaultProps: {
        id: 'id',
        name: 'label',
        children: 'children',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getUidByInviteCode() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/code/uid',
          Code: this.inviteCode
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const uid = response.Data || {}
          this.item.Uid = uid
        }
      })
    },
    setUid() {
      if (this.item.Uid === 0) {
        if (this.inviteCode == '') {
          Message.error('请输入正确的Uid')
        } else {
          this.getUidByInviteCode()
        }
        return
      }
      this.$EventBus.$emit('uid-change', this.item.Uid)
      const $this = this
      this.treeData = [{ id: '点击展示邀请信息' }]

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/info',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          Object.assign(this.item, obj)
        }
      })

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/relation',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          console.log(obj)
          $this.getInfo()
        }
      })
    },
    renderContent(h, { node, data, store }) {
      if (data.isWin) {
        return (
          <span class='custom-tree-node'>
            <span>{data.id}</span>
            <span style='color:green'>&nbsp;&nbsp;{data.name}</span>
          </span>)
      } else {
        return (
          <span class='custom-tree-node'>
            <span>{data.id}</span>
            <span style='color:red'>&nbsp;&nbsp;{data.name}</span>
          </span>)
      }
    },
    getChildInfo(item, showData) {
      if (item.Children) {
        showData.isLeaf = false
        showData.children = []
        for (let i = 0; i < item.Children.length; i++) {
          const ob = item.Children[i]
          if (ob.PayTotal > 0 || ob.PayVal > 0) {
            const cnt = {
              id: ob.Uid,
              name: ob.PayVal / 1000 + ' - ' + ob.WithdrawVal / 1000 + ' - ' + ob.Money / 1000 + ' = ' + (ob.PayVal - ob.WithdrawVal - ob.Money) / 1000,
              leaf: true }
            if (i == 0) { // 计算所有子孙节点的总和
              cnt.id = '儿子合计'
              cnt.isWin = ob.PayVal - ob.WithdrawVal - ob.Money > 0
            } else {
              cnt.name += '，总计：' + (ob.PayTotal - ob.WithdrawTotal - ob.MoneyTotal) / 1000
              cnt.isWin = ob.PayTotal - ob.WithdrawTotal - ob.MoneyTotal >= 0
            }
            if (ob.Children) {
              this.getChildInfo(ob, cnt)
            }
            showData.children.push(cnt)
          }
        }
      } else {
        showData.isLeaf = true
      }
    },
    loading() {
      this.tempLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    loadingClose() {
      const $this = this
      setTimeout(function() {
        $this.tempLoading.close()
      }, 1000)
    },
    getInfo() {
      const $this = this
      this.item.SonPay = 0
      this.item.SonPayCount = 0
      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/invite/prizes',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = []
          const item = response.Data
          const showData = { id: item.Uid, name: item.PayVal / 1000 + ' - ' + item.WithdrawVal / 1000 + ' - ' + item.Money / 1000 + ' = ' + (item.PayVal - item.WithdrawVal - item.Money) / 1000, isWin: item.PayVal - item.WithdrawVal - item.Money > 0 }
          showData.name += '，总计：' + (item.PayTotal - item.WithdrawTotal - item.MoneyTotal) / 1000
          showData.isWin = item.PayTotal - item.WithdrawTotal - item.MoneyTotal >= 0
          this.getChildInfo(item, showData)

          data.push(showData)
          $this.treeData = data
          $this.loadingClose()
        }
      })
    }

  }
}
</script>

<style>
/* 树形结构节点添加连线 css */
.tree .el-tree-node {
  position: relative;
}

.tree .el-tree-node__children {
  padding-left: 16px;
}

.tree .el-tree-node :last-child:before {
  height: 38px;
}

.tree .el-tree > .el-tree-node:before {
  border-left: none;
}
.tree-container .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree .el-tree-node__children .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree .el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree .el-tree-node__expand-icon.is-leaf {
  display: none;
}

.tree .el-tree-node:before {
  border-left: 1px dashed #dddddd;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree .el-tree-node:after {
  border-top: 1px dashed #dddddd;
  height: 20px;
  top: 12px;
  width: 24px;
}
.tree .custom-tree-node {
  padding-left: 10px;
}
</style>
