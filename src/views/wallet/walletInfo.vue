<template>
  <div class="app-container">

    <el-row :gutter="10" >
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-col :span="16">
            <el-form-item label="Uid">
              <el-input v-model.number="item.uid" placeholder="Uid" size="mini"
                        oninput="if(value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="getData">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="danger" size="mini" @click="open('是否清除下注状态',1)">清除下注状态</el-button>
              <el-button type="warning" size="mini" @click="open('是否清除玩牌异常注状态',2)">清除玩牌异常状态</el-button>
              <el-button type="warning" size="mini" @click="open('是否执行Rollin操作',3)">执行Rollin操作</el-button>
            </el-form-item>
          </el-col>
        </el-form>

      <el-col :span="18" :offset="1">
        <el-descriptions class="margin-top" :column="2" border  style="background-color: red">
          <el-descriptions-item   label="Uid">{{ walletInfo.Uid }}</el-descriptions-item>
          <el-descriptions-item label="账号">{{ walletInfo.Account }}</el-descriptions-item>
          <el-descriptions-item label="App">{{ walletInfo.App }}</el-descriptions-item>
          <el-descriptions-item label="平台">{{ walletInfo.Site}}</el-descriptions-item>
          <el-descriptions-item label="刷新时间">{{ formatTime(walletInfo.RefreshTime) }}</el-descriptions-item>

          <el-descriptions-item label="当前资产">{{ formatNumber(walletInfo.Money/1000) }}</el-descriptions-item>
          <el-descriptions-item label="原始转出金额">{{ formatNumber(walletInfo.RawRolloutMoney/1000) }}</el-descriptions-item>
          <el-descriptions-item label="当前下注金额">{{ formatNumber(walletInfo.BetAmount/1000) }}</el-descriptions-item>
          <el-descriptions-item label="当前转出资产">{{ formatNumber(walletInfo.RolloutMoney/1000) }}</el-descriptions-item>
          <el-descriptions-item label="最新下注时间">{{ formatTime(walletInfo.BetTime) }}</el-descriptions-item>
          <el-descriptions-item label="最新Rollout时间">{{ formatTime(walletInfo.RolloutTime) }}</el-descriptions-item>
          <el-descriptions-item label="阶段">{{stageMap[walletInfo.Stage] }}</el-descriptions-item>

          <el-descriptions-item label="上次交易id">{{ walletInfo.TxId }}</el-descriptions-item>
          <el-descriptions-item label="上次回合id">{{ walletInfo.RoundId }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {$libDate, $libShow} from "@/utils/common";
import {Message} from "element-ui";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date() - 86400000 * 3), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      item: {
        limit: 20,
        offset: 1,
        uid: 0,
        gid: 0,
        app: 0,
        txId: '',
      },
      walletInfo: {
        Uid: 0,
        Account: '',
        App: 0,
        Site: '',
        BetAmount: 0,
        Money: 0,
        Stage: 0,
        RolloutMoney: 0,
        RawRolloutMoney: 0,
        TxId: '',
        RoundId: '',
        RefreshTime: 0,
        RolloutTime: 0,
        BetTime: 0
      },
      stageMap: {
        0: '正常阶段', 1: 'Bet 阶段', 2: 'Rollout阶段',
      }
    }
  },
  created() {
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getData() {
      const $this = this
      let bTime = 0
      let eTime = 0
      if (this.timeRange) {
        bTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        eTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      if ($this.item.uid === '' || $this.item.uid === 0 || $this.item.uid === 'NaN'|| $this.item.uid ===NaN) {
        Message.error('请输入正确的Uid')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/wallet/info',
          Uid: $this.item.uid,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.walletInfo = response.Data
        }
      })
    },
    cleanRoundStatus() {
      const $this = this
      if ($this.item.uid === '' || $this.item.uid === 0 || $this.item.uid === 'NaN'|| $this.item.uid ===NaN) {
        Message.error('请输入正确的Uid')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/clean/round/status',
          Uid: $this.item.uid,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success("清除下注状态成功！")
        }
      })
    },
    cleanPlayStatus() {
      const $this = this
      if ($this.item.uid === '' || $this.item.uid === 0 || $this.item.uid === 'NaN'|| $this.item.uid ===NaN) {
        Message.error('请输入正确的Uid')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/clean/play/status',
          Uid: $this.item.uid,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success("清除玩牌异常成功！")
        }
      })
    },
    Rollin() {
      const $this = this
      if ($this.item.uid === '' || $this.item.uid === 0 || $this.item.uid === 'NaN'|| $this.item.uid ===NaN) {
        Message.error('请输入正确的Uid')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/wallet/rollin',
          Uid: $this.item.uid,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success("执行Rollin成功！")
        }
      })
    },
      formatNumber(n) {
          return n.toLocaleString()
      },
    open(context,type) {
      this.$confirm(context, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type==1){
          this.cleanRoundStatus()
        }else if (type==2){
            this.cleanPlayStatus()
        }else if (type==3){
          this.Rollin()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  }
}
</script>

<style>
.my-label {
  background: #E1F3D8;
}
.my-content {
  background: #FDE2E2;
}
</style>
