<template>
    <div>
        <el-col :span="11">
            <el-form-item
              label="最小携带："
              :required="true"
              prop="item.CarryLower"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input
                :value="CarryLower"
                @input="$emit('update:CarryLower', $event)"
                placeholder="请输入" 
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="最大携带："
              :required="true"
              prop="item.CarryUpper"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-input 
                :value="CarryUpper"
                @input="$emit('update:CarryUpper', $event)"
                placeholder="请输入" 
              />
            </el-form-item>
        </el-col>
    </div>
</template>

<script>
import {  DataRule } from '@/utils/common'
export default {
    name: 'TableCarryInput',
    props: {
        CarryLower: {
            type: [String, Number],
            default: ''
        },
        CarryUpper:{
            type: [String, Number],
            default: ''
        },
    },
    emits: ['update:CarryLower','update:CarryUpper',],
    
    // created 钩子里的问题：TableMoneyCfg 需要通过 this 访问
    created() {
       
    },
    
    // 添加一个 watch 监听配置变化
    watch: {
        
    },
    methods:{
        dataRule(required, config) {
            return DataRule(required, config)
        },
    }
}
</script>