<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-tabs type="border-card">

          <el-tab-pane label="用户奖池配置">
            
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  <el-col :span="8">
                    <el-form-item label="个人奖池  桌费*">
                      <el-input v-model.number="item.ContributeRate" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <el-col :span="24" :offset="5">
                  <el-form :inline="true">
                    <el-col :span="8">
                      <el-form-item label="公共奖池  桌费*">
                        <el-input v-model.number="item.UserPoolRate" size="mini" ><template slot="append">%</template></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form>
              </el-col>
            
              <el-col :span="24" :offset="5">
                <el-form :inline="true">
                  
                  <el-col :span="8">
                    <el-form-item label="Major中奖池  公共奖池*">
                      <el-input v-model.number="item.MajorWinRate" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="Grand中奖池  公共奖池*">
                      <el-input v-model.number="item.GrandWinRate" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
            
              <el-col :span="20" :offset="5">
                <el-form :inline="true">

                  <el-col :span="8">
                    <el-form-item label="场次底注最小需求>=:">
                      <el-input v-model.number="item.MinorTableMoney" size="mini" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="Minor中奖=底注*N倍">
                      <el-input v-model.number="item.MinorWinMin" size="mini" />
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-col>
              
              <el-col :span="20" :offset="5">
                <el-form :inline="true">

                  <el-col :span="8">
                    <el-form-item label="场次底注最小需求>=:">
                      <el-input v-model.number="item.MajorTableMoney" size="mini" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="Major中奖池最小">
                      <el-input v-model.number="item.MajorWinMin" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="Major中奖池最大%">
                      <el-input v-model.number="item.MajorWinMax" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>

              <el-col :span="20" :offset="5">
                <el-form :inline="true">

                  <el-col :span="8">
                    <el-form-item label="场次底注最小需求>=:">
                      <el-input v-model.number="item.GrandTableMoney" size="mini" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="Grand中奖池最小">
                      <el-input v-model.number="item.GrandWinMin" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="Grand中奖池最大">
                      <el-input v-model.number="item.GrandWinMax" size="mini" ><template slot="append">%</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-col>
            
            </el-col>

            <fieldset style="margin-top:10px">
                
              <el-col :span="20">
                <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCfg(4)">添加</el-button>
              </el-col>
              
              <legend>Minor小奖池发放</legend>
              <el-table
                ref="filterTable"
                :data="item.MinorCfg"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column type="index" />
                
                <el-table-column prop="RewardCfg" label="中奖条件：当前奖金池/(底注*n倍)" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.RewardMul" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column prop="winRate" label="中奖概率%" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.WinRate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(4, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </fieldset>

            <fieldset style="margin-top:10px">
                
              <el-col :span="20">
                <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCfg(2)">添加</el-button>
              </el-col>
              
              <legend>Major中奖池发放</legend>
              <el-table
                ref="filterTable"
                :data="item.MajorCfg"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column type="index" />
                
                <el-table-column prop="minRate" label="【major奖金池/major最大奖金】下限倍数" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MultiMin" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column prop="maxRate" label="【major奖金池/major最大奖金】上限倍数" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MultiMax" size="mini" />
                  </template>
                </el-table-column>
                
                <el-table-column prop="winRate" label="中奖概率%" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.WinRate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(2, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </fieldset>

            <fieldset style="margin-top:10px">
                
              <el-col :span="20">
                <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCfg(1)">添加</el-button>
              </el-col>
              
              <legend>Grand大奖池发放</legend>
              <el-table
                ref="filterTable"
                :data="item.GrandCfg"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column type="index" />
                
                <el-table-column prop="minRate" label="【Grand奖金池/Grand最大奖】下限倍数" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MultiMin" size="mini" />
                  </template>
                </el-table-column>
                
                
                <el-table-column prop="maxRate" label="【Grand奖金池/Grand最大奖】上限倍数" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.MultiMax" size="mini" />
                  </template>
                </el-table-column>
                
                <el-table-column prop="winRate" label="中奖概率%" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.WinRate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(1, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </fieldset>

          </el-tab-pane>

          <el-tab-pane label="展示奖池配置">

            <el-col :span="24" :offset="5">
              <el-form :inline="true">
                <el-col :span="8">
                  <el-form-item label="Major基础值(保底)">
                    <el-input v-model.number="item.MajorShowBase" size="mini" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="Grand基础值(保底)">
                    <el-input v-model.number="item.GrandShowBase" size="mini" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>

            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下为显示Mahjor奖池增长配置。</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-table
              ref="filterTable"
              :data="item.ShowPool.MajorPoolIncrArr"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column label="Id" prop="Id" />
              <el-table-column label="奖池范围">
                <template slot-scope="scope">
                  {{ getJackpotPoolTitle(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="[0,2)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 0, 1) }}
                </template>
              </el-table-column>
              <el-table-column label="[2,7)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 2, 6) }}
                </template>
              </el-table-column>
              <el-table-column label="[7,9)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 7, 8) }}
                </template>
              </el-table-column>
              <el-table-column label="[9,18)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 9, 17) }}
                </template>
              </el-table-column>
              <el-table-column label="[18,24)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 18, 23) }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row, 2)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;">以下为显示Grand奖池增长配置。</span>
              </el-descriptions-item>
            </el-descriptions>
            <el-table
              ref="filterTable"
              :data="item.ShowPool.GrandPoolIncrArr"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column label="Id" prop="Id" />
              <el-table-column label="奖池范围">
                <template slot-scope="scope">
                  {{ getJackpotPoolTitle(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="[0,2)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 0, 1) }}
                </template>
              </el-table-column>
              <el-table-column label="[2,7)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 2, 6) }}
                </template>
              </el-table-column>
              <el-table-column label="[7,9)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 7, 8) }}
                </template>
              </el-table-column>
              <el-table-column label="[9,18)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 9, 17) }}
                </template>
              </el-table-column>
              <el-table-column label="[18,24)点" prop="MinRobotNum">
                <template slot-scope="scope">
                  {{ getJackpotIncrShow(scope.row, 18, 23) }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row, 1)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <fieldset style="margin-top:10px">
                
              <el-col :span="20">
                <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCfg(12)">添加</el-button>
              </el-col>
              
              <legend>Major中奖配置</legend>
              <el-table
                ref="filterTable"
                :data="item.ShowPool.MajorRewardCfg"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column type="index" />

                <el-table-column prop="poolAreaMin" label="展示奖池金额下限【" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.PoolAreaMin" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column prop="poolAreaMax" label="】展示奖池金额上限" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.PoolAreaMax" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column prop="rewardRate" label="概率" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.RewardRate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(12, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </fieldset>

            <fieldset style="margin-top:10px">
                
              <el-col :span="20">
                <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="doAddCfg(11)">添加</el-button>
              </el-col>
              
              <legend>Grand中奖配置</legend>
              <el-table
                ref="filterTable"
                :data="item.ShowPool.GrandRewardCfg"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column type="index" />

                <el-table-column prop="poolAreaMin" label="展示奖池金额下限【" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.PoolAreaMin" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column prop="poolAreaMax" label="】展示奖池金额上限" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.PoolAreaMax" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column prop="rewardRate" label="概率" >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.RewardRate" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRowBetMoneyLevel(11, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>
            </fieldset>
            
          </el-tab-pane>

        </el-tabs>
        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 【dialog】Jackpot奖池增长 -->
    
    <el-dialog
      :title="incrJackpotForm.title"
      :modal="false"
      :visible.sync="incrJackpotForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm.data">
        <el-form-item>
          <el-table
            ref="filterTable"
            :data="incrJackpotForm.data"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column type="index" />
            <el-table-column label="时间段">
              <template slot-scope="scope">
                [{{ scope.row.StartHour }},{{ scope.row.EndHour+1 }})点
              </template>
            </el-table-column>
            <el-table-column label="每小时增长">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PerHourIncr" style="width: 100px;" size="mini" :required="true" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveIncrJackpotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
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
        ContributeRate: 15,  //个人奖池  桌费*
        UserPoolRate: 5, //公共奖池  桌费*
        MajorWinRate: 30, //Major中奖池  公共奖池*
        GrandWinRate: 70, //Grand中奖池  公共奖池*
        MinorTableMoney: 0,//场次底注最小需求>=:
        MinorWinMin: 5,  //Minor中奖=底注*N倍
        MajorTableMoney: 5, //"场次底注最小需求>=:
        MajorWinMin: 18, //Major中奖池最小
        MajorWinMax: 20, //Major中奖池最大
        GrandTableMoney: 5, //场次底注最小需求>=:
        GrandWinMin: 18, //Grand中奖池最小
        GrandWinMax: 20, //Grand中奖池最大
            
        MajorShowBase: 5000,
        GrandShowBase: 10000,
        GrandCfg:[],
        MajorCfg:[],
        MinorCfg:[],
        ShowPool:{
          MajorPoolIncrArr:[
            {Id:1,MinPool:0,MaxPool:200000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:19800000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:13200000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:19800000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:39600000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:39600000}]},

            {Id:2,MinPool:200000000,MaxPool:250000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:9900000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:6600000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:9900000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:19800000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:19800000}]},

            {Id:3,MinPool:250000000,MaxPool:300000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:4950000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:3300000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:4950000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:9900000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:9900000}]},

            {Id:4,MinPool:300000000,MaxPool:-1,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:1980000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:1320000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:1980000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:3960000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:3960000}]}
          ],
          GrandPoolIncrArr:[
            {Id:1,MinPool:0,MaxPool:200000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:19800000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:13200000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:19800000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:39600000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:39600000}]},

            {Id:2,MinPool:200000000,MaxPool:250000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:9900000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:6600000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:9900000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:19800000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:19800000}]},

            {Id:3,MinPool:250000000,MaxPool:300000000,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:4950000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:3300000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:4950000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:9900000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:9900000}]},

            {Id:4,MinPool:300000000,MaxPool:-1,TimeArr:[{EndHour:1,Index:1,StartHour:0,PerHourIncr:1980000},
            {EndHour:6,Index:2,StartHour:2,PerHourIncr:1320000},{EndHour:8,Index:3,StartHour:7,PerHourIncr:1980000},
            {EndHour:17,Index:4,StartHour:9,PerHourIncr:3960000},{EndHour:23,Index:5,StartHour:18,PerHourIncr:3960000}]}
          ],
          MajorRewardCfg:[],
          GrandRewardCfg:[],
        },
      },
      incrJackpotForm: {
          id: 0,
          title: '',
          visible: false,
          data: [],
          type: 3,
      },
      form: {},
      subKey: 'pusoy_jackpot_cfg',
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
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            this.transMoneyForShow()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            console.log(item)
          }
        }
      })
    },
    
    transMoneyForShow() {
            this.item.MajorShowBase /= 1000
            this.item.GrandShowBase /= 1000      
            this.item.MinorTableMoney /= 1000
            this.item.MajorTableMoney /= 1000
            this.item.GrandTableMoney /= 1000

            for (const k in this.item.GrandCfg){
              this.item.GrandCfg[k].MultiMin /= 100
              this.item.GrandCfg[k].MultiMax /= 100
            }
            for (const k in this.item.MajorCfg){
              this.item.MajorCfg[k].MultiMin /= 100
              this.item.MajorCfg[k].MultiMax /= 100
            }
            for (const k in this.item.MinorCfg){
              this.item.MinorCfg[k].RewardMul /= 100
            }

            for (const k in this.item.ShowPool.GrandRewardCfg){
              this.item.ShowPool.GrandRewardCfg[k].PoolAreaMin /= 100
              this.item.ShowPool.GrandRewardCfg[k].PoolAreaMax /= 100
            }
            for (const k in this.item.ShowPool.MajorRewardCfg){
              this.item.ShowPool.MajorRewardCfg[k].PoolAreaMin /= 100
              this.item.ShowPool.MajorRewardCfg[k].PoolAreaMax /= 100
            }
    },
    
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)
      
      ret.MajorShowBase *= 1000
      ret.GrandShowBase *= 1000   
      ret.MinorTableMoney *= 1000
      ret.MajorTableMoney *= 1000
      ret.GrandTableMoney *= 1000

      for (const k in ret.GrandCfg){
        ret.GrandCfg[k].MultiMin *= 100
        ret.GrandCfg[k].MultiMax *= 100
      }
      for (const k in ret.MajorCfg){
        ret.MajorCfg[k].MultiMin *= 100
        ret.MajorCfg[k].MultiMax *= 100
      }
      for (const k in ret.MinorCfg){
          ret.MinorCfg[k].RewardMul *= 100
      }

      for (const k in ret.ShowPool.GrandRewardCfg){
        ret.ShowPool.GrandRewardCfg[k].PoolAreaMin *= 100
        ret.ShowPool.GrandRewardCfg[k].PoolAreaMax *= 100
      }
      for (const k in this.ret.MajorRewardCfg){
        ret.ShowPool.MajorRewardCfg[k].PoolAreaMin *= 100
        ret.ShowPool.MajorRewardCfg[k].PoolAreaMax *= 100
      }

      return ret
    },

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
    
    IsPHAuditEnv(){
      return this.env == 'ph_audit'
    },
    
    doAddCfg(level) {
      console.log("level:", level)
      if (level === 1) {//grand
        if (!this.item.GrandCfg) {
          this.item['GrandCfg'] = []
        }
        this.item.GrandCfg.push({ MultiMin: 1, MultiMax:1.5, WinRate: 50})
      } else if (level === 2) {//major
        if (!this.item.MajorCfg) {
          this.item['MajorCfg'] = []
        }
        this.item.MajorCfg.push({ MultiMin: 1, MultiMax:1.5, WinRate: 50})
      } else if (level === 4) {//minor（这里其实是mini奖励）
        if (!this.item.MinorCfg) {
          this.item['MinorCfg'] = []
        }
        this.item.MinorCfg.push({ RewardMul: 1, WinRate: 50})
      }

      if (level === 11) {//grand
        if (!this.item.ShowPool.GrandRewardCfg) {
          this.item.ShowPool['GrandRewardCfg'] = []
        }
        this.item.ShowPool.GrandRewardCfg.push({ PoolAreaMin: 1, PoolAreaMax: 1.5, RewardRate:10})
      } else if (level === 12) {//major
        if (!this.item.ShowPool.MajorRewardCfg) {
          this.item.ShowPool['MajorRewardCfg'] = []
        }
        this.item.ShowPool.MajorRewardCfg.push({ PoolAreaMin: 1, PoolAreaMax: 1.5, RewardRate:10})
      }

    },
    delRowBetMoneyLevel(level, index) {
      console.log(index)
      if (level === 1) {//grand
        this.item.GrandCfg.splice(index, 1)
      } else if (level === 2) {//major
        this.item.MajorCfg.splice(index, 1)
      } else if (level === 4) {//minor（这里其实是mini奖励）
        this.item.MinorCfg.splice(index, 1)
      }

      if (level === 11) {//grand
        this.item.ShowPool.GrandRewardCfg.splice(index, 1)
      } else if (level === 12) {//major
        this.item.ShowPool.MajorRewardCfg.splice(index, 1)
      }
    },
    
    // 展示jackpot奖池增长标题
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    // 展示jackpot每小时增长值
    getJackpotIncrShow(row, startHour, endHour) {
      let showNum = 0
      for (let i = 0; i < row.TimeArr.length; i++) {
        if (row.TimeArr[i].StartHour == startHour && row.TimeArr[i].EndHour == endHour) {
          showNum = row.TimeArr[i].PerHourIncr / 1000
          break
        }
      }
      return showNum.toLocaleString()
    },
    
    showIncrJackpotForm(data, type) {
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (let i = 0; i < data.TimeArr.length; i++) {
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }
      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      if (type === 1) {
        this.incrJackpotForm.title = '编辑 GRAND ' + this.getJackpotPoolTitle(data)
      } else if (type === 2) {
        this.incrJackpotForm.title = '编辑 MAJOR ' + this.getJackpotPoolTitle(data)
      }
      this.incrJackpotForm.type = type
      this.incrJackpotForm.visible = true
    }
  },

  saveIncrJackpotDialog() {
      if (this.incrJackpotForm.type === 2) {
        for (var i = 0; i < this.item.ShowPool.MajorPoolIncrArr.length; i++) {
          if (this.item.ShowPool.MajorPoolIncrArr[i].Id == this.incrJackpotForm.id) {
            this.item.ShowPool.MajorPoolIncrArr[i].TimeArr = this.incrJackpotForm.data
            for (var j = 0; j < this.item.Jackpot.MajorPoolIncrArr[i].TimeArr.length; j++) {
              this.item.ShowPool.MajorPoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
            }
            break
          }
        }
      } else if (this.incrJackpotForm.type === 1) {
        for (var i = 0; i < this.item.ShowPool.GrandPoolIncrArr.length; i++) {
          if (this.item.ShowPool.GrandPoolIncrArr[i].Id == this.incrJackpotForm.id) {
            this.item.ShowPool.GrandPoolIncrArr[i].TimeArr = this.incrJackpotForm.data
            for (var j = 0; j < this.item.Jackpot.GrandPoolIncrArr[i].TimeArr.length; j++) {
              this.item.ShowPool.GrandPoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
            }
            break
          }
        }
      }
      this.incrJackpotForm.visible = false
    },

}
</script>
