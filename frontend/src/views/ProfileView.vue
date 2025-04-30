<template>
  <div class="row">
    <div class="col-md-4">
      <h2>個人資料</h2>
      <Message v-if="updateSuccess" variant="success">資料已更新</Message>
      <Message v-if="error" variant="danger">{{ error }}</Message>
      <form @submit.prevent="submitHandler">
        <div class="mb-3">
          <label for="name" class="form-label">姓名</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">電子郵件</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="留空表示不變更"
          />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">確認密碼</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="留空表示不變更"
          />
        </div>
        <Message v-if="passwordError" variant="danger">
          {{ passwordError }}
        </Message>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          更新
        </button>
      </form>
    </div>
    <div class="col-md-8">
      <h2>我的訂單</h2>
      <div v-if="ordersLoading">
        <Loader />
      </div>
      <Message v-else-if="ordersError" variant="danger">{{ ordersError }}</Message>
      <div v-else-if="orders.length === 0">
        <Message variant="info">您還沒有訂單</Message>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>日期</th>
              <th>總金額</th>
              <th>付款</th>
              <th>發貨</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ order._id }}</td>
              <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td>NT${{ order.totalPrice }}</td>
              <td>
                <i
                  :class="order.isPaid ? 'fas fa-check text-success' : 'fas fa-times text-danger'"
                ></i>
                {{ order.isPaid ? new Date(order.paidAt).toLocaleDateString() : '' }}
              </td>
              <td>
                <i
                  :class="
                    order.isDelivered ? 'fas fa-check text-success' : 'fas fa-times text-danger'
                  "
                ></i>
                {{ order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : '' }}
              </td>
              <td>
                <router-link :to="`/order/${order._id}`" class="btn btn-sm btn-light">
                  詳情
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { listMyOrders } from '@/api/orderApi'
import Message from '@/components/Message.vue'
import Loader from '@/components/Loader.vue'

export default {
  name: 'ProfileView',
  components: { Message, Loader },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 個人資料表單
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const passwordError = ref('')
    const updateSuccess = ref(false)

    // 訂單相關
    const orders = ref([])
    const ordersLoading = ref(false)
    const ordersError = ref(null)

    const error = computed(() => userStore.error)
    const loading = computed(() => userStore.loading)
    const userInfo = computed(() => userStore.userInfo)

    // 初始化用戶數據
    const initializeUserData = () => {
      if (userInfo.value) {
        name.value = userInfo.value.name
        email.value = userInfo.value.email
      }
    }

    // 獲取我的訂單
    const fetchMyOrders = async () => {
      try {
        ordersLoading.value = true
        ordersError.value = null
        orders.value = await listMyOrders()
      } catch (err) {
        ordersError.value = err.message
      } finally {
        ordersLoading.value = false
      }
    }

    const submitHandler = async () => {
      // 檢查密碼是否匹配
      if (password.value && password.value !== confirmPassword.value) {
        passwordError.value = '密碼不匹配!'
        return
      }
      
      passwordError.value = ''
      updateSuccess.value = false
      
      // 更新個人資料
      const userData = {
        name: name.value,
        email: email.value
      }
      
      if (password.value) {
        userData.password = password.value
      }
      
      await userStore.updateProfile(userData)
      
      if (!error.value) {
        updateSuccess.value = true
        password.value = ''
        confirmPassword.value = ''
      }
    }

    // 如果未登入，重定向到登入頁面
    onMounted(() => {
      if (!userInfo.value) {
        router.push('/login?redirect=profile')
      } else {
        initializeUserData()
        fetchMyOrders()
      }
    })

    return {
      name,
      email,
      password,
      confirmPassword,
      passwordError,
      updateSuccess,
      error,
      loading,
      orders,
      ordersLoading,
      ordersError,
      submitHandler
    }
  }
}
</script>