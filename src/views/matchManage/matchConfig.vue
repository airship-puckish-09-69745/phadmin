<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="matchCfgId" key-id="MatchConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
        <el-form-item label="游戏：" :required="true">
          <el-select v-model="form.gameId" placeholder="请选择" size="mini">
            <el-option label="全部" :value=-1></el-option>
            <el-option
              v-for="item in gameCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" :required="true">
          <el-select v-model="form.repeatType" placeholder="请选择" size="mini">
            <el-option label="全部" :value=-1></el-option>
            <el-option
              v-for="item in repeatCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :required="true">
          <el-select v-model="form.status" placeholder="请选择" size="mini">
            <el-option label="全部" :value=-1></el-option>
            <el-option
              v-for="item in statusCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="赛制：" :required="true">
          <el-select v-model="form.csId" placeholder="请选择" size="mini">
            <el-option label="全部" :value=-1></el-option>
            <el-option
              v-for="item in csCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  size="mini" @click="resetSearch">重置查询条件</el-button>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button size="mini" @click="showForm(0)" icon="el-icon-plus">添加比赛</el-button>
      </div>
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >
        <el-table-column
          prop="show_appinfo"
          label="APP信息"
          show-overflow-tooltip
        />
        <el-table-column
          prop="id"
          label="赛事ID"
        />
        <el-table-column
          prop="name"
          label="赛事名称"
        />
        <el-table-column
          prop="game_id"
          label="游戏名称"
        >
          <template slot-scope="scope">
            {{ getGameName(scope.row.game_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
        >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.start_time"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
        >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.end_time"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="modifier"
          label="修改人"
        />
        <el-table-column
          prop="update_time"
          label="修改时间"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="开关"
        >
          <template slot-scope="scope">
            <el-switch
              @change="updateStatus(scope.row.id, $event)"
              v-model="scope.row.openShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right"
          label="操作"
          width="200px"
        >
        <template slot-scope="scope">
          <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              icon="el-icon-edit"
              @click="showForm(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row.id)"
            >复制
            </el-button>
            <!-- <el-button
              type="success"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row)"
            >查看引用
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            当前页：{{ page }}/{{ Math.floor((total+limit)/limit) }}
          </span>
        </el-pagination>
      </div>
    </el-row>
    <el-dialog
      :title="editForm.title"
      :visible.sync="editForm.visable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editForm.data" label-width="200px" size="mini">
        <el-form-item v-if="editForm.data.id > 0" label="赛事ID：">
        {{ editForm.data.id }}
        </el-form-item>
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>APP信息</legend>
            <el-table
              :data="editForm.appInfo"
              border
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'35px'}"
              :cell-style="libShow.TableCell(0)"
              style="width: 100%;line-height:35px;"
            >
              <el-table-column
                prop="index"
                label="序号"
                width="50"
              />
              <el-table-column
                prop="appId"
                label="AppID"
                width="450"
              >
              <template slot-scope="scope">
                <el-select v-model="scope.row.appId" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in appidInfoCfgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
                </el-select>
              </template>
              </el-table-column>
              <el-table-column
                prop="channelId"
                label="渠道ID"
                width="450"
              >
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.channelId">
                <el-checkbox v-for="item in channelIdCfgs" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </template>
              </el-table-column>
          </el-table>
        </fieldset>
      <fieldset>
        <legend>赛事信息</legend>
        <el-form-item label="赛事名称：" :required="true">
          <el-input style="width: 200px;" v-model="editForm.data.name" placeholder="请填写赛事名称" />
        </el-form-item>
        <el-form-item label="游戏选择：" :required="true">
          <el-select @change="selectMatchGame()" v-model="editForm.data.gameId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="赛制选择：" :required="true">
          <el-select v-model="editForm.data.csId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in showCsCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开赛条件：" :required="true">
          <el-select v-model="editForm.data.opentMatchType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in openMatchTypeCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="editForm.data.opentMatchType==2" label="最低开赛人数：" :required="true">
          <el-input style="width: 200px;" v-model="editForm.data.opentMatchMember" placeholder="请填写开赛人数" />
        </el-form-item>
      </fieldset>
        <fieldset>
          <legend>开赛时间</legend>
          <el-form-item label="比赛类型：" :required="true">
            <el-select v-model="editForm.data.repeatType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in repeatCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType == 0" label="比赛时间：" :required="true">
              <el-date-picker
                v-model="editForm.loopDetail.onceTime"
                size="mini"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              />
          </el-form-item>

          <el-form-item label="提前显示时间(秒)：" :required="true">
            <el-input style="width: 200px;" v-model.number="editForm.data.preShowSeconds" placeholder="请填写提前显示时间" />
          </el-form-item>
          <el-form-item label="提前进入时间(秒)：" :required="true">
            <el-input style="width: 200px;" v-model.number="editForm.data.preEnterSeconds" placeholder="请填写提前进入时间" />
          </el-form-item>
          <el-form-item label="延迟进入时间(秒)：" :required="true" disabled="true">
            <el-input style="width: 200px;" v-model.number="editForm.data.delayEnterSeconds" placeholder="暂不支持" />
          </el-form-item>
        </fieldset>

        <fieldset>
          <legend>报名条件</legend>
          <el-form-item label="报名条件：" :required="true">
            <el-select v-model="editForm.data.signUpType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in signUpTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.data.signUpType == 0" label="报名费：" :required="true">
            <el-input style="width: 200px;" size="mini" v-model.number="editForm.data.signUpNum" placeholder="请填写金币数量" />
          </el-form-item>
        </fieldset>

        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>奖励信息</legend>
          <el-button style="margin-bottom: 10px;" @click="addRankRewards()" type="normal" size="mini">添加</el-button>
            <el-table
              :data="editForm.rankRewards"
              border
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'35px'}"
              :cell-style="libShow.TableCell(0)"
              style="width: 100%;line-height:35px;"
            >
              <el-table-column
                prop="index"
                label="序号"
                width="50"
              />
              <el-table-column
                prop="rewardItems"
                label="奖励"
                width="400"
              >
                <template slot-scope="scope">
                  <ul>
                    <li v-for="gItem in scope.row.rewardItems" :key="gItem.index" style="list-style: lower-roman;">
                      <el-select v-model="gItem.getType" placeholder="请选择" size="mini" style="width:80px">
                        <el-option
                          v-for="item in getTypeCfgs"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-input style="width: 80px;" v-model.number="gItem.getNum" size="mini" placeholder="请填写获得数量" />
                    </li>
                  </ul>
                </template>
              </el-table-column>
              <el-table-column
                prop="startRank"
                label="名次区间"
              >
                <template slot-scope="scope">
                  <el-input style="width: 40px;" v-model.number="scope.row.startRank" size="mini" placeholder="开始名次" />至
                  <el-input style="width: 40px;" v-model.number="scope.row.endRank" size="mini" placeholder="结束名次" />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button  @click="removeRewardItme(scope.$index)" type="danger" size="mini">移除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </fieldset>

        <el-divider></el-divider>
        <el-form-item>
          <el-button @click="saveMatch()" size="medium" type="primary" icon="el-icon-s-order">保存比赛配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>


</template>
<script>
import store from '@/store'
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { $libDate, $libShow} from '@/utils/common'
import AppInfo from '../devTools/appInfo.vue'
import { log } from 'console'

export default {
  name: 'MatchConfig',
  components: { Compare, Publish, DateTimeShow },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      form: {
        gameId: -1,
        status: -1,
        csId: -1,
        repeatType: -1,
      },
      appidInfoCfgs:[
        {"value": 1000002, "label":"dayusenlin"},
        {"value": 1000003, "label":"testaccount"},
        {"value": 1000004, "label":"testkey"},
        {"value": 1000005, "label":"BingoPlusTongits"},
        {"value": 1000006, "label":"BingoPlusTest"},
        {"value": 1000007, "label":"br"},
        {"value": 1100000, "label":"xworld"},
      ],
      gameCfgs: [
        {"value": 1000, "label":"tongits"},
        // {"value": 15, "label":"德州"}
      ],
      channelIdCfgs: [
        {"value": "BP", "label":"BP"},
        {"value": "AP", "label":"AP"},
        {"value": "GP", "label":"GP"},
        {"value": "PG", "label":"PG"},
        {"value": "DEV", "label":"DEV"},
      ],
      statusCfgs: [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁用"},
      ],
      repeatCfgs: [
        {"value":0,"label":"单场"},
      ],
      openMatchTypeCfgs: [
        {"value":2,"label":"定时开赛"},
      ],
      signUpTypeCfgs: [
        {"value":0,"label":"付费报名"},
        {"value":1,"label":"免费报名"},
      ],
      getTypeCfgs: [
        {"value":1,"label":"金币"},
      ],
      csCfgs: [],
      showCsCfgs: [],
      tableData: [],
      limit: 10,
      total: 0,
      page: 1,
      editForm: {
        visable: false,
        title: "",
        isAdd: false,
        data: {
          id: 0,
          name: "",
          gameId: 0,
          csId: 0,
          opentMatchType: 0,
          opentMatchMember: 0,
          repeatType: 0,
          repeatDetail: "",
          signUpType:0,
          signUpNum:0,
          preShowSeconds: 0,
          preEnterSeconds: 0,
          delayEnterSeconds: 0,
          rankRewardsDetail: ""
        },
        loopDetail: {
          //只有一场
          onceTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())]
        },
        rankRewards: [
          {
            index: 1,
            startRank: 1,
            endRank: 1,
            rewardItems: [
              {
                index: 1,
                getType: 0,
                getPid: 0,
                getNum: 0
              }
            ]
          }
        ],
        appInfo:[
          {
            index:1,
            appId:1000002,
            channelId:[]
          },
        ],
        whileList: {
          type: 0,
          data: []
        }
      },
      AttrNames: {
        appInfo: "APP信息",
        matchCfgId: "赛事id",
        title: "赛事名称",
        gid: "游戏id",
        ruleId: "赛制id",
        startType: "开赛方式",
        startUserNum: "开赛人数",
        repeatType: "循环类型",
        startDateTime: "开始日期",
        finishDateTime: "结束日期",
        preShowSeconds: "提前展示比赛(秒)",
        preEnterSeconds: "提前进入比赛(秒)",
        delayEnterSeconds: "延迟进入比赛(秒)",
        signType: "报名方式",
        signNum: "报名费数量",
        status: "状态",
        rewardsCfg: "名次奖励"
      }
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
    this.getCsCfgs()
  },
  mounted() {
    this.getList()
  },
  methods: {
    resetSearch() {
      this.form.gameId = -1
      this.form.status = -1
      this.form.csId = -1
      this.form.repeatType = -1
    },
    getCsCfgs() {
      request({
        url: '/matchconfig/match/rule/list',
        method: 'get',
        data: {
          Env: this.env,
          Status: 0,
          PageNum: 1,
          PageSize: 200,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            for (var i=0;i<objs.list.length;i++) {
              this.csCfgs.push({
                "label": "["+objs.list[i].id+"]"+objs.list[i].name,
                "value": objs.list[i].id,
                "gameId": [parseInt(objs.list[i].game_id, 10)]
              })
            }
          }
        }
      })
    },
    getList() {
      request({
        url: 'matchconfig/match/config/list',
        method: 'get',
        data: {
          Env: this.env,
          GameId: this.form.gameId,
          Status: this.form.status,
          CsId: this.form.csId,
          RepeatType: this.form.repeatType,
          PageNum: this.page,
          PageSize: this.limit,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.total > 0) {
            this.total=objs.total;
            this.tableData = objs.list;
            if (this.tableData.length > 0) {
              for (let i=0;i<this.tableData.length;i++) {
                if (this.tableData[i].status == 0) {
                  this.tableData[i].openShow = true
                } else {
                  this.tableData[i].openShow = false
                }

                let show_appinfo = ""
                let appInfoTemp = JSON.parse(this.tableData[i].app_info_cfg)

                for (let i=0;i<appInfoTemp.length;i++) {

                  if (i == 0) {
                    show_appinfo += appInfoTemp[i].appId + " "
                  }else {
                    show_appinfo += "  " + appInfoTemp[i].appId + " "
                  }
                  
                  show_appinfo += appInfoTemp[i].channelId
                }

                this.tableData[i].show_appinfo = show_appinfo
              }
            }
          } else {
            this.total=0;
            this.tableData = [];
          }
        }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getGameName(gameId) {
      var gameName = ""
      for(var i=0;i<this.gameCfgs.length;i++) {
        if (this.gameCfgs[i].value == gameId) {
          gameName =this.gameCfgs[i].label
          break
        }
      }
      return gameName
    },
    getRepeatTypeShow(repeatType) {
      var show = ""
      for (var i=0;i<this.repeatCfgs.length;i++) {
        if (this.repeatCfgs[i].value == repeatType) {
          show = this.repeatCfgs[i].label
          break
        }
      }
      return show
    },
    selectMatchGame() {
      this.showCsCfgs = []
      //循环遍历是否存在gameId
      if(this.csCfgs.length > 0) {
        for(var i=0;i<this.csCfgs.length;i++) {
          if (this.checkHaveGame(this.editForm.data.gameId, this.csCfgs[i].gameId)) {
            this.showCsCfgs.push(this.csCfgs[i])
          }
        }
      }
    },
    addRankRewards() {
      var index = 0
      var maxRank = 0
      if (this.editForm.rankRewards.length > 0) {
        index = this.editForm.rankRewards.length
        for (var i=0;i<this.editForm.rankRewards.length;i++) {
          if (this.editForm.rankRewards[i].endRank > maxRank) {
            maxRank = this.editForm.rankRewards[i].endRank
          }
        }
      }
      index++
      maxRank++
      this.editForm.rankRewards.push({
        index: index,
        startRank: maxRank,
        endRank: maxRank,
        rewardItems: [
          {
            index: 1,
            getType: 0,
            getPid: 0,
            getNum: 0
          }
        ]
      })
    },
    addAppInfo(index) {
      var index = this.editForm.appInfo.length
      index++
      this.editForm.appInfo.push({
        index: index,
        appId: 1000002,
        channelId: [],
      })
    },
    removeAppInfo(index) {
      this.editForm.appInfo.splice(index, 1)
      if (this.editForm.appInfo.length > 0) {
        for (var i=0;i<this.editForm.appInfo.length;i++) {
          this.editForm.appInfo[i].index = i+1
        }
      }
    },
    removeRewardItme(index) {
      this.editForm.rankRewards.splice(index, 1)
      if (this.editForm.rankRewards.length > 0) {
        for (var i=0;i<this.editForm.rankRewards.length;i++) {
          this.editForm.rankRewards[i].index = i+1
        }
      }
    },
    formatNum(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    updateStatus(id, val) {
      let status = 0
      for (let i=0;i<this.tableData.length;i++) {
        if (this.tableData[i].id == id) {
          this.tableData[i].openShow = val
          if (val) {
            this.tableData[i].status = 0
          } else {
            this.tableData[i].status = 1
          }
          status = this.tableData[i].status
          break
        }
      }
      request({
        url: '/matchconfig/match/config/status',
        method: 'post',
        data: {
          Env: this.env,
          Id: id,
          Status: status,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let showMsg = "启用赛事配置成功！"
          if (status == 1) {
            showMsg = "禁用赛事配置成功！"
          }
          Message.success(showMsg)
          this.getList()
          return
        } else {
          Message.error('更新状态失败：'+response.Data)
          return
        }
      })
    },
    showForm(id) {
      if (id == 0) {
        this.editForm.title = "新增比赛配置"
        this.editForm.data = {
          id: 0,
          name: "",
          gameId: 0,
          csId: 0,
          opentMatchType: 2,
          opentMatchMember: 0,
          repeatType: 0,
          repeatDetail: "",
          signUpType:0,
          signUpNum:0,
          preShowSeconds: 0,
          preEnterSeconds: 0,
          delayEnterSeconds: 0,
          rankRewardsDetail: "",
          status: 0
        }
        this.editForm.loopDetail = {
          //只有一场
          onceTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())]
        }
        this.editForm.appInfo = [
          {
            index: 1,
            appId: 1000002,
            channelId: []
          }
        ]
        this.editForm.rankRewards = [
          {
            index: 1,
            startRank: 1,
            endRank: 1,
            rewardItems: [
              {
                index: 1,
                getType: 0,
                getPid: 0,
                getNum: 0
              }
            ]
          }
        ]
        this.editForm.whileList = {
          type: 0,
          data: []
        }
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
      } else {
        let editData = {}
        this.editForm.title = "编辑比赛配置"
        this.editForm.isAdd = false
        for (let i=0;i<this.tableData.length;i++) {
          if (this.tableData[i].id == id) {
            editData = this.tableData[i]
            break
          }
        }
        if (typeof editData.id === "undefined") {
          Message.error("比赛配置不存在")
          return
        }
        this.editForm.data = {
          id: editData.id,
          name: editData.name,
          gameId: editData.game_id,
          csId: editData.cs_id,
          opentMatchType: editData.open_match_type,
          opentMatchMember: editData.open_match_member,
          repeatType: editData.repeat_type,
          repeatDetail: editData.repeat_detail,
          signUpType: editData.sign_up_type,
          signUpNum: editData.sign_up_num,
          preShowSeconds: editData.pre_show_seconds,
          preEnterSeconds: editData.pre_enter_seconds,
          delayEnterSeconds: editData.delay_enter_seconds,
          rankRewardsDetail: editData.rewards,
          status: editData.status
        }
        this.editForm.rankRewards = JSON.parse(editData.rewards)
        if (editData.repeat_type == 0) {
          this.editForm.loopDetail.onceTime = [new Date(editData.start_time*1000),new Date(editData.end_time*1000)]
        }
        this.editForm.appInfo = JSON.parse(editData.app_info_cfg)
        this.showCsCfgs = []
        //循环遍历是否存在gameId
        if(this.csCfgs.length > 0) {
          for(var i=0;i<this.csCfgs.length;i++) {
            if (this.checkHaveGame(this.editForm.data.gameId, this.csCfgs[i].gameId)) {
              this.showCsCfgs.push(this.csCfgs[i])
            }
          }
        }
      }
      this.editForm.visable = true
    },
    checkHaveGame(gid, gameArr) {
      let flag = false
      for (var i=0;i<gameArr.length;i++) {
        if (gid == gameArr[i]) {
          flag = true
          break
        }
      }
      return flag
    },
    saveMatch() {
      if (!this.configCheck()) {
        return
      }
      let rankReward = JSON.stringify(this.editForm.rankRewards)
      let whileDetail = JSON.stringify(this.editForm.whileList)
      let bTime = Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)
      let eTime = Math.floor(this.editForm.loopDetail.onceTime[1] / 1000)
      let duration = eTime - bTime
      let repeatDetail = JSON.stringify({startTime: bTime,endTime: eTime})
      request({
        url: '/matchconfig/match/config/create',
        method: 'post',
        data: {
          Env: this.env,
          Id: this.editForm.data.id,
          AppInfo: JSON.stringify(this.editForm.appInfo),
          Name: this.editForm.data.name,
          Status: this.editForm.data.status,
          GameId: this.editForm.data.gameId,
          CsId: this.editForm.data.csId,
          OpenMatchType: this.editForm.data.opentMatchType,
          OpenMatchMember: this.editForm.data.opentMatchMember,
          SignUpType: this.editForm.data.signUpType,
          SignUpNum: this.editForm.data.signUpNum,
          Rewards: rankReward,
          RepeatType: this.editForm.data.repeatType,
          RepeatDetail: repeatDetail,
          WhileList: whileDetail,
          PreShowSeconds: this.editForm.data.preShowSeconds,
          PreEnterSeconds: this.editForm.data.preEnterSeconds,
          DelayEnterSeconds: this.editForm.data.delayEnterSeconds
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let showMsg = "新增比赛配置成功！"
          if (this.editForm.data.id > 0) {
            showMsg = "编辑比赛配置成功！"
          }
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
          return
        } else {
          let errMsg = "新增比赛配置失败！"
          if (this.editForm.data.id > 0) {
            errMsg = "编辑比赛配置失败！"
          }
          Message.error(errMsg+response.Data)
          return
        }
      })
    },
    handleCopy(id) {
      this.$confirm('确定要复制吗？', '提醒')
          .then(() => {
            request({
              url: '/matchconfig/match/config/copy',
              method: 'post',
              data: {
                Env: this.env,
                Id: id,
              }
            }).then(response => {
              if (response.RetCode === 0) {
                Message.success("复制比赛配置成功！")
                this.getList()
                return
              } else {
                Message.error('复制比赛配置失败：'+response.Data)
                return
              }
            })
          })
          .catch(() => {
            console.log('取消')
          })
    },
    errmsg(txt) {
      this.$alert(txt,'',{
        type: 'error',
        center: true,
        showConfirmButton: false,
      });
    },
    configCheck() {
      if (this.editForm.data.opentMatchMember <= 0) {
        this.errmsg('开赛人数值无效！')
        return false
      } else if (this.editForm.data.opentMatchMember % 3 != 0) {
        this.errmsg('开赛人数值必须是3的倍数！')
        return false
      } else if ((Math.floor(this.editForm.loopDetail.onceTime[1] / 1000) - Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)) < 600) {
        this.errmsg('比赛开始结束间隔要大于10分钟！')
        return false
      } else if (this.editForm.data.signUpNum < 0) {
        this.errmsg('报名费数值不能小于零')
        return false
      } 
      return true
    }
  }
}
</script>