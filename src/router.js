import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Users from './components/users/Users.vue'
import Roles from './components/rights/Roles.vue'
import Rights from './components/rights/Rights.vue'
import Goods from './components/products/Goods.vue'
import GoodsAdd from './components/products/GoodsAdd.vue'
import Params from './components/products/Params.vue'
import Categories from './components/products/Categories.vue'
import Orders from './components/orders/Orders.vue'
import Reports from './components/charts/Reports.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/Users',
          component: Users
        },
        {
          path: '/Roles',
          component: Roles
        },
        {
          path: '/Rights',
          component: Rights
        },
        {
          path: '/Goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        },
        {
          path: '/Params',
          component: Params
        },
        {
          path: '/Categories',
          component: Categories
        },
        {
          path: '/Orders',
          component: Orders
        },
        {
          path: '/Reports',
          component: Reports
        }
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
