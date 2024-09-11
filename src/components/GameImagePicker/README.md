# GameImagePicker 赛事图片选择器

选择赛事图片，并回显。

## 基础用法

```javascript
<template>
  <div>
    <GameImagePicker v-model="imagePath" />
  </div
</template>

<script>
import GameImagePicker from "@/components/GameImagePicker/GameImagePicker.vue";

export default {
  components: { GameImagePicker },
  data() {
    return {
      // 图片路径
      imagePath: '',
    }
  },
}
</script>
```

## 自定义选择按钮

```javascript
<template>
  <div>
    <GameImagePicker v-model="imagePath">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
    </GameImagePicker>
  </div
</template>

<script>
import GameImagePicker from "@/components/GameImagePicker/GameImagePicker.vue";

export default {
  components: { GameImagePicker },
  data() {
    return {
      // 图片路径
      imagePath: '',
    }
  },
}
</script>
```

## 自定义图片显示

```javascript
<template>
  <div>
    <GameImagePicker
      ref="pickerRef"
      v-model="imagePath"
      @pick="handlePick">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
      <template v-slot:image="{ url, path, cdnUrl, serverRoot }">
        <div>url: {{ url }}</div>
        <div>path: {{ path }}</div>
        <div>cdnUrl: {{ cdnUrl }}</div>
        <div>serverRoot: {{ serverRoot }}</div>

        <!-- 通过组件暴露的 `trigger` 方法，可以手动触发图片选择弹框` -->
        <el-button
          type="primary"
          @click="$refs.pickerRef.trigger()">
          修改图片
        </el-button>
      </template>
    </GameImagePicker>
  </div
</template>

<script>
import GameImagePicker from "@/components/GameImagePicker/GameImagePicker.vue";

export default {
  components: { GameImagePicker },
  data() {
    return {
      // 图片路径
      imagePath: '',
    }
  },
}
</script>
```

## Props

| 参数名称        | 说明           | 类型     | 可选值 | 默认值 |
| --------------- | -------------- | -------- | ------ | ------ |
| value (v-model) | 图片 URL       | `string` | -      | -      |
| path (.sync) | 图片路径       | `string` | -      | -      |
| width           | 可选，图片宽度 | `number` | -      | `109`  |
| height          | 可选，图片高度 | `number` | -      | `159`  |

## Events

| 事件名称 | 说明               | 参数               |
| -------- | ------------------ | ------------------ |
| cancel   | 点击取消按钮时触发 | -                  |
| change   | 图片改变时触发     | image: `ImageData` |

## Slots

| 插槽名称 | 说明           | 参数               |
| -------- | -------------- | ------------------ |
| default  | 自定义选择按钮 | -                  |
| image    | 自定义图片显示 | image: `ImageData` |

## Methods

| 方法名称 | 说明             | 类型         |
| -------- | ---------------- | ------------ |
| trigger  | 触发图片选择弹框 | `() => void` |

## 类型定义

### ImageData

| 属性名称   | 说明          | 类型     |
| ---------- | ------------- | -------- |
| url       | 图片 URL      | `string` |
| path       | 图片路径      | `string` |
| cdnUrl     | 图片 CDN 地址 | `string` |
| serverRoot | 图片目录      | `string` |

## GameImagePickerDialog 赛事图片选择弹框

用于选择赛事图片。

### 基础用法

```javascript
<template>
  <div>
    <GameImagePickerDialog
      v-model="visible"
      @cancel="handleCancel"
      @pick="handlePick"
    />
    <el-button type="primary" @click="visible = true">选择图片</el-button>
  </div>
</template>

<script>
import GameImagePickerDialog from "@/components/GameImagePicker/GameImagePickerDialog.vue";

export default {
  components: { GameImagePickerDialog },
  data() {
    return {
      // 弹框是否显示
      visible: false,
    }
  },
  methods: {
    /**
     * @description 处理取消事件
     */
    handleCancel() {
      console.log('取消弹框');
    },

    /**
     * @description 处理图片选择事件
     * @param {ImageData} image 图片信息
     */
    handlePick(image) {
      console.log(image);
    }
  },
}
</script>
```

### Props

| 参数名称        | 说明           | 类型      | 可选值 | 默认值  |
| --------------- | -------------- | --------- | ------ | ------- |
| value (v-model) | 弹框是否显示   | `boolean` | -      | `false` |
| url            | 可选，图片 URL | `string`  | -      | -       |
| path            | 可选，图片路径 | `string`  | -      | -       |

### Events

| 事件名称 | 说明               | 参数               |
| -------- | ------------------ | ------------------ |
| cancel   | 点击取消按钮时触发 | -                  |
| pick     | 点击确定按钮时触发 | image: `ImageData` |
