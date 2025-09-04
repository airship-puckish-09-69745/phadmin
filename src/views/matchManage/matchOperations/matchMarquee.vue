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

          <el-form-item>
            <el-button size="mini" @click="resetSearch">重置查询条件</el-button>
            <el-button type="primary" size="mini" @click="getListCheck">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <div style="height: 50px;">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="showForm(0)">添加配置</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 80%"
      >
        <el-table-column prop="title" label="跑马灯标题" />
        <el-table-column prop="app_id" label="AppId">
          <template slot-scope="scope">
            {{ getAppName(scope.row.app_id) }}
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
          <legend>跑马灯配置</legend>

          <el-form-item label="配置标题：" :required="true">
            <el-input v-model="editForm.data.title" style="width: 200px;" placeholder="填写配置标题" />
          </el-form-item>

          <el-form-item label="AppId：" :required="true">
            <el-select v-model="editForm.data.app_id" placeholder="请选择" size="mini" :disabled="!editForm.isAdd">
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item  label="跳转比赛" :required="true">
            <el-select v-model="editForm.data.jump_gid" placeholder="请选择" size="mini">
              <el-option
                v-for="item in gameCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>


          <el-form-item  label="Join按钮跳转" :required="true">
            <el-select v-model="editForm.data.match_event" placeholder="请选择" size="mini">
              <el-option
                v-for="item in MATCH_LIST_TAG_OPTIONS"
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

          <el-form-item label="站点" required>
            <el-select v-model="editForm.data.channelId" placeholder="请选择渠道" style="width: 360px;" multiple>
              <el-option v-for="option in CHANNEL_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="播放机制" required>
            <el-select v-model="editForm.data.play_sequence" placeholder="请选择" size="mini">
              <el-option
                v-for="item in PlaySequence"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="预览地址">
            <button @click="goToExternalSite">预览</button>
          </el-form-item>

        </fieldset>


        <fieldset style="margin:20px auto;max-height: max-content;min-width:inherit;">
          <legend>跑马灯内容</legend>
          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addMarqueeContent()">添加</el-button>
          <el-table
            :data="editForm.data.contentItem"
            border
            stripe
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'35px'}"
            :cell-style="libShow.TableCell(0)"
            style="width: 1000px;line-height:35px;"
          >

            <el-table-column prop="index" label="序号" width="50" />
            <el-table-column prop="content" label="文本内容"  width="800" >
              <template slot-scope="scope">
                <el-input v-model="scope.row.content" type="textarea" placeholder="文本内容" style="width: 900px;" />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeMarqueeItem(scope.$index)">移除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </fieldset>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveConfig()">保存配置</el-button>
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
import {APPID_OPTIONS, MATCH_UNIQUE_ID_CFG,CHANNEL_OPTIONS,MATCH_LIST_TAG_OPTIONS} from "@/utils/options";
import SiteSelect from '@/components/SiteSelect/index.vue'

export default {
  components: { Compare, Publish, DateTimeShow, ImagePicker, SiteSelect },
  data() {
    return {
      activeTab: 'base',
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,
      form: {
        app_id: -1
      },
      tableData: [],
      raw: {},
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        onceTime : '',
        data: {
          id: 0,
          title: '',
          app_id: 1000002,
          channelId: [],
          match_event:0,
          contentItem:[],
          jump_gid:2031,
          play_sequence:0,

        }
      },
      AttrNames: {
      },
      gameCfgs: [
        { 'value': 2031, 'label': 'tongits' },
        { 'value': 2033, 'label': 'pusoy' },
      ],
      PlaySequence: [
        { 'value': 0, 'label': '第一条随机播放' },
        { 'value': 1, 'label': '从第一条播放' },
      ],

      subKey: 'match_marquee',
      APPID_OPTIONS,
      MATCH_UNIQUE_ID_CFG,
      CHANNEL_OPTIONS,
      MATCH_LIST_TAG_OPTIONS
    }
  },
  computed: {
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
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
            this.tableData = JSON.parse(response.Data.Data)
            console.log("tableData ",this.tableData)
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
            if (cfg.length > 0) {
              this.tableData = []
              for (let i = 0; i < cfg.length; i++) {
                if (this.form.app_id === -1 || this.form.app_id === cfg[i].app_id) {
                  this.tableData.push(cfg[i])
                }
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
    getAppName(id) {
      let appName = ''
      for (let i = 0; i < this.APPID_OPTIONS.length; i++) {
        if (this.APPID_OPTIONS[i].value === id) {
          appName = this.APPID_OPTIONS[i].label
          break
        }
      }
      appName = appName + '[' + id + ']'
      return appName
    },

    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增配置'
        this.editForm.data = {
          id: 0,
          title: '',
          app_id: 1000002,
          start_time: 0,
          end_time: 0,
          jump_gid: 2031,
          save_time: 0,
          channelId: [],
          match_event:0,
          contentItem:[],
          play_sequence:0,
        }
        this.editForm.isAdd = true
      } else {
        let editData = {}
        this.editForm.title = '编辑配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === id) {
            editData = this.tableData[i]
            break
          }
        }
        this.editForm.onceTime = [new Date(editData.start_time * 1000), new Date(editData.end_time * 1000)]
        this.editForm.data = editData
      }
      this.editForm.visable = true
    },
    saveConfig() {
      if (!this.configCheck()) {
        return
      }
      let bTime = 0
      let eTime = 0
      this.editForm.onceTime[0].setSeconds(0) // 去除秒数
      this.editForm.onceTime[1].setSeconds(0) // 去除秒数
      bTime = Math.floor(this.editForm.onceTime[0] / 1000)
      eTime = Math.floor(this.editForm.onceTime[1] / 1000)
      var saveTime = new Date().getTime()
      if (this.editForm.isAdd === false) {
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === this.editForm.data.id) {
            this.tableData[i].title = this.editForm.data.title
            this.tableData[i].app_id = this.editForm.data.app_id
            this.tableData[i].match_event = this.editForm.data.match_event
            this.tableData[i].jump_gid = this.editForm.data.jump_gid
            this.tableData[i].start_time = bTime
            this.tableData[i].end_time = eTime
            this.tableData[i].save_time = saveTime
            this.tableData[i].channelId = this.editForm.data.channelId
            this.tableData[i].contentItem = this.editForm.data.contentItem
            this.tableData[i].play_sequence = this.editForm.data.play_sequence
          }
        }
      } else {
        this.tableData.push(
          {
            'id': new Date().setSeconds(0),
            'title': this.editForm.data.title,
            'app_id': this.editForm.data.app_id,
            'match_event': this.editForm.data.match_event,
            'jump_gid': this.editForm.data.jump_gid,
            'start_time':bTime,
            'end_time': eTime,
            'save_time': saveTime,
            'channelId': this.editForm.data.channelId,
            'contentItem':this.editForm.data.contentItem,
            'play_sequence':this.editForm.data.play_sequence,

          }
        )
      }
      this.raw.Data = JSON.stringify(this.tableData)
      console.log("保存数据 ",this.tableData)
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
        } else {
          const errMsg = '保存成功失败！'
          Message.error(errMsg + response.Data)
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
        for (const key in this.tableData) {
          if (this.tableData[key].id === id) {
            continue
          }
          newList.push(this.tableData[key])
        }
        this.tableData = newList
        this.raw.Data = JSON.stringify(this.tableData)
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

    addMarqueeContent(){
      let index = 0
      if(this.editForm.data.contentItem.length > 0 ){
        index = this.editForm.data.contentItem.length
      }
      index++
      this.editForm.data.contentItem.push({
        index:index,
        content:''
      })
    },
    removeMarqueeItem(index) {
      this.editForm.data.contentItem.splice(index, 1)
      if (this.editForm.data.contentItem.length > 0) {
        for (var i = 0; i < this.editForm.data.contentItem.length; i++) {
          this.editForm.data.contentItem[i].index = i + 1
        }
      }

    },
    goToExternalSite() {
      window.open('http://192.168.8.2:4000/', '_blank');
    },
    handleContentLength(str) {
      const matches = str.match(/<[^>]+>/g);
      if (!matches) {
        return 0
      }
      let totalLength = 0;
      matches.forEach(match => {
        totalLength += match.length; // 减去<和>的长度
      });
      return totalLength;
    },

   configCheck() {
     if (this.editForm.onceTime === '') {
       this.errmsg("请选择过期时间")
       return false
     }
      if (this.editForm.data.title === '') {
        this.errmsg("请填写标题")
        return false
      }

      if (this.editForm.data.jump_gid === 0) {
        this.errmsg("请选择跳转比赛")
        return false
      }
      if (this.editForm.data.contentItem.length <= 0) {
        this.errmsg("请添加跑马灯内容")
        return false
      }
      for (var i = 0; i < this.editForm.data.contentItem.length; i++) {
        if (this.editForm.data.contentItem[i].content === '') {
          this.errmsg("请填写跑马灯内容")
          return false
        }

        let nCount = this.editForm.data.contentItem[i].content.length-this.handleContentLength(this.editForm.data.contentItem[i].content)
        if (nCount > 200) {
          this.errmsg("跑马灯内容不能超200字")
          return false
        }
      }
      if ((this.editForm.data.channelId).length <= 0) {
        this.errmsg("请勾选站点")
        return false
      }
      return true
    }
  }
}
</script>
