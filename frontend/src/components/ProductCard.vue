<template>
  <div class="card product-card">
    <router-link :to="'/product/' + product._id">
      <img :src="product.image" class="card-img-top" :alt="product.name" />
    </router-link>
    <div class="card-body">
      <router-link :to="'/product/' + product._id" class="text-decoration-none">
        <h5 class="card-title product-title">{{ product.name }}</h5>
      </router-link>
      <div class="mb-2">
        <Rating :value="product.rating" :text="`${product.numReviews} 評價`" />
      </div>
      <h3 class="card-text">NT${{ product.price }}</h3>
    </div>
  </div>
</template>

<script>
import Rating from './Rating.vue'

export default {
  name: 'ProductCard',
  components: {
    Rating
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>