<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>

        <el-form-item label="日期：">
          <el-date-picker
            v-model="item.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="isVup"
          /> 小黑屋
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showChart">输赢图表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="gid==20 && dataArr.length!=0" type="warning" size="mini" @click="checkSweeperRate">扫雷概率</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="sweeperRateVisible">
      <el-table
        :data="sweeperRate"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          label="数量"
          type="index"
          width="100"
        />
        <el-table-column
          prop="Bomb"
          label="爆炸数"
          width="100"
        />
        <el-table-column
          prop="Total"
          label="点击数"
          width="100"
        />
        <el-table-column
          prop="Rate"
          label="爆炸概率"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="scope.row.Rate>=scope.row.STD?'color:green':'color:red'">{{ scope.row.Rate.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="STD"
          label="标准概率"
          width="100"
        />
      </el-table>
    </el-row>
    <el-row>
      <el-col :offset="6" :span="12">
        <el-descriptions
          class="margin-top"
          :column="3"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总赢：">{{ formatNumber(item.win + item.lose) }}</el-descriptions-item>
          <el-descriptions-item label="输局数："> {{ item.loseCount }}</el-descriptions-item>
          <el-descriptions-item label="赢局数：">{{ item.winCount }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
      @row-click="clickData"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable="custom"
        width="100"
      />
      <el-table-column
        prop="FinishTime"
        label="完成时间"
        sortable
        width="200"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="2" :timestamp="scope.row.FinishTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Uid"
        label="Uid"
        width="150"
      />
      <el-table-column
        prop="TableMoney"
        label="前注"
        width="100"
      >
        <template v-slot:header>
          <el-select v-model="clientDB.FilterValueMap['TableMoney']" size="mini" @change="handleFilter">
            <el-option label="前注" :value="0" />
            <el-option v-for="(o,key) in clientDB.FilterMap['TableMoney']" :key="key" :label="o" :value="key" />
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ formatNumber(scope.row.TableMoney) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MoneyChanged"
        label="输赢"
        width="100"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.MoneyChanged >0?'red':'green'}">
            {{ formatNumber(scope.row.MoneyChanged) }}
          </span>
        </template>
      </el-table-column>
      <template>
        <template v-if="gid===10">
          <el-table-column
            prop="RandVal"
            :label="getRandValName()"
            width="100"
          >
            <template slot-scope="scope">
              {{ isBingo(scope.row.RandVal, scope.row.WinRate) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="WinRate"
            label="自动下车值"
            width="100"
          />
        </template>
      </template>
      <template v-if="gid!==10">
        <el-table-column
          prop="ServiceFee"
          :label="getServiceFeeName()"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.ServiceFee) }}
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="MoneyNow"
        label="余额"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow) }}
        </template>
      </el-table-column>

      <template v-if="gid!==10">
        <el-table-column
          prop="WinRate"
          :label="getWinRateName()"
          width="100"
        />
      </template>
      <template>
        <template v-if="gid==1 || gid==8 || gid==9">
          <el-table-column
            prop="RandVal"
            :label="getRandValName()"
            width="100"
          >
            <template slot-scope="scope">
              {{ isBingo(scope.row.RandVal, scope.row.WinRate) }}
            </template>
          </el-table-column>

          <!--      IsPeiResult    int32 `json:"PeiVal"`         //最终命中的值 0无 1命中赢配牌 2命中输配牌-->
          <!--      LevelChanged   int32 `json:"LevelChanged"`   //幸运等级调控变化值-->
          <!--      TheResult      int32 `json:"TheResult"`      //最终结果：1中立 2赢符和预期 3赢不符合预期 4输符和预期 5输不符合预期-->
          <el-table-column
            prop="IsPeiResult"
            label="配牌标记"
            width="101"
          >
            <template slot-scope="scope">
              {{ FIsPeiResult(scope.row.IsPeiResult) }}
            </template>
          </el-table-column>

          <!--      <el-table-column-->
          <!--        prop="PeiVal"-->
          <!--        label="配牌标记"-->
          <!--        width="100"-->
          <!--      >-->
          <!--        <template slot-scope="scope">-->
          <!--          {{ peiValStr(scope.row.RandVal,scope.row.WinRate,scope.row.PeiVal) }}-->
          <!--        </template>-->
          <!--      </el-table-column>-->

          <!--      <el-table-column-->
          <!--        prop="Result"-->
          <!--        label="最终结果"-->
          <!--        width="100"-->
          <!--      >-->
          <!--        <template slot-scope="scope">-->
          <!--          {{ CalResult(scope.row.RandVal, scope.row.WinRate, scope.row.MoneyChanged, scope.row.PeiVal) }}-->
          <!--        </template>-->
          <!--      </el-table-column>-->

          <el-table-column
            prop="TheResult"
            label="最终结果"
            width="120"
          >
            <template slot-scope="scope">
              <span :style="{color:(scope.row.TheResult==3||scope.row.TheResult==5)?'red':''}">{{
                FTheResult(scope.row.TheResult)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="LuckyVal"
            label="幸运值"
            width="100"
          />
          <el-table-column
            prop="IsPractice"
            label="练习场"
            width="100"
          >
            <template v-slot:header>
              <el-select v-model="clientDB.FilterValueMap['IsPractice']" size="mini" @change="handleFilter">
                <el-option label="练习场" :value="0" />
                <el-option v-for="(o,key) in clientDB.FilterMap['IsPractice']" :key="key" :label="o" :value="key" />
              </el-select>
            </template>
            <template slot-scope="scope">
              {{ clientDB.GetShowValue('IsPractice', scope.row.IsPractice) }}
            </template>
          </el-table-column>

          <el-table-column prop="AlteredRobotCards" label="改机器人牌" width="100">
            <template slot-scope="scope">
              <span>{{ IsAlteredRobotsCards(scope.row.AlteredRobotCards) }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="gid !== 10">
          <el-table-column
            prop="IsPractice"
            label="小黑屋"
            width="100"
          />
        </template>
      </template>

      <el-table-column
        prop="LogID"
        label="LogID"
        min-width="100"
      />
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="牌局详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <el-table
        ref="filterTable"
        :data="detailData"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="200"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Hit ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Result"
          label="下注结果"
          width="800"
        >
          <template slot-scope="scope">
            <el-table
              ref="filterTable"
              :data="scope.row.Ret"
              border
              :show-header="scope.row.ID==1?true:false"
              :row-class-name="tableRowClassName"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="Uid"
                width="150"
              />
              <el-table-column
                prop="Money"
                label="资产"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Money / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Bet"
                label="下注"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Bet / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Won"
                label="输赢"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Won>0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="牌局过程"
      :visible.sync="actionVisible"
      width="50%"
    >
      <div v-show="showPublicCars" style=" font-size:14px; line-height: 18px; height: 25px;"><span style="float:left;">公共牌：</span><div style="float:left; " v-html="showCard(publicCards)" /></div>
      <el-table
        ref="filterTable"
        :data="actions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="70"
        />
        <el-table-column
          prop="uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="seat"
          label="座位"
          width="100"
        />
        <el-table-column
          label="手牌"
          width="100"
        >
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.Cards)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="actionType"
          label="动作"
          width="100"
        >
          <template slot-scope="scope">
            {{ actionNames[scope.row.actionType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionMoney"
          label="金币"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionMoney / 1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="底池"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.total / 1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actionBySystem"
          label="系统"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.actionBySystem ? "是" : "否" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="牌局详情"
      :visible.sync="baccaratVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">庄家牌：</span><div style="float:left; " v-html="showCard(baccaratDealerCards)" />
        <span style="float:left; margin-left:20px;">闲家牌：</span><div style="float:left; " v-html="showCard(baccaratPlayerCards)" />
      </div>
      <el-table
        ref="filterTable"
        :data="baccaratOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="200"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Hit ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Result"
          label="下注结果"
          width="800"
        >
          <template slot-scope="scope">
            <el-table
              ref="filterTable"
              :data="scope.row.Ret"
              border
              :show-header="scope.row.ID==1?true:false"
              :row-class-name="tableRowClassName"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="Uid"
                width="150"
              />
              <el-table-column
                prop="Money"
                label="资产"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Money / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Bet"
                label="下注"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Bet / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Won"
                label="输赢"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Won>0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="雷区详情"
      :visible.sync="sweeperVisible"
      width="650px"
    >
      <ul id="sweeperShow">
        <li v-for="(o,key) in sweeperDetails" :key="key" :label="o" :value="key">
          <template>
            <span v-if="o.result=='金币'" :style="o.step!=0?'color:green':'color:gold'"> {{ o.result }}</span>
            <span v-else :style="o.step!=0?'color:red':''">{{ o.result }}</span>
          </template>
          <div class="showStep">
            <template>
              <span v-if="o.step!=0" style="color:blue">{{ o.step }}</span>
              <span v-else>{{ o.step }}</span>
            </template>
          </div>
        </li>
      </ul>
    </el-dialog>

    <el-dialog title="Lucky9牌局详情" :visible.sync="lucky9DetailVisible" width="1200px">
      <el-table :data="lucky9Detail.players" border>
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column prop="cards" label="手牌" width="200"><template slot-scope="scope"><div v-html="showCard(scope.row.cards)" /></template></el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="isDealer" label="庄家" width="100"><template slot-scope="scope">{{ scope.row.isDealer ? "是" : "-" }}</template></el-table-column>
        <el-table-column prop="moneyBet" label="下注" width="100"><template slot-scope="scope">{{ scope.row.moneyBet/1000 }}</template></el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100"><template slot-scope="scope">{{ scope.row.moneyWon/1000 }}</template></el-table-column>
        <el-table-column prop="moneyTaxed" label="抽水" width="100"><template slot-scope="scope">{{ scope.row.moneyTaxed/1000 }}</template></el-table-column>
        <el-table-column prop="hitPotBet" label="Pot入池" width="100"><template slot-scope="scope">{{ scope.row.hitPotBet/1000 }}</template></el-table-column>
        <el-table-column prop="hitPotMoney" label="Pot赢取" width="100"><template slot-scope="scope">{{ scope.row.hitPotMoney/1000 }}</template></el-table-column>
        <el-table-column prop="hitPotTaxed" label="Pot抽水" width="100"><template slot-scope="scope">{{ scope.row.hitPotTaxed/1000 }}</template></el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100"><template slot-scope="scope">{{ scope.row.moneyTotal/1000 }}</template></el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ lucky9Detail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ lucky9Detail.logId }}</el-descriptions-item>
        <el-descriptions-item label="HitPot奖池">{{ lucky9Detail.hitPotPool/1000 }}</el-descriptions-item>
        <el-descriptions-item label="POT机器人">{{ lucky9Detail.potRobot }}</el-descriptions-item>
        <el-descriptions-item label="POT机器人保护">{{ lucky9Detail.potRobotProtected ? '是' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="机器人缓冲池保护">{{ lucky9Detail.robotPoolProtected ? '是' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="机器人庄家保护">{{ lucky9Detail.robotDealerProtected ? '是' : '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Lucky89牌局详情" :visible.sync="bodingDetailVisible" width="1200px">
      <el-table :data="bodingDetail.players" border>
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column prop="cards" label="手牌" width="200"><template slot-scope="scope"><div v-html="showCard(scope.row.cards)" /></template></el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="cardType" label="牌型" width="100" />
        <el-table-column prop="cardTypeOdds" label="牌型赔率" width="100" />
        <el-table-column prop="isDealer" label="庄家" width="100"><template slot-scope="scope">{{ scope.row.isDealer ? "是" : "-" }}</template></el-table-column>
        <el-table-column prop="moneyBet" label="下注" width="100"><template slot-scope="scope">{{ scope.row.moneyBet/1000 }}</template></el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100"><template slot-scope="scope">{{ scope.row.moneyWon/1000 }}</template></el-table-column>
        <el-table-column prop="moneyTaxed" label="抽水" width="100"><template slot-scope="scope">{{ scope.row.moneyTaxed/1000 }}</template></el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100"><template slot-scope="scope">{{ scope.row.moneyTotal/1000 }}</template></el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ bodingDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ bodingDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      title="牌局详情"
      :visible.sync="rummyDetailVisible"
      width="50%"
    >
      <el-table
        ref="filterTable"
        :data="rummyDetails"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-class-name="tableRowClassName"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="uid"
          label="Uid"
          width="100"
        />
        <el-table-column
          prop="seat"
          label="座位"
          width="100"
        />
        <el-table-column
          prop="isRobot"
          label="是否机器人"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.isRobot ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          label="结束原因"
          width="100"
        >
          <template slot-scope="scope">
            {{ rummyOverReason[scope.row.userGameOverReason] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeChip"
          label="金币变化"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.changeChip / 1000 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="扣分"
          width="100"
        />
        <el-table-column
          label="牌组"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.showHtml" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="牌局详情"
      :visible.sync="colorGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">骰子结果：</span><div style="color:red;">{{ colorGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="colorGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="200"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.Hit ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Result"
          label="下注结果"
          width="800"
        >
          <template slot-scope="scope">
            <el-table
              ref="filterTable"
              :data="scope.row.Ret"
              border
              :show-header="scope.row.ID==1?true:false"
              :row-class-name="tableRowClassName"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column
                prop="Uid"
                label="Uid"
                width="150"
              />
              <el-table-column
                prop="Money"
                label="资产"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Money / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Bet"
                label="下注"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.Bet / 1000 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Won"
                label="输赢"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Won>0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-row>
      <line-chart :chart-data="chartData" height="600px" />
    </el-row>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'

const filterMap = {
  IsPractice: { 1: '是', 0: '否', 6: '钓鱼付费', 7: '钓鱼未付', 8: '钓鱼2付费', 9: '钓鱼2未付费', 10: '钓鱼3付费', 11: '钓鱼3未付费' },
  TableMoney: 'all'
}

function newChartData() {
  return {
    xData: [],
    yData: [
      { Name: '输赢', Data: [] }
    ]
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { DateTimeShow, Compare, Publish, UidInput, LineChart },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,
      gid: 0,
      isVup: false,
      item: {
        Uid: 0,
        date: $libDate.GetDayBegin(new Date().getTime()),
        win: 0,
        lose: 0,
        winCount: 0,
        loseCount: 0
      },

      detailVisible: false,
      detailData: [],

      actionVisible: false,
      actions: [],
      actionNames: {
        1: '弃牌',
        2: '看牌',
        8: '前注',
        9: '跟注',
        10: '加注',
        14: '发起比牌',
        15: '同意比牌',
        16: '拒绝比牌',
        17: '因为要充值临时停止牌局'
      },
      publicCards: [],
      showPublicCars: false,

      baccaratVisible: false,
      baccaratDealerCards: [],
      baccaratPlayerCards: [],
      baccaratOptions: [],

      colorGameVisible: false,
      colorGameResult: '',
      colorGameOptions: [],

      sweeperVisible: false,
      sweeperDetails: [],
      sweeperRate: [],
      sweeperSTD: [8.00, 8.33, 8.70, 9.09, 9.52, 10.00, 10.53, 11.11, 11.76, 12.50, 13.33, 14.29, 15.38, 16.67, 18.18, 20.00, 22.22, 25.00, 28.57, 33.33, 40.00, 50.00, 66.67, 100],

      sweeperRateVisible: false,

      lucky9Detail: {},
      lucky9DetailVisible: false,

      bodingDetail: {},
      bodingDetailVisible: false,

      rummyDetailVisible: false,
      rummyDetails: [],
      rummyOverReason: {
        1: '首轮drop',
        2: '非首轮drop',
        3: '超时drop',
        4: 'finish失败',
        5: 'finish成功',
        6: 'declare',
        7: '其他玩家都drop了'
      },

      chartData: newChartData(),
      dataArr: [],

      libMoney: new MoneyShow(['MoneyChanged', 'MoneyNow', 'ServiceFee', 'TableMoney'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.Uid === this.item.Uid || row.uid === this.item.Uid) {
        return 'success-row'
      } else {
        return ''
      }
    },
    showCard(cards) {
      if (cards == null || cards == undefined) {
        return ''
      }
      let ret = ''
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    isBingo(valA, valB) {
      if (this.gid === 10) {
        return valA
      } else {
        if (valA < valB) {
          return '是'
        } else {
          return '否'
        }
      }
    },
    peiValStr(randVal, winRate, peiVal) {
      if (randVal < winRate && peiVal === 1) {
        return '赢配牌'
      }
      if (randVal >= winRate && peiVal === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FIsPeiResult(val) {
      if (val === 1) {
        return '赢配牌'
      }
      if (val === 2) {
        return '输配牌'
      }
      return '无配牌'
    },
    FTheResult(val) {
      if (val === 1) {
        return '中立'
      }
      if (val === 2) {
        return '赢-符和'
      }
      if (val === 3) {
        return '赢-不符和'
      }
      if (val === 4) {
        return '输-符和'
      }
      if (val === 5) {
        return '输-不符和'
      }
      return '无'
    },
    IsAlteredRobotsCards(v) {
      return v ? '是' : '-'
    },
    CalResult(randValue, winRate, moneyChange, peiVal) {
      if (randValue < winRate && peiVal === 1) {
        // 命中赢
        if (moneyChange <= 0) {
          return '赢不符和预期'
        } else {
          return '赢符和预期'
        }
      }
      if (randValue >= winRate && peiVal === 2) {
        // 命中输
        if (moneyChange >= 0) {
          return '输不符和预期'
        } else {
          return '输符和预期'
        }
      }
      return '中立'
    },
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      if (this.item.Uid !== 0) {
        this.$EventBus.$emit('uid-change', this.item.Uid)
      }
      const $this = this
      this.sweeperRateVisible = false
      this.dataArr = []
      const loading = this.$loading({
        lock: true,
        text: '数据拉取中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/playlog',
          Uid: this.item.Uid,
          IsVup: this.isVup ? 1 : 0,
          Time: $libDate.SelectTimeToIndia(this.item.date) / 1000,
          Gid: this.gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          let objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            loading.close()
            return
          }
          objs = $this.libMoney.TransForShow(objs)
          $this.clientDB = new ClientTableData(objs, this.clientDB.GetPage().GetPageNum(), filterMap, 'ID', -1)
          $this.item.win = $this.item.lose = $this.item.winCount = $this.item.loseCount = 0
          for (const o in objs) {
            const item = objs[o]
            if (item.MoneyChanged > 0) {
              $this.item.win += item.MoneyChanged
              $this.item.winCount++
            } else {
              $this.item.lose += item.MoneyChanged
              $this.item.loseCount++
            }
            if (item.Gid === 14 && item.WinRate > 0) {
              // 真人场，需要特殊处理胜率展示
              const tmpWinRate = item.WinRate / 100
              objs[o].WinRate = tmpWinRate.toString() + '%'
            }
            if (item.Gid === 10) {
              objs[o].RandVal = (item.RandVal / 100).toFixed(2)
              objs[o].WinRate = (item.WinRate / 100).toFixed(2)
            } else if (item.Gid == 20) {
              objs[o].WinRate /= 100
              objs[o].ServiceFee *= 1000
            }
          }
          $this.handleCurrentChange(1)
          $this.dataArr = objs
          loading.close()
        } else {
          Message.error(response.Data)
        }
      })
    },
    checkSweeperRate() {
      const items = this.dataArr
      this.sweeperRate = []
      for (let i = 0; i < 25; i++) {
        this.sweeperRate.push({
          Total: 0,
          Bomb: 0,
          STD: 0,
          Rate: 0
        })
      }
      for (const i in items) {
        const item = items[i]
        const obj = JSON.parse(item.ExtData)
        if (obj.players.bombNumBet !== 2) {
          continue
        }
        for (const o in obj.players.details) {
          const detail = obj.players.details[o]
          if (detail.step !== 0) {
            this.sweeperRate[detail.step - 1].Total += 1
            if (detail.result === 2) {
              this.sweeperRate[detail.step - 1].Bomb += 1
            }
          }
        }
      }
      for (let i = 0; i < 25; i++) {
        if (this.sweeperRate[i].Total > 0) {
          this.sweeperRate[i].Rate = this.sweeperRate[i].Bomb / this.sweeperRate[i].Total * 100
        }
        this.sweeperRate[i].STD = this.sweeperSTD[i]
      }
      this.sweeperRateVisible = true
    },
    clickData(row, column, event) {
      if (column.label !== 'Uid') {
        this.getDetail(row.LogID, row.FinishTime)
      }
    },
    getDetail(id, dt) {
      const $this = this

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/detail',
          ID: id,
          DateTime: dt
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          this.initData()
          const gid = this.$route.meta.gid
          console.log(obj)
          if (gid == 9 || gid == 8 || gid == 14) {
            $this.showTPGame(obj)
          } else if (gid == 15) {
            $this.showTexasGame(obj)
          } else if (gid == 16) {
            $this.showBaccaratGame(obj)
          } else if (gid == 20) {
            $this.showSweeperGame(obj)
          } else if (gid == 1) {
            $this.showRummyGame(obj)
          } else if (gid == 25) {
            $this.showColorGame(obj)
          } else if (gid == 23) {
            $this.showLucky9Game(obj)
          } else if (gid == 30) {
            $this.showBodingGame(obj)
          } else {
            $this.showSmallGame(obj)
          }
        }
      })
    },
    showTPGame(obj) {
      this.actions = obj.logs
      try {
        const cards = JSON.parse(obj.cardData)
        let total = 0
        for (let i = 0; i < this.actions.length; i++) {
          this.actions[i].Cards = cards[this.actions[i].uid]
          total += this.actions[i].actionMoney
          this.actions[i].total = total
        }
        this.actionVisible = true
      } catch (e) {
        console.log('无法解析牌局详情，很可能不存在')
      }
    },
    showTexasGame(obj) {
      this.actions = obj.logs
      const cards = JSON.parse(obj.cardData)
      let total = 0
      for (let i = 0; i < this.actions.length; i++) {
        this.actions[i].Cards = cards[this.actions[i].uid]
        total += this.actions[i].actionMoney
        this.actions[i].total = total
      }
      this.publicCards = cards[99]
      this.showPublicCars = true
      this.actionVisible = true
    },
    showBaccaratGame(obj) {
      const names = ['Dealer Win', 'Player Win', 'Tie', 'Dealer Pair', 'Player Pair']
      this.baccaratDealerCards = obj.dealerCard
      this.baccaratPlayerCards = obj.playerCard
      const tMap = {}
      for (let i = 0; i < obj.options.length; i++) {
        const ob = obj.options[i]
        if (this.$route.meta.gid == 13) {
          const name = this.showCard(ob.cards) + '</br>【' + this.showCard(obj.dealerCards) + '】'
          names.push(name)
          tMap[ob.optionId] = { ID: ob.optionId, Name: name, Hit: ob.hit, Ret: [] }
        } else {
          tMap[ob.id] = { ID: ob.id, Name: names[ob.id - 1], Hit: ob.hit, Ret: [] }
        }
      }
      for (let i = 0; i < obj.players.length; i++) {
        const player = obj.players[i]
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          if (this.$route.meta.gid == 13) {
            result.id = result.optionId
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: result.moneyWon,
            Money: player.moneyResult
          })
        }
      }
      for (let i = 1; i <= names.length; i++) {
        this.baccaratOptions.push(tMap[i])
      }
      this.baccaratVisible = true
    },
    showColorGame(obj) {
      const names = ['Yellow', 'White', 'Purple', 'Blue', 'Green', 'Red']
      const tMap = {}
      for (let i = 0; i < obj.options.length; i++) {
        const ob = obj.options[i]
        if (this.$route.meta.gid == 13) {
          const name = this.showCard(ob.cards) + '</br>【' + this.showCard(obj.dealerCards) + '】'
          names.push(name)
          tMap[ob.optionId] = { ID: ob.optionId, Name: name, Hit: ob.hit, Ret: [] }
        } else {
          tMap[ob.id] = { ID: ob.id, Name: names[ob.id - 1], Hit: ob.hit, Ret: [] }
        }
      }
      for (let i = 0; i < obj.players.length; i++) {
        const player = obj.players[i]
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          if (this.$route.meta.gid == 13) {
            result.id = result.optionId
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: result.moneyWon,
            Money: player.moneyResult
          })
        }
      }
      for (let i = 1; i <= names.length; i++) {
        this.colorGameOptions.push(tMap[i])
      }
      const resultTmp = []
      for (let i = 0; i <= obj.result.length; i++) {
        resultTmp.push(names[obj.result[i] - 1])
      }
      this.colorGameResult = resultTmp.join('，')
      this.colorGameVisible = true
    },
    showRummyGame(obj) {
      for (let i = 0; i < obj.players.length; i++) {
        const detailRow = obj.players[i]
        const rowHtml = ''
        if (detailRow.groups != null && detailRow.groups != undefined) {
          for (let j = 0; j < detailRow.groups.length; j++) {
            let jokerType = '不成型'
            if (detailRow.groups[j].cardType == 1) {
              jokerType = '纯顺子'
            } else if (detailRow.groups[j].cardType == 2) {
              jokerType = '赖子顺'
            } else if (detailRow.groups[j].cardType == 3) {
              jokerType = '条子'
            }
            rowHtml += '[' + detailRow.groups[j].score + ']' + jokerType + this.showCard(detailRow.groups[j].sourceCards) + '<br/>'
          }
        }
        obj.players[i].showHtml = rowHtml
      }
      this.rummyDetails = obj.players
      this.rummyDetailVisible = true
    },
    showSweeperGame(obj) {
      const showDetail = []
      for (let i = 0; i < obj.players.details.length; i++) {
        const detailRow = obj.players.details[i]
        const areaIndex = detailRow.index - 1
        let showName = '炸弹'
        if (detailRow.result == 1) {
          showName = '金币'
        }
        showDetail[areaIndex] = { result: showName, step: detailRow.step }
      }
      this.sweeperDetails = showDetail
      console.log(this.sweeperDetails)

      this.sweeperVisible = true
    },
    showLucky9Game(obj) {
      this.lucky9Detail = obj
      this.lucky9DetailVisible = true
    },
    showBodingGame(obj) {
      this.bodingDetail = obj
      this.bodingDetailVisible = true
    },
    showSmallGame(obj) {
      let names = []
      /*	UPSTREAM_TYPE_RUMMY           = 1 //印度Rummy游戏
UPSTREAM_TYPE_ANDAR_BAHAR     = 2 //AB
UPSTREAM_TYPE_DRAGON_VS_TIGER = 3 //龙虎斗
UPSTREAM_TYPE_JHANDI_MUNDA    = 4 //JM
UPSTREAM_TYPE_CAR_ROULETTE    = 5 //车标转轮
UPSTREAM_TYPE_7UP_7DOWN       = 6 //7上7下
UPSTREAM_TYPE_RVB       	  = 7 //红黑梅方
UPSTREAM_TYPE_AK              = 8 //AK
UPSTREAM_TYPE_TEEN_PATTI      = 9 //炸金花(Teen Patti)
UPSTREAM_TYPE_CRASH           = 10 //Crash*/
      switch (this.$route.meta.gid) {
        case 2:
          names = ['Andar', 'Bahar', '1-5', '6-10', '11-15', '16-25', '26-30', '31-35', '36-40', '40+']
          break
        case 3:
          names = ['Dragon', 'Tiger', 'Tie']
          break
        case 5:
          names = ['Mahindra', 'Suzuki', 'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Ferrari', 'Lamborghini']
          break
        case 6:
          names = ['2-6', '7', '8-12']
          break
        case 7:
          names = ['黑桃', '红心', '梅花', '方块', 'Joker', '黑色牌', '红色牌']
          break
        case 4:
          names = ['Spade', 'Heart', 'Club', 'Diamond', 'Face', 'Flag']
          break
        case 17:
          names = ['Green', 'Purple', 'Red', 'NumZero', 'NumOne', 'NumTwo', 'NumThree', 'NumFour', 'NumFive', 'NumSix', 'NumSeven', 'NumEight', 'NumNine']
          break
        case 18:
          names = ['Atletico Mineiro', 'Flamengo', 'Palmeiras', 'Fortaleza', 'Corinthians', 'RB Bragantino', 'Fluminense', 'America Mineiro']
          break
        case 19:
          names = ['Swallow', 'Peacock', 'Dove', 'Eagle', 'Rabbit', 'Panda', 'Monkey', 'Lion', 'Aves', 'Bestas', 'Shark', 'GoldShark', 'TakeAll', 'WinMore']
          break
        default:
          return
      }
      const tMap = {}
      for (let i = 0; i < obj.options.length; i++) {
        const ob = obj.options[i]
        if (this.$route.meta.gid == 13) {
          const name = this.showCard(ob.cards) + '</br>【' + this.showCard(obj.dealerCards) + '】'
          names.push(name)
          tMap[ob.optionId] = { ID: ob.optionId, Name: name, Hit: ob.hit, Ret: [] }
        } else {
          tMap[ob.id] = { ID: ob.id, Name: names[ob.id - 1], Hit: ob.hit, Ret: [] }
        }
      }
      for (let i = 0; i < obj.players.length; i++) {
        const player = obj.players[i]
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          if (this.$route.meta.gid == 13) {
            result.id = result.optionId
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: result.moneyWon,
            Money: player.moneyResult
          })
        }
      }
      for (let i = 1; i <= names.length; i++) {
        this.detailData.push(tMap[i])
      }
      this.detailVisible = true
    },
    initData() {
      this.detailVisible = false
      this.detailData = []
      this.actionVisible = false
      this.actions = []
      // 清空公共牌
      this.publicCards = []
      this.showPublicCars = false
      // 清空baccarat数据
      this.baccaratDealerCards = []
      this.baccaratPlayerCards = []
      this.baccaratOptions = []
      this.baccaratVisible = false
      // 清空colorGame数据
      this.colorGameOptions = []
      this.colorGameVisible = false
      this.colorGameResult = ''
    },
    showChart() {
      this.initChartData()
    },
    initChartData() {
      console.log(1)
      const objs = this.dataArr.sort(function(a, b) {
        return a.ID - b.ID
      })
      const chartData = newChartData()

      for (const i in objs) {
        const ob = objs[i]
        chartData.xData.push($libDate.FormateSecondStr(ob.FinishTime, 6))
        chartData.yData[0].Data.push(ob.MoneyChanged)
      }
      this.chartData = chartData
    },
    getServiceFeeName() {
      if (this.gid == 20) {
        return '下注炸弹数'
      // } else if (this.gid == 10) {
      //   return '结果'
      } else {
        return '台费'
      }
    },
    getRandValName() {
      if (this.gid === 10) {
        return '结果'
      } else {
        return '是否命中'
      }
    },
    getWinRateName() {
      if (this.gid == 20) {
        return '领奖倍率'
      } else if (this.gid == 10) {
        return '下注值'
      } else {
        return '胜率'
      }
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .fail-row {
  background: #999999;
}

.el-table .success-row {
  background: #f0f9eb;
}

ul#sweeperShow {
  width: 601px;
  height: 601px;
  padding:0px;
  clear:both;
  margin:0;
  list-style:none;
  border-top:#999 1px solid;
  border-left:#999 1px solid;
}

ul#sweeperShow li {
  width: 110px;
  height: 110px;
  font-size: 30px;
  float: left;
  margin: 0px;
  border: none;
  list-style: none;
  line-height: 100px;
  border-right:#999 1px solid;
  border-bottom:#999 1px solid;
  text-align: center;
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
  margin-top:80px;
  margin-right:0px;
}
</style>
