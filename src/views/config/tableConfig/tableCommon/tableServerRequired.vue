<template>
    <div>
        <el-row>
            <el-col :span="9">
                <el-form-item
                label="桌子数量："
                :required="true"
                prop="item.ObjectCount"
                :rules="dataRule(true,{type:'n',range:'1'})"
                >
                <el-input
                    :value="ObjectCount"
                    @input="$emit('update:ObjectCount', $event)"
                    placeholder="桌子数量" 
                />
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-tooltip class="item" effect="dark" content="修改需要重启游戏服" placement="left-start">
                <i class="el-icon-info" />
                </el-tooltip>
            </el-col>
            <el-col :span="11">
                <el-form-item
                label="操作时长(秒)："
                :required="true"
                prop="item.ActionSeconds"
                :rules="dataRule(true,{type:'n',range:'5'})"
                >
                    <el-input
                        :value="ActionSeconds"
                        @input="$emit('update:ActionSeconds', $event)"
                        placeholder="操作时长" 
                    />
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
                    <el-input 
                    :value="FlowRate"
                    @input="$emit('update:FlowRate', $event)" 
                    placeholder="请输入" 
                    />
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-tooltip class="item" effect="dark" content="抽3%，则填写0.03" placement="left-start">
                <i class="el-icon-info" />
                </el-tooltip>
            </el-col>
            <el-col :span="11">
                <el-form-item label="等级：" :required="true">
                    <el-select 
                        :value="GameLevel" 
                        size="mini" 
                        @change="$emit('update:GameLevel', $event)"
                        >
                        <el-option
                            v-for="item in LevelCfg"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>

                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form-item label="渠道隐藏场次">
                    <el-checkbox-group v-model="HideChannel" @change="saveHideChannel">
                        <el-checkbox v-for="channel in ChannelCfg" :label="channel" :key="channel">{{channel}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {  DataRule } from '@/utils/common'
export default {
    name: 'TableServerRequired',
    props: {
        ObjectCount: {
            type: [String, Number],
            default: ''
        },
        ActionSeconds: {
            type: [String, Number],
            default: ''
        },
        FlowRate: {
            type: [String, Number],
            default: ''
        },
        GameLevel: {
            type: [String, Number],
            default: ''
        },
        LevelCfg: {
            type: Array,
            default: () => [

            ]  // 默认空数组
        },
        TableHideChannel:{
            type: [String],
            default: ''
        },
    },
    emits: ['update:ObjectCount','update:ActionSeconds',"update:FlowRate","update:GameLevel"],
    
    // created 钩子里的问题：TableMoneyCfg 需要通过 this 访问
    created() {
        console.log('TableServerRequired 组件已创建，配置:', this.LevelCfg)
        // 初始化 HideChannel
        if (this.TableHideChannel !== "") {
            this.HideChannel = this.TableHideChannel.split(",")
        }
    },
    
    // 添加一个 watch 监听配置变化
    watch: {
        // 监听父组件传来的 TableHideChannel 变化
        TableHideChannel: {
            immediate: true,
            handler(newVal) {
                if (newVal !== "") {
                    this.HideChannel = newVal.split(",")
                } else {
                    this.HideChannel = []
                }
            }
        }
    },
    methods:{
        dataRule(required, config) {
            return DataRule(required, config)
        },
        //
        saveHideChannel(value){
            this.HideChannel = value
            
            // 通知父组件更新
            if (value.length > 0) {
                const newValue = value.join(",")
                this.$emit('update:TableHideChannel', newValue)
                console.log("change table hide: ", newValue)
            } else {
                this.$emit('update:TableHideChannel', '')
                console.log("清空 table hide")
            }
        }
    },
    data() {
        return {
            ChannelCfg:[
                "GP","BP","AP","CP"
            ],
            HideChannel:[],
        }
    }
}
</script>