<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="FrontProxyConfig" :env-empty="true" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-form :model="form" label-width="100px" :inline="true">
        <el-form-item label="应用：">
          <el-select v-model="form.app" filterable placeholder="请选择" style="width:300px;">
            <el-option
              v-for="app in appInfo"
              :label="app.name"
              :value="app.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo">查询</el-button>
          <el-button type="primary" @click="doDispatchGroup">分配Ap组</el-button>
          <el-button type="danger" @click="doDetachGroup">取消分配Ap组</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="ap_name"
          label="Ap名称"
          width="180"
        />
        <el-table-column
          prop="ap"
          label="Ap地址"
          width="180"
        />
        <el-table-column
          prop="port"
          label="Process"
        />
        <el-table-column
          prop="access"
          label="Access"
        />
      </el-table>
    </div>
    <el-dialog
      :title="getDialogTitle()"
      :visible.sync="dispatchApVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="apItem" label-width="150px" size="small">
        <el-row>
          <el-col :span="16">
            <el-form-item label="Ap分组：">
              <el-select v-model="apItem.ap" placeholder="请选择" style="width:300px" @change="choiceGroup">
                <el-option
                  v-for="info in groupInfo"
                  :label="info.name"
                  :value="info.gid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-descriptions title="分组信息" :column="2" size="medium" border>
              <el-descriptions-item v-for="info in selectedGroupInfo">
                <template slot="label">
                  <i class="el-icon-user" />
                  AP
                </template>
                {{ info.name }}({{ info.ap }}) - {{ info.port }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <el-row>
          <el-divider content-position="left">应用</el-divider>
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="appInfo"
              tooltip-effect="dark"
              style="width: 100%"
              height="300"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="id"
                label="AppId"
              />
              <el-table-column
                prop="name"
                label="App名"
                show-overflow-tooltip
              />
            </el-table>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="dispatchAp">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="分配结果"
      :visible.sync="dispatchResultDialogVisible"
    >
      <el-table
        :data="dispatchResult"
        style="width: 100%"
        height="300"
        border
      >
        <el-table-column
          prop="app"
          label="APP"
        >
          <template slot-scope="scope">
            {{ getAppNameById(scope.row.app) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ap"
          label="Ap"
        />
        <el-table-column
          prop="port"
          label="Port"
        />
        <el-table-column
          prop="result"
          label="分配结果"
        >
          <template slot-scope="scope">
            {{ getResultTxt(scope.row.result) }}
          </template>
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
      groupInfo: [],
      selectedGroupInfo: [],
      appInfo: [],
      aps: [],
      tableData: [

      ],
      useTableData: [

      ],
      libShow: $libShow,
      form: {
        app: ''
      },
      dispatchApVisible: false,
      apItem: {
        ap: '',
        detach: 0
      },
      apInfo: [

      ],
      portInfo: [
      ],
      processUsedInfo: [
      ],
      multipleSelection: [],
      dispatchResult: [],
      dispatchResultDialogVisible: false,
      AttrNames: {
        Sort: '排序',
        App: '应用ID',
        Ap: 'Ap地址',
        Port: '端口'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getAppInfo()
    this.getGroupInfo()
    this.getApInfo()
  },
  methods: {
    getGroupInfo() {
      request({
        url: '/frontcfg/get/ap/group',
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
          this.groupInfo = response.Data.Data
        }
      })
    },
    getApInfo(callback) {
      request({
        url: '/frontcfg/get/ap',
        method: 'get',
        data: {}
      }).then(response => {
        console.log('AP返回=====>', response)
        if (response.RetCode === 0) {
          if (response.Data != null) {
            this.apInfo = response.Data
            for (let index = 0; index < this.apInfo.length; index++) {
              this.apInfo[index].desc = this.apInfo[index].name + ' - ' + this.apInfo[index].ap
            }
          }
        } else {
          Message.error('获取AP配置失败：' + response.Data)
        }
        if (callback) {
          callback()
        }
      })
    },
    getApNameByAp(ap) {
      for (const key in this.apInfo) {
        if (this.apInfo[key].ap == ap) {
          return this.apInfo[key].name
        }
      }
      return ''
    },
    getApAccessByApPort(ap, port) {
      for (const key in this.apInfo) {
        if (this.apInfo[key].ap == ap) {
          const ports = this.apInfo[key].ports
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
        url: '/frontcfg/app/cfg',
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
                ap_name: this.getApNameByAp(obj[key].ap),
                ap: obj[key].ap,
                port: obj[key].port,
                access: this.getApAccessByApPort(obj[key].ap, obj[key].port)
              }
            )
          }
        } else {
          Message.error('获取分配失败：' + response.Data)
        }
      })
    },
    getDialogTitle() {
      return this.apItem.detach === 0 ? '分配AP' : '取消分配AP'
    },
    doDispatchGroup() {
      const loading = Loading.service({ fullscreen: true })
      const callback = function() {
        this.dispatchApVisible = true
        this.apItem.ap = ''
        this.apItem.detach = 0
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
        loading.close()
      }.bind(this)
      this.getApInfo(callback)
      this.getGroupInfo()
    },
    doDetachGroup() {
      const loading = Loading.service({ fullscreen: true })
      const callback = function() {
        this.dispatchApVisible = true
        this.apItem.ap = ''
        this.apItem.detach = 1
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
        loading.close()
      }.bind(this)
      this.getApInfo(callback)
      this.getGroupInfo()
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
            this.appInfo.push(
              {
                'name': objs[i].AppName + '-' + objs[i].AppID,
                'id': objs[i].AppID
              }
            )
            objs[i]['Platform'] = parseInt(objs[i].AppID) > 100000 ? 2 : 1
          }
          this.appInfo.sort(function(a, b) {
            return sortInfo[a.Status] - sortInfo[b.Status]
          })
        }
      })
    },
    getAppNameById(id) {
      for (const key in this.appInfo) {
        if (this.appInfo[key].id == id) {
          return this.appInfo[key].name
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
          url: '/frontcfg/detach/ap/port',
          method: 'post',
          data: {
            id: row.id,
            app: this.form.app,
            port: row.port,
            ap: row.ap
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
      for (let i = 0; i < this.groupInfo.length; i++) {
        if (this.groupInfo[i].gid == val) {
          const d = JSON.parse(decodeURI(this.groupInfo[i].aps))
          console.log('dddd=>', d, 'raw===>', decodeURI(this.groupInfo[i].aps))
          this.selectedGroupInfo = d
          console.log('groupinfo==>',this.groupInfo[i])
          if ( this.groupInfo[i].app_list !== "") {
            let selectedApp = JSON.parse(this.groupInfo[i].app_list)
            for (let j = 0; j < this.appInfo.length; j++) {
              for (let k = 0; k < selectedApp.length; k++) {
                if(this.appInfo[j].id == selectedApp[k]){
                  this.$refs.multipleTable.toggleRowSelection(this.appInfo[j],true)
                  break
                }
              }
            }
          }
          break
        }
      }
    },
    dispatchAp() {
      let aps = ''
      for (let i = 0; i < this.groupInfo.length; i++) {
        if (this.apItem.ap === this.groupInfo[i].gid) {
          const d = JSON.parse(decodeURI(this.groupInfo[i].aps))
          for (let j = 0; j < d.length; j++) {
            if (j === 0) {
              aps += d[j].ap + ':' + d[j].port
            } else {
              aps += '|' + d[j].ap + ':' + d[j].port
            }
          }
        }
      }
      console.log('aps==>', aps)
      if (aps === '') {
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
      if (this.apItem.detach === 0 && app === '') {
        Message.error('请选择应用')
        return
      }
      console.log('app===>', app)
      // 检测aps是否都可用
      const callback = function() {
        request({
          url: '/frontcfg/multi/dispatch/ap/port',
          method: 'post',
          data: {
            gid: this.apItem.ap,
            app: app,
            aps: aps,
            detach: this.apItem.detach
          }
        }).then(response => {
          console.log('response===>', response)
          if (response.RetCode === 0) {
            if (response.RetCode != 0) {
              Message.error('添加失败：' + response.Data)
            } else {
              this.dispatchResult = response.Data
              this.dispatchApVisible = false
              this.dispatchResultDialogVisible = true
            }
          }
        })
      }.bind(this)
      this.checkApsActive(aps, callback)
    },
    checkApsActive(aps, callback) {
      request({
        url: '/frontcfg/check/ap/group',
        method: 'post',
        data: {
          aps: aps
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
