<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="230px">

          <el-form-item label="骨头倍数">
            <el-input v-model="cfg.BoneMultiStr" placeholder="请输入内容,如1,2,3,5,7">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="骨头倍数权重">
            <el-input v-model="cfg.BoneMultiWeight" placeholder="请输入内容,如10,10,10,10,10">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="bonus额外倍数">
            <el-input v-model="cfg.BonusMultiExStr" placeholder="请输入内容,如10,10,10,10,10">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="bonus额外倍数权重">
            <el-input v-model="cfg.BonusMultiExWeight" placeholder="请输入内容,如10,10,10,10,10">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金币倍数">
            <el-input v-model="cfg.BonusMultiStr" placeholder="请输入内容,如1,2,3,5,7">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="金币倍数权重">
            <el-input v-model="cfg.BonusMultiWeight" placeholder="请输入内容,如10,10,10,10,10">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item v-for="(item, index) in cfg.BonusTypeStr" :key="'BonusTypeStr-' + index"
                        :label="getBonusLabel(index)">
            <el-input v-model="cfg.BonusTypeStr[index]" :placeholder="'请输入内容,如1,2,3,5,7'">
              <template slot="append">用 , 连接</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Bonus模式金币出现概率" prop="BonusSymbolRate" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BonusSymbolRate" :required="true">
              <template slot="append">％</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Bonus模式购买倍数" prop="BuyFreeOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.BuyFreeOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="进入Bonus模式的最小赔率" prop="ScatterOdds" :rules="dataRule(true,{type:'n'})">
            <el-input v-model.number="cfg.ScatterOdds" :required="true"/>
          </el-form-item>

          <el-form-item label="购买Bonus模式中奖倍数范围V2">
            <el-input v-model="cfg.BuyFreeOddsRangeV2" placeholder="请输入内容,如0,150,151,750">
              <template slot="append">四个值用 , 连接。如0,150,151,750表示0,150和151,750</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买Bonus模式中奖左范围概率V2">
            <el-input v-model.number="cfg.BuyFreeRateV2" placeholder="请输入内容,如800">
              <template slot="append">‰</template>
            </el-input>
          </el-form-item>

          <el-form-item label="购买Bonus模式中奖倍数分布V2">
            <el-input v-model="cfg.BuyFreeDistributeV2" placeholder="请输入内容,如250,500,70,501,750,50">
              <template slot="append">三个值一组用 , 连接。</template>
            </el-input>
          </el-form-item>
          <el-table
            :data="cfg.BonusSpinCfg"
            stripe
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
            :key="tableKey">
            <el-table-column
              type="index"
              width="70px"
            >
              <template #header>
                <el-button type="primary" @click="addItem(cfg,newBonusSpinCfg(),'BonusSpinCfg')" size="mini">添加
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="OddsMin"
              label="倍数区间开始值"
              width="120"
            >
              <template slot-scope="scope">
                <el-col :span="20">
                  <el-input v-model.number="scope.row.OddsMin" size="mini"
                            oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column
              label="倍数区间结束值"
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.OddsMax" size="mini"
                          oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
              </template>
            </el-table-column>
            <el-table-column
              label="填充最少不中奖次数(不包括末尾三次)"
              width="160"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.MissTimesMin" size="mini"
                          oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
              </template>
            </el-table-column>
            <el-table-column
              label="填充最多不中奖次数(不包括末尾三次)"
              width="160"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.MissTimesMax" size="mini"
                          oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="CardType"
              label="编辑"
              width="350"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleCfsEdit(scope.row, scope.$index,'BonusNumCfg')">
                  图标数量配置
                </el-button>
                <el-button style="background: #ffcc4b" size="mini"
                           @click="handleCfsEdit(scope.row, scope.$index,'BonusHitCfg')">图标增加配置
                </el-button>
                <el-button type="danger" size="mini" @click="delItem(cfg, scope.$index,'BonusSpinCfg')">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
      v-if="edit.BonusNumCfgVisible"
      title="配置详情"
      :visible.sync="edit.BonusNumCfgVisible"
      width="60%">
      <el-table
        :data="edit.editData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        :key="tableKey"
      >
        <el-table-column
          type="index"
          width="80px"
        >
          <template #header>
            <el-button type="primary" @click="appendItem(edit.editData, newBonusNumCfg())" size="mini">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="NumberMin"
          label="数量最小值"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.NumberMin" size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="NumberMin"
          label="数量最大值"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.NumberMax" size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="Weight"
          label="出现权重"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Weight" size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="delArrayItem(edit.editData,scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog
      v-if="edit.BonusHitCfgVisible"
      title="配置详情"
      :visible.sync="edit.BonusHitCfgVisible"
      width="60%">
      <el-table
        :data="edit.editData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        :key="tableKey"
      >
        <el-table-column
          type="index"
          width="80px"
        >
          <template #header>
            <el-button type="primary" @click="appendItem(edit.editData, newBonusHitCfg())" size="mini">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="AddBonusNum"
          label="单次中奖增加Bonus数量"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.AddBonusNum" size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="Weight"
          label="出现权重"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Weight" size="mini"
                      oninput=" if(value < 0 || value === '' || value == null){value = 0;}"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="delArrayItem(edit.editData,scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>
    <!--    <el-dialog   title="Domino Detail" :visible.sync="false" width="1200px">-->

    <!--    </el-dialog>-->
    <!--对比组件-->
    <compare ref="compare"/>
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'
import {$libShow, DataRule, ValidateVueItem} from '@/utils/common'
export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsPuppyHomeExt',
  components: {RatioInput, Compare},
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {},
      tableKey:0,
      edit:{
        editData:[],
        idx:0,
        BonusNumCfgVisible:false,
        BonusHitCfgVisible:false,
      },
      libShow:$libShow,
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    newBonusSpinCfg() {
      return {OddsMin: 0, OddsMax: 0, MissTimesMin: 0, MissTimesMax: 0, BonusNumCfg: [], BonusHitCfg: []}
    },
    newBonusNumCfg() {
      return {NumberMin: 0, NumberMax: 0, Weight:0}
    },
    newBonusHitCfg() {
      return {AddBonusNum: 0,  Weight:0}
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      if (!ValidateVueItem(this.$refs['frm2'])) return false
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    },
    getBonusLabel(index) {
      // 根据索引返回对应的标签文本
      const labels = ['铜币', '银币', '金币', '金币+']
      return labels[index] || '未知' // 默认返回 "未知" 以防止超出索引范围
    },
    addItem(data, obj, name) {
      console.log(data, obj, name)
      if (!data[name]) {
        this.$set(data, name, []);
      }
      data[name].push(obj)
      this.tableKey+=1
    },
    appendItem(array, obj) {
      console.log(array, obj)
      if (array) {
        array.push(obj);
      }
      this.tableKey += 1
    },
    delItem(data, idx, name) {
      if (data[name]) {
        data[name].splice(idx, 1)
      }
    },
    delArrayItem(array, idx) {
      if (array) {
        array.splice(idx, 1)
      }
    },
    handleCfsEdit(data,idx,name) {
      this.edit.editData = data[name]
      this.edit.idx = idx
      if (name==='BonusNumCfg'){
        this.edit.BonusNumCfgVisible = true
      }else if(name==='BonusHitCfg'){
        this.edit.BonusHitCfgVisible = true
      }
    },
  }
}
</script>
