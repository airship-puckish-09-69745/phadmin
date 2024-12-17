<template>
    <div>
      <el-card class="box-card">
        <el-input placeholder="" v-model="version.path" disabled>
            <template slot="prepend">文件路径</template>
        </el-input>
        <el-input placeholder="" v-model="version.ver" disabled>
            <template slot="prepend">当前版本</template>
        </el-input>
        <el-input placeholder="" v-model="version.desc"  disabled>
            <template slot="prepend">版本信息</template>
        </el-input>
      </el-card>
      <el-card class="box-card">
        <el-input placeholder="请输入版本" v-model="curr">
            <template slot="prepend">新增版本</template>
        </el-input>
        <el-input width="300" placeholder="请输入信息" v-model="desc">
            <template slot="prepend">填写信息</template>
        </el-input>
        <el-button size="mini" type="primary" icon="el-icon-message" @click="setRecord">同步</el-button>
      </el-card>
    </div>
</template> 

<script>
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
    props: ['data', 'value'],
    data() {
        return {
            show: false,
            item: {},
            version: {
                path:'',
                ver:'',
                desc:'',
            },
            temp_ver: {},
            curr: this.getTimeFormat(),
            desc: '',
            list: []
        }
    },
    created() {
        this.env = store.getters.env || this.env
        this.isDisabled = false
        this.getRecord()
    },
    watch: {
        value(newValue) { // 处理父组件值变化后的逻辑
            console.log('父组件的值变化了：', newValue);
            this.show = newValue
            if (newValue) {
                this.getRecord()
                this.curr = this.getTimeFormat()
                this.desc = ''
            }
        }
    },
    methods: {
        onChange(val) {
            this.$emit('input', val)  // input很重要,将改变后的值写给value
        },
        getRecord(){
            request({
                url: '/customizeconfig/one',
                method: 'get',
                data: {
                    SubKey: 'whitelist_cdn_config'
                }
            }).then(response => {
                // console.log('cfg', JSON.stringify(response))
                if (response.RetCode === 0) {
                    this.item = response.Data || ''
                    if (response.Data !== '') {
                        this.list = JSON.parse(response.Data.Data)
                        if (this.list.length > 0) {
                            this.version = this.list[this.list.length-1]
                        }
                    }
                }
            })
        },
        setRecord(){
            this.temp_ver = {
                path: '/lobby/whitelist/',
                ver: this.curr + '.json',
                desc:this.desc
            }
            this.list.push(this.temp_ver)
            this.item.Data = JSON.stringify(this.list)
            request({
                url: '/customizeconfig/update',
                method: 'post',
                data: this.item
            }).then(response => {
                // console.log('cfg', JSON.stringify(response))
                if (response.RetCode === 0) {
                    console.log("setRecord success")
                    this.syncConfigToCDN()
                } else {
                    this.list.pop()
                }
            })
        },
        syncConfigToCDN(){
            const str = this.data.Data
            console.log(this.data.Data)

            // 创建Blob对象来容纳JSON文本数据，指定类型为application/json
            const blob = new Blob([str], { type: 'application/json' });
                
            // 可以通过创建File对象进一步关联文件名（虽然实际上没创建物理文件）
            const fileName = `${this.curr}.json`
            const file = new File([blob], fileName, { type: 'application/json' });
            request({
                url: '/file/upload',
                method: 'post',
                data: {
                    category: `lobby/whitelist/`,
                    file: file,
                }
            }).then(response => {
                console.log(JSON.stringify(response))
                if (response.RetCode === 0) {
                    Message.success('保存成功')
                    this.version = this.temp_ver
                    this.desc = ''
                } else {
                    Message.success('保存失败')
                }
            })
        },
        getTimeFormat(){
            // 20241205_144527
            const now = new Date();
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const dateFormat = year + month + day + '_' + hours + minutes + seconds;
            return dateFormat
        }
    }
}
</script>