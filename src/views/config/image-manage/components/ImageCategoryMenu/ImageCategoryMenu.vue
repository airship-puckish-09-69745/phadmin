<template>
  <div class="image-category-menu">
    <div
      v-for="option in options"
      :key="option.value"
      :class="[
        'image-category-menu__option',
        {
          'image-category-menu__option--selected': isSelected(option.value),
        }
      ]"
      @click="selectOption(option)"
    >
      <div v-if="option.icon" class="image-category-menu__option-icon">
        <i :class="option.icon" />
      </div>
      <div class="image-category-menu__option-label">{{ option.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCategoryMenu',
  props: {
    value: {
      type: String,
      default: 'image'
    },

    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    isSelected(value) {
      return this.selectedValue === value
    },
    selectOption(option) {
      if (!option.disabled) {
        this.selectedValue = option.value
        this.$emit('change', option.value)
        this.$emit('select', option)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-category-menu {
  width: 100%;

  &__option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: #303133;
    border-left: 4px solid transparent;

    &:hover,
    &--selected {
      background-color: rgb(217, 236, 255);
      color: #409eff;
      border-left: 4px solid #409eff;
    }

    &-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-label {
      flex-grow: 1;
    }

    &-check {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
