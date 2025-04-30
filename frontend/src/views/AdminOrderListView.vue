<template>
  <div>
    <h1>訂單</h1>
    <div v-if="loading">
      <Loader />
    </div>
    <Message v-else-if="error" variant="danger">{{ error }}</Message>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶</th>
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
            <td>{{ order.user && order.user.name }}</td>
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
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { listOrders } from '@/api/orderApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'AdminOrderListView',
  components: { Loader, Message },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const orders = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userInfo = computed(() => userStore.userInfo)

    const fetchOrders = async () => {
      try {
        loading.value = true
        error.value = null
        orders.value = await listOrders()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (!userInfo.value || !userInfo.value.isAdmin) {
        router.push('/login')
        return
      }
      
      fetchOrders()
    })

    return {
      orders,
      loading,
      error
    }
  }
}
</script>