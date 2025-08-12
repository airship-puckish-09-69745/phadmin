<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
   
      <el-tabs type="border-card">

        <el-tab-pane label="机器人等级">
         

          <el-row style="padding-top: 5px">
              <fieldset>
                <legend>机器人类型手牌点数权重</legend>
                <el-table
                  :data="item.AiLevelCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="机器人类型"
                    prop="AiLevel"
                    width="200"
                    :formatter="(row) => getRobotName(row.AiLevel)"
                  />
                  <el-table-column
                    label="闲家包赢概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.PlayerWinPro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="庄家包赢概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BankerWinPro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="闲家包输概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.PlayerLosePro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="庄家包输概率（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BankerLosePro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-row>

            <el-row style="padding-top: 5px">
            <h3 style="text-align:center;">机器人输赢配置</h3>
            <el-col :span="24">
              <div style="padding-top: 10px">
                <el-table
                  :data="control"
                  stripe
                  border
                  style="width: 100%"
                >

                  <el-table-column
                    prop="ControlId"
                    label="行号"
                    width="70"
                  />

                  <el-table-column
                    label="输赢最小(%)"
                    width="250"
                  >
                    <template scope="subScope">
                      <el-input-number v-model.number="subScope.row.PerStartPool"  type="number"  />
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="输赢最大(%)"
                    width="250"
                  >
                    <template scope="subScope">
                      <el-input-number v-model.number="subScope.row.PerEndPool"  type="number" />
                    </template>
                  </el-table-column>

                  <el-table-column label="机器人级别" width="250">
                    <template scope="subScope">
                      <el-select v-model="subScope.row.AiConfigLevel" placeholder="请选择">
                        <el-option
                          v-for="item in robotlvl"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template scope="subScope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="delControlRow(subScope.$index,subScope.row)"
                      >删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <el-button @click="addControlButton" size="small" style="margin-top: 10px;" type="primary">添加新值</el-button>
              </div>
            </el-col>
          </el-row>

          <h3 style="text-align:center;">机器人默认昵称配置</h3>
          <el-row>
            <el-col :span="20" :offset="1">
              <el-table :data="item.NickCfg" border>
                <el-table-column label="昵称" prop="Nick" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.Nick" size="mini" /></template>
                </el-table-column>
                <el-table-column label="概率(%)" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.Probability" size="mini"  type="number"  :min="0"  :precision="0"><template
                      slot="append"
                    >%</template></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delNickCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button @click="addNickCfg" size="small" style="margin-top: 10px;" type="primary">添加一项</el-button>
            </el-col>
          </el-row>

          <h3 style="text-align:center;">机器人展示资产配置</h3>

          <el-row>
            <el-col :span="20" :offset="1">
           
              <el-table :data="ShowMoneyCfg" border>
                <el-table-column label="场次" prop="TableMoney" width="200" >
                  <template slot-scope="scope">
<!--                    <el-input v-model.number="scope.row.TableMoney/1000" size="mini" />-->
                    <el-select v-model="scope.row.TableMoney" placeholder="请选择">
                      <el-option
                        v-for="itemTableMoney in AllTableMoneyList"
                        :key="itemTableMoney"
                        :label="itemTableMoney/1000"
                        :value="itemTableMoney/1000"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="最小值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMin" size="mini"  type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="最大值" width="200">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.ShowMoneyMax" size="mini"  type="number" ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delShowMoneyCfg(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button @click="addShowMoneyCfg" size="small" style="margin-top: 10px;" type="primary">添加一项</el-button>
            </el-col>
          </el-row>

          <h3 style="text-align:center;">机器人随机离桌</h3>
          <el-form ref="item" :model="item" width="70%">
          <!-- 离桌对局数配置 - 单行展示 -->
          <el-form-item label="机器人随机离桌局数范围：" :required="true">
            <el-row :gutter="16">
              <el-col :span="6">
                <template>
                  <el-input-number
                    v-model="item.LeaveCfg.BeginPlayCnt" 
                    :min="1"
                    :precision="0"
                    placeholder="开始局数"
                    style="width: 100%"> 
      
                  </el-input-number>
                </template>
              </el-col>
              <el-col :span="2" class="text-center">
                <span class="divider">至</span>
              </el-col>
              <el-col :span="6">
                <template>
                  <el-input-number 
                    v-model="item.LeaveCfg.EndPlayCnt"
                    :min="1"
                    :precision="0"
                    placeholder="结束局数"
                    style="width: 100%">
                  </el-input-number>
                </template>
              </el-col>
            </el-row>
          </el-form-item>
            
          <el-form-item label="离桌判定失败在触发判断局数范围：" :required="true">
            <el-row :gutter="16">
              <el-col :span="6">
                <template>
                  <el-input-number
                    v-model="item.LeaveCfg.BeginLosePlayCnt" 
                    :min="1"
                    :precision="0"
                    placeholder="开始局数"
                    style="width: 100%"> 
                  </el-input-number>
                </template>
              </el-col>
              <el-col :span="2" class="text-center">
                <span class="divider">至</span>
              </el-col>
              <el-col :span="6">
                <template>
                  <el-input-number 
                    v-model="item.LeaveCfg.EndLosePlayCnt"
                    :min="1"
                    :precision="0"
                    placeholder="结束局数"
                    style="width: 100%">
                  </el-input-number>
                </template>
              </el-col>
            </el-row>
          </el-form-item> 
 
          </el-form>
          <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
        </el-tab-pane>

        <el-tab-pane label="机器人入桌">
          <el-row style="padding-top: 5px">
    
              <fieldset>
                <legend>场次单桌最大机器人数</legend>
                <el-alert
                  title="警告：每个场次单独配置，配置范围0～7，最大机器人数=0时，以下功能全部关闭"
                  type="error"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 20px;"
                />
                <el-table
                  :data="item.RobotCntCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="机器人数量"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number  v-model.number="scope.row.RobotCnt" size="mini"  type="number" :min="0" :max="7"  :precision="0"></el-input-number >
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
              <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <fieldset>
                <legend>场次人数=0时开桌配置</legend>
                <el-table
                  :data="item.ZeroJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="入场间隔时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="入场间隔时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="等人时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.WaitMinTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="等人时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.WaitMaxTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
              <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <fieldset>
                <legend>场次有桌不满最小开局人数时入桌</legend>
                <el-table
                  :data="item.WaitPlayJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="协助开局时间最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="协助开局时间最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
              <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <fieldset>
                <legend>场次有正在玩的桌子入桌</legend>
                <el-table
                  :data="item.PlayingJoinCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="场次"
                    prop="TableMoney"
                    width="200"
                    :formatter="(row) => (row.TableMoney / 1000)"
                  />
                  <el-table-column
                    label="机器人入桌间隔最小（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMinTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="机器人入桌间隔最大（秒）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.JoinMaxTime" size="mini"  type="number" :min="1"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="每1个真人对应的机器人数比"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.MaxRobotRate" size="mini"  type="number" :min="0" ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="机器人可加入桌子总人数上限"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.MaxPlayerCnt" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </fieldset>
            </el-row>
        </el-tab-pane>

          <el-tab-pane label="机器人下注">
            <el-row style="padding-top: 5px">
              <fieldset>
                <legend>习惯下注次数配置 </legend>
                <el-table
                  :data="item.BetTimesCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="下注次数"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BetTimes" size="mini"  type="number" :min="1"  :precision="0"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="权重"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BetWeight" size="mini"  type="number" :min="0"  :precision="0"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="随机到此次数后的bet随机限制"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <div style="display: flex; align-items: center;">
                      <span style="margin-right: 10px;">是否可随机到max</span>
                      <el-switch v-model.number="scope.row.BetCanMax" :active-value="true" :inactive-value="false" />
                    </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template #default="{$index}">
                      <el-button size="small" type="danger" @click="delBetTimesCfg($index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button @click="addBetTimesCfg" size="small" style="margin-top: 10px;" type="primary">添加新值</el-button>
       
              </fieldset>
             </el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <el-row style="padding-top: 5px">
              <fieldset>
                <legend>习惯Bet配置 </legend>
                <el-table :data="item.BetHabitsCfg" border style="width: 100%">
                  <el-table-column label="bet方案" width="120">
                    <template slot-scope="scope">
                      <span v-if="!scope.row.BetIsMax">Button {{ scope.row.BtnIndex }} bet </span>
                      <span v-else>直接max</span> <!-- 或者直接留空 "" -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="权重"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.BetWeight" size="mini"  type="number" :min="0"  :precision="0"/>
                    </template>
                  </el-table-column>
                </el-table>
                </fieldset>
                <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <fieldset>
                <legend>偶尔违反习惯下注行文方案</legend>
                <el-form ref="item" :model="item" width="70%">
                  <!-- 离桌对局数配置 - 单行展示 -->
                  <el-form-item label="修正概率(%):" :required="true">
                    <el-row :gutter="16">
                      <el-col :span="6">
                        <template>
                          <el-input-number 
                            v-model="item.BetReviseCfg.Probability"  type="number" 
                            :min="0"
                            :max="100"
                            :precision="0"
                            style="width: 50%">
                          </el-input-number>
                        </template>
                      </el-col>
                    
                    </el-row>
                  </el-form-item>
             
                  
                    <el-form-item >
                    <el-table :data="item.BetReviseCfg.ReviseCnt" border style="width: 300px">
                      <el-table-column prop="value" label="修正偏移量">
                        <template #default="{row, $index}">
                          <el-input-number v-model="item.BetReviseCfg.ReviseCnt[$index]" size="small"></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80">
                        <template #default="{$index}">
                          <el-button size="small" type="danger" @click="removeReviseCnt($index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button @click="addReviseCnt" size="small" style="margin-top: 10px;" type="primary">添加新值</el-button>
                  </el-form-item>
                </el-form>
              </fieldset>
              <fieldset>
                <legend>机器人类型单轮下注配置</legend>
                <el-table
                  :data="item.AiLevelCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="机器人类型"
                    prop="AiLevel"
                    width="200"
                    :formatter="(row) => getRobotName(row.AiLevel)"
                  />
                  <el-table-column
                    label="单轮下注配置（%）"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.SingleBetPro" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="机器人要牌">
            <el-row style="padding-top: 5px">
              <fieldset>
                <legend>要牌概率配置</legend>
                <el-table
                  :data="item.TakeCardCfg"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    label="手牌点数"
                    prop="Points"
                    width="200"
                  />
                  <el-table-column
                    label="要牌概率（%)"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input-number v-model.number="scope.row.Probability" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                    </template>
                  </el-table-column>

                </el-table>
              </fieldset>

              <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
             <el-row style="padding-top: 5px"></el-row>
              <fieldset>
                <legend>庄家搏一搏要牌概率配置</legend>
                <el-form ref="item" :model="item" width="70%">
          
                  <el-form-item label="庄家搏一搏门槛(%):" :required="true">
                      <el-row :gutter="16">
                        <el-col :span="6">
                          <template>
                            <el-input-number 
                              v-model="item.DealerRiskCfg.Probability"  type="number" 
                              :min="0"
                              :max="100"
                              :precision="0"
                              style="width: 50%">
                            </el-input-number>
                          </template>
                        </el-col>
                      
                      </el-row>
                      <div style="color: red; font-size: 12px; margin-top: 5px;">
                        提示：1. 场上闲家2张牌人数/场上闲家总人数>=庄家搏一搏门槛 && 2. 场上闲家总人数>3 生效
                      </div>
                    </el-form-item>


                  <el-table
                    :data="item.DealerRiskCfg.TakeCardCfg"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      label="手牌点数"
                      prop="Points"
                      width="200"
                    />
                    <el-table-column
                      label="庄家搏一搏要牌概率（%)"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-input-number v-model.number="scope.row.Probability" size="mini"  type="number" :min="0"  :precision="0"></el-input-number>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </fieldset>
            </el-row>
        </el-tab-pane>


   

    </el-tabs>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>
    <compare ref="compare" />
  </div>
</template>

<style scoped>
</style>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'


function newBetTimesCfg(x, y, z) {
  return {
    BetTimes: x,
    BetWeight: y,
    BetCanMax: z
  }
}

function BetHabitsCfg(x, y, z, k) {
  return {
    BetBase: x,
    BetWeight: y,
    BetIsMax: z,
    BtnIndex: k,
  }
}
function newTakeCardCfg(x, y) {
  return {
    Points: x,
    Probability: y,
  }
}

function newAiLevelCfg(x, y,z,k,v, m) {
  return {
    AiLevel:x,
    PlayerLosePro: y,
    BankerLosePro: z,
    PlayerWinPro: k,
    BankerWinPro: v,
    SingleBetPro: m,
    
  }
}

function newZeroJoinCfg(x, y,z,k,v) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
    WaitMinTime: k,
    WaitMaxTime: v,
    
  }
}


function newWaitPlayJoinCfg(x, y,z) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
  }
}

function newPlayingJoinCfg(x, y,z,k, v) {
  return {
    TableMoney:x,
    JoinMinTime: y,
    JoinMaxTime: z,
    MaxRobotRate: k,
    MaxPlayerCnt: v,
  }
}

function newRobotCntCfg(x, y) {
  return {
    TableMoney:x,
    RobotCnt:y,
    
  }
}

function newNick(nick, probability) {
  return {
    Nick: nick,
    Probability: probability
  }
}

function newShowMoneyCfg() {
  return {
    TableMoney: 1,
    ShowMoneyMin: 30,
    ShowMoneyMax: 100
  }
}

function newLeaveCfg() {
  return {
    BeginPlayCnt: 5,
    EndPlayCnt: 5,
    BeginLosePlayCnt: 1,
    EndLosePlayCnt: 5
  }
}

export default {
  components: {
    Publish,
    Compare,
  },
  data() {
    return {
      item:{
        "BetTimesCfg": [newBetTimesCfg(1, 50, true), newBetTimesCfg(2, 20, false), newBetTimesCfg(3, 20, false),newBetTimesCfg(4, 10, false)],
        "BetHabitsCfg": [BetHabitsCfg(0, 20, true,1), BetHabitsCfg(1, 10, false,1), BetHabitsCfg(5, 30, false,2)],
        'TakeCardCfg': [newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 95), newTakeCardCfg(5, 50), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)],
        'AiLevelCfg':[newAiLevelCfg(5,20, 50, 0, 0,0),newAiLevelCfg(4,10, 10, 0, 0,0),newAiLevelCfg(3,0, 0, 0, 0,0),newAiLevelCfg(2,0, 0, 10, 10,0),newAiLevelCfg(1,0, 0, 20, 50,0)],
        'ZeroJoinCfg':[newZeroJoinCfg(20000, 10, 20, 5, 20),newZeroJoinCfg(50000, 20, 40, 5, 20),newZeroJoinCfg(100000, 40, 60, 5, 20),newZeroJoinCfg(200000, 60, 120, 20, 30)],
        'RobotCntCfg':[newRobotCntCfg(20000, 1),newRobotCntCfg(50000, 2),newRobotCntCfg(100000, 4),newRobotCntCfg(200000, 6)],
        'WaitPlayJoinCfg':[newWaitPlayJoinCfg(20000,8,12),newWaitPlayJoinCfg(50000,8,12),newWaitPlayJoinCfg(100000,10,15),newWaitPlayJoinCfg(200000,15,20)],
        'PlayingJoinCfg':[newPlayingJoinCfg(20000,5,10,1,4),newPlayingJoinCfg(50000,10,20,1,4),newPlayingJoinCfg(100000,20,30,1,4),newPlayingJoinCfg(200000,30,40,1,4)],
        'NickCfg':[newNick("BingoPlus", 20),newNick("ArenaPlus", 10),newNick("GZone", 70)],
        'ShowMoneyCfg':[],
        'LeaveCfg':newLeaveCfg() ,
        'BetReviseCfg': {'Probability':20, "ReviseCnt":[1,-1,2,-2]},
        'DealerRiskCfg':{'Probability':20, 'TakeCardCfg':[newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 95), newTakeCardCfg(5, 50), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)]}
      },
      gameId: 23,
      edit: {},
      tableMoneys: [],
      form: {},
      control: [],
      robotlvl: [
        {
          value: 1,
          label: 'A机器人(强放)'
        },
        {
          value: 2,
          label: 'B机器人(弱放)'
        },
        {
          value: 3,
          label: 'C机器人(陪玩)'
        },
        {
          value: 4,
          label: 'D机器人(弱杀)'
        },
        {
          value: 5,
          label: 'E机器人(强杀)'
        },
        {
          value: 6,
          label: 'F机器人(放破产)'
        }
      ],
    
      subKey: 'lucky9_robot_cfg',
      AllTableMoneyList: [],
      ShowMoneyCfg: [],
    }
  },
  created() {
   
    this.getData()
    this.getList();
    
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    setData() {
      if (!this.checkSaveBetTimes()) {
        return 
      }
      if (this.item.LeaveCfg.EndPlayCnt < this.item.LeaveCfg.BeginPlayCnt) {
        Message.error('机器人随机离桌对局数，区间配置错误')
        return 
      }
      if (this.item.LeaveCfg.EndLosePlayCnt < this.item.LeaveCfg.BeginLosePlayCnt) {
        Message.error('离桌判定失败在触发判断局数，区间配置错误')
        return 
      }
      for (const o in this.ShowMoneyCfg) {
        if (this.ShowMoneyCfg[o].ShowMoneyMin >= this.ShowMoneyCfg[o].ShowMoneyMax) {
          Message.error('展示资产区间配置错误')
          return 
        }
      }
      for (let j = 0; j < this.item.ZeroJoinCfg.length; j++) {
          if (this.item.ZeroJoinCfg[j].JoinMinTime > this.item.ZeroJoinCfg[j].JoinMaxTime) {
            Message.error('场次人数=0时开桌配置:最小时间大于最大时间')
            return 
          }
          if (this.item.ZeroJoinCfg[j].WaitMinTime > this.item.ZeroJoinCfg[j].WaitMaxTime) {
            Message.error('场次人数=0时开桌配置:最小时间大于最大时间')
            return 
          }
          if (this.item.ZeroJoinCfg[j].JoinMinTime <= 0 || this.item.ZeroJoinCfg[j].JoinMaxTime <= 0) {
            Message.error('场次人数=0时开桌配置:时间配置不能小于等于0')
            return 
          }

          if (this.item.ZeroJoinCfg[j].WaitMinTime <= 0 || this.item.ZeroJoinCfg[j].WaitMaxTime <= 0) {
            Message.error('场次人数=0时开桌配置:时间配置不能小于等于0')
            return 
          }
      }

      for (let j = 0; j < this.item.WaitPlayJoinCfg.length; j++) {
          if (this.item.WaitPlayJoinCfg[j].JoinMinTime > this.item.WaitPlayJoinCfg[j].JoinMaxTime) {
            Message.error('场次有桌不满最小开局人数时入桌配置:最小时间大于最大时间')
            return 
          }
          if (this.item.WaitPlayJoinCfg[j].JoinMinTime <= 0 ||  this.item.WaitPlayJoinCfg[j].JoinMaxTime <= 0) {
            Message.error('场次有桌不满最小开局人数时入桌配置:时间配置不能小于等于0')
            return 
          }
      }

      for (let j = 0; j < this.item.PlayingJoinCfg.length; j++) {
          if (this.item.PlayingJoinCfg[j].JoinMinTime > this.item.PlayingJoinCfg[j].JoinMaxTime) {
            Message.error('场次有正在玩的桌子入配置:最小时间大于最大时间')
            return 
          }
          if (this.item.PlayingJoinCfg[j].JoinMinTime <= 0 ||  this.item.PlayingJoinCfg[j].JoinMaxTime <= 0) {
            Message.error('场次有正在玩的桌子入配置:时间配置不能小于等于0')
            return 
          }
      }
      this.item.Control = this.control
      this.item.ShowMoneyCfg = []
      for (const o in this.ShowMoneyCfg) {
        const obj = {}
        obj.TableMoney = parseInt(this.ShowMoneyCfg[o].TableMoney) * 1000
        obj.ShowMoneyMin = parseInt(this.ShowMoneyCfg[o].ShowMoneyMin) * 1000
        obj.ShowMoneyMax = parseInt(this.ShowMoneyCfg[o].ShowMoneyMax) * 1000
        this.item.ShowMoneyCfg.push(obj)
      }

      this.form.Data = JSON.stringify(this.item)
      const $this = this

       console.log("this.form.Data",  this.form.Data)
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            
            //console.log('data: ', data)

            this.item = this.DeepCopy(data)
            this.item.NickCfg = this.item.NickCfg || []
            this.item.ShowMoneyCfg = this.item.ShowMoneyCfg || []
            this.item.BetReviseCfg = this.item.BetReviseCfg || {'Probability':20, "ReviseCnt":[1,-1,2,-2]}
            this.item.DealerRiskCfg = this.item.DealerRiskCfg ||{'Probability':20, 'TakeCardCfg':[newTakeCardCfg(0, 100), newTakeCardCfg(1, 100), newTakeCardCfg(2, 100), newTakeCardCfg(3, 100), newTakeCardCfg(4, 95), newTakeCardCfg(5, 50), newTakeCardCfg(6, 5), newTakeCardCfg(7, 0), newTakeCardCfg(8, 0), newTakeCardCfg(9, 0)]}
            if (this.item.Control) {
              this.control = this.item.Control
            }
            for (const o in $this.item.ShowMoneyCfg) {
              const one = Object.assign({}, $this.item.ShowMoneyCfg[o])
              one.TableMoney /= 1000
              one.ShowMoneyMin /= 1000
              one.ShowMoneyMax /= 1000
              $this.ShowMoneyCfg.push(one)
            }
             // 设置修改之前数据
             $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },

    getList() {
      request({
        url: '/lucky9table/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // 对比下AI配置，看底注是否都有
          for (const k in response.Data) {
            this.tableMoneys.push(response.Data[k].TableMoney)
          }
          this.tableMoneys = Array.from(new Set(this.tableMoneys))
          this.tableMoneys.sort((x, y) => x - y)
        //  console.log('tableMonaaaeys: ', this.tableMoneys)
      
          for (let i = 0; i < this.tableMoneys.length; i++) {
            this.AllTableMoneyList.push(this.tableMoneys[i])
            let isFind = false 
            for (let j = 0; j < this.item.ZeroJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.ZeroJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.ZeroJoinCfg.push(newZeroJoinCfg(this.tableMoneys[i], 0, 0, 0, 0))
            }
            isFind = false 
            for (let j = 0; j < this.item.RobotCntCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.RobotCntCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.RobotCntCfg.push(newRobotCntCfg(this.tableMoneys[i], 0))
            }

            isFind = false 
            for (let j = 0; j < this.item.WaitPlayJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.WaitPlayJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.WaitPlayJoinCfg.push(newWaitPlayJoinCfg(this.tableMoneys[i], 0, 0))
            }

            isFind = false 
            for (let j = 0; j < this.item.PlayingJoinCfg.length; j++) {
              if (this.tableMoneys[i] == this.item.PlayingJoinCfg[j].TableMoney) {
                isFind = true;
                break;
              }
            }
            if (!isFind) {
              this.item.PlayingJoinCfg.push(newPlayingJoinCfg(this.tableMoneys[i], 0, 0,0,0))
            }

          }
          this.item.ZeroJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.RobotCntCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.WaitPlayJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.item.PlayingJoinCfg.sort((a, b) => a.TableMoney - b.TableMoney);
          this.AllTableMoneyList.sort((a, b) => {
            return a - b
          })
          console.log("aaaaaa", this.AllTableMoneyList)
          
        }
      })
    },



    dataRule(required, config) {
      return DataRule(required, config)
    },

    getRobotName(aiLevel) {
      let name = ""
      for (let i = 0; i < this.robotlvl.length; i++) {
        if (aiLevel === this.robotlvl[i].value) {
          name =  this.robotlvl[i].label
          break
        }
      }
      return name
    },

    addBetTimesCfg() {
      this.item.BetTimesCfg.push(newBetTimesCfg(1, 0, 0))
    },
    delBetTimesCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.BetTimesCfg, idx)
      })
    },
    addNickCfg() {
      this.item.NickCfg.push(newNick('', 0))
    },
    addShowMoneyCfg() {
      this.ShowMoneyCfg.push(newShowMoneyCfg())
    },
    delShowMoneyCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.ShowMoneyCfg, idx)
      })
    },
    addReviseCnt() {
      this.item.BetReviseCfg.ReviseCnt.push(0);
    },
    removeReviseCnt(index) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.item.BetReviseCfg.ReviseCnt.splice(index, 1);
      })
     
    },
   
     checkSaveBetTimes() {
        if (this.item.BetTimesCfg.length == 0) {
          Message.error('下注次数配置错误，需要配置数据')
          return false 
        }
        this.item.BetTimesCfg.sort((a, b) => a.BetTimes - b.BetTimes);
        for (let i = 0; i < this.item.BetTimesCfg.length; i++) {
          if (i > 0 && this.item.BetTimesCfg[i-1].BetTimes == this.item.BetTimesCfg[i].BetTimes) {
            Message.error('下注次数配置错误')
            return false 
          }
          if (this.item.BetTimesCfg[i].BetTimes == 0) {
            Message.error('下注次数配置错误')
            return false 
          }
        }

        if (this.item.BetReviseCfg.ReviseCnt.length == 0) {
          Message.error('修正偏移量配置错误,需要配置数据')
          return false 
        }
        if (this.item.NickCfg.length == 0) {
          Message.error('机器人昵称配置配置错误，需要配置数据')
          return false 
        }

        for (let i = 1; i < this.item.NickCfg.length; i++) {
          if (this.item.NickCfg[i].Nick.length == 0) {
            Message.error('机器人昵称配置配置错误')
            return false 
          }
        }
        

        return true
     },
     delNickCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.NickCfg, idx)
      })
    },
    delControlRow(mine, row) {
      console.log('mine:' + mine, row)
      this.control.splice(mine, 1)
    },
    addControlButton() {
      console.log('control')
      const Id = this.control.length + 1
      this.control.push(
        {
          PerStartPool: 0,
          PerEndPool: 0,
          AiConfigLevel: 1,
          ControlId: Id
        }
      )
    },


 
  },
  
}
</script>

