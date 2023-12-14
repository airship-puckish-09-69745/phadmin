<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </el-row>
    <!--公共配置-->
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="最低下注(放大1000倍)：">
              <el-input v-model.number="item.MinBet" />
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="服务费：">
              <el-input v-model.number="item.ServiceFee"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="单局最大时间：">
              <el-input v-model.number="item.ActionSeconds"><template slot="append">秒</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="Jackpot贡献率：">
              <el-input v-model.number="item.JackpotFee"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="中Jackpot后的Jackpot贡献率：">
              <el-input v-model.number="item.HitJackpotFee"><template slot="append">‰</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="解锁Jackpot最小下注(放大1000倍)：">
              <el-input v-model.number="item.JackpotBetMin" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item label="下注额度(值用 , 连接如 4000,300,10,3000,200,5,2000,100,3,1000,50,2,50,20,1)">
              <el-input v-model="item.BetMoney" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <fieldset style="margin-top:10px">
            <legend>Jackpot配置</legend>
            <el-alert
              type="success"
              description="玩家获得的JP奖励=JP总额*JP档次对应奖励占比/100"
            />

            <el-table
              :data="item.JackpotCfg"
              border
              style="width: 100%"
            >
              <el-table-column
                label="级别"
                width="180"
              >
                <template slot-scope="scope">
                  {{ JackpotTypeCfg[scope.row.Type] }}
                </template>
              </el-table-column>
              <el-table-column
                label="奖励占比"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.AwardRate">
                    <template v-if="scope.row.Type === 4" slot="append">倍下注</template><template v-else slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="概率"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Rate"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
            </el-table>

          </fieldset>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(v,idx) in item.LevelConfig" :key="idx" :label="getLabelName(v.Level)">
          <el-form label-position="left">
            <h3>级别：{{ levelCfg[v.Level] }}</h3>
            <el-row>
              <el-col :span="11">
                <el-form-item label="行数：">
                  <el-input v-model.number="v.Row" disabled size="small"><template slot="append">行</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="列数：">
                  <el-input v-model.number="v.Col" disabled size="small"><template slot="append">列</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="每行星星数：">
                  <el-input v-model.number="v.StarNum" disabled size="small"><template slot="append">个星星</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="每行炸弹数：">
                  <el-input v-model.number="v.BombNum" disabled size="small"><template slot="append">个炸弹</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-table
              :data="v.Line"
              border
              style="width: 100%"
            >
              <el-table-column
                label="行"
                width="180"
              >
                <template slot-scope="scope">
                  第{{ scope.row.RowIndex+1 }}行
                </template>
              </el-table-column>
              <el-table-column
                label="倍率(说明：2.06倍数值为206)"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RowOdds"><template slot="append">倍率*100</template></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="出现Jackpot的概率"
                width="380"
              >
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.RowJackpot"><template slot="append">%</template></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </el-row>
    <el-row>
      <el-col style="margin-top:16px;" :offset="8" :span="8">
        <el-button type="primary" size="mini" @click="setData()">保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
// import slotsJackpotPhoenix from './components/jackpot_phoenix'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
  	  },
      load: false,
      form: {
      },
      JackpotTypeCfg: {
        1: 'GRAND JP',
        2: 'MAJOR JP',
        3: 'MINOR JP',
        4: 'MINI JP'
      },
      levelCfg: {
      	1: 'Easy',
      	2: 'Medium',
      	3: 'Hard',
      	4: 'Expert',
      	5: 'Master',
      	6: 'Nightmare'
      },
      txt: '',
      subKey: 'tower_cfg'
    }
  },

  created() {
    this.getData()
    console.log(1)
  },
  methods: {
  	getLabelName(k) {
  		return this.levelCfg[k]
  	},
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
          console.log('tower cfg', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
          	const cfg = JSON.parse(response.Data.Data)
          	for (let i = 0; i < cfg.LevelConfig.length; i++) {
          		const one = cfg.LevelConfig[i].Line
          		const row = cfg.LevelConfig[i].Row
          		for (let j = 0; j < row; j++) {
          			let isGet = false
          			for (let k = 0; k < one.length; k++) {
          				if (one[k].RowIndex == j) {
          					isGet = true
          					break
          				}
          			}
          			if (!isGet) {
          				one.push({ RowIndex: j, RowOdds: 0 })
          			}
          		}
          		one.sort(function(a, b) { return a.RowIndex - b.RowIndex })
          	}
            this.item = cfg
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    setData() {
    	// 检验
    	for (let i = 0; i < this.item.LevelConfig.length; i++) {
    		const one = this.item.LevelConfig[i]
    		const lvl = one.Level
    		if (one.Col != one.StarNum + one.BombNum) {
    			Message.error('级别：' + this.levelCfg[lvl] + '下 星星[' + one.StarNum + ']+炸弹[' + one.BombNum + ']数不等于列[' + one.Col + ']')
    			return
    		}
    	}
      this.form.Data = JSON.stringify(this.item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
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
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
