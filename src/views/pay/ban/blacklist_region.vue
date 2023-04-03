<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="20" :offset="1">
        <el-form ref="form" :model="form" label-width="150px">
          <el-tabs type="border-card">
            <el-tab-pane v-for="(row, key) in item" :label="key">
              <el-form-item label="开关">
                <el-switch
                  v-model="row.switch"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开启"
                  inactive-text="关闭"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="medium" @click="addRegion(row.region)">添加地区</el-button>
              </el-form-item>
              <el-form-item label="地区">
                <el-table
                  :data="row.region"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="area"
                    label="邦"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.area" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="city"
                    label="城市"
                    width="180"
                  >
                    <template slot="header">
                      <span>城市</span>
                      <el-tooltip class="item" effect="dark" content="*表示所有城市" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.city" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="delRegion(row.region, scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="setData">保存</el-button>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      price: 1, // 道具价格
      form: {
      },
      item: {
        'android': {
          'switch': true,
          'region': []
        },
        'galaxy': {
          'switch': true,
          'region': []
        }
      },
      txt: '',
      subKey: 'blacklist_region_cfg'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    cityItem() {
      return {
        'area': '',
        'city': ''
      }
    },
    addRegion(data) {
      data.push(this.cityItem())
    },
    delRegion(data, idx) {
      data.splice(idx, 1)
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
          // console.log('response', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.item = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
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
            console.log('emoj Price save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
