<template>
  <div class="common-game">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="{}" />
    </el-row>
    <el-row style="margin: 10px 0;">
      AppId <el-select v-model="searchFilter.app_id" filterable placeholder="请选择" size="small" style="margin-right: 12px; width: 300px" @change="handleUpdateAppid">
        <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch" />
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleShowCopyDialog">复制配置列表</el-button>
      <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleShowCreateDialog" />
    </el-row>
    <el-table :data="gameTableData" style="width: 100%">
      <!-- <el-table-column prop="id" label="ID" width="140" /> -->
      <el-table-column label="游戏(ID)" width="280">
        <template slot-scope="scope">
          <div>{{ GetGameName(scope.row.game_id) }}({{ scope.row.game_id }})</div>
        </template>
      </el-table-column>
      <el-table-column label="Icon">
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="100">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row, scope.$index)" />
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteGame(scope.row, scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin: 10px 0; text-align: right; color: #999">
      最后修改时间：{{ formatTime(allGameConfig.update_time) }}
    </el-row>

    <!-- 添加/编辑游戏弹窗 -->
    <el-dialog :title="formDialog.title" :visible.sync="formDialog.visible" width="420px" :before-close="handleCloseDialog">
      <div class="dialog-body">
        <!-- <el-table :data="formDialog.form.gid_image_list" style="width: 100%">
          <el-table-column label="选择游戏">
            <template slot-scope="scope">
              <el-select v-model="scope.row.game_id" filterable placeholder="请选择游戏" size="small" style="width: 100%;">
                <el-option v-for="(game, i) in gameGuideCfgs" :key="i" :label="game.label" :value="game.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="游戏Icon路径" width="130">
            <template slot-scope="scope">
              <ImagePicker v-model="scope.row.image_path" />
            </template>
          </el-table-column>
        </el-table> -->
        <el-form ref="form" :model="formDialog.form" label-width="130px">
          <el-form-item label="选择游戏" :rules="[{ required: true, message: '请选择游戏' }]">
            <el-select v-model="formDialog.form.game.game_id" filterable placeholder="请选择游戏" size="small" style="width: 100%;    " :disabled="formDialog.isedit">
              <el-option v-for="(game, i) in gameGuideCfgs" :key="i" :label="`${game.label}-${game.value}`" :value="game.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏Icon路径" :rules="[{ required: true, message: '请选择游戏游戏Icon' }]">
            <ImagePicker v-model="formDialog.form.game.image_path" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="复制配置"
      :visible.sync="copyDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="copyForm" :model="copyDialog.form" label-width="150px" size="small" inline :style="{width: '780px'}">
        <el-tabs type="card">
          <el-form-item label="从原始AppId" :required="true">
            <el-select v-model="copyDialog.form.srcAppId" style="width: 210px" placeholder="请选择" size="mini">
              <el-option
                v-for="item in appidInfoCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="复制到AppId" :required="true">
            <el-select v-model="copyDialog.form.targetAppId" style="width: 210px" placeholder="请选择" size="mini">
              <el-option
                v-for="item in appidInfoCfgs.filter(item => item.value !== copyDialog.form.srcAppId)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col>
              <span style="padding: 15px 20px 15px 0; border: 1px #0a76a4;">注意：复制操作完成后，需要点击发布按钮，将复制的新数据更新到线上；若状态为非上架状态，需先进行上架后点击发布</span>
            </el-col>
          </el-row>
          <el-row style="padding-top: 20px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="handleCopy">保存</el-button>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { $libDate } from '@/utils/common'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const LOCAL_APPID_KEY = 'common-game-config/appid' // 缓存appid的key
export default {
  components: {
    ImagePicker,
    Publish
  },
  data() {
    return {
      appidInfoCfgs: [],
      allGameConfig: {
        update_time: 1732780296, // 最后修改时间
        gid_image_resource: []
      }, // 完整的数据列表，表格的数据是根据当前选中的appid从这里拿的
      gameTableData: [],
      gameGuideCfgs: [],
      searchFilter: {
        app_id: '' // 必填，缓存本地
      },
      formDialog: {
        visible: false,
        title: '添加游戏',
        form: {
          app_id: '',
          game: {
            game_id: '',
            image_path: ''
          },
          update_index: 0, // 仅编辑时需要，确定修改的是哪一条数据
          isedit: false
        }
      },
      copyDialog: {
        visible: false,
        form: {
          srcAppId: '',
          targetAppId: ''
        }
      },
      raw: {},
      subKey: 'game_resource_common_cfg'
    }
  },
  mounted() {
    this.getGameAll()
    this.getAppidInfoCfg()
    this.getFilterAppId()
    this.getAllGameConfig(this.onSearch)
  },
  methods: {
    /**
     * 从本地缓存获取appId
     * 如果没有缓存，默认取第一个
     */
    getFilterAppId() {
      const localData = localStorage.getItem(LOCAL_APPID_KEY)
      this.searchFilter.app_id = localData ? parseInt(localData) : this.appidInfoCfgs[0].value
    },
    handleCopy() {
      console.log('handleCopy==>', this.copyDialog)
      if (!this.copyDialog.form.targetAppId) {
        Message.error('请选择目标AppId')
        return
      }

      const srcCfg = this.allGameConfig.gid_image_resource.find(item => item.app_id === this.copyDialog.form.srcAppId)
      const targetCfg = this.allGameConfig.gid_image_resource.find(item => item.app_id === this.copyDialog.form.targetAppId)
      // 如果复制空白数据，就会清空目标数据，直接删除目标数据
      if (!srcCfg) {
        this.allGameConfig.gid_image_resource.forEach((item, index) => {
          if (item.app_id === targetCfg.app_id) {
            this.allGameConfig.gid_image_resource.splice(index, 1)
            this.updateConfigData()
            this.copyDialog.visible = false
            return
          }
        })
        return
      }

      console.log('srcCfg==>', srcCfg)
      console.log('targetCfg==>', targetCfg)
      if (!targetCfg) {
        this.allGameConfig.gid_image_resource.push({
          app_id: this.copyDialog.form.targetAppId,
          gid_image_list: srcCfg.gid_image_list
        })
        this.updateConfigData()
        this.copyDialog.visible = false
      } else {
        this.allGameConfig.gid_image_resource.forEach(item => {
          if (item.app_id === targetCfg.app_id) {
            targetCfg.gid_image_list = srcCfg.gid_image_list
            this.updateConfigData()
            this.copyDialog.visible = false
            return
          }
        })
      }
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    onSearch() {
      console.log('【searchFilter】: ', this.searchFilter)
      this.getTableData()
    },
    handleUpdate(row, index) {
      console.log('row==>', row)
      this.formDialog.form = {
        id: row.id,
        app_id: this.searchFilter.app_id,
        game: {
          game_id: row.game_id,
          image_path: row.image_path
        },
        update_index: index
      }
      this.formDialog.title = '修改游戏'
      this.formDialog.visible = true
      this.formDialog.isedit = true
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
    handleUpdateAppid(appid) {
      localStorage.setItem(LOCAL_APPID_KEY, appid)
      this.onSearch()
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
            if (objs[i].Status === 2) {
              this.gameGuideCfgs.push({
                'label': objs[i].Name,
                'value': objs[i].Gid
              })
            }
          }
        }
      })
    },
    // handleAddGame() {
    //   this.formDialog.form.gid_image_list.push({
    //     image_path: '',
    //     game_id: ''
    //   })
    // },
    handleResetForm() {
      this.formDialog.title = '添加游戏'
      this.formDialog.form = {
        app_id: '',
        game: {
          game_id: '',
          image_path: ''
        }
      }
    },
    handleShowCopyDialog() {
      this.copyDialog.visible = true
      this.copyDialog.form.srcAppId = this.searchFilter.app_id
      this.copyDialog.form.targetAppId = ''
    },
    handleShowCreateDialog() {
      this.formDialog.visible = true
      this.formDialog.form.app_id = this.searchFilter.app_id
    },
    handleCloseDialog() {
      this.formDialog.visible = false
      this.formDialog.isedit = false
      this.handleResetForm()
    },
    handleConfirmDialog() {
      if (!this.checkForm()) {
        return
      }

      //console.log('【formDialog】: ', this.formDialog)
      this.allGameConfig.update_time = Math.round(Date.now() / 1000)
      let cfg = this.getCurrentConfig()
      // alert(cfg)
      // return
      if (this.formDialog.title === '添加游戏') {
        if (!cfg) {
          cfg = {
            app_id: this.formDialog.form.app_id,
            gid_image_list: [
              this.formDialog.form.game
            ]
          }
          this.allGameConfig.gid_image_resource.push(cfg)
        } else {
          cfg.gid_image_list.push(this.formDialog.form.game)
        }
        //console.log('【cfg】: ', cfg)
      } else {
        cfg.gid_image_list[this.formDialog.form.update_index] = this.formDialog.form.game
        this.allGameConfig.gid_image_resource.forEach(item => {
          if (item.app_id === this.formDialog.form.app_id) {
            item.gid_image_list = cfg.gid_image_list
          }
        })
        // console.log('【update】: ', cfg.gid_image_list[this.formDialog.form.update_index])
      }
      //console.log(this.allGameConfig)

      this.updateConfigData()
    },
    updateConfigData() {
      this.raw.Data = JSON.stringify(this.allGameConfig)
      // this.raw.Data = JSON.stringify({})
      console.log('raw: ', this.raw)
      // return

      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.raw
      }).then(response => {
        if (response.RetCode === 0) {
          const showMsg = '保存成功'
          Message.success(showMsg)
          this.getAllGameConfig(this.onSearch)
          this.formDialog.visible = false
          this.formDialog.isedit = false
          this.handleResetForm()
          return
        } else {
          const errMsg = '保存成功失败！'
          Message.error(errMsg + response.Data)
          this.handleResetForm()
          return
        }
      })
    },
    getTableData() {
      console.log(this.searchFilter.app_id)
      const currentConfig = this.getCurrentConfig()
      this.gameTableData = currentConfig ? currentConfig.gid_image_list : []
    },
    getCurrentConfig() {
      return this.allGameConfig.gid_image_resource.find(item => item.app_id === this.searchFilter.app_id)
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
    // 删除配置里面的游戏项
    handleDeleteGame(row, index) {
      // console.log(row, index)
      this.$confirm(`确定要删除【${this.GetGameName(row.game_id)}】吗？`, '删除游戏', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const cfg = this.getCurrentConfig()
        cfg.gid_image_list.splice(index, 1)
        this.updateConfigData()
      })
    },
    checkForm() {
      const form = this.formDialog.form
      if (!form.app_id) {
        this.errmsg('应用必须选择！')
        return false
      }

      let checkedGamesParams = true
      if (!form.game.game_id || !form.game.image_path) {
        checkedGamesParams = false
      }

      if (!checkedGamesParams) {
        this.errmsg('游戏和icon必须选择！')
        return false
      }
      var cfg = this.getCurrentConfig()
      if (cfg) {
        let count = 0
        for (var i = 0; i < cfg.gid_image_list.length; i++) {
          if (this.formDialog.form.game.game_id === cfg.gid_image_list[i].game_id) {
            count = count + 1
          }
        }
        if (this.formDialog.isedit === false && count > 0) {
          this.errmsg('请勿上传相同的游戏')
          return false
        }
      }

      return true
    },
    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    getAllGameConfig(cb) {
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
            this.allGameConfig = cfg
            // cfg.update_time = 1732780296
            console.log('allGameConfig: ', this.allGameConfig)
          }
          this.raw = response.Data

          console.log('raw: ', this.raw)

          if (cb) cb()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.common-game {
  padding: 20px;
  box-sizing: border-box;
}
</style>
