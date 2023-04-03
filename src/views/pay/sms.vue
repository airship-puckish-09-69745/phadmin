<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="200px">
        <!--
          <el-row>
            <el-form-item label="KMI：">
              <el-col :span="12">
                <el-input v-model.number="item.kmi" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
            </el-form-item>
          </el-row>
        -->
          <el-row>
          <span v-if="!hasDiff" style="color:green">与线上配置无差异</span>
          <span v-if="hasDiff" style="color:red">与线上配置存在差异</span>
          </el-row>
          <el-row>
            <el-form-item label="创蓝：">
              <el-col :span="12">
                <el-input v-model.number="item.chuanglan" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.chuanglan }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.chuanglan }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="WorldTone：">
              <el-col :span="12">
                <el-input v-model.number="item.worldtone" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.worldtone }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.worldtone }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="牛信云-高价：">
              <el-col :span="12">
                <el-input v-model.number="item.nxcloud" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.nxcloud }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.nxcloud }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="牛信云-低价：">
              <el-col :span="12">
                <el-input v-model.number="item.nxcloudlowprice" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.nxcloudlowprice }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.nxcloudlowprice }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="PaaSoo(8.5分)：">
              <el-col :span="12">
                <el-input v-model.number="item.paasoo" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.paasoo }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.paasoo }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="传信：">
              <el-col :span="12">
                <el-input v-model.number="item.chuanxin" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.chuanxin }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.chuanxin }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="木山云：">
              <el-col :span="12">
                <el-input v-model.number="item.mushanyun" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.mushanyun }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.mushanyun }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="不卡：">
              <el-col :span="12">
                <el-input v-model.number="item.buka" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.buka }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.buka }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="UCloud：">
              <el-col :span="12">
                <el-input v-model.number="item.ucloud" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.ucloud }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.ucloud }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="飞鸽：">
              <el-col :span="12">
                <el-input v-model.number="item.feige" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.feige }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.feige }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="Ant：">
              <el-col :span="12">
                <el-input v-model.number="item.ant" :required="true" ><template slot="append">%</template></el-input>
              </el-col>
              <el-col :span="12">
                <span v-if="!hasDiff" style="color:green">线上：{{ onlineMap.ant }}</span>
                <span v-if="hasDiff" style="color:red">线上：{{ onlineMap.ant }}</span>
              </el-col>
            </el-form-item>
          </el-row>
          <el-col :offset="12" :span="12">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
              <el-button @click="showLog()">日志</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="修改记录"
      :visible.sync="logVisible"
      width="60%"
    >
      <el-tabs  type="border-card" @tab-click="showLog">
        <el-tab-pane label="短信配置变更记录" name="1" />
      </el-tabs>
      <el-table
        :data="logs"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="padding:10px;width: 100%"
      >
        <el-table-column
          prop="Key"
          label="日期"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.CreateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Operator"
          label="修改人"
          width="80"
        />
        <el-table-column
          prop="Content"
          label="修改前"
          width="450"
        />
        <el-table-column
          prop="NewContent"
          label="修改后"
          width="450"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.NewContent" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import {$libDate, $libShow} from "@/utils/common";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare },
  data() {
    return {
      isValid: true,
      item: { kmi: 0, chuanglan: 0, worldtone: 0, nxcloud: 0, nxcloudlowprice: 0, paasoo: 0,chuanxin:0,mushanyun:0,buka:0,ucloud:0,feige:0,ant:0 },
      form: {
      },

      //判断是否与线上有差异
      hasDiff: false,
      onlineMap:{},

      logs: [],
      logVisible: false,
      libShow: $libShow,

      subKey: 'sms_ratio',

      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    // //查询线上的数据
    // this.getOnlineInfo()
    this.sequentialRequest()

    // console.log(1)
  },

  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    //严格控制顺序，必须要getOnlineInfo拿到数据之后才能执行getData请求。因为getData中会用到前面的数据
    sequentialRequest: async function() {
      await this.getOnlineInfo();
      // await this.getData(); //调整策略：
    },
    getData() {
      console.log("[process getData]")
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {

          var date = new Date();
          console.log("getData finish time:",date.getTime());

          // console.log('sign reward', response)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)

            //获取在线数据
            // $this.getOnlineInfo()

            console.log("compare")
            //检查是否与线上相同
            if ($this.item.chuanglan ==$this.onlineMap.chuanglan && $this.item.worldtone ==$this.onlineMap.worldtone && $this.item.nxcloud ==$this.onlineMap.nxcloud && $this.item.nxcloudlowprice ==$this.onlineMap.nxcloudlowprice){
              $this.hasDiff = false
            }else{
              $this.hasDiff = true
              console.log("titem",$this.item.chuanglan,$this.item.worldtone,$this.item.nxcloud,$this.item.nxcloudlowprice)
              console.log("tonlineMap",$this.onlineMap.chuanglan,$this.onlineMap.worldtone,$this.onlineMap.nxcloud,$this.onlineMap.nxcloudlowprice)
            }
          }
        }
      })
    },
    getPostData() {
      return this.item
    },
    showLog() {
      request({
        url: '/customizeconfig/logs',
        method: 'get',
        data: {
          requestPath: 'customizeconfig/sms_ratio', //需要查询的日志的子类型
          Type: 'customizeconfig'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.logs = response.Data || []
          this.logVisible = true
        }
      })
    },
    //查询线上正在使用的短信配置信息，方便做展示。
    getOnlineInfo() {
      console.log("[process getOnlineInfo]")
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/sms/configs'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var date = new Date();
          console.log("onlineMap finish time:",date.getTime());

          console.log("onlineMap",response.Data)
          $this.onlineMap = response.Data

          $this.getData()
          // for (const n in response.Data) {
          //   const ob = response.Data[n]
          //   $this.onlineMap[ob.PackageName] = ob
          // }
        }
      })
    },
    setData() {
      const postData = this.getPostData()
      let sum = 0;
      for (const k in postData) {
        sum += postData[k];
      }
      if (sum != 100){
        Message.error("总和相加不等于100");
        return;
      }
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
