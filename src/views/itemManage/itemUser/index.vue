<template>
  <div class="app-container">
    <el-row>
      <h2 style="margin-bottom: 20px;">新比赛门票使用說明</h2>
    </el-row>

    <!-- 步驟1: 首先在后台创建门票 -->
    <el-row class="step-section">
      <div class="step-header">
        <span class="step-number">1:</span>
        <span class="step-title">首先在后台创建门票, 新门票需要勾选APPID</span>
      </div>
      
      <el-card class="form-card" shadow="never">
        <div slot="header" class="card-header">
          <span class="section-title">-道具信息-</span>
        </div>
        <el-form :model="form" label-width="120px" size="small">
          <el-form-item label="* 道具名称:" :required="true">
            <el-input
              v-model="form.itemName"
              placeholder="请填写道具名称"
              style="width: 300px;"
            />
          </el-form-item>

          <el-form-item label="* 后台名称:" :required="true">
            <el-input
              v-model="form.showName"
              placeholder="请填写后台名称"
              style="width: 300px;"
            />
          </el-form-item>

          <el-form-item label="* 道具价值:" :required="true">
            <el-input
              v-model.number="form.itemCost"
              type="number"
              placeholder="请填写道具价值"
              style="width: 300px;"
            />
          </el-form-item>

          <el-form-item label="* 道具描述:" :required="true">
            <el-input
              v-model="form.describe"
              type="textarea"
              :rows="3"
              placeholder="请填写道具描述"
              style="width: 400px;"
            />
          </el-form-item>

          <el-form-item label="* 道具类别:" :required="true">
            <el-select
              v-model="form.itemType"
              placeholder="请选择道具类别"
              style="width: 300px;"
            >
              <el-option
                v-for="item in ITEM_TYPE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="isNewTicketProp(form.itemType)"
            label="* APPID"
            :required="true"
          >
            <el-select
              v-model="form.appId"
              placeholder="请选择APPID"
              style="width: 300px;"
            >
              <el-option
                v-for="item in APPID_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="排序:">
            <el-input
              v-model.number="form.sort"
              type="number"
              placeholder="0"
              style="width: 300px;"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>

    <!-- 步骤2: 申请门票配置权益 -->
    <el-row class="step-section">
      <div class="step-header">
        <span class="step-number">2:</span>
        <span class="step-title">申请门票配置权益</span>
        <el-tag type="success" size="small" class="highlight-tag">【仅1000003 1000005 需要申请】</el-tag>
      </div>
      <div class="step-content">
        <p>为每一个创建好的门票向平台方申请门票权益配置,以配置的每一个门票为单位,提供门票配置ID给平台方。得到门票权益配置再提供给技术。</p>
      </div>
    </el-row>


     <!-- 步骤3: 配置门票权益 -->
     <el-row class="step-section">
      <div class="step-header">
        <span class="step-number">3:</span>
        <span class="step-title">配置门票权益</span>
      </div>
      <div class="step-content">
        <p>开发需要根据门票配置ID、门票权益配置ID。在prop.js中配置对应的门票权益配置。</p>
      </div>
    </el-row>

    <!-- 步骤4: 门票发布 -->
    <el-row class="step-section">
      <div class="step-header">
        <span class="step-number">4:</span>
        <span class="step-title">门票发布</span>
      </div>
      <div class="step-content">
        <p>开发把代码发布后运营需要在道具后台将新配置好的门票发布到线上。</p>
      </div>
    </el-row>


     
  </div>
</template>

<script>
import { ITEM_TYPE_OPTIONS, APPID_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import { IsNewTicketProp } from '@/utils/prop'

export default {
  name: 'ItemUserGuide',
  data() {
    return {
      ITEM_TYPE_OPTIONS,
      APPID_OPTIONS,
      PROP_TYPE_OPTIONS,
      form: {
        itemName: '',
        showName: '',
        itemCost: 0,
        describe: '',
        itemType: '',
        appId: '',
        sort: 0
      }
    }
  },
  methods: {
    isNewTicketProp(itemType) {
      return IsNewTicketProp(itemType)
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

h2 {
  color: #303133;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.step-section {
  margin-bottom: 24px;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.step-number {
  display: inline-block;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  margin-right: 4px;
}

.highlight-tag {
  margin-left: 0;
  font-size: 14px;
}

.step-content {
  padding: 16px 20px;
  background-color: #fff;
  border-left: 4px solid #409eff;
  border-radius: 4px;
  margin-left: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step-content p {
  margin: 0;
  line-height: 1.8;
  color: #606266;
  font-size: 14px;
}

.form-card {
  margin-left: 40px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.card-header {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

.section-title {
  font-weight: 500;
}

::v-deep .el-card__header {
  padding: 12px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
}

::v-deep .el-card__body {
  padding: 20px;
}

::v-deep .el-form-item {
  margin-bottom: 18px;
}

::v-deep .el-form-item__label {
  font-weight: 500;
  color: #606266;
}
</style>

