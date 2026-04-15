<template>
  <div class="app-container">
    <publish
      primary-key="Volume"
      :key-id="getFullKey(this.subKey)"
      :env-empty="false"
      compare-type="Object"
      :attr-names="AttrNames"
    />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-row :gutter="10" style="margin-top: 30px" type="flex" align="middle">
        <el-col :span="10">
          <el-button type="primary" size="mini" @click="openAddDialog">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="AppId" prop="AppId" width="80" />
        <el-table-column
          label="AppName"
          :formatter="formatAppName"
          width="250"
        />
        <el-table-column
          label="下注值"
          :formatter="formatBetList"
        />

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              @click="openEditDialog(scope.row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-col :offset="16" :span="8">
      <div class="block">
        <el-pagination
          :current-page="clientDB.GetPage().GetCurrentPage()"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="clientDB.GetPage().GetPageNum()"
          layout="total, sizes, prev, pager, next, jumper"
          :total="clientDB.GetPage().GetTotalCount()"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-col>

    <el-dialog
      title="添加新配置"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddDialog"
    >
      <el-form :model="item" label-width="90px">
        <el-form-item label="请选择 App">
          <el-select
            v-model="item.AppId"
            multiple
            placeholder="请选择 AppId"
            :filterable="true"
            style="width: 100%;"
          >
            <!-- 过滤掉表格中已经存在的 AppId -->
            <el-option
              v-for="opt in addAppOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="下注值">
          <el-input
            v-model="item.BetListInput"
            placeholder="设置下注值（多个值用逗号分隔）"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddDialog">取消</el-button>
        <el-button type="primary" @click="addDataToTable">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑配置"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditDialog"
    >
      <el-form :model="editItem" label-width="90px">

        <!-- App：静态展示（不能改） -->
        <el-form-item label="App">
          <el-input
            v-model="editItem.AppLabel"
            disabled
            style="width: 100%;"
          />
        </el-form-item>

        <!-- 下注值：可编辑 -->
        <el-form-item label="下注值">
          <el-input
            v-model="editItem.BetListInput"
            placeholder="多个值用逗号分隔"
            style="width: 100%;"
          />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditDialog">取消</el-button>
        <el-button type="primary" @click="setData">保存</el-button>
      </span>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import { $libShow, ClientTableData } from '@/utils/common'
import { createCustomize, getCustomize, updateCustomize } from '@/api/custome_configV2'
import store from '@/store'

const filterMap = {}

export default {
  components: { Compare, Publish, MoneyInput },

  data() {
    return {
      postData: [],
      subKey: 'slots_betlist_app_cfg',
      AttrNames: {
        types: { Data: 'jsonString' }
      },
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libShow: $libShow,
      cfg: [],
      appOptions: [],
      addDialogVisible: false,
      item: {
        AppId: [],
        BetList: [],
        BetListInput: ''
      },
      addAppOptions: [],
      editDialogVisible: false,
      editItem: {
        AppId: null,
        AppLabel: '',
        BetListInput: '',
        BetList: []
      }
    }
  },
  async created() {
    await this.getAppInfos()
    this.getData()
  },
  methods: {
    refresh() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refresh()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refresh()
    },
    delRow(idx, row) {
      this.clientDB.DelData2('AppId', this.tableData[idx].AppId)
      this.refresh()
    },
    openAddDialog() {
      this.addDialogVisible = true
    },
    resetAddDialog() {
      this.item = { AppId: [], BetList: [], BetListInput: '' }
      this.addDialogVisible = false
    },
    addDataToTable() {
      if (this.item.AppId.length === 0 || !this.item.BetListInput) {
        Message.error('请填写所有必填项！')
        return
      }
      if (this.postData.length === 0) {
        Message.error('请创建至少1个任意App的配置项！')
        return
      }

      // 将输入的字符串转换为数组，并放大1000
      this.item.BetList = this.item.BetListInput
        .split(',')
        .map(val => val.trim())
        .filter(val => val !== '')
        .map(val => Number(val) * 1000) // 转成数字并放大1000

      // 创建一个用于存储所有请求的 Promise 数组
      const createPromises = []

      // 遍历 AppId，生成请求的 Promise
      for (const o of this.item.AppId) {
        const form = JSON.parse(JSON.stringify(this.postData[0]))
        form.AppId = o
        form.Data = JSON.stringify({
          AppId: o,
          BetList: this.item.BetList
        })

        // 将异步请求包装为 Promise 并加入到 createPromises 数组中
        const promise = createCustomize(form).then(response => {
          if (response.RetCode === 0) {
            console.log('保存成功', o)
          }
        })

        createPromises.push(promise)
      }

      // 等待所有请求完成
      Promise.all(createPromises).then(() => {
        // 所有请求完成后执行的操作
        this.resetAddDialog()
        this.getData()
      })
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    async getData() {
      if (this.appOptions.length === 0) {
        console.log('No appOptions available')
        return
      }

      this.postData = []
      this.cfg = []

      const tasks = this.appOptions.map(o => {
        return getCustomize(this.subKey, o.value).then(response => {
          if (response.RetCode === 0) {
            this.postData.push(response.Data || [])

            if (response.Data && response.Data.Data !== '') {
              try {
                const cfg = JSON.parse(response.Data.Data)
                this.cfg.push(cfg)
              } catch (e) {
                console.error('JSON parse error:', e)
              }
            }
          }
        })
      })
      await Promise.all(tasks)

      this.clientDB = new ClientTableData(this.cfg, 10, filterMap, 'AppId', -1)
      this.addAppOptions = this.filteredAppOptions()
      this.refresh()
    },
    getAppInfos() {
      return request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    formatAppName(row) {
      const appOption = this.appOptions.find(option => option.value === row.AppId)
      return appOption ? appOption.label : '未知'
    },
    formatBetList(row) {
      if (Array.isArray(row.BetList)) {
        return row.BetList
          .map(item => item / 1000)
          .join(',')
      }
      return ''
    },
    filteredAppOptions() {
      const existingAppIds = this.cfg.map(item => item.AppId)
      return this.appOptions.filter(opt => !existingAppIds.includes(opt.value))
    },
    openEditDialog(row) {
      this.$refs.compare.SetOldVal(JSON.stringify(row))
      const app = this.appOptions.find(o => o.value === row.AppId)

      this.editItem = {
        AppId: row.AppId,
        AppLabel: app ? app.label : row.AppId,
        BetListInput: Array.isArray(row.BetList)
          ? row.BetList.map(v => v / 1000).join(',')
          : '',
        BetList: row.BetList || []
      }

      this.editDialogVisible = true
    },
    resetEditDialog() {
      this.editDialogVisible = false
      this.editItem = {
        AppId: '',
        AppLabel: '',
        BetListInput: '',
        BetList: []
      }
    },
    setData() {
      if (!this.editItem.BetListInput) {
        Message.error('请输入下注值')
        return
      }

      // 转换输入为数字数组并放大1000
      const betList = this.editItem.BetListInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v !== '')
        .map(v => Number(v) * 1000)

      // 找到对应 AppId 的 postData 对象
      const postDataItem = this.postData.find(item => {
        try {
          const dataObj = JSON.parse(item.Data)
          return dataObj.AppId === this.editItem.AppId
        } catch (e) {
          return false
        }
      })

      if (!postDataItem) {
        Message.error('未找到对应配置，无法修改')
        return
      }

      // 更新 Data
      const newVal = JSON.stringify({
        AppId: this.editItem.AppId,
        BetList: betList
      })
      postDataItem.Data = newVal

      // 调用 compare 做差异检查
      this.$refs.compare.SetNewVal(newVal)
      this.$refs.compare.Compare(isEdit => {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        updateCustomize(postDataItem).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
            this.resetEditDialog()
            this.updateTableData(postDataItem)
          }
        })
      })
    },
    updateTableData(updatedData) {
      const rowIndex = this.tableData.findIndex(row => row.AppId === updatedData.AppId)

      if (rowIndex !== -1) {
        this.tableData[rowIndex].BetList = JSON.parse(updatedData.Data).BetList
      }
    }
  }
}
</script>
