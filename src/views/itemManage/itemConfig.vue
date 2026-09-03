<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="id" key-id="PropsConfig" :env-empty="false" :make-content="makeContent" :attr-names="AttrNames" :head-attrs="['id']" compare-type="Array" />
    </el-row>
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
        <el-form-item label="道具类型：" :required="true">
          <el-select v-model="form.itemOfType" style="width: 200px;" placeholder="请选择道具分类">
            <el-option label="全部" :value="0" />
            <el-option
              v-for="item in ITEM_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="isTicketPropNew(form.itemOfType)" label="APPID：" :required="true">
          <el-select v-model="form.appId" placeholder="请选择" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option
              v-for="item in APPID_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <span style="display: inline-flex; align-items: flex-start; vertical-align: top;">
          <el-button size="mini" type="primary" @click="selectPageData">查询</el-button>
          <span style="color: red; margin-left: 40px; font-size: 14px; line-height: 1.6;">
            最新营销门票分动态配置时间 +  固定配置时间(可以具体指定那天过期)<br>
            厅方传时间 + MMS配置固定时间 最后使用 MMS配置固定时间<br>
            厅方传时间 + MMS配置动态时间 最后使用 厅方传时间<br>
            厅方不传时间 + MS配置固定时间 最后使用 MMS配置固定时间<br>
            厅方不传时间 + MMS配置动态时间 最后使用 MMS配置动态时间
          </span>
        </span>
      </el-form>

    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button size="mini" icon="el-icon-plus" @click="showForm(0)">添加道具</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >

        <el-table-column
          prop="id"
          label="道具ID"
          sortable
        />

        <el-table-column
          prop="item_name"
          label="道具名称"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column prop="show_name" label="后台名称" width="200">
          <template slot-scope="scope">
            {{ getItemShowName(scope.row.item_extra) }}
          </template>
        </el-table-column>

        <el-table-column prop="item_type" label="道具分类" width="150">
          <template slot-scope="scope">
            {{ getItemTypeName(scope.row.item_type) }}
          </template>
        </el-table-column>

        <el-table-column prop="image" label="ICON" width="150">
          <template slot-scope="{row}">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image"
              lazy
            />
          </template>
        </el-table-column>
        <el-table-column prop="item_cost" label="道具价值" width="100">
          <template slot-scope="scope">
            {{ getItemCost(scope.row.id) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="show_text"
          label="扩展信息"
          width="300"
        >
          <template slot-scope="scope">
            <span v-if="isAvatarFrameProp( scope.row.item_type)">
              品质:{{ getQualityName(scope.row.quality) }} 可用时间:{{ getShowText(scope.row.id) }} 描述:这是一个头像框
            </span>
            <span v-if="isFreeSpin(scope.row.item_type)">
              <el-link
                type="primary"
                style="font-size: 13px;"
                @click="toggleSlotFreeSpinDetail(scope.row)"
              >
                {{ slotFreeSpinDetailMap[scope.row.id] ? '收起详情' : '点击查看详情' }}
              </el-link>
              <template v-if="slotFreeSpinDetailMap[scope.row.id]">
                <br>
                <span>
                  games:
                  <el-tag
                    v-for="gameName in getSlotFreSpinPropDescReturnGameNames(scope.row.item_extra)"
                    :key="gameName"
                    style="margin-right: 5px;"
                  >
                    {{ gameName }}
                  </el-tag>
                </span>
                <br>
                betAmount:{{ getSlotFreSpinPropDescReturnBetAmount(scope.row.item_extra) }}
              </template>
            </span>
            <span v-if="isTicketPropNew(scope.row.item_type)">
              APPID:  {{getAppIdName(scope.row.item_extra) }}
            </span>
          </template>

        </el-table-column>

        <el-table-column
          prop="modifier"
          label="操作人"
        />

        <el-table-column
          prop="sort"
          label="排序"
        />

        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            {{ getStatusName(scope.row.status) }}
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" @click="showForm(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status===2" size="mini" type="success" @click="handleUpdate(scope.row.id)">上架</el-button>
            <!-- <el-button v-if="scope.row.status===1"  size="mini" type="danger" @click="handleUpdate(scope.row.id)">下架</el-button> -->
            <el-button v-if="scope.row.status===1 && !isTicketPropNew(scope.row.item_type)" size="mini" type="danger" @click="handleUpdate(scope.row.id)">下架</el-button>
            <!-- <el-button v-if="scope.row.status===2" size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button> -->
            <el-button v-if="itemEnv==='development' &&  scope.row.status===2" size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        <span class="pageSizeInput" style="padding-right: 10px">
          当前页：{{ page }}/{{ Math.ceil(total/limit) }}
        </span>
        </el-pagination>
      </div>
    </el-row>
    <el-dialog
      :title="editForm.title"
      :visible.sync="editForm.visable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="900px"
    >
      <el-form :model="editForm.data" label-width="200px" size="mini">
        <fieldset>
          <legend>道具信息</legend>
          <el-form-item label="道具名称：" :required="true">
            <el-input v-model="editForm.data.itemName" style="width: 200px;" placeholder="请填写道具名称" />
          </el-form-item>

          <el-form-item label="后台名称：" :required="true">
            <el-input v-model="editForm.itemExtra.showName" style="width: 200px;" placeholder="请填写后台名称" />
          </el-form-item>

          <el-form-item v-if="isTicketPropNew(editForm.data.itemType)" label="道具价值：" :required="true">
            <el-input v-model.number="editForm.data.itemCost" style="width: 200px;" placeholder="请填写道具价值" />
          </el-form-item>

          <el-form-item v-if="isAvatarFrameProp(editForm.data.itemType)" label="品质：" :required="true">
            <el-select v-model="editForm.data.quality" style="width: 200px;" :disabled="!editForm.isAdd" placeholder="请选择道具品质分类">
              <el-option
                v-for="item in qualityTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="道具描述：" :required="true">
            <el-input v-model="editForm.data.describe" style="width: 400px;" placeholder="请填写道具描述" />
          </el-form-item>

          <el-form-item label="道具类型：" :required="true">
            <el-select v-model="editForm.data.itemType" style="width: 200px;" :disabled="!editForm.isAdd" placeholder="请选择道具分类">
              <el-option
                v-for="item in ITEM_TYPE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="isEffectProp(editForm.data.itemType)" label="道具特效：" :required="true">
            <el-select v-model="editForm.itemExtra.effectType" style="width: 200px;" placeholder="请选择道具特效">
              <el-option
                v-for="item in effectTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isEffectProp(editForm.data.itemType)" label="过期时间：" :required="true">
            <el-date-picker v-model="editForm.data.expireTime" type="datetime" :disabled="!editForm.isAdd" placeholder="选择过期时间" value-format="timestamp" />
          </el-form-item>
          <el-form-item v-if="[7,8,9].includes(editForm.data.itemType)" label="APPID" :required="true">
            <el-select v-model="editForm.itemExtra.appId" style="width: 200px;" :disabled="!editForm.isAdd"   placeholder="请选择道具对应的APPID">
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="isFreeSpin(editForm.data.itemType)" label="游戏类型：" :required="true">
            <el-select v-model="editForm.itemExtra.specialAttr" style="width: 200px;" :disabled="!editForm.isAdd" placeholder="请选择游戏类别" @change="changeCategory()">
              <el-option
                v-for="item in getSubAttrByPropType(PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-row>
            <el-col :span="11">
              <el-form-item v-if="isFreeSpin(editForm.data.itemType) && editForm.itemExtra.specialAttr === 1" label="关联游戏:" :required="true">
                <el-select v-model="editForm.itemExtra.gid" placeholder="请选择" size="mini"  multiple filterable @change="setSlotBetAmountStyle(editForm.itemExtra.specialAttr)">
                  <el-option v-for="item in SLOT_GAME_CONFIG" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                </el-select>
              </el-form-item>

              <el-form-item v-if="isFreeSpin(editForm.data.itemType) && editForm.itemExtra.specialAttr === 2" label="关联游戏:" :required="true">
                <el-select v-model="editForm.itemExtra.gid" placeholder="请选择" size="mini"  multiple @change="setSlotBetAmountStyle(editForm.itemExtra.specialAttr)">
                  <el-option v-for="item in BETTING_GAME_CONFIG" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item v-if="isFreeSpin(editForm.data.itemType)" label="betAmount:" :required="true">
                <el-select v-model="editForm.itemExtra.betAmount" placeholder="请选择" size="mini" :disabled="!editForm.isAdd">
                  <el-option v-for="item in slotDefaultBetAmount" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item v-if="!isFreeSpin(editForm.data.itemType)" label="排序：" :required="false">
            <el-input v-model.number="editForm.data.sort" style="width: 200px;" placeholder="请填写排序id" />
          </el-form-item>

          <el-form-item label="道具ICON：" :required="false">
            <ImagePicker v-model="editForm.data.image" />
          </el-form-item>
        </fieldset>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveItemConfig()">保存道具配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>

</template>
<script>
import store from '@/store'
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { $libDate, $libShow } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { ITEM_TYPE_OPTIONS, ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS,APPID_OPTIONS } from '@/utils/options'
import { BETTING_GAME_CONFIG } from '@/utils/prop'

export default {
  name: 'PropsConfig',
  components: { Compare, Publish, DateTimeShow, ImagePicker },
  data() {
    return {
      ITEM_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      BETTING_GAME_CONFIG,
      SLOT_GAME_CONFIG:[],
      APPID_OPTIONS,
      freeSpinGameMap: {},
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,
      itemEnv: process.env.NODE_ENV, // 项目环境

      //道具子类型
      ItemSubAttrCfg: [
        { 'value': 1, 'label': 'Slot游戏', disabled: false,"propType":PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN }, //freeSpin
        { 'value': 2, 'label': '街机类游戏', disabled: false,"propType":PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN } //freeSpin
      ],

      statusCfgs: [
        { 'value': 1, 'label': '上架' },
        { 'value': 2, 'label': '下架' }
      ],
      qualityTypeCfgs: [
        { 'value': 1, 'label': 'S', disabled: false },
        { 'value': 2, 'label': 'A', disabled: false },
        { 'value': 3, 'label': 'B', disabled: false },
        { 'value': 4, 'label': 'C', disabled: false },
        { 'value': 5, 'label': '无品质', disabled: false }
      ],
      effectTypeCfgs: [
        { 'value': 1, 'label': '礼炮', disabled: false },
        { 'value': 2, 'label': '吹龙', disabled: false },
        { 'value': 3, 'label': '蛋糕', disabled: false },
        { 'value': 4, 'label': '香槟', disabled: false },
        { 'value': 5, 'label': '派对帽', disabled: false },
        { 'value': 6, 'label': '皮纳塔', disabled: false },
      ],
      slotDefaultBetAmount: [
        // 样式 { 'value': 300, 'label': 'bet-0.3', disabled: false },
      ],

      raw: {},
      tableData: [],
      deleteData: [],
      limit: 100,
      total: 0,
      page: 1,
      form: {
        itemOfType: 0,
        appId:0,
      },
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        data: {
          ID: 0,
          itemName: '',
          showName: '',
          itemCost: 0,
          itemType: 0,
          describe: '',
          expireTime: '',
          image: '',
          sort: 0,
          status: 0,
          quality: 0,
          timeType: []
        },
        itemExtra: {
          specialAttr: 0,
          showName: '',
          gid: [],
          betAmount: 0,
          effectType: 1
        },
        itemEndDate: $libDate.GetDayBegin(new Date().setSeconds(0))
      },

      AttrNames: {
        propName: '道具名称',
        propCost: '道具价值',
        propType: '道具分类',
        describe: '道具描述',
        image: 'ICON链接',
        expireTime: '过期时间',
        sort: '排序',
        propStatus: '上架状态',
        createTime: '创建时间',
        id: '道具ID',
        propExtra: '拓展信息'
      },
      slotBetAmountCfg: new Map(), // slot 下注数值
      slotFreeSpinDetailMap: {} // free spin 道具詳情展開狀態
    }
  },
  computed: {
    PROP_TYPE_OPTIONS() {
      return PROP_TYPE_OPTIONS
    }
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.getSlotBetAmountCfg()
  },
  async mounted() {
    await this.getSlotGameConfig()
    await this.getList()
  },
  methods: {

    async getList() {
      try {
        const response = await request({
          url: '/propsconfig/props/config/list',
          method: 'get',
          data: {
            Env: this.env,
            PageNum: this.page,
            PageSize: this.limit,
            PropType: this.form.itemOfType
          }
        })
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.tableData = []
            if(this.form.appId > 0){ // 如果appId大于0，则只显示该appId的道具
              this.tableData = this.getSuitedItemList(objs.list, this.form.appId)
              this.total = this.tableData.length
            }else{
              this.tableData = objs.list
              this.total = objs.total
            }
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      } catch (error) {
        console.error('获取道具列表失败:', error)
        this.total = 0
        this.tableData = []
      }
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    formatNum(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    showForm(id) {
      if (id == 0) {
        this.editForm.title = '新增道具配置'
        this.editForm.data = {
          ID: 0,
          itemName: '',
          showName: '',
          itemCost: '',
          itemType: '',
          describe: '',
          image: '',
          expireTime: '',
          sort: 0,
          status: 0,
          quality: 0,
          timeType: []
        }
        this.editForm.itemExtra = {
          specialAttr: 0,
          showName: '',
          gid: [],
          betAmount: 0,
          appId: 1000002,
          effectType: 1
        }
        this.checkAll()
        this.editForm.itemEndDate = $libDate.GetDayBegin(new Date().setSeconds(0))
        this.editForm.visable = true
        this.editForm.isAdd = true
      } else {
        this.editForm.title = '编辑道具配置'
        let editData = {}
        this.editForm.isAdd = false
        this.editForm.visable = true

        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === id) {
            editData = this.tableData[i]
            break
          }
        }
        if (typeof editData.id === 'undefined') {
          Message.error('道具配置不存在')
          return
        }

        const time_type = JSON.parse(editData.time_type)
        if (editData.item_extra) {
          this.editForm.itemExtra = {
            effectType: 1,
            ...JSON.parse(editData.item_extra)
          }
        }
        this.editForm.data = {
          ID: editData.id,
          itemName: editData.item_name,
          itemCost: editData.item_cost,
          itemType: editData.item_type,
          describe: editData.item_describe,
          image: editData.image,
          expireTime: editData.expire_time * 1000,
          sort: editData.sort,
          status: editData.status,
          quality: editData.quality,
          timeType: time_type
        }
        this.editForm.itemEndDate = editData.expire_time * 1000
      }
    },
    getItemTypeName(item_type) {
      const found = this.ITEM_TYPE_OPTIONS.find(item => item.value === item_type);
      return found ? found.label : '';
    },

    //获取道具价值
    getItemCost(item_id) {
      const item = this.tableData.find(item => item.id === item_id);
      if (!item) return 0;
      const itemType = item.item_type;
      if (this.isTicketPropNew(itemType)) {
        return item.item_cost || 0;
      }
      if (this.isFreeSpin(itemType)) {
        if (item.item_extra && item.item_extra.trim().length > 0) {
          try {
            const extra = JSON.parse(item.item_extra);
            return (extra.betAmount || 0) / 1000;
          } catch (e) {
            console.warn('解析 item_extra 失败:', item_id, e);
            return 0;
          }
        }
        return 0;
      }
      return 0;
    },
    getItemShowName(item_type) {
      if (item_type === 'null') {
        return ''
      }
      const exitData = JSON.parse(item_type)
      if (exitData.showName === null) {
        return ''
      }
      return exitData.showName
    },

    getStatusName(status) {
      const found = this.statusCfgs.find(item=> item.value === status)
      return found ? found.label : ''
    },

    getQualityName(id) {
      const found = this.qualityTypeCfgs.find(item=> item.value === id);
      return found ? found.label : ''
    },
    initFreeSpinGameMap() {
      for (let i = 0; i < this.SLOT_GAME_CONFIG.length; i++) {
        this.freeSpinGameMap[this.SLOT_GAME_CONFIG[i].value] = this.SLOT_GAME_CONFIG[i].label
      }
      for (let i = 0; i < this.BETTING_GAME_CONFIG.length; i++) {
        this.freeSpinGameMap[this.BETTING_GAME_CONFIG[i].value] = this.BETTING_GAME_CONFIG[i].label

      }
      //console.log("3333 initFreeSpinGameMap ",this.freeSpinGameMap)
    },
    getSlotFreSpinPropDescReturnGameNames(itemExtra) {

      const names = []
      const extraData = JSON.parse(itemExtra)
      if (!extraData.gid || extraData.gid.length <= 0) return names
      for (let i = 0; i < extraData.gid.length; i++) {
        names.push(this.freeSpinGameMap[extraData.gid[i]] || ('未知游戏-' + extraData.gid[i]))
      }
      return names
    },

    getSlotFreSpinPropDescReturnBetAmount(itemExtra) {
      try {
        return JSON.parse(itemExtra || '{}').betAmount/1000;
      } catch {
        return 0;
      }
    },

    toggleSlotFreeSpinDetail(row) {
      const id = row.id
      const curr = this.slotFreeSpinDetailMap[id] || false
      this.$set(this.slotFreeSpinDetailMap, id, !curr)
    },

    getShowText(id) {
      var showTextName = ''
      let editData = {}
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          editData = this.tableData[i]
          break
        }
      }
      const time_type = JSON.parse(editData.time_type)
      for (var i = 0; i < this.ITEM_DAY_TYPE_OPTIONS.length; i++) {
        for (var j = 0; j < time_type.length; j++) {
          if (this.ITEM_DAY_TYPE_OPTIONS[i].value === time_type[j]) {
            showTextName += this.ITEM_DAY_TYPE_OPTIONS[i].label
            if (j < time_type.length - 1) {
              showTextName += ','
            }
          }
        }
      }
      return showTextName
    },

    checkAll() {
      // 默认全选
      for (var i = 0; i < this.ITEM_DAY_TYPE_OPTIONS.length; i++) {
        this.editForm.data.timeType.push(this.ITEM_DAY_TYPE_OPTIONS[i].value)
      }
    },
    handleUpdate(id) {
      let editData = {}
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          editData = this.tableData[i]
          break
        }
      }
      // 上架 对过期时间判断
      if (editData.status === 2 &&  this.isAvatarFrameProp && editData.expire_time < Math.floor(Date.now() / 1000)) {
        Message.error('当前道具已经过期不能再上架')
        return
      }
      const strMsg = '您确定要将' + editData.item_name + '配置'
      const currMsg = editData.status === 1 ? '下架' : '上架'
      this.$confirm(strMsg + currMsg + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editData.status = editData.status === 1 ? 2 : 1
        request({
          url: '/propsconfig/props/config/update',
          method: 'POST',
          data: {
            Env: this.env,
            ID: editData.id,
            ItemName: editData.item_name,
            ItemCost: editData.item_cost,
            ItemType: editData.item_type,
            Describe: editData.item_describe,
            Image: editData.image,
            ExpireTime: editData.expire_time,
            Sort: editData.sort,
            Status: editData.status,
            Quality: editData.quality,
            TimeType: editData.time_type,
            ItemExtra: editData.item_extra
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const showMsg = currMsg + '成功！'
            Message.success(showMsg)
            this.getList()
          } else {
            const errMsg = currMsg + '失败！'
            Message.error(errMsg + response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    makeContent(key, addData, delData, editData) {
      // console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      const change = new Set()
      const add = new Set()
      const del = new Set()
      // 新增取newVal
      if (addData) {
        for (var i = 0; i < addData.length; i++) {
          for (const ele of addData[i]) {
            add.add(ele.newVal)
          }
        }
      }
      if (delData) {
        for (var i = 0; i < delData.length; i++) {
          for (const ele of delData[i]) {
            del.add(ele.oldVal)
          }
        }
      }
      if (editData) {
        // console.log("editData",editData)
        for (const edit of editData) {
          change.add(edit.Head.id)
          console.log(edit.Head.id)
        }
      }
      if (change.size + del.size + add.size === 0) {
        console.log('no change return')
        return '没有修改!'
      }

      let str = ''
      let has = false
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---'); has = true
          str += `\r\n修改:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
        if (add.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---\r\n'); has = true
          str += `\r\n新增:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
      }
      for (let i = 0; i < this.deleteData.length; i++) {
        const row = this.deleteData[i]
        if (del.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---\r\n'); has = true
          str += `\r\n删除:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
      }
      return str
    },
    handleDelete(id) {
      this.$confirm('您确定要将该道具删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        const deleteList = []
        for (const key in this.editForm.tableData) {
          if (this.editForm.tableData[key].id === id) {
            continue
          }
          newList.push(this.editForm.tableData[key])
        }
        for (const key in this.tableData) {
          if (this.tableData[key].id === id) {
            deleteList.push(this.tableData[key])
          }
        }
        this.editForm.tableData = newList
        this.deleteData = deleteList
        request({
          url: '/propsconfig/props/config/delete',
          method: 'post',
          data: {
            Env: this.env,
            ID: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除道具成功')
            this.getList()
          } else {
            Message.error('删除道具失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    dataUpdateRequest(isCreate, expireTime, timeList) {
      const showMsg = isCreate ? '新增道具配置成功' : '编辑道具配置成功！'
      const errMsg = isCreate ? '新增道具配置失败！' : '修改道具配置失败！'
      const url = isCreate ? '/propsconfig/props/config/create' : '/propsconfig/props/config/update'

      request({
        url: url,
        method: 'POST',
        data: {
          Env: this.env,
          ID: this.editForm.data.ID,
          ItemName: this.editForm.data.itemName,
          ItemCost: this.editForm.data.itemCost,
          ItemType: this.editForm.data.itemType,
          Describe: this.editForm.data.describe,
          Image: this.editForm.data.image,
          ExpireTime: expireTime,
          Sort: this.editForm.data.sort,
          Status: this.editForm.data.status,
          Quality: this.editForm.data.quality,
          TimeType: timeList,
          ItemExtra: JSON.stringify(this.editForm.itemExtra),
          ShowName: this.editForm.data.showName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
        } else {
          Message.error(errMsg + response.Data)
        }
      })
    },

    saveItemConfig() {
      if (!this.configCheck()) {
        return
      }
      let expireTime = 0
      expireTime = this.editForm.data.expireTime ?? (Math.floor(this.editForm.itemEndDate))
      expireTime = expireTime / 1000

      const timeList = JSON.stringify(this.editForm.data.timeType)
      var create  = false
      if (this.editForm.data.ID === 0) {
        this.editForm.data.status = 1
        create = true
      }
      this.dataUpdateRequest(create, expireTime, timeList)
    },
    selectPageData() {
      this.page = 1
      this.getList()
    },

    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },

    slotFreeSpinPropReset() {
      this.editForm.itemExtra.betAmount = 0
      this.editForm.itemExtra.gid = []
    },

    getSlotBetAmountCfg() {

      // 根据free spin道具的子类型(1:slot类 2: 下注类)
      this.slotBetAmountCfg.set(1, [300, 1000, 2000, 3000, 5000,10000])
      this.slotBetAmountCfg.set(2, [1000, 2000, 3000, 5000, 10000])
    },
    // 设置样式
    setSlotBetAmountStyle(indexId) {
      const oneBetAmountCfg = this.slotBetAmountCfg.get(indexId)
      console.log(' oneBetAmountCfg ', indexId, oneBetAmountCfg)
      // 样式 { 'value': 300, 'label': 'bet-0.3', disabled: false },
      this.slotDefaultBetAmount = []
      for (let i = 0; i < oneBetAmountCfg.length; i++) {
        const amount = oneBetAmountCfg[i] / 1000
        this.slotDefaultBetAmount.push({ 'value': oneBetAmountCfg[i], 'label': 'bet-' + amount.toString(), disabled: false })
      }
    },
    // 切换类别
    changeCategory() {
      this.editForm.itemExtra.gid = []
    },
    configCheck() {
      if (this.editForm.data.itemName === '') {
        this.errmsg('请填写道具名称')
        return false
      }

      if (this.editForm.data.itemType === 0) {
        this.errmsg('请选择道具分类')
        return false
      }

      if (!this.isFreeSpin(this.editForm.data.itemType)){
        this.editForm.itemExtra.specialAttr = 0
      }

      if (this.isAvatarFrameProp(this.editForm.data.itemType)) {
        this.editForm.data.itemCost = 0
        this.slotFreeSpinPropReset()
      } else if (this.isTicketPropNew(this.editForm.data.itemType)) {
        this.slotFreeSpinPropReset()
        if (typeof this.editForm.data.itemCost === 'undefined' || this.editForm.data.itemCost === null || this.editForm.data.itemCost === '') {
          this.errmsg('请填写道具价值')
          return false
        }
      }
      if(this.isTicketPropNew(this.editForm.data.itemType)){
        if (typeof this.editForm.itemExtra.appId === 'undefined' || this.editForm.itemExtra.appId === 0 || this.editForm.itemExtra.appId === '') {
          this.errmsg('请选择道具对应的APPID')
          return false
        }
      }

      if (this.editForm.data.describe === '') {
        this.errmsg('请填写道具描述')
        return false
      }
      if (this.editForm.itemEndDate === null) {
        this.errmsg('请选择过期时间')
        return false
      }

      if (this.editForm.data.image === '') {
        this.errmsg('请上传Icon图')
        return false
      }

      if (this.isFreeSpin(this.editForm.data.itemType)){
        if (this.editForm.itemExtra.specialAttr <= 0) {
          this.errmsg('请确认游戏类型')
          return false
        }
        if (this.editForm.itemExtra.gid.length === 0) {
          this.errmsg('请选择关联游戏')
          return false
        }
        if (this.editForm.itemExtra.betAmount === 0) {
          this.errmsg('请选择下注金额')
          return false
        }
      }
      if (this.isAvatarFrameProp(this.editForm.data.itemType) && this.editForm.data.quality === 0) {
        this.errmsg('请选择品质')
        return false
      }
      return true
    },
    isTicketPropNew(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW
    },
    // 是否是头像框道具
    isAvatarFrameProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR
    },
    // 是否特效道具
    isEffectProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_INTERACTION
    },
    isFreeSpin(itemType){
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN
    },
    getAppIdName(item_extra) {
      try {
        if (!item_extra || typeof item_extra !== 'string') {
          return '未设置';
        }
        const extraData = JSON.parse(item_extra);
        const appId = extraData?.appId;
        // 检查 appId 是否有效
        if (!appId || appId === 0) {
          return '请选择APPID';
        }
        const found = APPID_OPTIONS.find(item => item.value === appId);
        return found ? found.label : '未知APPID';
      } catch (error) {
        console.error('获取APPID名称失败:', error);
        return '解析失败';
      }
    },
    getSuitedItemList(itemList, appId) {
      if (!Array.isArray(itemList)) {
        return []
      }
      return itemList.filter(obj => {
        if (typeof obj.item_extra !== 'string' || !obj.item_extra) {
          return false
        }
        try {
          const { appId: extraAppId } = JSON.parse(obj.item_extra)
          return extraAppId === appId
        } catch (error) {
          console.error('解析道具extra失败:', error)
          return false
        }
      })
    },
    //获取slot游戏配置
    async getSlotGameConfig(){
      try {
        const response = await request({
          url: '/thirdpartygames/all',
          method: 'get',
          data: {}
        })
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].CategoryID === 1 && response.Data[i].Status === 2)  { // 老虎机
              this.SLOT_GAME_CONFIG.push({
                value: response.Data[i].Gid,
                label: response.Data[i].Name+  "("+response.Data[i].Description + ")",
              })
            }
          }
        }

        this.initFreeSpinGameMap()
      } catch (error) {
        console.error('获取slot游戏配置失败:', error)
      }
    },
    //根据道具类型获取道具的子属性
    getSubAttrByPropType(propType){
      return this.ItemSubAttrCfg.filter(item => item.propType === propType)
    }
  }
}
</script>
