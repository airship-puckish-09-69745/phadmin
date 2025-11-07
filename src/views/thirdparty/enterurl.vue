<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="90px" :inline="true" size="small">
        <el-form-item v-model="item.agent_id" label="平台：" :required="true" label-width="100px">
          <el-select v-model="item.agent_id" filterable placeholder="请选择" size="mini">
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
        <el-form-item v-model="item.gid" label="进入场景：" :required="true" label-width="100px">
          <el-select v-model="item.gid" filterable placeholder="请选择" size="mini">
            <el-option
              v-for="row in gameOptions"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.site_id" label="渠道：" :required="true" label-width="100px">
          <el-select v-model="item.site_id" filterable allow-create default-first-option placeholder="请选择渠道" size="mini">
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
        <!--        <el-form-item v-model="item.path" label="进厅 path：" label-width="110px">-->
        <!--          <el-select v-model="item.path" placeholder="请选择" size="mini">-->
        <!--            <el-option label="常规" value="1" />-->
        <!--            <el-option label="Banner（返回gamefun.ph）" value="2" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item v-model="item.need_test_uri" label="指定链接类型：" :required="true" label-width="140px">
          <el-select v-model="item.need_test_uri" placeholder="请选择" size="mini">
            <el-option label="平台配置链接" value="0" />
            <el-option label="预发布" value="1" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item v-model="item.debug" label="调试模式：" :required="true" label-width="140px">-->
        <!--          <el-select v-model="item.debug" placeholder="请选择" size="mini">-->
        <!--            <el-option label="否" value="0" />-->
        <!--            <el-option label="是" value="1" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item v-model="item.cashier" label="充值链接：" label-width="140px">
          <el-input v-model="item.cashier" />
        </el-form-item>
        <el-form-item v-model="item.source" label="用户来源：" :required="true" label-width="110px">
          <el-select v-model="item.source" filterable allow-create default-first-option placeholder="请选择" size="mini">
            <el-option
              v-for="row in sources"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.activity" label="活动场景：" label-width="110px">
          <el-select v-model="item.activity" filterable allow-create default-first-option placeholder="请选择" size="mini">
            <el-option
              v-for="row in activities"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item v-model="item.gid" label="游戏：" label-width="100px">-->
        <!--          <el-tooltip class="item" effect="dark" content="此处有值时，优先取此处关连的场景。比如：游戏选了【pusoy比赛】,进入场景选了【color】，此时进入【pusoy比赛】。" placement="right-start">-->
        <!--            <i class="el-icon-info" />-->
        <!--          </el-tooltip>-->
        <!--          <el-select v-model="item.gid" filterable allow-create default-first-option placeholder="请选择" size="mini">-->
        <!--            <el-option-->
        <!--              v-for="row in gameOptions"-->
        <!--              :label="row.name"-->
        <!--              :value="row.val"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item v-if="item.activity === 'tournament' || item.activity === 'matchjoin'" v-model="item.activity_val" label="活动附加值：" label-width="100px">
          <el-input v-model="item.activity_val" />
        </el-form-item>
        <el-form-item v-model="item.live_id" label="直播ID：" label-width="100px">
          <el-input v-model="item.live_id" />
        </el-form-item>
        <el-form-item v-model="gpVip" label="GP VIP 等级：" label-width="100px">
          <el-tooltip class="item" effect="dark" content="站点为 GP 时才生效。" placement="right-start">
            <i class="el-icon-info" />
          </el-tooltip>
          <el-select v-model="gpVip" filterable allow-create default-first-option placeholder="请选择" size="mini">
            <el-option
              v-for="row in gpVipOptions"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="ekycPassed" label="ekyc 是否认证：" label-width="100px">
          <el-select v-model="ekycPassed" filterable allow-create default-first-option placeholder="请选择" size="mini">
            <el-option
              v-for="row in ekycOptions"
              :label="row.name"
              :value="row.val"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="KYC状态" label-width="100px">
          <el-select v-model="item.kyc" placeholder="请选择" size="mini">
            <el-option label="否" value='0' />
            <el-option label="是" value='1' />
          </el-select>
        </el-form-item>
        <el-form-item label="平台注册时间" label-width="100px">
          <el-date-picker
            v-model="item.r_time"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="enterurl()">打开游戏</el-button>
          <el-button type="primary" size="mini" @click="enterurl(true)">客户端测试（7456）</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <p><span style="font-weight: bolder">注意：</span>链接调试时可能能有版本差异，需要自己手动修改版本号，版本号部分如下红色部分：</p>
      <p>http://192.168.6.16/web-mobile/<span style="color: red">1.0.0.424</span>/main/index.html?p=paramsvalue</p>
    </el-row>
    <el-row>
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
            label="链接"
          />
          <el-table-column
            label="P 参数"
            column-key="op"
            width="200"
          >
            <template slot-scope="scope">
              {{ getPPrarms(scope.row.EnterUrl) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ExpiredTime"
            label="过期时间"
          />
        </el-table>
      </div>
    </el-row>

    <!-- 进厅 url 工具 -->
    <el-row>
      <div class="url-replacer-container">
        <div class="url-replacer-card">
          <div class="card-header">
            <h3>进厅 URL 工具</h3>
            <p class="subtitle">将链接中 ? 号前面的内容替换为 http://localhost:7456/；解析链接中的 p 参数</p>
          </div>
          <el-row>
            <div class="input-group">
              <label>原始链接</label>
              <el-input
                v-model="orgUrl"
                placeholder="请输入要处理的 URL"
                size="medium"
                clearable
                class="url-textarea"
                type="textarea"
                :rows="4"
                resize="vertical"
                @input="handleUrlChange"
              />
            </div>
          </el-row>
          <el-row>
            <div class="button-group">
              <!-- <el-button type="primary" size="medium" @click="orgUrl()" icon="el-icon-refresh">替换链接</el-button> -->
              <el-button size="medium" icon="el-icon-delete" @click="clearReplaceUrl()">清空</el-button>
              <el-button type="success" size="medium" icon="el-icon-copy-document" @click="copyReplaceUrl()">复制结果</el-button>
              <el-button type="warning" size="medium" icon="el-icon-position" :disabled="!replaceUrlResult" @click="openReplaceUrl()">打开链接</el-button>
            </div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="input-group result-group">
                <label>替换后的链接</label>
                <el-input
                  v-model="replaceUrlResult"
                  placeholder="替换后的链接将显示在这里"
                  size="medium"
                  readonly
                  class="url-textarea result-textarea"
                  type="textarea"
                  :rows="8"
                  resize="vertical"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="input-group result-group">
                <label>P 参数解析结果：</label>
                <el-input
                  v-model="decodedUrl"
                  placeholder="P 参数解析后的结果将显示在这里"
                  size="medium"
                  readonly
                  class="url-textarea result-textarea"
                  type="textarea"
                  :rows="8"
                  resize="vertical"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>

  </div>
</template>

<style lang="scss" scoped>
.tooltip-button {
  margin-right: 10px;
}

.url-replacer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.url-replacer-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;

  h3 {
    color: #303133;
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 10px 0;
  }

  .subtitle {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

.input-group {
  margin-bottom: 25px;

  label {
    display: block;
    color: #606266;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
}

.url-input {
  width: 100%;

  &.result-input {
    background-color: #f5f7fa;
  }
}

.url-textarea {
  width: 100%;

  ::v-deep .el-textarea__inner {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.6;
    border: 2px solid #e4e7ed;
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
    }

    &:hover {
      border-color: #c0c4cc;
    }
  }

  &.result-textarea ::v-deep .el-textarea__inner {
    background-color: #f8f9fa;
    color: #495057;
    cursor: text;
    resize: vertical;
    min-height: 100px;
  }
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.result-group {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .url-replacer-card {
    padding: 30px 20px;
  }

  .button-group {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
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
      orgUrl: '',
      replaceUrlResult: '',
      urlChangeTimeout: null, // 用于URL输入防抖
      decodedUrl: '',
      hasAutoOpened: false, // 标记是否已经自动打开过
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
        },
        {
          id: 1000007,
          agentId: 'zootest',
          desc: 'Zoo测试账号[1000007]'
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
          val: '',
          nick: '无'
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
      channels: ['Dev', 'BP', 'GP', 'AP', 'PG'],
      directScenes: [
        {
          name: '大厅',
          val: ''
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
        },
        {
          name: 'bingopluspoker.ph',
          val: 'bingopluspoker.ph'
        }
      ],
      activities: [
        {
          name: '无',
          val: ''
        },
        {
          name: '扑克乐园',
          val: 'playgamelandactivity'
        },
        {
          name: '比赛选场（打开详情）',
          val: 'tournament'
        },
        {
          name: '进入比赛',
          val: 'matchjoin'
        },
        {
          name: '进入免费赛列表',
          val: 'tournament_-1'
        },
        {
          name: '进入付费赛列表',
          val: 'tournament_-2'
        },
        {
          name: 'banner进比赛列表GTCC分类',
          val: 'tournament_-3'
        },
        {
          name: '非banner进比赛列表GTCC分类',
          val: 'tournament_-4'
        }
      ],
      gameOptions: [
        {
          name: '无',
          val: ''
        }
      ],
      gpVipOptions: [
        {
          name: '无',
          val: 0
        },
        {
          name: '1',
          val: 1
        },
        {
          name: '2',
          val: 2
        },
        {
          name: '3',
          val: 3
        },
        {
          name: '4',
          val: 4
        },
        {
          name: '5',
          val: 5
        },
        {
          name: '6',
          val: 6
        },
        {
          name: '7',
          val: 7
        }
      ],
      ekycOptions: [
        {
          name: '未认证',
          val: 0
        },
        {
          name: '已认证',
          val: 1
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
        directScene: '',
        clientTerminalType: '2',
        site_id: 'Dev',
        debug: '0',
        need_test_uri: '0',
        cashier: 'http://baidu.com',
        path: '1',
        source: 'glife.bingoplus.com',
        activity: '',
        gid: '',
        live_id: '',
        gp_ext: '{"vip":1,"ekycPassed":1}',
        kyc: '0',
        activity_val: '',
        r_time: Date.parse(new Date())
      },
      gpVip: 1,
      ekycPassed: 1,
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
        },
        {
          id: 1000007,
          agentId: 'zootest',
          desc: 'Zoo测试账号[1000007]'
        },
        {
          id: 1000009,
          agentId: 'zoogame',
          desc: 'Zoogame[1000009]正式'
        },
        {
          id: 1000016,
          agentId: 'zooDev',
          desc: 'zoo 内部开发[1000016]'
        },
        {
          id: 1000020,
          agentId: 'playtime',
          desc: 'playtime正式[1000020]'
        },
        {
          id: 1000017,
          agentId: 'playtimeDev',
          desc: 'playtimeDev[1000017]'
        },
        {
          id: 1000021,
          agentId: 'whisperDev',
          desc: 'whisperDev[1000021]'
        },
        {
          id: 1000026,
          agentId: 'domino777Dev',
          desc: 'domino777Dev[1000026]'
        },
        {
          id: 1000029,
          agentId: 'idgamesDev',
          desc: 'idgamesDev[1000029]'
        },
        {
          id: 1000032,
          agentId: 'weekaDev',
          desc: 'weekaDev[1000032]'
        },
        {
          id: 1000035,
          agentId: 'NGNGameDev',
          desc: 'NGNGame[1000035]【尼日利亚】'
        },
        {
          id: 1000038,
          agentId: '777pubDev',
          desc: '777pub[1000038]'
        },
        {
          id: 1000041,
          agentId: 'IndiaH5GameDev',
          desc: 'IndiaH5Game[1000041]【印度H5】'
        },
        {
          id: 1000049,
          agentId: 'zoogameDev',
          desc: 'zoogame 开发'
        }
      ]
    }
    this.getAllGames()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    isShowMatchGameOption(activityVal) {
      return activityVal === 'tournament' || activityVal === 'tournament_-1' || activityVal === 'tournament_-2'
    },
    enterurl(local) {
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
      let activityVal = this.item.activity
      if (activityVal === 'tournament' || activityVal === 'matchjoin' && this.item.activity_val !== '') {
        activityVal += '_' + this.item.activity_val
      }
      const gpExt = '{"vip":' + this.gpVip + ',"ekycPassed":' + this.ekycPassed + '}'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/thirdparties/enterurl',
          agent_id: this.item.agent_id,
          secret: this.item.secret,
          account: this.item.account,
          nick: this.item.nick,
          debug: this.item.debug,
          // screen: this.item.screen,
          site_id: this.item.site_id,
          need_test_uri: this.item.need_test_uri,
          direct_scene: this.item.directScene,
          clientTerminalType: this.item.clientTerminalType,
          cashier: this.item.cashier,
          path: this.item.path,
          source: this.item.source,
          activity: activityVal,
          live_id: this.item.live_id,
          gp_ext: gpExt,
          gid: this.item.gid
          // kyc: this.item.kyc,
          // r_time: this.item.r_time/1000
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
          let link = response.Data.Url
          // 将链接 ? 符号前的前缀替换为 http://localhost:7456/
          if (local) {
            const index = link.indexOf('?')
            const suffix = link.substring(index)
            link = 'http://localhost:7456/' + suffix
          }
          window.open(link, '_blank')
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
    // URL 替换工具相关方法
    handleUrlChange() {
      // 当输入框内容变化时自动处理
      if (this.orgUrl && this.orgUrl.trim()) {
        // 使用防抖，避免频繁触发
        clearTimeout(this.urlChangeTimeout)
        this.urlChangeTimeout = setTimeout(() => {
          // 只在内容较长时（可能是粘贴的完整URL）才自动处理
          if (this.orgUrl.length > 20) {
            this.autoReplaceAndOpen()
            this.decodedUrl = this.getPPrarms(this.orgUrl)
          }
        }, 500) // 延迟500ms执行
      }
    },
    autoReplaceAndOpen() {
      // 自动替换 URL 并打开
      const url = this.orgUrl.trim()
      if (!url) return

      // 执行替换逻辑
      this.performUrlReplace()

      // 延迟一下确保替换完成，然后打开链接
      this.$nextTick(() => {
        if (this.replaceUrlResult) {
          // 只在第一次替换成功时自动打开，避免每次输入都打开
          if (!this.hasAutoOpened) {
            // this.openReplaceUrl()
            this.hasAutoOpened = true
          }
        }
      })
    },
    performUrlReplace() {
      // 替换 URL 逻辑
      const url = this.orgUrl.trim()
      if (!url) {
        this.$message.warning('请输入要替换的 URL')
        return
      }

      const index = url.indexOf('?')
      if (index === -1) {
        this.$message.warning('URL 格式不正确，缺少请求参数')
        return
      }

      const suffix = url.substring(index)
      this.replaceUrlResult = 'http://localhost:7456/' + suffix

      this.$message.success('URL 替换成功！')
    },
    clearReplaceUrl() {
      this.orgUrl = ''
      this.replaceUrlResult = ''
      this.hasAutoOpened = false // 重置自动打开标志

      this.decodedUrl = ''
      this.$message.success('已清空')
    },
    copyReplaceUrl() {
      if (!this.replaceUrlResult) {
        this.$message.warning('没有可复制的链接')
        return
      }

      const clipboard = new Clipboard('.url-replacer-container', {
        text: () => this.replaceUrlResult
      })

      clipboard.on('success', e => {
        this.$message.success('链接已复制到剪贴板')
        clipboard.destroy()
      })

      clipboard.on('error', e => {
        this.$message.error('复制失败，请手动复制')
        clipboard.destroy()
      })

      // 触发复制
      clipboard.onClick(e)
    },
    openReplaceUrl() {
      if (!this.replaceUrlResult) {
        this.$message.warning('没有可打开的链接')
        return
      }

      window.open(this.replaceUrlResult, '_blank')
      this.$message.success('正在打开链接...')
    },
    getPPrarms(str) {
      if (!str) return ''
      try {
        if (!str.startsWith('http')) {
          return this.decodePPrams(str)
        } else {
          // 使用 URL API 解析更安全
          const url = new URL(str, window.location.origin)
          const p = url.searchParams.get('p')

          if (!p) {
            this.$message.warning('URL 中未找到参数 p')
            return ''
          }

          return this.decodePPrams(p)
        }
      } catch (error) {
        this.$message.warning('解析 URL 出错:' + error)
        return ''
      }
    },
    decodePPrams(str) {
      // urldecode str
      str = decodeURIComponent(str)
      // base64decode p
      str = atob(str)
      return str
    },
    getAllGames() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            const item = {}
            item.name = objs[i].Name
            item.val = objs[i].Scene
            $this.directScenes.push(item)
            $this.gameOptions.push({ val: objs[i].GameID, name: objs[i].Name })
          }
        }
      })
    }
  }
}

</script>
