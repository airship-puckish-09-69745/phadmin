<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <el-col :span="8" :offset="4">
      <h3 align="center" style="margin:30px auto;">各子游戏基准值消耗数额与有效下注比例(贡献值与有效下注比例)</h3>
      <el-form ref="cfg" :model="cfg" label-width="200px">
        <el-form-item v-for="(v, k) in cfg" :label="games[k]" :required="true">
          <el-input v-model.number="cfg[k]" placeholder="placeholder" style="width:150px;"><template slot="append">‰</template></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setData">保存</el-button>
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
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 0,
        "21": 0,
        "22": 0,
        "23": 0,
        "25": 0
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
        "17": "wingo lottery",
        "18": "球队标转盘",
        "19": "动物转盘",
        "20": "扫雷小游戏",
        "21": "Pusoy",
        "22": "TongitsGo",
        "23": "Lucky9",
        "25": "Color"
      },
      form: {},
      libShow: $libShow,
      subKey: 'games_prod_rate',
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
    checkRate(cfg) {
      for (let k in cfg) {
        if(cfg[k]<1 || cfg[k]>500) {
          Message.error('概率应该是0-500之间的数字');
          return false;
        }
      }
      return true;
    },
    getData() {
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
    setData() {
      if (!this.checkRate(this.cfg)) {
        return
      }
      const postData = {}
      Object.assign(postData, this.cfg)
      this.form.Data = JSON.stringify(postData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
