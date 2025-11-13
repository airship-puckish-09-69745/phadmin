<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="TexasMttTableConfig" :env-empty="true"  :makeContent="makeContent" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-form :model="form" label-width="100px" :inline="true" size="mini">

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

    <el-row>

    </el-row>

    <el-row>
      <div style="float: right; margin-bottom: 10px;">
        <el-button size="mini" icon="el-icon-setting" @click="handleCreate()">添加配置项</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="getList()">刷新</el-button>
      </div>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="70" />
        <el-table-column prop="RaceName" label="名称" width="120" />
        <el-table-column prop="GameId" label="玩法" width="100">
          <template slot-scope="scope">
            {{ getGameType(scope.row.GameId) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="赛事类型" width="100">
          <template slot-scope="scope">
            {{ getRaceType(scope.row.RaceType) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="开始日期" width="100">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceBeginDate, 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="结束日期" width="100">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceEndDate, 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="开始时间" width="100">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceBeginTime, 4) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="结束时间" width="100">
          <template slot-scope="scope">
            {{ formatTime2(scope.row.RaceEndTime, 4) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceType" label="星期" width="100">
          <template slot-scope="scope">
            {{ getWeekName(scope.row.RaceType, scope.row.RaceWeek) }}
          </template>
        </el-table-column>
        <el-table-column prop="RaceShowTime" label="显示时间" width="100">
          <template slot-scope="scope">
            {{ getShowTime(scope.row.RaceShowTime, scope.row.RaceType) }}
          </template>
        </el-table-column>
        <el-table-column prop="SignupFee" label="报名费用" width="90" />
        <el-table-column prop="ServiceFee" label="服务费" width="70" />
        <el-table-column prop="LastModify" label="最近修改" width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCopy(scope.row)">复制</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" type="success" @click="handlePreOn(scope.row)">预上</el-button>
            <el-button v-if="scope.row.Status==7" size="mini" type="success" @click="handleOn(scope.row)">上架</el-button>
            <el-button v-if="scope.row.Status==2" size="mini" type="warning" @click="handlePreOff(scope.row)">预下</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==8" size="mini" type="danger" @click="handleOffline(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
         <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>APP信息</legend>
          <el-table
            :data="edit.item.AppInfo"
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
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>比赛信息</legend>
        <el-row>
          <el-col :span="11">
            <el-form-item label="比赛名称:" :required="true" prop="item.RaceName">
              <el-input v-model="edit.item.RaceName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="玩法">
              <el-select v-model="edit.item.GameId" placeholder="请选择">
                <el-option v-for="item in GidTypes" :key="item.key" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="封面图片URL：" :required="true">
              <ImagePicker v-model="edit.item.BgImage" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="比赛类型:" :required="true">
              <el-radio-group v-model.number="edit.item.RaceType">
                <el-radio :label="0">单日赛</el-radio>
                <el-radio :label="1">每日循环赛</el-radio>
                <el-radio :label="2">每周循环赛</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="edit.item.RaceType == 0">
          <el-col :span="11">
            <el-form-item label="比赛开始日期:" :required="true" prop="item.RaceBeginDate">
              <el-date-picker v-model="edit.item.RaceBeginDate" placeholder="比赛开始日期" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="比赛开始时间:" :required="true" prop="item.RaceBeginTime">
              <el-time-picker v-model="edit.item.RaceBeginTime" placeholder="比赛开始时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="edit.item.RaceType == 1">
          <el-row>
            <el-col :span="11">
              <el-form-item label="比赛开始日期:" :required="true" prop="item.RaceBeginDate">
                <el-date-picker v-model="edit.item.RaceBeginDate" type="date" placeholder="比赛开始日期" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="比赛结束日期:" :required="true" prop="item.RaceEndDate">
                <el-date-picker v-model="edit.item.RaceEndDate" type="date" placeholder="比赛结束日期" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="比赛开始时间:" :required="true" prop="item.RaceBeginTime">
                <el-time-picker v-model="edit.item.RaceBeginTime" type="time" placeholder="比赛开始时间" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="比赛结束时间:" :required="true" prop="item.RaceEndTime">
                <el-time-picker v-model="edit.item.RaceEndTime" type="time" placeholder="比赛结束时间" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="edit.item.RaceType == 2">
          <el-row>
            <el-col :span="20">
              <el-form-item label="星期:" :required="true" prop="item.RaceWeek">
                <el-checkbox-group v-model="edit.item.RaceWeek">
                  <el-checkbox v-for="v, k in weekNames" :key="k" :label="k">{{ v }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="比赛开始日期:" :required="true" prop="item.RaceBeginDate">
                <el-date-picker v-model="edit.item.RaceBeginDate" type="date" placeholder="比赛开始日期" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="比赛结束日期:" :required="true" prop="item.RaceEndDate">
                <el-date-picker v-model="edit.item.RaceEndDate" type="date" placeholder="比赛结束日期" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="比赛开始时间:" :required="true" prop="item.RaceBeginTime">
                <el-time-picker v-model="edit.item.RaceBeginTime" type="time" placeholder="比赛开始时间" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="比赛结束时间:" :required="true" prop="item.RaceEndTime">
                <el-time-picker v-model="edit.item.RaceEndTime" type="time" placeholder="比赛结束时间" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-row>
          <el-col v-if="edit.item.RaceType > 0" :span="11">
            <el-form-item label="显示时间(分钟):" :required="true" prop="item.RaceShowTime">
              <el-input v-model="edit.item.RaceShowTime" placeholder="显示时间" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="11">
            <el-form-item label="显示时间：">
              <el-date-picker
                v-model="edit.item.RaceShowTime"
                value-format="timestamp"
                type="datetime"
                placeholder="显示时间"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="edit.item.RaceType > 0" :span="11">
            <el-form-item label="间隔时间(分钟):" :required="true" prop="item.RaceIntervalTime">
              <el-input v-model="edit.item.RaceIntervalTime" placeholder="间隔时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="开赛前可进入(分钟):" :required="true" prop="item.PreMatchBeginTime">
              <el-input v-model="edit.item.PreMatchBeginTime" placeholder="进入时间" />
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="是否開起每日限制:" :required="true">
              <el-radio-group v-model.number="edit.item.OpenDaysLimit">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="报名费用:" :required="true" prop="item.SignupFee">
              <el-input v-model="edit.item.SignupFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务费:" :required="true" prop="item.ServiceFee">
              <el-input v-model="edit.item.ServiceFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="截止报名级别:" :required="true" prop="item.EndSignupClass" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.EndSignupClass" placeholder="请输入" />
            </el-form-item>
          </el-col>
           <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="注意截止时间需要小于比赛间隔时间" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最低开赛人数:" :required="true" prop="item.MinPeopleNum" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.MinPeopleNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="初始筹码:" :required="true" prop="item.InitChip" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.InitChip" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="操作时间(秒):" :required="true" prop="item.OperateSeconds" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.OperateSeconds" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="每桌人数上限:" :required="true" prop="item.PerTableMaxNum" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PerTableMaxNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否支持rebuy:" :required="true">
              <el-radio-group v-model.number="edit.item.IsSupportRebuy">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="11">
            <el-form-item label="ReBuy费用:" prop="item.ReBuyFee">
              <el-input v-model="edit.item.ReBuyFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="费率(百分比):" prop="item.ServiceFeeRatio">
              <el-input v-model="edit.item.ServiceFeeRatio" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="可Rebuy盲注级别限制:" :required="true" prop="item.RebuyClassLimit" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyClassLimit" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="注意截止时间需要小于比赛间隔时间" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <el-form-item label="rebuy后筹码数量:" :required="true" prop="item.RebuyChipNum" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyChipNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="rebuy次数上限:" :required="true" prop="item.RebuyMaxTimes" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyMaxTimes" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="rebuy时间(秒):" :required="true" prop="item.RebuyTime" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RebuyTime" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="盲注配置">
              <el-select v-model="edit.item.BlindType" placeholder="请选择">
                <el-option v-for="item in BlindTypeName" :key="item.key" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="机器人数量:" :required="true" prop="item.RobotNum" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RobotNum" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="赛事权重:" :required="true" prop="item.RaceWeight" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RaceWeight" placeholder="请输入" />
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="是否立即开赛:" :required="true">
              <el-radio-group v-model.number="edit.item.IsStartNow">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
           <el-col :span="11">
            <el-form-item label="是否上报数据中心:" :required="true">
              <el-radio-group v-model.number="edit.item.IsDcReport">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="白名单:" prop="item.RaceWhiteList" >
              <el-input type="textarea" v-model="edit.item.RaceWhiteList"  :autosize="{ minRows: 2, maxRows: 8}" placeholder="玩家id，用英文逗号分割" />
            </el-form-item>
          </el-col>
        </el-row>
        </fieldset>
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>报名条件</legend>
          <el-form-item label="报名条件：" :required="true">
            <el-select v-model="edit.item.SignUpType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in signUpTypeCfgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="edit.item.SignUpType > 0" label="门票：" :required="true">
            <el-select v-model="edit.item.SignUpExtra.propsId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in matchTicketsCfgs"
                :key="item.propsId"
                :label="item.propsName"
                :value="item.propsId"
              >
               <img v-if="item.propsIcon != '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;padding: 4px;"/>
                <span>{{ item.propsName }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="edit.item.SignUpType > 0" label="门票数量：" :required="true">
            <el-input v-model.number="edit.item.SignUpExtra.propsNum" style="width: 180px;" size="mini" placeholder="请填写门票数量" :required="true"/>
          </el-form-item>
        </fieldset>
        <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
          <legend>奖励配置</legend>
           <el-row>
            <el-col :span="11">
              <el-form-item label="奖励类型">
                <el-select v-model="edit.item.TemplateType" placeholder="请选择" @change="changeTemplateType">
                  <el-option v-for="item in TemplateTypeConfig" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
             <el-col v-if="edit.item.TemplateType===1" :span="20">
              <el-form-item label="奖金类型">
                <el-select v-model="edit.item.RewardType" placeholder="请选择">
                  <el-option v-for="item in RewardTypeConfig" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
                 <el-select v-if="edit.item.RewardType > 1" v-model="edit.item.SceneId" placeholder="请选择">
                      <el-option v-if="edit.item.RewardType === 2"
                        v-for="item in betScenesCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                       <el-option v-if="edit.item.RewardType === 3"
                        v-for="item in rebateScenesCfgs"
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
              <el-form-item label="奖励配置">
                <el-select v-if="edit.item.TemplateType===0" v-model="edit.item.RewardId" placeholder="请选择">
                  <el-option v-for="item in RewardConfig" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
                <el-select v-else v-model="edit.item.RewardId" placeholder="请选择">
                  <el-option v-for="item in DynamicRewardConfig" :key="item.key" :label="item.key" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="初始奖池:" :required="true" prop="item.RewardPool" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.RewardPool" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-button  style="margin-bottom: 10px;" type="normal" size="mini" @click="addRankRewards()">添加</el-button>
          <el-table
            :data="edit.item.RankRewardsExtra"
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
              width="500"
            >
              <template slot-scope="scope">
                <ul style="list-style: none;padding-inline-start: 0;">
                  <li v-if="scope.row.propsReward != null" style="list-style: none;">
                    <span>道具奖励：</span>
                    <el-select v-model="scope.row.propsReward.propsId" placeholder="道具" size="mini" style="width:200px">
                      <el-option
                        v-for="item in matchPropsCfgs"
                        :key="item.propsId"
                        :label="item.propsName"
                        :value="item.propsId"
                      >
                        <img v-if="item.propsIcon != '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;padding: 4px;"/>
                        <span>{{ item.propsName }}</span>
                      </el-option>
                    </el-select>
                    <el-input v-model.number="scope.row.propsReward.propsNum" style="width: 100px;" size="mini" placeholder="填数量" />
                  </li>
                  <li v-if="scope.row.propsReward != null && checkPropNeedExpireDays(scope.row.propsReward.propsId)" style="list-style: none;">
                    <span>过期天数：</span>
                    <el-select v-model="scope.row.propsReward.propsEffectiveTime" placeholder="过期天数" size="mini" style="width:200px">
                      <el-option
                        v-for="item in ITEM_DAY_TYPE_OPTIONS"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled === propValidExpireDays(scope.row.propsReward.propsId, item.value)"
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

        </fieldset>
        <el-form-item>
          <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
// import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { IsMars } from '@/utils/env'
import {
  ITEM_TYPE_OPTIONS,
  PROP_TYPE_OPTIONS,
  ITEM_DAY_TYPE_OPTIONS,
  APPID_OPTIONS,
  MATCH_IUPSTREAM_TYPE_OPTIONS
} from "@/utils/options";
import {GetMatchTicketRightsIdList, IsNewTicketProp} from "@/utils/prop";

const filterMap = {}

function newItem() {
  return {
    RaceName: '',
    GameId: 32,
    BgImage: '',
    RaceType: 0,
    RaceWeek: [],
    RaceWeekStr: '',
    RaceBeginDate: new Date('2021/07/14').toLocaleString(),
    RaceEndDate: new Date('2021/07/14').toLocaleString(),
    RaceBeginTime: new Date().toLocaleString(),
    RaceEndTime: new Date().toLocaleString(),
    RaceShowTime: 0,
    RaceIntervalTime: 0,
    SignupFee: 0,
    ServiceFee: 0,
    EndSignupClass: 0,
    MinPeopleNum: 0,
    InitChip: 0,
    OperateSeconds: 0,
    PerTableMaxNum: 0,
    IsSupportRebuy: 1,
    ReBuyFee: 0,
    ServiceFeeRatio: 0,
    RebuyClassLimit: 0,
    RebuyChipNum: 0,
    RebuyMaxTimes: 0,
    RebuyTime: 0,
    BlindType: 1,
    RobotNum: 0,
    RaceWeight: 0,
    IsStartNow: 0,
    RaceWhiteList: '',
    PreMatchBeginTime: 10,
    TemplateType: 0,
    RewardType: 0,
    SceneId: 0,
    IsDcReport: 0,
    RewardId: 0,
    RewardPool: 0,
    LastModify: 0,
    ModifyUser: '',
    Status: 0,
    AppInfo: [
      {
        index: 1,
        appId: 1000002,
        channelId: []
      }
    ],
    AppInfoStr: '',
    OpenDaysLimit: 0,
    SignUpType: 0,
    SignUpExtra: {
      propsId: 0,
      propsType: 0,
      propsNum:0,
      propsCost:0,
      propsName:'',
    },
    SignUpExtraStr: '',
    RankRewardsExtra: [],
    RankRewardsExtraStr:'',
  }
}


export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput, ImagePicker },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      weekNames: { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' },
      GidTypes: [
        { key: '[0]无限德州', value: 32 },
        { key: '[1]奥马哈德州', value: 36 }
      ],
      BlindTypeName: [
        { key: '[1]快速盲注配置', value: 1 },
        { key: '[2]小赛2m升盲', value: 2 },
        { key: '[3]Daily Free', value: 3 },
        { key: '[4]新2m升盲', value: 4 },
        { key: '[5]Turbo盲注', value: 5 },
        { key: '[6]3M标准', value: 6 },
        { key: '[7]深筹大赛200P+', value: 7 }
      ],
      TemplateTypeConfig: [
        { key: '固定奖励', value: 0 },
        { key: '动态奖励', value: 1 },
      ],
      RewardTypeConfig: [
        { key: '金币', value: 1 },
        { key: '投注金', value: 2 },
        { key: '返水金', value: 3 }
      ],
       // 返水金
      rebateScenesCfgs: [
        { 'value': 10, 'label': '没有任何限制的返水金【TexasPlus付费赛】' }
      ],
      // 投注金
      betScenesCfgs: [
        { 'value': 9, 'label': '仅限GZ任意游戏投注金【TexasPlus免费赛】' }
      ],
      DynamicRewardConfig: [
        { key: 'UAT28', value: 100 },
        { key: 'UAT 2.9', value: 101 },
      ],
      RewardConfig: [
        { key: '[0]动态奖励', value: 0 },
        { key: '[1]188奖池赛', value: 1 },
        { key: '[2]1288单场赛', value: 2 },
        { key: '[3]固定奖励3', value: 3 },
        { key: '[4]Daily Free', value: 4 },
        { key: '[5]3人赛投注金测试', value: 5 },
        { key: '[6]188投注金', value: 6 },
        { key: '[7]1288投注金', value: 7 },
        { key: '[8]2888投注金', value: 8 },
        { key: '[54]', value: 54 },
        { key: '[55]', value: 55 },
        { key: '[56]', value: 56 },
        { key: '[57]', value: 57 },
      ],
      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      channelIdCfgs: [
        { 'value': 'BP', 'label': 'BP' },
        { 'value': 'AP', 'label': 'AP' },
        { 'value': 'GP', 'label': 'GP' },
        //{ 'value': 'TP', 'label': 'TP' },
        { 'value': 'PG', 'label': 'PG' },
        { 'value': 'Dev', 'label': 'Dev' }
      ],
      signUpTypeCfgs: [
        { 'value': 0, 'label': '金币报名' },
        { 'value': 1, 'label': '纯门票' },
        { 'value': 2, 'label': '金币or门票' }
      ],
      matchPropsCfgs: [],   //比赛道具信息
      matchTicketsCfgs: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      // libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'SmallBlind', 'MinBuyIn', 'MaxBuyIn', 'DelayOpTimeCostMoney', 'ShowPublicCardCostMoney']),
      // libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      AttrNames: {
        RaceName: '比赛名称',
        GameId: '玩法',
        BgImage: '背景图片',
        RaceWeek: '星期',
        RaceBeginDate: '开始日期',
        RaceEndDate: '结束日期',
        RaceBeginTime: '开始时间',
        RaceEndTime: '结束时间',
        RaceShowTime: '显示时间',
        RaceIntervalTime: '间隔时间',
        SignupFee: '报名费用',
        ServiceFee: '服务费',
        EndSignupClass: '截止报名级别',
        MinPeopleNum: '最低开赛人数',
        InitChip: '初始筹码',
        OperateSeconds: '操作时间(秒)',
        PerTableMaxNum: '每桌人数上限',
        IsSupportRebuy: '是否支持rebuy,0否1是',
        ReBuyFee: 'rebuy 费用',
        ServiceFeeRatio: '费率',
        RebuyClassLimit: '可rebuy级别限制',
        RebuyChipNum: 'rebuy后筹码数量',
        RebuyMaxTimes: 'rebuy次数上限',
        RebuyTime: 'rebuy倒计时',
        BlindType: '盲注类型',
        RobotNum: '机器人数量',
        RaceWeight: '比赛权重',
        IsStartNow: '比赛是否立即开始',
        RaceWhiteList: '白名单',
        PreMatchBeginTime: '提前可进入时间',
        TemplateType: '奖励模板类型',
        RewardType: '奖金类型',
        SceneId:'场景ID',
        IsDcReport: '是否上报数据中心',
        RewardId: '奖励ID',
        RewardPool: '初始奖池',
        AppInfo: 'App信息',
        OpenDaysLimit : '是否開啟每日限制',
        SignUpType: '报名类型',
        SignUpExtra: '报名门票信息',
        RankRewardsExtra: '门票奖励信息'
      },
      PROP_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      propsTypeList: [PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET, PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW],// 门票 头像框
      APPID_OPTIONS,
      form: {
        appId: -1
      },
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    if (!IsMars()) {
      this.getMatchProps()
    } else {
      this.appidInfoCfgs.push( { 'value': 1000008, 'label': 'gli' },)
    }
    /*this.getMatchPropsV1()*/
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatTime2(date, type) {
      var result = new Date(date).getTime()
      return $libDate.FormateMilisecondStrByZone(result, type, '')
    },
    getWeekName(type, weeks) {
      if (type !== 2) {
        return '无'
      }
      var weekNames = ''
      for (var i = 0; i < weeks.length; i++) {
        weekNames += this.weekNames[weeks[i]]
        if (i !== weeks.length - 1) {
          weekNames += ' , '
        }
      }
      return weekNames
    },
    getShowTime(t, type) {
      if (type <= 0) {
        return $libDate.FormateMilisecondStrByZone(t, 2, '')
      }
      if (t % 60 === 0) {
        return t / 60 + 'h'
      }
      var result = ''
      if (t > 60) {
        result = t / 60 + 'h'
      }
      return result + t % 60 + 'm'
    },
    getGameType(gid) {
      for (var i = 0; i < this.GidTypes.length; i++) {
        for (const [k, v] of Object.entries(this.GidTypes[i])) {
          if (k === 'value' && v === gid) {
            return this.GidTypes[i]['key']
          }
        }
      }
    },
    getRaceType(raceType) {
      if (raceType === 0) {
        return '单场赛'
      } else if (raceType === 1) {
        return '每日循环赛'
      } else {
        return '每周循环赛'
      }
    },
    selectShowGuieds() {
      for (var i = 0; i < this.edit.item.AppInfo.length; i++) {
        this.edit.item.AppInfo[i].channelId = []
      }
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    changeTemplateType(){
      this.edit.item.RewardId = 0
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      this.getList()
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/texasmtttable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          //console.log(objs)
          let tableData = []
          for (const o in objs) {

            if (objs[o].RaceBeginDate === 0) {
              objs[o].RaceBeginDate = new Date()
            } else {
              objs[o].RaceBeginDate = new Date(objs[o].RaceBeginDate * 1000)
            }

            if (objs[o].RaceEndDate === 0) {
              objs[o].RaceEndDate = new Date()
            } else {
              objs[o].RaceEndDate = new Date(objs[o].RaceEndDate * 1000)
            }

            if (objs[o].RaceBeginTime < 0) {
              objs[o].RaceBeginTime = new Date()
            } else {
              objs[o].RaceBeginTime = new Date(objs[o].RaceBeginTime * 1000 - 8 * 3600 * 1000)
            }

            if (objs[o].BgImage === ' ') {
              objs[o].BgImage = ''
            }

            if (objs[o].RaceEndTime < 0) {
              objs[o].RaceEndTime = new Date()
            } else {
              objs[o].RaceEndTime = new Date(objs[o].RaceEndTime * 1000 - 8 * 3600 * 1000)
            }
            if (objs[o].RaceType > 0) {
              objs[o].RaceShowTime /= 60
              objs[o].RaceIntervalTime /= 60
            } else {
              objs[o].RaceShowTime = new Date(objs[o].RaceShowTime * 1000)
            }
            objs[o].PreMatchBeginTime = objs[o].RaceCanEnterTime / 60
            objs[o].RaceWeek = objs[o].RaceWeekStr.split(',')
            objs[o].ServiceFee = objs[o].ServiceFee/1000
            objs[o].SignupFee = objs[o].SignupFee/1000
            objs[o].ReBuyFee = objs[o].ReBuyFee/1000
            objs[o].ServiceFeeRatio = objs[o].ServiceFeeRatio/100
            if (objs[o].AppInfoStr !== ''){
              objs[o].AppInfo = JSON.parse(objs[o].AppInfoStr)
            } else {
              objs[o].AppInfo = [
                {
                  index: 1,
                  appId: 1000002,
                  channelId: []
                }
              ]
            }
            if(this.form.appId > 0 && objs[o].AppInfo[0].appId !== this.form.appId) {
              continue
            }
            if (objs[o].SignUpExtraStr !== 'null' && objs[o].SignUpExtraStr !== undefined){
              objs[o].SignUpExtra = JSON.parse(objs[o].SignUpExtraStr)
            }
            if (objs[o].RankRewardsExtraStr !== 'null' && objs[o].RankRewardsExtraStr !== undefined){
              objs[o].RankRewardsExtra = JSON.parse(objs[o].RankRewardsExtraStr)
            }
            tableData.push(objs[o])
          }
          // this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.clientDB = new ClientTableData(tableData, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      return true
    },
    handlePreOn(ob) {
      this.changeStatus(ob.ID, 7, '您确定要将记录状态修改为"预备上架"吗？该记录将在发布后同步到外网。')
    },
    handleOn(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handlePreOff(ob) {
      this.changeStatus(ob.ID, 8, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/texasmtttable/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            $this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      console.log('createSave', postData)
      request({
        url: '/texasmtttable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.edit.item.LastModify = response.Data.LastModify
          this.edit.item.ModifyUser = response.Data.ModifyUser
          this.edit.item.Status = response.Data.Status
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      console.log('editSave postData: ', postData)
      request({
        url: 'texasmtttable/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('editSave this.edit.item: ', this.edit.item)
          // this.edit.item.RaceBeginTime *= 1000
          // this.edit.item.RaceShowTime *= 1000
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    timeToTimestamp(time) {
      if (time === 0 || time === '') {
        return 0
      }
      let timestamp = Date.parse(new Date(time).toString())
      timestamp = timestamp / 1000
      return timestamp
    },
    getPostData() {
      const postData = JSON.parse(JSON.stringify(this.edit.item))
      postData.RaceBeginDate = this.timeToTimestamp(postData.RaceBeginDate)
      postData.RaceEndDate = this.timeToTimestamp(postData.RaceEndDate)
      postData.RaceBeginTime = this.timeToTimestamp(postData.RaceBeginTime) % (24 * 3600) + 8 * 3600
      if (postData.RaceBeginTime >= 86400) {
        postData.RaceBeginTime = postData.RaceBeginTime - 86400
      }
      postData.RaceEndTime = this.timeToTimestamp(postData.RaceEndTime) % (24 * 3600) + 8 * 3600
      if (postData.RaceBeginTime > postData.RaceEndTime && postData.RaceEndTime < 86400) {
        postData.RaceEndTime = postData.RaceEndTime + 86400
      }
      postData.ServiceFee = postData.ServiceFee * 1000
      postData.SignupFee = postData.SignupFee * 1000
      postData.ReBuyFee = postData.ReBuyFee * 1000
      postData.ServiceFeeRatio = postData.ServiceFeeRatio * 100
      if (postData.RaceType === 2) {
        postData.RaceWeekStr = ''
        for (var i = 0; i < postData.RaceWeek.length; i++) {
          postData.RaceWeekStr += postData.RaceWeek[i]
          if (i < postData.RaceWeek.length - 1) {
            postData.RaceWeekStr += ','
          }
        }
      } else {
        postData.RaceWeekStr = '0'
      }
      if (postData.RaceType > 0) {
        postData.RaceShowTime *= 60
        postData.RaceIntervalTime *= 60
      } else {
        postData.RaceShowTime = this.timeToTimestamp(postData.RaceShowTime)
      }
      if (postData.RaceWhiteList === '') {
        postData.RaceWhiteList = ' '
      }
      if (postData.BgImage === '') {
        postData.BgImage = ' '
      }
      postData.PreMatchBeginTime *= 60
      postData.AppInfoStr = JSON.stringify(postData.AppInfo)
      postData.SignUpExtraStr = JSON.stringify(postData.SignUpExtra)
      postData.RankRewardsExtraStr = JSON.stringify(postData.RankRewardsExtra)

      console.log(postData)
      return postData
    },
    checkData(postData) {
      if(postData.SignupFee > 0 && postData.OpenDaysLimit > 0) {
        Message.error('付费赛不能开启每日限制')
        return false
      }
      // if (this.edit.item.CarryLower > this.edit.item.CarryUpper) {
      //   Message.warning('下限不能大于上限，请检查数值正确性！')
      //   return false
      // }
      // if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
      //   Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
      //   return false
      // }
      // if (this.edit.item.MinBuyIn > this.edit.item.MaxBuyIn) {
      //   Message.error('【最低买入】必须小于等于【最大买入】，请检查数值正确性！')
      //   return false
      // }
      // TODO 完善
      return true
    },
    save() {
      if (this.checkPropsExpire(this.getPostData())) {
        Message.error('门票配置错误')
        return
      }
      if (!this.checkData(this.getPostData())) {
        return
      }
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.edit.item.AppInfoStr = JSON.stringify(this.edit.item.AppInfo)
        this.edit.item.SignUpExtraStr = JSON.stringify(this.edit.item.SignUpExtra)
        this.edit.item.RankRewardsExtraStr = JSON.stringify(this.edit.item.RankRewardsExtra)
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },

    makeContent(key, addData, delData, editData) {
      console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      let change = new Set()
      let add = new Set()
      let del = new Set()
      // 新增取newVal
      if (addData) {
        // console.log("addData",addData)
        for (var i=0; i<addData.length; i++) {
          for (let ele of addData[i]) {
            if (ele.key == "ID") {
              add.add(ele.newVal)
              console.log("add",ele.newVal)
            }
          }
        }
      }
      if (delData) {
        // console.log("delData",delData)
        for (var i=0; i<delData.length; i++) {
          for (let ele of delData[i]) {
            if (ele.key == "ID") {
              del.add(ele.oldVal)
              console.log("del",ele.oldVal)
            }
          }
        }
      }
      if (editData) {
      // console.log("editData",editData)
        for (const edit of editData) {
          change.add(edit.Head.ID)
          console.log(edit.Head.ID)
        }
      }
      if (change.size + del.size + add.size == 0) {
        console.log("no change return")
        return "没有修改!"
      }

      let str = ""
      let has = false
      for (let i=0; i<this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row["ID"])) {
          console.log(JSON.stringify(row))
          has && (str += "\r\n---");has=true
          str += `\r\n修改： appid:【${row.AppInfo[0].appId} ${row.AppInfo[0].channelId.join(',')}】。赛事ID:【${row.ID}】`
          str += `\r\n${this.getGameName(row.GameId)} - ${this.getRaceType(row.RaceType)} - ${row.RaceName}`
          str += `\r\n开始结束日期：【${this.formatTime2(row.RaceBeginDate, 1)}】 - 【${this.formatTime2(row.RaceEndDate, 1)}】`
          str += `\r\n开始结束时间：${this.formatTime2(row.RaceBeginTime, 4)} - ${this.formatTime2(row.RaceEndTime, 4)}`
          str += `\r\n报名费：₱${row.SignupFee}`
        }
        if (del.has(row["ID"])) {
          console.log(JSON.stringify(row))
          has && (str += "\r\n---");has=true
          str += `\r\n下架： appid:【${row.AppInfo[0].appId} ${row.AppInfo[0].channelId.join(',')}】。赛事ID:【${row.ID}】`
          str += `\r\n${this.getGameName(row.GameId)} - ${this.getRaceType(row.RaceType)} - ${row.RaceName}`
          str += `\r\n开始结束日期：【${this.formatTime2(row.RaceBeginDate, 1)}】 - 【${this.formatTime2(row.RaceEndDate, 1)}】`
          str += `\r\n开始结束时间：${this.formatTime2(row.RaceBeginTime, 4)} - ${this.formatTime2(row.RaceEndTime, 4)}`
          str += `\r\n报名费：₱${row.SignupFee}`
        }
        if (add.has(row["ID"])) {
          console.log(JSON.stringify(row))
          has && (str += "\r\n---");has=true
          str += `\r\n上架： appid:【${row.AppInfo[0].appId} ${row.AppInfo[0].channelId.join(',')}】。赛事ID:【${row.ID}】`
          str += `\r\n${this.getGameName(row.GameId)} - ${this.getRaceType(row.RaceType)} - ${row.RaceName}`
          str += `\r\n开始结束日期：【${this.formatTime2(row.RaceBeginDate, 1)}】 - 【${this.formatTime2(row.RaceEndDate, 1)}】`
          str += `\r\n开始结束时间：${this.formatTime2(row.RaceBeginTime, 4)} - ${this.formatTime2(row.RaceEndTime, 4)}`
          str += `\r\n报名费：₱${row.SignupFee}`
        }
      }
      return str
    },
    getGameName(gameId) {
      var gameName = ''
      for (var i = 0; i < this.GidTypes.length; i++) {
        if (this.GidTypes[i].value == gameId) {
          gameName = this.GidTypes[i].key
          break
        }
      }
      return gameName
    },
    getMatchProps() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/match/props/config/list',
          PropType: 0,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          var timestamp = Date.parse(new Date())/1000
          if (objs.total > 0) {
            for (let i=0;i<objs.list.length;i++) {
              let canPush = false
              let sceneId = 0
              if(objs.list[i].status ===1 && ((objs.list[i].item_type===PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET && objs.list[i].expire_time>timestamp) ||
                 [PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR].includes(objs.list[i].item_type) )) { //类型参考 PROP_TYPE_OPTIONS定义
                if (IsNewTicketProp(objs.list[i].item_type)) {
                  const tickets = GetMatchTicketRightsIdList(objs.list[i].item_type).find(ticket => ticket.ticketId === objs.list[i].id)
                  if(tickets){
                    canPush = true
                    sceneId = tickets[j].sceneId
                  }
                }else{
                  canPush = true
                }
                if(canPush){
                  this.matchPropsCfgs.push({
                    'propsType': objs.list[i].item_type,
                    'propsId': objs.list[i].id,
                    'propsName': objs.list[i].item_name,
                    'propsIcon': objs.list[i].image,
                    'propsAttr': objs.list[i].item_describe,
                    'propsCost': objs.list[i].item_cost,
                    'propsExpireTime': objs.list[i].expire_time,
                    'propsSceneId': sceneId,
                  })
                }
                if ([PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW].includes(objs.list[i].item_type)) { // texas 门票
                  if(canPush) {
                    this.matchTicketsCfgs.push({
                      'propsId': objs.list[i].id,
                      'propsName': objs.list[i].item_name
                    })
                  }
                }
              }
            }
          }
          console.log('matchTicketsCfgs', this.matchTicketsCfgs)
        }
      })
    },
    addRankRewards() {
      var index = 0
      var maxRank = 0
      if (this.edit.item.RankRewardsExtra.length > 0) {
        index = this.edit.item.RankRewardsExtra.length
        for (var i = 0; i < this.edit.item.RankRewardsExtra.length; i++) {
          if (this.edit.item.RankRewardsExtra[i].endRank > maxRank) {
            maxRank = this.edit.item.RankRewardsExtra[i].endRank
          }
        }
      }
      index++
      maxRank++
      this.edit.item.RankRewardsExtra.push({
        index: index,
        startRank: maxRank,
        endRank: maxRank,
        propsReward: {
          propsId: 0,
          propsType: 0,
          propsName: '',
          propsIcon: '',
          propsAttr: '',
          propsNum:0,
          propsEffectiveTime: -2,
          propsSceneId:0,

        }
      })
    },
    removeRewardItme(index) {
      this.edit.item.RankRewardsExtra.splice(index, 1)
      if (this.edit.item.RankRewardsExtra.length > 0) {
        for (var i = 0; i < this.edit.item.RankRewardsExtra.length; i++) {
          this.edit.item.RankRewardsExtra[i].index = i + 1
        }
      }
    },
    setPropsDetail() {
      for (var i=0; i<this.matchPropsCfgs.length; i++){
        if (this.edit.item.SignUpExtra.propsId === this.matchPropsCfgs[i].propsId) {
          this.edit.item.SignUpExtra.propsType = this.matchPropsCfgs[i].propsType
          if (this.matchPropsCfgs[i].propsCost < 1000) {
            this.edit.item.SignUpExtra.propsCost = this.matchPropsCfgs[i].propsCost * 1000
          } else {
            this.edit.item.SignUpExtra.propsCost = this.matchPropsCfgs[i].propsCost
          }

          this.edit.item.SignUpExtra.propsName = this.matchPropsCfgs[i].propsName
        }
        for (var j=0; j<this.edit.item.RankRewardsExtra.length; j++){
          if (this.edit.item.RankRewardsExtra[j].propsReward.propsId === this.matchPropsCfgs[i].propsId) {
            this.edit.item.RankRewardsExtra[j].propsReward.propsType = this.matchPropsCfgs[i].propsType
            if (this.matchPropsCfgs[i].propsCost < 1000) {
              this.edit.item.RankRewardsExtra[j].propsReward.propsCost = this.matchPropsCfgs[i].propsCost  * 1000
            }else {
              this.edit.item.RankRewardsExtra[j].propsReward.propsCost = this.matchPropsCfgs[i].propsCost
            }
            this.edit.item.RankRewardsExtra[j].propsReward.propsName = this.matchPropsCfgs[i].propsName
            this.edit.item.RankRewardsExtra[j].propsReward.propsSceneId = this.matchPropsCfgs[i].propsSceneId
          }
        }
      }
    },
    getPropsExpireTime(propsId, propsType) {
      for (var i=0; i<this.matchPropsCfgs.length; i++){
        if (propsId === this.matchPropsCfgs[i].propsId && propsType == this.matchPropsCfgs[i].propsType) {
          return this.matchPropsCfgs[i].propsExpireTime
        }
      }
      return 0
    },
    checkPropsExpire(postData){
      if (postData.SignUpType === 0) {
        this.edit.item.SignUpExtra = {}
      }
      this.setPropsDetail()
      if (postData.SignUpType > 0) {
        if (this.edit.item.SignUpExtra.propsId * this.edit.item.SignUpExtra.propsType * this.edit.item.SignUpExtra.propsNum === 0 ) {
          return true
        }
        var timestamp = Date.parse(new Date())/1000
        var endTime = postData.RaceEndDate
        if (postData.RaceType == 0) {
          endTime = postData.RaceBeginDate
        }
        var expire_time = this.getPropsExpireTime(this.edit.item.SignUpExtra.propsId, this.edit.item.SignUpExtra.propsType)
        if (this.edit.item.SignUpExtra.propsType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET &&  expire_time < endTime && this.edit.item.SignUpExtra.propsType !== 4) {
          return true
        }
      }

      for (var j=0; j<this.edit.item.RankRewardsExtra.length; j++){
        if (this.edit.item.RankRewardsExtra[j].propsReward.propsId * this.edit.item.RankRewardsExtra[j].propsReward.propsType * this.edit.item.RankRewardsExtra[j].propsReward.propsNum === 0 ) {
          return true
        }
        // expire_time = this.getPropsExpireTime(this.edit.item.RankRewardsExtra[j].propsReward.propsId, this.edit.item.RankRewardsExtra[j].propsReward.propsType)
        // if (this.edit.item.SignUpExtra.propsType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET && expire_time < endTime && this.edit.item.RankRewardsExtra[j].propsReward.propsType !== 4) {
        //   return true
        // }
        if([PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW].includes(this.edit.item.RankRewardsExtra[j].propsReward.propsType) &&
          this.edit.item.RankRewardsExtra[j].propsReward.propsEffectiveTime <0){
          return true
        }
      }
      return false
    },
    // 道具是否需要过期时间
    checkPropNeedExpireDays(propsId) {
      for (var i=0; i<this.matchPropsCfgs.length; i++){
        if (propsId === this.matchPropsCfgs[i].propsId &&  [PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR, PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW].includes(this.matchPropsCfgs[i].propsType)) {
          return true
        }
      }
      return false
    },

    // 道具过期时间是否合法
    propValidExpireDays(propsId, expireDays) {
      const prop = this.getPropsRewardItem(propsId, 0, 0)
      switch (prop.propsType) {
        case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR:
          if (expireDays < 0) {
            return false
          }
          break;
        case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW:
          if (expireDays === 0 || expireDays === 365 || expireDays < 0) {
            return false
          }
          break;
        default:
          break;
      }
      return  true
    },

    getPropsRewardItem(pid) {
      const one = {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: 0,
        propCost: 0,
        propsEffectiveTime: -1,
        propsSceneId:0,
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
          one.propsExpireTime = element.propsExpireTime
          break
        }
      }
      return one
    },

    resetSearch() {
      this.form.appId = -1
    },
    handlerChangeMin(e) {
      // if (parseInt(e) < 2 || parseInt(e) > this.edit.item.TableMaxPlayerNum) {
      //   Message.error('数据错误')
      //   return
      // }
      // if (this.edit.FeeLimit.length <= 1) {
      //   if (parseInt(e) !== 2) {
      //     Message.error('数据错误')
      //     return
      //   }
      // } else {
      //   if (parseInt(e) !== this.edit.FeeLimit[this.edit.FeeLimit.length - 2].MaxPlayerNum + 1) {
      //     Message.error('数据错误')
      //     return
      //   }
      // }
    }
  }
}
</script>
