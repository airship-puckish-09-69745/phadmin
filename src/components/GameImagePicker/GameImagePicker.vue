<!--
  File: src\components\GameImagePicker\GameImagePicker.vue
  Date: 2024-08-29 14:39:58
  Description: 赛事图片选择器
-->
<template>
  <div
    class="game-image-picker"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div
      v-if="!value"
      class="game-image-picker__trigger"
      @click="handleTrigger"
    >
      <slot>
        <div class="game-image-picker__trigger-inner">
          <i class="el-icon-plus game-image-picker__trigger__icon" />
        </div>
      </slot>
    </div>
    <slot v-else name="image" v-bind="{ url: value, path: innerPath, cdnUrl, serverRoot }">
      <div class="game-image-picker__image">
        <el-image :src="value" />
        <div class="game-image-picker__image__mask">
          <span class="game-image-picker__image__option">
            <i
              class="el-icon-edit game-image-picker__image__edit"
              @click="handleEdit"
            />
          </span>
        </div>
      </div>
    </slot>

    <GameImagePickerDialog v-model="visible" :url="value" :path="path" @pick="handlePick" />
  </div>
</template>

<script>
import request from '@/utils/request'
import GameImagePickerDialog from './GameImagePickerDialog'
import { GameImagePickerVar } from './GameImagePickerVar'

export default {
  name: 'GameImagePicker',
  components: {
    GameImagePickerDialog
  },
  props: {
    // 图片 URL (v-model)
    value: {
      type: String,
      default: ''
    },

    // 图片路径 (.sync)
    path: {
      type: String,
      default: ''
    },

    // 图片宽度
    width: {
      type: Number,
      default: 109
    },

    // 图片高度
    height: {
      type: Number,
      default: 159
    }
  },

  data() {
    return {
      // 弹框是否显示
      visible: false,

      innerPath: '', // 图片路径
      cdnUrl: '', // 图片 CDN 地址
      serverRoot: '' // 图片目录

      // GameImagePickerVar,
    }
  },

  // mounted() {
  //   this.mountComponent();
  //   this.fetchConfig();
  // },

  // beforeDestroy() {
  //   // this.destroyComponent();
  // },

  methods: {
    /**
     * @description 挂载组件
     */
    mountComponent() {
      GameImagePickerVar.callTimes++
    },

    /**
     * @description 销毁组件
     */
    destroyComponent() {
      // 每次组件销毁时，数量减 1
      GameImagePickerVar.callTimes--

      // 页面上没有组件时，销毁全局变量
      if (GameImagePickerVar.callTimes <= 0) {
        GameImagePickerVar.cdnUrl = ''
      }
    },

    /**
     * @description 获取配置信息，如图片 CDN 地址等
     */
    fetchConfig() {
      if (
        // 不允许重复请求
        GameImagePickerVar.loading ||
        // 图片 CDN 地址不为空时，不请求接口
        GameImagePickerVar.cdnUrl
      ) {
        return
      }

      GameImagePickerVar.loading = true

      return request({
        url: `/dataProxy/info`,
        method: 'get',
        data: {
          Path: `/other/img/url`
        }
      })
        .then((response) => {
          if (response && response.RetCode === 0) {
            const { Data } = response || {}
            const { url, root } = Data || {}

            this.cdnUrl = url
            this.serverRoot = root
            GameImagePickerVar.cdnUrl = url
          } else {
            this.$message.error(response.Data)
          }
        })
        .finally(() => {
          GameImagePickerVar.loading = false
        })
    },

    /**
     * @description 切换弹框的显示
     * @param {boolean} visible
     */
    toggleDialogVisible(visible) {
      this.visible = visible
    },

    /**
     * @description 选择图片
     */
    handleTrigger() {
      this.trigger()
    },

    /**
     * @description 编辑图片
     */
    handleEdit() {
      this.toggleDialogVisible(true)
    },

    /**
     * @description 处理图片选中事件
     * @param {object} image 图片路径
     * @prop {string} image.path 图片路径
     * @prop {string} image.cdnUrl 图片 CDN 地址
     * @prop {string} image.serverRoot 图片目录
     */
    handlePick(image) {
      const { url, path, cdnUrl, serverRoot } = image || {}

      // this.cdnUrl = cdnUrl
      // this.serverRoot = serverRoot
      // GameImagePickerVar.cdnUrl = cdnUrl
      // this.$emit('input', path)
      // this.$emit('change', path)

      this.innerPath = path
      this.cdnUrl = cdnUrl
      this.serverRoot = serverRoot

      this.$emit('input', url)
      this.$emit('change', url)
      this.$emit('update:path', path)
    },

    /**
     * @public
     * @description 触发图片选择弹框
     */
    trigger() {
      this.toggleDialogVisible(true)
    }
  }
}
</script>

<style scoped lang="scss">
.game-image-picker {
  display: inline-block;
  &__trigger {
    display: inline-block;
    width: 100%;
    height: 100%;

    &-inner {
      width: 100%;
      height: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: 0.3s;
      &:hover {
        border-color: #409eff;
      }
    }

    &__icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
  }

  &__image {
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;

    ::v-deep .el-image {
      width: 100%;
      height: 100%;
    }

    &:hover &__mask {
      opacity: 1;
    }

    &__mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: #ffffff;
      font-size: 16px;
      line-height: 80px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);
    }

    &__option {
      font-size: 18px;
    }

    &__edit {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      color: #ffffff;
    }
  }
}
</style>
