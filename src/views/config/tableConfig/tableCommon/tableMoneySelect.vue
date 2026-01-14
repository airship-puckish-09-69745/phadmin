<template>
    <div>
    <el-col :span="11">
        <el-form-item label="底注：" :required="true" prop="item.TableMoney">
            <el-select 
                :value="TableMoney" 
                placeholder="请选择" 
                :disabled="IsEdit" 
                @change="$emit('update:TableMoney', $event)"
                clearable
            >
                <el-option
                    v-for="item in TableMoneyCfg"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
    </el-col>
    <el-col :span="9">
         <el-form-item
              label="隐藏目标值："
              :required="true"
              prop="item.HideCarry"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input 
                :value="HideCarry"
                @input="$emit('update:HideCarry', $event)"
                placeholder="请输入" 
                />
        </el-form-item>
    </el-col>
    <el-col :span="2">
        <el-tooltip class="item" effect="dark" content="如果有值，且玩家携带达到此值，则隐藏盖场次" placement="left-start">
            <i class="el-icon-info" />
        </el-tooltip>
    </el-col>
    </div>
</template>

<script>
    import {  DataRule } from '@/utils/common'
export default {
    name: 'TableMoneySelect',
    props: {
        TableMoney: {
            type: [String, Number],
            default: ''
        },
        IsEdit: {
            type: Boolean,
            default: false
        },
        TableMoneyCfg: {
            type: Array,
            default: () => []  // 默认空数组
        },
        HideCarry:{
            type: [String, Number],
            default: ''
        },
    },
    emits: ['update:TableMoney','update:HideCarry',],
    
    // created 钩子里的问题：TableMoneyCfg 需要通过 this 访问
    created() {
        console.log('TableMoneySelect 组件已创建，配置:', this.TableMoneyCfg)
    },
    
    // 添加一个 watch 监听配置变化
    watch: {
        TableMoneyCfg: {
            immediate: true,
            handler(newVal) {
                console.log('TableMoneyCfg 配置更新:', newVal)
            }
        },
        
        TableMoney(newVal) {
            console.log('TableMoney 值更新为:', newVal)
        }
    },
    methods:{
        dataRule(required, config) {
            return DataRule(required, config)
        },
    }
}
</script>