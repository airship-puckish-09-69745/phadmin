<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-form :model="form" label-width="100px" :inline="true">
        <el-form-item label="AP：">
          <el-select v-model="form.ap" placeholder="请选择" size="medium">
            <el-option
              v-for="ap in apInfo"
              :label="ap.name"
              :value="ap.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showAddAp">添加AP</el-button>
          <el-button type="success" @click="addApPortVisible=true">添加Port</el-button>
          <el-button type="danger" @click="changeAp">修改AP</el-button>
          <el-button type="danger" @click="delAp">删除AP</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-descriptions class="margin-top" title="信息" :column="2" border>
          <el-descriptions-item>
            <template slot="label">
              名称
            </template>
            {{ selecetAp.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              IP
            </template>
            {{ selecetAp.ip }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="port"
          label="端口"
          width="180"
        />
        <el-table-column
          prop="access"
          label="Access"
          width="180"
        />
        <el-table-column
          prop="app"
          label="正在使用的应用"
          width="180"
        />
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="deletePort(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="addApVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="apAddItem" label-width="150px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="Ap名称：">
              <el-input v-model="apAddItem.name" placeholder="请输入，如不填则使用AP-x.x.x.x" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="Ap IP：">
              <el-input v-model="apAddItem.ip" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="addAp">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加端口"
      :visible.sync="addApPortVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="apAddPortInfo" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="端口：">
              <el-input v-model="apAddPortInfo.port" placeholder="端口号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Access端口：">
              <el-input v-model="apAddPortInfo.access" placeholder="Access端口号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="addApPort">保存</el-button>
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
      appInfo: [],
      apInfo: [],
      selecetAp: {
        name: '',
        ip: ''
      },
      aps: [],
      tableData: [],
      libShow: $libShow,
      form: {
        ap: ''
      },
      apAddPortInfo: {
        port: '',
        access: ''
      },
      addApVisible: false,
      isEditAp: false,
      addApPortVisible: false,
      apAddItem: {
        id: 0,
        name: '11111',
        ip: ''
      },

      AttrNames: {
        Sort: '排序',
        ItemID: '物品ID',
        Count: '数量',
        Name: '商品名称',
        Type: `商品类型`,
        Price: '价格',
        BonusRate: 'Bonus比例',
        PlatformItemID: '平台ID',
        IsRecommend: '商城推荐位',
        ShowScene: '展示场景',
        SceneRecommend: '场景推荐位'
      }

    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getAppInfo()
    this.getApInfo()
  },
  methods: {
    getInfo() {
      if (this.form.ap == '') {
        Message.error('请先选择Ap')
        return
      }
      const apId = this.form.ap
      const loading = Loading.service({ fullscreen: true })
      request({
        url: '/frontcfg/get/ap/info',
        method: 'get',
        data: {
          id: apId
        }
      }).then(response => {
        console.log('获取Ap信息=====>', response)
        loading.close()
        this.tableData = []
        if (response.RetCode != 0) {
          Message.error('获取AP错误：' + response.Data)
        } else {
          const obj = response.Data
          this.selecetAp.name = obj.name
          this.selecetAp.ip = obj.ap
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
    getAppInfo() {
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
            this.appInfo.push(
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
      for (const key in this.appInfo) {
        if (this.appInfo[key].id == id) {
          return this.appInfo[key]
        }
      }
      return { 'name': '未知服务', id: id }
    },
    getApInfo() {
      request({
        url: '/frontcfg/get/ap',
        method: 'get',
        data: {}
      }).then(response => {
        console.log('返回=====>', response)
        if (response.RetCode === 0) {
          if (response.Data != null) {
            this.apInfo = response.Data
          }
        }
      })
    },
    getApInfoById(id) {
      for (const key in this.apInfo) {
        if (this.apInfo[key].id == id) {
          return this.apInfo[key]
        }
      }
      return { 'name': '未知AP', id: id }
    },
    showAddAp() {
      this.addApVisible = true
      this.isEditAp = false
      this.apAddItem = {
        ap: 0,
        name: '',
        ip: ''
      }
    },
    changeAp() {
      if (this.form.ap == '') {
        Message.error('请先选择Ap')
        return
      }
      this.addApVisible = true
      this.isEditAp = true
      const apInfo = this.getApInfoById(this.form.ap)
      this.apAddItem = {
        id: this.form.ap,
        name: apInfo.name,
        ip: apInfo.ap
      }
    },
    getEditTitle() {
      return this.isEditAp ? '修改AP' : '添加AP'
    },
    addAp() {
      const tips = this.isEditAp ? '是否修改AP' : '是否添加AP'
      const uri = this.isEditAp ? '/frontcfg/update/ap' : '/frontcfg/create/ap'
      console.log('uri===>', uri)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: uri,
          method: 'post',
          data: this.apAddItem
        }).then(response => {
          console.log('创建=====>', response)
          if (response.RetCode === 0) {
            Message.success(this.isEditAp ? '修改AP成功' : '添加AP成功')
            this.getApInfo()
          } else {
            Message.error(response.Data)
          }
        })
        this.addApVisible = false
      }).catch(() => {
        console.log('取消')
      })
    },
    addApPort() {
      if (this.form.ap == '') {
        Message.error('请先选择Ap')
        return
      }
      this.$confirm('是否添加AP端口?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/frontcfg/change/ap/port',
          method: 'post',
          data: {
            change: 1,
            port: this.apAddPortInfo.port,
            access: this.apAddPortInfo.access,
            id: this.form.ap
          }
        }).then(response => {
          console.log('创建=====>', response)
          if (response.RetCode === 0) {
            Message.success('添加端口成功')
            this.getApInfo()
            this.getInfo()
          } else {
            Message.error(response.Data)
          }
        })
        this.addApPortVisible = false
      }).catch(() => {
        console.log('取消')
      })
    },
    deletePort(row) {
      console.log('delete row', row)
      if (this.form.ap == '') {
        Message.error('请先选择Ap')
        return
      }
      this.$confirm('是否删除AP端口?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/frontcfg/change/ap/port',
          method: 'post',
          data: {
            change: 2,
            port: row.port,
            access: row.access,
            id: this.form.ap
          }
        }).then(response => {
          console.log('删除=====>', response)
          if (response.RetCode === 0) {
            Message.success('删除端口成功')
            this.getApInfo()
            location.reload()
          } else {
            Message.error(response.Data)
          }
        })
        this.addApPortVisible = false
      }).catch(() => {
        console.log('取消')
      })
    },
    delAp() {
      if (this.form.ap == '') {
        Message.error('请先选择Ap')
        return
      }
      const apInfo = this.getApInfoById(this.form.ap)
      this.$confirm('是否删除AP【' + apInfo.name + '】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/frontcfg/delete/ap',
          method: 'post',
          data: {
            id: this.form.ap
          }
        }).then(response => {
          console.log('删除=====>', response)
          if (response.RetCode === 0) {
            Message.success('删除成功')
            this.getApInfo()
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
