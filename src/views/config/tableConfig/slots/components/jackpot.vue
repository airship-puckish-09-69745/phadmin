<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form ref="form" label-width="120px">
          <el-form-item>
            <el-switch
              v-model="slotsData.Jackpot.IsEnableJackpot"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <!--
      <el-col v-for="(item,idx) in slotsData.Jackpot.Items" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>{{ idx + 1 }}</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" @click="del(idx)">删除</el-button>
          </div>
          <div class="card-body" style="margin-top: 20px">
            <el-col :span="22">
            <el-form :ref="getId(idx)" label-width="150px">
              <el-form-item label="Jackpot字段">
                <el-select v-model="item.JackpotName" size="small" placeholder="placeholder">
                  <el-option label="Jackpot1" value="jackpot_1" />
                  <el-option label="Jackpot2" value="jackpot_2" />
                  <el-option label="Jackpot3" value="jackpot_3" />
                  <el-option label="Jackpot4" value="jackpot_4" />
                  <el-option label="Jackpot5" value="jackpot_5" />
                  <el-option label="Jackpot6" value="jackpot_6" />
                </el-select>
              </el-form-item>

              <ratio-input v-model="item.JackpotFeePercent" label="抽取下注量比例(%)"></ratio-input>

              <el-form-item label="客户端标识">
                <el-input v-model="item.JackpotClientMark" size="small" />
              </el-form-item>
            </el-form>
            </el-col>
          </div>
        </el-card>
      </el-col>
	  -->
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
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  name: 'SlotsJackpot',
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
          'Jackpot': {
            'IsEnableJackpot': true
          }
        }
      }
    }
  },
  data() {
    return {
      lock: false
    }
  },
  watch: {
    'slotsData.Jackpot': {
      deep: true,
      handler: function(val) {
        // console.log('pay table symbol list watch', val)
        // this.initData()
        console.log('jackpot update', val)
      }
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  created() {
    console.log('Jackpot', this.slotsData.Jackpot)
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData.Jackpot))
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
      this.slotsData.Jackpot.Items.splice(idx, 1)
    },
    initRow() {
      return { 'JackpotName': 'jackpot_1', 'JackpotFeePercent': 0, 'JackpotClientMark': '' }
    },
    addRow() {
      this.slotsData.Jackpot.Items.push(this.initRow())
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
