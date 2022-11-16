<!--有头有底的容器 -->
<template>
  <!-- 顶部通栏 -->
  <AppTopnav />

  <!-- 头部 -->
  <AppHeader></AppHeader>

  <!-- 吸顶头部 -->
  <AppHeaderSticky />

  <!-- 内容容器 -->
    <!-- 二级挂载点 -->
    <router-view></router-view>
  <!-- 底部 -->
  <AppFooter />
</template>
<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'my-layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    // 获取分类数据
    const store = useStore()
    store.dispatch('category/getList')
    // console.log(store.state.category)
    return {
    }
  }
}
</script>

<style scoped>

</style>
