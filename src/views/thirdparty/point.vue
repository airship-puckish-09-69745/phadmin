<template>
  <div class="app-container">
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
          <el-select v-model="item.account" filterable placeholder="请选择" size="mini">
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
    <div style="padding-top: 10px">
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
            <el-button class="ewm-copy-content" type="success" size="mini" :data-clipboard-text="scope.row.EnterUrl" @click="copyClick(scope.row)" round>复制链接</el-button> ｜
            <el-link :href="scope.row.EnterUrl" type="success" target="_blank">打开链接</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { $libDate, $libShow } from '@/utils/common'
// import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, Clipboard },
  data() {
    return {
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
      channels: ['Dev', 'BP', 'GP', 'AP', 'PG'],
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
      libShow: $libShow,
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
    }
  }
}

</script>
