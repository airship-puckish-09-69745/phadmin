<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col v-for="(item,idx) in slotsData.WildMultipleConfig" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ idx + 1 }}</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" @click="del(idx)">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px">
            <el-col :span="22">
              <el-form :ref="getId(idx)" label-width="150px">
                <el-form-item label="Wild图标数量">
                  <el-input v-model.number="item.Count" label="Wild图标数量"><template slot="append">个</template></el-input>
                </el-form-item>
                <el-form-item label="赔付放大倍数">
                  <el-input v-model.number="item.Multiple" label="赔付放大倍数"><template slot="append">倍</template></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-row>
      <el-col style="text-align:center;">
        <el-button @click="addRow">添加</el-button>
        <el-button type="primary" @click="submitFrm">保存</el-button>
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
  name: 'SlotsWild',
  components: { RatioInput, Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  /*
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  */
  data() {
    return {
      cfg: {
        'WildMultipleConfig': []
      }
    }
  },
  created() {
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
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
    getId(idx) {
      return 'frm' + idx
    },
    del(idx) {
      this.$delete(this.slotsData.WildMultipleConfig, idx)
    },
    initRow() {
      return {
        'Count': 0,
        'Multiple': 0
      }
    },
    addRow() {
      this.slotsData.WildMultipleConfig.push(this.initRow())
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
