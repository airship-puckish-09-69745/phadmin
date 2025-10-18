<template>
    <div class="app-container">
      <el-row>
        <el-form :model="form" :inline="true" size="mini">
          <el-form-item label="UID：" :required="true">
            <UidInput ref="uidInput" @setUid="function(iUid){form.Uid=iUid}" />
          </el-form-item>
          <el-button  size="mini" type="primary" @click="getInfo">查询</el-button>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          ref="filterTable"
          :data="tableData"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 50%;margin-top:10px;"
        >
          <el-table-column
            prop="uid"
            label="Uid"
            width="150"
          />
          <el-table-column
            prop="tagId"
            label="标签"
          >
          <template slot-scope="scope">
              {{ tagIdName(scope.row.tagId)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="tagVal"
            label="数据"
          >
          <template slot-scope="scope">
              {{ tagFieldName(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="tagGid"
            label="关联游戏"
            width="180"
          >
            <template slot-scope="scope">
              {{ gameName(scope.row.tagGid) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="upTime"
            label="更新时间"
            width="200"
          > 
            <template slot-scope="scope">
              {{ formatTime(scope.row.upTime) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </template>
  
  <style>
  .tooltip-button {
    margin-right: 10px;
  }
  </style>
  
  <script>
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import UidInput from '@/components/UidInput'
  import request from '@/utils/request'
  import { $libDate, $libShow } from '@/utils/common'
  import store from '@/store'
  import { Message } from 'element-ui'
  import DateTimeShow from '@/components/DatetimeShow'
  
  export default {
    components: { Compare, Publish, DateTimeShow, UidInput },
    data() {
      return {
        AttrNames: {
          tag_type: '标签类型',
          tag_name: '标签名称',
          tag_gid: '关联游戏',
          tag_attr: '标签属性',
          status: '标签状态',
          modify_time: '修改时间',
          id: '标签ID',
        },
        name: 'tagConfig',
        libShow: $libShow,
        dayOptions: [
          {value: 0, label: '0天'},
          {value: 1, label: '1天'},
          {value: 2, label: '2天'},
          {value: 3, label: '3天'},
          {value: 4, label: '4天'},
          {value: 5, label: '5天'},
          {value: 6, label: '6天'},
          {value: 7, label: '7天'}
        ],
        gameOptions: [],
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
              {value: 50107, label: '糖果系列'},
              {value: 50108, label: '小众系列'},
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
        intensityOptions: [
          {value: 1, label: '无感'},
          {value: 2, label: '尝试'},
          {value: 3, label: '常玩'},
          {value: 4, label: '核心'},
        ],
        slotsValOptions: [
          {value: 1, label: '轻度用户'},
          {value: 2, label: '中度用户'},
          {value: 3, label: '重度用户'},
        ],
        fieldOptions: [],
        form: {
            Uid: 0,
        },
        appInfo: [],
        env: 'test',
        item: {
          tag_gid: 0,
          start: $libDate.GetDayBegin(new Date().getTime()-86400*7*1000),
          end: $libDate.GetDayEnd(new Date().getTime())
        },
        isEdit: false,
        tableData: [],
        libShow: $libShow,
      }
    },
    computed: {},
    mounted() {
      this.env = store.getters.env || this.env
      if (this.$route.query && this.$route.query.uid > 0) {
        this.form.Uid = parseInt(this.$route.query.uid)
        this.$refs.uidInput.saveUid(this.form.Uid)
        console.log('set mounted', this.form.Uid)
      }
    },
    activated() {
      if (this.$route.query && this.$route.query.uid > 0) {
        this.form.Uid = parseInt(this.$route.query.uid)
        this.$refs.uidInput.saveUid(this.form.Uid)
        console.log('set activated', this.form.Uid)
      }
    },
    created() {
      this.env = store.getters.env || this.env
      this.getGameList()
      if (this.$route.query && this.$route.query.uid > 0) {
        this.form.Uid = parseInt(this.$route.query.uid)
        this.$refs.uidInput.saveUid(this.form.Uid)
        console.log('set mounted', this.form.Uid)
      }
    },
    methods: {
      tagIdName(tag_id) {
        for (const v of this.tagOptions) {
          for (const v2 of v.children) {
            if (v2.value === tag_id) {
              return v2.label
            }
            if (v2.children && v2.children.length > 0) {
              for (const v3 of v2.children) {
                if (v3.value === tag_id) {
                  return v3.label
                }
              }
            }
          }
        }
        return ''
      },
      getTagType(tag_id) {
        for (const v of this.tagOptions) {
          for (const v2 of v.children) {
            if (v2.value === tag_id) {
              return v.value
            }
          }
        }
        return 0
      },
      isBet(tagType,tagId) {
        return (tagType === 3) || (tagId === 20003)
      },
      isVal(tagId) {
        return [20001,20002].includes(tagId)
      },
      tagFieldName(row) {
        const tagType = this.getTagType(row.tagId)
        console.log("tagType", tagType)
        if (tagType === 5 && ![50001,50008].includes(row.tagId)) {
          for (const v of this.slotsValOptions) {
            if (v.value === row.tagVal) {
              return v.label
            }
          }
          return 0
        }
        if (tagType === 2 && row.tagId === 20000) {
          for (const v of this.intensityOptions) {
            if (v.value === row.tagVal) {
              return v.label
            }
          }
          return 0
        } else if (this.isBet(tagType,row.tagId)) {
          return row.tagVal/1000
        } else if (this.isVal(row.tagId)) {
          return row.tagVal
        }
        return row.tagVal == 1?'-':row.tagVal
      },
      gameName(gid) {
        if (gid === 0) {
          return ''
        }
        for (const v of this.gameOptions) {
          if (v.value === gid) {
            return v.label
          }
        }
        return gid
      },
      formatTime(ts) {
        if (ts === undefined || ts === 0) {
          return ""
        }
        return $libDate.FormateSecondStr(ts, 2)
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
                  label: response.Data[i].Scene
              })
            }
          }
        })
      },
      gameIntensity() {
        return (this.form.tag_type === 40000)
      },
      formatNumber(n) {
        return n.toLocaleString()
      },
      getInfo() {
        if (this.form.Uid === 0) {
          Message.error("请输入Uid")
          return 
        }
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/user/tag/info',
            Uid: this.form.Uid,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.tableData = response.Data || []
            if (this.tableData.length > 0) {
              for (let i=0; i < this.tableData.length; i++) {
                if (this.tableData[i].tagVal === 0) {
                  console.log("pass",JSON.stringify(this.tableData[i]))
                  this.tableData.splice(i,1)
                  i--
                }
              }
            }
            console.log(JSON.stringify(this.tableData))
          }
        })
      }
    }
  }
  
  </script>
  