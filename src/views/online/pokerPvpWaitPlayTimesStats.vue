<template>
    <div class="app-container">
        <el-row>
            <el-form :model="item" label-width="90px" :inline="true" size="small">
                <el-form-item label="日期：" :required="true">
                    <el-date-picker v-model="item.date" value-format="timestamp" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
                </el-form-item>
                <el-form-item label="身份：">
                    <el-select v-model="clientDB.FilterValueMap['trust_level']" size="mini" @change="handleFilter">
                        <el-option v-for="item in trustLevelOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="游戏名称：">
                    <el-select v-model="clientDB.FilterValueMap['gid']" size="mini" @change="handleFilter">
                        <el-option label="全部" :value="0" />
                        <el-option v-for="(o, key) in clientDB.FilterMap['gid']" :key="key" :label="getGameName(o)"
                            :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="场次：">
                    <el-select v-model="clientDB.FilterValueMap['table_money']" size="mini" @change="handleFilter">
                        <el-option label="全部" :value="0" />
                        <el-option label="汇总" :value="-1" />
                        <el-option v-for="(o, key) in clientDB.FilterMap['table_money']" :key="key" :label="o"
                            :value="key" />
                    </el-select>
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table ref="filterTable" :data="tableData" stripe max-height="850" border
                :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '10px' }"
                :cell-style="libShow.DefaultTableCell" style="width: 100%;margin-top:10px;" @sort-change="sortChange">
                <el-table-column prop="rec_day" label="日期" sortable="custom" />
                <el-table-column prop="gid" label="游戏名称" width="120" sortable="custom">
                    <template slot-scope="scope">
                        {{ getGameName(scope.row.gid) }}
                    </template>
                </el-table-column>
                <el-table-column prop="table_money" label="场次" sortable="custom">
                    <template slot-scope="scope">
                        {{ getTableMoney(scope.row.table_money) }}
                    </template>
                </el-table-column>

                <el-table-column prop="trust_level" label="身份" sortable="custom">
                    <template slot-scope="scope">
                        {{ getTrustLevel(scope.row.trust_level) }}
                    </template>
                </el-table-column>
                <el-table-column prop="wait_times_sum" label="平均开局时长" sortable="custom" >
                    <template slot-scope="scope">
                        {{ formatNumber(scope.row.wait_times_sum / scope.row.user_count) }}
                    </template>
                </el-table-column>
                <el-table-column prop="max_wait_times" label="最长等待时间" sortable="custom" />
            </el-table>
        </el-row>
        <el-col :offset="16" :span="8">
            <div class="block">
                <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[40, 80, 120, 160]"
                    :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper"
                    :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-col>
    </div>
</template>

<script>
import { $libDate, $libLang, $libShow, ClientTableData, DataRule } from '@/utils/common'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'
import { Message } from 'element-ui'
const filterMap = {
    gid: 'all',
    table_money: 'all',
    trust_level: 'all',
}

export default {
    components: { DateTimeShow },
    data() {
        return {
            item: {
                Gid: 0,
                date: [new Date().getTime(), new Date().getTime()],
                tableMoney: -1,
                trustLevel: -1,
            },
            clientDB: new ClientTableData([], 1, {}),
            libShow: $libShow,
            timer: null,
            games: [],
            tableData: [],
            trustLevelOptions: [
                { value: 0, label: '全部' },
                { value: -1, label: '汇总' },
                { value: 1, label: '低危用户' },
                { value: 2, label: '疑似用户' },
                { value: 3, label: '黑子用户' },
                { value: 4, label: '低信任分用户' },
                { value: 5, label: '高信任分用户' },
                { value: 6, label: '默认用户' },
            ],
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
                        if (response.Data[i].CategoryID == 2) {
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
                    Path: '/pokerpvpwaitplaytimes/all',
                    trustLevel: this.item.trustLevel,
                    startTime: parseInt(this.item.date[0] / 1000),
                    endTime: parseInt(this.item.date[1] / 1000),
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    // 把所有的默认身份从0转换为6
                    for (let i = 0; i < response.Data.length; i++) {
                        if (response.Data[i].trust_level === 0) {
                            response.Data[i].trust_level = 6
                        }
                    }

                    // 对数据进行排序，按日期排序，相同日期按游戏名称排序，相同游戏名称按场次排序，相同场次按信任等级排序
                    response.Data.sort((a, b) => {
                        if (a.rec_day < b.rec_day) {
                            return -1
                        }
                        if (a.rec_day > b.rec_day) {
                            return 1
                        }
                        if (a.gid < b.gid) {
                            return -1
                        }
                        if (a.gid > b.gid) {
                            return 1
                        }
                        if (a.table_money < b.table_money) {
                            return -1
                        }
                        if (a.table_money > b.table_money) {
                            return 1
                        }
                        if (a.trust_level < b.trust_level) {
                            return -1
                        }
                        if (a.trust_level > b.trust_level) {
                            return 1
                        }
                        return 0
                    })

                    $this.clientDB = new ClientTableData(response.Data || [], 40, {
                        gid: 'all',
                        table_money: 'all',
                        trust_level: 'all',
                    }, 'rec_day', -1)
                    this.$forceUpdate()
                    // 去掉这个里面的-1
                    $this.handleCurrentChange(1)
                    delete $this.clientDB.FilterMap['table_money'][-1]
                    delete $this.clientDB.FilterMap['gid'][-1]
                }
            })
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

        clearFilter() {
            this.clientDB.ClearFilterMap()
            this.refreshShow()
        },

        handleFilter(k, v) {
            console.log('this.clientDB.FilterValueMap=>', this.clientDB.FilterMap['trust_level'])
            console.log('k=>', k, 'v==>', v)
            this.clientDB.FilterData()
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

        getTableMoney(n) {
            if (n === 0) {
                return '全部'
            }
            if (n === -1) {
                return '汇总'
            }
            return n
        },

        // 信任等级枚举
        getTrustLevel(n) {
            if (n === 0) {
                return '全部'
            }
            if (n === -1) {
                return '汇总'
            }
            for (const i in this.trustLevelOptions) {
                if (this.trustLevelOptions[i].value === n) {
                    return this.trustLevelOptions[i].label
                }
            }
        },

        formatNumber(n) {
            return n.toLocaleString()
        },

        getGameName(gid) {
            if (gid === -1) {
                return '汇总'
            }
            let name = '' + gid
            for (const i in this.games) {
                if (this.games[i].value === gid) {
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

        getTime(toDate) {
            return toDate / 1000
        },
    }
}
</script>