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
                        <el-option v-for="item in repeatCfgs" :key="item.value" :label="item.label"
                            :value="item.value" />
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
            <el-table :data="tableData" stripe :header-cell-style="libShow.DefaultTableHeadClass"
                :cell-style="libShow.TableCell(10)" style="width: 100%">
                <el-table-column prop="listId" label="比赛列表ID" />
                <el-table-column prop="matchId" label="比赛ID" />
                <el-table-column prop="gid" label="游戏名称">
                    <template slot-scope="scope">
                        {{ getGameName(scope.row.gid) }}
                    </template>
                </el-table-column>
                <el-table-column prop="matchCfgId" label="比赛配置ID" />
                <el-table-column prop="showTime" label="显示时间">
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.showTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="openTime" label="入场时间">
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.openTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间">
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.startTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="DelayEnterEndTime" label="延迟进入结束时间">
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.DelayEnterEndTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="finishTime" label="结束时间">
                    <template slot-scope="{row}">
                        <DateTimeShow :show-type="2" :timestamp="row.finishTime" />
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="比赛状态">
                    <template slot-scope="scope">
                        {{ getStatusName(scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="handleOff(scope.row.listId)">下架</el-button>
                        <el-button type="warning" size="mini" @click="handleHide(scope.row.listId)">隐藏</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
import store from '@/store'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { $libShow } from '@/utils/common'
export default {
    name: 'MatchMonitor',
    components: { DateTimeShow },
    data() {
        return {
            libShow: $libShow,
            form: {
                gameId: 2031,
                status: -1,
                repeatType: 0,
            },
            gameCfgs: [
                { "value": 2031, "label": "tongits" },
            ],
            statusCfgs: [
                { "value": 1, "label": "已展示" },
                { "value": 2, "label": "入场中" },
                { "value": 3, "label": "已开始" },
                { "value": 4, "label": "已结束" },
                { "value": 5, "label": "已隐藏" },
            ],
            repeatCfgs: [
                { "value": 0, "label": "单场" },
            ],
            csCfgs: [],
            tableData: [],
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
            this.form.gameId = 2031
            this.form.status = -1
            this.form.repeatType = 0
        },
        getList() {
            request({
                url: 'matchmonitor/list',
                method: 'get',
                data: {
                    Env: this.env,
                    GameId: this.form.gameId,
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    let objs = response.Data || []
                    if (objs.total > 0) {
                        this.total = objs.total;
                        this.tableData = objs.list;
                        console.log(this.tableData)
                        if (this.tableData.length > 0) {

                        }
                    } else {
                        this.total = 0;
                        this.tableData = [];
                    }
                }else {
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
        handleOff(listId) {
            const $this = this
            this.$confirm("您确定要将该比赛下架吗？下架的比赛将自动取消", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: '/matchmonitor/off',
                    method: 'post',
                    data: {
                        ListId: listId,
                    }
                }).then(response => {
                    if (response.RetCode === 0) {
                        Message.success('下架比赛成功！')
                    }else {
                        Message.error('下架比赛失败！')
                    }
                })
            }).catch(() => {
                console.log('取消')
            })
        },
        handleHide() {
            const $this = this
            this.$confirm("您确定要将该比赛隐藏吗？客户端将无法获取被隐藏的比赛", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: '/matchmonitor/hide',
                    method: 'post',
                    data: {
                        ListId: listId,
                    }
                }).then(response => {
                    if (response.RetCode === 0) {
                        Message.success('隐藏比赛成功！')
                    }else {
                        Message.error('隐藏比赛失败！')
                    }
                })
            }).catch(() => {
                console.log('取消')
            })
        },
    }
}
</script>