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

            <el-row>
              <el-col :span="24">
                  <el-row type="flex">
                    <el-col :span="4"  style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <span>公共牌：</span>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCommCard(card)">
                        <el-image v-if="NewTestCard.CommCards[0] > 0" :src="getCardUrl(NewTestCard.CommCards[0])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCommCard(card)">
                        <el-image v-if="NewTestCard.CommCards[1] > 0" :src="getCardUrl(NewTestCard.CommCards[1])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCommCard(card)">
                        <el-image v-if="NewTestCard.CommCards[2] > 0" :src="getCardUrl(NewTestCard.CommCards[2])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCommCard(card)">
                        <el-image v-if="NewTestCard.CommCards[3] > 0" :src="getCardUrl(NewTestCard.CommCards[3])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCommCard(card)">
                        <el-image v-if="NewTestCard.CommCards[4] > 0" :src="getCardUrl(NewTestCard.CommCards[4])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <el-button type="danger" size="mini" @click="DeleteCommCard">删除</el-button>
                    </el-col>
                    <el-col :span="2" style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <el-button type="danger" size="mini" @click="AddCommCard">添加</el-button>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>

            <el-row>
              <el-button type="primary" size="mini" @click="addTestHandCardRow">添加</el-button>
            </el-row>
            <el-row v-for="(value, i) in NewTestCard.HandCards" :key="i">
              <br>
               <el-col :span="24">
                  <el-row type="flex">
                    <el-col :span="4"  style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <span>手牌：</span>
                    </el-col>
                    <el-col :span="2">
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectHdCard(card, i)">
                        <el-image v-if="value[0] > 0" :src="getCardUrl(value[0])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="2" >
                      <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectHdCard(card, i)">
                        <el-image v-if="value[1] > 0" :src="getCardUrl(value[1])" preview-teleported="false" style="width: 48px; height: 64px" />
                      </el-card>
                    </el-col>
                    <el-col :span="6" >
                    </el-col>
                    <el-col :span="2" style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <el-button type="danger" size="mini" @click="DeleteHdCard(i)">删除</el-button>
                    </el-col>
                    <el-col :span="2" style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                      <el-button type="danger" size="mini" @click="AddHdCard(i)">添加</el-button>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </fieldset>
          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="saveData">保存</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="editShow" center width="50%">
      <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
        <el-row type="flex" v-for="data, i in CardList" :key="i">
          <el-col :span="4" v-for="(card, index) in data" :key="index">
            <el-card :body-style="{ padding: '0px'}" style="width: 48px; height: 64px" @click.native="SelectCard(card)">
              <el-image :key="index" :src="getCardUrl(card)" preview-teleported="false" style="width: 48px; height: 64px" />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
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
      CardList: [
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
        [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]
      ],
      editShow: false,
      editHdRow: -1,
      NewTestCard: {
        CommCards: [0, 0, 0, 0, 0],
        HandCards: [[0, 0]]
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
            $this.TestCard2NewTestCards()
          }
          $this.JackpotConf = v.JackpotConf
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    saveData() {
      this.NewTestCard2TestCards()
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
      this.NewTestCard.HandCards.push([0, 0])
    },
    removeTestHandCardRow(index) {
      this.TestCard.HandCards.splice(index, 1)
    },
    showCards(cardInfo) {
      var cardList = []
      for (var i = 0; i < cardInfo.length; i++) {
        cardList.push(this.getCardUrl(cardInfo[i]))
      }
      console.log(cardList)
      return cardList
    },
    getCardUrl(card) {
      if (card === 0) {
        return ''
      }
      return require('@/assets/poker_texas2d/' + card + '_card.png')
    },
    AddCommCard() {
      this.editShow = true
      this.editHdRow = -1
    },
    DeleteCommCard() {
      this.NewTestCard.CommCards = []
      this.editHdRow = -1
    },
    SelectCard(card) {
      this.editShow = false
      if (this.editHdRow < 0) {
        for (var i = 0; i < this.NewTestCard.CommCards.length; i++) {
          if (this.NewTestCard.CommCards[i] === 0) {
            this.NewTestCard.CommCards[i] = card
            return
          }
        }
      } else {
        for (var j = 0; j < this.NewTestCard.HandCards[this.editHdRow].length; j++) {
          if (this.NewTestCard.HandCards[this.editHdRow][j] === 0) {
            this.NewTestCard.HandCards[this.editHdRow][j] = card
            return
          }
        }
      }
    },
    AddHdCard(i) {
      this.editShow = true
      this.editHdRow = i
    },
    DeleteHdCard(i) {
      this.NewTestCard.HandCards.splice(i, 1)
      this.editHdRow = -1
    },
    TestCard2NewTestCards() {
      var result = this.TestCard.CommCards.split(',')
      if (result.length === 5) {
        this.NewTestCard.CommCards = []
        for (var i = 0; i < result.length; i++) {
          this.NewTestCard.CommCards.push(Number(result[i]))
        }
      }
      if (this.TestCard.HandCards.length > 0) {
        this.NewTestCard.HandCards = []
      }
      for (var j = 0; j < this.TestCard.HandCards.length; j++) {
        var sub = []
        result = this.TestCard.HandCards[j].split(',')
        for (var k = 0; k < result.length; k++) {
          sub.push(Number(result[k]))
        }
        this.NewTestCard.HandCards.push(sub)
      }
    },
    NewTestCard2TestCards() {
      this.TestCard.CommCards = []
      for (var i = 0; i < this.NewTestCard.CommCards.length; i++) {
        if (Number(this.NewTestCard.CommCards[i]) <= 0) {
          continue
        }
        if (i > 0) {
          this.TestCard.CommCards += ','
        }
        this.TestCard.CommCards += String(this.NewTestCard.CommCards[i])
      }
      this.TestCard.HandCards = []
      for (var j = 0; j < this.NewTestCard.HandCards.length; j++) {
        var sub = ''
        for (var k = 0; k < this.NewTestCard.HandCards[j].length; k++) {
          if (this.NewTestCard.HandCards[j][k] <= 0) {
            continue
          }
          if (k > 0) {
            sub += ','
          }
          sub +=  String(this.NewTestCard.HandCards[j][k])
        }
        this.TestCard.HandCards.push(sub)
      }
    }
  }
}
</script>
