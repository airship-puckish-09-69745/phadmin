<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-col :offset="1" :span="22">
        <el-tabs type="border-card" style="margin-top: 10px">
          <el-tab-pane label="基础配置">
            <el-form-item label="名称：" :required="true" prop="Name" :rules="dataRule(true,{type:'s',range:'2-20'})">
              <el-col :span="20">
                <el-input v-model="form.Name" placeholder="方便管理用" />
              </el-col>
            </el-form-item>

            <el-form-item label="标题：" :required="true">
              <el-col :span="20">
                <lang-input v-model="form.Title" />
              </el-col>
            </el-form-item>

            <el-form-item label="开启标题图标：" prop="IsTitleIcon" :rules="dataRule(true)">
              <el-radio-group v-model.number="form.IsTitleIcon">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.IsTitleIcon === 1" label="图片资源:">
              <el-upload
                class="avatar-uploader"
                action="/other/upload/activity/zip"
                :show-file-list="false"
                :on-success="handleTitleIconSuccess"
                :before-upload="beforeImgUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <span v-if="form.TitleIcon">{{ form.TitleIcon }}</span>
              </el-upload>
            </el-form-item>

            <el-form-item label="展示时间：" :required="true" prop="ShowTimeBegin" :rules="dataRule(true)">
              <el-date-picker
                v-model="showTimeArr"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="showTimeChange"
              />
            </el-form-item>

            <el-form-item label="有效时间：" :required="true" prop="ValidTimeBegin" :rules="dataRule(true)">
              <el-date-picker
                v-model="validTimeArr"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="validTimeChange"
              />
            </el-form-item>

            <el-form-item label="排序：" prop="Sort" :required="true">
              <el-col :span="8">
                <el-input v-model="form.Sort" />
              </el-col>
            </el-form-item>

            <el-form-item label="平台：">
              <el-col :span="12">
                <el-select v-model="platformArr" multiple placeholder="请选择" @change="platformChange">
                  <el-option :key="0" :value="0" label="所有" />
                  <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item label="点击跳转:">
              <el-col>
                <jump-select v-model="form.JumpTo" />
              </el-col>
            </el-form-item>

            <el-form-item label="跳转配置：" prop="ExtJumpTo">
              <el-col :span="8">
                <el-input v-model="form.ExtJumpTo" />
              </el-col>
            </el-form-item>

            <el-form-item label="活动标签：" :required="true" prop="Tag" :rules="dataRule(true)">
              <el-radio-group v-model.number="form.Tag">
                <el-radio :label="0">普通</el-radio>
                <el-radio :label="1">热门</el-radio>
                <el-radio :label="2">限时</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="用户类型：" :required="true" prop="UserType" :rules="dataRule(true)">
              <el-radio-group v-model.number="form.UserType">
                <el-radio :label="1">全部类型</el-radio>
                <el-radio :label="2">新增用户</el-radio>
                <el-radio :label="3">忠实用户</el-radio>
                <el-radio :label="4">付费用户</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否强弹：" :required="true" prop="IsAlert" :rules="dataRule(true)">
              <el-radio-group v-model.number="form.IsAlert">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="弹窗规则：" :required="true" prop="AlertRules">
              <el-radio-group v-model.number="form.AlertRules">
                <el-radio :label="1">每次登录</el-radio>
                <el-radio :label="2">指定弹窗次数</el-radio>
                <el-radio :label="3">每日首次登录</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.AlertRules == 2" label="弹窗次数：" prop="AlertCount" :required="true">
              <el-col :span="8">
                <el-input v-model="form.AlertCount" />
              </el-col>
            </el-form-item>

            <el-form-item label="开启大厅图标：" :required="true" prop="IsIcon" :rules="dataRule(true)">
              <el-radio-group v-model.number="form.IsIcon">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.IsIcon == 1" label="大厅图标:" :required="true">
              <el-upload
                class="avatar-uploader"
                action="/other/upload/activity/zip"
                :show-file-list="false"
                :on-success="handleIconSuccess"
                :before-upload="beforeZipUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <span v-if="form.Icons">{{ form.Icons }}</span>
              </el-upload>
            </el-form-item>

            <el-form-item label="指定显示名单：" prop="IsWhiteList">
              <el-radio-group v-model.number="form.IsWhiteList">
                <el-radio :label="1">指定用户显示</el-radio>
                <el-radio :label="0">全部用户显示</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.IsWhiteList === 1" label="指定用户Uid：" prop="WhiteList">
              <el-col :span="8">
                <el-input v-model="form.WhiteList" type="textarea" :autosize="{ minRows: 5, maxRows: 5}" placeholder="多个uid用英文逗号隔开" />
              </el-col>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane label="活动配置">
            <el-form-item label="活动类型：" :required="true" prop="ActivityType">
              <el-select v-model.number="form.ActivityType" @change="activityTypeChanged">
                <el-option v-for="item in activityTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="内容类型：" :required="true" prop="ContextType">
              <el-radio-group v-model.number="form.ContextType">
                <el-radio :disabled="ctxWordDisable" :label="1">文字</el-radio>
                <el-radio :label="2">图片</el-radio>
                <el-radio :disabled="ctxLinkDisable" :label="3">链接</el-radio>
                <el-radio :label="4">H5</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.ContextType == 1 && specialTypes.indexOf(this.form.ActivityType) !== -1" label="文字内容：">
              <lang-text v-model="form.Context" />
            </el-form-item>

            <el-form-item v-if="form.ContextType == 2" label="图片资源:">
              <el-upload
                class="avatar-uploader"
                action="/other/upload/activity/zip"
                :show-file-list="false"
                :on-success="handleImgSuccess"
                :before-upload="beforeZipUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <span v-if="form.H5">{{ form.H5 }}</span>
              </el-upload>
            </el-form-item>

            <el-form-item v-if="form.ContextType == 3 && specialTypes.indexOf(this.form.ActivityType) !== -1" label="链接：">
              <el-col :span="8">
                <el-input v-model="form.Context" />
              </el-col>
            </el-form-item>

            <el-form-item v-if="form.ContextType == 4" label="前端资源:">
              <el-upload
                class="avatar-uploader"
                action="/other/upload/activity/zip"
                :show-file-list="false"
                :on-success="handleH5Success"
                :before-upload="beforeZipUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <span v-if="form.H5">{{ form.H5 }}</span>
              </el-upload>
            </el-form-item>

            <!--demo-->
            <activity-demo v-model="form.Context" :activity-type="form.ActivityType" />

          </el-tab-pane>
        </el-tabs>

        <br>
        <br>
        <el-button type="primary" @click="save">保存</el-button>
        <br>
        <br>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { $libDate, DataRule } from '@/utils/common'
import JumpSelect from '@/components/JumpSelect'
import LangInput from '@/components/LangInput'
import LangText from '@/components/LangText'
import { getOne, create, update } from '@/api/activity'
import ActivityDemo from '../components/activityDemo'

export default {
  name: 'ActivityForm',
  components: { JumpSelect, LangInput, LangText, ActivityDemo },
  // 指令
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        ID: 0,
        ActivityType: 1, // 活动类型 1日常活动 2公告 3大转盘
        Name: '', // 名称，管理后台用
        Title: '', // 标题(多语言)
        ShowTimeBegin: 0, // 展示开始时间
        ShowTimeEnd: 0, // 展示结束时间
        ValidTimeBegin: 0, // 有效开始时间
        ValidTimeEnd: 0, // 有效结束时间
        Sort: 0, // 排序，升序
        Country: '', // 地区多选
        UserType: 1, // 用户类型 1全部 2新增 3忠实 4付费
        IsAlert: 0, // 是否强弹 1是
        AlertRules: 1, // 弹窗规则 1每次登录 2每天首次登录 3指定次数
        AlertCount: 0, // 弹窗次数
        Tag: 0, // 标签 1热门
        JumpTo: '', // 跳转
        ContextType: 1, // 内容类型 1文字 2图片 3链接 4h5
        Context: '', // 活动配置
        IsIcon: 0, // 配置大厅icon入口
        Icons: '', // 大厅入口链接(多语言)
        Status: 0, // 状态 0编辑 1上线 2下架
        Creator: '', // 创建人
        ModifyTime: 0, // 最近修改時間
        IsTitleIcon: 0, // 是否配置标题图标
        TitleIcon: '', // 标题图标
        ExtJumpTo: '', // 拓展跳转字段（透传）
        H5: '', // h5包上传
        Platform: '', // 平台
        IsWhiteList: 0, // 是否开启白名单
        WhiteList: '' // 白名单列表
      },

      // 内容类型disabled状态
      ctxWordDisable: false,
      ctxLinkDisable: false,

      // 活动类型 文字1 和 链接3绑定的参数
      // 因为 form.context 需要绑定到组件里面，不能同时绑定多个值
      txt: '',

      // 特殊活动类型
      specialTypes: [1, 2],

      // 活动id,url传参过来
      aid: 0,

      // 活动类型
      activityTypes: [
        { label: '日常活动', value: 1 },
        { label: '公告', value: 2 },
        { label: 'DEMO', value: 3 }
      ],
      // 平台
      platforms: [
        { label: '安卓', value: 1 },
        { label: 'IOS', value: 2 }
      ],
      platformArr: [], // 平台
      showTimeArr: [], // 展示时间
      validTimeArr: [] // 有效时间
    }
  },
  created() {
    if (this.isEdit) {
      this.aid = this.$route.params && this.$route.params.id ? this.$route.params.id : 0
      this.getInfo()
    }
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },

    validTimeChange() {
      this.form.ValidTimeBegin = $libDate.SelectTimeToIndiaByZone(this.validTimeArr[0]) / 1000
      this.form.ValidTimeEnd = $libDate.SelectTimeToIndiaByZone(this.validTimeArr[1]) / 1000
    },
    showTimeChange() {
      this.form.ShowTimeBegin = $libDate.SelectTimeToIndiaByZone(this.showTimeArr[0]) / 1000
      this.form.ShowTimeEnd = $libDate.SelectTimeToIndiaByZone(this.showTimeArr[1]) / 1000
    },
    platformChange(val) {
      if (this.platformArr.indexOf('0') !== -1) {
        this.platformArr = ['0']
      }
      if (this.platformArr) {
        this.form.Platform = JSON.stringify(this.platformArr)
      }
    },

    // 上传图片start
    // 标题icon上传成功
    handleTitleIconSuccess(ret, file) {
      this.form.TitleIcon = ret.Data.Path
    },
    // 上传之前检测
    beforeZipUpload(file) {
      const isZip = file.type === 'application/x-zip-compressed' || file.type === 'application/zip'
      const isLt2M = file.size / 1024 / 1024 < 20

      // console.log('file type', file.type, 'file size', file.size)

      if (!isZip) {
        this.$message.error('只能上传 Zip 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }
      return isZip && isLt2M
    },
    // 图片上传检测
    beforeImgUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    // 上传活动入口
    handleIconSuccess(ret, file) {
      this.form.Icons = ret.Data.Path
    },
    // 上传内容图片
    handleImgSuccess(ret, file) {
      this.form.H5 = ret.Data.Path
    },
    // 上传h5资源包
    handleH5Success(ret, file) {
      this.form.H5 = ret.Data.Path
    },
    // 上传图片end

    // 切换活动类型
    activityTypeChanged() {
      if (this.specialTypes.indexOf(this.form.ActivityType) === -1) {
        this.ctxWordDisable = true
        this.ctxLinkDisable = true
        this.form.ContextType = 2
      } else {
        this.ctxWordDisable = false
        this.ctxLinkDisable = false
      }

      switch (this.form.ActivityType) {
        case 3:
          // todo...
          break
      }
    },

    // 获取数据
    getInfo() {
      // const id = this.$route.params && this.$route.params.id
      getOne({ id: this.aid }).then(response => {
        console.log('one response ', response)
        this.form = response.Data
        this.getInfoAfter()
      })
    },
    getInfoAfter() {
      if (this.form.Platform) {
        this.platformArr = JSON.parse(this.form.Platform)
      }
      this.showTimeArr = [this.form.ShowTimeBegin * 1000, this.form.ShowTimeEnd * 1000]
      this.validTimeArr = [this.form.ValidTimeBegin * 1000, this.form.ValidTimeEnd * 1000]
    },

    saveBefore() {
      if (this.aid >= 0) {
        this.form.ID = this.aid
      }
    },
    save() {
      console.log('context ', this.form.Context)
      this.saveBefore()
      console.log('submit data', this.form)

      if (this.aid <= 0) {
        create(this.form).then(response => {
          console.log('create response ', response)
          if (response.RetCode === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })
      } else {
        update(this.form).then(response => {
          console.log('update response ', response)
          if (response.RetCode === 0) {
            this.$message.success('更新成功')
          } else {
            this.$message.error('更新失败')
          }
        })
      }
    }
  }
}
</script>
