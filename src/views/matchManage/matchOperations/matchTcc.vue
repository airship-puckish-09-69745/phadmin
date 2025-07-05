<template>
    <div class="app-container">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
      <el-row style="margin-top: 30px;padding-top:30px;">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="add()">
            添加名单
        </el-button>

        <el-button size="mini" type="primary" @click="saveCfg()">
            保存名单
        </el-button>
      </el-row>
      <el-row :gutter="10" style="margin-top: 30px">
        <h3 style="text-align:center;">TCC 名单</h3>
        <el-col :span="24">
            <div style="padding-top: 10px">
            <el-table
                :data="tcc_list"
                stripe
                border
                style="width: 100%"
            >
                <el-table-column
                label="日期"
                >
                <template slot-scope="scope">
                    {{ getDate(scope.row.match_date) }}
                </template>
                </el-table-column>
                <el-table-column
                label="名次"
                prop="match_rank"
                />
                <el-table-column
                label="平台账号"
                prop="account"
                />
                <el-table-column
                label="UID"
                prop="uid"
                />
                <el-table-column
                label="递补顺位"
                prop="fill"
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
        <el-dialog
        title="编辑"
        :visible.sync="isVisibleDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        >
        <el-form ref="editForm" :model="editForm" label-width="250px" size="small">
            <el-form-item v-model="editForm.match_date" label="日期">
                  <el-date-picker
                    v-model="editForm.match_date"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    size="mini"
                  />
            </el-form-item>
            <el-form-item label="名次">
                <el-input v-model.number="editForm.match_rank"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="editForm.account"></el-input>
            </el-form-item>
            <el-form-item label="UID">
                <el-input v-model.number="editForm.uid"></el-input>
            </el-form-item>
            <el-form-item label="递补顺位">
                <el-input v-model.number="editForm.fill"></el-input>
            </el-form-item>
            <el-form-item>
            <el-row>
                <el-col :span="15" :offset="10">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                </el-col>
            </el-row>
            </el-form-item>
        </el-form>
        </el-dialog>
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
        tcc_list: [],
        editForm: {
            "match_date":0,
            "match_rank":0,
            "uid":0,
            "account":"",
            "fill":0
        },
        raw:{},
        subKey: 'match_tcc_info',
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
      getDate(val){
        var date = new Date(val*1000);
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).substr(-2);
        var day = ("0" + date.getDate()).substr(-2);
        return year + "-" + month + "-" + day ;
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
              this.tcc_list = cfg
              // 设置修改之前数据
              this.$refs.compare.SetOldVal(response.Data.Data);
              this.raw = response.Data;
            }
          }
        })
      },
  
      save() {
        console.log("save: ",this.editForm)
        this.editForm.match_date = this.editForm.match_date / 1000 
        for(let i=0 ; i<this.tcc_list.length;i++){
            if(this.tcc_list[i].match_date == this.editForm.match_date && this.tcc_list[i].uid == this.editForm.uid) {
                this.$message.error('存在相同的日期和UID')
                return 
            }
        }
        this.tcc_list.push({
            "match_date":this.editForm.match_date,
            "match_rank":this.editForm.match_rank,
            "uid":this.editForm.uid,
            "account":this.editForm.account,
            "fill":this.editForm.fill
        });
        this.isVisibleDialog = false
        return
        
      },
      add(){
        this.editForm = {
            "match_date":0,
            "match_rank":0,
            "uid":0,
            "account":"",
            "fill":0
        }
        this.isVisibleDialog = true
      },
      delRow(row){
        let newList = [];
        for (const key in this.tcc_list) {
            if(this.tcc_list[key].match_date == row.match_date && this.tcc_list[key].uid == row.uid) {
               continue
            }
            newList.push(this.tcc_list[key])
        }
        this.tcc_list = newList
      },
      saveCfg(){
        this.raw.Data = JSON.stringify(this.tcc_list)
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
  