<template>
  <div class="xtx-pagination">
    <a @click="changePager(myCurrentPage-1)" v-if="myCurrentPage>1" href="javascript:;" >上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start>1">...</span>
    <a @click="changePager(i)" href="javascript:;" v-for="i in pager.btnarr" :key="i" :class="{active:i===myCurrentPage}">{{i}}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a @click="changePager(myCurrentPage+1)" v-if="myCurrentPage<pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 需要数据：
    // 1.约定按钮的个数五个（展示五个)
    const count = 5
    // 2.当前显示的页码
    const myCurrentPage = ref(1)
    // 3.总页数=总条数/每一页条数 向上取整
    const myTotal = ref(100) // 总条数
    const myPageSize = ref(10) // 每页显示多少条
    // 其他数据(总页数，其实按钮，结束按钮，按钮数组) 依赖上面数据得到
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 按钮个数和当前页码==>起始按钮，结束按钮，按钮数组
      // 1.理想情况下:
      const offset = Math.floor(count / 2)
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      // 2.如果起始页小于0需要处理
      if (start < 1) {
        start = 1
        end = (start + count - 1) > pageCount ? pageCount : (start + count - 1)
      }
      // 3.如果结束页码大于总页数，也要处理
      if (end > pageCount) {
        end = pageCount
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }
      const btnarr = []
      for (let i = start; i <= end; i++) {
        btnarr.push(i)
      }
      return {
        pageCount,
        btnarr,
        start,
        end
      }
    })

    // 监听props的变化，更新组件渲染
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    })

    // 切换分页函数
    const changePager = (page) => {
      // console.log(page)
      myCurrentPage.value = page
      // 通知父组件
      emit('current-page', page)
    }
    return { myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
