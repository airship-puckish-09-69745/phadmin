<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button type="success" icon="el-icon-plus" @click="showForm(0)">添加比赛海报</el-button>
      </div>

      <el-row style="margin-top: 30px">
        <el-col :span="12" :offset="4">
          <el-form ref="form" :model="form" label-width="200px">
            <el-row>
              <el-form-item label="活动状态：">
                <el-switch v-model="postData.switch" active-text="下架" inactive-text="正常" active-color="#cc0000" inactive-color="#009900" />
              </el-form-item>
            </el-row>
            <el-col :offset="0" :span="8">
              <el-form-item>
                <el-button type="primary" @click="saveSwitch(0)">开关保存</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>

      <el-table
        :data="postData.tableData"
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >
        <el-table-column
          prop="sort_id"
          label="排序值"
        />
        <el-table-column
          prop="name"
          label="赛事名称"
        />
        <el-table-column
          prop="start_time"
          label="开始时间"
        >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.start_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
        >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.end_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="modifier"
          label="修改人"
        />
        <el-table-column
          prop="update_time"
          label="修改时间"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="开关"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="showForm(scope.row.id)"
            >编辑</el-button>

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
    >
      <el-form :model="editForm.data" label-width="200px" size="mini">
        <el-form-item v-if="editForm.data.sort_id > 0" label="海报排序ID：">
          {{ editForm.data.sort_id }}
        </el-form-item>
        <fieldset>
          <legend>海报信息</legend>
          <el-form-item label="赛事名称：" :required="true">
            <el-select v-model="editForm.data.matchId" placeholder="请选择" size="mini" @change="selectMatchName()">
              <el-option
                v-for="item in showCsCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="游戏选择：" :required="true">
            <el-select v-model="editForm.data.gameId" placeholder="请选择" size="mini">
              <el-option
                v-for="items in gameCfgs"
                :key="items.value"
                :label="items.label"
                :value="items.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="海报图片URL：" :required="true">
            <ImagePicker v-model="editForm.data.imagePath" />
          </el-form-item>

          <el-form-item label="海报排序：" :required="true">
            <el-input v-model="editForm.data.sort_id" style="width: 200px;" placeholder="填写海报排序值" />
          </el-form-item>
          <el-form-item label="生效时间：" :required="true">
            <el-date-picker
              v-model="editForm.onceTime"
              format="yyyy-MM-dd HH:mm"
              size="mini"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>

        </fieldset>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveMatch()">保存海报配置</el-button>
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
import Publish from '@/components/Publish'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { $libDate, $libShow } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import Compare from '@/components/Compare'

export default {
  components: { Compare, Publish, DateTimeShow, ImagePicker },
  data() {
    return {
      activeTab: 'base',
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,
      form: {
        status: 0
      },
      csCfgs: [],
      showCsCfgs: [],
      postData: {
        'tableData': [],
        'switch': false
      },
      raw: {},
      limit: 10,
      total: 0,
      page: 1,
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        data: {
          id: 0,
          name: '',
          matchId: 0,
          imagePath: '',
          sortId: 0
        }
      },
      AttrNames: {
      },
      gameCfgs: [
        { 'value': 2031, 'label': 'tongits' }
      ],
      subKey: 'match_poster_list'
    }
  },
  computed: {
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.getBeginMatchCfgs()
  },
  mounted() {
    this.getList()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getBeginMatchCfgs() {
      request({
        url: '/matchconfig/match/config/list',
        method: 'get',
        data: {
          Env: this.env,
          GameId: -1,
          Status: this.form.status,
          CsId: -1,
          RepeatType: -1,
          PageNum: 1,
          PageSize: 200
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            for (var i = 0; i < objs.list.length; i++) {
              this.csCfgs.push({
                'label': '[' + objs.list[i].id + ']' + objs.list[i].name,
                'value': objs.list[i].id,
                'matchId': [parseInt(objs.list[i].match_id, 10)]
              })
            }
          }
        }
      })
    },
    getList() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const cfg = JSON.parse(response.Data.Data)
            this.postData.tableData = cfg.tableData
            this.postData.switch = cfg.switch
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data
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
    getGameName(matchId) {
      var gameName = ''
      for (var i = 0; i < this.csCfgs.length; i++) {
        if (this.csCfgs[i].value === matchId) {
          gameName = this.csCfgs[i].label
          break
        }
      }
      return gameName
    },
    selectMatchName() {
      this.showCsCfgs = []
      if (this.csCfgs.length > 0) {
        for (var i = 0; i < this.csCfgs.length; i++) {
          this.showCsCfgs.push(this.csCfgs[i])
        }
      }
    },

    selectMatchGame() {

    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增比赛海报配置'
        this.editForm.data = {
          id: 0,
          name: '',
          matchId: 0,
          csId: 0,
          status: 0,
          imagePath: '',
          sort_id: 0
        }
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
      } else {
        let editData = {}
        this.editForm.title = '编辑海报配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.postData.tableData.length; i++) {
          if (this.postData.tableData[i].id === id) {
            editData = this.postData.tableData[i]
            break
          }
        }
        this.editForm.data = {
          id: editData.id,
          name: editData.name,
          matchId: editData.match_id,
          status: editData.status,
          imagePath: editData.image_path,
          sort_id: editData.sort_id,
          gameId: editData.game_id
        }
        this.editForm.onceTime = [new Date(editData.start_time * 1000), new Date(editData.end_time * 1000)]
        this.showCsCfgs = []
        if (this.csCfgs.length > 0) {
          for (var i = 0; i < this.csCfgs.length; i++) {
            this.showCsCfgs.push(this.csCfgs[i])
          }
        }
      }
      this.editForm.visable = true
    },

    saveSwitch() {
      this.raw.Data = JSON.stringify(this.postData)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.raw
      }).then(response => {
        if (response.RetCode === 0) {
          const showMsg = '保存成功'
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
          return
        } else {
          const errMsg = '保存成功失败！'
          Message.error(errMsg + response.Data)
          return
        }
      })
    },
    saveMatch() {
      if (!this.configCheck()) {
        return
      }
      let bTime = 0
      let eTime = 0
      this.editForm.onceTime[0].setSeconds(0) // 去除秒数
      this.editForm.onceTime[1].setSeconds(0) // 去除秒数
      bTime = Math.floor(this.editForm.onceTime[0] / 1000)
      eTime = Math.floor(this.editForm.onceTime[1] / 1000)
      if (this.editForm.isAdd === false) {
        for (let i = 0; i < this.postData.tableData.length; i++) {
          if (this.postData.tableData[i].id === this.editForm.data.id) {
            this.postData.tableData[i].sort_id = this.editForm.data.sort_id
            this.postData.tableData[i].name = this.getGameName(this.editForm.data.matchId)
            this.postData.tableData[i].imagePath = this.editForm.data.imagePath
            this.postData.tableData[i].start_time = bTime
            this.postData.tableData[i].end_time = eTime
            this.postData.tableData[i].update_time = (new Date().setSeconds(0)) / 1000
            break
          }
        }
      } else {
        this.postData.tableData.push(
          {
            'id': new Date().setSeconds(0),
            'sort_id': this.editForm.data.sort_id,
            'name': this.getGameName(this.editForm.data.matchId),
            'match_id': this.editForm.data.matchId,
            'image_path': this.editForm.data.imagePath,
            'modifier': this.$store.getters.name,
            'start_time': bTime,
            'end_time': eTime,
            'update_time': (new Date().setSeconds(0)) / 1000,
            'game_id': this.editForm.data.gameId
          }
        )
      }

      this.raw.Data = JSON.stringify(this.postData)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.raw
      }).then(response => {
        if (response.RetCode === 0) {
          const showMsg = '保存成功'
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
          return
        } else {
          const errMsg = '保存成功失败！'
          Message.error(errMsg + response.Data)
          return
        }
      })
    },
    handleDelete(id) {
      this.$confirm('您确定要将该海报配置删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        for (const key in this.postData.tableData) {
          if (this.postData.tableData[key].id === id) {
            continue
          }
          newList.push(this.postData.tableData[key])
        }
        this.postData.tableData = newList
        this.raw.Data = JSON.stringify(this.postData)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: this.raw
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除海报配置成功！')
            this.getList()
          } else {
            Message.error('删除海报配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    configCheck() {
      if (this.editForm.data.sort_id <= 0) {
        this.errmsg('需要填写海报排序数值')
        return false
      }
      if (this.editForm.data.imagePath === '') {
        this.errmsg('需要填写海报信息')
        return false
      }
      if (this.editForm.onceTime === 'undefined') {
        this.errmsg('需要填写生效时间')
        return false
      }
      return true
    }
  }
}
</script>
