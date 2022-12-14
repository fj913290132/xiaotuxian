<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{active}">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <span v-else @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{item.name}}</span>
    </div>
  </div>
</template>
<script>
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const loading = ref(false)
    const cityData = ref([])
    // 控制展开收起,默认收起
    const active = ref(false)
    const openDialog = () => {
      active.value = true
      // 获取地区数据
      loading.value = true
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
      // 清空之前的数据
      for (const k in changeResult) {
        changeResult[k] = ''
      }
    }
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 定义计算属性
    const currList = computed(() => {
      let list = cityData.value
      // TODO 根据点击的省份城市获取对应的列表
      // 默认省一级
      // 可能市一级
      if (changeResult.provinceCode && changeResult.provinceName) {
        // 找到点击的那个省在拿底下那个市
        list = list.find(item => item.code === changeResult.provinceCode).areaList
      }
      // 可能县一级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(item => item.code === changeResult.cityCode).areaList
      }
      return list
    })
    //! 定义选择 省市区 数据
    const changeResult = reactive({
      provinceCode: '', // 选择的省的code
      provinceName: '', // 省名字
      cityCode: '', // 选择的市的code
      cityName: '', // 市名字
      countyCode: '', // 选择的区/县的code
      countyName: '', // 区/县名字
      fullLocation: ''// 完整的地址
    })
    // 当点击按钮的时候记录
    const changeItem = (item) => {
      if (item.level === 0) {
        // 省
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        // 市
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        // 区县
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        closeDialog()
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('change', changeResult)
      }
    }
    return { active, toggleDialog, target, loading, currList, changeItem, changeResult }
  }
}
// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 这个位置可能有异常操作，封装成promise
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData)
    } else {
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
     .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
