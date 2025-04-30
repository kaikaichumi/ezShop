<template>
  <div>
    <h1 class="my-3">最新商品</h1>
    <div v-if="loading">
      <Loader />
    </div>
    <Message v-else-if="error" variant="danger">{{ error }}</Message>
    <div v-else>
      <div class="row">
        <div v-for="product in products" :key="product._id" class="col-md-4 col-sm-6 col-lg-3 mb-4">
          <ProductCard :product="product" />
        </div>
      </div>
      <!-- 分頁 -->
      <div v-if="pages > 1" class="d-flex justify-content-center my-4">
        <ul class="pagination">
          <li v-for="i in pages" :key="i" class="page-item" :class="{ active: i === page }">
            <router-link
              class="page-link"
              :to="keyword ? `/search/${keyword}/page/${i}` : `/page/${i}`"
            >
              {{ i }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProducts } from '@/api/productApi'
import ProductCard from '@/components/ProductCard.vue'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'HomeView',
  components: { ProductCard, Loader, Message },
  setup() {
    const products = ref([])
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const pages = ref(1)
    const route = useRoute()

    const keyword = computed(() => route.params.keyword || '')
    const pageNumber = computed(() => route.params.pageNumber || 1)

    const fetchProducts = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await getProducts(keyword.value, pageNumber.value)
        products.value = data.products
        page.value = data.page
        pages.value = data.pages
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      page,
      pages,
      keyword
    }
  }
}
</script>