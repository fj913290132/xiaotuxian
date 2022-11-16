<template>
    <div class="member-order-detail">
      <!-- 头部 -->
      <OrderDetailAction v-if="order" :order="order"/>
      <!-- 进度 -->
      <DetailStep v-if="order" :order="order" />
      <!-- 物流 -->
      <DetailLogistics v-if="order && [3,4,5].includes(order.orderState)" :order="order"/>
      <!-- 信息 -->
      <OrderInfo :order="order" />
    </div>
</template>
<script>
import OrderDetailAction from './components/detail-action.vue'
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import OrderInfo from './components/detail-info.vue'
export default {
  name: 'MemberDetail',
  components: { OrderDetailAction, DetailStep, DetailLogistics, OrderInfo },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return {
      order
    }
  }
}
</script>

<style scoped>
.member-order-detail{
  background: #fff;
  height: 100%;
}
</style>
