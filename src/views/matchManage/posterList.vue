<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button type="success" icon="el-icon-plus" @click="showForm(0)">添加赛事海报</el-button>
      </div>
      <el-table
        :data="posterList"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 50%"
      >
        <el-table-column
          prop="title"
          label="海报标题"
        />
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

          <legend>海报列表配置</legend>

          <el-form-item  label="配置标题：" :required="true">
            <el-input v-model="editForm.data.title" style="width: 200px;" placeholder="填写配置标题" />
          </el-form-item>

          <el-form-item label="AppId：" :required="true">
            <el-select v-model="editForm.data.app_id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in appidInfoCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item  label="配置开关：" :required="true">
            <el-switch style="display: block"
                       v-model="editForm.data.switch"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-value='1'
                       inactive-value='0'
                       active-text="正常"
                       inactive-text="下架"
            />
          </el-form-item>

          <el-button style="margin-bottom: 20px;" type="normal"  @click="addPosterCfg()">添加海报</el-button>
          <el-table
            :data="posterRecord"
            border
            stripe
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'35px'}"
            :cell-style="libShow.TableCell(0)"
            style="width: 100%;line-height:35px;"
          >

            <el-table-column prop="sort_id" label="排序" width="90" :required="true" >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.sort_id" style="width: 60px;" size="mini" placeholder="排序值" />
              </template>
            </el-table-column>


            <el-table-column prop="jump_id" label="跳转类型" width="140" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.jump_id" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in postJumpCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="game_id" label="游戏跳转" width="140">
              <template slot-scope="scope">
                <el-select v-if="scope.row.jump_id==2" v-model="scope.row.game_id" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in gameCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <el-select v-if="scope.row.jump_id==3" v-model="scope.row.match_cfg_id" placeholder="请选择" size="mini" @change="selectMatchName()">
                  <el-option
                    v-for="item in showCsCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>


            <el-table-column label="海报入口图" prop="image_path" width="150" :required="true">
              <template slot-scope="scope">
                <ImagePicker v-model="scope.row.image_path" />
              </template>
            </el-table-column>

            <el-table-column label="海报详情图" prop="detail_image_path" width="150" :required="true">
              <template slot-scope="scope">
                <ImagePicker v-if="scope.row.jump_id==1"  v-model="scope.row.detail_image_path" />
              </template>
            </el-table-column>

            <el-table-column label="生效时间：" prop="effective_time" :required="true">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.effective_time"
                  format="yyyy-MM-dd HH:mm"
                  size="mini"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </template>
            </el-table-column>

            <el-table-column prop="first_jump" label="是否首弹" width="110" :required="true" >
              <template slot-scope="scope">
                <el-switch style="display: block"
                           v-model="scope.row.first_jump"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           active-value="1"
                           inactive-value="0"
                           active-text="是"
                           inactive-text="否"
                />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="160" >
              <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="removeMatchPosterItme(scope.row.id, false)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        status: 0
      },
      showCsCfgs: [],
      posterRecord:[],
      posterList: [],
      matchCfg: [],
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
          title: '',
          app_id: 1000002,
          switch: '1',
          records: []
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
      postJumpCfgs: [
        { 'value': 1, 'label': '打开海报详情' },
        { 'value': 2, 'label': '跳转到子游戏' },
        { 'value': 3, 'label': '跳转比赛详情' },
      ],

      subKey: 'match_poster_list'
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
              this.matchCfg.push({
                'label': '[' + objs.list[i].id + ']' + objs.list[i].name,
                'value': objs.list[i].id,
                'app_info': JSON.parse(objs.list[i].app_info_cfg)
              })
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
    addPosterCfg() {
      let index = 0
      if (this.posterRecord.length > 0) {
        index = this.posterRecord.length
      }
      index++
      this.posterRecord.push({
        index: index,
        sort_id: '',
        game_id: '',
        image_path: '',
        detail_image_path: '',
        jump_id: '',
        first_jump: '',
        match_cfg_id: '',
        effective_time: ''
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
    selectMatchName() {
      this.showCsCfgs = []
      if (this.matchCfg.length > 0) {
        for (var i = 0; i < this.matchCfg.length; i++) {
          for (var j = 0; j < this.matchCfg[i].app_info.length; j++) {
            if (this.matchCfg[i].app_info[j].appId == this.editForm.data.app_id) {
              this.showCsCfgs.push(this.matchCfg[i])
            }
          }
        }
      }
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增比赛海报配置'
        this.editForm.data = {
          id: 0,
          title: '',
          app_id: 1000002,
          switch: '1',
          records: []
        }
        this.posterRecord = []
        this.editForm.isAdd = true
      } else {
        let editData = {}
        this.editForm.title = '编辑海报配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.posterList.length; i++) {
          if (this.posterList[i].id === id) {
            editData = this.posterList[i]
            break
          }
        }
        this.editForm.data = {
          id: editData.id,
          title: editData.title,
          app_id: editData.app_id,
          switch: editData.switch,
          records: editData.records
        }
        this.posterRecord = editData.records
      }
      this.editForm.visable = true
      this.selectMatchName()
    },
    savePosetCfg() {
      if (!this.configCheck()) {
        return
      }
      if (this.editForm.isAdd === false) {

        for (var i = 0; i < this.posterRecord.length; i++) {
          if (this.posterRecord[i].jump_id == 1) {
            this.posterRecord[i].game_id = ''
            this.posterRecord[i].match_cfg_id = ''
          } else if (this.posterRecord[i].jump_id == 2) {
            this.posterRecord[i].match_cfg_id = ''
            this.posterRecord[i].detail_image_path = ''
          } else if (this.posterRecord[i].jump_id == 3) {
            this.posterRecord[i].detail_image_path = ''
            this.posterRecord[i].game_id = ''
          }
        }
        for (let i = 0; i < this.posterList.length; i++) {
          if (this.posterList[i].id === this.editForm.data.id) {
            this.posterList[i].records = this.posterRecord
            this.posterList[i].title = this.editForm.data.title
            this.posterList[i].switch = this.editForm.data.switch
          }
        }
      } else {
        this.posterList.push(
          {
            'id': new Date().setSeconds(0),
            'title': this.editForm.data.title,
            'app_id': this.editForm.data.app_id,
            'switch': this.editForm.data.switch,
            'records': this.posterRecord
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
        for (const key in this.posterList) {
          if (this.posterList[key].id === id) {
            continue
          }
          newList.push(this.posterList[key])
        }
        this.posterList = newList
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
    configCheck() {
      //console.log("this.posterRecord ", this.posterRecord)
      if (this.editForm.data.title == '') {
        this.errmsg('标题不能为空')
        return false
      }

      if (this.posterRecord.length == 0 ) {
        this.errmsg('海报内容不能为空')
        return false
      }
      console.log("this.posterRecord ",this.posterRecord)
      for (var i = 0; i < this.posterRecord.length; i++) {
        if (this.posterRecord[i].sort_id == '' || this.posterRecord[i].sort_id == 0 ) {
          this.errmsg('海报排序值不能为空')
          return false
        }
        if (this.posterRecord[i].jump_id == '' || this.posterRecord[i].jump_id == 0 ) {
          this.errmsg('请填写游戏跳转类型')
          return false
        }

        if (this.posterRecord[i].effective_time == '' ) {
          this.errmsg('请填写海报生效时间')
          return false
        }
        if (this.posterRecord[i].jump_id == 2 && this.posterRecord[i].game_id == '') {
          this.errmsg('请选择需要跳转的子游戏')
          return false
        }

        if (this.posterRecord[i].jump_id == 1 && this.posterRecord[i].detail_image_path == '') {
          this.errmsg('请上传海报详情图')
          return false
        }

        if (this.posterRecord[i].jump_id == 3 && this.posterRecord[i].match_cfg_id == '') {
          this.errmsg('请选择赛事跳转')
          return false
        }
      }

      return true
    },
    removeMatchPosterItme(index) {
      this.posterRecord.splice(index, 1)
      if (this.posterRecord.length > 0) {
        for (var i = 0; i < this.guideRecord.length; i++) {
          this.guideRecord[i].index = i + 1
        }
      }
    },
  }
}
</script>
