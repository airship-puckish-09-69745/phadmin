<template>
  <div class="compare-container">
    <el-dialog
      title="对比结果"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >

      <el-table
        :data="result"
        style="width: 100%; max-height: 600px; overflow: auto"
      >
        <el-table-column
          prop="key"
          label="名称"
          width="180"
        >
          <template slot-scope="scope">
            {{ getAttrName(scope.row.key) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="oldVal"
          label="原始值"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.oldVal" />
          </template>
        </el-table-column>
        <el-table-column
          prop="newVal"
          label="修改值"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.newVal" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="next">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
import Diff from '@/utils/diff'
import { $LibJsonDiff, $libType } from '@/utils/common'

const diff = new Diff.Diff()
const diffFormatter = new Diff.DiffFormatter(diff)

// 修改对比工具
export default {
  name: 'Compare',
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    attrNames: {
      type: Object
    },
    compareType: { // 发布内容格式，支持：Array, Object, String
      type: String,
      default: 'Array'
    }
  },
  data() {
    return {
      dialogVisible: false,
      oldVal: {},
      newVal: {},
      result: [],
      callback: {}
    }
  },
  mounted() {
    // console.log(1)
  },
  methods: {
    getAttrName(attr) {
      if (this.attrNames && this.attrNames[attr]) {
        return this.attrNames[attr]
      } else {
        return attr
      }
    },
    resetDialog(isEdit) {
      this.dialogVisible = false
      this.result = []

      if (isEdit) {
        // 用户可能一直停留在页面修改
        this.oldVal = this.newVal
      }
    },
    cancel() {
      this.resetDialog(false)
      return
    },
    next() {
      this.resetDialog(true)
      if (this.callback instanceof Function) {
        this.callback(true)
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    SetOldVal(val) {
      if (val instanceof Object) {
        this.oldVal = Object.assign({}, val)
      } else {
        this.oldVal = val
      }
    },
    SetNewVal(val) {
      if (val instanceof Object) {
        this.newVal = Object.assign({}, val)
      } else {
        this.newVal = val
      }
    },
    AddResult(key, oldVal, newVal) {
      this.result.push({
        key: key,
        oldVal: oldVal,
        newVal: newVal
      })
    },
    ToString(val) {
      switch (typeof val) {
        case 'string':
          return val
        case 'object':
          return JSON.stringify(val)
        case 'boolean':
          return JSON.stringify(val)
        case 'number':
          return val.toString()
        default: // 其它数据类型不处理，以后遇到自己处理
          return ''
      }
    },
    // 判断数据是否有变化
    HasDiff() {
      return this.result.length > 0
    },
    GetKeys(oldVal, newVal) {
      const keys = []
      for (const k in oldVal) {
        keys.push(k)
      }

      for (const k in newVal) {
        if (keys.indexOf(k) === -1) {
          keys.push(k)
        }
      }

      return keys
    },
    compareArray(oldObj, newObj, prefix) {
      const lens = oldObj.length > newObj.length ? oldObj.length : newObj.length

      for (let i = 0; i < lens; i++) {
        const key = i
        let oldVal, newVal
        if (oldObj[key]) {
          oldVal = oldObj[key]
        }
        if (newObj[key]) {
          newVal = newObj[key]
        }

        // 如果值相等，不需要对比，直接跳过
        if (this.ToString(oldVal) == this.ToString(newVal)) {
          continue
        }

        const sKey = prefix ? this.getAttrName(prefix) + '.' + (key + 1) : (key + 1)
        this.compareValue(oldVal, newVal, sKey)
      }
    },
    compareObject(oldObj, newObj, prefix) {
      const keys = this.GetKeys(oldObj, newObj)

      for (const k in keys) {
        const key = keys[k]
        let oldVal, newVal
        if (oldObj[key] !== undefined) {
          oldVal = oldObj[key]
        }
        if (newObj[key] !== undefined) {
          newVal = newObj[key]
        }

        // 如果值相等，不需要对比，直接跳过
        if (this.ToString(oldVal) == this.ToString(newVal)) {
          continue
        }

        if (this.attrNames && this.attrNames.types && this.attrNames.types[key] === 'jsonString') {
          oldVal = JSON.parse(oldVal)
          newVal = JSON.parse(newVal)
        }

        const sKey = prefix ? this.getAttrName(prefix) + '.' + this.getAttrName(key) : this.getAttrName(key)
        if ($libType.IsObject(oldVal)) {
          this.compareObject(oldVal, newVal, sKey)
          continue
        } else if ($libType.IsArray(oldVal)) {
          this.compareArray(oldVal, newVal, sKey)
          continue
        }

        this.compareValue(oldVal, newVal, sKey)
      }
    },
    compareValue(oldValue, newValue, key) {
      const oldVal = this.ToString(oldValue)
      const newVal = this.ToString(newValue)
      let oldObject, newObject
      try {
        oldObject = JSON.parse(oldVal)
        newObject = JSON.parse(newVal)
      } catch (e) {
        oldObject = null
        newObject = null
      }

      let ret
      if (oldObject && newObject) {
        ret = $LibJsonDiff.DiffHistory(oldObject, newObject)
      } else {
        ret = diffFormatter.formattedDiff(oldVal, newVal)
      }
      // console.log(ret)

      this.AddResult(key, ret[0], ret[1])
    },
    // funcSucc 对比成功之后执行回调
    // 返回false，数据没有修改
    // 返回true，数据有修改
    Compare(funcSucc) {
       console.log('oldVal', this.oldVal)
       console.log('newVal', this.newVal)
      if (this.ToString(this.oldVal) === this.ToString(this.newVal)) {
        console.log('无任何差异')
        funcSucc(false)
        return false
      }
      let oldVal = this.oldVal
      let newVal = this.newVal
      if (this.compareType === 'Object') {
        oldVal = JSON.parse(this.oldVal)
        newVal = JSON.parse(this.newVal)
      }

      // 如果两个数据都是对象，直接遍历对比
      // 如果两个数据数据类型不一致，直接转成字符串对比
      if (($libType.IsObject(oldVal) && $libType.IsObject(newVal))) {
        this.compareObject(oldVal, newVal)
      } else if ($libType.IsArray(oldVal) && $libType.IsArray(newVal)) {
        this.compareArray(oldVal, newVal)
      } else {
        this.compareValue(oldVal, newVal, '-')
      }

      if (this.HasDiff()) {
        this.callback = funcSucc
        this.dialogVisible = true
        return true
      } else {
        funcSucc(false)
        return false
      }
    }

  }
}
</script>

