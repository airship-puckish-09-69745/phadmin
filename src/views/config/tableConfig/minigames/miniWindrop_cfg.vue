<template>
  <div class="app-container">
    <el-row>
      <!--      <publish primary-key="Volume" :key-id="getFullKey('miniWindrop_slots_cfg')" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />-->
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

      <el-button type="warning" round @click="showUserArea">用户在玩图案</el-button>
    </el-row>
    <el-row>
      <div style="display: flex; align-items: center;">
        <div style="flex: 1; height: 2px; background-color: black;" />
        <div style="padding: 0 10px;"> <!-- 文字部分 -->
          <slot> <span style="color:red;font-size:20px ">中级Jackpot</span></slot>
        </div>
        <div style="flex: 1; height: 2px; background-color: black;" />
      </div>

    </el-row>
    <!--公共配置-->
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="Jackpot贡献率：">
              <el-input v-model.number="cfg.JackpotNormal"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <fieldset style="margin-top:10px">
            <legend>Jackpot配置</legend>
            <el-alert
              type="success"
              description="根据概率比例必然出现一个，玩家获得的JP奖励=JP总额*JP档次对应奖励占比"
            />

            <el-table
              :data="item.JackpotCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="级别"
                width="180"
              >
                <template slot-scope="scope">
                  {{ JackpotTypeCfg[scope.row.Type] }}
                </template>
              </el-table-column>
              <el-table-column
                label="奖励占比"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.AwardRate">
                    <template v-if="scope.row.Type === 4" slot="append">倍下注</template><template v-else slot="append">‱</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="概率(Jackpot调控开启后此配置无效)"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Rate"><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
            </el-table>

          </fieldset>
        </el-row>
      </el-form>
    </el-row>

    <fieldset style="margin-top:20px;">
      <legend>jackpot调控配置</legend>
      <el-row>
        <el-alert
          type="error"
          description="开启后，Jackpot的中奖概率以下表数值为准。(审核版无效)"
        />
        <el-form ref="item" :model="item" label-width="100px">
          <el-form-item label="调控总开关">
            <el-switch
              v-model="item.JackpotRegulation.ToggleSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          ref="filterTable"
          :data="JackpotRandAwards"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
        >
          <el-table-column type="index" />
          <el-table-column label="奖励类型" prop="JackpotType">
            <template slot-scope="scope">
              {{ JackpotTypeCfg[scope.row.JackpotType] }}
            </template>
          </el-table-column>

          <!--
          <el-table-column label="奖励占比(与Jackpot配置中占比一致)">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              {{ item.JackpotCfg[scope.row.JackpotType-1].AwardRate }}%
            </template>
          </el-table-column>
          -->

          <el-table-column label="中奖概率" prop="JackpotRate">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.JackpotRate" style="width: 150px;" size="mini" :required="true">
                <template slot="append">‰</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="玩家开奖池条件(%)" width="300">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
              &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
            </template>

          </el-table-column>

          <el-table-column label="机器人开奖池值" prop="PoolVal">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
            </template>
          </el-table-column>

          <!--
          <el-table-column label="机器人发奖上限(%)" prop="VrPoolRateMax">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              <el-input v-model.number="scope.row.VrPoolRateMax" style="width: 120px;" size="mini" :required="true" />
            </template>
          </el-table-column>
          -->

          <el-table-column label="机器人开奖数量概率" prop="RateArr">
            <template slot-scope="scope">
              <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog(scope.row)" />
              {{ showOpenPoolRate(scope.row.JackpotType, scope.row.RateArr) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-descriptions class="margin-top" border>
        <el-descriptions-item>
          <span style="color:red;">以下为显示jackpot奖池增长配置。</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        ref="filterTable"
        :data="item.JackpotRegulation.PoolIncrArr"
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
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>
    <el-dialog
      title="查看玩家在玩图案"
      :modal="false"
      :visible.sync="showArea.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="showArea" label-width="120px" size="small">
          <el-form-item label="玩家id：">
            <el-input v-model.number="showArea.uid" size="11" placeholder="请输入在用户id" />
          </el-form-item>
          <el-form-item label="生成图案：">
            <div id="windropShow" v-html="windropData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goSearch">执行</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 【dialog】jackpot开出奖励 -->
    <el-dialog
      :title="poolNumChange.title"
      :modal="false"
      :visible.sync="poolNumChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addPoolNum()">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="savePoolNum">保存</el-button>
      <el-table
        ref="filterTable"
        :data="poolNumChange.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="配置ID" prop="Id">
          <template slot-scope="scope">
            {{ scope.row.Id }}
          </template>
        </el-table-column>
        <el-table-column label="开出数量(一次最多只有一个)" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开出概率(%)" prop="Rate">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removePoolNum(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

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
    <div><br></div>
    <div><br></div>
    <div style="display: flex; align-items: center;">
      <div style="flex: 1; height: 2px; background-color: black;" />
      <div style="padding: 0 10px;"> <!-- 文字部分 -->
        <slot> <span style="color:red;font-size:20px ">高级JackPot</span></slot> <!-- 这里是插槽，用于放置自定义内容 -->
      </div>
      <div style="flex: 1; height: 2px; background-color: black;" />
    </div>
    <div><br></div>
    <div><br></div>
    <el-row>
      <el-button type="warning" round @click="showUserArea2">用户在玩图案</el-button>
    </el-row>
    <!--公共配置-->
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="Jackpot贡献率：">
              <el-input v-model.number="cfg.JackpotHight"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <fieldset style="margin-top:10px">
            <legend>Jackpot2配置</legend>
            <el-alert
              type="success"
              description="根据概率比例必然出现一个，玩家获得的JP奖励=JP总额*JP档次对应奖励占比"
            />

            <el-table
              :data="item.JackpotCfg2"
              border
              style="width: 100%"
            >
              <el-table-column
                label="级别"
                width="180"
              >
                <template slot-scope="scope">
                  {{ JackpotTypeCfg[scope.row.Type] }}
                </template>
              </el-table-column>
              <el-table-column
                label="奖励占比"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.AwardRate">
                    <template v-if="scope.row.Type === 4" slot="append">倍下注</template><template v-else slot="append">‱</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="概率(Jackpot调控开启后此配置无效)"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Rate"><template slot="append">‰</template></el-input>
                </template>
              </el-table-column>
            </el-table>

          </fieldset>
        </el-row>
      </el-form>
    </el-row>

    <fieldset style="margin-top:20px;">
      <legend>jackpot调控配置</legend>
      <el-row>
        <el-alert
          type="error"
          description="开启后，Jackpot的中奖概率以下表数值为准。(审核版无效)"
        />
        <el-form ref="item" :model="item" label-width="100px">
          <el-form-item label="调控总开关">
            <el-switch
              v-model="item.JackpotRegulation2.ToggleSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          ref="filterTable"
          :data="JackpotRandAwards2"
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
        >
          <el-table-column type="index" />
          <el-table-column label="奖励类型" prop="JackpotType">
            <template slot-scope="scope">
              {{ JackpotTypeCfg[scope.row.JackpotType] }}
            </template>
          </el-table-column>

          <!--
          <el-table-column label="奖励占比(与Jackpot配置中占比一致)">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              {{ item.JackpotCfg2[scope.row.JackpotType-1].AwardRate }}%
            </template>
          </el-table-column>
          -->

          <el-table-column label="中奖概率" prop="JackpotRate">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.JackpotRate" style="width: 150px;" size="mini" :required="true">
                <template slot="append">‰</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="每日限制开出个数(0为不限)" prop="DayLimit">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.DayLimit" :disabled="checkShowDayLimit2(scope.row.AwardType)" style="width: 120px;" size="mini" :required="true"><template slot="append">个</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="玩家开奖池条件(%)" width="300">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              虚拟*<el-input v-model.number="scope.row.VrPoolRate" style="width: 70px;" size="mini" :required="true" />
              &lt; 真实*<el-input v-model.number="scope.row.RealPoolRate" style="width: 70px;" size="mini" :required="true" />
            </template>

          </el-table-column>

          <el-table-column label="机器人开奖池值" prop="PoolVal">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              >=<el-input v-model.number="scope.row.PoolVal" style="width: 120px;" size="mini" :required="true" />
            </template>
          </el-table-column>

          <!--
          <el-table-column label="机器人发奖上限(%)" prop="VrPoolRateMax">
            <template v-if="scope.row.AwardType==1" slot-scope="scope">
              <el-input v-model.number="scope.row.VrPoolRateMax" style="width: 120px;" size="mini" :required="true" />
            </template>
          </el-table-column>
          -->

          <el-table-column label="机器人开奖数量概率" prop="RateArr">
            <template slot-scope="scope">
              <el-button v-if="scope.row.AwardType == 1" type="primary" icon="el-icon-edit" circle size="mini" @click="showPoolNumDialog2(scope.row)" />
              {{ showOpenPoolRate2(scope.row.JackpotType, scope.row.RateArr) }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-descriptions class="margin-top" border>
        <el-descriptions-item>
          <span style="color:red;">以下为显示jackpot奖池增长配置。</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        ref="filterTable"
        :data="item.JackpotRegulation2.PoolIncrArr"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="Id" prop="Id" />
        <el-table-column label="奖池范围">
          <template slot-scope="scope">
            {{ getJackpotPoolTitle2(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="[0,2)点" prop="MinRobotNum">
          <template slot-scope="scope">
            {{ getJackpotIncrShow2(scope.row, 0, 1) }}
          </template>
        </el-table-column>
        <el-table-column label="[2,7)点" prop="MinRobotNum">
          <template slot-scope="scope">
            {{ getJackpotIncrShow2(scope.row, 2, 6) }}
          </template>
        </el-table-column>
        <el-table-column label="[7,9)点" prop="MinRobotNum">
          <template slot-scope="scope">
            {{ getJackpotIncrShow2(scope.row, 7, 8) }}
          </template>
        </el-table-column>
        <el-table-column label="[9,18)点" prop="MinRobotNum">
          <template slot-scope="scope">
            {{ getJackpotIncrShow2(scope.row, 9, 17) }}
          </template>
        </el-table-column>
        <el-table-column label="[18,24)点" prop="MinRobotNum">
          <template slot-scope="scope">
            {{ getJackpotIncrShow2(scope.row, 18, 23) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm2(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>
    <el-dialog
      title="查看玩家在玩图案"
      :modal="false"
      :visible.sync="showArea2.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="showArea2" label-width="120px" size="small">
          <el-form-item label="玩家id：">
            <el-input v-model.number="showArea2.uid" size="11" placeholder="请输入在用户id" />
          </el-form-item>
          <el-form-item label="生成图案：">
            <div id="windropShow2" v-html="windropData2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="goSearch2()">执行</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 【dialog】jackpot开出奖励 -->
    <el-dialog
      :title="poolNumChange.title"
      :modal="false"
      :visible.sync="poolNumChange.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button style="margin-bottom:10px;" type="normal" icon="el-icon-plus" size="mini" @click="addPoolNum2()">添加</el-button>
      <el-button style="margin-bottom:10px; float:right" type="primary" size="mini" @click="savePoolNum2()">保存</el-button>
      <el-table
        ref="filterTable"
        :data="poolNumChange2.data"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column label="配置ID" prop="Id">
          <template slot-scope="scope">
            {{ scope.row.Id }}
          </template>
        </el-table-column>
        <el-table-column label="开出数量(一次最多只有一个)" prop="Num">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Num" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="开出概率(%)" prop="Rate">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" style="width: 100px;" size="mini" :required="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px;" type="danger" icon="el-icon-delete" size="mini" @click="removePoolNum2(scope.row.Id)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 【dialog】Jackpot奖池增长 -->
    <el-dialog
      :title="incrJackpotForm2.title"
      :modal="false"
      :visible.sync="incrJackpotForm2.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm2.data">
        <el-form-item>
          <el-table
            ref="filterTable"
            :data="incrJackpotForm2.data"
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
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveIncrJackpotDialog2()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div><br></div>
    <div><br></div>
    <div style="display: flex; align-items: center;">

      <div style="flex: 1; height: 2px; background-color: black;" />
      <div style="padding: 0 10px;"> <!-- 文字部分 -->
        <slot> <span style="color:red;font-size:20px ">游戏配置</span></slot>
      </div>
      <div style="flex: 1; height: 2px; background-color: black;" />
    </div>
    <div><br></div>
    <div><br></div>
    <el-row style="margin-top: 30px">
      <el-col :span="8" :offset="4">
        <el-form ref="form" :model="form" label-width="300px">
          <el-row>
            <el-form-item label="最小版本号：">
              <el-input v-model.number="cfg.MinVersion" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="当前场次：（low: 1，mid: 2，hight:3）">
              <el-input v-model="cfg.Level" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="可投注球数量：">
              <el-input v-model="cfg.BallNumsStr" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="单球可投注额度：">
              <el-input v-model="cfg.BetsStr" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="自动投注次数。-1为不限：">
              <el-input v-model="cfg.AutomaticTimesStr" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="加倍行数显示：">
              <el-input v-model="cfg.AddTimesRow" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="三种颜色 （red, green ,blue)：">
              <el-input v-model="cfg.Splice" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="赢金币动效(big Win 2-5, MageWin 6-15,Super Win 16">
              <el-input v-model="cfg.WinType" placeholder="" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="费率：">
              <el-input v-model="cfg.FeeRate" placeholder="" />
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="16" :offset="3">
        <h3>小转盘选项配置(概率总和取比)</h3>
        <el-row>
          <el-table :data="cfg.HappyRouletteCfg" border style="width: 100%">
            <el-table-column prop="Id" label="通道ID" width="100">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.Id" placeholder="" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="Type" label="奖项类型">
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.Type" size="small" placeholder="placeholder">
                  <el-option label="免费球" :value="1" />
                  <el-option label="金币" :value="2" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="HitRates" label="命中概率">
              <template slot-scope="scope">
                <el-input v-model="scope.row.HitRates" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="Num" label="奖项数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Num" placeholder="" />
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <!-- eslint-disable-next-line vue/valid-v-for -->
      <el-col v-for="item in cfg.LevelCfg">
        <el-row style="margin-top: 30px">
          <el-col :span="16" :offset="3">
            <fieldset>
              <legend>{{ levelShow[item.Level] }} 场次配置(赔率支持3位小数)</legend>
              <el-form ref="form" :model="form" label-width="300px">
                <el-row>
                  <el-form-item label="场次等级：" prop="item.Level">
                    <el-select v-model="item.Level" placeholder="请选择" disabled>
                      <el-option label="low" :value="1" />
                      <el-option label="medium" :value="2" />
                      <el-option label="high" :value="3" />
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <money-input v-model.number="item.EnergyNum" label="转盘小游戏能量条数额" />
                </el-row>
                <el-row>
                  <el-form-item label="转盘小游戏能量转化率：">
                    <el-input v-model.number="item.EnergyTransferRate" placeholder="" />‱（万分比）
                  </el-form-item>
                </el-row>
<!--                <el-row>-->
<!--                  <el-form-item label="LuckyJP key：" prop="item.LuckyJPKey">-->
<!--                    <el-input v-model="item.LuckyJPKey" placeholder="请输入" disabled />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="LuckyJP 入池转换率（万分比，例：值为 3，代表万分之三）：" prop="item.LuckyJPTransferRate">-->
<!--                    <el-input v-model="item.LuckyJPTransferRate" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="LuckyJP 赔付倍数（1代表百分之百，支持2为小数）：" prop="item.LuckyJPOdds">-->
<!--                    <el-input v-model="item.LuckyJPOdds" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="LuckyJP Jackpot显示比率(百分比10% 输入10）：" prop="item.LuckyJPRate">-->
<!--                    <el-input v-model="item.LuckyJPRate" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <money-input v-model.number="item.LuckyJPInitMoney" label="LuckyJP 初始化金额" />-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="SuperJP key：" prop="item.SuperJPKey">-->
<!--                    <el-input v-model="item.SuperJPKey" placeholder="请输入" disabled />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="SuperJP 入池转换率（万分比，例：值为 3，代表万分之三）：" prop="item.SuperJPTransferRate">-->
<!--                    <el-input v-model="item.SuperJPTransferRate" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="SuperJP 赔付倍数（1代表百分之百，支持2为小数）：" prop="item.SuperJPOdds">-->
<!--                    <el-input v-model="item.SuperJPOdds" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-form-item label="SuperJP Jackpot显示比率(百分比90% 输入90）：" prop="item.superJPRate">-->
<!--                    <el-input v-model="item.superJPRate" placeholder="请输入" />-->
<!--                  </el-form-item>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <money-input v-model.number="item.SuperJPInitMoney" label="SuperJP 初始化金额" />-->
<!--                </el-row>-->
                <fieldset>
                  <legend>普通选项配置</legend>
                  <el-row>
                    <el-table :data="item.Channels" border style="width: 100%">
                      <el-table-column prop="Id" label="通道ID" width="100">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Id" placeholder="" disabled />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.Odds" label="赔付赔率(-1 为命中 spin)">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Odds" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.HitRates" label="命中概率总和比例）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.HitRates" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.FirstTimesRates" label="翻倍1次命中概率）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.FirstTimesRates" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.SecondTimesRates" label="翻倍2次命中概率）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.SecondTimesRates" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.ThirdTimesRates" label="翻倍3次命中概率）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.ThirdTimesRates" placeholder="" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </fieldset>
                <fieldset>
                  <legend>Spin 转盘选项配置</legend>
                  <el-row>
                    <el-table :data="item.Spins" border style="width: 100%">
                      <el-table-column prop="Id" label="通道ID" width="100">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Id" placeholder="" disabled />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.Odds" label="赔付赔率(-1 为命中 LuckyJP; -2 为命中 SuperJP)">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.Odds" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="item.HitRates" label="命中概率（万分比，如 3 表示万分之三，即0.0003）">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.HitRates" placeholder="" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </fieldset>
              </el-form>
            </fieldset>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-button type="primary" style="margin-top:30px;" @click="setData">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { $libShow } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare, MoneyInput },
  data() {
    return {
      item: {
        JackpotRegulation: {
          BetMoreThan: 0,
          AddPoolPctAfterJp: 0,
          AddPoolPctPreJp: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: []
        },
        jackpotShowOption: { '2': 14, '3': 12, '4': 8, '5': 6, '6': 5, '7': 5, '8': 4, '9': 4, '10': 3, '11': 3, '12': 2, '13': 2, '14': 2, '15': 2, '16': 2, '17': 2, '18': 2, '19': 1, '20': 1, '21': 1, '22': 1, '23': 1, '24': 1 },
        JackpotRegulation2: {
          BetMoreThan: 0,
          AddPoolPctAfterJp: 0,
          AddPoolPctPreJp: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          PoolIncrArr: []
        },
        jackpotShowOption2: { '2': 14, '3': 12, '4': 8, '5': 6, '6': 5, '7': 5, '8': 4, '9': 4, '10': 3, '11': 3, '12': 2, '13': 2, '14': 2, '15': 2, '16': 2, '17': 2, '18': 2, '19': 1, '20': 1, '21': 1, '22': 1, '23': 1, '24': 1 }

      },

      load: false,
      showArea: {
        visible: false,
        uid: 0,
        showUlReslt: false
      },
      windropData: '',
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      libShow: $libShow,
      JackpotRandAwards: [],
      incrJackpotForm: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      },

      load2: false,
      showArea2: {
        visible: false,
        uid: 0,
        showUlReslt: false
      },
      windropData2: '',
      JackpotTypeCfg2: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      libShow2: $libShow,
      JackpotRandAwards2: [],
      incrJackpotForm2: {
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      poolNumChange2: {
        visible: false,
        data: [],
        jackpotType: 0
      },

      cfg: {
        MinVersion: 0,
        Level: 1,
        BallNums: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        Bets: [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
        AutomaticTimes: [10, 20, 50, 80, 100, -1],
        AddTimesRow: [6, 10, 14],
        Splice: [1, 2, 3],
        WinType: [2, 6, 16],
        FeeRate: 1,
        JackpotNormal: 0,
        JackpotHight: 0,
        HappyRouletteCfg: [
          {
            Id: 1,
            Type: 2,
            HitRates: 1000,
            Num: 5
          },
          {
            Id: 2,
            Type: 1,
            HitRates: 1000,
            Num: 5000
          },
          {
            Id: 3,
            Type: 2,
            HitRates: 1000,
            Num: 10
          },
          {
            Id: 4,
            Type: 1,
            HitRates: 1000,
            Num: 4000
          },
          {
            Id: 5,
            Type: 2,
            HitRates: 1000,
            Num: 6
          },
          {
            Id: 6,
            Type: 1,
            HitRates: 1000,
            Num: 3000
          },
          {
            Id: 7,
            Type: 2,
            HitRates: 1000,
            Num: 8
          },
          {
            Id: 8,
            Type: 1,
            HitRates: 1000,
            Num: 2000
          },
          {
            Id: 9,
            Type: 2,
            HitRates: 1000,
            Num: 1
          },
          {
            Id: 10,
            Type: 1,
            HitRates: 1000,
            Num: 50000
          }
        ],
        LevelCfg: [
          {
            Level: 1,
            LuckyJPInitMoney: 0,
            LuckyJPOdds: 0,
            EnergyNum: 0,
            EnergyTransferRate: 0,
            LuckyJPTransferRate: 0,
            LuckyJPKey: '',
            LuckyJPRate: 10,
            SuperJPInitMoney: 0,
            SuperJPOdds: 0,
            SuperJPTransferRate: 0,
            superJPRate: 90,
            SuperJPKey: '',
            Channels: [
              {
                Id: -8,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200

              },
              {
                Id: -7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 10
              },
              {
                Id: -5,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 5
              },
              {
                Id: -4,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 5
              },
              {
                Id: 6,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 10
              },
              {
                Id: 7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -2
              }
            ]
          },
          {
            Level: 2,
            LuckyJPInitMoney: 100000,
            LuckyJPOdds: 50,
            LuckyJPTransferRate: 3,
            LuckyJPKey: 'jackpot_1',
            LuckyJPRate: 10,
            SuperJPInitMoney: 100000,
            SuperJPOdds: 200,
            SuperJPTransferRate: 3,
            SuperJPKey: 'jackpot_2',
            superJPRate: 90,
            Channels: [
              {
                Id: -8,
                HitRates: 80,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              },
              {
                Id: -7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: -5,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: -4,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 6,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 80,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -2
              }
            ]
          },
          {
            Level: 3,
            LuckyJPInitMoney: 100000,
            LuckyJPOdds: 50,
            LuckyJPTransferRate: 3,
            LuckyJPKey: 'jackpot_3',
            LuckyJPRate: 10,
            SuperJPInitMoney: 100000,
            SuperJPOdds: 200,
            SuperJPTransferRate: 3,
            SuperJPKey: 'jackpot_4',
            superJPRate: 90,
            Channels: [
              {
                Id: -8,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              },
              {
                Id: -7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: -6,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: -5,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: -4,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: -3,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: -2,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: -1,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 0,
                HitRates: 0,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0
              },
              {
                Id: 1,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 0.5
              },
              {
                Id: 2,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1
              },
              {
                Id: 3,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 1.5
              },
              {
                Id: 4,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 2
              },
              {
                Id: 5,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 6,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: -1
              },
              {
                Id: 7,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 30
              },
              {
                Id: 8,
                HitRates: 100,
                FirstTimesRates: 100,
                SecondTimesRates: 100,
                ThirdTimesRates: 100,
                Odds: 200
              }
            ],
            Spins: [
              {
                Id: 1,
                HitRates: 2000,
                Odds: 5
              },
              {
                Id: 2,
                HitRates: 2000,
                Odds: 10
              },
              {
                Id: 3,
                HitRates: 2000,
                Odds: 15
              },
              {
                Id: 4,
                HitRates: 1000,
                Odds: 20
              },
              {
                Id: 5,
                HitRates: 1000,
                Odds: 25
              },
              {
                Id: 6,
                HitRates: 800,
                Odds: 50
              },
              {
                Id: 7,
                HitRates: 500,
                Odds: 100
              },
              {
                Id: 8,
                HitRates: 500,
                Odds: 200
              },
              {
                Id: 9,
                HitRates: 100,
                Odds: 500
              },
              {
                Id: 10,
                HitRates: 50,
                Odds: -1
              },
              {
                Id: 11,
                HitRates: 50,
                Odds: -2
              }
            ]
          }
        ]
      },
      form: {
      },
      txt: '',
      subKey: 'miniWindrop_cfg',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      levelShow: { 1: 'low', 2: 'norml', 3: 'high' }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + 'miniWindrop_cfg'
    },
    addChannel(idx) {
      this.cfg.Channels.splice(idx + 1, 0, {
        ID: 0,
        Red: {
          Color: 1,
          Odds: 0,
          HitRates: 0
        },
        Green: {
          Color: 2,
          Odds: 0,
          HitRates: 0
        },
        Blue: {
          Color: 3,
          Odds: 0,
          HitRates: 0
        }
      })
    },
    delChannel(idx) {
      this.$delete(this.cfg.Channels, idx)
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
          // console.log('windrop reward',response)
          $this.form = response.Data || {}
          console.log('response.Data.Data', response.Data.Data)
          if (response.Data && response.Data.Data !== '') {
            var cfgJson = JSON.parse(response.Data.Data)
            for (var i in cfgJson.Bets) {
              cfgJson.Bets[i] /= 1000
            }
            cfgJson.BetsStr = cfgJson.Bets.join(',')
            cfgJson.BallNumsStr = cfgJson.BallNums.join(',')
            cfgJson.AutomaticTimesStr = cfgJson.AutomaticTimes.join(',')
            for (var k in cfgJson.HappyRouletteCfg) {
              if (cfgJson.HappyRouletteCfg[k].Type === 1) {
                cfgJson.HappyRouletteCfg[k].Num /= 1000
              }
            }
            this.cfg = cfgJson
            $this.item = cfgJson
            for (const k in this.item.JackpotRegulation.RandAwards) {
              this.item.JackpotRegulation.RandAwards[k].PoolVal /= 1000
            }
            this.JackpotRandAwards = this.item.JackpotRegulation.RandAwards
            console.log('JackpotRandAwards', this.JackpotRandAwards)

            for (const k in this.item.JackpotRegulation2.RandAwards) {
              this.item.JackpotRegulation2.RandAwards[k].PoolVal /= 1000
            }
            this.JackpotRandAwards2 = this.item.JackpotRegulation2.RandAwards
            console.log('JackpotRandAwards', this.JackpotRandAwards2)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
      // // 加载规则配置
      // request({
      //   url: '/customizeconfig/one',
      //   method: 'get',
      //   data: {
      //     SubKey: 'windrop_jackpot'
      //   }
      // }).then(response => {
      //   if (response.RetCode === 0) {
      //     this.ruleForm = response.Data || {}
      //     if (response.Data && response.Data.Data !== '') {
      //       this.item = JSON.parse(response.Data.Data)
      //       // 设置修改之前数据
      //       // this.$refs.compare.SetOldVal(response.Data.Data)
      //     }
      //     this.JackPotBool = true
      //     for (const k in this.item.JackpotRegulation.RandAwards) {
      //       this.item.JackpotRegulation.RandAwards[k].PoolVal /= 1000
      //     }
      //     this.JackpotRandAwards = this.item.JackpotRegulation.RandAwards
      //     console.log('JackpotRandAwards',this.JackpotRandAwards)
      //   }
      // })
    },
    getPostData() {
      const postData = {}
      Object.assign(postData, this.cfg)
      const jackpotInfo = {}
      const jackpotInfo2 = {}
      Object.assign(jackpotInfo, this.item.JackpotRegulation)
      console.log('jackpotInfo:', jackpotInfo)
      jackpotInfo.RandAwards = []
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        this.JackpotRandAwards[o].AwardRate = this.item.JackpotCfg[o].AwardRate // 同步奖励占比
        Object.assign(raObj, this.JackpotRandAwards[o])
        raObj.PoolVal *= 1000
        jackpotInfo.RandAwards.push(raObj)
      }
      postData.JackpotRegulation = jackpotInfo
      Object.assign(jackpotInfo2, this.item.JackpotRegulation2)
      jackpotInfo2.RandAwards = []
      for (const o in this.JackpotRandAwards2) {
        const raObj = {}
        this.JackpotRandAwards2[o].AwardRate = this.item.JackpotCfg2[o].AwardRate // 同步奖励占比
        Object.assign(raObj, this.JackpotRandAwards2[o])
        raObj.PoolVal *= 1000
        jackpotInfo2.RandAwards.push(raObj)
      }
      postData.JackpotRegulation2 = jackpotInfo2
      return postData
    },
    setData() {
      const obj = this.getPostData()
      const postData = JSON.parse(JSON.stringify(obj))
      console.log('postData:', postData)
      // 配置检查
      if (postData.BetsStr) {
        const bets = postData.BetsStr.split(',')
        postData.Bets = []
        for (const i in bets) {
          postData.Bets.push(parseFloat(bets[i]) * 1000)
        }
      }
      if (postData.BallNumsStr) {
        const ballNums = postData.BallNumsStr.split(',')
        postData.BallNums = []
        for (const i in ballNums) {
          postData.BallNums.push(parseFloat(ballNums[i]))
        }
      }
      if (postData.AutomaticTimesStr) {
        const automaticTimes = postData.AutomaticTimesStr.split(',')
        postData.AutomaticTimes = []
        for (const i in automaticTimes) {
          postData.AutomaticTimes.push(parseFloat(automaticTimes[i]))
        }
      }
      if (postData.HappyRouletteCfg) {
        for (const i in postData.HappyRouletteCfg) {
          if (postData.HappyRouletteCfg[i].Type === 1) {
            postData.HappyRouletteCfg[i].Num = parseFloat(postData.HappyRouletteCfg[i].Num) * 1000
            console.log()
          }
        }
      }
      this.form.Data = JSON.stringify(postData)
      //   console.log("this.form.Data ",this.form.Data )
      const $this = this
      // 设置修改后数据
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
            Message.success('保存成功')
          }
        })
      })
    },
    showUserArea() {
      this.showArea.visible = true
    },
    showOpenPoolRate(jpType, data) {
      console.log('data:', data)
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            showStr += data[i].Num + '个(' + data[i].Rate + '%);'
          }
        }
        return showStr
      }
    },
    saveIncrJackpotDialog() {
      for (var i = 0; i < this.item.JackpotRegulation.PoolIncrArr.length; i++) {
        if (this.item.JackpotRegulation.PoolIncrArr[i].Id == this.incrJackpotForm.id) {
          this.item.JackpotRegulation.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (var j = 0; j < this.item.JackpotRegulation.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.JackpotRegulation.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
          }
          break
        }
      }
      this.incrJackpotForm.visible = false
    },
    addPoolNum() {
      let maxId = 0
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id > maxId) {
          maxId = this.poolNumChange.data[i].Id
        }
      }
      maxId++
      this.poolNumChange.data.push({ 'Id': maxId, 'Num': 0, 'Rate': 0 })
    },
    removePoolNum(id) {
      for (var i = 0; i < this.poolNumChange.data.length; i++) {
        if (this.poolNumChange.data[i].Id == id) {
          this.poolNumChange.data.splice(i, 1)
          break
        }
      }
    },
    savePoolNum() {
      for (var i = 0; i < this.JackpotRandAwards.length; i++) {
        if (this.poolNumChange.jackpotType == this.JackpotRandAwards[i].JackpotType) {
          this.JackpotRandAwards[i].RateArr = this.poolNumChange.data
          break
        }
      }
      this.poolNumChange.visible = false
    },
    checkShowDayLimit(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showPoolNumDialog(data) {
      console.log('showPoolNumDialog:', data)
      if (data.JackpotType == 4) {
        return
      }
      this.poolNumChange.title = this.JackpotTypeCfg[data.JackpotType] + '(开奖数量概率)'
      this.poolNumChange.data = data.RateArr
      this.poolNumChange.visible = true
      this.poolNumChange.jackpotType = data.JackpotType
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
    showIncrJackpotForm(data) {
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (let i = 0; i < data.TimeArr.length; i++) {
        console.log(data.TimeArr[i])
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }
      // for (const l in this.incrJackpotForm.data) {
      //   this.incrJackpotForm.data[l].PerHourIncr /= 1000
      // }
      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    },
    goSearch() {
      this.showArea.showUlReslt = false
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/show/miniWindrop',
          Gid: 103,
          Uid: this.showArea.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('response reward', response)
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.windropData = response.Data.details
              this.showArea.showUlReslt = true
            } else {
              this.$message.error(response.Data)
            }
          }
        }
      })
    },

    showUserArea2() {
      this.showArea2.visible = true
    },
    showOpenPoolRate2(jpType, data) {
      console.log('data:', data)
      if (jpType == 4) {
        return '不限制'
      } else {
        let showStr = ''
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            showStr += data[i].Num + '个(' + data[i].Rate + '%);'
          }
        }
        return showStr
      }
    },
    saveIncrJackpotDialog2() {
      for (var i = 0; i < this.item.JackpotRegulation2.PoolIncrArr.length; i++) {
        if (this.item.JackpotRegulation2.PoolIncrArr[i].Id == this.incrJackpotForm2.id) {
          this.item.JackpotRegulation2.PoolIncrArr[i].TimeArr = this.incrJackpotForm2.data
          for (var j = 0; j < this.item.JackpotRegulation2.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.JackpotRegulation2.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
          }
          break
        }
      }
      this.incrJackpotForm2.visible = false
    },
    addPoolNum2() {
      let maxId = 0
      for (var i = 0; i < this.poolNumChange2.data.length; i++) {
        if (this.poolNumChange2.data[i].Id > maxId) {
          maxId = this.poolNumChange2.data[i].Id
        }
      }
      maxId++
      this.poolNumChange2.data.push({ 'Id': maxId, 'Num': 0, 'Rate': 0 })
    },
    removePoolNum2(id) {
      for (var i = 0; i < this.poolNumChange2.data.length; i++) {
        if (this.poolNumChange2.data[i].Id == id) {
          this.poolNumChange2.data.splice(i, 1)
          break
        }
      }
    },
    savePoolNum2() {
      for (var i = 0; i < this.JackpotRandAwards2.length; i++) {
        if (this.poolNumChange2.jackpotType == this.JackpotRandAwards2[i].JackpotType) {
          this.JackpotRandAwards2[i].RateArr = this.poolNumChange2.data
          break
        }
      }
      this.poolNumChange2.visible = false
    },
    checkShowDayLimit2(awardType) {
      if (awardType == 2) {
        return true
      } else {
        return false
      }
    },
    showPoolNumDialog2(data) {
      console.log('showPoolNumDialog:', data)
      if (data.JackpotType == 4) {
        return
      }
      this.poolNumChange2.title = this.JackpotTypeCfg2[data.JackpotType] + '(开奖数量概率)'
      this.poolNumChange2.data = data.RateArr
      this.poolNumChange2.visible = true
      this.poolNumChange2.jackpotType = data.JackpotType
    },
    // 展示jackpot奖池增长标题
    getJackpotPoolTitle2(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    // 展示jackpot每小时增长值
    getJackpotIncrShow2(row, startHour, endHour) {
      let showNum = 0
      for (let i = 0; i < row.TimeArr.length; i++) {
        if (row.TimeArr[i].StartHour == startHour && row.TimeArr[i].EndHour == endHour) {
          showNum = row.TimeArr[i].PerHourIncr / 1000
          break
        }
      }
      return showNum.toLocaleString()
    },
    showIncrJackpotForm2(data) {
      this.incrJackpotForm2.id = data.Id
      this.incrJackpotForm2.data = []
      for (let i = 0; i < data.TimeArr.length; i++) {
        console.log(data.TimeArr[i])
        this.incrJackpotForm2.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }
      // for (const l in this.incrJackpotForm2.data) {
      //   this.incrJackpotForm2.data[l].PerHourIncr /= 1000
      // }
      this.incrJackpotForm2.title = '编辑' + this.getJackpotPoolTitle2(data)
      this.incrJackpotForm2.visible = true
    },
    goSearch2() {
      this.showArea2.showUlReslt = false
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/show/miniWindrop',
          Gid: 103,
          Uid: this.showArea2.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('response reward', response)
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              this.windropData2 = response.Data.details
              this.showArea2.showUlReslt = true
            } else {
              this.$message.error(response.Data)
            }
          }
        }
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

#windropShow table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

#windropShow table td{
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}

</style>
