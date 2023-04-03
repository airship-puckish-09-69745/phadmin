<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="ZJHProTableConfig" :env-empty="true" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="IsPractice"
          label="练习场"
          width="70"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.IsPractice === 1" style="color:#ff0000;">是</span>
            <span v-else style="color:#999999;">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Level"
          label="Level"
          sortable="custom"
          width="100"
        />
        <el-table-column
          prop="Antes"
          label="前注"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.Antes) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CarryLower"
          label="携带"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.CarryLower }}/{{ scope.row.CarryUpper }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ObjectCount"
          label="桌子数"
          width="100"
        />
        <el-table-column
          prop="PoolMoneyMax"
          label="底池最大筹码"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.PoolMoneyMax) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="BetMoneyMax"
          label="玩家最大下注"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatNumber(scope.row.BetMoneyMax) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyUser"
          label="最后修改人"
          width="100"
        />
        <el-table-column
          prop="Status"
          label="状态"
          width="70"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.Status] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <el-button
              v-if="scope.row.Status==6"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >预上
            </el-button>
            <el-button
              v-if="scope.row.Status==7"
              size="mini"
              type="success"
              @click="handleOn(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="warning"
              @click="handlePreOff(scope.row)"
            >预下
            </el-button>
            <el-button
              v-if="scope.row.Status==6"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==8"
              size="mini"
              type="danger"
              @click="handleOffline(scope.row)"
            >下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
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
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="底注：" :required="true" prop="item.Antes">
              <el-select v-model="edit.item.Antes" placeholder="请选择" :disabled="edit.isEdit">
                <el-option label="0.1" :value="0.1" />
                <el-option label="0.3" :value="0.3" />
                <el-option label="0.5" :value="0.5" />
                <el-option label="1" :value="1" />
                <el-option label="3" :value="3" />
                <el-option label="5" :value="5" />
                <el-option label="10" :value="10" />
                <el-option label="20" :value="20" />
                <el-option label="50" :value="50" />
                <el-option label="100" :value="100" />
                <el-option label="200" :value="200" />
                <el-option label="400" :value="400" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="练习场：" :required="true">
              <el-radio-group v-model.number="edit.item.IsPractice">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="最小携带："
              :required="true"
              prop="item.CarryLower"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.CarryLower" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大携带(练习场初始资金)："
              :required="true"
              prop="item.CarryUpper"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.CarryUpper" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="抽水费率："
              :required="true"
              prop="item.FlowRate"
              :rules="dataRule(true,{type:'f',range:'0'})"
            >
              <el-input v-model="edit.item.FlowRate" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="抽3%，则填写0.03" placement="left-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col>
          <el-col :span="11">
            <game-level v-model="edit.item.Level" />
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="操作时长(秒)："
              :required="true"
              prop="item.ActionSeconds"
              :rules="dataRule(true,{type:'n',range:'5'})"
            >
              <el-input v-model.number="edit.item.ActionSeconds" placeholder="操作时长" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="桌子数量："
              :required="true"
              prop="item.ObjectCount"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.ObjectCount" placeholder="桌子数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="底池最大筹码数："
              :required="true"
              prop="item.PoolMoneyMax"
              :rules="dataRule(true,{type:'n',range:'10'})"
            >
              <el-input v-model.number="edit.item.PoolMoneyMax" placeholder="底池最大筹码数" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="玩家最大下注数："
              :required="true"
              prop="item.BetMoneyMax"
              :rules="dataRule(true,{type:'f',range:'1'})"
            >
              <el-input v-model="edit.item.BetMoneyMax" placeholder="玩家最大下注数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="玩家买入等待时长："
              :required="true"
              prop="item.PurchaseSecondMax"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PurchaseSecondMax" placeholder="玩家买入等待时长" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大围观局数："
              prop="item.WatchTimesMax"
              :rules="dataRule(true,{type:'n',range:'2'})"
            >
              <el-input v-model.number="edit.item.WatchTimesMax" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="默认胜率："
              :required="true"
              prop="item.DefaultWinRate"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.DefaultWinRate" placeholder="默认胜率" style="width:200px;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="在玩人数倍数："
              :required="true"
              prop="item.PlayingMul"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingMul" placeholder="在玩人数倍数" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="在玩人数最小随机数："
              :required="true"
              prop="item.PlayingRandMin"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingRandMin" placeholder="在玩人数最小随机数" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="在玩人数最大随机数："
              :required="true"
              prop="item.PlayingRandMax"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input v-model.number="edit.item.PlayingRandMax" placeholder="在玩人数最大随机数" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="真人场配牌概率：" :required="true">
              <el-input v-model.number="edit.item.PresetCardsRate" placeholder="万分比" style="width:200px;">
                <template slot="append">‱</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="真人场给机器人换牌概率：" :required="true">
              <el-input v-model.number="edit.item.SwapRobotCardsRate" placeholder="万分比" style="width:200px;">
                <template slot="append">‱</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item
              label="幸运级别最大值(0不限制)："
              :required="true"
              prop="item.LuckyLevelLimitMax"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.LuckyLevelLimitMax" placeholder="0即不限制" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="幸运级别限制生效最低资产(0不限制)："
              :required="true"
              prop="item.LuckyLevelLimitMoney"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="edit.item.LuckyLevelLimitMoney" placeholder="0即不限制" />
            </el-form-item>
          </el-col>
        </el-row>

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

        <el-row>
          <el-col :span="11">
            <el-form-item label="免费用户贫困线(&lt;)：" :required="true" prop="item.FreeUserPoorLine" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.FreeUserPoorLine" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="免费用户富裕线(&gt;=)：" :required="true" prop="item.FreeUserRichLine" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.FreeUserRichLine" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="免费且贫困配大牌概率：" :required="true" prop="item.PoorFreeUserPresetRate" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.PoorFreeUserPresetRate" placeholder="万分比" style="width:200px;">
                <template slot="append">‱</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="免费且富裕配冤家牌概率：" :required="true" prop="item.RichFreeUserPresetRate" :rules="dataRule(true,{type:'n',range:'0'})">
              <el-input v-model.number="edit.item.RichFreeUserPresetRate" placeholder="万分比" style="width:200px;">
                <template slot="append">‱</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

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
            <el-col :span="9">
              <money-input v-model="edit.item.SinglePay" label="单次充值大于等于" label-width="150px" :is-require="true"/>
            </el-col>
            <el-col :span="2">
              <el-tooltip class="item" effect="dark" content="配置成0也会生效" placement="right-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
            <el-col :span="9">
              <money-input v-model="edit.item.TotalPay" label="总充值大于等于" label-width="150px" :is-require="true"/>
            </el-col>
            <el-col :span="2">
              <el-tooltip class="item" effect="dark" content="配置成0也会生效" placement="right-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="进入该场次后隐藏场次：" prop="item.Antes">
                <el-select v-model="edit.item.HideLevel" placeholder="请选择">
                  <el-option label="无" :value="0" />
                  <el-option label="0.1" :value="100" />
                  <el-option label="0.3" :value="300" />
                  <el-option label="0.5" :value="500" />
                  <el-option label="1" :value="1000" />
                  <el-option label="3" :value="3000" />
                  <el-option label="5" :value="5000" />
                  <el-option label="10" :value="10000" />
                  <el-option label="20" :value="20000" />
                  <el-option label="50" :value="50000" />
                  <el-option label="100" :value="100000" />
                  <el-option label="200" :value="200000" />
                  <el-option label="400" :value="400000" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>

        <!-- 机器人相关配置 start -->
        <fieldset>
          <legend>机器人配置</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="携带金额最小值："
                label-width="200px"
                prop="robotSetting.RobotCarryMoneyStart"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotCarryMoneyStart" placeholder="携带金额最小值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="携带金额最大值："
                label-width="200px"
                prop="robotSetting.RobotCarryMoneyEnd"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotCarryMoneyEnd" placeholder="携带金额最大值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="最大玩牌次数下限值："
                label-width="200px"
                prop="robotSetting.RobotMaxPlayTimesStart"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxPlayTimesStart" placeholder="最大玩牌次数下限值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="最大玩牌次数上限值："
                label-width="200px"
                prop="robotSetting.RobotMaxPlayTimesEnd"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxPlayTimesEnd" placeholder="最大玩牌次数上限值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="最大赢牌次数下限值："
                label-width="200px"
                prop="robotSetting.RobotMaxWinTimesStart"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxWinTimesStart" placeholder="最大赢牌次数下限值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="最大赢牌次数上限值："
                label-width="200px"
                prop="robotSetting.RobotMaxWinTimesEnd"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxWinTimesEnd" placeholder="最大赢牌次数上限值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="最大输牌次数下限值："
                label-width="200px"
                prop="robotSetting.RobotMaxLoseTimesStart"
                :rules="dataRule(true,{type:'n',range:'1'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxLoseTimesStart" placeholder="最大输牌次数下限值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="最大输牌次数上限值："
                label-width="200px"
                prop="robotSetting.RobotMaxLoseTimesEnd"
                :rules="dataRule(true,{type:'n',range:'1'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxLoseTimesEnd" placeholder="最大输牌次数上限值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="最大赢得金额下限值："
                label-width="200px"
                prop="robotSetting.RobotMaxWinMoneyStart"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxWinMoneyStart" placeholder="最大赢得金额下限值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="最大赢得金额上限值："
                label-width="200px"
                prop="robotSetting.RobotMaxWinMoneyEnd"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxWinMoneyEnd" placeholder="最大赢得金额上限值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="最大输掉金额下限值："
                label-width="200px"
                prop="robotSetting.RobotMaxLoseMoneyStart"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxLoseMoneyStart" placeholder="最大输掉金额下限值" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="最大输掉金额上限值："
                label-width="200px"
                prop="robotSetting.RobotMaxLoseMoneyEnd"
                :rules="dataRule(true,{type:'n',range:'0'})"
              >
                <el-input v-model.number="edit.robotSetting.RobotMaxLoseMoneyEnd" placeholder="最大输掉金额上限值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="真人场进桌加1机器人概率："
                label-width="200px"
                prop="robotSetting.Create1RobotPercents"
                :rules="dataRule(true,{type:'n',range:'0-100'})"
              >
                <el-input v-model.number="edit.robotSetting.Create1RobotPercents" placeholder="百分比">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="真人场进桌加2机器人概率："
                label-width="200px"
                prop="robotSetting.Create2RobotPercents"
                :rules="dataRule(true,{type:'n',range:'0-100'})"
              >
                <el-input v-model.number="edit.robotSetting.Create2RobotPercents" placeholder="百分比">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="真人场进桌加3机器人概率："
                label-width="200px"
                prop="robotSetting.Create3RobotPercents"
                :rules="dataRule(true,{type:'n',range:'0-100'})"
              >
                <el-input v-model.number="edit.robotSetting.Create3RobotPercents" placeholder="百分比">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="真人场每局加新机器人概率："
                label-width="200px"
                prop="robotSetting.AppendRobotPercents"
                :rules="dataRule(true,{type:'n',range:'0-100'})"
              >
                <el-input v-model.number="edit.robotSetting.AppendRobotPercents" placeholder="百分比">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <!-- 机器人相关配置 end -->
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

function NewRobotSetting() {
  return {
    RobotCarryMoneyStart: 0,
    RobotCarryMoneyEnd: 0,
    RobotMaxPlayTimesStart: 0,
    RobotMaxPlayTimesEnd: 0,
    RobotMaxWinTimesStart: 0,
    RobotMaxWinTimesEnd: 0,
    RobotMaxLoseTimesStart: 0,
    RobotMaxLoseTimesEnd: 0,
    RobotMaxWinMoneyStart: 0,
    RobotMaxWinMoneyEnd: 0,
    RobotMaxLoseMoneyStart: 0,
    RobotMaxLoseMoneyEnd: 0
  }
}

function newItem() {
  return {
    CarryLower: '',
    CarryUpper: '',
    Antes: '',
    MaxPlayerCount: 5,
    ObjectCount: '',
    FlowRate: '',
    ActionSeconds: '',
    PoolMoneyMax: '',
    BetMoneyMax: '',
    PurchaseSecondMax: '',
    WatchTimesMax: '',
    IsPractice: 0,
    Level: 1,
    RobotSetting: '',
    PlayingMul: 0,
    PlayingRandMin: 0,
    PlayingRandMax: 0,
    DefaultWinRate: 50,
    LuckyLevelLimitMax: 0,
    LuckyLevelLimitMoney: 0,
    GoodsId: 0,
    FirstGoodsId: 0,
    BankruptGoodsId: 0,
    AlterRobotCardsRate: 0,
    TotalRecharge: 0,
    MaxPayAmount: 0,
    RecommendGid: 0,
    RecommendBankruptGid: 0,
    PresetCardsRate: 0,
    SwapRobotCardsRate: 0,
    FreeUserPoorLine: 0,
    FreeUserRichLine: 0,
    PoorFreeUserPresetRate: 0,
    RichFreeUserPresetRate: 0,
    SinglePay: 0,
    TotalPay: 0,
    HideLevel: 0
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
      libMoney: new MoneyShow(['CarryLower', 'CarryUpper', 'Antes', 'PoolMoneyMax', 'BetMoneyMax', 'LuckyLevelLimitMoney', 'TotalRecharge', 'MaxPayAmount', 'FreeUserPoorLine', 'FreeUserRichLine']),
      libMoneyRobot: new MoneyShow([' RobotCarryMoneyStart', 'RobotCarryMoneyEnd', 'RobotMaxWinMoneyStart', 'RobotMaxWinMoneyEnd', 'RobotMaxLoseMoneyStart', 'RobotMaxLoseMoneyEnd']),

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false,
        robotSetting: NewRobotSetting()
      },

      AttrNames: {
        CarryLower: '最小携带',
        CarryUpper: '最大携带',
        Antes: '底注',
        MaxPlayerCount: 5,
        ObjectCount: '桌子数',
        FlowRate: '抽水率',
        ActionSeconds: '操作时间',
        PoolMoneyMax: '底池最大筹码',
        BetMoneyMax: '玩家最大下注',
        PurchaseSecondMax: '购买等待时长',
        WatchTimesMax: '最大围观局数',
        IsPractice: '是否练习场',
        DefaultWinRate: '默认胜率',
        LuckyLevelLimitMax: '限制幸运级别最大值',
        LuckyLevelLimitMoney: '限制幸福级别的最低资产',
        GoodsId: '金币不足推荐商品',
        FirstGoodsId: '金币不足推荐首充商品',
        BankruptGoodsId: '破产推荐商品',
        TotalRecharge: '总充值',
        MaxPayAmount: '单次最大充值额度',
        RecommendGid: '满足充值条件金币不足推荐商品',
        RecommendBankruptGid: '满足充值条件破产推荐商品',
        Level: '等级',
        SinglePay: '单次充值大于',
        TotalPay: '总充值大于',
        HideLevel: '进入该场次后隐藏场次',
        AlterRobotCardsRate: '真实玩家弃牌后修改机器人手牌概率',
        PresetCardsRate: '真人场配牌概率(万分比)',
        SwapRobotCardsRate: '真人场给机器人换牌概率(万分比)',
        FreeUserPoorLine: '免费贫困用户调控线',
        FreeUserRichLine: '免费富裕用户调控线',
        PoorFreeUserPresetRate: '免费且贫困用户配大牌概率(万分比)',
        RichFreeUserPresetRate: '免费且富裕用户配冤家牌概率(万分比)',
        'RobotSetting.RobotCarryMoneyStart': '机器人最小携带',
        'RobotSetting.RobotCarryMoneyEnd': '机器人最大携带',
        'RobotSetting.RobotMaxPlayTimesStart': '机器人玩牌次数下限',
        'RobotSetting.RobotMaxPlayTimesEnd': '机器人玩牌次数上限',
        'RobotSetting.RobotMaxWinTimesStart': '机器人最大赢次数下限',
        'RobotSetting.RobotMaxWinTimesEnd': '机器人最大赢次数上限',
        'RobotSetting.RobotMaxLoseTimesStart': '机器人最大输次数上限',
        'RobotSetting.RobotMaxLoseTimesEnd': '机器人最大输次数下限',
        'RobotSetting.RobotMaxWinMoneyStart': '机器人最大赢金额上限',
        'RobotSetting.RobotMaxWinMoneyEnd': '机器人最大赢金额下限',
        'RobotSetting.RobotMaxLoseMoneyStart': '机器人最大输金额上限',
        'RobotSetting.RobotMaxLoseMoneyEnd': '机器人最大输金额下限',
        types: {
          RobotSetting: 'jsonString'
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
        url: '/zjhprotable/all',
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
      let goodsCheck = false
      for (const i in this.clientDB.TotalData) {
        // 除了练习场，其它场次必须配置推荐商品
        if (this.clientDB.TotalData[i].Status === 2 && this.clientDB.TotalData[i].IsPractice === 0 && this.clientDB.TotalData[i].GoodsId <= 0) {
          goodsCheck = true
        }
      }
      if (goodsCheck) {
        this.$alert('除了练习场，其它场次必须配置金币不足推荐商品')
        return false
      }
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
          url: '/zjhprotable/update/status',
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
            this.edit.robotSetting = this.libMoneyRobot.TransForShow(JSON.parse(_data.RobotSetting))
          } catch (e) {
            this.edit.robotSetting = NewRobotSetting()
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
        url: '/zjhprotable/create',
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
        url: '/zjhprotable/update',
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
        this.edit.robotSetting.RobotCarryMoneyStart > this.edit.robotSetting.RobotCarryMoneyEnd ||
        this.edit.robotSetting.RobotMaxLoseMoneyStart > this.edit.robotSetting.RobotMaxLoseMoneyEnd ||
        this.edit.robotSetting.RobotMaxLoseTimesStart > this.edit.robotSetting.RobotMaxLoseTimesEnd ||
        this.edit.robotSetting.RobotMaxPlayTimesStart > this.edit.robotSetting.RobotMaxPlayTimesEnd ||
        this.edit.robotSetting.RobotMaxWinMoneyStart > this.edit.robotSetting.RobotMaxWinMoneyEnd ||
        this.edit.robotSetting.RobotMaxWinTimesStart > this.edit.robotSetting.RobotMaxWinTimesEnd) {
        Message.warning('下限不能大于上限，请检查数值正确性！')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      this.edit.item.RobotSetting = JSON.stringify(this.libMoneyRobot.TransForStore(this.edit.robotSetting))
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
