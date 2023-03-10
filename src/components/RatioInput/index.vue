<template>
  <el-input v-model="rate" @blur="onRate" v-if="isSample"/>
  <el-form-item v-else :label="label" :required="isRequire" :label-width="labelWidth">
    <el-input v-model="rate" @blur="onRate" size="small" />
    <div class="el-form-item--small" v-if="tips">
      <small>{{ tips }}</small>
    </div>
  </el-form-item>
</template>
<script>

export default {
  name: 'RatioInput',
  model: {
    prop: 'ratio',
    event: 'cc'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    ratio: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: '比例'
    },
    isRequire: {
      type: Boolean,
      default: false
    },
    isSample: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    }
  },
  watch: {
    ratio: function(newVal, oldVal) {
      // console.log('ratio new', newVal, ' old ', oldVal)
      // this.updateRate()
      this.rate = this.ratio / 100
    }
  },
  created() {
    this.rate = this.ratio / 100
  },
  data() {
    return {
      rate: 0
    }
  },
  methods: {
    onRate() {
      const val = parseFloat(this.rate)

      if (val>=0) {
        this.ratio = parseInt(val * 100)
      }

      console.log('ratio result', this.ratio)
      this.$emit('cc', this.ratio)
    }
  }
}
</script>
