<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="searchForm.date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="玩法：">
          <el-select v-model="searchForm.gameId" placeholder="请选择" filterable default-first-option @change="changeLevelConfig">
            <el-option
              v-for="item in gameConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="奖池类型：">
          <el-select v-model="searchForm.poolType" placeholder="请选择">
            <el-option
              v-for="item in poolConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型：">
          <el-select v-model="searchForm.actType" placeholder="请选择">
            <el-option
              v-for="item in typeConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="应用APP：">
          <el-select v-model="searchForm.app" placeholder="请选择">
            <el-option
              v-for="item in appConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="场次类型：">
          <el-select v-model="searchForm.level" placeholder="请选择">
            <el-option
              v-for="item in levelConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-form-item label="玩家id：">
            <el-input v-model="searchForm.uid" size="mini" />
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询流水</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="showInfo">奖池信息</el-button>
        </el-form-item>
        <el-form-item v-if="searchForm.gameId==119">
          <el-button type="success" size="mini" @click="showItemInfo">实物信息</el-button>
        </el-form-item>
      </el-form>
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
    >
      <el-table-column
        prop="Id"
        label="ID"
        width="100"
      />
      <el-table-column
        prop="GameId"
        label="玩法"
      >
        <template slot-scope="{row}">
          {{ getGameName(row.GameId) }}
        </template>
      </el-table-column>
      <!--<el-table-column
        v-if="searchForm.gameId==90"
        prop="Level"
        label="奖池level"
      >
        <template slot-scope="{row}">
         {{ row.Level }}
        </template>
      </el-table-column>-->
      <el-table-column
        v-if="envProjectName=='ph'"
        prop="PoolType"
        label="奖池类型"
      >
        <template slot-scope="{row}">
          {{ getPoolTypeName(row.PoolType) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="envProjectName=='ph'"
        prop="ActType"
        label="操作类型"
      >
        <template slot-scope="{row}">
          {{ getTypeName(row.ActType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ChangeNum"
        label="变化数量"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.ChangeNum) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="EndNum"
        label="操作后奖池数量"
      >

        <template slot-scope="{row}">
          <div v-if="envProjectName=='ph'">
            {{ toRupee(row.EndNum) }}
          </div>
          <div v-if="envProjectName=='ph_audit'">
            {{ toRupee(row.PoolMoney) }}
          </div>
        </template>

      </el-table-column>
      <el-table-column
        prop="UpdateTime"
        label="操作时间"
      >
        <template slot-scope="{row}">
          {{ formatTime(row.UpdateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      v-if="(searchForm.gameId === 150 || searchForm.gameId === 156 || searchForm.gameId === 166|| searchForm.gameId === 174 || searchForm.gameId === 196 || searchForm.gameId === 204 ||
        searchForm.gameId === 210 || searchForm.gameId === 216) && searchForm.level === 0"
      title="奖池信息"
      :modal="false"
      :visible.sync="prizeVisible"
    >

      <!-- 表格显示奖池信息 -->
      <el-table :data="prizeInfo" style="width: 100%; margin-top: 10px;">
        <!-- 场次类型列 -->
        <el-table-column label="场次类型">
          <template slot-scope="scope">
            {{ getLevelLabel(scope.row.Level) }}
          </template>
        </el-table-column>

        <!-- 用户奖池列 -->
        <el-table-column label="用户奖池">
          <template slot-scope="scope">
            {{ toRupee(scope.row.UserPool) }}
          </template>
        </el-table-column>

        <!-- 展示奖池列 -->
        <el-table-column v-if="envProjectName === 'ph'" label="展示奖池">
          <template slot-scope="scope">
            {{ toRupee(scope.row.ShowPool) }}
          </template>
        </el-table-column>

        <!-- 最后更新时间列 -->
        <el-table-column label="最后更新时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.UpdateTime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      v-else-if="searchForm.gameId === 90 && searchForm.level === 0"
      title="奖池信息"
      :modal="false"
      :visible.sync="prizeVisible"
    >

      <!-- 表格显示奖池信息 -->
      <el-table :data="prizeInfo" style="width: 100%; margin-top: 10px;">
        <!-- 场次类型列 -->
        <el-table-column label="场次类型">
          <template slot-scope="scope">
            {{ getLevelLabel(scope.row.Level) }}
          </template>
        </el-table-column>

        <!-- 用户奖池列 -->
        <el-table-column label="用户奖池">
          <template slot-scope="scope">
            {{ toRupee(scope.row.UserPool) }}
          </template>
        </el-table-column>

        <!-- 展示奖池列 -->
        <el-table-column v-if="envProjectName === 'ph'" label="展示奖池1">
          <template slot-scope="scope">
            {{ toRupee(scope.row.ShowPool) }}
          </template>
        </el-table-column>

        <!-- 最后更新时间列 -->
        <el-table-column label="最后更新时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.UpdateTime) }}
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="prizeForm" style="margin-top: 10px;">
        <el-form-item label="手动修改玩家奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeNum" size="mini" />
          </el-col>
          <el-col :span="4" style="margin-left: 10px;">
            <el-select v-model="prizeForm.Level" placeholder="请选择" @change="changeLevelConfig">
              <el-option
                v-for="item in fCLevelConfig"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(false)">保存</el-button>
          </el-col>

        </el-form-item>
        <el-form-item label="手动修改展示奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeRobotNum" size="mini" />
          </el-col>
          <el-col :span="4" style="margin-left: 10px;">
            <el-select v-model="prizeForm.Level" placeholder="请选择" @change="changeLevelConfig">
              <el-option
                v-for="item in fCLevelConfig"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(true)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item />
      </el-form>
    </el-dialog>

    <el-dialog
      v-else-if="searchForm.gameId === 134"
      title="奖池信息"
      :modal="false"
      :visible.sync="prizeVisible"
    >
      <el-descriptions title="">
        <el-descriptions-item label="用户奖池(Grand+Major)">{{ toRupee(prizeInfo.UserPool) }}</el-descriptions-item>
        <el-descriptions-item label="用户Grand奖池">{{ toRupee(prizeInfo.GrandUserPool) }}</el-descriptions-item>
        <el-descriptions-item label="用户Major奖池">{{ toRupee(prizeInfo.MajorUserPool) }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="展示奖池(Grand+Major)">{{ toRupee(prizeInfo.ShowPool) }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="展示Grand奖池">{{ toRupee(prizeInfo.GrandShowPool) }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="展示Major奖池">{{ toRupee(prizeInfo.MajorShowPool) }}</el-descriptions-item>
        <el-descriptions-item label="最后更新时间">{{ formatTime(prizeInfo.UpdateTime) }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="prizeForm">
        <el-form-item label="手动修改玩家Grand奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.GrandChangeNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePusoyJPPrizePool(false, 1);changePrizePool(false)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="手动修改玩家Major奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.MajorChangeNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePusoyJPPrizePool(false, 2);changePrizePool(false)">保存</el-button>
          </el-col>
        </el-form-item>

        <el-form-item label="手动修改展示Grand奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.GrandChangeRobotNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePusoyJPPrizePool(true, 1);changePrizePool(true)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="手动修改展示Major奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.MajorChangeRobotNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePusoyJPPrizePool(true, 2);changePrizePool(true)">保存</el-button>
          </el-col>
        </el-form-item>

        <el-form-item />
      </el-form>
    </el-dialog>

    <el-dialog
      v-else
      title="奖池信息"
      :modal="false"
      :visible.sync="prizeVisible"
    >
      <el-descriptions title="">
        <el-descriptions-item label="用户奖池">{{ toRupee(prizeInfo.UserPool) }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="展示奖池">{{ toRupee(prizeInfo.ShowPool) }}</el-descriptions-item>
        <el-descriptions-item label="最后更新时间">{{ formatTime(prizeInfo.UpdateTime) }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="prizeForm">
        <el-form-item label="手动修改玩家奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(false)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="手动修改展示奖池数量：">
          <el-col :span="8">
            <el-input v-model="prizeForm.ChangeRobotNum" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(true)">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item />
      </el-form>
    </el-dialog>

    <el-dialog
      title="实物发奖信息"
      :modal="false"
      :visible.sync="itemProgressVisible"
    >
      <el-descriptions title="">
        <el-descriptions-item label="进度">{{ itemProgressInfo.Progress }}</el-descriptions-item>
        <el-descriptions-item v-if="envProjectName=='ph'" label="实物领奖数">{{ itemProgressInfo.AwardNum }}</el-descriptions-item>
        <el-descriptions-item label="上一次发满奖时间">{{ itemProgressInfo.AwardFullTimeStr }}</el-descriptions-item>
        <el-descriptions-item label="上一次数据重置时间">{{ itemProgressInfo.ClearTimeStr }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="itemForm">
        <el-form-item label="---------修改进度：">
          <el-col :span="8">
            <el-input v-model="itemForm.progressChange" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="修改实物领奖数：">
          <el-col :span="8">
            <el-input v-model="itemForm.AwardChange" size="mini" />
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changeItemPool()">保存</el-button>
          </el-col>
        </el-form-item>
        <el-form-item />
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  name: 'RocketRet',
  data() {
    return {
      submap: { 90: 'moneycoming_slots_base', 150: 'supergemiii_slots_base', 166: 'firelink_slots_base', 174: 'treasurebowl_slots_base', 196: 'goldminer_slots_base', 204: 'spacetreasure_slots_base',
        210: 'luckyspirits_slots_base', 216: 'phoenix_slots_base' },
      searchForm: {
        date: $libDate.GetDayBegin(new Date().getTime()),
        gameId: 25,
        poolType: 0,
        actType: 0,
        app: 0,
        level: 0,
        uid: 0
      },
      gameConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 25, 'label': 'color game' },
        { 'value': 20, 'label': 'Mines - 扫雷' },
        { 'value': 100, 'label': 'Tower' },
        // { 'value': 101, 'label': 'Sicbo' },
        { 'value': 102, 'label': 'Hilo' },
        { 'value': 103, 'label': 'Windrop' },
        { 'value': 119, 'label': 'Windropc积分' },
        { 'value': 106, 'label': '金猪' },
        { 'value': 108, 'label': 'DropBall' },
        { 'value': 110, 'label': 'VideoPoker' },
        { 'value': 115, 'label': 'MultiPlayer NiuNiu' },
        { 'value': 150, 'label': 'SuperGemIII' },
        { 'value': 90, 'label': 'FortuneComing' },
        { 'value': 118, 'label': 'CarRacing' },
        { 'value': 124, 'label': 'JackpotWheel' },
        { 'value': 125, 'label': 'FreeSpin' },
        { 'value': 156, 'label': 'CrazyAce' },
        { 'value': 166, 'label': 'FireLink' },
        { 'value': 174, 'label': 'TreasureBowl' },
        { 'value': 186, 'label': 'MahjongJackpot' },
        { 'value': 196, 'label': 'GoldMiner' },
        { 'value': 204, 'label': 'SpaceTreasure' },
        { 'value': 128, 'label': 'Tongits JP' },
        { 'value': 129, 'label': 'Live Color' },
        { 'value': 132, 'label': '新版扫雷' },
        { 'value': 210, 'label': 'LuckySpirits' },
        { 'value': 216, 'label': 'Phoenix' },
        { 'value': 134, 'label': 'Pusoy JP' },
      ],
      appConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '1000002' },
        { 'value': 1000005, 'label': '1000005' }
      ],
      levelConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '普通场次' }
      ],
      poolConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '玩家奖池' },
        { 'value': 2, 'label': '展示奖池' }
      ],
      typeConfig: [
        { 'value': 0, 'label': '全部' },
        { 'value': 1, 'label': '牌局增加' },
        { 'value': 2, 'label': 'jackpot返奖' },
        { 'value': 3, 'label': '后台调整用户奖池' },
        { 'value': 4, 'label': '后台调整展示奖池' }
      ],
      fCLevelConfig: [
        { 'value': 5002, 'label': '下注额5中奖200倍' },
        { 'value': 10002, 'label': '下注额10中奖200倍' },
        { 'value': 50002, 'label': '下注额50中奖200倍' },
        { 'value': 50005, 'label': '下注额50中奖500倍' },
        { 'value': 50010, 'label': '下注额50中奖1000倍' },
        { 'value': 100002, 'label': '下注额100中奖200倍' },
        { 'value': 100005, 'label': '下注额100中奖500倍' },
        { 'value': 100010, 'label': '下注额100中奖1000倍' }
      ],
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      prizeVisible: false,
      prizeInfo: {
        UserPool: 0,
        ShowPool: 0,
        UpdateTime: 0,
        GrandUserPool: 0,
        GrandShowPool: 0,
        MajorUserPool: 0,
        MajorShowPool: 0,
      },
      itemProgressVisible: false,
      itemProgressInfo: {
        Progress: 0,
        AwardNum: 0,
        ClearTimeStr: '',
        AwardFullTimeStr: ''
      },
      envProjectName: process.env.VUE_APP_PROJECT,
      prizeForm: {
        ChangeNum: 0,
        ChangeRobotNum: 0,
        
        GrandChangeNum: 0,
        MajorChangeNum: 0,
        GrandChangeRobotNum: 0,
        MajorChangeRobotNum: 0,
      },
      itemForm: {
        progressChange: 0,
        AwardChange: 0
      }
    }
  },
  created() {
    console.log('======', process.env.VUE_APP_PROJECT_NAME)
    if (process.env.VUE_APP_PROJECT_NAME === 'Zoo-线上环境') {
      this.appConfig = [
        { 'value': 0, 'label': '全部' },
        { 'value': 1000002, 'label': '1000002' },
        { 'value': 1000007, 'label': 'zoo测试帐号' },
        { 'value': 1000009, 'label': 'zoo 正式帐号' },
        { 'value': 1000023, 'label': 'whisper正式' },
        { 'value': 1000030, 'label': 'idgames 测试帐号' },
        { 'value': 1000031, 'label': 'idgames 正式' }
      ]
      this.searchForm.gameId = 106
    }
  },
  methods: {
    search() {
      const _this = this
      // const loading = this.$loading({
      //     lock: true,
      //     text: '数据拉取中，请稍候...',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      // })
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/log',
          Uid: _this.searchForm.uid,
          PoolType: _this.searchForm.poolType,
          ActType: _this.searchForm.actType,
          Time: this.searchForm.date / 1000,
          GameId: _this.searchForm.gameId,
          Page: _this.currentPage,
          Limit: _this.pageNum,
          App: _this.searchForm.app,
          Level: _this.searchForm.level,
          SearchType: _this.searchForm.searchType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            // loading.close()
            return
          }
          if (objs.total > 0) {
            _this.totalCount = objs.total
            _this.tableData = objs.list
          } else {
            _this.totalCount = 0
            _this.tableData = []
          }
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
    },
    changeLevelConfig() {
      this.searchForm.level = 0
      if (this.searchForm.gameId === 103) {
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 2, 'label': 'EXPERT' },
          { 'value': 1, 'label': 'HIGH' }]
      } else if (this.searchForm.gameId === 119) {
        this.levelConfig = [
          { 'value': 1, 'label': 'HIGH' }
        ]
      } else if (this.searchForm.gameId === 106) {
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 1, 'label': 'grand' },
          { 'value': 2, 'label': 'major' },
          { 'value': 3, 'label': 'minor' }
        ]
      } else if (this.searchForm.gameId === 90) {
        // 调用 getData() 获取 BetList 数组
        this.getData().then(cfg => {
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]

          if (cfg && cfg.BetList && cfg.BetList.length > 0) {
            const betConfig = cfg.BetList.map(bet => {
              if (bet === 10) {
                return []
              }
              const baseBetFactor = bet / 1000 * cfg.BaseBet
              if (bet === 50 || bet === 100) {
                return [
                  { 'value': baseBetFactor * 1000 + 2, 'label': ['下注额', bet / 10, '中将200倍'].join('') }
                ]
              }
              return [
                { 'value': baseBetFactor * 1000 + 2, 'label': ['下注额', bet / 10, '中将200倍'].join('') },
                { 'value': baseBetFactor * 1000 + 5, 'label': ['下注额', bet / 10, '中将500倍'].join('') },
                { 'value': baseBetFactor * 1000 + 10, 'label': ['下注额', bet / 10, '中将1000倍'].join('') }
              ]
            }).flat()

            this.levelConfig = this.levelConfig.concat(betConfig)
          }
        }).catch(error => {
          console.error('Error processing BetList:', error)
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]
        })
      } else if (this.searchForm.gameId === 150 || this.searchForm.gameId === 166 || this.searchForm.gameId === 196 || this.searchForm.gameId === 204 || this.searchForm.gameId === 210 ||
        this.searchForm.gameId === 216) {
        // 调用 getData() 获取 BetList 数组
        this.getData().then(cfg => {
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]
          if (cfg && cfg.BetList && cfg.BetList.length > 0) {
            const betConfig = cfg.BetList.map(bet => {
              const baseBetFactor = bet / 1000 * cfg.BaseBet
              return [
                { 'value': bet * 10 + 4, 'label': 'MINI-' + baseBetFactor },
                { 'value': bet * 10 + 3, 'label': 'MINOR-' + baseBetFactor },
                { 'value': bet * 10 + 2, 'label': 'MAJOR-' + baseBetFactor },
                { 'value': bet * 10 + 1, 'label': 'GRAND-' + baseBetFactor }
              ]
            }).flat()

            this.levelConfig = this.levelConfig.concat(betConfig)
          }
        }).catch(error => {
          console.error('Error processing BetList:', error)
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]
        })
      } else if (this.searchForm.gameId === 174) {
        // 调用 getData() 获取 BetList 数组
        this.getData().then(cfg => {
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]
          if (cfg && cfg.BetList && cfg.BetList.length > 0) {
            const betConfig = cfg.BetList.map(bet => {
              const baseBetFactor = bet / 1000 * cfg.BaseBet
              return [
                { 'value': bet * 10 + 3, 'label': 'GRAND-' + baseBetFactor },
                { 'value': bet * 10 + 2, 'label': 'MEGA-' + baseBetFactor },
                { 'value': bet * 10 + 1, 'label': 'MAJOR-' + baseBetFactor }
              ]
            }).flat()

            this.levelConfig = this.levelConfig.concat(betConfig)
          }
        }).catch(error => {
          console.error('Error processing BetList:', error)
          this.levelConfig = [{ 'value': 0, 'label': '全部' }]
        })
      } else if (this.searchForm.gameId === 156) {
        // 调用 getData() 获取 BetList 数组
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 1, 'label': 'GRAND' },
          { 'value': 2, 'label': 'MAJOR' },
          { 'value': 3, 'label': 'MINOR' },
          { 'value': 4, 'label': 'MINI' }
        ]
      } else {
        this.levelConfig = [
          { 'value': 0, 'label': '全部' },
          { 'value': 1, 'label': '普通场次' }
        ]
      }
    },
    showInfo() {
      const _this = this
      // 检查是否 gameId 为 150 且 level 为 0
      const gameIds = [150, 90, 156, 166, 174, 196, 204, 210, 216] // 定义一个数组存储需要检查的 gameId
      if (gameIds.includes(this.searchForm.gameId) && this.searchForm.level === 0) {
        // 循环所有 levelConfig 值（除 value === 0）
        const promises = this.levelConfig
          .filter(config => config.value !== 0) // 过滤掉 value 为 0 的选项
          .map(config => {
            return request({
              url: '/dataProxy/info',
              method: 'get',
              data: {
                Env: _this.env,
                Path: '/jackpot/info',
                GameId: _this.searchForm.gameId,
                App: _this.searchForm.app,
                Level: config.value // 使用当前循环的 level 值
              }
            })
          })

        // 使用 Promise.all 来处理所有请求
        Promise.all(promises).then(results => {
          let combinedData = []
          results.forEach(response => {
            if (response.RetCode === 0 && response.Data && response.Data !== 'no Data') {
              combinedData = combinedData.concat(response.Data)
            }
          })

          if (combinedData.length > 0) {
            _this.prizeInfo = combinedData
            console.log('_this.prizeInfo:', _this.prizeInfo)
          } else {
            Message.success('查询结果为空')
          }
          // loading.close()
        }).catch(error => {
          console.error('Error fetching data:', error)
          Message.error('数据获取失败')
          // loading.close()
        })
      } else {
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: _this.env,
            Path: '/jackpot/info',
            GameId: _this.searchForm.gameId,
            App: _this.searchForm.app,
            Level: _this.searchForm.level
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const objs = response.Data || []
            if (objs.length === 0 || objs === 'no Data') {
              Message.success('查询结果为空')
              // loading.close()
              return
            }
            _this.prizeInfo = objs
          } else {
            Message.error(response.Data)
          }
          // loading.close()
        })
      }
      this.prizeVisible = true
    },
    showItemInfo() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/info/item',
          GameId: _this.searchForm.gameId,
          App: 0,
          Level: _this.searchForm.level
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          if (objs.length === 0 || objs === 'no Data') {
            Message.success('查询结果为空')
            // loading.close()
            return
          }
          _this.itemProgressInfo = objs
        } else {
          Message.error(response.Data)
        }
        // loading.close()
      })
      this.itemProgressVisible = true
    },
    changeItemPool() {
      const _this = this
      let ProgressChange = _this.itemForm.progressChange
      if (ProgressChange === '') {
        ProgressChange = 0
      }
      let AwardChange = _this.itemForm.AwardChange
      if (AwardChange === '') {
        AwardChange = 0
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/item/operate',
          GameId: _this.searchForm.gameId,
          App: _this.searchForm.app,
          Level: _this.searchForm.level,
          ProgressChange: ProgressChange,
          AwardChange: AwardChange
        }
      }).then(response => {
        if (response.RetCode === 0) {
          _this.showItemInfo()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    changePusoyJPPrizePool(isRobot, jpType) {
      const _this = this
      let changeNum = _this.prizeForm.ChangeNum
      if (jpType == 1){
        changeNum = _this.prizeForm.GrandChangeNum
      } else if (jpType == 2) {
        changeNum = _this.prizeForm.MajorChangeNum
      }
      let robotFlag = 0
      if (isRobot) {
        robotFlag = 1
        changeNum = _this.prizeForm.ChangeRobotNum
        if (jpType == 1){
          changeNum = _this.prizeForm.GrandChangeRobotNum
        } else if (jpType == 2) {
          changeNum = _this.prizeForm.MajorChangeRobotNum
        }
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/operate',
          GameId: _this.searchForm.gameId,
          ChangeNum: changeNum * 1000,
          App: _this.searchForm.app,
          Level: _this.searchForm.level,
          IsRobot: robotFlag,
          JackpotType: jpType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          _this.showInfo()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')            
        }
      })
    },
    changePrizePool(isRobot) {
      const _this = this
      let changeNum = _this.prizeForm.ChangeNum
      let robotFlag = 0
      if (isRobot) {
        robotFlag = 1
        changeNum = _this.prizeForm.ChangeRobotNum
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/jackpot/operate',
          GameId: _this.searchForm.gameId,
          ChangeNum: changeNum * 1000,
          App: _this.searchForm.app,
          Level: _this.searchForm.gameId === 90 ? _this.prizeForm.Level : _this.searchForm.level,
          IsRobot: robotFlag
        }
      }).then(response => {
        if (response.RetCode === 0) {
          _this.showInfo()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleSizeChange(val) {
      this.pageNum = val
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    // 转行卢比
    toRupee(amount) {
      const gameIds = [150, 90, 156, 166, 174, 196, 204, 210] // 定义一个数组存储需要检查的 gameId
      const parsedAmount = parseInt(amount) // 先将 amount 转换为整数
      if (gameIds.includes(this.searchForm.gameId)) {
        return parsedAmount / 100000
      }
      return parsedAmount / 1000
    },
    // 获取游戏名称
    getGameName(gameId) {
      var name = ''
      for (let i = 0; i < this.gameConfig.length; i++) {
        if (gameId === this.gameConfig[i].value) {
          name = this.gameConfig[i].label
          break
        }
      }
      return name
    },
    // 获取操作类型
    getTypeName(actType) {
      var name = ''
      for (let i = 0; i < this.typeConfig.length; i++) {
        if (actType === this.typeConfig[i].value) {
          name = this.typeConfig[i].label
          break
        }
      }
      return name
    },
    getPoolTypeName(poolType) {
      var name = ''
      for (let i = 0; i < this.poolConfig.length; i++) {
        if (poolType === this.poolConfig[i].value) {
          name = this.poolConfig[i].label
          break
        }
      }
      return name
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getData() {
      return request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.submap[this.searchForm.gameId]
        }
      }).then(response => {
        if (response.RetCode === 0 && response.Data && response.Data.Data !== '') {
          const cfg = JSON.parse(response.Data.Data)
          return cfg
        } else {
          return null
        }
      }).catch(error => {
        console.error('Error fetching data:', error)
        return []
      })
    },
    getLevelLabel(level) {
      const config = this.levelConfig.find(config => config.value === level)
      return config ? config.label : `Level ${level}`
    }
  }
}
</script>
