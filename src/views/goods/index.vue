<template>
  <div class='xtx-goods-page' >
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem v-if="goods" to="/">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods" to="/">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods" to="/">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage v-if="goods" :images="goods.mainPictures"/>
        <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName v-if="goods" :goods="goods"/>
          <GoodsSku v-if="goods" :goods="goods"  @change="changeSku"/>
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="num"  />
          <!-- 按钮组件 -->
          <XtxButton @click="insertCart" type="primary" style="margin-top:20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant  v-if="goods"  :goodsId="goods.id"/>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn/>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot   :type="1"/>
          <GoodsHot   :type="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import { findGoods } from '@/api/product'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsWarn,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot
  },
  setup () {
    const currsku = ref(null)
    // 1.获取商品详情，进行渲染
    const goods = useGoods()
    const changeSku = (obj) => {
      // 修改商品的原价现价库存信息
      if (obj.skuId) {
        goods.value.price = obj.price
        goods.value.oldPrice = obj.oldPrice
        goods.value.inventory = obj.inventory
      }
      currsku.value = obj
    }
    // 提供goods数据给后代使用
    provide('goods', goods)
    // 选择的数量
    const num = ref(1)

    const store = useStore()
    // 加入购物车按钮点击事件
    const insertCart = () => {
      if (currsku.value && currsku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currsku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/inSertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          count: num.value,
          isEffective: true
        })
        Message({ type: 'warn', text: '加入购物车成功' })
      } else {
        Message({ type: 'warn', text: '请选择完整规格' })
      }
    }

    return { goods, changeSku, num, insertCart }
  }
}
// 获取商品详情
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(({ result }) => {
        goods.value = null
        nextTick(() => {
          goods.value = result
        })
      })
    }
  }, { immediate: true })

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
</style>
