import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'
const Layout = () => import('@/views/Layout.vue')
// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: () => import('@/views/home')
      },
      {
        path: 'category/:id',
        component: () => import('@/views/category/index.vue')
      },
      {
        path: 'category/sub/:id',
        component: () => import('@/views/category/sub.vue')
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods/index.vue')
      },
      {
        path: '/cart',
        component: () => import('@/views/cart/index.vue')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/menmber/pay/checkout.vue')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/menmber/pay/index.vue')
      },
      {
        path: '/pay/result',
        component: () => import('@/views/menmber/pay/result.vue')
      },
      {
        path: '/member',
        component: () => import('@/views/menmber/Layout.vue'),
        children: [
          {
            path: '/member',
            component: () => import('@/views/menmber/home/index.vue')
          },
          /* {
            path: '/member/order',
            component: () => import('@/views/menmber/order/index.vue')
          },
          {
            path: '/member/order/:id',
            component: () => import('@/views/menmber/order/detail.vue')
          } */
          {
            path: '/member/order',
            component: { render: () => h(<RouterView/>) },
            children: [
              {
                path: '',
                component: () => import('@/views/menmber/order/index.vue')
              },
              {
                path: ':id',
                component: () => import('@/views/menmber/order/detail.vue')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

/* //! 路由前置守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由：地址是以/member 开头
  const profile = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    console.log(router)
    // return next({ path: '/', query: { redirectUrl: to.fullPath } })
  }
  next()
}) */
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
