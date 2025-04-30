<template>
  <div class="app">
    <Header />
    <main class="py-3">
      <div class="container">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
/* 全局樣式可以在此添加 */
</style>