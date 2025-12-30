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
          />
          小黑屋
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showChart">输赢图表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="(gid==20 || gid==132) && dataArr.length!=0" type="warning" size="mini" @click="checkSweeperRate">扫雷概率
          </el-button>
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
            <span :style="scope.row.Rate>=scope.row.STD?'color:green':'color:red'">{{
              scope.row.Rate.toFixed(2)
            }}</span>
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
      <el-col :span="24">
        <el-descriptions
          class="margin-top"
          :column="5"
          size="medium"
          :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
          border
        >
          <el-descriptions-item label="总赢：">{{ formatNumber(item.win + item.lose) }}</el-descriptions-item>
          <el-descriptions-item label="输局数："> {{ item.loseCount }}</el-descriptions-item>
          <el-descriptions-item label="赢局数：">{{ item.winCount }}</el-descriptions-item>
          <el-descriptions-item label="胜率%：">{{
            (item.loseCount + item.winCount) > 0 ? (item.winCount / (item.loseCount + item.winCount) * 100).toFixed(1) : 0
          }}
          </el-descriptions-item>
          <el-descriptions-item label="台费：">{{ formatNumber(item.fee) }}</el-descriptions-item>
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
        width="120"
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
        prop="MoneyOrigin"
        label="牌局前金额"
        width="120"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyOrigin / 1000) }}
        </template>
      </el-table-column>

      <template v-if="gid===25">
        <el-table-column
          prop="TotalValidBet"
          label="下注"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.TotalValidBet) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="PotChange"
          label="获得Pot"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.PotChange) }}
          </template>
        </el-table-column>
      </template>
      <template v-if="gid!==25">
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
      </template>
      <el-table-column
          prop="showBetType"
          label="下注方式"
          width="120"
      >
        <template slot-scope="scope">
            {{ showBetType(scope.row.BetType) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="MoneyChanged"
        label="输赢"
        width="100"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.PayoffAmount >0?'red':'green'}">
            {{ formatNumber(scope.row.PayoffAmount) }}
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
            <span v-if="(gid===20 || gid===132) && scope.row.WinRate!==0">
              {{ formatNumber(scope.row.WinRate * 100) }}
            </span>
            <span v-else>
              {{ formatNumber(scope.row.ServiceFee) }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="MoneyNow"
        label="余额"
        width="120"
      >
        <template slot-scope="scope">
          {{ formatNumber(scope.row.MoneyNow) }}
        </template>
      </el-table-column>


      <template v-if="gid===21 || gid===126">
        <el-table-column
          prop="IsRobot"
          label="玩家类型"
          width="120"
        >
          <template slot-scope="scope">
            {{ showRobotLevel(scope.row.IsRobot,scope.row.RobotLevel) }}
          </template>
        </el-table-column>
      </template>


      <el-table-column
        :v-if="isContainsFriendGame()"
        prop="IsRobot"
        label="房间类型"
        width="120px"
      >
        <template slot-scope="scope">
          {{ showRoomLevel(scope.row.IsPractice) }}
        </template>
      </el-table-column>
      <template v-if="gid!==10&&gid!==21">
        <el-table-column
          prop="WinRate"
          :label="getWinRateName()"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="(gid==20 || gid==132) && scope.row.LuckyVal>0">
              {{ scope.row.LuckyVal / 100 }}
            </span>
            <span v-else-if="(gid==20 || gid==132) && scope.row.LuckyVal===0">
              {{ 0 }}
            </span>
            <span v-else>
              {{ scope.row.WinRate }}
            </span>
          </template>
        </el-table-column>
      </template>

      <template v-if="gid!==501">
        <el-table-column
            prop="LogID"
            label="LogID"
            width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.LogID }}
          </template>
        </el-table-column>
      </template>

      <template v-if="gid===501">
        <el-table-column
            prop="Ext"
            label="Ext"
            width="350"
        >
          <template slot-scope="scope">
            {{ explainExt(gid, scope.row.ExtendAttr) }}
          </template>
        </el-table-column>
      </template>
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
      <div v-show="showPublicCars" style=" font-size:14px; line-height: 18px; height: 25px;"><span style="float:left;">公共牌：</span>
        <div style="float:left; " v-html="showCard(publicCards)" />
      </div>
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
        <span style="float:left;">庄家牌：</span>
        <div style="float:left; " v-html="showCard(baccaratDealerCards)" />
        <span style="float:left; margin-left:20px;">闲家牌：</span>
        <div style="float:left; " v-html="showCard(baccaratPlayerCards)" />
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
      <div id="sweeperShowTable">
        <table>
          <tr>
            <td>奖池贡献</td>
            <td>扣除奖池贡献</td>
            <td>累计奖池贡献</td>
            <td>点控命中</td>
            <td>下注方式</td>
          </tr>
          <tr>
            <td>{{ sweeperPlay.JackpotContribute / 1000 }}</td>
            <td>{{ sweeperPlay.ReduceContribute / 1000 }}</td>
            <td>{{
              sweeperPlay.CurrentContribute
                / 1000
            }}
            </td>
            <td>{{ getMicroCtrlName(sweeperPlay.microCtrl) }}</td>
            <td>{{ sweeperPlay.propLog ? showBetType(sweeperPlay.propLog.propAscription): '常规' }}</td>
          </tr>
          <tr>
            <td>道具Id</td>
            <td>道具recordId</td>
            <td>道具单张面值</td>
            <td>道具使用数量</td>
            <td>道具剩余数量</td>
          </tr>
          <tr>
            <td>{{ sweeperPlay.propLog ? sweeperPlay.propLog.propId : '' }}</td>
            <td>{{ sweeperPlay.propLog ? sweeperPlay.propLog.recordId : '' }}</td>
            <td>{{ sweeperPlay.propLog ? sweeperPlay.propLog.itemCost/1000 : '' }}</td>
            <td>{{ sweeperPlay.propLog ? sweeperPlay.propLog.itemCount : '' }}</td>
            <td>{{ sweeperPlay.propLog ? sweeperPlay.propLog.itemRemain : '' }}</td>
          </tr>
        </table>
      </div>
      <ul id="sweeperShow">
        <li v-for="(o,key) in sweeperDetails" :key="key" :label="o" :value="key">
          <template>
            <span v-if="o.result==1" :style="o.step!=0?'color:green':'color:gold'"> {{ o.name }}</span>
            <span v-else :style="o.step!=0?'color:red':''">{{ o.name }}</span>
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

    <el-dialog title="Tower详情" :visible.sync="towerVisible" width="650px">
      <div id="towerShow" v-html="towerData" />
    </el-dialog>

    <el-dialog title="Lucky9牌局详情" :visible.sync="lucky9DetailVisible" width="1200px">
      <el-table :data="lucky9Detail.players" border>
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column prop="cards" label="手牌" width="200">
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.cards)" />
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="isDealer" label="庄家" width="100">
          <template slot-scope="scope">{{ scope.row.isDealer ? "是" : "-" }}</template>
        </el-table-column>
        <el-table-column prop="moneyBet" label="下注" width="100">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTaxed" label="抽水" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTaxed / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="hitPotBet" label="Pot入池" width="100">
          <template slot-scope="scope">{{ scope.row.hitPotBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="hitPotMoney" label="Pot赢取" width="100">
          <template slot-scope="scope">{{ scope.row.hitPotMoney / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="hitPotTaxed" label="Pot抽水" width="100">
          <template slot-scope="scope">{{ scope.row.hitPotTaxed / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTotal / 1000 }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ lucky9Detail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ lucky9Detail.logId }}</el-descriptions-item>
        <el-descriptions-item label="HitPot奖池">{{ lucky9Detail.hitPotPool / 1000 }}</el-descriptions-item>
        <!-- <el-descriptions-item label="POT机器人">{{ lucky9Detail.potRobot }}</el-descriptions-item>
        <el-descriptions-item label="POT机器人保护">{{
          lucky9Detail.potRobotProtected ? '是' : '-'
        }}
        </el-descriptions-item>
        <el-descriptions-item label="机器人缓冲池保护">{{
          lucky9Detail.robotPoolProtected ? '是' : '-'
        }}
        </el-descriptions-item>
        <el-descriptions-item label="机器人庄家保护">{{
          lucky9Detail.robotDealerProtected ? '是' : '-'
        }}
        </el-descriptions-item> -->
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Blackjack牌局详情" :visible.sync="blackjackDetailVisible" width="1200px">
      <el-descriptions class="margin-top" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            押注：
          </template>
          {{ blackjackDetail.antes / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            庄家点数：
          </template>
          {{ blackjackDetail.dealerPoints }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            牌型：
          </template>
          {{
            blackjackDetail.dealerCardType === 1 ? "点牌" : (blackjackDetail.dealerCardType === 2 ? "BlackJack" : "爆牌")
          }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            庄家手牌：
          </template>
          <div v-for="card in blackjackDetail.dealerCards" class="block">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(card)"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="blackjackDetail.players" border>
        <el-table-column prop="uid" label="UID" />
        <el-table-column prop="seat" label="座位" />
        <el-table-column prop="moneyBet" label="投注金额">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroups">
              <hr v-if="index > 0" class="blackJackHr">
              {{ item.moneyBet / 1000 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="moneyBet" label="投保金额">
          <template slot-scope="scope">
            {{ scope.row.moneyInsured / 1000 }}
          </template>
        </el-table-column>

        <el-table-column prop="cards" label="手牌" width="300px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroups" class="block">
              <hr v-if="index > 0" class="blackJackHr">
              {{ '手牌' + (index + 1) + ': ' }}
              <div v-for="(card) in item.cards" class="block">
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
                />
              </div>
            </div>
          </template>

        </el-table-column>
        <el-table-column label="是否爆牌" width="200px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroups" class="block" style="width: 100%;white-space: pre-wrap;">
              <hr v-if="index > 0" class="blackJackHr">
              {{
                '手牌' + (index + 1) + ': ' + (item.cardType == 1 ? "点牌" : (item.cardType == 2 ? "BlackJack" : "爆牌"))
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="输赢">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroups" class="block" style="width: 100%;white-space: pre-wrap;">
              <hr v-if="index > 0" class="blackJackHr">
              {{ item.moneyWon / 1000 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="moneyBet" label="保险中奖金额">
          <template slot-scope="scope">
            {{ scope.row.moneyClaims / 1000 }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ blackjackDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ blackjackDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Blackjackmh牌局详情" :visible.sync="blackjackmhDetailVisible" width="1200px">
      <el-descriptions class="margin-top" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            底注：
          </template>
          {{ blackjackmhDetail.minBet / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            庄家点数：
          </template>
          {{ blackjackmhDetail.dealerLog.points }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            牌型：
          </template>
          {{
            blackjackmhDetail.dealerLog.cardType === 1 ? "点牌" : (blackjackmhDetail.dealerLog.cardType === 2 ? "BlackJack" : "爆牌")
          }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            庄家手牌：
          </template>
          <div v-for="card in blackjackmhDetail.dealerLog.cards" class="block">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(card)"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="[blackjackmhDetail.playerLog]" border>
        <el-table-column prop="uid" label="UID" />
        <el-table-column prop="totalBet" label="Lucky Bet金额">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              {{ item.luckyBet / 1000 }}
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="totalBet" label="投注金额">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              {{ item.bet / 1000 }}
              <br>
              <span v-if="item.splitCards && item.splitCards.length > 0 && item.splitBet != null">
              {{ item.splitBet / 1000 }}
              </span>
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="insurance" label="投保金额">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              {{ item.insurance / 1000 }}
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="cards" label="手牌" width="300px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBlock">
              <span v-if="item.cards.length > 0">
                {{ '手牌' + (item.id) + ': ' }}
              </span>
              <div v-for="(card) in item.cards" class="block">
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
                />
              </div>
              <br>
              <span v-if="item.splitCards && item.splitCards.length > 0">
                {{ '分牌手牌' + (item.id) + ': ' }}
              </span>
              <div v-for="(card) in item.splitCards" class="block">
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
                />
              </div>
              <div v-if="!item.splitCards || item.splitCards.length <= 0" class="block" style="height: 39px">
              </div>
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="是否爆牌" width="200px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              <span v-if="item.cards.length > 0">
                {{'手牌' + (item.id) + ': ' + (item.cardType == 1 ? "点牌" : (item.cardType == 2 ? "BlackJack" : "爆牌"))}}
              </span>
              <br>
              <span v-if="item.splitCards && item.splitCards.length > 0">
                {{'分牌手牌' + (item.id) + ': ' + (item.splitCardType == 1 ? "点牌" : (item.splitCardType == 2 ? "BlackJack" : "爆牌"))}}
              </span>
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="Lucky Bet输赢">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              {{ (item.luckyWin - item.luckyBet) / 1000 }}
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="比牌输赢">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog" class="blackJackmhBox">
              {{ item.normalBetWin / 1000 }}
              <br>
              <span v-if="item.splitCards && item.splitCards.length > 0 && item.splitNormalBetWin != null">
              {{ item.splitNormalBetWin / 1000 }}
              </span>
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="moneyBet" label="保险中奖金额">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroupLog"  class="blackJackmhBox">
              {{ item.insurancePay / 1000 }}
              <hr v-if="index !== scope.row.cardGroupLog.length - 1" class="blackJackmhHr"/>
            </div>
          </template>
        </el-table-column>
      </el-table>


      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ blackjackmhDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ blackjackmhDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="多米诺牌局详情" :visible.sync="dominoDetailVisible" width="1200px">
      <el-descriptions class="margin-top" title="" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            底注：
          </template>
          {{ dominoDetail.antes / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            庄家座位：
          </template>
          {{ dominoDetail.dealerSeat }}
        </el-descriptions-item>

      </el-descriptions>

      <el-descriptions class="margin-top" title="" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            牌桌左边的牌：
          </template>
          <div v-for="(card,index) in dominoDetail.leftCards" class="block">
            <hr v-if="index > 0" class="blackJackHr">
            {{ '牌' + (index + 1) }}
            <div v-if="card >= 0" class="dominoHr">
              <el-image
                style="width: 37px; height: 50px"
                :src="getDominoCardUrl(card,0)"
              />
              <el-image
                style="width: 37px; height: 50px"
                :src="getDominoCardUrl(card,1)"
              />
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            牌桌右边的牌：
          </template>
          <div v-for="(card,index) in dominoDetail.rightCards" class="block">
            <hr v-if="index > 0" class="blackJackHr">
            {{ '牌' + (index + 1) }}
            <div v-if="card >= 0" class="dominoHr">
              <el-image
                style="width: 37px; height: 50px"
                :src="getDominoCardUrl(card,0)"
              />
              <el-image
                style="width: 37px; height: 50px"
                :src="getDominoCardUrl(card,1)"
              />
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="dominoDetail.players" border>
        <el-table-column prop="uid" label="UID" />
        <el-table-column prop="seat" label="座位" />
        <el-table-column prop="winType" label="结果">
          <template slot-scope="scope">
            {{ getDominoWinType(scope.row.winType) }}
          </template>
        </el-table-column>

        <el-table-column prop="handCards" label="剩余手牌" width="300px">
          <template slot-scope="scope">
            <div v-for="(card,index) in scope.row.handCards" class="block">
              <hr v-if="index > 0" class="blackJackHr">
              {{ '手牌' + (index + 1) }}
              <div v-if="card >= 0" class="dominoHr">
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getDominoCardUrl(card,0)"
                />
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getDominoCardUrl(card,1)"
                />
              </div>
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="points" label="剩余点数" />
        <el-table-column prop="moneyChange" label="总输赢">
          <template slot-scope="scope">
            {{ scope.row.moneyChange / 1000 }}
          </template>
        </el-table-column>
        <el-table-column prop="moneyWonReal" label="结算输赢">
          <template slot-scope="scope">
            {{ scope.row.moneyWonReal / 1000 }}
          </template>
        </el-table-column>
        <el-table-column prop="moneyFee" label="抽水">
          <template slot-scope="scope">
            {{ scope.row.moneyFee / 1000 }}
          </template>
        </el-table-column>
        <el-table-column prop="moneyPassReal" label="过牌输赢">
          <template slot-scope="scope">
            {{ scope.row.moneyPassReal / 1000 }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ dominoDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ dominoDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Pusoy牌局详情" :visible.sync="pusoyDetailVisible" width="1400px">
      <el-table
        :data="pusoyDetail.players"
        :span-method="pusoySpanMethods"
        border
      >
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column label="手牌" width="450" align="center">
          <el-table-column prop="cards" label="后手牌" width="150">
            <template #default="scope">
              <template v-if="scope.row.cardType > 1">
                <div v-html="showCard(scope.row.cards)" />
                <span>({{ pusoyCardTypes[scope.row.cardType] || '' }})</span>
              </template>
              <template v-else>
                <div v-html="showCard(scope.row.groupBottom.cards)" />
                <span>({{ pusoyGroupCardTypes[scope.row.groupBottom.cardType] || '' }})</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="cards" label="中手牌" width="150">
            <template slot-scope="scope">
              <div v-html="showCard(scope.row.groupMiddle.cards)" />
              <span>({{ pusoyGroupCardTypes[scope.row.groupMiddle.cardType] || '' }})</span></template>
          </el-table-column>
          <el-table-column prop="cards" label="前手牌" width="150">
            <template slot-scope="scope">
              <div v-html="showCard(scope.row.groupTop.cards)" />
              <span>({{ pusoyGroupCardTypes[scope.row.groupTop.cardType] || '' }})</span></template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="cardType" label="牌型" width="90">
          <template slot-scope="scope">{{ pusoyShowCardTypeName(scope.row.cardType) }} {{
            pusoyShowShootAll(scope.row)
          }} {{ pusoyShowGroupExtra(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="moneyBet" label="下注" width="100">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyFee" label="抽水" width="100">
          <template slot-scope="scope">{{ scope.row.moneyFee / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTotal / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTotal" label="用户类型" width="120">
          <template slot-scope="scope">{{ getRobotType(scope.row.RobotId,scope.row.RobotLevel) }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-table
        title="打枪："
        :visible.sync="pusoyShootOneShow"
        :data="pusoyDetail.shootOne"
        width="100%"
        border
      >
        <el-table-column label="Pusoy List：">
          <el-table-column prop="SourcePlayer.uid" label="打枪">
            <template slot-scope="scope">{{ scope.row.SourcePlayer.uid }}</template>
          </el-table-column>
          <el-table-column prop="TargetPlayer.uid" label="Pusoy">
            <template slot-scope="scope">{{ scope.row.TargetPlayer.uid }}</template>
          </el-table-column>
          <el-table-column prop="SourcePlayer.scoreChanged" label="ScoreChanged" />
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ pusoyDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ pusoyDetail.logId }}</el-descriptions-item>
        <el-descriptions-item label="是否发生换牌">{{ pusoyShowChangeCardString(pusoyDetail.isChangedCards) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Pusoy换牌牌局详情" :visible.sync="pusoySwapDetailVisible" width="1600px">
      <el-table
        :data="pusoySwapDetail.players"
        border
      >
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column prop="playerSwapCard" label="选择交换的手牌" width="100">
          <template #default="scopeP">
            <div v-html="showCard(scopeP.row.playerSwapCard)" />
          </template>
        </el-table-column>
        <el-table-column prop="swappedCard" label="换回的手牌" width="100">
          <template #default="scopeS">
            <div v-html="showCard(scopeS.row.swappedCard)" />
          </template>
        </el-table-column>
        <el-table-column label="手牌" width="450" align="center">
          <el-table-column prop="cards" label="后手牌" width="150">
            <template #default="scopeB">
              <template v-if="scopeB.row.cardType > 1">
                <div v-html="showCard(scopeB.row.cards)" />
                <span>({{ pusoyCardTypes[scopeB.row.cardType] || '' }})</span>
              </template>
              <template v-else>
                <div v-html="showCard(scopeB.row.groupBottom.cards)" />
                <span>({{ pusoyGroupCardTypes[scopeB.row.groupBottom.cardType] || '' }})</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="cards" label="中手牌" width="150">
            <template slot-scope="scope">
              <div v-html="showCard(scope.row.groupMiddle.cards)" />
              <span>({{ pusoyGroupCardTypes[scope.row.groupMiddle.cardType] || '' }})</span></template>
          </el-table-column>
          <el-table-column prop="cards" label="前手牌" width="150">
            <template slot-scope="scope">
              <div v-html="showCard(scope.row.groupTop.cards)" />
              <span>({{ pusoyGroupCardTypes[scope.row.groupTop.cardType] || '' }})</span></template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="cardType" label="牌型" width="90">
          <template slot-scope="scope">{{ pusoyShowCardTypeName(scope.row.cardType) }} {{
            pusoyShowShootAll(scope.row)
          }} {{ pusoyShowGroupExtra(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="moneyBet" label="下注" width="100">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyFee" label="抽水" width="100">
          <template slot-scope="scope">{{ scope.row.moneyFee / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTotal / 1000 }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-table
        title="打枪："
        :visible.sync="pusoyShootOneShow"
        :data="pusoySwapDetail.shootOne"
        width="100%"
        border
      >
        <el-table-column label="Pusoy List：">
          <el-table-column prop="SourcePlayer.uid" label="打枪">
            <template slot-scope="scope">{{ scope.row.SourcePlayer.uid }}</template>
          </el-table-column>
          <el-table-column prop="TargetPlayer.uid" label="Pusoy">
            <template slot-scope="scope">{{ scope.row.TargetPlayer.uid }}</template>
          </el-table-column>
          <el-table-column prop="SourcePlayer.scoreChanged" label="ScoreChanged" />
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ pusoySwapDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ pusoySwapDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      v-if="gameLogComponent.gid===49"
      title="NiuNiu牌局详情"
      :visible.sync="gameLogComponent.visible"
      width="1400px"
    >
      <el-table
        :data="gameLogComponent.detail.players"
        border
      >
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column label="手牌" width="450" align="center">
          <template slot-scope="scope">
            <span v-for="(row,idx) in scope.row.cards">
              <el-image
                style="width: 37px; height: 50px"
                :src="getCardUrl(cardConversionColor(row,'3-2','1-4','4-3','2-1'))"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cardType" label="牌型" width="100">
          <template slot-scope="scope">{{ niuniuTypeMap[scope.row.cardType] }}</template>
        </el-table-column>
        <el-table-column prop="oddsCard" label="牌型倍数" width="100">
          <template slot-scope="scope">{{ scope.row.oddsCard }}</template>
        </el-table-column>
        <el-table-column prop="oddsBet" label="下注倍数" width="100">
          <template slot-scope="scope">{{ scope.row.oddsBet }}</template>
        </el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTaxed" label="抽水" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTaxed / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="payRake" label="抽水贡献" width="100">
          <template slot-scope="scope">{{ scope.row.payRake / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyCur" label="最终资产" width="100">
          <template slot-scope="scope">{{ scope.row.moneyCur / 1000 }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ gameLogComponent.detail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ gameLogComponent.detail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="Lucky89牌局详情" :visible.sync="bodingDetailVisible" width="1200px">
      <el-table :data="bodingDetail.players" border>
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column prop="seat" label="座位" width="100" />
        <el-table-column prop="cards" label="手牌" width="200">
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.cards)" />
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="cardType" label="牌型" width="100" />
        <el-table-column prop="cardTypeOdds" label="牌型赔率" width="100" />
        <el-table-column prop="isDealer" label="庄家" width="100">
          <template slot-scope="scope">{{ scope.row.isDealer ? "是" : "-" }}</template>
        </el-table-column>
        <el-table-column prop="moneyBet" label="下注" width="100">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTaxed" label="抽水" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTaxed / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100">
          <template slot-scope="scope">{{ scope.row.moneyTotal / 1000 }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ bodingDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ bodingDetail.logId }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      title="rummy牌局详情"
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
            {{ (scope.row.changeChip - scope.row.moneyTax) / 1000 }}
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
        <span style="float:left;">骰子结果：</span>
        <div style="color:red;">{{ colorGameResult }}</div>
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

    <el-dialog
      title="Windrop详情"
      :visible.sync="WindropGameVisible"
      width="50%"
    >
      <br>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="累计贡献值">{{
          WindropGameResult.JackpotContributeTotal / 1000
        }}
        </el-descriptions-item>
        <el-descriptions-item label="单次贡献值">{{ WindropGameResult.JackpotContribute / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="总球数">{{ WindropGameResult.BallNum }}</el-descriptions-item>
        <el-descriptions-item label="总下注金额">{{ WindropGameResult.BetAllScore / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="单球下注金币">{{ WindropGameResult.BetScore / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="当前能量">{{ WindropGameResult.CurEnergy / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="能量奖励">{{
          WindropGameResult.EnergyNum < 1000 ? WindropGameResult.EnergyNum + ' 球' : WindropGameResult.EnergyNum + ' 金币'
        }}
        </el-descriptions-item>
        <el-descriptions-item label="Spin总次数">{{ WindropGameResult.SpinCount }}</el-descriptions-item>
      </el-descriptions>
      <br>
      <el-table
        ref="filterTable"
        :data="WindropGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="ID"
          label="ID"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.ID+1" />
          </template>
        </el-table-column>
        <el-table-column
          prop="ODDS"
          label="倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.ODDS<0" style="color:red">spin</span>
            <span v-else>{{ scope.row.ODDS }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="BallTimes"
          label="翻倍次数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.BallTimes" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinOdd"
          label="spin中奖倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.SpinOdd" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinScore"
          label="spin中奖金币"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.SpinScore /1000)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Score"
          label="金币"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.Score /1000)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="TracksPos"
          label="路径"
          width="620"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.TracksPos" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="Windropc详情"
      :visible.sync="WindropcGameVisible"
      width="65%"
    >
      <br>
      <el-descriptions
        class="margin-top"
        :column="4"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item label="累计贡献值">{{
          WindropcGameResult.JackpotContributeTotal / 1000
        }}
        </el-descriptions-item>
        <el-descriptions-item label="单次贡献值">{{
          WindropcGameResult.JackpotContribute / 1000
        }}
        </el-descriptions-item>
        <el-descriptions-item label="总球数">{{ WindropcGameResult.BallNum }}</el-descriptions-item>
        <el-descriptions-item label="总下注金额">{{ WindropcGameResult.BetAllScore / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="单球下注金币">{{ WindropcGameResult.BetScore / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="当前能量">{{ WindropcGameResult.CurEnergy / 1000 }}</el-descriptions-item>
        <el-descriptions-item label="能量奖励">{{
          WindropcGameResult.EnergyNum < 1000 ? WindropcGameResult.EnergyNum + ' 球' : WindropcGameResult.EnergyNum + ' 金币'
        }}
        </el-descriptions-item>
        <el-descriptions-item label="Spin总次数">{{ WindropcGameResult.SpinCount }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formatTime(WindropcGameResult.StartTime) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formatTime(WindropcGameResult.FinishTime) }}</el-descriptions-item>
      </el-descriptions>
      <br>
      <el-table
        ref="filterTable"
        :data="WindropcGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="ID"
          label="ID"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.ID+1" />
          </template>
        </el-table-column>
        <el-table-column
          prop="ODDS"
          label="倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.ODDS<0" style="color:red">spin</span>
            <span v-else>{{ scope.row.ODDS }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="BallTimes"
          label="翻倍次数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.BallTimes" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinOdd"
          label="spin中奖倍数"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.SpinOdd" />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpinScore"
          label="spin中奖金币"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.SpinScore /1000)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Score"
          label="金币"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.Score /1000)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="JpLevel"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.JpLevel)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="JpType"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="formatNumber(scope.row.JpType)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="Score"
          label="Jp数额"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.JpType>10000">
              {{ formatNumber(scope.row.Jackpot) }}
            </span>
            <span v-else v-html="formatNumber(scope.row.Jackpot /1000)" />

          </template>
        </el-table-column>

        <el-table-column prop="cards" label="下注时间" width="110px">
          <template slot-scope="scope"> {{ formatHMSTime(scope.row.BallTime / 1000) }}.{{
            scope.row.BallTime % 1000
          }}
          </template>
        </el-table-column>

        <el-table-column
          prop="TracksPos"
          label="路径"
          width="620"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.TracksPos" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="骰宝牌局详情"
      :visible.sync="sicboGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">骰子结果：</span>
        <div style="color:red;">{{ sicboGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="sicboGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.Hit" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="IsBonus"
          label="ExtraPay命中"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsBonus==1" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="Rate"
          label="命中总赔率"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.Hit" style="color:red">{{ scope.row.Rate }}</span>
            <span v-else>0</span>
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
              :show-header="true"
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
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="骰宝牌局详情"
      :visible.sync="miniDvtGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">发牌：</span>
        <div style="color:red;">{{ miniDvtGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="miniDvtGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="赔率"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsHit" style="color:red">{{ scope.row.Odds / 1000 }}</span>
            <span v-else>0</span>

          </template>
        </el-table-column>

        <el-table-column
          prop="IsBonus"
          label="ExtraPay"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.EOdds / 1000 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="Rate"
          label="总赔率"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsHit" style="color:red">{{ scope.row.totalOdds / 1000000 }}</span>
            <span v-else>0</span>
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
              :data="scope.row.players"
              border
              :show-header="true"
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
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="Andar Bahar牌局详情"
      :visible.sync="miniAbGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">发牌：</span>
        <div style="color:red;">{{ miniAbGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="miniAbGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="赔率"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsHit" style="color:red">{{ scope.row.Odds / 1000 }}</span>
            <span v-else>-1</span>

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
              :data="scope.row.players"
              border
              :show-header="true"
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
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="7Up7Down牌局详情"
      :visible.sync="sevenGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">骰子结果：</span>
        <div style="color:red;">{{ sevenGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="sevenGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.Hit" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="IsBonus"
          label="ExtraPay命中"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsBonus==1" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="Rate"
          label="命中总赔率"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.Hit" style="color:red">{{ scope.row.Rate / 1000 }}</span>
            <span v-else>0</span>
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
              :show-header="true"
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
                  <!--                  这里倍率放大1000倍，金额也放大了1000倍-->
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="小火箭牌局详情"
      :visible.sync="rocketGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">爆炸点：</span>
        <div style="color:red;">{{ rocketGameResult }}</div>
      </div>
      <el-table
        ref="filterTable"
        :data="rocketGameOptions"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          prop="Name"
          label="下注项"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Hit"
          label="命中"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.ID==6"> - </span>
            <span v-else-if="scope.row.Hit" style="color:red">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="Rate"
          label="命中总赔率"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.ID==6"> - </span>
            <span v-else-if="scope.row.Hit" style="color:red">{{ scope.row.Rate }}</span>
            <span v-else>0</span>
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
              :show-header="true"
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
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="scope.row.ID==6"
                prop="stopOdds"
                label="停止倍数"
                width="200"
              >
                <template slot-scope="scope">
                  <span
                    v-if="parseInt(rocketGameResult) > scope.row.stopOdds / 100"
                    style="color:red"
                  >{{ scope.row.stopOdds / 100 }}</span>
                  <span v-else>{{ scope.row.stopOdds / 100 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Hilo详情" :visible.sync="hiloVisible" width="800px">

      <el-descriptions class="margin-top" title="" :column="4" border>
        <el-descriptions-item>
          <template slot="label">
            Jackpot贡献：
          </template>
          {{ hiloJackpotContribute }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            Jackpot累计贡献：
          </template>
          {{ hiloJackpotContributeTotal }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            Jackpot奖励：
          </template>
          {{ hiloJackpotAward }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总输赢倍数：
          </template>
          {{ (hiloTotalOdds / 100).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            输赢：
          </template>
          {{ hiloStopFlag == 2 ? 'win' : (hiloStopFlag == 1 ? 'lost' : 'unknown') }}
        </el-descriptions-item>

      </el-descriptions>

      <el-table :data="hiloCardList" border>
        <el-table-column prop="uid" label="Step">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="seat" label="操作">
          <template slot-scope="scope">{{ selectHiloNotation(scope.row.Notation) }}</template>
        </el-table-column>
        <el-table-column prop="cards" label="手牌">
          <template slot-scope="scope">
            <div v-html="libShow.CardShow(scope.row.Card)" />
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="倍数">
          <template slot-scope="scope">{{ (scope.row.Odds / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="isDealer" label="HitJackpot">
          <template slot-scope="scope">{{ scope.row.HitJackpot ? "是" : "-" }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="solitaire详情" :visible.sync="solitaireLog.solitaireVisible" width="1200px">
      <el-descriptions class="margin-top" title="" :column="4" border>

        <el-descriptions-item>
          <template slot="label">
            底注：
          </template>
          {{ solitaireLog.solitaireDetail.tableMoney / 1000 }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="solitaireLog.solitaireDetail.players" border>
        <el-table-column prop="uid" label="uid" width="125px">
          <template slot-scope="scope">
            <span>{{ scope.row.uid }}</span>
            <br>
            <span>{{
              '(' + (solitaireLog.solitaireDetail.winUid == 0 ? '平局' : (solitaireLog.solitaireDetail.winUid == scope.row.uid ? '赢' : '输')) + '_' + solitaireLogStopMap[solitaireLog.solitaireDetail.StopFlag] + ')'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seat" label="输赢">
          <template slot-scope="scope">{{ scope.row.moneyChange / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cards" label="当前金额">
          <template slot-scope="scope">
            {{ scope.row.moneyTotal / 1000 }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="翻牌张数">
          <template slot-scope="scope">{{ scope.row.flopCount }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="重置次数">
          <template slot-scope="scope">{{ scope.row.ResetCount }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="撤销次数">
          <template slot-scope="scope">{{ scope.row.WithdrawCount }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="积分">
          <template slot-scope="scope">{{ scope.row.userScore }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="剩余时间">
          <template slot-scope="scope">{{ scope.row.overTime + 's' }}</template>
        </el-table-column>
        <el-table-column prop="isDealer" label="结算">
          <template slot-scope="scope">
            <div style="height: 200px">
              <el-row>
                <span>放牌区</span>
              </el-row>
            </div>
            <div class="solitaireHeight">
              <hr class="blackJackHr">
              <el-row>
                <span>牌堆</span>
              </el-row>
            </div>
            <div style="height: 320px">
              <hr class="blackJackHr" style="width: 2000px">
              <el-row>
                <span>牌叠</span>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="isDealer" label="结算" width="1000px">
          <template slot-scope="scope">
            <div style="height: 200px">
              <el-row>
                <el-row v-for="(row,idx) in scope.row.resultCards" style="line-height: 5px">
                  <div v-for="(d,i) in row.cards" style="float:left;">
                    <el-image
                      :style="getCardStyle(i,d)"
                      :src="getCardUrl(cardConversionColor(solitaireCard(d),'0-2','1-4','2-3','3-1'))"
                    />
                    <br>
                    <span v-html="'&nbsp;'" />
                  </div>
                </el-row>
              </el-row>
            </div>
            <div class="solitaireHeight">
              <hr class="blackJackHr">
              <el-row>
                <span v-for="(row,idx) in scope.row.CardsPile" style="line-height: 5px">
                  <el-image
                    :style="getCardStyle(idx,row)"
                    :src="getCardUrl(cardConversionColor(solitaireCard(row),'0-2','1-4','2-3','3-1'))"
                  />
                </span>
              </el-row>
            </div>
            <div style="height: 320px">
              <hr class="blackJackHr">
              <el-row>
                <el-col v-for="(row,idx) in scope.row.cardsStacks" style="line-height: 15px">
                  <div v-for="(d,i) in row.cards" style="float:left;">
                    <el-image
                      :style="getCardStyle(i,d)"
                      :src="getCardUrl(cardConversionColor(solitaireCard(d),'0-2','1-4','2-3','3-1'))"
                    />
                    <span v-html="'&nbsp;'" />
                  </div>
                </el-col>

              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-if="goldmasterLog.visible" title="黄金矿工 详情" :visible.sync="goldmasterLog.visible" width="1400px">
      <el-descriptions class="margin-top" title="" :column="5" border>
        <el-descriptions-item>
          <template slot="label">
            UID：
          </template>
          {{ goldmasterLog.detail.uid }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总输赢：
          </template>
          <span :style="WinOrLoseColor(goldmasterLog.detail.TotalAddMoney )"> {{
              formatNumber((goldmasterLog.detail.moneyReturn -goldmasterLog.detail.moneyBet) / 1000)
            }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结算后金额：
          </template>
          {{ formatNumber(goldmasterLog.detail.moneyCur / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            记录开始时间：
          </template>
          {{ formatTime(goldmasterLog.detail.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            记录结束时间：
          </template>
          {{ formatTime(goldmasterLog.detail.finishTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            付费敲击次数：
          </template>
          {{ goldmasterLog.detail.feeTapTimes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总下注金额：
          </template>
          {{ goldmasterLog.detail.moneyBet / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            台费：
          </template>
          {{ goldmasterLog.detail.moneyFee / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            累计赢钱：
          </template>
          {{ formatNumber(goldmasterLog.detail.moneyReturn / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP贡献：
          </template>
          {{ formatNumber(goldmasterLog.detail.jpContribute / 1000) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="goldmasterLog.detail.kLogs" border title="中奖记录" :row-style="changColorGoldMaster">
        <el-table-column prop="typ" label="奖励类型">
          <template slot-scope="scope">{{ GoldMasterTypeOptions[parseKnockExt(scope.row.knockExt).typ] }}</template> //todo:
        </el-table-column>
        <el-table-column prop="cards" label="敲击时间" width="110px">
          <template slot-scope="scope"> {{ formatHMSTime(scope.row.logTime / 1000) }}.{{
              scope.row.logTime % 1000
            }}
          </template>
        </el-table-column>
        <el-table-column prop="seat" label="消耗金币">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="下注金额">
          <template slot-scope="scope">{{ scope.row.moneyCalc / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="返奖">
          <template slot-scope="scope">{{ scope.row.moneyReturn / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="记录后金额" width="150px">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyCur / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="jpLevel">
          <template slot-scope="scope">{{ GoldMasterJackpotLevel[scope.row.jpLevel] }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="jpTyp">
          <template slot-scope="scope">{{ scope.row.jpType }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="金币倍数">
          <template slot-scope="scope">{{ parseKnockExt(scope.row.knockExt).moneyOdds / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="转盘倍数">
          <template slot-scope="scope">{{ parseKnockExt(scope.row.knockExt).plateOdds / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="转轴倍数">
          <template slot-scope="scope">
            {{ showPigData(scope.row.typ, scope.row.moneyBet) ? (parseKnockExt(scope.row.knockExt).spinOdds / 1000) : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="F次数收益">
          <template slot-scope="scope">{{
              showPigData(scope.row.typ, scope.row.moneyBet) ? parseKnockExt(scope.row.knockExt).timesIn : 0
            }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="N倍数收益">
          <template slot-scope="scope">{{
              showPigData(scope.row.typ, scope.row.moneyBet) ? (parseKnockExt(scope.row.knockExt).oddsIn / 1000) : 0
            }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="剩余免费次数">
          <template slot-scope="scope">{{
              showPigData(scope.row.typ, scope.row.moneyBet) ? parseKnockExt(scope.row.knockExt).timesFree : 0
            }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="Progress">
          <template slot-scope="scope">{{ parseKnockExt(scope.row.knockExt).progress }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-if="piggyLog.visible" title="piggy详情" :visible.sync="piggyLog.visible" width="1400px">
      <el-descriptions class="margin-top" title="" :column="5" border>
        <el-descriptions-item>
          <template slot="label">
            UID：
          </template>
          {{ piggyLog.detail.SingleUid }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总输赢：
          </template>
          <span :style="WinOrLoseColor(piggyLog.detail.TotalAddMoney )"> {{
            formatNumber(piggyLog.detail.TotalAddMoney / 1000)
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            当前金额：
          </template>
          {{ formatNumber(piggyLog.detail.CurrentMoney / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            记录开始时间：
          </template>
          {{ formatTime(piggyLog.detail.Piggy.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            记录结束时间：
          </template>
          {{ formatTime(piggyLog.detail.FinishTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            操作次数(敲击/购买)
          </template>
          {{ piggyLog.detail.Piggy.handTimes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            敲击次数：
          </template>
          {{ piggyLog.detail.Piggy.tapTimes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            免费敲击次数：
          </template>
          {{ piggyLog.detail.Piggy.freeTimes }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总下注金额：
          </template>
          {{ piggyLog.detail.Piggy.totalBet / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            台费：
          </template>
          {{ piggyLog.detail.Piggy.MoneyFee / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            累计赢钱：
          </template>
          {{ formatNumber(piggyLog.detail.Piggy.totalWon / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结算后金额：
          </template>
          {{ formatNumber(piggyLog.detail.Piggy.curMoney / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP贡献：
          </template>
          {{ formatNumber(piggyLog.detail.Piggy.JackpotContribute / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP累计贡献：
          </template>
          {{ formatNumber(piggyLog.detail.Piggy.JackpotContributeTotal / 1000) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="piggyLog.detail.Piggy.awards" border title="中奖记录" :row-style="changColor">
        <el-table-column prop="typ" label="奖励类型">
          <template slot-scope="scope">{{ piggyTypeOptions[scope.row.typ] }}</template>
        </el-table-column>
        <el-table-column prop="cards" label="敲击时间" width="110px">
          <template slot-scope="scope"> {{ formatHMSTime(scope.row.tapTime / 1000) }}.{{
            scope.row.tapTime % 1000
          }}
          </template>
        </el-table-column>
        <el-table-column prop="seat" label="消耗金币">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="下注金额">
          <template slot-scope="scope">{{ scope.row.calcBet / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="赢钱">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="记录后金额" width="150px">
          <template slot-scope="scope">{{ formatNumber(scope.row.curMoney / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="jpLevel">
          <template slot-scope="scope">{{ piggyJackpotLevle[scope.row.jackpotLevel] }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="jpTyp">
          <template slot-scope="scope">{{ scope.row.jackpotType }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="金币倍数">
          <template slot-scope="scope">{{ scope.row.moneyOdds / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="转盘倍数">
          <template slot-scope="scope">{{ scope.row.plateOdds / 1000 }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="转轴倍数">
          <template slot-scope="scope">
            {{ showPigData(scope.row.typ, scope.row.moneyBet) ? (scope.row.spinOdds / 1000) : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="F次数收益">
          <template slot-scope="scope">{{
            showPigData(scope.row.typ, scope.row.moneyBet) ? scope.row.timesIn : 0
          }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="N倍数收益">
          <template slot-scope="scope">{{
            showPigData(scope.row.typ, scope.row.moneyBet) ? (scope.row.oddsIn / 1000) : 0
          }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="剩余免费次数">
          <template slot-scope="scope">{{
            showPigData(scope.row.typ, scope.row.moneyBet) ? scope.row.timesFree : 0
          }}
          </template>
        </el-table-column>
        <el-table-column prop="cardScore" label="Progress">
          <template slot-scope="scope">{{ scope.row.progress }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <pusoy-dos-detail-log
      :game-log="pusoyDos.pusoyDosDetail"
      :game-log-visible="pusoyDos.pusoyDosDetailVisible"
      :gid="34"
      @closeDialog="closeDialog"
    />

    <el-dialog
      v-if="gameLogComponent.gid === 110"
      title="VideoPoker详情"
      :visible.sync="gameLogComponent.visible"
      width="1200px"
    >
      <el-descriptions class="margin-top" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            前注：
          </template>
          {{ formatNumber(gameLogComponent.detail.Bet / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始时间：
          </template>
          {{ formatTime(gameLogComponent.detail.StartTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结束时间：
          </template>
          {{ formatTime(gameLogComponent.detail.FinishTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            输赢：
          </template>
          {{ formatNumber(gameLogComponent.detail.VideoPoker.moneyWon / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            首发牌：
          </template>
          <span v-for="(k,v) in gameLogComponent.detail.VideoPoker.cardsDeal">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
            />
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            最终牌：
          </template>
          <span v-for="(k,v) in gameLogComponent.detail.VideoPoker.cardsFinal">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
            />
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP贡献：
          </template>
          {{ formatNumber(gameLogComponent.detail.VideoPoker.jackpotContribute / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP累计贡献：
          </template>
          {{ formatNumber(gameLogComponent.detail.VideoPoker.jackpotContributeTotal / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP奖励：
          </template>
          {{ formatNumber(gameLogComponent.detail.VideoPoker.jackpotAward / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            玩法模式：
          </template>
          {{ gameLogComponent.detail.VideoPoker.gameMode === 1 ? 'Jacks or Better' : 'Deuces Wild' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            最终牌型：
          </template>
          {{ getVideoPokerCardType() }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            牌型赔率：
          </template>
          {{ gameLogComponent.detail.VideoPoker.cardTypeOdds / 1000 }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      v-if="gameLogComponent.gid === 107"
      title="Baccarat详情"
      :visible.sync="gameLogComponent.visible"
      width="1200px"
    >
      <el-descriptions class="margin-top" title="" :column="5" border>
        <el-descriptions-item>
          <template slot="label">
            前注：
          </template>
          {{ formatNumber(gameLogComponent.detail.Bet / 1000) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始时间：
          </template>
          {{ formatTime(gameLogComponent.detail.StartTime) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结束时间：
          </template>
          {{ formatTime(gameLogComponent.detail.FinishTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            庄家手牌：
          </template>
          <span v-for="(k,v) in gameLogComponent.detail.Bcr.dealerCards">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
            />
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            玩家手牌：
          </template>
          <span v-for="(k,v) in gameLogComponent.detail.Bcr.playerCards">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
            />
          </span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        :data="gameLogComponent.detail.Bcr.options"
        border
        :header-cell-style="{'text-align':'center'}"
        :row-style="getHitStyle"
      >
        <el-table-column label="区域ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="命中">
          <template slot-scope="scope">{{ scope.row.isHit == 0 ? '否' : '是' }}</template>
        </el-table-column>
        <el-table-column label="倍率">
          <template slot-scope="scope">{{ scope.row.odds / 1000 }}</template>
        </el-table-column>
        <el-table-column label="区域累计下注">
          <template slot-scope="scope">{{ formatNumber(scope.row.optionBetAll / 1000) }}</template>
        </el-table-column>
      </el-table>
      <el-table :data="gameLogComponent.detail.Bcr.players" border :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="uid" label="UID" width="80px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="下注金额" width="80px">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="当前金额" width="80px">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyEnd / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="下注前金额" width="100px">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyOrigin / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="输赢" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyWon>0" style="color: red">
              {{ formatNumber(scope.row.moneyWon / 1000) }}
            </span>
            <span v-else style="color: green">
              {{ formatNumber(scope.row.moneyWon / 1000) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="下注详情" width="auto">
          <template slot-scope="scope">
            <el-table :data="scope.row.areaRet" border :row-style="getHitStyle">
              <el-table-column label="区域ID">
                <template slot-scope="scope2">{{ scope2.row.id }}</template>
              </el-table-column>
              <el-table-column label="区域下注金额">
                <template slot-scope="scope2">{{ formatNumber(scope2.row.optionBet / 1000) }}</template>
              </el-table-column>
              <el-table-column label="命中">
                <template slot-scope="scope2">{{ scope2.row.isHit == 0 ? '否' : '是' }}</template>
              </el-table-column>
              <el-table-column label="区域输赢">
                <template slot-scope="scope2">{{ formatNumber(scope2.row.moneyWon / 1000) }}</template>
              </el-table-column>
              <el-table-column label="倍率">
                <template slot-scope="scope2">{{ scope2.row.odds / 1000 }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      v-if="gameLogComponent.gid==108"
      title="DropBall详情"
      :visible.sync="gameLogComponent.visible"
      width="1300px"
    >
      <el-descriptions class="margin-top" title="" :column="5" border>
        <el-descriptions-item>
          <template slot="label">
            牌组：
          </template>
          <span v-for="(k,idx) in gameLogComponent.detail.Dropball.cards">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl( getDropballImg(k))"
            />
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            JP牌组条件：
          </template>
          <span v-for="(idx) of 3 ">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl( getDropballImg(gameLogComponent.detail.Dropball.luckyPachinkoCard))"
            />
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            前注：
          </template>
          {{ formatNumber(gameLogComponent.detail.Bet / 1000) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        :data="gameLogComponent.detail.Dropball.options"
        border
        :row-style="getHitDropBallStyle"
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
      >
        <el-table-column label="区域ID" width="80px">
          <template slot-scope="scope">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl( getDropballImg(scope.row.id))"
            />
          </template>
        </el-table-column>
        <el-table-column label="命中" width="80px">
          <template slot-scope="scope">{{ scope.row.Result == 0 ? '否' : '是' }}</template>
        </el-table-column>
        <el-table-column label="倍率" width="80px">
          <template slot-scope="scope">{{ formatNumber(scope.row.Rate / 1000) }}</template>
        </el-table-column>
        <el-table-column label="区域累计下注" width="80px">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
        </el-table-column>
        <el-table-column label="下注结果" style="width: 1000px">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.players"
              border
              size="mini"
              :header-cell-style="{fontSize:'12px',height:'10px'}"
              :row-style="getUserWonStyle"
              :cell-style="{height:'10px'}"
              style="min-height:50px"
            >
              <el-table-column prop="uid" label="uid">
                <template slot-scope="scope">{{ scope.row.uid }}</template>
              </el-table-column>
              <el-table-column prop="uid" label="moneyBet">
                <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
              </el-table-column>
              <el-table-column prop="uid" label="moneyWon">
                <template slot-scope="scope">{{ formatNumber(scope.row.moneyWon / 1000) }}</template>
              </el-table-column>
              <el-table-column prop="uid" label="moneyTaxed">
                <template slot-scope="scope">{{ formatNumber(scope.row.moneyTaxed / 1000) }}</template>
              </el-table-column>
              <!--              <el-table-column prop="uid" label="Jackpot贡献" >-->
              <!--                <template slot-scope="scope2">{{scope2.row.playerData.JackpotContribute /1000}}</template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column prop="uid" label="Jackpot总贡献" >-->
              <!--                <template slot-scope="scope2">{{scope2.row.playerData.JackpotContributeTotal/ 1000}}</template>-->
              <!--              </el-table-column>-->
              <el-table-column prop="uid" label="JackpotAward">
                <template slot-scope="scope2">{{
                  scope2.row.playerData.LuckyPachinko ? scope2.row.playerData.LuckyPachinko.Jackpot.JackpotAward / 1000 : ''
                }}
                </template>
              </el-table-column>
              <el-table-column prop="uid" label="JackpotType">
                <template slot-scope="scope2">{{
                  jackpotType[scope2.row.playerData.LuckyPachinko ? scope2.row.playerData.LuckyPachinko.Jackpot.JackpotType : -1]
                }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Carracing详情" :visible.sync="carracingDetailVisible" width="1300px">
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">开奖logo：</span>
        <div style="color:red;">{{ getCarracingCarLogoName() }}</div>
      </div>

      <el-table ref="filterTable" :data="carracingData.players" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="Target">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.optionsResult" class="block">
              <hr v-if="index > 0">
              <el-divider direction="vertical" />
              </hr>
              {{ getCarracingLogoName(item.id) }}
              <!--{{getCarracingLogoName(item.id) + '(' + item.moneyBet/1000 + ')'}}-->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="Bet">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="JackPot">
          <template slot-scope="scope">
            {{ scope.row.LuckyPachinko ? scope.row.LuckyPachinko.Jackpot.JackpotAward / 1000 : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="JackpotType">
          <template slot-scope="scope">
            {{ jackpotType[scope.row.LuckyPachinko ? scope.row.LuckyPachinko.Jackpot.JackpotType : -1] }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="win">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyWin / 1000) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="JackpotWheel详情" :visible.sync="jackpotWheelDetailVisible" width="1300px">
      <el-table ref="filterTable" :data="jackpotWheelData.players" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="Target">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.optionsResult" class="block">
              <hr v-if="index > 0">
              <el-divider direction="vertical" />
              </hr>
              {{ getJackpotWheelLogoName(item.id) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="Bet">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="JackPot">
          <template slot-scope="scope">
            {{ scope.row.luckyPachinko ? (scope.row.luckyPachinko.JackpotAward - scope.row.moneyWin - scope.row.moneyBet) / 1000 : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="JackpotType">
          <template slot-scope="scope">
            {{ jackpotType[scope.row.luckyPachinko ? scope.row.luckyPachinko.JackpotType : -1] }}
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="win">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyWin / 1000) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="FreeSpin详情" :visible.sync="freeSpinDetailVisible" width="1300px">
      <el-table ref="filterTable" :data="freeSpinData.players" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="Target">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.optionsResult" class="block">
              <hr v-if="index > 0">
              <el-divider direction="vertical" />
              </hr>
              {{ getFreeSpinLogoName(item.id) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="Bet">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="win">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyWin / 1000) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="FilipionMahjong详情" :visible.sync="FilipinoMahjongDetailVisible" width="1600px">
      <div v-if="FilipinoMahjongDetail.isLiuJu === true" style=" font-size:32px; line-height: 36px; height: 36px; color:red; ">
        <span style="float:left;">流局</span>
      </div>
      <div style=" font-size:14px; line-height: 60px; height: 60px;">
        <span style="float:left;">癞子：</span>
        <div v-for="(item,index) in FilipinoMahjongDetail.jokerCards" class="block">
          <el-image style="width: 37px; height: 50px" :src="getMahjongCardUrl(item)" />
        </div>
      </div>
      <div style=" font-size:14px; line-height: 50px; height: 50px;">
        <span style="float:left;">骰子：</span>
        <div v-for="(item,index) in FilipinoMahjongDetail.dices" class="block">
          <el-image style="width: 37px; height: 40px" :src="getMahjongDiceUrl(item)" />
        </div>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:red; ">
        <span style="float:left;">{{ '底分:' + FilipinoMahjongDetail.tableMoney/1000 }}</span>
      </div>
      <el-table ref="filterTable" :data="FilipinoMahjongDetail.playerList" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="nick">
          <template slot-scope="scope">{{ scope.row.nick }}</template>
        </el-table-column>
        <el-table-column prop="seat" label="seat" width="60px">
          <template slot-scope="scope">{{ scope.row.seat }}</template>
        </el-table-column>
        <el-table-column prop="dealer" label="庄家" width="60px">
          <template slot-scope="scope">{{ scope.row.uid === FilipinoMahjongDetail.bankerUid ? '是' : '-' }}</template>
        </el-table-column>
        <el-table-column prop="flowercards" label="花牌" width="300px">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.huaCards" class="block">
              <el-image style="width: 37px; height: 50px" :src="getMahjongCardUrl(item)" />
            </div>
            <span v-if="scope.row.noFlowerStart === true" style="float:right; color:red;">{{ '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ridgecards" label="坎牌 from uid" width="250px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.ridgeCards" :key="index" class="ridge">
              <div v-for="(card, i) in scope.row.ridgeCards[index].cards" class="block">
                <el-image style="width: 37px; height: 50px" :src="getMahjongCardUrl(card)" />
              </div>
              <!--
            <span style="float:right; color:red;" v-if="scope.row.ridgeCards[index].fromUid > 0">{{ scope.row.ridgeCards[index].fromUid+(scope.row.ridgeCards[index].ridgeType == 5 ? '(加)' : scope.row.ridgeCards[index].ridgeType == 2 ? '('+scope.row.ridgeCards[index].usedCard+')' : '')}}</span>
            -->
              <span style="float:right; color:red;">{{ (scope.row.ridgeCards[index].ridgeType == 5 ? '(加)' : scope.row.ridgeCards[index].ridgeType == 2 ? '('+scope.row.ridgeCards[index].usedCard+')' : '') }}</span>
              <span v-if="scope.row.ridgeCards[index].fromUid > 0" style="float:right;">{{ scope.row.ridgeCards[index].fromUid }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="handcards" label="手牌" width="340px">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.handCards" class="block">
              <el-image style="width: 37px; height: 50px" :src="getMahjongCardUrl(item)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hucards" label="胡牌" width="80px">
          <template v-if="scope.row.huCard > 0" slot-scope="scope">
            <el-image style="width: 37px; height: 50px" :src="getMahjongCardUrl(scope.row.huCard)" />
          </template>
        </el-table-column>
        <el-table-column prop="somedata" label="番" width="134px">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.someInfo" :key="index" class="some">
              {{ item.someName }}
            </div>
            <span v-if="isMahjongFangChongUser(scope.row.uid)" style="float:left; color:red;">{{ '点炮' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="husomecount" label="番数">
          <template v-if="scope.row.huSomeCount> 0" slot-scope="scope">
            {{ scope.row.huSomeCount }}
          </template>
        </el-table-column>
        <el-table-column prop="settle" label="结算">
          <template slot-scope="scope">
            {{ scope.row.trophy }}
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog title="Remi详情" :visible.sync="RemiDetailVisible" width="1200px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:red; ">
        <span style="float:left;">{{ '底分:' + RemiDetail.tableMoney/1000 }}</span>
      </div>
      <el-table ref="filterTable" :data="RemiDetail.players" border>
        <el-table-column prop="uid" label="uid" width="128px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="nick"  width="180px">
          <template slot-scope="scope">{{ scope.row.nick }}</template>
        </el-table-column>
        <el-table-column prop="seat" label="seat" width="64px">
          <template slot-scope="scope">{{ scope.row.seat }}</template>
        </el-table-column>
        <!--
        <el-table-column prop="handcards" label="手牌" width="340px">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.handCards" class="block">
              <el-image style="width: 37px; height: 50px" :src="getCardUrl(item)" />
            </div>
          </template>
        </el-table-column>
        -->
        <el-table-column prop="groupcards" label="组合牌" width="340px">
        <template slot-scope="scope">
          <template v-if="scope.row.groups">
            <template v-for="group in scope.row.groups">
              <template v-if="group.cardType === 1 || group.cardType === 2">
                <div class="block" style="background-color: green; margin: 0 1px 0 1px;">
                  <div v-for="card in group.cards" class="block">
                      <el-image
                      style="width: 37px; height: 50px"
                      :src="getCardUrl(card)"
                      />
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-for="card in group.cards" class="block">
                    <el-image
                    style="width: 37px; height: 50px"
                    :src="getCardUrl(card)"
                     />
                </div>
              </template>
            </template>
          </template>
        </template>
        </el-table-column>
        <el-table-column prop="score" label="score" width="100px">
          <template slot-scope="scope">{{ scope.row.score }}</template>
        </el-table-column>
        <el-table-column prop="win" label="赢牌顺序" width="100px">
          <template slot-scope="scope">{{ scope.row.winIndex > 0 ? scope.row.winIndex : '' }}</template>
        </el-table-column>
        <el-table-column prop="settle" label="结算">
          <template slot-scope="scope">
            {{ scope.row.moneyChange }}
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog title="Truco详情" :visible.sync="TrucoDetailVisible" width="1200px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:red; ">
        <span style="float:left;">{{ '底分:' + TrucoDetail.tableMoney/1000 }}</span>
      </div>
      <el-table ref="filterTable" :data="TrucoDetail.players" border>
        <el-table-column prop="uid" label="uid" width="128px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="nick"  width="180px">
          <template slot-scope="scope">{{ scope.row.nick }}</template>
        </el-table-column>
        <el-table-column prop="seat" label="seat" width="64px">
          <template slot-scope="scope">{{ scope.row.seat }}</template>
        </el-table-column>
        <el-table-column label="team" width="100px">
          <template slot-scope="scope">
              <div
                :style="{
                  backgroundColor: getTrucoTeamColor(scope.row.team),
                  width: '50px',
                  height: '50px',
                  display: 'inline-block'
                }"
              ></div>
          </template>
        </el-table-column>

        <el-table-column prop="settle" label="结算">
          <template slot-scope="scope">
            {{ scope.row.moneyChange }}
          </template>
        </el-table-column>
      </el-table>
      <br>

      <el-table ref="filterTable" :data="TrucoDetail.roundDetail" border>
        <el-table-column prop="vsScore" label="红 vs 绿" width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.vsScore[0] + ' vs ' + scope.row.vsScore[1]}}</template>
        </el-table-column>
        <el-table-column label="viradaCard牌 => 最大牌" width="220">
          <template slot-scope="scope">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(scope.row.viradaCard)"
            />
            <span>{{ ' => ' }}</span>
            <el-image
              style="width: 37px; height: 50px"
              :src="trucoMaxCardUrl(scope.row.viradaCard)"
            />
            <br>
            <span>{{trucoCardNumSort(scope.row.viradaCard)}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="roundScore" label="本轮底分" width="50px"/>

        <el-table-column prop="players" label="牌局" width="320px" >
          <template slot-scope="scope">
            <el-table ref="filterTable" :data="scope.row.players" border :cell-style="libShow.DefaultTableCell" style="width: 100%">
              <el-table-column prop="uid" label="uid" width="100"/>
              <el-table-column label="team" width="60">
                <template slot-scope="scope">
                  <div
                    :style="{
                      backgroundColor: getTrucoTeamColor(scope.row.team),
                      width: '50px',
                      height: '50px',
                      display: 'inline-block'
                    }"
                  ></div>
                </template>
              </el-table-column>

              <el-table-column prop="handCards" label="手牌" width="150">
                <template slot-scope="scope">
                  <div v-for="(item) in scope.row.handCards" class="block">
                    <el-image style="width: 37px; height: 50px" :src="getCardUrl(item)" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column prop="turns" label="比牌" width="800px" >
          <template slot-scope="scope">
            <el-table ref="filterTable" :data="scope.row.turns" border :cell-style="libShow.DefaultTableCell" style="width: 100%">
              <el-table-column prop="count" label="回合" width="50"/>
              <el-table-column label="回合结果" width="80">
                <template slot-scope="scope">
                  <div
                    :style="{
                      backgroundColor: getTrucoTeamColor(scope.row.result),
                      width: '50px',
                      height: '50px',
                      display: 'inline-block'
                    }"
                  ></div>
                </template>
              </el-table-column>
              <el-table-column prop="cards" label="cards" width="800px" >
                <template slot-scope="scope">
                  <el-table ref="filterTable" :data="scope.row.cards" border :cell-style="libShow.DefaultTableCell" style="width: 100%">
                    <el-table-column prop="Count" label="顺序" width="50"/>
                    <el-table-column prop="uid" label="uid" width="100"/>
                    <el-table-column label="牌" width="100">
                      <template slot-scope="scope">
                          <el-image
                            style="width: 37px; height: 50px"
                            :src="getCardUrl(scope.row.Card)"
                          />
                      </template>
                    </el-table-column>
                    <el-table-column prop="Covered" label="暗牌" width="100"/>
                  </el-table>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog title="Buraco详情" :visible.sync="BuracoDetailVisible" width="1600px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:red; ">
        <span style="float:left;">{{ '底分:' + BuracoDetail.tableMoney/1000 }}</span>
      </div>
      <el-table ref="filterTable" :data="BuracoDetail.players" border>
        <el-table-column prop="uid" label="uid" width="128px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="nick"  width="180px">
          <template slot-scope="scope">{{ scope.row.nick }}</template>
        </el-table-column>
        <el-table-column prop="seat" label="seat" width="64px">
          <template slot-scope="scope">{{ scope.row.seat }}</template>
        </el-table-column>
        <el-table-column label="team" width="60px">
          <template slot-scope="scope">
              <div
                :style="{
                  backgroundColor: getBuracoTeamColor(scope.row.team),
                  width: '30px',
                  height: '30px',
                  display: 'inline-block'
                }"
              ></div>
          </template>
        </el-table-column>
        <el-table-column prop="settle" label="结算">
          <template slot-scope="scope">
            {{ scope.row.moneyChange }}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-table ref="filterTable" :data="BuracoDetail.teamDetail" border>
        <el-table-column label="team" width="60">
          <template slot-scope="scope">
            <div
              :style="{
                backgroundColor: getBuracoTeamColor(scope.row.teamId),
                width: '30px',
                height: '30px',
                display: 'inline-block'
              }"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="canastrasSujas" label="Canastras Sujas" width="160px">
          <template slot-scope="scope">{{ scope.row.canastrasSujas }}</template>
        </el-table-column>
        <el-table-column prop="canastrasLimpas" label="Canastras Limpas" width="160px">
          <template slot-scope="scope">{{ scope.row.canastrasLimpas }}</template>
        </el-table-column>
        <el-table-column prop="canastrasMeia" label="Canastras de 500" width="160px">
          <template slot-scope="scope">{{ scope.row.canastrasMeia }}</template>
        </el-table-column>
        <el-table-column prop="canastrasReals" label="Canastras Real 1000" width="160px">
          <template slot-scope="scope">{{ scope.row.canastrasReals }}</template>
        </el-table-column>
        <el-table-column prop="mesa" label="Mesa" width="128px">
          <template slot-scope="scope">{{ scope.row.mesa }}</template>
        </el-table-column>
        <el-table-column prop="batida" label="Batida" width="128px">
          <template slot-scope="scope">{{ scope.row.batida }}</template>
        </el-table-column>
        <el-table-column prop="hands" label="Maos" width="128px">
          <template slot-scope="scope">{{ scope.row.hands }}</template>
        </el-table-column>
        <el-table-column prop="morto" label="Morto" width="128px">
          <template slot-scope="scope">{{ scope.row.morto }}</template>
        </el-table-column>
        <el-table-column prop="total" label="Total" width="128px">
          <template slot-scope="scope">{{ scope.row.total }}</template>
        </el-table-column>
      </el-table>
      <br>
      <el-table ref="filterTable" :data="BuracoDetail.actionLogs" border>
        <el-table-column prop="idx" label="步骤" width="80px">
          <template slot-scope="scope">{{ '第'+scope.row.idx+'步' }}</template>
        </el-table-column>
        <el-table-column label="team" width="60">
          <template slot-scope="scope">
            <div
              :style="{
                backgroundColor: getBuracoTeamColor(scope.row.teamId),
                width: '30px',
                height: '30px',
                display: 'inline-block'
              }"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="uid" width="80px">
          <template slot-scope="scope">{{ scope.row.uid > 0 ? scope.row.uid : '' }}</template>
        </el-table-column>
        <el-table-column prop="actionType" label="actionType" width="100px">
          <template slot-scope="scope">{{ getBuracoActionDec(scope.row.actionType) }}</template>
        </el-table-column>
        <el-table-column prop="opCards" label="opCards" width="680px" >
          <template slot-scope="scope">
            <span v-if="scope.row.appendsCards"><!--组合追加牌-->
              <div v-for="(item, index) in scope.row.appendsCards" :key="index" class="block">
                <el-image style="width: 37px; height: 50px" :src="getBuracoCardUrl(item)" />
              </div>
              <span>{{' + '}}</span>
              <div v-for="(item) in scope.row.opCards" class="block">
                <span v-if="IstBuracoAppendsCards(item, scope.row.appendsCards)">
                  <el-image style="width: 37px; height: 50px" :src="getBuracoCardUrl(item)" />
                </span>
              </div>
            </span>
            <span v-else>
              <div v-for="(item) in scope.row.opCards" class="block">
                <el-image style="width: 37px; height: 50px" :src="getBuracoCardUrl(item)" />
              </div>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="groups" label="groups" width="650px" >
          <template slot-scope="scope">
            <el-card v-for="g in scope.row.groups" class="box-card"><!--组合牌-->
              <div v-for="(item) in g" class="block">
                <el-image style="width: 37px; height: 50px" :src="getBuracoCardUrl(item)" />
              </div>
            </el-card>
          </template>
        </el-table-column>
        <!--
        <el-table-column prop="handcards" label="handcards" width="650px" >
          <template slot-scope="scope">
            <div v-for="c in scope.row.handcards" class="block">
              <el-image style="width: 37px; height: 50px" :src="getBuracoCardUrl(c)" />
            </div>
          </template>
        </el-table-column>
      -->
      </el-table>
    </el-dialog>

    <el-dialog title="Limbo详情" :visible.sync="LimboDetailVisible" width="1200px">
      <el-table ref="filterTable" :data="LimboDetail.players" border>
        <el-table-column prop="uid" label="uid" width="128px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="昵称"  width="150px">
          <template slot-scope="scope">{{ scope.row.nick }}</template>
        </el-table-column>
        <el-table-column prop="bet" label="下注金额"  width="150px">
          <template slot-scope="scope">{{ scope.row.betMoney }}</template>
        </el-table-column>
        <el-table-column prop="obMul" label="下注赔率"  width="150px">
          <template slot-scope="scope">{{ scope.row.obMultiple/100 }}</template>
        </el-table-column>
        <el-table-column prop="payoutMultiple" label="爆炸点"  width="150px">
          <template slot-scope="scope">{{ scope.row.payoutMultiple/100 }}</template>
        </el-table-column>
        <el-table-column prop="moneyChange" label="输赢"  width="150px">
          <template slot-scope="scope">{{ scope.row.moneyChange }}</template>
        </el-table-column>
        <el-table-column prop="bonusMultiple" label="中bonus倍数"  width="150px">
          <template slot-scope="scope">{{ scope.row.bonusMultiple }}</template>
        </el-table-column>
        <el-table-column prop="bonusMoney" label="bonus奖励"  width="150px">
          <template slot-scope="scope">{{ scope.row.bonusMoney }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

     <el-dialog title="Pirate Scratch详情" :visible.sync="PirateScratchVisible" width="1200px">
      <el-table ref="filterTable" :data="PirateScratchDetail.players" border>
        <el-table-column prop="uid" label="uid" width="128px">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="nick" label="下注"  width="150px">
          <template slot-scope="scope">{{ scope.row.betMoney/1000 }}</template>
        </el-table-column>
        <el-table-column prop="moneyChange" label="输赢"  width="150px">
          <template slot-scope="scope">{{ scope.row.moneyChange /1000}}</template>
        </el-table-column>
        <el-table-column prop="bonusMultiple" label="jackPot"  width="150px">
          <template slot-scope="scope">{{ scope.row.JackpotNum /1000}}</template>
        </el-table-column>
      </el-table>





      <div class="grid-container">
        <div class="grid-outer-frame">
            <div class="number-container">
              <span  v-for="(item, index) in PirateScratchDetail.openNumber" class="grid-cell">
                <span v-if="item.isLucky===true" style="color: red;"> {{ item.number }}</span>
                <span v-if="item.isLucky===false" style="color: black;"> {{ item.number }}</span>
              </span>
          </div>
         <p></p>
         <p></p>
         <p></p>
          <div class="grid-wrapper">
            <div
              v-for="(item, index) in PirateScratchDetail.blockItems"
              :key="index"
              class="grid-cell"
            >
              <div class="cell-top" v-if="item.blockType !== 2">

                 <span v-if="item.isAward===true" style="color: red;">
                  <span >{{ item.number }}</span>
                  <span v-if="item.blockType===1">X</span>
                </span>

                   <span v-if="item.isAward===false" style="color: black;">
                  <span >{{ item.number }}</span>
                  <span v-if="item.blockType===1">X</span>
                </span>



              </div>
              <div class="cell-divider" v-if="item.blockType !== 2"></div>
              <div class="cell-bottom" v-if="item.blockType !== 2">
                  <span v-if="item.isAward===true" style="color: red;">
                    <span v-if="item.blockType===1">
                       {{ item.bonus/(item.number*1000) }}
                    </span>
                    <span v-if="item.blockType!==1">
                       {{ item.bonus/1000 }}
                    </span>
                   
                </span>
                   <span v-if="item.isAward===false" style="color: black;">
                    {{ item.bonus/1000 }}
                     <span v-if="item.blockType===1">
                       {{ item.bonus/(item.number*1000) }}
                    </span>
                     <span v-if="item.blockType!==1">
                       {{ item.bonus/1000 }}
                    </span>
                </span>
              </div>

            <div v-if="item.blockType === 2" class="cell-top">
                <span style="color: red;"> JackPot</span>
            </div>
            </div>

          </div>
        </div>
      </div>



    </el-dialog>

    <el-dialog title="ChickenGo详情" :visible.sync="ChickenGoDetailVisible" width="1200px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '困难级别:' + getChickenGoLevel(ChickenGoDetail.level) }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '下注金额:' + ChickenGoDetail.betMoney }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '到达倍率:' + ChickenGoDetail.arriveIn/100 }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '获得倍率:' + ChickenGoDetail.multipleResult/100 }}</span>
      </div>
    </el-dialog>

    <el-dialog title="MannyPunch详情" :visible.sync="MannyPunchDetailVisible" width="1200px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '困难级别:' + getMannyPunchLevel(MannyPunchDetail.level) }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '下注金额:' + MannyPunchDetail.betMoney }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '到达倍率:' + MannyPunchDetail.arriveIn/100 }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '获得倍率:' + MannyPunchDetail.multipleResult/100 }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '获得Jackpot类型:' + MannyPunchDetail.jpType }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '获得Jackpot数量:' + MannyPunchDetail.jpNum }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '本局Jackpot贡献:' + MannyPunchDetail.jpContribute }}</span>
      </div>
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:rgb(0, 0, 0); ">
        <span style="float:left;">{{ '总Jackpot贡献:' + MannyPunchDetail.jpTotalContribute }}</span>
      </div>
    </el-dialog>

    <el-dialog title="TeenPatti详情" :visible.sync="ZJHDetailVisible" width="1600px">
      <div style=" font-size:14px; line-height: 36px; height: 50px; color:red; ">
        <span style="float:left;">{{ '底分:' + ZJHDetail.antes/1000 }}</span>
      </div>
      <el-table ref="filterTable" :data="ZJHDetail.players" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>

        <el-table-column prop="seat" label="seat" width="60px">
          <template slot-scope="scope">{{ scope.row.seat }}</template>
        </el-table-column>

        <el-table-column prop="cards" label="牌" width="340px">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.cards" class="block">
              <el-image style="width: 37px; height: 50px" :src="getCardUrl(item)" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="cardstype" label="牌型">
          <template slot-scope="scope"> {{ getZJHCardsType(scope.row.cardType) }} </template>
        </el-table-column>

        <el-table-column prop="bet" label="bet">
          <template slot-scope="scope"> {{ scope.row.moneyBet }} </template>
        </el-table-column>

        <el-table-column prop="Fold" label="action">
          <template slot-scope="scope">{{ scope.row.isFold ? '弃牌' : '' }}</template>
        </el-table-column>

        <el-table-column prop="win" label="win">
          <template slot-scope="scope"> {{ scope.row.moneyChange }} </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog title="SaBong(斗鸡)牌局详情" :visible.sync="miniSaBongGameVisible" width="50%">
      <div style=" font-size:14px; line-height: 18px; height: 60px;">
        <span style="float:left;">发牌：</span>
        <!--
        <div style="color:red;">{{ miniSaBongGameResult }}</div>
        -->
        <div style="color:red;" v-for="card in miniSaBongGameResult" class="block">
          <el-image style="width: 37px; height: 50px" :src="getCardUrl(card)" />
        </div>

      </div>
      <el-table ref="filterTable" :data="miniSaBongGameOptions" border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%">

        <el-table-column prop="Name" label="下注项" width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.Name" />
          </template>
        </el-table-column>

        <el-table-column prop="Hit" label="赔率" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.IsHit" style="color:red">{{ scope.row.Odds / 1000 }}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>

        <el-table-column prop="Result" label="下注结果" width="800" >
          <template slot-scope="scope">
            <el-table ref="filterTable" :data="scope.row.players" border :show-header="true"
              :row-class-name="tableRowClassName"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%">

              <el-table-column prop="Uid" label="Uid" width="150"/>
              <el-table-column prop="Bet" label="下注" width="150">
                <template slot-scope="scope">
                  {{ scope.row.Bet / 1000 }}
                </template>
              </el-table-column>
              <el-table-column prop="Won" label="输赢" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.Won!==0" style="color:red">{{ scope.row.Won / 1000 }}</span>
                  <span v-else>{{ scope.row.Won / 1000 }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <texas-n-l-h-detail-log v-if="gameLogComponent.gid === 32" :game-log="gameLogComponent" @closeDialog="closeDialog" />
    <qiu-qiu-game-log v-if="gameLogComponent.gid === 111" :game-log="gameLogComponent" @closeDialog="closeDialog" />

    <wingo-lottery-detail-log
      v-if="gameLogComponent.gid === 112"
      :game-log="gameLogComponent.detail"
      :game-log-visible="gameLogComponent.visible"
      :gid="112"
      @closeDialog="closeDialog"
    />

    <multi-player-niu-niu-detail-log
      v-if="gameLogComponent.gid === 115"
      :game-log="gameLogComponent.detail"
      :game-log-visible="gameLogComponent.visible"
      :gid="115"
      :uid="clickRowUid"
      @closeDialog="closeDialog"
    />
    <mini-super-color-detail-log
      v-if="gameLogComponent.gid === 135"
      :game-log="gameLogComponent.detail"
      :game-log-visible="gameLogComponent.visible"
      :gid="135"
      :uid="clickRowUid"
      @closeDialog="closeDialog"
    />

    <el-dialog
      v-if="gameLogComponent.gid === 47||gameLogComponent.gid === 48"
      title="台球详情"
      :visible.sync="gameLogComponent.visible"
      width="1200px"
    >
      <el-descriptions class="margin-top" title="" :column="5" border>
        <el-descriptions-item>
          <template slot="label">前注：</template>
          {{ gameLogComponent.detail.antes / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">台费：</template>
          {{ gameLogComponent.detail.tableFee / 1000 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">等级 ：</template>
          {{ gameLogComponent.detail.level }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">球数 ：</template>
          {{ gameLogComponent.detail.gameplay }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">结束时间 ：</template>
          {{ formatTime(gameLogComponent.detail.finishTime) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="gameLogComponent.detail.players" border title="中奖记录" :row-style="changColor">
        <el-table-column prop="typ" label="Uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="输赢">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyChange / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="台费">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyTaxed / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="总金额">
          <template slot-scope="scope">{{ formatNumber(scope.row.moneyTotal / 1000) }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="玩家得分">
          <template slot-scope="scope">{{ scope.row.scoreboard }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="玩家得分">
          <template slot-scope="scope">{{ scope.row.scoreboard }}</template>
        </el-table-column>

        <el-table-column prop="typ" label="有效进球">
          <template slot-scope="scope">{{ scope.row.goalCount }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="一杠清台赢局数">
          <template slot-scope="scope">{{ scope.row.oneShotClearingTimes }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="玩牌局数">
          <template slot-scope="scope">{{ scope.row.playTimes }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="总赢局数">
          <template slot-scope="scope">{{ scope.row.winTimes }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="杆数">
          <template slot-scope="scope">{{ scope.row.strokesTimes }}</template>
        </el-table-column>
        <el-table-column prop="typ" label="连赢数">
          <template slot-scope="scope">{{ scope.row.winningStreakTimes }}</template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog
      title="雷区详情"
      :visible.sync="minesBattleVisible"
      width="650px"
    >
      <div id="sweeperShowTable">
        <table>
          <tr>
            <td>操作用户</td>
            <td>操作类型</td>
            <td>扣除金币数</td>
            <td>操作结果</td>
          </tr>
          <tr v-for="(play,key) in minesBattlePlayDetails" :key="key" :label="play" :value="key">
            <td>{{ play.uid }}</td>
            <td>{{ play.action }}</td>
            <td>{{ play.money / 1000 }}</td>
            <td>{{ play.result }}</td>
          </tr>
        </table>
      </div>
      <ul id="sweeperShow">
        <li v-for="(o,key) in minesBattleDetails" :key="key" :label="o" :value="key">
          <template>
            <span v-if="o.result==1" :style="o.step!=0?'color:green':'color:gold'"> {{ o.name }}</span>
            <span v-else :style="o.step!=0?'color:red':''">{{ o.name }}</span>
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

    <GinRummy v-if="gameLogComponent.gid === 116" :game-log="gameLogComponent" @closeDialog="closeDialog" />
    <uno-log v-if="gameLogComponent.gid === 117" :game-log="gameLogComponent" @closeDialog="closeDialog" />
    <pusoyWild-log v-if="gameLogComponent.gid === 126" :game-log="gameLogComponent" @closeDialog="closeDialog" />
    <pusoyGame-log v-if="gameLogComponent.gid === 21" :game-log="gameLogComponent" @closeDialog="closeDialog" />
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
import PusoyDosTable from '@/views/config/tableConfig/pusoyDos/pusoyDosTable.vue'
import PusoyDosDetailLog from '@/views/playerManage/components/PusoyDosDeatilLog.vue'
import TongitsGameLog from '@/views/playerManage/components/TongitsGameLog.vue'
import TexasNLHDetailLog from '@/views/playerManage/components/TexasNLHGameLog.vue'
import QiuQiuGameLog from '@/views/playerManage/components/QiuQiuGameLog.vue'
import WingoLotteryDetailLog from '@/views/playerManage/components/WingoLotteryGameLog.vue'
import MultiPlayerNiuNiuDetailLog from '@/views/playerManage/components/MultiPlayerNiuNiu.vue'
import GinRummy from '@/views/playerManage/components/GinRummy.vue'
import UnoLog from '@/views/playerManage/components/UnoLog.vue'
import PusoyWildLog from '@/views/playerManage/components/PusoyWildLog.vue'
import PusoyGameLog from '@/views/playerManage/components/PusoyGameLog.vue'
import MiniSuperColorDetailLog from '@/views/playerManage/components/MiniSuperColorLog.vue';

const filterMap = {
  IsPractice: {
    1: '是',
    0: '否',
    6: '钓鱼付费',
    7: '钓鱼未付',
    8: '钓鱼2付费',
    9: '钓鱼2未付费',
    10: '钓鱼3付费',
    11: '钓鱼3未付费'
  },
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
  components: {
    MiniSuperColorDetailLog,
    UnoLog,
    GinRummy,
    MultiPlayerNiuNiuDetailLog,
    WingoLotteryDetailLog,
    QiuQiuGameLog,
    TexasNLHDetailLog,
    TongitsGameLog,
    PusoyDosDetailLog,
    PusoyDosTable,
    DateTimeShow,
    Compare,
    Publish,
    UidInput,
    LineChart,
    PusoyWildLog,
    PusoyGameLog
  },
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
        loseCount: 0,
        fee: 0
      },
      clickRowUid: 0,

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
      sweeperRowUid: 0,
      sweeperSTD: [8.00, 8.33, 8.70, 9.09, 9.52, 10.00, 10.53, 11.11, 11.76, 12.50, 13.33, 14.29, 15.38, 16.67, 18.18, 20.00, 22.22, 25.00, 28.57, 33.33, 40.00, 50.00, 66.67, 100],
      sweeperPlay: [],
      sweeperRateVisible: false,

      minesBattleVisible: false,
      minesBattleDetails: [],
      minesBattlePlayDetails: [],
      towerVisible: false,
      towerData: '',

      hiloVisible: false,
      hiloOpRecord: '',
      hiloJackpotContribute: 0,
      hiloJackpotContributeTotal: 0,
      hiloJackpotAward: 0,
      hiloTotalOdds: 0,
      hiloCardList: [],
      hiloStopFlag: 0,
      hiloNotation: '',

      sicboGameVisible: false,

      sicboGameResult: '',
      sicboGameOptions: [],

      miniDvtGameVisible: false,
      miniDvtGameResult: '',
      miniDvtGameOptions: [],

      miniAbGameVisible: false,
      miniAbGameResult: '',
      miniAbGameOptions: [],

      sevenGameVisible: false,

      sevenGameResult: '',
      sevenGameOptions: [],

      rocketGameVisible: false,
      rocketGameResult: '',
      rocketGameOptions: [],

      WindropGameVisible: false,
      WindropGameResult: {
        BallNum: 0,
        BetAllScore: 0,
        BetScore: 0,
        CurEnergy: 0,
        EnergyNum: 0,
        SpinCount: 0,
        JackpotContributeTotal: 0,
        JackpotContribute: 0
      },
      WindropGameOptions: [],

      WindropcGameVisible: false,
      WindropcGameResult: {
        BallNum: 0,
        BetAllScore: 0,
        BetScore: 0,
        CurEnergy: 0,
        EnergyNum: 0,
        SpinCount: 0,
        JackpotContributeTotal: 0,
        JackpotContribute: 0
      },
      WindropcGameOptions: [],

      lucky9Detail: {},
      lucky9DetailVisible: false,

      blackjackDetail: {},
      blackjackDetailVisible: false,

      blackjackmhDetail: {"dealerLog":{"cards":[],"totalWin":0,"points":0,"cardType":0},"playerLog":{"cardGroupLog":[{"id":0,"cards":[],"splitCards":[],"bet":0,"luckyBet":0,"luckyWin":0,"insurance":0,"insurancePay":0,"totalWin":0,"normalBetWin":0,"cardType":0,"splitCardType":0}],"uid":0,"totalBet":0,"moneyChange":0,"moneyTaxed":0,"moneyCurrent":0,"moneyBefore":0,"walletType":0,"moneyTrueWin":0},"minBet":0,"tid":0,"logId":0},
      blackjackmhDetailVisible: false,

      dominoDetail: {},
      dominoDetailVisible: false,

      bodingDetail: {},
      bodingDetailVisible: false,

      carracingDetail: {},
      carracingData: {},
      carracingDetailVisible: false,

      FilipinoMahjongDetail: {},
      FilipinoMahjongDetailVisible: false,

      RemiDetail: {},
      RemiDetailVisible: false,

      TrucoDetail: {},
      TrucoDetailVisible: false,

      BuracoDetail: {},
      BuracoDetailVisible: false,

      jackpotWheelDetail: {},
      jackpotWheelData: {},
      jackpotWheelDetailVisible: false,

      freeSpinDetail: {},
      freeSpinData: {},
      freeSpinDetailVisible: false,

      ZJHDetail: {},
      ZJHDetailVisible: false,

      miniSaBongGameVisible: false,
      miniSaBongGameResult: [],
      miniSaBongGameOptions: [],

      LimboDetail:{},
      LimboDetailVisible:false,

      PirateScratchDetail:{},
      PirateScratchVisible:false,


      ChickenGoDetail:{},
      ChickenGoDetailVisible:false,

      MannyPunchDetail:{},
      MannyPunchDetailVisible:false,

      pusoyDetail: {},
      pusoyDetailVisible: false,
      pusoyCardTypes: {
        0: '爆牌',
        1: '普通牌型',
        101: '三同花',
        102: '三顺子',
        103: '六对半',
        106: '清一色',
        112: '一条龙',
        113: '清龙'
      },
      pusoyGroupCardTypes: {},
      pusoyShootOneShow: false,

      pusoyDos: {
        pusoyDosDetail: {},
        pusoyDosDetailVisible: false,
        pusoyDosShootOneShow: false
      },
      solitaireLog: {
        solitaireVisible: false,
        solitaireDetail: {}
      },
      solitaireLogStopMap: {
        1: '有玩家完成',
        2: '时间用完',
        3: '认输',
        4: '求和'
      },
      piggyLog: {
        visible: false,
        detail: {}
      },
      goldmasterLog: {
        visible: false,
        detail: {}
      },
      pusoySwapDetail: {},
      pusoySwapDetailVisible: false,
      pusoySwapShootOneShow: false,

      gameLogComponent: {
        visible: false,
        detail: {},
        gid: 0
      },
      piggyTypeOptions: {
        0: 'None',
        1: '金币',
        2: '幸运转盘',
        3: '转轴',
        4: 'F次数',
        5: 'N倍数',
        10: 'JP触发',
        11: 'JP发奖',
        20: '购买free game'
      },
      GoldMasterTypeOptions: {
        0: 'None',
        1: '金币',
        2: '幸运转盘',
        3: '转轴',
        4: 'F次数',
        5: 'N倍数',
        10: 'JP',
        20: '购买free game'
      },
      piggyJackpotLevle: {
        0: 'None',
        1: 'Grand',
        2: 'Major',
        3: 'Minor'
      },
      GoldMasterJackpotLevel: {
        0: 'None',
        1: 'Grand',
        2: 'Major',
        3: 'Minor'
      },
      videoPokerCardTypes: {
        1: {
          0: '皇家同花顺',
          1: '同花顺',
          2: '四条',
          3: '葫芦',
          4: '同花',
          5: '顺子',
          6: '三条',
          7: '两对',
          8: '杰克更好'
        },
        2: {
          0: '天然皇家同花顺',
          1: '4张2',
          2: '癞子皇家同花顺',
          3: '5条',
          4: '同花顺',
          5: '四条',
          6: '葫芦',
          7: '同花',
          8: '顺子',
          9: '三条'
        }
      },
      ConversionColorMap: {},

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
      niuniuTypeMap: {
        100: '高牌',
        101: '牛1',
        102: '牛2',
        103: '牛3',
        104: '牛4',
        105: '牛5',
        106: '牛6',
        107: '牛7',
        108: '牛8',
        109: '牛9',
        110: '牛牛',
        111: '四花',
        112: '五花',
        113: '四条',
        114: '五小'
      },
      chartData: newChartData(),
      dataArr: [],
      jackpotType: {
        1: 'GRAND',
        2: 'MAJOR',
        3: 'MINOR',
        4: 'MINI'
      },
      libMoney: new MoneyShow(['MoneyChanged', 'PayoffAmount', 'MoneyNow', 'ServiceFee', 'TableMoney', 'TotalValidBet', 'PotChange']),
      LogComponentGameIds: [107, 108, 32, 111, 110, 49, 47, 48, 112, 115, 116, 117, 126,21,135],
      uidMap: {},
      isRobotMap: {}
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
    parseKnockExt(jsonStr) {
      try {
        return JSON.parse(jsonStr || '{}');
      } catch (e) {
        return {};
      }
    },
    pusoyShowGroupExtra(row) {
      if (row.groupBottom.extraScore > 0 || row.groupMiddle.extraScore > 0 || row.groupTop.extraScore > 0) {
        return '(牌型加分)'
      }
      return ''
    },
    pusoyShowShootAll(row) {
      if (row.uid === this.pusoyDetail.shootAllUid) {
        return '(全垒打)'
      }
      return ''
    },
    pusoyShowCardTypeName(type) {
      if (type > 1) {
        return '特殊牌型'
      } else {
        return this.pusoyCardTypes[type] || '-'
      }
    },
    pusoyShowChangeCardString(change) {
      if (change) {
        return '是'
      } else {
        return '否'
      }
    },
    pusoySpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        console.log('row: ', row)
        console.log('columnIndex: ', columnIndex)
      }
      let _row = 0
      let _col = 0
      // 前三列
      if (columnIndex === 2 && row.cardType > 1) {
        _row = 1 // 偶数行 两行
        _col = 3
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if ((columnIndex === 3 || columnIndex === 4) && row.cardType > 1) {
        _row = 1 // 偶数行 两行
        _col = 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
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
    showBetType(valA) {
        if (valA === 1 || valA === 0) {
          return '常规'
        } else if (valA === 2){
          return 'FreeSpin(厅方)'
        } else if (valA === 3){
          return 'FreeSpin(平台)'
        } else {
          return '未知'
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
      this.uidMap = {}
      this.tableData = this.clientDB.GetCurrentPageData()
      for (const o in this.tableData) {
        this.uidMap[this.tableData[o].Uid] = 0
      }

      this.uids = []
      for (var key in this.uidMap) {
        this.uids.push(key)
      }
      if (this.envProjectName != 'ph_audit') {
        request({
          url: '/dataProxy/is/robot',
          method: 'get',
          data: {
            Env: this.env,
            Uids: JSON.stringify(this.uids)
          }
        }).then(response => {
          if (response.RetCode === 0) {
            for (const key in response.Data) {
              this.isRobotMap[key] = response.Data[key]
            }
            console.log(this.tableData)
            for (const o of this.tableData) {
              if (this.isRobotMap[o.Uid] && o.IsRobot==0) {
                o.IsRobot = -1
              }
            }
          }
        })
      }
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
    formatHMSTime(ts) {
      return $libDate.FormateSecondStr(ts, 4)
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
      this.uidMap = {}
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
          $this.item.win = $this.item.lose = $this.item.winCount = $this.item.loseCount = $this.item.fee = 0
          let cnt = 0
          $this.item.pot = 0
          for (const o in objs) {
            const item = objs[o]
            cnt += item.MoneyChanged
            $this.item.pot += item.PotChange
            if (item.PayoffAmount > 0) {
              $this.item.win += item.PayoffAmount
              $this.item.winCount++
            } else {
              $this.item.lose += item.PayoffAmount
              $this.item.loseCount++
            }

            $this.item.fee += item.ServiceFee
            if (item.Gid === 14 && item.WinRate > 0) {
              // 真人场，需要特殊处理胜率展示
              const tmpWinRate = item.WinRate / 100
              objs[o].WinRate = tmpWinRate.toString() + '%'
            }
            if (item.Gid === 10) {
              objs[o].RandVal = (item.RandVal / 100).toFixed(2)
              objs[o].WinRate = (item.WinRate / 100).toFixed(2)
            } else if (item.Gid == 20 || item.Gid==132) {
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
        this.setRowUid(row.Uid)
        this.getDetail(row.LogID, row.Uid, row.FinishTime)
      }
    },
    setRowUid(uid) {
      this.sweeperRowUid = uid
      this.clickRowUid = uid
    },
    getDetail(id, uid, dt) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/log/detail',
          ID: id,
          DateTime: dt,
          Uid: uid,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          this.initData()
          const gid = this.$route.meta.gid
          console.log(obj)
          if (/* gid == 9 ||*/ gid == 8 || gid == 14) {
            $this.showTPGame(obj)
          } else if (gid == 10) {
            $this.showRocketGame(obj)
          } else if (gid == 15) {
            $this.showTexasGame(obj)
          } else if (gid == 16) {
            $this.showBaccaratGame(obj)
          } else if (gid == 20 || gid==132) {
            $this.showSweeperGame(obj)
          } else if (gid == 1) {
            $this.showRummyGame(obj)
          } else if (gid == 25 || gid == 129) {
            $this.showColorGame(obj)
          } else if (gid == 23) {
            $this.showLucky9Game(obj)
          } else if (gid == 30) {
            $this.showBodingGame(obj)
          } else if (gid === 34) {
            $this.showPusoyDosGame(obj)
          } else if (gid == 37) {
            $this.showBlackjackGame(obj)
          // } else if (gid === 21) {
          //   $this.showPusoyGame(obj)
          } else if (gid == 137) {
            $this.showBlackjackmhGame(obj)
          } else if (gid === 100) {
            $this.showTowerGame(obj)
          } else if (gid === 101) {
            $this.showSicboGame(obj)
          } else if (gid === 104) {
            $this.showMiniDvtGame(obj)
          } else if (gid === 105) {
            $this.showMiniAbGame(obj)
          } else if (gid === 102) {
            $this.showHiloGame(obj)
          } else if (gid === 140) {
            $this.showHiloPlusGame(obj)
          } else if (gid === 103) {
            $this.showWindropGame(obj)
          } else if (gid === 119) {
            $this.showWindropcGame(obj)
          } else if (gid === 6) {
            $this.showSevenGame(obj)
          } else if (gid === 35) {
            $this.showSolitaire(obj)
          } else if (gid === 106) {
            $this.showPiggy(obj)
          } else if (gid === 500) {
            $this.showGoldMaster(obj, uid)
          } else if ($this.LogComponentGameIds.indexOf(gid) !== -1) {
            $this.showGameLogComponent(obj, gid)
          } else if (gid === 46) {
            $this.showDominoGame(obj)
          } else if (gid === 113) {
            $this.showPusoySwapGame(obj)
          } else if (gid === 118) {
            $this.showCarracingGame(obj)
          } else if (gid === 122) {
            const gamelog = response.Data.Log || {}
            $this.showFilipinoMahjongGame(obj.Data, gamelog)
          } else if (gid === 123) {
            $this.showMinesGame(obj)
          } else if (gid === 124) {
            $this.showJackpotWheelGame(obj)
          } else if (gid === 125) {
            $this.showFreeSpinGame(obj)
          } else if (gid === 9) {
            $this.showZJHGame(obj)
          } else if (gid === 127) {
            $this.showMiniSaBongGame(obj)
          } else if (gid === 130 || gid === 131) {
            $this.showRemiGame(obj)
          } else if (gid === 11) {
            $this.showTrucoGame(obj)
          } else if (gid === 12 || gid === 133){
            $this.showBuracoGame(obj)
          } else if (gid === 136){
            $this.showLimboGame(obj)
          } else if (gid === 138){
            $this.showChickenGoGame(obj)
          } else if (gid === 139){
            $this.showMannyPunchGame(obj)
          } else if (gid === 141){
            $this.showPirateScratchGame(obj)
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
    solitaireCard(num) {
      if (num >= 256) {
        const s = num.toString(16)
        return parseInt('0x' + s[1] + s[2])
      }
      return num
    },
    cardConversionColor(num, meihua, heitao, hongtao, fangkuai) {
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      if (num == 0 || num === 'NaN' || num === 'undefined' || num === undefined) {
        return 2
      }
      if (Object.keys(this.ConversionColorMap).length === 0) {
        var m = meihua.split('-')
        var hei = heitao.split('-')
        var hong = hongtao.split('-')
        var f = fangkuai.split('-')
        this.ConversionColorMap[m[0]] = m[1]
        this.ConversionColorMap[hei[0]] = hei[1]
        this.ConversionColorMap[hong[0]] = hong[1]
        this.ConversionColorMap[f[0]] = f[1]
      }
      var s = num.toString(16)
      // 补0
      if (s.length === 1) {
        s = '0' + s[0]
      }
      const result = '0x' + this.ConversionColorMap[s[0]] + s[1]

      return parseInt(result)
    },
    showGameLogComponent(obj, gid, uid) {
      this.gameLogComponent.detail = obj
      this.gameLogComponent.visible = true
      this.gameLogComponent.gid = gid
      this.gameLogComponent.uid = uid
      if (gid == 108) {
        this.showDropBall(obj)
      }
      console.log('obj=>', this.gameLogComponent)
    },
    showDropBall(obj) {
      const m = {}
      obj.Dropball.options.forEach(item => {
        m[item.id] = []
      })
      for (const player of obj.Dropball.players) {
        for (const o of player.optionsResult) {
          o['uid'] = player.uid
          o['playerData'] = JSON.parse(JSON.stringify(player))
          console.log('o=>', o)
          m[o.id].push(o)
        }
      }
      obj.Dropball.options.forEach(item => {
        item['players'] = m[item.id]
      })
    },
    getDropballImg(id) {
      const imgMap = {
        0: 57,
        1: 74,
        2: 59,
        3: 76,
        4: 61,
        5: 65
      }
      return imgMap[id]
    },
    showCarracingGame(obj) {
      this.carracingDetail = obj
      this.carracingData = obj.Carracing
      console.log('this.carracingData => ', this.carracingData)
      this.carracingDetailVisible = true
    },
    getCarracingCarLogoName() {
      if (this.carracingData.cards != undefined && this.carracingData.cards.length > 0) {
        return this.getCarracingLogoName(this.carracingData.cards[this.carracingData.cards.length - 1])
      }
      return 0
    },
    getCarracingPlayerBet() {
      return formatNumber(carracingDetail.Bet / 1000)
    },
    getCarracingLogoName(id) {
      const nameMap = {
        0: '兰博基尼',
        1: '法拉利',
        2: '宝马',
        3: '奔驰',
        4: '丰田',
        5: '三菱',
        6: '马自达',
        7: '本田',
        8: 'Gratis'
      }
      return nameMap[id]
    },
    showRemiGame(obj) {
      this.RemiDetail = obj
      //console.log('this.remiData => ', this.RemiDetail)
      this.RemiDetailVisible = true
    },
    showTrucoGame(obj){
      this.TrucoDetail = obj
      console.log('this.TrucoData => ', this.TrucoDetail)
      this.TrucoDetailVisible = true
    },
    showBuracoGame(obj){
      this.BuracoDetail = obj
      let userHandCards = new Map()
      let teamGroupMap = new Map()
      teamGroupMap.set(1, new Map())
      teamGroupMap.set(2, new Map())
      for (let i = 0; i < this.BuracoDetail.actionLogs.length; i ++) {
        this.BuracoDetail.actionLogs[i].idx = i+1 //步骤序号
        //扩组牌
        if (this.BuracoDetail.actionLogs[i].actionType == 3
            || this.BuracoDetail.actionLogs[i].actionType == 6
            || this.BuracoDetail.actionLogs[i].actionType == 12) {
              let teamId = this.BuracoDetail.actionLogs[i].teamId
            let tg = teamGroupMap.get(teamId)
            tg.set(this.BuracoDetail.actionLogs[i].groupIndex, this.BuracoDetail.actionLogs[i].opCards) //增加扩、组牌的牌
            this.BuracoDetail.actionLogs[i].groups = new Array() //队伍的扩组牌情况
            for (let [key, val] of tg){
              this.BuracoDetail.actionLogs[i].groups.push(val)
            }
        }

        /*
        //玩家手牌
        let uId = this.BuracoDetail.actionLogs[i].uid
        if (this.BuracoDetail.actionLogs[i].actionType == 0 || this.BuracoDetail.actionLogs[i].actionType == 4) {  //发牌/弃牌堆给玩家
          userHandCards.set(uId, this.BuracoDetail.actionLogs[i].opCards)
        } else if (this.BuracoDetail.actionLogs[i].actionType == 2){    //摸牌堆
          let handCards = userHandCards.get(uId)
          for (let c of this.BuracoDetail.actionLogs[i].opCards){
            handCards.push(c)
          }
        } else if (this.BuracoDetail.actionLogs[i].actionType == 3 //摸组弃牌
          || this.BuracoDetail.actionLogs[i].actionType == 5  //弃牌
          || this.BuracoDetail.actionLogs[i].actionType == 6 //扩组牌
          || this.BuracoDetail.actionLogs[i].actionType == 12 //新组合
        ){
          let handCards = userHandCards.get(uId)
          for (let opcard of this.BuracoDetail.actionLogs[i].opCards) {
            for (let n = 0; n < handCards.length; n ++){
              if (opcard == handCards[n]) {
                handCards.splice(n, 1)
                break
              }
            }
          }
          if (this.BuracoDetail.actionLogs[i].actionType == 5) {//弃牌后刷新显示
            this.BuracoDetail.actionLogs[i].handcards = new Array()
            for (let c of handCards){
              this.BuracoDetail.actionLogs[i].handcards.push(c)
            }
          }
        }
      */
      }
      console.log('this.BuracoData => ', this.BuracoDetail)
      this.BuracoDetailVisible = true
    },
    showLimboGame(obj){
      this.LimboDetail.players = []
      this.LimboDetail.players.push(obj.player)
      this.LimboDetailVisible = true
    },

    showPirateScratchGame(obj) {
       console.log(obj)
      this.PirateScratchDetail.players = []
      this.PirateScratchDetail.players.push(obj.player)
      this.PirateScratchDetail.blockItems = obj.player.luckyResult.blockItems
       this.PirateScratchDetail.openNumber = []
      for(let i = 0; i < obj.player.luckyResult.openNumber.length; i++) {
        let number = obj.player.luckyResult.openNumber[i]
        let isLucky = false
        for (let j = 0; j < obj.player.luckyResult.blockItems.length; j++) {
          if (obj.player.luckyResult.blockItems[j].number == number) {
            isLucky = true;
            break
          }
        }
        this.PirateScratchDetail.openNumber.push({number: number, isLucky: isLucky})
      }
      this.PirateScratchVisible = true
    },
    showChickenGoGame(obj){
      this.ChickenGoDetail = obj.player
      this.ChickenGoDetailVisible = true
    },
    getChickenGoLevel(lv){
      const lvMap = {
        0: 'Easy',
        1: 'Medium',
        2: 'Hard',
        3: 'Expert',
        4: 'Master',
        5: 'Nightmare'
      }
      return lvMap[lv]
    },
    showMannyPunchGame(obj){
      this.MannyPunchDetail = obj.player
      this.MannyPunchDetailVisible = true
    },
    getMannyPunchLevel(lv){
      const lvMap = {
        0: 'Easy',
        1: 'Medium',
        2: 'Hard',
        3: 'Expert',
        4: 'Master',
        5: 'Nightmare'
      }
      return lvMap[lv]
    },
    showFilipinoMahjongGame(obj, log) {
      this.FilipinoMahjongDetail = log// obj
      // this.FilipinoMahjongDetail.GameLog = log
      // console.log('this.FilipinoMahjongDetail => ', this.FilipinoMahjongDetail)
      // 玩家按座位号排序
      if (this.FilipinoMahjongDetail.playerList != undefined && this.FilipinoMahjongDetail.playerList.length > 0) {
        this.FilipinoMahjongDetail.playerList = this.FilipinoMahjongDetail.playerList.sort((a, b) => { return a.seat - b.seat })
      }
      this.FilipinoMahjongDetailVisible = true
    },
    getFilipinoMahjongRidgeInfo(type) {
      const typeMap = {
        0: 'null',
        1: 'pass',
        2: '吃',
        3: '碰',
        4: '杠',
        5: '加杠',
        6: '暗杠',
        7: '',
        8: '胡',
        9: '自摸',
        10: '杠开'
      }
      return typeMap[type]
    },
    getMahjongCardUrl(card) {
      // console.log('/filipinomahjong/' + card + '.png')
      return require('@/assets/filipinomahjong/' + card + '.png')
    },
    isMahjongFangChongUser(uid) {
      for (const u of this.FilipinoMahjongDetail.playerList) {
        if (u.iHu == 2 && u.ifcUid == uid) {
          return true
        }
      }
      return false
    },
    getMahjongDiceUrl(dice) {
      return require('@/assets/domino/' + dice + '.png')
    },
    showJackpotWheelGame(obj) {
      this.jackpotWheelDetail = obj
      this.jackpotWheelData = obj.JackpotWheel
      console.log('this.jackpotWheelData => ', this.jackpotWheelData)
      this.jackpotWheelDetailVisible = true
    },
    getJackpotWheelCarLogoName() {
      if (this.jackpotWheelData.cards != undefined && this.jackpotWheelData.cards.length > 0) {
        return this.getJackpotWheelLogoName(this.jackpotWheelData.cards[this.jackpotWheelData.cards.length - 1])
      }
      return 0
    },
    getJackpotWheelPlayerBet() {
      return formatNumber(jackpotWheelDetail.Bet / 1000)
    },
    getJackpotWheelLogoName(id) {
      const nameMap = {
        0: 'try again',
        1: '0.2',
        2: '0.4',
        3: '1',
        4: '2',
        5: '5',
        6: '10',
        7: '15',
        8: '20',
        9: 'Minor',
        10: 'Major',
        11: 'Grand'
      }
      return nameMap[id]
    },

    showFreeSpinGame(obj) {
      this.freeSpinDetail = obj
      this.freeSpinData = obj.FreeSpin
      console.log('this.freeSpinData => ', this.freeSpinData)
      this.freeSpinDetailVisible = true
    },
    getFreeSpinCarLogoName() {
      if (this.freeSpinData.cards != undefined && this.freeSpinData.cards.length > 0) {
        return this.getFreeSpinLogoName(this.freeSpinData.cards[this.freeSpinData.cards.length - 1])
      }
      return 0
    },
    getFreeSpinPlayerBet() {
      return formatNumber(freeSpinDetail.Bet / 1000)
    },
    getFreeSpinLogoName(id) {
      const nameMap = {
        0: '0.2',
        1: '0.4',
        2: '0.6',
        3: '0.8',
        4: '1.2',
        5: '2',
        6: '4',
        7: '8',
        8: '10',
        9: '15',
        10: '20',
        11: '40',
        12: '80',
        13: '200',
        14: 'FreeSpin*5',
        15: 'FreeSpin*10'
      }
      return nameMap[id]
    },

    showMiniSaBongGame(obj) {
      const names = ['Meron', 'Wala', 'Perfect Pair', 'Pair', 'Meron♠', 'Meron♥', 'Meron♣', 'Meron♦', 'Wala♠', 'Wala♥', 'Wala♣', 'Wala♦']
      const tMap = {}
      this.miniSaBongGameOptions = []
      const miniSaBongObj = obj.Sabong
      for (let i = 0; i < miniSaBongObj.options.length; i++) {
        const ob = miniSaBongObj.options[i]
        ob.totalOdds = ob.Odds// * ob.extraPay
        console.log(ob)
        tMap[ob.id] = {
          ID: ob.id,
          Name: names[i],
          Odds: ob.Odds,
          IsHit: ob.isHit,
          //EOdds: ob.extraPay,
          totalOdds: ob.totalOdds,
          players: []
        }
        console.log(tMap[ob.id])
      }

      for (let i = 0; i < miniSaBongObj.players.length; i++) {
        const player = miniSaBongObj.players[i]
        if (player.areaRet === null) {
          continue
        }
        for (let j = 0; j < player.areaRet.length; j++) {
          const result = player.areaRet[j]
          tMap[result.id].players.push({
            Uid: player.uid,
            Bet: result.optionBet,
            Won: result.moneyWon
          })
        }
      }

      for (let i = 0; i < miniSaBongObj.options.length; i++) {
        this.miniSaBongGameOptions.push(tMap[i])
      }
      /*
      const resultTmp = []
      for (let i = 0; i < miniSaBongObj.cards.length; i++) {
        resultTmp.push(miniSaBongObj.cards[i].toString(16))
      }
      this.miniSaBongGameResult = resultTmp.join('，')
      */
      this.miniSaBongGameResult = []
      for (let i = 0; i < miniSaBongObj.cards.length; i++) {
        this.miniSaBongGameResult.push(miniSaBongObj.cards[i])
      }
      this.miniSaBongGameVisible = true
    },

    showZJHGame(obj) {
      this.ZJHDetail = obj
      // 玩家按座位号排序
      if (this.ZJHDetail.players != undefined && this.ZJHDetail.players.length > 0) {
        this.ZJHDetail.players = this.ZJHDetail.players.sort((a, b) => { return a.seat - b.seat })
      }
      this.ZJHDetailVisible = true
    },
    getZJHCardsType(type) {
      const ZJHCardTypes = {
        1: '高牌',
	      2: '对子',
	      3: '同花',
        4: '顺子',
        5: '同花顺',
        6: '三条'
      }
      return ZJHCardTypes[type]
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
    showSolitaire(obj) {
      this.solitaireLog.solitaireDetail = obj
      this.solitaireLog.solitaireVisible = true
    },
    showPiggy(obj) {
      this.piggyLog.detail = obj
      this.piggyLog.visible = true
    },
    showGoldMaster(obj, uid) {
      for (const player of obj.players) {
        if (player.uid == uid) {
          this.goldmasterLog.detail = player
        }
      }
      this.goldmasterLog.visible = true
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

    showHiloGame(obj) {
      this.hiloVisible = true
      this.hiloCardList = obj.Hilo.CardList
      console.log(this.hiloCardList)
      const hiloOp = []
      this.hiloStopFlag = obj.Hilo.StopFlag
      this.hiloOpRecord = hiloOp.join(' ')
      this.hiloJackpotContribute = obj.Hilo.JackpotContribute / 1000
      this.hiloJackpotContributeTotal = obj.Hilo.JackpotContributeTotal / 1000
      this.hiloJackpotAward = obj.Hilo.JackpotAward / 1000
      this.hiloTotalOdds = obj.Hilo.TotalOdds
    },
    showHiloPlusGame(obj) {
      this.hiloVisible = true
      this.hiloCardList = obj.HiloPlus.CardList
      console.log(this.hiloCardList)
      const hiloOp = []
      this.hiloStopFlag = obj.HiloPlus.StopFlag
      this.hiloOpRecord = hiloOp.join(' ')
      this.hiloJackpotContribute = obj.HiloPlus.JackpotContribute / 1000
      this.hiloJackpotContributeTotal = obj.HiloPlus.JackpotContributeTotal / 1000
      this.hiloJackpotAward = obj.HiloPlus.JackpotAward / 1000
      this.hiloTotalOdds = obj.HiloPlus.TotalOdds
    },
    selectHiloNotation(notation) {
      switch (notation) {
        case 1 :
          return '高'
        case 2 :
          return '低'
        case 3 :
          return '高等'
        case 4 :
          return '低等'
        case 5 :
          return '等'
        case 6 :
          return '跳过'
        case 7 :
          return '黑色'
        case 8 :
          return '红色'
        default:
          return '-'
      }
    },
    showWindropGame(obj) {
      const tMap = {}
      this.WindropGameOptions = []
      const windropObj = obj.Windrop
      if (Array.isArray(windropObj.optionData.bouns) && windropObj.optionData.bouns.length > 0) {
        for (let i = 0; i < windropObj.optionData.bouns.length; i++) {
          const tracksPos = []
          if (windropObj.optionData.bouns[i].TracksPos) {
            for (const pos of windropObj.optionData.bouns[i].TracksPos) {
              tracksPos.push({
                posX: pos.posX,
                posY: pos.posY
              })
            }
          }
          const bouns = windropObj.optionData.bouns[i]
          tMap[i] = {
            ID: i,
            ODDS: bouns.odds,
            BallTimes: bouns.ballTimes,
            SpinOdd: bouns.spinOdd,
            SpinScore: bouns.spinScore,
            Score: bouns.score,
            TracksPos: tracksPos
          }
        }
        for (let i = 0; i < windropObj.optionData.bouns.length; i++) {
          this.WindropGameOptions.push(tMap[i])
        }
      }
      console.log(this.windropGameOptions)
      this.WindropGameResult.BallNum = windropObj.optionData.ballNum
      this.WindropGameResult.BetAllScore = windropObj.optionData.betAllScore
      this.WindropGameResult.BetScore = windropObj.optionData.betScore
      this.WindropGameResult.CurEnergy = windropObj.optionData.curEnergy
      this.WindropGameResult.EnergyNum = windropObj.optionData.energyNum
      this.WindropGameResult.SpinCount = windropObj.optionData.spinCount
      this.WindropGameResult.JackpotContributeTotal = windropObj.JackpotContributeTotal
      this.WindropGameResult.JackpotContribute = windropObj.JackpotContribute
      this.WindropGameVisible = true
    },

    showWindropcGame(obj) {
      const tMap = {}
      this.WindropcGameOptions = []
      const windropcObj = obj.Windropc
      if (Array.isArray(windropcObj.optionData.bouns) && windropcObj.optionData.bouns.length > 0) {
        for (let i = 0; i < windropcObj.optionData.bouns.length; i++) {
          const tracksPos = []
          if (windropcObj.optionData.bouns[i].TracksPos) {
            for (const pos of windropcObj.optionData.bouns[i].TracksPos) {
              tracksPos.push({
                posX: pos.posX,
                posY: pos.posY
              })
            }
          }
          const bouns = windropcObj.optionData.bouns[i]
          tMap[i] = {
            ID: i,
            ODDS: bouns.odds,
            BallTimes: bouns.ballTimes,
            SpinOdd: bouns.spinOdd,
            SpinScore: bouns.spinScore,
            Score: bouns.score,
            JpLevel: bouns.jpLevel,
            JpType: bouns.jpType,
            Jackpot: bouns.jackpot,
            BallTime: bouns.ballTime,
            TracksPos: tracksPos
          }
        }
        for (let i = 0; i < windropcObj.optionData.bouns.length; i++) {
          this.WindropcGameOptions.push(tMap[i])
        }
      }
      console.log(this.windropcGameOptions)
      this.WindropcGameResult.BallNum = windropcObj.optionData.ballNum
      this.WindropcGameResult.BetAllScore = windropcObj.optionData.betAllScore
      this.WindropcGameResult.BetScore = windropcObj.optionData.betScore
      this.WindropcGameResult.CurEnergy = windropcObj.optionData.curEnergy
      this.WindropcGameResult.EnergyNum = windropcObj.optionData.energyNum
      this.WindropcGameResult.SpinCount = windropcObj.optionData.spinCount
      this.WindropcGameResult.JackpotContributeTotal = windropcObj.JackpotContributeTotal
      this.WindropcGameResult.JackpotContribute = windropcObj.JackpotContribute
      this.WindropcGameVisible = true
    },

    showRocketGame(obj) {
      const names = ['下注区域0', '下注区域1', '下注区域2', '下注区域3', '下注区域4', '下注区域5', 'Bet下注区域']
      const tMap = {}
      this.rocketGameOptions = []
      const rocketObj = obj
      if (rocketObj.optionsData) {
        for (let i = 0; i < rocketObj.optionsData.length; i++) {
          const ob = rocketObj.optionsData[i]
          tMap[ob.id] = { ID: ob.id, Name: names[i], Hit: ob.Result, Rate: ob.Rate / 100, Ret: [] }
        }
      }

      for (let i = 0; i < rocketObj.players.length; i++) {
        const player = rocketObj.players[i]
        if (player.UserBetOptions) {
          if (player.UserBetOptions.moneyTotalBet === 0) {
            continue
          }
        }
        for (let j = 0; j < player.UserBetOptions.Option.length; j++) {
          const result = player.UserBetOptions.Option[j]
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: result.moneyWon
          })
        }
      }
      if (rocketObj.optionsData) {
        for (let i = 0; i < rocketObj.optionsData.length; i++) {
          this.rocketGameOptions.push(tMap[i])
        }
      }
      const betRet = []
      for (const player of rocketObj.players) {
        betRet.push({
          Uid: player.uid,
          Bet: player.moneyBet - player.UserBetOptions.moneyTotalBet,
          Won: player.moneyChanged - player.UserBetOptions.moneyTotalWon,
          stopOdds: player.stopOdds
        })
      }
      this.rocketGameOptions.push({ ID: 6, Name: 'Bet下注区域', Rate: rocketObj.stopOdds / 100, Ret: betRet })
      this.rocketGameResult = rocketObj.stopOdds / 100
      console.log(this.rocketGameOptions)
      this.rocketGameVisible = true
    },
    getHitStyle({ row }) {
      if (row.isHit) {
        return { color: 'red' }
      }
      return {}
    },
    getHitDropBallStyle({ row, idx }) {
      if (row.Result) {
        return { color: 'red', width: '120px' }
      }
      return {}
    },
    getUserWonStyle({ row, idx }) {
      if (row.moneyWon > 0) {
        return { color: 'red', width: '120px', textAlign: 'center', fontSize: '12px', height: '20px' }
      }
      return { fontSize: '12px', height: '20px' }
    },
    showPigData(typ, bet) {
      return true
      // if (typ == 3) {
      //   return true
      // } else {
      //   if (bet == 0) {
      //     return true
      //   }
      // }
      // return false
    },
    showSicboGame(obj) {
      const names = ['SMALL_小点', 'BIG_大点', '骰子单点数_1', '骰子单点数_2', '骰子单点数_3', '骰子单点数_4', '骰子单点数_5', '骰子单点数_6', '骰子双点数_1', '骰子双点数_2',
        '骰子双点数_3', '骰子双点数_4', '骰子双点数_5', '骰子双点数_6', '点数和_4', '点数和_5', '点数和_6', '点数和_7', '点数和_8', '点数和_9', '点数和_10', '点数和_11', '点数和_12',
        '点数和_13', '点数和_14', '点数和_15', '点数和_16', '点数和_17', '骰子三点数_1', '骰子三点数_2', '骰子三点数_3', '骰子三点数_4', '骰子三点数_5', '骰子三点数_6', 'Any Triple']
      const tMap = {}
      this.sicboGameOptions = []
      const sicbObj = obj.Sicbo
      for (let i = 0; i < sicbObj.options.length; i++) {
        const ob = sicbObj.options[i]

        if (sicbObj.bonus) {
          for (let j = 0; j < sicbObj.bonus.length; j++) {
            if (i === sicbObj.bonus[j].Id) {
              ob.Rate = ob.Rate * sicbObj.bonus[j].Double
              console.log(ob.Rate)
            }
          }
        }
        tMap[ob.id] = { ID: ob.id, Name: names[i], Hit: ob.Result, Rate: ob.Rate, IsBonus: ob.IsBonus, Ret: [] }
      }

      for (let i = 0; i < sicbObj.players.length; i++) {
        const player = sicbObj.players[i]
        if (player.optionsResult === null) {
          continue
        }
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          let won = 0
          if (tMap[result.id].Hit) {
            won = tMap[result.id].Rate * result.moneyBet
          } else {
            won = -result.moneyBet
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: won
          })
        }
      }

      for (let i = 0; i < sicbObj.options.length; i++) {
        this.sicboGameOptions.push(tMap[i])
      }
      console.log(this.sicboGameOptions)
      const resultTmp = []
      for (let i = 0; i < sicbObj.dices.length; i++) {
        resultTmp.push(sicbObj.dices[i])
      }
      this.sicboGameResult = resultTmp.join('，')
      this.sicboGameVisible = true
    },
    showMiniDvtGame(obj) {
      const names = ['龙', '虎', '龙♠♣', '龙♥♦', 'TIE', '虎♠♣', '虎♥♦', '2,26', '3-6', '7-11', '12-16', '17-21', '22-25']
      const tMap = {}
      this.miniDvtGameOptions = []
      const miniDvtObj = obj.Dvt
      for (let i = 0; i < miniDvtObj.options.length; i++) {
        const ob = miniDvtObj.options[i]
        ob.totalOdds = ob.Odds * ob.extraPay
        console.log(ob)
        tMap[ob.id] = {
          ID: ob.id,
          Name: names[i],
          Odds: ob.Odds,
          IsHit: ob.isHit,
          EOdds: ob.extraPay,
          totalOdds: ob.totalOdds,
          players: []
        }
        console.log(tMap[ob.id])
      }

      for (let i = 0; i < miniDvtObj.players.length; i++) {
        const player = miniDvtObj.players[i]
        if (player.areaRet === null) {
          continue
        }
        for (let j = 0; j < player.areaRet.length; j++) {
          const result = player.areaRet[j]
          tMap[result.id].players.push({
            Uid: player.uid,
            Bet: result.optionBet,
            Won: result.moneyWon
          })
        }
      }

      for (let i = 0; i < miniDvtObj.options.length; i++) {
        this.miniDvtGameOptions.push(tMap[i])
      }
      console.log(this.miniDvtGameOptions)
      const resultTmp = []
      for (let i = 0; i < miniDvtObj.cards.length; i++) {
        resultTmp.push(miniDvtObj.cards[i].toString(16))
      }
      this.miniDvtGameResult = resultTmp.join('，')
      this.miniDvtGameVisible = true
    },
    showMiniAbGame(obj) {
      const names = ['A', 'B', '1-5', '6-10', '11-15', '16-24', '25-30', '31-35', '36-40', '41-49']
      const tMap = {}
      this.miniAbGameOptions = []
      const miniAbObj = obj.Ab
      for (let i = 0; i < miniAbObj.options.length; i++) {
        const ob = miniAbObj.options[i]
        console.log(ob)
        tMap[ob.id] = { ID: ob.id, Name: names[i], Odds: ob.Odds, IsHit: ob.isHit, players: [] }
        console.log(tMap[ob.id])
      }

      for (let i = 0; i < miniAbObj.players.length; i++) {
        const player = miniAbObj.players[i]
        if (player.areaRet === null) {
          continue
        }
        for (let j = 0; j < player.areaRet.length; j++) {
          const result = player.areaRet[j]
          tMap[result.id].players.push({
            Uid: player.uid,
            Bet: result.optionBet,
            Won: result.moneyWon
          })
        }
      }

      for (let i = 0; i < miniAbObj.options.length; i++) {
        this.miniAbGameOptions.push(tMap[i])
      }
      console.log(this.miniAbGameOptions)
      const resultTmp = []
      for (let i = 0; i < miniAbObj.cards.length; i++) {
        resultTmp.push(miniAbObj.cards[i].toString(16))
      }
      this.miniAbGameResult = resultTmp.join('，')
      this.miniAbGameVisible = true
    },
    showSevenGame(obj) {
      const names = ['SMALL_小点', 'BIG_大点', '点数和_2', '点数和_3', '点数和_4', '点数和_5', '点数和_6', '点数和_7', '点数和_8', '点数和_9', '点数和_10', '点数和_11', '点数和_12']
      const tMap = {}
      this.sevenGameOptions = []
      const sevenObj = obj.Seven
      for (let i = 0; i < sevenObj.options.length; i++) {
        const ob = sevenObj.options[i]
        tMap[ob.id] = { ID: ob.id, Name: names[i], Hit: ob.Result, Rate: ob.Rate, IsBonus: ob.IsBonus, Ret: [] }
      }

      for (let i = 0; i < sevenObj.players.length; i++) {
        const player = sevenObj.players[i]
        if (player.optionsResult === null) {
          continue
        }
        for (let j = 0; j < player.optionsResult.length; j++) {
          const result = player.optionsResult[j]
          let won = 0
          if (tMap[result.id].Hit) {
            won = tMap[result.id].Rate * result.moneyBet
          } else {
            won = -result.moneyBet
          }
          tMap[result.id].Ret.push({
            Uid: player.uid,
            Bet: result.moneyBet,
            Won: won
          })
        }
      }

      for (let i = 0; i < sevenObj.options.length; i++) {
        this.sevenGameOptions.push(tMap[i])
      }
      console.log(this.sevenGameOptions)
      const resultTmp = []
      for (let i = 0; i < sevenObj.dices.length; i++) {
        resultTmp.push(sevenObj.dices[i])
      }
      this.sevenGameResult = resultTmp.join('，')
      this.sevenGameVisible = true
    },
    closeDialog() {
      console.log('close dialog')
      this.pusoyDos.pusoyDosDetailVisible = false
      this.gameLogComponent.visible = false
    },
    showRummyGame(obj) {
      for (let i = 0; i < obj.players.length; i++) {
        const detailRow = obj.players[i]
        let rowHtml = ''
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
      for (let j = 0; j < obj.totalPlayers.length; j++) {
        const players = obj.totalPlayers[j]
        console.log(this.sweeperRowUid)
        if (players.uid === this.sweeperRowUid) {
          console.log(this.players)
          obj.players = players
          break
        }
      }

      for (let i = 0; i < obj.players.details.length; i++) {
        const detailRow = obj.players.details[i]
        const areaIndex = detailRow.index - 1
        let showName = '炸弹'
        if (detailRow.result == 1) {
          showName = '金币'
        }

        if (detailRow.result == 3) {
          showName = '宝箱'
        }

        showDetail[areaIndex] = { name: showName, step: detailRow.step, result: detailRow.result }
      }

      this.sweeperDetails = showDetail
      console.log(this.sweeperDetails)
      this.sweeperPlay = obj.players

      console.log(this.sweeperPlay)

      this.sweeperVisible = true
    },
    showMinesGame(obj) {
      const showDetail = []
      for (let i = 0; i < obj.blockDetails.length; i++) {
        const detailRow = obj.blockDetails[i]
        const areaIndex = detailRow.index - 1
        let showName = '炸弹'
        if (detailRow.result == 1) {
          showName = '金币'
        }

        if (detailRow.result == 3) {
          showName = '宝箱'
        }
        showDetail[areaIndex] = { name: showName, step: detailRow.step, result: detailRow.result }
      }

      const playDetail = []
      for (let k = 0; k < obj.playDetails.length; k++) {
        const detailRow = obj.playDetails[k]
        let playAction = '扫雷'
        if (detailRow.actionType == 2) {
          playAction = '跳过'
        }

        let resultName = ''
        if (detailRow.result == 1) {
          resultName = '金币'
        }

        if (detailRow.result == 2) {
          resultName = '炸弹'
        }

        playDetail[k] = { action: playAction, uid: detailRow.uid, result: resultName, money: detailRow.actionMoney }
      }

      this.minesBattleDetails = showDetail
      this.minesBattlePlayDetails = playDetail
      console.log(this.minesBattleDetails)
      console.log(this.minesBattlePlayDetails)
      this.minesBattleVisible = true
    },
    showTowerGame(obj) {
      this.towerData = obj.Tower.Symbol
      this.towerVisible = true
    },
    showLucky9Game(obj) {
      this.lucky9Detail = obj
      this.lucky9DetailVisible = true
    },
    showBodingGame(obj) {
      this.bodingDetail = obj
      this.bodingDetailVisible = true
    },
    showBlackjackGame(obj) {
      console.log(obj)
      this.blackjackDetail = obj
      this.blackjackDetailVisible = true
    },
    showBlackjackmhGame(obj) {
      console.log(obj)
      if (obj.BlackjackMH) {
        this.blackjackmhDetail = obj.BlackjackMH
        this.blackjackmhDetail.tid = obj.Tid
        this.blackjackmhDetail.logId = obj.BlackjackMH.logId
        this.blackjackmhDetailVisible = true
      }
    },
    showPusoyDosGame(obj) {
      this.pusoyDos.pusoyDosDetail = obj
      this.pusoyDos.pusoyDosDetailVisible = true
    },
    showDominoGame(obj) {
      console.log(obj)
      this.dominoDetail = obj
      this.dominoDetailVisible = true
    },
    showPusoySwapGame(obj) {
      console.log(obj)
      this.pusoySwapShootOneShow = false

      for (const k in obj.players) {

        for (const i in obj.groupTop) {
          if (obj.groupTop[i].uid === obj.players[k].uid) {
            obj.players[k].groupTop = obj.groupTop[i]
            break
          }
        }
        for (const i in obj.groupMiddle) {
          if (obj.groupMiddle[i].uid === obj.players[k].uid) {
            obj.players[k].groupMiddle = obj.groupMiddle[i]
            break
          }
        }
        for (const i in obj.groupBottom) {
          if (obj.groupBottom[i].uid === obj.players[k].uid) {
            obj.players[k].groupBottom = obj.groupBottom[i]
            break
          }
        }
      }
      if (obj.shootOne) {
        this.pusoySwapShootOneShow = true
      }
      this.pusoySwapDetail = obj
      this.pusoySwapDetailVisible = true
    },
    isContainsFriendGame() {
      if (this.gid == 21) {
        return true
      }
      return false
    },
    showPusoyGame(obj) {
      console.log(obj)
      this.pusoyShootOneShow = false
      for (const k in obj.players) {
        for (const i in obj.groupTop) {
          if (obj.groupTop[i].uid === obj.players[k].uid) {
            obj.players[k].groupTop = obj.groupTop[i]
            break
          }
        }
        for (const i in obj.groupMiddle) {
          if (obj.groupMiddle[i].uid === obj.players[k].uid) {
            obj.players[k].groupMiddle = obj.groupMiddle[i]
            break
          }
        }
        for (const i in obj.groupBottom) {
          if (obj.groupBottom[i].uid === obj.players[k].uid) {
            obj.players[k].groupBottom = obj.groupBottom[i]
            break
          }
        }
      }
      if (obj.shootOne) {
        this.pusoyShootOneShow = true
      }
      this.pusoyDetail = obj
      this.pusoyDetailVisible = true
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
        case 100:
          this.detailVisible = true
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

    getCardUrl(card) {
      return require('@/assets/poker/' + card + '.png')
    },
    getDominoCardUrl(card, num) {
      card = num === 1 ? card & 0x0f : (card >> 4) & 0x0f
      return require('@/assets/domino/' + card + '.png')
    },
    getDominoWinType(wintype) {
      switch (wintype) {
        case 0:
          return 'LOSE'
        case 1:
          return 'END-WIN'
        case 2:
          return 'DOUBLE'
        case 3:
          return 'TRIPLE'
        case 4:
          return 'QUARTET'
        case 5:
          return 'QUINTET'
      }
    },
    getVideoPokerCardType() {
      const gameMode = this.gameLogComponent.detail.VideoPoker.gameMode ? this.gameLogComponent.detail.VideoPoker.gameMode : 2
      const cardType = this.gameLogComponent.detail.VideoPoker.cardType
      return cardType >= 0 ? this.videoPokerCardTypes[gameMode] ? this.videoPokerCardTypes[gameMode][cardType] : '无' : '无'
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

      // 清空sicboGame数据
      this.sicboGameResult = ''

      // 清空miniDvtGame数据
      this.miniDvtGameResult = ''

      // 清空miniSaBongGame数据
      this.miniSaBongGameResult = []

      // 清空miniAbGame数据
      this.miniAbGameResult = ''
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
    getCardStyle(idx, num) {
      let styleStr = ''
      if (num >= 256) {
        styleStr += 'border: 0.5px solid red ;'
      }
      if (idx === 0) {
        styleStr += 'width: 32px; height: 40px;'
      } else {
        styleStr += 'width: 32px; height: 40px;margin-left: -20px;'
      }
      return styleStr
    },

    getServiceFeeName() {
      if (this.gid == 20 || this.gid==132) {
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
    WinOrLoseColor(row) {
      if (row > 0) {
        return {
          color: 'red'
        }
      }
      if (row < 0) {
        return {
          color: 'green'
        }
      }
    },
    changColor({ row }) {
      if (row.typ == '1') {
        return {
          color: 'red'
        }
      }
      if (row.typ == '2') {
        return {
          color: '#9205a6'
        }
      }
    },
    changColorGoldMaster({ row }) {
      const typ = this.parseKnockExt(row.knockExt).typ
      if (typ == '1') {
        return {
          color: 'red'
        }
      }
      if (typ == '2') {
        return {
          color: '#9205a6'
        }
      }
    },
    showRoomLevel(level) {
      switch (level) {
        case 0:
          return '普通场'
        case 1:
          return '练习场'
        case 100:
          return '好友房'
        case 110:
          return '比赛场'
        default:
          return level <= 7 ? '陪玩机器人' : level
      }
    },
    explainExt(gid, ext) {
      if (!ext) return ''
      let obj
      try {
        obj = typeof ext === 'string' ? JSON.parse(ext) : ext
      } catch (e) {
        return ''
      }
      switch (gid) {
        case 501: {
          if (obj.oddsTarget > 0){
            obj.oddsTarget=obj.oddsTarget/10
          }
          if (obj.oddsTarget === -2){
            return "气球:"+obj.oddsTarget+"  击杀:"+obj.oddsKill/10+"  PiggyBoom:"+obj.oddsPiggyBoom/10
          }else {
            return "气球:"+obj.oddsTarget+"  击杀:"+obj.oddsKill/10
          }
        }
        default:
          return ext
      }
    },
    showRobotLevel(isRobot,level) {
      if (isRobot!=0 && level==0) {
        level = isRobot
      }
      switch (level) {
        case -1 :
          return '机器人'
        case 0:
          return '真人'
        case 4:
          return '机器人--陪玩'
        case 5:
          return '机器人--要赢'
        case 8:
          return '一级杀手机器人'
        case 9:
          return '二级杀手机器人'
        case 10:
          return '收割机器人'
        default:
          return level <= 7 ? '陪玩机器人' : level
      }
    },
    getMicroCtrlName(val) {
      if (val === 0) {
        return '空'
      }
      const bout = parseInt(val / 10000)
      const flag = parseInt((val % 10000) / 100)
      const step = parseInt(val % 100)
      var name = ''
      if (val > 0) {
        name += `回合${bout}`
      }
      if ((flag & 1) !== 0) {
        name += '新手'
      }
      if ((flag & 2) !== 0) {
        name += '普通'
      }
      if ((flag & 4) !== 0) {
        name += '杀'
      }
      if ((flag & 8) !== 0) {
        name += '帮'
      }
      if (step > 0) {
        name += `第${step}步`
      }
      return name
    },
    getWinRateName() {
      if (this.gid == 20 || this.gid==132) {
        return '领奖倍率'
      } else if (this.gid == 10) {
        return '下注值'
      } else {
        return '胜率'
      }
    },
    getRobotType(robotId, robotLevel) {
      if (robotId == 0) {
        return '真人'
      } else if (robotLevel == 4) {
        return '机器人--陪玩'
      } else if (robotLevel == 5) {
        return '机器人--要赢'
      }
      return '机器人'
    },
    getTrucoTeamColor(teamId) {
      if (teamId == 1) {
        return 'red'
      }else if (teamId == 2) {
        return 'green'
      }
      return 'yellow'
    },
    getTrucoMaxCard(viradaCard) {
      let cardNumberOrder = [12, 11, 13, 1, 2, 3] //牌的数字大小：[Q < J < K < A < 2 < 3]
	    let point = viradaCard & 0x0f
      let trucoRoundMaxCardIndex = 0
      for (let i = 0; i < cardNumberOrder.length; i ++) {
        if (cardNumberOrder[i] == point) {
          if (i == cardNumberOrder.length-1) {
            trucoRoundMaxCardIndex = 0// = cardNumberOrder[0]
          } else {
            trucoRoundMaxCardIndex = i+1// = cardNumberOrder[i+1]
          }
        }
      }
      let cards = [0x2c, 0x2b, 0x2d, 0x21, 0x22, 0x23]
      return cards[trucoRoundMaxCardIndex]
    },
    trucoMaxCardUrl(viradaCard) {
      return this.getCardUrl(this.getTrucoMaxCard(viradaCard))
    },
    trucoCardNumSort(viradaCard) {
      let cardNumberOrder = [12, 11, 13, 1, 2, 3] //牌的数字大小：[Q < J < K < A < 2 < 3]
      let maxCard = this.getTrucoMaxCard(viradaCard)
	    let point = maxCard & 0x0f
      let txt = ['Q','J','K','A','2','3']
      for (let i = 0; i < cardNumberOrder.length; i ++) {
        if (cardNumberOrder[i] == point) {
          let mx = txt[i]
          txt.splice(i, 1)
          txt.push('♦'+mx)
          txt.push('♠'+mx)
          txt.push('♥'+mx)
          txt.push('♣'+mx)
          break
        }
      }
      let msg = ""
      for (let i = 0; i < txt.length; i ++) {
        if (i > 0){
          msg += '<'
        }
        msg += txt[i]
      }
      return msg
    },
    getBuracoTeamColor(teamId) {
      if (teamId == 1) {
        return 'red'
      } else if (teamId == 2) {
        return 'green'
      }
      return ''
    },
    getBuracoActionDec(actionType){
      if (actionType == 0) {
        return '发牌'
      } else if (actionType == 1) {
        return '发弃牌'
      } else if (actionType == 2) {
        return '摸牌堆'
      } else if (actionType == 3) {
        return '摸/组弃牌堆'
      } else if (actionType == 4) {
        return '弃牌堆发给玩家'
      } else if (actionType == 5) {
        return '弃牌'
      } else if (actionType == 6) {
        return '手牌扩牌组'
      } else if (actionType == 7) {
        return '出完手牌'
      } else if (actionType == 8) {
        return '拿morto牌堆'
      } else if (actionType == 9) {
        return '出完手牌Batida'
      } else if (actionType == 10) {
        return '流局'
      } else if (actionType == 11) {
        return 'morto牌给牌堆'
      } else if (actionType == 12) {
        return '放手牌'
      } else if (actionType == 13) {
        return '剩余手牌'
      } else if (actionType == 14) {
        return 'morto牌'
      } else if (actionType == 15) {
        return '剩余牌堆'
      }
      return ''
    },
    getBuracoCardUrl(card) {
      let c = (card & 0x0ff)
      let idx = (card & 0xf00)
      if ((idx === 0) && (c > 0x60)) { //兼容0x100和0x60定义
        c = c - 0x50
      }
      let color = (c >> 4) & 0xf
      if (color == 5) {//王
        c = 2
      }
      return require('@/assets/poker/' + c + '.png')
    },
    IstBuracoAppendsCards(card, appendsCards) {
      if (appendsCards != undefined && appendsCards.length > 0) {
        return -1 == appendsCards.indexOf(card)
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

.dominoHr {
  display: flex;
  flex-direction: column;
}

ul#sweeperShow {
  width: 601px;
  height: 601px;
  padding: 0px;
  clear: both;
  margin: 0;
  list-style: none;
  border-top: #999 1px solid;
  border-left: #999 1px solid;
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
  border-right: #999 1px solid;
  border-bottom: #999 1px solid;
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
  margin-top: 80px;
  margin-right: 0px;
}

#sweeperShowTable table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

#sweeperShowTable table td {
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}

#towerShow table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

#towerShow table td {
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}

.blackJackHr {
  width: 200%;
  margin-left: -10px;
  background-color: #dfe6ec;
  height: 1px;
  border: none;
}

.blackJackmhHr {
  width: 200%;
  margin-left: -10px;
  background-color: #dfe6ec;
  height: 1px;
  border: none;
}

.blackJackmhBox {
  height: 118px;            /* 指定高度 */
  display: flex;
  flex-direction: column;   /* 垂直方向布局 */
  justify-content: flex-end; /* 垂直底部对齐 */
  text-align: center;       /* 水平居中 */
  border: none;
}

.blackJackmhBlock {
  height: 118px;            /* 指定高度 */
  display: block;
}

.solitaireHeight {
  height: 60px;
}

/* 容器样式 */
.grid-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 外层自动适配大框：宽度100%，随容器自适应 */
.grid-outer-frame {
  border: 3px solid #000; /* 外层粗黑边框 */
  border-radius: 8px;
  padding: clamp(15px, 3vw, 25px); /* 内边距自适应（小屏15px，大屏25px） */
  box-sizing: border-box;
  background-color: #fff;
  width: 100%; /* 关键：宽度自适应父容器 */
  max-width: 600px; /* 防止大屏下大框过宽 */
}


/* 网格容器 */
.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 500px;
  width: 100%;
  margin-bottom: 24px;
}

/* 内部单元格样式（黑色边框） */
.grid-cell {
  aspect-ratio: 1/1;
  border: 2px solid #000; /* 内部小方格边框 */
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

/* 上下部分数字样式 */
.cell-top, .cell-bottom {
  font-size: 24px;
  font-weight: 500;
  color: #000; /* 黑色数字 */
}

/* 中间分隔线（黑色+仅占方格一半长度） */
.cell-divider {
  width: 50%; /* 仅占方格一半宽度 */
  height: 1px;
  background-color: #000; /* 黑色分隔线 */
}

.number-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap; /* 关键属性，禁止换行 */
  overflow-x: auto; /* 超出容器宽度时显示横向滚动条 */
  padding: 8px;
  border: 1px dashed #ccc;
  justify-content: center;
  gap: 20px; /* 设置子元素之间的间隔为20px */
}

</style>
