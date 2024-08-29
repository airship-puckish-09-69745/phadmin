# GameImagePicker 赛事图片选择器

选择赛事图片。

## 基础用法

```vue
<template>
  <div>
    <GameImagePicker type="1" @pick="handlePick" />
  </div
</template>

<script>
export default {
  methods: {
    handlePick(image) {
      // 选择的图片信息
      console.log(image)
    }
  }
}
</script>
```

## 自定义选择按钮

```vue
<template>
  <div>
    <GameImagePicker
      :type="1"
      :image="image"
      ext="ext"
      @pick="handlePick">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
    </GameImagePicker>
  </div
</template>

<script>
export default {
  methods: {
    handlePick(image) {
      // 选择的图片信息
      console.log(image)
    }
  }
}
</script>
```

## 自定义图片显示

```vue
<template>
  <div>
    <GameImagePicker
      ref="pickerRef"
      :type="1"
      :image="image"
      ext="ext"
      @pick="handlePick">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
      <template v-slot:image="{ image, cdnUrl, serverRoot }">
        <div>image: {{ image }}</div>
        <div>cdnUrl: {{ cdnUrl }}</div>
        <div>serverRoot: {{ serverRoot }}</div>
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
  methods: {
    handlePick(image) {
      // 选择的图片信息
      console.log(image)
    }
  }
}
</script>
```

## Props

| 参数名称 | 说明                                     | 类型        | 可选值 | 默认值 |
| -------- | ---------------------------------------- | ----------- | ------ | ------ |
| type     | 可选，图片类型，用于查询赛事图片列表     | `number`    | -      | `1`    |
| ext      | 可选，扩展信息，会添加至返回的图片信息里 | `string`    | -      | -      |
| width    | 可选，图片宽度                           | `number`    | -      | `109`  |
| height   | 可选，图片高度                           | `number`    | -      | `159`  |
| image    | 可选，图片信息，回显图片时需要           | `ImageData` | -      | -      |

## Events

| 事件名称 | 说明               | 参数                                                                                         |
| -------- | ------------------ | -------------------------------------------------------------------------------------------- |
| cancel   | 点击取消按钮时触发 | -                                                                                            |
| pick     | 选择图片时出发     | image: `ImageData`<br> cdnUrl: `string` 图片 CDN 地址<br> 图片 serverRoot: `string` 图片目录 |

## Slots

| 插槽名称 | 说明     | 参数               |
| -------- | -------- | ------------------ |
| default  | 选择按钮 | -                  |
| image    | 图片显示 | image: `ImageData` |

## Methods

| 插槽名称 | 说明             |
| -------- | ---------------- |
| trigger  | 触发图片选择弹框 |

## 类型定义

### ImageData

| 参数名称 | 说明                                 | 类型     |
| -------- | ------------------------------------ | -------- |
| Img      | 图片名称                             | `string` |
| Type     | 图片类型，由 `props.sourceType` 定义 | `number` |
| Ext      | 扩展信息，由 `props.Ext` 定义        | `string` |
