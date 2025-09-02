<template>
  <div class="user-pool-container">
    <!-- 筛选区 -->
    <el-form inline>
      <el-form-item label="导入时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="生效ID">
        <el-input v-model="searchUserId" clearable placeholder="请输入生效ID"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData()">查询</el-button>
        <el-button type="success" @click="handleCreate">添加配置</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-tooltip content="1.需要首行标题2.导入追加" effect="dark" placement="top">
          <input type="file" accept=".xlsx, .xls" size="small" @change="handleImport">
        </el-tooltip>
      </el-form-item>
      <br>
      <el-form-item>
        <publish primary-key="ID" key-id="SlotsUserPoolData" :env-empty="false"/>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="updateAt" label="导入时间" align="center" min-width="320">
        <template slot-scope="scope">
          {{ formatDate(scope.row.updateAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="effectiveRange" label="生效时间" align="center" min-width="320">
        <template slot-scope="scope">
          {{ formatDate(scope.row.validStartAt) }} 至 {{ formatDate(scope.row.validEndAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="生效ID" align="center" min-width="320"/>
      <el-table-column prop="amount" label="可发放金额" align="center" min-width="320">
        <template slot-scope="scope">
          {{ scope.row.amount / 1000 }}
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="修改人" align="center" min-width="320"/>
      <el-table-column label="操作" align="center" min-width="197">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="removeRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="900px" @close="resetEditForm">
      <el-form :model="edit.item" label-width="100px">
        <el-form-item label="导入时间">
          <el-input v-model="edit.item.updateAt" :disabled="true" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="生效时间">
          <el-date-picker
            v-model="edit.item.effectiveRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 600px"
          />
        </el-form-item>
        <el-form-item label="生效ID">
          <el-input v-model.number="edit.item.uid" style="width: 600px" :disabled="edit.editingIndex !== null"/>
        </el-form-item>
        <el-form-item label="可发放金额">
          <el-input-number v-model.number="edit.item.amount" :min="0" style="width: 600px" :step="0.1" :precision="3"/>
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
        :current-page="pageInfo.GetCurrentPage()"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageInfo.GetPageNum()"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.GetTotalCount()"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <hr/>
    <div class="block">
      <el-button type="success" @click="queryUserPoolCache">查询用户实时小奖池余额列表</el-button>
      <br/>
      <el-table :data="userPoolCache" border style="width: 100%; margin-top: 20px;">
        <el-table-column prop="uid" label="UID" align="center" min-width="320"/>
        <el-table-column prop="pool" label="剩余金额" align="center" min-width="320">
          <template slot-scope="scope"> {{ scope.row.pool / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="expireAt" label="过期时间" align="center" min-width="320">
          <template slot-scope="scope"> {{ formatDate(scope.row.expireAt) }}</template>
        </el-table-column>
        <el-table-column prop="createAt" label="导入时间" align="center" min-width="320">
          <template slot-scope="scope"> {{ formatDate(scope.row.createAt) }}</template>
        </el-table-column>
        <el-table-column prop="createBy" label="修改人" align="center" min-width="320"/>
      </el-table>
    </div>

  </div>
</template>

<script>
import request from '@/utils/request'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import {$libShow, ClientTableData, Pagination, ValidateVueItem} from '@/utils/common'
import {Message} from 'element-ui'
import XLSX from 'xlsx'
import {mapGetters} from "vuex";
import {now} from "mockjs/src/mock/random/date";
import store from "@/store";

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
      AttrNames: {
        uid: '生效id',
        amount: '可发放金额',
        updateAt: '更新时间',
        updateBy: '修改人',
        validStartAt: '生效开始时间',
        validEndAt: '生效结束时间'
      },
      pageInfo: new Pagination(0, 100),
      pageSize: 100,
      page: 1,
      reqData: {
        Data: ''
      },
      currRowUpdateAt: 0,
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
      userPoolCache: []
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
      this.pageInfo.SetPageNum(val)
      this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
    },
    handleCurrentChange(val) {
      this.pageInfo.SetPageNo(val)
      this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
    },
    async fetchData() {
      await this.getGameList()
      await this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
      // await this.getConfigTable()
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
      const h = date.getHours()
      const M = date.getMinutes()
      const S = date.getSeconds()
      return `${y}-${m}-${d} ` + (h > 9 ? h : '0'+h) + ':' + (M > 9 ? M : '0'+M) + ':' + (S > 9 ? S : '0'+S)
    },
    getFullKey() {
      return 'CustomizeCfg_slots_user_pool_data'
    },
    async getAllData() {
      await this.getData(0, 0)
    },
    searchData() {
      if (this.dateRange === null) {
        Message.error('请输入日期')
        return
      }
      this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
    },
    getData(pageIndex, pageSize) {
      // 加载基础数值配置
      return request({
        url: '/userpoolconfig/all',
        method: 'get',
        data: {
          page: pageIndex,
          pageSize: pageSize,
          uid: this.searchUserId,
          updateStartAt: this.UnixStart(this.dateRange[0]),
          updateEndAt: this.UnixEnd(this.dateRange[1])
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = response.Data.rows ? response.Data.rows : []
          this.pageInfo.SetTotalCount(response.Data.total)
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
      this.edit.item.amount = row.amount / 1000
      this.edit.item.uid = row.uid
      this.edit.item.updateAt = this.formatDate(row.updateAt)
      this.currRowUpdateAt = row.updateAt
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
    async saveEdit() {
      if (!this.checkData()) return
      if (this.edit.editingIndex !== null) {
        this.userPoolItem.id = this.edit.item.id
        this.userPoolItem.uid = Number(this.edit.item.uid)
        this.userPoolItem.amount = this.edit.item.amount * 1000
        // this.userPoolItem.UpdateAt = Math.floor(Date.now() / 1000)// todo
        this.userPoolItem.updateAt = this.currRowUpdateAt
        this.userPoolItem.updateBy = this.name
        this.userPoolItem.validStartAt = this.UnixStart(this.edit.item.effectiveRange[0])
        this.userPoolItem.validEndAt = this.UnixEnd(this.edit.item.effectiveRange[1])
        //
        await this.updateRequest(this.userPoolItem)
        //
        // await this.filterData2ConfigTable()
      } else {
        await this.createSave(this.edit.item)
      }
      this.editDialogVisible = false
    },
    filterData2ConfigTable() {
      return request({
        url: '/userpoolconfig/all',
        method: 'get',
        data: {
          page: 0,
          pageSize: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let allConfigData = response.Data.rows ? response.Data.rows : []
          allConfigData = this.filterExpiredData(allConfigData)
          this.userPoolCfg.items = allConfigData
          this.reqData.Data = JSON.stringify(this.userPoolCfg)
          this.saveConfigTable(this.reqData)
        }
      })
    },
    UnixStart(dateStr) {
      // 直接生成 Date 对象
      const date = new Date(dateStr)
      date.setHours(0, 0, 0, 0) // 设置到当天的第一秒
      // 毫秒时间戳
      const timestampMs = date.getTime()
      return Math.floor(timestampMs / 1000)
    },
    UnixEnd(dateStr) {
      // 直接生成 Date 对象
      const date = new Date(dateStr)
      date.setHours(23, 59, 59, 59) // 设置到当天的第最后一秒
      // 毫秒时间戳
      const timestampMs = date.getTime()
      return Math.floor(timestampMs / 1000)
    },
    updateRequest(updateData) {
      return request({
        url: '/userpoolconfig/update',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
          Message.success('操作成功！')
        }
      })
    },
    createRequest(updateData) {
      return request({
        url: '/userpoolconfig/create',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          Message.success('操作成功！')
        }
        this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
      })
    },
    async createSave() {
      this.userPoolItem.uid = this.edit.item.uid
      this.userPoolItem.amount = this.edit.item.amount * 1000
      this.userPoolItem.updateAt = Math.floor(Date.now() / 1000)
      this.userPoolItem.updateBy = this.name
      this.userPoolItem.validStartAt = this.UnixStart(this.edit.item.effectiveRange[0])
      this.userPoolItem.validEndAt = this.UnixEnd(this.edit.item.effectiveRange[1])
      if (this.tableData === null) {
        this.tableData = []
      }
      // this.tableData.push(this.userPoolItem) todo
      this.userPoolCfg.items = this.tableData
      // this.reqData.Data = JSON.stringify(this.userPoolCfg)
      await this.createRequest(this.userPoolItem)
      // 加到配置表中
      // await this.filterData2ConfigTable()
    },
    checkData() {
      if (this.edit.item.amount <= 0) {
        this.$message.error('可发放金额填写错误')
        return false
      }
      if (this.edit.item.uid <= 0) {
        this.$message.error('uid填写错误')
        return false
      }
      if (
        this.edit.item.uid === '' ||
        this.edit.item.amount === undefined ||
        this.edit.item.updateAt === '' ||
        this.edit.item.effectiveRange === null ||
        this.edit.item.effectiveRange.length === 0) {
        this.$message.error('请填写完整')
        return false
      }
      if (this.UnixEnd(this.edit.item.effectiveRange[1]) < this.getCurrentUnix()) {
        this.$message.error('生效时间已经过期')
        return false
      }
      return true
    },
    deleteById(Id) {
      return request({
        url: 'userpoolconfig/delete',
        method: 'post',
        data: {id: Id}
      }).then(response => {
        if (response.RetCode === 0) {
          // this.edit.item.ID = response.Data.ID
          // this.clientDB.AddData(this.edit.item)
          this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
          Message.success('操作成功！')
        }
      })
    },
    removeRow(row) {
      const mess = '确定删除这条记录?' + '{uid:' + row.uid + ',金额:' + row.amount / 1000 + ',导入时间:' + this.formatDate(row.updateAt) + ',修改人:' + row.updateBy + ',生效开始时间:' +
        this.formatDate(row.validStartAt) + ',生效结束时间:' + this.formatDate(row.validEndAt) + '}'
      this.$confirm(mess, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 加到配置表中
      // await this.filterData2ConfigTable()
    },
    resetEditForm() {
      this.editForm = {updateAt: '', effectiveRange: [], uid: '', amount: 0}
      this.edit.editingIndex = null
    },
    removeAllConfig() {
      this.tableData = []
    },
    async handleImport(event) {
      let isPassCheck = true
      const file = event.target.files[0]
      // eslint-disable-next-line no-empty
      if (file !== undefined) {
        this.removeAllConfig()
        this.resetEditForm()
      }
      const excelData = []
      const today = this.getCurrentUnix()// 当日凌晨0点的时间
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
                  isPassCheck = false
                  Message.error(`导入失败: UID ${uid} 在表格中存在重复`)
                  return
                }
                uidSet.add(uid)
                const userPoolItem = {}
                userPoolItem.updateAt = today// 当日凌晨0点的时间
                userPoolItem.validStartAt = this.excelSerialToUnix(row[0], 'start')
                userPoolItem.validEndAt = this.excelSerialToUnix(row[1], 'end')
                userPoolItem.uid = row[2]
                userPoolItem.amount = row[3] * 1000
                // userPoolItem.updateBy = this.reqData.ModifyUser
                if (
                  userPoolItem.updateAt === 0 ||
                  userPoolItem.validStartAt === 0 ||
                  userPoolItem.validStartAt < 0 ||
                  userPoolItem.validEndAt === 0 ||
                  userPoolItem.validEndAt < 0 ||
                  userPoolItem.uid <= 0 ||
                  userPoolItem.amount === 0 ||
                  userPoolItem.amount === undefined) {
                  isPassCheck = false
                  Message.error('导入失败,数据存在错误')
                  return
                }
                if (userPoolItem.validEndAt < this.getCurrentUnix()) {
                  isPassCheck = false
                  Message.error('存在过期数据不能导入')
                  return
                }
                if (userPoolItem.validEndAt < userPoolItem.validStartAt) {
                  isPassCheck = false
                  Message.error('生效结束时间早于生效开始时间')
                  return
                }
                excelData.push(userPoolItem)
              }
            })
            this.userPoolCfg.items = []
            this.userPoolCfg.items.push(...excelData)// 只追加excel中的
            if (this.reqData == null) {
              this.reqData = {}
            }
            this.reqData.Data = JSON.stringify(excelData)
            if (isPassCheck) {
              this.excel2ConfigTable()
            } else {
              this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
            }
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    async excel2ConfigTable() {
      // 后端处理UpdateBy(excelData会再次刷新)
      await this.excelImportData(JSON.stringify(this.userPoolCfg))
      await this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
      // 筛出过期配置，保存到配置表
      // eslint-disable-next-line no-unused-vars
      // await this.filterData2ConfigTable()
    },
    filterExpiredData(needFilterData) {
      const res = []
      for (const data of needFilterData) {
        if (data.validEndAt >= this.getCurrentUnix()) {
          delete data.id
          res.push(data)
        }
      }
      return res
    },
    getCurrentUnix() {
      return Math.floor(Date.now() / 1000)
    },
    excelImportData(jsonData) {
      return request({
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
          this.getData(this.pageInfo.GetCurrentPage(), this.pageInfo.GetPageNum())
          Message.success('操作成功！')
        }
      })
    },
    // getConfigTable() {
    //   // 加载基础数值配置
    //   return request({
    //     url: '/customizeconfig/one',
    //     method: 'get',
    //     data: {
    //       SubKey: 'slots_user_pool_data'
    //     }
    //   }).then(response => {
    //     if (response.RetCode === 0) {
    //       this.extForm = response.Data || {}
    //       if (response.Data && response.Data.Data !== '') {
    //         this.reqData = response.Data
    //         console.log('this.reqData====>', this.reqData)
    //       }
    //     }
    //   })
    // },
    excelSerialToUnix(serial, unixMode) {
      const date = XLSX.SSF.parse_date_code(serial)
      if (!date) return 0

      if (unixMode === 'end') {
        // 返回当天的最后一秒 (23:59:59)
        return Math.floor(new Date(date.y, date.m - 1, date.d, 23, 59, 59).getTime() / 1000)
      }
      // 默认返回当天的开始 (00:00:00)
      return Math.floor(new Date(date.y, date.m - 1, date.d).getTime() / 1000)
    },
    splitTimeRange(dateStr) {
      return dateStr.replace(/\s+/g, '').split('至')
    },
    queryUserPoolCache() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/user/pool/cache',
          Env: store.getters.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.userPoolCache = response.Data
        }
      }).catch(e => {
        console.log(e)
      })
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
