<template>
  <div>
    <button class="btn btn-light my-3" @click="$router.go(-1)">返回</button>
    <div v-if="loading">
      <Loader />
    </div>
    <Message v-else-if="error" variant="danger">{{ error }}</Message>
    <div v-else class="row">
      <div class="col-md-6">
        <img :src="product.image" :alt="product.name" class="img-fluid" />
      </div>
      <div class="col-md-3">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <h3>{{ product.name }}</h3>
          </li>
          <li class="list-group-item">
            <Rating
              :value="product.rating"
              :text="`${product.numReviews} 評價`"
            />
          </li>
          <li class="list-group-item">價格: NT${{ product.price }}</li>
          <li class="list-group-item">描述: {{ product.description }}</li>
        </ul>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <div class="row">
                  <div class="col">價格:</div>
                  <div class="col">
                    <strong>NT${{ product.price }}</strong>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col">庫存:</div>
                  <div class="col">
                    {{ product.countInStock > 0 ? '有庫存' : '無庫存' }}
                  </div>
                </div>
              </li>
              <li v-if="product.countInStock > 0" class="list-group-item">
                <div class="row">
                  <div class="col">數量:</div>
                  <div class="col">
                    <select v-model="qty" class="form-select">
                      <option
                        v-for="i in Math.min(product.countInStock, 10)"
                        :key="i"
                        :value="i"
                      >
                        {{ i }}
                      </option>
                    </select>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <button
                  class="btn btn-primary w-100"
                  :disabled="product.countInStock === 0"
                  @click="addToCartHandler"
                >
                  加入購物車
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 評論區塊 -->
      <div class="row mt-4">
        <div class="col-md-6">
          <h2>評論</h2>
          <Message v-if="product.reviews.length === 0" variant="info">
            暫無評論
          </Message>
          <div v-else>
            <ul class="list-group list-group-flush">
              <li
                v-for="review in product.reviews"
                :key="review._id"
                class="list-group-item"
              >
                <strong>{{ review.name }}</strong>
                <Rating :value="review.rating" />
                <p>{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                <p>{{ review.comment }}</p>
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <h2>撰寫評論</h2>
            <Message v-if="!userInfo" variant="info">
              請 <router-link to="/login">登入</router-link> 以撰寫評論
            </Message>
            <div v-else>
              <Message v-if="reviewError" variant="danger">
                {{ reviewError }}
              </Message>
              <Message v-if="reviewSuccess" variant="success">
                評論已送出!
              </Message>
              <form v-if="!reviewSuccess" @submit.prevent="submitReview">
                <div class="my-3">
                  <label for="rating">評分</label>
                  <select
                    id="rating"
                    v-model="rating"
                    class="form-select"
                    required
                  >
                    <option value="">選擇...</option>
                    <option value="1">1 - 非常差</option>
                    <option value="2">2 - 差</option>
                    <option value="3">3 - 普通</option>
                    <option value="4">4 - 好</option>
                    <option value="5">5 - 非常好</option>
                  </select>
                </div>
                <div class="my-3">
                  <label for="comment">評論</label>
                  <textarea
                    id="comment"
                    v-model="comment"
                    class="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="reviewLoading"
                >
                  送出
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { getProductDetails, createProductReview } from '@/api/productApi'
import Rating from '@/components/Rating.vue'
import Loader from '@/components/Loader.vue'
import Message from '@/components/Message.vue'

export default {
  name: 'ProductView',
  components: { Rating, Loader, Message },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    const product = ref({
      reviews: []
    })
    const loading = ref(false)
    const error = ref(null)
    const qty = ref(1)
    const rating = ref('')
    const comment = ref('')
    const reviewLoading = ref(false)
    const reviewError = ref(null)
    const reviewSuccess = ref(false)

    const userInfo = computed(() => userStore.userInfo)

    const fetchProductDetails = async () => {
      try {
        loading.value = true
        error.value = null
        product.value = await getProductDetails(route.params.id)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const addToCartHandler = () => {
      cartStore.addToCart(route.params.id, qty.value)
      router.push('/cart')
    }

    const submitReview = async () => {
      try {
        reviewLoading.value = true
        reviewError.value = null
        await createProductReview(route.params.id, {
          rating: Number(rating.value),
          comment: comment.value
        })
        reviewSuccess.value = true
        rating.value = ''
        comment.value = ''
        // 重新獲取產品詳情以更新評論
        await fetchProductDetails()
      } catch (err) {
        reviewError.value = err.message
      } finally {
        reviewLoading.value = false
      }
    }

    onMounted(() => {
      fetchProductDetails()
    })

    return {
      product,
      loading,
      error,
      qty,
      rating,
      comment,
      reviewLoading,
      reviewError,
      reviewSuccess,
      userInfo,
      addToCartHandler,
      submitReview
    }
  }
}
</script>