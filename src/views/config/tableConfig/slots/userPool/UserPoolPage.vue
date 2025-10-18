<template>
  <div class="page-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-tabs type="border-card" value="userPoolConfig" @tab-click="onShowTab">
          <el-tab-pane label="个人奖池配置" name="userPoolConfig">
            <user-pool-cfg/>
          </el-tab-pane>
          <el-tab-pane label="发放金额" name="userPoolData">
            <user-pool-data/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!--    -->
  </div>
</template>
<script>

import UserPoolCfg from '@/views/config/tableConfig/slots/userPool/UserPoolCfg.vue';
import UserPoolData from '@/views/config/tableConfig/slots/userPool/UserPoolData.vue';

export default {
  components: {UserPoolData, UserPoolCfg},
  data() {
    return {
      activeTab: 'userPoolConfig'
    }
  },
  methods: {
    onShowTab(tab) {
      this.activeTab = tab.name
    }
  }
}
</script>

<style scoped>

</style>
