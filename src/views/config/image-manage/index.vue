<!--
  File: src\views\config\image-manage\index.vue
  Date: 2024-10-18 10:22:27
  Description: 配置管理/图片管理
-->
<template>
  <div class="image-manage">
    <div class="image-manage-operation">
      <ImageUploadForm :options="imageTypes" class="image-manage-form" />
      <ImageTypeMenu v-model="condition.type" class="image-manage-menu" :options="imageTypes" />
    </div>
    <div class="image-manage-container">
      <div class="image-manage__header">
        <div class="image-manage__header__title">{{ title }}</div>
        <i class="el-icon-refresh image-manage__header__refresh" />
      </div>
      <div class="image-manage-content">
        <div
          v-if="Array.isArray(list) && list.length > 0"
          class="image-manage-list"
        >
          <div v-for="item in list" :key="item.id" class="image-manage-item">
            <el-image
              :src="item.url"
              :preview-src-list="previewSrcList"
              fit="contain"
              class="image-manage-item__image"
            />
          </div>
        </div>
        <el-empty v-else :image-size="200" />
      </div>
    </div>
  </div>
</template>

<script>
import ImageUploadForm from './components/ImageUploadForm/ImageUploadForm.vue'
import ImageTypeMenu from './components/ImageTypeMenu/ImageTypeMenu.vue'

export default {
  components: {
    ImageUploadForm,
    ImageTypeMenu
  },
  data() {
    return {
      imageTypes: [
        { value: 'image', label: '图片' },
        { value: 'gif', label: 'GIF' },
        { value: 'long-image', label: '长图' },
        { value: 'screenshot', label: '截图' },
        { value: 'wallpaper', label: '壁纸' }
      ],

      condition: {
        type: 'image'
      },

      list: []
    }
  },
  computed: {
    title() {
      return this.imageTypes.find((item) => item.value === this.condition.type)?.label
    },

    previewSrcList() {
      return this.list.map((item) => item.url)
    }
  },
  created() {
    this.fetchList().then((data) => this.setList(data))
  },
  methods: {
    /**
     * @description 获取列表数据
     * @param {object} params 参数
     * @prop {string} params.type 图片类型
     */
    fetchList(params) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = [
            {
              id: '1',
              url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
            },
            {
              id: '2',
              url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
            },
            {
              id: '3',
              url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
            },
            {
              id: '4',
              url: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
            },
            {
              id: '5',
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
            },
            {
              id: '6',
              url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
            },
            {
              id: '7',
              url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
            }
          ]

          resolve(data)
        }, 200)
      })
    },

    /**
     * @description 设置列表数据
     */
    setList(value) {
      if (Array.isArray(value)) {
        this.list = value
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image-manage {
  width: 100%;
  padding: 20px;
  min-height: 100%;
  display: flex;

  &-operation {
    flex: 0 0 360px;
    height: 100%;
    background-color: #f9fafc;
    border: 1px solid #DCDFE6;
  }

  &-menu {
    overflow: auto;
    border-top: 1px solid #DCDFE6;
  }

  &-container {
    flex: 1;
    margin-left: 20px;
  }

  &__header {
    height: 40px;
    display: flex;
    align-items: center;

    &__title {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }

    &__refresh {
      font-size: 16px;
      color: #606266;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  &-content {
    height: calc(100% - 40px);
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  &-item {
    width: 360px;
    height: 180px;
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    background: #f9fafc;
    transition: all .3s ease;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    &__image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
