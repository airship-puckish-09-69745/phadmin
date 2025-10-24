<template>
  <div class="app-container">
    <el-form :model="form" label-width="110px" size="small">
      <el-form-item label="用户ID：">
        <el-input v-model="form.uid" placeholder="请输入查询id" style="width: 200px; display: inline-block;" />
        <el-button type="primary" style="margin-left: 15px;" @click="getInfo">查询</el-button>
      </el-form-item>
      <el-form-item label="标签：">
        <el-cascader v-model="form.tag_ids" :options="tagOptions" :show-all-levels="false" @change="cascaderChange"></el-cascader>
        <el-button v-if="!needTagValue()" type="primary" style="margin-left: 15px;" @click="setInfo">添加</el-button>
      </el-form-item>
      <el-form-item v-if="needGameValue()" label="关联游戏：">
        <el-select v-model="form.tag_gid" placeholder="请选择关联游戏">
          <el-option
              v-for="opt in gameOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="needTagValue()" label="标签值：">
        <el-select v-if="selectTagValue()&&form.tag_id === 50009" v-model="form.tag_val" placeholder="请选择标签级别">
          <el-option
              v-for="opt in awardOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
        <el-select v-else-if="selectTagValue()&&form.tag_type === 5" v-model="form.tag_val" placeholder="请选择标签级别">
          <el-option
              v-for="opt in gradeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
        <el-select v-else-if="selectTagValue()&&form.tag_id === 20000" v-model="form.tag_val" placeholder="请选择标签级别">
          <el-option
              v-for="opt in intensityOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
        <el-input v-else v-model="form.tag_val" placeholder="请输入数值" style="width: 200px; display: inline-block;" />
        <el-button type="primary" style="margin-left: 15px;" @click="setInfo">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  name: 'TagUser',
  components: {},
  data() {
    return {
      form: {
        uid: 11253536,
        tag_type: 2,
        tag_id: 20000,
        tag_ids: [2,20000],
        tag_val: 1,
        tag_gid: 22
      },
      tagOptions: [
        {value: 1, label: '用户类型', children: [
          {value: 10001, label: '新增用户'},
          {value: 10002, label: '新进用户'},
          {value: 10003, label: '流失用户'},
          {value: 10004, label: '预流失用户'},
        ]},
        {value: 2, label: '游戏强度', children: [
          {value: 20000, label: '游戏强度'},
          {value: 20001, label: '登录天数'},
          {value: 20002, label: '日平局局数'},
          {value: 20003, label: '有效下注'},
        ]},
        {value: 3, label: '游戏场次', children: [
          {value: 30001, label: '常玩底注'},
          {value: 30002, label: '最高场次'},
        ]},
        {value: 4, label: '赛事类型', children: [
          {value: 40001, label: '免费'},
          {value: 40002, label: '付费'},
        ]},
        {value: 5, label: 'Slots用户类型', children: [
          {value: 50001, label: '新增用户'},
          {value: 50002, label: '登录天数'},
          {value: 50003, label: '携带金额'},
          {value: 50004, label: '下注次数'},
          {value: 50005, label: '下注额度'},
          {value: 50006, label: '日均下注额度'},
          {value: 50007, label: '连续下注天数'},
          {value: 50008, label: '回归用户'},
          {value: 50009, label: '最近中奖上限'},
          {value: 50100, label: '主题', children: [
            {value: 50101, label: '扑克/麻将主题'},
            {value: 50102, label: '经典寻宝/777主题'},
            {value: 50103, label: '传说神话主题'},
            {value: 50104, label: '传统节日主题'},
            {value: 50105, label: '菲律宾本地化主题'},
            {value: 50106, label: '动物与自然'},
          ]},
          {value: 50200, label: '基础中奖方式', children: [
            {value: 50201, label: '连线全线'},
            {value: 50202, label: '连线固定线'},
            {value: 50203, label: '无线数量中奖'},
            {value: 50204, label: '无线相连中奖'},
            {value: 50205, label: '其他'},
          ]},
          {value: 50300, label: '小游戏玩法', children: [
            {value: 50301, label: '固定大奖(mini固定奖励)'},
            {value: 50302, label: 'JP玩法(滚动全员奖励)'},
            {value: 50303, label: 'BONUS玩法(3次旋转金币)'},
            {value: 50304, label: 'FreeSpin玩法(免费旋转)'},
          ]},
        ]}
      ],
      gameOptions:[],
      slotsOptions: [],
      gradeOptions: [
        {value: 1, label: '轻度用户'},
        {value: 2, label: '中度用户'},
        {value: 3, label: '重度用户'},
      ],
      awardOptions: [
        {value: 1, label: '小奖用户'},
        {value: 2, label: '中奖用户'},
        {value: 3, label: '大奖用户'},
      ],
      intensityOptions: [
        {value: 1, label: '无感'},
        {value: 2, label: '尝试'},
        {value: 3, label: '常玩'},
        {value: 4, label: '核心'},
      ]
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.tagList()
    this.getGameList()
  },
  methods: {
    tagList() {
      request({
        url: '/tagconfig/tag/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 0,
          PageSize: 10000,
          TagId: 0,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          console.log(response.Data)
        }
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            // console.log(response.Data[i])
            this.gameOptions.push({
                value: response.Data[i].Gid,
                label: response.Data[i].Description
            })
            if (response.Data[i].CategoryID === 1) { // 老虎机
              this.slotsOptions.push({
                value: response.Data[i].Gid,
                label: response.Data[i].Description
              })
            }
          }
        }
      })
    },
    getInfo() {
      const $this = this
      this.saveFlag = false
      let searchUid = 0
      if (this.form.uid > 0) {
        searchUid = this.form.uid
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Uid: searchUid,
          Gid: this.form.tag_gid,
          TagId: this.form.tag_id,
          Path: '/tools/tag'
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          console.log(response.Data)
          this.form.tag_val = response.Data.tagVal
        }
      })
    },
    setInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Uid: this.form.uid,
          Gid: this.form.tag_gid,
          TagId: this.form.tag_id,
          TagVal: this.form.tag_val,
          Path: '/tools/tag'
        }
      }).then(response => {
        console.log(response)
        if (response.RetCode === 0) {
          this.$message({
            message: response.Data,
            type: 'success'
          })
        } else {
          this.$message.error(response.Data)
          return
        }
      })
    },
    cascaderChange(value) {
      this.form.tag_id = value[value.length - 1]
      this.form.tag_val = 1
      this.form.tag_type = value[0]

    },
    needTagValue() {
      if ([20000,20001,20002,20003,30001,30002].includes(this.form.tag_id)) {
        return true
      }
      if (this.form.tag_type === 5 && ![50001,50008].includes(this.form.tag_id)) {
        return true
      }
      return false
    },
    selectTagValue() {
      if ([20000].includes(this.form.tag_id)) {
        return true
      }
      if (this.form.tag_type === 5 && ![50001,50008].includes(this.form.tag_id)) {
        return true
      }
    },
    needGameValue() {
      if ([20000].includes(this.form.tag_id)) {
        return true
      }
      return false
    }
  }
}
</script>
