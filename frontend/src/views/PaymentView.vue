<template>
  <div class="form-container">
    <CheckoutSteps :step1="true" :step2="true" />
    <h1 class="my-3">付款方式</h1>
    <form @submit.prevent="submitHandler">
      <div class="mb-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="paymentMethod"
            id="creditCard"
            value="信用卡"
            v-model="paymentMethod"
            required
          />
          <label class="form-check-label" for="creditCard">
            信用卡
          </label>
        </div>
      </div>
      <div class="mb-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="paymentMethod"
            id="linePay"
            value="Line Pay"
            v-model="paymentMethod"
          />
          <label class="form-check-label" for="linePay">
            Line Pay
          </label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">
        繼續
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import CheckoutSteps from '@/components/CheckoutSteps.vue'

export default {
  name: 'PaymentView',
  components: { CheckoutSteps },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    const paymentMethod = ref('信用卡')

    onMounted(() => {
      if (!userStore.userInfo) {
        router.push('/login?redirect=payment')
        return
      }
      
      if (!cartStore.shippingAddress.address) {
        router.push('/shipping')
        return
      }
      
      // 如果已有付款方式，則填充
      if (cartStore.paymentMethod) {
        paymentMethod.value = cartStore.paymentMethod
      }
    })

    const submitHandler = () => {
      cartStore.savePaymentMethod(paymentMethod.value)
      router.push('/placeorder')
    }

    return {
      paymentMethod,
      submitHandler
    }
  }
}
</script>