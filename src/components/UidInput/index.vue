<template>
  <el-autocomplete
    v-model="myUid"
    class="inline-input"
    :fetch-suggestions="queryUids"
    placeholder="请输入UID"
    @select="handleSelect"
    @change="uidChanged"
  />
</template>

<script>
import { $libType } from '@/utils/common'

// 修改对比工具
export default {
  name: 'UidInput',
  props: {
    uidInput: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      Uids: [],
      myUid: '',
      Uid: 0
    }
  },
  watch: {
    uidInput: function (val) {
      this.saveUid(val)
    }
  },
  mounted() {
    this.$EventBus.$on('uid-change', (val) => {
      this.saveUidToStorage(val)
    })

    this.getFromStorage()
  },
  methods: {
    queryUids(queryString, cb) {
      queryString += ''
      const uids = this.Uids
      const results = queryString ? uids.filter(this.createFilter(queryString)) : uids
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    uidChanged() {
      this.Uid = parseInt(this.myUid)
      this.$emit('setUid', this.Uid)
    },
    handleSelect(item) {
      this.uidChanged()
    },
    createFilter(queryString) {
      return (obj) => {
        const str = obj.value + ''
        return (str.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    getFromStorage() {
      let savedUids = []
      try {
        savedUids = JSON.parse(localStorage.getItem('inputUids'))
        if (!$libType.IsArray(savedUids)) {
          savedUids = []
        }
      } catch (e) {
        savedUids = []
      }
      this.Uids = []
      var arr = savedUids.reverse()
      for (var i in arr) {
        this.Uids.push({ value: arr[i] })
      }
      var tmp = localStorage.getItem('uid-input')
      if (tmp) {
        this.myUid = tmp
        this.uidChanged()
      }

      console.log('input uid', this.myUid)
    },
    saveUid(uid) {
      this.myUid = uid
      this.uidChanged()
      this.saveUidToStorage()
    },
    saveUidToStorage() {
      this.setIntoStorage()
    },
    setIntoStorage() {
      localStorage.setItem('uid-input', this.myUid)

      var savedUids = []
      try {
        savedUids = JSON.parse(localStorage.getItem('inputUids'))
        if (!$libType.IsArray(savedUids)) {
          savedUids = []
        }
      } catch (e) {
        savedUids = []
      }

      for (const i in savedUids) {
        if (savedUids[i] == this.Uid) {
          savedUids.splice(i, 1)
          break
        }
      }
      savedUids.push(this.myUid)
      if (savedUids.length >= 20) {
        savedUids.splice(0, 1)
      }
      localStorage.setItem('inputUids', JSON.stringify(savedUids))
      this.getFromStorage()
    }
  }
}
</script>

