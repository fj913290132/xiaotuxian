<template>
  <div class="goods-sku" >
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
        <img :class="{selected:val.selected,disabled:val.disabled}"  @click="changeSku(val,item.values)" v-if="val.picture"  :src="val.picture" :title="val.name" alt="">
        <span :class="{selected:val.selected,disabled:val.disabled}"  @click="changeSku(val,item.values)" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
// 得到一个路径字典对象
import PowerSet from '@/vender/power-set'
const spliter = '★'
const pathMap = {}
const getPathMap = (skus) => {
// 1.得到左右sku集合 props.goods.sku
// 2.从所有的sku中筛选出有效的sku
// 3.根据有效的sku使用power-set算法得到子集
// 4.根据子集往路径字典对象中存储 key-value
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组 子集
      const valueArrPowerSet = PowerSet(valueArr)
      // 遍历子集
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：['蓝色','美国']==> '蓝色★美国'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

//! 更新按钮禁用状态
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态由它本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2.判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3.拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 4.剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 5.拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用(true)
      val.disabled = !pathMap[key]
      // 去字典中查找是否有数据，有可以点击，没有不可点击
      // val.disabled = !pathMap[val.name]
    })
  })
}

// 默认选中的方法
const initDeaultSelected = (goods, skuId) => {
  // 1.找出sku的信息
  // 2.遍历每一个按钮，按钮的值和sku记录的值相同，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 根据skuid初始化选中状态
    if (props.skuId) {
      initDeaultSelected(props.goods, props.skuId)
    }
    const pathMap = getPathMap(props.goods.skus)
    //! ☆组件初始化更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1.选中与取消选中，约定在每一个按钮都拥有自己的选中状态数据：selected
    const changeSku = (val, items) => {
      // 当按钮时禁用的阻止程序运行
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        items.forEach(item => {
          item.selected = false
        })
        val.selected = true
      }
      //! ☆点击按钮时：更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息通知父组件{skuid,price,oldPrice,inventory,specsText}
      // 用作将来点击加入购物车时把这些数据传给后台
      // 1.选择完整的sku组合按钮，才可以拿到这些信息 ，提交父组件
      // 2.不是完整的sku组合按钮，提交空对象给父组件
      const validselectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validselectedValues.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[validselectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '')
        })
        // console.log(sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', ''))
      } else {
        // 不完整,父组件需要判断规格是否完整，不完整不能加入购物车
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
