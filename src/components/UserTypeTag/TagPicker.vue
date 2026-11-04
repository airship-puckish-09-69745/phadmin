<template>
  <div class="tag-picker">
    <div class="tag-picker__toolbar">
      <!-- 无限级联动筛选：每选一级，下一级选项由上一级结果推导 -->
      <el-select
        v-for="(level, idx) in visibleLevels"
        :key="level.key"
        v-model="filters[level.key]"
        size="small"
        clearable
        filterable
        :placeholder="level.label"
        class="tag-picker__filter"
        @change="onFilterChange(idx)"
      >
        <el-option v-for="opt in levelOptions(idx)" :key="opt.value" :label="opt.label" :value="opt.value"/>
      </el-select>
      <div class="tag-picker__participation">
        <i class="el-icon-s-flag"/>
        <el-switch
          :value="isParticipate"
          :active-text="participateActiveText"
          :inactive-text="participateInactiveText"
          active-color="#67c23a"
          inactive-color="#c0c4cc"
          class="tag-picker__participation-switch"
          @change="$emit('participate-change', $event)"
        />
      </div>
      <el-radio-group v-model="viewMode" size="small" class="tag-picker__view">
        <el-radio-button label="all">展示全部（{{ rows.length }}）</el-radio-button>
        <el-radio-button label="selected">展示已选（{{ selectedTags.length }}）</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      v-loading="loading"
      :data="displayRows"
      border
      size="small"
      max-height="360"
      empty-text="暂无标签"
      :row-class-name="rowClassName"
    >
      <el-table-column width="55" align="center">
        <template slot="header">
          <el-checkbox
            :value="allDisplayedChecked"
            :indeterminate="someDisplayedChecked && !allDisplayedChecked"
            @change="toggleDisplayed"
          />
        </template>
        <template slot-scope="{ row }">
          <el-checkbox :value="isSelected(row)" @change="toggle(row, $event)"/>
        </template>
      </el-table-column>
      <el-table-column label="标签类型" prop="typeName" width="130"/>
      <el-table-column label="游戏" prop="gameName" width="130"/>
      <el-table-column label="标签" min-width="170">
        <template slot-scope="{ row }">
          {{ row.tagName }}
          <span class="tag-picker__id">#{{ row.tagId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" min-width="200">
        <template slot-scope="{ row }">
          <template v-if="isSelected(row)">
            <span v-if="row.isBool" class="tag-picker__id">无需选择等级</span>
            <el-checkbox-group v-else :value="getSelected(row).tagValues" @input="setValues(row, $event)">
              <el-checkbox v-for="g in row.gradeOptions" :key="g.value" :label="g.value">{{ g.label }}</el-checkbox>
            </el-checkbox-group>
          </template>
          <span v-else class="tag-picker__id">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
import {TAG_TYPE_NAMES} from './config'

const LEVELS = [
  {key: 'tagType', label: '标签类型'},
  {key: 'tagGid', label: '游戏'},
  {key: 'tagId', label: '标签'}
]

/** 解析标签属性 JSON，失败返回空对象 */
function parseAttr(attr) {
  try {
    return JSON.parse(attr) || {}
  } catch (e) {
    return {}
  }
}

export default {
  name: 'TagPicker',
  props: {
    // 已选标签：[{ tagType, tagGid, tagId, tagValues }]
    value: {type: Array, default: () => []},
    // 限定标签类型；为空则不限制
    tagTypes: {type: Array, default: () => []},
    isParticipate: {type: Boolean, default: true},
    participateActiveText: {type: String, default: '参与活动'},
    participateInactiveText: {type: String, default: '不参与活动'}
  },
  data() {
    return {
      loading: false,
      tagList: [],
      gameNames: {},
      filters: {tagType: '', tagGid: '', tagId: ''},
      viewMode: 'all'
    }
  },
  computed: {
    selectedTags() {
      return Array.isArray(this.value) ? this.value : []
    },
    // 按标签类型 -> 游戏 -> 标签构建树，再深度优先展开为全部标签行
    rows() {
      const tree = {}
      this.tagList.forEach(o => {
        const typeNode = tree[o.tagType] || (tree[o.tagType] = {})
        const gidNode = typeNode[o.tagGid] || (typeNode[o.tagGid] = [])
        gidNode.push(o)
      })
      const result = []
      Object.keys(tree).sort((a, b) => a - b).forEach(type => {
        Object.keys(tree[type]).sort((a, b) => a - b).forEach(gid => {
          tree[type][gid].sort((a, b) => a.tagId - b.tagId).forEach(o => result.push(this.toRow(o)))
        })
      })
      return result
    },
    visibleLevels() {
      return LEVELS
    },
    filteredRows() {
      return this.rows.filter(r => this.matchFilters(r, LEVELS))
    },
    displayRows() {
      return this.viewMode === 'selected' ? this.filteredRows.filter(r => this.isSelected(r)) : this.filteredRows
    },
    allDisplayedChecked() {
      return this.displayRows.length > 0 && this.displayRows.every(r => this.isSelected(r))
    },
    someDisplayedChecked() {
      return this.displayRows.some(r => this.isSelected(r))
    }
  },
  created() {
    this.fetchTags()
    this.fetchGames()
  },
  methods: {
    /** 把接口返回的标签转换为表格行（含等级选项） */
    toRow(o) {
      const attr = parseAttr(o.tagAttr)
      // 等级来源优先级：grade > avgBetRange
      const grade = [attr.grade, attr.avgBetRange].find(a => Array.isArray(a) && a.length) || []
      const isBool = grade.length === 0 || grade.every(g => Number(g) === 0)
      const many = o.tagId >= 50010 && o.tagId < 50040
      return {
        tagType: o.tagType,
        tagGid: o.tagGid || 0,
        tagId: o.tagId,
        tagName: o.tagName,
        typeName: TAG_TYPE_NAMES[o.tagType] || `类型${o.tagType}`,
        gameName: o.tagGid > 0 ? (this.gameNames[o.tagGid] || `游戏${o.tagGid}`) : '用户标签',
        isBool,
        isMany: many,
        gradeOptions: isBool ? [] : grade.map((g, i) => ({
          value: i + 1,
          label: many || i > 2 ? `${i + 1}级` : ['轻度', '中度', '重度'][i]
        }))
      }
    },
    /** 标签唯一键：游戏ID_标签ID */
    key(r) {
      return `${r.tagGid || 0}_${r.tagId}`
    },
    /** 获取行对应的已选标签 */
    getSelected(row) {
      return this.selectedTags.find(t => this.key(t) === this.key(row))
    },
    /** 行是否已选中 */
    isSelected(row) {
      return !!this.getSelected(row)
    },
    /** 选中标签时的默认等级值 */
    defaultValues(row) {
      if (row.isBool) return [0]
      if (row.isMany) return [row.gradeOptions.length]
      return [row.gradeOptions[row.gradeOptions.length - 1].value]
    },
    /** 向外层同步标签数组 */
    emit(list) {
      this.$emit('input', list)
    },
    /** 勾选/取消单个标签 */
    toggle(row, checked) {
      const rest = this.selectedTags.filter(t => this.key(t) !== this.key(row))
      this.emit(checked
        ? [...rest, {tagType: row.tagType, tagGid: row.tagGid, tagId: row.tagId, tagValues: this.defaultValues(row)}]
        : rest)
    },
    /** 全选/取消当前展示的所有标签 */
    toggleDisplayed(checked) {
      const displayedKeys = new Set(this.displayRows.map(this.key))
      const rest = this.selectedTags.filter(t => !displayedKeys.has(this.key(t)))
      if (!checked) return this.emit(rest)
      const added = this.displayRows.map(row => this.getSelected(row) || {
        tagType: row.tagType, tagGid: row.tagGid, tagId: row.tagId, tagValues: this.defaultValues(row)
      })
      this.emit([...rest, ...added])
    },
    /** 修改标签的等级值 */
    setValues(row, values) {
      // 非布尔标签至少保留一个等级
      if (!values.length) return
      this.emit(this.selectedTags.map(t => this.key(t) === this.key(row)
        ? {...t, tagValues: values.slice().sort((a, b) => a - b)}
        : t))
    },
    /** 行是否满足指定层级的筛选条件 */
    matchFilters(row, levels) {
      return levels.every(l => {
        const f = this.filters[l.key]
        return f === '' || f === null || f === undefined || row[l.key] === f
      })
    },
    // 第 idx 级的选项：来自满足前面各级已选条件的行
    levelOptions(idx) {
      const level = LEVELS[idx]
      const prev = LEVELS.slice(0, idx)
      const seen = new Set()
      const opts = []
      this.rows.forEach(r => {
        if (!this.matchFilters(r, prev) || seen.has(r[level.key])) return
        seen.add(r[level.key])
        opts.push({
          value: r[level.key],
          label: level.key === 'tagType' ? r.typeName : level.key === 'tagGid' ? r.gameName : r.tagName
        })
      })
      return opts
    },
    /** 某级筛选变化时，重置其后各级筛选 */
    onFilterChange(idx) {
      LEVELS.slice(idx + 1).forEach(l => {
        this.filters[l.key] = ''
      })
    },
    /** 已选行高亮 */
    rowClassName({row}) {
      return this.isSelected(row) ? 'tag-picker__row--selected' : ''
    },
    /** 拉取标签配置 */
    fetchTags() {
      // 不需要展示的 tag_id
      const hiddenTagIds = [20000]
      this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {Path: '/thirdparties/tag/config'}
      }).then(res => {
        if (res.RetCode !== 0 || !Array.isArray(res.Data)) return
        this.tagList = res.Data
          .filter(o => !hiddenTagIds.includes(o.tagId))
          .filter(o => !this.tagTypes.length || this.tagTypes.includes(o.tagType))
          .sort((a, b) => a.id - b.id)
      }).finally(() => {
        this.loading = false
      })
    },
    /** 拉取游戏列表，用于展示游戏名 */
    fetchGames() {
      request({url: '/thirdpartygames/all', method: 'get', data: {}}).then(res => {
        if (res.RetCode !== 0 || !Array.isArray(res.Data)) return
        const map = {}
        res.Data.forEach(g => {
          map[g.Gid] = g.Name
        })
        this.gameNames = map
      })
    }
  }
}
</script>

<style scoped>
.tag-picker__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.tag-picker__filter {
  width: 150px;
}

.tag-picker__participation {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 10px;
  color: #606266;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 16px;
}

.tag-picker__participation > i {
  margin-right: 8px;
  color: #67c23a;
}

.tag-picker__participation-switch {
  line-height: 1;
}

.tag-picker__view {
  margin-left: auto;
}

.tag-picker__id {
  color: #909399;
  font-size: 12px;
}

.tag-picker >>> .tag-picker__row--selected {
  background: #f0f9eb;
}

.tag-picker .el-checkbox-group .el-checkbox {
  margin-right: 14px;
}
</style>
