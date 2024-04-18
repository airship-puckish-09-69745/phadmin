<template>
  <div class="app-container">

    <publish
      primary-key="Volume"
      :key-id="getFullKey(this.subKey)"
      :env-empty="false"
      compare-type="Object"
      :attr-names="AttrNames"
    />
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="24">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <fieldset style="width: 80%;   margin: auto;">
        <legend>基础配置 </legend>
        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="showData.StartTime"
                  value-format="timestamp"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item v-model="showData.EndTime" label="结束时间" required>
                <el-date-picker
                  v-model="showData.EndTime"
                  value-format="timestamp"
                  type="date"
                  placeholder="选择结束时间"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="有效时间" required>
                <el-input v-model="showData.BoxActiveTime" oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="差异比例" required>
                <el-input v-model.number="showData.DisparityRatio" type="number" oninput=" if(value < 0 || value == '' || value == null)value = 0;  ">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="发放间隔" required>
                <el-input v-model="showData.IssueInterval" oninput=" if(value < 0 || value == '' || value == null){value = 0;}else {value=parseInt(value)}">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item label="更新时间" required>
                {{ parseTime(showData.UpdateTime,'') }}
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </fieldset>

      <fieldset style="width: 80%;   margin: auto;">
        <legend>宝箱配置 </legend>
        <el-col :span="22">
          <el-button type="primary" size="mini" @click="addOne">添加</el-button>
        </el-col>
        <el-col :span="24">
          <el-form ref="showData" v-model="showData.Boxes" label-width="150px">
            <el-table
              :data="showData.Boxes"
              style="width: 95%"
              border
              :header-cell-style="{textAlign: 'center'}"
              :row-style="{height:'10px'}"
              :cell-style="libShow.DefaultTableCell"
            >
              <el-table-column
                prop="IssueAmount"
                label="发放金额"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.IssueAmount" type="number" oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}" />
                </template>
              </el-table-column>

              <el-table-column
                prop="IssuePlayers"
                label="发放玩家"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.IssuePlayers" type="number" oninput="if(value < 0 || value == '' || value == null){value = 0;}else {value = parseInt(value)}" />
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            <!--            <el-table-column label="操作">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            </el-table>
            <br>
            <br>
            <br>
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </fieldset>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { formatTime, parseTime } from '../../../../utils'

const filterMap = {}

import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import { copyObj } from 'codemirror/src/util/misc'
import { $libShow, ClientTableData } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      form: {},
      postData: {},
      subKey: 'poker_topic_random_box_setting',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      showData: {},
      allCfg: [],
      appInfo: [],
      item: {
        IssueAmount: 0,
        IssuePlayers: 0
      },
      selectGid: 0,
      libShow: $libShow,
      gameOptions: {}
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {
    parseTime,

    refresh() {
      this.showData = this.allCfg
      return
    },

    newItem() {
      return JSON.parse(JSON.stringify(this.item))
    },
    addOne() {
      this.showData.Boxes.push(this.newItem())
    },
    deleteRow(idx, row) {
      this.showData.Boxes.splice(idx, 1)
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.postData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            $this.showData = cfg
            $this.showData.StartTime *= 1000
            $this.showData.EndTime *= 1000
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkData(cfg)) {
        return false
      }

      const $this = this
      $this.postData.Data = JSON.stringify(cfg)
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal($this.postData.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const cfg = JSON.parse(JSON.stringify(this.showData))
      cfg.StartTime = parseInt(cfg.StartTime / 1000)
      cfg.EndTime = parseInt(cfg.EndTime / 1000)

      return cfg
    },
    checkData(cfg) {
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
            this.gameOptions[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    }
  }
}
</script>
<style>
.el-form-item__label-wrap {
  margin-left: 0px !important;
}
</style>
