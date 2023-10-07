<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>WebSocket代理服务分派</span>
          </div>
          <el-form :model="form" label-width="100px" :inline="true">
            <el-form-item>
              <el-button type="primary" style="padding:20px;" @click="doDispatchGroup">为应用分派WebSocket代理实例</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" style="padding:20px;" @click="doDetachGroup">为应用删除WebSocket代理实例</el-button>
            </el-form-item>
          </el-form>
          <p>
            <publish primary-key="ID" key-id="WebSocketProxyConfig" :env-empty="true" :attr-names="AttrNames" />
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="padding-top: 20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>应用已分派代理实例查询</span>
          </div>
          <el-form :model="form" label-width="100px" :inline="true">
            <el-form-item label="应用：">
              <el-select v-model="form.app" filterable placeholder="请选择" style="width:300px;">
                <el-option v-for="app in appList" :label="app.name" :value="app.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getInfo">查询</el-button>
            </el-form-item>
          </el-form>
          <div style="padding-top: 10px">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="name" label="WSP名称" width="180" />
              <el-table-column prop="wsp" label="服务地址" width="180" />
              <el-table-column prop="port" label="服务端口" />
              <el-table-column prop="access" label="Access" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="getDialogTitle()" :visible.sync="dispatchVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="editItem" label-width="150px" size="small">
        <el-row>
          <el-col :span="16">
            <el-form-item label="WSP分组：">
              <el-select v-model="editItem.groupId" placeholder="请选择" style="width:300px" @change="choiceGroup">
                <el-option v-for="item in groupList" :label="item.name" :value="item.gid" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-descriptions title="分组信息" :column="2" size="medium" border>
              <el-descriptions-item v-for="info in selectedGroup">
                <template slot="label"> <i class="el-icon-user" /> WSP</template>
                {{ info.name }}({{ info.wsp }}) - {{ info.port }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row>
          <el-divider content-position="left">应用</el-divider>
          <el-col :span="24">
            <el-table ref="multipleTable" :data="appList" tooltip-effect="dark" style="width: 100%" height="300" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="AppId" />
              <el-table-column prop="name" label="App名" show-overflow-tooltip />
            </el-table>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="dispatchPort">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="分配结果" :visible.sync="dispatchResultDialogVisible">
      <el-table :data="dispatchResult" style="width: 100%" height="300" border>
        <el-table-column prop="app" label="APP">
          <template slot-scope="scope"> {{ getAppNameById(scope.row.app) }}</template>
        </el-table-column>
        <el-table-column prop="wsp" label="WSP" />
        <el-table-column prop="port" label="端口" />
        <el-table-column prop="result" label="分配结果">
          <template slot-scope="scope"> {{ getResultTxt(scope.row.result) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>
<style>
.el-transfer-panel{
  width: 370px;
  height: 500px;
}
.el-transfer-panel__list.is-filterable{
  width: 370px;
  height: 500px;
}
</style>
<script>
import { $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Loading, Message } from 'element-ui'
import Publish from '@/components/Publish'
import { array } from 'jszip/lib/support'
import { objectMerge } from '@/utils'

export default {
  components: { Compare, Publish },
  data() {
    return {
      groupList: [],
      selectedGroup: [],
      appList: [],
      tableData: [],
      useTableData: [],
      libShow: $libShow,
      form: {
        app: ''
      },
      dispatchVisible: false,
      editItem: {
        groupId: '',
        detach: 0
      },
      instList: [],
      processUsedInfo: [],
      multipleSelection: [],
      dispatchResult: [],
      dispatchResultDialogVisible: false,
      AttrNames: {
        Sort: '排序',
        App: '应用ID',
        WSP: 'WSP地址',
        Port: '端口'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getAppInfo()
    this.getGroupList()
    this.getInstList()
  },
  methods: {
    getGroupList() {
      request({
        url: '/wspcfg/group/list',
        method: 'get',
        data: {
          page: 0,
          limit: 20000 // 一次全部拉取完
        }
      }).then(response => {
        console.log('获取信息=====>', response)
        if (response.RetCode !== 0) {
          Message.error('获取信息分组错误：' + response.Data)
        } else {
          this.groupList = response.Data.Data
        }
      })
    },
    getInstList(callback) {
      request({
        url: '/wspcfg/instance/list',
        method: 'get',
        data: {}
      }).then(response => {
        console.log('WSP返回=====>', response)
        if (response.RetCode === 0) {
          if (response.Data != null) {
            this.instList = response.Data
            for (let index = 0; index < this.instList.length; index++) {
              this.instList[index].desc = this.instList[index].name + ' - ' + this.instList[index].ap
            }
          }
        } else {
          Message.error('获取WSP配置失败：' + response.Data)
        }
        if (callback) {
          callback()
        }
      })
    },
    getInstNameByIp(ip) {
      for (const key in this.instList) {
        if (this.instList[key].ip == ip) {
          return this.instList[key].name
        }
      }
      return ''
    },
    getApAccessByApPort(ip, port) {
      for (const key in this.instList) {
        if (this.instList[key].ip == ip) {
          const ports = this.instList[key].ports
          for (const v in ports) {
            if (ports[v].port == port) {
              return ports[v].access
            }
          }
        }
      }
      return 0
    },
    getInfo() {
      console.log('form', this.form)
      request({
        url: '/wspcfg/app/cfg',
        method: 'post',
        data: {
          app: this.form.app
        }
      }).then(response => {
        console.log('获取配置=====>', response)
        this.tableData = []
        if (response.RetCode === 0) {
          const obj = response.Data
          for (const key in obj) {
            this.tableData.push(
              {
                id: obj[key].id,
                name: this.getInstNameByIp(obj[key].wsp),
                wsp: obj[key].wsp,
                port: obj[key].port,
                access: this.getApAccessByApPort(obj[key].wsp, obj[key].port)
              }
            )
          }
        } else {
          Message.error('获取分配失败：' + response.Data)
        }
      })
    },
    getDialogTitle() {
      return this.editItem.detach === 0 ? '分配WSP' : '取消分配WSP'
    },
    doDispatchGroup() {
      const loading = Loading.service({ fullscreen: true })
      const callback = function() {
        this.dispatchVisible = true
        this.editItem.groupId = ''
        this.editItem.detach = 0
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
        loading.close()
      }.bind(this)
      this.getInstList(callback)
      this.getGroupList()
    },
    doDetachGroup() {
      const loading = Loading.service({ fullscreen: true })
      const callback = function() {
        this.dispatchVisible = true
        this.editItem.groupId = ''
        this.editItem.detach = 1
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
        loading.close()
      }.bind(this)
      this.getInstList(callback)
      this.getGroupList()
    },
    getAppInfo() {
      request({
        url: '/appinfo/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          // { 1: '审核中', 2: '通过未推广', 3: '未通过下架', 4: '推广中', 5: '推广后下架' }
          const sortInfo = ['', 4, 1, 3, 5, 2] // 定义排序规则
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].Status !== 4 && objs[i].Status !== 5) {
              continue
            }
            this.appList.push(
              {
                'name': objs[i].AppName + '-' + objs[i].AppID,
                'id': objs[i].AppID
              }
            )
            objs[i]['Platform'] = parseInt(objs[i].AppID) > 100000 ? 2 : 1
          }
          this.appList.sort(function(a, b) {
            return sortInfo[a.Status] - sortInfo[b.Status]
          })
        }
      })
    },
    getAppNameById(id) {
      for (const key in this.appList) {
        if (this.appList[key].id == id) {
          return this.appList[key].name
        }
      }
      return '未知应用'
    },
    getResultTxt(result) {
      return result === 1 ? '分配成功' : (result === 0 ? '已存在' : '取消分配成功')
    },
    deletePort(row) {
      return
      console.log('delete row===>', row)
      this.$confirm('是否取消分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/wspcfg/detach/port',
          method: 'post',
          data: {
            id: row.id,
            app: this.form.app,
            port: row.port,
            wsp: row.wsp
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.processUsedInfo = []
            if (response.RetCode != 0) {
              Message.error('取消失败：' + response.Data)
            } else {
              Message.success('取消成功')
              this.getInfo()
            }
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    choiceGroup(val) {
      this.$refs.multipleTable.clearSelection()
      console.log('choice group====>', val)
      for (let i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].gid == val) {
          const d = JSON.parse(decodeURI(this.groupList[i].wsp_list))
          console.log('dddd=>', d, 'raw===>', decodeURI(this.groupList[i].wsp_list))
          this.selectedGroup = d
          console.log('groupinfo==>', this.groupList[i])
          if (this.groupList[i].app_list !== '') {
            const selectedApp = JSON.parse(this.groupList[i].app_list)
            for (let j = 0; j < this.appList.length; j++) {
              for (let k = 0; k < selectedApp.length; k++) {
                if (this.appList[j].id == selectedApp[k]) {
                  this.$refs.multipleTable.toggleRowSelection(this.appList[j], true)
                  break
                }
              }
            }
          }
          break
        }
      }
    },
    dispatchPort() {
      let wsp = ''
      for (let i = 0; i < this.groupList.length; i++) {
        if (this.editItem.groupId === this.groupList[i].gid) {
          const d = JSON.parse(decodeURI(this.groupList[i].wsp_list))
          for (let j = 0; j < d.length; j++) {
            if (j === 0) {
              wsp += d[j].wsp + ':' + d[j].port
            } else {
              wsp += '|' + d[j].wsp + ':' + d[j].port
            }
          }
        }
      }
      console.log('wsp==>', wsp)
      if (wsp === '') {
        Message.error('请选择分组')
        return
      }
      let app = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (i === 0) {
          app += this.multipleSelection[i].id
        } else {
          app += '|' + this.multipleSelection[i].id
        }
      }
      // 添加不允许app为0
      if (this.editItem.detach === 0 && app === '') {
        Message.error('请选择应用')
        return
      }
      console.log('app===>', app)
      // 检测aps是否都可用
      const callback = function() {
        request({
          url: '/wspcfg/multi/dispatch/port',
          method: 'post',
          data: {
            gid: this.editItem.groupId,
            app: app,
            wsp: wsp,
            detach: this.editItem.detach
          }
        }).then(response => {
          console.log('response===>', response)
          if (response.RetCode === 0) {
            if (response.RetCode != 0) {
              Message.error('添加失败：' + response.Data)
            } else {
              this.dispatchResult = response.Data
              this.dispatchVisible = false
              this.dispatchResultDialogVisible = true
            }
          }
        })
      }.bind(this)
      this.checkApsActive(wsp, callback)
    },
    checkApsActive(wsp, callback) {
      request({
        url: '/wspcfg/group/check',
        method: 'post',
        data: {
          wsp: wsp
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.RetCode != 0) {
            Message.error('检测失败：' + response.Data)
          } else {
            callback()
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
