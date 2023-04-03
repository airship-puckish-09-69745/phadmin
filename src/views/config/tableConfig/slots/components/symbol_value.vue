<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col v-for="(item,idx) in slotsData.SymbolList" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ item.Name }}</span>
            <el-button type="text" @click="del(idx)" style="float: right; padding: 3px 0; color: red">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px">
            <el-col :span="22">
            <el-form :ref="getId(idx)" label-width="80px">
              <el-form-item label="类型">
                <el-select v-model.number="item.Type" size="small" placeholder="placeholder">
                  <el-option label="普通" :value="0"></el-option>
                  <el-option label="万能符号" :value="1"></el-option>
                  <el-option label="SCATTER" :value="2"></el-option>
                  <el-option label="Wild模式" :value="3"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="值">
                <el-input v-model.number="item.Value" size="small"></el-input>
              </el-form-item>

              <el-form-item label="名称">
                <el-input v-model="item.Name" size="small"></el-input>
              </el-form-item>

              <el-form-item label="资源路径">
                <el-input v-model="item.Path" size="small"></el-input>
              </el-form-item>
            </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col>
        <el-button type="primary" @click="addRow">添加</el-button>
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'

export default {
  name: 'SlotsSymbolValue',
  components: { Compare },
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
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  data() {
    return {
      lock: false
    }
  },
  methods: {
    getId(idx) {
      return 'frm' + idx
    },
    del(idx) {
      this.slotsData.SymbolList.splice(idx, 1)
    },
    initRow() {
      return { Type: 0, Value: 0, Name: '' }
    },
    addRow() {
      this.slotsData.SymbolList.push(this.initRow())
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData.SymbolList))
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
