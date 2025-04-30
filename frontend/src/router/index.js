import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import ShippingView from '../views/ShippingView.vue'
import PaymentView from '../views/PaymentView.vue'
import PlaceOrderView from '../views/PlaceOrderView.vue'
import OrderView from '../views/OrderView.vue'
import AdminProductListView from '../views/AdminProductListView.vue'
import AdminOrderListView from '../views/AdminOrderListView.vue'
import AdminUserListView from '../views/AdminUserListView.vue'
import AdminProductEditView from '../views/AdminProductEditView.vue'
import AdminUserEditView from '../views/AdminUserEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/shipping',
      name: 'shipping',
      component: ShippingView
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentView
    },
    {
      path: '/placeorder',
      name: 'placeorder',
      component: PlaceOrderView
    },
    {
      path: '/order/:id',
      name: 'order',
      component: OrderView
    },
    {
      path: '/admin/productlist',
      name: 'adminProductList',
      component: AdminProductListView
    },
    {
      path: '/admin/orderlist',
      name: 'adminOrderList',
      component: AdminOrderListView
    },
    {
      path: '/admin/userlist',
      name: 'adminUserList',
      component: AdminUserListView
    },
    {
      path: '/admin/product/:id/edit',
      name: 'adminProductEdit',
      component: AdminProductEditView
    },
    {
      path: '/admin/user/:id/edit',
      name: 'adminUserEdit',
      component: AdminUserEditView
    }
  ]
})

// 路由守衛，可以在此添加登入驗證等邏輯
router.beforeEach((to, from, next) => {
  next()
})

export default router