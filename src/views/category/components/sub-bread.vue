<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :key="category.top.id" v-if="category.top" to="/">{{
      category.top.name
    }}</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{
        category.sub.name
      }}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>
<script>
import { computed } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vuex获取顶级和二级类目信息
    // 数据对象:{top:{id,name},sub:{id,name}}
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 完成获取数据逻辑
      store.state.category.List.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return {
      category
    }
  }
}
</script>
<style scoped lang="less">
//面包屑动画
.fade-right-enter-from,
.fade-right-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.75s ;
}
.fade-right-enter-to,
.fade-right-leave-from {
  transform: none;
  opacity: 1;
}
</style>
