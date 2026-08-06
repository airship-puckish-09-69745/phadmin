<template>
    <div class="page">

        <el-card shadow="never" class="box-card">

            <!-- 标题 -->
            <div class="title">
                🎮 游戏配置复制工具
            </div>

            <el-divider />

            <!-- 第一行：选择区域 -->
            <el-row :gutter="20" type="flex" align="middle">

                <!-- 源 app -->
                <el-col :span="8">
                    <div class="label">源 AppId</div>
                    <el-select v-model="appId" clearable placeholder="请选择源应用" style="width: 100%">
                        <el-option v-for="o in sourceAppOptions" :key="o.value" :label="o.label" :value="o.value" />
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
                        placeholder="输入游戏ID搜索" class="game-id-search" />
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
                <el-button type="primary" size="medium" :loading="loading" @click="handleCopy">
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

            <el-alert v-if="hasUnpublishedCopyTasks" class="copy-publish-tip" type="warning" :closable="false"
                show-icon title="注意：如果要创建本次复制后的方案剧本，请先发布复制配置；未发布时，创建剧本会读取当前已发布的方案配置，不包含本次复制内容。" />

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

        <el-dialog title="发布结果" :visible.sync="publishResultDialogVisible" width="85%" :append-to-body="true">
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

        <el-dialog :title="scriptCreateDialogTitle" :visible.sync="scriptCreateDialogVisible" width="85%"
            :append-to-body="true">
            <el-table :data="scriptCreateTasks" stripe border style="width: 100%" max-height="520">
                <el-table-column prop="appId" label="AppId" width="90" />
                <el-table-column prop="gameName" label="游戏名" width="180" />
                <el-table-column prop="subKey" label="Key" min-width="240" />
                <el-table-column prop="planId" label="方案ID" width="90" />
                <el-table-column prop="planName" label="方案名" width="140" />
                <el-table-column prop="planVersion" label="版本" width="80" />
                <el-table-column prop="versionComment" label="版本说明" min-width="160" />
                <el-table-column prop="scriptSteps" label="剧本步数" width="100" />
                <el-table-column prop="scriptNumber" label="剧本数量" width="100" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" :disabled="scriptLoading" @click="scriptCreateDialogVisible = false">取 消</el-button>
                <el-button type="primary" size="mini" :loading="scriptLoading"
                    @click="confirmCreateScripts">确认创建</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="readyPreviewDialogTitle" :visible.sync="readyPreviewDialogVisible" width="85%"
            :append-to-body="true">
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
                <el-button size="mini" :disabled="readyLoading" @click="readyPreviewDialogVisible = false">取 消</el-button>
                <el-button type="primary" size="mini" :loading="readyLoading" @click="confirmReadyTasks">确认就绪</el-button>
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
                <el-table-column prop="oldVal" label="当前已发布值" min-width="240">
                    <template slot-scope="scope">
                        <pre class="diff-value">{{ formatDiffValue(scope.row.oldVal) }}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="newVal" label="发布值" min-width="240">
                    <template slot-scope="scope">
                        <pre class="diff-value">{{ formatDiffValue(scope.row.newVal) }}</pre>
                    </template>
                </el-table-column>
            </el-table>
            <div v-else style="color: red;font-size: 14px;text-align: center">
                本次发布与当前已发布内容无任何差异！
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
const legacySourceAppId = 0
const copyFlowStorageVersion = 2
const copyFlowStoragePrefix = 'slots-conf-copy-flow'
const publishStageSourceConfig = 'sourceConfig'
const publishStageCopyConfig = 'copyConfig'
const publishStageScriptCreate = 'scriptCreate'
const publishStagePlanReady = 'planReady'
const publishStagePlanConfig = 'planConfig'
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
            appOptions: [],
            legacyCustomizeRecords: {},
            legacyPlanConfigRecords: null,

            targetAppIds: [],

            loading: false,
            publishLoading: false,
            scriptLoading: false,
            readyLoading: false,
            publishDialogVisible: false,
            publishResultDialogVisible: false,
            scriptCreateDialogVisible: false,
            readyPreviewDialogVisible: false,
            diffDetailVisible: false,
            publishTasks: [],
            copyPublishTasks: [],
            scriptPublishTasks: [],
            readyPublishTasks: [],
            publishResultFailTasks: [],
            publishResultSuccessTasks: [],
            scriptCreateTasks: [],
            readyPreviewTasks: [],
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
        sourceAppOptions() {
            const options = [...this.appOptions]
            if (this.isLegacySourceAvailable) {
                options.unshift({ value: legacySourceAppId, label: `${this.legacySourceName}（无 AppId）` })
            }
            return options
        },
        legacySourceName() {
            return store.getters.env === 'pro' ? '旧版线上' : '旧版测试'
        },
        isLegacySource() {
            return this.appId !== null && this.appId !== undefined && Number(this.appId) === legacySourceAppId
        },
        isLegacySourceAvailable() {
            return this.isV2Version
        },
        filteredTargetAppOptions() {
            return this.appOptions.filter(
                i => i.value !== this.appId
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
            if (!this.requiresGameSubKeyMap) {
                return this.gameOptions
            }
            return this.gameOptions.filter(game => !this.isGameMissingSubKeyMap(game.key))
        },
        filteredGameOptions() {
            const keyword = this.gameIdKeyword.trim()
            if (!keyword) {
                return this.gameOptions
            }
            return this.gameOptions.filter(game => String(game.key).includes(keyword))
        },
        selectableFilteredGameOptions() {
            const selectableGameIdSet = new Set(this.selectableGameOptions.map(game => String(game.key)))
            return this.filteredGameOptions.filter(game => selectableGameIdSet.has(String(game.key)))
        },
        requiresGameSubKeyMap() {
            return this.configTypes.includes('slot_game') ||
                (this.isLegacySource && this.configTypes.includes('slot_jackpot'))
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
            return this.isV2Version && this.targetAppIds.length > 0 && this.selectedGameIds.length > 0
        },
        canOperateCopiedPlanTasks() {
            return this.hasSelectedPlanScope && !this.loading && !this.publishLoading
        },
        canPlanCreateScripts() {
            return this.canOperateCopiedPlanTasks && !this.scriptLoading && !this.readyLoading
        },
        canPlanReady() {
            return this.canOperateCopiedPlanTasks && !this.scriptLoading && !this.readyLoading
        },
        canOneKeyPublish() {
            if (!this.isV2Version || this.loading || this.scriptLoading || this.readyLoading || this.publishLoading) {
                return false
            }
            return this.pendingPublishTaskCount > 0 || this.canPublishSourceConfig
        },
        canClearCopyFlowCache() {
            if (!this.isV2Version || this.loading || this.scriptLoading || this.readyLoading || this.publishLoading) {
                return false
            }
            return this.pendingPublishTaskCount > 0 ||
                this.publishTasks.length > 0 ||
                this.scriptCreateTasks.length > 0 ||
                this.readyPreviewTasks.length > 0
        },
        canPublishSourceConfig() {
            if (this.isLegacySource || this.targetAppIds.length > 0 || this.appId === null || this.appId === undefined || this.configTypes.length === 0) {
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
        scriptCreateDialogTitle() {
            return `待创建剧本列表(${this.scriptCreateTasks.length})`
        },
        readyPreviewDialogTitle() {
            return `待就绪方案列表(${this.readyPreviewTasks.length})`
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
                id => id !== newVal
            )
            this.resetLegacySourceCache()
            this.filterSelectedGamesBySubKeyMap(false)
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

            if (this.isLegacySource) {
                this.resetLegacySourceCache()
            }


            const planPublishConflictTasks = await this.getReadyPublishConflictsForCopy()
            if (planPublishConflictTasks.length > 0) {
                return this.showCopyReadyPublishConflict(planPublishConflictTasks)
            }

            this.loading = true
            this.publishTasks = []
            this.copyPublishTasks = []
            this.scriptCreateTasks = []
            this.readyPreviewTasks = []
            this.scriptCreateDialogVisible = false
            this.readyPreviewDialogVisible = false
            this.activePublishStage = publishStageCopyConfig

            try {
                const failList = []
                const successTasks = []

                // 1. 复制老虎机基础、规则、扩展配置
                if (this.configTypes.includes('slot_game')) {
                    await this.copySlotGameConfigs(failList, successTasks)
                }

                // 2. 复制老虎机方案配置
                if (this.configTypes.includes('slot_plan')) {
                    await this.copyConfigBySubKeys(await this.buildGameSubKeysWithRelated('slot_plan', failList), 'slot_plan', failList, successTasks)
                }

                // 3. 复制老虎机大奖配置
                if (this.configTypes.includes('slot_jackpot')) {
                    await this.copyConfigBySubKeys(await this.buildGameSubKeysWithRelated('slot_jackpot', failList), 'slot_jackpot', failList, successTasks)
                }


                // 4. 复制slot任务配置
                if (this.configTypes.includes('slot_task')) {
                    await this.copyConfigBySubKeys([this.getSlotsCustomScriptKey(0, 'slot_task')], 'slot_task', failList, successTasks)
                }

                // 5. 复制剧本统计配置
                if (this.configTypes.includes('slot_script_stat')) {
                    await this.copyConfigBySubKeys([this.getSlotsCustomScriptKey(0, 'slot_script_stat')], 'slot_script_stat', failList, successTasks)
                }

                this.copyPublishTasks = successTasks
                this.scriptPublishTasks = this.removeOverlappedPublishTasks(this.scriptPublishTasks, successTasks)
                this.readyPublishTasks = this.removeOverlappedPublishTasks(this.readyPublishTasks, successTasks)
                this.persistCopyFlowState()

                // 所有复制结束后统一提示
                if (failList.length > 0) {
                    const msg = failList
                        .map(item => this.formatCopyFailMessage(item))
                        .join('\n')

                    this.$alert(msg, '部分复制失败', {
                        type: 'warning'
                    })
                } else {
                    this.$message.success('全部复制成功')
                }
            } finally {
                this.loading = false
            }

        },



        async loadConfig(keyStr) {

            const tasks = this.selectedGameIds.map(async (gameId) => {
                const result = await this.getCustomizeRecordFromAll(this.getSlotsCustomScriptKey(gameId, keyStr), this.appId)
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
            const configLabel = this.getConfigTypeOptionLabel(context.keyStr)
            const operationName = context.operationName || '操作'
            const sourceName = Number(fromAppId) === legacySourceAppId ? this.legacySourceName : `源 AppId ${fromAppId || '-'}`

            if (this.isCustomizeConfigNotFoundError(msg) || String(msg).includes(`${this.legacySourceName}配置不存在`)) {
                return `原因:${sourceName}未找到${configLabel}${subKey ? ` ${subKey}` : ''}。处理方式:请先在${sourceName}保存该配置，或取消勾选【${configLabel}】后重新复制。`
            }

            if (this.isPublishedPlanConfigMissingError(msg, context)) {
                const publishEnvName = context.publishEnvName || this.getPlanPublishedReadInfo().envName
                const publishActionName = context.publishActionName || this.getPlanPublishedReadInfo().actionName
                return `原因:目标 AppId ${context.appId || '-'} 的方案配置 ${subKey || ''} 尚未发布到${publishEnvName}。处理方式:请先点击【发布】，将该复制配置${publishActionName}后再执行【${operationName}】。`
            }

            if (/源方案配置不存在/.test(msg)) {
                return `原因:${sourceName}未找到方案配置 ${subKey || ''}。处理方式:请先在${sourceName}保存该方案配置，或取消勾选【老虎机方案配置】后重新复制。`
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
            if (this.isLegacySource) {
                const sourceResult = keyStr === 'slot_plan'
                    ? await this.getLegacyPlanSourceRecord({ gameId, subKey })
                    : await this.getLegacyCustomizeRecord(this.getLegacyCustomizeSourceKey(gameId, keyStr, subKey))
                if (sourceResult.errMsg) {
                    failList.push({
                        keyStr,
                        gameId,
                        appId: this.appId,
                        subKey,
                        errMsg: `${this.legacySourceName}附属配置检测失败:${sourceResult.errMsg}`
                    })
                    return false
                }
                return Boolean(sourceResult.record)
            }

            try {
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
            if (this.isLegacySource) {
                return []
            }
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
            if (this.appId === null || this.appId === undefined) {
                this.$message.warning('请选择源 AppId')
                return false
            }
            if (this.targetAppIds.length > 0) {
                this.$message.warning('已有目标 AppId 时，请先执行复制后再发布复制内容')
                return false
            }
            if (this.isLegacySource) {
                this.$message.warning(`${this.legacySourceName}配置不能在此页面直接发布，请先复制到目标 AppId`)
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
            return this.requiresGameSubKeyMap && this.isGameMissingSubKeyMap(gameId)
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
            if (!this.requiresGameSubKeyMap) {
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
                `以下游戏缺少SubKeyMap映射，不能复制当前所选配置，请先维护映射：\n${rows.join('\n')}`,
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

                        const res = this.isLegacySource
                            ? await this.copyLegacyCustomizeConfig(cfgItem, keyStr, appId)
                            : await copyCustomize(cfgItem.subKey, this.appId, appId)
                        if (res.RetCode !== 0) {
                            failList.push({
                                keyStr,
                                gameId: cfgItem.gameId,
                                appId,
                                subKey: cfgItem.subKey,
                                errMsg: this.getCopyError(res)
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
                const sourceResult = this.isLegacySource
                    ? await this.getLegacyPlanSourceRecord(cfgItem)
                    : await this.getCustomizeRecordFromAll(cfgItem.subKey, this.appId)
                if (sourceResult.errMsg) {
                    return {
                        errMsg: sourceResult.errMsg
                    }
                }
                if (!sourceResult.record || !sourceResult.record.Data) {
                    return { errMsg: `源方案配置不存在:${cfgItem.subKey}` }
                }

                const data = this.parseJson(sourceResult.record.Data, null)
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
            const shouldReduceScriptNumber = this.isLegacySource && store.getters.env === 'test'
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

        resetLegacySourceCache() {
            this.legacyCustomizeRecords = {}
            this.legacyPlanConfigRecords = null
        },

        async getLegacyCustomizeRecord(subKey) {
            if (Object.prototype.hasOwnProperty.call(this.legacyCustomizeRecords, subKey)) {
                return { record: this.legacyCustomizeRecords[subKey] }
            }
            try {
                const response = await legacyRequest({
                    url: '/customizeconfig/one',
                    method: 'get',
                    data: { SubKey: subKey }
                })
                if (response.RetCode !== 0) {
                    const errMsg = this.getCopyError(response)
                    if (/sql:\s*no rows in result set/i.test(errMsg || '')) {
                        this.legacyCustomizeRecords[subKey] = null
                        return { record: null }
                    }
                    return { errMsg: errMsg || `读取${this.legacySourceName}自定义配置失败:${subKey}` }
                }
                this.legacyCustomizeRecords[subKey] = response.Data || null
                return { record: this.legacyCustomizeRecords[subKey] }
            } catch (err) {
                return { errMsg: this.getCopyError(null, err) || `读取${this.legacySourceName}自定义配置异常:${subKey}` }
            }
        },

        async loadLegacyPlanConfigRecords() {
            if (Array.isArray(this.legacyPlanConfigRecords)) {
                return { records: this.legacyPlanConfigRecords }
            }
            try {
                const response = await request({
                    url: '/slotsScriptV3Config/all',
                    method: 'get',
                    data: {}
                })
                if (response.RetCode !== 0) {
                    return { errMsg: this.getCopyError(response) || `读取${this.legacySourceName}方案配置失败` }
                }
                this.legacyPlanConfigRecords = Array.isArray(response.Data) ? response.Data : []
                return { records: this.legacyPlanConfigRecords }
            } catch (err) {
                return { errMsg: this.getCopyError(null, err) || `读取${this.legacySourceName}方案配置异常` }
            }
        },

        async getLegacyPlanSourceRecord(cfgItem) {
            const result = await this.loadLegacyPlanConfigRecords()
            if (result.errMsg) {
                return result
            }
            const records = result.records.filter(item => Number(item.SlotsType) === Number(cfgItem.gameId))
            if (records.length === 0) {
                return { record: null }
            }
            if (records.length > 1) {
                return { errMsg: `${this.legacySourceName}方案配置存在重复记录:SlotsType=${cfgItem.gameId}，数量:${records.length}` }
            }
            const legacyRecord = records[0]

            const plans = typeof legacyRecord.ConfigData === 'string'
                ? this.parseJson(legacyRecord.ConfigData, null)
                : this.cloneData(legacyRecord.ConfigData)
            if (!Array.isArray(plans)) {
                return { errMsg: `${this.legacySourceName}方案配置数据格式错误:${cfgItem.subKey}` }
            }

            const name = `${cfgItem.gameName || this.getGameLabel(cfgItem.gameId)}方案配置`
            return {
                record: {
                    RedisSubkey: cfgItem.subKey,
                    Data: JSON.stringify({
                        SlotsType: Number(cfgItem.gameId),
                        Plans: plans
                    }),
                    Name: name,
                    Description: name,
                    Type: 1
                }
            }
        },

        getLegacyCustomizeSourceKey(gameId, keyStr, targetSubKey) {
            if (keyStr !== 'slot_jackpot') {
                return targetSubKey
            }
            const id = Number(gameId)
            const baseGameId = id >= relatedGameIdOffset ? id - relatedGameIdOffset : id
            const prefix = this.getSlotGameSubKeyPrefix(baseGameId)
            if (!prefix) {
                return ''
            }
            return `${prefix}${id >= relatedGameIdOffset ? '_x_script_cfg' : '_script_cfg'}`
        },

        async copyLegacyCustomizeConfig(cfgItem, keyStr, appId) {
            const sourceSubKey = this.getLegacyCustomizeSourceKey(cfgItem.gameId, keyStr, cfgItem.subKey)
            if (!sourceSubKey) {
                return {
                    RetCode: -1,
                    RetMsg: `未配置${this.legacySourceName}源Key映射:${cfgItem.subKey}`
                }
            }

            const sourceResult = await this.getLegacyCustomizeRecord(sourceSubKey)
            if (sourceResult.errMsg) {
                return { RetCode: -1, RetMsg: sourceResult.errMsg }
            }
            if (!sourceResult.record || !sourceResult.record.Data) {
                return {
                    RetCode: -1,
                    RetMsg: `${this.legacySourceName}配置不存在:${sourceSubKey}`
                }
            }

            const targetResult = await this.getCustomizeRecordFromAll(cfgItem.subKey, appId)
            if (targetResult.errMsg) {
                return { RetCode: -1, RetMsg: targetResult.errMsg }
            }

            const sourceRecord = sourceResult.record
            const targetRecord = targetResult.record
            const defaultName = keyStr === 'slot_game'
                ? (cfgItem.configName || cfgItem.subKey)
                : this.getSlotsName(cfgItem.gameId, keyStr)
            const name = sourceRecord.Name || defaultName
            const payload = {
                AppId: appId,
                RedisSubkey: cfgItem.subKey,
                Data: sourceRecord.Data,
                Name: name,
                Description: sourceRecord.Description || name,
                Type: sourceRecord.Type || 1,
                ModifyUser: store.getters.name,
                LastModify: Math.floor(new Date().getTime() / 1000)
            }
            if (targetRecord && targetRecord.ID) {
                payload.ID = targetRecord.ID
            }
            if (sourceRecord.Subtype !== undefined && sourceRecord.Subtype !== null) {
                payload.Subtype = sourceRecord.Subtype
            }

            return targetRecord ? updateCustomize(payload) : createCustomize(payload)
        },

        ensurePlanOperationSelection() {
            if (!this.ensureV2Version()) return false
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
            return this.mergePublishTasks([], this.getOverlappedPublishTasks(this.copyPublishTasks, planTasks))
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
            const tasks = this.buildSelectedPlanTasks()
            if (tasks.length === 0) {
                return this.$message.warning('暂无可创建剧本的方案配置')
            }
            const copyConflictTasks = this.getCopyPublishConflictsForPlanOperation(tasks)
            if (copyConflictTasks.length > 0) {
                return this.showCopyPendingPlanOperationConflict(copyConflictTasks, '创建剧本')
            }

            this.scriptLoading = true
            const failList = []
            try {
                const createTasks = await this.collectPlanScriptCreateTasks(tasks, failList, { usePublished: true })
                if (failList.length > 0) {
                    this.showPlanOperationResult('创建剧本检查', 0, failList)
                    return
                }
                if (createTasks.length === 0) {
                    return this.$message.warning('没有待创建剧本的方案版本')
                }

                this.scriptCreateTasks = createTasks
                this.scriptCreateDialogVisible = true
            } finally {
                this.scriptLoading = false
            }
        },

        isPlanDisabled(plan) {
            return Boolean(plan) && (plan.IsDisabled === true || Number(plan.IsDisabled) === 1)
        },

        async collectPlanScriptCreateTasks(tasks, failList, options = {}) {
            const createTasks = []
            for (const task of tasks) {
                if (!(await this.shouldHandlePlanTask(task, failList))) {
                    continue
                }
                const planData = options.usePublished ? await this.loadPublishedPlanCustomizeData(task, failList) : await this.loadPlanCustomizeData(task, failList)
                if (!planData) {
                    continue
                }
                for (const plan of planData.data.Plans || []) {
                    if (this.isPlanDisabled(plan)) {
                        continue
                    }
                    for (const version of plan.Versions || []) {
                        if (version.IsReady) {
                            continue
                        }
                        createTasks.push(this.buildPlanScriptCreateTask(task, plan, version))
                    }
                }
            }
            return createTasks
        },

        buildPlanScriptCreateTask(task, plan, version) {
            const scriptCfg = version.ScriptCfg || {}
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
                scriptNumber: scriptCfg.ScriptNumber
            }
        },

        async confirmCreateScripts() {
            if (!this.ensureV2Version()) return
            if (this.scriptCreateTasks.length === 0) {
                return this.$message.warning('暂无可创建剧本')
            }

            this.scriptLoading = true
            const failList = []
            let successCount = 0
            const publishTaskMap = new Map()
            try {
                for (const item of this.scriptCreateTasks) {
                    try {
                        const response = await this.createPlanVersionScripts(item.task, item.plan, item.version)
                        if (response && response.RetCode === 0) {
                            successCount++
                            publishTaskMap.set(`${item.task.appId}_${item.task.subKey}`, item.task)
                        } else {
                            failList.push({
                                task: item.task,
                                plan: item.plan,
                                version: item.version,
                                createTask: item,
                                errMsg: this.getCopyError(response) || '创建剧本失败'
                            })
                        }
                    } catch (err) {
                        failList.push({
                            task: item.task,
                            plan: item.plan,
                            version: item.version,
                            createTask: item,
                            errMsg: this.getCopyError(null, err) || '创建剧本异常'
                        })
                    }
                }
                const publishTasks = Array.from(publishTaskMap.values())
                if (publishTasks.length > 0) {
                    this.markCopiedChangeTasks(publishTasks)
                    this.scriptPublishTasks = this.mergePublishTasks(this.scriptPublishTasks, publishTasks)
                    this.persistCopyFlowState()
                }
                if (failList.length === 0) {
                    this.scriptCreateDialogVisible = false
                    this.scriptCreateTasks = []
                } else {
                    this.scriptCreateTasks = failList.map(item => item.createTask).filter(Boolean)
                }
                this.showPlanOperationResult('创建剧本', successCount, failList)
            } finally {
                this.scriptLoading = false
            }
        },

        async handleOneKeyReady() {
            if (!this.ensurePlanOperationSelection()) return
            const tasks = this.buildSelectedPlanTasks()
            if (tasks.length === 0) {
                return this.$message.warning('暂无可就绪的方案配置')
            }
            const copyConflictTasks = this.getCopyPublishConflictsForPlanOperation(tasks)
            if (copyConflictTasks.length > 0) {
                return this.showCopyPendingPlanOperationConflict(copyConflictTasks, '剧本就绪')
            }

            this.readyLoading = true
            const failList = []
            try {
                const readyTasks = await this.collectPlanReadyPreviewTasks(tasks, failList)
                if (failList.length > 0) {
                    this.showPlanOperationResult('剧本就绪检查', 0, failList)
                    return
                }
                if (readyTasks.length === 0) {
                    return this.$message.warning('没有符合就绪条件的方案版本')
                }

                this.readyPreviewTasks = readyTasks
                this.readyPreviewDialogVisible = true
            } finally {
                this.readyLoading = false
            }
        },

        async collectPlanReadyPreviewTasks(tasks, failList) {
            const readyTasks = []
            for (const task of tasks) {
                if (!(await this.shouldHandlePlanTask(task, failList))) {
                    continue
                }
                const planData = await this.loadPlanCustomizeData(task, failList)
                if (!planData) {
                    continue
                }
                const betList = await this.loadPlanScriptBets(task, failList)
                if (!betList || betList.length === 0) {
                    continue
                }

                for (const plan of planData.data.Plans || []) {
                    if (this.isPlanDisabled(plan)) {
                        continue
                    }
                    for (const version of plan.Versions || []) {
                        if (version.IsReady) {
                            continue
                        }
                        const checkResult = await this.checkPlanVersionScripts(task, plan, version, betList)
                        if (checkResult.ok) {
                            readyTasks.push(this.buildPlanReadyPreviewTask(task, planData, plan, version, betList))
                        }
                    }
                }
            }
            return readyTasks
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
                betListText: betList.join('，')
            }
        },

        async confirmReadyTasks() {
            if (!this.ensureV2Version()) return
            if (this.readyPreviewTasks.length === 0) {
                return this.$message.warning('暂无可就绪方案')
            }

            this.readyLoading = true
            const failList = []
            let readyCount = 0
            try {
                const planDataMap = new Map()
                for (const item of this.readyPreviewTasks) {
                    item.version.IsReady = true
                    readyCount++
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
                    publishTasks.push(item.task)
                }

                if (publishTasks.length > 0) {
                    this.markCopiedChangeTasks(publishTasks)
                    this.copyPublishTasks = this.removeOverlappedPublishTasks(this.copyPublishTasks, publishTasks)
                    this.scriptPublishTasks = this.removeOverlappedPublishTasks(this.scriptPublishTasks, publishTasks)
                    this.readyPublishTasks = this.mergePublishTasks(this.readyPublishTasks, publishTasks)
                    this.persistCopyFlowState()
                }

                if (failList.length === 0) {
                    this.readyPreviewDialogVisible = false
                    this.readyPreviewTasks = []
                }
                this.showPlanOperationResult('剧本就绪', readyCount, failList)
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

        async checkPlanVersionScripts(task, plan, version, betList) {
            const scriptNumber = Number(version.ScriptCfg && version.ScriptCfg.ScriptNumber) || 0
            try {
                const notEnoughBets = []
                for (const bet of betList) {
                    const betResponse = await this.requestPlanVersionScripts(task, plan, version, bet)
                    if (!betResponse || betResponse.RetCode !== 0) {
                        return {
                            ok: false,
                            errMsg: `查询下注额 ${bet} 剧本失败:${this.getCopyError(betResponse) || ''}`
                        }
                    }

                    const data = betResponse.Data || {}
                    const count = Number(data[String(bet)] || 0)
                    if (count < scriptNumber) {
                        notEnoughBets.push(`${bet}:${count}/${scriptNumber}`)
                    }
                }

                if (notEnoughBets.length > 0) {
                    return {
                        ok: false,
                        errMsg: `剧本数量不足 ${notEnoughBets.join('，')}`
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

        showPlanOperationResult(title, successCount, failList) {
            if (failList.length === 0) {
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
                const tasks = this.cloneData(sourceTasks)

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
            const copyTasks = this.copyPublishTasks.map(task => Object.assign({}, task, {
                publishStage: publishStageCopyConfig
            }))
            return copyTasks.concat(this.buildPlanConfigPublishTasks())
        },

        buildPlanConfigPublishTasks() {
            const taskMap = new Map()
            for (const task of this.scriptPublishTasks) {
                taskMap.set(`${task.appId}_${task.subKey}`, Object.assign({}, task, {
                    publishStage: publishStagePlanConfig,
                    configDesc: task.configDesc || '创建剧本',
                    planPublishSource: '创建剧本'
                }))
            }
            for (const task of this.readyPublishTasks) {
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
            const oldObj = oldValue || {}
            const newObj = newValue || {}
            if (!this.isPlainObject(oldObj) || !this.isPlainObject(newObj)) {
                if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
                    rows.push({
                        key: prefix || '-',
                        oldVal: oldObj,
                        newVal: newObj
                    })
                }
                return rows
            }
            const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
            keys.forEach(key => {
                const oldVal = oldObj[key]
                const newVal = newObj[key]
                const path = prefix ? `${prefix}.${key}` : key
                if (this.isPlainObject(oldVal) && this.isPlainObject(newVal)) {
                    rows.push(...this.buildObjectDiffRows(oldVal, newVal, path))
                    return
                }
                if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                    rows.push({
                        key: path,
                        oldVal,
                        newVal
                    })
                }
            })
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
            if (!this.lark || !tasks.length || store.getters.env !== 'pro') {
                return false
            }
            return tasks.some(task => [
                PUBLISH_STEPS.PUBLISH_STEP_REVIEWING,
                PUBLISH_STEPS.PUBLISH_STEP_PRO
            ].includes(task.publishOpType))
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
                const hasProPublish = tasks.some(task => task.publishOpType === PUBLISH_STEPS.PUBLISH_STEP_PRO)
                const step = failed ? '【发布失败】' : (hasProPublish ? '【已发布】' : '【待审核】')
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

        async confirmPublishTasks() {
            if (!this.ensureV2Version()) return
            if (this.activePublishStep === publishStepBlocked) {
                return this.$message.warning('异常/不可发布配置不能发布')
            }
            const tasks = this.selectedPublishTasks
            if (tasks.length === 0) {
                return this.$message.warning('请选择要发布的配置')
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
                if (finishedTasks.length > 0) {
                    this.removePendingPublishTasks(this.activePublishStage, finishedTasks)
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
            if (this.pendingPublishTaskCount === 0) {
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
                readyPublishTasks: this.buildCopyFlowStorageTasks(this.readyPublishTasks)
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

            const appId = this.getValidOptionValue(state.appId, this.sourceAppOptions, 'value')
            if (appId === undefined || appId === null) {
                this.clearCopyFlowState()
                return
            }

            const copyPublishTasks = this.getValidCopyFlowTasks(state.copyPublishTasks || state.lastCopyTasks)
            const scriptPublishTasks = this.getValidCopyFlowTasks(state.scriptPublishTasks)
            const readyPublishTasks = this.getValidCopyFlowTasks(state.readyPublishTasks)
            if (copyPublishTasks.length === 0 && scriptPublishTasks.length === 0 && readyPublishTasks.length === 0) {
                this.clearCopyFlowState()
                return
            }

            this.appId = appId
            this.targetAppIds = this.getValidOptionValues(state.targetAppIds, this.appOptions, 'value').filter(id => id !== appId)
            this.configTypes = this.getValidConfigTypes(state.configTypes)
            this.selectedGameCfgKeys = this.getValidGameCfgKeys(state.selectedGameCfgKeys)
            this.selectedGameIds = this.getValidOptionValues(state.selectedGameIds, this.gameOptions, 'key')
            this.filterSelectedGamesBySubKeyMap(false)
            this.copyPublishTasks = copyPublishTasks
            this.scriptPublishTasks = scriptPublishTasks
            this.readyPublishTasks = readyPublishTasks
            this.activePublishStage = copyPublishTasks.length > 0
                ? publishStageCopyConfig
                : publishStagePlanConfig
            this.publishTasks = []
            this.scriptCreateTasks = []
            this.readyPreviewTasks = []
            this.publishDialogVisible = false
            this.scriptCreateDialogVisible = false
            this.readyPreviewDialogVisible = false
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
                this.copyPublishTasks = []
                this.scriptPublishTasks = []
                this.readyPublishTasks = []
                this.publishTasks = []
                this.selectedPublishTasks = []
                this.scriptCreateTasks = []
                this.readyPreviewTasks = []
                this.publishResultFailTasks = []
                this.publishResultSuccessTasks = []
                this.currentDiffTask = null
                this.publishDialogVisible = false
                this.publishResultDialogVisible = false
                this.scriptCreateDialogVisible = false
                this.readyPreviewDialogVisible = false
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
                hasCopiedChanges: task.hasCopiedChanges === true
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
                    hasCopiedChanges: task.hasCopiedChanges === true
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

.copy-publish-tip {
    margin-top: 12px;
}

.publish-dialog-tip {
    margin-bottom: 12px;
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
