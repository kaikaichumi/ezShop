<template>
  <div v-if="loading">
    <Loader />
  </div>
  <Message v-else-if="error" variant="danger">{{ error }}</Message>
  <div v-else>
    <h1 class="mb-4">訂單 #{{ order._id }}</h1>
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h2>配送</h2>
            <p>
              <strong>姓名: </strong>
              {{ order.user.name }}
            </p>
            <p>
              <strong>電子郵件: </strong>
              <a :href="`mailto:${order.user.email}`">{{ order.user.email }}</a>
            </p>
            <p>
              <strong>地址: </strong>
              {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }},
              {{ order.shippingAddress.postalCode }}, {{ order.shippingAddress.country }}
            </p>
            <div v-if="order.isDelivered">
              <Message variant="success">
                已於 {{ new Date(order.deliveredAt).toLocaleString() }} 發貨
              </Message>
            </div>
            <div v-else>
              <Message variant="danger">尚未發貨</Message>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h2>付款方式</h2>
            <p>
              <strong>方法: </strong>
              {{ order.paymentMethod }}
            </p>
            <div v-if="order.isPaid">
              <Message variant="success">
                已於 {{ new Date(order.paidAt).toLocaleString() }} 付款
              </Message>
            </div>
            <div v-else>
              <Message variant="danger">尚未付款</Message>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h2>訂單項目</h2>
            <div class="list-group list-group-flush">
              <div
                v-for="item in order.orderItems"
                :key="item.product"
                class="list-group-item"
              >
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img :src="item.image" :alt="item.name" class="img-fluid rounded" />
                  </div>
                  <div class="col-md-6">
                    <router-link :to="`/product/${item.product}`">
                      {{ item.name }}
                    </router-link>
                  </div>
                  <div class="col-md-4">
                    {{ item.qty }} x NT${{ item.price }} = NT${{ item.qty * item.price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h2>訂單摘要</h2>
            <div class="list-group list-group-flush">
              <div class="list-group-item d-flex justify-content-between">
                <span>商品</span>
                <span>NT${{ order.itemsPrice }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>運費</span>
                <span>NT${{ order.shippingPrice }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>稅金</span>
                <span>NT${{ order.taxPrice }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>總計</span>
                <span>NT${{ order.totalPrice }}</span>
              </div>

              <!-- 付款按鈕 -->
              <div v-if="!order.isPaid" class="list-group-item">
                <div v-if="payLoading">
                  <Loader />
                </div>
                <div v-else>
                  <button 
                    class="btn btn-primary w-100" 
                    @click="handlePayment"
                  >
                    模擬付款
                  </button>
                </div>
              </div>

              <!-- 管理員用發貨按鈕 -->
              <div
                v-if="userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered"
                class="list-group-item"
              >
                <div v-if="deliverLoading">
                  <Loader />
                </div>
                <div v-else>
                  <button class="btn btn-primary w-100" @click="handleDeliver">
                    標記為已發貨
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getOrderDetails, payOrder, deliverOrder } from '@/api/orderApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'OrderView',
  components: { Loader, Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const order = ref({
      orderItems: [],
      shippingAddress: {},
      user: {}
    })
    const loading = ref(true)
    const error = ref(null)
    const payLoading = ref(false)
    const deliverLoading = ref(false)

    const userInfo = computed(() => userStore.userInfo)

    const fetchOrderDetails = async () => {
      try {
        loading.value = true
        error.value = null
        order.value = await getOrderDetails(route.params.id)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const handlePayment = async () => {
      try {
        payLoading.value = true
        
        // 模擬付款結果
        const paymentResult = {
          id: Date.now().toString(),
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          payer: {
            email_address: userInfo.value.email
          }
        }
        
        await payOrder(order.value._id, paymentResult)
        
        // 重新獲取訂單詳情以更新狀態
        await fetchOrderDetails()
      } catch (err) {
        error.value = err.message
      } finally {
        payLoading.value = false
      }
    }

    const handleDeliver = async () => {
      try {
        deliverLoading.value = true
        await deliverOrder(order.value._id)
        
        // 重新獲取訂單詳情以更新狀態
        await fetchOrderDetails()
      } catch (err) {
        error.value = err.message
      } finally {
        deliverLoading.value = false
      }
    }

    onMounted(() => {
      if (!userInfo.value) {
        router.push('/login')
        return
      }
      
      fetchOrderDetails()
    })

    return {
      order,
      loading,
      error,
      payLoading,
      deliverLoading,
      userInfo,
      handlePayment,
      handleDeliver
    }
  }
}
</script>