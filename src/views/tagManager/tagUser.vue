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
          style="width: 100%;margin-top:10px;"
        >
          <el-table-column
            prop="uid"
            label="Uid"
            width="150"
          />
          <el-table-column
            prop="tagType"
            label="标签类型"
            width="150"
          >
            <template slot-scope="scope">
              {{ tagName(scope.row.tagType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tagGid"
            label="游戏名称"
            width="180"
          >
            <template slot-scope="scope">
              {{ gameName(scope.row.tagGid) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tagName"
            label="标签名称"
          >
            <template slot-scope="scope">
              <el-tag v-for="(tag, index) in fieldName(scope.row)">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="tagData"
            label="标签数据"
          >
            <template slot-scope="scope">
              <el-tag v-for="(data, index) in tagData(scope.row)">
                {{ data }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="upTime"
            label="操作时间"
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
          {value: 0, label: '无限制'},
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
            {value: 10000, label: '用户类型', children: [
                    {value: 'new', label: '新增用户'},
                    {value: 'newplayer', label: '新进用户'},
                    {value: 'user', label: '老用户'},
                    {value: 'lose', label: '流失用户'},
                    {value: 'prelose', label: '预流失用户'},
                ]},
            {value: 20000, label: '时间', children: [
                    {value: 20001, label: '注册时间'},
                    {value: 20002, label: '最后登录时间'},
                ]},
            {value: 30000, label: 'KYC'},
            {value: 40000, label: '游戏强度', children: [
                    {value: 'core', label: '核心'},
                    {value: 'often', label: '常玩'},
                    {value: 'try', label: '尝试'},
                    {value: 'unfeeling', label: '无感'},
                    {value: 'roundAvg', label: '玩牌局数'},
                    {value: 'loginDay', label: '登录天数'},
                    {value: 'validBet', label: '有效下注'},
                ]},
            {value: 50000, label: '常玩底注'},
            {value: 60000, label: '最高场次'},
            {value: 70000, label: '信誉身份', children: [
                    {value: 70001, label: '认证用户'},
                    {value: 70002, label: '高信用户'},
                    {value: 70003, label: '低信用户'},
                    {value: 70004, label: '低危用户'},
                    {value: 70005, label: '疑似用户'},
                    {value: 70006, label: '黑子用户'},
                ]},
            {value: 80000, label: '赛事类型', children: [
                    {value: 80001, label: '免费'},
                    {value: 80002, label: '付费'},
                ]},
            {value: 90000, label: '平台VIP等级'},
            {value: 100000, label: '资产相关', children: [
                    {value: 100001, label: '用户单笔充值最高'},
                    {value: 100002, label: '用户累计充值额度'},
                    {value: 100003, label: '用户累计充值次数'},
                    {value: 100004, label: '是否全平台无牌局记录充值'},
                    {value: 100005, label: '用户登录资产'},
                    {value: 100006, label: '用户提现次数'},
                    {value: 100007, label: '用户累计提现额'},
                    {value: 100008, label: '用户最高提现额'}
                ]},
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
    created() {
      this.env = store.getters.env || this.env
      this.item.gameId = 0
      this.getGameList()
      this.getInfo()
    },
    methods: {
      selectChange(value) {
        console.log(value)
        for (const v of this.tagOptions) {
          if (v.value === value) {
              this.fieldOptions = v.children
              break
          }
        }
      },
      haveChildren(){
        for (const v of this.tagOptions) {
          if (v.value === this.form.tag_type) {
              return v.children && v.children.length>0
          }
        }
        return false
      },
      tagName(tag_type) {
        for (const v of this.tagOptions) {
          if (v.value === tag_type) {
            return v.label
          }
        }
        return ''
      },
      fieldName(row) {
        let tag = []
        for (const v of this.tagOptions) {
          if (v.value == row.tagType) {
            for (const vv of v.children) {
              if (row[vv.value] === 1) {
                tag.push(vv.label)
              }
            }
          }
        }
        return tag
      },
      tagData(row) {
        if (row.tagType === 40000) {
          return [`登录天数${row.loginDay|0}天`, `日均玩牌局数${row.roundAvg|0}局`, `有效下注${(row.validBet|0)/1000}`]
        }
        return []
      },
      gameName(gid) {
        if (gid === 0) {
          return '任意游戏'
        }
        for (const v of this.gameOptions) {
          if (v.value === gid) {
            return v.label
          }
        }
        return gid
      },
      formatTime(ts) {
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
            console.log(JSON.stringify(response.Data))
          }
        })
      }
    }
  }
  
  </script>
  