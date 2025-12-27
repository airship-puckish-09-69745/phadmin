<template>
  <div class="app-container">
        <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
    </el-row>

    <el-row>

    <fieldset style="margin-top:10px">              
        <legend>下注配置</legend>
          <el-form ref="item" :model="item" label-width="200px">
            <el-row>
            <el-col :span="16">
              <el-form-item label="自动下注局数列表">
                <el-input v-model ="tmpBetRoundList" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
                  <el-form-item label="保底奖池抽水">
                    <el-input v-model="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
                  </el-form-item>
                </el-col>
          </el-row>
          </el-form>

      </fieldset>
    <fieldset>
      <legend>奖金配置</legend>
      <h4 style="text-align:left;">10面值单个格子奖金出现权重</h4>
       <el-table
              :data="item.TenBetMoney"
              border
              style="width: 100%"
            >
          <el-table-column
            label="奖金（bet）"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.BonusBet || 0 }}</span>
            </template>
          </el-table-column>
         <el-table-column
            label="中奖奖金出现权重"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.WinPrizeWight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="未中奖奖金出现权重"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.LosePrizeWight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
        </el-table>

        <h4 style="text-align:left;">10面值以上单个格子奖金出现权重</h4>
       <el-table
              :data="item.UpTenBetMoney"
              border
              style="width: 100%"
            >
          <el-table-column
            label="奖金（bet）"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.BonusBet || 0 }}</span>
            </template>
          </el-table-column>
         <el-table-column
            label="中奖奖金出现权重"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.WinPrizeWight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="未中奖奖金出现权重"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.LosePrizeWight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
    </fieldset>
         </el-row>
       <el-row>
    <fieldset>
      <legend>乘数配置
        <span style="color: #f56c6c; font-size: 12px; margin-left: 10px;">
    ⚠️ 针对10面值以上彩票才有乘数配置
        </span>
         </legend>

      <h4 style="text-align:left;">各面值单张彩票上乘数出现个数权重</h4>
       <el-table
              :data="item.Multiplier.SingleWight"
              border
              style="width: 100%"
            >
          <el-table-column
            label="出现个数"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.Cnt }}</span>
            </template>
          </el-table-column>
       <el-table-column
            label="20面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face20Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
           <el-table-column
            label="30面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face30Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
         <el-table-column
            label="50面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face50Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="100面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face100Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

         
        </el-table>
      <h4 style="text-align:left;">各面值乘数出现权重</h4>
       <el-table
              :data="item.Multiplier.SingleFaceWight"
              border
              style="width: 100%"
            >
          <el-table-column
            label="乘数"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.Multi }}X</span>
            </template>
          </el-table-column>
         <el-table-column
            label="20面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face20Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
           <el-table-column
            label="30面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face30Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
         <el-table-column
            label="50面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face50Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="100面值(权重)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face100Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

         
        </el-table>
   

    </fieldset>
     </el-row>
       <el-row>
        <fieldset>
       <legend>Jackpot 配置
       
         </legend>
   
        <h4 style="text-align:left;"> 各面值触发JP概率</h4>
       <el-table
              :data="item.JackpotRegulation.RandAwards"
              border
              style="width: 100%"
            >
          <el-table-column
            label="面值"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.BetMoney/1000 }}</span>
            </template>
          </el-table-column>
         <el-table-column
            label="触发JP概率(十万分位)"
            width="200"
          >
           <template #header>
            <span>触发JP概率<span style="color: red;">(十万分位)</span></span>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.JackpotRatio" size="mini"   :min=0 :precision=0></el-input-number>
            </template>
            </el-table-column>
    
        </el-table>

         <h4 style="text-align:left;"> Jackpot倍数权重</h4>
       <el-table
              :data="item.JackpotRegulation.AwardOdds"
              border
              style="width: 100%"
            >
         <el-table-column
            label="奖励类型"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ getRewardName(scope.row.AwardType) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="奖励倍数"
            width="200"
          >
            <template slot-scope="scope">
               <el-input-number v-model.number="scope.row.Odds" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
         <el-table-column
            label="权重"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
            </el-table-column>
    
        </el-table>
     </fieldset>
    </el-row>
    <el-row>
      <el-col style="margin-top:16px;" :offset="4" :span="12">
        <el-button type="primary" size="medium" @click="setData()">保存</el-button>
      </el-col>
    </el-row>
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
 components: {
    Publish,
    Compare,
    
  },
  data() {
      return {
        subKey: 'pirate_scratch_cfg',
        form: {},
        tmpBetRoundList:"10,25,50,100,200,500,1000,2000",
        item: {
          FeeRate: 1,
          BetRoundList:[10,25,50,100,200,500,1000,2000], //下注
          TenBetMoney:[
            {
              BonusBet:10000, 
              WinPrizeWight: 100,
              LosePrizeWight: 100
            },
            {
              BonusBet:1000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:500,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:200,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:100,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:50,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:30,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:20,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:10,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:5,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:3,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:2,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:1,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            }
          ],
          UpTenBetMoney:[
            {
              BonusBet:10000, 
              WinPrizeWight: 100,
              LosePrizeWight: 100
            },
            {
              BonusBet:1000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:500,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:200,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:100,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:50,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:30,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:20,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:10,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:5,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:3,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:2,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:1,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              BonusBet:0.5,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            }
          ],
          Multiplier:{
              SingleWight:[
                  {Cnt: 0, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20},
                  {Cnt: 1, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20}, 
                  {Cnt: 2, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20},
                  {Cnt: 3, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20}

              ],
              SingleFaceWight:[
                  {Multi: 2, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20},
                  {Multi: 3, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20}, 
                  {Multi: 5, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20},
                  {Multi: 10, Face20Wight:20,Face30Wight:30,Face50Wight:20,Face100Wight:20}

              ]

              
          },
          JackpotRegulation:{
              RandAwards: [
                  { BetMoney: 10000,  JackpotRatio: 10 },
                  { BetMoney: 20000,  JackpotRatio: 10 },
                  { BetMoney: 30000,  JackpotRatio: 10 },
                  { BetMoney: 50000,  JackpotRatio: 10 },
                  { BetMoney: 100000,  JackpotRatio: 10 },
              ],
              AwardOdds: [
                  {AwardType:1,  Odds: 500 ,Wight:100},
                  {AwardType:2,  Odds: 100 ,Wight:0},
                  {AwardType:3,  Odds: 55 ,Wight:0},
                
          ],
        }
      },
    }
  },
   created() {
    this.getData()

    this.transMoneyForShow();

  },
  methods: {
        getFullKey() {
            return 'CustomizeCfg_' + this.subKey
        },
        getData() {
            request({
                url: '/customizeconfig/one',
                method: 'get',
                data: {
                SubKey: this.subKey
                }
            }).then(response => {
                if (response.RetCode === 0) {
                this.form = response.Data || {}
                if (response.Data && response.Data.Data !== '') {
                    const cfg = JSON.parse(response.Data.Data)
                     this.item = cfg
                      
                     item.FeeRate /= 1000

                    // 设置修改之前数据
                    this.$refs.compare.SetOldVal(response.Data.Data)
                    // this.load = true
                }
                }
            })
        },
        getPostData() {
            this.saveTableMoney();
            const ret = {}
            Object.assign(ret, this.item)
            ret.FeeRate *= 1000

         //   console.log(this.item)
            return ret
          },
        setData() {
          
        
          this.form.Data = JSON.stringify(this.getPostData())
          const $this = this
          // 设置修改后数据
           console.log(this.form.Data)
          this.$refs.compare.SetNewVal(this.form.Data)
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
                  console.log('base cfg response', response)
                  Message.success('保存成功')
              }
              })
          })
        },
        transMoneyForShow() {
          const betRoundList = []
          for (const o of this.item.BetRoundList) {
            betRoundList.push(o)
          }
          this.tmpBetRoundList = betRoundList.join(',')  

          
      },
      saveTableMoney() {
          let betItem = []
          for (const oElement of this.tmpBetRoundList.split(',')) {
              betItem.push(oElement*1)
            }
            this.item.BetRoundList = (betItem)
      },

      getRewardName(AwardType) {
        switch(AwardType) {
          case 1: return "GRAND"
          case 2: return "MAJOR"
          case 3: return "MINOR"
          default: return "NOT FOND"
        }
      }
    }
}
</script>