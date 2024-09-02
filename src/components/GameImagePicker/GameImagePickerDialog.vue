<!--
  File: src\components\GameImagePicker\GameImagePickerDialog.vue
  Date: 2024-08-29 15:11:24
  Description: 赛事图片选择弹框
-->
<template>
  <el-dialog
    title="赛事图片选择"
    :visible.sync="show"
    width="70%"
    top="5vh"
    :modal="false"
    class="game-image-picker-dialog"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <div
      v-loading="loading"
      class="game-image-picker-dialog-content"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="game-image-picker-dialog__description">
        <el-alert
          :title="`URL 前缀：${cdnUrl}`"
          type="info"
          show-icon
          :closable="false"
          class="game-image-picker-dialog__description__alert"
        />
        <el-alert
          :title="`服务器路径：${serverRoot}`"
          type="info"
          show-icon
          :closable="false"
          class="game-image-picker-dialog__description__alert"
        />
      </div>
      <div
        v-if="Array.isArray(list) && list.length > 0"
        class="game-image-picker-dialog__list"
      >
        <div
          v-for="item in list"
          :key="item.path"
          :class="[
            'game-image-picker-dialog__list-item',
            {
              'game-image-picker-dialog__list-item--active':
                item.path === active,
            },
          ]"
          @click="handleSelect(item)"
        >
          <el-image
            :src="`${cdnUrl}${item.path}`"
            fit="cover"
            class="game-image-picker-dialog__list-item__image"
            style="width: 150px; height: 218px"
          />
          <div class="game-image-picker-dialog__list-item__name">
            {{ item.path }}
          </div>
          <span
            v-if="item.path === active"
            class="game-image-picker-dialog__list-item__selected"
          >
            <i
              class="el-icon-upload-success el-icon-check game-image-picker-dialog__list-item__selected-icon"
            />
          </span>
        </div>
      </div>
      <el-empty v-else />
    </div>
    <span slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "GameImagePickerDialog",
  props: {
    // 弹框是否显示
    value: {
      type: Boolean,
      default: false,
    },

    // 图片路径
    path: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      active: "", // 当前选中的图片
      cdnUrl: "", // 图片 CDN 地址
      serverRoot: "", // 图片目录
      list: [],
      loading: false,
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    /**
     * @description 切换弹框的显示
     * @param {boolean} visible 弹框是否显示
     */
    toggleVisible(visible) {
      this.show = visible;
    },

    /**
     * @description 重置数据
     */
    reset() {
      this.active = "";
      this.serverRoot = "";
      this.cdnUrl = "";
      this.list = [];
    },

    /**
     * @description 处理弹框打开事件
     */
    handleOpen() {
      this.active = this.path;
      this.fetchList();
    },

    /**
     * @description 获取图片数据
     * @param {object} params 请求参数
     */
    fetchList(params) {
      this.loading = true;

      return request({
        url: `/dataProxy/info`,
        method: "get",
        data: {
          Path: `/other/img/url`,
        },
      })
        .then((response) => {
          if (response && response.RetCode === 0) {
            this.list = this.handleList(response.Data?.list);
            this.cdnUrl = response.Data?.url;
            this.serverRoot = response.Data?.root;
          } else {
            this.$message.error(response.Data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * @description 处理图片列表数据
     * @param {object} data 图片数据 { '/20240828-160419.jpeg': 'http://192.168.6.16:8092/img/20240828-160419.jpeg' }
     * @returns {object[]} 返回处理后的图片列表数据
     */
    handleList(data) {
      const ret = [];

      Object.keys(data || {}).forEach((key) => {
        ret.push({ path: key });
      });

      return ret;
    },

    /**
     * @description 处理弹框关闭事件
     */
    handleClosed() {
      this.reset();
    },

    /**
     * @description 处理图片选中事件
     * @param {object} image 图片对象
     */
    handleSelect(image) {
      if (image.path === this.active) {
        return;
      }

      this.active = image.path;
    },

    /**
     * @description 取消
     */
    handleCancel() {
      this.$emit("cancel");
      this.toggleVisible(false);
    },

    /**
     * @description 确定
     */
    handleConfirm() {
      if (!this.active) {
        this.$message.error("请选择图片");
        return;
      }

      this.$emit("pick", {
        path: this.active,
        cdnUrl: this.cdnUrl,
        serverRoot: this.serverRoot,
      });
      this.toggleVisible(false);
    },
  },
};
</script>

<style scoped lang="scss">
.game-image-picker-dialog {
  &__description {
    &__alert + &__alert {
      margin-top: 12px;
    }

    ::v-deep .el-alert__title {
      font-size: 14px;
    }
  }

  &-content {
    min-height: 410px;
  }

  &__list {
    margin-top: 20px;
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    max-height: 600px;
    overflow-y: auto;

    &-item {
      flex: 0 0 176px;
      min-height: 280px;
      padding: 8px 12px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 12px;
      margin-bottom: 12px;
      transition: transform 0.2s ease-in-out;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: scale(1.05);
        background-color: rgba(255, 255, 255, 0.2);
        border-color: #409eff;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      }

      &--active {
        cursor: default;
      }

      &__selected {
        position: absolute;
        right: -17px;
        top: -7px;
        width: 46px;
        height: 26px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 1px 1px #ccc;

        &-icon {
          color: #ffffff;
          font-size: 12px;
          margin-top: 12px;
          transform: rotate(-45deg);
        }
      }

      &__img {
        width: 109px;
        height: 159px;
      }

      &__name {
        width: 100%;
        margin-top: 12px;
        text-align: center;
      }
    }
  }
}
</style>
