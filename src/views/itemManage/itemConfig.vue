<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="id" key-id="PropsConfig" :env-empty="true" :attr-names="AttrNames" :head-attrs="['title']" />
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
          width="100"
        />

        <el-table-column
          prop="item_name"
          label="道具名称"
          show-overflow-tooltip
        />
        <el-table-column prop="item_type" label="道具分类" >
          <template slot-scope="scope">
            {{ getItemTypeName(scope.row.item_type) }}
          </template>
        </el-table-column>

        <el-table-column prop="image" label="ICON" >
          <template slot-scope="{row}">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image"
              lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="item_cost" label="道具价值"/>

        <el-table-column
          prop="show_text"
          label="扩展信息"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.item_type == 1">
              创建时间:{{ formatTime(scope.row.create_time)}} / 结束时间:{{ formatTime(scope.row.expire_time)}}
            </span>
            <span v-if="scope.row.item_type == 2">
              品质:{{getQualityName(scope.row.quality)}} 可用时间:{{getShowText(scope.row.id)}} 描述:这是一个头像框
            </span>
            <span v-if="scope.row.item_type == 3">
              创建时间:{{ formatTime(scope.row.create_time)}} / 结束时间:{{ formatTime(scope.row.expire_time)}}
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
          width="200px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="showForm(scope.row.id)"
            >编辑</el-button>
            <el-button v-if="scope.row.status==1" size="mini" type="danger" @click="handleUpdate(scope.row.id)">下架</el-button>
            <el-button v-if="scope.row.status==2" size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
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
      <el-form :model="editForm.data" label-width="150px" size="mini">
        <fieldset>
          <legend>道具信息</legend>
          <el-form-item label="道具名称：" :required="true">
            <el-input v-model="editForm.data.itemName" style="width: 150px;" placeholder="请填写道具名称" />
          </el-form-item>

          <el-form-item label="道具价值：" :required="true">
            <el-input v-model.number="editForm.data.itemCost" style="width: 150px;" placeholder="请填写道具价值" />
          </el-form-item>

          <el-form-item v-if="editForm.data.itemType == 2" label="品质：" :required="true">
            <el-select v-model="editForm.data.quality" style="width: 150px;" placeholder="请选择道具品质分类">
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
            <el-input v-model="editForm.data.describe" style="width: 150px;" placeholder="请填写道具描述" />
          </el-form-item>

          <el-form-item label="道具类别：" :required="true">
            <el-select v-model="editForm.data.itemType" style="width: 150px;" :disabled="!editForm.isAdd" placeholder="请选择道具分类">
              <el-option
                v-for="item in itemTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.data.itemType != 2" label="道具过期时间：" :required="true">
            <el-date-picker
              v-model="editForm.itemEndDate"
              size="mini"
              type="date"
              placeholder="选择过期日期"
            />
            <span style="color:black; margin-left:10px">[00:00:00]</span>
          </el-form-item>

          <el-form-item v-if="editForm.data.itemType == 2" label="有效时间：" :required="true">
            <el-checkbox-group v-model="editForm.data.timeType" style="width: 700px" >
              <el-checkbox v-for="item in dayTypeCfgs" :key="item.value" :label="item.value">{{ item.label }} </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="排序：" :required="true">
            <el-input v-model.number="editForm.data.sort" style="width: 150px;" placeholder="请填写排序id" />
          </el-form-item>

          <el-form-item label="道具ICON：" :required="true">
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

export default {
  name: 'PropsConfig',
  components: { Compare, Publish, DateTimeShow, ImagePicker },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,

      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1000008, 'label': 'gli' },
        { 'value': 1100000, 'label': 'xworld' }
      ],

      channelIdCfgs: [
        { 'value': 'BP', 'label': 'BP' },
        { 'value': 'AP', 'label': 'AP' },
        { 'value': 'GP', 'label': 'GP' },
        { 'value': 'TP', 'label': 'TP' },
        { 'value': 'PG', 'label': 'PG' },
        { 'value': 'Dev', 'label': 'Dev' }
      ],

      itemTypeCfgs: [
        { 'value': 1, 'label': '门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州参赛券', disabled: false }
      ],

      dayTypeCfgs: [
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
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
      raw: {},
      tableData: [],
      limit: 10,
      total: 0,
      page: 1,
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        data:{
          ID: 0,
          itemName: '',
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
        itemEndDate: $libDate.GetDayBegin(new Date().setSeconds(0))
      },

      AttrNames: {
        itemName: '道具名称',
        itemCost: '道具价值',
        itemType: '道具分类',
        describe: '道具描述',
        image: 'ICON链接',
        expireTime: '过期时间',
        sort: '排序',
        status: '状态'
      }
    }
  },
  created(){
    this.name = store.getters.name
    this.env = store.getters.env || this.env
  },
  mounted(){
    this.getList()
    console.log(this.tableData)
    console.log(this.raw)
    console.log(this.tableData.length)
  },
  methods: {
    getList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: this.page,
          PageSize: this.limit
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            this.tableData = objs.list
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      })
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
      console.log(id)
      if (id == 0) {
        this.editForm.title = '新增道具配置'
        this.editForm.data = {
          ID: 0,
          itemName: '',
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
          if (this.tableData[i].id == id) {
            editData = this.tableData[i]
            break
          }
        }
        console.log(id)
        console.log(editData)
        if (typeof editData.id == 'undefined') {
          Message.error('道具配置不存在')
          return
        }

        const time_type = JSON.parse(editData.time_type)
        this.editForm.data = {
          ID: editData.id,
          itemName: editData.item_name,
          itemCost: editData.item_cost,
          itemType: editData.item_type,
          describe: editData.item_describe,
          image: editData.image,
          expireTime: editData.expire_time,
          sort: editData.sort,
          status: editData.status,
          quality: editData.quality,
          timeType: time_type
        }
      }
    },
    getItemTypeName(item_type){
      var itemTypeName = ''
      for (var i = 0; i < this.itemTypeCfgs.length; i++) {
        if (this.itemTypeCfgs[i].value == item_type) {
          itemTypeName = this.itemTypeCfgs[i].label
          break
        }
      }
      return itemTypeName
    },

    getStatusName(status) {
      var statusName = ''
      for (var i = 0; i < this.statusCfgs.length; i++) {
        if (this.statusCfgs[i].value == status) {
          statusName = this.statusCfgs[i].label
          break
        }
      }
      return statusName
    },

    getQualityName(id) {
      var name =''
      for (var i = 0; i < this.qualityTypeCfgs.length; i++) {
        if (this.qualityTypeCfgs[i].value == id) {
          name = this.qualityTypeCfgs[i].label
          break
        }
      }
      return name
    },
    getShowText(id) {
      var showTextName = ''
      let editData = {}
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id == id) {
          editData = this.tableData[i]
          break
        }
      }
      const time_type = JSON.parse(editData.time_type)
      for (var i = 0; i < this.dayTypeCfgs.length; i++) {
        for (var j = 0; j < time_type.length; j++) {
          if (this.dayTypeCfgs[i].value == time_type[j]) {
            showTextName += this.dayTypeCfgs[i].label
            if (j < time_type.length - 1) {
              showTextName += ','
            }
          }
        }
      }
      return showTextName
    },

    checkAll(){
      //默认全选
      for (var i = 0; i < this.dayTypeCfgs.length; i++) {
        this.editForm.data.timeType.push(this.dayTypeCfgs[i].value)
      }
      console.log(this.editForm.data.timeType)
    },
    handleUpdate(id) {
      this.$confirm('您确定要将该比赛配置上架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let editData = {}
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id == id) {
            editData = this.tableData[i]
            break
          }
        }
        editData.status = 2
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
            TimeType: editData.time_type
          }
        }).then(response => {
          if (response.RetCode === 0) {
            let showMsg = '修改道具配置成功！'
            Message.success(showMsg)
            this.getList()
          } else {
            let errMsg = '修改道具配置失败！'
            Message.error(errMsg + response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    handleDelete(id){
      this.$confirm('您确定要将该道具删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        for (const key in this.editForm.tableData) {
          if (this.editForm.tableData[key].id === id) {
            continue
          }
          newList.push(this.editForm.tableData[key])
        }
        this.editForm.tableData = newList
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
    saveItemConfig() {
      if (!this.configCheck()) {
        return
      }
      let expireTime = 0
      expireTime = (Math.floor(this.editForm.itemEndDate / 1000))
      const timeList = JSON.stringify(this.editForm.data.timeType)
      if (this.editForm.data.ID == 0) {
        console.log(this.editForm.data.ID)
        this.editForm.data.status = 1
        request({
          url: '/propsconfig/props/config/create',
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
            TimeType: timeList
          }
        }).then(response => {
          if (response.RetCode === 0) {
            let showMsg = '新增道具配置成功！'
            Message.success(showMsg)
            this.getList()
            this.editForm.visable = false
          } else {
            let errMsg = '新增道具配置失败！'
            Message.error(errMsg + response.Data)
          }
        })
      } else {
        request({
          url: '/propsconfig/props/config/update',
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
            TimeType: timeList
          }
        }).then(response => {
          if (response.RetCode === 0) {
            let showMsg = '修改道具配置成功！'
            Message.success(showMsg)
            this.getList()
            this.editForm.visable = false
          } else {
            let errMsg = '修改道具配置失败！'
            Message.error(errMsg + response.Data)
          }
        })
      }
    },

    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    timeToSec(time) {
      var s = ''
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]

      s = Number(hour * 3600) + Number(min * 60) + Number(sec)

      return s
    },

    configCheck() {
      if(this.editForm.data.itemName == '') {
        this.errmsg('请填写道具名称')
        return false
      }
      if(this.editForm.data.itemCost == 0) {
        this.errmsg('请填写道具价值')
        return false
      }

      if(this.editForm.data.itemType == 0) {
        this.errmsg('请选择道具分类')
        return false
      }
      if(this.editForm.data.describe == '') {
        this.errmsg('请填写道具描述')
        return false
      }
      if(this.editForm.itemEndDate === null) {
        this.errmsg('请选择过期时间')
        return false
      }

      if(this.editForm.data.image == '') {
        this.errmsg('请上传Icon图')
        return false
      }

      return true
    }
  }
}
</script>
