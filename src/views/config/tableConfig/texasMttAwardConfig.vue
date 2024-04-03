<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" :check="configCheck" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table ref="filterTable" :data="rankData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData" >
        <el-table-column prop="" label="名次/人数" width="110" >
          <template slot-scope="scope">
            {{ scope.row.RankNum }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="2-10人" width="90" >
          <template slot-scope="scope">
            {{ scope.row.Num2_10 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="11-20人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num11_20 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="21-30人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num21_30 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="31-40人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num31_40 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="41-50人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num41_50 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="51-60人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num51_60 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="61-87人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num61_87 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="88-112人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num88_112 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="113-137人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num113_137 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="138-162人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num138_162 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="163-187人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num163_187 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="188-212人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num188_212 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="213-262人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num213_262 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="263-337人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num263_337 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="338-412人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num338_412 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="413-487人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num413_487 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="488-562人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num488_562 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="563-637人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num563_637 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="638-712人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num638_712 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="713-787人" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num713_787 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="788-862" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num788_862 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="863-937" width="90">
          <template slot-scope="scope">
            {{ scope.row.Num863_937 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="938-1012人" width="100">
          <template slot-scope="scope">
            {{ scope.row.Num938_1012 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="1013-1087人" width="110">
          <template slot-scope="scope">
            {{ scope.row.Num1013_1087 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="1088-1162人" width="110">
          <template slot-scope="scope">
            {{ scope.row.Num1088_1162 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="1163-1237人" width="110">
          <template slot-scope="scope">
            {{ scope.row.Num1163_1237 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="1238-1312人" width="110">
          <template slot-scope="scope">
            {{ scope.row.Num1238_1312 }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="1313人" width="110">
          <template slot-scope="scope">
            {{ scope.row.Num1313 }}
          </template>
        </el-table-column>
      </el-table>

    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="180px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="人数都乘以100,比如12.34%则填1234即可" label-width="320px" prop="" >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="最小名次:" :required="true" prop="item.MinRank" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.MinRank" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最大名次:" :required="true" prop="item.MaxRank" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.MaxRank" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="2-10人:" prop="item.Num2_10">
              <el-input v-model.number="edit.item.Num2_10" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="11-20人:" prop="item.Num11_20">
              <el-input v-model.number="edit.item.Num11_20" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="21-30人:" prop="item.Num21_30">
              <el-input v-model.number="edit.item.Num21_30" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="31-40人:" prop="item.Num31_40">
              <el-input v-model.number="edit.item.Num31_40" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>          
        </el-row>
          <el-col :span="11">
            <el-form-item label="41-50人:" prop="item.Num41_50">
              <el-input v-model.number="edit.item.Num41_50" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="51-60人:" prop="item.Num51_60">
              <el-input v-model.number="edit.item.Num51_60" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        <el-row>          
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="61-87人:" prop="item.Num61_87">
              <el-input v-model.number="edit.item.Num61_87" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="88-112人:" prop="item.Num88_112">
              <el-input v-model.number="edit.item.Num88_112" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="113-137人:" prop="item.Num113_137">
              <el-input v-model.number="edit.item.Num113_137" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="138-162人:" prop="item.Num138_162">
              <el-input v-model.number="edit.item.Num138_162" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="163-187人:" prop="item.Num163_187">
              <el-input v-model.number="edit.item.Num163_187" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="188-212人:" prop="item.Num188_212">
              <el-input v-model.number="edit.item.Num188_212" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="213-262人:" prop="item.Num213_262">
              <el-input v-model.number="edit.item.Num213_262" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="263-337人:" prop="item.Num263_337">
              <el-input v-model.number="edit.item.Num263_337" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="338-412人:" prop="item.Num338_412">
              <el-input v-model.number="edit.item.Num338_412" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="413-487人:" prop="item.Num413_487">
              <el-input v-model.number="edit.item.Num413_487" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="488-562人:" prop="item.Num488_562">
              <el-input v-model.number="edit.item.Num488_562" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="563-637人:" prop="item.Num563_637">
              <el-input v-model.number="edit.item.Num563_637" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="638-712人:" prop="item.Num638_712">
              <el-input v-model.number="edit.item.Num638_712" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="713-787人:" prop="item.Num713_787">
              <el-input v-model.number="edit.item.Num713_787" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="788-862人:" prop="item.Num788_862">
              <el-input v-model.number="edit.item.Num788_862" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="863-937人:" prop="item.Num863_937">
              <el-input v-model.number="edit.item.Num863_937" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="938-1012人:" prop="item.Num938_1012">
              <el-input v-model.number="edit.item.Num938_1012" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1013-1087人:" prop="item.Num1013_1087">
              <el-input v-model.number="edit.item.Num1013_1087" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="1088-1162人:" prop="item.Num1088_1162">
              <el-input v-model.number="edit.item.Num1088_1162" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1163-1237人:" prop="item.Num1163_1237">
              <el-input v-model.number="edit.item.Num1163_1237" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="1238-1312人:"  prop="item.Num1238_1312">
              <el-input v-model.number="edit.item.Num1238_1312" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1313人:" prop="item.Num1313">
              <el-input v-model.number="edit.item.Num1313" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
// import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import GameLevel from '@/components/GameLevel'
import MoneyInput from '@/components/MoneyInput'

const filterMap = {}

function newItem() {
  return {
    MinRank: 0,
    MaxRank: 0,
    Num2_10: 0,
    Num11_20: 0,
    Num21_30: 0,
    Num31_40: 0,
    Num41_50: 0,
    Num51_60: 0,
    Num61_87: 0,
    Num88_112: 0,
    Num113_137: 0,
    Num138_162: 0,
    Num163_187: 0,
    Num188_212: 0,
    Num213_262: 0,
    Num263_337: 0,
    Num338_412: 0,
    Num413_487: 0,
    Num488_562: 0,
    Num563_637: 0,
    Num638_712: 0,
    Num713_787: 0,
    Num788_862: 0,
    Num863_937: 0,
    Num938_1012: 0,
    Num1013_1087: 0,
    Num1088_1162: 0,
    Num1163_1237: 0,
    Num1238_1312: 0,
    Num1313: 0
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, GameLevel, MoneyInput },
  // components: { Compare, GameLevel, MoneyInput },
  data() {
    return {
      rankData: [],
      tableData: [],
      statNames: { 2: '上架', 6: '下架', 7: '预上架', 8: '预下架' },
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      subKey: 'texasMttAwardConfig',
      ID: 0,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },

      AttrNames: {
        Num2_10: '2_10人',
        Num11_20: '11_20人',
        Num21_30: '21_30人',
        Num31_40: '31_40人',
        Num41_50: '41_50人',
        Num51_60: '51_60人',
        Num61_87: '61_87人',
        Num88_112: '88_112人',
        Num113_137: '113_137人',
        Num138_162: '138_162人',
        Num163_187: '163_187人',
        Num188_212: '188_212人',
        Num213_262: '213_262人',
        Num263_337: '263_337人',
        Num338_412: '338_412人',
        Num413_487: '413_487人',
        Num488_562: '488_562人',
        Num563_637: '563_637人',
        Num638_712: '638_712人',
        Num713_787: '713_787人',
        Num788_862: '788_862人',
        Num863_937: '863_937人',
        Num938_1012: '938_1012人',
        Num1013_1087: '1013_1087人',
        Num1088_1162: '1088_1162人',
        Num1163_1237: '1163_1237人',
        Num1238_1312: '1238_1312人',
        Num1313: '1313人'
      }
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatTime2(ts) {
      return $libDate.FormateSecondStr(ts / 1000, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      this.edit.item = newItem()
      this.edit.item.ID = row.ID

      this.edit.item.MinRank = row.MinRank
      this.edit.item.MaxRank = row.MaxRank
      if (row.Num2_10 != '') {
        let a = row.Num2_10.split('%')        
        this.edit.item.Num2_10 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num11_20 != '') {
        let a = row.Num11_20.split('%')        
        this.edit.item.Num11_20 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num21_30 != '') {
        let a = row.Num21_30.split('%')        
        this.edit.item.Num21_30 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num31_40 != '') {
        let a = row.Num31_40.split('%')        
        this.edit.item.Num31_40 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num41_50 != '') {
        let a = row.Num41_50.split('%')        
        this.edit.item.Num41_50 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num51_60 != '') {
        let a = row.Num51_60.split('%')        
        this.edit.item.Num51_60 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num61_87 != '') {
        let a = row.Num61_87.split('%')        
        this.edit.item.Num61_87 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num88_112 != '') {
        let a = row.Num88_112.split('%')        
        this.edit.item.Num88_112 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num113_137 != '') {
        let a = row.Num113_137.split('%')        
        this.edit.item.Num113_137 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num138_162 != '') {
        let a = row.Num138_162.split('%')        
        this.edit.item.Num138_162 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num163_187 != '') {
        let a = row.Num163_187.split('%')        
        this.edit.item.Num163_187 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num188_212 != '') {
        let a = row.Num188_212.split('%')        
        this.edit.item.Num188_212 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num213_262 != '') {
        let a = row.Num213_262.split('%')        
        this.edit.item.Num213_262 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num263_337 != '') {
        let a = row.Num263_337.split('%')        
        this.edit.item.Num263_337 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num338_412 !== '') {
        let a = row.Num338_412.split('%')        
        this.edit.item.Num338_412 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num413_487 !== '') {
        let a = row.Num413_487.split('%')        
        this.edit.item.Num413_487 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num488_562 !== '') {
        let a = row.Num488_562.split('%')        
        this.edit.item.Num488_562 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num563_637 !== '') {
        let a = row.Num563_637.split('%')        
        this.edit.item.Num563_637 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num638_712 !== '') {
        let a = row.Num638_712.split('%')        
        this.edit.item.Num638_712 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num713_787 !== '') {
        let a = row.Num713_787.split('%')        
        this.edit.item.Num713_787 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num788_862 !== '') {
        let a = row.Num788_862.split('%')        
        this.edit.item.Num788_862 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num863_937 !== '') {
        let a = row.Num863_937.split('%')        
        this.edit.item.Num863_937 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num938_1012 !== '') {
        let a = row.Num938_1012.split('%')        
        this.edit.item.Num938_1012 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1013_1087 !== '') {
        let a = row.Num1013_1087.split('%')        
        this.edit.item.Num1013_1087 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1088_1162 !== '') {
        let a = row.Num1088_1162.split('%')        
        this.edit.item.Num1088_1162 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1163_1237 !== '') {
        let a = row.Num1163_1237.split('%')        
        this.edit.item.Num1163_1237 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1238_1312 !== '') {
        let a = row.Num1238_1312.split('%')        
        this.edit.item.Num1238_1312 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1313 !== '') {
        let a = row.Num1313.split('%')        
        this.edit.item.Num1313 = Math.floor(parseFloat(a[0]) * 100)
      }

      var oldData = JSON.stringify(this.edit.item)
      this.$refs.compare.SetOldVal(oldData)
      this.edit.isEdit = true
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    getList() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getList 1')
          // $this.form = response.Data || { Data: '{}' }
          // const v = JSON.parse($this.form.Data)
          // $this.cfg = v
          // console.log($this.cfg)
          // if ('TestCard' in this.cfg) {
          //   $this.TestCard = v.TestCard
          //   $this.TestCard2NewTestCards()
          // }
          // $this.JackpotConf = v.JackpotConf
          // // 设置修改之前数据
          // $this.$refs.compare.SetOldVal($this.form)
        } else {
          console.log('getList error response:', response)
        }
      })
    },
    configCheck() {
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },

    newRank() {
      return {
        ID: 0,
        MinRank: 0,
        MaxRank: 0,
        RankNum: '',
        Num2_10: '',
        Num11_20: '',
        Num21_30: '',
        Num31_40: '',
        Num41_50: '',
        Num51_60: '',
        Num61_87: '',
        Num88_112: '',
        Num113_137: '',
        Num138_162: '',
        Num163_187: '',
        Num188_212: '',
        Num213_262: '',
        Num263_337: '',
        Num338_412: '',
        Num413_487: '',
        Num488_562: '',
        Num563_637: '',
        Num638_712: '',
        Num713_787: '',
        Num788_862: '',
        Num863_937: '',
        Num938_1012: '',
        Num1013_1087: '',
        Num1088_1162: '',
        Num1163_1237: '',
        Num1238_1312: '',
        Num1313: ''
      }
    },
    tmpSave(a) {
      a.MinRank = this.edit.item.MinRank
      a.MaxRank = this.edit.item.MaxRank
      a.RankNum = this.edit.item.MinRank + '-' + this.edit.item.MaxRank
      if (this.edit.item.Num2_10 > 0) {
        a.Num2_10 = this.edit.item.Num2_10 / 100 + '%'
      }
      if (this.edit.item.Num11_20 > 0) {
        a.Num11_20 = this.edit.item.Num11_20 / 100 + '%'
      }
      if (this.edit.item.Num21_30 > 0) {
        a.Num21_30 = this.edit.item.Num21_30 / 100 + '%'
      }
      if (this.edit.item.Num31_40 > 0) {
        a.Num31_40 = this.edit.item.Num31_40 / 100 + '%'
      }
      if (this.edit.item.Num41_50 > 0) {
        a.Num41_50 = this.edit.item.Num41_50 / 100 + '%'
      }
      if (this.edit.item.Num51_60 > 0) {
        a.Num51_60 = this.edit.item.Num51_60 / 100 + '%'
      }
      if (this.edit.item.Num61_87 > 0) {
        a.Num61_87 = this.edit.item.Num61_87 / 100 + '%'
      }
      if (this.edit.item.Num88_112 > 0) {
        a.Num88_112 = this.edit.item.Num88_112 / 100 + '%'
      }
      if (this.edit.item.Num113_137 > 0) {
        a.Num113_137 = this.edit.item.Num113_137 / 100 + '%'
      }
      if (this.edit.item.Num138_162 > 0) {
        a.Num138_162 = this.edit.item.Num138_162 / 100 + '%'
      }
      if (this.edit.item.Num163_187 > 0) {
        a.Num163_187 = this.edit.item.Num163_187 / 100 + '%'
      }
      if (this.edit.item.Num188_212 > 0) {
        a.Num188_212 = this.edit.item.Num188_212 / 100 + '%'
      }
      if (this.edit.item.Num213_262 > 0) {
        a.Num213_262 = this.edit.item.Num213_262 / 100 + '%'
      }
      if (this.edit.item.Num263_337 > 0) {
        a.Num263_337 = this.edit.item.Num263_337 / 100 + '%'
      }
      if (this.edit.item.Num338_412 > 0) {
        a.Num338_412 = this.edit.item.Num338_412 / 100 + '%'
      }
      if (this.edit.item.Num413_487 > 0) {
        a.Num413_487 = this.edit.item.Num413_487 / 100 + '%'
      }
      if (this.edit.item.Num488_562 > 0) {
        a.Num488_562 = this.edit.item.Num488_562 / 100 + '%'
      }
      if (this.edit.item.Num563_637 > 0) {
        a.Num563_637 = this.edit.item.Num563_637 / 100 + '%'
      }
      if (this.edit.item.Num638_712 > 0) {
        a.Num638_712 = this.edit.item.Num638_712 / 100 + '%'
      }
      if (this.edit.item.Num713_787 > 0) {
        a.Num713_787 = this.edit.item.Num713_787 / 100 + '%'
      }
      if (this.edit.item.Num788_862 > 0) {
        a.Num788_862 = this.edit.item.Num788_862 / 100 + '%'
      }
      if (this.edit.item.Num863_937 > 0) {
        a.Num863_937 = this.edit.item.Num863_937 / 100 + '%'
      }
      if (this.edit.item.Num938_1012 > 0) {
        a.Num938_1012 = this.edit.item.Num938_1012 / 100 + '%'
      }
      if (this.edit.item.Num1013_1087 > 0) {
        a.Num1013_1087 = this.edit.item.Num1013_1087 / 100 + '%'
      }
      if (this.edit.item.Num1088_1162 > 0) {
        a.Num1088_1162 = this.edit.item.Num1088_1162 / 100 + '%'
      }
      if (this.edit.item.Num1163_1237 > 0) {
        a.Num1163_1237 = this.edit.item.Num1163_1237 / 100 + '%'
      }
      if (this.edit.item.Num1238_1312 > 0) {
        a.Num1238_1312 = this.edit.item.Num1238_1312 / 100 + '%'
      }
      if (this.edit.item.Num1313 > 0) {
        a.Num1313 = this.edit.item.Num1313 / 100 + '%'
      }
    },
    createSave() {
      // this.NewTestCard2TestCards()
      // this.cfg.JackpotConf = this.JackpotConf
      // this.cfg.TestCard = this.TestCard
      // const postData = JSON.parse(JSON.stringify(this.cfg))
      // this.form.Data = JSON.stringify(postData)
      // console.log(this.form.Data)
      const $this = this
      var newData = JSON.stringify(this.edit.item)
      // 设置修改后数据
      this.$refs.compare.SetOldVal({})
      this.$refs.compare.SetNewVal(newData)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        console.log('createSave 1')
        // request({
        //   url: 'customizeconfig/update',
        //   method: 'post',
        //   data: $this.form
        // }).then(response => {
        //   if (response.RetCode === 0) {
        //     Message.success('保存成功')
        //   }
        // })
        var a = $this.newRank()
        $this.ID++
        a.ID = this.ID
        $this.tmpSave(a)      
        $this.rankData.push(a)
      })      
    },
    editSave() {
      var tmpid = this.edit.item.ID
      for (let i = 0; i < this.rankData.length; i++) {
        var a = this.rankData[i]
        if (a.ID !== tmpid) {
          continue
        }
        const $this = this
        var newData = JSON.stringify(this.edit.item)
        this.$refs.compare.SetNewVal(newData)     
        this.$refs.compare.Compare(function(isEdit) {
          if(!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          }
          $this.tmpSave(a)
        })
        return
      }
    },
    getPostData() {
      const postData = JSON.parse(JSON.stringify(this.edit.item))
      return postData
    },
    checkData() {
      // TODO 完善
      if (this.edit.item.MinRank > this.edit.item.MaxRank) {
        Message.warning('最小名次不能大于最大名次')
        return false
      }
      if (this.edit.item.MinRank === 0 && this.edit.item.MaxRank === 0) {
        Message.warning('最小名次和最大名次不可以都是0')
        return false
      }
      return true
    },
    save() {
      if (!this.checkData()) return
      if (this.edit.isEdit) {
        // // 设置修改后数据
        // this.$refs.compare.SetNewVal(this.edit.item)
        // const $this = this
        // this.$refs.compare.Compare(function(isEdit) {
        //   if (!isEdit) {
        //     Message.error('没有任何修改，不需要提交')
        //     return
        //   } else {
        //     $this.editSave($this.getPostData())
        //   }
        // })
        this.editSave()
      } else {
        // this.createSave(this.getPostData())
        this.createSave()
      }
      this.edit.visible = false
    }
  }
}
</script>
