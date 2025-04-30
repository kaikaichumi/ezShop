<template>
  <div class="rating">
    <span v-for="i in 5" :key="i">
      <i
        :class="
          value >= i
            ? 'fas fa-star'
            : value >= i - 0.5
            ? 'fas fa-star-half-alt'
            : 'far fa-star'
        "
        :style="{ color }"
      ></i>
    </span>
    <span v-if="text" class="ms-2">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    value: {
      type: Number,
      default: 0
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#f8e825'
    }
  }
}
</script>