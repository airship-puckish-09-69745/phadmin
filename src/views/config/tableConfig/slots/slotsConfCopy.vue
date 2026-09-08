<template>
    <div class="page">

        <el-card shadow="never" class="box-card">

            <!-- 标题 -->
            <div class="title">
                <span>🎮 游戏配置复制工具</span>
                <el-checkbox v-model="lark" @change="setLarkPage">
                    <span style="color: #4468fb">Lark群通知</span>
                </el-checkbox>
            </div>

            <el-divider />

            <!-- 第一行：选择区域 -->
            <el-row :gutter="20" type="flex" align="middle">

                <!-- 源 app -->
                <el-col :span="8">
                    <div class="label">源 AppId</div>
                    <el-select v-model="appId" clearable placeholder="请选择源应用" style="width: 100%">
                        <el-option v-for="o in appOptions" :key="o.value" :label="o.label" :value="o.value" />
                    </el-select>
                </el-col>

                <!-- 目标 app -->
                <el-col :span="8">
                    <div class="label">目标 AppId</div>

                    <div class="target-wrap">

                        <!-- select + hover预览 -->
                        <el-tooltip placement="bottom" effect="dark" :disabled="targetAppIds.length === 0">

                            <template #content>
                                <div style="max-width: 260px;">
                                    <div v-for="id in targetAppIds" :key="id" style="padding: 2px 0;">
                                        {{ getAppLabel(id) }}
                                    </div>
                                </div>
                            </template>

                            <el-select v-model="targetAppIds" multiple collapse-tags filterable placeholder="请选择目标应用"
                                style="flex: 1">
                                <el-option v-for="o in filteredTargetAppOptions" :key="o.value" :label="o.label"
                                    :value="o.value" />
                            </el-select>

                        </el-tooltip>

                        <!-- 操作按钮 -->
                        <div class="target-actions">

                            <el-button size="mini" type="primary" plain @click="handleToggleSelectAll">
                                {{ isAllSelected ? '取消全选' : '全选' }}
                            </el-button>

                        </div>

                    </div>
                </el-col>
            </el-row>


            <!-- 第二行：配置类型 -->
            <el-row :gutter="20" style="margin-top: 15px;">

                <el-col :span="8">
                    <div class="label">配置类型</div>

                    <el-select v-model="configTypes" multiple collapse-tags collapse-tags-tooltip placeholder="请选择配置类型"
                        style="width: 100%" @change="handleConfigTypesChange">
                        <el-option v-for="item in configTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-col>

            </el-row>

            <div v-show="configTypes.includes('slot_game')"
                style="margin-top: 15px; padding: 10px; border: 1px solid #eee;">
                <div style="font-weight: bold; margin-bottom: 10px;">
                    游戏配置 - 选择配置
                </div>
                <el-checkbox-group v-model="selectedGameCfgKeys">
                    <el-checkbox label="base">base配置</el-checkbox>
                    <el-checkbox label="rule">rule配置</el-checkbox>
                    <el-checkbox label="ext">扩展配置</el-checkbox>
                </el-checkbox-group>
            </div>

            <!-- 游戏选择 -->
            <div v-show="hasGameRelatedConfig"
                style="margin-top: 15px; padding: 10px; border: 1px solid #eee;">

                <div class="game-select-header">
                    <div style="font-weight: bold;">
                        选择游戏
                    </div>
                    <el-input v-model="gameIdKeyword" clearable size="mini" prefix-icon="el-icon-search"
                        placeholder="输入游戏ID或名称搜索" class="game-id-search" />
                </div>

                <!-- 全选 -->
                <el-checkbox :indeterminate="isGameIndeterminate" v-model="checkAllGames"
                    @change="handleCheckAllGameChange">
                    全选
                </el-checkbox>

                <el-divider />

                <!-- 游戏列表 -->
                <el-checkbox-group v-model="selectedGameIds" class="game-checkbox-grid" @change="handleGameChange">
                    <el-checkbox v-for="g in filteredGameOptions" :key="g.key" :label="g.key"
                        :disabled="isGameOptionDisabled(g.key)" @click.native="handleGameOptionClick(g.key)">
                        {{ g.label }}
                    </el-checkbox>
                </el-checkbox-group>

            </div>


            <!-- 操作区 -->
            <div class="action">
                <el-button type="primary" size="medium" :loading="loading" :disabled="scriptFlowLocked"
                    @click="handleCopy">
                    🚀 执行复制
                </el-button>
                <el-button type="primary" size="medium" :disabled="!canPlanCreateScripts || readyLoading"
                    :loading="scriptLoading" @click="handleOneKeyCreateScripts">
                    创建剧本
                </el-button>
                <el-button type="primary" size="medium" :disabled="!canPlanReady || scriptLoading"
                    :loading="readyLoading" @click="handleOneKeyReady">
                    剧本就绪
                </el-button>
                <el-button type="success" size="medium" :disabled="!canOneKeyPublish"
                    :loading="publishLoading" @click="handleOneKeyPublish">
                    {{ oneKeyPublishText }}
                </el-button>
                <el-button size="medium" :disabled="!canClearCopyFlowCache" @click="handleClearCopyFlowCache">
                    清理缓存
                </el-button>

                <span class="tip">
                    已选游戏：{{ selectedGameCount }} 个
                </span>
            </div>

            <p class="script-create-notice">*注意:创建剧本需要先确保1000的appid已发布剧本</p>

            <el-alert v-if="hasUnpublishedCopyTasks" class="copy-publish-tip" type="warning" :closable="false"
                show-icon title="注意：如果要创建本次复制后的方案剧本，请先发布复制配置；未发布时，创建剧本会读取当前已发布的方案配置，不包含本次复制内容。" />

            <el-alert v-if="scriptFlowLocked" class="copy-publish-tip" type="warning" :closable="false"
                show-icon title="复制方案已发布，请完成当前已选方案的创建剧本、剧本就绪和方案发布后再执行复制；如需结束本次流程，请使用【清理缓存】。" />

            <el-alert v-if="hasPendingScriptReadyTasks" class="copy-publish-tip" type="warning" :closable="false"
                show-icon title="剧本已创建，但方案尚未全部就绪；请先执行【剧本就绪】，完成后才能发布方案配置。" />

        </el-card>

        <el-dialog :title="publishDialogTitle" :visible.sync="publishDialogVisible" width="90%" :append-to-body="true">
            <el-tabs v-model="activePublishStage" type="card" @tab-click="handlePublishSourceTabClick">
                <el-tab-pane v-for="group in publishSourceGroups" :key="group.stage" :label="group.label"
                    :name="group.stage" />
            </el-tabs>

            <el-alert v-if="hasUnpublishedCopyTasks" class="publish-dialog-tip" type="warning" :closable="false"
                show-icon title="复制内容未发布时，需先发布复制配置后才能创建复制后的剧本内容。" />

            <div class="publish-filter-bar">
                <div class="publish-filter-item">
                    <span class="publish-filter-label">AppId</span>
                    <el-select v-model="publishFilters.appIds" multiple collapse-tags clearable size="small"
                        placeholder="全部" @change="handlePublishFilterChange">
                        <el-option v-for="item in publishAppIdOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="publish-filter-item">
                    <span class="publish-filter-label">游戏</span>
                    <el-select v-model="publishFilters.games" multiple collapse-tags clearable size="small"
                        placeholder="全部游戏" @change="handlePublishFilterChange">
                        <el-option v-for="item in publishGameOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="publish-filter-item">
                    <span class="publish-filter-label">差异</span>
                    <el-select v-model="publishFilters.diffStatuses" multiple collapse-tags clearable size="small"
                        placeholder="全部差异" @change="handlePublishFilterChange">
                        <el-option v-for="item in publishDiffOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <el-button type="primary" size="small" @click="handlePublishFilterChange">筛选</el-button>
                <el-button size="small" @click="resetPublishFilters">重置</el-button>
            </div>

            <div class="publish-step-row">
                <el-tabs v-model="activePublishStep" class="publish-step-tabs" @tab-click="handlePublishStepTabClick">
                    <el-tab-pane v-for="group in publishStepGroups" :key="group.step" :label="group.label"
                        :name="group.step" />
                </el-tabs>
                <span class="publish-selected-count">已选 {{ selectedPublishTasks.length }} 条</span>
            </div>

            <el-table ref="publishTaskTable" :data="filteredPublishTasks" stripe border style="width: 100%"
                max-height="520" row-key="publishTaskId" @selection-change="handlePublishSelectionChange">
                <el-table-column type="selection" width="45" :selectable="isPublishTaskSelectable" />
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏" width="190" />
                <el-table-column prop="subKey" label="配置Key" min-width="260" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="diffStatus" label="差异" width="90" />
                <el-table-column prop="configDesc" label="说明" min-width="140" />
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="showDiffDetail(scope.row)">
                            {{ scope.row.publishBlocked ? '异常原因' : '差异详情' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button size="mini" :disabled="publishLoading" @click="publishDialogVisible = false">取 消</el-button>
                <el-button type="primary" size="mini" :loading="publishLoading"
                    :disabled="selectedPublishTasks.length === 0 || activePublishStep === publishStepBlocked"
                    @click="confirmPublishTasks">{{ currentPublishButtonText }}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="发布结果" :visible.sync="publishResultDialogVisible" width="85%" :append-to-body="true"
            @closed="handlePublishResultClosed">
            <div class="publish-result-title publish-result-title-fail">
                失败配置列表（{{ publishResultFailTasks.length }}）
            </div>
            <el-table :data="publishResultFailTasks" stripe border style="width: 100%" max-height="260">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏" width="180" />
                <el-table-column prop="subKey" label="配置Key" min-width="240" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="publishOpTypeName" label="发布步骤" width="120" />
                <el-table-column prop="resultMsg" label="失败原因" min-width="260" />
            </el-table>

            <div class="publish-result-title publish-result-title-success">
                成功配置列表（{{ publishResultSuccessTasks.length }}）
            </div>
            <el-table :data="publishResultSuccessTasks" stripe border style="width: 100%" max-height="260">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏" width="180" />
                <el-table-column prop="subKey" label="配置Key" min-width="240" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="publishOpTypeName" label="发布步骤" width="120" />
                <el-table-column prop="resultMsg" label="结果说明" min-width="260" />
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="publishResultDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="复制方案发布结果" :visible.sync="scriptFlowGuideDialogVisible" width="85%"
            :append-to-body="true" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-alert class="script-flow-guide-alert" type="warning" :closable="false" show-icon
                title="以下结果仅检查本次成功发布的方案配置。需要创建剧本的配置将在确认后自动选中，并暂停执行复制。" />
            <div class="ready-result-title ready-result-fail">
                异常方案配置（{{ scriptFlowAbnormalTasks.length }}）
            </div>
            <el-table :data="scriptFlowAbnormalTasks" stripe border style="width: 100%" max-height="260">
                <el-table-column prop="appId" label="AppId" width="100" />
                <el-table-column prop="gameName" label="游戏" min-width="200" />
                <el-table-column prop="subKey" label="配置Key" min-width="260" />
                <el-table-column prop="reason" label="原因" width="160" />
            </el-table>
            <div class="ready-result-title ready-result-success">
                需要创建剧本（{{ scriptFlowNeedCreateTasks.length }}）
            </div>
            <el-table :data="scriptFlowNeedCreateTasks" stripe border style="width: 100%" max-height="300">
                <el-table-column prop="appId" label="AppId" width="100" />
                <el-table-column prop="gameName" label="游戏" min-width="200" />
                <el-table-column prop="subKey" label="配置Key" min-width="260" />
                <el-table-column prop="enabledPlanCount" label="可用方案数" width="110" />
                <el-table-column prop="pendingVersionCount" label="待创建版本数" width="120" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="confirmScriptFlowGuide">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="formalCheckDialogTitle" :visible.sync="formalCheckDialogVisible" width="85%"
            :append-to-body="true">
            <el-alert class="formal-check-alert" :title="formalCheckDialogMessage"
                :type="formalCheckIsError ? 'error' : 'warning'" :closable="false" show-icon />
            <el-table :data="formalCheckTasks" stripe border style="width: 100%" max-height="520">
                <el-table-column prop="appId" label="AppId" width="100" />
                <el-table-column prop="gameName" label="游戏" width="220" />
                <el-table-column prop="configName" label="配置类型" width="150" />
                <el-table-column prop="subKey" label="配置Key" min-width="280" />
                <el-table-column v-if="formalCheckIsError" prop="errMsg" label="原因" min-width="300" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="formalCheckDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="copyPreviewDialogTitle" :visible.sync="copyPreviewDialogVisible" width="92%"
            :append-to-body="true" :close-on-click-modal="false" @close="resetCopyPreviewState">
            <el-alert class="copy-preview-alert" type="warning" :closable="false" show-icon
                title="仅复制有差异配置；无差异配置将自动跳过，方案配置无差异时不会写入目标 AppId。" />
            <div v-if="copyPreviewFailTasks.length > 0">
                <div class="copy-preview-title copy-preview-title-fail">
                    差异检查失败（{{ copyPreviewFailTasks.length }}）
                </div>
                <el-table :data="copyPreviewFailTasks" stripe border style="width: 100%" max-height="220">
                    <el-table-column prop="appId" label="目标AppId" width="100" />
                    <el-table-column prop="gameName" label="游戏" width="180" />
                    <el-table-column prop="configName" label="配置类型" width="140" />
                    <el-table-column prop="subKey" label="配置Key" min-width="240" />
                    <el-table-column prop="errMsg" label="失败原因" min-width="280" />
                </el-table>
            </div>
            <div class="copy-preview-title copy-preview-title-diff">
                有差异配置（{{ copyPreviewDiffTasks.length }}）
            </div>
            <el-table :data="copyPreviewDiffTasks" stripe border style="width: 100%" max-height="360">
                <el-table-column prop="appId" label="目标AppId" width="100" />
                <el-table-column prop="gameName" label="游戏" min-width="180" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="subKey" label="配置Key" min-width="240" />
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="showCopyPreviewDiffDetail(scope.row)">
                            差异详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="copy-preview-title copy-preview-title-same">
                无差异配置（{{ copyPreviewSameTasks.length }}）
            </div>
            <el-table :data="copyPreviewSameTasks" stripe border style="width: 100%" max-height="300">
                <el-table-column prop="appId" label="目标AppId" width="100" />
                <el-table-column prop="gameName" label="游戏" min-width="180" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="subKey" label="配置Key" min-width="240" />
                <el-table-column prop="skipReason" label="处理" min-width="180" />
            </el-table>
            <el-alert v-if="copyPreviewSamePlanCount > 0" class="copy-preview-plan-alert" type="warning"
                :closable="false" show-icon
                :title="`${copyPreviewSamePlanCount} 个方案配置与目标内容无差异，已禁止复制。`" />
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" :disabled="loading" @click="closeCopyPreviewDialog">关 闭</el-button>
                <el-button type="primary" size="mini" :loading="loading"
                    :disabled="copyPreviewDiffTasks.length === 0" @click="confirmCopyPreview">
                    复制有差异配置
                </el-button>
            </span>
        </el-dialog>

        <el-dialog :title="scriptCreateDialogTitle" :visible.sync="scriptCreateDialogVisible" width="85%"
            :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false"
            :show-close="scriptCreateCanClose" @closed="handleScriptCreateDialogClosed">
            <div class="ready-result-title ready-result-fail">
                已就绪剧本异常（{{ scriptReadyAbnormalTasks.length }}）
            </div>
            <el-alert v-if="scriptReadyAbnormalTasks.length > 0" class="script-ready-zero-alert" type="error"
                :closable="false" show-icon title="以下已就绪版本存在剧本数量异常或查询失败，请重点检查。" />
            <el-table :data="scriptReadyAbnormalTasks" stripe border style="width: 100%" max-height="300">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="scriptCountText" label="各下注额实际数量" min-width="220" />
                <el-table-column prop="scriptCountStatus" label="异常原因" width="170" />
            </el-table>
            <div class="ready-result-title ready-result-success">
                剧本创建任务（{{ scriptCreateTasks.length }}）
            </div>
            <el-table :data="scriptCreateTasks" stripe border style="width: 100%" max-height="520">
                <el-table-column label="状态" width="130" fixed="left">
                    <template slot-scope="scope">
                        <span :class="['script-create-status', `script-create-status-${scope.row.createStatus}`]">
                            <i v-if="scope.row.createStatus === 'creating'" class="el-icon-loading" />
                            <i v-else-if="scope.row.createStatus === 'completed'" class="el-icon-circle-check" />
                            <i v-else-if="scope.row.createStatus === 'failed'" class="el-icon-circle-close" />
                            <i v-else-if="scope.row.createStatus === 'paused'" class="el-icon-remove-outline" />
                            <i v-else class="el-icon-time" />
                            {{ scope.row.createStatusText }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="versionComment" label="版本说明" min-width="160" />
                <el-table-column prop="scriptSteps" label="剧本步数" width="100" />
                <el-table-column label="创建进度" width="120">
                    <template slot-scope="scope">
                        <span :class="['script-create-progress', `script-create-progress-${scope.row.createStatus}`]">
                            {{ scope.row.createProgressCurrent }}/{{ scope.row.createProgressTotal }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createError" label="异常原因" min-width="220" show-overflow-tooltip />
            </el-table>
            <div class="ready-result-title copy-preview-title-same">
                已就绪剧本（{{ scriptReadyNormalTasks.length }}）
            </div>
            <el-table :data="scriptReadyNormalTasks" stripe border style="width: 100%" max-height="300">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="scriptNumber" label="配置数量" width="100" />
                <el-table-column prop="scriptCountText" label="各下注额实际数量" min-width="220" />
                <el-table-column label="状态" width="170">
                    <template slot-scope="scope">
                        <el-tag size="mini" :type="scope.row.scriptCountStatusType">
                            {{ scope.row.scriptCountStatus }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="scriptCreateState === 'idle'" size="mini" :disabled="scriptLoading"
                    @click="closeScriptCreateDialog">取 消</el-button>
                <el-button type="primary" size="mini" :loading="scriptLoading"
                    :disabled="scriptCreateTasks.length === 0" @click="handleScriptCreateAction">
                    {{ scriptCreateActionText }}
                </el-button>
            </span>
        </el-dialog>

        <el-dialog :title="readyPreviewDialogTitle" :visible.sync="readyPreviewDialogVisible" width="85%"
            :append-to-body="true">
            <div class="ready-result-title ready-result-fail">
                未就绪方案（{{ readyFailedPreviewTasks.length }}）
            </div>
            <el-table :data="readyFailedPreviewTasks" stripe border style="width: 100%" max-height="300">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="scriptNumber" label="所需剧本数" width="110" />
                <el-table-column prop="scriptCountText" label="剧本数量" min-width="180" />
                <el-table-column prop="reason" label="原因" width="140" />
            </el-table>
            <div class="ready-result-title ready-result-success">
                {{ readyPreviewMode === 'result' ? '就绪成功方案' : '可就绪方案' }}（{{ readyPreviewTasks.length }}）
            </div>
            <el-table :data="readyPreviewTasks" stripe border style="width: 100%" max-height="520">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="versionComment" label="版本说明" min-width="160" />
                <el-table-column prop="scriptNumber" label="所需剧本数" width="110" />
                <el-table-column prop="betListText" label="下注额" min-width="180" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" :disabled="readyLoading" @click="closeReadyPreviewDialog">关 闭</el-button>
                <el-button v-if="readyPreviewMode === 'check'" type="primary" size="mini" :loading="readyLoading"
                    :disabled="readyPreviewTasks.length === 0" @click="confirmReadyTasks">确认就绪</el-button>
            </span>
        </el-dialog>

        <el-dialog title="剧本就绪发布检查" :visible.sync="planPublishGuardDialogVisible" width="88%"
            :append-to-body="true" :close-on-click-modal="false">
            <el-alert class="publish-dialog-tip" type="warning" :closable="false" show-icon
                title="未就绪方案配置已从本次剧本就绪发布中移除，并重新加入待就绪范围；复制配置发布不参与本项检查。" />
            <div class="ready-result-title ready-result-fail">
                未就绪/检查异常（{{ planPublishGuardBlockedRows.length }}）
            </div>
            <el-table :data="planPublishGuardBlockedRows" stripe border style="width: 100%" max-height="360">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏" min-width="180" />
                <el-table-column prop="subKey" label="配置Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="reason" label="原因" width="160" />
            </el-table>
            <div class="ready-result-title ready-result-success">
                可以发布的剧本就绪配置（{{ planPublishGuardAllowedTasks.length }}）
            </div>
            <el-table :data="planPublishGuardAllowedTasks" stripe border style="width: 100%" max-height="260">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏" min-width="180" />
                <el-table-column prop="subKey" label="配置Key" min-width="260" />
                <el-table-column prop="configName" label="配置类型" width="140" />
                <el-table-column prop="guardStatus" label="检查结果" width="120" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="planPublishGuardDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="差异详情" :visible.sync="diffDetailVisible" width="75%" :append-to-body="true">
            <div v-if="currentDiffTask" style="margin-bottom: 10px;">
                AppId：{{ currentDiffTask.appId }}，
                游戏：{{ currentDiffTask.gameName }}，
                配置：{{ currentDiffTask.configName }}，
                Key：{{ currentDiffTask.subKey }}
            </div>
            <el-alert v-if="currentDiffTask && currentDiffTask.publishBlocked" type="error" :closable="false"
                show-icon :title="currentDiffTask.publishBlockMsg || currentDiffTask.configDesc || '当前配置不可发布'" />
            <el-table v-else-if="currentDiffTask && currentDiffTask.diffRows && currentDiffTask.diffRows.length > 0"
                :data="currentDiffTask.diffRows" stripe border style="width: 100%" max-height="520">
                <el-table-column prop="key" label="字段" width="180" />
                <el-table-column prop="oldVal" :label="diffDetailOldLabel" min-width="240">
                    <template slot-scope="scope">
                        <pre class="diff-value">{{ formatDiffValue(scope.row.oldVal) }}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="newVal" :label="diffDetailNewLabel" min-width="240">
                    <template slot-scope="scope">
                        <pre class="diff-value">{{ formatDiffValue(scope.row.newVal) }}</pre>
                    </template>
                </el-table-column>
            </el-table>
            <div v-else style="color: red;font-size: 14px;text-align: center">
                {{ diffDetailEmptyText }}
            </div>
        </el-dialog>

    </div>
</template>

<script>
import request from '@/utils/request'
import legacyRequest from '@/utils/request2'
import { existCustomize, createCustomize, updateCustomize, copyCustomize, getAllCustomizes, getCustomize } from '@/api/custome_configV2'
import { PUBLISH_STEPS } from '@/api/publish'
import { getInfo } from '@/api/user'
import { sendLark } from '@/api/lark'
import store from '@/store'
import { SubKeyMap } from '@/constants/subkey'

const typeLabelMap = {
    slot_game: '老虎机游戏配置',
    slot_plan: '老虎机方案',
    slot_jackpot: '老虎机大奖',
    slot_task: 'slot任务',
    slot_script_stat: 'slots剧本统计'
}

const gameCfgLabelMap = {
    base: 'base配置',
    rule: 'rule配置',
    ext: '扩展配置'
}

const relatedGameIdOffset = 100000
const relatedGameConfigTypes = ['slot_plan', 'slot_jackpot']
const scriptPlanDataRequestTimeout = 30000
const scriptCreateNormalPollInterval = 60 * 1000
const scriptCreateFastPollInterval = 30 * 1000
const scriptCreateFastPollThreshold = 500
const scriptCreateStateIdle = 'idle'
const scriptCreateStateRunning = 'running'
const scriptCreateStatePaused = 'paused'
const scriptCreateStateError = 'error'
const scriptCreateStateCompleted = 'completed'
const copyFlowStorageVersion = 1
const copyFlowStoragePrefix = 'slots-conf-copy-flow'
const publishStageSourceConfig = 'sourceConfig'
const publishStageCopyConfig = 'copyConfig'
const publishStageScriptCreate = 'scriptCreate'
const publishStagePlanReady = 'planReady'
const publishStagePlanConfig = 'planConfig'
const formalConfigCheckConcurrency = 5
const publishStageLabelMap = {
    [publishStageSourceConfig]: '源配置发布',
    [publishStageCopyConfig]: '复制配置发布',
    [publishStageScriptCreate]: '创建剧本发布',
    [publishStagePlanReady]: '剧本就绪发布',
    [publishStagePlanConfig]: '方案配置发布'
}
const publishStepBlocked = 'blocked'
const commonConfigGameValue = '__common_config__'
const validPublishSteps = [
    PUBLISH_STEPS.PUBLISH_STEP_TEST,
    PUBLISH_STEPS.PUBLISH_STEP_PRE,
    PUBLISH_STEPS.PUBLISH_STEP_REVIEWING,
    PUBLISH_STEPS.PUBLISH_STEP_REVIEWED,
    PUBLISH_STEPS.PUBLISH_STEP_PRO
]
const publishOpTypeLabelMap = {
    [PUBLISH_STEPS.PUBLISH_STEP_TEST]: '发布到测试',
    [PUBLISH_STEPS.PUBLISH_STEP_PRE]: '同步到预发布',
    [PUBLISH_STEPS.PUBLISH_STEP_REVIEWING]: '提交审核',
    [PUBLISH_STEPS.PUBLISH_STEP_REVIEWED]: '审核完成',
    [PUBLISH_STEPS.PUBLISH_STEP_PRO]: '发布到正式'
}

export default {
    name: 'GameSelect',

    data() {
        return {
            queryGids: [],
            gameOptions: [],

            appId: null,
            // 旧版配置没有 AppId，但可以作为复制源。
            appOptions: [{ value: 0, label: '旧版' }],

            targetAppIds: [],

            loading: false,
            publishLoading: false,
            scriptLoading: false,
            readyLoading: false,
            publishDialogVisible: false,
            publishResultDialogVisible: false,
            scriptFlowGuideDialogVisible: false,
            planPublishGuardDialogVisible: false,
            scriptCreateDialogVisible: false,
            readyPreviewDialogVisible: false,
            copyPreviewDialogVisible: false,
            diffDetailVisible: false,
            diffDetailMode: 'publish',
            formalCheckDialogVisible: false,
            formalCheckDialogTitle: '',
            formalCheckDialogMessage: '',
            formalCheckIsError: false,
            formalCheckTasks: [],
            copyPreviewDiffTasks: [],
            copyPreviewSameTasks: [],
            copyPreviewFailTasks: [],
            publishTasks: [],
            copyPublishTasks: [],
            scriptPublishTasks: [],
            readyPublishTasks: [],
            publishResultFailTasks: [],
            publishResultSuccessTasks: [],
            scriptFlowNeedCreateTasks: [],
            scriptFlowNoUsableTasks: [],
            scriptFlowCheckFailTasks: [],
            planPublishGuardBlockedRows: [],
            planPublishGuardAllowedTasks: [],
            scriptFlowGuidePending: false,
            scriptFlowLockedTasks: [],
            scriptCreateTasks: [],
            scriptReadyPreviewTasks: [],
            scriptCreateState: scriptCreateStateIdle,
            scriptCreateCurrentIndex: -1,
            scriptCreateWorkerActive: false,
            scriptCreateRunId: 0,
            scriptCreatePollTimer: null,
            scriptCreatePollResolve: null,
            readyPreviewTasks: [],
            readyFailedPreviewTasks: [],
            readyPreviewMode: 'check',
            selectedPublishTasks: [],
            currentDiffTask: null,
            publishOpType: PUBLISH_STEPS.PUBLISH_STEP_TEST,
            activePublishStage: publishStageCopyConfig,
            activePublishStep: String(PUBLISH_STEPS.PUBLISH_STEP_TEST),
            publishStepBlocked,
            publishFilters: {
                appIds: [],
                games: [],
                diffStatuses: []
            },

            AdditionalArray: [],

            configTypes: ['slot_game', 'slot_plan', 'slot_jackpot', 'slot_task', 'slot_script_stat'],

            // 配置类型
            configTypeOptions: [
                { value: 'slot_game', label: '老虎机游戏配置' },
                { value: 'slot_plan', label: '老虎机方案配置' },
                { value: 'slot_jackpot', label: '老虎机大奖配置' },
                { value: 'slot_task', label: 'slot任务配置' },
                { value: 'slot_script_stat', label: 'slots剧本统计配置' }
            ],
            selectedGameCfgKeys: ['base', 'rule', 'ext'],
            selectedGameIds: [],
            checkAllGames: false,
            gameIdKeyword: '',
            lark: false,
            larkPages: [],
            larkConfig: {}
        }
    },

    computed: {
        filteredTargetAppOptions() {
            return this.appOptions.filter(
                i => i.value !== 0 && i.value !== this.appId
            )
        },
        isAllSelected() {
            return (
                this.targetAppIds.length > 0 &&
                this.targetAppIds.length === this.filteredTargetAppOptions.length
            )
        },
        selectedGameCount() {
            return this.hasGameRelatedConfig ? this.selectedGameIds.length : 0
        },
        selectableGameOptions() {
            if (!this.configTypes.includes('slot_game')) {
                return this.gameOptions
            }
            return this.gameOptions.filter(game => !this.isGameMissingSubKeyMap(game.key))
        },
        filteredGameOptions() {
            const keyword = this.gameIdKeyword.trim().toLowerCase()
            if (!keyword) {
                return this.gameOptions
            }
            return this.gameOptions.filter(game => {
                return String(game.key).includes(keyword) || String(game.label || '').toLowerCase().includes(keyword)
            })
        },
        selectableFilteredGameOptions() {
            if (!this.configTypes.includes('slot_game')) {
                return this.filteredGameOptions
            }
            return this.filteredGameOptions.filter(game => !this.isGameMissingSubKeyMap(game.key))
        },
        hasGameRelatedConfig() {
            return this.configTypes.some(type => ['slot_game', 'slot_plan', 'slot_jackpot'].includes(type))
        },
        isGameIndeterminate() {
            const total = this.selectableFilteredGameOptions.length
            const selectedGameIdSet = new Set(this.selectedGameIds.map(gameId => String(gameId)))
            const selectedCount = this.selectableFilteredGameOptions.filter(game => selectedGameIdSet.has(String(game.key))).length
            return selectedCount > 0 && selectedCount < total
        },
        isV2Version() {
            return store.getters.version === 'V2'
        },
        hasSelectedPlanScope() {
            return this.isV2Version && (this.scriptFlowLocked || (this.targetAppIds.length > 0 && this.selectedGameIds.length > 0))
        },
        scriptFlowLocked() {
            return this.scriptFlowLockedTasks.length > 0
        },
        canOperateCopiedPlanTasks() {
            return this.hasSelectedPlanScope && !this.loading && !this.publishLoading
        },
        canPlanCreateScripts() {
            return this.canOperateCopiedPlanTasks && !this.scriptLoading && !this.readyLoading && !this.scriptCreateQueueActive
        },
        canPlanReady() {
            return this.canOperateCopiedPlanTasks && !this.scriptLoading && !this.readyLoading && !this.scriptCreateQueueActive
        },
        canOneKeyPublish() {
            if (!this.isV2Version || this.loading || this.scriptLoading || this.readyLoading || this.publishLoading || this.scriptCreateQueueActive) {
                return false
            }
            return this.pendingPublishTaskCount > 0 || this.canPublishSourceConfig
        },
        canClearCopyFlowCache() {
            if (!this.isV2Version || this.loading || this.scriptLoading || this.readyLoading || this.publishLoading || this.scriptCreateQueueActive) {
                return false
            }
            return this.pendingPublishTaskCount > 0 ||
                this.hasPendingScriptReadyTasks ||
                this.publishTasks.length > 0 ||
                this.scriptCreateTasks.length > 0 ||
                this.scriptReadyPreviewTasks.length > 0 ||
                this.readyPreviewTasks.length > 0 ||
                this.readyFailedPreviewTasks.length > 0 ||
                this.scriptFlowLocked
        },
        canPublishSourceConfig() {
            if (this.isLegacySource() || this.targetAppIds.length > 0 || this.appId === null || this.appId === undefined || this.configTypes.length === 0) {
                return false
            }
            if (this.configTypes.includes('slot_game') && !this.selectedGameCfgKeys.length) {
                return false
            }
            if (this.hasGameRelatedConfig && !this.selectedGameIds.length) {
                return false
            }
            return true
        },
        oneKeyPublishText() {
            return '发布'
        },
        publishDialogTitle() {
            return '待发布配置列表'
        },
        copyPreviewDialogTitle() {
            return `复制前差异检查（有差异：${this.copyPreviewDiffTasks.length}，无差异：${this.copyPreviewSameTasks.length}）`
        },
        copyPreviewSamePlanCount() {
            return this.copyPreviewSameTasks.filter(task => task.keyStr === 'slot_plan').length
        },
        diffDetailOldLabel() {
            return this.diffDetailMode === 'copy' ? '目标当前值' : '当前已发布值'
        },
        diffDetailNewLabel() {
            return this.diffDetailMode === 'copy' ? '源当前值' : '发布值'
        },
        diffDetailEmptyText() {
            return this.diffDetailMode === 'copy'
                ? '源配置与目标配置无任何差异！'
                : '本次发布与当前已发布内容无任何差异！'
        },
        scriptCreateDialogTitle() {
            const completedCount = this.scriptCreateTasks.filter(item => item.createStatus === 'completed').length
            return `创建剧本检查（已完成：${completedCount}/${this.scriptCreateTasks.length}，已就绪：${this.scriptReadyPreviewTasks.length}）`
        },
        scriptCreateQueueActive() {
            return [scriptCreateStateRunning, scriptCreateStatePaused, scriptCreateStateError].includes(this.scriptCreateState)
        },
        scriptCreateCanClose() {
            return [scriptCreateStateIdle, scriptCreateStateCompleted].includes(this.scriptCreateState)
        },
        scriptCreateActionText() {
            if (this.scriptCreateState === scriptCreateStateRunning) {
                return '停止'
            }
            if ([scriptCreateStatePaused, scriptCreateStateError].includes(this.scriptCreateState)) {
                return '继续'
            }
            if (this.scriptCreateState === scriptCreateStateCompleted) {
                return '完成'
            }
            return '开始创建'
        },
        scriptFlowAbnormalTasks() {
            return this.scriptFlowNoUsableTasks.concat(this.scriptFlowCheckFailTasks)
        },
        scriptReadyAbnormalTasks() {
            return this.scriptReadyPreviewTasks.filter(item => {
                return ['all_zero', 'partial_zero', 'query_failed'].includes(item.scriptCountState)
            })
        },
        scriptReadyNormalTasks() {
            return this.scriptReadyPreviewTasks.filter(item => item.scriptCountState === 'normal')
        },
        hasPendingScriptReadyTasks() {
            return this.scriptPublishTasks.length > 0
        },
        readyPreviewDialogTitle() {
            const title = this.readyPreviewMode === 'result' ? '剧本就绪结果' : '剧本就绪检查结果'
            return `${title}（成功/可就绪：${this.readyPreviewTasks.length}，未就绪：${this.readyFailedPreviewTasks.length}）`
        },
        pendingPublishTaskCount() {
            return this.getAllPendingPublishTasks().length
        },
        hasUnpublishedCopyTasks() {
            return this.copyPublishTasks.length > 0 ||
                this.scriptPublishTasks.some(task => task.hasCopiedChanges) ||
                this.readyPublishTasks.some(task => task.hasCopiedChanges)
        },
        publishSourceGroups() {
            const groups = []
            if (this.publishTasks.some(task => task.publishStage === publishStageSourceConfig)) {
                groups.push({
                    stage: publishStageSourceConfig,
                    label: `${this.getPublishStageName(publishStageSourceConfig)}(${this.getDialogPublishTasksByStage(publishStageSourceConfig).length})`
                })
            }
            if (this.publishTasks.some(task => task.publishStage === publishStageCopyConfig)) {
                groups.push({
                    stage: publishStageCopyConfig,
                    label: `${this.getPublishStageName(publishStageCopyConfig)}(${this.getDialogPublishTasksByStage(publishStageCopyConfig).length})`
                })
            }
            if (this.publishTasks.some(task => task.publishStage === publishStagePlanConfig)) {
                groups.push({
                    stage: publishStagePlanConfig,
                    label: `${this.getPublishStageName(publishStagePlanConfig)}(${this.getDialogPublishTasksByStage(publishStagePlanConfig).length})`
                })
            }
            return groups
        },
        publishStepGroups() {
            const tasks = this.getFilteredPublishTasksBySource()
            const groups = []
            const stepDefs = [
                { step: String(PUBLISH_STEPS.PUBLISH_STEP_TEST), label: '发布到测试' },
                { step: String(PUBLISH_STEPS.PUBLISH_STEP_PRE), label: '同步预发布' },
                { step: String(PUBLISH_STEPS.PUBLISH_STEP_REVIEWING), label: '提交审核' },
                { step: String(PUBLISH_STEPS.PUBLISH_STEP_PRO), label: '发布正式' },
                { step: publishStepBlocked, label: '异常/不可发布' }
            ]
            for (const item of stepDefs) {
                const count = tasks.filter(task => this.getPublishStepKey(task) === item.step).length
                if (count > 0) {
                    groups.push({
                        step: item.step,
                        label: `${item.label}(${count})`
                    })
                }
            }
            return groups
        },
        filteredPublishTasks() {
            return this.getFilteredPublishTasksBySource().filter(task => this.getPublishStepKey(task) === this.activePublishStep)
        },
        publishAppIdOptions() {
            return this.buildUniqueOptions(this.getDialogPublishTasksByStage(this.activePublishStage), task => ({
                value: task.appId,
                label: String(task.appId)
            }))
        },
        publishGameOptions() {
            return this.buildUniqueOptions(this.getDialogPublishTasksByStage(this.activePublishStage), task => ({
                value: this.getPublishGameFilterValue(task),
                label: task.gameName || this.getGameLabel(task.gameId)
            }))
        },
        publishDiffOptions() {
            return this.buildUniqueOptions(this.getDialogPublishTasksByStage(this.activePublishStage), task => ({
                value: task.diffStatus || '未知',
                label: task.diffStatus || '未知'
            }))
        },
        currentPublishButtonText() {
            const sourceName = this.getPublishStageName(this.activePublishStage).replace(/发布$/, '')
            if (this.activePublishStep === String(PUBLISH_STEPS.PUBLISH_STEP_PRE)) {
                return `同步选中${sourceName}到预发布`
            }
            if (this.activePublishStep === String(PUBLISH_STEPS.PUBLISH_STEP_REVIEWING)) {
                return `提交选中${sourceName}审核`
            }
            if (this.activePublishStep === String(PUBLISH_STEPS.PUBLISH_STEP_PRO)) {
                return `发布选中${sourceName}到正式`
            }
            if (this.activePublishStep === String(PUBLISH_STEPS.PUBLISH_STEP_TEST)) {
                return `发布选中${sourceName}到测试`
            }
            return '不可发布'
        }
    },

    watch: {
        appId(newVal) {
            this.targetAppIds = this.targetAppIds.filter(
                id => id !== 0 && id !== newVal
            )
        },
        gameIdKeyword() {
            this.updateCheckAllGames()
        }
    },

    mounted() {
        this.getLarkPage()
        Promise.all([this.getGameList(), this.getAppInfos()]).then(() => {
            this.restoreCopyFlowState()
        })
    },

    beforeDestroy() {
        this.resetScriptCreateQueueState()
    },

    methods: {
        handleToggleSelectAll() {
            if (this.isAllSelected) {
                this.targetAppIds = []
            } else {
                this.targetAppIds = this.filteredTargetAppOptions.map(o => o.value)
            }
        },

        getAppLabel(id) {
            const found = this.filteredTargetAppOptions.find(o => o.value === id)
            return found ? found.label : id
        },
        isLegacySource() {
            return Number(this.appId) === 0
        },
        ensureV2Version() {
            if (!this.isV2Version) {
                this.$message.warning('该功能仅支持新版测试或新版线上')
                return false
            }
            return true
        },
        getGameList() {
            return request({
                url: '/thirdpartygames/all',
                method: 'get',
                data: {}
            }).then(response => {
                if (response.RetCode === 0) {
                    for (let i = 0; i < response.Data.length; i++) {
                        if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || (response.Data[i].Gid > 499 && response.Data[i].Gid !== 1236)) {
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
            }).catch(() => {
            })
        },

        appendAdditional() {
            for (const o of this.AdditionalArray) {
                this.gameOptions.push(o)
            }
        },
        getAppInfos() {
            return request({
                url: '/thirdparties/all',
                method: 'get',
                data: {}
            }).then(response => {
                if (response.RetCode === 0) {
                    for (let i = 0; i < response.Data.length; i++) {
                        if (response.Data[i].Status !== 2) {
                            continue
                        }
                        this.appOptions.push({
                            value: response.Data[i].ID,
                            label: response.Data[i].ID + '-' + response.Data[i].Account
                        })
                    }
                }
            }).catch(() => {
            })
        },


        async handleCopy() {
            if (this.loading) return
            if (!this.ensureV2Version()) return
            if (this.scriptFlowLocked) {
                return this.$message.warning('请先完成当前已选方案的创建剧本、剧本就绪和方案发布')
            }
            console.log('1111appId:', this.appId)
            if (this.appId === null || this.appId === undefined) {
                return this.$message.warning('请选择源 AppId')
            }

            if (!this.targetAppIds.length) {
                return this.$message.warning('请选择目标 AppId')
            }

            if (this.targetAppIds.includes(this.appId)) {
                return this.$message.warning('源 AppId不能作为目标')
            }


            if (!this.configTypes.length) {
                return this.$message.warning('请选择配置类型')
            }

            if (this.configTypes.includes('slot_game') && !this.selectedGameCfgKeys.length) {
                return this.$message.warning('请选择老虎机游戏配置类型')
            }

            // 只有游戏相关配置需要选择公共游戏列表
            if (this.hasGameRelatedConfig && !this.selectedGameIds.length) {
                return this.$message.warning('请选择游戏')
            }


            const planPublishConflictTasks = await this.getReadyPublishConflictsForCopy()
            if (planPublishConflictTasks.length > 0) {
                return this.showCopyReadyPublishConflict(planPublishConflictTasks)
            }

            const targetCheckTasks = await this.buildCopyTargetCheckTasks()
            if (!(await this.ensureNoTargetExistingTasks('复制', targetCheckTasks))) {
                return
            }

            this.loading = true
            try {
                this.resetCopyPreviewState()
                const previewResult = await this.buildCopyPreview()
                this.copyPreviewDiffTasks = previewResult.diffTasks
                this.copyPreviewSameTasks = previewResult.sameTasks
                this.copyPreviewFailTasks = previewResult.failTasks
                this.copyPreviewDialogVisible = true
                if (this.copyPreviewDiffTasks.length === 0) {
                    this.$message.warning('所选配置与目标配置无差异，没有可复制内容')
                } else if (this.copyPreviewSamePlanCount > 0) {
                    this.$message.warning('存在无差异方案配置，这些方案将不会复制')
                }
            } finally {
                this.loading = false
            }

        },

        async buildCopyPreview() {
            const failList = []
            const candidates = await this.buildCopyPreviewCandidates(failList)
            const context = {
                appRecordCache: new Map(),
                sourceRecordCache: new Map()
            }
            const diffTasks = []
            const sameTasks = []

            for (const candidate of candidates) {
                try {
                    const result = await this.buildCopyPreviewTask(candidate, context)
                    if (result.errMsg) {
                        failList.push(Object.assign({}, candidate, { errMsg: result.errMsg }))
                        continue
                    }
                    if (result.task.diffRows.length > 0) {
                        diffTasks.push(result.task)
                    } else {
                        sameTasks.push(result.task)
                    }
                } catch (err) {
                    failList.push(Object.assign({}, candidate, {
                        errMsg: this.getCopyError(null, err) || '生成复制差异失败'
                    }))
                }
            }

            return {
                diffTasks,
                sameTasks,
                failTasks: failList.map(item => this.buildCopyPreviewFailTask(item))
            }
        },

        async buildCopyPreviewCandidates(failList) {
            const candidates = []
            const appendCandidates = (items, keyStr) => {
                for (const item of items) {
                    const cfgItem = typeof item === 'string'
                        ? { subKey: item, configName: typeLabelMap[keyStr] || keyStr }
                        : item
                    if (cfgItem.missingMap || !cfgItem.subKey) {
                        for (const appId of this.targetAppIds) {
                            failList.push({
                                keyStr,
                                gameId: cfgItem.gameId,
                                gameName: cfgItem.gameName,
                                configName: cfgItem.configName || typeLabelMap[keyStr] || keyStr,
                                appId,
                                subKey: cfgItem.subKey || '-',
                                errMsg: '未配置老虎机配置Key映射，请维护SubKeyMap'
                            })
                        }
                        continue
                    }
                    for (const appId of this.targetAppIds) {
                        candidates.push({
                            cfgItem,
                            keyStr,
                            gameId: cfgItem.gameId,
                            gameName: cfgItem.gameName || this.getGameLabel(cfgItem.gameId),
                            configName: cfgItem.configName || typeLabelMap[keyStr] || keyStr,
                            subKey: cfgItem.subKey,
                            appId
                        })
                    }
                }
            }

            if (this.configTypes.includes('slot_game')) {
                appendCandidates(this.buildSlotGameCfgSubKeys(), 'slot_game')
            }
            if (this.configTypes.includes('slot_plan')) {
                appendCandidates(await this.buildGameSubKeysWithRelated('slot_plan', failList), 'slot_plan')
            }
            if (this.configTypes.includes('slot_jackpot')) {
                appendCandidates(await this.buildGameSubKeysWithRelated('slot_jackpot', failList), 'slot_jackpot')
            }
            if (this.configTypes.includes('slot_task')) {
                appendCandidates([this.getSlotsCustomScriptKey(0, 'slot_task')], 'slot_task')
            }
            if (this.configTypes.includes('slot_script_stat')) {
                appendCandidates([this.getSlotsCustomScriptKey(0, 'slot_script_stat')], 'slot_script_stat')
            }
            return candidates
        },

        async buildCopyPreviewTask(candidate, context) {
            const sourceResult = await this.getCopyPreviewSourceRecord(candidate, context)
            if (sourceResult.errMsg) {
                return { errMsg: sourceResult.errMsg }
            }
            if (!sourceResult.record || sourceResult.record.Data === undefined || sourceResult.record.Data === null) {
                return { errMsg: `源配置不存在:${candidate.subKey}` }
            }

            const targetResult = await this.getCopyPreviewAppRecord(candidate.subKey, candidate.appId, context.appRecordCache)
            if (targetResult.errMsg) {
                return { errMsg: targetResult.errMsg }
            }

            const sourceDataResult = this.buildCopyPreviewSourceData(candidate, sourceResult.record)
            if (sourceDataResult.errMsg) {
                return { errMsg: sourceDataResult.errMsg }
            }
            const targetRecord = targetResult.record
            const targetData = targetRecord
                ? this.parseCopyComparableData(targetRecord.Data)
                : undefined
            const diffRows = targetRecord
                ? this.buildObjectDiffRows(targetData, sourceDataResult.compareData)
                : [{
                    key: '配置',
                    oldVal: '目标配置不存在',
                    newVal: sourceDataResult.compareData
                }]
            const task = Object.assign(
                this.buildPublishTask(candidate.cfgItem, candidate.keyStr, candidate.appId),
                {
                    cfgItem: candidate.cfgItem,
                    sourceRecord: sourceResult.record,
                    targetRecord,
                    copyData: sourceDataResult.copyData,
                    diffRows,
                    diffScene: 'copy',
                    skipReason: candidate.keyStr === 'slot_plan' ? '方案无差异，禁止复制' : '内容无差异，跳过复制'
                }
            )
            return { task }
        },

        buildCopyPreviewSourceData(candidate, sourceRecord) {
            if (candidate.keyStr !== 'slot_plan') {
                const data = this.parseCopyComparableData(sourceRecord.Data)
                return {
                    compareData: this.cloneData(data),
                    copyData: this.cloneData(data)
                }
            }

            let data = this.parseJson(sourceRecord.Data, null)
            if (this.isLegacySource() && Array.isArray(data)) {
                data = {
                    SlotsType: candidate.gameId,
                    Plans: data
                }
            }
            if (!data || !Array.isArray(data.Plans)) {
                return { errMsg: `源方案配置数据格式错误:${candidate.subKey}` }
            }
            // 复制前先比较源、目标当前配置；实际写入时才调整剧本就绪状态和测试剧本数量。
            const compareData = this.cloneData(data)
            const copyData = this.cloneData(data)
            this.resetPlanDataReady(copyData)
            return {
                compareData,
                copyData
            }
        },

        parseCopyComparableData(raw) {
            if (typeof raw !== 'string') {
                return raw && typeof raw === 'object' ? this.cloneData(raw) : raw
            }
            const parsed = this.parseJson(raw, undefined)
            return parsed === undefined ? raw : parsed
        },

        async getCopyPreviewSourceRecord(candidate, context) {
            if (!this.isLegacySource()) {
                return this.getCopyPreviewAppRecord(candidate.subKey, this.appId, context.appRecordCache)
            }
            const cacheKey = `${candidate.keyStr}_${candidate.gameId === undefined ? '-' : candidate.gameId}_${candidate.subKey}`
            if (!context.sourceRecordCache.has(cacheKey)) {
                context.sourceRecordCache.set(cacheKey, this.getSourceConfigRecord(candidate.cfgItem, candidate.keyStr))
            }
            return context.sourceRecordCache.get(cacheKey)
        },

        async getCopyPreviewAppRecord(subKey, appId, cache) {
            const cacheKey = String(appId)
            if (!cache.has(cacheKey)) {
                cache.set(cacheKey, (async () => {
                    try {
                        const response = await getAllCustomizes(store.getters.env, appId)
                        if (response.RetCode !== 0) {
                            return {
                                errMsg: this.getCopyError(response) || `读取App配置列表失败:${appId}`
                            }
                        }
                        const records = Array.isArray(response.Data) ? response.Data : []
                        return {
                            recordMap: new Map(records.map(item => [item.RedisSubkey, item]))
                        }
                    } catch (err) {
                        return {
                            errMsg: this.getCopyError(null, err) || `读取App配置列表异常:${appId}`
                        }
                    }
                })())
            }
            const result = await cache.get(cacheKey)
            if (result.errMsg) {
                return result
            }
            return { record: result.recordMap.get(subKey) || null }
        },

        buildCopyPreviewFailTask(item) {
            const task = {
                appId: item.appId || '-',
                gameId: item.gameId,
                gameName: item.gameName || this.getGameLabel(item.gameId),
                configName: item.configName || typeLabelMap[item.keyStr] || item.keyStr || '配置',
                subKey: item.subKey || '-',
                keyStr: item.keyStr,
                errMsg: item.errMsg || '生成复制差异失败'
            }
            task.rawFailure = Object.assign({}, item, {
                appId: item.appId,
                gameName: task.gameName,
                configName: task.configName,
                subKey: item.subKey
            })
            return task
        },

        async confirmCopyPreview() {
            if (this.loading) return
            if (this.copyPreviewDiffTasks.length === 0) {
                return this.$message.warning('没有可复制的差异配置')
            }

            const copyTasks = this.copyPreviewDiffTasks.slice()
            if (!(await this.ensureNoTargetExistingTasks('复制', copyTasks))) {
                return
            }
            const skippedCount = this.copyPreviewSameTasks.length
            const failList = this.copyPreviewFailTasks.map(item => item.rawFailure)
            const successTasks = []
            this.loading = true
            this.publishTasks = []
            this.copyPublishTasks = []
            this.resetScriptCreateQueueState()
            this.scriptCreateTasks = []
            this.readyPreviewTasks = []
            this.readyFailedPreviewTasks = []
            this.readyPreviewMode = 'check'
            this.scriptCreateDialogVisible = false
            this.readyPreviewDialogVisible = false
            this.activePublishStage = publishStageCopyConfig

            try {
                for (const task of copyTasks) {
                    try {
                        const result = await this.executeCopyPreviewTask(task)
                        if (result.errMsg) {
                            failList.push({
                                keyStr: task.keyStr,
                                gameId: task.gameId,
                                gameName: task.gameName,
                                appId: task.appId,
                                subKey: task.subKey,
                                errMsg: result.errMsg
                            })
                            continue
                        }
                        const successTask = this.buildPublishTask(task.cfgItem, task.keyStr, task.appId)
                        if (task.keyStr === 'slot_plan') {
                            successTask.planRecord = result.record
                            successTask.planConfigData = result.data
                        }
                        successTasks.push(successTask)
                    } catch (err) {
                        failList.push({
                            keyStr: task.keyStr,
                            gameId: task.gameId,
                            gameName: task.gameName,
                            appId: task.appId,
                            subKey: task.subKey,
                            errMsg: this.getCopyError(null, err) || '复制配置异常'
                        })
                    }
                }

                this.copyPublishTasks = successTasks
                this.scriptPublishTasks = this.removeOverlappedPublishTasks(this.scriptPublishTasks, successTasks)
                this.readyPublishTasks = this.removeOverlappedPublishTasks(this.readyPublishTasks, successTasks)
                this.persistCopyFlowState()
                this.copyPreviewDialogVisible = false

                if (failList.length > 0) {
                    const msg = failList.map(item => this.formatCopyFailMessage(item)).join('\n')
                    this.$alert(msg, '部分复制失败', { type: 'warning' })
                } else {
                    this.$message.success(`复制完成，成功 ${successTasks.length} 个配置，跳过无差异 ${skippedCount} 个配置`)
                }
            } finally {
                this.loading = false
            }
        },

        async executeCopyPreviewTask(task) {
            if (task.keyStr === 'slot_plan') {
                return this.saveCopyPreviewPlanTask(task)
            }
            const response = this.isLegacySource()
                ? await this.saveCopyPreviewLegacyTask(task)
                : await copyCustomize(task.subKey, this.appId, task.appId)
            if (response.errMsg || response.RetCode !== 0) {
                return {
                    errMsg: response.errMsg || this.getCopyError(response) || `复制配置失败:${task.subKey}`
                }
            }
            return { record: response.Data || null }
        },

        async saveCopyPreviewPlanTask(task) {
            const data = this.cloneData(task.copyData)
            const payload = this.buildPlanCopyPayload(task.sourceRecord, task.cfgItem, task.appId, data, task.targetRecord)
            const response = task.targetRecord ? await updateCustomize(payload) : await createCustomize(payload)
            if (response.RetCode !== 0) {
                return {
                    errMsg: this.getCopyError(response) || `${task.targetRecord ? '更新' : '创建'}目标方案配置失败:${task.subKey}`
                }
            }
            return {
                record: response.Data || payload,
                data
            }
        },

        async saveCopyPreviewLegacyTask(task) {
            const payload = this.buildLegacyCopyPayload(
                task.sourceRecord,
                Object.assign({}, task.cfgItem, { keyStr: task.keyStr }),
                task.appId,
                task.targetRecord
            )
            const response = task.targetRecord ? await updateCustomize(payload) : await createCustomize(payload)
            if (response.RetCode !== 0) {
                return { errMsg: this.getCopyError(response) || `写入目标新版配置失败:${task.subKey}` }
            }
            return response
        },

        closeCopyPreviewDialog() {
            this.copyPreviewDialogVisible = false
        },

        resetCopyPreviewState() {
            this.copyPreviewDiffTasks = []
            this.copyPreviewSameTasks = []
            this.copyPreviewFailTasks = []
            if (this.diffDetailMode === 'copy') {
                this.diffDetailVisible = false
                this.currentDiffTask = null
                this.diffDetailMode = 'publish'
            }
        },

        showCopyPreviewDiffDetail(task) {
            this.diffDetailMode = 'copy'
            this.currentDiffTask = task
            this.diffDetailVisible = true
        },



        async loadConfig(keyStr) {

            const tasks = this.selectedGameIds.map(async (gameId) => {
                const result = await this.getSourceConfigRecord({
                    gameId,
                    subKey: this.getSlotsCustomScriptKey(gameId, keyStr)
                }, keyStr)
                if (result.errMsg || !result.record || !result.record.Data) {
                    return null
                }
                console.log('loadConfig:', result.record.Data)
                return {
                    gameId,
                    config: result.record.Data
                }
            })

            const results = await Promise.all(tasks)

            return results.filter(Boolean)
        },

        getCopyError(response, err) {
            if (err) {
                return err.message || String(err)
            }
            if (!response) {
                return ''
            }
            if (!response || response.Data === undefined || response.Data === null) {
                return response.RetMsg || response.Message || response.Msg || response.ErrMsg || response.Error || ''
            }
            return typeof response.Data === 'string' ? response.Data : JSON.stringify(response.Data)
        },

        formatCopyFailMessage(item) {
            const label = typeLabelMap[item.keyStr] || item.keyStr
            const gameText = item.gameId === undefined || item.gameId === null ? '' : `，游戏:${item.gameId}`
            const subKeyText = item.subKey ? `，Key:${item.subKey}` : ''
            const reasonText = this.formatOperationError(item.errMsg, {
                appId: item.appId,
                subKey: item.subKey,
                keyStr: item.keyStr,
                operationName: '复制'
            })
            return `${label}${gameText} App:${item.appId}${subKeyText} 失败，${reasonText}`
        },

        formatPlanOperationFailMessage(item, operationName) {
            const task = item.task || {}
            const planText = item.plan ? `，方案:${item.plan.PlanId}` : ''
            const versionText = item.version ? `，版本:${item.version.Version}` : ''
            const reasonText = this.formatOperationError(item.errMsg, {
                appId: task.appId,
                subKey: task.subKey,
                keyStr: 'slot_plan',
                operationName,
                publishEnvName: item.publishEnvName,
                publishActionName: item.publishActionName
            })
            return `${task.appId || '-'} ${task.subKey || ''}${planText}${versionText} 失败，${reasonText}`
        },

        formatOperationError(errMsg, context = {}) {
            const msg = errMsg || '未知错误'
            const subKey = context.subKey || this.extractErrorField(msg, 'subKey') || this.extractKnownSubKey(msg)
            const fromAppId = this.extractErrorField(msg, 'fromAppId') || this.appId
            const fromAppLabel = Number(fromAppId) === 0 ? '旧版' : (fromAppId || '-')
            const configLabel = this.getConfigTypeOptionLabel(context.keyStr)
            const operationName = context.operationName || '操作'

            if (this.isCustomizeConfigNotFoundError(msg)) {
                return `原因:源 AppId ${fromAppLabel} 未找到${configLabel}${subKey ? ` ${subKey}` : ''}。处理方式:请先在源 AppId 保存该配置，或取消勾选【${configLabel}】后重新复制。`
            }

            if (this.isPublishedPlanConfigMissingError(msg, context)) {
                const publishEnvName = context.publishEnvName || this.getPlanPublishedReadInfo().envName
                const publishActionName = context.publishActionName || this.getPlanPublishedReadInfo().actionName
                return `原因:目标 AppId ${context.appId || '-'} 的方案配置 ${subKey || ''} 尚未发布到${publishEnvName}。处理方式:请先点击【发布】，将该复制配置${publishActionName}后再执行【${operationName}】。`
            }

            if (/源方案配置不存在/.test(msg)) {
                return `原因:源 AppId ${fromAppLabel} 未找到方案配置 ${subKey || ''}。处理方式:请先在源 AppId 保存该方案配置，或取消勾选【老虎机方案配置】后重新复制。`
            }

            if (/目标方案配置不存在/.test(msg)) {
                return `原因:目标 AppId ${context.appId || '-'} 未找到方案配置 ${subKey || ''}。处理方式:请先执行【复制】并确认该方案配置复制成功，再执行【${operationName}】。`
            }

            if (/方案配置数据格式错误|源方案配置数据格式错误/.test(msg)) {
                return `原因:方案配置 ${subKey || ''} 数据格式异常。处理方式:请检查该方案配置内容是否为正确 JSON，并确认 Plans 配置存在。`
            }

            if (/未找到游戏基础配置Key/.test(msg)) {
                return `原因:未找到该游戏对应的 base 配置 Key。处理方式:请先维护 SubKeyMap 映射后再执行【${operationName}】。`
            }

            if (/基础配置不存在/.test(msg)) {
                const baseSubKey = this.extractAfterColon(msg)
                return `原因:目标 AppId ${context.appId || '-'} 未找到基础配置 ${baseSubKey || ''}。处理方式:请先复制并保存该游戏的 base 配置，再执行【${operationName}】。`
            }

            if (/基础配置下注列表为空/.test(msg)) {
                const baseSubKey = this.extractAfterColon(msg)
                return `原因:基础配置 ${baseSubKey || ''} 的下注列表为空。处理方式:请先维护 base 配置里的 BetList，再执行【${operationName}】。`
            }

            if (/剧本数量不足/.test(msg)) {
                const detail = msg.replace(/^剧本数量不足\s*/, '')
                return `原因:部分下注额剧本数量不足${detail ? `（${detail}）` : ''}。处理方式:请先执行【创建剧本】并等待创建完成，再执行【剧本就绪】。`
            }

            if (/查询下注额.*剧本失败|查询剧本异常/.test(msg)) {
                return `原因:查询剧本数量失败。处理方式:请稍后重试；如果持续失败，请联系技术检查剧本服务或 Redis 数据。原始错误:${msg}`
            }

            if (/保存方案就绪状态失败/.test(msg)) {
                return `原因:保存方案就绪状态失败。处理方式:请重试；如果持续失败，请检查方案配置是否存在、是否有权限保存。原始错误:${msg}`
            }

            if (/检测附属方案配置失败|检测附属方案配置异常/.test(msg)) {
                return `原因:检测额外加注方案配置 ${subKey || ''} 是否存在失败。处理方式:请重试；如果持续失败，请检查目标 AppId 是否能正常读取该配置。原始错误:${msg}`
            }

            return `原因:${msg}。处理方式:请检查源配置是否存在、当前环境是否正确、相关配置是否已发布。`
        },

        isCustomizeConfigNotFoundError(errMsg) {
            return /CustomizeConfig not found/i.test(errMsg || '')
        },

        isPublishedPlanConfigMissingError(errMsg, context = {}) {
            const msg = errMsg || ''
            if (context.keyStr !== 'slot_plan') {
                return false
            }
            if (/已发布方案配置不存在/.test(msg)) {
                return true
            }
            return /sql:\s*no rows in result set/i.test(msg) &&
                (/生成测试环境配置差异出错/.test(msg) || /读取已发布方案配置/.test(msg) || /SlotsCustomScriptConfig_/.test(context.subKey || msg))
        },

        extractErrorField(errMsg, fieldName) {
            const match = new RegExp(`${fieldName}:([^,\\s]+)`).exec(errMsg || '')
            return match ? match[1] : ''
        },

        extractAfterColon(errMsg) {
            const parts = String(errMsg || '').split(':')
            return parts.length > 1 ? parts.slice(1).join(':') : ''
        },

        extractKnownSubKey(errMsg) {
            const match = /(SlotsCustomScriptConfig_\d+|SlotsBigPrizeConfig_\d+|SlotsScriptStatisticsConfig|slotsmission|[a-z0-9_]+_slots_(?:base|rule|ext))/i.exec(errMsg || '')
            return match ? match[1] : ''
        },

        getConfigTypeOptionLabel(keyStr) {
            const option = this.configTypeOptions.find(item => item.value === keyStr)
            return option ? option.label : (typeLabelMap[keyStr] || keyStr || '配置')
        },

        buildGameSubKeys(keyStr) {
            return this.selectedGameIds.map(gameId => ({
                gameId,
                subKey: this.getSlotsCustomScriptKey(gameId, keyStr),
                configName: typeLabelMap[keyStr] || keyStr
            }))
        },

        async buildGameSubKeysWithRelated(keyStr, failList = []) {
            const subKeys = this.buildGameSubKeys(keyStr)
            if (!relatedGameConfigTypes.includes(keyStr)) {
                return subKeys
            }

            const existSubKeySet = new Set(subKeys.map(item => item.subKey))
            for (const gameId of this.selectedGameIds) {
                const relatedGameId = this.getRelatedGameId(gameId)
                if (!relatedGameId) {
                    continue
                }

                const subKey = this.getSlotsCustomScriptKey(relatedGameId, keyStr)
                if (existSubKeySet.has(subKey)) {
                    continue
                }

                if (await this.hasSourceRelatedConfig(subKey, keyStr, relatedGameId, failList)) {
                    subKeys.push({
                        gameId: relatedGameId,
                        subKey,
                        configName: `${typeLabelMap[keyStr] || keyStr}(附属)`,
                        gameName: `${this.getGameLabel(gameId)} 附属配置(GID:${relatedGameId})`
                    })
                    existSubKeySet.add(subKey)
                }
            }

            return subKeys
        },

        getRelatedGameId(gameId) {
            const id = Number(gameId)
            if (!Number.isFinite(id) || id >= relatedGameIdOffset) {
                return null
            }
            return id + relatedGameIdOffset
        },

        async hasSourceRelatedConfig(subKey, keyStr, gameId, failList = []) {
            try {
                if (this.isLegacySource()) {
                    const sourceResult = await this.getSourceConfigRecord({ gameId, subKey }, keyStr)
                    if (sourceResult.errMsg) {
                        // 旧版未配置附属玩法大奖时，直接跳过该附属配置。
                        if (/CustomizeConfig not found|sql:\s*no rows in result set/i.test(sourceResult.errMsg)) {
                            return false
                        }
                        failList.push({
                            keyStr,
                            gameId,
                            appId: this.appId,
                            subKey,
                            errMsg: `检测旧版附属配置失败:${sourceResult.errMsg}`
                        })
                        return false
                    }
                    return !!(sourceResult.record && sourceResult.record.Data)
                }
                const response = await existCustomize(subKey, this.appId)
                return response.RetCode === 0 && response.Data === true
            } catch (err) {
                failList.push({
                    keyStr,
                    gameId,
                    appId: this.appId,
                    subKey,
                    errMsg: `源App附属配置检测失败:${this.getCopyError(null, err)}`
                })
                return false
            }
        },

        getFullKey(subKey) {
            return 'CustomizeCfg_' + subKey
        },

        async buildCopyTargetCheckTasks() {
            const tasks = []
            const appendTasks = (items, keyStr) => {
                for (const item of items) {
                    if (item.missingMap || !item.subKey) {
                        continue
                    }
                    for (const appId of this.targetAppIds) {
                        tasks.push(this.buildPublishTask(item, keyStr, appId))
                    }
                }
            }

            if (this.configTypes.includes('slot_game')) {
                appendTasks(this.buildSlotGameCfgSubKeys(), 'slot_game')
            }
            if (this.configTypes.includes('slot_plan')) {
                appendTasks(await this.buildGameSubKeysWithRelated('slot_plan'), 'slot_plan')
            }
            if (this.configTypes.includes('slot_jackpot')) {
                appendTasks(await this.buildGameSubKeysWithRelated('slot_jackpot'), 'slot_jackpot')
            }
            if (this.configTypes.includes('slot_task')) {
                appendTasks([{ subKey: this.getSlotsCustomScriptKey(0, 'slot_task') }], 'slot_task')
            }
            if (this.configTypes.includes('slot_script_stat')) {
                appendTasks([{ subKey: this.getSlotsCustomScriptKey(0, 'slot_script_stat') }], 'slot_script_stat')
            }
            return tasks
        },

        async ensureNoTargetExistingTasks(operationName, tasks) {
            // 测试环境允许重复复制；正式环境的配置复制只用于创建尚不存在的目标配置。
            if (store.getters.env === 'test') {
                return true
            }
            const result = await this.getTargetExistingConfigCheckResult(tasks)
            if (result.errorTasks.length > 0) {
                this.showTargetConfigCheckErrors(operationName, result.errorTasks)
                return false
            }
            if (result.existingTasks.length > 0) {
                this.showTargetExistingConfigConflicts(operationName, result.existingTasks)
                return false
            }
            return true
        },

        async getTargetExistingConfigCheckResult(tasks) {
            const taskMap = new Map()
            for (const task of tasks) {
                if (!task || task.appId === undefined || task.appId === null || !task.subKey) {
                    continue
                }
                taskMap.set(`${task.appId}_${task.subKey}`, task)
            }

            const appTaskMap = new Map()
            for (const task of taskMap.values()) {
                const appIdKey = String(task.appId)
                if (!appTaskMap.has(appIdKey)) {
                    appTaskMap.set(appIdKey, {
                        appId: task.appId,
                        tasks: []
                    })
                }
                appTaskMap.get(appIdKey).tasks.push(task)
            }

            const appEntries = Array.from(appTaskMap.values())
            const existingTasks = []
            const errorTasks = []
            let nextIndex = 0
            const worker = async () => {
                while (nextIndex < appEntries.length) {
                    const { appId, tasks: appTasks } = appEntries[nextIndex++]
                    try {
                        const response = await getAllCustomizes(store.getters.env, appId)
                        if (response.RetCode !== 0) {
                            const errMsg = this.getCopyError(response) || `读取目标 AppId ${appId} 配置列表失败`
                            errorTasks.push(...appTasks.map(task => ({ task, errMsg })))
                            continue
                        }
                        const records = Array.isArray(response.Data) ? response.Data : []
                        const existingKeySet = new Set(records.map(item => item.RedisSubkey))
                        existingTasks.push(...appTasks.filter(task => existingKeySet.has(task.subKey)))
                    } catch (err) {
                        const errMsg = this.getCopyError(null, err) || `读取目标 AppId ${appId} 配置列表异常`
                        errorTasks.push(...appTasks.map(task => ({ task, errMsg })))
                    }
                }
            }
            const workerCount = Math.min(formalConfigCheckConcurrency, appEntries.length)
            await Promise.all(Array.from({ length: workerCount }, () => worker()))
            return { existingTasks, errorTasks }
        },

        showTargetExistingConfigConflicts(operationName, tasks) {
            this.showFormalCheckDialog({
                title: '目标配置已存在',
                message: `以下目标配置已经存在，不能继续执行【${operationName}】。配置复制仅用于尚未创建这些配置的目标 AppId，请取消对应目标 AppId、游戏或配置类型后重试。`,
                tasks
            })
        },

        showTargetConfigCheckErrors(operationName, errorTasks) {
            this.showFormalCheckDialog({
                title: '目标配置检查失败',
                message: `目标配置检查失败，已停止执行【${operationName}】。请检查目标 AppId 配置列表后重试。`,
                tasks: errorTasks.map(item => Object.assign({}, item.task, { errMsg: item.errMsg })),
                isError: true
            })
        },

        async ensureNoFormalPublishedTasks(operationName, tasks) {
            // 测试环境允许重复复制和调整剧本，不校验已发布配置。
            if (store.getters.env === 'test') {
                return true
            }
            const result = await this.getFormalConfigCheckResult(tasks)
            if (result.errorTasks.length > 0) {
                this.showFormalConfigCheckErrors(operationName, result.errorTasks)
                return false
            }
            if (result.publishedTasks.length > 0) {
                this.showFormalPublishedConfigConflicts(operationName, result.publishedTasks)
                return false
            }
            return true
        },

        async getFormalConfigCheckResult(tasks) {
            const taskMap = new Map()
            for (const task of tasks) {
                if (!task || !task.appId || !task.publishKey) {
                    continue
                }
                taskMap.set(`${task.appId}_${task.publishKey}`, task)
            }

            const checkTasks = Array.from(taskMap.values())
            const publishedTasks = []
            const errorTasks = []
            let nextIndex = 0
            const worker = async () => {
                while (nextIndex < checkTasks.length) {
                    const task = checkTasks[nextIndex++]
                    try {
                        const response = await legacyRequest({
                            url: '/dataProxy/info',
                            method: 'get',
                            data: {
                                Path: '/configcenter/one',
                                Env: store.getters.env,
                                Key: task.publishKey,
                                App: task.appId
                            }
                        })
                        if (response && response.RetCode === 0) {
                            publishedTasks.push(task)
                        } else if (!this.isFormalConfigNotExists(response)) {
                            errorTasks.push({
                                task,
                                errMsg: this.getCopyError(response) || '正式配置中心查询失败'
                            })
                        }
                    } catch (err) {
                        errorTasks.push({
                            task,
                            errMsg: this.getCopyError(null, err) || '正式配置中心查询异常'
                        })
                    }
                }
            }
            const workerCount = Math.min(formalConfigCheckConcurrency, checkTasks.length)
            await Promise.all(Array.from({ length: workerCount }, () => worker()))
            return { publishedTasks, errorTasks }
        },

        isFormalConfigNotExists(response) {
            return response && response.RetCode === -3 && /\bnot exists\b/i.test(this.getCopyError(response))
        },

        showFormalPublishedConfigConflicts(operationName, tasks) {
            this.showFormalCheckDialog({
                title: '存在已发布配置',
                message: `以下配置已发布，不能继续执行【${operationName}】。请取消对应游戏、目标 AppId 或配置类型后重试。`,
                tasks
            })
        },

        showFormalConfigCheckErrors(operationName, errorTasks) {
            this.showFormalCheckDialog({
                title: '正式配置校验失败',
                message: `正式配置校验失败，已停止执行【${operationName}】。请检查正式配置中心连接或配置 Key 后重试。`,
                tasks: errorTasks.map(item => Object.assign({}, item.task, { errMsg: item.errMsg })),
                isError: true
            })
        },

        showFormalCheckDialog({ title, message, tasks, isError = false }) {
            this.formalCheckDialogTitle = title
            this.formalCheckDialogMessage = message
            this.formalCheckTasks = tasks.map(task => Object.assign({}, task, {
                gameName: task.gameName || this.getGameLabel(task.gameId)
            }))
            this.formalCheckIsError = isError
            this.formalCheckDialogVisible = true
        },

        formatPublishError(task, response, err) {
            const errMsg = this.getCopyError(response, err) || '未知错误'
            if (!task || !task.publishKey) {
                return errMsg
            }
            const displayMsg = errMsg.split(task.publishKey).join(task.subKey)
            if (/sql:\s*no rows in result set/i.test(displayMsg)) {
                return `原因:发布系统未找到 AppId ${task.appId || '-'} 的配置 ${task.subKey || ''}。处理方式:请确认该配置已保存成功；如果是复制后的内容，请先执行【复制】并确认成功后再发布。原始错误:${displayMsg}`
            }
            return displayMsg
        },

        buildPublishResultTask(task, resultMsg) {
            return {
                appId: task.appId,
                gameName: task.gameName || this.getGameLabel(task.gameId),
                subKey: task.subKey,
                configName: task.configName,
                publishOpTypeName: task.publishOpTypeName || (task.publishBlocked ? '不可发布' : this.getPublishOpTypeName(task.publishOpType)),
                resultMsg
            }
        },

        getGameLabel(gameId) {
            if (gameId === undefined || gameId === null) {
                return '其它公共配置'
            }
            const game = this.gameOptions.find(o => String(o.key) === String(gameId))
            return game ? game.label : String(gameId)
        },

        buildPublishTask(item, keyStr, appId) {
            return {
                appId,
                gameId: item.gameId,
                gameName: item.gameName || this.getGameLabel(item.gameId),
                configName: item.configName || typeLabelMap[keyStr] || keyStr,
                configDesc: item.configName || typeLabelMap[keyStr] || keyStr,
                subKey: item.subKey,
                publishKey: this.getFullKey(item.subKey),
                keyStr
            }
        },

        buildSourcePublishTasksBySubKeys(subKeys, keyStr, failList = []) {
            const tasks = []
            for (const item of subKeys) {
                const cfgItem = typeof item === 'string' ? { subKey: item } : item
                if (cfgItem.missingMap || !cfgItem.subKey) {
                    failList.push({
                        keyStr,
                        gameId: cfgItem.gameId,
                        appId: this.appId,
                        errMsg: '未配置老虎机配置Key映射，请维护SubKeyMap'
                    })
                    continue
                }
                const task = this.buildPublishTask(cfgItem, keyStr, this.appId)
                task.publishStage = publishStageSourceConfig
                task.publishStageName = this.getPublishStageName(publishStageSourceConfig)
                tasks.push(task)
            }
            return tasks
        },

        async buildSourcePublishTasks() {
            const tasks = []
            const failList = []
            if (this.configTypes.includes('slot_game')) {
                tasks.push(...this.buildSourcePublishTasksBySubKeys(this.buildSlotGameCfgSubKeys(), 'slot_game', failList))
            }
            if (this.configTypes.includes('slot_plan')) {
                tasks.push(...this.buildSourcePublishTasksBySubKeys(await this.buildGameSubKeysWithRelated('slot_plan', failList), 'slot_plan', failList))
            }
            if (this.configTypes.includes('slot_jackpot')) {
                tasks.push(...this.buildSourcePublishTasksBySubKeys(await this.buildGameSubKeysWithRelated('slot_jackpot', failList), 'slot_jackpot', failList))
            }
            if (this.configTypes.includes('slot_task')) {
                tasks.push(...this.buildSourcePublishTasksBySubKeys([this.getSlotsCustomScriptKey(0, 'slot_task')], 'slot_task', failList))
            }
            if (this.configTypes.includes('slot_script_stat')) {
                tasks.push(...this.buildSourcePublishTasksBySubKeys([this.getSlotsCustomScriptKey(0, 'slot_script_stat')], 'slot_script_stat', failList))
            }
            if (failList.length > 0) {
                this.showSourcePublishBuildErrors(failList)
                return null
            }
            return tasks
        },

        showSourcePublishBuildErrors(failList) {
            const msg = failList.map(item => this.formatCopyFailMessage(item)).join('\n')
            this.$alert(msg, '源配置发布检查失败', {
                type: 'warning'
            })
        },

        validateSourcePublishSelection() {
            if (this.isLegacySource()) {
                this.$message.warning('旧版仅支持复制到新版，不能作为新版发布源')
                return false
            }
            if (this.appId === null || this.appId === undefined) {
                this.$message.warning('请选择源 AppId')
                return false
            }
            if (this.targetAppIds.length > 0) {
                this.$message.warning('已有目标 AppId 时，请先执行复制后再发布复制内容')
                return false
            }
            if (!this.configTypes.length) {
                this.$message.warning('请选择配置类型')
                return false
            }
            if (this.configTypes.includes('slot_game') && !this.selectedGameCfgKeys.length) {
                this.$message.warning('请选择老虎机游戏配置类型')
                return false
            }
            if (this.hasGameRelatedConfig && !this.selectedGameIds.length) {
                this.$message.warning('请选择游戏')
                return false
            }
            return true
        },

        getSlotGameSubKeyPrefix(gameId) {
            const baseSubKey = SubKeyMap[Number(gameId)]
            if (!baseSubKey || !baseSubKey.endsWith('_slots_base')) {
                return ''
            }
            return baseSubKey.replace(/_slots_base$/, '')
        },

        isGameMissingSubKeyMap(gameId) {
            return !this.getSlotGameSubKeyPrefix(gameId)
        },

        isGameOptionDisabled(gameId) {
            return this.configTypes.includes('slot_game') && this.isGameMissingSubKeyMap(gameId)
        },

        handleGameOptionClick(gameId) {
            if (!this.isGameOptionDisabled(gameId)) {
                return
            }
            const game = this.getGameOption(gameId)
            this.showMissingSubKeyMapTip([{
                gameId,
                label: game ? game.label : `GID:${gameId}`
            }])
        },

        getGameOption(gameId) {
            return this.gameOptions.find(item => String(item.key) === String(gameId))
        },

        getMissingSubKeyMapGames(gameIds) {
            if (!this.configTypes.includes('slot_game')) {
                return []
            }
            return gameIds.filter(gameId => this.isGameMissingSubKeyMap(gameId)).map(gameId => {
                const game = this.getGameOption(gameId)
                return {
                    gameId,
                    label: game ? game.label : `GID:${gameId}`
                }
            })
        },

        showMissingSubKeyMapTip(missingGames) {
            if (!missingGames.length) {
                return
            }
            const maxShowCount = 20
            const rows = missingGames.slice(0, maxShowCount).map(item => item.label)
            if (missingGames.length > maxShowCount) {
                rows.push(`还有 ${missingGames.length - maxShowCount} 个游戏未展示`)
            }
            this.$alert(
                `以下游戏缺少SubKeyMap映射，不能选择老虎机游戏配置，请先维护映射：\n${rows.join('\n')}`,
                '缺少配置Key映射',
                { type: 'warning' }
            )
        },

        updateCheckAllGames() {
            const total = this.selectableFilteredGameOptions.length
            const selectedGameIdSet = new Set(this.selectedGameIds.map(gameId => String(gameId)))
            const selectedCount = this.selectableFilteredGameOptions.filter(game => selectedGameIdSet.has(String(game.key))).length
            this.checkAllGames = total > 0 && selectedCount === total
        },

        filterSelectedGamesBySubKeyMap(showTip = true) {
            const missingGames = this.getMissingSubKeyMapGames(this.selectedGameIds)
            if (missingGames.length === 0) {
                this.updateCheckAllGames()
                return true
            }
            const missingSet = new Set(missingGames.map(item => String(item.gameId)))
            this.selectedGameIds = this.selectedGameIds.filter(gameId => !missingSet.has(String(gameId)))
            this.updateCheckAllGames()
            if (showTip) {
                this.showMissingSubKeyMapTip(missingGames)
            }
            return false
        },

        getSlotGameCfgSubKeys(gameId) {
            const prefix = this.getSlotGameSubKeyPrefix(gameId)
            if (!prefix) {
                return []
            }
            return this.selectedGameCfgKeys.map(key => ({
                gameId,
                subKey: `${prefix}_slots_${key}`,
                configName: gameCfgLabelMap[key] || key
            }))
        },

        buildSlotGameCfgSubKeys() {
            const subKeys = []
            for (const gameId of this.selectedGameIds) {
                const items = this.getSlotGameCfgSubKeys(gameId)
                if (items.length === 0) {
                    subKeys.push({
                        gameId,
                        subKey: '',
                        missingMap: true
                    })
                    continue
                }
                subKeys.push(...items)
            }
            return subKeys
        },

        async copyConfigBySubKeys(subKeys, keyStr, failList = [], successTasks = []) {
            for (const item of subKeys) {
                const cfgItem = typeof item === 'string' ? { subKey: item } : item

                if (cfgItem.missingMap) {
                    for (const appId of this.targetAppIds) {
                        failList.push({ keyStr, gameId: cfgItem.gameId, appId, errMsg: '未配置老虎机配置Key映射，请维护SubKeyMap' })
                    }
                    continue
                }

                for (const appId of this.targetAppIds) {
                    try {
                        if (keyStr === 'slot_plan') {
                            const copyResult = await this.copyPlanConfig(cfgItem, appId)
                            if (copyResult.errMsg) {
                                failList.push({
                                    keyStr,
                                    gameId: cfgItem.gameId,
                                    appId,
                                    subKey: cfgItem.subKey,
                                    errMsg: copyResult.errMsg
                                })
                                continue
                            }
                            const successTask = this.buildPublishTask(cfgItem, keyStr, appId)
                            successTask.planRecord = copyResult.record
                            successTask.planConfigData = copyResult.data
                            successTasks.push(successTask)
                            continue
                        }

                        const res = this.isLegacySource()
                            ? await this.copyLegacyConfig(cfgItem, keyStr, appId)
                            : await copyCustomize(cfgItem.subKey, this.appId, appId)
                        if (res.errMsg || res.RetCode !== 0) {
                            failList.push({
                                keyStr,
                                gameId: cfgItem.gameId,
                                appId,
                                subKey: cfgItem.subKey,
                                errMsg: res.errMsg || this.getCopyError(res)
                            })
                        } else {
                            successTasks.push(this.buildPublishTask(cfgItem, keyStr, appId))
                        }
                    } catch (err) {
                        failList.push({
                            keyStr,
                            gameId: cfgItem.gameId,
                            appId,
                            subKey: cfgItem.subKey,
                            errMsg: this.getCopyError(null, err)
                        })
                    }
                }
            }
            return failList
        },

        async copySlotGameConfigs(failList = [], successTasks = []) {
            return this.copyConfigBySubKeys(this.buildSlotGameCfgSubKeys(), 'slot_game', failList, successTasks)
        },

        async copyPlanConfig(cfgItem, appId) {
            try {
                const sourceResult = await this.getSourceConfigRecord(cfgItem, 'slot_plan')
                if (sourceResult.errMsg) {
                    return {
                        errMsg: sourceResult.errMsg
                    }
                }
                if (!sourceResult.record || !sourceResult.record.Data) {
                    return { errMsg: `源方案配置不存在:${cfgItem.subKey}` }
                }

                let data = this.parseJson(sourceResult.record.Data, null)
                if (this.isLegacySource() && Array.isArray(data)) {
                    data = {
                        SlotsType: cfgItem.gameId,
                        Plans: data
                    }
                }
                if (!data || !Array.isArray(data.Plans)) {
                    return { errMsg: `源方案配置数据格式错误:${cfgItem.subKey}` }
                }

                this.resetPlanDataReady(data)

                const targetResult = await this.getCustomizeRecordFromAll(cfgItem.subKey, appId)
                if (targetResult.errMsg) {
                    return {
                        errMsg: targetResult.errMsg
                    }
                }
                const targetRecord = targetResult.record

                const payload = this.buildPlanCopyPayload(sourceResult.record, cfgItem, appId, data, targetRecord)
                const saveResponse = targetRecord ? await updateCustomize(payload) : await createCustomize(payload)
                if (saveResponse.RetCode !== 0) {
                    return {
                        errMsg: this.getCopyError(saveResponse) || `${targetRecord ? '更新' : '创建'}目标方案配置失败:${cfgItem.subKey}`
                    }
                }

                return {
                    record: saveResponse.Data || payload,
                    data
                }
            } catch (err) {
                return {
                    errMsg: this.getCopyError(null, err) || `复制方案配置异常:${cfgItem.subKey}`
                }
            }
        },

        resetPlanDataReady(data) {
            const shouldReduceScriptNumber = this.isLegacySource() && store.getters.env === 'test'
            for (const plan of data.Plans || []) {
                for (const version of plan.Versions || []) {
                    version.IsReady = false
                    const scriptCfg = version.ScriptCfg
                    const scriptNumber = Number(scriptCfg && scriptCfg.ScriptNumber)
                    if (shouldReduceScriptNumber && Number.isFinite(scriptNumber) && scriptNumber > 100) {
                        scriptCfg.ScriptNumber = scriptNumber / 10
                    }
                }
            }
        },

        buildPlanCopyPayload(sourceRecord, cfgItem, appId, data, targetRecord) {
            const payload = this.cloneData(sourceRecord)
            if (targetRecord && targetRecord.ID) {
                payload.ID = targetRecord.ID
            } else {
                delete payload.ID
            }
            payload.AppId = appId
            payload.RedisSubkey = cfgItem.subKey
            payload.Data = JSON.stringify(data)
            payload.Name = payload.Name || `${this.getGameLabel(cfgItem.gameId)}方案配置`
            payload.Description = payload.Description || payload.Name
            payload.Type = payload.Type || 1
            payload.ModifyUser = store.getters.name
            payload.LastModify = Math.floor(new Date().getTime() / 1000)
            return payload
        },

        async getCustomizeRecordFromAll(subKey, appId) {
            try {
                const response = await getAllCustomizes(store.getters.env, appId)
                if (response.RetCode !== 0) {
                    return {
                        errMsg: this.getCopyError(response) || `读取App配置列表失败:${appId}`
                    }
                }
                const records = Array.isArray(response.Data) ? response.Data : []
                return {
                    record: records.find(item => item.RedisSubkey === subKey) || null
                }
            } catch (err) {
                return {
                    errMsg: this.getCopyError(null, err) || `读取App配置列表异常:${appId}`
                }
            }
        },

        getLegacySourceSubKey(cfgItem, keyStr) {
            if (keyStr !== 'slot_jackpot') {
                return cfgItem.subKey
            }
            const gameId = Number(cfgItem.gameId)
            const baseGameId = gameId >= relatedGameIdOffset ? gameId - relatedGameIdOffset : gameId
            const prefix = this.getSlotGameSubKeyPrefix(baseGameId)
            if (!prefix) {
                return ''
            }
            return `${prefix}${gameId >= relatedGameIdOffset ? '_x_script_cfg' : '_script_cfg'}`
        },

        async getLegacyCustomizeRecord(subKey) {
            if (!subKey) {
                return { errMsg: '旧版配置Key为空' }
            }
            try {
                const response = await request({
                    url: '/customizeconfig/one',
                    method: 'get',
                    data: { SubKey: subKey }
                })
                if (response.RetCode !== 0) {
                    return { errMsg: this.getCopyError(response) || `读取旧版配置失败:${subKey}` }
                }
                return { record: response.Data || null }
            } catch (err) {
                return { errMsg: this.getCopyError(null, err) || `读取旧版配置异常:${subKey}` }
            }
        },

        async getLegacyPlanRecord(gameId) {
            try {
                const response = await request({
                    url: '/slotsScriptV3Config/all',
                    method: 'get',
                    data: {}
                })
                if (response.RetCode !== 0) {
                    return { errMsg: this.getCopyError(response) || `读取旧版方案配置失败:${gameId}` }
                }
                const source = (response.Data || []).find(item => Number(item.SlotsType) === Number(gameId))
                if (!source || !source.ConfigData) {
                    return { record: null }
                }
                return {
                    record: {
                        Data: source.ConfigData,
                        Name: `${this.getGameLabel(gameId)}方案配置`,
                        Description: `${this.getGameLabel(gameId)}方案配置`,
                        Type: 1
                    }
                }
            } catch (err) {
                return { errMsg: this.getCopyError(null, err) || `读取旧版方案配置异常:${gameId}` }
            }
        },

        async getSourceConfigRecord(cfgItem, keyStr) {
            if (!this.isLegacySource()) {
                return this.getCustomizeRecordFromAll(cfgItem.subKey, this.appId)
            }
            if (keyStr === 'slot_plan') {
                return this.getLegacyPlanRecord(cfgItem.gameId)
            }
            return this.getLegacyCustomizeRecord(this.getLegacySourceSubKey(cfgItem, keyStr))
        },

        buildLegacyCopyPayload(sourceRecord, cfgItem, appId, targetRecord) {
            const payload = this.cloneData(sourceRecord)
            if (targetRecord && targetRecord.ID) {
                payload.ID = targetRecord.ID
            } else {
                delete payload.ID
            }
            payload.AppId = appId
            payload.RedisSubkey = cfgItem.subKey
            const configName = typeLabelMap[cfgItem.keyStr] || cfgItem.keyStr
            payload.Name = payload.Name || (cfgItem.gameId === undefined ? configName : `${this.getGameLabel(cfgItem.gameId)}${configName}`)
            payload.Description = payload.Description || payload.Name
            payload.Type = payload.Type || 1
            payload.ModifyUser = store.getters.name
            payload.LastModify = Math.floor(new Date().getTime() / 1000)
            return payload
        },

        async copyLegacyConfig(cfgItem, keyStr, appId) {
            const sourceResult = await this.getSourceConfigRecord(cfgItem, keyStr)
            if (sourceResult.errMsg) {
                return sourceResult
            }
            if (!sourceResult.record || !sourceResult.record.Data) {
                return { errMsg: `源旧版配置不存在:${this.getLegacySourceSubKey(cfgItem, keyStr)}` }
            }
            const targetResult = await this.getCustomizeRecordFromAll(cfgItem.subKey, appId)
            if (targetResult.errMsg) {
                return targetResult
            }
            const payload = this.buildLegacyCopyPayload(sourceResult.record, Object.assign({}, cfgItem, { keyStr }), appId, targetResult.record)
            const response = targetResult.record ? await updateCustomize(payload) : await createCustomize(payload)
            if (response.RetCode !== 0) {
                return { errMsg: this.getCopyError(response) || `写入目标新版配置失败:${cfgItem.subKey}` }
            }
            return response
        },

        ensurePlanOperationSelection() {
            if (!this.ensureV2Version()) return false
            if (this.scriptFlowLocked) {
                return true
            }
            if (!this.targetAppIds.length) {
                this.$message.warning('请选择目标 AppId')
                return false
            }
            if (!this.selectedGameIds.length) {
                this.$message.warning('请选择游戏')
                return false
            }
            return true
        },

        buildSelectedPlanTasks() {
            const taskItems = []
            for (const gameId of this.selectedGameIds) {
                taskItems.push({
                    gameId,
                    subKey: this.getSlotsCustomScriptKey(gameId, 'slot_plan'),
                    configName: typeLabelMap.slot_plan,
                    gameName: this.getGameLabel(gameId)
                })

                const relatedGameId = this.getRelatedGameId(gameId)
                if (relatedGameId) {
                    taskItems.push({
                        gameId: relatedGameId,
                        subKey: this.getSlotsCustomScriptKey(relatedGameId, 'slot_plan'),
                        configName: `${typeLabelMap.slot_plan}(附属)`,
                        gameName: `${this.getGameLabel(gameId)} 附属配置(GID:${relatedGameId})`,
                        optionalRelated: true
                    })
                }
            }

            const tasks = []
            for (const item of taskItems) {
                for (const appId of this.targetAppIds) {
                    const task = this.buildPublishTask(item, 'slot_plan', appId)
                    task.optionalRelated = item.optionalRelated === true
                    tasks.push(task)
                }
            }
            return tasks
        },

        buildPlanOperationTasks() {
            if (this.scriptFlowLocked) {
                return this.cloneData(this.scriptFlowLockedTasks)
            }
            return this.buildSelectedPlanTasks()
        },

        async getReadyPublishConflictsForCopy() {
            const pendingPlanTasks = this.scriptPublishTasks.concat(this.readyPublishTasks)
            if (!this.configTypes.includes('slot_plan') || pendingPlanTasks.length === 0) {
                return []
            }

            const subKeys = await this.buildGameSubKeysWithRelated('slot_plan', [])
            const copyTasks = []
            for (const item of subKeys) {
                if (item.missingMap || !item.subKey) {
                    continue
                }
                for (const appId of this.targetAppIds) {
                    copyTasks.push(this.buildPublishTask(item, 'slot_plan', appId))
                }
            }

            return this.mergePublishTasks([], this.getOverlappedPublishTasks(pendingPlanTasks, copyTasks))
        },

        showCopyReadyPublishConflict(conflictTasks) {
            const maxShowCount = 10
            const taskText = conflictTasks.slice(0, maxShowCount).map(task => {
                const gameText = task.gameName ? `，${task.gameName}` : ''
                return `${task.appId} ${task.subKey}${gameText}`
            })
            if (conflictTasks.length > maxShowCount) {
                taskText.push(`还有 ${conflictTasks.length - maxShowCount} 条未展示`)
            }

            this.$alert(
                `以下方案已有待发布的创建剧本或剧本就绪内容，执行复制会覆盖这些方案配置，请先发布或处理这些待发布内容后再复制：\n${taskText.join('\n')}`,
                '存在待发布方案配置',
                { type: 'warning' }
            )
        },

        getCopyPublishConflictsForPlanOperation(planTasks) {
            const unpublishedCopyTasks = this.copyPublishTasks.filter(task => task.scriptFlowPublished !== true)
            return this.mergePublishTasks([], this.getOverlappedPublishTasks(unpublishedCopyTasks, planTasks))
        },

        showCopyPendingPlanOperationConflict(conflictTasks, operationName) {
            const maxShowCount = 10
            const taskText = conflictTasks.slice(0, maxShowCount).map(task => {
                const gameText = task.gameName ? `，${task.gameName}` : ''
                return `${task.appId} ${task.subKey}${gameText}`
            })
            if (conflictTasks.length > maxShowCount) {
                taskText.push(`还有 ${conflictTasks.length - maxShowCount} 条未展示`)
            }
            this.$alert(
                `以下方案配置存在未发布的复制内容，请先发布复制配置后再执行${operationName}：\n${taskText.join('\n')}`,
                '存在未发布复制配置',
                { type: 'warning' }
            )
        },

        async handleOneKeyCreateScripts() {
            if (!this.ensurePlanOperationSelection()) return
            const tasks = this.buildPlanOperationTasks()
            if (tasks.length === 0) {
                return this.$message.warning('暂无可创建剧本的方案配置')
            }
            if (!(await this.ensureNoFormalPublishedTasks('创建剧本', tasks))) {
                return
            }
            const copyConflictTasks = this.getCopyPublishConflictsForPlanOperation(tasks)
            if (copyConflictTasks.length > 0) {
                return this.showCopyPendingPlanOperationConflict(copyConflictTasks, '创建剧本')
            }

            this.scriptLoading = true
            const failList = []
            try {
                const result = await this.collectPlanScriptCreateTasks(tasks, failList, { usePublished: true })
                if (failList.length > 0) {
                    this.showPlanOperationResult('创建剧本检查', 0, failList)
                    return
                }
                if (result.createTasks.length === 0 && result.readyTasks.length === 0) {
                    return this.$message.warning('没有可检查的方案版本')
                }

                this.resetScriptCreateQueueState()
                this.scriptCreateTasks = result.createTasks
                this.scriptReadyPreviewTasks = result.readyTasks
                this.scriptCreateDialogVisible = true
            } finally {
                this.scriptLoading = false
            }
        },

        isPlanDisabled(plan) {
            return Boolean(plan) && (plan.IsDisabled === true || Number(plan.IsDisabled) === 1)
        },

        isDefaultPlan(plan) {
            return Boolean(plan) && (plan.IsDefault === true || Number(plan.IsDefault) === 1)
        },

        getLatestPlanVersion(plan) {
            const versions = Array.isArray(plan && plan.Versions) ? plan.Versions : []
            return versions.reduce((latestVersion, version) => {
                if (!latestVersion || Number(version.Version) > Number(latestVersion.Version)) {
                    return version
                }
                return latestVersion
            }, null)
        },

        async collectPlanScriptCreateTasks(tasks, failList, options = {}) {
            const createTasks = []
            const readyTasks = []
            for (const task of tasks) {
                if (!(await this.shouldHandlePlanTask(task, failList))) {
                    continue
                }
                const planData = options.usePublished ? await this.loadPublishedPlanCustomizeData(task, failList) : await this.loadPlanCustomizeData(task, failList)
                if (!planData) {
                    continue
                }
                const createPlanItems = []
                const readyPlanItems = []
                for (const plan of planData.data.Plans || []) {
                    if (this.isPlanDisabled(plan)) {
                        continue
                    }
                    const latestVersion = this.getLatestPlanVersion(plan)
                    if (!latestVersion) {
                        continue
                    }
                    if (this.isPlanVersionReady(latestVersion)) {
                        readyPlanItems.push({ plan, version: latestVersion })
                    } else {
                        createPlanItems.push({ plan, version: latestVersion })
                    }
                }

                if (createPlanItems.length > 0 || readyPlanItems.length > 0) {
                    const betFailList = []
                    const betList = await this.loadPlanScriptBets(task, betFailList)
                    if (betFailList.length === 0 && betList.length === 0) {
                        betFailList.push({
                            task,
                            errMsg: '基础配置下注列表为空'
                        })
                    }
                    if (betFailList.length > 0 || betList.length === 0) {
                        failList.push(...betFailList)
                        continue
                    }
                    for (const item of createPlanItems) {
                        createTasks.push(this.buildPlanScriptCreateTask(
                            task,
                            item.plan,
                            item.version,
                            betList
                        ))
                    }
                    for (const item of readyPlanItems) {
                        const countResult = await this.inspectReadyPlanVersionScripts(task, item.plan, item.version, betList)
                        readyTasks.push(this.buildPlanScriptReadyPreviewTask(
                            task,
                            item.plan,
                            item.version,
                            countResult
                        ))
                    }
                }
            }
            return { createTasks, readyTasks }
        },

        buildPlanScriptCreateTask(task, plan, version, betList) {
            const scriptCfg = version.ScriptCfg || {}
            const scriptNumber = Number(scriptCfg.ScriptNumber) || 0
            const normalizedBetList = Array.isArray(betList) ? betList.slice() : []
            return {
                task,
                plan,
                version,
                appId: task.appId,
                gameName: task.gameName || this.getGameLabel(task.gameId),
                subKey: task.subKey,
                planId: plan.PlanId,
                planName: plan.PlanName || '',
                planVersion: version.Version,
                versionComment: version.Comment || '',
                scriptSteps: scriptCfg.ScriptSteps,
                scriptNumber,
                betList: normalizedBetList,
                createStatus: 'pending',
                createStatusText: '等待创建',
                createProgressCurrent: 0,
                createProgressTotal: scriptNumber * normalizedBetList.length,
                createError: '',
                createRequestAccepted: false,
                createFailureStage: ''
            }
        },

        buildPlanScriptReadyPreviewTask(task, plan, version, countResult) {
            return Object.assign(this.buildPlanScriptCreateTask(task, plan, version), countResult)
        },

        buildReadyScriptQueryFailureResult() {
            return {
                scriptCountState: 'query_failed',
                scriptCountStatus: '数量查询失败',
                scriptCountStatusType: 'danger',
                scriptCountText: '-'
            }
        },

        async inspectReadyPlanVersionScripts(task, plan, version, betList) {
            try {
                const data = await this.loadPlanVersionScriptCountMap(task, plan, version, betList)
                if (!data) {
                    return this.buildReadyScriptQueryFailureResult()
                }
                const betCounts = betList.map(bet => ({
                    bet,
                    count: Number(data[String(bet)] || 0)
                }))

                const zeroCount = betCounts.filter(item => item.count === 0).length
                let scriptCountState = 'normal'
                let scriptCountStatus = '已有剧本'
                let scriptCountStatusType = 'success'
                if (zeroCount === betCounts.length) {
                    scriptCountState = 'all_zero'
                    scriptCountStatus = '全部下注额数量为0'
                    scriptCountStatusType = 'danger'
                } else if (zeroCount > 0) {
                    scriptCountState = 'partial_zero'
                    scriptCountStatus = '部分下注额数量为0'
                    scriptCountStatusType = 'warning'
                }

                return {
                    scriptCountState,
                    scriptCountStatus,
                    scriptCountStatusType,
                    scriptCountText: betCounts.map(item => `${item.bet}:${item.count}`).join('，')
                }
            } catch (err) {
                return this.buildReadyScriptQueryFailureResult()
            }
        },

        closeScriptCreateDialog() {
            if (!this.scriptCreateCanClose) {
                return
            }
            this.scriptCreateDialogVisible = false
        },

        handleScriptCreateDialogClosed() {
            const shouldOpenReadyPreview = this.scriptCreateState === scriptCreateStateCompleted
            this.resetScriptCreateQueueState()
            this.scriptCreateTasks = []
            this.scriptReadyPreviewTasks = []
            if (shouldOpenReadyPreview) {
                this.$nextTick(() => {
                    this.handleOneKeyReady()
                })
            }
        },

        resetScriptCreateQueueState() {
            this.clearScriptCreatePollTimer()
            this.scriptCreateRunId++
            this.scriptCreateState = scriptCreateStateIdle
            this.scriptCreateCurrentIndex = -1
            this.scriptCreateWorkerActive = false
        },

        clearScriptCreatePollTimer() {
            if (this.scriptCreatePollTimer) {
                clearTimeout(this.scriptCreatePollTimer)
                this.scriptCreatePollTimer = null
            }
            if (this.scriptCreatePollResolve) {
                const resolve = this.scriptCreatePollResolve
                this.scriptCreatePollResolve = null
                resolve(false)
            }
        },

        waitForNextScriptCreatePoll(remainingCount) {
            this.clearScriptCreatePollTimer()
            const pollInterval = remainingCount < scriptCreateFastPollThreshold
                ? scriptCreateFastPollInterval
                : scriptCreateNormalPollInterval
            return new Promise(resolve => {
                this.scriptCreatePollResolve = resolve
                this.scriptCreatePollTimer = setTimeout(() => {
                    this.scriptCreatePollTimer = null
                    this.scriptCreatePollResolve = null
                    resolve(true)
                }, pollInterval)
            })
        },

        handleScriptCreateAction() {
            if (this.scriptCreateState === scriptCreateStateRunning) {
                this.pauseScriptCreateQueue()
                return
            }
            if ([scriptCreateStatePaused, scriptCreateStateError].includes(this.scriptCreateState)) {
                this.resumeScriptCreateQueue()
                return
            }
            if (this.scriptCreateState === scriptCreateStateCompleted) {
                this.closeScriptCreateDialog()
                return
            }
            this.confirmCreateScripts()
        },

        async confirmCreateScripts() {
            if (this.scriptLoading || this.scriptCreateState !== scriptCreateStateIdle) return
            if (!this.ensureV2Version()) return
            if (this.scriptCreateTasks.length === 0) {
                return this.$message.warning('暂无可创建剧本')
            }
            const tasks = this.scriptCreateTasks.map(item => item.task)
            this.scriptLoading = true
            try {
                if (!(await this.ensureNoFormalPublishedTasks('创建剧本', tasks))) {
                    return
                }
                this.scriptCreateState = scriptCreateStateRunning
                this.scriptCreateCurrentIndex = 0
                this.startScriptCreateWorker()
            } finally {
                this.scriptLoading = false
            }
        },

        pauseScriptCreateQueue() {
            if (this.scriptCreateState !== scriptCreateStateRunning) {
                return
            }
            this.scriptCreateState = scriptCreateStatePaused
            const currentTask = this.scriptCreateTasks[this.scriptCreateCurrentIndex]
            if (currentTask && currentTask.createStatus === 'creating') {
                currentTask.createStatus = 'paused'
                currentTask.createStatusText = '已暂停'
            }
            this.clearScriptCreatePollTimer()
        },

        resumeScriptCreateQueue() {
            if (![scriptCreateStatePaused, scriptCreateStateError].includes(this.scriptCreateState)) {
                return
            }
            const currentTask = this.scriptCreateTasks[this.scriptCreateCurrentIndex]
            if (currentTask) {
                if (currentTask.createFailureStage === 'create') {
                    currentTask.createRequestAccepted = false
                }
                currentTask.createStatus = 'creating'
                currentTask.createStatusText = '创建中'
                currentTask.createError = ''
                currentTask.createFailureStage = ''
            }
            this.scriptCreateState = scriptCreateStateRunning
            this.startScriptCreateWorker()
        },

        startScriptCreateWorker() {
            this.runScriptCreateQueue().catch(err => {
                const currentTask = this.scriptCreateTasks[this.scriptCreateCurrentIndex]
                if (currentTask && this.scriptCreateState === scriptCreateStateRunning) {
                    this.failScriptCreateTask(
                        currentTask,
                        currentTask.createRequestAccepted ? 'query' : 'create',
                        this.getCopyError(null, err) || '创建剧本异常'
                    )
                }
            })
        },

        async runScriptCreateQueue() {
            if (this.scriptCreateWorkerActive || this.scriptCreateState !== scriptCreateStateRunning) {
                return
            }
            const runId = this.scriptCreateRunId
            this.scriptCreateWorkerActive = true
            try {
                while (runId === this.scriptCreateRunId && this.scriptCreateState === scriptCreateStateRunning) {
                    const nextIndex = this.scriptCreateTasks.findIndex(item => item.createStatus !== 'completed')
                    if (nextIndex < 0) {
                        this.scriptCreateCurrentIndex = -1
                        this.scriptCreateState = scriptCreateStateCompleted
                        return
                    }
                    this.scriptCreateCurrentIndex = nextIndex
                    const result = await this.processScriptCreateTask(this.scriptCreateTasks[nextIndex], runId)
                    if (result !== 'completed') {
                        return
                    }
                }
            } finally {
                if (runId === this.scriptCreateRunId) {
                    this.scriptCreateWorkerActive = false
                }
            }
        },

        async processScriptCreateTask(item, runId) {
            item.createStatus = 'creating'
            item.createStatusText = '创建中'
            item.createError = ''

            if (item.betList.length === 0 || item.scriptNumber <= 0) {
                this.failScriptCreateTask(item, 'create', '剧本数量配置错误')
                return 'failed'
            }

            if (!item.createRequestAccepted) {
                try {
                    const response = await this.createPlanVersionScripts(item.task, item.plan, item.version)
                    if (runId !== this.scriptCreateRunId) {
                        return 'stopped'
                    }
                    if (!response || response.RetCode !== 0) {
                        this.failScriptCreateTask(item, 'create', this.getCopyError(response) || '创建剧本失败')
                        return 'failed'
                    }
                    this.markScriptCreateRequestAccepted(item)
                } catch (err) {
                    if (runId !== this.scriptCreateRunId) {
                        return 'stopped'
                    }
                    this.failScriptCreateTask(item, 'create', this.getCopyError(null, err) || '创建剧本异常')
                    return 'failed'
                }
            }

            while (runId === this.scriptCreateRunId) {
                if (this.scriptCreateState !== scriptCreateStateRunning) {
                    this.markScriptCreateTaskPaused(item)
                    return 'paused'
                }

                const progressResult = await this.queryScriptCreateTaskProgress(item)
                if (runId !== this.scriptCreateRunId) {
                    return 'stopped'
                }
                if (this.scriptCreateState !== scriptCreateStateRunning) {
                    this.markScriptCreateTaskPaused(item)
                    return 'paused'
                }
                if (!progressResult.ok) {
                    this.failScriptCreateTask(item, 'query', progressResult.errMsg)
                    return 'failed'
                }
                if (progressResult.completed) {
                    this.completeScriptCreateTask(item)
                    return 'completed'
                }

                const pollElapsed = await this.waitForNextScriptCreatePoll(progressResult.remainingCount)
                if (!pollElapsed && this.scriptCreateState !== scriptCreateStateRunning) {
                    this.markScriptCreateTaskPaused(item)
                    return 'paused'
                }
            }
            return 'stopped'
        },

        async queryScriptCreateTaskProgress(item) {
            try {
                const data = await this.loadPlanVersionScriptCountMap(
                    item.task,
                    item.plan,
                    item.version,
                    item.betList
                )
                if (!data) {
                    return { ok: false, errMsg: '查询剧本数量失败' }
                }

                let currentCount = 0
                let remainingCount = 0
                let completed = item.betList.length > 0 && item.scriptNumber > 0
                for (const bet of item.betList) {
                    const count = Number(data[String(bet)] || 0)
                    currentCount += count
                    remainingCount += Math.max(item.scriptNumber - count, 0)
                    if (count < item.scriptNumber) {
                        completed = false
                    }
                }
                this.updateScriptCreateTaskProgress(item, currentCount)
                return { ok: true, completed, remainingCount }
            } catch (err) {
                return {
                    ok: false,
                    errMsg: this.getCopyError(null, err) || '查询剧本数量异常'
                }
            }
        },

        markScriptCreateRequestAccepted(item) {
            item.createRequestAccepted = true
        },

        markScriptCreateTaskPaused(item) {
            item.createStatus = 'paused'
            item.createStatusText = '已暂停'
        },

        updateScriptCreateTaskProgress(item, currentCount) {
            item.createProgressCurrent = currentCount
        },

        failScriptCreateTask(item, failureStage, errMsg) {
            item.createStatus = 'failed'
            item.createStatusText = '创建失败'
            item.createFailureStage = failureStage
            item.createError = errMsg
            this.scriptCreateState = scriptCreateStateError
            this.clearScriptCreatePollTimer()
            if (failureStage === 'create') {
                this.sendScriptCreateFailureLark(item, errMsg)
            }
        },

        completeScriptCreateTask(item) {
            item.createStatus = 'completed'
            item.createStatusText = '已完成'
            item.createError = ''
            item.createFailureStage = ''
            item.task.scriptFlowReadyComplete = false
            this.markCopiedChangeTasks([item.task])
            this.readyPublishTasks = this.removeOverlappedPublishTasks(this.readyPublishTasks, [item.task])
            this.scriptPublishTasks = this.mergePublishTasks(this.scriptPublishTasks, [item.task])
            this.persistCopyFlowState()
        },

        async handleOneKeyReady() {
            if (!this.ensurePlanOperationSelection()) return
            const tasks = this.buildPlanOperationTasks()
            if (tasks.length === 0) {
                return this.$message.warning('暂无可就绪的方案配置')
            }
            if (!(await this.ensureNoFormalPublishedTasks('剧本就绪', tasks))) {
                return
            }
            const copyConflictTasks = this.getCopyPublishConflictsForPlanOperation(tasks)
            if (copyConflictTasks.length > 0) {
                return this.showCopyPendingPlanOperationConflict(copyConflictTasks, '剧本就绪')
            }

            this.readyLoading = true
            const failList = []
            try {
                const result = await this.collectPlanReadyPreviewTasks(tasks, failList)
                if (result.readyTasks.length === 0 && result.failedTasks.length === 0) {
                    return this.$message.warning('没有符合就绪条件的方案版本')
                }

                this.readyPreviewTasks = result.readyTasks
                this.readyFailedPreviewTasks = result.failedTasks
                this.readyPreviewMode = 'check'
                this.readyPreviewDialogVisible = true
            } finally {
                this.readyLoading = false
            }
        },

        async collectPlanReadyPreviewTasks(tasks, failList) {
            const readyTasks = []
            const failedTasks = []
            for (const task of tasks) {
                const taskFailList = []
                if (!(await this.shouldHandlePlanTask(task, taskFailList))) {
                    if (taskFailList.length > 0) {
                        failList.push(...taskFailList)
                        failedTasks.push(...this.buildPlanReadyFailureTasks(task, taskFailList))
                    }
                    continue
                }
                const planData = await this.loadPlanCustomizeData(task, taskFailList)
                if (!planData) {
                    failList.push(...taskFailList)
                    failedTasks.push(...this.buildPlanReadyFailureTasks(task, taskFailList))
                    continue
                }
                const betList = await this.loadPlanScriptBets(task, taskFailList)
                if (!betList || betList.length === 0) {
                    failList.push(...taskFailList)
                    failedTasks.push(...this.buildPlanReadyFailureTasks(task, taskFailList, '下注额配置为空'))
                    continue
                }

                for (const plan of planData.data.Plans || []) {
                    if (this.isPlanDisabled(plan)) {
                        continue
                    }
                    const latestVersion = this.getLatestPlanVersion(plan)
                    if (!latestVersion || latestVersion.IsReady) {
                        continue
                    }
                    const checkResult = await this.checkPlanVersionScripts(task, plan, latestVersion, betList)
                    if (checkResult.ok) {
                        readyTasks.push(this.buildPlanReadyPreviewTask(task, planData, plan, latestVersion, betList))
                    } else {
                        failedTasks.push(this.buildPlanReadyFailurePreviewTask(
                            task,
                            plan,
                            latestVersion,
                            betList,
                            checkResult.errMsg,
                            checkResult.betCountText
                        ))
                    }
                }
            }
            return { readyTasks, failedTasks }
        },

        async shouldHandlePlanTask(task, failList) {
            if (!task.optionalRelated) {
                return true
            }
            try {
                const response = await existCustomize(task.subKey, task.appId)
                if (response.RetCode !== 0) {
                    failList.push({
                        task,
                        errMsg: this.getCopyError(response) || `检测附属方案配置失败:${task.subKey}`
                    })
                    return false
                }
                return response.Data === true
            } catch (err) {
                failList.push({
                    task,
                    errMsg: this.getCopyError(null, err) || `检测附属方案配置异常:${task.subKey}`
                })
                return false
            }
        },

        buildPlanReadyPreviewTask(task, planData, plan, version, betList) {
            const scriptCfg = version.ScriptCfg || {}
            return {
                task,
                planData,
                plan,
                version,
                appId: task.appId,
                gameName: task.gameName || this.getGameLabel(task.gameId),
                subKey: task.subKey,
                planId: plan.PlanId,
                planName: plan.PlanName || '',
                planVersion: version.Version,
                versionComment: version.Comment || '',
                scriptNumber: scriptCfg.ScriptNumber,
                betList,
                betListText: betList.join('，')
            }
        },

        buildPlanReadyFailurePreviewTask(task, plan, version, betList, errMsg, scriptCountText = '') {
            const scriptCfg = version && version.ScriptCfg ? version.ScriptCfg : {}
            return {
                appId: task.appId,
                gameName: task.gameName || this.getGameLabel(task.gameId),
                subKey: task.subKey,
                planId: plan ? plan.PlanId : '-',
                planName: plan ? (plan.PlanName || '') : '-',
                planVersion: version ? version.Version : '-',
                scriptNumber: version ? scriptCfg.ScriptNumber : '-',
                scriptCountText: scriptCountText || '-',
                betListText: betList && betList.length > 0 ? betList.join('，') : '-',
                reason: this.getReadyFailureReason(errMsg)
            }
        },

        buildPlanReadyFailureTasks(task, failList, fallbackReason = '剧本就绪失败') {
            const errors = failList.length > 0 ? failList : [{ errMsg: fallbackReason }]
            return errors.map(item => this.buildPlanReadyFailurePreviewTask(
                item.task || task,
                null,
                null,
                [],
                item.errMsg || fallbackReason
            ))
        },

        getReadyFailureReason(errMsg) {
            const msg = String(errMsg || '')
            if (/剧本数量不足/.test(msg)) {
                return '剧本数量不足'
            }
            if (/查询下注额|查询剧本/.test(msg)) {
                return '查询剧本失败'
            }
            if (/保存方案就绪状态失败/.test(msg)) {
                return '保存就绪失败'
            }
            if (/下注额配置为空|基础配置下注列表为空/.test(msg)) {
                return '下注额配置为空'
            }
            if (/方案配置数据格式错误/.test(msg)) {
                return '方案配置格式错误'
            }
            if (/读取已发布方案配置|读取方案配置/.test(msg)) {
                return '方案配置读取失败'
            }
            if (/目标方案配置不存在|源方案配置不存在|方案配置不存在/.test(msg)) {
                return '方案配置不存在'
            }
            if (/基础配置不存在|未找到游戏基础配置Key/.test(msg)) {
                return '基础配置不存在'
            }
            if (/附属/.test(msg)) {
                return '附属配置检查失败'
            }
            return '剧本就绪失败'
        },

        closeReadyPreviewDialog() {
            this.readyPreviewDialogVisible = false
            this.readyPreviewTasks = []
            this.readyFailedPreviewTasks = []
            this.readyPreviewMode = 'check'
        },

        async confirmReadyTasks() {
            if (!this.ensureV2Version()) return
            if (this.readyPreviewTasks.length === 0) {
                return this.$message.warning('暂无可就绪方案')
            }
            const tasks = this.readyPreviewTasks.map(item => item.task)
            if (!(await this.ensureNoFormalPublishedTasks('剧本就绪', tasks))) {
                return
            }

            this.readyLoading = true
            const failList = []
            const checkedFailedTasks = this.readyFailedPreviewTasks.slice()
            const checkedReadyTasks = this.readyPreviewTasks.slice()
            try {
                const planDataMap = new Map()
                for (const item of this.readyPreviewTasks) {
                    item.version.IsReady = true
                    const key = `${item.task.appId}_${item.task.subKey}`
                    if (!planDataMap.has(key)) {
                        planDataMap.set(key, {
                            task: item.task,
                            planData: item.planData
                        })
                    }
                }

                const publishTasks = []
                for (const item of planDataMap.values()) {
                    item.planData.record.Data = JSON.stringify(item.planData.data)
                    const response = await updateCustomize(item.planData.record)
                    if (response.RetCode !== 0) {
                        failList.push({
                            task: item.task,
                            errMsg: this.getCopyError(response) || '保存方案就绪状态失败'
                        })
                        continue
                    }
                    item.task.planRecord = response.Data || item.planData.record
                    item.task.planConfigData = this.cloneData(item.planData.data)
                    const enabledPlans = (item.planData.data.Plans || []).filter(plan => !this.isPlanDisabled(plan))
                    item.task.scriptFlowReadyComplete = enabledPlans.every(plan => {
                        return this.isPlanVersionReady(this.getLatestPlanVersion(plan))
                    })
                    publishTasks.push(item.task)
                }

                if (publishTasks.length > 0) {
                    this.markCopiedChangeTasks(publishTasks)
                    this.copyPublishTasks = this.removeOverlappedPublishTasks(this.copyPublishTasks, publishTasks)
                    const readyCompleteTasks = publishTasks.filter(task => task.scriptFlowReadyComplete === true)
                    this.scriptPublishTasks = this.removeOverlappedPublishTasks(this.scriptPublishTasks, readyCompleteTasks)
                    this.readyPublishTasks = this.mergePublishTasks(this.readyPublishTasks, publishTasks)
                    this.persistCopyFlowState()
                }

                const publishTaskKeySet = new Set(publishTasks.map(task => `${task.appId}_${task.subKey}`))
                const successTasks = checkedReadyTasks.filter(item => {
                    return publishTaskKeySet.has(`${item.task.appId}_${item.task.subKey}`)
                })
                const saveFailedTasks = []
                for (const item of failList) {
                    const failedPlanTasks = checkedReadyTasks.filter(readyItem => {
                        return `${readyItem.task.appId}_${readyItem.task.subKey}` === `${item.task.appId}_${item.task.subKey}`
                    })
                    if (failedPlanTasks.length === 0) {
                        saveFailedTasks.push(this.buildPlanReadyFailurePreviewTask(
                            item.task,
                            null,
                            null,
                            [],
                            '保存方案就绪状态失败'
                        ))
                        continue
                    }
                    saveFailedTasks.push(...failedPlanTasks.map(readyItem => this.buildPlanReadyFailurePreviewTask(
                        readyItem.task,
                        readyItem.plan,
                        readyItem.version,
                        readyItem.betList,
                        '保存方案就绪状态失败'
                    )))
                }
                this.readyPreviewTasks = successTasks
                this.readyFailedPreviewTasks = checkedFailedTasks.concat(saveFailedTasks)
                this.readyPreviewMode = 'result'
                this.readyPreviewDialogVisible = true
                if (this.readyFailedPreviewTasks.length > 0) {
                    this.$message.warning(`剧本就绪完成，成功 ${successTasks.length} 个方案，未就绪 ${this.readyFailedPreviewTasks.length} 个方案`)
                } else {
                    this.$message.success(`剧本就绪完成，成功 ${successTasks.length} 个方案`)
                }
            } finally {
                this.readyLoading = false
            }
        },

        async loadPlanCustomizeData(task, failList) {
            try {
                if (task.planRecord && task.planConfigData) {
                    return {
                        record: this.cloneData(task.planRecord),
                        data: this.cloneData(task.planConfigData)
                    }
                }

                const planResult = await this.getCustomizeRecordFromAll(task.subKey, task.appId)
                if (planResult.errMsg) {
                    failList.push({
                        task,
                        errMsg: planResult.errMsg
                    })
                    return null
                }
                if (!planResult.record || !planResult.record.Data) {
                    failList.push({
                        task,
                        errMsg: `目标方案配置不存在:${task.subKey}`
                    })
                    return null
                }

                const data = this.parseJson(planResult.record.Data, null)
                if (!data || !Array.isArray(data.Plans)) {
                    failList.push({
                        task,
                        errMsg: '方案配置数据格式错误'
                    })
                    return null
                }

                return {
                    record: planResult.record,
                    data
                }
            } catch (err) {
                failList.push({
                    task,
                    errMsg: this.getCopyError(null, err) || '读取方案配置异常'
                })
                return null
            }
        },

        async loadPublishedPlanCustomizeData(task, failList) {
            try {
                const readInfo = this.getPlanPublishedReadInfo()
                const response = await this.getPublishDiff(readInfo.opType, task.publishKey, false, task.appId)
                if (response.RetCode !== 0) {
                    failList.push({
                        task,
                        errMsg: this.getCopyError(response) || '读取已发布方案配置失败',
                        publishEnvName: readInfo.envName,
                        publishActionName: readInfo.actionName
                    })
                    return null
                }

                const data = this.parseCustomizeData(response.Data && response.Data.Publish)
                if (!data || !Array.isArray(data.Plans)) {
                    failList.push({
                        task,
                        errMsg: `已发布方案配置不存在:${task.subKey}`,
                        publishEnvName: readInfo.envName,
                        publishActionName: readInfo.actionName
                    })
                    return null
                }

                return {
                    record: null,
                    data
                }
            } catch (err) {
                const readInfo = this.getPlanPublishedReadInfo()
                failList.push({
                    task,
                    errMsg: this.getCopyError(null, err) || '读取已发布方案配置异常',
                    publishEnvName: readInfo.envName,
                    publishActionName: readInfo.actionName
                })
                return null
            }
        },

        getPlanPublishedReadInfo() {
            if (store.getters.env === 'pro') {
                return {
                    opType: PUBLISH_STEPS.PUBLISH_STEP_PRE,
                    envName: '预发布环境',
                    actionName: '同步到预发布'
                }
            }
            return {
                opType: PUBLISH_STEPS.PUBLISH_STEP_TEST,
                envName: '测试环境',
                actionName: '发布到测试环境'
            }
        },

        async loadPlanScriptBets(task, failList) {
            const baseSubKey = this.getPlanBaseSubKey(task.gameId)
            if (!baseSubKey) {
                failList.push({
                    task,
                    errMsg: '未找到游戏基础配置Key'
                })
                return []
            }

            try {
                const baseResult = await this.getCustomizeRecordFromAll(baseSubKey, task.appId)
                if (baseResult.errMsg) {
                    failList.push({
                        task,
                        errMsg: baseResult.errMsg
                    })
                    return []
                }
                if (!baseResult.record || !baseResult.record.Data) {
                    failList.push({
                        task,
                        errMsg: `基础配置不存在:${baseSubKey}`
                    })
                    return []
                }

                const baseCfg = this.parseJson(baseResult.record.Data, null)
                if (!baseCfg || !Array.isArray(baseCfg.BetList)) {
                    failList.push({
                        task,
                        errMsg: `基础配置下注列表为空:${baseSubKey}`
                    })
                    return []
                }

                const betList = baseCfg.BetList.map(item => Number(item)).filter(item => !Number.isNaN(item))
                return Number(task.gameId) > relatedGameIdOffset ? betList.map(item => item * 1.5) : betList
            } catch (err) {
                failList.push({
                    task,
                    errMsg: this.getCopyError(null, err) || `读取基础配置异常:${baseSubKey}`
                })
                return []
            }
        },

        getPlanBaseSubKey(gameId) {
            const baseGameId = this.getBaseGameId(gameId)
            const prefix = this.getSlotGameSubKeyPrefix(baseGameId)
            return prefix ? `${prefix}_slots_base` : ''
        },

        getBaseGameId(gameId) {
            const id = Number(gameId)
            if (!Number.isFinite(id)) {
                return gameId
            }
            return id > relatedGameIdOffset ? id - relatedGameIdOffset : id
        },

        createPlanVersionScripts(task, plan, version) {
            return request({
                url: '/dataProxy/info',
                method: 'post',
                data: {
                    Path: '/slotsStat/script/plan/data',
                    planID: plan.PlanId,
                    gameID: task.gameId,
                    planVer: version.Version,
                    appID: task.appId
                }
            })
        },

        requestPlanVersionScripts(task, plan, version, bet) {
            return request({
                url: '/dataProxy/info',
                method: 'get',
                timeout: scriptPlanDataRequestTimeout,
                data: {
                    Path: '/slotsStat/script/plan/data',
                    planID: plan.PlanId,
                    gameID: task.gameId,
                    planVer: version.Version,
                    appID: task.appId,
                    bet
                }
            })
        },

        async loadPlanVersionScriptCountMap(task, plan, version, betList) {
            const response = await this.requestPlanVersionScripts(task, plan, version)
            if (!response || response.RetCode !== 0) {
                return null
            }

            let data = Object.assign({}, response.Data || {})
            const missingBets = betList.filter(bet => data[String(bet)] === undefined)
            for (const bet of missingBets) {
                const betResponse = await this.requestPlanVersionScripts(task, plan, version, bet)
                if (!betResponse || betResponse.RetCode !== 0) {
                    return null
                }
                data = Object.assign(data, betResponse.Data || {})
            }
            return data
        },

        async checkPlanVersionScripts(task, plan, version, betList) {
            const scriptNumber = Number(version.ScriptCfg && version.ScriptCfg.ScriptNumber) || 0
            try {
                const data = await this.loadPlanVersionScriptCountMap(task, plan, version, betList)
                if (!data) {
                    return {
                        ok: false,
                        errMsg: '查询剧本失败'
                    }
                }
                const notEnoughBets = []
                for (const bet of betList) {
                    const count = Number(data[String(bet)] || 0)
                    if (count < scriptNumber) {
                        notEnoughBets.push(`${bet}:${count}/${scriptNumber}`)
                    }
                }

                if (notEnoughBets.length > 0) {
                    return {
                        ok: false,
                        errMsg: '剧本数量不足',
                        betCountText: notEnoughBets.join('，')
                    }
                }

                return { ok: true }
            } catch (err) {
                return {
                    ok: false,
                    errMsg: this.getCopyError(null, err) || '查询剧本异常'
                }
            }
        },

        showPlanOperationResult(title, successCount, failList, pendingMessage = '') {
            if (failList.length === 0) {
                if (pendingMessage) {
                    this.$message.warning({
                        message: pendingMessage,
                        duration: successCount > 5 ? 8000 : 5000
                    })
                    return
                }
                this.$message.success(`${title}完成，成功 ${successCount} 个版本`)
                return
            }

            const operationName = title.replace(/检查$/, '')
            const publishMissingItems = failList.filter(item => this.isPlanPublishMissingFailItem(item))
            const otherFailItems = failList.filter(item => !this.isPlanPublishMissingFailItem(item))
            const messages = []
            if (publishMissingItems.length > 0) {
                messages.push(this.formatPlanPublishMissingGroupMessage(publishMissingItems, operationName))
            }
            messages.push(...otherFailItems.map(item => this.formatPlanOperationFailMessage(item, operationName)))
            if (pendingMessage) {
                messages.push(pendingMessage)
            }
            const msg = messages.join('\n')

            this.$alert(msg, `${title}部分失败`, {
                type: 'warning'
            })
        },

        isPlanPublishMissingFailItem(item) {
            const task = item.task || {}
            return this.isPublishedPlanConfigMissingError(item.errMsg, {
                keyStr: 'slot_plan',
                subKey: task.subKey
            })
        },

        formatPlanPublishMissingGroupMessage(items, operationName) {
            const first = items[0] || {}
            const envName = first.publishEnvName || this.getPlanPublishedReadInfo().envName
            const actionName = first.publishActionName || this.getPlanPublishedReadInfo().actionName
            const maxShowCount = 30
            const rows = items.slice(0, maxShowCount).map(item => {
                const task = item.task || {}
                const gameText = task.gameName ? `，${task.gameName}` : ''
                return `- AppId:${task.appId || '-'}，Key:${task.subKey || '-'}${gameText}`
            })
            if (items.length > maxShowCount) {
                rows.push(`- 还有 ${items.length - maxShowCount} 条未展示`)
            }
            return `以下 ${items.length} 个方案配置尚未发布到${envName}，无法${operationName}。处理方式:请先点击【发布】，将这些复制配置${actionName}后再执行【${operationName}】：\n${rows.join('\n')}`
        },

        inspectPlanDefault(task, result) {
            if (result.errMsg) {
                return { allowed: false, reason: '方案配置读取失败' }
            }
            if (!result.record || !result.record.Data) {
                return { allowed: false, reason: '方案配置不存在' }
            }
            const planConfig = this.parseJson(result.record.Data, null)
            if (!planConfig || !Array.isArray(planConfig.Plans)) {
                return { allowed: false, reason: '方案配置格式错误' }
            }
            if (!planConfig.Plans.some(plan => this.isDefaultPlan(plan))) {
                return { allowed: false, reason: '缺少默认方案' }
            }
            return { allowed: true, reason: '' }
        },

        setPlanDefaultPublishBlocked(task, reason) {
            Object.assign(task, {
                publishBlocked: true,
                publishBlockMsg: reason,
                diffStatus: '不可发布',
                configDesc: reason
            })
        },

        async applyPlanDefaultPublishGuard(tasks) {
            const blockedTasks = []
            const appRecordMap = new Map()
            for (const task of tasks) {
                if (task.keyStr !== 'slot_plan') {
                    continue
                }
                const appKey = String(task.appId)
                if (!appRecordMap.has(appKey)) {
                    try {
                        const response = await getAllCustomizes(store.getters.env, task.appId)
                        appRecordMap.set(appKey, response.RetCode === 0
                            ? { records: Array.isArray(response.Data) ? response.Data : [] }
                            : { errMsg: this.getCopyError(response) || `读取App配置列表失败:${task.appId}` })
                    } catch (error) {
                        appRecordMap.set(appKey, {
                            errMsg: this.getCopyError(null, error) || `读取App配置列表异常:${task.appId}`
                        })
                    }
                }
                const appResult = appRecordMap.get(appKey)
                const result = this.inspectPlanDefault(task, {
                    errMsg: appResult.errMsg,
                    record: appResult.records ? (appResult.records.find(item => item.RedisSubkey === task.subKey) || null) : null
                })
                if (!result.allowed) {
                    this.setPlanDefaultPublishBlocked(task, result.reason)
                    blockedTasks.push(task)
                }
            }
            return blockedTasks
        },

        getScriptFlowTaskKey(task) {
            return `${task.appId}_${task.subKey}`
        },

        isPlanVersionReady(version) {
            return Boolean(version) && (version.IsReady === true || Number(version.IsReady) === 1)
        },

        buildPlanPublishGuardTasks(sourceTasks) {
            if (!sourceTasks.some(task => task.publishStage === publishStagePlanConfig)) {
                return sourceTasks
            }
            const pendingTasks = this.scriptPublishTasks.map(task => Object.assign({}, task, {
                publishStage: publishStagePlanConfig,
                planPublishGuardOnly: true
            }))
            return this.mergePublishTasks(pendingTasks, sourceTasks)
        },

        buildPlanPublishGuardRow(task, plan, version, reason) {
            return {
                appId: task.appId,
                gameName: task.gameName || this.getGameLabel(task.gameId),
                subKey: task.subKey,
                planId: plan ? plan.PlanId : '-',
                planName: plan ? (plan.PlanName || '') : '-',
                planVersion: version ? version.Version : '-',
                reason
            }
        },

        async inspectPlanPublishReadiness(sourceTasks) {
            const allowedTasks = []
            const allowedPlanTasks = []
            const blockedTasks = []
            const blockedRows = []
            for (const task of sourceTasks) {
                if (task.publishStage !== publishStagePlanConfig) {
                    allowedTasks.push(task)
                    continue
                }

                const result = await this.getCustomizeRecordFromAll(task.subKey, task.appId)
                const taskBlockedRows = []
                if (result.errMsg) {
                    taskBlockedRows.push(this.buildPlanPublishGuardRow(task, null, null, '方案配置读取失败'))
                } else if (!result.record || !result.record.Data) {
                    taskBlockedRows.push(this.buildPlanPublishGuardRow(task, null, null, '方案配置不存在'))
                } else {
                    const planConfig = this.parseJson(result.record.Data, null)
                    if (!planConfig || !Array.isArray(planConfig.Plans)) {
                        taskBlockedRows.push(this.buildPlanPublishGuardRow(task, null, null, '方案配置格式错误'))
                    } else {
                        const enabledPlans = planConfig.Plans.filter(plan => !this.isPlanDisabled(plan))
                        for (const plan of enabledPlans) {
                            const latestVersion = this.getLatestPlanVersion(plan)
                            if (!latestVersion) {
                                taskBlockedRows.push(this.buildPlanPublishGuardRow(task, plan, null, '方案缺少版本'))
                            } else if (!this.isPlanVersionReady(latestVersion)) {
                                taskBlockedRows.push(this.buildPlanPublishGuardRow(task, plan, latestVersion, '剧本未就绪'))
                            }
                        }
                    }
                }

                if (taskBlockedRows.length > 0) {
                    blockedTasks.push(task)
                    blockedRows.push(...taskBlockedRows)
                    continue
                }
                if (!task.planPublishGuardOnly) {
                    const allowedTask = Object.assign({}, task, { guardStatus: '可以发布' })
                    allowedTasks.push(allowedTask)
                    allowedPlanTasks.push(allowedTask)
                }
            }
            return { allowedTasks, allowedPlanTasks, blockedTasks, blockedRows }
        },

        applyPlanPublishGuardResult(result) {
            if (!result || result.blockedTasks.length === 0) {
                return
            }
            const blockedTasks = result.blockedTasks.map(task => {
                const stateTask = this.readyPublishTasks.concat(this.scriptPublishTasks).find(item => {
                    return this.getScriptFlowTaskKey(item) === this.getScriptFlowTaskKey(task)
                }) || task
                return Object.assign({}, stateTask, { scriptFlowReadyComplete: false })
            })
            this.readyPublishTasks = this.removeOverlappedPublishTasks(this.readyPublishTasks, blockedTasks)
            this.scriptPublishTasks = this.mergePublishTasks(this.scriptPublishTasks, blockedTasks)
            this.persistCopyFlowState()
        },

        showPlanPublishGuardResult(result) {
            this.planPublishGuardBlockedRows = result.blockedRows
            this.planPublishGuardAllowedTasks = result.allowedPlanTasks
            this.planPublishGuardDialogVisible = true
        },

        markScriptFlowPublishedTasks(tasks) {
            const taskKeySet = new Set(tasks.map(task => this.getScriptFlowTaskKey(task)))
            for (const task of this.copyPublishTasks) {
                if (taskKeySet.has(this.getScriptFlowTaskKey(task))) {
                    this.$set(task, 'scriptFlowPublished', true)
                }
            }
        },

        async prepareScriptFlowGuide(successTasks) {
            if (this.activePublishStage !== publishStageCopyConfig) {
                return
            }
            const readInfo = this.getPlanPublishedReadInfo()
            const planTasks = this.mergePublishTasks([], successTasks.filter(task => {
                return task.keyStr === 'slot_plan' && task.publishOpType === readInfo.opType
            }))
            if (planTasks.length === 0) {
                return
            }

            this.markScriptFlowPublishedTasks(planTasks)
            const needCreateTasks = []
            const noUsableTasks = []
            const checkFailTasks = []
            for (const task of planTasks) {
                const failList = []
                const planData = await this.loadPublishedPlanCustomizeData(task, failList)
                if (!planData) {
                    const failItem = failList[0] || {}
                    checkFailTasks.push({
                        appId: task.appId,
                        gameName: task.gameName || this.getGameLabel(task.gameId),
                        subKey: task.subKey,
                        reason: this.getReadyFailureReason(failItem.errMsg || '读取方案配置失败')
                    })
                    continue
                }

                const plans = Array.isArray(planData.data.Plans) ? planData.data.Plans : []
                if (plans.length === 0) {
                    checkFailTasks.push({
                        appId: task.appId,
                        gameName: task.gameName || this.getGameLabel(task.gameId),
                        subKey: task.subKey,
                        reason: '方案配置为空'
                    })
                    continue
                }
                const enabledPlans = plans.filter(plan => !this.isPlanDisabled(plan))
                if (enabledPlans.length === 0) {
                    noUsableTasks.push({
                        task: this.cloneData(task),
                        appId: task.appId,
                        gameName: task.gameName || this.getGameLabel(task.gameId),
                        subKey: task.subKey,
                        reason: '方案均已禁用'
                    })
                    continue
                }

                const latestVersions = enabledPlans.map(plan => this.getLatestPlanVersion(plan))
                if (latestVersions.some(version => !version)) {
                    checkFailTasks.push({
                        appId: task.appId,
                        gameName: task.gameName || this.getGameLabel(task.gameId),
                        subKey: task.subKey,
                        reason: '可用方案缺少版本'
                    })
                    continue
                }
                const pendingVersions = latestVersions.filter(version => !this.isPlanVersionReady(version))
                if (pendingVersions.length > 0) {
                    needCreateTasks.push({
                        task: this.cloneData(task),
                        appId: task.appId,
                        gameName: task.gameName || this.getGameLabel(task.gameId),
                        subKey: task.subKey,
                        enabledPlanCount: enabledPlans.length,
                        pendingVersionCount: pendingVersions.length
                    })
                }
            }

            this.scriptFlowNeedCreateTasks = needCreateTasks
            this.scriptFlowNoUsableTasks = noUsableTasks
            this.scriptFlowCheckFailTasks = checkFailTasks
            this.scriptFlowGuidePending = needCreateTasks.length > 0 || noUsableTasks.length > 0 || checkFailTasks.length > 0
            if (needCreateTasks.length > 0) {
                this.scriptFlowLockedTasks = this.mergePublishTasks(
                    this.scriptFlowLockedTasks,
                    needCreateTasks.map(item => item.task)
                )
            }
        },

        handlePublishResultClosed() {
            if (!this.scriptFlowGuidePending) {
                return
            }
            this.$nextTick(() => {
                this.scriptFlowGuideDialogVisible = true
            })
        },

        confirmScriptFlowGuide() {
            this.scriptFlowGuideDialogVisible = false
            this.scriptFlowGuidePending = false
            let shouldOpenScriptCreateDialog = false
            if (this.scriptFlowLocked) {
                const appIds = this.scriptFlowLockedTasks.map(task => task.appId)
                const gameIds = this.scriptFlowLockedTasks.map(task => this.getBaseGameId(task.gameId))
                this.targetAppIds = this.getValidOptionValues(appIds, this.filteredTargetAppOptions, 'value')
                this.selectedGameIds = this.getValidOptionValues(gameIds, this.gameOptions, 'key')
                if (!this.configTypes.includes('slot_plan')) {
                    this.configTypes.push('slot_plan')
                }
                this.updateCheckAllGames()
                shouldOpenScriptCreateDialog = this.scriptFlowNeedCreateTasks.length > 0
            }
            this.persistCopyFlowState()
            if (shouldOpenScriptCreateDialog) {
                this.$nextTick(() => {
                    this.handleOneKeyCreateScripts()
                })
            }
        },

        async releaseCompletedScriptFlowLocks(publishedTasks) {
            if (!this.scriptFlowLocked || publishedTasks.length === 0) {
                return
            }
            const publishedTaskKeySet = new Set(publishedTasks.map(task => this.getScriptFlowTaskKey(task)))
            const retainedTasks = []
            let releasedCount = 0
            for (const task of this.scriptFlowLockedTasks) {
                if (publishedTaskKeySet.has(this.getScriptFlowTaskKey(task))) {
                    releasedCount++
                    continue
                }
                retainedTasks.push(task)
            }
            this.scriptFlowLockedTasks = retainedTasks
            if (releasedCount > 0 && retainedTasks.length === 0) {
                this.$message.success('创建剧本和剧本就绪流程已完成，可以继续执行复制')
            } else if (releasedCount > 0) {
                this.$message.warning(`已完成 ${releasedCount} 个方案配置，仍有 ${retainedTasks.length} 个方案配置未完成，复制继续保持禁用`)
            }
        },

        async handleOneKeyPublish() {
            if (!this.ensureV2Version()) return
            if (this.scriptLoading || this.readyLoading) {
                return this.$message.warning('请等待剧本操作完成后再发布')
            }
            let sourceTasks = this.getAllPendingPublishTasks()
            if (sourceTasks.length === 0) {
                if (!this.validateSourcePublishSelection()) {
                    return
                }
                sourceTasks = await this.buildSourcePublishTasks()
                if (sourceTasks === null) {
                    return
                }
            }
            if (sourceTasks.length === 0) {
                return this.$message.warning('暂无可发布配置')
            }
            this.publishLoading = true
            try {
                let planGuardResult = null
                if (sourceTasks.some(task => task.publishStage === publishStagePlanConfig)) {
                    const guardTasks = this.buildPlanPublishGuardTasks(sourceTasks)
                    planGuardResult = await this.inspectPlanPublishReadiness(guardTasks)
                    this.applyPlanPublishGuardResult(planGuardResult)
                    sourceTasks = planGuardResult.allowedTasks
                    if (sourceTasks.length === 0) {
                        this.showPlanPublishGuardResult(planGuardResult)
                        return
                    }
                }
                const tasks = this.cloneData(sourceTasks)
                await this.applyPlanDefaultPublishGuard(tasks)

                for (const task of tasks) {
                    task.publishTaskId = `${task.publishStage}_${task.appId}_${task.subKey}`
                    task.gameName = task.gameName || this.getGameLabel(task.gameId)
                    task.configDesc = task.configDesc || task.configName
                    if (task.planPublishSource) {
                        task.configDesc = `${task.configDesc}（${task.planPublishSource}）`
                    }
                    task.publishStageName = this.getPublishStageName(task.publishStage)
                    if (task.publishBlocked) {
                        continue
                    }
                    const publishInfo = await this.resolveTaskPublishInfo(task)
                    if (publishInfo.errMsg) {
                        Object.assign(task, {
                            publishBlocked: true,
                            publishBlockMsg: publishInfo.errMsg,
                            diffStatus: '获取失败',
                            configDesc: publishInfo.errMsg
                        })
                        continue
                    }
                    Object.assign(task, publishInfo)
                    const response = await this.getPublishDiff(task.publishOpType, task.publishKey, false, task.appId)
                    if (response.RetCode !== 0) {
                        Object.assign(task, {
                            publishBlocked: true,
                            publishBlockMsg: `差异获取失败：${this.formatPublishError(task, response)}`,
                            diffStatus: '获取失败',
                            configDesc: `差异获取失败：${this.formatPublishError(task, response)}`
                        })
                        continue
                    }
                    task.attrInfo = response.Data && response.Data.AttrInfo ? response.Data.AttrInfo : ''
                    const diffRows = this.buildCustomizeDiffRows(response)
                    task.diffRows = diffRows
                    task.diffStatus = diffRows.length > 0 ? '有差异' : '无差异'
                    task.summary = this.buildSummary(task, task.publishStage)
                }

                this.publishTasks = tasks
                this.activePublishStage = this.publishSourceGroups.length > 0 ? this.publishSourceGroups[0].stage : publishStageCopyConfig
                this.resetPublishFilters(false)
                this.ensureActivePublishStep()
                this.publishDialogVisible = true
                this.refreshPublishSelection()
                if (planGuardResult && planGuardResult.blockedRows.length > 0) {
                    this.$nextTick(() => this.showPlanPublishGuardResult(planGuardResult))
                }
            } finally {
                this.publishLoading = false
            }
        },

        async resolveTaskPublishInfo(task) {
            if (store.getters.env !== 'pro') {
                const publishOpType = PUBLISH_STEPS.PUBLISH_STEP_TEST
                return {
                    publishOpType,
                    publishOpTypeName: this.getPublishOpTypeName(publishOpType)
                }
            }

            const response = await this.getPublishView(task.publishKey, false, task.appId)
            if (response.RetCode !== 0) {
                return {
                    errMsg: `发布状态获取失败：${this.formatPublishError(task, response)}`
                }
            }

            const viewData = response.Data || {}
            const publishOpType = this.getNextProPublishOpType(viewData)
            if (!publishOpType) {
                return {
                    errMsg: this.getProPublishBlockedMsg(viewData)
                }
            }

            return {
                publishOpType,
                publishOpTypeName: this.getPublishOpTypeName(publishOpType),
                currentPublishStep: viewData.Step,
                needReview: viewData.NeedView === true,
                currentUser: viewData.CurUser || ''
            }
        },

        getNextProPublishOpType(viewData) {
            let step = Number(viewData && viewData.Step)
            if (!validPublishSteps.includes(step)) {
                step = PUBLISH_STEPS.PUBLISH_STEP_TEST
            }

            if (step === PUBLISH_STEPS.PUBLISH_STEP_REVIEWING || step === PUBLISH_STEPS.PUBLISH_STEP_PRO) {
                return null
            }
            if (step < PUBLISH_STEPS.PUBLISH_STEP_PRE) {
                return PUBLISH_STEPS.PUBLISH_STEP_PRE
            }
            if (step === PUBLISH_STEPS.PUBLISH_STEP_PRE) {
                return viewData.NeedView === true ? PUBLISH_STEPS.PUBLISH_STEP_REVIEWING : PUBLISH_STEPS.PUBLISH_STEP_PRO
            }
            if (step === PUBLISH_STEPS.PUBLISH_STEP_REVIEWED) {
                return PUBLISH_STEPS.PUBLISH_STEP_PRO
            }
            return null
        },

        getProPublishBlockedMsg(viewData) {
            const step = Number(viewData && viewData.Step)
            if (step === PUBLISH_STEPS.PUBLISH_STEP_REVIEWING) {
                const userText = viewData.CurUser ? `，当前处理人：${viewData.CurUser}` : ''
                return `配置正在审核中${userText}`
            }
            if (step === PUBLISH_STEPS.PUBLISH_STEP_PRO) {
                return '配置已处于正式发布状态，无法继续发布'
            }
            return `当前发布状态不支持继续发布：${this.getPublishOpTypeName(step)}`
        },

        getPublishOpTypeName(opType) {
            return publishOpTypeLabelMap[opType] || `发布步骤${opType}`
        },

        getAllPendingPublishTasks() {
            const lockedTaskKeySet = new Set(this.scriptFlowLockedTasks.map(task => this.getScriptFlowTaskKey(task)))
            const copyTasks = this.copyPublishTasks.filter(task => {
                return !lockedTaskKeySet.has(this.getScriptFlowTaskKey(task))
            }).map(task => Object.assign({}, task, {
                publishStage: publishStageCopyConfig
            }))
            return copyTasks.concat(this.buildPlanConfigPublishTasks())
        },

        buildPlanConfigPublishTasks() {
            const taskMap = new Map()
            for (const task of this.readyPublishTasks) {
                if (task.scriptFlowReadyComplete !== true) {
                    continue
                }
                taskMap.set(`${task.appId}_${task.subKey}`, Object.assign({}, task, {
                    publishStage: publishStagePlanConfig,
                    configDesc: task.configDesc || '剧本就绪',
                    planPublishSource: '剧本就绪'
                }))
            }
            return Array.from(taskMap.values())
        },

        getDialogPublishTasksByStage(stage) {
            return this.publishTasks.filter(task => task.publishStage === stage)
        },

        getFilteredPublishTasksBySource() {
            return this.getDialogPublishTasksByStage(this.activePublishStage).filter(task => {
                if (this.publishFilters.appIds.length > 0 && !this.publishFilters.appIds.some(id => String(id) === String(task.appId))) {
                    return false
                }
                if (this.publishFilters.games.length > 0 && !this.publishFilters.games.includes(this.getPublishGameFilterValue(task))) {
                    return false
                }
                if (this.publishFilters.diffStatuses.length > 0 && !this.publishFilters.diffStatuses.includes(task.diffStatus || '未知')) {
                    return false
                }
                return true
            })
        },

        getPublishStepKey(task) {
            return task.publishBlocked ? publishStepBlocked : String(task.publishOpType)
        },

        getPublishGameFilterValue(task) {
            return task.gameId === undefined || task.gameId === null ? commonConfigGameValue : String(task.gameId)
        },

        buildUniqueOptions(tasks, mapper) {
            const optionMap = new Map()
            for (const task of tasks) {
                const option = mapper(task)
                if (!option || option.value === undefined || option.value === null || optionMap.has(String(option.value))) {
                    continue
                }
                optionMap.set(String(option.value), option)
            }
            return Array.from(optionMap.values())
        },

        handlePublishSourceTabClick(tab) {
            if (tab && tab.name) {
                this.activePublishStage = tab.name
            }
            this.resetPublishFilters(false)
            this.ensureActivePublishStep()
            this.refreshPublishSelection()
        },

        handlePublishStepTabClick(tab) {
            if (tab && tab.name) {
                this.activePublishStep = tab.name
            }
            this.refreshPublishSelection()
        },

        handlePublishFilterChange() {
            this.ensureActivePublishStep()
            this.refreshPublishSelection()
        },

        resetPublishFilters(refresh = true) {
            this.publishFilters = {
                appIds: [],
                games: [],
                diffStatuses: []
            }
            if (refresh) {
                this.ensureActivePublishStep()
                this.refreshPublishSelection()
            }
        },

        ensureActivePublishSource() {
            if (this.publishSourceGroups.length === 0) {
                this.activePublishStage = publishStageCopyConfig
                return
            }
            if (!this.publishSourceGroups.some(item => item.stage === this.activePublishStage)) {
                this.activePublishStage = this.publishSourceGroups[0].stage
            }
        },

        ensureActivePublishStep() {
            this.ensureActivePublishSource()
            if (this.publishStepGroups.length === 0) {
                this.activePublishStep = publishStepBlocked
                return
            }
            if (!this.publishStepGroups.some(item => item.step === this.activePublishStep)) {
                this.activePublishStep = this.publishStepGroups[0].step
            }
        },

        refreshPublishSelection() {
            this.selectedPublishTasks = []
            this.$nextTick(() => {
                const table = this.$refs.publishTaskTable
                if (!table) {
                    return
                }
                table.clearSelection()
                if (this.activePublishStep === publishStepBlocked) {
                    return
                }
                if (store.getters.env === 'pro') {
                    return
                }
                for (const task of this.filteredPublishTasks.filter(item => this.isPublishTaskSelectable(item))) {
                    table.toggleRowSelection(task, true)
                }
            })
        },

        handlePublishSelectionChange(selection) {
            this.selectedPublishTasks = selection
        },

        isPublishTaskSelectable(row) {
            return this.activePublishStep !== publishStepBlocked && !row.publishBlocked
        },

        mergePublishTasks(oldTasks, newTasks) {
            const taskMap = new Map()
            for (const task of oldTasks.concat(newTasks)) {
                taskMap.set(`${task.appId}_${task.subKey}`, task)
            }
            return Array.from(taskMap.values())
        },

        removeOverlappedPublishTasks(oldTasks, newTasks) {
            const newTaskKeySet = new Set(newTasks.map(task => `${task.appId}_${task.subKey}`))
            return oldTasks.filter(task => !newTaskKeySet.has(`${task.appId}_${task.subKey}`))
        },

        getOverlappedPublishTasks(oldTasks, newTasks) {
            const newTaskKeySet = new Set(newTasks.map(task => `${task.appId}_${task.subKey}`))
            return oldTasks.filter(task => newTaskKeySet.has(`${task.appId}_${task.subKey}`))
        },

        markCopiedChangeTasks(tasks) {
            const copyTaskKeySet = new Set(this.copyPublishTasks.map(task => `${task.appId}_${task.subKey}`))
            for (const task of tasks) {
                if (copyTaskKeySet.has(`${task.appId}_${task.subKey}`)) {
                    task.hasCopiedChanges = true
                }
            }
        },

        removePendingPublishTasks(stage, publishedTasks) {
            const publishKeySet = new Set(publishedTasks.map(task => `${task.appId}_${task.subKey}`))
            if (stage === publishStageSourceConfig) {
                return
            }
            if (stage === publishStagePlanConfig) {
                this.scriptPublishTasks = this.scriptPublishTasks.filter(task => !publishKeySet.has(`${task.appId}_${task.subKey}`))
                this.readyPublishTasks = this.readyPublishTasks.filter(task => !publishKeySet.has(`${task.appId}_${task.subKey}`))
                return
            }
            if (stage === publishStageScriptCreate) {
                this.scriptPublishTasks = this.scriptPublishTasks.filter(task => !publishKeySet.has(`${task.appId}_${task.subKey}`))
                return
            }
            if (stage === publishStagePlanReady) {
                this.readyPublishTasks = this.readyPublishTasks.filter(task => !publishKeySet.has(`${task.appId}_${task.subKey}`))
                return
            }
            this.copyPublishTasks = this.copyPublishTasks.filter(task => !publishKeySet.has(`${task.appId}_${task.subKey}`))
        },

        getPublishStageName(stage) {
            return publishStageLabelMap[stage] || '配置发布'
        },

        buildCustomizeDiffRows(response) {
            const data = response.Data || {}
            const preVal = this.parseCustomizeData(data.Pre)
            const proVal = this.parseCustomizeData(data.Publish)
            return this.buildObjectDiffRows(proVal, preVal)
        },

        parseCustomizeData(raw) {
            if (!raw) {
                return {}
            }
            const config = this.parseJson(raw, {})
            if (config && config.Data) {
                return this.parseJson(config.Data, {})
            }
            return config || {}
        },

        parseJson(raw, defaultValue) {
            if (raw === undefined || raw === null || raw === '') {
                return defaultValue
            }
            if (typeof raw !== 'string') {
                return raw
            }
            try {
                return JSON.parse(raw)
            } catch (e) {
                return defaultValue
            }
        },

        buildObjectDiffRows(oldValue, newValue, prefix = '') {
            const rows = []
            if (this.isPlainObject(oldValue) && this.isPlainObject(newValue)) {
                const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)])
                keys.forEach(key => {
                    const path = prefix ? `${prefix}.${key}` : key
                    rows.push(...this.buildObjectDiffRows(oldValue[key], newValue[key], path))
                })
                return rows
            }
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                const length = Math.max(oldValue.length, newValue.length)
                for (let index = 0; index < length; index++) {
                    const path = prefix ? `${prefix}.${index + 1}` : String(index + 1)
                    rows.push(...this.buildObjectDiffRows(oldValue[index], newValue[index], path))
                }
                return rows
            }
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                rows.push({
                    key: prefix || '-',
                    oldVal: oldValue,
                    newVal: newValue
                })
            }
            return rows
        },

        isPlainObject(val) {
            return Object.prototype.toString.call(val) === '[object Object]'
        },

        buildSummary(task, stage = this.activePublishStage) {
            const stageName = this.getPublishStageName(stage)
            const publishName = task && task.publishOpTypeName ? `${stageName}-${task.publishOpTypeName}` : stageName
            if (!task.diffRows || task.diffRows.length === 0) {
                return `${publishName}：发布内容与当前已发布内容无差异`
            }
            return `${publishName}：修改配置项：${task.diffRows.map(row => row.key).join('|')}`
        },

        showDiffDetail(task) {
            this.diffDetailMode = 'publish'
            this.currentDiffTask = task
            this.diffDetailVisible = true
        },

        formatDiffValue(value) {
            if (value === undefined) {
                return 'undefined'
            }
            if (typeof value === 'string') {
                return value
            }
            return JSON.stringify(value, null, 2)
        },

        getLarkPage() {
            getCustomize('lark_page_cfg', 0).then(response => {
                if (response.RetCode !== 0) {
                    return
                }
                this.larkConfig = response.Data || {}
                if (response.Data && response.Data.Data) {
                    this.larkPages = JSON.parse(response.Data.Data)
                    this.lark = this.larkPages.indexOf(this.$route.name) > -1
                }
            }).catch(e => {
                console.log('getLarkPage err', e)
            })
        },

        async setLarkPage(enabled) {
            const routeName = this.$route.name
            const previousPages = this.larkPages.slice()
            const nextPages = previousPages.filter(item => item !== routeName)
            if (enabled) {
                nextPages.push(routeName)
            }

            if (!this.larkConfig || Object.keys(this.larkConfig).length === 0) {
                this.lark = !enabled
                return this.$message.error('Lark通知配置读取失败，请刷新页面后重试')
            }

            const nextConfig = Object.assign({}, this.larkConfig, {
                Data: JSON.stringify(nextPages)
            })
            try {
                const response = await updateCustomize(nextConfig)
                if (response.RetCode !== 0) {
                    throw new Error(response.RetMsg || response.Msg || 'Lark设置失败')
                }
                this.larkPages = nextPages
                this.larkConfig = nextConfig
                this.$message.success(enabled ? '添加通知成功!' : '取消通知成功!')
            } catch (e) {
                this.lark = !enabled
                this.larkPages = previousPages
                this.$message.error(e.message || 'Lark设置失败')
            }
        },

        getRoutesName() {
            const routes = []
            for (const item of this.$route.matched) {
                if (item.meta && item.meta.title) {
                    routes.push(item.meta.title)
                }
            }
            return routes.join('->')
        },

        shouldSendPublishLark(tasks) {
            return this.lark && tasks.length > 0
        },

        buildPublishLarkContent(tasks, failed) {
            const maxShowCount = 20
            const rows = tasks.slice(0, maxShowCount).map(task => {
                const gameText = task.gameName ? `，${task.gameName}` : ''
                const resultText = failed ? `，原因:${task.resultMsg || '发布失败'}` : ''
                return `- App:${task.appId}${gameText}，Key:${task.subKey}，步骤:${task.publishOpTypeName || this.getPublishOpTypeName(task.publishOpType)}${resultText}`
            })
            if (tasks.length > maxShowCount) {
                rows.push(`还有 ${tasks.length - maxShowCount} 条未展示`)
            }
            return [
                `发布类型：${this.getPublishStageName(this.activePublishStage)}`,
                `配置数量：${tasks.length}`,
                '配置列表：',
                rows.join('\r\n')
            ].join('\r\n')
        },

        async sendPublishLark(tasks, failed) {
            if (!this.shouldSendPublishLark(tasks)) {
                return
            }
            try {
                const response = await getInfo(this.$store.getters.token)
                if (response.RetCode !== 0) {
                    return
                }
                const hasPublish = tasks.some(task => [
                    PUBLISH_STEPS.PUBLISH_STEP_TEST,
                    PUBLISH_STEPS.PUBLISH_STEP_PRE,
                    PUBLISH_STEPS.PUBLISH_STEP_PRO
                ].includes(task.publishOpType))
                const step = failed ? '【发布失败】' : (hasPublish ? '【已发布】' : '【待审核】')
                const nick = response.Data.nick
                const routes = this.getRoutesName()
                const at = '<at user_id="ou_2b283f529fc901b97b443b946f692efd">SamYe</at>\r\n'
                const content = this.buildPublishLarkContent(tasks, failed)
                const text = `${step}【${nick}】发布配置：${routes} 🚩\r\n${at}${content}`
                await sendLark(text, '', store.getters.env)
            } catch (e) {
                console.log('sendPublishLark failed', e)
            }
        },

        async sendScriptCreateFailureLark(item, errMsg) {
            const env = store.getters.env
            if (!this.lark) {
                return
            }
            try {
                const envNameMap = {
                    test: '测试环境',
                    pre: '预发布环境',
                    pro: '正式环境'
                }
                const projectName = process.env.VUE_APP_PROJECT_NAME || '菲律宾棋牌'
                const envName = envNameMap[env] || env
                const content = [
                    `页面：${this.getRoutesName()}`,
                    `环境：${projectName}（${envName}）`,
                    `AppId：${item.appId}`,
                    `游戏：${item.gameName}，GID：${item.task.gameId}`,
                    `配置Key：${item.subKey}`,
                    `方案：${item.planName}（ID：${item.planId}），版本：${item.planVersion}`,
                    `创建进度：${item.createProgressCurrent}/${item.createProgressTotal}`,
                    `原因：${errMsg}`,
                    '创建队列已停止，请处理异常后点击继续。'
                ].join('\r\n')
                const response = await getInfo(this.$store.getters.token)
                if (response.RetCode !== 0) {
                    return
                }
                const at = '<at user_id="ou_2b283f529fc901b97b443b946f692efd">SamYe</at>\r\n'
                const text = `【剧本创建失败】【${response.Data.nick}】\r\n${at}${content}`
                await sendLark(text, '', env)
            } catch (e) {
                console.log('sendScriptCreateFailureLark failed', e)
            }
        },

        async confirmPublishTasks() {
            if (!this.ensureV2Version()) return
            if (this.activePublishStep === publishStepBlocked) {
                return this.$message.warning('异常/不可发布配置不能发布')
            }
            const tasks = this.selectedPublishTasks
            if (tasks.length === 0) {
                return this.$message.warning('请选择要发布的配置')
            }
            this.publishLoading = true
            let defaultPlanBlockedTasks = []
            try {
                defaultPlanBlockedTasks = await this.applyPlanDefaultPublishGuard(tasks)
            } finally {
                this.publishLoading = false
            }
            if (defaultPlanBlockedTasks.length > 0) {
                this.selectedPublishTasks = []
                this.activePublishStep = publishStepBlocked
                this.$nextTick(() => this.refreshPublishSelection())
                return this.$message.warning('存在缺少默认方案或读取异常的方案配置，已停止发布')
            }
            const opTypeNames = Array.from(new Set(tasks.map(task => task.publishOpTypeName || this.getPublishOpTypeName(task.publishOpType))))
            const hasProPublish = tasks.some(task => task.publishOpType === PUBLISH_STEPS.PUBLISH_STEP_PRO)
            const confirmMessage = hasProPublish
                ? `确认执行${this.getPublishStageName(this.activePublishStage)}（${opTypeNames.join('、')}，共${tasks.length}项）吗？<br/><span style="color:red">当前为发布到正式环境，请确认发布内容和关联服务影响。</span>`
                : `确认执行${this.getPublishStageName(this.activePublishStage)}（${opTypeNames.join('、')}，共${tasks.length}项）吗？`
            try {
                await this.$confirm(confirmMessage, '提示', {
                    dangerouslyUseHTMLString: hasProPublish,
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return
            }
            this.publishLoading = true
            try {
                if (this.activePublishStage === publishStagePlanConfig) {
                    const planGuardResult = await this.inspectPlanPublishReadiness(tasks)
                    if (planGuardResult.blockedRows.length > 0) {
                        this.applyPlanPublishGuardResult(planGuardResult)
                        const blockedTaskKeySet = new Set(planGuardResult.blockedTasks.map(task => this.getScriptFlowTaskKey(task)))
                        this.publishTasks = this.publishTasks.filter(task => {
                            return !blockedTaskKeySet.has(this.getScriptFlowTaskKey(task))
                        })
                        this.selectedPublishTasks = []
                        this.ensureActivePublishStep()
                        this.refreshPublishSelection()
                        this.showPlanPublishGuardResult(planGuardResult)
                        return
                    }
                }
                const finishedTasks = []
                const successTasks = []
                const failTasks = []
                const successLarkTasks = []
                const failLarkTasks = []
                for (const task of tasks) {
                    try {
                        const attrInfo = task.publishOpType === PUBLISH_STEPS.PUBLISH_STEP_REVIEWING ? (task.attrInfo || '') : ''
                        const response = await this.submitPublishConfig(task.publishOpType, task.publishKey, task.summary, false, attrInfo, task.appId)
                        if (response.RetCode !== 0) {
                            const errMsg = this.formatPublishError(task, response)
                            failTasks.push(this.buildPublishResultTask(task, errMsg))
                            failLarkTasks.push(Object.assign({}, task, { resultMsg: errMsg }))
                            continue
                        }
                        successTasks.push(this.buildPublishResultTask(task, '发布成功'))
                        successLarkTasks.push(Object.assign({}, task, { resultMsg: '发布成功' }))
                        if (this.shouldRemoveTaskAfterPublish(task)) {
                            finishedTasks.push(task)
                        }
                    } catch (err) {
                        const errMsg = this.formatPublishError(task, null, err)
                        failTasks.push(this.buildPublishResultTask(task, errMsg))
                        failLarkTasks.push(Object.assign({}, task, { resultMsg: errMsg }))
                    }
                }
                await this.sendPublishLark(successLarkTasks, false)
                await this.sendPublishLark(failLarkTasks, true)
                await this.prepareScriptFlowGuide(successLarkTasks)
                if (finishedTasks.length > 0) {
                    this.removePendingPublishTasks(this.activePublishStage, finishedTasks)
                    if (this.activePublishStage === publishStagePlanConfig) {
                        await this.releaseCompletedScriptFlowLocks(finishedTasks)
                    }
                }
                this.publishResultFailTasks = failTasks
                this.publishResultSuccessTasks = successTasks
                this.publishDialogVisible = false
                this.publishTasks = []
                this.selectedPublishTasks = []
                this.persistCopyFlowState()
                this.publishResultDialogVisible = true
                if (failTasks.length > 0) {
                    this.$message.warning(`${this.getPublishStageName(this.activePublishStage)}完成：成功${successTasks.length}条，失败${failTasks.length}条`)
                } else {
                    const unfinishedCount = tasks.length - finishedTasks.length
                    const successMsg = unfinishedCount > 0
                        ? `${this.getPublishStageName(this.activePublishStage)}提交成功，请再次点击发布继续后续步骤`
                        : `${this.getPublishStageName(this.activePublishStage)}提交成功`
                    this.$message.success(successMsg)
                }
            } finally {
                this.publishLoading = false
            }
        },

        shouldRemoveTaskAfterPublish(task) {
            if (store.getters.env !== 'pro') {
                return true
            }
            return task.publishOpType === PUBLISH_STEPS.PUBLISH_STEP_PRO
        },

        cloneData(data) {
            return JSON.parse(JSON.stringify(data))
        },

        async copyConfig(sourceConfigs, keyStr, failList = []) {

            if (!sourceConfigs || !sourceConfigs.length) {
                return
            }

            // 遍历每个游戏
            for (const item of sourceConfigs) {

                const gameId = item.gameId
                const name = this.getSlotsName(gameId, keyStr)
                console.log('store:', store.getters)
                // 遍历目标 App
                for (const appId of this.targetAppIds) {

                    const payload = {
                        AppId: appId,
                        RedisSubkey: this.getSlotsCustomScriptKey(gameId, keyStr),
                        Data: item.config,
                        Name: name,
                        Description: name,
                        Type: 1,
                        ModifyUser: store.getters.name,
                        LastModify: Math.floor(new Date().getTime() / 1000),
                    }

                    try {
                        const res = await createCustomize(payload)

                        if (res.RetCode !== 0) {
                            failList.push({ keyStr, gameId, appId })
                            continue // ❗跳过当前，不影响下一条
                        }

                    } catch (err) {
                        failList.push({ keyStr, gameId, appId })
                        continue // ❗继续下一条
                    }
                }
            }
            return failList

        },
        async loadSlotSTask(keyStr) {

            const configs = []

            const result = await this.getCustomizeRecordFromAll(this.getSlotsCustomScriptKey(0, keyStr), this.appId)
            if (result.record && result.record.Data) {
                configs.push({
                    gameId: 0,
                    config: result.record.Data
                })
            }

            return configs
        },

        getSlotsCustomScriptKey(gid, keyStr) {

            const map = {
                slot_plan: 'SlotsCustomScriptConfig_',
                slot_jackpot: 'SlotsBigPrizeConfig_',
                slot_task: 'slotsmission',
                slot_script_stat: 'SlotsScriptStatisticsConfig'
            }

            const prefix = map[keyStr]

            if (!prefix) {
                throw new Error(`未知配置类型: ${keyStr}`)
            }

            if (keyStr === 'slot_task' || keyStr === 'slot_script_stat') {
                return prefix
            }

            return prefix + gid
        },

        getSlotsName(gameId, keyStr) {

            const map = {
                slot_plan: '方案配置',
                slot_jackpot: '大奖配置',
                slot_task: 'Slots任务配置',
                slot_script_stat: 'Slots脚本统计配置'
            }

            const ending = map[keyStr]

            if (!ending) {
                throw new Error(`未知配置类型: ${keyStr}`)
            }

            if (keyStr === 'slot_task' || keyStr === 'slot_script_stat') {
                return ending
            }

            return this.getGameName(gameId) + ending
        },

        getCopyFlowStorageKey() {
            const routeKey = this.$route ? (this.$route.name || this.$route.path) : 'slotsConfCopy'
            const env = store.getters.env || 'default'
            const version = store.getters.version || 'default'
            return `${copyFlowStoragePrefix}:${routeKey}:${env}:${version}`
        },

        persistCopyFlowState() {
            if (!window.sessionStorage) {
                return
            }
            if (this.pendingPublishTaskCount === 0 && !this.scriptFlowLocked && !this.hasPendingScriptReadyTasks) {
                this.clearCopyFlowState()
                return
            }

            const state = {
                version: copyFlowStorageVersion,
                savedAt: Date.now(),
                appId: this.appId,
                targetAppIds: this.targetAppIds,
                configTypes: this.configTypes,
                selectedGameCfgKeys: this.selectedGameCfgKeys,
                selectedGameIds: this.selectedGameIds,
                copyPublishTasks: this.buildCopyFlowStorageTasks(this.copyPublishTasks),
                scriptPublishTasks: this.buildCopyFlowStorageTasks(this.scriptPublishTasks),
                readyPublishTasks: this.buildCopyFlowStorageTasks(this.readyPublishTasks),
                scriptFlowLockedTasks: this.buildCopyFlowStorageTasks(this.scriptFlowLockedTasks)
            }

            try {
                window.sessionStorage.setItem(this.getCopyFlowStorageKey(), JSON.stringify(state))
            } catch (e) {
                // 忽略浏览器缓存写入失败
            }
        },

        restoreCopyFlowState() {
            if (!this.isV2Version || !window.sessionStorage) {
                this.clearCopyFlowState()
                return
            }

            let state = null
            try {
                const raw = window.sessionStorage.getItem(this.getCopyFlowStorageKey())
                state = raw ? JSON.parse(raw) : null
            } catch (e) {
                this.clearCopyFlowState()
                return
            }

            if (!state || state.version !== copyFlowStorageVersion) {
                return
            }

            const appId = this.getValidOptionValue(state.appId, this.appOptions, 'value')
            if (appId === undefined || appId === null) {
                this.clearCopyFlowState()
                return
            }

            const copyPublishTasks = this.getValidCopyFlowTasks(state.copyPublishTasks || state.lastCopyTasks)
            const scriptPublishTasks = this.getValidCopyFlowTasks(state.scriptPublishTasks)
            const readyPublishTasks = this.getValidCopyFlowTasks(state.readyPublishTasks)
            const scriptFlowLockedTasks = this.getValidCopyFlowTasks(state.scriptFlowLockedTasks)
            if (copyPublishTasks.length === 0 && scriptPublishTasks.length === 0 && readyPublishTasks.length === 0 && scriptFlowLockedTasks.length === 0) {
                this.clearCopyFlowState()
                return
            }

            this.appId = appId
            this.targetAppIds = this.getValidOptionValues(state.targetAppIds, this.filteredTargetAppOptions, 'value').filter(id => id !== appId)
            this.configTypes = this.getValidConfigTypes(state.configTypes)
            this.selectedGameCfgKeys = this.getValidGameCfgKeys(state.selectedGameCfgKeys)
            this.selectedGameIds = this.getValidOptionValues(state.selectedGameIds, this.gameOptions, 'key')
            this.filterSelectedGamesBySubKeyMap(false)
            this.copyPublishTasks = copyPublishTasks
            this.scriptPublishTasks = scriptPublishTasks
            this.readyPublishTasks = readyPublishTasks
            this.scriptFlowLockedTasks = scriptFlowLockedTasks
            this.activePublishStage = copyPublishTasks.length > 0
                ? publishStageCopyConfig
                : publishStagePlanConfig
            this.publishTasks = []
            this.resetScriptCreateQueueState()
            this.scriptCreateTasks = []
            this.scriptReadyPreviewTasks = []
            this.readyPreviewTasks = []
            this.readyFailedPreviewTasks = []
            this.readyPreviewMode = 'check'
            this.scriptFlowNeedCreateTasks = []
            this.scriptFlowNoUsableTasks = []
            this.scriptFlowCheckFailTasks = []
            this.planPublishGuardBlockedRows = []
            this.planPublishGuardAllowedTasks = []
            this.scriptFlowGuidePending = false
            this.publishDialogVisible = false
            this.scriptCreateDialogVisible = false
            this.readyPreviewDialogVisible = false
            this.scriptFlowGuideDialogVisible = false
            this.planPublishGuardDialogVisible = false
            this.copyPreviewDialogVisible = false
            this.resetCopyPreviewState()
        },

        clearCopyFlowState() {
            if (!window.sessionStorage) {
                return
            }
            try {
                window.sessionStorage.removeItem(this.getCopyFlowStorageKey())
            } catch (e) {
                // 忽略浏览器缓存清理失败
            }
        },

        handleClearCopyFlowCache() {
            this.$confirm(
                '确认清理当前复制流程缓存吗？这会清空复制配置、创建剧本、剧本就绪的待发布列表和页面缓存，但不会回滚已经写入后台的配置。',
                '清理缓存',
                {
                    confirmButtonText: '确认清理',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.resetScriptCreateQueueState()
                this.copyPublishTasks = []
                this.scriptPublishTasks = []
                this.readyPublishTasks = []
                this.scriptFlowLockedTasks = []
                this.publishTasks = []
                this.selectedPublishTasks = []
                this.scriptCreateTasks = []
                this.scriptReadyPreviewTasks = []
                this.readyPreviewTasks = []
                this.readyFailedPreviewTasks = []
                this.readyPreviewMode = 'check'
                this.publishResultFailTasks = []
                this.publishResultSuccessTasks = []
                this.scriptFlowNeedCreateTasks = []
                this.scriptFlowNoUsableTasks = []
                this.scriptFlowCheckFailTasks = []
                this.planPublishGuardBlockedRows = []
                this.planPublishGuardAllowedTasks = []
                this.scriptFlowGuidePending = false
                this.currentDiffTask = null
                this.publishDialogVisible = false
                this.publishResultDialogVisible = false
                this.scriptFlowGuideDialogVisible = false
                this.planPublishGuardDialogVisible = false
                this.scriptCreateDialogVisible = false
                this.readyPreviewDialogVisible = false
                this.copyPreviewDialogVisible = false
                this.resetCopyPreviewState()
                this.diffDetailVisible = false
                this.activePublishStage = publishStageCopyConfig
                this.activePublishStep = String(PUBLISH_STEPS.PUBLISH_STEP_TEST)
                this.publishFilters = {
                    appIds: [],
                    games: [],
                    diffStatuses: []
                }
                this.clearCopyFlowState()
                this.$message.success('缓存已清理')
            }).catch(() => {
                // 用户取消清理
            })
        },

        buildCopyFlowStorageTasks(tasks) {
            return tasks.map(task => ({
                appId: task.appId,
                gameId: task.gameId,
                gameName: task.gameName,
                configName: task.configName,
                configDesc: task.configDesc,
                subKey: task.subKey,
                publishKey: task.publishKey,
                keyStr: task.keyStr,
                hasCopiedChanges: task.hasCopiedChanges === true,
                scriptFlowPublished: task.scriptFlowPublished === true,
                scriptFlowReadyComplete: task.scriptFlowReadyComplete === true
            }))
        },

        getValidCopyFlowTasks(tasks) {
            if (!Array.isArray(tasks)) {
                return []
            }
            const appIdSet = new Set(this.appOptions.map(item => String(item.value)))
            return tasks.map(task => {
                if (!task || !task.keyStr || !task.subKey || task.appId === undefined || task.appId === null) {
                    return null
                }
                if (!appIdSet.has(String(task.appId))) {
                    return null
                }
                if (!this.configTypeOptions.some(item => item.value === task.keyStr)) {
                    return null
                }
                return {
                    appId: this.getValidOptionValue(task.appId, this.appOptions, 'value'),
                    gameId: task.gameId,
                    gameName: task.gameName || this.getGameLabel(task.gameId),
                    configName: task.configName || typeLabelMap[task.keyStr] || task.keyStr,
                    configDesc: task.configDesc || task.configName || typeLabelMap[task.keyStr] || task.keyStr,
                    subKey: task.subKey,
                    publishKey: task.publishKey || this.getFullKey(task.subKey),
                    keyStr: task.keyStr,
                    hasCopiedChanges: task.hasCopiedChanges === true,
                    scriptFlowPublished: task.scriptFlowPublished === true,
                    scriptFlowReadyComplete: task.scriptFlowReadyComplete === true
                }
            }).filter(Boolean)
        },

        getValidOptionValues(values, options, key) {
            if (!Array.isArray(values)) {
                return []
            }
            const valueMap = new Map(options.map(item => [String(item[key]), item[key]]))
            const result = []
            const added = new Set()
            for (const value of values) {
                const validValue = valueMap.get(String(value))
                if (validValue === undefined || added.has(String(validValue))) {
                    continue
                }
                result.push(validValue)
                added.add(String(validValue))
            }
            return result
        },

        getValidOptionValue(value, options, key) {
            return this.getValidOptionValues([value], options, key)[0]
        },

        getValidConfigTypes(values) {
            const typeSet = new Set(this.configTypeOptions.map(item => item.value))
            return Array.isArray(values) ? values.filter(item => typeSet.has(item)) : []
        },

        getValidGameCfgKeys(values) {
            const keySet = new Set(Object.keys(gameCfgLabelMap))
            return Array.isArray(values) ? values.filter(item => keySet.has(item)) : []
        },

        getPublishDiff(opType, keyID, envEmpty, appId) {
            return request({
                url: 'configfileV2/diff',
                method: 'get',
                data: { opType, keyID, AppId: appId },
                envEmpty,
                isGameCfg: true
            })
        },

        getPublishView(keyID, envEmpty, appId) {
            return request({
                url: 'configfileV2/review',
                method: 'get',
                data: { keyID, AppId: appId },
                envEmpty,
                isGameCfg: true
            })
        },

        submitPublishConfig(opType, keyID, summary, envEmpty, attrInfo, appId) {
            return request({
                url: 'configfileV2/publish',
                method: 'post',
                data: { opType, keyID, summary, AttrInfo: attrInfo, EnvEmpty: envEmpty ? 1 : 0, AppId: appId },
                envEmpty,
                isGameCfg: true
            })
        },



        getGameName(gid) {
            for (const o of this.gameOptions) {
                if (o.key === parseInt(gid)) {
                    return o.label
                }
            }
        },

        handleCheckAllGameChange(val) {
            const filteredGameIds = this.filteredGameOptions.map(game => game.key)
            if (val) {
                const missingGames = this.getMissingSubKeyMapGames(filteredGameIds)
                const selectedGameIdSet = new Set(this.selectedGameIds.map(gameId => String(gameId)))
                const gameIdsToSelect = this.selectableFilteredGameOptions
                    .map(game => game.key)
                    .filter(gameId => !selectedGameIdSet.has(String(gameId)))
                this.selectedGameIds = this.selectedGameIds.concat(gameIdsToSelect)
                this.updateCheckAllGames()
                this.showMissingSubKeyMapTip(missingGames)
            } else {
                const filteredGameIdSet = new Set(filteredGameIds.map(gameId => String(gameId)))
                this.selectedGameIds = this.selectedGameIds.filter(gameId => !filteredGameIdSet.has(String(gameId)))
                this.updateCheckAllGames()
            }
        },

        handleGameChange(val) {
            this.filterSelectedGamesBySubKeyMap(true)
        },

        handleConfigTypesChange() {
            this.filterSelectedGamesBySubKeyMap(true)
        }

    },



}


</script>

<style scoped>
.page {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
}

.box-card {
    max-width: 1100px;
    margin: 0 auto;
    padding: 10px;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
}

.label {
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
    font-weight: 600;
}

.game-select-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.game-id-search {
    width: 220px;
}

.action {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.script-create-notice {
    margin: 10px 0 0;
    color: #f56c6c;
    font-size: 14px;
}

.copy-publish-tip {
    margin-top: 12px;
}

.script-flow-guide-alert {
    margin-bottom: 12px;
}

.script-ready-zero-alert {
    margin-bottom: 10px;
}

.script-create-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}

.script-create-status-creating {
    color: #409eff;
}

.script-create-status-completed,
.script-create-progress-completed {
    color: #67c23a;
    font-weight: 600;
}

.script-create-status-failed,
.script-create-progress-failed {
    color: #f56c6c;
    font-weight: 600;
}

.script-create-status-paused {
    color: #e6a23c;
}

.script-create-status-pending,
.script-create-progress-pending,
.script-create-progress-paused {
    color: #909399;
}

.script-create-progress-creating {
    color: #409eff;
    font-weight: 600;
}

.publish-dialog-tip {
    margin-bottom: 12px;
}

.formal-check-alert {
    margin-bottom: 12px;
}

.copy-preview-alert {
    margin-bottom: 12px;
}

.copy-preview-title {
    margin: 10px 0 8px;
    font-size: 14px;
    font-weight: 600;
}

.copy-preview-title-diff {
    color: #409eff;
}

.copy-preview-title-same {
    color: #909399;
}

.copy-preview-title-fail {
    color: #f56c6c;
}

.copy-preview-plan-alert {
    margin-top: 12px;
}

.ready-result-title {
    margin: 10px 0 8px;
    font-size: 14px;
    font-weight: 600;
}

.ready-result-success {
    color: #67c23a;
}

.ready-result-fail {
    color: #f56c6c;
}

.publish-filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
}

.publish-filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.publish-filter-label {
    color: #606266;
    font-size: 13px;
    white-space: nowrap;
}

.publish-filter-item .el-select {
    width: 210px;
}

.publish-step-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.publish-step-tabs {
    flex: 1;
}

.publish-step-tabs ::v-deep .el-tabs__header {
    margin-bottom: 0;
}

.publish-selected-count {
    margin-left: 16px;
    color: #606266;
    font-size: 13px;
    white-space: nowrap;
}

.publish-result-title {
    margin: 10px 0 8px;
    font-size: 14px;
    font-weight: 600;
}

.publish-result-title-fail {
    color: #f56c6c;
}

.publish-result-title-success {
    color: #67c23a;
}

.tip {
    font-size: 12px;
    color: #999;
}

.target-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.target-actions {
    flex-shrink: 0;
}

.target-actions .el-button {
    padding: 5px 8px;
}

.game-checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    column-gap: 18px;
    row-gap: 8px;
    align-items: start;
}

.game-checkbox-grid .el-checkbox {
    display: flex;
    align-items: center;
    margin-right: 0;
    min-width: 0;
}

.game-checkbox-grid .el-checkbox__label {
    overflow-wrap: anywhere;
    line-height: 20px;
}

.diff-value {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: Consolas, Monaco, monospace;
    font-size: 12px;
    line-height: 1.4;
}
</style>
