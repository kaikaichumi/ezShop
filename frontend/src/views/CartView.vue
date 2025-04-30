<template>
  <div>
    <h1 class="my-3">購物車</h1>
    <div v-if="cartItems.length === 0">
      <Message variant="info">
        購物車是空的 <router-link to="/">返回購物</router-link>
      </Message>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-3" v-for="item in cartItems" :key="item.product">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img :src="item.image" :alt="item.name" class="img-fluid rounded" />
                </div>
                <div class="col-md-3">
                  <router-link :to="`/product/${item.product}`">
                    {{ item.name }}
                  </router-link>
                </div>
                <div class="col-md-2">NT${{ item.price }}</div>
                <div class="col-md-2">
                  <select
                    v-model="item.qty"
                    class="form-select"
                    @change="updateCartHandler(item.product, Number(item.qty))"
                  >
                    <option
                      v-for="i in Math.min(item.countInStock, 10)"
                      :key="i"
                      :value="i"
                    >
                      {{ i }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="removeFromCartHandler(item.product)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h2>
                小計 ({{ itemsCount }} 個商品)
              </h2>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span>商品總額:</span>
                  <span>NT${{ cartTotal }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>運費:</span>
                  <span>NT${{ shippingAmount }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>稅金:</span>
                  <span>NT${{ taxAmount }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>總金額:</span>
                  <span>NT${{ totalAmount }}</span>
                </li>
                <li class="list-group-item">
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    :disabled="cartItems.length === 0"
                    @click="checkoutHandler"
                  >
                    前往結帳
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import Message from '@/components/Message.vue'

export default {
  name: 'CartView',
  components: { Message },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    const cartItems = computed(() => cartStore.cartItems)
    const itemsCount = computed(() => cartStore.itemsCount)
    const cartTotal = computed(() => cartStore.cartTotal)
    const taxAmount = computed(() => cartStore.taxAmount)
    const shippingAmount = computed(() => cartStore.shippingAmount)
    const totalAmount = computed(() => cartStore.totalAmount)

    const updateCartHandler = (id, qty) => {
      cartStore.addToCart(id, qty)
    }

    const removeFromCartHandler = (id) => {
      cartStore.removeFromCart(id)
    }

    const checkoutHandler = () => {
      if (userStore.userInfo) {
        router.push('/shipping')
      } else {
        router.push('/login?redirect=shipping')
      }
    }

    return {
      cartItems,
      itemsCount,
      cartTotal,
      taxAmount,
      shippingAmount,
      totalAmount,
      updateCartHandler,
      removeFromCartHandler,
      checkoutHandler
    }
  }
}
</script>