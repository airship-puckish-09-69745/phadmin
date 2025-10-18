<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="信任分测试" name="first">
        <TrustUser />
      </el-tab-pane>
      <el-tab-pane label="用户标签" name="second">
        <TagUser />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
import TrustUser from './testTools/trust.vue'
import TagUser from './testTools/tag.vue'
export default {
  components: { TrustUser, TagUser },
  name: 'TestTools',
  data() {
    return {
      activeName: 'first',
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    }
  }
}
</script>
