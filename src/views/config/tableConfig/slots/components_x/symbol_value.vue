<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col v-for="(item,idx) in slotsData.SymbolList" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ item.Name }}</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" :disabled="editDisabled" @click="del(idx)">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px">
            <el-col :span="22">
              <el-form :ref="getId(idx)" label-width="80px" :disabled="editDisabled">
                <el-form-item label="类型">
                  <el-select v-model.number="item.Type" size="small" placeholder="placeholder">
                    <el-option label="普通" :value="0" />
                    <el-option label="万能符号" :value="1" />
                    <el-option label="SCATTER" :value="2" />
                    <el-option label="Wild模式" :value="3" />
                    <el-option label="睡美人Bonus" :value="4" />
                    <el-option label="常规Bonus" :value="5" />
                    <el-option label="阿拉丁金币" :value="6" />
                    <el-option label="阿拉丁钻石" :value="7" />
                    <el-option label="金矿火车事件" :value="8" />
                  </el-select>
                </el-form-item>

                <el-form-item label="值">
                  <el-input v-model.number="item.Value" size="small" />
                </el-form-item>

                <el-form-item label="名称">
                  <el-input v-model="item.Name" size="small" />
                </el-form-item>

                <el-form-item label="资源路径">
                  <el-input v-model="item.Path" size="small" />
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col>
        <el-button type="primary" :disabled="editDisabled" @click="addRow">添加</el-button>
        <el-button type="success" :disabled="editDisabled" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" :disabled="editDisabled" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import store from "@/store";

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
  data() {
    return {
      editDisabled: true,
      lock: false,
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
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
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp) {
      const multiAppMode = isMultiApp === true
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
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
