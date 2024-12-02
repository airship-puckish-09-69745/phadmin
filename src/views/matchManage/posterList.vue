<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button type="success" icon="el-icon-plus" @click="showForm(0)">添加赛事海报</el-button>
      </div>
      </el-row>

    <el-dialog
      :title="editForm.title"
      :visible.sync="editForm.visable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="67%"
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

            <el-table-column prop="game_id" label="子游戏跳转" width="140">
              <template slot-scope="scope">
                <el-select v-if="scope.row.jump_id==2" v-model="scope.row.game_id" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in gameCfgs"
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
                           active-value='1'
                           inactive-value='0'
                           active-text="是"
                           inactive-text="否"
                />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeMatchPosterItme(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
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
    console.log("data()")
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
      posterRecord:[],
      postData: {
        'tableData': [],
        'switch': 0
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
          title: '',
          app_id: 100002
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
    this.getBeginMatchCfgs()
  },
  mounted() {
    this.getList()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addPosterCfg() {
      console.log("添加海报")
      let index = 0
      if (this.posterRecord.length > 0) {
        index = this.posterRecord.length
      }
      index++
      this.posterRecord.push({
        index: index,
        sort_id: '',
        game_id: '',
        image_path: ''
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
    },
    removeMatchPosterItme(idx) {

    },
  }
}
</script>
