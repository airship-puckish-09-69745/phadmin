# Pusoy 比赛配置管理系统 - 项目结构说明

## 项目概述

这是一个基于 Vue.js 2.x 和 Element UI 的比赛配置管理系统，专门用于管理 Pusoy 游戏的比赛配置。系统采用模块化设计，通过 Mixin 模式实现代码复用和逻辑分离。


## 项目结构

```
pusoy/
├── components/                    # 组件目录
│   ├── AppInfoConfig.vue         # APP信息配置组件
│   ├── DataCenterReportConfig.vue # 数据中心上报配置组件
│   ├── DataTable.vue             # 数据表格组件
│   ├── EditDialog.vue            # 编辑对话框组件
│   ├── GuideRecommendationConfig.vue # 推荐方案配置组件
│   ├── LoopConfig.vue            # 循环配置组件
│   ├── RebuyConditionConfig.vue  # 重买条件配置组件
│   ├── RewardConfig.vue          # 奖励配置组件
│   ├── SearchForm.vue            # 搜索表单组件
│   └── SignUpConditionConfig.vue # 报名条件配置组件
├── mixins/                       # Mixin 目录
│   ├── matchActionMixin.js       # 比赛操作相关逻辑
│   ├── matchDataMixin.js         # 数据获取相关逻辑
│   ├── matchFormMixin.js         # 表单处理相关逻辑
│   └── matchUtilsMixin.js        # 工具方法相关逻辑
├── utils/                        # 工具函数目录
│   ├── matchConfigConstants.js   # 配置常量定义
│   └── matchConfigUtils.js       # 工具函数
├── matchPusoyConfigOptimized.vue # 主组件
└── PROJECT_STRUCTURE.md          # 项目结构说明文档
```

## 核心组件说明

### 1. 主组件 (matchPusoyConfigOptimized.vue)

**功能**: 系统的入口组件，负责整体布局和组件协调

**主要特性**:
- 集成所有子组件和 Mixin
- 管理全局状态和数据流
- 处理组件间的事件通信
- 提供 Publish 组件集成

**核心数据结构**:
```javascript
data() {
  return {
    // 表格数据
    tableData: [],           // 比赛列表数据
    total: 0,               // 总记录数
    page: 1,                // 当前页码
    limit: 100,             // 每页显示数量
    loading: false,         // 加载状态
    
    // 搜索表单
    searchForm: {
      gameId: 2033,         // 游戏ID
      status: -1,           // 状态筛选
      csId: -1,             // 赛制ID
      repeatType: -1,       // 循环类型
      appId: -1             // APP ID
    },
    
    // 编辑表单
    editForm: {
      visable: false,       // 对话框显示状态
      title: '',           // 对话框标题
      isAdd: false,        // 是否为新增模式
      data: {},            // 表单数据
      // ... 其他表单字段
    }
  }
}
```

### 2. 组件层 (components/)

#### SearchForm.vue - 搜索表单组件
**功能**: 提供比赛配置的搜索和筛选功能
**主要字段**:
- 游戏选择
- 状态筛选
- 赛制筛选
- 循环类型筛选
- APP ID 筛选

#### DataTable.vue - 数据表格组件
**功能**: 显示比赛配置列表，提供操作按钮
**主要功能**:
- 分页显示比赛数据
- 提供编辑、删除、复制、状态更新等操作
- 支持批量操作（复制全部、下架全部等）
- 集成开发工具功能

#### EditDialog.vue - 编辑对话框组件
**功能**: 比赛配置的详细编辑界面
**包含子组件**:
- AppInfoConfig: APP信息配置
- LoopConfig: 循环配置
- RewardConfig: 奖励配置
- GuideRecommendationConfig: 推荐方案配置
- DataCenterReportConfig: 数据中心上报配置

#### 其他配置组件
- **AppInfoConfig.vue**: 管理APP信息相关配置
- **LoopConfig.vue**: 管理比赛循环相关配置
- **RewardConfig.vue**: 管理奖励相关配置
- **SignUpConditionConfig.vue**: 管理报名条件配置
- **RebuyConditionConfig.vue**: 管理重买条件配置
- **GuideRecommendationConfig.vue**: 管理推荐方案配置
- **DataCenterReportConfig.vue**: 管理数据中心上报配置

### 3. Mixin 层 (mixins/)

#### matchDataMixin.js - 数据获取 Mixin
**职责**: 负责所有与数据获取相关的逻辑
**主要方法**:
- `getMatchList(env)`: 获取比赛列表
- `getCsCfgs(env)`: 获取赛制配置
- `getPrizeTemplateCfg(env)`: 获取奖品模板配置
- `getGuideCfgs()`: 获取推荐配置
- `getMatchProps(env)`: 获取比赛道具配置
- `filterMatchListByAppId(appInfo)`: 根据APP ID过滤比赛列表

#### matchFormMixin.js - 表单处理 Mixin
**职责**: 负责表单相关的所有逻辑
**主要方法**:
- `showEditDialog(row, isAdd)`: 显示编辑对话框
- `closeEditDialog()`: 关闭编辑对话框
- `resetEditForm()`: 重置编辑表单
- `saveMatch()`: 保存比赛配置
- `configCheck()`: 配置检查
- 各种表单验证方法

#### matchActionMixin.js - 操作处理 Mixin
**职责**: 负责表格操作相关的逻辑
**主要方法**:
- `handleEdit(row)`: 处理编辑操作
- `handleDelete(id)`: 处理删除操作
- `handleCopy(id)`: 处理复制操作
- `handleUpdateStatus(id, status)`: 处理状态更新
- `handleAddMatch()`: 处理新增比赛
- 各种批量操作方法

#### matchUtilsMixin.js - 工具方法 Mixin
**职责**: 提供各种工具方法和事件处理
**主要方法**:
- `filterCsCfgsByGameId(gameId)`: 根据游戏ID过滤赛制配置
- `handleAppIdChange()`: 处理APP ID变更
- `handleGameChange()`: 处理游戏变更
- `handleCsChange()`: 处理赛制变更
- 各种表单事件处理方法
- 数据解析和格式化方法

### 4. 工具层 (utils/)

#### matchConfigConstants.js - 配置常量
**功能**: 定义系统中使用的所有常量配置
**主要常量**:
- `GAME_CONFIGS`: 游戏配置
- `STATUS_CONFIGS`: 状态配置
- `REPEAT_TYPE_CONFIGS`: 重复类型配置
- `SIGN_UP_TYPE_CONFIGS`: 报名类型配置
- `REWARD_TYPE_CONFIGS`: 奖励类型配置
- `PRIZE_MODEL_CONFIGS`: 奖品模式配置
- 等等...

#### matchConfigUtils.js - 工具函数
**功能**: 提供各种工具函数和初始化方法
**主要函数**:
- `initEditFormData()`: 初始化编辑表单数据
- `initRankRewards()`: 初始化排名奖励数据
- `initLoopDetail()`: 初始化循环详情数据
- `initAppInfo()`: 初始化APP信息数据
- `formatDateTime()`: 格式化日期时间
- 各种数据验证和转换函数

## 数据流架构

```
用户操作 → 组件事件 → Mixin方法 → API调用 → 数据更新 → 视图刷新
    ↓
SearchForm → handleSearch → getMatchList → tableData更新 → DataTable刷新
    ↓
DataTable → handleEdit → showEditDialog → editForm更新 → EditDialog显示
    ↓
EditDialog → handleSave → saveMatch → API保存 → 列表刷新
```

## 核心功能模块

### 1. 比赛配置管理
- **列表展示**: 分页显示所有比赛配置
- **搜索筛选**: 支持多维度搜索和筛选
- **CRUD操作**: 创建、读取、更新、删除比赛配置
- **状态管理**: 启用/禁用比赛配置

### 2. 表单配置
- **基本信息**: 比赛名称、游戏选择、赛制选择等
- **时间配置**: 开赛时间、结束时间、循环设置等
- **报名配置**: 报名方式、报名费用、报名条件等
- **奖励配置**: 排名奖励、动态奖池、道具奖励等
- **高级配置**: 白名单、推荐方案、数据中心上报等

### 3. 数据验证
- **前端验证**: 表单字段验证、数据类型验证
- **业务验证**: 奖励配置验证、时间逻辑验证
- **API验证**: 后端数据验证和错误处理

### 4. 批量操作
- **批量复制**: 复制多个比赛配置
- **批量下架**: 下架多个比赛配置
- **批量删除**: 删除多个比赛配置

## API 接口

### 主要接口
- `GET /matchconfig/match/config/list`: 获取比赛列表
- `POST /matchconfig/match/config/create`: 创建比赛配置
- `POST /matchconfig/match/config/status`: 更新比赛状态
- `GET /matchconfig/cs/cfg/list`: 获取赛制配置
- `GET /matchconfig/prize/template/cfg/list`: 获取奖品模板配置

## 开发规范

### 1. 代码组织
- 使用 Mixin 模式分离关注点
- 组件职责单一，功能明确
- 常量统一管理，避免硬编码

### 2. 命名规范
- 组件名使用 PascalCase
- 方法名使用 camelCase
- 常量名使用 UPPER_SNAKE_CASE

### 3. 事件通信
- 父子组件通过 props 和 events 通信
- 复杂状态通过 Vuex 管理
- 使用 $emit 触发自定义事件

### 4. 错误处理
- API 调用统一错误处理
- 表单验证错误友好提示
- 加载状态和错误状态管理

## 维护说明

- 新增功能时优先考虑在现有 Mixin 中扩展
- 修改配置常量时注意向后兼容性
- 新增组件时遵循现有的组件结构
- 定期清理未使用的代码和依赖

---

*本文档最后更新时间: 2024年*
