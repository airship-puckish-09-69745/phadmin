<template>
  <div class="publish-container" style="padding-bottom: 10px">
    <el-col v-if="!diffView" :offset="1" :span="15">
      <el-button v-if="showTestBtn" type="success" size="mini" round @click="toTest">测试</el-button>
      <el-button v-if="showProBtn" type="primary" size="mini" round @click="publishBtn">发布</el-button>
      <span v-if="showProBtn">{{ processInfo }}</span>
    </el-col>
    <el-col :offset="6" :span="1">
      <el-checkbox v-model="lark" :disabled="this.env=='pro'" @change="setLarkPage">lark</el-checkbox>
    </el-col>
    <el-col :span="24">
      <el-alert v-if="this.$store.getters.version==='V2'" type="warning" :closable="false" show-icon>
        新版后台配置-App-{{ this.$store.getters.appId }}
      </el-alert>
    </el-col>
    <el-col v-if="isPublish" :span="24">
      <el-col :span="12" :offset="4">
        <el-steps v-if="!needReview" :space="200" :active="stepActive" finish-status="success">
          <el-step title="测试环境" />
          <el-step title="同步预发布" />
          <el-step title="同步正式" />
        </el-steps>
        <el-steps v-else :space="200" :active="stepActive" finish-status="success">
          <el-step title="测试环境" />
          <el-step title="同步预发布" />
          <el-step title="提交审核" />
          <el-step title="审核待发布" />
          <el-step title="同步正式" />
        </el-steps>
      </el-col>
      <el-col :span="8">
        <el-button v-if="showBtn" type="primary" size="mini" round @click="submitBtn">提交</el-button>
        <el-button v-if="showRollbackBtn" type="warning" size="mini" round @click="rollbackBtn">回滚</el-button>
        <span v-if="!isMy">锁定人：{{ currentUser }}；<br>锁定时间：{{ preTime }}</span>
      </el-col>
    </el-col>

    <div class="compare-container">
      <el-dialog
        title="对比结果"
        :visible.sync="dialogVisible"
        width="60%"
        :append-to-body="true"
        :before-close="dialogClose"
        style="overflow: auto"
      >
        <template v-if="compareType=='Array'">
          <el-row :gutter="10">
            <el-col :span="24" align="center" class="publish-title">
              <span>新增{{ addData.length }}</span>
              <span>删除{{ delData.length }}</span>
              <span>修改{{ editData.length }}</span>
            </el-col>
          </el-row>

          <template v-if="addData.length > 0">
            <el-row :gutter="10" class="publish-name">
              <div>新增数量：{{ addData.length }}</div>
            </el-row>
            <el-card v-for="(item,idx) in addData" :key="idx" class="box-card">
              <el-table
                :data="item"
              >
                <el-table-column
                  prop="key"
                  label="名称"
                  width="180"
                >
                  <template slot-scope="scope">
                    {{ getAttrName(scope.row.key) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="oldVal"
                  label="原始值"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row.oldVal" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="newVal"
                  label="修改值"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row.newVal" />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>

          <template v-if="editData.length > 0">
            <el-row :gutter="10" class="publish-name">
              <div>修改数量：{{ editData.length }}</div>
            </el-row>
            <el-card v-for="(edit,idx) in editData" :key="idx+'editData'" class="box-card">
              <div slot="header" class="clearfix">
                修改对象，
                <template v-for="(o,k) in edit.Head">
                  {{ k }}：<span :key="k" style="color: blue">{{ o }}</span>
                </template>
              </div>
              <div class="text item">
                <el-table
                  :data="edit.Rows"
                >
                  <el-table-column
                    prop="key"
                    label="名称"
                    width="180"
                  >
                    <template slot-scope="scope">
                      {{ getAttrName(scope.row.key) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="oldVal"
                    label="原始值"
                  >
                    <template slot-scope="scope">
                      <div v-html="scope.row.oldVal" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="newVal"
                    label="修改值"
                  >
                    <template slot-scope="scope">
                      <div v-html="scope.row.newVal" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </template>

          <template v-if="delData.length > 0">
            <el-row :gutter="10">
              <span :span="10">删除数量：{{ delData.length }}</span>
            </el-row>
            <el-card v-for="(del,idx) in delData" :key="'del' + idx" class="box-card">
              <el-table
                :data="del"
                style="width: 100%; max-height: 600px; overflow: auto"
              >
                <el-table-column
                  prop="key"
                  label="名称"
                  width="180"
                >
                  <template slot-scope="scope">
                    {{ getAttrName(scope.row.key) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="oldVal"
                  label="原始值"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row.oldVal" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="newVal"
                  label="修改值"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row.newVal" />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
        </template>

        <el-card v-if="compareType=='Object' || compareType=='CustomizeConfig'" class="box-card">
          <div slot="header" class="clearfix">
            本次修改内容对比如下：
          </div>
          <div v-if="ObjectData.Result.length>0" class="text item">
            <el-table
              :data="ObjectData.Result"
              stripe
              border
              :row-style="{height:'10px'}"
              style="width: 100%"
            >
              <el-table-column
                prop="Name"
                label="名称"
                width="150"
              >
                <template slot-scope="scope">
                  {{ getAttrName(scope.row.key) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Value"
                label="原值"
                min-width="200"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.oldVal" />
                </template>
              </el-table-column>
              <el-table-column
                width="70"
              >
                -->
              </el-table-column>
              <el-table-column
                prop="NewValue"
                label="修改值"
                min-width="200"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.newVal" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else style="color: red;font-size: 14px;text-align: center">
            本次发布与线上内容无任何差异！
          </div>
        </el-card>

        <span v-if="!diffView" slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogClose">取 消</el-button>
          <el-button type="primary" size="mini" @click="next">确 定</el-button>
        </span>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDiff, getView, rollback, submitPublish } from '@/api/publish'
import { getInfo } from '@/api/user'
import { sendLark } from '@/api/lark'
import Diff from '@/utils/diff'
import { $libDate, $LibJsonDiff, $libType, ClientTableData } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import { IsMars } from '@/utils/env'
import {getCustomize} from "@/api/custome_configV2";

const jsonDiff = require('diff')

export default {
  name: 'Publish',
  props: {
    primaryKey: { // 如果是数组，用于标识记录的主键
      type: String,
      default: 'ID'
    },
    diffView: { // 只是用于差异查看，在审核发布时会用到此模式
      type: Boolean,
      default: false
    },
    keyId: { // 配置的ID，与AdminConfig中配置ID对应
      type: String,
      default: ''
    },
    appId: { // 配置的AppId，与AdminConfig中配置AppId对应
      type: Number,
      default: parseInt(store.getters.appId)
    },
    compareType: { // 发布内容格式，支持：Array, Object, String, CustomizeConfig
      type: String,
      default: ''
    },
    envEmpty: { // 是否区分环境，true表示不区分
      type: Boolean,
      default: true
    },
    attrNames: { // 传入字段说明，以便在比较时更方便理解字段内容
      type: Object
    },
    headAttrs: { // 传入字段数值，将显示到修改项时的标题中
      type: Array,
      default: function() {
        return ['ID']
      }
    },
    check: { // 前置检测发布的数据
      type: Function,
      default: function() {
        return true
      }
    },
    onStepChange: { // 后置发布的回调
      type: Function,
      default: function() {
        return true
      }
    },
    makeContent: {
      type: Function,
      default: function() {
        return ''
      }
    },
    onCompare: {
      type: Function,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      larkConfig: {},
      larkPages: [],
      lark: false,
      larkContent: '',
      diffFormatter: new Diff.DiffFormatter(new Diff.Diff()),
      isTestBtn: true, // 展示发布到测试环境
      isProBtn: true, // 展示发布到线上
      isPublish: false, // 展示发布线上流程
      stepActive: 1, // 发布过程打开后的控件索引
      addData: [],
      delData: [],
      editData: [],
      dialogVisible: false,
      opType: 2, // 操作步骤 2测试 3预发布 6正式
      needReview: false,
      isToTest: false, // 是否发布到测试服
      preTime: '',
      isMy: false,
      currentUser: '',
      processInfo: '',
      ObjectData: { Result: [] },
      compareRets: [],
      env: 'test'
    }
  },
  computed: {
    showBtn() {
      if (this.stepActive === 5 || this.stepActive === 3) {
        return false
      }
      return this.isMy
    },
    showRollbackBtn() {
      if (this.stepActive === 1) {
        return false
      }
      return this.isMy
    },
    showProBtn() {
      if (this.isProBtn && this.env === 'pro') {
        if (this.envEmpty) {
          return true
        } else if (this.env === 'pro') {
          return true
        }
        return false
      } else {
        return false
      }
    },
    showTestBtn() {
      if (this.isTestBtn) {
        if (this.envEmpty) {
          return true
        } else if (this.env === 'test') {
          return true
        }
        return false
      } else {
        return false
      }
    }
  },
  mounted() {
    this.env = store.getters.env || this.env
    this.resetData()
    this.checkProcessing()
    if (!IsMars()) {
      console.log('==', IsMars)
      this.getLarkPage()
    }
  },
  watch: {
    keyId: {
      handler(newVal, oldVal) {
        console.log('watch keyId:', newVal, oldVal, ' appId:', this.appId)
        if (oldVal === undefined) {
          return
        }
        this.checkProcessing()
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.addData = []
      this.delData = []
      this.editData = []
      this.compareRets = []
    },
    getAttrName(attr) {
      // console.log(attr)
      // console.log(this.attrNames)

      if (this.attrNames && this.attrNames[attr]) {
        return this.attrNames[attr]
      } else {
        return attr
      }
    },
    next() {
      const $this = this
      if (this.opType === 6) {
        this.$confirm('即将发布外网，请确认：<br/><span style="color:red">1、配置中是否有新的字段添加；' +
          '<br/>2、发布内容是有关联服务的修改；<br/>3、发布内容是否可能影响到付费；</span><br/>若是，请拉群确认发布步骤后再行发布。<br/><br/>' +
          '确认是否继续?', '提示', {
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          submitPublish(this.opType, this.keyId, this.getSummaryInfo(), this.envEmpty, '', this.appId).then(function(response) {
            if (response.RetCode === 0) {
              $this.stepActive++
              $this.$message.success('发布成功')
              $this.onStepChange($this.stepActive, $this.keyId, $this.addData, $this.delData, $this.editData)
              $this.sendLark()
            }
          })
        })
      } else {
        let attrInfo = ''
        if (this.opType === 4 && this.attrNames) {
          attrInfo = JSON.stringify(this.attrNames)
        }
        submitPublish(this.opType, this.keyId, this.getSummaryInfo(), this.envEmpty, attrInfo, this.appId).then(function(response) {
          if (response.RetCode === 0) {
            $this.stepActive++
            $this.$message.success('发布成功')
            $this.onStepChange($this.stepActive, $this.keyId, $this.addData, $this.delData, $this.editData)
            $this.sendLark()
          }
        })
      }

      // 下一步
      this.dialogClose()
    },
    sendLark() {
      if (!this.lark) {
        return
      }
      let warn = ''
      // 同步到测试
      if (this.env === 'test') {
        warn = 'WarningJustForTest'
        //warn = 'WarningDev'
        console.log('开发阶段只通知开发服')
        return
      }
      // 同步到正式
      if (this.env === 'pro' && this.opType != 4 && this.opType != 6) {
        console.log('生产环境只在审核和同步正式发送通知')
        return
      }
      const $this = this
      getInfo(this.$store.getters.token).then(function(response) {
        if (response.RetCode === 0) {
          let step = ''
          if ($this.env === 'pro') {
            if ($this.opType === 4) { step = '【待审核】' }
            if ($this.opType === 6) { step = '【已发布】' }
          }
          const nick = response.Data.nick
          const routes = $this.getRoutesName()
          const content = $this.larkContent.length > 0 ? $this.larkContent : $this.makeContent($this.keyId, $this.addData, $this.delData, $this.editData)
          let at = ''
          if ($this.env === 'pro') {
            // at += '<at user_id="ou_dacc382512738a049ab4f32d6db9f82e">xiong</at>'
            at = '<at user_id="ou_2b283f529fc901b97b443b946f692efd">SamYe</at>\r\n'
            // at += '<at user_id="ou_932b1ed1e7064b512199b77ce83236c1">高勋</at>'
          }
          const text = `${step}【${nick}】发布配置：${routes} 🚩\r\n${at}` + content
          sendLark(text, warn, $this.env).then(response => {
            if (response.RetCode === 0) {
              console.log('wanring success')
            }
          })
        }
      }).catch((e) => {
        console.log('sendLark failed', e)
      })
    },
    getRoutesName() {
      let str = ''
      let slots = false
      for (let i = 0; i < this.$route.matched.length; i++) {
        if (i > 0) {
          str += '->'
        }
        str += this.$route.matched[i].meta.title
        console.log(this.$route.matched[i])
        if (this.$route.matched[i].path === '/tableConfig/slotsCfg/slotsProCfg') {
          slots = true
        }
      }
      // 是老虎机并且上一级标签是el-tab
      if (slots && this.$parent.$options.name === 'ElTabPane') {
        str += '->' + this.$parent.label
      }
      return str
    },
    getLarkPage(){
      getCustomize('lark_page_cfg', 0).then(response => {
        if (response.RetCode === 0) {
          console.log('cfg', response)
          this.larkConfig = response.Data || {}
          if (response.Data.Data && response.Data.Data !== '') {
            this.larkPages = JSON.parse(response.Data.Data)
            this.lark = this.larkPages.indexOf(this.$route.name) > -1
          }
        }
      }).catch((e) => {
        console.log('getLarkPage err', e)
      })
    },
    setLarkPage(add) {
      console.log(this.$route)
      if (add && this.larkPages.indexOf(this.$route.name) > -1) {
        this.$message.error(`重复操作!`)
        return
      }
      if ((!add) && this.larkPages.indexOf(this.$route.name) == -1) {
        this.$message.error(`重复操作!`)
        return
      }
      if (add) {
        this.larkPages.push(this.$route.name)
      } else {
        for (let i = 0; i < this.larkPages.length; i++) {
          if (this.larkPages[i] === this.$route.name) {
            this.larkPages.splice(i, 1)
          }
        }
      }
      this.larkConfig.Data = JSON.stringify(this.larkPages)
      request({
        url: '/customizeconfig/update',
        method: 'post',
        data: this.larkConfig
      }).then(response => {
        if (response.RetCode === 0) {
          add ? this.$message.success(`添加通知成功!`) : this.$message.success(`取消通知成功!`)
        } else {
          this.$message.error('lark设置失败')
        }
      }).catch(() => {
        console.log('lark设置失败')
      })
    },
    publishBtn() {
      if (!this.check()) {
        this.$message.error('检测不通过')
        return
      }
      console.log('publishBtn')
      getView(this.keyId, this.envEmpty).then(response => {
        try {
          console.log('getView: ', this.keyId, this.envEmpty)
          console.log('response1：', response)
        } catch (e) {
          console.log('getView error:', e)
          console.log('response2：', response)
        }
        this.needReview = response.Data.NeedView
        this.isMy = response.Data.IsMy
        this.currentUser = response.Data.CurUser
        if (response.Data.PreTime > 0) {
          this.preTime = $libDate.FormateSecondStr(response.Data.PreTime, 2)
        } else {
          this.preTime = '-'
        }

        this.opType = response.Data.Step
        const validType = [2, 3, 4, 5, 6]
        if (validType.indexOf(this.opType) === -1) {
          this.opType = 2
        }

        this.stepActive = this.opType - 1

        this.isPublish = true
        this.isTestBtn = false
        this.isToTest = false
        this.isProBtn = false

        console.log('publishBtn end')
      }).catch(error => {
        console.log('getView error:', error)
      })
      console.log('this.selfGetView()')
    },
    reviewDiffShow() {
      this.envEmpty = false
      this.opType = 4

      this.getDiff()
    },
    toTest() { // 发布到测试
      console.log('test')
      if (!this.check()) {
        this.$message.error('检测不通过')
        return
      }
      this.isToTest = true
      this.opType = 2 // 应该执行发布到测试的操作
      this.getDiff()
    },
    dialogClose() {
      this.dialogVisible = false
    },
    dialogShow() {
      console.log('dialogShow compareType:', this.compareType)
      console.log('dialogShow this.editData:', this.editData)
      console.log('dialogShow this.ObjectData.Result:', this.ObjectData.Result)
      this.dialogVisible = true
    },
    getSummaryInfo() {
      let summaryInfo = ''
      if (this.addData.length !== 0) {
        summaryInfo += '新增' + this.addData.length + '个配置 \n'
      }

      if (this.editData.length !== 0) {
        for (let i = 0; i < this.editData.length; i++) {
          summaryInfo += '修改配置项：'
          for (const o in this.editData[i].Head) {
            summaryInfo += o + ':' + this.editData[i].Head[o]
          }
          summaryInfo += '\n'
        }
      }
      if (this.delData.length != 0) {
        summaryInfo += '删除' + this.delData.length + '个配置 \n'
      }

      if (this.ObjectData.Result.length > 0) {
        summaryInfo += '修改配置项：'
        for (let i = 0; i < this.ObjectData.Result.length; i++) {
          summaryInfo += this.getAttrName(this.ObjectData.Result[i].key) + '|'
        }
        summaryInfo += '\n'
      }

      if (summaryInfo === '') {
        summaryInfo = '发布内容与线上无差异'
      }
      console.log(summaryInfo)
      return summaryInfo
    },
    resetData() {
      this.addData = []
      this.editData = []
      this.delData = []
    },
    submitBtn() {
      if (this.opType === 6) {
        console.log('已经是最后1步')
        return
      }

      if (!this.isToTest) {
        if (this.opType < 3) { // 如果非同步测试状态，则至少从3开始
          this.opType = 3
        } else {
          if (!this.needReview && this.opType === 3) { // 如果不需要审核，则直接到发布操作
            this.opType = 6
          } else {
            this.opType = this.stepActive + 2
            console.log('submitBtn this.opType', this.opType)
          }
        }
      }

      this.getDiff()
    },
    rollbackBtn() {
      // 回滚
      const canOpType = [3, 4, 5, 6]
      if (canOpType.indexOf(this.opType) === -1) {
        this.$message.error('不可回滚状态')
        return
      }

      // 1.提交
      rollback(this.keyId, this.envEmpty).then(response => {
        if (response.RetCode !== 0) {
          this.$message.error('回滚失败：' + response.Data)
          return
        }
        this.$message.success('回滚成功')
        // 2.修改opType
        if (this.opType === 4 || this.opType === 5 || this.opType === 6) {
          // 回滚到预发布
          this.opType = 3
        } else if (this.opType === 3) {
          // 回滚到测试服
          this.opType = 2
        }
        // 3.修改step
        this.stepActive--
      })
    },
    getView() {
      getView(this.keyId, this.envEmpty, this.appId).then(response => {
        this.needReview = response.Data.NeedView
        this.isMy = response.Data.IsMy
        this.currentUser = response.Data.CurUser
        this.preTime = $libDate.FormateSecondStr(response.Data.PreTime, 2)

        this.opType = response.Data.Step
        const validType = [2, 3, 4, 5, 6]
        if (validType.indexOf(this.opType) === -1) {
          this.opType = 2
        }

        this.stepActive = this.opType - 1
      })
    },
    checkProcessing() { // 检测版本是否在处理中
      if (this.keyId === '') {
        return
      }
      getView(this.keyId, this.envEmpty, this.appId).then(response => {
        console.log('checkProcessing: ', this.keyId, this.envEmpty, response)
        this.currentUser = response.Data.CurUser
        this.opType = response.Data.Step
        const stepNames = ['同步预发布', '已提交审核', '已审核待发布']
        if (this.opType > 2 && this.opType < 6) {
          this.processInfo = '(' + stepNames[this.opType - 3] + ',当前处理人：' + this.currentUser + ')'
        } else {
          this.processInfo = ''
        }
      })
    },
    getDiff() {
      const $this = this
      this.init()
      getDiff(this.opType, this.keyId, this.envEmpty, this.appId).then(response => {
        if ($this.diffView && response.Data.AttrInfo !== '' && response.Data.AttrInfo !== 'undefined') {
          $this.attrNames = JSON.parse(response.Data.AttrInfo)
        }
        let preVal = null
        let proVal = null
        if (response.Data.Pre) {
          try {
            preVal = JSON.parse(response.Data.Pre)
          } catch (e) {
            console.log('getDiff preVal parse error:', e, ' preVal:', preVal)
          }
        }
        if (response.Data.Publish) {
          try {
            proVal = JSON.parse(response.Data.Publish)
          } catch (e) {
            console.log('getDiff proVal parse error:', e, ' proVal:', proVal)
          }
        }
        if (!$this.compareType || $this.compareType == '') {
          if ($libType.IsArray(preVal)) {
            $this.compareType = 'Array'
            console.log('getDiff preVal is Array')
          } else if ($libType.IsObject(preVal)) {
            $this.compareType = 'Object'
            console.log('getDiff preVal is Object')
          }
        }
        console.log('preVal:', preVal)
        console.log('proVal:', proVal)
        console.log('compareType:' + $this.compareType)
        console.log('Object.prototype.toString.call(obj):', Object.prototype.toString.call(preVal))

        switch ($this.compareType) {
          case 'Object':
            preVal = preVal || {}
            proVal = proVal || {}
            $this.compareRets = []
            $this.compareObject(proVal, preVal)
            $this.ObjectData.Result = $this.compareRets
            $this.dialogShow()
            break
          case 'CustomizeConfig':
            if (preVal && preVal.Data) {
              preVal = JSON.parse(preVal.Data)
            } else {
              preVal = {}
            }
            if (proVal && proVal.Data) {
              proVal = JSON.parse(proVal.Data)
            } else {
              proVal = {}
            }
            $this.compareRets = []
            $this.compareObject(proVal, preVal)
            $this.ObjectData.Result = $this.compareRets
            $this.dialogShow()
            break
          default:
            preVal = preVal || []
            proVal = proVal || []
            $this.compare(preVal, proVal)
        }
        try {
          $this.larkContent = $this.onCompare(preVal, proVal)
        } catch (e) {
          console.log('onCompare err:', e)
        }
      })
    },
    compareOBJValue(oldVal, newVal, sKey) {
      let oldObject, newObject

      oldVal = this.tranString(oldVal)
      newVal = this.tranString(newVal)
      try {
        oldObject = JSON.parse(oldVal)
        newObject = JSON.parse(newVal)
      } catch (e) {
        oldObject = null
        newObject = null
      }

      let ret
      if (oldObject && newObject) {
        ret = $LibJsonDiff.DiffHistory(oldObject, newObject)
      } else {
        ret = this.diffFormatter.formattedDiff(oldVal, newVal)
      }
      // const diff = this.diffFormatter.formattedDiff(this.tranString(oldVal), this.tranString(newVal))
      this.compareRets.push({ key: sKey, oldVal: ret[0], newVal: ret[1] })
    },
    compareOBJArray(oldVal, newVal, prefix) {
      const lens = oldVal.length > newVal.length ? oldVal.length : newVal.length

      for (let i = 0; i < lens; i++) {
        const key = i
        const _oldVal = oldVal.length > i ? oldVal[key] : ''
        const _newVal = newVal.length > i ? newVal[key] : ''

        // 如果值相等，不需要对比，直接跳过
        if (this.tranString(_oldVal) === this.tranString(_newVal)) {
          continue
        }

        const sKey = prefix ? this.getAttrName(prefix) + '.' + (key + 1) : (key + 1)
        this.compareOBJValue(_oldVal, _newVal, sKey)
      }
    },
    compareObject(oldValue, newValue, prefix) {
      const keys = this.getKeys(oldValue, newValue)
      for (const k in keys) {
        const key = keys[k]
        let oldVal, newVal
        if (oldValue[key]) {
          oldVal = oldValue[key]
        }

        if (newValue[key]) {
          newVal = newValue[key]
        }
        // 0值兼容
        if (oldValue[key] === 0) {
          oldVal = 0
        }
        if (newValue[key] === 0) {
          newVal = 0
        }
        // 如果值相等，不需要对比，直接跳过
        if (this.tranString(oldVal) === this.tranString(newVal)) {
          continue
        }

        if (this.attrNames && this.attrNames.types && this.attrNames.types[key] === 'jsonString') {
          try {
            oldVal = JSON.parse(oldVal)
          } catch (e) {
            oldVal = ''
          }
          try {
            newVal = JSON.parse(newVal)
          } catch (e) {
            newVal = ''
          }
        }
        console.log('compareObject')

        const sKey = prefix ? prefix + '.' + key : key
        const ret = { key: sKey, newVal: newVal, oldVal: oldVal }

        if (this.tranString(ret.oldVal) !== this.tranString(ret.newVal)) {
          if ($libType.IsObject(ret.oldVal) && $libType.IsObject(ret.newVal)) {
            console.log('compareObject 1')
            this.compareObject(ret.oldVal, ret.newVal, ret.key)
          } else if ($libType.IsArray(ret.oldVal) && $libType.IsArray(ret.newVal)) {
            console.log('compareObject 2')
            this.compareOBJArray(ret.oldVal, ret.newVal, ret.key)
          } else {
            console.log('compareObject 3')
            this.compareOBJValue(ret.oldVal, ret.newVal, ret.key)
          }
        }
      }
    },
    tranString(val) {
      switch (typeof val) {
        case 'string':
          return val
        case 'object':
          return JSON.stringify(val)
        case 'boolean':
          return JSON.stringify(val)
        case 'number':
          return val.toString()
        default: // 其它数据类型不处理，以后遇到自己处理
          return ''
      }
    },
    lookupItem(item, arr) {
      for (const i in arr) {
        if (arr[i].hasOwnProperty(this.primaryKey)) {
          if (arr[i][this.primaryKey] == item[this.primaryKey]) {
            return {
              index: i,
              value: arr[i]
            }
          }
        }
      }
      return false
    },
    addRecord(dataType, row) {
      if (row.length === 0) {
        return
      }
      switch (dataType) {
        case 'add':
          this.addData.push(row)
          break
        case 'del':
          this.delData.push(row)
          break
        case 'edit':
          this.editData.push(row)
          break
      }
    },
    getKeys(v1, v2) {
      const keys = []
      for (const k in v1) {
        keys.push(k)
      }

      console.log('1.getKeys', keys)

      for (const k in v2) {
        if (keys.indexOf(k) === -1) {
          keys.push(k)
        }
      }

      console.log('2.getKeys', keys)

      return keys
    },
    getHeadObject(item) { // 返回用于标识记录的字段内容
      const ret = {}
      console.log('getHeadObject 1', item)
      for (const i in this.headAttrs) {
        const key = this.headAttrs[i]
        if (key.indexOf('.') > -1) {
          const keys = key.split('.')
          let val = item
          for (const k in keys) {
            val = val[keys[k]]
            console.log('getHeadObject 2', keys[k], val)
          }
          ret[key] = val
        } else {
          ret[key] = item[key]
        }
      }
      return ret
    },

    // preVal 准备发布数据
    // proVal 线上现有的数据
    // 返回false，没有任何变化，但是还是可以继续发布
    compare(preVal, proVal) {
      if (!preVal && !proVal) {
        this.dialogShow()
        return false
      }
      if (preVal instanceof Array && proVal instanceof Array) {
        for (const idx in preVal) {
          // 判断主键是否存在，不存在属于新增
          if (!preVal[idx].hasOwnProperty(this.primaryKey)) {
            const addRows = []
            for (const k in preVal[idx]) {
              addRows.push({
                key: k,
                oldVal: '',
                newVal: preVal[idx][k]
              })
            }
            this.addRecord('add', addRows)
            continue
          }
          // 查找线上对应的记录
          const proItem = this.lookupItem(preVal[idx], proVal)
          // 线上记录不存在，按新增处理
          if (proItem === false) {
            const addRows = []
            for (const k in preVal[idx]) {
              addRows.push({
                key: k,
                oldVal: '',
                newVal: preVal[idx][k]
              })
            }
            this.addRecord('add', addRows)
            continue
          }

          // console.log('edit rows len', editRows.length)
          const keys = this.getKeys(preVal[idx], proItem.value)
          // console.log('keys', keys)
          this.compareRets = []
          for (const k in keys) {
            const key = keys[k]
            const oldValue = proItem.value[key]
            const newValue = preVal[idx][key]
            if (this.tranString(oldValue) !== this.tranString(newValue)) {
              if ($libType.IsObject(oldValue) && $libType.IsObject(newValue)) {
                this.compareObject(oldValue, newValue, key)
              } else if ($libType.IsArray(oldValue) && $libType.IsArray(newValue)) {
                this.compareOBJArray(oldValue, newValue, key)
              } else {
                this.compareOBJValue(oldValue, newValue, key)
              }
            }
          }
          // 删除线上对比过的数据
          proVal.splice(proItem.index, 1)
          if (this.compareRets.length > 0) {
            // 获取记录的标识信息
            const head = this.getHeadObject(preVal[idx])
            this.addRecord('edit', { Head: head, Rows: this.compareRets.splice(0) })
          }
        }

        if (proVal.length === 0) {
          // 处理完成之后
          // todo...
          this.dialogShow()
          return
        }
        // 判断线上还有没有剩余数据没有处理
        // 如果剩余数量没对比，说明是删除数据
        for (const i in proVal) {
          const delRows = []
          for (const k in proVal[i]) {
            delRows.push({
              key: k,
              oldVal: proVal[i][k],
              newVal: ''
            })
          }

          this.addRecord('del', delRows)
        }

        // 处理完成
        // todo....
        this.dialogShow()
      } else {
        const oldVal = this.tranString(proVal)
        const newVal = this.tranString(preVal)
        let oldObject, newObject
        try {
          oldObject = JSON.parse(oldVal)
          newObject = JSON.parse(newVal)
        } catch (e) {
          oldObject = null
          newObject = null
        }
        console.log('compare s1')
        console.log('oldVal', oldVal)
        console.log('newVal', newVal)
        console.log('newObject', newObject)
        console.log('oldObject', oldObject)
        console.log('compare s2')

        let ret
        if (oldObject && newObject) {
          ret = $LibJsonDiff.DiffHistory(oldObject, newObject)
        } else {
          ret = this.diffFormatter.formattedDiff(oldVal, newVal)
        }
        console.log(ret)

        const row = {
          key: '',
          oldVal: ret[0],
          newVal: ret[1]
        }

        this.addRecord('edit', row)

        this.dialogShow()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.publish-title {
  font-size: 14px;
  font-weight: 600;

  span {
    margin-left: 5px;
  }
}

.publish-name {
  font-size: 14px;
}
</style>
