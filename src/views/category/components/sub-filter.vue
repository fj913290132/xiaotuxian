/* 筛选区 */
<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
        @click="changeBrand(item.id)"
          href="javascript:;"
          :class="{ active: filterData.brands.selectedBrand === item.id }"
          v-for="item in filterData.brands"
          :key="item.id"
          >{{ item.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a href="javascript:;"
        @click="changeProp(item,prop.id)"
        :class="{active:item.selectedProp===prop.id}"
        v-for="prop in item.properties" :key="prop.selectedAttr">{{
          prop.name
        }}</a>
      </div>
    </div>
  </div>
  <!-- 骨架 -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    // 监听二级类目ID的变化获取筛选器
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newval) => {
      filterLoading.value = true
      // 变化后的id有值，且处在二级类名路由下
      if (newval && route.path === ('/category/sub/' + newval)) {
        // 发请求获取数据
        findSubCategoryFilter(route.params.id).then(data => {
          //! console.log(data.result)
          // 每一组可选的筛选条件缺失 全部 条件，处理下数据加上全部
          // 给每一组数据加上一个选中的ID
          // 1.品牌
          data.result.brands.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          // 2.属性
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 设置修改的数据
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })
    // 记录当前选择的品牌
    const changeBrand = (brandID) => {
      filterData.value.brands.selectedBrand = brandID
      emit('filter-change', getFilterParams())
    }
    // 2.记录选择的销售属性
    const changeProp = (item, propid) => {
      item.selectedProp = propid
      emit('filter-change', getFilterParams())
    }
    // 获取筛选参数的函数
    const getFilterParams = () => {
      // 参考数据:{brandId:'',attrs:[{groupName:'',propertyName:''}]}
      const obj = {
        brandID: null,
        attrs: []
      }
      obj.brandID = filterData.value.brands.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    return {
      filterData,
      filterLoading,
      changeBrand,
      changeProp,
      getFilterParams
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
