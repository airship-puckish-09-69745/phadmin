<!--
  File: src\components\ImagePicker\ImagePicker.vue
  Date: 2024-10-22 10:16:08
  Description: 图片选择器
-->
<template>
  <div
    class="image-picker"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div
      v-if="!value"
      class="image-picker__trigger"
      @click="trigger"
    >
      <slot>
        <div class="image-picker__trigger-inner">
          <i class="el-icon-plus image-picker__trigger__icon" />
        </div>
      </slot>
    </div>
    <slot v-else name="image" v-bind="{ value: active.value, name: active.name, url: active.url }">
      <div class="image-picker__image">
        <el-image :src="value" fit="contain" />
        <div class="image-picker__image__mask">
          <span class="image-picker__image__option">
            <i
              class="el-icon-edit image-picker__image__edit"
              @click="handleEdit"
            />
          </span>
        </div>
      </div>
    </slot>

    <ImagePickerDialog
      :visible.sync="visible"
      :value="value"
      @change="handleValueChange"
      @pick="handlePick"
    />
  </div>
</template>

<script>
import ImagePickerDialog from './ImagePickerDialog'

export default {
  name: 'ImagePicker',
  components: {
    ImagePickerDialog
  },
  props: {
    // 图片 URL (v-model)
    value: {
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

      // 选中的图片对象
      active: {
        value: '', // 图片 URL/图片路径
        name: '', // 图片名称
        url: '' // 图片 URL
      }
    }
  },

  methods: {
    /**
     * @description 设置当前选中的图片
     * @param {object} image 选中的图片对象
     * @prop {string} image.value 图片 URL/图片路径
     * @prop {string} image.name 图片名称
     * @prop {string} image.url 图片 URL
     */
    setActive(image) {
      this.active = image
    },

    /**
     * @description 切换弹框的显示
     * @param {boolean} visible
     */
    toggleDialogVisible(visible) {
      this.visible = visible
    },

    /**
     * @description 编辑图片
     */
    handleEdit() {
      this.toggleDialogVisible(true)
    },

    /**
     * @description 处理图片改变事件
     * @param {string} value 图片地址
     */
    handleValueChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },

    /**
     * @description 处理图片选中事件
     * @param {object} image 图片路径
     * @prop {string} image.url 图片路径
     */
    handlePick(image) {
      this.setActive(image)
      this.$emit('pick', image)
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
.image-picker {
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
    border-radius: 4px;
    border: 1px solid #DCDFE6;

    ::v-deep .el-image {
      border-radius: 4px;
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
