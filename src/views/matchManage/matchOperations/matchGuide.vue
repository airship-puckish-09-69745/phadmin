<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>

    <el-row style="margin: 15px 0;">
      AppId <el-select v-model="searchFilter.app_id" filterable placeholder="请选择" size="small" style="margin-right: 12px; width: 300px" @change="handleUpdateSearchAppid">
        <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
      </el-select>
      <!-- <el-button size="mini" type="primary" icon="el-icon-search" @click="getAppGuideData" /> -->
      <!-- <el-button style="float: right;" size="mini" type="primary" icon="el-icon-edit" @click="showForm(searchFilter.app_id)">编辑所有场景</el-button> -->
      <el-button style="float: right;" size="mini" type="success" icon="el-icon-plus" @click="showForm(0)" />
      <!-- <el-button v-else style="float: right;" size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteAll" /> -->
    </el-row>

    <el-row>
      <el-table :data="appGuideData" border stripe :header-cell-style="libShow.DefaultTableHeadClass" :cell-style="libShow.TableCell(10)">
        <el-table-column prop="app_id" label="AppId" width="200" />
        <el-table-column prop="scheme_title" label="配置标题" />

        <el-table-column fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showForm(scope.row.id)" />
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id, false)" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :title="editForm.title" :visible.sync="editForm.visible" :close-on-click-modal="false" width="80%" :close-on-press-escape="false">
      <el-form :model="editForm.data" label-width="120px" size="mini">
        <!-- <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;"> -->

        <el-form-item label="AppId：" :required="true">
          <el-select v-model="editForm.data.app_id" filterable placeholder="请选择" size="small" style="margin-right: 12px; width: 300px" :disabled="!editForm.isAdd" @change="handleUpdateAppid">
            <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置标题：" :required="true">
          <el-input v-model="editForm.data.scheme_title" size="mini" placeholder="填写配置标题" />
        </el-form-item>
        <el-form-item label="推荐场景：" :required="true">
          <el-collapse v-model="activeCollapseIndex">
            <el-collapse-item v-for="(item, schemeIndex) in editForm.data.scheme_records" :key="item.value" :title="item.label" :name="item.value">
              <el-button style="margin-bottom: 8px;" type="success" size="mini" @click="addGameGuideCfg(item)">添加游戏</el-button>
              <div v-if="item.scene_id == 3 || item.scene_id == 4" style="margin-bottom: 8px;">
                开赛剩余时间(秒):
                <el-input v-model.number="item.left_time" style="width: 200px;" size="mini" placeholder="填写时间(秒):" />
              </div>
              <el-table :data="item.records" border stripe :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '35px' }" :cell-style="libShow.TableCell(0)" style="width: 100%;line-height:35px;">
                <el-table-column prop="index" label="序号" width="50" />
                <el-table-column prop="game_id" label="游戏名">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.game_id" filterable placeholder="请选择" size="mini" @change="handleUpdateGame(scope.row.game_id, schemeIndex, scope.$index)" @focus="onGameFouces">
                      <el-option v-for="game in appGameOptions" :key="game.value" :label="GetGameName(game.game_id)" :value="game.game_id" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="sort_id" label="排序" width="120">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.sort_id" style="width: 80px;" size="mini" placeholder="填写排序值" />
                  </template>
                </el-table-column>

                <el-table-column label="游戏图标URL" prop="image_path" width="130" :required="true">
                  <template slot-scope="scope">
                    <!-- <ImagePicker v-model="scope.row.image_path" /> -->
                    <img :src="scope.row.image_path" width="100%">
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="removeGameGuideItme(schemeIndex, scope.$index)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

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
// import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import Compare from '@/components/Compare'

import { getAllCommonGameConfig } from '@/utils/common-game-config'

const LOCAL_APPID_KEY = 'match-guide/appid' // 缓存appid的key
export default {
  components: { Compare, Publish },
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
      searchFilter: {
        app_id: '' // 必填，缓存本地
      },
      csCfgs: [],
      showCsCfgs: [],
      raw: {},
      limit: 10,
      total: 0,
      page: 1,
      appidInfoCfgs: [],
      editForm: {
        visible: false,
        title: '',
        isAdd: false,
        data: {
          app_id: '',
          scheme_title: '',
          scheme_records: [],
          associate_key: '',
        }
      },
      copyDialog: {
        visible: false,
        form: {
          srcAppId: '',
          targetAppId: ''
        }
      },
      schemeDialog: {
        updateIndex: null,
        visible: false,
        form: {
          label: '',
          record_name: '',
          records: []
        }
      },
      AttrNames: {
      },
      gameGuideCfgs: [],
      guideList: [],
      appGuideData: [], // 根据appId从guideList匹配之后的数据
      guideRecord: [],

      useSceneCfg: [
        { 'label': '【tongits】投注限制-弹窗', 'value': 1 },
        { 'label': '【tongits】大厅无次数-弹窗', 'value': 2 },
        { 'label': '【tongits】大厅无次数+报大赛-弹窗', 'value': 3 },
        { 'label': '【tongits】等待界面-弹窗', 'value': 4 },
        { 'label': '【tongits】结算界面-弹窗', 'value': 5 },
        { 'label': '【tongits】比赛内内嵌老虎机-弹窗', 'value': 6 },
        { 'label': '【tongits】比赛大厅页面-弹窗', 'value': 7 }
      ],
      activeCollapseIndex: '',
      subKey: 'match_guide_list_new',
      gameConfigList: [], // 游戏公共配置的列表
      appGameOptions: []// app_id下的游戏icon配置列表
    }
  },
  computed: {
  },
  created() {
    getAllCommonGameConfig().then(data => {
      // console.log('getAllCommonGameConfig: ', data.gid_image_resource)
      this.gameConfigList = data.gid_image_resource
      this.getAppGameOptions()
    })
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    this.getBeginMatchCfgs()
    this.getGameAll()
  },
  mounted() {
    this.getAppidInfoCfg()
    this.getFilterAppId()
    this.getList()
    this.getBeginMatchCfgs()
  },
  methods: {
    /**
     * 场景中选择游戏的时候，如果没有选择appid，弹出提示
     */
    onGameFouces() {
      if (this.editForm.data.app_id === '') {
        console.log('选择游戏之前请先选择appid')
        this.$message({
          message: '选择游戏之前请先选择appid',
          type: 'warning',
          duration: 4000
        })
      }
    },
    /**
     * 对单个场景的游戏进行编辑
     * @param index
     */
    showEditSchemeDialog(index) {
      // alert(index)
      this.schemeDialog.visible = true
      this.schemeDialog.updateIndex = index
      this.schemeDialog.form = {
        ...this.appGuideData.scheme_records[index]
      }
      //console.log("对单个场景的游戏进行编辑 ", this.schemeDialog)
    },
    handleUpdateAppid(appid) {
      this.getAppGameOptions()
      this.getAppGuideData()
      this.editForm.data.scheme_records.forEach(item => {
        item.record_name = ''
        item.records = []
      })
    },
    /**
     * 通过当前选择的app_id获取icon配置列表
     */
    getAppGameOptions() {
      this.appGameOptions = []
      const currentCfg = this.gameConfigList.find(item => item.app_id === this.editForm.data.app_id)
      // 如果没有配置，currentCfg === null
      if (!currentCfg) {
        this.appGameOptions = []
        return
      }
      this.appGameOptions = currentCfg.gid_image_list
      // this.appGameOptions.forEach(item => {
      //   item.value = parseInt(item.game_id)
      // })
      //console.log('this.appGameOptions==>', this.appGameOptions)
    },
    /**
     * 从本地缓存获取appId
     * 如果没有缓存，默认取第一个
     */
    getFilterAppId() {
      const localData = localStorage.getItem(LOCAL_APPID_KEY)
      this.searchFilter.app_id = localData ? parseInt(localData) : this.appidInfoCfgs[0].value
    },
    getAppidInfoCfg() {
      this.appidInfoCfgs = [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ]
    },
    /**
     * 搜索框appid更新时更新当前table数据
     * @param app_id
     */
    handleUpdateSearchAppid(app_id) {
      console.log('appid==>', app_id)
      localStorage.setItem(LOCAL_APPID_KEY, app_id)
      this.getAppGuideData()
    },
    /**
     * guideList匹配app_id相同的数据
     */
    getAppGuideData() {
      const appGuideData = this.guideList.filter(item => item.app_id === this.searchFilter.app_id)
      //console.log("getAppGuideData  ",appGuideData)
      this.appGuideData = appGuideData
    },
    /**
     * 场景选择游戏之后，必须更新对应的icon
     * @param game_id
     * @param schemeIndex scheme_records的index
     * @param index 游戏的index
     */
    handleUpdateGame(game_id, schemeIndex, index) {
      const image_path = this.appGameOptions.find(item => item.game_id === game_id).image_path
      // console.log('game_id==>', game_id)
      // console.log('index==>', index)
      this.editForm.data.scheme_records[schemeIndex].records[index].image_path = image_path
      // console.log(this.editForm.scheme_records[schemeIndex])
      // console.log(this.editForm.scheme_records[schemeIndex].records[index])
      // console.log(this.editForm.scheme_records[schemeIndex].scheme_records[index])
    },
    handleUpdateSchemeGame(game_id, index) {
      this.schemeDialog.form.records[index].image_path = this.appGameOptions.find(item => item.game_id === game_id).image_path
    },
    /**
     * 编辑场景之后保存
     */
    handleSaveScheme() {
      // console.log(this.appGuideData.scheme_records[this.schemeDialog.updateIndex])
      if (this.configCheck(this.schemeDialog.updateIndex)) {
        // console.log(this.schemeDialog.form)
        // return
        this.appGuideData.scheme_records[this.schemeDialog.updateIndex] = this.schemeDialog.form
        this.updateRequest(() => {
          this.schemeDialog.visible = false
        })
      }
    },
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

          // console.log('this.gameGuideCfgs: ', this.gameGuideCfgs)
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
            //console.log('guideList: ', this.guideList)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data

          this.getAppGuideData()
        }
      })
    },
    GetGameName(gameId) {
      // console.log('gameId: ', gameId)
      // console.log('this.gameGuideCfgs: ', this.gameGuideCfgs)
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

    // addSchemeGameGuideCfg(item) {},
    addGameGuideCfg(item) {
      //console.log("editForm.data.scheme_records ",this.editForm.data.scheme_records)
      let index = 0
      if (item.records.length > 0) {
        index = item.records.length
      }
      index++
      const newGame = {
        index: index,
        sort_id: '',
        game_id: '',
        image_path: ''
      }
      if (item.value === 3 || item.value === 4) {
        newGame.left_time = 0
      }
      item.records.push(newGame)
      //console.log(item)
    },

    removeGameGuideItme(schemeIndex, gameIndex) {
      const game = this.editForm.data.scheme_records[schemeIndex].records[gameIndex]
      this.$confirm(`确定删除【${this.GetGameName(game.game_id)}】吗？`, '删除游戏', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editForm.data.scheme_records[schemeIndex].records.splice(gameIndex, 1)
      })
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增配置'
        // this.editForm.scheme_title = ''
        this.editForm.data = {
          app_id: '',
          id: '',
          scheme_title: '',
          scheme_records: []
        }
        const scheme_records = this.useSceneCfg.map(scene => {
          const record = {
            label: scene.label,
            record_name: '',
            scene_id: scene.value,
            records: []
          }

          if (record.scene_id === 3 || record.scene_id === 4) {
            record.left_time = 0
          }
          return record
        })
        this.editForm.data.scheme_records = scheme_records
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
        this.guideRecord = []
      } else {
        // console.log('【guideList】：', this.guideList)
        const editData = {
          ...this.guideList.find(item => item.id === id)
        }
        this.editForm.data.app_id = editData.app_id
        this.editForm.data.id = editData.id
        // this.editForm.data.scheme_records = editData.scheme_records
        // 由于保存的时候会去掉没有选择游戏的场景，但是显示的时候还是显示5个场景，所以这里必须填充空的场景
        const scheme_records = this.useSceneCfg.map(scene => {
          const existScheme = editData.scheme_records.find(item => item.scene_id === scene.value)
          const record = existScheme || {
            label: scene.label,
            record_name: '',
            scene_id: scene.value,
            records: []
          }
          record.label = this.useSceneCfg.find(item => item.value === record.scene_id).label
          if (record.scene_id === 3 || record.scene_id === 4) {
            record.left_time = 0
          }
          return record
        })
        this.editForm.data.scheme_records = scheme_records
        this.editForm.data.scheme_title = editData.scheme_title
        this.editForm.data.associate_key = editData.associate_key
        this.editForm.title = '编辑推荐配置'
        this.editForm.isAdd = false
      }
      this.getAppGameOptions()
      this.editForm.visible = true
      //console.log("编辑结束  ",this.editForm)
    },
    saveMatch() {
      const _this = this
      if (!this.configCheck()) {
        return
      }
      let data = null
      if (this.editForm.isAdd === true) {
        data = {
          app_id: _this.editForm.data.app_id,
          id: new Date().setSeconds(0),
          associate_key: (new Date().setSeconds(0)).toString(),
          scheme_records: _this.editForm.data.scheme_records.filter(item => item.records.length > 0),
          scheme_title: _this.editForm.data.scheme_title
        }
        data.scheme_records.forEach(item => {
          item.record_name = `[${item.records.map(record => _this.GetGameName(record.game_id)).join(',')}]`
        })
        this.guideList.push(data)
      } else {
        let updateIndex = 0
        this.guideList.forEach((item, index) => {
          if (item.id === this.editForm.data.id) {
            updateIndex = index
            return
          }
        })
        _this.editForm.data.scheme_records = _this.editForm.data.scheme_records.filter(item => {
          item.records.sort((m, n) => m.sort_id - n.sort_id)
          return item.records.length > 0
        })
        this.guideList[updateIndex] = _this.editForm.data
      }

      // console.log(this.editForm)
      // return

      this.updateRequest(() => {
        this.editForm.visible = false
      })
    },
    /**
     * 删除一个app_id下的所有配置
     */
    handleDeleteAll() {
      const appName = this.appidInfoCfgs.find(item => item.value === this.searchFilter.app_id).label
      this.$confirm(`您确定要删除【${appName}-${this.searchFilter.app_id}】的所有配置吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.guideList.forEach((item, index) => {
          if (item.app_id === this.searchFilter.app_id) {
            this.guideList.splice(index, 1)
            this.updateRequest()
            return
          }
        })
      })
    },
    handleDelete(id) {
      let deleteIndex = 0
      const deleteData = this.guideList.find((item, index) => {
        if (item.id === id) {
          deleteIndex = index
          return true
        }
      })
      this.$confirm(`您确定要将【${deleteData.scheme_title}}】删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.guideList.splice(deleteIndex, 1)

        this.updateRequest()
      }).catch(() => {
        console.log('取消')
      })
    },
    updateRequest(cb) {
      this.raw.Data = JSON.stringify(this.guideList)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.raw
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('修改配置成功！')
          this.getList()
        } else {
          Message.error('修改配置失败！')
        }

        if (cb) cb()
      })
    },
    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    /**
     * 提交保存之前检查表单中至少有一个场景填写了完整的游戏信息
     */
    configCheck() {
      let gameChecked = true
      let timeChecked = true

      const data = this.editForm.data
      data.scheme_records.forEach(item => {
        item.records.find(game => {
          if (game.sort_id === '' || game.image_path === '' || game.game_id === '') {
            gameChecked = false
            return true
          }
        })
      })
      if ((data.scene_id === 3 || data.scene_id === 4) && (!data.left_time || data.left_time <= 0)) {
        timeChecked = false
      }

      if (!data.scheme_title) {
        this.errmsg('需要填写配置标题')
        return false
      }
      if (!gameChecked) {
        this.errmsg('有空白的配置信息,请检查配置')
        return false
      }
      if (!timeChecked) {
        this.errmsg('当前场景需要填写时间')
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
