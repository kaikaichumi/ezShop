<template>
  <div>
    <CheckoutSteps :step1="true" :step2="true" :step3="true" />
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h2>配送</h2>
            <p>
              <strong>地址: </strong>
              {{ shippingAddress.address }}, {{ shippingAddress.city }},
              {{ shippingAddress.postalCode }}, {{ shippingAddress.country }}
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h2>付款方式</h2>
            <p>
              <strong>方法: </strong>
              {{ paymentMethod }}
            </p>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h2>訂單項目</h2>
            <div v-if="cartItems.length === 0">
              <Message variant="info">您的購物車是空的</Message>
            </div>
            <div v-else>
              <div class="list-group list-group-flush">
                <div
                  v-for="item in cartItems"
                  :key="item.product"
                  class="list-group-item"
                >
                  <div class="row align-items-center">
                    <div class="col-md-2">
                      <img
                        :src="item.image"
                        :alt="item.name"
                        class="img-fluid rounded"
                      />
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
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h2>訂單摘要</h2>
            <div class="list-group list-group-flush">
              <div class="list-group-item d-flex justify-content-between">
                <span>商品</span>
                <span>NT${{ cartTotal }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>運費</span>
                <span>NT${{ shippingAmount }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>稅金</span>
                <span>NT${{ taxAmount }}</span>
              </div>
              <div class="list-group-item d-flex justify-content-between">
                <span>總計</span>
                <span>NT${{ totalAmount }}</span>
              </div>
              <div class="list-group-item">
                <Message v-if="error" variant="danger">{{ error }}</Message>
              </div>
              <div class="list-group-item">
                <button
                  type="button"
                  class="btn btn-primary w-100"
                  :disabled="cartItems.length === 0 || loading"
                  @click="placeOrderHandler"
                >
                  確認訂單
                </button>
                <div v-if="loading" class="d-flex justify-content-center mt-2">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
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
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { createOrder } from '@/api/orderApi'
import CheckoutSteps from '@/components/CheckoutSteps.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'PlaceOrderView',
  components: { CheckoutSteps, Message },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    const loading = ref(false)
    const error = ref(null)

    const cartItems = computed(() => cartStore.cartItems)
    const shippingAddress = computed(() => cartStore.shippingAddress)
    const paymentMethod = computed(() => cartStore.paymentMethod)
    const cartTotal = computed(() => cartStore.cartTotal)
    const taxAmount = computed(() => cartStore.taxAmount)
    const shippingAmount = computed(() => cartStore.shippingAmount)
    const totalAmount = computed(() => cartStore.totalAmount)

    onMounted(() => {
      if (!userStore.userInfo) {
        router.push('/login?redirect=placeorder')
        return
      }
      
      if (!cartStore.shippingAddress.address) {
        router.push('/shipping')
        return
      }
      
      if (!cartStore.paymentMethod) {
        router.push('/payment')
      }
    })

    const placeOrderHandler = async () => {
      try {
        loading.value = true
        error.value = null
        
        const orderData = {
          orderItems: cartItems.value,
          shippingAddress: shippingAddress.value,
          paymentMethod: paymentMethod.value,
          itemsPrice: cartTotal.value,
          taxPrice: taxAmount.value,
          shippingPrice: shippingAmount.value,
          totalPrice: totalAmount.value
        }
        
        const order = await createOrder(orderData)
        
        // 清空購物車並導航到訂單頁面
        cartStore.clearCartItems()
        router.push(`/order/${order._id}`)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      cartItems,
      shippingAddress,
      paymentMethod,
      cartTotal,
      taxAmount,
      shippingAmount,
      totalAmount,
      loading,
      error,
      placeOrderHandler
    }
  }
}
</script>