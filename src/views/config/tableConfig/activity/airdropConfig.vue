<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="AirdropConfig" :env-empty="false" :check="configCheck" compare-type="Array" :make-content="makeContent" :attr-names="AttrNames" :head-attrs="['cfgId', 'activity.name']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
      <el-table ref="filterTable"
                :data="tableData"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
                @row-click="clickData"
                @sort-change="sortChange">
        <el-table-column prop="id" label="id" sortable="custom" width="80" />
        <el-table-column prop="name" label="活动名称" />
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="showEndTime" label="展示结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.showEndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="getEditTitle()"
               :visible.sync="edit.visible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @opened="handleEditDialogOpened"
               width="1100px"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="活动配置">
          <el-row>
            <el-form :model="edit.item" label-width="220px" size="mini">
              <el-col :span="24">
                <el-form-item label="空投活动名称：" prop="name" :required="true">
                  <el-input v-model="edit.item.name" placeholder="请输入活动名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动开始时间：" prop="startTime" :required="true">
                  <el-date-picker v-model="edit.item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动结束时间：" prop="endTime" :required="true">
                  <el-date-picker v-model="edit.item.endTime" type="datetime"  placeholder="选择结束时间" value-format="timestamp" @change="onChangeEndTime"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="展示结束时间：" prop="showEndTime" :required="true">
                  <el-date-picker v-model="edit.item.showEndTime" type="datetime" placeholder="选择展示结束时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发放奖励类型：" :required="true">
                  <el-select v-model="edit.item.rewardConfig.rewardType" placeholder="请选择" style="width:90px">
                    <el-option
                      v-for="item in rewardTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-if="edit.item.rewardConfig.rewardType === 2" v-model="edit.item.rewardConfig.useSceneId" placeholder="请选择投注金" style="width:200px">
                    <el-option
                      v-for="scene in betScenes"
                      :key="scene.value"
                      :label="scene.label"
                      :value="scene.value"
                    />
                  </el-select>
                  <el-select v-if="edit.item.rewardConfig.rewardType === 3" v-model="edit.item.rewardConfig.useSceneId" placeholder="请选择返水金" style="width:150px">
                    <el-option
                      v-for="scene in rebateScenes"
                      :key="scene.value"
                      :label="scene.label"
                      :value="scene.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="空投总奖励金额：" :required="true">
                  <el-input v-model.number="edit.item.rewardConfig.totalReward">
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发奖剩余监控比例：" :required="true">
                  <el-input v-model.number="edit.item.rewardConfig.remainRewardMonitorRate">
                    <template slot="append">％</template>
                  </el-input>
                  <span v-if="sentRewardAmount  > edit.item.rewardConfig.remainRewardMonitorRate*edit.item.rewardConfig.totalReward/100" style="color: red">发奖总额已超阈值（{{sentRewardAmount }}）</span>
                  <span v-else style="color: red">已发奖总额（{{sentRewardAmount }}）</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="参与活动用户类型：" :required="true">
                  <el-select v-model="edit.userType" placeholder="请选择" style="width:280px" @change="onUserTypeChange">
                    <el-option
                      v-for="item in userTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调试时间偏移量（仅测试用）：" :required="true">
                  <el-input v-model.number="edit.item.debugTimeOffset">
                    <template slot="append">秒</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="showImportElement">
                <el-form-item label="导入用户：" :required="false">
                  <span>已导入用户：{{this.edit.importedUidListCount}}</span>
                  <span>（已生效用户：{{this.edit.importedUidCacheCount}}）</span>
                  <span style="color: #0088ff">重复导入，不会覆盖原有的用户ID</span><br>
                  <span style="color: red">注意：活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！</span>
                  <el-upload
                    ref="upload"
                    drag
                    :action="actionURL"
                    :on-preview="handlePreview"
                    :on-change="handleChange"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUploadSuccess"
                    :with-credentials="true"
                    :auto-upload="false"
                    :limit="1"
                  >
                    <el-icon class="el-icon-upload" />
                    <div class="el-upload__text">
                      将文件拖到此处 或 <em>点击上传</em>
                    </div>
                    <div slot="tip" class="el-upload__tip">
                      只能上传 text/csv 格式文件，且不超过10MB
                    </div>
                  </el-upload>
                  <el-button class="ml-3" type="success" @click="submitUpload">
                    上传用户ID数据
                  </el-button>
                  <el-button class="ml-3" type="danger" @click="delImportedUid">
                    重置已导入的用户ID
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="showUserFilterCondition">
                <el-form-item label="筛选用户条件：" :required="false">
                  <el-form label-width="120px" size="mini">
                    <el-form-item label="用户注册时间：">
                      <el-date-picker
                        v-model="edit.registerDateRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="timestamp"
                      >
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="累计投注次数：">
                      <el-col :span="6">
                        <el-input
                          v-model.number="edit.item.userFilterCondition.betTimesRange.min"
                          placeholder="输入最小投注次数"
                          oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                        />
                      </el-col>
                      <el-col :span="1">
                        <div style="text-align: center">至</div>
                      </el-col>
                      <el-col :span="6">
                        <el-input
                          v-model.number="edit.item.userFilterCondition.betTimesRange.max"
                          placeholder="输入最大投注次数"
                          oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                        />
                      </el-col>
                    </el-form-item>
                  </el-form>
                </el-form-item>
              </el-col>
              <el-col v-if="showUserTagCondition">
                <el-form-item label="标签类型：">
                  <el-select v-model="edit.item.userFilterCondition.userTagConfig.tagType" placeholder="请选择标签类型" @change="onTagTypeChange">
                    <el-option
                      v-for="item in userTagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="showUserTagCondition">
                <el-form-item label="标签子类：">
                  <el-select v-model="edit.item.userFilterCondition.userTagConfig.tagId" placeholder="请选择标签子类">
                    <el-option
                      v-for="item in edit.userTagIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="showUserTagGameIntensityCondition">
                <el-form-item label="游戏强度：" :required="false">
                  <el-select v-model="edit.item.userFilterCondition.userTagConfig.tagValue" placeholder="请选择游戏强度标签">
                    <el-option
                      v-for="item in userTagGameIntensityOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="单个用户最大领奖额：" :required="true">
                  <el-input v-model.number="edit.item.rewardConfig.userRewardLimit">
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="任务配置">
          <el-row :gutter="5">
            <el-form label-width="220px">
              <el-col :span="20">
                <el-form-item label="勾选支持的游戏：" :required="true">
                  <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                  </el-input>
                  <el-tree
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check-change="handleGameCheckChange"
                  >
                  </el-tree>
                </el-form-item>
<!--                <el-form-item label="给选中游戏排序：" :required="true">
                  <el-button size="mini" type="primary" @click="showGamesSortDialog()">
                    排序
                  </el-button>
                </el-form-item>-->
                <el-form-item label="选中游戏：" disabled="disabled">
                  <el-input type="textarea"
                            v-model="edit.selectedGamesText"
                            :autosize="{ minRows: 1, maxRows: 5}"
                            style="white-space: pre-wrap"/>
                </el-form-item>
                <el-form-item label="任务类型：" :required="true">
                  <el-select v-model="edit.item.taskConfig.taskType" placeholder="请选择" style="width: 300px">
                    <el-option
                      v-for="item in gameTaskTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="任务文本：" :required="true">
                  <el-input v-model="edit.item.taskConfig.taskText"/>
                </el-form-item>
                <el-form-item label="任务条件：" :required="true">
                  <el-input v-model.number="edit.item.taskConfig.taskValueRequired"/>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-dialog
            title="给选中游戏排序"
            :visible.sync="edit.gamesSortDialogVisible"
            append-to-body
          >
            <el-table
              :data="GamesSorted"
              border
              style="width: 100%"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="GameId"
                label="游戏Id"
                width="200"
              />
              <el-table-column
                prop="Name"
                label="游戏名称"
                width="200"
              />
              <el-table-column
                prop="OrderNo"
                label="排序编号"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.OrderNo"
                    size="mini"
                    oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
                    @change="onOrderNoChange"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="top: 10px">
              <el-button type="primary" @click="saveGamesSort">保存</el-button>
            </el-row>
          </el-dialog>
        </el-tab-pane>

        <el-tab-pane label="领奖配置">
          <fieldset style="margin-top: 10px">
            <legend>
              大奖系数配置
            </legend>
            <el-button type="primary" @click="addRewardRange()" size="mini">添加配置</el-button>
            <el-row :gutter="5">
              <el-col>
                <el-table
                  :data="edit.item.rewardConfig.rewardRanges"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="minScore"
                    label="积分区间开始"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.minScore" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="maxScore"
                    label="积分区间结束"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.maxScore" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="minCoefficient"
                    label="系数区间开始"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.minCoefficient" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="maxCoefficient"
                    label="系数区间结束"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.maxCoefficient" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" column-key="op" width="130">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-delete" @click="removeRewardRange(scope.$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </fieldset>

          <fieldset style="margin-top: 20px">
            <legend>
              进度奖励配置
            </legend>
            <el-button type="primary" @click="addProgressPrize()" size="mini">添加配置</el-button>
            <el-row :gutter="5">
              <el-col>
                <el-table
                  :data="edit.item.progressPrizes"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
                >
                  <el-table-column
                    prop="taskValueRequired"
                    label="进度要求"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.taskValueRequired" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propType"
                    label="道具类型"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.propType" placeholder="请选择道具类型" @change="updatePropOptions(scope.row.propType, scope.$index)">
                        <el-option
                          v-for="item in propTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propId"
                    label="道具名称"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.propId" placeholder="请选择道具">
                        <el-option
                          v-for="item in propOptions[scope.$index]"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propExpireDays"
                    label="可用时间"
                  >
                    <template slot-scope="scope">
                      <el-select v-model.number="scope.row.propExpireDays" v-if="scope.row.propType === 2" placeholder="请选择可用时间">
                        <el-option
                          v-for="item in propDayTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propNum"
                    label="道具数量"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.propNum" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="propNumMax"
                    label="道具上限"
                  >
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.propNumMax" oninput=" if(value < 0 || value === '' || value == null){value = 0;} "/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" column-key="op" width="130">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-delete" @click="removeProgressPrize(scope.$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </fieldset>
        </el-tab-pane>

        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col v-if="version === 'V1'" :span="11">
                <el-form-item label="AppId白名单：" prop="item.whitelistCfg.appIdList">
                  <el-select v-model="edit.item.whitelistCfg.appIdList" multiple placeholder="请选择" style="width: 400px" @change="onAppIdOptionsChange">
                    <el-option
                      v-for="item in appIdOptions"
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
                <el-form-item label="SiteId白名单：" prop="item.whitelistCfg.siteIdList">
                  <SiteSelect
                    v-model="edit.item.whitelistCfg.siteIdList"
                    multiple
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="A/B测试开关：" prop="item.whitelistCfg.abTest">
                  <el-switch v-model="edit.item.whitelistCfg.abTest.switch" :active-value="true" :inactive-value="false" active-text="开启" inactive-text="关闭" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="B分组比例：" prop="item.whitelistCfg.abTest.bPercent">
                  <el-input v-model.number="edit.item.whitelistCfg.abTest.bPercent" oninput=" if(value < 0 || value === '' || value == null){value = 0;} ">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane v-if="showImportElement" label="导入的用户">
          <el-row :gutter="5">
            <el-col>
              <el-button type="primary" @click="getImportedUidList()" size="mini">查询</el-button>
              <el-table
                :data="edit.importedUidList"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column
                  prop="uid"
                  label="用户ID"
                />
                <el-table-column
                  prop="create_at"
                  label="导入时间"
                >
                  <template slot-scope="scope">
                    {{ formatTime(scope.row.create_at) }}
                  </template>
                </el-table-column>
              </el-table>
              <el-col :offset="12" :span="9">
                <div class="block">
                  <el-pagination
                    :current-page="edit.clientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="edit.clientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="edit.importedUidListCount"
                    @size-change="handleUidImportedTableSizeChange"
                    @current-change="handleUidImportedTableCurrentChange" />
                </div>
              </el-col>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-row style="margin-top: 10px">
        <el-button type="primary" @click="handleSave()">保存配置</el-button>
      </el-row>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>

import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow, ValidateVueItem } from '@/utils/common'
import Publish from "@/components/Publish/index.vue"
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue"
import Compare from "@/components/Compare/index.vue"
import GameLevel from "@/components/GameLevel/index.vue"
import MoneyInput from "@/components/MoneyInput/index.vue"
import store from "@/store";
import request from "@/utils/request";
import {Message} from "element-ui";
import SiteSelect from "@/components/SiteSelect/index.vue"

const filterMap = {}

const loadingText = '用户导入中，请稍等...'

const gameTaskTypeValidBet = 2 // 游戏任务类型：有效投注

function newItem() {
  return {
    id: 0,
    name: '',
    activityId: 12,
    startTime: Date.parse(new Date().toString()),
    endTime: Date.parse(new Date().toString()),
    showEndTime: Date.parse(new Date().toString()),
    modifyUser: '',
    status: 7,
    gameIdCfg: [],
    ruleImgHor: [],
    ruleImgVer: [],
    whitelistCfg: {
      appIdList: [],
      siteIdList: ['Dev'],
      abTest: {
        switch: false,
        bPercent: 0,
      },
    },
    debugTimeOffset: 0,
    taskConfig: {
      taskType: 0,
      taskText: '',
      taskValueRequired: 20,
    },
    rewardConfig: {
      rewardType: 2,
      useSceneId: 13,
      totalReward: 88888,
      remainRewardMonitorRate: 90,
      rewardRanges: [
        { minScore: 1, maxScore: 100, minCoefficient: 0.5, maxCoefficient: 1 }
      ],
      userRewardLimit: 0,
    },
    progressPrizes: [
      /*{
        propId: 0,
        propType: 0,
        propNum: 1,
        propNumMax: 1,
        propExpireDays: 0,
        taskValueRequired: 1,
      }*/
    ],
    userTypes: [2], // 2 所有用户
    importedFilename: '',
    userFilterCondition: {
      registerTimeRange: {
        min: 0,
        max: 0,
      },
      betTimesRange: {
        min: 0,
        max: 0,
      },
      userTagConfig: {
        tagId: 0,
        tagValue: 0,
        tagType: 0,
      },
    }
  }
}

export default {
  components: { ImagePicker, Compare, Publish, GameLevel, MoneyInput, SiteSelect },
  data() {
    return {
      AttrNames: {
        activity: '活动信息',
        'activity.name': '活动名称',
        'activity.whitelist.siteIdList': '站点白名单',
        'activity.whitelist.appIdList': 'AppId白名单',
        'activity.whitelist.abTest': 'A/B测试配置',
        'activity.status': '配置状态',
        'activity.startTime': '开始时间',
        'activity.endTime': '结束时间',
        'activity.showEndTime': '展示结束时间',
        'activity.ruleImgHor': '横向规则图',
        'activity.ruleImgVer': '纵向规则图',
        'activity.gameIdList': '游戏ID配置',
        'activity.userFilterCondition': '筛选用户条件',
        'activity.userFilterCondition.registerTimeRange': '注册时间',
        'activity.userFilterCondition.betTimesRange': '累计投注次数',
        'activity.userFilterCondition.userTagConfig': '用户标签配置',
        'activity.userFilterCondition.userTagConfig.tagId': '用户标签ID',
        'activity.userFilterCondition.userTagConfig.tagValue': '用户标签值',
        id: '活动配置ID',
        name: '活动名称',
        cfgId: '活动配置ID',
        startTime: '开始时间',
        endTime: '结束时间',
        showEndTime: '展示结束时间',
        modifyUser: '最后修改人',
        status: '配置状态',
        gameIdCfg: '游戏ID配置',
        ruleImgHor: '横向规则图',
        ruleImgVer: '纵向规则图',
        whitelistCfg: '白名单',
        debugTimeOffset: '调试时间偏移',
        taskConfig: '任务配置',
        rewardConfig: '奖励配置',
        progressPrizes: '进度奖励配置',
        userTypes: '用户类型',
        userFilterCondition: '筛选用户条件',
      },
      edit: {
        CfgId: 0,
        isEdit: false,
        visible: false,
        item: newItem(),
        title: "新增",
        selectedGamesText: '',
        gamesSortDialogVisible: false,
        loading: false,
        importedUidCacheCount: 0,
        importedUidListCount: 0,
        importedUidList: [],
        userType: 2, // 2 所有用户
        registerDateRange: [],
        clientDB: new ClientTableData([], 10, filterMap),
        userTagIdOptions: [],
      },
      env: 'test',
      appId: parseInt(store.getters.appId) || -1,
      version: store.getters.version || 'V1',
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),
      libDate: $libDate,
      libShow: $libShow,
      libMoney: new MoneyShow([]),
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],

      appIdOptions: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: 'GP-BP测试1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        },
      ],
      // 奖励类型
      rewardTypes: [
        // { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        // { 'value': 3, 'label': '返水金' }
      ],

      // 投注金
      betScenes: [
        { 'value': 13, 'label': '【空投活动】任意游戏投注' },
      ],
      // 返水金
      rebateScenes: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
      ],

      userTypes: [
        { 'value': 1, 'label': '新增用户' },
        { 'value': 2, 'label': '所有用户' },
        { 'value': 3, 'label': '导入用户' },
        { 'value': 4, 'label': '筛选用户' },
        { 'value': 5, 'label': '用户标签' },
      ],

      // 公共游戏任务类型
      commonGameTaskTypes: [
        { 'value': 1, 'label': '「牌局」次数' },
        { 'value': 2, 'label': '「有效下注」总额' },
      ],

      defaultGameTaskTypes: [
        { 'value': 0, 'label': '未选择' },
      ],

      // 选定游戏后对应可选任务类型
      gameTaskTypes: [],

      // 任务类型游戏配置映射
      taskTypeGameMap: {
        3: { 'label': '「Pot」次数', 'gameIds': [ 22, 28, 29, 23 ]},
        100: { 'label': '「Tongits」获胜次数', 'gameIds': [ 22, 28, 29 ]},
        101: { 'label': '「Tongits Fight」获胜次数', 'gameIds': [ 22, 28, 29 ]},
        200: { 'label': '「Pusoy 其它玩家」获胜次数', 'gameIds': [ 21, 126 ]},
        201: { 'label': '「Pusoy 全垒打」获胜次数', 'gameIds': [ 21, 126 ]},
        202: { 'label': '「Pusoy NATURALS」获胜次数', 'gameIds': [ 21, 126 ]},
        300: { 'label': '「Lucky9 三张牌获得9点」次数', 'gameIds': [ 23 ]},
      },

      filterGameIds: [ 2031, 10002 ],

      filterText: '',

      // 用户标签类型
      userTagOptions: [
        { value: 2, label: '游戏强度', children: [
            { value: 20000, label: '游戏强度' },
          ]
        },
        { value: 5, label: 'Slots用户类型', children: [
            { value: 50001, label: 'Slots新增用户' },
            { value: 50002, label: 'Slots登录天数' },
            { value: 50008, label: 'Slots回归用户' },
          ]
        },
      ],
      // 游戏强度标签值
      userTagGameIntensityOptions: [
        { value: 0, label: '未选择' },
        { value: 1, label: '无感' },
        { value: 2, label: '尝试' },
        { value: 3, label: '常玩' },
        { value: 4, label: '核心' },
      ],

      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled',
      },

      GamesSorted: [
        {
          GameId: 1, Name: '测试游戏1', OrderNo: 1
        }
      ],

      // 已发奖金额
      sentRewardAmount : 0,

      // 道具数据列表
      propList: [],
      // 道具有效时长列表
      propTimeList: [],
      // 道具选项列表
      propOptions: {},
      // 道具类型选项列表
      propTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false }
      ],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false },
        { 'value': 365, 'label': '365天', disabled: false },
        { 'value': 0, 'label': '永久', disabled: false }
      ],

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
    }
  },

  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
    this.getGameAll()
    this.getPropList()
  },
  computed: {
    eggReward: {
      get() {

      }
    },
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    },
    showImportElement() {
      console.log('showImportElement this.edit.item.userTypes:', this.edit.item.userTypes)
      return this.edit.item.id > 0 && this.edit.item.userTypes.includes(3) // 3 导入用户
    },
    showUserFilterCondition() {
      return this.edit.item.userTypes.includes(4) // 4 筛选用户
    },
    showUserTagCondition() {
      return this.edit.item.userTypes.includes(5) // 5 用户标签
    },
    showUserTagGameIntensityCondition() {
      return this.edit.item.userTypes.includes(5) &&
        this.edit.item.userFilterCondition.userTagConfig.tagType === 2 && // 2=游戏强度
        this.edit.item.userFilterCondition.userTagConfig.tagId === 20000 // 20000=游戏强度
    },
  },
  methods: {
    makeContent(key, addData, delData, editData) {
      let str = ''
      if (addData.length > 0) {
        for (const i in addData) {
          for (const j in addData[i]) {
            if (addData[i][j].key === 'activity') {
              str += `\r\n上架-活动名称:【${addData[i][j].newVal.name}】`
            }
          }
        }
      }
      if (delData.length > 0) {
        for (const i in delData) {
          for (const j in delData[i]) {
            if (delData[i][j].key === 'activity') {
              if (str === '') {
                str += `下架-活动名称:【${delData[i][j].oldVal.name}】`
              } else {
                str += `\r\n下架-活动名称:【${delData[i][j].oldVal.name}】`
              }
            }
          }
          // for (const j in delData[i].Rows) {
          //   const rawValue = delData[i].Rows[j].newVal
          //   // 使用正则移除所有HTML标签i
          //   const decodedValue = this.decodeHtmlEntities(rawValue)
          //   const cleanValue = decodedValue.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\')
          //   const attrName = this.AttrNames[delData[i].Rows[j].key]
          //   if (attrName) {
          //     str += `\r\n删除:【${attrName}:${cleanValue}】`
          //   }
          // }
        }
      }
      if (editData.length > 0) {
        for (const i in editData) {
          console.log(editData[i].Head)
          if (str === '') {
            str += `活动名称:【${editData[i].Head['activity.name']}】`
          } else {
            str += `\r\n活动名称:【${editData[i].Head['activity.name']}】`
          }
          // for (const j in editData[i].Rows) {
          //   const rawValue = editData[i].Rows[j].newVal
          //   const decodedValue = this.decodeHtmlEntities(rawValue)
          //   const cleanValue = decodedValue.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\')
          //   const attrName = this.AttrNames[editData[i].Rows[j].key]
          //   if (attrName) {
          //     str += `\r\n修改:【${attrName}:${cleanValue}】`
          //   }
          // }
        }
      }
      return str
    },
    decodeHtmlEntities(str) {
      const txt = document.createElement('textarea')
      txt.innerHTML = str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec)
      }).replace(/&#x([\da-fA-F]+);/g, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16))
      })
      return txt.value
    },
    configCheck() {
      return true
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
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
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    handleUidImportedTableSizeChange(val) {
      this.edit.clientDB.GetPage().SetPageNum(val)
      this.getImportedUidList()
    },
    handleUidImportedTableCurrentChange(val) {
      this.edit.clientDB.GetPage().SetPageNo(val)
      this.getImportedUidList()
    },
    handleUidImportedTableSortChange(ob) {
      this.edit.clientDB.SortByProp(ob.prop, ob.order)
      this.getImportedUidList()
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    // 配置列表
    getList() {
      request({
        url: '/airdropconfig/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'EndTime', -1, "id")
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    onUserTypeChange(val) {
      this.$set(this.edit.item.userTypes, 0, val)
      console.log('onUserTypeChange this.edit.item.userTypes:', this.edit.item.userTypes)

      if (val !== 5) {
        this.edit.item.userFilterCondition.userTagConfig.tagType = 0
        this.edit.item.userFilterCondition.userTagConfig.tagId = 0
        this.edit.item.userFilterCondition.userTagConfig.tagValue = 0
      }
    },
    onTagTypeChange(tagType) {
      const tagOptions = this.userTagOptions.find(item => item.value === tagType)
      this.edit.userTagIdOptions = tagOptions && tagOptions.children || []
      if (this.edit.userTagIdOptions.length > 0) {
        this.edit.item.userFilterCondition.userTagConfig.tagId = this.edit.userTagIdOptions[0].value
      }
      this.edit.item.userFilterCondition.userTagConfig.tagValue = 0
    },
    onChangeEndTime(val) {
      if (val < this.edit.item.startTime) {
        Message.error('活动结束时间不能早于活动开始时间')
        this.edit.item.endTime = this.edit.item.startTime
      }
      this.edit.item.showEndTime = this.edit.item.endTime + 1000 * 60 * 60 * 24
    },
    changeStatus(id, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/update/status',
          method: 'post',
          data: {
            id: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            // $this.clientDB.UpdateData({ ID: id, Status: status })
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getPostData() {
      if (this.edit.item.name === '') {
        Message.error('请填写活动名称')
        return
      }
      for (let i = 0; i < this.edit.item.progressPrizes.length; i++) {
        const item = this.edit.item.progressPrizes[i]
        if (item.propType === 0 || item.propId === 0 || item.propNum === 0 || item.propNumMax === 0) {
          Message.error('请完善进度奖励配置')
          return
        }
        if (item.propNumMax % item.propNum !== 0) {
          Message.error('道具数量上限必须为道具数量的倍数')
          return
        }
      }
      if (!this.edit.item.rewardConfig.totalReward) {
        Message.error('请填写总奖励')
        return
      }
      if (this.edit.item.taskConfig.taskType === 0 || this.edit.item.taskConfig.taskValueRequired === 0 || this.edit.item.taskConfig.taskText === '') {
        Message.error('请完善任务配置')
        return
      }
      if (this.edit.item.userTypes[0] === 4) {
        if (!this.edit.registerDateRange || this.edit.registerDateRange.length === 0) {
          Message.error('请选择注册时间')
          return
        }
      }
      if (this.edit.item.userTypes[0] === 5) {
        if (this.edit.item.userFilterCondition.userTagConfig.tagType === 0) {
          Message.error('请选择标签类型')
          return
        }
        if (this.edit.item.userFilterCondition.userTagConfig.tagId === 0) {
          Message.error('请选择标签子类')
          return
        }
        if (this.edit.item.userFilterCondition.userTagConfig.tagId === 20000 && this.edit.item.userFilterCondition.userTagConfig.tagValue === 0) {
          Message.error('请选择游戏强度')
          return
        }
      }

      const copyItem = JSON.parse(JSON.stringify(this.edit.item))
      copyItem.rewardConfig.totalReward *= 1000
      copyItem.rewardConfig.userRewardLimit *= 1000
      copyItem.rewardConfig.rewardRanges.forEach(item => {
        item.minScore *= 1000
        item.maxScore *= 1000
        item.minCoefficient = parseInt(item.minCoefficient * 100)
        item.maxCoefficient = parseInt(item.maxCoefficient * 100)
      })
      for (let i = 0; i < copyItem.rewardConfig.rewardRanges.length; i++) {
        const item = copyItem.rewardConfig.rewardRanges[i]
        if (item.minCoefficient >= 100) {
          Message.error('奖励系数区间开始值必须小于1')
          return
        }
      }

      // 任务类型为有效投注时，任务值乘以1000
      if (copyItem.taskConfig.taskType === gameTaskTypeValidBet) {
        copyItem.taskConfig.taskValueRequired *= 1000

        for (let i = 0; i < copyItem.progressPrizes.length; i++) {
          const item = copyItem.progressPrizes[i]
          item.taskValueRequired *= 1000
        }
      }

      // 确保注册的结束时间是日期的最后一秒
      const registerEndTime = new Date(this.edit.registerDateRange[1]).setHours(23, 59, 59, 0)

      copyItem.userFilterCondition.registerTimeRange.min = this.edit.registerDateRange[0] / 1000
      copyItem.userFilterCondition.registerTimeRange.max = registerEndTime / 1000

      if (this.edit.item.whitelistCfg.appIdList.length === 0 && this.version === 'V2') {
        copyItem.whitelistCfg.appIdList = [this.appId]
      }

      const data = {}
      data.id = copyItem.id
      data.name = copyItem.name
      data.activityId = copyItem.activityId
      data.startTime = copyItem.startTime / 1000
      data.endTime = copyItem.endTime / 1000
      data.showEndTime = copyItem.showEndTime / 1000
      data.gameIdCfg = JSON.stringify(copyItem.gameIdCfg)
      data.ruleImgHor = JSON.stringify(copyItem.ruleImgHor)
      data.ruleImgVer = JSON.stringify(copyItem.ruleImgVer)
      data.whitelistCfg = JSON.stringify(copyItem.whitelistCfg)
      data.debugTimeOffset = copyItem.debugTimeOffset
      data.rewardConfig = JSON.stringify(copyItem.rewardConfig)
      data.taskConfig = JSON.stringify(copyItem.taskConfig)
      data.progressPrizes = JSON.stringify(copyItem.progressPrizes)
      data.userTypes = JSON.stringify(copyItem.userTypes)
      data.importedFilename = copyItem.importedFilename
      data.userFilterCondition = JSON.stringify(copyItem.userFilterCondition)
      return data
    },
    handleSave() {
      const data = this.getPostData()
      console.log('handleSave', data)
      if (data === null || data === undefined) {
        return
      }
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(data)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
          } else {
            $this.updateData(data)
          }
        })
      } else {
        this.createData(data)
      }
    },
    createData(data) {
      data['env'] = this.env
      request({
        url: '/airdropconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    updateData(data) {
      request({
        url: '/airdropconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    getSentRewardAmount() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: $this.edit.item.id,
          Path: '/activity/airdrop/sent/reward/amount'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.sentRewardAmount = response.Data / 1000
          console.log('getSentRewardAmount', $this.sentRewardAmount)
        }
      })
    },
    //************************ 道具配置 ************************
    getPropList() {
      const $this = this
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: $this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            //this.propTotal = objs.total
            this.propList = []
            this.propList = objs.list
          }
        } else {
          //this.propTotal = objs.total
          this.propList = []
        }
      })
    },
    updatePropOptions(propType, index) {
      this.propOptions[index] = []
      let currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        if (this.propList[i].item_type === 4) {
          console.log(this.propList[i])
        }
        if (this.propList[i].item_type === propType && this.propList[i].status === 1) {
          if (this.propList[i].item_type !== 2 && this.propList[i].item_type !== 4) {
            let expTime = this.propList[i].expire_time * 1000
            if (currTime < expTime) {
              let dataList = { 'value': this.propList[i].id, 'label': this.propList[i].item_name, disabled: false }
              this.propOptions[index].push(dataList)
            }

          } else {
            let dList = { 'value': this.propList[i].id, 'label': this.propList[i].item_name, disabled: false }
            this.propOptions[index].push(dList)
          }
        }
      }
    },
    showPropTimeOptions(itemId) {
      this.propTimeList = []
      for (let i = 0; i < this.propList.length; i++) {
        if (this.propList[i].id === itemId) {
          const time_type = JSON.parse(this.propList[i].time_type)
          for (let j = 0; j < time_type.length; j++) {
            let msg = time_type[j] + '天'
            if (time_type[j] === 0) {
              msg = '永久'
            }
            let dataList = { 'value': time_type[j], 'label': msg, disabled: false }
            this.propTimeList.push(dataList)
          }
          break
        }
      }
    },
    //************************ 道具配置 ************************
    //************************ 领奖配置 ************************
    addRewardRange() {
      const item = {
        minScore: 1,
        maxScore: 100,
        minCoefficient: 0.5,
        maxCoefficient: 1,
      }
      this.edit.item.rewardConfig.rewardRanges.push(item)
    },
    removeRewardRange(index) {
      this.edit.item.rewardConfig.rewardRanges.splice(index, 1)
    },
    addProgressPrize() {
      const item = {
        propId: 0,
        propType: 0,
        propNum: 0,
        propNumMax: 0,
        taskValueRequired: 1
      }
      this.edit.item.progressPrizes.push(item)
    },
    removeProgressPrize(index) {
      this.edit.item.progressPrizes.splice(index, 1)
    },
    //************************ 修改/添加弹框相关 ************************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.id)
        this.edit.visible = true
      }
    },
    handleEditDialogOpened() {
      this.edit.importedUidListCount = 0
      this.edit.importedUidList = []
      console.log('handleEditDialogOpened edit:' + this.edit.isEdit)
      if (this.edit.isEdit) {
        this.getSentRewardAmount()
        this.getImportedUidCacheCount()
        this.$refs.tree.setCheckedKeys(this.edit.item.gameIdCfg)
        this.updateGameTaskTypes(this.edit.item.gameIdCfg)
        // 查询已导入的用户id列表
        this.getImportedUidList()
      } else {
        this.sentRewardAmount = 0
        this.$refs.tree.setCheckedKeys([])
      }
    },
    initFormData(bEdit, ID) {
      console.log('ID:', ID)
      this.edit.isEdit = bEdit

      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          const item = JSON.parse(JSON.stringify(_data))
          item.startTime = item.startTime * 1000
          item.endTime = item.endTime * 1000
          item.showEndTime = item.showEndTime * 1000
          item.gameIdCfg = JSON.parse(item.gameIdCfg)
          item.whitelistCfg = JSON.parse(item.whitelistCfg)
          item.ruleImgHor = JSON.parse(item.ruleImgHor)
          item.ruleImgVer = JSON.parse(item.ruleImgVer)
          item.debugTimeOffset = item.debugTimeOffset || 0
          item.taskConfig = JSON.parse(item.taskConfig)
          item.rewardConfig = JSON.parse(item.rewardConfig)
          item.rewardConfig.totalReward = item.rewardConfig.totalReward / 1000
          if (item.rewardConfig.userRewardLimit) {
            item.rewardConfig.userRewardLimit = item.rewardConfig.userRewardLimit / 1000
          } else {
            item.rewardConfig['userRewardLimit'] = 0
          }
          item.progressPrizes = JSON.parse(item.progressPrizes)
          item.userTypes = JSON.parse(item.userTypes)

          if (item.userFilterCondition && item.userFilterCondition !== '{}' && item.userFilterCondition !== 'null') {
            item.userFilterCondition = JSON.parse(item.userFilterCondition)
            this.edit.registerDateRange = [item.userFilterCondition.registerTimeRange.min * 1000, item.userFilterCondition.registerTimeRange.max * 1000]
          } else {
            item.userFilterCondition = {
              registerTimeRange: {
                min: 0,
                max: 0
              },
              betTimesRange: {
                min: 0,
                max: 0
              },
            }
          }

          for (let i = 0; i < item.rewardConfig.rewardRanges.length; i++) {
            const rewardRange = item.rewardConfig.rewardRanges[i]
            rewardRange.minScore = rewardRange.minScore / 1000
            rewardRange.maxScore = rewardRange.maxScore / 1000
            rewardRange.minCoefficient = rewardRange.minCoefficient / 100
            rewardRange.maxCoefficient = rewardRange.maxCoefficient / 100
          }

          for (let i = 0; i < item.progressPrizes.length; i++) {
            const progressPrize = item.progressPrizes[i]
            this.updatePropOptions(progressPrize.propType, i)
          }

          // 任务类型为有效投注时，任务值除以1000
          if (item.taskConfig.taskType === gameTaskTypeValidBet) {
            item.taskConfig.taskValueRequired /= 1000

            for (let i = 0; i < item.progressPrizes.length; i++) {
              const prize = item.progressPrizes[i]
              prize.taskValueRequired /= 1000
            }
          }

          if (item.whitelistCfg.abTest === undefined) {
            item.whitelistCfg['abTest'] = {
              switch: false,
              bPercent: 0,
            }
          }

          this.edit.item = item
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }

          // 更新选中游戏的排序
          this.updateGamesSorted()

          this.edit.userType = item.userTypes[0]

          this.onTagTypeChange(item.userFilterCondition.userTagConfig.tagType)

          console.log(this.edit.item.gameIdCfg)
        }
      }
    },
    handleAdd() {
      this.gameTaskTypes = this.defaultGameTaskTypes
      this.edit.selectedGamesText = ''
      this.edit.importedUidCacheCount = 0
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
      this.edit.userType = this.edit.item.userTypes[0]
      this.edit.registerDateRange = []
      console.log(this.edit.item)
    },
    //************************ 修改/添加弹框相关 ************************
    //************************ 导入用户列表 ************************
    getImportedUidCacheCount() {
      if (this.edit.item.id === 0) {
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: $this.edit.item.id,
          Path: '/activity/airdrop/uid/import/count'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.edit.importedUidCacheCount = response.Data
          console.log('getImportedUidCacheCount', $this.edit.importedUidCacheCount)
        }
      })
    },
    delImportedUid() {
      const $this = this
      this.$confirm('确定要重置已导入的用户id吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/airdropconfig/uids/imported/delete',
          method: 'post',
          data: {
            Env: $this.env,
            ActCfgId: $this.edit.item.id,
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('已重置导入的用户id！')
            $this.edit.importedUidCacheCount = 0
            $this.edit.importedUidListCount = 0
            $this.edit.importedUidList = []
            console.log('delImportedUid', $this.edit.importedUidCacheCount)
          }
        })
      })
    },
    getImportedUidList() {
      if (!this.edit.item.id) {
        return
      }

      const page = this.edit.clientDB.GetPage().GetCurrentPage()
      const pageSize = this.edit.clientDB.GetPage().GetPageNum()

      const $this = this
      request({
        url: '/airdropconfig/uids/imported',
        method: 'get',
        data: {
          ActCfgId: $this.edit.item.id,
          Page: page,
          PageSize: pageSize
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.edit.importedUidList = response.Data.list
          $this.edit.importedUidListCount = response.Data.total
          console.log('getImportedUidList', $this.edit.importedUidList)
        }
      })
    },
    //************************ 导入用户列表 ************************
    //************************ 规则图片相关 ************************
    addRuleImage(type) {
      console.log('addRuleImage type:', type)
      if (type === 'Hor') {
        this.edit.item.RuleImgHor.push('')
      } else {
        this.edit.item.RuleImgVer.push('')
      }
    },
    removeRuleImage(index, type) {
      console.log('removeRuleImage index:', index, 'type:', type)
      if (type === 'Hor') {
        this.edit.item.RuleImgHor.splice(index, 1)
      } else {
        this.edit.item.RuleImgVer.splice(index, 1)
      }
    },
    //************************ 规则图片相关 ************************
    //************************ 游戏列表相关 ************************
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: {status : 2}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1 || this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }

            const game = {Gid: obj.Gid, Name: obj.Name, Description: obj.Description}
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          for (const key in data) {
            const games = data[key]
            const cty = {id: 'p-' + key, label: categories[key], children: []}

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({id: game.Gid, label: game.Name})
            }
            this.treeData.push(cty)
          }

          console.log(data)
        }
      })
    },
    updateGamesSorted() {
      this.GamesSorted = []
      this.edit.selectedGamesText = ''
      if (this.edit.item.gameIdCfg === undefined || this.edit.item.gameIdCfg.length === 0) {
        return
      }

      const gameTextList = []

      for (let i = 0; i < this.edit.item.gameIdCfg.length; i++) {
        const gameId = this.edit.item.gameIdCfg[i]
        let name = ''
        for (let j = 0; j < this.treeData.length; j++) {
          const cty = this.treeData[j]
          for (let k = 0; k < cty.children.length; k++) {
            const game = cty.children[k]
            if (game.id === gameId) {
              name = game.label
              break
            }
          }
        }
        this.GamesSorted.push({GameId: gameId, Name: name, OrderNo: i+1})
        gameTextList.push(name + '[' + gameId + ']')
      }

      this.edit.selectedGamesText = gameTextList.join(' ')
    },
    updateGameTaskTypes(gameIds) {
      console.log('updateGameTaskTypes', gameIds)
      if (gameIds.length === 0) {
        this.gameTaskTypes = this.defaultGameTaskTypes
        return
      }

      // 将公共任务类型拷贝到 gameTaskTypes
      const gameTaskTypes = JSON.parse(JSON.stringify(this.commonGameTaskTypes))

      // 遍历 this.taskTypeGameMap 获取游戏共有的任务类型
      for (const taskType in this.taskTypeGameMap) {
        const cfg = this.taskTypeGameMap[taskType]
        if (gameIds.every(gameId => cfg.gameIds.includes(gameId))) {
          gameTaskTypes.push({ label: cfg.label, value: parseInt(taskType)})
        }
      }

      this.gameTaskTypes = gameTaskTypes
    },
    handleGameCheckChange(data, checked, indeterminate) {
      console.log('handleGameCheckChange', data, checked, indeterminate)
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        console.log('handleGameCheckChange', 'Slot/Poker/Casino')
        return
      }

      const idIndex = this.edit.item.gameIdCfg.indexOf(data.id)
      if (checked) {
        if (idIndex < 0) {
          this.edit.item.gameIdCfg.push(data.id)
        }
      } else {
        if (idIndex >= 0) {
          this.edit.item.gameIdCfg.splice(idIndex, 1)
        }
      }

      // 更新选中游戏的排序
      this.updateGamesSorted()

      // 更新游戏任务类型
      this.updateGameTaskTypes(this.edit.item.gameIdCfg)

      console.log('this.edit.item.gameIdCfg:', this.edit.item.gameIdCfg)
    },
    showGamesSortDialog() {
      this.edit.gamesSortDialogVisible = true
    },
    saveGamesSort() {
      this.edit.gamesSortDialogVisible = false
      // 根据排序编号重新排序
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
      // 保存排序
      this.edit.item.gameIdCfg = []
      this.GamesSorted.forEach(item => {
        this.edit.item.gameIdCfg.push(item.GameId)
      })
    },
    onOrderNoChange() {
      this.GamesSorted.sort((a, b) => {
        return a.OrderNo - b.OrderNo
      })
    },
    //************************ 游戏列表相关 ************************
    //************************ 白名单相关 ************************
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.edit.item.whitelistCfg.appIdList)
    },
    onSiteIdOptionsChange() {
      console.log('onSiteIdOptionsChange', this.edit.item.whitelistCfg.siteIdList)
    },
    //************************ 白名单相关 ************************
    //************************ 上传文件相关 ************************
    handleBeforeUpload(file) {
      const isCsv = file.type === 'text/csv'
      const isXls = file.type === 'xls'
      const isXlsx = file.type === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      const isValidType = isCsv || isXls || isXlsx

      console.log('file.type:', file.type, ' isValidType:', isValidType)

      if (!isValidType) {
        this.$message.error('上传的文件只能是 text/csv 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传的文件大小不能超过10MB!')
        return false
      }
      return true
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      console.log(file)
    },
    submitUpload() {
      if (this.edit.item.showEndTime < new Date().getTime()) {
        this.$message.error('活动的展示结束时间不能小于当前时间，否则导入的用户id无法生效！')
        return
      }
      this.$refs.upload.submit()
    },
    changeUploadLoadingText(process, subTime) {
      this.edit.loadingText = loadingText + '进度：' + process + '%...用时：' + subTime + 's'
    },
    importData(uploadedFilename, ticker, startTime) {
      const $this = this
      request({
        url: '/airdropconfig/uids/import',
        method: 'post',
        timeout: 90000,
        data: {
          Env: this.env,
          ActCfgId: $this.edit.item.id,
          Filename: uploadedFilename
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.getImportedUidCacheCount()
          $this.$message.success('上传成功，新导入的数量为：' + response.Data.imported)
          if ($this.edit.item.id === 0) {
            $this.edit.importedUidCacheCount = response.Data.imported
          } else {
            $this.getImportedUidCacheCount()
            $this.getImportedUidList()
          }
        }
        $this.$refs.upload.clearFiles()
        $this.edit.loading = false

        clearInterval(ticker)
        const subTime = (new Date().getTime() - startTime.getTime()) / 1000
        this.changeUploadLoadingText(100, subTime)
        console.log('导入数量：' + response.Data.imported + '，用时：' + subTime + 's')
      }).catch((reason) => {
        console.log('取消导入：', reason)
        clearInterval(ticker)
        $this.edit.loading = false
      })
    },
    handleUploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      if (response.RetCode === 0) {
        const uploadedFilename = response.Data
        console.log('upload success:', uploadedFilename)
        this.edit.item.importedFilename = uploadedFilename

        this.edit.loading = true
        const startTime = new Date()
        let n = Math.ceil(Math.random() * 10)
        const ticker = setInterval(() => {
          n += Math.ceil(Math.random() * 10)
          if (n > 100) {
            n = 99
          }
          const subTime = (new Date().getTime() - startTime.getTime()) / 1000
          this.changeUploadLoadingText(n, subTime)
          n === 99 && clearInterval(ticker)
        }, 1000)

        this.importData(uploadedFilename, ticker, startTime)
      } else {
        this.$message.error(response.Data)
      }
    }
    //************************ 上传文件相关 ************************
  }
}
</script>

<style>

</style>
