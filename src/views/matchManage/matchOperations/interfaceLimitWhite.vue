<template>
    <div class="app-container">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
      <el-row style="margin-top: 30px;padding-top:30px;">
        <el-form :inline="true" :model="editForm">
          <el-form-item label="白名单Uid">
            <el-input v-model.number="editForm.uid" placeholder="Uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addWhite">添加</el-button>
          </el-form-item>
        </el-form>

        <el-button size="mini" type="primary" @click="saveCfg()">
            保存白名单
        </el-button>
      </el-row>
      <el-row :gutter="10" style="margin-top: 30px">
        <h3 style="text-align:center;">比赛接口白名单(白名单可见,上线后要把白名单全部删掉)</h3>
        <el-col :span="24">
            <div style="padding-top: 10px">
            <el-table
                :data="white_list"
                stripe
                border
                style="width: 100%"
            >
                <el-table-column
                label="UID"
                prop="uid"
                />
                <el-table-column
                label="操作"
                >
                <template scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="delRow(scope.row)"
                    >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </el-col>
      </el-row>

      <!--对比组件-->
      <compare ref="compare" />

    </div>
  </template>

  <script>
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'

  export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { Compare, Publish },
    data() {
      return {
        activeTab: 'base',
        white_list: [],
        raw:{},
        editForm:{
          "uid":"",
        },
        subKey: 'match_interface_limit_white',
        AttrNames:{},
        isVisibleDialog:false
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },

      getData() {
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: this.subKey
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.baseForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const cfg = JSON.parse(response.Data.Data)
              this.white_list = cfg
              // 设置修改之前数据
              this.$refs.compare.SetOldVal(response.Data.Data);
              this.raw = response.Data;
            }
          }
        })
      },

      addWhite() {
        console.log("save: ",this.editForm)
        for(let i=0 ; i<this.white_list.length;i++){
            if(this.white_list[i].uid == this.editForm.uid) {
                this.$message.error('存在相同的UID')
                return
            }
        }
        this.white_list.push({
            "uid":this.editForm.uid,
        });
        return
      },
      delRow(row){
        let newList = [];
        for (const key in this.white_list) {
            if(this.white_list[key].uid == row.uid) {
               continue
            }
            newList.push(this.white_list[key])
        }
        this.white_list = newList
      },
      saveCfg(){
        this.raw.Data = JSON.stringify(this.white_list)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: this.raw
        }).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
          }
        })
      }
    }
  }
  </script>
