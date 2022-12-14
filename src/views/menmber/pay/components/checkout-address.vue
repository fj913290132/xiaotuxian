<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{
            showAddress.fullLocation.replace(/ /g, "") + showAddress.address
          }}
        </li>
      </ul>
      <a @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件/切换收货地址 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div
      @click="selectedAddress = item"
      :class="{ active: selectedAddress && selectedAddress.id === item.id }"
      class="text item"
      v-for="item in list"
      :key="item.id"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template v-slot:footer>
      <XtxButton
        @click="visibleDialog = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑组件 -->
  <AddressEdit @on-success="successHandler" ref="addressEditCom"/>
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components: {
    AddressEdit
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 1.找到默认收货地址
    // 2.没有默认收货地址，使用第一条收货地址
    // 3.如果没有数据，提示添加
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }

    // 对话框显示隐藏
    const visibleDialog = ref(false)
    // 记录当前选中的地址id
    const selectedAddress = ref(null)

    // 默认通知父组件一个收货地址id
    emit('change', showAddress.value && showAddress.value.id)

    // 对话框确认按钮点击事件
    const confirmAddressFn = () => {
      // 显示的地址换成选中的地址
      showAddress.value = selectedAddress.value
      // 选中的地址id通知给结算组件
      emit('change', selectedAddress.value.id)
      visibleDialog.value = false
    }
    const openDialog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }
    // 收货地址点击事件
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      // 添加给的是空对象，修改是一个对象
      addressEditCom.value.open(address)
    }
    // successHandler
    const successHandler = (formData) => {
      // 根据formData中的id去当前列表中查找，有就是修改，否则添加
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        // 修改
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        // 添加
        // 如果是添加：给list追加一条
        const obj = { ...formData }
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(obj)
      }
    }
    return {
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      openDialog,
      openAddressEdit,
      addressEditCom,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
