<template>
    <div class="app-container">
        <el-row>
            <el-form :model="form" label-width="100px" :inline="true" size="mini">
                <el-form-item label="游戏：" :required="true">
                    <el-select v-model="form.gameId" placeholder="请选择" size="mini">
                        <el-option v-for="item in gameCfgs" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型：" :required="true">
                    <el-select v-model="form.repeatType" placeholder="请选择" size="mini">
                        <el-option label="全部" :value=-1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" :required="true">
                    <el-select v-model="form.status" placeholder="请选择" size="mini">
                        <el-option label="全部" :value=-1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="resetSearch">重置查询条件</el-button>
                    <el-button type="primary" size="mini" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <div style="float: right; margin-bottom: 10px;">
                <el-button size="mini" @click="handleShowDevTools()" icon="el-icon-setting">开发工具</el-button>
            </div>
            <el-table :data="tableData" stripe :header-cell-style="libShow.DefaultTableHeadClass"
                :cell-style="libShow.TableCell(10)" style="width: 100%">
                <el-table-column prop="listId" label="比赛列表ID" sortable/>
                <el-table-column prop="matchId" label="比赛ID" sortable/>
                <el-table-column prop="gid" label="游戏名称" sortable>
                    <template slot-scope="scope">
                        {{ getGameName(scope.row.gid) }}
                    </template>
                </el-table-column>
                <el-table-column prop="matchCfgId" label="比赛配置ID" sortable/>
                <el-table-column prop="showTime" label="显示时间" sortable>
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.showTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="openTime" label="入场时间" sortable>
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.openTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" sortable>
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.startTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="DelayEnterEndTime" label="延迟进入结束时间" sortable>
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.DelayEnterEndTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="finishTime" label="结束时间" sortable>
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.finishTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="比赛状态" sortable>
                    <template slot-scope="scope">
                        {{ getStatusName(scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column prop="repeatType" label="循环类型" sortable>
                    <template slot-scope="scope">
                        {{ getRepeatTypeName(scope.row.repeatType) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button v-if="showDevTool && (scope.row.status >= 5)" type="danger" size="mini"
                            @click="handleDelete(scope.row.listId)">删除</el-button>
                        <el-button v-else="showDevTool" type="danger" size="mini"
                            @click="handleOff(scope.row.listId)">下架</el-button>
                        <el-button type="warning" size="mini" @click="handleHide(scope.row.listId)">隐藏</el-button>
                    </template>
                </el-table-column>
                  <el-table-column fixed="right" label="暂停操作" width="80px" v-if="envProjectName == 'ph_audit'">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.status === 3" type="danger" size="mini" @click="handlePause(scope.row.listId,scope.row.status)">暂停</el-button>
                      <el-button v-if="scope.row.status === 7" type="danger" size="mini" @click="handlePause(scope.row.listId,scope.row.status)">结束暂停</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import DateTimeShow from '@/components/DatetimeShow'
import { $libShow } from '@/utils/common'
import {IsMars} from "@/utils/env";
export default {
    name: 'MatchMonitor',
    components: { DateTimeShow },
    data() {
        return {
          envProjectName: process.env.VUE_APP_PROJECT,
            libShow: $libShow,
            form: {
                gameId: 2033,
                status: -1,
                repeatType: -1,
            },
            gameCfgs: [
                { "value": 2033, "label": "pusoy" },
            ],
            statusCfgs: [
                { "value": 0, "label": "已创建" },
                { "value": 1, "label": "已展示" },
                { "value": 2, "label": "入场中" },
                { "value": 3, "label": "已开始" },
                { "value": 4, "label": "已结束" },
                { "value": 5, "label": "已隐藏" },
                { "value": 6, "label": "已下架" },
            ],
            repeatCfgs: [
                { "value": 0, "label": "单场" },
                { "value": 1, "label": "单天单场" },
                { "value": 2, "label": "单天多场" },
            ],
            csCfgs: [],
            tableData: [],
            showDevTool: false,
        }
    },
    created() {
        this.env = store.getters.env || this.env
    },
    mounted() {
        this.getList()
    },
    methods: {
        resetSearch() {
            this.form.gameId = 2033
            this.form.status = -1
            this.form.repeatType = -1
        },
        getList() {
            request({
                url: '/dataProxy/info',
                method: 'get',
                data: {
                    Env: this.env,
                    Path:'/match/list',
                    GameId: this.form.gameId,
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    let objs = response.Data || []
                    if (objs.total > 0) {
                        this.total = objs.total;
                        this.tableData=[]
                        for (let i = 0; i < objs.list.length; i++) {
                          let gameId = parseInt(objs.list[i].gid, 10)
                          if (gameId !== 2033) {
                            continue
                          }
                          this.tableData.push(objs.list[i])
                        }
                    } else {
                        this.total = 0;
                        this.tableData = [];
                    }
                } else {
                    console.log("获取列表 失败")
                }
            })
        },
        getGameName(gameId) {
            var gameName = ""
            for (var i = 0; i < this.gameCfgs.length; i++) {
                if (this.gameCfgs[i].value == gameId) {
                    gameName = this.gameCfgs[i].label
                    break
                }
            }
            return gameName
        },
        getStatusName(status) {
            var statusName = ""
            for (var i = 0; i < this.statusCfgs.length; i++) {
                if (this.statusCfgs[i].value == status) {
                    statusName = this.statusCfgs[i].label
                    break
                }
            }
            return statusName
        },
        getRepeatTypeName(repeatType) {
            var rpeatTypeName = ""
            for (var i = 0; i < this.repeatCfgs.length; i++) {
                if (this.repeatCfgs[i].value == repeatType) {
                    rpeatTypeName = this.repeatCfgs[i].label
                    break
                }
            }
            return rpeatTypeName
        },
        handleShowDevTools() {
            // 浏览器设置ShowDev=1才可以看到开发工具
            if (window.ShowDev == 1) {
                this.showDevTool = !this.showDevTool
            }
        },
        handleOff(listId) {
            this.$confirm('您确定要将该比赛下架吗？<span style="color: red;">下架的比赛将自动取消</span>', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                request({
                    url: '/dataProxy/info',
                    method: 'post',
                    data: {
                        Env: this.env,
                        Path: '/match/off',
                        ListId: listId,
                    }
                }).then(response => {
                    if (response.RetCode === 0) {
                        Message.success('下架比赛成功！')
                        this.getList()
                    } else {
                        Message.error('下架比赛失败！')
                    }
                })
            }).catch(() => {
                console.log('取消')
            })
        },
        handleHide(listId) {
            this.$confirm("您确定要将该比赛隐藏吗？客户端将无法获取被隐藏的比赛", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: '/dataProxy/info',
                    method: 'post',
                    data: {
                        Env: this.env,
                        Path: '/match/hide',
                        ListId: listId,
                    }
                }).then(response => {
                    if (response.RetCode === 0) {
                        Message.success('隐藏比赛成功！')
                        this.getList()
                    } else {
                        Message.error('隐藏比赛失败！')
                    }
                })
            }).catch(() => {
                console.log('取消')
            })
        },
        handleDelete(listId) {
            // 在v-if处已限制，只有已隐藏或者已下架的比赛可以删除
            this.$confirm("您确定要将该比赛删除吗？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: '/dataProxy/info',
                    method: 'post',
                    data: {
                        Env: this.env,
                        Path: '/match/delete',
                        ListId: listId,
                    }
                }).then(response => {
                    if (response.RetCode === 0) {
                        Message.success('删除比赛成功！')
                        this.getList()
                    } else {
                        Message.error('删除比赛失败！')
                    }
                })
            }).catch(() => {
                console.log('取消')
            })
        },
      handlePause(listId,status) {
          var pauseType = 0
          let msg = ''
          if (status == 3){
            pauseType = 1
            msg = "您确定要发起暂停比赛吗"
          }else if(status == 7){
            pauseType = 2
            msg = "您确定要结束暂停比赛吗"
          }else{
            return
          }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          request({
            url: '/dataProxy/info',
            method: 'post',
            data: {
              Env: this.env,
              Path: '/match/pause',
              ListId: listId,
              PauseType:pauseType
            }
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('操作成功！')
              this.getList()
            } else {
              Message.error('操作失败！')
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    }
}
</script>
