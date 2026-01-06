<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="生成链接" name="first">
        <el-row>
          <el-form :model="item" label-width="90px" :inline="true" size="small">
            <el-form-item v-model="item.agent_id" label="平台：" :required="true" label-width="100px">
              <el-select v-model="item.agent_id" placeholder="请选择" size="mini">
                <el-option
                  v-for="row in agents"
                  :label="row.desc"
                  :value="row.agentId"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-model="item.account" label="账号：" :required="true" label-width="100px">
              <el-select v-model="item.account" filterable allow-create default-first-option placeholder="请选择" size="mini">
                <el-option
                  v-for="row in accounts"
                  :label="row.nick"
                  :value="row.val"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-model="item.site_id" label="渠道：" :required="true" label-width="100px">
              <el-select v-model="item.site_id" filterable placeholder="请选择渠道" size="mini">
                <el-option
                  v-for="c in channels"
                  :label="c"
                  :value="c"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-model="item.clientTerminalType" label="客户端类型：" :required="true" label-width="110px">
              <el-select v-model="item.clientTerminalType" placeholder="请选择" size="mini">
                <el-option
                  v-for="row in clientTerminalTypes"
                  :label="row.name"
                  :value="row.val"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-model="item.source" filterable label="用户来源：" :required="true" label-width="110px">
              <el-select v-model="item.source" placeholder="请选择" size="mini">
                <el-option
                  v-for="row in sources"
                  :label="row.name"
                  :value="row.val"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="enterurl">生成链接</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <p><span style="font-weight: bolder">注意：</span>链接调试时可能能有版本差异，需要自己手动修改版本号，版本号部分如下红色部分：</p>
          <p>http://192.168.6.16/web-mobile/<span style="color: red">1.0.0.424</span>/main/index.html?p=paramsvalue</p>
        </el-row>
        <el-row style="padding-top: 10px">
          <el-table
            ref="filterTable"
            :data="tableData"
            stripe
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column
              prop="EnterUrl"
              label="进入链接"
              width="1100"
            />
            <el-table-column
              prop="ExpiredTime"
              label="过期时间"
              width="150"
            />
            <el-table-column
              label="操作"
              column-key="op"
              width="200"
            >
              <template slot-scope="scope">
                <el-button class="ewm-copy-content" type="success" size="mini" :data-clipboard-text="scope.row.EnterUrl" round @click="copyClick(scope.row)">复制链接</el-button> ｜
                <el-link :href="scope.row.EnterUrl" type="success" target="_blank">打开链接</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="用户积分" name="second">
        <el-row>
          <el-form :model="pointItem" label-width="150px" size="small">
            <el-col :span="6" :offset="2">
              <el-form-item label="UID：" :required="true">
                <UidInput ref="uidInput" @setUid="function(iUid){pointItem.Uid=iUid}" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" @click="getUserPoint">查询</el-button>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-descriptions
              class="margin-top"
              :column="4"
              size="medium"
              border
            >
              <el-descriptions-item label="uid：">{{ pointItem.Uid }}</el-descriptions-item>
              <el-descriptions-item label="积分总数："> {{ formatNumber(pointItem.Point / 1000) }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-descriptions
              class="margin-top"
              :column="4"
              size="medium"
              border
            >
              <el-descriptions-item label="转入测试：">
                <el-col :span="8">
                  <el-input v-model="pointTransfer.Point" size="mini" />
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-button type="primary" size="mini" @click="pointTransferIn">转入</el-button>
                </el-col>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-descriptions
              class="margin-top"
              :column="4"
              size="medium"
              border
            >
              <el-descriptions-item label="转出测试：">
                <el-col :span="6" :offset="1">
                  <el-button type="primary" size="mini" @click="pointTransferOut">转出</el-button>
                </el-col>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.tooltip-button {
  margin-right: 10px;
}
</style>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import Clipboard from 'clipboard'
import { $libDate, $libShow, MoneyShow } from '@/utils/common'
// import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, Clipboard },
  data() {
    return {
      activeName: 'first',
      agents: [
        {
          id: 1000002,
          agentId: 'dayusenlin',
          desc: '内部用[1000002]'
        },
        {
          id: 1000003,
          agentId: 'testaccount',
          desc: 'BP UAT账号[1000003]'
        },
        {
          id: 1000008,
          agentId: 'gli',
          desc: 'BP gli 提审账号[1000008]'
        }
        // ,{
        //   id: 1000005,
        //   agentId: 'BingoPlusTongits',
        //   desc: '【GamePlus平台】正式账号 。'
        // }
      ],
      accounts: [
        {
          val: '1234567890',
          nick: 'bingoplus890'
        },
        {
          val: '1234567891',
          nick: 'bingoplus891'
        },
        {
          val: '1234567892',
          nick: 'bingoplus892'
        },
        {
          val: '1234567893',
          nick: 'bingoplus893'
        },
        {
          val: '1234567894',
          nick: 'bingoplus894'
        },
        {
          val: '1234567895',
          nick: 'bingoplus895'
        },
        {
          val: '1234567896',
          nick: 'bingoplus896'
        },
        {
          val: '1234567897',
          nick: 'bingoplus897'
        },
        {
          val: '1234567898',
          nick: 'bingoplus898'
        },
        {
          val: '1234567899',
          nick: 'bingoplus899'
        },
        {
          val: '1234567900',
          nick: 'bingoplus900'
        },
        {
          val: '1234567901',
          nick: 'bingoplus901'
        },
        {
          val: '1234567902',
          nick: 'bingoplus902'
        },
        {
          val: '1234567903',
          nick: 'bingoplus903'
        },
        {
          val: '1234567904',
          nick: 'bingoplus904'
        },
        {
          val: '1234567905',
          nick: 'bingoplus905'
        },
        {
          val: '1234567906',
          nick: 'bingoplus906'
        },
        {
          val: '1234567907',
          nick: 'bingoplus907'
        },
        {
          val: '1234567908',
          nick: 'bingoplus908'
        },
        {
          val: '1234567909',
          nick: 'bingoplus909'
        }
      ],
      channels: ['Dev', 'BP', 'GP', 'AP'],
      clientTerminalTypes: [
        {
          name: 'App',
          val: '1'
        },
        {
          name: 'Web',
          val: '2'
        },
        {
          name: '未知',
          val: ''
        }
      ],
      sources: [
        {
          name: 'glife.bingoplus.com',
          val: 'glife.bingoplus.com'
        },
        {
          name: 'glife.peryagame.com',
          val: 'glife.peryagame.com'
        },
        {
          name: 'glife.arenaplus.net',
          val: 'glife.arenaplus.net'
        },
        {
          name: 'arenaplusandroid2.com',
          val: 'arenaplusandroid2.com'
        },
        {
          name: '1.bingoplus.net',
          val: '1.bingoplus.net'
        },
        {
          name: 'maya.peryagame.com',
          val: 'maya.peryagame.com'
        },
        {
          name: 'bingoplus.com',
          val: 'bingoplus.com'
        }
      ],
      appInfo: [],
      tableData: [],
      env: 'dev',
      item: {
        agent_id: 'dayusenlin',
        secret: '',
        account: '1234567890',
        nick: '',
        screen: 'horizontal',
        clientTerminalType: '2',
        site_id: 'Dev',
        cashier: 'http://baidu.com',
        source: 'glife.bingoplus.com'
      },
      pointItem: {
        Uid: 0,
        Point: 0
      },
      pointTransfer: {
        Point: 0
      },
      libShow: $libShow,
      libShowMoney: new MoneyShow(['point']),
      expiredTime: 0,
      enterUrl: ''
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    if (this.env == 'test') {
      this.agents = [
        {
          id: 1000002,
          agentId: 'dayusenlin',
          desc: '内部用[1000002]'
        },
        {
          id: 1000003,
          agentId: 'testaccount',
          desc: 'BP 提审、测试账号[1000003]'
        },
        {
          id: 1000005,
          agentId: 'BingoPlusTongits',
          desc: 'BP正式账号[1000005]'
        }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    enterurl() {
      this.item.nick = ''
      let k
      for (k in this.accounts) {
        if (this.accounts[k].val === this.item.account) {
          this.item.nick = this.accounts[k].nick
        }
      }
      if (this.item.agent_id === 'testaccount' && this.item.site_id === 'GP') {
        this.$alert('提审环境暂时不能使用')
        return false
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
          Path: '/thirdparties/pointurl',
          agent_id: this.item.agent_id,
          secret: this.item.secret,
          account: this.item.account,
          nick: this.item.nick,
          // screen: this.item.screen,
          site_id: this.item.site_id,
          clientTerminalType: this.item.clientTerminalType,
          source: this.item.source
        }
      }).then(response => {
        loading.close()
        console.log(response)
        if (response.RetCode === 0) {
          console.log(response.Data.Url)
          this.tableData = []
          const one = {}
          one.EnterUrl = response.Data.Url
          one.ExpiredTime = $libDate.FormateMilisecondStrByZone(response.Data.ExpiredTime * 1000, 2, 'cn')
          this.tableData.push(one)
          console.log(this.tableData)
        } else {
          this.$alert(response.Data)
        }
      }).catch(function() {
        loading.close()
      })
    },
    // 复制链接
    copyClick(row) {
      this.copyLink()
    },
    copyLink() {
      // const that = this
      const clipboard = new Clipboard('.ewm-copy-content')
      clipboard.on('success', e => {
        this.$message({ message: '已成功复制到您的剪切板！', type: 'success' })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message({ message: '该浏览器不支持自动复制', type: 'error' })
        clipboard.destroy()
      })
    },
    getUserPoint() {
      if (this.pointItem.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/userpoint/userpoint',
          uid: this.pointItem.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log(response)
          $this.$EventBus.$emit('uid-change', $this.pointItem.Uid)
          $this.pointItem.Point = response.Data.point || 0
        }
      })
    },
    pointTransferIn() {
      if (this.pointItem.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      const confirmMsg = '确定给用户 [' + this.pointItem.Uid + '] 转入：' + this.formatNumber(this.pointTransfer.Point) + ' 吗？'
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
            Env: $this.env,
            Path: '/other/test/point/transfer',
            uid: $this.pointItem.Uid,
            point: $this.pointTransfer.Point * 1000,
            transferType: 1
          }
        }).then(response => {
          loading.close()
          // console.log(response)
          if (response.RetCode === 0) {
            let msg = '转入成功。'
            const amountAfter = response.Data.points_after || 0
            msg += '转移金额：' + $this.formatNumber(this.pointTransfer.Point) + '。'
            msg += '剩余余额：' + $this.formatNumber(amountAfter / 1000)
            $this.$message.success(msg)
            $this.pointItem.Point = amountAfter
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消【转账】操作'
        })
      })
    },
    pointTransferOut() {
      if (this.pointItem.Uid === 0) {
        Message.error('请输入正确的Uid')
        return
      }
      const $this = this
      const confirmMsg = '确定转出用户 [' + this.pointItem.Uid + '] 的所有积分吗？'
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
            Env: $this.env,
            Path: '/other/test/point/transfer',
            uid: $this.pointItem.Uid,
            point: 0,
            transferType: 2
          }
        }).then(response => {
          loading.close()
          console.log('转出成功>>>>', response)
          if (response.RetCode === 0) {
            let msg = '转出成功。'
            console.log(msg)
            const amountAfter = response.Data.points_after || 0
            msg += '转移金额：' + this.formatNumber((response.Data.points_before - response.Data.points_after) / 1000) + '。'
            msg += '剩余余额：' + $this.formatNumber(amountAfter / 1000)
            $this.pointItem.Point = amountAfter
            $this.$alert(msg, '转出成功', {
              confirmButtonText: '确定',
              callback: action => {
                $this.$message({
                  type: 'info',
                  message: `action: ${action}`
                })
              }
            })
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消【转账】操作'
        })
      })
    }
  }
}

</script>
