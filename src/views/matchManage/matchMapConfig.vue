<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" :on-compare="onCompare" compare-type="Object" />
    </el-row>

    <el-tabs type="border-card">
      <el-tab-pane label="比赛MAP配置">
        <el-row>
          <el-table
            :data="item.MapItems"
            border
            style="width: 100%"
            :cell-style="libShow.DefaultTableCell"
            height="1000"
          >
            <el-table-column
              prop="AppId"
              label="应用ID"
              width="200"
            />
            <el-table-column
              label="应用名称"
              width="200"
            >
              <template slot-scope="scope">
                {{ showAppName(scope.row.AppId) }}
              </template>
            </el-table-column>
            <el-table-column
              label="开关"
              width="200"
            >
              <template v-slot:default="scope">
                <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" />
              </template>
            </el-table-column>
            <el-table-column
              label="图片"
              width="200"
            >
              <template v-slot:default="scope">
                <ImagePicker v-model="scope.row.ImageLink" />
              </template>
            </el-table-column>
          </el-table>
        </el-row>

      </el-tab-pane>
    </el-tabs>
    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { $libShow } from '@/utils/common'
import {Message} from "element-ui";

export default {
  components: { Compare, ImagePicker, Publish },
  data() {
    return {
      subKey: 'matchMap_cfg',
      libShow: $libShow,
      appIdInfoCons: [],
      form: {
        Data: {}
      },
      item: {
        IsOpen: true,
        ImageLink: '',
        MapItems: []
      },
    }
  },
  created() {
    this.getAppidInfoCfg()
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(res => {
        if (res.RetCode === 0) {
          $this.form = res.Data || {}
          if (res.Data && res.Data.Data !== '' && res.Data.Data !== '{}') {
            // const resData = JSON.parse(res.Data.Data)
            $this.item = JSON.parse(res.Data.Data)
            // 添加appid筛选后，原来数据不兼容，构建新的
            if ($this.item.MapItems === undefined) {
              $this.item.MapItems = []
              for (let i = 0; i < $this.appIdInfoCons.length; i++) {
                const appID = $this.appIdInfoCons[i].value
                const newItem = {
                  AppId: appID,
                  IsOpen: false,
                  ImageLink: ''
                }
                $this.item.MapItems.push(newItem)
              }
            }
            // 针对以后添加的渠道，主动添加新的
            const oldAppIds = []
            for (let j = 0; j < this.item.MapItems.length; j++) {
              oldAppIds.push(this.item.MapItems[j].AppId)
            }
            $this.appIdInfoCons.filter(function(item) {
              if (!oldAppIds.includes(item.value)) {
                const newItem = {
                  AppId: item.value,
                  IsOpen: false,
                  ImageLink: ''
                }
                $this.item.MapItems.push(newItem)
              }
            })
            const old = JSON.parse(res.Data.Data)
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    getAppidInfoCfg() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(res => {
        if (res.RetCode === 0) {
          if (res.Data) {
            const objs = res.Data
            for (let i = 0; i < objs.length; i++) {
              const appidInfoCfg = { 'value': objs[i].ID, 'label': objs[i].Account }
              this.appIdInfoCons.push(appidInfoCfg)
            }
          }
        }
      })
    },
    showAppName(appID) {
      for (let i = 0; i < this.appIdInfoCons.length; i++) {
        if (this.appIdInfoCons[i].value === appID) {
          return this.appIdInfoCons[i].label
        }
      }
    },
    onCompare(pre,pro) {
      const preVal=JSON.parse(pre.Data).MapItems
      const proVal=JSON.parse(pro.Data).MapItems
      console.log(JSON.stringify(preVal))
      console.log(JSON.stringify(proVal))
      // 编辑
      let str = ''
      for (const i in preVal) {
        for (const j in proVal) {
          const preItem = preVal[i]
          const proItem = proVal[j]
          if (preItem.AppId === proItem.AppId) {
            if (JSON.stringify(preItem) !== JSON.stringify(proItem)) {
              str += `\r\n修改：【${preItem.AppId}】，${preItem.IsOpen?'开':'关'}`
              str += `\r\n图片：${preItem.ImageLink}`
            }
          }
        }
      }
      // 新增
      for (const i in preVal) {
        const preItem = preVal[i]
        if (!proVal.some(item=>item.AppId === preItem.AppId)) {
          str += `\r\n增加：【${proItem.AppId}】，${proItem.IsOpen?'开':'关'}`
          str += `\r\n图片：${proItem.ImageLink}`
        }
      }
      // 删除
      for (const i in proVal) {
        const proItem = proVal[i]
        if (!preVal.some(item=>item.AppId === proItem.AppId)) {
          str += `\r\n删除：【${proItem.AppId}】，${proItem.IsOpen?'开':'关'}`
          str += `\r\n图片：${proItem.ImageLink}`
        }
      }
      console.log(str)
      return str
    },
  }
}
</script>
