<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-button type="success" @click="showAddGroup">添加分组</el-button>
      <el-button type="info" @click="getInfo">刷新</el-button>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="gid"
          label="GID"
        />
        <el-table-column
          prop="name"
          label="名称"
        />
        <el-table-column
          prop="app_list"
          label="使用中的应用"
        />
        <el-table-column
          label="组信息"
        >
          <template slot-scope="scope">
            <el-table
              :data="formatApInfo(scope.row.aps)"
              border
            >
              <el-table-column
                label="AP"
              >
                <template slot-scope="scope">
                  {{scope.row.name}}({{scope.row.ap}})
                </template>
              </el-table-column>
              <el-table-column
                prop="port"
                label="port"
              />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="changeGroup(scope.row)"
            >修改
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteGroup(scope.row.gid,scope.row.name)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="form.page"
            :page-size="form.limit"
            layout="total, prev, pager, next, jumper"
            :total="form.total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="groupDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="groupForm" label-width="150px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="分组名称：">
              <el-input v-model="groupForm.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <fieldset>
          <legend>Ap信息</legend>
          <el-row>
            <el-col :span="24">
              <el-cascader-panel v-model="groupForm.aps" :options="apOptions" :props="{ multiple: true }" />
            </el-col>
          </el-row>
        </fieldset>
        <fieldset>
          <legend>选择情况</legend>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="groupForm.aps"
                border
                style="width: 100%"
              >
                <el-table-column
                  fixed
                  prop="0"
                  label="AP"
                />
                <el-table-column
                  fixed
                  prop="1"
                  label="port"
                />
              </el-table>
            </el-col>
          </el-row>
        </fieldset>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="saveGroup">保存</el-button>
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
      form: {
        page: 0,
        limit: 10,
        total: 0
      },
      apInfo: [],
      aps: [],
      tableData: [],
      libShow: $libShow,
      groupDialogVisible: false,
      groupForm: {
        gid: 0,
        name: '',
        aps: []
      },
      apOptions: []
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getApInfo()
  },
  methods: {
    getInfo() {
      const loading = Loading.service({ fullscreen: true })
      request({
        url: '/frontcfg/get/ap/group',
        method: 'get',
        data: this.form
      }).then(response => {
        console.log('获取信息=====>', response)
        loading.close()
        this.tableData = []
        if (response.RetCode !== 0) {
          Message.error('获取信息错误：' + response.Data)
        } else {
          this.tableData = response.Data.Data
          this.form.total = response.Data.Total
        }
      })
    },
    handleCurrentChange(page) {
      this.form.page = page
      this.getInfo()
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
            this.apOptions = []
            this.apInfo = response.Data
            for (let i = 0; i < this.apInfo.length; i++) {
              const row = this.apInfo[i]
              if (row.ports.length === 0) {
                continue
              }
              const one = {
                value: row.ap,
                label: row.name,
                children: []
              }
              for (let j = 0; j < row.ports.length; j++) {
                one.children.push({
                  value: row.ports[j].port,
                  label: row.ports[j].port + '-AC[' + row.ports[j].access + ']'
                })
              }
              this.apOptions.push(one)
            }
            this.getInfo()
          }
        }
      })
    },
    getApNameByIp(ip) {
      for (const key in this.apInfo) {
        if (this.apInfo[key].ap === ip) {
          return this.apInfo[key].name
        }
      }
      return '未知AP'
    },
    showAddGroup() {
      this.getApInfo()
      this.groupDialogVisible = true
      this.groupForm = {
        gid: 0,
        name: '',
        aps: []
      }
    },
    changeGroup(row){
      this.groupDialogVisible = true
      const apInfo = JSON.parse(decodeURI(row.aps))
      let lists = []
      for (let i = 0; i < apInfo.length; i++) {
        lists.push([apInfo[i].ap, apInfo[i].port])
      }
      this.groupForm = {
        gid: row.gid,
        name: row.name,
        aps: lists
      }
    },
    getEditTitle() {
      return this.groupForm.gid === 0 ? '添加' : '修改'
    },
    saveGroup() {
      const tips = this.groupForm.gid !== 0 ? '是否修改分组' : '是否添加分组'
      const uri = this.groupForm.gid === 0 ? '/frontcfg/create/ap/group' : '/frontcfg/update/ap/group'
      let aps = ''
      console.log('uri===>', uri,this.groupForm)
      if ( this.groupForm.name === "" ) {
        Message.error("分组名称为空")
        return
      }
      let apsArr = [];
      for (let i = 0; i < this.groupForm.aps.length; i++) {
        apsArr.push({
          ap: this.groupForm.aps[i][0],
          port: this.groupForm.aps[i][1],
          name: this.getApNameByIp(this.groupForm.aps[i][0])
        })
      }
      aps = JSON.stringify(apsArr)
      if(aps === ""){
        Message.error("未选择ap")
        return
      }
      aps = encodeURI(aps)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: uri,
          method: 'post',
          data: {
            gid: this.groupForm.gid,
            name: this.groupForm.name,
            aps: aps
          }
        }).then(response => {
          console.log('创建=====>', response)
          if (response.RetCode === 0) {
            Message.success(this.groupForm.gid !== 0 ? '修改成功' : '添加成功')
            this.getInfo()
          } else {
            Message.error(response.Data)
          }
        })
        this.groupDialogVisible = false
      }).catch(() => {
        console.log('取消')
      })
    },
    deleteGroup(gid, name) {
      console.log('delete row', gid, name)
      this.$confirm('是否删除分组 ' + name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/frontcfg/delete/ap/group',
          method: 'post',
          data: {
            gid: gid
          }
        }).then(response => {
          console.log('删除=====>', response)
          if (response.RetCode === 0) {
            Message.success('删除成功')
            this.getInfo()
          } else {
            Message.error(response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    formatApInfo(aps) {
      const apInfo = JSON.parse(decodeURI(aps))
      return apInfo
    }
  }
}
</script>
