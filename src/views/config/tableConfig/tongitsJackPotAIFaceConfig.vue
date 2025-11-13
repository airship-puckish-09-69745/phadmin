<template>
  <div class="app-container">
    
    <el-row>
      <el-col :span="18">
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-col>
    </el-row>

    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-tabs type="border-card">

          <el-tab-pane label="AI Face配置">
            <el-col :span="16" :offset="3">

              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="机器人整桌沉默概率:">
                      <el-input v-model.number="item.SilenceRate" size="mini" ><template  slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
              
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="下一轮表情间隔时长:">
                      <el-input v-model.number="item.NextSendDelay" size="mini" ><template  slot="append">毫秒</template></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发送表情定时器延迟:">
                      <el-input v-model.number="item.SendTimeDelay" size="mini" ><template  slot="append">毫秒</template></el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-col>
              <!--=============================-->
              <fieldset style="margin-top:10px">
                <legend>互动表情<b span style="font-weight: bold; color: red;">ID配置</b></legend>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="友善:">
                        <el-input v-model="item.FriendlyFaces" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>                 
                    <el-col :span="8">
                      <el-form-item label="中立:">
                        <el-input v-model="item.NeutralFaces" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>             
                  </el-form>
                </el-col>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="敌对:">
                        <el-input v-model="item.HostileFaces" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>             
                  </el-form>
                </el-col>
              </fieldset>
              <!--=============================-->
              <fieldset style="margin-top:10px">
                <legend>互动道具<b span style="font-weight: bold; color: red;">ID配置</b></legend>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="友善:">
                        <el-input v-model="item.FriendlyGoods" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>                 
                    <el-col :span="8">
                      <el-form-item label="中立:">
                        <el-input v-model="item.NeutralGoods" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>             
                  </el-form>
                </el-col>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="敌对:">
                        <el-input v-model="item.HostileGoods" size="mini" ></el-input>
                      </el-form-item>
                    </el-col>             
                  </el-form>
                </el-col>
              </fieldset>
              <!--=============================-->
              <fieldset v-for="(title, index) in lv"
                :key="index"
                style="margin-top:10px"
              >
                <legend>{{title}}</legend>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="回复概率:">
                        <el-input v-model="item.Rate[index]" size="mini" ><template  slot="append">%[30,70]区间</template></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-tooltip class="item" effect="dark" content="[0]回复真人的概率 [1]回复机器人表情的概率(仅互动表情(被动) 配置2个)" placement="left-start">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </el-col>
                  </el-form>
                </el-col>
                <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="触发多次表情时，每次间隔:">
                        <el-input v-model="item.Interval[index]" size="mini" ><template  slot="append">[3000,7000]区间</template></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-col>                
                <!--=============================-->
                <el-col :span="20" style="display: flex; align-items: center;">
                  <b style="font-weight: bold; color: red; margin-right: 10px;">(选择表情类型)</b>
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddTypeRate(index)">添加</el-button>
                </el-col>

                <el-table
                  ref="filterTable"
                  :data="item.TypeRate[index]"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />

                  <el-table-column prop="Rate" label="概率" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Rate" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="TableMoney" >
                    <template #header>
                      <span v-html="'表情ID <br> 0：回复对方发送的表情类型 <br> 1：回复友善类型 <br> 2：回复中立类型 <br> 3：回复敌对类型 <br> 4：回复随机类型 <br> 5：回复对立类型'"></span>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.FaceType" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowTypeRate(index, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!--=============================-->
                <el-col :span="20" style="display: flex; align-items: center;">
                  <b style="font-weight: bold; color: red; margin-right: 10px;">(回复次数)</b>
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCountRate(index)">添加</el-button>
                </el-col>                
                
                <el-table
                  ref="filterTable"
                  :data="item.CountRate[index]"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />

                  <el-table-column prop="Rate" label="概率" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Rate" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="TableMoney" label="次数" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Count" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowCountRate(index, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
                <!--=============================-->
                <el-col :span="20" style="display: flex; align-items: center;">
                  <b style="font-weight: bold; color: red; margin-right: 10px;">(回复下一个表情时间)</b>
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddDelayRate(index)">添加</el-button>
                </el-col>                
                <el-table
                  ref="filterTable"
                  :data="item.DelayRate[index]"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />

                  <el-table-column prop="Rate" label="下一个表情延迟概率" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Rate" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="Delay" label="下一个表情的延迟区间" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Delay" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowDelayRate(index, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
<!--
                <el-col :span="20" style="display: flex; align-items: center;">
                  <b style="font-weight: bold; color: red; margin-right: 10px;">(触发多次表情时，每次间隔)</b>
                  <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddInterval(index)">添加</el-button>
                </el-col>                
                <el-table
                  ref="filterTable"
                  :data="item.Interval[index]"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column type="index" />
  
                  <el-table-column prop="Time" label="延迟区间" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.Time" size="mini" />
                    </template>
                  </el-table-column>
  
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRowInterval(index, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                  
                </el-table>
                -->

              </fieldset>
              <!--=============================-->              

            </el-col>
          </el-tab-pane>
        </el-tabs>
        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
import {$libShow, DataRule} from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import RobotOnlineItems from '@/views/config/components/robotOnlineItems.vue'
import JackpotDayLimit from '@/views/config/components/jackpotDayLimit.vue'
import JackpotIncrease from '@/views/config/components/jackpotIncrease.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { JackpotIncrease, JackpotDayLimit, RobotOnlineItems, Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        SilenceRate:0,
        NextSendDelay:0,
        SendTimeDelay:0,
        Rate:[],
        Interval:[],
        TypeRate:[],
        CountRate:[],
        DelayRate:[],

        FriendlyFaces:'',
        NeutralFaces:'',
        HostileFaces:'',
        FriendlyGoods:'',
        NeutralGoods:'',
        HostileGoods:'',
        FacesReplyCfg:{},
        FacesSitDownCfg:{},
        GoodsReplyCfg:{},
      },
      lv:['互动表情(被动)','互动表情(入座主动)','互动道具(被动)'],
      form: {},
      subKey: 'tongitsjp_ai_face_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      env:process.env.VUE_APP_PROJECT,
      dialogFormVisible: false,
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT)
    if (process.env.VUE_APP_PROJECT_NAME == '菲1-开发环境' || process.env.VUE_APP_PROJECT_NAME == 'Zoo-线上环境') {
      this.isHidden = false
    }
    this.getData()
  },
  methods: {

    dataRule(required, config) {
      return DataRule(required, config)
    },
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
            console.log('response.Data.Data=======>', response.Data.Data)
            const item = JSON.parse(response.Data.Data)
            if (!item.Rate) {
              item['Rate'] = []
            }
            if (!item.Interval) {
              item['Interval'] = []
            }
            if (!item.TypeRate) {
              item['TypeRate'] = []
            }
            if (!item.CountRate) {
              item['CountRate'] = []
            }
            if (!item.DelayRate) {
              item['DelayRate'] = []
            }

            Object.assign(this.item, item)
            // Object.entries(this.item).forEach(([key, value]) => {
            //   console.log(`1key: ${key}, 1value: ${value}`);
            // });
            // Object.entries(item).forEach(([key, value]) => {
            //   console.log(`2key: ${key}, 2value: ${value}`);
            // });

            this.transMoneyForShow()
            
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            console.log('item=======>', item)
            this.item = item
          }
        }
      })
    },
    
    transMoneyForShow() {
      let that = this
      //互动表情(被动)
      if (that.item.FacesReplyCfg) {
        //1
        if (that.item.FacesReplyCfg.Rate){
          that.item.Rate.push(that.item.FacesReplyCfg.Rate.join(','))
        }
        //2
        let typeRate = []
        for (const i in that.item.FacesReplyCfg.Type) {
          typeRate.push({Rate: that.item.FacesReplyCfg.TypeRate[i], FaceType: that.item.FacesReplyCfg.Type[i].join(',')})
        }
        that.item.TypeRate.push(typeRate)
        //3
        if (that.item.FacesReplyCfg.Count){
          let countRate = []
          for (const i in that.item.FacesReplyCfg.Count) {
            countRate.push({Rate: that.item.FacesReplyCfg.CountRate[i], Count: that.item.FacesReplyCfg.Count[i]})
          }
          that.item.CountRate.push(countRate)
        }
        //4
        if (that.item.FacesReplyCfg.Delay) {
          let delayRate = []
          for (const i in that.item.FacesReplyCfg.Delay) {
            delayRate.push({Rate: that.item.FacesReplyCfg.DelayRate[i], Delay: that.item.FacesReplyCfg.Delay[i].join(',')})
          }
          that.item.DelayRate.push(delayRate)
        }
        //5间隔
        if (that.item.FacesReplyCfg.Interval) {
          that.item.Interval.push(that.item.FacesReplyCfg.Interval.join(','))
        }
      }
      //互动表情(主动)
      if (that.item.FacesSitDownCfg) {
        //1
        if (that.item.FacesSitDownCfg.Rate){
          that.item.Rate.push(that.item.FacesSitDownCfg.Rate.join(','))
        }
        //2
        if (that.item.FacesSitDownCfg.Type) {
          let typeRate = []
          for (const i in that.item.FacesSitDownCfg.Type) {
            typeRate.push({Rate: that.item.FacesSitDownCfg.TypeRate[i], FaceType: that.item.FacesSitDownCfg.Type[i].join(',')})
          }
          that.item.TypeRate.push(typeRate)
        }
        //3
        if (that.item.FacesSitDownCfg.Count){
          let countRate = []
          for (const i in that.item.FacesSitDownCfg.Count) {
            countRate.push({Rate: that.item.FacesSitDownCfg.CountRate[i], Count: that.item.FacesSitDownCfg.Count[i]})
          }
          that.item.CountRate.push(countRate)
        }
        //4
        if (that.item.FacesSitDownCfg.Delay) {
          let delayRate = []
          for (const i in that.item.FacesSitDownCfg.Delay) {
            delayRate.push({Rate: that.item.FacesSitDownCfg.DelayRate[i], Delay: that.item.FacesSitDownCfg.Delay[i].join(',')})
          }
          that.item.DelayRate.push(delayRate)
        }
        //5间隔
        if (that.item.FacesSitDownCfg.Interval) {
          that.item.Interval.push(that.item.FacesSitDownCfg.Interval.join(','))
        }
      }
      //互动道具(被动)
      if (that.item.GoodsReplyCfg) {
        //1
        if (that.item.GoodsReplyCfg.Rate){
          that.item.Rate.push(that.item.GoodsReplyCfg.Rate.join(','))
        }
        //2
        if (that.item.GoodsReplyCfg.Type) {
          let typeRate = []
          for (const i in that.item.GoodsReplyCfg.Type) {
            typeRate.push({Rate: that.item.GoodsReplyCfg.TypeRate[i], FaceType: that.item.GoodsReplyCfg.Type[i].join(',')})
          }
          that.item.TypeRate.push(typeRate)
        }
        //3
        if (that.item.GoodsReplyCfg.Count){
          let countRate = []
          for (const i in that.item.GoodsReplyCfg.Count) {
            countRate.push({Rate: that.item.GoodsReplyCfg.CountRate[i], Count: that.item.GoodsReplyCfg.Count[i]})
          }
          that.item.CountRate.push(countRate)
        }
        //4
        if (that.item.GoodsReplyCfg.Delay) {
          let delayRate = []
          for (const i in that.item.GoodsReplyCfg.Delay) {
            delayRate.push({Rate: that.item.GoodsReplyCfg.DelayRate[i], Delay: that.item.GoodsReplyCfg.Delay[i].join(',')})
          }
          that.item.DelayRate.push(delayRate)
        }
        //5间隔
        if (that.item.GoodsReplyCfg.Interval) {
          that.item.Interval.push(that.item.GoodsReplyCfg.Interval.join(','))
        }
      }
      
      //this.setData(that.item, that.item.GoodsReplyCfg)

      that.item.FacesReplyCfg = {}
      that.item.FacesSitDownCfg = {}
      that.item.GoodsReplyCfg = {}
      console.log("that.item:", that.item)
    },

    stringToArray(obj) {
      if (obj){
        if (obj instanceof Array) {
          return obj
        } else {
          let arr = []
          console.log("obj ====> ", obj)
          for (const oElement of obj.split(',')) {
            arr.push(oElement/1)
          }
          console.log("arr ====> ", arr)
          return arr
        }
      }
    },
    getCfgData(cfgIdx) {
      let cfg = {}
      cfg.Rate = this.stringToArray(this.item.Rate[cfgIdx])
      //1
      cfg.TypeRate = []
      cfg.Type = []
      if (this.item.TypeRate[cfgIdx]) {
        for (const i of this.item.TypeRate[cfgIdx]) {
          cfg.TypeRate.push(i.Rate/1)
          cfg.Type.push(this.stringToArray(i.FaceType))
        }
      }
      //2
      cfg.CountRate = []
      cfg.Count = []
      if (this.item.CountRate[cfgIdx]) {
        for (const i of this.item.CountRate[cfgIdx]) {
          cfg.CountRate.push(i.Rate/1)
          cfg.Count.push(i.Count/1)
        }
      }
      //3
      cfg.DelayRate = []
      cfg.Delay = []
      if (this.item.DelayRate[cfgIdx]) {
        for (const i of this.item.DelayRate[cfgIdx]) {
          cfg.DelayRate.push(i.Rate/1)
          cfg.Delay.push(this.stringToArray(i.Delay))
        }
      }
      //4
      cfg.Interval = this.stringToArray(this.item.Interval[cfgIdx])
      return cfg
    },

    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))
      console.log("上传====>",ret)
      ret.FriendlyFaces = this.stringToArray(this.item.FriendlyFaces)
      ret.NeutralFaces = this.stringToArray(this.item.NeutralFaces)
      ret.HostileFaces = this.stringToArray(this.item.HostileFaces)
      ret.FriendlyGoods = this.stringToArray(this.item.FriendlyGoods)
      ret.NeutralGoods = this.stringToArray(this.item.NeutralGoods)
      ret.HostileGoods = this.stringToArray(this.item.HostileGoods)
      ret.FacesReplyCfg = this.getCfgData(0)
      ret.FacesSitDownCfg = this.getCfgData(1)
      ret.GoodsReplyCfg = this.getCfgData(2)
      ret.Rate = undefined
      ret.Interval = undefined
      ret.TypeRate = undefined
      ret.CountRate = undefined
      ret.DelayRate = undefined
      return ret
    },

    //Type的概率[80, 20, 10]，表情情绪特征
    doAddTypeRate(cfgIdx) {
      console.log("cfgIdx ===> ", cfgIdx)
      if (!this.item.TypeRate) {
        this.$set(this.item, 'TypeRate', []);
      }
      if (!this.item.TypeRate[cfgIdx]) {
        this.item.TypeRate.push([])
      }
      let typeRate = this.item.TypeRate[cfgIdx]
      if (typeRate) {
        typeRate.push({
          Rate: 100,       // 默认概率
          FaceType: '2',   // 默认表情ID
        });
      }
      // 强制视图更新
      //this.$forceUpdate();
    },
    delRowTypeRate(cfgIdx, index) {
      let typeRate = this.item.TypeRate[cfgIdx]
      if (typeRate) {
        typeRate.splice(index, 1)
      }
    },

    //回复次数概率[80, 14, 5, 1]，回复次数
    doAddCountRate(cfgIdx) {
      if (!this.item.CountRate) {
        this.$set(this.item, 'CountRate', []);
      }
      if (!this.item.CountRate[cfgIdx]) {
        this.item.CountRate.push([])
      }
      let countRate = this.item.CountRate[cfgIdx]
      if (countRate) {
        countRate.push({
          Rate: 100,
          Count: 1,
        });
      }
    },
    delRowCountRate(cfgIdx, index) {
      let countRate = this.item.CountRate[cfgIdx]
      if (countRate) {
        countRate.splice(index, 1)
      }
    },

    //收到表情后n秒发送，下一个表情的延迟
    doAddDelayRate(cfgIdx) {
      if (!this.item.DelayRate) {
        this.$set(this.item, 'DelayRate', []);
      }
      if (!this.item.DelayRate[cfgIdx]) {
        this.item.DelayRate.push([])
      }

      let delayRate = this.item.DelayRate[cfgIdx]
      if (delayRate){
        delayRate.push({
          Rate: 100,
          Delay: '800,2000',
        });
        console.log('delayRate:', delayRate)
      }
    },
    delRowDelayRate(cfgIdx, index) {
      let delayRate = this.item.DelayRate[cfgIdx]
      if (delayRate) {
        delayRate.splice(index, 1)
      }
    },

    //触发多次表情时，每次间隔0.8S~1.5S
    // doAddInterval(cfgIdx) {
    //   if (!this.item.Interval) {
    //     this.$set(this.item, 'Interval', []);
    //   }
    //   if (!this.item.Interval[cfgIdx]) {
    //     this.item.Interval.push([])
    //   }
    //   let interval = this.item.Interval[cfgIdx]
    //   if (interval){
    //     interval.push({
    //       Time: '800,2000',
    //     });
    //   }
    // },
    // delRowInterval(cfgIdx, index) {
    //   let interval = this.item.Interval[cfgIdx]
    //   if (interval) {
    //     interval.splice(index, 1)
    //   }
    // },    

    //落库
    setData() {
      var postData = this.getPostData();
      this.form.Data = JSON.stringify(postData)
      console.log("==> ", this.form.Data)
      console.log(this.form)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        if (postData.openTest=="2") {
          this.$alert('测试模式已开启，请测试后关闭', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: ``
              });
            }
          });
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },

    //是否是审核服
    IsPHAuditEnv(){
      return this.env == 'ph_audit'
    }
  }
}
</script>
