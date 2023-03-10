<template>
  <div class="lang-input">
    <el-button type="primary" @click="selectImg">选择图片</el-button>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :before-close="handleClose"
    >
      <span>
        <div class="demo-fit">
          <ul>
            <li v-for="(item, k) in imgs" @click="hitImg(k)">
              <img :src="getImgUrl(item)" :alt="sourceType" :title="ext" :class="item.Class">
              <p>{{ item.Img }}</p>
            </li>
          </ul>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'PickerImg',
  // eslint-disable-next-line vue/require-prop-types
  props: {
    sourceType: {
      default: 1,
      type: Number
    },
    ext: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgs: [
        { Remark: 'img1', Img: '', GoodsId: '', Class: '' }
      ],
      cdnUrl: ''
    }
  },
  watch: { // 监听值变化：map值
    sourceType: function() {
      this.getImages()
    }
  },
  created() {
    this.getImages()
  },
  methods: {
    getImgUrl(item) {
      return this.cdnUrl + '/' + item.Img
    },
    handleClose(done) {
      this.dialogVisible = false
      done()
    },
    getImages() {
      const $this = this
      console.log('请求数据')
      request({
        url: '/other/image/library?type=' + $this.sourceType,
        method: 'get'
      }).then(function(response) {
        console.log(response)
        if (response.RetCode === 0) {
          for (const i in response.Data.data) {
            response.Data.data[i]['Class'] = ''
          }
          $this.imgs = response.Data.data
          $this.cdnUrl = response.Data.cdn
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    selectImg() {
      this.dialogVisible = true
    },
    hitImg(idx) {
      console.log('hit img', idx)
      const curClass = this.imgs[idx].Class
      this.clearClass()
      if (curClass) {
        this.imgs[idx].Class = ''
      } else {
        this.imgs[idx].Class = 'hit'
      }
    },
    clearClass() {
      for (const k in this.imgs) {
        this.imgs[k].Class = ''
      }
    },
    // 获取选中的图片
    getHitImg() {
      let data = ''
      for (const k in this.imgs) {
        if (this.imgs[k].Class) {
          data = this.imgs[k]
        }
      }
      return data
    },
    submit() {
      const img = this.getHitImg()
      if (!img) {
        this.$message.error('没有选择图片')
        return
      }
      img.Type = this.sourceType
      img.Ext = this.ext // 拓展字段，透传

      this.$emit('picker', img)
      this.dialogVisible = false
    }
  }
}
</script>
<style type="text/css">
.demo-fit ul {
  list-style: none;
}
.demo-fit ul li {
  display: inline-block;
  width: 100px;
  margin-left: 10px;
}

.demo-fit ul li img {
  width: 100px;
}

.demo-fit ul li p {
  margin: 0;
  padding: 0;
  text-align: center;
  color: #8492a6;
  font-size: 14px;
}

.demo-fit .hit {
  border: 3px solid red;
}
</style>
