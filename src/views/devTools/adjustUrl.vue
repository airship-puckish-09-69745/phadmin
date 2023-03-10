<template>
  <div class="app-container">
    <el-col :span="12" :offset="4">
      <el-form ref="item" :model="item" label-width="150px">
        <el-form-item label="Uid：" :required="true">
          <UidInput @setUid="function(iUid){item.Uid=iUid}" />
        </el-form-item>
        <el-form-item label="AppToken：" :required="true">
          <el-col :span="10">
            <el-input v-model="item.AppToken" placeholder="placeholder" />
          </el-col>
        </el-form-item>
        <el-form-item label="EventToken：" :required="true">
          <el-col :span="10">
            <el-input v-model="item.EventToken" placeholder="placeholder" />
          </el-col>
        </el-form-item>
        <el-form-item label="是否沙盒：" :required="true">
          <el-col :span="10">
            <el-switch
              v-model="isSand"
              active-text="是"
              inactive-text="否"
            />
          </el-col>
        </el-form-item>

        <el-col :offset="16" :span="8">
          <el-form-item>
            <el-button type="primary" @click="getData">生成</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-button size="mini" @click="copyText()">复制</el-button>
      <el-input
        id="url_id"
        v-model="url"
        type="textarea"
        rows="5"
      />
    </el-col>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import UidInput from '@/components/UidInput'
import { $libDate, $libShow, $libType, $libUrl } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      url: '',
      isSand: false,
      item: {
        Uid: '',
        AppToken: '',
        EventToken: ''
      },
      libShow: $libShow
    }
  },
  created() {
    console.log(1)
  },
  methods: {
    copyText() {
      const Url = document.getElementById('url_id')
      Url.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '已经复制到剪贴板！',
        type: 'success'
      })
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/user/adjust/info',
          Uid: this.item.Uid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          const info = response.Data || { }
          const params = $libUrl.GenUrlParams({
            s2s: 1,
            event_token: $this.item.EventToken,
            app_token: $this.item.AppToken,
            gps_adid: info.GPID,
            adid: info.ADID,
            create_at_unix: Math.floor(new Date().getTime() / 1000),
            revenue: 0.88,
            currency: 'INR'
          })
          $this.url = 'https://s2s.adjust.com/event?' + params
          if ($this.isSand) {
            $this.url += '&environment=sandbox'
          }
        }
      })
    }

  }
}

</script>
