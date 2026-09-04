<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :make-content="makeContent" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-row>
        <span> 选择游戏 :</span>
        <el-select v-model="queryGid" size="mini" filterable default-first-option @change="getData">
          <!--              <el-option label="所有" :value="0"/>-->
          <el-option v-for="(o,k) in gameOptions" :key="o.key" :label="o.label" :value="parseInt(o.key)" />
        </el-select>
      </el-row>
      <el-row>
        <el-button type="primary" size="mini" @click="saveCfgByGid()">保存配置</el-button>
      </el-row>
      <br>

    </el-row>
    <!--    <fieldset style="width: 100px">-->
    <span>
      <el-button type="success" size="mini" @click="openAddDialog">添加方案</el-button>
      <el-table
        :data="showItem.Plans"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        stripe
      >
        <el-table-column prop="PlanId" label="差异化方案ID" width="80px" />
        <el-table-column prop="PlanName" label="差异化方案名称" />
        <el-table-column prop="IsDefault" label="是否是默认方案">
          <template slot-scope="scope">
            {{ scope.row.IsDefault === 1 ? '是' : '不是' }}
          </template>
        </el-table-column>
        <el-table-column prop="IsDisabled" label="是否禁用">
          <template slot-scope="scope">
            {{ scope.row.IsDisabled === 1 ? '禁用' : '未禁用' }}
          </template>
        </el-table-column>
        <el-table-column prop="Volatility" label="波动率">
          <template slot-scope="scope">
            {{ scriptPlanVolatilityStat[scope.row.PlanId] || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="Versions" label="配置版本列表" width="1000px">
          <template slot-scope="scope">
            <el-table :data="scope.row.Versions" stripe style="font-size: 10px">
              <el-table-column prop="Version" label="版本号" width="80px">
                <template slot="header" slot-scope="{}">
                  <el-button type="success" size="mini" @click="openAddVersionDialog(scope.$index)">添加版本</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="Comment" label="版本说明" />
              <el-table-column prop="IsReady" label="是否就绪" width="80px">
                <template slot-scope="scope">
                  <!--                {{ scope.row.IsReady ? '就绪' : '' }}-->
                  <span v-if="scope.row.IsReady" style="color: #00b023"> {{ '就绪' }} </span>
                  <span v-else style="color: red">{{ '未就绪' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="600px">
                <template slot-scope="versionScope">

                  <!--                <el-button @click="openCreateVersionScriptsDialog(scope.$index, versionScope.$index)" type="success"-->
                  <!--                           size="mini">创建剧本</el-button>-->
                  <el-button
                    type="success"
                    size="mini"
                    :disabled="versionScope.row.IsReady"
                    @click="showTips(1,versionScope.row,scope.row)"
                  >创建剧本</el-button>
                  <el-button
                    type="primary"
                    style="background: #cf91ee"
                    size="mini"
                    @click="getVersion(versionScope.row,scope.row)"
                  >查看剧本</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openEditVersionDialog(scope.$index, versionScope.$index)"
                  >编辑</el-button>
                  <el-button
                    style="background: #91eee3"
                    size="mini"
                    @click="copyVersionDialog(scope.$index, versionScope.$index)"
                  >复制版本</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="querySlotBase(scope.row.PlanId)"
                  >查询</el-button>
                  <!-- <el-button @click="showTips(2,scope.$index, versionScope.$index)" type="danger"
                           size="mini">删除版本</el-button> -->
                  <el-button
                    type="danger"
                    size="mini"
                    @click="delScripts(scope.row.PlanId, versionScope.row.Version)"
                  >清理剧本</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="ScriptRule" label="用户规则">
          <el-table-column label="平台">
            <template slot-scope="scope">
              <el-tag v-for="tag of scope.row.ScriptRule.PlatformList">{{ tag }}</el-tag>
            </template>
          </el-table-column>
          <!--        <el-table-column label="用户类型">-->
          <!--          <template slot-scope="{}" slot="header">-->
          <!--            用户类型-->
          <!--               <el-tooltip class="item" effect="dark" placement="top">-->
          <!--      <i class="el-icon-question" style="font-size: 14px; vertical-align: middle;"></i>-->
          <!--      <div slot="content">-->
          <!--        <p>(0:不限,1:新注,2:活跃,3:大R-暂不考虑) </p>-->
          <!--      </div>-->
          <!--    </el-tooltip>-->
          <!--              </template>-->
          <!--       <template slot-scope="scope">-->
          <!--          {{ scope.row.ScriptRule.UserType  }}-->
          <!--        </template>-->
          <!--        </el-table-column>-->
          <el-table-column label="流量控制(权重)">
            <template slot-scope="scope">
              {{ scope.row.ScriptRule.TrafficCtrl }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openEditDialog(scope.row,scope.$index)">编辑</el-button>
            <el-button type="success" size="mini" @click="showTips(4,scope.row,0)">复制</el-button>
            <el-button type="danger" size="mini" @click="showTips(3,scope.$index,0)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加方案对话框 -->
      <el-dialog :visible.sync="addDialogVisible" title="添加方案">
        <el-form :model="addFormData" label-width="120px">
          <el-form-item label="差异化方案ID(数字)">
            <el-input-number v-model="addFormData.PlanId" placeholder="请输入差异化方案ID" />
          </el-form-item>
          <el-form-item label="差异化方案名称">
            <el-input v-model="addFormData.PlanName" placeholder="请输入差异化方案名称" />
          </el-form-item>
          <el-form-item label="是否是默认方案">
            <el-radio-group v-model="addFormData.IsDefault">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">不是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-radio-group v-model="addFormData.IsDisabled">
              <el-radio :label="1">禁用</el-radio>
              <el-radio :label="0">未禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="平台">
            <el-checkbox-group v-model="addFormData.ScriptRuleDescription.PlatformList" @change="checkedBoxChange">
              <el-checkbox label="BP" value="BP" />
              <el-checkbox label="AP" value="AP" />
              <el-checkbox label="GP" value="GP" />
              <!-- <el-checkbox label="PG" value="PG"></el-checkbox> -->
              <el-checkbox label="TP" value="TP" />
              <el-checkbox label="SP" value="SP" />
              <el-checkbox label="CP" value="CP" />
            </el-checkbox-group>
          </el-form-item>
          <!--        <el-form-item label="用户类型">-->
          <!--           <el-select v-model.number="addFormData.ScriptRuleDescription.UserType">-->
          <!--              <el-option label="不限" :value="0" />-->
          <!--              <el-option label="新注" :value="1" />-->
          <!--              <el-option label="活跃" :value="2" />-->
          <!--              <el-option label="大R" :value="3" />-->
          <!--           </el-select>-->
          <!--        </el-form-item>-->
          <el-form-item label="用户标签">
            <div class="user-tags-scroll-container">
              <div class="user-tags-container">
                <div
                  v-for="(tag, index) in userTags"
                  :key="tag.value"
                  :class="['user-tag-item', index % 2 === 0 ? 'left-column' : 'right-column', { 'full-width-tag': isTagManyLevel(tag.value) && isTagSelected(tag.value) }]"
                >
                  <el-checkbox
                    v-model="selectedUserTags"
                    :label="tag.value"
                    :value="tag.value"
                    @change="handleUserTagChange(tag.value, $event)"
                  >
                    {{ tag.label }}
                  </el-checkbox>
                  <el-checkbox-group
                    v-if="!isBoolTag(tag.value) && isTagSelected(tag.value)"
                    v-model="tagValues[tag.value]"
                    :min="1"
                    class="inline-checkbox-group"
                  >
                    <el-checkbox v-for="(val, index) in tag.grade" :label="index+1" :value="index+1">{{ showTagName(tag.value, index+1) }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="流量控制(权重)">
            <el-input v-model.number="addFormData.ScriptRuleDescription.TrafficCtrl" placeholder=" " />
          </el-form-item>
          <el-form-item label="掐头下注次数">
            <el-input v-model.number="addFormData.ScriptRuleDescription.PlanFixedSpin" placeholder="" />
          </el-form-item>
          <fieldset>
            <legend>方案切换配置</legend>
            <el-form-item label="统计数据天数(1~7)">
              <el-input v-model.number="addFormData.SwitchRule.StatDays" placeholder="" />
            </el-form-item>
            <el-form-item label="下注次数最小值">
              <el-input v-model.number="addFormData.SwitchRule.SpinMin" placeholder="" />
            </el-form-item>
            <money-input v-model="addFormData.SwitchRule.BetMin" label="下注金额最小值" />
            <el-form-item label="切换目标方案ID(0为禁用)">
              <el-input v-model.number="addFormData.SwitchRule.TargetPlanId" placeholder="" />
            </el-form-item>
          </fieldset>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPlan">确定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑方案对话框 -->
      <el-dialog :visible.sync="editDialogVisible" title="编辑方案">
        <el-form :model="editFormData" label-width="120px">
          <el-form-item label="差异化方案ID(数字)">
            <el-input v-model.number="editFormData.PlanId" placeholder="请输入差异化方案ID" />
          </el-form-item>
          <el-form-item label="差异化方案名称">
            <el-input v-model="editFormData.PlanName" placeholder="请输入差异化方案名称" />
          </el-form-item>
          <el-form-item label="是否是默认方案">
            <el-radio-group v-model="editFormData.IsDefault">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">不是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-radio-group v-model="editFormData.IsDisabled">
              <el-radio :label="0">未禁用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台">
            <el-checkbox-group v-model="editFormData.ScriptRuleDescription.PlatformList" @change="checkedBoxChange">
              <el-checkbox label="BP" value="BP" />
              <el-checkbox label="AP" value="AP" />
              <el-checkbox label="GP" value="GP" />
              <el-checkbox label="PG" value="PG" />
              <el-checkbox label="TP" value="TP" />
              <el-checkbox label="SP" value="SP" />
            </el-checkbox-group>
          </el-form-item>
          <!--        <el-form-item label="用户类型">-->
          <!--          <el-input  v-model.number="editFormData.ScriptRuleDescription.UserType" placeholder=""></el-input>-->
          <!--        </el-form-item>-->
          <el-form-item label="用户标签">
            <div class="filter-buttons">
              <el-button
                size="mini"
                :type="filterType === 'all' ? 'primary' : 'default'"
                @click="filterType = 'all'"
              >
                显示全部
              </el-button>
              <el-button
                size="mini"
                :type="filterType === 'selected' ? 'primary' : 'default'"
                @click="filterType = 'selected'"
              >
                显示已选
              </el-button>
            </div>
            <div class="user-tags-scroll-container">
              <div class="user-tags-container">
                <div
                  v-for="(tag, index) in filteredUserTags"
                  :key="tag.value"
                  :class="['user-tag-item', index % 2 === 0 ? 'left-column' : 'right-column', { 'full-width-tag': isTagManyLevel(tag.value) && isTagSelected(tag.value) }]"
                >
                  <el-checkbox
                    v-model="selectedUserTags"
                    :label="tag.value"
                    :value="tag.value"
                    @change="handleUserTagChange(tag.value, $event)"
                  >
                    {{ tag.label }}
                  </el-checkbox>
                  <el-checkbox-group
                    v-if="!isBoolTag(tag.value) && isTagSelected(tag.value)"
                    v-model="tagValues[tag.value]"
                    :min="1"
                    class="inline-checkbox-group"
                  >
                    <el-checkbox v-for="(val, index) in tag.grade" :label="index+1" :value="index+1">{{ showTagName(tag.value, index+1) }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="流量控制(权重)">
            <el-input v-model.number="editFormData.ScriptRuleDescription.TrafficCtrl" placeholder=" " />
          </el-form-item>
          <el-form-item label="掐头下注次数">
            <el-input v-model.number="editFormData.ScriptRuleDescription.PlanFixedSpin" placeholder="" />
          </el-form-item>
          <fieldset>
            <legend>方案切换配置</legend>
            <el-form-item label="统计数据天数(1~7)">
              <el-input v-model.number="editFormData.SwitchRule.StatDays" placeholder="" />
            </el-form-item>
            <el-form-item label="下注次数最小值">
              <el-input v-model.number="editFormData.SwitchRule.SpinMin" placeholder="" />
            </el-form-item>
            <money-input v-model="editFormData.SwitchRule.BetMin" label="下注金额最小值" />
            <el-form-item label="切换目标方案ID(0为禁用)">
              <el-input v-model.number="editFormData.SwitchRule.TargetPlanId" placeholder="" />
            </el-form-item>
          </fieldset>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="查询结果"
        :visible.sync="getBetPlanver"
        width="50%"
        :destroy-on-close="true"
      >
        <el-table
          :data="this.showBetPlanverList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="betAmount"
            label="下注金额列表"
            width="180"
            sortable
          >
            <template slot-scope="{ row }">
              {{ row.betAmount }}
            </template>
          </el-table-column>
          <el-table-column
            prop="serialNumber"
            label="剧本功能的序列号"
            sortable
          >
            <template slot-scope="{ row }">
              {{ row.serialNumber }}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 编辑版本对话框 -->
      <el-dialog v-if="editVersionDialogVisible" :destroy-on-close="true" :visible.sync="editVersionDialogVisible" title="编辑版本">
        <el-form :model="editVersionFormData" label-width="120px">
          <el-form-item label="版本号">
            <el-input v-model.number="editVersionFormData.Version" placeholder="请输入版本号" :disabled="editVersionIsReady" />
          </el-form-item>
          <el-form-item label="版本说明">
            <el-input v-model="editVersionFormData.Comment" placeholder="请输入版本说明" :disabled="editVersionIsReady" />
          </el-form-item>
          <el-form-item label="是否就绪">
            <el-radio-group v-model="editVersionFormData.IsReady" @change="(event) => handleRadioChange(event, editVersionFormData,currentPlanIndex)">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">不是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="Version" label="单个剧本步数">
            <el-input-number v-model="editVersionFormData.ScriptCfg.ScriptSteps" size="mini" :disabled="editVersionIsReady" />
          </el-form-item>
          <el-form-item prop="Version" label="总剧本数量">
            <template slot-scope="scope">
              <el-input-number v-model="editVersionFormData.ScriptCfg.ScriptNumber" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-form-item>
          <el-form-item prop="Version" label="赔率配置" inline-message>
            <template slot-scope="scope">
              <el-button type="primary" size="mini" style="background: #f16f29" @click="openOddsCfg( editVersionFormData.ScriptCfg.OddsCfg)">配置</el-button>
            </template>
          </el-form-item>
          <el-form-item prop="Version" label="Scatter中奖次数配置">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" style="background: #ff6868" @click="openHitterHitCfg( editVersionFormData.ScriptCfg.ScatterHitCfg)">配置</el-button>
            </template>
          </el-form-item>
          <el-form-item prop="Version" label="下注金额的赔率配置">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" style="background: #29f1cd" @click="openBetOddsPlanCfg( editVersionFormData.ScriptCfg.BetOddsPlans)">配置</el-button>
            </template>
          </el-form-item>
          <!--        <el-form-item prop="Version" label="大奖配置">-->
          <!--          <template slot-scope="scope">-->
          <!--            <el-button @click="openBigPrizeOddsCfg(editVersionFormData.ScriptCfg.BigPrizeCfg)" type="primary" size="mini" style="background: #03a5ec">配置</el-button>-->
          <!--          </template>-->
          <!--        </el-form-item>-->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editVersionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEditVersion">确定</el-button>
        </div>
      </el-dialog>

      <!--   赔率配置弹窗  -->
      <el-dialog :visible.sync="editSlotsScriptOddsCfgVisible" title="倍率配置">
        <el-button v-if="!editVersionIsReady" type="success" size="mini" @click="appendComment(editSlotsScriptOddsCfgFormData,newOddsCfg())">添加</el-button>
        <el-tooltip content="检查是否命中不存在倍数" effect="dark" placement="top">
          <el-button type="primary" size="mini" style="background-color:#ec4580" @click="checkAbnormalSteps2()">检查
          </el-button>
        </el-tooltip>
        <el-tooltip
          content="检查剧本:最小倍数*出现次数<= 倍数总和 >=最大倍数*出现次数"
          class="item"
          effect="dark"
          placement="top"
        >
          <el-button type="primary" size="mini" style="background: #ff9100" @click="validateDteOddsSum">
            检查倍数总和区间
          </el-button>
        </el-tooltip>
        <el-tooltip content="检查剧本:当前倍数总和/剧本步数*基础投注" class="item" effect="dark" placement="top">
          <el-button type="primary" size="mini" style="background: #43bef3" @click="checkBetOdds">
            检查
          </el-button>
        </el-tooltip>
        <el-tooltip content="检查剧本中出现个数=单个剧本步数" class="item" effect="dark" placement="top">
          <el-button type="primary" size="mini" style="background: #43bef3" @click="checkScriptSum">
            检查个数总和
          </el-button>
        </el-tooltip>
        <el-tooltip content="xlsx/xls文件,格式保持一致,需要首行标题" effect="dark" placement="top">
          <input type="file" accept=".xlsx, .xls" size="mini" @change="handleFileUpload"></input>
        </el-tooltip>
        <el-table
          :data="editSlotsScriptOddsCfgFormData"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 1020px;"
          stripe
        >
          <el-table-column prop="Odds" label="最小倍数">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="最大倍数">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="在剧本中出现的个数">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.ScriptSteps" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="在剧本中的倍数总和">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.ScriptOddsSum" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="每个倍数正常图案缓存数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.NormalMatrixCacheSize" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="每个倍数Scatter图案缓存数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.ScatterMatrixCacheSize" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="使用改图案触发Scatter的概览">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.SwitchScatterPercent" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="触发Scatter的概率">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.TriggerScatterPercent" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="操作">
            <template slot-scope="scope">
              <el-button v-if="!editVersionIsReady" type="danger" size="mini" @click="delComment(editSlotsScriptOddsCfgFormData,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editSlotsScriptOddsCfgVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOddsCfg('OddsCfg',editSlotsScriptOddsCfgFormData)">确定</el-button>
        </div>
      </el-dialog>
      <!--    Scatter中奖次数配置-->
      <el-dialog :visible.sync="editScatterHitCfgVisible" title="Scatter中奖次数配置">
        <el-button v-if="!editVersionIsReady" type="success" size="mini" @click="appendComment(editScatterHitCfgFormData,newScatterHitCfg())">添加</el-button>
        <el-table
          :data="editScatterHitCfgFormData"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 1020px;"
          stripe
        >
          <el-table-column prop="Odds" label="总中奖次数">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.HitTimes" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="概率(万分比)">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.PerTenThousand" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>

          <el-table-column prop="Odds" label="操作">
            <template slot-scope="scope">
              <el-button v-if="!editVersionIsReady" type="danger" size="mini" @click="delComment(editScatterHitCfgFormData,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editScatterHitCfgVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOddsCfg('ScatterHitCfg',editScatterHitCfgFormData)">确定</el-button>
        </div>
      </el-dialog>
      <!-- 下注金额区分赔率方案配置-->
      <el-dialog :visible.sync="editBetOddsPlansVisible" title="下注金额区分赔率方案配置" width="1200px" :close-on-click-modal="false">
        <el-button v-if="!editVersionIsReady" type="success" size="mini" @click="appendComment(editBetOddsPlansFormData,newBetOddsPlans())">添加</el-button>

        <el-table
          :data="editBetOddsPlansFormData"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          stripe
        >
          <el-table-column prop="Odds" label="目标下注金额列表" width="250px">
            <template slot="header">
              <span>目标下注金额列表</span>
            </template>
            <template slot-scope="scope">
              <span v-for="(v,idx) in scope.row.TargetBets">
                <el-input v-model.number="scope.row.TargetBets[idx]" size="mini" :disabled="editVersionIsReady" @input="(v)=>(scope.row.TargetBets[idx]=v.replace(/[^\d.]/g,''))">
                  <template #prepend><el-button v-if="!editVersionIsReady" size="mini" @click="appendComment(scope.row.TargetBets,0)">添加</el-button></template>
                  <template #append><el-button v-if="!editVersionIsReady" size="mini" @click="delComment(scope.row.TargetBets,idx)">删除</el-button></template>
                </el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="OddsCfg" label="倍数配置">
            <template slot-scope="scope">
              <el-tooltip content="xlsx/xls文件,格式保持一致,需要首行标题" effect="dark" placement="top">
                <input type="file" accept=".xlsx, .xls" size="mini" @change="(event) => handleFileUpload2(event, scope.$index)"></input>
              </el-tooltip>
              <el-col :offset="1" :span="12">
                <el-tooltip content="检查是否命中不存在倍数" effect="dark" placement="top">
                  <el-button type="primary" size="mini" style="background-color:#ec4580" @click="checkAbnormalSteps(scope.$index)">检查
                  </el-button>
                </el-tooltip>
                <el-tooltip content="当前倍数总和/剧本步数*基础投注" effect="dark" placement="top">
                  <el-button type="primary" size="mini" style="background-color:#ff8000" @click="checkBetPlans(scope.$index)">检查
                  </el-button>
                </el-tooltip>
                <el-tooltip content="最小倍数*出现个数<=剧本总和<=最大倍数*出现个数" effect="dark" placement="top">
                  <el-button type="primary" size="mini" style="background-color:#b600ff" @click="checkBetPlansSum(scope.$index)">检查
                  </el-button>
                </el-tooltip>
                <el-tooltip content="总个数==单个剧本步数" effect="dark" placement="top">
                  <el-button type="primary" size="mini" style="background-color:#da00bd" @click="checkPlansSumScript(scope.$index)">检查总个数
                  </el-button>
                </el-tooltip>
              </el-col>
              <el-table :data="scope.row.OddsCfg" stripe>
                <el-table-column prop="Odds" label="最小倍数">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady" />
                  </template>
                </el-table-column>
                <el-table-column prop="Odds" label="最大倍数">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady" />
                  </template>
                </el-table-column>
                <el-table-column prop="Odds" label="剧本中出现的个数">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ScriptSteps" size="mini" :disabled="editVersionIsReady" />
                  </template>
                </el-table-column>
                <el-table-column prop="Odds" label="剧本中的倍数总和">
                  <template slot-scope="scopeRow">
                    <el-input v-model.number="scopeRow.row.ScriptOddsSum" size="mini" :disabled="editVersionIsReady" />
                  </template>
                </el-table-column>
                <el-table-column prop="Odds" label="操作">
                  <template slot-scope="scopeRow">
                    <el-button v-if="!editVersionIsReady" size="mini" @click="appendComment(scope.row.OddsCfg,newOdds())">添加</el-button>
                    <el-button v-if="!editVersionIsReady" size="mini" @click="delComment(scope.row.OddsCfg,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="操作" width="80px">
            <template slot-scope="scope">
              <el-button v-if="!editVersionIsReady" type="danger" size="mini" @click="delComment(editBetOddsPlansFormData,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editBetOddsPlansVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOddsCfg('BetOddsPlans',editBetOddsPlansFormData)">确定</el-button>
        </div>
      </el-dialog>
      <!-- 大奖配置-->
      <el-dialog :visible.sync="editBigPrizeOddsCfgVisible" title="大奖配置" width="1600px">
        <el-form>
          <el-col>
            <el-col :span="8">
              <el-form-item prop="Odds" label="下注总金额抽水比例(千分比)">
                <el-input v-model.number="editBigPrizeOddsCfgFormData.TaxPerThousand" size="mini" :disabled="editVersionIsReady"><template
                  #append
                >‰</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="Odds" label="中奖概率(百万分之一)">
                <el-input v-model.number="editBigPrizeOddsCfgFormData.HitPerMillion" size="mini" :disabled="editVersionIsReady" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="Odds" label="中奖最大间隔">
                <el-input v-model.number="editBigPrizeOddsCfgFormData.HitSteps" size="mini" :disabled="editVersionIsReady" />
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
        <el-button v-if="!editVersionIsReady" type="success" size="mini" @click="appendComment(editBigPrizeOddsCfgFormData.Plans,newBigPrizeCfg())">添加</el-button>

        <el-table
          :data="editBigPrizeOddsCfgFormData.Plans"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          stripe
        >

          <el-table-column prop="OddsMin" label="最小倍数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="OddsMax" label="最大倍数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="中奖倍数配置">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openBigPrizePlansCfg(scope.$index,scope.row.OddsCfg)">配置</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="操作" width="80px">
            <template slot-scope="scopeRow">
              <el-button v-if="!editVersionIsReady" type="danger" size="mini" @click="delComment(editBigPrizeOddsCfgFormData.Plans,scopeRow.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editBigPrizeOddsCfgVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOddsCfg('BigPrizeCfg',editBigPrizeOddsCfgFormData)">确定</el-button>
        </div>
      </el-dialog>

      <!--  大奖倍数配置   -->
      <el-dialog :visible.sync="editBigPrizeOddsPlansCfgVisible" title="大奖配置" width="600px">
        <el-button v-if="!editVersionIsReady" type="success" size="mini" @click="appendComment(editBigPrizeOddsPlansCfgFormData,newBigPrizeCfg())">添加</el-button>
        <el-table
          :data="editBigPrizeOddsPlansCfgFormData"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          stripe
        >
          <el-table-column prop="Odds" label="最小倍数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="最大倍数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="权重">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.Weight" size="mini" :disabled="editVersionIsReady" />
            </template>
          </el-table-column>
          <el-table-column prop="Odds" label="操作">
            <template slot-scope="scope">
              <el-button v-if="!editVersionIsReady" type="danger" size="mini" @click="delComment(editBigPrizeOddsPlansCfgFormData,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editBigPrizeOddsPlansCfgVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBigPrizeOddsCfg('BigPrizeCfg ',editBigPrizeOddsPlansCfgFormData)">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="确认操作"
        :visible.sync="showDeleteDialog"
        width="30%"
        :before-close="handleClose"
      >
        <template>
          <span>{{ tips }}</span>
        </template>
        <template #footer>
          <span>
            <el-button @click="showDeleteDialog = false">取消</el-button>
            <el-button type="success" @click="handleDelete()">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        title="确认操作"
        :visible.sync="showCompletionScript"
        width="30%"
      >
        <template>
          <table border="1">
            <thead>
              <tr>
                <th>键</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              <!-- 使用 v-for 循环遍历 showCompletionScriptMap 对象 -->
              <tr v-for="(v, k) in showCompletionScriptMap" :key="k">
                <td>{{ k }}</td>
                <td>{{ v }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <template #footer>
          <span>
            <el-button type="success" @click="showCompletionScript = false">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </span>
    <!--    </fieldset>-->
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import MoneyInput from '@/components/MoneyInput'
import ShowTip from '@/components/Tip/showTip.vue'
import { SubKeyMap } from '@/constants/subkey'
import { number } from 'echarts/lib/export'
import XLSX from 'xlsx'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { ShowTip, Compare, Publish, BetAmount, MoneyInput },
  data() {
    return {
      filterType: 'all', // 筛选类型：'all'显示全部，'selected'显示已选
      showItem: {
        SlotsType: 0,
        ID: 0,
        Plans: []
      },

      showDeleteType: 0,
      item: {},
      gameOptions: [],
      channels: [
        { 'label': '不限', 'value': '' },
        { 'label': 'BP', 'value': 'BP' },
        { 'label': 'GP', 'value': 'GP' },
        { 'label': 'AP', 'value': 'AP' }
        // {'label': 'PG', 'value': 'PG'} 2025-12-22去除PG
      ],
      queryGid: 82,
      form: {},
      subKey: 'millionaire_script_cfg',
      libShow: $libShow,
      AttrNames: {
        'Data.ScriptSteps': '单个剧本步数',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      detailVisible: false,
      slotCfg: {},
      localSubKeyMap: { ...SubKeyMap },
      addDialogVisible: false,
      addFormData: {
        PlanId: 0,
        PlanName: '',
        IsDefault: 0,
        IsDisabled: 0,
        ScriptRuleDescription: { Platform: '', UserType: 0, TrafficCtrl: 0, PlatformList: [], UserTagRules: [], PlanFixedSpin: 0 },
        SwitchRule: { StatDays: 0, SpinMin: 0, BetMin: 0, TargetPlanId: 0 }
      },
      editDialogVisible: false,
      editFormData: {
        PlanId: 0,
        PlanName: '',
        IsDefault: 0,
        IsDisabled: 0,
        ScriptRuleDescription: { Platform: '', UserType: 0, TrafficCtrl: 0, PlatformList: [], UserTagRules: [], PlanFixedSpin: 0 },
        SwitchRule: { StatDays: 0, SpinMin: 0, BetMin: 0, TargetPlanId: 0 }
      },
      editIndex: -1,

      editVersionDialogVisible: false,
      editVersionIsReady: false,
      versionStatus: 0,
      editVersionFormData: {
        Version: 0,
        Comment: '',
        IsReady: false,
        ScriptCfg:
          {
            ScriptSteps: 0,
            ScriptNumber: 0,
            OddsCfg: [],
            ScatterHitCfg: [],
            BetOddsPlans: [],
            BigPrizeCfg: {
              TaxPerThousand: 0,
              HitPerMillion: 0,
              HitSteps: 0,
              Plans: []
            }
          }

      },

      editSlotsScriptOddsCfgVisible: false,
      editSlotsScriptOddsCfgIndex: 0,
      editSlotsScriptOddsCfgFormData: [],
      currentPlanIndex: -1,
      currentVersionIndex: -1,

      editScatterHitCfgVisible: false,
      editScatterHitCfgIndex: 0,
      editScatterHitCfgFormData: [],

      editBetOddsPlansVisible: false,
      editBetOddsPlansIndex: 0,
      editBetOddsPlansFormData: [],

      editBigPrizeOddsCfgVisible: false,
      editBigPrizeOddsCfgIndex: 0,
      editBigPrizeOddsCfgFormData: {},

      editBigPrizeOddsPlansCfgVisible: false,
      editBigPrizeOddsPlansCfgIndex: 0,
      editBigPrizeOddsPlansCfgFormData: [],

      tips: '',
      showDeleteDialog: false,
      showTipsVal: 0,
      data1: {},
      data2: {},
      idx1: 0,
      idx2: 0,

      showCompletionScript: false,
      currentBaseBet: [],
      getBetPlanver: false,
      showBetPlanverList: [],
      showCompletionScriptMap: {},

      AdditionalArray: [
        { key: 100180, label: 'Fishing Master 额外加注 (GID:100180)' },
        { key: 100186, label: 'Mahjong Jackpot 额外加注 (GID:100186)' },
        { key: 100246, label: 'Tala Reyes South 额外加注 (GID:100246)' }
      ],
      scriptPlanVolatilityStat: {},
      selectedUserTags: [],
      tagValues: {},
      tagsConfig: [],
      userTags: [
        { 'value': 50001, 'label': 'Slots新增用户' },
        { 'value': 50002, 'label': 'Slots登录天数' },
        { 'value': 50003, 'label': 'Slots携带金额' },
        { 'value': 50004, 'label': 'Slots下注次数' },
        { 'value': 50005, 'label': 'Slots下注额度' },
        { 'value': 50006, 'label': 'Slots日均下注额度' },
        { 'value': 50007, 'label': 'Slots连续下注天数' },
        { 'value': 50008, 'label': 'Slots回归用户' },
        { 'value': 50009, 'label': 'Slots最近中奖上限' },

        { 'value': 50101, 'label': 'Slots扑克/麻将主题' },
        { 'value': 50102, 'label': 'Slots经典寻宝/777主题' },
        { 'value': 50103, 'label': 'Slots传说神话主题' },
        { 'value': 50104, 'label': 'Slots传统节日' },
        { 'value': 50105, 'label': 'Slots菲律宾特色主题' },
        { 'value': 50106, 'label': 'Slots动物与自然主题' },
        { 'value': 50107, 'label': 'Slots糖果系列' },
        { 'value': 50108, 'label': 'Slots小众系列' },
        { 'value': 50201, 'label': '连线全线' },
        { 'value': 50202, 'label': '连线固定线' },
        { 'value': 50203, 'label': '无线数量中奖' },
        { 'value': 50204, 'label': '无线相连中奖' },
        { 'value': 50205, 'label': '其他' },
        { 'value': 50301, 'label': '固定大奖' },
        { 'value': 50302, 'label': 'JP玩法' },
        { 'value': 50303, 'label': 'Bonus玩法' },
        { 'value': 50304, 'label': 'FreeSpin玩法' },

        { 'value': 50010, 'label': '用户第1日玩牌次数' },
        { 'value': 50011, 'label': '用户第2日玩牌次数' },
        { 'value': 50012, 'label': '用户第3日玩牌次数' },
        { 'value': 50013, 'label': '用户第4日玩牌次数' },
        { 'value': 50014, 'label': '用户第5日玩牌次数' },
        { 'value': 50015, 'label': '用户第6日玩牌次数' },
        { 'value': 50016, 'label': '用户第7日玩牌次数' },
        { 'value': 50017, 'label': '用户第8日玩牌次数' },
        { 'value': 50018, 'label': '用户第9日玩牌次数' },
        { 'value': 50019, 'label': '用户第10日玩牌次数' },
        { 'value': 50020, 'label': '用户第11日玩牌次数' },
        { 'value': 50021, 'label': '用户第12日玩牌次数' },
        { 'value': 50022, 'label': '用户第13日玩牌次数' },
        { 'value': 50023, 'label': '用户第14日玩牌次数' },
        { 'value': 50024, 'label': '用户第15日玩牌次数' },

        { 'value': 50025, 'label': '用户第1日携带额度' },
        { 'value': 50026, 'label': '用户第2日携带额度' },
        { 'value': 50027, 'label': '用户第3日携带额度' },
        { 'value': 50028, 'label': '用户第4日携带额度' },
        { 'value': 50029, 'label': '用户第5日携带额度' },
        { 'value': 50030, 'label': '用户第6日携带额度' },
        { 'value': 50031, 'label': '用户第7日携带额度' },
        { 'value': 50032, 'label': '用户第8日携带额度' },
        { 'value': 50033, 'label': '用户第9日携带额度' },
        { 'value': 50034, 'label': '用户第10日携带额度' },
        { 'value': 50035, 'label': '用户第11日携带额度' },
        { 'value': 50036, 'label': '用户第12日携带额度' },
        { 'value': 50037, 'label': '用户第13日携带额度' },
        { 'value': 50038, 'label': '用户第14日携带额度' },
        { 'value': 50039, 'label': '用户第15日携带额度' }
      ]
    }
  },
  computed: {
    // 根据筛选类型过滤用户标签
    filteredUserTags() {
      if (this.filterType === 'selected') {
        // 只显示已选中的标签
        return this.userTags.filter(tag => this.selectedUserTags.includes(tag.value))
      }
      // 默认显示全部标签
      return this.userTags
    }
  },
  created() {
    this.fetchData()
    this.getTagConfig()
  },
  methods: {
    async fetchData() {
      await this.getConfigData()
      await this.getGameList()
      await this.getData()
    },
    getFullKey() {
      return 'SlotsCustomScriptConfig_' + this.queryGid
    },

    getData() {
      this.item = null
      request({
        url: '/slotsScriptV3Config/one',
        method: 'get',
        data: {
          SlotsType: this.queryGid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.item = response.Data
        }
        this.queryKeyInput()
      })
    },
    queryBase(gid) { // 加载基础配置
      let key = ''
      key = this.localSubKeyMap[gid] || ''
      if (key === '') {
        return
      }
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: key
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const baseCfg = JSON.parse(response.Data.Data)
          this.currentBaseBet = []
          if (baseCfg.BetList) {
            if (gid > 100000) {
              for (const k in baseCfg.BetList) {
                this.currentBaseBet.push(baseCfg.BetList[k] * 1.5)
              }
            } else {
              for (const k in baseCfg.BetList) {
                this.currentBaseBet.push(baseCfg.BetList[k])
              }
            }
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },
    querySlotBase(planID) {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/custom/script/plan/ver',
          Env: store.getters.env,
          planID: planID,
          gameID: this.queryGid,
          bets: JSON.stringify(this.currentBaseBet),
          appID: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.showBetPlanverList = []
          this.showBetPlanverList = Object.entries(response.Data)
            .map(([key, value]) => ({
              betAmount: Number(key) / 1000,
              serialNumber: value
            }))
            .sort((a, b) => a.betAmount - b.betAmount)
        }
        this.getBetPlanver = true
      }).catch(e => {
        console.log(e)
      })
    },
    processedBetData() {
      return Object.entries(this.showBetPlanverMap)
        .map(([key, value]) => ({
          originalKey: Number(key),
          betAmount: Number(key) / 1000,
          serialNumber: value
        }))
        .sort((a, b) => a.originalKey - b.originalKey)
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || (response.Data[i].Gid > 499 && response.Data[i].Gid !== 1236 && response.Data[i].Gid !== 1237 && response.Data[i].Gid !== 1242)) {
              continue
            }
            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name + ' (GID:' + response.Data[i].Gid + ')'
            })
          }
          this.appendAdditional()
          this.gameOptions.sort((a, b) => a.label.localeCompare(b.label))
        }
      })
    },
    getGameName(gid) {
      for (const o of this.gameOptions) {
        if (o.key === parseInt(gid)) {
          return o.label
        }
      }
    },
    appendAdditional() {
      for (const o of this.AdditionalArray) {
        this.gameOptions.push(o)
      }
    },

    checkedBoxChange(a) {
      this.$forceUpdate() // 强制渲染多选框样式，否则值变了样式没有选中
    },
    proceedData(plans) {
      for (const oz of plans) {
        for (const v of oz.Versions) {
          for (const p of v.ScriptCfg.BetOddsPlans) {
            for (const i in p.TargetBets) {
              p.TargetBets[i] /= 1000
            }
          }
        }
        if (oz.ScriptRule.Platform !== '') {
          oz.ScriptRule['PlatformList'] = oz.ScriptRule.Platform.split(',')
        } else {
          oz.ScriptRule['PlatformList'] = [
            'BP',
            'AP',
            'GP',
            'PG',
            'TP',
            'SP'
          ]
        }
      }
    },
    proceedUpdateData(items) {
      for (const o of items) {
        for (const v of o.Versions) {
          for (const p of v.ScriptCfg.BetOddsPlans) {
            for (const i in p.TargetBets) {
              p.TargetBets[i] = parseInt(parseFloat(p.TargetBets[i]) * 1000)
            }
          }
        }
        for (let i = 0; i < o.ScriptRule.PlatformList.length; i++) {
          if (o.ScriptRule.PlatformList[i] === '') {
            o.ScriptRule.PlatformList.splice(i, 1)
          }
        }
        // if (o.ScriptRule.PlatformList.length>0){
        o.ScriptRule.Platform = o.ScriptRule.PlatformList.join()
        // }
      }
      return items
    },
    async queryKeyInput() {
      this.queryBase(this.queryGid)
      this.queryScriptVolatility(this.queryGid)
      this.updateUserTags()
      if (this.item !== null) {
        const a = JSON.parse(this.item.ConfigData)
        for (const k in a) {
          if (typeof a[k].ScriptRule.UserTagRules === 'undefined') {
            a[k].ScriptRule.UserTagRules = []
          }
        }
        this.showItem.SlotsType = this.item.SlotsType
        this.showItem.Plans = a
        this.showItem.ID = this.item.ID
        this.$refs.compare.SetOldVal(JSON.parse(JSON.stringify(this.showItem.Plans)))
        this.proceedData(this.showItem.Plans)
        this.$forceUpdate()
        return
      }
      this.showItem.SlotsType = this.queryGid
      this.showItem.Plans = this.newPlansCfg()
      this.showItem.ID = 0
    },
    newItem() {
      return {
        SlotsType: this.queryGid,
        Plans: []
      }
    },
    openAddDialog() {
      // 清空当前选中的标签和值
      this.selectedUserTags = []
      this.tagValues = {}

      this.addDialogVisible = true
      this.addFormData = {
        PlanId: this.showItem.Plans.length + 1,
        PlanName: '新增方案' + this.showItem.Plans.length + 1,
        IsDefault: 0,
        IsDisabled: 1,
        Versions: [

        ],
        ScriptRuleDescription: { Platform: '', UserType: 0, TrafficCtrl: 0, PlatformList: [], UserTagRules: [], PlanFixedSpin: 0 },
        SwitchRule: { StatDays: 0, SpinMin: 0, BetMin: 0, TargetPlanId: 0 }
      }
    },
    addPlan() {
      if (isNaN(parseInt(this.addFormData.SwitchRule.StatDays))) {
        Message.error('方案切换配置的统计数据天数请在1~7天之间!')
        return
      }
      if (isNaN(parseInt(this.addFormData.SwitchRule.SpinMin))) {
        Message.error('方案切换配置的最小下注次数必须是个数字!')
        return
      }
      if (isNaN(parseInt(this.addFormData.SwitchRule.BetMin))) {
        Message.error('方案切换配置的最小下注金额必须是个数字!')
        return
      }
      if (isNaN(parseInt(this.addFormData.SwitchRule.TargetPlanId))) {
        Message.error('方案切换配置的目标方案ID必须是个数字!')
        return
      }
      if (this.addFormData.SwitchRule.StatDays < 0 || this.addFormData.SwitchRule.StatDays > 7) {
        Message.error('方案切换配置的统计数据天数请在1~7天之间!')
        return
      }
      // 确保UserTags格式正确
      this.addFormData.ScriptRuleDescription.UserTagRules = this.selectedUserTags.map(tagId => ({
        TagId: tagId,
        TagValues: this.tagValues[tagId] || []
      }))

      const newPlan = {
        PlanId: this.addFormData.PlanId,
        PlanName: this.addFormData.PlanName,
        IsDefault: this.addFormData.IsDefault,
        IsDisabled: this.addFormData.IsDisabled,
        Versions: [],
        ScriptRule: this.addFormData.ScriptRuleDescription,
        SwitchRule: { StatDays: 0, SpinMin: 0, BetMin: 0, TargetPlanId: 0 }
      }
      this.showItem.Plans.push(newPlan)
      this.addDialogVisible = false
    },
    openEditDialog(row, idx) {
      this.editIndex = idx
      if (typeof row.ScriptRule.PlanFixedSpin === 'undefined') {
        this.editFormData.ScriptRuleDescription.PlanFixedSpin = 0
      }
      this.editFormData = {
        PlanId: row.PlanId,
        PlanName: row.PlanName,
        IsDefault: row.IsDefault,
        IsDisabled: row.IsDisabled,
        ScriptRuleDescription: row.ScriptRule,
        SwitchRule: row.SwitchRule || { StatDays: 0, SpinMin: 0, BetMin: 0, TargetPlanId: 0 }
      }

      // 初始化用户标签数据
      this.initUserTagsData()
      this.editDialogVisible = true
    },
    saveEdit() {
      if (isNaN(parseInt(this.editFormData.SwitchRule.StatDays))) {
        Message.error('方案切换配置的统计数据天数请在1~7天之间!')
        return
      }
      if (isNaN(parseInt(this.editFormData.SwitchRule.SpinMin))) {
        Message.error('方案切换配置的最小下注次数必须是个数字!')
        return
      }
      if (isNaN(parseInt(this.editFormData.SwitchRule.BetMin))) {
        Message.error('方案切换配置的最小下注金额必须是个数字!')
        return
      }
      if (isNaN(parseInt(this.editFormData.SwitchRule.TargetPlanId))) {
        Message.error('方案切换配置的目标方案ID必须是个数字!')
        return
      }
      if (this.editFormData.SwitchRule.StatDays < 0 || this.editFormData.SwitchRule.StatDays > 7) {
        Message.error('方案切换配置的统计数据天数请在1~7天之间!')
        return
      }

      // 确保UserTags格式正确
      this.editFormData.ScriptRuleDescription.UserTagRules = this.selectedUserTags.map(tagId => ({
        TagId: tagId,
        TagValues: this.tagValues[tagId] || []
      }))

      const updatedPlan = {
        PlanId: this.editFormData.PlanId,
        PlanName: this.editFormData.PlanName,
        IsDefault: this.editFormData.IsDefault,
        IsDisabled: this.editFormData.IsDisabled,
        Versions: this.showItem.Plans[this.editIndex].Versions,
        ScriptRule: this.editFormData.ScriptRuleDescription,
        SwitchRule: this.editFormData.SwitchRule
      }
      this.showItem.Plans.splice(this.editIndex, 1, updatedPlan)
      this.editDialogVisible = false
    },
    deletePlan(index) {
      this.showItem.Plans.splice(index, 1)
    },
    openAddVersionDialog(planIndex) {
      this.versionStatus = 0
      this.editVersionFormData = this.newVersion()
      let maxVersion = 0
      for (const o of this.showItem.Plans[planIndex].Versions) {
        if (o.Version > maxVersion) {
          maxVersion = o.Version
        }
      }
      this.editVersionFormData.Version = maxVersion + 1

      this.currentPlanIndex = planIndex
      this.saveEditVersion()
    },
    newVersion() {
      return {
        Version: 0,
        Comment: '',
        IsReady: false,
        ScriptCfg:
          {
            ScriptSteps: 0,
            ScriptNumber: 0,
            OddsCfg: [],
            ScatterHitCfg: [],
            BetOddsPlans: [],
            BigPrizeCfg: {
              TaxPerThousand: 0,
              HitPerMillion: 0,
              HitSteps: 0,
              Plans: []
            }
          }
      }
    },
    openEditVersionDialog(planIndex, versionIndex) {
      this.editVersionDialogVisible = true
      const version = this.showItem.Plans[planIndex].Versions[versionIndex]
      this.versionStatus = 1
      this.editVersionIsReady = version.IsReady
      this.editVersionFormData = {
        Version: version.Version,
        Comment: version.Comment,
        IsReady: version.IsReady,
        ScriptCfg: version.ScriptCfg
      }
      this.currentPlanIndex = planIndex
      this.currentVersionIndex = versionIndex
    },
    copyVersionDialog(planIndex, versionIndex) {
      const version = this.showItem.Plans[planIndex].Versions[versionIndex]
      let maxVersion = 0
      for (const o of this.showItem.Plans[planIndex].Versions) {
        if (o.Version > maxVersion) {
          maxVersion = o.Version
        }
      }
      const copy = JSON.parse(JSON.stringify(version))
      copy.Version = maxVersion + 1
      copy.IsReady = false
      this.showItem.Plans[planIndex].Versions.push(copy)
    },
    getConfigData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'SlotsScriptStatisticsConfig'
        }
      }).then(response => {
        if (response.Data.Data !== '') {
          const arr = JSON.parse(response.Data.Data)
          for (const o of arr) {
            for (const oElement of this.AdditionalArray) {
              if (o.Gid + 100000 === oElement.key) {
                this.slotCfg[o.Gid + 100000] = o
              } else {
                this.slotCfg[o.Gid] = o
              }
            }
          }
        }
      })
    },
    getTagConfig() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/thirdparties/tag/config'
        }
      }).then(response => {
        if (response.Data !== '') {
          response.Data.sort((a, b) => a.id - b.id)
          this.tagsConfig = []
          for (const o of response.Data) {
            if (o.tagId >= 50000) {
              this.tagsConfig.push(o)
            }
          }
          this.updateUserTags()
        }
      })
    },
    updateUserTags() {
      this.userTags = []
      for (const o of this.tagsConfig) {
        if (o.tagGid > 0 && o.tagGid != this.queryGid) {
          continue
        }
        const attr = JSON.parse(o.tagAttr)
        this.userTags.push({
          'value': o.tagId,
          'label': o.tagName,
          'grade': attr.grade
        })
      }
      this.userTags.sort((a, b) => a.grade - b.grade)
    },
    saveEditVersion() {
      const updatedVersion = {
        Version: this.editVersionFormData.Version,
        Comment: this.editVersionFormData.Comment,
        ScriptCfg: this.editVersionFormData.ScriptCfg,
        IsReady: this.editVersionFormData.IsReady
      }
      if (this.versionStatus === 0) {
        this.showItem.Plans[this.currentPlanIndex].Versions.push(updatedVersion)
      } else {
        this.showItem.Plans[this.currentPlanIndex].Versions.splice(this.currentVersionIndex, 1, updatedVersion)
      }
      this.editVersionDialogVisible = false
    },
    deleteVersion(planIndex, versionIndex) {
      this.showItem.Plans[planIndex].Versions.splice(versionIndex, 1)
    },

    appendComment(arr, obj) {
      if (!arr) {
        arr = []
      }
      arr.push(obj)
      this.$forceUpdate()
    },
    delComment(arr, idx) {
      if (arr.length <= 1) {
        Message.info('至少需要一个配置')
        return
      }
      arr.splice(idx, 1)
      this.$forceUpdate()
    },
    openOddsCfg(obj) {
      this.editSlotsScriptOddsCfgVisible = true
      this.editSlotsScriptOddsCfgFormData = obj
    },
    saveOddsCfg(key, obj) {
      this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg[key] = JSON.parse(JSON.stringify(obj))
      this.editSlotsScriptOddsCfgVisible = false
      this.editScatterHitCfgVisible = false
      this.editBetOddsPlansVisible = false
      this.editBigPrizeOddsCfgVisible = false
    },
    saveBigPrizeOddsCfg(key, obj) {
      this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.BigPrizeCfg.Plans[this.editBigPrizeOddsPlansCfgIndex].OddsCfg = JSON.parse(JSON.stringify(obj))
      this.editBigPrizeOddsPlansCfgVisible = false
    },
    openHitterHitCfg(obj) {
      this.editScatterHitCfgVisible = true
      this.editScatterHitCfgFormData = obj
    },
    openBetOddsPlanCfg(obj) {
      this.editBetOddsPlansVisible = true
      this.editBetOddsPlansFormData = obj
    },
    openBigPrizeOddsCfg(obj) {
      this.editBigPrizeOddsCfgVisible = true
      this.editBigPrizeOddsCfgFormData = obj
    },
    openBigPrizePlansCfg(idx, obj) {
      this.editBigPrizeOddsPlansCfgVisible = true
      this.editBigPrizeOddsPlansCfgIndex = idx
      this.editBigPrizeOddsPlansCfgFormData = obj
    },
    newSlotsScriptCfg() {
      return {
        OddsCfg: [],
        ScatterHitCfg: [],
        ScriptSteps: 0,
        ScriptNumber: 0,
        BigPrizeCfg: {
          TaxPerThousand: 0,
          HitPerMillion: 0,
          HitSteps: 0,
          Plans: []
        },
        BetOddsPlans: []
      }
    },
    newOddsCfg() {
      return {
        OddsMin: 0,
        OddsMax: 0,
        ScriptSteps: 0,
        ScriptOddsSum: 0,
        NormalMatrixCacheSize: 0,
        ScatterMatrixCacheSize: 0,
        SwitchScatterPercent: 0,
        TriggerScatterPercent: 0
      }
    },
    newScatterHitCfg() {
      return {
        HitTimes: 0,
        PerTenThousand: 0
      }
    },
    newBetOddsPlans() {
      return {
        TargetBets: [0],
        OddsCfg: [
          {
            OddsMin: 0,
            OddsMax: 0,
            ScriptSteps: 0,
            ScriptOddsSum: 0
          }
        ]
      }
    },
    newOdds() {
      return {
        OddsMin: 0,
        OddsMax: 0,
        ScriptSteps: 0,
        ScriptOddsSum: 0
      }
    },
    newBigPrizeCfg() {
      return this.newBigPrizePlanCfg()
    },
    newBigPrizePlanCfg() {
      return {
        OddsMin: 0,
        OddsMax: 0,
        OddsCfg: []
      }
    },
    newPlansCfg() {
      return [
        {
          PlanId: 1,
          PlanName: '新增方案',
          IsDefault: 1,
          IsDisabled: 1,
          Versions: [
            {
              Version: 1,
              Comment: '新增版本说明',
              ScriptCfg: {
                OddsCfg: [],
                ScatterHitCfg: [],
                ScriptSteps: 0,
                ScriptNumber: 0,
                BigPrizeCfg: {
                  TaxPerThousand: 0,
                  HitPerMillion: 0,
                  HitSteps: 0,
                  Plans: []
                },
                BetOddsPlans: []
              }
            }
          ],
          ScriptRule: { Platform: '', UserType: 0, TrafficCtrl: 0, PlatformList: [], PlanFixedSpin: 0 }
        }
      ]
    },
    async saveCfgByGid() {
      if (this.showItem.ID > 0) {
        this.$refs.compare.SetNewVal(this.proceedUpdateData(JSON.parse(JSON.stringify(this.showItem.Plans))))
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.updateCfg()
          }
        })
      } else {
        await this.createCfg()
      }
      // await this.queryKeyInput()
    },

    updateCfg() {
      if (!this.checkData()) {
        return
      }
      const items = this.proceedUpdateData(JSON.parse(JSON.stringify(this.showItem.Plans)))
      request({
        url: '/slotsScriptV3Config/update',
        method: 'post',
        data: {
          ID: this.showItem.ID,
          SlotsType: this.showItem.SlotsType,
          ConfigData: JSON.stringify(items)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.getData()
        }
      })
    },
    createVersion(row, planRow) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/slotsStat/script/plan/data',
          planID: planRow.PlanId,
          gameID: $this.queryGid,
          planVer: row.Version,
          appID: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getTodayRaffleAmount', response.Data)
          if (response.Data) {
            console.log('todayRaffleAmount', $this.todayRaffleAmount)
          }
        }
      })
    },
    getVersion(row, planRow) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/script/plan/data',
          planID: planRow.PlanId,
          gameID: $this.queryGid,
          planVer: row.Version,
          appID: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data) {
            this.showCompletionScriptMap = response.Data
          }
          this.showCompletionScript = true
        }
      })
    },
    createCfg() {
      const val = JSON.parse(JSON.stringify(this.showItem.Plans))
      const items = this.proceedUpdateData(val)
      JSON.stringify(this.showItem.Plans)
      request({
        url: '/slotsScriptV3Config/create',
        method: 'post',
        data: {
          SlotsType: this.showItem.SlotsType,
          ConfigData: JSON.stringify(items)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
          this.getData()
        }
      })
    },
    checkData() {
      if (this.showItem.SlotsType <= 0) {
        Message.error('请选择游戏类型！')
        return false
      }
      if (this.showItem.Plans.length <= 0) {
        Message.error('请添加方案！')
        return false
      }
      for (const o of this.showItem.Plans) {
        if (o.ScriptRule.TrafficCtrl <= 0) {
          Message.error('请设置流量控制！')
          return false
        }
      }
      return true
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          this.editSlotsScriptOddsCfgFormData = []
          json.forEach((row, index) => {
            if (index > 0) {
              const idx = index - 1

              this.editSlotsScriptOddsCfgFormData.push({
                OddsMin: row[0],
                OddsMax: row[1],
                ScriptSteps: row[2],
                ScriptOddsSum: row[3],
                NormalMatrixCacheSize: row[4],
                ScatterMatrixCacheSize: row[5],
                SwitchScatterPercent: row[6],
                TriggerScatterPercent: row[7]
              })
            }
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    handleFileUpload2(event, datIdx) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          this.editBetOddsPlansFormData[datIdx].OddsCfg = []
          json.forEach((row, index) => {
            if (index > 0) {
              const idx = index - 1

              this.editBetOddsPlansFormData[datIdx].OddsCfg.push({
                OddsMin: row[0],
                OddsMax: row[1],
                ScriptSteps: row[2],
                ScriptOddsSum: row[3]
              })
            }
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    checkBetOdds(idx) {
      let cnt = 0
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        const obj = this.editSlotsScriptOddsCfgFormData[i]
        cnt += obj.ScriptOddsSum
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps

      Message.success('当前百分比：' + (cnt / (scriptSteps * Number(this.slotCfg[this.queryGid].Bet)) * 100).toFixed(3) + '%')
    },
    checkScriptSum() {
      let cnt = 0
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        const obj = this.editSlotsScriptOddsCfgFormData[i]
        cnt += obj.ScriptSteps
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps
      if (cnt === scriptSteps) {
        Message.success('当前总数:' + cnt + ' 剧本步数:' + scriptSteps)
      } else {
        Message.error('当前总数:' + cnt + ' 剧本步数:' + scriptSteps)
      }
    },
    validateDteOddsSum() {
      let str = ''
      if (this.editSlotsScriptOddsCfgFormData.length === 0) {
        this.$message.error('阿达西,你的数据呢')
        return
      }
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        const obj = this.editSlotsScriptOddsCfgFormData[i]
        if (obj.OddsMin * obj.ScriptSteps <= obj.ScriptOddsSum && obj.ScriptOddsSum <= obj.OddsMax * obj.ScriptSteps) {
        } else {
          const a = Number(i) + 1
          str += `第${a}行数据校验不通过\n`
        }
      }
      if (str.length > 0) {
        this.$message.error(str)
      } else {
        this.$message.success('检查通过')
      }
    },
    checkBetPlans(idx) {
      let cnt = 0
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg) {
        cnt += o.ScriptOddsSum
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps

      Message.success('当前百分比：' + (cnt / (scriptSteps * Number(this.slotCfg[this.queryGid].Bet)) * 100).toFixed(3) + '%')
    },
    checkAbnormalSteps(idx) {
      let gid = this.queryGid
      if (gid > 100000) {
        gid = gid - 100000
      }
      if (!this.slotCfg[gid].AbnormalSteps) {
        Message.error('请设置异常步数！')
        return
      }
      var strings = this.slotCfg[gid].AbnormalSteps.split(',')
      for (const i in this.editBetOddsPlansFormData[idx].OddsCfg) {
        const o = this.editBetOddsPlansFormData[idx].OddsCfg[i]
        for (const strNum of strings) {
          if (o.OddsMax > parseInt(strNum) && o.OddsMin < parseInt(strNum)) {
            const ss = (parseInt(i) + 1)
            Message.error('第' + (ss) + '行异常步数【' + strings + '】包含在配置内,min:' + o.OddsMin + ' max:' + o.OddsMax)
            return
          }
        }
      }
    },
    checkAbnormalSteps2() {
      let gid = this.queryGid
      if (gid > 100000) {
        gid = gid - 100000
      }
      if (!this.slotCfg[gid].AbnormalSteps) {
        Message.error('请设置异常步数！')
        return
      }
      var strings = this.slotCfg[gid].AbnormalSteps.split(',')
      for (const i in this.editVersionFormData.ScriptCfg.OddsCfg) {
        const o = this.editVersionFormData.ScriptCfg.OddsCfg[i]
        for (const strNum of strings) {
          if (o.OddsMax > parseInt(strNum) && o.OddsMin < parseInt(strNum)) {
            const ss = (parseInt(i) + 1)
            Message.error('第' + (ss) + '行异常步数【' + strings + '】包含在配置内,min:' + o.OddsMin + ' max:' + o.OddsMax)
            return
          }
        }
      }
      this.$message.success('无禁止倍数')
    },
    checkBetPlansSum(idx) {
      const msgArr = []
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg) {
        if ((o.OddsMin * o.ScriptSteps) > o.ScriptOddsSum) {
          msgArr.push('最小倍数:' + o.OddsMin + ' 出现步数:' + o.ScriptSteps + ' 倍数总和:' + o.ScriptOddsSum)
        }
        if ((o.OddsMax * o.ScriptSteps) < o.ScriptOddsSum) {
          msgArr.push('最大倍数:' + o.OddsMax + ' 出现步数:' + o.ScriptSteps + ' 倍数总和:' + o.ScriptOddsSum)
        }
      }
      if (msgArr.length <= 0) {
        Message.success('数据ok的！')
      } else {
        Message.error('数据异常：' + msgArr.join('，'))
      }
    },
    checkPlansSumScript(idx) {
      let cnt = 0
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg) {
        cnt += o.ScriptSteps
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps
      if (cnt === scriptSteps) {
        Message.success('当前总数:' + cnt + ' 剧本步数:' + scriptSteps)
      } else {
        Message.error('当前总数:' + cnt + ' 剧本步数:' + scriptSteps)
      }
    },
    // 关闭弹窗时的处理函数
    handleClose(done) {
      this.showDeleteDialog = false
      done()
    },
    showTips(val, data1, data2) {
      this.showDeleteDialog = true
      this.showTipsVal = val
      if (val === 1) {
        this.tips = '是否创建配置'
        this.data1 = data1
        this.data2 = data2
      }
      if (val === 2) {
        this.tips = '是否删除该版本'
        this.idx1 = data1
        this.idx2 = data2
      }
      if (val === 3) {
        this.tips = '是否删除该方案'
        this.idx1 = data1
        this.idx2 = data2
      }
      if (val === 4) {
        this.tips = '是否复制该方案'
        this.data1 = data1
      }
    },
    // 处理删除操作的函数
    handleDelete(val) {
      // 这里可以添加实际的删除逻辑，例如调用接口删除数据
      if (this.showTipsVal === 1) {
        this.createVersion(this.data1, this.data2)
      }
      if (this.showTipsVal === 2) {
        this.deleteVersion(this.idx1, this.idx2)
      }
      if (this.showTipsVal === 3) {
        this.deletePlan(this.idx1)
      }
      if (this.showTipsVal === 4) {
        this.copyPlan(this.idx1, this.idx2)
      }
      this.showDeleteDialog = false // 关闭弹窗
    },
    copyPlan() {
      const val = JSON.parse(JSON.stringify(this.data1))
      val.IsDefault = 0
      val.IsDisabled = 1
      val.PlanId = this.showItem.Plans.length + 1
      // versionScope.row.IsReady
      for (const o of val.Versions) {
        o.IsReady = false
      }

      this.showItem.Plans.push(val)
    },
    handleRadioChange(newValue, row, planIdx) {
      if (newValue) {
        const $this = this
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Path: '/slotsStat/script/plan/data',
            planID: this.showItem.Plans[planIdx].PlanId,
            gameID: $this.queryGid,
            planVer: row.Version,
            appID: 0
          }
        }).then(response => {
          if (response.RetCode !== 0 && typeof response.Data !== 'object') {
            Message.error('没有创建剧本，请先创建剧本再选择')
            row.IsReady = false
          }
        })
        console.log('选择了“是”')
      }
    },
    makeContent(key, addData, delData, editData) {
      return '【' + this.getGameName(this.queryGid) + '】'
    },
    delScripts(planId, planVer) {
      const $this = this
      this.$confirm('该操作具有高风险，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Path: '/slotsStat/clean/scripts',
            gid: $this.queryGid,
            planId: planId,
            planVer: planVer,
            appId: 0
          }
        }).then(response => {
          if (response.RetCode !== 0 && typeof response.Data !== 'object') {
            Message.error('没有创建剧本，请先创建剧本再选择')
            row.IsReady = false
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    queryScriptVolatility(gid) {
      for (const k in this.scriptPlanVolatilityStat) {
        this.$set(this.scriptPlanVolatilityStat, k, '0.00')
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/script/volatility',
          gid: gid,
          appId: 0
        }
      }).then(response => {
        if (response.RetCode !== 0 && typeof response.Data !== 'object') {
          this.scriptPlanVolatilityStat = {}
        } else {
          for (const k in response.Data) {
            const v = response.Data[k] / 10000
            this.$set(this.scriptPlanVolatilityStat, k, v.toFixed(2))
          }
        }
      })
    },
    // 判断标签是否被选中
    isTagSelected(tagValue) {
      return this.selectedUserTags.includes(tagValue)
    },
    isTagManyLevel(tagId) {
      return (tagId >= 50010 && tagId < 50040)
    },
    isBoolTag(tagId) {
      return tagId === 50001 || tagId === 50008
    },
    showTagName(tagId, grade) {
      if (tagId >= 50010 && tagId < 50040) {
        return grade + '级'
      }
      return grade === 1 ? '轻度' : (grade === 2 ? '中度' : '重度')
    },
    // 处理用户标签变化
    handleUserTagChange(tagId, isSelected) {
      if (isSelected) {
        // 如果标签被选中，确保tagValues中有对应的数组
        if (!this.tagValues[tagId]) {
          if (this.isBoolTag(tagId)) {
            this.$set(this.tagValues, tagId, [0])
          } else if (this.isTagManyLevel(tagId)) {
            this.$set(this.tagValues, tagId, [this.userTags.find(tag => tag.value === tagId).grade.length])
          } else {
            this.$set(this.tagValues, tagId, [3])
          }
        }
      } else {
        // 如果标签被取消选中，从tagValues中移除对应的值
        if (this.tagValues[tagId]) {
          this.$delete(this.tagValues, tagId)
        }
      }
      // 更新UserTags为所需格式
      this.editFormData.ScriptRuleDescription.UserTagRules = this.selectedUserTags.map(tagId => ({
        TagId: tagId,
        TagValues: this.tagValues[tagId] || []
      }))
    },

    // 初始化用户标签数据（在打开编辑对话框时调用）
    initUserTagsData() {
      // 清空当前选中的标签和值
      this.selectedUserTags = []
      this.tagValues = {}

      // 从editFormData中恢复数据
      if (this.editFormData.ScriptRuleDescription.UserTagRules &&
          Array.isArray(this.editFormData.ScriptRuleDescription.UserTagRules)) {
        for (const userTag of this.editFormData.ScriptRuleDescription.UserTagRules) {
          if (userTag.TagId) {
            this.selectedUserTags.push(userTag.TagId)
            if (userTag.TagValues && Array.isArray(userTag.TagValues)) {
              this.$set(this.tagValues, userTag.TagId, [...userTag.TagValues])
            } else {
              this.$set(this.tagValues, userTag.TagId, [])
            }
          }
        }
      }
    },
    showUserTag(tag) {
      for (const k in this.userTags) {
        if (this.userTags[k].value == tag) {
          return this.userTags[k].label
        }
      }
      return '未知:' + tag
    }
  }
}
</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}

/* 添加新样式 */
.full-width-tag {
  width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* 添加滚动容器样式 */
.user-tags-scroll-container {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 12px;
}

/* 用户标签两列布局 */
.user-tags-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
}

.user-tag-item {
  width: 50%;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.left-column {
  padding-right: 10px;
}

.right-column {
  padding-left: 10px;
}

/* 使el-checkbox-group不换行显示 */
.inline-checkbox-group {
  display: inline-flex;
  flex-wrap: nowrap;
  padding-left: 25px;
}

.inline-checkbox-group .el-checkbox {
  margin-right: 15px;
  white-space: nowrap;
}

/* 添加筛选按钮样式 */
.filter-buttons {
  margin-bottom: 10px;
}

.filter-buttons .el-button {
  margin-right: 10px;
}
</style>
