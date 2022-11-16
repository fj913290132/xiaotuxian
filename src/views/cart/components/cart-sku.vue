<template>
  <div class="cart-sku"  ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <GoodsSku @change="changeSku" v-else :goods="goods" :skuId="skuId" />
      <XtxButton  @click="submit" v-if="!loading" type="primary" size="mini" style="margin-left:60px">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
export default {
  name: 'CartSku',
  props: ['attrsText', 'skuId'],
  components: { GoodsSku },
  setup (props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)
    const goods = ref()
    // 打开
    const open = async () => {
      visible.value = true
      loading.value = true
      // 获取商品数据(specs,skus)
      getSpecsAndSkus(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
      // goods.value = res.result

      // console.log(res.result.id)
    }
    // 关闭
    const close = () => {
      visible.value = false
    }
    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击其他地方关闭
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 监听sku改变的函数
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }
    // 点击确认的时候，提交sku信息给购物车组件
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整，sku中的skuId不能现有props.skuId一样
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
        close()
      }
    }
    return { visible, toggle, target, goods, loading, changeSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
