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
                    <el-select v-model="searchForm.gameId" placeholder="请选择">
                        <el-option
                            v-for="item in gameConfig"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作类型：">
                    <el-select v-model="searchForm.actType" placeholder="请选择">
                        <el-option
                            v-for="item in typeConfig"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="玩家id：">
                    <el-input v-model="searchForm.uid" size="mini" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="search">查询流水</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" size="mini" @click="showInfo">奖池信息</el-button>
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
            <el-table-column
                prop="Type"
                label="操作类型"
            >
                <template slot-scope="{row}">
                    {{ getTypeName(row.Type) }}
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
                prop="PoolMoney"
                label="操作后奖池数量"
            >
                <template slot-scope="{row}">
                    {{ toRupee(row.PoolMoney) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="Uid"
                label="玩家id"
            />
            <el-table-column
                prop="IsRobot"
                label="是否机器人"
            >
                <template slot-scope="{row}">
                    {{ row.IsRobot == 1?"是":"否" }}
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
            title="奖池信息"
            :modal="false"
            :visible.sync="prizeVisible"
        >
            <el-descriptions title="">
                <el-descriptions-item label="用户奖池">{{ toRupee(prizeInfo.UserPool) }}</el-descriptions-item>
                <el-descriptions-item label="用户返奖">{{ toRupee(prizeInfo.UserAward) }}</el-descriptions-item>
                <el-descriptions-item label="机器人奖池">{{ toRupee(prizeInfo.RobotPool) }}</el-descriptions-item>
                <el-descriptions-item label="机器人返奖励">{{ toRupee(prizeInfo.RobotAward) }}</el-descriptions-item>
                <el-descriptions-item label="手动添加数量">{{ toRupee(prizeInfo.AdminAdd) }}</el-descriptions-item>
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
                <el-form-item label="手动修改机器人奖池数量：">
                    <el-col :span="8">
                        <el-input v-model="prizeForm.ChangeRobotNum" size="mini" />
                    </el-col>
                    <el-col :span="8">
                        <el-button style="margin-left: 10px;" type="primary" size="mini" @click="changePrizePool(true)">保存</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
export default {
    name: 'RocketRet',
    data() {
        return {
            searchForm: {
                date: $libDate.GetDayBegin(new Date().getTime()),
                gameId: 25,
                actType: 0,
                uid: 0,
            },
            gameConfig: [
                {"value":0, "label":"全部"},
                {"value":25, "label":"color game"}
            ],
            typeConfig: [
                {"value":0, "label":"全部"},
                {"value":1, "label":"玩家抽水"},
                {"value":2, "label":"机器人抽水"},
                {"value":3, "label":"玩家返奖"},
                {"value":4, "label":"机器人返奖"},
                {"value":5, "label":"手动加玩家奖池"},
                {"value":6, "label":"手动加机器人奖池"},
            ],
            tableData: [],
            totalCount: 0,
            currentPage: 0,
            pageNum: 10,
            libShow: $libShow,
            pickerOptions: $libShow.DefaultDatePickerOptions(),
            prizeVisible: false,
            prizeInfo: {
                AdminAdd:0,
                RobotPool:0,
                UserPool:0,
                RobotAward:0,
                UserAward:0,
                UpdateTime: 0,
            },
            prizeForm: {
                ChangeNum: 0,
                ChangeRobotNum: 0,
            }
        }
    },
    created() {

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
                    ActType: _this.searchForm.actType,
                    Time: $libDate.SelectTimeToIndia(this.searchForm.date) / 1000,
                    GameId: _this.searchForm.gameId,
                    Page: _this.currentPage,
                    Limit: _this.pageNum
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    let objs = response.Data || []
                    if (objs.length === 0 || objs == 'no Data') {
                        Message.success('查询结果为空')
                        // loading.close()
                        return
                    }
                    if (objs.total > 0) {
                        _this.totalCount=objs.total;
                        _this.tableData = objs.list;
                    } else {
                        _this.totalCount=0;
                        _this.tableData = [];
                    }
                    
                    
                } else {
                    Message.error(response.Data)
                }
                // loading.close()
            })
        },
        showInfo() {
            let _this=this;
            request({
                url: '/dataProxy/info',
                method: 'get',
                data: {
                    Env: _this.env,
                    Path: '/jackpot/info',
                    GameId: _this.searchForm.gameId
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    let objs = response.Data || []
                    if (objs.length === 0 || objs == 'no Data') {
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
            this.prizeVisible = true;
        },
        changePrizePool(isRobot) {
            let _this=this;
            let changeNum = _this.prizeForm.changeNum
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
                    ChangeNum: changeNum*1000,
                    IsRobot: robotFlag,
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    _this.showInfo();
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
            return parseInt(amount) / 1000
        },
        //获取游戏名称
        getGameName(gameId) {
            var name = "";
            for(let i=0;i<this.gameConfig.length;i++) {
                if (gameId == this.gameConfig[i].value) {
                    name = this.gameConfig[i].label;
                    break;
                }
            }
            return name;
        },
        //获取操作类型
        getTypeName(actType) {
            var name = "";
            for(let i=0;i<this.typeConfig.length;i++) {
                if (actType == this.typeConfig[i].value) {
                    name = this.typeConfig[i].label;
                    break;
                }
            }
            return name;
        },
        formatTime(ts) {
            return $libDate.FormateSecondStr(ts, 2)
        },
    }
}
</script>