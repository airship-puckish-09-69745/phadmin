<template>
  <div class="search-form-container">
    <el-form 
      :model="form" 
      label-width="100px" 
      :inline="true" 
      size="mini"
      class="search-form"
    >
      <el-form-item label="游戏：" :required="true">
        <el-select 
          v-model="form.gameId" 
          placeholder="请选择" 
          size="mini"
        >
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in gameCfgs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="类型" :required="true">
        <el-select 
          v-model="form.repeatType" 
          placeholder="请选择" 
          size="mini"
        >
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
        <el-select 
          v-model="form.status" 
          placeholder="请选择" 
          size="mini"
        >
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in statusCfgs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="赛制" :required="true">
        <el-select 
          v-model="form.csId" 
          placeholder="请选择" 
          size="mini"
          filterable
        >
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
        <el-select 
          v-model="form.appId" 
          placeholder="请选择" 
          size="mini"
        >
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in APPID_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item class="search-actions">
        <el-button 
          size="mini" 
          @click="resetSearch"
        >
          重置查询條件
        </el-button>
        <el-button 
          type="primary" 
          size="mini" 
          @click="handleSearch"
          :loading="loading"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { APPID_OPTIONS } from '@/utils/options'

export default {
  name: 'SearchForm',
  props: {
    form: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    gameCfgs: {
      type: Array,
      default: () => []
    },
    repeatCfgs: {
      type: Array,
      default: () => []
    },
    statusCfgs: {
      type: Array,
      default: () => []
    },
    csCfgs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      APPID_OPTIONS
    }
  },
  methods: {
    /**
     * 重置搜索條件
     */
    resetSearch() {
      this.$emit('reset-search')
    },
    
    /**
     * 執行搜索
     */
    handleSearch() {
      this.$emit('search')
    }
  }
}
</script>

<style scoped>
.search-form-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.search-actions {
  margin-left: auto;
}

.el-form-item {
  margin-bottom: 0;
}

.el-button {
  margin-left: 0;
  margin-right: 8px;
}

.el-button:last-child {
  margin-right: 0;
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-actions {
    margin-left: 0;
    text-align: center;
  }
}
</style>
