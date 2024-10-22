# ImagePicker 赛事图片选择器

选择赛事图片，并回显。

## 基础用法

```javascript
<template>
  <div>
    <ImagePicker v-model="imageUrl" />
  </div>
</template>

<script>
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";

export default {
  components: { ImagePicker },
  data() {
    return {
      // 图片 URL
      imageUrl: '',
    }
  },
}
</script>
```

## 自定义选择按钮

```javascript
<template>
  <div>
    <ImagePicker v-model="imageUrl">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
    </ImagePicker>
  </div>
</template>

<script>
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";

export default {
  components: { ImagePicker },
  data() {
    return {
      // 图片 URL
      imageUrl: '',
    }
  },
}
</script>
```

## 自定义图片显示

```javascript
<template>
  <div>
    <ImagePicker
      ref="pickerRef"
      v-model="imageUrl"
      @pick="handlePick">
      <template>
        <el-button type="primary">选择图片</el-button>
      </template>
      <template v-slot:image="{ url }">
        <div>url: {{ url }}</div>

        <!-- 通过组件暴露的 `trigger` 方法，可以手动触发图片选择弹框` -->
        <el-button
          type="primary"
          @click="$refs.pickerRef.trigger()">
          修改图片
        </el-button>
      </template>
    </ImagePicker>
  </div>
</template>

<script>
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";

export default {
  components: { ImagePicker },
  data() {
    return {
      // 图片 URL
      imageUrl: '',
    }
  },
}
</script>
```

## Props

| 参数名称        | 说明           | 类型     | 可选值 | 默认值 |
| --------------- | -------------- | -------- | ------ | ------ |
| value (v-model) | 图片 URL       | `string` | -      | -      |
| width           | 可选，图片宽度 | `number` | -      | `109`  |
| height          | 可选，图片高度 | `number` | -      | `159`  |

## Events

| 事件名称 | 说明               | 参数               |
| -------- | ------------------ | ------------------ |
| pick   | 图片选中时触发     | image: `ImageData` |

## Slots

| 插槽名称 | 说明           | 参数               |
| -------- | -------------- | ------------------ |
| default  | 自定义选择按钮 | -                  |
| image    | 自定义图片显示 | image: `ImageData` |

## Methods

| 方法名称 | 说明             | 类型         |
| -------- | ---------------- | ------------ |
| trigger  | 触发图片选择弹框 | `() => void` |

## ImagePickerDialog 赛事图片选择弹框

用于选择赛事图片。

### 基础用法

```javascript
<template>
  <div>
    <ImagePickerDialog
      :visible.sync="visible"
      @cancel="handleCancel"
      @pick="handlePick"
    />
    <el-button type="primary" @click="visible = true">选择图片</el-button>
  </div>
</template>

<script>
import ImagePickerDialog from "@/components/ImagePicker/ImagePickerDialog.vue";

export default {
  components: { ImagePickerDialog },
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
| value (v-model)            | 图片 URL | `string`  | -      | -       |
| visible (.sync) | 弹框是否显示   | `boolean` | -      | `false` |

### Events

| 事件名称 | 说明               | 参数               |
| -------- | ------------------ | ------------------ |
| cancel   | 点击取消按钮时触发 | -                  |
| pick     | 点击确定按钮时触发 | image: `ImageData` |

## 类型定义

### ImageData

| 属性名称   | 说明          | 类型     |
| ---------- | ------------- | -------- |
| value       | 图片 URL/图片路径      | `string` |
| name       | 图片名称      | `string` |
| url       | 图片 URL      | `string` |
