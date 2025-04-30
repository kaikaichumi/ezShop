<template>
  <div>
    <div class="row align-items-center">
      <div class="col">
        <h1>產品</h1>
      </div>
      <div class="col text-end">
        <button class="btn btn-primary" @click="createProductHandler">
          <i class="fas fa-plus"></i> 新增產品
        </button>
      </div>
    </div>

    <div v-if="loading">
      <Loader />
    </div>
    <Message v-else-if="error" variant="danger">{{ error }}</Message>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>價格</th>
            <th>分類</th>
            <th>品牌</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id || product.id">
          <td>{{ product._id || product.id }}</td>
          <td>{{ product.name }}</td>
          <td>NT${{ product.price }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.brand }}</td>
          <td>
          <router-link
          :to="`/admin/product/${product._id || product.id}/edit`"
          class="btn btn-sm btn-light me-2"
          >
          <i class="fas fa-edit"></i>
          </router-link>
          <button
          class="btn btn-sm btn-danger"
          @click="deleteHandler(product._id || product.id)"
          >
          <i class="fas fa-trash"></i>
          </button>
          </td>
          </tr>
        </tbody>
      </table>
      <!-- 分頁 -->
      <div v-if="pages > 1" class="d-flex justify-content-center my-4">
        <ul class="pagination">
          <li v-for="i in pages" :key="i" class="page-item" :class="{ active: i === page }">
            <router-link class="page-link" :to="`/admin/productlist/${i}`">
              {{ i }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getProducts, deleteProduct, createProduct } from '@/api/productApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'AdminProductListView',
  components: { Loader, Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const products = ref([])
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const pages = ref(1)
    const userInfo = computed(() => userStore.userInfo)

    const fetchProducts = async () => {
      try {
        loading.value = true
        error.value = null
        const pageNumber = route.params.pageNumber || 1
        const data = await getProducts('', pageNumber)
        
        if (data && data.products) {
          // 確保每個產品都有 _id 欄位
          products.value = data.products.map(product => {
            if (product && product.id && !product._id) {
              return { ...product, _id: product.id }
            }
            return product
          })
          
          // 檢查產品資料
          if (products.value.length > 0) {
            console.log('產品列表資料:', products.value.length, '第一個產品 ID:', products.value[0]._id || products.value[0].id)
          } else {
            console.log('產品列表為空')
          }
        } else {
          products.value = []
          console.log('未獲取到產品資料')
        }
        
        page.value = data.page
        pages.value = data.pages
      } catch (err) {
        error.value = err.message
        console.error('獲取產品列表失敗:', err)
      } finally {
        loading.value = false
      }
    }

    const deleteHandler = async (id) => {
      if (confirm('確定要刪除此產品嗎？')) {
        try {
          loading.value = true
          error.value = null
          
          // 確保我們有有效的ID
          if (!id) {
            throw new Error('無效的產品ID')
          }
          
          // 確保 ID 是字符串形式
          const productId = String(id)
          console.log('嘗試刪除產品:')
          console.log('- 原始 ID:', id, '類型:', typeof id)
          console.log('- 轉換後 ID:', productId, '類型:', typeof productId)
          
          const result = await deleteProduct(productId)
          console.log('產品刪除結果:', result)
          
          if (result.success) {
            console.log('產品刪除成功，重新載入產品列表')
            // 重新獲取產品列表
            await fetchProducts()
          } else {
            throw new Error('刪除產品失敗')
          }
        } catch (err) {
          error.value = err.message
          console.error('刪除產品失敗:', err)
        } finally {
          loading.value = false
        }
      }
    }

    const createProductHandler = async () => {
      try {
        loading.value = true
        error.value = null
        const product = await createProduct()
        
        // 確保我們有有效的產品ID
        const productId = product._id || product.id
        
        if (productId) {
          console.log('成功創建產品，準備跳轉到編輯頁面，ID:', productId)
          router.push(`/admin/product/${productId}/edit`)
        } else {
          throw new Error('無法獲取產品ID，請重試')
        }
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (!userInfo.value || !userInfo.value.isAdmin) {
        router.push('/login')
        return
      }
      
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      page,
      pages,
      deleteHandler,
      createProductHandler
    }
  }
}
</script>