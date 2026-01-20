<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="cfgId" key-id="TongitsHunterConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['cfgId', 'name']" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
        <span style="margin-left: 15px; color: red">注意：客户端包已被剔除，如需开启需要先联系客户端处理</span>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
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
        @sort-change="sortChange">
        <el-table-column prop="id" label="id" sortable="custom" width="80" />
        <el-table-column prop="name" label="活动名称" />
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" sortable="custom">
          <template slot-scope="scope">
            {{ formatTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyUser" label="最后修改人" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ statusNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="op">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status!=2" size="mini" type="success" icon="el-icon-upload2" @click="handlePrepare(scope.row)">上架 </el-button>
            <el-button v-if="scope.row.status!=2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button v-if="scope.row.status==2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
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
            @current-change="handleCurrentChange" />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="handleEditDialogOpened"
      width="1100px"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="活动配置">
          <el-row>
            <el-form :model="edit.item" label-width="220px">
              <el-col :span="24">
                <el-form-item label="活动名称：" prop="name">
                  <el-input v-model="edit.item.name" placeholder="请输入活动名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间：" prop="startTime" :required="true">
                  <el-date-picker v-model="edit.item.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间：" prop="endTime" :required="true">
                  <el-date-picker v-model="edit.item.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="每日发奖上限：" prop="dailyBonusLimit" :required="true">
                  <el-input v-model.number="edit.item.dailyBonusLimit" type="number" >
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总的发奖上限：" prop="totalBonusLimit" :required="true">
                  <el-input v-model.number="edit.item.totalBonusLimit" type="number" >
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日已发奖励：">
                  <el-input v-model.number="edit.dailyBonus" type="number" disabled>
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总的已发奖励：">
                  <el-input v-model.number="edit.totalBonus" type="number" disabled>
                    <template slot="append">₱</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="参与活动的游戏" prop="gameIds">
                  <GameTreeSelector :selected-games-id="edit.item.gameIds" :sub-games-id="edit.subGamesId" :expand-all="true" @change="handleGamesChange" />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-tabs type="border-card" v-model="edit.activeTag">
              <el-tab-pane v-for="(gameTask, index) in edit.item.gameTasks" :label="gameNames[gameTask.gameId]" :name="gameNames[gameTask.gameId]">
                <el-descriptions title="牌局任务配置" direction="vertical" :column="2" border>
                  <el-descriptions-item label="任务类型">
                    {{ taskTypeNames[gameTask.playTasks[0].type] }}
                  </el-descriptions-item>
                  <el-descriptions-item label="牌局次数">
                    <el-col :span="12">
                      <el-input v-model.number="gameTask.playTasks[0].timesRequired" type="number" />
                    </el-col>
                  </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="胜场任务配置" direction="vertical" :column="1" border style="padding-top: 30px">
                  <el-descriptions-item label="最低场次底注">
                    <el-col :span="12">
                      <el-select v-model="edit.antesMinMap[gameTask.gameId]" placeholder="请选择" @change="handleAntesMinChange(gameTask)">
                        <el-option v-for="ante in edit.gameAntesMap[gameTask.gameId]" :label="ante" :value="ante" />
                      </el-select>
                    </el-col>
                  </el-descriptions-item>
                  <el-descriptions-item label="胜场任务列表">
                    <el-button size="mini" type="primary" icon="el-icon-plus" @click="addWinTask(gameTask)">添加任务</el-button>
                    <el-table :data="gameTask.winTasks">
                      <el-table-column prop="id" label="任务ID">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.id" type="number" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="type" label="任务类型">
                        <template slot-scope="scope">
                          {{ taskTypeNames[scope.row.type] }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="bonus" label="任务条件">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.timesRequired" type="number" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="bonus" label="任务奖励">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.bonus" type="number" />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" column-key="op" width="130">
                        <template slot-scope="scope">
                          <el-button size="mini" icon="el-icon-delete" @click="removeWinTask(scope.$index,gameTask)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="白名单配置">
          <el-form ref="item" label-width="220px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="AppId白名单：" prop="item.whitelistCfg.appIdList">
                  <el-select v-model="edit.item.whitelistCfg.appIdList" placeholder="请选择" multiple style="width: 400px">
                    <el-option
                      v-for="item in appIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="SiteId白名单：" prop="item.whitelistCfg.siteIdList">
                  <SiteSelect
                    v-model="edit.item.whitelistCfg.siteIdList"
                    multiple
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-row style="margin-top: 10px">
        <el-button type="primary" @click="handleSave()">保存配置</el-button>
      </el-row>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>

import Publish from "@/components/Publish/index.vue";
import {$libDate, $libShow, ClientTableData} from "@/utils/common";
import store from "@/store";
import request from "@/utils/request";
import {Message} from "element-ui";
import SiteSelect from "@/components/SiteSelect/index.vue";
import GameTreeSelector from "@/components/GamesTreeSelector/index.vue";
import Compare from "@/components/Compare/index.vue";

const filterMap = {}

const loadingText = '用户导入中，请稍等...'

function newTask(type, antesMin) {
  return {
    id: 0,
    type: type,
    bonus: 0,
    antesMin: antesMin,
    timesRequired: 0
  }
}

function newGameTask(gameId) {
  return {
    gameId: gameId,
    winTasks: [],
    playTasks: [newTask(1, 0)],
  }
}

function newItem() {
  return {
    id: 0,
    name: '',
    activityId: 15,
    startTime: new Date().getTime(),
    endTime: new Date().getTime() + 86400*1000,
    modifyUser: '',
    status: 7,
    gameIds: [22, 28],
    whitelistCfg: {
      appIdList: [1000002],
      siteIdList: ['Dev'],
    },
    gameTasks: [],
    dailyBonusLimit: 0,
    totalBonusLimit: 0,
  }
}

export default {
  components: {
    Compare,
    GameTreeSelector,
    SiteSelect,
    Publish
  },
  data() {
    return {
      AttrNames: {
        activityId: '活动ID',
        name: '活动名称',
        actName: '活动名称',
        cfgId: '活动配置ID',
        startTime: '开始时间',
        endTime: '结束时间',
        modifyUser: '最后修改人',
        status: '配置状态',
        gameIds: '游戏ID配置',
        whitelistCfg: '白名单',
        gameTasks: '游戏任务配置',
        dailyBonusLimit: '每日发奖上限',
        totalBonusLimit: '总发奖上限',
      },
      edit: {
        cfgId: 0,
        antesMinMap: [],
        gameAntesMap: {},
        isEdit: false,
        visible: false,
        item: newItem(),
        title: "新增",
        loading: false,
        subGamesId: [22, 28],
        activeTag: '',
        dailyBonus: 0,
        totalBonus: 0,
      },
      env: 'test',
      libDate: $libDate,
      libShow: $libShow,
      tableData: [],
      clientDB: new ClientTableData([], 10, filterMap),
      statusNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      taskTypeNames: {
        1: '牌局次数',
        2: '获胜次数',
      },
      gameNames: {
        22: 'TongitsPot',
        28: 'TongitsJoker',
      },
      appIdOptions: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: 'GP-BP测试1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        }
      ],
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
    this.getGameAnteTables()
  },
  methods: {
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    //************************ 修改/添加弹框相关 ************************
    handleAdd() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
      this.edit.antesMinMap = {}
      console.log('handleAdd', this.edit.item)
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      console.log('clickData ', row)
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.id)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, ID) {
      console.log('ID:', ID)
      this.edit.isEdit = bEdit

      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          const item = JSON.parse(JSON.stringify(_data))
          item.startTime = item.startTime * 1000
          item.endTime = item.endTime * 1000
          item.gameIds = JSON.parse(item.gameIds)
          item.dailyBonusLimit /= 1000
          item.totalBonusLimit /= 1000
          item.whitelistCfg = JSON.parse(item.whitelistCfg)
          item.gameTasks = JSON.parse(item.gameTasks)

          this.edit.antesMinMap = []
          for (let i = 0; i < item.gameTasks.length; i++) {
            const gameTask = item.gameTasks[i]
            this.edit.antesMinMap[gameTask.gameId] = gameTask.winTasks[0].antesMin / 1000
            gameTask.winTasks.forEach(winTask => {
              winTask.bonus = parseFloat(winTask.bonus / 1000).toFixed(2)
              winTask.antesMin = parseFloat(winTask.antesMin / 1000).toFixed(2)
            })
          }

          this.edit.item = item
          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    //************************ 修改/添加弹框相关 ************************
    //************************ 游戏场次底注列表相关 ************************
    async getGameAnteTables() {
      const gameIds = this.edit.item.gameIds
      for (const gameId of gameIds) {
        let list = []
        switch (gameId) {
          case 22:
            list =  await this.getTongitsAnteList(1)
            break
          case 28:
            list =  await this.getTongitsAnteList(2)
            break
          case 29:
            list =  await this.getTongitsAnteList(3)
            break
          default:
            console.log('getGameAnteTables gameId: ', gameId, ' not supported',)
        }
        this.edit.gameAntesMap[gameId] = list
      }
    },
    async getTongitsAnteList(playMode) {
      const response = await request({
        url: '/tongitstable/all',
        method: 'get',
        data: {
          PlayMode: playMode
        }
      })

      let anteTables = []
      if (response.RetCode === 0) {
        const objs = response.Data || []
        for (const i in objs) {
          if (objs[i].TableMoney === 0 || objs[i].Status !== 2) {
            continue
          }
          anteTables.push(objs[i].TableMoney / 1000)
        }
        anteTables = Array.from(new Set(anteTables)) // 去重
        anteTables.sort((x, y) => x - y)
      }

      console.log('getTongitsAnteList anteTables: ', anteTables)
      return anteTables
    },
    //************************ 表格数据相关 ************************
    // 配置列表
    getList() {
      request({
        url: '/tongitshunterconfig/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'endTime', -1, "id")
          this.handleCurrentChange(1)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeStatus(id, status, msg) {
      // const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/tongitshunterconfig/update/status',
          method: 'post',
          data: {
            id: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    createData(data) {
      data['env'] = this.env
      request({
        url: '/tongitshunterconfig/create',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    updateData(data) {
      request({
        url: '/tongitshunterconfig/update',
        method: 'post',
        data: data
      }).then(response => {
        if (response.RetCode === 0) {
          this.getList()
          Message.success('保存成功！')
          this.edit.visible = false
        }
      })
    },
    getPostData() {
      if (this.edit.item.name === '') {
        Message.error('请填写活动名称')
        return
      }
      if (this.edit.item.gameIds.length === 0) {
        Message.error('请选择游戏')
        return
      }
      if (this.edit.item.gameTasks.length === 0) {
        Message.error('请添加活动任务')
        return
      }
      if (this.edit.item.dailyBonusLimit === 0 || this.edit.item.dailyBonusLimit === undefined) {
        Message.error('每日奖励上限不能为0')
        return
      }
      if (this.edit.item.totalBonusLimit === 0 || this.edit.item.totalBonusLimit === undefined) {
        Message.error('总奖励上限不能为0')
        return
      }

      for (let i = 0; i < this.edit.item.gameTasks.length; i++) {
        const gameTask = this.edit.item.gameTasks[i]
        if (gameTask.winTasks.length === 0) {
          Message.error('请添加胜场任务配置')
          return
        }
        const taskIds = []
        for (let j = 0; j < gameTask.winTasks.length; j++) {
          const winTask = gameTask.winTasks[j]
          if (taskIds.indexOf(winTask.id) !== -1) {
            Message.error('胜场任务ID不能重复')
            return
          }
          taskIds.push(winTask.id)
          if (winTask.type === 0 || winTask.timesRequired === 0 || winTask.bonus === 0) {
            Message.error('胜场任务配置中的数值不能为0')
            return
          }
        }
      }

      const copyItem = JSON.parse(JSON.stringify(this.edit.item))
      for (let i = 0; i < copyItem.gameTasks.length; i++) {
        const gameTask = copyItem.gameTasks[i]
        gameTask.winTasks.forEach(winTask => {
          winTask.bonus = parseInt(parseFloat(winTask.bonus) * 1000)
          winTask.antesMin = parseInt(parseFloat(winTask.antesMin) * 1000)
        })
      }
      copyItem.startTime = parseInt(copyItem.startTime / 1000)
      copyItem.endTime = parseInt(copyItem.endTime / 1000)
      copyItem.dailyBonusLimit *= 1000
      copyItem.totalBonusLimit *= 1000
      copyItem.gameIds = JSON.stringify(copyItem.gameIds)
      copyItem.whitelistCfg = JSON.stringify(copyItem.whitelistCfg)
      copyItem.gameTasks = JSON.stringify(copyItem.gameTasks)

      return copyItem
    },
    handleSave() {
      const data = this.getPostData()
      console.log('handleSave', data)
      if (data === null || data === undefined) {
        return
      }
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(data)
        const $this = this
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
          } else {
            $this.updateData(data)
          }
        })
      } else {
        this.createData(data)
      }
    },
    addWinTask(gameTask) {
      const antesMin = this.edit.antesMinMap[gameTask.gameId]
      gameTask.winTasks.push(newTask(2, antesMin))
    },
    removeWinTask(index, gameTask) {
      gameTask.winTasks.splice(index, 1)
    },
    handleAntesMinChange(gameTask) {
      console.log('handleAntesMinChange gameTask:', gameTask)
      const antesMin = this.edit.antesMinMap[gameTask.gameId]
      if (antesMin === 0) {
        Message.error('最低场次底注不能为0')
        return
      }

      gameTask.winTasks.forEach(winTask => {
        winTask.antesMin = antesMin
      })
    },
    getTaskBonusStat() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ActCfgId: this.edit.item.id,
          Path: '/activity/tongits/hunter/task/bonus/stat'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.dailyBonus = response.Data.dailyBonus / 1000
          this.edit.totalBonus = response.Data.totalBonus / 1000
        }
      })
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
    handlePrepare(ob) {
      this.changeStatus(ob.id, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.id, 3, '您确定要将记录状态修改为废弃吗？')
    },
    handleEditDialogOpened() {
      this.edit.dailyBonus = 0
      this.edit.totalBonus = 0

      if (!this.edit.isEdit) {
        console.log('handleEditDialogOpened', this.edit.item.gameIds)
        for (let i = 0; i < this.edit.item.gameIds.length; i++) {
          const gameId = this.edit.item.gameIds[i]
          this.edit.item.gameTasks.push(newGameTask(gameId))
        }
      } else {
        this.getTaskBonusStat()
      }
      this.edit.activeTag = this.gameNames[this.edit.item.gameIds[0]]
      console.log('handleEditDialogOpened', this.edit.item.gameTasks)
    },
    handleGamesChange(selectedGames) {
      console.log('selectedGames', selectedGames)
      const subGameIds = selectedGames.map(game => game.id)
      console.log('subGameIds', subGameIds)
      // 将新增游戏的任务也新增到gameTasks中
      for (let i = 0; i < selectedGames.length; i++) {
        const game = selectedGames[i]
        if (!this.edit.item.gameIds.includes(game.id)) {
          this.edit.item.gameTasks.push(newGameTask(game.id))
          this.edit.item.gameIds.push(game.id)
          console.log('add gameTask gameId:', game.id)
        }
      }
      // 移除已删除游戏的任务
      for (let i = 0; i < this.edit.item.gameTasks.length; i++) {
        const gameTask = this.edit.item.gameTasks[i]
        if (!subGameIds.includes(gameTask.gameId)) {
          this.edit.item.gameTasks.splice(i, 1)
          this.edit.item.gameIds.splice(i, 1)
          i--
        }
      }
      this.edit.activeTag = this.gameNames[this.edit.item.gameIds[0]]
    }
  }
}
</script>

<style>

</style>
