<template>
  <ul class="checkout-steps">
    <li :class="{ active: step1 }">
      <router-link v-if="step1" to="/shipping">配送</router-link>
      <span v-else>配送</span>
    </li>
    <li :class="{ active: step2 }">
      <router-link v-if="step2" to="/payment">付款</router-link>
      <span v-else>付款</span>
    </li>
    <li :class="{ active: step3 }">
      <router-link v-if="step3" to="/placeorder">訂單</router-link>
      <span v-else>訂單</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CheckoutSteps',
  props: {
    step1: {
      type: Boolean,
      default: false
    },
    step2: {
      type: Boolean,
      default: false
    },
    step3: {
      type: Boolean,
      default: false
    }
  }
}
</script>