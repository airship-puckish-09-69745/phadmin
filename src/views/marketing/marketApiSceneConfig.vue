<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="MarketApiSceneConfig" :env-empty="false" :check="configCheck" :make-content="makeContent" :attr-names="getPublishAttrNames()" :head-attrs="['cfgId']" />
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-descriptions
          class="margin-top"
          :column="1"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px', 'color':'red'}"
          border
        >
          <el-descriptions-item label="场景配置说明：">【当前平台】+【场景ID】+【站点】 组成配置唯一键。</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
      <!--      <el-col :span="4">-->
      <!--        <el-input-->
      <!--          v-model="search"-->
      <!--          size="mini"-->
      <!--          placeholder="输入关键字搜索"-->
      <!--          @input="searchChange"-->
      <!--          @blur="search = search.trim()"-->
      <!--        />-->
      <!--      </el-col>-->
    </el-row>
    <el-row style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
      >
        <el-table-column prop="id" label="ID" sortable="custom" width="80" />
        <el-table-column prop="appId" label="平台ID" />
        <el-table-column prop="site" label="站点" />
        <el-table-column prop="sceneId" label="场景ID（内部用）">
          <template slot-scope="scope">
            {{ getSceneName(scope.row.sceneId) }}
          </template>
        </el-table-column>
        <el-table-column prop="scene" label="场景值" />
        <el-table-column prop="endTime" label="场景有效期" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="modifyUser" label="最后修改人" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <!--            <el-button v-if="scope.row.status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />-->
            <el-button v-if="scope.row.status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-row>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1100px"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="场景配置">
          <el-row>
            <el-col :span="24">
              <el-alert title="场景配置说明：" type="info" :closable="false">
                【当前平台】+【场景ID】+【站点】 组成配置唯一键。
              </el-alert>
            </el-col>
          </el-row>
          <el-row>
            <el-form label-width="220px" size="mini">
              <el-col :span="24">
                <el-form-item label="场景ID（内部用）：" :required="true">
                  <el-select v-model="edit.item.sceneId" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in sceneIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="站点：" :required="true">
                  <MarketApiSiteSelect v-model="edit.item.site" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="场景值：" prop="scene">
                  <el-input v-model="edit.item.scene" maxlength="32" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="场景有效时间（内部展示用）：" prop="EndTime">
                  <el-date-picker v-model="edit.item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="edit.item.remark" maxlength="64" />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>

      </el-tabs>
      <el-row style="margin-top: 10px">
        <el-button type="primary" @click="handleSave()">保存配置</el-button>
      </el-row>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>

import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import Publish from '@/components/Publish/index.vue'
import Compare from '@/components/Compare/index.vue'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import MarketApiSiteSelect from '@/components/MarketApiSiteSelect/index.vue'

const filterMap = {}

function newItem() {
  return {
    id: 0,
    appId: 0,
    sceneId: 0,
    site: '',
    scene: '',
    endTime: 0,
    remark: ''
  }
}

export default {
  components: { Compare, Publish, MarketApiSiteSelect },
  data() {
    return {
      tableData: [],
      deleteData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      search: '',
      edit: {
        isEdit: false,
        visible: false,
        item: newItem(),
        title: '新增'
      },
      env: 'test',
      AttrNames: {
        id: '配置ID',
        appId: '应用',
        sceneId: '场景ID（内部用）',
        site: '站点',
        endTime: '场景值有效期',
        remark: '备注',
        status: '状态'
      },
      // 场景ID（内部用）选项。对应配置： phgames/base/gDefine/market_api.go
      sceneIdOptions: [
        // 常规场景
        { 'value': 1, 'label': '任意游戏投注' },
        { 'value': 2, 'label': '仅限Poker类游戏投注' },
        { 'value': 3, 'label': '仅限Slots类游戏投注' },
        { 'value': 4, 'label': '仅限Tongits游戏投注' },
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' },
        { 'value': 7, 'label': '【圣诞节礼物活动】任意游戏投注' },
        { 'value': 8, 'label': '仅限GZ厅任意游戏投注的投注金【直播抽奖】' },
        { 'value': 9, 'label': '仅限GZ任意游戏投注金【TexasPlus免费赛】' },
        { 'value': 10, 'label': '没有任何限制的返水金【TexasPlus付费赛】' },
        { 'value': 11, 'label': '仅限GZ任意游戏投注金【新手任务】' },
        { 'value': 12, 'label': '仅限GZ任意游戏投注金【摇钱树活动】' },
        { 'value': 13, 'label': '仅限GZ任意游戏投注金【空投活动】' },
        { 'value': 14, 'label': '仅限GZ任意游戏投注金【红包雨活动Poker】' },
        { 'value': 15, 'label': '仅限GZ任意游戏投注金【Tongits免费赛】' },
        { 'value': 16, 'label': '没有任何限制的返水金【Tongits免费赛】' },
        { 'value': 17, 'label': '仅限GZ任意游戏投注金【活动地图】' },
        { 'value': 18, 'label': '仅限GZ任意游戏投注金【Poker专题活动】' },
        { 'value': 19, 'label': 'Tongits自建赛投注金【Tongits自建赛】' },
        { 'value': 20, 'label': '仅限GZ任意游戏投注金【TongitsHunter活动投注金】' },
        { 'value': 21, 'label': '仅限GZ任意游戏投注金【TongitsKingOfPot活动】' },
        { 'value': 22, 'label': 'GP站点的用户在gamezone厅下注【排行榜活动】' },
        { 'value': 23, 'label': '仅限GZ任意游戏投注金【pusoy比赛】' },
        { 'value': 24, 'label': '仅限GZ任意游戏投注金【7日留存活动】' },
        { 'value': 26, 'label': '仅限GZ任意游戏返水金【万圣节活动】' },
        { 'value': 27, 'label': '仅限GZ任意游戏投注金【竖版游戏排行榜活动】' },
        { 'value': 28, 'label': '仅限GZ任意游戏投注金【Poker类排行榜活动】' },
        { 'value': 29, 'label': '仅限GZ任意游戏投注金【聚宝盆活动】' },
        { 'value': 30, 'label': '仅限GZ任意游戏返水金【奖励邮件】' },
        { 'value': 31, 'label': '仅限GZ任意游戏投注金【红包雨活动slot】' },
        { 'value': 32, 'label': '仅限GZ任意游戏投注金【空投活动 solt】' },
        { 'value': 33, 'label': '仅限GZ任意游戏投注金【PokerPlus活动】' },
        { 'value': 34, 'label': '仅限GZ任意游戏投注金【固定反水活动】' },
        { 'value': 35, 'label': '仅限GZ任意游戏投注金【阶梯反水活动】' },
        { 'value': 36, 'label': '仅限GZ任意游戏投注金【海岛寻宝活动BP】' },
        { 'value': 37, 'label': '仅限GZ任意游戏投注金【海岛寻宝活动GP】' }
        // 门票相关场景
      ]
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
  },
  methods: {
    getSceneName(sceneId) {
      for (let i = 0; i < this.sceneIdOptions.length; i++) {
        if (this.sceneIdOptions[i].value === sceneId) {
          return this.sceneIdOptions[i].label
        }
      }
      return '未知场景'
    },
    makeContent(key, addData, delData, editData) {
      return ''
    },
    getPublishAttrNames() {
      // 将首字母改为小写
      const attrNames = {}
      for (const key in this.AttrNames) {
        if (this.AttrNames.hasOwnProperty(key)) {
          const newKey = key.charAt(0).toLowerCase() + key.slice(1)
          attrNames[newKey] = this.AttrNames[key]
        }
      }
      return attrNames
    },
    configCheck() {
      return true
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['sceneId', 'scene'])
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    getList() {
      request({
        url: '/marketapisceneconfig/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'endTime', -1)
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      const deleteList = []
      deleteList.push(ob)
      this.deleteData = deleteList
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/marketapisceneconfig/update/status',
          method: 'post',
          data: {
            id: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            // $this.clientDB.UpdateData({ ID: id, Status: status })
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getPostData() {
      if (this.edit.item.sceneId === 0) {
        Message.error('请选择对应场景')
        return
      }
      if (this.edit.item.scene.trim() === '') {
        Message.error('请输入场景值')
        return
      }
      if (this.edit.item.site === '') {
        Message.error(`请选择对应站点`)
        return
      }
      console.log('get post: ', this.edit.item)
      return this.edit.item
    },
    handleSave() {
      const data = this.getPostData()
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(data)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
          } else {
            $this.updateData(data)
          }
        })
      } else {
        this.createData(data)
      }
    },
    createData(data) {
      request({
        url: '/marketapisceneconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    updateData(data) {
      request({
        url: '/marketapisceneconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    //* *********************** 修改/添加弹框相关 ************************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, row) {
      this.edit.isEdit = bEdit
      this.edit.item = row
      console.log('initFormData: ', this.edit.item)
      if (bEdit) {
        // 设置修改之前数据
        this.$refs.compare.SetOldVal(row)
      }
    },
    handleAdd() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    }
    //* *********************** 修改/添加弹框相关 ************************
  }
}
</script>
