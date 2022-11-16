/* 面包屑组件 */

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    //! 用法
    // 1.template 标签去除
    // 2.返回值是组件内容
    // 3.vue2.0的h函数传参进来的，vue3.0的h函数是导入进来的
    // 4.h第一个参数 标签名字 第二个标签属性对象 第三个参数子节点

    //! 需求
    // 1.创建xtx-bread父容器
    // 2.获取默认插槽内容
    // 3.去除xtx-bread-item组件的i标签，应该有render函数来组织
    // 4.遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
    // 5.把动态创建的节点渲染在xtx-bread标签中
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, index) => {
      dymanicItems.push(item)
      if (index < (items.length - 1)) {
        //! h函数用来创建标签
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

/* 去除scoped  XtxBreadItem也需要样式*/
<style  lang='less'>
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  // ul li:last-child{}
  // 先找到父元素，找到所有子元素最后一个，判断是否最后一个，是就选中不是就是无效选择器
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
