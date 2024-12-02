<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object"
        :attr-names="AttrNames" />
    </el-row>

    <el-row style="margin: 15px 0;">
      AppId <el-select v-model="searchFilter.app_id" filterable placeholder="请选择" size="small" style="margin-right: 12px; width: 300px" @change="handleUpdateAppid">
        <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="showForm(0)" />
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="showForm(0)">复制配置列表</el-button>
      <el-button style="float: right;" size="mini" type="success" icon="el-icon-plus" @click="showForm(0)" />
    </el-row>

    <el-row>
      <el-table :data="guideList" border stripe :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)" style="width: 60%">
        <el-table-column prop="scheme_title" label="配置标题">
        </el-table-column>

        <!-- <el-table-column prop="scene_id" label="推荐场景">
          <template slot-scope="scope">
            {{ getSceneName(scope.row.scene_id, scope.row.left_time) }}
          </template>
</el-table-column> -->

        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" @click="showForm(scope.row.id)">编辑</el-button>

            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :title="editForm.title" :visible.sync="editForm.visable" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="editForm.data" label-width="120px" size="mini">
        <!-- <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;"> -->

        <el-form-item label="配置标题：" :required="true">
          <el-input v-model="editForm.scheme_title" size="mini" placeholder="填写配置标题" />
        </el-form-item>
        <el-form-item label="推荐场景：" :required="true">
          <el-collapse v-model="activeCollapseIndex">
            <el-collapse-item v-for="item in editForm.scheme_records" :key="item.value" :title="item.label"
              :name="item.value">
              <el-button style="margin-bottom: 8px;" type="success" size="mini"
                @click="addGameGuideCfg(item)">添加游戏</el-button>
              <div v-if="item.scene_id == 3 || item.scene_id == 4" style="margin-bottom: 8px;">
                开赛剩余时间(秒):
                <el-input v-model.number="item.left_time" style="width: 200px;" size="mini" placeholder="填写时间(秒):" />
              </div>
              <el-table :data="item.records" border stripe :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{ height: '35px' }" :cell-style="libShow.TableCell(0)"
                style="width: 100%;line-height:35px;">
                <el-table-column prop="index" label="序号" width="50" />
                <el-table-column prop="game_id" label="游戏名">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.game_id" placeholder="请选择" size="mini">
                      <el-option v-for="game in appGameOptions" :key="game.value" :label="game.label"
                        :value="game.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="sort_id" label="排序" width="100">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.sort_id" style="width: 80px;" size="mini" placeholder="填写排序值" />
                  </template>
                </el-table-column>

                <el-table-column label="游戏图标URL" prop="image_path" width="130" :required="true">
                  <template slot-scope="scope">
                    <ImagePicker v-model="scope.row.image_path" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="removeGameGuideItme(scope.$index)">移除</el-button>
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
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import Compare from '@/components/Compare'

import { getAllCommonGameConfig } from '@/utils/common-game-config'

const LOCAL_APPID_KEY = 'match-guide/appid' // 缓存appid的key
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
        visable: false,
        title: '',
        scheme_title: '',
        isAdd: false,
        data: {
          id: 0,
          name: '',
          imagePath: ''
        },
        scheme_records: [],
        scene_id: 0,
        left_time: 0
      },
      AttrNames: {
      },
      gameGuideCfgs: [],
      guideList: [],
      appGuideData: [], // 根据appId从guideList匹配之后的数据
      guideRecord: [],

      useSceneCfg: [
        { 'label': '投注限制-弹窗', 'value': 1 },
        { 'label': '大厅无次数-弹窗', 'value': 2 },
        { 'label': '大厅无次数+报大赛-弹窗', 'value': 3 },
        { 'label': '等待界面-弹窗', 'value': 4 },
        { 'label': '结算界面-弹窗', 'value': 5 }
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
    this.getList(this.getAppGuideData)
    this.getBeginMatchCfgs()
  },
  methods: {
    handleUpdateAppid(appid) {
      console.log('appid==>', appid)
      localStorage.setItem(LOCAL_APPID_KEY, appid)
      this.getAppGameOptions()
      this.getAppGuideData()
    },
    /**
     * 通过当前选择的app_id获取icon配置列表
     */
    getAppGameOptions() {
      const currentCfg = this.gameConfigList.find(item => item.app_id === this.searchFilter.app_id)
      // 如果没有配置，currentCfg === null
      if (!currentCfg) {
        this.appGameOptions = []
        return
      }
      this.appGameOptions = currentCfg.gid_image_list
      this.appGameOptions.forEach(item => {
        item.label = `${this.GetGameName(item.game_id)}-${item.game_id}`
      })
      console.log('this.appGameOptions==>', this.appGameOptions)
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
     * guideList匹配app_id相同的数据
     */
    getAppGuideData() {
      const appGuideData = this.guideList.filter(item => item.app_id === this.searchFilter.app_id)
      console.log(appGuideData)
      this.appGuideData = appGuideData
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
    getList(cb) {
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
            console.log('guideList: ', this.guideList)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.raw = response.Data
          }
          this.raw = response.Data

          if (cb) cb()
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

    addGameGuideCfg(item) {
      // let index = 0
      // if (this.guideRecord.length > 0) {
      //   index = this.guideRecord.length
      // }
      // index++
      // this.guideRecord.push({
      //   index: index,
      //   sort_id: '',
      //   game_id: '',
      //   image_path: ''
      // })

      console.log(item)
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
      if (item.value == 3 || item.value == 4) {
        newGame.left_time = 0
      }
      item.records.push(newGame)
      console.log(item)
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
        this.editForm.scheme_title = ''
        this.editForm.data = {
          id: 0,
          name: '',
          imagePath: ''
        }
        this.editForm.scheme_records = this.useSceneCfg.map(scene => {
          const record = {
            label: scene.label,
            record_name: '',
            scene_id: scene.value,
            records: []
          }

          if (record.scene_id == 3 || record.scene_id == 4) {
            record.left_time = 0
          }
          return record
        })
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
        this.guideRecord = []
      } else {
        console.log('【guideList】：', this.guideList)
        const editData = {
          ...this.guideList.find(item => item.id === id)
        }
        this.editForm.id = id
        this.editForm.scheme_records = editData.scheme_records
        this.editForm.scheme_title = editData.scheme_title
        this.editForm.associate_key = editData.associate_key
        this.editForm.title = '编辑推荐配置'
        this.editForm.isAdd = false
        console.log(this.editForm)
        // for (var i = 0; i < this.guideList.length; i++) {
        //   if (this.guideList[i].id === id) {
        //     editData = this.guideList[i]
        //     break
        //   }
        // }
        // this.editForm.data = {
        //   id: editData.id,
        //   name: editData.name
        // }
        // this.guideRecord = editData.records
        // this.editForm.scene_id = editData.scene_id || 1
        // this.editForm.left_time = editData.left_time || 0
      }
      this.editForm.visable = true
    },
    saveMatch() {
      const _this = this
      // if (!this.configCheck()) {
      //   return
      // }
      // var record_name = '['
      // var record_key = ''
      // if (this.guideRecord.length > 0) {
      //   for (var i = 0; i < this.guideRecord.length; i++) {
      //     record_name = record_name + this.GetGameName(this.guideRecord[i].game_id)
      //     record_key = record_key + (this.guideRecord[i].game_id).toString()

      //     if (i !== this.guideRecord.length - 1) {
      //       record_name += ','
      //     }
      //   }
      // }
      // record_name = record_name + ']'
      // if (this.editForm.isAdd === false) {
      //   for (let i = 0; i < this.guideList.length; i++) {
      //     if (this.guideList[i].id === this.editForm.data.id) {
      //       this.guideList[i].record_name = record_name
      //       this.guideList[i].scene_id = this.editForm.scene_id || 1
      //       this.guideList[i].left_time = this.editForm.left_time || 0
      //       break
      //     }
      //   }
      // } else {
      //   this.guideList.push(
      //     {
      //       'id': new Date().setSeconds(0),
      //       'records': this.guideRecord,
      //       'record_name': record_name,
      //       'associate_key': (new Date().setSeconds(0)).toString(),
      //       'scene_id': this.editForm.scene_id || 1,
      //       'left_time': this.editForm.left_time || 0
      //     }
      //   )
      // }

      // console.log(this.editForm)
      if (!this.configCheck()) {
        return
      }
      let data = null
      if (this.editForm.isAdd === true) {
        data = {
          id: new Date().setSeconds(0),
          associate_key: (new Date().setSeconds(0)).toString(),
          scheme_records: _this.editForm.scheme_records,
          scheme_title: _this.editForm.scheme_title
        }
        data.scheme_records.forEach(item => {
          item.record_name = `[${item.records.map(record => _this.GetGameName(record.game_id)).join(',')}]`
        })
        this.guideList.push(data)
      } else {
        let updateIndex = 0
        data = this.guideList.find((item, index) => {
          updateIndex = index
          return item.id === _this.editForm.id
        })
        this.guideList[updateIndex] = data
      }
      console.log(this.guideList)
      // return

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
      let gameChecked = true
      let timeChecked = true
      this.editForm.scheme_records.forEach(record => {
        if (record.records.length === 0) {
          gameChecked = false
          return
        } else {
          for (var i = 0; i < record.records.length; i++) {
            if (record.records.sort_id == '' || record.records.image_path == '' || record.records.game_id == '') {
              gameChecked = false
            }
          }
        }

        if ((record.scene_id == 3 || record.scene_id == 4) && (!record.left_time || record.left_time <= 0)) {
          timeChecked = false
        }
      })
      if (!this.editForm.scheme_title) {
        this.errmsg('需要填写配置标题')
        return false
      }
      if (!gameChecked) {
        this.errmsg('需要填写推荐游戏配置信息')
        return false
      }
      if (!timeChecked) {
        this.errmsg('当前场景需要填写时间')
        return false
      }
      // if (this.guideRecord.length === 0) {
      //   this.errmsg('需要填写推荐游戏配置信息')
      //   return false
      // }
      // for (var i = 0; i < this.guideRecord.length; i++) {
      //   if (this.guideRecord[i].sort_id == '' || this.guideRecord[i].image_path == '' || this.guideRecord[i].game_id == '') {
      //     this.errmsg('需要填写推荐游戏配置信息')
      //     return false
      //   }
      // }
      // if (this.editForm.scene_id <= 0) {
      //   this.errmsg("请选择场景推荐")
      //   return false
      // }

      // if ((this.editForm.scene_id === 3 || this.editForm.scene_id === 4) && this.editForm.left_time <= 0) {
      //   this.errmsg( "当前场景需要填写时间")
      //   return false
      // }
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
