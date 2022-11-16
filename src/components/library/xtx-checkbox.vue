<template>
  <div class="xtx-checkbox"  @click="changechecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot/></span>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const checked = ref(false)
    const changechecked = () => {
      checked.value = !checked.value
      context.emit('update:modelValue', checked.value)
      // 让组件支持change事件
      context.emit('change', checked.value)
    }
    // 使用侦听器，得到父组件传递数据，给checked数据
    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    }, { immediate: true })
    return { checked, changechecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
