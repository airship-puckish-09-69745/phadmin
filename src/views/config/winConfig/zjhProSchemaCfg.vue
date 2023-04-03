<template>
    <div class="app-container">
        <el-row>
            <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
        </el-row>
        <el-col :span="12" :offset="4">
            <h3 align="center" style="margin:30px auto;">TeenPatti真人场调控配置</h3>
            <el-form ref="cfg" :model="cfg">
                <el-form-item label="真人整体胜率调整系数(‱)：" :required="true">
                    <el-input v-model.number="cfg.usersAdjustRate"/>
                </el-form-item>
                <fieldset style="margin:20px auto;">
                    <legend>真人个体胜率调整配置</legend>
                    <p style="height:25px; line-height:25px;"><el-button type="primary" icon="el-icon-plus" size="mini" style="float:right;" @click="addItem()">添加</el-button></p>
                    <el-table :data="cfg.userWinRateAdjustConfig" border>
                        <el-table-column prop="level" label="幸运级别">
                            <template slot-scope="scope">
                            <el-input v-model.number="scope.row.level" placeholder="幸运级别" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="adjustValue" label="胜率调整(‱)">
                            <template slot-scope="scope">
                            <el-input v-model.number="scope.row.adjustValue" placeholder="胜率调整" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="app" label="删除" width="100">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini" style="float:right;" @click="delItem(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </fieldset>
                <fieldset style="margin:20px auto;">
                    <legend>机器人整体保护系数调整配置</legend>
                    <p style="height:25px; line-height:25px;"><el-button type="primary" icon="el-icon-plus" size="mini" style="float:right;" @click="addRobotItem()">添加</el-button></p>
                    <el-table :data="cfg.robotProtectRates" border>
                        <el-table-column prop="level" label="真人数量">
                            <template slot-scope="scope">
                            <el-input v-model.number="scope.row.realUserNum" placeholder="真人数量" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="adjustValue" label="保护系数(‱)">
                            <template slot-scope="scope">
                            <el-input v-model.number="scope.row.protectRate" placeholder="保护系数" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="app" label="删除" width="100">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini" style="float:right;" @click="delRobotItem(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </fieldset>
                <el-form-item style="margin-top: 20px; text-align: center;">
                    <el-button type="primary" @click="saveData">保存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
         <!--对比组件-->
        <compare ref="compare" :attr-names="AttrNames" />
    </div>
</template>
<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'

export default {
    components: { Compare, Publish },
    data() {
        return {
            cfg: {
                usersAdjustRate: 0,
                userWinRateAdjustConfig: [],
                robotProtectRates: []
            },
            subKey: "zjh_pro_schema_cfg",
            AttrNames: {
                'Data': '索引',
                types: {
                    Data: 'jsonString' // 整个数据项的类型
                }
            },
            form: {},
            libShow: $libShow,
        }
    },
    created() {
        console.log(1)
        this.getData()
    },
    methods: {
        addItem() {
            this.cfg.userWinRateAdjustConfig.push({"level":0, "adjustValue": 0});
        },
        delItem(index) {
            this.$delete(this.cfg.userWinRateAdjustConfig, index);
        },
        addRobotItem() {
            this.cfg.robotProtectRates.push({"realUserNum":0, "protectRate": 0});
        },
        delRobotItem(index) {
            this.$delete(this.cfg.robotProtectRates, index);
        },
        getData() {
            const $this = this
            request({
                url: '/customizeconfig/one',
                method: 'get',
                data: {
                SubKey: this.subKey
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    // console.log('sign reward', response)
                    $this.form = response.Data || { Data: '{}' }
                    $this.cfg = JSON.parse($this.form.Data)
                    // 设置修改之前数据
                    $this.$refs.compare.SetOldVal($this.form)
                }
            })
        },
        saveData() {
            const postData = {}
            Object.assign(postData, this.cfg)
            this.form.Data = JSON.stringify(postData)
            const $this = this
            // 设置修改后数据
            this.$refs.compare.SetNewVal(this.form);
            this.$refs.compare.Compare(function(isEdit) {
                if (!isEdit) {
                    Message.error('没有任何修改，不需要提交')
                    return
                }
                request({
                    url: 'customizeconfig/update',
                    method: 'post',
                    data: $this.form
                }).then(response => {
                if (response.RetCode === 0) {
                    Message.success('保存成功');
                }
                })
            });
        }
    }
}
</script>