<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
      </el-form>
    </el-row>
    <el-row>
      <div style="height: 50px;">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="showForm(0)">添加赛事任务</el-button>
      </div>

      <el-table
        :data="posterList.tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 80%"
      >
        <el-table-column prop="id" label="赛事配置ID" />
        <el-table-column prop="name" label="赛事标题" />

        <el-table-column prop="match_type" label="赛事类型">
          <template slot-scope="scope">
            {{ getAppName(scope.row.match_type) }}
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
          <legend>赛事配置</legend>

          <el-form-item label="配置标题：" :required="true">
            <el-input v-model="editForm.data.name" style="width: 200px;" placeholder="填写配置标题" />
          </el-form-item>

          <el-form-item label="赛事类型：" :required="true">
            <el-select v-model="editForm.data.match_type" placeholder="请选择" size="mini" :disabled="!editForm.isAdd" @change="selectMatchName()">
              <el-option
                v-for="item in matchInfoCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间：" :required="true">
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
          <el-form :model="editForm.data" label-width="300px" size="mini">
            <el-row>
            </el-row>
          </el-form>

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
        app_id: -1
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
        onceTime : '',
        data: {
          id: 0,
          name: '',
          app_id: 1000002,
          switch: 'true',
          channelId: [],
          game_id: 0,
          match_typ: 0
        }
      },
      AttrNames: {
      },
      gameCfgs: [
        { 'value': 2031, 'label': 'tongits' }
      ],

      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      matchInfoCfgs: [
        { 'value': 1, 'label': 'gtcc活动开启结束时间' },
        { 'value': 2, 'label': 'preleminary资格赛开始结束时间' },
        { 'value': 3, 'label': 'qualifier线上决赛开始结束时间' }
      ],
      jumpCfgs: [
        { 'value': 1, 'label': 'Events' },
        { 'value': 2, 'label': 'Free' },
        { 'value': 3, 'label': 'Master' }
      ],
      statusCfgs: [
        { 'value': 0, 'label': '关闭' },
        { 'value': 1, 'label': '开启' }
      ],

      channelIdCfgs: [
        { 'value': 'BP', 'label': 'BP' },
        { 'value': 'AP', 'label': 'AP' },
        { 'value': 'GP', 'label': 'GP' },
        { 'value': 'TP', 'label': 'TP' },
        { 'value': 'PG', 'label': 'PG' },
        { 'value': 'Dev', 'label': 'Dev' }
      ],
      //比赛全局ID集合
      matchUniqueIdCfgs: [
        { 'value': 10001, 'label': '188Free' },
        { 'value': 10002, 'label': '12888Free' },
        { 'value': 10003, 'label': 'P10' },
        { 'value': 10004, 'label': 'P20' },
        { 'value': 10005, 'label': 'P40' },
        { 'value': 10006, 'label': 'P100' },
        { 'value': 10007, 'label': 'P300' },
        { 'value': 10008, 'label': 'GTCC 2005' }
        ],
      guideShowCfgs: [], // 赛事推荐相关 跟AppId 关联

      subKey: 'match_gt_list_cfg'
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
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    resetSearch() {
      this.form.app_id = -1
      this.form.status = -1
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
          console.log(response.Data)
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
      var statusName = ''
      for (var i = 0; i < this.statusCfgs.length; i++) {
        if (this.statusCfgs[i].value == status) {
          statusName = this.statusCfgs[i].label
          break
        }
      }
      return statusName
    },

    getAppName(id) {
      var appName = ''
      for (var i = 0; i < this.matchInfoCfgs.length; i++) {
        if (this.matchInfoCfgs[i].value == id) {
          appName = this.matchInfoCfgs[i].label
          break
        }
      }
      appName = appName + '[' + id + ']'
      return appName
    },
    getMatchName(id) {
      var jumpName = ''
      for (var i = 0; i < this.matchUniqueIdCfgs.length; i++) {
        if (this.matchUniqueIdCfgs[i].value == id) {
          jumpName = this.matchUniqueIdCfgs[i].label
        }
      }
      return jumpName
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增赛事活动配置'
        this.editForm.data = {
          id: 0,
          name: '',
          match_typ: 0,
          start_time: 0,
          end_time: 0
        }
        this.editForm.isAdd = true
        this.selectMatchName()
      } else {
        let editData = {}
        this.editForm.title = '编辑赛事活动配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === id) {
            editData = this.posterList.tableData[i]
            break
          }
        }
        this.editForm.onceTime = [new Date(editData.start_time * 1000), new Date(editData.end_time * 1000)]
        this.editForm.data = editData
        this.selectMatchName()
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
      //var saveTime = new Date().getTime()
      if (this.editForm.isAdd === false) {
        for (var i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === this.editForm.data.id) {
            this.posterList.tableData[i].name = this.editForm.data.name
            this.posterList.tableData[i].match_type = this.editForm.data.match_type
            this.posterList.tableData[i].start_time = bTime
            this.posterList.tableData[i].end_time = eTime
          }
        }
      } else {
        this.posterList.tableData.push(
          {
            'id': new Date().setSeconds(0),
            'name': this.editForm.data.name,
            'match_type': this.editForm.data.match_type,
            'start_time': bTime,
            'end_time': eTime
          }
        )
      }
      this.raw.Data = JSON.stringify(this.posterList)
      console.log("保存数据 ",this.posterList)
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
      //1 分类跳转 2:跳转子游戏
      if (this.editForm.data.jump_id === 2) {
        this.editForm.data.match_cfg_id = 0
        this.editForm.data.game_id = 0
      } else if (this.editForm.data.jump_id === 1) {
        this.editForm.data.match_cfg_id = 0
        this.editForm.data.game_id = 0
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

    configCheck() {
      if (this.editForm.onceTime === '') {
        this.errmsg("请选择过期时间")
        return false
      }
      if (this.editForm.data.name === '') {
        this.errmsg("请填写标题")
        return false
      }
      if (this.editForm.data.match_type === 0) {
        this.errmsg("请选择赛事类型")
        return false
      }
      return true
    }
  }
}
</script>
