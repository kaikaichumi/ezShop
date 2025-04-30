<template>
  <div class="form-container">
    <CheckoutSteps :step1="true" />
    <h1 class="my-3">配送地址</h1>
    <form @submit.prevent="submitHandler">
      <div class="mb-3">
        <label for="address" class="form-label">地址</label>
        <input
          type="text"
          class="form-control"
          id="address"
          v-model="address"
          required
        />
      </div>
      <div class="mb-3">
        <label for="city" class="form-label">城市</label>
        <input
          type="text"
          class="form-control"
          id="city"
          v-model="city"
          required
        />
      </div>
      <div class="mb-3">
        <label for="postalCode" class="form-label">郵遞區號</label>
        <input
          type="text"
          class="form-control"
          id="postalCode"
          v-model="postalCode"
          required
        />
      </div>
      <div class="mb-3">
        <label for="country" class="form-label">國家</label>
        <input
          type="text"
          class="form-control"
          id="country"
          v-model="country"
          required
        />
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
  name: 'ShippingView',
  components: { CheckoutSteps },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    const address = ref('')
    const city = ref('')
    const postalCode = ref('')
    const country = ref('')

    // 如果已有配送地址，則填充
    onMounted(() => {
      if (!userStore.userInfo) {
        router.push('/login?redirect=shipping')
      }
      
      if (cartStore.shippingAddress) {
        address.value = cartStore.shippingAddress.address || ''
        city.value = cartStore.shippingAddress.city || ''
        postalCode.value = cartStore.shippingAddress.postalCode || ''
        country.value = cartStore.shippingAddress.country || ''
      }
    })

    const submitHandler = () => {
      cartStore.saveShippingAddress({
        address: address.value,
        city: city.value,
        postalCode: postalCode.value,
        country: country.value
      })
      router.push('/payment')
    }

    return {
      address,
      city,
      postalCode,
      country,
      submitHandler
    }
  }
}
</script>