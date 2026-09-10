<template>
  <div class="app-container">
      <el-row>
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" />
      </el-row>

  <el-form ref="item" :model="editForm" label-width="120px" size="mini">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="S5基础配置" name="base">

        <el-form-item label="AppId：">
          <el-select
            v-model="editForm.app_id_list"
            placeholder="请选择"
            style="width: 400px"
            multiple
            @change="onAppIdOptionsChange">
            <el-option v-for="item in APPID_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="color:red; margin-left:10px">控制前端界面显示,数据进入榜单,勾选生效</span>
        </el-form-item>

        <el-form-item label="站点：">
          <el-select
            v-model="editForm.site_id_list"
            placeholder="请选择"
            style="width: 400px"
            multiple
            @change="onSiteIdOptionsChange"
          >
            <el-option v-for="item in CHANNEL_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="color:red; margin-left:10px">控制前端界面显示,数据进入榜单,勾选生效</span>
        </el-form-item>

    <fieldset style="margin:20px 0; max-width: 980px;">
      <legend>时间轴</legend>
      <el-table
        :data="editForm.time_list"
        border
        size="mini"
        style="width: 100%;"
      >
        <el-table-column label="类型" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="请选择"
              size="mini"
              style="width: 180px;"
            >
              <el-option
                v-for="item in S5_FUNC_TIME_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="isTimeTypeUsed(item.value, scope.$index)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="起止时间" min-width="420">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.time_range_ui"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions"
              size="mini"
              style="width: 380px;"
              align="right"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeTimeCfg(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-top: 10px;" type="normal" size="mini" @click="addTimeCfg()">添加时间配置</el-button>
    </fieldset>
    <fieldset style="margin:20px 0; max-width: 980px;">
      <legend>门票点榜(日榜)</legend>
      <el-row>
        <el-col :span="11">
      <el-form-item label="结算时间:" :required="true">
        <el-time-picker
          v-model="dayRankSettleTimeStr"
          style="width: 180px;"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          placeholder="结算时间"
          size="mini"
        />
        <span style="color:red; margin-left:10px">线上填[00:00:30]</span>
      </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="奖励最大排名:" :required="true" prop="day_rank_cfg.reward_max_rank">
            <el-input v-model.number="editForm.day_rank_cfg.reward_max_rank" style="width: 180px;" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="显示最大排名:" :required="true" prop="day_rank_cfg.max_rank">
            <el-input v-model.number="editForm.day_rank_cfg.max_rank" style="width: 180px;" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span:="11">
          <el-form-item label="有效时间:" :required="true">
            <el-date-picker
              v-model="dayRankValidTimeRangeUi"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions"
              size="mini"
              style="width: 380px;"
              align="right"
            />
          </el-form-item>
        </el-col>
      </el-row>



      <el-button style="margin: 10px 0; font-weight: bold;" type="normal" size="medium" @click="addPropCfg()">添加门票奖励配置</el-button>
      <el-table
        :data="editForm.day_rank_cfg.prop_reward"
        border
        size="mini"
        style="width: 100%;"
      >
        <el-table-column label="周次" width="80" align="center">
          <template slot-scope="scope">
            第{{ scope.$index + 1 }}周
          </template>
        </el-table-column>
        <el-table-column label="门票" min-width="220">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.prop_id"
              placeholder="请选择门票"
              size="mini"
              style="width: 200px;"
              @change="onPropRewardChange(scope.row)"
            >
              <el-option
                v-for="item in matchPropRewardOptions"
                :key="item.propsId"
                :label="item.propsShowName"
                :value="item.propsId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="有效时间" min-width="420">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.valid_time_range_ui"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions"
              size="mini"
              style="width: 380px;"
              align="right"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removePropCfg(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button style="margin: 10px 0; font-weight: bold;" type="normal" size="medium" @click="addPointCfg()">添加门票点数配置</el-button>
      <el-table
        :data="editForm.day_rank_cfg.add_point_cfg"
        border
        size="mini"
        style="width: 100%;"
      >
        <el-table-column label="场次" min-width="220">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.unique_id"
              placeholder="请选择场次"
              size="mini"
              style="width: 200px;"
            >
              <el-option
                v-for="item in matchUniqueIdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="系数" width="200">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.ratio"
              size="mini"
              style="width: 140px;"
              placeholder="请输入"
            >
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removePointCfg(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>


    <fieldset style="margin:20px 0; max-width: 980px;">
      <legend>胜点榜(周榜)</legend>
      <el-row>
        <el-col :span="11">
          <el-form-item label="结算时间:" :required="true">
            <el-select
              v-model="editForm.week_rank_cfg.settle_weekday"
              placeholder="每周几"
              size="mini"
              style="width: 100px;"
            >
              <el-option
                v-for="item in WEEKDAY_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-time-picker
              v-model="weekRankSettleTimeStr"
              style="width: 160px; margin-left: 8px;"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              placeholder="时分秒"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <span style="color:red; margin-left:10px">线上填周一 [00:00:40]</span>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="显示最大排名:" :required="true" prop="week_rank_cfg.max_rank">
            <el-input v-model.number="editForm.week_rank_cfg.max_rank" style="width: 180px;" placeholder="请输入" />
          </el-form-item>
        </el-col>

      <el-col :span="11">
        <el-form-item label="周榜的全局ID:" :required="true">
        <el-select
          v-model="editForm.week_rank_cfg.fit_unique_id"
          placeholder="请选择"
          multiple
          style="width: 220px;">
          <el-option
            v-for="item in matchUniqueIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      </el-col>
      </el-row>
        <el-row>
        <el-col :span="11">
          <el-form-item label="导出最大排名:" :required="true" prop="week_rank_cfg.reward_max_rank">
            <el-input v-model.number="editForm.week_rank_cfg.reward_max_rank" style="width: 180px;" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="有效时间:" :required="true">
        <el-date-picker
          v-model="weekRankValidTimeRangeUi"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
          size="mini"
          style="width: 380px;"
          align="right"
        />
      </el-form-item>
    </fieldset>
      </el-tab-pane>

      <el-tab-pane label="名单配置" name="promote">
    <fieldset style="margin:20px 0; max-width: 980px;">
      <legend>周赛晋级名单弹框</legend>
      <el-form-item label="起止时间:" :required="true">
        <el-date-picker
          v-model="weekPromoteTimeRangeUi"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
          size="mini"
          style="width: 380px;"
          align="right"
        />
      </el-form-item>
      <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addPromoteItem()">添加名单</el-button>
      <el-table
        :data="weekPromoteList"
        border
        size="mini"
        style="width: 100%;"
      >
        <el-table-column label="名次" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.rank }}
          </template>
        </el-table-column>
        <el-table-column label="玩家ID" min-width="200">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.uid"
              size="mini"
              style="width: 180px;"
              placeholder="请输入玩家ID"
            />
          </template>
        </el-table-column>
        <el-table-column label="VP数量" min-width="200">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.vpnum"
              size="mini"
              style="width: 180px;"
              placeholder="请输入VP数量"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removePromoteItem(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>

        <fieldset style="margin:20px 0; max-width: 980px;">
          <legend>S5页签第二页晋级名单配置(30人)</legend>
          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addAllPromoteItem()">添加名单</el-button>
          <el-table
            :data="allPromoteList"
            border
            size="mini"
            style="width: 100%;"
          >
            <el-table-column label="位置ID" min-width="200">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.seat_id"
                  placeholder="请选择座位"
                  size="mini"
                  style="width: 180px;"
                >
                  <el-option
                    v-for="item in seatIdOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="isSeatIdUsed(item.value, scope.$index)"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="玩家ID" min-width="200">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.uid"
                  size="mini"
                  style="width: 180px;"
                  placeholder="请输入玩家ID"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeAllPromoteItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <fieldset style="margin:20px 0; max-width: 980px;">
          <legend>Top6联系信息配置</legend>

          <el-form-item label="起止时间:" :required="true">
        <el-date-picker
          v-model="top6ContactTimeRangeUi"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
          size="mini"
          style="width: 380px;"
          align="right"
        />
      </el-form-item>

          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addTop6ContactItem()">添加名单</el-button>
          <el-table
            :data="top6ContactList"
            border
            size="mini"
            style="width: 100%;"
          >
            <el-table-column label="玩家名称" min-width="200">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.nick"
                  size="mini"
                  style="width: 180px;"
                  placeholder="请输入玩家名称"
                />
              </template>
            </el-table-column>
            <el-table-column label="玩家ID" min-width="200">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.uid"
                  size="mini"
                  style="width: 180px;"
                  placeholder="请输入玩家ID"
                />
              </template>
            </el-table-column>
            <el-table-column label="玩家分类" min-width="200">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.u_type"
                  placeholder="请选择"
                  size="mini"
                  style="width: 180px;"
                >
                  <el-option
                    v-for="item in S5_PLAYER_TYPE"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeTop6ContactItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>

        <fieldset style="margin:20px 0; max-width: 980px;">
          <legend>晋级决赛名单(9人)</legend>
          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addFinalPromoteItem()">添加名单</el-button>
          <el-table
            :data="finalPromoteList"
            border
            size="mini"
            style="width: 100%;"
          >
            <el-table-column label="玩家名称" min-width="200">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.nick"
                  size="mini"
                  style="width: 180px;"
                  placeholder="请输入玩家名称"
                />
              </template>
            </el-table-column>
            <el-table-column label="玩家ID" min-width="200">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.uid"
                  size="mini"
                  style="width: 180px;"
                  placeholder="请输入玩家ID"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeFinalPromoteItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-tab-pane>
    </el-tabs>

    <el-col style="margin-top: 15px;">
      <el-button type="primary" @click="save">保存配置</el-button>
    </el-col>
  </el-form>
  </div>
</template>


<script>
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'
  import {
    APPID_OPTIONS,
    MATCH_UNIQUE_ID_CFG,
    CHANNEL_OPTIONS,
    PROP_TYPE_OPTIONS,
  } from "@/utils/options";
  import {$libDate, $libShow} from "@/utils/common";
  import {IsProd} from "@/utils/env";
  import {
    GetMatchTicketRightsIdList,
  } from "@/utils/prop";
  import {GetPropConfigListFromCache} from "@/utils/propV2";

  export default {
    name: 'MatchS5Config',
    components: { Compare, Publish },
    data() {
      return {
        baseForm: {},
        editForm: {
            "day_rank_cfg":{
              "settle_time": 0,
              "start_time": 0,
              "end_time": 0,
              "reward_max_rank": 100,
              "max_rank": 999,
              "prop_reward":[], //{"prop_id": 0,"scene_id": 0,"valid_start_time"，"valid_end_time": 0}
              "add_point_cfg":[],
            },  //日榜配置
            "week_rank_cfg":{
              "settle_weekday": 1,
              "settle_time": 0,
              "start_time": 0,
              "end_time": 0,
              "reward_max_rank": 6,
              "max_rank": 999,
              "fit_unique_id": [],  //符合周榜的场次
            }, //周榜配置

          "time_list":[], //时间轴
          "week_promote_config": {
            "start_time": 0,
            "end_time":0,
            "promote_list":[],
          },//周赛晋级名单
          "all_promote_list": [],//所有晋级名单
          "top6_contact_start_time": 0,
          "top6_contact_end_time": 0,
          "top6_contact_info": [],//Top6联系信息
          "final_promote_list": [], //晋级决赛名单
          "site_id_list":[], //站点白名单
          "app_id_list": [], //AppId白名单
        },
        dayRankSettleTimeStr: '00:00:00',
        weekRankSettleTimeStr: '00:00:00',
        dayRankValidTimeRangeUi: [],
        weekRankValidTimeRangeUi: [],
        weekPromoteTimeRangeUi: [],
        top6ContactTimeRangeUi: [],
        activeTab: 'base',
        pickerOptions: $libShow.DefaultDatePickerOptions(),
        subKey: 'match_s5_config',
        AttrNames:{},
        matchPropsCfgs: [],//道具
        propsTypeList: [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW],
        WEEKDAY_OPTIONS: [
          { value: 0, label: '周日' },
          { value: 1, label: '周一' },
          { value: 2, label: '周二' },
          { value: 3, label: '周三' },
          { value: 4, label: '周四' },
          { value: 5, label: '周五' },
          { value: 6, label: '周六' },
        ],
        MATCH_UNIQUE_ID_CFG,
        TICKET_DAY_TYPE_OPTIONS:[
          { 'value': 1, 'label': '1天', disabled: false },
          { 'value': 2, 'label': '2天', disabled: false },
          { 'value': 3, 'label': '3天', disabled: false },
          { 'value': 4, 'label': '4天', disabled: false },
          { 'value': 5, 'label': '5天', disabled: false },
          { 'value': 7, 'label': '7天', disabled: false },
          { 'value': 30, 'label': '30天', disabled: false },
        ],
        S5_FUNC_TIME_OPTIONS:[
          { value: 1, label: '活动起止时间', disabled: false },
          { value: 2, label: '日赛起止时间', disabled: false },
          { value: 3, label: '半决赛起止时间', disabled: false },
        ],
        S5_PLAYER_TYPE:[
          { value: 1, label: 'TOP6',disabled: false },
          { value: 2, label: '候补',disabled: false },
        ],
        PROP_REWARD_WEEK_COUNT: 5,
        CHANNEL_OPTIONS,
        APPID_OPTIONS,
      }
    },
    computed: {
      matchUniqueIdOptions() {
        return this.MATCH_UNIQUE_ID_CFG.filter(item => item.value !== 0)
      },
      weekPromoteList() {
        const cfg = this.editForm.week_promote_config
        return cfg && Array.isArray(cfg.promote_list) ? cfg.promote_list : []
      },
      allPromoteList() {
        return Array.isArray(this.editForm.all_promote_list) ? this.editForm.all_promote_list : []
      },
      seatIdOptions() {
        return Array.from({ length: 30 }, (_, i) => ({
          value: i + 1,
          label: `座位${i + 1}`,
        }))
      },
      top6ContactList() {
        return Array.isArray(this.editForm.top6_contact_info) ? this.editForm.top6_contact_info : []
      },
      finalPromoteList() {
        return Array.isArray(this.editForm.final_promote_list) ? this.editForm.final_promote_list : []
      },
      matchPropRewardOptions() {
        return this.matchPropsCfgs.filter(item => item.propsId > 0)
      },
    },
    created() {
      this.normalizeAppSiteList()
      this.normalizeWeekPromoteConfig()
      this.normalizeAllPromoteList()
      this.normalizeTop6ContactInfo()
      this.normalizeFinalPromoteList()
      this.getData()
      this.getMatchProps()
    },
    methods: {
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },

      addPromoteItem() {
        if (!this.editForm.week_promote_config) {
          this.$set(this.editForm, 'week_promote_config', {
            start_time: 0,
            end_time: 0,
            promote_list: [],
          })
        }
        if (!Array.isArray(this.editForm.week_promote_config.promote_list)) {
          this.$set(this.editForm.week_promote_config, 'promote_list', [])
        }
        const list = this.editForm.week_promote_config.promote_list
        list.push({
          rank: list.length + 1,
          uid: undefined,
          vpnum: undefined,
        })
      },

      removePromoteItem(index) {
        const list = this.editForm.week_promote_config.promote_list
        list.splice(index, 1)
        list.forEach((item, i) => {
          this.$set(item, 'rank', i + 1)
        })
      },

      normalizeAllPromoteList() {
        if (!Array.isArray(this.editForm.all_promote_list)) {
          this.$set(this.editForm, 'all_promote_list', [])
          return
        }
        this.editForm.all_promote_list.forEach(item => {
          if ((item.uid === undefined || item.uid === null) && item.id !== undefined) {
            this.$set(item, 'uid', item.id)
          }
        })
      },

      isSeatIdUsed(seatId, currentIndex) {
        return this.allPromoteList.some((item, index) => index !== currentIndex && item.seat_id === seatId)
      },

      addAllPromoteItem() {
        this.normalizeAllPromoteList()
        const list = this.editForm.all_promote_list
        if (list.length >= 30) {
          this.$message.warning('最多添加30条晋级名单')
          return
        }
        const usedSeats = new Set(list.map(item => item.seat_id))
        let nextSeatId = undefined
        for (let i = 1; i <= 30; i++) {
          if (!usedSeats.has(i)) {
            nextSeatId = i
            break
          }
        }
        list.push({
          seat_id: nextSeatId,
          uid: undefined,
        })
      },

      removeAllPromoteItem(index) {
        this.editForm.all_promote_list.splice(index, 1)
      },

      normalizeAppSiteList() {
        if (!Array.isArray(this.editForm.app_id_list)) {
          this.$set(this.editForm, 'app_id_list', [])
        } else {
          this.$set(this.editForm, 'app_id_list', this.editForm.app_id_list
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0))
        }
        if (!Array.isArray(this.editForm.site_id_list)) {
          this.$set(this.editForm, 'site_id_list', [])
        } else {
          this.$set(this.editForm, 'site_id_list', this.editForm.site_id_list.filter(id => !!id))
        }
      },

      normalizeTop6ContactInfo() {
        if (!Array.isArray(this.editForm.top6_contact_info)) {
          this.$set(this.editForm, 'top6_contact_info', [])
        }
        this.editForm.top6_contact_start_time = Number(this.editForm.top6_contact_start_time) || 0
        this.editForm.top6_contact_end_time = Number(this.editForm.top6_contact_end_time) || 0
        const startMs = this.editForm.top6_contact_start_time > 0
          ? this.editForm.top6_contact_start_time * 1000 : null
        const endMs = this.editForm.top6_contact_end_time > 0
          ? this.editForm.top6_contact_end_time * 1000 : null
        this.top6ContactTimeRangeUi = startMs && endMs ? [startMs, endMs] : []
      },

      addTop6ContactItem() {
        this.normalizeTop6ContactInfo()
        this.editForm.top6_contact_info.push({
          nick: '',
          uid: undefined,
          u_type: 1,
        })
      },

      removeTop6ContactItem(index) {
        this.editForm.top6_contact_info.splice(index, 1)
      },

      normalizeFinalPromoteList() {
        if (!Array.isArray(this.editForm.final_promote_list)) {
          this.$set(this.editForm, 'final_promote_list', [])
        }
      },

      addFinalPromoteItem() {
        this.normalizeFinalPromoteList()
        this.editForm.final_promote_list.push({
          nick: '',
          uid: undefined,
        })
      },

      removeFinalPromoteItem(index) {
        this.editForm.final_promote_list.splice(index, 1)
      },

      getData() {
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: this.subKey
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.baseForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const cfg = JSON.parse(response.Data.Data)
              Object.assign(this.editForm, cfg)
              this.normalizeRankCfg()
            }
            this.normalizeTimeList()
            this.normalizeAppSiteList()
            this.normalizeWeekPromoteConfig()
            this.normalizeAllPromoteList()
            this.normalizeTop6ContactInfo()
            this.normalizeFinalPromoteList()
            this.baseForm = response.Data
          }
        })
      },





      secondsToTimeStr(seconds) {
        const total = Math.max(0, Number(seconds) || 0)
        const hour = Math.floor(total / 3600)
        const minute = Math.floor((total % 3600) / 60)
        const second = total % 60
        const pad = n => String(n).padStart(2, '0')
        return `${pad(hour)}:${pad(minute)}:${pad(second)}`
      },

      timeStrToSeconds(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') {
          return 0
        }
        const parts = timeStr.split(':').map(v => Number(v) || 0)
        const hour = parts[0] || 0
        const minute = parts[1] || 0
        const second = parts[2] || 0
        return hour * 3600 + minute * 60 + second
      },

      normalizeSettleTime(cfg) {
        if (typeof cfg.settle_time === 'string') {
          this.$set(cfg, 'settle_time', this.timeStrToSeconds(cfg.settle_time))
        } else if (typeof cfg.settle_time !== 'number' || cfg.settle_time < 0) {
          this.$set(cfg, 'settle_time', 0)
        }
      },

      normalizeRankIntField(cfg, field) {
        const value = Number(cfg[field])
        this.$set(cfg, field, Number.isFinite(value) ? value : 0)
      },

      normalizeRankCfg() {
        const dayCfg = this.editForm.day_rank_cfg || {}
        this.normalizeSettleTime(dayCfg)
        this.normalizeRankIntField(dayCfg, 'reward_max_rank')
        this.normalizeRankIntField(dayCfg, 'max_rank')
        this.dayRankSettleTimeStr = this.secondsToTimeStr(dayCfg.settle_time)
        const dayStartMs = dayCfg.start_time > 0 ? dayCfg.start_time * 1000 : null
        const dayEndMs = dayCfg.end_time > 0 ? dayCfg.end_time * 1000 : null
        this.dayRankValidTimeRangeUi = dayStartMs && dayEndMs ? [dayStartMs, dayEndMs] : []
        if (!Array.isArray(dayCfg.add_point_cfg)) {
          this.$set(dayCfg, 'add_point_cfg', [])
        }
        this.normalizePropReward(dayCfg)
        this.$set(this.editForm, 'day_rank_cfg', dayCfg)

        const weekCfg = this.editForm.week_rank_cfg || {}
        if (weekCfg.settle_weekday === undefined || weekCfg.settle_weekday === null) {
          this.$set(weekCfg, 'settle_weekday', 1)
        }
        this.normalizeSettleTime(weekCfg)
        this.normalizeRankIntField(weekCfg, 'reward_max_rank')
        this.normalizeRankIntField(weekCfg, 'max_rank')
        this.weekRankSettleTimeStr = this.secondsToTimeStr(weekCfg.settle_time)
        const weekStartMs = weekCfg.start_time > 0 ? weekCfg.start_time * 1000 : null
        const weekEndMs = weekCfg.end_time > 0 ? weekCfg.end_time * 1000 : null
        this.weekRankValidTimeRangeUi = weekStartMs && weekEndMs ? [weekStartMs, weekEndMs] : []
        this.$set(this.editForm, 'week_rank_cfg', weekCfg)
      },

      normalizePropReward(dayCfg) {
        if (!Array.isArray(dayCfg.prop_reward)) {
          if (dayCfg.prop_reward && typeof dayCfg.prop_reward === 'object' && dayCfg.prop_reward.prop_id) {
            this.$set(dayCfg, 'prop_reward', [dayCfg.prop_reward])
          } else {
            this.$set(dayCfg, 'prop_reward', [])
          }
        }
        dayCfg.prop_reward.forEach(item => {
          item.prop_id = Number(item.prop_id) || 0
          item.scene_id = Number(item.scene_id) || 0
          item.valid_start_time = Number(item.valid_start_time) || 0
          item.valid_end_time = Number(item.valid_end_time) || 0
          const startMs = item.valid_start_time > 0 ? item.valid_start_time * 1000 : null
          const endMs = item.valid_end_time > 0 ? item.valid_end_time * 1000 : null
          this.$set(item, 'valid_time_range_ui', startMs && endMs ? [startMs, endMs] : [])
          if (item.prop_id > 0) {
            const propCfg = this.matchPropsCfgs.find(p => p.propsId === item.prop_id)
            if (propCfg && propCfg.propsSceneId > 0) {
              item.scene_id = propCfg.propsSceneId
            }
          }
        })
      },

      getPropRewardSceneId(propId) {
        const propCfg = this.matchPropsCfgs.find(item => item.propsId === propId)
        return propCfg ? Number(propCfg.propsSceneId) || 0 : 0
      },

      getTimeTypeLabel(type) {
        const item = this.S5_FUNC_TIME_OPTIONS.find(opt => opt.value === type)
        return item ? item.label : `类型${type}`
      },

      isTimeTypeUsed(type, currentIndex) {
        return this.editForm.time_list.some((item, index) => index !== currentIndex && item.type === type)
      },

      normalizeTimeList() {
        if (!Array.isArray(this.editForm.time_list)) {
          this.$set(this.editForm, 'time_list', [])
        }
        if (this.editForm.time_list.length === 0) {
          this.S5_FUNC_TIME_OPTIONS.forEach(opt => {
            this.editForm.time_list.push({
              type: opt.value,
              start_time: 0,
              end_time: 0,
            })
          })
        }
        this.editForm.time_list.forEach(item => {
          const startMs = item.start_time > 0 ? item.start_time * 1000 : null
          const endMs = item.end_time > 0 ? item.end_time * 1000 : null
          this.$set(item, 'time_range_ui', startMs && endMs ? [startMs, endMs] : [])
        })
        this.editForm.time_list.sort((a, b) => a.type - b.type)
      },

      buildTimeListPayload() {
        return (this.editForm.time_list || []).map(item => ({
          type: item.type,
          start_time: item.time_range_ui && item.time_range_ui[0] ? Math.floor(item.time_range_ui[0] / 1000) : 0,
          end_time: item.time_range_ui && item.time_range_ui[1] ? Math.floor(item.time_range_ui[1] / 1000) : 0,
        }))
      },

      buildPropRewardPayload() {
        return (this.editForm.day_rank_cfg.prop_reward || []).map(item => ({
          prop_id: Number(item.prop_id) || 0,
          scene_id: this.getPropRewardSceneId(item.prop_id) || Number(item.scene_id) || 0,
          valid_start_time: item.valid_time_range_ui && item.valid_time_range_ui[0]
            ? Math.floor(item.valid_time_range_ui[0] / 1000) : 0,
          valid_end_time: item.valid_time_range_ui && item.valid_time_range_ui[1]
            ? Math.floor(item.valid_time_range_ui[1] / 1000) : 0,
        }))
      },

      normalizeWeekPromoteConfig() {
        const cfg = this.editForm.week_promote_config || {}
        if (!Array.isArray(cfg.promote_list)) {
          this.$set(cfg, 'promote_list', [])
        }
        cfg.promote_list.forEach((item, index) => {
          if (!item.rank) {
            this.$set(item, 'rank', index + 1)
          }
        })
        const startMs = cfg.start_time > 0 ? cfg.start_time * 1000 : null
        const endMs = cfg.end_time > 0 ? cfg.end_time * 1000 : null
        this.weekPromoteTimeRangeUi = startMs && endMs ? [startMs, endMs] : []
        this.$set(this.editForm, 'week_promote_config', cfg)
      },

      buildWeekPromotePayload() {
        const cfg = this.editForm.week_promote_config || {}
        return {
          start_time: this.weekPromoteTimeRangeUi && this.weekPromoteTimeRangeUi[0]
            ? Math.floor(this.weekPromoteTimeRangeUi[0] / 1000) : 0,
          end_time: this.weekPromoteTimeRangeUi && this.weekPromoteTimeRangeUi[1]
            ? Math.floor(this.weekPromoteTimeRangeUi[1] / 1000) : 0,
          promote_list: (cfg.promote_list || []).map(item => ({
            rank: item.rank,
            uid: Number(item.uid) || 0,
            vpnum: Number(item.vpnum) || 0,
          })),
        }
      },

      saveCheck() {
        if (!Array.isArray(this.editForm.site_id_list) || this.editForm.site_id_list.length === 0) {
          this.$message.error('请选择站点')
          return false
        }
        const timeList = this.editForm.time_list || []
        const timeTypeSet = new Set()
        for (let i = 0; i < timeList.length; i++) {
          const item = timeList[i]
          if (!item.type) {
            this.$message.error(`请选择第${i + 1}行时间类型`)
            return false
          }
          if (timeTypeSet.has(item.type)) {
            this.$message.error('时间类型不能重复')
            return false
          }
          timeTypeSet.add(item.type)
          if (!Array.isArray(item.time_range_ui) || item.time_range_ui.length !== 2 || !item.time_range_ui[0] || !item.time_range_ui[1]) {
            this.$message.error(`请完善${this.getTimeTypeLabel(item.type)}的起止时间`)
            return false
          }
          if (item.time_range_ui[1] <= item.time_range_ui[0]) {
            this.$message.error(`${this.getTimeTypeLabel(item.type)}结束时间必须大于开始时间`)
            return false
          }
        }
        if (!this.dayRankSettleTimeStr) {
          this.$message.error('请选择日榜结算时分秒')
          return false
        }
        if(this.dayRankSettleTimeStr === "00:00:00"){
          this.$message.error('不能选择00:00:00')
          return false
        }
        if (!Array.isArray(this.dayRankValidTimeRangeUi) || this.dayRankValidTimeRangeUi.length !== 2
          || !this.dayRankValidTimeRangeUi[0] || !this.dayRankValidTimeRangeUi[1]) {
          this.$message.error('请完善日榜有效时间')
          return false
        }
        if (this.dayRankValidTimeRangeUi[1] <= this.dayRankValidTimeRangeUi[0]) {
          this.$message.error('日榜有效时间结束时间必须大于开始时间')
          return false
        }
        //日榜有效结束时间 HH:MM:SS 必须为 00:00:00
        const dayRankEndTime = new Date(this.dayRankValidTimeRangeUi[1])
        if (dayRankEndTime.getHours() !== 0 || dayRankEndTime.getMinutes() !== 0 || dayRankEndTime.getSeconds() !== 0) {
          this.$message.error('日榜有效结束时间必须是 00:00:00')
          return false
        }
        const dayCfg = this.editForm.day_rank_cfg ||{}
        if (dayCfg.max_rank <= 0) {
          this.$message.error('请输入日榜显示最大排名')
          return false
        }
        if (dayCfg.reward_max_rank <=0){
          this.$message.error('请输入日榜奖励最大排名')
          return false
        }
        if (dayCfg.reward_max_rank !==100){
          this.$message.error('日榜奖励最大排名必须为100')
          return false
        }

        const propRewardCfg = dayCfg.prop_reward || []
        if (propRewardCfg.length < this.PROP_REWARD_WEEK_COUNT) {
          this.$message.error(`请配置${this.PROP_REWARD_WEEK_COUNT}周门票奖励`)
          return false
        }
        if (propRewardCfg.length > this.PROP_REWARD_WEEK_COUNT) {
          this.$message.error(`门票奖励配置不能超过${this.PROP_REWARD_WEEK_COUNT}周`)
          return false
        }
        const propIdSet = new Set()
        for (let i = 0; i < propRewardCfg.length; i++) {
          const item = propRewardCfg[i]
          if (!item.prop_id || item.prop_id <= 0) {
            this.$message.error(`请选择第${i + 1}周门票奖励`)
            return false
          }
          if (propIdSet.has(item.prop_id)) {
            this.$message.error('门票奖励不能重复')
            return false
          }
          propIdSet.add(item.prop_id)
          if (!Array.isArray(item.valid_time_range_ui) || item.valid_time_range_ui.length !== 2
            || !item.valid_time_range_ui[0] || !item.valid_time_range_ui[1]) {
            this.$message.error(`请完善第${i + 1}周门票有效时间`)
            return false
          }
          if (item.valid_time_range_ui[1] <= item.valid_time_range_ui[0]) {
            this.$message.error(`第${i + 1}周门票有效时间结束时间必须大于开始时间`)
            return false
          }
          const sceneId = this.getPropRewardSceneId(item.prop_id) || Number(item.scene_id) || 0
          if (sceneId <= 0) {
            this.$message.error(`第${i + 1}周门票找不到权益场景值`)
            return false
          }
        }

        const addPointCfg = dayCfg.add_point_cfg || []
        const uniqueIdSet = new Set()
        for (let i = 0; i < addPointCfg.length; i++) {
          const item = addPointCfg[i]
          if (!item.unique_id) {
            this.$message.error(`请选择第${i + 1}行门票点系数场次`)
            return false
          }
          if (!item.ratio || item.ratio <= 0) {
            this.$message.error(`请输入第${i + 1}行门票点系数`)
            return false
          }
          if (uniqueIdSet.has(item.unique_id)) {
            this.$message.error('门票点系数场次不能重复')
            return false
          }
          uniqueIdSet.add(item.unique_id)
        }
        const weekCfg = this.editForm.week_rank_cfg || {}
        if (weekCfg.settle_weekday === undefined || weekCfg.settle_weekday === null) {
          this.$message.error('请选择周榜结算星期')
          return false
        }
        if (!this.weekRankSettleTimeStr) {
          this.$message.error('请选择周榜结算时分秒')
          return false
        }
        if(this.weekRankSettleTimeStr === "00:00:00"){
          this.$message.error('不能选择00:00:00')
          return false
        }
        if (weekCfg.max_rank <= 0) {
          this.$message.error('请输入周榜显示最大排名')
          return false
        }
        if (weekCfg.reward_max_rank <= 0) {
          this.$message.error('请输入导出最大排名')
          return false
        }
        if (weekCfg.reward_max_rank >100){
          this.$message.error('导出最大排名不能超过100')
          return false
        }
        if (!Array.isArray(weekCfg.fit_unique_id) || weekCfg.fit_unique_id.length === 0) {
          this.$message.error('请选择进周榜的场次')
          return false
        }
        if (!Array.isArray(this.weekRankValidTimeRangeUi) || this.weekRankValidTimeRangeUi.length !== 2
          || !this.weekRankValidTimeRangeUi[0] || !this.weekRankValidTimeRangeUi[1]) {
          this.$message.error('请完善周榜有效时间')
          return false
        }
        if (this.weekRankValidTimeRangeUi[1] <= this.weekRankValidTimeRangeUi[0]) {
          this.$message.error('周榜有效时间结束时间必须大于开始时间')
          return false
        }
        //周榜有效结束时间 HH:MM:SS 必须为 00:00:00
        const weekRankEndTime = new Date(this.weekRankValidTimeRangeUi[1])
        if (weekRankEndTime.getHours() !== 0 || weekRankEndTime.getMinutes() !== 0 || weekRankEndTime.getSeconds() !== 0) {
          this.$message.error('周榜有效结束时间必须是 00:00:00')
          return false
        }
        // if (!Array.isArray(this.weekPromoteTimeRangeUi) || this.weekPromoteTimeRangeUi.length !== 2
        //   || !this.weekPromoteTimeRangeUi[0] || !this.weekPromoteTimeRangeUi[1]) {
        //   this.$message.error('请完善周赛晋级名单弹框起止时间')
        //   return false
        // }
        // if (this.weekPromoteTimeRangeUi[1] <= this.weekPromoteTimeRangeUi[0]) {
        //   this.$message.error('周赛晋级名单弹框结束时间必须大于开始时间')
        //   return false
        // }
        const promoteList = (this.editForm.week_promote_config && this.editForm.week_promote_config.promote_list) || []
        const rankSet = new Set()
        for (let i = 0; i < promoteList.length; i++) {
          const item = promoteList[i]
          if (!item.uid || item.uid <= 0) {
            this.$message.error(`请输入第${i + 1}行玩家ID`)
            return false
          }
          if (item.vpnum === undefined || item.vpnum === null || item.vpnum < 0) {
            this.$message.error(`请输入第${i + 1}行VP数量`)
            return false
          }
          if (rankSet.has(item.rank)) {
            this.$message.error('周赛晋级名单名次不能重复')
            return false
          }
          rankSet.add(item.rank)
        }
        const allPromoteList = this.allPromoteList
        const seatIdSet = new Set()
        const playerIdSet = new Set()
        for (let i = 0; i < allPromoteList.length; i++) {
          const item = allPromoteList[i]
          if (!item.seat_id || item.seat_id < 1 || item.seat_id > 30) {
            this.$message.error(`请选择第${i + 1}行位置ID（范围1-30）`)
            return false
          }
          if (!item.uid || item.uid <= 0) {
            this.$message.error(`请输入第${i + 1}行玩家ID`)
            return false
          }
          if (seatIdSet.has(item.seat_id)) {
            this.$message.error('位置ID不能重复')
            return false
          }
          if (playerIdSet.has(item.uid)) {
            this.$message.error('玩家ID不能重复')
            return false
          }
          seatIdSet.add(item.seat_id)
          playerIdSet.add(item.uid)
        }
        const top6ContactList = this.top6ContactList
        // if (!Array.isArray(this.top6ContactTimeRangeUi) || this.top6ContactTimeRangeUi.length !== 2
        //   || !this.top6ContactTimeRangeUi[0] || !this.top6ContactTimeRangeUi[1]) {
        //   this.$message.error('请完善Top6联系信息起止时间')
        //   return false
        // }
        if (this.top6ContactTimeRangeUi[1] <= this.top6ContactTimeRangeUi[0]) {
          this.$message.error('Top6联系信息结束时间必须大于开始时间')
          return false
        }
        const top6UidSet = new Set()
        for (let i = 0; i < top6ContactList.length; i++) {
          const item = top6ContactList[i]
          if (!item.uid || item.uid <= 0) {
            this.$message.error(`请输入Top6联系信息第${i + 1}行玩家ID`)
            return false
          }
          if (top6UidSet.has(item.uid)) {
            this.$message.error('Top6联系信息玩家ID不能重复')
            return false
          }
          if (!item.u_type) {
            this.$message.error(`请选择Top6联系信息第${i + 1}行玩家分类`)
            return false
          }
          top6UidSet.add(item.uid)
        }
        const finalPromoteList = this.finalPromoteList
        const finalUidSet = new Set()
        for (let i = 0; i < finalPromoteList.length; i++) {
          const item = finalPromoteList[i]
          if (!item.uid || item.uid <= 0) {
            this.$message.error(`请输入晋级决赛名单第${i + 1}行玩家ID`)
            return false
          }
          if (finalUidSet.has(item.uid)) {
            this.$message.error('晋级决赛名单玩家ID不能重复')
            return false
          }
          finalUidSet.add(item.uid)
        }
        return true
      },

      save() {
        if (!this.saveCheck()) {
          return
        }

        const payload = { ...this.editForm }
        payload.day_rank_cfg = {
          ...payload.day_rank_cfg,
          settle_time: this.timeStrToSeconds(this.dayRankSettleTimeStr),
          start_time: this.dayRankValidTimeRangeUi && this.dayRankValidTimeRangeUi[0]
            ? Math.floor(this.dayRankValidTimeRangeUi[0] / 1000) : 0,
          end_time: this.dayRankValidTimeRangeUi && this.dayRankValidTimeRangeUi[1]
            ? Math.floor(this.dayRankValidTimeRangeUi[1] / 1000) : 0,
          reward_max_rank: Number(payload.day_rank_cfg.reward_max_rank) || 0,
          max_rank: Number(payload.day_rank_cfg.max_rank) || 0,
          prop_reward: this.buildPropRewardPayload(),
        }
        payload.week_rank_cfg = {
          ...payload.week_rank_cfg,
          settle_time: this.timeStrToSeconds(this.weekRankSettleTimeStr),
          start_time: this.weekRankValidTimeRangeUi && this.weekRankValidTimeRangeUi[0]
            ? Math.floor(this.weekRankValidTimeRangeUi[0] / 1000) : 0,
          end_time: this.weekRankValidTimeRangeUi && this.weekRankValidTimeRangeUi[1]
            ? Math.floor(this.weekRankValidTimeRangeUi[1] / 1000) : 0,
          reward_max_rank: Number(payload.week_rank_cfg.reward_max_rank) || 0,
          max_rank: Number(payload.week_rank_cfg.max_rank) || 0,
        }
        payload.time_list = this.buildTimeListPayload()
        payload.week_promote_config = this.buildWeekPromotePayload()
        payload.all_promote_list = this.allPromoteList.map(item => ({
          seat_id: Number(item.seat_id),
          uid: Number(item.uid),
        }))
        payload.top6_contact_start_time = this.top6ContactTimeRangeUi && this.top6ContactTimeRangeUi[0]
          ? Math.floor(this.top6ContactTimeRangeUi[0] / 1000) : 0
        payload.top6_contact_end_time = this.top6ContactTimeRangeUi && this.top6ContactTimeRangeUi[1]
          ? Math.floor(this.top6ContactTimeRangeUi[1] / 1000) : 0
        payload.top6_contact_info = this.top6ContactList.map(item => ({
          nick: item.nick || '',
          uid: Number(item.uid),
          u_type: Number(item.u_type),
        }))
        payload.final_promote_list = this.finalPromoteList.map(item => ({
          nick: item.nick || '',
          uid: Number(item.uid),
        }))
        payload.app_id_list = (this.editForm.app_id_list || [])
          .map(id => Number(id))
          .filter(id => Number.isFinite(id) && id > 0)
        payload.site_id_list = [...(this.editForm.site_id_list || [])]

        this.baseForm = this.baseForm || {}
        this.baseForm.Data = JSON.stringify(payload)
        //保存配置
        request({
          url: '/customizeconfig/update',
          method: 'post',
          data: this.baseForm,
        }).then(response => {
          console.log("response",response)
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
            this.getData()
          } else {
            this.$message.error('保存失败: ' + response.Data)
          }
        })
      },
      async getMatchProps() {
        // 缓存接口已过滤 status=1 及可用道具，这里只组装本页需要的头像框 / 新版门票
        this.matchPropsCfgs = [{
          propsId: 0,
          propsType: 0,
          propsName: '无',
          propsIcon: '',
          propsAttr: '',
          propsCost: '',
          propsShowName: '',
          propsSceneId: 0,
          propsAppId: 0
        }]

        try {
          const { itemList } = await GetPropConfigListFromCache()
          const list = itemList || []
          for (const item of list) {
            const isNewTicket = item.item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW
            if (!isNewTicket) {
              continue
            }

            let sceneId = 0
            let appId = 0
            if (isNewTicket) {
              let extra = null
              try {
                extra = item.item_extra ? JSON.parse(item.item_extra) : null
              } catch (e) {
                continue
              }
              if (!extra || !extra.appId) {
                continue
              }
              const ticket = (GetMatchTicketRightsIdList(extra.appId) || []).find(
                t => Number(t.ticketId) === Number(item.id)
              )
              if (!ticket || !ticket.sceneId) {
                continue
              }
              sceneId = ticket.sceneId
              appId = extra.appId
            }

            const showName = item.show_name
              ? `${item.item_name}(${item.show_name})`
              : item.item_name
            this.matchPropsCfgs.push({
              propsType: item.item_type,
              propsId: item.id,
              propsName: item.item_name,
              propsIcon: item.image,
              propsAttr: item.item_describe,
              propsCost: item.item_cost,
              propsShowName: showName,
              propsSceneId: sceneId,
              propsAppId: appId
            })
          }
        } catch (error) {
          console.log(error)
        }finally {
          this.normalizePropReward(this.editForm.day_rank_cfg || {})
        }
      },
      addPointCfg() {
        if (!Array.isArray(this.editForm.day_rank_cfg.add_point_cfg)) {
          this.$set(this.editForm.day_rank_cfg, 'add_point_cfg', [])
        }
        this.editForm.day_rank_cfg.add_point_cfg.push({
          unique_id: undefined,
          ratio: 100,
        })
      },

      addPropCfg() {
        if (!Array.isArray(this.editForm.day_rank_cfg.prop_reward)) {
          this.$set(this.editForm.day_rank_cfg, 'prop_reward', [])
        }
        if (this.editForm.day_rank_cfg.prop_reward.length >= this.PROP_REWARD_WEEK_COUNT) {
          this.$message.warning(`门票奖励配置最多${this.PROP_REWARD_WEEK_COUNT}周`)
          return
        }
        this.editForm.day_rank_cfg.prop_reward.push({
          prop_id: undefined,
          scene_id: 0,
          valid_start_time: 0,
          valid_end_time: 0,
          valid_time_range_ui: [],
        })
      },

      removePropCfg(index) {
        this.editForm.day_rank_cfg.prop_reward.splice(index, 1)
      },

      onPropRewardChange(row) {
        this.$set(row, 'scene_id', this.getPropRewardSceneId(row.prop_id))
      },

      removePointCfg(index) {
        this.editForm.day_rank_cfg.add_point_cfg.splice(index, 1)
      },

      addTimeCfg() {
        if (!Array.isArray(this.editForm.time_list)) {
          this.$set(this.editForm, 'time_list', [])
        }
        if (this.editForm.time_list.length >= this.S5_FUNC_TIME_OPTIONS.length) {
          this.$message.warning('时间配置已全部添加')
          return
        }
        const usedTypes = new Set(this.editForm.time_list.map(item => item.type))
        const nextOption = this.S5_FUNC_TIME_OPTIONS.find(opt => !usedTypes.has(opt.value))
        this.editForm.time_list.push({
          type: nextOption ? nextOption.value : undefined,
          start_time: 0,
          end_time: 0,
          time_range_ui: [],
        })
      },

      removeTimeCfg(index) {
        this.editForm.time_list.splice(index, 1)
      },
      onSiteIdOptionsChange(value) {
        this.$set(this.editForm, 'site_id_list', Array.isArray(value) ? value : [])
      },
      onAppIdOptionsChange(value) {
        this.$set(this.editForm, 'app_id_list', Array.isArray(value) ? value : [])
      },

      //pre 新 pro 旧
      onCompare(pre, pro) {
        const preVal = JSON.parse(pre.Data)
        let proVal = {}
        try {
          proVal = pro && pro.Data ? JSON.parse(pro.Data) : {}
        } catch (e) {
          proVal = {}
        }
        if (!proVal || typeof proVal !== 'object' || Array.isArray(proVal)) {
          proVal = {}
        }
        const isFirstPublish = Object.keys(proVal).length === 0
        const isEmptyObj = (obj) => !obj || Object.keys(obj).length === 0
        const preDayRankCfg = preVal.day_rank_cfg || {}
        const proDayRankCfg = proVal.day_rank_cfg || {}
        const preWeekRankCfg = preVal.week_rank_cfg || {}
        const proWeekRankCfg = proVal.week_rank_cfg || {}

        console.log("preVale", preVal)
        console.log("proVal", proVal)
        let str = ""
        if (isFirstPublish) {
          str += "AppId: " + JSON.stringify(preVal.app_id_list || []) + "\n"
          str += "SiteId: " + JSON.stringify(preVal.site_id_list || []) + "\n"
        } else {
          if (JSON.stringify(preVal.app_id_list) !== JSON.stringify(proVal.app_id_list)) {
            str += "AppId由: " + JSON.stringify(proVal.app_id_list) + " 调整为-> " + JSON.stringify(preVal.app_id_list) + "\n"
          }
          if (JSON.stringify(preVal.site_id_list) !== JSON.stringify(proVal.site_id_list)) {
            str += "SiteId由: " + JSON.stringify(proVal.site_id_list) + " 调整为-> " + JSON.stringify(preVal.site_id_list) + "\n"
          }
        }

        //时间轴配置
        if (JSON.stringify(preVal.time_list) !== JSON.stringify(proVal.time_list)) {
          //先判断是新增还是删除
          const preTimeList = preVal.time_list || []
          const proTimeList = proVal.time_list || []
          const preTimeListSet = new Set(preTimeList.map(item => item.type))
          const proTimeListSet = new Set(proTimeList.map(item => item.type))
          const deleteTimeList = proTimeList.filter(item => !preTimeListSet.has(item.type))
          const addTimeList = preTimeList.filter(item => !proTimeListSet.has(item.type))
          if (addTimeList.length > 0) {
            for (let i = 0; i < addTimeList.length; i++) {
              str += "新增: " + this.getTimeTypeLabel(addTimeList[i].type) + " 开始时间: " + (new Date(addTimeList[i].start_time * 1000).toLocaleString()) + " 结束时间: " + (new Date(addTimeList[i].end_time * 1000).toLocaleString()) + "\n"
            }
          }

          if (deleteTimeList.length > 0) {
            for (let i = 0; i < deleteTimeList.length; i++) {
              str += "删除: " + this.getTimeTypeLabel(deleteTimeList[i].type) + " 开始时间: " + (new Date(deleteTimeList[i].start_time * 1000).toLocaleString()) + " 结束时间: " + (new Date(deleteTimeList[i].end_time * 1000).toLocaleString()) + "\n"
            }
          }
          //判断时间轴配置是否有调整,如果调整了,则需要判断开始时间和结束时间是否调整了
          for (let i = 0; i < proTimeList.length; i++) {
            const proTime = proTimeList[i]
            const preTime = preTimeList.find(item => item.type === proTime.type)
            if (preTime) {
              if (preTime.start_time !== proTime.start_time || preTime.end_time !== proTime.end_time) {
                str += this.getTimeTypeLabel(proTime.type) + " 旧配置,起止时间 :" + (new Date(proTime.start_time * 1000).toLocaleString()) + " 至 " + (new Date(proTime.end_time * 1000).toLocaleString()) + " 调整为新配置,起止时间: " + (new Date(preTime.start_time * 1000).toLocaleString()) + " 至: " + (new Date(preTime.end_time * 1000).toLocaleString()) + "\n"
              }
            }
          }
        }
        //门票点榜(日榜)
        if (JSON.stringify(preDayRankCfg) !== JSON.stringify(proDayRankCfg)) {
          if (isEmptyObj(proVal.day_rank_cfg)) {
            str += "\n新增日榜配置: \n"
            str += "结算时间: " + "每天 " + this.secondsToTimeStr(preDayRankCfg.settle_time) + "\n"
            str += "有效时间: " + (new Date(preDayRankCfg.start_time * 1000).toLocaleString()) + " 至 " + (new Date(preDayRankCfg.end_time * 1000).toLocaleString()) + "\n"
            str += "奖励最大排名: " + preDayRankCfg.reward_max_rank + "\n"
            str += "最大排名: " + preDayRankCfg.max_rank + "\n"
            const prePropReward = preDayRankCfg.prop_reward || []
            if (prePropReward.length > 0) {
              str += "\n新增门票配置: \n"
              for (let i = 0; i < prePropReward.length; i++) {
                const prop = this.matchPropsCfgs.find(p => p.propsId === prePropReward[i].prop_id)
                str += "第" + (i + 1) + "周门票,道具ID:" + prePropReward[i].prop_id + ",门票名称:" + (prop ? prop.propsName : '') + "  起止时间:" + (new Date(prePropReward[i].valid_start_time * 1000).toLocaleString()) + " 至 " + (new Date(prePropReward[i].valid_end_time * 1000).toLocaleString()) + "\n"
              }
            }
            const preAddPointCfg = preDayRankCfg.add_point_cfg || []
            if (preAddPointCfg.length > 0) {
              str += "\n新增门票点数配置: \n"
              for (let i = 0; i < preAddPointCfg.length; i++) {
                const label = this.MATCH_UNIQUE_ID_CFG.find(item => item.value === preAddPointCfg[i].unique_id)?.label
                str += "全局ID:" + label + "(" + preAddPointCfg[i].unique_id + ")" + " 比例:" + preAddPointCfg[i].ratio + "%" + "\n"
              }
            }
          } else {
            if (preDayRankCfg.settle_time !== proDayRankCfg.settle_time) {
              str += "日榜结算时间由: " + "每天 " + (this.secondsToTimeStr(proDayRankCfg.settle_time)) + " 调整为-> " + "每天" + (this.secondsToTimeStr(preDayRankCfg.settle_time)) + "\n"
            }
            if (preDayRankCfg.start_time !== proDayRankCfg.start_time) {
              str += "日榜开始时间由: " + (new Date(proDayRankCfg.start_time * 1000).toLocaleString()) + " 调整为-> " + (new Date(preDayRankCfg.start_time * 1000).toLocaleString()) + "\n"
            }
            if (preDayRankCfg.end_time !== proDayRankCfg.end_time) {
              str += "日榜结束时间由: " + (new Date(proDayRankCfg.end_time * 1000).toLocaleString()) + " 调整为-> " + (new Date(preDayRankCfg.end_time * 1000).toLocaleString()) + "\n"
            }
            if (preDayRankCfg.reward_max_rank !== proDayRankCfg.reward_max_rank) {
              str += "日榜奖励最大排名由: " + proDayRankCfg.reward_max_rank + " 调整为-> " + preDayRankCfg.reward_max_rank + "\n"
            }
            if (preDayRankCfg.max_rank !== proDayRankCfg.max_rank) {
              str += "日榜最大排名由: " + proDayRankCfg.max_rank + " 调整为-> " + preDayRankCfg.max_rank + "\n"
            }
            if (JSON.stringify(preDayRankCfg.prop_reward) !== JSON.stringify(proDayRankCfg.prop_reward)) {
              const prePropReward = preDayRankCfg.prop_reward || []
              const proPropReward = proDayRankCfg.prop_reward || []
              const prePropRewardSet = new Set(prePropReward.map(item => item.prop_id))
              const proPropRewardSet = new Set(proPropReward.map(item => item.prop_id))
              const addPropReward = prePropReward.filter(item => !proPropRewardSet.has(item.prop_id))
              if (addPropReward.length > 0 && prePropReward.length > proPropReward.length) {
                str += "新增门票配置: \n"
                for (let i = 0; i < addPropReward.length; i++) {
                  const prop = this.matchPropsCfgs.find(p => p.propsId === addPropReward[i].prop_id)
                  str += "第" + (i + 1) + "周门票,道具ID:" + addPropReward[i].prop_id + ",门票名称:" + (prop ? prop.propsName : '') + "  起止时间:" + (new Date(addPropReward[i].valid_start_time * 1000).toLocaleString()) + " 至 " + (new Date(addPropReward[i].valid_end_time * 1000).toLocaleString()) + "\n"
                }
              }
              for (let i = 0; i < proPropReward.length; i++) {
                const proProp = proPropReward[i]
                const preProp = prePropReward[i]
                if (preProp && proProp) {
                  if (preProp.valid_start_time !== proProp.valid_start_time || preProp.valid_end_time !== proProp.valid_end_time || preProp.prop_id !== proProp.prop_id) {
                    const oldPropCfg = this.matchPropsCfgs.find(p => p.propsId === proProp.prop_id)
                    const newPropCfg = this.matchPropsCfgs.find(p => p.propsId === preProp.prop_id)
                    str += "门票配置: " + "第" + (i + 1) + "周门票,道具ID:" + proProp.prop_id + ",门票名称:" + (oldPropCfg ? oldPropCfg.propsName : '') + "  起止时间:" + (new Date(proProp.valid_start_time * 1000).toLocaleString()) + " 至 " + (new Date(proProp.valid_end_time * 1000).toLocaleString()) + "\n"
                    str += "调整为:道具ID " + preProp.prop_id + ",门票名称:" + (newPropCfg ? newPropCfg.propsName : '') + "  起止时间:" + (new Date(preProp.valid_start_time * 1000).toLocaleString()) + " 至 " + (new Date(preProp.valid_end_time * 1000).toLocaleString()) + "\n"
                  }
                }
              }
            }
            if (JSON.stringify(preDayRankCfg.add_point_cfg) !== JSON.stringify(proDayRankCfg.add_point_cfg)) {
              const preAddPointCfg = preDayRankCfg.add_point_cfg || []
              const proAddPointCfg = proDayRankCfg.add_point_cfg || []
              const preAddPointCfgSet = new Set(preAddPointCfg.map(item => item.unique_id))
              const proAddPointCfgSet = new Set(proAddPointCfg.map(item => item.unique_id))
              const deleteAddPointCfg = proAddPointCfg.filter(item => !preAddPointCfgSet.has(item.unique_id))
              const addAddPointCfg = preAddPointCfg.filter(item => !proAddPointCfgSet.has(item.unique_id))
              if (addAddPointCfg.length > 0 && preAddPointCfg.length > proAddPointCfg.length) {
                str += "\n新增门票点数配置: \n"
                for (let i = 0; i < addAddPointCfg.length; i++) {
                  const label = this.MATCH_UNIQUE_ID_CFG.find(item => item.value === addAddPointCfg[i].unique_id)?.label
                  str += "全局ID:" + label + "(" + addAddPointCfg[i].unique_id + ")" + " 比例:" + addAddPointCfg[i].ratio + "%" + "\n"
                }
              }
              if (deleteAddPointCfg.length > 0 && preAddPointCfg.length < proAddPointCfg.length) {
                str += "\n删除门票点数配置: \n"
                for (let i = 0; i < deleteAddPointCfg.length; i++) {
                  const label = this.MATCH_UNIQUE_ID_CFG.find(item => item.value === deleteAddPointCfg[i].unique_id)?.label
                  str += "全局ID:" + label + "(" + deleteAddPointCfg[i].unique_id + ")" + " 比例:" + deleteAddPointCfg[i].ratio + "%" + "\n"
                }
              }
              for (let i = 0; i < proAddPointCfg.length; i++) {
                const proAddPoint = proAddPointCfg[i]
                const preAddPoint = preAddPointCfg[i]
                if (preAddPoint && proAddPoint) {
                  if (preAddPoint.unique_id !== proAddPoint.unique_id || preAddPoint.ratio !== proAddPoint.ratio) {
                    const newLabel = this.MATCH_UNIQUE_ID_CFG.find(item => item.value === preAddPoint.unique_id)?.label
                    const oldLabel = this.MATCH_UNIQUE_ID_CFG.find(item => item.value === proAddPoint.unique_id)?.label
                    str += "旧配置,全局ID: " + oldLabel + "(" + proAddPoint.unique_id + ")" + " 比例:" + proAddPoint.ratio + "%" + " 调整为-> 全局ID:" + newLabel + "(" + preAddPoint.unique_id + ")" + " 比例:" + preAddPoint.ratio + "%" + "\n"
                  }
                }
              }
            }
          }
        }
        //胜点榜(周榜)
        if (JSON.stringify(preWeekRankCfg) !== JSON.stringify(proWeekRankCfg)) {
          if (isEmptyObj(proVal.week_rank_cfg)) {
            str += "\n新增胜点榜配置: \n"
            str += "结算时间: " + this.WEEKDAY_OPTIONS.find(item => item.value === preWeekRankCfg.settle_weekday)?.label + " " + this.secondsToTimeStr(preWeekRankCfg.settle_time) + "\n"
            str += "有效时间: " + (new Date(preWeekRankCfg.start_time * 1000).toLocaleString()) + " 至 " + (new Date(preWeekRankCfg.end_time * 1000).toLocaleString()) + "\n"
            str += "导出最大排名::" + preWeekRankCfg.reward_max_rank + "\n"
            str += "最大排名: " + preWeekRankCfg.max_rank + "\n"
            str += "全局ID: " + JSON.stringify(preWeekRankCfg.fit_unique_id) + "\n"
          } else {
            if (preWeekRankCfg.settle_time !== proWeekRankCfg.settle_time || preWeekRankCfg.settle_weekday !== proWeekRankCfg.settle_weekday) {
              const oldWeekLabel = this.WEEKDAY_OPTIONS.find(item => item.value === proWeekRankCfg.settle_weekday)?.label
              const newWeekLabel = this.WEEKDAY_OPTIONS.find(item => item.value === preWeekRankCfg.settle_weekday)?.label
              str += "胜点榜,结算时间由: " + oldWeekLabel + " " + this.secondsToTimeStr(proWeekRankCfg.settle_time) + " 调整为-> " + newWeekLabel + " " + (this.secondsToTimeStr(preWeekRankCfg.settle_time)) + "\n"
            }
            if (preWeekRankCfg.start_time !== proWeekRankCfg.start_time || preWeekRankCfg.end_time !== proWeekRankCfg.end_time) {
              str += "胜点榜,有效时间由: " + (new Date(proWeekRankCfg.start_time * 1000).toLocaleString()) + " 至 " + (new Date(proWeekRankCfg.end_time * 1000).toLocaleString()) + " 调整为-> " + (new Date(preWeekRankCfg.start_time * 1000).toLocaleString()) + " 至 " + (new Date(preWeekRankCfg.end_time * 1000).toLocaleString()) + "\n"
            }
            if (preWeekRankCfg.reward_max_rank !== proWeekRankCfg.reward_max_rank) {
              str += "胜点榜,奖励最大排名由: " + proWeekRankCfg.reward_max_rank + " 调整为-> " + preWeekRankCfg.reward_max_rank + "\n"
            }
            if (preWeekRankCfg.max_rank !== proWeekRankCfg.max_rank) {
              str += "胜点榜,最大排名由: " + proWeekRankCfg.max_rank + " 调整为-> " + preWeekRankCfg.max_rank + "\n"
            }
            if (JSON.stringify(preWeekRankCfg.fit_unique_id) !== JSON.stringify(proWeekRankCfg.fit_unique_id)) {
              str += "胜点榜,周榜奖励全局ID由: " + JSON.stringify(proWeekRankCfg.fit_unique_id) + " 调整为-> " + JSON.stringify(preWeekRankCfg.fit_unique_id) + "\n"
            }
          }
        }
        //周晋级名单
        if (JSON.stringify(preVal.week_promote_config) !== JSON.stringify(proVal.week_promote_config)) {
          //是空对象 proVal.week_promote_config 是空对象
          if (isEmptyObj(proVal.week_promote_config)) {
            // if (preVal.week_promote_config.start_time > 0 && preVal.week_promote_config.end_time > 0){
              str += "\n新增周晋级名单配置: \n"
              str += "弹框起止时间: " + (new Date(preVal.week_promote_config.start_time * 1000).toLocaleString()) + " 至 " + (new Date(preVal.week_promote_config.end_time * 1000).toLocaleString()) + "\n"
              str += "名单内容: " + JSON.stringify(preVal.week_promote_config.promote_list) + "\n"
          } else {
            if (preVal.week_promote_config.start_time !== proVal.week_promote_config.start_time || preVal.week_promote_config.end_time !== proVal.week_promote_config.end_time) {
              str += "周晋级名单,弹框起止时间由: " + (new Date(proVal.week_promote_config.start_time * 1000).toLocaleString()) + " 至 " + (new Date(proVal.week_promote_config.end_time * 1000).toLocaleString()) + " 调整为 " + (new Date(preVal.week_promote_config.start_time * 1000).toLocaleString()) + " 至 " + (new Date(preVal.week_promote_config.end_time * 1000).toLocaleString()) + "\n"
            }
            if (JSON.stringify(preVal.week_promote_config.promote_list) !== JSON.stringify(proVal.week_promote_config.promote_list)) {
              str += "周晋级名单,名单内容由: " + JSON.stringify(proVal.week_promote_config.promote_list) + " 调整为  " + JSON.stringify(preVal.week_promote_config.promote_list) + "\n"
            }
          }
        }
        //所有晋级名单 top30
        if (JSON.stringify(preVal.all_promote_list) !== JSON.stringify(proVal.all_promote_list)) {
          //判断是新增还是删除
          const preAllPromoteCfg = preVal.all_promote_list || []
          const proAllPromoteCfg = proVal.all_promote_list || []
          const preAllPromoteCfgSet = new Set(preAllPromoteCfg.map(item => item.uid))
          const proAllPromoteCfgSet = new Set(proAllPromoteCfg.map(item => item.uid))
          const deleteAllPromoteCfg = proAllPromoteCfg.filter(item => !preAllPromoteCfgSet.has(item.uid))
          const addAllPromoteCfg = preAllPromoteCfg.filter(item => !proAllPromoteCfgSet.has(item.uid))
          if (addAllPromoteCfg.length > 0) {
            str += "\n新增Top30晋级名单配置: \n"
            for (let i = 0; i < addAllPromoteCfg.length; i++) {
              str += "位置:" + addAllPromoteCfg[i].seat_id + " 用户ID: " + addAllPromoteCfg[i].uid + ","
            }
            str += "\n"
          }
          if (deleteAllPromoteCfg.length > 0) {
            str += "删除Top30晋级名单配置: \n"
            for (let i = 0; i < deleteAllPromoteCfg.length; i++) {
              str += "位置:" + deleteAllPromoteCfg[i].seat_id + " 用户ID: " + deleteAllPromoteCfg[i].uid + ","
            }
            str += "\n"
          }
        }
        //晋级决赛名单 top9 final_promote_list
        if (JSON.stringify(preVal.final_promote_list) !== JSON.stringify(proVal.final_promote_list)) {
          //判断是新增还是删除
          const preFinalPromoteCfg = preVal.final_promote_list || []
          const proFinalPromoteCfg = proVal.final_promote_list || []
          const preFinalPromoteCfgSet = new Set(preFinalPromoteCfg.map(item => item.uid))
          const proFinalPromoteCfgSet = new Set(proFinalPromoteCfg.map(item => item.uid))
          const deleteFinalPromoteCfg = proFinalPromoteCfg.filter(item => !preFinalPromoteCfgSet.has(item.uid))
          const addFinalPromoteCfg = preFinalPromoteCfg.filter(item => !proFinalPromoteCfgSet.has(item.uid))
          //新增
          if (addFinalPromoteCfg.length > 0) {
            str += "\n新增Top9晋级决赛名单配置: \n"
            for (let i = 0; i < addFinalPromoteCfg.length; i++) {
              str += "昵称:" + addFinalPromoteCfg[i].nick + " 用户ID: " + addFinalPromoteCfg[i].uid + ","
            }
            str += "\n"
          }
          //删除
          if (deleteFinalPromoteCfg.length > 0 ) {
            str += "\n删除Top9晋级决赛名单配置: \n"
            for (let i = 0; i < deleteFinalPromoteCfg.length; i++) {
              str += "昵称:" + deleteFinalPromoteCfg[i].nick + " 用户ID: " + deleteFinalPromoteCfg[i].uid + ","
            }
            str += "\n"
          }
        }
        //top6 联系信息
        if (JSON.stringify(preVal.top6_contact_info) !== JSON.stringify(proVal.top6_contact_info)) {
          //判断是新增还是删除
          const preTop6ContactInfo = preVal.top6_contact_info || []
          const proTop6ContactInfo = proVal.top6_contact_info || []
          const preTop6ContactInfoSet = new Set(preTop6ContactInfo.map(item => item.uid))
          const proTop6ContactInfoSet = new Set(proTop6ContactInfo.map(item => item.uid))
          const deleteTop6ContactInfo = proTop6ContactInfo.filter(item => !preTop6ContactInfoSet.has(item.uid))
          const addTop6ContactInfo = preTop6ContactInfo.filter(item => !proTop6ContactInfoSet.has(item.uid))

          //新增
          if (addTop6ContactInfo.length > 0) {
            str += "\n新增Top6联系信息配置: \n"
            for (let i = 0; i < addTop6ContactInfo.length; i++) {
              str += "昵称:" + addTop6ContactInfo[i].nick + " 用户ID: " + addTop6ContactInfo[i].uid + ","
            }
            str += "\n"
          }
          //删除
          if (deleteTop6ContactInfo.length > 0) {
            str += "\n删除Top6联系信息配置: \n"
            for (let i = 0; i < deleteTop6ContactInfo.length; i++) {
              str += "昵称:" + deleteTop6ContactInfo[i].nick + " 用户ID: " + deleteTop6ContactInfo[i].uid + ","
            }
            str += "\n"
          }
        }
        //判断top6 起止时间
        if (isFirstPublish || proVal.top6_contact_start_time === undefined || proVal.top6_contact_end_time === undefined) {
          if (preVal.top6_contact_start_time !== undefined && preVal.top6_contact_end_time !== undefined) {
            str += "新增Top6联系信息起止时间: \n"
            str += "起止时间: " + (new Date(preVal.top6_contact_start_time * 1000).toLocaleString()) + " 至 " + (new Date(preVal.top6_contact_end_time * 1000).toLocaleString()) + "\n"
          }
        } else if (preVal.top6_contact_start_time !== proVal.top6_contact_start_time || preVal.top6_contact_end_time !== proVal.top6_contact_end_time) {
          str += "Top6联系信息,起止时间由: " + (new Date(proVal.top6_contact_start_time * 1000).toLocaleString()) + " 至 " + (new Date(proVal.top6_contact_end_time * 1000).toLocaleString()) + " 调整为 " + (new Date(preVal.top6_contact_start_time * 1000).toLocaleString()) + " 至 " + (new Date(preVal.top6_contact_end_time * 1000).toLocaleString()) + "\n"
        }

        console.log(str)
        return str
      },

    }
  }
</script>
