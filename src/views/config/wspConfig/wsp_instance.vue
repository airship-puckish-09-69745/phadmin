<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>WebSocket代理服务器与实例管理</span>
          </div>
          <el-form :model="form" label-width="100px" :inline="true">
            <el-form-item>
              <el-button type="primary" style="padding:20px;" @click="showInstAddForm">添加服务器</el-button>
              <el-button type="info" style="padding:20px;" @click="showInstUpdateForm">修改服务器</el-button>
              <el-button type="danger" style="padding:20px;" @click="deleteInst">删除服务器</el-button>
              <el-button type="success" style="padding:20px;" @click="showInstForm=true">添加实例端口映射</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="padding-top: 20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>WebSocket服务器实例查询</span>
          </div>
          <el-form :model="form" label-width="100px" :inline="true">
            <el-form-item label="WSP服务器：">
              <el-select v-model="form.wspId" placeholder="请选择" size="medium">
                <el-option v-for="item in wspList" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="getInstance">查询</el-button>
            </el-form-item>
          </el-form>
          <el-descriptions class="margin-top" title="WebSocket代理服务器信息" :column="1" border style="width:600px;" label-style="width:200px;">
            <el-descriptions-item label="服务器名称">{{ selectWsp.name }}</el-descriptions-item>
            <el-descriptions-item label="服务器IP">{{ selectWsp.ip }}</el-descriptions-item>
          </el-descriptions>
          <el-table :data="tableData" border style="width: 100%; margin-top: 20px;" :span-method="objectSpanMethod">
            <el-table-column prop="port" label="WebSocket服务端口" width="200" />
            <el-table-column prop="access" label="转发目标Access端口" width="200" />
            <el-table-column prop="app" label="正在使用的应用" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteInstPort(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="getEditTitle()" :visible.sync="showForm" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="wspAddItem" label-width="150px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="服务器别名：">
              <el-input v-model="wspAddItem.name" placeholder="请输入，如不填则使用WSP-x.x.x.x" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="服务器IP：">
              <el-input v-model="wspAddItem.ip" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="saveInst">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加端口" :visible.sync="showInstForm" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="instForm" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="WebSocket端口：">
              <el-input v-model="instForm.port" placeholder="WebSocket端口" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="目标Access端口：">
              <el-input v-model="instForm.access" placeholder="目标Access端口" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="changeInstPort">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message, Loading } from 'element-ui'
import Publish from '@/components/Publish'

export default {
  components: { Compare, Publish },
  data() {
    return {
      appList: [],
      wspList: [],
      selectWsp: {
        name: '',
        ip: ''
      },
      tableData: [],
      libShow: $libShow,
      form: {
        wspId: ''
      },
      instForm: {
        port: '',
        access: ''
      },
      showForm: false,
      isUpdate: false,
      showInstForm: false,
      wspAddItem: {
        id: 0,
        name: '11111',
        ip: ''
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getAppList()
    this.getInstList()
  },
  methods: {
    getInstance() {
      if (this.form.wspId == '') {
        Message.error('请先选择WSP')
        return
      }
      const wspId = this.form.wspId
      const loading = Loading.service({ fullscreen: true })
      request({
        url: '/wspcfg/instance/get',
        method: 'get',
        data: {
          id: wspId
        }
      }).then(response => {
        console.log('获取WSP信息=====>', response)
        loading.close()
        this.tableData = []
        if (response.RetCode != 0) {
          Message.error('获取WSP错误：' + response.Data)
        } else {
          const obj = response.Data
          this.selectWsp.name = obj.name
          this.selectWsp.ip = obj.ip
          if (obj.use_info != null) {
            for (const key in obj.use_info) {
              const one = obj.use_info[key]
              const app_info = this.getAppInfoById(one.app)
              const item = {
                port: one.port,
                app: app_info.name + '-' + app_info.id,
                access: one.access
              }
              if (one.app == 0) {
                item.app = ''
              }
              this.tableData.push(item)
            }
            this.tableData.sort(function(a, b) {
              return a.port > b.port ? 1 : (a.port == b.port ? 0 : -1)
            })
          }
        }
      })
    },

    handleDel(command) {
      console.log('del command', command)
    },
    getAppList() {
      request({
        url: '/appinfo/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          // { 1: '审核中', 2: '通过未推广', 3: '未通过下架', 4: '推广中', 5: '推广后下架' }
          // const sortInfo = ['', 4,1, 3, 5, 2] // 定义排序规则
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
          }
        }
      })
    },
    getAppInfoById(id) {
      for (const key in this.appList) {
        if (this.appList[key].id == id) {
          return this.appList[key]
        }
      }
      return { 'name': '未知应用', id: id }
    },
    getInstList() {
      request({
        url: '/wspcfg/instance/list',
        method: 'get',
        data: {}
      }).then(response => {
        console.log('返回=====>', response)
        if (response.RetCode === 0) {
          if (response.Data != null) {
            this.wspList = response.Data
          }
        }
      })
    },
    getInstById(id) {
      for (const key in this.wspList) {
        if (this.wspList[key].id == id) {
          return this.wspList[key]
        }
      }
      return { 'name': '未知AP', id: id }
    },
    showInstAddForm() {
      this.showForm = true
      this.isUpdate = false
      this.wspAddItem = {
        id: 0,
        name: '',
        ip: ''
      }
    },
    showInstUpdateForm() {
      if (this.form.wspId == '') {
        Message.error('请先选择Ap')
        return
      }
      this.showForm = true
      this.isUpdate = true
      const inst = this.getInstById(this.form.wspId)
      this.wspAddItem = {
        id: this.form.wspId,
        name: inst.name,
        ip: inst.ip
      }
    },
    getEditTitle() {
      return this.isUpdate ? '修改WSP' : '添加WSP'
    },
    saveInst() {
      const tips = this.isUpdate ? '是否修改WSP' : '是否添加WSP'
      const uri = this.isUpdate ? '/wspcfg/instance/update' : '/wspcfg/instance/create'
      console.log('uri===>', uri)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: uri,
          method: 'post',
          data: this.wspAddItem
        }).then(response => {
          console.log('创建=====>', response)
          if (response.RetCode === 0) {
            Message.success(this.isUpdate ? '修改WSP成功' : '添加WSP成功')
            this.getInstList()
          } else {
            Message.error(response.Data)
          }
        })
        this.showForm = false
      }).catch(() => {
        console.log('取消')
      })
    },
    changeInstPort() {
      if (this.form.wspId == '') {
        Message.error('请先选择WSP')
        return
      }
      this.$confirm('是否添加WSP端口?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/wspcfg/instance/change/port',
          method: 'post',
          data: {
            change: 1,
            port: this.instForm.port,
            access: this.instForm.access,
            id: this.form.wspId
          }
        }).then(response => {
          console.log('创建=====>', response)
          if (response.RetCode === 0) {
            Message.success('添加端口成功')
            this.getInstList()
            this.getInstance()
          } else {
            Message.error(response.Data)
          }
        })
        this.showInstForm = false
      }).catch(() => {
        console.log('取消')
      })
    },
    deleteInstPort(row) {
      console.log('delete row', row)
      if (this.form.wspId == '') {
        Message.error('请先选择Ap')
        return
      }
      this.$confirm('是否删除AP端口?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/wspcfg/instance/change/port',
          method: 'post',
          data: {
            change: 2,
            port: row.port,
            access: row.access,
            id: this.form.wspId
          }
        }).then(response => {
          console.log('删除=====>', response)
          if (response.RetCode === 0) {
            Message.success('删除端口成功')
            this.getInstList()
            location.reload()
          } else {
            Message.error(response.Data)
          }
        })
        this.showInstForm = false
      }).catch(() => {
        console.log('取消')
      })
    },
    deleteInst() {
      if (this.form.wspId == '') {
        Message.error('请先选择Ap')
        return
      }
      const inst = this.getInstById(this.form.wspId)
      this.$confirm('是否删除AP【' + inst.name + '】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/wspcfg/instance/delete',
          method: 'post',
          data: {
            id: this.form.wspId
          }
        }).then(response => {
          console.log('删除=====>', response)
          if (response.RetCode === 0) {
            Message.success('删除成功')
            this.getInstList()
            location.reload()
          } else {
            Message.error(response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合并行  产品名字相同合并
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0 || row.port != this.tableData[rowIndex - 1].port) {
          let rowspan = 0
          this.tableData.forEach(element => {
            if (element.port === row.port) {
              rowspan++
            }
          })
          return [rowspan, 1]
        } else {
          return [0, 0]
        }
      }
      if (columnIndex === 3) {
        if (rowIndex === 0 || row.port != this.tableData[rowIndex - 1].port) {
          let rowspan = 0
          this.tableData.forEach(element => {
            if (element.port === row.port) {
              rowspan++
            }
          })
          return [rowspan, 1]
        } else {
          return [0, 0]
        }
      }
    }
  }
}
</script>
