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
          style="width: 40%;margin-top:10px;"
        >
          <el-table-column
            prop="uid"
            label="Uid"
            width="150"
          />
          <el-table-column
            prop="tagVal"
            label="标签名称"
          >
          <template slot-scope="scope">
              {{ tagIdName(scope.row.tagId) + "  [" +  tagFieldName(scope.row.tagVal) + ']'}}
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
            {value: 10000, label: '新增用户'},
            {value: 20000, label: '新进用户'},
            {value: 30000, label: '流失用户'},
            {value: 40000, label: '预流失用户'},
          ]},
          {value: 2, label: '游戏强度', children: [
            {value: 50000, label: '登录天数'},
            {value: 60000, label: '日平局局数'},
            {value: 70000, label: '游戏强度'},
          ]},
          {value: 3, label: '常玩底注', children: [
            {value: 80000, label: '常玩底注'},
            {value: 90000, label: '最高场次'},
          ]},
          {value: 4, label: '赛事类型', children: [
            {value: 100000, label: '免费'},
            {value: 110000, label: '付费'},
          ]}
        ],
        intensityOptions: [
          {value: 1, label: '无感'},
          {value: 2, label: '尝试'},
          {value: 3, label: '常玩'},
          {value: 4, label: '核心'},
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
      tagIdName(tag_id,tag_val) {
        for (const v of this.tagOptions) {
          for (const v2 of v.children) {
            if (v2.value === tag_id) {
              return v2.label
            }
          }
        }
        return ''
      },
      tagFieldName(value) {
        for (const v of this.intensityOptions) {
          if (v.value === value) {
            return v.label
          }
        }
        return ""
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
        if (ts === undefined) {
          $libDate.FormateSecondStr(new Date().getTime(), 2)
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
  