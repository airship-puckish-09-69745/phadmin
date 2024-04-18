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
      <el-table ref="filterTable" :data="rankData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData">
        <el-table-column prop="" label="名次/人数" width="110">
          <template slot-scope="scope">
            {{ scope.row.RankNum }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="2-10人" width="90">
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
            <el-form-item label="人数都乘以100,比如12.34%则填1234即可" label-width="320px" prop="" />
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
              <el-input v-model.number="edit.item.Num2_10" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="11-20人:" prop="item.Num11_20">
              <el-input v-model.number="edit.item.Num11_20" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="21-30人:" prop="item.Num21_30">
              <el-input v-model.number="edit.item.Num21_30" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="31-40人:" prop="item.Num31_40">
              <el-input v-model.number="edit.item.Num31_40" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="11">
          <el-form-item label="41-50人:" prop="item.Num41_50">
            <el-input v-model.number="edit.item.Num41_50" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="51-60人:" prop="item.Num51_60">
            <el-input v-model.number="edit.item.Num51_60" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
          </el-form-item>
        </el-col>
        <el-row />
        <el-row>
          <el-col :span="11">
            <el-form-item label="61-87人:" prop="item.Num61_87">
              <el-input v-model.number="edit.item.Num61_87" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="88-112人:" prop="item.Num88_112">
              <el-input v-model.number="edit.item.Num88_112" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="113-137人:" prop="item.Num113_137">
              <el-input v-model.number="edit.item.Num113_137" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="138-162人:" prop="item.Num138_162">
              <el-input v-model.number="edit.item.Num138_162" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="163-187人:" prop="item.Num163_187">
              <el-input v-model.number="edit.item.Num163_187" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="188-212人:" prop="item.Num188_212">
              <el-input v-model.number="edit.item.Num188_212" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="213-262人:" prop="item.Num213_262">
              <el-input v-model.number="edit.item.Num213_262" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="263-337人:" prop="item.Num263_337">
              <el-input v-model.number="edit.item.Num263_337" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="338-412人:" prop="item.Num338_412">
              <el-input v-model.number="edit.item.Num338_412" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="413-487人:" prop="item.Num413_487">
              <el-input v-model.number="edit.item.Num413_487" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="488-562人:" prop="item.Num488_562">
              <el-input v-model.number="edit.item.Num488_562" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="563-637人:" prop="item.Num563_637">
              <el-input v-model.number="edit.item.Num563_637" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="638-712人:" prop="item.Num638_712">
              <el-input v-model.number="edit.item.Num638_712" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="713-787人:" prop="item.Num713_787">
              <el-input v-model.number="edit.item.Num713_787" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="788-862人:" prop="item.Num788_862">
              <el-input v-model.number="edit.item.Num788_862" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="863-937人:" prop="item.Num863_937">
              <el-input v-model.number="edit.item.Num863_937" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="938-1012人:" prop="item.Num938_1012">
              <el-input v-model.number="edit.item.Num938_1012" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1013-1087人:" prop="item.Num1013_1087">
              <el-input v-model.number="edit.item.Num1013_1087" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="1088-1162人:" prop="item.Num1088_1162">
              <el-input v-model.number="edit.item.Num1088_1162" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1163-1237人:" prop="item.Num1163_1237">
              <el-input v-model.number="edit.item.Num1163_1237" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="1238-1312人:" prop="item.Num1238_1312">
              <el-input v-model.number="edit.item.Num1238_1312" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="1313人:" prop="item.Num1313">
              <el-input v-model.number="edit.item.Num1313" placeholder="请输入" :rules="dataRule(true,{type:'n',range:'0'})" />
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
      form: {},
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
    getPostData() {
      var pData = []
      for (let i = 0; i < this.rankData.length; i++) {
        const row = this.rankData[i]
        const tmpData = this.doPostData(row)
        if (tmpData.MinMaxNumList.length > 0) {
          pData.push(tmpData)
        }
      }
      return pData
    },

    newMinMaxRankData(minRank, maxRank, numList) {
      return {
        MinRank: minRank,
        MaxRank: maxRank,
        MinMaxNumList: numList
      }
    },

    newMinMaxNumData(minNum, maxNum, percent) {
      return {
        MinNum: minNum,
        MaxNum: maxNum,
        Percent: percent
      }
    },

    addMinMaxNumData(row, nn, minMaxNumList, minNum, maxNum) {
      if (nn != '') {
        const a = nn.split('%')
        const b = Math.floor(parseFloat(a[0]) * 100)
        const c = this.newMinMaxNumData(minNum, maxNum, b)
        minMaxNumList.push(c)
      }
    },

    doPostData(row) {
      var minMaxNumList = []
      this.addMinMaxNumData(row, row.Num2_10, minMaxNumList, 2, 10)
      this.addMinMaxNumData(row, row.Num11_20, minMaxNumList, 11, 20)
      this.addMinMaxNumData(row, row.Num21_30, minMaxNumList, 21, 30)
      this.addMinMaxNumData(row, row.Num31_40, minMaxNumList, 31, 40)
      this.addMinMaxNumData(row, row.Num41_50, minMaxNumList, 41, 50)
      this.addMinMaxNumData(row, row.Num51_60, minMaxNumList, 50, 60)
      this.addMinMaxNumData(row, row.Num61_87, minMaxNumList, 61, 87)
      this.addMinMaxNumData(row, row.Num88_112, minMaxNumList, 88, 112)
      this.addMinMaxNumData(row, row.Num113_137, minMaxNumList, 113, 137)
      this.addMinMaxNumData(row, row.Num138_162, minMaxNumList, 138, 162)
      this.addMinMaxNumData(row, row.Num163_187, minMaxNumList, 163, 187)
      this.addMinMaxNumData(row, row.Num188_212, minMaxNumList, 188, 212)
      this.addMinMaxNumData(row, row.Num213_262, minMaxNumList, 213, 262)
      this.addMinMaxNumData(row, row.Num263_337, minMaxNumList, 263, 337)
      this.addMinMaxNumData(row, row.Num338_412, minMaxNumList, 338, 412)
      this.addMinMaxNumData(row, row.Num413_487, minMaxNumList, 413, 487)
      this.addMinMaxNumData(row, row.Num488_562, minMaxNumList, 488, 562)
      this.addMinMaxNumData(row, row.Num563_637, minMaxNumList, 563, 637)
      this.addMinMaxNumData(row, row.Num638_712, minMaxNumList, 638, 712)
      this.addMinMaxNumData(row, row.Num713_787, minMaxNumList, 713, 787)
      this.addMinMaxNumData(row, row.Num788_862, minMaxNumList, 788, 862)
      this.addMinMaxNumData(row, row.Num863_937, minMaxNumList, 863, 937)
      this.addMinMaxNumData(row, row.Num938_1012, minMaxNumList, 938, 1012)
      this.addMinMaxNumData(row, row.Num1013_1087, minMaxNumList, 1013, 1087)
      this.addMinMaxNumData(row, row.Num1088_1162, minMaxNumList, 1088, 1162)
      this.addMinMaxNumData(row, row.Num1163_1237, minMaxNumList, 1163, 1237)
      this.addMinMaxNumData(row, row.Num1238_1312, minMaxNumList, 1238, 1312)
      this.addMinMaxNumData(row, row.Num1313, minMaxNumList, 1313, 1313)

      return this.newMinMaxRankData(row.MinRank, row.MaxRank, minMaxNumList)
    },

    assignData(tmpData, row) {
      tmpData.ID = row.ID
      tmpData.MinRank = row.MinRank
      tmpData.MaxRank = row.MaxRank
      if (row.Num2_10 != '') {
        const a = row.Num2_10.split('%')
        tmpData.Num2_10 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num11_20 != '') {
        const a = row.Num11_20.split('%')
        tmpData.Num11_20 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num21_30 != '') {
        const a = row.Num21_30.split('%')
        tmpData.Num21_30 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num31_40 != '') {
        const a = row.Num31_40.split('%')
        tmpData.Num31_40 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num41_50 != '') {
        const a = row.Num41_50.split('%')
        tmpData.Num41_50 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num51_60 != '') {
        const a = row.Num51_60.split('%')
        tmpData.Num51_60 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num61_87 != '') {
        const a = row.Num61_87.split('%')
        tmpData.Num61_87 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num88_112 != '') {
        const a = row.Num88_112.split('%')
        tmpData.Num88_112 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num113_137 != '') {
        const a = row.Num113_137.split('%')
        tmpData.Num113_137 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num138_162 != '') {
        const a = row.Num138_162.split('%')
        tmpData.Num138_162 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num163_187 != '') {
        const a = row.Num163_187.split('%')
        tmpData.Num163_187 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num188_212 != '') {
        const a = row.Num188_212.split('%')
        tmpData.Num188_212 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num213_262 != '') {
        const a = row.Num213_262.split('%')
        tmpData.Num213_262 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num263_337 != '') {
        const a = row.Num263_337.split('%')
        tmpData.Num263_337 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num338_412 !== '') {
        const a = row.Num338_412.split('%')
        tmpData.Num338_412 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num413_487 !== '') {
        const a = row.Num413_487.split('%')
        tmpData.Num413_487 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num488_562 !== '') {
        const a = row.Num488_562.split('%')
        tmpData.Num488_562 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num563_637 !== '') {
        const a = row.Num563_637.split('%')
        tmpData.Num563_637 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num638_712 !== '') {
        const a = row.Num638_712.split('%')
        tmpData.Num638_712 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num713_787 !== '') {
        const a = row.Num713_787.split('%')
        tmpData.Num713_787 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num788_862 !== '') {
        const a = row.Num788_862.split('%')
        tmpData.Num788_862 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num863_937 !== '') {
        const a = row.Num863_937.split('%')
        tmpData.Num863_937 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num938_1012 !== '') {
        const a = row.Num938_1012.split('%')
        tmpData.Num938_1012 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1013_1087 !== '') {
        const a = row.Num1013_1087.split('%')
        tmpData.Num1013_1087 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1088_1162 !== '') {
        const a = row.Num1088_1162.split('%')
        tmpData.Num1088_1162 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1163_1237 !== '') {
        const a = row.Num1163_1237.split('%')
        tmpData.Num1163_1237 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1238_1312 !== '') {
        const a = row.Num1238_1312.split('%')
        tmpData.Num1238_1312 = Math.floor(parseFloat(a[0]) * 100)
      }
      if (row.Num1313 !== '') {
        const a = row.Num1313.split('%')
        tmpData.Num1313 = Math.floor(parseFloat(a[0]) * 100)
      }
    },

    // 操作类函数
    clickData(row, column, event) {
      this.edit.item = newItem()
      this.assignData(this.edit.item, row)
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
          $this.form = response.Data || { Data: '{}' }
          // console.log('getList 1 form:', $this.form)
          $this.rankData = $this.do_get_data(JSON.parse($this.form.Data), $this)
          // console.log('getList 2 rankData:', $this.rankData)
        } else {
          console.log('getList error response:', response)
        }
      })
    },

    do_get_data(formData, oldthis) {
      // console.log('do_get_data 1 formData:', formData)
      var tmpRankDataList = []
      for (let i = 0; i < formData.length; i++) {
        const tmpRankData = oldthis.newRank()
        tmpRankData.MinRank = formData[i].MinRank
        tmpRankData.MaxRank = formData[i].MaxRank
        tmpRankData.RankNum = formData[i].MinRank + '_' + formData[i].MaxRank
        const tmpList = formData[i].MinMaxNumList
        for (let j = 0; j < tmpList.length; j++) {
          if (tmpList[j].MinNum == 2) {
            tmpRankData.Num2_10 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 11) {
            tmpRankData.Num11_20 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 21) {
            tmpRankData.Num21_30 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 31) {
            tmpRankData.Num31_40 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 41) {
            tmpRankData.Num41_50 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 51) {
            tmpRankData.Num51_60 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 61) {
            tmpRankData.Num61_87 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 88) {
            tmpRankData.Num88_112 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 113) {
            tmpRankData.Num113_137 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 138) {
            tmpRankData.Num138_162 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 163) {
            tmpRankData.Num163_187 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 188) {
            tmpRankData.Num188_212 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 213) {
            tmpRankData.Num213_262 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 263) {
            tmpRankData.Num263_337 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 338) {
            tmpRankData.Num338_412 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 413) {
            tmpRankData.Num413_487 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 488) {
            tmpRankData.Num488_562 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 563) {
            tmpRankData.Num563_637 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 638) {
            tmpRankData.Num638_712 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 713) {
            tmpRankData.Num713_787 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 788) {
            tmpRankData.Num788_862 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 863) {
            tmpRankData.Num863_937 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 938) {
            tmpRankData.Num938_1012 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 1013) {
            tmpRankData.Num1013_1087 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 1088) {
            tmpRankData.Num1088_1162 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 1163) {
            tmpRankData.Num1163_1237 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 1238) {
            tmpRankData.Num1238_1312 = tmpList[j].Percent / 100 + '%'
          } else if (tmpList[j].MinNum == 1313) {
            tmpRankData.Num1313 = tmpList[j].Percent / 100 + '%'
          }
        }
        tmpRankDataList.push(tmpRankData)
      }
      return tmpRankDataList
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
    tmpSave(a, dst) {
      a.MinRank = dst.MinRank
      a.MaxRank = dst.MaxRank
      a.RankNum = dst.MinRank + '-' + dst.MaxRank
      if (dst.Num2_10 > 0) {
        a.Num2_10 = dst.Num2_10 / 100 + '%'
      }
      if (dst.Num11_20 > 0) {
        a.Num11_20 = dst.Num11_20 / 100 + '%'
      }
      if (dst.Num21_30 > 0) {
        a.Num21_30 = dst.Num21_30 / 100 + '%'
      }
      if (dst.Num31_40 > 0) {
        a.Num31_40 = dst.Num31_40 / 100 + '%'
      }
      if (dst.Num41_50 > 0) {
        a.Num41_50 = dst.Num41_50 / 100 + '%'
      }
      if (dst.Num51_60 > 0) {
        a.Num51_60 = dst.Num51_60 / 100 + '%'
      }
      if (dst.Num61_87 > 0) {
        a.Num61_87 = dst.Num61_87 / 100 + '%'
      }
      if (dst.Num88_112 > 0) {
        a.Num88_112 = dst.Num88_112 / 100 + '%'
      }
      if (dst.Num113_137 > 0) {
        a.Num113_137 = dst.Num113_137 / 100 + '%'
      }
      if (dst.Num138_162 > 0) {
        a.Num138_162 = dst.Num138_162 / 100 + '%'
      }
      if (dst.Num163_187 > 0) {
        a.Num163_187 = dst.Num163_187 / 100 + '%'
      }
      if (dst.Num188_212 > 0) {
        a.Num188_212 = dst.Num188_212 / 100 + '%'
      }
      if (dst.Num213_262 > 0) {
        a.Num213_262 = dst.Num213_262 / 100 + '%'
      }
      if (dst.Num263_337 > 0) {
        a.Num263_337 = dst.Num263_337 / 100 + '%'
      }
      if (dst.Num338_412 > 0) {
        a.Num338_412 = dst.Num338_412 / 100 + '%'
      }
      if (dst.Num413_487 > 0) {
        a.Num413_487 = dst.Num413_487 / 100 + '%'
      }
      if (dst.Num488_562 > 0) {
        a.Num488_562 = dst.Num488_562 / 100 + '%'
      }
      if (dst.Num563_637 > 0) {
        a.Num563_637 = dst.Num563_637 / 100 + '%'
      }
      if (dst.Num638_712 > 0) {
        a.Num638_712 = dst.Num638_712 / 100 + '%'
      }
      if (dst.Num713_787 > 0) {
        a.Num713_787 = dst.Num713_787 / 100 + '%'
      }
      if (dst.Num788_862 > 0) {
        a.Num788_862 = dst.Num788_862 / 100 + '%'
      }
      if (dst.Num863_937 > 0) {
        a.Num863_937 = dst.Num863_937 / 100 + '%'
      }
      if (dst.Num938_1012 > 0) {
        a.Num938_1012 = dst.Num938_1012 / 100 + '%'
      }
      if (dst.Num1013_1087 > 0) {
        a.Num1013_1087 = dst.Num1013_1087 / 100 + '%'
      }
      if (dst.Num1088_1162 > 0) {
        a.Num1088_1162 = dst.Num1088_1162 / 100 + '%'
      }
      if (dst.Num1163_1237 > 0) {
        a.Num1163_1237 = dst.Num1163_1237 / 100 + '%'
      }
      if (dst.Num1238_1312 > 0) {
        a.Num1238_1312 = dst.Num1238_1312 / 100 + '%'
      }
      if (dst.Num1313 > 0) {
        a.Num1313 = dst.Num1313 / 100 + '%'
      }
    },

    createSave() {
      const $this = this
      var bkRankData = JSON.parse(JSON.stringify(this.rankData))
      var newData = JSON.stringify(this.edit.item)
      // 设置修改后数据
      this.$refs.compare.SetOldVal({})
      this.$refs.compare.SetNewVal(newData)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        var a = $this.newRank()
        $this.ID++
        a.ID = this.ID
        $this.tmpSave(a, $this.edit.item)
        $this.rankData.push(a)
        const postData = $this.getPostData()
        console.log('createSave 1', postData)
        $this.form.Data = JSON.stringify(postData)

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          } else {
            $this.rankData = bkRankData
            Message.success('保存失败')
          }
        })
      })
    },
    editSave() {
      var bkRankData = JSON.parse(JSON.stringify(this.rankData))
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
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          }
          $this.tmpSave(a, $this.edit.item)
          const postData = $this.getPostData()
          $this.form.Data = JSON.stringify(postData)
          console.log('editSave 1', postData)
          request({
            url: 'customizeconfig/update',
            method: 'post',
            data: $this.form
          }).then(response => {
            if (response.RetCode === 0) {
              Message.success('保存成功')
            } else {
              $this.rankData = bkRankData
              Message.success('保存失败')
            }
          })
        })
        return
      }
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
      if (!this.checkData()) { return }
      if (this.edit.isEdit) {
        this.editSave()
      } else {
        this.createSave()
      }
      this.edit.visible = false
    }
  }
}
</script>
