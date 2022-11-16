<template>
    <div class="detail-step">
      <XtxSteps :active="order.orderState===6?1:order.orderState">
    <xtxStepsItem title="提交订单" :desc="order.createTime"></xtxStepsItem>
    <xtxStepsItem title="付款成功" :desc="order.payTime"></xtxStepsItem>
    <xtxStepsItem title="商品发货" :desc="order.consignTime"></xtxStepsItem>
    <xtxStepsItem title="确认收货" :desc="order.evaluationTime"></xtxStepsItem>
    <xtxStepsItem title="订单完成" :desc="order.endTime"></xtxStepsItem>
    </XtxSteps>
    </div>
</template>
<script>

export default {
  name: 'DetailStep',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
