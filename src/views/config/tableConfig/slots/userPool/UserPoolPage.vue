<template>
  <div class="page-container">
    <user-pool-cfg/>
    <hr>
    <user-pool-data/>
  </div>
</template>
<script>

import UserPoolCfg from '@/views/config/tableConfig/slots/userPool/UserPoolCfg.vue';
import UserPoolData from '@/views/config/tableConfig/slots/userPool/UserPoolData.vue';

export default {
  components: {UserPoolData, UserPoolCfg}
}
</script>

<style scoped>

</style>
