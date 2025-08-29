<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ruleId" key-id="MatchRule" :env-empty="true" :attr-names="AttrNames" />
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
        <el-form-item>
          <el-button  size="mini" @click="resetSearch">重置查询条件</el-button>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button size="mini" @click="handleShowDevTools()" icon="el-icon-setting">开发工具</el-button>
        <el-button size="mini" @click="showForm(0)" icon="el-icon-plus">添加赛制</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="赛制ID"
        />
        <el-table-column
          prop="name"
          label="赛制名称"
        />
        <el-table-column
          prop="modifier"
          label="修改人"
          v-if="showDevTool"
        />
        <el-table-column
          prop="update_time"
          label="修改时间"
          v-if="showDevTool"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="开关"
          v-if="showDevTool"
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
        <el-table-column
          label="操作"
          width="400px"
        >
        <template slot-scope="scope">
          <el-button
              size="mini"
              icon="el-icon-zoom-in"
              @click="checkForm(scope.row.id)"
            >查看</el-button>
          <el-button
              v-if="showDevTool"
              size="mini"
              icon="el-icon-edit"
              @click="showForm(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="showDevTool"
              type="success"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row.id)"
            >复制
            </el-button>
            <el-button v-if="showDevTool" type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
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
            当前页：{{ page }}/{{ Math.ceil(total/limit) }}
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
        <el-form-item v-if="editForm.data.id > 0" label="赛制ID：">
        {{ editForm.data.id }}
        </el-form-item>
        <el-form-item label="赛制名称：" :required="true">
          <el-input style="width: 200px;" v-model="editForm.data.name" placeholder="请填写赛制名称" />
        </el-form-item>
        <el-form-item label="支持游戏：" :required="true">
          <el-checkbox-group v-model="editForm.data.game_id">
            <el-checkbox v-for="item in gameCfgs" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="初始积分：" :required="true">
          <el-input style="width: 200px;" v-model.number="editForm.data.init_score" placeholder="请填写初始积分，默认0" />
        </el-form-item>
        <el-form-item label="是否SNG：" :required="true">
          <el-switch
            style="display: block"
            v-model="editForm.data.rule_type"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value='1'
            :inactive-value='0'
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="editForm.data.rule_type===0" label="是否跳过打立阶段：" :required="true">
          <el-switch
            style="display: block"
            v-model="editForm.data.rule_extra.skip_strikeout"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value='1'
            :inactive-value='0'
            active-text="是"
            inactive-text="否">
          </el-switch>
          <span v-show="showTip" style="color:red; margin-left:10px"></span>
          <el-tooltip class="item" effect="light" placement="right-start">
            <template #content>
              <div>一个特殊的字段开关,是基于MTT赛制下的一个独立字段</div>
            </template>
            <i class="el-icon-info" />
          </el-tooltip>
          <span style="color:red; margin-left:10px">[gtcc赛制字段,请慎重勾选,有疑问请联系开发 勾选会跳过比赛阶段1]</span>
        </el-form-item>
        <fieldset v-for="stageItem in editForm.data.stage_detail"  :key="stageItem.stage_index" style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>比赛{{ stageItem.stage_index }}阶段</legend>
          <div v-if="stageItem.system_type == 1 && (editForm.data.rule_type==0 && editForm.data.rule_extra.skip_strikeout == 0)">
            <el-form-item label="赛制类型：" :required="true">
              <el-select v-model="stageItem.system_type" :disabled="true" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in systemTypeCfgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配桌方式：" :required="true">
              <el-radio v-for="allocItem in allocTypeCfgs" :key="allocItem.value" v-model="stageItem.alloc_type" :label=allocItem.value>{{ allocItem.label }}</el-radio>
            </el-form-item>
            <div v-if="stageItem.system_type == 1">
              <el-form-item label="发车人数：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.wait_queue.player_num" placeholder="发车人数" />
              </el-form-item>
              <el-form-item label="发车时间：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.wait_queue.wait_time" placeholder="发车人数" >
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 此处是专配置打立出局相关配置 -->
          <div v-if="stageItem.system_type == 1 && (editForm.data.rule_type==0 && editForm.data.rule_extra.skip_strikeout == 0)">
            <!-- 底分增长配置 -->
            <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
              <legend>底分增长配置</legend>
              <el-form-item label="开关：" :required="true">
                <el-radio v-for="enableItem in enableCfgs" :key="enableItem.value" v-model="stageItem.system_strike_out.bottom_score_growth.open" :label=enableItem.value>{{ enableItem.label }}</el-radio>
              </el-form-item>
              <el-form-item label="增长类型：" :required="true">
                <el-radio v-for="growthItem in growthCfgs" :key="growthItem.value" v-model="stageItem.system_strike_out.bottom_score_growth.type" :label=growthItem.value>{{ growthItem.label }}</el-radio>
              </el-form-item>
              <el-form-item label="阶段数：" :required="true">
              <el-input-number v-model="stageItem.system_strike_out.bottom_score_growth.grow_total" @change="changeGrowTotal($event, stageItem.stage_index)" :min="1" :max="50"></el-input-number>
              </el-form-item>
              <el-form-item label="增长配置：" :required="true">
              <el-table
              :data="stageItem.system_strike_out.bottom_score_growth.init_score_grow_detail"
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :cell-style="libShow.TableCell(10)"
              style="width: 100%;"
              >
              <el-table-column
                prop="index"
                label="阶段"
                width="50px"
              />
              <el-table-column
                prop="duration"
                label="时长"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.duration"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="init_score"
                label="底分"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.init_score"/>
                </template>
              </el-table-column>
              </el-table>
              </el-form-item>
            </fieldset>
            <!-- 淘汰分增长配置 -->
            <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
              <legend>淘汰分增长配置</legend>
              <el-form-item label="开关：" :required="true">
                <el-radio v-for="enableItem in enableCfgs" :key="enableItem.value" v-model="stageItem.system_strike_out.disuse_score_growth.open" :label=enableItem.value>{{ enableItem.label }}</el-radio>
              </el-form-item>
              <el-form-item label="增长类型：" :required="true">
                <el-radio v-for="growthItem in growthCfgs" :key="growthItem.value" v-model="stageItem.system_strike_out.disuse_score_growth.type" :label=growthItem.value>{{ growthItem.label }}</el-radio>
              </el-form-item>
              <el-form-item label="阶段数：" :required="true">
              <el-input-number v-model="stageItem.system_strike_out.disuse_score_growth.grow_total" @change="changeDisuseGrowTotal($event, stageItem.stage_index)" :min="1" :max="50"></el-input-number>
              </el-form-item>
              <el-form-item label="增长配置：" :required="true">
              <el-table
              :data="stageItem.system_strike_out.disuse_score_growth.disuse_score_grow_detail"
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :cell-style="libShow.TableCell(10)"
              style="width: 100%;"
              >
              <el-table-column
                prop="index"
                label="阶段"
                width="50px"
              />
              <el-table-column
                prop="duration"
                label="时长"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.duration"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="disuse_score"
                label="淘汰分"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.disuse_score"/>
                </template>
              </el-table-column>
              </el-table>
              </el-form-item>
            </fieldset>
            <!-- 结束规则 -->
            <fieldset>
              <legend>结束规则</legend>
              <el-form-item label="结束方式：" :required="true">
                <el-radio v-for="endItem in endMethodCfgs" :key="endItem.value" v-model="stageItem.system_strike_out.end_rule.end_method" :label=endItem.value>{{ endItem.label }}</el-radio>
              </el-form-item>
              <el-form-item v-if="stageItem.system_strike_out.end_rule.end_method == 1 || stageItem.system_strike_out.end_rule.end_method == 3" label="剩余人数：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.end_rule.lave_user_number" placeholder="请填写剩余人数" />
              </el-form-item>
              <el-form-item v-if="stageItem.system_strike_out.end_rule.end_method == 2 || stageItem.system_strike_out.end_rule.end_method == 3" label="开赛后多少分钟结束：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.end_rule.match_minute" placeholder="请填写开赛后多少分钟结束" />
              </el-form-item>
            </fieldset>
            <!-- 晋级规则 -->
            <fieldset>
              <legend>晋级规则</legend>
              <el-form-item label="晋级排名规则：" :required="true">
                <el-radio v-for="sortItem in sortTypeCfgs" :key="sortItem.value" v-model="stageItem.system_strike_out.promotion_rule.score_sort_type" :label=sortItem.value>{{ sortItem.label }}</el-radio>
              </el-form-item>
              <el-form-item label="晋级人数：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.promotion_rule.user_number" placeholder="请填写晋级人数" />
              </el-form-item>
              <el-form-item label="积分带入上限：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.promotion_rule.score_brought_in.max_score" placeholder="请填写积分带入上限" />
              </el-form-item>
              <el-form-item label="是否开启带分下限：" :required="true">
                <el-switch
                  style="display: block"
                  v-model="stageItem.system_strike_out.promotion_rule.score_brought_in.open_min_score"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开启"
                  inactive-text="关闭">
                </el-switch>
              </el-form-item>
              <el-form-item label="积分带入下限：" :required="true" v-if="stageItem.system_strike_out.promotion_rule.score_brought_in.open_min_score">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.promotion_rule.score_brought_in.min_score" placeholder="请填写积分带入下限" />
              </el-form-item>
              <el-form-item label="带分方式：" :required="true">
                <el-radio v-for="scoreItem in scoreMethodCfgs" :key="scoreItem.value" v-model="stageItem.system_strike_out.promotion_rule.score_brought_in.score_method" :label=scoreItem.value>{{ scoreItem.label }}</el-radio>
              </el-form-item>
              <el-form-item v-if="stageItem.system_strike_out.promotion_rule.score_brought_in.score_method==1" label="开方加倍数：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.promotion_rule.score_brought_in.score_multiple" placeholder="请填写开方加倍数" />倍
              </el-form-item>
              <el-form-item v-if="stageItem.system_strike_out.promotion_rule.score_brought_in.score_method==2" label="固定比例：" :required="true">
                <el-input style="width: 200px;" v-model.number="stageItem.system_strike_out.promotion_rule.score_brought_in.score_rate" placeholder="请填写固定比例" />%
              </el-form-item>
            </fieldset>
          </div>
          <!-- 此处是专配置定局积分相关配置 -->
          <div v-if="stageItem.system_type == 2">
            <el-form-item label="晋级排名规则：" :required="true">
              <el-radio v-for="sortItem in sortTypeCfgs" :key="sortItem.value" v-model="stageItem.system_reach_out.score_sort_type" :label=sortItem.value>{{ sortItem.label }}</el-radio>
            </el-form-item>
            <el-form-item label="带分方式：" :required="true">
              <el-radio v-for="scoreItem in scoreMethodCfgs" :key="scoreItem.value" v-model="stageItem.system_reach_out.score_method" :label=scoreItem.value>{{ scoreItem.label }}</el-radio>
            </el-form-item>
            <el-form-item label="开启本轮底分：" :required="true">
              <el-radio v-for="enableItem in enableCfgs" :key="enableItem.value" v-model="stageItem.system_reach_out.bottom_score_open" :label=enableItem.value>{{ enableItem.label }}</el-radio>
            </el-form-item>
            <el-form-item label="阶段轮数：" :required="true">
              <el-input-number v-model="stageItem.system_reach_out.round_total" @change="changeRoundTotal($event, stageItem.stage_index)" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="阶段配置：" :required="true">
              <el-table
              :data="stageItem.system_reach_out.round_config"
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :cell-style="libShow.TableCell(10)"
              style="width: 100%;"
            >
              <el-table-column
                prop="index"
                label="轮数"
                width="50px"
              />
              <el-table-column
                prop="play_round"
                label="玩牌局数"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.play_round"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="promotion_user"
                label="晋级人数"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.promotion_user"/>
                </template>
              </el-table-column>
              <el-table-column
                v-if="stageItem.system_reach_out.score_method==1"
                prop="score_multiple"
                label="开方加倍数"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.score_multiple"/>倍
                </template>
              </el-table-column>
              <el-table-column
                prop="bottom_score_open"
                label="本轮底分"
                v-if="stageItem.system_reach_out.bottom_score_open==1"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.bottom_score"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="time_out"
                label="开始前暂停时间(秒)"
                v-if="envProjectName == 'ph_audit' && editForm.data.rule_type==1"
              >
                <template slot-scope="scope">
                  <el-input style="width: 80px;" v-model.number="scope.row.time_out"/>
                </template>
              </el-table-column>
            </el-table>
            </el-form-item>
          </div>
        </fieldset>
        <el-form-item>
          <el-button @click="saveStage()" size="medium" type="primary" icon="el-icon-s-order">保存赛制配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>


</template>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow} from '@/utils/common'
import {MATCH_IUPSTREAM_TYPE_OPTIONS} from "@/utils/options";

export default {
  name: 'MatchRule',
  components: { Compare, Publish },
  data() {
    return {
      envProjectName: process.env.VUE_APP_PROJECT,
      libShow: $libShow,
      form: {
        gameId: MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS,
        status: -1,
      },
      gameCfgs: [
        {"value": MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS, "label":"tongits"},
        // {"value": 15, "label":"德州"}
      ],
      statusCfgs: [
        {"value":0,"label":"启用"},
        {"value":1,"label":"禁用"},
      ],
      systemTypeCfgs: [
        {"value":1,"label":"打立出局"},
        {"value":2,"label":"定局积分"},
      ],
      allocTypeCfgs: [
        {"value":1,"label":"随机配桌"},
        //{"value":2,"label":"无重复队友"},
      ],
      enableCfgs: [
        {"value":1,"label":"开启"},
        //{"value":0,"label":"关闭"},
      ],
      growthCfgs: [
        {"value":3,"label":"按阶段增长"},
      ],
      endMethodCfgs: [
        //{"value":1,"label":"人数截至"},
        //{"value":2,"label":"时间截止"},
        {"value":3,"label":"时间+人数截止"},
      ],
      sortTypeCfgs: [
        {"value":1,"label":"按总排名"},
        //{"value":2,"label":"按桌内排名"},
      ],
      scoreMethodCfgs: [
        //{"value":1,"label":"开方加倍"},
        {"value":2,"label":"固定比列(%)"},
      ],
      tableData: [],
      limit: 10,
      total: 0,
      page: 1,
      selfBuild:0, //普通比赛的赛制
      editForm: {
        visable: false,
        title: "",
        isAdd: false,
        data: {
          rule_extra:{skip_strikeout:0},
        }
      },
      AttrNames: {
        ruleId: "赛制id",
        title: "赛制名称",
        gid: "支持的游戏id",
        initScore: "初始积分",
        stages: "比赛阶段配置",
        self_build:"是否是自建赛",
        start_num:"开赛人数",
        rule_extra:"拓展信息",
      },
      showDevTool: false,
      MATCH_IUPSTREAM_TYPE_OPTIONS,
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    resetSearch() {
      this.form.gameId = -1
      this.form.status = -1
    },
    getList() {
      request({
        url: '/matchconfig/match/rule/list',
        method: 'get',
        data: {
          Env: this.env,
          Status: this.form.status,
          PageNum: this.page,
          PageSize: this.limit,
          GameId:this.form.gameId,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.total > 0) {
            this.tableData = []
            this.total = 0
            for (let i = 0; i < objs.list.length; i++) {
              let gameId = parseInt(objs.list[i].game_id, 10)
              if (gameId !== MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS) {
                continue
              }
              if (this.form.gameId > 0) {
                if (this.form.gameId > 0 && this.form.gameId !== gameId) {
                  continue
                }
              }
              if (objs.list[i].self_build === 0) {
                this.total = this.total + 1
                this.tableData.push(objs.list[i])
              }
            }
            if (this.tableData.length > 0) {
              for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].status === 0) {
                  this.tableData[i].openShow = true
                } else {
                  this.tableData[i].openShow = false
                }

                //Message.info("测试:" + this.tableData[i].game_id)

                this.tableData[i].game_id = this.tableData[i].game_id
                let one = JSON.parse(this.tableData[i].stage_detail)
                for (let step = 0; step < one.length; step++) {
                  const element = one[step];
                  if(element.system_type == 1 && !element.system_strike_out.hasOwnProperty("wait_queue")) {
                    one[step].system_strike_out.wait_queue = {
                      "player_num":0, //发车人数
                      "wait_time":0, //等待时间
                    }
                  }
                  if(element.system_type == 1 && !element.system_strike_out.promotion_rule.score_brought_in.hasOwnProperty("min_score")){
                    one[step].system_strike_out.promotion_rule.score_brought_in.min_score = 0
                    one[step].system_strike_out.promotion_rule.score_brought_in.open_min_score = false
                  }
                }
                this.tableData[i].stage_detail = one
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
          console.log(id)
          console.log(status)
          console.log(this.tableData[i])
          break
        }
      }
      request({
        url: '/matchconfig/match/rule/status',
        method: 'post',
        data: {
          Env: this.env,
          Id: id,
          Status: status,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let showMsg = "启用赛制配置成功！"
          if (status == 1) {
            showMsg = "禁用赛制配置成功！"
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
    checkForm(id) {
      this.editForm.title = "赛制配置"
      this.editForm.isAdd = false
      for (let i=0;i<this.tableData.length;i++) {
          if (this.tableData[i].id == id) {

            //Message.info("测试111：" + JSON.stringify([this.tableData[i].game_id]))

            this.editForm.data = this.tableData[i]

            let gameId = parseInt(this.tableData[i].game_id, 10);

            this.editForm.data.game_id = [gameId]
            this.tableData[i].game_id = [gameId]
            //fix rule_extra
            const ruleExtraStr = this.tableData[i].rule_extra;
            let rule_extra
            try {
              rule_extra = ruleExtraStr ? JSON.parse(ruleExtraStr) : { skip_strikeout:0 };
            } catch (e) {
              rule_extra = {skip_strikeout:0 }; // 解析失败时使用默认值
            }
            this.editForm.data.rule_extra = rule_extra;
            break
        }
      }
      this.editForm.visable = true
    },
    showForm(id) {
      if (id == 0) {
        this.editForm.title = "新增赛制配置"
        this.editForm.data = {
          "id": 0,
          "name": "mtt赛制配置",
          "game_id": [MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS],
          "init_score": 1000,
          "rule_type":0,
          "stage_detail": [],
          "status": 0,
          "modifier": "",
          "update_time": 0,
          "rule_extra":{
            "skip_strikeout":0,
          }
        }
        this.editForm.isAdd = true
        this.addStage()
      } else {
        this.editForm.title = "编辑赛制配置"
        this.editForm.isAdd = false
        for (let i=0;i<this.tableData.length;i++) {
          if (this.tableData[i].id == id) {

            //Message.info("测试111：" + JSON.stringify([this.tableData[i].game_id]))
            this.editForm.data = this.tableData[i]
            if(!this.editForm.data.hasOwnProperty("rule_type")){
              this.editForm.data.rule_type = 0
            }
            let gameId = parseInt(this.tableData[i].game_id, 10);

            this.editForm.data.game_id = [gameId]
            this.tableData[i].game_id = [gameId]

            //fix rule_extra
            const ruleExtraStr = this.tableData[i].rule_extra;
            let rule_extra
            try {
              rule_extra = ruleExtraStr ? JSON.parse(ruleExtraStr) : { skip_strikeout:0 };
            } catch (e) {
              rule_extra = { skip_strikeout:0 }; // 解析失败时使用默认值
            }
            this.editForm.data.rule_extra = rule_extra;

            break
          }
        }
      }
      this.editForm.visable = true
    },
    changeRoundTotal(val, stageIndex) {
      for(let i=0;i<this.editForm.data.stage_detail.length;i++) {
        if (this.editForm.data.stage_detail[i].stage_index == stageIndex) {
          let oldLen = this.editForm.data.stage_detail[i].system_reach_out.round_config.length
          if (oldLen > val) {
            for (let j=0; j<oldLen;j++) {
              if (j == val) {
                this.editForm.data.stage_detail[i].system_reach_out.round_config.splice(val, oldLen-val)
              }
            }
          } else {
            let diffNum = val - oldLen
            for (let j=0;j<diffNum;j++) {
              this.editForm.data.stage_detail[i].system_reach_out.round_config.push({
                "index": oldLen+1+j,                 //第几轮
                "play_round": 0,            //玩牌局数
                "promotion_user": 0,        //晋级人数
                "init_score_growth":0,     //本轮初始积分增量
                "score_multiple": 0,   //开方加倍数，带分方式为1有值
                "score_rate": 100,   //固定比列(%)，带分方式为2有值
                "bottom_score_open": 1, //开启本轮底分0:开启，1关闭
                "bottom_score": 0, //本轮底分
              })
            }
          }
          break
        }
      }
    },
    changeGrowTotal(val, stageIndex) {
      for(let i=0;i<this.editForm.data.stage_detail.length;i++) {
        if (this.editForm.data.stage_detail[i].stage_index == stageIndex) {
          let oldLen = this.editForm.data.stage_detail[i].system_strike_out.bottom_score_growth.init_score_grow_detail.length
          if (oldLen > val) {
            for (let j=0; j<oldLen;j++) {
              if (j == val) {
                this.editForm.data.stage_detail[i].system_strike_out.bottom_score_growth.init_score_grow_detail.splice(val, oldLen-val)
              }
            }
          } else {
            let diffNum = val - oldLen
            for (let j=0;j<diffNum;j++) {
              this.editForm.data.stage_detail[i].system_strike_out.bottom_score_growth.init_score_grow_detail.push({
                "index": oldLen+1+j,                 //第几轮
                "duration": 80,            //时长
                "init_score": 100,          //底分
              })
            }
          }
          break
        }
      }
    },
    changeDisuseGrowTotal(val, stageIndex) {
      for(let i=0;i<this.editForm.data.stage_detail.length;i++) {
        if (this.editForm.data.stage_detail[i].stage_index == stageIndex) {
          let oldLen = this.editForm.data.stage_detail[i].system_strike_out.disuse_score_growth.disuse_score_grow_detail.length
          if (oldLen > val) {
            for (let j=0; j<oldLen;j++) {
              if (j == val) {
                this.editForm.data.stage_detail[i].system_strike_out.disuse_score_growth.disuse_score_grow_detail.splice(val, oldLen-val)
              }
            }
          } else {
            let diffNum = val - oldLen
            for (let j=0;j<diffNum;j++) {
              this.editForm.data.stage_detail[i].system_strike_out.disuse_score_growth.disuse_score_grow_detail.push({
                "index": oldLen+1+j,                 //第几轮
                "duration": 80,            //时长
                "disuse_score": 100,          //淘汰分
              })
            }
          }
          break
        }
      }
    },
    addStage() {
      this.editForm.data.stage_detail.push({
        "stage_index": 1,       //阶段序号
        "system_type": 1,       //赛制类型：1打立出局，2定局积分
        "alloc_type": 1,    //配桌方式:1随机配桌,2无重复队友
        "system_reach_out": {   //定局积分
            "round_total": 1,   //总轮数
            "score_sort_type": 1,   //晋级排名规则：1按总排名，2按桌内排名
            "score_method": 2,  //带分方式：1开方加倍,2固定比列
            "bottom_score_open": 1, //开启本轮底分0:开启，1关闭
            "round_config": [
            ]
        },
        "system_strike_out": {
          "bottom_score_growth": {    //底分增长配置
            "open": 1,              //是否开启：0开启，1关闭
            "type": 3,              //增长类型:1固定，2倍数增长,3定值增长
            "grow_total": 1,        //细节数量
            "init_score_grow_detail": [  //底分增长细节
              {
                "index": 1,                //阶段
                "duration": 80,            //时长
                "init_score": 100,          //底分
              }
            ]
          },
          "disuse_score_growth": {    //淘汰分
              "open": 1,              //是否开启：0开启，1关闭
              "type": 3,              //增长类型:1固定，2倍数增长,3定值增长
              "grow_total": 1,        //细节数量
              "disuse_score_grow_detail": [  //底分增长细节
              {
                "index": 1,                //阶段
                "duration": 80,            //时长
                "disuse_score": 100,       //淘汰分
              }
            ]
          },
          "end_rule": {               //结束规则
              "end_method": 3, //结束方式：1时间截止，2人数截止，3:时间+人数截止
              "lave_user_number": 9, //剩余人数
              "match_minute": 100,    //开赛多少分钟
          },
          "promotion_rule": {         //晋级规则
              "score_sort_type": 1,   //晋级排名规则：1按总排名，2按桌内排名，打立默认是1
              "user_number": 9,      //晋级人数
              "score_brought_in": {   //积分带入情况
                  "max_score": 1000,  //带分上限
                  "min_score": 0,     //带分下限
                  "open_min_score":false, //是否开启带分上限
                  "score_method": 2,  //带分方式：1开方加倍,2固定比列
                  "score_multiple": 1,   //开方加倍数，带分方式为1有值
                  "score_rate": 100,   //固定比列(%)，带分方式为2有值
              }
          },
          "wait_queue":{ //班车配置
            "player_num":3, //发车人数
            "wait_time":9, //等待时间
          },
        }
      })
      this.editForm.data.stage_detail.push({
        "stage_index": 2,       //阶段序号
        "system_type": 2,       //赛制类型：1打立出局，2定局积分
        "alloc_type": 1,    //配桌方式:1随机配桌,2无重复队友
        "system_reach_out": {   //定局积分
            "round_total": 1,   //总轮数
            "score_sort_type": 1,   //晋级排名规则：1按总排名，2按桌内排名
            "score_method": 2,  //带分方式：1开方加倍,2固定比列
            "bottom_score_open": 1, //开启本轮底分0:开启，1关闭
            "round_config": [
                {
                    "index": 1,                 //第几轮
                    "play_round": 4,            //玩牌局数
                    "promotion_user": 3,        //晋级人数
                    "init_score_growth":0,     //本轮初始积分增量
                    "score_multiple": 1,   //开方加倍数，带分方式为1有值
                    "score_rate": 100,   //固定比列(%)，带分方式为2有值
                    "bottom_score": 100, //本轮底分(开启本轮底分才有)
                }
            ]
        },
        "system_strike_out": {
          "bottom_score_growth": {    //底分增长配置
            "open": 0,              //是否开启：0开启，1关闭
            "type": 3,              //增长类型:1固定，2倍数增长,3定值增长
            "grow_total": 1,
            "init_score_grow_detail": [  //底分增长细节
            ]
          },
          "disuse_score_growth": {    //淘汰分
              "open": 0,              //是否开启：0开启，1关闭
              "type": 3,              //增长类型:1固定，2倍数增长,3定值增长
              "grow_total": 1,        //细节数量
              "disuse_score_grow_detail": [  //底分增长细节
            ]
          },
          "end_rule": {               //结束规则
              "end_method": 3, //结束方式：1时间截止，2人数截止，3:时间+人数截止
              "lave_user_number": 9, //剩余人数
              "match_minute": 100,    //开赛多少分钟
          },
          "promotion_rule": {         //晋级规则
              "score_sort_type": 1,   //晋级排名规则：1按总排名，2按桌内排名，打立默认是1
              "user_number": 9,      //晋级人数
              "score_brought_in": {   //积分带入情况
                  "max_score": 1000,  //带分上限
                  "score_method": 2,  //带分方式：1开方加倍,2固定比列
                  "score_multiple": 1,   //开方加倍数，带分方式为1有值
                  "score_rate": 100,   //固定比列(%)，带分方式为2有值
              }
          }
        }
      })
      this.editForm.data.rule_extra = {
        'skip_strikeout':0,
      }
    },
    saveStage() {
      let stageDetail = JSON.stringify(this.editForm.data.stage_detail)
      let gameId = parseInt(this.editForm.data.game_id, 10);
      let origin = this.editForm.data.game_id
     // console.log("save stageDetail==> ",stageDetail)
      // Message.info("gameId:" + gameId + " origin:" + origin)

      if (!this.configCheck()) {
        return
      }
      console.log("this.editForm.data ",this.editForm.data)
      request({
        url: '/matchconfig/match/rule',
        method: 'post',
        data: {
          Env: this.env,
          Id: this.editForm.data.id,
          Name: this.editForm.data.name,
          Status: this.editForm.data.status,
          StageDetail: stageDetail,
          GameId: gameId,
          InitScore: this.editForm.data.init_score,
          RuleType:this.editForm.data.rule_type,
          SelfBuild:this.selfBuild,
          RuleExtra:JSON.stringify(this.editForm.data.rule_extra),
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let showMsg = "新增赛制配置成功！"
          if (this.editForm.data.id > 0) {
            showMsg = "编辑赛制配置成功！"
          }
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
          return
        } else {
          let errMsg = "新增赛制配置失败！"
          if (this.editForm.data.id > 0) {
            errMsg = "编辑赛制配置失败！"
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
              url: '/matchconfig/match/rule/copy',
              method: 'post',
              data: {
                Env: this.env,
                Id: id,
              }
            }).then(response => {
              if (response.RetCode === 0) {
                Message.success("复制赛制配置成功！")
                this.getList()
                return
              } else {
                Message.error('复制赛制配置失败：'+response.Data)
                return
              }
            })
          })
          .catch(() => {
            console.log('取消')
          })
    },
    handleShowDevTools() {
      // 浏览器设置ShowDev=1才可以看到开发工具
      if (window.ShowDev == 1) {
        this.showDevTool = !this.showDevTool
      }
    },
    handleDelete(id) {
      this.$confirm("您确定要将该赛制删除吗？请确认无使用该赛制的配置再删除", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            request({
              url: '/matchconfig/match/rule/delete',
              method: 'post',
              data: {
                Env: this.env,
                Id: id,
              }
              }).then(response => {
                if (response.RetCode === 0) {
                  Message.success('删除赛制成功！')
                  this.getList()
                } else {
                  Message.error('删除赛制失败！')
                }
              })
        }).catch(() => {
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
      if (this.editForm.data.init_score <= 0) {
        this.errmsg('初始积分值无效！')
        return false
      }
      if (this.editForm.data.stage_detail.length < 1 || this.editForm.data.stage_detail > 2) {
        this.errmsg('比赛只允许有两个阶段！')
        return false
      }
      if (this.editForm.data.stage_detail.length == 2 && this.editForm.data.stage_detail[0].system_type != 1) {
        this.errmsg('阶段1的类型只能是【打立出局】！')
        return false
      }
      for (let i=0; i<this.editForm.data.stage_detail.length; i++) {
        //打立出局阶段配置检查
        if (this.editForm.data.stage_detail[i].system_type == 1) {
          const strikeOutStage = this.editForm.data.stage_detail[i]
          if (strikeOutStage.alloc_type != 1) {
            this.errmsg('打立出局阶段的配桌方式暂不支持，请选择【随机配桌】！')
            return false
          }
          if(strikeOutStage.system_strike_out.wait_queue.wait_time <=0 || strikeOutStage.system_strike_out.wait_queue.player_num<=0){
            this.errmsg('班车配置错误')
            return false
          }
          //底分检查
          if (strikeOutStage.system_strike_out.bottom_score_growth.type > 1) {
            this.editForm.data.stage_detail[i].system_strike_out.bottom_score_growth.open = 1

            if (strikeOutStage.system_strike_out.bottom_score_growth.init_score_grow_detail.length > 0) {
              if (strikeOutStage.system_strike_out.bottom_score_growth.init_score_grow_detail[0].init_score >= this.editForm.data.init_score) {
                this.errmsg('打立出局阶段的底分初始值必须小于用户初始积分！')
                return false
              }
            }

            for (let j=0; j < strikeOutStage.system_strike_out.bottom_score_growth.init_score_grow_detail.length; j++) {
              /*
              if (strikeOutStage.system_strike_out.bottom_score_growth.init_score_grow_detail[j].init_score >= this.editForm.data.init_score) {
                this.errmsg('打立出局阶段的底分初始值必须小于用户初始积分！')
                return false
              }
              */
              if (strikeOutStage.system_strike_out.bottom_score_growth.type == 3) {
                if (strikeOutStage.system_strike_out.bottom_score_growth.init_score_grow_detail[j].duration <= 0) {
                  this.errmsg('打立出局阶段的底分时长无效！')
                  return false
                }
              }
            }
          }
          //淘汰分检查
          if (strikeOutStage.system_strike_out.disuse_score_growth.type > 1) {
            this.editForm.data.stage_detail[i].system_strike_out.disuse_score_growth.open = 1

            if (strikeOutStage.system_strike_out.disuse_score_growth.disuse_score_grow_detail.length > 0) {
              if (strikeOutStage.system_strike_out.disuse_score_growth.disuse_score_grow_detail[0].disuse_score >= this.editForm.data.init_score) {
                this.errmsg('打立出局阶段的淘汰分初始值必须小于用户初始积分！')
                return false
              }
            }

            for (let j=0; j < strikeOutStage.system_strike_out.disuse_score_growth.disuse_score_grow_detail.length; j++) {
              if (strikeOutStage.system_strike_out.disuse_score_growth.disuse_score_grow_detail[j].disuse_score == 0) {
                this.errmsg('打立出局阶段的淘汰分不能为0！')
                return false
              }
              if (strikeOutStage.system_strike_out.disuse_score_growth.type == 3) {
                if (strikeOutStage.system_strike_out.disuse_score_growth.disuse_score_grow_detail[j].duration <= 0) {
                  this.errmsg('打立出局阶段的淘汰分增长间隔无效！')
                  return false
                }
              }
            }
          }
          //结束规则检查
          if (strikeOutStage.system_strike_out.end_rule.end_method == 1 || strikeOutStage.system_strike_out.end_rule.end_method == 3) {
            if (strikeOutStage.system_strike_out.end_rule.lave_user_number <= 0) {
              this.errmsg('打立出局阶段的结束人数值无效！')
              return false
            }
            if (this.editForm.data.rule_type == 0 && this.editForm.data.rule_extra.skip_strikeout == 0){
              if (strikeOutStage.system_strike_out.end_rule.lave_user_number < strikeOutStage.system_strike_out.promotion_rule.user_number) {
                this.errmsg('打立出局阶段的结束人数不能小于晋级人数！')
                return false
              }
            }
          }
            if (strikeOutStage.system_strike_out.end_rule.end_method == 2 || strikeOutStage.system_strike_out.end_rule.end_method == 3) {
              if (strikeOutStage.system_strike_out.end_rule.match_minute <= 0 || strikeOutStage.system_strike_out.end_rule.match_minute > 1440) {
                this.errmsg('打立出局阶段的结束时长值无效！')
                return false
              }
            }
          //晋级规则检查
          if (strikeOutStage.system_strike_out.promotion_rule.score_sort_type != 1) {
            this.errmsg('打立出局阶段的晋级排行规则不支持！')
            return false
          }
          if (strikeOutStage.system_strike_out.promotion_rule.user_number <= 0) {
            this.errmsg('打立出局阶段的晋级人数值无效！')
            return false
          }
          if (strikeOutStage.system_strike_out.promotion_rule.user_number % 3 != 0) {
            this.errmsg('打立出局阶段的晋级人数值必须是3的倍数！')
            return false
          }
          if (strikeOutStage.system_strike_out.promotion_rule.score_brought_in.score_method == 1 && strikeOutStage.system_strike_out.promotion_rule.score_brought_in.score_multiple <= 0) {
            this.errmsg('打立出局阶段的带分开方加倍数无效！')
            return false
          }
          if (strikeOutStage.system_strike_out.promotion_rule.score_brought_in.score_method == 2 && (strikeOutStage.system_strike_out.promotion_rule.score_brought_in.score_rate <= 0 || strikeOutStage.system_strike_out.promotion_rule.score_brought_in.score_rate > 100)) {
            this.errmsg('打立出局阶段的带分比例值无效！')
            return false
          }
          let bi = strikeOutStage.system_strike_out.promotion_rule.score_brought_in;
          if (bi.min_score != 0 ) {
            if(bi.min_score > bi.max_score){
              this.errmsg('打立出局晋级的带分 下限大于上限值')
              return false
            }
            if(bi.min_score < -10000 || bi.min_score > 10000) {
              this.errmsg('打立出局晋级的带分 下限取值范围[-10000,10000]')
              return false
            }
          }
        } else if (this.editForm.data.stage_detail[i].system_type == 2) { //定局积分阶段配置检查
          const reachOutStage = this.editForm.data.stage_detail[i]
          if (reachOutStage.system_reach_out.score_sort_type != 1) {
            this.errmsg('定局积分阶段的晋级排名规则不支持，请选择【按总排名】！')
            return false
          }
          if (reachOutStage.system_reach_out.round_config.length == 0) {
            this.errmsg('定局积分阶段的轮次配置不能为空！')
            return false
          }
          let lastUserNum = 0
          if (this.editForm.data.stage_detail.length > 1 && this.editForm.data.rule_type == 0 && this.editForm.data.rule_extra.skip_strikeout == 0) {
            lastUserNum = this.editForm.data.stage_detail[0].system_strike_out.promotion_rule.user_number
            if (lastUserNum < reachOutStage.system_reach_out.round_config[0].promotion_user){
              this.errmsg('定局积分第1轮人数不能大于打立出局晋级人数')
              return false
            }
          }
          lastUserNum = reachOutStage.system_reach_out.round_config[0].promotion_user
          for (let i=0; i<reachOutStage.system_reach_out.round_config.length; i++) {
            const round = reachOutStage.system_reach_out.round_config[i]
            if (round.play_round <= 0 || round.play_round > 1000) {
              this.errmsg('定局积分第' + round.index + '轮的局数值无效!')
              return false
            }
              if (round.promotion_user > lastUserNum) {
                this.errmsg('定局积分第' + round.index + '轮的晋级人数不能大于前一轮的晋级人数!')
                return false
              } else if (round.promotion_user % 3 != 0) {
                this.errmsg('定局积分第' + round.index + '轮的晋级人数必须是3的倍数!')
                return false
              } else {
                lastUserNum = round.promotion_user
              }
            if (reachOutStage.system_reach_out.score_method == 1 && round.score_multiple <= 0) {
              this.errmsg('定局积分第' + round.index + '轮的底分开方加倍数无效!')
              return false
            }
            if (reachOutStage.system_reach_out.score_method == 2 && round.score_rate <= 0) {
              this.errmsg('定局积分第' + round.index + '轮的底分比例值无效!')
              return false
            }
          }
        } else {
          this.errmsg('阶段'+(i+1)+'的类型不支持！')
          return false
        }
      }
      //sng 不支持跳过打立阶段
      if(this.editForm.data.rule_type == 1 ||this.editForm.data.rule_extra.skip_strikeout == 0){
        this.editForm.data.rule_extra.skip_strikeout = 0
      }
      return true
    }
  }
}
</script>
