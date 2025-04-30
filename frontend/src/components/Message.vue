<template>
  <div class="alert" :class="'alert-' + variant" role="alert">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    variant: {
      type: String,
      default: 'info'
    }
  }
}
</script>