<template>
  <div class="user-pool-container">
    <!-- 筛选区 -->
    <el-form inline>
      <el-form-item label="导入日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="生效ID">
        <el-input v-model="searchUserId" clearable placeholder="请输入生效ID"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData(page,pageSize)">查询</el-button>
        <el-button type="success" @click="handleCreate">添加配置</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-tooltip content="1.需要首行标题" effect="dark" placement="top">
          <input type="file" accept=".xlsx, .xls" size="small" @change="handleImport">
        </el-tooltip>
      </el-form-item>
      <br>
      <el-form-item>
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object"/>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="updateAt" label="导入日期" align="center" width="320">
        <template slot-scope="scope">
          {{ formatDate(scope.row.updateAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="effectiveRange" label="生效日期" align="center" width="320">
        <template slot-scope="scope">
          {{ formatDate(scope.row.validStartAt) }} 至 {{ formatDate(scope.row.validEndAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="生效ID" align="center" width="320"/>
      <el-table-column prop="amount" label="可发放金额" align="center" width="320"/>
      <el-table-column prop="updateBy" label="修改人" align="center" width="320"/>
      <el-table-column label="操作" align="center" width="197">
        <template slot-scope="scope">
          <!--          <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button>-->
          <el-button type="danger" size="mini" @click="removeRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="900px" @close="resetEditForm">
      <el-form :model="edit.item" label-width="100px">
        <el-form-item label="导入日期">
          <el-input v-model="edit.item.updateAt" :disabled="true" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker
            v-model="edit.item.effectiveRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 600px"
          />
        </el-form-item>
        <el-form-item label="生效ID">
          <el-input v-model.number="edit.item.uid" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="可发放金额">
          <el-input-number v-model.number="edit.item.amount" :min="0" style="width: 600px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">保 存</el-button>
      </div>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare"/>
    <!--    分页-->
    <div class="block">
      <el-pagination
        :current-page="clientDB.GetPage().GetCurrentPage()"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="clientDB.GetPage().GetPageNum()"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import request from '@/utils/request'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import {$libShow, ClientTableData, ValidateVueItem} from '@/utils/common'
import {Message} from 'element-ui'
import XLSX from 'xlsx'
import {mapGetters} from "vuex";
import {now} from "mockjs/src/mock/random/date";

const filterMap = {}

function newItem() {
  return {updateAt: getCurrentDate(), effectiveRange: [], updateBy: '', uid: '', amount: 0, id: 0}
}

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default {
  name: 'UserPoolData',
  components: {Compare, Publish},
  data() {
    return {
      dialogTitle: '编辑配置',
      dateRange: [],
      clientDB: new ClientTableData([], 1, filterMap),
      searchUserId: '',
      tableData: [],
      gameNameMap: {}, // {gameName:gameId}
      gameIdMap: {}, // {gameId:gameName}
      editDialogVisible: false,
      editForm: {updateAt: '', effectiveRange: [], uid: '', amount: 0},
      // editingIndex: null,
      userPoolCfg: {
        items: []
      },
      pageSize: 100,
      page: 1,
      reqData: {
        Data: ''
      },
      userPoolItem: {
        id: 0,
        uid: 0,
        amount: 0,
        updateAt: 0,
        updateBy: '',
        validStartAt: 0,
        validEndAt: 0
      },
      edit: {
        editingIndex: null,
        item: newItem()
      },
      // 复选框相关
      //
      allGames: [],
    }
  },
  computed: {
    ...mapGetters([
      'name',
    ])
  },
  mounted() {
    this.setDefaultDateRange()
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.getData(this.page, this.pageSize)
    },
    handleCurrentChange(val) {
      this.page = val
      this.getData(this.page, this.pageSize)
    },
    async fetchData() {
      await this.getGameList()
      await this.getData(this.page, this.pageSize)
      await this.getConfigTable()
    },
    getGameList() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          this.allGames = []
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            this.allGames.push(response.Data[i].Gid + '|' + response.Data[i].Name)
            this.gameNameMap[response.Data[i].Name] = response.Data[i].Gid
            this.gameIdMap[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    },
    formatDate(Unix) {
      // row.updateAt 是秒级时间戳，需要乘 1000 转成毫秒
      const date = new Date(Unix * 1000)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    getFullKey() {
      return 'CustomizeCfg_slots_user_pool_data'
    },
    async getAllData() {
      await this.getData(0, 0)
    },
    getData(pageIndex, pageSize) {
      // 加载基础数值配置
      return request({
        url: '/userpoolconfig/all',
        method: 'get',
        data: {
          page: pageIndex,
          pageSize: pageSize,
          UID: this.searchUserId,
          updateStartAt: this.Unix(this.dateRange[0]),
          updateEndAt: this.Unix(this.dateRange[1])
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data ? response.Data : []
          // this.reqData = response.Data// todo delete
        }
      })
    },
    setDefaultDateRange() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const fmt = d => d.toISOString().slice(0, 10)
      this.dateRange = [fmt(start), fmt(end)]
    },
    openEdit(row) {
      this.dialogTitle = '编辑配置'
      this.edit.editingIndex = this.tableData.indexOf(row)
      this.edit.item.id = row.id
      this.edit.item.amount = row.amount
      this.edit.item.uid = row.uid
      this.edit.item.updateAt = this.formatDate(row.updateAt)
      this.edit.item.updateBy = row.updateBy
      const start = new Date(row.validStartAt * 1000)
      const end = new Date(row.validEndAt * 1000)
      this.edit.item.effectiveRange = [start, end]
      //
      this.editDialogVisible = true
    },
    handleCreate() {
      this.dialogTitle = '添加配置'
      this.edit.item = newItem()
      this.editDialogVisible = true
    },
    saveEdit() {
      if (!this.checkData()) return
      if (this.edit.editingIndex !== null) {
        // this.userPoolItem.ID = this.edit.item.id
        // this.userPoolItem.UID = Number(this.edit.item.uid)
        // this.userPoolItem.Amount = this.edit.item.amount
        // this.userPoolItem.UpdateAt = Math.floor(Date.now() / 1000)
        // this.userPoolItem.UpdateBy = this.name
        // this.userPoolItem.ValidStartAt = this.Unix(this.edit.item.effectiveRange[0])
        // this.userPoolItem.ValidEndAt = this.Unix(this.edit.item.effectiveRange[1])
        // //
        // let allConfigData = []
        // this.getAllData() // 数据库的数据
        // allConfigData.push(...this.tableData)
        // allConfigData.push(this.userPoolItem)
        // allConfigData = this.filterExpiredData(allConfigData)
        // this.userPoolCfg.items = allConfigData
        // this.reqData.Data = JSON.stringify(this.userPoolCfg)
        // this.saveConfigTable(this.reqData)
        // //
        // this.updateRequest(this.userPoolItem)
      } else {
        this.createSave(this.edit.item)
      }
      this.editDialogVisible = false
    },
    getPostData() {
      return this.edit.item
    },
    Unix(dateStr) {
      // 直接生成 Date 对象
      const date = new Date(dateStr)
      date.setHours(0, 0, 0, 0) // 设置到当天的第一秒
      // 毫秒时间戳
      const timestampMs = date.getTime()
      return Math.floor(timestampMs / 1000)
    },
    updateRequest(updateData) {
      request({
        url: '/userpoolconfig/update',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.getData(this.page, this.pageSize)
          Message.success('操作成功！')
        }
      })
    },
    createRequest(updateData) {
      request({
        url: '/userpoolconfig/create',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('已经完成创建');
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.getData(this.page, this.pageSize)
          Message.success('操作成功！')
        }
      })
    },
    async createSave() {
      this.userPoolItem.uid = this.edit.item.uid
      this.userPoolItem.amount = this.edit.item.amount
      this.userPoolItem.updateAt = Math.floor(Date.now() / 1000)
      this.userPoolItem.updateBy = this.name
      this.userPoolItem.validStartAt = this.Unix(this.edit.item.effectiveRange[0])
      this.userPoolItem.validEndAt = this.Unix(this.edit.item.effectiveRange[1])
      this.tableData.push(this.userPoolItem)
      this.userPoolCfg.items = this.tableData
      // this.reqData.Data = JSON.stringify(this.userPoolCfg)
      await this.createRequest(this.userPoolItem)
      // 加到配置表中
      await request({
        url: '/userpoolconfig/all',
        method: 'get',
        data: {
          page: 0,
          pageSize: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('已经完成列表获取');
          let allConfigData = response.Data ? response.Data : []
          allConfigData = this.filterExpiredData(allConfigData)
          this.userPoolCfg.items = allConfigData
          this.reqData.Data = JSON.stringify(this.userPoolCfg)
          this.saveConfigTable(this.reqData)
        }
      })
    },
    checkData() {
      if (this.edit.amount < 0) {
        this.$message.error('可发放金额不能为负数')
        return false
      }
      if (
        this.edit.item.uid === '' ||
        this.edit.item.amount === undefined ||
        this.edit.item.updateAt === '' ||
        this.edit.item.effectiveRange === null) {
        this.$message.error('请填写完整')
        return false
      }
      return true
    },
    async removeRow(row) {
      await request({
        url: 'userpoolconfig/delete',
        method: 'post',
        data: {ID: row.id}
      }).then(response => {
        if (response.RetCode === 0) {
          // this.edit.item.ID = response.Data.ID
          // this.clientDB.AddData(this.edit.item)
          this.getData(this.page, this.pageSize)
          Message.success('操作成功！')
        }
      })
      // 加到配置表中
      let allConfigData = []
      await this.getAllData() // 数据库的数据
      allConfigData.push(...this.tableData)
      allConfigData = this.filterExpiredData(allConfigData)
      for (const index in allConfigData) { // 删除这个
        if (allConfigData[index].id === row.id) {
          allConfigData.splice(index, 1)
        }
      }
      this.userPoolCfg.items = allConfigData
      this.reqData.Data = JSON.stringify(this.userPoolCfg)
      this.saveConfigTable(this.reqData)
    },
    resetEditForm() {
      this.editForm = {updateAt: '', effectiveRange: [], uid: '', amount: 0}
      this.edit.editingIndex = null
    },
    removeAllConfig() {
      this.tableData = []
    },
    getMidnightTimestamp() {
      // 创建一个新的Date对象，表示当前时间
      const now = new Date()
      // 设置时间为当天凌晨0点
      now.setHours(0, 0, 0, 0)
      // 返回当天凌晨0点的时间戳
      return now.getTime() / 1000
    },
    handleImport(event) {
      const file = event.target.files[0]
      // eslint-disable-next-line no-empty
      if (file !== undefined) {
        this.removeAllConfig()
        this.resetEditForm()
      }
      const today = this.getMidnightTimestamp()// 当日凌晨0点的时间
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, {type: 'array'})
          const sheetNames = workbook.SheetNames
          const uidSet = new Set() // 用来存放已存在的 uid
          sheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1})
            this.resetEditForm()
            json.forEach((row, index) => {
              if (index > 0 && row.length > 0) {
                const uid = row[2]
                // 1. 检查 uid 是否重复
                if (uidSet.has(uid)) {
                  Message.error(`导入失败: UID ${uid} 在表格中存在重复`)
                  return
                }
                uidSet.add(uid)
                const userPoolItem = {}
                userPoolItem.updateAt = today// 当日凌晨0点的时间
                userPoolItem.validStartAt = this.excelSerialToUnix(row[0])
                userPoolItem.validEndAt = this.excelSerialToUnix(row[1])
                userPoolItem.uid = row[2]
                userPoolItem.amount = row[3]
                // userPoolItem.updateBy = this.reqData.ModifyUser
                if (
                  userPoolItem.updateAt === 0 ||
                  userPoolItem.validStartAt === 0 ||
                  userPoolItem.validEndAt === 0 ||
                  userPoolItem.uid === 0 ||
                  userPoolItem.amount === 0) {
                  Message.error('导入失败,数据不能为空')
                  return
                }
                this.tableData.push(userPoolItem)
              }
            })
            this.userPoolCfg.items.push(...this.tableData)// 只追加excel中的
            if (this.reqData == null) {
              this.reqData = {}
            }
            this.reqData.Data = JSON.stringify(this.userPoolCfg)
            // 后端处理UpdateBy(this.tableData会再次刷新)
            this.excelImportData(JSON.stringify(this.userPoolCfg))
            // 筛出过期配置，保存到配置表
            // eslint-disable-next-line no-unused-vars
            let allConfigData = []
            this.getAllData() // 数据库的数据
            allConfigData.push(...this.tableData)
            allConfigData = this.filterExpiredData(allConfigData)
            this.userPoolCfg.items = allConfigData
            this.reqData.Data = JSON.stringify(this.userPoolCfg)
            // console.log('handlerImport this.reqData:=====>', this.reqData);
            this.saveConfigTable(this.reqData)
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    filterExpiredData(needFilterData) {
      const res = []
      for (const data of needFilterData) {
        if (data.validEndAt >= this.getCurrentUnix()) {
          res.push(data)
        }
      }
      return res
    },
    getCurrentUnix() {
      return Math.floor(Date.now() / 1000)
    },
    excelImportData(jsonData) {
      request({
        url: 'userpoolconfig/import/excel',
        method: 'post',
        data: {ExcelJsonData: jsonData}
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          Message.success('操作成功！')
        }
      })
    },
    saveConfigTable(updateData) {
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.getData(this.page, this.pageSize)
          Message.success('操作成功！')
        }
      })
    },
    getConfigTable() {
      // 加载基础数值配置
      return request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slots_user_pool_data'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.reqData = response.Data
            console.log('getConfigTable this.reqData:=====>', this.reqData);
          }
        }
      })
    },
    excelSerialToUnix(serial) {
      const date = XLSX.SSF.parse_date_code(serial)
      if (!date) return 0
      return Math.floor(new Date(date.y, date.m - 1, date.d).getTime() / 1000)
    },
    splitTimeRange(dateStr) {
      return dateStr.replace(/\s+/g, '').split('至')
    }
  }
}
</script>

<style scoped>
.user-pool-container {
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 100px;
}
</style>
