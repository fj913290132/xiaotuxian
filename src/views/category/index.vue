<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <!-- 本来不会产生动画----当key发生变化时，节点会重新创建 -->
          <XtxBreadItem  :key="topCategory.id" >{{ topCategory.name }}</XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :silders="silders" autoPlay style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">{{ item.desc }}</p>
          <XtxMore :path="`/category/sub/${item.id}`" />
        </div>
        <div class="body">
          <GoodsItem
            v-for="goods in item.goods"
            :key="goods.id"
            :goods="goods"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xtxBreadItem from '@/components/library/xtx-bread-item.vue'
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  components: { xtxBreadItem, GoodsItem },
  name: 'TopCateGory',
  setup () {
    // 轮播图
    const silders = ref([])
    findBanner().then(data => {
      silders.value = data.result
    })
    /* 面包屑+所有子分类 ===>vuex */
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // 当前顶级分类===根据路由上的Id去找
      let cate = {}
      const item = store.state.category.List.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    // 获取各个子类目下商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(() => route.params.id, (newVal) => {
      // newval && getSubList()
      if (newVal && `/category/${newVal}` === route.path) getSubList()
    }, { immediate: true })

    return {
      silders,
      topCategory,
      subList
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

.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      justify-content: space-around;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}

.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
