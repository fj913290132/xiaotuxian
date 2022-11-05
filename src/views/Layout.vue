<!--有头有底的容器 -->
<template>
    <!-- 顶部通栏 -->
      <AppTopnav/>
    <!-- 头部 -->
    <AppHeader></AppHeader>
    <!-- 内容容器 -->
    <div class="main">
      <!-- 二级挂载点 -->
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <AppFooter/>
</template>
<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  name: 'my-layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter
  },
  setup () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
