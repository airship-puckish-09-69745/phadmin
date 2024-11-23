<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>

    <el-row style="margin-top: 25px;padding-top:25px;">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="showForm(0)">
        添加推荐配置
      </el-button>
    </el-row>

    <el-row>
      <el-table
        :data="guideList"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 60%"
      >
        <el-table-column
          prop="record_name"
          label="赛事推荐"
        >
        </el-table-column>

        <el-table-column
          prop="scene_id"
          label="推荐场景"
        >
          <template slot-scope="scope">
            {{ getSceneName(scope.row.scene_id,scope.row.left_time) }}
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
    >
      <el-form :model="editForm.data" label-width="200px" size="mini">
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">

          <el-form-item label="推荐场景：" :required="true">
            <el-select v-model="editForm.scene_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in useSceneCfg"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.scene_id == 3 || editForm.scene_id == 4" label="开赛剩余时间(秒):" :required="true">
            <el-input v-model.number="editForm.left_time" style="width: 200px;" size="mini" placeholder="填写时间" />
          </el-form-item>


          <legend>引导推荐</legend>
          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addGameGuideCfg()">添加游戏</el-button>
          <el-table
            :data="guideRecord"
            border
            stripe
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'35px'}"
            :cell-style="libShow.TableCell(0)"
            style="width: 100%;line-height:35px;"
          >
            <el-table-column
              prop="index"
              label="序号"
              width="50"
            />
            <el-table-column
              prop="game_id"
              label="游戏名"
              width="400"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.game_id" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in gameGuideCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort_id"
              label="排序"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.sort_id" style="width: 80px;" size="mini" placeholder="填写排序值" />
              </template>
            </el-table-column>

            <el-table-column label="游戏图标URL" prop="image_path" :required="true">
              <template slot-scope="scope">
                <ImagePicker v-model="scope.row.image_path" />
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeGameGuideItme(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveMatch()">保存推荐配置</el-button>
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

import { $libDate, $libShow } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import Compare from '@/components/Compare'

export default {
  components: { Compare, Publish, ImagePicker },
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
          imagePath: ''
        },
        scene_id: 0,
        left_time: 0
      },
      AttrNames: {
      },
      gameGuideCfgs: [],
      guideList: [],
      guideRecord: [],

      useSceneCfg: [
        { 'label': '投注限制-弹窗', 'value': 1 },
        { 'label': '大厅无次数-弹窗', 'value': 2 },
        { 'label': '大厅无次数+报大赛-弹窗', 'value': 3 },
        { 'label': '等待界面-弹窗', 'value': 4 },
        { 'label': '结算界面-弹窗', 'value': 5 }
      ],
      subKey: 'match_guide_list'
    }
  },
  computed: {
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.getBeginMatchCfgs()
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
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.gameGuideCfgs = []
          for (var i = 0; i < objs.length; i++) {
            this.gameGuideCfgs.push({
              'label': objs[i].Name,
              'value': objs[i].Gid
            })
          }
        }
      })
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
            this.csCfgs = []
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
            this.guideList = cfg
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data
        }
      })
    },
    GetGameName(gameId) {
      var gameName = ''
      for (var i = 0; i < this.gameGuideCfgs.length; i++) {
        if (this.gameGuideCfgs[i].value === gameId) {
          gameName = this.gameGuideCfgs[i].label
          break
        }
      }
      return gameName
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },

    addGameGuideCfg() {
      let index = 0
      if (this.guideRecord.length > 0) {
        index = this.guideRecord.length
      }
      index++
      this.guideRecord.push({
        index: index,
        sort_id: '',
        game_id: '',
        image_path: ''
      })
    },

    removeGameGuideItme(index) {
      this.guideRecord.splice(index, 1)
      if (this.guideRecord.length > 0) {
        for (var i = 0; i < this.guideRecord.length; i++) {
          this.guideRecord[i].index = i + 1
        }
      }
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增游戏推荐配置'
        this.editForm.data = {
          id: 0,
          name: '',
          imagePath: ''
        }
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
        this.guideRecord = []
      } else {
        let editData = {}
        this.editForm.title = '编辑推荐配置'
        this.editForm.isAdd = false
        for (var i = 0; i < this.guideList.length; i++) {
          if (this.guideList[i].id === id) {
            editData = this.guideList[i]
            break
          }
        }
        this.editForm.data = {
          id: editData.id,
          name: editData.name
        }
        this.guideRecord = editData.records
        this.editForm.scene_id = editData.scene_id || 1
        this.editForm.left_time = editData.left_time || 0
      }
      this.editForm.visable = true
    },
    saveMatch() {
      if (!this.configCheck()) {
        return
      }
      var record_name = '['
      var record_key = ''
      if (this.guideRecord.length > 0) {
        for (var i = 0; i < this.guideRecord.length; i++) {
          record_name = record_name + this.GetGameName(this.guideRecord[i].game_id)
          record_key = record_key + (this.guideRecord[i].game_id).toString()

          if (i !== this.guideRecord.length - 1) {
            record_name += ','
          }
        }
      }
      record_name = record_name + ']'
      if (this.editForm.isAdd === false) {
        for (let i = 0; i < this.guideList.length; i++) {
          if (this.guideList[i].id === this.editForm.data.id) {
            this.guideList[i].record_name = record_name
            this.guideList[i].scene_id = this.editForm.scene_id || 1
            this.guideList[i].left_time = this.editForm.left_time || 0
            break
          }
        }
      } else {
        this.guideList.push(
          {
            'id': new Date().setSeconds(0),
            'records': this.guideRecord,
            'record_name': record_name,
            'associate_key': (new Date().setSeconds(0)).toString(),
            'scene_id': this.editForm.scene_id || 1,
            'left_time': this.editForm.left_time || 0
          }
        )
      }

      this.raw.Data = JSON.stringify(this.guideList)
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
      this.$confirm('您确定要将该配置删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        for (const key in this.guideList) {
          if (this.guideList[key].id === id) {
            continue
          }
          newList.push(this.guideList[key])
        }
        this.guideList = newList
        this.raw.Data = JSON.stringify(this.guideList)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: this.raw
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除配置成功！')
            this.getList()
          } else {
            Message.error('删除配置失败！')
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
      if (this.guideRecord.length === 0) {
        this.errmsg('需要填写推荐游戏配置信息')
        return false
      }
      for (var i = 0; i < this.guideRecord.length; i++) {
        if (this.guideRecord[i].sort_id == '' || this.guideRecord[i].image_path == '' || this.guideRecord[i].game_id == '') {
          this.errmsg('需要填写推荐游戏配置信息')
          return false
        }
      }
      if (this.editForm.scene_id <= 0) {
        this.errmsg("请选择场景推荐")
        return false
      }

      if ((this.editForm.scene_id === 3 || this.editForm.scene_id === 4) && this.editForm.left_time <= 0) {
        this.errmsg( "当前场景需要填写时间")
        return false
      }
      return true
    },
    getSceneName(scene_id, left_time) {
      let sceneName = ''
      for (var i = 0; i < this.useSceneCfg.length; i++) {
        if (this.useSceneCfg[i].value === scene_id) {
          sceneName = this.useSceneCfg[i].label
          if (scene_id === 3 && left_time > 0) {
            sceneName = sceneName + ' [距离开赛前' + left_time + '秒推荐 ]'
          }
          break
        }
      }
      return sceneName
    }
  }
}
</script>
