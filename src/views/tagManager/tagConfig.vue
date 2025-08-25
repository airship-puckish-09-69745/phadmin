<template>
    <div class="app-container">
      <publish primary-key="id" key-id="UserTagConfig" :env-empty="true" :attr-names="AttrNames" :head-attrs="['id']" />
      <el-row style="margin-top: 30px">
        <el-button type="primary" size="mini" @click="add">添加</el-button>
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
            prop="id"
            label="ID"
            width="120"
          />
          <el-table-column
            prop="tag_type"
            label="标签类型"
            width="100"
          >
            <template slot-scope="scope">
              {{ tagName(scope.row.tag_type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_name"
            label="标签名称"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="tag_gid"
            label="游戏名称"
            width="150"
          >
            <template slot-scope="scope">
              {{ gameName(scope.row.tag_gid) }}
            </template>
          </el-table-column>
          <el-table-column
            label="数据"
            width="120"
          >
            <el-button type="primary" size="mini" @click="showStat">数据</el-button>
          </el-table-column>
          <el-table-column
            prop="tag_attr"
            label="标签定义"
            width="600"
          >
            <template slot-scope="scope">
              {{ attrName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="primary" size="mini" @click="copy(scope.row)">复制</el-button>
              <el-button type="danger" size="mini" @click="tagDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifier"
            label="最后操作人"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="modify_time"
            label="操作时间"
          > 
            <template slot-scope="scope">
              {{ formatTime(scope.row.modify_time) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="12">
          <div class="block">
            <el-pagination
              :current-page="page"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="标签信息"
        :visible.sync="syncInfo"
        width="30%"
        >
        <span>
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="标签：">
              <el-select v-model="form.tag_type" placeholder="placeholder"  @change="selectChange">
                <el-option
                    v-for="opt in tagOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="haveChildren()" label="字段：">
              <el-select v-model="form.tag_val" placeholder="placeholder" @change="tagValChange">
                <el-option
                    v-for="opt in fieldOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showGameOptions()" label="选择游戏：">
                <el-select v-model="form.tag_gid" filterable placeholder="placeholder">
                    <el-option v-if="gameIntensity()" :value="0" label="任意游戏"></el-option>
                    <el-option
                        v-for="opt in gameOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="gameIntensity()" label="登录天数：">
              <el-row>
                <el-col :span="3">最小值</el-col>
                <el-col :span="8">
                  <el-select v-model="form.loginDay[0]" placeholder="最小值">
                    <el-option
                        v-for="opt in dayOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">最大值</el-col>
                <el-col :span="8">
                  <el-select v-model="form.loginDay[1]" placeholder="最大值">
                    <el-option
                        v-for="opt in dayOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="gameIntensity()" label="日均玩牌数：">
              <el-row>
                <el-col :span="4">
                  <el-checkbox v-model="form.roundAvg.use">启用</el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-input v-if="form.roundAvg.use" v-model.number="form.roundAvg.val" placeholder="大于等于"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="gameIntensity()" label="有效下注：">
              <el-row>
                <el-col :span="4">
                  <el-checkbox v-model="form.validBet.use">启用</el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-input v-if="form.validBet.use" v-model.number="form.validBet.val" placeholder="大于等于"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="syncInfo = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
        </span>
      </el-dialog>
      <!--对比组件-->
      <compare ref="compare" />
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
          tag_val: '标签值',
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
          {value: 10000, label: '用户类型', children: [
            {value: 1, label: '新增用户'},
            {value: 2, label: '新进用户'},
            {value: 3, label: '流失用户'},
            {value: 4, label: '预流失用户'},
          ]},
          {value: 40000, label: '游戏强度', children: [
            {value: 1, label: '无感'},
            {value: 2, label: '尝试'},
            {value: 3, label: '常玩'},
            {value: 4, label: '核心'},
          ]},
          {value: 50000, label: '常玩底注', children: [
            {value: 0, label: '常玩底注'},
          ]},
          {value: 60000, label: '最高场次', children: [
            {value: 0, label: '最高场次'},
          ]},
          {value: 80000, label: '赛事类型', children: [
            {value: 1, label: '免费'},
            {value: 2, label: '付费'},
          ]}
        ],
        fieldOptions: [],
        form: {
          tag_type: 40000,
          tag_val: 0,
          tag_name: '',
          tag_gid: 22,
          loginDay: [0,0],
          roundAvg: {use:false, min: 0},
          validBet: {use:false, min: 0},
        },
        syncInfo: false,
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
        totalCount: 0,
        page: 1,
        limit: 20
      }
    },
    computed: {},
    created() {
      this.env = store.getters.env || this.env
      this.item.gameId = 0
      this.getGameList()
      this.tagList()
      this.selectChange(this.form.tag_type)
    },
    methods: {
      tagValChange(value) {
        for (const v of this.fieldOptions) {
          if (v.value == value) {
            this.form.tag_name = v.label
          }
        }
      },
      selectChange(value) {
        // console.log(value)
        for (const v of this.tagOptions) {
          if (v.value === value) {
              this.fieldOptions = v.children
              break
          }
        }
        if (this.fieldOptions && this.fieldOptions.length>0) {
          this.form.tag_val = this.fieldOptions[0].value
          this.form.tag_name = this.fieldOptions[0].label
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
      fieldName(tag_val) {
        // console.log(tag_val, this.fieldOptions)
        for (const v of this.fieldOptions) {
          if (v.value == tag_val) {
            return v.label
          }
        }
        return ''
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
      attrName(row) {
        if (row.tag_attr === '{}') {
          return ""
        }
        // console.log(JSON.stringify(row))
        if (row.tag_type === 40000) {
          const attr = JSON.parse(row.tag_attr)
          let str = `一周内在${this.gameName(row.tag_gid)}登录天数在区间[${attr.loginDay[0]}-${attr.loginDay[1]}]`
          if (attr.roundAvg.use) {
            str += `,日均玩牌局数>=${attr.roundAvg.val}`
          }
          if (attr.validBet.use) {
            str += `,有效下注>=${attr.validBet.val}`
          }
          return str
        }
        return row.tag_attr
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
      showGameOptions() {
        return (this.form.tag_type === 40000 || this.form.tag_type === 50000 || this.form.tag_type === 60000)
      },
      gameIntensity() {
        return (this.form.tag_type === 40000)
      },
      handleSizeChange(val) {
        this.page = 1
        this.limit = val
        this.tagList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.tagList()
      },
      formatNumber(n) {
        return n.toLocaleString()
      },
      click2getInfo() {
        this.page = 1
        this.tagList()
      },
      edit(row) {
        this.syncInfo = true
        this.isEdit = true
        console.log(JSON.stringify(row))
        const attr = JSON.parse(row.tag_attr)
        this.form.id = row.id
        this.form.tag_type = row.tag_type
        this.form.tag_val = row.tag_val
        this.form.tag_name = row.tag_name
        this.form.tag_gid = row.tag_gid
        this.form.status = row.status
        this.form.loginDay = attr.loginDay
        this.form.roundAvg = attr.roundAvg
        this.form.validBet = attr.validBet
        this.selectChange(this.form.tag_type)
      },
      copy(row) {
        this.syncInfo = true
        const attr = JSON.parse(row.tag_attr)
        // this.form.id = row.id
        this.form.tag_type = row.tag_type
        this.form.tag_val = row.tag_val
        this.form.tag_name = row.tag_name
        this.form.tag_gid = row.tag_gid
        this.form.status = row.status
        this.form.loginDay = attr.loginDay
        this.form.roundAvg = attr.roundAvg
        this.form.validBet = attr.validBet
        this.selectChange(this.form.tag_type)
      },
      add() {
        this.syncInfo = true
        this.form.id = 0
      },
      sure() {
        this.form.tag_attr = '{}'
        if (this.gameIntensity()){
          if (!this.isEdit) {
            const form = this.form
            if (this.form.loginDay[0] > this.form.loginDay[1]) {
              Message.error("登录天数最小值不能大于最大值")
              return
            }
            for (const v of this.tableData) {
              const attr = JSON.parse(v.tag_attr)
              if (v.tag_type === this.form.tag_type && v.tag_gid === this.form.tag_gid && v.tag_val === this.form.tag_val) {
                Message.error("重复标签")
                return
              }
              if (v.tag_type === this.form.tag_type && v.tag_gid === this.form.tag_gid && this.gameIntensity()) {
                if (form.loginDay[0] < attr.loginDay[0] && form.loginDay[1] >= attr.loginDay[0]) {
                  Message.error(`标签区间[${form.loginDay[0]},${form.loginDay[1]}]与标签《${this.fieldName(v.tag_val)}》的区间[${attr.loginDay[0]},${attr.loginDay[1]}]有重叠`)
                  return
                }
                if (form.loginDay[1] > attr.loginDay[1] && form.loginDay[0] <= attr.loginDay[1]) {
                  Message.error(`标签区间[${form.loginDay[0]},${form.loginDay[1]}]与标签《${this.fieldName(v.tag_val)}》的区间[${attr.loginDay[0]},${attr.loginDay[1]}]有重叠`)
                  return
                }
              }
            }
          }
          this.form.tag_attr = JSON.stringify({
            loginDay: this.form.loginDay,
            roundAvg: this.form.roundAvg,
            validBet: this.form.validBet
          })
        }
        this.syncInfo = false
        this.isEdit?this.tagUpdate():this.tagCreate()
        this.isEdit = false
      },
      showStat() {
        console.log("show Stat")
      },
      tagList() {
        request({
          url: '/tagconfig/tag/list',
          method: 'get',
          data: {
            Env: this.env,
            PageNum: this.page,
            PageSize: this.limit,
            TagType:this.form.TagType,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || {}
            if (objs.total > 0) {
              this.tableData = []
              this.tableData = objs.list
              this.total = objs.total
              this.$refs.compare.SetOldVal(response.Data)
            }
          } else {
            this.total = 0
            this.tableData = []
          }
        })
      },
      tagCreate() {
        this.form.status = 0
        const editData = this.form
        request({
          url: '/tagconfig/tag/create',
          method: 'POST',
          data: {
            Env: this.env,
            ID: editData.id,
            TagType: editData.tag_type,
            TagVal: editData.tag_val,
            TagName: editData.tag_name,
            TagGid: editData.tag_gid,
            TagAttr: editData.tag_attr,
            Status: editData.status,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success("添加成功")
            this.tagList()
          } else {
            let errMsg ='添加失败！'
            Message.error(errMsg + response.Data)
          }
        })
      },
      tagDelete(id){
        this.$confirm('您确定要将该标签删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/tagconfig/tag/delete',
            method: 'post',
            data: {
              Env: this.env,
              ID: id
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('删除标签成功')
              this.tagList()
            } else {
              Message.error('删除标签失败！')
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      },
      tagUpdate() {
        const editData = this.form
        request({
          url: '/tagconfig/tag/update',
          method: 'POST',
          data: {
            Env: this.env,
            ID: editData.id,
            TagType: editData.tag_type,
            TagVal: editData.tag_val,
            TagName: editData.tag_name,
            TagGid: editData.tag_gid,
            TagAttr: editData.tag_attr,
            Status: editData.status,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            let showMsg = '更新成功！'
            Message.success(showMsg)
            this.tagList()
          } else {
            let errMsg = '更新失败！'
            Message.error(errMsg + response.Data)
          }
        })
      }
    }
  }
  
  </script>
  