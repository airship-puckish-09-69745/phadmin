<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm1" :model="cfg" label-width="200px">
          <h3 style="text-align:center;">Scatter 配置</h3>
          <el-form-item label="是否开启scatter">
            <el-switch
              style="display: block"
              v-model="cfg.ScatterConfig.Enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>

          <el-form-item label="最低每轴出现的次数">
            <el-input v-model.number="cfg.ScatterConfig.PerReelsMinNumber" />
          </el-form-item>

          <el-form-item label="最低出现多少轴才中scatter">
            <el-input v-model.number="cfg.ScatterConfig.MinReels" />
          </el-form-item>

          <el-form-item label="小游戏次数">
            <el-input v-model.number="cfg.ScatterConfig.FreeGameTimes" />
          </el-form-item>

          <h3 style="text-align:center;">Wild 概率配置</h3>
          <ratio-input v-model="cfg.WildConfig.WildCol1HitRatio" label="Wild轴1(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol2HitRatio" label="Wild轴2(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol3HitRatio" label="Wild轴3(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol4HitRatio" label="Wild轴4(%)" ></ratio-input>
          <ratio-input v-model="cfg.WildConfig.WildCol5HitRatio" label="Wild轴5(%)" ></ratio-input>


        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsFirecatterPattern',
  components: { RatioInput, Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    SymbolList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  watch:{
    'SymbolList': {
      deep: true,
      handler: function(val) {
        console.log('reels icon symbol list watch', val)
        this.initData()
      }
    }
  },
  data() {
    return {
      cfg: {
        'ScatterConfig': {
          'Enable': true,
          'PerReelsMinNumber': 1,
          'MinReels': 1,
          'FreeGameTimes': 1,
          'ShuffleConfig':[]
        },
        'WildConfig':{
          'WildCol1HitRatio':0,
          'WildCol2HitRatio':0,
          'WildCol3HitRatio':0,
          'WildCol4HitRatio':0,
          'WildCol5HitRatio':0
        }
      },
      cols: [1, 2, 3, 4, 5],
      symbolMap: {},
      tableData:[]
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if(this.setData() != true ){
        return
      }
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    initData() {
      if (this.slotsData) {
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.cfg = this.slotsData
        
        this.lock = true
      }
    },
    
    setData() {
      return true
      // this.$message.success('当前页面保存成功')
    }
  }
}
</script>
