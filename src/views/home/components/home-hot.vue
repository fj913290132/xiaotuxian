<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <div style="position: relative;height: 426px;" ref="target">
       <Transition name="fade">
    <ul ref="pannel" class="goods-list" v-if="goods.length">
      <li v-for="item in goods" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul>
     <HomeSkeleton v-else />
     </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { useLazyData } from '@/hooks'
import { ref } from 'vue'
import HomePanel from './home-panel'
import { findHot } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    /* const goods = ref([])
    findHot().then(data => {
      goods.value = data.result
    }) */
    //! Vue3 拿dom元素
    const target = ref(null)
    const result = useLazyData(target, findHot)
    return { goods: result, target }
  }
}
</script>

<style scoped lang='less'>
.fade{
  &-leave {
    &-active {
      position: absolute;
      width: 100%;
      transition: opacity .5s .2s;
      z-index: 1;
    }
    &-to {
      opacity: 0;
    }
  }
}
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
