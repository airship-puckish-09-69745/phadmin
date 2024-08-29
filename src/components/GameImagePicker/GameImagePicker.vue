<!--
  File: src\components\GameImagePicker\GameImagePicker.vue
  Date: 2024-08-29 14:39:58
  Description: --
-->
<template>
  <div
    class="game-image-picker"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div
      v-if="!pickImage.Img"
      class="game-image-picker__trigger"
      @click="handleTrigger"
    >
      <slot>
        <div class="game-image-picker__trigger-inner">
          <i class="el-icon-plus game-image-picker__trigger__icon" />
        </div>
      </slot>
    </div>

    <slot v-else name="image" v-bind="{ image: pickImage, cdnUrl, serverRoot }">
      <div class="game-image-picker__image">
        <el-image :src="`${cdnUrl}/${pickImage.Img}`" />
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

    <GameImagePickerDialog
      v-model="visible"
      v-bind="$attrs"
      @pick="handlePick"
    />
  </div>
</template>

<script>
import GameImagePickerDialog from "./GameImagePickerDialog";

export default {
  name: "GameImagePicker",
  components: {
    GameImagePickerDialog,
  },
  props: {
    // 图片宽度
    width: {
      type: Number,
      default: 109,
    },

    // 图片高度
    height: {
      type: Number,
      default: 159,
    },
  },

  data() {
    return {
      // 弹框是否显示
      visible: false,

      pickImage: {
        type: Object,
        default: () => ({
          Img: "",
          Remark: "",
          GoodsId: "",
        }),
      },

      cdnUrl: "", // 图片 CDN 地址
      serverRoot: "", // 图片目录
    };
  },
  methods: {
    /**
     * @description 切换弹框的显示
     * @param {boolean} visible
     */
    toggleDialogVisible(visible) {
      this.visible = visible;
    },

    /**
     * @description 选择图片
     */
    handleTrigger() {
      this.trigger();
    },

    /**
     * @description 编辑图片
     */
    handleEdit() {
      this.toggleDialogVisible(true);
    },

    /**
     * @description 处理图片选中事件
     * @param {object} image 图片信息
     * @param {object} config 额外配置
     */
    handlePick(image, config) {
      this.pickImage = image;
      this.cdnUrl = config.cdnUrl;
      this.serverRoot = config.serverRoot;
      this.$emit("pick", image);
    },

    /**
     * @public
     * @description 触发图片选择弹框
     */
    trigger() {
      this.toggleDialogVisible(true);
    },
  },
};
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
