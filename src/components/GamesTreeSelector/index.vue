<template>
  <div>
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      clearable
    />
    <el-tree
      ref="tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      highlight-current
      :default-expand-all="expandAll"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @check-change="handleCheckChange"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'GamesTreeSelector',
  props: {
    selectedGamesId: {
      type: Array,
      default: () => []
    },
    subGamesId: {
      type: Array,
      default: () => []
    },
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [],
      // 选择的游戏节点，包含id和label属性
      selectedGames: [],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      filterText: '',
      filterGameIds: [],
      GameIdCfg: [
        // 21, 22, 2031, 10002
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selectedGamesId(val) {
      this.setCheckedGames()
    }
  },
  created() {
    this.getGameAll()
    this.setCheckedGames()
  },
  methods: {
    setCheckedGames() {
      this.$nextTick(() => {
        this.GameIdCfg = this.selectedGamesId || []
        console.log('setCheckedGames', this.GameIdCfg)
        this.$refs.tree.setCheckedKeys(this.GameIdCfg)
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      // 处理选中状态变化的逻辑
      console.log('Checked nodes:', data)
      // console.log('Checked:', this.$refs.tree.getCheckedKeys())
      this.$nextTick(() => {
        const selectedGames = this.$refs.tree.getCheckedNodes()
        // 过滤父节点
        this.selectedGames = selectedGames.filter(game => !game.children)
        this.$emit('change', this.selectedGames)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1 || this.filterGameIds.indexOf(obj.Gid) >= 0) {
              continue
            }
            if (this.subGamesId.length > 0 && this.subGamesId.indexOf(obj.Gid) < 0) {
              continue
            }

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

          for (const key in data) {
            const games = data[key]
            const cty = { id: 'p-' + key, label: categories[key], children: [] }

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({ id: game.Gid, label: game.Name })
            }
            this.treeData.push(cty)
          }

          this.$refs.tree.setCheckedKeys(this.GameIdCfg)
        }
      })
    }
  }
}
</script>
