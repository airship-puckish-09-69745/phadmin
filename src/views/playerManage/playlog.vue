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
          <el-descriptions-item label="胜率%：">{{ ( item.loseCount+item.winCount)>0?(item.winCount/ (item.loseCount+item.winCount)*100).toFixed(1):0 }}</el-descriptions-item>
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
           <span v-if="gid==20&& scope.row.LuckyVal>0">
              {{  scope.row.LuckyVal }}
           </span>
            <span v-else>
               {{ scope.row.WinRate }}
            </span>
          </template>
        </el-table-column>
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
      <div id="sweeperShowTable">
        <table>
          <tr><td>奖池贡献</td><td>扣除奖池贡献</td><td>累计奖池贡献</td><td>点控命中</td></tr>
          <tr><td>{{ sweeperPlay.JackpotContribute/1000 }}</td><td>{{ sweeperPlay.ReduceContribute/1000 }}</td><td>{{ sweeperPlay.CurrentContribute
            /1000 }}</td><td>{{ getMicroCtrlName(sweeperPlay.microCtrl) }}</td></tr>
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

    <el-dialog title="Blackjack牌局详情" :visible.sync="blackjackDetailVisible" width="1200px">
      <el-descriptions class="margin-top" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            押注：
          </template>
          {{ blackjackDetail.antes/1000 }}
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
          {{ blackjackDetail.dealerCardType===1?"点牌":(blackjackDetail.dealerCardType===2?"BlackJack":"爆牌") }}
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
              <hr v-if="index > 0" class="blackJackHr"/>
               {{item.moneyBet / 1000}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cards" label="手牌">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.cardGroups" class="block">
              <hr v-if="index > 0" class="blackJackHr"/>
              {{ '手牌'+(index+1)+': ' }}
              <div v-for="(card) in item.cards" class="block">
                <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
                />
              </div>
            </div>
          </template>

        </el-table-column>
        <el-table-column label="是否爆牌">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.cardGroups" class="block" style="width: 100%;white-space: pre-wrap;">
                    <hr v-if="index > 0" class="blackJackHr"/>
                      {{ '手牌'+(index+1)+': '+ (item.cardType==1?"点牌":( item.cardType==2?"BlackJack":"爆牌")) }}
                  </div>
                </template>
        </el-table-column>
        <el-table-column label="输赢">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.cardGroups" class="block" style="width: 100%;white-space: pre-wrap;">
                <hr v-if="index > 0"  class="blackJackHr"/>
                 {{item.moneyWon / 1000}}
              </div>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ blackjackDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ blackjackDetail.logId }}</el-descriptions-item>
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
                <div v-html="showCard(scope.row.cards)" /><span>({{ pusoyCardTypes[scope.row.cardType] || '' }})</span>
              </template>
              <template v-else>
                <div v-html="showCard(scope.row.groupBottom.cards)" /><span>({{ pusoyGroupCardTypes[scope.row.groupBottom.cardType] || '' }})</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="cards" label="中手牌" width="150"><template slot-scope="scope"><div v-html="showCard(scope.row.groupMiddle.cards)" /><span>({{ pusoyGroupCardTypes[scope.row.groupMiddle.cardType] || '' }})</span></template></el-table-column>
          <el-table-column prop="cards" label="前手牌" width="150"><template slot-scope="scope"><div v-html="showCard(scope.row.groupTop.cards)" /><span>({{ pusoyGroupCardTypes[scope.row.groupTop.cardType] || '' }})</span></template></el-table-column>
        </el-table-column>
        <el-table-column prop="cardType" label="牌型" width="90">
          <template slot-scope="scope">{{ pusoyShowCardTypeName(scope.row.cardType) }} {{ pusoyShowShootAll(scope.row) }} {{ pusoyShowGroupExtra(scope.row) }}</template>
        </el-table-column>
        <el-table-column prop="cardScore" label="点数" width="100" />
        <el-table-column prop="moneyBet" label="下注" width="100"><template slot-scope="scope">{{ scope.row.moneyBet/1000 }}</template></el-table-column>
        <el-table-column prop="moneyWon" label="输赢" width="100"><template slot-scope="scope">{{ scope.row.moneyWon/1000 }}</template></el-table-column>
        <el-table-column prop="moneyFee" label="抽水" width="100"><template slot-scope="scope">{{ scope.row.moneyFee/1000 }}</template></el-table-column>
        <el-table-column prop="moneyTotal" label="最终资产" width="100"><template slot-scope="scope">{{ scope.row.moneyTotal/1000 }}</template></el-table-column>
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
          <el-table-column prop="SourcePlayer.uid" label="打枪"><template slot-scope="scope">{{ scope.row.SourcePlayer.uid }}</template></el-table-column>
          <el-table-column prop="TargetPlayer.uid" label="Pusoy"><template slot-scope="scope">{{ scope.row.TargetPlayer.uid }}</template></el-table-column>
          <el-table-column prop="SourcePlayer.scoreChanged" label="ScoreChanged" />
        </el-table-column>
      </el-table>
      <br>
      <el-descriptions title="扩展信息">
        <el-descriptions-item label="桌子ID">{{ pusoyDetail.tid }}</el-descriptions-item>
        <el-descriptions-item label="Server日志ID">{{ pusoyDetail.logId }}</el-descriptions-item>
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

    <el-dialog
      title="Windrop详情"
      :visible.sync="WindropGameVisible"
      width="50%"
    >
      <br>
      <el-descriptions title="总信息">
        <el-descriptions-item label="总球数">{{ WindropGameResult.BallNum }}</el-descriptions-item>
        <el-descriptions-item label="总金币">{{ WindropGameResult.BetAllScore }}</el-descriptions-item>
        <el-descriptions-item label="下注金币">{{ WindropGameResult.BetScore }}</el-descriptions-item>
        <el-descriptions-item label="当前能量">{{ WindropGameResult.CurEnergy }}</el-descriptions-item>
        <el-descriptions-item label="能量奖励">{{ WindropGameResult.EnergyNum <1000 ? WindropGameResult.EnergyNum+' 球' : WindropGameResult.EnergyNum+' 金币' }}</el-descriptions-item>
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
            <span v-html="scope.row.ID" />
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
            <span v-html="scope.row.SpinScore" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Score"
          label="金币"
          width="120"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.Score" />
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
        <span style="float:left;">骰子结果：</span><div style="color:red;">{{ sicboGameResult }}</div>
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
        <span style="float:left;">发牌：</span><div style="color:red;">{{ miniDvtGameResult }}</div>
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
      title="骰宝牌局详情"
      :visible.sync="miniAbGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">发牌：</span><div style="color:red;">{{ miniAbGameResult }}</div>
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
        <span style="float:left;">骰子结果：</span><div style="color:red;">{{ sevenGameResult }}</div>
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
      title="小火箭牌局详情"
      :visible.sync="rocketGameVisible"
      width="50%"
    >
      <div style=" font-size:14px; line-height: 18px; height: 25px;">
        <span style="float:left;">爆炸点：</span><div style="color:red;">{{ rocketGameResult }}</div>
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
            <span v-if="scope.row.Hit" style="color:red">是</span>
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
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--           赢家：-->
<!--          </template>-->
<!--          {{ solitaireLog.solitaireDetail.winUid }}-->
<!--        </el-descriptions-item>-->
        <el-descriptions-item>
          <template slot="label">
            底注：
          </template>
          {{ solitaireLog.solitaireDetail.tableMoney /1000 }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="solitaireLog.solitaireDetail.players" border>
        <el-table-column prop="uid" label="uid">
          <template slot-scope="scope">{{ scope.row.uid}}</template>
        </el-table-column>
        <el-table-column prop="seat" label="输赢">
          <template slot-scope="scope">{{  scope.row.moneyChange/1000  }}</template>
        </el-table-column>
        <el-table-column prop="cards" label="当前金额">
          <template slot-scope="scope">
            {{scope.row.moneyTotal/1000}}
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
        <el-table-column prop="isDealer" label="结算">
          <template slot-scope="scope">
            <div style="height: 200px">
              <el-row>
                <span>放牌区</span>
              </el-row>
            </div>
            <div class="solitaireHeight">
              <hr class="blackJackHr"/>
              <el-row>
                <span>牌堆</span>
              </el-row>
            </div>
            <div style="height: 200px">
              <hr class="blackJackHr" style="width: 2000px"/>
              <el-row>
                <span>牌叠</span>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="isDealer" label="结算" width="1000px">
          <template slot-scope="scope">
            <div style="height: 200px">
              <el-row >
                      <span v-for="(row,idx) in  scope.row.resultCards">
                          <div v-for="(d,i) in row.cards" style="float:left;" >
                             <el-image
                               :style="getCardStyle2(i)"
                               :src="getCardUrl(cardConversionColor(d,'0-2','1-4','2-3','3-1'))"
                             />
                         <span v-html="'&nbsp;'"> </span>
                 </div>
              </span>
              </el-row>
            </div>
            <div class="solitaireHeight">
              <hr class="blackJackHr"/>
              <el-row>
                     <span v-for="(row,idx) in  scope.row.CardsPile">
                         <el-image
                           :style="getCardStyle(idx)"
                           :src="getCardUrl(cardConversionColor(row,'0-2','1-4','2-3','3-1'))"
                         />
              </span>
              </el-row>
            </div>
            <div style="height: 200px">
              <hr class="blackJackHr"/>
              <el-row>
                         <span v-for="(row,idx) in  scope.row.cardsStacks" >
                             <div v-for="(d,i) in row.cards" style="float:left;" >
                                 <el-image
                                   :style="getCardStyle2(i)"
                                   :src="getCardUrl(cardConversionColor(d,'0-2','1-4','2-3','3-1'))"
                                 />
                                <span v-html="'&nbsp;'"> </span>
                   </div>
                </span>

              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <pusoy-dos-detail-log :game-log="pusoyDos.pusoyDosDetail" :game-log-visible="pusoyDos.pusoyDosDetailVisible" :gid="34" @closeDialog="closeDialog" />
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
import { $libDate, $libShow, ClientTableData, LibShow, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'
import LineChart from './components/LineChart'
import DateTimeShow from '@/components/DatetimeShow'
import PusoyDosTable from '@/views/config/tableConfig/pusoyDos/pusoyDosTable.vue'
import PusoyDosDetailLog from '@/views/playerManage/components/PusoyDosDeatilLog.vue'
import TongitsGameLog from '@/views/playerManage/components/TongitsGameLog.vue'

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
  components: { TongitsGameLog, PusoyDosDetailLog, PusoyDosTable, DateTimeShow, Compare, Publish, UidInput, LineChart },
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
        SpinCount: 0
      },
      WindropGameOptions: [],

      lucky9Detail: {},
      lucky9DetailVisible: false,

      blackjackDetail: {},
      blackjackDetailVisible: false,

      bodingDetail: {},
      bodingDetailVisible: false,

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
      pusoyGroupCardTypes: {
      },
      pusoyShootOneShow: false,

      pusoyDos: {
        pusoyDosDetail: {},
        pusoyDosDetailVisible: false,
        pusoyDosShootOneShow: false
      },
      solitaireLog: {
        solitaireVisible: false,
        solitaireDetail: {},
      },
      ConversionColorMap:{},

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

      libMoney: new MoneyShow(['MoneyChanged', 'PayoffAmount', 'MoneyNow', 'ServiceFee', 'TableMoney', 'TotalValidBet', 'PotChange'])
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.gid = this.$route.meta.gid
  },
  methods: {
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
        this.setRowUid(row.Uid)
        this.getDetail(row.LogID, row.FinishTime)
      }
    },
    setRowUid(uid) {
      this.sweeperRowUid = uid
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
          } else if (gid == 10) {
            $this.showRocketGame(obj)
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
          } else if (gid === 34) {
            $this.showPusoyDosGame(obj)
          } else if (gid == 37) {
            $this.showBlackjackGame(obj)
          } else if (gid === 21) {
            $this.showPusoyGame(obj)
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
          } else if (gid === 103) {
            $this.showWindropGame(obj)
          } else if (gid === 6) {
            $this.showSevenGame(obj)
          } else if (gid === 35) {
            $this.showSolitaire(obj)
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
    cardConversionColor(num,meihua,heitao,hongtao,fangkuai){
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      if (num==0){
        return 2
        return
      }
      if (Object.keys(this.ConversionColorMap).length === 0){
        var m = meihua.split('-');
        var hei = heitao.split('-');
        var hong = hongtao.split('-');
        var f = fangkuai.split('-');
        this.ConversionColorMap[m[0]]=m[1]
        this.ConversionColorMap[hei[0]]=hei[1]
        this.ConversionColorMap[hong[0]]=hong[1]
        this.ConversionColorMap[f[0]]=m[1]
      }


      var s = num.toString(16);
      // 补0
      if (s.length===1){
        s = '0'+s[0];
      }
      let result ='0x'+ this.ConversionColorMap[s[0]]+s[1]
      return parseInt(result)
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
      this.solitaireLog.solitaireDetail=obj
      this.solitaireLog.solitaireVisible=true
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
          for (const pos of windropObj.optionData.bouns[i].TracksPos) {
            tracksPos.push({
              posX: pos.posX,
              posY: pos.posY
            })
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
      this.WindropGameVisible = true
    },

    showRocketGame(obj) {
      const names = ['下注区域0', '下注区域1', '下注区域2', '下注区域3', '下注区域4', '下注区域5']
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
        if (player.UserBetOptions.moneyTotalBet === 0) {
          continue
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

      this.rocketGameResult = rocketObj.stopOdds / 100
      console.log(this.rocketGameOptions)
      this.rocketGameVisible = true
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

        for (let j = 0; j < sicbObj.bonus.length; j++) {
          if (i === sicbObj.bonus[j].Id) {
            ob.Rate = ob.Rate * sicbObj.bonus[j].Double
            console.log(ob.Rate)
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
        tMap[ob.id] = { ID: ob.id, Name: names[i], Odds: ob.Odds, IsHit: ob.isHit, EOdds: ob.extraPay, totalOdds: ob.totalOdds, players: [] }
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
      // console.log("close dialog")
      this.pusoyDos.pusoyDosDetailVisible = false
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
    showPusoyDosGame(obj) {
      this.pusoyDos.pusoyDosDetail = obj
      this.pusoyDos.pusoyDosDetailVisible = true
    },
    isContainsFriendGame(){
      if (this.gid==21){
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
    getCardStyle(idx){
      if (idx===0){
        return 'width: 37px; height: 50px;'
      }
      return 'width: 37px; height: 50px;margin-left: -20px'
    },
    getCardStyle2(idx){
      if (idx===0){
        return 'width: 37px; height: 50px;'
      }
      let top =idx*15
      let left =idx+1 * -37
      return 'width: 37px; height: 50px;margin-left: '+left+'px;margin-top: '+top+'px'
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

#sweeperShowTable table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

#sweeperShowTable table td{
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

#towerShow table td{
  border: 1px solid #eee;
  height: 31px;
  line-height: 31px;
  padding: 2px;
}
.blackJackHr{
   width: 200%;
  margin-left: -10px;
  background-color: #dfe6ec;
  height:1px;
  border:none;
}
.solitaireHeight{
  height: 80px;
}
</style>
