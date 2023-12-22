<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="TexasTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row>
      <el-col :span="22" style="color:#BB0000;">
        <p><strong>注意事项：</strong></p>
        <p>1，底注不可直接修改，需要新添加新的场次配置，再去掉旧的场次配置；</p>
        <p>2，新加的场次需要保持在预上状态，重启游戏服务后才能上架；要去掉的场次需要先改为预下状态，延迟半天之后再下架；</p>
        <p>3，配置项【最大人数、桌子数量、是否练习场】修改后，需要重启游戏服务才能生效。</p>
      </el-col>
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" @sort-change="sortChange">
        <el-table-column prop="ID" label="ID" sortable="custom" width="70" />
        <el-table-column prop="IsPractice" label="练习场" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="Level" label="Level" sortable="custom" width="100" />
        <el-table-column prop="SmallBlind" label="小盲" sortable="custom" width="100">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.SmallBlind) }}
          </template>
        </el-table-column>
        <el-table-column prop="CarryLower" label="携带" width="200">
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column prop="ObjectCount" label="桌子数" width="100" />
        <el-table-column prop="FlowRate" label="抽成比例" width="150">
          <template slot-scope="scope">
            {{ scope.row.FlowRate*100 }}
          </template>
        </el-table-column>
        <el-table-column prop="NeedAnte" label="强制前注" width="150">
          <template slot-scope="scope">
            {{ scope.row.NeedAnte ? '是' : '否' }}
          </template>
        </el-table-column>

        <el-table-column prop="LastModify" label="最近修改" width="150">
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column prop="ModifyUser" label="最后修改人" width="100" />
        <el-table-column prop="Status" label="状态" width="70">
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCopy(scope.row)">复制</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" type="success" @click="handlePreOn(scope.row)">预上</el-button>
            <el-button v-if="scope.row.Status==7" size="mini" type="success" @click="handleOn(scope.row)">上架</el-button>
            <el-button v-if="scope.row.Status==2" size="mini" type="warning" @click="handlePreOff(scope.row)">预下</el-button>
            <el-button v-if="scope.row.Status==6" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.Status==8" size="mini" type="danger" @click="handleOffline(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[10, 20, 30, 40]" :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="小盲：" :required="true" prop="item.SmallBlind">
              <el-select v-model="edit.item.SmallBlind" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="0.1" :value="0.1" />
                <el-option label="1" :value="1" />
                <el-option label="2.5" :value="2.5" />
                <el-option label="5" :value="5" />
                <el-option label="10" :value="10" />
                <el-option label="25" :value="25" />
                <el-option label="50" :value="50" />
                <el-option label="100" :value="100" />
                <el-option label="250" :value="250" />
                <el-option label="500" :value="500" />
                <el-option label="1000" :value="1000" />
                <el-option label="2500" :value="2500" />
                <el-option label="5000" :value="5000" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大玩牌人数：" :required="true">
              <el-input v-model.number="edit.item.MaxPlayerCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item label="服务费：" :required="true">
              <el-input v-model.number="edit.item.ServiceFee" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="强制前注：" :required="true">
              <el-radio-group v-model.number="edit.item.NeedAnte">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="最小携带：" :required="true" prop="item.CarryLower" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大携带(练习场初始资金)：" :required="true" prop="item.CarryUpper" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="桌子数量：" :required="true" prop="item.ObjectCount" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.ObjectCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="操作时长(秒)" :required="true" prop="item.ActionSeconds" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="抽水费率：" :required="true" prop="item.FlowRate" :rules="dataRule(true,{type:'f',range:'0'})">
              <el-input v-model="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽3%，则填写0.03" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <!--          <el-col :span="11">
            <el-form-item label="抽水最少大盲倍数：" :required="true" prop="item.FlowLower" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model="edit.item.FlowLower" placeholder="请输入" />
            </el-form-item>
          </el-col>-->
        </el-row>
        <!--
        <el-row>
          <el-col :span="11">
            <game-level v-model="edit.item.Level" />
          </el-col>
          <el-col :span="11">
            <el-form-item label="VIP场：" :required="true">
              <el-radio-group v-model.number="edit.item.IsVIP">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="最大旁观局数：" :required="true" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model="edit.item.WatchTimesMax" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自动买入比例(%)：" :required="true" prop="item.AutoBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.AutoBuyRatio" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="11">
            <el-form-item label="是否练习场：" :required="true">
              <el-radio-group v-model.number="edit.item.IsPractice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          -->
        </el-row>
        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item label="默认胜率：" :required="true" prop="item.DefaultWinRate" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.DefaultWinRate" placeholder="默认胜率" style="width:200px;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="在玩人数倍数：" :required="true" prop="item.PlayingMul" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PlayingMul" placeholder="在玩人数倍数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="在玩人数最小随机数：" :required="true" prop="item.PlayingRandMin" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PlayingRandMin" placeholder="在玩人数最小随机数" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="在玩人数最大随机数：" :required="true" prop="item.PlayingRandMax" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PlayingRandMax" placeholder="在玩人数最大随机数" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <el-row>
          <!--
          <el-col :span="11">
            <el-form-item label="玩家买入等待时长：" :required="true" prop="item.PurchaseSecondMax" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.PurchaseSecondMax" placeholder="玩家买入等待时长" />
            </el-form-item>
          </el-col>
          -->
          <el-col :span="11">
            <el-form-item label="最大围观局数：" prop="item.WatchTimesMax" :rules="dataRule(true,{type:'n',range:'2'})">
              <el-input v-model.number="edit.item.WatchTimesMax" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="推荐买入倍数(大盲)：" :required="true" prop="item.RecommendBuyRatio" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RecommendBuyRatio" placeholder="进房间推荐买入多少倍大盲" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最小玩牌金额："
              :required="true"
              prop="item.MinPlayMoney"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model="edit.item.MinPlayMoney" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <!--
        <el-row>
          <el-col :span="11">
            <el-form-item label="幸运级别最大值(0不限制)：" :required="true" prop="item.LuckyLevelLimitMax" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.LuckyLevelLimitMax" placeholder="0即不限制" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="幸运级别限制生效最低资产(0不限制)：" :required="true" prop="item.LuckyLevelLimitMoney" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.LuckyLevelLimitMoney" placeholder="0即不限制" />
            </el-form-item>
          </el-col>
        </el-row>

        <fieldset>
          <legend>默认推荐商品</legend>
          <el-row>
            <el-col :span="11">
              <select-goods v-model="edit.item.GoodsId" :type="1" title="金币不足推荐商品" />
            </el-col>
            <el-col :span="11">
              <select-goods v-model="edit.item.FirstGoodsId" :type="2" title="金币不足推荐首充商品" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <select-goods v-model="edit.item.BankruptGoodsId" :type="1" title="破产推荐商品" />
            </el-col>
          </el-row>
        </fieldset>

        <fieldset>
          <legend>满足充值条件推荐商品</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="总充值大于等于：">
                <el-input v-model.number="edit.item.TotalRecharge" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="单次充值金额大于等于：">
                <el-input v-model.number="edit.item.MaxPayAmount" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <select-goods v-model="edit.item.RecommendGid" :type="1" title="金币不足推荐商品" />
            </el-col>
            <el-col :span="11">
              <select-goods v-model="edit.item.RecommendBankruptGid" :type="1" title="破产推荐商品" />
            </el-col>
          </el-row>
        </fieldset>

        <fieldset>
          <legend>场次隐藏配置</legend>
          <el-row>
            <el-col :span="11">
              <money-input v-model="edit.item.SinglePay" label="单次充值大于等于" label-width="150px" :is-require="true"/>
            </el-col>
            <el-col :span="11">
              <money-input v-model="edit.item.TotalPay" label="总充值大于等于" label-width="150px" :is-require="true"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="进入该场次后隐藏场次：" :required="true" prop="item.SmallBlind">
                <el-select v-model="edit.item.HideLevel" placeholder="请选择">
                  <el-option label="无" :value="0" />
                  <el-option label="0.1" :value="100" />
                  <el-option label="0.3" :value="300" />
                  <el-option label="0.5" :value="500" />
                  <el-option label="1" :value="1000" />
                  <el-option label="3" :value="3000" />
                  <el-option label="10" :value="10000" />
                  <el-option label="20" :value="20000" />
                  <el-option label="50" :value="50000" />
                  <el-option label="200" :value="200000" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        -->
        <!-- Jackpot配置 start -->
        <!--
        <fieldset>
          <legend>Jackpot配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="职业场：" :required="true">
                <el-radio-group v-model.number="edit.item.IsPro">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="台费入池率：" label-width="200px" prop="JackpotRate" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.JackpotRate" placeholder="百分比" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="输家分成比例：" label-width="200px" prop="JPRateLoser" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.JPRateLoser" placeholder="百分比" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="赢家分成比例：" label-width="200px" prop="JPRateWinners" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.JPRateWinners" placeholder="百分比" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="同桌其他玩家分成比例：" label-width="200px" prop="JPRateTablePlayers" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.JPRateTablePlayers" placeholder="百分比" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="别桌玩家分成比例：" label-width="200px" prop="JPRateOtherPlayers" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.item.JPRateOtherPlayers" placeholder="百分比" />
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        -->
        <!-- Jackpot配置 end -->

        <!-- 陪玩机器人配置 start -->
        <!--
        <fieldset>
          <legend>中低场陪玩机器人配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人数量上限：" required="true" prop="RobotNumMax">
                <el-input v-model.number="edit.RandomRobotSetting.RobotNumMax" placeholder="机器人数量上限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="加机器人的人数下限：" prop="RobotTriggerMin" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotTriggerMin" placeholder="加机器人的人数下限"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="加机器人的人数上限：" prop="RobotTriggerMax" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotTriggerMax" placeholder="加机器人的人数上限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人最少玩牌局数：" prop="RobotPlayMin" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotPlayMin" placeholder="机器人最少玩牌局数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机器人最多玩牌局数：" prop="RobotPlayMax" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotPlayMax" placeholder="机器人最多玩牌局数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人最少资产：" prop="RobotMoneyMin" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotMoneyMin" placeholder="机器人最少资产"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机器人最多资产：" prop="RobotMoneyMax" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.RandomRobotSetting.RobotMoneyMax" placeholder="机器人最多资产"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人上线时间：" required="true" prop="RobotStartTimeStr">
                <el-time-select v-model="edit.RandomRobotSetting.RobotStartTimeStr" :picker-options="{start: '00:00', end: '23:59', step: '00:01'}" placeholder="选择时间" style="width:120px;"></el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机器人下线时间：" required="true" prop="RobotEndTimeStr">
                <el-time-select v-model="edit.RandomRobotSetting.RobotEndTimeStr" :picker-options="{start: '00:00', end: '23:59', step: '00:01'}" placeholder="选择时间" style="width:120px;"></el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        -->
        <!-- 机器人相关配置 end -->

        <!-- 高级场开场机器人配置 start -->
        <!--
        <fieldset>
          <legend>高级场开场机器人配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人桌子人数限制列表：" prop="RobotTablePlayers">
                  <el-input v-model="edit.ResidentRobotSetting.RobotTablePlayers" placeholder="使用英文逗号间隔"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="机器人携带系数下限：" prop="RobotMoneyRatioMin" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.ResidentRobotSetting.RobotMoneyRatioMin" placeholder="最小携带的倍数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机器人携带系数上限：" prop="RobotMoneyRatioMax" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input v-model.number="edit.ResidentRobotSetting.RobotMoneyRatioMax" placeholder="最小携带的倍数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        -->
        <!-- 高级场开场机器人配置 end -->

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import SelectGoods from '@/components/SelectGoods'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function NewRandomRobotSetting() {
  return {
    RobotNumMax: 0,
    RobotTriggerMin: 0,
    RobotTriggerMax: 0,
    RobotPlayMin: 0,
    RobotPlayMax: 0,
    RobotMoneyMin: 0,
    RobotMoneyMax: 0,
    RobotStartTime: 0,
    RobotEndTime: 0
  }
}

function NewResidentRobotSetting() {
  return {
    RobotMoneyRatioMin: 0,
    RobotMoneyRatioMax: 0,
    RobotTablePlayers: ''
  }
}

function newItem() {
  return {
    CarryLower: '',
    CarryUpper: '',
    SmallBlind: '',
    ServiceFee: 0,
    MaxPlayerCount: 9,
    NeedAnte: 0,
    IsVip: 0,
    ObjectCount: 200,
    FlowRate: 0,
    FlowLower: 0, // 改成默认0。 https://www.tapd.cn/48971248/prong/stories/view/1148971248001003193
    ActionSeconds: 15,
    IsPro: 0,
    PurchaseSecondsMax: 180,
    WatchTimesMax: 3,
    Level: 0,
    IsPractice: 0,
    DefaultWinRate: 40,
    PlayingMul: 0,
    PlayingRandMin: 0,
    PlayingRandMax: 0,
    LuckyLevelLimitMax: 0,
    LuckyLevelLimitMoney: 0,
    GoodsId: 0,
    FirstGoodsId: 0,
    BankruptGoodsId: 0,
    TotalRecharge: 0,
    MaxPayAmount: 0,
    RecommendGid: 0,
    RecommendBankruptGid: 0,
    SinglePay: 0,
    TotalPay: 0,
    HideLevel: 0,
    AutoBuyRatio: 0,
    RecommendBuyRatio: 0,
    MinPlayMoney: 0
  }
}

export default {
  components: { Compare, Publish, SelectGoods, GameLevel, MoneyInput },
  data() {
    return {
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'SmallBlind', 'ServiceFee', 'LuckyLevelLimitMoney', 'totalRecharge', 'maxPayAmount', 'SinglePay', 'TotalPay', 'MinPlayMoney']),
      libMoneyRobot: new MoneyShow(['RobotMoneyMin', 'RobotMoneyMax']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        RandomRobotSetting: NewRandomRobotSetting(),
        ResidentRobotSetting: NewResidentRobotSetting()
      },

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        SmallBlind: '小盲',
        ServiceFee: '服务费',
        MaxPlayerCount: '最大玩牌人数',
        NeedAnte: '强制前注',
        IsVip: 'VIP场',
        ObjectCount: '桌子数',
        FlowRate: '抽水率',
        FlowLower: '最低抽水大盲倍数',
        ActionSeconds: '操作时间',
        IsPro: '职业场',
        PurchaseSecondMax: '购买等待时长',
        WatchTimesMax: '最大围观局数',
        Level: '等级',
        IsPractice: '是否练习场',
        DefaultWinRate: '默认胜率',
        PlayingMul: '在玩人数倍数',
        PlayingRandMin: '在玩人数最小随机数',
        PlayingRandMax: '在玩人数最大随机数',
        LuckyLevelLimitMax: '限制幸运级别最大值',
        LuckyLevelLimitMoney: '限制幸福级别的最低资产',
        GoodsId: '金币不足推荐商品',
        FirstGoodsId: '金币不足推荐首充商品',
        BankruptGoodsId: '破产推荐商品',
        TotalRecharge: '总充值',
        MaxPayAmount: '单次最大充值额度',
        RecommendGid: '满足充值条件金币不足推荐商品',
        RecommendBankruptGid: '满足充值条件破产推荐商品',
        SinglePay: '单次充值大于',
        TotalPay: '总充值大于',
        HideLevel: '进入该场次后隐藏场次',
        AutoBuyRatio: '自动买入比例',
        RecommendBuyRatio: '推荐买入倍数(大盲)',
        MinPlayMoney: '最小玩牌金额',
        'RandomRobotSetting.RobotNumMax': '陪玩机器人数量上限',
        'RandomRobotSetting.RobotTriggerMin': '陪玩机器人的触发人数下限',
        'RandomRobotSetting.RobotTriggerMax': '陪玩机器人的触发人数上限',
        'RandomRobotSetting.RobotPlayMin': '陪玩机器人最小局数',
        'RandomRobotSetting.RobotPlayMax': '陪玩机器人最大局数',
        'RandomRobotSetting.RobotMoneyMin': '陪玩机器人最少资产',
        'RandomRobotSetting.RobotMoneyMax': '陪玩机器人最多资产',
        'RandomRobotSetting.RobotStartTime': '陪玩机器人开始时间',
        'RandomRobotSetting.RobotEndTime': '陪玩机器人结束时间',
        'ResidentRobotSetting.RobotMoneyRatioMin': '开场机器人携带系数下限',
        'ResidentRobotSetting.RobotMoneyRatioMax': '开场机器人携带系数上限',
        'ResidentRobotSetting.RobotTablePlayers': '开场机器人桌子人数限制列表',
        types: {
          RandomRobotSetting: 'jsonString',
          ResidentRobotSetting: 'jsonString'
        }
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
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

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/texastable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(this.libMoney.TransForShow(objs), 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    configCheck() {
      let count = 0
      let goodsCheck = false
      for (const i in this.clientDB.TotalData) {
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 1) {
          count++
        }
        // 除了练习场，其它场次必须配置推荐商品
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 0 && this.clientDB.TotalData[i].GoodsId <= 0) {
          goodsCheck = true
        }
      }
      if (goodsCheck) {
        this.$alert('除了练习场，其它场次必须配置金币不足推荐商品')
        return false
      }
      /*
      if (count !== 1) {
        this.$alert('发布的配置项中，必须有且仅有一个练习场配置')
        return false
      }
      */
      return true
    },
    handlePreOn(ob) {
      this.changeStatus(ob.ID, 7, '您确定要将记录状态修改为"预备上架"吗？该记录将在发布后同步到外网。')
    },
    handleOn(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handlePreOff(ob) {
      this.changeStatus(ob.ID, 8, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/texastable/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            $this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          try {
            this.edit.RandomRobotSetting = this.libMoneyRobot.TransForShow(JSON.parse(_data.RandomRobotSetting))
            this.edit.ResidentRobotSetting = JSON.parse(_data.ResidentRobotSetting)
          } catch (e) {
            this.edit.RandomRobotSetting = NewRandomRobotSetting()
            this.edit.ResidentRobotSetting = NewResidentRobotSetting()
          }
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/texastable/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.ID = response.Data.ID
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'texastable/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      const postData = this.libMoney.TransForStore(this.edit.item)
      return postData
    },
    checkData() {
      if (this.edit.item.CarryLower > this.edit.item.CarryUpper ||
        this.edit.RandomRobotSetting.RobotTriggerMin > this.edit.RandomRobotSetting.RobotTriggerMax ||
        this.edit.RandomRobotSetting.RobotPlayMin > this.edit.RandomRobotSetting.RobotPlayMax ||
        this.edit.RandomRobotSetting.RobotMoneyMin > this.edit.RandomRobotSetting.RobotMoneyMax ||
        this.edit.RandomRobotSetting.RobotMaxPlayTimesStart > this.edit.RandomRobotSetting.RobotMaxPlayTimesEnd ||
        this.edit.ResidentRobotSetting.RobotMoneyRatioMin > this.edit.ResidentRobotSetting.RobotMoneyRatioMax) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      if (this.edit.item.MinPlayMoney > this.edit.item.CarryLower) {
        Message.error('【最小玩牌金额】必须小于等于【最小携带】，请检查数值正确性！')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      this.edit.item.RandomRobotSetting = JSON.stringify(this.libMoneyRobot.TransForStore(this.edit.RandomRobotSetting))
      this.edit.item.ResidentRobotSetting = JSON.stringify(this.edit.ResidentRobotSetting)
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    }
  }
}
</script>
