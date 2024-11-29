<template>
  <div class="common-game">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="{}" />
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-select v-model="searchFilter.app_info" filterable placeholder="请选择" size="small" style="margin-right: 12px;" multiple>
        <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch" />
      <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleShowCreateDialog">
        添加游戏ICON配置
      </el-button>
    </el-row>
    <el-row style="margin: 10px 0;">
      最后修改时间：{{ formatTime(allGameConfig.update_time) }}
    </el-row>
    <el-table :data="gameTableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="140" />
      <el-table-column prop="app_info" label="应用ID" width="280">
        <template slot-scope="scope">
          <div>{{ scope.row.app_info.join(',') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="game_id" label="游戏ID" width="280">
        <template slot-scope="scope">
          <div>{{ getGamesIdStr(scope.row.gid_image_list) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Icon">
        <template slot-scope="scope">
          <img v-for="(game, i) in scope.row.gid_image_list" :key="i" :src="game.image_path" width="100">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row, scope.$index)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteConfig(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="formDialog.title" :visible.sync="formDialog.visible" width="600px">
      <div class="dialog-body">
        <el-form ref="form" :model="formDialog.form" label-width="100px">
          <el-form-item label="应用" :rules="{ required: true }">
            <el-select v-model="formDialog.form.app_info" filterable placeholder="请选择应用" size="small" multiple style="width: 100%;">
              <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏" :rules="{ required: true }">
            <div><el-button type="success" size="small" @click="handleAddGame()">添加游戏</el-button></div>
            <el-table :data="formDialog.form.gid_image_list" style="width: 100%">
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
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteGame(scope.row, scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { $libDate } from '@/utils/common'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
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
        app_info: []
      },
      formDialog: {
        visible: false,
        title: '新增配置',
        form: {
          app_info: [],
          gid_image_list: [
            {
              game_id: '',
              image_path: ''
            }
          ]
        }
      },
      raw: {},
      subKey: 'game_resource_common_cfg'
    }
  },
  mounted() {
    this.getGameAll()
    this.getAppidInfoCfg()
    this.getAllGameConfig()
  },
  methods: {
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
    handleUpdate(row) {
      console.log('row==>', row)
      this.formDialog.form = {
        id: row.id,
        app_info: row.app_info,
        gid_image_list: row.gid_image_list
      }
      this.formDialog.title = '修改配置'
      this.formDialog.visible = true
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
    getGamesIdStr(games) {
      const gamesId = []
      games.forEach(element => {
        gamesId.push(element.game_id)
      })

      return gamesId.join(',')
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
    handleAddGame() {
      this.formDialog.form.gid_image_list.push({
        image_path: '',
        game_id: ''
      })
    },
    handleResetForm() {
      this.formDialog.title = '新增配置'
      this.formDialog.form = {
        app_info: [],
        gid_image_list: [
          {
            game_id: '',
            image_path: ''
          }
        ]
      }
    },
    handleShowCreateDialog() {
      this.formDialog.visible = true
    },
    handleCloseDialog() {
      this.formDialog.visible = false
      this.handleResetForm()
    },
    handleConfirmDialog() {
      if (!this.checkForm()) {
        return
      }

      console.log('【formDialog】: ', this.formDialog)
      this.allGameConfig.update_time = Math.round(Date.now() / 1000)
      if (this.formDialog.title === '新增配置') {
        // this.allGameConfig.id = Date.now().toString()
        this.allGameConfig.gid_image_resource.push({
          id: Date.now().toString(),
          ...this.formDialog.form
        })
      } else {
        this.allGameConfig.gid_image_resource.forEach((item, index) => {
          if (item.id === this.formDialog.form.id) {
            this.allGameConfig.gid_image_resource.splice(index, 1, {
              ...this.formDialog.form
            })
          }
        })
      }
      console.log(this.allGameConfig)

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
          this.getAllGameConfig()
          this.formDialog.visible = false
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
      console.log(this.searchFilter.app_info)
      this.gameTableData = this.allGameConfig.gid_image_resource
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
        this.formDialog.form.gid_image_list.splice(index, 1)
      })
    },
    // 删除整个配置
    handleDeleteConfig(row) {
      // console.log(row, index)
      this.$confirm(`确定要删除id=【${row.id}】的配置吗？`, '删除配置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.allGameConfig.gid_image_resource.forEach((item, index) => {
          if (item.id === row.id) {
            this.allGameConfig.gid_image_resource.splice(index, 1)
            this.updateConfigData()
            return
          }
        })
      })
    },
    checkForm() {
      const form = this.formDialog.form
      if (!form.app_info || form.app_info.length === 0) {
        this.errmsg('应用必须选择！')
        return false
      }

      let checkedGamesParams = true
      form.gid_image_list.forEach(game => {
        if (!game.game_id || !game.image_path) {
          checkedGamesParams = false
        }
      })

      if (form.gid_image_list.length === 0 || !checkedGamesParams) {
        this.errmsg('游戏和icon必须选择！')
        return false
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
    getAllGameConfig() {
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
