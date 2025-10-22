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
            width="70"
          />
          <el-table-column
            prop="tag_type"
            label="标签类型"
            width="120"
          >
            <template slot-scope="scope">
              {{ tagTypeName(scope.row.tag_type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_id"
            label="标签"
            width="140"
          >
            <template slot-scope="scope">
              {{ tagIdName(scope.row.tag_id) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_name"
            label="标签名称"
            width="120"
          >
            <template slot-scope="scope">
              {{ tagValName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_gid"
            label="关联游戏"
            width="150"
          >
            <template slot-scope="scope">
              <div v-html="gameName(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="数据"
            width="120"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="setItem(scope.row)" :disabled="![10003,10004,20000].includes(scope.row.tag_id)">查看数据</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_attr"
            label="标签定义"
          >
            <template slot-scope="scope">
              <div v-html="attrName(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
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
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="modify_time"
            label="操作时间"
            width="150"
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
        width="40%"
        >
        <span>
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="标签类型：">
              <el-select v-model="form.tag_type" placeholder="placeholder"  @change="selectChange">
                <el-option
                    v-for="opt in tagOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标签：">
              <el-cascader v-model="form.tag_ids" :options="fieldOptions" :show-all-levels="false" @change="cascaderChange">
              </el-cascader>
            </el-form-item>
            <el-form-item v-if="gameIntensity()" label="字段：">
              <el-select v-model="form.tag_val" placeholder="placeholder">
                <el-option
                    v-for="opt in intensityOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showSlotsOptions()" label="选择游戏：">
              <el-select v-model="form.gids" filterable multiple placeholder="placeholder">
                <el-option
                    v-for="opt in slotsOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="showDaysOptions()" label="连续天数：">
              <el-col :span="8">
                <el-input v-model.number="form.days" placeholder="placeholder">
                  <template slot="append">{{ appendDayName(form.tag_id) }}</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item v-if="form.tag_id===50007" label="每日下注次数：">
              <el-col :span="8">
                <el-input v-model.number="form.leastBetTimes" placeholder="placeholder">
                  <template slot="prepend">≥</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item v-if="form.tag_type===5 && form.tag_id!==50008 && form.tag_id!==50001" label="区间配置：">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span>轻度用户：{{ areaPageName(form) }} ≥ </span>
                <el-input placeholder="起始金额" v-model="form.grade[0]" size="mini" style="width: 120px;"/>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span>中等用户：{{ areaPageName(form) }} ≥ </span>
                <el-input placeholder="起始金额" v-model="form.grade[1]" size="mini" style="width: 120px;"/>
              </div>
              <div style="display: flex; align-items: center;">
                <span>重度用户：{{ areaPageName(form) }} ≥ </span>
                <el-input placeholder="起始金额" v-model="form.grade[2]" size="mini" style="width: 120px;"/>
              </div>
            </el-form-item>
            <el-form-item v-if="form.tag_id===10004" label="降低系数：">
              <el-col :span="8">
                <el-input v-model.number="form.reduce" placeholder="placeholder"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item v-if="form.tag_id===10004" label="历史有效下注：">
              <el-col :span="8">
                <el-input v-model.number="form.totalBet" placeholder="placeholder"></el-input>
              </el-col>
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
                  <el-checkbox v-model="form.roundAvg.use" @change="form.validBet.use=form.roundAvg.use?!form.roundAvg.use:form.validBet.use">启用</el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-input v-if="form.roundAvg.use" v-model.number="form.roundAvg.val" placeholder="大于等于"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="gameIntensity()" label="有效下注：">
              <el-row>
                <el-col :span="4">
                  <el-checkbox v-model="form.validBet.use" @change="form.roundAvg.use=form.validBet.use?!form.validBet.use:form.roundAvg.use">启用</el-checkbox>
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
      <el-dialog
        title="标签数据"
        :visible.sync="syncStat"
        width="70%"
        >
        <span>
          <el-form :inline="true" :model="item">
            <el-form-item label="标签：">
              <el-cascader v-model="item.values" :options="tagOptions" :show-all-levels="false" style="width: 120px;" size="mini"></el-cascader>
            </el-form-item>
            <el-form-item v-if="item.values[1]==20000" label="字段：">
              <el-select v-model="item.tagVal" placeholder="placeholder" style="width: 100px;" size="mini">
                <el-option :value="0" label="所有"></el-option>
                <el-option
                    v-for="opt in intensityOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.values[0]===2||item.values[0]===3" label="选择游戏：">
                <el-select v-model="item.gid" filterable placeholder="placeholder" style="width: 180px;" size="mini">
                    <el-option v-if="gameIntensity()" :value="0" label="任意游戏"></el-option>
                    <el-option
                        v-for="opt in gameOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="选择日期：">
              <el-date-picker
                v-model="item.dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="showStat" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </span>
        <span>
          <el-table
            ref="filterTable"
            :data="statData"
            stripe
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%;margin-top:10px;"
          >
            <el-table-column
              prop="date"
              label="日期"
            >
            </el-table-column>
            <el-table-column
              prop="gid"
              label="游戏"
            >
              <template slot-scope="scope">
                <div v-html="gameName(scope.row)"></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="tagId"
              label="标签"
            >
              <template slot-scope="scope">
                {{ tagIdName(scope.row.tagId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="tagVal"
              label="标签名"
            >
              <template slot-scope="scope">
                {{ tagFieldName(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cnt"
              label="人数"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="incCnt"
              label="新增人数"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="decCnt"
              label="去除人数"
              width="150"
            >
            </el-table-column>
          </el-table>
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
          tag_id: '标签ID',
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
        slotsOptions: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        fieldOptions: [],
        form: {
          tag_type: 2,
          tag_id: 0,
          tag_ids: [],
          tag_val: 0,
          tag_name: '',
          tag_gid: 22,
          gids: [],
          loginDay: [0,0],
          roundAvg: {use:false, val: 0},
          validBet: {use:false, val: 0},
          days: 7,
          reduce: 50,
          totalBet: 0,
          slotsAttr: [],
          leastBetTimes: 0,
          grade: [0,0,0]
        },
        syncInfo: false,
        syncStat: false,
        appInfo: [],
        env: 'test',
        item: {
          values: [0,0],
          gid: 0,
          tagType: 0,
          tagId: 0,
          tagVal: 0,
          dateRange: [new Date(new Date().getTime()-86400*7*1000),new Date()]
        },
        isEdit: false,
        tableData: [],
        statData: [],
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
      cascaderChange(value) {
        if (this.form.tag_type === 5) {
          this.form.tag_gid = 0
        }
        if (value.length === 1) {
          this.form.tag_id = value[0]
        } else {
          this.form.tag_id = value[1]
        }
        for (const v of this.fieldOptions) {
          if (v.value === this.form.tag_id) {
            this.form.tag_name = v.label
            return
          }
          if (v.children) {
            for (const v2 of v.children) {
              if (v2.value === this.form.tag_id) {
                this.form.tag_name = v2.label
                return
              }
            }
          }
        }
      },
      selectChange(value,skip) {
        // console.log(value)
        for (const v of this.tagOptions) {
          if (v.value === value) {
              this.fieldOptions = v.children
              break
          }
        }
        if (skip) {
          return
        }
        if (this.fieldOptions && this.fieldOptions.length>0) {
          this.form.tag_val = 0
          this.form.tag_id = this.fieldOptions[0].value
          this.form.tag_ids = [this.form.tag_id]
        }
        if (this.gameIntensity()) {
          this.form.tag_val = this.intensityOptions[0].value
        }
        if (this.form.tag_type === 5) {
          this.form.tag_gid = 0
        }
      },
      appendDayName(tag_id) {
        if (tag_id === 50008) {
          return '日未上线'
        }
        return '日'
      },
      areaPageName({tag_id, tag_name}) {
        if (tag_id === 50009) {
          return '返奖倍数'
        }
        if (tag_id < 50100) {
          return tag_name
        }
        return '下注次数'
      },
      tagTypeName(tag_type) {
        for (const v of this.tagOptions) {
          if (v.value === tag_type) {
            return v.label
          }
        }
        return ''
      },
      tagIdName(tag_id) {
        for (const v of this.tagOptions) {
          for (const v2 of v.children) {
            if (v2.value === tag_id) {
              return v2.label
            }
            if (v2.children) {
              for (const v3 of v2.children) {
                if (v3.value === tag_id) {
                  return '['+v2.label+']'+v3.label
                }
              }
            }
          }
        }
        return ''
      },
      tagValName(row) {
        if (row.tag_id === 20000) {
          for (const v of this.intensityOptions) {
            if (v.value === row.tag_val) {
              return v.label
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
      tagFieldName(row) {
        const tagType = this.getTagType(row.tagId)
        console.log("tagType", tagType)
        if (tagType === 0) {
          return ""
        }
        if (tagType === 2) {
          for (const v of this.intensityOptions) {
            if (v.value === row.tagVal) {
              return v.label
            }
          }
        } else if (tagType === 3) {
          return row.tagVal/1000
        }
        return row.tagVal
      },
      gameName(row) {
        const gameIds = []
        if (row.tag_attr) {
          const attr = JSON.parse(row.tag_attr)
          if (attr.gids) {
            gameIds.push(...attr.gids)
          }
        }
        if (row.tag_gid > 0) {
          gameIds.push(row.tag_gid)
        }
        if (row.gid > 0) {
          gameIds.push(row.gid)
        }
        if (gameIds.length === 0) {
          return ''
        }
        const gameIdStr = []
        for (const v of this.gameOptions) {
          if (gameIds.includes(v.value)) {
            gameIdStr.push(v.label)
          }
        }
        return gameIdStr.join('<br/>')
      },
      attrName(row) {
        if (row.tag_id === 10002) {
          return `未在${this.gameName(row)}投注过的用户`
        }
        if (row.tag_attr === '{}') {
          return this.slotsAttrName(row)
        }
        // console.log(JSON.stringify(row))
        if (row.tag_type === 2) {
          const attr = JSON.parse(row.tag_attr)
          let str = `一周内在${this.gameName(row)}登录天数在区间[${attr.loginDay[0]}-${attr.loginDay[1]}]`
          if (attr.roundAvg.use) {
            str += `,日均玩牌局数>=${attr.roundAvg.val}`
          }
          if (attr.validBet.use) {
            str += `,有效下注>=${attr.validBet.val}`
          }
          return str
        } else if (row.tag_id === 10003) {
          const attr = JSON.parse(row.tag_attr)
          return `连续${attr.days}天未进入厅方的游戏用户`
        } else if (row.tag_id === 10004) {
          const attr = JSON.parse(row.tag_attr)
          return `最近一自然周的总有效下注对比前一自然周降低>=${attr.reduce}%且历史有效下注>=${attr.totalBet}`
        } else if (row.tag_type === 5) {
          return this.slotsAttrName(row)
        }

        return row.tag_attr
      },
      slotsAttrName(row) {
        if (row.tag_type !== 5) {
          return ''
        }
        const attr = JSON.parse(row.tag_attr)
        // console.log('slotsAttrName',JSON.stringify(row))
        if (row.tag_id === 50001) {
          return `首次进入咱们Slots的用户`
        } else if (row.tag_id === 50008) {
          return `连续${attr.days}天未上线`
        }
        let dayStr = ''
        if (![50001].includes(row.tag_id)) {
          dayStr = `连续${attr.days}天`
        }
        if ([50007].includes(row.tag_id)) {
          dayStr += ` 每日下注次数≥${attr.leastBetTimes}次`
        }
        if (row.tag_id === 50009) {
          let str = `小奖用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[0]/1000}<br/>`
          str += `中奖用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[1]/1000}<br/>`
          str += `大奖用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[2]/1000}`
          return str
        }
        let str = `轻度用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[0]}<br/>`
        str += `中度用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[1]}<br/>`
        str += `重度用户：${dayStr} ${this.areaPageName(row)}>=${attr.grade[2]}`
        return str
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
      showSlotsOptions() {
        if (this.form.tag_type !== 5) {
          return false
        }
        return [50100,50200,50300].includes(this.form.tag_ids[0])
      },
      showDaysOptions() {
        return (this.form.tag_id === 10003 || this.form.tag_type === 5) && this.form.tag_id !== 50001
      },
      showGameOptions() {
        return (this.form.tag_type === 2 || this.form.tag_type === 3 || this.form.tag_id === 10002)
      },
      gameIntensity(tagId) {
        if (tagId) {
          return (tagId === 20000)
        }
        return (this.form.tag_type === 2 && this.form.tag_id === 20000)
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
        // console.log(JSON.stringify(row))
        const attr = JSON.parse(row.tag_attr)
        this.form.id = row.id
        this.form.tag_type = row.tag_type
        this.form.tag_id = row.tag_id
        for (let i = 0; i < this.tagOptions.length; i++) {
          if (this.tagOptions[i].value !== row.tag_type) {
            continue
          }
          if (this.tagOptions[i].children) {
            const children = this.tagOptions[i].children
            for (let k = 0; k < children.length; k++) {
              if (children[k].value === row.tag_id) {
                this.form.tag_ids = [row.tag_id]
                break
              }
              const grandChildren = children[k].children
              if (grandChildren) {
                for (let l = 0; l < grandChildren.length; l++) {
                  if (grandChildren[l].value === row.tag_id) {
                    this.form.tag_ids = [children[k].value,row.tag_id]
                    break
                  }
                }
              }
            }
          }
        }
        this.form.tag_val = row.tag_val
        this.form.tag_name = row.tag_name
        this.form.tag_gid = row.tag_gid
        this.form.status = row.status
        attr.loginDay && (this.form.loginDay = attr.loginDay)
        attr.roundAvg && (this.form.roundAvg = attr.roundAvg)
        attr.validBet && (this.form.validBet = attr.validBet)
        attr.days && (this.form.days = attr.days)
        attr.reduce && (this.form.reduce = attr.reduce)
        attr.totalBet && (this.form.totalBet = attr.totalBet)
        attr.grade && (this.form.grade = (this.form.tag_id===50009?[attr.grade[0]/1000,attr.grade[1]/1000,attr.grade[2]/1000]:attr.grade))
        attr.gids && (this.form.gids = attr.gids)
        attr.leastBetTimes && (this.form.leastBetTimes = attr.leastBetTimes)
        this.selectChange(this.form.tag_type,true)
      },
      copy(row) {
        this.syncInfo = true
        this.isEdit = false
        const attr = JSON.parse(row.tag_attr)
        // this.form.id = row.id
        this.form.tag_id = row.tag_id
        this.form.tag_type = row.tag_type
        this.form.tag_val = row.tag_val
        this.form.tag_name = row.tag_name
        this.form.tag_gid = row.tag_gid
        this.form.status = row.status
        attr.loginDay && (this.form.loginDay = attr.loginDay)
        attr.roundAvg && (this.form.roundAvg = attr.roundAvg)
        attr.validBet && (this.form.validBet = attr.validBet)
        attr.days && (this.form.days = attr.days)
        attr.reduce && (this.form.reduce = attr.reduce)
        attr.totalBet && (this.form.totalBet = attr.totalBet)
        attr.grade && (this.form.grade = (this.form.tag_id===50009?[attr.grade[0]/1000,attr.grade[1]/1000,attr.grade[2]/1000]:attr.grade))
        attr.gids && (this.form.gids = attr.gids)
        attr.leastBetTimes && (this.form.leastBetTimes = attr.leastBetTimes)
        this.selectChange(this.form.tag_type,true)
      },
      add() {
        this.syncInfo = true
        this.isEdit = false
        this.form.id = 0
        this.form.tag_id = 0
        if ([10001,10003,10004,40001,40002].includes(this.form.tag_id) || this.form.tag_type === 5) {
          this.form.tag_gid = 0
        } else {
          this.form.tag_gid = 22
        }
        this.form.tag_type = this.tagOptions[0].value
        this.selectChange(this.tagOptions[0].value)
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
              if (v.tag_id === this.form.tag_id && v.tag_gid === this.form.tag_gid && v.tag_val === this.form.tag_val) {
                Message.error("重复标签")
                return
              }
              if (v.tag_id === this.form.tag_id && v.tag_gid === this.form.tag_gid && this.gameIntensity()) {
                if (form.loginDay[0] < attr.loginDay[0] && form.loginDay[1] >= attr.loginDay[0]) {
                  Message.error(`标签区间[${form.loginDay[0]},${form.loginDay[1]}]与标签《${this.tagValName(v.tag_val)}》的区间[${attr.loginDay[0]},${attr.loginDay[1]}]有重叠`)
                  return
                }
                if (form.loginDay[1] > attr.loginDay[1] && form.loginDay[0] <= attr.loginDay[1]) {
                  Message.error(`标签区间[${form.loginDay[0]},${form.loginDay[1]}]与标签《${this.tagValName(v.tag_val)}》的区间[${attr.loginDay[0]},${attr.loginDay[1]}]有重叠`)
                  return
                }
              }
            }
          }
          this.form.roundAvg.val = Number(this.form.roundAvg.val)
          this.form.validBet.val = Number(this.form.validBet.val)
          this.form.tag_attr = JSON.stringify({
            loginDay: this.form.loginDay,
            roundAvg: this.form.roundAvg,
            validBet: this.form.validBet
          })
        } else if (this.form.tag_id === 10003) {
          this.form.days = Number(this.form.days)
          this.form.tag_attr = JSON.stringify({
            days: this.form.days,
          })
        } else if (this.form.tag_id === 10004) {
          this.form.reduce = Number(this.form.reduce)
          this.form.totalBet = Number(this.form.totalBet)
          this.form.tag_attr = JSON.stringify({
            reduce: this.form.reduce,
            totalBet: this.form.totalBet
          })
        } else if (this.form.tag_type === 5) {
          if (!this.checkSlotsParam()) {
            return
          }
          this.makeSlotsTagAttr()
        }
        this.syncInfo = false
        this.isEdit?this.tagUpdate():this.tagCreate()
        this.isEdit = false
      },
      makeSlotsTagAttr() {
        const attr = {}
        if (this.form.tag_id === 50001) { // 新用户

        } else if (this.form.tag_id === 50007) { // 连续下注天数
          attr.days = this.form.days
          attr.leastBetTimes = this.form.leastBetTimes
          attr.grade = this.form.grade
        } else if (this.form.tag_id === 50009) { // 回归用户
          attr.days = this.form.days
          attr.grade = [
            this.form.grade[0]*1000,
            this.form.grade[1]*1000,
            this.form.grade[2]*1000,
          ]
        } else if (this.form.tag_id < 50100) {
          attr.days = this.form.days
          attr.grade = this.form.grade
        } else if (this.form.tag_id >= 50100 && this.form.tag_id < 50399) { // gid
          attr.days = this.form.days
          attr.gids = this.form.gids
          attr.grade = this.form.grade
        }
        this.form.tag_attr = JSON.stringify(attr)
      },
      checkSlotsParam() {
        if ([50008,50001,50002].includes(this.form.tag_id)) { // 新增用户，回归用户，新注册用户
          return true
        }

        this.form.grade[0] = Number(this.form.grade[0])
        this.form.grade[1] = Number(this.form.grade[1])
        this.form.grade[2] = Number(this.form.grade[2])
        
        // 验证金额区间是否合理
        if (this.form.grade[0] < 0 || this.form.grade[1] < 0 || 
            this.form.grade[2] < 0) {
          Message.error("金额不能为负数")
          return false
        }
        
        if (this.form.grade[0] >= this.form.grade[1] || 
            this.form.grade[1] >= this.form.grade[2]) {
          Message.error("轻度用户不能大于中度用户，中度用户不能大于重度用户")
          return false
        }

        return true
      },
      setItem(row) {
        console.log(JSON.stringify(row))
        this.item.tagType = this.getTagType(row.tag_id)
        this.item.gid = row.tag_gid
        this.item.tagId = row.tag_id
        this.item.tagVal = row.tag_val
        this.item.values = [this.item.tagType,this.item.tagId]
        console.log("setItem", this.item.values)
        this.showStat()
      },
      showStat() {
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/misc/tag/stat',
            queryBegin: Math.floor(this.item.dateRange[0].getTime()/1000),
            queryEnd: Math.floor(this.item.dateRange[1].getTime()/1000),
            gid: this.item.gid,
            tagId: this.item.values[this.item.values.length - 1],
            tagVal: this.item.tagVal,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.statData = response.Data || []
            this.syncStat = true
            console.log(JSON.stringify(response.Data))
          }
        })
      },
      tagList() {
        request({
          url: '/tagconfig/tag/list',
          method: 'get',
          data: {
            Env: this.env,
            PageNum: this.page,
            PageSize: this.limit,
            TagId:this.form.tagId,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || {}
            if (objs.total > 0) {
              this.tableData = []
              this.tableData = objs.list
              this.totalCount = objs.total
              this.$refs.compare.SetOldVal(response.Data)
            }
          } else {
            this.totalCount = 0
            this.tableData = []
          }
        })
      },
      tagCreate() {
        this.form.status = 0
        const editData = this.form
        if ([10001,10003,10004,40001,40002].includes(editData.tag_id)) {
          editData.tag_gid = 0
        }
        console.log("editData", editData)
        request({
          url: '/tagconfig/tag/create',
          method: 'POST',
          data: {
            Env: this.env,
            ID: editData.id,
            TagType: editData.tag_type,
            TagId: editData.tag_id,
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
        if ([10001,10003,10004,40001,40002].includes(editData.tag_id)) {
          editData.tag_gid = 0
        }
        request({
          url: '/tagconfig/tag/update',
          method: 'POST',
          data: {
            Env: this.env,
            ID: editData.id,
            TagType: editData.tag_type,
            TagId: editData.tag_id,
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
  