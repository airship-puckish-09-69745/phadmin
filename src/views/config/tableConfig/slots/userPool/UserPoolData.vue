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
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="success" @click="fetchData">刷新</el-button>
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
      <el-table-column prop="updateAt" label="导入日期" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.updateAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="effectiveRange" label="生效日期" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.validStartAt) }} 至 {{ formatDate(scope.row.validEndAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="games" label="生效游戏" align="center">
        <template slot-scope="scope">
          {{ getGameLabels(scope.row.games) }}
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="生效ID" align="center"/>
      <el-table-column prop="amount" label="可发放金额" align="center"/>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="removeRow(scope.$index)">删除</el-button>
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
          <el-input v-model="edit.item.uid" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="可发放金额">
          <el-input-number v-model="edit.item.amount" :min="0" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="生效游戏">
          <!--          <el-input v-model="editForm.games" style="width: 350px"></el-input>-->
          <!--          <el-select v-model="edit.item.games" multiple style="width: 600px">-->
          <!--            <el-option v-for="(o) in gameOptions" :key="o.key" :label="o.label" :value="parseInt(o.key)"/>-->
          <!--          </el-select>-->
          <el-tooltip
            class="item"
            effect="dark"
            content="导入时,请严格按下拉框中游戏名称进行导入"
            placement="right-start"
          >
            <i class="el-icon-info"/>
          </el-tooltip>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <div style="margin: 15px 0;"/>
          <el-checkbox-group v-model="edit.item.games" @change="handleCheckedGamesChange">
            <el-checkbox v-for="game in allGames" :key="game" :label="game">{{ game }}</el-checkbox>
          </el-checkbox-group>
          <!--          -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">保 存</el-button>
      </div>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare"/>

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

const filterMap = {}

function newItem() {
  return {updateAt: getCurrentDate(), effectiveRange: [], updateBy: '', games: [], uid: '', amount: 0}
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
      // todo
      queryGid: 82,
      // gameOptions: [],
      dialogTitle: '编辑配置',
      // todo
      dateRange: [],
      clientDB: new ClientTableData([], 1, filterMap),
      searchUserId: '',
      tableData: [],
      tableDataBak: [], // 用于筛选
      gameNameMap: {}, // {gameName:gameId}
      gameIdMap: {}, // {gameId:gameName}
      editDialogVisible: false,
      editForm: {updateAt: '', effectiveRange: [], games: '', uid: '', amount: 0},
      // editingIndex: null,
      formData: {},
      userPoolCfg: {
        items: []
      },
      reqData: {},
      userPoolItem: {
        uid: 0,
        games: [],
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
      checkAll: false,
      // cities: cityOptions,
      //
      allGames: [],
      // pickGames: [],
      isIndeterminate: true,
    }
  },
  computed: {
    ...mapGetters([
      'name',
    ])
  },
  mounted() {
    this.setDefaultDateRange()
    this.handleSearch()
  },
  // todo
  created() {
    this.fetchData()
  },
  // todo
  methods: {
    handleCheckAllChange(val) {
      this.edit.item.games = val ? this.allGames : []
      this.isIndeterminate = false
      console.log('>>>>>>done handleCheckAllChange<<<<<<')
    },
    handleCheckedGamesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allGames.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allGames.length
      // console.log('checkedCount:', checkedCount);
      // console.log('>>>>>>done handleCheckedCitiesChange<<<<<<')
    },
    // todo
    getGameLabels(gameIds) {
      if (!Array.isArray(gameIds)) return ''
      // console.log('this.gameIdMap:========>', this.gameIdMap)
      // console.log('gameIds:========>', gameIds)
      return gameIds.map(id => this.gameIdMap[id] || id).join(', ')
    },
    async fetchData() {
      await this.getGameList()
      await this.getData()
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            // this.gameOptions.push({
            //   key: response.Data[i].Gid,
            //   label: response.Data[i].Name
            // })
            this.allGames.push(response.Data[i].Gid + '|' + response.Data[i].Name)
            this.gameNameMap[response.Data[i].Name] = response.Data[i].Gid
            this.gameIdMap[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
      // console.log('finish getGameList,this.gameOptions:', this.gameOptions)
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
    getData() {
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slots_user_pool_data'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.extForm = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const jsonData = JSON.parse(response.Data.Data)
            this.tableData = jsonData.items
            // console.log('this.tableData:============>', this.tableData)
            this.tableDataBak = jsonData.items
            // console.log('response ========>:', response)
            this.reqData = response.Data
            // console.log('getData this.reqData====>:', this.reqData)
            // this.tableData=items

            // console.log('ext-data:', this.extCfg)
            // 设置修改之前数据
            // this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    //  todo
    setDefaultDateRange() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const fmt = d => d.toISOString().slice(0, 10)
      this.dateRange = [fmt(start), fmt(end)]
    },
    handleSearch() {
      const hasDate = this.dateRange?.length === 2
      const hasUserId = this.searchUserId?.trim() !== ''
      // console.log('hasDate:', hasDate)
      // console.log('hasUserId:', hasUserId)
      // console.log('this.dateRange:', this.dateRange)
      // console.log('this.searchUserId:', this.searchUserId)
      if (!hasDate && !hasUserId) {
        this.$message.warning('请输入查询条件')
        return
      }
      // todo
      this.tableData = this.tableDataBak.filter(item => {
        let matchDate = true
        let matchId = true

        if (hasDate) {
          const start = this.Unix(this.dateRange[0])
          const endDate = new Date(this.dateRange[1])
          endDate.setHours(23, 59, 59, 999) // 设置到当天的最后一毫秒
          const end = Math.floor(endDate.getTime() / 1000) // 转为秒级时间戳
          const time = new Date(item.updateAt).getTime()
          console.log('start:', start)
          console.log('this.dateRange[0]:', this.dateRange[0])
          console.log('end  :', end)
          console.log('time :', time)
          // console.log('item.updateAt:', item.updateAt)
          // console.log('时间戳转化后this.formatDate(time):', this.formatDate(time))
          matchDate = time >= start && time <= end
        }
        if (hasUserId) {
          matchId = item.uid + '' === (this.searchUserId.trim())
        }
        // console.log('matchDate:', matchDate)
        // console.log('matchId:', matchId)
        return matchDate && matchId
      })
      // console.log('finish this.tableData:', this.tableData)
      // todo
    },
    // handleImport() {
    //   console.log('导入')
    // },
    openEdit(row) {
      this.dialogTitle = '编辑配置'
      this.edit.editingIndex = this.tableData.indexOf(row)
      // this.editForm = {...row, effectiveRange: [...row.effectiveRange]}
      this.edit.item.amount = row.amount
      this.edit.item.games = this.formatTaxedSlots(row.games)
      this.edit.item.uid = row.uid
      this.edit.item.updateAt = this.formatDate(row.updateAt)
      this.edit.item.updateBy = row.updateBy // todo need??
      const start = new Date(row.validStartAt * 1000)
      const end = new Date(row.validEndAt * 1000)
      this.edit.item.effectiveRange = [start, end]
      //
      this.editDialogVisible = true
      this.isIndeterminate = true
    },
    formatTaxedSlots(gameIds) {
      const formatNames = []
      console.log('formatTaxedSlots(gameIds)中this.gameIdMap:', this.gameIdMap)
      console.log('formatTaxedSlots(gameIds)中gameIds:', gameIds)
      console.log('formatTaxedSlots(gameIds)中this.gameIdMap[158]:', this.gameIdMap[158])
      for (const gameId of gameIds) {
        const str = gameId + '|' + this.gameIdMap[Number(gameId)]
        formatNames.push(str)
      }
      console.log('formatTaxedSlots(gameIds)formatNames:', formatNames)
      return formatNames
    },
    handleCreate() {
      this.dialogTitle = '添加配置'
      this.edit.item = newItem()
      // this.edit.isEdit = false
      this.editDialogVisible = true
      this.isIndeterminate = false
    },
    splitGames(pickGames) {
      const games = []
      for (const game of pickGames) {
        games.push(Number(game.split('|')[0]))
      }
      return games
    },
    saveEdit() {
      if (!this.checkData()) return
      if (this.edit.editingIndex !== null) {
        this.userPoolItem.uid = this.edit.item.uid
        this.userPoolItem.games = this.splitGames(this.edit.item.games)
        this.userPoolItem.amount = this.edit.item.amount
        this.userPoolItem.updateAt = this.Unix(this.edit.item.updateAt)
        this.userPoolItem.updateBy = this.name
        this.userPoolItem.validStartAt = this.Unix(this.edit.item.effectiveRange[0])
        this.userPoolItem.validEndAt = this.Unix(this.edit.item.effectiveRange[1])
        // this.tableData[this.edit.editingIndex] = this.edit.item
        this.$set(this.tableData, this.edit.editingIndex, this.userPoolItem)
        const newTableData = this.tableData
        // this.$refs.compare.SetNewVal(this.tableData)
        this.userPoolCfg.items = newTableData
        this.reqData.Data = JSON.stringify(this.userPoolCfg)
        this.updateRequest(this.reqData)
        //
        // this.$refs.compare.Compare(function (isEdit) {
        //   if (!isEdit) {
        //     Message.error('没有任何修改，不需要提交')
        //     return
        //   }
        //   $this.editSave(newTableData)
        // })
        //
      } else {
        this.createSave(this.edit.item)
      }
      //
      this.getData()
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
        url: 'customizeconfig/update',
        method: 'post',
        data: updateData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          // this.refreshShow()
          //
          this.getData()
          Message.success('操作成功！')
        }
      })
    },
    createSave(postData) {
      console.log('postData==========>:', postData)
      this.userPoolItem.uid = postData.uid
      this.userPoolItem.games = this.splitGames(postData.games)
      this.userPoolItem.amount = postData.amount
      this.userPoolItem.updateAt = this.Unix(postData.updateAt)
      this.userPoolItem.updateBy = this.name
      this.userPoolItem.validStartAt = this.Unix(postData.effectiveRange[0])
      this.userPoolItem.validEndAt = this.Unix(postData.effectiveRange[1])
      this.tableData.push(this.userPoolItem)// todo 中间还使用tableData？？？
      this.userPoolCfg.items = this.tableData
      this.reqData.Data = JSON.stringify(this.userPoolCfg)
      this.updateRequest(this.reqData)
    },
    checkData() {
      if (this.edit.amount < 0) {
        this.$message.error('可发放金额不能为负数')
        return false
      }
      console.log(' this.edit.item:', this.edit.item)
      if (
        this.edit.item.uid === '' ||
        this.edit.item.games.length === 0 ||
        this.edit.item.amount === '' ||
        this.edit.item.updateAt === '' ||
        this.edit.item.effectiveRange === []) {
        this.$message.error('请填写完整')
        return false
      }
      return true
    },
    removeRow(index) {
      this.tableData.splice(index, 1)
      this.userPoolCfg.items = this.tableData
      this.reqData.Data = JSON.stringify(this.userPoolCfg)
      this.updateRequest(this.reqData)
    },
    resetEditForm() {
      this.editForm = {updateAt: '', effectiveRange: [], games: [], uid: '', amount: 0}
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
          sheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1})
            this.resetEditForm()
            json.forEach((row, index) => {
              if (index > 0 && row.length === 5) {
                console.log('row=========>:', row)
                // this.ScatterTriggerPlans.PlayTimesMin = json[1][0]
                // this.ScatterTriggerPlans.PlayTimesMax = json[1][1]
                // this.ScatterTriggerPlans.FreeTimesCompareOperator = json[1][2]
                // this.ScatterTriggerPlans.FreeTimesCompareValue = json[1][3]
                // this.ScatterTriggerPlans.currentConf.push({OddsMin: row[4], OddsMax: row[5], Rates: row[6]})
                const userPoolItem = {}
                userPoolItem.updateAt = today// 当日凌晨0点的时间
                const validRange = this.splitTimeRange(row[1])
                console.log('row[1]:', row[1])
                userPoolItem.validStartAt = this.Unix(validRange[0])
                userPoolItem.validEndAt = this.Unix(validRange[1])
                userPoolItem.games = this.splitGamesName(row[2])
                userPoolItem.uid = row[3]
                userPoolItem.amount = row[4]
                userPoolItem.updateBy = this.reqData.ModifyUser
                if (
                  userPoolItem.updateAt === 0 ||
                  userPoolItem.validStartAt === 0 ||
                  userPoolItem.validEndAt === 0 ||
                  userPoolItem.games.length === 0 ||
                  userPoolItem.uid === 0 ||
                  userPoolItem.amount === 0) {
                  console.log('this.userPoolItem:', userPoolItem)
                  Message.error('导入失败,请检查数据')
                  return
                }
                this.tableData.push(userPoolItem)
              }
            })
            // this.ScatterTriggerPlans.editIndex = undefined//
            this.userPoolCfg.items = this.tableData
            this.reqData.Data = JSON.stringify(this.userPoolCfg)
            this.updateRequest(this.reqData)
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    splitTimeRange(dateStr) {
      return dateStr.replace(/\s+/g, '').split('至')
    },
    splitGamesName(gamesName) {
      const gid = []
      const GName = gamesName.split(',')
      for (let i = 0; i < GName.length; i++) {
        const nameStr = GName[i]
        // eslint-disable-next-line no-empty
        if (nameStr === 'Phoenix') {
          Message.warning('Phoenix存在非唯一gid')
        }
        gid.push(this.gameNameMap[nameStr])
      }
      return gid
    }
  }
}
</script>

<style scoped>
.user-pool-container {
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom:100px;
}
</style>
