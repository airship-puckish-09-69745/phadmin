<template>
  <div>

    <span>{{headTitle}}</span>
    <el-tooltip class="item" effect="dark" placement="top">
      <i class="el-icon-question" style="font-size: 14px; vertical-align: middle;"></i>
      <div slot="content">
        <p>{{headTip}}</p>

      </div>
    </el-tooltip>

  </div>
</template>

<style scoped>

</style>

<script>
import { Message } from 'element-ui'
import { $libDate } from '@/utils/common'

export default {
  name: 'showTip',
  components: { },
  props: {
    headTitle: {
      type: String,
      default: function() {
        return ''
      }
    },
    headTip: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      ConversionColorMap: {}
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    }
  },
  created() {
  },
  methods: {
    initData(val) {
      console.log('==========', val)
    },
  }

}
</script>
