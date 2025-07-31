<template>
    <div class="app-container">
      <el-row>
        <el-form label-width="90px" :inline="true" size="small">
          <el-form-item label="游戏id" :required="true" label-width="80px">
            <!--          <el-select></el-select>-->
          </el-form-item>
          <el-form-item>
            <el-select v-model.number="gameId" placeholder="请选择">
              <el-option
                v-for="item in gameIds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="桌子id" :required="true" label-width="80px">
            <!--          <el-select></el-select>-->
          </el-form-item>
          <el-form-item>
            <el-input v-model="tid" />
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
            <el-button type="info" size="mini" @click="reSyncTable">再次同步桌子数据</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      
      <el-row>
        <h3>桌子信息</h3>
        <json-viewer :value="debugInfo.oneTableInfo" />
      </el-row>

      <el-row>
        <h3>场次信息</h3>
        <el-table
            :data="debugInfo.LevelStatistics"
            border
            >
            <el-table-column
            label="场次"
            width="180">
                <template slot-scope="scope">
                    {{scope.row.MaxSeatNum}}人场/底注：{{ scope.row.Level/1000 }}
                </template>
            </el-table-column>
            <el-table-column
            prop="Total"
            label="桌子总数"
            width="180">
            </el-table-column>
            <el-table-column
            prop="Free"
            label="空闲总数"
            width="180">
            </el-table-column>
            <el-table-column
            label="已使用桌子"
            width="180">
                <template slot-scope="scope">
                    {{scope.row.Total - scope.row.Free }}
                </template>
            </el-table-column>
            <el-table-column
            label="机器人桌子数量"
            width="180">
                <template slot-scope="scope">
                    {{scope.row.RobotTableNum}}
                </template>
            </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <h3>游戏实例信息</h3>
        <el-table
            :data="debugInfo.InstanceStatistics"
            border
            >
            <el-table-column
            label="实例"
            prop="Sid"
            width="180">
            </el-table-column>
            <el-table-column
            prop="Total"
            label="桌子总数"
            width="180">
            </el-table-column>
            <el-table-column
            prop="Free"
            label="空闲总数"
            width="180">
            </el-table-column>
            <el-table-column
            label="已使用桌子"
            width="180">
                <template slot-scope="scope">
                    {{scope.row.Total - scope.row.Free }}
                </template>
            </el-table-column>
            <el-table-column
            label="场次信息">
                <template slot-scope="props">
                    <el-table
                        :data="props.row.LevelInfo"
                        border
                        >
                        <el-table-column
                        label="场次"
                        width="180">
                            <template slot-scope="scope">
                                {{scope.row.MaxSeatNum}}人场/底注：{{ scope.row.Level/1000 }}
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="Total"
                        label="桌子总数"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="Free"
                        label="空闲总数"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        label="已使用桌子"
                        width="180">
                            <template slot-scope="scope">
                                {{scope.row.Total - scope.row.Free }}
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="机器人桌子数量"
                        width="180">
                            <template slot-scope="scope">
                                {{scope.row.RobotTableNum}}
                            </template>
                        </el-table-column>  
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <h3>在玩桌子简要信息</h3>
        <el-table
            :data="debugInfo.playing"
            border
            >
            <el-table-column
            label="标识"
            width="380">
            >
                <template slot-scope="scope">
                    {{getKeyInfo(scope.row.key)}}
                </template>
            </el-table-column>
            <el-table-column
            label="在玩桌子(最多20个)"
            >
                <template slot-scope="props">
                    <el-table
                        :data="props.row.top"
                        border
                        >
                        <el-table-column
                            prop="tid"
                            label="桌子ID"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="score"
                            label="积分"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="robotNum"
                            label="机器人数量"
                        >
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
      </el-row>
    </div>
  
  </template>
  
  <script>
  
  import request from '@/utils/request'
  import { Message } from 'element-ui'
  import JsonViewer from 'vue-json-viewer'
  
  export default {
    components: { Message, request,JsonViewer },
    data() {
      return {
        gameIds: [
            {
                value: 22,
                label: 'Tongits-pot'
            },
            {
                value: 28,
                label: 'Tongits-Joker'
            },
            {
                value: 29,
                label: 'Tongits-Quick'
            },
            {
                value: 31,
                label: 'Tongits 经典'
            }, 
            {
                value: 23,
                label: 'Lucky9'
            }, 
            // {
            //     value: 15,
            //     label: ' 德州扑克'
            // }, 
            {
                value: 21,
                label: 'Pusoy'
            }, 
            {
                value: 34,
                label: 'PusoyDos'
            },
            {
                value: 128,
                label: 'TongitsJP'
            },
            {
                value: 129,
                label: 'LiveColor'
            }
        ],
        tableData: [],
        gameId: 34,
        tid:'',
        debugInfo:{
            LevelStatistics:[],
            InstanceStatistics:[],
            oneTableInfo:{},
            playing:[]
        }
      }
    },
    created() {
     
    },
    mounted() {
    },
    methods: {
      getInfo() {
        const $this = this
        request({
            url: '/dataProxy/info',
            method: 'get',
            data: {
                Path: '/alloc/debug',
                gid: this.gameId,
                tid: this.tid
            }
        }).then(response => {
            console.log("返回消息===>",response)
            if (response.RetCode === 0) {
                if(this.tid>0){
                    $this.debugInfo.oneTableInfo = {}
                    if(response.Data.oneTableInfo != ""){
                        $this.debugInfo.oneTableInfo = JSON.parse(response.Data.oneTableInfo);
                    }
                    return
                }
                $this.debugInfo = { //reset
                    LevelStatistics:[],
                    InstanceStatistics:[],
                    oneTableInfo:{},
                    playing:[]
                }
                
                if(response.Data.LevelStatistics != "") {
                    $this.debugInfo.LevelStatistics = []
                    let one = JSON.parse(response.Data.LevelStatistics)
                    for(let k in one){
                        $this.debugInfo.LevelStatistics.push(one[k])
                    }
                    //排序
                    $this.debugInfo.LevelStatistics.sort((a,b)=>{ return a.Level-b.Level })
                }
                if(response.Data.InstanceStatistics != "") {
                    let one = JSON.parse(response.Data.InstanceStatistics)
                    for(let k in one){
                        let data = one[k];
                        data.LevelInfo = []
                        for(let j in data.Level){
                            data.LevelInfo.push(data.Level[j])
                        }
                        $this.debugInfo.InstanceStatistics.push(one[k])
                    }
                    //排序
                    $this.debugInfo.InstanceStatistics.sort((a,b)=>{ return a.Sid-b.Sid })
                }
                $this.debugInfo.playing = response.Data.playing;
            }
        })
      },
      getKeyInfo(key){
        let arr = key.split("_")
        let str = ""
        for(let i in arr){
            let sub = arr[i].split(":")
            if(sub.length != 2) {
                continue
            }
            if(sub[0] == "money"){
                str += "场次:"+sub[1]/1000+" "
            }else if(sub[0] == "seatNum"){
                str += sub[1]+"人场  "
            }else{
                 str += sub[0]+":"+sub[1]+" "
            }
        }
        return str;
      },
      reSyncTable(){
        const $this = this
        this.$confirm('是否确定再次同步桌子，此操作仅开发人员使用', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            request({
                url: '/dataProxy/info',
                method: 'get',
                data: {
                    Path: '/alloc/resync',
                    gid: this.gameId
                }
            }).then(response => {
                console.log("resync response:",response)
                if (response.RetCode === 0) {
                    Message.success('同步成功')
                }
            }).catch(() => {
                console.log('取消')
            })
        })
      }
    }
  }
  
  </script>
  