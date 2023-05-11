<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="8" :offset="4">
      <h3 align="center" style="margin:30px auto;">各子游戏基准值消耗数额与有效下注比例</h3>
      <el-form ref="cfg" :model="cfg">
        <template v-for="(items, gid) in cfg">
          <p style="margin-top: 50px;clear:both;">[{{games[gid]}}] <el-button type="primary" icon="el-icon-plus" size="mini" style="float:right;" @click="addItem(gid)">添加</el-button></p>
          <el-table :data="items" border>
            <el-table-column prop="app" label="应用ID" width="200">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.app" placeholder="应用ID"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="rate" label="基准值消耗数额与有效下注比例">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.rate" placeholder="比例"><template slot="append">‰</template></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="app" label="删除" width="100">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" style="float:right;" @click="delItem(gid, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="saveData">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfg: {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": [],
        "10": [],
        "13": [],
        "14": [],
        "15": [],
        "16": [],
        "17": [],
        "18": [],
        "19": [],
        "20": [],
        "21": [],
        "22": [],
        "23": [],
      },
      games: {
        "1": "Rummy",
        "2": "AndarBahar",
        "3": "龙虎斗",
        "4": "JhandiMunda",
        "5": "CarRoulette",
        "6": "7up7down",
        "7": "黑红梅方",
        "8": "AK47",
        "9": "TeenPatti",
        "10": "Crash",
        "13": "TeenPatti百人场",
        "14": "TeenPatti真人场",
        "15": "德州扑克",
        "16": "baccarat",
        "17": "Wingo",
        "18": "球队转轮",
        "19": "动物转轮",
        "20": "扫雷",
        "21": "Pusoy",
        "22": "TongitsGo",
        "23": "Lucky9",
      },
      form: {},
      libShow: $libShow,
      subKey: 'bv_reduce_rates',
      AttrNames: {
        'Data': '索引',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    console.log(1)
    this.getData()
  },
  methods: {
    'addItem': function (gid) {
      this.cfg[gid].push({'app': 0, 'rate': 50});
    },
    'delItem': function (gid, idx) {
      this.$delete(this.cfg[gid], idx);
    },
    'checkRate': function(cfg) {
      for (let k in cfg) {
        for (let i=0; i<cfg[k].length; i++) {
          if (cfg[k][i].app <= 0 || cfg[k][i].app >= 200000) {
            Message.error('应用ID:' + cfg[k][i].app + '无效!');
            return false;
          }
          if (cfg[k][i].rate < 0 || cfg[k][i].rate > 500) {
            Message.error('比例值应当在0-500之间!');
            return false;
          }
        }
      }
      return true;
    },
    'getData': function() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          $this.form = response.Data || { Data: '{}' }
          $this.cfg = JSON.parse($this.form.Data)
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    'saveData': function() {
      if (!this.checkRate(this.cfg)) {
        return
      }
      const postData = {}
      Object.assign(postData, this.cfg)
      this.form.Data = JSON.stringify(postData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form);
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功');
          }
        })
      });
    }
  }
}
</script>
