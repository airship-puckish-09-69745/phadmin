<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-button type="warning" round @click="showUserArea">用户在玩雷区</el-button>
    <div>
      <el-form ref="item" :model="item" label-width="200px">
        <el-row :gutter="10" style="margin-top: 30px">
          <el-col :span="7">
            <el-form-item label="最大人数：" prop="maxPlayers">
              <el-col :span="7">
                <el-input v-model.number="item.maxPlayers" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="小黑屋最大真人数(需重启)：" prop="vupRoomMaxUsers">
              <el-col :span="7">
                <el-input v-model.number="item.vupRoomMaxUsers" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="入场限制：" prop="minMoneyCarry">
              <el-col :span="7">
                <el-input v-model="item.minMoneyCarry" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="扫雷格子数：" prop="cellNum">
              <el-col :span="7">
                <el-input v-model.number="item.cellNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最小炸弹数：" prop="minBombNum">
              <el-col :span="7">
                <el-input v-model.number="item.minBombNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大炸弹数：" prop="maxBombNum">
              <el-col :span="7">
                <el-input v-model.number="item.maxBombNum" disabled :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="最小下注：" prop="minMoneyBet">
              <el-col :span="7">
                <el-input v-model="item.minMoneyBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大下注：" prop="maxMoneyBet">
              <el-col :span="7">
                <el-input v-model.number="item.maxMoneyBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="赢钱转化百分比：" prop="winMoneyTransferRate">
              <el-col :span="7">
                <el-input v-model.number="item.winMoneyTransferRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="超时放弃时间(秒)：" prop="giveUpTime">
              <el-col :span="7">
                <el-input v-model.number="item.giveUpTime" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="允许最大倍数(放大百倍)：" prop="allowMaxBet">
              <el-col :span="7">
                <el-input v-model.number="item.allowMaxBet" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="小黑屋用户爆炸概率(%)：" prop="vupBombRate">
              <el-col :span="7">
                <el-input v-model.number="item.vupBombRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="保底奖池抽水(%)：" prop="feeRate">
              <el-col :span="7">
                <el-input v-model.number="item.feeRate" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col>
            <el-form-item label="下注额度(值用 , 连接如 200,100,50,20,10,5,1,11)" prop="betMoneyList">
              <el-col :span="7">
                <el-input v-model="betMoneyList" :required="true" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <table class="formTable" style="width:700px;margin-left: 50px;">
          <thead>
            <tr>
              <td>按钮</td>
              <td>类型</td>
              <td>数值</td>
              <td>展示文字</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>一</td>
              <td>
                <el-select v-model="btnType1" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum1" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow1" :required="true" />
              </td>
            </tr>
            <tr>
              <td>二</td>
              <td>
                <el-select v-model="btnType2" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum2" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow2" :required="true" />
              </td>
            </tr>
            <tr>
              <td>三</td>
              <td>
                <el-select v-model="btnType3" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum3" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow3" :required="true" />
              </td>
            </tr>
            <tr>
              <td>四</td>
              <td>
                <el-select v-model="btnType4" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum4" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow4" :required="true" />
              </td>
            </tr>
            <tr>
              <td>五</td>
              <td>
                <el-select v-model="btnType5" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum5" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow5" :required="true" />
              </td>
            </tr>
            <tr>
              <td>六</td>
              <td>
                <el-select v-model="btnType6" placeholder="请选择">
                  <el-option
                    v-for="item in btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model.number="btnNum6" :required="true" />
              </td>
              <td>
                <el-input v-model="btnShow6" :required="true" />
              </td>
            </tr>
          </tbody>
        </table>
        </el-row>
        <el-scrollbar>
          <table class="formTable">
            <thead>
              <tr>
                <td rowspan="2" width="50">炸弹个数</td>
                <td colspan="23">扫中金币倍数（放大百倍）</td>
              </tr>
              <tr>
                <td v-for="cloumnNum in 23" :key="cloumnNum">{{ cloumnNum }}个</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in item.betOptions" :key="index">
                <td>{{ index }}</td>
                <td v-for="i in 23" :key="i">
                  <span v-if="!betOptionEdit[index][i]" style="font-size: 12px" @click="setEditable(index,i)">{{ item[i]?item[i]/100:'' }}</span>
                  <el-input v-else v-model.number="item[i]" size="mini" />
                </td>
              </tr>
            </tbody>
          </table>
        </el-scrollbar>

        <table class="formTable" style="margin-top:20px;">
          <thead>
            <tr>
              <td colspan="24">解锁jackpot条件</td>
            </tr>
            <tr>
              <td width="50">炸弹个数</td>
              <td v-for="cloumnNum in 23" :key="cloumnNum">{{ cloumnNum+1 }}个</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="50">翻中金币</td>
              <td v-for="index in 23" :key="index">
                <el-input v-model.number="item.jackpotShowOption[index+1]" :required="true" />
              </td>
            </tr>
          </tbody>
        </table>

        <fieldset style="margin-top:20px;">
          <legend>jackpot调控配置</legend>

          <el-row :gutter="10" style="margin-top:20px;">
            <el-col :span="7">
              <el-form-item label="本局下注额度(≥)：">
                <el-input v-model.number="item.Jackpot.BetMoreThan" size="mini" :required="true" style="width:100px" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出现jackpot之前抽水：">
                <el-input v-model.number="item.Jackpot.AddPoolPctPreJp" size="mini" :required="true" style="width:100px" />(‰)
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出现jackpot之后抽水：">
                <el-input v-model.number="item.Jackpot.AddPoolPctAfterJp" size="mini" :required="true" style="width:100px" />(‰)
              </el-form-item>
            </el-col>
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
                  <el-select v-model="scope.row.JackpotType" disabled>
                    <el-option
                      v-for="typeItem in JackpotTypes"
                      :key="typeItem.value"
                      :label="typeItem.label"
                      :value="typeItem.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="奖励发放类型" prop="AwardType">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.AwardType" disabled>
                    <el-option
                      v-for="typeItem in AwardTypes"
                      :key="typeItem.Type"
                      :label="typeItem.Name"
                      :value="typeItem.Type"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="发放数量" prop="Value">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Value" style="width: 150px;" size="mini" :required="true">
                    <template v-if="scope.row.AwardType==1" slot="append">%</template>
                    <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                  </el-input>
                </template>
              </el-table-column>
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

              <el-table-column label="机器人开奖数量概率（5min 一次）" prop="RateArr">
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
            :data="item.Jackpot.PoolIncrArr"
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

        <fieldset style="margin-top:20px;">
          <legend>jackpot审核版本调控配置</legend>
          <el-row :gutter="10" style="margin-top:20px;">
            <el-col :span="7">
              <el-form-item label="本局下注额度(≥)：">
                <el-input v-model.number="item.JackpotV2.BetMoreThan" size="mini" :required="true" style="width:100px" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出现jackpot之前抽水：">
                <el-input v-model.number="item.JackpotV2.AddPoolPctPreJp" size="mini" :required="true" style="width:100px" />(‰)
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出现jackpot之后抽水：">
                <el-input v-model.number="item.JackpotV2.AddPoolPctAfterJp" size="mini" :required="true" style="width:100px" />(‰)
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              ref="filterTable"
              :data="JackpotRandAward"
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column type="index" />
              <el-table-column label="奖励类型" prop="JackpotType">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.JackpotType" disabled>
                    <el-option
                      v-for="typeItem in JackpotTypes"
                      :key="typeItem.value"
                      :label="typeItem.label"
                      :value="typeItem.value"
                    />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="发放数量" prop="Value">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Value" style="width: 150px;" size="mini" :required="true">
                    <template v-if="scope.row.AwardType==1" slot="append">%</template>
                    <template v-if="scope.row.AwardType==2" slot="append">倍</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="中奖概率" prop="JackpotRate">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.JackpotRate" style="width: 150px;" size="mini" :required="true">
                    <template slot="append">‱</template>
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-row>

        </fieldset>

        <el-form-item>
          <el-button type="primary" @click="setData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="查看玩家在玩雷区"
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
          <el-form-item label="生成雷区：">
            <div v-if="showArea.showUlReslt">
              <ul id="sweeperShow">
                <li v-for="(o,key) in showArea.result" :key="key" :label="o" :value="key">
                  {{ o.result }}
                  <div class="showStep">
                    {{ o.step }}
                  </div>
                </li>
              </ul>
            </div>
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
        <el-table-column label="开出数量" prop="Num">
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

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      item: {
        cellNum: 25,
        minBombNum: 2,
        maxBombNum: 24,
        minMoneyCarry: 1000,
        maxPlayers: 500,
        vupRoomMaxUsers: 1,
        winMoneyTransferRate: 20,
        minMoneyBet: 0,
        maxMoneyBet: 0,
        betOptions: [],
        giveUpTime: 300,
        btnOptions: [],
        allowMaxBet: 100000,
        vupBombRate: 0,
        feeRate: 0,

        TableMoneyList: [],
        Jackpot: {
          BetMoreThan: 0,
          AddPoolPctAfterJp: 0,
          AddPoolPctPreJp: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ],
          // PoolIncrArr: [{ 'Id': 1, 'MinPool': 0, 'MaxPool': 200000000, 'TimeArr': [{ 'EndHour': 1, 'Index': 1, 'StartHour': 0, 'PerHourIncr': 40000000 }, { 'EndHour': 6, 'Index': 2, 'StartHour': 2, 'PerHourIncr': 20000000 }, { 'EndHour': 8, 'Index': 3, 'StartHour': 7, 'PerHourIncr': 40000000 }, { 'EndHour': 17, 'Index': 4, 'StartHour': 9, 'PerHourIncr': 50000000 }, { 'EndHour': 23, 'Index': 5, 'StartHour': 18, 'PerHourIncr': 60000000 }] }, { 'Id': 2, 'MinPool': 200000000, 'MaxPool': 250000000, 'TimeArr': [{ 'Index': 1, 'StartHour': 0, 'EndHour': 1, 'PerHourIncr': 15000000 }, { 'Index': 2, 'StartHour': 2, 'EndHour': 6, 'PerHourIncr': 10000000 }, { 'Index': 3, 'StartHour': 7, 'EndHour': 8, 'PerHourIncr': 20000000 }, { 'Index': 4, 'StartHour': 9, 'EndHour': 17, 'PerHourIncr': 25000000 }, { 'Index': 5, 'StartHour': 18, 'EndHour': 23, 'PerHourIncr': 30000000 }] }, { 'Id': 3, 'MinPool': 250000000, 'MaxPool': 300000000, 'TimeArr': [{ 'Index': 1, 'StartHour': 0, 'EndHour': 1, 'PerHourIncr': 7500000 }, { 'Index': 2, 'StartHour': 2, 'EndHour': 6, 'PerHourIncr': 5000000 }, { 'Index': 3, 'StartHour': 7, 'EndHour': 8, 'PerHourIncr': 10000000 }, { 'Index': 4, 'StartHour': 9, 'EndHour': 17, 'PerHourIncr': 12500000 }, { 'Index': 5, 'StartHour': 18, 'EndHour': 23, 'PerHourIncr': 15000000 }] }, { 'Id': 4, 'MinPool': 300000000, 'MaxPool': -1, 'TimeArr': [{ 'EndHour': 1, 'Index': 1, 'StartHour': 0, 'PerHourIncr': 3000000 }, { 'EndHour': 6, 'Index': 2, 'StartHour': 2, 'PerHourIncr': 2000000 }, { 'EndHour': 8, 'Index': 3, 'StartHour': 7, 'PerHourIncr': 4000000 }, { 'EndHour': 17, 'Index': 4, 'StartHour': 9, 'PerHourIncr': 5000000 }, { 'EndHour': 23, 'Index': 5, 'StartHour': 18, 'PerHourIncr': 6000000 }] }]
          PoolIncrArr: []
        },
        JackpotV2: {
          BetMoreThan: 0,
          AddPoolPctAfterJp: 0,
          AddPoolPctPreJp: 0,
          RandAwards: [
            { 'AwardType': 1, 'Value': 10, 'PoolVal': 0, 'DayLimit': 0, 'RateArr': [], 'VrPoolRate': 0, 'RealPoolRate': 0, 'JackpotRate': 0 }
          ]
        },
        jackpotShowOption: { '2': 14, '3': 12, '4': 8, '5': 6, '6': 5, '7': 5, '8': 4, '9': 4, '10': 3, '11': 3, '12': 2, '13': 2, '14': 2, '15': 2, '16': 2, '17': 2, '18': 2, '19': 1, '20': 1, '21': 1, '22': 1, '23': 1, '24': 1 }
      },
      //
      JackpotRandAwards: [],
      JackpotRandAward: [{ 'AwardType': 1, 'Value': 50, 'PoolVal': 200000, 'RateArr': [{ 'Id': 1, 'Num': 0, 'Rate': 80 }, { 'Id': 2, 'Num': 1, 'Rate': 20 }], 'JackpotType': 1, 'DayLimit': 1 }, { 'AwardType': 1, 'Value': 20, 'PoolVal': 100000, 'RateArr': [{ 'Id': 1, 'Num': 0, 'Rate': 0 }, { 'Id': 2, 'Num': 1, 'Rate': 0 }, { 'Id': 3, 'Num': 2, 'Rate': 100 }], 'JackpotType': 2, 'DayLimit': 3 }, { 'AwardType': 1, 'Value': 10, 'PoolVal': 8000, 'RateArr': [{ 'Id': 1, 'Num': 2, 'Rate': 40 }, { 'Id': 2, 'Num': 3, 'Rate': 30 }, { 'Id': 3, 'Num': 4, 'Rate': 30 }], 'JackpotType': 3, 'DayLimit': 40 }],
      betMoneyList: '200,100',
      betOptionEdit: [],
      subKey: 'gameSweeper',
      libShow: $libShow,
      AttrNames: {
        'Data.WinMoneyTransferRate': '赢钱转化百分比',
        'Data.MinMoneyBet': '最小下注',
        'Data.MaxMoneyBet': '最大下注',
        'Data.CellNum': '扫雷格子数',
        'Data.MinBombNum': '最小炸弹数',
        'Data.MaxBombNum': '最大炸弹数',
        'Data.MinMoneyCarry': '入场限制',
        'Data.MaxPlayers': '最大人数',
        'Data.VupRoomMaxUsers': '小黑屋最大真人数'
      },
      btnOptions: [
        {
          value: 1,
          label: '+'
        },
        {
          value: 2,
          label: '-'
        },
        {
          value: 3,
          label: '*'
        },
        {
          value: 4,
          label: '/'
        }
      ],
      JackpotTypes: [
        { 'label': '一等奖', 'value': 1 },
        { 'label': '二等奖', 'value': 2 },
        { 'label': '三等奖', 'value': 3 },
        { 'label': '3Bet中奖', 'value': 4 }
      ],
      AwardTypes: [
        { 'Type': 1, 'Name': '奖池百分比' },
        { 'Type': 2, 'Name': '下注额倍数' }
      ],
      robotDialogForm: {
        visible: false,
        data: {}
      },
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

      btnType1: 1,
      btnNum1: 0,
      btnShow1: '',

      btnType2: 1,
      btnNum2: 0,
      btnShow2: '',

      btnType3: 1,
      btnNum3: 0,
      btnShow3: '',

      btnType4: 1,
      btnNum4: 0,
      btnShow4: '',

      btnType5: 1,
      btnNum5: 0,
      btnShow5: '',

      btnType6: 1,
      btnNum6: 0,
      btnShow6: '',

      showArea: {
        visible: false,
        uid: 0,
        result: [],
        showUlReslt: false
      }
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
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            console.log(this.item)
            $this.betOptionEdit = JSON.parse(JSON.stringify(item.betOptions))
            for (const i in item.betOptions) {
              const obs = item.betOptions[i]
              for (const j in obs) {
                $this.betOptionEdit[i][j] = false
              }
            }

            this.item.btnOptions.forEach(item => {
              if (item.btnIndex == 1) {
                this.btnType1 = item.btnType
                this.btnNum1 = item.btnVal / 1000
                this.btnShow1 = item.btnShow
              } else if (item.btnIndex == 2) {
                this.btnType2 = item.btnType
                this.btnNum2 = item.btnVal / 1000
                this.btnShow2 = item.btnShow
              } else if (item.btnIndex == 3) {
                this.btnType3 = item.btnType
                this.btnNum3 = item.btnVal / 1000
                this.btnShow3 = item.btnShow
              } else if (item.btnIndex == 4) {
                this.btnType4 = item.btnType
                this.btnNum4 = item.btnVal / 1000
                this.btnShow4 = item.btnShow
              } else if (item.btnIndex == 5) {
                this.btnType5 = item.btnType
                this.btnNum5 = item.btnVal / 1000
                this.btnShow5 = item.btnShow
              } else if (item.btnIndex == 6) {
                this.btnType6 = item.btnType
                this.btnNum6 = item.btnVal / 1000
                this.btnShow6 = item.btnShow
              }
            })

            this.transMoneyForShow()
            for (const i in this.item.TableMoneyList) {
              this.item.TableMoneyList[i] /= 1000
            }
            this.betMoneyList = this.item.TableMoneyList ? this.item.TableMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.JackpotRandAwards = this.item.Jackpot.RandAwards

            this.JackpotRandAward = this.item.JackpotV2.RandAwards

            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    transMoneyForShow() {
      this.item.minMoneyBet /= 1000
      this.item.maxMoneyBet /= 1000
      this.item.minMoneyCarry /= 1000
      this.item.Jackpot.BetMoreThan /= 1000
      this.item.JackpotV2.BetMoreThan /= 1000
      for (const k in this.item.Jackpot.RandAwards) {
        this.item.Jackpot.RandAwards[k].PoolVal /= 1000
      }
    },
    getPostData() {
      const ret = {}
      // 处理一下按钮
      this.item.btnOptions = []
      this.item.btnOptions[0] = {
        btnIndex: 1,
        btnType: this.btnType1,
        btnVal: this.btnNum1 * 1000,
        btnShow: this.btnShow1
      }
      this.item.btnOptions[1] = {
        btnIndex: 2,
        btnType: this.btnType2,
        btnVal: this.btnNum2 * 1000,
        btnShow: this.btnShow2
      }
      this.item.btnOptions[2] = {
        btnIndex: 3,
        btnType: this.btnType3,
        btnVal: this.btnNum3 * 1000,
        btnShow: this.btnShow3
      }
      this.item.btnOptions[3] = {
        btnIndex: 4,
        btnType: this.btnType4,
        btnVal: this.btnNum4 * 1000,
        btnShow: this.btnShow4
      }
      this.item.btnOptions[4] = {
        btnIndex: 5,
        btnType: this.btnType5,
        btnVal: this.btnNum5 * 1000,
        btnShow: this.btnShow5
      }
      this.item.btnOptions[5] = {
        btnIndex: 6,
        btnType: this.btnType6,
        btnVal: this.btnNum6 * 1000,
        btnShow: this.btnShow6
      }
      const items = this.betMoneyList.split(',')
      this.item.TableMoneyList = []
      for (const o in items) {
        this.item.TableMoneyList.push(parseInt(items[o]) * 1000)
      }

      Object.assign(ret, this.item)
      ret.minMoneyBet *= 1000
      ret.maxMoneyBet *= 1000
      ret.minMoneyCarry *= 1000

      const jackpotInfo = {}
      Object.assign(jackpotInfo, this.item.Jackpot)
      jackpotInfo.RandAwards = []
      jackpotInfo.BetMoreThan *= 1000
      for (const o in this.JackpotRandAwards) {
        const raObj = {}
        Object.assign(raObj, this.JackpotRandAwards[o])
        // if (raObj.AwardType == 2) {
        raObj.PoolVal *= 1000
        // }
        jackpotInfo.RandAwards.push(raObj)
      }
      ret.Jackpot = jackpotInfo

      const jackpotInfoV2 = {}
      Object.assign(jackpotInfoV2, this.item.JackpotV2)
      jackpotInfoV2.RandAwards = []
      jackpotInfoV2.BetMoreThan *= 1000
      for (const o in this.JackpotRandAward) {
        const raObj = {}
        Object.assign(raObj, this.JackpotRandAward[o])
        jackpotInfoV2.RandAwards.push(raObj)
      }
      ret.JackpotV2 = jackpotInfoV2
      console.log(ret.JackpotV2)
      return ret
    },
    setData() {
      this.form.Data = JSON.stringify(this.getPostData())
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
    },
    showUserArea() {
      this.showArea.visible = true
    },
    setEditable(i, j) {
      for (const i in this.betOptionEdit) {
        for (const j in this.betOptionEdit[i]) {
          this.betOptionEdit[i][j] = false
        }
      }
      this.betOptionEdit[i][j] = true
    },
    showOpenPoolRate(jpType, data) {
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
      for (var i = 0; i < this.item.Jackpot.PoolIncrArr.length; i++) {
        if (this.item.Jackpot.PoolIncrArr[i].Id == this.incrJackpotForm.id) {
          this.item.Jackpot.PoolIncrArr[i].TimeArr = this.incrJackpotForm.data
          for (var j = 0; j < this.item.Jackpot.PoolIncrArr[i].TimeArr.length; j++) {
            this.item.Jackpot.PoolIncrArr[i].TimeArr[j].PerHourIncr *= 1000
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
      if (data.JackpotType == 4) {
        return
      }
      let jpTypeName = ''
      for (var i = 0; i < this.JackpotTypes.length; i++) {
        if (this.JackpotTypes[i].value == data.JackpotType) {
          jpTypeName = this.JackpotTypes[i].label
          break
        }
      }
      this.poolNumChange.title = jpTypeName + '(开奖数量概率)'
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
      this.showArea.result = []
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/show/area',
          Gid: 20,
          Uid: this.showArea.uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            if (response.RetCode === 0) {
              const showDetail = []
              for (let i = 0; i < response.Data.details.length; i++) {
                const detailRow = response.Data.details[i]
                const areaIndex = detailRow.index - 1
                let showName = '炸弹'
                if (detailRow.result == 1) {
                  showName = '金币'
                }
                showDetail[areaIndex] = { result: showName, step: detailRow.step }
              }
              this.showArea.result = showDetail
              console.log(this.showArea.result)
              this.showArea.showUlReslt = true
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

<style scoped>
.formTable {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.formTable td {
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}

ul#sweeperShow {
  width: 801px;
  height: 801px;
  padding: 0px;
  clear: both;
  margin: 0;
  list-style: none;
  border-top: #999 1px solid;
  border-left: #999 1px solid;
}

ul#sweeperShow li {
  width: 160px;
  height: 160px;
  font-size: 35px;
  float: left;
  margin: 0px;
  border: none;
  list-style: none;
  line-height: 150px;
  border-right: #999 1px solid;
  border-bottom: #999 1px solid;
}

ul#sweeperShow li .showStep {
  width: 30px;
  height: 30px;
  font-size: 21px;
  line-height: 30px;
  border-top: 1px #999 solid;
  border-right: 1px #999 solid;
  text-align: center;
  float: left;
  margin-top: 130px;
  margin-right: 18px;
}
</style>
