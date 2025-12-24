<template>
    <div class="app-container">
        <el-row>
            <el-form :model="item" label-width="90px" :inline="true" size="small">
                <el-form-item label="游戏：">
                    <el-select v-model="item.Gid" size="mini">
                        <el-option v-for="row of games" :key="row.value" :label="row.label" :value="row.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="日期：" :required="true">
                    <el-date-picker v-model="item.date" value-format="timestamp" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="item.BetType" size="mini">
                        <el-option v-for="row of betType" :key="row.value" :label="row.label" :value="row.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="倍数：">
                    <el-select v-model="item.RewardMultiple" size="mini">
                        <el-option v-for="row of rewardMultiple" :key="row.value" :label="row.label"
                            :value="row.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="站点：">
                    <el-select v-model="item.SiteId" size="mini">
                        <el-option v-for="row of siteOptions" :key="row.value" :label="row.label" :value="row.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tableData" stripe max-height="850" border :row-style="{ height: '10px' }"
                style="width: 100%;margin-top:10px;">
                <el-table-column prop="rec_time" label="日期/时间" sortable>
                    <template slot-scope="scope">
                        <DateTimeShow :show-type="2" :timestamp="scope.row.rec_time" />
                    </template>
                </el-table-column>
                <el-table-column prop="uid" label="用户ID" />
                <el-table-column prop="gid" label="游戏名称">
                    <template slot-scope="scope">
                        {{ getGameName(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column prop="site_id" label="平台">
                    <template slot-scope="scope">
                        {{ getSiteName(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column prop="bet_type" label="下注类型">
                    <template slot-scope="scope">
                        {{ getBetType(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column prop="bet" label="bet">
                    <template slot-scope="scope">
                        {{ formatNumber(scope.row.bet / 1000) }}
                    </template>
                </el-table-column>
                <el-table-column prop="reward_multiple" label="返奖倍数">
                    <template slot-scope="scope">
                        {{ formatNumber(scope.row.reward_multiple / 1000) }}
                    </template>
                </el-table-column>
                <el-table-column prop="reward_money" label="返奖金额">
                    <template slot-scope="scope">
                        {{ formatNumber(scope.row.reward_money / 1000) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end">
            <el-col :span="12">
                <div class="block">
                    <el-pagination :current-page="currentPage" :page-sizes="[20, 40, 80, 120]" :page-size="pageNum"
                        layout="total, sizes, prev, pager, next, jumper" :total="totalCount"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { Message } from 'element-ui'
export default {
    components: { DateTimeShow },
    data() {
        return {
            item: {
                Gid: 0,
                date: [new Date().getTime(), new Date().getTime()],
                SiteId: 0,
                BetType: -1,
                RewardMultiple: 80,
            },
            timer: null,
            games: [],
            totalCount: 0,
            tableData: [],
            currentPage: 1,
            pageNum: 20,
            pickerOptions: {
                shortcuts: [{
                    text: '最近15天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            betType: [{
                value: -1,
                label: '所有'
            }, {
                value: 0,
                label: '普通下注'
            }, {
                value: 1,
                label: '购买下注'
            }, {
                value: 4,
                label: '购买重转'
            }],
            rewardMultiple: [{
                value: 80,
                label: '80倍'
            }, {
                value: 100,
                label: '100倍'
            }, {
                value: 120,
                label: '120倍'
            }, {
                value: 150,
                label: '150倍'
            }],
            siteOptions: [
                {
                    value: 0,
                    label: "全部"
                },
                {
                    value: 1,
                    label: "BP",
                },
                {
                    value: 2,
                    label: "AP",
                },
                {
                    value: 3,
                    label: "GP",
                },
                // {
                //     value: 4,
                //     label: "PG",
                // },
                {
                    value: 5,
                    label: "Dev",
                },
            ]
        }
    },
    created() {
        this.getGameList()
        this.getList()
        this.timer = setInterval(() => {
            console.log('执行了定时刷新')
            this.getList()
        }, 300000)
    },

    methods: {
        getGameList() {
            request({
                url: '/thirdpartygames/all',
                method: 'get',
                data: {}
            }).then(response => {
                if (response.RetCode === 0) {
                    for (let i = 0; i < response.Data.length; i++) {
                        if (response.Data[i].CategoryID == 1) {
                            this.games.push({
                                value: response.Data[i].Gid,
                                label: response.Data[i].Name
                            })
                        }
                    }
                    // 对gameList按名称排序
                    this.games.sort((a, b) => {
                        if (a.label < b.label) {
                            return -1
                        }
                        if (a.label > b.label) {
                            return 1
                        }
                        return 0
                    })
                    // 给开头加一个全部
                    this.games.unshift({
                        value: 0,
                        label: '所有'
                    })
                }
            })
        },

        getList() {
            if (this.item.date === null || this.item.date.length < 2) {
                Message.error('请选择时间')
                return
            }
            const $this = this
            request({
                url: '/dataProxy/info',
                method: 'get',
                data: {
                    Env: this.env,
                    Path: '/slotsGrandPrize/list',
                    Gid: this.item.Gid,
                    StartTime: parseInt(this.getTime(this.item.date[0])),
                    EndTime: parseInt(this.getTime(this.item.date[1])),
                    SiteId: this.item.SiteId,
                    BetType: this.item.BetType,
                    RewardMultiple: this.item.RewardMultiple * 1000,
                    Page: this.currentPage,
                    Limit: this.pageNum
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    $this.totalCount = response.Data.Count
                    const objs = response.Data.List || []
                    $this.ret = response.Data
                    $this.tableData = objs
                    if (objs.length === 0) {
                        Message.success('查询结果为空')
                        return
                    }
                    $this.tableData = objs
                }
            })
        },

        formatNumber(n) {
            return n.toLocaleString()
        },

        getGameName(row) {
            let name = '' + row.gid
            for (const i in this.games) {
                if (this.games[i].value === row.gid) {
                    name = this.games[i].label
                    break
                }
            }
            return name
        },

        getBetType(row) {
            let name = '' + row.bet_type
            for (const i in this.betType) {
                if (this.betType[i].value === row.bet_type) {
                    name = this.betType[i].label
                    break
                }
            }
            return name
        },

        getSiteName(row) {
            let name = '' + row.site_id
            for (const i in this.siteOptions) {
                if (this.siteOptions[i].value === row.site_id) {
                    name = this.siteOptions[i].label
                    break
                }
            }
            return name
        },

        handleSizeChange(val) {
            this.pageNum = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        getTime(toDate) {
            return toDate / 1000
        },
    }
}
</script>