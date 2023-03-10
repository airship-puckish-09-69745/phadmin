<template>
  <el-form-item :label="label" :required="isRequire" :label-width="labelWidth">
    <el-input v-model.number="amount" :readonly="isRead" :disabled="isDisable" />
  </el-form-item>
</template>
<script>

export default {
  name: 'MoneyInput',
  model: {
    prop: 'money',
    event: 'cc'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    money: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: '金额'
    },
    isRequire: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isDisable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    amount: {
      get: function() {
        return this.money / 1000
      },
      set: function(newValue) {
        this.money = newValue * 1000
        this.$emit('cc', this.money)
      }
    }
  }
}
</script>
