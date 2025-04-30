<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          ezShop
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">
                <i class="fas fa-shopping-cart"></i> 購物車
                <span v-if="cartItems.length > 0" class="badge bg-success">
                  {{ cartItems.reduce((a, c) => a + c.qty, 0) }}
                </span>
              </router-link>
            </li>
            <li class="nav-item dropdown" v-if="userInfo">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ userInfo.name }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    個人資料
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    登出
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown" v-if="userInfo && userInfo.isAdmin">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="adminDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                管理員
              </a>
              <ul class="dropdown-menu" aria-labelledby="adminDropdown">
                <li>
                  <router-link class="dropdown-item" to="/admin/userlist">
                    用戶管理
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/admin/productlist">
                    產品管理
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/admin/orderlist">
                    訂單管理
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item" v-if="!userInfo">
              <router-link class="nav-link" to="/login">
                <i class="fas fa-user"></i> 登入
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const cartStore = useCartStore()

    const userInfo = computed(() => userStore.userInfo)
    const cartItems = computed(() => cartStore.cartItems)

    const logout = () => {
      userStore.logout()
      router.push('/login')
    }

    return {
      userInfo,
      cartItems,
      logout
    }
  }
}
</script>