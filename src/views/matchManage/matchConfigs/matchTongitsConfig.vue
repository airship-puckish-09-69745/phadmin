<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="matchCfgId" key-id="MatchConfig" :env-empty="true" :attr-names="AttrNames" :make-content="makeContent" :head-attrs="['matchCfgId','title']" />
    </el-row>
    <el-row>
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
        <el-form-item label="游戏：" :required="true">
          <el-select v-model="form.gameId" placeholder="请选择" size="mini">
            <el-option label="全部" :value="-1" />
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
            <el-option label="全部" :value="-1" />
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
            <el-option label="全部" :value="-1" />
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
            <el-option label="全部" :value="-1" />
            <el-option
              v-for="item in csCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="APPID：" :required="true">
          <el-select v-model="form.appId" placeholder="请选择" size="mini">
            <el-option label="全部" :value="-1" />
            <el-option
              v-for="item in APPID_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="resetSearch">重置查询条件</el-button>
          <el-button type="primary" size="mini" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button size="mini" icon="el-icon-setting" @click="handleShowDevTools()">开发工具</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="showForm(0)">添加比赛</el-button>
        <el-button size="mini" icon="el-icon-document-copy" @click="copyAll">复制整日</el-button>
        <el-button size="mini" icon="el-icon-delete" @click="expireAll">下架过往</el-button>
        <el-button size="mini" icon="el-icon-delete" @click="deleteAllOff">清理下架</el-button>
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
          sortable
        />
        <el-table-column
          prop="name"
          label="赛事名称"
        />
        <el-table-column
          prop="game_id"
          label="游戏名称"
          width="100"
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
            <DateTimeShow :show-type="2" :timestamp="row.start_time" />
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
        >
          <template slot-scope="{row}">
            <DateTimeShow :show-type="2" :timestamp="row.end_time" />
          </template>
        </el-table-column>

        <el-table-column
          prop="sort"
          label="赛事排序"
          width="80"
          sortable
        />
        <el-table-column
          prop="repeatType"
          label="赛事类型"
        >
          <template slot-scope="scope">
            {{ getRepeatTypeShow(scope.row.repeat_type) }}
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
            <el-button v-if="scope.row.openShow==false" size="mini" type="success" @click="updateStatus(scope.row.id, true)">上架</el-button>
            <el-button v-if="scope.row.openShow==true" size="mini" type="danger" @click="updateStatus(scope.row.id, false)">下架</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
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
            <el-button v-if="showDevTool&&(scope.row.openShow==false)" type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button
              v-else="showDevTool"
              type="success"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row.id)"
            >复制
            </el-button>

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
      width="900px"
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
                <el-select v-model="scope.row.appId" placeholder="请选择" size="mini" @change="selectShowGuieds()">
                  <el-option
                    v-for="item in APPID_OPTIONS"
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
                  <el-checkbox v-for="item in CHANNEL_OPTIONS" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <fieldset>
          <legend>赛事信息</legend>
          <el-form-item label="赛事名称：" :required="true">
            <el-input v-model="editForm.data.name" style="width: 200px;" placeholder="请填写赛事名称" />
          </el-form-item>
          <el-form-item label="游戏选择：" :required="true">
            <el-select v-model="editForm.data.gameId" placeholder="请选择" size="mini" @change="selectMatchGame()">
              <el-option
                v-for="item in gameCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="赛制选择：" :required="true">
            <el-select v-model="editForm.data.csId" placeholder="请选择" size="mini" filterable @change="getCurrCsGrowInfo()">
              <el-option
                v-for="item in showCsCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="checkMatchRuleDisable(item.value)"
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
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===2"  label="最低开赛人数：" :required="true">
            <el-input v-model="editForm.data.opentMatchMember" style="width: 200px;" placeholder="请填写开赛人数" />
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===1"  label="比赛开赛人数：" :required="true">
            <el-input v-model="editForm.data.opentMatchMember" style="width: 200px;" placeholder="请填写开赛人数" />
          </el-form-item>
          <el-form-item label="封面图片URL：" :required="true">
            <ImagePicker v-model="editForm.data.imagePath" />
          </el-form-item>
          <el-form-item label="白名单开关：" :required="true">
            <el-radio v-for="item in whileListCfgs" :key="item.value" v-model="editForm.whileList.type" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item v-if="editForm.whileList.type===1" label="白名单设置：" :required="true">
            <el-input v-model="editForm.whileList.data" style="width: 400px;" placeholder="多个uid用,分开" />
          </el-form-item>
          <el-form-item label="排序值：" :required="true">
            <el-input v-model.number="editForm.data.sort" style="width: 200px;" placeholder="值越高排序越在前" @input="checkListSort(editForm.data.sort)" />
            <span v-show="showTip" style="color:red; margin-left:10px">注意有相同的排序值</span>
            <el-tooltip class="item" effect="light" placement="right-start">
              <template #content>
                <div>排序相同，时间相同则会同时展示。排序相同时间不同则大于30分钟的会展示</div>
                <div>否则会在当前之后按顺序展示</div>
              </template>
              <i class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="比赛全局ID：" :required="true">
            <el-select v-model="editForm.signExtra.matchUniqueId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in matchUniqueIdCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="比赛牌桌ID：" :required="true">
            <el-select v-model="editForm.listExtra.tableSceneId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in MATCH_TABLE_SCENE_ID_CFG"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="GTCC线上决赛补位白名单:" :required="true">
            <el-radio v-for="item in whileListCfgs" :key="item.value" v-model="editForm.signExtra.gtccWhiteList.type" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item v-if="editForm.signExtra.gtccWhiteList.type===1" label="白名单设置：" :required="true">
            <el-input v-model="editForm.signExtra.gtccWhiteList.data" style="width: 400px;" placeholder="多个uid用,分开" />
          </el-form-item>

        </fieldset>
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>开赛时间</legend>
          <el-form-item label="比赛类型：" :required="true">
            <el-select v-model="editForm.data.repeatType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in repeatCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="checkRepeatDisable(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType === 0" :label="getMatchStartTimeLabel()" :required="true">
            <el-date-picker
              v-model="editForm.loopDetail.onceTime"
              format="yyyy-MM-dd HH:mm"
              size="mini"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
            <el-tooltip v-if="editForm.data.opentMatchType === 1" class="item" effect="dark" content="人满开赛时结束时间无意义，但必须大于开始时间" placement="right-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType !== 0" label="比赛开始日期：" :required="true">
            <el-date-picker
              v-model="editForm.loopDetail.loopStartDate"
              size="mini"
              type="date"
              placeholder="选择开始日期"
              :disabled="repeatLoopDisabled()"
            />
            <span style="color:black; margin-left:10px">[00:00:00]</span>
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType != 0" label="比赛结束日期：" :required="true">
            <el-date-picker
              v-model="editForm.loopDetail.loopEndDate"
              size="mini"
              type="date"
              placeholder="选择结束日期"
            />
            <span style="color:black; margin-left:10px">[23:59:59]</span>
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType != 0" label="间隔天数（0为每天创建）：" :required="true">
            <el-input v-model.number="editForm.loopDetail.intervalDay" style="width: 200px;" placeholder="请填写间隔天数，0为每天创建" :disabled="repeatLoopDisabled()" />
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType == 1" label="开赛时间：" :required="true">
            <el-time-picker
              v-model="editForm.loopDetail.single.stime"
              arrow-control
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="开始时间"
            />
            <el-time-picker
              v-model="editForm.loopDetail.single.etime"
              arrow-control
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item v-if="editForm.data.repeatType === 2" label="循环时间段：" :required="true">
            <el-button type="normal" size="mini" @click="addLoopItem()">添加时段</el-button>
            <el-table
              :data="editForm.loopDetail.loopData"
              border
              stripe
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'35px'}"
              :cell-style="libShow.TableCell(0)"
              style="width: 100%;line-height:35px;"
            >
              <el-table-column
                prop="index"
                label="第X段"
              />
              <el-table-column
                prop="stime"
                label="开始时间"
              >
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.stime"
                    arrow-control
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    placeholder="开始时间"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="stime"
                label="结束时间"
              >
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.etime"
                    arrow-control
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    placeholder="结束时间"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="intervalSeconds"
                label="间隔时间(秒)"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.intervalSeconds" style="width: 80px;" placeholder="请填写间隔时间" :disabled="repeatLoopDisabled()" />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="removeLoopItem(scope.$index)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===2" label="提前显示时间(秒)：" :required="true">
            <el-input v-model.number="editForm.data.preShowSeconds" style="width: 200px;" placeholder="请填写提前显示时间" />
          </el-form-item>
          <el-form-item v-if="envProjectName === 'ph_audit' && editForm.data.opentMatchType===1" label="创建时间(秒)" :required="true">
            <el-input v-model.number="editForm.data.preShowSeconds" style="width: 200px;" placeholder="请填写创建时间" />
            <el-tooltip v-if="envProjectName === 'ph_audit' && editForm.data.opentMatchType === 1" class="item" effect="dark" content="比赛开始时间=最后开赛时间-创建时间" placement="right-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===2" label="提前进入时间(秒)：" :required="true">
            <el-input v-model.number="editForm.data.preEnterSeconds" style="width: 200px;" placeholder="请填写提前进入时间" />
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===2" label="延迟进入时间(秒)：" :required="true">
            <el-input v-model.number="editForm.data.delayEnterSeconds" style="width: 200px;" placeholder="请填写延迟进入时间" />
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>显示控制</legend>
          <el-form-item label="消失时间点：" :required="true">
            <el-select v-model="editForm.data.disappearType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in disappearCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>报名条件</legend>
          <el-form-item label="报名条件：" :required="true">
            <el-select v-model="editForm.data.signUpType" placeholder="请选择" size="mini" @change="changeRewardCfg">
              <el-option
                v-for="item in signUpTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="checkSngSignTypeDisable(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.data.signUpType === 0 || editForm.data.signUpType === 3" label="报名费：" :required="true">
            <el-input v-model.number="editForm.data.signUpNum" style="width: 200px;" size="mini" placeholder="请填写金币数量" />
          </el-form-item>

          <el-form-item v-if=" editForm.data.signUpType === 2 || editForm.data.signUpType === 3" label="门票：" :required="true">
            <el-select v-model="editForm.signExtra.propId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in matchTicketsCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if=" editForm.data.signUpType === 2 || editForm.data.signUpType === 3" label="门票数量：" :required="true">
            <el-input v-model.number="editForm.signExtra.propNum" style="width: 180px;" size="mini" placeholder="请填写门票数量" />
          </el-form-item>

          <el-form-item v-if="editForm.data.signUpType === 1" label="今日投注下限(0不限制)：" :required="true">
            <el-input v-model.number="editForm.signExtra.betCnt" style="width: 200px;" size="mini" placeholder="请填写限制数值" />
          </el-form-item>

          <el-form-item v-if="editForm.data.signUpType ===1" label="是否启用每日限制：" :required="true">
            <!-- <el-input v-model="editForm.data.openDaysLimit" style="width: 200px;" placeholder="1限制0不限制" /> -->
            <el-switch
              v-model="editForm.data.openDaysLimit"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item v-if="editForm.data.opentMatchType===2" label="比赛最大人数：" :required="true">
            <el-input v-model.number="editForm.signExtra.matchMaxLimit" style="width: 180px;" size="mini" placeholder="请填写最大数量" />
          </el-form-item>

          <el-form-item v-if="editForm.data.signUpType === 3" label="电子钱包报表是否上报:" :required="true">
            <el-radio-group v-model.number="editForm.signExtra.walletReport">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </fieldset>

        <fieldset v-if="editForm.data.opentMatchType===2">
          <legend> Rebuy报名条件</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否支持rebuy:" :required="true">
                <el-radio-group v-model.number="editForm.signExtra.reubyExtra.supportRebuy">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1" label="Rebuy报名条件:" :required="false">
                <el-select v-model="editForm.signExtra.reubyExtra.rebuySignType" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in RebuySignUpTypeCfgs"
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
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 0 || editForm.signExtra.reubyExtra.rebuySignType === 3)" label="Rebuy报名费：" :required="true">
                <el-input v-model.number="editForm.signExtra.reubyExtra.reubyFree" style="width: 200px;" size="mini" placeholder="请填写金币数量" />
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 2 || editForm.signExtra.reubyExtra.rebuySignType === 3)" label="Rebuy门票：" :required="true">
                <el-select v-model="editForm.signExtra.reubyExtra.rebuyPropId" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in matchTicketsCfgs"
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
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && (editForm.signExtra.reubyExtra.rebuySignType === 2 || editForm.signExtra.reubyExtra.rebuySignType === 3)" label="Rebuy门票数量：" :required="true">
                <el-input v-model.number="editForm.signExtra.reubyExtra.rebuyPropNum" style="width: 180px;" size="mini" placeholder="请填写门票数量" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1" label="Rebuy补充积分:" :required="false">
                <el-input v-model.number="editForm.signExtra.reubyExtra.reubyScores" style="width: 200px;" size="mini" placeholder="请填写次数" />
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1" label="Rebuy操作时长(秒):" :required="false">
                <el-input v-model.number="editForm.signExtra.reubyExtra.reubySecs" style="width: 200px;" size="mini" placeholder="请填写时间" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1" label="Rebuy次数:" :required="false">
                <el-input v-model.number="editForm.signExtra.reubyExtra.reubyCount" style="width: 200px;" size="mini" placeholder="请填写次数" />
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1" label="Rebuy截止阶段:" :required="false">
                <el-select v-model="editForm.signExtra.reubyExtra.reubyRound" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in reubyGrowCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="editForm.signExtra.reubyExtra.supportRebuy===1 && editForm.signExtra.reubyExtra.rebuySignType===3" label="电子钱包报表是否上报:" :required="true">
            <el-radio-group v-model.number="editForm.signExtra.reubyExtra.walletReport">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </fieldset>
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>奖励信息</legend>
          <el-form-item v-if="editForm.data.opentMatchType===2" label="奖励模型：" :required="true">
            <el-radio v-for="item in prizeModleCfgs" :key="item.value" v-model="editForm.prizeExtra.awardType" :label="item.value">{{ item.label }} </el-radio>
          </el-form-item>

          <el-form-item v-if="editForm.data.opentMatchType===1" label="奖励模型：" :required="true">
            <el-radio v-for="item in prizeModleSngCfgs" :key="item.value" v-model="editForm.prizeExtra.awardType" :label="item.value">{{ item.label }} </el-radio>
          </el-form-item>
          <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addRankRewards()">添加</el-button>
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
              width="450"
            >
              <template slot-scope="scope">
                <ul style="list-style: none;padding-inline-start: 0;">
                  <li v-for="gItem in scope.row.rewardItems" v-if="editForm.prizeExtra.awardType===0" :key="gItem.index" style="list-style: none;">
                    <span>金币奖励：</span>
                    <el-select v-model="gItem.getType" placeholder="请选择" size="mini" style="width:80px">
                      <el-option
                        v-for="item in getTypeCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-if="gItem.getType === 2" v-model="gItem.sceneId" placeholder="请选择投注金" size="mini" style="width:200px">
                      <el-option
                        v-for="scene in betScenesCfgs"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                    <el-select v-if="gItem.getType === 3" v-model="gItem.sceneId" placeholder="请选择返水金" size="mini" style="width:200px">
                      <el-option
                        v-for="scene in rebateScenesCfgs"
                        :key="scene.value"
                        :label="scene.label"
                        :value="scene.value"
                      />
                    </el-select>
                    <el-input v-model.number="gItem.getNum" style="width: 80px;" size="mini" placeholder="请填写获得数量" />
                  </li>
                  <li v-if="scope.row.propsReward != null" style="list-style: none;">
                    <span>道具奖励：</span>
                    <el-select v-model="scope.row.propsReward.propsId" placeholder="道具" size="mini" style="width:200px">
                      <el-option
                        v-for="item in matchPropsCfgs"
                        :key="item.propsId"
                        :label="item.propsName"
                        :value="item.propsId"
                      >
                        <img v-if="item.propsIcon != '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;">
                        <span>{{ item.propsShowName }}</span>
                      </el-option>
                    </el-select>
                    <el-input v-model.number="scope.row.propsReward.propsNum" style="width: 100px;" size="mini" placeholder="填数量" />
                  </li>
                  <li v-if="scope.row.propsReward != null && getPropsRewardItem(scope.row.propsReward.propsId,0,0).propsType === 2" style="list-style: none;">
                    <span>过期天数：</span>
                    <el-select v-model="scope.row.propsReward.propExpireDays" placeholder="过期天数" size="mini" style="width:200px">
                      <el-option
                        v-for="item in ITEM_DAY_TYPE_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              prop="startRank"
              label="名次区间"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.startRank" style="width: 80px;" size="mini" placeholder="开始名次" />至
                <el-input v-model.number="scope.row.endRank" style="width: 80px;" size="mini" placeholder="结束名次" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeRewardItme(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item v-if="editForm.prizeExtra.awardType === 1" label="选择模板：" :required="true">
            <el-select v-model="editForm.prizeExtra.prizeTemplateId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in prizeTemplateCfg"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="editForm.prizeExtra.awardType === 1" label="手续费率[百分比]：" :required="true">
            <el-input v-model.number="editForm.prizeExtra.prizeRate" style="width: 200px;" size="mini" placeholder="请填写手续费率数值" />
          </el-form-item>

          <el-form-item v-if="editForm.prizeExtra.awardType === 1" label="奖励类型" :required="true">
            <el-radio v-model.number="editForm.prizeExtra.rewardType" :label="1">金币</el-radio>
            <el-radio v-model.number="editForm.prizeExtra.rewardType" :label="3">返水金（无限制）</el-radio>
          </el-form-item>

        </fieldset>

        <fieldset>
          <legend>引导推荐</legend>
          <el-form-item label="游戏推荐方案：" :required="true">
            <el-select v-model="editForm.data.associateKey" placeholder="请选择" size="mini">
              <el-option
                v-for="item in guideShowCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="checkMatchGuidesDisable(editForm.appInfo[0].appId)"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="赛事分类：" :required="true">
            <el-select v-model="editForm.signExtra.matchEvents" placeholder="请选择" size="mini">
              <el-option
                v-for="item in MATCH_LIST_TAG_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </fieldset>

        <fieldset>
          <legend>数据中心上报</legend>
          <el-form-item label="是否上报数据中心：" :required="true">
            <el-switch
              v-model="editForm.data.dcReport"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </fieldset>

        <fieldset v-if="envProjectName === 'ph_audit'">
          <legend>OB线下赛入座 </legend>
          <el-form-item label="比赛玩家id列表：" :required="true">
            <div>
              <el-input v-model="editForm.uidObList" style="width: 400px;" placeholder="多个uid用,分开" />
            </div>
          </el-form-item>
        </fieldset>
        <el-divider />
        <el-form-item>
          <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveMatch()">保存比赛配置</el-button>
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
import { $libDate, $libShow } from '@/utils/common'
import AppInfo from '../../devTools/appInfo.vue'
import { log } from 'console'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { getAllCommonGameConfig, getAllMatchGuidesConfig } from '@/utils/common-game-config'
import { IsMars } from '@/utils/env'
import {
  CHANNEL_OPTIONS,
  APPID_OPTIONS,
  ITEM_DAY_TYPE_OPTIONS,
  PROP_TYPE_OPTIONS,
  MATCH_TABLE_SCENE_ID_CFG,
  MATCH_LIST_TAG_OPTIONS,
  MATCH_IUPSTREAM_TYPE_OPTIONS
} from '@/utils/options'

export default {
  name: 'MatchConfig',
  components: { Compare, Publish, DateTimeShow, ImagePicker },
  data() {
    return {
      envProjectName: process.env.VUE_APP_PROJECT,
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,
      PROP_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      APPID_OPTIONS,
      CHANNEL_OPTIONS,
      MATCH_TABLE_SCENE_ID_CFG,
      MATCH_LIST_TAG_OPTIONS,
      MATCH_IUPSTREAM_TYPE_OPTIONS,
      form: {
        gameId: MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS,
        status: -1,
        csId: -1,
        repeatType: -1,
        appId: -1
      },
      gameCfgs: [
        { 'value': MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS, 'label': 'tongits' }
        // {"value": 15, "label":"德州"}
      ],
      statusCfgs: [
        { 'value': 0, 'label': '启用' },
        { 'value': 1, 'label': '禁用' }
      ],
      repeatCfgs: [
        { 'value': 0, 'label': '单场', disabled: false },
        { 'value': 1, 'label': '单天单场循环', disabled: false },
        { 'value': 2, 'label': '单天多场循环', disabled: false }
      ],
      disappearCfgs: [
        { 'value': 0, 'label': '结束后' },
        { 'value': 1, 'label': '开赛后' }
      ],
      openMatchTypeCfgs: [
        { 'value': 2, 'label': '定时开赛', disabled: false },
        { 'value': 1, 'label': '人满即开', disabled: false }
      ],
      signUpTypeCfgs: [
        { 'value': 0, 'label': '付费报名' },
        { 'value': 1, 'label': '免费报名' },
        { 'value': 2, 'label': '纯门票' },
        { 'value': 3, 'label': '金币or门票' }
      ],

      RebuySignUpTypeCfgs: [
        { 'value': 0, 'label': '付费报名' },
        { 'value': 2, 'label': '纯门票' },
        { 'value': 3, 'label': '金币or门票' }
      ],
      getTypeCfgs: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],
      whileListCfgs: [
        { 'value': 0, 'label': '无白名单' },
        { 'value': 1, 'label': '有白名单' }
      ],
      // 返水金
      rebateScenesCfgs: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' },
        { 'value': 16, 'label': '没有任何限制的返水金【Tongits免费赛】' }
      ],
      // 投注金
      betScenesCfgs: [
        { 'value': 1, 'label': '任意游戏投注' },
        { 'value': 2, 'label': '仅限Poker类游戏投注' },
        { 'value': 3, 'label': '仅限Slots类游戏投注' },
        { 'value': 4, 'label': '仅限Tongits游戏投注' },
        { 'value': 15, 'label': '仅限GZ任意游戏投注金【Tongits免费赛】' }
      ],
      propsInfo: [ // 道具信息，暂时写死
        {
          'propsId': 0,
          'propsType': 0, // 1:门票 2:头像框 3:德州参数券 4:德州头像框
          'propsName': '无',
          'propsIcon': '',
          'propsAttr': ''
        }
      ],
      prizeModleCfgs: [
        { 'value': 0, 'label': '固定奖励' },
        { 'value': 1, 'label': '动态奖励' }
      ],
      prizeModleSngCfgs: [
        { 'value': 0, 'label': '固定奖励' },
      ],
      // 比赛全局ID集合
      matchUniqueIdCfgs: [
        { 'value': 0, 'label': '无' },
        { 'value': 10001, 'label': '188Free' },
        { 'value': 10002, 'label': '12888Free' },
        { 'value': 10003, 'label': 'P10' },
        { 'value': 10004, 'label': 'P20' },
        { 'value': 10005, 'label': 'P40' },
        { 'value': 10006, 'label': 'P100' },
        { 'value': 10007, 'label': 'P300' },
        { 'value': 10008, 'label': 'GTCC 2005' },
        { 'value': 10009, 'label': 'Yamaha Moto' }
      ],
      prizeTemplateCfg: [],
      matchPropsCfgs: [], // 比赛道具信息
      matchTicketsCfgs: [],
      csCfgs: [],
      showCsCfgs: [],
      guideCfgs: [], // 赛事推荐相关
      guideShowCfgs: [], // 赛事推荐相关 跟AppId 关联
      endMinuteCfgs: new Map(), // 打立阶段最大时长 用于配置检查
      endNumCfgs: new Map(), // 打立阶段结束规则剩余人数 用于配置检查
      promoteNumCfgs: new Map(), // 打立阶段晋级规则晋级人数 用于配置检查
      reachOutNumCfgs: new Map(), // 定局晋级人数
      growTotalNumCfgs: new Map(), // 打立阶段淘汰分轮数
      disuseScoreGrowDetail: new Map(), // 打立阶段淘汰分配置
      csExtraCfgs:new Map(),          //赛制拓展信息
      csIdCfg: [], // 赛制ID集合
      reubyGrowCfgs: [],
      tableData: [],
      limit: 100,
      total: 0,
      page: 1,
      editForm: {
        visable: false,
        title: '',
        isAdd: false,
        uidObList: '',
        data: {
          id: 0,
          name: '',
          gameId: 0,
          csId: 0,
          opentMatchType: 0,  //1:SNG 2:MTT
          opentMatchMember: 0,
          repeatType: 0,
          repeatDetail: '',
          disappearType: 0,
          signUpType: 0,
          signUpNum: 0,
          preShowSeconds: 0,
          preEnterSeconds: 0,
          delayEnterSeconds: 0,
          rankRewardsDetail: '',
          imagePath: '',
          openDaysLimit: 0,
          sort: 0,
          associateKey: '0',
          dcReport: 0,
          updateTime: 0
        },
        loopDetail: {
          // 只有一场
          onceTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
          // 循环多场
          loopStartDate: $libDate.GetDayBegin(new Date().setSeconds(0)),
          loopEndDate: $libDate.GetDayBegin(new Date().setSeconds(0)),
          intervalDay: 0,
          // 单场开始
          single: {
            stime: '',
            etime: ''
          },
          loopData: [
            {
              index: 1,
              stime: '',
              etime: '',
              intervalSeconds: 0
            }
          ]
        },
        rankRewards: this.initRankRewards(),
        appInfo: [
          {
            index: 1,
            appId: 1000002,
            channelId: []
          }
        ],
        whileList: {
          type: 0,
          data: ''
        },
        signExtra: {
          betCnt: 0,
          matchEvents: 0,
          matchUniqueId: 0,
          propId: 0, // 门票道具ID,
          propType: 0, // 道具类型,
          propCost: 0, // 道具价值
          propNum: 1, // 数量
          propName: '', // 道具名称
          matchMaxLimit: 0,
          walletReport: 0, // 电子钱包报表上报 0:上报 1:不上报
          reubyExtra: {
            supportRebuy: 0,
            reubyFree: 0,
            reubyCount: 0,
            reubyRound: 0,
            reubyScores: 0,
            reubySecs: 0,
            rebuySignType: 0,
            rebuyPropId: 0,
            rebuyPropNum: 0,
            rebuyPropCost: 0,
            rebuyPropType: 0,
            rebuyPropName: '',
            walletReport: 0 // 电子钱包报表上报 0:上报 1:不上报
          },
          gtccWhiteList: {
            type: 0,
            data: ''
          },
          obMatchList: ''
        },
        prizeExtra: {
          awardType: 0,
          prizeRate: 0,
          prizeTemplateId: 0,
          rewardType: 1,
          sceneId: 0
        },
        listExtra:{
          tableSceneId: 0,  //牌桌场景ID
        },
      },

      AttrNames: {
        appInfo: 'APP信息',
        matchCfgId: '赛事id',
        title: '赛事名称',
        gid: '游戏id',
        ruleId: '赛制id',
        startType: '开赛方式',
        startUserNum: '开赛人数',
        repeatType: '循环类型',
        disappearType: '消失时间点',
        startDateTime: '开始日期',
        finishDateTime: '结束日期',
        preShowSeconds: '提前展示比赛(秒)',
        preEnterSeconds: '提前进入比赛(秒)',
        delayEnterSeconds: '延迟进入比赛(秒)',
        signType: '报名方式(0:付费报名 1:免费报名 2:纯门票 3:金币or门票)',
        signNum: '报名费数量',
        status: '配置状态(0:启用 1:禁用)',
        rewardsCfg: '名次奖励',
        imagePath: '封面图片',
        whileList: '白名单',
        openDaysLimit: '每日限制',
        sort: '排序',
        repeatDelayDays: '间隔天数',
        daySections: '每日时段',
        awardType: '奖励类型',
        prizeExtra: '动态奖池信息',
        signExtra: '报名额外信息',
        associateKey: '推荐方案',
        dcReport: '是否上报数据中心',
        propsId: '道具ID',
        listExtra: '列表拓展信息',
      },
      singleCopy: {
        id: 0,
        isCopy: false
      },
      showDevTool: false,
      showTip: false,
      propsTypeList: [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET, PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME] // 门票 头像框
    }
  },
  computed: {
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
    if (!IsMars()) {
      this.getCsCfgsAsyncCheck()
      this.getPrizeTemplateCfgNew()
    } else {
      this.getCsCfgs()
      this.getPrizeTemplateCfg()
    }
    this.getGuideCfgs()
    if (!IsMars()) {
      this.getMatchProps()
    }
  },
  mounted() {
    this.getList()
    if (!IsMars()) {
      this.getMatchProps()
    }
    // 自动清理过期配置
  },
  methods: {
    initRankRewards() {
      return [
        {
          index: 1,
          startRank: 1,
          endRank: 1,
          rewardItems: [
            {
              index: 1,
              getType: 1,
              getPid: 0,
              getNum: 0,
              sceneId: 0 // 返水金投注金场景类型（调用营销接口时用）
            }
          ],
          propsReward: {
            propsId: 0,
            propsType: 0,
            propsName: '',
            propsIcon: '',
            propsAttr: '',
            propsNum: 0,
            propExpireDays: -1
          }
        }
      ]
    },
    changeRewardCfg() {
      // 判断是否是编辑
      if (this.editForm.data.id > 0) {
        // 判断修改时间 > 2025-07-01
        if (this.editForm.data.updateTime > 1751299200) {
          this.getAfterTypeCfgOptions()
          this.getAfterUpdatedSceneSelection()
        } else {
          this.getExistedTypeCfgOptions()
          this.getExistedSelections()
        }
      } else {
        this.getAfterTypeCfgOptions()
        this.getAfterUpdatedSceneSelection()
        // 新增的配置，把奖励信息重置
        this.editForm.rankRewards = this.initRankRewards()
      }
    },
    getExistedSelections() {
      this.betScenesCfgs = [{ 'value': 1, 'label': '任意游戏投注' },
        { 'value': 15, 'label': '仅限GZ任意游戏投注金【Tongits免费赛】' }]
      this.rebateScenesCfgs = [{ 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 16, 'label': '没有任何限制的返水金【Tongits免费赛】' }]
    },
    getAfterUpdatedSceneSelection() {
      if (this.editForm.data.signUpType == 1) { // 免费报名
        // 投注金
        this.betScenesCfgs = [
          { 'value': 15, 'label': '仅限GZ任意游戏投注金【Tongits免费赛】' }
        ]
        // 返水金
        this.rebateScenesCfgs = [
          { 'value': 16, 'label': '没有任何限制的返水金【Tongits免费赛】' }
        ]
      } else { // 付费报名
        // 投注金
        this.betScenesCfgs = [
          { 'value': 1, 'label': '任意游戏投注' }
        ]
        // 返水金
        this.rebateScenesCfgs = [
          { 'value': 5, 'label': '没有任何限制的返水金' }
        ]
      }
    },
    getExistedTypeCfgOptions() {
      this.getTypeCfgs = [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ]
    },
    getAfterTypeCfgOptions() {
      if (this.editForm.data.signUpType === 1) { // 免费报名
        this.getTypeCfgs = [
          { 'value': 1, 'label': '金币' },
          { 'value': 2, 'label': '投注金' }
        ]
      } else { // 付费报名
        this.getTypeCfgs = [
          { 'value': 1, 'label': '金币' },
          { 'value': 2, 'label': '投注金' },
          { 'value': 3, 'label': '返水金' }
        ]
      }
    },
    resetSearch() {
      this.form.gameId = -1
      this.form.status = -1
      this.form.csId = -1
      this.form.repeatType = -1
      this.form.appId = -1
    },
    getCsCfgs() {
      request({
        url: '/matchconfig/match/rule/list',
        method: 'get',
        data: {
          Env: this.env,
          Status: 0,
          PageNum: 1,
          PageSize: 200
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            for (var i = 0; i < objs.list.length; i++) {
              let gameId = parseInt(objs.list[i].game_id, 10)
              if (gameId === MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS) {
                this.csCfgs.push({
                  'label': '[' + objs.list[i].id + ']' + objs.list[i].name,
                  'value': objs.list[i].id,
                  'gameId': [parseInt(objs.list[i].game_id, 10)],
                  'ruleType': objs.list[i].rule_type
                })
                const stage_detail = JSON.parse(objs.list[i].stage_detail)
                // console.log("打立初级信息 ", stage_detail)
                for (var j = 0; j < stage_detail.length; j++) {
                  if (stage_detail[j].system_type === 1) { // 打立出局
                    // console.log("id:" + objs.list[i].id + " min:" + stage_detail[j].system_strike_out.end_rule.match_minute)
                    // 存储打立出局的最大时长配置 用于配置检查
                    this.endMinuteCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.end_rule.match_minute)
                    this.endNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.end_rule.lave_user_number)
                    this.promoteNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.promotion_rule.user_number)
                    this.growTotalNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.disuse_score_growth.grow_total)
                    this.disuseScoreGrowDetail.set(objs.list[i].id, stage_detail[j].system_strike_out.disuse_score_growth.disuse_score_grow_detail)
                    // console.log("disuseScoreGrowDetail",this.disuseScoreGrowDetail)
                  } else if (stage_detail[j].system_type === 2) {
                    // 存储定局信息
                    this.reachOutNumCfgs.set(objs.list[i].id, stage_detail[j].system_reach_out.round_config[0].promotion_user)
                  }
                }
              }
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
          AppId: this.form.appId,
          PageNum: this.page,
          PageSize: this.limit
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.total > 0) {
            this.total = objs.total
            this.tableData = []
            const tableDataCpy = objs.list
            if (tableDataCpy.length > 0) {
              for (let i = 0; i < tableDataCpy.length; i++) {
                if (tableDataCpy[i].game_id === MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS) {
                  let show_appinfo = ''
                  show_appinfo = this.filterMatchListByAppId(tableDataCpy[i].app_info_cfg)
                  if (show_appinfo !== '') {
                    tableDataCpy[i].show_appinfo = show_appinfo
                    tableDataCpy[i].openShow = tableDataCpy[i].status === 0
                    if (!tableDataCpy[i].hasOwnProperty('open_days_limit')) {
                      tableDataCpy[i].open_days_limit = 0
                    }
                    if (!tableDataCpy[i].hasOwnProperty('sort')) {
                      tableDataCpy[i].sort = 0
                    }
                    this.tableData.push(tableDataCpy[i])
                  }

                }
              }
            }
          } else {
            this.total = 0
            this.tableData = []
          }
        }
      })
    },
    getGuideCfgs() {
      getAllMatchGuidesConfig().then(data => {
        this.guideCfgs = []
        this.guideCfgs.push({
          'label': '无',
          'value': 0,
          'appId': 0
        })
        for (var i = 0; i < data.length; i++) {
          this.guideCfgs.push({
            'label': data[i].scheme_title,
            'value': data[i].associate_key,
            'appId': data[i].app_id
          })
        }
      })
    },
    checkMatchGuidesDisable(appId) {
      for (var i = 0; i < this.guideCfgs.length; i++) {
        if (this.guideCfgs[i].appId > 0 && this.guideCfgs[i].appId == appId) {
          return false
        }
      }
      return true
    },
    makeContent(key, addData, delData, editData) {
      // console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      const change = new Set()
      const add = new Set()
      const del = new Set()
      // 新增取newVal
      if (addData) {
        // console.log("addData",addData)
        for (var i = 0; i < addData.length; i++) {
          for (const ele of addData[i]) {
            if (ele.key == 'matchCfgId') {
              add.add(ele.newVal)
              console.log('add', ele.newVal)
            }
          }
        }
      }
      if (delData) {
        // console.log("delData",delData)
        for (var i = 0; i < delData.length; i++) {
          for (const ele of delData[i]) {
            if (ele.key == 'matchCfgId') {
              del.add(ele.oldVal)
              console.log('del', ele.oldVal)
            }
          }
        }
      }
      if (editData) {
        // console.log("editData",editData)
        for (const edit of editData) {
          change.add(edit.Head.matchCfgId)
          console.log(edit.Head.matchCfgId)
        }
      }
      if (change.size + del.size + add.size == 0) {
        console.log('no change return')
        return '没有修改!'
      }

      let str = ''
      let has = false
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---')
          has = true
          str += `\r\n修改： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
        if (del.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---')
          has = true
          str += `\r\n下架： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
        if (add.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---')
          has = true
          str += `\r\n上架： appid:【${row.show_appinfo}】。赛事ID:【${row.id}】`
          str += `\r\n${this.getGameName(row.game_id)} - ${this.getRepeatTypeShow(row.repeat_type)} - ${row.name}`
          str += `\r\n${new Date(row.start_time * 1000).toLocaleString()} - ${new Date(row.end_time * 1000).toLocaleString()}，${this.getSignUpName(row.sign_up_type, row.sign_up_num, row.sign_extra)}`
        }
      }
      return str
    },
    selectShowGuieds() {
      this.guideShowCfgs = []
      this.guideShowCfgs.push(
        {
          'label': '无',
          'value': 0,
          'appId': 0
        }
      )

      if (this.guideCfgs.length > 0) {
        for (var i = 0; i < this.guideCfgs.length; i++) {
          if (this.checkHaveAppId(this.guideCfgs[i].appId, this.editForm.appInfo)) {
            this.guideShowCfgs.push(this.guideCfgs[i])
          }
        }
      }
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
      var gameName = ''
      for (var i = 0; i < this.gameCfgs.length; i++) {
        if (this.gameCfgs[i].value == gameId) {
          gameName = this.gameCfgs[i].label
          break
        }
      }
      return gameName
    },
    getRepeatTypeShow(repeatType) {
      var show = ''
      for (var i = 0; i < this.repeatCfgs.length; i++) {
        if (this.repeatCfgs[i].value === repeatType) {
          show = this.repeatCfgs[i].label
          break
        }
      }
      return show
    },
    selectMatchGame() {
      console.log('selectMatchGame')
      this.showCsCfgs = []
      // 循环遍历是否存在gameId
      if (this.csCfgs.length > 0) {
        for (var i = 0; i < this.csCfgs.length; i++) {
          if (this.checkHaveGame(this.editForm.data.gameId, this.csCfgs[i].gameId)) {
            this.showCsCfgs.push(this.csCfgs[i])
          }
        }
      }
    },
    addLoopItem() {
      var index = 0
      if (this.editForm.loopDetail.loopData.length > 0) {
        index = this.editForm.loopDetail.loopData.length
      }
      index++
      this.editForm.loopDetail.loopData.push({
        index: index,
        stime: '',
        etime: '',
        intervalSeconds: 0
      })
    },
    removeLoopItem(index) {
      this.editForm.loopDetail.loopData.splice(index, 1)
      if (this.editForm.loopDetail.loopData.length > 0) {
        for (var i = 0; i < this.editForm.loopDetail.loopData.length; i++) {
          this.editForm.loopDetail.loopData[i].index = i + 1
        }
      }
    },
    addRankRewards() {
      var index = 0
      var maxRank = 0
      if (this.editForm.rankRewards.length > 0) {
        index = this.editForm.rankRewards.length
        for (var i = 0; i < this.editForm.rankRewards.length; i++) {
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
            getType: 1,
            getPid: 0,
            getNum: 0,
            sceneId: 0 // 返水金投注金场景类型（调用营销接口时用）
          }
        ],
        propsReward: {
          propsId: 0,
          propsType: 0,
          propsName: '',
          propsIcon: '',
          propsAttr: '',
          propExpireDays: -1
        }
      })
    },
    removeRewardItme(index) {
      this.editForm.rankRewards.splice(index, 1)
      if (this.editForm.rankRewards.length > 0) {
        for (var i = 0; i < this.editForm.rankRewards.length; i++) {
          this.editForm.rankRewards[i].index = i + 1
        }
      }
    },
    formatNum(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleOn(id, val) {
      this.$confirm('您确定要将该比赛配置上架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 启用配置
        let status = 0
        request({
          url: '/matchconfig/match/config/status',
          method: 'post',
          data: {
            Env: this.env,
            Id: id,
            Status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const showMsg = '启用赛事配置成功！'
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id == id) {
                this.tableData[i].openShow = val
                this.tableData[i].status = 0
                status = this.tableData[i].status
                break
              }
            }
            Message.success(showMsg)
            this.getList()
          } else {
            Message.error('更新状态失败：' + response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handleOff(id, val) {
      this.$confirm('您确定要将该比赛配置下架吗？<span style="color: red;">会对已显示的比赛下架，并且该配置不会再创建新比赛</span>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 禁用配置
        let status = 1
        request({
          url: '/matchconfig/match/config/status',
          method: 'post',
          data: {
            Env: this.env,
            Id: id,
            Status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const showMsg = '下架赛事配置成功！'
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id == id) {
                this.tableData[i].openShow = val
                this.tableData[i].status = 1
                status = this.tableData[i].status
                break
              }
            }
            Message.success(showMsg)
            this.getList()
          } else {
            Message.error('更新状态失败：' + response.Data)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    updateStatus(id, val) {
      if (val) {
        this.handleOn(id, val)
      } else {
        this.handleOff(id, val)
      }
    },
    showForm(id) {
      if (id === 0) {
        this.disableOpenType(false, 0)
        this.editForm.title = '新增比赛配置'
        this.editForm.data = {
          id: 0,
          name: '',
          gameId: 0,
          csId: 0,
          opentMatchType: 2,
          opentMatchMember: 0,
          repeatType: 0,
          repeatDetail: '',
          disappearType: 0,
          signUpType: 0,
          signUpNum: 0,
          preShowSeconds: 0,
          preEnterSeconds: 0,
          delayEnterSeconds: 0,
          rankRewardsDetail: '',
          status: 0,
          imagePath: '',
          openDaysLimit: 0,
          sort: 0,
          associateKey: 0,
          dcReport: 0
        }
        this.editForm.loopDetail = {
          // 只有一场
          onceTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
          // 循环多场
          loopStartDate: $libDate.GetDayBegin(new Date().setSeconds(0)),
          loopEndDate: $libDate.GetDayBegin(new Date().setSeconds(0)),
          intervalDay: 0,
          // 单场开始
          single: {
            stime: '',
            etime: ''
          },
          loopData: [
            {
              index: 1,
              stime: '',
              etime: '',
              intervalSeconds: 0
            }
          ]
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
                getType: 1,
                getPid: 0,
                getNum: 0,
                sceneId: 0 // 返水金投注金场景类型（调用营销接口时用）
              }
            ],
            propsReward: {
              propsId: 0,
              propsType: 0,
              propsName: '',
              propsIcon: '',
              propsAttr: '',
              propsNum: 0,
              propExpireDays: -1
            }
          }
        ]
        this.editForm.whileList = {
          type: 0,
          data: ''
        }

        this.editForm.signExtra = {
          betCnt: 0,
          matchEvents: 0,
          matchUniqueId: 0,
          propId: 0,
          propType: 0,
          propCost: 0,
          propNum: 1,
          propName: '',
          matchMaxLimit: 0,
          walletReport: 0,
          reubyExtra: {
            supportRebuy: 0,
            reubyFree: 0,
            reubyCount: 0,
            reubyRound: 0,
            reubyScores: 0,
            reubySecs: 0,
            rebuySignType: 0,
            rebuyPropId: 0,
            rebuyPropNum: 0,
            rebuyPropCost: 0,
            rebuyPropType: 0,
            rebuyPropName: ''
          },
          gtccWhiteList:{
            type:0,
            data:''
          },
          obMatchList: ''
        }

        this.editForm.prizeExtra = {
          awardType: 0,
          prizeRate: 0,
          prizeTemplateId: 0,
          rewardType: 1,
          sceneId: 0
        }
        this.editForm.listExtra ={
          tableSceneId:0,
        }
        this.editForm.isAdd = true
        this.showCsCfgs = this.csCfgs
        this.guideShowCfgs = this.guideCfgs
      } else {
        let editData = {}
        this.editForm.title = '编辑比赛配置'
        this.editForm.isAdd = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id == id) {
            editData = this.tableData[i]
            break
          }
        }
        if (typeof editData.id === 'undefined') {
          Message.error('比赛配置不存在')
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
          disappearType: editData.disappear_type,
          signUpType: editData.sign_up_type,
          signUpNum: editData.sign_up_num,
          preShowSeconds: editData.pre_show_seconds,
          preEnterSeconds: editData.pre_enter_seconds,
          delayEnterSeconds: editData.delay_enter_seconds,
          rankRewardsDetail: editData.rewards,
          status: editData.status,
          imagePath: editData.image_path,
          openDaysLimit: editData.open_days_limit,
          sort: editData.sort,
          associateKey: editData.associate_key,
          dcReport: editData.dc_report,
          updateTime: editData.update_time
        }
        /* 如果在本地找不到值 则显示0 */
        let isfind = false
        for (var i = 0; i < this.guideCfgs.length; i++) {
          if (this.guideCfgs[i].value === this.editForm.data.associateKey) {
            isfind = true
            break
          }
        }
        if (isfind === false) {
          this.editForm.data.associateKey = '0'
        }
        this.editForm.rankRewards = JSON.parse(editData.rewards)
        if (editData.while_list != '') {
          const whileList = JSON.parse(editData.while_list)
          this.editForm.whileList.type = whileList.type
          this.editForm.whileList.data = whileList.data
        }

        if (editData.repeat_type == 0) {
          this.editForm.loopDetail.onceTime = [new Date(editData.start_time * 1000), new Date(editData.end_time * 1000)]
        } else {
          const repeatDetail = JSON.parse(editData.repeat_detail)
          this.editForm.loopDetail.loopStartDate = $libDate.GetDayBegin(editData.start_time * 1000)
          this.editForm.loopDetail.loopEndDate = $libDate.GetDayBegin(editData.end_time * 1000)
          this.editForm.loopDetail.intervalDay = repeatDetail.intervalDay
          if (editData.repeat_type == 1) {
            // 单天单场
            this.editForm.loopDetail.single.stime = repeatDetail.msTime
            this.editForm.loopDetail.single.etime = repeatDetail.meTime
          } else {
            this.editForm.loopDetail.loopData = repeatDetail.loopData
          }
        }
        this.editForm.appInfo = JSON.parse(editData.app_info_cfg)
        this.editForm.signExtra = JSON.parse(editData.sign_extra)
        if (this.editForm.signExtra.reubyExtra === undefined) {
          this.rebuyConfigReset()
        }
        if (this.editForm.signExtra.gtccWhiteList === undefined) {
          this.editForm.signExtra.gtccWhiteList = {}
          this.editForm.signExtra.gtccWhiteList.type = 0
          this.editForm.signExtra.gtccWhiteList.data = ''
        }
        // ob线下赛录入的名单
        if (this.editForm.signExtra.obMatchList === undefined) {
          this.editForm.signExtra.obMatchList = ''
        }
        this.editForm.uidObList = this.editForm.signExtra.obMatchList

        this.editForm.prizeExtra = JSON.parse(editData.prize_extra)
        if (editData.list_extra !== null && editData.list_extra !== "null") {
          this.editForm.listExtra = JSON.parse(editData.list_extra)
        }
        this.showCsCfgs = []
        // 循环遍历是否存在gameId
        if (this.csCfgs.length > 0) {
          for (var i = 0; i < this.csCfgs.length; i++) {
            if (this.checkHaveGame(this.editForm.data.gameId, this.csCfgs[i].gameId)) {
              this.showCsCfgs.push(this.csCfgs[i])
            }
          }
        }
        this.disableOpenType(true, editData.open_match_type)
      }
      this.editForm.visable = true
      this.guideShowCfgs = []
      this.guideShowCfgs.push({
        'label': '无',
        'value': 0,
        'appId': 0
      })
      if (this.guideCfgs.length > 0) {
        for (var i = 0; i < this.guideCfgs.length; i++) {
          if (this.checkHaveAppId(this.guideCfgs[i].appId, this.editForm.appInfo)) {
            this.guideShowCfgs.push(this.guideCfgs[i])
          }
        }
      }
      this.getCurrCsGrowInfo()
      this.changeRewardCfg()
    },
    checkHaveGame(gid, gameArr) {
      let flag = false
      for (var i = 0; i < gameArr.length; i++) {
        if (gid == gameArr[i]) {
          flag = true
          break
        }
      }
      return flag
    },

    checkHaveAppId(appId, appInfo) {
      let flag = false
      for (var i = 0; i < appInfo.length; i++) {
        if (appId == appInfo[i].appId) {
          flag = true
          break
        }
      }
      return flag
    },
    async saveMatch() {
      if (this.editForm.data.opentMatchType == 1) {
        this.editForm.data.preEnterSeconds = this.editForm.data.preShowSeconds
      }
      if (!await this.configCheck()) {
        return
      }
      // 修复道具
      for (let i = 0; i < this.editForm.rankRewards.length; i++) {
        const element = this.editForm.rankRewards[i]
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          element.propsReward = this.getPropsRewardItem(element.propsReward.propsId, element.propsReward.propsNum, element.propsReward.propExpireDays)
        }
      }
      for (let i = 0; i < this.matchPropsCfgs.length; i++) {
        if (this.matchPropsCfgs[i].propsId === this.editForm.signExtra.propId) {
          this.editForm.signExtra.propType = this.matchPropsCfgs[i].propsType
          this.editForm.signExtra.propCost = this.matchPropsCfgs[i].propsCost
          this.editForm.signExtra.propName = this.matchPropsCfgs[i].propsName
          break
        }
      }

      for (let i = 0; i < this.matchPropsCfgs.length; i++) {
        if (this.matchPropsCfgs[i].propsId === this.editForm.signExtra.reubyExtra.rebuyPropId) {
          this.editForm.signExtra.reubyExtra.rebuyPropType = this.matchPropsCfgs[i].propsType
          this.editForm.signExtra.reubyExtra.rebuyPropCost = this.matchPropsCfgs[i].propsCost
          this.editForm.signExtra.reubyExtra.rebuyPropName = this.matchPropsCfgs[i].propsName
          break
        }
      }
      this.editForm.signExtra.obMatchList = this.editForm.uidObList
      const rankReward = JSON.stringify(this.editForm.rankRewards)
      const whileDetail = JSON.stringify(this.editForm.whileList)
      let repeatDetail = ''
      let bTime = 0
      let eTime = 0
      if (this.editForm.data.repeatType == 0) {
        // 单场
        if (this.editForm.loopDetail.onceTime) {
          bTime = Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)
          eTime = Math.floor(this.editForm.loopDetail.onceTime[1] / 1000)
          repeatDetail = JSON.stringify({ startTime: bTime, endTime: eTime })
        }
      } else {
        // 循环
        bTime = Math.floor(this.editForm.loopDetail.loopStartDate / 1000)
        eTime = Math.floor(this.editForm.loopDetail.loopEndDate / 1000) + (86400 - 1) // 结束日期为当天23:59:59
        const intervalDay = this.editForm.loopDetail.intervalDay
        if (this.editForm.data.repeatType == 1) {
          repeatDetail = JSON.stringify({
            startTime: bTime,
            endTime: eTime,
            intervalDay: intervalDay,
            msTime: this.editForm.loopDetail.single.stime,
            meTime: this.editForm.loopDetail.single.etime
          })
        } else {
          repeatDetail = JSON.stringify({
            startTime: bTime,
            endTime: eTime,
            intervalDay: intervalDay,
            loopData: this.editForm.loopDetail.loopData
          })
        }
      }
      request({
        url: '/matchconfig/match/config/create',
        method: 'POST',
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
          DisappearType: this.editForm.data.disappearType,
          RepeatDetail: repeatDetail,
          ImagePath: this.editForm.data.imagePath,
          Modifier: this.$store.getters.name,
          WhileList: whileDetail,
          PreShowSeconds: this.editForm.data.preShowSeconds,
          PreEnterSeconds: this.editForm.data.preEnterSeconds,
          DelayEnterSeconds: this.editForm.data.delayEnterSeconds,
          OpenDaysLimit: this.editForm.data.openDaysLimit,
          Sort: this.editForm.data.sort,
          AssociateKey: this.editForm.data.associateKey,
          DcReport: this.editForm.data.dcReport,
          SignExtra: JSON.stringify(this.editForm.signExtra),
          PrizeExtra: JSON.stringify(this.editForm.prizeExtra),
          ListExtra: JSON.stringify(this.editForm.listExtra)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let showMsg = '新增比赛配置成功！'
          if (this.editForm.data.id > 0) {
            showMsg = '编辑比赛配置成功！'
          }
          Message.success(showMsg)
          this.getList()
          this.editForm.visable = false
          this.singleCopy.isCopy = false
          this.singleCopy.id = 0
          this.editForm.uidObList = ''
          return
        } else {
          let errMsg = '新增比赛配置失败！'
          if (this.editForm.data.id > 0) {
            errMsg = '编辑比赛配置失败！'
          }
          Message.error(errMsg + response.Data)
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
              Id: id
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('复制比赛配置成功！')
              this.getList()
              this.singleCopy.isCopy = true
              this.singleCopy.id = id
              return
            } else {
              Message.error('复制比赛配置失败：' + response.Data)
              return
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    copyAll() {
      this.$confirm('确定要复制所有今天的比赛到明天吗？', '提醒')
        .then(() => {
          request({
            url: '/matchconfig/match/config/copy/today',
            method: 'post',
            data: {}
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('复制所有今天比赛到明天成功！')
              this.getList()
              return
            } else {
              Message.error('复制比赛配置失败：' + response.Data)
              return
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    expireAll() {
      this.$confirm('您确定要将今天之前的比赛下架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/matchconfig/match/config/status/all',
          method: 'post',
          data: {}
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('下架今天之前比赛配置成功！')
            this.getList()
          } else {
            Message.error('下架今天之前比赛配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    deleteAllOff() {
      this.$confirm('您确定要清理所有已下架的比赛配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/matchconfig/match/config/delete/alloff',
          method: 'post',
          data: {}
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('清理已下架的比赛配置成功！')
            this.getList()
          } else {
            Message.error('清理已下架的比赛配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDelete(id) {
      // 在v-if处已限制，只有已下架的比赛可以删除
      this.$confirm('您确定要将该比赛配置删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/matchconfig/match/config/delete',
          method: 'post',
          data: {
            Env: this.env,
            Id: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除比赛配置成功！')
            this.getList()
          } else {
            Message.error('删除比赛配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    async getMatchProps() {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/match/props/config/list',
            PropType: 0
          }
        })
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.matchPropsCfgs = [
              {
                'propsId': 0,
                'propsType': 0,
                'propsName': '无',
                'propsIcon': '',
                'propsAttr': '',
                'propsCost': '',
                'propsShowName': ''
              }
            ]
            this.matchTicketsCfgs = []
            var timestamp = Date.parse(new Date()) / 1000
            for (let i = 0; i < objs.list.length; i++) {
              if (this.propsTypeList.includes(objs.list[i].item_type)) {
                if (objs.list[i].status === 1 && ((objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET && objs.list[i].expire_time > timestamp) ||
                  objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME)) {
                  let str = objs.list[i].item_name
                  if (objs.list[i].show_name.length > 0) {
                    str = str + '(' + objs.list[i].show_name + ')'
                  }
                  this.matchPropsCfgs.push({
                    'propsType': objs.list[i].item_type,
                    'propsId': objs.list[i].id,
                    'propsName': objs.list[i].item_name,
                    'propsIcon': objs.list[i].image,
                    'propsAttr': objs.list[i].item_describe,
                    'propsCost': objs.list[i].item_cost,
                    'propsShowName': str
                  })
                  if (objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET) { // Tongits 门票
                    this.matchTicketsCfgs.push({
                      'label': str,
                      'value': objs.list[i].id
                    })
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      } finally {}
    },
    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    handleShowDevTools() {
      // 浏览器设置ShowDev=1才可以看到开发工具
      if (window.ShowDev == 1) {
        this.showDevTool = !this.showDevTool
      }
    },
    timeToSec(time) {
      var s = ''
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]

      s = Number(hour * 3600) + Number(min * 60) + Number(sec)

      return s
    },
    async configCheck() {
      if (this.editForm.data.gameId === 0) {
        this.errmsg('请选择游戏')
        return false
      }

      if (this.editForm.appInfo[0].channelId.length === 0) {
        this.errmsg('请先选择渠道ID')
        return false
      }
      if (this.editForm.data.signUpType === 1) {
        // 如果是免费报名，重置报名费数量为0
        this.editForm.data.signUpNum = 0
      }else{
        this.editForm.data.openDaysLimit = 0
        this.editForm.signExtra.betCnt = 0
      }

      if (this.editForm.data.openDaysLimit > 0 && this.editForm.data.signUpType != 0) {
        this.errmsg('每日限制已经开启')
      }
      // 付费赛
      if (this.editForm.data.signUpType === 0) {
        if (this.editForm.data.signUpNum === 0) {
          this.errmsg('付费赛报名费不能为0')
          return false
        }
        this.editForm.signExtra.propId = 0
        this.editForm.signExtra.propType = 0
        this.editForm.signExtra.propCost = 0
        this.editForm.signExtra.propNum = 0
      }
      if (this.editForm.data.signUpType === 1 && this.editForm.prizeExtra.awardType == 1) {
        this.errmsg('当前选择的是免费赛,不能选择动态奖池分配模式')
        return false
      }
      if (!await this.propCheck()) {
        return false
      }

      if (this.editForm.whileList.type == 1) {
        // 如果开启白名单，则白名单不可为空
        if (this.editForm.whileList.data == '') {
          this.errmsg('白名单不可为空！')
          return false
        }
      }
      if(this.editForm.signExtra.gtccWhiteList.type === 1) {
        if (this.editForm.signExtra.gtccWhiteList.data === '') {
          this.errmsg('白名单不可为空')
          return false
        }
      }else{
        this.editForm.signExtra.gtccWhiteList.data = ''
      }

      if (this.editForm.data.repeatType == 1) {
        if (Math.floor(this.timeToSec(this.editForm.loopDetail.single.etime)) - Math.floor(this.timeToSec(this.editForm.loopDetail.single.stime)) < 600) {
          this.errmsg('比赛开始结束间隔要大于10分钟！')
          return false
        }
        if (this.editForm.loopDetail.single.etime == '' || this.editForm.loopDetail.single.stime == '') {
          this.errmsg('开赛时间不能为空')
          return false
        }
      }

      if (this.editForm.data.repeatType != 0) {
        if (this.editForm.loopDetail.intervalDay < 0) {
          this.errmsg('循环赛间隔天数需要设置大于等于0（最小为0表示每天创建）！')
          return false
        }
      }

      if (this.editForm.data.repeatType == 2) {
        if (this.editForm.loopDetail.loopData.length > 0) {
          for (var i = 0; i < this.editForm.loopDetail.loopData.length; i++) {
            if ((Math.floor(this.timeToSec(this.editForm.loopDetail.loopData[i].etime)) - Math.floor(this.timeToSec(this.editForm.loopDetail.loopData[i].stime))) < 600) {
              this.errmsg('比赛开始结束间隔要大于10分钟！')
              return false
            }

            if (this.editForm.loopDetail.loopData[i].intervalSeconds < 120) {
              this.errmsg('循环赛间隔时间至少大于120秒（2分钟）！')
              return false
            }
            if (this.editForm.loopDetail.loopData[i].etime == '' || this.editForm.loopDetail.loopData[i].stime == '') {
              this.errmsg('循环赛开始时间 结束时间不能为空')
              return false
            }
          }
        }
      }

      if ((this.editForm.data.repeatType != 0) && ((Math.floor(this.editForm.loopDetail.loopEndDate / 1000) < Math.floor(this.editForm.loopDetail.loopStartDate / 1000)))) {
        this.errmsg('循环赛比赛结束时间需要大于比赛开始时间！')
        return false
      }
      if (this.editForm.data.opentMatchMember <= 0) {
        this.errmsg('开赛人数值无效！')
        return false
      } else if (this.editForm.data.opentMatchMember % 3 != 0) {
        this.errmsg('开赛人数值必须是3的倍数！')
        return false
      } else if (this.editForm.signExtra.matchMaxLimit > 0 && this.editForm.signExtra.matchMaxLimit < this.editForm.data.opentMatchMember) {
        this.errmsg('报名最大限制必须大于最低开赛人数')
        return false
      } else if ((this.editForm.data.repeatType == 0) && ((Math.floor(this.editForm.loopDetail.onceTime[1] / 1000) - Math.floor(this.editForm.loopDetail.onceTime[0] / 1000)) < 600)) {
        this.errmsg('比赛开始结束间隔要大于10分钟！')
        return false
      } else if (this.editForm.data.signUpNum < 0) {
        this.errmsg('报名费数值不能小于零')
        return false
      } else if (this.editForm.data.csId <= 0) {
        this.errmsg('赛制选择不能为空')
        return false
      } else {
        // 获取打立阶段最大时长
        const endMin = this.endMinuteCfgs.get(this.editForm.data.csId)
        if ((endMin > 0) && ((this.editForm.data.delayEnterSeconds / 60) > endMin)) {
          this.errmsg('延迟进入时间不能大于打立出局阶段总时长')
          return false
        }

        const endNum = this.endNumCfgs.get(this.editForm.data.csId)
        const promoteNum = this.promoteNumCfgs.get(this.editForm.data.csId)
        const ruleExtra = this.csExtraCfgs.get(this.editForm.data.csId)

        if (this.editForm.data.opentMatchType == 2 && this.editForm.data.opentMatchMember < endNum) {
          if(ruleExtra == null || ruleExtra.skip_strikeout == 0) { //跳过打立阶段赛事不做数值检查
            this.errmsg('开赛人数不能小于打立出局的结束规则的剩余人数')
            return false
          }
        }

        if (this.editForm.data.opentMatchType == 2 && this.editForm.data.opentMatchMember < promoteNum) {
          if(ruleExtra == null || ruleExtra.skip_strikeout == 0) { //跳过打立阶段赛事不做数值检查
            this.errmsg('开赛人数不能小于打立出局的晋级规则的晋级人数')
            return false
          }
        }
        if (this.editForm.data.opentMatchType == 1) {
          const promotion_user_num = this.reachOutNumCfgs.get(this.editForm.data.csId)
          if (this.editForm.data.opentMatchMember < promotion_user_num) {
            this.errmsg('开赛人数不能小于定局第一阶段的晋级人数')
            return false
          }
        }
        if (this.editForm.data.opentMatchType == 1 && this.editForm.data.disappearType != 1) {
          this.errmsg('sng比赛必须开赛后消失')
          return false
        }
      }

      // 验证固定奖励的配置项
      this.editForm.prizeExtra.rewardType = parseInt(this.editForm.prizeExtra.rewardType)
      if (this.editForm.prizeExtra.awardType === 0) {
        this.editForm.prizeExtra.rewardType = 1
        this.editForm.prizeExtra.sceneId = 0
        if (!await this.checkRewardCfg(this.editForm.rankRewards)) {
          return false
        }
      }
      if (this.editForm.prizeExtra.awardType === 1) {
        if (!await this.checkDynamicRewardCfg(this.editForm.rankRewards)) {
          return false
        }
      }
      if (this.editForm.prizeExtra.awardType == 1 && this.editForm.prizeExtra.prizeTemplateId == 0) {
        this.errmsg('当前是动态奖池，请选择模板')
        return false
      }
      if ((this.editForm.prizeExtra.awardType == 1) && (this.editForm.prizeExtra.prizeRate < 1 || this.editForm.prizeExtra.prizeRate >= 100)) {
        this.errmsg('当前是动态奖池手续费率范围是[1-100)')
        return false
      }

      if (this.editForm.prizeExtra.awardType === 1) {
        // 目前动态奖池只有真金和返水金
        if (this.editForm.prizeExtra.rewardType === 2) {
          this.editForm.prizeExtra.rewardType = 3
        }
        // 动态奖池奖励里诶行如果是返水金，填充返水金类型
        if (this.editForm.prizeExtra.rewardType === 3) {
          this.editForm.prizeExtra.sceneId = 5 // 没有任何限制的返水金
        }
      }
      //mtt 才检测提前显示时间
      if (this.editForm.data.opentMatchType===2 && (this.editForm.data.preShowSeconds <= 0 || this.editForm.data.preEnterSeconds <= 0)) {
        this.errmsg('提前进入时间 或者是提前显示时间不能配置为0')
        return false
      }

      if (!this.reubyConfigCheck()) {
        return false
      }
      if (this.envProjectName === 'ph_audit') {
        if (this.editForm.uidObList.length > 0) {
          const arrStr = this.editForm.uidObList.split(',')
          console.log("+++++++++++++++arrStr+++++++++++++++:%d", arrStr.length)
          console.log("+++++++++++++++opentMatchMember+++++++++++++++:%d", this.editForm.data.opentMatchMember)
          if (arrStr.length !== this.editForm.data.opentMatchMember) {
            this.errmsg('开赛人数不等与配置表数量')
            return false
          }
        }
      }

      return true
    },

    async checkRewardCfg(rewards) {
      if (rewards.length <= 0) {
        this.errmsg('请添加固定奖励配置')
        return false
      }
      // 前三名单独检测
      var topThree = []
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank === element.endRank && element.startRank <= 3) {
          topThree.push(element.startRank)
        }
      }
      if(topThree.length ===0){
        this.errmsg('至少需要配一名奖励,且请以1-1,2-2,3-3的格式配')
        return false
      }
      for(let i=0;i<topThree.length-1;i++){
        if(topThree[i]+1 !== topThree[i+1]){
          this.errmsg('奖励名次必须是从第一名开始连续配置,且请以1-1,2-2,3-3的格式配')
          return false
        }
      }

      // 遍历配置项
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank <= 0 || element.endRank < element.startRank) {
          this.errmsg('请填写正确的排名')
          return false
        }
        if (element.startRank <= 3 && element.startRank !== element.endRank) {
          this.errmsg('奖励前三名需要单独配，名次区间请配置成：1-1  2-2 3-3')
          return false
        }
        if (element.startRank >= 4 && topThree.length < 3) {
          this.errmsg('前三名必须配,且请以1-1,2-2,3-3的格式配')
          return false
        }
        if (element.startRank >= 4 &&  element.startRank <= rewards[index-1].endRank) {
          this.errmsg('名次配置必须连续')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.hasOwnProperty('rewardItems') && element.propsReward.propsId <= 0 && element.rewardItems[0].getNum <= 0) {
          this.errmsg('当前名次没有配任何奖励,请检查')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 && (element.propsReward.propsNum === 0 || element.propsReward.propsNum === undefined)) {
          this.errmsg('名次[' + element.startRank + '-' + element.endRank + ']' + '项请填写道具数量')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 &&
          this.getPropsRewardItem(element.propsReward.propsId, 0, 0).propsType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME && element.propsReward.propExpireDays < 0) {
          this.errmsg('请选择头像框过期时间')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          if (!await this.propTakeEffectCheck(element.propsReward.propsId)) {
            this.errmsg('所选择的道具不生效,请检查')
            return false
          }
        }
        if (element.rewardItems.length == 0) {
          this.errmsg('请添加奖励配置')
          return false
        }
        // 遍历奖励配置项
        for (let i = 0; i < element.rewardItems.length; i++) {
          const rewardItem = element.rewardItems[i]
          if (rewardItem.getType == 1) {
            element.rewardItems[i].sceneId = 0
          } else if (rewardItem.getType == 2) {
            if (!this.isInBetScenes(rewardItem.sceneId)) {
              this.errmsg('名次[' + element.startRank + '-' + element.endRank + ']第' + rewardItem.index + '项请正确选择投注金')
              return false
            }
          } else if (rewardItem.getType == 3) {
            if (!this.isInRebateScenes(rewardItem.sceneId)) {
              this.errmsg('名次[' + element.startRank + '-' + element.endRank + ']第' + rewardItem.index + '项请正确选择返水金')
              return false
            }
          }
        }
      }
      return true
    },

    async checkDynamicRewardCfg(rewards) {
      // 前三名单独检测
      var topThree = []
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank === element.endRank && element.startRank <= 3) {
          topThree.push(element.startRank)
        }
      }
      if(topThree.length ===0){
        this.errmsg('至少需要配一名奖励,且请以1-1,2-2,3-3的格式配')
        return false
      }
      for(let i=0;i<topThree.length-1;i++){
        if(topThree[i]+1 !== topThree[i+1]){
          this.errmsg('奖励名次必须是从第一名开始连续配置,且请以1-1,2-2,3-3的格式配')
          return false
        }
      }

      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank <= 0 || element.endRank < element.startRank) {
          this.errmsg('请填写正确的排名')
          return false
        }
        if (element.startRank <= 3 && element.startRank !== element.endRank) {
          this.errmsg('奖励前三名需要单独配，名次区间请配置成：1-1  2-2 3-3')
          return false
        }
        if (element.startRank >= 4 && topThree.length < 3) {
          this.errmsg('前三名必须配,且请以1-1,2-2,3-3的格式配')
          return false
        }
        if (element.startRank >= 4 &&  element.startRank <= rewards[index-1].endRank) {
          this.errmsg('名次配置必须连续')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 && (element.propsReward.propsNum === 0 || element.propsReward.propsNum === undefined)) {
          this.errmsg('请选择道具或者填写道具数量')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 &&
          this.getPropsRewardItem(element.propsReward.propsId, 0, 0).propsType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME && element.propsReward.propExpireDays < 0) {
          this.errmsg('请选择头像框过期时间')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          if (!await this.propTakeEffectCheck(element.propsReward.propsId)) {
            this.errmsg('所选择的道具不生效,请检查')
            return false
          }
        }
      }
      return true
    },
    isInRebateScenes(scene) {
      for (let index = 0; index < this.rebateScenesCfgs.length; index++) {
        if (this.rebateScenesCfgs[index].value == scene) {
          return true
        }
      }
      return false
    },
    isInBetScenes(scene) {
      for (let index = 0; index < this.betScenesCfgs.length; index++) {
        if (this.betScenesCfgs[index].value == scene) {
          return true
        }
      }
      return false
    },
    disableOpenType(isDisable, enableType) {
      if (isDisable) {
        for (let index = 0; index < this.openMatchTypeCfgs.length; index++) {
          if (this.openMatchTypeCfgs[index].value == enableType) {
            this.openMatchTypeCfgs[index].disabled = false
          } else {
            this.openMatchTypeCfgs[index].disabled = true
          }
        }
      } else {
        for (let index = 0; index < this.openMatchTypeCfgs.length; index++) {
          this.openMatchTypeCfgs[index].disabled = false
        }
      }
    },
    checkRepeatDisable(val) {
      if (this.editForm.data.id > 0) {
        return true
      }
      if (this.editForm.data.opentMatchType == 1) {
        if (val == 1 || val == 2) {
          return true
        }
      }
      return false
    },
    getMatchStartTimeLabel() {
      if (this.editForm.data.opentMatchType == 2) {
        return '开赛时间'
      } else {
        return '最后开赛时间'
      }
    },
    checkMatchRuleDisable(val) {
      for (let i = 0; i < this.csCfgs.length; i++) {
        if (this.csCfgs[i].value == val) {
          if (this.editForm.data.opentMatchType == 1) {
            if (this.csCfgs[i].ruleType != 1) {
              return true
            } else {
              return false
            }
          } else if (this.editForm.data.opentMatchType == 2) {
            if (this.csCfgs[i].ruleType != 0) {
              return true
            } else {
              return false
            }
          }
        }
      }
      return false
    },
    getPropsRewardItem(pid, propsNum, expireDays) {
      const one = {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: propsNum,
        propCost: 0,
        propExpireDays: expireDays,
        propsShowName: ''
      }
      for (let i = 0; i < this.matchPropsCfgs.length; i++) {
        const element = this.matchPropsCfgs[i]
        if (element.propsId === pid) {
          one.propsId = element.propsId
          one.propsType = element.propsType
          one.propsName = element.propsName
          one.propsIcon = element.propsIcon
          one.propsAttr = element.propsAttr
          one.propCost = element.propsCost
          one.propsShowName = element.propsShowName
          break
        }
      }
      return one
    },
    repeatLoopDisabled() {
      if (this.editForm.data.repeatType === 2 && !this.editForm.isAdd && !this.singleCopy.isCopy) {
        return true
      }
      return false
    },
    getPrizeTemplateCfg() {
      request({
        url: '/matchprizeconfig/match/prize/list',
        method: 'get',
        data: {
          Env: this.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.prizeTemplateCfg = []
            for (var i = 0; i < objs.total; i++) {
              this.prizeTemplateCfg.push({
                'label': objs.list[i].Name,
                'value': objs.list[i].ID
              })
            }
          }
        }
      })
    },

    getPrizeTemplateCfgNew() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/prize/template'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.prizeTemplateCfg = []
            for (var i = 0; i < objs.total; i++) {
              this.prizeTemplateCfg.push({
                'label': objs.list[i].title,
                'value': objs.list[i].id
              })
            }
          }
        }
      })
    },

    checkListSort() {
      // 检测列表排序值
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sort == this.editForm.data.sort) {
          this.showTip = true
          return
        }
      }
      this.showTip = false
    },
    // 在这里实现APPID过滤
    filterMatchListByAppId(appInfo) {
    // 在这里实现APPID过滤
      let show_appinfo = ''
      const appInfoTemp = JSON.parse(appInfo)
      for (let i = 0; i < appInfoTemp.length; i++) {
        if (this.form.appId > 0 && this.form.appId !== appInfoTemp[i].appId) continue
        if (i === 0) {
          show_appinfo += appInfoTemp[i].appId + ' '
        } else {
          show_appinfo += '  ' + appInfoTemp[i].appId + ' '
        }
        show_appinfo += appInfoTemp[i].channelId
      }
      return show_appinfo
    },
    // 道具检测
    async propCheck() {
      if (this.editForm.data.signUpType === 2 || this.editForm.data.signUpType === 3) {
        if (this.editForm.signExtra.propId > 0) {
          if (!await this.propTakeEffectCheck(this.editForm.signExtra.propId)) {
            this.errmsg('所选择的道具不生效')
            return false
          }
        }
      }
      // 金币or门票报名
      if (this.editForm.data.signUpType === 3) {
        if (this.editForm.data.signUpNum === 0) {
          this.errmsg('付费赛报名费不能为0')
          return false
        }
        if (this.editForm.signExtra.propId === 0) {
          this.errmsg('金币or门票报名 必须选择门票')
          return false
        }
      }
      // 纯门票报名
      if (this.editForm.data.signUpType === 2) {
        this.editForm.data.signUpNum = 0
        if (this.editForm.signExtra.propId === 0) {
          this.errmsg('门票报名 必须选择门票')
          return false
        }
      }
      // reuby 道具检测
      if ((this.editForm.signExtra.reubyExtra.rebuySignType === 2 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) && this.editForm.signExtra.reubyExtra.rebuyPropId > 0) {
        if (!await this.propTakeEffectCheck(this.editForm.signExtra.reubyExtra.rebuyPropId)) {
          this.errmsg('Reuby所选择的道具不生效')
          return false
        }
      }
      return true
    },

    async propTakeEffectCheck(propId) {
      await this.getMatchProps()
      return await this.PropIsPublish(propId)
    },
    async PropIsPublish(propId) {
      if (propId > 0) {
        for (let i = 0; i < this.matchPropsCfgs.length; i++) {
          if (propId === this.matchPropsCfgs[i].propsId) {
            return true
          }
        }
      }
      return false
    },
    getSignUpName(signUpType, signUpNum, sign_extra) {
      // console.log(signUpType,signUpNum,sign_extra)
      for (const i in this.signUpTypeCfgs) {
        if (this.signUpTypeCfgs[i].value === signUpType) {
          if (signUpType === 0) { // 付费报名
            return this.signUpTypeCfgs[i].label + this.getCostName(signUpNum)
          } else if (signUpType === 1) { // 免费报名
            return this.signUpTypeCfgs[i].label
          } else if (signUpType === 2) { // 纯门票
            return this.signUpTypeCfgs[i].label + this.getTicketName(sign_extra)
          } else if (signUpType === 3) { // 金币or门票
            return this.signUpTypeCfgs[i].label + this.getCostName(signUpNum) + this.getTicketName(sign_extra)
          }
        }
      }
      return '未知报名方式'
    },
    getCostName(signUpNum) {
      if (signUpNum > 0) {
        return `，₱${signUpNum}`
      }
      return ''
    },
    getTicketName(sign_extra) {
      const data = JSON.parse(sign_extra)
      return ' ' + data.propName + 'x' + data.propNum
    },
    // 根据赛制ID 取打立出局的轮数信息
    getCurrCsGrowInfo() {
      var grow_total = this.growTotalNumCfgs.get(this.editForm.data.csId)
      this.reubyGrowCfgs = []
      for (let i = 0; i < grow_total - 1; i++) {
        this.reubyGrowCfgs.push({
          'label': i + 1 + '轮',
          'value': i + 1
        }
        )
      }
      // var disuseScores = this.disuseScoreGrowDetail.get(this.editForm.data.csId)
      // console.log("disuseScores",disuseScores)
      // console.log("reubyGrowCfgs",this.reubyGrowCfgs)
    },
    // reuby 配置检测
    rebuyConfigReset() {
      this.editForm.signExtra.reubyExtra = {}
      this.editForm.signExtra.reubyExtra.supportRebuy = 0
      this.editForm.signExtra.reubyExtra.reubyFree = 0
      this.editForm.signExtra.reubyExtra.reubyRound = 0
      this.editForm.signExtra.reubyExtra.reubyScores = 0
      this.editForm.signExtra.reubyExtra.reubySecs = 0
      this.editForm.signExtra.reubyExtra.reubyCount = 0
      this.editForm.signExtra.reubyExtra.rebuySignType = 0
      this.editForm.signExtra.reubyExtra.rebuyPropId = 0
      this.editForm.signExtra.reubyExtra.rebuyPropNum = 0
      this.editForm.signExtra.reubyExtra.rebuyPropCost = 0
      this.editForm.signExtra.reubyExtra.rebuyPropType = 0
      this.editForm.signExtra.reubyExtra.rebuyPropName = ''
    },
    reubyConfigCheck() {
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 0) {
        this.rebuyConfigReset()
        return true
      }
      // 免费赛配buy 规则不允许
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1 && this.editForm.data.signUpType === 1) {
        this.rebuyConfigReset()
        this.errmsg('免费报名不支持rebuy')
        return false
      }
      // 纯门票报名比赛 不支持rebuy
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1 && this.editForm.data.signUpType === 2) {
        this.rebuyConfigReset()
        this.errmsg('纯门票报名比赛不支持rebuy')
        return false
      }
      if (this.editForm.signExtra.reubyExtra.supportRebuy === 0 || this.editForm.data.signUpType === 1) {
        this.rebuyConfigReset()
      }

      if (this.editForm.signExtra.reubyExtra.supportRebuy === 1) {
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 0) {
          this.editForm.signExtra.reubyExtra.rebuyPropNum = 0
          this.editForm.signExtra.reubyExtra.rebuyPropId = 0
          this.editForm.signExtra.reubyExtra.rebuyPropCost = 0
        }
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 2) {
          this.editForm.signExtra.reubyExtra.reubyFree = 0
        }
        if (this.editForm.signExtra.reubyExtra.reubyRound === 0 ||
          this.editForm.signExtra.reubyExtra.reubyScores === 0 || this.editForm.signExtra.reubyExtra.reubySecs === 0 ||
          this.editForm.signExtra.reubyExtra.reubyCount === 0) {
          this.errmsg('reuby配置有错,请检查')
          return false
        }
        // 付费 或者金币or门票
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 0 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) {
          if (this.editForm.signExtra.reubyExtra.reubyFree <= 0) {
            this.errmsg('当前是付费或者金币or门票reuby 报名费用不能为0')
            return false
          }
          if ((this.editForm.data.signUpType === 0 || this.editForm.data.signUpType === 3) && this.editForm.data.signUpNum !== this.editForm.signExtra.reubyExtra.reubyFree) {
            this.errmsg('当前是付费或者金币or门票reuby rebuy费用跟报名费不一致,请检查')
            return false
          }
        }
        // 纯门票 或者金币or门票
        if (this.editForm.signExtra.reubyExtra.rebuySignType === 2 || this.editForm.signExtra.reubyExtra.rebuySignType === 3) {
          if (this.editForm.signExtra.reubyExtra.rebuyPropId <= 0 || this.editForm.signExtra.reubyExtra.rebuyPropNum <= 0) {
            this.errmsg('当前是纯门票或者 金币or门票reuby 请选择门票或者填门票数量')
            return false
          }
        }
      }
      // 买入积分检测
      var disuseScores = this.disuseScoreGrowDetail.get(this.editForm.data.csId)
      for (var i = 0; i < disuseScores.length; i++) {
        if (disuseScores[i].index === this.editForm.signExtra.reubyExtra.reubyRound && this.editForm.signExtra.reubyExtra.reubyScores < disuseScores[i].disuse_score) {
          this.errmsg('买入积分小于当前打立阶段轮数淘汰分[' + disuseScores[i].disuse_score + '],请检查配置')
          return false
        }
      }
      if (this.reubyGrowCfgs.length <= this.editForm.signExtra.reubyExtra.reubyRound) {
        this.errmsg('rebuy截止轮次大于当前赛制打立阶段的最大轮次,请检查配置')
        return false
      }
      return true
    },

    async getCsCfgsAsyncCheck() {
      await this.getCsIdCfgs()
      await this.getCsCfgsAsync()
    },
    // 异步获取赛制ID列表
    async getCsIdCfgs() {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/match/rule/list'
          }
        })
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          for (let i = 0; i < objs.list.length; i++) {
            this.csIdCfg.push(objs.list[i])
          }
        }
      } catch (error) {
        console.log(error)
      } finally {}
    },

    async getCsCfgsAsync() {
      try {
        const response = await request({
          url: '/matchconfig/match/rule/list',
          method: 'get',
          data: {
            Env: this.env,
            Status: 0,
            PageNum: 1,
            PageSize: 200,
            GameId:MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS,
          }
        })
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            let total = 0
            for (var i = 0; i < objs.list.length; i++) {
              let gameId = parseInt(objs.list[i].game_id, 10)
              if (gameId !== MATCH_IUPSTREAM_TYPE_OPTIONS.MATCH_UPSTREAM_TYPE_TONGITS) {
                continue
              }
              if (!await this.checkRuleIdIsPublish(objs.list[i].id)) {
                continue
              }
              if (objs.list[i].self_build >  0) {
                continue
              }
              total = total +1
              this.csCfgs.push({
                'label': '[' + objs.list[i].id + ']' + objs.list[i].name,
                'value': objs.list[i].id,
                'gameId': [parseInt(objs.list[i].game_id, 10)],
                'ruleType': objs.list[i].rule_type
              })
              const stage_detail = JSON.parse(objs.list[i].stage_detail)
              // console.log("打立初级信息 ", stage_detail)
              for (var j = 0; j < stage_detail.length; j++) {
                if (stage_detail[j].system_type === 1) { // 打立出局
                  // 存储打立出局的最大时长配置 用于配置检查
                  this.endMinuteCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.end_rule.match_minute)
                  this.endNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.end_rule.lave_user_number)
                  this.promoteNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.promotion_rule.user_number)
                  this.growTotalNumCfgs.set(objs.list[i].id, stage_detail[j].system_strike_out.disuse_score_growth.grow_total)
                  this.disuseScoreGrowDetail.set(objs.list[i].id, stage_detail[j].system_strike_out.disuse_score_growth.disuse_score_grow_detail)
                } else if (stage_detail[j].system_type === 2) {
                  // 存储定局信息
                  this.reachOutNumCfgs.set(objs.list[i].id, stage_detail[j].system_reach_out.round_config[0].promotion_user)
                }
              }
              const csExtra = JSON.parse(objs.list[i].rule_extra)
              if (csExtra != null) {
                this.csExtraCfgs.set(objs.list[i].id, csExtra)
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      } finally {}
    },
    //检查sng报名条件显示
    checkSngSignTypeDisable(value) {
      if (this.editForm.data.opentMatchType === 2) {
        return false
      }
      //sng只显示付费赛
      if(!IsMars()  && this.editForm.data.opentMatchType === 1 && ([1,2,3].includes(value))) {
        return true
      }
      return false
    },
    // 校验赛制ID是否已经发布
    async checkRuleIdIsPublish(ruleId) {
      for (var j = 0; j < this.csIdCfg.length; j++) {
        if (ruleId === this.csIdCfg[j]) {
          return true
        }
      }
      return false
    }
  }
}
</script>
