<template>
  <div class="app-container">

    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane v-loading="loading" label="统计结果">
        <el-row>
          <el-col>
            <el-date-picker
              v-model="queryTime"
              size="mini"
              type="date"
              placeholder="选择日期"
              @change="updateGid"
            />
            <el-select v-model="queryGid" size="mini" filterable default-first-option @change="queryKeyInput">
              <!--              <el-option label="所有" :value="0"/>-->
              <el-option v-for="(o,k) in gidOptions" :key="k" :label="getGameName(o)" :value="parseInt(o)" />
            </el-select>
            <el-button type="primary" size="mini" @click="getSlotsScriptStatistics">查询</el-button>
            <el-button type="success" size="mini" @click="exportExcel">导出步数</el-button>

            <el-select v-model="betOddsKey" size="mini" filterable default-first-option @change="betOddsKeyInput">
              <el-option v-for="(o,k) in betOddsKeySelect" :key="k" :label="getBetOddsName(o)" :value="o" />
            </el-select>
          </el-col>
        </el-row>

        <el-row style="overflow-x: auto; display: flex; flex-wrap: nowrap;padding-bottom: 30px;margin-top: 20px">
          <el-col :span="11">
            <el-table
              ref="filterTable"
              :data="OrdinaryReturnTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px',width: '100%'}"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column label="普通返奖统计">
                <el-table-column
                  prop="gid"
                  label="Bet值"
                  width="75px"
                >
                  <template slot-scope="scope">
                    {{ currentBaseBet * scope.row.bet / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注次数"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.times }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注次数占比"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.times) / getTotalOrdinaryBetTimes() * 100).toFixed(2) + '%' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注额度"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ currentBaseBet * scope.row.bet * scope.row.times / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注额度占比"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ ((parseInt( scope.row.bet * scope.row.times+'') / getTotalOrdinaryBet() )*100).toFixed(2) + '%' }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="gid"
                  label="返奖额度"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ returnMap[betOddsKey][ scope.row.bet] / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="GGR"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ ((currentBaseBet * scope.row.bet * scope.row.times) - (returnMap[betOddsKey][ scope.row.bet])) / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="返奖率"
                >
                  <template slot-scope="scope">
                    {{
                      ((returnMap[betOddsKey][scope.row.bet] /(currentBaseBet * scope.row.bet * scope.row.times))*100).toFixed(2) + "%"
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>

          </el-col>
          <el-col :span="11" :offset="1">
            <el-table
              ref="filterTable"
              :data="BuyReturnMoneyTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column label="购买返奖统计">
                <el-table-column
                  prop="gid"
                  label="Bet值"
                  width="75px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.bet / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注次数"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.times }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注次数占比"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.times) / getTotalBuyBetTimes() * 100).toFixed(2) + '%' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注额度"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.bet * scope.row.times / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="下注额度占比"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ ((parseInt( scope.row.bet * scope.row.times+'') / getTotalBuyOrdinaryBet() )*100).toFixed(2) + '%' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="返奖额度"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ buyReturnMap[betOddsKey][ scope.row.bet]?buyReturnMap[betOddsKey][ scope.row.bet] / 1000:0 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="GGR"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ (( scope.row.bet * scope.row.times) - (buyReturnMap[betOddsKey][ scope.row.bet]?buyReturnMap[betOddsKey][ scope.row.bet]:0)) / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="返奖率"
                >
                  <template slot-scope="scope">
                    {{
                      (buyReturnMap[betOddsKey][scope.row.bet] / (scope.row.bet * scope.row.times) *100).toFixed(2) + "%"
                    }}
                  </template>
                </el-table-column>

              </el-table-column>
            </el-table>

          </el-col>
        </el-row>
        <el-row v-if="queryGid === 186" style="overflow-x: auto; display: flex; flex-wrap: nowrap;padding-bottom: 30px">
          <el-col :span="11">
            <el-table
              ref="filterTable"
              :data="Has2JPColsBuyRespinTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px',width: '100%'}"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column label="重转返奖统计">
                <el-table-column
                  prop="multiOdds"
                  label="额外倍数"
                  width="80px"
                />
                <el-table-column
                  prop="gid"
                  label="Bet值"
                  width="75px"
                >
                  <template slot-scope="scope">
                    {{ currentBaseBet * scope.row.bet / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="出现2列jp次数"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.times }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="出现2列jp首次购买次数"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ getBuyRespinFirstTimes(scope.row.bet, scope.row.multiOdds) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="购买jp次数"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ getBuyRespinTimes(scope.row.bet, scope.row.multiOdds) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="出现2列jp首次购买占比"
                  width="90px"
                >
                  <template slot-scope="scope">
                    {{ (getBuyRespinFirstTimes(scope.row.bet, scope.row.multiOdds) / scope.row.times * 100).toFixed(2) + '%' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="购买jp额度"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ getBuyRespinBet(scope.row.bet, scope.row.multiOdds) / 1000 }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="gid"
                  label="购买jp返奖"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ getBuyRespinReturn(scope.row.bet, scope.row.multiOdds) / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="GGR"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ (getBuyRespinBet(scope.row.bet, scope.row.multiOdds) - getBuyRespinReturn(scope.row.bet, scope.row.multiOdds)) / 1000 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gid"
                  label="返奖率"
                >
                  <template slot-scope="scope">
                    {{
                      (getBuyRespinBet(scope.row.bet, scope.row.multiOdds) > 0 ? ((getBuyRespinReturn(scope.row.bet, scope.row.multiOdds) / getBuyRespinBet(scope.row.bet, scope.row.multiOdds))*100).toFixed(2) : 0) + "%"
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>

          </el-col>
        </el-row>
        <el-row style="overflow-x: auto; display: flex; flex-wrap: nowrap;padding-bottom: 30px">
          <el-col :span="11">
            <el-table
              ref="filterTable"
              :data="scriptTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style=""
            >
              <el-table-column label="命中统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <span v-for="(item, index) in gameOptions" :key="index">
                      {{ (scope.row.gid == item.key ? item.label : "") }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="idx"
                  label="区间"
                  width="130px"
                >
                  <template slot-scope="scope">
                    {{ getTitle(parseInt(scope.row.gid), parseInt(scope.row.idx)) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="cnt"
                  label="次数"
                />
                <el-table-column
                  prop="cnt"
                  label="占比"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.cnt) / sumData[scope.row.gid][betOddsKey] * 100).toFixed(2) + "%" }}
                  </template>
                </el-table-column>

                <el-table-column prop="idx" label="Scatter次数" width="130px">
                  <template slot-scope="scope">{{ getScatterCount(scope.row.idx) }}</template>
                </el-table-column>
                <el-table-column prop="idx" label="Scatter占比" width="130px">
                  <template slot-scope="scope">{{ getScatterPercent(scope.row.idx, scope.row.cnt) }}</template>
                </el-table-column>

              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <div class="block">
                  <el-pagination
                    v-if="scriptClientDB[betOddsKey]"
                    :current-page="scriptClientDB[betOddsKey].GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="scriptClientDB[betOddsKey].GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="scriptClientDB[betOddsKey].GetPage().GetTotalCount()"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-table
              ref="filterTable"
              :data="coordinateTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 700px"
            >
              <el-table-column label="完成50步统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <span v-for="(item, index) in gameOptions" :key="index">
                      {{ (scope.row.gid == item.key ? item.label : "") }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="类型"
                  width="120px"
                />
                <el-table-column
                  prop="cnt"
                  label="次数"
                />
                <el-table-column
                  prop="cnt"
                  label="占比"
                >
                  <template slot-scope="scope">
                    {{ (parseInt(scope.row.cnt) / coordinateSum[scope.row.gid] * 100).toFixed(2) + "%" }}
                  </template>
                </el-table-column>
                <el-table-column label="最终输赢">
                  <template slot-scope="scope">
                    {{
                      parseInt(Actions[scope.row.orgKey]) / cfgMap[parseInt(scope.row.gid)] ? cfgMap[parseInt(scope.row.gid)].Bet : 0
                    }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="5">
                <div class="block">
                  <el-pagination
                    :current-page="coordinateClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="coordinateClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next"
                    :total="coordinateClientDB.GetPage().GetTotalCount()"
                    @size-change="coordinateHandleSizeChange"
                    @current-change="coordinateHandleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="overflow-x: auto; display: flex; flex-wrap: nowrap;padding-bottom: 30px">
          <el-col :span="11">
            <el-table
              ref="filterTable"
              :data="stepTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 100%"
            >
              <el-table-column label="步数统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <span v-for="(item, index) in gameOptions" :key="index">
                      {{ (scope.row.gid == item.key ? item.label : "") }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="title"
                  label="类型"
                  width="120px"
                />

                <el-table-column
                  prop="cnt"
                  label="详情"
                >
                  <template slot-scope="scope">
                    <el-button @click="showStepDetail(scope.row)"> 查看</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="5">
                <div class="block">
                  <el-pagination
                    :current-page="stepClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="stepClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next"
                    :total="stepClientDB.GetPage().GetTotalCount()"
                    @size-change="stepHandleSizeChange"
                    @current-change="stepHandleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col
            v-if="queryGid === 150 || queryGid === 90 || queryGid === 156 || queryGid === 166 || queryGid == 196 || queryGid == 204"
            :span="13"
            :offset="1"
          >
            <el-table
              ref="filterTable"
              :data="jackpotTableData"
              stripe
              border
              :header-cell-style="libShow.DefaultTableHeadClass"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
              style="width: 700px"
            >
              <el-table-column label="Jackpot统计">
                <el-table-column
                  prop="gid"
                  label="游戏"
                  width="140px"
                >
                  <template slot-scope="scope">
                    <span v-for="(item, index) in gameOptions" :key="index">
                      {{ (scope.row.gid == item.key ? item.label : "") }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="app"
                  label="app"
                  width="70px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.app }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="bet"
                  label="下注值"
                  width="70px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.bet / 1000 }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="type"
                  label="Jackpot类型"
                >
                  <template slot-scope="scope">
                    {{ getJPLabel(scope.row.type) }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="fee"
                  label="收集金额"
                >
                  <template slot-scope="scope">
                    {{ scope.row.fee / 100000 }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="count"
                  label="发放次数"
                  width="90px"
                />

                <el-table-column
                  prop="winmoney"
                  label="发放金额"
                >
                  <template slot-scope="scope">
                    {{ scope.row.winmoney / 1000 }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="countpro"
                  label="发放概率"
                  width="110px"
                >
                  <template slot-scope="scope">
                    {{ (scope.row.countpro).toFixed(7) }}%
                  </template>
                </el-table-column>

                <el-table-column
                  prop="confgrant"
                  label="配置发放概率"
                  width="110px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.probability }}%
                  </template>
                </el-table-column>

                <el-table-column
                  prop="bet"
                  label="当前奖池金额"
                  width="120px"
                >
                  <template slot-scope="scope">
                    {{ scope.row.pool / 100000 }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="5">
                <div class="block">
                  <el-pagination
                    :current-page="jackpotClientDB.GetPage().GetCurrentPage()"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="jackpotClientDB.GetPage().GetPageNum()"
                    layout="total, sizes, prev, pager, next"
                    :total="jackpotClientDB.GetPage().GetTotalCount()"
                    @size-change="jackpotHandleSizeChange"
                    @current-change="jackpotHandleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-tab-pane>

      <el-tab-pane label="大奖监控" name="second">
        <el-row>
          <el-form :model="bigPrizeForm" label-width="80px" :inline="true" size="small">
            <el-form-item v-model="bigPrizeForm.gid" label="老虎机：" :required="true" label-width="80px">
              <el-select
                v-model="bigPrizeForm.gid"
                placeholder="请选择"
                filterable
                default-first-option
                size="mini"
                @change="changeBigPrizeGid()"
              >
                <el-option
                  v-for="row in gameOptions"
                  :key="row.key"
                  :label="row.label"
                  :value="row.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="日期：">
              <el-date-picker
                v-model="bigPrizeForm.date"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item v-model="bigPrizeForm.bet" label="下注金额：" :required="true" label-width="80px">
              <el-select
                v-model="bigPrizeForm.bet"
                default-first-option
                filterable
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="row in betOptions"
                  :key="row.key"
                  :label="row.label"
                  :value="row.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="getBigPrizeInfo">查询</el-button>
            </el-form-item>
          </el-form>

          <el-row>
            <el-col>
              <el-descriptions class="margin-top" title="" :column="1" border>
                <el-descriptions-item>
                  <template slot="label">
                    今天摇奖次数
                  </template>
                  {{ bigPrize.count }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    今天总中奖次数
                  </template>
                  {{ bigPrize.hit }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    今天中奖概率
                  </template>
                  {{ bigPrize.count === 0 ? 0 : ((bigPrize.hit / bigPrize.count * 100).toFixed(6) + "%") }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    今天发放金额
                  </template>
                  {{ bigPrize.money / 1000 }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    今天抽水金额
                  </template>
                  {{ bigPrize.tax / 1000 }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    奖池剩余金额
                  </template>
                  <span v-if="cfgMap[bigPrizeForm.gid] && cfgMap[bigPrizeForm.gid].JackpotShowBet">
                    {{ (bigPrize.pool_money / 1000 /parseInt(cfgMap[bigPrizeForm.gid].JackpotShowBet)).toFixed(2) }}
                  </span>
                  <span v-else>
                    {{ bigPrize.pool_money / 1000 }}
                  </span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    区间统计
                  </template>
                  <el-table
                    :data="bigPrize.sections_items"
                    stripe
                    border
                    :header-cell-style="libShow.DefaultTableHeadClass"
                    :row-style="{height:'10px'}"
                  >
                    <el-table-column
                      prop="odd_range"
                      label="倍数区间"
                      width="130px"
                    />
                    <el-table-column
                      prop="hit"
                      label="中奖次数"
                    />
                    <el-table-column
                      prop="count"
                      label="中奖概率"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.hit ? ((scope.row.hit / parseInt(bigPrize.hit) * 100).toFixed(2) + "%") : 0 }}
                      </template>
                    </el-table-column>

                    <el-table-column prop="odds" label="平均返奖倍数" width="130px">
                      <template slot-scope="scope">
                        {{ scope.row.odds ? ((scope.row.odds / parseInt(scope.row.hit)).toFixed(2)) : 0 }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-row>
      </el-tab-pane>

      <el-tab-pane v-loading="loading" label="当前剧本和步数" name="scripStep">
        <el-row>
          <el-form :model="scripStepForm" label-width="80px" :inline="true" size="small">
            <el-row>
              <el-form-item v-model="scripStepForm.gid" label="老虎机：" :required="true" label-width="80px">
                <el-select
                  v-model="scripStepForm.gid"
                  placeholder="请选择"
                  filterable
                  default-first-option
                  size="mini"
                  @change="changeGid(scripStepForm.gid)"
                >
                  <el-option
                    v-for="row in gameOptions"
                    :key="row.key"
                    :label="row.label"
                    :value="row.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-model="scripStepForm.bet" label="下注金额：" :required="true" label-width="120px">
                <el-select
                  v-model="scripStepForm.bet"
                  default-first-option
                  filterable
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="row in betOptions"
                    :key="row.key"
                    :label="row.label"
                    :value="row.key"
                  />
                </el-select>
                <el-form-item v-model="scripStepForm.planId" label="方案Id：" :required="true" label-width="120px">
                  <el-input v-model.number="scripStepForm.planId" />
                </el-form-item>
                <el-form-item v-model="scripStepForm.planVer" label="方案版本：" :required="true" label-width="120px">
                  <el-input v-model.number="scripStepForm.planVer" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="getSlotsScriptStep(0)">查询当前剧本和步数</el-button>
                </el-form-item>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item v-model="scripStepForm.counter" label="计数值：" :required="true" label-width="80px">
                <el-input v-model.number="scripStepForm.counter" />
              </el-form-item>
              <el-form-item v-model="scripStepForm.scriptId" label="剧本Id：" :required="true" label-width="80px">
                <el-input v-model.number="scripStepForm.scriptId" />
              </el-form-item>
              <el-form-item v-model="scripStepForm.step" label="步数：" :required="true" label-width="80px">
                <el-input v-model.number="scripStepForm.step" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="getSlotsScriptStep2(1)">查询当前剧本</el-button>
              </el-form-item>
            </el-row>

          </el-form>
          <el-tabs type="border-card">
            <table class="table table-border table-bordered table-bg table-striped" border="0" cellspacing="0" cellpadding="0" STYLE="width:100%;table-layout:fixed;">
              <thead>
                <th>
                  <template>
                    <span class="colStyle"> {{ '位置' }}</span>
                  </template>
                </th>
                <th v-for="(v,k) in 50" class="colStyle">
                  <template>
                    <span class="colStyle"> {{ k + 1 }}</span>
                  </template>
                </th>
              </thead>
              <tr v-for=" (v,k) in stepData" style="text-align: left">
                <td class="colStyle">{{ (k) * 50 + '' }}</td>
                <td v-for="(col,idx) in v" :style="getColColor(k,idx)">
                  <span v-if="col===0" class="colStyle"> 0 </span>
                  <span v-else class="colStyle" style="margin-left: -6px;color: #007017;font-weight: bold;">{{ col/ currentBaseBet }}</span>

                </td>
              </tr>
            </table>
          </el-tabs>
          <el-row />
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="任务统计" name="mission">
        <slotsMissionstatistics v-if="showMiss" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-if="detailVisible"
      title="剧本详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <el-row>
        <el-col :span="24">
          <el-tabs type="border-card">
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <th>
                  <template>
                    总次数：{{ timesSum }}
                  </template>
                </th>
                <th v-for="(v,k) in showData.column">
                  <template>
                    <span>{{ v }}</span>
                  </template>
                </th>
              </thead>
              <thead>
                <th>
                  <template>
                    概率：
                  </template>
                </th>
                <th v-for="(v,k) in showData.column">
                  <template>
                    <span style="font-size: 11px">{{ ((parseInt(v) / timesSum) * 100).toFixed(2) + '%' }}</span>
                  </template>
                </th>
              </thead>

              <thead>
                <th>
                  <template>
                    步数 / 剧本
                  </template>
                </th>
                <th v-for="(v,k) in showData.column">
                  <template>
                    <!--
                <span @click="showChart(idx, k1)">{{ k1 }}</span>
                -->
                    <span>{{ k }}</span>
                  </template>
                </th>
              </thead>
              <tr v-for=" (v,k) in showData.rows" style="text-align: center">
                <td>{{ k }}</td>
                <td v-for="col in v" style="text-align: center">
                  {{ col }}
                </td>
              </tr>
            </table>
          </el-tabs>
        </el-col>
        <!--
        <el-col :span="12">
          <el-row>
            <line-chart :chart-data="chartData" height="600px" />
          </el-row>
        </el-col>
        -->
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import request2 from '@/utils/request2'
import MoneyInput from '@/components/MoneyInput'
import { $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import XLSX from 'xlsx'
import { Message } from 'element-ui'
import slotsMissionstatistics from '@/views/online/components/slotsMissionStatistics.vue'

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput, slotsMissionstatistics },

  data() {
    return {
      form: {},
      bigPrizeForm: {
        gid: 82,
        date: new Date().getTime(), // 默认选中今天
        bet: 0
      },
      scripStepForm: {
        gid: 82,
        bet: 0,
        planId: 0,
        planVer: 0,
        counter: 0,
        scriptId: 0,
        step: 0
      },
      pickerOptions: {
        disabledDate(time) {
          const today = new Date()
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(today.getDate() - 6) // 从今天往前推6天，包括今天共7天
          return time.getTime() < sevenDaysAgo.getTime() || time.getTime() > today.getTime()
        }
      },
      betOptions: [],
      bigPrize: {
        count: 0,
        hit: 0,
        tax: 0,
        money: 0,
        pool_money: 0,
        sections_items: []
      },
      postData: {},
      gameScene: {},
      subKey: 'SlotsScriptStatisticsConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      tableData: [],
      scriptClientDB: { '全部': new ClientTableData([], 1, filterMap) },
      coordinateClientDB: new ClientTableData([], 1, filterMap),
      stepClientDB: new ClientTableData([], 1, filterMap),
      jackpotClientDB: new ClientTableData([], 1, filterMap),
      ordinaryReturnClientDB: { '全部': new ClientTableData([], 1, filterMap) },
      buyReturnClientDB: { '全部': new ClientTableData([], 1, filterMap) },
      buyRespinReturnClientDB: { '全部': new ClientTableData([], 1, filterMap) },
      has2JPClosClientDB: { '全部': new ClientTableData([], 1, filterMap) },
      showBtn: 0,
      libShow: $libShow,
      item: {
        Gid: 0,
        OddsList: [{ MinOdds: 0, MaxOdds: 0 }]
      },
      selectGameVisible: false,
      gameOptions: [],

      scriptTableData: [],
      coordinateTableData: [],
      stepTableData: [],
      jackpotTableData: [],
      OrdinaryReturnTableData: [],
      BuyReturnMoneyTableData: [],
      Has2JPColsBuyRespinTableData: [],

      queryTime: new Date().getTime(),
      loading: false,
      cfgMap: {},
      queryGid: 80,
      gidOptions: {},
      sumData: {},
      stepSum: {},
      coordinateSum: {},
      detailVisible: false,
      showData: {},
      mapCnt: {},
      timesSum: 0,

      Actions: {},
      ActionOdds: 1,
      scatterCounts: {},
      returnMap: {},
      buyReturnMap: {},
      buyRespinReturnMap: {},
      buyRespinTimeMap: {},
      buyRespinTotalBetMap: {},
      buyRespinFirstTimesMap: {},
      stepData: {},
      cacheStep: {},
      currentBaseBet: {},
      showMiss: false,
      betOddsKey: '全部',
      betOddsKeySelect: { '全部': '全部' }
    }
  },
  created() {
    this.getData()
    this.getGameList()
    this.getSlotsScriptStatistics()
    this.queryKeyInput()
  },
  methods: {
    refreshStep() {
      this.stepTableData = this.stepClientDB.GetCurrentPageData()
    },
    refreshScript() {
      if (this.betOddsKey in this.scriptClientDB) {
        this.scriptTableData = this.scriptClientDB[this.betOddsKey].GetCurrentPageData()
      } else {
        this.scriptTableData = []
      }
    },
    refreshCoordinate() {
      this.coordinateTableData = this.coordinateClientDB.GetCurrentPageData()
    },
    refreshJackpot() {
      this.jackpotTableData = this.jackpotClientDB.GetCurrentPageData()
    },
    refreshBuyReturn() {
      if (this.betOddsKey in this.buyReturnClientDB) {
        this.BuyReturnMoneyTableData = this.buyReturnClientDB[this.betOddsKey].GetCurrentPageData()
      } else {
        this.BuyReturnMoneyTableData = []
      }
    },
    refreshOrdinaryReturn() {
      if (this.betOddsKey in this.ordinaryReturnClientDB) {
        this.OrdinaryReturnTableData = this.ordinaryReturnClientDB[this.betOddsKey].GetCurrentPageData()
      } else {
        this.OrdinaryReturnTableData = []
      }
      console.log('OrdinaryReturnTableData', this.OrdinaryReturnTableData)
      console.log('OrdinaryReturnTableData Type', typeof this.OrdinaryReturnTableData)
    },
    refreshRespinReturn() {
      if (this.betOddsKey in this.has2JPClosClientDB) {
        this.Has2JPColsBuyRespinTableData = this.has2JPClosClientDB[this.betOddsKey].GetCurrentPageData()
      } else {
        this.Has2JPColsBuyRespinTableData = []
      }
      // console.log('Has2JPColsBuyRespinTableData', this.Has2JPColsBuyRespinTableData)
      // console.log('Has2JPColsBuyRespinTableData Type', typeof this.Has2JPColsBuyRespinTableData)
    },
    getTotalOrdinaryBetTimes() {
      let cnt = 0
      if (this.betOddsKey in this.ordinaryReturnClientDB) {
        for (const o of this.ordinaryReturnClientDB[this.betOddsKey].TotalData) {
          cnt += parseInt(o.times)
        }
      }
      return cnt
    },
    getTotalOrdinaryBet() {
      let cnt = 0
      if (this.betOddsKey in this.ordinaryReturnClientDB) {
        for (const o of this.ordinaryReturnClientDB[this.betOddsKey].TotalData) {
          cnt += parseInt(o.times * o.bet + '')
        }
      }
      return cnt
    },
    getTotalBuyOrdinaryBet() {
      let cnt = 0
      if (this.betOddsKey in this.buyReturnClientDB) {
        for (const o of this.buyReturnClientDB[this.betOddsKey].TotalData) {
          cnt += parseInt(o.times * o.bet + '')
        }
      }
      return cnt
    },
    getTotalBuyBetTimes() {
      let cnt = 0
      if (this.betOddsKey in this.buyReturnClientDB) {
        for (const o of this.buyReturnClientDB[this.betOddsKey].TotalData) {
          cnt += parseInt(o.times)
        }
      }
      return cnt
    },
    getBuyRespinBet(bet, multiOdds) {
      if (this.betOddsKey in this.buyRespinTotalBetMap) {
        if (bet in this.buyRespinTotalBetMap[this.betOddsKey]) {
          for (const o of this.buyRespinTotalBetMap[this.betOddsKey][bet])
            if (o.multiOdds === multiOdds) {
              return o.totalBet
            }
        }
      }
      return 0
    },
    getBuyRespinReturn(bet, multiOdds) {
      if (this.betOddsKey in this.buyRespinReturnMap) {
        if (bet in this.buyRespinReturnMap[this.betOddsKey]) {
          for (const o of this.buyRespinReturnMap[this.betOddsKey][bet]) {
            if (o.multiOdds === multiOdds) {
              return o.return
            }
          }
        }
      }
      return 0
    },
    getBuyRespinTimes(bet, multiOdds) {
      console.log('getBuyRespinTimes', bet, multiOdds, this.buyRespinTimeMap)
      if (this.betOddsKey in this.buyRespinTimeMap) {
        if (bet in this.buyRespinTimeMap[this.betOddsKey]) {
          for (const o of this.buyRespinTimeMap[this.betOddsKey][bet]) {
            if (o.multiOdds === multiOdds) {
              return o.times
            }
          }
        }
      }
      return 0
    },
    getBuyRespinFirstTimes(bet, multiOdds) {
      if (this.betOddsKey in this.buyRespinFirstTimesMap) {
        if (bet in this.buyRespinFirstTimesMap[this.betOddsKey]) {
          for (const o of this.buyRespinFirstTimesMap[this.betOddsKey][bet]) {
            if (o.multiOdds === multiOdds) {
              return o.times
            }
          }
        }
      }
      return 0
    },
    handleClick(tab, event) {
      if (parseInt(tab.index) === 0) {
        this.getSlotsScriptStatistics()
      }
      if (parseInt(tab.index) === 1) {
        this.queryBase(this.bigPrizeForm.gid)
      }
      if (parseInt(tab.index) === 2) {
        this.queryBase(this.scripStepForm.gid)
        // this.getSlotsScriptStep()
      }
      if (parseInt(tab.index) === 3) {
        this.showMiss = true
      }
    },
    newItem() {
      return this.item
    },
    getColColor(k, idx) {
      const number = (parseInt(this.scripStepForm.step / 50) - 1) * 50
      if (number === (k) * 50 && this.scripStepForm.step % 50 === 0 && number === (k) * 50 && idx === 49) {
        return 'background: #ff6868;word-break:keep-all;  white-space:nowrap; '
      }
      var number2 = parseInt(this.scripStepForm.step / 50) * 50
      if (number2 === (k) * 50) {
        if (idx + 1 === this.scripStepForm.step - number2) {
          return 'background: #ff6868;line-height: 90%;word-break:keep-all;  white-space:nowrap; '
        }
      }
      return 'width: 50px%;word-break:keep-all;  white-space:nowrap; '
    },
    newBigPrize() {
      this.bigPrize = {
        count: 0,
        hit: 0,
        tax: 0,
        money: 0,
        pool_money: 0,
        sections_items: []
      }
    },
    updateGid() {

    },
    addOne() {
      this.item = {
        Gid: 0
      }
      this.showBtn = 0
      this.selectGameVisible = true
    },
    getTitle(gid, idx) {
      const bet = this.cfgMap[gid].Bet || 0

      const max = parseInt(this.cfgMap[gid].OddsList[idx].MaxOdds) + parseInt(bet)
      const min = parseInt(this.cfgMap[gid].OddsList[idx].MinOdds) + parseInt(bet)
      if (idx === 0) {
        return '(' + '0 ,' + max + ']'
      }
      if (idx === this.cfgMap[gid].length - 1) {
        return '(' + min + '≥ ∞' + ']'
      }
      return '(' + min + ',' + max + ']'
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || []
          $this.postData = response.Data || []
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            for (const o of cfg) {
              this.cfgMap[o.Gid] = { OddsList: o.OddsList, Bet: o.Bet, JackpotShowBet: o.JackpotShowBet }
            }
          }
        }
      })
    },
    getGameName(gid) {
      for (const o of this.gameOptions) {
        if (o.key === parseInt(gid)) {
          return o.label
        }
      }
    },
    handleSizeChange(val) {
      if (this.betOddsKey in this.scriptClientDB) {
        this.scriptClientDB[this.betOddsKey].GetPage().SetPageNum(val)
      }
      this.refreshScript()
    },
    handleCurrentChange(val) {
      if (this.betOddsKey in this.scriptClientDB) {
        this.scriptClientDB[this.betOddsKey].GetPage().SetPageNo(val)
      }
      this.refreshScript()
    },
    coordinateHandleSizeChange(val) {
      this.coordinateClientDB.GetPage().SetPageNum(val)
      this.refreshCoordinate()
    },

    async queryKeyInput() {
      await this.queryRule(this.queryGid)

      // this.refreshScript()
      this.refreshCoordinate()
      this.refreshStep()
      this.refreshJackpot()
      // this.refreshBuyReturn()
      // this.refreshOrdinaryReturn()
      this.queryBase(this.queryGid)
      this.betOddsKeyInput()
    },
    async betOddsKeyInput() {
      this.refreshScript()
      // this.refreshCoordinate()
      // this.refreshStep()
      // this.refreshJackpot()
      this.refreshBuyReturn()
      this.refreshOrdinaryReturn()
      this.refreshRespinReturn()
    },
    changeBigPrizeGid() {
      this.queryBase(this.bigPrizeForm.gid)
    },
    changeGid(gid) {
      this.queryBase(gid)
    },
    coordinateHandleCurrentChange(val) {
      this.coordinateClientDB.GetPage().SetPageNo(val)
      this.refreshCoordinate()
    },
    stepHandleSizeChange(val) {
      this.coordinateClientDB.GetPage().SetPageNum(val)
      this.refreshCoordinate()
    },
    stepHandleCurrentChange(val) {
      this.stepClientDB.GetPage().SetPageNo(val)
      this.refreshStep()
    },
    jackpotHandleSizeChange(val) {
      this.jackpotClientDB.GetPage().SetPageNum(val)
      this.refreshJackpot()
    },
    jackpotHandleCurrentChange(val) {
      this.jackpotClientDB.GetPage().SetPageNo(val)
      this.refreshJackpot()
    },
    getSlotsScriptStatistics() {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/statistics',
          Env: store.getters.env,
          queryTime: parseInt(this.queryTime / 1000),
          gameID: this.queryGid
        }
      }).then(response => {
        // coordinate 返回数据格式，SlotsType_剧本_x_y
        // script 返回数据格式， slotsType, 配置index
        const coordinateTableData = []
        const scriptTableData = {}
        const stepTableData = []
        const jackpotTableData = []
        const scatterCounts = { '全部': [] }
        const ordinaryReturnMoneyTableData = {}
        const buyReturnMoneyTableData = {}
        const has2JpColsTableData = {}  // 出现2列JP的统计

        this.returnMap = {}
        this.buyReturnMap = {}
        this.stepSum = {}
        this.sumData = {}
        this.coordinateSum = {}
        this.buyRespinTimeMap = {}
        this.buyRespinTotalBetMap = {}
        this.buyRespinReturnMap = {}
        this.buyRespinFirstTimesMap = {}

        if (response.RetCode === 0) {
          const scriptMap = {}
          const jackpotMap = {}
          const betCountMap = {}
          for (const key in response.Data['script']) {
            var strings1 = key.split('_')
            if (strings1[0] === 'script') {
              if (strings1[1] === 'step') {
                // 步数统计
                // SlotsType_目标倍率_当前倍率_剧本_x_y
                let prefix = ''
                if (parseInt(strings1[2]) === -2) {
                  prefix = '指定正数'
                } else if (parseInt(strings1[2]) === -1) {
                  prefix = '指定负数'
                } else {
                  prefix = '常规' + (parseInt(strings1[2]) + 1)
                }
                if (!scriptMap[this.queryGid + '_' + prefix]) {
                  scriptMap[this.queryGid + '_' + prefix] = {
                    gid: this.queryGid,
                    rows: {},
                    column: {},
                    sheet: strings1[2]
                  }
                }
                const step = parseInt(strings1[4])
                $this.mapCnt[this.queryGid + '_' + strings1[2] + '_' + strings1[3] + '_' + step] = response.Data['script'][key]
                scriptMap[this.queryGid + '_' + prefix].rows[step] = []
                scriptMap[this.queryGid + '_' + prefix].column[strings1[3]] = response.Data['script']['script_times_' + strings1[2] + '_' + strings1[3]]
              } else if (strings1[1] === 'times') {
                //
              } else if (strings1[1] === 'count') {
                var strings = key.split('_')
                if (strings.length < 4) {
                  if (!(this.queryGid in this.sumData)) {
                    this.sumData[this.queryGid] = {}
                  }
                  this.sumData[this.queryGid]['全部'] = parseInt(response.Data['script'][key]) + (this.sumData[this.queryGid]['全部'] || 0)
                  if (!('全部' in scriptTableData)) {
                    scriptTableData['全部'] = []
                  }
                  scriptTableData['全部'].push({
                    gid: this.queryGid,
                    idx: strings[2],
                    cnt: response.Data['script'][key]
                  })
                } else {
                  if (!(this.queryGid in this.sumData)) {
                    this.sumData[this.queryGid] = {}
                  }
                  this.sumData[this.queryGid][strings[3]] = parseInt(response.Data['script'][key]) + (this.sumData[this.queryGid][strings[3]] || 0)
                  if (!(strings[3] in scriptTableData)) {
                    scriptTableData[strings[3]] = []
                  }
                  scriptTableData[strings[3]].push({
                    gid: this.queryGid,
                    idx: strings[2],
                    cnt: response.Data['script'][key]
                  })
                }
              } else {
                let prefix = ''
                if (parseInt(strings1[1]) === -2) {
                  prefix = '指定正数'
                } else if (parseInt(strings1[1]) === -1) {
                  prefix = '指定负数'
                } else {
                  prefix = '常规' + (parseInt(strings1[1]) + 1)
                }
                this.coordinateSum[this.queryGid] = parseInt(response.Data['script'][key]) + (this.coordinateSum[this.queryGid] || 0)
                coordinateTableData.push({
                  gid: this.queryGid,
                  type: prefix + '(' + strings1[2] + ',' + strings1[3] + ')',
                  sort: parseInt(strings1[1]),
                  cnt: response.Data['script'][key],
                  orgKey: strings1[1] + '_' + strings1[2]
                })
              }
            } else if (strings1[0] === 'jackpot') {
              if (strings1[5] === 'count') {
                betCountMap[strings1[2] + '_' + strings1[4]] = parseInt(response.Data['script'][key])
              } else {
                if (jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]] == null) {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]] = {
                    app: parseInt(strings1[2]),
                    bet: parseInt(strings1[4]),
                    fee: 0,
                    count: 0,
                    winmoney: 0,
                    probability: 0,
                    pool: 0
                  }
                }
                if (strings1[7] === 'fee') {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]].fee = parseInt(response.Data['script'][key])
                } else if (strings1[7] === 'count') {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]].count = parseInt(response.Data['script'][key])
                } else if (strings1[7] === 'winmoney') {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]].winmoney = parseInt(response.Data['script'][key])
                } else if (strings1[7] === 'pool') {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]].pool = parseInt(response.Data['script'][key])
                } else if (strings1[7] === 'probability') {
                  jackpotMap[strings1[2] + '_' + strings1[4] + '_' + strings1[6]].probability = parseFloat(response.Data['script'][key])
                }
              }
            } else if (strings1[0] === 'scatter') {
              if (strings1[1] === 'count') {
                if (strings1.length < 4) {
                  if (!('全部' in scatterCounts)) {
                    scatterCounts['全部'] = []
                  }
                  scatterCounts['全部'][parseInt(strings1[2])] = parseInt(response.Data['script'][key])
                } else {
                  if (!(strings1[3] in scatterCounts)) {
                    scatterCounts[strings1[3]] = []
                  }
                  scatterCounts[strings1[3]][parseInt(strings1[2])] = parseInt(response.Data['script'][key])
                }
              }
            } else if (strings1[0] === 'spin') {
              if (strings1[1] === 'ordinary') {
                if (strings1[2] === 'times') {
                  if (strings1.length < 6) {
                    if (!('全部' in ordinaryReturnMoneyTableData)) {
                      ordinaryReturnMoneyTableData['全部'] = []
                    }
                    ordinaryReturnMoneyTableData['全部'].push({ bet: parseInt(strings1[3]), times: response.Data['script'][key] })
                  } else {
                    if (!(strings1[4] in ordinaryReturnMoneyTableData)) {
                      ordinaryReturnMoneyTableData[strings1[4]] = []
                    }
                    ordinaryReturnMoneyTableData[strings1[4]].push({ bet: parseInt(strings1[3]), times: response.Data['script'][key] })
                  }
                }
                if (strings1[2] === 'return') {
                  if (strings1.length < 6) {
                    if (!('全部' in this.returnMap)) {
                      this.returnMap['全部'] = {}
                    }
                    this.returnMap['全部'][parseInt(strings1[3])] = parseInt(response.Data['script'][key])
                  } else {
                    if (!(strings1[4] in this.returnMap)) {
                      this.returnMap[strings1[4]] = {}
                    }
                    this.returnMap[strings1[4]][parseInt(strings1[3])] = parseInt(response.Data['script'][key])
                  }
                }
              }
              if (strings1[1] === 'buy') {
                if (strings1[2] === 'times') {
                  if (strings1.length < 6) {
                    if (!('全部' in buyReturnMoneyTableData)) {
                      buyReturnMoneyTableData['全部'] = []
                    }
                    buyReturnMoneyTableData['全部'].push({ bet: parseInt(strings1[3]), times: response.Data['script'][key] })
                  } else {
                    if (!(strings1[4] in buyReturnMoneyTableData)) {
                      buyReturnMoneyTableData[strings1[4]] = []
                    }
                    buyReturnMoneyTableData[strings1[4]].push({ bet: parseInt(strings1[3]), times: response.Data['script'][key] })
                  }
                }
                if (strings1[2] === 'return') {
                  if (strings1.length < 6) {
                    if (!('全部' in this.buyReturnMap)) {
                      this.buyReturnMap['全部'] = {}
                    }
                    this.buyReturnMap['全部'][parseInt(strings1[3])] = parseInt(response.Data['script'][key])
                  } else {
                    if (!(strings1[4] in this.buyReturnMap)) {
                      this.buyReturnMap[strings1[4]] = {}
                    }
                    this.buyReturnMap[strings1[4]][parseInt(strings1[3])] = parseInt(response.Data['script'][key])
                  }
                }
              }
              if (strings1[1] === '2coljp') {
                if (strings1.length === 6) {
                  if (!('全部' in has2JpColsTableData)) {
                    has2JpColsTableData['全部'] = []
                  }
                  const bet = parseInt(strings1[3])
                  const multiOdds = parseInt(strings1[4])
                  has2JpColsTableData['全部'].push({ multiOdds: multiOdds, bet: bet, times: parseInt(response.Data['script'][key]) })
                } else if (strings1.length === 7) {
                  const bet = parseInt(strings1[3])
                  const betOdds = parseInt(strings1[4])
                  const multiOdds = parseInt(strings1[5])
                  if (!(betOdds in has2JpColsTableData)) {
                    has2JpColsTableData[betOdds] = []
                  }
                  has2JpColsTableData[betOdds].push({ multiOdds: multiOdds, bet: bet, times: parseInt(response.Data['script'][key]) })
                }
              }
              if (strings1[1] === 'buyrespin') {
                if (strings1[2] === 'times') {
                  if (strings1.length === 6) {
                    if (!('全部' in this.buyRespinTimeMap)) {
                      this.buyRespinTimeMap['全部'] = {}
                    }
                    const bet = parseInt(strings1[3])
                    const multiOdds = parseInt(strings1[4])
                    if (!(multiOdds in this.buyRespinTimeMap['全部'])) {
                      this.buyRespinTimeMap['全部'][bet] = []
                    }
                    this.buyRespinTimeMap['全部'][bet].push({ multiOdds: multiOdds, times: parseInt(response.Data['script'][key]) })
                  } else if (strings1.length === 7) {
                    const bet = parseInt(strings1[3])
                    const betOdds = parseInt(strings1[4])
                    const multiOdds = parseInt(strings1[5])
                    if (!(betOdds in this.buyRespinTimeMap)) {
                      this.buyRespinTimeMap[betOdds] = {}
                    }
                    if (!(bet in this.buyRespinTimeMap[betOdds])) {
                      this.buyRespinTimeMap[betOdds][bet] = []
                    }
                    this.buyRespinTimeMap[betOdds][bet].push({ multiOdds: multiOdds, times: parseInt(response.Data['script'][key]) })
                  }
                }
                if (strings1[2] === 'return') {
                  if (strings1.length < 7) {
                    if (!('全部' in this.buyRespinReturnMap)) {
                      this.buyRespinReturnMap['全部'] = {}
                    }
                    const bet = parseInt(strings1[3])
                    const multiOdds = parseInt(strings1[4])
                    if (!(bet in this.buyRespinReturnMap['全部'])) {
                      this.buyRespinReturnMap['全部'][bet] = []
                    }
                    this.buyRespinReturnMap['全部'][bet].push({ multiOdds: multiOdds, return: parseInt(response.Data['script'][key])})
                  } else {
                    const bet = parseInt(strings1[3])
                    const betOdds = parseInt(strings1[4])
                    const multiOdds = parseInt(strings1[5])
                    if (!(betOdds in this.buyRespinReturnMap)) {
                      this.buyRespinReturnMap[betOdds] = {}
                    }
                    if (!(bet in this.buyRespinReturnMap[betOdds])) {
                      this.buyRespinReturnMap[betOdds][bet] = []
                    }
                    this.buyRespinReturnMap[betOdds][bet].push({ multiOdds: multiOdds, return: parseInt(response.Data['script'][key])})
                  }
                }
                if (strings1[2] === 'bet') {
                  if (strings1.length < 7) {
                    if (!('全部' in this.buyRespinTotalBetMap)) {
                      this.buyRespinTotalBetMap['全部'] = {}
                    }
                    const bet = parseInt(strings1[3])
                    const multiOdds = parseInt(strings1[4])
                    if (!(bet in this.buyRespinTotalBetMap['全部'])) {
                      this.buyRespinTotalBetMap['全部'][bet] = []
                    }
                    this.buyRespinTotalBetMap['全部'][bet].push({ multiOdds: multiOdds, totalBet: parseInt(response.Data['script'][key])})
                  } else {
                    const bet = parseInt(strings1[3])
                    const betOdds = parseInt(strings1[4])
                    const multiOdds = parseInt(strings1[5])
                    if (!(betOdds in this.buyRespinTotalBetMap)) {
                      this.buyRespinTotalBetMap[betOdds] = {}
                    }
                    if (!(bet in this.buyRespinTotalBetMap[betOdds])) {
                      this.buyRespinTotalBetMap[betOdds][bet] = []
                    }
                    this.buyRespinTotalBetMap[betOdds][bet].push({ multiOdds: multiOdds, totalBet: parseInt(response.Data['script'][key]) })
                  }
                }
              }
              if (strings1[1] === 'buyrespinfirst') {
                if (strings1[2] === 'times') {
                  if (strings1.length < 7) {
                    if (!('全部' in this.buyRespinFirstTimesMap)) {
                      this.buyRespinFirstTimesMap['全部'] = {}
                    }
                    const bet = parseInt(strings1[3])
                    const multiOdds = parseInt(strings1[4])
                    if (!(bet in this.buyRespinFirstTimesMap['全部'])) {
                      this.buyRespinFirstTimesMap['全部'][bet] = []
                    }
                    this.buyRespinFirstTimesMap['全部'][bet].push({ multiOdds: multiOdds, times: parseInt(response.Data['script'][key]) })
                  } else {
                    const bet = parseInt(strings1[3])
                    const betOdds = parseInt(strings1[4])
                    const multiOdds = parseInt(strings1[5])
                    if (!(betOdds in this.buyRespinFirstTimesMap)) {
                      this.buyRespinFirstTimesMap[betOdds] = {}
                    }
                    if (!(bet in this.buyRespinFirstTimesMap[betOdds])) {
                      this.buyRespinFirstTimesMap[betOdds][bet] = []
                    }
                    this.buyRespinFirstTimesMap[betOdds][bet].push({ multiOdds: multiOdds, times: parseInt(response.Data['script'][key]) })
                  }
                }
              }
            }
          }
          for (const key in scriptMap) {
            stepTableData.push({
              gid: scriptMap[key].gid,
              title: key.split('_')[1],
              rows: scriptMap[key].rows,
              column: scriptMap[key].column,
              cnt: scriptMap[key].cnt,
              sheet: scriptMap[key].sheet
            })
          }

          for (const key in jackpotMap) {
            jackpotTableData.push({
              gid: this.queryGid,
              app: jackpotMap[key].app,
              bet: jackpotMap[key].bet,
              type: parseInt(key.split('_')[2]),
              fee: jackpotMap[key].fee,
              count: jackpotMap[key].count,
              winmoney: jackpotMap[key].winmoney,
              countpro: jackpotMap[key].count / betCountMap[jackpotMap[key].app + '_' + jackpotMap[key].bet] * 100,
              probability: jackpotMap[key].probability,
              pool: jackpotMap[key].pool
            })
          }
        }
        coordinateTableData.sort(function(a, b) {
          return b.cnt - a.cnt
        })

        stepTableData.sort(function(a, b) {
          return b.cnt - a.cnt
        })

        for (const i in scriptTableData) {
          scriptTableData[i].sort(function(a, b) {
            return a.idx - b.idx
          })
        }

        jackpotTableData.sort(function(a, b) {
          if (a.app === b.app) {
            if (a.bet === b.bet) {
              return b.type - a.type
            }
            return a.bet - b.bet
          }
          return a.app - b.app
        })
        for (const i in ordinaryReturnMoneyTableData) {
          ordinaryReturnMoneyTableData[i].sort(function(a, b) {
            return a.bet - b.bet
          })
        }
        for (const i in buyReturnMoneyTableData) {
          buyReturnMoneyTableData[i].sort(function(a, b) {
            return a.bet - b.bet
          })
        }

        for (const i in has2JpColsTableData) {
          has2JpColsTableData[i].sort(function(a, b) {
            return a.bet - b.bet
          })
        }

        this.betOddsKeySelect = {}
        // this.scriptClientDB = new ClientTableData(scriptTableData, 20, filterMap, 'sort', -1)
        this.scriptClientDB = {}
        if (Object.keys(scriptTableData).length <= 2) {
          if ('全部' in scriptTableData) {
            this.scriptClientDB['全部'] = new ClientTableData(scriptTableData['全部'], 20, filterMap, 'sort', -1)
          } else {
            this.scriptClientDB['全部'] = new ClientTableData([], 1, filterMap)
          }
          this.betOddsKeySelect['全部'] = '全部'
        } else {
          for (const i in scriptTableData) {
            this.scriptClientDB[i] = new ClientTableData(scriptTableData[i], 20, filterMap, 'sort', -1)
            this.betOddsKeySelect[i] = i
          }
        }
        this.coordinateClientDB = new ClientTableData(coordinateTableData, 20, filterMap, 'idx', -1)
        this.stepClientDB = new ClientTableData(stepTableData, 20, filterMap, 'idx', -1)
        this.jackpotClientDB = new ClientTableData(jackpotTableData, 20, filterMap, 'idx', -1)
        this.ordinaryReturnClientDB = {}
        if (Object.keys(ordinaryReturnMoneyTableData).length <= 2) {
          if ('全部' in ordinaryReturnMoneyTableData) {
            this.ordinaryReturnClientDB['全部'] = new ClientTableData(ordinaryReturnMoneyTableData['全部'], 20, filterMap, 'idx', -1)
          } else {
            this.ordinaryReturnClientDB['全部'] = new ClientTableData([], 1, filterMap)
          }
          this.betOddsKeySelect['全部'] = '全部'
        } else {
          for (const i in ordinaryReturnMoneyTableData) {
            this.ordinaryReturnClientDB[i] = new ClientTableData(ordinaryReturnMoneyTableData[i], 20, filterMap, 'idx', -1)
            this.betOddsKeySelect[i] = i
          }
        }
        this.buyReturnClientDB = {}
        if (Object.keys(buyReturnMoneyTableData).length <= 2) {
          if ('全部' in buyReturnMoneyTableData) {
            this.buyReturnClientDB['全部'] = new ClientTableData(buyReturnMoneyTableData['全部'], 20, filterMap, 'idx', -1)
          } else {
            this.buyReturnClientDB['全部'] = new ClientTableData([], 1, filterMap)
          }
          this.betOddsKeySelect['全部'] = '全部'
        } else {
          for (const i in buyReturnMoneyTableData) {
            this.buyReturnClientDB[i] = new ClientTableData(buyReturnMoneyTableData[i], 20, filterMap, 'idx', -1)
            this.betOddsKeySelect[i] = i
          }
        }

        this.has2JPClosClientDB = {}
        if (Object.keys(has2JpColsTableData).length <= 2) {
          if ('全部' in has2JpColsTableData) {
            this.has2JPClosClientDB['全部'] = new ClientTableData(has2JpColsTableData['全部'], 20, filterMap, 'idx', -1)
          } else {
            this.has2JPClosClientDB['全部'] = new ClientTableData([], 1, filterMap)
          }
          this.betOddsKeySelect['全部'] = '全部'
        } else {
          for (const i in has2JpColsTableData) {
            this.has2JPClosClientDB[i] = new ClientTableData(has2JpColsTableData[i], 20, filterMap, 'idx', -1)
            this.betOddsKeySelect[i] = i
          }
        }

        if (!(this.betOddsKey in this.betOddsKeySelect)) {
          this.betOddsKey = '全部'
        }
        this.queryKeyInput()
        this.scatterCounts = scatterCounts
        $this.loading = false
      })
    },
    getBigPrizeInfo() { // 获取大奖数据
      console.log('getBigPrizeInfo')
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/big/prize/statistics',
          Env: store.getters.env,
          queryTime: parseInt(this.bigPrizeForm.date / 1000),
          gid: this.bigPrizeForm.gid,
          bet: this.bigPrizeForm.bet
        }
      }).then(response => {
        $this.newBigPrize()
        if (response.RetCode === 0) {
          $this.bigPrize.count = response.Data.script.count || 0
          $this.bigPrize.hit = response.Data.script.hit || 0
          $this.bigPrize.money = response.Data.script.money || 0
          $this.bigPrize.tax = response.Data.script.tax || 0
          $this.bigPrize.pool_money = response.Data.script.pool_money || 0
          $this.bigPrize.sections_items = response.Data.script.sections_items || 0
        }
        $this.loading = false
      }).catch(function() {
        $this.loading = false
      })
    },
    queryRule(gid) { // 加载规则配置
      if (this.gameScene[gid] === undefined || this.gameScene[gid] === 'undefined') {
        return
      }
      try {
        const realKey = { 150: 'supergemiii', 88: 'crazy777' }
        let key = this.gameScene[gid] + '_slots_rule'
        if (gid === 88 || gid === 150) {
          key = realKey[gid] + '_slots_rule'
        }
        request2({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: key
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.ruleForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const ruleCfg = JSON.parse(response.Data.Data)
              request2({
                url: '/slotsActConfigV2/one',
                method: 'get',
                data: { ID: ruleCfg.ActConfig.ActId, Env: 'test' }
              }, false).then(response => {
                this.Actions = {}
                if (response.RetCode === 0) {
                  for (const key in response.Data.Actions) {
                    for (const key2 in response.Data.Actions[key].rows) {
                      let count = 0
                      for (const o of response.Data.Actions[key].rows[key2].cols) {
                        count += o
                      }
                      const ScriptRow = parseInt(key2) + 1
                      this.Actions[key + '_' + ScriptRow] = count
                    }
                  }
                }
              })
            }
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    queryBase(gid) { // 加载基础配置
      if (this.gameScene[gid%100000] === undefined || this.gameScene[gid%100000] === 'undefined') {
        return
      }
      try {
        const realKey = {
          150: 'supergemiii',
          88: 'crazy777',
          76: 'candypartyway',
          152: 'aladdinlamp',
          86: 'supergemii',
          90: 'moneycoming',
          92: 'fortuneacego',
          168: 'pharaohtreasure',
          198: 'fortuneblessing',
          216: 'phoenix'
        }
        let key = this.gameScene[gid%100000] + '_slots_base'
        for (const k in realKey) {
          if (gid === parseInt(k)) {
            key = realKey[gid] + '_slots_base'
          }
        }

        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: key
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const baseCfg = JSON.parse(response.Data.Data)
            console.log('base>>>', baseCfg)
            if (baseCfg.BetList) {
              if (gid > 100000) {
                let arr = []
                for (const k in baseCfg.BetList) {
                  arr.push(baseCfg.BetList[k]*1.5)
                }
                this.handleSlotsBetOptions(arr, baseCfg.BaseBet)
              } else {
                this.handleSlotsBetOptions(baseCfg.BetList, baseCfg.BaseBet)
              }
              this.currentBaseBet = baseCfg.BaseBet
            }
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleSlotsBetOptions(betList, baseBet) {
      if (betList.length <= 0) {
        return
      }
      this.betOptions = []
      for (const i in betList) {
        this.betOptions.push({ 'key': betList[i], 'label': betList[i] * baseBet / 1000 })
        if (i === '0') {
          this.bigPrizeForm.bet = betList[i]
          this.scripStepForm.bet = betList[i]
        }
      }
      // console.log('betOptions: ', this.betOptions)
    },
    getSlotsActConfig(ActId) {

    },

    showStepDetail(data) {
      var row = JSON.parse(JSON.stringify(data))
      this.timesSum = 0
      for (const rowKey in row.rows) {
        for (const columnKey in row.column) {
          const key = row.gid + '_' + row.sheet + '_' + columnKey + '_' + rowKey
          row.rows[rowKey].push(this.mapCnt[key] || 0)
        }
      }

      for (const columnKey in row.column) {
        this.timesSum += parseInt(row.column[columnKey])
      }
      this.detailVisible = true
      this.showData = row
    },
    getSlotsScriptStep2(typ) {
      if (this.cacheStep.counter === this.scripStepForm.counter && this.cacheStep.scriptId === this.scripStepForm.scriptId) {
        this.cacheStep.step = this.scripStepForm.step
        // 刷新 this.stepData.
        this.stepData.splice(this.stepData.length, 0)
      } else {
        this.getSlotsScriptStep(typ)
      }
    },
    getSlotsScriptStep(typ) {
      const $this = this
      $this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/script/step',
          Env: store.getters.env,
          gid: this.scripStepForm.gid,
          bet: this.scripStepForm.bet,
          planId: this.scripStepForm.planId,
          planVer: this.scripStepForm.planVer,
          typ: typ,
          queryCounter: this.scripStepForm.counter,
          queryScriptId: this.scripStepForm.scriptId

        }
      }).then(response => {
        console.log(response)
        if (response.Data.script) {
          var groupArray = this.groupArray(response.Data.script, 50)
          console.log(groupArray)
          this.stepData = groupArray
        } else {
          this.stepData = {}
        }
        this.scripStepForm.counter = response.Data.counter
        this.scripStepForm.scriptId = response.Data.scriptId
        this.scripStepForm.step = response.Data.step
        this.cacheStep['counter'] = response.Data.counter
        this.cacheStep['scriptId'] = response.Data.scriptId
        this.cacheStep['step'] = response.Data.step
        $this.loading = false
      })
      $this.loading = false
    },
    groupArray(arr, groupSize = 50) {
      return arr.reduce((result, item, index) => {
        const groupIndex = Math.floor(index / groupSize)

        if (!result[groupIndex]) {
          result[groupIndex] = []
        }

        result[groupIndex].push(item)
        return result
      }, [])
    },
    exportExcel() {
      if (this.stepTableData.length <= 0) {
        Message.error('没有要导出的数据')
        return
      }

      const scriptMap = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13,
        14: 14,
        15: 15,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        20: 20
      }
      const stepMap = { 2: 5, 3: 10, 4: 15, 5: 20, 6: 25, 7: 30, 8: 35, 9: 40, 10: 45, 11: 50 }
      this.$confirm('是否确认导出当前游戏统计数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((response) => {
        const result = [['剧本', '剧本/步数', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50']]// 表格表头
        for (const key in this.stepTableData) {
          // 索引占位
          for (const scriptKey in scriptMap) {
            const dat = []
            dat.push(this.stepTableData[key].title)
            dat.push(scriptKey)
            for (const stepKey in stepMap) {
              if (stepKey === 0 || stepKey === 1) {
                continue
              }

              const keyStr = this.stepTableData[key].gid + '_' + this.stepTableData[key].sheet + '_' + scriptKey + '_' + stepMap[stepKey]
              dat[stepKey] = this.mapCnt[keyStr] || 0
            }
            result.push(dat)
          }
        }

        const workSheet = XLSX.utils.aoa_to_sheet(result)
        const bookNew = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(bookNew, workSheet, 'step') // 工作簿名称
        const name = this.getGameName(parseInt(this.stepTableData[0].gid)) + '_' + this.timestampToTime(this.queryTime) + '_step.xlsx'
        XLSX.writeFile(bookNew, name) // 保存的文件名
      })
    },
    timestampToTime(timestamp) {
      timestamp = timestamp || null
      const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      // let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      // let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D
    },

    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || (response.Data[i].Gid > 499 && response.Data[i].Gid != 1236)) {
              continue
            }

            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
            this.gameScene[response.Data[i].Gid] = response.Data[i].Scene
            this.gidOptions[response.Data[i].Gid] = response.Data[i].Gid
          }
          this.gameOptions.push({
            key: 100180,
            label: 'Fishing Master(额外加注)'
          })
        }
      })
    },
    getJPLabel(type) {
      if (type === null || type === undefined) {
        return null
      }
      switch (type) {
        case 4:
          return 'MINI'
        case 3:
          return 'MINOR'
        case 2:
          return 'MAJOR'
        case 1:
          return 'GRAND'
        default:
          return '无'
      }
    },
    getScatterCount(idx) {
      idx = parseInt(idx)
      if (typeof (this.scatterCounts[this.betOddsKey]) === 'undefined') {
        return 0
      }
      if (typeof (this.scatterCounts[this.betOddsKey][idx]) === 'undefined') {
        return 0
      } else {
        return this.scatterCounts[this.betOddsKey][idx]
      }
    },
    getScatterPercent(idx, totalCnt) {
      const scatterCnt = this.getScatterCount(idx)
      totalCnt = parseInt(totalCnt)
      if (totalCnt <= 0 || scatterCnt <= 0) {
        return '0%'
      } else {
        const percent = scatterCnt * 100 / totalCnt
        return percent.toFixed(2) + '%'
      }
    },
    getBetOddsName(betOdd) {
      if (betOdd === '全部') {
        return betOdd
      } else {
        if (betOdd === '1' || betOdd === '1000') {
          return '普通下注' + betOdd
        } else {
          return '额外下注' + betOdd
        }
      }
    }
  }
}
</script>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}

.table-bg thead th {
  background-color: #f5fafe;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}

.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}

.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.table th {
  font-weight: bold;
}

.colStyle {
  font-size: 11px;
  word-break:keep-all;
  white-space:nowrap;
}
</style>
