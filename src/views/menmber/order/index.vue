<template>
  <div class="member-order">
    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="tabclick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
      @on-logistics="handlerLogistics"
        @on-confirm="handlerConfirm"
        @on-delete-order="onDeleteOrder"
        @on-cancel="onCancel"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- 分页 -->
    <XtxPagination
      v-if="total > 0"
      :current-page="requestParams.page"
      :total="total"
      :page-size="requestParams.pageSize"
      @currentPage="requestParams.page = $event"
    />
    <!-- 取消原因组件 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流信息对话框 -->
    <OrderLogistics ref="OrderLogisticsCom" />
  </div>
</template>
<script>
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from '@/views/menmber/order/components/order-logistics.vue'
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, delteOrder, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
export default {
  name: 'MemberOrderPage',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    const loading = ref(true)
    const total = ref(0)
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 10,
      orderState: 0 // 订单状态
    })
    // 订单列表
    const orderList = ref([])

    //
    const getOrderList = () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    // 查询订单(筛选条件发生变化重新加载)
    watch(requestParams, () => {
      getOrderList()
    }, { immediate: true })

    const tabclick = ({ index }) => {
      requestParams.page = 1
      requestParams.orderState = index
      // console.log(index, requestParams.orderState)
    }
    // 删除逻辑
    const onDeleteOrder = (item) => {
      console.log(item)
      Confirm({ text: '确定要删除吗？' }).then(() => {
        delteOrder(item.id).then(data => {
          Message({ type: 'success', text: '删除好了' })
          getOrderList()
        })
      }).catch(e => { })
    }
    return {
      ...useCancel(),
      onDeleteOrder,
      activeName,
      orderStatus,
      orderList,
      tabclick,
      loading,
      total,
      requestParams,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单逻辑
export const useCancel = () => {
  const orderCancelCom = ref(null)
  const onCancel = (order) => {
    // console.log(order)
    orderCancelCom.value.open(order)
  }
  return { orderCancelCom, onCancel }
}
// 确认收货逻辑
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '确定要收货吗？' }).then(() => {
      confirmOrder(order.id).then(data => {
        Message({ type: 'success', text: '确认收货成功' })
        order.orderState = 4
      })
    })
  }
  return { handlerConfirm }
}

// 查看物流逻辑
export const useLogistics = () => {
  const OrderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    OrderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, OrderLogisticsCom }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
