<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-button type="success" @click="showAddGroup">添加分组</el-button>
    <el-button type="info" @click="getGroupList">刷新</el-button>
</el-row>
<div style="padding-top: 10px">
  <el-table :data="tableData" border style="width: 100%">
  <el-table-column fixed prop="gid" label="分组ID" width="100" />
  <el-table-column prop="name" label="分组名" width="200" />
  <el-table-column prop="app_list" label="使用中的应用" />
  <el-table-column label="组信息">
    <template slot-scope="scope">
      <el-table :data="formatWspList(scope.row.wsp_list)" border>
      <el-table-column label="WSP服务器">
        <template slot-scope="scope">{{scope.row.name}}({{scope.row.wsp}})</template>
      </el-table-column>
      <el-table-column prop="port" label="端口" />
    </el-table>
  </template>
</el-table-column>
<el-table-column label="操作" width="180">
  <template slot-scope="scope">
    <el-button type="success" size="mini" @click="changeGroup(scope.row)">修改</el-button>
  <el-button type="danger" size="mini" @click="deleteGroup(scope.row.gid,scope.row.name)">删除</el-button>
</template>
</el-table-column>
</el-table>
<el-col :offset="16" :span="8">
  <div class="block">
  <el-pagination :current-page="form.page" :page-size="form.limit" layout="total, prev, pager, next, jumper" :total="form.total" @current-change="handleCurrentChange" />
  </div>
</el-col>
</div>
<el-dialog :title="getEditTitle()" :visible.sync="groupDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
  <el-form :model="groupForm" label-width="150px">
  <el-row>
  <el-col :span="15">
  <el-form-item label="分组名称：">
  <el-input v-model="groupForm.name" placeholder="请输入" />
  </el-form-item>
</el-col>
</el-row>
<fieldset>
  <legend>WebSocket代理服务信息</legend>
  <el-row>
    <el-col :span="24">
    <el-cascader-panel v-model="groupForm.wsp_list" :options="instOptions" :props="{ multiple: true }" />
  </el-col>
</el-row>
</fieldset>
<fieldset>
  <legend>选择情况</legend>
  <el-row>
    <el-col :span="24">
    <el-table :data="groupForm.wsp_list" border style="width: 100%">
    <el-table-column fixed prop="0" label="WebSocket代理服务器" />
    <el-table-column fixed prop="1" label="WebSocket代理服务端口" />
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
  allWspList: [],
  tableData: [],
  libShow: $libShow,
  groupDialogVisible: false,
  groupForm: {
  gid: 0,
  name: '',
  wsp_list: []
},
  instOptions: []
}
},
  created() {
  this.env = store.getters.env || this.env
  this.getInstList()
},
  methods: {
  getGroupList() {
  const loading = Loading.service({ fullscreen: true })
  request({
  url: '/wspcfg/group/list',
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
  this.getGroupList()
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
  this.instOptions = []
  this.allWspList = response.Data
  for (let i = 0; i < this.allWspList.length; i++) {
  const row = this.allWspList[i]
  if (row.ports.length === 0) {
  continue
}
  const one = {
  value: row.ip,
  label: row.name,
  children: []
}
  for (let j = 0; j < row.ports.length; j++) {
  one.children.push({
  value: row.ports[j].port,
  label: 'WebSocket[:' + row.ports[j].port + '] ---> Access[:' + row.ports[j].access + ']'
})
}
  this.instOptions.push(one)
}
  this.getGroupList()
}
}
})
},
  getInstNameByIp(ip) {
  for (const key in this.allWspList) {
  if (this.allWspList[key].ip === ip) {
  return this.allWspList[key].name
}
}
  return '未知WSP'
},
  showAddGroup() {
  this.getInstList()
  this.groupDialogVisible = true
  this.groupForm = {
  gid: 0,
  name: '',
  wsp_list: []
}
},
  changeGroup(row) {
  this.groupDialogVisible = true
  const wspList = JSON.parse(decodeURI(row.wsp_list))
  const lists = []
  for (let i = 0; i < wspList.length; i++) {
  lists.push([wspList[i].wsp, wspList[i].port])
}
  this.groupForm = {
  gid: row.gid,
  name: row.name,
  wsp_list: lists
}
},
  getEditTitle() {
  return this.groupForm.gid === 0 ? '添加' : '修改'
},
  saveGroup() {
  const tips = this.groupForm.gid !== 0 ? '是否修改分组' : '是否添加分组'
  const uri = this.groupForm.gid === 0 ? '/wspcfg/group/create' : '/wspcfg/group/update'
  let wspTxt = ''
  console.log('uri===>', uri, this.groupForm)
  if (this.groupForm.name === '') {
  Message.error('分组名称为空')
  return
}
  const wspArr = []
  for (let i = 0; i < this.groupForm.wsp_list.length; i++) {
  wspArr.push({
  wsp: this.groupForm.wsp_list[i][0],
  port: this.groupForm.wsp_list[i][1],
  name: this.getInstNameByIp(this.groupForm.wsp_list[i][0])
})
}
  wspTxt = JSON.stringify(wspArr)
  if (wspTxt === '') {
  Message.error('未选择WSP')
  return
}
  wspTxt = encodeURI(wspTxt)
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
  wsp_list: wspTxt
}
}).then(response => {
  console.log('创建=====>', response)
  if (response.RetCode === 0) {
  Message.success(this.groupForm.gid !== 0 ? '修改成功' : '添加成功')
  this.getGroupList()
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
  url: '/wspcfg/group/delete',
  method: 'post',
  data: {
  gid: gid
}
}).then(response => {
  console.log('删除=====>', response)
  if (response.RetCode === 0) {
  Message.success('删除成功')
  this.getGroupList()
} else {
  Message.error(response.Data)
}
})
}).catch(() => {
  console.log('取消')
})
},
  formatWspList(wspList) {
  return JSON.parse(decodeURI(wspList))
}
}
}
</script>
