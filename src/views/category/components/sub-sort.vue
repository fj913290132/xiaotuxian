<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active:sortParams.sortField===null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active:sortParams.sortField==='publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active:sortParams.sortField==='orderNum'}" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{active:sortParams.sortField==='evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod==='asc'}" />
        <i class="arrow down"  :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod==='desc'}"  />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changechecked" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changechecked" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue-demi'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互(实现交互的数据和后台保持一致)
    // 1.明确交互数据
    const sortParams = reactive({
      inventory: false, // 库存
      onlyDiscount: false, // 特惠
      sortField: null, // 用来保存点击的是哪个排序
      sortMethod: null // 如果点击的是价格排序，用来判断给升序还是降序
    })
    // 3.绑定按钮的点击事件，修改排序字段和排序方式
    const changeSort = (px) => {
      if (px === 'price') {
        sortParams.sortField = px
        // 处理排序
        if (sortParams.sortMethod === null) { // sortMethod没有值代表我是第一次来点你的
          sortParams.sortMethod = 'desc' // 第一次来点击价格按照降序来排序
        } else { // 证明你点击过了
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else { // 其他普通按钮
      // 如果已经选中阻止运行
        if (sortParams.sortField === px) return
        sortParams.sortField = px
        sortParams.sortMethod = null
      }
      // 触发 sort-change 事件
      emit('sort-change', sortParams)
    }
    const changechecked = () => {
      // 触发 sort-change 事件
      emit('sort-change', sortParams)
    }

    // 2.提供给模板使用
    return { sortParams, changeSort, changechecked }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
