<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item v-model="item.api" label="请求环境：" :required="true" label-width="80px">
          <el-select v-model="item.api" placeholder="请选择" size="mini">
            <el-option
              v-for="row in apis"
              :label="row.name"
              :value="row.url"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.agent_id" label="平台：" :required="true" label-width="80px">
          <el-select v-model="item.agent_id" placeholder="请选择" size="mini">
            <el-option
              v-for="row in agents"
              :label="row.desc"
              :value="row.agentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.account" label="账号：" :required="true" label-width="80px">
          <el-select v-model="item.account" placeholder="请选择" size="mini">
            <el-option
              v-for="row in accounts"
              :label="row.nick"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.screen" label="横竖屏：" :required="true" label-width="80px">
          <el-select v-model="item.screen" placeholder="请选择" size="mini">
            <el-option
              v-for="row in screens"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.directScene" label="进入场景：" :required="true" label-width="80px">
          <el-select v-model="item.directScene" placeholder="请选择" size="mini">
            <el-option
              v-for="row in directScenes"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.clientTerminalType" label="客户端类型：" :required="true" label-width="80px">
          <el-select v-model="item.clientTerminalType" placeholder="请选择" size="mini">
            <el-option
              v-for="row in clientTerminalTypes"
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
          width="100"
        >
          <template slot-scope="scope">
            <el-button class="ewm-copy-content" type="text" size="mini" @click="copyClick(scope.row)" :data-clipboard-text="scope.row.EnterUrl">复制链接</el-button>
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
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, Clipboard },
  data() {
    return {
      apis: [{ name: '开发', url: 'http://192.168.6.16:9304/login' }, { name: '正式', url: 'https://ph-api.tiptop.bet/login' }],
      agents: [
        {
          id: 1000002,
          agentId: 'dayusenlin',
          desc: '内部用'
        },
        {
          id: 1000003,
          agentId: 'testaccount',
          desc: '【GamePlus平台】 提审、测试账号。'
        },
        {
          id: 1000005,
          agentId: 'BingoPlusTongits',
          desc: '【GamePlus平台】正式账号 。'
        }
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
        }
      ],
      screens: [
        {
          name: '横屏',
          val: 'horizontal'
        },
        {
          name: '竖屏',
          val: 'vertical'
        }
      ],
      directScenes: [
        {
          name: '大厅',
          val: ''
        },
        {
          name: 'Tongits',
          val: 'tongits'
        },
        {
          name: 'Tongits-经典',
          val: 'tongits_classic'
        },
        {
          name: 'Lucky9',
          val: 'lucky9'
        },
        {
          name: 'Texas',
          val: 'texas'
        },
        {
          name: '小火箭',
          val: 'rocket'
        },
        {
          name: 'Color',
          val: 'colorgame'
        }
      ],
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
      appInfo: [],
      tableData: [],
      env: 'dev',
      item: {
        agent_id: 'dayusenlin',
        secret: '',
        account: '1234567890',
        nick: '',
        screen: 'horizontal',
        directScene: 'tongits',
        clientTerminalType: '2',
        api: 'http://192.168.6.16:9304/login',
        debug: '0'
      },
      libShow: $libShow,
      expiredTime: 0,
      enterUrl: ''
    }
  },
  computed: {},
  created() {
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
      request({
        url: '/thirdparties/loginurl',
        method: 'post',
        data: {
          api: this.item.api,
          agent_id: this.item.agent_id,
          secret: this.item.secret,
          account: this.item.account,
          nick: this.item.nick,
          debug: this.item.debug,
          screen: this.item.screen,
          direct_scene: this.item.directScene,
          clientTerminalType: this.item.clientTerminalType
        }
      }).then(response => {
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
