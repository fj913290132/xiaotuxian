<template>
  <div class="detail-logistics" v-if="list">
    <p>
      <span>{{list[0].time}}</span>
      <span>{{list[0].text}}</span>
    </p>
    <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
    <OrderLogistics ref="OrderLogisticsCom" />
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue'
import OrderLogistics from '@/views/menmber/order/components/order-logistics.vue'
import { useLogistics } from '../index.vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    const list = ref(null)
    logisticsOrder(props.order.id).then(data => {
      // console.log(data)
      list.value = data.result.list
    })
    return { list, ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
