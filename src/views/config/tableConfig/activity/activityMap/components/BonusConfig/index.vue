<template>
  <div>
    <el-row>
      <el-descriptions border direction="vertical" :column="3">
        <el-descriptions-item v-for="item in fields" :key="item.prop">
          <template slot="label">
            {{ item.label }}
          </template>
          <el-input v-model="bonusData[item.prop]" type="number" />
        </el-descriptions-item>
      </el-descriptions>
    </el-row>

    <el-button type="primary" style="margin-top: 12px;" @click="onSave">保存配置</el-button>
  </div>
</template>

<script>

export default {
  name: 'BonusConfig',
  props: {
    updateData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      bonusData: {
        ...this.generateBlankData()
      },
      fields: [
        { label: '年终大奖初始奖金', prop: 'InitBonus' },
        { label: '活动值转化比例(%)', prop: 'ActivityTransformRate', formatter: (row) => row.ActivityTransformRate.toFixed(2) + '%' },
        { label: '奖金增加转化比例(%)', prop: 'IncreaseTransformRate', formatter: (row) => row.IncreaseTransformRate.toFixed(2) + '%' },
        { label: '年终奖保底奖金', prop: 'GuaranteedBonus' },
        { label: '年终大奖发奖上限', prop: 'MaxBonus' }
      ]
    }
  },
  watch: {
    updateData: {
      handler(newVal) {
        this.$nextTick(() => this.getData())
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 检查所有数据必填
     * 可以是0
     */
    checkoutData() {
      if (this.bonusData.InitBonus !== 0 && !this.bonusData.InitBonus) {
        this.$message.error('年终大奖初始奖金不能为空')
        return false
      } else if (!this.bonusData.ActivityTransformRate !== 0 && !this.bonusData.ActivityTransformRate) {
        this.$message.error('活动值转化比例不能为空')
        return false
      } else if (!this.bonusData.IncreaseTransformRate !== 0 && !this.bonusData.IncreaseTransformRate) {
        this.$message.error('奖金增加转化比例不能为空')
        return false
      } else if (!this.bonusData.GuaranteedBonus !== 0 && !this.bonusData.GuaranteedBonus) {
        this.$message.error('年终奖保底奖金不能为空')
        return false
      } else if (!this.bonusData.MaxBonus !== 0 && !this.bonusData.MaxBonus) {
        this.$message.error('年终大奖发奖上限不能为空')
        return false
      } else if (this.bonusData.MaxBonus < 0 || this.bonusData.MaxBonus > 9999999999) {
        this.$message.error('年终大奖发奖上限必须在0到9999999999之间')
        return false
      }

      if (this.bonusData.InitBonus < 0 || this.bonusData.InitBonus > 9999999999) {
        this.$message.error('年终大奖初始奖金必须在0到9999999999之间')
        return false
      }
      return true
    },
    generateBlankData() {
      return {
        InitBonus: 0,
        ActivityTransformRate: 0,
        IncreaseTransformRate: 0,
        GuaranteedBonus: 0,
        MaxBonus: 0
      }
    },
    getData() {
      this.bonusData = (this.updateData.InitBonus === 0 || this.updateData.InitBonus)
        ? { ...this.updateData }
        : this.generateBlankData()
    },
    onSearch() {
      this.$emit('reload')
    },
    onSave() {
      if (!this.checkoutData()) {
        return false
      }

      const form = { ...this.bonusData }
      // 转换为数字
      for (const key in form) {
        form[key] = Number(form[key])
      }
      this.$emit('update', form)
    }
  }
}
</script>
