# GameImagePicker 赛事图片选择器

选择赛事图片。

## 基础用法

```vue
<template>
  <div>
    <GameImagePicker v-model="imagePath" />
  </div
</template>

<script>
export default {
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

```vue
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
export default {
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

```vue
<template>
  <div>
    <GameImagePicker
      ref="pickerRef"
      v-model="imagePath"
      @pick="handlePick">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
      <template v-slot:image="{ path, cdnUrl, serverRoot }">
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
export default {
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
| value (v-model) | 图片路径       | `string` | -      | -      |
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

| 属性名称   | 说明          | 类型     |
| ---------- | ------------- | -------- |
| path       | 图片路径      | `string` |
| cdnUrl     | 图片 CDN 地址 | `string` |
| serverRoot | 图片目录      | `string` |
