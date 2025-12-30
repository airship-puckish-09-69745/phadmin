<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
      </el-form>
    </el-row>
    <el-row>
      <div style="height: 50px; margin-top: 10px;">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="showForm(0)">添加TPCC邀请函配置</el-button>
      </div>

      <el-table
        :data="posterList.tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 80%"
      >

        <el-table-column prop="matchUniqueId" label="邀请函信息" width="500px">
          <template slot-scope="scope">
            {{ getInvitationName(scope.row.matchUniqueId) }}
          </template>
        </el-table-column>
        <el-table-column
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
      width="50%"
    >

      <el-form :model="editForm.data" label-width="300px" size="mini">
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>邀请函奖励信息</legend>
          <el-form-item label="比赛全局ID：" :required="true" label-width="120px">
            <el-select v-model="editForm.data.matchUniqueId" placeholder="请选择" size="mini" :disabled="!editForm.isAdd" @change="onMatchUniqueIdChange">
              <el-option v-for="item in InvitationUniqueIdCfgs" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联邀请函：" :required="true" label-width="120px">
            <!--根据InvitationUniqueIdCfgs 配置的属性invitationId 数组实现一个表格 一共有三列：第一列是 邀请函ID 第二列是邀请函名称 第三列是 图片，支持图片上传 -->
            <el-table :data="editForm.data.invitationList" border stripe :header-cell-style="libShow.DefaultTableHeadClass" :cell-style="libShow.TableCell(0)" style="width: 100%;line-height:35px;">
            <el-table-column prop="invitationId" label="邀请函ID" width="120px">
              <template slot-scope="scope">
                {{ scope.row.invitationId }}
              </template>
            </el-table-column>
            <el-table-column prop="invitationName" label="邀请函名称" width="180px">
              <template slot-scope="scope">
                {{ scope.row.invitationName }}
              </template>
            </el-table-column>
            <el-table-column prop="imagePath" label="图片" min-width="180px">
              <template slot-scope="scope">
                <ImagePicker v-model="scope.row.imagePath" />
              </template>
            </el-table-column>

              <el-table-column prop="sort" label="排序" min-width="180px">
              <template slot-scope="scope">
                <el-input
                  :value="scope.row.sort"
                  @input="handleSortInput(scope.$index, $event)"
                  style="width: 80px;"
                  size="mini"
                  placeholder="请输入排序值"
                  type="number"
                />
              </template>
            </el-table-column>
            </el-table>
          </el-form-item>


          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addRankRewards()">添加</el-button>
          <el-table
            :data="editForm.data.rankRewards"
            border
            stripe
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'35px'}"
            :cell-style="libShow.TableCell(0)"
            style="width: 100%;line-height:35px;"
            >
            <el-table-column prop="index" label="序号"  width="100px"/>
            <el-table-column prop="startRank" label="名次区间"
            >
            <template slot-scope="scope">
                <el-input v-model.number="scope.row.startRank" style="width: 80px;" size="mini" placeholder="开始名次" />至
                <el-input v-model.number="scope.row.endRank" style="width: 80px;" size="mini" placeholder="结束名次" />
              </template>
            </el-table-column>
            <el-table-column prop="invitationId" label="邀请函ID" width="200px">
              <template slot-scope="scope">
                <el-select
                  v-if="getAvailableInvitations().length > 1"
                  v-model="scope.row.invitationId"
                  placeholder="请选择邀请函"
                  size="mini"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in getAvailableInvitations()"
                    :key="item.invitationId"
                    :label="`${item.invitationId} - ${item.invitationName}`"
                    :value="item.invitationId"
                  />
                </el-select>
                <span v-else-if="getAvailableInvitations().length === 1">
                  {{ getAvailableInvitations()[0].invitationId }} - {{ getAvailableInvitations()[0].invitationName }}
                </span>
                <span v-else style="color: #999;">暂无邀请函</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeRewardItem(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </fieldset>

        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="savePosetCfg()">保存配置</el-button>
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
        status: -1,
        app_id: -1
      },
      posterList: {
        'tableData': [],
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
          matchUniqueId: 0,  //比赛全局ID
          invitationList: [], // 邀请函列表数组，用于表格显示
          rankRewards: this.initRankRewards(),
        }
      },
      AttrNames: {
      },


      //邀请函全局ID集合
      InvitationUniqueIdCfgs: [
        { 'value': 11001, 'label': 'TPCC日赛-观赛邀请函','invitationId':[4]},
        { 'value': 11002, 'label': 'TPCC周赛-观赛邀请函','invitationId':[4]},
        { 'value': 11003, 'label': 'TPCC月赛-观赛邀请函','invitationId':[4]},
        { 'value': 11004, 'label': 'TPCC半决赛-观赛邀请函','invitationId':[4]},
        { 'value': 11005, 'label': 'TPCC线上决赛-橙色邀请函+观赛邀请函','invitationId':[1,4]},
        { 'value': 11006, 'label': 'TPCC机酒赛-机酒邀请函+观赛邀请函','invitationId':[3,4]},
        { 'value': 11007, 'label': 'TPCC魔戒赛-(魔戒赛邀请函+观赛邀请函)','invitationId':[2,4]},
        { 'value': 11008, 'label': 'TPCC豪客赛-观赛邀请函','invitationId':[4]},
      ],
      InvitationIdCfgs: [
        { 'value': 1, 'label': '橙色邀请函' },
        { 'value': 2, 'label': '魔戒赛邀请函' },
        { 'value': 3, 'label': '机酒邀请函' },
        { 'value': 4, 'label': '观赛邀请函' },
      ],
      subKey: 'match_gtcc_prize_cfg'
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
    initRankRewards() {
      return [
        {
          index: 1,
          startRank: 1,//开始排名
          endRank: 1,//结束排名
          num :1,  //奖励数量
          invitationId: 0, //邀请函ID
        }
      ]
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


    addRankRewards() {
       var index = 0
       var maxRank = 0
       if (this.editForm.data.rankRewards.length > 0) {
        index = this.editForm.data.rankRewards.length
        for (let i = 0; i < this.editForm.data.rankRewards.length; i++) {
          if (this.editForm.data.rankRewards[i].endRank > maxRank) {
            maxRank = this.editForm.data.rankRewards[i].endRank
          }
        }
       }
       index++
       maxRank++
       // 如果只有一个邀请函，自动赋值
       let defaultInvitationId = 0
       if (this.editForm.data.invitationList && this.editForm.data.invitationList.length === 1) {
         defaultInvitationId = this.editForm.data.invitationList[0].invitationId
       }
       this.editForm.data.rankRewards.push({
        index: index,
        startRank: maxRank,
        endRank: maxRank,
        num: 1,
        invitationId: defaultInvitationId, //邀请函ID
      })
     },
    removeRewardItem(index) {
      this.editForm.data.rankRewards.splice(index, 1)
      if (this.editForm.data.rankRewards.length > 0) {
        for (var i = 0; i < this.editForm.data.rankRewards.length; i++) {
          this.editForm.data.rankRewards[i].index = i + 1
        }
      }
    },

    getInvitationName(id) {
      const item = this.InvitationUniqueIdCfgs.find(item => item.value === id)
      return item ? item.label : ''
    },
    /**
     * 根据邀请函ID获取邀请函名称
     */
    getInvitationNameById(invitationId) {
      const item = this.InvitationIdCfgs.find(item => item.value === invitationId)
      return item ? item.label : ''
    },
    /**
     * 处理排序输入
     */
    handleSortInput(index, value) {
      const numValue = value === '' || value === null || value === undefined ? 0 : Number(value)
      this.$set(this.editForm.data.invitationList[index], 'sort', isNaN(numValue) ? 0 : numValue)
    },
    /**
     * 获取当前可用的邀请函列表（用于下拉框）
     */
    getAvailableInvitations() {
      if (!this.editForm.data.invitationList || this.editForm.data.invitationList.length === 0) {
        return []
      }
      return this.editForm.data.invitationList.map(item => ({
        invitationId: item.invitationId,
        invitationName: item.invitationName,
        sort: item.sort
      }))
    },
    /**
     * 当比赛全局ID改变时，更新邀请函列表
     */
    onMatchUniqueIdChange(matchUniqueId) {
      if (!matchUniqueId || matchUniqueId <= 0) {
        this.editForm.data.invitationList = []
        return
      }

      // 查找对应的配置
      const config = this.InvitationUniqueIdCfgs.find(item => item.value === matchUniqueId)
      if (!config || !config.invitationId || !Array.isArray(config.invitationId)) {
        this.editForm.data.invitationList = []
        return
      }

      // 根据 invitationId 数组生成表格数据
      this.editForm.data.invitationList = config.invitationId.map((id, index) => {
        // 如果已有数据，保留图片路径和排序值
        const existingItem = this.editForm.data.invitationList.find(item => item.invitationId === id)
        return {
          invitationId: id,
          invitationName: this.getInvitationNameById(id),
          imagePath: existingItem ? existingItem.imagePath : '',
          sort: existingItem && existingItem.sort !== undefined ? existingItem.sort : (index + 1)
        }
      })
      //console.log("更新邀请函列表 matchUniqueId.",this.editForm.data.invitationList ,matchUniqueId)
      // 如果只有一个邀请函，自动为所有 rankRewards 赋值
      if (this.editForm.data.invitationList.length === 1) {
        const singleInvitationId = this.editForm.data.invitationList[0].invitationId
        //console.log("单个邀请函 ID:",singleInvitationId)
        if (this.editForm.data.rankRewards && this.editForm.data.rankRewards.length > 0) {
          this.editForm.data.rankRewards.forEach(reward => {
            if (!reward.invitationId || reward.invitationId === 0) {
              reward.invitationId = singleInvitationId
            }
          })
        }
      }
    },
    showForm(id) {
      if (id === 0) {
        this.editForm.title = '新增邀请函奖励配置'
        this.editForm.data = {
          id: 0,
          matchUniqueId: 0,
          invitationList: [],
          rankRewards: this.initRankRewards(),
        }
        this.editForm.isAdd = true
      } else {
        let editData = {}
        this.editForm.title = '编辑邀请函奖励配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === id) {
            editData = JSON.parse(JSON.stringify(this.posterList.tableData[i])) // 深拷贝
            break
          }
        }
        this.editForm.data = editData
        // 确保 rankRewards 存在
        if (!this.editForm.data.rankRewards || !Array.isArray(this.editForm.data.rankRewards)) {
          this.editForm.data.rankRewards = this.initRankRewards()
        } else {
          // 确保每个 rankReward 都有 invitationId 字段
          this.editForm.data.rankRewards.forEach(reward => {
            if (reward.invitationId === undefined || reward.invitationId === null) {
              reward.invitationId = 0
            }
          })
          // 如果只有一个邀请函，自动为所有 rankRewards 赋值
          if (this.editForm.data.invitationList && this.editForm.data.invitationList.length === 1) {
            const singleInvitationId = this.editForm.data.invitationList[0].invitationId
            this.editForm.data.rankRewards.forEach(reward => {
              if (!reward.invitationId || reward.invitationId === 0) {
                reward.invitationId = singleInvitationId
              }
            })
          }
        }
        // 确保 invitationList 存在，如果不存在则根据 matchUniqueId 生成
        if (!this.editForm.data.invitationList || !Array.isArray(this.editForm.data.invitationList)) {
          // 根据 matchUniqueId 生成邀请函列表
          this.onMatchUniqueIdChange(this.editForm.data.matchUniqueId)
        } else {
          // 如果已有 invitationList，确保每个项都有正确的名称和排序值
          this.editForm.data.invitationList.forEach((item, index) => {
            if (!item.invitationName) {
              this.$set(item, 'invitationName', this.getInvitationNameById(item.invitationId))
            }
            if (item.sort === undefined || item.sort === null) {
              this.$set(item, 'sort', index + 1)
            }
          })
          // 如果只有一个邀请函，自动为所有 rankRewards 赋值
          if (this.editForm.data.invitationList.length === 1) {
            const singleInvitationId = this.editForm.data.invitationList[0].invitationId
            if (this.editForm.data.rankRewards && this.editForm.data.rankRewards.length > 0) {
              this.editForm.data.rankRewards.forEach(reward => {
                if (!reward.invitationId || reward.invitationId === 0) {
                  reward.invitationId = singleInvitationId
                }
              })
            }
          }
        }
      }
      this.editForm.visable = true
    },
    savePosetCfg() {
      if (!this.configCheck()) {
        return
      }

      //var saveTime = new Date().getTime()
      if (this.editForm.isAdd === false) {
        for (var i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].id === this.editForm.data.id) {
            this.posterList.tableData[i].rankRewards = this.editForm.data.rankRewards
            this.posterList.tableData[i].matchUniqueId = this.editForm.data.matchUniqueId
            this.posterList.tableData[i].invitationList = this.editForm.data.invitationList
          }
        }
      } else {
        const config = this.InvitationUniqueIdCfgs.find(item => item.value === this.editForm.data.matchUniqueId)
        this.posterList.tableData.push(
          {
            'id': new Date().setSeconds(0),
            'rankRewards': this.editForm.data.rankRewards,
            'matchUniqueId': this.editForm.data.matchUniqueId,
            'invitationList': this.editForm.data.invitationList,
          }
        )
      }
      this.raw.Data = JSON.stringify(this.posterList)
      console.log("保存数据 ",this.posterList)
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
        for (const key in this.posterList.tableData) {
          if (this.posterList.tableData[key].id === id) {
            continue
          }
          newList.push(this.posterList.tableData[key])
        }
        this.posterList.tableData = newList
        this.raw.Data = JSON.stringify(this.posterList)
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
    onCompare(pre,pro) {
      const preVal=JSON.parse(pre.Data)
      const proVal=JSON.parse(pro.Data)
      //console.log("邀请函奖励配置对比",preVal)
      let str = ""
      // 编辑
      let has = false
      for (let i in preVal.tableData) {
        for (let j in proVal.tableData) {
          const preItem = preVal.tableData[i]
          const proItem = proVal.tableData[j]
          if (preItem.id === proItem.id) {
            if (JSON.stringify(preItem) !== JSON.stringify(proItem)) {
              has && (str += "\r\n---");has=true
              str += `\r\n修改：【${preItem.matchUniqueId}】，${this.getInvitationName(preItem.matchUniqueId)}`
              str += `\r\n奖励：${JSON.stringify(preItem.rankRewards)}`
            }
          }
        }
      }
      // 新增
      for (let i in preVal.tableData) {
        const preItem = preVal.tableData[i]
        if (!proVal.tableData.some(item=>item.id === preItem.id)) {
          has && (str += "\r\n---");has=true
          str += `\r\n增加：【${preItem.matchUniqueId}】，${this.getInvitationName(preItem.matchUniqueId)}`
          str += `\r\n奖励：${JSON.stringify(preItem.rankRewards)}`
        }
      }
      // 删除
      for (let i in proVal.tableData) {
        const proItem = proVal.tableData[i]
        if (!preVal.tableData.some(item=>item.id === proItem.id)) {
          has && (str += "\r\n---");has=true
          str += `\r\n删除：【${proItem.matchUniqueId}】，${this.getInvitationName(proItem.matchUniqueId)}`
          str += `\r\n奖励：${JSON.stringify(proItem.rankRewards)}`
        }
      }
      console.log("邀请函奖励配置对比",str)
      return str
    },

    configCheck() {
      if (this.editForm.data.rankRewards.length <= 0) {
        this.errmsg("请添加邀请函奖励配置")
        return false
      }
      // 检查邀请函列表
      if (!this.editForm.data.invitationList || this.editForm.data.invitationList.length === 0) {
        this.errmsg("请选择比赛全局ID信息，系统将自动生成关联邀请函列表")
        return false
      }
      // 检查每个邀请函是否都上传了图片
      for (let i = 0; i < this.editForm.data.invitationList.length; i++) {
        if (!this.editForm.data.invitationList[i].imagePath || this.editForm.data.invitationList[i].imagePath === '') {
          this.errmsg(`请为邀请函"${this.editForm.data.invitationList[i].invitationName}"上传图片`)
          return false
        }
      }

      // 检查每个排名区间的有效性
      for (let i = 0; i < this.editForm.data.rankRewards.length; i++) {
        const reward = this.editForm.data.rankRewards[i]
        if (!reward.startRank || !reward.endRank || reward.startRank <= 0 || reward.endRank <= 0) {
          this.errmsg("请填写正确的排名")
          return false
        }
        if (reward.startRank > reward.endRank) {
          this.errmsg("开始排名不能大于结束排名")
          return false
        }
        // 只有当有多个邀请函可选时才需要验证是否选择了邀请函ID
        const availableInvitations = this.getAvailableInvitations()
        if (availableInvitations.length > 1 && (!reward.invitationId || reward.invitationId <= 0)) {
          this.errmsg(`第${i + 1}行请选择邀请函ID`)
          return false
        }
      }

      // 判断排名区间是否有交叉或重叠
      // 两个区间 [a1, a2] 和 [b1, b2] 有重叠当且仅当: a2 >= b1 && b2 >= a1
      for (let i = 0; i < this.editForm.data.rankRewards.length; i++) {
        for (let j = i + 1; j < this.editForm.data.rankRewards.length; j++) {
          const range1 = this.editForm.data.rankRewards[i]
          const range2 = this.editForm.data.rankRewards[j]
          const start1 = range1.startRank
          const end1 = range1.endRank
          const start2 = range2.startRank
          const end2 = range2.endRank

          // 检查区间是否重叠
          if (end1 >= start2 && end2 >= start1) {
            this.errmsg(`排名区间有交叉：第${i + 1}行 [${start1}, ${end1}] 与第${j + 1}行 [${start2}, ${end2}] 重叠`)
            return false
          }
        }
      }

      if (this.editForm.data.matchUniqueId <= 0) {
        this.errmsg("请选择邀请函")
        return false
      }
      //检查不能出现重复的 matchUniqueId 新增的不能和已有的重复
      if (this.editForm.isAdd === true) {
        for (let i = 0; i < this.posterList.tableData.length; i++) {
          if (this.posterList.tableData[i].matchUniqueId === this.editForm.data.matchUniqueId) {
            this.errmsg("邀请函不能重复")
            return false
          }
        }
      }
      return true
    }
  },
}
</script>
