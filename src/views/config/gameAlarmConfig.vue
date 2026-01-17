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
      <el-col :span="15">
        <el-form inline>
          <!--            <el-form-item>-->
          <!--              <el-button type="primary" size="mini" @click="refresh">查询</el-button>-->
          <!--            </el-form-item>-->
        </el-form>

      </el-col>
      <el-col :span="15" />
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加</el-button>
      </el-col>

      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="tableData" v-model="tableData" label-width="150px">
          <el-table

            ref="filterTable"
            :data="tableData"
            stripe
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column
              prop="Gid"
              label="游戏"
            >
              <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.Gid == item.key ? item.label : "") }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="OnlineUser"
              label="最少人数"
            />
            <el-table-column
              prop="OneMinuteRatio"
              label="低于前一分钟告警%"
            />
            <el-table-column
              prop="FiveMinuteRatio"
              label="低于前五分钟告警%"
            />
            <el-table-column
              prop="Ignore"
              label="是否忽略"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.Ignore"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="true"
                  :inactive-value="false"
                  @change="editIgnore(scope.$index,scope.row)"
                />
                <el-form-item v-model="scope.row.is_return" label-width="0" />
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>
          <br>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
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
    <!--对比组件-->
    <compare ref="compare" />

    <el-dialog
      title="选择游戏"
      :visible.sync="selectGameVisible"
      width="650px"
    >
      <el-form label-width="150px">
        <el-form-item label="游戏">
          <el-select v-model="item.Gid" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人数">
          <el-input v-model.number="item.OnlineUser" size="mini" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="低于前一分钟%警报">
          <el-input v-model.number="item.OneMinuteRatio" size="mini" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="低于前五分钟%警报">
          <el-input v-model.number="item.FiveMinuteRatio" size="mini" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="是否忽略">
          <el-switch
            v-model="item.Ignore"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="showBtn==0" type="primary" @click="addGameItem">确定</el-button>
          <el-button v-if="showBtn==1" type="primary" @click="saveEdit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import { copyObj } from 'codemirror/src/util/misc'
import { $libShow, ClientTableData } from '@/utils/common'

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },

  data() {
    return {
      form: {},
      postData: {},
      subKey: 'game_alarm_config',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      channelOptions: [
        // {key: "0", label: '请选择'},
        { key: 'Dev', label: 'Dev' },
        { key: 'BP', label: 'BP' },
        { key: 'AP', label: 'AP' },
        { key: 'GP', label: 'GP' },
        //{ key: 'PG', label: 'PG' } 2025-12-22去除PG
      ],
      isReturnOptions: [
        { key: 0, label: '否' },
        { key: 1, label: '是' }
      ],
      idx: 0,
      libShow: $libShow,
      item: {
        Gid: 0,
        Ignore: false,
        OnlineUser: 0,
        OneMinuteRatio: 0,
        FiveMinuteRatio: 0
      },
      gameOptions: [],
      dialogGameOptions: [],
      selectGameVisible: false,
      showBtn: 0,
      oldData: {},
      selectedGid: 0
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {
    editIgnore(idx, row) {
      const cfg = {}
      copyObj(row, cfg)
      this.tableData[idx].Ignore = cfg.Ignore
      this.tableData.splice(0, 0)
    },
    refresh() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },

    newItem() {
      return this.item
    },
    addOne() {
      this.item = {
        Gid: 0,
        Ignore: false,
        OnlineUser: 0,
        OneMinuteRatio: 0,
        FiveMinuteRatio: 0
      },
      this.showBtn = 0
      this.selectGameVisible = true
    },
    addGameItem() {
      if (!this.checkDuplicate(this.item)) {
        Message.error('已存在相同游戏！')
        return
      }

      this.tableData.push(this.item)
      this.selectGameVisible = false
    },
    editRow(idx, row) {
      this.idx = idx
      this.item.Ignore = row.Ignore
      this.item.OnlineUser = row.OnlineUser
      this.item.OneMinuteRatio = row.OneMinuteRatio
      this.item.FiveMinuteRatio = row.FiveMinuteRatio
      this.item.Gid = row.Gid
      this.showBtn = 1
      this.selectGameVisible = true
    },
    delRow(idx, row) {
      this.tableData.splice(idx, 1)
    },
    saveEdit() {
      if (!this.checkDuplicate(this.item, this.idx)) {
        Message.error('已存在相同游戏！')
        return
      }
      var parse = JSON.parse(JSON.stringify(this.item))
      this.tableData[this.idx] = parse
      this.selectGameVisible = false
      this.tableData.splice(0, 0)
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || []
          $this.postData = response.Data || []
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            console.log('cccc', cfg)
            this.clientDB = new ClientTableData(cfg, 10, filterMap, 'ID', -1)
            this.$refs.compare.SetOldVal(response.Data)
            this.refresh()
          }
        }
      })
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refresh()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refresh()
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)

      this.postData.Data = JSON.stringify(cfg)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.postData)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const cfg = []
      for (const i in this.tableData) {
        const item = {}
        copyObj(this.tableData[i], item)
        item.Ignore = !(item.Ignore === 0 || item.Ignore === false)
        cfg.push(item)
      }
      return cfg
    },

    checkDuplicate(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === this.idx && this.tableData[i].Gid === data.Gid) {
          continue
        }
        if (this.tableData[i].Gid === data.Gid) {
          return false
        }
      }
      return true
    },
    updateDuplicate(newData, oldData) {

    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Scene
            })
          }
        }
      })
    }
  }
}
</script>
