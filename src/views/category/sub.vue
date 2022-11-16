<template>
    <div class="sub-categroy">
      <div class="container">
        <!-- 面包屑 -->
        <SubBread/>
        <!-- 筛选区 -->
        <SubFilter @filter-change="filterChange"/>
        <!-- 商品面板 -->
        <div class="goods-list">
          <SubSort @sort-change="sortChange"/>
           <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id" >
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <xtx-infinite-loading @infinite="getData" :loading="loading" :finished="finished"></xtx-infinite-loading>
        </div>
      </div>
    </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCateGory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => { // 只要进入可视区子组件就触发事件
      loading.value = true
      // 设置二级分类的id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }

    // 切换二级分类重新加载
    watch(() => route.params.id, (newVal) => {
      finished.value = false
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })

    // 1.更改排序组件的筛选数据，从新请求
    const sortChange = (sortparams) => {
      finished.value = false
      // 合并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...sortparams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 2.更改筛选组件的筛选数据，重新请求
    const filterChange = (data) => {
      finished.value = false
      // 合并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...data }
      reqParams.page = 1
      goodsList.value = []
    }
    return {
      getData,
      loading,
      finished,
      goodsList,
      sortChange,
      filterChange
    }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
