<template>
  <div class="app-container">
    <el-row>

    <fieldset style="margin-top:10px">              
        <legend>下注配置</legend>
          <el-form ref="item" :model="item" label-width="200px">
            <el-row>
            <el-col :span="16">
              <el-form-item label="自动下注局数列表">
                <el-input v-model.number="tmpBetRoundList" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
                  <el-form-item label="保底奖池抽水">
                    <el-input v-model.number="item.FeeRate" size="mini" ><template  slot="append">%</template></el-input>
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
              <span>{{ scope.row.Bonus/1000 || 0 }}</span>
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
              <span>{{ scope.row.Bonus/1000 || 0 }}</span>
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
         <el-row>
            <el-form ref="item.Multiplier" :model="item.Multiplier" width="70%">
                    <el-col :span="8">
                    <el-form-item label="单张彩票出现乘数的概率(%)：" :required="true">
                        <template>
                            <el-input-number
                            v-model="tmpSingleRatio"  type="number" :min=0 :precision="2"
                            style="width: 100%"> 
                            </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
   
      <h4 style="text-align:left;">单张彩票上乘数出现个数权重</h4>
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
            label="20面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face20Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
           <el-table-column
            label="30面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face30Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
         <el-table-column
            label="50面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face50Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="100面值"
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
            label="20面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face20Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
           <el-table-column
            label="30面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face30Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>
         <el-table-column
            label="50面值"
            width="200"
          >
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.Face50Wight" size="mini" type="number"  :min=0 ></el-input-number>
            </template>
          </el-table-column>

           <el-table-column
            label="100面值"
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
              <span>{{ scope.row.BetMoney }}</span>
            </template>
          </el-table-column>
         <el-table-column
            label="触发JP概率(万分位: ‱)"
            width="200"
          >
           <template #header>
            <span>触发JP概率<span style="color: red;">(万分位: ‱)</span></span>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.JackpotRatio" size="mini" type="number"  :min=0 ></el-input-number>
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
        tmpSingleRatio: 10,
        item: {
          FeeRate: 1,
          BetRoundList:[10,25,50,100,200,500,1000,2000], //下注
          TenBetMoney:[
            {
              Bonus:10000000, 
              WinPrizeWight: 100,
              LosePrizeWight: 100
            },
            {
              Bonus:1000000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:500000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:200000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:100000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:50000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:30000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:20000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:10000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:5000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:3000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:2000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:1000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            }
          ],
          UpTenBetMoney:[
            {
              Bonus:10000000, 
              WinPrizeWight: 100,
              LosePrizeWight: 100
            },
            {
              Bonus:1000000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:500000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:200000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:100000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:50000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:30000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:20000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:10000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:5000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:3000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:2000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },{
              Bonus:1000,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            },
            ,{
              Bonus:500,
              WinPrizeWight: 100,
              LosePrizeWight: 100,
            }
          ],
          Multiplier:{
              SingleRatio: 10,
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
                  { BetMoney: 10,  JackpotRatio: 10 },
                  { BetMoney: 20,  JackpotRatio: 10 },
                  { BetMoney: 30,  JackpotRatio: 10 },
                  { BetMoney: 50,  JackpotRatio: 10 },
                  { BetMoney: 100,  JackpotRatio: 10 },
              ],
              AwardOdds: [
                  {AwardType:1,  Odds: 500 ,Wight:100},
                  {AwardType:2,  Odds: 100 ,Wight:0},
                  {AwardType:3,  Odds: 55 ,Wight:0},
                  {AwardType:4,  Odds: 10 ,Wight:0},
                
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
          let that = this
          const betRoundList = []
          for (const o of that.item.BetRoundList) {
            betRoundList.push(o)
          }
          that.tmpBetRoundList = betRoundList.join(',')  

          that.tmpSingleRatio = Math.floor(that.item.SingleRatio/100)
          
      },
      saveTableMoney() {
          let betItem = []
          for (const oElement of this.tmpBetRoundList.split(',')) {
            betItem.push(oElement*1000)
          
            }
            this.item.BetRoundList = (betItem)
            this.item.SingleRatio =  Math.floor(that.tmpSingleRatio*100)
      },

      getRewardName(AwardType) {
        switch(AwardType) {
          case 1: return "GRAND"
          case 2: return "MAJOR"
          case 3: return "MINOR"
          case 4: return "MINI"
          default: return "NOT FOND"
        }
      }
    }
}
</script>