<template>
    <div class="app-container">
        <el-form :model="searchForm" label-width="110px" :inline="true" size="small">
            <el-row>
                <el-form-item label="用户ID：">
                    <el-input v-model="searchForm.Uid" placeholder="请输入查询id"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="签到天数：">
                    <el-input v-model="searchForm.DayNum" />
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="上次签到时间：">
                    <el-date-picker
                        v-model="searchForm.LastSignTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label=" ">
                    <el-button type="danger" size="mini" @click="setInfo">修改</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import request from '@/utils/request'
    import store from '@/store'
    export default {
        name: 'TestSign',
        components:{},
        data() {
            return {
                searchForm: {
                    Uid: 0,
                    DayNum: 0,
                    LastSignTime: 0,
                },
                saveFlag: false,
            }
        },
        computed: {},
        created() {
            this.env = store.getters.env || this.env
        },
        methods:{
            getInfo() {
                const $this = this
                this.saveFlag = false
                let searchUid = 0
                if (this.searchForm.Uid > 0) {
                    searchUid = this.searchForm.Uid
                }
                request({
                    url: '/dataProxy/info',
                    method: 'get',
                    data: {
                        Env: this.env,
                        Uid: searchUid,
                        Path: '/other/test/sign',
                    }
                }).then(response => {
                    console.log(response)
                    if (response.RetCode === 0) {
                        this.searchForm.DayNum = response.Data.GotCount
                        this.searchForm.LastSignTime = response.Data.LastSignTime*1000
                        this.saveFlag = true
                    }
                })
            },
            setInfo() {
                const $this = this
                if (!this.saveFlag) {
                    this.$message.error('请先查询用户签到信息是否存在！')
                    return
                }
                request({
                    url: '/dataProxy/info',
                    method: 'post',
                    data: {
                        Env: this.env,
                        Uid: this.searchForm.Uid,
                        SignCount: this.searchForm.DayNum,
                        LastSignTime: this.searchForm.LastSignTime/1000,
                        Path: '/other/test/sign',
                    }
                }).then(response => {
                    console.log(response)
                    if (response.RetCode === 0) {
                        this.$message({
                            message: response.Data,
                            type: 'success'
                        })
                    } else {
                        this.$message.error(response.Data)
                        return
                    }
                })
            }
        }
    }
</script>