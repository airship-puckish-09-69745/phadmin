<template>
  <div class="lang-input">
    <el-row>
      <el-col :span="2">英文:</el-col>
      <el-col :span="16">
        <el-input v-model="langCfg['en']" @change="change" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">印地:</el-col>
      <el-col :span="16">
        <el-input v-model="langCfg['hi']" @change="change" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'LangInput',
  model: {
    prop: 'lang',
    event: 'cc'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['lang'],
  data() {
    return {
      langCfg: {
        en: '',
        hi: ''
      }
    }
  },
  watch: { // 监听值变化：map值
    lang: function() {
      if (this.lang === '') {
        this.initCfg()
      } else {
        this.decodeLang()
      }
    }
  },
  mounted() {
    if (this.lang === '') {
      this.initCfg()
    } else {
      this.decodeLang()
    }
  },
  methods: {
    initCfg() {
      this.langCfg = {
        en: '',
        hi: ''
      }
    },
    decodeLang() {
      const lang = JSON.parse(this.lang)
      // eslint-disable-next-line no-prototype-builtins
      this.langCfg.en = lang.hasOwnProperty('en') ? lang.en : ''
      // eslint-disable-next-line no-prototype-builtins
      this.langCfg.hi = lang.hasOwnProperty('hi') ? lang.hi : ''
    },
    encodeLang() {
      this.lang = JSON.stringify(this.langCfg)
      this.$emit('cc', this.lang)
    },
    change() {
      console.log('lang ', this.langCfg)
      this.encodeLang()
    }
  }
}
</script>
