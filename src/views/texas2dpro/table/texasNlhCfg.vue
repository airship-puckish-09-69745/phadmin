<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="cfg" :model="cfg" label-width="150px">

          <fieldset style="margin-top:10px">
            <legend>Jackpot配置</legend>

            <el-row>
              <el-col :span="12">
                <el-form-item label="盲注比例%：">
                  <el-input v-model.number="JackpotConf.BlindRatio" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button type="primary" size="mini" @click="addCardTypeConfRow">添加</el-button>
            </el-row>
            <el-row v-for="(value, index) in JackpotConf.CardTypeConf" :key="index">
              <el-col :span="22">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="牌型" :required="true">
                      <el-input v-model.number="JackpotConf.CardTypeConf[index].CardType" size="mini" :required="true" type="number" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="牌型比例%" :required="true">
                      <el-input v-model.number="JackpotConf.CardTypeConf[index].Ratio" size="mini" :required="true" type="number" />
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="removeCardTypeConfRow(index)">删除</el-button>
              </el-col>
            </el-row>
          </fieldset>

          <fieldset style="margin-top:10px">
            <legend>配牌</legend>

            <div slot="content" bg="green">
              　　 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, //方块 2 - A <br><br>
              0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, //梅花 2 - A <br><br>
              　　 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, //红桃 2 - A <br><br>
              0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, //黑桃 2 - A <br><br>
            </div>

            <el-row>
              <el-col :span="12">
                <el-form-item label="公共牌：">
                  <el-input v-model="TestCard.CommCards" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button type="primary" size="mini" @click="addTestHandCardRow">添加</el-button>
            </el-row>
            <el-row v-for="(value, index) in TestCard.HandCards" :key="index">
              <el-col :span="22">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="手牌" :required="true">
                      <el-input v-model="TestCard.HandCards[index]" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="removeTestHandCardRow(index)">删除</el-button>
              </el-col>
            </el-row>

          </fieldset>

          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="saveData">保存</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfg: {
      },
      TestCard: {
        CommCards: '',
        HandCards: []
      },
      JackpotConf: {
        BlindRatio: 0,
        CardTypeConf: []
      },
      form: {},
      subKey: 'gameTexasNlh'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          const v = JSON.parse($this.form.Data)
          $this.cfg = v
          if ('TestCard' in this.cfg) {
            $this.TestCard = v.TestCard
          }
          $this.JackpotConf = v.JackpotConf
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    saveData() {
      this.cfg.JackpotConf = this.JackpotConf
      this.cfg.TestCard = this.TestCard
      const postData = JSON.parse(JSON.stringify(this.cfg))
      this.form.Data = JSON.stringify(postData)
      console.log(this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    addCardTypeConfRow() {
      this.JackpotConf.CardTypeConf.push({
        CardType: 1,
        Ratio: 10
      })
    },
    removeCardTypeConfRow(index) {
      this.JackpotConf.CardTypeConf.splice(index, 1)
    },

    addTestHandCardRow() {
      this.TestCard.HandCards.push('0,0')
    },
    removeTestHandCardRow(index) {
      this.TestCard.HandCards.splice(index, 1)
    }
  }
}
</script>
