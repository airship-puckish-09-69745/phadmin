<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" :attr-names="AttrNames" />
    </el-row>
    <el-row>

      <el-row>
        <el-form :model="form" label-width="100px" :inline="true" size="mini">
          <el-form-item label="AppId：" :required="true">
            <el-select v-model="form.app_id" placeholder="请选择" size="mini">
              <el-option label="全部" :value="-1" />
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态：" :required="true">
            <el-select v-model="form.status" placeholder="请选择" size="mini">
              <el-option label="全部" :value="-1" />
              <el-option
                v-for="item in statusCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="resetSearch">重置查询条件</el-button>
            <el-button type="primary" size="mini" @click="getListCheck">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row style="margin-top: 30px">
        <el-col :span="2" :offset="0">
          <el-form ref="form" :model="posterList" label-width="200px">
            <el-row>
              <el-form-item label="应用开关：">
                  <el-checkbox-group v-model="posterList.switchData" style="width: 700px">
                    <el-checkbox v-for="item in APPID_OPTIONS" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
            </el-row>
          </el-form>


        </el-col>
      </el-row>

      <div style="height: 50px;">
        <el-button type="primary" size="mini" @click="saveSwitch()">应用开关保存</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="showForm(0)">添加赛事海报</el-button>
      </div>

      <el-table
        :data="posterList.tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 80%"
      >
        <el-table-column prop="title" label="海报标题" />

        <el-table-column prop="app_id" label="AppId">
          <template slot-scope="scope">
            {{ getAppName(scope.row.app_id) }}
          </template>
        </el-table-column>

        <el-table-column prop="image_path" label="海报图">
          <template slot-scope="{row}">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image_path"
              lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="jump_id" label="跳转类型" >
          <template slot-scope="scope">
            {{ getJumpName(scope.row.jump_id) }}
          </template>
        </el-table-column>

        <el-table-column prop="start_time" label="开始时间">
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.start_time" />
          </template>
        </el-table-column>

        <el-table-column prop="end_time" label="结束时间" >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.end_time" />
          </template>
        </el-table-column>

        <el-table-column prop="switch" label="状态">
          <template slot-scope="scope">
            {{ getStatusName(scope.row.switch) }}
          </template>
        </el-table-column>

        <el-table-column prop="sort_id" label="排序" />

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
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog
      :title="editForm.title"
      :visible.sync="editForm.visable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
    >

      <el-form :model="editForm.data" label-width="300px" size="mini">
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">

          <legend>海报配置</legend>

          <el-form-item label="配置标题：" :required="true">
            <el-input v-model="editForm.data.title" style="width: 200px;" placeholder="填写配置标题" />
          </el-form-item>

          <el-form-item label="AppId：" :required="true">
            <el-select v-model="editForm.data.app_id" placeholder="请选择" size="mini" :disabled="!editForm.isAdd" @change="selectMatchName()">
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="展示游戏：" :required="true">
            <el-select v-model="editForm.data.display_gids" placeholder="请选择" size="mini" multiple>
              <el-option
                v-for="item in displayGidsCfg"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="配置开关：" :required="true" prop="switch">
            <el-switch v-model="editForm.data.switch" :active-value="true" :inactive-value="false" />
          </el-form-item>

          <el-form-item label="展示位置：" :required="true">
            <el-select v-model="editForm.data.display_place" placeholder="请选择" size="mini" >
              <el-option
                v-for="item in displayPlaceCfg"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="排序" :required="true" >
            <el-input v-model="editForm.data.sort_id" style="width: 200px;" placeholder="填写海报排序值" />
          </el-form-item>

          <el-form-item label="海报图" :required="true">
            <ImagePicker v-model="editForm.data.image_path" />
          </el-form-item>

          <el-form-item label="跳转类型" :required="true">
            <el-select v-model="editForm.data.jump_id" placeholder="请选择" size="mini" @change="selectPosterJumpType()">
              <el-option
                v-for="item in postJumpCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.data.jump_id===1" label="海报详情图" :required="true">
            <ImagePicker v-model="editForm.data.details_image_path" />
          </el-form-item>

          <el-form-item v-if="editForm.data.jump_id===2" label="游戏跳转" :required="true">
            <el-select v-model="editForm.data.game_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in gameCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.data.jump_id===3" label="比赛跳转" :required="true">
            <el-select v-model="editForm.data.match_cfg_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in showCsCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>


          <el-form-item v-if="editForm.data.jump_id===4" label="分类跳转" :required="true">
            <el-select v-model="editForm.data.game_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in jumpTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.data.jump_id===4" label="赛事跳转" :required="true">
            <el-select v-model="editForm.data.match_cfg_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in showCsCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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

          <el-form-item v-if="editForm.data.jump_id===1" label="是否首弹:" :required="true" prop="first_jump" >
            <el-switch v-model="editForm.data.first_jump" :active-value="true" :inactive-value="false" />
          </el-form-item>

          <el-form-item label="站点选择：">
            <el-checkbox-group v-model="editForm.data.channelId" style="width: 700px">
              <el-checkbox v-for="item in CHANNEL_OPTIONS" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </fieldset>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="savePosetCfg()">保存海报配置</el-button>
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
import { getAllCommonGameConfig } from '@/utils/common-game-config'
import {APPID_OPTIONS, CHANNEL_OPTIONS, MATCH_UNIQUE_ID_CFG} from "@/utils/options";

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
        status: -1,
        app_id:-1,
      },
      showCsCfgs: [],
      posterList: {
        'tableData': [],
        'switchData': []
      },
      matchCfg: [],
      raw: {},
      switchList: [],
      limit: 10,
      total: 0,
      page: 1,
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        data: {
          id: 0,
          title: '',
          app_id: 1000002,
          switch: 'true',
          display_gids:[], //展示游戏
          display_place:0, //展示位置
          channelId: []  //站点
        }
      },
      AttrNames: {
      },
      gameCfgs: [
        { 'value': 2031, 'label': 'tongits' }
      ],
      displayGidsCfg:[
        { 'value': 2031, 'label': 'tongits' },
        { 'value': 2033, 'label': 'pusoy' },
      ],
      displayPlaceCfg:[
        {'value':0,'label':'home页面'},
        {'value':1,'label':'免费赛页面'},
      ],
      postJumpCfgs: [
        { 'value': 1, 'label': '打开海报详情' },
        { 'value': 2, 'label': '跳转到子游戏' },
        { 'value': 3, 'label': '跳转比赛详情' },
        { 'value': 4, 'label': '跳转分类' },
      ],
      jumpTypeCfgs: [
        { 'value': 1, 'label': 'Events' },
        { 'value': 2, 'label': 'Free' },
        { 'value': 3, 'label': 'PRO ARENA ' },
        { 'value': 4, 'label': 'GTCC' },
      ],
      statusCfgs: [
        { "value": 0, "label": "关闭" },
        { "value": 1, "label": "开启" },
      ],

      subKey: 'match_poster_list',
      APPID_OPTIONS,
      MATCH_UNIQUE_ID_CFG,
      CHANNEL_OPTIONS
    }
  },
  computed: {
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.getGameAll()
  },
  mounted() {
    this.getList()
    this.getBeginMatchCfgs()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    resetSearch() {
      this.form.app_id = -1
      this.form.status = -1
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
            //step one 先将比赛全局唯一ID存储起来
            var tmpArray = []
            for (var i = 0; i < objs.list.length; i++) {
              var signExtra = JSON.parse(objs.list[i].sign_extra)
              if (signExtra.matchUniqueId != null || signExtra.matchUniqueId > 0) {
                tmpArray.push(signExtra.matchUniqueId)
              }
            }
            //step 数组中的数据去重,并根据ID转换为label标签名字
            if (tmpArray.length > 0) {
              const newArr = this.removeDuplicate(tmpArray)
              for(var i = 0; i < newArr.length; i++) {
                var name = this.getMatchName(newArr[i])
                if (name != null && name !== '') {
                  this.matchCfg.push({
                    'label': name,
                    'value': newArr[i],
                    'app_info': JSON.parse(objs.list[i].app_info_cfg)
                  })
                }
              }
            }
          }
        }
      })
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.gameCfgs = []
          for (var i = 0; i < objs.length; i++) {
            this.gameCfgs.push({
              'label': objs[i].Name,
              'value': objs[i].Gid
            })
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
            this.posterList = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data
        }
      })
    },

    getListCheck() {
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
            if (cfg.tableData.length > 0) {
              this.posterList.tableData = []
              if (this.form.app_id < 0 && this.form.status >= 0) {
                for (var i = 0; i < cfg.tableData.length; i++) {
                  if (this.form.status == 1 && cfg.tableData[i].switch == true) {
                    this.posterList.tableData.push(cfg.tableData[i])
                  }
                  if (this.form.status == 0 && cfg.tableData[i].switch == false) {
                    this.posterList.tableData.push(cfg.tableData[i])
                  }
                }

              } else if (this.form.app_id > 0 && this.form.status < 0) {
                for (var i = 0; i < cfg.tableData.length; i++) {
                  if (cfg.tableData[i].app_id == this.form.app_id) {
                    this.posterList.tableData.push(cfg.tableData[i])
                  }
                }
              } else if (this.form.app_id > 0 && this.form.status >= 0) {
                for (var i = 0; i < cfg.tableData.length; i++) {
                  if (cfg.tableData[i].app_id == this.form.app_id && (this.form.status == 1 && cfg.tableData[i].switch == true)) {
                    this.posterList.tableData.push(cfg.tableData[i])
                  }

                  if (cfg.tableData[i].app_id == this.form.app_id && (this.form.status == 0 && cfg.tableData[i].switch == false)) {
                    this.posterList.tableData.push(cfg.tableData[i])
                  }
                }
              } else {
                this.posterList = JSON.parse(response.Data.Data)
              }
            }

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data
        }
      })
    },
    selectMatchName() {
      this.showCsCfgs = []
      if (this.matchCfg.length > 0) {
        var fit = false
        for (var i = 0; i < this.matchCfg.length; i++) {
          for (var j = 0; j < this.matchCfg[i].app_info.length; j++) {
            if (this.matchCfg[i].app_info[j].appId === this.editForm.data.app_id) {
              this.showCsCfgs.push(this.matchCfg[i])
              fit = true
            }
          }
        }
        if (fit === true) {
          this.showCsCfgs.push({
            'label': '无',
            'value': 0
          })
        }
      }
    },

    saveSwitch() {
      this.raw.Data = JSON.stringify(this.posterList)
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
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getStatusName(status) {
      var statusName = ""
      for (var i = 0; i < this.statusCfgs.length; i++) {
        if (this.statusCfgs[i].value === status) {
          statusName = this.statusCfgs[i].label
          break
        }
      }
      return statusName
    },

    getAppName(id) {
      var appName = ""
      for (var i = 0; i < this.APPID_OPTIONS.length; i++) {
        if (this.APPID_OPTIONS[i].value === id) {
          appName = this.APPID_OPTIONS[i].label
          break
        }
      }
      appName = appName + '[' + id + ']'
      return appName
    },

    getJumpName(jump_id) {
      var jumpName = ""
      for (var i = 0; i < this.postJumpCfgs.length; i++) {
        if (this.postJumpCfgs[i].value === jump_id) {
          jumpName = this.postJumpCfgs[i].label
          break
        }
      }
      return jumpName
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增比赛海报配置'
        this.editForm.data = {
          id: 0,
          title: '',
          app_id: 1000002,
          switch: true,
          jump_id: 1,
          details_image_path: '',
          image_path: '',
          first_jump: false,
          match_cfg_id: 0,
          start_time: 0,
          end_time: 0,
          sort_id: 0,
          game_id: 0,
          display_gids:[], //展示游戏
          display_place:0, //展示位置
          channelId:[],
        }
        this.editForm.isAdd = true
        this.selectMatchName()
      } else {
        let editData = {}
        this.editForm.title = '编辑海报配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === id) {
            editData = this.posterList.tableData[i]
            break
          }
        }
        this.editForm.onceTime = [new Date(editData.start_time * 1000), new Date(editData.end_time * 1000)]
        if (editData.channelId === undefined){
          editData.channelId = []
        }
        this.editForm.data = editData
        this.selectMatchName()
        let find = false
        for (var i = 0; i < this.showCsCfgs.length; i++) {
          if (this.showCsCfgs[i].value === this.editForm.data.match_cfg_id) {
            find = true
            break
          }
        }
        if (find == false) {
          this.editForm.data.match_cfg_id = 0
        }
      }
      this.editForm.visable = true
    },
    savePosetCfg() {
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
        for (var i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === this.editForm.data.id) {
            this.posterList.tableData[i].title = this.editForm.data.title
            this.posterList.tableData[i].switch = this.editForm.data.switch
            this.posterList.tableData[i].sort_id = parseInt(this.editForm.data.sort_id)
            this.posterList.tableData[i].game_id = this.editForm.data.game_id
            this.posterList.tableData[i].image_path = this.editForm.data.image_path
            this.posterList.tableData[i].details_image_path = this.editForm.data.details_image_path
            this.posterList.tableData[i].jump_id = this.editForm.data.jump_id
            this.posterList.tableData[i].first_jump = this.editForm.data.first_jump
            this.posterList.tableData[i].match_cfg_id = this.editForm.data.match_cfg_id
            this.posterList.tableData[i].start_time = bTime
            this.posterList.tableData[i].end_time = eTime
            if (this.editForm.data.display_gids !== undefined){
              this.posterList.tableData[i].display_gids = this.editForm.data.display_gids
            }
            if(this.editForm.data.display_place !== undefined){
              this.posterList.tableData[i].display_place = this.editForm.data.display_place
            }
            this.posterList.tableData[i].channelId = this.editForm.data.channelId
          }
        }
      } else {
        this.posterList.tableData.push(
          {
            'id': new Date().setSeconds(0),
            'title': this.editForm.data.title,
            'app_id': this.editForm.data.app_id,
            'switch': this.editForm.data.switch,
            'sort_id': parseInt(this.editForm.data.sort_id),
            'game_id': this.editForm.data.game_id,
            'image_path': this.editForm.data.image_path,
            'details_image_path': this.editForm.data.details_image_path,
            'jump_id': this.editForm.data.jump_id,
            'first_jump': this.editForm.data.first_jump,
            'match_cfg_id': this.editForm.data.match_cfg_id,
            'start_time': bTime,
            'end_time': eTime,
            'display_gids':this.editForm.data.display_gids,
            'display_place':this.editForm.data.display_place,
            'channelId': this.editForm.data.channelId,
          }
        )
      }
      this.raw.Data = JSON.stringify(this.posterList)
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
        for (const key in this.posterList.tableData) {
          if (this.posterList.tableData[key].id === id) {
            continue
          }
          newList.push(this.posterList.tableData[key])
        }
        this.posterList.tableData = newList
        this.raw.Data = JSON.stringify(this.posterList)
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

    selectPosterJumpType() {
      if (this.editForm.data.jump_id === 1) {
        this.editForm.data.game_id = 0
        this.editForm.data.match_cfg_id = 0
      } else if (this.editForm.data.jump_id === 2) {
        this.editForm.data.match_cfg_id = 0
        this.editForm.data.first_jump = false
        this.editForm.data.details_image_path = ''
      } else if (this.editForm.data.jump_id === 3) {
        this.editForm.data.game_id = 0
        this.editForm.data.first_jump = false
        this.editForm.data.details_image_path = ''
      }
      else if (this.editForm.data.jump_id === 4) {
        this.editForm.data.first_jump = false
        this.editForm.data.details_image_path = ''
      }
    },
    removeDuplicate(arr) {
      const newArr = []
      arr.forEach(item => {
        if (newArr.indexOf(item) === -1) {
          newArr.push(item)
        }
      })
      return newArr // 返回一个新数组
    },
    getMatchName(id) {
      var jumpName = ''
      for (var i = 0; i < this.MATCH_UNIQUE_ID_CFG.length; i++) {
        if(this.MATCH_UNIQUE_ID_CFG[i].value === id) {
          jumpName = this.MATCH_UNIQUE_ID_CFG[i].label
        }
      }
      return jumpName
    },
    onCompare(pre,pro) {
      const preVal=JSON.parse(pre.Data)
      const proVal=JSON.parse(pro.Data)
      let str = "当前打开的应用："
      if (JSON.stringify(proVal.switchData)) {
        str += proVal.switchData.join('/')
      }
      // 编辑
      let has = false
      for (const i in preVal.tableData) {
        for (const j in proVal.tableData) {
          const preItem = preVal.tableData[i]
          const proItem = proVal.tableData[j]
          if (preItem.id === proItem.id) {
            if (JSON.stringify(preItem) !== JSON.stringify(proItem)) {
              has && (str += "\r\n---");has=true
              str += `\r\n修改：【${preItem.app_id}】，${preItem.title}，${this.getJumpName(preItem.jump_id)}`
              str += `\r\n上架：${new Date(preItem.start_time*1000).toLocaleString()} - ${new Date(preItem.end_time*1000).toLocaleString()}`
              str += `\r\n图片：${preItem.image_path}`
              str += `\r\n详情：${preItem.details_image_path}`
            }
          }
        }
      }
      // 新增
      for (const i in preVal.tableData) {
        const preItem = preVal.tableData[i]
        if (!proVal.tableData.some(item=>item.id === preItem.id)) {
          has && (str += "\r\n---");has=true
          str += `\r\n增加：【${preItem.app_id}】，${preItem.title}，${this.getJumpName(preItem.jump_id)}`
          str += `\r\n上架：${new Date(preItem.start_time*1000).toLocaleString()} - ${new Date(preItem.end_time*1000).toLocaleString()}`
          str += `\r\n图片：${preItem.image_path}`
          str += `\r\n详情：${preItem.details_image_path}`
        }
      }
      // 删除
      for (const i in proVal.tableData) {
        const proItem = proVal.tableData[i]
        if (!preVal.tableData.some(item=>item.id === proItem.id)) {
          has && (str += "\r\n---");has=true
          str += `\r\n删除：【${proItem.app_id}】，${proItem.title}，${this.getJumpName(proItem.jump_id)}`
          str += `\r\n上架：${new Date(proItem.start_time*1000).toLocaleString()} - ${new Date(proItem.end_time*1000).toLocaleString()}`
          str += `\r\n图片：${proItem.image_path}`
          str += `\r\n详情：${proItem.details_image_path}`
        }
      }
      // console.log(str,JSON.stringify(preVal),JSON.stringify(proVal))
      return str
    },
    configCheck() {
      if (this.editForm.data.title === '') {
        this.errmsg("请填写标题")
        return false
      }
      if (this.editForm.data.sort_id <= 0) {
        this.errmsg("请海报排序")
        return false
      }
      if (this.editForm.data.image_path === '') {
        this.errmsg("请填写海报入口图")
        return false
      }

      if (this.editForm.data.jump_id === 1 && this.editForm.data.details_image_path=== '') {
        this.errmsg("请上传海报详情图")
        return false
      }

      if (this.editForm.data.jump_id === 2 &&  this.editForm.data.game_id <= 0) {
         this.errmsg("请选择子游戏")
        return false
      }
      if (this.editForm.data.jump_id === 3 &&  this.editForm.data.game_id <= 0) {
        this.errmsg("请选择比赛赛事")
        return false
      }
      return true
    }
  }
}
</script>
