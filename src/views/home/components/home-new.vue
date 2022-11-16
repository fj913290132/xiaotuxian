<template>
  <HomePanel title="新鲜好物" subtitle="新鲜出炉  品质靠谱">
    <template v-slot:right>
      <xtx-more path="/" />
    </template>
    <!-- 面板内容，默认插槽 -->
    <!-- 面板内容 -->
    <div style="position: relative;height: 406px;" ref="target">
       <Transition name="fade">
    <ul v-if="goods.length" class="goods-list">
      <li v-for="item in goods" :key="item.id">
        <RouterLink :to="`/product/${item.id}`">
          <img :src="item.picture" alt="" />
          <p class="name ellipsis">{{ item.name }}</p>
          <p class="price">&yen;{{ item.price }}</p>
        </RouterLink>
      </li>
    </ul>
    <HomeSkeleton bg="#f0f9f4" v-else/>
    </Transition>
    </div>
  </HomePanel>
</template>
<script>
import { useLazyData } from '@/hooks'
import { findNew } from '@/api/home'
import HomePanel from './home-panel.vue'
import { ref } from 'vue'
import HomeSkeleton from './home-skeleton.vue'
export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])
    // findNew().then(data => { goods.value = data.result })
    //! Vue3 拿dom元素
    const target = ref(null)
    const result = useLazyData(target, findNew)
    return {
      goods: result,
      target
    }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
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
</style>
