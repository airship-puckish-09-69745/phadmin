<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-tabs type="border-card">
        <el-tab-pane label="基础配置">
          <el-col :span="16" :offset="3">
            <el-row>
              <el-row>
                <el-form>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="用户长时间未敲击踢出(s)">
                      <el-input v-model.number="item.KicKTime" size="mini" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="用户长时间未敲击提示(s)">
                      <el-input v-model.number="item.NoticeTime" size="mini" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="保底奖池抽水">
                      <el-input v-model.number="item.FeeRate" size="mini">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-form-item label="自动敲击次数(∞用-1表示)">
                      <el-input v-model="item.AutoTimes" size="mini" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <fieldset style="margin-top:10px">
                <el-table
                  ref="filterTable"
                  :data="item.BetLevel"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                  />
                  <el-table-column
                    prop="Low"
                    label="下注列表(支持2位小数)"
                  >
                    <template slot="header">
                      <p style="text-align: center">  下注列表(支持2位小数)</p>
                      <span style="color: red;font-size: 11px">  注: 修改此配置先看 JACKPOT->开奖条件->开JP最小下注 相对应的注释</span>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.CanBet" size="mini" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">

                    <!--                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="doAdd"
                      >添加</el-button>
                      <el-button type="danger" size="mini" @click="delRow(scope.$index)">删除</el-button>
                    </template>-->

                  </el-table-column>
                </el-table>
              </fieldset>

            </el-row>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="主玩法配置">
          <el-col :span="16" :offset="3">
            <el-row>
              <fieldset style="margin-top:10px">
                <!--      第二层  -->
                <el-tabs type="border-card" stretch>
                  <el-tab-pane label="中奖概率配置">
                    <!--      第三层  -->
                    <el-row style="margin-left: 20px">
                      <span style="color: red;font-size: 11px">  注: 阶段增益1、2、3、4、5中的连续敲击次数必须连续</span>
                    </el-row>
                    <el-tabs type="border-card" stretch @tab-click="BuffCfgClick">
                      <el-tab-pane label="阶段增益1">
                        <el-row style="margin-left: 20px">
                          <span>连续锤击次数[左右闭合区间]:</span>
                          <el-input v-model.number="item.Buff[0].MixTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                          <span style="margin-left: 10px;margin-right: 10px">-</span>
                          <el-input v-model.number="item.Buff[0].MaxTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                        </el-row>
                        <piggy-weight-cfg :piggy-cfg="item.Buff[0].Awards" title="玩法中奖类型和概率" />
                      </el-tab-pane>
                      <el-tab-pane label="阶段增益2">
                        <el-row style="margin-left: 20px">
                          <span>连续锤击次数[左右闭合区间]:</span>
                          <el-input v-model.number="item.Buff[1].MixTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                          <span style="margin-left: 10px;margin-right: 10px">-</span>
                          <el-input v-model.number="item.Buff[1].MaxTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                        </el-row>
                        <piggy-weight-cfg :piggy-cfg="item.Buff[1].Awards" title="玩法中奖类型和概率" />
                      </el-tab-pane>
                      <el-tab-pane label="阶段增益3">
                        <el-row style="margin-left: 20px">
                          <span>连续锤击次数[左右闭合区间]:</span>
                          <el-input v-model.number="item.Buff[2].MixTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                          <span style="margin-left: 10px;margin-right: 10px">-</span>
                          <el-input v-model.number="item.Buff[2].MaxTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                        </el-row>
                        <piggy-weight-cfg :piggy-cfg="item.Buff[2].Awards" title="玩法中奖类型和概率" />
                      </el-tab-pane>
                      <el-tab-pane label="阶段增益4">
                        <el-row style="margin-left: 20px">
                          <span>连续锤击次数[左右闭合区间]:</span>
                          <el-input v-model.number="item.Buff[3].MixTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                          <span style="margin-left: 10px;margin-right: 10px">-</span>
                          <el-input v-model.number="item.Buff[3].MaxTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                        </el-row>
                        <piggy-weight-cfg :piggy-cfg="item.Buff[3].Awards" title="玩法中奖类型和概率" />
                      </el-tab-pane>
                      <el-tab-pane label="阶段增益5">
                        <el-row style="margin-left: 20px">
                          <span style="color:red; font-size: 11px">注: 右值需要大于 JACKPOT->开奖条件->开JP最少连击次数</span>
                        </el-row>
                        <el-row style="margin-left: 20px">
                          <span>连续锤击次数[左右闭合区间]:</span>
                          <el-input v-model.number="item.Buff[4].MixTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                          <span style="margin-left: 10px;margin-right: 10px">-</span>
                          <el-input v-model.number="item.Buff[4].MaxTap" :required="true" size="mini" style="width: 150px" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                        </el-row>
                        <piggy-weight-cfg :piggy-cfg="item.Buff[4].Awards" title="玩法中奖类型和概率" />
                      </el-tab-pane>
                    </el-tabs>
                  </el-tab-pane>
                  <el-tab-pane label="金币奖励倍数配置">
                    <piggy-weight-cfg :piggy-cfg=" item.MoneyOdds" weight-name="权重" val-name="金币倍数(支持1位小数)" val-type="1" />
                  </el-tab-pane>
                </el-tabs>
              </fieldset>

            </el-row>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="FreeGame配置">
          <el-col :span="16" :offset="3">
            <el-row>
              <fieldset style="margin-top:10px">
                <el-tabs type="border-card" stretch>
                  <el-tab-pane label="正常触发FreeGame">
                    <el-tabs type="border-card" stretch @tab-click="BuffCfgClick">
                      <el-tab-pane label="1*3滚轴配置">
                        <el-row>
                          <span style="font-size: 11px">  注: 3个滚轴 1个次数 1个倍数 第3个50%的概率为次数、50%的概率为倍数 (最后打乱3个滚轴的顺序)</span>
                        </el-row>
                        <el-row>
                          <div v-for="(row,idx) in item.free[0].Spin">
                            <piggy-weight-cfg :piggy-cfg="row.Choices" :table-title="getSpinTitle(row.Tpy)" weight-name="权重" val-name="val" val-type="1" style="width: 800px" />
                          </div>
                        </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="中奖概率配置">
                        <piggy-weight-cfg :piggy-cfg=" item.free[0].Awards" weight-name="权重" val-name="中奖类型" />
                      </el-tab-pane>
                      <el-tab-pane label="金币奖励倍数配置">
                        <piggy-weight-cfg :piggy-cfg=" item.free[0].MoneyOdds" weight-name="权重" val-name="金币倍数(支持1位小数)" val-type="1" />
                      </el-tab-pane>
                    </el-tabs>
                  </el-tab-pane>
                  <el-tab-pane label="购买FreeGame">
                    <el-tabs type="border-card" stretch @tab-click="BuffCfgClick">
                      <el-tab-pane label="1*3滚轴配置">
                        <el-row>
                          <span style="font-size: 11px">  注: 3个滚轴 1个次数 1个倍数 第3个50%的概率为次数、50%的概率为倍数 (最后打乱3个滚轴的顺序)</span>
                        </el-row>
                        <el-row>
                          <div v-for="(row,idx) in item.free[1].Spin">
                            <piggy-weight-cfg :piggy-cfg="row.Choices" :table-title="getSpinTitle(row.Tpy)" weight-name="权重" val-name="val" val-type="1" style="width: 800px" />
                          </div>
                        </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="中奖概率配置">
                        <piggy-weight-cfg :piggy-cfg=" item.free[1].Awards" weight-name="权重" val-name="中奖类型" />
                      </el-tab-pane>
                      <el-tab-pane label="金币奖励倍数配置">
                        <piggy-weight-cfg :piggy-cfg=" item.free[1].MoneyOdds" weight-name="权重" val-name="金币倍数(支持1位小数)" val-type="1" />
                      </el-tab-pane>
                    </el-tabs>
                  </el-tab-pane>
                </el-tabs>
              </fieldset>
            </el-row>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="幸运转盘">
          <el-col :span="16" :offset="3">
            <fieldset>
              <el-form inline>
                <el-form-item label="磁体->幸运转盘概率"style="margin-left:20px">
                  <el-input v-model.number="item.Plate.Rate" size="mini" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};"><template slot="append">‰</template></el-input>
                </el-form-item>
              </el-form>
              <piggy-weight-cfg :piggy-cfg=" item.Plate.PlateOdds" weight-name="权重" val-name="转盘倍数(支持1位小数)" val-type="1" />

            </fieldset>
          </el-col>
        </el-tab-pane>

        <el-tab-pane label="JACKPOT">
          <el-tabs type="border-card">
            <el-tab-pane label="真实奖池">
              <el-col el-col :span="16" :offset="3">
                <fieldset>
                  <el-table
                    ref="filterTable"
                    :data="item.Jp"
                    border
                    :header-cell-style="libShow.DefaultTableHeadClass"
                    :row-style="{height:'10px'}"
                    :cell-style="libShow.DefaultTableCell"
                    style="width: 100%"
                  >
                    <el-table-column label="JackPot类型(Level)" prop="Level">
                      <template slot-scope="scope">
                        {{ JpTypeMap[scope.row.Level] }}
                      </template>
                    </el-table-column>
                    <el-table-column label="抽水比例(‰)" prop="Typ">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="千分比,1就是0.001" placement="top-start">
                          <el-input
                            v-model.number="scope.row.Fee"
                            oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};"
                          >
                            <template slot="append">‰</template>
                          </el-input>
                        </el-tooltip>
                      </template>

                    </el-table-column>
                  </el-table>
                </fieldset>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="虚拟奖池">
              <el-col :span="16" :offset="3">
                <fieldset>
                  <div v-for="(data,idx) in item.Jp">
                    <fieldset style="margin-top: 20px;">
                      <legend>{{ JpTypeMap[data.Level] }} </legend>
                      <el-table
                        ref="filterTable"
                        :data="data.JackpotRegulation.PoolIncrArr"
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
                            <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row,idx,scope.$index)">编辑</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </fieldset>
                  </div>
                </fieldset>

              </el-col>
            </el-tab-pane>
            <el-tab-pane label="中奖条件">
              <el-descriptions class="margin-top" border>
                <el-descriptions-item>
                  <span style="">1. 分段限制和每日限制中的个数 需要是 JACKPOT->开奖条件 对应奖池中奖人数的整数倍,如果不是整数倍会导致多开 例如日限是11个 每次开出4个 则会开3次 总共3*4=12个 不会超过12个 </span>
                </el-descriptions-item>
              </el-descriptions>
              <el-row>
                <fieldset>
                  <el-col :span="24" :offset="0">
                    <div v-for="(data,idx) in item.Jp">
                      <fieldset style="margin-top: 20px;">
                        <legend>{{ JpTypeMap[data.Level] }} </legend>
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-alert-->
                        <!--                            type="success"-->
                        <!--                            description="根据概率比例必然出现一个，玩家获得的JP奖励=JP总额*JP档次对应奖励占比/100"-->
                        <!--                          />-->
                        <!--                          <el-table-->
                        <!--                            ref="filterTable"-->
                        <!--                            :data="data.JackpotCfg"-->
                        <!--                            border-->
                        <!--                            :header-cell-style="libShow.DefaultTableHeadClass"-->
                        <!--                            :row-style="{height:'10px'}"-->
                        <!--                            :cell-style="libShow.DefaultTableCell"-->
                        <!--                            style="width: 80%"-->
                        <!--                          >-->
                        <!--                            <el-table-column-->
                        <!--                              prop="Type"-->
                        <!--                              label="类型">-->
                        <!--                              <template slot-scope="scope">-->
                        <!--                                {{JackpotTypeCfg[scope.row.Type]}}-->
                        <!--                              </template>-->
                        <!--                            </el-table-column>-->
                        <!--                            <el-table-column-->
                        <!--                              prop="AwardRate"-->
                        <!--                              label="奖励占比">-->
                        <!--                              <template slot-scope="scope">-->
                        <!--                                <el-input v-model.number="scope.row.AwardRate"/>-->
                        <!--                              </template>-->
                        <!--                            </el-table-column>-->
                        <!--                            <el-table-column-->
                        <!--                              v-if="envProjectName=='ph_audit'"-->
                        <!--                              label="概率(Jackpot调控开启后此配置无效)"-->
                        <!--                              width="380"-->
                        <!--                            >-->
                        <!--                              <template slot-scope="scope">-->
                        <!--                                <el-input v-model.number="scope.row.Rate"/>-->
                        <!--                              </template>-->
                        <!--                            </el-table-column>-->
                        <!--                          </el-table>-->
                        <!--                        </el-col>-->

                        <el-col :span="24">
                          <jackpot-day-limit :jackpot-rand-awards="data.JackpotRegulation.RandAwards" />
                        </el-col>
                      </fieldset>
                    </div>
                  </el-col>
                </fieldset>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="开奖条件">
              <el-row :span="16" :offset="3">
                <fieldset style="margin-top:10px">
                  <legend>Jackpot 奖励配置</legend>
                  <el-table
                    :data="item.Jp"
                    border
                    style="width: 100%"
                    :header-cell-style="{textAlign:'center'}"
                  >
                    <el-table-column
                      label="JACKPOT类型(Level)"
                      width="180"
                    >
                      <template slot-scope="scope">
                        {{ JpTypeMap[scope.row.Level] }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="中奖人数(最大支持30)"
                      width="200"
                    >
                      <template slot="header">
                        <p style="text-align: center">  中奖人数(最大支持30)</p>
                        <span style="color: red;font-size: 11px">  注: 见JACKPOT->中奖条件->每日限制 注释</span>
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.Num" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="中奖时间"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.Time" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)">
                          <template slot="append">ms</template>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="开JP最少连击次数"
                      width="200"
                    >
                      <template slot="header">
                        <p style="text-align: center">  开JP最少连击次数</p>
                        <span style="color: red;font-size: 11px">  注: 需要小于 主玩法配置->中奖概率配置->阶段增益5 中的右值</span>
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.CTap" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};value=parseInt(value)" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="'开JP最小下注'"
                      width="auto"
                    >
                      <template slot="header">
                        <p style="text-align: center">  开JP最小下注</p>
                        <span style="color: red;font-size: 11px">  注: 1.三个奖池的中奖下注区间必须完全覆盖 基础配置->下注列表内所有下注值 2.左右闭合区间  3.确认完全覆盖以后可以点击左上角的发布 4.没有覆盖的下注将不会被抽水入Jp奖池 也不会参与Jp开奖</span>
                      </template>
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.MinBet" placeholder="请选择">
                          <el-option
                            v-for="(v,idx) in item.BetLevel[0].CanBet"
                            :key="v"
                            :label="v"
                            :value="v"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="'开JP最大下注'"
                      width="auto"
                    >
                      <template slot="header">
                        <p style="text-align: center">  开JP最大下注</p>
                        <span style="color: red;font-size: 11px;line-height: 5px">  注: 同左</span>
                      </template>
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.MaxBet" placeholder="请选择">
                          <el-option
                            v-for="v in item.BetLevel[0].CanBet"
                            :key="v"
                            :label="v"
                            :value="v"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                  </el-table>

                </fieldset>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="机器人配置">
          <el-row :span="16" :offset="3">
            <fieldset style="margin-top:10px">
              <legend>机器人配置</legend>
              <el-descriptions class="margin-top" border>
                <el-descriptions-item>
                  <span style="color:red; font-size: 12px">以下配置,在两个时段机器人数目标替换时,缺补:[50,∞)[2,5]; [30,50)[1,3]; [10,30)[1,2]; (0,10)[0.5,1]  多退:[50,∞)[2,3]; [20,50)[1,2]; (0,20)[0.5,1]</span>
                </el-descriptions-item>
              </el-descriptions>
              <el-button type="normal" icon="el-icon-edit" size="mini" @click="addRobotNumForm()">添加</el-button>
              <el-table
                  ref="filterTable"
                  :data="item.RobotCfg.RobotMemberArr"
                  border
                  :header-cell-style="libShow.DefaultTableHeadClass"
                  :row-style="{height:'10px'}"
                  :cell-style="libShow.DefaultTableCell"
                  style="width: 100%"
              >
                <el-table-column type="index" />
                <el-table-column label="时间段" prop="TimeTitle">
                  <template slot-scope="scope">
                    [{{ scope.row.StartHour }},{{ scope.row.EndHour }}]
                  </template>
                </el-table-column>
                <el-table-column label="机器人数下限" prop="MinRobotNum">
                  <template slot-scope="scope">
                    {{ scope.row.MinRobotNum }}
                  </template>
                </el-table-column>
                <el-table-column label="机器人数上限" prop="MaxRobotNum">
                  <template slot-scope="scope">
                    {{ scope.row.MaxRobotNum }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="normal" icon="el-icon-edit" size="mini" @click="showRobotNumForm(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲击次数(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MinRobotPlayTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲击次数(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MaxRobotPlayTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲x次后换个hz敲(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MinRobotChangeTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲x次后换个hz敲(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MaxRobotChangeTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="20" :offset="3">
                  <span style="font-size: 12px">机器的金币中奖权重是正常玩家的1、1.5、2倍 各占1/3的概率</span>
                </el-col>
                <el-col :span="15" :offset="3">
                  <div >
                    <piggy-weight-cfg :piggy-cfg=" item.RobotCfg.RobotWiMulti" weight-name="权重" val-name="金币权重*multi(支持1位小数)" val-type="1" />
                  </div>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲x次后换个金币中奖权重(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MinRobotWiChangeTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲x次后换个金币中奖权重(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MaxRobotWiChangeTimes" size="mini" :required="true" />
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <span style="font-size: 12px">机器人有x%的概率自动敲击, 不是自动敲击的机器人敲击hz由敲击间隔控制 </span>
                </el-col>

                <el-col :span="20" :offset="3">
                  <el-form inline>
                    <el-form-item label="自动敲击概率" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.AutoTapRate" size="mini" :required="true"> <template slot="append">％</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲击间隔(min)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MinRobotTapInterval" size="mini" :required="true"> <template slot="append">ms</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="7" :offset="3">
                  <el-form inline>
                    <el-form-item label="敲击间隔(max)" :rules="dataRule(true,{type:'n',range:'0'})">
                      <el-input v-model.number="item.RobotCfg.MaxRobotTapInterval" size="mini" :required="true"> <template slot="append">ms</template></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>

              </el-row>
            </fieldset>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row>
      <el-button type="primary" @click="setData">保存</el-button>

    </el-row>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

    <!-- 【dialog】Jackpot奖池增长 -->
    <el-dialog
      :title="incrJackpotForm.title"
      :modal="false"
      :visible.sync="incrJackpotForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm.data.TimeArr">
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

    <!-- 【dialog】编辑机器人人数 -->
    <el-dialog
      title="编辑机器人人数"
      :modal="false"
      :visible.sync="robotDialogForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="robotDialogForm.data" label-width="200px">
        <el-form-item label="序号：">
          {{ robotDialogForm.data.Index }}
        </el-form-item>
        <el-form-item label="开始时段：">
          <el-input v-model.number="robotDialogForm.data.StartHour" disable style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="结束时段：">
          <el-input v-model.number="robotDialogForm.data.EndHour" disable style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="机器人最小人数：">
          <el-input v-model.number="robotDialogForm.data.MinRobotNum" style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item label="机器人最大人数：">
          <el-input v-model.number="robotDialogForm.data.MaxRobotNum" style="width: 100px;" size="mini" :required="true" />
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveRobotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'
import PiggyWeightCfg from '@/views/config/tableConfig/piggyWeightCfg.vue'
import JackpotDayLimit from '@/views/config/components/jackpotDayLimit.vue'
import JackpotAward from '@/views/playerManage/jackpotAward.vue'
import { red } from 'mockjs/src/mock/random/color_dict'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { JackpotAward, JackpotDayLimit, PiggyWeightCfg, Compare, Publish, BetAmount },
  data() {
    return {
      subKey: 'miniPiggy_cfg',
      libShow: $libShow,
      envProjectName: process.env.VUE_APP_PROJECT,
      item: {
        KicKTime: 300,
        NoticeTime: 300,
        FeeRate: 30,
        AutoTimes: [25, 50, 100, 200, 500, 1000, 5000, -1],
        BetLevel: [{ CanBet: [60, 100, 200, 400, 600, 2000], MaxMoneyBet: 2000, MinMoneyBet: 10 }], // //下注配置
        Buff: [ // //增益
          { Awards: [{ Weight: 1, Val: 0 }], MixTap: 0, MaxTap: 0 },
          { Awards: [{ Weight: 1, Val: 0 }], MixTap: 0, MaxTap: 0 },
          { Awards: [{ Weight: 1, Val: 0 }], MixTap: 0, MaxTap: 0 },
          { Awards: [{ Weight: 1, Val: 0 }], MixTap: 0, MaxTap: 0 },
          { Awards: [{ Weight: 1, Val: 0 }], MixTap: 0, MaxTap: 0 }
        ],
        MoneyOdds: [{ Weight: 1, Val: 0 }, { Weight: 1, Val: 0 }], // 金币 val=倍数
        free: [ // free game
          {
            TpyIn: 1,
            Spin: [{ Tpy: 4, Choices: [{ Weight: 1, Val: 2 }] }, { Tpy: 5, Choices: [{ Weight: 1, Val: 2 }, { Weight: 1, Val: 2 }] }],
            MoneyOdds: [{ Weight: 1, Val: 2 }],
            Awards: [{ Weight: 1, Val: 2 }]
          },
          {
            TpyIn: 2,
            Spin: [{ Tpy: 4, Choices: [{ Weight: 1, Val: 2 }] }, { Tpy: 5, Choices: [{ Weight: 1, Val: 2 }, { Weight: 1, Val: 2 }] }],
            MoneyOdds: [{ Weight: 1, Val: 2 }],
            Awards: [{ Weight: 1, Val: 2 }]
          }],
        Plate: { Rate: 0, PlateOdds: [{ Weight: 1, Val: 2 }] }, // 幸运转盘
        Jp: [// JP
          { Level: 1, Fee: 1, CTap: 30, MinBet: 1, MaxBet: 1, Time: 11, Num: 22, JackpotCfg: [{ Type: 1, AwardRate: 1, Rate: 2 }], JackpotRegulation: { RandAwards: [{ AwardRate: 100 }], PoolIncrArr: [{ Id: 0, MinPool: 2, MaxPool: 3, TimeArr: [{ Index: 0, StartHour: 0, EndHour: 1, PerHourIncr: 2 }] }, { Id: 0, MinPool: 2, MaxPool: 7, TimeArr: [{ Index: 0, StartHour: 2, EndHour: 6, PerHourIncr: 22 }, { Index: 0, StartHour: 0, EndHour: 1, PerHourIncr: 111 }] }] }},
          { Level: 2, Fee: 1, CTap: 30, MinBet: 1, MaxBet: 1, Time: 11, Num: 22, JackpotCfg: [{ Type: 1, AwardRate: 1, Rate: 2 }], JackpotRegulation: { RandAwards: [{ AwardRate: 100 }], PoolIncrArr: [{ Id: 0, MinPool: 2, MaxPool: 3, TimeArr: [{ Index: 0, StartHour: 1, EndHour: 12, PerHourIncr: 22 }] }] }},
          { Level: 3, Fee: 1, CTap: 30, MinBet: 1, MaxBet: 1, Time: 11, Num: 21, JackpotCfg: [{ Type: 1, AwardRate: 1, Rate: 2 }], JackpotRegulation: { RandAwards: [{ AwardRate: 100 }], PoolIncrArr: [{ Id: 0, MinPool: 2, MaxPool: 3, TimeArr: [{ Index: 0, StartHour: 1, EndHour: 12, PerHourIncr: 22 }] }] }}
        ],
        RobotCfg: {
          RobotMemberArr: [{ Index: 0, StartHour: 0, EndHour: 0, MinRobotNum: 0, MaxRobotNum: 0 }],
          MinRobotPlayTimes: 0, // 机器人最小玩牌局数
          MaxRobotPlayTimes: 0, // 机器人最大玩牌局数
          MinRobotChangeTimes: 0, // 机器人敲多少次以后换个频率敲下限
          MaxRobotChangeTimes: 0, // 机器人敲多少次以后换个频率敲上限
          RobotWiMulti: [{ Weight: 1, Val: 20 }],
          MinRobotWiChangeTimes: 0, // 机器人敲多少次以后换个金币中奖权重敲下限
          MaxRobotWiChangeTimes: 0, // 机器人敲多少次以后换个金币中奖权重敲上限
          MinRobotTapInterval: 0, // 机器人最小敲击间隔
          MaxRobotTapInterval: 0, // 机器人最大敲击间隔
          AutoTapRate: 0 // 机器人自动敲击的概率 ‰
        }
      },
      incrJackpotForm: {
        JpIdx: 0,
        dataIdx: 0,
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      JpTypeMap: {
        1: 'Grand',
        2: 'Major',
        3: 'Minor'
      },
      robotDialogForm: {
        visible: false,
        data: {}
      },
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      AttrNames: {
        'Data.MaxPlayers': '最大人数'
      }
    }
  },
  computed: {
    red() {
      return red
    }
  },
  created() {
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    transMoneyForShow() {
      for (const o of this.item.MoneyOdds) {
        o.Val /= 1000
      }
      for (const o of this.item.Jp) {
        o.MaxBet /= 1000
        o.MinBet /= 1000
      }
      for (const o of this.item.free) {
        for (const omo of o.MoneyOdds) {
          omo.Val /= 1000
        }
        for (let i = 0; i < o.Spin.length; i++) {
          if (i === 0) {
            continue
          }
          for (const c of o.Spin[i].Choices) {
            c.Val /= 1000
          }
        }
      }
      for (const o of this.item.Plate.PlateOdds) {
        o.Val /= 1000
      }

      for (const o of this.item.BetLevel) {
        if (o.CanBet instanceof Array) {
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] /= 1000
          }
        }
      }
    },
    doAdd() {
      this.item.BetLevel.push({ CanBet: [60, 100, 200, 400, 600, 2000], MaxMoneyBet: 2000, MinMoneyBet: 10 })
    },
    delRow(index) {
      if (this.item.BetLevel.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.item.BetLevel.splice(index, 1)
    },
    BuffCfgClick(tab, event) {
    },
    saveIncrJackpotDialog() {
      this.item.Jp[this.incrJackpotForm.JpIdx].JackpotRegulation.PoolIncrArr[this.incrJackpotForm.dataIdx].TimeArr = this.incrJackpotForm.data

      for (const o of this.item.Jp[this.incrJackpotForm.JpIdx].JackpotRegulation.PoolIncrArr[this.incrJackpotForm.dataIdx].TimeArr) {
        o.PerHourIncr *= 1000
      }

      this.incrJackpotForm.visible = false
    },
    saveRobotDialog() {
      for (var i = 0; i < this.item.RobotCfg.RobotMemberArr.length; i++) {
        if (this.item.RobotCfg.RobotMemberArr[i].Index == this.robotDialogForm.data.Index) {
          this.item.RobotCfg.RobotMemberArr[i] = this.robotDialogForm.data
          break
        }
      }
      this.robotDialogForm.visible = false
    },
    showIncrJackpotForm(data, idx, index) {
      this.incrJackpotForm.JpIdx = idx
      this.incrJackpotForm.dataIdx = index
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (const i in data.TimeArr) {
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }

      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    },
    addRobotNumForm() {
      let maxId = 0
      for (const o of this.item.RobotCfg.RobotMemberArr) {
        if (o.Index > maxId) {
          maxId = o.Index
        }
      }
      this.item.RobotCfg.RobotMemberArr.push({
        Index: maxId + 1,
        StartHour: 0,
        EndHour: 0,
        MinRobotNum: 0,
        MaxRobotNum: 0
      })
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
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },

    getSpinTitle(val) {
      if (val === 4) {
        return '次数'
      }
      if (val === 5) {
        return '倍数(支持1位小数)'
      }
    },
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    getPostData() {
      const obj = JSON.parse(JSON.stringify(this.item))
      for (const o of obj.MoneyOdds) {
        o.Val = parseInt(o.Val * 1000)
      }
      for (const o of obj.free) {
        for (const omo of o.MoneyOdds) {
          omo.Val = parseInt(omo.Val * 1000)
        }
        for (let i = 0; i < o.Spin.length; i++) {
          if (i === 0) {
            continue
          }
          for (const c of o.Spin[i].Choices) {
            c.Val = parseInt(c.Val * 1000)
          }
        }
      }
      for (const o of obj.Plate.PlateOdds) {
        o.Val = parseInt(o.Val * 1000)
      }
      for (const o of obj.Jp) {
        for (let i = 0; i < o.JackpotRegulation.RandAwards.length; i++) {
          o.JackpotCfg[i].AwardRate = o.JackpotRegulation.RandAwards[i].AwardRate
        }
        o.MinBet = parseInt(o.MinBet * 1000)
        o.MaxBet = parseInt(o.MaxBet * 1000)
      }
      for (const o of obj.BetLevel) {
        if (o.CanBet instanceof Array) {
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] *= 1000
          }
        } else {
          o.CanBet = o.CanBet.split(',').map(Number)
          for (let i = 0; i < o.CanBet.length; i++) {
            o.CanBet[i] *= 1000
          }
        }
      }
      if (obj.AutoTimes instanceof Array) {
      } else {
        obj.AutoTimes = obj.AutoTimes.split(',').map(Number)
      }
      return obj
    },

    checkData(obj) {
      const map = {}
      const list = JSON.parse(JSON.stringify(obj.BetLevel[0].CanBet))
      for (const o of obj.BetLevel) {
        if (o.CanBet instanceof Array) {
          for (let i = 0; i < o.CanBet.length; i++) {
            map[o.CanBet[i]] = i
          }
        } else {
          o.CanBet = o.CanBet.split(',').map(Number)
          for (let i = 0; i < o.CanBet.length; i++) {
            map[o.CanBet[i]] = i
          }
        }
      }
      for (const o of obj.Jp) {
        if (o.MaxBet - o.MinBet <= 0) {
          Message.error('JP最大下注不能小于最小下注')
          return false
        }
        for (let i = map[o.MaxBet]; i >= map[o.MinBet]; i--) {
          list[i] = -1
        }
      }
      let str = ''
      for (const data of list) {
        if (data != -1) {
          str += data / 1000 + ','
        }
      }
      if (str.length > 0) {
        Message.error('下注配置区间与下注列表不符，无法保存! 未配置值:' + str)
        return false
      }
      return true
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

            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      var postData = this.getPostData()
      if (!this.checkData(postData)) {
        return
      }
      this.form.Data = JSON.stringify(postData)
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
