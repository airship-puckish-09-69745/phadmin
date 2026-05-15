<template>
  <el-dialog
    :title="isEdit ? '编辑活动' : '新增活动'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    append-to-body
    @close="handleDialogClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- ========== 活动配置 ========== -->
      <el-tab-pane label="活动配置" name="activity">
        <el-form ref="activityForm" :model="item" label-width="180px" size="small">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="活动名称" required>
                <el-input v-model="item.activityName" placeholder="请输入活动名称" style="max-width: 400px"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="活动开关">
                <el-switch v-model="item.isOpen" :active-value="true" :inactive-value="false"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="item.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="结束时间" required>
                <el-date-picker
                  v-model="item.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="timestamp"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="时间偏移">
                <el-input v-model.number="item.debugTimeOffset" placeholder="请输入" style="max-width: 200px"/>
              </el-form-item>
            </el-col>
            <!-- 站点白名单 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="站点白名单">
                <SiteSelect
                  v-model="item.whitelistCfg.siteIdList"
                  multiple
                  placeholder="请选择"
                  style="width: 100%; max-width: 400px"
                />
              </el-form-item>
            </el-col>

            <!-- 宝箱配置表格 -->
            <el-col :span="24">
              <el-form-item label="道具配置">
                <el-table
                  :data="[editItem.propPools]"
                  border
                  size="small"
                  style="width: 100%"
                >
                  <el-table-column label="道具类型" min-width="140">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propType"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                        @change="handlePropTypeChange(scope.row)"
                      >
                        <el-option
                          v-for="item in propTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="道具名称" min-width="140">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propId"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                        @change="handlePropNameChange(scope.row)"
                      >
                        <el-option
                          v-for="item in getPropOptionsByType(scope.row.propType)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="可用时间" min-width="120">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.propTime"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in propDayTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="道具数量" min-width="100">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.propNum" placeholder="数量" size="mini"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 底部按钮 -->
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
