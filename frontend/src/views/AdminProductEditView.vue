<template>
  <div>
    <button class="btn btn-light my-3" @click="$router.go(-1)">返回</button>
    <div class="form-container">
      <h1>編輯產品</h1>
      <div v-if="loading">
        <Loader />
      </div>
      <Message v-else-if="error" variant="danger">{{ error }}</Message>
      <Message v-if="updateSuccess" variant="success">產品已更新</Message>
      <form v-if="!loading" @submit.prevent="submitHandler">
        <div class="mb-3">
          <label for="name" class="form-label">名稱</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">價格</label>
          <input
            type="number"
            class="form-control"
            id="price"
            v-model="price"
            required
          />
        </div>
        <div class="mb-3">
          <label for="image" class="form-label">圖片URL</label>
          <input
            type="text"
            class="form-control"
            id="image"
            v-model="image"
            required
          />
        </div>
        <div class="mb-3">
          <label for="brand" class="form-label">品牌</label>
          <input
            type="text"
            class="form-control"
            id="brand"
            v-model="brand"
            required
          />
        </div>
        <div class="mb-3">
          <label for="countInStock" class="form-label">庫存數量</label>
          <input
            type="number"
            class="form-control"
            id="countInStock"
            v-model="countInStock"
            required
          />
        </div>
        <div class="mb-3">
          <label for="category" class="form-label">分類</label>
          <input
            type="text"
            class="form-control"
            id="category"
            v-model="category"
            required
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">描述</label>
          <textarea
            class="form-control"
            id="description"
            rows="3"
            v-model="description"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">更新</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getProductDetails, updateProduct } from '@/api/productApi'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'AdminProductEditView',
  components: { Loader, Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const name = ref('')
    const price = ref(0)
    const image = ref('')
    const brand = ref('')
    const category = ref('')
    const countInStock = ref(0)
    const description = ref('')
    const loading = ref(false)
    const error = ref(null)
    const updateSuccess = ref(false)

    const userInfo = computed(() => userStore.userInfo)

    const fetchProductDetails = async () => {
      try {
        loading.value = true
        error.value = null
        
        // 檢查ID是否有效
        const productId = route.params.id
        if (!productId || productId === 'undefined' || productId === 'null') {
          throw new Error('無效的產品ID')
        }
        
        // 確保 ID 是字符串形式
        const id = String(productId)
        console.log('嘗試獲取產品詳情:')
        console.log('- 原始 ID:', productId, '類型:', typeof productId)
        console.log('- 轉換後 ID:', id, '類型:', typeof id)
        
        const product = await getProductDetails(id)
        
        if (!product) {
          throw new Error('無法獲取產品詳情')
        }
        
        console.log('獲取到產品詳情:', product)
        name.value = product.name || ''
        price.value = product.price || 0
        image.value = product.image || ''
        brand.value = product.brand || ''
        category.value = product.category || ''
        countInStock.value = product.countInStock || 0
        description.value = product.description || ''
      } catch (err) {
        error.value = err.message
        console.error('獲取產品詳情錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    const submitHandler = async () => {
      try {
        loading.value = true
        error.value = null
        updateSuccess.value = false
        
        // 檢查ID是否有效
        const productId = route.params.id
        if (!productId || productId === 'undefined' || productId === 'null') {
          throw new Error('無效的產品ID')
        }
        
        // 確保 ID 是字符串形式
        const id = String(productId)
        console.log('嘗試更新產品:')
        console.log('- 原始 ID:', productId, '類型:', typeof productId)
        console.log('- 轉換後 ID:', id, '類型:', typeof id)
        
        const updatedProduct = {
          _id: id,  // 使用轉換後的ID
          id: id,   // 同時提供 id 字段
          name: name.value,
          price: Number(price.value),
          image: image.value,
          brand: brand.value,
          category: category.value,
          countInStock: Number(countInStock.value),
          description: description.value
        }
        
        console.log('更新產品數據:', updatedProduct)
        const result = await updateProduct(updatedProduct)
        console.log('更新產品結果:', result)
        updateSuccess.value = true
      } catch (err) {
        error.value = err.message
        console.error('更新產品錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (!userInfo.value || !userInfo.value.isAdmin) {
        router.push('/login')
        return
      }
      
      fetchProductDetails()
    })

    return {
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
      loading,
      error,
      updateSuccess,
      submitHandler
    }
  }
}
</script>