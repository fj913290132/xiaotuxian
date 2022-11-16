<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
    <!-- <XtxSkeleton width="200px" height="200px" bg="red" animated/> -->
  </div>
  <!-- 新鲜好物 -->
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot/>
  <!-- 品牌组件 -->
  <HomeBrand/>
  <!-- 产品区块 -->
  <HomeProduct/>
  <!-- 最新专题 -->
  <HomeSpecial/>
</template>
<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'myHome',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
  setup () {
    return {

    }
  }
}
</script>

<style scoped lang="less">

// 使用tranistion 组件实现动画，一个元素或者组件的(显示/隐藏，创建/销毁)

//进去前 v-enter (v3 v-enter-from)
//进入中 v-enter-active
//进入后 v-enter-to

//离开前 v-leave (v3 v-leave-from)
//离开中 v-leave-active
//离开后 v-leave-to

//需求：一个盒子在显示隐藏的时候做淡入淡出的动画
// 1. 准备盒子
// 2. 控制显示/隐藏
// 3. 加入动画
</style>
