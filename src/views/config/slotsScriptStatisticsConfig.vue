<template>
  <div class="app-container">

    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="脚本统计配置">
        <publish
          primary-key="Volume"
          :key-id="getFullKey(this.subKey)"
          :env-empty="false"
          compare-type="Object"
          :attr-names="AttrNames"
        />
        <el-row :gutter="10" style="margin-top: 30px">
          <el-col :span="15">
            <el-form inline>
              <!--            <el-form-item>-->
              <!--              <el-button type="primary" size="mini" @click="refresh">查询</el-button>-->
              <!--            </el-form-item>-->
            </el-form>

          </el-col>
          <el-col :span="15"/>
          <el-row :gutter="10" style="margin-top: 30px" type="flex" align="middle">
            <el-col :span="10">
              <el-button type="primary" size="mini" @click="addOne">添加</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
            </el-col>
            <el-col v-if="version === 'V2'" :span="10">
              <el-select size="mini" v-model="appId" placeholder="请选择" @change="onAppIdChange">
                <el-option v-for="(o,idx) in appOptions" :key="idx" :label="o.label" :value="o.value" />
              </el-select>
              <el-button type="primary" size="mini" icon="el-icon-document-copy" @click="onCopyAllCfg">
                复制配置
              </el-button>
            </el-col>
          </el-row>

          <el-col :span="24">
            <el-form ref="tableData" v-model="tableData" label-width="150px">
              <el-table
                ref="filterTable"
                :data="tableData"
                stripe
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  prop="Gid"
                  label="游戏"
                >
                  <template slot-scope="scope">
                <span v-for="(item, index) in gameOptions" :key="index">
                  {{ (scope.row.Gid == item.key ? item.label : "") }}
                </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Gid"
                  label="基础投注"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Bet }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="StepCfg"
                  label="统计步数"
                >
                  <template slot-scope="scope">
                    {{ scope.row.StepCfg }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="JackpotShowBet"
                  label="奖池显示缩小配置"
                >
                  <template slot-scope="scope">
                    {{ scope.row.JackpotShowBet }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Gid"
                  label="区间"
                  width="1100"
                >
                  <template slot-scope="scope">
                <span v-for="(data,idx) in scope.row.OddsList">
                   <el-tag>{{ data.MinOdds + "," + data.MaxOdds }}</el-tag>
                </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <br>
              <br>
              <br>
              <el-form-item>
                <el-button type="primary" @click="setData">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-col :offset="16" :span="8">
          <div class="block">
            <el-pagination
              :current-page="clientDB.GetPage().GetCurrentPage()"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="clientDB.GetPage().GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDB.GetPage().GetTotalCount()"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
        <!--对比组件-->
        <compare ref="compare"/>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="选择游戏"
      :visible.sync="selectGameVisible"
      width="700px"
    >
      <el-form label-width="150px" inline>
        <el-form-item label="游戏">
          <el-select v-model="item.Gid" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础投注">
          <el-input-number v-model="item.Bet"></el-input-number>
        </el-form-item>
        <el-form-item label="奖池显示缩小配置">
          <el-input-number v-model="item.JackpotShowBet"></el-input-number>
        </el-form-item>
        <el-form-item label="统计步数">
          <el-input-number v-model.number="item.StepCfg"></el-input-number>
        </el-form-item>
        <el-form-item label="不存在的倍数(英文逗号分割)">
          <el-input v-model="item.AbnormalSteps" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOddsList" size="mini">添加区间</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-form label-width="150px">
        <span v-if="item.OddsList.length>0" v-for="(row,idx) in item.OddsList">
          <el-col :span="10">
           <el-form-item label="区间最小值>">
            <el-input-number v-model.number="row.MinOdds" size="mini"/>
        </el-form-item>
        </el-col>
        <el-col :span="10">
         <el-form-item label="≤区间最大值">
            <el-input-number v-model.number="row.MaxOdds" size="mini"/>
        </el-form-item>
         </el-col>
           <el-col :span="1" style="margin-left: -100px">
            <el-form-item>
            <el-button type="danger" @click="delOddsList(idx)" size="mini">删除</el-button>
          </el-form-item>
          </el-col>
       </span>


        </el-form>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-button v-if="showBtn==0" type="primary" @click="addGameItem">确定</el-button>
          <el-button v-if="showBtn==1" type="primary" @click="saveEdit">确认修改</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {$libShow, ClientTableData} from '@/utils/common'
import {createCustomize, getCustomize, updateCustomize} from "@/api/custome_configV2";
import store from "@/store";

const filterMap = {}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},

  data() {
    return {
      form: {},
      postData: {},
      subKey: 'SlotsScriptStatisticsConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      showBtn: 0,
      libShow: $libShow,
      item: {
        Gid: 0,
        OddsList: [{MinOdds: 0, MaxOdds: 0}],
        Bet: 0,
        StepCfg:0,
        JackpotShowBet:0,
        AbnormalSteps:'',
      },
      selectGameVisible: false,
      gameOptions: [],
      dialogGameOptions: [],

      scriptTableData: [],
      coordinateTableData: [],
      queryTime: new Date().getTime(),
      loading: false,
      cfgMap: {},
      appOptions: [
        { value: 0, label: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1',
      bCreateCfg: false
    }
  },
  created() {
    this.getData()
    this.getGameList()
    this.getAppInfos()
  },
  methods: {

    refresh() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleClick(tab, event) {
      if (parseInt(tab.index) == 0) {
        this.getSlotsScriptStatistics()
      }

    },
    newItem() {
      return this.item
    },
    addOne() {
      this.item = {
        Gid: 0,
      },
        this.showBtn = 0
      this.selectGameVisible = true
    },

    addGameItem() {
      if (this.item.Gid === 0) {
        Message.error('请选择游戏！')
        return
      }
      if (!this.checkDuplicate(this.item)) {
        Message.error('已存在相同游戏！')
        return
      }

      this.clientDB.AddData(this.item)
      this.selectGameVisible = false
      this.refresh()
    },
    delOddsList(idx) {
      this.item.OddsList.splice(idx, 1)
    },
    editRow(idx, row) {
      this.idx = idx
      this.item.Gid = row.Gid
      this.item.Bet = row.Bet
      this.item.JackpotShowBet = row.JackpotShowBet
      this.item.OddsList = row.OddsList
      this.item.StepCfg= row.StepCfg
      this.item.AbnormalSteps= row.AbnormalSteps
      this.showBtn = 1
      this.selectGameVisible = true
    },
    delRow(idx, row) {
      // this.tableData.splice(idx, 1)
      this.clientDB.DelData2("Gid",this.tableData[idx].Gid)
      this.refresh()
    },
    addOddsList() {
      if (!this.item.OddsList) {
        this.item['OddsList'] = []
      }
      let parse = JSON.parse(JSON.stringify(this.item));
      parse.OddsList.push({
        MinOdds: 0,
        MaxOdds: 0
      })

      var parr = this.item;
      this.item['OddsList'] = !parse['OddsList'];
      this.item = parse;


    },
    saveEdit() {
      if (!this.checkDuplicate(this.item, this.idx)) {
        Message.error('已存在相同游戏！')
        return
      }
      var parse = JSON.parse(JSON.stringify(this.item))
      this.tableData[this.idx] = parse
      this.selectGameVisible = false
      this.clientDB.UpdateData2("Gid", parse)
      console.log(parse)
      this.refresh()
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      getCustomize(this.subKey, this.appId).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || []
          $this.postData = response.Data || []
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            for (let o of cfg) {
              console.log(o.OddsList)
              let bet = o.Bet
              for (let i = 0; i < o.OddsList.length; i++) {
                o.OddsList[i].MaxOdds += parseInt(bet)
                o.OddsList[i].MinOdds += parseInt(bet)
              }
              this.cfgMap[o.Gid] = o.OddsList
            }
            this.clientDB = new ClientTableData(cfg, 10, filterMap, 'Gid', -1)
            this.$refs.compare.SetOldVal(response.Data)
            this.refresh()
          }
        } else {
          if (store.getters.appId === this.appId) {
            this.bCreateCfg = true
            console.log('this.bCreateCfg', this.bCreateCfg)
          }
        }
      })
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refresh()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refresh()
    },
    setData() {
      const cfg = this.getCfg()
      this.postData.Data = JSON.stringify(cfg)
      const $this = this
      if (this.bCreateCfg) {
        this.form.AppId = store.getters.appId
        this.form.Type = 1
        createCustomize(this.postData).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功！')
          }
        })
      } else {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.postData)
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          }

          updateCustomize($this.postData).then(response => {
            if (response.RetCode === 0) {
              Message.success('保存成功')
            }
          })
        })
      }
    },
    getCfg() {
      const cfg = []
      let data =this.clientDB.ShowData
      for (const i in data) {
        const item = JSON.parse(JSON.stringify(data[i]))
        cfg.push(item)
      }
      for (let o of cfg) {
        let bet =  o.Bet

        for (let i = 0; i < o.OddsList.length; i++) {
          o.OddsList[i].MaxOdds -= parseInt(bet)
          o.OddsList[i].MinOdds -= parseInt(bet)
        }
      }
      return cfg
    },
    checkDuplicate(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === this.idx && this.tableData[i].Gid === data.Gid) {
          continue
        }
        if (this.tableData[i].Gid === data.Gid) {
          return false
        }
      }
      return true
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || (response.Data[i].Gid > 499 && response.Data[i].Gid !== 1236)) {
              continue
            }
            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
        }
      })
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    onAppIdChange() {
      if (this.appId === 0) {
        const $this = this
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: this.subKey
          }
        }).then(response => {
          $this.form = response.Data || []
          $this.postData = response.Data || []
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            for (let o of cfg) {
              console.log(o.OddsList)
              let bet = o.Bet
              for (let i = 0; i < o.OddsList.length; i++) {
                o.OddsList[i].MaxOdds += parseInt(bet)
                o.OddsList[i].MinOdds += parseInt(bet)
              }
              this.cfgMap[o.Gid] = o.OddsList
            }
            this.clientDB = new ClientTableData(cfg, 10, filterMap, 'Gid', -1)
            this.refresh()
          }
        })
      } else {
        this.getData()
      }
    },
    onCopyAllCfg() {
      this.setData()
      this.bCreateCfg = false
    }
  }
}
</script>
