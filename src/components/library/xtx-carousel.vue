<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
    <!-- 轮播图图片容器 -->
    <ul class="carousel-body">
      <!-- fade 显示的图片加上类名 -->
      <li
        class="carousel-item"
        v-for="(item, i) in silders"
        :key="item.id"
        :class="{ fade: index === i }"
      >
        <!-- 图片 -->
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <!-- 商品列表 -->
        <div v-else class="slider">
          <RouterLink
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <!-- 下一张 -->
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <!-- active 激活点 -->
      <span
        @click="index = i"
        v-for="(item, i) in silders"
        :key="i"
        :class="{ active: index === i }"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 轮播图数据
    silders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 自动播放的间隔市场
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 控制显示图片的索引
    const index = ref(0)
    // 自动轮播的逻辑
    // eslint-disable-next-line no-unused-vars
    let timer = null
    const autouPlayFn = () => {
      // 防止定时器重复添加
      clearInterval(timer)
      // 自动播放：每隔多久切换索引
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.silders.length) {
          index.value = 0
        }
      }, props.duration)
    }

    // 需要监听sliders数据变化，判断如果有数据且autoplay是true
    watch(() => props.silders, (newval) => {
      if (newval.length && props.autoPlay) {
        autouPlayFn()
      }
    }, { immediate: true })

    // 2.鼠标进入暂停，离开后开启自动播放(有开启条件)
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.silders.length && props.autoPlay) {
        autouPlayFn()
      }
    }

    // 3.点击点可以切换，上一张，下一张
    const toggle = (num) => {
      const newindex = index.value + num
      if (newindex > (props.silders.length - 1)) {
        index.value = 0
        return
      }
      if (newindex < 0) {
        index.value = props.silders.length - 1
        return
      }
      // 正常情况
      index.value = newindex
    }
    // 组件卸载时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return {
      index,
      stop,
      start,
      toggle
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
