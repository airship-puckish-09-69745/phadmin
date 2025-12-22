<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :make-content="makeContent" :env-empty="false" compare-type="Object" :attr-names="AttrNames"/>


    <el-row :gutter="10" style="margin-top: 30px">
      <el-row>
        <span> 选择游戏 :</span>
        <el-select v-model="queryGid" size="mini" filterable default-first-option @change="queryKeyInput">
          <!--              <el-option label="所有" :value="0"/>-->
          <el-option v-for="(o,k) in gameOptions" :key="o.key" :label="o.label" :value="parseInt(o.key)"/>
        </el-select>
      </el-row>
      <el-row>
        <el-button @click="saveCfgByGid()" type="primary" size="mini">保存配置</el-button>
      </el-row>
      <br />

    </el-row>
<!--    <fieldset style="width: 100px">-->
        <span >
      <el-button @click="openAddDialog" type="success" size="mini">添加方案</el-button>
      <el-table :data="showItem.Plans"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                stripe>
      <el-table-column prop="PlanId" label="差异化方案ID" width="80px"></el-table-column>
      <el-table-column prop="PlanName" label="差异化方案名称"></el-table-column>
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
      <el-table-column prop="Versions" label="配置版本列表" width="1000px">
        <template slot-scope="scope" >
          <el-table :data="scope.row.Versions" stripe style="font-size: 10px">
            <el-table-column prop="Version" label="版本号" width="80px">
             <template slot-scope="{}" slot="header">
                <el-button @click="openAddVersionDialog(scope.$index)" type="success" size="mini">添加版本</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="Comment" label="版本说明"></el-table-column>
            <el-table-column prop="IsReady" label="是否就绪" width="80px">
              <template slot-scope="scope">
<!--                {{ scope.row.IsReady ? '就绪' : '' }}-->
                <span v-if="scope.row.IsReady" style="color: #00b023"> {{'就绪'}} </span>
                <span v-else  style="color: red">{{'未就绪'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="600px">
              <template slot-scope="versionScope">

<!--                <el-button @click="openCreateVersionScriptsDialog(scope.$index, versionScope.$index)" type="success"-->
                <!--                           size="mini">创建剧本</el-button>-->
               <el-button @click="showTips(1,versionScope.row,scope.row)" type="success"
                          size="mini" :disabled="versionScope.row.IsReady">创建剧本</el-button>
               <el-button @click="getVersion(versionScope.row,scope.row)" type="primary" style="background: #cf91ee"
                          size="mini">查看剧本</el-button>
                <el-button @click="openEditVersionDialog(scope.$index, versionScope.$index)" type="primary"
                           size="mini">编辑</el-button>
                <el-button @click="copyVersionDialog(scope.$index, versionScope.$index)" style="background: #91eee3"
                           size="mini" >复制版本</el-button>
                <el-button @click="querySlotBase(scope.row.PlanId)" type="primary"
                           size="mini">查询</el-button>
                <!-- <el-button @click="showTips(2,scope.$index, versionScope.$index)" type="danger"
                           size="mini">删除版本</el-button> -->
                <el-button @click="delScripts(scope.row.PlanId, versionScope.row.Version)" type="danger"
                           size="mini">清理剧本</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="ScriptRule" label="用户规则" >
        <el-table-column label="平台" >
          <template slot-scope="scope">
            <el-tag  v-for="tag of scope.row.ScriptRule.PlatformList" >{{tag}}</el-tag>

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
          {{ scope.row.ScriptRule.TrafficCtrl  }}
        </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button @click="openEditDialog(scope.row,scope.$index)" type="primary" size="mini">编辑</el-button>
          <el-button @click="showTips(4,scope.row,0)" type="success" size="mini">复制</el-button>
          <el-button @click="showTips(3,scope.$index,0)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

          <!-- 添加方案对话框 -->
    <el-dialog :visible.sync="addDialogVisible" title="添加方案">
      <el-form :model="addFormData" label-width="120px">
        <el-form-item label="差异化方案ID(数字)">
          <el-input-number v-model="addFormData.PlanId" placeholder="请输入差异化方案ID"></el-input-number>
        </el-form-item>
        <el-form-item label="差异化方案名称">
          <el-input v-model="addFormData.PlanName" placeholder="请输入差异化方案名称"></el-input>
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
                  <el-checkbox label="BP" value="BP"></el-checkbox>
                  <el-checkbox label="AP" value="AP"></el-checkbox>
                  <el-checkbox label="GP" value="GP"></el-checkbox>
                  <!-- <el-checkbox label="PG" value="PG"></el-checkbox> -->
                  <el-checkbox label="TP" value="TP"></el-checkbox>
                  <el-checkbox label="SP" value="SP"></el-checkbox>
                  <el-checkbox label="CP" value="CP"></el-checkbox>
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
        <el-form-item label="流量控制(权重)">
          <el-input v-model.number="addFormData.ScriptRuleDescription.TrafficCtrl" placeholder=" "></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button @click="addPlan" type="primary">确定</el-button>
      </div>
    </el-dialog>

          <!-- 编辑方案对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑方案">
      <el-form :model="editFormData" label-width="120px">
        <el-form-item label="差异化方案ID(数字)">
          <el-input v-model.number="editFormData.PlanId" placeholder="请输入差异化方案ID"></el-input>
        </el-form-item>
        <el-form-item label="差异化方案名称">
          <el-input v-model="editFormData.PlanName" placeholder="请输入差异化方案名称"></el-input>
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
                  <el-checkbox label="BP" value="BP"></el-checkbox>
                  <el-checkbox label="AP" value="AP"></el-checkbox>
                  <el-checkbox label="GP" value="GP"></el-checkbox>
                  <!-- <el-checkbox label="PG" value="PG"></el-checkbox> -->
                  <el-checkbox label="TP" value="TP"></el-checkbox>
                  <el-checkbox label="SP" value="SP"></el-checkbox>
                </el-checkbox-group>
        </el-form-item>
        <!--        <el-form-item label="用户类型">-->
        <!--          <el-input  v-model.number="editFormData.ScriptRuleDescription.UserType" placeholder=""></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="流量控制(权重)">
          <el-input v-model.number="editFormData.ScriptRuleDescription.TrafficCtrl" placeholder=" "></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button @click="saveEdit" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="查询结果"
      :visible.sync="getBetPlanver"
      width="50%"
      :destroy-on-close='true'>
      <el-table
        :data="this.showBetPlanverList"
        border    style="width: 100%">
        <el-table-column
          prop="betAmount"
          label="下注金额列表"
          width="180"
          sortable>
          <template slot-scope="{ row }">
            {{ row.betAmount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          label="剧本功能的序列号"
          sortable>
          <template slot-scope="{ row }">
            {{ row.serialNumber }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

          <!-- 编辑版本对话框 -->
    <el-dialog v-if="editVersionDialogVisible"  :destroy-on-close='true' :visible.sync="editVersionDialogVisible" title="编辑版本">
      <el-form :model="editVersionFormData" label-width="120px">
        <el-form-item label="版本号">
          <el-input v-model.number="editVersionFormData.Version" placeholder="请输入版本号" :disabled="editVersionIsReady"></el-input>
        </el-form-item>
        <el-form-item label="版本说明">
          <el-input v-model="editVersionFormData.Comment" placeholder="请输入版本说明" :disabled="editVersionIsReady"></el-input>
        </el-form-item>
        <el-form-item label="是否就绪" >
          <el-radio-group v-model="editVersionFormData.IsReady" @change="(event) => handleRadioChange(event, editVersionFormData,currentPlanIndex)" >
            <el-radio :label="true" >是</el-radio>
            <el-radio :label="false" >不是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="Version" label="单个剧本步数">
            <el-input-number v-model="editVersionFormData.ScriptCfg.ScriptSteps" size="mini" :disabled="editVersionIsReady"></el-input-number>
        </el-form-item>
         <el-form-item prop="Version" label="总剧本数量">
          <template slot-scope="scope">
            <el-input-number v-model="editVersionFormData.ScriptCfg.ScriptNumber" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item prop="Version" label="赔率配置" inline-message>
          <template slot-scope="scope">
            <el-button @click="openOddsCfg( editVersionFormData.ScriptCfg.OddsCfg)" type="primary" size="mini" style="background: #f16f29">配置</el-button>
          </template>
        </el-form-item>
        <el-form-item prop="Version" label="Scatter中奖次数配置" >
          <template slot-scope="scope">
            <el-button @click="openHitterHitCfg( editVersionFormData.ScriptCfg.ScatterHitCfg)" type="primary" size="mini" style="background: #ff6868">配置</el-button>
          </template>
        </el-form-item>
        <el-form-item prop="Version" label="下注金额的赔率配置">
          <template slot-scope="scope">
            <el-button @click="openBetOddsPlanCfg( editVersionFormData.ScriptCfg.BetOddsPlans)" type="primary" size="mini" style="background: #29f1cd">配置</el-button>
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
        <el-button @click="saveEditVersion" type="primary">确定</el-button>
      </div>
    </el-dialog>


          <!--   赔率配置弹窗  -->
    <el-dialog :visible.sync="editSlotsScriptOddsCfgVisible" title="倍率配置">
      <el-button @click="appendComment(editSlotsScriptOddsCfgFormData,newOddsCfg())" type="success" size="mini" v-if="!editVersionIsReady">添加</el-button>
      <el-tooltip content="检查是否命中不存在倍数" effect="dark" placement="top">
                <el-button type="primary" @click="checkAbnormalSteps2()" size="mini" style="background-color:#ec4580">检查
                </el-button>
              </el-tooltip>
      <el-tooltip content="检查剧本:最小倍数*出现次数<= 倍数总和 >=最大倍数*出现次数" class="item"
                  effect="dark" placement="top">
              <el-button type="primary" @click="validateDteOddsSum" size="mini" style="background: #ff9100">
                检查倍数总和区间
              </el-button>
      </el-tooltip>
           <el-tooltip content="检查剧本:当前倍数总和/剧本步数*基础投注" class="item" effect="dark" placement="top">
              <el-button type="primary" @click="checkBetOdds" size="mini" style="background: #43bef3">
                检查
              </el-button>
      </el-tooltip>
      <el-tooltip content="检查剧本中出现个数=单个剧本步数" class="item" effect="dark" placement="top">
              <el-button type="primary" @click="checkScriptSum" size="mini" style="background: #43bef3">
                检查个数总和
              </el-button>
      </el-tooltip>
      <el-tooltip content="xlsx/xls文件,格式保持一致,需要首行标题" effect="dark" placement="top">
        <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" size="mini"></input>
      </el-tooltip>
      <el-table :data="editSlotsScriptOddsCfgFormData"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 1020px;"
                stripe>
        <el-table-column prop="Odds" label="最小倍数">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="最大倍数">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="在剧本中出现的个数">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.ScriptSteps" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="在剧本中的倍数总和">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.ScriptOddsSum" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="每个倍数正常图案缓存数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.NormalMatrixCacheSize" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="每个倍数Scatter图案缓存数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.ScatterMatrixCacheSize" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="使用改图案触发Scatter的概览">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.SwitchScatterPercent" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="触发Scatter的概率">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.TriggerScatterPercent" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
          <el-table-column prop="Odds" label="操作">
          <template slot-scope="scope">
            <el-button  @click="delComment(editSlotsScriptOddsCfgFormData,scope.$index)" type="danger" size="mini" v-if="!editVersionIsReady">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editSlotsScriptOddsCfgVisible = false">取消</el-button>
        <el-button @click="saveOddsCfg('OddsCfg',editSlotsScriptOddsCfgFormData)" type="primary">确定</el-button>
      </div>
    </el-dialog>
          <!--    Scatter中奖次数配置-->
    <el-dialog :visible.sync="editScatterHitCfgVisible" title="Scatter中奖次数配置">
      <el-button @click="appendComment(editScatterHitCfgFormData,newScatterHitCfg())" type="success" size="mini"  v-if="!editVersionIsReady">添加</el-button>
      <el-table :data="editScatterHitCfgFormData"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 1020px;"
                stripe>
        <el-table-column prop="Odds" label="总中奖次数">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.HitTimes" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="概率(万分比)">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.PerTenThousand" size="mini" :disabled="editVersionIsReady"></el-input-number>
          </template>
        </el-table-column>

          <el-table-column prop="Odds" label="操作">
          <template slot-scope="scope">
            <el-button  @click="delComment(editScatterHitCfgFormData,scope.$index)" type="danger" size="mini"  v-if="!editVersionIsReady">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editScatterHitCfgVisible = false">取消</el-button>
        <el-button @click="saveOddsCfg('ScatterHitCfg',editScatterHitCfgFormData)" type="primary">确定</el-button>
      </div>
    </el-dialog>
          <!-- 下注金额区分赔率方案配置-->
   <el-dialog :visible.sync="editBetOddsPlansVisible" title="下注金额区分赔率方案配置" width="1200px" :close-on-click-modal="false">
      <el-button @click="appendComment(editBetOddsPlansFormData,newBetOddsPlans())" type="success" size="mini"  v-if="!editVersionIsReady">添加</el-button>

      <el-table :data="editBetOddsPlansFormData"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                stripe>
        <el-table-column prop="Odds" label="目标下注金额列表" width="250px">
          <template slot="header">
            <span>目标下注金额列表</span>
          </template>
          <template slot-scope="scope">
            <span v-for="(v,idx) in scope.row.TargetBets">
              <el-input v-model.number="scope.row.TargetBets[idx]" size="mini" @input="(v)=>(scope.row.TargetBets[idx]=v.replace(/[^\d.]/g,''))" :disabled="editVersionIsReady">
                <template #prepend><el-button @click="appendComment(scope.row.TargetBets,0)"   size="mini"  v-if="!editVersionIsReady">添加</el-button></template>
                <template #append><el-button @click="delComment(scope.row.TargetBets,idx)"   size="mini"  v-if="!editVersionIsReady">删除</el-button></template>
              </el-input>
            </span>
          </template>
        </el-table-column>
         <el-table-column prop="OddsCfg" label="倍数配置">
           <template slot-scope="scope">
              <el-tooltip content="xlsx/xls文件,格式保持一致,需要首行标题" effect="dark" placement="top">
                     <input type="file" @change="(event) => handleFileUpload2(event, scope.$index)" accept=".xlsx, .xls" size="mini"></input>
              </el-tooltip>
              <el-col :offset="1" :span="12">
               <el-tooltip content="检查是否命中不存在倍数" effect="dark" placement="top">
                <el-button type="primary" @click="checkAbnormalSteps(scope.$index)" size="mini" style="background-color:#ec4580">检查
                </el-button>
              </el-tooltip>
              <el-tooltip content="当前倍数总和/剧本步数*基础投注" effect="dark" placement="top">
                <el-button type="primary" @click="checkBetPlans(scope.$index)" size="mini" style="background-color:#ff8000">检查
                </el-button>
              </el-tooltip>
              <el-tooltip content="最小倍数*出现个数<=剧本总和<=最大倍数*出现个数" effect="dark" placement="top">
                <el-button type="primary" @click="checkBetPlansSum(scope.$index)" size="mini" style="background-color:#b600ff">检查
                </el-button>
              </el-tooltip>
                 <el-tooltip content="总个数==单个剧本步数" effect="dark" placement="top">
                <el-button type="primary" @click="checkPlansSumScript(scope.$index)" size="mini" style="background-color:#da00bd">检查总个数
                </el-button>
              </el-tooltip>
            </el-col>
            <el-table :data="scope.row.OddsCfg" stripe>
              <el-table-column prop="Odds" label="最小倍数">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Odds" label="最大倍数">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Odds" label="剧本中出现的个数">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.ScriptSteps" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Odds" label="剧本中的倍数总和">
                <template slot-scope="scopeRow">
                  <el-input v-model.number="scopeRow.row.ScriptOddsSum" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
                 <el-table-column prop="Odds" label="操作">
                <template slot-scope="scopeRow">
                  <el-button @click="appendComment(scope.row.OddsCfg,newOdds())"   size="mini"  v-if="!editVersionIsReady">添加</el-button>
                  <el-button @click="delComment(scope.row.OddsCfg,scope.$index)"   size="mini"  v-if="!editVersionIsReady">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="Odds" label="操作" width="80px">
          <template slot-scope="scope">
            <el-button  @click="delComment(editBetOddsPlansFormData,scope.$index)" type="danger" size="mini"  v-if="!editVersionIsReady">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editBetOddsPlansVisible = false">取消</el-button>
        <el-button @click="saveOddsCfg('BetOddsPlans',editBetOddsPlansFormData)" type="primary">确定</el-button>
      </div>
    </el-dialog>
          <!-- 大奖配置-->
   <el-dialog :visible.sync="editBigPrizeOddsCfgVisible" title="大奖配置" width="1600px">
       <el-form>
         <el-col>
           <el-col :span="8">
              <el-form-item prop="Odds" label="下注总金额抽水比例(千分比)">
                <el-input v-model.number="editBigPrizeOddsCfgFormData.TaxPerThousand" size="mini" :disabled="editVersionIsReady"><template
                  #append>‰</template></el-input>
            </el-form-item>
           </el-col>
             <el-col :span="8">
             <el-form-item prop="Odds" label="中奖概率(百万分之一)">
                  <el-input v-model.number="editBigPrizeOddsCfgFormData.HitPerMillion" size="mini" :disabled="editVersionIsReady"></el-input>
            </el-form-item>
                </el-col>
          <el-col :span="8">
             <el-form-item prop="Odds" label="中奖最大间隔">
                  <el-input v-model.number="editBigPrizeOddsCfgFormData.HitSteps" size="mini" :disabled="editVersionIsReady"></el-input>
            </el-form-item>
                        </el-col>
           </el-col>
        </el-form>
      <el-button @click="appendComment(editBigPrizeOddsCfgFormData.Plans,newBigPrizeCfg())" type="success" size="mini"  v-if="!editVersionIsReady">添加</el-button>

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
                  <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
               <el-table-column prop="OddsMax" label="最大倍数">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Odds" label="中奖倍数配置">
               <template slot-scope="scope">
                 <el-button @click="openBigPrizePlansCfg(scope.$index,scope.row.OddsCfg)" type="primary" size="mini">配置</el-button>
              </template>
             </el-table-column>
                 <el-table-column prop="Odds" label="操作" width="80px">
              <template slot-scope="scopeRow">
                 <el-button @click="delComment(editBigPrizeOddsCfgFormData.Plans,scopeRow.$index)" type="danger" size="mini"  v-if="!editVersionIsReady">删除</el-button>
              </template>
             </el-table-column>
          </el-table>


      <div slot="footer" class="dialog-footer">
        <el-button @click="editBigPrizeOddsCfgVisible = false">取消</el-button>
        <el-button @click="saveOddsCfg('BigPrizeCfg',editBigPrizeOddsCfgFormData)" type="primary">确定</el-button>
      </div>
    </el-dialog>

          <!--  大奖倍数配置   -->
   <el-dialog :visible.sync="editBigPrizeOddsPlansCfgVisible" title="大奖配置" width="600px">
      <el-button @click="appendComment(editBigPrizeOddsPlansCfgFormData,newBigPrizeCfg())" type="success" size="mini"  v-if="!editVersionIsReady">添加</el-button>
      <el-table :data="editBigPrizeOddsPlansCfgFormData"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                stripe>
        <el-table-column prop="Odds" label="最小倍数" >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.OddsMin" size="mini" :disabled="editVersionIsReady"></el-input>
          </template>
        </el-table-column>
          <el-table-column prop="Odds" label="最大倍数"  >
          <template slot-scope="scope">
              <el-input v-model.number="scope.row.OddsMax" size="mini" :disabled="editVersionIsReady"></el-input>
          </template>
        </el-table-column>
         <el-table-column prop="Odds" label="权重"  >
          <template slot-scope="scope">
              <el-input v-model.number="scope.row.Weight" size="mini" :disabled="editVersionIsReady"></el-input>
          </template>
        </el-table-column>
          <el-table-column prop="Odds" label="操作"  >
          <template slot-scope="scope">
              <el-button @click="delComment(editBigPrizeOddsPlansCfgFormData,scope.$index)" type="danger" size="mini"  v-if="!editVersionIsReady">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
        <el-button @click="editBigPrizeOddsPlansCfgVisible = false">取消</el-button>
        <el-button @click="saveBigPrizeOddsCfg('BigPrizeCfg ',editBigPrizeOddsPlansCfgFormData)" type="primary">确定</el-button>
      </div>
   </el-dialog>
    <el-dialog
            title="确认操作"
            :visible.sync="showDeleteDialog"
            width="30%"
            :before-close="handleClose"
          >
      <template  >
        <span>{{tips}}</span>
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
      <template  >
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
          <el-button type="success" @click="showCompletionScript  = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    </span>
<!--    </fieldset>-->
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames"/>

  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import {$libShow, ValidateVueItem} from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import ShowTip from '@/components/Tip/showTip.vue'
import {SubKeyMap} from '@/constants/subkey'
import {number} from "echarts/lib/export"
import XLSX from 'xlsx'
import store from "@/store";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {ShowTip, Compare, Publish, BetAmount},
  data() {
    return {
      showItem: {
        SlotsType: 0,
        ID: 0,
        Plans: [],
      },

      showDeleteType: 0,
      item: {},
      gameOptions: [],
      channels: [
        {'label': '不限', 'value': ''},
        {'label': 'BP', 'value': 'BP'},
        {'label': 'GP', 'value': 'GP'},
        {'label': 'AP', 'value': 'AP'},
        // {'label': 'PG', 'value': 'PG'} 2025-12-22去除PG
      ],
      queryGid: 82,
      orgDataList: [],
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
        ScriptRuleDescription: {Platform:'',UserType:0,TrafficCtrl:0,PlatformList:[]}
      },
      editDialogVisible: false,
      editFormData: {
        PlanId: 0,
        PlanName: '',
        IsDefault: 0,
        IsDisabled: 0,
        ScriptRuleDescription: {Platform:'',UserType:0,TrafficCtrl:0,PlatformList:[]}
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
            ScriptSteps:0,
            ScriptNumber:0,
            OddsCfg:[],
            ScatterHitCfg:[],
            BetOddsPlans:[],
            BigPrizeCfg:{
              TaxPerThousand:0,
              HitPerMillion:0,
              HitSteps:0,
              Plans:[]
            },
          },

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

      tips:'',
      showDeleteDialog: false,
      showTipsVal: 0,
      data1:{},
      data2:{},
      idx1:0,
      idx2:0,

      showCompletionScript: false,
      currentBaseBet:[],
      getBetPlanver: false,
      showBetPlanverList: [],
      showCompletionScriptMap:{},

      AdditionalArray:[
        { key: 100180, label: 'Fishing Master(额外加注)' },
        { key: 100186, label: 'Mahjong Jackpot(额外加注)' }
      ],
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.getConfigData();
      await this.getGameList();
      await this.getData();
      await this.queryBase(this.queryGid)
    },
    getFullKey() {
      return 'SlotsCustomScriptConfig_' + this.queryGid
    },

   getData() {
      request({
        url: '/slotsScriptV3Config/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          this.orgDataList = response.Data
          for (const o of this.orgDataList) {
            o.Data = JSON.parse(o.ConfigData)
          }
        }

        this.queryKeyInput()

        console.log('response', response)
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
                this.currentBaseBet.push(baseCfg.BetList[k]*1.5)
              }
            } else {
              for (const k in baseCfg.BetList) {
                this.currentBaseBet.push(baseCfg.BetList[k])
              }
            }
          }
        }
        console.log('this.currentBaseBet', this.currentBaseBet)
      }).catch(e => {
        console.log(e)
      })
    },
    querySlotBase(planID) {
      console.log('querySlotBase', this.queryGid, '111::', planID)
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/custom/script/plan/ver',
          Env: store.getters.env,
          planID: planID,
          gameID: this.queryGid,
          bets: JSON.stringify(this.currentBaseBet)
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('querySlotBase', response.Data)
          this.showBetPlanverList = []
          this.showBetPlanverList = Object.entries(response.Data)
            .map(([key, value]) => ({
              betAmount: Number(key)/1000,
              serialNumber: value
            }))
            .sort((a, b) => a.betAmount - b.betAmount)
        }
        console.log('this.showBetPlanverMap', this.showBetPlanverList)
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
      this.$refs.compare.Compare(function (isEdit) {
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
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
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
    appendAdditional(){
      for (const o of this.AdditionalArray) {
        this.gameOptions.push(o)
      }
    },

    checkedBoxChange(a){
      console.log("多选框实时变化：" + a);
      this.$forceUpdate();  //强制渲染多选框样式，否则值变了样式没有选中
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
          if (oz.ScriptRule.Platform !==''){
            oz.ScriptRule['PlatformList'] = oz.ScriptRule.Platform.split(",")
          }else {
            oz.ScriptRule['PlatformList'] = [
              "BP",
              "AP",
              "GP",
              "PG",
              "TP",
              "SP",
            ]
          }
        }
    },
    proceedUpdateData(items) {
      for (const o of items) {
        for (const v of o.Versions) {
          for (const p of v.ScriptCfg.BetOddsPlans) {
            for (const i in p.TargetBets) {
              p.TargetBets[i] = parseInt(parseFloat(p.TargetBets[i] )*1000)
            }
          }
        }
        for (let i = 0; i < o.ScriptRule.PlatformList.length; i++) {
          if (o.ScriptRule.PlatformList[i] === ''){
            o.ScriptRule.PlatformList.splice( i,1)
          }
        }
        // if (o.ScriptRule.PlatformList.length>0){
          o.ScriptRule.Platform =  o.ScriptRule.PlatformList.join()
        // }
      }
      return items;
    },
    async queryKeyInput() {
      this.queryBase(this.queryGid)
      for (const o of this.orgDataList) {
        if (this.queryGid === o.SlotsType) {
          let a = JSON.parse(JSON.stringify(o))
          this.showItem.SlotsType = a.SlotsType
          this.showItem.Plans = a.Data
          this.showItem.ID = a.ID
          this.$refs.compare.SetOldVal(JSON.parse(JSON.stringify(this.showItem.Plans)))
          this.proceedData(this.showItem.Plans)
          this.$forceUpdate()
          return
        }
      }
      this.showItem.SlotsType = this.queryGid
      this.showItem.Plans = this.newPlansCfg()
      this.showItem.ID = 0
    },
    newItem() {
      return {
        SlotsType: this.queryGid,
        Plans: [],
      }
    },
    openAddDialog() {
      this.addDialogVisible = true;
      this.addFormData =     {
        PlanId: this.showItem.Plans.length+1,
        PlanName: '新增方案'+this.showItem.Plans.length+1,
        IsDefault: 0,
        IsDisabled: 1,
        Versions: [

        ],
        ScriptRuleDescription: {Platform:'',UserType:0,TrafficCtrl:0, PlatformList:[]}
      }
    },
    addPlan() {
      const newPlan = {
        PlanId: this.addFormData.PlanId,
        PlanName: this.addFormData.PlanName,
        IsDefault: this.addFormData.IsDefault,
        IsDisabled: this.addFormData.IsDisabled,
        Versions: [],
        ScriptRule: this.addFormData.ScriptRuleDescription
      };
      this.showItem.Plans.push(newPlan);
      this.addDialogVisible = false;
    },
    openEditDialog(row,idx) {
      this.editDialogVisible = true;
      this.editFormData = {
        PlanId: row.PlanId,
        PlanName: row.PlanName,
        IsDefault: row.IsDefault,
        IsDisabled: row.IsDisabled,
        ScriptRuleDescription: row.ScriptRule
      };
      this.editIndex = idx
    },
    saveEdit() {
      const updatedPlan = {
        PlanId: this.editFormData.PlanId,
        PlanName: this.editFormData.PlanName,
        IsDefault: this.editFormData.IsDefault,
        IsDisabled: this.editFormData.IsDisabled,
        Versions: this.showItem.Plans[this.editIndex].Versions,
        ScriptRule: this.editFormData.ScriptRuleDescription
      };
      this.showItem.Plans.splice(this.editIndex, 1, updatedPlan);
      this.editDialogVisible = false;
    },
    deletePlan(index) {
      this.showItem.Plans.splice(index, 1);
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
      this.editVersionFormData.Version = maxVersion+1

      this.currentPlanIndex = planIndex;
      this.saveEditVersion()
    },
    newVersion() {
      return   {
        Version: 0,
        Comment: '',
        IsReady: false,
        ScriptCfg:
          {
            ScriptSteps:0,
            ScriptNumber:0,
            OddsCfg:[],
            ScatterHitCfg:[],
            BetOddsPlans:[],
            BigPrizeCfg:{
              TaxPerThousand:0,
              HitPerMillion:0,
              HitSteps:0,
              Plans:[]
            },
          }
      }
    },
    openEditVersionDialog(planIndex, versionIndex) {
      this.editVersionDialogVisible = true;
      const version = this.showItem.Plans[planIndex].Versions[versionIndex];
      this.versionStatus = 1
      this.editVersionIsReady = version.IsReady
      this.editVersionFormData = {
        Version: version.Version,
        Comment: version.Comment,
        IsReady: version.IsReady,
        ScriptCfg: version.ScriptCfg,
      };
      this.currentPlanIndex = planIndex;
      this.currentVersionIndex = versionIndex;
    },
    copyVersionDialog(planIndex, versionIndex) {
      const version = this.showItem.Plans[planIndex].Versions[versionIndex];
      let maxVersion = 0
      for (const o of this.showItem.Plans[planIndex].Versions) {
        if (o.Version > maxVersion) {
          maxVersion = o.Version
        }
      }
      let copy = JSON.parse(JSON.stringify(version))
      copy.Version = maxVersion+1
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
          let arr = JSON.parse(response.Data.Data)
          for (const o of arr) {
            for (const oElement of this.AdditionalArray) {
                if (o.Gid+100000 === oElement.key){
                  this.slotCfg[o.Gid+100000] = o
                }else {
                  this.slotCfg[o.Gid] = o
                }
            }
          }
        }
      })
    },
    saveEditVersion() {
      const updatedVersion = {
        Version: this.editVersionFormData.Version,
        Comment: this.editVersionFormData.Comment,
        ScriptCfg: this.editVersionFormData.ScriptCfg,
        IsReady: this.editVersionFormData.IsReady,
      };
      if (this.versionStatus===0){
        this.showItem.Plans[this.currentPlanIndex].Versions.push(updatedVersion)
      }else {
        this.showItem.Plans[this.currentPlanIndex].Versions.splice(this.currentVersionIndex, 1, updatedVersion);
      }
      this.editVersionDialogVisible = false;
    },
    deleteVersion(planIndex, versionIndex) {
      this.showItem.Plans[planIndex].Versions.splice(versionIndex, 1);
    },

    appendComment(arr,obj  ){
      console.log(arr,obj)
      if (!arr){
        arr=[]
      }
      arr.push(obj)
      this.$forceUpdate()
    },
    delComment(arr,idx  ){
      console.log(arr,idx)
      if (arr.length<=1){
        Message.info('至少需要一个配置')
        return
      }
      arr.splice(idx, 1);
      this.$forceUpdate()
    },
    openOddsCfg(obj){
      console.log(obj)
      this.editSlotsScriptOddsCfgVisible = true
      this.editSlotsScriptOddsCfgFormData = obj
    },
    saveOddsCfg(key,obj){
      this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg[key] =  JSON.parse(JSON.stringify(obj))
      this.editSlotsScriptOddsCfgVisible = false
      this.editScatterHitCfgVisible = false
      this.editBetOddsPlansVisible = false
      this.editBigPrizeOddsCfgVisible  = false
    },
    saveBigPrizeOddsCfg(key,obj){
      this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.BigPrizeCfg.Plans[this.editBigPrizeOddsPlansCfgIndex].OddsCfg =  JSON.parse(JSON.stringify(obj))
      this.editBigPrizeOddsPlansCfgVisible = false
    },
    openHitterHitCfg(obj){
      this.editScatterHitCfgVisible  = true
      this.editScatterHitCfgFormData = obj
    },
    openBetOddsPlanCfg(obj){
      this.editBetOddsPlansVisible  = true
      this.editBetOddsPlansFormData = obj
    },
    openBigPrizeOddsCfg(obj){
      this.editBigPrizeOddsCfgVisible  = true
      this.editBigPrizeOddsCfgFormData= obj
    },
    openBigPrizePlansCfg(idx,obj){
      this.editBigPrizeOddsPlansCfgVisible  = true
      this.editBigPrizeOddsPlansCfgIndex = idx
      this.editBigPrizeOddsPlansCfgFormData= obj
    },
    newSlotsScriptCfg(){
      return   {
        OddsCfg: [],
          ScatterHitCfg: [],
          ScriptSteps: 0,
          ScriptNumber: 0,
          BigPrizeCfg: {
            TaxPerThousand:0,
            HitPerMillion:0,
            HitSteps:0,
            Plans:[]
          },
          BetOddsPlans: [],
      }
    },
    newOddsCfg(){
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
    newScatterHitCfg(){
      return {
        HitTimes: 0,
        PerTenThousand: 0,
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
            ScriptOddsSum: 0,
          }
        ]
      }
    },
    newOdds(){
      return {
        OddsMin: 0,
          OddsMax: 0,
        ScriptSteps: 0,
        ScriptOddsSum: 0,
      }
    },
    newBigPrizeCfg() {
      return this.newBigPrizePlanCfg()

    },
    newBigPrizePlanCfg() {
      return {
        OddsMin: 0,
        OddsMax: 0,
        OddsCfg: [],
      }
    },
    newPlansCfg(){
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
                ScatterHitCfg:[],
                ScriptSteps:0,
                ScriptNumber:0,
                BigPrizeCfg:{
                  TaxPerThousand:0,
                  HitPerMillion:0,
                  HitSteps:0,
                  Plans:[]
                },
                BetOddsPlans:[],
              }
            }
          ],
          ScriptRule: {Platform:'',UserType:0,TrafficCtrl:0,PlatformList:[]}
        },
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


    updateCfg(){
      if (!this.checkData()) {
        return
      }
      let items =  this.proceedUpdateData(JSON.parse(JSON.stringify(this.showItem.Plans)))
      console.log("=======",this.showItem.SlotsType,this.showItem.ID)
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
        console.log('response', response)
      })
    },
    createVersion(row,planRow){
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/slotsStat/script/plan/data',
          planID:planRow.PlanId,
          gameID:$this.queryGid,
          planVer:row.Version
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
    getVersion(row,planRow) {

      console.log(row,planRow.PlanId)
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/script/plan/data',
          planID:planRow.PlanId,
          gameID:$this.queryGid,
          planVer:row.Version
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
    createCfg(){
      let val = JSON.parse(JSON.stringify(this.showItem.Plans))
      let items =  this.proceedUpdateData(val)
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
        console.log('response', response)
      })
    },
    checkData(){
      if (this.showItem.SlotsType<=0){
        Message.error('请选择游戏类型！')
        return false
      }
      if (this.showItem.Plans.length<=0){
        Message.error('请添加方案！')
        return false
      }
      for (const o of this.showItem.Plans) {
        if (o.ScriptRule.TrafficCtrl<=0){
          Message.error('请设置流量控制！')
          return false
        }
      }
      return true
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {type: 'array'});
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
          this.editSlotsScriptOddsCfgFormData=[]
          json.forEach((row, index) => {
            if (index > 0) {
              let idx = index - 1
              console.log(index, idx, row)

              this.editSlotsScriptOddsCfgFormData.push({
                OddsMin: row[0],
                OddsMax: row[1],
                ScriptSteps: row[2],
                ScriptOddsSum: row[3],
                NormalMatrixCacheSize: row[4],
                ScatterMatrixCacheSize: row[5],
                SwitchScatterPercent: row[6],
                TriggerScatterPercent:row[7],
              })
            }
          });
        };
        reader.readAsArrayBuffer(file);
        this.$forceUpdate()
      }
    },
    handleFileUpload2(event,datIdx,) {
      console.log(datIdx,event)
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {type: 'array'});
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
          console.log(this.editBetOddsPlansFormData[datIdx].OddsCfg)
          this.editBetOddsPlansFormData[datIdx].OddsCfg=[]
          json.forEach((row, index) => {
            if (index > 0) {
              let idx = index - 1
              console.log(index, idx, row,datIdx)

              this.editBetOddsPlansFormData[datIdx].OddsCfg.push({
                OddsMin: row[0],
                OddsMax: row[1],
                ScriptSteps: row[2],
                ScriptOddsSum: row[3],
              })
            }
          });
        };
        reader.readAsArrayBuffer(file);
        this.$forceUpdate()
      }
    },
    checkBetOdds(idx) {
      let cnt = 0
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        let obj = this.editSlotsScriptOddsCfgFormData[i]
        cnt += obj.ScriptOddsSum
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps;
      console.log(scriptSteps)

      Message.success('当前百分比：' + (cnt / (scriptSteps * Number(this.slotCfg[this.queryGid].Bet)) * 100).toFixed(3) + '%')
    },
    checkScriptSum() {
      let cnt = 0
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        let obj = this.editSlotsScriptOddsCfgFormData[i]
        cnt += obj.ScriptSteps
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps;
      if (cnt === scriptSteps){
        Message.success('当前总数:'+ cnt+' 剧本步数:'+scriptSteps)
      }else {
        Message.error('当前总数:'+ cnt+' 剧本步数:'+scriptSteps)
      }
    },
    validateDteOddsSum() {
      let str = ''
      if (this.editSlotsScriptOddsCfgFormData.length===0){
        this.$message.error('阿达西,你的数据呢')
        return
      }
      for (const i in this.editSlotsScriptOddsCfgFormData) {
        let obj = this.editSlotsScriptOddsCfgFormData[i]
        console.log(obj,obj.OddsMin * obj.ScriptSteps )
        if (obj.OddsMin * obj.ScriptSteps <= obj.ScriptOddsSum && obj.ScriptOddsSum <= obj.OddsMax * obj.ScriptSteps) {
        } else {
          let a = Number(i) + 1
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
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg ) {
        cnt += o.ScriptOddsSum
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps;

      Message.success('当前百分比：' + (cnt / (scriptSteps * Number(this.slotCfg[this.queryGid].Bet)) * 100).toFixed(3) + '%')

    },
    checkAbnormalSteps(idx) {
      let gid = this.queryGid
      if (gid > 100000) {
        gid = gid - 100000
      }
      console.log(gid, this.slotCfg[gid].AbnormalSteps)
      if (!this.slotCfg[gid].AbnormalSteps){
        Message.error('请设置异常步数！')
        return
      }
      var strings = this.slotCfg[gid].AbnormalSteps.split(",");
      console.log(this.editBetOddsPlansFormData[idx])
      for (const i in this.editBetOddsPlansFormData[idx].OddsCfg ) {
        let o = this.editBetOddsPlansFormData[idx].OddsCfg[i]
        for (const strNum of strings) {
          if (o.OddsMax >parseInt(strNum) && o.OddsMin < parseInt(strNum)){
            let ss = (parseInt(i)+1)
            Message.error('第'+(ss)+'行异常步数【'+strings+'】包含在配置内,min:' + o.OddsMin  + ' max:' + o.OddsMax ,)
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
      console.log(gid, this.slotCfg[gid].AbnormalSteps)
      //
      // console.log('this.editVersionFormData.ScriptCfg.OddsCfg.length',this.editVersionFormData.ScriptCfg.OddsCfg.length)
      // console.log('this.queryGid', this.queryGid)
      if (!this.slotCfg[gid].AbnormalSteps){
        Message.error('请设置异常步数！')
        return
      }
      var strings = this.slotCfg[gid].AbnormalSteps.split(",");
      // console.log('this.editVersionFormData.ScriptCfg.OddsCfg:',this.editVersionFormData.ScriptCfg.OddsCfg)
      for (const i in this.editVersionFormData.ScriptCfg.OddsCfg) {
        let o = this.editVersionFormData.ScriptCfg.OddsCfg[i]
        for (const strNum of strings) {
          // console.log('strNum:',strNum);
          if (o.OddsMax >parseInt(strNum) && o.OddsMin < parseInt(strNum)){
            let ss = (parseInt(i)+1)
            Message.error('第'+(ss)+'行异常步数【'+strings+'】包含在配置内,min:' + o.OddsMin  + ' max:' + o.OddsMax ,)
            return
          }
        }
      }
      this.$message.success('无禁止倍数')
    },
    checkBetPlansSum(idx) {
      let msgArr = []
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg) {
        if ((o.OddsMin * o.ScriptSteps) > o.ScriptOddsSum) {
          msgArr.push('最小倍数:' + o.OddsMin + ' 出现步数:' + o.ScriptSteps + ' 倍数总和:' + o.ScriptOddsSum)
        }
        if ((o.OddsMax * o.ScriptSteps) < o.ScriptOddsSum) {
          msgArr.push('最大倍数:' + o.OddsMax + ' 出现步数:' + o.ScriptSteps + ' 倍数总和:' + o.ScriptOddsSum)
        }
      }
      if (msgArr.length <= 0) {
        Message.success("数据ok的！")
      } else {
        Message.error('数据异常：' + msgArr.join('，'))
      }
    },
    checkPlansSumScript(idx) {
      let cnt = 0
      for (const o of this.editBetOddsPlansFormData[idx].OddsCfg) {
        cnt += o.ScriptSteps
      }
      var scriptSteps = this.showItem.Plans[this.currentPlanIndex].Versions[this.currentVersionIndex].ScriptCfg.ScriptSteps;
      if (cnt === scriptSteps){
        Message.success('当前总数:'+ cnt+' 剧本步数:'+scriptSteps)
      }else {
        Message.error('当前总数:'+ cnt+' 剧本步数:'+scriptSteps)
      }
    },
    // 关闭弹窗时的处理函数
    handleClose(done) {
      this.showDeleteDialog = false;
      done();
    },
    showTips(val,data1,data2){
      this.showDeleteDialog = true;
      this.showTipsVal = val
      if (val===1){
        this.tips="是否创建配置"
        this.data1=data1
        this.data2=data2
      }
      if (val===2){
        this.tips="是否删除该版本"
        this.idx1=data1
        this.idx2=data2
      }
      if (val===3){
        this.tips="是否删除该方案"
        this.idx1=data1
        this.idx2=data2
      }
      if (val===4){
        this.tips="是否复制该方案"
        this.data1=data1
      }
    },
    // 处理删除操作的函数
    handleDelete(val) {
      // 这里可以添加实际的删除逻辑，例如调用接口删除数据
      if (this.showTipsVal===1){
        this.createVersion(this.data1 ,this.data2)
      }
      if (this.showTipsVal===2){
        console.log(this.idx1,this.idx2)
        this.deleteVersion(this.idx1, this.idx2)
      }
      if (this.showTipsVal===3){
        this.deletePlan(this.idx1)
      }
      if (this.showTipsVal===4){
        this.copyPlan(this.idx1, this.idx2)
      }
      this.showDeleteDialog = false; // 关闭弹窗
    },
    copyPlan(){
      let val = JSON.parse(JSON.stringify(this.data1));
      val.IsDefault = 0
      val.IsDisabled  = 1
      val.PlanId = this.showItem.Plans.length + 1
      // versionScope.row.IsReady
      for (const o of val.Versions) {
        o.IsReady = false
      }
      console.log(this.data1)

      this.showItem.Plans.push(val)
    },
    handleRadioChange(newValue,row,planIdx) {
      if (newValue) {
        const $this = this
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Path: '/slotsStat/script/plan/data',
            planID:this.showItem.Plans[planIdx].PlanId,
            gameID:$this.queryGid,
            planVer:row.Version
          }
        }).then(response => {
          if (response.RetCode !== 0 && typeof response.Data !== 'object') {
            Message.error("没有创建剧本，请先创建剧本再选择")
            row.IsReady = false
          }
        })
        console.log('选择了“是”');
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
            planVer: planVer
          }
        }).then(response => {
          if (response.RetCode !== 0 && typeof response.Data !== 'object') {
            Message.error("没有创建剧本，请先创建剧本再选择")
            row.IsReady = false
          }
        })
      }).catch(() => {
        console.log('取消')
      })
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
</style>
